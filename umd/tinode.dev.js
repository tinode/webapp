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
exports.default = void 0;
class CommError extends Error {
  constructor(message, code) {
    super(`${message} (${code})`);
    this.name = 'CommError';
    this.code = code;
  }
}
exports.default = CommError;

},{}],4:[function(require,module,exports){
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

},{"../version.json":13}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _commError = _interopRequireDefault(require("./comm-error.js"));
var _utils = require("./utils.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
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
        throw new _commError.default("LP sender failed", sender.status);
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
            const code = poller.status || (_classPrivateFieldGet(this, _boffClosed) ? NETWORK_USER : NETWORK_ERROR);
            const text = poller.responseText || (_classPrivateFieldGet(this, _boffClosed) ? NETWORK_USER_TEXT : NETWORK_ERROR_TEXT);
            this.onDisconnect(new _commError.default(text, code), code);
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
      this.onDisconnect(new _commError.default(NETWORK_USER_TEXT, NETWORK_USER), NETWORK_USER);
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
          this.onDisconnect(new _commError.default(_classPrivateFieldGet(this, _boffClosed) ? NETWORK_USER_TEXT : NETWORK_ERROR_TEXT, code), code);
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

},{"./comm-error.js":3,"./utils.js":12}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _commError = _interopRequireDefault(require("./comm-error.js"));
var _utils = require("./utils.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
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
          instance.toReject(new _commError.default(pkt.ctrl.text, pkt.ctrl.code));
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
        instance.toReject(e || new Error("failed"));
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
            instance.toReject(new _commError.default(pkt.ctrl.text, pkt.ctrl.code));
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

},{"./comm-error.js":3,"./utils.js":12}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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
var _commError = _interopRequireDefault(require("./comm-error.js"));
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
      pkt.acc.tmpscheme = params.scheme;
      pkt.acc.tmpsecret = params.secret;
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
    this.logger('oob: ' + (this._trimLongStrings ? JSON.stringify(data, jsonLoggerHelper) : data));
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
        const mode = {
          given: data.modeGiven,
          want: data.modeWant
        };
        const acs = new _accessMode.default(mode);
        const pres = !acs.mode || acs.mode == _accessMode.default._NONE ? {
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
      callbacks.reject(new _commError.default(errorText, code));
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
      const err = new _commError.default("timeout", 504);
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

},{"./access-mode.js":1,"./comm-error.js":3,"./config.js":4,"./connection.js":5,"./db.js":6,"./drafty.js":7,"./large-file.js":8,"./meta-builder.js":9,"./topic.js":11,"./utils.js":12}],11:[function(require,module,exports){
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

},{"./access-mode.js":1,"./cbuffer.js":2,"./config.js":4,"./drafty.js":7,"./meta-builder.js":9,"./utils.js":12}],12:[function(require,module,exports){
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

},{"./access-mode.js":1,"./config.js":4}],13:[function(require,module,exports){
module.exports={"version": "0.21.0-rc2"}

},{}]},{},[10])(10)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYWNjZXNzLW1vZGUuanMiLCJzcmMvY2J1ZmZlci5qcyIsInNyYy9jb21tLWVycm9yLmpzIiwic3JjL2NvbmZpZy5qcyIsInNyYy9jb25uZWN0aW9uLmpzIiwic3JjL2RiLmpzIiwic3JjL2RyYWZ0eS5qcyIsInNyYy9sYXJnZS1maWxlLmpzIiwic3JjL21ldGEtYnVpbGRlci5qcyIsInNyYy90aW5vZGUuanMiLCJzcmMvdG9waWMuanMiLCJzcmMvdXRpbHMuanMiLCJ2ZXJzaW9uLmpzb24iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNLQSxZQUFZO0FBQUM7RUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBY0UsTUFBTSxVQUFVLENBQUM7RUFDOUIsV0FBVyxDQUFDLEdBQUcsRUFBRTtJQUNmLElBQUksR0FBRyxFQUFFO01BQ1AsSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLEdBQUcsQ0FBQyxLQUFLLElBQUksUUFBUSxHQUFHLEdBQUcsQ0FBQyxLQUFLLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO01BQ3BGLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxHQUFHLENBQUMsSUFBSSxJQUFJLFFBQVEsR0FBRyxHQUFHLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQztNQUNoRixJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLEdBQUksT0FBTyxHQUFHLENBQUMsSUFBSSxJQUFJLFFBQVEsR0FBRyxHQUFHLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUN6RixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFLO0lBQzVCO0VBQ0Y7RUFpQkEsT0FBTyxNQUFNLENBQUMsR0FBRyxFQUFFO0lBQ2pCLElBQUks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QUk7VUFDakIsV0FBVyxFQUFFLElBQUk7VUFDakIsT0FBTyxFQUFFLEtBQUs7VUFDZCxNQUFNLEVBQUUsSUFBSTtVQUNaLE1BQU0sRUFBRSxDQUFDLENBQUM7VUFDVixNQUFNLEVBQUUsQ0FBQztRQUNYO01BQ0YsQ0FBQztJQUVILEtBQUssT0FBTztNQUNWLE9BQU87UUFDTCxPQUFPLEVBQUU7VUFDUCxJQUFJLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRTtVQUM1QixRQUFRLEVBQUUsSUFBSTtVQUNkLFFBQVEsRUFBRTtRQUNaO01BQ0YsQ0FBQztJQUVILEtBQUssS0FBSztNQUNSLE9BQU87UUFDTCxLQUFLLEVBQUU7VUFDTCxJQUFJLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRTtVQUM1QixPQUFPLEVBQUUsS0FBSztVQUNkLEtBQUssRUFBRSxDQUFDLENBQUM7VUFDVCxLQUFLLEVBQUUsQ0FBQztRQUNWO01BQ0YsQ0FBQztJQUVILEtBQUssT0FBTztNQUNWLE9BQU87UUFDTCxPQUFPLEVBQUU7VUFDUCxJQUFJLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRTtVQUM1QixPQUFPLEVBQUUsS0FBSztVQUNkLE9BQU8sRUFBRTtRQUNYO01BQ0YsQ0FBQztJQUVILEtBQUssS0FBSztNQUNSLE9BQU87UUFDTCxLQUFLLEVBQUU7VUFDTCxJQUFJLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRTtVQUM1QixPQUFPLEVBQUUsS0FBSztVQUNkLFFBQVEsRUFBRSxLQUFLO1VBQ2YsTUFBTSxFQUFFLElBQUk7VUFDWixTQUFTLEVBQUUsQ0FBQztRQUNkO01BQ0YsQ0FBQztJQUVILEtBQUssS0FBSztNQUNSLE9BQU87UUFDTCxLQUFLLEVBQUU7VUFDTCxJQUFJLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRTtVQUM1QixPQUFPLEVBQUUsS0FBSztVQUNkLE1BQU0sRUFBRSxJQUFJO1VBQ1osTUFBTSxFQUFFLENBQUMsQ0FBQztVQUNWLEtBQUssRUFBRSxDQUFDLENBQUM7VUFDVCxNQUFNLEVBQUUsQ0FBQztRQUNYO01BQ0YsQ0FBQztJQUVILEtBQUssS0FBSztNQUNSLE9BQU87UUFDTCxLQUFLLEVBQUU7VUFDTCxJQUFJLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRTtVQUM1QixPQUFPLEVBQUUsS0FBSztVQUNkLE1BQU0sRUFBRSxDQUFDLENBQUM7VUFDVixLQUFLLEVBQUUsQ0FBQyxDQUFDO1VBQ1QsTUFBTSxFQUFFLEVBQUU7VUFDVixXQUFXLEVBQUUsQ0FBQztRQUNoQjtNQUNGLENBQUM7SUFFSCxLQUFLLEtBQUs7TUFDUixPQUFPO1FBQ0wsS0FBSyxFQUFFO1VBQ0wsSUFBSSxFQUFFLElBQUksQ0FBQyxlQUFlLEVBQUU7VUFDNUIsT0FBTyxFQUFFLEtBQUs7VUFDZCxNQUFNLEVBQUUsSUFBSTtVQUNaLFFBQVEsRUFBRSxJQUFJO1VBQ2QsTUFBTSxFQUFFLElBQUk7VUFDWixNQUFNLEVBQUU7UUFDVjtNQUNGLENBQUM7SUFFSCxLQUFLLE1BQU07TUFDVCxPQUFPO1FBQ0wsTUFBTSxFQUFFO1VBRU4sT0FBTyxFQUFFLEtBQUs7VUFDZCxNQUFNLEVBQUUsSUFBSTtVQUNaLEtBQUssRUFBRTtRQUNUO01BQ0YsQ0FBQztJQUVIO01BQ0UsTUFBTSxJQUFJLEtBQUssQ0FBRSxrQ0FBaUMsSUFBSyxFQUFDLENBQUM7RUFBQztBQUVoRTtBQUFDLG9CQUdTLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFO0VBQ3pCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHO0FBQ3RDO0FBQUMsb0JBQ1MsSUFBSSxFQUFFLElBQUksRUFBRTtFQUNwQixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUM7QUFDdkM7QUFBQyxvQkFDUyxJQUFJLEVBQUUsSUFBSSxFQUFFO0VBQ3BCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQztBQUN2QztBQUFDLG9CQUlTLElBQUksRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFO0VBQzdCLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxJQUFJLEdBQUcsR0FBRyxHQUFHLFNBQVM7RUFDekMsS0FBSyxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO0lBQzNCLElBQUksQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUU7TUFDakMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFO1FBQzdDO01BQ0Y7SUFDRjtFQUNGO0FBQ0Y7QUFBQyw4QkFJbUIsS0FBSyxFQUFFO0VBQ3pCLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSTtFQUVwQixLQUFLLENBQUMsYUFBYSxHQUFJLEdBQUcsSUFBSztJQUM3QixNQUFNLEdBQUcsMEJBQUcsSUFBSSw4QkFBSixJQUFJLEVBQVcsTUFBTSxFQUFFLEdBQUcsQ0FBQztJQUN2QyxJQUFJLEdBQUcsRUFBRTtNQUNQLE9BQU87UUFDTCxJQUFJLEVBQUUsR0FBRztRQUNULE1BQU0sRUFBRSxJQUFBLGVBQVEsRUFBQyxDQUFDLENBQUMsRUFBRSxHQUFHO01BQzFCLENBQUM7SUFDSDtJQUNBLE9BQU8sU0FBUztFQUNsQixDQUFDO0VBQ0QsS0FBSyxDQUFDLGFBQWEsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLEtBQUs7SUFDbkMsMkJBQUksOEJBQUosSUFBSSxFQUFXLE1BQU0sRUFBRSxHQUFHLEVBQUUsSUFBQSxlQUFRLEVBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQztFQUN2RCxDQUFDO0VBQ0QsS0FBSyxDQUFDLGFBQWEsR0FBSSxHQUFHLElBQUs7SUFDN0IsMkJBQUksOEJBQUosSUFBSSxFQUFXLE1BQU0sRUFBRSxHQUFHO0VBQzVCLENBQUM7RUFDRCxLQUFLLENBQUMsYUFBYSxHQUFHLENBQUMsSUFBSTtJQUN6QiwyQkFBSSw4QkFBSixJQUFJLEVBQVcsT0FBTyxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSztFQUMzQyxDQUFDO0VBQ0QsS0FBSyxDQUFDLGFBQWEsR0FBRyxDQUFDLElBQUk7SUFDekIsMkJBQUksOEJBQUosSUFBSSxFQUFXLE9BQU8sRUFBRSxLQUFLLENBQUMsSUFBSTtFQUNwQyxDQUFDO0FBQ0g7QUFBQywyQkFHZ0IsSUFBSSxFQUFFO0VBQ3JCLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUU7SUFDckMsT0FBTyxJQUFJO0VBQ2I7RUFHQSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSTtFQUM5QixJQUFJLENBQUMsY0FBYyxHQUFJLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUk7RUFDbkUsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFO0lBQzNELElBQUksQ0FBQyxVQUFVLEdBQUc7TUFDaEIsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSztNQUN4QixPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUN2QixDQUFDO0VBQ0gsQ0FBQyxNQUFNO0lBQ0wsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJO0VBQ3hCO0VBRUEsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO0lBQ2hCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDO0VBQ3BDO0VBRUEsT0FBTyxJQUFJO0FBQ2I7QUE4eENEO0FBR0QsTUFBTSxDQUFDLG1CQUFtQixHQUFHLEtBQUssQ0FBQyxtQkFBbUI7QUFDdEQsTUFBTSxDQUFDLHFCQUFxQixHQUFHLEtBQUssQ0FBQyxxQkFBcUI7QUFDMUQsTUFBTSxDQUFDLHNCQUFzQixHQUFHLEtBQUssQ0FBQyxzQkFBc0I7QUFDNUQsTUFBTSxDQUFDLHFCQUFxQixHQUFHLEtBQUssQ0FBQyxxQkFBcUI7QUFDMUQsTUFBTSxDQUFDLG1CQUFtQixHQUFHLEtBQUssQ0FBQyxtQkFBbUI7QUFDdEQsTUFBTSxDQUFDLHVCQUF1QixHQUFHLEtBQUssQ0FBQyx1QkFBdUI7QUFDOUQsTUFBTSxDQUFDLG1CQUFtQixHQUFHLEtBQUssQ0FBQyxtQkFBbUI7QUFDdEQsTUFBTSxDQUFDLG9CQUFvQixHQUFHLEtBQUssQ0FBQyxvQkFBb0I7QUFHeEQsTUFBTSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUTtBQUdoQyxNQUFNLENBQUMsZ0JBQWdCLEdBQUcsZ0JBQWdCO0FBQzFDLE1BQU0sQ0FBQyxvQkFBb0IsR0FBRyxvQkFBb0I7QUFDbEQsTUFBTSxDQUFDLGFBQWEsR0FBRyxhQUFhO0FBQ3BDLE1BQU0sQ0FBQyxvQkFBb0IsR0FBRyxtQkFBbUI7Ozs7O0FDbnNFakQsWUFBWTs7QUFBQztFQUFBO0FBQUE7QUFBQTtBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlvQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFFYixNQUFNLEtBQUssQ0FBQztFQXNCakIsV0FBVyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7SUFFM0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJO0lBSW5CLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSTtJQUVoQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUk7SUFFbkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJO0lBRW5CLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBRTFCLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxtQkFBVSxDQUFDLElBQUksQ0FBQztJQUUvQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUk7SUFFbkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJO0lBRWxCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSTtJQUluQixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUdoQixJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxXQUFXO0lBR3JDLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQztJQUVoQixJQUFJLENBQUMsT0FBTyxHQUFHLENBQUM7SUFFaEIsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLO0lBRTNCLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQztJQUVoQixJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSTtJQUdsQyxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUU7SUFFZixJQUFJLENBQUMsWUFBWSxHQUFHLEVBQUU7SUFLdEIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLENBQUMsQ0FBQztJQUUxQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksZ0JBQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUs7TUFDckMsT0FBTyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHO0lBQ3RCLENBQUMsRUFBRSxJQUFJLENBQUM7SUFFUixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUs7SUFFdEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7SUFFbEMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJO0lBRWhCLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSztJQUdyQixJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSTtJQUc5QixJQUFJLFNBQVMsRUFBRTtNQUNiLElBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLE1BQU07TUFDOUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUMsTUFBTTtNQUM5QixJQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxNQUFNO01BQzlCLElBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLE1BQU07TUFFOUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUMsVUFBVTtNQUV0QyxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxTQUFTO01BRXBDLElBQUksQ0FBQyxhQUFhLEdBQUcsU0FBUyxDQUFDLGFBQWE7TUFDNUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxTQUFTLENBQUMsYUFBYTtNQUM1QyxJQUFJLENBQUMsY0FBYyxHQUFHLFNBQVMsQ0FBQyxjQUFjO01BQzlDLElBQUksQ0FBQyxhQUFhLEdBQUcsU0FBUyxDQUFDLGFBQWE7TUFDNUMsSUFBSSxDQUFDLHFCQUFxQixHQUFHLFNBQVMsQ0FBQyxxQkFBcUI7SUFDOUQ7RUFDRjtFQWFBLE9BQU8sU0FBUyxDQUFDLElBQUksRUFBRTtJQUNyQixNQUFNLEtBQUssR0FBRztNQUNaLElBQUksRUFBRSxLQUFLLENBQUMsUUFBUTtNQUNwQixLQUFLLEVBQUUsS0FBSyxDQUFDLFNBQVM7TUFDdEIsS0FBSyxFQUFFLEtBQUssQ0FBQyxTQUFTO01BQ3RCLEtBQUssRUFBRSxLQUFLLENBQUMsU0FBUztNQUN0QixLQUFLLEVBQUUsS0FBSyxDQUFDLFNBQVM7TUFDdEIsS0FBSyxFQUFFLEtBQUssQ0FBQyxTQUFTO01BQ3RCLEtBQUssRUFBRSxLQUFLLENBQUMsU0FBUztNQUN0QixLQUFLLEVBQUUsS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUNELE9BQU8sS0FBSyxDQUFFLE9BQU8sSUFBSSxJQUFJLFFBQVEsR0FBSSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7RUFDeEU7RUFVQSxPQUFPLGFBQWEsQ0FBQyxJQUFJLEVBQUU7SUFDekIsT0FBTyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxRQUFRO0VBQ2hEO0VBVUEsT0FBTyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUU7SUFDNUIsT0FBTyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxTQUFTO0VBQ2pEO0VBVUEsT0FBTyxjQUFjLENBQUMsSUFBSSxFQUFFO0lBQzFCLE9BQU8sS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsU0FBUztFQUNqRDtFQVVBLE9BQU8sZUFBZSxDQUFDLElBQUksRUFBRTtJQUMzQixPQUFPLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQztFQUNuRTtFQVVBLE9BQU8sbUJBQW1CLENBQUMsSUFBSSxFQUFFO0lBQy9CLE9BQVEsT0FBTyxJQUFJLElBQUksUUFBUSxLQUM1QixJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxjQUFjLENBQUM7RUFDN0Y7RUFVQSxPQUFPLGtCQUFrQixDQUFDLElBQUksRUFBRTtJQUM5QixPQUFRLE9BQU8sSUFBSSxJQUFJLFFBQVEsS0FDNUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsY0FBYyxDQUFDO0VBQzlGO0VBT0EsWUFBWSxHQUFHO0lBQ2IsT0FBTyxJQUFJLENBQUMsU0FBUztFQUN2QjtFQVVBLFNBQVMsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFO0lBRTlCLFlBQVksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUM7SUFDckMsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUk7SUFHOUIsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO01BQ2xCLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7SUFDOUI7SUFHQSxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7TUFDakIsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLHNCQUFzQixDQUFDLENBQUM7SUFDMUQ7SUFLQSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSTtNQUM3RixJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksR0FBRyxFQUFFO1FBRXBCLE9BQU8sSUFBSTtNQUNiO01BRUEsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJO01BQ3JCLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSztNQUNyQixJQUFJLENBQUMsR0FBRyxHQUFJLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUc7TUFHeEUsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO1FBQ2IsT0FBTyxJQUFJLENBQUMsSUFBSTtRQUVoQixJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtVQUUzQixJQUFJLENBQUMsYUFBYSxFQUFFO1VBQ3BCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUs7UUFDeEI7UUFDQSxJQUFJLENBQUMsYUFBYSxFQUFFO1FBRXBCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEVBQUU7UUFDdEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsRUFBRTtRQUV0QixJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQyxTQUFTLEVBQUU7VUFFL0QsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUU7VUFDcEMsSUFBSSxFQUFFLENBQUMsU0FBUyxFQUFFO1lBQ2hCLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO1VBQ3BCO1VBQ0EsSUFBSSxFQUFFLENBQUMsYUFBYSxFQUFFO1lBQ3BCLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1VBQ2xDO1FBQ0Y7UUFFQSxJQUFJLFNBQVMsSUFBSSxTQUFTLENBQUMsSUFBSSxFQUFFO1VBQy9CLFNBQVMsQ0FBQyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUk7VUFDbkMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7UUFDdkM7TUFDRjtNQUNBLE9BQU8sSUFBSTtJQUNiLENBQUMsQ0FBQztFQUNKO0VBWUEsYUFBYSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUU7SUFDMUIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLENBQUM7RUFDNUQ7RUFVQSxPQUFPLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRTtJQUNwQixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7RUFDOUQ7RUFVQSxjQUFjLENBQUMsR0FBRyxFQUFFO0lBQ2xCLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO01BQ25CLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO0lBQ3RFO0lBQ0EsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO01BQ2pCLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO0lBQ3ZFO0lBR0EsR0FBRyxDQUFDLFFBQVEsR0FBRyxJQUFJO0lBQ25CLEdBQUcsQ0FBQyxPQUFPLEdBQUcsS0FBSztJQUduQixJQUFJLFdBQVcsR0FBRyxJQUFJO0lBQ3RCLElBQUksZUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUU7TUFDbkMsV0FBVyxHQUFHLEVBQUU7TUFDaEIsZUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksSUFBSTtRQUNuQyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFO1VBQ3BCLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUM1QjtNQUNGLENBQUMsQ0FBQztNQUNGLElBQUksV0FBVyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7UUFDM0IsV0FBVyxHQUFHLElBQUk7TUFDcEI7SUFDRjtJQUVBLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUk7TUFDaEUsR0FBRyxDQUFDLFFBQVEsR0FBRyxLQUFLO01BQ3BCLEdBQUcsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUU7TUFDaEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7TUFDeEMsSUFBSSxDQUFDLGdDQUFnQyxDQUFDLEdBQUcsQ0FBQztNQUMxQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQztNQUNwQixPQUFPLElBQUk7SUFDYixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJO01BQ2QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMseUNBQXlDLEVBQUUsR0FBRyxDQUFDO01BQ25FLEdBQUcsQ0FBQyxRQUFRLEdBQUcsS0FBSztNQUNwQixHQUFHLENBQUMsT0FBTyxHQUFHLElBQUk7TUFDbEIsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1FBQ2YsSUFBSSxDQUFDLE1BQU0sRUFBRTtNQUNmO0lBQ0YsQ0FBQyxDQUFDO0VBQ0o7RUFlQSxZQUFZLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRTtJQUN0QixNQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7SUFDN0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUU7TUFHdEIsR0FBRyxDQUFDLGFBQWEsR0FBRyxJQUFJO01BQ3hCLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRztNQUNiLEdBQUcsQ0FBQyxFQUFFLEdBQUcsSUFBSSxJQUFJLEVBQUU7TUFDbkIsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixFQUFFO01BRzFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsSUFBSTtNQUVqQixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7TUFDdkIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQztNQUVoQyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7UUFDZixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztNQUNsQjtJQUNGO0lBR0EsT0FBTyxDQUFDLElBQUksSUFBSSxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQzlCLElBQUksQ0FBQyxDQUFDLElBQUk7TUFDVCxJQUFJLEdBQUcsQ0FBQyxVQUFVLEVBQUU7UUFDbEIsT0FBTztVQUNMLElBQUksRUFBRSxHQUFHO1VBQ1QsSUFBSSxFQUFFO1FBQ1IsQ0FBQztNQUNIO01BQ0EsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQztJQUNqQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJO01BQ2QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsaUNBQWlDLEVBQUUsR0FBRyxDQUFDO01BQzNELEdBQUcsQ0FBQyxRQUFRLEdBQUcsS0FBSztNQUNwQixHQUFHLENBQUMsT0FBTyxHQUFHLElBQUk7TUFDbEIsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1FBQ2YsSUFBSSxDQUFDLE1BQU0sRUFBRTtNQUNmO01BRUEsTUFBTSxHQUFHO0lBQ1gsQ0FBQyxDQUFDO0VBQ047RUFXQSxLQUFLLENBQUMsS0FBSyxFQUFFO0lBRVgsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxLQUFLLEVBQUU7TUFDN0IsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7SUFDakU7SUFHQSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSTtNQUN2RCxJQUFJLENBQUMsU0FBUyxFQUFFO01BQ2hCLElBQUksS0FBSyxFQUFFO1FBQ1QsSUFBSSxDQUFDLEtBQUssRUFBRTtNQUNkO01BQ0EsT0FBTyxJQUFJO0lBQ2IsQ0FBQyxDQUFDO0VBQ0o7RUFXQSxZQUFZLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtJQUN6QixZQUFZLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDO0lBQ3JDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxVQUFVLENBQUMsQ0FBQyxJQUFJO01BQ3hDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJO01BQzlCLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO0lBQ25CLENBQUMsRUFBRSxLQUFLLENBQUM7RUFDWDtFQVVBLE9BQU8sQ0FBQyxNQUFNLEVBQUU7SUFFZCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDO0VBQ2hEO0VBU0EsZUFBZSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUU7SUFDOUIsSUFBSSxLQUFLLEdBQUcsT0FBTyxHQUNqQixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxHQUMxQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQztJQUc5QyxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUMvRCxJQUFJLENBQUUsS0FBSyxJQUFLO01BQ2YsSUFBSSxLQUFLLElBQUksS0FBSyxFQUFFO1FBRWxCLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQztVQUNyQixLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUk7VUFDaEIsSUFBSSxFQUFFLEdBQUc7VUFDVCxNQUFNLEVBQUU7WUFDTixLQUFLLEVBQUU7VUFDVDtRQUNGLENBQUMsQ0FBQztNQUNKO01BR0EsS0FBSyxJQUFJLEtBQUs7TUFFZCxLQUFLLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEdBQzFELElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDO01BQzlDLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO01BQ3pDLElBQUksQ0FBQyxPQUFPLEVBQUU7UUFDWixPQUFPLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUk7VUFDN0IsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFO1lBQzdDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSTtVQUM1QjtRQUNGLENBQUMsQ0FBQztNQUNKO01BQ0EsT0FBTyxPQUFPO0lBQ2hCLENBQUMsQ0FBQztFQUNOO0VBUUEsT0FBTyxDQUFDLE1BQU0sRUFBRTtJQUNkLElBQUksTUFBTSxDQUFDLElBQUksRUFBRTtNQUNmLE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBQSxxQkFBYyxFQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDM0M7SUFFQSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQzNDLElBQUksQ0FBQyxJQUFJLElBQUk7TUFDWixJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLEdBQUcsRUFBRTtRQUU1QixPQUFPLElBQUk7TUFDYjtNQUVBLElBQUksTUFBTSxDQUFDLEdBQUcsRUFBRTtRQUNkLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJO1FBQzVCLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRTtVQUNsQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUc7VUFDaEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEVBQUU7UUFDOUI7UUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUU7VUFHcEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRTtVQUNqRCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRTtZQUVoQixNQUFNLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztVQUNsQjtRQUNGO1FBQ0EsTUFBTSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEdBQUcsSUFBSTtRQUMvQixJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO01BQ3BDO01BRUEsSUFBSSxNQUFNLENBQUMsSUFBSSxFQUFFO1FBQ2YsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFO1VBQ2xDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRztVQUNqQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsRUFBRTtRQUMvQjtRQUNBLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO01BQ3BDO01BRUEsSUFBSSxNQUFNLENBQUMsSUFBSSxFQUFFO1FBQ2YsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7TUFDcEM7TUFDQSxJQUFJLE1BQU0sQ0FBQyxJQUFJLEVBQUU7UUFDZixJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDO01BQzdDO01BRUEsT0FBTyxJQUFJO0lBQ2IsQ0FBQyxDQUFDO0VBQ047RUFTQSxVQUFVLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRTtJQUN0QixNQUFNLElBQUksR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJO0lBQzlDLE1BQU0sRUFBRSxHQUFHLElBQUksR0FDYixJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLEVBQUUsR0FDdkMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLEVBQUU7SUFFbkQsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO01BQ2xCLEdBQUcsRUFBRTtRQUNILElBQUksRUFBRSxHQUFHO1FBQ1QsSUFBSSxFQUFFO01BQ1I7SUFDRixDQUFDLENBQUM7RUFDSjtFQVVBLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFO0lBQ2hCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztNQUNsQixHQUFHLEVBQUU7UUFDSCxJQUFJLEVBQUUsR0FBRztRQUNULElBQUksRUFBRTtNQUNSO0lBQ0YsQ0FBQyxDQUFDO0VBQ0o7RUFTQSxPQUFPLENBQUMsSUFBSSxFQUFFO0lBQ1osSUFBSSxJQUFJLENBQUMsT0FBTyxJQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFLLEVBQUU7TUFDakQsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztJQUM5QjtJQUNBLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztNQUNsQixJQUFJLEVBQUU7UUFDSixPQUFPLEVBQUU7VUFDUCxJQUFJLEVBQUUsSUFBSSxHQUFHLElBQUksR0FBRyxLQUFLLENBQUM7UUFDNUI7TUFDRjtJQUNGLENBQUMsQ0FBQztFQUNKO0VBVUEsV0FBVyxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUU7SUFDeEIsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7TUFDbkIsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLDBDQUEwQyxDQUFDLENBQUM7SUFDOUU7SUFHQSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsS0FBSztNQUN0QixJQUFJLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRTtRQUNuQixPQUFPLElBQUk7TUFDYjtNQUNBLElBQUksRUFBRSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxFQUFFO1FBQ3BCLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUc7TUFDbkM7TUFDQSxPQUFPLEtBQUs7SUFDZCxDQUFDLENBQUM7SUFHRixJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsS0FBSztNQUNyQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLFdBQVcsRUFBRTtRQUM3QixJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQyxXQUFXLEVBQUU7VUFDckMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDLE1BQU07VUFFTCxHQUFHLENBQUMsSUFBSSxDQUFDO1lBQ1AsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHO1lBQ1YsRUFBRSxFQUFFLElBQUksQ0FBQyxPQUFPLEdBQUc7VUFDckIsQ0FBQyxDQUFDO1FBQ0o7TUFDRjtNQUNBLE9BQU8sR0FBRztJQUNaLENBQUMsRUFBRSxFQUFFLENBQUM7SUFHTixJQUFJLE1BQU07SUFDVixJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO01BQ3JCLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUM7SUFDNUQsQ0FBQyxNQUFNO01BQ0wsTUFBTSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7UUFDdkIsTUFBTSxFQUFFO1VBQ04sR0FBRyxFQUFFO1FBQ1A7TUFDRixDQUFDLENBQUM7SUFDSjtJQUVBLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUk7TUFDekIsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFO1FBQ2xDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHO01BQ2hDO01BRUEsTUFBTSxDQUFDLE9BQU8sQ0FBRSxDQUFDLElBQUs7UUFDcEIsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFO1VBQ1IsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUNyQyxDQUFDLE1BQU07VUFDTCxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7UUFDMUI7TUFDRixDQUFDLENBQUM7TUFFRixJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7UUFFZixJQUFJLENBQUMsTUFBTSxFQUFFO01BQ2Y7TUFDQSxPQUFPLElBQUk7SUFDYixDQUFDLENBQUM7RUFDSjtFQVNBLGNBQWMsQ0FBQyxPQUFPLEVBQUU7SUFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLEVBQUU7TUFFdEMsT0FBTyxPQUFPLENBQUMsT0FBTyxFQUFFO0lBQzFCO0lBQ0EsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7TUFDdkIsR0FBRyxFQUFFLENBQUM7TUFDTixFQUFFLEVBQUUsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDO01BQ3BCLElBQUksRUFBRTtJQUNSLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQztFQUNkO0VBV0EsZUFBZSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUU7SUFFN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUUxQixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsS0FBSztNQUNwQyxJQUFJLEdBQUcsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO1FBRW5CLEdBQUcsQ0FBQyxJQUFJLENBQUM7VUFDUCxHQUFHLEVBQUU7UUFDUCxDQUFDLENBQUM7TUFDSixDQUFDLE1BQU07UUFDTCxJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDOUIsSUFBSyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUssRUFBRSxJQUFJLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBRSxJQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRyxFQUFFO1VBRXhELEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFDUCxHQUFHLEVBQUU7VUFDUCxDQUFDLENBQUM7UUFDSixDQUFDLE1BQU07VUFFTCxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztRQUN4RDtNQUNGO01BQ0EsT0FBTyxHQUFHO0lBQ1osQ0FBQyxFQUFFLEVBQUUsQ0FBQztJQUVOLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDO0VBQzFDO0VBV0EsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRTtJQUM3QixNQUFNLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUNsQixJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFcEQsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUM7RUFDNUM7RUFTQSxRQUFRLENBQUMsSUFBSSxFQUFFO0lBQ2IsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO01BRWpCLElBQUksQ0FBQyxLQUFLLEVBQUU7TUFDWixPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO0lBQzlCO0lBRUEsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUk7TUFDekQsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJO01BQ3BCLElBQUksQ0FBQyxTQUFTLEVBQUU7TUFDaEIsSUFBSSxDQUFDLEtBQUssRUFBRTtNQUNaLE9BQU8sSUFBSTtJQUNiLENBQUMsQ0FBQztFQUNKO0VBUUEsZUFBZSxDQUFDLElBQUksRUFBRTtJQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtNQUNuQixPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsOENBQThDLENBQUMsQ0FBQztJQUNsRjtJQUVBLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJO01BRWhFLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7TUFFeEIsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO1FBQ3RCLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7TUFDOUM7TUFDQSxPQUFPLElBQUk7SUFDYixDQUFDLENBQUM7RUFDSjtFQVFBLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFO0lBQ2QsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7TUFFbkI7SUFDRjtJQUdBLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBQ3pELElBQUksTUFBTSxHQUFHLEtBQUs7SUFDbEIsSUFBSSxJQUFJLEVBQUU7TUFFUixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUU7UUFDbkMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUc7UUFDaEIsTUFBTSxHQUFHLElBQUk7TUFDZjtJQUNGLENBQUMsTUFBTTtNQUVMLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRztJQUNqQztJQUVBLElBQUksTUFBTSxFQUFFO01BRVYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDO01BRXZDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQztNQUUvQixJQUFJLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsRUFBRTtRQUMzQyxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRTtRQUVwQyxFQUFFLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7TUFDaEM7SUFDRjtFQUNGO0VBUUEsUUFBUSxDQUFDLEdBQUcsRUFBRTtJQUNaLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQztFQUN4QjtFQU9BLFFBQVEsQ0FBQyxHQUFHLEVBQUU7SUFDWixHQUFHLEdBQUcsR0FBRyxJQUFJLElBQUksQ0FBQyxPQUFPO0lBQ3pCLElBQUksR0FBRyxHQUFHLENBQUMsRUFBRTtNQUNYLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQztJQUN4QjtFQUNGO0VBS0EsWUFBWSxHQUFHO0lBQ2IsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO01BQ2xCLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDdEMsQ0FBQyxNQUFNO01BQ0wsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsa0RBQWtELENBQUM7SUFDekU7RUFDRjtFQU1BLGFBQWEsQ0FBQyxTQUFTLEVBQUU7SUFDdkIsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO01BQ2xCLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsU0FBUyxHQUFHLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDakUsQ0FBQyxNQUFNO01BQ0wsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsa0RBQWtELENBQUM7SUFDekU7RUFDRjtFQWFBLFNBQVMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRTtJQUMzQixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxDQUFDLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTtNQUU1RDtJQUNGO0lBQ0EsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsT0FBTyxDQUFDO0VBQzdEO0VBR0EsZUFBZSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFO0lBQzdCLElBQUksTUFBTTtNQUFFLFFBQVEsR0FBRyxLQUFLO0lBRTVCLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQztJQUNiLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDO0lBQ3ZCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDO0lBQ3pCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDO0lBQ3pCLFFBQVEsSUFBSTtNQUNWLEtBQUssTUFBTTtRQUNULE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSTtRQUNsQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUM7UUFDcEMsUUFBUSxHQUFJLE1BQU0sSUFBSSxJQUFJLENBQUMsSUFBSztRQUNoQztNQUNGLEtBQUssTUFBTTtRQUNULE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSTtRQUNsQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUM7UUFDcEMsUUFBUSxHQUFJLE1BQU0sSUFBSSxJQUFJLENBQUMsSUFBSztRQUNoQztNQUNGLEtBQUssS0FBSztRQUNSLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRztRQUNqQixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUM7UUFDbEMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLEVBQUU7VUFDdEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ25CO1FBQ0EsUUFBUSxHQUFJLE1BQU0sSUFBSSxJQUFJLENBQUMsR0FBSTtRQUMvQjtJQUFNO0lBSVYsSUFBSSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUU7TUFDekIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSTtNQUNyQixRQUFRLEdBQUcsSUFBSTtJQUNqQjtJQUNBLElBQUksSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFO01BQ3hCLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUk7TUFDcEIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLEVBQUU7UUFDdEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFO01BQ25CO01BQ0EsUUFBUSxHQUFHLElBQUk7SUFDakI7SUFDQSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUk7SUFDbEMsT0FBTyxRQUFRO0VBQ2pCO0VBU0EsUUFBUSxDQUFDLEdBQUcsRUFBRTtJQUVaLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDO0lBQ3BDLElBQUksSUFBSSxFQUFFO01BQ1IsT0FBTyxJQUFJO0lBQ2I7RUFDRjtFQU9BLFdBQVcsR0FBRztJQUNaLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUU7TUFDckIsT0FBTyxTQUFTO0lBQ2xCO0lBQ0EsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7RUFDL0I7RUFRQSxXQUFXLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRTtJQUM3QixNQUFNLEVBQUUsR0FBSSxRQUFRLElBQUksSUFBSSxDQUFDLFNBQVU7SUFDdkMsSUFBSSxFQUFFLEVBQUU7TUFDTixLQUFLLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7UUFDM0IsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQztNQUN0RDtJQUNGO0VBQ0Y7RUFPQSxJQUFJLEdBQUc7SUFFTCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztFQUM1QjtFQVFBLFVBQVUsQ0FBQyxHQUFHLEVBQUU7SUFDZCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO0VBQ3pCO0VBVUEsZUFBZSxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFO0lBQzFDLElBQUksQ0FBQyxRQUFRLEVBQUU7TUFFYjtJQUNGO0lBQ0EsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQztJQUMvQyxJQUFJLENBQUMsUUFBUSxFQUFFO01BQ2I7SUFDRjtJQUNBLFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDO0VBQzNEO0VBV0EsUUFBUSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRTtJQUM3QyxNQUFNLEVBQUUsR0FBSSxRQUFRLElBQUksSUFBSSxDQUFDLE1BQU87SUFDcEMsSUFBSSxFQUFFLEVBQUU7TUFDTixNQUFNLFFBQVEsR0FBRyxPQUFPLE9BQU8sSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7UUFDaEUsR0FBRyxFQUFFO01BQ1AsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLFNBQVM7TUFDcEIsTUFBTSxTQUFTLEdBQUcsT0FBTyxRQUFRLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO1FBQ2xFLEdBQUcsRUFBRTtNQUNQLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxTQUFTO01BQ3BCLElBQUksUUFBUSxJQUFJLENBQUMsQ0FBQyxJQUFJLFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBRTtRQUdyQyxJQUFJLElBQUksR0FBRyxFQUFFO1FBQ2IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFDLEtBQUs7VUFDbkQsSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFFL0I7VUFDRjtVQUVBLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRztVQUNwRCxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRTtZQUNuQixNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxFQUFFO1lBQzFCLE1BQU0sQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLEdBQUc7WUFDNUIsTUFBTSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsRUFBRTtZQUNsQixNQUFNLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHO1VBQ3RCO1VBQ0EsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNSLElBQUksRUFBRSxNQUFNO1lBQ1osR0FBRyxFQUFFO1VBQ1AsQ0FBQyxDQUFDO1FBQ0osQ0FBQyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFM0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEtBQUs7VUFDdkIsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLElBQUksRUFDdEIsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxTQUFTLEVBQ3BDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxTQUFTLEVBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQztRQUNsRSxDQUFDLENBQUM7TUFDSjtJQUNGO0VBQ0Y7RUFRQSxXQUFXLENBQUMsR0FBRyxFQUFFO0lBQ2YsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7TUFDOUIsR0FBRyxFQUFFO0lBQ1AsQ0FBQyxDQUFDO0lBQ0YsSUFBSSxHQUFHLElBQUksQ0FBQyxFQUFFO01BQ1osT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7SUFDbEM7SUFDQSxPQUFPLFNBQVM7RUFDbEI7RUFPQSxhQUFhLEdBQUc7SUFDZCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFO0VBQ2pDO0VBUUEsZ0JBQWdCLENBQUMsR0FBRyxFQUFFO0lBQ3BCLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUM7SUFDM0MsT0FBTyxRQUFRLEdBQUcsUUFBUSxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUk7RUFDN0M7RUFPQSxTQUFTLEdBQUc7SUFDVixPQUFPLElBQUksQ0FBQyxPQUFPO0VBQ3JCO0VBT0EsVUFBVSxHQUFHO0lBQ1gsT0FBTyxJQUFJLENBQUMsT0FBTztFQUNyQjtFQU9BLFlBQVksR0FBRztJQUNiLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUU7RUFDaEM7RUFRQSxjQUFjLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRTtJQUNoQyxJQUFJLENBQUMsUUFBUSxFQUFFO01BQ2IsTUFBTSxJQUFJLEtBQUssQ0FBQywyQkFBMkIsQ0FBQztJQUM5QztJQUNBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxXQUFXLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQztFQUNoRTtFQVdBLGVBQWUsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFO0lBQ3pCLElBQUksS0FBSyxHQUFHLENBQUM7SUFDYixJQUFJLEdBQUcsR0FBRyxDQUFDLEVBQUU7TUFDWCxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixFQUFFO01BQzFDLEtBQUssSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtRQUMzQixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUM3QixJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssRUFBRSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUU7VUFDekMsS0FBSyxFQUFFO1FBQ1Q7TUFDRjtJQUNGO0lBQ0EsT0FBTyxLQUFLO0VBQ2Q7RUFTQSxZQUFZLENBQUMsR0FBRyxFQUFFO0lBQ2hCLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDO0VBQzFDO0VBU0EsWUFBWSxDQUFDLEdBQUcsRUFBRTtJQUNoQixPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQztFQUMxQztFQU9BLGtCQUFrQixDQUFDLEtBQUssRUFBRTtJQUN4QixPQUFPLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLEdBRW5DLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWU7RUFDOUM7RUFPQSxZQUFZLENBQUMsS0FBSyxFQUFFO0lBQ2xCLE9BQU8sSUFBSSxDQUFDLE9BQU8sSUFBSSxLQUFLO0VBQzlCO0VBUUEsWUFBWSxDQUFDLEtBQUssRUFBRTtJQUNsQixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztNQUM5QixHQUFHLEVBQUU7SUFDUCxDQUFDLENBQUM7SUFDRixPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUM7SUFDbkMsSUFBSSxHQUFHLElBQUksQ0FBQyxFQUFFO01BQ1osSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDO01BQzlDLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO0lBQ2xDO0lBQ0EsT0FBTyxTQUFTO0VBQ2xCO0VBVUEsaUJBQWlCLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRTtJQUVqQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDO0lBR3hELEtBQUssSUFBSSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsR0FBRyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEVBQUU7TUFDckMsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO0lBQ2pDO0lBR0EsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7TUFDaEMsR0FBRyxFQUFFO0lBQ1AsQ0FBQyxFQUFFLElBQUksQ0FBQztJQUNSLE9BQU8sS0FBSyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7TUFDckUsR0FBRyxFQUFFO0lBQ1AsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRTtFQUNoQjtFQVFBLGFBQWEsQ0FBQyxHQUFHLEVBQUUsUUFBUSxFQUFFO0lBQzNCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztJQUNwQyxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRTtJQUMzQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksR0FBRyxHQUFHLFdBQVcsRUFBRTtNQUVqQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7TUFDekIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQztNQUVoRCxHQUFHLENBQUMsR0FBRyxHQUFHLFFBQVE7TUFDbEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO01BQ3ZCLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUM7SUFDbEM7RUFDRjtFQVNBLFVBQVUsQ0FBQyxLQUFLLEVBQUU7SUFDaEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7TUFDOUIsR0FBRyxFQUFFO0lBQ1AsQ0FBQyxDQUFDO0lBQ0YsSUFBSSxHQUFHLElBQUksQ0FBQyxFQUFFO01BQ1osTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO01BQ3JDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDO01BQ2xDLElBQUksTUFBTSxJQUFJLEtBQUssQ0FBQyxxQkFBcUIsSUFBSSxNQUFNLElBQUksS0FBSyxDQUFDLHFCQUFxQixFQUFFO1FBQ2xGLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQztRQUM5QyxHQUFHLENBQUMsVUFBVSxHQUFHLElBQUk7UUFDckIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO1FBQ3pCLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtVQUVmLElBQUksQ0FBQyxNQUFNLEVBQUU7UUFDZjtRQUNBLE9BQU8sSUFBSTtNQUNiO0lBQ0Y7SUFDQSxPQUFPLEtBQUs7RUFDZDtFQU9BLE9BQU8sR0FBRztJQUNSLE9BQU8sS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0VBQ25DO0VBT0EsYUFBYSxHQUFHO0lBQ2QsT0FBTyxJQUFJLENBQUMsR0FBRztFQUNqQjtFQU9BLGFBQWEsQ0FBQyxHQUFHLEVBQUU7SUFDakIsT0FBTyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksbUJBQVUsQ0FBQyxHQUFHLENBQUM7RUFDdkM7RUFPQSxnQkFBZ0IsR0FBRztJQUNqQixPQUFPLElBQUksQ0FBQyxNQUFNO0VBQ3BCO0VBUUEsY0FBYyxHQUFHO0lBQ2YsT0FBTyxJQUFJLG9CQUFjLENBQUMsSUFBSSxDQUFDO0VBQ2pDO0VBT0EsVUFBVSxHQUFHO0lBQ1gsT0FBTyxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUk7RUFDNUM7RUFPQSxRQUFRLEdBQUc7SUFDVCxPQUFPLEtBQUssQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztFQUN2QztFQU9BLGFBQWEsR0FBRztJQUNkLE9BQU8sS0FBSyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7RUFDNUM7RUFPQSxXQUFXLEdBQUc7SUFDWixPQUFPLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0VBQzFDO0VBT0EsU0FBUyxHQUFHO0lBQ1YsT0FBTyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7RUFDeEM7RUFPQSxVQUFVLEdBQUc7SUFDWCxPQUFPLEtBQUssQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztFQUN6QztFQVdBLFNBQVMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFO0lBQ2xCLElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxtQkFBbUI7SUFDdEMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUU7TUFDL0IsSUFBSSxHQUFHLENBQUMsUUFBUSxFQUFFO1FBQ2hCLE1BQU0sR0FBRyxLQUFLLENBQUMsc0JBQXNCO01BQ3ZDLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxPQUFPLElBQUksR0FBRyxDQUFDLFVBQVUsRUFBRTtRQUN4QyxNQUFNLEdBQUcsS0FBSyxDQUFDLHFCQUFxQjtNQUN0QyxDQUFDLE1BQU0sSUFBSSxHQUFHLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUU7UUFDdkMsTUFBTSxHQUFHLEtBQUssQ0FBQyxxQkFBcUI7TUFDdEMsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQ3pDLE1BQU0sR0FBRyxLQUFLLENBQUMsbUJBQW1CO01BQ3BDLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUN6QyxNQUFNLEdBQUcsS0FBSyxDQUFDLHVCQUF1QjtNQUN4QyxDQUFDLE1BQU0sSUFBSSxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRTtRQUN0QixNQUFNLEdBQUcsS0FBSyxDQUFDLG1CQUFtQjtNQUNwQztJQUdGLENBQUMsTUFBTTtNQUNMLE1BQU0sR0FBRyxLQUFLLENBQUMsb0JBQW9CO0lBQ3JDO0lBRUEsSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sSUFBSSxNQUFNLEVBQUU7TUFDaEMsR0FBRyxDQUFDLE9BQU8sR0FBRyxNQUFNO01BQ3BCLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUM7SUFDL0Q7SUFFQSxPQUFPLE1BQU07RUFDZjtFQUdBLGlCQUFpQixDQUFDLEdBQUcsRUFBRTtJQUNyQixPQUFPLEdBQUcsQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPO0VBQ3JDO0VBSUEsZ0NBQWdDLENBQUMsR0FBRyxFQUFFO0lBQ3BDLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEVBQUU7TUFHaEMsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBRWxDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsSUFBSSxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUM7UUFDMUUsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO1VBQzVDLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7UUFDdkM7TUFDRjtNQUNBO0lBQ0Y7SUFFQSxNQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFELElBQUksU0FBUyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUU7TUFFdkI7SUFDRjtJQUNBLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDO0lBQzdDLElBQUksU0FBUyxJQUFJLFNBQVMsQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDLElBQUksRUFBRTtNQUUzQztJQUNGO0lBQ0EsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxJQUFJLElBQUksZ0JBQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUs7TUFDekUsT0FBTyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHO0lBQ3RCLENBQUMsRUFBRSxJQUFJLENBQUM7SUFDUixRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUNqQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLEdBQUcsUUFBUTtFQUM3QztFQUdBLFVBQVUsQ0FBQyxJQUFJLEVBQUU7SUFDZixJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7TUFDaEIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFO1FBQzNDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEVBQUU7UUFDdEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztNQUNqQztJQUNGO0lBRUEsSUFBSSxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUU7TUFDM0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRztNQUN2QixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7TUFFMUIsWUFBWSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQztNQUN6QyxJQUFJLENBQUMsc0JBQXNCLEdBQUcsVUFBVSxDQUFDLENBQUMsSUFBSTtRQUM1QyxJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSTtRQUNsQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7TUFDN0IsQ0FBQyxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUM7SUFDeEI7SUFFQSxJQUFJLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsRUFBRTtNQUNoRCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHO0lBQ3pCO0lBRUEsTUFBTSxRQUFRLEdBQUssQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUU7SUFFeEYsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLGVBQU0sQ0FBQyxjQUFjLEVBQUUsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO01BRTlGLElBQUksQ0FBQyxPQUFPLEdBQUcsZUFBTSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO1FBQ2xELEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU07UUFDdkIsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUM7UUFDdEMsUUFBUSxFQUFFLENBQUM7TUFDYixDQUFDLENBQUM7SUFDSjtJQUVBLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFO01BQ3ZCLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQztNQUN4QixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO01BQ2pDLElBQUksQ0FBQyxnQ0FBZ0MsQ0FBQyxJQUFJLENBQUM7SUFDN0M7SUFFQSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7TUFDZixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNuQjtJQUdBLE1BQU0sSUFBSSxHQUFHLFFBQVEsR0FBRyxNQUFNLEdBQUcsS0FBSztJQUN0QyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUM7SUFFN0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztFQUN2RDtFQUdBLFVBQVUsQ0FBQyxJQUFJLEVBQUU7SUFDZixJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7TUFDYixJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztJQUNsQztJQUNBLElBQUksSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7TUFDbkMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO0lBQ2hDO0lBQ0EsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFO01BQ1osSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO0lBQzNEO0lBQ0EsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO01BQ2IsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDbEM7SUFDQSxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7TUFDYixJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztJQUNuQztJQUNBLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtNQUNmLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ25CO0VBQ0Y7RUFFQSxVQUFVLENBQUMsSUFBSSxFQUFFO0lBQ2YsSUFBSSxJQUFJLEVBQUUsR0FBRztJQUNiLFFBQVEsSUFBSSxDQUFDLElBQUk7TUFDZixLQUFLLEtBQUs7UUFFUixJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ2pEO01BQ0YsS0FBSyxJQUFJO01BQ1QsS0FBSyxLQUFLO1FBRVIsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUM1QixJQUFJLElBQUksRUFBRTtVQUNSLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJO1FBQ2pDLENBQUMsTUFBTTtVQUNMLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLDhDQUE4QyxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUMxRjtRQUNBO01BQ0YsS0FBSyxNQUFNO1FBRVQsSUFBSSxDQUFDLFNBQVMsRUFBRTtRQUNoQjtNQUNGLEtBQUssS0FBSztRQUlSLElBQUksSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtVQUNyRCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3ZFO1FBQ0E7TUFDRixLQUFLLEtBQUs7UUFDUixHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixFQUFFO1FBQ2pELElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUN2QixJQUFJLENBQUMsSUFBSSxFQUFFO1VBRVQsTUFBTSxHQUFHLEdBQUcsSUFBSSxtQkFBVSxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7VUFDakQsSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksSUFBSSxtQkFBVSxDQUFDLEtBQUssRUFBRTtZQUN2QyxJQUFJLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUM7WUFDOUIsSUFBSSxDQUFDLElBQUksRUFBRTtjQUNULElBQUksR0FBRztnQkFDTCxJQUFJLEVBQUUsR0FBRztnQkFDVCxHQUFHLEVBQUU7Y0FDUCxDQUFDO2NBQ0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUN4RSxDQUFDLE1BQU07Y0FDTCxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUc7WUFDaEI7WUFDQSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksSUFBSSxFQUFFO1lBQ3pCLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztVQUM5QjtRQUNGLENBQUMsTUFBTTtVQUVMLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7VUFFN0IsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ3BCLElBQUksRUFBRSxHQUFHO1lBQ1QsT0FBTyxFQUFFLElBQUksSUFBSSxFQUFFO1lBQ25CLEdBQUcsRUFBRSxJQUFJLENBQUM7VUFDWixDQUFDLENBQUMsQ0FBQztRQUNMO1FBQ0E7TUFDRjtRQUNFLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLCtCQUErQixFQUFFLElBQUksQ0FBQyxJQUFJLENBQUM7SUFBQztJQUdwRSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7TUFDZixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNuQjtFQUNGO0VBRUEsVUFBVSxDQUFDLElBQUksRUFBRTtJQUNmLFFBQVEsSUFBSSxDQUFDLElBQUk7TUFDZixLQUFLLE1BQU07TUFDWCxLQUFLLE1BQU07UUFDVCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDbkMsSUFBSSxJQUFJLEVBQUU7VUFDUixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHO1VBQzFCLElBQUksSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ3pCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUk7VUFDdkI7UUFDRjtRQUNBLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUU7UUFDaEMsSUFBSSxHQUFHLEVBQUU7VUFDUCxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUM7UUFDM0I7UUFHQSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtVQUNoQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUMzQztRQUdBLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO1FBQzFEO01BQ0YsS0FBSyxJQUFJO1FBRVA7TUFDRixLQUFLLE1BQU07UUFFVDtNQUNGO1FBQ0UsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsMkJBQTJCLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQztJQUFDO0lBR2hFLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtNQUNmLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ25CO0VBQ0Y7RUFHQSxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUU7SUFDckIsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUU7TUFHcEIsT0FBTyxJQUFJLENBQUMsTUFBTTtNQUdsQixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ2xEO0lBR0EsSUFBQSxlQUFRLEVBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztJQUVwQixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO0lBRy9CLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRTtNQUN2RCxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRTtNQUNwQyxJQUFJLEVBQUUsQ0FBQyxTQUFTLEVBQUU7UUFDaEIsRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7TUFDcEI7TUFDQSxJQUFJLEVBQUUsQ0FBQyxhQUFhLEVBQUU7UUFDcEIsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7TUFDbEM7SUFDRjtJQUVBLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtNQUNuQixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztJQUN2QjtFQUNGO0VBR0EsZUFBZSxDQUFDLElBQUksRUFBRTtJQUNwQixLQUFLLElBQUksR0FBRyxJQUFJLElBQUksRUFBRTtNQUNwQixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO01BR3JCLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNO01BRXpCLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztNQUU1RSxJQUFJLElBQUksR0FBRyxJQUFJO01BQ2YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUU7UUFHaEIsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRTtVQUMxQyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7WUFDcEIsT0FBTyxFQUFFLEdBQUcsQ0FBQyxPQUFPO1lBQ3BCLE9BQU8sRUFBRSxHQUFHLENBQUMsT0FBTztZQUNwQixHQUFHLEVBQUUsR0FBRyxDQUFDO1VBQ1gsQ0FBQyxDQUFDO1FBQ0o7UUFDQSxJQUFJLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDO01BQzlDLENBQUMsTUFBTTtRQUVMLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDO1FBQzVCLElBQUksR0FBRyxHQUFHO01BQ1o7TUFFQSxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7UUFDbEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7TUFDdEI7SUFDRjtJQUVBLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtNQUN0QixJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzlDO0VBQ0Y7RUFFQSxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUU7SUFDckIsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLFFBQVEsRUFBRTtNQUNqRCxJQUFJLEdBQUcsRUFBRTtJQUNYO0lBQ0EsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJO0lBQ2pCLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtNQUN0QixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQztJQUMxQjtFQUNGO0VBRUEsaUJBQWlCLENBQUMsS0FBSyxFQUFFLENBQUM7RUFFMUIsbUJBQW1CLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtJQUNqQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDNUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3hDLE1BQU0sS0FBSyxHQUFHLElBQUk7SUFDbEIsSUFBSSxLQUFLLEdBQUcsQ0FBQztJQUNiLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtNQUN6QixNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVMsS0FBSyxFQUFFO1FBQzdCLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFO1VBQ2IsS0FBSyxFQUFFO1VBQ1AsS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO1FBQy9CLENBQUMsTUFBTTtVQUNMLEtBQUssSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN6QyxLQUFLLEVBQUU7WUFDUCxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztVQUN2QjtRQUNGO01BQ0YsQ0FBQyxDQUFDO0lBQ0o7SUFFQSxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUU7TUFHYixJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7UUFDZixJQUFJLENBQUMsTUFBTSxFQUFFO01BQ2Y7SUFDRjtFQUNGO0VBRUEsb0JBQW9CLENBQUMsS0FBSyxFQUFFO0lBRTFCLElBQUksSUFBSSxDQUFDLHFCQUFxQixFQUFFO01BQzlCLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLENBQUM7SUFDbkM7RUFDRjtFQUVBLFNBQVMsR0FBRztJQUNWLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSztFQUN4QjtFQUVBLEtBQUssR0FBRztJQUNOLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFO0lBQ3RCLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ3ZDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQ2hCLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxtQkFBVSxDQUFDLElBQUksQ0FBQztJQUMvQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUk7SUFDbkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJO0lBQ2xCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSTtJQUNuQixJQUFJLENBQUMsT0FBTyxHQUFHLENBQUM7SUFDaEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDO0lBQ2hCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSztJQUV0QixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRTtJQUNwQyxJQUFJLEVBQUUsRUFBRTtNQUNOLEVBQUUsQ0FBQyxVQUFVLENBQUM7UUFDWixhQUFhLEVBQUUsSUFBSTtRQUNuQixJQUFJLEVBQUUsTUFBTTtRQUNaLEtBQUssRUFBRSxLQUFLLENBQUMsUUFBUTtRQUNyQixHQUFHLEVBQUUsSUFBSSxDQUFDO01BQ1osQ0FBQyxDQUFDO0lBQ0o7SUFDQSxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7TUFDdEIsSUFBSSxDQUFDLGFBQWEsRUFBRTtJQUN0QjtFQUNGO0VBR0EsaUJBQWlCLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRTtJQUcxQixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQztJQUNwQyxNQUFNLEdBQUcsSUFBQSxlQUFRLEVBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQztJQUVwQyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUM7SUFFL0IsT0FBTyxJQUFBLG1CQUFZLEVBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsTUFBTSxDQUFDO0VBQy9DO0VBRUEsZUFBZSxHQUFHO0lBQ2hCLE9BQU8sSUFBSSxDQUFDLFlBQVksRUFBRTtFQUM1QjtFQUdBLGFBQWEsQ0FBQyxFQUFFLEVBQUUsTUFBTSxFQUFFO0lBQ3hCLE1BQU07TUFDSixLQUFLO01BQ0wsTUFBTTtNQUNOO0lBQ0YsQ0FBQyxHQUFHLE1BQU0sSUFBSSxDQUFDLENBQUM7SUFDaEIsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7TUFDOUIsS0FBSyxFQUFFLEtBQUs7TUFDWixNQUFNLEVBQUUsTUFBTTtNQUNkLEtBQUssRUFBRSxLQUFLLElBQUksS0FBSyxDQUFDO0lBQ3hCLENBQUMsQ0FBQyxDQUNELElBQUksQ0FBQyxJQUFJLElBQUk7TUFDWixJQUFJLENBQUMsT0FBTyxDQUFFLElBQUksSUFBSztRQUNyQixJQUFJLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRTtVQUMzQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHO1FBQ3pCO1FBQ0EsSUFBSSxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLEVBQUU7VUFDaEQsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRztRQUN6QjtRQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQztRQUN4QixJQUFJLENBQUMsZ0NBQWdDLENBQUMsSUFBSSxDQUFDO01BQzdDLENBQUMsQ0FBQztNQUNGLE9BQU8sSUFBSSxDQUFDLE1BQU07SUFDcEIsQ0FBQyxDQUFDO0VBQ047RUFFQSxlQUFlLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRTtJQUN4QixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksSUFBSSxFQUFFO0lBQ3pCLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7SUFFbEIsSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtNQUNsQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRztNQUNoRSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSTtJQUNwRTtJQUNBLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztJQUN4QyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO0VBQ2pDO0FBQ0Y7QUFBQztBQWtCTSxNQUFNLE9BQU8sU0FBUyxLQUFLLENBQUM7RUFHakMsV0FBVyxDQUFDLFNBQVMsRUFBRTtJQUNyQixLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUM7SUFBQztJQUdqQyxJQUFJLFNBQVMsRUFBRTtNQUNiLElBQUksQ0FBQyxlQUFlLEdBQUcsU0FBUyxDQUFDLGVBQWU7SUFDbEQ7RUFDRjtFQUdBLGdCQUFnQixDQUFDLElBQUksRUFBRTtJQUVyQixNQUFNLE9BQU8sR0FBSSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsSUFBTSxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFHO0lBRzdGLElBQUEsZUFBUSxFQUFDLElBQUksRUFBRSxJQUFJLENBQUM7SUFDcEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztJQUUvQixJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDO0lBR2pELElBQUksT0FBTyxFQUFFO01BQ1gsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUUsSUFBSSxJQUFLO1FBQy9CLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtVQUNmLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSztVQUNuQixJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsRUFBRTtZQUN6QyxJQUFJLEVBQUUsSUFBSSxJQUFJO1VBQ2hCLENBQUMsQ0FBQztVQUNGLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQztRQUNuQztNQUNGLENBQUMsQ0FBQztJQUNKO0lBRUEsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO01BQ25CLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO0lBQ3ZCO0VBQ0Y7RUFHQSxlQUFlLENBQUMsSUFBSSxFQUFFO0lBQ3BCLElBQUksV0FBVyxHQUFHLENBQUM7SUFDbkIsSUFBSSxDQUFDLE9BQU8sQ0FBRSxHQUFHLElBQUs7TUFDcEIsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLEtBQUs7TUFFM0IsSUFBSSxTQUFTLElBQUksS0FBSyxDQUFDLFNBQVMsSUFBSSxTQUFTLElBQUksS0FBSyxDQUFDLFFBQVEsRUFBRTtRQUMvRDtNQUNGO01BQ0EsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU07TUFFekIsSUFBSSxJQUFJLEdBQUcsSUFBSTtNQUNmLElBQUksR0FBRyxDQUFDLE9BQU8sRUFBRTtRQUNmLElBQUksR0FBRyxHQUFHO1FBQ1YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUM7TUFDdEMsQ0FBQyxNQUFNO1FBRUwsSUFBSSxPQUFPLEdBQUcsQ0FBQyxHQUFHLElBQUksV0FBVyxFQUFFO1VBQ2pDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO1VBQ3JCLEdBQUcsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDO1VBQ3ZCLEdBQUcsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDO1VBQ3ZCLEdBQUcsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsSUFBSTtRQUNqQztRQUVBLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQztRQUM5QyxJQUFJLEtBQUssQ0FBQyxJQUFJLEVBQUU7VUFDZCxPQUFPLEtBQUssQ0FBQyxJQUFJO1FBQ25CO1FBRUEsSUFBSSxHQUFHLElBQUEsZUFBUSxFQUFDLEtBQUssRUFBRSxHQUFHLENBQUM7UUFDM0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztRQUUvQixJQUFJLEtBQUssQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLEVBQUU7VUFDbkMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDO1VBQ25DLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUNsRDtRQUVBLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxJQUFJLEtBQUssRUFBRTtVQUMvQixHQUFHLENBQUMsYUFBYSxHQUFHLElBQUk7VUFDeEIsS0FBSyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQztRQUM3QjtNQUNGO01BRUEsV0FBVyxFQUFFO01BRWIsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1FBQ2xCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO01BQ3RCO0lBQ0YsQ0FBQyxDQUFDO0lBRUYsSUFBSSxJQUFJLENBQUMsYUFBYSxJQUFJLFdBQVcsR0FBRyxDQUFDLEVBQUU7TUFDekMsTUFBTSxJQUFJLEdBQUcsRUFBRTtNQUNmLElBQUksQ0FBQyxPQUFPLENBQUUsQ0FBQyxJQUFLO1FBQ2xCLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztNQUNwQixDQUFDLENBQUM7TUFDRixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxXQUFXLENBQUM7SUFDdkM7RUFDRjtFQUdBLGlCQUFpQixDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUU7SUFDNUIsSUFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLFFBQVEsRUFBRTtNQUNuRCxLQUFLLEdBQUcsRUFBRTtJQUNaO0lBQ0EsSUFBSSxHQUFHLEVBQUU7TUFDUCxLQUFLLENBQUMsT0FBTyxDQUFFLEVBQUUsSUFBSztRQUNwQixJQUFJLEVBQUUsQ0FBQyxHQUFHLEVBQUU7VUFFVixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBRSxFQUFFLElBQUs7WUFDNUMsT0FBTyxFQUFFLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRztVQUMvQyxDQUFDLENBQUM7VUFDRixJQUFJLEdBQUcsR0FBRyxDQUFDLEVBQUU7WUFFWCxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRTtjQUVaLEdBQUcsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBRSxFQUFFLElBQUs7Z0JBQ3hDLE9BQU8sRUFBRSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUk7Y0FDdkMsQ0FBQyxDQUFDO2NBQ0YsSUFBSSxHQUFHLElBQUksQ0FBQyxFQUFFO2dCQUVaLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7Y0FDbEM7WUFDRjtZQUNBLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztVQUM1QixDQUFDLE1BQU07WUFFTCxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxFQUFFLENBQUMsSUFBSTtVQUN2QztRQUNGLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQyxJQUFJLEVBQUU7VUFFbEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUUsRUFBRSxJQUFLO1lBQzlDLE9BQU8sRUFBRSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUk7VUFDdkMsQ0FBQyxDQUFDO1VBQ0YsSUFBSSxHQUFHLElBQUksQ0FBQyxFQUFFO1lBQ1osSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSTtVQUNwQztRQUNGO01BQ0YsQ0FBQyxDQUFDO0lBQ0osQ0FBQyxNQUFNO01BQ0wsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLO0lBQzNCO0lBQ0EsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO01BQ3ZCLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQztJQUN4QztFQUNGO0VBR0EsVUFBVSxDQUFDLElBQUksRUFBRTtJQUNmLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxNQUFNLEVBQUU7TUFFdkIsSUFBSSxDQUFDLFNBQVMsRUFBRTtNQUNoQjtJQUNGO0lBRUEsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUU7TUFFcEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUM7TUFDdEQ7SUFDRjtJQUVBLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7SUFDakQsSUFBSSxJQUFJLEVBQUU7TUFDUixRQUFRLElBQUksQ0FBQyxJQUFJO1FBQ2YsS0FBSyxJQUFJO1VBQ1AsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJO1VBQ2xCO1FBQ0YsS0FBSyxLQUFLO1VBQ1IsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2YsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLO1lBQ25CLElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxFQUFFO2NBQ3pDLElBQUksRUFBRSxJQUFJLElBQUk7WUFDaEIsQ0FBQyxDQUFDO1VBQ0o7VUFDQTtRQUNGLEtBQUssS0FBSztVQUNSLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDO1VBQ3hDO1FBQ0YsS0FBSyxLQUFLO1VBRVIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztVQUNyRTtRQUNGLEtBQUssS0FBSztVQUNSLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUNaLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7VUFDL0IsQ0FBQyxNQUFNO1lBQ0wsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLG1CQUFVLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztVQUNsRDtVQUNBLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxJQUFJLEVBQUU7VUFDekI7UUFDRixLQUFLLElBQUk7VUFFUCxJQUFJLENBQUMsSUFBSSxHQUFHO1lBQ1YsSUFBSSxFQUFFLElBQUksSUFBSSxFQUFFO1lBQ2hCLEVBQUUsRUFBRSxJQUFJLENBQUM7VUFDWCxDQUFDO1VBQ0Q7UUFDRixLQUFLLE1BQU07VUFFVCxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQztVQUN2QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRztVQUNoRTtRQUNGLEtBQUssTUFBTTtVQUVULElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDO1VBQ3ZCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHO1VBQ2hFLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJO1VBQ2xFLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSTtVQUNsQztRQUNGLEtBQUssTUFBTTtVQUVULElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2xCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSTtZQUNwQixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUs7WUFDdEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztVQUMvQyxDQUFDLE1BQU07WUFDTCxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztVQUNyQztVQUNBO1FBQ0YsS0FBSyxLQUFLO1VBRVI7UUFDRjtVQUNFLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLDJDQUEyQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUM7TUFBQztNQUdoRixJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO0lBQ3ZDLENBQUMsTUFBTTtNQUNMLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxLQUFLLEVBQUU7UUFJdEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxtQkFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDckMsSUFBSSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxJQUFJLG1CQUFVLENBQUMsUUFBUSxFQUFFO1VBQzNDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLG1DQUFtQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQztVQUM3RTtRQUNGLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxJQUFJLElBQUksbUJBQVUsQ0FBQyxLQUFLLEVBQUU7VUFDdkMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsNkNBQTZDLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDO1VBQ3ZGO1FBQ0YsQ0FBQyxNQUFNO1VBR0wsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7VUFFM0UsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztVQUM3QyxLQUFLLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHO1VBQ3RCLEtBQUssQ0FBQyxNQUFNLEdBQUcsS0FBSztVQUNwQixLQUFLLENBQUMsR0FBRyxHQUFHLEdBQUc7VUFDZixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO1FBQ2xDO01BQ0YsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxNQUFNLEVBQUU7UUFDOUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUM7TUFDeEQ7SUFDRjtJQUVBLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtNQUNmLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ25CO0VBQ0Y7RUFHQSxlQUFlLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRTtJQUMxQixJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7TUFDeEIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO0lBQ2xDO0VBQ0Y7RUFPQSxPQUFPLEdBQUc7SUFDUixPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMscUNBQXFDLENBQUMsQ0FBQztFQUN6RTtFQVVBLGFBQWEsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFO0lBQzNCLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO01BQ25CLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxpREFBaUQsQ0FBQyxDQUFDO0lBQ3JGO0lBRUEsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSTtNQUU1RCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBRSxFQUFFLElBQUs7UUFDaEQsT0FBTyxFQUFFLENBQUMsSUFBSSxJQUFJLE1BQU0sSUFBSSxFQUFFLENBQUMsR0FBRyxJQUFJLEtBQUs7TUFDN0MsQ0FBQyxDQUFDO01BQ0YsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUU7UUFDZCxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO01BQ3BDO01BRUEsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO1FBQ3ZCLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQztNQUN4QztNQUNBLE9BQU8sSUFBSTtJQUNiLENBQUMsQ0FBQztFQUNKO0VBaUJBLFFBQVEsQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRTtJQUNsQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEtBQUs7TUFDakMsSUFBSSxDQUFDLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDNUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQztNQUNoQztJQUNGLENBQUMsQ0FBQztFQUNKO0VBU0EsVUFBVSxDQUFDLElBQUksRUFBRTtJQUNmLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDO0VBQ3pDO0VBVUEsYUFBYSxDQUFDLElBQUksRUFBRTtJQUNsQixJQUFJLElBQUksRUFBRTtNQUNSLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQztNQUM3QyxPQUFPLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUk7SUFDL0I7SUFDQSxPQUFPLElBQUksQ0FBQyxHQUFHO0VBQ2pCO0VBU0EsVUFBVSxDQUFDLElBQUksRUFBRTtJQUNmLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQztJQUM3QyxPQUFPLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUk7RUFDcEQ7RUFnQkEsY0FBYyxHQUFHO0lBQ2YsT0FBTyxJQUFJLENBQUMsWUFBWTtFQUMxQjtBQUNGO0FBQUM7QUFVTSxNQUFNLFFBQVEsU0FBUyxLQUFLLENBQUM7RUFJbEMsV0FBVyxDQUFDLFNBQVMsRUFBRTtJQUNyQixLQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUM7SUFBQyxtQ0FIeEIsQ0FBQyxDQUFDO0VBSWQ7RUFHQSxlQUFlLENBQUMsSUFBSSxFQUFFO0lBQ3BCLElBQUksV0FBVyxHQUFHLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTTtJQUVuRSxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztJQUNuQixLQUFLLElBQUksR0FBRyxJQUFJLElBQUksRUFBRTtNQUNwQixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO01BQ25CLE1BQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsSUFBSTtNQUVoRCxHQUFHLEdBQUcsSUFBQSxtQkFBWSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLEdBQUcsQ0FBQztNQUNoRCxXQUFXLEVBQUU7TUFFYixJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7UUFDbEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUM7TUFDckI7SUFDRjtJQUVBLElBQUksV0FBVyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO01BQ3pDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDakQ7RUFDRjtFQU9BLE9BQU8sR0FBRztJQUNSLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO0VBQzFFO0VBUUEsT0FBTyxDQUFDLE1BQU0sRUFBRTtJQUNkLE9BQU8sTUFBTSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSTtNQUNwRixJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDMUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7UUFDbkIsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO1VBQ3RCLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDO1FBQ3hCO01BQ0Y7SUFDRixDQUFDLENBQUM7RUFDSjtFQVNBLFFBQVEsQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFO0lBQzFCLE1BQU0sRUFBRSxHQUFJLFFBQVEsSUFBSSxJQUFJLENBQUMsU0FBVTtJQUN2QyxJQUFJLEVBQUUsRUFBRTtNQUNOLEtBQUssSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtRQUM5QixFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDO01BQzVEO0lBQ0Y7RUFDRjtBQUNGO0FBQUM7OztBQ3IxRUQsWUFBWTs7QUFBQztFQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUViO0FBQ0E7QUFFcUI7QUFHZCxTQUFTLGVBQWUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFO0VBR3hDLElBQUksT0FBTyxHQUFHLElBQUksUUFBUSxJQUFJLEdBQUcsQ0FBQyxNQUFNLElBQUksRUFBRSxJQUFJLEdBQUcsQ0FBQyxNQUFNLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO0lBQ3pKLE1BQU0sSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQztJQUMxQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFO01BQ2hCLE9BQU8sSUFBSTtJQUNiO0VBQ0YsQ0FBQyxNQUFNLElBQUksR0FBRyxLQUFLLEtBQUssSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLEVBQUU7SUFDbkQsT0FBTyxJQUFJLG1CQUFVLENBQUMsR0FBRyxDQUFDO0VBQzVCO0VBQ0EsT0FBTyxHQUFHO0FBQ1o7QUFRTyxTQUFTLGFBQWEsQ0FBQyxHQUFHLEVBQUU7RUFDakMsT0FBTyxHQUFHLElBQUksQ0FBQyxpQ0FBaUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO0FBQzVEO0FBRUEsU0FBUyxXQUFXLENBQUMsQ0FBQyxFQUFFO0VBQ3RCLE9BQVEsQ0FBQyxZQUFZLElBQUksSUFBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSyxDQUFDLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBRTtBQUMvRDtBQUdPLFNBQVMsaUJBQWlCLENBQUMsQ0FBQyxFQUFFO0VBQ25DLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUU7SUFDbkIsT0FBTyxTQUFTO0VBQ2xCO0VBRUEsTUFBTSxHQUFHLEdBQUcsVUFBUyxHQUFHLEVBQUUsRUFBRSxFQUFFO0lBQzVCLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQztJQUNaLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxFQUFFLE1BQU0sQ0FBQyxHQUFHLEdBQUc7RUFDakQsQ0FBQztFQUVELE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxrQkFBa0IsRUFBRTtFQUNyQyxPQUFPLENBQUMsQ0FBQyxjQUFjLEVBQUUsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxHQUNwRixHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsYUFBYSxFQUFFLENBQUMsSUFDdkYsTUFBTSxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEdBQUc7QUFDOUM7QUFLTyxTQUFTLFFBQVEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRTtFQUN6QyxJQUFJLE9BQU8sR0FBRyxJQUFJLFFBQVEsRUFBRTtJQUMxQixJQUFJLEdBQUcsS0FBSyxTQUFTLEVBQUU7TUFDckIsT0FBTyxHQUFHO0lBQ1o7SUFDQSxJQUFJLEdBQUcsS0FBSyxnQkFBUSxFQUFFO01BQ3BCLE9BQU8sU0FBUztJQUNsQjtJQUNBLE9BQU8sR0FBRztFQUNaO0VBRUEsSUFBSSxHQUFHLEtBQUssSUFBSSxFQUFFO0lBQ2hCLE9BQU8sR0FBRztFQUNaO0VBR0EsSUFBSSxHQUFHLFlBQVksSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFO0lBQ3RDLE9BQVEsQ0FBQyxHQUFHLElBQUksRUFBRSxHQUFHLFlBQVksSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsR0FBRyxHQUFHLEdBQUksR0FBRyxHQUFHLEdBQUc7RUFDaEY7RUFHQSxJQUFJLEdBQUcsWUFBWSxtQkFBVSxFQUFFO0lBQzdCLE9BQU8sSUFBSSxtQkFBVSxDQUFDLEdBQUcsQ0FBQztFQUM1QjtFQUdBLElBQUksR0FBRyxZQUFZLEtBQUssRUFBRTtJQUN4QixPQUFPLEdBQUc7RUFDWjtFQUVBLElBQUksQ0FBQyxHQUFHLElBQUksR0FBRyxLQUFLLGdCQUFRLEVBQUU7SUFDNUIsR0FBRyxHQUFHLEdBQUcsQ0FBQyxXQUFXLEVBQUU7RUFDekI7RUFFQSxLQUFLLElBQUksSUFBSSxJQUFJLEdBQUcsRUFBRTtJQUNwQixJQUFJLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSyxJQUFJLElBQUksZUFBZ0IsRUFBRTtNQUN2RixJQUFJO1FBQ0YsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO01BQzVDLENBQUMsQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUVkO0lBQ0Y7RUFDRjtFQUNBLE9BQU8sR0FBRztBQUNaO0FBR08sU0FBUyxZQUFZLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFO0VBQ3ZELEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUM7RUFDakQsT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDO0FBQ25CO0FBSU8sU0FBUyxRQUFRLENBQUMsR0FBRyxFQUFFO0VBQzVCLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFFLEdBQUcsSUFBSztJQUNoQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLEVBQUU7TUFFakIsT0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ2pCLENBQUMsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFO01BRXBCLE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUNqQixDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO01BRTFELE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUNqQixDQUFDLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtNQUVwQixPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDakIsQ0FBQyxNQUFNLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxZQUFZLElBQUksRUFBRTtNQUVuQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO1FBQzFCLE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQztNQUNqQjtJQUNGLENBQUMsTUFBTSxJQUFJLE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLFFBQVEsRUFBRTtNQUN0QyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO01BRWxCLElBQUksTUFBTSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7UUFDcEQsT0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDO01BQ2pCO0lBQ0Y7RUFDRixDQUFDLENBQUM7RUFDRixPQUFPLEdBQUc7QUFDWjtBQUFDO0FBS00sU0FBUyxjQUFjLENBQUMsR0FBRyxFQUFFO0VBQ2xDLElBQUksR0FBRyxHQUFHLEVBQUU7RUFDWixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7SUFFdEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtNQUMxQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO01BQ2QsSUFBSSxDQUFDLEVBQUU7UUFDTCxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRTtRQUMxQixJQUFJLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1VBQ2hCLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2I7TUFDRjtJQUNGO0lBQ0EsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFTLElBQUksRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFO01BQ3pDLE9BQU8sQ0FBQyxHQUFHLElBQUksSUFBSSxJQUFJLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0lBQ3JDLENBQUMsQ0FBQztFQUNKO0VBQ0EsSUFBSSxHQUFHLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtJQUduQixHQUFHLENBQUMsSUFBSSxDQUFDLGdCQUFRLENBQUM7RUFDcEI7RUFDQSxPQUFPLEdBQUc7QUFDWjs7O0FDM0tBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKipcbiAqIEBmaWxlIEFjY2VzcyBjb250cm9sIG1vZGVsLlxuICpcbiAqIEBjb3B5cmlnaHQgMjAxNS0yMDIyIFRpbm9kZSBMTEMuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuLy8gTk9URSBUTyBERVZFTE9QRVJTOlxuLy8gTG9jYWxpemFibGUgc3RyaW5ncyBzaG91bGQgYmUgZG91YmxlIHF1b3RlZCBcItGB0YLRgNC+0LrQsCDQvdCwINC00YDRg9Cz0L7QvCDRj9C30YvQutC1XCIsXG4vLyBub24tbG9jYWxpemFibGUgc3RyaW5ncyBzaG91bGQgYmUgc2luZ2xlIHF1b3RlZCAnbm9uLWxvY2FsaXplZCcuXG5cbi8qKlxuICogSGVscGVyIGNsYXNzIGZvciBoYW5kbGluZyBhY2Nlc3MgbW9kZS5cbiAqXG4gKiBAY2xhc3MgQWNjZXNzTW9kZVxuICogQG1lbWJlcm9mIFRpbm9kZVxuICpcbiAqIEBwYXJhbSB7QWNjZXNzTW9kZXxPYmplY3Q9fSBhY3MgLSBBY2Nlc3NNb2RlIHRvIGNvcHkgb3IgYWNjZXNzIG1vZGUgb2JqZWN0IHJlY2VpdmVkIGZyb20gdGhlIHNlcnZlci5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWNjZXNzTW9kZSB7XG4gIGNvbnN0cnVjdG9yKGFjcykge1xuICAgIGlmIChhY3MpIHtcbiAgICAgIHRoaXMuZ2l2ZW4gPSB0eXBlb2YgYWNzLmdpdmVuID09ICdudW1iZXInID8gYWNzLmdpdmVuIDogQWNjZXNzTW9kZS5kZWNvZGUoYWNzLmdpdmVuKTtcbiAgICAgIHRoaXMud2FudCA9IHR5cGVvZiBhY3Mud2FudCA9PSAnbnVtYmVyJyA/IGFjcy53YW50IDogQWNjZXNzTW9kZS5kZWNvZGUoYWNzLndhbnQpO1xuICAgICAgdGhpcy5tb2RlID0gYWNzLm1vZGUgPyAodHlwZW9mIGFjcy5tb2RlID09ICdudW1iZXInID8gYWNzLm1vZGUgOiBBY2Nlc3NNb2RlLmRlY29kZShhY3MubW9kZSkpIDpcbiAgICAgICAgKHRoaXMuZ2l2ZW4gJiB0aGlzLndhbnQpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyAjY2hlY2tGbGFnKHZhbCwgc2lkZSwgZmxhZykge1xuICAgIHNpZGUgPSBzaWRlIHx8ICdtb2RlJztcbiAgICBpZiAoWydnaXZlbicsICd3YW50JywgJ21vZGUnXS5pbmNsdWRlcyhzaWRlKSkge1xuICAgICAgcmV0dXJuICgodmFsW3NpZGVdICYgZmxhZykgIT0gMCk7XG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBBY2Nlc3NNb2RlIGNvbXBvbmVudCAnJHtzaWRlfSdgKTtcbiAgfVxuICAvKipcbiAgICogUGFyc2Ugc3RyaW5nIGludG8gYW4gYWNjZXNzIG1vZGUgdmFsdWUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgTnVtYmVyfSBtb2RlIC0gZWl0aGVyIGEgU3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBhY2Nlc3MgbW9kZSB0byBwYXJzZSBvciBhIHNldCBvZiBiaXRzIHRvIGFzc2lnbi5cbiAgICogQHJldHVybnMge251bWJlcn0gLSBBY2Nlc3MgbW9kZSBhcyBhIG51bWVyaWMgdmFsdWUuXG4gICAqL1xuICBzdGF0aWMgZGVjb2RlKHN0cikge1xuICAgIGlmICghc3RyKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBzdHIgPT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiBzdHIgJiBBY2Nlc3NNb2RlLl9CSVRNQVNLO1xuICAgIH0gZWxzZSBpZiAoc3RyID09PSAnTicgfHwgc3RyID09PSAnbicpIHtcbiAgICAgIHJldHVybiBBY2Nlc3NNb2RlLl9OT05FO1xuICAgIH1cblxuICAgIGNvbnN0IGJpdG1hc2sgPSB7XG4gICAgICAnSic6IEFjY2Vzc01vZGUuX0pPSU4sXG4gICAgICAnUic6IEFjY2Vzc01vZGUuX1JFQUQsXG4gICAgICAnVyc6IEFjY2Vzc01vZGUuX1dSSVRFLFxuICAgICAgJ1AnOiBBY2Nlc3NNb2RlLl9QUkVTLFxuICAgICAgJ0EnOiBBY2Nlc3NNb2RlLl9BUFBST1ZFLFxuICAgICAgJ1MnOiBBY2Nlc3NNb2RlLl9TSEFSRSxcbiAgICAgICdEJzogQWNjZXNzTW9kZS5fREVMRVRFLFxuICAgICAgJ08nOiBBY2Nlc3NNb2RlLl9PV05FUlxuICAgIH07XG5cbiAgICBsZXQgbTAgPSBBY2Nlc3NNb2RlLl9OT05FO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGJpdCA9IGJpdG1hc2tbc3RyLmNoYXJBdChpKS50b1VwcGVyQ2FzZSgpXTtcbiAgICAgIGlmICghYml0KSB7XG4gICAgICAgIC8vIFVucmVjb2duaXplZCBiaXQsIHNraXAuXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgbTAgfD0gYml0O1xuICAgIH1cbiAgICByZXR1cm4gbTA7XG4gIH1cbiAgLyoqXG4gICAqIENvbnZlcnQgbnVtZXJpYyByZXByZXNlbnRhdGlvbiBvZiB0aGUgYWNjZXNzIG1vZGUgaW50byBhIHN0cmluZy5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHZhbCAtIGFjY2VzcyBtb2RlIHZhbHVlIHRvIGNvbnZlcnQgdG8gYSBzdHJpbmcuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IC0gQWNjZXNzIG1vZGUgYXMgYSBzdHJpbmcuXG4gICAqL1xuICBzdGF0aWMgZW5jb2RlKHZhbCkge1xuICAgIGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSBBY2Nlc3NNb2RlLl9JTlZBTElEKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9IGVsc2UgaWYgKHZhbCA9PT0gQWNjZXNzTW9kZS5fTk9ORSkge1xuICAgICAgcmV0dXJuICdOJztcbiAgICB9XG5cbiAgICBjb25zdCBiaXRtYXNrID0gWydKJywgJ1InLCAnVycsICdQJywgJ0EnLCAnUycsICdEJywgJ08nXTtcbiAgICBsZXQgcmVzID0gJyc7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBiaXRtYXNrLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoKHZhbCAmICgxIDw8IGkpKSAhPSAwKSB7XG4gICAgICAgIHJlcyA9IHJlcyArIGJpdG1hc2tbaV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXM7XG4gIH1cbiAgLyoqXG4gICAqIFVwZGF0ZSBudW1lcmljIHJlcHJlc2VudGF0aW9uIG9mIGFjY2VzcyBtb2RlIHdpdGggdGhlIG5ldyB2YWx1ZS4gVGhlIHZhbHVlXG4gICAqIGlzIG9uZSBvZiB0aGUgZm9sbG93aW5nOlxuICAgKiAgLSBhIHN0cmluZyBzdGFydGluZyB3aXRoIDxjb2RlPicrJzwvY29kZT4gb3IgPGNvZGU+Jy0nPC9jb2RlPiB0aGVuIHRoZSBiaXRzIHRvIGFkZCBvciByZW1vdmUsIGUuZy4gPGNvZGU+JytSLVcnPC9jb2RlPiBvciA8Y29kZT4nLVBTJzwvY29kZT4uXG4gICAqICAtIGEgbmV3IHZhbHVlIG9mIGFjY2VzcyBtb2RlXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB2YWwgLSBhY2Nlc3MgbW9kZSB2YWx1ZSB0byB1cGRhdGUuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1cGQgLSB1cGRhdGUgdG8gYXBwbHkgdG8gdmFsLlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSAtIHVwZGF0ZWQgYWNjZXNzIG1vZGUuXG4gICAqL1xuICBzdGF0aWMgdXBkYXRlKHZhbCwgdXBkKSB7XG4gICAgaWYgKCF1cGQgfHwgdHlwZW9mIHVwZCAhPSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIHZhbDtcbiAgICB9XG5cbiAgICBsZXQgYWN0aW9uID0gdXBkLmNoYXJBdCgwKTtcbiAgICBpZiAoYWN0aW9uID09ICcrJyB8fCBhY3Rpb24gPT0gJy0nKSB7XG4gICAgICBsZXQgdmFsMCA9IHZhbDtcbiAgICAgIC8vIFNwbGl0IGRlbHRhLXN0cmluZyBsaWtlICcrQUJDLURFRitaJyBpbnRvIGFuIGFycmF5IG9mIHBhcnRzIGluY2x1ZGluZyArIGFuZCAtLlxuICAgICAgY29uc3QgcGFydHMgPSB1cGQuc3BsaXQoLyhbLStdKS8pO1xuICAgICAgLy8gU3RhcnRpbmcgaXRlcmF0aW9uIGZyb20gMSBiZWNhdXNlIFN0cmluZy5zcGxpdCgpIGNyZWF0ZXMgYW4gYXJyYXkgd2l0aCB0aGUgZmlyc3QgZW1wdHkgZWxlbWVudC5cbiAgICAgIC8vIEl0ZXJhdGluZyBieSAyIGJlY2F1c2Ugd2UgcGFyc2UgcGFpcnMgKy8tIHRoZW4gZGF0YS5cbiAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgcGFydHMubGVuZ3RoIC0gMTsgaSArPSAyKSB7XG4gICAgICAgIGFjdGlvbiA9IHBhcnRzW2ldO1xuICAgICAgICBjb25zdCBtMCA9IEFjY2Vzc01vZGUuZGVjb2RlKHBhcnRzW2kgKyAxXSk7XG4gICAgICAgIGlmIChtMCA9PSBBY2Nlc3NNb2RlLl9JTlZBTElEKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAobTAgPT0gbnVsbCkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhY3Rpb24gPT09ICcrJykge1xuICAgICAgICAgIHZhbDAgfD0gbTA7XG4gICAgICAgIH0gZWxzZSBpZiAoYWN0aW9uID09PSAnLScpIHtcbiAgICAgICAgICB2YWwwICY9IH5tMDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdmFsID0gdmFsMDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVGhlIHN0cmluZyBpcyBhbiBleHBsaWNpdCBuZXcgdmFsdWUgJ0FCQycgcmF0aGVyIHRoYW4gZGVsdGEuXG4gICAgICBjb25zdCB2YWwwID0gQWNjZXNzTW9kZS5kZWNvZGUodXBkKTtcbiAgICAgIGlmICh2YWwwICE9IEFjY2Vzc01vZGUuX0lOVkFMSUQpIHtcbiAgICAgICAgdmFsID0gdmFsMDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdmFsO1xuICB9XG4gIC8qKlxuICAgKiBCaXRzIHByZXNlbnQgaW4gYTEgYnV0IG1pc3NpbmcgaW4gYTIuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlciB8IHN0cmluZ30gYTEgLSBhY2Nlc3MgbW9kZSB0byBzdWJ0cmFjdCBmcm9tLlxuICAgKiBAcGFyYW0ge251bWJlciB8IHN0cmluZ30gYTIgLSBhY2Nlc3MgbW9kZSB0byBzdWJ0cmFjdC5cbiAgICogQHJldHVybnMge251bWJlcn0gYWNjZXNzIG1vZGUgd2l0aCBiaXRzIHByZXNlbnQgaW4gPGNvZGU+YTE8L2NvZGU+IGJ1dCBtaXNzaW5nIGluIDxjb2RlPmEyPC9jb2RlPi5cbiAgICovXG4gIHN0YXRpYyBkaWZmKGExLCBhMikge1xuICAgIGExID0gQWNjZXNzTW9kZS5kZWNvZGUoYTEpO1xuICAgIGEyID0gQWNjZXNzTW9kZS5kZWNvZGUoYTIpO1xuXG4gICAgaWYgKGExID09IEFjY2Vzc01vZGUuX0lOVkFMSUQgfHwgYTIgPT0gQWNjZXNzTW9kZS5fSU5WQUxJRCkge1xuICAgICAgcmV0dXJuIEFjY2Vzc01vZGUuX0lOVkFMSUQ7XG4gICAgfVxuICAgIHJldHVybiBhMSAmIH5hMjtcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIEN1c3RvbSBmb3JtYXR0ZXJcbiAgICovXG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiAne1wibW9kZVwiOiBcIicgKyBBY2Nlc3NNb2RlLmVuY29kZSh0aGlzLm1vZGUpICtcbiAgICAgICdcIiwgXCJnaXZlblwiOiBcIicgKyBBY2Nlc3NNb2RlLmVuY29kZSh0aGlzLmdpdmVuKSArXG4gICAgICAnXCIsIFwid2FudFwiOiBcIicgKyBBY2Nlc3NNb2RlLmVuY29kZSh0aGlzLndhbnQpICsgJ1wifSc7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBudW1lcmljIHZhbHVlcyB0byBzdHJpbmdzLlxuICAgKi9cbiAganNvbkhlbHBlcigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbW9kZTogQWNjZXNzTW9kZS5lbmNvZGUodGhpcy5tb2RlKSxcbiAgICAgIGdpdmVuOiBBY2Nlc3NNb2RlLmVuY29kZSh0aGlzLmdpdmVuKSxcbiAgICAgIHdhbnQ6IEFjY2Vzc01vZGUuZW5jb2RlKHRoaXMud2FudClcbiAgICB9O1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQXNzaWduIHZhbHVlIHRvICdtb2RlJy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgTnVtYmVyfSBtIC0gZWl0aGVyIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBhY2Nlc3MgbW9kZSBvciBhIHNldCBvZiBiaXRzLlxuICAgKiBAcmV0dXJucyB7QWNjZXNzTW9kZX0gLSA8Y29kZT50aGlzPC9jb2RlPiBBY2Nlc3NNb2RlLlxuICAgKi9cbiAgc2V0TW9kZShtKSB7XG4gICAgdGhpcy5tb2RlID0gQWNjZXNzTW9kZS5kZWNvZGUobSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBVcGRhdGUgPGNvZGU+bW9kZTwvY29kZT4gdmFsdWUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdSAtIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgY2hhbmdlcyB0byBhcHBseSB0byBhY2Nlc3MgbW9kZS5cbiAgICogQHJldHVybnMge0FjY2Vzc01vZGV9IC0gPGNvZGU+dGhpczwvY29kZT4gQWNjZXNzTW9kZS5cbiAgICovXG4gIHVwZGF0ZU1vZGUodSkge1xuICAgIHRoaXMubW9kZSA9IEFjY2Vzc01vZGUudXBkYXRlKHRoaXMubW9kZSwgdSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBHZXQgPGNvZGU+bW9kZTwvY29kZT4gdmFsdWUgYXMgYSBzdHJpbmcuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSAtIDxjb2RlPm1vZGU8L2NvZGU+IHZhbHVlLlxuICAgKi9cbiAgZ2V0TW9kZSgpIHtcbiAgICByZXR1cm4gQWNjZXNzTW9kZS5lbmNvZGUodGhpcy5tb2RlKTtcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIEFzc2lnbiA8Y29kZT5naXZlbjwvY29kZT4gIHZhbHVlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmcgfCBOdW1iZXJ9IGcgLSBlaXRoZXIgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIGFjY2VzcyBtb2RlIG9yIGEgc2V0IG9mIGJpdHMuXG4gICAqIEByZXR1cm5zIHtBY2Nlc3NNb2RlfSAtIDxjb2RlPnRoaXM8L2NvZGU+IEFjY2Vzc01vZGUuXG4gICAqL1xuICBzZXRHaXZlbihnKSB7XG4gICAgdGhpcy5naXZlbiA9IEFjY2Vzc01vZGUuZGVjb2RlKGcpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogVXBkYXRlICdnaXZlbicgdmFsdWUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdSAtIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgY2hhbmdlcyB0byBhcHBseSB0byBhY2Nlc3MgbW9kZS5cbiAgICogQHJldHVybnMge0FjY2Vzc01vZGV9IC0gPGNvZGU+dGhpczwvY29kZT4gQWNjZXNzTW9kZS5cbiAgICovXG4gIHVwZGF0ZUdpdmVuKHUpIHtcbiAgICB0aGlzLmdpdmVuID0gQWNjZXNzTW9kZS51cGRhdGUodGhpcy5naXZlbiwgdSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBHZXQgJ2dpdmVuJyB2YWx1ZSBhcyBhIHN0cmluZy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IC0gPGI+Z2l2ZW48L2I+IHZhbHVlLlxuICAgKi9cbiAgZ2V0R2l2ZW4oKSB7XG4gICAgcmV0dXJuIEFjY2Vzc01vZGUuZW5jb2RlKHRoaXMuZ2l2ZW4pO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQXNzaWduICd3YW50JyB2YWx1ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgTnVtYmVyfSB3IC0gZWl0aGVyIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBhY2Nlc3MgbW9kZSBvciBhIHNldCBvZiBiaXRzLlxuICAgKiBAcmV0dXJucyB7QWNjZXNzTW9kZX0gLSA8Y29kZT50aGlzPC9jb2RlPiBBY2Nlc3NNb2RlLlxuICAgKi9cbiAgc2V0V2FudCh3KSB7XG4gICAgdGhpcy53YW50ID0gQWNjZXNzTW9kZS5kZWNvZGUodyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBVcGRhdGUgJ3dhbnQnIHZhbHVlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHUgLSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIGNoYW5nZXMgdG8gYXBwbHkgdG8gYWNjZXNzIG1vZGUuXG4gICAqIEByZXR1cm5zIHtBY2Nlc3NNb2RlfSAtIDxjb2RlPnRoaXM8L2NvZGU+IEFjY2Vzc01vZGUuXG4gICAqL1xuICB1cGRhdGVXYW50KHUpIHtcbiAgICB0aGlzLndhbnQgPSBBY2Nlc3NNb2RlLnVwZGF0ZSh0aGlzLndhbnQsIHUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogR2V0ICd3YW50JyB2YWx1ZSBhcyBhIHN0cmluZy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IC0gPGI+d2FudDwvYj4gdmFsdWUuXG4gICAqL1xuICBnZXRXYW50KCkge1xuICAgIHJldHVybiBBY2Nlc3NNb2RlLmVuY29kZSh0aGlzLndhbnQpO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogR2V0IHBlcm1pc3Npb25zIHByZXNlbnQgaW4gJ3dhbnQnIGJ1dCBtaXNzaW5nIGluICdnaXZlbicuXG4gICAqIEludmVyc2Ugb2Yge0BsaW5rIFRpbm9kZS5BY2Nlc3NNb2RlI2dldEV4Y2Vzc2l2ZX1cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IHBlcm1pc3Npb25zIHByZXNlbnQgaW4gPGI+d2FudDwvYj4gYnV0IG1pc3NpbmcgaW4gPGI+Z2l2ZW48L2I+LlxuICAgKi9cbiAgZ2V0TWlzc2luZygpIHtcbiAgICByZXR1cm4gQWNjZXNzTW9kZS5lbmNvZGUodGhpcy53YW50ICYgfnRoaXMuZ2l2ZW4pO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogR2V0IHBlcm1pc3Npb25zIHByZXNlbnQgaW4gJ2dpdmVuJyBidXQgbWlzc2luZyBpbiAnd2FudCcuXG4gICAqIEludmVyc2Ugb2Yge0BsaW5rIFRpbm9kZS5BY2Nlc3NNb2RlI2dldE1pc3Npbmd9XG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBwZXJtaXNzaW9ucyBwcmVzZW50IGluIDxiPmdpdmVuPC9iPiBidXQgbWlzc2luZyBpbiA8Yj53YW50PC9iPi5cbiAgICovXG4gIGdldEV4Y2Vzc2l2ZSgpIHtcbiAgICByZXR1cm4gQWNjZXNzTW9kZS5lbmNvZGUodGhpcy5naXZlbiAmIH50aGlzLndhbnQpO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogVXBkYXRlICd3YW50JywgJ2dpdmUnLCBhbmQgJ21vZGUnIHZhbHVlcy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEBwYXJhbSB7QWNjZXNzTW9kZX0gdmFsIC0gbmV3IGFjY2VzcyBtb2RlIHZhbHVlLlxuICAgKiBAcmV0dXJucyB7QWNjZXNzTW9kZX0gLSA8Y29kZT50aGlzPC9jb2RlPiBBY2Nlc3NNb2RlLlxuICAgKi9cbiAgdXBkYXRlQWxsKHZhbCkge1xuICAgIGlmICh2YWwpIHtcbiAgICAgIHRoaXMudXBkYXRlR2l2ZW4odmFsLmdpdmVuKTtcbiAgICAgIHRoaXMudXBkYXRlV2FudCh2YWwud2FudCk7XG4gICAgICB0aGlzLm1vZGUgPSB0aGlzLmdpdmVuICYgdGhpcy53YW50O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIENoZWNrIGlmIE93bmVyIChPKSBmbGFnIGlzIHNldC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gc2lkZSAtIHdoaWNoIHBlcm1pc3Npb24gdG8gY2hlY2s6IGdpdmVuLCB3YW50LCBtb2RlOyBkZWZhdWx0OiBtb2RlLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiBmbGFnIGlzIHNldC5cbiAgICovXG4gIGlzT3duZXIoc2lkZSkge1xuICAgIHJldHVybiBBY2Nlc3NNb2RlLiNjaGVja0ZsYWcodGhpcywgc2lkZSwgQWNjZXNzTW9kZS5fT1dORVIpO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQ2hlY2sgaWYgUHJlc2VuY2UgKFApIGZsYWcgaXMgc2V0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICogQHBhcmFtIHtzdHJpbmc9fSBzaWRlIC0gd2hpY2ggcGVybWlzc2lvbiB0byBjaGVjazogZ2l2ZW4sIHdhbnQsIG1vZGU7IGRlZmF1bHQ6IG1vZGUuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIGZsYWcgaXMgc2V0LlxuICAgKi9cbiAgaXNQcmVzZW5jZXIoc2lkZSkge1xuICAgIHJldHVybiBBY2Nlc3NNb2RlLiNjaGVja0ZsYWcodGhpcywgc2lkZSwgQWNjZXNzTW9kZS5fUFJFUyk7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBDaGVjayBpZiBQcmVzZW5jZSAoUCkgZmxhZyBpcyBOT1Qgc2V0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICogQHBhcmFtIHtzdHJpbmc9fSBzaWRlIC0gd2hpY2ggcGVybWlzc2lvbiB0byBjaGVjazogZ2l2ZW4sIHdhbnQsIG1vZGU7IGRlZmF1bHQ6IG1vZGUuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIGZsYWcgaXMgc2V0LlxuICAgKi9cbiAgaXNNdXRlZChzaWRlKSB7XG4gICAgcmV0dXJuICF0aGlzLmlzUHJlc2VuY2VyKHNpZGUpO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQ2hlY2sgaWYgSm9pbiAoSikgZmxhZyBpcyBzZXQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IHNpZGUgLSB3aGljaCBwZXJtaXNzaW9uIHRvIGNoZWNrOiBnaXZlbiwgd2FudCwgbW9kZTsgZGVmYXVsdDogbW9kZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgZmxhZyBpcyBzZXQuXG4gICAqL1xuICBpc0pvaW5lcihzaWRlKSB7XG4gICAgcmV0dXJuIEFjY2Vzc01vZGUuI2NoZWNrRmxhZyh0aGlzLCBzaWRlLCBBY2Nlc3NNb2RlLl9KT0lOKTtcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIENoZWNrIGlmIFJlYWRlciAoUikgZmxhZyBpcyBzZXQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IHNpZGUgLSB3aGljaCBwZXJtaXNzaW9uIHRvIGNoZWNrOiBnaXZlbiwgd2FudCwgbW9kZTsgZGVmYXVsdDogbW9kZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgZmxhZyBpcyBzZXQuXG4gICAqL1xuICBpc1JlYWRlcihzaWRlKSB7XG4gICAgcmV0dXJuIEFjY2Vzc01vZGUuI2NoZWNrRmxhZyh0aGlzLCBzaWRlLCBBY2Nlc3NNb2RlLl9SRUFEKTtcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIENoZWNrIGlmIFdyaXRlciAoVykgZmxhZyBpcyBzZXQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IHNpZGUgLSB3aGljaCBwZXJtaXNzaW9uIHRvIGNoZWNrOiBnaXZlbiwgd2FudCwgbW9kZTsgZGVmYXVsdDogbW9kZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgZmxhZyBpcyBzZXQuXG4gICAqL1xuICBpc1dyaXRlcihzaWRlKSB7XG4gICAgcmV0dXJuIEFjY2Vzc01vZGUuI2NoZWNrRmxhZyh0aGlzLCBzaWRlLCBBY2Nlc3NNb2RlLl9XUklURSk7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBDaGVjayBpZiBBcHByb3ZlciAoQSkgZmxhZyBpcyBzZXQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IHNpZGUgLSB3aGljaCBwZXJtaXNzaW9uIHRvIGNoZWNrOiBnaXZlbiwgd2FudCwgbW9kZTsgZGVmYXVsdDogbW9kZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgZmxhZyBpcyBzZXQuXG4gICAqL1xuICBpc0FwcHJvdmVyKHNpZGUpIHtcbiAgICByZXR1cm4gQWNjZXNzTW9kZS4jY2hlY2tGbGFnKHRoaXMsIHNpZGUsIEFjY2Vzc01vZGUuX0FQUFJPVkUpO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQ2hlY2sgaWYgZWl0aGVyIG9uZSBvZiBPd25lciAoTykgb3IgQXBwcm92ZXIgKEEpIGZsYWdzIGlzIHNldC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gc2lkZSAtIHdoaWNoIHBlcm1pc3Npb24gdG8gY2hlY2s6IGdpdmVuLCB3YW50LCBtb2RlOyBkZWZhdWx0OiBtb2RlLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiBmbGFnIGlzIHNldC5cbiAgICovXG4gIGlzQWRtaW4oc2lkZSkge1xuICAgIHJldHVybiB0aGlzLmlzT3duZXIoc2lkZSkgfHwgdGhpcy5pc0FwcHJvdmVyKHNpZGUpO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQ2hlY2sgaWYgZWl0aGVyIG9uZSBvZiBPd25lciAoTyksIEFwcHJvdmVyIChBKSwgb3IgU2hhcmVyIChTKSBmbGFncyBpcyBzZXQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IHNpZGUgLSB3aGljaCBwZXJtaXNzaW9uIHRvIGNoZWNrOiBnaXZlbiwgd2FudCwgbW9kZTsgZGVmYXVsdDogbW9kZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgZmxhZyBpcyBzZXQuXG4gICAqL1xuICBpc1NoYXJlcihzaWRlKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNBZG1pbihzaWRlKSB8fCBBY2Nlc3NNb2RlLiNjaGVja0ZsYWcodGhpcywgc2lkZSwgQWNjZXNzTW9kZS5fU0hBUkUpO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQ2hlY2sgaWYgRGVsZXRlciAoRCkgZmxhZyBpcyBzZXQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IHNpZGUgLSB3aGljaCBwZXJtaXNzaW9uIHRvIGNoZWNrOiBnaXZlbiwgd2FudCwgbW9kZTsgZGVmYXVsdDogbW9kZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgZmxhZyBpcyBzZXQuXG4gICAqL1xuICBpc0RlbGV0ZXIoc2lkZSkge1xuICAgIHJldHVybiBBY2Nlc3NNb2RlLiNjaGVja0ZsYWcodGhpcywgc2lkZSwgQWNjZXNzTW9kZS5fREVMRVRFKTtcbiAgfVxufVxuXG5BY2Nlc3NNb2RlLl9OT05FID0gMHgwMDtcbkFjY2Vzc01vZGUuX0pPSU4gPSAweDAxO1xuQWNjZXNzTW9kZS5fUkVBRCA9IDB4MDI7XG5BY2Nlc3NNb2RlLl9XUklURSA9IDB4MDQ7XG5BY2Nlc3NNb2RlLl9QUkVTID0gMHgwODtcbkFjY2Vzc01vZGUuX0FQUFJPVkUgPSAweDEwO1xuQWNjZXNzTW9kZS5fU0hBUkUgPSAweDIwO1xuQWNjZXNzTW9kZS5fREVMRVRFID0gMHg0MDtcbkFjY2Vzc01vZGUuX09XTkVSID0gMHg4MDtcblxuQWNjZXNzTW9kZS5fQklUTUFTSyA9IEFjY2Vzc01vZGUuX0pPSU4gfCBBY2Nlc3NNb2RlLl9SRUFEIHwgQWNjZXNzTW9kZS5fV1JJVEUgfCBBY2Nlc3NNb2RlLl9QUkVTIHxcbiAgQWNjZXNzTW9kZS5fQVBQUk9WRSB8IEFjY2Vzc01vZGUuX1NIQVJFIHwgQWNjZXNzTW9kZS5fREVMRVRFIHwgQWNjZXNzTW9kZS5fT1dORVI7XG5BY2Nlc3NNb2RlLl9JTlZBTElEID0gMHgxMDAwMDA7XG4iLCIvKipcbiAqIEBmaWxlIEluLW1lbW9yeSBzb3J0ZWQgY2FjaGUgb2Ygb2JqZWN0cy5cbiAqXG4gKiBAY29weXJpZ2h0IDIwMTUtMjAyMiBUaW5vZGUgTExDLlxuICovXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogSW4tbWVtb3J5IHNvcnRlZCBjYWNoZSBvZiBvYmplY3RzLlxuICpcbiAqIEBjbGFzcyBDQnVmZmVyXG4gKiBAbWVtYmVyb2YgVGlub2RlXG4gKiBAcHJvdGVjdGVkXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbn0gY29tcGFyZSBjdXN0b20gY29tcGFyYXRvciBvZiBvYmplY3RzLiBUYWtlcyB0d28gcGFyYW1ldGVycyA8Y29kZT5hPC9jb2RlPiBhbmQgPGNvZGU+YjwvY29kZT47XG4gKiAgICByZXR1cm5zIDxjb2RlPi0xPC9jb2RlPiBpZiA8Y29kZT5hIDwgYjwvY29kZT4sIDxjb2RlPjA8L2NvZGU+IGlmIDxjb2RlPmEgPT0gYjwvY29kZT4sIDxjb2RlPjE8L2NvZGU+IG90aGVyd2lzZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gdW5pcXVlIGVuZm9yY2UgZWxlbWVudCB1bmlxdWVuZXNzOiB3aGVuIDxjb2RlPnRydWU8L2NvZGU+IHJlcGxhY2UgZXhpc3RpbmcgZWxlbWVudCB3aXRoIGEgbmV3XG4gKiAgICBvbmUgb24gY29uZmxpY3Q7IHdoZW4gPGNvZGU+ZmFsc2U8L2NvZGU+IGtlZXAgYm90aCBlbGVtZW50cy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ0J1ZmZlciB7XG4gICNjb21wYXJhdG9yID0gdW5kZWZpbmVkO1xuICAjdW5pcXVlID0gZmFsc2U7XG4gIGJ1ZmZlciA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKGNvbXBhcmVfLCB1bmlxdWVfKSB7XG4gICAgdGhpcy4jY29tcGFyYXRvciA9IGNvbXBhcmVfIHx8ICgoYSwgYikgPT4ge1xuICAgICAgcmV0dXJuIGEgPT09IGIgPyAwIDogYSA8IGIgPyAtMSA6IDE7XG4gICAgfSk7XG4gICAgdGhpcy4jdW5pcXVlID0gdW5pcXVlXztcbiAgfVxuXG4gICNmaW5kTmVhcmVzdChlbGVtLCBhcnIsIGV4YWN0KSB7XG4gICAgbGV0IHN0YXJ0ID0gMDtcbiAgICBsZXQgZW5kID0gYXJyLmxlbmd0aCAtIDE7XG4gICAgbGV0IHBpdm90ID0gMDtcbiAgICBsZXQgZGlmZiA9IDA7XG4gICAgbGV0IGZvdW5kID0gZmFsc2U7XG5cbiAgICB3aGlsZSAoc3RhcnQgPD0gZW5kKSB7XG4gICAgICBwaXZvdCA9IChzdGFydCArIGVuZCkgLyAyIHwgMDtcbiAgICAgIGRpZmYgPSB0aGlzLiNjb21wYXJhdG9yKGFycltwaXZvdF0sIGVsZW0pO1xuICAgICAgaWYgKGRpZmYgPCAwKSB7XG4gICAgICAgIHN0YXJ0ID0gcGl2b3QgKyAxO1xuICAgICAgfSBlbHNlIGlmIChkaWZmID4gMCkge1xuICAgICAgICBlbmQgPSBwaXZvdCAtIDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZm91bmQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlkeDogcGl2b3QsXG4gICAgICAgIGV4YWN0OiB0cnVlXG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAoZXhhY3QpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlkeDogLTFcbiAgICAgIH07XG4gICAgfVxuICAgIC8vIE5vdCBleGFjdCAtIGluc2VydGlvbiBwb2ludFxuICAgIHJldHVybiB7XG4gICAgICBpZHg6IGRpZmYgPCAwID8gcGl2b3QgKyAxIDogcGl2b3RcbiAgICB9O1xuICB9XG5cbiAgLy8gSW5zZXJ0IGVsZW1lbnQgaW50byBhIHNvcnRlZCBhcnJheS5cbiAgI2luc2VydFNvcnRlZChlbGVtLCBhcnIpIHtcbiAgICBjb25zdCBmb3VuZCA9IHRoaXMuI2ZpbmROZWFyZXN0KGVsZW0sIGFyciwgZmFsc2UpO1xuICAgIGNvbnN0IGNvdW50ID0gKGZvdW5kLmV4YWN0ICYmIHRoaXMuI3VuaXF1ZSkgPyAxIDogMDtcbiAgICBhcnIuc3BsaWNlKGZvdW5kLmlkeCwgY291bnQsIGVsZW0pO1xuICAgIHJldHVybiBhcnI7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGFuIGVsZW1lbnQgYXQgdGhlIGdpdmVuIHBvc2l0aW9uLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNCdWZmZXIjXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBhdCAtIFBvc2l0aW9uIHRvIGZldGNoIGZyb20uXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IEVsZW1lbnQgYXQgdGhlIGdpdmVuIHBvc2l0aW9uIG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4uXG4gICAqL1xuICBnZXRBdChhdCkge1xuICAgIHJldHVybiB0aGlzLmJ1ZmZlclthdF07XG4gIH1cblxuICAvKipcbiAgICogQ29udmVuaWVuY2UgbWV0aG9kIGZvciBnZXR0aW5nIHRoZSBlbGVtZW50IGZyb20gdGhlIGVuZCBvZiB0aGUgYnVmZmVyLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNCdWZmZXIjXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBhdCAtIHBvc2l0aW9uIHRvIGZldGNoIGZyb20sIGNvdW50aW5nIGZyb20gdGhlIGVuZDtcbiAgICogICAgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPiBvciA8Y29kZT5udWxsPC9jb2RlPiAgbWVhbiBcImxhc3RcIi5cbiAgICogQHJldHVybnMge09iamVjdH0gVGhlIGxhc3QgZWxlbWVudCBpbiB0aGUgYnVmZmVyIG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4gaWYgYnVmZmVyIGlzIGVtcHR5LlxuICAgKi9cbiAgZ2V0TGFzdChhdCkge1xuICAgIGF0IHw9IDA7XG4gICAgcmV0dXJuIHRoaXMuYnVmZmVyLmxlbmd0aCA+IGF0ID8gdGhpcy5idWZmZXJbdGhpcy5idWZmZXIubGVuZ3RoIC0gMSAtIGF0XSA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgbmV3IGVsZW1lbnQocykgdG8gdGhlIGJ1ZmZlci4gVmFyaWFkaWM6IHRha2VzIG9uZSBvciBtb3JlIGFyZ3VtZW50cy4gSWYgYW4gYXJyYXkgaXMgcGFzc2VkIGFzIGEgc2luZ2xlXG4gICAqIGFyZ3VtZW50LCBpdHMgZWxlbWVudHMgYXJlIGluc2VydGVkIGluZGl2aWR1YWxseS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKlxuICAgKiBAcGFyYW0gey4uLk9iamVjdHxBcnJheX0gLSBPbmUgb3IgbW9yZSBvYmplY3RzIHRvIGluc2VydC5cbiAgICovXG4gIHB1dCgpIHtcbiAgICBsZXQgaW5zZXJ0O1xuICAgIC8vIGluc3BlY3QgYXJndW1lbnRzOiBpZiBhcnJheSwgaW5zZXJ0IGl0cyBlbGVtZW50cywgaWYgb25lIG9yIG1vcmUgbm9uLWFycmF5IGFyZ3VtZW50cywgaW5zZXJ0IHRoZW0gb25lIGJ5IG9uZVxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDEgJiYgQXJyYXkuaXNBcnJheShhcmd1bWVudHNbMF0pKSB7XG4gICAgICBpbnNlcnQgPSBhcmd1bWVudHNbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGluc2VydCA9IGFyZ3VtZW50cztcbiAgICB9XG4gICAgZm9yIChsZXQgaWR4IGluIGluc2VydCkge1xuICAgICAgdGhpcy4jaW5zZXJ0U29ydGVkKGluc2VydFtpZHhdLCB0aGlzLmJ1ZmZlcik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBlbGVtZW50IGF0IHRoZSBnaXZlbiBwb3NpdGlvbi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKiBAcGFyYW0ge251bWJlcn0gYXQgLSBQb3NpdGlvbiB0byBkZWxldGUgYXQuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IEVsZW1lbnQgYXQgdGhlIGdpdmVuIHBvc2l0aW9uIG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4uXG4gICAqL1xuICBkZWxBdChhdCkge1xuICAgIGF0IHw9IDA7XG4gICAgbGV0IHIgPSB0aGlzLmJ1ZmZlci5zcGxpY2UoYXQsIDEpO1xuICAgIGlmIChyICYmIHIubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIHJbMF07XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGVsZW1lbnRzIGJldHdlZW4gdHdvIHBvc2l0aW9ucy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKiBAcGFyYW0ge251bWJlcn0gc2luY2UgLSBQb3NpdGlvbiB0byBkZWxldGUgZnJvbSAoaW5jbHVzaXZlKS5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGJlZm9yZSAtIFBvc2l0aW9uIHRvIGRlbGV0ZSB0byAoZXhjbHVzaXZlKS5cbiAgICpcbiAgICogQHJldHVybnMge0FycmF5fSBhcnJheSBvZiByZW1vdmVkIGVsZW1lbnRzIChjb3VsZCBiZSB6ZXJvIGxlbmd0aCkuXG4gICAqL1xuICBkZWxSYW5nZShzaW5jZSwgYmVmb3JlKSB7XG4gICAgcmV0dXJuIHRoaXMuYnVmZmVyLnNwbGljZShzaW5jZSwgYmVmb3JlIC0gc2luY2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIHRoZSBidWZmZXIgaG9sZHMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ0J1ZmZlciNcbiAgICogQHJldHVybiB7bnVtYmVyfSBOdW1iZXIgb2YgZWxlbWVudHMgaW4gdGhlIGJ1ZmZlci5cbiAgICovXG4gIGxlbmd0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5idWZmZXIubGVuZ3RoO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0IHRoZSBidWZmZXIgZGlzY2FyZGluZyBhbGwgZWxlbWVudHNcbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKi9cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5idWZmZXIgPSBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayBmb3IgaXRlcmF0aW5nIGNvbnRlbnRzIG9mIGJ1ZmZlci4gU2VlIHtAbGluayBUaW5vZGUuQ0J1ZmZlciNmb3JFYWNofS5cbiAgICogQGNhbGxiYWNrIEZvckVhY2hDYWxsYmFja1R5cGVcbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKiBAcGFyYW0ge09iamVjdH0gZWxlbSAtIEN1cnJlbnQgZWxlbWVudCBvZiB0aGUgYnVmZmVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gcHJldiAtIFByZXZpb3VzIGVsZW1lbnQgb2YgdGhlIGJ1ZmZlci5cbiAgICogQHBhcmFtIHtPYmplY3R9IG5leHQgLSBOZXh0IGVsZW1lbnQgb2YgdGhlIGJ1ZmZlci5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IC0gSW5kZXggb2YgdGhlIGN1cnJlbnQgZWxlbWVudC5cbiAgICovXG5cbiAgLyoqXG4gICAqIEFwcGx5IGdpdmVuIDxjb2RlPmNhbGxiYWNrPC9jb2RlPiB0byBhbGwgZWxlbWVudHMgb2YgdGhlIGJ1ZmZlci5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5Gb3JFYWNoQ2FsbGJhY2tUeXBlfSBjYWxsYmFjayAtIEZ1bmN0aW9uIHRvIGNhbGwgZm9yIGVhY2ggZWxlbWVudC5cbiAgICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0SWR4IC0gT3B0aW9uYWwgaW5kZXggdG8gc3RhcnQgaXRlcmF0aW5nIGZyb20gKGluY2x1c2l2ZSkuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBiZWZvcmVJZHggLSBPcHRpb25hbCBpbmRleCB0byBzdG9wIGl0ZXJhdGluZyBiZWZvcmUgKGV4Y2x1c2l2ZSkuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gY2FsbGluZyBjb250ZXh0IChpLmUuIHZhbHVlIG9mIDxjb2RlPnRoaXM8L2NvZGU+IGluIGNhbGxiYWNrKVxuICAgKi9cbiAgZm9yRWFjaChjYWxsYmFjaywgc3RhcnRJZHgsIGJlZm9yZUlkeCwgY29udGV4dCkge1xuICAgIHN0YXJ0SWR4ID0gc3RhcnRJZHggfCAwO1xuICAgIGJlZm9yZUlkeCA9IGJlZm9yZUlkeCB8fCB0aGlzLmJ1ZmZlci5sZW5ndGg7XG5cbiAgICBmb3IgKGxldCBpID0gc3RhcnRJZHg7IGkgPCBiZWZvcmVJZHg7IGkrKykge1xuICAgICAgY2FsbGJhY2suY2FsbChjb250ZXh0LCB0aGlzLmJ1ZmZlcltpXSxcbiAgICAgICAgKGkgPiBzdGFydElkeCA/IHRoaXMuYnVmZmVyW2kgLSAxXSA6IHVuZGVmaW5lZCksXG4gICAgICAgIChpIDwgYmVmb3JlSWR4IC0gMSA/IHRoaXMuYnVmZmVyW2kgKyAxXSA6IHVuZGVmaW5lZCksIGkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kIGVsZW1lbnQgaW4gYnVmZmVyIHVzaW5nIGJ1ZmZlcidzIGNvbXBhcmlzb24gZnVuY3Rpb24uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ0J1ZmZlciNcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IGVsZW0gLSBlbGVtZW50IHRvIGZpbmQuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IG5lYXJlc3QgLSB3aGVuIHRydWUgYW5kIGV4YWN0IG1hdGNoIGlzIG5vdCBmb3VuZCwgcmV0dXJuIHRoZSBuZWFyZXN0IGVsZW1lbnQgKGluc2VydGlvbiBwb2ludCkuXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IGluZGV4IG9mIHRoZSBlbGVtZW50IGluIHRoZSBidWZmZXIgb3IgLTEuXG4gICAqL1xuICBmaW5kKGVsZW0sIG5lYXJlc3QpIHtcbiAgICBjb25zdCB7XG4gICAgICBpZHhcbiAgICB9ID0gdGhpcy4jZmluZE5lYXJlc3QoZWxlbSwgdGhpcy5idWZmZXIsICFuZWFyZXN0KTtcbiAgICByZXR1cm4gaWR4O1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIGZvciBmaWx0ZXJpbmcgdGhlIGJ1ZmZlci4gU2VlIHtAbGluayBUaW5vZGUuQ0J1ZmZlciNmaWx0ZXJ9LlxuICAgKiBAY2FsbGJhY2sgRmlsdGVyQ2FsbGJhY2tUeXBlXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ0J1ZmZlciNcbiAgICogQHBhcmFtIHtPYmplY3R9IGVsZW0gLSBDdXJyZW50IGVsZW1lbnQgb2YgdGhlIGJ1ZmZlci5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IC0gSW5kZXggb2YgdGhlIGN1cnJlbnQgZWxlbWVudC5cbiAgICogQHJldHVybnMge2Jvb2xlbn0gPGNvZGU+dHJ1ZTwvY29kZT4gdG8ga2VlcCB0aGUgZWxlbWVudCwgPGNvZGU+ZmFsc2U8L2NvZGU+IHRvIHJlbW92ZS5cbiAgICovXG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbGwgZWxlbWVudHMgdGhhdCBkbyBub3QgcGFzcyB0aGUgdGVzdCBpbXBsZW1lbnRlZCBieSB0aGUgcHJvdmlkZWQgY2FsbGJhY2sgZnVuY3Rpb24uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ0J1ZmZlciNcbiAgICpcbiAgICogQHBhcmFtIHtUaW5vZGUuRmlsdGVyQ2FsbGJhY2tUeXBlfSBjYWxsYmFjayAtIEZ1bmN0aW9uIHRvIGNhbGwgZm9yIGVhY2ggZWxlbWVudC5cbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSBjYWxsaW5nIGNvbnRleHQgKGkuZS4gdmFsdWUgb2YgPGNvZGU+dGhpczwvY29kZT4gaW4gdGhlIGNhbGxiYWNrKVxuICAgKi9cbiAgZmlsdGVyKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgbGV0IGNvdW50ID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYnVmZmVyLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoY2FsbGJhY2suY2FsbChjb250ZXh0LCB0aGlzLmJ1ZmZlcltpXSwgaSkpIHtcbiAgICAgICAgdGhpcy5idWZmZXJbY291bnRdID0gdGhpcy5idWZmZXJbaV07XG4gICAgICAgIGNvdW50Kys7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5idWZmZXIuc3BsaWNlKGNvdW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBidWZmZXIgaXMgZW1wdHkuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGUgYnVmZmVyIGlzIGVtcHR5LCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNFbXB0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5idWZmZXIubGVuZ3RoID09IDA7XG4gIH1cbn1cbiIsIi8qKlxuICogQGZpbGUgVGhyb3dhYmxlIGVycm9yIHdpdGggbnVtZXJpYyBlcnJvciBjb2RlLlxuICpcbiAqIEBjb3B5cmlnaHQgMjAxNS0yMDIzIFRpbm9kZSBMTEMuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tbUVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihtZXNzYWdlLCBjb2RlKSB7XG4gICAgc3VwZXIoYCR7bWVzc2FnZX0gKCR7Y29kZX0pYCk7XG4gICAgdGhpcy5uYW1lID0gJ0NvbW1FcnJvcic7XG4gICAgdGhpcy5jb2RlID0gY29kZTtcbiAgfVxufVxuIiwiLyoqXG4gKiBAZmlsZSBHbG9iYWwgY29uc3RhbnRzIGFuZCBjb25maWd1cmF0aW9uIHBhcmFtZXRlcnMuXG4gKlxuICogQGNvcHlyaWdodCAyMDE1LTIwMjIgVGlub2RlIExMQ1xuICovXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7XG4gIHZlcnNpb24gYXMgcGFja2FnZV92ZXJzaW9uXG59IGZyb20gJy4uL3ZlcnNpb24uanNvbic7XG5cbi8vIEdsb2JhbCBjb25zdGFudHNcbmV4cG9ydCBjb25zdCBQUk9UT0NPTF9WRVJTSU9OID0gJzAnOyAvLyBNYWpvciBjb21wb25lbnQgb2YgdGhlIHZlcnNpb24sIGUuZy4gJzAnIGluICcwLjE3LjEnLlxuZXhwb3J0IGNvbnN0IFZFUlNJT04gPSBwYWNrYWdlX3ZlcnNpb24gfHwgJzAuMjAnO1xuZXhwb3J0IGNvbnN0IExJQlJBUlkgPSAndGlub2RlanMvJyArIFZFUlNJT047XG5cbi8vIFRvcGljIG5hbWUgcHJlZml4ZXMuXG5leHBvcnQgY29uc3QgVE9QSUNfTkVXID0gJ25ldyc7XG5leHBvcnQgY29uc3QgVE9QSUNfTkVXX0NIQU4gPSAnbmNoJztcbmV4cG9ydCBjb25zdCBUT1BJQ19NRSA9ICdtZSc7XG5leHBvcnQgY29uc3QgVE9QSUNfRk5EID0gJ2ZuZCc7XG5leHBvcnQgY29uc3QgVE9QSUNfU1lTID0gJ3N5cyc7XG5leHBvcnQgY29uc3QgVE9QSUNfQ0hBTiA9ICdjaG4nO1xuZXhwb3J0IGNvbnN0IFRPUElDX0dSUCA9ICdncnAnO1xuZXhwb3J0IGNvbnN0IFRPUElDX1AyUCA9ICdwMnAnO1xuZXhwb3J0IGNvbnN0IFVTRVJfTkVXID0gJ25ldyc7XG5cbi8vIFN0YXJ0aW5nIHZhbHVlIG9mIGEgbG9jYWxseS1nZW5lcmF0ZWQgc2VxSWQgdXNlZCBmb3IgcGVuZGluZyBtZXNzYWdlcy5cbmV4cG9ydCBjb25zdCBMT0NBTF9TRVFJRCA9IDB4RkZGRkZGRjtcblxuLy8gU3RhdHVzIGNvZGVzLlxuZXhwb3J0IGNvbnN0IE1FU1NBR0VfU1RBVFVTX05PTkUgPSAwOyAvLyBTdGF0dXMgbm90IGFzc2lnbmVkLlxuZXhwb3J0IGNvbnN0IE1FU1NBR0VfU1RBVFVTX1FVRVVFRCA9IDE7IC8vIExvY2FsIElEIGFzc2lnbmVkLCBpbiBwcm9ncmVzcyB0byBiZSBzZW50LlxuZXhwb3J0IGNvbnN0IE1FU1NBR0VfU1RBVFVTX1NFTkRJTkcgPSAyOyAvLyBUcmFuc21pc3Npb24gc3RhcnRlZC5cbmV4cG9ydCBjb25zdCBNRVNTQUdFX1NUQVRVU19GQUlMRUQgPSAzOyAvLyBBdCBsZWFzdCBvbmUgYXR0ZW1wdCB3YXMgbWFkZSB0byBzZW5kIHRoZSBtZXNzYWdlLlxuZXhwb3J0IGNvbnN0IE1FU1NBR0VfU1RBVFVTX1NFTlQgPSA0OyAvLyBEZWxpdmVyZWQgdG8gdGhlIHNlcnZlci5cbmV4cG9ydCBjb25zdCBNRVNTQUdFX1NUQVRVU19SRUNFSVZFRCA9IDU7IC8vIFJlY2VpdmVkIGJ5IHRoZSBjbGllbnQuXG5leHBvcnQgY29uc3QgTUVTU0FHRV9TVEFUVVNfUkVBRCA9IDY7IC8vIFJlYWQgYnkgdGhlIHVzZXIuXG5leHBvcnQgY29uc3QgTUVTU0FHRV9TVEFUVVNfVE9fTUUgPSA3OyAvLyBUaGUgbWVzc2FnZSBpcyByZWNlaXZlZCBmcm9tIGFub3RoZXIgdXNlci5cblxuLy8gUmVqZWN0IHVucmVzb2x2ZWQgZnV0dXJlcyBhZnRlciB0aGlzIG1hbnkgbWlsbGlzZWNvbmRzLlxuZXhwb3J0IGNvbnN0IEVYUElSRV9QUk9NSVNFU19USU1FT1VUID0gNV8wMDA7XG4vLyBQZXJpb2RpY2l0eSBvZiBnYXJiYWdlIGNvbGxlY3Rpb24gb2YgdW5yZXNvbHZlZCBmdXR1cmVzLlxuZXhwb3J0IGNvbnN0IEVYUElSRV9QUk9NSVNFU19QRVJJT0QgPSAxXzAwMDtcblxuLy8gRGVsYXkgYmVmb3JlIGFja25vd2xlZGdpbmcgdGhhdCBhIG1lc3NhZ2Ugd2FzIHJlY2l2ZWQuXG5leHBvcnQgY29uc3QgUkVDVl9USU1FT1VUID0gMTAwO1xuXG4vLyBEZWZhdWx0IG51bWJlciBvZiBtZXNzYWdlcyB0byBwdWxsIGludG8gbWVtb3J5IGZyb20gcGVyc2lzdGVudCBjYWNoZS5cbmV4cG9ydCBjb25zdCBERUZBVUxUX01FU1NBR0VTX1BBR0UgPSAyNDtcblxuLy8gVW5pY29kZSBERUwgY2hhcmFjdGVyIGluZGljYXRpbmcgZGF0YSB3YXMgZGVsZXRlZC5cbmV4cG9ydCBjb25zdCBERUxfQ0hBUiA9ICdcXHUyNDIxJztcbiIsIi8qKlxuICogQGZpbGUgQWJzdHJhY3Rpb24gbGF5ZXIgZm9yIHdlYnNvY2tldCBhbmQgbG9uZyBwb2xsaW5nIGNvbm5lY3Rpb25zLlxuICpcbiAqIEBjb3B5cmlnaHQgMjAxNS0yMDIyIFRpbm9kZSBMTEMuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IENvbW1FcnJvciBmcm9tICcuL2NvbW0tZXJyb3IuanMnO1xuaW1wb3J0IHtcbiAganNvblBhcnNlSGVscGVyXG59IGZyb20gJy4vdXRpbHMuanMnO1xuXG5sZXQgV2ViU29ja2V0UHJvdmlkZXI7XG5sZXQgWEhSUHJvdmlkZXI7XG5cbi8vIEVycm9yIGNvZGUgdG8gcmV0dXJuIGluIGNhc2Ugb2YgYSBuZXR3b3JrIHByb2JsZW0uXG5jb25zdCBORVRXT1JLX0VSUk9SID0gNTAzO1xuY29uc3QgTkVUV09SS19FUlJPUl9URVhUID0gXCJDb25uZWN0aW9uIGZhaWxlZFwiO1xuXG4vLyBFcnJvciBjb2RlIHRvIHJldHVybiB3aGVuIHVzZXIgZGlzY29ubmVjdGVkIGZyb20gc2VydmVyLlxuY29uc3QgTkVUV09SS19VU0VSID0gNDE4O1xuY29uc3QgTkVUV09SS19VU0VSX1RFWFQgPSBcIkRpc2Nvbm5lY3RlZCBieSBjbGllbnRcIjtcblxuLy8gU2V0dGluZ3MgZm9yIGV4cG9uZW50aWFsIGJhY2tvZmZcbmNvbnN0IF9CT0ZGX0JBU0UgPSAyMDAwOyAvLyAyMDAwIG1pbGxpc2Vjb25kcywgbWluaW11bSBkZWxheSBiZXR3ZWVuIHJlY29ubmVjdHNcbmNvbnN0IF9CT0ZGX01BWF9JVEVSID0gMTA7IC8vIE1heGltdW0gZGVsYXkgYmV0d2VlbiByZWNvbm5lY3RzIDJeMTAgKiAyMDAwIH4gMzQgbWludXRlc1xuY29uc3QgX0JPRkZfSklUVEVSID0gMC4zOyAvLyBBZGQgcmFuZG9tIGRlbGF5XG5cbi8vIEhlbHBlciBmdW5jdGlvbiBmb3IgY3JlYXRpbmcgYW4gZW5kcG9pbnQgVVJMLlxuZnVuY3Rpb24gbWFrZUJhc2VVcmwoaG9zdCwgcHJvdG9jb2wsIHZlcnNpb24sIGFwaUtleSkge1xuICBsZXQgdXJsID0gbnVsbDtcblxuICBpZiAoWydodHRwJywgJ2h0dHBzJywgJ3dzJywgJ3dzcyddLmluY2x1ZGVzKHByb3RvY29sKSkge1xuICAgIHVybCA9IGAke3Byb3RvY29sfTovLyR7aG9zdH1gO1xuICAgIGlmICh1cmwuY2hhckF0KHVybC5sZW5ndGggLSAxKSAhPT0gJy8nKSB7XG4gICAgICB1cmwgKz0gJy8nO1xuICAgIH1cbiAgICB1cmwgKz0gJ3YnICsgdmVyc2lvbiArICcvY2hhbm5lbHMnO1xuICAgIGlmIChbJ2h0dHAnLCAnaHR0cHMnXS5pbmNsdWRlcyhwcm90b2NvbCkpIHtcbiAgICAgIC8vIExvbmcgcG9sbGluZyBlbmRwb2ludCBlbmRzIHdpdGggXCJscFwiLCBpLmUuXG4gICAgICAvLyAnL3YwL2NoYW5uZWxzL2xwJyB2cyBqdXN0ICcvdjAvY2hhbm5lbHMnIGZvciB3c1xuICAgICAgdXJsICs9ICcvbHAnO1xuICAgIH1cbiAgICB1cmwgKz0gJz9hcGlrZXk9JyArIGFwaUtleTtcbiAgfVxuICByZXR1cm4gdXJsO1xufVxuXG4vKipcbiAqIEFuIGFic3RyYWN0aW9uIGZvciBhIHdlYnNvY2tldCBvciBhIGxvbmcgcG9sbGluZyBjb25uZWN0aW9uLlxuICpcbiAqIEBjbGFzcyBDb25uZWN0aW9uXG4gKiBAbWVtYmVyb2YgVGlub2RlXG5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgLSBjb25maWd1cmF0aW9uIHBhcmFtZXRlcnMuXG4gKiBAcGFyYW0ge3N0cmluZ30gY29uZmlnLmhvc3QgLSBIb3N0IG5hbWUgYW5kIG9wdGlvbmFsIHBvcnQgbnVtYmVyIHRvIGNvbm5lY3QgdG8uXG4gKiBAcGFyYW0ge3N0cmluZ30gY29uZmlnLmFwaUtleSAtIEFQSSBrZXkgZ2VuZXJhdGVkIGJ5IDxjb2RlPmtleWdlbjwvY29kZT4uXG4gKiBAcGFyYW0ge3N0cmluZ30gY29uZmlnLnRyYW5zcG9ydCAtIE5ldHdvcmsgdHJhbnNwb3J0IHRvIHVzZSwgZWl0aGVyIDxjb2RlPlwid3NcIjxjb2RlPi88Y29kZT5cIndzc1wiPC9jb2RlPiBmb3Igd2Vic29ja2V0IG9yXG4gKiAgICAgIDxjb2RlPmxwPC9jb2RlPiBmb3IgbG9uZyBwb2xsaW5nLlxuICogQHBhcmFtIHtib29sZWFufSBjb25maWcuc2VjdXJlIC0gVXNlIFNlY3VyZSBXZWJTb2NrZXQgaWYgPGNvZGU+dHJ1ZTwvY29kZT4uXG4gKiBAcGFyYW0ge3N0cmluZ30gdmVyc2lvbl8gLSBNYWpvciB2YWx1ZSBvZiB0aGUgcHJvdG9jb2wgdmVyc2lvbiwgZS5nLiAnMCcgaW4gJzAuMTcuMScuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGF1dG9yZWNvbm5lY3RfIC0gSWYgY29ubmVjdGlvbiBpcyBsb3N0LCB0cnkgdG8gcmVjb25uZWN0IGF1dG9tYXRpY2FsbHkuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbm5lY3Rpb24ge1xuICAvLyBMb2dnZXIsIGRvZXMgbm90aGluZyBieSBkZWZhdWx0LlxuICBzdGF0aWMgI2xvZyA9IF8gPT4ge307XG5cbiAgI2JvZmZUaW1lciA9IG51bGw7XG4gICNib2ZmSXRlcmF0aW9uID0gMDtcbiAgI2JvZmZDbG9zZWQgPSBmYWxzZTsgLy8gSW5kaWNhdG9yIGlmIHRoZSBzb2NrZXQgd2FzIG1hbnVhbGx5IGNsb3NlZCAtIGRvbid0IGF1dG9yZWNvbm5lY3QgaWYgdHJ1ZS5cblxuICAvLyBXZWJzb2NrZXQuXG4gICNzb2NrZXQgPSBudWxsO1xuXG4gIGhvc3Q7XG4gIHNlY3VyZTtcbiAgYXBpS2V5O1xuXG4gIHZlcnNpb247XG4gIGF1dG9yZWNvbm5lY3Q7XG5cbiAgaW5pdGlhbGl6ZWQ7XG5cbiAgLy8gKGNvbmZpZy5ob3N0LCBjb25maWcuYXBpS2V5LCBjb25maWcudHJhbnNwb3J0LCBjb25maWcuc2VjdXJlKSwgUFJPVE9DT0xfVkVSU0lPTiwgdHJ1ZVxuICBjb25zdHJ1Y3Rvcihjb25maWcsIHZlcnNpb25fLCBhdXRvcmVjb25uZWN0Xykge1xuICAgIHRoaXMuaG9zdCA9IGNvbmZpZy5ob3N0O1xuICAgIHRoaXMuc2VjdXJlID0gY29uZmlnLnNlY3VyZTtcbiAgICB0aGlzLmFwaUtleSA9IGNvbmZpZy5hcGlLZXk7XG5cbiAgICB0aGlzLnZlcnNpb24gPSB2ZXJzaW9uXztcbiAgICB0aGlzLmF1dG9yZWNvbm5lY3QgPSBhdXRvcmVjb25uZWN0XztcblxuICAgIGlmIChjb25maWcudHJhbnNwb3J0ID09PSAnbHAnKSB7XG4gICAgICAvLyBleHBsaWNpdCByZXF1ZXN0IHRvIHVzZSBsb25nIHBvbGxpbmdcbiAgICAgIHRoaXMuI2luaXRfbHAoKTtcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSAnbHAnO1xuICAgIH0gZWxzZSBpZiAoY29uZmlnLnRyYW5zcG9ydCA9PT0gJ3dzJykge1xuICAgICAgLy8gZXhwbGljaXQgcmVxdWVzdCB0byB1c2Ugd2ViIHNvY2tldFxuICAgICAgLy8gaWYgd2Vic29ja2V0cyBhcmUgbm90IGF2YWlsYWJsZSwgaG9ycmlibGUgdGhpbmdzIHdpbGwgaGFwcGVuXG4gICAgICB0aGlzLiNpbml0X3dzKCk7XG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gJ3dzJztcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuaW5pdGlhbGl6ZWQpIHtcbiAgICAgIC8vIEludmFsaWQgb3IgdW5kZWZpbmVkIG5ldHdvcmsgdHJhbnNwb3J0LlxuICAgICAgQ29ubmVjdGlvbi4jbG9nKFwiVW5rbm93biBvciBpbnZhbGlkIG5ldHdvcmsgdHJhbnNwb3J0LiBSdW5uaW5nIHVuZGVyIE5vZGU/IENhbGwgJ1Rpbm9kZS5zZXROZXR3b3JrUHJvdmlkZXJzKCknLlwiKTtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlVua25vd24gb3IgaW52YWxpZCBuZXR3b3JrIHRyYW5zcG9ydC4gUnVubmluZyB1bmRlciBOb2RlPyBDYWxsICdUaW5vZGUuc2V0TmV0d29ya1Byb3ZpZGVycygpJy5cIik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRvIHVzZSBDb25uZWN0aW9uIGluIGEgbm9uIGJyb3dzZXIgY29udGV4dCwgc3VwcGx5IFdlYlNvY2tldCBhbmQgWE1MSHR0cFJlcXVlc3QgcHJvdmlkZXJzLlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJvZiBDb25uZWN0aW9uXG4gICAqIEBwYXJhbSB3c1Byb3ZpZGVyIFdlYlNvY2tldCBwcm92aWRlciwgZS5nLiBmb3Igbm9kZUpTICwgPGNvZGU+cmVxdWlyZSgnd3MnKTwvY29kZT4uXG4gICAqIEBwYXJhbSB4aHJQcm92aWRlciBYTUxIdHRwUmVxdWVzdCBwcm92aWRlciwgZS5nLiBmb3Igbm9kZSA8Y29kZT5yZXF1aXJlKCd4aHInKTwvY29kZT4uXG4gICAqL1xuICBzdGF0aWMgc2V0TmV0d29ya1Byb3ZpZGVycyh3c1Byb3ZpZGVyLCB4aHJQcm92aWRlcikge1xuICAgIFdlYlNvY2tldFByb3ZpZGVyID0gd3NQcm92aWRlcjtcbiAgICBYSFJQcm92aWRlciA9IHhoclByb3ZpZGVyO1xuICB9XG5cbiAgLyoqXG4gICAqIEFzc2lnbiBhIG5vbi1kZWZhdWx0IGxvZ2dlci5cbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyb2YgQ29ubmVjdGlvblxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBsIHZhcmlhZGljIGxvZ2dpbmcgZnVuY3Rpb24uXG4gICAqL1xuICBzdGF0aWMgc2V0IGxvZ2dlcihsKSB7XG4gICAgQ29ubmVjdGlvbi4jbG9nID0gbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWF0ZSBhIG5ldyBjb25uZWN0aW9uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ29ubmVjdGlvbiNcbiAgICogQHBhcmFtIHtzdHJpbmd9IGhvc3RfIEhvc3QgbmFtZSB0byBjb25uZWN0IHRvOyBpZiA8Y29kZT5udWxsPC9jb2RlPiB0aGUgb2xkIGhvc3QgbmFtZSB3aWxsIGJlIHVzZWQuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gZm9yY2UgRm9yY2UgbmV3IGNvbm5lY3Rpb24gZXZlbiBpZiBvbmUgYWxyZWFkeSBleGlzdHMuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IFByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgY29ubmVjdGlvbiBjYWxsIGNvbXBsZXRlcywgcmVzb2x1dGlvbiBpcyBjYWxsZWQgd2l0aG91dFxuICAgKiAgcGFyYW1ldGVycywgcmVqZWN0aW9uIHBhc3NlcyB0aGUge0Vycm9yfSBhcyBwYXJhbWV0ZXIuXG4gICAqL1xuICBjb25uZWN0KGhvc3RfLCBmb3JjZSkge1xuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChudWxsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcnkgdG8gcmVzdG9yZSBhIG5ldHdvcmsgY29ubmVjdGlvbiwgYWxzbyByZXNldCBiYWNrb2ZmLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gZm9yY2UgLSByZWNvbm5lY3QgZXZlbiBpZiB0aGVyZSBpcyBhIGxpdmUgY29ubmVjdGlvbiBhbHJlYWR5LlxuICAgKi9cbiAgcmVjb25uZWN0KGZvcmNlKSB7fVxuXG4gIC8qKlxuICAgKiBUZXJtaW5hdGUgdGhlIG5ldHdvcmsgY29ubmVjdGlvblxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAqL1xuICBkaXNjb25uZWN0KCkge31cblxuICAvKipcbiAgICogU2VuZCBhIHN0cmluZyB0byB0aGUgc2VydmVyLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtc2cgLSBTdHJpbmcgdG8gc2VuZC5cbiAgICogQHRocm93cyBUaHJvd3MgYW4gZXhjZXB0aW9uIGlmIHRoZSB1bmRlcmx5aW5nIGNvbm5lY3Rpb24gaXMgbm90IGxpdmUuXG4gICAqL1xuICBzZW5kVGV4dChtc2cpIHt9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGNvbm5lY3Rpb24gaXMgYWxpdmUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ29ubmVjdGlvbiNcbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIGNvbm5lY3Rpb24gaXMgbGl2ZSwgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIGlzQ29ubmVjdGVkKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIG5hbWUgb2YgdGhlIGN1cnJlbnQgbmV0d29yayB0cmFuc3BvcnQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ29ubmVjdGlvbiNcbiAgICogQHJldHVybnMge3N0cmluZ30gbmFtZSBvZiB0aGUgdHJhbnNwb3J0IHN1Y2ggYXMgPGNvZGU+XCJ3c1wiPC9jb2RlPiBvciA8Y29kZT5cImxwXCI8L2NvZGU+LlxuICAgKi9cbiAgdHJhbnNwb3J0KCkge1xuICAgIHJldHVybiB0aGlzLmluaXRpYWxpemVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgbmV0d29yayBwcm9iZSB0byBjaGVjayBpZiBjb25uZWN0aW9uIGlzIGluZGVlZCBsaXZlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAqL1xuICBwcm9iZSgpIHtcbiAgICB0aGlzLnNlbmRUZXh0KCcxJyk7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXQgYXV0b3JlY29ubmVjdCBjb3VudGVyIHRvIHplcm8uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ29ubmVjdGlvbiNcbiAgICovXG4gIGJhY2tvZmZSZXNldCgpIHtcbiAgICB0aGlzLiNib2ZmUmVzZXQoKTtcbiAgfVxuXG4gIC8vIEJhY2tvZmYgaW1wbGVtZW50YXRpb24gLSByZWNvbm5lY3QgYWZ0ZXIgYSB0aW1lb3V0LlxuICAjYm9mZlJlY29ubmVjdCgpIHtcbiAgICAvLyBDbGVhciB0aW1lclxuICAgIGNsZWFyVGltZW91dCh0aGlzLiNib2ZmVGltZXIpO1xuICAgIC8vIENhbGN1bGF0ZSB3aGVuIHRvIGZpcmUgdGhlIHJlY29ubmVjdCBhdHRlbXB0XG4gICAgY29uc3QgdGltZW91dCA9IF9CT0ZGX0JBU0UgKiAoTWF0aC5wb3coMiwgdGhpcy4jYm9mZkl0ZXJhdGlvbikgKiAoMS4wICsgX0JPRkZfSklUVEVSICogTWF0aC5yYW5kb20oKSkpO1xuICAgIC8vIFVwZGF0ZSBpdGVyYXRpb24gY291bnRlciBmb3IgZnV0dXJlIHVzZVxuICAgIHRoaXMuI2JvZmZJdGVyYXRpb24gPSAodGhpcy4jYm9mZkl0ZXJhdGlvbiA+PSBfQk9GRl9NQVhfSVRFUiA/IHRoaXMuI2JvZmZJdGVyYXRpb24gOiB0aGlzLiNib2ZmSXRlcmF0aW9uICsgMSk7XG4gICAgaWYgKHRoaXMub25BdXRvcmVjb25uZWN0SXRlcmF0aW9uKSB7XG4gICAgICB0aGlzLm9uQXV0b3JlY29ubmVjdEl0ZXJhdGlvbih0aW1lb3V0KTtcbiAgICB9XG5cbiAgICB0aGlzLiNib2ZmVGltZXIgPSBzZXRUaW1lb3V0KF8gPT4ge1xuICAgICAgQ29ubmVjdGlvbi4jbG9nKGBSZWNvbm5lY3RpbmcsIGl0ZXI9JHt0aGlzLiNib2ZmSXRlcmF0aW9ufSwgdGltZW91dD0ke3RpbWVvdXR9YCk7XG4gICAgICAvLyBNYXliZSB0aGUgc29ja2V0IHdhcyBjbG9zZWQgd2hpbGUgd2Ugd2FpdGVkIGZvciB0aGUgdGltZXI/XG4gICAgICBpZiAoIXRoaXMuI2JvZmZDbG9zZWQpIHtcbiAgICAgICAgY29uc3QgcHJvbSA9IHRoaXMuY29ubmVjdCgpO1xuICAgICAgICBpZiAodGhpcy5vbkF1dG9yZWNvbm5lY3RJdGVyYXRpb24pIHtcbiAgICAgICAgICB0aGlzLm9uQXV0b3JlY29ubmVjdEl0ZXJhdGlvbigwLCBwcm9tKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBTdXBwcmVzcyBlcnJvciBpZiBpdCdzIG5vdCB1c2VkLlxuICAgICAgICAgIHByb20uY2F0Y2goXyA9PiB7XG4gICAgICAgICAgICAvKiBkbyBub3RoaW5nICovXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5vbkF1dG9yZWNvbm5lY3RJdGVyYXRpb24pIHtcbiAgICAgICAgdGhpcy5vbkF1dG9yZWNvbm5lY3RJdGVyYXRpb24oLTEpO1xuICAgICAgfVxuICAgIH0sIHRpbWVvdXQpO1xuICB9XG5cbiAgLy8gVGVybWluYXRlIGF1dG8tcmVjb25uZWN0IHByb2Nlc3MuXG4gICNib2ZmU3RvcCgpIHtcbiAgICBjbGVhclRpbWVvdXQodGhpcy4jYm9mZlRpbWVyKTtcbiAgICB0aGlzLiNib2ZmVGltZXIgPSBudWxsO1xuICB9XG5cbiAgLy8gUmVzZXQgYXV0by1yZWNvbm5lY3QgaXRlcmF0aW9uIGNvdW50ZXIuXG4gICNib2ZmUmVzZXQoKSB7XG4gICAgdGhpcy4jYm9mZkl0ZXJhdGlvbiA9IDA7XG4gIH1cblxuICAvLyBJbml0aWFsaXphdGlvbiBmb3IgbG9uZyBwb2xsaW5nLlxuICAjaW5pdF9scCgpIHtcbiAgICBjb25zdCBYRFJfVU5TRU5UID0gMDsgLy8gQ2xpZW50IGhhcyBiZWVuIGNyZWF0ZWQuIG9wZW4oKSBub3QgY2FsbGVkIHlldC5cbiAgICBjb25zdCBYRFJfT1BFTkVEID0gMTsgLy8gb3BlbigpIGhhcyBiZWVuIGNhbGxlZC5cbiAgICBjb25zdCBYRFJfSEVBREVSU19SRUNFSVZFRCA9IDI7IC8vIHNlbmQoKSBoYXMgYmVlbiBjYWxsZWQsIGFuZCBoZWFkZXJzIGFuZCBzdGF0dXMgYXJlIGF2YWlsYWJsZS5cbiAgICBjb25zdCBYRFJfTE9BRElORyA9IDM7IC8vIERvd25sb2FkaW5nOyByZXNwb25zZVRleHQgaG9sZHMgcGFydGlhbCBkYXRhLlxuICAgIGNvbnN0IFhEUl9ET05FID0gNDsgLy8gVGhlIG9wZXJhdGlvbiBpcyBjb21wbGV0ZS5cblxuICAgIC8vIEZ1bGx5IGNvbXBvc2VkIGVuZHBvaW50IFVSTCwgd2l0aCBBUEkga2V5ICYgU0lEXG4gICAgbGV0IF9scFVSTCA9IG51bGw7XG5cbiAgICBsZXQgX3BvbGxlciA9IG51bGw7XG4gICAgbGV0IF9zZW5kZXIgPSBudWxsO1xuXG4gICAgbGV0IGxwX3NlbmRlciA9ICh1cmxfKSA9PiB7XG4gICAgICBjb25zdCBzZW5kZXIgPSBuZXcgWEhSUHJvdmlkZXIoKTtcbiAgICAgIHNlbmRlci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoZXZ0KSA9PiB7XG4gICAgICAgIGlmIChzZW5kZXIucmVhZHlTdGF0ZSA9PSBYRFJfRE9ORSAmJiBzZW5kZXIuc3RhdHVzID49IDQwMCkge1xuICAgICAgICAgIC8vIFNvbWUgc29ydCBvZiBlcnJvciByZXNwb25zZVxuICAgICAgICAgIHRocm93IG5ldyBDb21tRXJyb3IoXCJMUCBzZW5kZXIgZmFpbGVkXCIsIHNlbmRlci5zdGF0dXMpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBzZW5kZXIub3BlbignUE9TVCcsIHVybF8sIHRydWUpO1xuICAgICAgcmV0dXJuIHNlbmRlcjtcbiAgICB9XG5cbiAgICBsZXQgbHBfcG9sbGVyID0gKHVybF8sIHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgbGV0IHBvbGxlciA9IG5ldyBYSFJQcm92aWRlcigpO1xuICAgICAgbGV0IHByb21pc2VDb21wbGV0ZWQgPSBmYWxzZTtcblxuICAgICAgcG9sbGVyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGV2dCA9PiB7XG4gICAgICAgIGlmIChwb2xsZXIucmVhZHlTdGF0ZSA9PSBYRFJfRE9ORSkge1xuICAgICAgICAgIGlmIChwb2xsZXIuc3RhdHVzID09IDIwMSkgeyAvLyAyMDEgPT0gSFRUUC5DcmVhdGVkLCBnZXQgU0lEXG4gICAgICAgICAgICBsZXQgcGt0ID0gSlNPTi5wYXJzZShwb2xsZXIucmVzcG9uc2VUZXh0LCBqc29uUGFyc2VIZWxwZXIpO1xuICAgICAgICAgICAgX2xwVVJMID0gdXJsXyArICcmc2lkPScgKyBwa3QuY3RybC5wYXJhbXMuc2lkO1xuICAgICAgICAgICAgcG9sbGVyID0gbHBfcG9sbGVyKF9scFVSTCk7XG4gICAgICAgICAgICBwb2xsZXIuc2VuZChudWxsKTtcbiAgICAgICAgICAgIGlmICh0aGlzLm9uT3Blbikge1xuICAgICAgICAgICAgICB0aGlzLm9uT3BlbigpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocmVzb2x2ZSkge1xuICAgICAgICAgICAgICBwcm9taXNlQ29tcGxldGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5hdXRvcmVjb25uZWN0KSB7XG4gICAgICAgICAgICAgIHRoaXMuI2JvZmZTdG9wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChwb2xsZXIuc3RhdHVzID4gMCAmJiBwb2xsZXIuc3RhdHVzIDwgNDAwKSB7IC8vIDAgPSBuZXR3b3JrIGVycm9yOyA0MDAgPSBIVFRQLkJhZFJlcXVlc3RcbiAgICAgICAgICAgIGlmICh0aGlzLm9uTWVzc2FnZSkge1xuICAgICAgICAgICAgICB0aGlzLm9uTWVzc2FnZShwb2xsZXIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBvbGxlciA9IGxwX3BvbGxlcihfbHBVUkwpO1xuICAgICAgICAgICAgcG9sbGVyLnNlbmQobnVsbCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIERvbid0IHRocm93IGFuIGVycm9yIGhlcmUsIGdyYWNlZnVsbHkgaGFuZGxlIHNlcnZlciBlcnJvcnNcbiAgICAgICAgICAgIGlmIChyZWplY3QgJiYgIXByb21pc2VDb21wbGV0ZWQpIHtcbiAgICAgICAgICAgICAgcHJvbWlzZUNvbXBsZXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgIHJlamVjdChwb2xsZXIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLm9uTWVzc2FnZSAmJiBwb2xsZXIucmVzcG9uc2VUZXh0KSB7XG4gICAgICAgICAgICAgIHRoaXMub25NZXNzYWdlKHBvbGxlci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMub25EaXNjb25uZWN0KSB7XG4gICAgICAgICAgICAgIGNvbnN0IGNvZGUgPSBwb2xsZXIuc3RhdHVzIHx8ICh0aGlzLiNib2ZmQ2xvc2VkID8gTkVUV09SS19VU0VSIDogTkVUV09SS19FUlJPUik7XG4gICAgICAgICAgICAgIGNvbnN0IHRleHQgPSBwb2xsZXIucmVzcG9uc2VUZXh0IHx8ICh0aGlzLiNib2ZmQ2xvc2VkID8gTkVUV09SS19VU0VSX1RFWFQgOiBORVRXT1JLX0VSUk9SX1RFWFQpO1xuICAgICAgICAgICAgICB0aGlzLm9uRGlzY29ubmVjdChuZXcgQ29tbUVycm9yKHRleHQsIGNvZGUpLCBjb2RlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gUG9sbGluZyBoYXMgc3RvcHBlZC4gSW5kaWNhdGUgaXQgYnkgc2V0dGluZyBwb2xsZXIgdG8gbnVsbC5cbiAgICAgICAgICAgIHBvbGxlciA9IG51bGw7XG4gICAgICAgICAgICBpZiAoIXRoaXMuI2JvZmZDbG9zZWQgJiYgdGhpcy5hdXRvcmVjb25uZWN0KSB7XG4gICAgICAgICAgICAgIHRoaXMuI2JvZmZSZWNvbm5lY3QoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICAvLyBVc2luZyBQT1NUIHRvIGF2b2lkIGNhY2hpbmcgcmVzcG9uc2UgYnkgc2VydmljZSB3b3JrZXIuXG4gICAgICBwb2xsZXIub3BlbignUE9TVCcsIHVybF8sIHRydWUpO1xuICAgICAgcmV0dXJuIHBvbGxlcjtcbiAgICB9XG5cbiAgICB0aGlzLmNvbm5lY3QgPSAoaG9zdF8sIGZvcmNlKSA9PiB7XG4gICAgICB0aGlzLiNib2ZmQ2xvc2VkID0gZmFsc2U7XG5cbiAgICAgIGlmIChfcG9sbGVyKSB7XG4gICAgICAgIGlmICghZm9yY2UpIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgX3BvbGxlci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSB1bmRlZmluZWQ7XG4gICAgICAgIF9wb2xsZXIuYWJvcnQoKTtcbiAgICAgICAgX3BvbGxlciA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIGlmIChob3N0Xykge1xuICAgICAgICB0aGlzLmhvc3QgPSBob3N0XztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgY29uc3QgdXJsID0gbWFrZUJhc2VVcmwodGhpcy5ob3N0LCB0aGlzLnNlY3VyZSA/ICdodHRwcycgOiAnaHR0cCcsIHRoaXMudmVyc2lvbiwgdGhpcy5hcGlLZXkpO1xuICAgICAgICBDb25uZWN0aW9uLiNsb2coXCJMUCBjb25uZWN0aW5nIHRvOlwiLCB1cmwpO1xuICAgICAgICBfcG9sbGVyID0gbHBfcG9sbGVyKHVybCwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgX3BvbGxlci5zZW5kKG51bGwpO1xuICAgICAgfSkuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgQ29ubmVjdGlvbi4jbG9nKFwiTFAgY29ubmVjdGlvbiBmYWlsZWQ6XCIsIGVycik7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgdGhpcy5yZWNvbm5lY3QgPSBmb3JjZSA9PiB7XG4gICAgICB0aGlzLiNib2ZmU3RvcCgpO1xuICAgICAgdGhpcy5jb25uZWN0KG51bGwsIGZvcmNlKTtcbiAgICB9O1xuXG4gICAgdGhpcy5kaXNjb25uZWN0ID0gXyA9PiB7XG4gICAgICB0aGlzLiNib2ZmQ2xvc2VkID0gdHJ1ZTtcbiAgICAgIHRoaXMuI2JvZmZTdG9wKCk7XG5cbiAgICAgIGlmIChfc2VuZGVyKSB7XG4gICAgICAgIF9zZW5kZXIub25yZWFkeXN0YXRlY2hhbmdlID0gdW5kZWZpbmVkO1xuICAgICAgICBfc2VuZGVyLmFib3J0KCk7XG4gICAgICAgIF9zZW5kZXIgPSBudWxsO1xuICAgICAgfVxuICAgICAgaWYgKF9wb2xsZXIpIHtcbiAgICAgICAgX3BvbGxlci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSB1bmRlZmluZWQ7XG4gICAgICAgIF9wb2xsZXIuYWJvcnQoKTtcbiAgICAgICAgX3BvbGxlciA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm9uRGlzY29ubmVjdCkge1xuICAgICAgICB0aGlzLm9uRGlzY29ubmVjdChuZXcgQ29tbUVycm9yKE5FVFdPUktfVVNFUl9URVhULCBORVRXT1JLX1VTRVIpLCBORVRXT1JLX1VTRVIpO1xuICAgICAgfVxuICAgICAgLy8gRW5zdXJlIGl0J3MgcmVjb25zdHJ1Y3RlZFxuICAgICAgX2xwVVJMID0gbnVsbDtcbiAgICB9O1xuXG4gICAgdGhpcy5zZW5kVGV4dCA9IChtc2cpID0+IHtcbiAgICAgIF9zZW5kZXIgPSBscF9zZW5kZXIoX2xwVVJMKTtcbiAgICAgIGlmIChfc2VuZGVyICYmIChfc2VuZGVyLnJlYWR5U3RhdGUgPT0gWERSX09QRU5FRCkpIHsgLy8gMSA9PSBPUEVORURcbiAgICAgICAgX3NlbmRlci5zZW5kKG1zZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJMb25nIHBvbGxlciBmYWlsZWQgdG8gY29ubmVjdFwiKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5pc0Nvbm5lY3RlZCA9IF8gPT4ge1xuICAgICAgcmV0dXJuIChfcG9sbGVyICYmIHRydWUpO1xuICAgIH07XG4gIH1cblxuICAvLyBJbml0aWFsaXphdGlvbiBmb3IgV2Vic29ja2V0XG4gICNpbml0X3dzKCkge1xuICAgIHRoaXMuY29ubmVjdCA9IChob3N0XywgZm9yY2UpID0+IHtcbiAgICAgIHRoaXMuI2JvZmZDbG9zZWQgPSBmYWxzZTtcblxuICAgICAgaWYgKHRoaXMuI3NvY2tldCkge1xuICAgICAgICBpZiAoIWZvcmNlICYmIHRoaXMuI3NvY2tldC5yZWFkeVN0YXRlID09IHRoaXMuI3NvY2tldC5PUEVOKSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuI3NvY2tldC5jbG9zZSgpO1xuICAgICAgICB0aGlzLiNzb2NrZXQgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBpZiAoaG9zdF8pIHtcbiAgICAgICAgdGhpcy5ob3N0ID0gaG9zdF87XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGNvbnN0IHVybCA9IG1ha2VCYXNlVXJsKHRoaXMuaG9zdCwgdGhpcy5zZWN1cmUgPyAnd3NzJyA6ICd3cycsIHRoaXMudmVyc2lvbiwgdGhpcy5hcGlLZXkpO1xuXG4gICAgICAgIENvbm5lY3Rpb24uI2xvZyhcIldTIGNvbm5lY3RpbmcgdG86IFwiLCB1cmwpO1xuXG4gICAgICAgIC8vIEl0IHRocm93cyB3aGVuIHRoZSBzZXJ2ZXIgaXMgbm90IGFjY2Vzc2libGUgYnV0IHRoZSBleGNlcHRpb24gY2Fubm90IGJlIGNhdWdodDpcbiAgICAgICAgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzEwMDI1OTIvamF2YXNjcmlwdC1kb2VzbnQtY2F0Y2gtZXJyb3ItaW4td2Vic29ja2V0LWluc3RhbnRpYXRpb24vMzEwMDMwNTdcbiAgICAgICAgY29uc3QgY29ubiA9IG5ldyBXZWJTb2NrZXRQcm92aWRlcih1cmwpO1xuXG4gICAgICAgIGNvbm4ub25lcnJvciA9IGVyciA9PiB7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29ubi5vbm9wZW4gPSBfID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5hdXRvcmVjb25uZWN0KSB7XG4gICAgICAgICAgICB0aGlzLiNib2ZmU3RvcCgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh0aGlzLm9uT3Blbikge1xuICAgICAgICAgICAgdGhpcy5vbk9wZW4oKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29ubi5vbmNsb3NlID0gXyA9PiB7XG4gICAgICAgICAgdGhpcy4jc29ja2V0ID0gbnVsbDtcblxuICAgICAgICAgIGlmICh0aGlzLm9uRGlzY29ubmVjdCkge1xuICAgICAgICAgICAgY29uc3QgY29kZSA9IHRoaXMuI2JvZmZDbG9zZWQgPyBORVRXT1JLX1VTRVIgOiBORVRXT1JLX0VSUk9SO1xuICAgICAgICAgICAgdGhpcy5vbkRpc2Nvbm5lY3QobmV3IENvbW1FcnJvcih0aGlzLiNib2ZmQ2xvc2VkID8gTkVUV09SS19VU0VSX1RFWFQgOiBORVRXT1JLX0VSUk9SX1RFWFQsIGNvZGUpLCBjb2RlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIXRoaXMuI2JvZmZDbG9zZWQgJiYgdGhpcy5hdXRvcmVjb25uZWN0KSB7XG4gICAgICAgICAgICB0aGlzLiNib2ZmUmVjb25uZWN0KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbm4ub25tZXNzYWdlID0gZXZ0ID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5vbk1lc3NhZ2UpIHtcbiAgICAgICAgICAgIHRoaXMub25NZXNzYWdlKGV2dC5kYXRhKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy4jc29ja2V0ID0gY29ubjtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMucmVjb25uZWN0ID0gZm9yY2UgPT4ge1xuICAgICAgdGhpcy4jYm9mZlN0b3AoKTtcbiAgICAgIHRoaXMuY29ubmVjdChudWxsLCBmb3JjZSk7XG4gICAgfTtcblxuICAgIHRoaXMuZGlzY29ubmVjdCA9IF8gPT4ge1xuICAgICAgdGhpcy4jYm9mZkNsb3NlZCA9IHRydWU7XG4gICAgICB0aGlzLiNib2ZmU3RvcCgpO1xuXG4gICAgICBpZiAoIXRoaXMuI3NvY2tldCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLiNzb2NrZXQuY2xvc2UoKTtcbiAgICAgIHRoaXMuI3NvY2tldCA9IG51bGw7XG4gICAgfTtcblxuICAgIHRoaXMuc2VuZFRleHQgPSBtc2cgPT4ge1xuICAgICAgaWYgKHRoaXMuI3NvY2tldCAmJiAodGhpcy4jc29ja2V0LnJlYWR5U3RhdGUgPT0gdGhpcy4jc29ja2V0Lk9QRU4pKSB7XG4gICAgICAgIHRoaXMuI3NvY2tldC5zZW5kKG1zZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJXZWJzb2NrZXQgaXMgbm90IGNvbm5lY3RlZFwiKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5pc0Nvbm5lY3RlZCA9IF8gPT4ge1xuICAgICAgcmV0dXJuICh0aGlzLiNzb2NrZXQgJiYgKHRoaXMuI3NvY2tldC5yZWFkeVN0YXRlID09IHRoaXMuI3NvY2tldC5PUEVOKSk7XG4gICAgfTtcbiAgfVxuXG4gIC8vIENhbGxiYWNrczpcblxuICAvKipcbiAgICogQSBjYWxsYmFjayB0byBwYXNzIGluY29taW5nIG1lc3NhZ2VzIHRvLiBTZWUge0BsaW5rIFRpbm9kZS5Db25uZWN0aW9uI29uTWVzc2FnZX0uXG4gICAqIEBjYWxsYmFjayBUaW5vZGUuQ29ubmVjdGlvbi5Pbk1lc3NhZ2VcbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIC0gTWVzc2FnZSB0byBwcm9jZXNzLlxuICAgKi9cbiAgb25NZXNzYWdlID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBBIGNhbGxiYWNrIGZvciByZXBvcnRpbmcgYSBkcm9wcGVkIGNvbm5lY3Rpb24uXG4gICAqIEB0eXBlIHtmdW5jdGlvbn1cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uI1xuICAgKi9cbiAgb25EaXNjb25uZWN0ID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBBIGNhbGxiYWNrIGNhbGxlZCB3aGVuIHRoZSBjb25uZWN0aW9uIGlzIHJlYWR5IHRvIGJlIHVzZWQgZm9yIHNlbmRpbmcuIEZvciB3ZWJzb2NrZXRzIGl0J3Mgc29ja2V0IG9wZW4sXG4gICAqIGZvciBsb25nIHBvbGxpbmcgaXQncyA8Y29kZT5yZWFkeVN0YXRlPTE8L2NvZGU+IChPUEVORUQpXG4gICAqIEB0eXBlIHtmdW5jdGlvbn1cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uI1xuICAgKi9cbiAgb25PcGVuID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBBIGNhbGxiYWNrIHRvIG5vdGlmeSBvZiByZWNvbm5lY3Rpb24gYXR0ZW1wdHMuIFNlZSB7QGxpbmsgVGlub2RlLkNvbm5lY3Rpb24jb25BdXRvcmVjb25uZWN0SXRlcmF0aW9ufS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uXG4gICAqIEBjYWxsYmFjayBBdXRvcmVjb25uZWN0SXRlcmF0aW9uVHlwZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGltZW91dCAtIHRpbWUgdGlsbCB0aGUgbmV4dCByZWNvbm5lY3QgYXR0ZW1wdCBpbiBtaWxsaXNlY29uZHMuIDxjb2RlPi0xPC9jb2RlPiBtZWFucyByZWNvbm5lY3Qgd2FzIHNraXBwZWQuXG4gICAqIEBwYXJhbSB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZCBvciByZWplY3RlZCB3aGVuIHRoZSByZWNvbm5lY3QgYXR0ZW1wIGNvbXBsZXRlcy5cbiAgICpcbiAgICovXG4gIC8qKlxuICAgKiBBIGNhbGxiYWNrIHRvIGluZm9ybSB3aGVuIHRoZSBuZXh0IGF0dGFtcHQgdG8gcmVjb25uZWN0IHdpbGwgaGFwcGVuIGFuZCB0byByZWNlaXZlIGNvbm5lY3Rpb24gcHJvbWlzZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uI1xuICAgKiBAdHlwZSB7VGlub2RlLkNvbm5lY3Rpb24uQXV0b3JlY29ubmVjdEl0ZXJhdGlvblR5cGV9XG4gICAqL1xuICBvbkF1dG9yZWNvbm5lY3RJdGVyYXRpb24gPSB1bmRlZmluZWQ7XG59XG5cbkNvbm5lY3Rpb24uTkVUV09SS19FUlJPUiA9IE5FVFdPUktfRVJST1I7XG5Db25uZWN0aW9uLk5FVFdPUktfRVJST1JfVEVYVCA9IE5FVFdPUktfRVJST1JfVEVYVDtcbkNvbm5lY3Rpb24uTkVUV09SS19VU0VSID0gTkVUV09SS19VU0VSO1xuQ29ubmVjdGlvbi5ORVRXT1JLX1VTRVJfVEVYVCA9IE5FVFdPUktfVVNFUl9URVhUO1xuIiwiLyoqXG4gKiBAZmlsZSBIZWxwZXIgbWV0aG9kcyBmb3IgZGVhbGluZyB3aXRoIEluZGV4ZWREQiBjYWNoZSBvZiBtZXNzYWdlcywgdXNlcnMsIGFuZCB0b3BpY3MuXG4gKlxuICogQGNvcHlyaWdodCAyMDE1LTIwMjIgVGlub2RlIExMQy5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG4vLyBOT1RFIFRPIERFVkVMT1BFUlM6XG4vLyBMb2NhbGl6YWJsZSBzdHJpbmdzIHNob3VsZCBiZSBkb3VibGUgcXVvdGVkIFwi0YHRgtGA0L7QutCwINC90LAg0LTRgNGD0LPQvtC8INGP0LfRi9C60LVcIixcbi8vIG5vbi1sb2NhbGl6YWJsZSBzdHJpbmdzIHNob3VsZCBiZSBzaW5nbGUgcXVvdGVkICdub24tbG9jYWxpemVkJy5cblxuY29uc3QgREJfVkVSU0lPTiA9IDE7XG5jb25zdCBEQl9OQU1FID0gJ3Rpbm9kZS13ZWInO1xuXG5sZXQgSURCUHJvdmlkZXI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERCIHtcbiAgI29uRXJyb3IgPSBfID0+IHt9O1xuICAjbG9nZ2VyID0gXyA9PiB7fTtcblxuICAvLyBJbnN0YW5jZSBvZiBJbmRleERCLlxuICBkYiA9IG51bGw7XG4gIC8vIEluZGljYXRvciB0aGF0IHRoZSBjYWNoZSBpcyBkaXNhYmxlZC5cbiAgZGlzYWJsZWQgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihvbkVycm9yLCBsb2dnZXIpIHtcbiAgICB0aGlzLiNvbkVycm9yID0gb25FcnJvciB8fCB0aGlzLiNvbkVycm9yO1xuICAgIHRoaXMuI2xvZ2dlciA9IGxvZ2dlciB8fCB0aGlzLiNsb2dnZXI7XG4gIH1cblxuICAjbWFwT2JqZWN0cyhzb3VyY2UsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgaWYgKCF0aGlzLmRiKSB7XG4gICAgICByZXR1cm4gZGlzYWJsZWQgP1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoW10pIDpcbiAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwibm90IGluaXRpYWxpemVkXCIpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgdHJ4ID0gdGhpcy5kYi50cmFuc2FjdGlvbihbc291cmNlXSk7XG4gICAgICB0cngub25lcnJvciA9IGV2ZW50ID0+IHtcbiAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCAnbWFwT2JqZWN0cycsIHNvdXJjZSwgZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9iamVjdFN0b3JlKHNvdXJjZSkuZ2V0QWxsKCkub25zdWNjZXNzID0gZXZlbnQgPT4ge1xuICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICBldmVudC50YXJnZXQucmVzdWx0LmZvckVhY2godG9waWMgPT4ge1xuICAgICAgICAgICAgY2FsbGJhY2suY2FsbChjb250ZXh0LCB0b3BpYyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmVzb2x2ZShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBwZXJzaXN0ZW50IGNhY2hlOiBvcGVuIG9yIGNyZWF0ZS91cGdyYWRlIGlmIG5lZWRlZC5cbiAgICogQHJldHVybnMge1Byb21pc2V9IHByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgREIgaXMgaW5pdGlhbGl6ZWQuXG4gICAqL1xuICBpbml0RGF0YWJhc2UoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIC8vIE9wZW4gdGhlIGRhdGFiYXNlIGFuZCBpbml0aWFsaXplIGNhbGxiYWNrcy5cbiAgICAgIGNvbnN0IHJlcSA9IElEQlByb3ZpZGVyLm9wZW4oREJfTkFNRSwgREJfVkVSU0lPTik7XG4gICAgICByZXEub25zdWNjZXNzID0gZXZlbnQgPT4ge1xuICAgICAgICB0aGlzLmRiID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcbiAgICAgICAgdGhpcy5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICByZXNvbHZlKHRoaXMuZGIpO1xuICAgICAgfTtcbiAgICAgIHJlcS5vbmVycm9yID0gZXZlbnQgPT4ge1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsIFwiZmFpbGVkIHRvIGluaXRpYWxpemVcIiwgZXZlbnQpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgdGhpcy4jb25FcnJvcihldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgfTtcbiAgICAgIHJlcS5vbnVwZ3JhZGVuZWVkZWQgPSBldmVudCA9PiB7XG4gICAgICAgIHRoaXMuZGIgPSBldmVudC50YXJnZXQucmVzdWx0O1xuXG4gICAgICAgIHRoaXMuZGIub25lcnJvciA9IGV2ZW50ID0+IHtcbiAgICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsIFwiZmFpbGVkIHRvIGNyZWF0ZSBzdG9yYWdlXCIsIGV2ZW50KTtcbiAgICAgICAgICB0aGlzLiNvbkVycm9yKGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gSW5kaXZpZHVhbCBvYmplY3Qgc3RvcmVzLlxuICAgICAgICAvLyBPYmplY3Qgc3RvcmUgKHRhYmxlKSBmb3IgdG9waWNzLiBUaGUgcHJpbWFyeSBrZXkgaXMgdG9waWMgbmFtZS5cbiAgICAgICAgdGhpcy5kYi5jcmVhdGVPYmplY3RTdG9yZSgndG9waWMnLCB7XG4gICAgICAgICAga2V5UGF0aDogJ25hbWUnXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFVzZXJzIG9iamVjdCBzdG9yZS4gVUlEIGlzIHRoZSBwcmltYXJ5IGtleS5cbiAgICAgICAgdGhpcy5kYi5jcmVhdGVPYmplY3RTdG9yZSgndXNlcicsIHtcbiAgICAgICAgICBrZXlQYXRoOiAndWlkJ1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBTdWJzY3JpcHRpb25zIG9iamVjdCBzdG9yZSB0b3BpYyA8LT4gdXNlci4gVG9waWMgbmFtZSArIFVJRCBpcyB0aGUgcHJpbWFyeSBrZXkuXG4gICAgICAgIHRoaXMuZGIuY3JlYXRlT2JqZWN0U3RvcmUoJ3N1YnNjcmlwdGlvbicsIHtcbiAgICAgICAgICBrZXlQYXRoOiBbJ3RvcGljJywgJ3VpZCddXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIE1lc3NhZ2VzIG9iamVjdCBzdG9yZS4gVGhlIHByaW1hcnkga2V5IGlzIHRvcGljIG5hbWUgKyBzZXEuXG4gICAgICAgIHRoaXMuZGIuY3JlYXRlT2JqZWN0U3RvcmUoJ21lc3NhZ2UnLCB7XG4gICAgICAgICAga2V5UGF0aDogWyd0b3BpYycsICdzZXEnXVxuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRGVsZXRlIHBlcnNpc3RlbnQgY2FjaGUuXG4gICAqL1xuICBkZWxldGVEYXRhYmFzZSgpIHtcbiAgICAvLyBDbG9zZSBjb25uZWN0aW9uLCBvdGhlcndpc2Ugb3BlcmF0aW9ucyB3aWxsIGZhaWwgd2l0aCAnb25ibG9ja2VkJy5cbiAgICBpZiAodGhpcy5kYikge1xuICAgICAgdGhpcy5kYi5jbG9zZSgpO1xuICAgICAgdGhpcy5kYiA9IG51bGw7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCByZXEgPSBJREJQcm92aWRlci5kZWxldGVEYXRhYmFzZShEQl9OQU1FKTtcbiAgICAgIHJlcS5vbmJsb2NrZWQgPSBfID0+IHtcbiAgICAgICAgaWYgKHRoaXMuZGIpIHtcbiAgICAgICAgICB0aGlzLmRiLmNsb3NlKCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZXJyID0gbmV3IEVycm9yKFwiYmxvY2tlZFwiKTtcbiAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCAnZGVsZXRlRGF0YWJhc2UnLCBlcnIpO1xuICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgIH07XG4gICAgICByZXEub25zdWNjZXNzID0gXyA9PiB7XG4gICAgICAgIHRoaXMuZGIgPSBudWxsO1xuICAgICAgICB0aGlzLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgIH07XG4gICAgICByZXEub25lcnJvciA9IGV2ZW50ID0+IHtcbiAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCAnZGVsZXRlRGF0YWJhc2UnLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgcGVyc2lzdGVudCBjYWNoZSBpcyByZWFkeSBmb3IgdXNlLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIGNhY2hlIGlzIHJlYWR5LCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNSZWFkeSgpIHtcbiAgICByZXR1cm4gISF0aGlzLmRiO1xuICB9XG5cbiAgLy8gVG9waWNzLlxuXG4gIC8qKlxuICAgKiBTYXZlIHRvIGNhY2hlIG9yIHVwZGF0ZSB0b3BpYyBpbiBwZXJzaXN0ZW50IGNhY2hlLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtUb3BpY30gdG9waWMgLSB0b3BpYyB0byBiZSBhZGRlZCBvciB1cGRhdGVkLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCBvbiBvcGVyYXRpb24gY29tcGxldGlvbi5cbiAgICovXG4gIHVwZFRvcGljKHRvcGljKSB7XG4gICAgaWYgKCF0aGlzLmlzUmVhZHkoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgP1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKSA6XG4gICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIm5vdCBpbml0aWFsaXplZFwiKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB0cnggPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFsndG9waWMnXSwgJ3JlYWR3cml0ZScpO1xuICAgICAgdHJ4Lm9uY29tcGxldGUgPSBldmVudCA9PiB7XG4gICAgICAgIHJlc29sdmUoZXZlbnQudGFyZ2V0LnJlc3VsdCk7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9uZXJyb3IgPSBldmVudCA9PiB7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgJ3VwZFRvcGljJywgZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICB9O1xuICAgICAgY29uc3QgcmVxID0gdHJ4Lm9iamVjdFN0b3JlKCd0b3BpYycpLmdldCh0b3BpYy5uYW1lKTtcbiAgICAgIHJlcS5vbnN1Y2Nlc3MgPSBfID0+IHtcbiAgICAgICAgdHJ4Lm9iamVjdFN0b3JlKCd0b3BpYycpLnB1dChEQi4jc2VyaWFsaXplVG9waWMocmVxLnJlc3VsdCwgdG9waWMpKTtcbiAgICAgICAgdHJ4LmNvbW1pdCgpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXJrIG9yIHVubWFyayB0b3BpYyBhcyBkZWxldGVkLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBuYW1lIG9mIHRoZSB0b3BpYyB0byBtYXJrIG9yIHVubWFyay5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCBvbiBvcGVyYXRpb24gY29tcGxldGlvbi5cbiAgICovXG4gIG1hcmtUb3BpY0FzRGVsZXRlZChuYW1lKSB7XG4gICAgaWYgKCF0aGlzLmlzUmVhZHkoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgP1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKSA6XG4gICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIm5vdCBpbml0aWFsaXplZFwiKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB0cnggPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFsndG9waWMnXSwgJ3JlYWR3cml0ZScpO1xuICAgICAgdHJ4Lm9uY29tcGxldGUgPSBldmVudCA9PiB7XG4gICAgICAgIHJlc29sdmUoZXZlbnQudGFyZ2V0LnJlc3VsdCk7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9uZXJyb3IgPSBldmVudCA9PiB7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgJ21hcmtUb3BpY0FzRGVsZXRlZCcsIGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgfTtcbiAgICAgIGNvbnN0IHJlcSA9IHRyeC5vYmplY3RTdG9yZSgndG9waWMnKS5nZXQobmFtZSk7XG4gICAgICByZXEub25zdWNjZXNzID0gZXZlbnQgPT4ge1xuICAgICAgICBjb25zdCB0b3BpYyA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XG4gICAgICAgIHRvcGljLl9kZWxldGVkID0gdHJ1ZTtcbiAgICAgICAgdHJ4Lm9iamVjdFN0b3JlKCd0b3BpYycpLnB1dCh0b3BpYyk7XG4gICAgICAgIHRyeC5jb21taXQoKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIHRvcGljIGZyb20gcGVyc2lzdGVudCBjYWNoZS5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gbmFtZSBvZiB0aGUgdG9waWMgdG8gcmVtb3ZlIGZyb20gZGF0YWJhc2UuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gb3BlcmF0aW9uIGNvbXBsZXRpb24uXG4gICAqL1xuICByZW1Ub3BpYyhuYW1lKSB7XG4gICAgaWYgKCF0aGlzLmlzUmVhZHkoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgP1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKSA6XG4gICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIm5vdCBpbml0aWFsaXplZFwiKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB0cnggPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFsndG9waWMnLCAnc3Vic2NyaXB0aW9uJywgJ21lc3NhZ2UnXSwgJ3JlYWR3cml0ZScpO1xuICAgICAgdHJ4Lm9uY29tcGxldGUgPSBldmVudCA9PiB7XG4gICAgICAgIHJlc29sdmUoZXZlbnQudGFyZ2V0LnJlc3VsdCk7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9uZXJyb3IgPSBldmVudCA9PiB7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgJ3JlbVRvcGljJywgZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9iamVjdFN0b3JlKCd0b3BpYycpLmRlbGV0ZShJREJLZXlSYW5nZS5vbmx5KG5hbWUpKTtcbiAgICAgIHRyeC5vYmplY3RTdG9yZSgnc3Vic2NyaXB0aW9uJykuZGVsZXRlKElEQktleVJhbmdlLmJvdW5kKFtuYW1lLCAnLSddLCBbbmFtZSwgJ34nXSkpO1xuICAgICAgdHJ4Lm9iamVjdFN0b3JlKCdtZXNzYWdlJykuZGVsZXRlKElEQktleVJhbmdlLmJvdW5kKFtuYW1lLCAwXSwgW25hbWUsIE51bWJlci5NQVhfU0FGRV9JTlRFR0VSXSkpO1xuICAgICAgdHJ4LmNvbW1pdCgpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGUgYSBjYWxsYmFjayBmb3IgZWFjaCBzdG9yZWQgdG9waWMuXG4gICAqIEBtZW1iZXJPZiBEQlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAtIGZ1bmN0aW9uIHRvIGNhbGwgZm9yIGVhY2ggdG9waWMuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gdGhlIHZhbHVlIG9yIDxjb2RlPnRoaXM8L2NvZGU+IGluc2lkZSB0aGUgY2FsbGJhY2suXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gb3BlcmF0aW9uIGNvbXBsZXRpb24uXG4gICAqL1xuICBtYXBUb3BpY3MoY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICByZXR1cm4gdGhpcy4jbWFwT2JqZWN0cygndG9waWMnLCBjYWxsYmFjaywgY29udGV4dCk7XG4gIH1cblxuICAvKipcbiAgICogQ29weSBkYXRhIGZyb20gc2VyaWFsaXplZCBvYmplY3QgdG8gdG9waWMuXG4gICAqIEBtZW1iZXJPZiBEQlxuICAgKiBAcGFyYW0ge1RvcGljfSB0b3BpYyAtIHRhcmdldCB0byBkZXNlcmlhbGl6ZSB0by5cbiAgICogQHBhcmFtIHtPYmplY3R9IHNyYyAtIHNlcmlhbGl6ZWQgZGF0YSB0byBjb3B5IGZyb20uXG4gICAqL1xuICBkZXNlcmlhbGl6ZVRvcGljKHRvcGljLCBzcmMpIHtcbiAgICBEQi4jZGVzZXJpYWxpemVUb3BpYyh0b3BpYywgc3JjKTtcbiAgfVxuXG4gIC8vIFVzZXJzLlxuICAvKipcbiAgICogQWRkIG9yIHVwZGF0ZSB1c2VyIG9iamVjdCBpbiB0aGUgcGVyc2lzdGVudCBjYWNoZS5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBJRCBvZiB0aGUgdXNlciB0byBzYXZlIG9yIHVwZGF0ZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IHB1YiAtIHVzZXIncyA8Y29kZT5wdWJsaWM8L2NvZGU+IGluZm9ybWF0aW9uLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCBvbiBvcGVyYXRpb24gY29tcGxldGlvbi5cbiAgICovXG4gIHVwZFVzZXIodWlkLCBwdWIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIgfHwgcHViID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIE5vIHBvaW50IGludXBkYXRpbmcgdXNlciB3aXRoIGludmFsaWQgZGF0YS5cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmlzUmVhZHkoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgP1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKSA6XG4gICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIm5vdCBpbml0aWFsaXplZFwiKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB0cnggPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFsndXNlciddLCAncmVhZHdyaXRlJyk7XG4gICAgICB0cngub25jb21wbGV0ZSA9IGV2ZW50ID0+IHtcbiAgICAgICAgcmVzb2x2ZShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgIH07XG4gICAgICB0cngub25lcnJvciA9IGV2ZW50ID0+IHtcbiAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCAndXBkVXNlcicsIGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vYmplY3RTdG9yZSgndXNlcicpLnB1dCh7XG4gICAgICAgIHVpZDogdWlkLFxuICAgICAgICBwdWJsaWM6IHB1YlxuICAgICAgfSk7XG4gICAgICB0cnguY29tbWl0KCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIHVzZXIgZnJvbSBwZXJzaXN0ZW50IGNhY2hlLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVpZCAtIElEIG9mIHRoZSB1c2VyIHRvIHJlbW92ZSBmcm9tIHRoZSBjYWNoZS5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCBvbiBvcGVyYXRpb24gY29tcGxldGlvbi5cbiAgICovXG4gIHJlbVVzZXIodWlkKSB7XG4gICAgaWYgKCF0aGlzLmlzUmVhZHkoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgP1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKSA6XG4gICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIm5vdCBpbml0aWFsaXplZFwiKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB0cnggPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFsndXNlciddLCAncmVhZHdyaXRlJyk7XG4gICAgICB0cngub25jb21wbGV0ZSA9IGV2ZW50ID0+IHtcbiAgICAgICAgcmVzb2x2ZShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgIH07XG4gICAgICB0cngub25lcnJvciA9IGV2ZW50ID0+IHtcbiAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCAncmVtVXNlcicsIGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vYmplY3RTdG9yZSgndXNlcicpLmRlbGV0ZShJREJLZXlSYW5nZS5vbmx5KHVpZCkpO1xuICAgICAgdHJ4LmNvbW1pdCgpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGUgYSBjYWxsYmFjayBmb3IgZWFjaCBzdG9yZWQgdXNlci5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0gZnVuY3Rpb24gdG8gY2FsbCBmb3IgZWFjaCB0b3BpYy5cbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSB0aGUgdmFsdWUgb3IgPGNvZGU+dGhpczwvY29kZT4gaW5zaWRlIHRoZSBjYWxsYmFjay5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCBvbiBvcGVyYXRpb24gY29tcGxldGlvbi5cbiAgICovXG4gIG1hcFVzZXJzKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMuI21hcE9iamVjdHMoJ3VzZXInLCBjYWxsYmFjaywgY29udGV4dCk7XG4gIH1cblxuICAvKipcbiAgICogUmVhZCBhIHNpbmdsZSB1c2VyIGZyb20gcGVyc2lzdGVudCBjYWNoZS5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBJRCBvZiB0aGUgdXNlciB0byBmZXRjaCBmcm9tIGNhY2hlLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgKi9cbiAgZ2V0VXNlcih1aWQpIHtcbiAgICBpZiAoIXRoaXMuaXNSZWFkeSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/XG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpIDpcbiAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwibm90IGluaXRpYWxpemVkXCIpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHRyeCA9IHRoaXMuZGIudHJhbnNhY3Rpb24oWyd1c2VyJ10pO1xuICAgICAgdHJ4Lm9uY29tcGxldGUgPSBldmVudCA9PiB7XG4gICAgICAgIGNvbnN0IHVzZXIgPSBldmVudC50YXJnZXQucmVzdWx0O1xuICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICB1c2VyOiB1c2VyLnVpZCxcbiAgICAgICAgICBwdWJsaWM6IHVzZXIucHVibGljXG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIHRyeC5vbmVycm9yID0gZXZlbnQgPT4ge1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsICdnZXRVc2VyJywgZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9iamVjdFN0b3JlKCd1c2VyJykuZ2V0KHVpZCk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBTdWJzY3JpcHRpb25zLlxuICAvKipcbiAgICogQWRkIG9yIHVwZGF0ZSBzdWJzY3JpcHRpb24gaW4gcGVyc2lzdGVudCBjYWNoZS5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBuYW1lIG9mIHRoZSB0b3BpYyB3aGljaCBvd25zIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gSUQgb2YgdGhlIHN1YnNjcmliZWQgdXNlci5cbiAgICogQHBhcmFtIHtPYmplY3R9IHN1YiAtIHN1YnNjcmlwdGlvbiB0byBzYXZlLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgKi9cbiAgdXBkU3Vic2NyaXB0aW9uKHRvcGljTmFtZSwgdWlkLCBzdWIpIHtcbiAgICBpZiAoIXRoaXMuaXNSZWFkeSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/XG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpIDpcbiAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwibm90IGluaXRpYWxpemVkXCIpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHRyeCA9IHRoaXMuZGIudHJhbnNhY3Rpb24oWydzdWJzY3JpcHRpb24nXSwgJ3JlYWR3cml0ZScpO1xuICAgICAgdHJ4Lm9uY29tcGxldGUgPSBldmVudCA9PiB7XG4gICAgICAgIHJlc29sdmUoZXZlbnQudGFyZ2V0LnJlc3VsdCk7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9uZXJyb3IgPSBldmVudCA9PiB7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgJ3VwZFN1YnNjcmlwdGlvbicsIGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vYmplY3RTdG9yZSgnc3Vic2NyaXB0aW9uJykuZ2V0KFt0b3BpY05hbWUsIHVpZF0pLm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xuICAgICAgICB0cngub2JqZWN0U3RvcmUoJ3N1YnNjcmlwdGlvbicpLnB1dChEQi4jc2VyaWFsaXplU3Vic2NyaXB0aW9uKGV2ZW50LnRhcmdldC5yZXN1bHQsIHRvcGljTmFtZSwgdWlkLCBzdWIpKTtcbiAgICAgICAgdHJ4LmNvbW1pdCgpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeGVjdXRlIGEgY2FsbGJhY2sgZm9yIGVhY2ggY2FjaGVkIHN1YnNjcmlwdGlvbiBpbiBhIGdpdmVuIHRvcGljLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIG5hbWUgb2YgdGhlIHRvcGljIHdoaWNoIG93bnMgdGhlIHN1YnNjcmlwdGlvbnMuXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0gZnVuY3Rpb24gdG8gY2FsbCBmb3IgZWFjaCBzdWJzY3JpcHRpb24uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gdGhlIHZhbHVlIG9yIDxjb2RlPnRoaXM8L2NvZGU+IGluc2lkZSB0aGUgY2FsbGJhY2suXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gb3BlcmF0aW9uIGNvbXBsZXRpb24uXG4gICAqL1xuICBtYXBTdWJzY3JpcHRpb25zKHRvcGljTmFtZSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICBpZiAoIXRoaXMuaXNSZWFkeSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/XG4gICAgICAgIFByb21pc2UucmVzb2x2ZShbXSkgOlxuICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJub3QgaW5pdGlhbGl6ZWRcIikpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgdHJ4ID0gdGhpcy5kYi50cmFuc2FjdGlvbihbJ3N1YnNjcmlwdGlvbiddKTtcbiAgICAgIHRyeC5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgJ21hcFN1YnNjcmlwdGlvbnMnLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgICB0cngub2JqZWN0U3RvcmUoJ3N1YnNjcmlwdGlvbicpLmdldEFsbChJREJLZXlSYW5nZS5ib3VuZChbdG9waWNOYW1lLCAnLSddLCBbdG9waWNOYW1lLCAnfiddKSkub25zdWNjZXNzID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgIGV2ZW50LnRhcmdldC5yZXN1bHQuZm9yRWFjaCgodG9waWMpID0+IHtcbiAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgdG9waWMpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJlc29sdmUoZXZlbnQudGFyZ2V0LnJlc3VsdCk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgLy8gTWVzc2FnZXMuXG5cbiAgLyoqXG4gICAqIFNhdmUgbWVzc2FnZSB0byBwZXJzaXN0ZW50IGNhY2hlLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIG5hbWUgb2YgdGhlIHRvcGljIHdoaWNoIG93bnMgdGhlIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBtc2cgLSBtZXNzYWdlIHRvIHNhdmUuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gb3BlcmF0aW9uIGNvbXBsZXRpb24uXG4gICAqL1xuICBhZGRNZXNzYWdlKG1zZykge1xuICAgIGlmICghdGhpcy5pc1JlYWR5KCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpc2FibGVkID9cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkgOlxuICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJub3QgaW5pdGlhbGl6ZWRcIikpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgdHJ4ID0gdGhpcy5kYi50cmFuc2FjdGlvbihbJ21lc3NhZ2UnXSwgJ3JlYWR3cml0ZScpO1xuICAgICAgdHJ4Lm9uc3VjY2VzcyA9IGV2ZW50ID0+IHtcbiAgICAgICAgcmVzb2x2ZShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgIH07XG4gICAgICB0cngub25lcnJvciA9IGV2ZW50ID0+IHtcbiAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCAnYWRkTWVzc2FnZScsIGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vYmplY3RTdG9yZSgnbWVzc2FnZScpLmFkZChEQi4jc2VyaWFsaXplTWVzc2FnZShudWxsLCBtc2cpKTtcbiAgICAgIHRyeC5jb21taXQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgZGVsaXZlcnkgc3RhdHVzIG9mIGEgbWVzc2FnZSBzdG9yZWQgaW4gcGVyc2lzdGVudCBjYWNoZS5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBuYW1lIG9mIHRoZSB0b3BpYyB3aGljaCBvd25zIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2VxIC0gSUQgb2YgdGhlIG1lc3NhZ2UgdG8gdXBkYXRlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzdGF0dXMgLSBuZXcgZGVsaXZlcnkgc3RhdHVzIG9mIHRoZSBtZXNzYWdlLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgKi9cbiAgdXBkTWVzc2FnZVN0YXR1cyh0b3BpY05hbWUsIHNlcSwgc3RhdHVzKSB7XG4gICAgaWYgKCF0aGlzLmlzUmVhZHkoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgP1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKSA6XG4gICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIm5vdCBpbml0aWFsaXplZFwiKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB0cnggPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFsnbWVzc2FnZSddLCAncmVhZHdyaXRlJyk7XG4gICAgICB0cngub25zdWNjZXNzID0gZXZlbnQgPT4ge1xuICAgICAgICByZXNvbHZlKGV2ZW50LnRhcmdldC5yZXN1bHQpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vbmVycm9yID0gZXZlbnQgPT4ge1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsICd1cGRNZXNzYWdlU3RhdHVzJywgZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICB9O1xuICAgICAgY29uc3QgcmVxID0gdHJ4Lm9iamVjdFN0b3JlKCdtZXNzYWdlJykuZ2V0KElEQktleVJhbmdlLm9ubHkoW3RvcGljTmFtZSwgc2VxXSkpO1xuICAgICAgcmVxLm9uc3VjY2VzcyA9IGV2ZW50ID0+IHtcbiAgICAgICAgY29uc3Qgc3JjID0gcmVxLnJlc3VsdCB8fCBldmVudC50YXJnZXQucmVzdWx0O1xuICAgICAgICBpZiAoIXNyYyB8fCBzcmMuX3N0YXR1cyA9PSBzdGF0dXMpIHtcbiAgICAgICAgICB0cnguY29tbWl0KCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRyeC5vYmplY3RTdG9yZSgnbWVzc2FnZScpLnB1dChEQi4jc2VyaWFsaXplTWVzc2FnZShzcmMsIHtcbiAgICAgICAgICB0b3BpYzogdG9waWNOYW1lLFxuICAgICAgICAgIHNlcTogc2VxLFxuICAgICAgICAgIF9zdGF0dXM6IHN0YXR1c1xuICAgICAgICB9KSk7XG4gICAgICAgIHRyeC5jb21taXQoKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIG9uZSBvciBtb3JlIG1lc3NhZ2VzIGZyb20gcGVyc2lzdGVudCBjYWNoZS5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBuYW1lIG9mIHRoZSB0b3BpYyB3aGljaCBvd25zIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge251bWJlcn0gZnJvbSAtIGlkIG9mIHRoZSBtZXNzYWdlIHRvIHJlbW92ZSBvciBsb3dlciBib3VuZGFyeSB3aGVuIHJlbW92aW5nIHJhbmdlIChpbmNsdXNpdmUpLlxuICAgKiBAcGFyYW0ge251bWJlcj19IHRvIC0gdXBwZXIgYm91bmRhcnkgKGV4Y2x1c2l2ZSkgd2hlbiByZW1vdmluZyBhIHJhbmdlIG9mIG1lc3NhZ2VzLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgKi9cbiAgcmVtTWVzc2FnZXModG9waWNOYW1lLCBmcm9tLCB0bykge1xuICAgIGlmICghdGhpcy5pc1JlYWR5KCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpc2FibGVkID9cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkgOlxuICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJub3QgaW5pdGlhbGl6ZWRcIikpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgaWYgKCFmcm9tICYmICF0bykge1xuICAgICAgICBmcm9tID0gMDtcbiAgICAgICAgdG8gPSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHJhbmdlID0gdG8gPiAwID8gSURCS2V5UmFuZ2UuYm91bmQoW3RvcGljTmFtZSwgZnJvbV0sIFt0b3BpY05hbWUsIHRvXSwgZmFsc2UsIHRydWUpIDpcbiAgICAgICAgSURCS2V5UmFuZ2Uub25seShbdG9waWNOYW1lLCBmcm9tXSk7XG4gICAgICBjb25zdCB0cnggPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFsnbWVzc2FnZSddLCAncmVhZHdyaXRlJyk7XG4gICAgICB0cngub25zdWNjZXNzID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHJlc29sdmUoZXZlbnQudGFyZ2V0LnJlc3VsdCk7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCAncmVtTWVzc2FnZXMnLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgICB0cngub2JqZWN0U3RvcmUoJ21lc3NhZ2UnKS5kZWxldGUocmFuZ2UpO1xuICAgICAgdHJ4LmNvbW1pdCgpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIG1lc3NhZ2VzIGZyb20gcGVyc2lzdGVudCBzdG9yZS5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBuYW1lIG9mIHRoZSB0b3BpYyB0byByZXRyaWV2ZSBtZXNzYWdlcyBmcm9tLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayB0byBjYWxsIGZvciBlYWNoIHJldHJpZXZlZCBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gcXVlcnkgLSBwYXJhbWV0ZXJzIG9mIHRoZSBtZXNzYWdlIHJhbmdlIHRvIHJldHJpZXZlLlxuICAgKiBAcGFyYW0ge251bWJlcj19IHF1ZXJ5LnNpbmNlIC0gdGhlIGxlYXN0IG1lc3NhZ2UgSUQgdG8gcmV0cmlldmUgKGluY2x1c2l2ZSkuXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gcXVlcnkuYmVmb3JlIC0gdGhlIGdyZWF0ZXN0IG1lc3NhZ2UgSUQgdG8gcmV0cmlldmUgKGV4Y2x1c2l2ZSkuXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gcXVlcnkubGltaXQgLSB0aGUgbWF4aW11bSBudW1iZXIgb2YgbWVzc2FnZXMgdG8gcmV0cmlldmUuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gb3BlcmF0aW9uIGNvbXBsZXRpb24uXG4gICAqL1xuICByZWFkTWVzc2FnZXModG9waWNOYW1lLCBxdWVyeSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICBpZiAoIXRoaXMuaXNSZWFkeSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/XG4gICAgICAgIFByb21pc2UucmVzb2x2ZShbXSkgOlxuICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJub3QgaW5pdGlhbGl6ZWRcIikpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgcXVlcnkgPSBxdWVyeSB8fCB7fTtcbiAgICAgIGNvbnN0IHNpbmNlID0gcXVlcnkuc2luY2UgPiAwID8gcXVlcnkuc2luY2UgOiAwO1xuICAgICAgY29uc3QgYmVmb3JlID0gcXVlcnkuYmVmb3JlID4gMCA/IHF1ZXJ5LmJlZm9yZSA6IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xuICAgICAgY29uc3QgbGltaXQgPSBxdWVyeS5saW1pdCB8IDA7XG5cbiAgICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuICAgICAgY29uc3QgcmFuZ2UgPSBJREJLZXlSYW5nZS5ib3VuZChbdG9waWNOYW1lLCBzaW5jZV0sIFt0b3BpY05hbWUsIGJlZm9yZV0sIGZhbHNlLCB0cnVlKTtcbiAgICAgIGNvbnN0IHRyeCA9IHRoaXMuZGIudHJhbnNhY3Rpb24oWydtZXNzYWdlJ10pO1xuICAgICAgdHJ4Lm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCAncmVhZE1lc3NhZ2VzJywgZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICB9O1xuICAgICAgLy8gSXRlcmF0ZSBpbiBkZXNjZW5kaW5nIG9yZGVyLlxuICAgICAgdHJ4Lm9iamVjdFN0b3JlKCdtZXNzYWdlJykub3BlbkN1cnNvcihyYW5nZSwgJ3ByZXYnKS5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgY29uc3QgY3Vyc29yID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcbiAgICAgICAgaWYgKGN1cnNvcikge1xuICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgY2FsbGJhY2suY2FsbChjb250ZXh0LCBjdXJzb3IudmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXN1bHQucHVzaChjdXJzb3IudmFsdWUpO1xuICAgICAgICAgIGlmIChsaW1pdCA8PSAwIHx8IHJlc3VsdC5sZW5ndGggPCBsaW1pdCkge1xuICAgICAgICAgICAgY3Vyc29yLmNvbnRpbnVlKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgLy8gUHJpdmF0ZSBtZXRob2RzLlxuXG4gIC8vIFNlcmlhbGl6YWJsZSB0b3BpYyBmaWVsZHMuXG4gIHN0YXRpYyAjdG9waWNfZmllbGRzID0gWydjcmVhdGVkJywgJ3VwZGF0ZWQnLCAnZGVsZXRlZCcsICdyZWFkJywgJ3JlY3YnLCAnc2VxJywgJ2NsZWFyJywgJ2RlZmFjcycsXG4gICAgJ2NyZWRzJywgJ3B1YmxpYycsICd0cnVzdGVkJywgJ3ByaXZhdGUnLCAndG91Y2hlZCcsICdfZGVsZXRlZCdcbiAgXTtcblxuICAvLyBDb3B5IGRhdGEgZnJvbSBzcmMgdG8gVG9waWMgb2JqZWN0LlxuICBzdGF0aWMgI2Rlc2VyaWFsaXplVG9waWModG9waWMsIHNyYykge1xuICAgIERCLiN0b3BpY19maWVsZHMuZm9yRWFjaCgoZikgPT4ge1xuICAgICAgaWYgKHNyYy5oYXNPd25Qcm9wZXJ0eShmKSkge1xuICAgICAgICB0b3BpY1tmXSA9IHNyY1tmXTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShzcmMudGFncykpIHtcbiAgICAgIHRvcGljLl90YWdzID0gc3JjLnRhZ3M7XG4gICAgfVxuICAgIGlmIChzcmMuYWNzKSB7XG4gICAgICB0b3BpYy5zZXRBY2Nlc3NNb2RlKHNyYy5hY3MpO1xuICAgIH1cbiAgICB0b3BpYy5zZXEgfD0gMDtcbiAgICB0b3BpYy5yZWFkIHw9IDA7XG4gICAgdG9waWMudW5yZWFkID0gTWF0aC5tYXgoMCwgdG9waWMuc2VxIC0gdG9waWMucmVhZCk7XG4gIH1cblxuICAvLyBDb3B5IHZhbHVlcyBmcm9tICdzcmMnIHRvICdkc3QnLiBBbGxvY2F0ZSBkc3QgaWYgaXQncyBudWxsIG9yIHVuZGVmaW5lZC5cbiAgc3RhdGljICNzZXJpYWxpemVUb3BpYyhkc3QsIHNyYykge1xuICAgIGNvbnN0IHJlcyA9IGRzdCB8fCB7XG4gICAgICBuYW1lOiBzcmMubmFtZVxuICAgIH07XG4gICAgREIuI3RvcGljX2ZpZWxkcy5mb3JFYWNoKChmKSA9PiB7XG4gICAgICBpZiAoc3JjLmhhc093blByb3BlcnR5KGYpKSB7XG4gICAgICAgIHJlc1tmXSA9IHNyY1tmXTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShzcmMuX3RhZ3MpKSB7XG4gICAgICByZXMudGFncyA9IHNyYy5fdGFncztcbiAgICB9XG4gICAgaWYgKHNyYy5hY3MpIHtcbiAgICAgIHJlcy5hY3MgPSBzcmMuZ2V0QWNjZXNzTW9kZSgpLmpzb25IZWxwZXIoKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIHN0YXRpYyAjc2VyaWFsaXplU3Vic2NyaXB0aW9uKGRzdCwgdG9waWNOYW1lLCB1aWQsIHN1Yikge1xuICAgIGNvbnN0IGZpZWxkcyA9IFsndXBkYXRlZCcsICdtb2RlJywgJ3JlYWQnLCAncmVjdicsICdjbGVhcicsICdsYXN0U2VlbicsICd1c2VyQWdlbnQnXTtcbiAgICBjb25zdCByZXMgPSBkc3QgfHwge1xuICAgICAgdG9waWM6IHRvcGljTmFtZSxcbiAgICAgIHVpZDogdWlkXG4gICAgfTtcblxuICAgIGZpZWxkcy5mb3JFYWNoKChmKSA9PiB7XG4gICAgICBpZiAoc3ViLmhhc093blByb3BlcnR5KGYpKSB7XG4gICAgICAgIHJlc1tmXSA9IHN1YltmXTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiByZXM7XG4gIH1cblxuICBzdGF0aWMgI3NlcmlhbGl6ZU1lc3NhZ2UoZHN0LCBtc2cpIHtcbiAgICAvLyBTZXJpYWxpemFibGUgZmllbGRzLlxuICAgIGNvbnN0IGZpZWxkcyA9IFsndG9waWMnLCAnc2VxJywgJ3RzJywgJ19zdGF0dXMnLCAnZnJvbScsICdoZWFkJywgJ2NvbnRlbnQnXTtcbiAgICBjb25zdCByZXMgPSBkc3QgfHwge307XG4gICAgZmllbGRzLmZvckVhY2goKGYpID0+IHtcbiAgICAgIGlmIChtc2cuaGFzT3duUHJvcGVydHkoZikpIHtcbiAgICAgICAgcmVzW2ZdID0gbXNnW2ZdO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXM7XG4gIH1cblxuICAvKipcbiAgICogVG8gdXNlIERCIGluIGEgbm9uIGJyb3dzZXIgY29udGV4dCwgc3VwcGx5IGluZGV4ZWREQiBwcm92aWRlci5cbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyb2YgREJcbiAgICogQHBhcmFtIGlkYlByb3ZpZGVyIGluZGV4ZWREQiBwcm92aWRlciwgZS5nLiBmb3Igbm9kZSA8Y29kZT5yZXF1aXJlKCdmYWtlLWluZGV4ZWRkYicpPC9jb2RlPi5cbiAgICovXG4gIHN0YXRpYyBzZXREYXRhYmFzZVByb3ZpZGVyKGlkYlByb3ZpZGVyKSB7XG4gICAgSURCUHJvdmlkZXIgPSBpZGJQcm92aWRlcjtcbiAgfVxufVxuIiwiLyoqXG4gKiBAY29weXJpZ2h0IDIwMTUtMjAyMiBUaW5vZGUgTExDLlxuICogQHN1bW1hcnkgTWluaW1hbGx5IHJpY2ggdGV4dCByZXByZXNlbnRhdGlvbiBhbmQgZm9ybWF0dGluZyBmb3IgVGlub2RlLlxuICogQGxpY2Vuc2UgQXBhY2hlIDIuMFxuICpcbiAqIEBmaWxlIEJhc2ljIHBhcnNlciBhbmQgZm9ybWF0dGVyIGZvciB2ZXJ5IHNpbXBsZSB0ZXh0IG1hcmt1cC4gTW9zdGx5IHRhcmdldGVkIGF0XG4gKiBtb2JpbGUgdXNlIGNhc2VzIHNpbWlsYXIgdG8gVGVsZWdyYW0sIFdoYXRzQXBwLCBhbmQgRkIgTWVzc2VuZ2VyLlxuICpcbiAqIDxwPlN1cHBvcnRzIGNvbnZlcnNpb24gb2YgdXNlciBrZXlib2FyZCBpbnB1dCB0byBmb3JtYXR0ZWQgdGV4dDo8L3A+XG4gKiA8dWw+XG4gKiAgIDxsaT4qYWJjKiAmcmFycjsgPGI+YWJjPC9iPjwvbGk+XG4gKiAgIDxsaT5fYWJjXyAmcmFycjsgPGk+YWJjPC9pPjwvbGk+XG4gKiAgIDxsaT5+YWJjfiAmcmFycjsgPGRlbD5hYmM8L2RlbD48L2xpPlxuICogICA8bGk+YGFiY2AgJnJhcnI7IDx0dD5hYmM8L3R0PjwvbGk+XG4gKiA8L3VsPlxuICogQWxzbyBzdXBwb3J0cyBmb3JtcyBhbmQgYnV0dG9ucy5cbiAqXG4gKiBOZXN0ZWQgZm9ybWF0dGluZyBpcyBzdXBwb3J0ZWQsIGUuZy4gKmFiYyBfZGVmXyogLT4gPGI+YWJjIDxpPmRlZjwvaT48L2I+XG4gKiBVUkxzLCBAbWVudGlvbnMsIGFuZCAjaGFzaHRhZ3MgYXJlIGV4dHJhY3RlZCBhbmQgY29udmVydGVkIGludG8gbGlua3MuXG4gKiBGb3JtcyBhbmQgYnV0dG9ucyBjYW4gYmUgYWRkZWQgcHJvY2VkdXJhbGx5LlxuICogSlNPTiBkYXRhIHJlcHJlc2VudGF0aW9uIGlzIGluc3BpcmVkIGJ5IERyYWZ0LmpzIHJhdyBmb3JtYXR0aW5nLlxuICpcbiAqXG4gKiBAZXhhbXBsZVxuICogVGV4dDpcbiAqIDxwcmU+XG4gKiAgICAgdGhpcyBpcyAqYm9sZCosIGBjb2RlYCBhbmQgX2l0YWxpY18sIH5zdHJpa2V+XG4gKiAgICAgY29tYmluZWQgKmJvbGQgYW5kIF9pdGFsaWNfKlxuICogICAgIGFuIHVybDogaHR0cHM6Ly93d3cuZXhhbXBsZS5jb20vYWJjI2ZyYWdtZW50IGFuZCBhbm90aGVyIF93d3cudGlub2RlLmNvX1xuICogICAgIHRoaXMgaXMgYSBAbWVudGlvbiBhbmQgYSAjaGFzaHRhZyBpbiBhIHN0cmluZ1xuICogICAgIHNlY29uZCAjaGFzaHRhZ1xuICogPC9wcmU+XG4gKlxuICogIFNhbXBsZSBKU09OIHJlcHJlc2VudGF0aW9uIG9mIHRoZSB0ZXh0IGFib3ZlOlxuICogIHtcbiAqICAgICBcInR4dFwiOiBcInRoaXMgaXMgYm9sZCwgY29kZSBhbmQgaXRhbGljLCBzdHJpa2UgY29tYmluZWQgYm9sZCBhbmQgaXRhbGljIGFuIHVybDogaHR0cHM6Ly93d3cuZXhhbXBsZS5jb20vYWJjI2ZyYWdtZW50IFwiICtcbiAqICAgICAgICAgICAgIFwiYW5kIGFub3RoZXIgd3d3LnRpbm9kZS5jbyB0aGlzIGlzIGEgQG1lbnRpb24gYW5kIGEgI2hhc2h0YWcgaW4gYSBzdHJpbmcgc2Vjb25kICNoYXNodGFnXCIsXG4gKiAgICAgXCJmbXRcIjogW1xuICogICAgICAgICB7IFwiYXRcIjo4LCBcImxlblwiOjQsXCJ0cFwiOlwiU1RcIiB9LHsgXCJhdFwiOjE0LCBcImxlblwiOjQsIFwidHBcIjpcIkNPXCIgfSx7IFwiYXRcIjoyMywgXCJsZW5cIjo2LCBcInRwXCI6XCJFTVwifSxcbiAqICAgICAgICAgeyBcImF0XCI6MzEsIFwibGVuXCI6NiwgXCJ0cFwiOlwiRExcIiB9LHsgXCJ0cFwiOlwiQlJcIiwgXCJsZW5cIjoxLCBcImF0XCI6MzcgfSx7IFwiYXRcIjo1NiwgXCJsZW5cIjo2LCBcInRwXCI6XCJFTVwiIH0sXG4gKiAgICAgICAgIHsgXCJhdFwiOjQ3LCBcImxlblwiOjE1LCBcInRwXCI6XCJTVFwiIH0seyBcInRwXCI6XCJCUlwiLCBcImxlblwiOjEsIFwiYXRcIjo2MiB9LHsgXCJhdFwiOjEyMCwgXCJsZW5cIjoxMywgXCJ0cFwiOlwiRU1cIiB9LFxuICogICAgICAgICB7IFwiYXRcIjo3MSwgXCJsZW5cIjozNiwgXCJrZXlcIjowIH0seyBcImF0XCI6MTIwLCBcImxlblwiOjEzLCBcImtleVwiOjEgfSx7IFwidHBcIjpcIkJSXCIsIFwibGVuXCI6MSwgXCJhdFwiOjEzMyB9LFxuICogICAgICAgICB7IFwiYXRcIjoxNDQsIFwibGVuXCI6OCwgXCJrZXlcIjoyIH0seyBcImF0XCI6MTU5LCBcImxlblwiOjgsIFwia2V5XCI6MyB9LHsgXCJ0cFwiOlwiQlJcIiwgXCJsZW5cIjoxLCBcImF0XCI6MTc5IH0sXG4gKiAgICAgICAgIHsgXCJhdFwiOjE4NywgXCJsZW5cIjo4LCBcImtleVwiOjMgfSx7IFwidHBcIjpcIkJSXCIsIFwibGVuXCI6MSwgXCJhdFwiOjE5NSB9XG4gKiAgICAgXSxcbiAqICAgICBcImVudFwiOiBbXG4gKiAgICAgICAgIHsgXCJ0cFwiOlwiTE5cIiwgXCJkYXRhXCI6eyBcInVybFwiOlwiaHR0cHM6Ly93d3cuZXhhbXBsZS5jb20vYWJjI2ZyYWdtZW50XCIgfSB9LFxuICogICAgICAgICB7IFwidHBcIjpcIkxOXCIsIFwiZGF0YVwiOnsgXCJ1cmxcIjpcImh0dHA6Ly93d3cudGlub2RlLmNvXCIgfSB9LFxuICogICAgICAgICB7IFwidHBcIjpcIk1OXCIsIFwiZGF0YVwiOnsgXCJ2YWxcIjpcIm1lbnRpb25cIiB9IH0sXG4gKiAgICAgICAgIHsgXCJ0cFwiOlwiSFRcIiwgXCJkYXRhXCI6eyBcInZhbFwiOlwiaGFzaHRhZ1wiIH0gfVxuICogICAgIF1cbiAqICB9XG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vLyBOT1RFIFRPIERFVkVMT1BFUlM6XG4vLyBMb2NhbGl6YWJsZSBzdHJpbmdzIHNob3VsZCBiZSBkb3VibGUgcXVvdGVkIFwi0YHRgtGA0L7QutCwINC90LAg0LTRgNGD0LPQvtC8INGP0LfRi9C60LVcIixcbi8vIG5vbi1sb2NhbGl6YWJsZSBzdHJpbmdzIHNob3VsZCBiZSBzaW5nbGUgcXVvdGVkICdub24tbG9jYWxpemVkJy5cblxuY29uc3QgTUFYX0ZPUk1fRUxFTUVOVFMgPSA4O1xuY29uc3QgTUFYX1BSRVZJRVdfQVRUQUNITUVOVFMgPSAzO1xuY29uc3QgTUFYX1BSRVZJRVdfREFUQV9TSVpFID0gNjQ7XG5jb25zdCBKU09OX01JTUVfVFlQRSA9ICdhcHBsaWNhdGlvbi9qc29uJztcbmNvbnN0IERSQUZUWV9NSU1FX1RZUEUgPSAndGV4dC94LWRyYWZ0eSc7XG5jb25zdCBBTExPV0VEX0VOVF9GSUVMRFMgPSBbJ2FjdCcsICdoZWlnaHQnLCAnZHVyYXRpb24nLCAnaW5jb21pbmcnLCAnbWltZScsICduYW1lJywgJ3ByZW1pbWUnLCAncHJlcmVmJywgJ3ByZXZpZXcnLFxuICAncmVmJywgJ3NpemUnLCAnc3RhdGUnLCAndXJsJywgJ3ZhbCcsICd3aWR0aCdcbl07XG5cbi8vIFJlZ3VsYXIgZXhwcmVzc2lvbnMgZm9yIHBhcnNpbmcgaW5saW5lIGZvcm1hdHMuIEphdmFzY3JpcHQgZG9lcyBub3Qgc3VwcG9ydCBsb29rYmVoaW5kLFxuLy8gc28gaXQncyBhIGJpdCBtZXNzeS5cbmNvbnN0IElOTElORV9TVFlMRVMgPSBbXG4gIC8vIFN0cm9uZyA9IGJvbGQsICpib2xkIHRleHQqXG4gIHtcbiAgICBuYW1lOiAnU1QnLFxuICAgIHN0YXJ0OiAvKD86XnxbXFxXX10pKFxcKilbXlxccypdLyxcbiAgICBlbmQ6IC9bXlxccypdKFxcKikoPz0kfFtcXFdfXSkvXG4gIH0sXG4gIC8vIEVtcGhlc2l6ZWQgPSBpdGFsaWMsIF9pdGFsaWMgdGV4dF9cbiAge1xuICAgIG5hbWU6ICdFTScsXG4gICAgc3RhcnQ6IC8oPzpefFxcVykoXylbXlxcc19dLyxcbiAgICBlbmQ6IC9bXlxcc19dKF8pKD89JHxcXFcpL1xuICB9LFxuICAvLyBEZWxldGVkLCB+c3RyaWtlIHRoaXMgdGhvdWdoflxuICB7XG4gICAgbmFtZTogJ0RMJyxcbiAgICBzdGFydDogLyg/Ol58W1xcV19dKSh+KVteXFxzfl0vLFxuICAgIGVuZDogL1teXFxzfl0ofikoPz0kfFtcXFdfXSkvXG4gIH0sXG4gIC8vIENvZGUgYmxvY2sgYHRoaXMgaXMgbW9ub3NwYWNlYFxuICB7XG4gICAgbmFtZTogJ0NPJyxcbiAgICBzdGFydDogLyg/Ol58XFxXKShgKVteYF0vLFxuICAgIGVuZDogL1teYF0oYCkoPz0kfFxcVykvXG4gIH1cbl07XG5cbi8vIFJlbGF0aXZlIHdlaWdodHMgb2YgZm9ybWF0dGluZyBzcGFucy4gR3JlYXRlciBpbmRleCBpbiBhcnJheSBtZWFucyBncmVhdGVyIHdlaWdodC5cbmNvbnN0IEZNVF9XRUlHSFQgPSBbJ1FRJ107XG5cbi8vIFJlZ0V4cHMgZm9yIGVudGl0eSBleHRyYWN0aW9uIChSRiA9IHJlZmVyZW5jZSlcbmNvbnN0IEVOVElUWV9UWVBFUyA9IFtcbiAgLy8gVVJMc1xuICB7XG4gICAgbmFtZTogJ0xOJyxcbiAgICBkYXRhTmFtZTogJ3VybCcsXG4gICAgcGFjazogZnVuY3Rpb24odmFsKSB7XG4gICAgICAvLyBDaGVjayBpZiB0aGUgcHJvdG9jb2wgaXMgc3BlY2lmaWVkLCBpZiBub3QgdXNlIGh0dHBcbiAgICAgIGlmICghL15bYS16XSs6XFwvXFwvL2kudGVzdCh2YWwpKSB7XG4gICAgICAgIHZhbCA9ICdodHRwOi8vJyArIHZhbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHVybDogdmFsXG4gICAgICB9O1xuICAgIH0sXG4gICAgcmU6IC8oPzooPzpodHRwcz98ZnRwKTpcXC9cXC98d3d3XFwufGZ0cFxcLilbLUEtWjAtOSsmQCNcXC8lPX5ffCQ/ITosLl0qW0EtWjAtOSsmQCNcXC8lPX5ffCRdL2lnXG4gIH0sXG4gIC8vIE1lbnRpb25zIEB1c2VyIChtdXN0IGJlIDIgb3IgbW9yZSBjaGFyYWN0ZXJzKVxuICB7XG4gICAgbmFtZTogJ01OJyxcbiAgICBkYXRhTmFtZTogJ3ZhbCcsXG4gICAgcGFjazogZnVuY3Rpb24odmFsKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB2YWw6IHZhbC5zbGljZSgxKVxuICAgICAgfTtcbiAgICB9LFxuICAgIHJlOiAvXFxCQChbXFxwe0x9XFxwe059XVsuX1xccHtMfVxccHtOfV0qW1xccHtMfVxccHtOfV0pL3VnXG4gIH0sXG4gIC8vIEhhc2h0YWdzICNoYXNodGFnLCBsaWtlIG1ldGlvbiAyIG9yIG1vcmUgY2hhcmFjdGVycy5cbiAge1xuICAgIG5hbWU6ICdIVCcsXG4gICAgZGF0YU5hbWU6ICd2YWwnLFxuICAgIHBhY2s6IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdmFsOiB2YWwuc2xpY2UoMSlcbiAgICAgIH07XG4gICAgfSxcbiAgICByZTogL1xcQiMoW1xccHtMfVxccHtOfV1bLl9cXHB7TH1cXHB7Tn1dKltcXHB7TH1cXHB7Tn1dKS91Z1xuICB9XG5dO1xuXG4vLyBIVE1MIHRhZyBuYW1lIHN1Z2dlc3Rpb25zXG5jb25zdCBGT1JNQVRfVEFHUyA9IHtcbiAgQVU6IHtcbiAgICBodG1sX3RhZzogJ2F1ZGlvJyxcbiAgICBtZF90YWc6IHVuZGVmaW5lZCxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIEJOOiB7XG4gICAgaHRtbF90YWc6ICdidXR0b24nLFxuICAgIG1kX3RhZzogdW5kZWZpbmVkLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgQlI6IHtcbiAgICBodG1sX3RhZzogJ2JyJyxcbiAgICBtZF90YWc6ICdcXG4nLFxuICAgIGlzVm9pZDogdHJ1ZVxuICB9LFxuICBDTzoge1xuICAgIGh0bWxfdGFnOiAndHQnLFxuICAgIG1kX3RhZzogJ2AnLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgREw6IHtcbiAgICBodG1sX3RhZzogJ2RlbCcsXG4gICAgbWRfdGFnOiAnficsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBFTToge1xuICAgIGh0bWxfdGFnOiAnaScsXG4gICAgbWRfdGFnOiAnXycsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBFWDoge1xuICAgIGh0bWxfdGFnOiAnJyxcbiAgICBtZF90YWc6IHVuZGVmaW5lZCxcbiAgICBpc1ZvaWQ6IHRydWVcbiAgfSxcbiAgRk06IHtcbiAgICBodG1sX3RhZzogJ2RpdicsXG4gICAgbWRfdGFnOiB1bmRlZmluZWQsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBIRDoge1xuICAgIGh0bWxfdGFnOiAnJyxcbiAgICBtZF90YWc6IHVuZGVmaW5lZCxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIEhMOiB7XG4gICAgaHRtbF90YWc6ICdzcGFuJyxcbiAgICBtZF90YWc6IHVuZGVmaW5lZCxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIEhUOiB7XG4gICAgaHRtbF90YWc6ICdhJyxcbiAgICBtZF90YWc6IHVuZGVmaW5lZCxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIElNOiB7XG4gICAgaHRtbF90YWc6ICdpbWcnLFxuICAgIG1kX3RhZzogdW5kZWZpbmVkLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgTE46IHtcbiAgICBodG1sX3RhZzogJ2EnLFxuICAgIG1kX3RhZzogdW5kZWZpbmVkLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgTU46IHtcbiAgICBodG1sX3RhZzogJ2EnLFxuICAgIG1kX3RhZzogdW5kZWZpbmVkLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgUlc6IHtcbiAgICBodG1sX3RhZzogJ2RpdicsXG4gICAgbWRfdGFnOiB1bmRlZmluZWQsXG4gICAgaXNWb2lkOiBmYWxzZSxcbiAgfSxcbiAgUVE6IHtcbiAgICBodG1sX3RhZzogJ2RpdicsXG4gICAgbWRfdGFnOiB1bmRlZmluZWQsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBTVDoge1xuICAgIGh0bWxfdGFnOiAnYicsXG4gICAgbWRfdGFnOiAnKicsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBWQzoge1xuICAgIGh0bWxfdGFnOiAnZGl2JyxcbiAgICBtZF90YWc6IHVuZGVmaW5lZCxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIFZEOiB7XG4gICAgaHRtbF90YWc6ICd2aWRlbycsXG4gICAgbWRfdGFnOiB1bmRlZmluZWQsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9XG59O1xuXG4vLyBDb252ZXJ0IGJhc2U2NC1lbmNvZGVkIHN0cmluZyBpbnRvIEJsb2IuXG5mdW5jdGlvbiBiYXNlNjR0b09iamVjdFVybChiNjQsIGNvbnRlbnRUeXBlLCBsb2dnZXIpIHtcbiAgaWYgKCFiNjQpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHRyeSB7XG4gICAgY29uc3QgYmluID0gYXRvYihiNjQpO1xuICAgIGNvbnN0IGxlbmd0aCA9IGJpbi5sZW5ndGg7XG4gICAgY29uc3QgYnVmID0gbmV3IEFycmF5QnVmZmVyKGxlbmd0aCk7XG4gICAgY29uc3QgYXJyID0gbmV3IFVpbnQ4QXJyYXkoYnVmKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBhcnJbaV0gPSBiaW4uY2hhckNvZGVBdChpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gVVJMLmNyZWF0ZU9iamVjdFVSTChuZXcgQmxvYihbYnVmXSwge1xuICAgICAgdHlwZTogY29udGVudFR5cGVcbiAgICB9KSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGlmIChsb2dnZXIpIHtcbiAgICAgIGxvZ2dlcihcIkRyYWZ0eTogZmFpbGVkIHRvIGNvbnZlcnQgb2JqZWN0LlwiLCBlcnIubWVzc2FnZSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIGJhc2U2NHRvRGF0YVVybChiNjQsIGNvbnRlbnRUeXBlKSB7XG4gIGlmICghYjY0KSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgY29udGVudFR5cGUgPSBjb250ZW50VHlwZSB8fCAnaW1hZ2UvanBlZyc7XG4gIHJldHVybiAnZGF0YTonICsgY29udGVudFR5cGUgKyAnO2Jhc2U2NCwnICsgYjY0O1xufVxuXG4vLyBIZWxwZXJzIGZvciBjb252ZXJ0aW5nIERyYWZ0eSB0byBIVE1MLlxuY29uc3QgREVDT1JBVE9SUyA9IHtcbiAgLy8gVmlzaWFsIHN0eWxlc1xuICBTVDoge1xuICAgIG9wZW46IF8gPT4gJzxiPicsXG4gICAgY2xvc2U6IF8gPT4gJzwvYj4nXG4gIH0sXG4gIEVNOiB7XG4gICAgb3BlbjogXyA9PiAnPGk+JyxcbiAgICBjbG9zZTogXyA9PiAnPC9pPidcbiAgfSxcbiAgREw6IHtcbiAgICBvcGVuOiBfID0+ICc8ZGVsPicsXG4gICAgY2xvc2U6IF8gPT4gJzwvZGVsPidcbiAgfSxcbiAgQ086IHtcbiAgICBvcGVuOiBfID0+ICc8dHQ+JyxcbiAgICBjbG9zZTogXyA9PiAnPC90dD4nXG4gIH0sXG4gIC8vIExpbmUgYnJlYWtcbiAgQlI6IHtcbiAgICBvcGVuOiBfID0+ICc8YnIvPicsXG4gICAgY2xvc2U6IF8gPT4gJydcbiAgfSxcbiAgLy8gSGlkZGVuIGVsZW1lbnRcbiAgSEQ6IHtcbiAgICBvcGVuOiBfID0+ICcnLFxuICAgIGNsb3NlOiBfID0+ICcnXG4gIH0sXG4gIC8vIEhpZ2hsaWdodGVkIGVsZW1lbnQuXG4gIEhMOiB7XG4gICAgb3BlbjogXyA9PiAnPHNwYW4gc3R5bGU9XCJjb2xvcjp0ZWFsXCI+JyxcbiAgICBjbG9zZTogXyA9PiAnPC9zcGFuPidcbiAgfSxcbiAgLy8gTGluayAoVVJMKVxuICBMTjoge1xuICAgIG9wZW46IChkYXRhKSA9PiB7XG4gICAgICByZXR1cm4gJzxhIGhyZWY9XCInICsgZGF0YS51cmwgKyAnXCI+JztcbiAgICB9LFxuICAgIGNsb3NlOiBfID0+ICc8L2E+JyxcbiAgICBwcm9wczogKGRhdGEpID0+IHtcbiAgICAgIHJldHVybiBkYXRhID8ge1xuICAgICAgICBocmVmOiBkYXRhLnVybCxcbiAgICAgICAgdGFyZ2V0OiAnX2JsYW5rJ1xuICAgICAgfSA6IG51bGw7XG4gICAgfSxcbiAgfSxcbiAgLy8gTWVudGlvblxuICBNTjoge1xuICAgIG9wZW46IChkYXRhKSA9PiB7XG4gICAgICByZXR1cm4gJzxhIGhyZWY9XCIjJyArIGRhdGEudmFsICsgJ1wiPic7XG4gICAgfSxcbiAgICBjbG9zZTogXyA9PiAnPC9hPicsXG4gICAgcHJvcHM6IChkYXRhKSA9PiB7XG4gICAgICByZXR1cm4gZGF0YSA/IHtcbiAgICAgICAgaWQ6IGRhdGEudmFsXG4gICAgICB9IDogbnVsbDtcbiAgICB9LFxuICB9LFxuICAvLyBIYXNodGFnXG4gIEhUOiB7XG4gICAgb3BlbjogKGRhdGEpID0+IHtcbiAgICAgIHJldHVybiAnPGEgaHJlZj1cIiMnICsgZGF0YS52YWwgKyAnXCI+JztcbiAgICB9LFxuICAgIGNsb3NlOiBfID0+ICc8L2E+JyxcbiAgICBwcm9wczogKGRhdGEpID0+IHtcbiAgICAgIHJldHVybiBkYXRhID8ge1xuICAgICAgICBpZDogZGF0YS52YWxcbiAgICAgIH0gOiBudWxsO1xuICAgIH0sXG4gIH0sXG4gIC8vIEJ1dHRvblxuICBCTjoge1xuICAgIG9wZW46IF8gPT4gJzxidXR0b24+JyxcbiAgICBjbG9zZTogXyA9PiAnPC9idXR0b24+JyxcbiAgICBwcm9wczogKGRhdGEpID0+IHtcbiAgICAgIHJldHVybiBkYXRhID8ge1xuICAgICAgICAnZGF0YS1hY3QnOiBkYXRhLmFjdCxcbiAgICAgICAgJ2RhdGEtdmFsJzogZGF0YS52YWwsXG4gICAgICAgICdkYXRhLW5hbWUnOiBkYXRhLm5hbWUsXG4gICAgICAgICdkYXRhLXJlZic6IGRhdGEucmVmXG4gICAgICB9IDogbnVsbDtcbiAgICB9LFxuICB9LFxuICAvLyBBdWRpbyByZWNvcmRpbmdcbiAgQVU6IHtcbiAgICBvcGVuOiAoZGF0YSkgPT4ge1xuICAgICAgY29uc3QgdXJsID0gZGF0YS5yZWYgfHwgYmFzZTY0dG9PYmplY3RVcmwoZGF0YS52YWwsIGRhdGEubWltZSwgRHJhZnR5LmxvZ2dlcik7XG4gICAgICByZXR1cm4gJzxhdWRpbyBjb250cm9scyBzcmM9XCInICsgdXJsICsgJ1wiPic7XG4gICAgfSxcbiAgICBjbG9zZTogXyA9PiAnPC9hdWRpbz4nLFxuICAgIHByb3BzOiAoZGF0YSkgPT4ge1xuICAgICAgaWYgKCFkYXRhKSByZXR1cm4gbnVsbDtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC8vIEVtYmVkZGVkIGRhdGEgb3IgZXh0ZXJuYWwgbGluay5cbiAgICAgICAgc3JjOiBkYXRhLnJlZiB8fCBiYXNlNjR0b09iamVjdFVybChkYXRhLnZhbCwgZGF0YS5taW1lLCBEcmFmdHkubG9nZ2VyKSxcbiAgICAgICAgJ2RhdGEtcHJlbG9hZCc6IGRhdGEucmVmID8gJ21ldGFkYXRhJyA6ICdhdXRvJyxcbiAgICAgICAgJ2RhdGEtZHVyYXRpb24nOiBkYXRhLmR1cmF0aW9uLFxuICAgICAgICAnZGF0YS1uYW1lJzogZGF0YS5uYW1lLFxuICAgICAgICAnZGF0YS1zaXplJzogZGF0YS52YWwgPyAoKGRhdGEudmFsLmxlbmd0aCAqIDAuNzUpIHwgMCkgOiAoZGF0YS5zaXplIHwgMCksXG4gICAgICAgICdkYXRhLW1pbWUnOiBkYXRhLm1pbWUsXG4gICAgICB9O1xuICAgIH1cbiAgfSxcbiAgLy8gSW1hZ2VcbiAgSU06IHtcbiAgICBvcGVuOiBkYXRhID0+IHtcbiAgICAgIC8vIERvbid0IHVzZSBkYXRhLnJlZiBmb3IgcHJldmlldzogaXQncyBhIHNlY3VyaXR5IHJpc2suXG4gICAgICBjb25zdCB0bXBQcmV2aWV3VXJsID0gYmFzZTY0dG9EYXRhVXJsKGRhdGEuX3RlbXBQcmV2aWV3LCBkYXRhLm1pbWUpO1xuICAgICAgY29uc3QgcHJldmlld1VybCA9IGJhc2U2NHRvT2JqZWN0VXJsKGRhdGEudmFsLCBkYXRhLm1pbWUsIERyYWZ0eS5sb2dnZXIpO1xuICAgICAgY29uc3QgZG93bmxvYWRVcmwgPSBkYXRhLnJlZiB8fCBwcmV2aWV3VXJsO1xuICAgICAgcmV0dXJuIChkYXRhLm5hbWUgPyAnPGEgaHJlZj1cIicgKyBkb3dubG9hZFVybCArICdcIiBkb3dubG9hZD1cIicgKyBkYXRhLm5hbWUgKyAnXCI+JyA6ICcnKSArXG4gICAgICAgICc8aW1nIHNyYz1cIicgKyAodG1wUHJldmlld1VybCB8fCBwcmV2aWV3VXJsKSArICdcIicgK1xuICAgICAgICAoZGF0YS53aWR0aCA/ICcgd2lkdGg9XCInICsgZGF0YS53aWR0aCArICdcIicgOiAnJykgK1xuICAgICAgICAoZGF0YS5oZWlnaHQgPyAnIGhlaWdodD1cIicgKyBkYXRhLmhlaWdodCArICdcIicgOiAnJykgKyAnIGJvcmRlcj1cIjBcIiAvPic7XG4gICAgfSxcbiAgICBjbG9zZTogZGF0YSA9PiB7XG4gICAgICByZXR1cm4gKGRhdGEubmFtZSA/ICc8L2E+JyA6ICcnKTtcbiAgICB9LFxuICAgIHByb3BzOiBkYXRhID0+IHtcbiAgICAgIGlmICghZGF0YSkgcmV0dXJuIG51bGw7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAvLyBUZW1wb3JhcnkgcHJldmlldywgb3IgcGVybWFuZW50IHByZXZpZXcsIG9yIGV4dGVybmFsIGxpbmsuXG4gICAgICAgIHNyYzogYmFzZTY0dG9EYXRhVXJsKGRhdGEuX3RlbXBQcmV2aWV3LCBkYXRhLm1pbWUpIHx8XG4gICAgICAgICAgZGF0YS5yZWYgfHwgYmFzZTY0dG9PYmplY3RVcmwoZGF0YS52YWwsIGRhdGEubWltZSwgRHJhZnR5LmxvZ2dlciksXG4gICAgICAgIHRpdGxlOiBkYXRhLm5hbWUsXG4gICAgICAgIGFsdDogZGF0YS5uYW1lLFxuICAgICAgICAnZGF0YS13aWR0aCc6IGRhdGEud2lkdGgsXG4gICAgICAgICdkYXRhLWhlaWdodCc6IGRhdGEuaGVpZ2h0LFxuICAgICAgICAnZGF0YS1uYW1lJzogZGF0YS5uYW1lLFxuICAgICAgICAnZGF0YS1zaXplJzogZGF0YS52YWwgPyAoKGRhdGEudmFsLmxlbmd0aCAqIDAuNzUpIHwgMCkgOiAoZGF0YS5zaXplIHwgMCksXG4gICAgICAgICdkYXRhLW1pbWUnOiBkYXRhLm1pbWUsXG4gICAgICB9O1xuICAgIH0sXG4gIH0sXG4gIC8vIEZvcm0gLSBzdHJ1Y3R1cmVkIGxheW91dCBvZiBlbGVtZW50cy5cbiAgRk06IHtcbiAgICBvcGVuOiBfID0+ICc8ZGl2PicsXG4gICAgY2xvc2U6IF8gPT4gJzwvZGl2PidcbiAgfSxcbiAgLy8gUm93OiBsb2dpYyBncm91cGluZyBvZiBlbGVtZW50c1xuICBSVzoge1xuICAgIG9wZW46IF8gPT4gJzxkaXY+JyxcbiAgICBjbG9zZTogXyA9PiAnPC9kaXY+J1xuICB9LFxuICAvLyBRdW90ZWQgYmxvY2suXG4gIFFROiB7XG4gICAgb3BlbjogXyA9PiAnPGRpdj4nLFxuICAgIGNsb3NlOiBfID0+ICc8L2Rpdj4nLFxuICAgIHByb3BzOiAoZGF0YSkgPT4ge1xuICAgICAgcmV0dXJuIGRhdGEgPyB7fSA6IG51bGw7XG4gICAgfSxcbiAgfSxcbiAgLy8gVmlkZW8gY2FsbFxuICBWQzoge1xuICAgIG9wZW46IF8gPT4gJzxkaXY+JyxcbiAgICBjbG9zZTogXyA9PiAnPC9kaXY+JyxcbiAgICBwcm9wczogZGF0YSA9PiB7XG4gICAgICBpZiAoIWRhdGEpIHJldHVybiB7fTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgICdkYXRhLWR1cmF0aW9uJzogZGF0YS5kdXJhdGlvbixcbiAgICAgICAgJ2RhdGEtc3RhdGUnOiBkYXRhLnN0YXRlLFxuICAgICAgfTtcbiAgICB9XG4gIH0sXG4gIC8vIFZpZGVvLlxuICBWRDoge1xuICAgIG9wZW46IGRhdGEgPT4ge1xuICAgICAgY29uc3QgdG1wUHJldmlld1VybCA9IGJhc2U2NHRvRGF0YVVybChkYXRhLl90ZW1wUHJldmlldywgZGF0YS5taW1lKTtcbiAgICAgIGNvbnN0IHByZXZpZXdVcmwgPSBkYXRhLnJlZiB8fCBiYXNlNjR0b09iamVjdFVybChkYXRhLnByZXZpZXcsIGRhdGEucHJlbWltZSB8fCAnaW1hZ2UvanNvbicsIERyYWZ0eS5sb2dnZXIpO1xuICAgICAgcmV0dXJuICc8aW1nIHNyYz1cIicgKyAodG1wUHJldmlld1VybCB8fCBwcmV2aWV3VXJsKSArICdcIicgK1xuICAgICAgICAoZGF0YS53aWR0aCA/ICcgd2lkdGg9XCInICsgZGF0YS53aWR0aCArICdcIicgOiAnJykgK1xuICAgICAgICAoZGF0YS5oZWlnaHQgPyAnIGhlaWdodD1cIicgKyBkYXRhLmhlaWdodCArICdcIicgOiAnJykgKyAnIGJvcmRlcj1cIjBcIiAvPic7XG4gICAgfSxcbiAgICBjbG9zZTogXyA9PiAnJyxcbiAgICBwcm9wczogZGF0YSA9PiB7XG4gICAgICBpZiAoIWRhdGEpIHJldHVybiBudWxsO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLy8gRW1iZWRkZWQgZGF0YSBvciBleHRlcm5hbCBsaW5rLlxuICAgICAgICBzcmM6IGRhdGEucHJlcmVmIHx8IGJhc2U2NHRvT2JqZWN0VXJsKGRhdGEucHJldmlldywgZGF0YS5wcmVtaW1lIHx8ICdpbWFnZS9qc29uJywgRHJhZnR5LmxvZ2dlciksXG4gICAgICAgICdkYXRhLXNyYyc6IGRhdGEucmVmIHx8IGJhc2U2NHRvT2JqZWN0VXJsKGRhdGEudmFsLCBkYXRhLm1pbWUsIERyYWZ0eS5sb2dnZXIpLFxuICAgICAgICAnZGF0YS13aWR0aCc6IGRhdGEud2lkdGgsXG4gICAgICAgICdkYXRhLWhlaWdodCc6IGRhdGEuaGVpZ2h0LFxuICAgICAgICAnZGF0YS1wcmVsb2FkJzogZGF0YS5yZWYgPyAnbWV0YWRhdGEnIDogJ2F1dG8nLFxuICAgICAgICAnZGF0YS1wcmV2aWV3JzogYmFzZTY0dG9PYmplY3RVcmwoZGF0YS5wcmV2aWV3LCBkYXRhLnByZW1pbWUgfHwgJ2ltYWdlL2pzb24nLCBEcmFmdHkubG9nZ2VyKSxcbiAgICAgICAgJ2RhdGEtZHVyYXRpb24nOiBkYXRhLmR1cmF0aW9uIHwgMCxcbiAgICAgICAgJ2RhdGEtbmFtZSc6IGRhdGEubmFtZSxcbiAgICAgICAgJ2RhdGEtc2l6ZSc6IGRhdGEudmFsID8gKChkYXRhLnZhbC5sZW5ndGggKiAwLjc1KSB8IDApIDogKGRhdGEuc2l6ZSB8IDApLFxuICAgICAgICAnZGF0YS1taW1lJzogZGF0YS5taW1lLFxuICAgICAgfTtcbiAgICB9XG4gIH0sXG59O1xuXG4vKipcbiAqIFRoZSBtYWluIG9iamVjdCB3aGljaCBwZXJmb3JtcyBhbGwgdGhlIGZvcm1hdHRpbmcgYWN0aW9ucy5cbiAqIEBjbGFzcyBEcmFmdHlcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5jb25zdCBEcmFmdHkgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy50eHQgPSAnJztcbiAgdGhpcy5mbXQgPSBbXTtcbiAgdGhpcy5lbnQgPSBbXTtcbn1cblxuLyoqXG4gKiBJbml0aWFsaXplIERyYWZ0eSBkb2N1bWVudCB0byBhIHBsYWluIHRleHQgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBwbGFpblRleHQgLSBzdHJpbmcgdG8gdXNlIGFzIERyYWZ0eSBjb250ZW50LlxuICpcbiAqIEByZXR1cm5zIG5ldyBEcmFmdHkgZG9jdW1lbnQgb3IgbnVsbCBpcyBwbGFpblRleHQgaXMgbm90IGEgc3RyaW5nIG9yIHVuZGVmaW5lZC5cbiAqL1xuRHJhZnR5LmluaXQgPSBmdW5jdGlvbihwbGFpblRleHQpIHtcbiAgaWYgKHR5cGVvZiBwbGFpblRleHQgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBwbGFpblRleHQgPSAnJztcbiAgfSBlbHNlIGlmICh0eXBlb2YgcGxhaW5UZXh0ICE9ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHR4dDogcGxhaW5UZXh0XG4gIH07XG59XG5cbi8qKlxuICogUGFyc2UgcGxhaW4gdGV4dCBpbnRvIERyYWZ0eSBkb2N1bWVudC5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gY29udGVudCAtIHBsYWluLXRleHQgY29udGVudCB0byBwYXJzZS5cbiAqIEByZXR1cm4ge0RyYWZ0eX0gcGFyc2VkIGRvY3VtZW50IG9yIG51bGwgaWYgdGhlIHNvdXJjZSBpcyBub3QgcGxhaW4gdGV4dC5cbiAqL1xuRHJhZnR5LnBhcnNlID0gZnVuY3Rpb24oY29udGVudCkge1xuICAvLyBNYWtlIHN1cmUgd2UgYXJlIHBhcnNpbmcgc3RyaW5ncyBvbmx5LlxuICBpZiAodHlwZW9mIGNvbnRlbnQgIT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIFNwbGl0IHRleHQgaW50byBsaW5lcy4gSXQgbWFrZXMgZnVydGhlciBwcm9jZXNzaW5nIGVhc2llci5cbiAgY29uc3QgbGluZXMgPSBjb250ZW50LnNwbGl0KC9cXHI/XFxuLyk7XG5cbiAgLy8gSG9sZHMgZW50aXRpZXMgcmVmZXJlbmNlZCBmcm9tIHRleHRcbiAgY29uc3QgZW50aXR5TWFwID0gW107XG4gIGNvbnN0IGVudGl0eUluZGV4ID0ge307XG5cbiAgLy8gUHJvY2Vzc2luZyBsaW5lcyBvbmUgYnkgb25lLCBob2xkIGludGVybWVkaWF0ZSByZXN1bHQgaW4gYmx4LlxuICBjb25zdCBibHggPSBbXTtcbiAgbGluZXMuZm9yRWFjaCgobGluZSkgPT4ge1xuICAgIGxldCBzcGFucyA9IFtdO1xuICAgIGxldCBlbnRpdGllcztcblxuICAgIC8vIEZpbmQgZm9ybWF0dGVkIHNwYW5zIGluIHRoZSBzdHJpbmcuXG4gICAgLy8gVHJ5IHRvIG1hdGNoIGVhY2ggc3R5bGUuXG4gICAgSU5MSU5FX1NUWUxFUy5mb3JFYWNoKCh0YWcpID0+IHtcbiAgICAgIC8vIEVhY2ggc3R5bGUgY291bGQgYmUgbWF0Y2hlZCBtdWx0aXBsZSB0aW1lcy5cbiAgICAgIHNwYW5zID0gc3BhbnMuY29uY2F0KHNwYW5uaWZ5KGxpbmUsIHRhZy5zdGFydCwgdGFnLmVuZCwgdGFnLm5hbWUpKTtcbiAgICB9KTtcblxuICAgIGxldCBibG9jaztcbiAgICBpZiAoc3BhbnMubGVuZ3RoID09IDApIHtcbiAgICAgIGJsb2NrID0ge1xuICAgICAgICB0eHQ6IGxpbmVcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFNvcnQgc3BhbnMgYnkgc3R5bGUgb2NjdXJlbmNlIGVhcmx5IC0+IGxhdGUsIHRoZW4gYnkgbGVuZ3RoOiBmaXJzdCBsb25nIHRoZW4gc2hvcnQuXG4gICAgICBzcGFucy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIGNvbnN0IGRpZmYgPSBhLmF0IC0gYi5hdDtcbiAgICAgICAgcmV0dXJuIGRpZmYgIT0gMCA/IGRpZmYgOiBiLmVuZCAtIGEuZW5kO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIENvbnZlcnQgYW4gYXJyYXkgb2YgcG9zc2libHkgb3ZlcmxhcHBpbmcgc3BhbnMgaW50byBhIHRyZWUuXG4gICAgICBzcGFucyA9IHRvU3BhblRyZWUoc3BhbnMpO1xuXG4gICAgICAvLyBCdWlsZCBhIHRyZWUgcmVwcmVzZW50YXRpb24gb2YgdGhlIGVudGlyZSBzdHJpbmcsIG5vdFxuICAgICAgLy8ganVzdCB0aGUgZm9ybWF0dGVkIHBhcnRzLlxuICAgICAgY29uc3QgY2h1bmtzID0gY2h1bmtpZnkobGluZSwgMCwgbGluZS5sZW5ndGgsIHNwYW5zKTtcblxuICAgICAgY29uc3QgZHJhZnR5ID0gZHJhZnRpZnkoY2h1bmtzLCAwKTtcblxuICAgICAgYmxvY2sgPSB7XG4gICAgICAgIHR4dDogZHJhZnR5LnR4dCxcbiAgICAgICAgZm10OiBkcmFmdHkuZm10XG4gICAgICB9O1xuICAgIH1cblxuICAgIC8vIEV4dHJhY3QgZW50aXRpZXMgZnJvbSB0aGUgY2xlYW5lZCB1cCBzdHJpbmcuXG4gICAgZW50aXRpZXMgPSBleHRyYWN0RW50aXRpZXMoYmxvY2sudHh0KTtcbiAgICBpZiAoZW50aXRpZXMubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgcmFuZ2VzID0gW107XG4gICAgICBmb3IgKGxldCBpIGluIGVudGl0aWVzKSB7XG4gICAgICAgIC8vIHtvZmZzZXQ6IG1hdGNoWydpbmRleCddLCB1bmlxdWU6IG1hdGNoWzBdLCBsZW46IG1hdGNoWzBdLmxlbmd0aCwgZGF0YTogZW50LnBhY2tlcigpLCB0eXBlOiBlbnQubmFtZX1cbiAgICAgICAgY29uc3QgZW50aXR5ID0gZW50aXRpZXNbaV07XG4gICAgICAgIGxldCBpbmRleCA9IGVudGl0eUluZGV4W2VudGl0eS51bmlxdWVdO1xuICAgICAgICBpZiAoIWluZGV4KSB7XG4gICAgICAgICAgaW5kZXggPSBlbnRpdHlNYXAubGVuZ3RoO1xuICAgICAgICAgIGVudGl0eUluZGV4W2VudGl0eS51bmlxdWVdID0gaW5kZXg7XG4gICAgICAgICAgZW50aXR5TWFwLnB1c2goe1xuICAgICAgICAgICAgdHA6IGVudGl0eS50eXBlLFxuICAgICAgICAgICAgZGF0YTogZW50aXR5LmRhdGFcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByYW5nZXMucHVzaCh7XG4gICAgICAgICAgYXQ6IGVudGl0eS5vZmZzZXQsXG4gICAgICAgICAgbGVuOiBlbnRpdHkubGVuLFxuICAgICAgICAgIGtleTogaW5kZXhcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBibG9jay5lbnQgPSByYW5nZXM7XG4gICAgfVxuXG4gICAgYmx4LnB1c2goYmxvY2spO1xuICB9KTtcblxuICBjb25zdCByZXN1bHQgPSB7XG4gICAgdHh0OiAnJ1xuICB9O1xuXG4gIC8vIE1lcmdlIGxpbmVzIGFuZCBzYXZlIGxpbmUgYnJlYWtzIGFzIEJSIGlubGluZSBmb3JtYXR0aW5nLlxuICBpZiAoYmx4Lmxlbmd0aCA+IDApIHtcbiAgICByZXN1bHQudHh0ID0gYmx4WzBdLnR4dDtcbiAgICByZXN1bHQuZm10ID0gKGJseFswXS5mbXQgfHwgW10pLmNvbmNhdChibHhbMF0uZW50IHx8IFtdKTtcblxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgYmx4Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBibG9jayA9IGJseFtpXTtcbiAgICAgIGNvbnN0IG9mZnNldCA9IHJlc3VsdC50eHQubGVuZ3RoICsgMTtcblxuICAgICAgcmVzdWx0LmZtdC5wdXNoKHtcbiAgICAgICAgdHA6ICdCUicsXG4gICAgICAgIGxlbjogMSxcbiAgICAgICAgYXQ6IG9mZnNldCAtIDFcbiAgICAgIH0pO1xuXG4gICAgICByZXN1bHQudHh0ICs9ICcgJyArIGJsb2NrLnR4dDtcbiAgICAgIGlmIChibG9jay5mbXQpIHtcbiAgICAgICAgcmVzdWx0LmZtdCA9IHJlc3VsdC5mbXQuY29uY2F0KGJsb2NrLmZtdC5tYXAoKHMpID0+IHtcbiAgICAgICAgICBzLmF0ICs9IG9mZnNldDtcbiAgICAgICAgICByZXR1cm4gcztcbiAgICAgICAgfSkpO1xuICAgICAgfVxuICAgICAgaWYgKGJsb2NrLmVudCkge1xuICAgICAgICByZXN1bHQuZm10ID0gcmVzdWx0LmZtdC5jb25jYXQoYmxvY2suZW50Lm1hcCgocykgPT4ge1xuICAgICAgICAgIHMuYXQgKz0gb2Zmc2V0O1xuICAgICAgICAgIHJldHVybiBzO1xuICAgICAgICB9KSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHJlc3VsdC5mbXQubGVuZ3RoID09IDApIHtcbiAgICAgIGRlbGV0ZSByZXN1bHQuZm10O1xuICAgIH1cblxuICAgIGlmIChlbnRpdHlNYXAubGVuZ3RoID4gMCkge1xuICAgICAgcmVzdWx0LmVudCA9IGVudGl0eU1hcDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBBcHBlbmQgb25lIERyYWZ0eSBkb2N1bWVudCB0byBhbm90aGVyLlxuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBmaXJzdCAtIERyYWZ0eSBkb2N1bWVudCB0byBhcHBlbmQgdG8uXG4gKiBAcGFyYW0ge0RyYWZ0eXxzdHJpbmd9IHNlY29uZCAtIERyYWZ0eSBkb2N1bWVudCBvciBzdHJpbmcgYmVpbmcgYXBwZW5kZWQuXG4gKlxuICogQHJldHVybiB7RHJhZnR5fSBmaXJzdCBkb2N1bWVudCB3aXRoIHRoZSBzZWNvbmQgYXBwZW5kZWQgdG8gaXQuXG4gKi9cbkRyYWZ0eS5hcHBlbmQgPSBmdW5jdGlvbihmaXJzdCwgc2Vjb25kKSB7XG4gIGlmICghZmlyc3QpIHtcbiAgICByZXR1cm4gc2Vjb25kO1xuICB9XG4gIGlmICghc2Vjb25kKSB7XG4gICAgcmV0dXJuIGZpcnN0O1xuICB9XG5cbiAgZmlyc3QudHh0ID0gZmlyc3QudHh0IHx8ICcnO1xuICBjb25zdCBsZW4gPSBmaXJzdC50eHQubGVuZ3RoO1xuXG4gIGlmICh0eXBlb2Ygc2Vjb25kID09ICdzdHJpbmcnKSB7XG4gICAgZmlyc3QudHh0ICs9IHNlY29uZDtcbiAgfSBlbHNlIGlmIChzZWNvbmQudHh0KSB7XG4gICAgZmlyc3QudHh0ICs9IHNlY29uZC50eHQ7XG4gIH1cblxuICBpZiAoQXJyYXkuaXNBcnJheShzZWNvbmQuZm10KSkge1xuICAgIGZpcnN0LmZtdCA9IGZpcnN0LmZtdCB8fCBbXTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShzZWNvbmQuZW50KSkge1xuICAgICAgZmlyc3QuZW50ID0gZmlyc3QuZW50IHx8IFtdO1xuICAgIH1cbiAgICBzZWNvbmQuZm10LmZvckVhY2goc3JjID0+IHtcbiAgICAgIGNvbnN0IGZtdCA9IHtcbiAgICAgICAgYXQ6IChzcmMuYXQgfCAwKSArIGxlbixcbiAgICAgICAgbGVuOiBzcmMubGVuIHwgMFxuICAgICAgfTtcbiAgICAgIC8vIFNwZWNpYWwgY2FzZSBmb3IgdGhlIG91dHNpZGUgb2YgdGhlIG5vcm1hbCByZW5kZXJpbmcgZmxvdyBzdHlsZXMuXG4gICAgICBpZiAoc3JjLmF0ID09IC0xKSB7XG4gICAgICAgIGZtdC5hdCA9IC0xO1xuICAgICAgICBmbXQubGVuID0gMDtcbiAgICAgIH1cbiAgICAgIGlmIChzcmMudHApIHtcbiAgICAgICAgZm10LnRwID0gc3JjLnRwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm10LmtleSA9IGZpcnN0LmVudC5sZW5ndGg7XG4gICAgICAgIGZpcnN0LmVudC5wdXNoKHNlY29uZC5lbnRbc3JjLmtleSB8fCAwXSk7XG4gICAgICB9XG4gICAgICBmaXJzdC5mbXQucHVzaChmbXQpO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIGZpcnN0O1xufVxuXG4vKipcbiAqIEB0eXBlZGVmIERyYWZ0eS5JbWFnZURlc2NcbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEB0eXBlIE9iamVjdFxuICogQHBhcmFtIHtzdHJpbmd9IG1pbWUgLSBtaW1lLXR5cGUgb2YgdGhlIGltYWdlLCBlLmcuIFwiaW1hZ2UvcG5nXCIuXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVmdXJsIC0gcmVmZXJlbmNlIHRvIHRoZSBjb250ZW50LiBDb3VsZCBiZSBudWxsL3VuZGVmaW5lZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBiaXRzIC0gYmFzZTY0LWVuY29kZWQgaW1hZ2UgY29udGVudC4gQ291bGQgYmUgbnVsbC91bmRlZmluZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gcHJldmlldyAtIGJhc2U2NC1lbmNvZGVkIHRodW1ibmFpbCBvZiB0aGUgaW1hZ2UuXG4gKiBAcGFyYW0ge2ludGVnZXJ9IHdpZHRoIC0gd2lkdGggb2YgdGhlIGltYWdlLlxuICogQHBhcmFtIHtpbnRlZ2VyfSBoZWlnaHQgLSBoZWlnaHQgb2YgdGhlIGltYWdlLlxuICogQHBhcmFtIHtzdHJpbmd9IGZpbGVuYW1lIC0gZmlsZSBuYW1lIHN1Z2dlc3Rpb24gZm9yIGRvd25sb2FkaW5nIHRoZSBpbWFnZS5cbiAqIEBwYXJhbSB7aW50ZWdlcn0gc2l6ZSAtIHNpemUgb2YgdGhlIGltYWdlIGluIGJ5dGVzLiBUcmVhdCBpcyBhcyBhbiB1bnRydXN0ZWQgaGludC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBfdGVtcFByZXZpZXcgLSBiYXNlNjQtZW5jb2RlZCBpbWFnZSBwcmV2aWV3IHVzZWQgZHVyaW5nIHVwbG9hZCBwcm9jZXNzOyBub3Qgc2VyaWFsaXphYmxlLlxuICogQHBhcmFtIHtQcm9taXNlfSB1cmxQcm9taXNlIC0gUHJvbWlzZSB3aGljaCByZXR1cm5zIGNvbnRlbnQgVVJMIHdoZW4gcmVzb2x2ZWQuXG4gKi9cblxuLyoqXG4gKiBJbnNlcnQgaW5saW5lIGltYWdlIGludG8gRHJhZnR5IGRvY3VtZW50LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gZG9jdW1lbnQgdG8gYWRkIGltYWdlIHRvLlxuICogQHBhcmFtIHtpbnRlZ2VyfSBhdCAtIGluZGV4IHdoZXJlIHRoZSBvYmplY3QgaXMgaW5zZXJ0ZWQuIFRoZSBsZW5ndGggb2YgdGhlIGltYWdlIGlzIGFsd2F5cyAxLlxuICogQHBhcmFtIHtJbWFnZURlc2N9IGltYWdlRGVzYyAtIG9iamVjdCB3aXRoIGltYWdlIHBhcmFtZW5ldHMgYW5kIGRhdGEuXG4gKlxuICogQHJldHVybiB7RHJhZnR5fSB1cGRhdGVkIGRvY3VtZW50LlxuICovXG5EcmFmdHkuaW5zZXJ0SW1hZ2UgPSBmdW5jdGlvbihjb250ZW50LCBhdCwgaW1hZ2VEZXNjKSB7XG4gIGNvbnRlbnQgPSBjb250ZW50IHx8IHtcbiAgICB0eHQ6ICcgJ1xuICB9O1xuICBjb250ZW50LmVudCA9IGNvbnRlbnQuZW50IHx8IFtdO1xuICBjb250ZW50LmZtdCA9IGNvbnRlbnQuZm10IHx8IFtdO1xuXG4gIGNvbnRlbnQuZm10LnB1c2goe1xuICAgIGF0OiBhdCB8IDAsXG4gICAgbGVuOiAxLFxuICAgIGtleTogY29udGVudC5lbnQubGVuZ3RoXG4gIH0pO1xuXG4gIGNvbnN0IGV4ID0ge1xuICAgIHRwOiAnSU0nLFxuICAgIGRhdGE6IHtcbiAgICAgIG1pbWU6IGltYWdlRGVzYy5taW1lLFxuICAgICAgcmVmOiBpbWFnZURlc2MucmVmdXJsLFxuICAgICAgdmFsOiBpbWFnZURlc2MuYml0cyB8fCBpbWFnZURlc2MucHJldmlldyxcbiAgICAgIHdpZHRoOiBpbWFnZURlc2Mud2lkdGgsXG4gICAgICBoZWlnaHQ6IGltYWdlRGVzYy5oZWlnaHQsXG4gICAgICBuYW1lOiBpbWFnZURlc2MuZmlsZW5hbWUsXG4gICAgICBzaXplOiBpbWFnZURlc2Muc2l6ZSB8IDAsXG4gICAgfVxuICB9O1xuXG4gIGlmIChpbWFnZURlc2MudXJsUHJvbWlzZSkge1xuICAgIGV4LmRhdGEuX3RlbXBQcmV2aWV3ID0gaW1hZ2VEZXNjLl90ZW1wUHJldmlldztcbiAgICBleC5kYXRhLl9wcm9jZXNzaW5nID0gdHJ1ZTtcbiAgICBpbWFnZURlc2MudXJsUHJvbWlzZS50aGVuKFxuICAgICAgdXJsID0+IHtcbiAgICAgICAgZXguZGF0YS5yZWYgPSB1cmw7XG4gICAgICAgIGV4LmRhdGEuX3RlbXBQcmV2aWV3ID0gdW5kZWZpbmVkO1xuICAgICAgICBleC5kYXRhLl9wcm9jZXNzaW5nID0gdW5kZWZpbmVkO1xuICAgICAgfSxcbiAgICAgIF8gPT4ge1xuICAgICAgICAvLyBDYXRjaCB0aGUgZXJyb3IsIG90aGVyd2lzZSBpdCB3aWxsIGFwcGVhciBpbiB0aGUgY29uc29sZS5cbiAgICAgICAgZXguZGF0YS5fcHJvY2Vzc2luZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgY29udGVudC5lbnQucHVzaChleCk7XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbi8qKlxuICogQHR5cGVkZWYgRHJhZnR5LlZpZGVvRGVzY1xuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHR5cGUgT2JqZWN0XG4gKiBAcGFyYW0ge3N0cmluZ30gbWltZSAtIG1pbWUtdHlwZSBvZiB0aGUgdmlkZW8sIGUuZy4gXCJ2aWRlby9tcGVnXCIuXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVmdXJsIC0gcmVmZXJlbmNlIHRvIHRoZSBjb250ZW50LiBDb3VsZCBiZSBudWxsL3VuZGVmaW5lZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBiaXRzIC0gaW4tYmFuZCBiYXNlNjQtZW5jb2RlZCBpbWFnZSBkYXRhLiBDb3VsZCBiZSBudWxsL3VuZGVmaW5lZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBwcmV2aWV3IC0gYmFzZTY0LWVuY29kZWQgc2NyZWVuY2FwdHVyZSBmcm9tIHRoZSB2aWRlby4gQ291bGQgYmUgbnVsbC91bmRlZmluZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gcHJlcmVmIC0gcmVmZXJlbmNlIHRvIHNjcmVlbmNhcHR1cmUgZnJvbSB0aGUgdmlkZW8uIENvdWxkIGJlIG51bGwvdW5kZWZpbmVkLlxuICogQHBhcmFtIHtpbnRlZ2VyfSB3aWR0aCAtIHdpZHRoIG9mIHRoZSB2aWRlby5cbiAqIEBwYXJhbSB7aW50ZWdlcn0gaGVpZ2h0IC0gaGVpZ2h0IG9mIHRoZSB2aWRlby5cbiAqIEBwYXJhbSB7aW50ZWdlcn0gZHVyYXRpb24gLSBkdXJhdGlvbiBvZiB0aGUgdmlkZW8uXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZW5hbWUgLSBmaWxlIG5hbWUgc3VnZ2VzdGlvbiBmb3IgZG93bmxvYWRpbmcgdGhlIHZpZGVvLlxuICogQHBhcmFtIHtpbnRlZ2VyfSBzaXplIC0gc2l6ZSBvZiB0aGUgdmlkZW8gaW4gYnl0ZXMuIFRyZWF0IGlzIGFzIGFuIHVudHJ1c3RlZCBoaW50LlxuICogQHBhcmFtIHtzdHJpbmd9IF90ZW1wUHJldmlldyAtIGJhc2U2NC1lbmNvZGVkIHNjcmVlbmNhcHR1cmUgdXNlZCBkdXJpbmcgdXBsb2FkIHByb2Nlc3M7IG5vdCBzZXJpYWxpemFibGUuXG4gKiBAcGFyYW0ge1Byb21pc2V9IHVybFByb21pc2UgLSBhcnJheSBvZiB0d28gcHJvbWlzZXMsIHdoaWNoIHJldHVybiBVUkxzIG9mIHZpZGVvIGFuZCBwcmV2aWV3IHVwbG9hZHMgY29ycmVzcG9uZGluZ2x5XG4gKiAgICAgICAgKGVpdGhlciBjb3VsZCBiZSBudWxsKS5cbiAqL1xuXG4vKipcbiAqIEluc2VydCBpbmxpbmUgaW1hZ2UgaW50byBEcmFmdHkgZG9jdW1lbnQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBkb2N1bWVudCB0byBhZGQgdmlkZW8gdG8uXG4gKiBAcGFyYW0ge2ludGVnZXJ9IGF0IC0gaW5kZXggd2hlcmUgdGhlIG9iamVjdCBpcyBpbnNlcnRlZC4gVGhlIGxlbmd0aCBvZiB0aGUgdmlkZW8gaXMgYWx3YXlzIDEuXG4gKiBAcGFyYW0ge1ZpZGVvRGVzY30gdmlkZW9EZXNjIC0gb2JqZWN0IHdpdGggdmlkZW8gcGFyYW1lbmV0cyBhbmQgZGF0YS5cbiAqXG4gKiBAcmV0dXJuIHtEcmFmdHl9IHVwZGF0ZWQgZG9jdW1lbnQuXG4gKi9cbkRyYWZ0eS5pbnNlcnRWaWRlbyA9IGZ1bmN0aW9uKGNvbnRlbnQsIGF0LCB2aWRlb0Rlc2MpIHtcbiAgY29udGVudCA9IGNvbnRlbnQgfHwge1xuICAgIHR4dDogJyAnXG4gIH07XG4gIGNvbnRlbnQuZW50ID0gY29udGVudC5lbnQgfHwgW107XG4gIGNvbnRlbnQuZm10ID0gY29udGVudC5mbXQgfHwgW107XG5cbiAgY29udGVudC5mbXQucHVzaCh7XG4gICAgYXQ6IGF0IHwgMCxcbiAgICBsZW46IDEsXG4gICAga2V5OiBjb250ZW50LmVudC5sZW5ndGhcbiAgfSk7XG5cbiAgY29uc3QgZXggPSB7XG4gICAgdHA6ICdWRCcsXG4gICAgZGF0YToge1xuICAgICAgbWltZTogdmlkZW9EZXNjLm1pbWUsXG4gICAgICByZWY6IHZpZGVvRGVzYy5yZWZ1cmwsXG4gICAgICB2YWw6IHZpZGVvRGVzYy5iaXRzLFxuICAgICAgcHJlcmVmOiB2aWRlb0Rlc2MucHJlcmVmLFxuICAgICAgcHJldmlldzogdmlkZW9EZXNjLnByZXZpZXcsXG4gICAgICB3aWR0aDogdmlkZW9EZXNjLndpZHRoLFxuICAgICAgaGVpZ2h0OiB2aWRlb0Rlc2MuaGVpZ2h0LFxuICAgICAgZHVyYXRpb246IHZpZGVvRGVzYy5kdXJhdGlvbiB8IDAsXG4gICAgICBuYW1lOiB2aWRlb0Rlc2MuZmlsZW5hbWUsXG4gICAgICBzaXplOiB2aWRlb0Rlc2Muc2l6ZSB8IDAsXG4gICAgfVxuICB9O1xuXG4gIGlmICh2aWRlb0Rlc2MudXJsUHJvbWlzZSkge1xuICAgIGV4LmRhdGEuX3RlbXBQcmV2aWV3ID0gdmlkZW9EZXNjLl90ZW1wUHJldmlldztcbiAgICBleC5kYXRhLl9wcm9jZXNzaW5nID0gdHJ1ZTtcbiAgICB2aWRlb0Rlc2MudXJsUHJvbWlzZS50aGVuKFxuICAgICAgdXJscyA9PiB7XG4gICAgICAgIGV4LmRhdGEucmVmID0gdXJsc1swXTtcbiAgICAgICAgZXguZGF0YS5wcmVyZWYgPSB1cmxzWzFdO1xuICAgICAgICBleC5kYXRhLl90ZW1wUHJldmlldyA9IHVuZGVmaW5lZDtcbiAgICAgICAgZXguZGF0YS5fcHJvY2Vzc2luZyA9IHVuZGVmaW5lZDtcbiAgICAgIH0sXG4gICAgICBfID0+IHtcbiAgICAgICAgLy8gQ2F0Y2ggdGhlIGVycm9yLCBvdGhlcndpc2UgaXQgd2lsbCBhcHBlYXIgaW4gdGhlIGNvbnNvbGUuXG4gICAgICAgIGV4LmRhdGEuX3Byb2Nlc3NpbmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gIGNvbnRlbnQuZW50LnB1c2goZXgpO1xuXG4gIHJldHVybiBjb250ZW50O1xufVxuXG4vKipcbiAqIEB0eXBlZGVmIERyYWZ0eS5BdWRpb0Rlc2NcbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEB0eXBlIE9iamVjdFxuICogQHBhcmFtIHtzdHJpbmd9IG1pbWUgLSBtaW1lLXR5cGUgb2YgdGhlIGF1ZGlvLCBlLmcuIFwiYXVkaW8vb2dnXCIuXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVmdXJsIC0gcmVmZXJlbmNlIHRvIHRoZSBjb250ZW50LiBDb3VsZCBiZSBudWxsL3VuZGVmaW5lZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBiaXRzIC0gYmFzZTY0LWVuY29kZWQgYXVkaW8gY29udGVudC4gQ291bGQgYmUgbnVsbC91bmRlZmluZWQuXG4gKiBAcGFyYW0ge2ludGVnZXJ9IGR1cmF0aW9uIC0gZHVyYXRpb24gb2YgdGhlIHJlY29yZCBpbiBtaWxsaXNlY29uZHMuXG4gKiBAcGFyYW0ge3N0cmluZ30gcHJldmlldyAtIGJhc2U2NCBlbmNvZGVkIHNob3J0IGFycmF5IG9mIGFtcGxpdHVkZSB2YWx1ZXMgMC4uMTAwLlxuICogQHBhcmFtIHtzdHJpbmd9IGZpbGVuYW1lIC0gZmlsZSBuYW1lIHN1Z2dlc3Rpb24gZm9yIGRvd25sb2FkaW5nIHRoZSBhdWRpby5cbiAqIEBwYXJhbSB7aW50ZWdlcn0gc2l6ZSAtIHNpemUgb2YgdGhlIHJlY29yZGluZyBpbiBieXRlcy4gVHJlYXQgaXMgYXMgYW4gdW50cnVzdGVkIGhpbnQuXG4gKiBAcGFyYW0ge1Byb21pc2V9IHVybFByb21pc2UgLSBQcm9taXNlIHdoaWNoIHJldHVybnMgY29udGVudCBVUkwgd2hlbiByZXNvbHZlZC5cbiAqL1xuXG4vKipcbiAqIEluc2VydCBhdWRpbyByZWNvcmRpbmcgaW50byBEcmFmdHkgZG9jdW1lbnQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBkb2N1bWVudCB0byBhZGQgYXVkaW8gcmVjb3JkIHRvLlxuICogQHBhcmFtIHtpbnRlZ2VyfSBhdCAtIGluZGV4IHdoZXJlIHRoZSBvYmplY3QgaXMgaW5zZXJ0ZWQuIFRoZSBsZW5ndGggb2YgdGhlIHJlY29yZCBpcyBhbHdheXMgMS5cbiAqIEBwYXJhbSB7QXVkaW9EZXNjfSBhdWRpb0Rlc2MgLSBvYmplY3Qgd2l0aCB0aGUgYXVkaW8gcGFyYW1lbmV0cyBhbmQgZGF0YS5cbiAqXG4gKiBAcmV0dXJuIHtEcmFmdHl9IHVwZGF0ZWQgZG9jdW1lbnQuXG4gKi9cbkRyYWZ0eS5pbnNlcnRBdWRpbyA9IGZ1bmN0aW9uKGNvbnRlbnQsIGF0LCBhdWRpb0Rlc2MpIHtcbiAgY29udGVudCA9IGNvbnRlbnQgfHwge1xuICAgIHR4dDogJyAnXG4gIH07XG4gIGNvbnRlbnQuZW50ID0gY29udGVudC5lbnQgfHwgW107XG4gIGNvbnRlbnQuZm10ID0gY29udGVudC5mbXQgfHwgW107XG5cbiAgY29udGVudC5mbXQucHVzaCh7XG4gICAgYXQ6IGF0IHwgMCxcbiAgICBsZW46IDEsXG4gICAga2V5OiBjb250ZW50LmVudC5sZW5ndGhcbiAgfSk7XG5cbiAgY29uc3QgZXggPSB7XG4gICAgdHA6ICdBVScsXG4gICAgZGF0YToge1xuICAgICAgbWltZTogYXVkaW9EZXNjLm1pbWUsXG4gICAgICB2YWw6IGF1ZGlvRGVzYy5iaXRzLFxuICAgICAgZHVyYXRpb246IGF1ZGlvRGVzYy5kdXJhdGlvbiB8IDAsXG4gICAgICBwcmV2aWV3OiBhdWRpb0Rlc2MucHJldmlldyxcbiAgICAgIG5hbWU6IGF1ZGlvRGVzYy5maWxlbmFtZSxcbiAgICAgIHNpemU6IGF1ZGlvRGVzYy5zaXplIHwgMCxcbiAgICAgIHJlZjogYXVkaW9EZXNjLnJlZnVybFxuICAgIH1cbiAgfTtcblxuICBpZiAoYXVkaW9EZXNjLnVybFByb21pc2UpIHtcbiAgICBleC5kYXRhLl9wcm9jZXNzaW5nID0gdHJ1ZTtcbiAgICBhdWRpb0Rlc2MudXJsUHJvbWlzZS50aGVuKFxuICAgICAgdXJsID0+IHtcbiAgICAgICAgZXguZGF0YS5yZWYgPSB1cmw7XG4gICAgICAgIGV4LmRhdGEuX3Byb2Nlc3NpbmcgPSB1bmRlZmluZWQ7XG4gICAgICB9LFxuICAgICAgXyA9PiB7XG4gICAgICAgIC8vIENhdGNoIHRoZSBlcnJvciwgb3RoZXJ3aXNlIGl0IHdpbGwgYXBwZWFyIGluIHRoZSBjb25zb2xlLlxuICAgICAgICBleC5kYXRhLl9wcm9jZXNzaW5nID0gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgICk7XG4gIH1cblxuICBjb250ZW50LmVudC5wdXNoKGV4KTtcblxuICByZXR1cm4gY29udGVudDtcbn1cblxuLyoqXG4gKiBDcmVhdGUgYSAoc2VsZi1jb250YWluZWQpIHZpZGVvIGNhbGwgRHJhZnR5IGRvY3VtZW50LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICogQHBhcmFtIHtib29sZWFufSBhdWRpb09ubHkgPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdGhlIGNhbGwgaXMgaW5pdGlhbGx5IGF1ZGlvLW9ubHkuXG4gKiBAcmV0dXJucyBWaWRlbyBDYWxsIGRyYWZ0eSBkb2N1bWVudC5cbiAqL1xuRHJhZnR5LnZpZGVvQ2FsbCA9IGZ1bmN0aW9uKGF1ZGlvT25seSkge1xuICBjb25zdCBjb250ZW50ID0ge1xuICAgIHR4dDogJyAnLFxuICAgIGZtdDogW3tcbiAgICAgIGF0OiAwLFxuICAgICAgbGVuOiAxLFxuICAgICAga2V5OiAwXG4gICAgfV0sXG4gICAgZW50OiBbe1xuICAgICAgdHA6ICdWQycsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGFvbmx5OiBhdWRpb09ubHlcbiAgICAgIH0sXG4gICAgfV1cbiAgfTtcbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbi8qKlxuICogVXBkYXRlIHZpZGVvIGNhbGwgKFZDKSBlbnRpdHkgd2l0aCB0aGUgbmV3IHN0YXR1cyBhbmQgZHVyYXRpb24uXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBWQyBkb2N1bWVudCB0byB1cGRhdGUuXG4gKiBAcGFyYW0ge29iamVjdH0gcGFyYW1zIC0gbmV3IHZpZGVvIGNhbGwgcGFyYW1ldGVycy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXJhbXMuc3RhdGUgLSBzdGF0ZSBvZiB2aWRlbyBjYWxsLlxuICogQHBhcmFtIHtudW1iZXJ9IHBhcmFtcy5kdXJhdGlvbiAtIGR1cmF0aW9uIG9mIHRoZSB2aWRlbyBjYWxsIGluIG1pbGxpc2Vjb25kcy5cbiAqXG4gKiBAcmV0dXJucyB0aGUgc2FtZSBkb2N1bWVudCB3aXRoIHVwZGF0ZSBhcHBsaWVkLlxuICovXG5EcmFmdHkudXBkYXRlVmlkZW9DYWxsID0gZnVuY3Rpb24oY29udGVudCwgcGFyYW1zKSB7XG4gIC8vIFRoZSB2aWRlbyBlbGVtZW50IGNvdWxkIGJlIGp1c3QgYSBmb3JtYXQgb3IgYSBmb3JtYXQgKyBlbnRpdHkuXG4gIC8vIE11c3QgZW5zdXJlIGl0J3MgdGhlIGxhdHRlciBmaXJzdC5cbiAgY29uc3QgZm10ID0gKChjb250ZW50IHx8IHt9KS5mbXQgfHwgW10pWzBdO1xuICBpZiAoIWZtdCkge1xuICAgIC8vIFVucmVjb2duaXplZCBjb250ZW50LlxuICAgIHJldHVybiBjb250ZW50O1xuICB9XG5cbiAgbGV0IGVudDtcbiAgaWYgKGZtdC50cCA9PSAnVkMnKSB7XG4gICAgLy8gSnVzdCBhIGZvcm1hdCwgY29udmVydCB0byBmb3JtYXQgKyBlbnRpdHkuXG4gICAgZGVsZXRlIGZtdC50cDtcbiAgICBmbXQua2V5ID0gMDtcbiAgICBlbnQgPSB7XG4gICAgICB0cDogJ1ZDJ1xuICAgIH07XG4gICAgY29udGVudC5lbnQgPSBbZW50XTtcbiAgfSBlbHNlIHtcbiAgICBlbnQgPSAoY29udGVudC5lbnQgfHwgW10pW2ZtdC5rZXkgfCAwXTtcbiAgICBpZiAoIWVudCB8fCBlbnQudHAgIT0gJ1ZDJykge1xuICAgICAgLy8gTm90IGEgVkMgZW50aXR5LlxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfVxuICB9XG4gIGVudC5kYXRhID0gZW50LmRhdGEgfHwge307XG4gIE9iamVjdC5hc3NpZ24oZW50LmRhdGEsIHBhcmFtcyk7XG4gIHJldHVybiBjb250ZW50O1xufVxuXG4vKipcbiAqIENyZWF0ZSBhIHF1b3RlIHRvIERyYWZ0eSBkb2N1bWVudC5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gaGVhZGVyIC0gUXVvdGUgaGVhZGVyICh0aXRsZSwgZXRjLikuXG4gKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gVUlEIG9mIHRoZSBhdXRob3IgdG8gbWVudGlvbi5cbiAqIEBwYXJhbSB7RHJhZnR5fSBib2R5IC0gQm9keSBvZiB0aGUgcXVvdGVkIG1lc3NhZ2UuXG4gKlxuICogQHJldHVybnMgUmVwbHkgcXVvdGUgRHJhZnR5IGRvYyB3aXRoIHRoZSBxdW90ZSBmb3JtYXR0aW5nLlxuICovXG5EcmFmdHkucXVvdGUgPSBmdW5jdGlvbihoZWFkZXIsIHVpZCwgYm9keSkge1xuICBjb25zdCBxdW90ZSA9IERyYWZ0eS5hcHBlbmQoRHJhZnR5LmFwcGVuZExpbmVCcmVhayhEcmFmdHkubWVudGlvbihoZWFkZXIsIHVpZCkpLCBib2R5KTtcblxuICAvLyBXcmFwIGludG8gYSBxdW90ZS5cbiAgcXVvdGUuZm10LnB1c2goe1xuICAgIGF0OiAwLFxuICAgIGxlbjogcXVvdGUudHh0Lmxlbmd0aCxcbiAgICB0cDogJ1FRJ1xuICB9KTtcblxuICByZXR1cm4gcXVvdGU7XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgRHJhZnR5IGRvY3VtZW50IHdpdGggYSBtZW50aW9uLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gbWVudGlvbmVkIG5hbWUuXG4gKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gbWVudGlvbmVkIHVzZXIgSUQuXG4gKlxuICogQHJldHVybnMge0RyYWZ0eX0gZG9jdW1lbnQgd2l0aCB0aGUgbWVudGlvbi5cbiAqL1xuRHJhZnR5Lm1lbnRpb24gPSBmdW5jdGlvbihuYW1lLCB1aWQpIHtcbiAgcmV0dXJuIHtcbiAgICB0eHQ6IG5hbWUgfHwgJycsXG4gICAgZm10OiBbe1xuICAgICAgYXQ6IDAsXG4gICAgICBsZW46IChuYW1lIHx8ICcnKS5sZW5ndGgsXG4gICAgICBrZXk6IDBcbiAgICB9XSxcbiAgICBlbnQ6IFt7XG4gICAgICB0cDogJ01OJyxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgdmFsOiB1aWRcbiAgICAgIH1cbiAgICB9XVxuICB9O1xufVxuXG4vKipcbiAqIEFwcGVuZCBhIGxpbmsgdG8gYSBEcmFmdHkgZG9jdW1lbnQuXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBEcmFmdHkgZG9jdW1lbnQgdG8gYXBwZW5kIGxpbmsgdG8uXG4gKiBAcGFyYW0ge09iamVjdH0gbGlua0RhdGEgLSBMaW5rIGluZm8gaW4gZm9ybWF0IDxjb2RlPnt0eHQ6ICdhbmtvciB0ZXh0JywgdXJsOiAnaHR0cDovLy4uLid9PC9jb2RlPi5cbiAqXG4gKiBAcmV0dXJucyB7RHJhZnR5fSB0aGUgc2FtZSBkb2N1bWVudCBhcyA8Y29kZT5jb250ZW50PC9jb2RlPi5cbiAqL1xuRHJhZnR5LmFwcGVuZExpbmsgPSBmdW5jdGlvbihjb250ZW50LCBsaW5rRGF0YSkge1xuICBjb250ZW50ID0gY29udGVudCB8fCB7XG4gICAgdHh0OiAnJ1xuICB9O1xuXG4gIGNvbnRlbnQuZW50ID0gY29udGVudC5lbnQgfHwgW107XG4gIGNvbnRlbnQuZm10ID0gY29udGVudC5mbXQgfHwgW107XG5cbiAgY29udGVudC5mbXQucHVzaCh7XG4gICAgYXQ6IGNvbnRlbnQudHh0Lmxlbmd0aCxcbiAgICBsZW46IGxpbmtEYXRhLnR4dC5sZW5ndGgsXG4gICAga2V5OiBjb250ZW50LmVudC5sZW5ndGhcbiAgfSk7XG4gIGNvbnRlbnQudHh0ICs9IGxpbmtEYXRhLnR4dDtcblxuICBjb25zdCBleCA9IHtcbiAgICB0cDogJ0xOJyxcbiAgICBkYXRhOiB7XG4gICAgICB1cmw6IGxpbmtEYXRhLnVybFxuICAgIH1cbiAgfVxuICBjb250ZW50LmVudC5wdXNoKGV4KTtcblxuICByZXR1cm4gY29udGVudDtcbn1cblxuLyoqXG4gKiBBcHBlbmQgaW1hZ2UgdG8gRHJhZnR5IGRvY3VtZW50LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gZG9jdW1lbnQgdG8gYWRkIGltYWdlIHRvLlxuICogQHBhcmFtIHtJbWFnZURlc2N9IGltYWdlRGVzYyAtIG9iamVjdCB3aXRoIGltYWdlIHBhcmFtZW5ldHMuXG4gKlxuICogQHJldHVybiB7RHJhZnR5fSB1cGRhdGVkIGRvY3VtZW50LlxuICovXG5EcmFmdHkuYXBwZW5kSW1hZ2UgPSBmdW5jdGlvbihjb250ZW50LCBpbWFnZURlc2MpIHtcbiAgY29udGVudCA9IGNvbnRlbnQgfHwge1xuICAgIHR4dDogJydcbiAgfTtcbiAgY29udGVudC50eHQgKz0gJyAnO1xuICByZXR1cm4gRHJhZnR5Lmluc2VydEltYWdlKGNvbnRlbnQsIGNvbnRlbnQudHh0Lmxlbmd0aCAtIDEsIGltYWdlRGVzYyk7XG59XG5cbi8qKlxuICogQXBwZW5kIGF1ZGlvIHJlY29kcmluZyB0byBEcmFmdHkgZG9jdW1lbnQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBkb2N1bWVudCB0byBhZGQgcmVjb3JkaW5nIHRvLlxuICogQHBhcmFtIHtBdWRpb0Rlc2N9IGF1ZGlvRGVzYyAtIG9iamVjdCB3aXRoIGF1ZGlvIGRhdGEuXG4gKlxuICogQHJldHVybiB7RHJhZnR5fSB1cGRhdGVkIGRvY3VtZW50LlxuICovXG5EcmFmdHkuYXBwZW5kQXVkaW8gPSBmdW5jdGlvbihjb250ZW50LCBhdWRpb0Rlc2MpIHtcbiAgY29udGVudCA9IGNvbnRlbnQgfHwge1xuICAgIHR4dDogJydcbiAgfTtcbiAgY29udGVudC50eHQgKz0gJyAnO1xuICByZXR1cm4gRHJhZnR5Lmluc2VydEF1ZGlvKGNvbnRlbnQsIGNvbnRlbnQudHh0Lmxlbmd0aCAtIDEsIGF1ZGlvRGVzYyk7XG59XG5cbi8qKlxuICogQHR5cGVkZWYgRHJhZnR5LkF0dGFjaG1lbnREZXNjXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAdHlwZSBPYmplY3RcbiAqIEBwYXJhbSB7c3RyaW5nfSBtaW1lIC0gbWltZS10eXBlIG9mIHRoZSBhdHRhY2htZW50LCBlLmcuIFwiYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtXCJcbiAqIEBwYXJhbSB7c3RyaW5nfSBkYXRhIC0gYmFzZTY0LWVuY29kZWQgaW4tYmFuZCBjb250ZW50IG9mIHNtYWxsIGF0dGFjaG1lbnRzLiBDb3VsZCBiZSBudWxsL3VuZGVmaW5lZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlbmFtZSAtIGZpbGUgbmFtZSBzdWdnZXN0aW9uIGZvciBkb3dubG9hZGluZyB0aGUgYXR0YWNobWVudC5cbiAqIEBwYXJhbSB7aW50ZWdlcn0gc2l6ZSAtIHNpemUgb2YgdGhlIGZpbGUgaW4gYnl0ZXMuIFRyZWF0IGlzIGFzIGFuIHVudHJ1c3RlZCBoaW50LlxuICogQHBhcmFtIHtzdHJpbmd9IHJlZnVybCAtIHJlZmVyZW5jZSB0byB0aGUgb3V0LW9mLWJhbmQgY29udGVudC4gQ291bGQgYmUgbnVsbC91bmRlZmluZWQuXG4gKiBAcGFyYW0ge1Byb21pc2V9IHVybFByb21pc2UgLSBQcm9taXNlIHdoaWNoIHJldHVybnMgY29udGVudCBVUkwgd2hlbiByZXNvbHZlZC5cbiAqL1xuXG4vKipcbiAqIEF0dGFjaCBmaWxlIHRvIERyYWZ0eSBjb250ZW50LiBFaXRoZXIgYXMgYSBibG9iIG9yIGFzIGEgcmVmZXJlbmNlLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gZG9jdW1lbnQgdG8gYXR0YWNoIGZpbGUgdG8uXG4gKiBAcGFyYW0ge0F0dGFjaG1lbnREZXNjfSBvYmplY3QgLSBjb250YWluaW5nIGF0dGFjaG1lbnQgZGVzY3JpcHRpb24gYW5kIGRhdGEuXG4gKlxuICogQHJldHVybiB7RHJhZnR5fSB1cGRhdGVkIGRvY3VtZW50LlxuICovXG5EcmFmdHkuYXR0YWNoRmlsZSA9IGZ1bmN0aW9uKGNvbnRlbnQsIGF0dGFjaG1lbnREZXNjKSB7XG4gIGNvbnRlbnQgPSBjb250ZW50IHx8IHtcbiAgICB0eHQ6ICcnXG4gIH07XG5cbiAgY29udGVudC5lbnQgPSBjb250ZW50LmVudCB8fCBbXTtcbiAgY29udGVudC5mbXQgPSBjb250ZW50LmZtdCB8fCBbXTtcblxuICBjb250ZW50LmZtdC5wdXNoKHtcbiAgICBhdDogLTEsXG4gICAgbGVuOiAwLFxuICAgIGtleTogY29udGVudC5lbnQubGVuZ3RoXG4gIH0pO1xuXG4gIGNvbnN0IGV4ID0ge1xuICAgIHRwOiAnRVgnLFxuICAgIGRhdGE6IHtcbiAgICAgIG1pbWU6IGF0dGFjaG1lbnREZXNjLm1pbWUsXG4gICAgICB2YWw6IGF0dGFjaG1lbnREZXNjLmRhdGEsXG4gICAgICBuYW1lOiBhdHRhY2htZW50RGVzYy5maWxlbmFtZSxcbiAgICAgIHJlZjogYXR0YWNobWVudERlc2MucmVmdXJsLFxuICAgICAgc2l6ZTogYXR0YWNobWVudERlc2Muc2l6ZSB8IDBcbiAgICB9XG4gIH1cbiAgaWYgKGF0dGFjaG1lbnREZXNjLnVybFByb21pc2UpIHtcbiAgICBleC5kYXRhLl9wcm9jZXNzaW5nID0gdHJ1ZTtcbiAgICBhdHRhY2htZW50RGVzYy51cmxQcm9taXNlLnRoZW4oXG4gICAgICB1cmwgPT4ge1xuICAgICAgICBleC5kYXRhLnJlZiA9IHVybDtcbiAgICAgICAgZXguZGF0YS5fcHJvY2Vzc2luZyA9IHVuZGVmaW5lZDtcbiAgICAgIH0sXG4gICAgICBfID0+IHtcbiAgICAgICAgLyogY2F0Y2ggdGhlIGVycm9yLCBvdGhlcndpc2UgaXQgd2lsbCBhcHBlYXIgaW4gdGhlIGNvbnNvbGUuICovXG4gICAgICAgIGV4LmRhdGEuX3Byb2Nlc3NpbmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgKTtcbiAgfVxuICBjb250ZW50LmVudC5wdXNoKGV4KTtcblxuICByZXR1cm4gY29udGVudDtcbn1cblxuLyoqXG4gKiBXcmFwcyBkcmFmdHkgZG9jdW1lbnQgaW50byBhIHNpbXBsZSBmb3JtYXR0aW5nIHN0eWxlLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fHN0cmluZ30gY29udGVudCAtIGRvY3VtZW50IG9yIHN0cmluZyB0byB3cmFwIGludG8gYSBzdHlsZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHlsZSAtIHR3by1sZXR0ZXIgc3R5bGUgdG8gd3JhcCBpbnRvLlxuICogQHBhcmFtIHtudW1iZXJ9IGF0IC0gaW5kZXggd2hlcmUgdGhlIHN0eWxlIHN0YXJ0cywgZGVmYXVsdCAwLlxuICogQHBhcmFtIHtudW1iZXJ9IGxlbiAtIGxlbmd0aCBvZiB0aGUgZm9ybSBjb250ZW50LCBkZWZhdWx0IGFsbCBvZiBpdC5cbiAqXG4gKiBAcmV0dXJuIHtEcmFmdHl9IHVwZGF0ZWQgZG9jdW1lbnQuXG4gKi9cbkRyYWZ0eS53cmFwSW50byA9IGZ1bmN0aW9uKGNvbnRlbnQsIHN0eWxlLCBhdCwgbGVuKSB7XG4gIGlmICh0eXBlb2YgY29udGVudCA9PSAnc3RyaW5nJykge1xuICAgIGNvbnRlbnQgPSB7XG4gICAgICB0eHQ6IGNvbnRlbnRcbiAgICB9O1xuICB9XG4gIGNvbnRlbnQuZm10ID0gY29udGVudC5mbXQgfHwgW107XG5cbiAgY29udGVudC5mbXQucHVzaCh7XG4gICAgYXQ6IGF0IHx8IDAsXG4gICAgbGVuOiBsZW4gfHwgY29udGVudC50eHQubGVuZ3RoLFxuICAgIHRwOiBzdHlsZSxcbiAgfSk7XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbi8qKlxuICogV3JhcHMgY29udGVudCBpbnRvIGFuIGludGVyYWN0aXZlIGZvcm0uXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl8c3RyaW5nfSBjb250ZW50IC0gdG8gd3JhcCBpbnRvIGEgZm9ybS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBhdCAtIGluZGV4IHdoZXJlIHRoZSBmb3JtcyBzdGFydHMuXG4gKiBAcGFyYW0ge251bWJlcn0gbGVuIC0gbGVuZ3RoIG9mIHRoZSBmb3JtIGNvbnRlbnQuXG4gKlxuICogQHJldHVybiB7RHJhZnR5fSB1cGRhdGVkIGRvY3VtZW50LlxuICovXG5EcmFmdHkud3JhcEFzRm9ybSA9IGZ1bmN0aW9uKGNvbnRlbnQsIGF0LCBsZW4pIHtcbiAgcmV0dXJuIERyYWZ0eS53cmFwSW50byhjb250ZW50LCAnRk0nLCBhdCwgbGVuKTtcbn1cblxuLyoqXG4gKiBJbnNlcnQgY2xpY2thYmxlIGJ1dHRvbiBpbnRvIERyYWZ0eSBkb2N1bWVudC5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eXxzdHJpbmd9IGNvbnRlbnQgLSBEcmFmdHkgZG9jdW1lbnQgdG8gaW5zZXJ0IGJ1dHRvbiB0byBvciBhIHN0cmluZyB0byBiZSB1c2VkIGFzIGJ1dHRvbiB0ZXh0LlxuICogQHBhcmFtIHtudW1iZXJ9IGF0IC0gbG9jYXRpb24gd2hlcmUgdGhlIGJ1dHRvbiBpcyBpbnNlcnRlZC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBsZW4gLSB0aGUgbGVuZ3RoIG9mIHRoZSB0ZXh0IHRvIGJlIHVzZWQgYXMgYnV0dG9uIHRpdGxlLlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSB0aGUgYnV0dG9uLiBDbGllbnQgc2hvdWxkIHJldHVybiBpdCB0byB0aGUgc2VydmVyIHdoZW4gdGhlIGJ1dHRvbiBpcyBjbGlja2VkLlxuICogQHBhcmFtIHtzdHJpbmd9IGFjdGlvblR5cGUgLSB0aGUgdHlwZSBvZiB0aGUgYnV0dG9uLCBvbmUgb2YgJ3VybCcgb3IgJ3B1YicuXG4gKiBAcGFyYW0ge3N0cmluZ30gYWN0aW9uVmFsdWUgLSB0aGUgdmFsdWUgdG8gcmV0dXJuIG9uIGNsaWNrOlxuICogQHBhcmFtIHtzdHJpbmd9IHJlZlVybCAtIHRoZSBVUkwgdG8gZ28gdG8gd2hlbiB0aGUgJ3VybCcgYnV0dG9uIGlzIGNsaWNrZWQuXG4gKlxuICogQHJldHVybiB7RHJhZnR5fSB1cGRhdGVkIGRvY3VtZW50LlxuICovXG5EcmFmdHkuaW5zZXJ0QnV0dG9uID0gZnVuY3Rpb24oY29udGVudCwgYXQsIGxlbiwgbmFtZSwgYWN0aW9uVHlwZSwgYWN0aW9uVmFsdWUsIHJlZlVybCkge1xuICBpZiAodHlwZW9mIGNvbnRlbnQgPT0gJ3N0cmluZycpIHtcbiAgICBjb250ZW50ID0ge1xuICAgICAgdHh0OiBjb250ZW50XG4gICAgfTtcbiAgfVxuXG4gIGlmICghY29udGVudCB8fCAhY29udGVudC50eHQgfHwgY29udGVudC50eHQubGVuZ3RoIDwgYXQgKyBsZW4pIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmIChsZW4gPD0gMCB8fCBbJ3VybCcsICdwdWInXS5pbmRleE9mKGFjdGlvblR5cGUpID09IC0xKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgLy8gRW5zdXJlIHJlZlVybCBpcyBhIHN0cmluZy5cbiAgaWYgKGFjdGlvblR5cGUgPT0gJ3VybCcgJiYgIXJlZlVybCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJlZlVybCA9ICcnICsgcmVmVXJsO1xuXG4gIGNvbnRlbnQuZW50ID0gY29udGVudC5lbnQgfHwgW107XG4gIGNvbnRlbnQuZm10ID0gY29udGVudC5mbXQgfHwgW107XG5cbiAgY29udGVudC5mbXQucHVzaCh7XG4gICAgYXQ6IGF0IHwgMCxcbiAgICBsZW46IGxlbixcbiAgICBrZXk6IGNvbnRlbnQuZW50Lmxlbmd0aFxuICB9KTtcbiAgY29udGVudC5lbnQucHVzaCh7XG4gICAgdHA6ICdCTicsXG4gICAgZGF0YToge1xuICAgICAgYWN0OiBhY3Rpb25UeXBlLFxuICAgICAgdmFsOiBhY3Rpb25WYWx1ZSxcbiAgICAgIHJlZjogcmVmVXJsLFxuICAgICAgbmFtZTogbmFtZVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbi8qKlxuICogQXBwZW5kIGNsaWNrYWJsZSBidXR0b24gdG8gRHJhZnR5IGRvY3VtZW50LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fHN0cmluZ30gY29udGVudCAtIERyYWZ0eSBkb2N1bWVudCB0byBpbnNlcnQgYnV0dG9uIHRvIG9yIGEgc3RyaW5nIHRvIGJlIHVzZWQgYXMgYnV0dG9uIHRleHQuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGl0bGUgLSB0aGUgdGV4dCB0byBiZSB1c2VkIGFzIGJ1dHRvbiB0aXRsZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gdGhlIGJ1dHRvbi4gQ2xpZW50IHNob3VsZCByZXR1cm4gaXQgdG8gdGhlIHNlcnZlciB3aGVuIHRoZSBidXR0b24gaXMgY2xpY2tlZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBhY3Rpb25UeXBlIC0gdGhlIHR5cGUgb2YgdGhlIGJ1dHRvbiwgb25lIG9mICd1cmwnIG9yICdwdWInLlxuICogQHBhcmFtIHtzdHJpbmd9IGFjdGlvblZhbHVlIC0gdGhlIHZhbHVlIHRvIHJldHVybiBvbiBjbGljazpcbiAqIEBwYXJhbSB7c3RyaW5nfSByZWZVcmwgLSB0aGUgVVJMIHRvIGdvIHRvIHdoZW4gdGhlICd1cmwnIGJ1dHRvbiBpcyBjbGlja2VkLlxuICpcbiAqIEByZXR1cm4ge0RyYWZ0eX0gdXBkYXRlZCBkb2N1bWVudC5cbiAqL1xuRHJhZnR5LmFwcGVuZEJ1dHRvbiA9IGZ1bmN0aW9uKGNvbnRlbnQsIHRpdGxlLCBuYW1lLCBhY3Rpb25UeXBlLCBhY3Rpb25WYWx1ZSwgcmVmVXJsKSB7XG4gIGNvbnRlbnQgPSBjb250ZW50IHx8IHtcbiAgICB0eHQ6ICcnXG4gIH07XG4gIGNvbnN0IGF0ID0gY29udGVudC50eHQubGVuZ3RoO1xuICBjb250ZW50LnR4dCArPSB0aXRsZTtcbiAgcmV0dXJuIERyYWZ0eS5pbnNlcnRCdXR0b24oY29udGVudCwgYXQsIHRpdGxlLmxlbmd0aCwgbmFtZSwgYWN0aW9uVHlwZSwgYWN0aW9uVmFsdWUsIHJlZlVybCk7XG59XG5cbi8qKlxuICogQXR0YWNoIGEgZ2VuZXJpYyBKUyBvYmplY3QuIFRoZSBvYmplY3QgaXMgYXR0YWNoZWQgYXMgYSBqc29uIHN0cmluZy5cbiAqIEludGVuZGVkIGZvciByZXByZXNlbnRpbmcgYSBmb3JtIHJlc3BvbnNlLlxuICpcbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIERyYWZ0eSBkb2N1bWVudCB0byBhdHRhY2ggZmlsZSB0by5cbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIC0gZGF0YSB0byBjb252ZXJ0IHRvIGpzb24gc3RyaW5nIGFuZCBhdHRhY2guXG4gKiBAcmV0dXJucyB7RHJhZnR5fSB0aGUgc2FtZSBkb2N1bWVudCBhcyA8Y29kZT5jb250ZW50PC9jb2RlPi5cbiAqL1xuRHJhZnR5LmF0dGFjaEpTT04gPSBmdW5jdGlvbihjb250ZW50LCBkYXRhKSB7XG4gIGNvbnRlbnQgPSBjb250ZW50IHx8IHtcbiAgICB0eHQ6ICcnXG4gIH07XG4gIGNvbnRlbnQuZW50ID0gY29udGVudC5lbnQgfHwgW107XG4gIGNvbnRlbnQuZm10ID0gY29udGVudC5mbXQgfHwgW107XG5cbiAgY29udGVudC5mbXQucHVzaCh7XG4gICAgYXQ6IC0xLFxuICAgIGxlbjogMCxcbiAgICBrZXk6IGNvbnRlbnQuZW50Lmxlbmd0aFxuICB9KTtcblxuICBjb250ZW50LmVudC5wdXNoKHtcbiAgICB0cDogJ0VYJyxcbiAgICBkYXRhOiB7XG4gICAgICBtaW1lOiBKU09OX01JTUVfVFlQRSxcbiAgICAgIHZhbDogZGF0YVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG4vKipcbiAqIEFwcGVuZCBsaW5lIGJyZWFrIHRvIGEgRHJhZnR5IGRvY3VtZW50LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gRHJhZnR5IGRvY3VtZW50IHRvIGFwcGVuZCBsaW5lYnJlYWsgdG8uXG4gKiBAcmV0dXJucyB7RHJhZnR5fSB0aGUgc2FtZSBkb2N1bWVudCBhcyA8Y29kZT5jb250ZW50PC9jb2RlPi5cbiAqL1xuRHJhZnR5LmFwcGVuZExpbmVCcmVhayA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcbiAgY29udGVudCA9IGNvbnRlbnQgfHwge1xuICAgIHR4dDogJydcbiAgfTtcbiAgY29udGVudC5mbXQgPSBjb250ZW50LmZtdCB8fCBbXTtcbiAgY29udGVudC5mbXQucHVzaCh7XG4gICAgYXQ6IGNvbnRlbnQudHh0Lmxlbmd0aCxcbiAgICBsZW46IDEsXG4gICAgdHA6ICdCUidcbiAgfSk7XG4gIGNvbnRlbnQudHh0ICs9ICcgJztcblxuICByZXR1cm4gY29udGVudDtcbn1cbi8qKlxuICogR2l2ZW4gRHJhZnR5IGRvY3VtZW50LCBjb252ZXJ0IGl0IHRvIEhUTUwuXG4gKiBObyBhdHRlbXB0IGlzIG1hZGUgdG8gc3RyaXAgcHJlLWV4aXN0aW5nIGh0bWwgbWFya3VwLlxuICogVGhpcyBpcyBwb3RlbnRpYWxseSB1bnNhZmUgYmVjYXVzZSA8Y29kZT5jb250ZW50LnR4dDwvY29kZT4gbWF5IGNvbnRhaW4gbWFsaWNpb3VzIEhUTUxcbiAqIG1hcmt1cC5cbiAqIEBtZW1iZXJvZiBUaW5vZGUuRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGRvYyAtIGRvY3VtZW50IHRvIGNvbnZlcnQuXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gSFRNTC1yZXByZXNlbnRhdGlvbiBvZiBjb250ZW50LlxuICovXG5EcmFmdHkuVU5TQUZFX3RvSFRNTCA9IGZ1bmN0aW9uKGRvYykge1xuICBjb25zdCB0cmVlID0gZHJhZnR5VG9UcmVlKGRvYyk7XG4gIGNvbnN0IGh0bWxGb3JtYXR0ZXIgPSBmdW5jdGlvbih0eXBlLCBkYXRhLCB2YWx1ZXMpIHtcbiAgICBjb25zdCB0YWcgPSBERUNPUkFUT1JTW3R5cGVdO1xuICAgIGxldCByZXN1bHQgPSB2YWx1ZXMgPyB2YWx1ZXMuam9pbignJykgOiAnJztcbiAgICBpZiAodGFnKSB7XG4gICAgICByZXN1bHQgPSB0YWcub3BlbihkYXRhKSArIHJlc3VsdCArIHRhZy5jbG9zZShkYXRhKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbiAgcmV0dXJuIHRyZWVCb3R0b21VcCh0cmVlLCBodG1sRm9ybWF0dGVyLCAwKTtcbn1cblxuLyoqXG4gKiBDYWxsYmFjayBmb3IgYXBwbHlpbmcgY3VzdG9tIGZvcm1hdHRpbmcgdG8gYSBEcmFmdHkgZG9jdW1lbnQuXG4gKiBDYWxsZWQgb25jZSBmb3IgZWFjaCBzdHlsZSBzcGFuLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBjYWxsYmFjayBGb3JtYXR0ZXJcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHlsZSAtIHN0eWxlIGNvZGUgc3VjaCBhcyBcIlNUXCIgb3IgXCJJTVwiLlxuICogQHBhcmFtIHtPYmplY3R9IGRhdGEgLSBlbnRpdHkncyBkYXRhLlxuICogQHBhcmFtIHtPYmplY3R9IHZhbHVlcyAtIHBvc3NpYmx5IHN0eWxlZCBzdWJzcGFucyBjb250YWluZWQgaW4gdGhpcyBzdHlsZSBzcGFuLlxuICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IC0gaW5kZXggb2YgdGhlIGVsZW1lbnQgZ3VhcmFudGVlZCB0byBiZSB1bmlxdWUuXG4gKi9cblxuLyoqXG4gKiBDb252ZXJ0IERyYWZ0eSBkb2N1bWVudCB0byBhIHJlcHJlc2VudGF0aW9uIHN1aXRhYmxlIGZvciBkaXNwbGF5LlxuICogVGhlIDxjb2RlPmNvbnRleHQ8L2NvZGU+IG1heSBleHBvc2UgYSBmdW5jdGlvbiA8Y29kZT5nZXRGb3JtYXR0ZXIoc3R5bGUpPC9jb2RlPi4gSWYgaXQncyBhdmFpbGFibGVcbiAqIGl0IHdpbGwgY2FsbCBpdCB0byBvYnRhaW4gYSA8Y29kZT5mb3JtYXR0ZXI8L2NvZGU+IGZvciBhIHN1YnRyZWUgb2Ygc3R5bGVzIHVuZGVyIHRoZSA8Y29kZT5zdHlsZTwvY29kZT4uXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl8T2JqZWN0fSBjb250ZW50IC0gRHJhZnR5IGRvY3VtZW50IHRvIHRyYW5zZm9ybS5cbiAqIEBwYXJhbSB7Rm9ybWF0dGVyfSBmb3JtYXR0ZXIgLSBjYWxsYmFjayB3aGljaCBmb3JtYXRzIGluZGl2aWR1YWwgZWxlbWVudHMuXG4gKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCAtIGNvbnRleHQgcHJvdmlkZWQgdG8gZm9ybWF0dGVyIGFzIDxjb2RlPnRoaXM8L2NvZGU+LlxuICpcbiAqIEByZXR1cm4ge09iamVjdH0gdHJhbnNmb3JtZWQgb2JqZWN0XG4gKi9cbkRyYWZ0eS5mb3JtYXQgPSBmdW5jdGlvbihvcmlnaW5hbCwgZm9ybWF0dGVyLCBjb250ZXh0KSB7XG4gIHJldHVybiB0cmVlQm90dG9tVXAoZHJhZnR5VG9UcmVlKG9yaWdpbmFsKSwgZm9ybWF0dGVyLCAwLCBbXSwgY29udGV4dCk7XG59XG5cbi8qKlxuICogU2hvcnRlbiBEcmFmdHkgZG9jdW1lbnQgbWFraW5nIHRoZSBkcmFmdHkgdGV4dCBubyBsb25nZXIgdGhhbiB0aGUgbGltaXQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl8c3RyaW5nfSBvcmlnaW5hbCAtIERyYWZ0eSBvYmplY3QgdG8gc2hvcnRlbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBsaW1pdCAtIGxlbmd0aCBpbiBjaGFyYWNyZXRzIHRvIHNob3J0ZW4gdG8uXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGxpZ2h0IC0gcmVtb3ZlIGhlYXZ5IGRhdGEgZnJvbSBlbnRpdGllcy5cbiAqIEByZXR1cm5zIG5ldyBzaG9ydGVuZWQgRHJhZnR5IG9iamVjdCBsZWF2aW5nIHRoZSBvcmlnaW5hbCBpbnRhY3QuXG4gKi9cbkRyYWZ0eS5zaG9ydGVuID0gZnVuY3Rpb24ob3JpZ2luYWwsIGxpbWl0LCBsaWdodCkge1xuICBsZXQgdHJlZSA9IGRyYWZ0eVRvVHJlZShvcmlnaW5hbCk7XG4gIHRyZWUgPSBzaG9ydGVuVHJlZSh0cmVlLCBsaW1pdCwgJ+KApicpO1xuICBpZiAodHJlZSAmJiBsaWdodCkge1xuICAgIHRyZWUgPSBsaWdodEVudGl0eSh0cmVlKTtcbiAgfVxuICByZXR1cm4gdHJlZVRvRHJhZnR5KHt9LCB0cmVlLCBbXSk7XG59XG5cbi8qKlxuICogVHJhbnNmb3JtIERyYWZ0eSBkb2MgZm9yIGZvcndhcmRpbmc6IHN0cmlwIGxlYWRpbmcgQG1lbnRpb24gYW5kIGFueSBsZWFkaW5nIGxpbmUgYnJlYWtzIG9yIHdoaXRlc3BhY2UuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl8c3RyaW5nfSBvcmlnaW5hbCAtIERyYWZ0eSBvYmplY3QgdG8gc2hvcnRlbi5cbiAqIEByZXR1cm5zIGNvbnZlcnRlZCBEcmFmdHkgb2JqZWN0IGxlYXZpbmcgdGhlIG9yaWdpbmFsIGludGFjdC5cbiAqL1xuRHJhZnR5LmZvcndhcmRlZENvbnRlbnQgPSBmdW5jdGlvbihvcmlnaW5hbCkge1xuICBsZXQgdHJlZSA9IGRyYWZ0eVRvVHJlZShvcmlnaW5hbCk7XG4gIGNvbnN0IHJtTWVudGlvbiA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICBpZiAobm9kZS50eXBlID09ICdNTicpIHtcbiAgICAgIGlmICghbm9kZS5wYXJlbnQgfHwgIW5vZGUucGFyZW50LnR5cGUpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBub2RlO1xuICB9XG4gIC8vIFN0cmlwIGxlYWRpbmcgbWVudGlvbi5cbiAgdHJlZSA9IHRyZWVUb3BEb3duKHRyZWUsIHJtTWVudGlvbik7XG4gIC8vIFJlbW92ZSBsZWFkaW5nIHdoaXRlc3BhY2UuXG4gIHRyZWUgPSBsVHJpbSh0cmVlKTtcbiAgLy8gQ29udmVydCBiYWNrIHRvIERyYWZ0eS5cbiAgcmV0dXJuIHRyZWVUb0RyYWZ0eSh7fSwgdHJlZSwgW10pO1xufVxuXG4vKipcbiAqIFByZXBhcmUgRHJhZnR5IGRvYyBmb3Igd3JhcHBpbmcgaW50byBRUSBhcyBhIHJlcGx5OlxuICogIC0gUmVwbGFjZSBmb3J3YXJkaW5nIG1lbnRpb24gd2l0aCBzeW1ib2wgJ+KepicgYW5kIHJlbW92ZSBkYXRhIChVSUQpLlxuICogIC0gUmVtb3ZlIHF1b3RlZCB0ZXh0IGNvbXBsZXRlbHkuXG4gKiAgLSBSZXBsYWNlIGxpbmUgYnJlYWtzIHdpdGggc3BhY2VzLlxuICogIC0gU3RyaXAgZW50aXRpZXMgb2YgaGVhdnkgY29udGVudC5cbiAqICAtIE1vdmUgYXR0YWNobWVudHMgdG8gdGhlIGVuZCBvZiB0aGUgZG9jdW1lbnQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl8c3RyaW5nfSBvcmlnaW5hbCAtIERyYWZ0eSBvYmplY3QgdG8gc2hvcnRlbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBsaW1pdCAtIGxlbmd0aCBpbiBjaGFyYWN0ZXJzIHRvIHNob3J0ZW4gdG8uXG4gKiBAcmV0dXJucyBjb252ZXJ0ZWQgRHJhZnR5IG9iamVjdCBsZWF2aW5nIHRoZSBvcmlnaW5hbCBpbnRhY3QuXG4gKi9cbkRyYWZ0eS5yZXBseUNvbnRlbnQgPSBmdW5jdGlvbihvcmlnaW5hbCwgbGltaXQpIHtcbiAgY29uc3QgY29udk1OblFRbkJSID0gZnVuY3Rpb24obm9kZSkge1xuICAgIGlmIChub2RlLnR5cGUgPT0gJ1FRJykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBlbHNlIGlmIChub2RlLnR5cGUgPT0gJ01OJykge1xuICAgICAgaWYgKCghbm9kZS5wYXJlbnQgfHwgIW5vZGUucGFyZW50LnR5cGUpICYmIChub2RlLnRleHQgfHwgJycpLnN0YXJ0c1dpdGgoJ+KepicpKSB7XG4gICAgICAgIG5vZGUudGV4dCA9ICfinqYnO1xuICAgICAgICBkZWxldGUgbm9kZS5jaGlsZHJlbjtcbiAgICAgICAgZGVsZXRlIG5vZGUuZGF0YTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG5vZGUudHlwZSA9PSAnQlInKSB7XG4gICAgICBub2RlLnRleHQgPSAnICc7XG4gICAgICBkZWxldGUgbm9kZS50eXBlO1xuICAgICAgZGVsZXRlIG5vZGUuY2hpbGRyZW47XG4gICAgfVxuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgbGV0IHRyZWUgPSBkcmFmdHlUb1RyZWUob3JpZ2luYWwpO1xuICBpZiAoIXRyZWUpIHtcbiAgICByZXR1cm4gb3JpZ2luYWw7XG4gIH1cblxuICAvLyBTdHJpcCBsZWFkaW5nIG1lbnRpb24uXG4gIHRyZWUgPSB0cmVlVG9wRG93bih0cmVlLCBjb252TU5uUVFuQlIpO1xuICAvLyBNb3ZlIGF0dGFjaG1lbnRzIHRvIHRoZSBlbmQgb2YgdGhlIGRvYy5cbiAgdHJlZSA9IGF0dGFjaG1lbnRzVG9FbmQodHJlZSwgTUFYX1BSRVZJRVdfQVRUQUNITUVOVFMpO1xuICAvLyBTaG9ydGVuIHRoZSBkb2MuXG4gIHRyZWUgPSBzaG9ydGVuVHJlZSh0cmVlLCBsaW1pdCwgJ+KApicpO1xuICAvLyBTdHJpcCBoZWF2eSBlbGVtZW50cyBleGNlcHQgSU0uZGF0YVsndmFsJ10gYW5kIFZELmRhdGFbJ3ByZXZpZXcnXSAoaGF2ZSB0byBrZWVwIHRoZW0gdG8gZ2VuZXJhdGUgcHJldmlld3MgbGF0ZXIpLlxuICBjb25zdCBmaWx0ZXIgPSBub2RlID0+IHtcbiAgICBzd2l0Y2ggKG5vZGUudHlwZSkge1xuICAgICAgY2FzZSAnSU0nOlxuICAgICAgICByZXR1cm4gWyd2YWwnXTtcbiAgICAgIGNhc2UgJ1ZEJzpcbiAgICAgICAgcmV0dXJuIFsncHJldmlldyddO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfTtcbiAgdHJlZSA9IGxpZ2h0RW50aXR5KHRyZWUsIGZpbHRlcik7XG4gIC8vIENvbnZlcnQgYmFjayB0byBEcmFmdHkuXG4gIHJldHVybiB0cmVlVG9EcmFmdHkoe30sIHRyZWUsIFtdKTtcbn1cblxuXG4vKipcbiAqIEdlbmVyYXRlIGRyYWZ0eSBwcmV2aWV3OlxuICogIC0gU2hvcnRlbiB0aGUgZG9jdW1lbnQuXG4gKiAgLSBTdHJpcCBhbGwgaGVhdnkgZW50aXR5IGRhdGEgbGVhdmluZyBqdXN0IGlubGluZSBzdHlsZXMgYW5kIGVudGl0eSByZWZlcmVuY2VzLlxuICogIC0gUmVwbGFjZSBsaW5lIGJyZWFrcyB3aXRoIHNwYWNlcy5cbiAqICAtIFJlcGxhY2UgY29udGVudCBvZiBRUSB3aXRoIGEgc3BhY2UuXG4gKiAgLSBSZXBsYWNlIGZvcndhcmRpbmcgbWVudGlvbiB3aXRoIHN5bWJvbCAn4p6mJy5cbiAqIG1vdmUgYWxsIGF0dGFjaG1lbnRzIHRvIHRoZSBlbmQgb2YgdGhlIGRvY3VtZW50IGFuZCBtYWtlIHRoZW0gdmlzaWJsZS5cbiAqIFRoZSA8Y29kZT5jb250ZXh0PC9jb2RlPiBtYXkgZXhwb3NlIGEgZnVuY3Rpb24gPGNvZGU+Z2V0Rm9ybWF0dGVyKHN0eWxlKTwvY29kZT4uIElmIGl0J3MgYXZhaWxhYmxlXG4gKiBpdCB3aWxsIGNhbGwgaXQgdG8gb2J0YWluIGEgPGNvZGU+Zm9ybWF0dGVyPC9jb2RlPiBmb3IgYSBzdWJ0cmVlIG9mIHN0eWxlcyB1bmRlciB0aGUgPGNvZGU+c3R5bGU8L2NvZGU+LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fHN0cmluZ30gb3JpZ2luYWwgLSBEcmFmdHkgb2JqZWN0IHRvIHNob3J0ZW4uXG4gKiBAcGFyYW0ge251bWJlcn0gbGltaXQgLSBsZW5ndGggaW4gY2hhcmFjdGVycyB0byBzaG9ydGVuIHRvLlxuICogQHBhcmFtIHtib29sZWFufSBmb3J3YXJkaW5nIC0gdGhpcyBhIGZvcndhcmRpbmcgbWVzc2FnZSBwcmV2aWV3LlxuICogQHJldHVybnMgbmV3IHNob3J0ZW5lZCBEcmFmdHkgb2JqZWN0IGxlYXZpbmcgdGhlIG9yaWdpbmFsIGludGFjdC5cbiAqL1xuRHJhZnR5LnByZXZpZXcgPSBmdW5jdGlvbihvcmlnaW5hbCwgbGltaXQsIGZvcndhcmRpbmcpIHtcbiAgbGV0IHRyZWUgPSBkcmFmdHlUb1RyZWUob3JpZ2luYWwpO1xuXG4gIC8vIE1vdmUgYXR0YWNobWVudHMgdG8gdGhlIGVuZC5cbiAgdHJlZSA9IGF0dGFjaG1lbnRzVG9FbmQodHJlZSwgTUFYX1BSRVZJRVdfQVRUQUNITUVOVFMpO1xuXG4gIC8vIENvbnZlcnQgbGVhZGluZyBtZW50aW9uIHRvICfinqYnIGFuZCByZXBsYWNlIFFRIGFuZCBCUiB3aXRoIGEgc3BhY2UgJyAnLlxuICBjb25zdCBjb252TU5uUVFuQlIgPSBmdW5jdGlvbihub2RlKSB7XG4gICAgaWYgKG5vZGUudHlwZSA9PSAnTU4nKSB7XG4gICAgICBpZiAoKCFub2RlLnBhcmVudCB8fCAhbm9kZS5wYXJlbnQudHlwZSkgJiYgKG5vZGUudGV4dCB8fCAnJykuc3RhcnRzV2l0aCgn4p6mJykpIHtcbiAgICAgICAgbm9kZS50ZXh0ID0gJ+Kepic7XG4gICAgICAgIGRlbGV0ZSBub2RlLmNoaWxkcmVuO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAobm9kZS50eXBlID09ICdRUScpIHtcbiAgICAgIG5vZGUudGV4dCA9ICcgJztcbiAgICAgIGRlbGV0ZSBub2RlLmNoaWxkcmVuO1xuICAgIH0gZWxzZSBpZiAobm9kZS50eXBlID09ICdCUicpIHtcbiAgICAgIG5vZGUudGV4dCA9ICcgJztcbiAgICAgIGRlbGV0ZSBub2RlLmNoaWxkcmVuO1xuICAgICAgZGVsZXRlIG5vZGUudHlwZTtcbiAgICB9XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cbiAgdHJlZSA9IHRyZWVUb3BEb3duKHRyZWUsIGNvbnZNTm5RUW5CUik7XG5cbiAgdHJlZSA9IHNob3J0ZW5UcmVlKHRyZWUsIGxpbWl0LCAn4oCmJyk7XG4gIGlmIChmb3J3YXJkaW5nKSB7XG4gICAgLy8gS2VlcCBzb21lIElNIGFuZCBWRCBkYXRhIGZvciBwcmV2aWV3LlxuICAgIGNvbnN0IGZpbHRlciA9IHtcbiAgICAgIElNOiBbJ3ZhbCddLFxuICAgICAgVkQ6IFsncHJldmlldyddXG4gICAgfTtcbiAgICB0cmVlID0gbGlnaHRFbnRpdHkodHJlZSwgbm9kZSA9PiB7XG4gICAgICByZXR1cm4gZmlsdGVyW25vZGUudHlwZV07XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgdHJlZSA9IGxpZ2h0RW50aXR5KHRyZWUpO1xuICB9XG5cbiAgLy8gQ29udmVydCBiYWNrIHRvIERyYWZ0eS5cbiAgcmV0dXJuIHRyZWVUb0RyYWZ0eSh7fSwgdHJlZSwgW10pO1xufVxuXG4vKipcbiAqIEdpdmVuIERyYWZ0eSBkb2N1bWVudCwgY29udmVydCBpdCB0byBwbGFpbiB0ZXh0LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gZG9jdW1lbnQgdG8gY29udmVydCB0byBwbGFpbiB0ZXh0LlxuICogQHJldHVybnMge3N0cmluZ30gcGxhaW4tdGV4dCByZXByZXNlbnRhdGlvbiBvZiB0aGUgZHJhZnR5IGRvY3VtZW50LlxuICovXG5EcmFmdHkudG9QbGFpblRleHQgPSBmdW5jdGlvbihjb250ZW50KSB7XG4gIHJldHVybiB0eXBlb2YgY29udGVudCA9PSAnc3RyaW5nJyA/IGNvbnRlbnQgOiBjb250ZW50LnR4dDtcbn1cblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgZG9jdW1lbnQgaGFzIG5vIG1hcmt1cCBhbmQgbm8gZW50aXRpZXMuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBjb250ZW50IHRvIGNoZWNrIGZvciBwcmVzZW5jZSBvZiBtYXJrdXAuXG4gKiBAcmV0dXJucyA8Y29kZT50cnVlPC9jb2RlPiBpcyBjb250ZW50IGlzIHBsYWluIHRleHQsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gKi9cbkRyYWZ0eS5pc1BsYWluVGV4dCA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcbiAgcmV0dXJuIHR5cGVvZiBjb250ZW50ID09ICdzdHJpbmcnIHx8ICEoY29udGVudC5mbXQgfHwgY29udGVudC5lbnQpO1xufVxuXG4vKipcbiAqIENvbnZlcnQgZG9jdW1lbnQgdG8gcGxhaW4gdGV4dCB3aXRoIG1hcmtkb3duLiBBbGwgZWxlbWVudHMgd2hpY2ggY2Fubm90XG4gKiBiZSByZXByZXNlbnRlZCBpbiBtYXJrZG93biBhcmUgc3RyaXBwZWQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBkb2N1bWVudCB0byBjb252ZXJ0IHRvIHBsYWluIHRleHQgd2l0aCBtYXJrZG93bi5cbiAqL1xuRHJhZnR5LnRvTWFya2Rvd24gPSBmdW5jdGlvbihjb250ZW50KSB7XG4gIGxldCB0cmVlID0gZHJhZnR5VG9UcmVlKGNvbnRlbnQpO1xuICBjb25zdCBtZEZvcm1hdHRlciA9IGZ1bmN0aW9uKHR5cGUsIF8sIHZhbHVlcykge1xuICAgIGNvbnN0IGRlZiA9IEZPUk1BVF9UQUdTW3R5cGVdO1xuICAgIGxldCByZXN1bHQgPSAodmFsdWVzID8gdmFsdWVzLmpvaW4oJycpIDogJycpO1xuICAgIGlmIChkZWYpIHtcbiAgICAgIGlmIChkZWYuaXNWb2lkKSB7XG4gICAgICAgIHJlc3VsdCA9IGRlZi5tZF90YWcgfHwgJyc7XG4gICAgICB9IGVsc2UgaWYgKGRlZi5tZF90YWcpIHtcbiAgICAgICAgcmVzdWx0ID0gZGVmLm1kX3RhZyArIHJlc3VsdCArIGRlZi5tZF90YWc7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG4gIHJldHVybiB0cmVlQm90dG9tVXAodHJlZSwgbWRGb3JtYXR0ZXIsIDApO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiB0aGUgb2JqZWN0IHJlcHJlc2V0cyBpcyBhIHZhbGlkIERyYWZ0eSBkb2N1bWVudC5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIGNvbnRlbnQgdG8gY2hlY2sgZm9yIHZhbGlkaXR5LlxuICogQHJldHVybnMgPGNvZGU+dHJ1ZTwvY29kZT4gaXMgY29udGVudCBpcyB2YWxpZCwgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAqL1xuRHJhZnR5LmlzVmFsaWQgPSBmdW5jdGlvbihjb250ZW50KSB7XG4gIGlmICghY29udGVudCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IHtcbiAgICB0eHQsXG4gICAgZm10LFxuICAgIGVudFxuICB9ID0gY29udGVudDtcblxuICBpZiAoIXR4dCAmJiB0eHQgIT09ICcnICYmICFmbXQgJiYgIWVudCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IHR4dF90eXBlID0gdHlwZW9mIHR4dDtcbiAgaWYgKHR4dF90eXBlICE9ICdzdHJpbmcnICYmIHR4dF90eXBlICE9ICd1bmRlZmluZWQnICYmIHR4dCAhPT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgZm10ICE9ICd1bmRlZmluZWQnICYmICFBcnJheS5pc0FycmF5KGZtdCkgJiYgZm10ICE9PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBlbnQgIT0gJ3VuZGVmaW5lZCcgJiYgIUFycmF5LmlzQXJyYXkoZW50KSAmJiBlbnQgIT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhlIGRyYWZ0eSBkb2N1bWVudCBoYXMgYXR0YWNobWVudHM6IHN0eWxlIEVYIGFuZCBvdXRzaWRlIG9mIG5vcm1hbCByZW5kZXJpbmcgZmxvdyxcbiAqIGkuZS4gPGNvZGU+YXQgPSAtMTwvY29kZT4uXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBkb2N1bWVudCB0byBjaGVjayBmb3IgYXR0YWNobWVudHMuXG4gKiBAcmV0dXJucyA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGVyZSBhcmUgYXR0YWNobWVudHMuXG4gKi9cbkRyYWZ0eS5oYXNBdHRhY2htZW50cyA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KGNvbnRlbnQuZm10KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBmb3IgKGxldCBpIGluIGNvbnRlbnQuZm10KSB7XG4gICAgY29uc3QgZm10ID0gY29udGVudC5mbXRbaV07XG4gICAgaWYgKGZtdCAmJiBmbXQuYXQgPCAwKSB7XG4gICAgICBjb25zdCBlbnQgPSBjb250ZW50LmVudFtmbXQua2V5IHwgMF07XG4gICAgICByZXR1cm4gZW50ICYmIGVudC50cCA9PSAnRVgnICYmIGVudC5kYXRhO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogQ2FsbGJhY2sgZm9yIGVudW1lcmF0aW5nIGVudGl0aWVzIGluIGEgRHJhZnR5IGRvY3VtZW50LlxuICogQ2FsbGVkIG9uY2UgZm9yIGVhY2ggZW50aXR5LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBjYWxsYmFjayBFbnRpdHlDYWxsYmFja1xuICogQHBhcmFtIHtPYmplY3R9IGRhdGEgZW50aXR5IGRhdGEuXG4gKiBAcGFyYW0ge3N0cmluZ30gZW50aXR5IHR5cGUuXG4gKiBAcGFyYW0ge251bWJlcn0gaW5kZXggZW50aXR5J3MgaW5kZXggaW4gYGNvbnRlbnQuZW50YC5cbiAqXG4gKiBAcmV0dXJuICd0cnVlLWlzaCcgdG8gc3RvcCBwcm9jZXNzaW5nLCAnZmFsc2UtaXNoJyBvdGhlcndpc2UuXG4gKi9cblxuLyoqXG4gKiBFbnVtZXJhdGUgYXR0YWNobWVudHM6IHN0eWxlIEVYIGFuZCBvdXRzaWRlIG9mIG5vcm1hbCByZW5kZXJpbmcgZmxvdywgaS5lLiA8Y29kZT5hdCA9IC0xPC9jb2RlPi5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIGRvY3VtZW50IHRvIHByb2Nlc3MgZm9yIGF0dGFjaG1lbnRzLlxuICogQHBhcmFtIHtFbnRpdHlDYWxsYmFja30gY2FsbGJhY2sgLSBjYWxsYmFjayB0byBjYWxsIGZvciBlYWNoIGF0dGFjaG1lbnQuXG4gKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCAtIHZhbHVlIG9mIFwidGhpc1wiIGZvciBjYWxsYmFjay5cbiAqL1xuRHJhZnR5LmF0dGFjaG1lbnRzID0gZnVuY3Rpb24oY29udGVudCwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KGNvbnRlbnQuZm10KSkge1xuICAgIHJldHVybjtcbiAgfVxuICBsZXQgY291bnQgPSAwO1xuICBmb3IgKGxldCBpIGluIGNvbnRlbnQuZW50KSB7XG4gICAgbGV0IGZtdCA9IGNvbnRlbnQuZm10W2ldO1xuICAgIGlmIChmbXQgJiYgZm10LmF0IDwgMCkge1xuICAgICAgY29uc3QgZW50ID0gY29udGVudC5lbnRbZm10LmtleSB8IDBdO1xuICAgICAgaWYgKGVudCAmJiBlbnQudHAgPT0gJ0VYJyAmJiBlbnQuZGF0YSkge1xuICAgICAgICBpZiAoY2FsbGJhY2suY2FsbChjb250ZXh0LCBlbnQuZGF0YSwgY291bnQrKywgJ0VYJykpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcbn1cblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgZHJhZnR5IGRvY3VtZW50IGhhcyBlbnRpdGllcy5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIGRvY3VtZW50IHRvIGNoZWNrIGZvciBlbnRpdGllcy5cbiAqIEByZXR1cm5zIDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZXJlIGFyZSBlbnRpdGllcy5cbiAqL1xuRHJhZnR5Lmhhc0VudGl0aWVzID0gZnVuY3Rpb24oY29udGVudCkge1xuICByZXR1cm4gY29udGVudC5lbnQgJiYgY29udGVudC5lbnQubGVuZ3RoID4gMDtcbn1cblxuLyoqXG4gKiBFbnVtZXJhdGUgZW50aXRpZXMuIEVudW1lcmF0aW9uIHN0b3BzIGlmIGNhbGxiYWNrIHJldHVybnMgJ3RydWUnLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gZG9jdW1lbnQgd2l0aCBlbnRpdGllcyB0byBlbnVtZXJhdGUuXG4gKiBAcGFyYW0ge0VudGl0eUNhbGxiYWNrfSBjYWxsYmFjayAtIGNhbGxiYWNrIHRvIGNhbGwgZm9yIGVhY2ggZW50aXR5LlxuICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSB2YWx1ZSBvZiBcInRoaXNcIiBmb3IgY2FsbGJhY2suXG4gKlxuICovXG5EcmFmdHkuZW50aXRpZXMgPSBmdW5jdGlvbihjb250ZW50LCBjYWxsYmFjaywgY29udGV4dCkge1xuICBpZiAoY29udGVudC5lbnQgJiYgY29udGVudC5lbnQubGVuZ3RoID4gMCkge1xuICAgIGZvciAobGV0IGkgaW4gY29udGVudC5lbnQpIHtcbiAgICAgIGlmIChjb250ZW50LmVudFtpXSkge1xuICAgICAgICBpZiAoY2FsbGJhY2suY2FsbChjb250ZXh0LCBjb250ZW50LmVudFtpXS5kYXRhLCBpLCBjb250ZW50LmVudFtpXS50cCkpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIENhbGxiYWNrIGZvciBlbnVtZXJhdGluZyBzdHlsZXMgKGlubGluZSBmb3JtYXRzKSBpbiBhIERyYWZ0eSBkb2N1bWVudC5cbiAqIENhbGxlZCBvbmNlIGZvciBlYWNoIHN0eWxlLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBjYWxsYmFjayBTdHlsZUNhbGxiYWNrXG4gKiBAcGFyYW0ge3N0cmluZ30gdHAgLSBmb3JtYXQgdHlwZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBhdCAtIHN0YXJ0aW5nIHBvc2l0aW9uIG9mIHRoZSBmb3JtYXQgaW4gdGV4dC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBsZW4gLSBleHRlbnQgb2YgdGhlIGZvcm1hdCBpbiBjaGFyYWN0ZXJzLlxuICogQHBhcmFtIHtudW1iZXJ9IGtleSAtIGluZGV4IG9mIHRoZSBlbnRpdHkgaWYgZm9ybWF0IGlzIGEgcmVmZXJlbmNlLlxuICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IC0gc3R5bGUncyBpbmRleCBpbiBgY29udGVudC5mbXRgLlxuICpcbiAqIEByZXR1cm4gJ3RydWUtaXNoJyB0byBzdG9wIHByb2Nlc3NpbmcsICdmYWxzZS1pc2gnIG90aGVyd2lzZS5cbiAqL1xuXG4vKipcbiAqIEVudW1lcmF0ZSBzdHlsZXMgKGlubGluZSBmb3JtYXRzKS4gRW51bWVyYXRpb24gc3RvcHMgaWYgY2FsbGJhY2sgcmV0dXJucyAndHJ1ZScuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBkb2N1bWVudCB3aXRoIHN0eWxlcyAoZm9ybWF0cykgdG8gZW51bWVyYXRlLlxuICogQHBhcmFtIHtTdHlsZUNhbGxiYWNrfSBjYWxsYmFjayAtIGNhbGxiYWNrIHRvIGNhbGwgZm9yIGVhY2ggZm9ybWF0LlxuICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSB2YWx1ZSBvZiBcInRoaXNcIiBmb3IgY2FsbGJhY2suXG4gKi9cbkRyYWZ0eS5zdHlsZXMgPSBmdW5jdGlvbihjb250ZW50LCBjYWxsYmFjaywgY29udGV4dCkge1xuICBpZiAoY29udGVudC5mbXQgJiYgY29udGVudC5mbXQubGVuZ3RoID4gMCkge1xuICAgIGZvciAobGV0IGkgaW4gY29udGVudC5mbXQpIHtcbiAgICAgIGNvbnN0IGZtdCA9IGNvbnRlbnQuZm10W2ldO1xuICAgICAgaWYgKGZtdCkge1xuICAgICAgICBpZiAoY2FsbGJhY2suY2FsbChjb250ZXh0LCBmbXQudHAsIGZtdC5hdCwgZm10LmxlbiwgZm10LmtleSwgaSkpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFJlbW92ZSB1bnJlY29nbml6ZWQgZmllbGRzIGZyb20gZW50aXR5IGRhdGFcbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIGRvY3VtZW50IHdpdGggZW50aXRpZXMgdG8gZW51bWVyYXRlLlxuICogQHJldHVybnMgY29udGVudC5cbiAqL1xuRHJhZnR5LnNhbml0aXplRW50aXRpZXMgPSBmdW5jdGlvbihjb250ZW50KSB7XG4gIGlmIChjb250ZW50ICYmIGNvbnRlbnQuZW50ICYmIGNvbnRlbnQuZW50Lmxlbmd0aCA+IDApIHtcbiAgICBmb3IgKGxldCBpIGluIGNvbnRlbnQuZW50KSB7XG4gICAgICBjb25zdCBlbnQgPSBjb250ZW50LmVudFtpXTtcbiAgICAgIGlmIChlbnQgJiYgZW50LmRhdGEpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IGNvcHlFbnREYXRhKGVudC5kYXRhKTtcbiAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICBjb250ZW50LmVudFtpXS5kYXRhID0gZGF0YTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZWxldGUgY29udGVudC5lbnRbaV0uZGF0YTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gY29udGVudDtcbn1cblxuLyoqXG4gKiBHaXZlbiB0aGUgZW50aXR5LCBnZXQgVVJMIHdoaWNoIGNhbiBiZSB1c2VkIGZvciBkb3dubG9hZGluZ1xuICogZW50aXR5IGRhdGEuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGVudERhdGEgLSBlbnRpdHkuZGF0YSB0byBnZXQgdGhlIFVSbCBmcm9tLlxuICogQHJldHVybnMge3N0cmluZ30gVVJMIHRvIGRvd25sb2FkIGVudGl0eSBkYXRhIG9yIDxjb2RlPm51bGw8L2NvZGU+LlxuICovXG5EcmFmdHkuZ2V0RG93bmxvYWRVcmwgPSBmdW5jdGlvbihlbnREYXRhKSB7XG4gIGxldCB1cmwgPSBudWxsO1xuICBpZiAoZW50RGF0YS5taW1lICE9IEpTT05fTUlNRV9UWVBFICYmIGVudERhdGEudmFsKSB7XG4gICAgdXJsID0gYmFzZTY0dG9PYmplY3RVcmwoZW50RGF0YS52YWwsIGVudERhdGEubWltZSwgRHJhZnR5LmxvZ2dlcik7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGVudERhdGEucmVmID09ICdzdHJpbmcnKSB7XG4gICAgdXJsID0gZW50RGF0YS5yZWY7XG4gIH1cbiAgcmV0dXJuIHVybDtcbn1cblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgZW50aXR5IGRhdGEgaXMgbm90IHJlYWR5IGZvciBzZW5kaW5nLCBzdWNoIGFzIGJlaW5nIHVwbG9hZGVkIHRvIHRoZSBzZXJ2ZXIuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGVudGl0eS5kYXRhIHRvIGdldCB0aGUgVVJsIGZyb20uXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiB1cGxvYWQgaXMgaW4gcHJvZ3Jlc3MsIGZhbHNlIG90aGVyd2lzZS5cbiAqL1xuRHJhZnR5LmlzUHJvY2Vzc2luZyA9IGZ1bmN0aW9uKGVudERhdGEpIHtcbiAgcmV0dXJuICEhZW50RGF0YS5fcHJvY2Vzc2luZztcbn1cblxuLyoqXG4gKiBHaXZlbiB0aGUgZW50aXR5LCBnZXQgVVJMIHdoaWNoIGNhbiBiZSB1c2VkIGZvciBwcmV2aWV3aW5nXG4gKiB0aGUgZW50aXR5LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBlbnRpdHkuZGF0YSB0byBnZXQgdGhlIFVSbCBmcm9tLlxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IHVybCBmb3IgcHJldmlld2luZyBvciBudWxsIGlmIG5vIHN1Y2ggdXJsIGlzIGF2YWlsYWJsZS5cbiAqL1xuRHJhZnR5LmdldFByZXZpZXdVcmwgPSBmdW5jdGlvbihlbnREYXRhKSB7XG4gIHJldHVybiBlbnREYXRhLnZhbCA/IGJhc2U2NHRvT2JqZWN0VXJsKGVudERhdGEudmFsLCBlbnREYXRhLm1pbWUsIERyYWZ0eS5sb2dnZXIpIDogbnVsbDtcbn1cblxuLyoqXG4gKiBHZXQgYXBwcm94aW1hdGUgc2l6ZSBvZiB0aGUgZW50aXR5LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBlbnREYXRhIC0gZW50aXR5LmRhdGEgdG8gZ2V0IHRoZSBzaXplIGZvci5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IHNpemUgb2YgZW50aXR5IGRhdGEgaW4gYnl0ZXMuXG4gKi9cbkRyYWZ0eS5nZXRFbnRpdHlTaXplID0gZnVuY3Rpb24oZW50RGF0YSkge1xuICAvLyBFaXRoZXIgc2l6ZSBoaW50IG9yIGxlbmd0aCBvZiB2YWx1ZS4gVGhlIHZhbHVlIGlzIGJhc2U2NCBlbmNvZGVkLFxuICAvLyB0aGUgYWN0dWFsIG9iamVjdCBzaXplIGlzIHNtYWxsZXIgdGhhbiB0aGUgZW5jb2RlZCBsZW5ndGguXG4gIHJldHVybiBlbnREYXRhLnNpemUgPyBlbnREYXRhLnNpemUgOiBlbnREYXRhLnZhbCA/IChlbnREYXRhLnZhbC5sZW5ndGggKiAwLjc1KSB8IDAgOiAwO1xufVxuXG4vKipcbiAqIEdldCBlbnRpdHkgbWltZSB0eXBlLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBlbnREYXRhIC0gZW50aXR5LmRhdGEgdG8gZ2V0IHRoZSB0eXBlIGZvci5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IG1pbWUgdHlwZSBvZiBlbnRpdHkuXG4gKi9cbkRyYWZ0eS5nZXRFbnRpdHlNaW1lVHlwZSA9IGZ1bmN0aW9uKGVudERhdGEpIHtcbiAgcmV0dXJuIGVudERhdGEubWltZSB8fCAndGV4dC9wbGFpbic7XG59XG5cbi8qKlxuICogR2V0IEhUTUwgdGFnIGZvciBhIGdpdmVuIHR3by1sZXR0ZXIgc3R5bGUgbmFtZS5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3R5bGUgLSB0d28tbGV0dGVyIHN0eWxlLCBsaWtlIFNUIG9yIExOLlxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IEhUTUwgdGFnIG5hbWUgaWYgc3R5bGUgaXMgZm91bmQsIHtjb2RlOiB1bmRlZmluZWR9IGlmIHN0eWxlIGlzIGZhbHNpc2ggb3Igbm90IGZvdW5kLlxuICovXG5EcmFmdHkudGFnTmFtZSA9IGZ1bmN0aW9uKHN0eWxlKSB7XG4gIHJldHVybiBGT1JNQVRfVEFHU1tzdHlsZV0gJiYgRk9STUFUX1RBR1Nbc3R5bGVdLmh0bWxfdGFnO1xufVxuXG4vKipcbiAqIEZvciBhIGdpdmVuIGRhdGEgYnVuZGxlIGdlbmVyYXRlIGFuIG9iamVjdCB3aXRoIEhUTUwgYXR0cmlidXRlcyxcbiAqIGZvciBpbnN0YW5jZSwgZ2l2ZW4ge3VybDogXCJodHRwOi8vd3d3LmV4YW1wbGUuY29tL1wifSByZXR1cm5cbiAqIHtocmVmOiBcImh0dHA6Ly93d3cuZXhhbXBsZS5jb20vXCJ9XG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHN0eWxlIC0gdHdvLWxldHRlciBzdHlsZSB0byBnZW5lcmF0ZSBhdHRyaWJ1dGVzIGZvci5cbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIC0gZGF0YSBidW5kbGUgdG8gY29udmVydCB0byBhdHRyaWJ1dGVzXG4gKlxuICogQHJldHVybnMge09iamVjdH0gb2JqZWN0IHdpdGggSFRNTCBhdHRyaWJ1dGVzLlxuICovXG5EcmFmdHkuYXR0clZhbHVlID0gZnVuY3Rpb24oc3R5bGUsIGRhdGEpIHtcbiAgaWYgKGRhdGEgJiYgREVDT1JBVE9SU1tzdHlsZV0pIHtcbiAgICByZXR1cm4gREVDT1JBVE9SU1tzdHlsZV0ucHJvcHMoZGF0YSk7XG4gIH1cblxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIERyYWZ0eSBNSU1FIHR5cGUuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gY29udGVudC1UeXBlIFwidGV4dC94LWRyYWZ0eVwiLlxuICovXG5EcmFmdHkuZ2V0Q29udGVudFR5cGUgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIERSQUZUWV9NSU1FX1RZUEU7XG59XG5cbi8vID09PT09PT09PT09PT09PT09XG4vLyBVdGlsaXR5IG1ldGhvZHMuXG4vLyA9PT09PT09PT09PT09PT09PVxuXG4vLyBUYWtlIGEgc3RyaW5nIGFuZCBkZWZpbmVkIGVhcmxpZXIgc3R5bGUgc3BhbnMsIHJlLWNvbXBvc2UgdGhlbSBpbnRvIGEgdHJlZSB3aGVyZSBlYWNoIGxlYWYgaXNcbi8vIGEgc2FtZS1zdHlsZSAoaW5jbHVkaW5nIHVuc3R5bGVkKSBzdHJpbmcuIEkuZS4gJ2hlbGxvICpib2xkIF9pdGFsaWNfKiBhbmQgfm1vcmV+IHdvcmxkJyAtPlxuLy8gKCdoZWxsbyAnLCAoYjogJ2JvbGQgJywgKGk6ICdpdGFsaWMnKSksICcgYW5kICcsIChzOiAnbW9yZScpLCAnIHdvcmxkJyk7XG4vL1xuLy8gVGhpcyBpcyBuZWVkZWQgaW4gb3JkZXIgdG8gY2xlYXIgbWFya3VwLCBpLmUuICdoZWxsbyAqd29ybGQqJyAtPiAnaGVsbG8gd29ybGQnIGFuZCBjb252ZXJ0XG4vLyByYW5nZXMgZnJvbSBtYXJrdXAtZWQgb2Zmc2V0cyB0byBwbGFpbiB0ZXh0IG9mZnNldHMuXG5mdW5jdGlvbiBjaHVua2lmeShsaW5lLCBzdGFydCwgZW5kLCBzcGFucykge1xuICBjb25zdCBjaHVua3MgPSBbXTtcblxuICBpZiAoc3BhbnMubGVuZ3RoID09IDApIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBmb3IgKGxldCBpIGluIHNwYW5zKSB7XG4gICAgLy8gR2V0IHRoZSBuZXh0IGNodW5rIGZyb20gdGhlIHF1ZXVlXG4gICAgY29uc3Qgc3BhbiA9IHNwYW5zW2ldO1xuXG4gICAgLy8gR3JhYiB0aGUgaW5pdGlhbCB1bnN0eWxlZCBjaHVua1xuICAgIGlmIChzcGFuLmF0ID4gc3RhcnQpIHtcbiAgICAgIGNodW5rcy5wdXNoKHtcbiAgICAgICAgdHh0OiBsaW5lLnNsaWNlKHN0YXJ0LCBzcGFuLmF0KVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gR3JhYiB0aGUgc3R5bGVkIGNodW5rLiBJdCBtYXkgaW5jbHVkZSBzdWJjaHVua3MuXG4gICAgY29uc3QgY2h1bmsgPSB7XG4gICAgICB0cDogc3Bhbi50cFxuICAgIH07XG4gICAgY29uc3QgY2hsZCA9IGNodW5raWZ5KGxpbmUsIHNwYW4uYXQgKyAxLCBzcGFuLmVuZCwgc3Bhbi5jaGlsZHJlbik7XG4gICAgaWYgKGNobGQubGVuZ3RoID4gMCkge1xuICAgICAgY2h1bmsuY2hpbGRyZW4gPSBjaGxkO1xuICAgIH0gZWxzZSB7XG4gICAgICBjaHVuay50eHQgPSBzcGFuLnR4dDtcbiAgICB9XG4gICAgY2h1bmtzLnB1c2goY2h1bmspO1xuICAgIHN0YXJ0ID0gc3Bhbi5lbmQgKyAxOyAvLyAnKzEnIGlzIHRvIHNraXAgdGhlIGZvcm1hdHRpbmcgY2hhcmFjdGVyXG4gIH1cblxuICAvLyBHcmFiIHRoZSByZW1haW5pbmcgdW5zdHlsZWQgY2h1bmssIGFmdGVyIHRoZSBsYXN0IHNwYW5cbiAgaWYgKHN0YXJ0IDwgZW5kKSB7XG4gICAgY2h1bmtzLnB1c2goe1xuICAgICAgdHh0OiBsaW5lLnNsaWNlKHN0YXJ0LCBlbmQpXG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gY2h1bmtzO1xufVxuXG4vLyBEZXRlY3Qgc3RhcnRzIGFuZCBlbmRzIG9mIGZvcm1hdHRpbmcgc3BhbnMuIFVuZm9ybWF0dGVkIHNwYW5zIGFyZVxuLy8gaWdub3JlZCBhdCB0aGlzIHN0YWdlLlxuZnVuY3Rpb24gc3Bhbm5pZnkob3JpZ2luYWwsIHJlX3N0YXJ0LCByZV9lbmQsIHR5cGUpIHtcbiAgY29uc3QgcmVzdWx0ID0gW107XG4gIGxldCBpbmRleCA9IDA7XG4gIGxldCBsaW5lID0gb3JpZ2luYWwuc2xpY2UoMCk7IC8vIG1ha2UgYSBjb3B5O1xuXG4gIHdoaWxlIChsaW5lLmxlbmd0aCA+IDApIHtcbiAgICAvLyBtYXRjaFswXTsgLy8gbWF0Y2gsIGxpa2UgJyphYmMqJ1xuICAgIC8vIG1hdGNoWzFdOyAvLyBtYXRjaCBjYXB0dXJlZCBpbiBwYXJlbnRoZXNpcywgbGlrZSAnYWJjJ1xuICAgIC8vIG1hdGNoWydpbmRleCddOyAvLyBvZmZzZXQgd2hlcmUgdGhlIG1hdGNoIHN0YXJ0ZWQuXG5cbiAgICAvLyBGaW5kIHRoZSBvcGVuaW5nIHRva2VuLlxuICAgIGNvbnN0IHN0YXJ0ID0gcmVfc3RhcnQuZXhlYyhsaW5lKTtcbiAgICBpZiAoc3RhcnQgPT0gbnVsbCkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgLy8gQmVjYXVzZSBqYXZhc2NyaXB0IFJlZ0V4cCBkb2VzIG5vdCBzdXBwb3J0IGxvb2tiZWhpbmQsIHRoZSBhY3R1YWwgb2Zmc2V0IG1heSBub3QgcG9pbnRcbiAgICAvLyBhdCB0aGUgbWFya3VwIGNoYXJhY3Rlci4gRmluZCBpdCBpbiB0aGUgbWF0Y2hlZCBzdHJpbmcuXG4gICAgbGV0IHN0YXJ0X29mZnNldCA9IHN0YXJ0WydpbmRleCddICsgc3RhcnRbMF0ubGFzdEluZGV4T2Yoc3RhcnRbMV0pO1xuICAgIC8vIENsaXAgdGhlIHByb2Nlc3NlZCBwYXJ0IG9mIHRoZSBzdHJpbmcuXG4gICAgbGluZSA9IGxpbmUuc2xpY2Uoc3RhcnRfb2Zmc2V0ICsgMSk7XG4gICAgLy8gc3RhcnRfb2Zmc2V0IGlzIGFuIG9mZnNldCB3aXRoaW4gdGhlIGNsaXBwZWQgc3RyaW5nLiBDb252ZXJ0IHRvIG9yaWdpbmFsIGluZGV4LlxuICAgIHN0YXJ0X29mZnNldCArPSBpbmRleDtcbiAgICAvLyBJbmRleCBub3cgcG9pbnQgdG8gdGhlIGJlZ2lubmluZyBvZiAnbGluZScgd2l0aGluIHRoZSAnb3JpZ2luYWwnIHN0cmluZy5cbiAgICBpbmRleCA9IHN0YXJ0X29mZnNldCArIDE7XG5cbiAgICAvLyBGaW5kIHRoZSBtYXRjaGluZyBjbG9zaW5nIHRva2VuLlxuICAgIGNvbnN0IGVuZCA9IHJlX2VuZCA/IHJlX2VuZC5leGVjKGxpbmUpIDogbnVsbDtcbiAgICBpZiAoZW5kID09IG51bGwpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBsZXQgZW5kX29mZnNldCA9IGVuZFsnaW5kZXgnXSArIGVuZFswXS5pbmRleE9mKGVuZFsxXSk7XG4gICAgLy8gQ2xpcCB0aGUgcHJvY2Vzc2VkIHBhcnQgb2YgdGhlIHN0cmluZy5cbiAgICBsaW5lID0gbGluZS5zbGljZShlbmRfb2Zmc2V0ICsgMSk7XG4gICAgLy8gVXBkYXRlIG9mZnNldHNcbiAgICBlbmRfb2Zmc2V0ICs9IGluZGV4O1xuICAgIC8vIEluZGV4IG5vdyBwb2ludHMgdG8gdGhlIGJlZ2lubmluZyBvZiAnbGluZScgd2l0aGluIHRoZSAnb3JpZ2luYWwnIHN0cmluZy5cbiAgICBpbmRleCA9IGVuZF9vZmZzZXQgKyAxO1xuXG4gICAgcmVzdWx0LnB1c2goe1xuICAgICAgdHh0OiBvcmlnaW5hbC5zbGljZShzdGFydF9vZmZzZXQgKyAxLCBlbmRfb2Zmc2V0KSxcbiAgICAgIGNoaWxkcmVuOiBbXSxcbiAgICAgIGF0OiBzdGFydF9vZmZzZXQsXG4gICAgICBlbmQ6IGVuZF9vZmZzZXQsXG4gICAgICB0cDogdHlwZVxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLy8gQ29udmVydCBsaW5lYXIgYXJyYXkgb3Igc3BhbnMgaW50byBhIHRyZWUgcmVwcmVzZW50YXRpb24uXG4vLyBLZWVwIHN0YW5kYWxvbmUgYW5kIG5lc3RlZCBzcGFucywgdGhyb3cgYXdheSBwYXJ0aWFsbHkgb3ZlcmxhcHBpbmcgc3BhbnMuXG5mdW5jdGlvbiB0b1NwYW5UcmVlKHNwYW5zKSB7XG4gIGlmIChzcGFucy5sZW5ndGggPT0gMCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGNvbnN0IHRyZWUgPSBbc3BhbnNbMF1dO1xuICBsZXQgbGFzdCA9IHNwYW5zWzBdO1xuICBmb3IgKGxldCBpID0gMTsgaSA8IHNwYW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgLy8gS2VlcCBzcGFucyB3aGljaCBzdGFydCBhZnRlciB0aGUgZW5kIG9mIHRoZSBwcmV2aW91cyBzcGFuIG9yIHRob3NlIHdoaWNoXG4gICAgLy8gYXJlIGNvbXBsZXRlIHdpdGhpbiB0aGUgcHJldmlvdXMgc3Bhbi5cbiAgICBpZiAoc3BhbnNbaV0uYXQgPiBsYXN0LmVuZCkge1xuICAgICAgLy8gU3BhbiBpcyBjb21wbGV0ZWx5IG91dHNpZGUgb2YgdGhlIHByZXZpb3VzIHNwYW4uXG4gICAgICB0cmVlLnB1c2goc3BhbnNbaV0pO1xuICAgICAgbGFzdCA9IHNwYW5zW2ldO1xuICAgIH0gZWxzZSBpZiAoc3BhbnNbaV0uZW5kIDw9IGxhc3QuZW5kKSB7XG4gICAgICAvLyBTcGFuIGlzIGZ1bGx5IGluc2lkZSBvZiB0aGUgcHJldmlvdXMgc3Bhbi4gUHVzaCB0byBzdWJub2RlLlxuICAgICAgbGFzdC5jaGlsZHJlbi5wdXNoKHNwYW5zW2ldKTtcbiAgICB9XG4gICAgLy8gU3BhbiBjb3VsZCBwYXJ0aWFsbHkgb3ZlcmxhcCwgaWdub3JpbmcgaXQgYXMgaW52YWxpZC5cbiAgfVxuXG4gIC8vIFJlY3Vyc2l2ZWx5IHJlYXJyYW5nZSB0aGUgc3Vibm9kZXMuXG4gIGZvciAobGV0IGkgaW4gdHJlZSkge1xuICAgIHRyZWVbaV0uY2hpbGRyZW4gPSB0b1NwYW5UcmVlKHRyZWVbaV0uY2hpbGRyZW4pO1xuICB9XG5cbiAgcmV0dXJuIHRyZWU7XG59XG5cbi8vIENvbnZlcnQgZHJhZnR5IGRvY3VtZW50IHRvIGEgdHJlZS5cbmZ1bmN0aW9uIGRyYWZ0eVRvVHJlZShkb2MpIHtcbiAgaWYgKCFkb2MpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGRvYyA9ICh0eXBlb2YgZG9jID09ICdzdHJpbmcnKSA/IHtcbiAgICB0eHQ6IGRvY1xuICB9IDogZG9jO1xuICBsZXQge1xuICAgIHR4dCxcbiAgICBmbXQsXG4gICAgZW50XG4gIH0gPSBkb2M7XG5cbiAgdHh0ID0gdHh0IHx8ICcnO1xuICBpZiAoIUFycmF5LmlzQXJyYXkoZW50KSkge1xuICAgIGVudCA9IFtdO1xuICB9XG5cbiAgaWYgKCFBcnJheS5pc0FycmF5KGZtdCkgfHwgZm10Lmxlbmd0aCA9PSAwKSB7XG4gICAgaWYgKGVudC5sZW5ndGggPT0gMCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdGV4dDogdHh0XG4gICAgICB9O1xuICAgIH1cblxuICAgIC8vIEhhbmRsZSBzcGVjaWFsIGNhc2Ugd2hlbiBhbGwgdmFsdWVzIGluIGZtdCBhcmUgMCBhbmQgZm10IHRoZXJlZm9yZSBpcyBza2lwcGVkLlxuICAgIGZtdCA9IFt7XG4gICAgICBhdDogMCxcbiAgICAgIGxlbjogMCxcbiAgICAgIGtleTogMFxuICAgIH1dO1xuICB9XG5cbiAgLy8gU2FuaXRpemUgc3BhbnMuXG4gIGNvbnN0IHNwYW5zID0gW107XG4gIGNvbnN0IGF0dGFjaG1lbnRzID0gW107XG4gIGZtdC5mb3JFYWNoKChzcGFuKSA9PiB7XG4gICAgaWYgKCFzcGFuIHx8IHR5cGVvZiBzcGFuICE9ICdvYmplY3QnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFbJ3VuZGVmaW5lZCcsICdudW1iZXInXS5pbmNsdWRlcyh0eXBlb2Ygc3Bhbi5hdCkpIHtcbiAgICAgIC8vIFByZXNlbnQsIGJ1dCBub24tbnVtZXJpYyAnYXQnLlxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIVsndW5kZWZpbmVkJywgJ251bWJlciddLmluY2x1ZGVzKHR5cGVvZiBzcGFuLmxlbikpIHtcbiAgICAgIC8vIFByZXNlbnQsIGJ1dCBub24tbnVtZXJpYyAnbGVuJy5cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IGF0ID0gc3Bhbi5hdCB8IDA7XG4gICAgbGV0IGxlbiA9IHNwYW4ubGVuIHwgMDtcbiAgICBpZiAobGVuIDwgMCkge1xuICAgICAgLy8gSW52YWxpZCBzcGFuIGxlbmd0aC5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQga2V5ID0gc3Bhbi5rZXkgfHwgMDtcbiAgICBpZiAoZW50Lmxlbmd0aCA+IDAgJiYgKHR5cGVvZiBrZXkgIT0gJ251bWJlcicgfHwga2V5IDwgMCB8fCBrZXkgPj0gZW50Lmxlbmd0aCkpIHtcbiAgICAgIC8vIEludmFsaWQga2V5IHZhbHVlLlxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChhdCA8PSAtMSkge1xuICAgICAgLy8gQXR0YWNobWVudC4gU3RvcmUgYXR0YWNobWVudHMgc2VwYXJhdGVseS5cbiAgICAgIGF0dGFjaG1lbnRzLnB1c2goe1xuICAgICAgICBzdGFydDogLTEsXG4gICAgICAgIGVuZDogMCxcbiAgICAgICAga2V5OiBrZXlcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSBpZiAoYXQgKyBsZW4gPiB0eHQubGVuZ3RoKSB7XG4gICAgICAvLyBTcGFuIGlzIG91dCBvZiBib3VuZHMuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFzcGFuLnRwKSB7XG4gICAgICBpZiAoZW50Lmxlbmd0aCA+IDAgJiYgKHR5cGVvZiBlbnRba2V5XSA9PSAnb2JqZWN0JykpIHtcbiAgICAgICAgc3BhbnMucHVzaCh7XG4gICAgICAgICAgc3RhcnQ6IGF0LFxuICAgICAgICAgIGVuZDogYXQgKyBsZW4sXG4gICAgICAgICAga2V5OiBrZXlcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHNwYW5zLnB1c2goe1xuICAgICAgICB0eXBlOiBzcGFuLnRwLFxuICAgICAgICBzdGFydDogYXQsXG4gICAgICAgIGVuZDogYXQgKyBsZW5cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gU29ydCBzcGFucyBmaXJzdCBieSBzdGFydCBpbmRleCAoYXNjKSB0aGVuIGJ5IGxlbmd0aCAoZGVzYyksIHRoZW4gYnkgd2VpZ2h0LlxuICBzcGFucy5zb3J0KChhLCBiKSA9PiB7XG4gICAgbGV0IGRpZmYgPSBhLnN0YXJ0IC0gYi5zdGFydDtcbiAgICBpZiAoZGlmZiAhPSAwKSB7XG4gICAgICByZXR1cm4gZGlmZjtcbiAgICB9XG4gICAgZGlmZiA9IGIuZW5kIC0gYS5lbmQ7XG4gICAgaWYgKGRpZmYgIT0gMCkge1xuICAgICAgcmV0dXJuIGRpZmY7XG4gICAgfVxuICAgIHJldHVybiBGTVRfV0VJR0hULmluZGV4T2YoYi50eXBlKSAtIEZNVF9XRUlHSFQuaW5kZXhPZihhLnR5cGUpO1xuICB9KTtcblxuICAvLyBNb3ZlIGF0dGFjaG1lbnRzIHRvIHRoZSBlbmQgb2YgdGhlIGxpc3QuXG4gIGlmIChhdHRhY2htZW50cy5sZW5ndGggPiAwKSB7XG4gICAgc3BhbnMucHVzaCguLi5hdHRhY2htZW50cyk7XG4gIH1cblxuICBzcGFucy5mb3JFYWNoKChzcGFuKSA9PiB7XG4gICAgaWYgKGVudC5sZW5ndGggPiAwICYmICFzcGFuLnR5cGUgJiYgZW50W3NwYW4ua2V5XSAmJiB0eXBlb2YgZW50W3NwYW4ua2V5XSA9PSAnb2JqZWN0Jykge1xuICAgICAgc3Bhbi50eXBlID0gZW50W3NwYW4ua2V5XS50cDtcbiAgICAgIHNwYW4uZGF0YSA9IGVudFtzcGFuLmtleV0uZGF0YTtcbiAgICB9XG5cbiAgICAvLyBJcyB0eXBlIHN0aWxsIHVuZGVmaW5lZD8gSGlkZSB0aGUgaW52YWxpZCBlbGVtZW50IVxuICAgIGlmICghc3Bhbi50eXBlKSB7XG4gICAgICBzcGFuLnR5cGUgPSAnSEQnO1xuICAgIH1cbiAgfSk7XG5cbiAgbGV0IHRyZWUgPSBzcGFuc1RvVHJlZSh7fSwgdHh0LCAwLCB0eHQubGVuZ3RoLCBzcGFucyk7XG5cbiAgLy8gRmxhdHRlbiB0cmVlIG5vZGVzLlxuICBjb25zdCBmbGF0dGVuID0gZnVuY3Rpb24obm9kZSkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KG5vZGUuY2hpbGRyZW4pICYmIG5vZGUuY2hpbGRyZW4ubGVuZ3RoID09IDEpIHtcbiAgICAgIC8vIFVud3JhcC5cbiAgICAgIGNvbnN0IGNoaWxkID0gbm9kZS5jaGlsZHJlblswXTtcbiAgICAgIGlmICghbm9kZS50eXBlKSB7XG4gICAgICAgIGNvbnN0IHBhcmVudCA9IG5vZGUucGFyZW50O1xuICAgICAgICBub2RlID0gY2hpbGQ7XG4gICAgICAgIG5vZGUucGFyZW50ID0gcGFyZW50O1xuICAgICAgfSBlbHNlIGlmICghY2hpbGQudHlwZSAmJiAhY2hpbGQuY2hpbGRyZW4pIHtcbiAgICAgICAgbm9kZS50ZXh0ID0gY2hpbGQudGV4dDtcbiAgICAgICAgZGVsZXRlIG5vZGUuY2hpbGRyZW47XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBub2RlO1xuICB9XG4gIHRyZWUgPSB0cmVlVG9wRG93bih0cmVlLCBmbGF0dGVuKTtcblxuICByZXR1cm4gdHJlZTtcbn1cblxuLy8gQWRkIHRyZWUgbm9kZSB0byBhIHBhcmVudCB0cmVlLlxuZnVuY3Rpb24gYWRkTm9kZShwYXJlbnQsIG4pIHtcbiAgaWYgKCFuKSB7XG4gICAgcmV0dXJuIHBhcmVudDtcbiAgfVxuXG4gIGlmICghcGFyZW50LmNoaWxkcmVuKSB7XG4gICAgcGFyZW50LmNoaWxkcmVuID0gW107XG4gIH1cblxuICAvLyBJZiB0ZXh0IGlzIHByZXNlbnQsIG1vdmUgaXQgdG8gYSBzdWJub2RlLlxuICBpZiAocGFyZW50LnRleHQpIHtcbiAgICBwYXJlbnQuY2hpbGRyZW4ucHVzaCh7XG4gICAgICB0ZXh0OiBwYXJlbnQudGV4dCxcbiAgICAgIHBhcmVudDogcGFyZW50XG4gICAgfSk7XG4gICAgZGVsZXRlIHBhcmVudC50ZXh0O1xuICB9XG5cbiAgbi5wYXJlbnQgPSBwYXJlbnQ7XG4gIHBhcmVudC5jaGlsZHJlbi5wdXNoKG4pO1xuXG4gIHJldHVybiBwYXJlbnQ7XG59XG5cbi8vIFJldHVybnMgYSB0cmVlIG9mIG5vZGVzLlxuZnVuY3Rpb24gc3BhbnNUb1RyZWUocGFyZW50LCB0ZXh0LCBzdGFydCwgZW5kLCBzcGFucykge1xuICBpZiAoIXNwYW5zIHx8IHNwYW5zLmxlbmd0aCA9PSAwKSB7XG4gICAgaWYgKHN0YXJ0IDwgZW5kKSB7XG4gICAgICBhZGROb2RlKHBhcmVudCwge1xuICAgICAgICB0ZXh0OiB0ZXh0LnN1YnN0cmluZyhzdGFydCwgZW5kKVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBwYXJlbnQ7XG4gIH1cblxuICAvLyBQcm9jZXNzIHN1YnNwYW5zLlxuICBmb3IgKGxldCBpID0gMDsgaSA8IHNwYW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3Qgc3BhbiA9IHNwYW5zW2ldO1xuICAgIGlmIChzcGFuLnN0YXJ0IDwgMCAmJiBzcGFuLnR5cGUgPT0gJ0VYJykge1xuICAgICAgYWRkTm9kZShwYXJlbnQsIHtcbiAgICAgICAgdHlwZTogc3Bhbi50eXBlLFxuICAgICAgICBkYXRhOiBzcGFuLmRhdGEsXG4gICAgICAgIGtleTogc3Bhbi5rZXksXG4gICAgICAgIGF0dDogdHJ1ZVxuICAgICAgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBBZGQgdW4tc3R5bGVkIHJhbmdlIGJlZm9yZSB0aGUgc3R5bGVkIHNwYW4gc3RhcnRzLlxuICAgIGlmIChzdGFydCA8IHNwYW4uc3RhcnQpIHtcbiAgICAgIGFkZE5vZGUocGFyZW50LCB7XG4gICAgICAgIHRleHQ6IHRleHQuc3Vic3RyaW5nKHN0YXJ0LCBzcGFuLnN0YXJ0KVxuICAgICAgfSk7XG4gICAgICBzdGFydCA9IHNwYW4uc3RhcnQ7XG4gICAgfVxuXG4gICAgLy8gR2V0IGFsbCBzcGFucyB3aGljaCBhcmUgd2l0aGluIHRoZSBjdXJyZW50IHNwYW4uXG4gICAgY29uc3Qgc3Vic3BhbnMgPSBbXTtcbiAgICB3aGlsZSAoaSA8IHNwYW5zLmxlbmd0aCAtIDEpIHtcbiAgICAgIGNvbnN0IGlubmVyID0gc3BhbnNbaSArIDFdO1xuICAgICAgaWYgKGlubmVyLnN0YXJ0IDwgMCkge1xuICAgICAgICAvLyBBdHRhY2htZW50cyBhcmUgaW4gdGhlIGVuZC4gU3RvcC5cbiAgICAgICAgYnJlYWs7XG4gICAgICB9IGVsc2UgaWYgKGlubmVyLnN0YXJ0IDwgc3Bhbi5lbmQpIHtcbiAgICAgICAgaWYgKGlubmVyLmVuZCA8PSBzcGFuLmVuZCkge1xuICAgICAgICAgIGNvbnN0IHRhZyA9IEZPUk1BVF9UQUdTW2lubmVyLnRwXSB8fCB7fTtcbiAgICAgICAgICBpZiAoaW5uZXIuc3RhcnQgPCBpbm5lci5lbmQgfHwgdGFnLmlzVm9pZCkge1xuICAgICAgICAgICAgLy8gVmFsaWQgc3Vic3BhbjogY29tcGxldGVseSB3aXRoaW4gdGhlIGN1cnJlbnQgc3BhbiBhbmRcbiAgICAgICAgICAgIC8vIGVpdGhlciBub24temVybyBsZW5ndGggb3IgemVybyBsZW5ndGggaXMgYWNjZXB0YWJsZS5cbiAgICAgICAgICAgIHN1YnNwYW5zLnB1c2goaW5uZXIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpKys7XG4gICAgICAgIC8vIE92ZXJsYXBwaW5nIHN1YnNwYW5zIGFyZSBpZ25vcmVkLlxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gUGFzdCB0aGUgZW5kIG9mIHRoZSBjdXJyZW50IHNwYW4uIFN0b3AuXG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGFkZE5vZGUocGFyZW50LCBzcGFuc1RvVHJlZSh7XG4gICAgICB0eXBlOiBzcGFuLnR5cGUsXG4gICAgICBkYXRhOiBzcGFuLmRhdGEsXG4gICAgICBrZXk6IHNwYW4ua2V5XG4gICAgfSwgdGV4dCwgc3RhcnQsIHNwYW4uZW5kLCBzdWJzcGFucykpO1xuICAgIHN0YXJ0ID0gc3Bhbi5lbmQ7XG4gIH1cblxuICAvLyBBZGQgdGhlIGxhc3QgdW5mb3JtYXR0ZWQgcmFuZ2UuXG4gIGlmIChzdGFydCA8IGVuZCkge1xuICAgIGFkZE5vZGUocGFyZW50LCB7XG4gICAgICB0ZXh0OiB0ZXh0LnN1YnN0cmluZyhzdGFydCwgZW5kKVxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHBhcmVudDtcbn1cblxuLy8gQXBwZW5kIGEgdHJlZSB0byBhIERyYWZ0eSBkb2MuXG5mdW5jdGlvbiB0cmVlVG9EcmFmdHkoZG9jLCB0cmVlLCBrZXltYXApIHtcbiAgaWYgKCF0cmVlKSB7XG4gICAgcmV0dXJuIGRvYztcbiAgfVxuXG4gIGRvYy50eHQgPSBkb2MudHh0IHx8ICcnO1xuXG4gIC8vIENoZWNrcG9pbnQgdG8gbWVhc3VyZSBsZW5ndGggb2YgdGhlIGN1cnJlbnQgdHJlZSBub2RlLlxuICBjb25zdCBzdGFydCA9IGRvYy50eHQubGVuZ3RoO1xuXG4gIGlmICh0cmVlLnRleHQpIHtcbiAgICBkb2MudHh0ICs9IHRyZWUudGV4dDtcbiAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHRyZWUuY2hpbGRyZW4pKSB7XG4gICAgdHJlZS5jaGlsZHJlbi5mb3JFYWNoKChjKSA9PiB7XG4gICAgICB0cmVlVG9EcmFmdHkoZG9jLCBjLCBrZXltYXApO1xuICAgIH0pO1xuICB9XG5cbiAgaWYgKHRyZWUudHlwZSkge1xuICAgIGNvbnN0IGxlbiA9IGRvYy50eHQubGVuZ3RoIC0gc3RhcnQ7XG4gICAgZG9jLmZtdCA9IGRvYy5mbXQgfHwgW107XG4gICAgaWYgKE9iamVjdC5rZXlzKHRyZWUuZGF0YSB8fCB7fSkubGVuZ3RoID4gMCkge1xuICAgICAgZG9jLmVudCA9IGRvYy5lbnQgfHwgW107XG4gICAgICBjb25zdCBuZXdLZXkgPSAodHlwZW9mIGtleW1hcFt0cmVlLmtleV0gPT0gJ3VuZGVmaW5lZCcpID8gZG9jLmVudC5sZW5ndGggOiBrZXltYXBbdHJlZS5rZXldO1xuICAgICAga2V5bWFwW3RyZWUua2V5XSA9IG5ld0tleTtcbiAgICAgIGRvYy5lbnRbbmV3S2V5XSA9IHtcbiAgICAgICAgdHA6IHRyZWUudHlwZSxcbiAgICAgICAgZGF0YTogdHJlZS5kYXRhXG4gICAgICB9O1xuICAgICAgaWYgKHRyZWUuYXR0KSB7XG4gICAgICAgIC8vIEF0dGFjaG1lbnQuXG4gICAgICAgIGRvYy5mbXQucHVzaCh7XG4gICAgICAgICAgYXQ6IC0xLFxuICAgICAgICAgIGxlbjogMCxcbiAgICAgICAgICBrZXk6IG5ld0tleVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRvYy5mbXQucHVzaCh7XG4gICAgICAgICAgYXQ6IHN0YXJ0LFxuICAgICAgICAgIGxlbjogbGVuLFxuICAgICAgICAgIGtleTogbmV3S2V5XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBkb2MuZm10LnB1c2goe1xuICAgICAgICB0cDogdHJlZS50eXBlLFxuICAgICAgICBhdDogc3RhcnQsXG4gICAgICAgIGxlbjogbGVuXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRvYztcbn1cblxuLy8gVHJhdmVyc2UgdGhlIHRyZWUgdG9wIGRvd24gdHJhbnNmb3JtaW5nIHRoZSBub2RlczogYXBwbHkgdHJhbnNmb3JtZXIgdG8gZXZlcnkgdHJlZSBub2RlLlxuZnVuY3Rpb24gdHJlZVRvcERvd24oc3JjLCB0cmFuc2Zvcm1lciwgY29udGV4dCkge1xuICBpZiAoIXNyYykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgbGV0IGRzdCA9IHRyYW5zZm9ybWVyLmNhbGwoY29udGV4dCwgc3JjKTtcbiAgaWYgKCFkc3QgfHwgIWRzdC5jaGlsZHJlbikge1xuICAgIHJldHVybiBkc3Q7XG4gIH1cblxuICBjb25zdCBjaGlsZHJlbiA9IFtdO1xuICBmb3IgKGxldCBpIGluIGRzdC5jaGlsZHJlbikge1xuICAgIGxldCBuID0gZHN0LmNoaWxkcmVuW2ldO1xuICAgIGlmIChuKSB7XG4gICAgICBuID0gdHJlZVRvcERvd24obiwgdHJhbnNmb3JtZXIsIGNvbnRleHQpO1xuICAgICAgaWYgKG4pIHtcbiAgICAgICAgY2hpbGRyZW4ucHVzaChuKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoY2hpbGRyZW4ubGVuZ3RoID09IDApIHtcbiAgICBkc3QuY2hpbGRyZW4gPSBudWxsO1xuICB9IGVsc2Uge1xuICAgIGRzdC5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICB9XG5cbiAgcmV0dXJuIGRzdDtcbn1cblxuLy8gVHJhdmVyc2UgdGhlIHRyZWUgYm90dG9tLXVwOiBhcHBseSBmb3JtYXR0ZXIgdG8gZXZlcnkgbm9kZS5cbi8vIFRoZSBmb3JtYXR0ZXIgbXVzdCBtYWludGFpbiBpdHMgc3RhdGUgdGhyb3VnaCBjb250ZXh0LlxuZnVuY3Rpb24gdHJlZUJvdHRvbVVwKHNyYywgZm9ybWF0dGVyLCBpbmRleCwgc3RhY2ssIGNvbnRleHQpIHtcbiAgaWYgKCFzcmMpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmIChzdGFjayAmJiBzcmMudHlwZSkge1xuICAgIHN0YWNrLnB1c2goc3JjLnR5cGUpO1xuICB9XG5cbiAgbGV0IHZhbHVlcyA9IFtdO1xuICBmb3IgKGxldCBpIGluIHNyYy5jaGlsZHJlbikge1xuICAgIGNvbnN0IG4gPSB0cmVlQm90dG9tVXAoc3JjLmNoaWxkcmVuW2ldLCBmb3JtYXR0ZXIsIGksIHN0YWNrLCBjb250ZXh0KTtcbiAgICBpZiAobikge1xuICAgICAgdmFsdWVzLnB1c2gobik7XG4gICAgfVxuICB9XG4gIGlmICh2YWx1ZXMubGVuZ3RoID09IDApIHtcbiAgICBpZiAoc3JjLnRleHQpIHtcbiAgICAgIHZhbHVlcyA9IFtzcmMudGV4dF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlcyA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgaWYgKHN0YWNrICYmIHNyYy50eXBlKSB7XG4gICAgc3RhY2sucG9wKCk7XG4gIH1cblxuICByZXR1cm4gZm9ybWF0dGVyLmNhbGwoY29udGV4dCwgc3JjLnR5cGUsIHNyYy5kYXRhLCB2YWx1ZXMsIGluZGV4LCBzdGFjayk7XG59XG5cbi8vIENsaXAgdHJlZSB0byB0aGUgcHJvdmlkZWQgbGltaXQuXG5mdW5jdGlvbiBzaG9ydGVuVHJlZSh0cmVlLCBsaW1pdCwgdGFpbCkge1xuICBpZiAoIXRyZWUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmICh0YWlsKSB7XG4gICAgbGltaXQgLT0gdGFpbC5sZW5ndGg7XG4gIH1cblxuICBjb25zdCBzaG9ydGVuZXIgPSBmdW5jdGlvbihub2RlKSB7XG4gICAgaWYgKGxpbWl0IDw9IC0xKSB7XG4gICAgICAvLyBMaW1pdCAtMSBtZWFucyB0aGUgZG9jIHdhcyBhbHJlYWR5IGNsaXBwZWQuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAobm9kZS5hdHQpIHtcbiAgICAgIC8vIEF0dGFjaG1lbnRzIGFyZSB1bmNoYW5nZWQuXG4gICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG4gICAgaWYgKGxpbWl0ID09IDApIHtcbiAgICAgIG5vZGUudGV4dCA9IHRhaWw7XG4gICAgICBsaW1pdCA9IC0xO1xuICAgIH0gZWxzZSBpZiAobm9kZS50ZXh0KSB7XG4gICAgICBjb25zdCBsZW4gPSBub2RlLnRleHQubGVuZ3RoO1xuICAgICAgaWYgKGxlbiA+IGxpbWl0KSB7XG4gICAgICAgIG5vZGUudGV4dCA9IG5vZGUudGV4dC5zdWJzdHJpbmcoMCwgbGltaXQpICsgdGFpbDtcbiAgICAgICAgbGltaXQgPSAtMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxpbWl0IC09IGxlbjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICByZXR1cm4gdHJlZVRvcERvd24odHJlZSwgc2hvcnRlbmVyKTtcbn1cblxuLy8gU3RyaXAgaGVhdnkgZW50aXRpZXMgZnJvbSBhIHRyZWUuXG5mdW5jdGlvbiBsaWdodEVudGl0eSh0cmVlLCBhbGxvdykge1xuICBjb25zdCBsaWdodENvcHkgPSBub2RlID0+IHtcbiAgICBjb25zdCBkYXRhID0gY29weUVudERhdGEobm9kZS5kYXRhLCB0cnVlLCBhbGxvdyA/IGFsbG93KG5vZGUpIDogbnVsbCk7XG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIG5vZGUuZGF0YSA9IGRhdGE7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSBub2RlLmRhdGE7XG4gICAgfVxuICAgIHJldHVybiBub2RlO1xuICB9XG4gIHJldHVybiB0cmVlVG9wRG93bih0cmVlLCBsaWdodENvcHkpO1xufVxuXG4vLyBSZW1vdmUgc3BhY2VzIGFuZCBicmVha3Mgb24gdGhlIGxlZnQuXG5mdW5jdGlvbiBsVHJpbSh0cmVlKSB7XG4gIGlmICh0cmVlLnR5cGUgPT0gJ0JSJykge1xuICAgIHRyZWUgPSBudWxsO1xuICB9IGVsc2UgaWYgKHRyZWUudGV4dCkge1xuICAgIGlmICghdHJlZS50eXBlKSB7XG4gICAgICB0cmVlLnRleHQgPSB0cmVlLnRleHQudHJpbVN0YXJ0KCk7XG4gICAgICBpZiAoIXRyZWUudGV4dCkge1xuICAgICAgICB0cmVlID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAoIXRyZWUudHlwZSAmJiB0cmVlLmNoaWxkcmVuICYmIHRyZWUuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgIGNvbnN0IGMgPSBsVHJpbSh0cmVlLmNoaWxkcmVuWzBdKTtcbiAgICBpZiAoYykge1xuICAgICAgdHJlZS5jaGlsZHJlblswXSA9IGM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyZWUuY2hpbGRyZW4uc2hpZnQoKTtcbiAgICAgIGlmICghdHJlZS50eXBlICYmIHRyZWUuY2hpbGRyZW4ubGVuZ3RoID09IDApIHtcbiAgICAgICAgdHJlZSA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB0cmVlO1xufVxuXG4vLyBNb3ZlIGF0dGFjaG1lbnRzIHRvIHRoZSBlbmQuIEF0dGFjaG1lbnRzIG11c3QgYmUgYXQgdGhlIHRvcCBsZXZlbCwgbm8gbmVlZCB0byB0cmF2ZXJzZSB0aGUgdHJlZS5cbmZ1bmN0aW9uIGF0dGFjaG1lbnRzVG9FbmQodHJlZSwgbGltaXQpIHtcbiAgaWYgKCF0cmVlKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBpZiAodHJlZS5hdHQpIHtcbiAgICB0cmVlLnRleHQgPSAnICc7XG4gICAgZGVsZXRlIHRyZWUuYXR0O1xuICAgIGRlbGV0ZSB0cmVlLmNoaWxkcmVuO1xuICB9IGVsc2UgaWYgKHRyZWUuY2hpbGRyZW4pIHtcbiAgICBjb25zdCBhdHRhY2htZW50cyA9IFtdO1xuICAgIGNvbnN0IGNoaWxkcmVuID0gW107XG4gICAgZm9yIChsZXQgaSBpbiB0cmVlLmNoaWxkcmVuKSB7XG4gICAgICBjb25zdCBjID0gdHJlZS5jaGlsZHJlbltpXTtcbiAgICAgIGlmIChjLmF0dCkge1xuICAgICAgICBpZiAoYXR0YWNobWVudHMubGVuZ3RoID09IGxpbWl0KSB7XG4gICAgICAgICAgLy8gVG9vIG1hbnkgYXR0YWNobWVudHMgdG8gcHJldmlldztcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYy5kYXRhWydtaW1lJ10gPT0gSlNPTl9NSU1FX1RZUEUpIHtcbiAgICAgICAgICAvLyBKU09OIGF0dGFjaG1lbnRzIGFyZSBub3Qgc2hvd24gaW4gcHJldmlldy5cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlbGV0ZSBjLmF0dDtcbiAgICAgICAgZGVsZXRlIGMuY2hpbGRyZW47XG4gICAgICAgIGMudGV4dCA9ICcgJztcbiAgICAgICAgYXR0YWNobWVudHMucHVzaChjKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNoaWxkcmVuLnB1c2goYyk7XG4gICAgICB9XG4gICAgfVxuICAgIHRyZWUuY2hpbGRyZW4gPSBjaGlsZHJlbi5jb25jYXQoYXR0YWNobWVudHMpO1xuICB9XG4gIHJldHVybiB0cmVlO1xufVxuXG4vLyBHZXQgYSBsaXN0IG9mIGVudGl0aWVzIGZyb20gYSB0ZXh0LlxuZnVuY3Rpb24gZXh0cmFjdEVudGl0aWVzKGxpbmUpIHtcbiAgbGV0IG1hdGNoO1xuICBsZXQgZXh0cmFjdGVkID0gW107XG4gIEVOVElUWV9UWVBFUy5mb3JFYWNoKChlbnRpdHkpID0+IHtcbiAgICB3aGlsZSAoKG1hdGNoID0gZW50aXR5LnJlLmV4ZWMobGluZSkpICE9PSBudWxsKSB7XG4gICAgICBleHRyYWN0ZWQucHVzaCh7XG4gICAgICAgIG9mZnNldDogbWF0Y2hbJ2luZGV4J10sXG4gICAgICAgIGxlbjogbWF0Y2hbMF0ubGVuZ3RoLFxuICAgICAgICB1bmlxdWU6IG1hdGNoWzBdLFxuICAgICAgICBkYXRhOiBlbnRpdHkucGFjayhtYXRjaFswXSksXG4gICAgICAgIHR5cGU6IGVudGl0eS5uYW1lXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG4gIGlmIChleHRyYWN0ZWQubGVuZ3RoID09IDApIHtcbiAgICByZXR1cm4gZXh0cmFjdGVkO1xuICB9XG5cbiAgLy8gUmVtb3ZlIGVudGl0aWVzIGRldGVjdGVkIGluc2lkZSBvdGhlciBlbnRpdGllcywgbGlrZSAjaGFzaHRhZyBpbiBhIFVSTC5cbiAgZXh0cmFjdGVkLnNvcnQoKGEsIGIpID0+IHtcbiAgICByZXR1cm4gYS5vZmZzZXQgLSBiLm9mZnNldDtcbiAgfSk7XG5cbiAgbGV0IGlkeCA9IC0xO1xuICBleHRyYWN0ZWQgPSBleHRyYWN0ZWQuZmlsdGVyKChlbCkgPT4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IChlbC5vZmZzZXQgPiBpZHgpO1xuICAgIGlkeCA9IGVsLm9mZnNldCArIGVsLmxlbjtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9KTtcblxuICByZXR1cm4gZXh0cmFjdGVkO1xufVxuXG4vLyBDb252ZXJ0IHRoZSBjaHVua3MgaW50byBmb3JtYXQgc3VpdGFibGUgZm9yIHNlcmlhbGl6YXRpb24uXG5mdW5jdGlvbiBkcmFmdGlmeShjaHVua3MsIHN0YXJ0QXQpIHtcbiAgbGV0IHBsYWluID0gJyc7XG4gIGxldCByYW5nZXMgPSBbXTtcbiAgZm9yIChsZXQgaSBpbiBjaHVua3MpIHtcbiAgICBjb25zdCBjaHVuayA9IGNodW5rc1tpXTtcbiAgICBpZiAoIWNodW5rLnR4dCkge1xuICAgICAgY29uc3QgZHJhZnR5ID0gZHJhZnRpZnkoY2h1bmsuY2hpbGRyZW4sIHBsYWluLmxlbmd0aCArIHN0YXJ0QXQpO1xuICAgICAgY2h1bmsudHh0ID0gZHJhZnR5LnR4dDtcbiAgICAgIHJhbmdlcyA9IHJhbmdlcy5jb25jYXQoZHJhZnR5LmZtdCk7XG4gICAgfVxuXG4gICAgaWYgKGNodW5rLnRwKSB7XG4gICAgICByYW5nZXMucHVzaCh7XG4gICAgICAgIGF0OiBwbGFpbi5sZW5ndGggKyBzdGFydEF0LFxuICAgICAgICBsZW46IGNodW5rLnR4dC5sZW5ndGgsXG4gICAgICAgIHRwOiBjaHVuay50cFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcGxhaW4gKz0gY2h1bmsudHh0O1xuICB9XG4gIHJldHVybiB7XG4gICAgdHh0OiBwbGFpbixcbiAgICBmbXQ6IHJhbmdlc1xuICB9O1xufVxuXG4vLyBDcmVhdGUgYSBjb3B5IG9mIGVudGl0eSBkYXRhIHdpdGggKGxpZ2h0PWZhbHNlKSBvciB3aXRob3V0IChsaWdodD10cnVlKSB0aGUgbGFyZ2UgcGF5bG9hZC5cbi8vIFRoZSBhcnJheSAnYWxsb3cnIGNvbnRhaW5zIGEgbGlzdCBvZiBmaWVsZHMgZXhlbXB0IGZyb20gc3RyaXBwaW5nLlxuZnVuY3Rpb24gY29weUVudERhdGEoZGF0YSwgbGlnaHQsIGFsbG93KSB7XG4gIGlmIChkYXRhICYmIE9iamVjdC5lbnRyaWVzKGRhdGEpLmxlbmd0aCA+IDApIHtcbiAgICBhbGxvdyA9IGFsbG93IHx8IFtdO1xuICAgIGNvbnN0IGRjID0ge307XG4gICAgQUxMT1dFRF9FTlRfRklFTERTLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIGlmIChkYXRhW2tleV0pIHtcbiAgICAgICAgaWYgKGxpZ2h0ICYmICFhbGxvdy5pbmNsdWRlcyhrZXkpICYmXG4gICAgICAgICAgKHR5cGVvZiBkYXRhW2tleV0gPT0gJ3N0cmluZycgfHwgQXJyYXkuaXNBcnJheShkYXRhW2tleV0pKSAmJlxuICAgICAgICAgIGRhdGFba2V5XS5sZW5ndGggPiBNQVhfUFJFVklFV19EQVRBX1NJWkUpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBkYXRhW2tleV0gPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZGNba2V5XSA9IGRhdGFba2V5XTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChPYmplY3QuZW50cmllcyhkYykubGVuZ3RoICE9IDApIHtcbiAgICAgIHJldHVybiBkYztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbmlmICh0eXBlb2YgbW9kdWxlICE9ICd1bmRlZmluZWQnKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gRHJhZnR5O1xufVxuIiwiLyoqXG4gKiBAZmlsZSBVdGlsaXRpZXMgZm9yIHVwbG9hZGluZyBhbmQgZG93bmxvYWRpbmcgZmlsZXMuXG4gKlxuICogQGNvcHlyaWdodCAyMDE1LTIwMjIgVGlub2RlIExMQy5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgQ29tbUVycm9yIGZyb20gJy4vY29tbS1lcnJvci5qcyc7XG5pbXBvcnQge1xuICBpc1VybFJlbGF0aXZlLFxuICBqc29uUGFyc2VIZWxwZXJcbn0gZnJvbSAnLi91dGlscy5qcyc7XG5cbmxldCBYSFJQcm92aWRlcjtcblxuLyoqXG4gKiBAY2xhc3MgTGFyZ2VGaWxlSGVscGVyIC0gdXRpbGl0aWVzIGZvciB1cGxvYWRpbmcgYW5kIGRvd25sb2FkaW5nIGZpbGVzIG91dCBvZiBiYW5kLlxuICogRG9uJ3QgaW5zdGFudGlhdGUgdGhpcyBjbGFzcyBkaXJlY3RseS4gVXNlIHtUaW5vZGUuZ2V0TGFyZ2VGaWxlSGVscGVyfSBpbnN0ZWFkLlxuICogQG1lbWJlcm9mIFRpbm9kZVxuICpcbiAqIEBwYXJhbSB7VGlub2RlfSB0aW5vZGUgLSB0aGUgbWFpbiBUaW5vZGUgb2JqZWN0LlxuICogQHBhcmFtIHtzdHJpbmd9IHZlcnNpb24gLSBwcm90b2NvbCB2ZXJzaW9uLCBpLmUuICcwJy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGFyZ2VGaWxlSGVscGVyIHtcbiAgY29uc3RydWN0b3IodGlub2RlLCB2ZXJzaW9uKSB7XG4gICAgdGhpcy5fdGlub2RlID0gdGlub2RlO1xuICAgIHRoaXMuX3ZlcnNpb24gPSB2ZXJzaW9uO1xuXG4gICAgdGhpcy5fYXBpS2V5ID0gdGlub2RlLl9hcGlLZXk7XG4gICAgdGhpcy5fYXV0aFRva2VuID0gdGlub2RlLmdldEF1dGhUb2tlbigpO1xuICAgIHRoaXMuX3JlcUlkID0gdGlub2RlLmdldE5leHRVbmlxdWVJZCgpO1xuICAgIHRoaXMueGhyID0gbmV3IFhIUlByb3ZpZGVyKCk7XG5cbiAgICAvLyBQcm9taXNlXG4gICAgdGhpcy50b1Jlc29sdmUgPSBudWxsO1xuICAgIHRoaXMudG9SZWplY3QgPSBudWxsO1xuXG4gICAgLy8gQ2FsbGJhY2tzXG4gICAgdGhpcy5vblByb2dyZXNzID0gbnVsbDtcbiAgICB0aGlzLm9uU3VjY2VzcyA9IG51bGw7XG4gICAgdGhpcy5vbkZhaWx1cmUgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IHVwbG9hZGluZyB0aGUgZmlsZSB0byBhIG5vbi1kZWZhdWx0IGVuZHBvaW50LlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkxhcmdlRmlsZUhlbHBlciNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGJhc2VVcmwgYWx0ZXJuYXRpdmUgYmFzZSBVUkwgb2YgdXBsb2FkIHNlcnZlci5cbiAgICogQHBhcmFtIHtGaWxlfEJsb2J9IGRhdGEgdG8gdXBsb2FkLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gYXZhdGFyRm9yIHRvcGljIG5hbWUgaWYgdGhlIHVwbG9hZCByZXByZXNlbnRzIGFuIGF2YXRhci5cbiAgICogQHBhcmFtIHtDYWxsYmFja30gb25Qcm9ncmVzcyBjYWxsYmFjay4gVGFrZXMgb25lIHtmbG9hdH0gcGFyYW1ldGVyIDAuLjFcbiAgICogQHBhcmFtIHtDYWxsYmFja30gb25TdWNjZXNzIGNhbGxiYWNrLiBDYWxsZWQgd2hlbiB0aGUgZmlsZSBpcyBzdWNjZXNzZnVsbHkgdXBsb2FkZWQuXG4gICAqIEBwYXJhbSB7Q2FsbGJhY2t9IG9uRmFpbHVyZSBjYWxsYmFjay4gQ2FsbGVkIGluIGNhc2Ugb2YgYSBmYWlsdXJlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgdXBsb2FkIGlzIGNvbXBsZXRlZC9mYWlsZWQuXG4gICAqL1xuICB1cGxvYWRXaXRoQmFzZVVybChiYXNlVXJsLCBkYXRhLCBhdmF0YXJGb3IsIG9uUHJvZ3Jlc3MsIG9uU3VjY2Vzcywgb25GYWlsdXJlKSB7XG4gICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzO1xuXG4gICAgbGV0IHVybCA9IGAvdiR7dGhpcy5fdmVyc2lvbn0vZmlsZS91L2A7XG4gICAgaWYgKGJhc2VVcmwpIHtcbiAgICAgIGxldCBiYXNlID0gYmFzZVVybDtcbiAgICAgIGlmIChiYXNlLmVuZHNXaXRoKCcvJykpIHtcbiAgICAgICAgLy8gUmVtb3ZpbmcgdHJhaWxpbmcgc2xhc2guXG4gICAgICAgIGJhc2UgPSBiYXNlLnNsaWNlKDAsIC0xKTtcbiAgICAgIH1cbiAgICAgIGlmIChiYXNlLnN0YXJ0c1dpdGgoJ2h0dHA6Ly8nKSB8fCBiYXNlLnN0YXJ0c1dpdGgoJ2h0dHBzOi8vJykpIHtcbiAgICAgICAgdXJsID0gYmFzZSArIHVybDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBiYXNlIFVSTCAnJHtiYXNlVXJsfSdgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy54aHIub3BlbignUE9TVCcsIHVybCwgdHJ1ZSk7XG4gICAgdGhpcy54aHIuc2V0UmVxdWVzdEhlYWRlcignWC1UaW5vZGUtQVBJS2V5JywgdGhpcy5fYXBpS2V5KTtcbiAgICBpZiAodGhpcy5fYXV0aFRva2VuKSB7XG4gICAgICB0aGlzLnhoci5zZXRSZXF1ZXN0SGVhZGVyKCdYLVRpbm9kZS1BdXRoJywgYFRva2VuICR7dGhpcy5fYXV0aFRva2VuLnRva2VufWApO1xuICAgIH1cbiAgICBjb25zdCByZXN1bHQgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLnRvUmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgICB0aGlzLnRvUmVqZWN0ID0gcmVqZWN0O1xuICAgIH0pO1xuXG4gICAgdGhpcy5vblByb2dyZXNzID0gb25Qcm9ncmVzcztcbiAgICB0aGlzLm9uU3VjY2VzcyA9IG9uU3VjY2VzcztcbiAgICB0aGlzLm9uRmFpbHVyZSA9IG9uRmFpbHVyZTtcblxuICAgIHRoaXMueGhyLnVwbG9hZC5vbnByb2dyZXNzID0gKGUpID0+IHtcbiAgICAgIGlmIChlLmxlbmd0aENvbXB1dGFibGUgJiYgaW5zdGFuY2Uub25Qcm9ncmVzcykge1xuICAgICAgICBpbnN0YW5jZS5vblByb2dyZXNzKGUubG9hZGVkIC8gZS50b3RhbCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMueGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IHBrdDtcbiAgICAgIHRyeSB7XG4gICAgICAgIHBrdCA9IEpTT04ucGFyc2UodGhpcy5yZXNwb25zZSwganNvblBhcnNlSGVscGVyKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBpbnN0YW5jZS5fdGlub2RlLmxvZ2dlcihcIkVSUk9SOiBJbnZhbGlkIHNlcnZlciByZXNwb25zZSBpbiBMYXJnZUZpbGVIZWxwZXJcIiwgdGhpcy5yZXNwb25zZSk7XG4gICAgICAgIHBrdCA9IHtcbiAgICAgICAgICBjdHJsOiB7XG4gICAgICAgICAgICBjb2RlOiB0aGlzLnN0YXR1cyxcbiAgICAgICAgICAgIHRleHQ6IHRoaXMuc3RhdHVzVGV4dFxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuc3RhdHVzID49IDIwMCAmJiB0aGlzLnN0YXR1cyA8IDMwMCkge1xuICAgICAgICBpZiAoaW5zdGFuY2UudG9SZXNvbHZlKSB7XG4gICAgICAgICAgaW5zdGFuY2UudG9SZXNvbHZlKHBrdC5jdHJsLnBhcmFtcy51cmwpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbnN0YW5jZS5vblN1Y2Nlc3MpIHtcbiAgICAgICAgICBpbnN0YW5jZS5vblN1Y2Nlc3MocGt0LmN0cmwpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdHVzID49IDQwMCkge1xuICAgICAgICBpZiAoaW5zdGFuY2UudG9SZWplY3QpIHtcbiAgICAgICAgICBpbnN0YW5jZS50b1JlamVjdChuZXcgQ29tbUVycm9yKHBrdC5jdHJsLnRleHQsIHBrdC5jdHJsLmNvZGUpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5zdGFuY2Uub25GYWlsdXJlKSB7XG4gICAgICAgICAgaW5zdGFuY2Uub25GYWlsdXJlKHBrdC5jdHJsKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5zdGFuY2UuX3Rpbm9kZS5sb2dnZXIoXCJFUlJPUjogVW5leHBlY3RlZCBzZXJ2ZXIgcmVzcG9uc2Ugc3RhdHVzXCIsIHRoaXMuc3RhdHVzLCB0aGlzLnJlc3BvbnNlKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy54aHIub25lcnJvciA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgIGlmIChpbnN0YW5jZS50b1JlamVjdCkge1xuICAgICAgICBpbnN0YW5jZS50b1JlamVjdChlIHx8IG5ldyBFcnJvcihcImZhaWxlZFwiKSk7XG4gICAgICB9XG4gICAgICBpZiAoaW5zdGFuY2Uub25GYWlsdXJlKSB7XG4gICAgICAgIGluc3RhbmNlLm9uRmFpbHVyZShudWxsKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy54aHIub25hYm9ydCA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgIGlmIChpbnN0YW5jZS50b1JlamVjdCkge1xuICAgICAgICBpbnN0YW5jZS50b1JlamVjdChuZXcgRXJyb3IoXCJ1cGxvYWQgY2FuY2VsbGVkIGJ5IHVzZXJcIikpO1xuICAgICAgfVxuICAgICAgaWYgKGluc3RhbmNlLm9uRmFpbHVyZSkge1xuICAgICAgICBpbnN0YW5jZS5vbkZhaWx1cmUobnVsbCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCBmb3JtID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgICBmb3JtLmFwcGVuZCgnZmlsZScsIGRhdGEpO1xuICAgICAgZm9ybS5zZXQoJ2lkJywgdGhpcy5fcmVxSWQpO1xuICAgICAgaWYgKGF2YXRhckZvcikge1xuICAgICAgICBmb3JtLnNldCgndG9waWMnLCBhdmF0YXJGb3IpO1xuICAgICAgfVxuICAgICAgdGhpcy54aHIuc2VuZChmb3JtKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGlmICh0aGlzLnRvUmVqZWN0KSB7XG4gICAgICAgIHRoaXMudG9SZWplY3QoZXJyKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm9uRmFpbHVyZSkge1xuICAgICAgICB0aGlzLm9uRmFpbHVyZShudWxsKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIC8qKlxuICAgKiBTdGFydCB1cGxvYWRpbmcgdGhlIGZpbGUgdG8gZGVmYXVsdCBlbmRwb2ludC5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZS5MYXJnZUZpbGVIZWxwZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7RmlsZXxCbG9ifSBkYXRhIHRvIHVwbG9hZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gYXZhdGFyRm9yIHRvcGljIG5hbWUgaWYgdGhlIHVwbG9hZCByZXByZXNlbnRzIGFuIGF2YXRhci5cbiAgICogQHBhcmFtIHtDYWxsYmFja30gb25Qcm9ncmVzcyBjYWxsYmFjay4gVGFrZXMgb25lIHtmbG9hdH0gcGFyYW1ldGVyIDAuLjFcbiAgICogQHBhcmFtIHtDYWxsYmFja30gb25TdWNjZXNzIGNhbGxiYWNrLiBDYWxsZWQgd2hlbiB0aGUgZmlsZSBpcyBzdWNjZXNzZnVsbHkgdXBsb2FkZWQuXG4gICAqIEBwYXJhbSB7Q2FsbGJhY2t9IG9uRmFpbHVyZSBjYWxsYmFjay4gQ2FsbGVkIGluIGNhc2Ugb2YgYSBmYWlsdXJlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgdXBsb2FkIGlzIGNvbXBsZXRlZC9mYWlsZWQuXG4gICAqL1xuICB1cGxvYWQoZGF0YSwgYXZhdGFyRm9yLCBvblByb2dyZXNzLCBvblN1Y2Nlc3MsIG9uRmFpbHVyZSkge1xuICAgIGNvbnN0IGJhc2VVcmwgPSAodGhpcy5fdGlub2RlLl9zZWN1cmUgPyAnaHR0cHM6Ly8nIDogJ2h0dHA6Ly8nKSArIHRoaXMuX3Rpbm9kZS5faG9zdDtcbiAgICByZXR1cm4gdGhpcy51cGxvYWRXaXRoQmFzZVVybChiYXNlVXJsLCBkYXRhLCBhdmF0YXJGb3IsIG9uUHJvZ3Jlc3MsIG9uU3VjY2Vzcywgb25GYWlsdXJlKTtcbiAgfVxuICAvKipcbiAgICogRG93bmxvYWQgdGhlIGZpbGUgZnJvbSBhIGdpdmVuIFVSTCB1c2luZyBHRVQgcmVxdWVzdC4gVGhpcyBtZXRob2Qgd29ya3Mgd2l0aCB0aGUgVGlub2RlIHNlcnZlciBvbmx5LlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkxhcmdlRmlsZUhlbHBlciNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHJlbGF0aXZlVXJsIC0gVVJMIHRvIGRvd25sb2FkIHRoZSBmaWxlIGZyb20uIE11c3QgYmUgcmVsYXRpdmUgdXJsLCBpLmUuIG11c3Qgbm90IGNvbnRhaW4gdGhlIGhvc3QuXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gZmlsZW5hbWUgLSBmaWxlIG5hbWUgdG8gdXNlIGZvciB0aGUgZG93bmxvYWRlZCBmaWxlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgZG93bmxvYWQgaXMgY29tcGxldGVkL2ZhaWxlZC5cbiAgICovXG4gIGRvd25sb2FkKHJlbGF0aXZlVXJsLCBmaWxlbmFtZSwgbWltZXR5cGUsIG9uUHJvZ3Jlc3MsIG9uRXJyb3IpIHtcbiAgICBpZiAoIWlzVXJsUmVsYXRpdmUocmVsYXRpdmVVcmwpKSB7XG4gICAgICAvLyBBcyBhIHNlY3VyaXR5IG1lYXN1cmUgcmVmdXNlIHRvIGRvd25sb2FkIGZyb20gYW4gYWJzb2x1dGUgVVJMLlxuICAgICAgaWYgKG9uRXJyb3IpIHtcbiAgICAgICAgb25FcnJvcihgVGhlIFVSTCAnJHtyZWxhdGl2ZVVybH0nIG11c3QgYmUgcmVsYXRpdmUsIG5vdCBhYnNvbHV0ZWApO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuX2F1dGhUb2tlbikge1xuICAgICAgaWYgKG9uRXJyb3IpIHtcbiAgICAgICAgb25FcnJvcihcIk11c3QgYXV0aGVudGljYXRlIGZpcnN0XCIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXM7XG4gICAgLy8gR2V0IGRhdGEgYXMgYmxvYiAoc3RvcmVkIGJ5IHRoZSBicm93c2VyIGFzIGEgdGVtcG9yYXJ5IGZpbGUpLlxuICAgIHRoaXMueGhyLm9wZW4oJ0dFVCcsIHJlbGF0aXZlVXJsLCB0cnVlKTtcbiAgICB0aGlzLnhoci5zZXRSZXF1ZXN0SGVhZGVyKCdYLVRpbm9kZS1BUElLZXknLCB0aGlzLl9hcGlLZXkpO1xuICAgIHRoaXMueGhyLnNldFJlcXVlc3RIZWFkZXIoJ1gtVGlub2RlLUF1dGgnLCAnVG9rZW4gJyArIHRoaXMuX2F1dGhUb2tlbi50b2tlbik7XG4gICAgdGhpcy54aHIucmVzcG9uc2VUeXBlID0gJ2Jsb2InO1xuXG4gICAgdGhpcy5vblByb2dyZXNzID0gb25Qcm9ncmVzcztcbiAgICB0aGlzLnhoci5vbnByb2dyZXNzID0gZnVuY3Rpb24oZSkge1xuICAgICAgaWYgKGluc3RhbmNlLm9uUHJvZ3Jlc3MpIHtcbiAgICAgICAgLy8gUGFzc2luZyBlLmxvYWRlZCBpbnN0ZWFkIG9mIGUubG9hZGVkL2UudG90YWwgYmVjYXVzZSBlLnRvdGFsXG4gICAgICAgIC8vIGlzIGFsd2F5cyAwIHdpdGggZ3ppcCBjb21wcmVzc2lvbiBlbmFibGVkIGJ5IHRoZSBzZXJ2ZXIuXG4gICAgICAgIGluc3RhbmNlLm9uUHJvZ3Jlc3MoZS5sb2FkZWQpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCByZXN1bHQgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLnRvUmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgICB0aGlzLnRvUmVqZWN0ID0gcmVqZWN0O1xuICAgIH0pO1xuXG4gICAgLy8gVGhlIGJsb2IgbmVlZHMgdG8gYmUgc2F2ZWQgYXMgZmlsZS4gVGhlcmUgaXMgbm8ga25vd24gd2F5IHRvXG4gICAgLy8gc2F2ZSB0aGUgYmxvYiBhcyBmaWxlIG90aGVyIHRoYW4gdG8gZmFrZSBhIGNsaWNrIG9uIGFuIDxhIGhyZWYuLi4gZG93bmxvYWQ9Li4uPi5cbiAgICB0aGlzLnhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLnN0YXR1cyA9PSAyMDApIHtcbiAgICAgICAgY29uc3QgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgICAgLy8gVVJMLmNyZWF0ZU9iamVjdFVSTCBpcyBub3QgYXZhaWxhYmxlIGluIG5vbi1icm93c2VyIGVudmlyb25tZW50LiBUaGlzIGNhbGwgd2lsbCBmYWlsLlxuICAgICAgICBsaW5rLmhyZWYgPSB3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTChuZXcgQmxvYihbdGhpcy5yZXNwb25zZV0sIHtcbiAgICAgICAgICB0eXBlOiBtaW1ldHlwZVxuICAgICAgICB9KSk7XG4gICAgICAgIGxpbmsuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgbGluay5zZXRBdHRyaWJ1dGUoJ2Rvd25sb2FkJywgZmlsZW5hbWUpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpbmspO1xuICAgICAgICBsaW5rLmNsaWNrKCk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQobGluayk7XG4gICAgICAgIHdpbmRvdy5VUkwucmV2b2tlT2JqZWN0VVJMKGxpbmsuaHJlZik7XG4gICAgICAgIGlmIChpbnN0YW5jZS50b1Jlc29sdmUpIHtcbiAgICAgICAgICBpbnN0YW5jZS50b1Jlc29sdmUoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLnN0YXR1cyA+PSA0MDAgJiYgaW5zdGFuY2UudG9SZWplY3QpIHtcbiAgICAgICAgLy8gVGhlIHRoaXMucmVzcG9uc2VUZXh0IGlzIHVuZGVmaW5lZCwgbXVzdCB1c2UgdGhpcy5yZXNwb25zZSB3aGljaCBpcyBhIGJsb2IuXG4gICAgICAgIC8vIE5lZWQgdG8gY29udmVydCB0aGlzLnJlc3BvbnNlIHRvIEpTT04uIFRoZSBibG9iIGNhbiBvbmx5IGJlIGFjY2Vzc2VkIGJ5IHRoZVxuICAgICAgICAvLyBGaWxlUmVhZGVyLlxuICAgICAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHBrdCA9IEpTT04ucGFyc2UodGhpcy5yZXN1bHQsIGpzb25QYXJzZUhlbHBlcik7XG4gICAgICAgICAgICBpbnN0YW5jZS50b1JlamVjdChuZXcgQ29tbUVycm9yKHBrdC5jdHJsLnRleHQsIHBrdC5jdHJsLmNvZGUpKTtcbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGluc3RhbmNlLl90aW5vZGUubG9nZ2VyKFwiRVJST1I6IEludmFsaWQgc2VydmVyIHJlc3BvbnNlIGluIExhcmdlRmlsZUhlbHBlclwiLCB0aGlzLnJlc3VsdCk7XG4gICAgICAgICAgICBpbnN0YW5jZS50b1JlamVjdChlcnIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcmVhZGVyLnJlYWRBc1RleHQodGhpcy5yZXNwb25zZSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMueGhyLm9uZXJyb3IgPSBmdW5jdGlvbihlKSB7XG4gICAgICBpZiAoaW5zdGFuY2UudG9SZWplY3QpIHtcbiAgICAgICAgaW5zdGFuY2UudG9SZWplY3QobmV3IEVycm9yKFwiZmFpbGVkXCIpKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy54aHIub25hYm9ydCA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKGluc3RhbmNlLnRvUmVqZWN0KSB7XG4gICAgICAgIGluc3RhbmNlLnRvUmVqZWN0KG51bGwpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0cnkge1xuICAgICAgdGhpcy54aHIuc2VuZCgpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgaWYgKHRoaXMudG9SZWplY3QpIHtcbiAgICAgICAgdGhpcy50b1JlamVjdChlcnIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgLyoqXG4gICAqIFRyeSB0byBjYW5jZWwgYW4gb25nb2luZyB1cGxvYWQgb3IgZG93bmxvYWQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTGFyZ2VGaWxlSGVscGVyI1xuICAgKi9cbiAgY2FuY2VsKCkge1xuICAgIGlmICh0aGlzLnhociAmJiB0aGlzLnhoci5yZWFkeVN0YXRlIDwgNCkge1xuICAgICAgdGhpcy54aHIuYWJvcnQoKTtcbiAgICB9XG4gIH1cbiAgLyoqXG4gICAqIEdldCB1bmlxdWUgaWQgb2YgdGhpcyByZXF1ZXN0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkxhcmdlRmlsZUhlbHBlciNcbiAgICpcbiAgICogQHJldHVybnMge3N0cmluZ30gdW5pcXVlIGlkXG4gICAqL1xuICBnZXRJZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fcmVxSWQ7XG4gIH1cbiAgLyoqXG4gICAqIFRvIHVzZSBMYXJnZUZpbGVIZWxwZXIgaW4gYSBub24gYnJvd3NlciBjb250ZXh0LCBzdXBwbHkgWE1MSHR0cFJlcXVlc3QgcHJvdmlkZXIuXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlcm9mIExhcmdlRmlsZUhlbHBlclxuICAgKiBAcGFyYW0geGhyUHJvdmlkZXIgWE1MSHR0cFJlcXVlc3QgcHJvdmlkZXIsIGUuZy4gZm9yIG5vZGUgPGNvZGU+cmVxdWlyZSgneGhyJyk8L2NvZGU+LlxuICAgKi9cbiAgc3RhdGljIHNldE5ldHdvcmtQcm92aWRlcih4aHJQcm92aWRlcikge1xuICAgIFhIUlByb3ZpZGVyID0geGhyUHJvdmlkZXI7XG4gIH1cbn1cbiIsIi8qKlxuICogQGZpbGUgSGVscGVyIGNsYXNzIGZvciBjb25zdHJ1Y3Rpbmcge0BsaW5rIFRpbm9kZS5HZXRRdWVyeX0uXG4gKlxuICogQGNvcHlyaWdodCAyMDE1LTIwMjIgVGlub2RlIExMQy5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEhlbHBlciBjbGFzcyBmb3IgY29uc3RydWN0aW5nIHtAbGluayBUaW5vZGUuR2V0UXVlcnl9LlxuICpcbiAqIEBjbGFzcyBNZXRhR2V0QnVpbGRlclxuICogQG1lbWJlcm9mIFRpbm9kZVxuICpcbiAqIEBwYXJhbSB7VGlub2RlLlRvcGljfSBwYXJlbnQgdG9waWMgd2hpY2ggaW5zdGFudGlhdGVkIHRoaXMgYnVpbGRlci5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWV0YUdldEJ1aWxkZXIge1xuICBjb25zdHJ1Y3RvcihwYXJlbnQpIHtcbiAgICB0aGlzLnRvcGljID0gcGFyZW50O1xuICAgIHRoaXMud2hhdCA9IHt9O1xuICB9XG5cbiAgLy8gR2V0IHRpbWVzdGFtcCBvZiB0aGUgbW9zdCByZWNlbnQgZGVzYyB1cGRhdGUuXG4gICNnZXRfZGVzY19pbXMoKSB7XG4gICAgcmV0dXJuIHRoaXMudG9waWMudXBkYXRlZDtcbiAgfVxuXG4gIC8vIEdldCB0aW1lc3RhbXAgb2YgdGhlIG1vc3QgcmVjZW50IHN1YnMgdXBkYXRlLlxuICAjZ2V0X3N1YnNfaW1zKCkge1xuICAgIGlmICh0aGlzLnRvcGljLmlzUDJQVHlwZSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy4jZ2V0X2Rlc2NfaW1zKCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnRvcGljLl9sYXN0U3Vic1VwZGF0ZTtcbiAgfVxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggbWVzc2FnZXMgd2l0aGluIGV4cGxpY2l0IGxpbWl0cy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXI9fSBzaW5jZSAtIG1lc3NhZ2VzIG5ld2VyIHRoYW4gdGhpcyAoaW5jbHVzaXZlKTtcbiAgICogQHBhcmFtIHtudW1iZXI9fSBiZWZvcmUgLSBvbGRlciB0aGFuIHRoaXMgKGV4Y2x1c2l2ZSlcbiAgICogQHBhcmFtIHtudW1iZXI9fSBsaW1pdCAtIG51bWJlciBvZiBtZXNzYWdlcyB0byBmZXRjaFxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSA8Y29kZT50aGlzPC9jb2RlPiBvYmplY3QuXG4gICAqL1xuICB3aXRoRGF0YShzaW5jZSwgYmVmb3JlLCBsaW1pdCkge1xuICAgIHRoaXMud2hhdFsnZGF0YSddID0ge1xuICAgICAgc2luY2U6IHNpbmNlLFxuICAgICAgYmVmb3JlOiBiZWZvcmUsXG4gICAgICBsaW1pdDogbGltaXRcbiAgICB9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8qKlxuICAgKiBBZGQgcXVlcnkgcGFyYW1ldGVycyB0byBmZXRjaCBtZXNzYWdlcyBuZXdlciB0aGFuIHRoZSBsYXRlc3Qgc2F2ZWQgbWVzc2FnZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXI9fSBsaW1pdCAtIG51bWJlciBvZiBtZXNzYWdlcyB0byBmZXRjaFxuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSA8Y29kZT50aGlzPC9jb2RlPiBvYmplY3QuXG4gICAqL1xuICB3aXRoTGF0ZXJEYXRhKGxpbWl0KSB7XG4gICAgcmV0dXJuIHRoaXMud2l0aERhdGEodGhpcy50b3BpYy5fbWF4U2VxID4gMCA/IHRoaXMudG9waWMuX21heFNlcSArIDEgOiB1bmRlZmluZWQsIHVuZGVmaW5lZCwgbGltaXQpO1xuICB9XG4gIC8qKlxuICAgKiBBZGQgcXVlcnkgcGFyYW1ldGVycyB0byBmZXRjaCBtZXNzYWdlcyBvbGRlciB0aGFuIHRoZSBlYXJsaWVzdCBzYXZlZCBtZXNzYWdlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcj19IGxpbWl0IC0gbWF4aW11bSBudW1iZXIgb2YgbWVzc2FnZXMgdG8gZmV0Y2guXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IDxjb2RlPnRoaXM8L2NvZGU+IG9iamVjdC5cbiAgICovXG4gIHdpdGhFYXJsaWVyRGF0YShsaW1pdCkge1xuICAgIHJldHVybiB0aGlzLndpdGhEYXRhKHVuZGVmaW5lZCwgdGhpcy50b3BpYy5fbWluU2VxID4gMCA/IHRoaXMudG9waWMuX21pblNlcSA6IHVuZGVmaW5lZCwgbGltaXQpO1xuICB9XG4gIC8qKlxuICAgKiBBZGQgcXVlcnkgcGFyYW1ldGVycyB0byBmZXRjaCB0b3BpYyBkZXNjcmlwdGlvbiBpZiBpdCdzIG5ld2VyIHRoYW4gdGhlIGdpdmVuIHRpbWVzdGFtcC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICpcbiAgICogQHBhcmFtIHtEYXRlPX0gaW1zIC0gZmV0Y2ggbWVzc2FnZXMgbmV3ZXIgdGhhbiB0aGlzIHRpbWVzdGFtcC5cbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aERlc2MoaW1zKSB7XG4gICAgdGhpcy53aGF0WydkZXNjJ10gPSB7XG4gICAgICBpbXM6IGltc1xuICAgIH07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIHRvcGljIGRlc2NyaXB0aW9uIGlmIGl0J3MgbmV3ZXIgdGhhbiB0aGUgbGFzdCB1cGRhdGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IDxjb2RlPnRoaXM8L2NvZGU+IG9iamVjdC5cbiAgICovXG4gIHdpdGhMYXRlckRlc2MoKSB7XG4gICAgcmV0dXJuIHRoaXMud2l0aERlc2ModGhpcy4jZ2V0X2Rlc2NfaW1zKCkpO1xuICB9XG4gIC8qKlxuICAgKiBBZGQgcXVlcnkgcGFyYW1ldGVycyB0byBmZXRjaCBzdWJzY3JpcHRpb25zLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge0RhdGU9fSBpbXMgLSBmZXRjaCBzdWJzY3JpcHRpb25zIG1vZGlmaWVkIG1vcmUgcmVjZW50bHkgdGhhbiB0aGlzIHRpbWVzdGFtcFxuICAgKiBAcGFyYW0ge251bWJlcj19IGxpbWl0IC0gbWF4aW11bSBudW1iZXIgb2Ygc3Vic2NyaXB0aW9ucyB0byBmZXRjaC5cbiAgICogQHBhcmFtIHtzdHJpbmc9fSB1c2VyT3JUb3BpYyAtIHVzZXIgSUQgb3IgdG9waWMgbmFtZSB0byBmZXRjaCBmb3IgZmV0Y2hpbmcgb25lIHN1YnNjcmlwdGlvbi5cbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aFN1YihpbXMsIGxpbWl0LCB1c2VyT3JUb3BpYykge1xuICAgIGNvbnN0IG9wdHMgPSB7XG4gICAgICBpbXM6IGltcyxcbiAgICAgIGxpbWl0OiBsaW1pdFxuICAgIH07XG4gICAgaWYgKHRoaXMudG9waWMuZ2V0VHlwZSgpID09ICdtZScpIHtcbiAgICAgIG9wdHMudG9waWMgPSB1c2VyT3JUb3BpYztcbiAgICB9IGVsc2Uge1xuICAgICAgb3B0cy51c2VyID0gdXNlck9yVG9waWM7XG4gICAgfVxuICAgIHRoaXMud2hhdFsnc3ViJ10gPSBvcHRzO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8qKlxuICAgKiBBZGQgcXVlcnkgcGFyYW1ldGVycyB0byBmZXRjaCBhIHNpbmdsZSBzdWJzY3JpcHRpb24uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7RGF0ZT19IGltcyAtIGZldGNoIHN1YnNjcmlwdGlvbnMgbW9kaWZpZWQgbW9yZSByZWNlbnRseSB0aGFuIHRoaXMgdGltZXN0YW1wXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gdXNlck9yVG9waWMgLSB1c2VyIElEIG9yIHRvcGljIG5hbWUgdG8gZmV0Y2ggZm9yIGZldGNoaW5nIG9uZSBzdWJzY3JpcHRpb24uXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IDxjb2RlPnRoaXM8L2NvZGU+IG9iamVjdC5cbiAgICovXG4gIHdpdGhPbmVTdWIoaW1zLCB1c2VyT3JUb3BpYykge1xuICAgIHJldHVybiB0aGlzLndpdGhTdWIoaW1zLCB1bmRlZmluZWQsIHVzZXJPclRvcGljKTtcbiAgfVxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggYSBzaW5nbGUgc3Vic2NyaXB0aW9uIGlmIGl0J3MgYmVlbiB1cGRhdGVkIHNpbmNlIHRoZSBsYXN0IHVwZGF0ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmc9fSB1c2VyT3JUb3BpYyAtIHVzZXIgSUQgb3IgdG9waWMgbmFtZSB0byBmZXRjaCBmb3IgZmV0Y2hpbmcgb25lIHN1YnNjcmlwdGlvbi5cbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aExhdGVyT25lU3ViKHVzZXJPclRvcGljKSB7XG4gICAgcmV0dXJuIHRoaXMud2l0aE9uZVN1Yih0aGlzLnRvcGljLl9sYXN0U3Vic1VwZGF0ZSwgdXNlck9yVG9waWMpO1xuICB9XG4gIC8qKlxuICAgKiBBZGQgcXVlcnkgcGFyYW1ldGVycyB0byBmZXRjaCBzdWJzY3JpcHRpb25zIHVwZGF0ZWQgc2luY2UgdGhlIGxhc3QgdXBkYXRlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcj19IGxpbWl0IC0gbWF4aW11bSBudW1iZXIgb2Ygc3Vic2NyaXB0aW9ucyB0byBmZXRjaC5cbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aExhdGVyU3ViKGxpbWl0KSB7XG4gICAgcmV0dXJuIHRoaXMud2l0aFN1Yih0aGlzLiNnZXRfc3Vic19pbXMoKSwgbGltaXQpO1xuICB9XG4gIC8qKlxuICAgKiBBZGQgcXVlcnkgcGFyYW1ldGVycyB0byBmZXRjaCB0b3BpYyB0YWdzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSA8Y29kZT50aGlzPC9jb2RlPiBvYmplY3QuXG4gICAqL1xuICB3aXRoVGFncygpIHtcbiAgICB0aGlzLndoYXRbJ3RhZ3MnXSA9IHRydWU7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIHVzZXIncyBjcmVkZW50aWFscy4gPGNvZGU+J21lJzwvY29kZT4gdG9waWMgb25seS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aENyZWQoKSB7XG4gICAgaWYgKHRoaXMudG9waWMuZ2V0VHlwZSgpID09ICdtZScpIHtcbiAgICAgIHRoaXMud2hhdFsnY3JlZCddID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50b3BpYy5fdGlub2RlLmxvZ2dlcihcIkVSUk9SOiBJbnZhbGlkIHRvcGljIHR5cGUgZm9yIE1ldGFHZXRCdWlsZGVyOndpdGhDcmVkc1wiLCB0aGlzLnRvcGljLmdldFR5cGUoKSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8qKlxuICAgKiBBZGQgcXVlcnkgcGFyYW1ldGVycyB0byBmZXRjaCBkZWxldGVkIG1lc3NhZ2VzIHdpdGhpbiBleHBsaWNpdCBsaW1pdHMuIEFueS9hbGwgcGFyYW1ldGVycyBjYW4gYmUgbnVsbC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXI9fSBzaW5jZSAtIGlkcyBvZiBtZXNzYWdlcyBkZWxldGVkIHNpbmNlIHRoaXMgJ2RlbCcgaWQgKGluY2x1c2l2ZSlcbiAgICogQHBhcmFtIHtudW1iZXI9fSBsaW1pdCAtIG51bWJlciBvZiBkZWxldGVkIG1lc3NhZ2UgaWRzIHRvIGZldGNoXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IDxjb2RlPnRoaXM8L2NvZGU+IG9iamVjdC5cbiAgICovXG4gIHdpdGhEZWwoc2luY2UsIGxpbWl0KSB7XG4gICAgaWYgKHNpbmNlIHx8IGxpbWl0KSB7XG4gICAgICB0aGlzLndoYXRbJ2RlbCddID0ge1xuICAgICAgICBzaW5jZTogc2luY2UsXG4gICAgICAgIGxpbWl0OiBsaW1pdFxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIG1lc3NhZ2VzIGRlbGV0ZWQgYWZ0ZXIgdGhlIHNhdmVkIDxjb2RlPidkZWwnPC9jb2RlPiBpZC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXI9fSBsaW1pdCAtIG51bWJlciBvZiBkZWxldGVkIG1lc3NhZ2UgaWRzIHRvIGZldGNoXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IDxjb2RlPnRoaXM8L2NvZGU+IG9iamVjdC5cbiAgICovXG4gIHdpdGhMYXRlckRlbChsaW1pdCkge1xuICAgIC8vIFNwZWNpZnkgJ3NpbmNlJyBvbmx5IGlmIHdlIGhhdmUgYWxyZWFkeSByZWNlaXZlZCBzb21lIG1lc3NhZ2VzLiBJZlxuICAgIC8vIHdlIGhhdmUgbm8gbG9jYWxseSBjYWNoZWQgbWVzc2FnZXMgdGhlbiB3ZSBkb24ndCBjYXJlIGlmIGFueSBtZXNzYWdlcyB3ZXJlIGRlbGV0ZWQuXG4gICAgcmV0dXJuIHRoaXMud2l0aERlbCh0aGlzLnRvcGljLl9tYXhTZXEgPiAwID8gdGhpcy50b3BpYy5fbWF4RGVsICsgMSA6IHVuZGVmaW5lZCwgbGltaXQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4dHJhY3Qgc3VicXVlcnk6IGdldCBhbiBvYmplY3QgdGhhdCBjb250YWlucyBzcGVjaWZpZWQgc3VicXVlcnkuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB3aGF0IC0gc3VicXVlcnkgdG8gcmV0dXJuOiBvbmUgb2YgJ2RhdGEnLCAnc3ViJywgJ2Rlc2MnLCAndGFncycsICdjcmVkJywgJ2RlbCcuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IHJlcXVlc3RlZCBzdWJxdWVyeSBvciA8Y29kZT51bmRlZmluZWQ8L2NvZGU+LlxuICAgKi9cbiAgZXh0cmFjdCh3aGF0KSB7XG4gICAgcmV0dXJuIHRoaXMud2hhdFt3aGF0XTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3QgcGFyYW1ldGVycy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5HZXRRdWVyeX0gR2V0IHF1ZXJ5XG4gICAqL1xuICBidWlsZCgpIHtcbiAgICBjb25zdCB3aGF0ID0gW107XG4gICAgbGV0IHBhcmFtcyA9IHt9O1xuICAgIFsnZGF0YScsICdzdWInLCAnZGVzYycsICd0YWdzJywgJ2NyZWQnLCAnZGVsJ10uZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICBpZiAodGhpcy53aGF0Lmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgd2hhdC5wdXNoKGtleSk7XG4gICAgICAgIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0aGlzLndoYXRba2V5XSkubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHBhcmFtc1trZXldID0gdGhpcy53aGF0W2tleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAod2hhdC5sZW5ndGggPiAwKSB7XG4gICAgICBwYXJhbXMud2hhdCA9IHdoYXQuam9pbignICcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJhbXMgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiBwYXJhbXM7XG4gIH1cbn1cbiIsIi8qKlxuICogQG1vZHVsZSB0aW5vZGUtc2RrXG4gKlxuICogQGNvcHlyaWdodCAyMDE1LTIwMjIgVGlub2RlIExMQy5cbiAqIEBzdW1tYXJ5IEphdmFzY3JpcHQgYmluZGluZ3MgZm9yIFRpbm9kZS5cbiAqIEBsaWNlbnNlIEFwYWNoZSAyLjBcbiAqIEB2ZXJzaW9uIDAuMjBcbiAqXG4gKiBTZWUgPGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS90aW5vZGUvd2ViYXBwXCI+aHR0cHM6Ly9naXRodWIuY29tL3Rpbm9kZS93ZWJhcHA8L2E+IGZvciByZWFsLWxpZmUgdXNhZ2UuXG4gKlxuICogQGV4YW1wbGVcbiAqIDxoZWFkPlxuICogPHNjcmlwdCBzcmM9XCIuLi4vdGlub2RlLmpzXCI+PC9zY3JpcHQ+XG4gKiA8L2hlYWQ+XG4gKlxuICogPGJvZHk+XG4gKiAgLi4uXG4gKiA8c2NyaXB0PlxuICogIC8vIEluc3RhbnRpYXRlIHRpbm9kZS5cbiAqICBjb25zdCB0aW5vZGUgPSBuZXcgVGlub2RlKGNvbmZpZywgXyA9PiB7XG4gKiAgICAvLyBDYWxsZWQgb24gaW5pdCBjb21wbGV0aW9uLlxuICogIH0pO1xuICogIHRpbm9kZS5lbmFibGVMb2dnaW5nKHRydWUpO1xuICogIHRpbm9kZS5vbkRpc2Nvbm5lY3QgPSBlcnIgPT4ge1xuICogICAgLy8gSGFuZGxlIGRpc2Nvbm5lY3QuXG4gKiAgfTtcbiAqICAvLyBDb25uZWN0IHRvIHRoZSBzZXJ2ZXIuXG4gKiAgdGlub2RlLmNvbm5lY3QoJ2h0dHBzOi8vZXhhbXBsZS5jb20vJykudGhlbihfID0+IHtcbiAqICAgIC8vIENvbm5lY3RlZC4gTG9naW4gbm93LlxuICogICAgcmV0dXJuIHRpbm9kZS5sb2dpbkJhc2ljKGxvZ2luLCBwYXNzd29yZCk7XG4gKiAgfSkudGhlbihjdHJsID0+IHtcbiAqICAgIC8vIExvZ2dlZCBpbiBmaW5lLCBhdHRhY2ggY2FsbGJhY2tzLCBzdWJzY3JpYmUgdG8gJ21lJy5cbiAqICAgIGNvbnN0IG1lID0gdGlub2RlLmdldE1lVG9waWMoKTtcbiAqICAgIG1lLm9uTWV0YURlc2MgPSBmdW5jdGlvbihtZXRhKSB7IC4uLiB9O1xuICogICAgLy8gU3Vic2NyaWJlLCBmZXRjaCB0b3BpYyBkZXNjcmlwdGlvbiBhbmQgdGhlIGxpc3Qgb2YgY29udGFjdHMuXG4gKiAgICBtZS5zdWJzY3JpYmUoe2dldDoge2Rlc2M6IHt9LCBzdWI6IHt9fX0pO1xuICogIH0pLmNhdGNoKGVyciA9PiB7XG4gKiAgICAvLyBMb2dpbiBvciBzdWJzY3JpcHRpb24gZmFpbGVkLCBkbyBzb21ldGhpbmcuXG4gKiAgICAuLi5cbiAqICB9KTtcbiAqICAuLi5cbiAqIDwvc2NyaXB0PlxuICogPC9ib2R5PlxuICovXG4ndXNlIHN0cmljdCc7XG5cbi8vIE5PVEUgVE8gREVWRUxPUEVSUzpcbi8vIExvY2FsaXphYmxlIHN0cmluZ3Mgc2hvdWxkIGJlIGRvdWJsZSBxdW90ZWQgXCLRgdGC0YDQvtC60LAg0L3QsCDQtNGA0YPQs9C+0Lwg0Y/Qt9GL0LrQtVwiLFxuLy8gbm9uLWxvY2FsaXphYmxlIHN0cmluZ3Mgc2hvdWxkIGJlIHNpbmdsZSBxdW90ZWQgJ25vbi1sb2NhbGl6ZWQnLlxuXG5pbXBvcnQgQWNjZXNzTW9kZSBmcm9tICcuL2FjY2Vzcy1tb2RlLmpzJztcbmltcG9ydCAqIGFzIENvbnN0IGZyb20gJy4vY29uZmlnLmpzJztcbmltcG9ydCBDb21tRXJyb3IgZnJvbSAnLi9jb21tLWVycm9yLmpzJztcbmltcG9ydCBDb25uZWN0aW9uIGZyb20gJy4vY29ubmVjdGlvbi5qcyc7XG5pbXBvcnQgREJDYWNoZSBmcm9tICcuL2RiLmpzJztcbmltcG9ydCBEcmFmdHkgZnJvbSAnLi9kcmFmdHkuanMnO1xuaW1wb3J0IExhcmdlRmlsZUhlbHBlciBmcm9tICcuL2xhcmdlLWZpbGUuanMnO1xuaW1wb3J0IE1ldGFHZXRCdWlsZGVyIGZyb20gJy4vbWV0YS1idWlsZGVyLmpzJztcbmltcG9ydCB7XG4gIFRvcGljLFxuICBUb3BpY01lLFxuICBUb3BpY0ZuZFxufSBmcm9tICcuL3RvcGljLmpzJztcblxuaW1wb3J0IHtcbiAgaXNVcmxSZWxhdGl2ZSxcbiAganNvblBhcnNlSGVscGVyLFxuICBtZXJnZU9iaixcbiAgcmZjMzMzOURhdGVTdHJpbmcsXG4gIHNpbXBsaWZ5XG59IGZyb20gJy4vdXRpbHMuanMnO1xuXG4vLyBSZS1leHBvcnQgQWNjZXNzTW9kZVxuZXhwb3J0IHtcbiAgQWNjZXNzTW9kZVxufTtcblxubGV0IFdlYlNvY2tldFByb3ZpZGVyO1xuaWYgKHR5cGVvZiBXZWJTb2NrZXQgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgV2ViU29ja2V0UHJvdmlkZXIgPSBXZWJTb2NrZXQ7XG59XG5cbmxldCBYSFJQcm92aWRlcjtcbmlmICh0eXBlb2YgWE1MSHR0cFJlcXVlc3QgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgWEhSUHJvdmlkZXIgPSBYTUxIdHRwUmVxdWVzdDtcbn1cblxubGV0IEluZGV4ZWREQlByb3ZpZGVyO1xuaWYgKHR5cGVvZiBpbmRleGVkREIgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgSW5kZXhlZERCUHJvdmlkZXIgPSBpbmRleGVkREI7XG59XG5cbi8vIFJlLWV4cG9ydCBEcmFmdHkuXG5leHBvcnQge1xuICBEcmFmdHlcbn1cblxuaW5pdEZvck5vbkJyb3dzZXJBcHAoKTtcblxuLy8gVXRpbGl0eSBmdW5jdGlvbnNcblxuLy8gUG9seWZpbGwgZm9yIG5vbi1icm93c2VyIGNvbnRleHQsIGUuZy4gTm9kZUpzLlxuZnVuY3Rpb24gaW5pdEZvck5vbkJyb3dzZXJBcHAoKSB7XG4gIC8vIFRpbm9kZSByZXF1aXJlbWVudCBpbiBuYXRpdmUgbW9kZSBiZWNhdXNlIHJlYWN0IG5hdGl2ZSBkb2Vzbid0IHByb3ZpZGUgQmFzZTY0IG1ldGhvZFxuICBjb25zdCBjaGFycyA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvPSc7XG5cbiAgaWYgKHR5cGVvZiBidG9hID09ICd1bmRlZmluZWQnKSB7XG4gICAgZ2xvYmFsLmJ0b2EgPSBmdW5jdGlvbihpbnB1dCA9ICcnKSB7XG4gICAgICBsZXQgc3RyID0gaW5wdXQ7XG4gICAgICBsZXQgb3V0cHV0ID0gJyc7XG5cbiAgICAgIGZvciAobGV0IGJsb2NrID0gMCwgY2hhckNvZGUsIGkgPSAwLCBtYXAgPSBjaGFyczsgc3RyLmNoYXJBdChpIHwgMCkgfHwgKG1hcCA9ICc9JywgaSAlIDEpOyBvdXRwdXQgKz0gbWFwLmNoYXJBdCg2MyAmIGJsb2NrID4+IDggLSBpICUgMSAqIDgpKSB7XG5cbiAgICAgICAgY2hhckNvZGUgPSBzdHIuY2hhckNvZGVBdChpICs9IDMgLyA0KTtcblxuICAgICAgICBpZiAoY2hhckNvZGUgPiAweEZGKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiJ2J0b2EnIGZhaWxlZDogVGhlIHN0cmluZyB0byBiZSBlbmNvZGVkIGNvbnRhaW5zIGNoYXJhY3RlcnMgb3V0c2lkZSBvZiB0aGUgTGF0aW4xIHJhbmdlLlwiKTtcbiAgICAgICAgfVxuICAgICAgICBibG9jayA9IGJsb2NrIDw8IDggfCBjaGFyQ29kZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9O1xuICB9XG5cbiAgaWYgKHR5cGVvZiBhdG9iID09ICd1bmRlZmluZWQnKSB7XG4gICAgZ2xvYmFsLmF0b2IgPSBmdW5jdGlvbihpbnB1dCA9ICcnKSB7XG4gICAgICBsZXQgc3RyID0gaW5wdXQucmVwbGFjZSgvPSskLywgJycpO1xuICAgICAgbGV0IG91dHB1dCA9ICcnO1xuXG4gICAgICBpZiAoc3RyLmxlbmd0aCAlIDQgPT0gMSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCInYXRvYicgZmFpbGVkOiBUaGUgc3RyaW5nIHRvIGJlIGRlY29kZWQgaXMgbm90IGNvcnJlY3RseSBlbmNvZGVkLlwiKTtcbiAgICAgIH1cbiAgICAgIGZvciAobGV0IGJjID0gMCwgYnMgPSAwLCBidWZmZXIsIGkgPSAwOyBidWZmZXIgPSBzdHIuY2hhckF0KGkrKyk7XG5cbiAgICAgICAgfmJ1ZmZlciAmJiAoYnMgPSBiYyAlIDQgPyBicyAqIDY0ICsgYnVmZmVyIDogYnVmZmVyLFxuICAgICAgICAgIGJjKysgJSA0KSA/IG91dHB1dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDI1NSAmIGJzID4+ICgtMiAqIGJjICYgNikpIDogMFxuICAgICAgKSB7XG4gICAgICAgIGJ1ZmZlciA9IGNoYXJzLmluZGV4T2YoYnVmZmVyKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9O1xuICB9XG5cbiAgaWYgKHR5cGVvZiB3aW5kb3cgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBnbG9iYWwud2luZG93ID0ge1xuICAgICAgV2ViU29ja2V0OiBXZWJTb2NrZXRQcm92aWRlcixcbiAgICAgIFhNTEh0dHBSZXF1ZXN0OiBYSFJQcm92aWRlcixcbiAgICAgIGluZGV4ZWREQjogSW5kZXhlZERCUHJvdmlkZXIsXG4gICAgICBVUkw6IHtcbiAgICAgICAgY3JlYXRlT2JqZWN0VVJMOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmFibGUgdG8gdXNlIFVSTC5jcmVhdGVPYmplY3RVUkwgaW4gYSBub24tYnJvd3NlciBhcHBsaWNhdGlvblwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIENvbm5lY3Rpb24uc2V0TmV0d29ya1Byb3ZpZGVycyhXZWJTb2NrZXRQcm92aWRlciwgWEhSUHJvdmlkZXIpO1xuICBMYXJnZUZpbGVIZWxwZXIuc2V0TmV0d29ya1Byb3ZpZGVyKFhIUlByb3ZpZGVyKTtcbiAgREJDYWNoZS5zZXREYXRhYmFzZVByb3ZpZGVyKEluZGV4ZWREQlByb3ZpZGVyKTtcbn1cblxuLy8gRGV0ZWN0IGZpbmQgbW9zdCB1c2VmdWwgbmV0d29yayB0cmFuc3BvcnQuXG5mdW5jdGlvbiBkZXRlY3RUcmFuc3BvcnQoKSB7XG4gIGlmICh0eXBlb2Ygd2luZG93ID09ICdvYmplY3QnKSB7XG4gICAgaWYgKHdpbmRvd1snV2ViU29ja2V0J10pIHtcbiAgICAgIHJldHVybiAnd3MnO1xuICAgIH0gZWxzZSBpZiAod2luZG93WydYTUxIdHRwUmVxdWVzdCddKSB7XG4gICAgICAvLyBUaGUgYnJvd3NlciBvciBub2RlIGhhcyBubyB3ZWJzb2NrZXRzLCB1c2luZyBsb25nIHBvbGxpbmcuXG4gICAgICByZXR1cm4gJ2xwJztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8vIGJ0b2EgcmVwbGFjZW1lbnQuIFN0b2NrIGJ0b2EgZmFpbHMgb24gb24gbm9uLUxhdGluMSBzdHJpbmdzLlxuZnVuY3Rpb24gYjY0RW5jb2RlVW5pY29kZShzdHIpIHtcbiAgLy8gVGhlIGVuY29kZVVSSUNvbXBvbmVudCBwZXJjZW50LWVuY29kZXMgVVRGLTggc3RyaW5nLFxuICAvLyB0aGVuIHRoZSBwZXJjZW50IGVuY29kaW5nIGlzIGNvbnZlcnRlZCBpbnRvIHJhdyBieXRlcyB3aGljaFxuICAvLyBjYW4gYmUgZmVkIGludG8gYnRvYS5cbiAgcmV0dXJuIGJ0b2EoZW5jb2RlVVJJQ29tcG9uZW50KHN0cikucmVwbGFjZSgvJShbMC05QS1GXXsyfSkvZyxcbiAgICBmdW5jdGlvbiB0b1NvbGlkQnl0ZXMobWF0Y2gsIHAxKSB7XG4gICAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSgnMHgnICsgcDEpO1xuICAgIH0pKTtcbn1cblxuLy8gSlNPTiBzdHJpbmdpZnkgaGVscGVyIC0gcHJlLXByb2Nlc3NvciBmb3IgSlNPTi5zdHJpbmdpZnlcbmZ1bmN0aW9uIGpzb25CdWlsZEhlbHBlcihrZXksIHZhbCkge1xuICBpZiAodmFsIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgIC8vIENvbnZlcnQgamF2YXNjcmlwdCBEYXRlIG9iamVjdHMgdG8gcmZjMzMzOSBzdHJpbmdzXG4gICAgdmFsID0gcmZjMzMzOURhdGVTdHJpbmcodmFsKTtcbiAgfSBlbHNlIGlmICh2YWwgaW5zdGFuY2VvZiBBY2Nlc3NNb2RlKSB7XG4gICAgdmFsID0gdmFsLmpzb25IZWxwZXIoKTtcbiAgfSBlbHNlIGlmICh2YWwgPT09IHVuZGVmaW5lZCB8fCB2YWwgPT09IG51bGwgfHwgdmFsID09PSBmYWxzZSB8fFxuICAgIChBcnJheS5pc0FycmF5KHZhbCkgJiYgdmFsLmxlbmd0aCA9PSAwKSB8fFxuICAgICgodHlwZW9mIHZhbCA9PSAnb2JqZWN0JykgJiYgKE9iamVjdC5rZXlzKHZhbCkubGVuZ3RoID09IDApKSkge1xuICAgIC8vIHN0cmlwIG91dCBlbXB0eSBlbGVtZW50cyB3aGlsZSBzZXJpYWxpemluZyBvYmplY3RzIHRvIEpTT05cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgcmV0dXJuIHZhbDtcbn07XG5cbi8vIFRyaW1zIHZlcnkgbG9uZyBzdHJpbmdzIChlbmNvZGVkIGltYWdlcykgdG8gbWFrZSBsb2dnZWQgcGFja2V0cyBtb3JlIHJlYWRhYmxlLlxuZnVuY3Rpb24ganNvbkxvZ2dlckhlbHBlcihrZXksIHZhbCkge1xuICBpZiAodHlwZW9mIHZhbCA9PSAnc3RyaW5nJyAmJiB2YWwubGVuZ3RoID4gMTI4KSB7XG4gICAgcmV0dXJuICc8JyArIHZhbC5sZW5ndGggKyAnLCBieXRlczogJyArIHZhbC5zdWJzdHJpbmcoMCwgMTIpICsgJy4uLicgKyB2YWwuc3Vic3RyaW5nKHZhbC5sZW5ndGggLSAxMikgKyAnPic7XG4gIH1cbiAgcmV0dXJuIGpzb25CdWlsZEhlbHBlcihrZXksIHZhbCk7XG59O1xuXG4vLyBQYXJzZSBicm93c2VyIHVzZXIgYWdlbnQgdG8gZXh0cmFjdCBicm93c2VyIG5hbWUgYW5kIHZlcnNpb24uXG5mdW5jdGlvbiBnZXRCcm93c2VySW5mbyh1YSwgcHJvZHVjdCkge1xuICB1YSA9IHVhIHx8ICcnO1xuICBsZXQgcmVhY3RuYXRpdmUgPSAnJztcbiAgLy8gQ2hlY2sgaWYgdGhpcyBpcyBhIFJlYWN0TmF0aXZlIGFwcC5cbiAgaWYgKC9yZWFjdG5hdGl2ZS9pLnRlc3QocHJvZHVjdCkpIHtcbiAgICByZWFjdG5hdGl2ZSA9ICdSZWFjdE5hdGl2ZTsgJztcbiAgfVxuICBsZXQgcmVzdWx0O1xuICAvLyBSZW1vdmUgdXNlbGVzcyBzdHJpbmcuXG4gIHVhID0gdWEucmVwbGFjZSgnIChLSFRNTCwgbGlrZSBHZWNrbyknLCAnJyk7XG4gIC8vIFRlc3QgZm9yIFdlYktpdC1iYXNlZCBicm93c2VyLlxuICBsZXQgbSA9IHVhLm1hdGNoKC8oQXBwbGVXZWJLaXRcXC9bLlxcZF0rKS9pKTtcbiAgaWYgKG0pIHtcbiAgICAvLyBMaXN0IG9mIGNvbW1vbiBzdHJpbmdzLCBmcm9tIG1vcmUgdXNlZnVsIHRvIGxlc3MgdXNlZnVsLlxuICAgIC8vIEFsbCB1bmtub3duIHN0cmluZ3MgZ2V0IHRoZSBoaWdoZXN0ICgtMSkgcHJpb3JpdHkuXG4gICAgY29uc3QgcHJpb3JpdHkgPSBbJ2VkZycsICdjaHJvbWUnLCAnc2FmYXJpJywgJ21vYmlsZScsICd2ZXJzaW9uJ107XG4gICAgbGV0IHRtcCA9IHVhLnN1YnN0cihtLmluZGV4ICsgbVswXS5sZW5ndGgpLnNwbGl0KCcgJyk7XG4gICAgbGV0IHRva2VucyA9IFtdO1xuICAgIGxldCB2ZXJzaW9uOyAvLyAxLjAgaW4gVmVyc2lvbi8xLjAgb3IgdW5kZWZpbmVkO1xuICAgIC8vIFNwbGl0IHN0cmluZyBsaWtlICdOYW1lLzAuMC4wJyBpbnRvIFsnTmFtZScsICcwLjAuMCcsIDNdIHdoZXJlIHRoZSBsYXN0IGVsZW1lbnQgaXMgdGhlIHByaW9yaXR5LlxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG1wLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgbTIgPSAvKFtcXHcuXSspW1xcL10oW1xcLlxcZF0rKS8uZXhlYyh0bXBbaV0pO1xuICAgICAgaWYgKG0yKSB7XG4gICAgICAgIC8vIFVua25vd24gdmFsdWVzIGFyZSBoaWdoZXN0IHByaW9yaXR5ICgtMSkuXG4gICAgICAgIHRva2Vucy5wdXNoKFttMlsxXSwgbTJbMl0sIHByaW9yaXR5LmZpbmRJbmRleCgoZSkgPT4ge1xuICAgICAgICAgIHJldHVybiBtMlsxXS50b0xvd2VyQ2FzZSgpLnN0YXJ0c1dpdGgoZSk7XG4gICAgICAgIH0pXSk7XG4gICAgICAgIGlmIChtMlsxXSA9PSAnVmVyc2lvbicpIHtcbiAgICAgICAgICB2ZXJzaW9uID0gbTJbMl07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgLy8gU29ydCBieSBwcmlvcml0eTogbW9yZSBpbnRlcmVzdGluZyBpcyBlYXJsaWVyIHRoYW4gbGVzcyBpbnRlcmVzdGluZy5cbiAgICB0b2tlbnMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgcmV0dXJuIGFbMl0gLSBiWzJdO1xuICAgIH0pO1xuICAgIGlmICh0b2tlbnMubGVuZ3RoID4gMCkge1xuICAgICAgLy8gUmV0dXJuIHRoZSBsZWFzdCBjb21tb24gYnJvd3NlciBzdHJpbmcgYW5kIHZlcnNpb24uXG4gICAgICBpZiAodG9rZW5zWzBdWzBdLnRvTG93ZXJDYXNlKCkuc3RhcnRzV2l0aCgnZWRnJykpIHtcbiAgICAgICAgdG9rZW5zWzBdWzBdID0gJ0VkZ2UnO1xuICAgICAgfSBlbHNlIGlmICh0b2tlbnNbMF1bMF0gPT0gJ09QUicpIHtcbiAgICAgICAgdG9rZW5zWzBdWzBdID0gJ09wZXJhJztcbiAgICAgIH0gZWxzZSBpZiAodG9rZW5zWzBdWzBdID09ICdTYWZhcmknICYmIHZlcnNpb24pIHtcbiAgICAgICAgdG9rZW5zWzBdWzFdID0gdmVyc2lvbjtcbiAgICAgIH1cbiAgICAgIHJlc3VsdCA9IHRva2Vuc1swXVswXSArICcvJyArIHRva2Vuc1swXVsxXTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRmFpbGVkIHRvIElEIHRoZSBicm93c2VyLiBSZXR1cm4gdGhlIHdlYmtpdCB2ZXJzaW9uLlxuICAgICAgcmVzdWx0ID0gbVsxXTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoL2ZpcmVmb3gvaS50ZXN0KHVhKSkge1xuICAgIG0gPSAvRmlyZWZveFxcLyhbLlxcZF0rKS9nLmV4ZWModWEpO1xuICAgIGlmIChtKSB7XG4gICAgICByZXN1bHQgPSAnRmlyZWZveC8nICsgbVsxXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0ID0gJ0ZpcmVmb3gvPyc7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIE5laXRoZXIgQXBwbGVXZWJLaXQgbm9yIEZpcmVmb3guIFRyeSB0aGUgbGFzdCByZXNvcnQuXG4gICAgbSA9IC8oW1xcdy5dKylcXC8oWy5cXGRdKykvLmV4ZWModWEpO1xuICAgIGlmIChtKSB7XG4gICAgICByZXN1bHQgPSBtWzFdICsgJy8nICsgbVsyXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IHVhLnNwbGl0KCcgJyk7XG4gICAgICByZXN1bHQgPSBtWzBdO1xuICAgIH1cbiAgfVxuXG4gIC8vIFNob3J0ZW4gdGhlIHZlcnNpb24gdG8gb25lIGRvdCAnYS5iYi5jY2MuZCAtPiBhLmJiJyBhdCBtb3N0LlxuICBtID0gcmVzdWx0LnNwbGl0KCcvJyk7XG4gIGlmIChtLmxlbmd0aCA+IDEpIHtcbiAgICBjb25zdCB2ID0gbVsxXS5zcGxpdCgnLicpO1xuICAgIGNvbnN0IG1pbm9yID0gdlsxXSA/ICcuJyArIHZbMV0uc3Vic3RyKDAsIDIpIDogJyc7XG4gICAgcmVzdWx0ID0gYCR7bVswXX0vJHt2WzBdfSR7bWlub3J9YDtcbiAgfVxuICByZXR1cm4gcmVhY3RuYXRpdmUgKyByZXN1bHQ7XG59XG5cbi8qKlxuICogVGhlIG1haW4gY2xhc3MgZm9yIGludGVyYWN0aW5nIHdpdGggVGlub2RlIHNlcnZlci5cbiAqL1xuZXhwb3J0IGNsYXNzIFRpbm9kZSB7XG4gIF9ob3N0O1xuICBfc2VjdXJlO1xuXG4gIF9hcHBOYW1lO1xuXG4gIC8vIEFQSSBLZXkuXG4gIF9hcGlLZXk7XG5cbiAgLy8gTmFtZSBhbmQgdmVyc2lvbiBvZiB0aGUgYnJvd3Nlci5cbiAgX2Jyb3dzZXIgPSAnJztcbiAgX3BsYXRmb3JtO1xuICAvLyBIYXJkd2FyZVxuICBfaHdvcyA9ICd1bmRlZmluZWQnO1xuICBfaHVtYW5MYW5ndWFnZSA9ICd4eCc7XG5cbiAgLy8gTG9nZ2luZyB0byBjb25zb2xlIGVuYWJsZWRcbiAgX2xvZ2dpbmdFbmFibGVkID0gZmFsc2U7XG4gIC8vIFdoZW4gbG9nZ2luZywgdHJpcCBsb25nIHN0cmluZ3MgKGJhc2U2NC1lbmNvZGVkIGltYWdlcykgZm9yIHJlYWRhYmlsaXR5XG4gIF90cmltTG9uZ1N0cmluZ3MgPSBmYWxzZTtcbiAgLy8gVUlEIG9mIHRoZSBjdXJyZW50bHkgYXV0aGVudGljYXRlZCB1c2VyLlxuICBfbXlVSUQgPSBudWxsO1xuICAvLyBTdGF0dXMgb2YgY29ubmVjdGlvbjogYXV0aGVudGljYXRlZCBvciBub3QuXG4gIF9hdXRoZW50aWNhdGVkID0gZmFsc2U7XG4gIC8vIExvZ2luIHVzZWQgaW4gdGhlIGxhc3Qgc3VjY2Vzc2Z1bCBiYXNpYyBhdXRoZW50aWNhdGlvblxuICBfbG9naW4gPSBudWxsO1xuICAvLyBUb2tlbiB3aGljaCBjYW4gYmUgdXNlZCBmb3IgbG9naW4gaW5zdGVhZCBvZiBsb2dpbi9wYXNzd29yZC5cbiAgX2F1dGhUb2tlbiA9IG51bGw7XG4gIC8vIENvdW50ZXIgb2YgcmVjZWl2ZWQgcGFja2V0c1xuICBfaW5QYWNrZXRDb3VudCA9IDA7XG4gIC8vIENvdW50ZXIgZm9yIGdlbmVyYXRpbmcgdW5pcXVlIG1lc3NhZ2UgSURzXG4gIF9tZXNzYWdlSWQgPSBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogMHhGRkZGKSArIDB4RkZGRik7XG4gIC8vIEluZm9ybWF0aW9uIGFib3V0IHRoZSBzZXJ2ZXIsIGlmIGNvbm5lY3RlZFxuICBfc2VydmVySW5mbyA9IG51bGw7XG4gIC8vIFB1c2ggbm90aWZpY2F0aW9uIHRva2VuLiBDYWxsZWQgZGV2aWNlVG9rZW4gZm9yIGNvbnNpc3RlbmN5IHdpdGggdGhlIEFuZHJvaWQgU0RLLlxuICBfZGV2aWNlVG9rZW4gPSBudWxsO1xuXG4gIC8vIENhY2hlIG9mIHBlbmRpbmcgcHJvbWlzZXMgYnkgbWVzc2FnZSBpZC5cbiAgX3BlbmRpbmdQcm9taXNlcyA9IHt9O1xuICAvLyBUaGUgVGltZW91dCBvYmplY3QgcmV0dXJuZWQgYnkgdGhlIHJlamVjdCBleHBpcmVkIHByb21pc2VzIHNldEludGVydmFsLlxuICBfZXhwaXJlUHJvbWlzZXMgPSBudWxsO1xuXG4gIC8vIFdlYnNvY2tldCBvciBsb25nIHBvbGxpbmcgY29ubmVjdGlvbi5cbiAgX2Nvbm5lY3Rpb24gPSBudWxsO1xuXG4gIC8vIFVzZSBpbmRleERCIGZvciBjYWNoaW5nIHRvcGljcyBhbmQgbWVzc2FnZXMuXG4gIF9wZXJzaXN0ID0gZmFsc2U7XG4gIC8vIEluZGV4ZWREQiB3cmFwcGVyIG9iamVjdC5cbiAgX2RiID0gbnVsbDtcblxuICAvLyBUaW5vZGUncyBjYWNoZSBvZiBvYmplY3RzXG4gIF9jYWNoZSA9IHt9O1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgVGlub2RlIG9iamVjdC5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyAtIGNvbmZpZ3VyYXRpb24gcGFyYW1ldGVycy5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbmZpZy5hcHBOYW1lIC0gTmFtZSBvZiB0aGUgY2FsbGluZyBhcHBsaWNhdGlvbiB0byBiZSByZXBvcnRlZCBpbiB0aGUgVXNlciBBZ2VudC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbmZpZy5ob3N0IC0gSG9zdCBuYW1lIGFuZCBvcHRpb25hbCBwb3J0IG51bWJlciB0byBjb25uZWN0IHRvLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY29uZmlnLmFwaUtleSAtIEFQSSBrZXkgZ2VuZXJhdGVkIGJ5IDxjb2RlPmtleWdlbjwvY29kZT4uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb25maWcudHJhbnNwb3J0IC0gU2VlIHtAbGluayBUaW5vZGUuQ29ubmVjdGlvbiN0cmFuc3BvcnR9LlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNvbmZpZy5zZWN1cmUgLSBVc2UgU2VjdXJlIFdlYlNvY2tldCBpZiA8Y29kZT50cnVlPC9jb2RlPi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbmZpZy5wbGF0Zm9ybSAtIE9wdGlvbmFsIHBsYXRmb3JtIGlkZW50aWZpZXIsIG9uZSBvZiA8Y29kZT5cImlvc1wiPC9jb2RlPiwgPGNvZGU+XCJ3ZWJcIjwvY29kZT4sIDxjb2RlPlwiYW5kcm9pZFwiPC9jb2RlPi5cbiAgICogQHBhcmFtIHtib29sZW59IGNvbmZpZy5wZXJzaXN0IC0gVXNlIEluZGV4ZWREQiBwZXJzaXN0ZW50IHN0b3JhZ2UuXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IG9uQ29tcGxldGUgLSBjYWxsYmFjayB0byBjYWxsIHdoZW4gaW5pdGlhbGl6YXRpb24gaXMgY29tcGxldGVkLlxuICAgKi9cbiAgY29uc3RydWN0b3IoY29uZmlnLCBvbkNvbXBsZXRlKSB7XG4gICAgdGhpcy5faG9zdCA9IGNvbmZpZy5ob3N0O1xuICAgIHRoaXMuX3NlY3VyZSA9IGNvbmZpZy5zZWN1cmU7XG5cbiAgICAvLyBDbGllbnQtcHJvdmlkZWQgYXBwbGljYXRpb24gbmFtZSwgZm9ybWF0IDxOYW1lPi88dmVyc2lvbiBudW1iZXI+XG4gICAgdGhpcy5fYXBwTmFtZSA9IGNvbmZpZy5hcHBOYW1lIHx8IFwiVW5kZWZpbmVkXCI7XG5cbiAgICAvLyBBUEkgS2V5LlxuICAgIHRoaXMuX2FwaUtleSA9IGNvbmZpZy5hcGlLZXk7XG5cbiAgICAvLyBOYW1lIGFuZCB2ZXJzaW9uIG9mIHRoZSBicm93c2VyLlxuICAgIHRoaXMuX3BsYXRmb3JtID0gY29uZmlnLnBsYXRmb3JtIHx8ICd3ZWInO1xuICAgIC8vIFVuZGVybHlpbmcgT1MuXG4gICAgaWYgKHR5cGVvZiBuYXZpZ2F0b3IgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRoaXMuX2Jyb3dzZXIgPSBnZXRCcm93c2VySW5mbyhuYXZpZ2F0b3IudXNlckFnZW50LCBuYXZpZ2F0b3IucHJvZHVjdCk7XG4gICAgICB0aGlzLl9od29zID0gbmF2aWdhdG9yLnBsYXRmb3JtO1xuICAgICAgLy8gVGhpcyBpcyB0aGUgZGVmYXVsdCBsYW5ndWFnZS4gSXQgY291bGQgYmUgY2hhbmdlZCBieSBjbGllbnQuXG4gICAgICB0aGlzLl9odW1hbkxhbmd1YWdlID0gbmF2aWdhdG9yLmxhbmd1YWdlIHx8ICdlbi1VUyc7XG4gICAgfVxuXG4gICAgQ29ubmVjdGlvbi5sb2dnZXIgPSB0aGlzLmxvZ2dlcjtcbiAgICBEcmFmdHkubG9nZ2VyID0gdGhpcy5sb2dnZXI7XG5cbiAgICAvLyBXZWJTb2NrZXQgb3IgbG9uZyBwb2xsaW5nIG5ldHdvcmsgY29ubmVjdGlvbi5cbiAgICBpZiAoY29uZmlnLnRyYW5zcG9ydCAhPSAnbHAnICYmIGNvbmZpZy50cmFuc3BvcnQgIT0gJ3dzJykge1xuICAgICAgY29uZmlnLnRyYW5zcG9ydCA9IGRldGVjdFRyYW5zcG9ydCgpO1xuICAgIH1cbiAgICB0aGlzLl9jb25uZWN0aW9uID0gbmV3IENvbm5lY3Rpb24oY29uZmlnLCBDb25zdC5QUk9UT0NPTF9WRVJTSU9OLCAvKiBhdXRvcmVjb25uZWN0ICovIHRydWUpO1xuICAgIHRoaXMuX2Nvbm5lY3Rpb24ub25NZXNzYWdlID0gKGRhdGEpID0+IHtcbiAgICAgIC8vIENhbGwgdGhlIG1haW4gbWVzc2FnZSBkaXNwYXRjaGVyLlxuICAgICAgdGhpcy4jZGlzcGF0Y2hNZXNzYWdlKGRhdGEpO1xuICAgIH1cblxuICAgIC8vIFJlYWR5IHRvIHN0YXJ0IHNlbmRpbmcuXG4gICAgdGhpcy5fY29ubmVjdGlvbi5vbk9wZW4gPSBfID0+IHRoaXMuI2Nvbm5lY3Rpb25PcGVuKCk7XG4gICAgdGhpcy5fY29ubmVjdGlvbi5vbkRpc2Nvbm5lY3QgPSAoZXJyLCBjb2RlKSA9PiB0aGlzLiNkaXNjb25uZWN0ZWQoZXJyLCBjb2RlKTtcblxuICAgIC8vIFdyYXBwZXIgZm9yIHRoZSByZWNvbm5lY3QgaXRlcmF0b3IgY2FsbGJhY2suXG4gICAgdGhpcy5fY29ubmVjdGlvbi5vbkF1dG9yZWNvbm5lY3RJdGVyYXRpb24gPSAodGltZW91dCwgcHJvbWlzZSkgPT4ge1xuICAgICAgaWYgKHRoaXMub25BdXRvcmVjb25uZWN0SXRlcmF0aW9uKSB7XG4gICAgICAgIHRoaXMub25BdXRvcmVjb25uZWN0SXRlcmF0aW9uKHRpbWVvdXQsIHByb21pc2UpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX3BlcnNpc3QgPSBjb25maWcucGVyc2lzdDtcbiAgICAvLyBJbml0aWFsaXplIG9iamVjdCByZWdhcmRsZXNzLiBJdCBzaW1wbGlmaWVzIHRoZSBjb2RlLlxuICAgIHRoaXMuX2RiID0gbmV3IERCQ2FjaGUoZXJyID0+IHtcbiAgICAgIHRoaXMubG9nZ2VyKCdEQicsIGVycik7XG4gICAgfSwgdGhpcy5sb2dnZXIpO1xuXG4gICAgaWYgKHRoaXMuX3BlcnNpc3QpIHtcbiAgICAgIC8vIENyZWF0ZSB0aGUgcGVyc2lzdGVudCBjYWNoZS5cbiAgICAgIC8vIFN0b3JlIHByb21pc2VzIHRvIGJlIHJlc29sdmVkIHdoZW4gbWVzc2FnZXMgbG9hZCBpbnRvIG1lbW9yeS5cbiAgICAgIGNvbnN0IHByb20gPSBbXTtcbiAgICAgIHRoaXMuX2RiLmluaXREYXRhYmFzZSgpLnRoZW4oXyA9PiB7XG4gICAgICAgIC8vIEZpcnN0IGxvYWQgdG9waWNzIGludG8gbWVtb3J5LlxuICAgICAgICByZXR1cm4gdGhpcy5fZGIubWFwVG9waWNzKChkYXRhKSA9PiB7XG4gICAgICAgICAgbGV0IHRvcGljID0gdGhpcy4jY2FjaGVHZXQoJ3RvcGljJywgZGF0YS5uYW1lKTtcbiAgICAgICAgICBpZiAodG9waWMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGRhdGEubmFtZSA9PSBDb25zdC5UT1BJQ19NRSkge1xuICAgICAgICAgICAgdG9waWMgPSBuZXcgVG9waWNNZSgpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YS5uYW1lID09IENvbnN0LlRPUElDX0ZORCkge1xuICAgICAgICAgICAgdG9waWMgPSBuZXcgVG9waWNGbmQoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdG9waWMgPSBuZXcgVG9waWMoZGF0YS5uYW1lKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5fZGIuZGVzZXJpYWxpemVUb3BpYyh0b3BpYywgZGF0YSk7XG4gICAgICAgICAgdGhpcy4jYXR0YWNoQ2FjaGVUb1RvcGljKHRvcGljKTtcbiAgICAgICAgICB0b3BpYy5fY2FjaGVQdXRTZWxmKCk7XG4gICAgICAgICAgLy8gVG9waWMgbG9hZGVkIGZyb20gREIgaXMgbm90IG5ldy5cbiAgICAgICAgICBkZWxldGUgdG9waWMuX25ldztcbiAgICAgICAgICAvLyBSZXF1ZXN0IHRvIGxvYWQgbWVzc2FnZXMgYW5kIHNhdmUgdGhlIHByb21pc2UuXG4gICAgICAgICAgcHJvbS5wdXNoKHRvcGljLl9sb2FkTWVzc2FnZXModGhpcy5fZGIpKTtcbiAgICAgICAgfSk7XG4gICAgICB9KS50aGVuKF8gPT4ge1xuICAgICAgICAvLyBUaGVuIGxvYWQgdXNlcnMuXG4gICAgICAgIHJldHVybiB0aGlzLl9kYi5tYXBVc2VycygoZGF0YSkgPT4ge1xuICAgICAgICAgIHRoaXMuI2NhY2hlUHV0KCd1c2VyJywgZGF0YS51aWQsIG1lcmdlT2JqKHt9LCBkYXRhLnB1YmxpYykpO1xuICAgICAgICB9KTtcbiAgICAgIH0pLnRoZW4oXyA9PiB7XG4gICAgICAgIC8vIE5vdyB3YWl0IGZvciBhbGwgbWVzc2FnZXMgdG8gZmluaXNoIGxvYWRpbmcuXG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9tKTtcbiAgICAgIH0pLnRoZW4oXyA9PiB7XG4gICAgICAgIGlmIChvbkNvbXBsZXRlKSB7XG4gICAgICAgICAgb25Db21wbGV0ZSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubG9nZ2VyKFwiUGVyc2lzdGVudCBjYWNoZSBpbml0aWFsaXplZC5cIik7XG4gICAgICB9KS5jYXRjaChlcnIgPT4ge1xuICAgICAgICBpZiAob25Db21wbGV0ZSkge1xuICAgICAgICAgIG9uQ29tcGxldGUoZXJyKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxvZ2dlcihcIkZhaWxlZCB0byBpbml0aWFsaXplIHBlcnNpc3RlbnQgY2FjaGU6XCIsIGVycik7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZGIuZGVsZXRlRGF0YWJhc2UoKS50aGVuKF8gPT4ge1xuICAgICAgICBpZiAob25Db21wbGV0ZSkge1xuICAgICAgICAgIG9uQ29tcGxldGUoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLy8gUHJpdmF0ZSBtZXRob2RzLlxuXG4gIC8vIENvbnNvbGUgbG9nZ2VyLiBCYWJlbCBzb21laG93IGZhaWxzIHRvIHBhcnNlICcuLi5yZXN0JyBwYXJhbWV0ZXIuXG4gIGxvZ2dlcihzdHIsIC4uLmFyZ3MpIHtcbiAgICBpZiAodGhpcy5fbG9nZ2luZ0VuYWJsZWQpIHtcbiAgICAgIGNvbnN0IGQgPSBuZXcgRGF0ZSgpO1xuICAgICAgY29uc3QgZGF0ZVN0cmluZyA9ICgnMCcgKyBkLmdldFVUQ0hvdXJzKCkpLnNsaWNlKC0yKSArICc6JyArXG4gICAgICAgICgnMCcgKyBkLmdldFVUQ01pbnV0ZXMoKSkuc2xpY2UoLTIpICsgJzonICtcbiAgICAgICAgKCcwJyArIGQuZ2V0VVRDU2Vjb25kcygpKS5zbGljZSgtMikgKyAnLicgK1xuICAgICAgICAoJzAwJyArIGQuZ2V0VVRDTWlsbGlzZWNvbmRzKCkpLnNsaWNlKC0zKTtcblxuICAgICAgY29uc29sZS5sb2coJ1snICsgZGF0ZVN0cmluZyArICddJywgc3RyLCBhcmdzLmpvaW4oJyAnKSk7XG4gICAgfVxuICB9XG5cbiAgLy8gR2VuZXJhdG9yIG9mIGRlZmF1bHQgcHJvbWlzZXMgZm9yIHNlbnQgcGFja2V0cy5cbiAgI21ha2VQcm9taXNlKGlkKSB7XG4gICAgbGV0IHByb21pc2UgPSBudWxsO1xuICAgIGlmIChpZCkge1xuICAgICAgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgLy8gU3RvcmVkIGNhbGxiYWNrcyB3aWxsIGJlIGNhbGxlZCB3aGVuIHRoZSByZXNwb25zZSBwYWNrZXQgd2l0aCB0aGlzIElkIGFycml2ZXNcbiAgICAgICAgdGhpcy5fcGVuZGluZ1Byb21pc2VzW2lkXSA9IHtcbiAgICAgICAgICAncmVzb2x2ZSc6IHJlc29sdmUsXG4gICAgICAgICAgJ3JlamVjdCc6IHJlamVjdCxcbiAgICAgICAgICAndHMnOiBuZXcgRGF0ZSgpXG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH07XG5cbiAgLy8gUmVzb2x2ZSBvciByZWplY3QgYSBwZW5kaW5nIHByb21pc2UuXG4gIC8vIFVucmVzb2x2ZWQgcHJvbWlzZXMgYXJlIHN0b3JlZCBpbiBfcGVuZGluZ1Byb21pc2VzLlxuICAjZXhlY1Byb21pc2UoaWQsIGNvZGUsIG9uT0ssIGVycm9yVGV4dCkge1xuICAgIGNvbnN0IGNhbGxiYWNrcyA9IHRoaXMuX3BlbmRpbmdQcm9taXNlc1tpZF07XG4gICAgaWYgKGNhbGxiYWNrcykge1xuICAgICAgZGVsZXRlIHRoaXMuX3BlbmRpbmdQcm9taXNlc1tpZF07XG4gICAgICBpZiAoY29kZSA+PSAyMDAgJiYgY29kZSA8IDQwMCkge1xuICAgICAgICBpZiAoY2FsbGJhY2tzLnJlc29sdmUpIHtcbiAgICAgICAgICBjYWxsYmFja3MucmVzb2x2ZShvbk9LKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChjYWxsYmFja3MucmVqZWN0KSB7XG4gICAgICAgIGNhbGxiYWNrcy5yZWplY3QobmV3IENvbW1FcnJvcihlcnJvclRleHQsIGNvZGUpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBTZW5kIGEgcGFja2V0LiBJZiBwYWNrZXQgaWQgaXMgcHJvdmlkZWQgcmV0dXJuIGEgcHJvbWlzZS5cbiAgI3NlbmQocGt0LCBpZCkge1xuICAgIGxldCBwcm9taXNlO1xuICAgIGlmIChpZCkge1xuICAgICAgcHJvbWlzZSA9IHRoaXMuI21ha2VQcm9taXNlKGlkKTtcbiAgICB9XG4gICAgcGt0ID0gc2ltcGxpZnkocGt0KTtcbiAgICBsZXQgbXNnID0gSlNPTi5zdHJpbmdpZnkocGt0KTtcbiAgICB0aGlzLmxvZ2dlcihcIm91dDogXCIgKyAodGhpcy5fdHJpbUxvbmdTdHJpbmdzID8gSlNPTi5zdHJpbmdpZnkocGt0LCBqc29uTG9nZ2VySGVscGVyKSA6IG1zZykpO1xuICAgIHRyeSB7XG4gICAgICB0aGlzLl9jb25uZWN0aW9uLnNlbmRUZXh0KG1zZyk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAvLyBJZiBzZW5kVGV4dCB0aHJvd3MsIHdyYXAgdGhlIGVycm9yIGluIGEgcHJvbWlzZSBvciByZXRocm93LlxuICAgICAgaWYgKGlkKSB7XG4gICAgICAgIHRoaXMuI2V4ZWNQcm9taXNlKGlkLCBDb25uZWN0aW9uLk5FVFdPUktfRVJST1IsIG51bGwsIGVyci5tZXNzYWdlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICAvLyBUaGUgbWFpbiBtZXNzYWdlIGRpc3BhdGNoZXIuXG4gICNkaXNwYXRjaE1lc3NhZ2UoZGF0YSkge1xuICAgIC8vIFNraXAgZW1wdHkgcmVzcG9uc2UuIFRoaXMgaGFwcGVucyB3aGVuIExQIHRpbWVzIG91dC5cbiAgICBpZiAoIWRhdGEpXG4gICAgICByZXR1cm47XG5cbiAgICB0aGlzLl9pblBhY2tldENvdW50Kys7XG5cbiAgICAvLyBTZW5kIHJhdyBtZXNzYWdlIHRvIGxpc3RlbmVyXG4gICAgaWYgKHRoaXMub25SYXdNZXNzYWdlKSB7XG4gICAgICB0aGlzLm9uUmF3TWVzc2FnZShkYXRhKTtcbiAgICB9XG5cbiAgICBpZiAoZGF0YSA9PT0gJzAnKSB7XG4gICAgICAvLyBTZXJ2ZXIgcmVzcG9uc2UgdG8gYSBuZXR3b3JrIHByb2JlLlxuICAgICAgaWYgKHRoaXMub25OZXR3b3JrUHJvYmUpIHtcbiAgICAgICAgdGhpcy5vbk5ldHdvcmtQcm9iZSgpO1xuICAgICAgfVxuICAgICAgLy8gTm8gcHJvY2Vzc2luZyBpcyBuZWNlc3NhcnkuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHBrdCA9IEpTT04ucGFyc2UoZGF0YSwganNvblBhcnNlSGVscGVyKTtcbiAgICBpZiAoIXBrdCkge1xuICAgICAgdGhpcy5sb2dnZXIoXCJpbjogXCIgKyBkYXRhKTtcbiAgICAgIHRoaXMubG9nZ2VyKFwiRVJST1I6IGZhaWxlZCB0byBwYXJzZSBkYXRhXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxvZ2dlcihcImluOiBcIiArICh0aGlzLl90cmltTG9uZ1N0cmluZ3MgPyBKU09OLnN0cmluZ2lmeShwa3QsIGpzb25Mb2dnZXJIZWxwZXIpIDogZGF0YSkpO1xuXG4gICAgICAvLyBTZW5kIGNvbXBsZXRlIHBhY2tldCB0byBsaXN0ZW5lclxuICAgICAgaWYgKHRoaXMub25NZXNzYWdlKSB7XG4gICAgICAgIHRoaXMub25NZXNzYWdlKHBrdCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChwa3QuY3RybCkge1xuICAgICAgICAvLyBIYW5kbGluZyB7Y3RybH0gbWVzc2FnZVxuICAgICAgICBpZiAodGhpcy5vbkN0cmxNZXNzYWdlKSB7XG4gICAgICAgICAgdGhpcy5vbkN0cmxNZXNzYWdlKHBrdC5jdHJsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlc29sdmUgb3IgcmVqZWN0IGEgcGVuZGluZyBwcm9taXNlLCBpZiBhbnlcbiAgICAgICAgaWYgKHBrdC5jdHJsLmlkKSB7XG4gICAgICAgICAgdGhpcy4jZXhlY1Byb21pc2UocGt0LmN0cmwuaWQsIHBrdC5jdHJsLmNvZGUsIHBrdC5jdHJsLCBwa3QuY3RybC50ZXh0KTtcbiAgICAgICAgfVxuICAgICAgICBzZXRUaW1lb3V0KF8gPT4ge1xuICAgICAgICAgIGlmIChwa3QuY3RybC5jb2RlID09IDIwNSAmJiBwa3QuY3RybC50ZXh0ID09ICdldmljdGVkJykge1xuICAgICAgICAgICAgLy8gVXNlciBldmljdGVkIGZyb20gdG9waWMuXG4gICAgICAgICAgICBjb25zdCB0b3BpYyA9IHRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIHBrdC5jdHJsLnRvcGljKTtcbiAgICAgICAgICAgIGlmICh0b3BpYykge1xuICAgICAgICAgICAgICB0b3BpYy5fcmVzZXRTdWIoKTtcbiAgICAgICAgICAgICAgaWYgKHBrdC5jdHJsLnBhcmFtcyAmJiBwa3QuY3RybC5wYXJhbXMudW5zdWIpIHtcbiAgICAgICAgICAgICAgICB0b3BpYy5fZ29uZSgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChwa3QuY3RybC5jb2RlIDwgMzAwICYmIHBrdC5jdHJsLnBhcmFtcykge1xuICAgICAgICAgICAgaWYgKHBrdC5jdHJsLnBhcmFtcy53aGF0ID09ICdkYXRhJykge1xuICAgICAgICAgICAgICAvLyBjb2RlPTIwOCwgYWxsIG1lc3NhZ2VzIHJlY2VpdmVkOiBcInBhcmFtc1wiOntcImNvdW50XCI6MTEsXCJ3aGF0XCI6XCJkYXRhXCJ9LFxuICAgICAgICAgICAgICBjb25zdCB0b3BpYyA9IHRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIHBrdC5jdHJsLnRvcGljKTtcbiAgICAgICAgICAgICAgaWYgKHRvcGljKSB7XG4gICAgICAgICAgICAgICAgdG9waWMuX2FsbE1lc3NhZ2VzUmVjZWl2ZWQocGt0LmN0cmwucGFyYW1zLmNvdW50KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChwa3QuY3RybC5wYXJhbXMud2hhdCA9PSAnc3ViJykge1xuICAgICAgICAgICAgICAvLyBjb2RlPTIwNCwgdGhlIHRvcGljIGhhcyBubyAocmVmcmVzaGVkKSBzdWJzY3JpcHRpb25zLlxuICAgICAgICAgICAgICBjb25zdCB0b3BpYyA9IHRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIHBrdC5jdHJsLnRvcGljKTtcbiAgICAgICAgICAgICAgaWYgKHRvcGljKSB7XG4gICAgICAgICAgICAgICAgLy8gVHJpZ2dlciB0b3BpYy5vblN1YnNVcGRhdGVkLlxuICAgICAgICAgICAgICAgIHRvcGljLl9wcm9jZXNzTWV0YVN1YihbXSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sIDApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2V0VGltZW91dChfID0+IHtcbiAgICAgICAgICBpZiAocGt0Lm1ldGEpIHtcbiAgICAgICAgICAgIC8vIEhhbmRsaW5nIGEge21ldGF9IG1lc3NhZ2UuXG4gICAgICAgICAgICAvLyBQcmVmZXJyZWQgQVBJOiBSb3V0ZSBtZXRhIHRvIHRvcGljLCBpZiBvbmUgaXMgcmVnaXN0ZXJlZFxuICAgICAgICAgICAgY29uc3QgdG9waWMgPSB0aGlzLiNjYWNoZUdldCgndG9waWMnLCBwa3QubWV0YS50b3BpYyk7XG4gICAgICAgICAgICBpZiAodG9waWMpIHtcbiAgICAgICAgICAgICAgdG9waWMuX3JvdXRlTWV0YShwa3QubWV0YSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChwa3QubWV0YS5pZCkge1xuICAgICAgICAgICAgICB0aGlzLiNleGVjUHJvbWlzZShwa3QubWV0YS5pZCwgMjAwLCBwa3QubWV0YSwgJ01FVEEnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gU2Vjb25kYXJ5IEFQSTogY2FsbGJhY2tcbiAgICAgICAgICAgIGlmICh0aGlzLm9uTWV0YU1lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgdGhpcy5vbk1ldGFNZXNzYWdlKHBrdC5tZXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKHBrdC5kYXRhKSB7XG4gICAgICAgICAgICAvLyBIYW5kbGluZyB7ZGF0YX0gbWVzc2FnZVxuICAgICAgICAgICAgLy8gUHJlZmVycmVkIEFQSTogUm91dGUgZGF0YSB0byB0b3BpYywgaWYgb25lIGlzIHJlZ2lzdGVyZWRcbiAgICAgICAgICAgIGNvbnN0IHRvcGljID0gdGhpcy4jY2FjaGVHZXQoJ3RvcGljJywgcGt0LmRhdGEudG9waWMpO1xuICAgICAgICAgICAgaWYgKHRvcGljKSB7XG4gICAgICAgICAgICAgIHRvcGljLl9yb3V0ZURhdGEocGt0LmRhdGEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBTZWNvbmRhcnkgQVBJOiBDYWxsIGNhbGxiYWNrXG4gICAgICAgICAgICBpZiAodGhpcy5vbkRhdGFNZXNzYWdlKSB7XG4gICAgICAgICAgICAgIHRoaXMub25EYXRhTWVzc2FnZShwa3QuZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChwa3QucHJlcykge1xuICAgICAgICAgICAgLy8gSGFuZGxpbmcge3ByZXN9IG1lc3NhZ2VcbiAgICAgICAgICAgIC8vIFByZWZlcnJlZCBBUEk6IFJvdXRlIHByZXNlbmNlIHRvIHRvcGljLCBpZiBvbmUgaXMgcmVnaXN0ZXJlZFxuICAgICAgICAgICAgY29uc3QgdG9waWMgPSB0aGlzLiNjYWNoZUdldCgndG9waWMnLCBwa3QucHJlcy50b3BpYyk7XG4gICAgICAgICAgICBpZiAodG9waWMpIHtcbiAgICAgICAgICAgICAgdG9waWMuX3JvdXRlUHJlcyhwa3QucHJlcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFNlY29uZGFyeSBBUEkgLSBjYWxsYmFja1xuICAgICAgICAgICAgaWYgKHRoaXMub25QcmVzTWVzc2FnZSkge1xuICAgICAgICAgICAgICB0aGlzLm9uUHJlc01lc3NhZ2UocGt0LnByZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAocGt0LmluZm8pIHtcbiAgICAgICAgICAgIC8vIHtpbmZvfSBtZXNzYWdlIC0gcmVhZC9yZWNlaXZlZCBub3RpZmljYXRpb25zIGFuZCBrZXkgcHJlc3Nlc1xuICAgICAgICAgICAgLy8gUHJlZmVycmVkIEFQSTogUm91dGUge2luZm99fSB0byB0b3BpYywgaWYgb25lIGlzIHJlZ2lzdGVyZWRcbiAgICAgICAgICAgIGNvbnN0IHRvcGljID0gdGhpcy4jY2FjaGVHZXQoJ3RvcGljJywgcGt0LmluZm8udG9waWMpO1xuICAgICAgICAgICAgaWYgKHRvcGljKSB7XG4gICAgICAgICAgICAgIHRvcGljLl9yb3V0ZUluZm8ocGt0LmluZm8pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBTZWNvbmRhcnkgQVBJIC0gY2FsbGJhY2tcbiAgICAgICAgICAgIGlmICh0aGlzLm9uSW5mb01lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgdGhpcy5vbkluZm9NZXNzYWdlKHBrdC5pbmZvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIoXCJFUlJPUjogVW5rbm93biBwYWNrZXQgcmVjZWl2ZWQuXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgMCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gQ29ubmVjdGlvbiBvcGVuLCByZWFkeSB0byBzdGFydCBzZW5kaW5nLlxuICAjY29ubmVjdGlvbk9wZW4oKSB7XG4gICAgaWYgKCF0aGlzLl9leHBpcmVQcm9taXNlcykge1xuICAgICAgLy8gUmVqZWN0IHByb21pc2VzIHdoaWNoIGhhdmUgbm90IGJlZW4gcmVzb2x2ZWQgZm9yIHRvbyBsb25nLlxuICAgICAgdGhpcy5fZXhwaXJlUHJvbWlzZXMgPSBzZXRJbnRlcnZhbChfID0+IHtcbiAgICAgICAgY29uc3QgZXJyID0gbmV3IENvbW1FcnJvcihcInRpbWVvdXRcIiwgNTA0KTtcbiAgICAgICAgY29uc3QgZXhwaXJlcyA9IG5ldyBEYXRlKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gQ29uc3QuRVhQSVJFX1BST01JU0VTX1RJTUVPVVQpO1xuICAgICAgICBmb3IgKGxldCBpZCBpbiB0aGlzLl9wZW5kaW5nUHJvbWlzZXMpIHtcbiAgICAgICAgICBsZXQgY2FsbGJhY2tzID0gdGhpcy5fcGVuZGluZ1Byb21pc2VzW2lkXTtcbiAgICAgICAgICBpZiAoY2FsbGJhY2tzICYmIGNhbGxiYWNrcy50cyA8IGV4cGlyZXMpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyKFwiUHJvbWlzZSBleHBpcmVkXCIsIGlkKTtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9wZW5kaW5nUHJvbWlzZXNbaWRdO1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrcy5yZWplY3QpIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2tzLnJlamVjdChlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwgQ29uc3QuRVhQSVJFX1BST01JU0VTX1BFUklPRCk7XG4gICAgfVxuICAgIHRoaXMuaGVsbG8oKTtcbiAgfVxuXG4gICNkaXNjb25uZWN0ZWQoZXJyLCBjb2RlKSB7XG4gICAgdGhpcy5faW5QYWNrZXRDb3VudCA9IDA7XG4gICAgdGhpcy5fc2VydmVySW5mbyA9IG51bGw7XG4gICAgdGhpcy5fYXV0aGVudGljYXRlZCA9IGZhbHNlO1xuXG4gICAgaWYgKHRoaXMuX2V4cGlyZVByb21pc2VzKSB7XG4gICAgICBjbGVhckludGVydmFsKHRoaXMuX2V4cGlyZVByb21pc2VzKTtcbiAgICAgIHRoaXMuX2V4cGlyZVByb21pc2VzID0gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBNYXJrIGFsbCB0b3BpY3MgYXMgdW5zdWJzY3JpYmVkXG4gICAgdGhpcy4jY2FjaGVNYXAoJ3RvcGljJywgKHRvcGljLCBrZXkpID0+IHtcbiAgICAgIHRvcGljLl9yZXNldFN1YigpO1xuICAgIH0pO1xuXG4gICAgLy8gUmVqZWN0IGFsbCBwZW5kaW5nIHByb21pc2VzXG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMuX3BlbmRpbmdQcm9taXNlcykge1xuICAgICAgY29uc3QgY2FsbGJhY2tzID0gdGhpcy5fcGVuZGluZ1Byb21pc2VzW2tleV07XG4gICAgICBpZiAoY2FsbGJhY2tzICYmIGNhbGxiYWNrcy5yZWplY3QpIHtcbiAgICAgICAgY2FsbGJhY2tzLnJlamVjdChlcnIpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLl9wZW5kaW5nUHJvbWlzZXMgPSB7fTtcblxuICAgIGlmICh0aGlzLm9uRGlzY29ubmVjdCkge1xuICAgICAgdGhpcy5vbkRpc2Nvbm5lY3QoZXJyKTtcbiAgICB9XG4gIH1cblxuICAvLyBHZXQgVXNlciBBZ2VudCBzdHJpbmdcbiAgI2dldFVzZXJBZ2VudCgpIHtcbiAgICByZXR1cm4gdGhpcy5fYXBwTmFtZSArICcgKCcgKyAodGhpcy5fYnJvd3NlciA/IHRoaXMuX2Jyb3dzZXIgKyAnOyAnIDogJycpICsgdGhpcy5faHdvcyArICcpOyAnICsgQ29uc3QuTElCUkFSWTtcbiAgfVxuXG4gIC8vIEdlbmVyYXRvciBvZiBwYWNrZXRzIHN0dWJzXG4gICNpbml0UGFja2V0KHR5cGUsIHRvcGljKSB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlICdoaSc6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ2hpJzoge1xuICAgICAgICAgICAgJ2lkJzogdGhpcy5nZXROZXh0VW5pcXVlSWQoKSxcbiAgICAgICAgICAgICd2ZXInOiBDb25zdC5WRVJTSU9OLFxuICAgICAgICAgICAgJ3VhJzogdGhpcy4jZ2V0VXNlckFnZW50KCksXG4gICAgICAgICAgICAnZGV2JzogdGhpcy5fZGV2aWNlVG9rZW4sXG4gICAgICAgICAgICAnbGFuZyc6IHRoaXMuX2h1bWFuTGFuZ3VhZ2UsXG4gICAgICAgICAgICAncGxhdGYnOiB0aGlzLl9wbGF0Zm9ybVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgY2FzZSAnYWNjJzpcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAnYWNjJzoge1xuICAgICAgICAgICAgJ2lkJzogdGhpcy5nZXROZXh0VW5pcXVlSWQoKSxcbiAgICAgICAgICAgICd1c2VyJzogbnVsbCxcbiAgICAgICAgICAgICdzY2hlbWUnOiBudWxsLFxuICAgICAgICAgICAgJ3NlY3JldCc6IG51bGwsXG4gICAgICAgICAgICAndG1wc2NoZW1lJzogbnVsbCxcbiAgICAgICAgICAgICd0bXBzZWNyZXQnOiBudWxsLFxuICAgICAgICAgICAgJ2xvZ2luJzogZmFsc2UsXG4gICAgICAgICAgICAndGFncyc6IG51bGwsXG4gICAgICAgICAgICAnZGVzYyc6IHt9LFxuICAgICAgICAgICAgJ2NyZWQnOiB7fVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgY2FzZSAnbG9naW4nOlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICdsb2dpbic6IHtcbiAgICAgICAgICAgICdpZCc6IHRoaXMuZ2V0TmV4dFVuaXF1ZUlkKCksXG4gICAgICAgICAgICAnc2NoZW1lJzogbnVsbCxcbiAgICAgICAgICAgICdzZWNyZXQnOiBudWxsXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICBjYXNlICdzdWInOlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICdzdWInOiB7XG4gICAgICAgICAgICAnaWQnOiB0aGlzLmdldE5leHRVbmlxdWVJZCgpLFxuICAgICAgICAgICAgJ3RvcGljJzogdG9waWMsXG4gICAgICAgICAgICAnc2V0Jzoge30sXG4gICAgICAgICAgICAnZ2V0Jzoge31cbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgIGNhc2UgJ2xlYXZlJzpcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAnbGVhdmUnOiB7XG4gICAgICAgICAgICAnaWQnOiB0aGlzLmdldE5leHRVbmlxdWVJZCgpLFxuICAgICAgICAgICAgJ3RvcGljJzogdG9waWMsXG4gICAgICAgICAgICAndW5zdWInOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgY2FzZSAncHViJzpcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAncHViJzoge1xuICAgICAgICAgICAgJ2lkJzogdGhpcy5nZXROZXh0VW5pcXVlSWQoKSxcbiAgICAgICAgICAgICd0b3BpYyc6IHRvcGljLFxuICAgICAgICAgICAgJ25vZWNobyc6IGZhbHNlLFxuICAgICAgICAgICAgJ2hlYWQnOiBudWxsLFxuICAgICAgICAgICAgJ2NvbnRlbnQnOiB7fVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgY2FzZSAnZ2V0JzpcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAnZ2V0Jzoge1xuICAgICAgICAgICAgJ2lkJzogdGhpcy5nZXROZXh0VW5pcXVlSWQoKSxcbiAgICAgICAgICAgICd0b3BpYyc6IHRvcGljLFxuICAgICAgICAgICAgJ3doYXQnOiBudWxsLFxuICAgICAgICAgICAgJ2Rlc2MnOiB7fSxcbiAgICAgICAgICAgICdzdWInOiB7fSxcbiAgICAgICAgICAgICdkYXRhJzoge31cbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgIGNhc2UgJ3NldCc6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ3NldCc6IHtcbiAgICAgICAgICAgICdpZCc6IHRoaXMuZ2V0TmV4dFVuaXF1ZUlkKCksXG4gICAgICAgICAgICAndG9waWMnOiB0b3BpYyxcbiAgICAgICAgICAgICdkZXNjJzoge30sXG4gICAgICAgICAgICAnc3ViJzoge30sXG4gICAgICAgICAgICAndGFncyc6IFtdLFxuICAgICAgICAgICAgJ2VwaGVtZXJhbCc6IHt9XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICBjYXNlICdkZWwnOlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICdkZWwnOiB7XG4gICAgICAgICAgICAnaWQnOiB0aGlzLmdldE5leHRVbmlxdWVJZCgpLFxuICAgICAgICAgICAgJ3RvcGljJzogdG9waWMsXG4gICAgICAgICAgICAnd2hhdCc6IG51bGwsXG4gICAgICAgICAgICAnZGVsc2VxJzogbnVsbCxcbiAgICAgICAgICAgICd1c2VyJzogbnVsbCxcbiAgICAgICAgICAgICdoYXJkJzogZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgIGNhc2UgJ25vdGUnOlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICdub3RlJzoge1xuICAgICAgICAgICAgLy8gbm8gaWQgYnkgZGVzaWduIChleGNlcHQgY2FsbHMpLlxuICAgICAgICAgICAgJ3RvcGljJzogdG9waWMsXG4gICAgICAgICAgICAnd2hhdCc6IG51bGwsIC8vIG9uZSBvZiBcInJlY3ZcIiwgXCJyZWFkXCIsIFwia3BcIiwgXCJjYWxsXCJcbiAgICAgICAgICAgICdzZXEnOiB1bmRlZmluZWQgLy8gdGhlIHNlcnZlci1zaWRlIG1lc3NhZ2UgaWQgYWNrbm93bGVkZ2VkIGFzIHJlY2VpdmVkIG9yIHJlYWQuXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gcGFja2V0IHR5cGUgcmVxdWVzdGVkOiAke3R5cGV9YCk7XG4gICAgfVxuICB9XG5cbiAgLy8gQ2FjaGUgbWFuYWdlbWVudFxuICAjY2FjaGVQdXQodHlwZSwgbmFtZSwgb2JqKSB7XG4gICAgdGhpcy5fY2FjaGVbdHlwZSArICc6JyArIG5hbWVdID0gb2JqO1xuICB9XG4gICNjYWNoZUdldCh0eXBlLCBuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NhY2hlW3R5cGUgKyAnOicgKyBuYW1lXTtcbiAgfVxuICAjY2FjaGVEZWwodHlwZSwgbmFtZSkge1xuICAgIGRlbGV0ZSB0aGlzLl9jYWNoZVt0eXBlICsgJzonICsgbmFtZV07XG4gIH1cblxuICAvLyBFbnVtZXJhdGUgYWxsIGl0ZW1zIGluIGNhY2hlLCBjYWxsIGZ1bmMgZm9yIGVhY2ggaXRlbS5cbiAgLy8gRW51bWVyYXRpb24gc3RvcHMgaWYgZnVuYyByZXR1cm5zIHRydWUuXG4gICNjYWNoZU1hcCh0eXBlLCBmdW5jLCBjb250ZXh0KSB7XG4gICAgY29uc3Qga2V5ID0gdHlwZSA/IHR5cGUgKyAnOicgOiB1bmRlZmluZWQ7XG4gICAgZm9yIChsZXQgaWR4IGluIHRoaXMuX2NhY2hlKSB7XG4gICAgICBpZiAoIWtleSB8fCBpZHguaW5kZXhPZihrZXkpID09IDApIHtcbiAgICAgICAgaWYgKGZ1bmMuY2FsbChjb250ZXh0LCB0aGlzLl9jYWNoZVtpZHhdLCBpZHgpKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBNYWtlIGxpbWl0ZWQgY2FjaGUgbWFuYWdlbWVudCBhdmFpbGFibGUgdG8gdG9waWMuXG4gIC8vIENhY2hpbmcgdXNlci5wdWJsaWMgb25seS4gRXZlcnl0aGluZyBlbHNlIGlzIHBlci10b3BpYy5cbiAgI2F0dGFjaENhY2hlVG9Ub3BpYyh0b3BpYykge1xuICAgIHRvcGljLl90aW5vZGUgPSB0aGlzO1xuXG4gICAgdG9waWMuX2NhY2hlR2V0VXNlciA9ICh1aWQpID0+IHtcbiAgICAgIGNvbnN0IHB1YiA9IHRoaXMuI2NhY2hlR2V0KCd1c2VyJywgdWlkKTtcbiAgICAgIGlmIChwdWIpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB1c2VyOiB1aWQsXG4gICAgICAgICAgcHVibGljOiBtZXJnZU9iaih7fSwgcHViKVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9O1xuICAgIHRvcGljLl9jYWNoZVB1dFVzZXIgPSAodWlkLCB1c2VyKSA9PiB7XG4gICAgICB0aGlzLiNjYWNoZVB1dCgndXNlcicsIHVpZCwgbWVyZ2VPYmooe30sIHVzZXIucHVibGljKSk7XG4gICAgfTtcbiAgICB0b3BpYy5fY2FjaGVEZWxVc2VyID0gKHVpZCkgPT4ge1xuICAgICAgdGhpcy4jY2FjaGVEZWwoJ3VzZXInLCB1aWQpO1xuICAgIH07XG4gICAgdG9waWMuX2NhY2hlUHV0U2VsZiA9IF8gPT4ge1xuICAgICAgdGhpcy4jY2FjaGVQdXQoJ3RvcGljJywgdG9waWMubmFtZSwgdG9waWMpO1xuICAgIH07XG4gICAgdG9waWMuX2NhY2hlRGVsU2VsZiA9IF8gPT4ge1xuICAgICAgdGhpcy4jY2FjaGVEZWwoJ3RvcGljJywgdG9waWMubmFtZSk7XG4gICAgfTtcbiAgfVxuXG4gIC8vIE9uIHN1Y2Nlc3NmdWwgbG9naW4gc2F2ZSBzZXJ2ZXItcHJvdmlkZWQgZGF0YS5cbiAgI2xvZ2luU3VjY2Vzc2Z1bChjdHJsKSB7XG4gICAgaWYgKCFjdHJsLnBhcmFtcyB8fCAhY3RybC5wYXJhbXMudXNlcikge1xuICAgICAgcmV0dXJuIGN0cmw7XG4gICAgfVxuICAgIC8vIFRoaXMgaXMgYSByZXNwb25zZSB0byBhIHN1Y2Nlc3NmdWwgbG9naW4sXG4gICAgLy8gZXh0cmFjdCBVSUQgYW5kIHNlY3VyaXR5IHRva2VuLCBzYXZlIGl0IGluIFRpbm9kZSBtb2R1bGVcbiAgICB0aGlzLl9teVVJRCA9IGN0cmwucGFyYW1zLnVzZXI7XG4gICAgdGhpcy5fYXV0aGVudGljYXRlZCA9IChjdHJsICYmIGN0cmwuY29kZSA+PSAyMDAgJiYgY3RybC5jb2RlIDwgMzAwKTtcbiAgICBpZiAoY3RybC5wYXJhbXMgJiYgY3RybC5wYXJhbXMudG9rZW4gJiYgY3RybC5wYXJhbXMuZXhwaXJlcykge1xuICAgICAgdGhpcy5fYXV0aFRva2VuID0ge1xuICAgICAgICB0b2tlbjogY3RybC5wYXJhbXMudG9rZW4sXG4gICAgICAgIGV4cGlyZXM6IGN0cmwucGFyYW1zLmV4cGlyZXNcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2F1dGhUb2tlbiA9IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub25Mb2dpbikge1xuICAgICAgdGhpcy5vbkxvZ2luKGN0cmwuY29kZSwgY3RybC50ZXh0KTtcbiAgICB9XG5cbiAgICByZXR1cm4gY3RybDtcbiAgfVxuXG4gIC8vIFN0YXRpYyBtZXRob2RzLlxuICAvKipcbiAgICogSGVscGVyIG1ldGhvZCB0byBwYWNrYWdlIGFjY291bnQgY3JlZGVudGlhbC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmcgfCBDcmVkZW50aWFsfSBtZXRoIC0gdmFsaWRhdGlvbiBtZXRob2Qgb3Igb2JqZWN0IHdpdGggdmFsaWRhdGlvbiBkYXRhLlxuICAgKiBAcGFyYW0ge3N0cmluZz19IHZhbCAtIHZhbGlkYXRpb24gdmFsdWUgKGUuZy4gZW1haWwgb3IgcGhvbmUgbnVtYmVyKS5cbiAgICogQHBhcmFtIHtPYmplY3Q9fSBwYXJhbXMgLSB2YWxpZGF0aW9uIHBhcmFtZXRlcnMuXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gcmVzcCAtIHZhbGlkYXRpb24gcmVzcG9uc2UuXG4gICAqXG4gICAqIEByZXR1cm5zIHtBcnJheS48Q3JlZGVudGlhbD59IGFycmF5IHdpdGggYSBzaW5nbGUgY3JlZGVudGlhbCBvciA8Y29kZT5udWxsPC9jb2RlPiBpZiBubyB2YWxpZCBjcmVkZW50aWFscyB3ZXJlIGdpdmVuLlxuICAgKi9cbiAgc3RhdGljIGNyZWRlbnRpYWwobWV0aCwgdmFsLCBwYXJhbXMsIHJlc3ApIHtcbiAgICBpZiAodHlwZW9mIG1ldGggPT0gJ29iamVjdCcpIHtcbiAgICAgICh7XG4gICAgICAgIHZhbCxcbiAgICAgICAgcGFyYW1zLFxuICAgICAgICByZXNwLFxuICAgICAgICBtZXRoXG4gICAgICB9ID0gbWV0aCk7XG4gICAgfVxuICAgIGlmIChtZXRoICYmICh2YWwgfHwgcmVzcCkpIHtcbiAgICAgIHJldHVybiBbe1xuICAgICAgICAnbWV0aCc6IG1ldGgsXG4gICAgICAgICd2YWwnOiB2YWwsXG4gICAgICAgICdyZXNwJzogcmVzcCxcbiAgICAgICAgJ3BhcmFtcyc6IHBhcmFtc1xuICAgICAgfV07XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZSB0b3BpYyB0eXBlIGZyb20gdG9waWMncyBuYW1lOiBncnAsIHAycCwgbWUsIGZuZCwgc3lzLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIHRlc3QuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IE9uZSBvZiA8Y29kZT5cIm1lXCI8L2NvZGU+LCA8Y29kZT5cImZuZFwiPC9jb2RlPiwgPGNvZGU+XCJzeXNcIjwvY29kZT4sIDxjb2RlPlwiZ3JwXCI8L2NvZGU+LFxuICAgKiAgICA8Y29kZT5cInAycFwiPC9jb2RlPiBvciA8Y29kZT51bmRlZmluZWQ8L2NvZGU+LlxuICAgKi9cbiAgc3RhdGljIHRvcGljVHlwZShuYW1lKSB7XG4gICAgcmV0dXJuIFRvcGljLnRvcGljVHlwZShuYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgZ2l2ZW4gdG9waWMgbmFtZSBpcyBhIG5hbWUgb2YgYSAnbWUnIHRvcGljLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIHRlc3QuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGUgbmFtZSBpcyBhIG5hbWUgb2YgYSAnbWUnIHRvcGljLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgc3RhdGljIGlzTWVUb3BpY05hbWUobmFtZSkge1xuICAgIHJldHVybiBUb3BpYy5pc01lVG9waWNOYW1lKG5hbWUpO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgZ2l2ZW4gdG9waWMgbmFtZSBpcyBhIG5hbWUgb2YgYSBncm91cCB0b3BpYy5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byB0ZXN0LlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdGhlIG5hbWUgaXMgYSBuYW1lIG9mIGEgZ3JvdXAgdG9waWMsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBzdGF0aWMgaXNHcm91cFRvcGljTmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIFRvcGljLmlzR3JvdXBUb3BpY05hbWUobmFtZSk7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhIHAycCB0b3BpYy5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byB0ZXN0LlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdGhlIG5hbWUgaXMgYSBuYW1lIG9mIGEgcDJwIHRvcGljLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgc3RhdGljIGlzUDJQVG9waWNOYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gVG9waWMuaXNQMlBUb3BpY05hbWUobmFtZSk7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhIGNvbW11bmljYXRpb24gdG9waWMsIGkuZS4gUDJQIG9yIGdyb3VwLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIHRlc3QuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGUgbmFtZSBpcyBhIG5hbWUgb2YgYSBwMnAgb3IgZ3JvdXAgdG9waWMsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBzdGF0aWMgaXNDb21tVG9waWNOYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gVG9waWMuaXNDb21tVG9waWNOYW1lKG5hbWUpO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgdG9waWMgbmFtZSBpcyBhIG5hbWUgb2YgYSBuZXcgdG9waWMuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gdG9waWMgbmFtZSB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBuYW1lIGlzIGEgbmFtZSBvZiBhIG5ldyB0b3BpYywgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIHN0YXRpYyBpc05ld0dyb3VwVG9waWNOYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gVG9waWMuaXNOZXdHcm91cFRvcGljTmFtZShuYW1lKTtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIHRvcGljIG5hbWUgaXMgYSBuYW1lIG9mIGEgY2hhbm5lbC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSB0b3BpYyBuYW1lIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdGhlIG5hbWUgaXMgYSBuYW1lIG9mIGEgY2hhbm5lbCwgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIHN0YXRpYyBpc0NoYW5uZWxUb3BpY05hbWUobmFtZSkge1xuICAgIHJldHVybiBUb3BpYy5pc0NoYW5uZWxUb3BpY05hbWUobmFtZSk7XG4gIH1cbiAgLyoqXG4gICAqIEdldCBpbmZvcm1hdGlvbiBhYm91dCB0aGUgY3VycmVudCB2ZXJzaW9uIG9mIHRoaXMgVGlub2RlIGNsaWVudCBsaWJyYXJ5LlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBzZW1hbnRpYyB2ZXJzaW9uIG9mIHRoZSBsaWJyYXJ5LCBlLmcuIDxjb2RlPlwiMC4xNS41LXJjMVwiPC9jb2RlPi5cbiAgICovXG4gIHN0YXRpYyBnZXRWZXJzaW9uKCkge1xuICAgIHJldHVybiBDb25zdC5WRVJTSU9OO1xuICB9XG4gIC8qKlxuICAgKiBUbyB1c2UgVGlub2RlIGluIGEgbm9uIGJyb3dzZXIgY29udGV4dCwgc3VwcGx5IFdlYlNvY2tldCBhbmQgWE1MSHR0cFJlcXVlc3QgcHJvdmlkZXJzLlxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB3c1Byb3ZpZGVyIDxjb2RlPldlYlNvY2tldDwvY29kZT4gcHJvdmlkZXIsIGUuZy4gZm9yIG5vZGVKUyAsIDxjb2RlPnJlcXVpcmUoJ3dzJyk8L2NvZGU+LlxuICAgKiBAcGFyYW0geGhyUHJvdmlkZXIgPGNvZGU+WE1MSHR0cFJlcXVlc3Q8L2NvZGU+IHByb3ZpZGVyLCBlLmcuIGZvciBub2RlIDxjb2RlPnJlcXVpcmUoJ3hocicpPC9jb2RlPi5cbiAgICovXG4gIHN0YXRpYyBzZXROZXR3b3JrUHJvdmlkZXJzKHdzUHJvdmlkZXIsIHhoclByb3ZpZGVyKSB7XG4gICAgV2ViU29ja2V0UHJvdmlkZXIgPSB3c1Byb3ZpZGVyO1xuICAgIFhIUlByb3ZpZGVyID0geGhyUHJvdmlkZXI7XG5cbiAgICBDb25uZWN0aW9uLnNldE5ldHdvcmtQcm92aWRlcnMoV2ViU29ja2V0UHJvdmlkZXIsIFhIUlByb3ZpZGVyKTtcbiAgICBMYXJnZUZpbGVIZWxwZXIuc2V0TmV0d29ya1Byb3ZpZGVyKFhIUlByb3ZpZGVyKTtcbiAgfVxuICAvKipcbiAgICogVG8gdXNlIFRpbm9kZSBpbiBhIG5vbiBicm93c2VyIGNvbnRleHQsIHN1cHBseSA8Y29kZT5pbmRleGVkREI8L2NvZGU+IHByb3ZpZGVyLlxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSBpZGJQcm92aWRlciA8Y29kZT5pbmRleGVkREI8L2NvZGU+IHByb3ZpZGVyLCBlLmcuIGZvciBub2RlSlMgLCA8Y29kZT5yZXF1aXJlKCdmYWtlLWluZGV4ZWRkYicpPC9jb2RlPi5cbiAgICovXG4gIHN0YXRpYyBzZXREYXRhYmFzZVByb3ZpZGVyKGlkYlByb3ZpZGVyKSB7XG4gICAgSW5kZXhlZERCUHJvdmlkZXIgPSBpZGJQcm92aWRlcjtcblxuICAgIERCQ2FjaGUuc2V0RGF0YWJhc2VQcm92aWRlcihJbmRleGVkREJQcm92aWRlcik7XG4gIH1cbiAgLyoqXG4gICAqIFJldHVybiBpbmZvcm1hdGlvbiBhYm91dCB0aGUgY3VycmVudCBuYW1lIGFuZCB2ZXJzaW9uIG9mIHRoaXMgVGlub2RlIGxpYnJhcnkuXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHJldHVybnMge3N0cmluZ30gdGhlIG5hbWUgb2YgdGhlIGxpYnJhcnkgYW5kIGl0J3MgdmVyc2lvbi5cbiAgICovXG4gIHN0YXRpYyBnZXRMaWJyYXJ5KCkge1xuICAgIHJldHVybiBDb25zdC5MSUJSQVJZO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgZ2l2ZW4gc3RyaW5nIHJlcHJlc2VudHMgPGNvZGU+TlVMTDwvY29kZT4gdmFsdWUgYXMgZGVmaW5lZCBieSBUaW5vZGUgKDxjb2RlPidcXHUyNDIxJzwvY29kZT4pLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyIC0gc3RyaW5nIHRvIGNoZWNrIGZvciA8Y29kZT5OVUxMPC9jb2RlPiB2YWx1ZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHN0cmluZyByZXByZXNlbnRzIDxjb2RlPk5VTEw8L2NvZGU+IHZhbHVlLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgc3RhdGljIGlzTnVsbFZhbHVlKHN0cikge1xuICAgIHJldHVybiBzdHIgPT09IENvbnN0LkRFTF9DSEFSO1xuICB9XG5cbiAgLy8gSW5zdGFuY2UgbWV0aG9kcy5cblxuICAvLyBHZW5lcmF0ZXMgdW5pcXVlIG1lc3NhZ2UgSURzXG4gIGdldE5leHRVbmlxdWVJZCgpIHtcbiAgICByZXR1cm4gKHRoaXMuX21lc3NhZ2VJZCAhPSAwKSA/ICcnICsgdGhpcy5fbWVzc2FnZUlkKysgOiB1bmRlZmluZWQ7XG4gIH07XG5cbiAgLyoqXG4gICAqIENvbm5lY3QgdG8gdGhlIHNlcnZlci5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGhvc3RfIC0gbmFtZSBvZiB0aGUgaG9zdCB0byBjb25uZWN0IHRvLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBQcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIGNvbm5lY3Rpb24gY2FsbCBjb21wbGV0ZXM6XG4gICAqICAgIDxjb2RlPnJlc29sdmUoKTwvY29kZT4gaXMgY2FsbGVkIHdpdGhvdXQgcGFyYW1ldGVycywgPGNvZGU+cmVqZWN0KCk8L2NvZGU+IHJlY2VpdmVzIHRoZVxuICAgKiAgICA8Y29kZT5FcnJvcjwvY29kZT4gYXMgYSBzaW5nbGUgcGFyYW1ldGVyLlxuICAgKi9cbiAgY29ubmVjdChob3N0Xykge1xuICAgIHJldHVybiB0aGlzLl9jb25uZWN0aW9uLmNvbm5lY3QoaG9zdF8pO1xuICB9XG5cbiAgLyoqXG4gICAqIEF0dGVtcHQgdG8gcmVjb25uZWN0IHRvIHRoZSBzZXJ2ZXIgaW1tZWRpYXRlbHkuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmb3JjZSAtIGlmIDxjb2RlPnRydWU8L2NvZGU+LCByZWNvbm5lY3QgZXZlbiBpZiB0aGVyZSBpcyBhIGNvbm5lY3Rpb24gYWxyZWFkeS5cbiAgICovXG4gIHJlY29ubmVjdChmb3JjZSkge1xuICAgIHRoaXMuX2Nvbm5lY3Rpb24ucmVjb25uZWN0KGZvcmNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNjb25uZWN0IGZyb20gdGhlIHNlcnZlci5cbiAgICovXG4gIGRpc2Nvbm5lY3QoKSB7XG4gICAgdGhpcy5fY29ubmVjdGlvbi5kaXNjb25uZWN0KCk7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXIgcGVyc2lzdGVudCBjYWNoZTogcmVtb3ZlIEluZGV4ZWREQi5cbiAgICpcbiAgICogQHJldHVybiB7UHJvbWlzZX0gUHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBvcGVyYXRpb24gaXMgY29tcGxldGVkLlxuICAgKi9cbiAgY2xlYXJTdG9yYWdlKCkge1xuICAgIGlmICh0aGlzLl9kYi5pc1JlYWR5KCkpIHtcbiAgICAgIHJldHVybiB0aGlzLl9kYi5kZWxldGVEYXRhYmFzZSgpO1xuICAgIH1cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBwZXJzaXN0ZW50IGNhY2hlOiBjcmVhdGUgSW5kZXhlZERCIGNhY2hlLlxuICAgKlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBQcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIG9wZXJhdGlvbiBpcyBjb21wbGV0ZWQuXG4gICAqL1xuICBpbml0U3RvcmFnZSgpIHtcbiAgICBpZiAoIXRoaXMuX2RiLmlzUmVhZHkoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2RiLmluaXREYXRhYmFzZSgpO1xuICAgIH1cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZCBhIG5ldHdvcmsgcHJvYmUgbWVzc2FnZSB0byBtYWtlIHN1cmUgdGhlIGNvbm5lY3Rpb24gaXMgYWxpdmUuXG4gICAqL1xuICBuZXR3b3JrUHJvYmUoKSB7XG4gICAgdGhpcy5fY29ubmVjdGlvbi5wcm9iZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGZvciBsaXZlIGNvbm5lY3Rpb24gdG8gc2VydmVyLlxuICAgKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdGhlcmUgaXMgYSBsaXZlIGNvbm5lY3Rpb24sIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBpc0Nvbm5lY3RlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fY29ubmVjdGlvbi5pc0Nvbm5lY3RlZCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGNvbm5lY3Rpb24gaXMgYXV0aGVudGljYXRlZCAobGFzdCBsb2dpbiB3YXMgc3VjY2Vzc2Z1bCkuXG4gICAqXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiBhdXRoZW50aWNhdGVkLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNBdXRoZW50aWNhdGVkKCkge1xuICAgIHJldHVybiB0aGlzLl9hdXRoZW50aWNhdGVkO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBBUEkga2V5IGFuZCBhdXRoIHRva2VuIHRvIHRoZSByZWxhdGl2ZSBVUkwgbWFraW5nIGl0IHVzYWJsZSBmb3IgZ2V0dGluZyBkYXRhXG4gICAqIGZyb20gdGhlIHNlcnZlciBpbiBhIHNpbXBsZSA8Y29kZT5IVFRQIEdFVDwvY29kZT4gcmVxdWVzdC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IFVSTCAtIFVSTCB0byB3cmFwLlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBVUkwgd2l0aCBhcHBlbmRlZCBBUEkga2V5IGFuZCB0b2tlbiwgaWYgdmFsaWQgdG9rZW4gaXMgcHJlc2VudC5cbiAgICovXG4gIGF1dGhvcml6ZVVSTCh1cmwpIHtcbiAgICBpZiAodHlwZW9mIHVybCAhPSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIHVybDtcbiAgICB9XG5cbiAgICBpZiAoaXNVcmxSZWxhdGl2ZSh1cmwpKSB7XG4gICAgICAvLyBGYWtlIGJhc2UgdG8gbWFrZSB0aGUgcmVsYXRpdmUgVVJMIHBhcnNlYWJsZS5cbiAgICAgIGNvbnN0IGJhc2UgPSAnc2NoZW1lOi8vaG9zdC8nO1xuICAgICAgY29uc3QgcGFyc2VkID0gbmV3IFVSTCh1cmwsIGJhc2UpO1xuICAgICAgaWYgKHRoaXMuX2FwaUtleSkge1xuICAgICAgICBwYXJzZWQuc2VhcmNoUGFyYW1zLmFwcGVuZCgnYXBpa2V5JywgdGhpcy5fYXBpS2V5KTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLl9hdXRoVG9rZW4gJiYgdGhpcy5fYXV0aFRva2VuLnRva2VuKSB7XG4gICAgICAgIHBhcnNlZC5zZWFyY2hQYXJhbXMuYXBwZW5kKCdhdXRoJywgJ3Rva2VuJyk7XG4gICAgICAgIHBhcnNlZC5zZWFyY2hQYXJhbXMuYXBwZW5kKCdzZWNyZXQnLCB0aGlzLl9hdXRoVG9rZW4udG9rZW4pO1xuICAgICAgfVxuICAgICAgLy8gQ29udmVydCBiYWNrIHRvIHN0cmluZyBhbmQgc3RyaXAgZmFrZSBiYXNlIFVSTCBleGNlcHQgZm9yIHRoZSByb290IHNsYXNoLlxuICAgICAgdXJsID0gcGFyc2VkLnRvU3RyaW5nKCkuc3Vic3RyaW5nKGJhc2UubGVuZ3RoIC0gMSk7XG4gICAgfVxuICAgIHJldHVybiB1cmw7XG4gIH1cblxuICAvKipcbiAgICogQHR5cGVkZWYgQWNjb3VudFBhcmFtc1xuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJvcGVydHkge0RlZkFjcz19IGRlZmFjcyAtIERlZmF1bHQgYWNjZXNzIHBhcmFtZXRlcnMgZm9yIHVzZXIncyA8Y29kZT5tZTwvY29kZT4gdG9waWMuXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0PX0gcHVibGljIC0gUHVibGljIGFwcGxpY2F0aW9uLWRlZmluZWQgZGF0YSBleHBvc2VkIG9uIDxjb2RlPm1lPC9jb2RlPiB0b3BpYy5cbiAgICogQHByb3BlcnR5IHtPYmplY3Q9fSBwcml2YXRlIC0gUHJpdmF0ZSBhcHBsaWNhdGlvbi1kZWZpbmVkIGRhdGEgYWNjZXNzaWJsZSBvbiA8Y29kZT5tZTwvY29kZT4gdG9waWMuXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0PX0gdHJ1c3RlZCAtIFRydXN0ZWQgdXNlciBkYXRhIHdoaWNoIGNhbiBiZSBzZXQgYnkgYSByb290IHVzZXIgb25seS5cbiAgICogQHByb3BlcnR5IHtBcnJheS48c3RyaW5nPn0gdGFncyAtIGFycmF5IG9mIHN0cmluZyB0YWdzIGZvciB1c2VyIGRpc2NvdmVyeS5cbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IHNjaGVtZSAtIFRlbXBvcmFyeSBhdXRoZW50aWNhdGlvbiBzY2hlbWUgZm9yIHBhc3N3b3JkIHJlc2V0LlxuICAgKiBAcHJvcGVydHkge3N0cmluZ30gc2VjcmV0IC0gVGVtcG9yYXJ5IGF1dGhlbnRpY2F0aW9uIHNlY3JldCBmb3IgcGFzc3dvcmQgcmVzZXQuXG4gICAqIEBwcm9wZXJ0eSB7QXJyYXkuPHN0cmluZz49fSBhdHRhY2htZW50cyAtIEFycmF5IG9mIHJlZmVyZW5jZXMgdG8gb3V0IG9mIGJhbmQgYXR0YWNobWVudHMgdXNlZCBpbiBhY2NvdW50IGRlc2NyaXB0aW9uLlxuICAgKi9cbiAgLyoqXG4gICAqIEB0eXBlZGVmIERlZkFjc1xuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJvcGVydHkge3N0cmluZz19IGF1dGggLSBBY2Nlc3MgbW9kZSBmb3IgPGNvZGU+bWU8L2NvZGU+IGZvciBhdXRoZW50aWNhdGVkIHVzZXJzLlxuICAgKiBAcHJvcGVydHkge3N0cmluZz19IGFub24gLSBBY2Nlc3MgbW9kZSBmb3IgPGNvZGU+bWU8L2NvZGU+IGZvciBhbm9ueW1vdXMgdXNlcnMuXG4gICAqL1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgb3IgdXBkYXRlIGFuIGFjY291bnQuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBVc2VyIGlkIHRvIHVwZGF0ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2NoZW1lIC0gQXV0aGVudGljYXRpb24gc2NoZW1lOyA8Y29kZT5cImJhc2ljXCI8L2NvZGU+IGFuZCA8Y29kZT5cImFub255bW91c1wiPC9jb2RlPiBhcmUgdGhlIGN1cnJlbnRseSBzdXBwb3J0ZWQgc2NoZW1lcy5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHNlY3JldCAtIEF1dGhlbnRpY2F0aW9uIHNlY3JldCwgYXNzdW1lZCB0byBiZSBhbHJlYWR5IGJhc2U2NCBlbmNvZGVkLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBsb2dpbiAtIFVzZSBuZXcgYWNjb3VudCB0byBhdXRoZW50aWNhdGUgY3VycmVudCBzZXNzaW9uXG4gICAqIEBwYXJhbSB7QWNjb3VudFBhcmFtcz19IHBhcmFtcyAtIFVzZXIgZGF0YSB0byBwYXNzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiBzZXJ2ZXIgcmVwbHkgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICBhY2NvdW50KHVpZCwgc2NoZW1lLCBzZWNyZXQsIGxvZ2luLCBwYXJhbXMpIHtcbiAgICBjb25zdCBwa3QgPSB0aGlzLiNpbml0UGFja2V0KCdhY2MnKTtcbiAgICBwa3QuYWNjLnVzZXIgPSB1aWQ7XG4gICAgcGt0LmFjYy5zY2hlbWUgPSBzY2hlbWU7XG4gICAgcGt0LmFjYy5zZWNyZXQgPSBzZWNyZXQ7XG4gICAgLy8gTG9nIGluIHRvIHRoZSBuZXcgYWNjb3VudCB1c2luZyBzZWxlY3RlZCBzY2hlbWVcbiAgICBwa3QuYWNjLmxvZ2luID0gbG9naW47XG5cbiAgICBpZiAocGFyYW1zKSB7XG4gICAgICBwa3QuYWNjLmRlc2MuZGVmYWNzID0gcGFyYW1zLmRlZmFjcztcbiAgICAgIHBrdC5hY2MuZGVzYy5wdWJsaWMgPSBwYXJhbXMucHVibGljO1xuICAgICAgcGt0LmFjYy5kZXNjLnByaXZhdGUgPSBwYXJhbXMucHJpdmF0ZTtcbiAgICAgIHBrdC5hY2MuZGVzYy50cnVzdGVkID0gcGFyYW1zLnRydXN0ZWQ7XG5cbiAgICAgIHBrdC5hY2MudGFncyA9IHBhcmFtcy50YWdzO1xuICAgICAgcGt0LmFjYy5jcmVkID0gcGFyYW1zLmNyZWQ7XG5cbiAgICAgIHBrdC5hY2MudG1wc2NoZW1lID0gcGFyYW1zLnNjaGVtZTtcbiAgICAgIHBrdC5hY2MudG1wc2VjcmV0ID0gcGFyYW1zLnNlY3JldDtcblxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkocGFyYW1zLmF0dGFjaG1lbnRzKSAmJiBwYXJhbXMuYXR0YWNobWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICBwa3QuZXh0cmEgPSB7XG4gICAgICAgICAgYXR0YWNobWVudHM6IHBhcmFtcy5hdHRhY2htZW50cy5maWx0ZXIocmVmID0+IGlzVXJsUmVsYXRpdmUocmVmKSlcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy4jc2VuZChwa3QsIHBrdC5hY2MuaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyB1c2VyLiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI2FjY291bnR9LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2NoZW1lIC0gQXV0aGVudGljYXRpb24gc2NoZW1lOyA8Y29kZT5cImJhc2ljXCI8L2NvZGU+IGlzIHRoZSBvbmx5IGN1cnJlbnRseSBzdXBwb3J0ZWQgc2NoZW1lLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2VjcmV0IC0gQXV0aGVudGljYXRpb24uXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IGxvZ2luIC0gVXNlIG5ldyBhY2NvdW50IHRvIGF1dGhlbnRpY2F0ZSBjdXJyZW50IHNlc3Npb25cbiAgICogQHBhcmFtIHtBY2NvdW50UGFyYW1zPX0gcGFyYW1zIC0gVXNlciBkYXRhIHRvIHBhc3MgdG8gdGhlIHNlcnZlci5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHNlcnZlciByZXBseSBpcyByZWNlaXZlZC5cbiAgICovXG4gIGNyZWF0ZUFjY291bnQoc2NoZW1lLCBzZWNyZXQsIGxvZ2luLCBwYXJhbXMpIHtcbiAgICBsZXQgcHJvbWlzZSA9IHRoaXMuYWNjb3VudChDb25zdC5VU0VSX05FVywgc2NoZW1lLCBzZWNyZXQsIGxvZ2luLCBwYXJhbXMpO1xuICAgIGlmIChsb2dpbikge1xuICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbihjdHJsID0+IHRoaXMuI2xvZ2luU3VjY2Vzc2Z1bChjdHJsKSk7XG4gICAgfVxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSB1c2VyIHdpdGggPGNvZGU+J2Jhc2ljJzwvY29kZT4gYXV0aGVudGljYXRpb24gc2NoZW1lIGFuZCBpbW1lZGlhdGVseVxuICAgKiB1c2UgaXQgZm9yIGF1dGhlbnRpY2F0aW9uLiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI2FjY291bnR9LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXNlcm5hbWUgLSBMb2dpbiB0byB1c2UgZm9yIHRoZSBuZXcgYWNjb3VudC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhc3N3b3JkIC0gVXNlcidzIHBhc3N3b3JkLlxuICAgKiBAcGFyYW0ge0FjY291bnRQYXJhbXM9fSBwYXJhbXMgLSBVc2VyIGRhdGEgdG8gcGFzcyB0byB0aGUgc2VydmVyLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gc2VydmVyIHJlcGx5IGlzIHJlY2VpdmVkLlxuICAgKi9cbiAgY3JlYXRlQWNjb3VudEJhc2ljKHVzZXJuYW1lLCBwYXNzd29yZCwgcGFyYW1zKSB7XG4gICAgLy8gTWFrZSBzdXJlIHdlIGFyZSBub3QgdXNpbmcgJ251bGwnIG9yICd1bmRlZmluZWQnO1xuICAgIHVzZXJuYW1lID0gdXNlcm5hbWUgfHwgJyc7XG4gICAgcGFzc3dvcmQgPSBwYXNzd29yZCB8fCAnJztcbiAgICByZXR1cm4gdGhpcy5jcmVhdGVBY2NvdW50KCdiYXNpYycsXG4gICAgICBiNjRFbmNvZGVVbmljb2RlKHVzZXJuYW1lICsgJzonICsgcGFzc3dvcmQpLCB0cnVlLCBwYXJhbXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSB1c2VyJ3MgY3JlZGVudGlhbHMgZm9yIDxjb2RlPidiYXNpYyc8L2NvZGU+IGF1dGhlbnRpY2F0aW9uIHNjaGVtZS4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNhY2NvdW50fS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVpZCAtIFVzZXIgSUQgdG8gdXBkYXRlLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXNlcm5hbWUgLSBMb2dpbiB0byB1c2UgZm9yIHRoZSBuZXcgYWNjb3VudC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhc3N3b3JkIC0gVXNlcidzIHBhc3N3b3JkLlxuICAgKiBAcGFyYW0ge0FjY291bnRQYXJhbXM9fSBwYXJhbXMgLSBkYXRhIHRvIHBhc3MgdG8gdGhlIHNlcnZlci5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHNlcnZlciByZXBseSBpcyByZWNlaXZlZC5cbiAgICovXG4gIHVwZGF0ZUFjY291bnRCYXNpYyh1aWQsIHVzZXJuYW1lLCBwYXNzd29yZCwgcGFyYW1zKSB7XG4gICAgLy8gTWFrZSBzdXJlIHdlIGFyZSBub3QgdXNpbmcgJ251bGwnIG9yICd1bmRlZmluZWQnO1xuICAgIHVzZXJuYW1lID0gdXNlcm5hbWUgfHwgJyc7XG4gICAgcGFzc3dvcmQgPSBwYXNzd29yZCB8fCAnJztcbiAgICByZXR1cm4gdGhpcy5hY2NvdW50KHVpZCwgJ2Jhc2ljJyxcbiAgICAgIGI2NEVuY29kZVVuaWNvZGUodXNlcm5hbWUgKyAnOicgKyBwYXNzd29yZCksIGZhbHNlLCBwYXJhbXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgaGFuZHNoYWtlIHRvIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiBzZXJ2ZXIgcmVwbHkgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICBoZWxsbygpIHtcbiAgICBjb25zdCBwa3QgPSB0aGlzLiNpbml0UGFja2V0KCdoaScpO1xuXG4gICAgcmV0dXJuIHRoaXMuI3NlbmQocGt0LCBwa3QuaGkuaWQpXG4gICAgICAudGhlbihjdHJsID0+IHtcbiAgICAgICAgLy8gUmVzZXQgYmFja29mZiBjb3VudGVyIG9uIHN1Y2Nlc3NmdWwgY29ubmVjdGlvbi5cbiAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5iYWNrb2ZmUmVzZXQoKTtcblxuICAgICAgICAvLyBTZXJ2ZXIgcmVzcG9uc2UgY29udGFpbnMgc2VydmVyIHByb3RvY29sIHZlcnNpb24sIGJ1aWxkLCBjb25zdHJhaW50cyxcbiAgICAgICAgLy8gc2Vzc2lvbiBJRCBmb3IgbG9uZyBwb2xsaW5nLiBTYXZlIHRoZW0uXG4gICAgICAgIGlmIChjdHJsLnBhcmFtcykge1xuICAgICAgICAgIHRoaXMuX3NlcnZlckluZm8gPSBjdHJsLnBhcmFtcztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm9uQ29ubmVjdCkge1xuICAgICAgICAgIHRoaXMub25Db25uZWN0KCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY3RybDtcbiAgICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24ucmVjb25uZWN0KHRydWUpO1xuXG4gICAgICAgIGlmICh0aGlzLm9uRGlzY29ubmVjdCkge1xuICAgICAgICAgIHRoaXMub25EaXNjb25uZWN0KGVycik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCBvciByZWZyZXNoIHRoZSBwdXNoIG5vdGlmaWNhdGlvbnMvZGV2aWNlIHRva2VuLiBJZiB0aGUgY2xpZW50IGlzIGNvbm5lY3RlZCxcbiAgICogdGhlIGRldmljZVRva2VuIGNhbiBiZSBzZW50IHRvIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBkdCAtIHRva2VuIG9idGFpbmVkIGZyb20gdGhlIHByb3ZpZGVyIG9yIDxjb2RlPmZhbHNlPC9jb2RlPixcbiAgICogICAgPGNvZGU+bnVsbDwvY29kZT4gb3IgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPiB0byBjbGVhciB0aGUgdG9rZW4uXG4gICAqXG4gICAqIEByZXR1cm5zIDxjb2RlPnRydWU8L2NvZGU+IGlmIGF0dGVtcHQgd2FzIG1hZGUgdG8gc2VuZCB0aGUgdXBkYXRlIHRvIHRoZSBzZXJ2ZXIuXG4gICAqL1xuICBzZXREZXZpY2VUb2tlbihkdCkge1xuICAgIGxldCBzZW50ID0gZmFsc2U7XG4gICAgLy8gQ29udmVydCBhbnkgZmFsc2lzaCB2YWx1ZSB0byBudWxsLlxuICAgIGR0ID0gZHQgfHwgbnVsbDtcbiAgICBpZiAoZHQgIT0gdGhpcy5fZGV2aWNlVG9rZW4pIHtcbiAgICAgIHRoaXMuX2RldmljZVRva2VuID0gZHQ7XG4gICAgICBpZiAodGhpcy5pc0Nvbm5lY3RlZCgpICYmIHRoaXMuaXNBdXRoZW50aWNhdGVkKCkpIHtcbiAgICAgICAgdGhpcy4jc2VuZCh7XG4gICAgICAgICAgJ2hpJzoge1xuICAgICAgICAgICAgJ2Rldic6IGR0IHx8IFRpbm9kZS5ERUxfQ0hBUlxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHNlbnQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc2VudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAdHlwZWRlZiBDcmVkZW50aWFsXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBtZXRoIC0gdmFsaWRhdGlvbiBtZXRob2QuXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB2YWwgLSB2YWx1ZSB0byB2YWxpZGF0ZSAoZS5nLiBlbWFpbCBvciBwaG9uZSBudW1iZXIpLlxuICAgKiBAcHJvcGVydHkge3N0cmluZ30gcmVzcCAtIHZhbGlkYXRpb24gcmVzcG9uc2UuXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBwYXJhbXMgLSB2YWxpZGF0aW9uIHBhcmFtZXRlcnMuXG4gICAqL1xuICAvKipcbiAgICogQXV0aGVudGljYXRlIGN1cnJlbnQgc2Vzc2lvbi5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNjaGVtZSAtIEF1dGhlbnRpY2F0aW9uIHNjaGVtZTsgPGNvZGU+XCJiYXNpY1wiPC9jb2RlPiBpcyB0aGUgb25seSBjdXJyZW50bHkgc3VwcG9ydGVkIHNjaGVtZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHNlY3JldCAtIEF1dGhlbnRpY2F0aW9uIHNlY3JldCwgYXNzdW1lZCB0byBiZSBhbHJlYWR5IGJhc2U2NCBlbmNvZGVkLlxuICAgKiBAcGFyYW0ge0NyZWRlbnRpYWw9fSBjcmVkIC0gY3JlZGVudGlhbCBjb25maXJtYXRpb24sIGlmIHJlcXVpcmVkLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gc2VydmVyIHJlcGx5IGlzIHJlY2VpdmVkLlxuICAgKi9cbiAgbG9naW4oc2NoZW1lLCBzZWNyZXQsIGNyZWQpIHtcbiAgICBjb25zdCBwa3QgPSB0aGlzLiNpbml0UGFja2V0KCdsb2dpbicpO1xuICAgIHBrdC5sb2dpbi5zY2hlbWUgPSBzY2hlbWU7XG4gICAgcGt0LmxvZ2luLnNlY3JldCA9IHNlY3JldDtcbiAgICBwa3QubG9naW4uY3JlZCA9IGNyZWQ7XG5cbiAgICByZXR1cm4gdGhpcy4jc2VuZChwa3QsIHBrdC5sb2dpbi5pZClcbiAgICAgIC50aGVuKGN0cmwgPT4gdGhpcy4jbG9naW5TdWNjZXNzZnVsKGN0cmwpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI2xvZ2lufSB3aXRoIGJhc2ljIGF1dGhlbnRpY2F0aW9uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1bmFtZSAtIFVzZXIgbmFtZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhc3N3b3JkICAtIFBhc3N3b3JkLlxuICAgKiBAcGFyYW0ge0NyZWRlbnRpYWw9fSBjcmVkIC0gY3JlZGVudGlhbCBjb25maXJtYXRpb24sIGlmIHJlcXVpcmVkLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICBsb2dpbkJhc2ljKHVuYW1lLCBwYXNzd29yZCwgY3JlZCkge1xuICAgIHJldHVybiB0aGlzLmxvZ2luKCdiYXNpYycsIGI2NEVuY29kZVVuaWNvZGUodW5hbWUgKyAnOicgKyBwYXNzd29yZCksIGNyZWQpXG4gICAgICAudGhlbihjdHJsID0+IHtcbiAgICAgICAgdGhpcy5fbG9naW4gPSB1bmFtZTtcbiAgICAgICAgcmV0dXJuIGN0cmw7XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI2xvZ2lufSB3aXRoIHRva2VuIGF1dGhlbnRpY2F0aW9uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b2tlbiAtIFRva2VuIHJlY2VpdmVkIGluIHJlc3BvbnNlIHRvIGVhcmxpZXIgbG9naW4uXG4gICAqIEBwYXJhbSB7Q3JlZGVudGlhbD19IGNyZWQgLSBjcmVkZW50aWFsIGNvbmZpcm1hdGlvbiwgaWYgcmVxdWlyZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIGxvZ2luVG9rZW4odG9rZW4sIGNyZWQpIHtcbiAgICByZXR1cm4gdGhpcy5sb2dpbigndG9rZW4nLCB0b2tlbiwgY3JlZCk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZCBhIHJlcXVlc3QgZm9yIHJlc2V0dGluZyBhbiBhdXRoZW50aWNhdGlvbiBzZWNyZXQuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzY2hlbWUgLSBhdXRoZW50aWNhdGlvbiBzY2hlbWUgdG8gcmVzZXQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2QgLSBtZXRob2QgdG8gdXNlIGZvciByZXNldHRpbmcgdGhlIHNlY3JldCwgc3VjaCBhcyBcImVtYWlsXCIgb3IgXCJ0ZWxcIi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIC0gdmFsdWUgb2YgdGhlIGNyZWRlbnRpYWwgdG8gdXNlLCBhIHNwZWNpZmljIGVtYWlsIGFkZHJlc3Mgb3IgYSBwaG9uZSBudW1iZXIuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHRoZSBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICByZXF1ZXN0UmVzZXRBdXRoU2VjcmV0KHNjaGVtZSwgbWV0aG9kLCB2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLmxvZ2luKCdyZXNldCcsIGI2NEVuY29kZVVuaWNvZGUoc2NoZW1lICsgJzonICsgbWV0aG9kICsgJzonICsgdmFsdWUpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAdHlwZWRlZiBBdXRoVG9rZW5cbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IHRva2VuIC0gVG9rZW4gdmFsdWUuXG4gICAqIEBwcm9wZXJ0eSB7RGF0ZX0gZXhwaXJlcyAtIFRva2VuIGV4cGlyYXRpb24gdGltZS5cbiAgICovXG4gIC8qKlxuICAgKiBHZXQgc3RvcmVkIGF1dGhlbnRpY2F0aW9uIHRva2VuLlxuICAgKlxuICAgKiBAcmV0dXJucyB7QXV0aFRva2VufSBhdXRoZW50aWNhdGlvbiB0b2tlbi5cbiAgICovXG4gIGdldEF1dGhUb2tlbigpIHtcbiAgICBpZiAodGhpcy5fYXV0aFRva2VuICYmICh0aGlzLl9hdXRoVG9rZW4uZXhwaXJlcy5nZXRUaW1lKCkgPiBEYXRlLm5vdygpKSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2F1dGhUb2tlbjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fYXV0aFRva2VuID0gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKipcbiAgICogQXBwbGljYXRpb24gbWF5IHByb3ZpZGUgYSBzYXZlZCBhdXRoZW50aWNhdGlvbiB0b2tlbi5cbiAgICpcbiAgICogQHBhcmFtIHtBdXRoVG9rZW59IHRva2VuIC0gYXV0aGVudGljYXRpb24gdG9rZW4uXG4gICAqL1xuICBzZXRBdXRoVG9rZW4odG9rZW4pIHtcbiAgICB0aGlzLl9hdXRoVG9rZW4gPSB0b2tlbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBAdHlwZWRlZiBTZXRQYXJhbXNcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByb3BlcnR5IHtTZXREZXNjPX0gZGVzYyAtIFRvcGljIGluaXRpYWxpemF0aW9uIHBhcmFtZXRlcnMgd2hlbiBjcmVhdGluZyBhIG5ldyB0b3BpYyBvciBhIG5ldyBzdWJzY3JpcHRpb24uXG4gICAqIEBwcm9wZXJ0eSB7U2V0U3ViPX0gc3ViIC0gU3Vic2NyaXB0aW9uIGluaXRpYWxpemF0aW9uIHBhcmFtZXRlcnMuXG4gICAqIEBwcm9wZXJ0eSB7QXJyYXkuPHN0cmluZz49fSBhdHRhY2htZW50cyAtIFVSTHMgb2Ygb3V0IG9mIGJhbmQgYXR0YWNobWVudHMgdXNlZCBpbiBwYXJhbWV0ZXJzLlxuICAgKi9cbiAgLyoqXG4gICAqIEB0eXBlZGVmIFNldERlc2NcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByb3BlcnR5IHtEZWZBY3M9fSBkZWZhY3MgLSBEZWZhdWx0IGFjY2VzcyBtb2RlLlxuICAgKiBAcHJvcGVydHkge09iamVjdD19IHB1YmxpYyAtIEZyZWUtZm9ybSB0b3BpYyBkZXNjcmlwdGlvbiwgcHVibGljYWxseSBhY2Nlc3NpYmxlLlxuICAgKiBAcHJvcGVydHkge09iamVjdD19IHByaXZhdGUgLSBGcmVlLWZvcm0gdG9waWMgZGVzY3JpcHRpb24gYWNjZXNzaWJsZSBvbmx5IHRvIHRoZSBvd25lci5cbiAgICogQHByb3BlcnR5IHtPYmplY3Q9fSB0cnVzdGVkIC0gVHJ1c3RlZCB1c2VyIGRhdGEgd2hpY2ggY2FuIGJlIHNldCBieSBhIHJvb3QgdXNlciBvbmx5LlxuICAgKi9cbiAgLyoqXG4gICAqIEB0eXBlZGVmIFNldFN1YlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJvcGVydHkge3N0cmluZz19IHVzZXIgLSBVSUQgb2YgdGhlIHVzZXIgYWZmZWN0ZWQgYnkgdGhlIHJlcXVlc3QuIERlZmF1bHQgKGVtcHR5KSAtIGN1cnJlbnQgdXNlci5cbiAgICogQHByb3BlcnR5IHtzdHJpbmc9fSBtb2RlIC0gVXNlciBhY2Nlc3MgbW9kZSwgZWl0aGVyIHJlcXVlc3RlZCBvciBhc3NpZ25lZCBkZXBlbmRlbnQgb24gY29udGV4dC5cbiAgICovXG4gIC8qKlxuICAgKiBTZW5kIGEgdG9waWMgc3Vic2NyaXB0aW9uIHJlcXVlc3QuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpYyAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIHN1YnNjcmliZSB0by5cbiAgICogQHBhcmFtIHtHZXRRdWVyeT19IGdldFBhcmFtcyAtIE9wdGlvbmFsIHN1YnNjcmlwdGlvbiBtZXRhZGF0YSBxdWVyeVxuICAgKiBAcGFyYW0ge1NldFBhcmFtcz19IHNldFBhcmFtcyAtIE9wdGlvbmFsIGluaXRpYWxpemF0aW9uIHBhcmFtZXRlcnNcbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgc3Vic2NyaWJlKHRvcGljTmFtZSwgZ2V0UGFyYW1zLCBzZXRQYXJhbXMpIHtcbiAgICBjb25zdCBwa3QgPSB0aGlzLiNpbml0UGFja2V0KCdzdWInLCB0b3BpY05hbWUpXG4gICAgaWYgKCF0b3BpY05hbWUpIHtcbiAgICAgIHRvcGljTmFtZSA9IENvbnN0LlRPUElDX05FVztcbiAgICB9XG5cbiAgICBwa3Quc3ViLmdldCA9IGdldFBhcmFtcztcblxuICAgIGlmIChzZXRQYXJhbXMpIHtcbiAgICAgIGlmIChzZXRQYXJhbXMuc3ViKSB7XG4gICAgICAgIHBrdC5zdWIuc2V0LnN1YiA9IHNldFBhcmFtcy5zdWI7XG4gICAgICB9XG5cbiAgICAgIGlmIChzZXRQYXJhbXMuZGVzYykge1xuICAgICAgICBjb25zdCBkZXNjID0gc2V0UGFyYW1zLmRlc2M7XG4gICAgICAgIGlmIChUaW5vZGUuaXNOZXdHcm91cFRvcGljTmFtZSh0b3BpY05hbWUpKSB7XG4gICAgICAgICAgLy8gRnVsbCBzZXQuZGVzYyBwYXJhbXMgYXJlIHVzZWQgZm9yIG5ldyB0b3BpY3Mgb25seVxuICAgICAgICAgIHBrdC5zdWIuc2V0LmRlc2MgPSBkZXNjO1xuICAgICAgICB9IGVsc2UgaWYgKFRpbm9kZS5pc1AyUFRvcGljTmFtZSh0b3BpY05hbWUpICYmIGRlc2MuZGVmYWNzKSB7XG4gICAgICAgICAgLy8gVXNlIG9wdGlvbmFsIGRlZmF1bHQgcGVybWlzc2lvbnMgb25seS5cbiAgICAgICAgICBwa3Quc3ViLnNldC5kZXNjID0ge1xuICAgICAgICAgICAgZGVmYWNzOiBkZXNjLmRlZmFjc1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gU2VlIGlmIGV4dGVybmFsIG9iamVjdHMgd2VyZSB1c2VkIGluIHRvcGljIGRlc2NyaXB0aW9uLlxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoc2V0UGFyYW1zLmF0dGFjaG1lbnRzKSAmJiBzZXRQYXJhbXMuYXR0YWNobWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICBwa3QuZXh0cmEgPSB7XG4gICAgICAgICAgYXR0YWNobWVudHM6IHNldFBhcmFtcy5hdHRhY2htZW50cy5maWx0ZXIocmVmID0+IGlzVXJsUmVsYXRpdmUocmVmKSlcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgaWYgKHNldFBhcmFtcy50YWdzKSB7XG4gICAgICAgIHBrdC5zdWIuc2V0LnRhZ3MgPSBzZXRQYXJhbXMudGFncztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuI3NlbmQocGt0LCBwa3Quc3ViLmlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRhY2ggYW5kIG9wdGlvbmFsbHkgdW5zdWJzY3JpYmUgZnJvbSB0aGUgdG9waWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljIC0gVG9waWMgdG8gZGV0YWNoIGZyb20uXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gdW5zdWIgLSBJZiA8Y29kZT50cnVlPC9jb2RlPiwgZGV0YWNoIGFuZCB1bnN1YnNjcmliZSwgb3RoZXJ3aXNlIGp1c3QgZGV0YWNoLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICBsZWF2ZSh0b3BpYywgdW5zdWIpIHtcbiAgICBjb25zdCBwa3QgPSB0aGlzLiNpbml0UGFja2V0KCdsZWF2ZScsIHRvcGljKTtcbiAgICBwa3QubGVhdmUudW5zdWIgPSB1bnN1YjtcblxuICAgIHJldHVybiB0aGlzLiNzZW5kKHBrdCwgcGt0LmxlYXZlLmlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgbWVzc2FnZSBkcmFmdCB3aXRob3V0IHNlbmRpbmcgaXQgdG8gdGhlIHNlcnZlci5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gcHVibGlzaCB0by5cbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRlbnQgLSBQYXlsb2FkIHRvIHB1Ymxpc2guXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IG5vRWNobyAtIElmIDxjb2RlPnRydWU8L2NvZGU+LCB0ZWxsIHRoZSBzZXJ2ZXIgbm90IHRvIGVjaG8gdGhlIG1lc3NhZ2UgdG8gdGhlIG9yaWdpbmFsIHNlc3Npb24uXG4gICAqXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IG5ldyBtZXNzYWdlIHdoaWNoIGNhbiBiZSBzZW50IHRvIHRoZSBzZXJ2ZXIgb3Igb3RoZXJ3aXNlIHVzZWQuXG4gICAqL1xuICBjcmVhdGVNZXNzYWdlKHRvcGljLCBjb250ZW50LCBub0VjaG8pIHtcbiAgICBjb25zdCBwa3QgPSB0aGlzLiNpbml0UGFja2V0KCdwdWInLCB0b3BpYyk7XG5cbiAgICBsZXQgZGZ0ID0gdHlwZW9mIGNvbnRlbnQgPT0gJ3N0cmluZycgPyBEcmFmdHkucGFyc2UoY29udGVudCkgOiBjb250ZW50O1xuICAgIGlmIChkZnQgJiYgIURyYWZ0eS5pc1BsYWluVGV4dChkZnQpKSB7XG4gICAgICBwa3QucHViLmhlYWQgPSB7XG4gICAgICAgIG1pbWU6IERyYWZ0eS5nZXRDb250ZW50VHlwZSgpXG4gICAgICB9O1xuICAgICAgY29udGVudCA9IGRmdDtcbiAgICB9XG4gICAgcGt0LnB1Yi5ub2VjaG8gPSBub0VjaG87XG4gICAgcGt0LnB1Yi5jb250ZW50ID0gY29udGVudDtcblxuICAgIHJldHVybiBwa3QucHViO1xuICB9XG5cbiAgLyoqXG4gICAqIFB1Ymxpc2gge2RhdGF9IG1lc3NhZ2UgdG8gdG9waWMuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byBwdWJsaXNoIHRvLlxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGVudCAtIFBheWxvYWQgdG8gcHVibGlzaC5cbiAgICogQHBhcmFtIHtib29sZWFuPX0gbm9FY2hvIC0gSWYgPGNvZGU+dHJ1ZTwvY29kZT4sIHRlbGwgdGhlIHNlcnZlciBub3QgdG8gZWNobyB0aGUgbWVzc2FnZSB0byB0aGUgb3JpZ2luYWwgc2Vzc2lvbi5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgcHVibGlzaCh0b3BpY05hbWUsIGNvbnRlbnQsIG5vRWNobykge1xuICAgIHJldHVybiB0aGlzLnB1Ymxpc2hNZXNzYWdlKFxuICAgICAgdGhpcy5jcmVhdGVNZXNzYWdlKHRvcGljTmFtZSwgY29udGVudCwgbm9FY2hvKVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogUHVibGlzaCBtZXNzYWdlIHRvIHRvcGljLiBUaGUgbWVzc2FnZSBzaG91bGQgYmUgY3JlYXRlZCBieSB7QGxpbmsgVGlub2RlI2NyZWF0ZU1lc3NhZ2V9LlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcHViIC0gTWVzc2FnZSB0byBwdWJsaXNoLlxuICAgKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+PX0gYXR0YWNobWVudHMgLSBhcnJheSBvZiBVUkxzIHdpdGggYXR0YWNobWVudHMuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIHB1Ymxpc2hNZXNzYWdlKHB1YiwgYXR0YWNobWVudHMpIHtcbiAgICAvLyBNYWtlIGEgc2hhbGxvdyBjb3B5LiBOZWVkZWQgaW4gb3JkZXIgdG8gY2xlYXIgbG9jYWxseS1hc3NpZ25lZCB0ZW1wIHZhbHVlcztcbiAgICBwdWIgPSBPYmplY3QuYXNzaWduKHt9LCBwdWIpO1xuICAgIHB1Yi5zZXEgPSB1bmRlZmluZWQ7XG4gICAgcHViLmZyb20gPSB1bmRlZmluZWQ7XG4gICAgcHViLnRzID0gdW5kZWZpbmVkO1xuICAgIGNvbnN0IG1zZyA9IHtcbiAgICAgIHB1YjogcHViLFxuICAgIH07XG4gICAgaWYgKGF0dGFjaG1lbnRzKSB7XG4gICAgICBtc2cuZXh0cmEgPSB7XG4gICAgICAgIGF0dGFjaG1lbnRzOiBhdHRhY2htZW50cy5maWx0ZXIocmVmID0+IGlzVXJsUmVsYXRpdmUocmVmKSlcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiB0aGlzLiNzZW5kKG1zZywgcHViLmlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPdXQgb2YgYmFuZCBub3RpZmljYXRpb246IG5vdGlmeSB0b3BpYyB0aGF0IGFuIGV4dGVybmFsIChwdXNoKSBub3RpZmljYXRpb24gd2FzIHJlY2l2ZWQgYnkgdGhlIGNsaWVudC5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IGRhdGEgLSBub3RpZmljYXRpb24gcGF5bG9hZC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGRhdGEud2hhdCAtIG5vdGlmaWNhdGlvbiB0eXBlLCAnbXNnJywgJ3JlYWQnLCAnc3ViJy5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGRhdGEudG9waWMgLSBuYW1lIG9mIHRoZSB1cGRhdGVkIHRvcGljLlxuICAgKiBAcGFyYW0ge251bWJlcj19IGRhdGEuc2VxIC0gc2VxIElEIG9mIHRoZSBhZmZlY3RlZCBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge3N0cmluZz19IGRhdGEueGZyb20gLSBVSUQgb2YgdGhlIHNlbmRlci5cbiAgICogQHBhcmFtIHtvYmplY3Q9fSBkYXRhLmdpdmVuIC0gbmV3IHN1YnNjcmlwdGlvbiAnZ2l2ZW4nLCBlLmcuICdBU1dQLi4uJy5cbiAgICogQHBhcmFtIHtvYmplY3Q9fSBkYXRhLndhbnQgLSBuZXcgc3Vic2NyaXB0aW9uICd3YW50JywgZS5nLiAnUldKLi4uJy5cbiAgICovXG4gIG9vYk5vdGlmaWNhdGlvbihkYXRhKSB7XG4gICAgdGhpcy5sb2dnZXIoJ29vYjogJyArICh0aGlzLl90cmltTG9uZ1N0cmluZ3MgPyBKU09OLnN0cmluZ2lmeShkYXRhLCBqc29uTG9nZ2VySGVscGVyKSA6IGRhdGEpKTtcblxuICAgIHN3aXRjaCAoZGF0YS53aGF0KSB7XG4gICAgICBjYXNlICdtc2cnOlxuICAgICAgICBpZiAoIWRhdGEuc2VxIHx8IGRhdGEuc2VxIDwgMSB8fCAhZGF0YS50b3BpYykge1xuICAgICAgICAgIC8vIFNlcnZlciBzZW50IGludmFsaWQgZGF0YS5cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5pc0Nvbm5lY3RlZCgpKSB7XG4gICAgICAgICAgLy8gTGV0J3MgaWdub3JlIHRoZSBtZXNzYWdlIGlmIHRoZXJlIGlzIG5vIGNvbm5lY3Rpb246IG5vIGNvbm5lY3Rpb24gbWVhbnMgdGhlcmUgYXJlIG5vIG9wZW5cbiAgICAgICAgICAvLyB0YWJzIHdpdGggVGlub2RlLlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdG9waWMgPSB0aGlzLiNjYWNoZUdldCgndG9waWMnLCBkYXRhLnRvcGljKTtcbiAgICAgICAgaWYgKCF0b3BpYykge1xuICAgICAgICAgIC8vIFRPRE86IGNoZWNrIGlmIHRoZXJlIGlzIGEgY2FzZSB3aGVuIGEgbWVzc2FnZSBjYW4gYXJyaXZlIGZyb20gYW4gdW5rbm93biB0b3BpYy5cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0b3BpYy5pc1N1YnNjcmliZWQoKSkge1xuICAgICAgICAgIC8vIE5vIG5lZWQgdG8gZmV0Y2g6IHRvcGljIGlzIGFscmVhZHkgc3Vic2NyaWJlZCBhbmQgZ290IGRhdGEgdGhyb3VnaCBub3JtYWwgY2hhbm5lbC5cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0b3BpYy5tYXhNc2dTZXEoKSA8IGRhdGEuc2VxKSB7XG4gICAgICAgICAgaWYgKHRvcGljLmlzQ2hhbm5lbFR5cGUoKSkge1xuICAgICAgICAgICAgdG9waWMuX3VwZGF0ZVJlY2VpdmVkKGRhdGEuc2VxLCAnZmFrZS11aWQnKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBOZXcgbWVzc2FnZS5cbiAgICAgICAgICBpZiAoZGF0YS54ZnJvbSAmJiAhdGhpcy4jY2FjaGVHZXQoJ3VzZXInLCBkYXRhLnhmcm9tKSkge1xuICAgICAgICAgICAgLy8gTWVzc2FnZSBmcm9tIHVua25vd24gc2VuZGVyLCBmZXRjaCBkZXNjcmlwdGlvbiBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAgICAgICAgICAvLyBTZW5kaW5nIGFzeW5jaHJvbm91c2x5IHdpdGhvdXQgYSBzdWJzY3JpcHRpb24uXG4gICAgICAgICAgICB0aGlzLmdldE1ldGEoZGF0YS54ZnJvbSwgbmV3IE1ldGFHZXRCdWlsZGVyKCkud2l0aERlc2MoKS5idWlsZCgpKS5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmxvZ2dlcihcIkZhaWxlZCB0byBnZXQgdGhlIG5hbWUgb2YgYSBuZXcgc2VuZGVyXCIsIGVycik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0b3BpYy5zdWJzY3JpYmUobnVsbCkudGhlbihfID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0b3BpYy5nZXRNZXRhKG5ldyBNZXRhR2V0QnVpbGRlcih0b3BpYykud2l0aExhdGVyRGF0YSgyNCkud2l0aExhdGVyRGVsKDI0KS5idWlsZCgpKTtcbiAgICAgICAgICB9KS50aGVuKF8gPT4ge1xuICAgICAgICAgICAgLy8gQWxsb3cgZGF0YSBmZXRjaCB0byBjb21wbGV0ZSBhbmQgZ2V0IHByb2Nlc3NlZCBzdWNjZXNzZnVsbHkuXG4gICAgICAgICAgICB0b3BpYy5sZWF2ZURlbGF5ZWQoZmFsc2UsIDEwMDApO1xuICAgICAgICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlcihcIk9uIHB1c2ggZGF0YSBmZXRjaCBmYWlsZWRcIiwgZXJyKTtcbiAgICAgICAgICB9KS5maW5hbGx5KF8gPT4ge1xuICAgICAgICAgICAgdGhpcy5nZXRNZVRvcGljKCkuX3JlZnJlc2hDb250YWN0KCdtc2cnLCB0b3BpYyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3JlYWQnOlxuICAgICAgICB0aGlzLmdldE1lVG9waWMoKS5fcm91dGVQcmVzKHtcbiAgICAgICAgICB3aGF0OiAncmVhZCcsXG4gICAgICAgICAgc2VxOiBkYXRhLnNlcVxuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3N1Yic6XG4gICAgICAgIGlmICghdGhpcy5pc01lKGRhdGEueGZyb20pKSB7XG4gICAgICAgICAgLy8gVE9ETzogaGFuZGxlIHVwZGF0ZXMgZnJvbSBvdGhlciB1c2Vycy5cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG1vZGUgPSB7XG4gICAgICAgICAgZ2l2ZW46IGRhdGEubW9kZUdpdmVuLFxuICAgICAgICAgIHdhbnQ6IGRhdGEubW9kZVdhbnRcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgYWNzID0gbmV3IEFjY2Vzc01vZGUobW9kZSk7XG4gICAgICAgIGNvbnN0IHByZXMgPSAoIWFjcy5tb2RlIHx8IGFjcy5tb2RlID09IEFjY2Vzc01vZGUuX05PTkUpID9cbiAgICAgICAgICAvLyBTdWJzY3JpcHRpb24gZGVsZXRlZC5cbiAgICAgICAgICB7XG4gICAgICAgICAgICB3aGF0OiAnZ29uZScsXG4gICAgICAgICAgICBzcmM6IGRhdGEudG9waWNcbiAgICAgICAgICB9IDpcbiAgICAgICAgICAvLyBOZXcgc3Vic2NyaXB0aW9uIG9yIHN1YnNjcmlwdGlvbiB1cGRhdGVkLlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHdoYXQ6ICdhY3MnLFxuICAgICAgICAgICAgc3JjOiBkYXRhLnRvcGljLFxuICAgICAgICAgICAgZGFjczogbW9kZVxuICAgICAgICAgIH07XG4gICAgICAgIHRoaXMuZ2V0TWVUb3BpYygpLl9yb3V0ZVByZXMocHJlcyk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLmxvZ2dlcihcIlVua25vd24gcHVzaCB0eXBlIGlnbm9yZWRcIiwgZGF0YS53aGF0KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHR5cGVkZWYgR2V0UXVlcnlcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByb3BlcnR5IHtHZXRPcHRzVHlwZT19IGRlc2MgLSBJZiBwcm92aWRlZCAoZXZlbiBpZiBlbXB0eSksIGZldGNoIHRvcGljIGRlc2NyaXB0aW9uLlxuICAgKiBAcHJvcGVydHkge0dldE9wdHNUeXBlPX0gc3ViIC0gSWYgcHJvdmlkZWQgKGV2ZW4gaWYgZW1wdHkpLCBmZXRjaCB0b3BpYyBzdWJzY3JpcHRpb25zLlxuICAgKiBAcHJvcGVydHkge0dldERhdGFUeXBlPX0gZGF0YSAtIElmIHByb3ZpZGVkIChldmVuIGlmIGVtcHR5KSwgZ2V0IG1lc3NhZ2VzLlxuICAgKi9cblxuICAvKipcbiAgICogQHR5cGVkZWYgR2V0T3B0c1R5cGVcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByb3BlcnR5IHtEYXRlPX0gaW1zIC0gXCJJZiBtb2RpZmllZCBzaW5jZVwiLCBmZXRjaCBkYXRhIG9ubHkgaXQgd2FzIHdhcyBtb2RpZmllZCBzaW5jZSBzdGF0ZWQgZGF0ZS5cbiAgICogQHByb3BlcnR5IHtudW1iZXI9fSBsaW1pdCAtIE1heGltdW0gbnVtYmVyIG9mIHJlc3VsdHMgdG8gcmV0dXJuLiBJZ25vcmVkIHdoZW4gcXVlcnlpbmcgdG9waWMgZGVzY3JpcHRpb24uXG4gICAqL1xuXG4gIC8qKlxuICAgKiBAdHlwZWRlZiBHZXREYXRhVHlwZVxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJvcGVydHkge251bWJlcj19IHNpbmNlIC0gTG9hZCBtZXNzYWdlcyB3aXRoIHNlcSBpZCBlcXVhbCBvciBncmVhdGVyIHRoYW4gdGhpcyB2YWx1ZS5cbiAgICogQHByb3BlcnR5IHtudW1iZXI9fSBiZWZvcmUgLSBMb2FkIG1lc3NhZ2VzIHdpdGggc2VxIGlkIGxvd2VyIHRoYW4gdGhpcyBudW1iZXIuXG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyPX0gbGltaXQgLSBNYXhpbXVtIG51bWJlciBvZiByZXN1bHRzIHRvIHJldHVybi5cbiAgICovXG5cbiAgLyoqXG4gICAqIFJlcXVlc3QgdG9waWMgbWV0YWRhdGFcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gcXVlcnkuXG4gICAqIEBwYXJhbSB7R2V0UXVlcnl9IHBhcmFtcyAtIFBhcmFtZXRlcnMgb2YgdGhlIHF1ZXJ5LiBVc2Uge0BsaW5rIFRpbm9kZS5NZXRhR2V0QnVpbGRlcn0gdG8gZ2VuZXJhdGUuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIGdldE1ldGEodG9waWMsIHBhcmFtcykge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ2dldCcsIHRvcGljKTtcblxuICAgIHBrdC5nZXQgPSBtZXJnZU9iaihwa3QuZ2V0LCBwYXJhbXMpO1xuXG4gICAgcmV0dXJuIHRoaXMuI3NlbmQocGt0LCBwa3QuZ2V0LmlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgdG9waWMncyBtZXRhZGF0YTogZGVzY3JpcHRpb24sIHN1YnNjcmlidGlvbnMuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpYyAtIFRvcGljIHRvIHVwZGF0ZS5cbiAgICogQHBhcmFtIHtTZXRQYXJhbXN9IHBhcmFtcyAtIHRvcGljIG1ldGFkYXRhIHRvIHVwZGF0ZS5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgc2V0TWV0YSh0b3BpYywgcGFyYW1zKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnc2V0JywgdG9waWMpO1xuICAgIGNvbnN0IHdoYXQgPSBbXTtcblxuICAgIGlmIChwYXJhbXMpIHtcbiAgICAgIFsnZGVzYycsICdzdWInLCAndGFncycsICdjcmVkJywgJ2VwaGVtZXJhbCddLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIGlmIChwYXJhbXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgIHdoYXQucHVzaChrZXkpO1xuICAgICAgICAgIHBrdC5zZXRba2V5XSA9IHBhcmFtc1trZXldO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkocGFyYW1zLmF0dGFjaG1lbnRzKSAmJiBwYXJhbXMuYXR0YWNobWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICBwa3QuZXh0cmEgPSB7XG4gICAgICAgICAgYXR0YWNobWVudHM6IHBhcmFtcy5hdHRhY2htZW50cy5maWx0ZXIocmVmID0+IGlzVXJsUmVsYXRpdmUocmVmKSlcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAod2hhdC5sZW5ndGggPT0gMCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkludmFsaWQge3NldH0gcGFyYW1ldGVyc1wiKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuI3NlbmQocGt0LCBwa3Quc2V0LmlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSYW5nZSBvZiBtZXNzYWdlIElEcyB0byBkZWxldGUuXG4gICAqXG4gICAqIEB0eXBlZGVmIERlbFJhbmdlXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBsb3cgLSBsb3cgZW5kIG9mIHRoZSByYW5nZSwgaW5jbHVzaXZlIChjbG9zZWQpLlxuICAgKiBAcHJvcGVydHkge251bWJlcj19IGhpIC0gaGlnaCBlbmQgb2YgdGhlIHJhbmdlLCBleGNsdXNpdmUgKG9wZW4pLlxuICAgKi9cbiAgLyoqXG4gICAqIERlbGV0ZSBzb21lIG9yIGFsbCBtZXNzYWdlcyBpbiBhIHRvcGljLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWMgLSBUb3BpYyBuYW1lIHRvIGRlbGV0ZSBtZXNzYWdlcyBmcm9tLlxuICAgKiBAcGFyYW0ge0RlbFJhbmdlW119IGxpc3QgLSBSYW5nZXMgb2YgbWVzc2FnZSBJRHMgdG8gZGVsZXRlLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBoYXJkIC0gSGFyZCBvciBzb2Z0IGRlbGV0ZVxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICBkZWxNZXNzYWdlcyh0b3BpYywgcmFuZ2VzLCBoYXJkKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnZGVsJywgdG9waWMpO1xuXG4gICAgcGt0LmRlbC53aGF0ID0gJ21zZyc7XG4gICAgcGt0LmRlbC5kZWxzZXEgPSByYW5nZXM7XG4gICAgcGt0LmRlbC5oYXJkID0gaGFyZDtcblxuICAgIHJldHVybiB0aGlzLiNzZW5kKHBrdCwgcGt0LmRlbC5pZCk7XG4gIH1cblxuICAvKipcbiAgICogRGVsZXRlIHRoZSB0b3BpYyBhbGx0b2dldGhlci4gUmVxdWlyZXMgT3duZXIgcGVybWlzc2lvbi5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIGRlbGV0ZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGhhcmQgLSBoYXJkLWRlbGV0ZSB0b3BpYy5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgZGVsVG9waWModG9waWNOYW1lLCBoYXJkKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnZGVsJywgdG9waWNOYW1lKTtcbiAgICBwa3QuZGVsLndoYXQgPSAndG9waWMnO1xuICAgIHBrdC5kZWwuaGFyZCA9IGhhcmQ7XG5cbiAgICByZXR1cm4gdGhpcy4jc2VuZChwa3QsIHBrdC5kZWwuaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlbGV0ZSBzdWJzY3JpcHRpb24uIFJlcXVpcmVzIFNoYXJlIHBlcm1pc3Npb24uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byBkZWxldGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVzZXIgLSBVc2VyIElEIHRvIHJlbW92ZS5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgZGVsU3Vic2NyaXB0aW9uKHRvcGljTmFtZSwgdXNlcikge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ2RlbCcsIHRvcGljTmFtZSk7XG4gICAgcGt0LmRlbC53aGF0ID0gJ3N1Yic7XG4gICAgcGt0LmRlbC51c2VyID0gdXNlcjtcblxuICAgIHJldHVybiB0aGlzLiNzZW5kKHBrdCwgcGt0LmRlbC5pZCk7XG4gIH1cblxuICAvKipcbiAgICogRGVsZXRlIGNyZWRlbnRpYWwuIEFsd2F5cyBzZW50IG9uIDxjb2RlPidtZSc8L2NvZGU+IHRvcGljLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kIC0gdmFsaWRhdGlvbiBtZXRob2Qgc3VjaCBhcyA8Y29kZT4nZW1haWwnPC9jb2RlPiBvciA8Y29kZT4ndGVsJzwvY29kZT4uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIHZhbGlkYXRpb24gdmFsdWUsIGkuZS4gPGNvZGU+J2FsaWNlQGV4YW1wbGUuY29tJzwvY29kZT4uXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIGRlbENyZWRlbnRpYWwobWV0aG9kLCB2YWx1ZSkge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ2RlbCcsIENvbnN0LlRPUElDX01FKTtcbiAgICBwa3QuZGVsLndoYXQgPSAnY3JlZCc7XG4gICAgcGt0LmRlbC5jcmVkID0ge1xuICAgICAgbWV0aDogbWV0aG9kLFxuICAgICAgdmFsOiB2YWx1ZVxuICAgIH07XG5cbiAgICByZXR1cm4gdGhpcy4jc2VuZChwa3QsIHBrdC5kZWwuaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcXVlc3QgdG8gZGVsZXRlIGFjY291bnQgb2YgdGhlIGN1cnJlbnQgdXNlci5cbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBoYXJkIC0gaGFyZC1kZWxldGUgdXNlci5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgZGVsQ3VycmVudFVzZXIoaGFyZCkge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ2RlbCcsIG51bGwpO1xuICAgIHBrdC5kZWwud2hhdCA9ICd1c2VyJztcbiAgICBwa3QuZGVsLmhhcmQgPSBoYXJkO1xuXG4gICAgcmV0dXJuIHRoaXMuI3NlbmQocGt0LCBwa3QuZGVsLmlkKS50aGVuKF8gPT4ge1xuICAgICAgdGhpcy5fbXlVSUQgPSBudWxsO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIE5vdGlmeSBzZXJ2ZXIgdGhhdCBhIG1lc3NhZ2Ugb3IgbWVzc2FnZXMgd2VyZSByZWFkIG9yIHJlY2VpdmVkLiBEb2VzIE5PVCByZXR1cm4gcHJvbWlzZS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHdoZXJlIHRoZSBtZXNhZ2UgaXMgYmVpbmcgYWtub3dsZWRnZWQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB3aGF0IC0gQWN0aW9uIGJlaW5nIGFrbm93bGVkZ2VkLCBlaXRoZXIgPGNvZGU+XCJyZWFkXCI8L2NvZGU+IG9yIDxjb2RlPlwicmVjdlwiPC9jb2RlPi5cbiAgICogQHBhcmFtIHtudW1iZXJ9IHNlcSAtIE1heGltdW0gaWQgb2YgdGhlIG1lc3NhZ2UgYmVpbmcgYWNrbm93bGVkZ2VkLlxuICAgKi9cbiAgbm90ZSh0b3BpY05hbWUsIHdoYXQsIHNlcSkge1xuICAgIGlmIChzZXEgPD0gMCB8fCBzZXEgPj0gQ29uc3QuTE9DQUxfU0VRSUQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBtZXNzYWdlIGlkICR7c2VxfWApO1xuICAgIH1cblxuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ25vdGUnLCB0b3BpY05hbWUpO1xuICAgIHBrdC5ub3RlLndoYXQgPSB3aGF0O1xuICAgIHBrdC5ub3RlLnNlcSA9IHNlcTtcbiAgICB0aGlzLiNzZW5kKHBrdCk7XG4gIH1cblxuICAvKipcbiAgICogQnJvYWRjYXN0IGEga2V5LXByZXNzIG5vdGlmaWNhdGlvbiB0byB0b3BpYyBzdWJzY3JpYmVycy4gVXNlZCB0byBzaG93XG4gICAqIHR5cGluZyBub3RpZmljYXRpb25zIFwidXNlciBYIGlzIHR5cGluZy4uLlwiLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gYnJvYWRjYXN0IHRvLlxuICAgKiBAcGFyYW0ge3N0cmluZz19IHR5cGUgLSBub3RpZmljYXRpb24gdG8gc2VuZCwgZGVmYXVsdCBpcyAna3AnLlxuICAgKi9cbiAgbm90ZUtleVByZXNzKHRvcGljTmFtZSwgdHlwZSkge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ25vdGUnLCB0b3BpY05hbWUpO1xuICAgIHBrdC5ub3RlLndoYXQgPSB0eXBlIHx8ICdrcCc7XG4gICAgdGhpcy4jc2VuZChwa3QpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSB2aWRlbyBjYWxsIG5vdGlmaWNhdGlvbiB0byB0b3BpYyBzdWJzY3JpYmVycyAoaW5jbHVkaW5nIGRpYWxpbmcsXG4gICAqIGhhbmd1cCwgZXRjLikuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byBicm9hZGNhc3QgdG8uXG4gICAqIEBwYXJhbSB7aW50fSBzZXEgLSBJRCBvZiB0aGUgY2FsbCBtZXNzYWdlIHRoZSBldmVudCBwZXJ0YWlucyB0by5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2dCAtIENhbGwgZXZlbnQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXlsb2FkIC0gUGF5bG9hZCBhc3NvY2lhdGVkIHdpdGggdGhpcyBldmVudCAoZS5nLiBTRFAgc3RyaW5nKS5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgKGZvciBzb21lIGNhbGwgZXZlbnRzKSB3aGljaCB3aWxsXG4gICAqICAgICAgICAgICAgICAgICAgICBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5XG4gICAqL1xuICB2aWRlb0NhbGwodG9waWNOYW1lLCBzZXEsIGV2dCwgcGF5bG9hZCkge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ25vdGUnLCB0b3BpY05hbWUpO1xuICAgIHBrdC5ub3RlLnNlcSA9IHNlcTtcbiAgICBwa3Qubm90ZS53aGF0ID0gJ2NhbGwnO1xuICAgIHBrdC5ub3RlLmV2ZW50ID0gZXZ0O1xuICAgIHBrdC5ub3RlLnBheWxvYWQgPSBwYXlsb2FkO1xuICAgIHRoaXMuI3NlbmQocGt0LCBwa3Qubm90ZS5pZCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGEgbmFtZWQgdG9waWMsIGVpdGhlciBwdWxsIGl0IGZyb20gY2FjaGUgb3IgY3JlYXRlIGEgbmV3IGluc3RhbmNlLlxuICAgKiBUaGVyZSBpcyBhIHNpbmdsZSBpbnN0YW5jZSBvZiB0b3BpYyBmb3IgZWFjaCBuYW1lLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gZ2V0LlxuICAgKlxuICAgKiBAcmV0dXJucyB7VG9waWN9IFJlcXVlc3RlZCBvciBuZXdseSBjcmVhdGVkIHRvcGljIG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4gaWYgdG9waWMgbmFtZSBpcyBpbnZhbGlkLlxuICAgKi9cbiAgZ2V0VG9waWModG9waWNOYW1lKSB7XG4gICAgbGV0IHRvcGljID0gdGhpcy4jY2FjaGVHZXQoJ3RvcGljJywgdG9waWNOYW1lKTtcbiAgICBpZiAoIXRvcGljICYmIHRvcGljTmFtZSkge1xuICAgICAgaWYgKHRvcGljTmFtZSA9PSBDb25zdC5UT1BJQ19NRSkge1xuICAgICAgICB0b3BpYyA9IG5ldyBUb3BpY01lKCk7XG4gICAgICB9IGVsc2UgaWYgKHRvcGljTmFtZSA9PSBDb25zdC5UT1BJQ19GTkQpIHtcbiAgICAgICAgdG9waWMgPSBuZXcgVG9waWNGbmQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRvcGljID0gbmV3IFRvcGljKHRvcGljTmFtZSk7XG4gICAgICB9XG4gICAgICAvLyBDYWNoZSBtYW5hZ2VtZW50LlxuICAgICAgdGhpcy4jYXR0YWNoQ2FjaGVUb1RvcGljKHRvcGljKTtcbiAgICAgIHRvcGljLl9jYWNoZVB1dFNlbGYoKTtcbiAgICAgIC8vIERvbid0IHNhdmUgdG8gREIgaGVyZTogYSByZWNvcmQgd2lsbCBiZSBhZGRlZCB3aGVuIHRoZSB0b3BpYyBpcyBzdWJzY3JpYmVkLlxuICAgIH1cbiAgICByZXR1cm4gdG9waWM7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGEgbmFtZWQgdG9waWMgZnJvbSBjYWNoZS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIGdldC5cbiAgICpcbiAgICogQHJldHVybnMge1RvcGljfSBSZXF1ZXN0ZWQgdG9waWMgb3IgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPiBpZiB0b3BpYyBpcyBub3QgZm91bmQgaW4gY2FjaGUuXG4gICAqL1xuICBjYWNoZUdldFRvcGljKHRvcGljTmFtZSkge1xuICAgIHJldHVybiB0aGlzLiNjYWNoZUdldCgndG9waWMnLCB0b3BpY05hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBuYW1lZCB0b3BpYyBmcm9tIGNhY2hlLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gcmVtb3ZlIGZyb20gY2FjaGUuXG4gICAqL1xuICBjYWNoZVJlbVRvcGljKHRvcGljTmFtZSkge1xuICAgIHRoaXMuI2NhY2hlRGVsKCd0b3BpYycsIHRvcGljTmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogSXRlcmF0ZSBvdmVyIGNhY2hlZCB0b3BpY3MuXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgLSBjYWxsYmFjayB0byBjYWxsIGZvciBlYWNoIHRvcGljLlxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCAtICd0aGlzJyBpbnNpZGUgdGhlICdmdW5jJy5cbiAgICovXG4gIG1hcFRvcGljcyhmdW5jLCBjb250ZXh0KSB7XG4gICAgdGhpcy4jY2FjaGVNYXAoJ3RvcGljJywgZnVuYywgY29udGV4dCk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgbmFtZWQgdG9waWMgaXMgYWxyZWFkeSBwcmVzZW50IGluIGNhY2hlLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIHRvcGljIGlzIGZvdW5kIGluIGNhY2hlLCBmYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICBpc1RvcGljQ2FjaGVkKHRvcGljTmFtZSkge1xuICAgIHJldHVybiAhIXRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIHRvcGljTmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGUgdW5pcXVlIG5hbWUgbGlrZSA8Y29kZT4nbmV3MTIzNDU2JzwvY29kZT4gc3VpdGFibGUgZm9yIGNyZWF0aW5nIGEgbmV3IGdyb3VwIHRvcGljLlxuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGlzQ2hhbiAtIGlmIHRoZSB0b3BpYyBpcyBjaGFubmVsLWVuYWJsZWQuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IG5hbWUgd2hpY2ggY2FuIGJlIHVzZWQgZm9yIGNyZWF0aW5nIGEgbmV3IGdyb3VwIHRvcGljLlxuICAgKi9cbiAgbmV3R3JvdXBUb3BpY05hbWUoaXNDaGFuKSB7XG4gICAgcmV0dXJuIChpc0NoYW4gPyBDb25zdC5UT1BJQ19ORVdfQ0hBTiA6IENvbnN0LlRPUElDX05FVykgKyB0aGlzLmdldE5leHRVbmlxdWVJZCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluc3RhbnRpYXRlIDxjb2RlPidtZSc8L2NvZGU+IHRvcGljIG9yIGdldCBpdCBmcm9tIGNhY2hlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7VG9waWNNZX0gSW5zdGFuY2Ugb2YgPGNvZGU+J21lJzwvY29kZT4gdG9waWMuXG4gICAqL1xuICBnZXRNZVRvcGljKCkge1xuICAgIHJldHVybiB0aGlzLmdldFRvcGljKENvbnN0LlRPUElDX01FKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnN0YW50aWF0ZSA8Y29kZT4nZm5kJzwvY29kZT4gKGZpbmQpIHRvcGljIG9yIGdldCBpdCBmcm9tIGNhY2hlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7VG9waWN9IEluc3RhbmNlIG9mIDxjb2RlPidmbmQnPC9jb2RlPiB0b3BpYy5cbiAgICovXG4gIGdldEZuZFRvcGljKCkge1xuICAgIHJldHVybiB0aGlzLmdldFRvcGljKENvbnN0LlRPUElDX0ZORCk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IHtAbGluayBMYXJnZUZpbGVIZWxwZXJ9IGluc3RhbmNlXG4gICAqXG4gICAqIEByZXR1cm5zIHtMYXJnZUZpbGVIZWxwZXJ9IGluc3RhbmNlIG9mIGEge0BsaW5rIFRpbm9kZS5MYXJnZUZpbGVIZWxwZXJ9LlxuICAgKi9cbiAgZ2V0TGFyZ2VGaWxlSGVscGVyKCkge1xuICAgIHJldHVybiBuZXcgTGFyZ2VGaWxlSGVscGVyKHRoaXMsIENvbnN0LlBST1RPQ09MX1ZFUlNJT04pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgVUlEIG9mIHRoZSB0aGUgY3VycmVudCBhdXRoZW50aWNhdGVkIHVzZXIuXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFVJRCBvZiB0aGUgY3VycmVudCB1c2VyIG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4gaWYgdGhlIHNlc3Npb24gaXMgbm90IHlldFxuICAgKiBhdXRoZW50aWNhdGVkIG9yIGlmIHRoZXJlIGlzIG5vIHNlc3Npb24uXG4gICAqL1xuICBnZXRDdXJyZW50VXNlcklEKCkge1xuICAgIHJldHVybiB0aGlzLl9teVVJRDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgZ2l2ZW4gdXNlciBJRCBpcyBlcXVhbCB0byB0aGUgY3VycmVudCB1c2VyJ3MgVUlELlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gVUlEIHRvIGNoZWNrLlxuICAgKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGUgZ2l2ZW4gVUlEIGJlbG9uZ3MgdG8gdGhlIGN1cnJlbnQgbG9nZ2VkIGluIHVzZXIuXG4gICAqL1xuICBpc01lKHVpZCkge1xuICAgIHJldHVybiB0aGlzLl9teVVJRCA9PT0gdWlkO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBsb2dpbiB1c2VkIGZvciBsYXN0IHN1Y2Nlc3NmdWwgYXV0aGVudGljYXRpb24uXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IGxvZ2luIGxhc3QgdXNlZCBzdWNjZXNzZnVsbHkgb3IgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPi5cbiAgICovXG4gIGdldEN1cnJlbnRMb2dpbigpIHtcbiAgICByZXR1cm4gdGhpcy5fbG9naW47XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGluZm9ybWF0aW9uIGFib3V0IHRoZSBzZXJ2ZXI6IHByb3RvY29sIHZlcnNpb24gYW5kIGJ1aWxkIHRpbWVzdGFtcC5cbiAgICpcbiAgICogQHJldHVybnMge09iamVjdH0gYnVpbGQgYW5kIHZlcnNpb24gb2YgdGhlIHNlcnZlciBvciA8Y29kZT5udWxsPC9jb2RlPiBpZiB0aGVyZSBpcyBubyBjb25uZWN0aW9uIG9yXG4gICAqIGlmIHRoZSBmaXJzdCBzZXJ2ZXIgcmVzcG9uc2UgaGFzIG5vdCBiZWVuIHJlY2VpdmVkIHlldC5cbiAgICovXG4gIGdldFNlcnZlckluZm8oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NlcnZlckluZm87XG4gIH1cblxuICAvKipcbiAgICogUmVwb3J0IGEgdG9waWMgZm9yIGFidXNlLiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI3B1Ymxpc2h9LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gYWN0aW9uIC0gdGhlIG9ubHkgc3VwcG9ydGVkIGFjdGlvbiBpcyAncmVwb3J0Jy5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHRhcmdldCAtIG5hbWUgb2YgdGhlIHRvcGljIGJlaW5nIHJlcG9ydGVkLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gcmVxdWVzdC5cbiAgICovXG4gIHJlcG9ydChhY3Rpb24sIHRhcmdldCkge1xuICAgIHJldHVybiB0aGlzLnB1Ymxpc2goQ29uc3QuVE9QSUNfU1lTLCBEcmFmdHkuYXR0YWNoSlNPTihudWxsLCB7XG4gICAgICAnYWN0aW9uJzogYWN0aW9uLFxuICAgICAgJ3RhcmdldCc6IHRhcmdldFxuICAgIH0pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gc2VydmVyLXByb3ZpZGVkIGNvbmZpZ3VyYXRpb24gdmFsdWUuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIG9mIHRoZSB2YWx1ZSB0byByZXR1cm4uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkZWZhdWx0VmFsdWUgdG8gcmV0dXJuIGluIGNhc2UgdGhlIHBhcmFtZXRlciBpcyBub3Qgc2V0IG9yIG5vdCBmb3VuZC5cbiAgICpcbiAgICogQHJldHVybnMge09iamVjdH0gbmFtZWQgdmFsdWUuXG4gICAqL1xuICBnZXRTZXJ2ZXJQYXJhbShuYW1lLCBkZWZhdWx0VmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5fc2VydmVySW5mbyAmJiB0aGlzLl9zZXJ2ZXJJbmZvW25hbWVdIHx8IGRlZmF1bHRWYWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGUgY29uc29sZSBsb2dnaW5nLiBMb2dnaW5nIGlzIG9mZiBieSBkZWZhdWx0LlxuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZWQgLSBTZXQgdG8gPGNvZGU+dHJ1ZTwvY29kZT4gdG8gZW5hYmxlIGxvZ2dpbmcgdG8gY29uc29sZS5cbiAgICogQHBhcmFtIHtib29sZWFufSB0cmltTG9uZ1N0cmluZ3MgLSBTZXQgdG8gPGNvZGU+dHJ1ZTwvY29kZT4gdG8gdHJpbSBsb25nIHN0cmluZ3MuXG4gICAqL1xuICBlbmFibGVMb2dnaW5nKGVuYWJsZWQsIHRyaW1Mb25nU3RyaW5ncykge1xuICAgIHRoaXMuX2xvZ2dpbmdFbmFibGVkID0gZW5hYmxlZDtcbiAgICB0aGlzLl90cmltTG9uZ1N0cmluZ3MgPSBlbmFibGVkICYmIHRyaW1Mb25nU3RyaW5ncztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgVUkgbGFuZ3VhZ2UgdG8gcmVwb3J0IHRvIHRoZSBzZXJ2ZXIuIE11c3QgYmUgY2FsbGVkIGJlZm9yZSA8Y29kZT4naGknPC9jb2RlPiBpcyBzZW50LCBvdGhlcndpc2UgaXQgd2lsbCBub3QgYmUgdXNlZC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGhsIC0gaHVtYW4gKFVJKSBsYW5ndWFnZSwgbGlrZSA8Y29kZT5cImVuX1VTXCI8L2NvZGU+IG9yIDxjb2RlPlwiemgtSGFuc1wiPC9jb2RlPi5cbiAgICovXG4gIHNldEh1bWFuTGFuZ3VhZ2UoaGwpIHtcbiAgICBpZiAoaGwpIHtcbiAgICAgIHRoaXMuX2h1bWFuTGFuZ3VhZ2UgPSBobDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgZ2l2ZW4gdG9waWMgaXMgb25saW5lLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBvZiB0aGUgdG9waWMgdG8gdGVzdC5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdG9waWMgaXMgb25saW5lLCBmYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICBpc1RvcGljT25saW5lKG5hbWUpIHtcbiAgICBjb25zdCB0b3BpYyA9IHRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIG5hbWUpO1xuICAgIHJldHVybiB0b3BpYyAmJiB0b3BpYy5vbmxpbmU7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGFjY2VzcyBtb2RlIGZvciB0aGUgZ2l2ZW4gY29udGFjdC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgb2YgdGhlIHRvcGljIHRvIHF1ZXJ5LlxuICAgKiBAcmV0dXJucyB7QWNjZXNzTW9kZX0gYWNjZXNzIG1vZGUgaWYgdG9waWMgaXMgZm91bmQsIG51bGwgb3RoZXJ3aXNlLlxuICAgKi9cbiAgZ2V0VG9waWNBY2Nlc3NNb2RlKG5hbWUpIHtcbiAgICBjb25zdCB0b3BpYyA9IHRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIG5hbWUpO1xuICAgIHJldHVybiB0b3BpYyA/IHRvcGljLmFjcyA6IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogSW5jbHVkZSBtZXNzYWdlIElEIGludG8gYWxsIHN1YnNlcXVlc3QgbWVzc2FnZXMgdG8gc2VydmVyIGluc3RydWN0aW4gaXQgdG8gc2VuZCBha25vd2xlZGdlbWVucy5cbiAgICogUmVxdWlyZWQgZm9yIHByb21pc2VzIHRvIGZ1bmN0aW9uLiBEZWZhdWx0IGlzIDxjb2RlPlwib25cIjwvY29kZT4uXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gc3RhdHVzIC0gVHVybiBha25vd2xlZGdlbWVucyBvbiBvciBvZmYuXG4gICAqIEBkZXByZWNhdGVkXG4gICAqL1xuICB3YW50QWtuKHN0YXR1cykge1xuICAgIGlmIChzdGF0dXMpIHtcbiAgICAgIHRoaXMuX21lc3NhZ2VJZCA9IE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiAweEZGRkZGRikgKyAweEZGRkZGRik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX21lc3NhZ2VJZCA9IDA7XG4gICAgfVxuICB9XG5cbiAgLy8gQ2FsbGJhY2tzOlxuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gcmVwb3J0IHdoZW4gdGhlIHdlYnNvY2tldCBpcyBvcGVuZWQuIFRoZSBjYWxsYmFjayBoYXMgbm8gcGFyYW1ldGVycy5cbiAgICpcbiAgICogQHR5cGUge29uV2Vic29ja2V0T3Blbn1cbiAgICovXG4gIG9uV2Vic29ja2V0T3BlbiA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQHR5cGVkZWYgU2VydmVyUGFyYW1zXG4gICAqXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB2ZXIgLSBTZXJ2ZXIgdmVyc2lvblxuICAgKiBAcHJvcGVydHkge3N0cmluZ30gYnVpbGQgLSBTZXJ2ZXIgYnVpbGRcbiAgICogQHByb3BlcnR5IHtzdHJpbmc9fSBzaWQgLSBTZXNzaW9uIElELCBsb25nIHBvbGxpbmcgY29ubmVjdGlvbnMgb25seS5cbiAgICovXG5cbiAgLyoqXG4gICAqIEBjYWxsYmFjayBvbkNvbm5lY3RcbiAgICogQHBhcmFtIHtudW1iZXJ9IGNvZGUgLSBSZXN1bHQgY29kZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dCAtIFRleHQgZXB4cGxhaW5pbmcgdGhlIGNvbXBsZXRpb24sIGkuZSBcIk9LXCIgb3IgYW4gZXJyb3IgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtTZXJ2ZXJQYXJhbXN9IHBhcmFtcyAtIFBhcmFtZXRlcnMgcmV0dXJuZWQgYnkgdGhlIHNlcnZlci5cbiAgICovXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0byByZXBvcnQgd2hlbiBjb25uZWN0aW9uIHdpdGggVGlub2RlIHNlcnZlciBpcyBlc3RhYmxpc2hlZC5cbiAgICogQHR5cGUge29uQ29ubmVjdH1cbiAgICovXG4gIG9uQ29ubmVjdCA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gcmVwb3J0IHdoZW4gY29ubmVjdGlvbiBpcyBsb3N0LiBUaGUgY2FsbGJhY2sgaGFzIG5vIHBhcmFtZXRlcnMuXG4gICAqIEB0eXBlIHtvbkRpc2Nvbm5lY3R9XG4gICAqL1xuICBvbkRpc2Nvbm5lY3QgPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIEBjYWxsYmFjayBvbkxvZ2luXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBjb2RlIC0gTlVtZXJpYyBjb21wbGV0aW9uIGNvZGUsIHNhbWUgYXMgSFRUUCBzdGF0dXMgY29kZXMuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IC0gRXhwbGFuYXRpb24gb2YgdGhlIGNvbXBsZXRpb24gY29kZS5cbiAgICovXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0byByZXBvcnQgbG9naW4gY29tcGxldGlvbi5cbiAgICogQHR5cGUge29uTG9naW59XG4gICAqL1xuICBvbkxvZ2luID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0byByZWNlaXZlIDxjb2RlPntjdHJsfTwvY29kZT4gKGNvbnRyb2wpIG1lc3NhZ2VzLlxuICAgKiBAdHlwZSB7b25DdHJsTWVzc2FnZX1cbiAgICovXG4gIG9uQ3RybE1lc3NhZ2UgPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIHRvIHJlY2lldmUgPGNvZGU+e2RhdGF9PC9jb2RlPiAoY29udGVudCkgbWVzc2FnZXMuXG4gICAqIEB0eXBlIHtvbkRhdGFNZXNzYWdlfVxuICAgKi9cbiAgb25EYXRhTWVzc2FnZSA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gcmVjZWl2ZSA8Y29kZT57cHJlc308L2NvZGU+IChwcmVzZW5jZSkgbWVzc2FnZXMuXG4gICAqIEB0eXBlIHtvblByZXNNZXNzYWdlfVxuICAgKi9cbiAgb25QcmVzTWVzc2FnZSA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gcmVjZWl2ZSBhbGwgbWVzc2FnZXMgYXMgb2JqZWN0cy5cbiAgICogQHR5cGUge29uTWVzc2FnZX1cbiAgICovXG4gIG9uTWVzc2FnZSA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gcmVjZWl2ZSBhbGwgbWVzc2FnZXMgYXMgdW5wYXJzZWQgdGV4dC5cbiAgICogQHR5cGUge29uUmF3TWVzc2FnZX1cbiAgICovXG4gIG9uUmF3TWVzc2FnZSA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gcmVjZWl2ZSBzZXJ2ZXIgcmVzcG9uc2VzIHRvIG5ldHdvcmsgcHJvYmVzLiBTZWUge0BsaW5rIFRpbm9kZSNuZXR3b3JrUHJvYmV9XG4gICAqIEB0eXBlIHtvbk5ldHdvcmtQcm9iZX1cbiAgICovXG4gIG9uTmV0d29ya1Byb2JlID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0byBiZSBub3RpZmllZCB3aGVuIGV4cG9uZW50aWFsIGJhY2tvZmYgaXMgaXRlcmF0aW5nLlxuICAgKiBAdHlwZSB7b25BdXRvcmVjb25uZWN0SXRlcmF0aW9ufVxuICAgKi9cbiAgb25BdXRvcmVjb25uZWN0SXRlcmF0aW9uID0gdW5kZWZpbmVkO1xufTtcblxuLy8gRXhwb3J0ZWQgY29uc3RhbnRzXG5UaW5vZGUuTUVTU0FHRV9TVEFUVVNfTk9ORSA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX05PTkU7XG5UaW5vZGUuTUVTU0FHRV9TVEFUVVNfUVVFVUVEID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfUVVFVUVEO1xuVGlub2RlLk1FU1NBR0VfU1RBVFVTX1NFTkRJTkcgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19TRU5ESU5HO1xuVGlub2RlLk1FU1NBR0VfU1RBVFVTX0ZBSUxFRCA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX0ZBSUxFRDtcblRpbm9kZS5NRVNTQUdFX1NUQVRVU19TRU5UID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfU0VOVDtcblRpbm9kZS5NRVNTQUdFX1NUQVRVU19SRUNFSVZFRCA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX1JFQ0VJVkVEO1xuVGlub2RlLk1FU1NBR0VfU1RBVFVTX1JFQUQgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19SRUFEO1xuVGlub2RlLk1FU1NBR0VfU1RBVFVTX1RPX01FID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfVE9fTUU7XG5cbi8vIFVuaWNvZGUgW2RlbF0gc3ltYm9sLlxuVGlub2RlLkRFTF9DSEFSID0gQ29uc3QuREVMX0NIQVI7XG5cbi8vIE5hbWVzIG9mIGtleXMgdG8gc2VydmVyLXByb3ZpZGVkIGNvbmZpZ3VyYXRpb24gbGltaXRzLlxuVGlub2RlLk1BWF9NRVNTQUdFX1NJWkUgPSAnbWF4TWVzc2FnZVNpemUnO1xuVGlub2RlLk1BWF9TVUJTQ1JJQkVSX0NPVU5UID0gJ21heFN1YnNjcmliZXJDb3VudCc7XG5UaW5vZGUuTUFYX1RBR19DT1VOVCA9ICdtYXhUYWdDb3VudCc7XG5UaW5vZGUuTUFYX0ZJTEVfVVBMT0FEX1NJWkUgPSAnbWF4RmlsZVVwbG9hZFNpemUnO1xuIiwiLyoqXG4gKiBAZmlsZSBUb3BpYyBtYW5hZ2VtZW50LlxuICpcbiAqIEBjb3B5cmlnaHQgMjAxNS0yMDIyIFRpbm9kZSBMTEMuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IEFjY2Vzc01vZGUgZnJvbSAnLi9hY2Nlc3MtbW9kZS5qcyc7XG5pbXBvcnQgQ0J1ZmZlciBmcm9tICcuL2NidWZmZXIuanMnO1xuaW1wb3J0ICogYXMgQ29uc3QgZnJvbSAnLi9jb25maWcuanMnO1xuaW1wb3J0IERyYWZ0eSBmcm9tICcuL2RyYWZ0eS5qcyc7XG5pbXBvcnQgTWV0YUdldEJ1aWxkZXIgZnJvbSAnLi9tZXRhLWJ1aWxkZXIuanMnO1xuaW1wb3J0IHtcbiAgbWVyZ2VPYmosXG4gIG1lcmdlVG9DYWNoZSxcbiAgbm9ybWFsaXplQXJyYXlcbn0gZnJvbSAnLi91dGlscy5qcyc7XG5cbmV4cG9ydCBjbGFzcyBUb3BpYyB7XG4gIC8qKlxuICAgKiBAY2FsbGJhY2sgVGlub2RlLlRvcGljLm9uRGF0YVxuICAgKiBAcGFyYW0ge0RhdGF9IGRhdGEgLSBEYXRhIHBhY2tldFxuICAgKi9cbiAgLyoqXG4gICAqIFRvcGljIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIGEgbG9naWNhbCBjb21tdW5pY2F0aW9uIGNoYW5uZWwuXG4gICAqIEBjbGFzcyBUb3BpY1xuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gY3JlYXRlLlxuICAgKiBAcGFyYW0ge09iamVjdD19IGNhbGxiYWNrcyAtIE9iamVjdCB3aXRoIHZhcmlvdXMgZXZlbnQgY2FsbGJhY2tzLlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5Ub3BpYy5vbkRhdGF9IGNhbGxiYWNrcy5vbkRhdGEgLSBDYWxsYmFjayB3aGljaCByZWNlaXZlcyBhIDxjb2RlPntkYXRhfTwvY29kZT4gbWVzc2FnZS5cbiAgICogQHBhcmFtIHtjYWxsYmFja30gY2FsbGJhY2tzLm9uTWV0YSAtIENhbGxiYWNrIHdoaWNoIHJlY2VpdmVzIGEgPGNvZGU+e21ldGF9PC9jb2RlPiBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge2NhbGxiYWNrfSBjYWxsYmFja3Mub25QcmVzIC0gQ2FsbGJhY2sgd2hpY2ggcmVjZWl2ZXMgYSA8Y29kZT57cHJlc308L2NvZGU+IG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7Y2FsbGJhY2t9IGNhbGxiYWNrcy5vbkluZm8gLSBDYWxsYmFjayB3aGljaCByZWNlaXZlcyBhbiA8Y29kZT57aW5mb308L2NvZGU+IG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7Y2FsbGJhY2t9IGNhbGxiYWNrcy5vbk1ldGFEZXNjIC0gQ2FsbGJhY2sgd2hpY2ggcmVjZWl2ZXMgY2hhbmdlcyB0byB0b3BpYyBkZXNjdGlvcHRpb24ge0BsaW5rIGRlc2N9LlxuICAgKiBAcGFyYW0ge2NhbGxiYWNrfSBjYWxsYmFja3Mub25NZXRhU3ViIC0gQ2FsbGVkIGZvciBhIHNpbmdsZSBzdWJzY3JpcHRpb24gcmVjb3JkIGNoYW5nZS5cbiAgICogQHBhcmFtIHtjYWxsYmFja30gY2FsbGJhY2tzLm9uU3Vic1VwZGF0ZWQgLSBDYWxsZWQgYWZ0ZXIgYSBiYXRjaCBvZiBzdWJzY3JpcHRpb24gY2hhbmdlcyBoYXZlIGJlZW4gcmVjaWV2ZWQgYW5kIGNhY2hlZC5cbiAgICogQHBhcmFtIHtjYWxsYmFja30gY2FsbGJhY2tzLm9uRGVsZXRlVG9waWMgLSBDYWxsZWQgYWZ0ZXIgdGhlIHRvcGljIGlzIGRlbGV0ZWQuXG4gICAqIEBwYXJhbSB7Y2FsbGJhY2t9IGNhbGxiYWNscy5vbkFsbE1lc3NhZ2VzUmVjZWl2ZWQgLSBDYWxsZWQgd2hlbiBhbGwgcmVxdWVzdGVkIDxjb2RlPntkYXRhfTwvY29kZT4gbWVzc2FnZXMgaGF2ZSBiZWVuIHJlY2l2ZWQuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihuYW1lLCBjYWxsYmFja3MpIHtcbiAgICAvLyBQYXJlbnQgVGlub2RlIG9iamVjdC5cbiAgICB0aGlzLl90aW5vZGUgPSBudWxsO1xuXG4gICAgLy8gU2VydmVyLXByb3ZpZGVkIGRhdGEsIGxvY2FsbHkgaW1tdXRhYmxlLlxuICAgIC8vIHRvcGljIG5hbWVcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIC8vIFRpbWVzdGFtcCB3aGVuIHRoZSB0b3BpYyB3YXMgY3JlYXRlZC5cbiAgICB0aGlzLmNyZWF0ZWQgPSBudWxsO1xuICAgIC8vIFRpbWVzdGFtcCB3aGVuIHRoZSB0b3BpYyB3YXMgbGFzdCB1cGRhdGVkLlxuICAgIHRoaXMudXBkYXRlZCA9IG51bGw7XG4gICAgLy8gVGltZXN0YW1wIG9mIHRoZSBsYXN0IG1lc3NhZ2VzXG4gICAgdGhpcy50b3VjaGVkID0gbmV3IERhdGUoMCk7XG4gICAgLy8gQWNjZXNzIG1vZGUsIHNlZSBBY2Nlc3NNb2RlXG4gICAgdGhpcy5hY3MgPSBuZXcgQWNjZXNzTW9kZShudWxsKTtcbiAgICAvLyBQZXItdG9waWMgcHJpdmF0ZSBkYXRhIChhY2Nlc3NpYmxlIGJ5IGN1cnJlbnQgdXNlciBvbmx5KS5cbiAgICB0aGlzLnByaXZhdGUgPSBudWxsO1xuICAgIC8vIFBlci10b3BpYyBwdWJsaWMgZGF0YSAoYWNjZXNzaWJsZSBieSBhbGwgdXNlcnMpLlxuICAgIHRoaXMucHVibGljID0gbnVsbDtcbiAgICAvLyBQZXItdG9waWMgc3lzdGVtLXByb3ZpZGVkIGRhdGEgKGFjY2Vzc2libGUgYnkgYWxsIHVzZXJzKS5cbiAgICB0aGlzLnRydXN0ZWQgPSBudWxsO1xuXG4gICAgLy8gTG9jYWxseSBjYWNoZWQgZGF0YVxuICAgIC8vIFN1YnNjcmliZWQgdXNlcnMsIGZvciB0cmFja2luZyByZWFkL3JlY3YvbXNnIG5vdGlmaWNhdGlvbnMuXG4gICAgdGhpcy5fdXNlcnMgPSB7fTtcblxuICAgIC8vIEN1cnJlbnQgdmFsdWUgb2YgbG9jYWxseSBpc3N1ZWQgc2VxSWQsIHVzZWQgZm9yIHBlbmRpbmcgbWVzc2FnZXMuXG4gICAgdGhpcy5fcXVldWVkU2VxSWQgPSBDb25zdC5MT0NBTF9TRVFJRDtcblxuICAgIC8vIFRoZSBtYXhpbXVtIGtub3duIHtkYXRhLnNlcX0gdmFsdWUuXG4gICAgdGhpcy5fbWF4U2VxID0gMDtcbiAgICAvLyBUaGUgbWluaW11bSBrbm93biB7ZGF0YS5zZXF9IHZhbHVlLlxuICAgIHRoaXMuX21pblNlcSA9IDA7XG4gICAgLy8gSW5kaWNhdG9yIHRoYXQgdGhlIGxhc3QgcmVxdWVzdCBmb3IgZWFybGllciBtZXNzYWdlcyByZXR1cm5lZCAwLlxuICAgIHRoaXMuX25vRWFybGllck1zZ3MgPSBmYWxzZTtcbiAgICAvLyBUaGUgbWF4aW11bSBrbm93biBkZWxldGlvbiBJRC5cbiAgICB0aGlzLl9tYXhEZWwgPSAwO1xuICAgIC8vIFRpbWVyIG9iamVjdCB1c2VkIHRvIHNlbmQgJ3JlY3YnIG5vdGlmaWNhdGlvbnMuXG4gICAgdGhpcy5fcmVjdk5vdGlmaWNhdGlvblRpbWVyID0gbnVsbDtcblxuICAgIC8vIFVzZXIgZGlzY292ZXJ5IHRhZ3NcbiAgICB0aGlzLl90YWdzID0gW107XG4gICAgLy8gQ3JlZGVudGlhbHMgc3VjaCBhcyBlbWFpbCBvciBwaG9uZSBudW1iZXIuXG4gICAgdGhpcy5fY3JlZGVudGlhbHMgPSBbXTtcbiAgICAvLyBNZXNzYWdlIHZlcnNpb25zIGNhY2hlIChlLmcuIGZvciBlZGl0ZWQgbWVzc2FnZXMpLlxuICAgIC8vIEtleXM6IG9yaWdpbmFsIG1lc3NhZ2Ugc2VxIElELlxuICAgIC8vIFZhbHVlczogQ0J1ZmZlcnMgY29udGFpbmluZyBuZXdlciB2ZXJzaW9ucyBvZiB0aGUgb3JpZ2luYWwgbWVzc2FnZVxuICAgIC8vIG9yZGVyZWQgYnkgc2VxIGlkLlxuICAgIHRoaXMuX21lc3NhZ2VWZXJzaW9ucyA9IHt9O1xuICAgIC8vIE1lc3NhZ2UgY2FjaGUsIHNvcnRlZCBieSBtZXNzYWdlIHNlcSB2YWx1ZXMsIGZyb20gb2xkIHRvIG5ldy5cbiAgICB0aGlzLl9tZXNzYWdlcyA9IG5ldyBDQnVmZmVyKChhLCBiKSA9PiB7XG4gICAgICByZXR1cm4gYS5zZXEgLSBiLnNlcTtcbiAgICB9LCB0cnVlKTtcbiAgICAvLyBCb29sZWFuLCB0cnVlIGlmIHRoZSB0b3BpYyBpcyBjdXJyZW50bHkgbGl2ZVxuICAgIHRoaXMuX2F0dGFjaGVkID0gZmFsc2U7XG4gICAgLy8gVGltZXN0YXAgb2YgdGhlIG1vc3QgcmVjZW50bHkgdXBkYXRlZCBzdWJzY3JpcHRpb24uXG4gICAgdGhpcy5fbGFzdFN1YnNVcGRhdGUgPSBuZXcgRGF0ZSgwKTtcbiAgICAvLyBUb3BpYyBjcmVhdGVkIGJ1dCBub3QgeWV0IHN5bmNlZCB3aXRoIHRoZSBzZXJ2ZXIuIFVzZWQgb25seSBkdXJpbmcgaW5pdGlhbGl6YXRpb24uXG4gICAgdGhpcy5fbmV3ID0gdHJ1ZTtcbiAgICAvLyBUaGUgdG9waWMgaXMgZGVsZXRlZCBhdCB0aGUgc2VydmVyLCB0aGlzIGlzIGEgbG9jYWwgY29weS5cbiAgICB0aGlzLl9kZWxldGVkID0gZmFsc2U7XG5cbiAgICAvLyBUaW1lciB1c2VkIHRvIHRyZ2dlciB7bGVhdmV9IHJlcXVlc3QgYWZ0ZXIgYSBkZWxheS5cbiAgICB0aGlzLl9kZWxheWVkTGVhdmVUaW1lciA9IG51bGw7XG5cbiAgICAvLyBDYWxsYmFja3NcbiAgICBpZiAoY2FsbGJhY2tzKSB7XG4gICAgICB0aGlzLm9uRGF0YSA9IGNhbGxiYWNrcy5vbkRhdGE7XG4gICAgICB0aGlzLm9uTWV0YSA9IGNhbGxiYWNrcy5vbk1ldGE7XG4gICAgICB0aGlzLm9uUHJlcyA9IGNhbGxiYWNrcy5vblByZXM7XG4gICAgICB0aGlzLm9uSW5mbyA9IGNhbGxiYWNrcy5vbkluZm87XG4gICAgICAvLyBBIHNpbmdsZSBkZXNjIHVwZGF0ZTtcbiAgICAgIHRoaXMub25NZXRhRGVzYyA9IGNhbGxiYWNrcy5vbk1ldGFEZXNjO1xuICAgICAgLy8gQSBzaW5nbGUgc3Vic2NyaXB0aW9uIHJlY29yZDtcbiAgICAgIHRoaXMub25NZXRhU3ViID0gY2FsbGJhY2tzLm9uTWV0YVN1YjtcbiAgICAgIC8vIEFsbCBzdWJzY3JpcHRpb24gcmVjb3JkcyByZWNlaXZlZDtcbiAgICAgIHRoaXMub25TdWJzVXBkYXRlZCA9IGNhbGxiYWNrcy5vblN1YnNVcGRhdGVkO1xuICAgICAgdGhpcy5vblRhZ3NVcGRhdGVkID0gY2FsbGJhY2tzLm9uVGFnc1VwZGF0ZWQ7XG4gICAgICB0aGlzLm9uQ3JlZHNVcGRhdGVkID0gY2FsbGJhY2tzLm9uQ3JlZHNVcGRhdGVkO1xuICAgICAgdGhpcy5vbkRlbGV0ZVRvcGljID0gY2FsbGJhY2tzLm9uRGVsZXRlVG9waWM7XG4gICAgICB0aGlzLm9uQWxsTWVzc2FnZXNSZWNlaXZlZCA9IGNhbGxiYWNrcy5vbkFsbE1lc3NhZ2VzUmVjZWl2ZWQ7XG4gICAgfVxuICB9XG5cbiAgLy8gU3RhdGljIG1ldGhvZHMuXG5cbiAgLyoqXG4gICAqIERldGVybWluZSB0b3BpYyB0eXBlIGZyb20gdG9waWMncyBuYW1lOiBncnAsIHAycCwgbWUsIGZuZCwgc3lzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gdGVzdC5cbiAgICogQHJldHVybnMge3N0cmluZ30gT25lIG9mIDxjb2RlPlwibWVcIjwvY29kZT4sIDxjb2RlPlwiZm5kXCI8L2NvZGU+LCA8Y29kZT5cInN5c1wiPC9jb2RlPiwgPGNvZGU+XCJncnBcIjwvY29kZT4sXG4gICAqICAgIDxjb2RlPlwicDJwXCI8L2NvZGU+IG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4uXG4gICAqL1xuICBzdGF0aWMgdG9waWNUeXBlKG5hbWUpIHtcbiAgICBjb25zdCB0eXBlcyA9IHtcbiAgICAgICdtZSc6IENvbnN0LlRPUElDX01FLFxuICAgICAgJ2ZuZCc6IENvbnN0LlRPUElDX0ZORCxcbiAgICAgICdncnAnOiBDb25zdC5UT1BJQ19HUlAsXG4gICAgICAnbmV3JzogQ29uc3QuVE9QSUNfR1JQLFxuICAgICAgJ25jaCc6IENvbnN0LlRPUElDX0dSUCxcbiAgICAgICdjaG4nOiBDb25zdC5UT1BJQ19HUlAsXG4gICAgICAndXNyJzogQ29uc3QuVE9QSUNfUDJQLFxuICAgICAgJ3N5cyc6IENvbnN0LlRPUElDX1NZU1xuICAgIH07XG4gICAgcmV0dXJuIHR5cGVzWyh0eXBlb2YgbmFtZSA9PSAnc3RyaW5nJykgPyBuYW1lLnN1YnN0cmluZygwLCAzKSA6ICd4eHgnXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgZ2l2ZW4gdG9waWMgbmFtZSBpcyBhIG5hbWUgb2YgYSAnbWUnIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gdGVzdC5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBuYW1lIGlzIGEgbmFtZSBvZiBhICdtZScgdG9waWMsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBzdGF0aWMgaXNNZVRvcGljTmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIFRvcGljLnRvcGljVHlwZShuYW1lKSA9PSBDb25zdC5UT1BJQ19NRTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgZ2l2ZW4gdG9waWMgbmFtZSBpcyBhIG5hbWUgb2YgYSBncm91cCB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIHRlc3QuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGUgbmFtZSBpcyBhIG5hbWUgb2YgYSBncm91cCB0b3BpYywgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIHN0YXRpYyBpc0dyb3VwVG9waWNOYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gVG9waWMudG9waWNUeXBlKG5hbWUpID09IENvbnN0LlRPUElDX0dSUDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgZ2l2ZW4gdG9waWMgbmFtZSBpcyBhIG5hbWUgb2YgYSBwMnAgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byB0ZXN0LlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdGhlIG5hbWUgaXMgYSBuYW1lIG9mIGEgcDJwIHRvcGljLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgc3RhdGljIGlzUDJQVG9waWNOYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gVG9waWMudG9waWNUeXBlKG5hbWUpID09IENvbnN0LlRPUElDX1AyUDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgZ2l2ZW4gdG9waWMgbmFtZSBpcyBhIG5hbWUgb2YgYSBjb21tdW5pY2F0aW9uIHRvcGljLCBpLmUuIFAyUCBvciBncm91cC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIHRlc3QuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGUgbmFtZSBpcyBhIG5hbWUgb2YgYSBwMnAgb3IgZ3JvdXAgdG9waWMsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBzdGF0aWMgaXNDb21tVG9waWNOYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gVG9waWMuaXNQMlBUb3BpY05hbWUobmFtZSkgfHwgVG9waWMuaXNHcm91cFRvcGljTmFtZShuYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgdG9waWMgbmFtZSBpcyBhIG5hbWUgb2YgYSBuZXcgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSB0b3BpYyBuYW1lIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdGhlIG5hbWUgaXMgYSBuYW1lIG9mIGEgbmV3IHRvcGljLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgc3RhdGljIGlzTmV3R3JvdXBUb3BpY05hbWUobmFtZSkge1xuICAgIHJldHVybiAodHlwZW9mIG5hbWUgPT0gJ3N0cmluZycpICYmXG4gICAgICAobmFtZS5zdWJzdHJpbmcoMCwgMykgPT0gQ29uc3QuVE9QSUNfTkVXIHx8IG5hbWUuc3Vic3RyaW5nKDAsIDMpID09IENvbnN0LlRPUElDX05FV19DSEFOKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgdG9waWMgbmFtZSBpcyBhIG5hbWUgb2YgYSBjaGFubmVsLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gdG9waWMgbmFtZSB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBuYW1lIGlzIGEgbmFtZSBvZiBhIGNoYW5uZWwsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBzdGF0aWMgaXNDaGFubmVsVG9waWNOYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gKHR5cGVvZiBuYW1lID09ICdzdHJpbmcnKSAmJlxuICAgICAgKG5hbWUuc3Vic3RyaW5nKDAsIDMpID09IENvbnN0LlRPUElDX0NIQU4gfHwgbmFtZS5zdWJzdHJpbmcoMCwgMykgPT0gQ29uc3QuVE9QSUNfTkVXX0NIQU4pO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSB0b3BpYyBpcyBzdWJzY3JpYmVkLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpcyB0b3BpYyBpcyBhdHRhY2hlZC9zdWJzY3JpYmVkLCBmYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICBpc1N1YnNjcmliZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2F0dGFjaGVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcXVlc3QgdG9waWMgdG8gc3Vic2NyaWJlLiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI3N1YnNjcmliZX0uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7VGlub2RlLkdldFF1ZXJ5PX0gZ2V0UGFyYW1zIC0gZ2V0IHF1ZXJ5IHBhcmFtZXRlcnMuXG4gICAqIEBwYXJhbSB7VGlub2RlLlNldFBhcmFtcz19IHNldFBhcmFtcyAtIHNldCBwYXJhbWV0ZXJzLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gdGhlIHJlcXVlc3QuXG4gICAqL1xuICBzdWJzY3JpYmUoZ2V0UGFyYW1zLCBzZXRQYXJhbXMpIHtcbiAgICAvLyBDbGVhciByZXF1ZXN0IHRvIGxlYXZlIHRvcGljLlxuICAgIGNsZWFyVGltZW91dCh0aGlzLl9kZWxheWVkTGVhdmVUaW1lcik7XG4gICAgdGhpcy5fZGVsYXllZExlYXZlVGltZXIgPSBudWxsO1xuXG4gICAgLy8gSWYgdGhlIHRvcGljIGlzIGFscmVhZHkgc3Vic2NyaWJlZCwgcmV0dXJuIHJlc29sdmVkIHByb21pc2VcbiAgICBpZiAodGhpcy5fYXR0YWNoZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcyk7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIHRvcGljIGlzIGRlbGV0ZWQsIHJlamVjdCBzdWJzY3JpcHRpb24gcmVxdWVzdHMuXG4gICAgaWYgKHRoaXMuX2RlbGV0ZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJDb252ZXJzYXRpb24gZGVsZXRlZFwiKSk7XG4gICAgfVxuXG4gICAgLy8gU2VuZCBzdWJzY3JpYmUgbWVzc2FnZSwgaGFuZGxlIGFzeW5jIHJlc3BvbnNlLlxuICAgIC8vIElmIHRvcGljIG5hbWUgaXMgZXhwbGljaXRseSBwcm92aWRlZCwgdXNlIGl0LiBJZiBubyBuYW1lLCB0aGVuIGl0J3MgYSBuZXcgZ3JvdXAgdG9waWMsXG4gICAgLy8gdXNlIFwibmV3XCIuXG4gICAgcmV0dXJuIHRoaXMuX3Rpbm9kZS5zdWJzY3JpYmUodGhpcy5uYW1lIHx8IENvbnN0LlRPUElDX05FVywgZ2V0UGFyYW1zLCBzZXRQYXJhbXMpLnRoZW4oY3RybCA9PiB7XG4gICAgICBpZiAoY3RybC5jb2RlID49IDMwMCkge1xuICAgICAgICAvLyBEbyBub3RoaW5nIGlmIHN1YnNjcmlwdGlvbiBzdGF0dXMgaGFzIG5vdCBjaGFuZ2VkLlxuICAgICAgICByZXR1cm4gY3RybDtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fYXR0YWNoZWQgPSB0cnVlO1xuICAgICAgdGhpcy5fZGVsZXRlZCA9IGZhbHNlO1xuICAgICAgdGhpcy5hY3MgPSAoY3RybC5wYXJhbXMgJiYgY3RybC5wYXJhbXMuYWNzKSA/IGN0cmwucGFyYW1zLmFjcyA6IHRoaXMuYWNzO1xuXG4gICAgICAvLyBTZXQgdG9waWMgbmFtZSBmb3IgbmV3IHRvcGljcyBhbmQgYWRkIGl0IHRvIGNhY2hlLlxuICAgICAgaWYgKHRoaXMuX25ldykge1xuICAgICAgICBkZWxldGUgdGhpcy5fbmV3O1xuXG4gICAgICAgIGlmICh0aGlzLm5hbWUgIT0gY3RybC50b3BpYykge1xuICAgICAgICAgIC8vIE5hbWUgbWF5IGNoYW5nZSBuZXcxMjM0NTYgLT4gZ3JwQWJDZEVmLiBSZW1vdmUgZnJvbSBjYWNoZSB1bmRlciB0aGUgb2xkIG5hbWUuXG4gICAgICAgICAgdGhpcy5fY2FjaGVEZWxTZWxmKCk7XG4gICAgICAgICAgdGhpcy5uYW1lID0gY3RybC50b3BpYztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jYWNoZVB1dFNlbGYoKTtcblxuICAgICAgICB0aGlzLmNyZWF0ZWQgPSBjdHJsLnRzO1xuICAgICAgICB0aGlzLnVwZGF0ZWQgPSBjdHJsLnRzO1xuXG4gICAgICAgIGlmICh0aGlzLm5hbWUgIT0gQ29uc3QuVE9QSUNfTUUgJiYgdGhpcy5uYW1lICE9IENvbnN0LlRPUElDX0ZORCkge1xuICAgICAgICAgIC8vIEFkZCB0aGUgbmV3IHRvcGljIHRvIHRoZSBsaXN0IG9mIGNvbnRhY3RzIG1haW50YWluZWQgYnkgdGhlICdtZScgdG9waWMuXG4gICAgICAgICAgY29uc3QgbWUgPSB0aGlzLl90aW5vZGUuZ2V0TWVUb3BpYygpO1xuICAgICAgICAgIGlmIChtZS5vbk1ldGFTdWIpIHtcbiAgICAgICAgICAgIG1lLm9uTWV0YVN1Yih0aGlzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKG1lLm9uU3Vic1VwZGF0ZWQpIHtcbiAgICAgICAgICAgIG1lLm9uU3Vic1VwZGF0ZWQoW3RoaXMubmFtZV0sIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzZXRQYXJhbXMgJiYgc2V0UGFyYW1zLmRlc2MpIHtcbiAgICAgICAgICBzZXRQYXJhbXMuZGVzYy5fbm9Gb3J3YXJkaW5nID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLl9wcm9jZXNzTWV0YURlc2Moc2V0UGFyYW1zLmRlc2MpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gY3RybDtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBkcmFmdCBvZiBhIG1lc3NhZ2Ugd2l0aG91dCBzZW5kaW5nIGl0IHRvIHRoZSBzZXJ2ZXIuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgT2JqZWN0fSBkYXRhIC0gQ29udGVudCB0byB3cmFwIGluIGEgZHJhZnQuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IG5vRWNobyAtIElmIDxjb2RlPnRydWU8L2NvZGU+IHNlcnZlciB3aWxsIG5vdCBlY2hvIG1lc3NhZ2UgYmFjayB0byBvcmlnaW5hdGluZ1xuICAgKiBzZXNzaW9uLiBPdGhlcndpc2UgdGhlIHNlcnZlciB3aWxsIHNlbmQgYSBjb3B5IG9mIHRoZSBtZXNzYWdlIHRvIHNlbmRlci5cbiAgICpcbiAgICogQHJldHVybnMge09iamVjdH0gbWVzc2FnZSBkcmFmdC5cbiAgICovXG4gIGNyZWF0ZU1lc3NhZ2UoZGF0YSwgbm9FY2hvKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Rpbm9kZS5jcmVhdGVNZXNzYWdlKHRoaXMubmFtZSwgZGF0YSwgbm9FY2hvKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbW1lZGlhdGVseSBwdWJsaXNoIGRhdGEgdG8gdG9waWMuIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjcHVibGlzaH0uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgT2JqZWN0fSBkYXRhIC0gTWVzc2FnZSB0byBwdWJsaXNoLCBlaXRoZXIgcGxhaW4gc3RyaW5nIG9yIGEgRHJhZnR5IG9iamVjdC5cbiAgICogQHBhcmFtIHtib29sZWFuPX0gbm9FY2hvIC0gSWYgPGNvZGU+dHJ1ZTwvY29kZT4gc2VydmVyIHdpbGwgbm90IGVjaG8gbWVzc2FnZSBiYWNrIHRvIG9yaWdpbmF0aW5nXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byB0aGUgcmVxdWVzdC5cbiAgICovXG4gIHB1Ymxpc2goZGF0YSwgbm9FY2hvKSB7XG4gICAgcmV0dXJuIHRoaXMucHVibGlzaE1lc3NhZ2UodGhpcy5jcmVhdGVNZXNzYWdlKGRhdGEsIG5vRWNobykpO1xuICB9XG5cbiAgLyoqXG4gICAqIFB1Ymxpc2ggbWVzc2FnZSBjcmVhdGVkIGJ5IHtAbGluayBUaW5vZGUuVG9waWMjY3JlYXRlTWVzc2FnZX0uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwdWIgLSB7ZGF0YX0gb2JqZWN0IHRvIHB1Ymxpc2guIE11c3QgYmUgY3JlYXRlZCBieSB7QGxpbmsgVGlub2RlLlRvcGljI2NyZWF0ZU1lc3NhZ2V9XG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byB0aGUgcmVxdWVzdC5cbiAgICovXG4gIHB1Ymxpc2hNZXNzYWdlKHB1Yikge1xuICAgIGlmICghdGhpcy5fYXR0YWNoZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJDYW5ub3QgcHVibGlzaCBvbiBpbmFjdGl2ZSB0b3BpY1wiKSk7XG4gICAgfVxuICAgIGlmICh0aGlzLl9zZW5kaW5nKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiVGhlIG1lc3NhZ2UgaXMgYWxyZWFkeSBiZWluZyBzZW50XCIpKTtcbiAgICB9XG5cbiAgICAvLyBTZW5kIGRhdGEuXG4gICAgcHViLl9zZW5kaW5nID0gdHJ1ZTtcbiAgICBwdWIuX2ZhaWxlZCA9IGZhbHNlO1xuXG4gICAgLy8gRXh0cmFjdCByZWZlcmVjZXMgdG8gYXR0YWNobWVudHMgYW5kIG91dCBvZiBiYW5kIGltYWdlIHJlY29yZHMuXG4gICAgbGV0IGF0dGFjaG1lbnRzID0gbnVsbDtcbiAgICBpZiAoRHJhZnR5Lmhhc0VudGl0aWVzKHB1Yi5jb250ZW50KSkge1xuICAgICAgYXR0YWNobWVudHMgPSBbXTtcbiAgICAgIERyYWZ0eS5lbnRpdGllcyhwdWIuY29udGVudCwgZGF0YSA9PiB7XG4gICAgICAgIGlmIChkYXRhICYmIGRhdGEucmVmKSB7XG4gICAgICAgICAgYXR0YWNobWVudHMucHVzaChkYXRhLnJlZik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgaWYgKGF0dGFjaG1lbnRzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIGF0dGFjaG1lbnRzID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fdGlub2RlLnB1Ymxpc2hNZXNzYWdlKHB1YiwgYXR0YWNobWVudHMpLnRoZW4oY3RybCA9PiB7XG4gICAgICBwdWIuX3NlbmRpbmcgPSBmYWxzZTtcbiAgICAgIHB1Yi50cyA9IGN0cmwudHM7XG4gICAgICB0aGlzLnN3YXBNZXNzYWdlSWQocHViLCBjdHJsLnBhcmFtcy5zZXEpO1xuICAgICAgdGhpcy5fbWF5YmVVcGRhdGVNZXNzYWdlVmVyc2lvbnNDYWNoZShwdWIpO1xuICAgICAgdGhpcy5fcm91dGVEYXRhKHB1Yik7XG4gICAgICByZXR1cm4gY3RybDtcbiAgICB9KS5jYXRjaChlcnIgPT4ge1xuICAgICAgdGhpcy5fdGlub2RlLmxvZ2dlcihcIldBUk5JTkc6IE1lc3NhZ2UgcmVqZWN0ZWQgYnkgdGhlIHNlcnZlclwiLCBlcnIpO1xuICAgICAgcHViLl9zZW5kaW5nID0gZmFsc2U7XG4gICAgICBwdWIuX2ZhaWxlZCA9IHRydWU7XG4gICAgICBpZiAodGhpcy5vbkRhdGEpIHtcbiAgICAgICAgdGhpcy5vbkRhdGEoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgbWVzc2FnZSB0byBsb2NhbCBtZXNzYWdlIGNhY2hlLCBzZW5kIHRvIHRoZSBzZXJ2ZXIgd2hlbiB0aGUgcHJvbWlzZSBpcyByZXNvbHZlZC5cbiAgICogSWYgcHJvbWlzZSBpcyBudWxsIG9yIHVuZGVmaW5lZCwgdGhlIG1lc3NhZ2Ugd2lsbCBiZSBzZW50IGltbWVkaWF0ZWx5LlxuICAgKiBUaGUgbWVzc2FnZSBpcyBzZW50IHdoZW4gdGhlXG4gICAqIFRoZSBtZXNzYWdlIHNob3VsZCBiZSBjcmVhdGVkIGJ5IHtAbGluayBUaW5vZGUuVG9waWMjY3JlYXRlTWVzc2FnZX0uXG4gICAqIFRoaXMgaXMgcHJvYmFibHkgbm90IHRoZSBmaW5hbCBBUEkuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwdWIgLSBNZXNzYWdlIHRvIHVzZSBhcyBhIGRyYWZ0LlxuICAgKiBAcGFyYW0ge1Byb21pc2V9IHByb20gLSBNZXNzYWdlIHdpbGwgYmUgc2VudCB3aGVuIHRoaXMgcHJvbWlzZSBpcyByZXNvbHZlZCwgZGlzY2FyZGVkIGlmIHJlamVjdGVkLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gZGVyaXZlZCBwcm9taXNlLlxuICAgKi9cbiAgcHVibGlzaERyYWZ0KHB1YiwgcHJvbSkge1xuICAgIGNvbnN0IHNlcSA9IHB1Yi5zZXEgfHwgdGhpcy5fZ2V0UXVldWVkU2VxSWQoKTtcbiAgICBpZiAoIXB1Yi5fbm9Gb3J3YXJkaW5nKSB7XG4gICAgICAvLyBUaGUgJ3NlcScsICd0cycsIGFuZCAnZnJvbScgYXJlIGFkZGVkIHRvIG1pbWljIHtkYXRhfS4gVGhleSBhcmUgcmVtb3ZlZCBsYXRlclxuICAgICAgLy8gYmVmb3JlIHRoZSBtZXNzYWdlIGlzIHNlbnQuXG4gICAgICBwdWIuX25vRm9yd2FyZGluZyA9IHRydWU7XG4gICAgICBwdWIuc2VxID0gc2VxO1xuICAgICAgcHViLnRzID0gbmV3IERhdGUoKTtcbiAgICAgIHB1Yi5mcm9tID0gdGhpcy5fdGlub2RlLmdldEN1cnJlbnRVc2VySUQoKTtcblxuICAgICAgLy8gRG9uJ3QgbmVlZCBhbiBlY2hvIG1lc3NhZ2UgYmVjYXVzZSB0aGUgbWVzc2FnZSBpcyBhZGRlZCB0byBsb2NhbCBjYWNoZSByaWdodCBhd2F5LlxuICAgICAgcHViLm5vZWNobyA9IHRydWU7XG4gICAgICAvLyBBZGQgdG8gY2FjaGUuXG4gICAgICB0aGlzLl9tZXNzYWdlcy5wdXQocHViKTtcbiAgICAgIHRoaXMuX3Rpbm9kZS5fZGIuYWRkTWVzc2FnZShwdWIpO1xuXG4gICAgICBpZiAodGhpcy5vbkRhdGEpIHtcbiAgICAgICAgdGhpcy5vbkRhdGEocHViKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gSWYgcHJvbWlzZSBpcyBwcm92aWRlZCwgc2VuZCB0aGUgcXVldWVkIG1lc3NhZ2Ugd2hlbiBpdCdzIHJlc29sdmVkLlxuICAgIC8vIElmIG5vIHByb21pc2UgaXMgcHJvdmlkZWQsIGNyZWF0ZSBhIHJlc29sdmVkIG9uZSBhbmQgc2VuZCBpbW1lZGlhdGVseS5cbiAgICByZXR1cm4gKHByb20gfHwgUHJvbWlzZS5yZXNvbHZlKCkpXG4gICAgICAudGhlbihfID0+IHtcbiAgICAgICAgaWYgKHB1Yi5fY2FuY2VsbGVkKSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvZGU6IDMwMCxcbiAgICAgICAgICAgIHRleHQ6IFwiY2FuY2VsbGVkXCJcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnB1Ymxpc2hNZXNzYWdlKHB1Yik7XG4gICAgICB9KS5jYXRjaChlcnIgPT4ge1xuICAgICAgICB0aGlzLl90aW5vZGUubG9nZ2VyKFwiV0FSTklORzogTWVzc2FnZSBkcmFmdCByZWplY3RlZFwiLCBlcnIpO1xuICAgICAgICBwdWIuX3NlbmRpbmcgPSBmYWxzZTtcbiAgICAgICAgcHViLl9mYWlsZWQgPSB0cnVlO1xuICAgICAgICBpZiAodGhpcy5vbkRhdGEpIHtcbiAgICAgICAgICB0aGlzLm9uRGF0YSgpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFJldGhyb3cgdG8gbGV0IGNhbGxlciBrbm93IHRoYXQgdGhlIG9wZXJhdGlvbiBmYWlsZWQuXG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIExlYXZlIHRoZSB0b3BpYywgb3B0aW9uYWxseSB1bnNpYnNjcmliZS4gTGVhdmluZyB0aGUgdG9waWMgbWVhbnMgdGhlIHRvcGljIHdpbGwgc3RvcFxuICAgKiByZWNlaXZpbmcgdXBkYXRlcyBmcm9tIHRoZSBzZXJ2ZXIuIFVuc3Vic2NyaWJpbmcgd2lsbCB0ZXJtaW5hdGUgdXNlcidzIHJlbGF0aW9uc2hpcCB3aXRoIHRoZSB0b3BpYy5cbiAgICogV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNsZWF2ZX0uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IHVuc3ViIC0gSWYgdHJ1ZSwgdW5zdWJzY3JpYmUsIG90aGVyd2lzZSBqdXN0IGxlYXZlLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gdGhlIHJlcXVlc3QuXG4gICAqL1xuICBsZWF2ZSh1bnN1Yikge1xuICAgIC8vIEl0J3MgcG9zc2libGUgdG8gdW5zdWJzY3JpYmUgKHVuc3ViPT10cnVlKSBmcm9tIGluYWN0aXZlIHRvcGljLlxuICAgIGlmICghdGhpcy5fYXR0YWNoZWQgJiYgIXVuc3ViKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiQ2Fubm90IGxlYXZlIGluYWN0aXZlIHRvcGljXCIpKTtcbiAgICB9XG5cbiAgICAvLyBTZW5kIGEgJ2xlYXZlJyBtZXNzYWdlLCBoYW5kbGUgYXN5bmMgcmVzcG9uc2VcbiAgICByZXR1cm4gdGhpcy5fdGlub2RlLmxlYXZlKHRoaXMubmFtZSwgdW5zdWIpLnRoZW4oY3RybCA9PiB7XG4gICAgICB0aGlzLl9yZXNldFN1YigpO1xuICAgICAgaWYgKHVuc3ViKSB7XG4gICAgICAgIHRoaXMuX2dvbmUoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjdHJsO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIExlYXZlIHRoZSB0b3BpYywgb3B0aW9uYWxseSB1bnNpYnNjcmliZSBhZnRlciBhIGRlbGF5LiBMZWF2aW5nIHRoZSB0b3BpYyBtZWFucyB0aGUgdG9waWMgd2lsbCBzdG9wXG4gICAqIHJlY2VpdmluZyB1cGRhdGVzIGZyb20gdGhlIHNlcnZlci4gVW5zdWJzY3JpYmluZyB3aWxsIHRlcm1pbmF0ZSB1c2VyJ3MgcmVsYXRpb25zaGlwIHdpdGggdGhlIHRvcGljLlxuICAgKiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI2xlYXZlfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSB1bnN1YiAtIElmIHRydWUsIHVuc3Vic2NyaWJlLCBvdGhlcndpc2UganVzdCBsZWF2ZS5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGRlbGF5IC0gdGltZSBpbiBtaWxsaXNlY29uZHMgdG8gZGVsYXkgbGVhdmUgcmVxdWVzdC5cbiAgICovXG4gIGxlYXZlRGVsYXllZCh1bnN1YiwgZGVsYXkpIHtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5fZGVsYXllZExlYXZlVGltZXIpO1xuICAgIHRoaXMuX2RlbGF5ZWRMZWF2ZVRpbWVyID0gc2V0VGltZW91dChfID0+IHtcbiAgICAgIHRoaXMuX2RlbGF5ZWRMZWF2ZVRpbWVyID0gbnVsbDtcbiAgICAgIHRoaXMubGVhdmUodW5zdWIpXG4gICAgfSwgZGVsYXkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcXVlc3QgdG9waWMgbWV0YWRhdGEgZnJvbSB0aGUgc2VydmVyLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5HZXRRdWVyeX0gcmVxdWVzdCBwYXJhbWV0ZXJzXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byByZXF1ZXN0LlxuICAgKi9cbiAgZ2V0TWV0YShwYXJhbXMpIHtcbiAgICAvLyBTZW5kIHtnZXR9IG1lc3NhZ2UsIHJldHVybiBwcm9taXNlLlxuICAgIHJldHVybiB0aGlzLl90aW5vZGUuZ2V0TWV0YSh0aGlzLm5hbWUsIHBhcmFtcyk7XG4gIH1cblxuICAvKipcbiAgICogUmVxdWVzdCBtb3JlIG1lc3NhZ2VzIGZyb20gdGhlIHNlcnZlclxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gbGltaXQgbnVtYmVyIG9mIG1lc3NhZ2VzIHRvIGdldC5cbiAgICogQHBhcmFtIHtib29sZWFufSBmb3J3YXJkIGlmIHRydWUsIHJlcXVlc3QgbmV3ZXIgbWVzc2FnZXMuXG4gICAqL1xuICBnZXRNZXNzYWdlc1BhZ2UobGltaXQsIGZvcndhcmQpIHtcbiAgICBsZXQgcXVlcnkgPSBmb3J3YXJkID9cbiAgICAgIHRoaXMuc3RhcnRNZXRhUXVlcnkoKS53aXRoTGF0ZXJEYXRhKGxpbWl0KSA6XG4gICAgICB0aGlzLnN0YXJ0TWV0YVF1ZXJ5KCkud2l0aEVhcmxpZXJEYXRhKGxpbWl0KTtcblxuICAgIC8vIEZpcnN0IHRyeSBmZXRjaGluZyBmcm9tIERCLCB0aGVuIGZyb20gdGhlIHNlcnZlci5cbiAgICByZXR1cm4gdGhpcy5fbG9hZE1lc3NhZ2VzKHRoaXMuX3Rpbm9kZS5fZGIsIHF1ZXJ5LmV4dHJhY3QoJ2RhdGEnKSlcbiAgICAgIC50aGVuKChjb3VudCkgPT4ge1xuICAgICAgICBpZiAoY291bnQgPT0gbGltaXQpIHtcbiAgICAgICAgICAvLyBHb3QgZW5vdWdoIG1lc3NhZ2VzIGZyb20gbG9jYWwgY2FjaGUuXG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7XG4gICAgICAgICAgICB0b3BpYzogdGhpcy5uYW1lLFxuICAgICAgICAgICAgY29kZTogMjAwLFxuICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgIGNvdW50OiBjb3VudFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVkdWNlIHRoZSBjb3VudCBvZiByZXF1ZXN0ZWQgbWVzc2FnZXMuXG4gICAgICAgIGxpbWl0IC09IGNvdW50O1xuICAgICAgICAvLyBVcGRhdGUgcXVlcnkgd2l0aCBuZXcgdmFsdWVzIGxvYWRlZCBmcm9tIERCLlxuICAgICAgICBxdWVyeSA9IGZvcndhcmQgPyB0aGlzLnN0YXJ0TWV0YVF1ZXJ5KCkud2l0aExhdGVyRGF0YShsaW1pdCkgOlxuICAgICAgICAgIHRoaXMuc3RhcnRNZXRhUXVlcnkoKS53aXRoRWFybGllckRhdGEobGltaXQpO1xuICAgICAgICBsZXQgcHJvbWlzZSA9IHRoaXMuZ2V0TWV0YShxdWVyeS5idWlsZCgpKTtcbiAgICAgICAgaWYgKCFmb3J3YXJkKSB7XG4gICAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbihjdHJsID0+IHtcbiAgICAgICAgICAgIGlmIChjdHJsICYmIGN0cmwucGFyYW1zICYmICFjdHJsLnBhcmFtcy5jb3VudCkge1xuICAgICAgICAgICAgICB0aGlzLl9ub0VhcmxpZXJNc2dzID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgIH0pO1xuICB9XG4gIC8qKlxuICAgKiBVcGRhdGUgdG9waWMgbWV0YWRhdGEuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7VGlub2RlLlNldFBhcmFtc30gcGFyYW1zIHBhcmFtZXRlcnMgdG8gdXBkYXRlLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gcmVxdWVzdC5cbiAgICovXG4gIHNldE1ldGEocGFyYW1zKSB7XG4gICAgaWYgKHBhcmFtcy50YWdzKSB7XG4gICAgICBwYXJhbXMudGFncyA9IG5vcm1hbGl6ZUFycmF5KHBhcmFtcy50YWdzKTtcbiAgICB9XG4gICAgLy8gU2VuZCBTZXQgbWVzc2FnZSwgaGFuZGxlIGFzeW5jIHJlc3BvbnNlLlxuICAgIHJldHVybiB0aGlzLl90aW5vZGUuc2V0TWV0YSh0aGlzLm5hbWUsIHBhcmFtcylcbiAgICAgIC50aGVuKGN0cmwgPT4ge1xuICAgICAgICBpZiAoY3RybCAmJiBjdHJsLmNvZGUgPj0gMzAwKSB7XG4gICAgICAgICAgLy8gTm90IG1vZGlmaWVkXG4gICAgICAgICAgcmV0dXJuIGN0cmw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGFyYW1zLnN1Yikge1xuICAgICAgICAgIHBhcmFtcy5zdWIudG9waWMgPSB0aGlzLm5hbWU7XG4gICAgICAgICAgaWYgKGN0cmwucGFyYW1zICYmIGN0cmwucGFyYW1zLmFjcykge1xuICAgICAgICAgICAgcGFyYW1zLnN1Yi5hY3MgPSBjdHJsLnBhcmFtcy5hY3M7XG4gICAgICAgICAgICBwYXJhbXMuc3ViLnVwZGF0ZWQgPSBjdHJsLnRzO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIXBhcmFtcy5zdWIudXNlcikge1xuICAgICAgICAgICAgLy8gVGhpcyBpcyBhIHN1YnNjcmlwdGlvbiB1cGRhdGUgb2YgdGhlIGN1cnJlbnQgdXNlci5cbiAgICAgICAgICAgIC8vIEFzc2lnbiB1c2VyIElEIG90aGVyd2lzZSB0aGUgdXBkYXRlIHdpbGwgYmUgaWdub3JlZCBieSBfcHJvY2Vzc01ldGFTdWIuXG4gICAgICAgICAgICBwYXJhbXMuc3ViLnVzZXIgPSB0aGlzLl90aW5vZGUuZ2V0Q3VycmVudFVzZXJJRCgpO1xuICAgICAgICAgICAgaWYgKCFwYXJhbXMuZGVzYykge1xuICAgICAgICAgICAgICAvLyBGb3JjZSB1cGRhdGUgdG8gdG9waWMncyBhc2MuXG4gICAgICAgICAgICAgIHBhcmFtcy5kZXNjID0ge307XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHBhcmFtcy5zdWIuX25vRm9yd2FyZGluZyA9IHRydWU7XG4gICAgICAgICAgdGhpcy5fcHJvY2Vzc01ldGFTdWIoW3BhcmFtcy5zdWJdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwYXJhbXMuZGVzYykge1xuICAgICAgICAgIGlmIChjdHJsLnBhcmFtcyAmJiBjdHJsLnBhcmFtcy5hY3MpIHtcbiAgICAgICAgICAgIHBhcmFtcy5kZXNjLmFjcyA9IGN0cmwucGFyYW1zLmFjcztcbiAgICAgICAgICAgIHBhcmFtcy5kZXNjLnVwZGF0ZWQgPSBjdHJsLnRzO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLl9wcm9jZXNzTWV0YURlc2MocGFyYW1zLmRlc2MpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBhcmFtcy50YWdzKSB7XG4gICAgICAgICAgdGhpcy5fcHJvY2Vzc01ldGFUYWdzKHBhcmFtcy50YWdzKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFyYW1zLmNyZWQpIHtcbiAgICAgICAgICB0aGlzLl9wcm9jZXNzTWV0YUNyZWRzKFtwYXJhbXMuY3JlZF0sIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGN0cmw7XG4gICAgICB9KTtcbiAgfVxuICAvKipcbiAgICogVXBkYXRlIGFjY2VzcyBtb2RlIG9mIHRoZSBjdXJyZW50IHVzZXIgb3Igb2YgYW5vdGhlciB0b3BpYyBzdWJzcmliZXIuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBVSUQgb2YgdGhlIHVzZXIgdG8gdXBkYXRlIG9yIG51bGwgdG8gdXBkYXRlIGN1cnJlbnQgdXNlci5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHVwZGF0ZSAtIHRoZSB1cGRhdGUgdmFsdWUsIGZ1bGwgb3IgZGVsdGEuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byByZXF1ZXN0LlxuICAgKi9cbiAgdXBkYXRlTW9kZSh1aWQsIHVwZGF0ZSkge1xuICAgIGNvbnN0IHVzZXIgPSB1aWQgPyB0aGlzLnN1YnNjcmliZXIodWlkKSA6IG51bGw7XG4gICAgY29uc3QgYW0gPSB1c2VyID9cbiAgICAgIHVzZXIuYWNzLnVwZGF0ZUdpdmVuKHVwZGF0ZSkuZ2V0R2l2ZW4oKSA6XG4gICAgICB0aGlzLmdldEFjY2Vzc01vZGUoKS51cGRhdGVXYW50KHVwZGF0ZSkuZ2V0V2FudCgpO1xuXG4gICAgcmV0dXJuIHRoaXMuc2V0TWV0YSh7XG4gICAgICBzdWI6IHtcbiAgICAgICAgdXNlcjogdWlkLFxuICAgICAgICBtb2RlOiBhbVxuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIC8qKlxuICAgKiBDcmVhdGUgbmV3IHRvcGljIHN1YnNjcmlwdGlvbi4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNzZXRNZXRhfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVpZCAtIElEIG9mIHRoZSB1c2VyIHRvIGludml0ZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IG1vZGUgLSBBY2Nlc3MgbW9kZS4gPGNvZGU+bnVsbDwvY29kZT4gbWVhbnMgdG8gdXNlIGRlZmF1bHQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byByZXF1ZXN0LlxuICAgKi9cbiAgaW52aXRlKHVpZCwgbW9kZSkge1xuICAgIHJldHVybiB0aGlzLnNldE1ldGEoe1xuICAgICAgc3ViOiB7XG4gICAgICAgIHVzZXI6IHVpZCxcbiAgICAgICAgbW9kZTogbW9kZVxuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIC8qKlxuICAgKiBBcmNoaXZlIG9yIHVuLWFyY2hpdmUgdGhlIHRvcGljLiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI3NldE1ldGF9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGFyY2ggLSB0cnVlIHRvIGFyY2hpdmUgdGhlIHRvcGljLCBmYWxzZSBvdGhlcndpc2UuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byByZXF1ZXN0LlxuICAgKi9cbiAgYXJjaGl2ZShhcmNoKSB7XG4gICAgaWYgKHRoaXMucHJpdmF0ZSAmJiAoIXRoaXMucHJpdmF0ZS5hcmNoID09ICFhcmNoKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShhcmNoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2V0TWV0YSh7XG4gICAgICBkZXNjOiB7XG4gICAgICAgIHByaXZhdGU6IHtcbiAgICAgICAgICBhcmNoOiBhcmNoID8gdHJ1ZSA6IENvbnN0LkRFTF9DSEFSXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICAvKipcbiAgICogRGVsZXRlIG1lc3NhZ2VzLiBIYXJkLWRlbGV0aW5nIG1lc3NhZ2VzIHJlcXVpcmVzIE93bmVyIHBlcm1pc3Npb24uXG4gICAqIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjZGVsTWVzc2FnZXN9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5EZWxSYW5nZVtdfSByYW5nZXMgLSBSYW5nZXMgb2YgbWVzc2FnZSBJRHMgdG8gZGVsZXRlLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBoYXJkIC0gSGFyZCBvciBzb2Z0IGRlbGV0ZVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gcmVxdWVzdC5cbiAgICovXG4gIGRlbE1lc3NhZ2VzKHJhbmdlcywgaGFyZCkge1xuICAgIGlmICghdGhpcy5fYXR0YWNoZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJDYW5ub3QgZGVsZXRlIG1lc3NhZ2VzIGluIGluYWN0aXZlIHRvcGljXCIpKTtcbiAgICB9XG5cbiAgICAvLyBTb3J0IHJhbmdlcyBpbiBhY2NlbmRpbmcgb3JkZXIgYnkgbG93LCB0aGUgZGVzY2VuZGluZyBieSBoaS5cbiAgICByYW5nZXMuc29ydCgocjEsIHIyKSA9PiB7XG4gICAgICBpZiAocjEubG93IDwgcjIubG93KSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKHIxLmxvdyA9PSByMi5sb3cpIHtcbiAgICAgICAgcmV0dXJuICFyMi5oaSB8fCAocjEuaGkgPj0gcjIuaGkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuXG4gICAgLy8gUmVtb3ZlIHBlbmRpbmcgbWVzc2FnZXMgZnJvbSByYW5nZXMgcG9zc2libHkgY2xpcHBpbmcgc29tZSByYW5nZXMuXG4gICAgbGV0IHRvc2VuZCA9IHJhbmdlcy5yZWR1Y2UoKG91dCwgcikgPT4ge1xuICAgICAgaWYgKHIubG93IDwgQ29uc3QuTE9DQUxfU0VRSUQpIHtcbiAgICAgICAgaWYgKCFyLmhpIHx8IHIuaGkgPCBDb25zdC5MT0NBTF9TRVFJRCkge1xuICAgICAgICAgIG91dC5wdXNoKHIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIENsaXAgaGkgdG8gbWF4IGFsbG93ZWQgdmFsdWUuXG4gICAgICAgICAgb3V0LnB1c2goe1xuICAgICAgICAgICAgbG93OiByLmxvdyxcbiAgICAgICAgICAgIGhpOiB0aGlzLl9tYXhTZXEgKyAxXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBvdXQ7XG4gICAgfSwgW10pO1xuXG4gICAgLy8gU2VuZCB7ZGVsfSBtZXNzYWdlLCByZXR1cm4gcHJvbWlzZVxuICAgIGxldCByZXN1bHQ7XG4gICAgaWYgKHRvc2VuZC5sZW5ndGggPiAwKSB7XG4gICAgICByZXN1bHQgPSB0aGlzLl90aW5vZGUuZGVsTWVzc2FnZXModGhpcy5uYW1lLCB0b3NlbmQsIGhhcmQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQgPSBQcm9taXNlLnJlc29sdmUoe1xuICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICBkZWw6IDBcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIC8vIFVwZGF0ZSBsb2NhbCBjYWNoZS5cbiAgICByZXR1cm4gcmVzdWx0LnRoZW4oY3RybCA9PiB7XG4gICAgICBpZiAoY3RybC5wYXJhbXMuZGVsID4gdGhpcy5fbWF4RGVsKSB7XG4gICAgICAgIHRoaXMuX21heERlbCA9IGN0cmwucGFyYW1zLmRlbDtcbiAgICAgIH1cblxuICAgICAgcmFuZ2VzLmZvckVhY2goKHIpID0+IHtcbiAgICAgICAgaWYgKHIuaGkpIHtcbiAgICAgICAgICB0aGlzLmZsdXNoTWVzc2FnZVJhbmdlKHIubG93LCByLmhpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmZsdXNoTWVzc2FnZShyLmxvdyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBpZiAodGhpcy5vbkRhdGEpIHtcbiAgICAgICAgLy8gQ2FsbGluZyB3aXRoIG5vIHBhcmFtZXRlcnMgdG8gaW5kaWNhdGUgdGhlIG1lc3NhZ2VzIHdlcmUgZGVsZXRlZC5cbiAgICAgICAgdGhpcy5vbkRhdGEoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjdHJsO1xuICAgIH0pO1xuICB9XG4gIC8qKlxuICAgKiBEZWxldGUgYWxsIG1lc3NhZ2VzLiBIYXJkLWRlbGV0aW5nIG1lc3NhZ2VzIHJlcXVpcmVzIERlbGV0ZXIgcGVybWlzc2lvbi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBoYXJkRGVsIC0gdHJ1ZSBpZiBtZXNzYWdlcyBzaG91bGQgYmUgaGFyZC1kZWxldGVkLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gcmVxdWVzdC5cbiAgICovXG4gIGRlbE1lc3NhZ2VzQWxsKGhhcmREZWwpIHtcbiAgICBpZiAoIXRoaXMuX21heFNlcSB8fCB0aGlzLl9tYXhTZXEgPD0gMCkge1xuICAgICAgLy8gVGhlcmUgYXJlIG5vIG1lc3NhZ2VzIHRvIGRlbGV0ZS5cbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZGVsTWVzc2FnZXMoW3tcbiAgICAgIGxvdzogMSxcbiAgICAgIGhpOiB0aGlzLl9tYXhTZXEgKyAxLFxuICAgICAgX2FsbDogdHJ1ZVxuICAgIH1dLCBoYXJkRGVsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxldGUgbXVsdGlwbGUgbWVzc2FnZXMgZGVmaW5lZCBieSB0aGVpciBJRHMuIEhhcmQtZGVsZXRpbmcgbWVzc2FnZXMgcmVxdWlyZXMgRGVsZXRlciBwZXJtaXNzaW9uLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5LjxudW1iZXI+fSBsaXN0IC0gbGlzdCBvZiBzZXEgSURzIHRvIGRlbGV0ZS5cbiAgICogQHBhcmFtIHtib29sZWFuPX0gaGFyZERlbCAtIHRydWUgaWYgbWVzc2FnZXMgc2hvdWxkIGJlIGhhcmQtZGVsZXRlZC5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHJlcXVlc3QuXG4gICAqL1xuICBkZWxNZXNzYWdlc0xpc3QobGlzdCwgaGFyZERlbCkge1xuICAgIC8vIFNvcnQgdGhlIGxpc3QgaW4gYXNjZW5kaW5nIG9yZGVyXG4gICAgbGlzdC5zb3J0KChhLCBiKSA9PiBhIC0gYik7XG4gICAgLy8gQ29udmVydCB0aGUgYXJyYXkgb2YgSURzIHRvIHJhbmdlcy5cbiAgICBsZXQgcmFuZ2VzID0gbGlzdC5yZWR1Y2UoKG91dCwgaWQpID0+IHtcbiAgICAgIGlmIChvdXQubGVuZ3RoID09IDApIHtcbiAgICAgICAgLy8gRmlyc3QgZWxlbWVudC5cbiAgICAgICAgb3V0LnB1c2goe1xuICAgICAgICAgIGxvdzogaWRcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgcHJldiA9IG91dFtvdXQubGVuZ3RoIC0gMV07XG4gICAgICAgIGlmICgoIXByZXYuaGkgJiYgKGlkICE9IHByZXYubG93ICsgMSkpIHx8IChpZCA+IHByZXYuaGkpKSB7XG4gICAgICAgICAgLy8gTmV3IHJhbmdlLlxuICAgICAgICAgIG91dC5wdXNoKHtcbiAgICAgICAgICAgIGxvdzogaWRcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBFeHBhbmQgZXhpc3RpbmcgcmFuZ2UuXG4gICAgICAgICAgcHJldi5oaSA9IHByZXYuaGkgPyBNYXRoLm1heChwcmV2LmhpLCBpZCArIDEpIDogaWQgKyAxO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0O1xuICAgIH0sIFtdKTtcbiAgICAvLyBTZW5kIHtkZWx9IG1lc3NhZ2UsIHJldHVybiBwcm9taXNlXG4gICAgcmV0dXJuIHRoaXMuZGVsTWVzc2FnZXMocmFuZ2VzLCBoYXJkRGVsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxldGUgb3JpZ2luYWwgbWVzc2FnZSBhbmQgZWRpdGVkIHZhcmlhbnRzLiBIYXJkLWRlbGV0aW5nIG1lc3NhZ2VzIHJlcXVpcmVzIERlbGV0ZXIgcGVybWlzc2lvbi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHNlcSAtIG9yaWdpbmFsIHNlcSBJRCBvZiB0aGUgbWVzc2FnZSB0byBkZWxldGUuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IGhhcmREZWwgLSB0cnVlIGlmIG1lc3NhZ2VzIHNob3VsZCBiZSBoYXJkLWRlbGV0ZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byB0aGUgcmVxdWVzdC5cbiAgICovXG4gIGRlbE1lc3NhZ2VzRWRpdHMoc2VxLCBoYXJkRGVsKSB7XG4gICAgY29uc3QgbGlzdCA9IFtzZXFdO1xuICAgIHRoaXMubWVzc2FnZVZlcnNpb25zKHNlcSwgbXNnID0+IGxpc3QucHVzaChtc2cuc2VxKSk7XG4gICAgLy8gU2VuZCB7ZGVsfSBtZXNzYWdlLCByZXR1cm4gcHJvbWlzZVxuICAgIHJldHVybiB0aGlzLmRlbE1lc3NhZ2VzTGlzdChsaXN0LCBoYXJkRGVsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxldGUgdG9waWMuIFJlcXVpcmVzIE93bmVyIHBlcm1pc3Npb24uIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjZGVsVG9waWN9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGhhcmQgLSBoYWQtZGVsZXRlIHRvcGljLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gdGhlIHJlcXVlc3QuXG4gICAqL1xuICBkZWxUb3BpYyhoYXJkKSB7XG4gICAgaWYgKHRoaXMuX2RlbGV0ZWQpIHtcbiAgICAgIC8vIFRoZSB0b3BpYyBpcyBhbHJlYWR5IGRlbGV0ZWQgYXQgdGhlIHNlcnZlciwganVzdCByZW1vdmUgZnJvbSBEQi5cbiAgICAgIHRoaXMuX2dvbmUoKTtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobnVsbCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3Rpbm9kZS5kZWxUb3BpYyh0aGlzLm5hbWUsIGhhcmQpLnRoZW4oY3RybCA9PiB7XG4gICAgICB0aGlzLl9kZWxldGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuX3Jlc2V0U3ViKCk7XG4gICAgICB0aGlzLl9nb25lKCk7XG4gICAgICByZXR1cm4gY3RybDtcbiAgICB9KTtcbiAgfVxuICAvKipcbiAgICogRGVsZXRlIHN1YnNjcmlwdGlvbi4gUmVxdWlyZXMgU2hhcmUgcGVybWlzc2lvbi4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNkZWxTdWJzY3JpcHRpb259LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXNlciAtIElEIG9mIHRoZSB1c2VyIHRvIHJlbW92ZSBzdWJzY3JpcHRpb24gZm9yLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gcmVxdWVzdC5cbiAgICovXG4gIGRlbFN1YnNjcmlwdGlvbih1c2VyKSB7XG4gICAgaWYgKCF0aGlzLl9hdHRhY2hlZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkNhbm5vdCBkZWxldGUgc3Vic2NyaXB0aW9uIGluIGluYWN0aXZlIHRvcGljXCIpKTtcbiAgICB9XG4gICAgLy8gU2VuZCB7ZGVsfSBtZXNzYWdlLCByZXR1cm4gcHJvbWlzZVxuICAgIHJldHVybiB0aGlzLl90aW5vZGUuZGVsU3Vic2NyaXB0aW9uKHRoaXMubmFtZSwgdXNlcikudGhlbihjdHJsID0+IHtcbiAgICAgIC8vIFJlbW92ZSB0aGUgb2JqZWN0IGZyb20gdGhlIHN1YnNjcmlwdGlvbiBjYWNoZTtcbiAgICAgIGRlbGV0ZSB0aGlzLl91c2Vyc1t1c2VyXTtcbiAgICAgIC8vIE5vdGlmeSBsaXN0ZW5lcnNcbiAgICAgIGlmICh0aGlzLm9uU3Vic1VwZGF0ZWQpIHtcbiAgICAgICAgdGhpcy5vblN1YnNVcGRhdGVkKE9iamVjdC5rZXlzKHRoaXMuX3VzZXJzKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY3RybDtcbiAgICB9KTtcbiAgfVxuICAvKipcbiAgICogU2VuZCBhIHJlYWQvcmVjdiBub3RpZmljYXRpb24uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB3aGF0IC0gd2hhdCBub3RpZmljYXRpb24gdG8gc2VuZDogPGNvZGU+cmVjdjwvY29kZT4sIDxjb2RlPnJlYWQ8L2NvZGU+LlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2VxIC0gSUQgb3IgdGhlIG1lc3NhZ2UgcmVhZCBvciByZWNlaXZlZC5cbiAgICovXG4gIG5vdGUod2hhdCwgc2VxKSB7XG4gICAgaWYgKCF0aGlzLl9hdHRhY2hlZCkge1xuICAgICAgLy8gQ2Fubm90IHNlbmRpbmcge25vdGV9IG9uIGFuIGluYWN0aXZlIHRvcGljXCIuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gVXBkYXRlIGxvY2FsIGNhY2hlIHdpdGggdGhlIG5ldyBjb3VudC5cbiAgICBjb25zdCB1c2VyID0gdGhpcy5fdXNlcnNbdGhpcy5fdGlub2RlLmdldEN1cnJlbnRVc2VySUQoKV07XG4gICAgbGV0IHVwZGF0ZSA9IGZhbHNlO1xuICAgIGlmICh1c2VyKSB7XG4gICAgICAvLyBTZWxmLXN1YnNjcmlwdGlvbiBpcyBmb3VuZC5cbiAgICAgIGlmICghdXNlclt3aGF0XSB8fCB1c2VyW3doYXRdIDwgc2VxKSB7XG4gICAgICAgIHVzZXJbd2hhdF0gPSBzZXE7XG4gICAgICAgIHVwZGF0ZSA9IHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFNlbGYtc3Vic2NyaXB0aW9uIGlzIG5vdCBmb3VuZC5cbiAgICAgIHVwZGF0ZSA9ICh0aGlzW3doYXRdIHwgMCkgPCBzZXE7XG4gICAgfVxuXG4gICAgaWYgKHVwZGF0ZSkge1xuICAgICAgLy8gU2VuZCBub3RpZmljYXRpb24gdG8gdGhlIHNlcnZlci5cbiAgICAgIHRoaXMuX3Rpbm9kZS5ub3RlKHRoaXMubmFtZSwgd2hhdCwgc2VxKTtcbiAgICAgIC8vIFVwZGF0ZSBsb2NhbGx5IGNhY2hlZCBjb250YWN0IHdpdGggdGhlIG5ldyBjb3VudC5cbiAgICAgIHRoaXMuX3VwZGF0ZVJlYWRSZWN2KHdoYXQsIHNlcSk7XG5cbiAgICAgIGlmICh0aGlzLmFjcyAhPSBudWxsICYmICF0aGlzLmFjcy5pc011dGVkKCkpIHtcbiAgICAgICAgY29uc3QgbWUgPSB0aGlzLl90aW5vZGUuZ2V0TWVUb3BpYygpO1xuICAgICAgICAvLyBTZW50IGEgbm90aWZpY2F0aW9uIHRvICdtZScgbGlzdGVuZXJzLlxuICAgICAgICBtZS5fcmVmcmVzaENvbnRhY3Qod2hhdCwgdGhpcyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSAncmVjdicgcmVjZWlwdC4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNub3RlUmVjdn0uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXEgLSBJRCBvZiB0aGUgbWVzc2FnZSB0byBha25vd2xlZGdlLlxuICAgKi9cbiAgbm90ZVJlY3Yoc2VxKSB7XG4gICAgdGhpcy5ub3RlKCdyZWN2Jywgc2VxKTtcbiAgfVxuICAvKipcbiAgICogU2VuZCBhICdyZWFkJyByZWNlaXB0LiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI25vdGVSZWFkfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHNlcSAtIElEIG9mIHRoZSBtZXNzYWdlIHRvIGFrbm93bGVkZ2Ugb3IgMC91bmRlZmluZWQgdG8gYWNrbm93bGVkZ2UgdGhlIGxhdGVzdCBtZXNzYWdlcy5cbiAgICovXG4gIG5vdGVSZWFkKHNlcSkge1xuICAgIHNlcSA9IHNlcSB8fCB0aGlzLl9tYXhTZXE7XG4gICAgaWYgKHNlcSA+IDApIHtcbiAgICAgIHRoaXMubm90ZSgncmVhZCcsIHNlcSk7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBTZW5kIGEga2V5LXByZXNzIG5vdGlmaWNhdGlvbi4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNub3RlS2V5UHJlc3N9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKi9cbiAgbm90ZUtleVByZXNzKCkge1xuICAgIGlmICh0aGlzLl9hdHRhY2hlZCkge1xuICAgICAgdGhpcy5fdGlub2RlLm5vdGVLZXlQcmVzcyh0aGlzLm5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl90aW5vZGUubG9nZ2VyKFwiSU5GTzogQ2Fubm90IHNlbmQgbm90aWZpY2F0aW9uIGluIGluYWN0aXZlIHRvcGljXCIpO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICogU2VuZCBhIG5vdGlmaWNhdGlvbiB0aGFuIGEgdmlkZW8gb3IgYXVkaW8gbWVzc2FnZSBpcyAuIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjbm90ZUtleVByZXNzfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICogQHBhcmFtIGF1ZGlvT25seSAtIHRydWUgaWYgdGhlIHJlY29yZGluZyBpcyBhdWRpby1vbmx5LCBmYWxzZSBpZiBpdCdzIGEgdmlkZW8gcmVjb3JkaW5nLlxuICAgKi9cbiAgbm90ZVJlY29yZGluZyhhdWRpb09ubHkpIHtcbiAgICBpZiAodGhpcy5fYXR0YWNoZWQpIHtcbiAgICAgIHRoaXMuX3Rpbm9kZS5ub3RlS2V5UHJlc3ModGhpcy5uYW1lLCBhdWRpb09ubHkgPyAna3BhJyA6ICdrcHYnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdGlub2RlLmxvZ2dlcihcIklORk86IENhbm5vdCBzZW5kIG5vdGlmaWNhdGlvbiBpbiBpbmFjdGl2ZSB0b3BpY1wiKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2VuZCBhIHtub3RlIHdoYXQ9J2NhbGwnfS4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSN2aWRlb0NhbGx9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZ0IC0gQ2FsbCBldmVudC5cbiAgICogQHBhcmFtIHtpbnR9IHNlcSAtIElEIG9mIHRoZSBjYWxsIG1lc3NhZ2UgdGhlIGV2ZW50IHBlcnRhaW5zIHRvLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGF5bG9hZCAtIFBheWxvYWQgYXNzb2NpYXRlZCB3aXRoIHRoaXMgZXZlbnQgKGUuZy4gU0RQIHN0cmluZykuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIChmb3Igc29tZSBjYWxsIGV2ZW50cykgd2hpY2ggd2lsbFxuICAgKiAgICAgICAgICAgICAgICAgICAgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseVxuICAgKi9cbiAgdmlkZW9DYWxsKGV2dCwgc2VxLCBwYXlsb2FkKSB7XG4gICAgaWYgKCF0aGlzLl9hdHRhY2hlZCAmJiAhWydyaW5naW5nJywgJ2hhbmctdXAnXS5pbmNsdWRlcyhldnQpKSB7XG4gICAgICAvLyBDYW5ub3Qge2NhbGx9IG9uIGFuIGluYWN0aXZlIHRvcGljXCIuXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl90aW5vZGUudmlkZW9DYWxsKHRoaXMubmFtZSwgc2VxLCBldnQsIHBheWxvYWQpO1xuICB9XG5cbiAgLy8gVXBkYXRlIGNhY2hlZCByZWFkL3JlY3YvdW5yZWFkIGNvdW50cy5cbiAgX3VwZGF0ZVJlYWRSZWN2KHdoYXQsIHNlcSwgdHMpIHtcbiAgICBsZXQgb2xkVmFsLCBkb1VwZGF0ZSA9IGZhbHNlO1xuXG4gICAgc2VxID0gc2VxIHwgMDtcbiAgICB0aGlzLnNlcSA9IHRoaXMuc2VxIHwgMDtcbiAgICB0aGlzLnJlYWQgPSB0aGlzLnJlYWQgfCAwO1xuICAgIHRoaXMucmVjdiA9IHRoaXMucmVjdiB8IDA7XG4gICAgc3dpdGNoICh3aGF0KSB7XG4gICAgICBjYXNlICdyZWN2JzpcbiAgICAgICAgb2xkVmFsID0gdGhpcy5yZWN2O1xuICAgICAgICB0aGlzLnJlY3YgPSBNYXRoLm1heCh0aGlzLnJlY3YsIHNlcSk7XG4gICAgICAgIGRvVXBkYXRlID0gKG9sZFZhbCAhPSB0aGlzLnJlY3YpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3JlYWQnOlxuICAgICAgICBvbGRWYWwgPSB0aGlzLnJlYWQ7XG4gICAgICAgIHRoaXMucmVhZCA9IE1hdGgubWF4KHRoaXMucmVhZCwgc2VxKTtcbiAgICAgICAgZG9VcGRhdGUgPSAob2xkVmFsICE9IHRoaXMucmVhZCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbXNnJzpcbiAgICAgICAgb2xkVmFsID0gdGhpcy5zZXE7XG4gICAgICAgIHRoaXMuc2VxID0gTWF0aC5tYXgodGhpcy5zZXEsIHNlcSk7XG4gICAgICAgIGlmICghdGhpcy50b3VjaGVkIHx8IHRoaXMudG91Y2hlZCA8IHRzKSB7XG4gICAgICAgICAgdGhpcy50b3VjaGVkID0gdHM7XG4gICAgICAgIH1cbiAgICAgICAgZG9VcGRhdGUgPSAob2xkVmFsICE9IHRoaXMuc2VxKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgLy8gU2FuaXR5IGNoZWNrcy5cbiAgICBpZiAodGhpcy5yZWN2IDwgdGhpcy5yZWFkKSB7XG4gICAgICB0aGlzLnJlY3YgPSB0aGlzLnJlYWQ7XG4gICAgICBkb1VwZGF0ZSA9IHRydWU7XG4gICAgfVxuICAgIGlmICh0aGlzLnNlcSA8IHRoaXMucmVjdikge1xuICAgICAgdGhpcy5zZXEgPSB0aGlzLnJlY3Y7XG4gICAgICBpZiAoIXRoaXMudG91Y2hlZCB8fCB0aGlzLnRvdWNoZWQgPCB0cykge1xuICAgICAgICB0aGlzLnRvdWNoZWQgPSB0cztcbiAgICAgIH1cbiAgICAgIGRvVXBkYXRlID0gdHJ1ZTtcbiAgICB9XG4gICAgdGhpcy51bnJlYWQgPSB0aGlzLnNlcSAtIHRoaXMucmVhZDtcbiAgICByZXR1cm4gZG9VcGRhdGU7XG4gIH1cbiAgLyoqXG4gICAqIEdldCB1c2VyIGRlc2NyaXB0aW9uIGZyb20gZ2xvYmFsIGNhY2hlLiBUaGUgdXNlciBkb2VzIG5vdCBuZWVkIHRvIGJlIGFcbiAgICogc3Vic2NyaWJlciBvZiB0aGlzIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gSUQgb2YgdGhlIHVzZXIgdG8gZmV0Y2guXG4gICAqIEByZXR1cm4ge09iamVjdH0gdXNlciBkZXNjcmlwdGlvbiBvciB1bmRlZmluZWQuXG4gICAqL1xuICB1c2VyRGVzYyh1aWQpIHtcbiAgICAvLyBUT0RPOiBoYW5kbGUgYXN5bmNocm9ub3VzIHJlcXVlc3RzXG4gICAgY29uc3QgdXNlciA9IHRoaXMuX2NhY2hlR2V0VXNlcih1aWQpO1xuICAgIGlmICh1c2VyKSB7XG4gICAgICByZXR1cm4gdXNlcjsgLy8gUHJvbWlzZS5yZXNvbHZlKHVzZXIpXG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBHZXQgZGVzY3JpcHRpb24gb2YgdGhlIHAycCBwZWVyIGZyb20gc3Vic2NyaXB0aW9uIGNhY2hlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJuIHtPYmplY3R9IHBlZXIncyBkZXNjcmlwdGlvbiBvciB1bmRlZmluZWQuXG4gICAqL1xuICBwMnBQZWVyRGVzYygpIHtcbiAgICBpZiAoIXRoaXMuaXNQMlBUeXBlKCkpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl91c2Vyc1t0aGlzLm5hbWVdO1xuICB9XG4gIC8qKlxuICAgKiBJdGVyYXRlIG92ZXIgY2FjaGVkIHN1YnNjcmliZXJzLiBJZiBjYWxsYmFjayBpcyB1bmRlZmluZWQsIHVzZSB0aGlzLm9uTWV0YVN1Yi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSBDYWxsYmFjayB3aGljaCB3aWxsIHJlY2VpdmUgc3Vic2NyaWJlcnMgb25lIGJ5IG9uZS5cbiAgICogQHBhcmFtIHtPYmplY3Q9fSBjb250ZXh0IC0gVmFsdWUgb2YgYHRoaXNgIGluc2lkZSB0aGUgYGNhbGxiYWNrYC5cbiAgICovXG4gIHN1YnNjcmliZXJzKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgY29uc3QgY2IgPSAoY2FsbGJhY2sgfHwgdGhpcy5vbk1ldGFTdWIpO1xuICAgIGlmIChjYikge1xuICAgICAgZm9yIChsZXQgaWR4IGluIHRoaXMuX3VzZXJzKSB7XG4gICAgICAgIGNiLmNhbGwoY29udGV4dCwgdGhpcy5fdXNlcnNbaWR4XSwgaWR4LCB0aGlzLl91c2Vycyk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBHZXQgYSBjb3B5IG9mIGNhY2hlZCB0YWdzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJuIHtBcnJheS48c3RyaW5nPn0gYSBjb3B5IG9mIHRhZ3NcbiAgICovXG4gIHRhZ3MoKSB7XG4gICAgLy8gUmV0dXJuIGEgY29weS5cbiAgICByZXR1cm4gdGhpcy5fdGFncy5zbGljZSgwKTtcbiAgfVxuICAvKipcbiAgICogR2V0IGNhY2hlZCBzdWJzY3JpcHRpb24gZm9yIHRoZSBnaXZlbiB1c2VyIElELlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gaWQgb2YgdGhlIHVzZXIgdG8gcXVlcnkgZm9yXG4gICAqIEByZXR1cm4gdXNlciBkZXNjcmlwdGlvbiBvciB1bmRlZmluZWQuXG4gICAqL1xuICBzdWJzY3JpYmVyKHVpZCkge1xuICAgIHJldHVybiB0aGlzLl91c2Vyc1t1aWRdO1xuICB9XG4gIC8qKlxuICAgKiBJdGVyYXRlIG92ZXIgdmVyc2lvbnMgb2YgYSBtZXNzYWdlOiBjYWxsIDxjb2RlPmNhbGxiYWNrPC9jb2RlPiBmb3IgZWFjaCB2ZXJzaW9uIChleGNsdWRpbmcgb3JpZ2luYWwpLlxuICAgKiBJZiA8Y29kZT5jYWxsYmFjazwvY29kZT4gaXMgdW5kZWZpbmVkLCBkb2VzIG5vdGhpbmcuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBvcmlnU2VxIC0gc2VxIElEIG9mIHRoZSBvcmlnaW5hbCBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5Gb3JFYWNoQ2FsbGJhY2tUeXBlfSBjYWxsYmFjayAtIENhbGxiYWNrIHdoaWNoIHdpbGwgcmVjZWl2ZSBtZXNzYWdlcyBvbmUgYnkgb25lLiBTZWUge0BsaW5rIFRpbm9kZS5DQnVmZmVyI2ZvckVhY2h9XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gVmFsdWUgb2YgYHRoaXNgIGluc2lkZSB0aGUgYGNhbGxiYWNrYC5cbiAgICovXG4gIG1lc3NhZ2VWZXJzaW9ucyhvcmlnU2VxLCBjYWxsYmFjaywgY29udGV4dCkge1xuICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgIC8vIE5vIGNhbGxiYWNrPyBXZSBhcmUgZG9uZSB0aGVuLlxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCB2ZXJzaW9ucyA9IHRoaXMuX21lc3NhZ2VWZXJzaW9uc1tvcmlnU2VxXTtcbiAgICBpZiAoIXZlcnNpb25zKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZlcnNpb25zLmZvckVhY2goY2FsbGJhY2ssIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBjb250ZXh0KTtcbiAgfVxuICAvKipcbiAgICogSXRlcmF0ZSBvdmVyIGNhY2hlZCBtZXNzYWdlczogY2FsbCA8Y29kZT5jYWxsYmFjazwvY29kZT4gZm9yIGVhY2ggbWVzc2FnZSBpbiB0aGUgcmFuZ2UgW3NpbmNlSWR4LCBiZWZvcmVJZHgpLlxuICAgKiBJZiA8Y29kZT5jYWxsYmFjazwvY29kZT4gaXMgdW5kZWZpbmVkLCB1c2UgPGNvZGU+dGhpcy5vbkRhdGE8L2NvZGU+LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5Gb3JFYWNoQ2FsbGJhY2tUeXBlfSBjYWxsYmFjayAtIENhbGxiYWNrIHdoaWNoIHdpbGwgcmVjZWl2ZSBtZXNzYWdlcyBvbmUgYnkgb25lLiBTZWUge0BsaW5rIFRpbm9kZS5DQnVmZmVyI2ZvckVhY2h9XG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzaW5jZUlkIC0gT3B0aW9uYWwgc2VxSWQgdG8gc3RhcnQgaXRlcmF0aW5nIGZyb20gKGluY2x1c2l2ZSkuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBiZWZvcmVJZCAtIE9wdGlvbmFsIHNlcUlkIHRvIHN0b3AgaXRlcmF0aW5nIGJlZm9yZSBpdCBpcyByZWFjaGVkIChleGNsdXNpdmUpLlxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCAtIFZhbHVlIG9mIGB0aGlzYCBpbnNpZGUgdGhlIGBjYWxsYmFja2AuXG4gICAqL1xuICBtZXNzYWdlcyhjYWxsYmFjaywgc2luY2VJZCwgYmVmb3JlSWQsIGNvbnRleHQpIHtcbiAgICBjb25zdCBjYiA9IChjYWxsYmFjayB8fCB0aGlzLm9uRGF0YSk7XG4gICAgaWYgKGNiKSB7XG4gICAgICBjb25zdCBzdGFydElkeCA9IHR5cGVvZiBzaW5jZUlkID09ICdudW1iZXInID8gdGhpcy5fbWVzc2FnZXMuZmluZCh7XG4gICAgICAgIHNlcTogc2luY2VJZFxuICAgICAgfSwgdHJ1ZSkgOiB1bmRlZmluZWQ7XG4gICAgICBjb25zdCBiZWZvcmVJZHggPSB0eXBlb2YgYmVmb3JlSWQgPT0gJ251bWJlcicgPyB0aGlzLl9tZXNzYWdlcy5maW5kKHtcbiAgICAgICAgc2VxOiBiZWZvcmVJZFxuICAgICAgfSwgdHJ1ZSkgOiB1bmRlZmluZWQ7XG4gICAgICBpZiAoc3RhcnRJZHggIT0gLTEgJiYgYmVmb3JlSWR4ICE9IC0xKSB7XG4gICAgICAgIC8vIFN0ZXAgMS4gRmlsdGVyIG91dCBhbGwgcmVwbGFjZW1lbnQgbWVzc2FnZXMgYW5kXG4gICAgICAgIC8vIHNhdmUgZGlzcGxheWFibGUgbWVzc2FnZXMgaW4gYSB0ZW1wb3JhcnkgYnVmZmVyLlxuICAgICAgICBsZXQgbXNncyA9IFtdO1xuICAgICAgICB0aGlzLl9tZXNzYWdlcy5mb3JFYWNoKChtc2csIHVudXNlZDEsIHVudXNlZDIsIGkpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5faXNSZXBsYWNlbWVudE1zZyhtc2cpKSB7XG4gICAgICAgICAgICAvLyBTa2lwIHJlcGxhY2VtZW50cy5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gSW4gY2FzZSB0aGUgbWFzc2FnZSB3YXMgZWRpdGVkLCByZXBsYWNlIHRpbWVzdGFtcCBvZiB0aGUgdmVyc2lvbiB3aXRoIHRoZSBvcmlnaW5hbCdzIHRpbWVzdGFtcC5cbiAgICAgICAgICBjb25zdCBsYXRlc3QgPSB0aGlzLmxhdGVzdE1zZ1ZlcnNpb24obXNnLnNlcSkgfHwgbXNnO1xuICAgICAgICAgIGlmICghbGF0ZXN0Ll9vcmlnVHMpIHtcbiAgICAgICAgICAgIGxhdGVzdC5fb3JpZ1RzID0gbGF0ZXN0LnRzO1xuICAgICAgICAgICAgbGF0ZXN0Ll9vcmlnU2VxID0gbGF0ZXN0LnNlcTtcbiAgICAgICAgICAgIGxhdGVzdC50cyA9IG1zZy50cztcbiAgICAgICAgICAgIGxhdGVzdC5zZXEgPSBtc2cuc2VxO1xuICAgICAgICAgIH1cbiAgICAgICAgICBtc2dzLnB1c2goe1xuICAgICAgICAgICAgZGF0YTogbGF0ZXN0LFxuICAgICAgICAgICAgaWR4OiBpXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sIHN0YXJ0SWR4LCBiZWZvcmVJZHgsIHt9KTtcbiAgICAgICAgLy8gU3RlcCAyLiBMb29wIG92ZXIgZGlzcGxheWJsZSBtZXNzYWdlcyBpbnZva2luZyBjYiBvbiBlYWNoIG9mIHRoZW0uXG4gICAgICAgIG1zZ3MuZm9yRWFjaCgodmFsLCBpKSA9PiB7XG4gICAgICAgICAgY2IuY2FsbChjb250ZXh0LCB2YWwuZGF0YSxcbiAgICAgICAgICAgIChpID4gMCA/IG1zZ3NbaSAtIDFdLmRhdGEgOiB1bmRlZmluZWQpLFxuICAgICAgICAgICAgKGkgPCBtc2dzLmxlbmd0aCAtIDEgPyBtc2dzW2kgKyAxXS5kYXRhIDogdW5kZWZpbmVkKSwgdmFsLmlkeCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICAvKipcbiAgICogR2V0IHRoZSBtZXNzYWdlIGZyb20gY2FjaGUgYnkgPGNvZGU+c2VxPC9jb2RlPi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHNlcSAtIG1lc3NhZ2Ugc2VxSWQgdG8gc2VhcmNoIGZvci5cbiAgICogQHJldHVybnMge09iamVjdH0gdGhlIG1lc3NhZ2Ugd2l0aCB0aGUgZ2l2ZW4gPGNvZGU+c2VxPC9jb2RlPiBvciA8Y29kZT51bmRlZmluZWQ8L2NvZGU+LCBpZiBubyBzdWNoIG1lc3NhZ2UgaXMgZm91bmQuXG4gICAqL1xuICBmaW5kTWVzc2FnZShzZXEpIHtcbiAgICBjb25zdCBpZHggPSB0aGlzLl9tZXNzYWdlcy5maW5kKHtcbiAgICAgIHNlcTogc2VxXG4gICAgfSk7XG4gICAgaWYgKGlkeCA+PSAwKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbWVzc2FnZXMuZ2V0QXQoaWR4KTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICAvKipcbiAgICogR2V0IHRoZSBtb3N0IHJlY2VudCBtZXNzYWdlIGZyb20gY2FjaGUuIFRoaXMgbWV0aG9kIGNvdW50cyBhbGwgbWVzc2FnZXMsIGluY2x1ZGluZyBkZWxldGVkIHJhbmdlcy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHJldHVybnMge09iamVjdH0gdGhlIG1vc3QgcmVjZW50IGNhY2hlZCBtZXNzYWdlIG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4sIGlmIG5vIG1lc3NhZ2VzIGFyZSBjYWNoZWQuXG4gICAqL1xuICBsYXRlc3RNZXNzYWdlKCkge1xuICAgIHJldHVybiB0aGlzLl9tZXNzYWdlcy5nZXRMYXN0KCk7XG4gIH1cbiAgLyoqXG4gICAqIEdldCB0aGUgbGF0ZXN0IHZlcnNpb24gZm9yIG1lc3NhZ2UuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXEgLSBvcmlnaW5hbCBzZXEgSUQgb2YgdGhlIG1lc3NhZ2UuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IHRoZSBsYXRlc3QgdmVyc2lvbiBvZiB0aGUgbWVzc2FnZSBvciBudWxsIGlmIG1lc3NhZ2Ugbm90IGZvdW5kLlxuICAgKi9cbiAgbGF0ZXN0TXNnVmVyc2lvbihzZXEpIHtcbiAgICBjb25zdCB2ZXJzaW9ucyA9IHRoaXMuX21lc3NhZ2VWZXJzaW9uc1tzZXFdO1xuICAgIHJldHVybiB2ZXJzaW9ucyA/IHZlcnNpb25zLmdldExhc3QoKSA6IG51bGw7XG4gIH1cbiAgLyoqXG4gICAqIEdldCB0aGUgbWF4aW11bSBjYWNoZWQgc2VxIElELlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSB0aGUgZ3JlYXRlc3Qgc2VxIElEIGluIGNhY2hlLlxuICAgKi9cbiAgbWF4TXNnU2VxKCkge1xuICAgIHJldHVybiB0aGlzLl9tYXhTZXE7XG4gIH1cbiAgLyoqXG4gICAqIEdldCB0aGUgbWF4aW11bSBkZWxldGlvbiBJRC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHJldHVybnMge251bWJlcn0gdGhlIGdyZWF0ZXN0IGRlbGV0aW9uIElELlxuICAgKi9cbiAgbWF4Q2xlYXJJZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fbWF4RGVsO1xuICB9XG4gIC8qKlxuICAgKiBHZXQgdGhlIG51bWJlciBvZiBtZXNzYWdlcyBpbiB0aGUgY2FjaGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IGNvdW50IG9mIGNhY2hlZCBtZXNzYWdlcy5cbiAgICovXG4gIG1lc3NhZ2VDb3VudCgpIHtcbiAgICByZXR1cm4gdGhpcy5fbWVzc2FnZXMubGVuZ3RoKCk7XG4gIH1cbiAgLyoqXG4gICAqIEl0ZXJhdGUgb3ZlciBjYWNoZWQgdW5zZW50IG1lc3NhZ2VzLiBXcmFwcyB7QGxpbmsgVGlub2RlLlRvcGljI21lc3NhZ2VzfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSBDYWxsYmFjayB3aGljaCB3aWxsIHJlY2VpdmUgbWVzc2FnZXMgb25lIGJ5IG9uZS4gU2VlIHtAbGluayBUaW5vZGUuQ0J1ZmZlciNmb3JFYWNofVxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCAtIFZhbHVlIG9mIDxjb2RlPnRoaXM8L2NvZGU+IGluc2lkZSB0aGUgPGNvZGU+Y2FsbGJhY2s8L2NvZGU+LlxuICAgKi9cbiAgcXVldWVkTWVzc2FnZXMoY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYWxsYmFjayBtdXN0IGJlIHByb3ZpZGVkXCIpO1xuICAgIH1cbiAgICB0aGlzLm1lc3NhZ2VzKGNhbGxiYWNrLCBDb25zdC5MT0NBTF9TRVFJRCwgdW5kZWZpbmVkLCBjb250ZXh0KTtcbiAgfVxuICAvKipcbiAgICogR2V0IHRoZSBudW1iZXIgb2YgdG9waWMgc3Vic2NyaWJlcnMgd2hvIG1hcmtlZCB0aGlzIG1lc3NhZ2UgYXMgZWl0aGVyIHJlY3Ygb3IgcmVhZFxuICAgKiBDdXJyZW50IHVzZXIgaXMgZXhjbHVkZWQgZnJvbSB0aGUgY291bnQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB3aGF0IC0gd2hhdCBhY3Rpb24gdG8gY29uc2lkZXI6IHJlY2VpdmVkIDxjb2RlPlwicmVjdlwiPC9jb2RlPiBvciByZWFkIDxjb2RlPlwicmVhZFwiPC9jb2RlPi5cbiAgICogQHBhcmFtIHtudW1iZXJ9IHNlcSAtIElEIG9yIHRoZSBtZXNzYWdlIHJlYWQgb3IgcmVjZWl2ZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IHRoZSBudW1iZXIgb2Ygc3Vic2NyaWJlcnMgd2hvIG1hcmtlZCB0aGUgbWVzc2FnZSB3aXRoIHRoZSBnaXZlbiBJRCBhcyByZWFkIG9yIHJlY2VpdmVkLlxuICAgKi9cbiAgbXNnUmVjZWlwdENvdW50KHdoYXQsIHNlcSkge1xuICAgIGxldCBjb3VudCA9IDA7XG4gICAgaWYgKHNlcSA+IDApIHtcbiAgICAgIGNvbnN0IG1lID0gdGhpcy5fdGlub2RlLmdldEN1cnJlbnRVc2VySUQoKTtcbiAgICAgIGZvciAobGV0IGlkeCBpbiB0aGlzLl91c2Vycykge1xuICAgICAgICBjb25zdCB1c2VyID0gdGhpcy5fdXNlcnNbaWR4XTtcbiAgICAgICAgaWYgKHVzZXIudXNlciAhPT0gbWUgJiYgdXNlclt3aGF0XSA+PSBzZXEpIHtcbiAgICAgICAgICBjb3VudCsrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb3VudDtcbiAgfVxuICAvKipcbiAgICogR2V0IHRoZSBudW1iZXIgb2YgdG9waWMgc3Vic2NyaWJlcnMgd2hvIG1hcmtlZCB0aGlzIG1lc3NhZ2UgKGFuZCBhbGwgb2xkZXIgbWVzc2FnZXMpIGFzIHJlYWQuXG4gICAqIFRoZSBjdXJyZW50IHVzZXIgaXMgZXhjbHVkZWQgZnJvbSB0aGUgY291bnQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXEgLSBtZXNzYWdlIGlkIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBudW1iZXIgb2Ygc3Vic2NyaWJlcnMgd2hvIGNsYWltIHRvIGhhdmUgcmVjZWl2ZWQgdGhlIG1lc3NhZ2UuXG4gICAqL1xuICBtc2dSZWFkQ291bnQoc2VxKSB7XG4gICAgcmV0dXJuIHRoaXMubXNnUmVjZWlwdENvdW50KCdyZWFkJywgc2VxKTtcbiAgfVxuICAvKipcbiAgICogR2V0IHRoZSBudW1iZXIgb2YgdG9waWMgc3Vic2NyaWJlcnMgd2hvIG1hcmtlZCB0aGlzIG1lc3NhZ2UgKGFuZCBhbGwgb2xkZXIgbWVzc2FnZXMpIGFzIHJlY2VpdmVkLlxuICAgKiBUaGUgY3VycmVudCB1c2VyIGlzIGV4Y2x1ZGVkIGZyb20gdGhlIGNvdW50LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2VxIC0gTWVzc2FnZSBpZCB0byBjaGVjay5cbiAgICogQHJldHVybnMge251bWJlcn0gTnVtYmVyIG9mIHN1YnNjcmliZXJzIHdobyBjbGFpbSB0byBoYXZlIHJlY2VpdmVkIHRoZSBtZXNzYWdlLlxuICAgKi9cbiAgbXNnUmVjdkNvdW50KHNlcSkge1xuICAgIHJldHVybiB0aGlzLm1zZ1JlY2VpcHRDb3VudCgncmVjdicsIHNlcSk7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIGlmIGNhY2hlZCBtZXNzYWdlIElEcyBpbmRpY2F0ZSB0aGF0IHRoZSBzZXJ2ZXIgbWF5IGhhdmUgbW9yZSBtZXNzYWdlcy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBuZXdlciAtIGlmIDxjb2RlPnRydWU8L2NvZGU+LCBjaGVjayBmb3IgbmV3ZXIgbWVzc2FnZXMgb25seS5cbiAgICovXG4gIG1zZ0hhc01vcmVNZXNzYWdlcyhuZXdlcikge1xuICAgIHJldHVybiBuZXdlciA/IHRoaXMuc2VxID4gdGhpcy5fbWF4U2VxIDpcbiAgICAgIC8vIF9taW5TZXEgY291bGQgYmUgbW9yZSB0aGFuIDEsIGJ1dCBlYXJsaWVyIG1lc3NhZ2VzIGNvdWxkIGhhdmUgYmVlbiBkZWxldGVkLlxuICAgICAgKHRoaXMuX21pblNlcSA+IDEgJiYgIXRoaXMuX25vRWFybGllck1zZ3MpO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgZ2l2ZW4gc2VxIElkIGlzIGlkIG9mIHRoZSBtb3N0IHJlY2VudCBtZXNzYWdlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2VxSWQgaWQgb2YgdGhlIG1lc3NhZ2UgdG8gY2hlY2tcbiAgICovXG4gIGlzTmV3TWVzc2FnZShzZXFJZCkge1xuICAgIHJldHVybiB0aGlzLl9tYXhTZXEgPD0gc2VxSWQ7XG4gIH1cbiAgLyoqXG4gICAqIFJlbW92ZSBvbmUgbWVzc2FnZSBmcm9tIGxvY2FsIGNhY2hlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2VxSWQgaWQgb2YgdGhlIG1lc3NhZ2UgdG8gcmVtb3ZlIGZyb20gY2FjaGUuXG4gICAqIEByZXR1cm5zIHtNZXNzYWdlfSByZW1vdmVkIG1lc3NhZ2Ugb3IgdW5kZWZpbmVkIGlmIHN1Y2ggbWVzc2FnZSB3YXMgbm90IGZvdW5kLlxuICAgKi9cbiAgZmx1c2hNZXNzYWdlKHNlcUlkKSB7XG4gICAgY29uc3QgaWR4ID0gdGhpcy5fbWVzc2FnZXMuZmluZCh7XG4gICAgICBzZXE6IHNlcUlkXG4gICAgfSk7XG4gICAgZGVsZXRlIHRoaXMuX21lc3NhZ2VWZXJzaW9uc1tzZXFJZF07XG4gICAgaWYgKGlkeCA+PSAwKSB7XG4gICAgICB0aGlzLl90aW5vZGUuX2RiLnJlbU1lc3NhZ2VzKHRoaXMubmFtZSwgc2VxSWQpO1xuICAgICAgcmV0dXJuIHRoaXMuX21lc3NhZ2VzLmRlbEF0KGlkeCk7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgLyoqXG4gICAqIFJlbW92ZSBhIHJhbmdlIG9mIG1lc3NhZ2VzIGZyb20gdGhlIGxvY2FsIGNhY2hlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gZnJvbUlkIHNlcSBJRCBvZiB0aGUgZmlyc3QgbWVzc2FnZSB0byByZW1vdmUgKGluY2x1c2l2ZSkuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB1bnRpbElkIHNlcUlEIG9mIHRoZSBsYXN0IG1lc3NhZ2UgdG8gcmVtb3ZlIChleGNsdXNpdmUpLlxuICAgKlxuICAgKiBAcmV0dXJucyB7TWVzc2FnZVtdfSBhcnJheSBvZiByZW1vdmVkIG1lc3NhZ2VzIChjb3VsZCBiZSBlbXB0eSkuXG4gICAqL1xuICBmbHVzaE1lc3NhZ2VSYW5nZShmcm9tSWQsIHVudGlsSWQpIHtcbiAgICAvLyBSZW1vdmUgcmFuZ2UgZnJvbSBwZXJzaXN0ZW50IGNhY2hlLlxuICAgIHRoaXMuX3Rpbm9kZS5fZGIucmVtTWVzc2FnZXModGhpcy5uYW1lLCBmcm9tSWQsIHVudGlsSWQpO1xuXG4gICAgLy8gUmVtb3ZlIGFsbCB2ZXJzaW9ucyBrZXllZCBieSBJRHMgaW4gdGhlIHJhbmdlLlxuICAgIGZvciAobGV0IGkgPSBmcm9tSWQ7IGkgPCB1bnRpbElkOyBpKyspIHtcbiAgICAgIGRlbGV0ZSB0aGlzLl9tZXNzYWdlVmVyc2lvbnNbaV07XG4gICAgfVxuXG4gICAgLy8gc3RhcnQsIGVuZDogZmluZCBpbnNlcnRpb24gcG9pbnRzIChuZWFyZXN0ID09IHRydWUpLlxuICAgIGNvbnN0IHNpbmNlID0gdGhpcy5fbWVzc2FnZXMuZmluZCh7XG4gICAgICBzZXE6IGZyb21JZFxuICAgIH0sIHRydWUpO1xuICAgIHJldHVybiBzaW5jZSA+PSAwID8gdGhpcy5fbWVzc2FnZXMuZGVsUmFuZ2Uoc2luY2UsIHRoaXMuX21lc3NhZ2VzLmZpbmQoe1xuICAgICAgc2VxOiB1bnRpbElkXG4gICAgfSwgdHJ1ZSkpIDogW107XG4gIH1cbiAgLyoqXG4gICAqIFVwZGF0ZSBtZXNzYWdlJ3Mgc2VxSWQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwdWIgbWVzc2FnZSBvYmplY3QuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBuZXdTZXFJZCBuZXcgc2VxIGlkIGZvciBwdWIuXG4gICAqL1xuICBzd2FwTWVzc2FnZUlkKHB1YiwgbmV3U2VxSWQpIHtcbiAgICBjb25zdCBpZHggPSB0aGlzLl9tZXNzYWdlcy5maW5kKHB1Yik7XG4gICAgY29uc3QgbnVtTWVzc2FnZXMgPSB0aGlzLl9tZXNzYWdlcy5sZW5ndGgoKTtcbiAgICBpZiAoMCA8PSBpZHggJiYgaWR4IDwgbnVtTWVzc2FnZXMpIHtcbiAgICAgIC8vIFJlbW92ZSBtZXNzYWdlIHdpdGggdGhlIG9sZCBzZXEgSUQuXG4gICAgICB0aGlzLl9tZXNzYWdlcy5kZWxBdChpZHgpO1xuICAgICAgdGhpcy5fdGlub2RlLl9kYi5yZW1NZXNzYWdlcyh0aGlzLm5hbWUsIHB1Yi5zZXEpO1xuICAgICAgLy8gQWRkIG1lc3NhZ2Ugd2l0aCB0aGUgbmV3IHNlcSBJRC5cbiAgICAgIHB1Yi5zZXEgPSBuZXdTZXFJZDtcbiAgICAgIHRoaXMuX21lc3NhZ2VzLnB1dChwdWIpO1xuICAgICAgdGhpcy5fdGlub2RlLl9kYi5hZGRNZXNzYWdlKHB1Yik7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBBdHRlbXB0IHRvIHN0b3AgbWVzc2FnZSBmcm9tIGJlaW5nIHNlbnQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXFJZCBpZCBvZiB0aGUgbWVzc2FnZSB0byBzdG9wIHNlbmRpbmcgYW5kIHJlbW92ZSBmcm9tIGNhY2hlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgbWVzc2FnZSB3YXMgY2FuY2VsbGVkLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgY2FuY2VsU2VuZChzZXFJZCkge1xuICAgIGNvbnN0IGlkeCA9IHRoaXMuX21lc3NhZ2VzLmZpbmQoe1xuICAgICAgc2VxOiBzZXFJZFxuICAgIH0pO1xuICAgIGlmIChpZHggPj0gMCkge1xuICAgICAgY29uc3QgbXNnID0gdGhpcy5fbWVzc2FnZXMuZ2V0QXQoaWR4KTtcbiAgICAgIGNvbnN0IHN0YXR1cyA9IHRoaXMubXNnU3RhdHVzKG1zZyk7XG4gICAgICBpZiAoc3RhdHVzID09IENvbnN0Lk1FU1NBR0VfU1RBVFVTX1FVRVVFRCB8fCBzdGF0dXMgPT0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfRkFJTEVEKSB7XG4gICAgICAgIHRoaXMuX3Rpbm9kZS5fZGIucmVtTWVzc2FnZXModGhpcy5uYW1lLCBzZXFJZCk7XG4gICAgICAgIG1zZy5fY2FuY2VsbGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fbWVzc2FnZXMuZGVsQXQoaWR4KTtcbiAgICAgICAgaWYgKHRoaXMub25EYXRhKSB7XG4gICAgICAgICAgLy8gQ2FsbGluZyB3aXRoIG5vIHBhcmFtZXRlcnMgdG8gaW5kaWNhdGUgdGhlIG1lc3NhZ2Ugd2FzIGRlbGV0ZWQuXG4gICAgICAgICAgdGhpcy5vbkRhdGEoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8qKlxuICAgKiBHZXQgdHlwZSBvZiB0aGUgdG9waWM6IG1lLCBwMnAsIGdycCwgZm5kLi4uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IE9uZSBvZiAnbWUnLCAncDJwJywgJ2dycCcsICdmbmQnLCAnc3lzJyBvciA8Y29kZT51bmRlZmluZWQ8L2NvZGU+LlxuICAgKi9cbiAgZ2V0VHlwZSgpIHtcbiAgICByZXR1cm4gVG9waWMudG9waWNUeXBlKHRoaXMubmFtZSk7XG4gIH1cbiAgLyoqXG4gICAqIEdldCBjdXJyZW50IHVzZXIncyBhY2Nlc3MgbW9kZSBvZiB0aGUgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuQWNjZXNzTW9kZX0gLSB1c2VyJ3MgYWNjZXNzIG1vZGVcbiAgICovXG4gIGdldEFjY2Vzc01vZGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWNzO1xuICB9XG4gIC8qKlxuICAgKiBTZXQgY3VycmVudCB1c2VyJ3MgYWNjZXNzIG1vZGUgb2YgdGhlIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge0FjY2Vzc01vZGUgfCBPYmplY3R9IGFjcyAtIGFjY2VzcyBtb2RlIHRvIHNldC5cbiAgICovXG4gIHNldEFjY2Vzc01vZGUoYWNzKSB7XG4gICAgcmV0dXJuIHRoaXMuYWNzID0gbmV3IEFjY2Vzc01vZGUoYWNzKTtcbiAgfVxuICAvKipcbiAgICogR2V0IHRvcGljJ3MgZGVmYXVsdCBhY2Nlc3MgbW9kZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5EZWZBY3N9IC0gYWNjZXNzIG1vZGUsIHN1Y2ggYXMge2F1dGg6IGBSV1BgLCBhbm9uOiBgTmB9LlxuICAgKi9cbiAgZ2V0RGVmYXVsdEFjY2VzcygpIHtcbiAgICByZXR1cm4gdGhpcy5kZWZhY3M7XG4gIH1cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgbmV3IG1ldGEge0BsaW5rIFRpbm9kZS5HZXRRdWVyeX0gYnVpbGRlci4gVGhlIHF1ZXJ5IGlzIGF0dGNoZWQgdG8gdGhlIGN1cnJlbnQgdG9waWMuXG4gICAqIEl0IHdpbGwgbm90IHdvcmsgY29ycmVjdGx5IGlmIHVzZWQgd2l0aCBhIGRpZmZlcmVudCB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gcXVlcnkgYXR0YWNoZWQgdG8gdGhlIGN1cnJlbnQgdG9waWMuXG4gICAqL1xuICBzdGFydE1ldGFRdWVyeSgpIHtcbiAgICByZXR1cm4gbmV3IE1ldGFHZXRCdWlsZGVyKHRoaXMpO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0b3BpYyBpcyBhcmNoaXZlZCwgaS5lLiBwcml2YXRlLmFyY2ggPT0gdHJ1ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdG9waWMgaXMgYXJjaGl2ZWQsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBpc0FyY2hpdmVkKCkge1xuICAgIHJldHVybiB0aGlzLnByaXZhdGUgJiYgISF0aGlzLnByaXZhdGUuYXJjaDtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgdG9waWMgaXMgYSAnbWUnIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0b3BpYyBpcyBhICdtZScgdG9waWMsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBpc01lVHlwZSgpIHtcbiAgICByZXR1cm4gVG9waWMuaXNNZVRvcGljTmFtZSh0aGlzLm5hbWUpO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0b3BpYyBpcyBhIGNoYW5uZWwuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIHRvcGljIGlzIGEgY2hhbm5lbCwgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIGlzQ2hhbm5lbFR5cGUoKSB7XG4gICAgcmV0dXJuIFRvcGljLmlzQ2hhbm5lbFRvcGljTmFtZSh0aGlzLm5hbWUpO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0b3BpYyBpcyBhIGdyb3VwIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0b3BpYyBpcyBhIGdyb3VwLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNHcm91cFR5cGUoKSB7XG4gICAgcmV0dXJuIFRvcGljLmlzR3JvdXBUb3BpY05hbWUodGhpcy5uYW1lKTtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgdG9waWMgaXMgYSBwMnAgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIHRvcGljIGlzIGEgcDJwIHRvcGljLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNQMlBUeXBlKCkge1xuICAgIHJldHVybiBUb3BpYy5pc1AyUFRvcGljTmFtZSh0aGlzLm5hbWUpO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0b3BpYyBpcyBhIGNvbW11bmljYXRpb24gdG9waWMsIGkuZS4gYSBncm91cCBvciBwMnAgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIHRvcGljIGlzIGEgcDJwIG9yIGdyb3VwIHRvcGljLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNDb21tVHlwZSgpIHtcbiAgICByZXR1cm4gVG9waWMuaXNDb21tVG9waWNOYW1lKHRoaXMubmFtZSk7XG4gIH1cbiAgLyoqXG4gICAqIEdldCBzdGF0dXMgKHF1ZXVlZCwgc2VudCwgcmVjZWl2ZWQgZXRjKSBvZiBhIGdpdmVuIG1lc3NhZ2UgaW4gdGhlIGNvbnRleHRcbiAgICogb2YgdGhpcyB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtNZXNzYWdlfSBtc2cgLSBtZXNzYWdlIHRvIGNoZWNrIGZvciBzdGF0dXMuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gdXBkIC0gdXBkYXRlIGNoYWNoZWQgbWVzc2FnZSBzdGF0dXMuXG4gICAqXG4gICAqIEByZXR1cm5zIG1lc3NhZ2Ugc3RhdHVzIGNvbnN0YW50LlxuICAgKi9cbiAgbXNnU3RhdHVzKG1zZywgdXBkKSB7XG4gICAgbGV0IHN0YXR1cyA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX05PTkU7XG4gICAgaWYgKHRoaXMuX3Rpbm9kZS5pc01lKG1zZy5mcm9tKSkge1xuICAgICAgaWYgKG1zZy5fc2VuZGluZykge1xuICAgICAgICBzdGF0dXMgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19TRU5ESU5HO1xuICAgICAgfSBlbHNlIGlmIChtc2cuX2ZhaWxlZCB8fCBtc2cuX2NhbmNlbGxlZCkge1xuICAgICAgICBzdGF0dXMgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19GQUlMRUQ7XG4gICAgICB9IGVsc2UgaWYgKG1zZy5zZXEgPj0gQ29uc3QuTE9DQUxfU0VRSUQpIHtcbiAgICAgICAgc3RhdHVzID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfUVVFVUVEO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLm1zZ1JlYWRDb3VudChtc2cuc2VxKSA+IDApIHtcbiAgICAgICAgc3RhdHVzID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfUkVBRDtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5tc2dSZWN2Q291bnQobXNnLnNlcSkgPiAwKSB7XG4gICAgICAgIHN0YXR1cyA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX1JFQ0VJVkVEO1xuICAgICAgfSBlbHNlIGlmIChtc2cuc2VxID4gMCkge1xuICAgICAgICBzdGF0dXMgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19TRU5UO1xuICAgICAgfVxuICAgICAgLy8gfSBlbHNlIGlmIChtc2cuX3N0YXR1cyA9PSBDb25zdC5NRVNTQUdFX1NUQVRVU19ERUxfUkFOR0UpIHtcbiAgICAgIC8vICAgc3RhdHVzID09IENvbnN0Lk1FU1NBR0VfU1RBVFVTX0RFTF9SQU5HRTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhdHVzID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfVE9fTUU7XG4gICAgfVxuXG4gICAgaWYgKHVwZCAmJiBtc2cuX3N0YXR1cyAhPSBzdGF0dXMpIHtcbiAgICAgIG1zZy5fc3RhdHVzID0gc3RhdHVzO1xuICAgICAgdGhpcy5fdGlub2RlLl9kYi51cGRNZXNzYWdlU3RhdHVzKHRoaXMubmFtZSwgbXNnLnNlcSwgc3RhdHVzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3RhdHVzO1xuICB9XG5cbiAgLy8gUmV0dXJucyB0cnVlIGlmIHB1YiBpcyBtZWFudCB0byByZXBsYWNlIGFub3RoZXIgbWVzc2FnZSAoZS5nLiBvcmlnaW5hbCBtZXNzYWdlIHdhcyBlZGl0ZWQpLlxuICBfaXNSZXBsYWNlbWVudE1zZyhwdWIpIHtcbiAgICByZXR1cm4gcHViLmhlYWQgJiYgcHViLmhlYWQucmVwbGFjZTtcbiAgfVxuXG4gIC8vIElmIG1zZyBpcyBhIHJlcGxhY2VtZW50IGZvciBhbm90aGVyIG1lc3NhZ2UsIHNhdmUgdGhlIG1zZyBpbiB0aGUgbWVzc2FnZSB2ZXJzaW9ucyBjYWNoZVxuICAvLyBhcyBhIG5ld2VyIHZlcnNpb24gZm9yIHRoZSBtZXNzYWdlIGl0J3Mgc3VwcG9zZWQgdG8gcmVwbGFjZS5cbiAgX21heWJlVXBkYXRlTWVzc2FnZVZlcnNpb25zQ2FjaGUobXNnKSB7XG4gICAgaWYgKCF0aGlzLl9pc1JlcGxhY2VtZW50TXNnKG1zZykpIHtcbiAgICAgIC8vIENoZWNrIGlmIHRoaXMgbWVzc2FnZSBpcyB0aGUgb3JpZ2luYWwgaW4gdGhlIGNoYWluIG9mIGVkaXRzIGFuZCBpZiBzb1xuICAgICAgLy8gZW5zdXJlIGFsbCB2ZXJzaW9uIGhhdmUgdGhlIHNhbWUgc2VuZGVyLlxuICAgICAgaWYgKHRoaXMuX21lc3NhZ2VWZXJzaW9uc1ttc2cuc2VxXSkge1xuICAgICAgICAvLyBSZW1vdmUgdmVyc2lvbnMgd2l0aCBkaWZmZXJlbnQgJ2Zyb20nLlxuICAgICAgICB0aGlzLl9tZXNzYWdlVmVyc2lvbnNbbXNnLnNlcV0uZmlsdGVyKHZlcnNpb24gPT4gdmVyc2lvbi5mcm9tID09IG1zZy5mcm9tKTtcbiAgICAgICAgaWYgKHRoaXMuX21lc3NhZ2VWZXJzaW9uc1ttc2cuc2VxXS5pc0VtcHR5KCkpIHtcbiAgICAgICAgICBkZWxldGUgdGhpcy5fbWVzc2FnZVZlcnNpb25zW21zZy5zZXFdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgdGFyZ2V0U2VxID0gcGFyc2VJbnQobXNnLmhlYWQucmVwbGFjZS5zcGxpdCgnOicpWzFdKTtcbiAgICBpZiAodGFyZ2V0U2VxID4gbXNnLnNlcSkge1xuICAgICAgLy8gU3Vic3RpdHV0ZXMgYXJlIHN1cHBvc2VkIHRvIGhhdmUgaGlnaGVyIHNlcSBpZHMuXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHRhcmdldE1zZyA9IHRoaXMuZmluZE1lc3NhZ2UodGFyZ2V0U2VxKTtcbiAgICBpZiAodGFyZ2V0TXNnICYmIHRhcmdldE1zZy5mcm9tICE9IG1zZy5mcm9tKSB7XG4gICAgICAvLyBTdWJzdGl0dXRlIGNhbm5vdCBjaGFuZ2UgdGhlIHNlbmRlci5cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgdmVyc2lvbnMgPSB0aGlzLl9tZXNzYWdlVmVyc2lvbnNbdGFyZ2V0U2VxXSB8fCBuZXcgQ0J1ZmZlcigoYSwgYikgPT4ge1xuICAgICAgcmV0dXJuIGEuc2VxIC0gYi5zZXE7XG4gICAgfSwgdHJ1ZSk7XG4gICAgdmVyc2lvbnMucHV0KG1zZyk7XG4gICAgdGhpcy5fbWVzc2FnZVZlcnNpb25zW3RhcmdldFNlcV0gPSB2ZXJzaW9ucztcbiAgfVxuXG4gIC8vIFByb2Nlc3MgZGF0YSBtZXNzYWdlXG4gIF9yb3V0ZURhdGEoZGF0YSkge1xuICAgIGlmIChkYXRhLmNvbnRlbnQpIHtcbiAgICAgIGlmICghdGhpcy50b3VjaGVkIHx8IHRoaXMudG91Y2hlZCA8IGRhdGEudHMpIHtcbiAgICAgICAgdGhpcy50b3VjaGVkID0gZGF0YS50cztcbiAgICAgICAgdGhpcy5fdGlub2RlLl9kYi51cGRUb3BpYyh0aGlzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZGF0YS5zZXEgPiB0aGlzLl9tYXhTZXEpIHtcbiAgICAgIHRoaXMuX21heFNlcSA9IGRhdGEuc2VxO1xuICAgICAgdGhpcy5tc2dTdGF0dXMoZGF0YSwgdHJ1ZSk7XG4gICAgICAvLyBBY2tuIHJlY2VpdmluZyB0aGUgbWVzc2FnZS5cbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9yZWN2Tm90aWZpY2F0aW9uVGltZXIpO1xuICAgICAgdGhpcy5fcmVjdk5vdGlmaWNhdGlvblRpbWVyID0gc2V0VGltZW91dChfID0+IHtcbiAgICAgICAgdGhpcy5fcmVjdk5vdGlmaWNhdGlvblRpbWVyID0gbnVsbDtcbiAgICAgICAgdGhpcy5ub3RlUmVjdih0aGlzLl9tYXhTZXEpO1xuICAgICAgfSwgQ29uc3QuUkVDVl9USU1FT1VUKTtcbiAgICB9XG5cbiAgICBpZiAoZGF0YS5zZXEgPCB0aGlzLl9taW5TZXEgfHwgdGhpcy5fbWluU2VxID09IDApIHtcbiAgICAgIHRoaXMuX21pblNlcSA9IGRhdGEuc2VxO1xuICAgIH1cblxuICAgIGNvbnN0IG91dGdvaW5nID0gKCghdGhpcy5pc0NoYW5uZWxUeXBlKCkgJiYgIWRhdGEuZnJvbSkgfHwgdGhpcy5fdGlub2RlLmlzTWUoZGF0YS5mcm9tKSk7XG5cbiAgICBpZiAoZGF0YS5oZWFkICYmIGRhdGEuaGVhZC53ZWJydGMgJiYgZGF0YS5oZWFkLm1pbWUgPT0gRHJhZnR5LmdldENvbnRlbnRUeXBlKCkgJiYgZGF0YS5jb250ZW50KSB7XG4gICAgICAvLyBSZXdyaXRlIFZDIGJvZHkgd2l0aCBpbmZvIGZyb20gdGhlIGhlYWRlcnMuXG4gICAgICBkYXRhLmNvbnRlbnQgPSBEcmFmdHkudXBkYXRlVmlkZW9DYWxsKGRhdGEuY29udGVudCwge1xuICAgICAgICBzdGF0ZTogZGF0YS5oZWFkLndlYnJ0YyxcbiAgICAgICAgZHVyYXRpb246IGRhdGEuaGVhZFsnd2VicnRjLWR1cmF0aW9uJ10sXG4gICAgICAgIGluY29taW5nOiAhb3V0Z29pbmcsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoIWRhdGEuX25vRm9yd2FyZGluZykge1xuICAgICAgdGhpcy5fbWVzc2FnZXMucHV0KGRhdGEpO1xuICAgICAgdGhpcy5fdGlub2RlLl9kYi5hZGRNZXNzYWdlKGRhdGEpO1xuICAgICAgdGhpcy5fbWF5YmVVcGRhdGVNZXNzYWdlVmVyc2lvbnNDYWNoZShkYXRhKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vbkRhdGEpIHtcbiAgICAgIHRoaXMub25EYXRhKGRhdGEpO1xuICAgIH1cblxuICAgIC8vIFVwZGF0ZSBsb2NhbGx5IGNhY2hlZCBjb250YWN0IHdpdGggdGhlIG5ldyBtZXNzYWdlIGNvdW50LlxuICAgIGNvbnN0IHdoYXQgPSBvdXRnb2luZyA/ICdyZWFkJyA6ICdtc2cnO1xuICAgIHRoaXMuX3VwZGF0ZVJlYWRSZWN2KHdoYXQsIGRhdGEuc2VxLCBkYXRhLnRzKTtcbiAgICAvLyBOb3RpZnkgJ21lJyBsaXN0ZW5lcnMgb2YgdGhlIGNoYW5nZS5cbiAgICB0aGlzLl90aW5vZGUuZ2V0TWVUb3BpYygpLl9yZWZyZXNoQ29udGFjdCh3aGF0LCB0aGlzKTtcbiAgfVxuXG4gIC8vIFByb2Nlc3MgbWV0YWRhdGEgbWVzc2FnZVxuICBfcm91dGVNZXRhKG1ldGEpIHtcbiAgICBpZiAobWV0YS5kZXNjKSB7XG4gICAgICB0aGlzLl9wcm9jZXNzTWV0YURlc2MobWV0YS5kZXNjKTtcbiAgICB9XG4gICAgaWYgKG1ldGEuc3ViICYmIG1ldGEuc3ViLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuX3Byb2Nlc3NNZXRhU3ViKG1ldGEuc3ViKTtcbiAgICB9XG4gICAgaWYgKG1ldGEuZGVsKSB7XG4gICAgICB0aGlzLl9wcm9jZXNzRGVsTWVzc2FnZXMobWV0YS5kZWwuY2xlYXIsIG1ldGEuZGVsLmRlbHNlcSk7XG4gICAgfVxuICAgIGlmIChtZXRhLnRhZ3MpIHtcbiAgICAgIHRoaXMuX3Byb2Nlc3NNZXRhVGFncyhtZXRhLnRhZ3MpO1xuICAgIH1cbiAgICBpZiAobWV0YS5jcmVkKSB7XG4gICAgICB0aGlzLl9wcm9jZXNzTWV0YUNyZWRzKG1ldGEuY3JlZCk7XG4gICAgfVxuICAgIGlmICh0aGlzLm9uTWV0YSkge1xuICAgICAgdGhpcy5vbk1ldGEobWV0YSk7XG4gICAgfVxuICB9XG4gIC8vIFByb2Nlc3MgcHJlc2VuY2UgY2hhbmdlIG1lc3NhZ2VcbiAgX3JvdXRlUHJlcyhwcmVzKSB7XG4gICAgbGV0IHVzZXIsIHVpZDtcbiAgICBzd2l0Y2ggKHByZXMud2hhdCkge1xuICAgICAgY2FzZSAnZGVsJzpcbiAgICAgICAgLy8gRGVsZXRlIGNhY2hlZCBtZXNzYWdlcy5cbiAgICAgICAgdGhpcy5fcHJvY2Vzc0RlbE1lc3NhZ2VzKHByZXMuY2xlYXIsIHByZXMuZGVsc2VxKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdvbic6XG4gICAgICBjYXNlICdvZmYnOlxuICAgICAgICAvLyBVcGRhdGUgb25saW5lIHN0YXR1cyBvZiBhIHN1YnNjcmlwdGlvbi5cbiAgICAgICAgdXNlciA9IHRoaXMuX3VzZXJzW3ByZXMuc3JjXTtcbiAgICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgICB1c2VyLm9ubGluZSA9IHByZXMud2hhdCA9PSAnb24nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3Rpbm9kZS5sb2dnZXIoXCJXQVJOSU5HOiBQcmVzZW5jZSB1cGRhdGUgZm9yIGFuIHVua25vd24gdXNlclwiLCB0aGlzLm5hbWUsIHByZXMuc3JjKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3Rlcm0nOlxuICAgICAgICAvLyBBdHRhY2htZW50IHRvIHRvcGljIGlzIHRlcm1pbmF0ZWQgcHJvYmFibHkgZHVlIHRvIGNsdXN0ZXIgcmVoYXNoaW5nLlxuICAgICAgICB0aGlzLl9yZXNldFN1YigpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3VwZCc6XG4gICAgICAgIC8vIEEgdG9waWMgc3Vic2NyaWJlciBoYXMgdXBkYXRlZCBoaXMgZGVzY3JpcHRpb24uXG4gICAgICAgIC8vIElzc3VlIHtnZXQgc3VifSBvbmx5IGlmIHRoZSBjdXJyZW50IHVzZXIgaGFzIG5vIHAycCB0b3BpY3Mgd2l0aCB0aGUgdXBkYXRlZCB1c2VyIChwMnAgbmFtZSBpcyBub3QgaW4gY2FjaGUpLlxuICAgICAgICAvLyBPdGhlcndpc2UgJ21lJyB3aWxsIGlzc3VlIGEge2dldCBkZXNjfSByZXF1ZXN0LlxuICAgICAgICBpZiAocHJlcy5zcmMgJiYgIXRoaXMuX3Rpbm9kZS5pc1RvcGljQ2FjaGVkKHByZXMuc3JjKSkge1xuICAgICAgICAgIHRoaXMuZ2V0TWV0YSh0aGlzLnN0YXJ0TWV0YVF1ZXJ5KCkud2l0aExhdGVyT25lU3ViKHByZXMuc3JjKS5idWlsZCgpKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2Fjcyc6XG4gICAgICAgIHVpZCA9IHByZXMuc3JjIHx8IHRoaXMuX3Rpbm9kZS5nZXRDdXJyZW50VXNlcklEKCk7XG4gICAgICAgIHVzZXIgPSB0aGlzLl91c2Vyc1t1aWRdO1xuICAgICAgICBpZiAoIXVzZXIpIHtcbiAgICAgICAgICAvLyBVcGRhdGUgZm9yIGFuIHVua25vd24gdXNlcjogbm90aWZpY2F0aW9uIG9mIGEgbmV3IHN1YnNjcmlwdGlvbi5cbiAgICAgICAgICBjb25zdCBhY3MgPSBuZXcgQWNjZXNzTW9kZSgpLnVwZGF0ZUFsbChwcmVzLmRhY3MpO1xuICAgICAgICAgIGlmIChhY3MgJiYgYWNzLm1vZGUgIT0gQWNjZXNzTW9kZS5fTk9ORSkge1xuICAgICAgICAgICAgdXNlciA9IHRoaXMuX2NhY2hlR2V0VXNlcih1aWQpO1xuICAgICAgICAgICAgaWYgKCF1c2VyKSB7XG4gICAgICAgICAgICAgIHVzZXIgPSB7XG4gICAgICAgICAgICAgICAgdXNlcjogdWlkLFxuICAgICAgICAgICAgICAgIGFjczogYWNzXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIHRoaXMuZ2V0TWV0YSh0aGlzLnN0YXJ0TWV0YVF1ZXJ5KCkud2l0aE9uZVN1Yih1bmRlZmluZWQsIHVpZCkuYnVpbGQoKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB1c2VyLmFjcyA9IGFjcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHVzZXIudXBkYXRlZCA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9jZXNzTWV0YVN1YihbdXNlcl0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBLbm93biB1c2VyXG4gICAgICAgICAgdXNlci5hY3MudXBkYXRlQWxsKHByZXMuZGFjcyk7XG4gICAgICAgICAgLy8gVXBkYXRlIHVzZXIncyBhY2Nlc3MgbW9kZS5cbiAgICAgICAgICB0aGlzLl9wcm9jZXNzTWV0YVN1Yihbe1xuICAgICAgICAgICAgdXNlcjogdWlkLFxuICAgICAgICAgICAgdXBkYXRlZDogbmV3IERhdGUoKSxcbiAgICAgICAgICAgIGFjczogdXNlci5hY3NcbiAgICAgICAgICB9XSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLl90aW5vZGUubG9nZ2VyKFwiSU5GTzogSWdub3JlZCBwcmVzZW5jZSB1cGRhdGVcIiwgcHJlcy53aGF0KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vblByZXMpIHtcbiAgICAgIHRoaXMub25QcmVzKHByZXMpO1xuICAgIH1cbiAgfVxuICAvLyBQcm9jZXNzIHtpbmZvfSBtZXNzYWdlXG4gIF9yb3V0ZUluZm8oaW5mbykge1xuICAgIHN3aXRjaCAoaW5mby53aGF0KSB7XG4gICAgICBjYXNlICdyZWN2JzpcbiAgICAgIGNhc2UgJ3JlYWQnOlxuICAgICAgICBjb25zdCB1c2VyID0gdGhpcy5fdXNlcnNbaW5mby5mcm9tXTtcbiAgICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgICB1c2VyW2luZm8ud2hhdF0gPSBpbmZvLnNlcTtcbiAgICAgICAgICBpZiAodXNlci5yZWN2IDwgdXNlci5yZWFkKSB7XG4gICAgICAgICAgICB1c2VyLnJlY3YgPSB1c2VyLnJlYWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG1zZyA9IHRoaXMubGF0ZXN0TWVzc2FnZSgpO1xuICAgICAgICBpZiAobXNnKSB7XG4gICAgICAgICAgdGhpcy5tc2dTdGF0dXMobXNnLCB0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHRoaXMgaXMgYW4gdXBkYXRlIGZyb20gdGhlIGN1cnJlbnQgdXNlciwgdXBkYXRlIHRoZSBjYWNoZSB3aXRoIHRoZSBuZXcgY291bnQuXG4gICAgICAgIGlmICh0aGlzLl90aW5vZGUuaXNNZShpbmZvLmZyb20pKSB7XG4gICAgICAgICAgdGhpcy5fdXBkYXRlUmVhZFJlY3YoaW5mby53aGF0LCBpbmZvLnNlcSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBOb3RpZnkgJ21lJyBsaXN0ZW5lciBvZiB0aGUgc3RhdHVzIGNoYW5nZS5cbiAgICAgICAgdGhpcy5fdGlub2RlLmdldE1lVG9waWMoKS5fcmVmcmVzaENvbnRhY3QoaW5mby53aGF0LCB0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdrcCc6XG4gICAgICAgIC8vIERvIG5vdGhpbmcuXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnY2FsbCc6XG4gICAgICAgIC8vIERvIG5vdGhpbmcgaGVyZS5cbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLl90aW5vZGUubG9nZ2VyKFwiSU5GTzogSWdub3JlZCBpbmZvIHVwZGF0ZVwiLCBpbmZvLndoYXQpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9uSW5mbykge1xuICAgICAgdGhpcy5vbkluZm8oaW5mbyk7XG4gICAgfVxuICB9XG4gIC8vIENhbGxlZCBieSBUaW5vZGUgd2hlbiBtZXRhLmRlc2MgcGFja2V0IGlzIHJlY2VpdmVkLlxuICAvLyBDYWxsZWQgYnkgJ21lJyB0b3BpYyBvbiBjb250YWN0IHVwZGF0ZSAoZGVzYy5fbm9Gb3J3YXJkaW5nIGlzIHRydWUpLlxuICBfcHJvY2Vzc01ldGFEZXNjKGRlc2MpIHtcbiAgICBpZiAodGhpcy5pc1AyUFR5cGUoKSkge1xuICAgICAgLy8gU3ludGhldGljIGRlc2MgbWF5IGluY2x1ZGUgZGVmYWNzIGZvciBwMnAgdG9waWNzIHdoaWNoIGlzIHVzZWxlc3MuXG4gICAgICAvLyBSZW1vdmUgaXQuXG4gICAgICBkZWxldGUgZGVzYy5kZWZhY3M7XG5cbiAgICAgIC8vIFVwZGF0ZSB0byBwMnAgZGVzYyBpcyB0aGUgc2FtZSBhcyB1c2VyIHVwZGF0ZS4gVXBkYXRlIGNhY2hlZCB1c2VyLlxuICAgICAgdGhpcy5fdGlub2RlLl9kYi51cGRVc2VyKHRoaXMubmFtZSwgZGVzYy5wdWJsaWMpO1xuICAgIH1cblxuICAgIC8vIENvcHkgcGFyYW1ldGVycyBmcm9tIGRlc2Mgb2JqZWN0IHRvIHRoaXMgdG9waWMuXG4gICAgbWVyZ2VPYmoodGhpcywgZGVzYyk7XG4gICAgLy8gVXBkYXRlIHBlcnNpc3RlbnQgY2FjaGUuXG4gICAgdGhpcy5fdGlub2RlLl9kYi51cGRUb3BpYyh0aGlzKTtcblxuICAgIC8vIE5vdGlmeSAnbWUnIGxpc3RlbmVyLCBpZiBhdmFpbGFibGU6XG4gICAgaWYgKHRoaXMubmFtZSAhPT0gQ29uc3QuVE9QSUNfTUUgJiYgIWRlc2MuX25vRm9yd2FyZGluZykge1xuICAgICAgY29uc3QgbWUgPSB0aGlzLl90aW5vZGUuZ2V0TWVUb3BpYygpO1xuICAgICAgaWYgKG1lLm9uTWV0YVN1Yikge1xuICAgICAgICBtZS5vbk1ldGFTdWIodGhpcyk7XG4gICAgICB9XG4gICAgICBpZiAobWUub25TdWJzVXBkYXRlZCkge1xuICAgICAgICBtZS5vblN1YnNVcGRhdGVkKFt0aGlzLm5hbWVdLCAxKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5vbk1ldGFEZXNjKSB7XG4gICAgICB0aGlzLm9uTWV0YURlc2ModGhpcyk7XG4gICAgfVxuICB9XG4gIC8vIENhbGxlZCBieSBUaW5vZGUgd2hlbiBtZXRhLnN1YiBpcyByZWNpdmVkIG9yIGluIHJlc3BvbnNlIHRvIHJlY2VpdmVkXG4gIC8vIHtjdHJsfSBhZnRlciBzZXRNZXRhLXN1Yi5cbiAgX3Byb2Nlc3NNZXRhU3ViKHN1YnMpIHtcbiAgICBmb3IgKGxldCBpZHggaW4gc3Vicykge1xuICAgICAgY29uc3Qgc3ViID0gc3Vic1tpZHhdO1xuXG4gICAgICAvLyBGaWxsIGRlZmF1bHRzLlxuICAgICAgc3ViLm9ubGluZSA9ICEhc3ViLm9ubGluZTtcbiAgICAgIC8vIFVwZGF0ZSB0aW1lc3RhbXAgb2YgdGhlIG1vc3QgcmVjZW50IHN1YnNjcmlwdGlvbiB1cGRhdGUuXG4gICAgICB0aGlzLl9sYXN0U3Vic1VwZGF0ZSA9IG5ldyBEYXRlKE1hdGgubWF4KHRoaXMuX2xhc3RTdWJzVXBkYXRlLCBzdWIudXBkYXRlZCkpO1xuXG4gICAgICBsZXQgdXNlciA9IG51bGw7XG4gICAgICBpZiAoIXN1Yi5kZWxldGVkKSB7XG4gICAgICAgIC8vIElmIHRoaXMgaXMgYSBjaGFuZ2UgdG8gdXNlcidzIG93biBwZXJtaXNzaW9ucywgdXBkYXRlIHRoZW0gaW4gdG9waWMgdG9vLlxuICAgICAgICAvLyBEZXNjIHdpbGwgdXBkYXRlICdtZScgdG9waWMuXG4gICAgICAgIGlmICh0aGlzLl90aW5vZGUuaXNNZShzdWIudXNlcikgJiYgc3ViLmFjcykge1xuICAgICAgICAgIHRoaXMuX3Byb2Nlc3NNZXRhRGVzYyh7XG4gICAgICAgICAgICB1cGRhdGVkOiBzdWIudXBkYXRlZCxcbiAgICAgICAgICAgIHRvdWNoZWQ6IHN1Yi50b3VjaGVkLFxuICAgICAgICAgICAgYWNzOiBzdWIuYWNzXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdXNlciA9IHRoaXMuX3VwZGF0ZUNhY2hlZFVzZXIoc3ViLnVzZXIsIHN1Yik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBTdWJzY3JpcHRpb24gaXMgZGVsZXRlZCwgcmVtb3ZlIGl0IGZyb20gdG9waWMgKGJ1dCBsZWF2ZSBpbiBVc2VycyBjYWNoZSlcbiAgICAgICAgZGVsZXRlIHRoaXMuX3VzZXJzW3N1Yi51c2VyXTtcbiAgICAgICAgdXNlciA9IHN1YjtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMub25NZXRhU3ViKSB7XG4gICAgICAgIHRoaXMub25NZXRhU3ViKHVzZXIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLm9uU3Vic1VwZGF0ZWQpIHtcbiAgICAgIHRoaXMub25TdWJzVXBkYXRlZChPYmplY3Qua2V5cyh0aGlzLl91c2VycykpO1xuICAgIH1cbiAgfVxuICAvLyBDYWxsZWQgYnkgVGlub2RlIHdoZW4gbWV0YS50YWdzIGlzIHJlY2l2ZWQuXG4gIF9wcm9jZXNzTWV0YVRhZ3ModGFncykge1xuICAgIGlmICh0YWdzLmxlbmd0aCA9PSAxICYmIHRhZ3NbMF0gPT0gQ29uc3QuREVMX0NIQVIpIHtcbiAgICAgIHRhZ3MgPSBbXTtcbiAgICB9XG4gICAgdGhpcy5fdGFncyA9IHRhZ3M7XG4gICAgaWYgKHRoaXMub25UYWdzVXBkYXRlZCkge1xuICAgICAgdGhpcy5vblRhZ3NVcGRhdGVkKHRhZ3MpO1xuICAgIH1cbiAgfVxuICAvLyBEbyBub3RoaW5nIGZvciB0b3BpY3Mgb3RoZXIgdGhhbiAnbWUnXG4gIF9wcm9jZXNzTWV0YUNyZWRzKGNyZWRzKSB7fVxuICAvLyBEZWxldGUgY2FjaGVkIG1lc3NhZ2VzIGFuZCB1cGRhdGUgY2FjaGVkIHRyYW5zYWN0aW9uIElEc1xuICBfcHJvY2Vzc0RlbE1lc3NhZ2VzKGNsZWFyLCBkZWxzZXEpIHtcbiAgICB0aGlzLl9tYXhEZWwgPSBNYXRoLm1heChjbGVhciwgdGhpcy5fbWF4RGVsKTtcbiAgICB0aGlzLmNsZWFyID0gTWF0aC5tYXgoY2xlYXIsIHRoaXMuY2xlYXIpO1xuICAgIGNvbnN0IHRvcGljID0gdGhpcztcbiAgICBsZXQgY291bnQgPSAwO1xuICAgIGlmIChBcnJheS5pc0FycmF5KGRlbHNlcSkpIHtcbiAgICAgIGRlbHNlcS5mb3JFYWNoKGZ1bmN0aW9uKHJhbmdlKSB7XG4gICAgICAgIGlmICghcmFuZ2UuaGkpIHtcbiAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgIHRvcGljLmZsdXNoTWVzc2FnZShyYW5nZS5sb3cpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZvciAobGV0IGkgPSByYW5nZS5sb3c7IGkgPCByYW5nZS5oaTsgaSsrKSB7XG4gICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgICAgdG9waWMuZmx1c2hNZXNzYWdlKGkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGNvdW50ID4gMCkge1xuICAgICAgLy8gdGhpcy5fdXBkYXRlRGVsZXRlZFJhbmdlcygpO1xuXG4gICAgICBpZiAodGhpcy5vbkRhdGEpIHtcbiAgICAgICAgdGhpcy5vbkRhdGEoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLy8gVG9waWMgaXMgaW5mb3JtZWQgdGhhdCB0aGUgZW50aXJlIHJlc3BvbnNlIHRvIHtnZXQgd2hhdD1kYXRhfSBoYXMgYmVlbiByZWNlaXZlZC5cbiAgX2FsbE1lc3NhZ2VzUmVjZWl2ZWQoY291bnQpIHtcblxuICAgIGlmICh0aGlzLm9uQWxsTWVzc2FnZXNSZWNlaXZlZCkge1xuICAgICAgdGhpcy5vbkFsbE1lc3NhZ2VzUmVjZWl2ZWQoY291bnQpO1xuICAgIH1cbiAgfVxuICAvLyBSZXNldCBzdWJzY3JpYmVkIHN0YXRlXG4gIF9yZXNldFN1YigpIHtcbiAgICB0aGlzLl9hdHRhY2hlZCA9IGZhbHNlO1xuICB9XG4gIC8vIFRoaXMgdG9waWMgaXMgZWl0aGVyIGRlbGV0ZWQgb3IgdW5zdWJzY3JpYmVkIGZyb20uXG4gIF9nb25lKCkge1xuICAgIHRoaXMuX21lc3NhZ2VzLnJlc2V0KCk7XG4gICAgdGhpcy5fdGlub2RlLl9kYi5yZW1NZXNzYWdlcyh0aGlzLm5hbWUpO1xuICAgIHRoaXMuX3VzZXJzID0ge307XG4gICAgdGhpcy5hY3MgPSBuZXcgQWNjZXNzTW9kZShudWxsKTtcbiAgICB0aGlzLnByaXZhdGUgPSBudWxsO1xuICAgIHRoaXMucHVibGljID0gbnVsbDtcbiAgICB0aGlzLnRydXN0ZWQgPSBudWxsO1xuICAgIHRoaXMuX21heFNlcSA9IDA7XG4gICAgdGhpcy5fbWluU2VxID0gMDtcbiAgICB0aGlzLl9hdHRhY2hlZCA9IGZhbHNlO1xuXG4gICAgY29uc3QgbWUgPSB0aGlzLl90aW5vZGUuZ2V0TWVUb3BpYygpO1xuICAgIGlmIChtZSkge1xuICAgICAgbWUuX3JvdXRlUHJlcyh7XG4gICAgICAgIF9ub0ZvcndhcmRpbmc6IHRydWUsXG4gICAgICAgIHdoYXQ6ICdnb25lJyxcbiAgICAgICAgdG9waWM6IENvbnN0LlRPUElDX01FLFxuICAgICAgICBzcmM6IHRoaXMubmFtZVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm9uRGVsZXRlVG9waWMpIHtcbiAgICAgIHRoaXMub25EZWxldGVUb3BpYygpO1xuICAgIH1cbiAgfVxuICAvLyBVcGRhdGUgZ2xvYmFsIHVzZXIgY2FjaGUgYW5kIGxvY2FsIHN1YnNjcmliZXJzIGNhY2hlLlxuICAvLyBEb24ndCBjYWxsIHRoaXMgbWV0aG9kIGZvciBub24tc3Vic2NyaWJlcnMuXG4gIF91cGRhdGVDYWNoZWRVc2VyKHVpZCwgb2JqKSB7XG4gICAgLy8gRmV0Y2ggdXNlciBvYmplY3QgZnJvbSB0aGUgZ2xvYmFsIGNhY2hlLlxuICAgIC8vIFRoaXMgaXMgYSBjbG9uZSBvZiB0aGUgc3RvcmVkIG9iamVjdFxuICAgIGxldCBjYWNoZWQgPSB0aGlzLl9jYWNoZUdldFVzZXIodWlkKTtcbiAgICBjYWNoZWQgPSBtZXJnZU9iaihjYWNoZWQgfHwge30sIG9iaik7XG4gICAgLy8gU2F2ZSB0byBnbG9iYWwgY2FjaGVcbiAgICB0aGlzLl9jYWNoZVB1dFVzZXIodWlkLCBjYWNoZWQpO1xuICAgIC8vIFNhdmUgdG8gdGhlIGxpc3Qgb2YgdG9waWMgc3Vic3JpYmVycy5cbiAgICByZXR1cm4gbWVyZ2VUb0NhY2hlKHRoaXMuX3VzZXJzLCB1aWQsIGNhY2hlZCk7XG4gIH1cbiAgLy8gR2V0IGxvY2FsIHNlcUlkIGZvciBhIHF1ZXVlZCBtZXNzYWdlLlxuICBfZ2V0UXVldWVkU2VxSWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3F1ZXVlZFNlcUlkKys7XG4gIH1cblxuICAvLyBMb2FkIG1vc3QgcmVjZW50IG1lc3NhZ2VzIGZyb20gcGVyc2lzdGVudCBjYWNoZS5cbiAgX2xvYWRNZXNzYWdlcyhkYiwgcGFyYW1zKSB7XG4gICAgY29uc3Qge1xuICAgICAgc2luY2UsXG4gICAgICBiZWZvcmUsXG4gICAgICBsaW1pdFxuICAgIH0gPSBwYXJhbXMgfHwge307XG4gICAgcmV0dXJuIGRiLnJlYWRNZXNzYWdlcyh0aGlzLm5hbWUsIHtcbiAgICAgICAgc2luY2U6IHNpbmNlLFxuICAgICAgICBiZWZvcmU6IGJlZm9yZSxcbiAgICAgICAgbGltaXQ6IGxpbWl0IHx8IENvbnN0LkRFRkFVTFRfTUVTU0FHRVNfUEFHRVxuICAgICAgfSlcbiAgICAgIC50aGVuKG1zZ3MgPT4ge1xuICAgICAgICBtc2dzLmZvckVhY2goKGRhdGEpID0+IHtcbiAgICAgICAgICBpZiAoZGF0YS5zZXEgPiB0aGlzLl9tYXhTZXEpIHtcbiAgICAgICAgICAgIHRoaXMuX21heFNlcSA9IGRhdGEuc2VxO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZGF0YS5zZXEgPCB0aGlzLl9taW5TZXEgfHwgdGhpcy5fbWluU2VxID09IDApIHtcbiAgICAgICAgICAgIHRoaXMuX21pblNlcSA9IGRhdGEuc2VxO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLl9tZXNzYWdlcy5wdXQoZGF0YSk7XG4gICAgICAgICAgdGhpcy5fbWF5YmVVcGRhdGVNZXNzYWdlVmVyc2lvbnNDYWNoZShkYXRhKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBtc2dzLmxlbmd0aDtcbiAgICAgIH0pO1xuICB9XG4gIC8vIFB1c2ggb3Ige3ByZXN9OiBtZXNzYWdlIHJlY2VpdmVkLlxuICBfdXBkYXRlUmVjZWl2ZWQoc2VxLCBhY3QpIHtcbiAgICB0aGlzLnRvdWNoZWQgPSBuZXcgRGF0ZSgpO1xuICAgIHRoaXMuc2VxID0gc2VxIHwgMDtcbiAgICAvLyBDaGVjayBpZiBtZXNzYWdlIGlzIHNlbnQgYnkgdGhlIGN1cnJlbnQgdXNlci4gSWYgc28gaXQncyBiZWVuIHJlYWQgYWxyZWFkeS5cbiAgICBpZiAoIWFjdCB8fCB0aGlzLl90aW5vZGUuaXNNZShhY3QpKSB7XG4gICAgICB0aGlzLnJlYWQgPSB0aGlzLnJlYWQgPyBNYXRoLm1heCh0aGlzLnJlYWQsIHRoaXMuc2VxKSA6IHRoaXMuc2VxO1xuICAgICAgdGhpcy5yZWN2ID0gdGhpcy5yZWN2ID8gTWF0aC5tYXgodGhpcy5yZWFkLCB0aGlzLnJlY3YpIDogdGhpcy5yZWFkO1xuICAgIH1cbiAgICB0aGlzLnVucmVhZCA9IHRoaXMuc2VxIC0gKHRoaXMucmVhZCB8IDApO1xuICAgIHRoaXMuX3Rpbm9kZS5fZGIudXBkVG9waWModGhpcyk7XG4gIH1cbn1cblxuLyoqXG4gKiBAY2xhc3MgVG9waWNNZSAtIHNwZWNpYWwgY2FzZSBvZiB7QGxpbmsgVGlub2RlLlRvcGljfSBmb3JcbiAqIG1hbmFnaW5nIGRhdGEgb2YgdGhlIGN1cnJlbnQgdXNlciwgaW5jbHVkaW5nIGNvbnRhY3QgbGlzdC5cbiAqIEBleHRlbmRzIFRpbm9kZS5Ub3BpY1xuICogQG1lbWJlcm9mIFRpbm9kZVxuICpcbiAqIEBwYXJhbSB7VG9waWNNZS5DYWxsYmFja3N9IGNhbGxiYWNrcyAtIENhbGxiYWNrcyB0byByZWNlaXZlIHZhcmlvdXMgZXZlbnRzLlxuICovXG4vKipcbiAqIEBjbGFzcyBUb3BpY01lIC0gc3BlY2lhbCBjYXNlIG9mIHtAbGluayBUaW5vZGUuVG9waWN9IGZvclxuICogbWFuYWdpbmcgZGF0YSBvZiB0aGUgY3VycmVudCB1c2VyLCBpbmNsdWRpbmcgY29udGFjdCBsaXN0LlxuICogQGV4dGVuZHMgVGlub2RlLlRvcGljXG4gKiBAbWVtYmVyb2YgVGlub2RlXG4gKlxuICogQHBhcmFtIHtUb3BpY01lLkNhbGxiYWNrc30gY2FsbGJhY2tzIC0gQ2FsbGJhY2tzIHRvIHJlY2VpdmUgdmFyaW91cyBldmVudHMuXG4gKi9cbmV4cG9ydCBjbGFzcyBUb3BpY01lIGV4dGVuZHMgVG9waWMge1xuICBvbkNvbnRhY3RVcGRhdGU7XG5cbiAgY29uc3RydWN0b3IoY2FsbGJhY2tzKSB7XG4gICAgc3VwZXIoQ29uc3QuVE9QSUNfTUUsIGNhbGxiYWNrcyk7XG5cbiAgICAvLyBtZS1zcGVjaWZpYyBjYWxsYmFja3NcbiAgICBpZiAoY2FsbGJhY2tzKSB7XG4gICAgICB0aGlzLm9uQ29udGFjdFVwZGF0ZSA9IGNhbGxiYWNrcy5vbkNvbnRhY3RVcGRhdGU7XG4gICAgfVxuICB9XG5cbiAgLy8gT3ZlcnJpZGUgdGhlIG9yaWdpbmFsIFRvcGljLl9wcm9jZXNzTWV0YURlc2MuXG4gIF9wcm9jZXNzTWV0YURlc2MoZGVzYykge1xuICAgIC8vIENoZWNrIGlmIG9ubGluZSBjb250YWN0cyBuZWVkIHRvIGJlIHR1cm5lZCBvZmYgYmVjYXVzZSBQIHBlcm1pc3Npb24gd2FzIHJlbW92ZWQuXG4gICAgY29uc3QgdHVybk9mZiA9IChkZXNjLmFjcyAmJiAhZGVzYy5hY3MuaXNQcmVzZW5jZXIoKSkgJiYgKHRoaXMuYWNzICYmIHRoaXMuYWNzLmlzUHJlc2VuY2VyKCkpO1xuXG4gICAgLy8gQ29weSBwYXJhbWV0ZXJzIGZyb20gZGVzYyBvYmplY3QgdG8gdGhpcyB0b3BpYy5cbiAgICBtZXJnZU9iaih0aGlzLCBkZXNjKTtcbiAgICB0aGlzLl90aW5vZGUuX2RiLnVwZFRvcGljKHRoaXMpO1xuICAgIC8vIFVwZGF0ZSBjdXJyZW50IHVzZXIncyByZWNvcmQgaW4gdGhlIGdsb2JhbCBjYWNoZS5cbiAgICB0aGlzLl91cGRhdGVDYWNoZWRVc2VyKHRoaXMuX3Rpbm9kZS5fbXlVSUQsIGRlc2MpO1xuXG4gICAgLy8gJ1AnIHBlcm1pc3Npb24gd2FzIHJlbW92ZWQuIEFsbCB0b3BpY3MgYXJlIG9mZmxpbmUgbm93LlxuICAgIGlmICh0dXJuT2ZmKSB7XG4gICAgICB0aGlzLl90aW5vZGUubWFwVG9waWNzKChjb250KSA9PiB7XG4gICAgICAgIGlmIChjb250Lm9ubGluZSkge1xuICAgICAgICAgIGNvbnQub25saW5lID0gZmFsc2U7XG4gICAgICAgICAgY29udC5zZWVuID0gT2JqZWN0LmFzc2lnbihjb250LnNlZW4gfHwge30sIHtcbiAgICAgICAgICAgIHdoZW46IG5ldyBEYXRlKClcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLl9yZWZyZXNoQ29udGFjdCgnb2ZmJywgY29udCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9uTWV0YURlc2MpIHtcbiAgICAgIHRoaXMub25NZXRhRGVzYyh0aGlzKTtcbiAgICB9XG4gIH1cblxuICAvLyBPdmVycmlkZSB0aGUgb3JpZ2luYWwgVG9waWMuX3Byb2Nlc3NNZXRhU3ViXG4gIF9wcm9jZXNzTWV0YVN1YihzdWJzKSB7XG4gICAgbGV0IHVwZGF0ZUNvdW50ID0gMDtcbiAgICBzdWJzLmZvckVhY2goKHN1YikgPT4ge1xuICAgICAgY29uc3QgdG9waWNOYW1lID0gc3ViLnRvcGljO1xuICAgICAgLy8gRG9uJ3Qgc2hvdyAnbWUnIGFuZCAnZm5kJyB0b3BpY3MgaW4gdGhlIGxpc3Qgb2YgY29udGFjdHMuXG4gICAgICBpZiAodG9waWNOYW1lID09IENvbnN0LlRPUElDX0ZORCB8fCB0b3BpY05hbWUgPT0gQ29uc3QuVE9QSUNfTUUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgc3ViLm9ubGluZSA9ICEhc3ViLm9ubGluZTtcblxuICAgICAgbGV0IGNvbnQgPSBudWxsO1xuICAgICAgaWYgKHN1Yi5kZWxldGVkKSB7XG4gICAgICAgIGNvbnQgPSBzdWI7XG4gICAgICAgIHRoaXMuX3Rpbm9kZS5jYWNoZVJlbVRvcGljKHRvcGljTmFtZSk7XG4gICAgICAgIHRoaXMuX3Rpbm9kZS5fZGIucmVtVG9waWModG9waWNOYW1lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEVuc3VyZSB0aGUgdmFsdWVzIGFyZSBkZWZpbmVkIGFuZCBhcmUgaW50ZWdlcnMuXG4gICAgICAgIGlmICh0eXBlb2Ygc3ViLnNlcSAhPSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIHN1Yi5zZXEgPSBzdWIuc2VxIHwgMDtcbiAgICAgICAgICBzdWIucmVjdiA9IHN1Yi5yZWN2IHwgMDtcbiAgICAgICAgICBzdWIucmVhZCA9IHN1Yi5yZWFkIHwgMDtcbiAgICAgICAgICBzdWIudW5yZWFkID0gc3ViLnNlcSAtIHN1Yi5yZWFkO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdG9waWMgPSB0aGlzLl90aW5vZGUuZ2V0VG9waWModG9waWNOYW1lKTtcbiAgICAgICAgaWYgKHRvcGljLl9uZXcpIHtcbiAgICAgICAgICBkZWxldGUgdG9waWMuX25ldztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnQgPSBtZXJnZU9iaih0b3BpYywgc3ViKTtcbiAgICAgICAgdGhpcy5fdGlub2RlLl9kYi51cGRUb3BpYyhjb250KTtcblxuICAgICAgICBpZiAoVG9waWMuaXNQMlBUb3BpY05hbWUodG9waWNOYW1lKSkge1xuICAgICAgICAgIHRoaXMuX2NhY2hlUHV0VXNlcih0b3BpY05hbWUsIGNvbnQpO1xuICAgICAgICAgIHRoaXMuX3Rpbm9kZS5fZGIudXBkVXNlcih0b3BpY05hbWUsIGNvbnQucHVibGljKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBOb3RpZnkgdG9waWMgb2YgdGhlIHVwZGF0ZSBpZiBpdCdzIGFuIGV4dGVybmFsIHVwZGF0ZS5cbiAgICAgICAgaWYgKCFzdWIuX25vRm9yd2FyZGluZyAmJiB0b3BpYykge1xuICAgICAgICAgIHN1Yi5fbm9Gb3J3YXJkaW5nID0gdHJ1ZTtcbiAgICAgICAgICB0b3BpYy5fcHJvY2Vzc01ldGFEZXNjKHN1Yik7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdXBkYXRlQ291bnQrKztcblxuICAgICAgaWYgKHRoaXMub25NZXRhU3ViKSB7XG4gICAgICAgIHRoaXMub25NZXRhU3ViKGNvbnQpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMub25TdWJzVXBkYXRlZCAmJiB1cGRhdGVDb3VudCA+IDApIHtcbiAgICAgIGNvbnN0IGtleXMgPSBbXTtcbiAgICAgIHN1YnMuZm9yRWFjaCgocykgPT4ge1xuICAgICAgICBrZXlzLnB1c2gocy50b3BpYyk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMub25TdWJzVXBkYXRlZChrZXlzLCB1cGRhdGVDb3VudCk7XG4gICAgfVxuICB9XG5cbiAgLy8gQ2FsbGVkIGJ5IFRpbm9kZSB3aGVuIG1ldGEuc3ViIGlzIHJlY2l2ZWQuXG4gIF9wcm9jZXNzTWV0YUNyZWRzKGNyZWRzLCB1cGQpIHtcbiAgICBpZiAoY3JlZHMubGVuZ3RoID09IDEgJiYgY3JlZHNbMF0gPT0gQ29uc3QuREVMX0NIQVIpIHtcbiAgICAgIGNyZWRzID0gW107XG4gICAgfVxuICAgIGlmICh1cGQpIHtcbiAgICAgIGNyZWRzLmZvckVhY2goKGNyKSA9PiB7XG4gICAgICAgIGlmIChjci52YWwpIHtcbiAgICAgICAgICAvLyBBZGRpbmcgYSBjcmVkZW50aWFsLlxuICAgICAgICAgIGxldCBpZHggPSB0aGlzLl9jcmVkZW50aWFscy5maW5kSW5kZXgoKGVsKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZWwubWV0aCA9PSBjci5tZXRoICYmIGVsLnZhbCA9PSBjci52YWw7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKGlkeCA8IDApIHtcbiAgICAgICAgICAgIC8vIE5vdCBmb3VuZC5cbiAgICAgICAgICAgIGlmICghY3IuZG9uZSkge1xuICAgICAgICAgICAgICAvLyBVbmNvbmZpcm1lZCBjcmVkZW50aWFsIHJlcGxhY2VzIHByZXZpb3VzIHVuY29uZmlybWVkIGNyZWRlbnRpYWwgb2YgdGhlIHNhbWUgbWV0aG9kLlxuICAgICAgICAgICAgICBpZHggPSB0aGlzLl9jcmVkZW50aWFscy5maW5kSW5kZXgoKGVsKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsLm1ldGggPT0gY3IubWV0aCAmJiAhZWwuZG9uZTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIGlmIChpZHggPj0gMCkge1xuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSBwcmV2aW91cyB1bmNvbmZpcm1lZCBjcmVkZW50aWFsLlxuICAgICAgICAgICAgICAgIHRoaXMuX2NyZWRlbnRpYWxzLnNwbGljZShpZHgsIDEpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9jcmVkZW50aWFscy5wdXNoKGNyKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gRm91bmQuIE1heWJlIGNoYW5nZSAnZG9uZScgc3RhdHVzLlxuICAgICAgICAgICAgdGhpcy5fY3JlZGVudGlhbHNbaWR4XS5kb25lID0gY3IuZG9uZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoY3IucmVzcCkge1xuICAgICAgICAgIC8vIEhhbmRsZSBjcmVkZW50aWFsIGNvbmZpcm1hdGlvbi5cbiAgICAgICAgICBjb25zdCBpZHggPSB0aGlzLl9jcmVkZW50aWFscy5maW5kSW5kZXgoKGVsKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZWwubWV0aCA9PSBjci5tZXRoICYmICFlbC5kb25lO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmIChpZHggPj0gMCkge1xuICAgICAgICAgICAgdGhpcy5fY3JlZGVudGlhbHNbaWR4XS5kb25lID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9jcmVkZW50aWFscyA9IGNyZWRzO1xuICAgIH1cbiAgICBpZiAodGhpcy5vbkNyZWRzVXBkYXRlZCkge1xuICAgICAgdGhpcy5vbkNyZWRzVXBkYXRlZCh0aGlzLl9jcmVkZW50aWFscyk7XG4gICAgfVxuICB9XG5cbiAgLy8gUHJvY2VzcyBwcmVzZW5jZSBjaGFuZ2UgbWVzc2FnZVxuICBfcm91dGVQcmVzKHByZXMpIHtcbiAgICBpZiAocHJlcy53aGF0ID09ICd0ZXJtJykge1xuICAgICAgLy8gVGhlICdtZScgdG9waWMgaXRzZWxmIGlzIGRldGFjaGVkLiBNYXJrIGFzIHVuc3Vic2NyaWJlZC5cbiAgICAgIHRoaXMuX3Jlc2V0U3ViKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHByZXMud2hhdCA9PSAndXBkJyAmJiBwcmVzLnNyYyA9PSBDb25zdC5UT1BJQ19NRSkge1xuICAgICAgLy8gVXBkYXRlIHRvIG1lJ3MgZGVzY3JpcHRpb24uIFJlcXVlc3QgdXBkYXRlZCB2YWx1ZS5cbiAgICAgIHRoaXMuZ2V0TWV0YSh0aGlzLnN0YXJ0TWV0YVF1ZXJ5KCkud2l0aERlc2MoKS5idWlsZCgpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBjb250ID0gdGhpcy5fdGlub2RlLmNhY2hlR2V0VG9waWMocHJlcy5zcmMpO1xuICAgIGlmIChjb250KSB7XG4gICAgICBzd2l0Y2ggKHByZXMud2hhdCkge1xuICAgICAgICBjYXNlICdvbic6IC8vIHRvcGljIGNhbWUgb25saW5lXG4gICAgICAgICAgY29udC5vbmxpbmUgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdvZmYnOiAvLyB0b3BpYyB3ZW50IG9mZmxpbmVcbiAgICAgICAgICBpZiAoY29udC5vbmxpbmUpIHtcbiAgICAgICAgICAgIGNvbnQub25saW5lID0gZmFsc2U7XG4gICAgICAgICAgICBjb250LnNlZW4gPSBPYmplY3QuYXNzaWduKGNvbnQuc2VlbiB8fCB7fSwge1xuICAgICAgICAgICAgICB3aGVuOiBuZXcgRGF0ZSgpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ21zZyc6IC8vIG5ldyBtZXNzYWdlIHJlY2VpdmVkXG4gICAgICAgICAgY29udC5fdXBkYXRlUmVjZWl2ZWQocHJlcy5zZXEsIHByZXMuYWN0KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAndXBkJzogLy8gZGVzYyB1cGRhdGVkXG4gICAgICAgICAgLy8gUmVxdWVzdCB1cGRhdGVkIHN1YnNjcmlwdGlvbi5cbiAgICAgICAgICB0aGlzLmdldE1ldGEodGhpcy5zdGFydE1ldGFRdWVyeSgpLndpdGhMYXRlck9uZVN1YihwcmVzLnNyYykuYnVpbGQoKSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2Fjcyc6IC8vIGFjY2VzcyBtb2RlIGNoYW5nZWRcbiAgICAgICAgICBpZiAoY29udC5hY3MpIHtcbiAgICAgICAgICAgIGNvbnQuYWNzLnVwZGF0ZUFsbChwcmVzLmRhY3MpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb250LmFjcyA9IG5ldyBBY2Nlc3NNb2RlKCkudXBkYXRlQWxsKHByZXMuZGFjcyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnQudG91Y2hlZCA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3VhJzpcbiAgICAgICAgICAvLyB1c2VyIGFnZW50IGNoYW5nZWQuXG4gICAgICAgICAgY29udC5zZWVuID0ge1xuICAgICAgICAgICAgd2hlbjogbmV3IERhdGUoKSxcbiAgICAgICAgICAgIHVhOiBwcmVzLnVhXG4gICAgICAgICAgfTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAncmVjdic6XG4gICAgICAgICAgLy8gdXNlcidzIG90aGVyIHNlc3Npb24gbWFya2VkIHNvbWUgbWVzc2dlcyBhcyByZWNlaXZlZC5cbiAgICAgICAgICBwcmVzLnNlcSA9IHByZXMuc2VxIHwgMDtcbiAgICAgICAgICBjb250LnJlY3YgPSBjb250LnJlY3YgPyBNYXRoLm1heChjb250LnJlY3YsIHByZXMuc2VxKSA6IHByZXMuc2VxO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdyZWFkJzpcbiAgICAgICAgICAvLyB1c2VyJ3Mgb3RoZXIgc2Vzc2lvbiBtYXJrZWQgc29tZSBtZXNzYWdlcyBhcyByZWFkLlxuICAgICAgICAgIHByZXMuc2VxID0gcHJlcy5zZXEgfCAwO1xuICAgICAgICAgIGNvbnQucmVhZCA9IGNvbnQucmVhZCA/IE1hdGgubWF4KGNvbnQucmVhZCwgcHJlcy5zZXEpIDogcHJlcy5zZXE7XG4gICAgICAgICAgY29udC5yZWN2ID0gY29udC5yZWN2ID8gTWF0aC5tYXgoY29udC5yZWFkLCBjb250LnJlY3YpIDogY29udC5yZWN2O1xuICAgICAgICAgIGNvbnQudW5yZWFkID0gY29udC5zZXEgLSBjb250LnJlYWQ7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2dvbmUnOlxuICAgICAgICAgIC8vIHRvcGljIGRlbGV0ZWQgb3IgdW5zdWJzY3JpYmVkIGZyb20uXG4gICAgICAgICAgaWYgKCFjb250Ll9kZWxldGVkKSB7XG4gICAgICAgICAgICBjb250Ll9kZWxldGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbnQuX2F0dGFjaGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLl90aW5vZGUuX2RiLm1hcmtUb3BpY0FzRGVsZXRlZChwcmVzLnNyYyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3Rpbm9kZS5fZGIucmVtVG9waWMocHJlcy5zcmMpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnZGVsJzpcbiAgICAgICAgICAvLyBVcGRhdGUgdG9waWMuZGVsIHZhbHVlLlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRoaXMuX3Rpbm9kZS5sb2dnZXIoXCJJTkZPOiBVbnN1cHBvcnRlZCBwcmVzZW5jZSB1cGRhdGUgaW4gJ21lJ1wiLCBwcmVzLndoYXQpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9yZWZyZXNoQ29udGFjdChwcmVzLndoYXQsIGNvbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocHJlcy53aGF0ID09ICdhY3MnKSB7XG4gICAgICAgIC8vIE5ldyBzdWJzY3JpcHRpb25zIGFuZCBkZWxldGVkL2Jhbm5lZCBzdWJzY3JpcHRpb25zIGhhdmUgZnVsbFxuICAgICAgICAvLyBhY2Nlc3MgbW9kZSAobm8gKyBvciAtIGluIHRoZSBkYWNzIHN0cmluZykuIENoYW5nZXMgdG8ga25vd24gc3Vic2NyaXB0aW9ucyBhcmUgc2VudCBhc1xuICAgICAgICAvLyBkZWx0YXMsIGJ1dCB0aGV5IHNob3VsZCBub3QgaGFwcGVuIGhlcmUuXG4gICAgICAgIGNvbnN0IGFjcyA9IG5ldyBBY2Nlc3NNb2RlKHByZXMuZGFjcyk7XG4gICAgICAgIGlmICghYWNzIHx8IGFjcy5tb2RlID09IEFjY2Vzc01vZGUuX0lOVkFMSUQpIHtcbiAgICAgICAgICB0aGlzLl90aW5vZGUubG9nZ2VyKFwiRVJST1I6IEludmFsaWQgYWNjZXNzIG1vZGUgdXBkYXRlXCIsIHByZXMuc3JjLCBwcmVzLmRhY3MpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIGlmIChhY3MubW9kZSA9PSBBY2Nlc3NNb2RlLl9OT05FKSB7XG4gICAgICAgICAgdGhpcy5fdGlub2RlLmxvZ2dlcihcIldBUk5JTkc6IFJlbW92aW5nIG5vbi1leGlzdGVudCBzdWJzY3JpcHRpb25cIiwgcHJlcy5zcmMsIHByZXMuZGFjcyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIE5ldyBzdWJzY3JpcHRpb24uIFNlbmQgcmVxdWVzdCBmb3IgdGhlIGZ1bGwgZGVzY3JpcHRpb24uXG4gICAgICAgICAgLy8gVXNpbmcgLndpdGhPbmVTdWIgKG5vdCAud2l0aExhdGVyT25lU3ViKSB0byBtYWtlIHN1cmUgSWZNb2RpZmllZFNpbmNlIGlzIG5vdCBzZXQuXG4gICAgICAgICAgdGhpcy5nZXRNZXRhKHRoaXMuc3RhcnRNZXRhUXVlcnkoKS53aXRoT25lU3ViKHVuZGVmaW5lZCwgcHJlcy5zcmMpLmJ1aWxkKCkpO1xuICAgICAgICAgIC8vIENyZWF0ZSBhIGR1bW15IGVudHJ5IHRvIGNhdGNoIG9ubGluZSBzdGF0dXMgdXBkYXRlLlxuICAgICAgICAgIGNvbnN0IGR1bW15ID0gdGhpcy5fdGlub2RlLmdldFRvcGljKHByZXMuc3JjKTtcbiAgICAgICAgICBkdW1teS50b3BpYyA9IHByZXMuc3JjO1xuICAgICAgICAgIGR1bW15Lm9ubGluZSA9IGZhbHNlO1xuICAgICAgICAgIGR1bW15LmFjcyA9IGFjcztcbiAgICAgICAgICB0aGlzLl90aW5vZGUuX2RiLnVwZFRvcGljKGR1bW15KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChwcmVzLndoYXQgPT0gJ3RhZ3MnKSB7XG4gICAgICAgIHRoaXMuZ2V0TWV0YSh0aGlzLnN0YXJ0TWV0YVF1ZXJ5KCkud2l0aFRhZ3MoKS5idWlsZCgpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5vblByZXMpIHtcbiAgICAgIHRoaXMub25QcmVzKHByZXMpO1xuICAgIH1cbiAgfVxuXG4gIC8vIENvbnRhY3QgaXMgdXBkYXRlZCwgZXhlY3V0ZSBjYWxsYmFja3MuXG4gIF9yZWZyZXNoQ29udGFjdCh3aGF0LCBjb250KSB7XG4gICAgaWYgKHRoaXMub25Db250YWN0VXBkYXRlKSB7XG4gICAgICB0aGlzLm9uQ29udGFjdFVwZGF0ZSh3aGF0LCBjb250KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUHVibGlzaGluZyB0byBUb3BpY01lIGlzIG5vdCBzdXBwb3J0ZWQuIHtAbGluayBUb3BpYyNwdWJsaXNofSBpcyBvdmVycmlkZW4gYW5kIHRob3dzIGFuIHtFcnJvcn0gaWYgY2FsbGVkLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljTWUjXG4gICAqIEB0aHJvd3Mge0Vycm9yfSBBbHdheXMgdGhyb3dzIGFuIGVycm9yLlxuICAgKi9cbiAgcHVibGlzaCgpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiUHVibGlzaGluZyB0byAnbWUnIGlzIG5vdCBzdXBwb3J0ZWRcIikpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlbGV0ZSB2YWxpZGF0aW9uIGNyZWRlbnRpYWwuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWNNZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gZGVsZXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1c2VyIC0gVXNlciBJRCB0byByZW1vdmUuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIGRlbENyZWRlbnRpYWwobWV0aG9kLCB2YWx1ZSkge1xuICAgIGlmICghdGhpcy5fYXR0YWNoZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJDYW5ub3QgZGVsZXRlIGNyZWRlbnRpYWwgaW4gaW5hY3RpdmUgJ21lJyB0b3BpY1wiKSk7XG4gICAgfVxuICAgIC8vIFNlbmQge2RlbH0gbWVzc2FnZSwgcmV0dXJuIHByb21pc2VcbiAgICByZXR1cm4gdGhpcy5fdGlub2RlLmRlbENyZWRlbnRpYWwobWV0aG9kLCB2YWx1ZSkudGhlbihjdHJsID0+IHtcbiAgICAgIC8vIFJlbW92ZSBkZWxldGVkIGNyZWRlbnRpYWwgZnJvbSB0aGUgY2FjaGUuXG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMuX2NyZWRlbnRpYWxzLmZpbmRJbmRleCgoZWwpID0+IHtcbiAgICAgICAgcmV0dXJuIGVsLm1ldGggPT0gbWV0aG9kICYmIGVsLnZhbCA9PSB2YWx1ZTtcbiAgICAgIH0pO1xuICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgdGhpcy5fY3JlZGVudGlhbHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIH1cbiAgICAgIC8vIE5vdGlmeSBsaXN0ZW5lcnNcbiAgICAgIGlmICh0aGlzLm9uQ3JlZHNVcGRhdGVkKSB7XG4gICAgICAgIHRoaXMub25DcmVkc1VwZGF0ZWQodGhpcy5fY3JlZGVudGlhbHMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGN0cmw7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQGNhbGxiYWNrIGNvbnRhY3RGaWx0ZXJcbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRhY3QgdG8gY2hlY2sgZm9yIGluY2x1c2lvbi5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIGNvbnRhY3Qgc2hvdWxkIGJlIHByb2Nlc3NlZCwgPGNvZGU+ZmFsc2U8L2NvZGU+IHRvIGV4Y2x1ZGUgaXQuXG4gICAqL1xuICAvKipcbiAgICogSXRlcmF0ZSBvdmVyIGNhY2hlZCBjb250YWN0cy5cbiAgICpcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWNNZSNcbiAgICogQHBhcmFtIHtUb3BpY01lLkNvbnRhY3RDYWxsYmFja30gY2FsbGJhY2sgLSBDYWxsYmFjayB0byBjYWxsIGZvciBlYWNoIGNvbnRhY3QuXG4gICAqIEBwYXJhbSB7Y29udGFjdEZpbHRlcj19IGZpbHRlciAtIE9wdGlvbmFsbHkgZmlsdGVyIGNvbnRhY3RzOyBpbmNsdWRlIGFsbCBpZiBmaWx0ZXIgaXMgZmFsc2UtaXNoLCBvdGhlcndpc2VcbiAgICogICAgICBpbmNsdWRlIHRob3NlIGZvciB3aGljaCBmaWx0ZXIgcmV0dXJucyB0cnVlLWlzaC5cbiAgICogQHBhcmFtIHtPYmplY3Q9fSBjb250ZXh0IC0gQ29udGV4dCB0byB1c2UgZm9yIGNhbGxpbmcgdGhlIGBjYWxsYmFja2AsIGkuZS4gdGhlIHZhbHVlIG9mIGB0aGlzYCBpbnNpZGUgdGhlIGNhbGxiYWNrLlxuICAgKi9cbiAgY29udGFjdHMoY2FsbGJhY2ssIGZpbHRlciwgY29udGV4dCkge1xuICAgIHRoaXMuX3Rpbm9kZS5tYXBUb3BpY3MoKGMsIGlkeCkgPT4ge1xuICAgICAgaWYgKGMuaXNDb21tVHlwZSgpICYmICghZmlsdGVyIHx8IGZpbHRlcihjKSkpIHtcbiAgICAgICAgY2FsbGJhY2suY2FsbChjb250ZXh0LCBjLCBpZHgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhIGNvbnRhY3QgZnJvbSBjYWNoZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpY01lI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIGNvbnRhY3QgdG8gZ2V0LCBlaXRoZXIgYSBVSUQgKGZvciBwMnAgdG9waWNzKSBvciBhIHRvcGljIG5hbWUuXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuQ29udGFjdH0gLSBDb250YWN0IG9yIGB1bmRlZmluZWRgLlxuICAgKi9cbiAgZ2V0Q29udGFjdChuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Rpbm9kZS5jYWNoZUdldFRvcGljKG5hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhY2Nlc3MgbW9kZSBvZiBhIGdpdmVuIGNvbnRhY3QgZnJvbSBjYWNoZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpY01lI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIGNvbnRhY3QgdG8gZ2V0IGFjY2VzcyBtb2RlIGZvciwgZWl0aGVyIGEgVUlEIChmb3IgcDJwIHRvcGljcylcbiAgICogICAgICAgIG9yIGEgdG9waWMgbmFtZTsgaWYgbWlzc2luZywgYWNjZXNzIG1vZGUgZm9yIHRoZSAnbWUnIHRvcGljIGl0c2VsZi5cbiAgICogQHJldHVybnMge3N0cmluZ30gLSBhY2Nlc3MgbW9kZSwgc3VjaCBhcyBgUldQYC5cbiAgICovXG4gIGdldEFjY2Vzc01vZGUobmFtZSkge1xuICAgIGlmIChuYW1lKSB7XG4gICAgICBjb25zdCBjb250ID0gdGhpcy5fdGlub2RlLmNhY2hlR2V0VG9waWMobmFtZSk7XG4gICAgICByZXR1cm4gY29udCA/IGNvbnQuYWNzIDogbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuYWNzO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGNvbnRhY3QgaXMgYXJjaGl2ZWQsIGkuZS4gY29udGFjdC5wcml2YXRlLmFyY2ggPT0gdHJ1ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpY01lI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIGNvbnRhY3QgdG8gY2hlY2sgYXJjaGl2ZWQgc3RhdHVzLCBlaXRoZXIgYSBVSUQgKGZvciBwMnAgdG9waWNzKSBvciBhIHRvcGljIG5hbWUuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIHRydWUgaWYgY29udGFjdCBpcyBhcmNoaXZlZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNBcmNoaXZlZChuYW1lKSB7XG4gICAgY29uc3QgY29udCA9IHRoaXMuX3Rpbm9kZS5jYWNoZUdldFRvcGljKG5hbWUpO1xuICAgIHJldHVybiBjb250ICYmIGNvbnQucHJpdmF0ZSAmJiAhIWNvbnQucHJpdmF0ZS5hcmNoO1xuICB9XG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIFRpbm9kZS5DcmVkZW50aWFsXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHR5cGUgT2JqZWN0XG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBtZXRoIC0gdmFsaWRhdGlvbiBtZXRob2Qgc3VjaCBhcyAnZW1haWwnIG9yICd0ZWwnLlxuICAgKiBAcHJvcGVydHkge3N0cmluZ30gdmFsIC0gY3JlZGVudGlhbCB2YWx1ZSwgaS5lLiAnamRvZUBleGFtcGxlLmNvbScgb3IgJysxNzAyNTU1MTIzNCdcbiAgICogQHByb3BlcnR5IHtib29sZWFufSBkb25lIC0gdHJ1ZSBpZiBjcmVkZW50aWFsIGlzIHZhbGlkYXRlZC5cbiAgICovXG4gIC8qKlxuICAgKiBHZXQgdGhlIHVzZXIncyBjcmVkZW50aWFsczogZW1haWwsIHBob25lLCBldGMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWNNZSNcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5DcmVkZW50aWFsW119IC0gYXJyYXkgb2YgY3JlZGVudGlhbHMuXG4gICAqL1xuICBnZXRDcmVkZW50aWFscygpIHtcbiAgICByZXR1cm4gdGhpcy5fY3JlZGVudGlhbHM7XG4gIH1cbn1cblxuLyoqXG4gKiBAY2xhc3MgVG9waWNGbmQgLSBzcGVjaWFsIGNhc2Ugb2Yge0BsaW5rIFRpbm9kZS5Ub3BpY30gZm9yIHNlYXJjaGluZyBmb3JcbiAqIGNvbnRhY3RzIGFuZCBncm91cCB0b3BpY3MuXG4gKiBAZXh0ZW5kcyBUaW5vZGUuVG9waWNcbiAqIEBtZW1iZXJvZiBUaW5vZGVcbiAqXG4gKiBAcGFyYW0ge1RvcGljRm5kLkNhbGxiYWNrc30gY2FsbGJhY2tzIC0gQ2FsbGJhY2tzIHRvIHJlY2VpdmUgdmFyaW91cyBldmVudHMuXG4gKi9cbmV4cG9ydCBjbGFzcyBUb3BpY0ZuZCBleHRlbmRzIFRvcGljIHtcbiAgLy8gTGlzdCBvZiB1c2VycyBhbmQgdG9waWNzIHVpZCBvciB0b3BpY19uYW1lIC0+IENvbnRhY3Qgb2JqZWN0KVxuICBfY29udGFjdHMgPSB7fTtcblxuICBjb25zdHJ1Y3RvcihjYWxsYmFja3MpIHtcbiAgICBzdXBlcihDb25zdC5UT1BJQ19GTkQsIGNhbGxiYWNrcyk7XG4gIH1cblxuICAvLyBPdmVycmlkZSB0aGUgb3JpZ2luYWwgVG9waWMuX3Byb2Nlc3NNZXRhU3ViXG4gIF9wcm9jZXNzTWV0YVN1YihzdWJzKSB7XG4gICAgbGV0IHVwZGF0ZUNvdW50ID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGhpcy5fY29udGFjdHMpLmxlbmd0aDtcbiAgICAvLyBSZXNldCBjb250YWN0IGxpc3QuXG4gICAgdGhpcy5fY29udGFjdHMgPSB7fTtcbiAgICBmb3IgKGxldCBpZHggaW4gc3Vicykge1xuICAgICAgbGV0IHN1YiA9IHN1YnNbaWR4XTtcbiAgICAgIGNvbnN0IGluZGV4QnkgPSBzdWIudG9waWMgPyBzdWIudG9waWMgOiBzdWIudXNlcjtcblxuICAgICAgc3ViID0gbWVyZ2VUb0NhY2hlKHRoaXMuX2NvbnRhY3RzLCBpbmRleEJ5LCBzdWIpO1xuICAgICAgdXBkYXRlQ291bnQrKztcblxuICAgICAgaWYgKHRoaXMub25NZXRhU3ViKSB7XG4gICAgICAgIHRoaXMub25NZXRhU3ViKHN1Yik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHVwZGF0ZUNvdW50ID4gMCAmJiB0aGlzLm9uU3Vic1VwZGF0ZWQpIHtcbiAgICAgIHRoaXMub25TdWJzVXBkYXRlZChPYmplY3Qua2V5cyh0aGlzLl9jb250YWN0cykpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQdWJsaXNoaW5nIHRvIFRvcGljRm5kIGlzIG5vdCBzdXBwb3J0ZWQuIHtAbGluayBUb3BpYyNwdWJsaXNofSBpcyBvdmVycmlkZW4gYW5kIHRob3dzIGFuIHtFcnJvcn0gaWYgY2FsbGVkLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljRm5kI1xuICAgKiBAdGhyb3dzIHtFcnJvcn0gQWx3YXlzIHRocm93cyBhbiBlcnJvci5cbiAgICovXG4gIHB1Ymxpc2goKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIlB1Ymxpc2hpbmcgdG8gJ2ZuZCcgaXMgbm90IHN1cHBvcnRlZFwiKSk7XG4gIH1cblxuICAvKipcbiAgICogc2V0TWV0YSB0byBUb3BpY0ZuZCByZXNldHMgY29udGFjdCBsaXN0IGluIGFkZGl0aW9uIHRvIHNlbmRpbmcgdGhlIG1lc3NhZ2UuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWNGbmQjXG4gICAqIEBwYXJhbSB7VGlub2RlLlNldFBhcmFtc30gcGFyYW1zIHBhcmFtZXRlcnMgdG8gdXBkYXRlLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gcmVxdWVzdC5cbiAgICovXG4gIHNldE1ldGEocGFyYW1zKSB7XG4gICAgcmV0dXJuIE9iamVjdC5nZXRQcm90b3R5cGVPZihUb3BpY0ZuZC5wcm90b3R5cGUpLnNldE1ldGEuY2FsbCh0aGlzLCBwYXJhbXMpLnRoZW4oXyA9PiB7XG4gICAgICBpZiAoT2JqZWN0LmtleXModGhpcy5fY29udGFjdHMpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGhpcy5fY29udGFjdHMgPSB7fTtcbiAgICAgICAgaWYgKHRoaXMub25TdWJzVXBkYXRlZCkge1xuICAgICAgICAgIHRoaXMub25TdWJzVXBkYXRlZChbXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJdGVyYXRlIG92ZXIgZm91bmQgY29udGFjdHMuIElmIGNhbGxiYWNrIGlzIHVuZGVmaW5lZCwgdXNlIHtAbGluayB0aGlzLm9uTWV0YVN1Yn0uXG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljRm5kI1xuICAgKiBAcGFyYW0ge1RvcGljRm5kLkNvbnRhY3RDYWxsYmFja30gY2FsbGJhY2sgLSBDYWxsYmFjayB0byBjYWxsIGZvciBlYWNoIGNvbnRhY3QuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gQ29udGV4dCB0byB1c2UgZm9yIGNhbGxpbmcgdGhlIGBjYWxsYmFja2AsIGkuZS4gdGhlIHZhbHVlIG9mIGB0aGlzYCBpbnNpZGUgdGhlIGNhbGxiYWNrLlxuICAgKi9cbiAgY29udGFjdHMoY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICBjb25zdCBjYiA9IChjYWxsYmFjayB8fCB0aGlzLm9uTWV0YVN1Yik7XG4gICAgaWYgKGNiKSB7XG4gICAgICBmb3IgKGxldCBpZHggaW4gdGhpcy5fY29udGFjdHMpIHtcbiAgICAgICAgY2IuY2FsbChjb250ZXh0LCB0aGlzLl9jb250YWN0c1tpZHhdLCBpZHgsIHRoaXMuX2NvbnRhY3RzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiIsIi8qKlxuICogQGZpbGUgVXRpbGl0aWVzIHVzZWQgaW4gbXVsdGlwbGUgcGxhY2VzLlxuICpcbiAqIEBjb3B5cmlnaHQgMjAxNS0yMDIyIFRpbm9kZSBMTEMuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IEFjY2Vzc01vZGUgZnJvbSAnLi9hY2Nlc3MtbW9kZS5qcyc7XG5pbXBvcnQge1xuICBERUxfQ0hBUlxufSBmcm9tICcuL2NvbmZpZy5qcyc7XG5cbi8vIEF0dGVtcHQgdG8gY29udmVydCBkYXRlIGFuZCBBY2Nlc3NNb2RlIHN0cmluZ3MgdG8gb2JqZWN0cy5cbmV4cG9ydCBmdW5jdGlvbiBqc29uUGFyc2VIZWxwZXIoa2V5LCB2YWwpIHtcbiAgLy8gVHJ5IHRvIGNvbnZlcnQgc3RyaW5nIHRpbWVzdGFtcHMgd2l0aCBvcHRpb25hbCBtaWxsaXNlY29uZHMgdG8gRGF0ZSxcbiAgLy8gZS5nLiAyMDE1LTA5LTAyVDAxOjQ1OjQzWy4xMjNdWlxuICBpZiAodHlwZW9mIHZhbCA9PSAnc3RyaW5nJyAmJiB2YWwubGVuZ3RoID49IDIwICYmIHZhbC5sZW5ndGggPD0gMjQgJiYgWyd0cycsICd0b3VjaGVkJywgJ3VwZGF0ZWQnLCAnY3JlYXRlZCcsICd3aGVuJywgJ2RlbGV0ZWQnLCAnZXhwaXJlcyddLmluY2x1ZGVzKGtleSkpIHtcbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUodmFsKTtcbiAgICBpZiAoIWlzTmFOKGRhdGUpKSB7XG4gICAgICByZXR1cm4gZGF0ZTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoa2V5ID09PSAnYWNzJyAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBuZXcgQWNjZXNzTW9kZSh2YWwpO1xuICB9XG4gIHJldHVybiB2YWw7XG59XG5cbi8vIENoZWNrcyBpZiBVUkwgaXMgYSByZWxhdGl2ZSB1cmwsIGkuZS4gaGFzIG5vICdzY2hlbWU6Ly8nLCBpbmNsdWRpbmcgdGhlIGNhc2Ugb2YgbWlzc2luZyBzY2hlbWUgJy8vJy5cbi8vIFRoZSBzY2hlbWUgaXMgZXhwZWN0ZWQgdG8gYmUgUkZDLWNvbXBsaWFudCwgZS5nLiBbYS16XVthLXowLTkrLi1dKlxuLy8gZXhhbXBsZS5odG1sIC0gb2tcbi8vIGh0dHBzOmV4YW1wbGUuY29tIC0gbm90IG9rLlxuLy8gaHR0cDovZXhhbXBsZS5jb20gLSBub3Qgb2suXG4vLyAnIOKGsiBodHRwczovL2V4YW1wbGUuY29tJyAtIG5vdCBvay4gKOKGsiBtZWFucyBjYXJyaWFnZSByZXR1cm4pXG5leHBvcnQgZnVuY3Rpb24gaXNVcmxSZWxhdGl2ZSh1cmwpIHtcbiAgcmV0dXJuIHVybCAmJiAhL15cXHMqKFthLXpdW2EtejAtOSsuLV0qOnxcXC9cXC8pL2ltLnRlc3QodXJsKTtcbn1cblxuZnVuY3Rpb24gaXNWYWxpZERhdGUoZCkge1xuICByZXR1cm4gKGQgaW5zdGFuY2VvZiBEYXRlKSAmJiAhaXNOYU4oZCkgJiYgKGQuZ2V0VGltZSgpICE9IDApO1xufVxuXG4vLyBSRkMzMzM5IGZvcm1hdGVyIG9mIERhdGVcbmV4cG9ydCBmdW5jdGlvbiByZmMzMzM5RGF0ZVN0cmluZyhkKSB7XG4gIGlmICghaXNWYWxpZERhdGUoZCkpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgY29uc3QgcGFkID0gZnVuY3Rpb24odmFsLCBzcCkge1xuICAgIHNwID0gc3AgfHwgMjtcbiAgICByZXR1cm4gJzAnLnJlcGVhdChzcCAtICgnJyArIHZhbCkubGVuZ3RoKSArIHZhbDtcbiAgfTtcblxuICBjb25zdCBtaWxsaXMgPSBkLmdldFVUQ01pbGxpc2Vjb25kcygpO1xuICByZXR1cm4gZC5nZXRVVENGdWxsWWVhcigpICsgJy0nICsgcGFkKGQuZ2V0VVRDTW9udGgoKSArIDEpICsgJy0nICsgcGFkKGQuZ2V0VVRDRGF0ZSgpKSArXG4gICAgJ1QnICsgcGFkKGQuZ2V0VVRDSG91cnMoKSkgKyAnOicgKyBwYWQoZC5nZXRVVENNaW51dGVzKCkpICsgJzonICsgcGFkKGQuZ2V0VVRDU2Vjb25kcygpKSArXG4gICAgKG1pbGxpcyA/ICcuJyArIHBhZChtaWxsaXMsIDMpIDogJycpICsgJ1onO1xufVxuXG4vLyBSZWN1cnNpdmVseSBtZXJnZSBzcmMncyBvd24gcHJvcGVydGllcyB0byBkc3QuXG4vLyBJZ25vcmUgcHJvcGVydGllcyB3aGVyZSBpZ25vcmVbcHJvcGVydHldIGlzIHRydWUuXG4vLyBBcnJheSBhbmQgRGF0ZSBvYmplY3RzIGFyZSBzaGFsbG93LWNvcGllZC5cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZU9iaihkc3QsIHNyYywgaWdub3JlKSB7XG4gIGlmICh0eXBlb2Ygc3JjICE9ICdvYmplY3QnKSB7XG4gICAgaWYgKHNyYyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gZHN0O1xuICAgIH1cbiAgICBpZiAoc3JjID09PSBERUxfQ0hBUikge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIHNyYztcbiAgfVxuICAvLyBKUyBpcyBjcmF6eTogdHlwZW9mIG51bGwgaXMgJ29iamVjdCcuXG4gIGlmIChzcmMgPT09IG51bGwpIHtcbiAgICByZXR1cm4gc3JjO1xuICB9XG5cbiAgLy8gSGFuZGxlIERhdGVcbiAgaWYgKHNyYyBpbnN0YW5jZW9mIERhdGUgJiYgIWlzTmFOKHNyYykpIHtcbiAgICByZXR1cm4gKCFkc3QgfHwgIShkc3QgaW5zdGFuY2VvZiBEYXRlKSB8fCBpc05hTihkc3QpIHx8IGRzdCA8IHNyYykgPyBzcmMgOiBkc3Q7XG4gIH1cblxuICAvLyBBY2Nlc3MgbW9kZVxuICBpZiAoc3JjIGluc3RhbmNlb2YgQWNjZXNzTW9kZSkge1xuICAgIHJldHVybiBuZXcgQWNjZXNzTW9kZShzcmMpO1xuICB9XG5cbiAgLy8gSGFuZGxlIEFycmF5XG4gIGlmIChzcmMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgIHJldHVybiBzcmM7XG4gIH1cblxuICBpZiAoIWRzdCB8fCBkc3QgPT09IERFTF9DSEFSKSB7XG4gICAgZHN0ID0gc3JjLmNvbnN0cnVjdG9yKCk7XG4gIH1cblxuICBmb3IgKGxldCBwcm9wIGluIHNyYykge1xuICAgIGlmIChzcmMuaGFzT3duUHJvcGVydHkocHJvcCkgJiYgKCFpZ25vcmUgfHwgIWlnbm9yZVtwcm9wXSkgJiYgKHByb3AgIT0gJ19ub0ZvcndhcmRpbmcnKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgZHN0W3Byb3BdID0gbWVyZ2VPYmooZHN0W3Byb3BdLCBzcmNbcHJvcF0pO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIC8vIEZJWE1FOiBwcm9iYWJseSBuZWVkIHRvIGxvZyBzb21ldGhpbmcgaGVyZS5cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRzdDtcbn1cblxuLy8gVXBkYXRlIG9iamVjdCBzdG9yZWQgaW4gYSBjYWNoZS4gUmV0dXJucyB1cGRhdGVkIHZhbHVlLlxuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlVG9DYWNoZShjYWNoZSwga2V5LCBuZXd2YWwsIGlnbm9yZSkge1xuICBjYWNoZVtrZXldID0gbWVyZ2VPYmooY2FjaGVba2V5XSwgbmV3dmFsLCBpZ25vcmUpO1xuICByZXR1cm4gY2FjaGVba2V5XTtcbn1cblxuLy8gU3RyaXBzIGFsbCB2YWx1ZXMgZnJvbSBhbiBvYmplY3Qgb2YgdGhleSBldmFsdWF0ZSB0byBmYWxzZSBvciBpZiB0aGVpciBuYW1lIHN0YXJ0cyB3aXRoICdfJy5cbi8vIFVzZWQgb24gYWxsIG91dGdvaW5nIG9iamVjdCBiZWZvcmUgc2VyaWFsaXphdGlvbiB0byBzdHJpbmcuXG5leHBvcnQgZnVuY3Rpb24gc2ltcGxpZnkob2JqKSB7XG4gIE9iamVjdC5rZXlzKG9iaikuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgaWYgKGtleVswXSA9PSAnXycpIHtcbiAgICAgIC8vIFN0cmlwIGZpZWxkcyBsaWtlIFwib2JqLl9rZXlcIi5cbiAgICAgIGRlbGV0ZSBvYmpba2V5XTtcbiAgICB9IGVsc2UgaWYgKCFvYmpba2V5XSkge1xuICAgICAgLy8gU3RyaXAgZmllbGRzIHdoaWNoIGV2YWx1YXRlIHRvIGZhbHNlLlxuICAgICAgZGVsZXRlIG9ialtrZXldO1xuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShvYmpba2V5XSkgJiYgb2JqW2tleV0ubGVuZ3RoID09IDApIHtcbiAgICAgIC8vIFN0cmlwIGVtcHR5IGFycmF5cy5cbiAgICAgIGRlbGV0ZSBvYmpba2V5XTtcbiAgICB9IGVsc2UgaWYgKCFvYmpba2V5XSkge1xuICAgICAgLy8gU3RyaXAgZmllbGRzIHdoaWNoIGV2YWx1YXRlIHRvIGZhbHNlLlxuICAgICAgZGVsZXRlIG9ialtrZXldO1xuICAgIH0gZWxzZSBpZiAob2JqW2tleV0gaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAvLyBTdHJpcCBpbnZhbGlkIG9yIHplcm8gZGF0ZS5cbiAgICAgIGlmICghaXNWYWxpZERhdGUob2JqW2tleV0pKSB7XG4gICAgICAgIGRlbGV0ZSBvYmpba2V5XTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBvYmpba2V5XSA9PSAnb2JqZWN0Jykge1xuICAgICAgc2ltcGxpZnkob2JqW2tleV0pO1xuICAgICAgLy8gU3RyaXAgZW1wdHkgb2JqZWN0cy5cbiAgICAgIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvYmpba2V5XSkubGVuZ3RoID09IDApIHtcbiAgICAgICAgZGVsZXRlIG9ialtrZXldO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvYmo7XG59O1xuXG5cbi8vIFRyaW0gd2hpdGVzcGFjZSwgc3RyaXAgZW1wdHkgYW5kIGR1cGxpY2F0ZSBlbGVtZW50cyBlbGVtZW50cy5cbi8vIElmIHRoZSByZXN1bHQgaXMgYW4gZW1wdHkgYXJyYXksIGFkZCBhIHNpbmdsZSBlbGVtZW50IFwiXFx1MjQyMVwiIChVbmljb2RlIERlbCBjaGFyYWN0ZXIpLlxuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZUFycmF5KGFycikge1xuICBsZXQgb3V0ID0gW107XG4gIGlmIChBcnJheS5pc0FycmF5KGFycikpIHtcbiAgICAvLyBUcmltLCB0aHJvdyBhd2F5IHZlcnkgc2hvcnQgYW5kIGVtcHR5IHRhZ3MuXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSBhcnIubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBsZXQgdCA9IGFycltpXTtcbiAgICAgIGlmICh0KSB7XG4gICAgICAgIHQgPSB0LnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBpZiAodC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgb3V0LnB1c2godCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgb3V0LnNvcnQoKS5maWx0ZXIoZnVuY3Rpb24oaXRlbSwgcG9zLCBhcnkpIHtcbiAgICAgIHJldHVybiAhcG9zIHx8IGl0ZW0gIT0gYXJ5W3BvcyAtIDFdO1xuICAgIH0pO1xuICB9XG4gIGlmIChvdXQubGVuZ3RoID09IDApIHtcbiAgICAvLyBBZGQgc2luZ2xlIHRhZyB3aXRoIGEgVW5pY29kZSBEZWwgY2hhcmFjdGVyLCBvdGhlcndpc2UgYW4gYW1wdHkgYXJyYXlcbiAgICAvLyBpcyBhbWJpZ3Vvcy4gVGhlIERlbCB0YWcgd2lsbCBiZSBzdHJpcHBlZCBieSB0aGUgc2VydmVyLlxuICAgIG91dC5wdXNoKERFTF9DSEFSKTtcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuIiwibW9kdWxlLmV4cG9ydHM9e1widmVyc2lvblwiOiBcIjAuMjEuMC1yYzJcIn1cbiJdfQ==

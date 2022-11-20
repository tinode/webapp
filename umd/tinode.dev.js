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
        prom.catch(_ => {
        });
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

const INLINE_STYLES = [
{
  name: 'ST',
  start: /(?:^|[\W_])(\*)[^\s*]/,
  end: /[^\s*](\*)(?=$|[\W_])/
},
{
  name: 'EM',
  start: /(?:^|\W)(_)[^\s_]/,
  end: /[^\s_](_)(?=$|\W)/
},
{
  name: 'DL',
  start: /(?:^|[\W_])(~)[^\s~]/,
  end: /[^\s~](~)(?=$|[\W_])/
},
{
  name: 'CO',
  start: /(?:^|\W)(`)[^`]/,
  end: /[^`](`)(?=$|\W)/
}];

const FMT_WEIGHT = ['QQ'];

const ENTITY_TYPES = [
{
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
},
{
  name: 'MN',
  dataName: 'val',
  pack: function (val) {
    return {
      val: val.slice(1)
    };
  },
  re: /\B@([\p{L}\p{N}][._\p{L}\p{N}]*[\p{L}\p{N}])/ug
},
{
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
        let pres = !acs.mode || acs.mode == _accessMode.default._NONE ?
        {
          what: 'gone',
          src: data.topic
        } :
        {
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
    return newer ? this.seq > this._maxSeq :
    this._minSeq > 1 && !this._noEarlierMsgs;
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
      } catch (err) {
      }
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYWNjZXNzLW1vZGUuanMiLCJzcmMvY2J1ZmZlci5qcyIsInNyYy9jb25maWcuanMiLCJzcmMvY29ubmVjdGlvbi5qcyIsInNyYy9kYi5qcyIsInNyYy9kcmFmdHkuanMiLCJzcmMvbGFyZ2UtZmlsZS5qcyIsInNyYy9tZXRhLWJ1aWxkZXIuanMiLCJzcmMvdGlub2RlLmpzIiwic3JjL3RvcGljLmpzIiwic3JjL3V0aWxzLmpzIiwidmVyc2lvbi5qc29uIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0tBLFlBQVk7O0FBQUM7RUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQWNFLE1BQU0sVUFBVSxDQUFDO0VBQzlCLFdBQVcsQ0FBQyxHQUFHLEVBQUU7SUFDZixJQUFJLEdBQUcsRUFBRTtNQUNQLElBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxHQUFHLENBQUMsS0FBSyxJQUFJLFFBQVEsR0FBRyxHQUFHLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQztNQUNwRixJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sR0FBRyxDQUFDLElBQUksSUFBSSxRQUFRLEdBQUcsR0FBRyxDQUFDLElBQUksR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUM7TUFDaEYsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxHQUFJLE9BQU8sR0FBRyxDQUFDLElBQUksSUFBSSxRQUFRLEdBQUcsR0FBRyxDQUFDLElBQUksR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FDekYsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSztJQUM1QjtFQUNGO0VBaUJBLE9BQU8sTUFBTSxDQUFDLEdBQUcsRUFBRTtJQUNqQixJQUFJLENBQUMsR0FBRyxFQUFFO01B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YixHQUFHLEVBQUU7RUFDUCxDQUFDOztFQUdELElBQUksR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7SUFDbEIsTUFBTSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRztJQUN2QixNQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDO0lBRXhELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO01BQ25DLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7TUFDcEIsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQztNQUVwQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQztRQUNkLEVBQUUsRUFBRSxJQUFJO1FBQ1IsR0FBRyxFQUFFLENBQUM7UUFDTixFQUFFLEVBQUUsTUFBTSxHQUFHO01BQ2YsQ0FBQyxDQUFDO01BRUYsTUFBTSxDQUFDLEdBQUcsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUc7TUFDN0IsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFO1FBQ2IsTUFBTSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBRSxDQUFDLElBQUs7VUFDbEQsQ0FBQyxDQUFDLEVBQUUsSUFBSSxNQUFNO1VBQ2QsT0FBTyxDQUFDO1FBQ1YsQ0FBQyxDQUFDLENBQUM7TUFDTDtNQUNBLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRTtRQUNiLE1BQU0sQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFH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UixPQUFPO1FBQ0wsS0FBSyxFQUFFO1VBQ0wsSUFBSSxFQUFFLElBQUksQ0FBQyxlQUFlLEVBQUU7VUFDNUIsTUFBTSxFQUFFLElBQUk7VUFDWixRQUFRLEVBQUUsSUFBSTtVQUNkLFFBQVEsRUFBRSxJQUFJO1VBQ2QsT0FBTyxFQUFFLEtBQUs7VUFDZCxNQUFNLEVBQUUsSUFBSTtVQUNaLE1BQU0sRUFBRSxDQUFDLENBQUM7VUFDVixNQUFNLEVBQUUsQ0FBQztRQUNYO01BQ0YsQ0FBQztJQUVILEtBQUssT0FBTztNQUNWLE9BQU87UUFDTCxPQUFPLEVBQUU7VUFDUCxJQUFJLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRTtVQUM1QixRQUFRLEVBQUUsSUFBSTtVQUNkLFFBQVEsRUFBRTtRQUNaO01BQ0YsQ0FBQztJQUVILEtBQUssS0FBSztNQUNSLE9BQU87UUFDTCxLQUFLLEVBQUU7VUFDTCxJQUFJLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRTtVQUM1QixPQUFPLEVBQUUsS0FBSztVQUNkLEtBQUssRUFBRSxDQUFDLENBQUM7VUFDVCxLQUFLLEVBQUUsQ0FBQztRQUNWO01BQ0YsQ0FBQztJQUVILEtBQUssT0FBTztNQUNWLE9BQU87UUFDTCxPQUFPLEVBQUU7VUFDUCxJQUFJLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRTtVQUM1QixPQUFPLEVBQUUsS0FBSztVQUNkLE9BQU8sRUFBRTtRQUNYO01BQ0YsQ0FBQztJQUVILEtBQUssS0FBSztNQUNSLE9BQU87UUFDTCxLQUFLLEVBQUU7VUFDTCxJQUFJLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRTtVQUM1QixPQUFPLEVBQUUsS0FBSztVQUNkLFFBQVEsRUFBRSxLQUFLO1VBQ2YsTUFBTSxFQUFFLElBQUk7VUFDWixTQUFTLEVBQUUsQ0FBQztRQUNkO01BQ0YsQ0FBQztJQUVILEtBQUssS0FBSztNQUNSLE9BQU87UUFDTCxLQUFLLEVBQUU7VUFDTCxJQUFJLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRTtVQUM1QixPQUFPLEVBQUUsS0FBSztVQUNkLE1B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QjtJQUNGO0VBQ0YsQ0FBQyxDQUFDO0VBQ0YsT0FBTyxHQUFHO0FBQ1o7QUFBQzs7QUFLTSxTQUFTLGNBQWMsQ0FBQyxHQUFHLEVBQUU7RUFDbEMsSUFBSSxHQUFHLEdBQUcsRUFBRTtFQUNaLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtJQUV0QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO01BQzFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7TUFDZCxJQUFJLENBQUMsRUFBRTtRQUNMLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFO1FBQzFCLElBQUksQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7VUFDaEIsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDYjtNQUNGO0lBQ0Y7SUFDQSxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLFVBQVMsSUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUU7TUFDekMsT0FBTyxDQUFDLEdBQUcsSUFBSSxJQUFJLElBQUksR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7SUFDckMsQ0FBQyxDQUFDO0VBQ0o7RUFDQSxJQUFJLEdBQUcsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO0lBR25CLEdBQUcsQ0FBQyxJQUFJLENBQUMsZ0JBQVEsQ0FBQztFQUNwQjtFQUNBLE9BQU8sR0FBRztBQUNaOzs7QUM1S0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qKlxuICogQGZpbGUgQWNjZXNzIGNvbnRyb2wgbW9kZWwuXG4gKlxuICogQGNvcHlyaWdodCAyMDE1LTIwMjIgVGlub2RlIExMQy5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG4vLyBOT1RFIFRPIERFVkVMT1BFUlM6XG4vLyBMb2NhbGl6YWJsZSBzdHJpbmdzIHNob3VsZCBiZSBkb3VibGUgcXVvdGVkIFwi0YHRgtGA0L7QutCwINC90LAg0LTRgNGD0LPQvtC8INGP0LfRi9C60LVcIixcbi8vIG5vbi1sb2NhbGl6YWJsZSBzdHJpbmdzIHNob3VsZCBiZSBzaW5nbGUgcXVvdGVkICdub24tbG9jYWxpemVkJy5cblxuLyoqXG4gKiBIZWxwZXIgY2xhc3MgZm9yIGhhbmRsaW5nIGFjY2VzcyBtb2RlLlxuICpcbiAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gKiBAbWVtYmVyb2YgVGlub2RlXG4gKlxuICogQHBhcmFtIHtBY2Nlc3NNb2RlfE9iamVjdD19IGFjcyAtIEFjY2Vzc01vZGUgdG8gY29weSBvciBhY2Nlc3MgbW9kZSBvYmplY3QgcmVjZWl2ZWQgZnJvbSB0aGUgc2VydmVyLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBY2Nlc3NNb2RlIHtcbiAgY29uc3RydWN0b3IoYWNzKSB7XG4gICAgaWYgKGFjcykge1xuICAgICAgdGhpcy5naXZlbiA9IHR5cGVvZiBhY3MuZ2l2ZW4gPT0gJ251bWJlcicgPyBhY3MuZ2l2ZW4gOiBBY2Nlc3NNb2RlLmRlY29kZShhY3MuZ2l2ZW4pO1xuICAgICAgdGhpcy53YW50ID0gdHlwZW9mIGFjcy53YW50ID09ICdudW1iZXInID8gYWNzLndhbnQgOiBBY2Nlc3NNb2RlLmRlY29kZShhY3Mud2FudCk7XG4gICAgICB0aGlzLm1vZGUgPSBhY3MubW9kZSA/ICh0eXBlb2YgYWNzLm1vZGUgPT0gJ251bWJlcicgPyBhY3MubW9kZSA6IEFjY2Vzc01vZGUuZGVjb2RlKGFjcy5tb2RlKSkgOlxuICAgICAgICAodGhpcy5naXZlbiAmIHRoaXMud2FudCk7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljICNjaGVja0ZsYWcodmFsLCBzaWRlLCBmbGFnKSB7XG4gICAgc2lkZSA9IHNpZGUgfHwgJ21vZGUnO1xuICAgIGlmIChbJ2dpdmVuJywgJ3dhbnQnLCAnbW9kZSddLmluY2x1ZGVzKHNpZGUpKSB7XG4gICAgICByZXR1cm4gKCh2YWxbc2lkZV0gJiBmbGFnKSAhPSAwKTtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIEFjY2Vzc01vZGUgY29tcG9uZW50ICcke3NpZGV9J2ApO1xuICB9XG4gIC8qKlxuICAgKiBQYXJzZSBzdHJpbmcgaW50byBhbiBhY2Nlc3MgbW9kZSB2YWx1ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmcgfCBOdW1iZXJ9IG1vZGUgLSBlaXRoZXIgYSBTdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIGFjY2VzcyBtb2RlIHRvIHBhcnNlIG9yIGEgc2V0IG9mIGJpdHMgdG8gYXNzaWduLlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSAtIEFjY2VzcyBtb2RlIGFzIGEgbnVtZXJpYyB2YWx1ZS5cbiAgICovXG4gIHN0YXRpYyBkZWNvZGUoc3RyKSB7XG4gICAgaWYgKCFzdHIpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHN0ciA9PSAnbnVtYmVyJykge1xuICAgICAgcmV0dXJuIHN0ciAmIEFjY2Vzc01vZGUuX0JJVE1BU0s7XG4gICAgfSBlbHNlIGlmIChzdHIgPT09ICdOJyB8fCBzdHIgPT09ICduJykge1xuICAgICAgcmV0dXJuIEFjY2Vzc01vZGUuX05PTkU7XG4gICAgfVxuXG4gICAgY29uc3QgYml0bWFzayA9IHtcbiAgICAgICdKJzogQWNjZXNzTW9kZS5fSk9JTixcbiAgICAgICdSJzogQWNjZXNzTW9kZS5fUkVBRCxcbiAgICAgICdXJzogQWNjZXNzTW9kZS5fV1JJVEUsXG4gICAgICAnUCc6IEFjY2Vzc01vZGUuX1BSRVMsXG4gICAgICAnQSc6IEFjY2Vzc01vZGUuX0FQUFJPVkUsXG4gICAgICAnUyc6IEFjY2Vzc01vZGUuX1NIQVJFLFxuICAgICAgJ0QnOiBBY2Nlc3NNb2RlLl9ERUxFVEUsXG4gICAgICAnTyc6IEFjY2Vzc01vZGUuX09XTkVSXG4gICAgfTtcblxuICAgIGxldCBtMCA9IEFjY2Vzc01vZGUuX05PTkU7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgYml0ID0gYml0bWFza1tzdHIuY2hhckF0KGkpLnRvVXBwZXJDYXNlKCldO1xuICAgICAgaWYgKCFiaXQpIHtcbiAgICAgICAgLy8gVW5yZWNvZ25pemVkIGJpdCwgc2tpcC5cbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBtMCB8PSBiaXQ7XG4gICAgfVxuICAgIHJldHVybiBtMDtcbiAgfVxuICAvKipcbiAgICogQ29udmVydCBudW1lcmljIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBhY2Nlc3MgbW9kZSBpbnRvIGEgc3RyaW5nLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gdmFsIC0gYWNjZXNzIG1vZGUgdmFsdWUgdG8gY29udmVydCB0byBhIHN0cmluZy5cbiAgICogQHJldHVybnMge3N0cmluZ30gLSBBY2Nlc3MgbW9kZSBhcyBhIHN0cmluZy5cbiAgICovXG4gIHN0YXRpYyBlbmNvZGUodmFsKSB7XG4gICAgaWYgKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IEFjY2Vzc01vZGUuX0lOVkFMSUQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0gZWxzZSBpZiAodmFsID09PSBBY2Nlc3NNb2RlLl9OT05FKSB7XG4gICAgICByZXR1cm4gJ04nO1xuICAgIH1cblxuICAgIGNvbnN0IGJpdG1hc2sgPSBbJ0onLCAnUicsICdXJywgJ1AnLCAnQScsICdTJywgJ0QnLCAnTyddO1xuICAgIGxldCByZXMgPSAnJztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJpdG1hc2subGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICgodmFsICYgKDEgPDwgaSkpICE9IDApIHtcbiAgICAgICAgcmVzID0gcmVzICsgYml0bWFza1tpXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuICAvKipcbiAgICogVXBkYXRlIG51bWVyaWMgcmVwcmVzZW50YXRpb24gb2YgYWNjZXNzIG1vZGUgd2l0aCB0aGUgbmV3IHZhbHVlLiBUaGUgdmFsdWVcbiAgICogaXMgb25lIG9mIHRoZSBmb2xsb3dpbmc6XG4gICAqICAtIGEgc3RyaW5nIHN0YXJ0aW5nIHdpdGggPGNvZGU+JysnPC9jb2RlPiBvciA8Y29kZT4nLSc8L2NvZGU+IHRoZW4gdGhlIGJpdHMgdG8gYWRkIG9yIHJlbW92ZSwgZS5nLiA8Y29kZT4nK1ItVyc8L2NvZGU+IG9yIDxjb2RlPictUFMnPC9jb2RlPi5cbiAgICogIC0gYSBuZXcgdmFsdWUgb2YgYWNjZXNzIG1vZGVcbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHZhbCAtIGFjY2VzcyBtb2RlIHZhbHVlIHRvIHVwZGF0ZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHVwZCAtIHVwZGF0ZSB0byBhcHBseSB0byB2YWwuXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IC0gdXBkYXRlZCBhY2Nlc3MgbW9kZS5cbiAgICovXG4gIHN0YXRpYyB1cGRhdGUodmFsLCB1cGQpIHtcbiAgICBpZiAoIXVwZCB8fCB0eXBlb2YgdXBkICE9ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gdmFsO1xuICAgIH1cblxuICAgIGxldCBhY3Rpb24gPSB1cGQuY2hhckF0KDApO1xuICAgIGlmIChhY3Rpb24gPT0gJysnIHx8IGFjdGlvbiA9PSAnLScpIHtcbiAgICAgIGxldCB2YWwwID0gdmFsO1xuICAgICAgLy8gU3BsaXQgZGVsdGEtc3RyaW5nIGxpa2UgJytBQkMtREVGK1onIGludG8gYW4gYXJyYXkgb2YgcGFydHMgaW5jbHVkaW5nICsgYW5kIC0uXG4gICAgICBjb25zdCBwYXJ0cyA9IHVwZC5zcGxpdCgvKFstK10pLyk7XG4gICAgICAvLyBTdGFydGluZyBpdGVyYXRpb24gZnJvbSAxIGJlY2F1c2UgU3RyaW5nLnNwbGl0KCkgY3JlYXRlcyBhbiBhcnJheSB3aXRoIHRoZSBmaXJzdCBlbXB0eSBlbGVtZW50LlxuICAgICAgLy8gSXRlcmF0aW5nIGJ5IDIgYmVjYXVzZSB3ZSBwYXJzZSBwYWlycyArLy0gdGhlbiBkYXRhLlxuICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBwYXJ0cy5sZW5ndGggLSAxOyBpICs9IDIpIHtcbiAgICAgICAgYWN0aW9uID0gcGFydHNbaV07XG4gICAgICAgIGNvbnN0IG0wID0gQWNjZXNzTW9kZS5kZWNvZGUocGFydHNbaSArIDFdKTtcbiAgICAgICAgaWYgKG0wID09IEFjY2Vzc01vZGUuX0lOVkFMSUQpIHtcbiAgICAgICAgICByZXR1cm4gdmFsO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtMCA9PSBudWxsKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFjdGlvbiA9PT0gJysnKSB7XG4gICAgICAgICAgdmFsMCB8PSBtMDtcbiAgICAgICAgfSBlbHNlIGlmIChhY3Rpb24gPT09ICctJykge1xuICAgICAgICAgIHZhbDAgJj0gfm0wO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB2YWwgPSB2YWwwO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBUaGUgc3RyaW5nIGlzIGFuIGV4cGxpY2l0IG5ldyB2YWx1ZSAnQUJDJyByYXRoZXIgdGhhbiBkZWx0YS5cbiAgICAgIGNvbnN0IHZhbDAgPSBBY2Nlc3NNb2RlLmRlY29kZSh1cGQpO1xuICAgICAgaWYgKHZhbDAgIT0gQWNjZXNzTW9kZS5fSU5WQUxJRCkge1xuICAgICAgICB2YWwgPSB2YWwwO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB2YWw7XG4gIH1cbiAgLyoqXG4gICAqIEJpdHMgcHJlc2VudCBpbiBhMSBidXQgbWlzc2luZyBpbiBhMi5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyIHwgc3RyaW5nfSBhMSAtIGFjY2VzcyBtb2RlIHRvIHN1YnRyYWN0IGZyb20uXG4gICAqIEBwYXJhbSB7bnVtYmVyIHwgc3RyaW5nfSBhMiAtIGFjY2VzcyBtb2RlIHRvIHN1YnRyYWN0LlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBhY2Nlc3MgbW9kZSB3aXRoIGJpdHMgcHJlc2VudCBpbiA8Y29kZT5hMTwvY29kZT4gYnV0IG1pc3NpbmcgaW4gPGNvZGU+YTI8L2NvZGU+LlxuICAgKi9cbiAgc3RhdGljIGRpZmYoYTEsIGEyKSB7XG4gICAgYTEgPSBBY2Nlc3NNb2RlLmRlY29kZShhMSk7XG4gICAgYTIgPSBBY2Nlc3NNb2RlLmRlY29kZShhMik7XG5cbiAgICBpZiAoYTEgPT0gQWNjZXNzTW9kZS5fSU5WQUxJRCB8fCBhMiA9PSBBY2Nlc3NNb2RlLl9JTlZBTElEKSB7XG4gICAgICByZXR1cm4gQWNjZXNzTW9kZS5fSU5WQUxJRDtcbiAgICB9XG4gICAgcmV0dXJuIGExICYgfmEyO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQ3VzdG9tIGZvcm1hdHRlclxuICAgKi9cbiAgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuICd7XCJtb2RlXCI6IFwiJyArIEFjY2Vzc01vZGUuZW5jb2RlKHRoaXMubW9kZSkgK1xuICAgICAgJ1wiLCBcImdpdmVuXCI6IFwiJyArIEFjY2Vzc01vZGUuZW5jb2RlKHRoaXMuZ2l2ZW4pICtcbiAgICAgICdcIiwgXCJ3YW50XCI6IFwiJyArIEFjY2Vzc01vZGUuZW5jb2RlKHRoaXMud2FudCkgKyAnXCJ9JztcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIENvbnZlcnRzIG51bWVyaWMgdmFsdWVzIHRvIHN0cmluZ3MuXG4gICAqL1xuICBqc29uSGVscGVyKCkge1xuICAgIHJldHVybiB7XG4gICAgICBtb2RlOiBBY2Nlc3NNb2RlLmVuY29kZSh0aGlzLm1vZGUpLFxuICAgICAgZ2l2ZW46IEFjY2Vzc01vZGUuZW5jb2RlKHRoaXMuZ2l2ZW4pLFxuICAgICAgd2FudDogQWNjZXNzTW9kZS5lbmNvZGUodGhpcy53YW50KVxuICAgIH07XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBBc3NpZ24gdmFsdWUgdG8gJ21vZGUnLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmcgfCBOdW1iZXJ9IG0gLSBlaXRoZXIgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIGFjY2VzcyBtb2RlIG9yIGEgc2V0IG9mIGJpdHMuXG4gICAqIEByZXR1cm5zIHtBY2Nlc3NNb2RlfSAtIDxjb2RlPnRoaXM8L2NvZGU+IEFjY2Vzc01vZGUuXG4gICAqL1xuICBzZXRNb2RlKG0pIHtcbiAgICB0aGlzLm1vZGUgPSBBY2Nlc3NNb2RlLmRlY29kZShtKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIFVwZGF0ZSA8Y29kZT5tb2RlPC9jb2RlPiB2YWx1ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1IC0gc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBjaGFuZ2VzIHRvIGFwcGx5IHRvIGFjY2VzcyBtb2RlLlxuICAgKiBAcmV0dXJucyB7QWNjZXNzTW9kZX0gLSA8Y29kZT50aGlzPC9jb2RlPiBBY2Nlc3NNb2RlLlxuICAgKi9cbiAgdXBkYXRlTW9kZSh1KSB7XG4gICAgdGhpcy5tb2RlID0gQWNjZXNzTW9kZS51cGRhdGUodGhpcy5tb2RlLCB1KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIEdldCA8Y29kZT5tb2RlPC9jb2RlPiB2YWx1ZSBhcyBhIHN0cmluZy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IC0gPGNvZGU+bW9kZTwvY29kZT4gdmFsdWUuXG4gICAqL1xuICBnZXRNb2RlKCkge1xuICAgIHJldHVybiBBY2Nlc3NNb2RlLmVuY29kZSh0aGlzLm1vZGUpO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQXNzaWduIDxjb2RlPmdpdmVuPC9jb2RlPiAgdmFsdWUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZyB8IE51bWJlcn0gZyAtIGVpdGhlciBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgYWNjZXNzIG1vZGUgb3IgYSBzZXQgb2YgYml0cy5cbiAgICogQHJldHVybnMge0FjY2Vzc01vZGV9IC0gPGNvZGU+dGhpczwvY29kZT4gQWNjZXNzTW9kZS5cbiAgICovXG4gIHNldEdpdmVuKGcpIHtcbiAgICB0aGlzLmdpdmVuID0gQWNjZXNzTW9kZS5kZWNvZGUoZyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBVcGRhdGUgJ2dpdmVuJyB2YWx1ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1IC0gc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBjaGFuZ2VzIHRvIGFwcGx5IHRvIGFjY2VzcyBtb2RlLlxuICAgKiBAcmV0dXJucyB7QWNjZXNzTW9kZX0gLSA8Y29kZT50aGlzPC9jb2RlPiBBY2Nlc3NNb2RlLlxuICAgKi9cbiAgdXBkYXRlR2l2ZW4odSkge1xuICAgIHRoaXMuZ2l2ZW4gPSBBY2Nlc3NNb2RlLnVwZGF0ZSh0aGlzLmdpdmVuLCB1KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIEdldCAnZ2l2ZW4nIHZhbHVlIGFzIGEgc3RyaW5nLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICpcbiAgICogQHJldHVybnMge3N0cmluZ30gLSA8Yj5naXZlbjwvYj4gdmFsdWUuXG4gICAqL1xuICBnZXRHaXZlbigpIHtcbiAgICByZXR1cm4gQWNjZXNzTW9kZS5lbmNvZGUodGhpcy5naXZlbik7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBBc3NpZ24gJ3dhbnQnIHZhbHVlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmcgfCBOdW1iZXJ9IHcgLSBlaXRoZXIgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIGFjY2VzcyBtb2RlIG9yIGEgc2V0IG9mIGJpdHMuXG4gICAqIEByZXR1cm5zIHtBY2Nlc3NNb2RlfSAtIDxjb2RlPnRoaXM8L2NvZGU+IEFjY2Vzc01vZGUuXG4gICAqL1xuICBzZXRXYW50KHcpIHtcbiAgICB0aGlzLndhbnQgPSBBY2Nlc3NNb2RlLmRlY29kZSh3KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIFVwZGF0ZSAnd2FudCcgdmFsdWUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdSAtIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgY2hhbmdlcyB0byBhcHBseSB0byBhY2Nlc3MgbW9kZS5cbiAgICogQHJldHVybnMge0FjY2Vzc01vZGV9IC0gPGNvZGU+dGhpczwvY29kZT4gQWNjZXNzTW9kZS5cbiAgICovXG4gIHVwZGF0ZVdhbnQodSkge1xuICAgIHRoaXMud2FudCA9IEFjY2Vzc01vZGUudXBkYXRlKHRoaXMud2FudCwgdSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBHZXQgJ3dhbnQnIHZhbHVlIGFzIGEgc3RyaW5nLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICpcbiAgICogQHJldHVybnMge3N0cmluZ30gLSA8Yj53YW50PC9iPiB2YWx1ZS5cbiAgICovXG4gIGdldFdhbnQoKSB7XG4gICAgcmV0dXJuIEFjY2Vzc01vZGUuZW5jb2RlKHRoaXMud2FudCk7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBHZXQgcGVybWlzc2lvbnMgcHJlc2VudCBpbiAnd2FudCcgYnV0IG1pc3NpbmcgaW4gJ2dpdmVuJy5cbiAgICogSW52ZXJzZSBvZiB7QGxpbmsgVGlub2RlLkFjY2Vzc01vZGUjZ2V0RXhjZXNzaXZlfVxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICpcbiAgICogQHJldHVybnMge3N0cmluZ30gcGVybWlzc2lvbnMgcHJlc2VudCBpbiA8Yj53YW50PC9iPiBidXQgbWlzc2luZyBpbiA8Yj5naXZlbjwvYj4uXG4gICAqL1xuICBnZXRNaXNzaW5nKCkge1xuICAgIHJldHVybiBBY2Nlc3NNb2RlLmVuY29kZSh0aGlzLndhbnQgJiB+dGhpcy5naXZlbik7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBHZXQgcGVybWlzc2lvbnMgcHJlc2VudCBpbiAnZ2l2ZW4nIGJ1dCBtaXNzaW5nIGluICd3YW50Jy5cbiAgICogSW52ZXJzZSBvZiB7QGxpbmsgVGlub2RlLkFjY2Vzc01vZGUjZ2V0TWlzc2luZ31cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IHBlcm1pc3Npb25zIHByZXNlbnQgaW4gPGI+Z2l2ZW48L2I+IGJ1dCBtaXNzaW5nIGluIDxiPndhbnQ8L2I+LlxuICAgKi9cbiAgZ2V0RXhjZXNzaXZlKCkge1xuICAgIHJldHVybiBBY2Nlc3NNb2RlLmVuY29kZSh0aGlzLmdpdmVuICYgfnRoaXMud2FudCk7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBVcGRhdGUgJ3dhbnQnLCAnZ2l2ZScsIGFuZCAnbW9kZScgdmFsdWVzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICpcbiAgICogQHBhcmFtIHtBY2Nlc3NNb2RlfSB2YWwgLSBuZXcgYWNjZXNzIG1vZGUgdmFsdWUuXG4gICAqIEByZXR1cm5zIHtBY2Nlc3NNb2RlfSAtIDxjb2RlPnRoaXM8L2NvZGU+IEFjY2Vzc01vZGUuXG4gICAqL1xuICB1cGRhdGVBbGwodmFsKSB7XG4gICAgaWYgKHZhbCkge1xuICAgICAgdGhpcy51cGRhdGVHaXZlbih2YWwuZ2l2ZW4pO1xuICAgICAgdGhpcy51cGRhdGVXYW50KHZhbC53YW50KTtcbiAgICAgIHRoaXMubW9kZSA9IHRoaXMuZ2l2ZW4gJiB0aGlzLndhbnQ7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQ2hlY2sgaWYgT3duZXIgKE8pIGZsYWcgaXMgc2V0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICogQHBhcmFtIHtzdHJpbmc9fSBzaWRlIC0gd2hpY2ggcGVybWlzc2lvbiB0byBjaGVjazogZ2l2ZW4sIHdhbnQsIG1vZGU7IGRlZmF1bHQ6IG1vZGUuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIGZsYWcgaXMgc2V0LlxuICAgKi9cbiAgaXNPd25lcihzaWRlKSB7XG4gICAgcmV0dXJuIEFjY2Vzc01vZGUuI2NoZWNrRmxhZyh0aGlzLCBzaWRlLCBBY2Nlc3NNb2RlLl9PV05FUik7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBDaGVjayBpZiBQcmVzZW5jZSAoUCkgZmxhZyBpcyBzZXQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IHNpZGUgLSB3aGljaCBwZXJtaXNzaW9uIHRvIGNoZWNrOiBnaXZlbiwgd2FudCwgbW9kZTsgZGVmYXVsdDogbW9kZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgZmxhZyBpcyBzZXQuXG4gICAqL1xuICBpc1ByZXNlbmNlcihzaWRlKSB7XG4gICAgcmV0dXJuIEFjY2Vzc01vZGUuI2NoZWNrRmxhZyh0aGlzLCBzaWRlLCBBY2Nlc3NNb2RlLl9QUkVTKTtcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIENoZWNrIGlmIFByZXNlbmNlIChQKSBmbGFnIGlzIE5PVCBzZXQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IHNpZGUgLSB3aGljaCBwZXJtaXNzaW9uIHRvIGNoZWNrOiBnaXZlbiwgd2FudCwgbW9kZTsgZGVmYXVsdDogbW9kZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgZmxhZyBpcyBzZXQuXG4gICAqL1xuICBpc011dGVkKHNpZGUpIHtcbiAgICByZXR1cm4gIXRoaXMuaXNQcmVzZW5jZXIoc2lkZSk7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBDaGVjayBpZiBKb2luIChKKSBmbGFnIGlzIHNldC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gc2lkZSAtIHdoaWNoIHBlcm1pc3Npb24gdG8gY2hlY2s6IGdpdmVuLCB3YW50LCBtb2RlOyBkZWZhdWx0OiBtb2RlLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiBmbGFnIGlzIHNldC5cbiAgICovXG4gIGlzSm9pbmVyKHNpZGUpIHtcbiAgICByZXR1cm4gQWNjZXNzTW9kZS4jY2hlY2tGbGFnKHRoaXMsIHNpZGUsIEFjY2Vzc01vZGUuX0pPSU4pO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQ2hlY2sgaWYgUmVhZGVyIChSKSBmbGFnIGlzIHNldC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gc2lkZSAtIHdoaWNoIHBlcm1pc3Npb24gdG8gY2hlY2s6IGdpdmVuLCB3YW50LCBtb2RlOyBkZWZhdWx0OiBtb2RlLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiBmbGFnIGlzIHNldC5cbiAgICovXG4gIGlzUmVhZGVyKHNpZGUpIHtcbiAgICByZXR1cm4gQWNjZXNzTW9kZS4jY2hlY2tGbGFnKHRoaXMsIHNpZGUsIEFjY2Vzc01vZGUuX1JFQUQpO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQ2hlY2sgaWYgV3JpdGVyIChXKSBmbGFnIGlzIHNldC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gc2lkZSAtIHdoaWNoIHBlcm1pc3Npb24gdG8gY2hlY2s6IGdpdmVuLCB3YW50LCBtb2RlOyBkZWZhdWx0OiBtb2RlLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiBmbGFnIGlzIHNldC5cbiAgICovXG4gIGlzV3JpdGVyKHNpZGUpIHtcbiAgICByZXR1cm4gQWNjZXNzTW9kZS4jY2hlY2tGbGFnKHRoaXMsIHNpZGUsIEFjY2Vzc01vZGUuX1dSSVRFKTtcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIENoZWNrIGlmIEFwcHJvdmVyIChBKSBmbGFnIGlzIHNldC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gc2lkZSAtIHdoaWNoIHBlcm1pc3Npb24gdG8gY2hlY2s6IGdpdmVuLCB3YW50LCBtb2RlOyBkZWZhdWx0OiBtb2RlLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiBmbGFnIGlzIHNldC5cbiAgICovXG4gIGlzQXBwcm92ZXIoc2lkZSkge1xuICAgIHJldHVybiBBY2Nlc3NNb2RlLiNjaGVja0ZsYWcodGhpcywgc2lkZSwgQWNjZXNzTW9kZS5fQVBQUk9WRSk7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBDaGVjayBpZiBlaXRoZXIgb25lIG9mIE93bmVyIChPKSBvciBBcHByb3ZlciAoQSkgZmxhZ3MgaXMgc2V0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICogQHBhcmFtIHtzdHJpbmc9fSBzaWRlIC0gd2hpY2ggcGVybWlzc2lvbiB0byBjaGVjazogZ2l2ZW4sIHdhbnQsIG1vZGU7IGRlZmF1bHQ6IG1vZGUuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIGZsYWcgaXMgc2V0LlxuICAgKi9cbiAgaXNBZG1pbihzaWRlKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNPd25lcihzaWRlKSB8fCB0aGlzLmlzQXBwcm92ZXIoc2lkZSk7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBDaGVjayBpZiBlaXRoZXIgb25lIG9mIE93bmVyIChPKSwgQXBwcm92ZXIgKEEpLCBvciBTaGFyZXIgKFMpIGZsYWdzIGlzIHNldC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gc2lkZSAtIHdoaWNoIHBlcm1pc3Npb24gdG8gY2hlY2s6IGdpdmVuLCB3YW50LCBtb2RlOyBkZWZhdWx0OiBtb2RlLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiBmbGFnIGlzIHNldC5cbiAgICovXG4gIGlzU2hhcmVyKHNpZGUpIHtcbiAgICByZXR1cm4gdGhpcy5pc0FkbWluKHNpZGUpIHx8IEFjY2Vzc01vZGUuI2NoZWNrRmxhZyh0aGlzLCBzaWRlLCBBY2Nlc3NNb2RlLl9TSEFSRSk7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBDaGVjayBpZiBEZWxldGVyIChEKSBmbGFnIGlzIHNldC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gc2lkZSAtIHdoaWNoIHBlcm1pc3Npb24gdG8gY2hlY2s6IGdpdmVuLCB3YW50LCBtb2RlOyBkZWZhdWx0OiBtb2RlLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiBmbGFnIGlzIHNldC5cbiAgICovXG4gIGlzRGVsZXRlcihzaWRlKSB7XG4gICAgcmV0dXJuIEFjY2Vzc01vZGUuI2NoZWNrRmxhZyh0aGlzLCBzaWRlLCBBY2Nlc3NNb2RlLl9ERUxFVEUpO1xuICB9XG59XG5cbkFjY2Vzc01vZGUuX05PTkUgPSAweDAwO1xuQWNjZXNzTW9kZS5fSk9JTiA9IDB4MDE7XG5BY2Nlc3NNb2RlLl9SRUFEID0gMHgwMjtcbkFjY2Vzc01vZGUuX1dSSVRFID0gMHgwNDtcbkFjY2Vzc01vZGUuX1BSRVMgPSAweDA4O1xuQWNjZXNzTW9kZS5fQVBQUk9WRSA9IDB4MTA7XG5BY2Nlc3NNb2RlLl9TSEFSRSA9IDB4MjA7XG5BY2Nlc3NNb2RlLl9ERUxFVEUgPSAweDQwO1xuQWNjZXNzTW9kZS5fT1dORVIgPSAweDgwO1xuXG5BY2Nlc3NNb2RlLl9CSVRNQVNLID0gQWNjZXNzTW9kZS5fSk9JTiB8IEFjY2Vzc01vZGUuX1JFQUQgfCBBY2Nlc3NNb2RlLl9XUklURSB8IEFjY2Vzc01vZGUuX1BSRVMgfFxuICBBY2Nlc3NNb2RlLl9BUFBST1ZFIHwgQWNjZXNzTW9kZS5fU0hBUkUgfCBBY2Nlc3NNb2RlLl9ERUxFVEUgfCBBY2Nlc3NNb2RlLl9PV05FUjtcbkFjY2Vzc01vZGUuX0lOVkFMSUQgPSAweDEwMDAwMDtcbiIsIi8qKlxuICogQGZpbGUgSW4tbWVtb3J5IHNvcnRlZCBjYWNoZSBvZiBvYmplY3RzLlxuICpcbiAqIEBjb3B5cmlnaHQgMjAxNS0yMDIyIFRpbm9kZSBMTEMuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBJbi1tZW1vcnkgc29ydGVkIGNhY2hlIG9mIG9iamVjdHMuXG4gKlxuICogQGNsYXNzIENCdWZmZXJcbiAqIEBtZW1iZXJvZiBUaW5vZGVcbiAqIEBwcm90ZWN0ZWRcbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjb21wYXJlIGN1c3RvbSBjb21wYXJhdG9yIG9mIG9iamVjdHMuIFRha2VzIHR3byBwYXJhbWV0ZXJzIDxjb2RlPmE8L2NvZGU+IGFuZCA8Y29kZT5iPC9jb2RlPjtcbiAqICAgIHJldHVybnMgPGNvZGU+LTE8L2NvZGU+IGlmIDxjb2RlPmEgPCBiPC9jb2RlPiwgPGNvZGU+MDwvY29kZT4gaWYgPGNvZGU+YSA9PSBiPC9jb2RlPiwgPGNvZGU+MTwvY29kZT4gb3RoZXJ3aXNlLlxuICogQHBhcmFtIHtib29sZWFufSB1bmlxdWUgZW5mb3JjZSBlbGVtZW50IHVuaXF1ZW5lc3M6IHdoZW4gPGNvZGU+dHJ1ZTwvY29kZT4gcmVwbGFjZSBleGlzdGluZyBlbGVtZW50IHdpdGggYSBuZXdcbiAqICAgIG9uZSBvbiBjb25mbGljdDsgd2hlbiA8Y29kZT5mYWxzZTwvY29kZT4ga2VlcCBib3RoIGVsZW1lbnRzLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDQnVmZmVyIHtcbiAgI2NvbXBhcmF0b3IgPSB1bmRlZmluZWQ7XG4gICN1bmlxdWUgPSBmYWxzZTtcbiAgYnVmZmVyID0gW107XG5cbiAgY29uc3RydWN0b3IoY29tcGFyZV8sIHVuaXF1ZV8pIHtcbiAgICB0aGlzLiNjb21wYXJhdG9yID0gY29tcGFyZV8gfHwgKChhLCBiKSA9PiB7XG4gICAgICByZXR1cm4gYSA9PT0gYiA/IDAgOiBhIDwgYiA/IC0xIDogMTtcbiAgICB9KTtcbiAgICB0aGlzLiN1bmlxdWUgPSB1bmlxdWVfO1xuICB9XG5cbiAgI2ZpbmROZWFyZXN0KGVsZW0sIGFyciwgZXhhY3QpIHtcbiAgICBsZXQgc3RhcnQgPSAwO1xuICAgIGxldCBlbmQgPSBhcnIubGVuZ3RoIC0gMTtcbiAgICBsZXQgcGl2b3QgPSAwO1xuICAgIGxldCBkaWZmID0gMDtcbiAgICBsZXQgZm91bmQgPSBmYWxzZTtcblxuICAgIHdoaWxlIChzdGFydCA8PSBlbmQpIHtcbiAgICAgIHBpdm90ID0gKHN0YXJ0ICsgZW5kKSAvIDIgfCAwO1xuICAgICAgZGlmZiA9IHRoaXMuI2NvbXBhcmF0b3IoYXJyW3Bpdm90XSwgZWxlbSk7XG4gICAgICBpZiAoZGlmZiA8IDApIHtcbiAgICAgICAgc3RhcnQgPSBwaXZvdCArIDE7XG4gICAgICB9IGVsc2UgaWYgKGRpZmYgPiAwKSB7XG4gICAgICAgIGVuZCA9IHBpdm90IC0gMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChmb3VuZCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaWR4OiBwaXZvdCxcbiAgICAgICAgZXhhY3Q6IHRydWVcbiAgICAgIH07XG4gICAgfVxuICAgIGlmIChleGFjdCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaWR4OiAtMVxuICAgICAgfTtcbiAgICB9XG4gICAgLy8gTm90IGV4YWN0IC0gaW5zZXJ0aW9uIHBvaW50XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkeDogZGlmZiA8IDAgPyBwaXZvdCArIDEgOiBwaXZvdFxuICAgIH07XG4gIH1cblxuICAvLyBJbnNlcnQgZWxlbWVudCBpbnRvIGEgc29ydGVkIGFycmF5LlxuICAjaW5zZXJ0U29ydGVkKGVsZW0sIGFycikge1xuICAgIGNvbnN0IGZvdW5kID0gdGhpcy4jZmluZE5lYXJlc3QoZWxlbSwgYXJyLCBmYWxzZSk7XG4gICAgY29uc3QgY291bnQgPSAoZm91bmQuZXhhY3QgJiYgdGhpcy4jdW5pcXVlKSA/IDEgOiAwO1xuICAgIGFyci5zcGxpY2UoZm91bmQuaWR4LCBjb3VudCwgZWxlbSk7XG4gICAgcmV0dXJuIGFycjtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYW4gZWxlbWVudCBhdCB0aGUgZ2l2ZW4gcG9zaXRpb24uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ0J1ZmZlciNcbiAgICogQHBhcmFtIHtudW1iZXJ9IGF0IC0gUG9zaXRpb24gdG8gZmV0Y2ggZnJvbS5cbiAgICogQHJldHVybnMge09iamVjdH0gRWxlbWVudCBhdCB0aGUgZ2l2ZW4gcG9zaXRpb24gb3IgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPi5cbiAgICovXG4gIGdldEF0KGF0KSB7XG4gICAgcmV0dXJuIHRoaXMuYnVmZmVyW2F0XTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZW5pZW5jZSBtZXRob2QgZm9yIGdldHRpbmcgdGhlIGVsZW1lbnQgZnJvbSB0aGUgZW5kIG9mIHRoZSBidWZmZXIuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ0J1ZmZlciNcbiAgICogQHBhcmFtIHtudW1iZXJ9IGF0IC0gcG9zaXRpb24gdG8gZmV0Y2ggZnJvbSwgY291bnRpbmcgZnJvbSB0aGUgZW5kO1xuICAgKiAgICA8Y29kZT51bmRlZmluZWQ8L2NvZGU+IG9yIDxjb2RlPm51bGw8L2NvZGU+ICBtZWFuIFwibGFzdFwiLlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgbGFzdCBlbGVtZW50IGluIHRoZSBidWZmZXIgb3IgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPiBpZiBidWZmZXIgaXMgZW1wdHkuXG4gICAqL1xuICBnZXRMYXN0KGF0KSB7XG4gICAgYXQgfD0gMDtcbiAgICByZXR1cm4gdGhpcy5idWZmZXIubGVuZ3RoID4gYXQgPyB0aGlzLmJ1ZmZlclt0aGlzLmJ1ZmZlci5sZW5ndGggLSAxIC0gYXRdIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBuZXcgZWxlbWVudChzKSB0byB0aGUgYnVmZmVyLiBWYXJpYWRpYzogdGFrZXMgb25lIG9yIG1vcmUgYXJndW1lbnRzLiBJZiBhbiBhcnJheSBpcyBwYXNzZWQgYXMgYSBzaW5nbGVcbiAgICogYXJndW1lbnQsIGl0cyBlbGVtZW50cyBhcmUgaW5zZXJ0ZWQgaW5kaXZpZHVhbGx5LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNCdWZmZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7Li4uT2JqZWN0fEFycmF5fSAtIE9uZSBvciBtb3JlIG9iamVjdHMgdG8gaW5zZXJ0LlxuICAgKi9cbiAgcHV0KCkge1xuICAgIGxldCBpbnNlcnQ7XG4gICAgLy8gaW5zcGVjdCBhcmd1bWVudHM6IGlmIGFycmF5LCBpbnNlcnQgaXRzIGVsZW1lbnRzLCBpZiBvbmUgb3IgbW9yZSBub24tYXJyYXkgYXJndW1lbnRzLCBpbnNlcnQgdGhlbSBvbmUgYnkgb25lXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMSAmJiBBcnJheS5pc0FycmF5KGFyZ3VtZW50c1swXSkpIHtcbiAgICAgIGluc2VydCA9IGFyZ3VtZW50c1swXTtcbiAgICB9IGVsc2Uge1xuICAgICAgaW5zZXJ0ID0gYXJndW1lbnRzO1xuICAgIH1cbiAgICBmb3IgKGxldCBpZHggaW4gaW5zZXJ0KSB7XG4gICAgICB0aGlzLiNpbnNlcnRTb3J0ZWQoaW5zZXJ0W2lkeF0sIHRoaXMuYnVmZmVyKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGVsZW1lbnQgYXQgdGhlIGdpdmVuIHBvc2l0aW9uLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNCdWZmZXIjXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBhdCAtIFBvc2l0aW9uIHRvIGRlbGV0ZSBhdC5cbiAgICogQHJldHVybnMge09iamVjdH0gRWxlbWVudCBhdCB0aGUgZ2l2ZW4gcG9zaXRpb24gb3IgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPi5cbiAgICovXG4gIGRlbEF0KGF0KSB7XG4gICAgYXQgfD0gMDtcbiAgICBsZXQgciA9IHRoaXMuYnVmZmVyLnNwbGljZShhdCwgMSk7XG4gICAgaWYgKHIgJiYgci5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gclswXTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgZWxlbWVudHMgYmV0d2VlbiB0d28gcG9zaXRpb25zLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNCdWZmZXIjXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzaW5jZSAtIFBvc2l0aW9uIHRvIGRlbGV0ZSBmcm9tIChpbmNsdXNpdmUpLlxuICAgKiBAcGFyYW0ge251bWJlcn0gYmVmb3JlIC0gUG9zaXRpb24gdG8gZGVsZXRlIHRvIChleGNsdXNpdmUpLlxuICAgKlxuICAgKiBAcmV0dXJucyB7QXJyYXl9IGFycmF5IG9mIHJlbW92ZWQgZWxlbWVudHMgKGNvdWxkIGJlIHplcm8gbGVuZ3RoKS5cbiAgICovXG4gIGRlbFJhbmdlKHNpbmNlLCBiZWZvcmUpIHtcbiAgICByZXR1cm4gdGhpcy5idWZmZXIuc3BsaWNlKHNpbmNlLCBiZWZvcmUgLSBzaW5jZSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBudW1iZXIgb2YgZWxlbWVudHMgdGhlIGJ1ZmZlciBob2xkcy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKiBAcmV0dXJuIHtudW1iZXJ9IE51bWJlciBvZiBlbGVtZW50cyBpbiB0aGUgYnVmZmVyLlxuICAgKi9cbiAgbGVuZ3RoKCkge1xuICAgIHJldHVybiB0aGlzLmJ1ZmZlci5sZW5ndGg7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXQgdGhlIGJ1ZmZlciBkaXNjYXJkaW5nIGFsbCBlbGVtZW50c1xuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNCdWZmZXIjXG4gICAqL1xuICByZXNldCgpIHtcbiAgICB0aGlzLmJ1ZmZlciA9IFtdO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIGZvciBpdGVyYXRpbmcgY29udGVudHMgb2YgYnVmZmVyLiBTZWUge0BsaW5rIFRpbm9kZS5DQnVmZmVyI2ZvckVhY2h9LlxuICAgKiBAY2FsbGJhY2sgRm9yRWFjaENhbGxiYWNrVHlwZVxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNCdWZmZXIjXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtIC0gQ3VycmVudCBlbGVtZW50IG9mIHRoZSBidWZmZXIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwcmV2IC0gUHJldmlvdXMgZWxlbWVudCBvZiB0aGUgYnVmZmVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gbmV4dCAtIE5leHQgZWxlbWVudCBvZiB0aGUgYnVmZmVyLlxuICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggLSBJbmRleCBvZiB0aGUgY3VycmVudCBlbGVtZW50LlxuICAgKi9cblxuICAvKipcbiAgICogQXBwbHkgZ2l2ZW4gPGNvZGU+Y2FsbGJhY2s8L2NvZGU+IHRvIGFsbCBlbGVtZW50cyBvZiB0aGUgYnVmZmVyLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNCdWZmZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7VGlub2RlLkZvckVhY2hDYWxsYmFja1R5cGV9IGNhbGxiYWNrIC0gRnVuY3Rpb24gdG8gY2FsbCBmb3IgZWFjaCBlbGVtZW50LlxuICAgKiBAcGFyYW0ge251bWJlcn0gc3RhcnRJZHggLSBPcHRpb25hbCBpbmRleCB0byBzdGFydCBpdGVyYXRpbmcgZnJvbSAoaW5jbHVzaXZlKS5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGJlZm9yZUlkeCAtIE9wdGlvbmFsIGluZGV4IHRvIHN0b3AgaXRlcmF0aW5nIGJlZm9yZSAoZXhjbHVzaXZlKS5cbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSBjYWxsaW5nIGNvbnRleHQgKGkuZS4gdmFsdWUgb2YgPGNvZGU+dGhpczwvY29kZT4gaW4gY2FsbGJhY2spXG4gICAqL1xuICBmb3JFYWNoKGNhbGxiYWNrLCBzdGFydElkeCwgYmVmb3JlSWR4LCBjb250ZXh0KSB7XG4gICAgc3RhcnRJZHggPSBzdGFydElkeCB8IDA7XG4gICAgYmVmb3JlSWR4ID0gYmVmb3JlSWR4IHx8IHRoaXMuYnVmZmVyLmxlbmd0aDtcblxuICAgIGZvciAobGV0IGkgPSBzdGFydElkeDsgaSA8IGJlZm9yZUlkeDsgaSsrKSB7XG4gICAgICBjYWxsYmFjay5jYWxsKGNvbnRleHQsIHRoaXMuYnVmZmVyW2ldLFxuICAgICAgICAoaSA+IHN0YXJ0SWR4ID8gdGhpcy5idWZmZXJbaSAtIDFdIDogdW5kZWZpbmVkKSxcbiAgICAgICAgKGkgPCBiZWZvcmVJZHggLSAxID8gdGhpcy5idWZmZXJbaSArIDFdIDogdW5kZWZpbmVkKSwgaSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEZpbmQgZWxlbWVudCBpbiBidWZmZXIgdXNpbmcgYnVmZmVyJ3MgY29tcGFyaXNvbiBmdW5jdGlvbi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gZWxlbSAtIGVsZW1lbnQgdG8gZmluZC5cbiAgICogQHBhcmFtIHtib29sZWFuPX0gbmVhcmVzdCAtIHdoZW4gdHJ1ZSBhbmQgZXhhY3QgbWF0Y2ggaXMgbm90IGZvdW5kLCByZXR1cm4gdGhlIG5lYXJlc3QgZWxlbWVudCAoaW5zZXJ0aW9uIHBvaW50KS5cbiAgICogQHJldHVybnMge251bWJlcn0gaW5kZXggb2YgdGhlIGVsZW1lbnQgaW4gdGhlIGJ1ZmZlciBvciAtMS5cbiAgICovXG4gIGZpbmQoZWxlbSwgbmVhcmVzdCkge1xuICAgIGNvbnN0IHtcbiAgICAgIGlkeFxuICAgIH0gPSB0aGlzLiNmaW5kTmVhcmVzdChlbGVtLCB0aGlzLmJ1ZmZlciwgIW5lYXJlc3QpO1xuICAgIHJldHVybiBpZHg7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGJhY2sgZm9yIGZpbHRlcmluZyB0aGUgYnVmZmVyLiBTZWUge0BsaW5rIFRpbm9kZS5DQnVmZmVyI2ZpbHRlcn0uXG4gICAqIEBjYWxsYmFjayBGb3JFYWNoQ2FsbGJhY2tUeXBlXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ0J1ZmZlciNcbiAgICogQHBhcmFtIHtPYmplY3R9IGVsZW0gLSBDdXJyZW50IGVsZW1lbnQgb2YgdGhlIGJ1ZmZlci5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IC0gSW5kZXggb2YgdGhlIGN1cnJlbnQgZWxlbWVudC5cbiAgICogQHJldHVybnMge2Jvb2xlbn0gPGNvZGU+dHJ1ZTwvY29kZT4gdG8ga2VlcCB0aGUgZWxlbWVudCwgPGNvZGU+ZmFsc2U8L2NvZGU+IHRvIHJlbW92ZS5cbiAgICovXG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbGwgZWxlbWVudHMgdGhhdCBkbyBub3QgcGFzcyB0aGUgdGVzdCBpbXBsZW1lbnRlZCBieSB0aGUgcHJvdmlkZWQgY2FsbGJhY2sgZnVuY3Rpb24uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ0J1ZmZlciNcbiAgICpcbiAgICogQHBhcmFtIHtUaW5vZGUuRmlsdGVyQ2FsbGJhY2tUeXBlfSBjYWxsYmFjayAtIEZ1bmN0aW9uIHRvIGNhbGwgZm9yIGVhY2ggZWxlbWVudC5cbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSBjYWxsaW5nIGNvbnRleHQgKGkuZS4gdmFsdWUgb2YgPGNvZGU+dGhpczwvY29kZT4gaW4gdGhlIGNhbGxiYWNrKVxuICAgKi9cbiAgZmlsdGVyKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgbGV0IGNvdW50ID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYnVmZmVyLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoY2FsbGJhY2suY2FsbChjb250ZXh0LCB0aGlzLmJ1ZmZlcltpXSwgaSkpIHtcbiAgICAgICAgdGhpcy5idWZmZXJbY291bnRdID0gdGhpcy5idWZmZXJbaV07XG4gICAgICAgIGNvdW50Kys7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5idWZmZXIuc3BsaWNlKGNvdW50KTtcbiAgfVxufVxuIiwiLyoqXG4gKiBAZmlsZSBHbG9iYWwgY29uc3RhbnRzIGFuZCBjb25maWd1cmF0aW9uIHBhcmFtZXRlcnMuXG4gKlxuICogQGNvcHlyaWdodCAyMDE1LTIwMjIgVGlub2RlIExMQ1xuICovXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7XG4gIHZlcnNpb24gYXMgcGFja2FnZV92ZXJzaW9uXG59IGZyb20gJy4uL3ZlcnNpb24uanNvbic7XG5cbi8vIEdsb2JhbCBjb25zdGFudHNcbmV4cG9ydCBjb25zdCBQUk9UT0NPTF9WRVJTSU9OID0gJzAnOyAvLyBNYWpvciBjb21wb25lbnQgb2YgdGhlIHZlcnNpb24sIGUuZy4gJzAnIGluICcwLjE3LjEnLlxuZXhwb3J0IGNvbnN0IFZFUlNJT04gPSBwYWNrYWdlX3ZlcnNpb24gfHwgJzAuMjAnO1xuZXhwb3J0IGNvbnN0IExJQlJBUlkgPSAndGlub2RlanMvJyArIFZFUlNJT047XG5cbi8vIFRvcGljIG5hbWUgcHJlZml4ZXMuXG5leHBvcnQgY29uc3QgVE9QSUNfTkVXID0gJ25ldyc7XG5leHBvcnQgY29uc3QgVE9QSUNfTkVXX0NIQU4gPSAnbmNoJztcbmV4cG9ydCBjb25zdCBUT1BJQ19NRSA9ICdtZSc7XG5leHBvcnQgY29uc3QgVE9QSUNfRk5EID0gJ2ZuZCc7XG5leHBvcnQgY29uc3QgVE9QSUNfU1lTID0gJ3N5cyc7XG5leHBvcnQgY29uc3QgVE9QSUNfQ0hBTiA9ICdjaG4nO1xuZXhwb3J0IGNvbnN0IFRPUElDX0dSUCA9ICdncnAnO1xuZXhwb3J0IGNvbnN0IFRPUElDX1AyUCA9ICdwMnAnO1xuZXhwb3J0IGNvbnN0IFVTRVJfTkVXID0gJ25ldyc7XG5cbi8vIFN0YXJ0aW5nIHZhbHVlIG9mIGEgbG9jYWxseS1nZW5lcmF0ZWQgc2VxSWQgdXNlZCBmb3IgcGVuZGluZyBtZXNzYWdlcy5cbmV4cG9ydCBjb25zdCBMT0NBTF9TRVFJRCA9IDB4RkZGRkZGRjtcblxuLy8gU3RhdHVzIGNvZGVzLlxuZXhwb3J0IGNvbnN0IE1FU1NBR0VfU1RBVFVTX05PTkUgPSAwOyAvLyBTdGF0dXMgbm90IGFzc2lnbmVkLlxuZXhwb3J0IGNvbnN0IE1FU1NBR0VfU1RBVFVTX1FVRVVFRCA9IDE7IC8vIExvY2FsIElEIGFzc2lnbmVkLCBpbiBwcm9ncmVzcyB0byBiZSBzZW50LlxuZXhwb3J0IGNvbnN0IE1FU1NBR0VfU1RBVFVTX1NFTkRJTkcgPSAyOyAvLyBUcmFuc21pc3Npb24gc3RhcnRlZC5cbmV4cG9ydCBjb25zdCBNRVNTQUdFX1NUQVRVU19GQUlMRUQgPSAzOyAvLyBBdCBsZWFzdCBvbmUgYXR0ZW1wdCB3YXMgbWFkZSB0byBzZW5kIHRoZSBtZXNzYWdlLlxuZXhwb3J0IGNvbnN0IE1FU1NBR0VfU1RBVFVTX1NFTlQgPSA0OyAvLyBEZWxpdmVyZWQgdG8gdGhlIHNlcnZlci5cbmV4cG9ydCBjb25zdCBNRVNTQUdFX1NUQVRVU19SRUNFSVZFRCA9IDU7IC8vIFJlY2VpdmVkIGJ5IHRoZSBjbGllbnQuXG5leHBvcnQgY29uc3QgTUVTU0FHRV9TVEFUVVNfUkVBRCA9IDY7IC8vIFJlYWQgYnkgdGhlIHVzZXIuXG5leHBvcnQgY29uc3QgTUVTU0FHRV9TVEFUVVNfVE9fTUUgPSA3OyAvLyBUaGUgbWVzc2FnZSBpcyByZWNlaXZlZCBmcm9tIGFub3RoZXIgdXNlci5cbmV4cG9ydCBjb25zdCBNRVNTQUdFX1NUQVRVU19ERUxfUkFOR0UgPSA4OyAvLyBUaGUgbWVzc2FnZSByZXByZXNlbnRzIGEgZGVsZXRlZCByYW5nZS5cblxuLy8gUmVqZWN0IHVucmVzb2x2ZWQgZnV0dXJlcyBhZnRlciB0aGlzIG1hbnkgbWlsbGlzZWNvbmRzLlxuZXhwb3J0IGNvbnN0IEVYUElSRV9QUk9NSVNFU19USU1FT1VUID0gNV8wMDA7XG4vLyBQZXJpb2RpY2l0eSBvZiBnYXJiYWdlIGNvbGxlY3Rpb24gb2YgdW5yZXNvbHZlZCBmdXR1cmVzLlxuZXhwb3J0IGNvbnN0IEVYUElSRV9QUk9NSVNFU19QRVJJT0QgPSAxXzAwMDtcblxuLy8gRGVsYXkgYmVmb3JlIGFja25vd2xlZGdpbmcgdGhhdCBhIG1lc3NhZ2Ugd2FzIHJlY2l2ZWQuXG5leHBvcnQgY29uc3QgUkVDVl9USU1FT1VUID0gMTAwO1xuXG4vLyBEZWZhdWx0IG51bWJlciBvZiBtZXNzYWdlcyB0byBwdWxsIGludG8gbWVtb3J5IGZyb20gcGVyc2lzdGVudCBjYWNoZS5cbmV4cG9ydCBjb25zdCBERUZBVUxUX01FU1NBR0VTX1BBR0UgPSAyNDtcblxuLy8gVW5pY29kZSBERUwgY2hhcmFjdGVyIGluZGljYXRpbmcgZGF0YSB3YXMgZGVsZXRlZC5cbmV4cG9ydCBjb25zdCBERUxfQ0hBUiA9ICdcXHUyNDIxJztcbiIsIi8qKlxuICogQGZpbGUgQWJzdHJhY3Rpb24gbGF5ZXIgZm9yIHdlYnNvY2tldCBhbmQgbG9uZyBwb2xsaW5nIGNvbm5lY3Rpb25zLlxuICpcbiAqIEBjb3B5cmlnaHQgMjAxNS0yMDIyIFRpbm9kZSBMTEMuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtcbiAganNvblBhcnNlSGVscGVyXG59IGZyb20gJy4vdXRpbHMuanMnO1xuXG5sZXQgV2ViU29ja2V0UHJvdmlkZXI7XG5sZXQgWEhSUHJvdmlkZXI7XG5cbi8vIEVycm9yIGNvZGUgdG8gcmV0dXJuIGluIGNhc2Ugb2YgYSBuZXR3b3JrIHByb2JsZW0uXG5jb25zdCBORVRXT1JLX0VSUk9SID0gNTAzO1xuY29uc3QgTkVUV09SS19FUlJPUl9URVhUID0gXCJDb25uZWN0aW9uIGZhaWxlZFwiO1xuXG4vLyBFcnJvciBjb2RlIHRvIHJldHVybiB3aGVuIHVzZXIgZGlzY29ubmVjdGVkIGZyb20gc2VydmVyLlxuY29uc3QgTkVUV09SS19VU0VSID0gNDE4O1xuY29uc3QgTkVUV09SS19VU0VSX1RFWFQgPSBcIkRpc2Nvbm5lY3RlZCBieSBjbGllbnRcIjtcblxuLy8gU2V0dGluZ3MgZm9yIGV4cG9uZW50aWFsIGJhY2tvZmZcbmNvbnN0IF9CT0ZGX0JBU0UgPSAyMDAwOyAvLyAyMDAwIG1pbGxpc2Vjb25kcywgbWluaW11bSBkZWxheSBiZXR3ZWVuIHJlY29ubmVjdHNcbmNvbnN0IF9CT0ZGX01BWF9JVEVSID0gMTA7IC8vIE1heGltdW0gZGVsYXkgYmV0d2VlbiByZWNvbm5lY3RzIDJeMTAgKiAyMDAwIH4gMzQgbWludXRlc1xuY29uc3QgX0JPRkZfSklUVEVSID0gMC4zOyAvLyBBZGQgcmFuZG9tIGRlbGF5XG5cbi8vIEhlbHBlciBmdW5jdGlvbiBmb3IgY3JlYXRpbmcgYW4gZW5kcG9pbnQgVVJMLlxuZnVuY3Rpb24gbWFrZUJhc2VVcmwoaG9zdCwgcHJvdG9jb2wsIHZlcnNpb24sIGFwaUtleSkge1xuICBsZXQgdXJsID0gbnVsbDtcblxuICBpZiAoWydodHRwJywgJ2h0dHBzJywgJ3dzJywgJ3dzcyddLmluY2x1ZGVzKHByb3RvY29sKSkge1xuICAgIHVybCA9IGAke3Byb3RvY29sfTovLyR7aG9zdH1gO1xuICAgIGlmICh1cmwuY2hhckF0KHVybC5sZW5ndGggLSAxKSAhPT0gJy8nKSB7XG4gICAgICB1cmwgKz0gJy8nO1xuICAgIH1cbiAgICB1cmwgKz0gJ3YnICsgdmVyc2lvbiArICcvY2hhbm5lbHMnO1xuICAgIGlmIChbJ2h0dHAnLCAnaHR0cHMnXS5pbmNsdWRlcyhwcm90b2NvbCkpIHtcbiAgICAgIC8vIExvbmcgcG9sbGluZyBlbmRwb2ludCBlbmRzIHdpdGggXCJscFwiLCBpLmUuXG4gICAgICAvLyAnL3YwL2NoYW5uZWxzL2xwJyB2cyBqdXN0ICcvdjAvY2hhbm5lbHMnIGZvciB3c1xuICAgICAgdXJsICs9ICcvbHAnO1xuICAgIH1cbiAgICB1cmwgKz0gJz9hcGlrZXk9JyArIGFwaUtleTtcbiAgfVxuICByZXR1cm4gdXJsO1xufVxuXG4vKipcbiAqIEFuIGFic3RyYWN0aW9uIGZvciBhIHdlYnNvY2tldCBvciBhIGxvbmcgcG9sbGluZyBjb25uZWN0aW9uLlxuICpcbiAqIEBjbGFzcyBDb25uZWN0aW9uXG4gKiBAbWVtYmVyb2YgVGlub2RlXG5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgLSBjb25maWd1cmF0aW9uIHBhcmFtZXRlcnMuXG4gKiBAcGFyYW0ge3N0cmluZ30gY29uZmlnLmhvc3QgLSBIb3N0IG5hbWUgYW5kIG9wdGlvbmFsIHBvcnQgbnVtYmVyIHRvIGNvbm5lY3QgdG8uXG4gKiBAcGFyYW0ge3N0cmluZ30gY29uZmlnLmFwaUtleSAtIEFQSSBrZXkgZ2VuZXJhdGVkIGJ5IDxjb2RlPmtleWdlbjwvY29kZT4uXG4gKiBAcGFyYW0ge3N0cmluZ30gY29uZmlnLnRyYW5zcG9ydCAtIE5ldHdvcmsgdHJhbnNwb3J0IHRvIHVzZSwgZWl0aGVyIDxjb2RlPlwid3NcIjxjb2RlPi88Y29kZT5cIndzc1wiPC9jb2RlPiBmb3Igd2Vic29ja2V0IG9yXG4gKiAgICAgIDxjb2RlPmxwPC9jb2RlPiBmb3IgbG9uZyBwb2xsaW5nLlxuICogQHBhcmFtIHtib29sZWFufSBjb25maWcuc2VjdXJlIC0gVXNlIFNlY3VyZSBXZWJTb2NrZXQgaWYgPGNvZGU+dHJ1ZTwvY29kZT4uXG4gKiBAcGFyYW0ge3N0cmluZ30gdmVyc2lvbl8gLSBNYWpvciB2YWx1ZSBvZiB0aGUgcHJvdG9jb2wgdmVyc2lvbiwgZS5nLiAnMCcgaW4gJzAuMTcuMScuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGF1dG9yZWNvbm5lY3RfIC0gSWYgY29ubmVjdGlvbiBpcyBsb3N0LCB0cnkgdG8gcmVjb25uZWN0IGF1dG9tYXRpY2FsbHkuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbm5lY3Rpb24ge1xuICAvLyBMb2dnZXIsIGRvZXMgbm90aGluZyBieSBkZWZhdWx0LlxuICBzdGF0aWMgI2xvZyA9IF8gPT4ge307XG5cbiAgI2JvZmZUaW1lciA9IG51bGw7XG4gICNib2ZmSXRlcmF0aW9uID0gMDtcbiAgI2JvZmZDbG9zZWQgPSBmYWxzZTsgLy8gSW5kaWNhdG9yIGlmIHRoZSBzb2NrZXQgd2FzIG1hbnVhbGx5IGNsb3NlZCAtIGRvbid0IGF1dG9yZWNvbm5lY3QgaWYgdHJ1ZS5cblxuICAvLyBXZWJzb2NrZXQuXG4gICNzb2NrZXQgPSBudWxsO1xuXG4gIGhvc3Q7XG4gIHNlY3VyZTtcbiAgYXBpS2V5O1xuXG4gIHZlcnNpb247XG4gIGF1dG9yZWNvbm5lY3Q7XG5cbiAgaW5pdGlhbGl6ZWQ7XG5cbiAgLy8gKGNvbmZpZy5ob3N0LCBjb25maWcuYXBpS2V5LCBjb25maWcudHJhbnNwb3J0LCBjb25maWcuc2VjdXJlKSwgUFJPVE9DT0xfVkVSU0lPTiwgdHJ1ZVxuICBjb25zdHJ1Y3Rvcihjb25maWcsIHZlcnNpb25fLCBhdXRvcmVjb25uZWN0Xykge1xuICAgIHRoaXMuaG9zdCA9IGNvbmZpZy5ob3N0O1xuICAgIHRoaXMuc2VjdXJlID0gY29uZmlnLnNlY3VyZTtcbiAgICB0aGlzLmFwaUtleSA9IGNvbmZpZy5hcGlLZXk7XG5cbiAgICB0aGlzLnZlcnNpb24gPSB2ZXJzaW9uXztcbiAgICB0aGlzLmF1dG9yZWNvbm5lY3QgPSBhdXRvcmVjb25uZWN0XztcblxuICAgIGlmIChjb25maWcudHJhbnNwb3J0ID09PSAnbHAnKSB7XG4gICAgICAvLyBleHBsaWNpdCByZXF1ZXN0IHRvIHVzZSBsb25nIHBvbGxpbmdcbiAgICAgIHRoaXMuI2luaXRfbHAoKTtcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSAnbHAnO1xuICAgIH0gZWxzZSBpZiAoY29uZmlnLnRyYW5zcG9ydCA9PT0gJ3dzJykge1xuICAgICAgLy8gZXhwbGljaXQgcmVxdWVzdCB0byB1c2Ugd2ViIHNvY2tldFxuICAgICAgLy8gaWYgd2Vic29ja2V0cyBhcmUgbm90IGF2YWlsYWJsZSwgaG9ycmlibGUgdGhpbmdzIHdpbGwgaGFwcGVuXG4gICAgICB0aGlzLiNpbml0X3dzKCk7XG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gJ3dzJztcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuaW5pdGlhbGl6ZWQpIHtcbiAgICAgIC8vIEludmFsaWQgb3IgdW5kZWZpbmVkIG5ldHdvcmsgdHJhbnNwb3J0LlxuICAgICAgQ29ubmVjdGlvbi4jbG9nKFwiVW5rbm93biBvciBpbnZhbGlkIG5ldHdvcmsgdHJhbnNwb3J0LiBSdW5uaW5nIHVuZGVyIE5vZGU/IENhbGwgJ1Rpbm9kZS5zZXROZXR3b3JrUHJvdmlkZXJzKCknLlwiKTtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlVua25vd24gb3IgaW52YWxpZCBuZXR3b3JrIHRyYW5zcG9ydC4gUnVubmluZyB1bmRlciBOb2RlPyBDYWxsICdUaW5vZGUuc2V0TmV0d29ya1Byb3ZpZGVycygpJy5cIik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRvIHVzZSBDb25uZWN0aW9uIGluIGEgbm9uIGJyb3dzZXIgY29udGV4dCwgc3VwcGx5IFdlYlNvY2tldCBhbmQgWE1MSHR0cFJlcXVlc3QgcHJvdmlkZXJzLlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJvZiBDb25uZWN0aW9uXG4gICAqIEBwYXJhbSB3c1Byb3ZpZGVyIFdlYlNvY2tldCBwcm92aWRlciwgZS5nLiBmb3Igbm9kZUpTICwgPGNvZGU+cmVxdWlyZSgnd3MnKTwvY29kZT4uXG4gICAqIEBwYXJhbSB4aHJQcm92aWRlciBYTUxIdHRwUmVxdWVzdCBwcm92aWRlciwgZS5nLiBmb3Igbm9kZSA8Y29kZT5yZXF1aXJlKCd4aHInKTwvY29kZT4uXG4gICAqL1xuICBzdGF0aWMgc2V0TmV0d29ya1Byb3ZpZGVycyh3c1Byb3ZpZGVyLCB4aHJQcm92aWRlcikge1xuICAgIFdlYlNvY2tldFByb3ZpZGVyID0gd3NQcm92aWRlcjtcbiAgICBYSFJQcm92aWRlciA9IHhoclByb3ZpZGVyO1xuICB9XG5cbiAgLyoqXG4gICAqIEFzc2lnbiBhIG5vbi1kZWZhdWx0IGxvZ2dlci5cbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyb2YgQ29ubmVjdGlvblxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBsIHZhcmlhZGljIGxvZ2dpbmcgZnVuY3Rpb24uXG4gICAqL1xuICBzdGF0aWMgc2V0IGxvZ2dlcihsKSB7XG4gICAgQ29ubmVjdGlvbi4jbG9nID0gbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWF0ZSBhIG5ldyBjb25uZWN0aW9uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ29ubmVjdGlvbiNcbiAgICogQHBhcmFtIHtzdHJpbmd9IGhvc3RfIEhvc3QgbmFtZSB0byBjb25uZWN0IHRvOyBpZiA8Y29kZT5udWxsPC9jb2RlPiB0aGUgb2xkIGhvc3QgbmFtZSB3aWxsIGJlIHVzZWQuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gZm9yY2UgRm9yY2UgbmV3IGNvbm5lY3Rpb24gZXZlbiBpZiBvbmUgYWxyZWFkeSBleGlzdHMuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IFByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgY29ubmVjdGlvbiBjYWxsIGNvbXBsZXRlcywgcmVzb2x1dGlvbiBpcyBjYWxsZWQgd2l0aG91dFxuICAgKiAgcGFyYW1ldGVycywgcmVqZWN0aW9uIHBhc3NlcyB0aGUge0Vycm9yfSBhcyBwYXJhbWV0ZXIuXG4gICAqL1xuICBjb25uZWN0KGhvc3RfLCBmb3JjZSkge1xuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChudWxsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcnkgdG8gcmVzdG9yZSBhIG5ldHdvcmsgY29ubmVjdGlvbiwgYWxzbyByZXNldCBiYWNrb2ZmLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gZm9yY2UgLSByZWNvbm5lY3QgZXZlbiBpZiB0aGVyZSBpcyBhIGxpdmUgY29ubmVjdGlvbiBhbHJlYWR5LlxuICAgKi9cbiAgcmVjb25uZWN0KGZvcmNlKSB7fVxuXG4gIC8qKlxuICAgKiBUZXJtaW5hdGUgdGhlIG5ldHdvcmsgY29ubmVjdGlvblxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAqL1xuICBkaXNjb25uZWN0KCkge31cblxuICAvKipcbiAgICogU2VuZCBhIHN0cmluZyB0byB0aGUgc2VydmVyLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtc2cgLSBTdHJpbmcgdG8gc2VuZC5cbiAgICogQHRocm93cyBUaHJvd3MgYW4gZXhjZXB0aW9uIGlmIHRoZSB1bmRlcmx5aW5nIGNvbm5lY3Rpb24gaXMgbm90IGxpdmUuXG4gICAqL1xuICBzZW5kVGV4dChtc2cpIHt9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGNvbm5lY3Rpb24gaXMgYWxpdmUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ29ubmVjdGlvbiNcbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIGNvbm5lY3Rpb24gaXMgbGl2ZSwgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIGlzQ29ubmVjdGVkKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIG5hbWUgb2YgdGhlIGN1cnJlbnQgbmV0d29yayB0cmFuc3BvcnQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ29ubmVjdGlvbiNcbiAgICogQHJldHVybnMge3N0cmluZ30gbmFtZSBvZiB0aGUgdHJhbnNwb3J0IHN1Y2ggYXMgPGNvZGU+XCJ3c1wiPC9jb2RlPiBvciA8Y29kZT5cImxwXCI8L2NvZGU+LlxuICAgKi9cbiAgdHJhbnNwb3J0KCkge1xuICAgIHJldHVybiB0aGlzLmluaXRpYWxpemVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgbmV0d29yayBwcm9iZSB0byBjaGVjayBpZiBjb25uZWN0aW9uIGlzIGluZGVlZCBsaXZlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAqL1xuICBwcm9iZSgpIHtcbiAgICB0aGlzLnNlbmRUZXh0KCcxJyk7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXQgYXV0b3JlY29ubmVjdCBjb3VudGVyIHRvIHplcm8uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ29ubmVjdGlvbiNcbiAgICovXG4gIGJhY2tvZmZSZXNldCgpIHtcbiAgICB0aGlzLiNib2ZmUmVzZXQoKTtcbiAgfVxuXG4gIC8vIEJhY2tvZmYgaW1wbGVtZW50YXRpb24gLSByZWNvbm5lY3QgYWZ0ZXIgYSB0aW1lb3V0LlxuICAjYm9mZlJlY29ubmVjdCgpIHtcbiAgICAvLyBDbGVhciB0aW1lclxuICAgIGNsZWFyVGltZW91dCh0aGlzLiNib2ZmVGltZXIpO1xuICAgIC8vIENhbGN1bGF0ZSB3aGVuIHRvIGZpcmUgdGhlIHJlY29ubmVjdCBhdHRlbXB0XG4gICAgY29uc3QgdGltZW91dCA9IF9CT0ZGX0JBU0UgKiAoTWF0aC5wb3coMiwgdGhpcy4jYm9mZkl0ZXJhdGlvbikgKiAoMS4wICsgX0JPRkZfSklUVEVSICogTWF0aC5yYW5kb20oKSkpO1xuICAgIC8vIFVwZGF0ZSBpdGVyYXRpb24gY291bnRlciBmb3IgZnV0dXJlIHVzZVxuICAgIHRoaXMuI2JvZmZJdGVyYXRpb24gPSAodGhpcy4jYm9mZkl0ZXJhdGlvbiA+PSBfQk9GRl9NQVhfSVRFUiA/IHRoaXMuI2JvZmZJdGVyYXRpb24gOiB0aGlzLiNib2ZmSXRlcmF0aW9uICsgMSk7XG4gICAgaWYgKHRoaXMub25BdXRvcmVjb25uZWN0SXRlcmF0aW9uKSB7XG4gICAgICB0aGlzLm9uQXV0b3JlY29ubmVjdEl0ZXJhdGlvbih0aW1lb3V0KTtcbiAgICB9XG5cbiAgICB0aGlzLiNib2ZmVGltZXIgPSBzZXRUaW1lb3V0KF8gPT4ge1xuICAgICAgQ29ubmVjdGlvbi4jbG9nKGBSZWNvbm5lY3RpbmcsIGl0ZXI9JHt0aGlzLiNib2ZmSXRlcmF0aW9ufSwgdGltZW91dD0ke3RpbWVvdXR9YCk7XG4gICAgICAvLyBNYXliZSB0aGUgc29ja2V0IHdhcyBjbG9zZWQgd2hpbGUgd2Ugd2FpdGVkIGZvciB0aGUgdGltZXI/XG4gICAgICBpZiAoIXRoaXMuI2JvZmZDbG9zZWQpIHtcbiAgICAgICAgY29uc3QgcHJvbSA9IHRoaXMuY29ubmVjdCgpO1xuICAgICAgICBpZiAodGhpcy5vbkF1dG9yZWNvbm5lY3RJdGVyYXRpb24pIHtcbiAgICAgICAgICB0aGlzLm9uQXV0b3JlY29ubmVjdEl0ZXJhdGlvbigwLCBwcm9tKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBTdXBwcmVzcyBlcnJvciBpZiBpdCdzIG5vdCB1c2VkLlxuICAgICAgICAgIHByb20uY2F0Y2goXyA9PiB7XG4gICAgICAgICAgICAvKiBkbyBub3RoaW5nICovXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5vbkF1dG9yZWNvbm5lY3RJdGVyYXRpb24pIHtcbiAgICAgICAgdGhpcy5vbkF1dG9yZWNvbm5lY3RJdGVyYXRpb24oLTEpO1xuICAgICAgfVxuICAgIH0sIHRpbWVvdXQpO1xuICB9XG5cbiAgLy8gVGVybWluYXRlIGF1dG8tcmVjb25uZWN0IHByb2Nlc3MuXG4gICNib2ZmU3RvcCgpIHtcbiAgICBjbGVhclRpbWVvdXQodGhpcy4jYm9mZlRpbWVyKTtcbiAgICB0aGlzLiNib2ZmVGltZXIgPSBudWxsO1xuICB9XG5cbiAgLy8gUmVzZXQgYXV0by1yZWNvbm5lY3QgaXRlcmF0aW9uIGNvdW50ZXIuXG4gICNib2ZmUmVzZXQoKSB7XG4gICAgdGhpcy4jYm9mZkl0ZXJhdGlvbiA9IDA7XG4gIH1cblxuICAvLyBJbml0aWFsaXphdGlvbiBmb3IgbG9uZyBwb2xsaW5nLlxuICAjaW5pdF9scCgpIHtcbiAgICBjb25zdCBYRFJfVU5TRU5UID0gMDsgLy8gQ2xpZW50IGhhcyBiZWVuIGNyZWF0ZWQuIG9wZW4oKSBub3QgY2FsbGVkIHlldC5cbiAgICBjb25zdCBYRFJfT1BFTkVEID0gMTsgLy8gb3BlbigpIGhhcyBiZWVuIGNhbGxlZC5cbiAgICBjb25zdCBYRFJfSEVBREVSU19SRUNFSVZFRCA9IDI7IC8vIHNlbmQoKSBoYXMgYmVlbiBjYWxsZWQsIGFuZCBoZWFkZXJzIGFuZCBzdGF0dXMgYXJlIGF2YWlsYWJsZS5cbiAgICBjb25zdCBYRFJfTE9BRElORyA9IDM7IC8vIERvd25sb2FkaW5nOyByZXNwb25zZVRleHQgaG9sZHMgcGFydGlhbCBkYXRhLlxuICAgIGNvbnN0IFhEUl9ET05FID0gNDsgLy8gVGhlIG9wZXJhdGlvbiBpcyBjb21wbGV0ZS5cblxuICAgIC8vIEZ1bGx5IGNvbXBvc2VkIGVuZHBvaW50IFVSTCwgd2l0aCBBUEkga2V5ICYgU0lEXG4gICAgbGV0IF9scFVSTCA9IG51bGw7XG5cbiAgICBsZXQgX3BvbGxlciA9IG51bGw7XG4gICAgbGV0IF9zZW5kZXIgPSBudWxsO1xuXG4gICAgbGV0IGxwX3NlbmRlciA9ICh1cmxfKSA9PiB7XG4gICAgICBjb25zdCBzZW5kZXIgPSBuZXcgWEhSUHJvdmlkZXIoKTtcbiAgICAgIHNlbmRlci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoZXZ0KSA9PiB7XG4gICAgICAgIGlmIChzZW5kZXIucmVhZHlTdGF0ZSA9PSBYRFJfRE9ORSAmJiBzZW5kZXIuc3RhdHVzID49IDQwMCkge1xuICAgICAgICAgIC8vIFNvbWUgc29ydCBvZiBlcnJvciByZXNwb25zZVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgTFAgc2VuZGVyIGZhaWxlZCwgJHtzZW5kZXIuc3RhdHVzfWApO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBzZW5kZXIub3BlbignUE9TVCcsIHVybF8sIHRydWUpO1xuICAgICAgcmV0dXJuIHNlbmRlcjtcbiAgICB9XG5cbiAgICBsZXQgbHBfcG9sbGVyID0gKHVybF8sIHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgbGV0IHBvbGxlciA9IG5ldyBYSFJQcm92aWRlcigpO1xuICAgICAgbGV0IHByb21pc2VDb21wbGV0ZWQgPSBmYWxzZTtcblxuICAgICAgcG9sbGVyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IChldnQpID0+IHtcbiAgICAgICAgaWYgKHBvbGxlci5yZWFkeVN0YXRlID09IFhEUl9ET05FKSB7XG4gICAgICAgICAgaWYgKHBvbGxlci5zdGF0dXMgPT0gMjAxKSB7IC8vIDIwMSA9PSBIVFRQLkNyZWF0ZWQsIGdldCBTSURcbiAgICAgICAgICAgIGxldCBwa3QgPSBKU09OLnBhcnNlKHBvbGxlci5yZXNwb25zZVRleHQsIGpzb25QYXJzZUhlbHBlcik7XG4gICAgICAgICAgICBfbHBVUkwgPSB1cmxfICsgJyZzaWQ9JyArIHBrdC5jdHJsLnBhcmFtcy5zaWQ7XG4gICAgICAgICAgICBwb2xsZXIgPSBscF9wb2xsZXIoX2xwVVJMKTtcbiAgICAgICAgICAgIHBvbGxlci5zZW5kKG51bGwpO1xuICAgICAgICAgICAgaWYgKHRoaXMub25PcGVuKSB7XG4gICAgICAgICAgICAgIHRoaXMub25PcGVuKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChyZXNvbHZlKSB7XG4gICAgICAgICAgICAgIHByb21pc2VDb21wbGV0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmF1dG9yZWNvbm5lY3QpIHtcbiAgICAgICAgICAgICAgdGhpcy4jYm9mZlN0b3AoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKHBvbGxlci5zdGF0dXMgPCA0MDApIHsgLy8gNDAwID0gSFRUUC5CYWRSZXF1ZXN0XG4gICAgICAgICAgICBpZiAodGhpcy5vbk1lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgdGhpcy5vbk1lc3NhZ2UocG9sbGVyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwb2xsZXIgPSBscF9wb2xsZXIoX2xwVVJMKTtcbiAgICAgICAgICAgIHBvbGxlci5zZW5kKG51bGwpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBEb24ndCB0aHJvdyBhbiBlcnJvciBoZXJlLCBncmFjZWZ1bGx5IGhhbmRsZSBzZXJ2ZXIgZXJyb3JzXG4gICAgICAgICAgICBpZiAocmVqZWN0ICYmICFwcm9taXNlQ29tcGxldGVkKSB7XG4gICAgICAgICAgICAgIHByb21pc2VDb21wbGV0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICByZWplY3QocG9sbGVyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5vbk1lc3NhZ2UgJiYgcG9sbGVyLnJlc3BvbnNlVGV4dCkge1xuICAgICAgICAgICAgICB0aGlzLm9uTWVzc2FnZShwb2xsZXIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLm9uRGlzY29ubmVjdCkge1xuICAgICAgICAgICAgICBjb25zdCBjb2RlID0gcG9sbGVyLnN0YXR1cyB8fCAodGhpcy4jYm9mZkNsb3NlZCA/IE5FVFdPUktfVVNFUiA6IE5FVFdPUktfRVJST1IpO1xuICAgICAgICAgICAgICBjb25zdCB0ZXh0ID0gcG9sbGVyLnJlc3BvbnNlVGV4dCB8fCAodGhpcy4jYm9mZkNsb3NlZCA/IE5FVFdPUktfVVNFUl9URVhUIDogTkVUV09SS19FUlJPUl9URVhUKTtcbiAgICAgICAgICAgICAgdGhpcy5vbkRpc2Nvbm5lY3QobmV3IEVycm9yKHRleHQgKyAnICgnICsgY29kZSArICcpJyksIGNvZGUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBQb2xsaW5nIGhhcyBzdG9wcGVkLiBJbmRpY2F0ZSBpdCBieSBzZXR0aW5nIHBvbGxlciB0byBudWxsLlxuICAgICAgICAgICAgcG9sbGVyID0gbnVsbDtcbiAgICAgICAgICAgIGlmICghdGhpcy4jYm9mZkNsb3NlZCAmJiB0aGlzLmF1dG9yZWNvbm5lY3QpIHtcbiAgICAgICAgICAgICAgdGhpcy4jYm9mZlJlY29ubmVjdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIC8vIFVzaW5nIFBPU1QgdG8gYXZvaWQgY2FjaGluZyByZXNwb25zZSBieSBzZXJ2aWNlIHdvcmtlci5cbiAgICAgIHBvbGxlci5vcGVuKCdQT1NUJywgdXJsXywgdHJ1ZSk7XG4gICAgICByZXR1cm4gcG9sbGVyO1xuICAgIH1cblxuICAgIHRoaXMuY29ubmVjdCA9IChob3N0XywgZm9yY2UpID0+IHtcbiAgICAgIHRoaXMuI2JvZmZDbG9zZWQgPSBmYWxzZTtcblxuICAgICAgaWYgKF9wb2xsZXIpIHtcbiAgICAgICAgaWYgKCFmb3JjZSkge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgICAgICBfcG9sbGVyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgX3BvbGxlci5hYm9ydCgpO1xuICAgICAgICBfcG9sbGVyID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgaWYgKGhvc3RfKSB7XG4gICAgICAgIHRoaXMuaG9zdCA9IGhvc3RfO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBjb25zdCB1cmwgPSBtYWtlQmFzZVVybCh0aGlzLmhvc3QsIHRoaXMuc2VjdXJlID8gJ2h0dHBzJyA6ICdodHRwJywgdGhpcy52ZXJzaW9uLCB0aGlzLmFwaUtleSk7XG4gICAgICAgIENvbm5lY3Rpb24uI2xvZyhcIkxQIGNvbm5lY3RpbmcgdG86XCIsIHVybCk7XG4gICAgICAgIF9wb2xsZXIgPSBscF9wb2xsZXIodXJsLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICBfcG9sbGVyLnNlbmQobnVsbCk7XG4gICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgIENvbm5lY3Rpb24uI2xvZyhcIkxQIGNvbm5lY3Rpb24gZmFpbGVkOlwiLCBlcnIpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIHRoaXMucmVjb25uZWN0ID0gKGZvcmNlKSA9PiB7XG4gICAgICB0aGlzLiNib2ZmU3RvcCgpO1xuICAgICAgdGhpcy5jb25uZWN0KG51bGwsIGZvcmNlKTtcbiAgICB9O1xuXG4gICAgdGhpcy5kaXNjb25uZWN0ID0gKCkgPT4ge1xuICAgICAgdGhpcy4jYm9mZkNsb3NlZCA9IHRydWU7XG4gICAgICB0aGlzLiNib2ZmU3RvcCgpO1xuXG4gICAgICBpZiAoX3NlbmRlcikge1xuICAgICAgICBfc2VuZGVyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgX3NlbmRlci5hYm9ydCgpO1xuICAgICAgICBfc2VuZGVyID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIGlmIChfcG9sbGVyKSB7XG4gICAgICAgIF9wb2xsZXIub25yZWFkeXN0YXRlY2hhbmdlID0gdW5kZWZpbmVkO1xuICAgICAgICBfcG9sbGVyLmFib3J0KCk7XG4gICAgICAgIF9wb2xsZXIgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5vbkRpc2Nvbm5lY3QpIHtcbiAgICAgICAgdGhpcy5vbkRpc2Nvbm5lY3QobmV3IEVycm9yKE5FVFdPUktfVVNFUl9URVhUICsgJyAoJyArIE5FVFdPUktfVVNFUiArICcpJyksIE5FVFdPUktfVVNFUik7XG4gICAgICB9XG4gICAgICAvLyBFbnN1cmUgaXQncyByZWNvbnN0cnVjdGVkXG4gICAgICBfbHBVUkwgPSBudWxsO1xuICAgIH07XG5cbiAgICB0aGlzLnNlbmRUZXh0ID0gKG1zZykgPT4ge1xuICAgICAgX3NlbmRlciA9IGxwX3NlbmRlcihfbHBVUkwpO1xuICAgICAgaWYgKF9zZW5kZXIgJiYgKF9zZW5kZXIucmVhZHlTdGF0ZSA9PSBYRFJfT1BFTkVEKSkgeyAvLyAxID09IE9QRU5FRFxuICAgICAgICBfc2VuZGVyLnNlbmQobXNnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkxvbmcgcG9sbGVyIGZhaWxlZCB0byBjb25uZWN0XCIpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLmlzQ29ubmVjdGVkID0gKCkgPT4ge1xuICAgICAgcmV0dXJuIChfcG9sbGVyICYmIHRydWUpO1xuICAgIH07XG4gIH1cblxuICAvLyBJbml0aWFsaXphdGlvbiBmb3IgV2Vic29ja2V0XG4gICNpbml0X3dzKCkge1xuICAgIHRoaXMuY29ubmVjdCA9IChob3N0XywgZm9yY2UpID0+IHtcbiAgICAgIHRoaXMuI2JvZmZDbG9zZWQgPSBmYWxzZTtcblxuICAgICAgaWYgKHRoaXMuI3NvY2tldCkge1xuICAgICAgICBpZiAoIWZvcmNlICYmIHRoaXMuI3NvY2tldC5yZWFkeVN0YXRlID09IHRoaXMuI3NvY2tldC5PUEVOKSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuI3NvY2tldC5jbG9zZSgpO1xuICAgICAgICB0aGlzLiNzb2NrZXQgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBpZiAoaG9zdF8pIHtcbiAgICAgICAgdGhpcy5ob3N0ID0gaG9zdF87XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGNvbnN0IHVybCA9IG1ha2VCYXNlVXJsKHRoaXMuaG9zdCwgdGhpcy5zZWN1cmUgPyAnd3NzJyA6ICd3cycsIHRoaXMudmVyc2lvbiwgdGhpcy5hcGlLZXkpO1xuXG4gICAgICAgIENvbm5lY3Rpb24uI2xvZyhcIldTIGNvbm5lY3RpbmcgdG86IFwiLCB1cmwpO1xuXG4gICAgICAgIC8vIEl0IHRocm93cyB3aGVuIHRoZSBzZXJ2ZXIgaXMgbm90IGFjY2Vzc2libGUgYnV0IHRoZSBleGNlcHRpb24gY2Fubm90IGJlIGNhdWdodDpcbiAgICAgICAgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzEwMDI1OTIvamF2YXNjcmlwdC1kb2VzbnQtY2F0Y2gtZXJyb3ItaW4td2Vic29ja2V0LWluc3RhbnRpYXRpb24vMzEwMDMwNTdcbiAgICAgICAgY29uc3QgY29ubiA9IG5ldyBXZWJTb2NrZXRQcm92aWRlcih1cmwpO1xuXG4gICAgICAgIGNvbm4ub25lcnJvciA9IChlcnIpID0+IHtcbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25uLm9ub3BlbiA9IChldnQpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5hdXRvcmVjb25uZWN0KSB7XG4gICAgICAgICAgICB0aGlzLiNib2ZmU3RvcCgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh0aGlzLm9uT3Blbikge1xuICAgICAgICAgICAgdGhpcy5vbk9wZW4oKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29ubi5vbmNsb3NlID0gKGV2dCkgPT4ge1xuICAgICAgICAgIHRoaXMuI3NvY2tldCA9IG51bGw7XG5cbiAgICAgICAgICBpZiAodGhpcy5vbkRpc2Nvbm5lY3QpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvZGUgPSB0aGlzLiNib2ZmQ2xvc2VkID8gTkVUV09SS19VU0VSIDogTkVUV09SS19FUlJPUjtcbiAgICAgICAgICAgIHRoaXMub25EaXNjb25uZWN0KG5ldyBFcnJvcih0aGlzLiNib2ZmQ2xvc2VkID8gTkVUV09SS19VU0VSX1RFWFQgOiBORVRXT1JLX0VSUk9SX1RFWFQgK1xuICAgICAgICAgICAgICAnICgnICsgY29kZSArICcpJyksIGNvZGUpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghdGhpcy4jYm9mZkNsb3NlZCAmJiB0aGlzLmF1dG9yZWNvbm5lY3QpIHtcbiAgICAgICAgICAgIHRoaXMuI2JvZmZSZWNvbm5lY3QoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgY29ubi5vbm1lc3NhZ2UgPSAoZXZ0KSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMub25NZXNzYWdlKSB7XG4gICAgICAgICAgICB0aGlzLm9uTWVzc2FnZShldnQuZGF0YSk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuI3NvY2tldCA9IGNvbm47XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLnJlY29ubmVjdCA9IChmb3JjZSkgPT4ge1xuICAgICAgdGhpcy4jYm9mZlN0b3AoKTtcbiAgICAgIHRoaXMuY29ubmVjdChudWxsLCBmb3JjZSk7XG4gICAgfTtcblxuICAgIHRoaXMuZGlzY29ubmVjdCA9ICgpID0+IHtcbiAgICAgIHRoaXMuI2JvZmZDbG9zZWQgPSB0cnVlO1xuICAgICAgdGhpcy4jYm9mZlN0b3AoKTtcblxuICAgICAgaWYgKCF0aGlzLiNzb2NrZXQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy4jc29ja2V0LmNsb3NlKCk7XG4gICAgICB0aGlzLiNzb2NrZXQgPSBudWxsO1xuICAgIH07XG5cbiAgICB0aGlzLnNlbmRUZXh0ID0gKG1zZykgPT4ge1xuICAgICAgaWYgKHRoaXMuI3NvY2tldCAmJiAodGhpcy4jc29ja2V0LnJlYWR5U3RhdGUgPT0gdGhpcy4jc29ja2V0Lk9QRU4pKSB7XG4gICAgICAgIHRoaXMuI3NvY2tldC5zZW5kKG1zZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJXZWJzb2NrZXQgaXMgbm90IGNvbm5lY3RlZFwiKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5pc0Nvbm5lY3RlZCA9ICgpID0+IHtcbiAgICAgIHJldHVybiAodGhpcy4jc29ja2V0ICYmICh0aGlzLiNzb2NrZXQucmVhZHlTdGF0ZSA9PSB0aGlzLiNzb2NrZXQuT1BFTikpO1xuICAgIH07XG4gIH1cblxuICAvLyBDYWxsYmFja3M6XG5cbiAgLyoqXG4gICAqIEEgY2FsbGJhY2sgdG8gcGFzcyBpbmNvbWluZyBtZXNzYWdlcyB0by4gU2VlIHtAbGluayBUaW5vZGUuQ29ubmVjdGlvbiNvbk1lc3NhZ2V9LlxuICAgKiBAY2FsbGJhY2sgVGlub2RlLkNvbm5lY3Rpb24uT25NZXNzYWdlXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ29ubmVjdGlvblxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSAtIE1lc3NhZ2UgdG8gcHJvY2Vzcy5cbiAgICovXG4gIG9uTWVzc2FnZSA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQSBjYWxsYmFjayBmb3IgcmVwb3J0aW5nIGEgZHJvcHBlZCBjb25uZWN0aW9uLlxuICAgKiBAdHlwZSB7ZnVuY3Rpb259XG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ29ubmVjdGlvbiNcbiAgICovXG4gIG9uRGlzY29ubmVjdCA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQSBjYWxsYmFjayBjYWxsZWQgd2hlbiB0aGUgY29ubmVjdGlvbiBpcyByZWFkeSB0byBiZSB1c2VkIGZvciBzZW5kaW5nLiBGb3Igd2Vic29ja2V0cyBpdCdzIHNvY2tldCBvcGVuLFxuICAgKiBmb3IgbG9uZyBwb2xsaW5nIGl0J3MgPGNvZGU+cmVhZHlTdGF0ZT0xPC9jb2RlPiAoT1BFTkVEKVxuICAgKiBAdHlwZSB7ZnVuY3Rpb259XG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ29ubmVjdGlvbiNcbiAgICovXG4gIG9uT3BlbiA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQSBjYWxsYmFjayB0byBub3RpZnkgb2YgcmVjb25uZWN0aW9uIGF0dGVtcHRzLiBTZWUge0BsaW5rIFRpbm9kZS5Db25uZWN0aW9uI29uQXV0b3JlY29ubmVjdEl0ZXJhdGlvbn0uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ29ubmVjdGlvblxuICAgKiBAY2FsbGJhY2sgQXV0b3JlY29ubmVjdEl0ZXJhdGlvblR5cGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRpbWVvdXQgLSB0aW1lIHRpbGwgdGhlIG5leHQgcmVjb25uZWN0IGF0dGVtcHQgaW4gbWlsbGlzZWNvbmRzLiA8Y29kZT4tMTwvY29kZT4gbWVhbnMgcmVjb25uZWN0IHdhcyBza2lwcGVkLlxuICAgKiBAcGFyYW0ge1Byb21pc2V9IHByb21pc2UgcmVzb2x2ZWQgb3IgcmVqZWN0ZWQgd2hlbiB0aGUgcmVjb25uZWN0IGF0dGVtcCBjb21wbGV0ZXMuXG4gICAqXG4gICAqL1xuICAvKipcbiAgICogQSBjYWxsYmFjayB0byBpbmZvcm0gd2hlbiB0aGUgbmV4dCBhdHRhbXB0IHRvIHJlY29ubmVjdCB3aWxsIGhhcHBlbiBhbmQgdG8gcmVjZWl2ZSBjb25uZWN0aW9uIHByb21pc2UuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ29ubmVjdGlvbiNcbiAgICogQHR5cGUge1Rpbm9kZS5Db25uZWN0aW9uLkF1dG9yZWNvbm5lY3RJdGVyYXRpb25UeXBlfVxuICAgKi9cbiAgb25BdXRvcmVjb25uZWN0SXRlcmF0aW9uID0gdW5kZWZpbmVkO1xufVxuXG5Db25uZWN0aW9uLk5FVFdPUktfRVJST1IgPSBORVRXT1JLX0VSUk9SO1xuQ29ubmVjdGlvbi5ORVRXT1JLX0VSUk9SX1RFWFQgPSBORVRXT1JLX0VSUk9SX1RFWFQ7XG5Db25uZWN0aW9uLk5FVFdPUktfVVNFUiA9IE5FVFdPUktfVVNFUjtcbkNvbm5lY3Rpb24uTkVUV09SS19VU0VSX1RFWFQgPSBORVRXT1JLX1VTRVJfVEVYVDtcbiIsIi8qKlxuICogQGZpbGUgSGVscGVyIG1ldGhvZHMgZm9yIGRlYWxpbmcgd2l0aCBJbmRleGVkREIgY2FjaGUgb2YgbWVzc2FnZXMsIHVzZXJzLCBhbmQgdG9waWNzLlxuICpcbiAqIEBjb3B5cmlnaHQgMjAxNS0yMDIyIFRpbm9kZSBMTEMuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuLy8gTk9URSBUTyBERVZFTE9QRVJTOlxuLy8gTG9jYWxpemFibGUgc3RyaW5ncyBzaG91bGQgYmUgZG91YmxlIHF1b3RlZCBcItGB0YLRgNC+0LrQsCDQvdCwINC00YDRg9Cz0L7QvCDRj9C30YvQutC1XCIsXG4vLyBub24tbG9jYWxpemFibGUgc3RyaW5ncyBzaG91bGQgYmUgc2luZ2xlIHF1b3RlZCAnbm9uLWxvY2FsaXplZCcuXG5cbmNvbnN0IERCX1ZFUlNJT04gPSAxO1xuY29uc3QgREJfTkFNRSA9ICd0aW5vZGUtd2ViJztcblxubGV0IElEQlByb3ZpZGVyO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEQiB7XG4gICNvbkVycm9yID0gXyA9PiB7fTtcbiAgI2xvZ2dlciA9IF8gPT4ge307XG5cbiAgLy8gSW5zdGFuY2Ugb2YgSW5kZXhEQi5cbiAgZGIgPSBudWxsO1xuICAvLyBJbmRpY2F0b3IgdGhhdCB0aGUgY2FjaGUgaXMgZGlzYWJsZWQuXG4gIGRpc2FibGVkID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3Iob25FcnJvciwgbG9nZ2VyKSB7XG4gICAgdGhpcy4jb25FcnJvciA9IG9uRXJyb3IgfHwgdGhpcy4jb25FcnJvcjtcbiAgICB0aGlzLiNsb2dnZXIgPSBsb2dnZXIgfHwgdGhpcy4jbG9nZ2VyO1xuICB9XG5cbiAgI21hcE9iamVjdHMoc291cmNlLCBjYWxsYmFjaywgY29udGV4dCkge1xuICAgIGlmICghdGhpcy5kYikge1xuICAgICAgcmV0dXJuIGRpc2FibGVkID9cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKFtdKSA6XG4gICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIm5vdCBpbml0aWFsaXplZFwiKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHRyeCA9IHRoaXMuZGIudHJhbnNhY3Rpb24oW3NvdXJjZV0pO1xuICAgICAgdHJ4Lm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCAnbWFwT2JqZWN0cycsIHNvdXJjZSwgZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9iamVjdFN0b3JlKHNvdXJjZSkuZ2V0QWxsKCkub25zdWNjZXNzID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgIGV2ZW50LnRhcmdldC5yZXN1bHQuZm9yRWFjaCgodG9waWMpID0+IHtcbiAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgdG9waWMpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJlc29sdmUoZXZlbnQudGFyZ2V0LnJlc3VsdCk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgcGVyc2lzdGVudCBjYWNoZTogb3BlbiBvciBjcmVhdGUvdXBncmFkZSBpZiBuZWVkZWQuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBwcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIERCIGlzIGluaXRpYWxpemVkLlxuICAgKi9cbiAgaW5pdERhdGFiYXNlKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAvLyBPcGVuIHRoZSBkYXRhYmFzZSBhbmQgaW5pdGlhbGl6ZSBjYWxsYmFja3MuXG4gICAgICBjb25zdCByZXEgPSBJREJQcm92aWRlci5vcGVuKERCX05BTUUsIERCX1ZFUlNJT04pO1xuICAgICAgcmVxLm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLmRiID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcbiAgICAgICAgdGhpcy5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICByZXNvbHZlKHRoaXMuZGIpO1xuICAgICAgfTtcbiAgICAgIHJlcS5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgXCJmYWlsZWQgdG8gaW5pdGlhbGl6ZVwiLCBldmVudCk7XG4gICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICB0aGlzLiNvbkVycm9yKGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICB9O1xuICAgICAgcmVxLm9udXBncmFkZW5lZWRlZCA9IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLmRiID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcblxuICAgICAgICB0aGlzLmRiLm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsIFwiZmFpbGVkIHRvIGNyZWF0ZSBzdG9yYWdlXCIsIGV2ZW50KTtcbiAgICAgICAgICB0aGlzLiNvbkVycm9yKGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gSW5kaXZpZHVhbCBvYmplY3Qgc3RvcmVzLlxuICAgICAgICAvLyBPYmplY3Qgc3RvcmUgKHRhYmxlKSBmb3IgdG9waWNzLiBUaGUgcHJpbWFyeSBrZXkgaXMgdG9waWMgbmFtZS5cbiAgICAgICAgdGhpcy5kYi5jcmVhdGVPYmplY3RTdG9yZSgndG9waWMnLCB7XG4gICAgICAgICAga2V5UGF0aDogJ25hbWUnXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFVzZXJzIG9iamVjdCBzdG9yZS4gVUlEIGlzIHRoZSBwcmltYXJ5IGtleS5cbiAgICAgICAgdGhpcy5kYi5jcmVhdGVPYmplY3RTdG9yZSgndXNlcicsIHtcbiAgICAgICAgICBrZXlQYXRoOiAndWlkJ1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBTdWJzY3JpcHRpb25zIG9iamVjdCBzdG9yZSB0b3BpYyA8LT4gdXNlci4gVG9waWMgbmFtZSArIFVJRCBpcyB0aGUgcHJpbWFyeSBrZXkuXG4gICAgICAgIHRoaXMuZGIuY3JlYXRlT2JqZWN0U3RvcmUoJ3N1YnNjcmlwdGlvbicsIHtcbiAgICAgICAgICBrZXlQYXRoOiBbJ3RvcGljJywgJ3VpZCddXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIE1lc3NhZ2VzIG9iamVjdCBzdG9yZS4gVGhlIHByaW1hcnkga2V5IGlzIHRvcGljIG5hbWUgKyBzZXEuXG4gICAgICAgIHRoaXMuZGIuY3JlYXRlT2JqZWN0U3RvcmUoJ21lc3NhZ2UnLCB7XG4gICAgICAgICAga2V5UGF0aDogWyd0b3BpYycsICdzZXEnXVxuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRGVsZXRlIHBlcnNpc3RlbnQgY2FjaGUuXG4gICAqL1xuICBkZWxldGVEYXRhYmFzZSgpIHtcbiAgICAvLyBDbG9zZSBjb25uZWN0aW9uLCBvdGhlcndpc2Ugb3BlcmF0aW9ucyB3aWxsIGZhaWwgd2l0aCAnb25ibG9ja2VkJy5cbiAgICBpZiAodGhpcy5kYikge1xuICAgICAgdGhpcy5kYi5jbG9zZSgpO1xuICAgICAgdGhpcy5kYiA9IG51bGw7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCByZXEgPSBJREJQcm92aWRlci5kZWxldGVEYXRhYmFzZShEQl9OQU1FKTtcbiAgICAgIHJlcS5vbmJsb2NrZWQgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuZGIpIHtcbiAgICAgICAgICB0aGlzLmRiLmNsb3NlKCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZXJyID0gbmV3IEVycm9yKFwiYmxvY2tlZFwiKTtcbiAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCAnZGVsZXRlRGF0YWJhc2UnLCBlcnIpO1xuICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgIH07XG4gICAgICByZXEub25zdWNjZXNzID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuZGIgPSBudWxsO1xuICAgICAgICB0aGlzLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgIH07XG4gICAgICByZXEub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsICdkZWxldGVEYXRhYmFzZScsIGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBwZXJzaXN0ZW50IGNhY2hlIGlzIHJlYWR5IGZvciB1c2UuXG4gICAqIEBtZW1iZXJPZiBEQlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgY2FjaGUgaXMgcmVhZHksIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBpc1JlYWR5KCkge1xuICAgIHJldHVybiAhIXRoaXMuZGI7XG4gIH1cblxuICAvLyBUb3BpY3MuXG5cbiAgLyoqXG4gICAqIFNhdmUgdG8gY2FjaGUgb3IgdXBkYXRlIHRvcGljIGluIHBlcnNpc3RlbnQgY2FjaGUuXG4gICAqIEBtZW1iZXJPZiBEQlxuICAgKiBAcGFyYW0ge1RvcGljfSB0b3BpYyAtIHRvcGljIHRvIGJlIGFkZGVkIG9yIHVwZGF0ZWQuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgKi9cbiAgdXBkVG9waWModG9waWMpIHtcbiAgICBpZiAoIXRoaXMuaXNSZWFkeSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/XG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpIDpcbiAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwibm90IGluaXRpYWxpemVkXCIpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHRyeCA9IHRoaXMuZGIudHJhbnNhY3Rpb24oWyd0b3BpYyddLCAncmVhZHdyaXRlJyk7XG4gICAgICB0cngub25jb21wbGV0ZSA9IChldmVudCkgPT4ge1xuICAgICAgICByZXNvbHZlKGV2ZW50LnRhcmdldC5yZXN1bHQpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgJ3VwZFRvcGljJywgZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICB9O1xuICAgICAgY29uc3QgcmVxID0gdHJ4Lm9iamVjdFN0b3JlKCd0b3BpYycpLmdldCh0b3BpYy5uYW1lKTtcbiAgICAgIHJlcS5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdHJ4Lm9iamVjdFN0b3JlKCd0b3BpYycpLnB1dChEQi4jc2VyaWFsaXplVG9waWMocmVxLnJlc3VsdCwgdG9waWMpKTtcbiAgICAgICAgdHJ4LmNvbW1pdCgpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXJrIG9yIHVubWFyayB0b3BpYyBhcyBkZWxldGVkLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBuYW1lIG9mIHRoZSB0b3BpYyB0byBtYXJrIG9yIHVubWFyay5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCBvbiBvcGVyYXRpb24gY29tcGxldGlvbi5cbiAgICovXG4gIG1hcmtUb3BpY0FzRGVsZXRlZChuYW1lKSB7XG4gICAgaWYgKCF0aGlzLmlzUmVhZHkoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgP1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKSA6XG4gICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIm5vdCBpbml0aWFsaXplZFwiKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB0cnggPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFsndG9waWMnXSwgJ3JlYWR3cml0ZScpO1xuICAgICAgdHJ4Lm9uY29tcGxldGUgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgcmVzb2x2ZShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgIH07XG4gICAgICB0cngub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsICdtYXJrVG9waWNBc0RlbGV0ZWQnLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgICBjb25zdCByZXEgPSB0cngub2JqZWN0U3RvcmUoJ3RvcGljJykuZ2V0KG5hbWUpO1xuICAgICAgcmVxLm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xuICAgICAgICBjb25zdCB0b3BpYyA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XG4gICAgICAgIHRvcGljLl9kZWxldGVkID0gdHJ1ZTtcbiAgICAgICAgdHJ4Lm9iamVjdFN0b3JlKCd0b3BpYycpLnB1dCh0b3BpYyk7XG4gICAgICAgIHRyeC5jb21taXQoKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIHRvcGljIGZyb20gcGVyc2lzdGVudCBjYWNoZS5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gbmFtZSBvZiB0aGUgdG9waWMgdG8gcmVtb3ZlIGZyb20gZGF0YWJhc2UuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gb3BlcmF0aW9uIGNvbXBsZXRpb24uXG4gICAqL1xuICByZW1Ub3BpYyhuYW1lKSB7XG4gICAgaWYgKCF0aGlzLmlzUmVhZHkoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgP1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKSA6XG4gICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIm5vdCBpbml0aWFsaXplZFwiKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB0cnggPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFsndG9waWMnLCAnc3Vic2NyaXB0aW9uJywgJ21lc3NhZ2UnXSwgJ3JlYWR3cml0ZScpO1xuICAgICAgdHJ4Lm9uY29tcGxldGUgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgcmVzb2x2ZShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgIH07XG4gICAgICB0cngub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsICdyZW1Ub3BpYycsIGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vYmplY3RTdG9yZSgndG9waWMnKS5kZWxldGUoSURCS2V5UmFuZ2Uub25seShuYW1lKSk7XG4gICAgICB0cngub2JqZWN0U3RvcmUoJ3N1YnNjcmlwdGlvbicpLmRlbGV0ZShJREJLZXlSYW5nZS5ib3VuZChbbmFtZSwgJy0nXSwgW25hbWUsICd+J10pKTtcbiAgICAgIHRyeC5vYmplY3RTdG9yZSgnbWVzc2FnZScpLmRlbGV0ZShJREJLZXlSYW5nZS5ib3VuZChbbmFtZSwgMF0sIFtuYW1lLCBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUl0pKTtcbiAgICAgIHRyeC5jb21taXQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeGVjdXRlIGEgY2FsbGJhY2sgZm9yIGVhY2ggc3RvcmVkIHRvcGljLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSBmdW5jdGlvbiB0byBjYWxsIGZvciBlYWNoIHRvcGljLlxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCAtIHRoZSB2YWx1ZSBvciA8Y29kZT50aGlzPC9jb2RlPiBpbnNpZGUgdGhlIGNhbGxiYWNrLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgKi9cbiAgbWFwVG9waWNzKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMuI21hcE9iamVjdHMoJ3RvcGljJywgY2FsbGJhY2ssIGNvbnRleHQpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvcHkgZGF0YSBmcm9tIHNlcmlhbGl6ZWQgb2JqZWN0IHRvIHRvcGljLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtUb3BpY30gdG9waWMgLSB0YXJnZXQgdG8gZGVzZXJpYWxpemUgdG8uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzcmMgLSBzZXJpYWxpemVkIGRhdGEgdG8gY29weSBmcm9tLlxuICAgKi9cbiAgZGVzZXJpYWxpemVUb3BpYyh0b3BpYywgc3JjKSB7XG4gICAgREIuI2Rlc2VyaWFsaXplVG9waWModG9waWMsIHNyYyk7XG4gIH1cblxuICAvLyBVc2Vycy5cbiAgLyoqXG4gICAqIEFkZCBvciB1cGRhdGUgdXNlciBvYmplY3QgaW4gdGhlIHBlcnNpc3RlbnQgY2FjaGUuXG4gICAqIEBtZW1iZXJPZiBEQlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gSUQgb2YgdGhlIHVzZXIgdG8gc2F2ZSBvciB1cGRhdGUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwdWIgLSB1c2VyJ3MgPGNvZGU+cHVibGljPC9jb2RlPiBpbmZvcm1hdGlvbi5cbiAgICogQHJldHVybnMge1Byb21pc2V9IHByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gb3BlcmF0aW9uIGNvbXBsZXRpb24uXG4gICAqL1xuICB1cGRVc2VyKHVpZCwgcHViKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyIHx8IHB1YiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBObyBwb2ludCBpbnVwZGF0aW5nIHVzZXIgd2l0aCBpbnZhbGlkIGRhdGEuXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghdGhpcy5pc1JlYWR5KCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpc2FibGVkID9cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkgOlxuICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJub3QgaW5pdGlhbGl6ZWRcIikpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgdHJ4ID0gdGhpcy5kYi50cmFuc2FjdGlvbihbJ3VzZXInXSwgJ3JlYWR3cml0ZScpO1xuICAgICAgdHJ4Lm9uY29tcGxldGUgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgcmVzb2x2ZShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgIH07XG4gICAgICB0cngub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsICd1cGRVc2VyJywgZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9iamVjdFN0b3JlKCd1c2VyJykucHV0KHtcbiAgICAgICAgdWlkOiB1aWQsXG4gICAgICAgIHB1YmxpYzogcHViXG4gICAgICB9KTtcbiAgICAgIHRyeC5jb21taXQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgdXNlciBmcm9tIHBlcnNpc3RlbnQgY2FjaGUuXG4gICAqIEBtZW1iZXJPZiBEQlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gSUQgb2YgdGhlIHVzZXIgdG8gcmVtb3ZlIGZyb20gdGhlIGNhY2hlLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgKi9cbiAgcmVtVXNlcih1aWQpIHtcbiAgICBpZiAoIXRoaXMuaXNSZWFkeSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/XG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpIDpcbiAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwibm90IGluaXRpYWxpemVkXCIpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHRyeCA9IHRoaXMuZGIudHJhbnNhY3Rpb24oWyd1c2VyJ10sICdyZWFkd3JpdGUnKTtcbiAgICAgIHRyeC5vbmNvbXBsZXRlID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHJlc29sdmUoZXZlbnQudGFyZ2V0LnJlc3VsdCk7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCAncmVtVXNlcicsIGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vYmplY3RTdG9yZSgndXNlcicpLmRlbGV0ZShJREJLZXlSYW5nZS5vbmx5KHVpZCkpO1xuICAgICAgdHJ4LmNvbW1pdCgpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGUgYSBjYWxsYmFjayBmb3IgZWFjaCBzdG9yZWQgdXNlci5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0gZnVuY3Rpb24gdG8gY2FsbCBmb3IgZWFjaCB0b3BpYy5cbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSB0aGUgdmFsdWUgb3IgPGNvZGU+dGhpczwvY29kZT4gaW5zaWRlIHRoZSBjYWxsYmFjay5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCBvbiBvcGVyYXRpb24gY29tcGxldGlvbi5cbiAgICovXG4gIG1hcFVzZXJzKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMuI21hcE9iamVjdHMoJ3VzZXInLCBjYWxsYmFjaywgY29udGV4dCk7XG4gIH1cblxuICAvKipcbiAgICogUmVhZCBhIHNpbmdsZSB1c2VyIGZyb20gcGVyc2lzdGVudCBjYWNoZS5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBJRCBvZiB0aGUgdXNlciB0byBmZXRjaCBmcm9tIGNhY2hlLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgKi9cbiAgZ2V0VXNlcih1aWQpIHtcbiAgICBpZiAoIXRoaXMuaXNSZWFkeSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/XG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpIDpcbiAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwibm90IGluaXRpYWxpemVkXCIpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHRyeCA9IHRoaXMuZGIudHJhbnNhY3Rpb24oWyd1c2VyJ10pO1xuICAgICAgdHJ4Lm9uY29tcGxldGUgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgY29uc3QgdXNlciA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XG4gICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgIHVzZXI6IHVzZXIudWlkLFxuICAgICAgICAgIHB1YmxpYzogdXNlci5wdWJsaWNcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCAnZ2V0VXNlcicsIGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vYmplY3RTdG9yZSgndXNlcicpLmdldCh1aWQpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gU3Vic2NyaXB0aW9ucy5cbiAgLyoqXG4gICAqIEFkZCBvciB1cGRhdGUgc3Vic2NyaXB0aW9uIGluIHBlcnNpc3RlbnQgY2FjaGUuXG4gICAqIEBtZW1iZXJPZiBEQlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gbmFtZSBvZiB0aGUgdG9waWMgd2hpY2ggb3ducyB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHVpZCAtIElEIG9mIHRoZSBzdWJzY3JpYmVkIHVzZXIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzdWIgLSBzdWJzY3JpcHRpb24gdG8gc2F2ZS5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCBvbiBvcGVyYXRpb24gY29tcGxldGlvbi5cbiAgICovXG4gIHVwZFN1YnNjcmlwdGlvbih0b3BpY05hbWUsIHVpZCwgc3ViKSB7XG4gICAgaWYgKCF0aGlzLmlzUmVhZHkoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgP1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKSA6XG4gICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIm5vdCBpbml0aWFsaXplZFwiKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB0cnggPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFsnc3Vic2NyaXB0aW9uJ10sICdyZWFkd3JpdGUnKTtcbiAgICAgIHRyeC5vbmNvbXBsZXRlID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHJlc29sdmUoZXZlbnQudGFyZ2V0LnJlc3VsdCk7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCAndXBkU3Vic2NyaXB0aW9uJywgZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9iamVjdFN0b3JlKCdzdWJzY3JpcHRpb24nKS5nZXQoW3RvcGljTmFtZSwgdWlkXSkub25zdWNjZXNzID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRyeC5vYmplY3RTdG9yZSgnc3Vic2NyaXB0aW9uJykucHV0KERCLiNzZXJpYWxpemVTdWJzY3JpcHRpb24oZXZlbnQudGFyZ2V0LnJlc3VsdCwgdG9waWNOYW1lLCB1aWQsIHN1YikpO1xuICAgICAgICB0cnguY29tbWl0KCk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGUgYSBjYWxsYmFjayBmb3IgZWFjaCBjYWNoZWQgc3Vic2NyaXB0aW9uIGluIGEgZ2l2ZW4gdG9waWMuXG4gICAqIEBtZW1iZXJPZiBEQlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gbmFtZSBvZiB0aGUgdG9waWMgd2hpY2ggb3ducyB0aGUgc3Vic2NyaXB0aW9ucy5cbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSBmdW5jdGlvbiB0byBjYWxsIGZvciBlYWNoIHN1YnNjcmlwdGlvbi5cbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSB0aGUgdmFsdWUgb3IgPGNvZGU+dGhpczwvY29kZT4gaW5zaWRlIHRoZSBjYWxsYmFjay5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCBvbiBvcGVyYXRpb24gY29tcGxldGlvbi5cbiAgICovXG4gIG1hcFN1YnNjcmlwdGlvbnModG9waWNOYW1lLCBjYWxsYmFjaywgY29udGV4dCkge1xuICAgIGlmICghdGhpcy5pc1JlYWR5KCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpc2FibGVkID9cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKFtdKSA6XG4gICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIm5vdCBpbml0aWFsaXplZFwiKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB0cnggPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFsnc3Vic2NyaXB0aW9uJ10pO1xuICAgICAgdHJ4Lm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCAnbWFwU3Vic2NyaXB0aW9ucycsIGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vYmplY3RTdG9yZSgnc3Vic2NyaXB0aW9uJykuZ2V0QWxsKElEQktleVJhbmdlLmJvdW5kKFt0b3BpY05hbWUsICctJ10sIFt0b3BpY05hbWUsICd+J10pKS5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgZXZlbnQudGFyZ2V0LnJlc3VsdC5mb3JFYWNoKCh0b3BpYykgPT4ge1xuICAgICAgICAgICAgY2FsbGJhY2suY2FsbChjb250ZXh0LCB0b3BpYyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmVzb2x2ZShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICAvLyBNZXNzYWdlcy5cblxuICAvKipcbiAgICogU2F2ZSBtZXNzYWdlIHRvIHBlcnNpc3RlbnQgY2FjaGUuXG4gICAqIEBtZW1iZXJPZiBEQlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gbmFtZSBvZiB0aGUgdG9waWMgd2hpY2ggb3ducyB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG1zZyAtIG1lc3NhZ2UgdG8gc2F2ZS5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCBvbiBvcGVyYXRpb24gY29tcGxldGlvbi5cbiAgICovXG4gIGFkZE1lc3NhZ2UobXNnKSB7XG4gICAgaWYgKCF0aGlzLmlzUmVhZHkoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgP1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKSA6XG4gICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIm5vdCBpbml0aWFsaXplZFwiKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB0cnggPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFsnbWVzc2FnZSddLCAncmVhZHdyaXRlJyk7XG4gICAgICB0cngub25zdWNjZXNzID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHJlc29sdmUoZXZlbnQudGFyZ2V0LnJlc3VsdCk7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCAnYWRkTWVzc2FnZScsIGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vYmplY3RTdG9yZSgnbWVzc2FnZScpLmFkZChEQi4jc2VyaWFsaXplTWVzc2FnZShudWxsLCBtc2cpKTtcbiAgICAgIHRyeC5jb21taXQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgZGVsaXZlcnkgc3RhdHVzIG9mIGEgbWVzc2FnZSBzdG9yZWQgaW4gcGVyc2lzdGVudCBjYWNoZS5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBuYW1lIG9mIHRoZSB0b3BpYyB3aGljaCBvd25zIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2VxIC0gSUQgb2YgdGhlIG1lc3NhZ2UgdG8gdXBkYXRlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzdGF0dXMgLSBuZXcgZGVsaXZlcnkgc3RhdHVzIG9mIHRoZSBtZXNzYWdlLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgKi9cbiAgdXBkTWVzc2FnZVN0YXR1cyh0b3BpY05hbWUsIHNlcSwgc3RhdHVzKSB7XG4gICAgaWYgKCF0aGlzLmlzUmVhZHkoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgP1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKSA6XG4gICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIm5vdCBpbml0aWFsaXplZFwiKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB0cnggPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFsnbWVzc2FnZSddLCAncmVhZHdyaXRlJyk7XG4gICAgICB0cngub25zdWNjZXNzID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHJlc29sdmUoZXZlbnQudGFyZ2V0LnJlc3VsdCk7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCAndXBkTWVzc2FnZVN0YXR1cycsIGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgfTtcbiAgICAgIGNvbnN0IHJlcSA9IHRyeC5vYmplY3RTdG9yZSgnbWVzc2FnZScpLmdldChJREJLZXlSYW5nZS5vbmx5KFt0b3BpY05hbWUsIHNlcV0pKTtcbiAgICAgIHJlcS5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgY29uc3Qgc3JjID0gcmVxLnJlc3VsdCB8fCBldmVudC50YXJnZXQucmVzdWx0O1xuICAgICAgICBpZiAoIXNyYyB8fCBzcmMuX3N0YXR1cyA9PSBzdGF0dXMpIHtcbiAgICAgICAgICB0cnguY29tbWl0KCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRyeC5vYmplY3RTdG9yZSgnbWVzc2FnZScpLnB1dChEQi4jc2VyaWFsaXplTWVzc2FnZShzcmMsIHtcbiAgICAgICAgICB0b3BpYzogdG9waWNOYW1lLFxuICAgICAgICAgIHNlcTogc2VxLFxuICAgICAgICAgIF9zdGF0dXM6IHN0YXR1c1xuICAgICAgICB9KSk7XG4gICAgICAgIHRyeC5jb21taXQoKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIG9uZSBvciBtb3JlIG1lc3NhZ2VzIGZyb20gcGVyc2lzdGVudCBjYWNoZS5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBuYW1lIG9mIHRoZSB0b3BpYyB3aGljaCBvd25zIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge251bWJlcn0gZnJvbSAtIGlkIG9mIHRoZSBtZXNzYWdlIHRvIHJlbW92ZSBvciBsb3dlciBib3VuZGFyeSB3aGVuIHJlbW92aW5nIHJhbmdlIChpbmNsdXNpdmUpLlxuICAgKiBAcGFyYW0ge251bWJlcj19IHRvIC0gdXBwZXIgYm91bmRhcnkgKGV4Y2x1c2l2ZSkgd2hlbiByZW1vdmluZyBhIHJhbmdlIG9mIG1lc3NhZ2VzLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgKi9cbiAgcmVtTWVzc2FnZXModG9waWNOYW1lLCBmcm9tLCB0bykge1xuICAgIGlmICghdGhpcy5pc1JlYWR5KCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpc2FibGVkID9cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkgOlxuICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJub3QgaW5pdGlhbGl6ZWRcIikpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgaWYgKCFmcm9tICYmICF0bykge1xuICAgICAgICBmcm9tID0gMDtcbiAgICAgICAgdG8gPSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHJhbmdlID0gdG8gPiAwID8gSURCS2V5UmFuZ2UuYm91bmQoW3RvcGljTmFtZSwgZnJvbV0sIFt0b3BpY05hbWUsIHRvXSwgZmFsc2UsIHRydWUpIDpcbiAgICAgICAgSURCS2V5UmFuZ2Uub25seShbdG9waWNOYW1lLCBmcm9tXSk7XG4gICAgICBjb25zdCB0cnggPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFsnbWVzc2FnZSddLCAncmVhZHdyaXRlJyk7XG4gICAgICB0cngub25zdWNjZXNzID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHJlc29sdmUoZXZlbnQudGFyZ2V0LnJlc3VsdCk7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCAncmVtTWVzc2FnZXMnLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgICB0cngub2JqZWN0U3RvcmUoJ21lc3NhZ2UnKS5kZWxldGUocmFuZ2UpO1xuICAgICAgdHJ4LmNvbW1pdCgpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIG1lc3NhZ2VzIGZyb20gcGVyc2lzdGVudCBzdG9yZS5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBuYW1lIG9mIHRoZSB0b3BpYyB0byByZXRyaWV2ZSBtZXNzYWdlcyBmcm9tLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayB0byBjYWxsIGZvciBlYWNoIHJldHJpZXZlZCBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gcXVlcnkgLSBwYXJhbWV0ZXJzIG9mIHRoZSBtZXNzYWdlIHJhbmdlIHRvIHJldHJpZXZlLlxuICAgKiBAcGFyYW0ge251bWJlcj19IHF1ZXJ5LnNpbmNlIC0gdGhlIGxlYXN0IG1lc3NhZ2UgSUQgdG8gcmV0cmlldmUgKGluY2x1c2l2ZSkuXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gcXVlcnkuYmVmb3JlIC0gdGhlIGdyZWF0ZXN0IG1lc3NhZ2UgSUQgdG8gcmV0cmlldmUgKGV4Y2x1c2l2ZSkuXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gcXVlcnkubGltaXQgLSB0aGUgbWF4aW11bSBudW1iZXIgb2YgbWVzc2FnZXMgdG8gcmV0cmlldmUuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gb3BlcmF0aW9uIGNvbXBsZXRpb24uXG4gICAqL1xuICByZWFkTWVzc2FnZXModG9waWNOYW1lLCBxdWVyeSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICBpZiAoIXRoaXMuaXNSZWFkeSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/XG4gICAgICAgIFByb21pc2UucmVzb2x2ZShbXSkgOlxuICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJub3QgaW5pdGlhbGl6ZWRcIikpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgcXVlcnkgPSBxdWVyeSB8fCB7fTtcbiAgICAgIGNvbnN0IHNpbmNlID0gcXVlcnkuc2luY2UgPiAwID8gcXVlcnkuc2luY2UgOiAwO1xuICAgICAgY29uc3QgYmVmb3JlID0gcXVlcnkuYmVmb3JlID4gMCA/IHF1ZXJ5LmJlZm9yZSA6IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xuICAgICAgY29uc3QgbGltaXQgPSBxdWVyeS5saW1pdCB8IDA7XG5cbiAgICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuICAgICAgY29uc3QgcmFuZ2UgPSBJREJLZXlSYW5nZS5ib3VuZChbdG9waWNOYW1lLCBzaW5jZV0sIFt0b3BpY05hbWUsIGJlZm9yZV0sIGZhbHNlLCB0cnVlKTtcbiAgICAgIGNvbnN0IHRyeCA9IHRoaXMuZGIudHJhbnNhY3Rpb24oWydtZXNzYWdlJ10pO1xuICAgICAgdHJ4Lm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCAncmVhZE1lc3NhZ2VzJywgZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICB9O1xuICAgICAgLy8gSXRlcmF0ZSBpbiBkZXNjZW5kaW5nIG9yZGVyLlxuICAgICAgdHJ4Lm9iamVjdFN0b3JlKCdtZXNzYWdlJykub3BlbkN1cnNvcihyYW5nZSwgJ3ByZXYnKS5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgY29uc3QgY3Vyc29yID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcbiAgICAgICAgaWYgKGN1cnNvcikge1xuICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgY2FsbGJhY2suY2FsbChjb250ZXh0LCBjdXJzb3IudmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXN1bHQucHVzaChjdXJzb3IudmFsdWUpO1xuICAgICAgICAgIGlmIChsaW1pdCA8PSAwIHx8IHJlc3VsdC5sZW5ndGggPCBsaW1pdCkge1xuICAgICAgICAgICAgY3Vyc29yLmNvbnRpbnVlKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgLy8gUHJpdmF0ZSBtZXRob2RzLlxuXG4gIC8vIFNlcmlhbGl6YWJsZSB0b3BpYyBmaWVsZHMuXG4gIHN0YXRpYyAjdG9waWNfZmllbGRzID0gWydjcmVhdGVkJywgJ3VwZGF0ZWQnLCAnZGVsZXRlZCcsICdyZWFkJywgJ3JlY3YnLCAnc2VxJywgJ2NsZWFyJywgJ2RlZmFjcycsXG4gICAgJ2NyZWRzJywgJ3B1YmxpYycsICd0cnVzdGVkJywgJ3ByaXZhdGUnLCAndG91Y2hlZCcsICdfZGVsZXRlZCdcbiAgXTtcblxuICAvLyBDb3B5IGRhdGEgZnJvbSBzcmMgdG8gVG9waWMgb2JqZWN0LlxuICBzdGF0aWMgI2Rlc2VyaWFsaXplVG9waWModG9waWMsIHNyYykge1xuICAgIERCLiN0b3BpY19maWVsZHMuZm9yRWFjaCgoZikgPT4ge1xuICAgICAgaWYgKHNyYy5oYXNPd25Qcm9wZXJ0eShmKSkge1xuICAgICAgICB0b3BpY1tmXSA9IHNyY1tmXTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShzcmMudGFncykpIHtcbiAgICAgIHRvcGljLl90YWdzID0gc3JjLnRhZ3M7XG4gICAgfVxuICAgIGlmIChzcmMuYWNzKSB7XG4gICAgICB0b3BpYy5zZXRBY2Nlc3NNb2RlKHNyYy5hY3MpO1xuICAgIH1cbiAgICB0b3BpYy5zZXEgfD0gMDtcbiAgICB0b3BpYy5yZWFkIHw9IDA7XG4gICAgdG9waWMudW5yZWFkID0gTWF0aC5tYXgoMCwgdG9waWMuc2VxIC0gdG9waWMucmVhZCk7XG4gIH1cblxuICAvLyBDb3B5IHZhbHVlcyBmcm9tICdzcmMnIHRvICdkc3QnLiBBbGxvY2F0ZSBkc3QgaWYgaXQncyBudWxsIG9yIHVuZGVmaW5lZC5cbiAgc3RhdGljICNzZXJpYWxpemVUb3BpYyhkc3QsIHNyYykge1xuICAgIGNvbnN0IHJlcyA9IGRzdCB8fCB7XG4gICAgICBuYW1lOiBzcmMubmFtZVxuICAgIH07XG4gICAgREIuI3RvcGljX2ZpZWxkcy5mb3JFYWNoKChmKSA9PiB7XG4gICAgICBpZiAoc3JjLmhhc093blByb3BlcnR5KGYpKSB7XG4gICAgICAgIHJlc1tmXSA9IHNyY1tmXTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShzcmMuX3RhZ3MpKSB7XG4gICAgICByZXMudGFncyA9IHNyYy5fdGFncztcbiAgICB9XG4gICAgaWYgKHNyYy5hY3MpIHtcbiAgICAgIHJlcy5hY3MgPSBzcmMuZ2V0QWNjZXNzTW9kZSgpLmpzb25IZWxwZXIoKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIHN0YXRpYyAjc2VyaWFsaXplU3Vic2NyaXB0aW9uKGRzdCwgdG9waWNOYW1lLCB1aWQsIHN1Yikge1xuICAgIGNvbnN0IGZpZWxkcyA9IFsndXBkYXRlZCcsICdtb2RlJywgJ3JlYWQnLCAncmVjdicsICdjbGVhcicsICdsYXN0U2VlbicsICd1c2VyQWdlbnQnXTtcbiAgICBjb25zdCByZXMgPSBkc3QgfHwge1xuICAgICAgdG9waWM6IHRvcGljTmFtZSxcbiAgICAgIHVpZDogdWlkXG4gICAgfTtcblxuICAgIGZpZWxkcy5mb3JFYWNoKChmKSA9PiB7XG4gICAgICBpZiAoc3ViLmhhc093blByb3BlcnR5KGYpKSB7XG4gICAgICAgIHJlc1tmXSA9IHN1YltmXTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiByZXM7XG4gIH1cblxuICBzdGF0aWMgI3NlcmlhbGl6ZU1lc3NhZ2UoZHN0LCBtc2cpIHtcbiAgICAvLyBTZXJpYWxpemFibGUgZmllbGRzLlxuICAgIGNvbnN0IGZpZWxkcyA9IFsndG9waWMnLCAnc2VxJywgJ3RzJywgJ19zdGF0dXMnLCAnZnJvbScsICdoZWFkJywgJ2NvbnRlbnQnXTtcbiAgICBjb25zdCByZXMgPSBkc3QgfHwge307XG4gICAgZmllbGRzLmZvckVhY2goKGYpID0+IHtcbiAgICAgIGlmIChtc2cuaGFzT3duUHJvcGVydHkoZikpIHtcbiAgICAgICAgcmVzW2ZdID0gbXNnW2ZdO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXM7XG4gIH1cblxuICAvKipcbiAgICogVG8gdXNlIERCIGluIGEgbm9uIGJyb3dzZXIgY29udGV4dCwgc3VwcGx5IGluZGV4ZWREQiBwcm92aWRlci5cbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyb2YgREJcbiAgICogQHBhcmFtIGlkYlByb3ZpZGVyIGluZGV4ZWREQiBwcm92aWRlciwgZS5nLiBmb3Igbm9kZSA8Y29kZT5yZXF1aXJlKCdmYWtlLWluZGV4ZWRkYicpPC9jb2RlPi5cbiAgICovXG4gIHN0YXRpYyBzZXREYXRhYmFzZVByb3ZpZGVyKGlkYlByb3ZpZGVyKSB7XG4gICAgSURCUHJvdmlkZXIgPSBpZGJQcm92aWRlcjtcbiAgfVxufVxuIiwiLyoqXG4gKiBAY29weXJpZ2h0IDIwMTUtMjAyMiBUaW5vZGUgTExDLlxuICogQHN1bW1hcnkgTWluaW1hbGx5IHJpY2ggdGV4dCByZXByZXNlbnRhdGlvbiBhbmQgZm9ybWF0dGluZyBmb3IgVGlub2RlLlxuICogQGxpY2Vuc2UgQXBhY2hlIDIuMFxuICpcbiAqIEBmaWxlIEJhc2ljIHBhcnNlciBhbmQgZm9ybWF0dGVyIGZvciB2ZXJ5IHNpbXBsZSB0ZXh0IG1hcmt1cC4gTW9zdGx5IHRhcmdldGVkIGF0XG4gKiBtb2JpbGUgdXNlIGNhc2VzIHNpbWlsYXIgdG8gVGVsZWdyYW0sIFdoYXRzQXBwLCBhbmQgRkIgTWVzc2VuZ2VyLlxuICpcbiAqIDxwPlN1cHBvcnRzIGNvbnZlcnNpb24gb2YgdXNlciBrZXlib2FyZCBpbnB1dCB0byBmb3JtYXR0ZWQgdGV4dDo8L3A+XG4gKiA8dWw+XG4gKiAgIDxsaT4qYWJjKiAmcmFycjsgPGI+YWJjPC9iPjwvbGk+XG4gKiAgIDxsaT5fYWJjXyAmcmFycjsgPGk+YWJjPC9pPjwvbGk+XG4gKiAgIDxsaT5+YWJjfiAmcmFycjsgPGRlbD5hYmM8L2RlbD48L2xpPlxuICogICA8bGk+YGFiY2AgJnJhcnI7IDx0dD5hYmM8L3R0PjwvbGk+XG4gKiA8L3VsPlxuICogQWxzbyBzdXBwb3J0cyBmb3JtcyBhbmQgYnV0dG9ucy5cbiAqXG4gKiBOZXN0ZWQgZm9ybWF0dGluZyBpcyBzdXBwb3J0ZWQsIGUuZy4gKmFiYyBfZGVmXyogLT4gPGI+YWJjIDxpPmRlZjwvaT48L2I+XG4gKiBVUkxzLCBAbWVudGlvbnMsIGFuZCAjaGFzaHRhZ3MgYXJlIGV4dHJhY3RlZCBhbmQgY29udmVydGVkIGludG8gbGlua3MuXG4gKiBGb3JtcyBhbmQgYnV0dG9ucyBjYW4gYmUgYWRkZWQgcHJvY2VkdXJhbGx5LlxuICogSlNPTiBkYXRhIHJlcHJlc2VudGF0aW9uIGlzIGluc3BpcmVkIGJ5IERyYWZ0LmpzIHJhdyBmb3JtYXR0aW5nLlxuICpcbiAqXG4gKiBAZXhhbXBsZVxuICogVGV4dDpcbiAqIDxwcmU+XG4gKiAgICAgdGhpcyBpcyAqYm9sZCosIGBjb2RlYCBhbmQgX2l0YWxpY18sIH5zdHJpa2V+XG4gKiAgICAgY29tYmluZWQgKmJvbGQgYW5kIF9pdGFsaWNfKlxuICogICAgIGFuIHVybDogaHR0cHM6Ly93d3cuZXhhbXBsZS5jb20vYWJjI2ZyYWdtZW50IGFuZCBhbm90aGVyIF93d3cudGlub2RlLmNvX1xuICogICAgIHRoaXMgaXMgYSBAbWVudGlvbiBhbmQgYSAjaGFzaHRhZyBpbiBhIHN0cmluZ1xuICogICAgIHNlY29uZCAjaGFzaHRhZ1xuICogPC9wcmU+XG4gKlxuICogIFNhbXBsZSBKU09OIHJlcHJlc2VudGF0aW9uIG9mIHRoZSB0ZXh0IGFib3ZlOlxuICogIHtcbiAqICAgICBcInR4dFwiOiBcInRoaXMgaXMgYm9sZCwgY29kZSBhbmQgaXRhbGljLCBzdHJpa2UgY29tYmluZWQgYm9sZCBhbmQgaXRhbGljIGFuIHVybDogaHR0cHM6Ly93d3cuZXhhbXBsZS5jb20vYWJjI2ZyYWdtZW50IFwiICtcbiAqICAgICAgICAgICAgIFwiYW5kIGFub3RoZXIgd3d3LnRpbm9kZS5jbyB0aGlzIGlzIGEgQG1lbnRpb24gYW5kIGEgI2hhc2h0YWcgaW4gYSBzdHJpbmcgc2Vjb25kICNoYXNodGFnXCIsXG4gKiAgICAgXCJmbXRcIjogW1xuICogICAgICAgICB7IFwiYXRcIjo4LCBcImxlblwiOjQsXCJ0cFwiOlwiU1RcIiB9LHsgXCJhdFwiOjE0LCBcImxlblwiOjQsIFwidHBcIjpcIkNPXCIgfSx7IFwiYXRcIjoyMywgXCJsZW5cIjo2LCBcInRwXCI6XCJFTVwifSxcbiAqICAgICAgICAgeyBcImF0XCI6MzEsIFwibGVuXCI6NiwgXCJ0cFwiOlwiRExcIiB9LHsgXCJ0cFwiOlwiQlJcIiwgXCJsZW5cIjoxLCBcImF0XCI6MzcgfSx7IFwiYXRcIjo1NiwgXCJsZW5cIjo2LCBcInRwXCI6XCJFTVwiIH0sXG4gKiAgICAgICAgIHsgXCJhdFwiOjQ3LCBcImxlblwiOjE1LCBcInRwXCI6XCJTVFwiIH0seyBcInRwXCI6XCJCUlwiLCBcImxlblwiOjEsIFwiYXRcIjo2MiB9LHsgXCJhdFwiOjEyMCwgXCJsZW5cIjoxMywgXCJ0cFwiOlwiRU1cIiB9LFxuICogICAgICAgICB7IFwiYXRcIjo3MSwgXCJsZW5cIjozNiwgXCJrZXlcIjowIH0seyBcImF0XCI6MTIwLCBcImxlblwiOjEzLCBcImtleVwiOjEgfSx7IFwidHBcIjpcIkJSXCIsIFwibGVuXCI6MSwgXCJhdFwiOjEzMyB9LFxuICogICAgICAgICB7IFwiYXRcIjoxNDQsIFwibGVuXCI6OCwgXCJrZXlcIjoyIH0seyBcImF0XCI6MTU5LCBcImxlblwiOjgsIFwia2V5XCI6MyB9LHsgXCJ0cFwiOlwiQlJcIiwgXCJsZW5cIjoxLCBcImF0XCI6MTc5IH0sXG4gKiAgICAgICAgIHsgXCJhdFwiOjE4NywgXCJsZW5cIjo4LCBcImtleVwiOjMgfSx7IFwidHBcIjpcIkJSXCIsIFwibGVuXCI6MSwgXCJhdFwiOjE5NSB9XG4gKiAgICAgXSxcbiAqICAgICBcImVudFwiOiBbXG4gKiAgICAgICAgIHsgXCJ0cFwiOlwiTE5cIiwgXCJkYXRhXCI6eyBcInVybFwiOlwiaHR0cHM6Ly93d3cuZXhhbXBsZS5jb20vYWJjI2ZyYWdtZW50XCIgfSB9LFxuICogICAgICAgICB7IFwidHBcIjpcIkxOXCIsIFwiZGF0YVwiOnsgXCJ1cmxcIjpcImh0dHA6Ly93d3cudGlub2RlLmNvXCIgfSB9LFxuICogICAgICAgICB7IFwidHBcIjpcIk1OXCIsIFwiZGF0YVwiOnsgXCJ2YWxcIjpcIm1lbnRpb25cIiB9IH0sXG4gKiAgICAgICAgIHsgXCJ0cFwiOlwiSFRcIiwgXCJkYXRhXCI6eyBcInZhbFwiOlwiaGFzaHRhZ1wiIH0gfVxuICogICAgIF1cbiAqICB9XG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vLyBOT1RFIFRPIERFVkVMT1BFUlM6XG4vLyBMb2NhbGl6YWJsZSBzdHJpbmdzIHNob3VsZCBiZSBkb3VibGUgcXVvdGVkIFwi0YHRgtGA0L7QutCwINC90LAg0LTRgNGD0LPQvtC8INGP0LfRi9C60LVcIixcbi8vIG5vbi1sb2NhbGl6YWJsZSBzdHJpbmdzIHNob3VsZCBiZSBzaW5nbGUgcXVvdGVkICdub24tbG9jYWxpemVkJy5cblxuY29uc3QgTUFYX0ZPUk1fRUxFTUVOVFMgPSA4O1xuY29uc3QgTUFYX1BSRVZJRVdfQVRUQUNITUVOVFMgPSAzO1xuY29uc3QgTUFYX1BSRVZJRVdfREFUQV9TSVpFID0gNjQ7XG5jb25zdCBKU09OX01JTUVfVFlQRSA9ICdhcHBsaWNhdGlvbi9qc29uJztcbmNvbnN0IERSQUZUWV9NSU1FX1RZUEUgPSAndGV4dC94LWRyYWZ0eSc7XG5jb25zdCBBTExPV0VEX0VOVF9GSUVMRFMgPSBbJ2FjdCcsICdoZWlnaHQnLCAnZHVyYXRpb24nLCAnaW5jb21pbmcnLCAnbWltZScsICduYW1lJywgJ3ByZXZpZXcnLFxuICAncmVmJywgJ3NpemUnLCAnc3RhdGUnLCAndXJsJywgJ3ZhbCcsICd3aWR0aCdcbl07XG5cbi8vIFJlZ3VsYXIgZXhwcmVzc2lvbnMgZm9yIHBhcnNpbmcgaW5saW5lIGZvcm1hdHMuIEphdmFzY3JpcHQgZG9lcyBub3Qgc3VwcG9ydCBsb29rYmVoaW5kLFxuLy8gc28gaXQncyBhIGJpdCBtZXNzeS5cbmNvbnN0IElOTElORV9TVFlMRVMgPSBbXG4gIC8vIFN0cm9uZyA9IGJvbGQsICpib2xkIHRleHQqXG4gIHtcbiAgICBuYW1lOiAnU1QnLFxuICAgIHN0YXJ0OiAvKD86XnxbXFxXX10pKFxcKilbXlxccypdLyxcbiAgICBlbmQ6IC9bXlxccypdKFxcKikoPz0kfFtcXFdfXSkvXG4gIH0sXG4gIC8vIEVtcGhlc2l6ZWQgPSBpdGFsaWMsIF9pdGFsaWMgdGV4dF9cbiAge1xuICAgIG5hbWU6ICdFTScsXG4gICAgc3RhcnQ6IC8oPzpefFxcVykoXylbXlxcc19dLyxcbiAgICBlbmQ6IC9bXlxcc19dKF8pKD89JHxcXFcpL1xuICB9LFxuICAvLyBEZWxldGVkLCB+c3RyaWtlIHRoaXMgdGhvdWdoflxuICB7XG4gICAgbmFtZTogJ0RMJyxcbiAgICBzdGFydDogLyg/Ol58W1xcV19dKSh+KVteXFxzfl0vLFxuICAgIGVuZDogL1teXFxzfl0ofikoPz0kfFtcXFdfXSkvXG4gIH0sXG4gIC8vIENvZGUgYmxvY2sgYHRoaXMgaXMgbW9ub3NwYWNlYFxuICB7XG4gICAgbmFtZTogJ0NPJyxcbiAgICBzdGFydDogLyg/Ol58XFxXKShgKVteYF0vLFxuICAgIGVuZDogL1teYF0oYCkoPz0kfFxcVykvXG4gIH1cbl07XG5cbi8vIFJlbGF0aXZlIHdlaWdodHMgb2YgZm9ybWF0dGluZyBzcGFucy4gR3JlYXRlciBpbmRleCBpbiBhcnJheSBtZWFucyBncmVhdGVyIHdlaWdodC5cbmNvbnN0IEZNVF9XRUlHSFQgPSBbJ1FRJ107XG5cbi8vIFJlZ0V4cHMgZm9yIGVudGl0eSBleHRyYWN0aW9uIChSRiA9IHJlZmVyZW5jZSlcbmNvbnN0IEVOVElUWV9UWVBFUyA9IFtcbiAgLy8gVVJMc1xuICB7XG4gICAgbmFtZTogJ0xOJyxcbiAgICBkYXRhTmFtZTogJ3VybCcsXG4gICAgcGFjazogZnVuY3Rpb24odmFsKSB7XG4gICAgICAvLyBDaGVjayBpZiB0aGUgcHJvdG9jb2wgaXMgc3BlY2lmaWVkLCBpZiBub3QgdXNlIGh0dHBcbiAgICAgIGlmICghL15bYS16XSs6XFwvXFwvL2kudGVzdCh2YWwpKSB7XG4gICAgICAgIHZhbCA9ICdodHRwOi8vJyArIHZhbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHVybDogdmFsXG4gICAgICB9O1xuICAgIH0sXG4gICAgcmU6IC8oPzooPzpodHRwcz98ZnRwKTpcXC9cXC98d3d3XFwufGZ0cFxcLilbLUEtWjAtOSsmQCNcXC8lPX5ffCQ/ITosLl0qW0EtWjAtOSsmQCNcXC8lPX5ffCRdL2lnXG4gIH0sXG4gIC8vIE1lbnRpb25zIEB1c2VyIChtdXN0IGJlIDIgb3IgbW9yZSBjaGFyYWN0ZXJzKVxuICB7XG4gICAgbmFtZTogJ01OJyxcbiAgICBkYXRhTmFtZTogJ3ZhbCcsXG4gICAgcGFjazogZnVuY3Rpb24odmFsKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB2YWw6IHZhbC5zbGljZSgxKVxuICAgICAgfTtcbiAgICB9LFxuICAgIHJlOiAvXFxCQChbXFxwe0x9XFxwe059XVsuX1xccHtMfVxccHtOfV0qW1xccHtMfVxccHtOfV0pL3VnXG4gIH0sXG4gIC8vIEhhc2h0YWdzICNoYXNodGFnLCBsaWtlIG1ldGlvbiAyIG9yIG1vcmUgY2hhcmFjdGVycy5cbiAge1xuICAgIG5hbWU6ICdIVCcsXG4gICAgZGF0YU5hbWU6ICd2YWwnLFxuICAgIHBhY2s6IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdmFsOiB2YWwuc2xpY2UoMSlcbiAgICAgIH07XG4gICAgfSxcbiAgICByZTogL1xcQiMoW1xccHtMfVxccHtOfV1bLl9cXHB7TH1cXHB7Tn1dKltcXHB7TH1cXHB7Tn1dKS91Z1xuICB9XG5dO1xuXG4vLyBIVE1MIHRhZyBuYW1lIHN1Z2dlc3Rpb25zXG5jb25zdCBGT1JNQVRfVEFHUyA9IHtcbiAgQVU6IHtcbiAgICBodG1sX3RhZzogJ2F1ZGlvJyxcbiAgICBtZF90YWc6IHVuZGVmaW5lZCxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIEJOOiB7XG4gICAgaHRtbF90YWc6ICdidXR0b24nLFxuICAgIG1kX3RhZzogdW5kZWZpbmVkLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgQlI6IHtcbiAgICBodG1sX3RhZzogJ2JyJyxcbiAgICBtZF90YWc6ICdcXG4nLFxuICAgIGlzVm9pZDogdHJ1ZVxuICB9LFxuICBDTzoge1xuICAgIGh0bWxfdGFnOiAndHQnLFxuICAgIG1kX3RhZzogJ2AnLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgREw6IHtcbiAgICBodG1sX3RhZzogJ2RlbCcsXG4gICAgbWRfdGFnOiAnficsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBFTToge1xuICAgIGh0bWxfdGFnOiAnaScsXG4gICAgbWRfdGFnOiAnXycsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBFWDoge1xuICAgIGh0bWxfdGFnOiAnJyxcbiAgICBtZF90YWc6IHVuZGVmaW5lZCxcbiAgICBpc1ZvaWQ6IHRydWVcbiAgfSxcbiAgRk06IHtcbiAgICBodG1sX3RhZzogJ2RpdicsXG4gICAgbWRfdGFnOiB1bmRlZmluZWQsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBIRDoge1xuICAgIGh0bWxfdGFnOiAnJyxcbiAgICBtZF90YWc6IHVuZGVmaW5lZCxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIEhMOiB7XG4gICAgaHRtbF90YWc6ICdzcGFuJyxcbiAgICBtZF90YWc6IHVuZGVmaW5lZCxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIEhUOiB7XG4gICAgaHRtbF90YWc6ICdhJyxcbiAgICBtZF90YWc6IHVuZGVmaW5lZCxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIElNOiB7XG4gICAgaHRtbF90YWc6ICdpbWcnLFxuICAgIG1kX3RhZzogdW5kZWZpbmVkLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgTE46IHtcbiAgICBodG1sX3RhZzogJ2EnLFxuICAgIG1kX3RhZzogdW5kZWZpbmVkLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgTU46IHtcbiAgICBodG1sX3RhZzogJ2EnLFxuICAgIG1kX3RhZzogdW5kZWZpbmVkLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgUlc6IHtcbiAgICBodG1sX3RhZzogJ2RpdicsXG4gICAgbWRfdGFnOiB1bmRlZmluZWQsXG4gICAgaXNWb2lkOiBmYWxzZSxcbiAgfSxcbiAgUVE6IHtcbiAgICBodG1sX3RhZzogJ2RpdicsXG4gICAgbWRfdGFnOiB1bmRlZmluZWQsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBTVDoge1xuICAgIGh0bWxfdGFnOiAnYicsXG4gICAgbWRfdGFnOiAnKicsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBWQzoge1xuICAgIGh0bWxfdGFnOiAnZGl2JyxcbiAgICBtZF90YWc6IHVuZGVmaW5lZCxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG59O1xuXG4vLyBDb252ZXJ0IGJhc2U2NC1lbmNvZGVkIHN0cmluZyBpbnRvIEJsb2IuXG5mdW5jdGlvbiBiYXNlNjR0b09iamVjdFVybChiNjQsIGNvbnRlbnRUeXBlLCBsb2dnZXIpIHtcbiAgaWYgKCFiNjQpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHRyeSB7XG4gICAgY29uc3QgYmluID0gYXRvYihiNjQpO1xuICAgIGNvbnN0IGxlbmd0aCA9IGJpbi5sZW5ndGg7XG4gICAgY29uc3QgYnVmID0gbmV3IEFycmF5QnVmZmVyKGxlbmd0aCk7XG4gICAgY29uc3QgYXJyID0gbmV3IFVpbnQ4QXJyYXkoYnVmKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBhcnJbaV0gPSBiaW4uY2hhckNvZGVBdChpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gVVJMLmNyZWF0ZU9iamVjdFVSTChuZXcgQmxvYihbYnVmXSwge1xuICAgICAgdHlwZTogY29udGVudFR5cGVcbiAgICB9KSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGlmIChsb2dnZXIpIHtcbiAgICAgIGxvZ2dlcihcIkRyYWZ0eTogZmFpbGVkIHRvIGNvbnZlcnQgb2JqZWN0LlwiLCBlcnIubWVzc2FnZSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIGJhc2U2NHRvRGF0YVVybChiNjQsIGNvbnRlbnRUeXBlKSB7XG4gIGlmICghYjY0KSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgY29udGVudFR5cGUgPSBjb250ZW50VHlwZSB8fCAnaW1hZ2UvanBlZyc7XG4gIHJldHVybiAnZGF0YTonICsgY29udGVudFR5cGUgKyAnO2Jhc2U2NCwnICsgYjY0O1xufVxuXG4vLyBIZWxwZXJzIGZvciBjb252ZXJ0aW5nIERyYWZ0eSB0byBIVE1MLlxuY29uc3QgREVDT1JBVE9SUyA9IHtcbiAgLy8gVmlzaWFsIHN0eWxlc1xuICBTVDoge1xuICAgIG9wZW46IF8gPT4gJzxiPicsXG4gICAgY2xvc2U6IF8gPT4gJzwvYj4nXG4gIH0sXG4gIEVNOiB7XG4gICAgb3BlbjogXyA9PiAnPGk+JyxcbiAgICBjbG9zZTogXyA9PiAnPC9pPidcbiAgfSxcbiAgREw6IHtcbiAgICBvcGVuOiBfID0+ICc8ZGVsPicsXG4gICAgY2xvc2U6IF8gPT4gJzwvZGVsPidcbiAgfSxcbiAgQ086IHtcbiAgICBvcGVuOiBfID0+ICc8dHQ+JyxcbiAgICBjbG9zZTogXyA9PiAnPC90dD4nXG4gIH0sXG4gIC8vIExpbmUgYnJlYWtcbiAgQlI6IHtcbiAgICBvcGVuOiBfID0+ICc8YnIvPicsXG4gICAgY2xvc2U6IF8gPT4gJydcbiAgfSxcbiAgLy8gSGlkZGVuIGVsZW1lbnRcbiAgSEQ6IHtcbiAgICBvcGVuOiBfID0+ICcnLFxuICAgIGNsb3NlOiBfID0+ICcnXG4gIH0sXG4gIC8vIEhpZ2hsaWdodGVkIGVsZW1lbnQuXG4gIEhMOiB7XG4gICAgb3BlbjogXyA9PiAnPHNwYW4gc3R5bGU9XCJjb2xvcjp0ZWFsXCI+JyxcbiAgICBjbG9zZTogXyA9PiAnPC9zcGFuPidcbiAgfSxcbiAgLy8gTGluayAoVVJMKVxuICBMTjoge1xuICAgIG9wZW46IChkYXRhKSA9PiB7XG4gICAgICByZXR1cm4gJzxhIGhyZWY9XCInICsgZGF0YS51cmwgKyAnXCI+JztcbiAgICB9LFxuICAgIGNsb3NlOiBfID0+ICc8L2E+JyxcbiAgICBwcm9wczogKGRhdGEpID0+IHtcbiAgICAgIHJldHVybiBkYXRhID8ge1xuICAgICAgICBocmVmOiBkYXRhLnVybCxcbiAgICAgICAgdGFyZ2V0OiAnX2JsYW5rJ1xuICAgICAgfSA6IG51bGw7XG4gICAgfSxcbiAgfSxcbiAgLy8gTWVudGlvblxuICBNTjoge1xuICAgIG9wZW46IChkYXRhKSA9PiB7XG4gICAgICByZXR1cm4gJzxhIGhyZWY9XCIjJyArIGRhdGEudmFsICsgJ1wiPic7XG4gICAgfSxcbiAgICBjbG9zZTogXyA9PiAnPC9hPicsXG4gICAgcHJvcHM6IChkYXRhKSA9PiB7XG4gICAgICByZXR1cm4gZGF0YSA/IHtcbiAgICAgICAgaWQ6IGRhdGEudmFsXG4gICAgICB9IDogbnVsbDtcbiAgICB9LFxuICB9LFxuICAvLyBIYXNodGFnXG4gIEhUOiB7XG4gICAgb3BlbjogKGRhdGEpID0+IHtcbiAgICAgIHJldHVybiAnPGEgaHJlZj1cIiMnICsgZGF0YS52YWwgKyAnXCI+JztcbiAgICB9LFxuICAgIGNsb3NlOiBfID0+ICc8L2E+JyxcbiAgICBwcm9wczogKGRhdGEpID0+IHtcbiAgICAgIHJldHVybiBkYXRhID8ge1xuICAgICAgICBpZDogZGF0YS52YWxcbiAgICAgIH0gOiBudWxsO1xuICAgIH0sXG4gIH0sXG4gIC8vIEJ1dHRvblxuICBCTjoge1xuICAgIG9wZW46IF8gPT4gJzxidXR0b24+JyxcbiAgICBjbG9zZTogXyA9PiAnPC9idXR0b24+JyxcbiAgICBwcm9wczogKGRhdGEpID0+IHtcbiAgICAgIHJldHVybiBkYXRhID8ge1xuICAgICAgICAnZGF0YS1hY3QnOiBkYXRhLmFjdCxcbiAgICAgICAgJ2RhdGEtdmFsJzogZGF0YS52YWwsXG4gICAgICAgICdkYXRhLW5hbWUnOiBkYXRhLm5hbWUsXG4gICAgICAgICdkYXRhLXJlZic6IGRhdGEucmVmXG4gICAgICB9IDogbnVsbDtcbiAgICB9LFxuICB9LFxuICAvLyBBdWRpbyByZWNvcmRpbmdcbiAgQVU6IHtcbiAgICBvcGVuOiAoZGF0YSkgPT4ge1xuICAgICAgY29uc3QgdXJsID0gZGF0YS5yZWYgfHwgYmFzZTY0dG9PYmplY3RVcmwoZGF0YS52YWwsIGRhdGEubWltZSwgRHJhZnR5LmxvZ2dlcik7XG4gICAgICByZXR1cm4gJzxhdWRpbyBjb250cm9scyBzcmM9XCInICsgdXJsICsgJ1wiPic7XG4gICAgfSxcbiAgICBjbG9zZTogXyA9PiAnPC9hdWRpbz4nLFxuICAgIHByb3BzOiAoZGF0YSkgPT4ge1xuICAgICAgaWYgKCFkYXRhKSByZXR1cm4gbnVsbDtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC8vIEVtYmVkZGVkIGRhdGEgb3IgZXh0ZXJuYWwgbGluay5cbiAgICAgICAgc3JjOiBkYXRhLnJlZiB8fCBiYXNlNjR0b09iamVjdFVybChkYXRhLnZhbCwgZGF0YS5taW1lLCBEcmFmdHkubG9nZ2VyKSxcbiAgICAgICAgJ2RhdGEtcHJlbG9hZCc6IGRhdGEucmVmID8gJ21ldGFkYXRhJyA6ICdhdXRvJyxcbiAgICAgICAgJ2RhdGEtZHVyYXRpb24nOiBkYXRhLmR1cmF0aW9uLFxuICAgICAgICAnZGF0YS1uYW1lJzogZGF0YS5uYW1lLFxuICAgICAgICAnZGF0YS1zaXplJzogZGF0YS52YWwgPyAoKGRhdGEudmFsLmxlbmd0aCAqIDAuNzUpIHwgMCkgOiAoZGF0YS5zaXplIHwgMCksXG4gICAgICAgICdkYXRhLW1pbWUnOiBkYXRhLm1pbWUsXG4gICAgICB9O1xuICAgIH1cbiAgfSxcbiAgLy8gSW1hZ2VcbiAgSU06IHtcbiAgICBvcGVuOiAoZGF0YSkgPT4ge1xuICAgICAgLy8gRG9uJ3QgdXNlIGRhdGEucmVmIGZvciBwcmV2aWV3OiBpdCdzIGEgc2VjdXJpdHkgcmlzay5cbiAgICAgIGNvbnN0IHRtcFByZXZpZXdVcmwgPSBiYXNlNjR0b0RhdGFVcmwoZGF0YS5fdGVtcFByZXZpZXcsIGRhdGEubWltZSk7XG4gICAgICBjb25zdCBwcmV2aWV3VXJsID0gYmFzZTY0dG9PYmplY3RVcmwoZGF0YS52YWwsIGRhdGEubWltZSwgRHJhZnR5LmxvZ2dlcik7XG4gICAgICBjb25zdCBkb3dubG9hZFVybCA9IGRhdGEucmVmIHx8IHByZXZpZXdVcmw7XG4gICAgICByZXR1cm4gKGRhdGEubmFtZSA/ICc8YSBocmVmPVwiJyArIGRvd25sb2FkVXJsICsgJ1wiIGRvd25sb2FkPVwiJyArIGRhdGEubmFtZSArICdcIj4nIDogJycpICtcbiAgICAgICAgJzxpbWcgc3JjPVwiJyArICh0bXBQcmV2aWV3VXJsIHx8IHByZXZpZXdVcmwpICsgJ1wiJyArXG4gICAgICAgIChkYXRhLndpZHRoID8gJyB3aWR0aD1cIicgKyBkYXRhLndpZHRoICsgJ1wiJyA6ICcnKSArXG4gICAgICAgIChkYXRhLmhlaWdodCA/ICcgaGVpZ2h0PVwiJyArIGRhdGEuaGVpZ2h0ICsgJ1wiJyA6ICcnKSArICcgYm9yZGVyPVwiMFwiIC8+JztcbiAgICB9LFxuICAgIGNsb3NlOiAoZGF0YSkgPT4ge1xuICAgICAgcmV0dXJuIChkYXRhLm5hbWUgPyAnPC9hPicgOiAnJyk7XG4gICAgfSxcbiAgICBwcm9wczogKGRhdGEpID0+IHtcbiAgICAgIGlmICghZGF0YSkgcmV0dXJuIG51bGw7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAvLyBUZW1wb3JhcnkgcHJldmlldywgb3IgcGVybWFuZW50IHByZXZpZXcsIG9yIGV4dGVybmFsIGxpbmsuXG4gICAgICAgIHNyYzogYmFzZTY0dG9EYXRhVXJsKGRhdGEuX3RlbXBQcmV2aWV3LCBkYXRhLm1pbWUpIHx8XG4gICAgICAgICAgZGF0YS5yZWYgfHwgYmFzZTY0dG9PYmplY3RVcmwoZGF0YS52YWwsIGRhdGEubWltZSwgRHJhZnR5LmxvZ2dlciksXG4gICAgICAgIHRpdGxlOiBkYXRhLm5hbWUsXG4gICAgICAgIGFsdDogZGF0YS5uYW1lLFxuICAgICAgICAnZGF0YS13aWR0aCc6IGRhdGEud2lkdGgsXG4gICAgICAgICdkYXRhLWhlaWdodCc6IGRhdGEuaGVpZ2h0LFxuICAgICAgICAnZGF0YS1uYW1lJzogZGF0YS5uYW1lLFxuICAgICAgICAnZGF0YS1zaXplJzogZGF0YS52YWwgPyAoKGRhdGEudmFsLmxlbmd0aCAqIDAuNzUpIHwgMCkgOiAoZGF0YS5zaXplIHwgMCksXG4gICAgICAgICdkYXRhLW1pbWUnOiBkYXRhLm1pbWUsXG4gICAgICB9O1xuICAgIH0sXG4gIH0sXG4gIC8vIEZvcm0gLSBzdHJ1Y3R1cmVkIGxheW91dCBvZiBlbGVtZW50cy5cbiAgRk06IHtcbiAgICBvcGVuOiBfID0+ICc8ZGl2PicsXG4gICAgY2xvc2U6IF8gPT4gJzwvZGl2PidcbiAgfSxcbiAgLy8gUm93OiBsb2dpYyBncm91cGluZyBvZiBlbGVtZW50c1xuICBSVzoge1xuICAgIG9wZW46IF8gPT4gJzxkaXY+JyxcbiAgICBjbG9zZTogXyA9PiAnPC9kaXY+J1xuICB9LFxuICAvLyBRdW90ZWQgYmxvY2suXG4gIFFROiB7XG4gICAgb3BlbjogXyA9PiAnPGRpdj4nLFxuICAgIGNsb3NlOiBfID0+ICc8L2Rpdj4nLFxuICAgIHByb3BzOiAoZGF0YSkgPT4ge1xuICAgICAgcmV0dXJuIGRhdGEgPyB7fSA6IG51bGw7XG4gICAgfSxcbiAgfSxcbiAgLy8gVmlkZW8gY2FsbFxuICBWQzoge1xuICAgIG9wZW46IF8gPT4gJzxkaXY+JyxcbiAgICBjbG9zZTogXyA9PiAnPC9kaXY+JyxcbiAgICBwcm9wczogZGF0YSA9PiB7XG4gICAgICBpZiAoIWRhdGEpIHJldHVybiB7fTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgICdkYXRhLWR1cmF0aW9uJzogZGF0YS5kdXJhdGlvbixcbiAgICAgICAgJ2RhdGEtc3RhdGUnOiBkYXRhLnN0YXRlLFxuICAgICAgfTtcbiAgICB9XG4gIH0sXG59O1xuXG4vKipcbiAqIFRoZSBtYWluIG9iamVjdCB3aGljaCBwZXJmb3JtcyBhbGwgdGhlIGZvcm1hdHRpbmcgYWN0aW9ucy5cbiAqIEBjbGFzcyBEcmFmdHlcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5jb25zdCBEcmFmdHkgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy50eHQgPSAnJztcbiAgdGhpcy5mbXQgPSBbXTtcbiAgdGhpcy5lbnQgPSBbXTtcbn1cblxuLyoqXG4gKiBJbml0aWFsaXplIERyYWZ0eSBkb2N1bWVudCB0byBhIHBsYWluIHRleHQgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBwbGFpblRleHQgLSBzdHJpbmcgdG8gdXNlIGFzIERyYWZ0eSBjb250ZW50LlxuICpcbiAqIEByZXR1cm5zIG5ldyBEcmFmdHkgZG9jdW1lbnQgb3IgbnVsbCBpcyBwbGFpblRleHQgaXMgbm90IGEgc3RyaW5nIG9yIHVuZGVmaW5lZC5cbiAqL1xuRHJhZnR5LmluaXQgPSBmdW5jdGlvbihwbGFpblRleHQpIHtcbiAgaWYgKHR5cGVvZiBwbGFpblRleHQgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBwbGFpblRleHQgPSAnJztcbiAgfSBlbHNlIGlmICh0eXBlb2YgcGxhaW5UZXh0ICE9ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHR4dDogcGxhaW5UZXh0XG4gIH07XG59XG5cbi8qKlxuICogUGFyc2UgcGxhaW4gdGV4dCBpbnRvIERyYWZ0eSBkb2N1bWVudC5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gY29udGVudCAtIHBsYWluLXRleHQgY29udGVudCB0byBwYXJzZS5cbiAqIEByZXR1cm4ge0RyYWZ0eX0gcGFyc2VkIGRvY3VtZW50IG9yIG51bGwgaWYgdGhlIHNvdXJjZSBpcyBub3QgcGxhaW4gdGV4dC5cbiAqL1xuRHJhZnR5LnBhcnNlID0gZnVuY3Rpb24oY29udGVudCkge1xuICAvLyBNYWtlIHN1cmUgd2UgYXJlIHBhcnNpbmcgc3RyaW5ncyBvbmx5LlxuICBpZiAodHlwZW9mIGNvbnRlbnQgIT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIFNwbGl0IHRleHQgaW50byBsaW5lcy4gSXQgbWFrZXMgZnVydGhlciBwcm9jZXNzaW5nIGVhc2llci5cbiAgY29uc3QgbGluZXMgPSBjb250ZW50LnNwbGl0KC9cXHI/XFxuLyk7XG5cbiAgLy8gSG9sZHMgZW50aXRpZXMgcmVmZXJlbmNlZCBmcm9tIHRleHRcbiAgY29uc3QgZW50aXR5TWFwID0gW107XG4gIGNvbnN0IGVudGl0eUluZGV4ID0ge307XG5cbiAgLy8gUHJvY2Vzc2luZyBsaW5lcyBvbmUgYnkgb25lLCBob2xkIGludGVybWVkaWF0ZSByZXN1bHQgaW4gYmx4LlxuICBjb25zdCBibHggPSBbXTtcbiAgbGluZXMuZm9yRWFjaCgobGluZSkgPT4ge1xuICAgIGxldCBzcGFucyA9IFtdO1xuICAgIGxldCBlbnRpdGllcztcblxuICAgIC8vIEZpbmQgZm9ybWF0dGVkIHNwYW5zIGluIHRoZSBzdHJpbmcuXG4gICAgLy8gVHJ5IHRvIG1hdGNoIGVhY2ggc3R5bGUuXG4gICAgSU5MSU5FX1NUWUxFUy5mb3JFYWNoKCh0YWcpID0+IHtcbiAgICAgIC8vIEVhY2ggc3R5bGUgY291bGQgYmUgbWF0Y2hlZCBtdWx0aXBsZSB0aW1lcy5cbiAgICAgIHNwYW5zID0gc3BhbnMuY29uY2F0KHNwYW5uaWZ5KGxpbmUsIHRhZy5zdGFydCwgdGFnLmVuZCwgdGFnLm5hbWUpKTtcbiAgICB9KTtcblxuICAgIGxldCBibG9jaztcbiAgICBpZiAoc3BhbnMubGVuZ3RoID09IDApIHtcbiAgICAgIGJsb2NrID0ge1xuICAgICAgICB0eHQ6IGxpbmVcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFNvcnQgc3BhbnMgYnkgc3R5bGUgb2NjdXJlbmNlIGVhcmx5IC0+IGxhdGUsIHRoZW4gYnkgbGVuZ3RoOiBmaXJzdCBsb25nIHRoZW4gc2hvcnQuXG4gICAgICBzcGFucy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIGNvbnN0IGRpZmYgPSBhLmF0IC0gYi5hdDtcbiAgICAgICAgcmV0dXJuIGRpZmYgIT0gMCA/IGRpZmYgOiBiLmVuZCAtIGEuZW5kO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIENvbnZlcnQgYW4gYXJyYXkgb2YgcG9zc2libHkgb3ZlcmxhcHBpbmcgc3BhbnMgaW50byBhIHRyZWUuXG4gICAgICBzcGFucyA9IHRvU3BhblRyZWUoc3BhbnMpO1xuXG4gICAgICAvLyBCdWlsZCBhIHRyZWUgcmVwcmVzZW50YXRpb24gb2YgdGhlIGVudGlyZSBzdHJpbmcsIG5vdFxuICAgICAgLy8ganVzdCB0aGUgZm9ybWF0dGVkIHBhcnRzLlxuICAgICAgY29uc3QgY2h1bmtzID0gY2h1bmtpZnkobGluZSwgMCwgbGluZS5sZW5ndGgsIHNwYW5zKTtcblxuICAgICAgY29uc3QgZHJhZnR5ID0gZHJhZnRpZnkoY2h1bmtzLCAwKTtcblxuICAgICAgYmxvY2sgPSB7XG4gICAgICAgIHR4dDogZHJhZnR5LnR4dCxcbiAgICAgICAgZm10OiBkcmFmdHkuZm10XG4gICAgICB9O1xuICAgIH1cblxuICAgIC8vIEV4dHJhY3QgZW50aXRpZXMgZnJvbSB0aGUgY2xlYW5lZCB1cCBzdHJpbmcuXG4gICAgZW50aXRpZXMgPSBleHRyYWN0RW50aXRpZXMoYmxvY2sudHh0KTtcbiAgICBpZiAoZW50aXRpZXMubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgcmFuZ2VzID0gW107XG4gICAgICBmb3IgKGxldCBpIGluIGVudGl0aWVzKSB7XG4gICAgICAgIC8vIHtvZmZzZXQ6IG1hdGNoWydpbmRleCddLCB1bmlxdWU6IG1hdGNoWzBdLCBsZW46IG1hdGNoWzBdLmxlbmd0aCwgZGF0YTogZW50LnBhY2tlcigpLCB0eXBlOiBlbnQubmFtZX1cbiAgICAgICAgY29uc3QgZW50aXR5ID0gZW50aXRpZXNbaV07XG4gICAgICAgIGxldCBpbmRleCA9IGVudGl0eUluZGV4W2VudGl0eS51bmlxdWVdO1xuICAgICAgICBpZiAoIWluZGV4KSB7XG4gICAgICAgICAgaW5kZXggPSBlbnRpdHlNYXAubGVuZ3RoO1xuICAgICAgICAgIGVudGl0eUluZGV4W2VudGl0eS51bmlxdWVdID0gaW5kZXg7XG4gICAgICAgICAgZW50aXR5TWFwLnB1c2goe1xuICAgICAgICAgICAgdHA6IGVudGl0eS50eXBlLFxuICAgICAgICAgICAgZGF0YTogZW50aXR5LmRhdGFcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByYW5nZXMucHVzaCh7XG4gICAgICAgICAgYXQ6IGVudGl0eS5vZmZzZXQsXG4gICAgICAgICAgbGVuOiBlbnRpdHkubGVuLFxuICAgICAgICAgIGtleTogaW5kZXhcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBibG9jay5lbnQgPSByYW5nZXM7XG4gICAgfVxuXG4gICAgYmx4LnB1c2goYmxvY2spO1xuICB9KTtcblxuICBjb25zdCByZXN1bHQgPSB7XG4gICAgdHh0OiAnJ1xuICB9O1xuXG4gIC8vIE1lcmdlIGxpbmVzIGFuZCBzYXZlIGxpbmUgYnJlYWtzIGFzIEJSIGlubGluZSBmb3JtYXR0aW5nLlxuICBpZiAoYmx4Lmxlbmd0aCA+IDApIHtcbiAgICByZXN1bHQudHh0ID0gYmx4WzBdLnR4dDtcbiAgICByZXN1bHQuZm10ID0gKGJseFswXS5mbXQgfHwgW10pLmNvbmNhdChibHhbMF0uZW50IHx8IFtdKTtcblxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgYmx4Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBibG9jayA9IGJseFtpXTtcbiAgICAgIGNvbnN0IG9mZnNldCA9IHJlc3VsdC50eHQubGVuZ3RoICsgMTtcblxuICAgICAgcmVzdWx0LmZtdC5wdXNoKHtcbiAgICAgICAgdHA6ICdCUicsXG4gICAgICAgIGxlbjogMSxcbiAgICAgICAgYXQ6IG9mZnNldCAtIDFcbiAgICAgIH0pO1xuXG4gICAgICByZXN1bHQudHh0ICs9ICcgJyArIGJsb2NrLnR4dDtcbiAgICAgIGlmIChibG9jay5mbXQpIHtcbiAgICAgICAgcmVzdWx0LmZtdCA9IHJlc3VsdC5mbXQuY29uY2F0KGJsb2NrLmZtdC5tYXAoKHMpID0+IHtcbiAgICAgICAgICBzLmF0ICs9IG9mZnNldDtcbiAgICAgICAgICByZXR1cm4gcztcbiAgICAgICAgfSkpO1xuICAgICAgfVxuICAgICAgaWYgKGJsb2NrLmVudCkge1xuICAgICAgICByZXN1bHQuZm10ID0gcmVzdWx0LmZtdC5jb25jYXQoYmxvY2suZW50Lm1hcCgocykgPT4ge1xuICAgICAgICAgIHMuYXQgKz0gb2Zmc2V0O1xuICAgICAgICAgIHJldHVybiBzO1xuICAgICAgICB9KSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHJlc3VsdC5mbXQubGVuZ3RoID09IDApIHtcbiAgICAgIGRlbGV0ZSByZXN1bHQuZm10O1xuICAgIH1cblxuICAgIGlmIChlbnRpdHlNYXAubGVuZ3RoID4gMCkge1xuICAgICAgcmVzdWx0LmVudCA9IGVudGl0eU1hcDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBBcHBlbmQgb25lIERyYWZ0eSBkb2N1bWVudCB0byBhbm90aGVyLlxuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBmaXJzdCAtIERyYWZ0eSBkb2N1bWVudCB0byBhcHBlbmQgdG8uXG4gKiBAcGFyYW0ge0RyYWZ0eXxzdHJpbmd9IHNlY29uZCAtIERyYWZ0eSBkb2N1bWVudCBvciBzdHJpbmcgYmVpbmcgYXBwZW5kZWQuXG4gKlxuICogQHJldHVybiB7RHJhZnR5fSBmaXJzdCBkb2N1bWVudCB3aXRoIHRoZSBzZWNvbmQgYXBwZW5kZWQgdG8gaXQuXG4gKi9cbkRyYWZ0eS5hcHBlbmQgPSBmdW5jdGlvbihmaXJzdCwgc2Vjb25kKSB7XG4gIGlmICghZmlyc3QpIHtcbiAgICByZXR1cm4gc2Vjb25kO1xuICB9XG4gIGlmICghc2Vjb25kKSB7XG4gICAgcmV0dXJuIGZpcnN0O1xuICB9XG5cbiAgZmlyc3QudHh0ID0gZmlyc3QudHh0IHx8ICcnO1xuICBjb25zdCBsZW4gPSBmaXJzdC50eHQubGVuZ3RoO1xuXG4gIGlmICh0eXBlb2Ygc2Vjb25kID09ICdzdHJpbmcnKSB7XG4gICAgZmlyc3QudHh0ICs9IHNlY29uZDtcbiAgfSBlbHNlIGlmIChzZWNvbmQudHh0KSB7XG4gICAgZmlyc3QudHh0ICs9IHNlY29uZC50eHQ7XG4gIH1cblxuICBpZiAoQXJyYXkuaXNBcnJheShzZWNvbmQuZm10KSkge1xuICAgIGZpcnN0LmZtdCA9IGZpcnN0LmZtdCB8fCBbXTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShzZWNvbmQuZW50KSkge1xuICAgICAgZmlyc3QuZW50ID0gZmlyc3QuZW50IHx8IFtdO1xuICAgIH1cbiAgICBzZWNvbmQuZm10LmZvckVhY2goc3JjID0+IHtcbiAgICAgIGNvbnN0IGZtdCA9IHtcbiAgICAgICAgYXQ6IChzcmMuYXQgfCAwKSArIGxlbixcbiAgICAgICAgbGVuOiBzcmMubGVuIHwgMFxuICAgICAgfTtcbiAgICAgIC8vIFNwZWNpYWwgY2FzZSBmb3IgdGhlIG91dHNpZGUgb2YgdGhlIG5vcm1hbCByZW5kZXJpbmcgZmxvdyBzdHlsZXMuXG4gICAgICBpZiAoc3JjLmF0ID09IC0xKSB7XG4gICAgICAgIGZtdC5hdCA9IC0xO1xuICAgICAgICBmbXQubGVuID0gMDtcbiAgICAgIH1cbiAgICAgIGlmIChzcmMudHApIHtcbiAgICAgICAgZm10LnRwID0gc3JjLnRwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm10LmtleSA9IGZpcnN0LmVudC5sZW5ndGg7XG4gICAgICAgIGZpcnN0LmVudC5wdXNoKHNlY29uZC5lbnRbc3JjLmtleSB8fCAwXSk7XG4gICAgICB9XG4gICAgICBmaXJzdC5mbXQucHVzaChmbXQpO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIGZpcnN0O1xufVxuXG4vKipcbiAqIEB0eXBlZGVmIERyYWZ0eS5JbWFnZURlc2NcbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEB0eXBlIE9iamVjdFxuICogQHBhcmFtIHtzdHJpbmd9IG1pbWUgLSBtaW1lLXR5cGUgb2YgdGhlIGltYWdlLCBlLmcuIFwiaW1hZ2UvcG5nXCJcbiAqIEBwYXJhbSB7c3RyaW5nfSBwcmV2aWV3IC0gYmFzZTY0LWVuY29kZWQgaW1hZ2UgY29udGVudCAob3IgcHJldmlldywgaWYgbGFyZ2UgaW1hZ2UgaXMgYXR0YWNoZWQpLiBDb3VsZCBiZSBudWxsL3VuZGVmaW5lZC5cbiAqIEBwYXJhbSB7aW50ZWdlcn0gd2lkdGggLSB3aWR0aCBvZiB0aGUgaW1hZ2VcbiAqIEBwYXJhbSB7aW50ZWdlcn0gaGVpZ2h0IC0gaGVpZ2h0IG9mIHRoZSBpbWFnZVxuICogQHBhcmFtIHtzdHJpbmd9IGZpbGVuYW1lIC0gZmlsZSBuYW1lIHN1Z2dlc3Rpb24gZm9yIGRvd25sb2FkaW5nIHRoZSBpbWFnZS5cbiAqIEBwYXJhbSB7aW50ZWdlcn0gc2l6ZSAtIHNpemUgb2YgdGhlIGltYWdlIGluIGJ5dGVzLiBUcmVhdCBpcyBhcyBhbiB1bnRydXN0ZWQgaGludC5cbiAqIEBwYXJhbSB7c3RyaW5nfSByZWZ1cmwgLSByZWZlcmVuY2UgdG8gdGhlIGNvbnRlbnQuIENvdWxkIGJlIG51bGwvdW5kZWZpbmVkLlxuICogQHBhcmFtIHtzdHJpbmd9IF90ZW1wUHJldmlldyAtIGJhc2U2NC1lbmNvZGVkIGltYWdlIHByZXZpZXcgdXNlZCBkdXJpbmcgdXBsb2FkIHByb2Nlc3M7IG5vdCBzZXJpYWxpemFibGUuXG4gKiBAcGFyYW0ge1Byb21pc2V9IHVybFByb21pc2UgLSBQcm9taXNlIHdoaWNoIHJldHVybnMgY29udGVudCBVUkwgd2hlbiByZXNvbHZlZC5cbiAqL1xuXG4vKipcbiAqIEluc2VydCBpbmxpbmUgaW1hZ2UgaW50byBEcmFmdHkgZG9jdW1lbnQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBkb2N1bWVudCB0byBhZGQgaW1hZ2UgdG8uXG4gKiBAcGFyYW0ge2ludGVnZXJ9IGF0IC0gaW5kZXggd2hlcmUgdGhlIG9iamVjdCBpcyBpbnNlcnRlZC4gVGhlIGxlbmd0aCBvZiB0aGUgaW1hZ2UgaXMgYWx3YXlzIDEuXG4gKiBAcGFyYW0ge0ltYWdlRGVzY30gaW1hZ2VEZXNjIC0gb2JqZWN0IHdpdGggaW1hZ2UgcGFyYW1lbmV0cyBhbmQgZGF0YS5cbiAqXG4gKiBAcmV0dXJuIHtEcmFmdHl9IHVwZGF0ZWQgZG9jdW1lbnQuXG4gKi9cbkRyYWZ0eS5pbnNlcnRJbWFnZSA9IGZ1bmN0aW9uKGNvbnRlbnQsIGF0LCBpbWFnZURlc2MpIHtcbiAgY29udGVudCA9IGNvbnRlbnQgfHwge1xuICAgIHR4dDogJyAnXG4gIH07XG4gIGNvbnRlbnQuZW50ID0gY29udGVudC5lbnQgfHwgW107XG4gIGNvbnRlbnQuZm10ID0gY29udGVudC5mbXQgfHwgW107XG5cbiAgY29udGVudC5mbXQucHVzaCh7XG4gICAgYXQ6IGF0IHwgMCxcbiAgICBsZW46IDEsXG4gICAga2V5OiBjb250ZW50LmVudC5sZW5ndGhcbiAgfSk7XG5cbiAgY29uc3QgZXggPSB7XG4gICAgdHA6ICdJTScsXG4gICAgZGF0YToge1xuICAgICAgbWltZTogaW1hZ2VEZXNjLm1pbWUsXG4gICAgICB2YWw6IGltYWdlRGVzYy5wcmV2aWV3LFxuICAgICAgd2lkdGg6IGltYWdlRGVzYy53aWR0aCxcbiAgICAgIGhlaWdodDogaW1hZ2VEZXNjLmhlaWdodCxcbiAgICAgIG5hbWU6IGltYWdlRGVzYy5maWxlbmFtZSxcbiAgICAgIHNpemU6IGltYWdlRGVzYy5zaXplIHwgMCxcbiAgICAgIHJlZjogaW1hZ2VEZXNjLnJlZnVybFxuICAgIH1cbiAgfTtcblxuICBpZiAoaW1hZ2VEZXNjLnVybFByb21pc2UpIHtcbiAgICBleC5kYXRhLl90ZW1wUHJldmlldyA9IGltYWdlRGVzYy5fdGVtcFByZXZpZXc7XG4gICAgZXguZGF0YS5fcHJvY2Vzc2luZyA9IHRydWU7XG4gICAgaW1hZ2VEZXNjLnVybFByb21pc2UudGhlbihcbiAgICAgIHVybCA9PiB7XG4gICAgICAgIGV4LmRhdGEucmVmID0gdXJsO1xuICAgICAgICBleC5kYXRhLl90ZW1wUHJldmlldyA9IHVuZGVmaW5lZDtcbiAgICAgICAgZXguZGF0YS5fcHJvY2Vzc2luZyA9IHVuZGVmaW5lZDtcbiAgICAgIH0sXG4gICAgICBfID0+IHtcbiAgICAgICAgLy8gQ2F0Y2ggdGhlIGVycm9yLCBvdGhlcndpc2UgaXQgd2lsbCBhcHBlYXIgaW4gdGhlIGNvbnNvbGUuXG4gICAgICAgIGV4LmRhdGEuX3Byb2Nlc3NpbmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gIGNvbnRlbnQuZW50LnB1c2goZXgpO1xuXG4gIHJldHVybiBjb250ZW50O1xufVxuXG4vKipcbiAqIEB0eXBlZGVmIERyYWZ0eS5BdWRpb0Rlc2NcbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEB0eXBlIE9iamVjdFxuICogQHBhcmFtIHtzdHJpbmd9IG1pbWUgLSBtaW1lLXR5cGUgb2YgdGhlIGF1ZGlvLCBlLmcuIFwiYXVkaW8vb2dnXCIuXG4gKiBAcGFyYW0ge3N0cmluZ30gZGF0YSAtIGJhc2U2NC1lbmNvZGVkIGF1ZGlvIGNvbnRlbnQuIENvdWxkIGJlIG51bGwvdW5kZWZpbmVkLlxuICogQHBhcmFtIHtpbnRlZ2VyfSBkdXJhdGlvbiAtIGR1cmF0aW9uIG9mIHRoZSByZWNvcmQgaW4gbWlsbGlzZWNvbmRzLlxuICogQHBhcmFtIHtzdHJpbmd9IHByZXZpZXcgLSBiYXNlNjQgZW5jb2RlZCBzaG9ydCBhcnJheSBvZiBhbXBsaXR1ZGUgdmFsdWVzIDAuLjEwMC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlbmFtZSAtIGZpbGUgbmFtZSBzdWdnZXN0aW9uIGZvciBkb3dubG9hZGluZyB0aGUgYXVkaW8uXG4gKiBAcGFyYW0ge2ludGVnZXJ9IHNpemUgLSBzaXplIG9mIHRoZSByZWNvcmRpbmcgaW4gYnl0ZXMuIFRyZWF0IGlzIGFzIGFuIHVudHJ1c3RlZCBoaW50LlxuICogQHBhcmFtIHtzdHJpbmd9IHJlZnVybCAtIHJlZmVyZW5jZSB0byB0aGUgY29udGVudC4gQ291bGQgYmUgbnVsbC91bmRlZmluZWQuXG4gKiBAcGFyYW0ge1Byb21pc2V9IHVybFByb21pc2UgLSBQcm9taXNlIHdoaWNoIHJldHVybnMgY29udGVudCBVUkwgd2hlbiByZXNvbHZlZC5cbiAqL1xuXG4vKipcbiAqIEluc2VydCBhdWRpbyByZWNvcmRpbmcgaW50byBEcmFmdHkgZG9jdW1lbnQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBkb2N1bWVudCB0byBhZGQgYXVkaW8gcmVjb3JkIHRvLlxuICogQHBhcmFtIHtpbnRlZ2VyfSBhdCAtIGluZGV4IHdoZXJlIHRoZSBvYmplY3QgaXMgaW5zZXJ0ZWQuIFRoZSBsZW5ndGggb2YgdGhlIHJlY29yZCBpcyBhbHdheXMgMS5cbiAqIEBwYXJhbSB7QXVkaW9EZXNjfSBhdWRpb0Rlc2MgLSBvYmplY3Qgd2l0aCB0aGUgYXVkaW8gcGFyYW1lbmV0cyBhbmQgZGF0YS5cbiAqXG4gKiBAcmV0dXJuIHtEcmFmdHl9IHVwZGF0ZWQgZG9jdW1lbnQuXG4gKi9cbkRyYWZ0eS5pbnNlcnRBdWRpbyA9IGZ1bmN0aW9uKGNvbnRlbnQsIGF0LCBhdWRpb0Rlc2MpIHtcbiAgY29udGVudCA9IGNvbnRlbnQgfHwge1xuICAgIHR4dDogJyAnXG4gIH07XG4gIGNvbnRlbnQuZW50ID0gY29udGVudC5lbnQgfHwgW107XG4gIGNvbnRlbnQuZm10ID0gY29udGVudC5mbXQgfHwgW107XG5cbiAgY29udGVudC5mbXQucHVzaCh7XG4gICAgYXQ6IGF0IHwgMCxcbiAgICBsZW46IDEsXG4gICAga2V5OiBjb250ZW50LmVudC5sZW5ndGhcbiAgfSk7XG5cbiAgY29uc3QgZXggPSB7XG4gICAgdHA6ICdBVScsXG4gICAgZGF0YToge1xuICAgICAgbWltZTogYXVkaW9EZXNjLm1pbWUsXG4gICAgICB2YWw6IGF1ZGlvRGVzYy5kYXRhLFxuICAgICAgZHVyYXRpb246IGF1ZGlvRGVzYy5kdXJhdGlvbiB8IDAsXG4gICAgICBwcmV2aWV3OiBhdWRpb0Rlc2MucHJldmlldyxcbiAgICAgIG5hbWU6IGF1ZGlvRGVzYy5maWxlbmFtZSxcbiAgICAgIHNpemU6IGF1ZGlvRGVzYy5zaXplIHwgMCxcbiAgICAgIHJlZjogYXVkaW9EZXNjLnJlZnVybFxuICAgIH1cbiAgfTtcblxuICBpZiAoYXVkaW9EZXNjLnVybFByb21pc2UpIHtcbiAgICBleC5kYXRhLl9wcm9jZXNzaW5nID0gdHJ1ZTtcbiAgICBhdWRpb0Rlc2MudXJsUHJvbWlzZS50aGVuKFxuICAgICAgdXJsID0+IHtcbiAgICAgICAgZXguZGF0YS5yZWYgPSB1cmw7XG4gICAgICAgIGV4LmRhdGEuX3Byb2Nlc3NpbmcgPSB1bmRlZmluZWQ7XG4gICAgICB9LFxuICAgICAgXyA9PiB7XG4gICAgICAgIC8vIENhdGNoIHRoZSBlcnJvciwgb3RoZXJ3aXNlIGl0IHdpbGwgYXBwZWFyIGluIHRoZSBjb25zb2xlLlxuICAgICAgICBleC5kYXRhLl9wcm9jZXNzaW5nID0gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgICk7XG4gIH1cblxuICBjb250ZW50LmVudC5wdXNoKGV4KTtcblxuICByZXR1cm4gY29udGVudDtcbn1cblxuLyoqXG4gKiBDcmVhdGUgYSAoc2VsZi1jb250YWluZWQpIHZpZGVvIGNhbGwgRHJhZnR5IGRvY3VtZW50LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEByZXR1cm5zIFZpZGVvIENhbGwgZHJhZnR5IGRvY3VtZW50LlxuICovXG5EcmFmdHkudmlkZW9DYWxsID0gZnVuY3Rpb24oKSB7XG4gIGNvbnN0IGNvbnRlbnQgPSB7XG4gICAgdHh0OiAnICcsXG4gICAgZm10OiBbe1xuICAgICAgYXQ6IDAsXG4gICAgICBsZW46IDEsXG4gICAgICBrZXk6IDBcbiAgICB9XSxcbiAgICBlbnQ6IFt7XG4gICAgICB0cDogJ1ZDJ1xuICAgIH1dXG4gIH07XG4gIHJldHVybiBjb250ZW50O1xufVxuXG4vKipcbiAqIFVwZGF0ZSB2aWRlbyBjYWxsIChWQykgZW50aXR5IHdpdGggdGhlIG5ldyBzdGF0dXMgYW5kIGR1cmF0aW9uLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gVkMgZG9jdW1lbnQgdG8gdXBkYXRlLlxuICogQHBhcmFtIHtvYmplY3R9IHBhcmFtcyAtIG5ldyB2aWRlbyBjYWxsIHBhcmFtZXRlcnMuXG4gKiBAcGFyYW0ge3N0cmluZ30gcGFyYW1zLnN0YXRlIC0gc3RhdGUgb2YgdmlkZW8gY2FsbC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBwYXJhbXMuZHVyYXRpb24gLSBkdXJhdGlvbiBvZiB0aGUgdmlkZW8gY2FsbCBpbiBtaWxsaXNlY29uZHMuXG4gKlxuICogQHJldHVybnMgdGhlIHNhbWUgZG9jdW1lbnQgd2l0aCB1cGRhdGUgYXBwbGllZC5cbiAqL1xuRHJhZnR5LnVwZGF0ZVZpZGVvRW50ID0gZnVuY3Rpb24oY29udGVudCwgcGFyYW1zKSB7XG4gIC8vIFRoZSB2aWRlbyBlbGVtZW50IGNvdWxkIGJlIGp1c3QgYSBmb3JtYXQgb3IgYSBmb3JtYXQgKyBlbnRpdHkuXG4gIC8vIE11c3QgZW5zdXJlIGl0J3MgdGhlIGxhdHRlciBmaXJzdC5cbiAgY29uc3QgZm10ID0gKChjb250ZW50IHx8IHt9KS5mbXQgfHwgW10pWzBdO1xuICBpZiAoIWZtdCkge1xuICAgIC8vIFVucmVjb2duaXplZCBjb250ZW50LlxuICAgIHJldHVybiBjb250ZW50O1xuICB9XG5cbiAgbGV0IGVudDtcbiAgaWYgKGZtdC50cCA9PSAnVkMnKSB7XG4gICAgLy8gSnVzdCBhIGZvcm1hdCwgY29udmVydCB0byBmb3JtYXQgKyBlbnRpdHkuXG4gICAgZGVsZXRlIGZtdC50cDtcbiAgICBmbXQua2V5ID0gMDtcbiAgICBlbnQgPSB7XG4gICAgICB0cDogJ1ZDJ1xuICAgIH07XG4gICAgY29udGVudC5lbnQgPSBbZW50XTtcbiAgfSBlbHNlIHtcbiAgICBlbnQgPSAoY29udGVudC5lbnQgfHwgW10pW2ZtdC5rZXkgfCAwXTtcbiAgICBpZiAoIWVudCB8fCBlbnQudHAgIT0gJ1ZDJykge1xuICAgICAgLy8gTm90IGEgVkMgZW50aXR5LlxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfVxuICB9XG4gIGVudC5kYXRhID0gZW50LmRhdGEgfHwge307XG4gIE9iamVjdC5hc3NpZ24oZW50LmRhdGEsIHBhcmFtcyk7XG4gIHJldHVybiBjb250ZW50O1xufVxuXG4vKipcbiAqIENyZWF0ZSBhIHF1b3RlIHRvIERyYWZ0eSBkb2N1bWVudC5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gaGVhZGVyIC0gUXVvdGUgaGVhZGVyICh0aXRsZSwgZXRjLikuXG4gKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gVUlEIG9mIHRoZSBhdXRob3IgdG8gbWVudGlvbi5cbiAqIEBwYXJhbSB7RHJhZnR5fSBib2R5IC0gQm9keSBvZiB0aGUgcXVvdGVkIG1lc3NhZ2UuXG4gKlxuICogQHJldHVybnMgUmVwbHkgcXVvdGUgRHJhZnR5IGRvYyB3aXRoIHRoZSBxdW90ZSBmb3JtYXR0aW5nLlxuICovXG5EcmFmdHkucXVvdGUgPSBmdW5jdGlvbihoZWFkZXIsIHVpZCwgYm9keSkge1xuICBjb25zdCBxdW90ZSA9IERyYWZ0eS5hcHBlbmQoRHJhZnR5LmFwcGVuZExpbmVCcmVhayhEcmFmdHkubWVudGlvbihoZWFkZXIsIHVpZCkpLCBib2R5KTtcblxuICAvLyBXcmFwIGludG8gYSBxdW90ZS5cbiAgcXVvdGUuZm10LnB1c2goe1xuICAgIGF0OiAwLFxuICAgIGxlbjogcXVvdGUudHh0Lmxlbmd0aCxcbiAgICB0cDogJ1FRJ1xuICB9KTtcblxuICByZXR1cm4gcXVvdGU7XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgRHJhZnR5IGRvY3VtZW50IHdpdGggYSBtZW50aW9uLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gbWVudGlvbmVkIG5hbWUuXG4gKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gbWVudGlvbmVkIHVzZXIgSUQuXG4gKlxuICogQHJldHVybnMge0RyYWZ0eX0gZG9jdW1lbnQgd2l0aCB0aGUgbWVudGlvbi5cbiAqL1xuRHJhZnR5Lm1lbnRpb24gPSBmdW5jdGlvbihuYW1lLCB1aWQpIHtcbiAgcmV0dXJuIHtcbiAgICB0eHQ6IG5hbWUgfHwgJycsXG4gICAgZm10OiBbe1xuICAgICAgYXQ6IDAsXG4gICAgICBsZW46IChuYW1lIHx8ICcnKS5sZW5ndGgsXG4gICAgICBrZXk6IDBcbiAgICB9XSxcbiAgICBlbnQ6IFt7XG4gICAgICB0cDogJ01OJyxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgdmFsOiB1aWRcbiAgICAgIH1cbiAgICB9XVxuICB9O1xufVxuXG4vKipcbiAqIEFwcGVuZCBhIGxpbmsgdG8gYSBEcmFmdHkgZG9jdW1lbnQuXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBEcmFmdHkgZG9jdW1lbnQgdG8gYXBwZW5kIGxpbmsgdG8uXG4gKiBAcGFyYW0ge09iamVjdH0gbGlua0RhdGEgLSBMaW5rIGluZm8gaW4gZm9ybWF0IDxjb2RlPnt0eHQ6ICdhbmtvciB0ZXh0JywgdXJsOiAnaHR0cDovLy4uLid9PC9jb2RlPi5cbiAqXG4gKiBAcmV0dXJucyB7RHJhZnR5fSB0aGUgc2FtZSBkb2N1bWVudCBhcyA8Y29kZT5jb250ZW50PC9jb2RlPi5cbiAqL1xuRHJhZnR5LmFwcGVuZExpbmsgPSBmdW5jdGlvbihjb250ZW50LCBsaW5rRGF0YSkge1xuICBjb250ZW50ID0gY29udGVudCB8fCB7XG4gICAgdHh0OiAnJ1xuICB9O1xuXG4gIGNvbnRlbnQuZW50ID0gY29udGVudC5lbnQgfHwgW107XG4gIGNvbnRlbnQuZm10ID0gY29udGVudC5mbXQgfHwgW107XG5cbiAgY29udGVudC5mbXQucHVzaCh7XG4gICAgYXQ6IGNvbnRlbnQudHh0Lmxlbmd0aCxcbiAgICBsZW46IGxpbmtEYXRhLnR4dC5sZW5ndGgsXG4gICAga2V5OiBjb250ZW50LmVudC5sZW5ndGhcbiAgfSk7XG4gIGNvbnRlbnQudHh0ICs9IGxpbmtEYXRhLnR4dDtcblxuICBjb25zdCBleCA9IHtcbiAgICB0cDogJ0xOJyxcbiAgICBkYXRhOiB7XG4gICAgICB1cmw6IGxpbmtEYXRhLnVybFxuICAgIH1cbiAgfVxuICBjb250ZW50LmVudC5wdXNoKGV4KTtcblxuICByZXR1cm4gY29udGVudDtcbn1cblxuLyoqXG4gKiBBcHBlbmQgaW1hZ2UgdG8gRHJhZnR5IGRvY3VtZW50LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gZG9jdW1lbnQgdG8gYWRkIGltYWdlIHRvLlxuICogQHBhcmFtIHtJbWFnZURlc2N9IGltYWdlRGVzYyAtIG9iamVjdCB3aXRoIGltYWdlIHBhcmFtZW5ldHMuXG4gKlxuICogQHJldHVybiB7RHJhZnR5fSB1cGRhdGVkIGRvY3VtZW50LlxuICovXG5EcmFmdHkuYXBwZW5kSW1hZ2UgPSBmdW5jdGlvbihjb250ZW50LCBpbWFnZURlc2MpIHtcbiAgY29udGVudCA9IGNvbnRlbnQgfHwge1xuICAgIHR4dDogJydcbiAgfTtcbiAgY29udGVudC50eHQgKz0gJyAnO1xuICByZXR1cm4gRHJhZnR5Lmluc2VydEltYWdlKGNvbnRlbnQsIGNvbnRlbnQudHh0Lmxlbmd0aCAtIDEsIGltYWdlRGVzYyk7XG59XG5cbi8qKlxuICogQXBwZW5kIGF1ZGlvIHJlY29kcmluZyB0byBEcmFmdHkgZG9jdW1lbnQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBkb2N1bWVudCB0byBhZGQgcmVjb3JkaW5nIHRvLlxuICogQHBhcmFtIHtBdWRpb0Rlc2N9IGF1ZGlvRGVzYyAtIG9iamVjdCB3aXRoIGF1ZGlvIGRhdGEuXG4gKlxuICogQHJldHVybiB7RHJhZnR5fSB1cGRhdGVkIGRvY3VtZW50LlxuICovXG5EcmFmdHkuYXBwZW5kQXVkaW8gPSBmdW5jdGlvbihjb250ZW50LCBhdWRpb0Rlc2MpIHtcbiAgY29udGVudCA9IGNvbnRlbnQgfHwge1xuICAgIHR4dDogJydcbiAgfTtcbiAgY29udGVudC50eHQgKz0gJyAnO1xuICByZXR1cm4gRHJhZnR5Lmluc2VydEF1ZGlvKGNvbnRlbnQsIGNvbnRlbnQudHh0Lmxlbmd0aCAtIDEsIGF1ZGlvRGVzYyk7XG59XG5cbi8qKlxuICogQHR5cGVkZWYgRHJhZnR5LkF0dGFjaG1lbnREZXNjXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAdHlwZSBPYmplY3RcbiAqIEBwYXJhbSB7c3RyaW5nfSBtaW1lIC0gbWltZS10eXBlIG9mIHRoZSBhdHRhY2htZW50LCBlLmcuIFwiYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtXCJcbiAqIEBwYXJhbSB7c3RyaW5nfSBkYXRhIC0gYmFzZTY0LWVuY29kZWQgaW4tYmFuZCBjb250ZW50IG9mIHNtYWxsIGF0dGFjaG1lbnRzLiBDb3VsZCBiZSBudWxsL3VuZGVmaW5lZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlbmFtZSAtIGZpbGUgbmFtZSBzdWdnZXN0aW9uIGZvciBkb3dubG9hZGluZyB0aGUgYXR0YWNobWVudC5cbiAqIEBwYXJhbSB7aW50ZWdlcn0gc2l6ZSAtIHNpemUgb2YgdGhlIGZpbGUgaW4gYnl0ZXMuIFRyZWF0IGlzIGFzIGFuIHVudHJ1c3RlZCBoaW50LlxuICogQHBhcmFtIHtzdHJpbmd9IHJlZnVybCAtIHJlZmVyZW5jZSB0byB0aGUgb3V0LW9mLWJhbmQgY29udGVudC4gQ291bGQgYmUgbnVsbC91bmRlZmluZWQuXG4gKiBAcGFyYW0ge1Byb21pc2V9IHVybFByb21pc2UgLSBQcm9taXNlIHdoaWNoIHJldHVybnMgY29udGVudCBVUkwgd2hlbiByZXNvbHZlZC5cbiAqL1xuXG4vKipcbiAqIEF0dGFjaCBmaWxlIHRvIERyYWZ0eSBjb250ZW50LiBFaXRoZXIgYXMgYSBibG9iIG9yIGFzIGEgcmVmZXJlbmNlLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gZG9jdW1lbnQgdG8gYXR0YWNoIGZpbGUgdG8uXG4gKiBAcGFyYW0ge0F0dGFjaG1lbnREZXNjfSBvYmplY3QgLSBjb250YWluaW5nIGF0dGFjaG1lbnQgZGVzY3JpcHRpb24gYW5kIGRhdGEuXG4gKlxuICogQHJldHVybiB7RHJhZnR5fSB1cGRhdGVkIGRvY3VtZW50LlxuICovXG5EcmFmdHkuYXR0YWNoRmlsZSA9IGZ1bmN0aW9uKGNvbnRlbnQsIGF0dGFjaG1lbnREZXNjKSB7XG4gIGNvbnRlbnQgPSBjb250ZW50IHx8IHtcbiAgICB0eHQ6ICcnXG4gIH07XG5cbiAgY29udGVudC5lbnQgPSBjb250ZW50LmVudCB8fCBbXTtcbiAgY29udGVudC5mbXQgPSBjb250ZW50LmZtdCB8fCBbXTtcblxuICBjb250ZW50LmZtdC5wdXNoKHtcbiAgICBhdDogLTEsXG4gICAgbGVuOiAwLFxuICAgIGtleTogY29udGVudC5lbnQubGVuZ3RoXG4gIH0pO1xuXG4gIGNvbnN0IGV4ID0ge1xuICAgIHRwOiAnRVgnLFxuICAgIGRhdGE6IHtcbiAgICAgIG1pbWU6IGF0dGFjaG1lbnREZXNjLm1pbWUsXG4gICAgICB2YWw6IGF0dGFjaG1lbnREZXNjLmRhdGEsXG4gICAgICBuYW1lOiBhdHRhY2htZW50RGVzYy5maWxlbmFtZSxcbiAgICAgIHJlZjogYXR0YWNobWVudERlc2MucmVmdXJsLFxuICAgICAgc2l6ZTogYXR0YWNobWVudERlc2Muc2l6ZSB8IDBcbiAgICB9XG4gIH1cbiAgaWYgKGF0dGFjaG1lbnREZXNjLnVybFByb21pc2UpIHtcbiAgICBleC5kYXRhLl9wcm9jZXNzaW5nID0gdHJ1ZTtcbiAgICBhdHRhY2htZW50RGVzYy51cmxQcm9taXNlLnRoZW4oXG4gICAgICAodXJsKSA9PiB7XG4gICAgICAgIGV4LmRhdGEucmVmID0gdXJsO1xuICAgICAgICBleC5kYXRhLl9wcm9jZXNzaW5nID0gdW5kZWZpbmVkO1xuICAgICAgfSxcbiAgICAgIChlcnIpID0+IHtcbiAgICAgICAgLyogY2F0Y2ggdGhlIGVycm9yLCBvdGhlcndpc2UgaXQgd2lsbCBhcHBlYXIgaW4gdGhlIGNvbnNvbGUuICovXG4gICAgICAgIGV4LmRhdGEuX3Byb2Nlc3NpbmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgKTtcbiAgfVxuICBjb250ZW50LmVudC5wdXNoKGV4KTtcblxuICByZXR1cm4gY29udGVudDtcbn1cblxuLyoqXG4gKiBXcmFwcyBkcmFmdHkgZG9jdW1lbnQgaW50byBhIHNpbXBsZSBmb3JtYXR0aW5nIHN0eWxlLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fHN0cmluZ30gY29udGVudCAtIGRvY3VtZW50IG9yIHN0cmluZyB0byB3cmFwIGludG8gYSBzdHlsZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHlsZSAtIHR3by1sZXR0ZXIgc3R5bGUgdG8gd3JhcCBpbnRvLlxuICogQHBhcmFtIHtudW1iZXJ9IGF0IC0gaW5kZXggd2hlcmUgdGhlIHN0eWxlIHN0YXJ0cywgZGVmYXVsdCAwLlxuICogQHBhcmFtIHtudW1iZXJ9IGxlbiAtIGxlbmd0aCBvZiB0aGUgZm9ybSBjb250ZW50LCBkZWZhdWx0IGFsbCBvZiBpdC5cbiAqXG4gKiBAcmV0dXJuIHtEcmFmdHl9IHVwZGF0ZWQgZG9jdW1lbnQuXG4gKi9cbkRyYWZ0eS53cmFwSW50byA9IGZ1bmN0aW9uKGNvbnRlbnQsIHN0eWxlLCBhdCwgbGVuKSB7XG4gIGlmICh0eXBlb2YgY29udGVudCA9PSAnc3RyaW5nJykge1xuICAgIGNvbnRlbnQgPSB7XG4gICAgICB0eHQ6IGNvbnRlbnRcbiAgICB9O1xuICB9XG4gIGNvbnRlbnQuZm10ID0gY29udGVudC5mbXQgfHwgW107XG5cbiAgY29udGVudC5mbXQucHVzaCh7XG4gICAgYXQ6IGF0IHx8IDAsXG4gICAgbGVuOiBsZW4gfHwgY29udGVudC50eHQubGVuZ3RoLFxuICAgIHRwOiBzdHlsZSxcbiAgfSk7XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbi8qKlxuICogV3JhcHMgY29udGVudCBpbnRvIGFuIGludGVyYWN0aXZlIGZvcm0uXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl8c3RyaW5nfSBjb250ZW50IC0gdG8gd3JhcCBpbnRvIGEgZm9ybS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBhdCAtIGluZGV4IHdoZXJlIHRoZSBmb3JtcyBzdGFydHMuXG4gKiBAcGFyYW0ge251bWJlcn0gbGVuIC0gbGVuZ3RoIG9mIHRoZSBmb3JtIGNvbnRlbnQuXG4gKlxuICogQHJldHVybiB7RHJhZnR5fSB1cGRhdGVkIGRvY3VtZW50LlxuICovXG5EcmFmdHkud3JhcEFzRm9ybSA9IGZ1bmN0aW9uKGNvbnRlbnQsIGF0LCBsZW4pIHtcbiAgcmV0dXJuIERyYWZ0eS53cmFwSW50byhjb250ZW50LCAnRk0nLCBhdCwgbGVuKTtcbn1cblxuLyoqXG4gKiBJbnNlcnQgY2xpY2thYmxlIGJ1dHRvbiBpbnRvIERyYWZ0eSBkb2N1bWVudC5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eXxzdHJpbmd9IGNvbnRlbnQgLSBEcmFmdHkgZG9jdW1lbnQgdG8gaW5zZXJ0IGJ1dHRvbiB0byBvciBhIHN0cmluZyB0byBiZSB1c2VkIGFzIGJ1dHRvbiB0ZXh0LlxuICogQHBhcmFtIHtudW1iZXJ9IGF0IC0gbG9jYXRpb24gd2hlcmUgdGhlIGJ1dHRvbiBpcyBpbnNlcnRlZC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBsZW4gLSB0aGUgbGVuZ3RoIG9mIHRoZSB0ZXh0IHRvIGJlIHVzZWQgYXMgYnV0dG9uIHRpdGxlLlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSB0aGUgYnV0dG9uLiBDbGllbnQgc2hvdWxkIHJldHVybiBpdCB0byB0aGUgc2VydmVyIHdoZW4gdGhlIGJ1dHRvbiBpcyBjbGlja2VkLlxuICogQHBhcmFtIHtzdHJpbmd9IGFjdGlvblR5cGUgLSB0aGUgdHlwZSBvZiB0aGUgYnV0dG9uLCBvbmUgb2YgJ3VybCcgb3IgJ3B1YicuXG4gKiBAcGFyYW0ge3N0cmluZ30gYWN0aW9uVmFsdWUgLSB0aGUgdmFsdWUgdG8gcmV0dXJuIG9uIGNsaWNrOlxuICogQHBhcmFtIHtzdHJpbmd9IHJlZlVybCAtIHRoZSBVUkwgdG8gZ28gdG8gd2hlbiB0aGUgJ3VybCcgYnV0dG9uIGlzIGNsaWNrZWQuXG4gKlxuICogQHJldHVybiB7RHJhZnR5fSB1cGRhdGVkIGRvY3VtZW50LlxuICovXG5EcmFmdHkuaW5zZXJ0QnV0dG9uID0gZnVuY3Rpb24oY29udGVudCwgYXQsIGxlbiwgbmFtZSwgYWN0aW9uVHlwZSwgYWN0aW9uVmFsdWUsIHJlZlVybCkge1xuICBpZiAodHlwZW9mIGNvbnRlbnQgPT0gJ3N0cmluZycpIHtcbiAgICBjb250ZW50ID0ge1xuICAgICAgdHh0OiBjb250ZW50XG4gICAgfTtcbiAgfVxuXG4gIGlmICghY29udGVudCB8fCAhY29udGVudC50eHQgfHwgY29udGVudC50eHQubGVuZ3RoIDwgYXQgKyBsZW4pIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmIChsZW4gPD0gMCB8fCBbJ3VybCcsICdwdWInXS5pbmRleE9mKGFjdGlvblR5cGUpID09IC0xKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgLy8gRW5zdXJlIHJlZlVybCBpcyBhIHN0cmluZy5cbiAgaWYgKGFjdGlvblR5cGUgPT0gJ3VybCcgJiYgIXJlZlVybCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJlZlVybCA9ICcnICsgcmVmVXJsO1xuXG4gIGNvbnRlbnQuZW50ID0gY29udGVudC5lbnQgfHwgW107XG4gIGNvbnRlbnQuZm10ID0gY29udGVudC5mbXQgfHwgW107XG5cbiAgY29udGVudC5mbXQucHVzaCh7XG4gICAgYXQ6IGF0IHwgMCxcbiAgICBsZW46IGxlbixcbiAgICBrZXk6IGNvbnRlbnQuZW50Lmxlbmd0aFxuICB9KTtcbiAgY29udGVudC5lbnQucHVzaCh7XG4gICAgdHA6ICdCTicsXG4gICAgZGF0YToge1xuICAgICAgYWN0OiBhY3Rpb25UeXBlLFxuICAgICAgdmFsOiBhY3Rpb25WYWx1ZSxcbiAgICAgIHJlZjogcmVmVXJsLFxuICAgICAgbmFtZTogbmFtZVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbi8qKlxuICogQXBwZW5kIGNsaWNrYWJsZSBidXR0b24gdG8gRHJhZnR5IGRvY3VtZW50LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fHN0cmluZ30gY29udGVudCAtIERyYWZ0eSBkb2N1bWVudCB0byBpbnNlcnQgYnV0dG9uIHRvIG9yIGEgc3RyaW5nIHRvIGJlIHVzZWQgYXMgYnV0dG9uIHRleHQuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGl0bGUgLSB0aGUgdGV4dCB0byBiZSB1c2VkIGFzIGJ1dHRvbiB0aXRsZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gdGhlIGJ1dHRvbi4gQ2xpZW50IHNob3VsZCByZXR1cm4gaXQgdG8gdGhlIHNlcnZlciB3aGVuIHRoZSBidXR0b24gaXMgY2xpY2tlZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBhY3Rpb25UeXBlIC0gdGhlIHR5cGUgb2YgdGhlIGJ1dHRvbiwgb25lIG9mICd1cmwnIG9yICdwdWInLlxuICogQHBhcmFtIHtzdHJpbmd9IGFjdGlvblZhbHVlIC0gdGhlIHZhbHVlIHRvIHJldHVybiBvbiBjbGljazpcbiAqIEBwYXJhbSB7c3RyaW5nfSByZWZVcmwgLSB0aGUgVVJMIHRvIGdvIHRvIHdoZW4gdGhlICd1cmwnIGJ1dHRvbiBpcyBjbGlja2VkLlxuICpcbiAqIEByZXR1cm4ge0RyYWZ0eX0gdXBkYXRlZCBkb2N1bWVudC5cbiAqL1xuRHJhZnR5LmFwcGVuZEJ1dHRvbiA9IGZ1bmN0aW9uKGNvbnRlbnQsIHRpdGxlLCBuYW1lLCBhY3Rpb25UeXBlLCBhY3Rpb25WYWx1ZSwgcmVmVXJsKSB7XG4gIGNvbnRlbnQgPSBjb250ZW50IHx8IHtcbiAgICB0eHQ6ICcnXG4gIH07XG4gIGNvbnN0IGF0ID0gY29udGVudC50eHQubGVuZ3RoO1xuICBjb250ZW50LnR4dCArPSB0aXRsZTtcbiAgcmV0dXJuIERyYWZ0eS5pbnNlcnRCdXR0b24oY29udGVudCwgYXQsIHRpdGxlLmxlbmd0aCwgbmFtZSwgYWN0aW9uVHlwZSwgYWN0aW9uVmFsdWUsIHJlZlVybCk7XG59XG5cbi8qKlxuICogQXR0YWNoIGEgZ2VuZXJpYyBKUyBvYmplY3QuIFRoZSBvYmplY3QgaXMgYXR0YWNoZWQgYXMgYSBqc29uIHN0cmluZy5cbiAqIEludGVuZGVkIGZvciByZXByZXNlbnRpbmcgYSBmb3JtIHJlc3BvbnNlLlxuICpcbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIERyYWZ0eSBkb2N1bWVudCB0byBhdHRhY2ggZmlsZSB0by5cbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIC0gZGF0YSB0byBjb252ZXJ0IHRvIGpzb24gc3RyaW5nIGFuZCBhdHRhY2guXG4gKiBAcmV0dXJucyB7RHJhZnR5fSB0aGUgc2FtZSBkb2N1bWVudCBhcyA8Y29kZT5jb250ZW50PC9jb2RlPi5cbiAqL1xuRHJhZnR5LmF0dGFjaEpTT04gPSBmdW5jdGlvbihjb250ZW50LCBkYXRhKSB7XG4gIGNvbnRlbnQgPSBjb250ZW50IHx8IHtcbiAgICB0eHQ6ICcnXG4gIH07XG4gIGNvbnRlbnQuZW50ID0gY29udGVudC5lbnQgfHwgW107XG4gIGNvbnRlbnQuZm10ID0gY29udGVudC5mbXQgfHwgW107XG5cbiAgY29udGVudC5mbXQucHVzaCh7XG4gICAgYXQ6IC0xLFxuICAgIGxlbjogMCxcbiAgICBrZXk6IGNvbnRlbnQuZW50Lmxlbmd0aFxuICB9KTtcblxuICBjb250ZW50LmVudC5wdXNoKHtcbiAgICB0cDogJ0VYJyxcbiAgICBkYXRhOiB7XG4gICAgICBtaW1lOiBKU09OX01JTUVfVFlQRSxcbiAgICAgIHZhbDogZGF0YVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG4vKipcbiAqIEFwcGVuZCBsaW5lIGJyZWFrIHRvIGEgRHJhZnR5IGRvY3VtZW50LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gRHJhZnR5IGRvY3VtZW50IHRvIGFwcGVuZCBsaW5lYnJlYWsgdG8uXG4gKiBAcmV0dXJucyB7RHJhZnR5fSB0aGUgc2FtZSBkb2N1bWVudCBhcyA8Y29kZT5jb250ZW50PC9jb2RlPi5cbiAqL1xuRHJhZnR5LmFwcGVuZExpbmVCcmVhayA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcbiAgY29udGVudCA9IGNvbnRlbnQgfHwge1xuICAgIHR4dDogJydcbiAgfTtcbiAgY29udGVudC5mbXQgPSBjb250ZW50LmZtdCB8fCBbXTtcbiAgY29udGVudC5mbXQucHVzaCh7XG4gICAgYXQ6IGNvbnRlbnQudHh0Lmxlbmd0aCxcbiAgICBsZW46IDEsXG4gICAgdHA6ICdCUidcbiAgfSk7XG4gIGNvbnRlbnQudHh0ICs9ICcgJztcblxuICByZXR1cm4gY29udGVudDtcbn1cbi8qKlxuICogR2l2ZW4gRHJhZnR5IGRvY3VtZW50LCBjb252ZXJ0IGl0IHRvIEhUTUwuXG4gKiBObyBhdHRlbXB0IGlzIG1hZGUgdG8gc3RyaXAgcHJlLWV4aXN0aW5nIGh0bWwgbWFya3VwLlxuICogVGhpcyBpcyBwb3RlbnRpYWxseSB1bnNhZmUgYmVjYXVzZSA8Y29kZT5jb250ZW50LnR4dDwvY29kZT4gbWF5IGNvbnRhaW4gbWFsaWNpb3VzIEhUTUxcbiAqIG1hcmt1cC5cbiAqIEBtZW1iZXJvZiBUaW5vZGUuRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGRvYyAtIGRvY3VtZW50IHRvIGNvbnZlcnQuXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gSFRNTC1yZXByZXNlbnRhdGlvbiBvZiBjb250ZW50LlxuICovXG5EcmFmdHkuVU5TQUZFX3RvSFRNTCA9IGZ1bmN0aW9uKGRvYykge1xuICBjb25zdCB0cmVlID0gZHJhZnR5VG9UcmVlKGRvYyk7XG4gIGNvbnN0IGh0bWxGb3JtYXR0ZXIgPSBmdW5jdGlvbih0eXBlLCBkYXRhLCB2YWx1ZXMpIHtcbiAgICBjb25zdCB0YWcgPSBERUNPUkFUT1JTW3R5cGVdO1xuICAgIGxldCByZXN1bHQgPSB2YWx1ZXMgPyB2YWx1ZXMuam9pbignJykgOiAnJztcbiAgICBpZiAodGFnKSB7XG4gICAgICByZXN1bHQgPSB0YWcub3BlbihkYXRhKSArIHJlc3VsdCArIHRhZy5jbG9zZShkYXRhKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbiAgcmV0dXJuIHRyZWVCb3R0b21VcCh0cmVlLCBodG1sRm9ybWF0dGVyLCAwKTtcbn1cblxuLyoqXG4gKiBDYWxsYmFjayBmb3IgYXBwbHlpbmcgY3VzdG9tIGZvcm1hdHRpbmcgdG8gYSBEcmFmdHkgZG9jdW1lbnQuXG4gKiBDYWxsZWQgb25jZSBmb3IgZWFjaCBzdHlsZSBzcGFuLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBjYWxsYmFjayBGb3JtYXR0ZXJcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHlsZSAtIHN0eWxlIGNvZGUgc3VjaCBhcyBcIlNUXCIgb3IgXCJJTVwiLlxuICogQHBhcmFtIHtPYmplY3R9IGRhdGEgLSBlbnRpdHkncyBkYXRhLlxuICogQHBhcmFtIHtPYmplY3R9IHZhbHVlcyAtIHBvc3NpYmx5IHN0eWxlZCBzdWJzcGFucyBjb250YWluZWQgaW4gdGhpcyBzdHlsZSBzcGFuLlxuICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IC0gaW5kZXggb2YgdGhlIGVsZW1lbnQgZ3VhcmFudGVlZCB0byBiZSB1bmlxdWUuXG4gKi9cblxuLyoqXG4gKiBDb252ZXJ0IERyYWZ0eSBkb2N1bWVudCB0byBhIHJlcHJlc2VudGF0aW9uIHN1aXRhYmxlIGZvciBkaXNwbGF5LlxuICogVGhlIDxjb2RlPmNvbnRleHQ8L2NvZGU+IG1heSBleHBvc2UgYSBmdW5jdGlvbiA8Y29kZT5nZXRGb3JtYXR0ZXIoc3R5bGUpPC9jb2RlPi4gSWYgaXQncyBhdmFpbGFibGVcbiAqIGl0IHdpbGwgY2FsbCBpdCB0byBvYnRhaW4gYSA8Y29kZT5mb3JtYXR0ZXI8L2NvZGU+IGZvciBhIHN1YnRyZWUgb2Ygc3R5bGVzIHVuZGVyIHRoZSA8Y29kZT5zdHlsZTwvY29kZT4uXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl8T2JqZWN0fSBjb250ZW50IC0gRHJhZnR5IGRvY3VtZW50IHRvIHRyYW5zZm9ybS5cbiAqIEBwYXJhbSB7Rm9ybWF0dGVyfSBmb3JtYXR0ZXIgLSBjYWxsYmFjayB3aGljaCBmb3JtYXRzIGluZGl2aWR1YWwgZWxlbWVudHMuXG4gKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCAtIGNvbnRleHQgcHJvdmlkZWQgdG8gZm9ybWF0dGVyIGFzIDxjb2RlPnRoaXM8L2NvZGU+LlxuICpcbiAqIEByZXR1cm4ge09iamVjdH0gdHJhbnNmb3JtZWQgb2JqZWN0XG4gKi9cbkRyYWZ0eS5mb3JtYXQgPSBmdW5jdGlvbihvcmlnaW5hbCwgZm9ybWF0dGVyLCBjb250ZXh0KSB7XG4gIHJldHVybiB0cmVlQm90dG9tVXAoZHJhZnR5VG9UcmVlKG9yaWdpbmFsKSwgZm9ybWF0dGVyLCAwLCBbXSwgY29udGV4dCk7XG59XG5cbi8qKlxuICogU2hvcnRlbiBEcmFmdHkgZG9jdW1lbnQgbWFraW5nIHRoZSBkcmFmdHkgdGV4dCBubyBsb25nZXIgdGhhbiB0aGUgbGltaXQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl8c3RyaW5nfSBvcmlnaW5hbCAtIERyYWZ0eSBvYmplY3QgdG8gc2hvcnRlbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBsaW1pdCAtIGxlbmd0aCBpbiBjaGFyYWNyZXRzIHRvIHNob3J0ZW4gdG8uXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGxpZ2h0IC0gcmVtb3ZlIGhlYXZ5IGRhdGEgZnJvbSBlbnRpdGllcy5cbiAqIEByZXR1cm5zIG5ldyBzaG9ydGVuZWQgRHJhZnR5IG9iamVjdCBsZWF2aW5nIHRoZSBvcmlnaW5hbCBpbnRhY3QuXG4gKi9cbkRyYWZ0eS5zaG9ydGVuID0gZnVuY3Rpb24ob3JpZ2luYWwsIGxpbWl0LCBsaWdodCkge1xuICBsZXQgdHJlZSA9IGRyYWZ0eVRvVHJlZShvcmlnaW5hbCk7XG4gIHRyZWUgPSBzaG9ydGVuVHJlZSh0cmVlLCBsaW1pdCwgJ+KApicpO1xuICBpZiAodHJlZSAmJiBsaWdodCkge1xuICAgIHRyZWUgPSBsaWdodEVudGl0eSh0cmVlKTtcbiAgfVxuICByZXR1cm4gdHJlZVRvRHJhZnR5KHt9LCB0cmVlLCBbXSk7XG59XG5cbi8qKlxuICogVHJhbnNmb3JtIERyYWZ0eSBkb2MgZm9yIGZvcndhcmRpbmc6IHN0cmlwIGxlYWRpbmcgQG1lbnRpb24gYW5kIGFueSBsZWFkaW5nIGxpbmUgYnJlYWtzIG9yIHdoaXRlc3BhY2UuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl8c3RyaW5nfSBvcmlnaW5hbCAtIERyYWZ0eSBvYmplY3QgdG8gc2hvcnRlbi5cbiAqIEByZXR1cm5zIGNvbnZlcnRlZCBEcmFmdHkgb2JqZWN0IGxlYXZpbmcgdGhlIG9yaWdpbmFsIGludGFjdC5cbiAqL1xuRHJhZnR5LmZvcndhcmRlZENvbnRlbnQgPSBmdW5jdGlvbihvcmlnaW5hbCkge1xuICBsZXQgdHJlZSA9IGRyYWZ0eVRvVHJlZShvcmlnaW5hbCk7XG4gIGNvbnN0IHJtTWVudGlvbiA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICBpZiAobm9kZS50eXBlID09ICdNTicpIHtcbiAgICAgIGlmICghbm9kZS5wYXJlbnQgfHwgIW5vZGUucGFyZW50LnR5cGUpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBub2RlO1xuICB9XG4gIC8vIFN0cmlwIGxlYWRpbmcgbWVudGlvbi5cbiAgdHJlZSA9IHRyZWVUb3BEb3duKHRyZWUsIHJtTWVudGlvbik7XG4gIC8vIFJlbW92ZSBsZWFkaW5nIHdoaXRlc3BhY2UuXG4gIHRyZWUgPSBsVHJpbSh0cmVlKTtcbiAgLy8gQ29udmVydCBiYWNrIHRvIERyYWZ0eS5cbiAgcmV0dXJuIHRyZWVUb0RyYWZ0eSh7fSwgdHJlZSwgW10pO1xufVxuXG4vKipcbiAqIFByZXBhcmUgRHJhZnR5IGRvYyBmb3Igd3JhcHBpbmcgaW50byBRUSBhcyBhIHJlcGx5OlxuICogIC0gUmVwbGFjZSBmb3J3YXJkaW5nIG1lbnRpb24gd2l0aCBzeW1ib2wgJ+KepicgYW5kIHJlbW92ZSBkYXRhIChVSUQpLlxuICogIC0gUmVtb3ZlIHF1b3RlZCB0ZXh0IGNvbXBsZXRlbHkuXG4gKiAgLSBSZXBsYWNlIGxpbmUgYnJlYWtzIHdpdGggc3BhY2VzLlxuICogIC0gU3RyaXAgZW50aXRpZXMgb2YgaGVhdnkgY29udGVudC5cbiAqICAtIE1vdmUgYXR0YWNobWVudHMgdG8gdGhlIGVuZCBvZiB0aGUgZG9jdW1lbnQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl8c3RyaW5nfSBvcmlnaW5hbCAtIERyYWZ0eSBvYmplY3QgdG8gc2hvcnRlbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBsaW1pdCAtIGxlbmd0aCBpbiBjaGFyYWN0ZXJzIHRvIHNob3J0ZW4gdG8uXG4gKiBAcmV0dXJucyBjb252ZXJ0ZWQgRHJhZnR5IG9iamVjdCBsZWF2aW5nIHRoZSBvcmlnaW5hbCBpbnRhY3QuXG4gKi9cbkRyYWZ0eS5yZXBseUNvbnRlbnQgPSBmdW5jdGlvbihvcmlnaW5hbCwgbGltaXQpIHtcbiAgY29uc3QgY29udk1OblFRbkJSID0gZnVuY3Rpb24obm9kZSkge1xuICAgIGlmIChub2RlLnR5cGUgPT0gJ1FRJykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBlbHNlIGlmIChub2RlLnR5cGUgPT0gJ01OJykge1xuICAgICAgaWYgKCghbm9kZS5wYXJlbnQgfHwgIW5vZGUucGFyZW50LnR5cGUpICYmIChub2RlLnRleHQgfHwgJycpLnN0YXJ0c1dpdGgoJ+KepicpKSB7XG4gICAgICAgIG5vZGUudGV4dCA9ICfinqYnO1xuICAgICAgICBkZWxldGUgbm9kZS5jaGlsZHJlbjtcbiAgICAgICAgZGVsZXRlIG5vZGUuZGF0YTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG5vZGUudHlwZSA9PSAnQlInKSB7XG4gICAgICBub2RlLnRleHQgPSAnICc7XG4gICAgICBkZWxldGUgbm9kZS50eXBlO1xuICAgICAgZGVsZXRlIG5vZGUuY2hpbGRyZW47XG4gICAgfVxuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgbGV0IHRyZWUgPSBkcmFmdHlUb1RyZWUob3JpZ2luYWwpO1xuICBpZiAoIXRyZWUpIHtcbiAgICByZXR1cm4gb3JpZ2luYWw7XG4gIH1cblxuICAvLyBTdHJpcCBsZWFkaW5nIG1lbnRpb24uXG4gIHRyZWUgPSB0cmVlVG9wRG93bih0cmVlLCBjb252TU5uUVFuQlIpO1xuICAvLyBNb3ZlIGF0dGFjaG1lbnRzIHRvIHRoZSBlbmQgb2YgdGhlIGRvYy5cbiAgdHJlZSA9IGF0dGFjaG1lbnRzVG9FbmQodHJlZSwgTUFYX1BSRVZJRVdfQVRUQUNITUVOVFMpO1xuICAvLyBTaG9ydGVuIHRoZSBkb2MuXG4gIHRyZWUgPSBzaG9ydGVuVHJlZSh0cmVlLCBsaW1pdCwgJ+KApicpO1xuICAvLyBTdHJpcCBoZWF2eSBlbGVtZW50cyBleGNlcHQgSU0uZGF0YVsndmFsJ10gKGhhdmUgdG8ga2VlcCB0aGVtIHRvIGdlbmVyYXRlIHByZXZpZXdzIGxhdGVyKS5cbiAgdHJlZSA9IGxpZ2h0RW50aXR5KHRyZWUsIG5vZGUgPT4gKG5vZGUudHlwZSA9PSAnSU0nID8gWyd2YWwnXSA6IG51bGwpKTtcbiAgLy8gQ29udmVydCBiYWNrIHRvIERyYWZ0eS5cbiAgcmV0dXJuIHRyZWVUb0RyYWZ0eSh7fSwgdHJlZSwgW10pO1xufVxuXG5cbi8qKlxuICogR2VuZXJhdGUgZHJhZnR5IHByZXZpZXc6XG4gKiAgLSBTaG9ydGVuIHRoZSBkb2N1bWVudC5cbiAqICAtIFN0cmlwIGFsbCBoZWF2eSBlbnRpdHkgZGF0YSBsZWF2aW5nIGp1c3QgaW5saW5lIHN0eWxlcyBhbmQgZW50aXR5IHJlZmVyZW5jZXMuXG4gKiAgLSBSZXBsYWNlIGxpbmUgYnJlYWtzIHdpdGggc3BhY2VzLlxuICogIC0gUmVwbGFjZSBjb250ZW50IG9mIFFRIHdpdGggYSBzcGFjZS5cbiAqICAtIFJlcGxhY2UgZm9yd2FyZGluZyBtZW50aW9uIHdpdGggc3ltYm9sICfinqYnLlxuICogbW92ZSBhbGwgYXR0YWNobWVudHMgdG8gdGhlIGVuZCBvZiB0aGUgZG9jdW1lbnQgYW5kIG1ha2UgdGhlbSB2aXNpYmxlLlxuICogVGhlIDxjb2RlPmNvbnRleHQ8L2NvZGU+IG1heSBleHBvc2UgYSBmdW5jdGlvbiA8Y29kZT5nZXRGb3JtYXR0ZXIoc3R5bGUpPC9jb2RlPi4gSWYgaXQncyBhdmFpbGFibGVcbiAqIGl0IHdpbGwgY2FsbCBpdCB0byBvYnRhaW4gYSA8Y29kZT5mb3JtYXR0ZXI8L2NvZGU+IGZvciBhIHN1YnRyZWUgb2Ygc3R5bGVzIHVuZGVyIHRoZSA8Y29kZT5zdHlsZTwvY29kZT4uXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl8c3RyaW5nfSBvcmlnaW5hbCAtIERyYWZ0eSBvYmplY3QgdG8gc2hvcnRlbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBsaW1pdCAtIGxlbmd0aCBpbiBjaGFyYWN0ZXJzIHRvIHNob3J0ZW4gdG8uXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGZvcndhcmRpbmcgLSB0aGlzIGEgZm9yd2FyZGluZyBtZXNzYWdlIHByZXZpZXcuXG4gKiBAcmV0dXJucyBuZXcgc2hvcnRlbmVkIERyYWZ0eSBvYmplY3QgbGVhdmluZyB0aGUgb3JpZ2luYWwgaW50YWN0LlxuICovXG5EcmFmdHkucHJldmlldyA9IGZ1bmN0aW9uKG9yaWdpbmFsLCBsaW1pdCwgZm9yd2FyZGluZykge1xuICBsZXQgdHJlZSA9IGRyYWZ0eVRvVHJlZShvcmlnaW5hbCk7XG5cbiAgLy8gTW92ZSBhdHRhY2htZW50cyB0byB0aGUgZW5kLlxuICB0cmVlID0gYXR0YWNobWVudHNUb0VuZCh0cmVlLCBNQVhfUFJFVklFV19BVFRBQ0hNRU5UUyk7XG5cbiAgLy8gQ29udmVydCBsZWFkaW5nIG1lbnRpb24gdG8gJ+KepicgYW5kIHJlcGxhY2UgUVEgYW5kIEJSIHdpdGggYSBzcGFjZSAnICcuXG4gIGNvbnN0IGNvbnZNTm5RUW5CUiA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICBpZiAobm9kZS50eXBlID09ICdNTicpIHtcbiAgICAgIGlmICgoIW5vZGUucGFyZW50IHx8ICFub2RlLnBhcmVudC50eXBlKSAmJiAobm9kZS50ZXh0IHx8ICcnKS5zdGFydHNXaXRoKCfinqYnKSkge1xuICAgICAgICBub2RlLnRleHQgPSAn4p6mJztcbiAgICAgICAgZGVsZXRlIG5vZGUuY2hpbGRyZW47XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChub2RlLnR5cGUgPT0gJ1FRJykge1xuICAgICAgbm9kZS50ZXh0ID0gJyAnO1xuICAgICAgZGVsZXRlIG5vZGUuY2hpbGRyZW47XG4gICAgfSBlbHNlIGlmIChub2RlLnR5cGUgPT0gJ0JSJykge1xuICAgICAgbm9kZS50ZXh0ID0gJyAnO1xuICAgICAgZGVsZXRlIG5vZGUuY2hpbGRyZW47XG4gICAgICBkZWxldGUgbm9kZS50eXBlO1xuICAgIH1cbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuICB0cmVlID0gdHJlZVRvcERvd24odHJlZSwgY29udk1OblFRbkJSKTtcblxuICB0cmVlID0gc2hvcnRlblRyZWUodHJlZSwgbGltaXQsICfigKYnKTtcbiAgaWYgKGZvcndhcmRpbmcpIHtcbiAgICAvLyBLZWVwIElNIGRhdGEgZm9yIHByZXZpZXcuXG4gICAgdHJlZSA9IGxpZ2h0RW50aXR5KHRyZWUsIG5vZGUgPT4gKG5vZGUudHlwZSA9PSAnSU0nID8gWyd2YWwnXSA6IG51bGwpKTtcbiAgfSBlbHNlIHtcbiAgICB0cmVlID0gbGlnaHRFbnRpdHkodHJlZSk7XG4gIH1cblxuICAvLyBDb252ZXJ0IGJhY2sgdG8gRHJhZnR5LlxuICByZXR1cm4gdHJlZVRvRHJhZnR5KHt9LCB0cmVlLCBbXSk7XG59XG5cbi8qKlxuICogR2l2ZW4gRHJhZnR5IGRvY3VtZW50LCBjb252ZXJ0IGl0IHRvIHBsYWluIHRleHQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBkb2N1bWVudCB0byBjb252ZXJ0IHRvIHBsYWluIHRleHQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBwbGFpbi10ZXh0IHJlcHJlc2VudGF0aW9uIG9mIHRoZSBkcmFmdHkgZG9jdW1lbnQuXG4gKi9cbkRyYWZ0eS50b1BsYWluVGV4dCA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcbiAgcmV0dXJuIHR5cGVvZiBjb250ZW50ID09ICdzdHJpbmcnID8gY29udGVudCA6IGNvbnRlbnQudHh0O1xufVxuXG4vKipcbiAqIENoZWNrIGlmIHRoZSBkb2N1bWVudCBoYXMgbm8gbWFya3VwIGFuZCBubyBlbnRpdGllcy5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIGNvbnRlbnQgdG8gY2hlY2sgZm9yIHByZXNlbmNlIG9mIG1hcmt1cC5cbiAqIEByZXR1cm5zIDxjb2RlPnRydWU8L2NvZGU+IGlzIGNvbnRlbnQgaXMgcGxhaW4gdGV4dCwgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAqL1xuRHJhZnR5LmlzUGxhaW5UZXh0ID0gZnVuY3Rpb24oY29udGVudCkge1xuICByZXR1cm4gdHlwZW9mIGNvbnRlbnQgPT0gJ3N0cmluZycgfHwgIShjb250ZW50LmZtdCB8fCBjb250ZW50LmVudCk7XG59XG5cbi8qKlxuICogQ29udmVydCBkb2N1bWVudCB0byBwbGFpbiB0ZXh0IHdpdGggbWFya2Rvd24uIEFsbCBlbGVtZW50cyB3aGljaCBjYW5ub3RcbiAqIGJlIHJlcHJlc2VudGVkIGluIG1hcmtkb3duIGFyZSBzdHJpcHBlZC5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIGRvY3VtZW50IHRvIGNvbnZlcnQgdG8gcGxhaW4gdGV4dCB3aXRoIG1hcmtkb3duLlxuICovXG5EcmFmdHkudG9NYXJrZG93biA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcbiAgbGV0IHRyZWUgPSBkcmFmdHlUb1RyZWUoY29udGVudCk7XG4gIGNvbnN0IG1kRm9ybWF0dGVyID0gZnVuY3Rpb24odHlwZSwgXywgdmFsdWVzKSB7XG4gICAgY29uc3QgZGVmID0gRk9STUFUX1RBR1NbdHlwZV07XG4gICAgbGV0IHJlc3VsdCA9ICh2YWx1ZXMgPyB2YWx1ZXMuam9pbignJykgOiAnJyk7XG4gICAgaWYgKGRlZikge1xuICAgICAgaWYgKGRlZi5pc1ZvaWQpIHtcbiAgICAgICAgcmVzdWx0ID0gZGVmLm1kX3RhZyB8fCAnJztcbiAgICAgIH0gZWxzZSBpZiAoZGVmLm1kX3RhZykge1xuICAgICAgICByZXN1bHQgPSBkZWYubWRfdGFnICsgcmVzdWx0ICsgZGVmLm1kX3RhZztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbiAgcmV0dXJuIHRyZWVCb3R0b21VcCh0cmVlLCBtZEZvcm1hdHRlciwgMCk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIHRoZSBvYmplY3QgcmVwcmVzZXRzIGlzIGEgdmFsaWQgRHJhZnR5IGRvY3VtZW50LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gY29udGVudCB0byBjaGVjayBmb3IgdmFsaWRpdHkuXG4gKiBAcmV0dXJucyA8Y29kZT50cnVlPC9jb2RlPiBpcyBjb250ZW50IGlzIHZhbGlkLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICovXG5EcmFmdHkuaXNWYWxpZCA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcbiAgaWYgKCFjb250ZW50KSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3Qge1xuICAgIHR4dCxcbiAgICBmbXQsXG4gICAgZW50XG4gIH0gPSBjb250ZW50O1xuXG4gIGlmICghdHh0ICYmIHR4dCAhPT0gJycgJiYgIWZtdCAmJiAhZW50KSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgdHh0X3R5cGUgPSB0eXBlb2YgdHh0O1xuICBpZiAodHh0X3R5cGUgIT0gJ3N0cmluZycgJiYgdHh0X3R5cGUgIT0gJ3VuZGVmaW5lZCcgJiYgdHh0ICE9PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBmbXQgIT0gJ3VuZGVmaW5lZCcgJiYgIUFycmF5LmlzQXJyYXkoZm10KSAmJiBmbXQgIT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAodHlwZW9mIGVudCAhPSAndW5kZWZpbmVkJyAmJiAhQXJyYXkuaXNBcnJheShlbnQpICYmIGVudCAhPT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgZHJhZnR5IGRvY3VtZW50IGhhcyBhdHRhY2htZW50czogc3R5bGUgRVggYW5kIG91dHNpZGUgb2Ygbm9ybWFsIHJlbmRlcmluZyBmbG93LFxuICogaS5lLiA8Y29kZT5hdCA9IC0xPC9jb2RlPi5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIGRvY3VtZW50IHRvIGNoZWNrIGZvciBhdHRhY2htZW50cy5cbiAqIEByZXR1cm5zIDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZXJlIGFyZSBhdHRhY2htZW50cy5cbiAqL1xuRHJhZnR5Lmhhc0F0dGFjaG1lbnRzID0gZnVuY3Rpb24oY29udGVudCkge1xuICBpZiAoIUFycmF5LmlzQXJyYXkoY29udGVudC5mbXQpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGZvciAobGV0IGkgaW4gY29udGVudC5mbXQpIHtcbiAgICBjb25zdCBmbXQgPSBjb250ZW50LmZtdFtpXTtcbiAgICBpZiAoZm10ICYmIGZtdC5hdCA8IDApIHtcbiAgICAgIGNvbnN0IGVudCA9IGNvbnRlbnQuZW50W2ZtdC5rZXkgfCAwXTtcbiAgICAgIHJldHVybiBlbnQgJiYgZW50LnRwID09ICdFWCcgJiYgZW50LmRhdGE7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBDYWxsYmFjayBmb3IgYXBwbHlpbmcgY3VzdG9tIGZvcm1hdHRpbmcvdHJhbnNmb3JtYXRpb24gdG8gYSBEcmFmdHkgZG9jdW1lbnQuXG4gKiBDYWxsZWQgb25jZSBmb3IgZWFjaCBlbnRpdHkuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQGNhbGxiYWNrIEVudGl0eUNhbGxiYWNrXG4gKiBAcGFyYW0ge09iamVjdH0gZGF0YSBlbnRpdHkgZGF0YS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBlbnRpdHkgdHlwZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCBlbnRpdHkncyBpbmRleCBpbiBgY29udGVudC5lbnRgLlxuICovXG5cbi8qKlxuICogRW51bWVyYXRlIGF0dGFjaG1lbnRzOiBzdHlsZSBFWCBhbmQgb3V0c2lkZSBvZiBub3JtYWwgcmVuZGVyaW5nIGZsb3csIGkuZS4gPGNvZGU+YXQgPSAtMTwvY29kZT4uXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBkb2N1bWVudCB0byBwcm9jZXNzIGZvciBhdHRhY2htZW50cy5cbiAqIEBwYXJhbSB7RW50aXR5Q2FsbGJhY2t9IGNhbGxiYWNrIC0gY2FsbGJhY2sgdG8gY2FsbCBmb3IgZWFjaCBhdHRhY2htZW50LlxuICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSB2YWx1ZSBvZiBcInRoaXNcIiBmb3IgY2FsbGJhY2suXG4gKi9cbkRyYWZ0eS5hdHRhY2htZW50cyA9IGZ1bmN0aW9uKGNvbnRlbnQsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShjb250ZW50LmZtdCkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgbGV0IGkgPSAwO1xuICBjb250ZW50LmZtdC5mb3JFYWNoKGZtdCA9PiB7XG4gICAgaWYgKGZtdCAmJiBmbXQuYXQgPCAwKSB7XG4gICAgICBjb25zdCBlbnQgPSBjb250ZW50LmVudFtmbXQua2V5IHwgMF07XG4gICAgICBpZiAoZW50ICYmIGVudC50cCA9PSAnRVgnICYmIGVudC5kYXRhKSB7XG4gICAgICAgIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgZW50LmRhdGEsIGkrKywgJ0VYJyk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgZHJhZnR5IGRvY3VtZW50IGhhcyBlbnRpdGllcy5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIGRvY3VtZW50IHRvIGNoZWNrIGZvciBlbnRpdGllcy5cbiAqIEByZXR1cm5zIDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZXJlIGFyZSBlbnRpdGllcy5cbiAqL1xuRHJhZnR5Lmhhc0VudGl0aWVzID0gZnVuY3Rpb24oY29udGVudCkge1xuICByZXR1cm4gY29udGVudC5lbnQgJiYgY29udGVudC5lbnQubGVuZ3RoID4gMDtcbn1cblxuLyoqXG4gKiBFbnVtZXJhdGUgZW50aXRpZXMuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBkb2N1bWVudCB3aXRoIGVudGl0aWVzIHRvIGVudW1lcmF0ZS5cbiAqIEBwYXJhbSB7RW50aXR5Q2FsbGJhY2t9IGNhbGxiYWNrIC0gY2FsbGJhY2sgdG8gY2FsbCBmb3IgZWFjaCBlbnRpdHkuXG4gKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCAtIHZhbHVlIG9mIFwidGhpc1wiIGZvciBjYWxsYmFjay5cbiAqL1xuRHJhZnR5LmVudGl0aWVzID0gZnVuY3Rpb24oY29udGVudCwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgaWYgKGNvbnRlbnQuZW50ICYmIGNvbnRlbnQuZW50Lmxlbmd0aCA+IDApIHtcbiAgICBmb3IgKGxldCBpIGluIGNvbnRlbnQuZW50KSB7XG4gICAgICBpZiAoY29udGVudC5lbnRbaV0pIHtcbiAgICAgICAgY2FsbGJhY2suY2FsbChjb250ZXh0LCBjb250ZW50LmVudFtpXS5kYXRhLCBpLCBjb250ZW50LmVudFtpXS50cCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogUmVtb3ZlIHVucmVjb2duaXplZCBmaWVsZHMgZnJvbSBlbnRpdHkgZGF0YVxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gZG9jdW1lbnQgd2l0aCBlbnRpdGllcyB0byBlbnVtZXJhdGUuXG4gKiBAcmV0dXJucyBjb250ZW50LlxuICovXG5EcmFmdHkuc2FuaXRpemVFbnRpdGllcyA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcbiAgaWYgKGNvbnRlbnQgJiYgY29udGVudC5lbnQgJiYgY29udGVudC5lbnQubGVuZ3RoID4gMCkge1xuICAgIGZvciAobGV0IGkgaW4gY29udGVudC5lbnQpIHtcbiAgICAgIGNvbnN0IGVudCA9IGNvbnRlbnQuZW50W2ldO1xuICAgICAgaWYgKGVudCAmJiBlbnQuZGF0YSkge1xuICAgICAgICBjb25zdCBkYXRhID0gY29weUVudERhdGEoZW50LmRhdGEpO1xuICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgIGNvbnRlbnQuZW50W2ldLmRhdGEgPSBkYXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRlbGV0ZSBjb250ZW50LmVudFtpXS5kYXRhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBjb250ZW50O1xufVxuXG4vKipcbiAqIEdpdmVuIHRoZSBlbnRpdHksIGdldCBVUkwgd2hpY2ggY2FuIGJlIHVzZWQgZm9yIGRvd25sb2FkaW5nXG4gKiBlbnRpdHkgZGF0YS5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZW50RGF0YSAtIGVudGl0eS5kYXRhIHRvIGdldCB0aGUgVVJsIGZyb20uXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBVUkwgdG8gZG93bmxvYWQgZW50aXR5IGRhdGEgb3IgPGNvZGU+bnVsbDwvY29kZT4uXG4gKi9cbkRyYWZ0eS5nZXREb3dubG9hZFVybCA9IGZ1bmN0aW9uKGVudERhdGEpIHtcbiAgbGV0IHVybCA9IG51bGw7XG4gIGlmIChlbnREYXRhLm1pbWUgIT0gSlNPTl9NSU1FX1RZUEUgJiYgZW50RGF0YS52YWwpIHtcbiAgICB1cmwgPSBiYXNlNjR0b09iamVjdFVybChlbnREYXRhLnZhbCwgZW50RGF0YS5taW1lLCBEcmFmdHkubG9nZ2VyKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZW50RGF0YS5yZWYgPT0gJ3N0cmluZycpIHtcbiAgICB1cmwgPSBlbnREYXRhLnJlZjtcbiAgfVxuICByZXR1cm4gdXJsO1xufVxuXG4vKipcbiAqIENoZWNrIGlmIHRoZSBlbnRpdHkgZGF0YSBpcyBub3QgcmVhZHkgZm9yIHNlbmRpbmcsIHN1Y2ggYXMgYmVpbmcgdXBsb2FkZWQgdG8gdGhlIHNlcnZlci5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZW50aXR5LmRhdGEgdG8gZ2V0IHRoZSBVUmwgZnJvbS5cbiAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIHVwbG9hZCBpcyBpbiBwcm9ncmVzcywgZmFsc2Ugb3RoZXJ3aXNlLlxuICovXG5EcmFmdHkuaXNQcm9jZXNzaW5nID0gZnVuY3Rpb24oZW50RGF0YSkge1xuICByZXR1cm4gISFlbnREYXRhLl9wcm9jZXNzaW5nO1xufVxuXG4vKipcbiAqIEdpdmVuIHRoZSBlbnRpdHksIGdldCBVUkwgd2hpY2ggY2FuIGJlIHVzZWQgZm9yIHByZXZpZXdpbmdcbiAqIHRoZSBlbnRpdHkuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGVudGl0eS5kYXRhIHRvIGdldCB0aGUgVVJsIGZyb20uXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gdXJsIGZvciBwcmV2aWV3aW5nIG9yIG51bGwgaWYgbm8gc3VjaCB1cmwgaXMgYXZhaWxhYmxlLlxuICovXG5EcmFmdHkuZ2V0UHJldmlld1VybCA9IGZ1bmN0aW9uKGVudERhdGEpIHtcbiAgcmV0dXJuIGVudERhdGEudmFsID8gYmFzZTY0dG9PYmplY3RVcmwoZW50RGF0YS52YWwsIGVudERhdGEubWltZSwgRHJhZnR5LmxvZ2dlcikgOiBudWxsO1xufVxuXG4vKipcbiAqIEdldCBhcHByb3hpbWF0ZSBzaXplIG9mIHRoZSBlbnRpdHkuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGVudERhdGEgLSBlbnRpdHkuZGF0YSB0byBnZXQgdGhlIHNpemUgZm9yLlxuICogQHJldHVybnMge251bWJlcn0gc2l6ZSBvZiBlbnRpdHkgZGF0YSBpbiBieXRlcy5cbiAqL1xuRHJhZnR5LmdldEVudGl0eVNpemUgPSBmdW5jdGlvbihlbnREYXRhKSB7XG4gIC8vIEVpdGhlciBzaXplIGhpbnQgb3IgbGVuZ3RoIG9mIHZhbHVlLiBUaGUgdmFsdWUgaXMgYmFzZTY0IGVuY29kZWQsXG4gIC8vIHRoZSBhY3R1YWwgb2JqZWN0IHNpemUgaXMgc21hbGxlciB0aGFuIHRoZSBlbmNvZGVkIGxlbmd0aC5cbiAgcmV0dXJuIGVudERhdGEuc2l6ZSA/IGVudERhdGEuc2l6ZSA6IGVudERhdGEudmFsID8gKGVudERhdGEudmFsLmxlbmd0aCAqIDAuNzUpIHwgMCA6IDA7XG59XG5cbi8qKlxuICogR2V0IGVudGl0eSBtaW1lIHR5cGUuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGVudERhdGEgLSBlbnRpdHkuZGF0YSB0byBnZXQgdGhlIHR5cGUgZm9yLlxuICogQHJldHVybnMge3N0cmluZ30gbWltZSB0eXBlIG9mIGVudGl0eS5cbiAqL1xuRHJhZnR5LmdldEVudGl0eU1pbWVUeXBlID0gZnVuY3Rpb24oZW50RGF0YSkge1xuICByZXR1cm4gZW50RGF0YS5taW1lIHx8ICd0ZXh0L3BsYWluJztcbn1cblxuLyoqXG4gKiBHZXQgSFRNTCB0YWcgZm9yIGEgZ2l2ZW4gdHdvLWxldHRlciBzdHlsZSBuYW1lLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHlsZSAtIHR3by1sZXR0ZXIgc3R5bGUsIGxpa2UgU1Qgb3IgTE4uXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gSFRNTCB0YWcgbmFtZSBpZiBzdHlsZSBpcyBmb3VuZCwge2NvZGU6IHVuZGVmaW5lZH0gaWYgc3R5bGUgaXMgZmFsc2lzaCBvciBub3QgZm91bmQuXG4gKi9cbkRyYWZ0eS50YWdOYW1lID0gZnVuY3Rpb24oc3R5bGUpIHtcbiAgcmV0dXJuIEZPUk1BVF9UQUdTW3N0eWxlXSAmJiBGT1JNQVRfVEFHU1tzdHlsZV0uaHRtbF90YWc7XG59XG5cbi8qKlxuICogRm9yIGEgZ2l2ZW4gZGF0YSBidW5kbGUgZ2VuZXJhdGUgYW4gb2JqZWN0IHdpdGggSFRNTCBhdHRyaWJ1dGVzLFxuICogZm9yIGluc3RhbmNlLCBnaXZlbiB7dXJsOiBcImh0dHA6Ly93d3cuZXhhbXBsZS5jb20vXCJ9IHJldHVyblxuICoge2hyZWY6IFwiaHR0cDovL3d3dy5leGFtcGxlLmNvbS9cIn1cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3R5bGUgLSB0d28tbGV0dGVyIHN0eWxlIHRvIGdlbmVyYXRlIGF0dHJpYnV0ZXMgZm9yLlxuICogQHBhcmFtIHtPYmplY3R9IGRhdGEgLSBkYXRhIGJ1bmRsZSB0byBjb252ZXJ0IHRvIGF0dHJpYnV0ZXNcbiAqXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBvYmplY3Qgd2l0aCBIVE1MIGF0dHJpYnV0ZXMuXG4gKi9cbkRyYWZ0eS5hdHRyVmFsdWUgPSBmdW5jdGlvbihzdHlsZSwgZGF0YSkge1xuICBpZiAoZGF0YSAmJiBERUNPUkFUT1JTW3N0eWxlXSkge1xuICAgIHJldHVybiBERUNPUkFUT1JTW3N0eWxlXS5wcm9wcyhkYXRhKTtcbiAgfVxuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogRHJhZnR5IE1JTUUgdHlwZS5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBjb250ZW50LVR5cGUgXCJ0ZXh0L3gtZHJhZnR5XCIuXG4gKi9cbkRyYWZ0eS5nZXRDb250ZW50VHlwZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gRFJBRlRZX01JTUVfVFlQRTtcbn1cblxuLy8gPT09PT09PT09PT09PT09PT1cbi8vIFV0aWxpdHkgbWV0aG9kcy5cbi8vID09PT09PT09PT09PT09PT09XG5cbi8vIFRha2UgYSBzdHJpbmcgYW5kIGRlZmluZWQgZWFybGllciBzdHlsZSBzcGFucywgcmUtY29tcG9zZSB0aGVtIGludG8gYSB0cmVlIHdoZXJlIGVhY2ggbGVhZiBpc1xuLy8gYSBzYW1lLXN0eWxlIChpbmNsdWRpbmcgdW5zdHlsZWQpIHN0cmluZy4gSS5lLiAnaGVsbG8gKmJvbGQgX2l0YWxpY18qIGFuZCB+bW9yZX4gd29ybGQnIC0+XG4vLyAoJ2hlbGxvICcsIChiOiAnYm9sZCAnLCAoaTogJ2l0YWxpYycpKSwgJyBhbmQgJywgKHM6ICdtb3JlJyksICcgd29ybGQnKTtcbi8vXG4vLyBUaGlzIGlzIG5lZWRlZCBpbiBvcmRlciB0byBjbGVhciBtYXJrdXAsIGkuZS4gJ2hlbGxvICp3b3JsZConIC0+ICdoZWxsbyB3b3JsZCcgYW5kIGNvbnZlcnRcbi8vIHJhbmdlcyBmcm9tIG1hcmt1cC1lZCBvZmZzZXRzIHRvIHBsYWluIHRleHQgb2Zmc2V0cy5cbmZ1bmN0aW9uIGNodW5raWZ5KGxpbmUsIHN0YXJ0LCBlbmQsIHNwYW5zKSB7XG4gIGNvbnN0IGNodW5rcyA9IFtdO1xuXG4gIGlmIChzcGFucy5sZW5ndGggPT0gMCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGZvciAobGV0IGkgaW4gc3BhbnMpIHtcbiAgICAvLyBHZXQgdGhlIG5leHQgY2h1bmsgZnJvbSB0aGUgcXVldWVcbiAgICBjb25zdCBzcGFuID0gc3BhbnNbaV07XG5cbiAgICAvLyBHcmFiIHRoZSBpbml0aWFsIHVuc3R5bGVkIGNodW5rXG4gICAgaWYgKHNwYW4uYXQgPiBzdGFydCkge1xuICAgICAgY2h1bmtzLnB1c2goe1xuICAgICAgICB0eHQ6IGxpbmUuc2xpY2Uoc3RhcnQsIHNwYW4uYXQpXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBHcmFiIHRoZSBzdHlsZWQgY2h1bmsuIEl0IG1heSBpbmNsdWRlIHN1YmNodW5rcy5cbiAgICBjb25zdCBjaHVuayA9IHtcbiAgICAgIHRwOiBzcGFuLnRwXG4gICAgfTtcbiAgICBjb25zdCBjaGxkID0gY2h1bmtpZnkobGluZSwgc3Bhbi5hdCArIDEsIHNwYW4uZW5kLCBzcGFuLmNoaWxkcmVuKTtcbiAgICBpZiAoY2hsZC5sZW5ndGggPiAwKSB7XG4gICAgICBjaHVuay5jaGlsZHJlbiA9IGNobGQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNodW5rLnR4dCA9IHNwYW4udHh0O1xuICAgIH1cbiAgICBjaHVua3MucHVzaChjaHVuayk7XG4gICAgc3RhcnQgPSBzcGFuLmVuZCArIDE7IC8vICcrMScgaXMgdG8gc2tpcCB0aGUgZm9ybWF0dGluZyBjaGFyYWN0ZXJcbiAgfVxuXG4gIC8vIEdyYWIgdGhlIHJlbWFpbmluZyB1bnN0eWxlZCBjaHVuaywgYWZ0ZXIgdGhlIGxhc3Qgc3BhblxuICBpZiAoc3RhcnQgPCBlbmQpIHtcbiAgICBjaHVua3MucHVzaCh7XG4gICAgICB0eHQ6IGxpbmUuc2xpY2Uoc3RhcnQsIGVuZClcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBjaHVua3M7XG59XG5cbi8vIERldGVjdCBzdGFydHMgYW5kIGVuZHMgb2YgZm9ybWF0dGluZyBzcGFucy4gVW5mb3JtYXR0ZWQgc3BhbnMgYXJlXG4vLyBpZ25vcmVkIGF0IHRoaXMgc3RhZ2UuXG5mdW5jdGlvbiBzcGFubmlmeShvcmlnaW5hbCwgcmVfc3RhcnQsIHJlX2VuZCwgdHlwZSkge1xuICBjb25zdCByZXN1bHQgPSBbXTtcbiAgbGV0IGluZGV4ID0gMDtcbiAgbGV0IGxpbmUgPSBvcmlnaW5hbC5zbGljZSgwKTsgLy8gbWFrZSBhIGNvcHk7XG5cbiAgd2hpbGUgKGxpbmUubGVuZ3RoID4gMCkge1xuICAgIC8vIG1hdGNoWzBdOyAvLyBtYXRjaCwgbGlrZSAnKmFiYyonXG4gICAgLy8gbWF0Y2hbMV07IC8vIG1hdGNoIGNhcHR1cmVkIGluIHBhcmVudGhlc2lzLCBsaWtlICdhYmMnXG4gICAgLy8gbWF0Y2hbJ2luZGV4J107IC8vIG9mZnNldCB3aGVyZSB0aGUgbWF0Y2ggc3RhcnRlZC5cblxuICAgIC8vIEZpbmQgdGhlIG9wZW5pbmcgdG9rZW4uXG4gICAgY29uc3Qgc3RhcnQgPSByZV9zdGFydC5leGVjKGxpbmUpO1xuICAgIGlmIChzdGFydCA9PSBudWxsKSB7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyBCZWNhdXNlIGphdmFzY3JpcHQgUmVnRXhwIGRvZXMgbm90IHN1cHBvcnQgbG9va2JlaGluZCwgdGhlIGFjdHVhbCBvZmZzZXQgbWF5IG5vdCBwb2ludFxuICAgIC8vIGF0IHRoZSBtYXJrdXAgY2hhcmFjdGVyLiBGaW5kIGl0IGluIHRoZSBtYXRjaGVkIHN0cmluZy5cbiAgICBsZXQgc3RhcnRfb2Zmc2V0ID0gc3RhcnRbJ2luZGV4J10gKyBzdGFydFswXS5sYXN0SW5kZXhPZihzdGFydFsxXSk7XG4gICAgLy8gQ2xpcCB0aGUgcHJvY2Vzc2VkIHBhcnQgb2YgdGhlIHN0cmluZy5cbiAgICBsaW5lID0gbGluZS5zbGljZShzdGFydF9vZmZzZXQgKyAxKTtcbiAgICAvLyBzdGFydF9vZmZzZXQgaXMgYW4gb2Zmc2V0IHdpdGhpbiB0aGUgY2xpcHBlZCBzdHJpbmcuIENvbnZlcnQgdG8gb3JpZ2luYWwgaW5kZXguXG4gICAgc3RhcnRfb2Zmc2V0ICs9IGluZGV4O1xuICAgIC8vIEluZGV4IG5vdyBwb2ludCB0byB0aGUgYmVnaW5uaW5nIG9mICdsaW5lJyB3aXRoaW4gdGhlICdvcmlnaW5hbCcgc3RyaW5nLlxuICAgIGluZGV4ID0gc3RhcnRfb2Zmc2V0ICsgMTtcblxuICAgIC8vIEZpbmQgdGhlIG1hdGNoaW5nIGNsb3NpbmcgdG9rZW4uXG4gICAgY29uc3QgZW5kID0gcmVfZW5kID8gcmVfZW5kLmV4ZWMobGluZSkgOiBudWxsO1xuICAgIGlmIChlbmQgPT0gbnVsbCkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGxldCBlbmRfb2Zmc2V0ID0gZW5kWydpbmRleCddICsgZW5kWzBdLmluZGV4T2YoZW5kWzFdKTtcbiAgICAvLyBDbGlwIHRoZSBwcm9jZXNzZWQgcGFydCBvZiB0aGUgc3RyaW5nLlxuICAgIGxpbmUgPSBsaW5lLnNsaWNlKGVuZF9vZmZzZXQgKyAxKTtcbiAgICAvLyBVcGRhdGUgb2Zmc2V0c1xuICAgIGVuZF9vZmZzZXQgKz0gaW5kZXg7XG4gICAgLy8gSW5kZXggbm93IHBvaW50cyB0byB0aGUgYmVnaW5uaW5nIG9mICdsaW5lJyB3aXRoaW4gdGhlICdvcmlnaW5hbCcgc3RyaW5nLlxuICAgIGluZGV4ID0gZW5kX29mZnNldCArIDE7XG5cbiAgICByZXN1bHQucHVzaCh7XG4gICAgICB0eHQ6IG9yaWdpbmFsLnNsaWNlKHN0YXJ0X29mZnNldCArIDEsIGVuZF9vZmZzZXQpLFxuICAgICAgY2hpbGRyZW46IFtdLFxuICAgICAgYXQ6IHN0YXJ0X29mZnNldCxcbiAgICAgIGVuZDogZW5kX29mZnNldCxcbiAgICAgIHRwOiB0eXBlXG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vLyBDb252ZXJ0IGxpbmVhciBhcnJheSBvciBzcGFucyBpbnRvIGEgdHJlZSByZXByZXNlbnRhdGlvbi5cbi8vIEtlZXAgc3RhbmRhbG9uZSBhbmQgbmVzdGVkIHNwYW5zLCB0aHJvdyBhd2F5IHBhcnRpYWxseSBvdmVybGFwcGluZyBzcGFucy5cbmZ1bmN0aW9uIHRvU3BhblRyZWUoc3BhbnMpIHtcbiAgaWYgKHNwYW5zLmxlbmd0aCA9PSAwKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgY29uc3QgdHJlZSA9IFtzcGFuc1swXV07XG4gIGxldCBsYXN0ID0gc3BhbnNbMF07XG4gIGZvciAobGV0IGkgPSAxOyBpIDwgc3BhbnMubGVuZ3RoOyBpKyspIHtcbiAgICAvLyBLZWVwIHNwYW5zIHdoaWNoIHN0YXJ0IGFmdGVyIHRoZSBlbmQgb2YgdGhlIHByZXZpb3VzIHNwYW4gb3IgdGhvc2Ugd2hpY2hcbiAgICAvLyBhcmUgY29tcGxldGUgd2l0aGluIHRoZSBwcmV2aW91cyBzcGFuLlxuICAgIGlmIChzcGFuc1tpXS5hdCA+IGxhc3QuZW5kKSB7XG4gICAgICAvLyBTcGFuIGlzIGNvbXBsZXRlbHkgb3V0c2lkZSBvZiB0aGUgcHJldmlvdXMgc3Bhbi5cbiAgICAgIHRyZWUucHVzaChzcGFuc1tpXSk7XG4gICAgICBsYXN0ID0gc3BhbnNbaV07XG4gICAgfSBlbHNlIGlmIChzcGFuc1tpXS5lbmQgPD0gbGFzdC5lbmQpIHtcbiAgICAgIC8vIFNwYW4gaXMgZnVsbHkgaW5zaWRlIG9mIHRoZSBwcmV2aW91cyBzcGFuLiBQdXNoIHRvIHN1Ym5vZGUuXG4gICAgICBsYXN0LmNoaWxkcmVuLnB1c2goc3BhbnNbaV0pO1xuICAgIH1cbiAgICAvLyBTcGFuIGNvdWxkIHBhcnRpYWxseSBvdmVybGFwLCBpZ25vcmluZyBpdCBhcyBpbnZhbGlkLlxuICB9XG5cbiAgLy8gUmVjdXJzaXZlbHkgcmVhcnJhbmdlIHRoZSBzdWJub2Rlcy5cbiAgZm9yIChsZXQgaSBpbiB0cmVlKSB7XG4gICAgdHJlZVtpXS5jaGlsZHJlbiA9IHRvU3BhblRyZWUodHJlZVtpXS5jaGlsZHJlbik7XG4gIH1cblxuICByZXR1cm4gdHJlZTtcbn1cblxuLy8gQ29udmVydCBkcmFmdHkgZG9jdW1lbnQgdG8gYSB0cmVlLlxuZnVuY3Rpb24gZHJhZnR5VG9UcmVlKGRvYykge1xuICBpZiAoIWRvYykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZG9jID0gKHR5cGVvZiBkb2MgPT0gJ3N0cmluZycpID8ge1xuICAgIHR4dDogZG9jXG4gIH0gOiBkb2M7XG4gIGxldCB7XG4gICAgdHh0LFxuICAgIGZtdCxcbiAgICBlbnRcbiAgfSA9IGRvYztcblxuICB0eHQgPSB0eHQgfHwgJyc7XG4gIGlmICghQXJyYXkuaXNBcnJheShlbnQpKSB7XG4gICAgZW50ID0gW107XG4gIH1cblxuICBpZiAoIUFycmF5LmlzQXJyYXkoZm10KSB8fCBmbXQubGVuZ3RoID09IDApIHtcbiAgICBpZiAoZW50Lmxlbmd0aCA9PSAwKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0ZXh0OiB0eHRcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIHNwZWNpYWwgY2FzZSB3aGVuIGFsbCB2YWx1ZXMgaW4gZm10IGFyZSAwIGFuZCBmbXQgdGhlcmVmb3JlIGlzIHNraXBwZWQuXG4gICAgZm10ID0gW3tcbiAgICAgIGF0OiAwLFxuICAgICAgbGVuOiAwLFxuICAgICAga2V5OiAwXG4gICAgfV07XG4gIH1cblxuICAvLyBTYW5pdGl6ZSBzcGFucy5cbiAgY29uc3Qgc3BhbnMgPSBbXTtcbiAgY29uc3QgYXR0YWNobWVudHMgPSBbXTtcbiAgZm10LmZvckVhY2goKHNwYW4pID0+IHtcbiAgICBpZiAoIXNwYW4gfHwgdHlwZW9mIHNwYW4gIT0gJ29iamVjdCcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIVsndW5kZWZpbmVkJywgJ251bWJlciddLmluY2x1ZGVzKHR5cGVvZiBzcGFuLmF0KSkge1xuICAgICAgLy8gUHJlc2VudCwgYnV0IG5vbi1udW1lcmljICdhdCcuXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghWyd1bmRlZmluZWQnLCAnbnVtYmVyJ10uaW5jbHVkZXModHlwZW9mIHNwYW4ubGVuKSkge1xuICAgICAgLy8gUHJlc2VudCwgYnV0IG5vbi1udW1lcmljICdsZW4nLlxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsZXQgYXQgPSBzcGFuLmF0IHwgMDtcbiAgICBsZXQgbGVuID0gc3Bhbi5sZW4gfCAwO1xuICAgIGlmIChsZW4gPCAwKSB7XG4gICAgICAvLyBJbnZhbGlkIHNwYW4gbGVuZ3RoLlxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBrZXkgPSBzcGFuLmtleSB8fCAwO1xuICAgIGlmIChlbnQubGVuZ3RoID4gMCAmJiAodHlwZW9mIGtleSAhPSAnbnVtYmVyJyB8fCBrZXkgPCAwIHx8IGtleSA+PSBlbnQubGVuZ3RoKSkge1xuICAgICAgLy8gSW52YWxpZCBrZXkgdmFsdWUuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGF0IDw9IC0xKSB7XG4gICAgICAvLyBBdHRhY2htZW50LiBTdG9yZSBhdHRhY2htZW50cyBzZXBhcmF0ZWx5LlxuICAgICAgYXR0YWNobWVudHMucHVzaCh7XG4gICAgICAgIHN0YXJ0OiAtMSxcbiAgICAgICAgZW5kOiAwLFxuICAgICAgICBrZXk6IGtleVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIGlmIChhdCArIGxlbiA+IHR4dC5sZW5ndGgpIHtcbiAgICAgIC8vIFNwYW4gaXMgb3V0IG9mIGJvdW5kcy5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXNwYW4udHApIHtcbiAgICAgIGlmIChlbnQubGVuZ3RoID4gMCAmJiAodHlwZW9mIGVudFtrZXldID09ICdvYmplY3QnKSkge1xuICAgICAgICBzcGFucy5wdXNoKHtcbiAgICAgICAgICBzdGFydDogYXQsXG4gICAgICAgICAgZW5kOiBhdCArIGxlbixcbiAgICAgICAgICBrZXk6IGtleVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3BhbnMucHVzaCh7XG4gICAgICAgIHR5cGU6IHNwYW4udHAsXG4gICAgICAgIHN0YXJ0OiBhdCxcbiAgICAgICAgZW5kOiBhdCArIGxlblxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcblxuICAvLyBTb3J0IHNwYW5zIGZpcnN0IGJ5IHN0YXJ0IGluZGV4IChhc2MpIHRoZW4gYnkgbGVuZ3RoIChkZXNjKSwgdGhlbiBieSB3ZWlnaHQuXG4gIHNwYW5zLnNvcnQoKGEsIGIpID0+IHtcbiAgICBsZXQgZGlmZiA9IGEuc3RhcnQgLSBiLnN0YXJ0O1xuICAgIGlmIChkaWZmICE9IDApIHtcbiAgICAgIHJldHVybiBkaWZmO1xuICAgIH1cbiAgICBkaWZmID0gYi5lbmQgLSBhLmVuZDtcbiAgICBpZiAoZGlmZiAhPSAwKSB7XG4gICAgICByZXR1cm4gZGlmZjtcbiAgICB9XG4gICAgcmV0dXJuIEZNVF9XRUlHSFQuaW5kZXhPZihiLnR5cGUpIC0gRk1UX1dFSUdIVC5pbmRleE9mKGEudHlwZSk7XG4gIH0pO1xuXG4gIC8vIE1vdmUgYXR0YWNobWVudHMgdG8gdGhlIGVuZCBvZiB0aGUgbGlzdC5cbiAgaWYgKGF0dGFjaG1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICBzcGFucy5wdXNoKC4uLmF0dGFjaG1lbnRzKTtcbiAgfVxuXG4gIHNwYW5zLmZvckVhY2goKHNwYW4pID0+IHtcbiAgICBpZiAoZW50Lmxlbmd0aCA+IDAgJiYgIXNwYW4udHlwZSAmJiBlbnRbc3Bhbi5rZXldICYmIHR5cGVvZiBlbnRbc3Bhbi5rZXldID09ICdvYmplY3QnKSB7XG4gICAgICBzcGFuLnR5cGUgPSBlbnRbc3Bhbi5rZXldLnRwO1xuICAgICAgc3Bhbi5kYXRhID0gZW50W3NwYW4ua2V5XS5kYXRhO1xuICAgIH1cblxuICAgIC8vIElzIHR5cGUgc3RpbGwgdW5kZWZpbmVkPyBIaWRlIHRoZSBpbnZhbGlkIGVsZW1lbnQhXG4gICAgaWYgKCFzcGFuLnR5cGUpIHtcbiAgICAgIHNwYW4udHlwZSA9ICdIRCc7XG4gICAgfVxuICB9KTtcblxuICBsZXQgdHJlZSA9IHNwYW5zVG9UcmVlKHt9LCB0eHQsIDAsIHR4dC5sZW5ndGgsIHNwYW5zKTtcblxuICAvLyBGbGF0dGVuIHRyZWUgbm9kZXMuXG4gIGNvbnN0IGZsYXR0ZW4gPSBmdW5jdGlvbihub2RlKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkobm9kZS5jaGlsZHJlbikgJiYgbm9kZS5jaGlsZHJlbi5sZW5ndGggPT0gMSkge1xuICAgICAgLy8gVW53cmFwLlxuICAgICAgY29uc3QgY2hpbGQgPSBub2RlLmNoaWxkcmVuWzBdO1xuICAgICAgaWYgKCFub2RlLnR5cGUpIHtcbiAgICAgICAgY29uc3QgcGFyZW50ID0gbm9kZS5wYXJlbnQ7XG4gICAgICAgIG5vZGUgPSBjaGlsZDtcbiAgICAgICAgbm9kZS5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICB9IGVsc2UgaWYgKCFjaGlsZC50eXBlICYmICFjaGlsZC5jaGlsZHJlbikge1xuICAgICAgICBub2RlLnRleHQgPSBjaGlsZC50ZXh0O1xuICAgICAgICBkZWxldGUgbm9kZS5jaGlsZHJlbjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cbiAgdHJlZSA9IHRyZWVUb3BEb3duKHRyZWUsIGZsYXR0ZW4pO1xuXG4gIHJldHVybiB0cmVlO1xufVxuXG4vLyBBZGQgdHJlZSBub2RlIHRvIGEgcGFyZW50IHRyZWUuXG5mdW5jdGlvbiBhZGROb2RlKHBhcmVudCwgbikge1xuICBpZiAoIW4pIHtcbiAgICByZXR1cm4gcGFyZW50O1xuICB9XG5cbiAgaWYgKCFwYXJlbnQuY2hpbGRyZW4pIHtcbiAgICBwYXJlbnQuY2hpbGRyZW4gPSBbXTtcbiAgfVxuXG4gIC8vIElmIHRleHQgaXMgcHJlc2VudCwgbW92ZSBpdCB0byBhIHN1Ym5vZGUuXG4gIGlmIChwYXJlbnQudGV4dCkge1xuICAgIHBhcmVudC5jaGlsZHJlbi5wdXNoKHtcbiAgICAgIHRleHQ6IHBhcmVudC50ZXh0LFxuICAgICAgcGFyZW50OiBwYXJlbnRcbiAgICB9KTtcbiAgICBkZWxldGUgcGFyZW50LnRleHQ7XG4gIH1cblxuICBuLnBhcmVudCA9IHBhcmVudDtcbiAgcGFyZW50LmNoaWxkcmVuLnB1c2gobik7XG5cbiAgcmV0dXJuIHBhcmVudDtcbn1cblxuLy8gUmV0dXJucyBhIHRyZWUgb2Ygbm9kZXMuXG5mdW5jdGlvbiBzcGFuc1RvVHJlZShwYXJlbnQsIHRleHQsIHN0YXJ0LCBlbmQsIHNwYW5zKSB7XG4gIGlmICghc3BhbnMgfHwgc3BhbnMubGVuZ3RoID09IDApIHtcbiAgICBpZiAoc3RhcnQgPCBlbmQpIHtcbiAgICAgIGFkZE5vZGUocGFyZW50LCB7XG4gICAgICAgIHRleHQ6IHRleHQuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHBhcmVudDtcbiAgfVxuXG4gIC8vIFByb2Nlc3Mgc3Vic3BhbnMuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc3BhbnMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBzcGFuID0gc3BhbnNbaV07XG4gICAgaWYgKHNwYW4uc3RhcnQgPCAwICYmIHNwYW4udHlwZSA9PSAnRVgnKSB7XG4gICAgICBhZGROb2RlKHBhcmVudCwge1xuICAgICAgICB0eXBlOiBzcGFuLnR5cGUsXG4gICAgICAgIGRhdGE6IHNwYW4uZGF0YSxcbiAgICAgICAga2V5OiBzcGFuLmtleSxcbiAgICAgICAgYXR0OiB0cnVlXG4gICAgICB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIEFkZCB1bi1zdHlsZWQgcmFuZ2UgYmVmb3JlIHRoZSBzdHlsZWQgc3BhbiBzdGFydHMuXG4gICAgaWYgKHN0YXJ0IDwgc3Bhbi5zdGFydCkge1xuICAgICAgYWRkTm9kZShwYXJlbnQsIHtcbiAgICAgICAgdGV4dDogdGV4dC5zdWJzdHJpbmcoc3RhcnQsIHNwYW4uc3RhcnQpXG4gICAgICB9KTtcbiAgICAgIHN0YXJ0ID0gc3Bhbi5zdGFydDtcbiAgICB9XG5cbiAgICAvLyBHZXQgYWxsIHNwYW5zIHdoaWNoIGFyZSB3aXRoaW4gdGhlIGN1cnJlbnQgc3Bhbi5cbiAgICBjb25zdCBzdWJzcGFucyA9IFtdO1xuICAgIHdoaWxlIChpIDwgc3BhbnMubGVuZ3RoIC0gMSkge1xuICAgICAgY29uc3QgaW5uZXIgPSBzcGFuc1tpICsgMV07XG4gICAgICBpZiAoaW5uZXIuc3RhcnQgPCAwKSB7XG4gICAgICAgIC8vIEF0dGFjaG1lbnRzIGFyZSBpbiB0aGUgZW5kLiBTdG9wLlxuICAgICAgICBicmVhaztcbiAgICAgIH0gZWxzZSBpZiAoaW5uZXIuc3RhcnQgPCBzcGFuLmVuZCkge1xuICAgICAgICBpZiAoaW5uZXIuZW5kIDw9IHNwYW4uZW5kKSB7XG4gICAgICAgICAgY29uc3QgdGFnID0gRk9STUFUX1RBR1NbaW5uZXIudHBdIHx8IHt9O1xuICAgICAgICAgIGlmIChpbm5lci5zdGFydCA8IGlubmVyLmVuZCB8fCB0YWcuaXNWb2lkKSB7XG4gICAgICAgICAgICAvLyBWYWxpZCBzdWJzcGFuOiBjb21wbGV0ZWx5IHdpdGhpbiB0aGUgY3VycmVudCBzcGFuIGFuZFxuICAgICAgICAgICAgLy8gZWl0aGVyIG5vbi16ZXJvIGxlbmd0aCBvciB6ZXJvIGxlbmd0aCBpcyBhY2NlcHRhYmxlLlxuICAgICAgICAgICAgc3Vic3BhbnMucHVzaChpbm5lcik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGkrKztcbiAgICAgICAgLy8gT3ZlcmxhcHBpbmcgc3Vic3BhbnMgYXJlIGlnbm9yZWQuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBQYXN0IHRoZSBlbmQgb2YgdGhlIGN1cnJlbnQgc3Bhbi4gU3RvcC5cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYWRkTm9kZShwYXJlbnQsIHNwYW5zVG9UcmVlKHtcbiAgICAgIHR5cGU6IHNwYW4udHlwZSxcbiAgICAgIGRhdGE6IHNwYW4uZGF0YSxcbiAgICAgIGtleTogc3Bhbi5rZXlcbiAgICB9LCB0ZXh0LCBzdGFydCwgc3Bhbi5lbmQsIHN1YnNwYW5zKSk7XG4gICAgc3RhcnQgPSBzcGFuLmVuZDtcbiAgfVxuXG4gIC8vIEFkZCB0aGUgbGFzdCB1bmZvcm1hdHRlZCByYW5nZS5cbiAgaWYgKHN0YXJ0IDwgZW5kKSB7XG4gICAgYWRkTm9kZShwYXJlbnQsIHtcbiAgICAgIHRleHQ6IHRleHQuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpXG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gcGFyZW50O1xufVxuXG4vLyBBcHBlbmQgYSB0cmVlIHRvIGEgRHJhZnR5IGRvYy5cbmZ1bmN0aW9uIHRyZWVUb0RyYWZ0eShkb2MsIHRyZWUsIGtleW1hcCkge1xuICBpZiAoIXRyZWUpIHtcbiAgICByZXR1cm4gZG9jO1xuICB9XG5cbiAgZG9jLnR4dCA9IGRvYy50eHQgfHwgJyc7XG5cbiAgLy8gQ2hlY2twb2ludCB0byBtZWFzdXJlIGxlbmd0aCBvZiB0aGUgY3VycmVudCB0cmVlIG5vZGUuXG4gIGNvbnN0IHN0YXJ0ID0gZG9jLnR4dC5sZW5ndGg7XG5cbiAgaWYgKHRyZWUudGV4dCkge1xuICAgIGRvYy50eHQgKz0gdHJlZS50ZXh0O1xuICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkodHJlZS5jaGlsZHJlbikpIHtcbiAgICB0cmVlLmNoaWxkcmVuLmZvckVhY2goKGMpID0+IHtcbiAgICAgIHRyZWVUb0RyYWZ0eShkb2MsIGMsIGtleW1hcCk7XG4gICAgfSk7XG4gIH1cblxuICBpZiAodHJlZS50eXBlKSB7XG4gICAgY29uc3QgbGVuID0gZG9jLnR4dC5sZW5ndGggLSBzdGFydDtcbiAgICBkb2MuZm10ID0gZG9jLmZtdCB8fCBbXTtcbiAgICBpZiAoT2JqZWN0LmtleXModHJlZS5kYXRhIHx8IHt9KS5sZW5ndGggPiAwKSB7XG4gICAgICBkb2MuZW50ID0gZG9jLmVudCB8fCBbXTtcbiAgICAgIGNvbnN0IG5ld0tleSA9ICh0eXBlb2Yga2V5bWFwW3RyZWUua2V5XSA9PSAndW5kZWZpbmVkJykgPyBkb2MuZW50Lmxlbmd0aCA6IGtleW1hcFt0cmVlLmtleV07XG4gICAgICBrZXltYXBbdHJlZS5rZXldID0gbmV3S2V5O1xuICAgICAgZG9jLmVudFtuZXdLZXldID0ge1xuICAgICAgICB0cDogdHJlZS50eXBlLFxuICAgICAgICBkYXRhOiB0cmVlLmRhdGFcbiAgICAgIH07XG4gICAgICBpZiAodHJlZS5hdHQpIHtcbiAgICAgICAgLy8gQXR0YWNobWVudC5cbiAgICAgICAgZG9jLmZtdC5wdXNoKHtcbiAgICAgICAgICBhdDogLTEsXG4gICAgICAgICAgbGVuOiAwLFxuICAgICAgICAgIGtleTogbmV3S2V5XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZG9jLmZtdC5wdXNoKHtcbiAgICAgICAgICBhdDogc3RhcnQsXG4gICAgICAgICAgbGVuOiBsZW4sXG4gICAgICAgICAga2V5OiBuZXdLZXlcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvYy5mbXQucHVzaCh7XG4gICAgICAgIHRwOiB0cmVlLnR5cGUsXG4gICAgICAgIGF0OiBzdGFydCxcbiAgICAgICAgbGVuOiBsZW5cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZG9jO1xufVxuXG4vLyBUcmF2ZXJzZSB0aGUgdHJlZSB0b3AgZG93biB0cmFuc2Zvcm1pbmcgdGhlIG5vZGVzOiBhcHBseSB0cmFuc2Zvcm1lciB0byBldmVyeSB0cmVlIG5vZGUuXG5mdW5jdGlvbiB0cmVlVG9wRG93bihzcmMsIHRyYW5zZm9ybWVyLCBjb250ZXh0KSB7XG4gIGlmICghc3JjKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBsZXQgZHN0ID0gdHJhbnNmb3JtZXIuY2FsbChjb250ZXh0LCBzcmMpO1xuICBpZiAoIWRzdCB8fCAhZHN0LmNoaWxkcmVuKSB7XG4gICAgcmV0dXJuIGRzdDtcbiAgfVxuXG4gIGNvbnN0IGNoaWxkcmVuID0gW107XG4gIGZvciAobGV0IGkgaW4gZHN0LmNoaWxkcmVuKSB7XG4gICAgbGV0IG4gPSBkc3QuY2hpbGRyZW5baV07XG4gICAgaWYgKG4pIHtcbiAgICAgIG4gPSB0cmVlVG9wRG93bihuLCB0cmFuc2Zvcm1lciwgY29udGV4dCk7XG4gICAgICBpZiAobikge1xuICAgICAgICBjaGlsZHJlbi5wdXNoKG4pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChjaGlsZHJlbi5sZW5ndGggPT0gMCkge1xuICAgIGRzdC5jaGlsZHJlbiA9IG51bGw7XG4gIH0gZWxzZSB7XG4gICAgZHN0LmNoaWxkcmVuID0gY2hpbGRyZW47XG4gIH1cblxuICByZXR1cm4gZHN0O1xufVxuXG4vLyBUcmF2ZXJzZSB0aGUgdHJlZSBib3R0b20tdXA6IGFwcGx5IGZvcm1hdHRlciB0byBldmVyeSBub2RlLlxuLy8gVGhlIGZvcm1hdHRlciBtdXN0IG1haW50YWluIGl0cyBzdGF0ZSB0aHJvdWdoIGNvbnRleHQuXG5mdW5jdGlvbiB0cmVlQm90dG9tVXAoc3JjLCBmb3JtYXR0ZXIsIGluZGV4LCBzdGFjaywgY29udGV4dCkge1xuICBpZiAoIXNyYykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaWYgKHN0YWNrICYmIHNyYy50eXBlKSB7XG4gICAgc3RhY2sucHVzaChzcmMudHlwZSk7XG4gIH1cblxuICBsZXQgdmFsdWVzID0gW107XG4gIGZvciAobGV0IGkgaW4gc3JjLmNoaWxkcmVuKSB7XG4gICAgY29uc3QgbiA9IHRyZWVCb3R0b21VcChzcmMuY2hpbGRyZW5baV0sIGZvcm1hdHRlciwgaSwgc3RhY2ssIGNvbnRleHQpO1xuICAgIGlmIChuKSB7XG4gICAgICB2YWx1ZXMucHVzaChuKTtcbiAgICB9XG4gIH1cbiAgaWYgKHZhbHVlcy5sZW5ndGggPT0gMCkge1xuICAgIGlmIChzcmMudGV4dCkge1xuICAgICAgdmFsdWVzID0gW3NyYy50ZXh0XTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWVzID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBpZiAoc3RhY2sgJiYgc3JjLnR5cGUpIHtcbiAgICBzdGFjay5wb3AoKTtcbiAgfVxuXG4gIHJldHVybiBmb3JtYXR0ZXIuY2FsbChjb250ZXh0LCBzcmMudHlwZSwgc3JjLmRhdGEsIHZhbHVlcywgaW5kZXgsIHN0YWNrKTtcbn1cblxuLy8gQ2xpcCB0cmVlIHRvIHRoZSBwcm92aWRlZCBsaW1pdC5cbmZ1bmN0aW9uIHNob3J0ZW5UcmVlKHRyZWUsIGxpbWl0LCB0YWlsKSB7XG4gIGlmICghdHJlZSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaWYgKHRhaWwpIHtcbiAgICBsaW1pdCAtPSB0YWlsLmxlbmd0aDtcbiAgfVxuXG4gIGNvbnN0IHNob3J0ZW5lciA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICBpZiAobGltaXQgPD0gLTEpIHtcbiAgICAgIC8vIExpbWl0IC0xIG1lYW5zIHRoZSBkb2Mgd2FzIGFscmVhZHkgY2xpcHBlZC5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGlmIChub2RlLmF0dCkge1xuICAgICAgLy8gQXR0YWNobWVudHMgYXJlIHVuY2hhbmdlZC5cbiAgICAgIHJldHVybiBub2RlO1xuICAgIH1cbiAgICBpZiAobGltaXQgPT0gMCkge1xuICAgICAgbm9kZS50ZXh0ID0gdGFpbDtcbiAgICAgIGxpbWl0ID0gLTE7XG4gICAgfSBlbHNlIGlmIChub2RlLnRleHQpIHtcbiAgICAgIGNvbnN0IGxlbiA9IG5vZGUudGV4dC5sZW5ndGg7XG4gICAgICBpZiAobGVuID4gbGltaXQpIHtcbiAgICAgICAgbm9kZS50ZXh0ID0gbm9kZS50ZXh0LnN1YnN0cmluZygwLCBsaW1pdCkgKyB0YWlsO1xuICAgICAgICBsaW1pdCA9IC0xO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGltaXQgLT0gbGVuO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIHJldHVybiB0cmVlVG9wRG93bih0cmVlLCBzaG9ydGVuZXIpO1xufVxuXG4vLyBTdHJpcCBoZWF2eSBlbnRpdGllcyBmcm9tIGEgdHJlZS5cbmZ1bmN0aW9uIGxpZ2h0RW50aXR5KHRyZWUsIGFsbG93KSB7XG4gIGNvbnN0IGxpZ2h0Q29weSA9IChub2RlKSA9PiB7XG4gICAgY29uc3QgZGF0YSA9IGNvcHlFbnREYXRhKG5vZGUuZGF0YSwgdHJ1ZSwgYWxsb3cgPyBhbGxvdyhub2RlKSA6IG51bGwpO1xuICAgIGlmIChkYXRhKSB7XG4gICAgICBub2RlLmRhdGEgPSBkYXRhO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgbm9kZS5kYXRhO1xuICAgIH1cbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuICByZXR1cm4gdHJlZVRvcERvd24odHJlZSwgbGlnaHRDb3B5KTtcbn1cblxuLy8gUmVtb3ZlIHNwYWNlcyBhbmQgYnJlYWtzIG9uIHRoZSBsZWZ0LlxuZnVuY3Rpb24gbFRyaW0odHJlZSkge1xuICBpZiAodHJlZS50eXBlID09ICdCUicpIHtcbiAgICB0cmVlID0gbnVsbDtcbiAgfSBlbHNlIGlmICh0cmVlLnRleHQpIHtcbiAgICBpZiAoIXRyZWUudHlwZSkge1xuICAgICAgdHJlZS50ZXh0ID0gdHJlZS50ZXh0LnRyaW1TdGFydCgpO1xuICAgICAgaWYgKCF0cmVlLnRleHQpIHtcbiAgICAgICAgdHJlZSA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKCF0cmVlLnR5cGUgJiYgdHJlZS5jaGlsZHJlbiAmJiB0cmVlLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICBjb25zdCBjID0gbFRyaW0odHJlZS5jaGlsZHJlblswXSk7XG4gICAgaWYgKGMpIHtcbiAgICAgIHRyZWUuY2hpbGRyZW5bMF0gPSBjO1xuICAgIH0gZWxzZSB7XG4gICAgICB0cmVlLmNoaWxkcmVuLnNoaWZ0KCk7XG4gICAgICBpZiAoIXRyZWUudHlwZSAmJiB0cmVlLmNoaWxkcmVuLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIHRyZWUgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdHJlZTtcbn1cblxuLy8gTW92ZSBhdHRhY2htZW50cyB0byB0aGUgZW5kLiBBdHRhY2htZW50cyBtdXN0IGJlIGF0IHRoZSB0b3AgbGV2ZWwsIG5vIG5lZWQgdG8gdHJhdmVyc2UgdGhlIHRyZWUuXG5mdW5jdGlvbiBhdHRhY2htZW50c1RvRW5kKHRyZWUsIGxpbWl0KSB7XG4gIGlmICghdHJlZSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaWYgKHRyZWUuYXR0KSB7XG4gICAgdHJlZS50ZXh0ID0gJyAnO1xuICAgIGRlbGV0ZSB0cmVlLmF0dDtcbiAgICBkZWxldGUgdHJlZS5jaGlsZHJlbjtcbiAgfSBlbHNlIGlmICh0cmVlLmNoaWxkcmVuKSB7XG4gICAgY29uc3QgYXR0YWNobWVudHMgPSBbXTtcbiAgICBjb25zdCBjaGlsZHJlbiA9IFtdO1xuICAgIGZvciAobGV0IGkgaW4gdHJlZS5jaGlsZHJlbikge1xuICAgICAgY29uc3QgYyA9IHRyZWUuY2hpbGRyZW5baV07XG4gICAgICBpZiAoYy5hdHQpIHtcbiAgICAgICAgaWYgKGF0dGFjaG1lbnRzLmxlbmd0aCA9PSBsaW1pdCkge1xuICAgICAgICAgIC8vIFRvbyBtYW55IGF0dGFjaG1lbnRzIHRvIHByZXZpZXc7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGMuZGF0YVsnbWltZSddID09IEpTT05fTUlNRV9UWVBFKSB7XG4gICAgICAgICAgLy8gSlNPTiBhdHRhY2htZW50cyBhcmUgbm90IHNob3duIGluIHByZXZpZXcuXG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBkZWxldGUgYy5hdHQ7XG4gICAgICAgIGRlbGV0ZSBjLmNoaWxkcmVuO1xuICAgICAgICBjLnRleHQgPSAnICc7XG4gICAgICAgIGF0dGFjaG1lbnRzLnB1c2goYyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjaGlsZHJlbi5wdXNoKGMpO1xuICAgICAgfVxuICAgIH1cbiAgICB0cmVlLmNoaWxkcmVuID0gY2hpbGRyZW4uY29uY2F0KGF0dGFjaG1lbnRzKTtcbiAgfVxuICByZXR1cm4gdHJlZTtcbn1cblxuLy8gR2V0IGEgbGlzdCBvZiBlbnRpdGllcyBmcm9tIGEgdGV4dC5cbmZ1bmN0aW9uIGV4dHJhY3RFbnRpdGllcyhsaW5lKSB7XG4gIGxldCBtYXRjaDtcbiAgbGV0IGV4dHJhY3RlZCA9IFtdO1xuICBFTlRJVFlfVFlQRVMuZm9yRWFjaCgoZW50aXR5KSA9PiB7XG4gICAgd2hpbGUgKChtYXRjaCA9IGVudGl0eS5yZS5leGVjKGxpbmUpKSAhPT0gbnVsbCkge1xuICAgICAgZXh0cmFjdGVkLnB1c2goe1xuICAgICAgICBvZmZzZXQ6IG1hdGNoWydpbmRleCddLFxuICAgICAgICBsZW46IG1hdGNoWzBdLmxlbmd0aCxcbiAgICAgICAgdW5pcXVlOiBtYXRjaFswXSxcbiAgICAgICAgZGF0YTogZW50aXR5LnBhY2sobWF0Y2hbMF0pLFxuICAgICAgICB0eXBlOiBlbnRpdHkubmFtZVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcblxuICBpZiAoZXh0cmFjdGVkLmxlbmd0aCA9PSAwKSB7XG4gICAgcmV0dXJuIGV4dHJhY3RlZDtcbiAgfVxuXG4gIC8vIFJlbW92ZSBlbnRpdGllcyBkZXRlY3RlZCBpbnNpZGUgb3RoZXIgZW50aXRpZXMsIGxpa2UgI2hhc2h0YWcgaW4gYSBVUkwuXG4gIGV4dHJhY3RlZC5zb3J0KChhLCBiKSA9PiB7XG4gICAgcmV0dXJuIGEub2Zmc2V0IC0gYi5vZmZzZXQ7XG4gIH0pO1xuXG4gIGxldCBpZHggPSAtMTtcbiAgZXh0cmFjdGVkID0gZXh0cmFjdGVkLmZpbHRlcigoZWwpID0+IHtcbiAgICBjb25zdCByZXN1bHQgPSAoZWwub2Zmc2V0ID4gaWR4KTtcbiAgICBpZHggPSBlbC5vZmZzZXQgKyBlbC5sZW47XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSk7XG5cbiAgcmV0dXJuIGV4dHJhY3RlZDtcbn1cblxuLy8gQ29udmVydCB0aGUgY2h1bmtzIGludG8gZm9ybWF0IHN1aXRhYmxlIGZvciBzZXJpYWxpemF0aW9uLlxuZnVuY3Rpb24gZHJhZnRpZnkoY2h1bmtzLCBzdGFydEF0KSB7XG4gIGxldCBwbGFpbiA9ICcnO1xuICBsZXQgcmFuZ2VzID0gW107XG4gIGZvciAobGV0IGkgaW4gY2h1bmtzKSB7XG4gICAgY29uc3QgY2h1bmsgPSBjaHVua3NbaV07XG4gICAgaWYgKCFjaHVuay50eHQpIHtcbiAgICAgIGNvbnN0IGRyYWZ0eSA9IGRyYWZ0aWZ5KGNodW5rLmNoaWxkcmVuLCBwbGFpbi5sZW5ndGggKyBzdGFydEF0KTtcbiAgICAgIGNodW5rLnR4dCA9IGRyYWZ0eS50eHQ7XG4gICAgICByYW5nZXMgPSByYW5nZXMuY29uY2F0KGRyYWZ0eS5mbXQpO1xuICAgIH1cblxuICAgIGlmIChjaHVuay50cCkge1xuICAgICAgcmFuZ2VzLnB1c2goe1xuICAgICAgICBhdDogcGxhaW4ubGVuZ3RoICsgc3RhcnRBdCxcbiAgICAgICAgbGVuOiBjaHVuay50eHQubGVuZ3RoLFxuICAgICAgICB0cDogY2h1bmsudHBcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHBsYWluICs9IGNodW5rLnR4dDtcbiAgfVxuICByZXR1cm4ge1xuICAgIHR4dDogcGxhaW4sXG4gICAgZm10OiByYW5nZXNcbiAgfTtcbn1cblxuLy8gQ3JlYXRlIGEgY29weSBvZiBlbnRpdHkgZGF0YSB3aXRoIChsaWdodD1mYWxzZSkgb3Igd2l0aG91dCAobGlnaHQ9dHJ1ZSkgdGhlIGxhcmdlIHBheWxvYWQuXG4vLyBUaGUgYXJyYXkgJ2FsbG93JyBjb250YWlucyBhIGxpc3Qgb2YgZmllbGRzIGV4ZW1wdCBmcm9tIHN0cmlwcGluZy5cbmZ1bmN0aW9uIGNvcHlFbnREYXRhKGRhdGEsIGxpZ2h0LCBhbGxvdykge1xuICBpZiAoZGF0YSAmJiBPYmplY3QuZW50cmllcyhkYXRhKS5sZW5ndGggPiAwKSB7XG4gICAgYWxsb3cgPSBhbGxvdyB8fCBbXTtcbiAgICBjb25zdCBkYyA9IHt9O1xuICAgIEFMTE9XRURfRU5UX0ZJRUxEUy5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIGlmIChkYXRhW2tleV0pIHtcbiAgICAgICAgaWYgKGxpZ2h0ICYmICFhbGxvdy5pbmNsdWRlcyhrZXkpICYmXG4gICAgICAgICAgKHR5cGVvZiBkYXRhW2tleV0gPT0gJ3N0cmluZycgfHwgQXJyYXkuaXNBcnJheShkYXRhW2tleV0pKSAmJlxuICAgICAgICAgIGRhdGFba2V5XS5sZW5ndGggPiBNQVhfUFJFVklFV19EQVRBX1NJWkUpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBkYXRhW2tleV0gPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZGNba2V5XSA9IGRhdGFba2V5XTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChPYmplY3QuZW50cmllcyhkYykubGVuZ3RoICE9IDApIHtcbiAgICAgIHJldHVybiBkYztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbmlmICh0eXBlb2YgbW9kdWxlICE9ICd1bmRlZmluZWQnKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gRHJhZnR5O1xufVxuIiwiLyoqXG4gKiBAZmlsZSBVdGlsaXRpZXMgZm9yIHVwbG9hZGluZyBhbmQgZG93bmxvYWRpbmcgZmlsZXMuXG4gKlxuICogQGNvcHlyaWdodCAyMDE1LTIwMjIgVGlub2RlIExMQy5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge1xuICBpc1VybFJlbGF0aXZlLFxuICBqc29uUGFyc2VIZWxwZXJcbn0gZnJvbSAnLi91dGlscy5qcyc7XG5cbmxldCBYSFJQcm92aWRlcjtcblxuLyoqXG4gKiBAY2xhc3MgTGFyZ2VGaWxlSGVscGVyIC0gdXRpbGl0aWVzIGZvciB1cGxvYWRpbmcgYW5kIGRvd25sb2FkaW5nIGZpbGVzIG91dCBvZiBiYW5kLlxuICogRG9uJ3QgaW5zdGFudGlhdGUgdGhpcyBjbGFzcyBkaXJlY3RseS4gVXNlIHtUaW5vZGUuZ2V0TGFyZ2VGaWxlSGVscGVyfSBpbnN0ZWFkLlxuICogQG1lbWJlcm9mIFRpbm9kZVxuICpcbiAqIEBwYXJhbSB7VGlub2RlfSB0aW5vZGUgLSB0aGUgbWFpbiBUaW5vZGUgb2JqZWN0LlxuICogQHBhcmFtIHtzdHJpbmd9IHZlcnNpb24gLSBwcm90b2NvbCB2ZXJzaW9uLCBpLmUuICcwJy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGFyZ2VGaWxlSGVscGVyIHtcbiAgY29uc3RydWN0b3IodGlub2RlLCB2ZXJzaW9uKSB7XG4gICAgdGhpcy5fdGlub2RlID0gdGlub2RlO1xuICAgIHRoaXMuX3ZlcnNpb24gPSB2ZXJzaW9uO1xuXG4gICAgdGhpcy5fYXBpS2V5ID0gdGlub2RlLl9hcGlLZXk7XG4gICAgdGhpcy5fYXV0aFRva2VuID0gdGlub2RlLmdldEF1dGhUb2tlbigpO1xuICAgIHRoaXMuX3JlcUlkID0gdGlub2RlLmdldE5leHRVbmlxdWVJZCgpO1xuICAgIHRoaXMueGhyID0gbmV3IFhIUlByb3ZpZGVyKCk7XG5cbiAgICAvLyBQcm9taXNlXG4gICAgdGhpcy50b1Jlc29sdmUgPSBudWxsO1xuICAgIHRoaXMudG9SZWplY3QgPSBudWxsO1xuXG4gICAgLy8gQ2FsbGJhY2tzXG4gICAgdGhpcy5vblByb2dyZXNzID0gbnVsbDtcbiAgICB0aGlzLm9uU3VjY2VzcyA9IG51bGw7XG4gICAgdGhpcy5vbkZhaWx1cmUgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IHVwbG9hZGluZyB0aGUgZmlsZSB0byBhIG5vbi1kZWZhdWx0IGVuZHBvaW50LlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkxhcmdlRmlsZUhlbHBlciNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGJhc2VVcmwgYWx0ZXJuYXRpdmUgYmFzZSBVUkwgb2YgdXBsb2FkIHNlcnZlci5cbiAgICogQHBhcmFtIHtGaWxlfEJsb2J9IGRhdGEgdG8gdXBsb2FkLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gYXZhdGFyRm9yIHRvcGljIG5hbWUgaWYgdGhlIHVwbG9hZCByZXByZXNlbnRzIGFuIGF2YXRhci5cbiAgICogQHBhcmFtIHtDYWxsYmFja30gb25Qcm9ncmVzcyBjYWxsYmFjay4gVGFrZXMgb25lIHtmbG9hdH0gcGFyYW1ldGVyIDAuLjFcbiAgICogQHBhcmFtIHtDYWxsYmFja30gb25TdWNjZXNzIGNhbGxiYWNrLiBDYWxsZWQgd2hlbiB0aGUgZmlsZSBpcyBzdWNjZXNzZnVsbHkgdXBsb2FkZWQuXG4gICAqIEBwYXJhbSB7Q2FsbGJhY2t9IG9uRmFpbHVyZSBjYWxsYmFjay4gQ2FsbGVkIGluIGNhc2Ugb2YgYSBmYWlsdXJlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgdXBsb2FkIGlzIGNvbXBsZXRlZC9mYWlsZWQuXG4gICAqL1xuICB1cGxvYWRXaXRoQmFzZVVybChiYXNlVXJsLCBkYXRhLCBhdmF0YXJGb3IsIG9uUHJvZ3Jlc3MsIG9uU3VjY2Vzcywgb25GYWlsdXJlKSB7XG4gICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzO1xuXG4gICAgbGV0IHVybCA9IGAvdiR7dGhpcy5fdmVyc2lvbn0vZmlsZS91L2A7XG4gICAgaWYgKGJhc2VVcmwpIHtcbiAgICAgIGxldCBiYXNlID0gYmFzZVVybDtcbiAgICAgIGlmIChiYXNlLmVuZHNXaXRoKCcvJykpIHtcbiAgICAgICAgLy8gUmVtb3ZpbmcgdHJhaWxpbmcgc2xhc2guXG4gICAgICAgIGJhc2UgPSBiYXNlLnNsaWNlKDAsIC0xKTtcbiAgICAgIH1cbiAgICAgIGlmIChiYXNlLnN0YXJ0c1dpdGgoJ2h0dHA6Ly8nKSB8fCBiYXNlLnN0YXJ0c1dpdGgoJ2h0dHBzOi8vJykpIHtcbiAgICAgICAgdXJsID0gYmFzZSArIHVybDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBiYXNlIFVSTCAnJHtiYXNlVXJsfSdgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy54aHIub3BlbignUE9TVCcsIHVybCwgdHJ1ZSk7XG4gICAgdGhpcy54aHIuc2V0UmVxdWVzdEhlYWRlcignWC1UaW5vZGUtQVBJS2V5JywgdGhpcy5fYXBpS2V5KTtcbiAgICBpZiAodGhpcy5fYXV0aFRva2VuKSB7XG4gICAgICB0aGlzLnhoci5zZXRSZXF1ZXN0SGVhZGVyKCdYLVRpbm9kZS1BdXRoJywgYFRva2VuICR7dGhpcy5fYXV0aFRva2VuLnRva2VufWApO1xuICAgIH1cbiAgICBjb25zdCByZXN1bHQgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLnRvUmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgICB0aGlzLnRvUmVqZWN0ID0gcmVqZWN0O1xuICAgIH0pO1xuXG4gICAgdGhpcy5vblByb2dyZXNzID0gb25Qcm9ncmVzcztcbiAgICB0aGlzLm9uU3VjY2VzcyA9IG9uU3VjY2VzcztcbiAgICB0aGlzLm9uRmFpbHVyZSA9IG9uRmFpbHVyZTtcblxuICAgIHRoaXMueGhyLnVwbG9hZC5vbnByb2dyZXNzID0gKGUpID0+IHtcbiAgICAgIGlmIChlLmxlbmd0aENvbXB1dGFibGUgJiYgaW5zdGFuY2Uub25Qcm9ncmVzcykge1xuICAgICAgICBpbnN0YW5jZS5vblByb2dyZXNzKGUubG9hZGVkIC8gZS50b3RhbCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMueGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IHBrdDtcbiAgICAgIHRyeSB7XG4gICAgICAgIHBrdCA9IEpTT04ucGFyc2UodGhpcy5yZXNwb25zZSwganNvblBhcnNlSGVscGVyKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBpbnN0YW5jZS5fdGlub2RlLmxvZ2dlcihcIkVSUk9SOiBJbnZhbGlkIHNlcnZlciByZXNwb25zZSBpbiBMYXJnZUZpbGVIZWxwZXJcIiwgdGhpcy5yZXNwb25zZSk7XG4gICAgICAgIHBrdCA9IHtcbiAgICAgICAgICBjdHJsOiB7XG4gICAgICAgICAgICBjb2RlOiB0aGlzLnN0YXR1cyxcbiAgICAgICAgICAgIHRleHQ6IHRoaXMuc3RhdHVzVGV4dFxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuc3RhdHVzID49IDIwMCAmJiB0aGlzLnN0YXR1cyA8IDMwMCkge1xuICAgICAgICBpZiAoaW5zdGFuY2UudG9SZXNvbHZlKSB7XG4gICAgICAgICAgaW5zdGFuY2UudG9SZXNvbHZlKHBrdC5jdHJsLnBhcmFtcy51cmwpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbnN0YW5jZS5vblN1Y2Nlc3MpIHtcbiAgICAgICAgICBpbnN0YW5jZS5vblN1Y2Nlc3MocGt0LmN0cmwpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdHVzID49IDQwMCkge1xuICAgICAgICBpZiAoaW5zdGFuY2UudG9SZWplY3QpIHtcbiAgICAgICAgICBpbnN0YW5jZS50b1JlamVjdChuZXcgRXJyb3IoYCR7cGt0LmN0cmwudGV4dH0gKCR7cGt0LmN0cmwuY29kZX0pYCkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbnN0YW5jZS5vbkZhaWx1cmUpIHtcbiAgICAgICAgICBpbnN0YW5jZS5vbkZhaWx1cmUocGt0LmN0cmwpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnN0YW5jZS5fdGlub2RlLmxvZ2dlcihcIkVSUk9SOiBVbmV4cGVjdGVkIHNlcnZlciByZXNwb25zZSBzdGF0dXNcIiwgdGhpcy5zdGF0dXMsIHRoaXMucmVzcG9uc2UpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLnhoci5vbmVycm9yID0gZnVuY3Rpb24oZSkge1xuICAgICAgaWYgKGluc3RhbmNlLnRvUmVqZWN0KSB7XG4gICAgICAgIGluc3RhbmNlLnRvUmVqZWN0KG5ldyBFcnJvcihcImZhaWxlZFwiKSk7XG4gICAgICB9XG4gICAgICBpZiAoaW5zdGFuY2Uub25GYWlsdXJlKSB7XG4gICAgICAgIGluc3RhbmNlLm9uRmFpbHVyZShudWxsKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy54aHIub25hYm9ydCA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgIGlmIChpbnN0YW5jZS50b1JlamVjdCkge1xuICAgICAgICBpbnN0YW5jZS50b1JlamVjdChuZXcgRXJyb3IoXCJ1cGxvYWQgY2FuY2VsbGVkIGJ5IHVzZXJcIikpO1xuICAgICAgfVxuICAgICAgaWYgKGluc3RhbmNlLm9uRmFpbHVyZSkge1xuICAgICAgICBpbnN0YW5jZS5vbkZhaWx1cmUobnVsbCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCBmb3JtID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgICBmb3JtLmFwcGVuZCgnZmlsZScsIGRhdGEpO1xuICAgICAgZm9ybS5zZXQoJ2lkJywgdGhpcy5fcmVxSWQpO1xuICAgICAgaWYgKGF2YXRhckZvcikge1xuICAgICAgICBmb3JtLnNldCgndG9waWMnLCBhdmF0YXJGb3IpO1xuICAgICAgfVxuICAgICAgdGhpcy54aHIuc2VuZChmb3JtKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGlmICh0aGlzLnRvUmVqZWN0KSB7XG4gICAgICAgIHRoaXMudG9SZWplY3QoZXJyKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm9uRmFpbHVyZSkge1xuICAgICAgICB0aGlzLm9uRmFpbHVyZShudWxsKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIC8qKlxuICAgKiBTdGFydCB1cGxvYWRpbmcgdGhlIGZpbGUgdG8gZGVmYXVsdCBlbmRwb2ludC5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZS5MYXJnZUZpbGVIZWxwZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7RmlsZXxCbG9ifSBkYXRhIHRvIHVwbG9hZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gYXZhdGFyRm9yIHRvcGljIG5hbWUgaWYgdGhlIHVwbG9hZCByZXByZXNlbnRzIGFuIGF2YXRhci5cbiAgICogQHBhcmFtIHtDYWxsYmFja30gb25Qcm9ncmVzcyBjYWxsYmFjay4gVGFrZXMgb25lIHtmbG9hdH0gcGFyYW1ldGVyIDAuLjFcbiAgICogQHBhcmFtIHtDYWxsYmFja30gb25TdWNjZXNzIGNhbGxiYWNrLiBDYWxsZWQgd2hlbiB0aGUgZmlsZSBpcyBzdWNjZXNzZnVsbHkgdXBsb2FkZWQuXG4gICAqIEBwYXJhbSB7Q2FsbGJhY2t9IG9uRmFpbHVyZSBjYWxsYmFjay4gQ2FsbGVkIGluIGNhc2Ugb2YgYSBmYWlsdXJlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgdXBsb2FkIGlzIGNvbXBsZXRlZC9mYWlsZWQuXG4gICAqL1xuICB1cGxvYWQoZGF0YSwgYXZhdGFyRm9yLCBvblByb2dyZXNzLCBvblN1Y2Nlc3MsIG9uRmFpbHVyZSkge1xuICAgIGNvbnN0IGJhc2VVcmwgPSAodGhpcy5fdGlub2RlLl9zZWN1cmUgPyAnaHR0cHM6Ly8nIDogJ2h0dHA6Ly8nKSArIHRoaXMuX3Rpbm9kZS5faG9zdDtcbiAgICByZXR1cm4gdGhpcy51cGxvYWRXaXRoQmFzZVVybChiYXNlVXJsLCBkYXRhLCBhdmF0YXJGb3IsIG9uUHJvZ3Jlc3MsIG9uU3VjY2Vzcywgb25GYWlsdXJlKTtcbiAgfVxuICAvKipcbiAgICogRG93bmxvYWQgdGhlIGZpbGUgZnJvbSBhIGdpdmVuIFVSTCB1c2luZyBHRVQgcmVxdWVzdC4gVGhpcyBtZXRob2Qgd29ya3Mgd2l0aCB0aGUgVGlub2RlIHNlcnZlciBvbmx5LlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkxhcmdlRmlsZUhlbHBlciNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHJlbGF0aXZlVXJsIC0gVVJMIHRvIGRvd25sb2FkIHRoZSBmaWxlIGZyb20uIE11c3QgYmUgcmVsYXRpdmUgdXJsLCBpLmUuIG11c3Qgbm90IGNvbnRhaW4gdGhlIGhvc3QuXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gZmlsZW5hbWUgLSBmaWxlIG5hbWUgdG8gdXNlIGZvciB0aGUgZG93bmxvYWRlZCBmaWxlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgZG93bmxvYWQgaXMgY29tcGxldGVkL2ZhaWxlZC5cbiAgICovXG4gIGRvd25sb2FkKHJlbGF0aXZlVXJsLCBmaWxlbmFtZSwgbWltZXR5cGUsIG9uUHJvZ3Jlc3MsIG9uRXJyb3IpIHtcbiAgICBpZiAoIWlzVXJsUmVsYXRpdmUocmVsYXRpdmVVcmwpKSB7XG4gICAgICAvLyBBcyBhIHNlY3VyaXR5IG1lYXN1cmUgcmVmdXNlIHRvIGRvd25sb2FkIGZyb20gYW4gYWJzb2x1dGUgVVJMLlxuICAgICAgaWYgKG9uRXJyb3IpIHtcbiAgICAgICAgb25FcnJvcihgVGhlIFVSTCAnJHtyZWxhdGl2ZVVybH0nIG11c3QgYmUgcmVsYXRpdmUsIG5vdCBhYnNvbHV0ZWApO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuX2F1dGhUb2tlbikge1xuICAgICAgaWYgKG9uRXJyb3IpIHtcbiAgICAgICAgb25FcnJvcihcIk11c3QgYXV0aGVudGljYXRlIGZpcnN0XCIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXM7XG4gICAgLy8gR2V0IGRhdGEgYXMgYmxvYiAoc3RvcmVkIGJ5IHRoZSBicm93c2VyIGFzIGEgdGVtcG9yYXJ5IGZpbGUpLlxuICAgIHRoaXMueGhyLm9wZW4oJ0dFVCcsIHJlbGF0aXZlVXJsLCB0cnVlKTtcbiAgICB0aGlzLnhoci5zZXRSZXF1ZXN0SGVhZGVyKCdYLVRpbm9kZS1BUElLZXknLCB0aGlzLl9hcGlLZXkpO1xuICAgIHRoaXMueGhyLnNldFJlcXVlc3RIZWFkZXIoJ1gtVGlub2RlLUF1dGgnLCAnVG9rZW4gJyArIHRoaXMuX2F1dGhUb2tlbi50b2tlbik7XG4gICAgdGhpcy54aHIucmVzcG9uc2VUeXBlID0gJ2Jsb2InO1xuXG4gICAgdGhpcy5vblByb2dyZXNzID0gb25Qcm9ncmVzcztcbiAgICB0aGlzLnhoci5vbnByb2dyZXNzID0gZnVuY3Rpb24oZSkge1xuICAgICAgaWYgKGluc3RhbmNlLm9uUHJvZ3Jlc3MpIHtcbiAgICAgICAgLy8gUGFzc2luZyBlLmxvYWRlZCBpbnN0ZWFkIG9mIGUubG9hZGVkL2UudG90YWwgYmVjYXVzZSBlLnRvdGFsXG4gICAgICAgIC8vIGlzIGFsd2F5cyAwIHdpdGggZ3ppcCBjb21wcmVzc2lvbiBlbmFibGVkIGJ5IHRoZSBzZXJ2ZXIuXG4gICAgICAgIGluc3RhbmNlLm9uUHJvZ3Jlc3MoZS5sb2FkZWQpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCByZXN1bHQgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLnRvUmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgICB0aGlzLnRvUmVqZWN0ID0gcmVqZWN0O1xuICAgIH0pO1xuXG4gICAgLy8gVGhlIGJsb2IgbmVlZHMgdG8gYmUgc2F2ZWQgYXMgZmlsZS4gVGhlcmUgaXMgbm8ga25vd24gd2F5IHRvXG4gICAgLy8gc2F2ZSB0aGUgYmxvYiBhcyBmaWxlIG90aGVyIHRoYW4gdG8gZmFrZSBhIGNsaWNrIG9uIGFuIDxhIGhyZWYuLi4gZG93bmxvYWQ9Li4uPi5cbiAgICB0aGlzLnhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLnN0YXR1cyA9PSAyMDApIHtcbiAgICAgICAgY29uc3QgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgICAgLy8gVVJMLmNyZWF0ZU9iamVjdFVSTCBpcyBub3QgYXZhaWxhYmxlIGluIG5vbi1icm93c2VyIGVudmlyb25tZW50LiBUaGlzIGNhbGwgd2lsbCBmYWlsLlxuICAgICAgICBsaW5rLmhyZWYgPSB3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTChuZXcgQmxvYihbdGhpcy5yZXNwb25zZV0sIHtcbiAgICAgICAgICB0eXBlOiBtaW1ldHlwZVxuICAgICAgICB9KSk7XG4gICAgICAgIGxpbmsuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgbGluay5zZXRBdHRyaWJ1dGUoJ2Rvd25sb2FkJywgZmlsZW5hbWUpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpbmspO1xuICAgICAgICBsaW5rLmNsaWNrKCk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQobGluayk7XG4gICAgICAgIHdpbmRvdy5VUkwucmV2b2tlT2JqZWN0VVJMKGxpbmsuaHJlZik7XG4gICAgICAgIGlmIChpbnN0YW5jZS50b1Jlc29sdmUpIHtcbiAgICAgICAgICBpbnN0YW5jZS50b1Jlc29sdmUoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLnN0YXR1cyA+PSA0MDAgJiYgaW5zdGFuY2UudG9SZWplY3QpIHtcbiAgICAgICAgLy8gVGhlIHRoaXMucmVzcG9uc2VUZXh0IGlzIHVuZGVmaW5lZCwgbXVzdCB1c2UgdGhpcy5yZXNwb25zZSB3aGljaCBpcyBhIGJsb2IuXG4gICAgICAgIC8vIE5lZWQgdG8gY29udmVydCB0aGlzLnJlc3BvbnNlIHRvIEpTT04uIFRoZSBibG9iIGNhbiBvbmx5IGJlIGFjY2Vzc2VkIGJ5IHRoZVxuICAgICAgICAvLyBGaWxlUmVhZGVyLlxuICAgICAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHBrdCA9IEpTT04ucGFyc2UodGhpcy5yZXN1bHQsIGpzb25QYXJzZUhlbHBlcik7XG4gICAgICAgICAgICBpbnN0YW5jZS50b1JlamVjdChuZXcgRXJyb3IoYCR7cGt0LmN0cmwudGV4dH0gKCR7cGt0LmN0cmwuY29kZX0pYCkpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgaW5zdGFuY2UuX3Rpbm9kZS5sb2dnZXIoXCJFUlJPUjogSW52YWxpZCBzZXJ2ZXIgcmVzcG9uc2UgaW4gTGFyZ2VGaWxlSGVscGVyXCIsIHRoaXMucmVzdWx0KTtcbiAgICAgICAgICAgIGluc3RhbmNlLnRvUmVqZWN0KGVycik7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZWFkZXIucmVhZEFzVGV4dCh0aGlzLnJlc3BvbnNlKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy54aHIub25lcnJvciA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgIGlmIChpbnN0YW5jZS50b1JlamVjdCkge1xuICAgICAgICBpbnN0YW5jZS50b1JlamVjdChuZXcgRXJyb3IoXCJmYWlsZWRcIikpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLnhoci5vbmFib3J0ID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoaW5zdGFuY2UudG9SZWplY3QpIHtcbiAgICAgICAgaW5zdGFuY2UudG9SZWplY3QobnVsbCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRyeSB7XG4gICAgICB0aGlzLnhoci5zZW5kKCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBpZiAodGhpcy50b1JlamVjdCkge1xuICAgICAgICB0aGlzLnRvUmVqZWN0KGVycik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICAvKipcbiAgICogVHJ5IHRvIGNhbmNlbCBhbiBvbmdvaW5nIHVwbG9hZCBvciBkb3dubG9hZC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5MYXJnZUZpbGVIZWxwZXIjXG4gICAqL1xuICBjYW5jZWwoKSB7XG4gICAgaWYgKHRoaXMueGhyICYmIHRoaXMueGhyLnJlYWR5U3RhdGUgPCA0KSB7XG4gICAgICB0aGlzLnhoci5hYm9ydCgpO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICogR2V0IHVuaXF1ZSBpZCBvZiB0aGlzIHJlcXVlc3QuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTGFyZ2VGaWxlSGVscGVyI1xuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSB1bmlxdWUgaWRcbiAgICovXG4gIGdldElkKCkge1xuICAgIHJldHVybiB0aGlzLl9yZXFJZDtcbiAgfVxuICAvKipcbiAgICogVG8gdXNlIExhcmdlRmlsZUhlbHBlciBpbiBhIG5vbiBicm93c2VyIGNvbnRleHQsIHN1cHBseSBYTUxIdHRwUmVxdWVzdCBwcm92aWRlci5cbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyb2YgTGFyZ2VGaWxlSGVscGVyXG4gICAqIEBwYXJhbSB4aHJQcm92aWRlciBYTUxIdHRwUmVxdWVzdCBwcm92aWRlciwgZS5nLiBmb3Igbm9kZSA8Y29kZT5yZXF1aXJlKCd4aHInKTwvY29kZT4uXG4gICAqL1xuICBzdGF0aWMgc2V0TmV0d29ya1Byb3ZpZGVyKHhoclByb3ZpZGVyKSB7XG4gICAgWEhSUHJvdmlkZXIgPSB4aHJQcm92aWRlcjtcbiAgfVxufVxuIiwiLyoqXG4gKiBAZmlsZSBIZWxwZXIgY2xhc3MgZm9yIGNvbnN0cnVjdGluZyB7QGxpbmsgVGlub2RlLkdldFF1ZXJ5fS5cbiAqXG4gKiBAY29weXJpZ2h0IDIwMTUtMjAyMiBUaW5vZGUgTExDLlxuICovXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogSGVscGVyIGNsYXNzIGZvciBjb25zdHJ1Y3Rpbmcge0BsaW5rIFRpbm9kZS5HZXRRdWVyeX0uXG4gKlxuICogQGNsYXNzIE1ldGFHZXRCdWlsZGVyXG4gKiBAbWVtYmVyb2YgVGlub2RlXG4gKlxuICogQHBhcmFtIHtUaW5vZGUuVG9waWN9IHBhcmVudCB0b3BpYyB3aGljaCBpbnN0YW50aWF0ZWQgdGhpcyBidWlsZGVyLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNZXRhR2V0QnVpbGRlciB7XG4gIGNvbnN0cnVjdG9yKHBhcmVudCkge1xuICAgIHRoaXMudG9waWMgPSBwYXJlbnQ7XG4gICAgdGhpcy53aGF0ID0ge307XG4gIH1cblxuICAvLyBHZXQgdGltZXN0YW1wIG9mIHRoZSBtb3N0IHJlY2VudCBkZXNjIHVwZGF0ZS5cbiAgI2dldF9kZXNjX2ltcygpIHtcbiAgICByZXR1cm4gdGhpcy50b3BpYy51cGRhdGVkO1xuICB9XG5cbiAgLy8gR2V0IHRpbWVzdGFtcCBvZiB0aGUgbW9zdCByZWNlbnQgc3VicyB1cGRhdGUuXG4gICNnZXRfc3Vic19pbXMoKSB7XG4gICAgaWYgKHRoaXMudG9waWMuaXNQMlBUeXBlKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLiNnZXRfZGVzY19pbXMoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudG9waWMuX2xhc3RTdWJzVXBkYXRlO1xuICB9XG4gIC8qKlxuICAgKiBBZGQgcXVlcnkgcGFyYW1ldGVycyB0byBmZXRjaCBtZXNzYWdlcyB3aXRoaW4gZXhwbGljaXQgbGltaXRzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcj19IHNpbmNlIC0gbWVzc2FnZXMgbmV3ZXIgdGhhbiB0aGlzIChpbmNsdXNpdmUpO1xuICAgKiBAcGFyYW0ge251bWJlcj19IGJlZm9yZSAtIG9sZGVyIHRoYW4gdGhpcyAoZXhjbHVzaXZlKVxuICAgKiBAcGFyYW0ge251bWJlcj19IGxpbWl0IC0gbnVtYmVyIG9mIG1lc3NhZ2VzIHRvIGZldGNoXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IDxjb2RlPnRoaXM8L2NvZGU+IG9iamVjdC5cbiAgICovXG4gIHdpdGhEYXRhKHNpbmNlLCBiZWZvcmUsIGxpbWl0KSB7XG4gICAgdGhpcy53aGF0WydkYXRhJ10gPSB7XG4gICAgICBzaW5jZTogc2luY2UsXG4gICAgICBiZWZvcmU6IGJlZm9yZSxcbiAgICAgIGxpbWl0OiBsaW1pdFxuICAgIH07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIG1lc3NhZ2VzIG5ld2VyIHRoYW4gdGhlIGxhdGVzdCBzYXZlZCBtZXNzYWdlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcj19IGxpbWl0IC0gbnVtYmVyIG9mIG1lc3NhZ2VzIHRvIGZldGNoXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IDxjb2RlPnRoaXM8L2NvZGU+IG9iamVjdC5cbiAgICovXG4gIHdpdGhMYXRlckRhdGEobGltaXQpIHtcbiAgICByZXR1cm4gdGhpcy53aXRoRGF0YSh0aGlzLnRvcGljLl9tYXhTZXEgPiAwID8gdGhpcy50b3BpYy5fbWF4U2VxICsgMSA6IHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBsaW1pdCk7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIG1lc3NhZ2VzIG9sZGVyIHRoYW4gdGhlIGVhcmxpZXN0IHNhdmVkIG1lc3NhZ2UuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gbGltaXQgLSBtYXhpbXVtIG51bWJlciBvZiBtZXNzYWdlcyB0byBmZXRjaC5cbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aEVhcmxpZXJEYXRhKGxpbWl0KSB7XG4gICAgcmV0dXJuIHRoaXMud2l0aERhdGEodW5kZWZpbmVkLCB0aGlzLnRvcGljLl9taW5TZXEgPiAwID8gdGhpcy50b3BpYy5fbWluU2VxIDogdW5kZWZpbmVkLCBsaW1pdCk7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIHRvcGljIGRlc2NyaXB0aW9uIGlmIGl0J3MgbmV3ZXIgdGhhbiB0aGUgZ2l2ZW4gdGltZXN0YW1wLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge0RhdGU9fSBpbXMgLSBmZXRjaCBtZXNzYWdlcyBuZXdlciB0aGFuIHRoaXMgdGltZXN0YW1wLlxuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSA8Y29kZT50aGlzPC9jb2RlPiBvYmplY3QuXG4gICAqL1xuICB3aXRoRGVzYyhpbXMpIHtcbiAgICB0aGlzLndoYXRbJ2Rlc2MnXSA9IHtcbiAgICAgIGltczogaW1zXG4gICAgfTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggdG9waWMgZGVzY3JpcHRpb24gaWYgaXQncyBuZXdlciB0aGFuIHRoZSBsYXN0IHVwZGF0ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aExhdGVyRGVzYygpIHtcbiAgICByZXR1cm4gdGhpcy53aXRoRGVzYyh0aGlzLiNnZXRfZGVzY19pbXMoKSk7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIHN1YnNjcmlwdGlvbnMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7RGF0ZT19IGltcyAtIGZldGNoIHN1YnNjcmlwdGlvbnMgbW9kaWZpZWQgbW9yZSByZWNlbnRseSB0aGFuIHRoaXMgdGltZXN0YW1wXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gbGltaXQgLSBtYXhpbXVtIG51bWJlciBvZiBzdWJzY3JpcHRpb25zIHRvIGZldGNoLlxuICAgKiBAcGFyYW0ge3N0cmluZz19IHVzZXJPclRvcGljIC0gdXNlciBJRCBvciB0b3BpYyBuYW1lIHRvIGZldGNoIGZvciBmZXRjaGluZyBvbmUgc3Vic2NyaXB0aW9uLlxuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSA8Y29kZT50aGlzPC9jb2RlPiBvYmplY3QuXG4gICAqL1xuICB3aXRoU3ViKGltcywgbGltaXQsIHVzZXJPclRvcGljKSB7XG4gICAgY29uc3Qgb3B0cyA9IHtcbiAgICAgIGltczogaW1zLFxuICAgICAgbGltaXQ6IGxpbWl0XG4gICAgfTtcbiAgICBpZiAodGhpcy50b3BpYy5nZXRUeXBlKCkgPT0gJ21lJykge1xuICAgICAgb3B0cy50b3BpYyA9IHVzZXJPclRvcGljO1xuICAgIH0gZWxzZSB7XG4gICAgICBvcHRzLnVzZXIgPSB1c2VyT3JUb3BpYztcbiAgICB9XG4gICAgdGhpcy53aGF0WydzdWInXSA9IG9wdHM7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIGEgc2luZ2xlIHN1YnNjcmlwdGlvbi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICpcbiAgICogQHBhcmFtIHtEYXRlPX0gaW1zIC0gZmV0Y2ggc3Vic2NyaXB0aW9ucyBtb2RpZmllZCBtb3JlIHJlY2VudGx5IHRoYW4gdGhpcyB0aW1lc3RhbXBcbiAgICogQHBhcmFtIHtzdHJpbmc9fSB1c2VyT3JUb3BpYyAtIHVzZXIgSUQgb3IgdG9waWMgbmFtZSB0byBmZXRjaCBmb3IgZmV0Y2hpbmcgb25lIHN1YnNjcmlwdGlvbi5cbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aE9uZVN1YihpbXMsIHVzZXJPclRvcGljKSB7XG4gICAgcmV0dXJuIHRoaXMud2l0aFN1YihpbXMsIHVuZGVmaW5lZCwgdXNlck9yVG9waWMpO1xuICB9XG4gIC8qKlxuICAgKiBBZGQgcXVlcnkgcGFyYW1ldGVycyB0byBmZXRjaCBhIHNpbmdsZSBzdWJzY3JpcHRpb24gaWYgaXQncyBiZWVuIHVwZGF0ZWQgc2luY2UgdGhlIGxhc3QgdXBkYXRlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZz19IHVzZXJPclRvcGljIC0gdXNlciBJRCBvciB0b3BpYyBuYW1lIHRvIGZldGNoIGZvciBmZXRjaGluZyBvbmUgc3Vic2NyaXB0aW9uLlxuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSA8Y29kZT50aGlzPC9jb2RlPiBvYmplY3QuXG4gICAqL1xuICB3aXRoTGF0ZXJPbmVTdWIodXNlck9yVG9waWMpIHtcbiAgICByZXR1cm4gdGhpcy53aXRoT25lU3ViKHRoaXMudG9waWMuX2xhc3RTdWJzVXBkYXRlLCB1c2VyT3JUb3BpYyk7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIHN1YnNjcmlwdGlvbnMgdXBkYXRlZCBzaW5jZSB0aGUgbGFzdCB1cGRhdGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gbGltaXQgLSBtYXhpbXVtIG51bWJlciBvZiBzdWJzY3JpcHRpb25zIHRvIGZldGNoLlxuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSA8Y29kZT50aGlzPC9jb2RlPiBvYmplY3QuXG4gICAqL1xuICB3aXRoTGF0ZXJTdWIobGltaXQpIHtcbiAgICByZXR1cm4gdGhpcy53aXRoU3ViKHRoaXMuI2dldF9zdWJzX2ltcygpLCBsaW1pdCk7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIHRvcGljIHRhZ3MuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IDxjb2RlPnRoaXM8L2NvZGU+IG9iamVjdC5cbiAgICovXG4gIHdpdGhUYWdzKCkge1xuICAgIHRoaXMud2hhdFsndGFncyddID0gdHJ1ZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggdXNlcidzIGNyZWRlbnRpYWxzLiA8Y29kZT4nbWUnPC9jb2RlPiB0b3BpYyBvbmx5LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSA8Y29kZT50aGlzPC9jb2RlPiBvYmplY3QuXG4gICAqL1xuICB3aXRoQ3JlZCgpIHtcbiAgICBpZiAodGhpcy50b3BpYy5nZXRUeXBlKCkgPT0gJ21lJykge1xuICAgICAgdGhpcy53aGF0WydjcmVkJ10gPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnRvcGljLl90aW5vZGUubG9nZ2VyKFwiRVJST1I6IEludmFsaWQgdG9waWMgdHlwZSBmb3IgTWV0YUdldEJ1aWxkZXI6d2l0aENyZWRzXCIsIHRoaXMudG9waWMuZ2V0VHlwZSgpKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIGRlbGV0ZWQgbWVzc2FnZXMgd2l0aGluIGV4cGxpY2l0IGxpbWl0cy4gQW55L2FsbCBwYXJhbWV0ZXJzIGNhbiBiZSBudWxsLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcj19IHNpbmNlIC0gaWRzIG9mIG1lc3NhZ2VzIGRlbGV0ZWQgc2luY2UgdGhpcyAnZGVsJyBpZCAoaW5jbHVzaXZlKVxuICAgKiBAcGFyYW0ge251bWJlcj19IGxpbWl0IC0gbnVtYmVyIG9mIGRlbGV0ZWQgbWVzc2FnZSBpZHMgdG8gZmV0Y2hcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aERlbChzaW5jZSwgbGltaXQpIHtcbiAgICBpZiAoc2luY2UgfHwgbGltaXQpIHtcbiAgICAgIHRoaXMud2hhdFsnZGVsJ10gPSB7XG4gICAgICAgIHNpbmNlOiBzaW5jZSxcbiAgICAgICAgbGltaXQ6IGxpbWl0XG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggbWVzc2FnZXMgZGVsZXRlZCBhZnRlciB0aGUgc2F2ZWQgPGNvZGU+J2RlbCc8L2NvZGU+IGlkLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcj19IGxpbWl0IC0gbnVtYmVyIG9mIGRlbGV0ZWQgbWVzc2FnZSBpZHMgdG8gZmV0Y2hcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aExhdGVyRGVsKGxpbWl0KSB7XG4gICAgLy8gU3BlY2lmeSAnc2luY2UnIG9ubHkgaWYgd2UgaGF2ZSBhbHJlYWR5IHJlY2VpdmVkIHNvbWUgbWVzc2FnZXMuIElmXG4gICAgLy8gd2UgaGF2ZSBubyBsb2NhbGx5IGNhY2hlZCBtZXNzYWdlcyB0aGVuIHdlIGRvbid0IGNhcmUgaWYgYW55IG1lc3NhZ2VzIHdlcmUgZGVsZXRlZC5cbiAgICByZXR1cm4gdGhpcy53aXRoRGVsKHRoaXMudG9waWMuX21heFNlcSA+IDAgPyB0aGlzLnRvcGljLl9tYXhEZWwgKyAxIDogdW5kZWZpbmVkLCBsaW1pdCk7XG4gIH1cblxuICAvKipcbiAgICogRXh0cmFjdCBzdWJxdWVyeTogZ2V0IGFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIHNwZWNpZmllZCBzdWJxdWVyeS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICogQHBhcmFtIHtzdHJpbmd9IHdoYXQgLSBzdWJxdWVyeSB0byByZXR1cm46IG9uZSBvZiAnZGF0YScsICdzdWInLCAnZGVzYycsICd0YWdzJywgJ2NyZWQnLCAnZGVsJy5cbiAgICogQHJldHVybnMge09iamVjdH0gcmVxdWVzdGVkIHN1YnF1ZXJ5IG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4uXG4gICAqL1xuICBleHRyYWN0KHdoYXQpIHtcbiAgICByZXR1cm4gdGhpcy53aGF0W3doYXRdO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdCBwYXJhbWV0ZXJzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLkdldFF1ZXJ5fSBHZXQgcXVlcnlcbiAgICovXG4gIGJ1aWxkKCkge1xuICAgIGNvbnN0IHdoYXQgPSBbXTtcbiAgICBsZXQgcGFyYW1zID0ge307XG4gICAgWydkYXRhJywgJ3N1YicsICdkZXNjJywgJ3RhZ3MnLCAnY3JlZCcsICdkZWwnXS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIGlmICh0aGlzLndoYXQuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICB3aGF0LnB1c2goa2V5KTtcbiAgICAgICAgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRoaXMud2hhdFtrZXldKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgcGFyYW1zW2tleV0gPSB0aGlzLndoYXRba2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICh3aGF0Lmxlbmd0aCA+IDApIHtcbiAgICAgIHBhcmFtcy53aGF0ID0gd2hhdC5qb2luKCcgJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcmFtcyA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIHBhcmFtcztcbiAgfVxufVxuIiwiLyoqXG4gKiBAbW9kdWxlIHRpbm9kZS1zZGtcbiAqXG4gKiBAY29weXJpZ2h0IDIwMTUtMjAyMiBUaW5vZGUgTExDLlxuICogQHN1bW1hcnkgSmF2YXNjcmlwdCBiaW5kaW5ncyBmb3IgVGlub2RlLlxuICogQGxpY2Vuc2UgQXBhY2hlIDIuMFxuICogQHZlcnNpb24gMC4yMFxuICpcbiAqIFNlZSA8YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL3Rpbm9kZS93ZWJhcHBcIj5odHRwczovL2dpdGh1Yi5jb20vdGlub2RlL3dlYmFwcDwvYT4gZm9yIHJlYWwtbGlmZSB1c2FnZS5cbiAqXG4gKiBAZXhhbXBsZVxuICogPGhlYWQ+XG4gKiA8c2NyaXB0IHNyYz1cIi4uLi90aW5vZGUuanNcIj48L3NjcmlwdD5cbiAqIDwvaGVhZD5cbiAqXG4gKiA8Ym9keT5cbiAqICAuLi5cbiAqIDxzY3JpcHQ+XG4gKiAgLy8gSW5zdGFudGlhdGUgdGlub2RlLlxuICogIGNvbnN0IHRpbm9kZSA9IG5ldyBUaW5vZGUoY29uZmlnLCAoKSA9PiB7XG4gKiAgICAvLyBDYWxsZWQgb24gaW5pdCBjb21wbGV0aW9uLlxuICogIH0pO1xuICogIHRpbm9kZS5lbmFibGVMb2dnaW5nKHRydWUpO1xuICogIHRpbm9kZS5vbkRpc2Nvbm5lY3QgPSAoZXJyKSA9PiB7XG4gKiAgICAvLyBIYW5kbGUgZGlzY29ubmVjdC5cbiAqICB9O1xuICogIC8vIENvbm5lY3QgdG8gdGhlIHNlcnZlci5cbiAqICB0aW5vZGUuY29ubmVjdCgnaHR0cHM6Ly9leGFtcGxlLmNvbS8nKS50aGVuKCgpID0+IHtcbiAqICAgIC8vIENvbm5lY3RlZC4gTG9naW4gbm93LlxuICogICAgcmV0dXJuIHRpbm9kZS5sb2dpbkJhc2ljKGxvZ2luLCBwYXNzd29yZCk7XG4gKiAgfSkudGhlbigoY3RybCkgPT4ge1xuICogICAgLy8gTG9nZ2VkIGluIGZpbmUsIGF0dGFjaCBjYWxsYmFja3MsIHN1YnNjcmliZSB0byAnbWUnLlxuICogICAgY29uc3QgbWUgPSB0aW5vZGUuZ2V0TWVUb3BpYygpO1xuICogICAgbWUub25NZXRhRGVzYyA9IGZ1bmN0aW9uKG1ldGEpIHsgLi4uIH07XG4gKiAgICAvLyBTdWJzY3JpYmUsIGZldGNoIHRvcGljIGRlc2NyaXB0aW9uIGFuZCB0aGUgbGlzdCBvZiBjb250YWN0cy5cbiAqICAgIG1lLnN1YnNjcmliZSh7Z2V0OiB7ZGVzYzoge30sIHN1Yjoge319fSk7XG4gKiAgfSkuY2F0Y2goKGVycikgPT4ge1xuICogICAgLy8gTG9naW4gb3Igc3Vic2NyaXB0aW9uIGZhaWxlZCwgZG8gc29tZXRoaW5nLlxuICogICAgLi4uXG4gKiAgfSk7XG4gKiAgLi4uXG4gKiA8L3NjcmlwdD5cbiAqIDwvYm9keT5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG4vLyBOT1RFIFRPIERFVkVMT1BFUlM6XG4vLyBMb2NhbGl6YWJsZSBzdHJpbmdzIHNob3VsZCBiZSBkb3VibGUgcXVvdGVkIFwi0YHRgtGA0L7QutCwINC90LAg0LTRgNGD0LPQvtC8INGP0LfRi9C60LVcIixcbi8vIG5vbi1sb2NhbGl6YWJsZSBzdHJpbmdzIHNob3VsZCBiZSBzaW5nbGUgcXVvdGVkICdub24tbG9jYWxpemVkJy5cblxuaW1wb3J0IEFjY2Vzc01vZGUgZnJvbSAnLi9hY2Nlc3MtbW9kZS5qcyc7XG5pbXBvcnQgKiBhcyBDb25zdCBmcm9tICcuL2NvbmZpZy5qcyc7XG5pbXBvcnQgQ29ubmVjdGlvbiBmcm9tICcuL2Nvbm5lY3Rpb24uanMnO1xuaW1wb3J0IERCQ2FjaGUgZnJvbSAnLi9kYi5qcyc7XG5pbXBvcnQgRHJhZnR5IGZyb20gJy4vZHJhZnR5LmpzJztcbmltcG9ydCBMYXJnZUZpbGVIZWxwZXIgZnJvbSAnLi9sYXJnZS1maWxlLmpzJztcbmltcG9ydCBNZXRhR2V0QnVpbGRlciBmcm9tICcuL21ldGEtYnVpbGRlci5qcyc7XG5pbXBvcnQge1xuICBUb3BpYyxcbiAgVG9waWNNZSxcbiAgVG9waWNGbmRcbn0gZnJvbSAnLi90b3BpYy5qcyc7XG5cbmltcG9ydCB7XG4gIGlzVXJsUmVsYXRpdmUsXG4gIGpzb25QYXJzZUhlbHBlcixcbiAgbWVyZ2VPYmosXG4gIHJmYzMzMzlEYXRlU3RyaW5nLFxuICBzaW1wbGlmeVxufSBmcm9tICcuL3V0aWxzLmpzJztcblxuLy8gUmUtZXhwb3J0IEFjY2Vzc01vZGVcbmV4cG9ydCB7XG4gIEFjY2Vzc01vZGVcbn07XG5cbmxldCBXZWJTb2NrZXRQcm92aWRlcjtcbmlmICh0eXBlb2YgV2ViU29ja2V0ICE9ICd1bmRlZmluZWQnKSB7XG4gIFdlYlNvY2tldFByb3ZpZGVyID0gV2ViU29ja2V0O1xufVxuXG5sZXQgWEhSUHJvdmlkZXI7XG5pZiAodHlwZW9mIFhNTEh0dHBSZXF1ZXN0ICE9ICd1bmRlZmluZWQnKSB7XG4gIFhIUlByb3ZpZGVyID0gWE1MSHR0cFJlcXVlc3Q7XG59XG5cbmxldCBJbmRleGVkREJQcm92aWRlcjtcbmlmICh0eXBlb2YgaW5kZXhlZERCICE9ICd1bmRlZmluZWQnKSB7XG4gIEluZGV4ZWREQlByb3ZpZGVyID0gaW5kZXhlZERCO1xufVxuXG4vLyBSZS1leHBvcnQgRHJhZnR5LlxuZXhwb3J0IHtcbiAgRHJhZnR5XG59XG5cbmluaXRGb3JOb25Ccm93c2VyQXBwKCk7XG5cbi8vIFV0aWxpdHkgZnVuY3Rpb25zXG5cbi8vIFBvbHlmaWxsIGZvciBub24tYnJvd3NlciBjb250ZXh0LCBlLmcuIE5vZGVKcy5cbmZ1bmN0aW9uIGluaXRGb3JOb25Ccm93c2VyQXBwKCkge1xuICAvLyBUaW5vZGUgcmVxdWlyZW1lbnQgaW4gbmF0aXZlIG1vZGUgYmVjYXVzZSByZWFjdCBuYXRpdmUgZG9lc24ndCBwcm92aWRlIEJhc2U2NCBtZXRob2RcbiAgY29uc3QgY2hhcnMgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLz0nO1xuXG4gIGlmICh0eXBlb2YgYnRvYSA9PSAndW5kZWZpbmVkJykge1xuICAgIGdsb2JhbC5idG9hID0gZnVuY3Rpb24oaW5wdXQgPSAnJykge1xuICAgICAgbGV0IHN0ciA9IGlucHV0O1xuICAgICAgbGV0IG91dHB1dCA9ICcnO1xuXG4gICAgICBmb3IgKGxldCBibG9jayA9IDAsIGNoYXJDb2RlLCBpID0gMCwgbWFwID0gY2hhcnM7IHN0ci5jaGFyQXQoaSB8IDApIHx8IChtYXAgPSAnPScsIGkgJSAxKTsgb3V0cHV0ICs9IG1hcC5jaGFyQXQoNjMgJiBibG9jayA+PiA4IC0gaSAlIDEgKiA4KSkge1xuXG4gICAgICAgIGNoYXJDb2RlID0gc3RyLmNoYXJDb2RlQXQoaSArPSAzIC8gNCk7XG5cbiAgICAgICAgaWYgKGNoYXJDb2RlID4gMHhGRikge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIididG9hJyBmYWlsZWQ6IFRoZSBzdHJpbmcgdG8gYmUgZW5jb2RlZCBjb250YWlucyBjaGFyYWN0ZXJzIG91dHNpZGUgb2YgdGhlIExhdGluMSByYW5nZS5cIik7XG4gICAgICAgIH1cbiAgICAgICAgYmxvY2sgPSBibG9jayA8PCA4IHwgY2hhckNvZGU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgYXRvYiA9PSAndW5kZWZpbmVkJykge1xuICAgIGdsb2JhbC5hdG9iID0gZnVuY3Rpb24oaW5wdXQgPSAnJykge1xuICAgICAgbGV0IHN0ciA9IGlucHV0LnJlcGxhY2UoLz0rJC8sICcnKTtcbiAgICAgIGxldCBvdXRwdXQgPSAnJztcblxuICAgICAgaWYgKHN0ci5sZW5ndGggJSA0ID09IDEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiJ2F0b2InIGZhaWxlZDogVGhlIHN0cmluZyB0byBiZSBkZWNvZGVkIGlzIG5vdCBjb3JyZWN0bHkgZW5jb2RlZC5cIik7XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBiYyA9IDAsIGJzID0gMCwgYnVmZmVyLCBpID0gMDsgYnVmZmVyID0gc3RyLmNoYXJBdChpKyspO1xuXG4gICAgICAgIH5idWZmZXIgJiYgKGJzID0gYmMgJSA0ID8gYnMgKiA2NCArIGJ1ZmZlciA6IGJ1ZmZlcixcbiAgICAgICAgICBiYysrICUgNCkgPyBvdXRwdXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSgyNTUgJiBicyA+PiAoLTIgKiBiYyAmIDYpKSA6IDBcbiAgICAgICkge1xuICAgICAgICBidWZmZXIgPSBjaGFycy5pbmRleE9mKGJ1ZmZlcik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfTtcbiAgfVxuXG4gIGlmICh0eXBlb2Ygd2luZG93ID09ICd1bmRlZmluZWQnKSB7XG4gICAgZ2xvYmFsLndpbmRvdyA9IHtcbiAgICAgIFdlYlNvY2tldDogV2ViU29ja2V0UHJvdmlkZXIsXG4gICAgICBYTUxIdHRwUmVxdWVzdDogWEhSUHJvdmlkZXIsXG4gICAgICBpbmRleGVkREI6IEluZGV4ZWREQlByb3ZpZGVyLFxuICAgICAgVVJMOiB7XG4gICAgICAgIGNyZWF0ZU9iamVjdFVSTDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5hYmxlIHRvIHVzZSBVUkwuY3JlYXRlT2JqZWN0VVJMIGluIGEgbm9uLWJyb3dzZXIgYXBwbGljYXRpb25cIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBDb25uZWN0aW9uLnNldE5ldHdvcmtQcm92aWRlcnMoV2ViU29ja2V0UHJvdmlkZXIsIFhIUlByb3ZpZGVyKTtcbiAgTGFyZ2VGaWxlSGVscGVyLnNldE5ldHdvcmtQcm92aWRlcihYSFJQcm92aWRlcik7XG4gIERCQ2FjaGUuc2V0RGF0YWJhc2VQcm92aWRlcihJbmRleGVkREJQcm92aWRlcik7XG59XG5cbi8vIERldGVjdCBmaW5kIG1vc3QgdXNlZnVsIG5ldHdvcmsgdHJhbnNwb3J0LlxuZnVuY3Rpb24gZGV0ZWN0VHJhbnNwb3J0KCkge1xuICBpZiAodHlwZW9mIHdpbmRvdyA9PSAnb2JqZWN0Jykge1xuICAgIGlmICh3aW5kb3dbJ1dlYlNvY2tldCddKSB7XG4gICAgICByZXR1cm4gJ3dzJztcbiAgICB9IGVsc2UgaWYgKHdpbmRvd1snWE1MSHR0cFJlcXVlc3QnXSkge1xuICAgICAgLy8gVGhlIGJyb3dzZXIgb3Igbm9kZSBoYXMgbm8gd2Vic29ja2V0cywgdXNpbmcgbG9uZyBwb2xsaW5nLlxuICAgICAgcmV0dXJuICdscCc7XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vLyBidG9hIHJlcGxhY2VtZW50LiBTdG9jayBidG9hIGZhaWxzIG9uIG9uIG5vbi1MYXRpbjEgc3RyaW5ncy5cbmZ1bmN0aW9uIGI2NEVuY29kZVVuaWNvZGUoc3RyKSB7XG4gIC8vIFRoZSBlbmNvZGVVUklDb21wb25lbnQgcGVyY2VudC1lbmNvZGVzIFVURi04IHN0cmluZyxcbiAgLy8gdGhlbiB0aGUgcGVyY2VudCBlbmNvZGluZyBpcyBjb252ZXJ0ZWQgaW50byByYXcgYnl0ZXMgd2hpY2hcbiAgLy8gY2FuIGJlIGZlZCBpbnRvIGJ0b2EuXG4gIHJldHVybiBidG9hKGVuY29kZVVSSUNvbXBvbmVudChzdHIpLnJlcGxhY2UoLyUoWzAtOUEtRl17Mn0pL2csXG4gICAgZnVuY3Rpb24gdG9Tb2xpZEJ5dGVzKG1hdGNoLCBwMSkge1xuICAgICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoJzB4JyArIHAxKTtcbiAgICB9KSk7XG59XG5cbi8vIEpTT04gc3RyaW5naWZ5IGhlbHBlciAtIHByZS1wcm9jZXNzb3IgZm9yIEpTT04uc3RyaW5naWZ5XG5mdW5jdGlvbiBqc29uQnVpbGRIZWxwZXIoa2V5LCB2YWwpIHtcbiAgaWYgKHZhbCBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAvLyBDb252ZXJ0IGphdmFzY3JpcHQgRGF0ZSBvYmplY3RzIHRvIHJmYzMzMzkgc3RyaW5nc1xuICAgIHZhbCA9IHJmYzMzMzlEYXRlU3RyaW5nKHZhbCk7XG4gIH0gZWxzZSBpZiAodmFsIGluc3RhbmNlb2YgQWNjZXNzTW9kZSkge1xuICAgIHZhbCA9IHZhbC5qc29uSGVscGVyKCk7XG4gIH0gZWxzZSBpZiAodmFsID09PSB1bmRlZmluZWQgfHwgdmFsID09PSBudWxsIHx8IHZhbCA9PT0gZmFsc2UgfHxcbiAgICAoQXJyYXkuaXNBcnJheSh2YWwpICYmIHZhbC5sZW5ndGggPT0gMCkgfHxcbiAgICAoKHR5cGVvZiB2YWwgPT0gJ29iamVjdCcpICYmIChPYmplY3Qua2V5cyh2YWwpLmxlbmd0aCA9PSAwKSkpIHtcbiAgICAvLyBzdHJpcCBvdXQgZW1wdHkgZWxlbWVudHMgd2hpbGUgc2VyaWFsaXppbmcgb2JqZWN0cyB0byBKU09OXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHJldHVybiB2YWw7XG59O1xuXG4vLyBUcmltcyB2ZXJ5IGxvbmcgc3RyaW5ncyAoZW5jb2RlZCBpbWFnZXMpIHRvIG1ha2UgbG9nZ2VkIHBhY2tldHMgbW9yZSByZWFkYWJsZS5cbmZ1bmN0aW9uIGpzb25Mb2dnZXJIZWxwZXIoa2V5LCB2YWwpIHtcbiAgaWYgKHR5cGVvZiB2YWwgPT0gJ3N0cmluZycgJiYgdmFsLmxlbmd0aCA+IDEyOCkge1xuICAgIHJldHVybiAnPCcgKyB2YWwubGVuZ3RoICsgJywgYnl0ZXM6ICcgKyB2YWwuc3Vic3RyaW5nKDAsIDEyKSArICcuLi4nICsgdmFsLnN1YnN0cmluZyh2YWwubGVuZ3RoIC0gMTIpICsgJz4nO1xuICB9XG4gIHJldHVybiBqc29uQnVpbGRIZWxwZXIoa2V5LCB2YWwpO1xufTtcblxuLy8gUGFyc2UgYnJvd3NlciB1c2VyIGFnZW50IHRvIGV4dHJhY3QgYnJvd3NlciBuYW1lIGFuZCB2ZXJzaW9uLlxuZnVuY3Rpb24gZ2V0QnJvd3NlckluZm8odWEsIHByb2R1Y3QpIHtcbiAgdWEgPSB1YSB8fCAnJztcbiAgbGV0IHJlYWN0bmF0aXZlID0gJyc7XG4gIC8vIENoZWNrIGlmIHRoaXMgaXMgYSBSZWFjdE5hdGl2ZSBhcHAuXG4gIGlmICgvcmVhY3RuYXRpdmUvaS50ZXN0KHByb2R1Y3QpKSB7XG4gICAgcmVhY3RuYXRpdmUgPSAnUmVhY3ROYXRpdmU7ICc7XG4gIH1cbiAgbGV0IHJlc3VsdDtcbiAgLy8gUmVtb3ZlIHVzZWxlc3Mgc3RyaW5nLlxuICB1YSA9IHVhLnJlcGxhY2UoJyAoS0hUTUwsIGxpa2UgR2Vja28pJywgJycpO1xuICAvLyBUZXN0IGZvciBXZWJLaXQtYmFzZWQgYnJvd3Nlci5cbiAgbGV0IG0gPSB1YS5tYXRjaCgvKEFwcGxlV2ViS2l0XFwvWy5cXGRdKykvaSk7XG4gIGlmIChtKSB7XG4gICAgLy8gTGlzdCBvZiBjb21tb24gc3RyaW5ncywgZnJvbSBtb3JlIHVzZWZ1bCB0byBsZXNzIHVzZWZ1bC5cbiAgICAvLyBBbGwgdW5rbm93biBzdHJpbmdzIGdldCB0aGUgaGlnaGVzdCAoLTEpIHByaW9yaXR5LlxuICAgIGNvbnN0IHByaW9yaXR5ID0gWydlZGcnLCAnY2hyb21lJywgJ3NhZmFyaScsICdtb2JpbGUnLCAndmVyc2lvbiddO1xuICAgIGxldCB0bXAgPSB1YS5zdWJzdHIobS5pbmRleCArIG1bMF0ubGVuZ3RoKS5zcGxpdCgnICcpO1xuICAgIGxldCB0b2tlbnMgPSBbXTtcbiAgICBsZXQgdmVyc2lvbjsgLy8gMS4wIGluIFZlcnNpb24vMS4wIG9yIHVuZGVmaW5lZDtcbiAgICAvLyBTcGxpdCBzdHJpbmcgbGlrZSAnTmFtZS8wLjAuMCcgaW50byBbJ05hbWUnLCAnMC4wLjAnLCAzXSB3aGVyZSB0aGUgbGFzdCBlbGVtZW50IGlzIHRoZSBwcmlvcml0eS5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRtcC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IG0yID0gLyhbXFx3Ll0rKVtcXC9dKFtcXC5cXGRdKykvLmV4ZWModG1wW2ldKTtcbiAgICAgIGlmIChtMikge1xuICAgICAgICAvLyBVbmtub3duIHZhbHVlcyBhcmUgaGlnaGVzdCBwcmlvcml0eSAoLTEpLlxuICAgICAgICB0b2tlbnMucHVzaChbbTJbMV0sIG0yWzJdLCBwcmlvcml0eS5maW5kSW5kZXgoKGUpID0+IHtcbiAgICAgICAgICByZXR1cm4gbTJbMV0udG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoKGUpO1xuICAgICAgICB9KV0pO1xuICAgICAgICBpZiAobTJbMV0gPT0gJ1ZlcnNpb24nKSB7XG4gICAgICAgICAgdmVyc2lvbiA9IG0yWzJdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIC8vIFNvcnQgYnkgcHJpb3JpdHk6IG1vcmUgaW50ZXJlc3RpbmcgaXMgZWFybGllciB0aGFuIGxlc3MgaW50ZXJlc3RpbmcuXG4gICAgdG9rZW5zLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIHJldHVybiBhWzJdIC0gYlsyXTtcbiAgICB9KTtcbiAgICBpZiAodG9rZW5zLmxlbmd0aCA+IDApIHtcbiAgICAgIC8vIFJldHVybiB0aGUgbGVhc3QgY29tbW9uIGJyb3dzZXIgc3RyaW5nIGFuZCB2ZXJzaW9uLlxuICAgICAgaWYgKHRva2Vuc1swXVswXS50b0xvd2VyQ2FzZSgpLnN0YXJ0c1dpdGgoJ2VkZycpKSB7XG4gICAgICAgIHRva2Vuc1swXVswXSA9ICdFZGdlJztcbiAgICAgIH0gZWxzZSBpZiAodG9rZW5zWzBdWzBdID09ICdPUFInKSB7XG4gICAgICAgIHRva2Vuc1swXVswXSA9ICdPcGVyYSc7XG4gICAgICB9IGVsc2UgaWYgKHRva2Vuc1swXVswXSA9PSAnU2FmYXJpJyAmJiB2ZXJzaW9uKSB7XG4gICAgICAgIHRva2Vuc1swXVsxXSA9IHZlcnNpb247XG4gICAgICB9XG4gICAgICByZXN1bHQgPSB0b2tlbnNbMF1bMF0gKyAnLycgKyB0b2tlbnNbMF1bMV07XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEZhaWxlZCB0byBJRCB0aGUgYnJvd3Nlci4gUmV0dXJuIHRoZSB3ZWJraXQgdmVyc2lvbi5cbiAgICAgIHJlc3VsdCA9IG1bMV07XG4gICAgfVxuICB9IGVsc2UgaWYgKC9maXJlZm94L2kudGVzdCh1YSkpIHtcbiAgICBtID0gL0ZpcmVmb3hcXC8oWy5cXGRdKykvZy5leGVjKHVhKTtcbiAgICBpZiAobSkge1xuICAgICAgcmVzdWx0ID0gJ0ZpcmVmb3gvJyArIG1bMV07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdCA9ICdGaXJlZm94Lz8nO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBOZWl0aGVyIEFwcGxlV2ViS2l0IG5vciBGaXJlZm94LiBUcnkgdGhlIGxhc3QgcmVzb3J0LlxuICAgIG0gPSAvKFtcXHcuXSspXFwvKFsuXFxkXSspLy5leGVjKHVhKTtcbiAgICBpZiAobSkge1xuICAgICAgcmVzdWx0ID0gbVsxXSArICcvJyArIG1bMl07XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSB1YS5zcGxpdCgnICcpO1xuICAgICAgcmVzdWx0ID0gbVswXTtcbiAgICB9XG4gIH1cblxuICAvLyBTaG9ydGVuIHRoZSB2ZXJzaW9uIHRvIG9uZSBkb3QgJ2EuYmIuY2NjLmQgLT4gYS5iYicgYXQgbW9zdC5cbiAgbSA9IHJlc3VsdC5zcGxpdCgnLycpO1xuICBpZiAobS5sZW5ndGggPiAxKSB7XG4gICAgY29uc3QgdiA9IG1bMV0uc3BsaXQoJy4nKTtcbiAgICBjb25zdCBtaW5vciA9IHZbMV0gPyAnLicgKyB2WzFdLnN1YnN0cigwLCAyKSA6ICcnO1xuICAgIHJlc3VsdCA9IGAke21bMF19LyR7dlswXX0ke21pbm9yfWA7XG4gIH1cbiAgcmV0dXJuIHJlYWN0bmF0aXZlICsgcmVzdWx0O1xufVxuXG4vKipcbiAqIFRoZSBtYWluIGNsYXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIFRpbm9kZSBzZXJ2ZXIuXG4gKi9cbmV4cG9ydCBjbGFzcyBUaW5vZGUge1xuICBfaG9zdDtcbiAgX3NlY3VyZTtcblxuICBfYXBwTmFtZTtcblxuICAvLyBBUEkgS2V5LlxuICBfYXBpS2V5O1xuXG4gIC8vIE5hbWUgYW5kIHZlcnNpb24gb2YgdGhlIGJyb3dzZXIuXG4gIF9icm93c2VyID0gJyc7XG4gIF9wbGF0Zm9ybTtcbiAgLy8gSGFyZHdhcmVcbiAgX2h3b3MgPSAndW5kZWZpbmVkJztcbiAgX2h1bWFuTGFuZ3VhZ2UgPSAneHgnO1xuXG4gIC8vIExvZ2dpbmcgdG8gY29uc29sZSBlbmFibGVkXG4gIF9sb2dnaW5nRW5hYmxlZCA9IGZhbHNlO1xuICAvLyBXaGVuIGxvZ2dpbmcsIHRyaXAgbG9uZyBzdHJpbmdzIChiYXNlNjQtZW5jb2RlZCBpbWFnZXMpIGZvciByZWFkYWJpbGl0eVxuICBfdHJpbUxvbmdTdHJpbmdzID0gZmFsc2U7XG4gIC8vIFVJRCBvZiB0aGUgY3VycmVudGx5IGF1dGhlbnRpY2F0ZWQgdXNlci5cbiAgX215VUlEID0gbnVsbDtcbiAgLy8gU3RhdHVzIG9mIGNvbm5lY3Rpb246IGF1dGhlbnRpY2F0ZWQgb3Igbm90LlxuICBfYXV0aGVudGljYXRlZCA9IGZhbHNlO1xuICAvLyBMb2dpbiB1c2VkIGluIHRoZSBsYXN0IHN1Y2Nlc3NmdWwgYmFzaWMgYXV0aGVudGljYXRpb25cbiAgX2xvZ2luID0gbnVsbDtcbiAgLy8gVG9rZW4gd2hpY2ggY2FuIGJlIHVzZWQgZm9yIGxvZ2luIGluc3RlYWQgb2YgbG9naW4vcGFzc3dvcmQuXG4gIF9hdXRoVG9rZW4gPSBudWxsO1xuICAvLyBDb3VudGVyIG9mIHJlY2VpdmVkIHBhY2tldHNcbiAgX2luUGFja2V0Q291bnQgPSAwO1xuICAvLyBDb3VudGVyIGZvciBnZW5lcmF0aW5nIHVuaXF1ZSBtZXNzYWdlIElEc1xuICBfbWVzc2FnZUlkID0gTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIDB4RkZGRikgKyAweEZGRkYpO1xuICAvLyBJbmZvcm1hdGlvbiBhYm91dCB0aGUgc2VydmVyLCBpZiBjb25uZWN0ZWRcbiAgX3NlcnZlckluZm8gPSBudWxsO1xuICAvLyBQdXNoIG5vdGlmaWNhdGlvbiB0b2tlbi4gQ2FsbGVkIGRldmljZVRva2VuIGZvciBjb25zaXN0ZW5jeSB3aXRoIHRoZSBBbmRyb2lkIFNESy5cbiAgX2RldmljZVRva2VuID0gbnVsbDtcblxuICAvLyBDYWNoZSBvZiBwZW5kaW5nIHByb21pc2VzIGJ5IG1lc3NhZ2UgaWQuXG4gIF9wZW5kaW5nUHJvbWlzZXMgPSB7fTtcbiAgLy8gVGhlIFRpbWVvdXQgb2JqZWN0IHJldHVybmVkIGJ5IHRoZSByZWplY3QgZXhwaXJlZCBwcm9taXNlcyBzZXRJbnRlcnZhbC5cbiAgX2V4cGlyZVByb21pc2VzID0gbnVsbDtcblxuICAvLyBXZWJzb2NrZXQgb3IgbG9uZyBwb2xsaW5nIGNvbm5lY3Rpb24uXG4gIF9jb25uZWN0aW9uID0gbnVsbDtcblxuICAvLyBVc2UgaW5kZXhEQiBmb3IgY2FjaGluZyB0b3BpY3MgYW5kIG1lc3NhZ2VzLlxuICBfcGVyc2lzdCA9IGZhbHNlO1xuICAvLyBJbmRleGVkREIgd3JhcHBlciBvYmplY3QuXG4gIF9kYiA9IG51bGw7XG5cbiAgLy8gVGlub2RlJ3MgY2FjaGUgb2Ygb2JqZWN0c1xuICBfY2FjaGUgPSB7fTtcblxuICAvKipcbiAgICogQ3JlYXRlIFRpbm9kZSBvYmplY3QuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgLSBjb25maWd1cmF0aW9uIHBhcmFtZXRlcnMuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb25maWcuYXBwTmFtZSAtIE5hbWUgb2YgdGhlIGNhbGxpbmcgYXBwbGljYXRpb24gdG8gYmUgcmVwb3J0ZWQgaW4gdGhlIFVzZXIgQWdlbnQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb25maWcuaG9zdCAtIEhvc3QgbmFtZSBhbmQgb3B0aW9uYWwgcG9ydCBudW1iZXIgdG8gY29ubmVjdCB0by5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbmZpZy5hcGlLZXkgLSBBUEkga2V5IGdlbmVyYXRlZCBieSA8Y29kZT5rZXlnZW48L2NvZGU+LlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY29uZmlnLnRyYW5zcG9ydCAtIFNlZSB7QGxpbmsgVGlub2RlLkNvbm5lY3Rpb24jdHJhbnNwb3J0fS5cbiAgICogQHBhcmFtIHtib29sZWFufSBjb25maWcuc2VjdXJlIC0gVXNlIFNlY3VyZSBXZWJTb2NrZXQgaWYgPGNvZGU+dHJ1ZTwvY29kZT4uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb25maWcucGxhdGZvcm0gLSBPcHRpb25hbCBwbGF0Zm9ybSBpZGVudGlmaWVyLCBvbmUgb2YgPGNvZGU+XCJpb3NcIjwvY29kZT4sIDxjb2RlPlwid2ViXCI8L2NvZGU+LCA8Y29kZT5cImFuZHJvaWRcIjwvY29kZT4uXG4gICAqIEBwYXJhbSB7Ym9vbGVufSBjb25maWcucGVyc2lzdCAtIFVzZSBJbmRleGVkREIgcGVyc2lzdGVudCBzdG9yYWdlLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBvbkNvbXBsZXRlIC0gY2FsbGJhY2sgdG8gY2FsbCB3aGVuIGluaXRpYWxpemF0aW9uIGlzIGNvbXBsZXRlZC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGNvbmZpZywgb25Db21wbGV0ZSkge1xuICAgIHRoaXMuX2hvc3QgPSBjb25maWcuaG9zdDtcbiAgICB0aGlzLl9zZWN1cmUgPSBjb25maWcuc2VjdXJlO1xuXG4gICAgLy8gQ2xpZW50LXByb3ZpZGVkIGFwcGxpY2F0aW9uIG5hbWUsIGZvcm1hdCA8TmFtZT4vPHZlcnNpb24gbnVtYmVyPlxuICAgIHRoaXMuX2FwcE5hbWUgPSBjb25maWcuYXBwTmFtZSB8fCBcIlVuZGVmaW5lZFwiO1xuXG4gICAgLy8gQVBJIEtleS5cbiAgICB0aGlzLl9hcGlLZXkgPSBjb25maWcuYXBpS2V5O1xuXG4gICAgLy8gTmFtZSBhbmQgdmVyc2lvbiBvZiB0aGUgYnJvd3Nlci5cbiAgICB0aGlzLl9wbGF0Zm9ybSA9IGNvbmZpZy5wbGF0Zm9ybSB8fCAnd2ViJztcbiAgICAvLyBVbmRlcmx5aW5nIE9TLlxuICAgIGlmICh0eXBlb2YgbmF2aWdhdG9yICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aGlzLl9icm93c2VyID0gZ2V0QnJvd3NlckluZm8obmF2aWdhdG9yLnVzZXJBZ2VudCwgbmF2aWdhdG9yLnByb2R1Y3QpO1xuICAgICAgdGhpcy5faHdvcyA9IG5hdmlnYXRvci5wbGF0Zm9ybTtcbiAgICAgIC8vIFRoaXMgaXMgdGhlIGRlZmF1bHQgbGFuZ3VhZ2UuIEl0IGNvdWxkIGJlIGNoYW5nZWQgYnkgY2xpZW50LlxuICAgICAgdGhpcy5faHVtYW5MYW5ndWFnZSA9IG5hdmlnYXRvci5sYW5ndWFnZSB8fCAnZW4tVVMnO1xuICAgIH1cblxuICAgIENvbm5lY3Rpb24ubG9nZ2VyID0gdGhpcy5sb2dnZXI7XG4gICAgRHJhZnR5LmxvZ2dlciA9IHRoaXMubG9nZ2VyO1xuXG4gICAgLy8gV2ViU29ja2V0IG9yIGxvbmcgcG9sbGluZyBuZXR3b3JrIGNvbm5lY3Rpb24uXG4gICAgaWYgKGNvbmZpZy50cmFuc3BvcnQgIT0gJ2xwJyAmJiBjb25maWcudHJhbnNwb3J0ICE9ICd3cycpIHtcbiAgICAgIGNvbmZpZy50cmFuc3BvcnQgPSBkZXRlY3RUcmFuc3BvcnQoKTtcbiAgICB9XG4gICAgdGhpcy5fY29ubmVjdGlvbiA9IG5ldyBDb25uZWN0aW9uKGNvbmZpZywgQ29uc3QuUFJPVE9DT0xfVkVSU0lPTiwgLyogYXV0b3JlY29ubmVjdCAqLyB0cnVlKTtcbiAgICB0aGlzLl9jb25uZWN0aW9uLm9uTWVzc2FnZSA9IChkYXRhKSA9PiB7XG4gICAgICAvLyBDYWxsIHRoZSBtYWluIG1lc3NhZ2UgZGlzcGF0Y2hlci5cbiAgICAgIHRoaXMuI2Rpc3BhdGNoTWVzc2FnZShkYXRhKTtcbiAgICB9XG4gICAgdGhpcy5fY29ubmVjdGlvbi5vbk9wZW4gPSAoKSA9PiB7XG4gICAgICAvLyBSZWFkeSB0byBzdGFydCBzZW5kaW5nLlxuICAgICAgdGhpcy4jY29ubmVjdGlvbk9wZW4oKTtcbiAgICB9XG4gICAgdGhpcy5fY29ubmVjdGlvbi5vbkRpc2Nvbm5lY3QgPSAoZXJyLCBjb2RlKSA9PiB7XG4gICAgICB0aGlzLiNkaXNjb25uZWN0ZWQoZXJyLCBjb2RlKTtcbiAgICB9XG4gICAgLy8gV3JhcHBlciBmb3IgdGhlIHJlY29ubmVjdCBpdGVyYXRvciBjYWxsYmFjay5cbiAgICB0aGlzLl9jb25uZWN0aW9uLm9uQXV0b3JlY29ubmVjdEl0ZXJhdGlvbiA9ICh0aW1lb3V0LCBwcm9taXNlKSA9PiB7XG4gICAgICBpZiAodGhpcy5vbkF1dG9yZWNvbm5lY3RJdGVyYXRpb24pIHtcbiAgICAgICAgdGhpcy5vbkF1dG9yZWNvbm5lY3RJdGVyYXRpb24odGltZW91dCwgcHJvbWlzZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fcGVyc2lzdCA9IGNvbmZpZy5wZXJzaXN0O1xuICAgIC8vIEluaXRpYWxpemUgb2JqZWN0IHJlZ2FyZGxlc3MuIEl0IHNpbXBsaWZpZXMgdGhlIGNvZGUuXG4gICAgdGhpcy5fZGIgPSBuZXcgREJDYWNoZShlcnIgPT4ge1xuICAgICAgdGhpcy5sb2dnZXIoJ0RCJywgZXJyKTtcbiAgICB9LCB0aGlzLmxvZ2dlcik7XG5cbiAgICBpZiAodGhpcy5fcGVyc2lzdCkge1xuICAgICAgLy8gQ3JlYXRlIHRoZSBwZXJzaXN0ZW50IGNhY2hlLlxuICAgICAgLy8gU3RvcmUgcHJvbWlzZXMgdG8gYmUgcmVzb2x2ZWQgd2hlbiBtZXNzYWdlcyBsb2FkIGludG8gbWVtb3J5LlxuICAgICAgY29uc3QgcHJvbSA9IFtdO1xuICAgICAgdGhpcy5fZGIuaW5pdERhdGFiYXNlKCkudGhlbihfID0+IHtcbiAgICAgICAgLy8gRmlyc3QgbG9hZCB0b3BpY3MgaW50byBtZW1vcnkuXG4gICAgICAgIHJldHVybiB0aGlzLl9kYi5tYXBUb3BpY3MoKGRhdGEpID0+IHtcbiAgICAgICAgICBsZXQgdG9waWMgPSB0aGlzLiNjYWNoZUdldCgndG9waWMnLCBkYXRhLm5hbWUpO1xuICAgICAgICAgIGlmICh0b3BpYykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZGF0YS5uYW1lID09IENvbnN0LlRPUElDX01FKSB7XG4gICAgICAgICAgICB0b3BpYyA9IG5ldyBUb3BpY01lKCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChkYXRhLm5hbWUgPT0gQ29uc3QuVE9QSUNfRk5EKSB7XG4gICAgICAgICAgICB0b3BpYyA9IG5ldyBUb3BpY0ZuZCgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0b3BpYyA9IG5ldyBUb3BpYyhkYXRhLm5hbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLl9kYi5kZXNlcmlhbGl6ZVRvcGljKHRvcGljLCBkYXRhKTtcbiAgICAgICAgICB0aGlzLiNhdHRhY2hDYWNoZVRvVG9waWModG9waWMpO1xuICAgICAgICAgIHRvcGljLl9jYWNoZVB1dFNlbGYoKTtcbiAgICAgICAgICAvLyBUb3BpYyBsb2FkZWQgZnJvbSBEQiBpcyBub3QgbmV3LlxuICAgICAgICAgIGRlbGV0ZSB0b3BpYy5fbmV3O1xuICAgICAgICAgIC8vIFJlcXVlc3QgdG8gbG9hZCBtZXNzYWdlcyBhbmQgc2F2ZSB0aGUgcHJvbWlzZS5cbiAgICAgICAgICBwcm9tLnB1c2godG9waWMuX2xvYWRNZXNzYWdlcyh0aGlzLl9kYikpO1xuICAgICAgICB9KTtcbiAgICAgIH0pLnRoZW4oXyA9PiB7XG4gICAgICAgIC8vIFRoZW4gbG9hZCB1c2Vycy5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2RiLm1hcFVzZXJzKChkYXRhKSA9PiB7XG4gICAgICAgICAgdGhpcy4jY2FjaGVQdXQoJ3VzZXInLCBkYXRhLnVpZCwgbWVyZ2VPYmooe30sIGRhdGEucHVibGljKSk7XG4gICAgICAgIH0pO1xuICAgICAgfSkudGhlbihfID0+IHtcbiAgICAgICAgLy8gTm93IHdhaXQgZm9yIGFsbCBtZXNzYWdlcyB0byBmaW5pc2ggbG9hZGluZy5cbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHByb20pO1xuICAgICAgfSkudGhlbihfID0+IHtcbiAgICAgICAgaWYgKG9uQ29tcGxldGUpIHtcbiAgICAgICAgICBvbkNvbXBsZXRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sb2dnZXIoXCJQZXJzaXN0ZW50IGNhY2hlIGluaXRpYWxpemVkLlwiKTtcbiAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgaWYgKG9uQ29tcGxldGUpIHtcbiAgICAgICAgICBvbkNvbXBsZXRlKGVycik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sb2dnZXIoXCJGYWlsZWQgdG8gaW5pdGlhbGl6ZSBwZXJzaXN0ZW50IGNhY2hlOlwiLCBlcnIpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2RiLmRlbGV0ZURhdGFiYXNlKCkudGhlbihfID0+IHtcbiAgICAgICAgaWYgKG9uQ29tcGxldGUpIHtcbiAgICAgICAgICBvbkNvbXBsZXRlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIFByaXZhdGUgbWV0aG9kcy5cblxuICAvLyBDb25zb2xlIGxvZ2dlci4gQmFiZWwgc29tZWhvdyBmYWlscyB0byBwYXJzZSAnLi4ucmVzdCcgcGFyYW1ldGVyLlxuICBsb2dnZXIoc3RyLCAuLi5hcmdzKSB7XG4gICAgaWYgKHRoaXMuX2xvZ2dpbmdFbmFibGVkKSB7XG4gICAgICBjb25zdCBkID0gbmV3IERhdGUoKTtcbiAgICAgIGNvbnN0IGRhdGVTdHJpbmcgPSAoJzAnICsgZC5nZXRVVENIb3VycygpKS5zbGljZSgtMikgKyAnOicgK1xuICAgICAgICAoJzAnICsgZC5nZXRVVENNaW51dGVzKCkpLnNsaWNlKC0yKSArICc6JyArXG4gICAgICAgICgnMCcgKyBkLmdldFVUQ1NlY29uZHMoKSkuc2xpY2UoLTIpICsgJy4nICtcbiAgICAgICAgKCcwMCcgKyBkLmdldFVUQ01pbGxpc2Vjb25kcygpKS5zbGljZSgtMyk7XG5cbiAgICAgIGNvbnNvbGUubG9nKCdbJyArIGRhdGVTdHJpbmcgKyAnXScsIHN0ciwgYXJncy5qb2luKCcgJykpO1xuICAgIH1cbiAgfVxuXG4gIC8vIEdlbmVyYXRvciBvZiBkZWZhdWx0IHByb21pc2VzIGZvciBzZW50IHBhY2tldHMuXG4gICNtYWtlUHJvbWlzZShpZCkge1xuICAgIGxldCBwcm9taXNlID0gbnVsbDtcbiAgICBpZiAoaWQpIHtcbiAgICAgIHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIC8vIFN0b3JlZCBjYWxsYmFja3Mgd2lsbCBiZSBjYWxsZWQgd2hlbiB0aGUgcmVzcG9uc2UgcGFja2V0IHdpdGggdGhpcyBJZCBhcnJpdmVzXG4gICAgICAgIHRoaXMuX3BlbmRpbmdQcm9taXNlc1tpZF0gPSB7XG4gICAgICAgICAgJ3Jlc29sdmUnOiByZXNvbHZlLFxuICAgICAgICAgICdyZWplY3QnOiByZWplY3QsXG4gICAgICAgICAgJ3RzJzogbmV3IERhdGUoKVxuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBwcm9taXNlO1xuICB9O1xuXG4gIC8vIFJlc29sdmUgb3IgcmVqZWN0IGEgcGVuZGluZyBwcm9taXNlLlxuICAvLyBVbnJlc29sdmVkIHByb21pc2VzIGFyZSBzdG9yZWQgaW4gX3BlbmRpbmdQcm9taXNlcy5cbiAgI2V4ZWNQcm9taXNlKGlkLCBjb2RlLCBvbk9LLCBlcnJvclRleHQpIHtcbiAgICBjb25zdCBjYWxsYmFja3MgPSB0aGlzLl9wZW5kaW5nUHJvbWlzZXNbaWRdO1xuICAgIGlmIChjYWxsYmFja3MpIHtcbiAgICAgIGRlbGV0ZSB0aGlzLl9wZW5kaW5nUHJvbWlzZXNbaWRdO1xuICAgICAgaWYgKGNvZGUgPj0gMjAwICYmIGNvZGUgPCA0MDApIHtcbiAgICAgICAgaWYgKGNhbGxiYWNrcy5yZXNvbHZlKSB7XG4gICAgICAgICAgY2FsbGJhY2tzLnJlc29sdmUob25PSyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoY2FsbGJhY2tzLnJlamVjdCkge1xuICAgICAgICBjYWxsYmFja3MucmVqZWN0KG5ldyBFcnJvcihgJHtlcnJvclRleHR9ICgke2NvZGV9KWApKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBTZW5kIGEgcGFja2V0LiBJZiBwYWNrZXQgaWQgaXMgcHJvdmlkZWQgcmV0dXJuIGEgcHJvbWlzZS5cbiAgI3NlbmQocGt0LCBpZCkge1xuICAgIGxldCBwcm9taXNlO1xuICAgIGlmIChpZCkge1xuICAgICAgcHJvbWlzZSA9IHRoaXMuI21ha2VQcm9taXNlKGlkKTtcbiAgICB9XG4gICAgcGt0ID0gc2ltcGxpZnkocGt0KTtcbiAgICBsZXQgbXNnID0gSlNPTi5zdHJpbmdpZnkocGt0KTtcbiAgICB0aGlzLmxvZ2dlcihcIm91dDogXCIgKyAodGhpcy5fdHJpbUxvbmdTdHJpbmdzID8gSlNPTi5zdHJpbmdpZnkocGt0LCBqc29uTG9nZ2VySGVscGVyKSA6IG1zZykpO1xuICAgIHRyeSB7XG4gICAgICB0aGlzLl9jb25uZWN0aW9uLnNlbmRUZXh0KG1zZyk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAvLyBJZiBzZW5kVGV4dCB0aHJvd3MsIHdyYXAgdGhlIGVycm9yIGluIGEgcHJvbWlzZSBvciByZXRocm93LlxuICAgICAgaWYgKGlkKSB7XG4gICAgICAgIHRoaXMuI2V4ZWNQcm9taXNlKGlkLCBDb25uZWN0aW9uLk5FVFdPUktfRVJST1IsIG51bGwsIGVyci5tZXNzYWdlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICAvLyBUaGUgbWFpbiBtZXNzYWdlIGRpc3BhdGNoZXIuXG4gICNkaXNwYXRjaE1lc3NhZ2UoZGF0YSkge1xuICAgIC8vIFNraXAgZW1wdHkgcmVzcG9uc2UuIFRoaXMgaGFwcGVucyB3aGVuIExQIHRpbWVzIG91dC5cbiAgICBpZiAoIWRhdGEpXG4gICAgICByZXR1cm47XG5cbiAgICB0aGlzLl9pblBhY2tldENvdW50Kys7XG5cbiAgICAvLyBTZW5kIHJhdyBtZXNzYWdlIHRvIGxpc3RlbmVyXG4gICAgaWYgKHRoaXMub25SYXdNZXNzYWdlKSB7XG4gICAgICB0aGlzLm9uUmF3TWVzc2FnZShkYXRhKTtcbiAgICB9XG5cbiAgICBpZiAoZGF0YSA9PT0gJzAnKSB7XG4gICAgICAvLyBTZXJ2ZXIgcmVzcG9uc2UgdG8gYSBuZXR3b3JrIHByb2JlLlxuICAgICAgaWYgKHRoaXMub25OZXR3b3JrUHJvYmUpIHtcbiAgICAgICAgdGhpcy5vbk5ldHdvcmtQcm9iZSgpO1xuICAgICAgfVxuICAgICAgLy8gTm8gcHJvY2Vzc2luZyBpcyBuZWNlc3NhcnkuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHBrdCA9IEpTT04ucGFyc2UoZGF0YSwganNvblBhcnNlSGVscGVyKTtcbiAgICBpZiAoIXBrdCkge1xuICAgICAgdGhpcy5sb2dnZXIoXCJpbjogXCIgKyBkYXRhKTtcbiAgICAgIHRoaXMubG9nZ2VyKFwiRVJST1I6IGZhaWxlZCB0byBwYXJzZSBkYXRhXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxvZ2dlcihcImluOiBcIiArICh0aGlzLl90cmltTG9uZ1N0cmluZ3MgPyBKU09OLnN0cmluZ2lmeShwa3QsIGpzb25Mb2dnZXJIZWxwZXIpIDogZGF0YSkpO1xuXG4gICAgICAvLyBTZW5kIGNvbXBsZXRlIHBhY2tldCB0byBsaXN0ZW5lclxuICAgICAgaWYgKHRoaXMub25NZXNzYWdlKSB7XG4gICAgICAgIHRoaXMub25NZXNzYWdlKHBrdCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChwa3QuY3RybCkge1xuICAgICAgICAvLyBIYW5kbGluZyB7Y3RybH0gbWVzc2FnZVxuICAgICAgICBpZiAodGhpcy5vbkN0cmxNZXNzYWdlKSB7XG4gICAgICAgICAgdGhpcy5vbkN0cmxNZXNzYWdlKHBrdC5jdHJsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlc29sdmUgb3IgcmVqZWN0IGEgcGVuZGluZyBwcm9taXNlLCBpZiBhbnlcbiAgICAgICAgaWYgKHBrdC5jdHJsLmlkKSB7XG4gICAgICAgICAgdGhpcy4jZXhlY1Byb21pc2UocGt0LmN0cmwuaWQsIHBrdC5jdHJsLmNvZGUsIHBrdC5jdHJsLCBwa3QuY3RybC50ZXh0KTtcbiAgICAgICAgfVxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBpZiAocGt0LmN0cmwuY29kZSA9PSAyMDUgJiYgcGt0LmN0cmwudGV4dCA9PSAnZXZpY3RlZCcpIHtcbiAgICAgICAgICAgIC8vIFVzZXIgZXZpY3RlZCBmcm9tIHRvcGljLlxuICAgICAgICAgICAgY29uc3QgdG9waWMgPSB0aGlzLiNjYWNoZUdldCgndG9waWMnLCBwa3QuY3RybC50b3BpYyk7XG4gICAgICAgICAgICBpZiAodG9waWMpIHtcbiAgICAgICAgICAgICAgdG9waWMuX3Jlc2V0U3ViKCk7XG4gICAgICAgICAgICAgIGlmIChwa3QuY3RybC5wYXJhbXMgJiYgcGt0LmN0cmwucGFyYW1zLnVuc3ViKSB7XG4gICAgICAgICAgICAgICAgdG9waWMuX2dvbmUoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAocGt0LmN0cmwuY29kZSA8IDMwMCAmJiBwa3QuY3RybC5wYXJhbXMpIHtcbiAgICAgICAgICAgIGlmIChwa3QuY3RybC5wYXJhbXMud2hhdCA9PSAnZGF0YScpIHtcbiAgICAgICAgICAgICAgLy8gY29kZT0yMDgsIGFsbCBtZXNzYWdlcyByZWNlaXZlZDogXCJwYXJhbXNcIjp7XCJjb3VudFwiOjExLFwid2hhdFwiOlwiZGF0YVwifSxcbiAgICAgICAgICAgICAgY29uc3QgdG9waWMgPSB0aGlzLiNjYWNoZUdldCgndG9waWMnLCBwa3QuY3RybC50b3BpYyk7XG4gICAgICAgICAgICAgIGlmICh0b3BpYykge1xuICAgICAgICAgICAgICAgIHRvcGljLl9hbGxNZXNzYWdlc1JlY2VpdmVkKHBrdC5jdHJsLnBhcmFtcy5jb3VudCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAocGt0LmN0cmwucGFyYW1zLndoYXQgPT0gJ3N1YicpIHtcbiAgICAgICAgICAgICAgLy8gY29kZT0yMDQsIHRoZSB0b3BpYyBoYXMgbm8gKHJlZnJlc2hlZCkgc3Vic2NyaXB0aW9ucy5cbiAgICAgICAgICAgICAgY29uc3QgdG9waWMgPSB0aGlzLiNjYWNoZUdldCgndG9waWMnLCBwa3QuY3RybC50b3BpYyk7XG4gICAgICAgICAgICAgIGlmICh0b3BpYykge1xuICAgICAgICAgICAgICAgIC8vIFRyaWdnZXIgdG9waWMub25TdWJzVXBkYXRlZC5cbiAgICAgICAgICAgICAgICB0b3BpYy5fcHJvY2Vzc01ldGFTdWIoW10pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LCAwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGlmIChwa3QubWV0YSkge1xuICAgICAgICAgICAgLy8gSGFuZGxpbmcgYSB7bWV0YX0gbWVzc2FnZS5cbiAgICAgICAgICAgIC8vIFByZWZlcnJlZCBBUEk6IFJvdXRlIG1ldGEgdG8gdG9waWMsIGlmIG9uZSBpcyByZWdpc3RlcmVkXG4gICAgICAgICAgICBjb25zdCB0b3BpYyA9IHRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIHBrdC5tZXRhLnRvcGljKTtcbiAgICAgICAgICAgIGlmICh0b3BpYykge1xuICAgICAgICAgICAgICB0b3BpYy5fcm91dGVNZXRhKHBrdC5tZXRhKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHBrdC5tZXRhLmlkKSB7XG4gICAgICAgICAgICAgIHRoaXMuI2V4ZWNQcm9taXNlKHBrdC5tZXRhLmlkLCAyMDAsIHBrdC5tZXRhLCAnTUVUQScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBTZWNvbmRhcnkgQVBJOiBjYWxsYmFja1xuICAgICAgICAgICAgaWYgKHRoaXMub25NZXRhTWVzc2FnZSkge1xuICAgICAgICAgICAgICB0aGlzLm9uTWV0YU1lc3NhZ2UocGt0Lm1ldGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAocGt0LmRhdGEpIHtcbiAgICAgICAgICAgIC8vIEhhbmRsaW5nIHtkYXRhfSBtZXNzYWdlXG4gICAgICAgICAgICAvLyBQcmVmZXJyZWQgQVBJOiBSb3V0ZSBkYXRhIHRvIHRvcGljLCBpZiBvbmUgaXMgcmVnaXN0ZXJlZFxuICAgICAgICAgICAgY29uc3QgdG9waWMgPSB0aGlzLiNjYWNoZUdldCgndG9waWMnLCBwa3QuZGF0YS50b3BpYyk7XG4gICAgICAgICAgICBpZiAodG9waWMpIHtcbiAgICAgICAgICAgICAgdG9waWMuX3JvdXRlRGF0YShwa3QuZGF0YSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFNlY29uZGFyeSBBUEk6IENhbGwgY2FsbGJhY2tcbiAgICAgICAgICAgIGlmICh0aGlzLm9uRGF0YU1lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgdGhpcy5vbkRhdGFNZXNzYWdlKHBrdC5kYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKHBrdC5wcmVzKSB7XG4gICAgICAgICAgICAvLyBIYW5kbGluZyB7cHJlc30gbWVzc2FnZVxuICAgICAgICAgICAgLy8gUHJlZmVycmVkIEFQSTogUm91dGUgcHJlc2VuY2UgdG8gdG9waWMsIGlmIG9uZSBpcyByZWdpc3RlcmVkXG4gICAgICAgICAgICBjb25zdCB0b3BpYyA9IHRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIHBrdC5wcmVzLnRvcGljKTtcbiAgICAgICAgICAgIGlmICh0b3BpYykge1xuICAgICAgICAgICAgICB0b3BpYy5fcm91dGVQcmVzKHBrdC5wcmVzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gU2Vjb25kYXJ5IEFQSSAtIGNhbGxiYWNrXG4gICAgICAgICAgICBpZiAodGhpcy5vblByZXNNZXNzYWdlKSB7XG4gICAgICAgICAgICAgIHRoaXMub25QcmVzTWVzc2FnZShwa3QucHJlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChwa3QuaW5mbykge1xuICAgICAgICAgICAgLy8ge2luZm99IG1lc3NhZ2UgLSByZWFkL3JlY2VpdmVkIG5vdGlmaWNhdGlvbnMgYW5kIGtleSBwcmVzc2VzXG4gICAgICAgICAgICAvLyBQcmVmZXJyZWQgQVBJOiBSb3V0ZSB7aW5mb319IHRvIHRvcGljLCBpZiBvbmUgaXMgcmVnaXN0ZXJlZFxuICAgICAgICAgICAgY29uc3QgdG9waWMgPSB0aGlzLiNjYWNoZUdldCgndG9waWMnLCBwa3QuaW5mby50b3BpYyk7XG4gICAgICAgICAgICBpZiAodG9waWMpIHtcbiAgICAgICAgICAgICAgdG9waWMuX3JvdXRlSW5mbyhwa3QuaW5mbyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFNlY29uZGFyeSBBUEkgLSBjYWxsYmFja1xuICAgICAgICAgICAgaWYgKHRoaXMub25JbmZvTWVzc2FnZSkge1xuICAgICAgICAgICAgICB0aGlzLm9uSW5mb01lc3NhZ2UocGt0LmluZm8pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlcihcIkVSUk9SOiBVbmtub3duIHBhY2tldCByZWNlaXZlZC5cIik7XG4gICAgICAgICAgfVxuICAgICAgICB9LCAwKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBDb25uZWN0aW9uIG9wZW4sIHJlYWR5IHRvIHN0YXJ0IHNlbmRpbmcuXG4gICNjb25uZWN0aW9uT3BlbigpIHtcbiAgICBpZiAoIXRoaXMuX2V4cGlyZVByb21pc2VzKSB7XG4gICAgICAvLyBSZWplY3QgcHJvbWlzZXMgd2hpY2ggaGF2ZSBub3QgYmVlbiByZXNvbHZlZCBmb3IgdG9vIGxvbmcuXG4gICAgICB0aGlzLl9leHBpcmVQcm9taXNlcyA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgY29uc3QgZXJyID0gbmV3IEVycm9yKFwiVGltZW91dCAoNTA0KVwiKTtcbiAgICAgICAgY29uc3QgZXhwaXJlcyA9IG5ldyBEYXRlKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gQ29uc3QuRVhQSVJFX1BST01JU0VTX1RJTUVPVVQpO1xuICAgICAgICBmb3IgKGxldCBpZCBpbiB0aGlzLl9wZW5kaW5nUHJvbWlzZXMpIHtcbiAgICAgICAgICBsZXQgY2FsbGJhY2tzID0gdGhpcy5fcGVuZGluZ1Byb21pc2VzW2lkXTtcbiAgICAgICAgICBpZiAoY2FsbGJhY2tzICYmIGNhbGxiYWNrcy50cyA8IGV4cGlyZXMpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyKFwiUHJvbWlzZSBleHBpcmVkXCIsIGlkKTtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9wZW5kaW5nUHJvbWlzZXNbaWRdO1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrcy5yZWplY3QpIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2tzLnJlamVjdChlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwgQ29uc3QuRVhQSVJFX1BST01JU0VTX1BFUklPRCk7XG4gICAgfVxuICAgIHRoaXMuaGVsbG8oKTtcbiAgfVxuXG4gICNkaXNjb25uZWN0ZWQoZXJyLCBjb2RlKSB7XG4gICAgdGhpcy5faW5QYWNrZXRDb3VudCA9IDA7XG4gICAgdGhpcy5fc2VydmVySW5mbyA9IG51bGw7XG4gICAgdGhpcy5fYXV0aGVudGljYXRlZCA9IGZhbHNlO1xuXG4gICAgaWYgKHRoaXMuX2V4cGlyZVByb21pc2VzKSB7XG4gICAgICBjbGVhckludGVydmFsKHRoaXMuX2V4cGlyZVByb21pc2VzKTtcbiAgICAgIHRoaXMuX2V4cGlyZVByb21pc2VzID0gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBNYXJrIGFsbCB0b3BpY3MgYXMgdW5zdWJzY3JpYmVkXG4gICAgdGhpcy4jY2FjaGVNYXAoJ3RvcGljJywgKHRvcGljLCBrZXkpID0+IHtcbiAgICAgIHRvcGljLl9yZXNldFN1YigpO1xuICAgIH0pO1xuXG4gICAgLy8gUmVqZWN0IGFsbCBwZW5kaW5nIHByb21pc2VzXG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMuX3BlbmRpbmdQcm9taXNlcykge1xuICAgICAgY29uc3QgY2FsbGJhY2tzID0gdGhpcy5fcGVuZGluZ1Byb21pc2VzW2tleV07XG4gICAgICBpZiAoY2FsbGJhY2tzICYmIGNhbGxiYWNrcy5yZWplY3QpIHtcbiAgICAgICAgY2FsbGJhY2tzLnJlamVjdChlcnIpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLl9wZW5kaW5nUHJvbWlzZXMgPSB7fTtcblxuICAgIGlmICh0aGlzLm9uRGlzY29ubmVjdCkge1xuICAgICAgdGhpcy5vbkRpc2Nvbm5lY3QoZXJyKTtcbiAgICB9XG4gIH1cblxuICAvLyBHZXQgVXNlciBBZ2VudCBzdHJpbmdcbiAgI2dldFVzZXJBZ2VudCgpIHtcbiAgICByZXR1cm4gdGhpcy5fYXBwTmFtZSArICcgKCcgKyAodGhpcy5fYnJvd3NlciA/IHRoaXMuX2Jyb3dzZXIgKyAnOyAnIDogJycpICsgdGhpcy5faHdvcyArICcpOyAnICsgQ29uc3QuTElCUkFSWTtcbiAgfVxuXG4gIC8vIEdlbmVyYXRvciBvZiBwYWNrZXRzIHN0dWJzXG4gICNpbml0UGFja2V0KHR5cGUsIHRvcGljKSB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlICdoaSc6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ2hpJzoge1xuICAgICAgICAgICAgJ2lkJzogdGhpcy5nZXROZXh0VW5pcXVlSWQoKSxcbiAgICAgICAgICAgICd2ZXInOiBDb25zdC5WRVJTSU9OLFxuICAgICAgICAgICAgJ3VhJzogdGhpcy4jZ2V0VXNlckFnZW50KCksXG4gICAgICAgICAgICAnZGV2JzogdGhpcy5fZGV2aWNlVG9rZW4sXG4gICAgICAgICAgICAnbGFuZyc6IHRoaXMuX2h1bWFuTGFuZ3VhZ2UsXG4gICAgICAgICAgICAncGxhdGYnOiB0aGlzLl9wbGF0Zm9ybVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgY2FzZSAnYWNjJzpcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAnYWNjJzoge1xuICAgICAgICAgICAgJ2lkJzogdGhpcy5nZXROZXh0VW5pcXVlSWQoKSxcbiAgICAgICAgICAgICd1c2VyJzogbnVsbCxcbiAgICAgICAgICAgICdzY2hlbWUnOiBudWxsLFxuICAgICAgICAgICAgJ3NlY3JldCc6IG51bGwsXG4gICAgICAgICAgICAnbG9naW4nOiBmYWxzZSxcbiAgICAgICAgICAgICd0YWdzJzogbnVsbCxcbiAgICAgICAgICAgICdkZXNjJzoge30sXG4gICAgICAgICAgICAnY3JlZCc6IHt9XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICBjYXNlICdsb2dpbic6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ2xvZ2luJzoge1xuICAgICAgICAgICAgJ2lkJzogdGhpcy5nZXROZXh0VW5pcXVlSWQoKSxcbiAgICAgICAgICAgICdzY2hlbWUnOiBudWxsLFxuICAgICAgICAgICAgJ3NlY3JldCc6IG51bGxcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgIGNhc2UgJ3N1Yic6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ3N1Yic6IHtcbiAgICAgICAgICAgICdpZCc6IHRoaXMuZ2V0TmV4dFVuaXF1ZUlkKCksXG4gICAgICAgICAgICAndG9waWMnOiB0b3BpYyxcbiAgICAgICAgICAgICdzZXQnOiB7fSxcbiAgICAgICAgICAgICdnZXQnOiB7fVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgY2FzZSAnbGVhdmUnOlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICdsZWF2ZSc6IHtcbiAgICAgICAgICAgICdpZCc6IHRoaXMuZ2V0TmV4dFVuaXF1ZUlkKCksXG4gICAgICAgICAgICAndG9waWMnOiB0b3BpYyxcbiAgICAgICAgICAgICd1bnN1Yic6IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICBjYXNlICdwdWInOlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICdwdWInOiB7XG4gICAgICAgICAgICAnaWQnOiB0aGlzLmdldE5leHRVbmlxdWVJZCgpLFxuICAgICAgICAgICAgJ3RvcGljJzogdG9waWMsXG4gICAgICAgICAgICAnbm9lY2hvJzogZmFsc2UsXG4gICAgICAgICAgICAnaGVhZCc6IG51bGwsXG4gICAgICAgICAgICAnY29udGVudCc6IHt9XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICBjYXNlICdnZXQnOlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICdnZXQnOiB7XG4gICAgICAgICAgICAnaWQnOiB0aGlzLmdldE5leHRVbmlxdWVJZCgpLFxuICAgICAgICAgICAgJ3RvcGljJzogdG9waWMsXG4gICAgICAgICAgICAnd2hhdCc6IG51bGwsXG4gICAgICAgICAgICAnZGVzYyc6IHt9LFxuICAgICAgICAgICAgJ3N1Yic6IHt9LFxuICAgICAgICAgICAgJ2RhdGEnOiB7fVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgY2FzZSAnc2V0JzpcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAnc2V0Jzoge1xuICAgICAgICAgICAgJ2lkJzogdGhpcy5nZXROZXh0VW5pcXVlSWQoKSxcbiAgICAgICAgICAgICd0b3BpYyc6IHRvcGljLFxuICAgICAgICAgICAgJ2Rlc2MnOiB7fSxcbiAgICAgICAgICAgICdzdWInOiB7fSxcbiAgICAgICAgICAgICd0YWdzJzogW10sXG4gICAgICAgICAgICAnZXBoZW1lcmFsJzoge31cbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgIGNhc2UgJ2RlbCc6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ2RlbCc6IHtcbiAgICAgICAgICAgICdpZCc6IHRoaXMuZ2V0TmV4dFVuaXF1ZUlkKCksXG4gICAgICAgICAgICAndG9waWMnOiB0b3BpYyxcbiAgICAgICAgICAgICd3aGF0JzogbnVsbCxcbiAgICAgICAgICAgICdkZWxzZXEnOiBudWxsLFxuICAgICAgICAgICAgJ3VzZXInOiBudWxsLFxuICAgICAgICAgICAgJ2hhcmQnOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgY2FzZSAnbm90ZSc6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ25vdGUnOiB7XG4gICAgICAgICAgICAvLyBubyBpZCBieSBkZXNpZ24gKGV4Y2VwdCBjYWxscykuXG4gICAgICAgICAgICAndG9waWMnOiB0b3BpYyxcbiAgICAgICAgICAgICd3aGF0JzogbnVsbCwgLy8gb25lIG9mIFwicmVjdlwiLCBcInJlYWRcIiwgXCJrcFwiLCBcImNhbGxcIlxuICAgICAgICAgICAgJ3NlcSc6IHVuZGVmaW5lZCAvLyB0aGUgc2VydmVyLXNpZGUgbWVzc2FnZSBpZCBhY2tub3dsZWRnZWQgYXMgcmVjZWl2ZWQgb3IgcmVhZC5cbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5rbm93biBwYWNrZXQgdHlwZSByZXF1ZXN0ZWQ6ICR7dHlwZX1gKTtcbiAgICB9XG4gIH1cblxuICAvLyBDYWNoZSBtYW5hZ2VtZW50XG4gICNjYWNoZVB1dCh0eXBlLCBuYW1lLCBvYmopIHtcbiAgICB0aGlzLl9jYWNoZVt0eXBlICsgJzonICsgbmFtZV0gPSBvYmo7XG4gIH1cbiAgI2NhY2hlR2V0KHR5cGUsIG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fY2FjaGVbdHlwZSArICc6JyArIG5hbWVdO1xuICB9XG4gICNjYWNoZURlbCh0eXBlLCBuYW1lKSB7XG4gICAgZGVsZXRlIHRoaXMuX2NhY2hlW3R5cGUgKyAnOicgKyBuYW1lXTtcbiAgfVxuXG4gIC8vIEVudW1lcmF0ZSBhbGwgaXRlbXMgaW4gY2FjaGUsIGNhbGwgZnVuYyBmb3IgZWFjaCBpdGVtLlxuICAvLyBFbnVtZXJhdGlvbiBzdG9wcyBpZiBmdW5jIHJldHVybnMgdHJ1ZS5cbiAgI2NhY2hlTWFwKHR5cGUsIGZ1bmMsIGNvbnRleHQpIHtcbiAgICBjb25zdCBrZXkgPSB0eXBlID8gdHlwZSArICc6JyA6IHVuZGVmaW5lZDtcbiAgICBmb3IgKGxldCBpZHggaW4gdGhpcy5fY2FjaGUpIHtcbiAgICAgIGlmICgha2V5IHx8IGlkeC5pbmRleE9mKGtleSkgPT0gMCkge1xuICAgICAgICBpZiAoZnVuYy5jYWxsKGNvbnRleHQsIHRoaXMuX2NhY2hlW2lkeF0sIGlkeCkpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIE1ha2UgbGltaXRlZCBjYWNoZSBtYW5hZ2VtZW50IGF2YWlsYWJsZSB0byB0b3BpYy5cbiAgLy8gQ2FjaGluZyB1c2VyLnB1YmxpYyBvbmx5LiBFdmVyeXRoaW5nIGVsc2UgaXMgcGVyLXRvcGljLlxuICAjYXR0YWNoQ2FjaGVUb1RvcGljKHRvcGljKSB7XG4gICAgdG9waWMuX3Rpbm9kZSA9IHRoaXM7XG5cbiAgICB0b3BpYy5fY2FjaGVHZXRVc2VyID0gKHVpZCkgPT4ge1xuICAgICAgY29uc3QgcHViID0gdGhpcy4jY2FjaGVHZXQoJ3VzZXInLCB1aWQpO1xuICAgICAgaWYgKHB1Yikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHVzZXI6IHVpZCxcbiAgICAgICAgICBwdWJsaWM6IG1lcmdlT2JqKHt9LCBwdWIpXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH07XG4gICAgdG9waWMuX2NhY2hlUHV0VXNlciA9ICh1aWQsIHVzZXIpID0+IHtcbiAgICAgIHRoaXMuI2NhY2hlUHV0KCd1c2VyJywgdWlkLCBtZXJnZU9iaih7fSwgdXNlci5wdWJsaWMpKTtcbiAgICB9O1xuICAgIHRvcGljLl9jYWNoZURlbFVzZXIgPSAodWlkKSA9PiB7XG4gICAgICB0aGlzLiNjYWNoZURlbCgndXNlcicsIHVpZCk7XG4gICAgfTtcbiAgICB0b3BpYy5fY2FjaGVQdXRTZWxmID0gXyA9PiB7XG4gICAgICB0aGlzLiNjYWNoZVB1dCgndG9waWMnLCB0b3BpYy5uYW1lLCB0b3BpYyk7XG4gICAgfTtcbiAgICB0b3BpYy5fY2FjaGVEZWxTZWxmID0gXyA9PiB7XG4gICAgICB0aGlzLiNjYWNoZURlbCgndG9waWMnLCB0b3BpYy5uYW1lKTtcbiAgICB9O1xuICB9XG5cbiAgLy8gT24gc3VjY2Vzc2Z1bCBsb2dpbiBzYXZlIHNlcnZlci1wcm92aWRlZCBkYXRhLlxuICAjbG9naW5TdWNjZXNzZnVsKGN0cmwpIHtcbiAgICBpZiAoIWN0cmwucGFyYW1zIHx8ICFjdHJsLnBhcmFtcy51c2VyKSB7XG4gICAgICByZXR1cm4gY3RybDtcbiAgICB9XG4gICAgLy8gVGhpcyBpcyBhIHJlc3BvbnNlIHRvIGEgc3VjY2Vzc2Z1bCBsb2dpbixcbiAgICAvLyBleHRyYWN0IFVJRCBhbmQgc2VjdXJpdHkgdG9rZW4sIHNhdmUgaXQgaW4gVGlub2RlIG1vZHVsZVxuICAgIHRoaXMuX215VUlEID0gY3RybC5wYXJhbXMudXNlcjtcbiAgICB0aGlzLl9hdXRoZW50aWNhdGVkID0gKGN0cmwgJiYgY3RybC5jb2RlID49IDIwMCAmJiBjdHJsLmNvZGUgPCAzMDApO1xuICAgIGlmIChjdHJsLnBhcmFtcyAmJiBjdHJsLnBhcmFtcy50b2tlbiAmJiBjdHJsLnBhcmFtcy5leHBpcmVzKSB7XG4gICAgICB0aGlzLl9hdXRoVG9rZW4gPSB7XG4gICAgICAgIHRva2VuOiBjdHJsLnBhcmFtcy50b2tlbixcbiAgICAgICAgZXhwaXJlczogY3RybC5wYXJhbXMuZXhwaXJlc1xuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fYXV0aFRva2VuID0gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vbkxvZ2luKSB7XG4gICAgICB0aGlzLm9uTG9naW4oY3RybC5jb2RlLCBjdHJsLnRleHQpO1xuICAgIH1cblxuICAgIHJldHVybiBjdHJsO1xuICB9XG5cbiAgLy8gU3RhdGljIG1ldGhvZHMuXG4gIC8qKlxuICAgKiBIZWxwZXIgbWV0aG9kIHRvIHBhY2thZ2UgYWNjb3VudCBjcmVkZW50aWFsLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZyB8IENyZWRlbnRpYWx9IG1ldGggLSB2YWxpZGF0aW9uIG1ldGhvZCBvciBvYmplY3Qgd2l0aCB2YWxpZGF0aW9uIGRhdGEuXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gdmFsIC0gdmFsaWRhdGlvbiB2YWx1ZSAoZS5nLiBlbWFpbCBvciBwaG9uZSBudW1iZXIpLlxuICAgKiBAcGFyYW0ge09iamVjdD19IHBhcmFtcyAtIHZhbGlkYXRpb24gcGFyYW1ldGVycy5cbiAgICogQHBhcmFtIHtzdHJpbmc9fSByZXNwIC0gdmFsaWRhdGlvbiByZXNwb25zZS5cbiAgICpcbiAgICogQHJldHVybnMge0FycmF5LjxDcmVkZW50aWFsPn0gYXJyYXkgd2l0aCBhIHNpbmdsZSBjcmVkZW50aWFsIG9yIDxjb2RlPm51bGw8L2NvZGU+IGlmIG5vIHZhbGlkIGNyZWRlbnRpYWxzIHdlcmUgZ2l2ZW4uXG4gICAqL1xuICBzdGF0aWMgY3JlZGVudGlhbChtZXRoLCB2YWwsIHBhcmFtcywgcmVzcCkge1xuICAgIGlmICh0eXBlb2YgbWV0aCA9PSAnb2JqZWN0Jykge1xuICAgICAgKHtcbiAgICAgICAgdmFsLFxuICAgICAgICBwYXJhbXMsXG4gICAgICAgIHJlc3AsXG4gICAgICAgIG1ldGhcbiAgICAgIH0gPSBtZXRoKTtcbiAgICB9XG4gICAgaWYgKG1ldGggJiYgKHZhbCB8fCByZXNwKSkge1xuICAgICAgcmV0dXJuIFt7XG4gICAgICAgICdtZXRoJzogbWV0aCxcbiAgICAgICAgJ3ZhbCc6IHZhbCxcbiAgICAgICAgJ3Jlc3AnOiByZXNwLFxuICAgICAgICAncGFyYW1zJzogcGFyYW1zXG4gICAgICB9XTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lIHRvcGljIHR5cGUgZnJvbSB0b3BpYydzIG5hbWU6IGdycCwgcDJwLCBtZSwgZm5kLCBzeXMuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gdGVzdC5cbiAgICogQHJldHVybnMge3N0cmluZ30gT25lIG9mIDxjb2RlPlwibWVcIjwvY29kZT4sIDxjb2RlPlwiZm5kXCI8L2NvZGU+LCA8Y29kZT5cInN5c1wiPC9jb2RlPiwgPGNvZGU+XCJncnBcIjwvY29kZT4sXG4gICAqICAgIDxjb2RlPlwicDJwXCI8L2NvZGU+IG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4uXG4gICAqL1xuICBzdGF0aWMgdG9waWNUeXBlKG5hbWUpIHtcbiAgICByZXR1cm4gVG9waWMudG9waWNUeXBlKG5hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhICdtZScgdG9waWMuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gdGVzdC5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBuYW1lIGlzIGEgbmFtZSBvZiBhICdtZScgdG9waWMsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBzdGF0aWMgaXNNZVRvcGljTmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIFRvcGljLmlzTWVUb3BpY05hbWUobmFtZSk7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhIGdyb3VwIHRvcGljLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIHRlc3QuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGUgbmFtZSBpcyBhIG5hbWUgb2YgYSBncm91cCB0b3BpYywgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIHN0YXRpYyBpc0dyb3VwVG9waWNOYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gVG9waWMuaXNHcm91cFRvcGljTmFtZShuYW1lKTtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIGdpdmVuIHRvcGljIG5hbWUgaXMgYSBuYW1lIG9mIGEgcDJwIHRvcGljLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIHRlc3QuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGUgbmFtZSBpcyBhIG5hbWUgb2YgYSBwMnAgdG9waWMsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBzdGF0aWMgaXNQMlBUb3BpY05hbWUobmFtZSkge1xuICAgIHJldHVybiBUb3BpYy5pc1AyUFRvcGljTmFtZShuYW1lKTtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIGdpdmVuIHRvcGljIG5hbWUgaXMgYSBuYW1lIG9mIGEgY29tbXVuaWNhdGlvbiB0b3BpYywgaS5lLiBQMlAgb3IgZ3JvdXAuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gdGVzdC5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBuYW1lIGlzIGEgbmFtZSBvZiBhIHAycCBvciBncm91cCB0b3BpYywgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIHN0YXRpYyBpc0NvbW1Ub3BpY05hbWUobmFtZSkge1xuICAgIHJldHVybiBUb3BpYy5pc0NvbW1Ub3BpY05hbWUobmFtZSk7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhIG5ldyB0b3BpYy5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSB0b3BpYyBuYW1lIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdGhlIG5hbWUgaXMgYSBuYW1lIG9mIGEgbmV3IHRvcGljLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgc3RhdGljIGlzTmV3R3JvdXBUb3BpY05hbWUobmFtZSkge1xuICAgIHJldHVybiBUb3BpYy5pc05ld0dyb3VwVG9waWNOYW1lKG5hbWUpO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgdG9waWMgbmFtZSBpcyBhIG5hbWUgb2YgYSBjaGFubmVsLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIHRvcGljIG5hbWUgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGUgbmFtZSBpcyBhIG5hbWUgb2YgYSBjaGFubmVsLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgc3RhdGljIGlzQ2hhbm5lbFRvcGljTmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIFRvcGljLmlzQ2hhbm5lbFRvcGljTmFtZShuYW1lKTtcbiAgfVxuICAvKipcbiAgICogR2V0IGluZm9ybWF0aW9uIGFib3V0IHRoZSBjdXJyZW50IHZlcnNpb24gb2YgdGhpcyBUaW5vZGUgY2xpZW50IGxpYnJhcnkuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IHNlbWFudGljIHZlcnNpb24gb2YgdGhlIGxpYnJhcnksIGUuZy4gPGNvZGU+XCIwLjE1LjUtcmMxXCI8L2NvZGU+LlxuICAgKi9cbiAgc3RhdGljIGdldFZlcnNpb24oKSB7XG4gICAgcmV0dXJuIENvbnN0LlZFUlNJT047XG4gIH1cbiAgLyoqXG4gICAqIFRvIHVzZSBUaW5vZGUgaW4gYSBub24gYnJvd3NlciBjb250ZXh0LCBzdXBwbHkgV2ViU29ja2V0IGFuZCBYTUxIdHRwUmVxdWVzdCBwcm92aWRlcnMuXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHdzUHJvdmlkZXIgPGNvZGU+V2ViU29ja2V0PC9jb2RlPiBwcm92aWRlciwgZS5nLiBmb3Igbm9kZUpTICwgPGNvZGU+cmVxdWlyZSgnd3MnKTwvY29kZT4uXG4gICAqIEBwYXJhbSB4aHJQcm92aWRlciA8Y29kZT5YTUxIdHRwUmVxdWVzdDwvY29kZT4gcHJvdmlkZXIsIGUuZy4gZm9yIG5vZGUgPGNvZGU+cmVxdWlyZSgneGhyJyk8L2NvZGU+LlxuICAgKi9cbiAgc3RhdGljIHNldE5ldHdvcmtQcm92aWRlcnMod3NQcm92aWRlciwgeGhyUHJvdmlkZXIpIHtcbiAgICBXZWJTb2NrZXRQcm92aWRlciA9IHdzUHJvdmlkZXI7XG4gICAgWEhSUHJvdmlkZXIgPSB4aHJQcm92aWRlcjtcblxuICAgIENvbm5lY3Rpb24uc2V0TmV0d29ya1Byb3ZpZGVycyhXZWJTb2NrZXRQcm92aWRlciwgWEhSUHJvdmlkZXIpO1xuICAgIExhcmdlRmlsZUhlbHBlci5zZXROZXR3b3JrUHJvdmlkZXIoWEhSUHJvdmlkZXIpO1xuICB9XG4gIC8qKlxuICAgKiBUbyB1c2UgVGlub2RlIGluIGEgbm9uIGJyb3dzZXIgY29udGV4dCwgc3VwcGx5IDxjb2RlPmluZGV4ZWREQjwvY29kZT4gcHJvdmlkZXIuXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIGlkYlByb3ZpZGVyIDxjb2RlPmluZGV4ZWREQjwvY29kZT4gcHJvdmlkZXIsIGUuZy4gZm9yIG5vZGVKUyAsIDxjb2RlPnJlcXVpcmUoJ2Zha2UtaW5kZXhlZGRiJyk8L2NvZGU+LlxuICAgKi9cbiAgc3RhdGljIHNldERhdGFiYXNlUHJvdmlkZXIoaWRiUHJvdmlkZXIpIHtcbiAgICBJbmRleGVkREJQcm92aWRlciA9IGlkYlByb3ZpZGVyO1xuXG4gICAgREJDYWNoZS5zZXREYXRhYmFzZVByb3ZpZGVyKEluZGV4ZWREQlByb3ZpZGVyKTtcbiAgfVxuICAvKipcbiAgICogUmV0dXJuIGluZm9ybWF0aW9uIGFib3V0IHRoZSBjdXJyZW50IG5hbWUgYW5kIHZlcnNpb24gb2YgdGhpcyBUaW5vZGUgbGlicmFyeS5cbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSB0aGUgbmFtZSBvZiB0aGUgbGlicmFyeSBhbmQgaXQncyB2ZXJzaW9uLlxuICAgKi9cbiAgc3RhdGljIGdldExpYnJhcnkoKSB7XG4gICAgcmV0dXJuIENvbnN0LkxJQlJBUlk7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiBzdHJpbmcgcmVwcmVzZW50cyA8Y29kZT5OVUxMPC9jb2RlPiB2YWx1ZSBhcyBkZWZpbmVkIGJ5IFRpbm9kZSAoPGNvZGU+J1xcdTI0MjEnPC9jb2RlPikuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgLSBzdHJpbmcgdG8gY2hlY2sgZm9yIDxjb2RlPk5VTEw8L2NvZGU+IHZhbHVlLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgc3RyaW5nIHJlcHJlc2VudHMgPGNvZGU+TlVMTDwvY29kZT4gdmFsdWUsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBzdGF0aWMgaXNOdWxsVmFsdWUoc3RyKSB7XG4gICAgcmV0dXJuIHN0ciA9PT0gQ29uc3QuREVMX0NIQVI7XG4gIH1cblxuICAvLyBJbnN0YW5jZSBtZXRob2RzLlxuXG4gIC8vIEdlbmVyYXRlcyB1bmlxdWUgbWVzc2FnZSBJRHNcbiAgZ2V0TmV4dFVuaXF1ZUlkKCkge1xuICAgIHJldHVybiAodGhpcy5fbWVzc2FnZUlkICE9IDApID8gJycgKyB0aGlzLl9tZXNzYWdlSWQrKyA6IHVuZGVmaW5lZDtcbiAgfTtcblxuICAvKipcbiAgICogQ29ubmVjdCB0byB0aGUgc2VydmVyLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaG9zdF8gLSBuYW1lIG9mIHRoZSBob3N0IHRvIGNvbm5lY3QgdG8uXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IFByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgY29ubmVjdGlvbiBjYWxsIGNvbXBsZXRlczpcbiAgICogICAgPGNvZGU+cmVzb2x2ZSgpPC9jb2RlPiBpcyBjYWxsZWQgd2l0aG91dCBwYXJhbWV0ZXJzLCA8Y29kZT5yZWplY3QoKTwvY29kZT4gcmVjZWl2ZXMgdGhlXG4gICAqICAgIDxjb2RlPkVycm9yPC9jb2RlPiBhcyBhIHNpbmdsZSBwYXJhbWV0ZXIuXG4gICAqL1xuICBjb25uZWN0KGhvc3RfKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Nvbm5lY3Rpb24uY29ubmVjdChob3N0Xyk7XG4gIH1cblxuICAvKipcbiAgICogQXR0ZW1wdCB0byByZWNvbm5lY3QgdG8gdGhlIHNlcnZlciBpbW1lZGlhdGVseS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZvcmNlIC0gcmVjb25uZWN0IGV2ZW4gaWYgdGhlcmUgaXMgYSBjb25uZWN0aW9uIGFscmVhZHkuXG4gICAqL1xuICByZWNvbm5lY3QoZm9yY2UpIHtcbiAgICB0aGlzLl9jb25uZWN0aW9uLnJlY29ubmVjdChmb3JjZSk7XG4gIH1cblxuICAvKipcbiAgICogRGlzY29ubmVjdCBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqL1xuICBkaXNjb25uZWN0KCkge1xuICAgIHRoaXMuX2Nvbm5lY3Rpb24uZGlzY29ubmVjdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENsZWFyIHBlcnNpc3RlbnQgY2FjaGU6IHJlbW92ZSBJbmRleGVkREIuXG4gICAqXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IFByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgb3BlcmF0aW9uIGlzIGNvbXBsZXRlZC5cbiAgICovXG4gIGNsZWFyU3RvcmFnZSgpIHtcbiAgICBpZiAodGhpcy5fZGIuaXNSZWFkeSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5fZGIuZGVsZXRlRGF0YWJhc2UoKTtcbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgcGVyc2lzdGVudCBjYWNoZTogY3JlYXRlIEluZGV4ZWREQiBjYWNoZS5cbiAgICpcbiAgICogQHJldHVybiB7UHJvbWlzZX0gUHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBvcGVyYXRpb24gaXMgY29tcGxldGVkLlxuICAgKi9cbiAgaW5pdFN0b3JhZ2UoKSB7XG4gICAgaWYgKCF0aGlzLl9kYi5pc1JlYWR5KCkpIHtcbiAgICAgIHJldHVybiB0aGlzLl9kYi5pbml0RGF0YWJhc2UoKTtcbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSBuZXR3b3JrIHByb2JlIG1lc3NhZ2UgdG8gbWFrZSBzdXJlIHRoZSBjb25uZWN0aW9uIGlzIGFsaXZlLlxuICAgKi9cbiAgbmV0d29ya1Byb2JlKCkge1xuICAgIHRoaXMuX2Nvbm5lY3Rpb24ucHJvYmUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBmb3IgbGl2ZSBjb25uZWN0aW9uIHRvIHNlcnZlci5cbiAgICpcbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZXJlIGlzIGEgbGl2ZSBjb25uZWN0aW9uLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNDb25uZWN0ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Nvbm5lY3Rpb24uaXNDb25uZWN0ZWQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBjb25uZWN0aW9uIGlzIGF1dGhlbnRpY2F0ZWQgKGxhc3QgbG9naW4gd2FzIHN1Y2Nlc3NmdWwpLlxuICAgKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgYXV0aGVudGljYXRlZCwgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIGlzQXV0aGVudGljYXRlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fYXV0aGVudGljYXRlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgQVBJIGtleSBhbmQgYXV0aCB0b2tlbiB0byB0aGUgcmVsYXRpdmUgVVJMIG1ha2luZyBpdCB1c2FibGUgZm9yIGdldHRpbmcgZGF0YVxuICAgKiBmcm9tIHRoZSBzZXJ2ZXIgaW4gYSBzaW1wbGUgPGNvZGU+SFRUUCBHRVQ8L2NvZGU+IHJlcXVlc3QuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBVUkwgLSBVUkwgdG8gd3JhcC5cbiAgICogQHJldHVybnMge3N0cmluZ30gVVJMIHdpdGggYXBwZW5kZWQgQVBJIGtleSBhbmQgdG9rZW4sIGlmIHZhbGlkIHRva2VuIGlzIHByZXNlbnQuXG4gICAqL1xuICBhdXRob3JpemVVUkwodXJsKSB7XG4gICAgaWYgKHR5cGVvZiB1cmwgIT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiB1cmw7XG4gICAgfVxuXG4gICAgaWYgKGlzVXJsUmVsYXRpdmUodXJsKSkge1xuICAgICAgLy8gRmFrZSBiYXNlIHRvIG1ha2UgdGhlIHJlbGF0aXZlIFVSTCBwYXJzZWFibGUuXG4gICAgICBjb25zdCBiYXNlID0gJ3NjaGVtZTovL2hvc3QvJztcbiAgICAgIGNvbnN0IHBhcnNlZCA9IG5ldyBVUkwodXJsLCBiYXNlKTtcbiAgICAgIGlmICh0aGlzLl9hcGlLZXkpIHtcbiAgICAgICAgcGFyc2VkLnNlYXJjaFBhcmFtcy5hcHBlbmQoJ2FwaWtleScsIHRoaXMuX2FwaUtleSk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5fYXV0aFRva2VuICYmIHRoaXMuX2F1dGhUb2tlbi50b2tlbikge1xuICAgICAgICBwYXJzZWQuc2VhcmNoUGFyYW1zLmFwcGVuZCgnYXV0aCcsICd0b2tlbicpO1xuICAgICAgICBwYXJzZWQuc2VhcmNoUGFyYW1zLmFwcGVuZCgnc2VjcmV0JywgdGhpcy5fYXV0aFRva2VuLnRva2VuKTtcbiAgICAgIH1cbiAgICAgIC8vIENvbnZlcnQgYmFjayB0byBzdHJpbmcgYW5kIHN0cmlwIGZha2UgYmFzZSBVUkwgZXhjZXB0IGZvciB0aGUgcm9vdCBzbGFzaC5cbiAgICAgIHVybCA9IHBhcnNlZC50b1N0cmluZygpLnN1YnN0cmluZyhiYXNlLmxlbmd0aCAtIDEpO1xuICAgIH1cbiAgICByZXR1cm4gdXJsO1xuICB9XG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIEFjY291bnRQYXJhbXNcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByb3BlcnR5IHtEZWZBY3M9fSBkZWZhY3MgLSBEZWZhdWx0IGFjY2VzcyBwYXJhbWV0ZXJzIGZvciB1c2VyJ3MgPGNvZGU+bWU8L2NvZGU+IHRvcGljLlxuICAgKiBAcHJvcGVydHkge09iamVjdD19IHB1YmxpYyAtIFB1YmxpYyBhcHBsaWNhdGlvbi1kZWZpbmVkIGRhdGEgZXhwb3NlZCBvbiA8Y29kZT5tZTwvY29kZT4gdG9waWMuXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0PX0gcHJpdmF0ZSAtIFByaXZhdGUgYXBwbGljYXRpb24tZGVmaW5lZCBkYXRhIGFjY2Vzc2libGUgb24gPGNvZGU+bWU8L2NvZGU+IHRvcGljLlxuICAgKiBAcHJvcGVydHkge09iamVjdD19IHRydXN0ZWQgLSBUcnVzdGVkIHVzZXIgZGF0YSB3aGljaCBjYW4gYmUgc2V0IGJ5IGEgcm9vdCB1c2VyIG9ubHkuXG4gICAqIEBwcm9wZXJ0eSB7QXJyYXkuPHN0cmluZz59IHRhZ3MgLSBhcnJheSBvZiBzdHJpbmcgdGFncyBmb3IgdXNlciBkaXNjb3ZlcnkuXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nPX0gdG9rZW4gLSBhdXRoZW50aWNhdGlvbiB0b2tlbiB0byB1c2UuXG4gICAqIEBwcm9wZXJ0eSB7QXJyYXkuPHN0cmluZz49fSBhdHRhY2htZW50cyAtIEFycmF5IG9mIHJlZmVyZW5jZXMgdG8gb3V0IG9mIGJhbmQgYXR0YWNobWVudHMgdXNlZCBpbiBhY2NvdW50IGRlc2NyaXB0aW9uLlxuICAgKi9cbiAgLyoqXG4gICAqIEB0eXBlZGVmIERlZkFjc1xuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJvcGVydHkge3N0cmluZz19IGF1dGggLSBBY2Nlc3MgbW9kZSBmb3IgPGNvZGU+bWU8L2NvZGU+IGZvciBhdXRoZW50aWNhdGVkIHVzZXJzLlxuICAgKiBAcHJvcGVydHkge3N0cmluZz19IGFub24gLSBBY2Nlc3MgbW9kZSBmb3IgPGNvZGU+bWU8L2NvZGU+IGZvciBhbm9ueW1vdXMgdXNlcnMuXG4gICAqL1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgb3IgdXBkYXRlIGFuIGFjY291bnQuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBVc2VyIGlkIHRvIHVwZGF0ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2NoZW1lIC0gQXV0aGVudGljYXRpb24gc2NoZW1lOyA8Y29kZT5cImJhc2ljXCI8L2NvZGU+IGFuZCA8Y29kZT5cImFub255bW91c1wiPC9jb2RlPiBhcmUgdGhlIGN1cnJlbnRseSBzdXBwb3J0ZWQgc2NoZW1lcy5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHNlY3JldCAtIEF1dGhlbnRpY2F0aW9uIHNlY3JldCwgYXNzdW1lZCB0byBiZSBhbHJlYWR5IGJhc2U2NCBlbmNvZGVkLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBsb2dpbiAtIFVzZSBuZXcgYWNjb3VudCB0byBhdXRoZW50aWNhdGUgY3VycmVudCBzZXNzaW9uXG4gICAqIEBwYXJhbSB7QWNjb3VudFBhcmFtcz19IHBhcmFtcyAtIFVzZXIgZGF0YSB0byBwYXNzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiBzZXJ2ZXIgcmVwbHkgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICBhY2NvdW50KHVpZCwgc2NoZW1lLCBzZWNyZXQsIGxvZ2luLCBwYXJhbXMpIHtcbiAgICBjb25zdCBwa3QgPSB0aGlzLiNpbml0UGFja2V0KCdhY2MnKTtcbiAgICBwa3QuYWNjLnVzZXIgPSB1aWQ7XG4gICAgcGt0LmFjYy5zY2hlbWUgPSBzY2hlbWU7XG4gICAgcGt0LmFjYy5zZWNyZXQgPSBzZWNyZXQ7XG4gICAgLy8gTG9nIGluIHRvIHRoZSBuZXcgYWNjb3VudCB1c2luZyBzZWxlY3RlZCBzY2hlbWVcbiAgICBwa3QuYWNjLmxvZ2luID0gbG9naW47XG5cbiAgICBpZiAocGFyYW1zKSB7XG4gICAgICBwa3QuYWNjLmRlc2MuZGVmYWNzID0gcGFyYW1zLmRlZmFjcztcbiAgICAgIHBrdC5hY2MuZGVzYy5wdWJsaWMgPSBwYXJhbXMucHVibGljO1xuICAgICAgcGt0LmFjYy5kZXNjLnByaXZhdGUgPSBwYXJhbXMucHJpdmF0ZTtcbiAgICAgIHBrdC5hY2MuZGVzYy50cnVzdGVkID0gcGFyYW1zLnRydXN0ZWQ7XG5cbiAgICAgIHBrdC5hY2MudGFncyA9IHBhcmFtcy50YWdzO1xuICAgICAgcGt0LmFjYy5jcmVkID0gcGFyYW1zLmNyZWQ7XG5cbiAgICAgIHBrdC5hY2MudG9rZW4gPSBwYXJhbXMudG9rZW47XG5cbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHBhcmFtcy5hdHRhY2htZW50cykgJiYgcGFyYW1zLmF0dGFjaG1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcGt0LmV4dHJhID0ge1xuICAgICAgICAgIGF0dGFjaG1lbnRzOiBwYXJhbXMuYXR0YWNobWVudHMuZmlsdGVyKHJlZiA9PiBpc1VybFJlbGF0aXZlKHJlZikpXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuI3NlbmQocGt0LCBwa3QuYWNjLmlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgdXNlci4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNhY2NvdW50fS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNjaGVtZSAtIEF1dGhlbnRpY2F0aW9uIHNjaGVtZTsgPGNvZGU+XCJiYXNpY1wiPC9jb2RlPiBpcyB0aGUgb25seSBjdXJyZW50bHkgc3VwcG9ydGVkIHNjaGVtZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHNlY3JldCAtIEF1dGhlbnRpY2F0aW9uLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBsb2dpbiAtIFVzZSBuZXcgYWNjb3VudCB0byBhdXRoZW50aWNhdGUgY3VycmVudCBzZXNzaW9uXG4gICAqIEBwYXJhbSB7QWNjb3VudFBhcmFtcz19IHBhcmFtcyAtIFVzZXIgZGF0YSB0byBwYXNzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiBzZXJ2ZXIgcmVwbHkgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICBjcmVhdGVBY2NvdW50KHNjaGVtZSwgc2VjcmV0LCBsb2dpbiwgcGFyYW1zKSB7XG4gICAgbGV0IHByb21pc2UgPSB0aGlzLmFjY291bnQoQ29uc3QuVVNFUl9ORVcsIHNjaGVtZSwgc2VjcmV0LCBsb2dpbiwgcGFyYW1zKTtcbiAgICBpZiAobG9naW4pIHtcbiAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKGN0cmwpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI2xvZ2luU3VjY2Vzc2Z1bChjdHJsKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgdXNlciB3aXRoIDxjb2RlPidiYXNpYyc8L2NvZGU+IGF1dGhlbnRpY2F0aW9uIHNjaGVtZSBhbmQgaW1tZWRpYXRlbHlcbiAgICogdXNlIGl0IGZvciBhdXRoZW50aWNhdGlvbi4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNhY2NvdW50fS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVzZXJuYW1lIC0gTG9naW4gdG8gdXNlIGZvciB0aGUgbmV3IGFjY291bnQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXNzd29yZCAtIFVzZXIncyBwYXNzd29yZC5cbiAgICogQHBhcmFtIHtBY2NvdW50UGFyYW1zPX0gcGFyYW1zIC0gVXNlciBkYXRhIHRvIHBhc3MgdG8gdGhlIHNlcnZlci5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHNlcnZlciByZXBseSBpcyByZWNlaXZlZC5cbiAgICovXG4gIGNyZWF0ZUFjY291bnRCYXNpYyh1c2VybmFtZSwgcGFzc3dvcmQsIHBhcmFtcykge1xuICAgIC8vIE1ha2Ugc3VyZSB3ZSBhcmUgbm90IHVzaW5nICdudWxsJyBvciAndW5kZWZpbmVkJztcbiAgICB1c2VybmFtZSA9IHVzZXJuYW1lIHx8ICcnO1xuICAgIHBhc3N3b3JkID0gcGFzc3dvcmQgfHwgJyc7XG4gICAgcmV0dXJuIHRoaXMuY3JlYXRlQWNjb3VudCgnYmFzaWMnLFxuICAgICAgYjY0RW5jb2RlVW5pY29kZSh1c2VybmFtZSArICc6JyArIHBhc3N3b3JkKSwgdHJ1ZSwgcGFyYW1zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgdXNlcidzIGNyZWRlbnRpYWxzIGZvciA8Y29kZT4nYmFzaWMnPC9jb2RlPiBhdXRoZW50aWNhdGlvbiBzY2hlbWUuIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjYWNjb3VudH0uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBVc2VyIElEIHRvIHVwZGF0ZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHVzZXJuYW1lIC0gTG9naW4gdG8gdXNlIGZvciB0aGUgbmV3IGFjY291bnQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXNzd29yZCAtIFVzZXIncyBwYXNzd29yZC5cbiAgICogQHBhcmFtIHtBY2NvdW50UGFyYW1zPX0gcGFyYW1zIC0gZGF0YSB0byBwYXNzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiBzZXJ2ZXIgcmVwbHkgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICB1cGRhdGVBY2NvdW50QmFzaWModWlkLCB1c2VybmFtZSwgcGFzc3dvcmQsIHBhcmFtcykge1xuICAgIC8vIE1ha2Ugc3VyZSB3ZSBhcmUgbm90IHVzaW5nICdudWxsJyBvciAndW5kZWZpbmVkJztcbiAgICB1c2VybmFtZSA9IHVzZXJuYW1lIHx8ICcnO1xuICAgIHBhc3N3b3JkID0gcGFzc3dvcmQgfHwgJyc7XG4gICAgcmV0dXJuIHRoaXMuYWNjb3VudCh1aWQsICdiYXNpYycsXG4gICAgICBiNjRFbmNvZGVVbmljb2RlKHVzZXJuYW1lICsgJzonICsgcGFzc3dvcmQpLCBmYWxzZSwgcGFyYW1zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIGhhbmRzaGFrZSB0byB0aGUgc2VydmVyLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gc2VydmVyIHJlcGx5IGlzIHJlY2VpdmVkLlxuICAgKi9cbiAgaGVsbG8oKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnaGknKTtcblxuICAgIHJldHVybiB0aGlzLiNzZW5kKHBrdCwgcGt0LmhpLmlkKVxuICAgICAgLnRoZW4oKGN0cmwpID0+IHtcbiAgICAgICAgLy8gUmVzZXQgYmFja29mZiBjb3VudGVyIG9uIHN1Y2Nlc3NmdWwgY29ubmVjdGlvbi5cbiAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5iYWNrb2ZmUmVzZXQoKTtcblxuICAgICAgICAvLyBTZXJ2ZXIgcmVzcG9uc2UgY29udGFpbnMgc2VydmVyIHByb3RvY29sIHZlcnNpb24sIGJ1aWxkLCBjb25zdHJhaW50cyxcbiAgICAgICAgLy8gc2Vzc2lvbiBJRCBmb3IgbG9uZyBwb2xsaW5nLiBTYXZlIHRoZW0uXG4gICAgICAgIGlmIChjdHJsLnBhcmFtcykge1xuICAgICAgICAgIHRoaXMuX3NlcnZlckluZm8gPSBjdHJsLnBhcmFtcztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm9uQ29ubmVjdCkge1xuICAgICAgICAgIHRoaXMub25Db25uZWN0KCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY3RybDtcbiAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5yZWNvbm5lY3QodHJ1ZSk7XG5cbiAgICAgICAgaWYgKHRoaXMub25EaXNjb25uZWN0KSB7XG4gICAgICAgICAgdGhpcy5vbkRpc2Nvbm5lY3QoZXJyKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogU2V0IG9yIHJlZnJlc2ggdGhlIHB1c2ggbm90aWZpY2F0aW9ucy9kZXZpY2UgdG9rZW4uIElmIHRoZSBjbGllbnQgaXMgY29ubmVjdGVkLFxuICAgKiB0aGUgZGV2aWNlVG9rZW4gY2FuIGJlIHNlbnQgdG8gdGhlIHNlcnZlci5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGR0IC0gdG9rZW4gb2J0YWluZWQgZnJvbSB0aGUgcHJvdmlkZXIgb3IgPGNvZGU+ZmFsc2U8L2NvZGU+LFxuICAgKiAgICA8Y29kZT5udWxsPC9jb2RlPiBvciA8Y29kZT51bmRlZmluZWQ8L2NvZGU+IHRvIGNsZWFyIHRoZSB0b2tlbi5cbiAgICpcbiAgICogQHJldHVybnMgPGNvZGU+dHJ1ZTwvY29kZT4gaWYgYXR0ZW1wdCB3YXMgbWFkZSB0byBzZW5kIHRoZSB1cGRhdGUgdG8gdGhlIHNlcnZlci5cbiAgICovXG4gIHNldERldmljZVRva2VuKGR0KSB7XG4gICAgbGV0IHNlbnQgPSBmYWxzZTtcbiAgICAvLyBDb252ZXJ0IGFueSBmYWxzaXNoIHZhbHVlIHRvIG51bGwuXG4gICAgZHQgPSBkdCB8fCBudWxsO1xuICAgIGlmIChkdCAhPSB0aGlzLl9kZXZpY2VUb2tlbikge1xuICAgICAgdGhpcy5fZGV2aWNlVG9rZW4gPSBkdDtcbiAgICAgIGlmICh0aGlzLmlzQ29ubmVjdGVkKCkgJiYgdGhpcy5pc0F1dGhlbnRpY2F0ZWQoKSkge1xuICAgICAgICB0aGlzLiNzZW5kKHtcbiAgICAgICAgICAnaGknOiB7XG4gICAgICAgICAgICAnZGV2JzogZHQgfHwgVGlub2RlLkRFTF9DSEFSXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgc2VudCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIENyZWRlbnRpYWxcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IG1ldGggLSB2YWxpZGF0aW9uIG1ldGhvZC5cbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IHZhbCAtIHZhbHVlIHRvIHZhbGlkYXRlIChlLmcuIGVtYWlsIG9yIHBob25lIG51bWJlcikuXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSByZXNwIC0gdmFsaWRhdGlvbiByZXNwb25zZS5cbiAgICogQHByb3BlcnR5IHtPYmplY3R9IHBhcmFtcyAtIHZhbGlkYXRpb24gcGFyYW1ldGVycy5cbiAgICovXG4gIC8qKlxuICAgKiBBdXRoZW50aWNhdGUgY3VycmVudCBzZXNzaW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2NoZW1lIC0gQXV0aGVudGljYXRpb24gc2NoZW1lOyA8Y29kZT5cImJhc2ljXCI8L2NvZGU+IGlzIHRoZSBvbmx5IGN1cnJlbnRseSBzdXBwb3J0ZWQgc2NoZW1lLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2VjcmV0IC0gQXV0aGVudGljYXRpb24gc2VjcmV0LCBhc3N1bWVkIHRvIGJlIGFscmVhZHkgYmFzZTY0IGVuY29kZWQuXG4gICAqIEBwYXJhbSB7Q3JlZGVudGlhbD19IGNyZWQgLSBjcmVkZW50aWFsIGNvbmZpcm1hdGlvbiwgaWYgcmVxdWlyZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiBzZXJ2ZXIgcmVwbHkgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICBsb2dpbihzY2hlbWUsIHNlY3JldCwgY3JlZCkge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ2xvZ2luJyk7XG4gICAgcGt0LmxvZ2luLnNjaGVtZSA9IHNjaGVtZTtcbiAgICBwa3QubG9naW4uc2VjcmV0ID0gc2VjcmV0O1xuICAgIHBrdC5sb2dpbi5jcmVkID0gY3JlZDtcblxuICAgIHJldHVybiB0aGlzLiNzZW5kKHBrdCwgcGt0LmxvZ2luLmlkKVxuICAgICAgLnRoZW4oKGN0cmwpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI2xvZ2luU3VjY2Vzc2Z1bChjdHJsKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjbG9naW59IHdpdGggYmFzaWMgYXV0aGVudGljYXRpb25cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVuYW1lIC0gVXNlciBuYW1lLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGFzc3dvcmQgIC0gUGFzc3dvcmQuXG4gICAqIEBwYXJhbSB7Q3JlZGVudGlhbD19IGNyZWQgLSBjcmVkZW50aWFsIGNvbmZpcm1hdGlvbiwgaWYgcmVxdWlyZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIGxvZ2luQmFzaWModW5hbWUsIHBhc3N3b3JkLCBjcmVkKSB7XG4gICAgcmV0dXJuIHRoaXMubG9naW4oJ2Jhc2ljJywgYjY0RW5jb2RlVW5pY29kZSh1bmFtZSArICc6JyArIHBhc3N3b3JkKSwgY3JlZClcbiAgICAgIC50aGVuKChjdHJsKSA9PiB7XG4gICAgICAgIHRoaXMuX2xvZ2luID0gdW5hbWU7XG4gICAgICAgIHJldHVybiBjdHJsO1xuICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNsb2dpbn0gd2l0aCB0b2tlbiBhdXRoZW50aWNhdGlvblxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9rZW4gLSBUb2tlbiByZWNlaXZlZCBpbiByZXNwb25zZSB0byBlYXJsaWVyIGxvZ2luLlxuICAgKiBAcGFyYW0ge0NyZWRlbnRpYWw9fSBjcmVkIC0gY3JlZGVudGlhbCBjb25maXJtYXRpb24sIGlmIHJlcXVpcmVkLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICBsb2dpblRva2VuKHRva2VuLCBjcmVkKSB7XG4gICAgcmV0dXJuIHRoaXMubG9naW4oJ3Rva2VuJywgdG9rZW4sIGNyZWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSByZXF1ZXN0IGZvciByZXNldHRpbmcgYW4gYXV0aGVudGljYXRpb24gc2VjcmV0LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2NoZW1lIC0gYXV0aGVudGljYXRpb24gc2NoZW1lIHRvIHJlc2V0LlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kIC0gbWV0aG9kIHRvIHVzZSBmb3IgcmVzZXR0aW5nIHRoZSBzZWNyZXQsIHN1Y2ggYXMgXCJlbWFpbFwiIG9yIFwidGVsXCIuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIHZhbHVlIG9mIHRoZSBjcmVkZW50aWFsIHRvIHVzZSwgYSBzcGVjaWZpYyBlbWFpbCBhZGRyZXNzIG9yIGEgcGhvbmUgbnVtYmVyLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyB0aGUgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgcmVxdWVzdFJlc2V0QXV0aFNlY3JldChzY2hlbWUsIG1ldGhvZCwgdmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5sb2dpbigncmVzZXQnLCBiNjRFbmNvZGVVbmljb2RlKHNjaGVtZSArICc6JyArIG1ldGhvZCArICc6JyArIHZhbHVlKSk7XG4gIH1cblxuICAvKipcbiAgICogQHR5cGVkZWYgQXV0aFRva2VuXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB0b2tlbiAtIFRva2VuIHZhbHVlLlxuICAgKiBAcHJvcGVydHkge0RhdGV9IGV4cGlyZXMgLSBUb2tlbiBleHBpcmF0aW9uIHRpbWUuXG4gICAqL1xuICAvKipcbiAgICogR2V0IHN0b3JlZCBhdXRoZW50aWNhdGlvbiB0b2tlbi5cbiAgICpcbiAgICogQHJldHVybnMge0F1dGhUb2tlbn0gYXV0aGVudGljYXRpb24gdG9rZW4uXG4gICAqL1xuICBnZXRBdXRoVG9rZW4oKSB7XG4gICAgaWYgKHRoaXMuX2F1dGhUb2tlbiAmJiAodGhpcy5fYXV0aFRva2VuLmV4cGlyZXMuZ2V0VGltZSgpID4gRGF0ZS5ub3coKSkpIHtcbiAgICAgIHJldHVybiB0aGlzLl9hdXRoVG9rZW47XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2F1dGhUb2tlbiA9IG51bGw7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGxpY2F0aW9uIG1heSBwcm92aWRlIGEgc2F2ZWQgYXV0aGVudGljYXRpb24gdG9rZW4uXG4gICAqXG4gICAqIEBwYXJhbSB7QXV0aFRva2VufSB0b2tlbiAtIGF1dGhlbnRpY2F0aW9uIHRva2VuLlxuICAgKi9cbiAgc2V0QXV0aFRva2VuKHRva2VuKSB7XG4gICAgdGhpcy5fYXV0aFRva2VuID0gdG9rZW47XG4gIH1cblxuICAvKipcbiAgICogQHR5cGVkZWYgU2V0UGFyYW1zXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcm9wZXJ0eSB7U2V0RGVzYz19IGRlc2MgLSBUb3BpYyBpbml0aWFsaXphdGlvbiBwYXJhbWV0ZXJzIHdoZW4gY3JlYXRpbmcgYSBuZXcgdG9waWMgb3IgYSBuZXcgc3Vic2NyaXB0aW9uLlxuICAgKiBAcHJvcGVydHkge1NldFN1Yj19IHN1YiAtIFN1YnNjcmlwdGlvbiBpbml0aWFsaXphdGlvbiBwYXJhbWV0ZXJzLlxuICAgKiBAcHJvcGVydHkge0FycmF5LjxzdHJpbmc+PX0gYXR0YWNobWVudHMgLSBVUkxzIG9mIG91dCBvZiBiYW5kIGF0dGFjaG1lbnRzIHVzZWQgaW4gcGFyYW1ldGVycy5cbiAgICovXG4gIC8qKlxuICAgKiBAdHlwZWRlZiBTZXREZXNjXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcm9wZXJ0eSB7RGVmQWNzPX0gZGVmYWNzIC0gRGVmYXVsdCBhY2Nlc3MgbW9kZS5cbiAgICogQHByb3BlcnR5IHtPYmplY3Q9fSBwdWJsaWMgLSBGcmVlLWZvcm0gdG9waWMgZGVzY3JpcHRpb24sIHB1YmxpY2FsbHkgYWNjZXNzaWJsZS5cbiAgICogQHByb3BlcnR5IHtPYmplY3Q9fSBwcml2YXRlIC0gRnJlZS1mb3JtIHRvcGljIGRlc2NyaXB0aW9uIGFjY2Vzc2libGUgb25seSB0byB0aGUgb3duZXIuXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0PX0gdHJ1c3RlZCAtIFRydXN0ZWQgdXNlciBkYXRhIHdoaWNoIGNhbiBiZSBzZXQgYnkgYSByb290IHVzZXIgb25seS5cbiAgICovXG4gIC8qKlxuICAgKiBAdHlwZWRlZiBTZXRTdWJcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByb3BlcnR5IHtzdHJpbmc9fSB1c2VyIC0gVUlEIG9mIHRoZSB1c2VyIGFmZmVjdGVkIGJ5IHRoZSByZXF1ZXN0LiBEZWZhdWx0IChlbXB0eSkgLSBjdXJyZW50IHVzZXIuXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nPX0gbW9kZSAtIFVzZXIgYWNjZXNzIG1vZGUsIGVpdGhlciByZXF1ZXN0ZWQgb3IgYXNzaWduZWQgZGVwZW5kZW50IG9uIGNvbnRleHQuXG4gICAqL1xuICAvKipcbiAgICogU2VuZCBhIHRvcGljIHN1YnNjcmlwdGlvbiByZXF1ZXN0LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWMgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byBzdWJzY3JpYmUgdG8uXG4gICAqIEBwYXJhbSB7R2V0UXVlcnk9fSBnZXRQYXJhbXMgLSBPcHRpb25hbCBzdWJzY3JpcHRpb24gbWV0YWRhdGEgcXVlcnlcbiAgICogQHBhcmFtIHtTZXRQYXJhbXM9fSBzZXRQYXJhbXMgLSBPcHRpb25hbCBpbml0aWFsaXphdGlvbiBwYXJhbWV0ZXJzXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIHN1YnNjcmliZSh0b3BpY05hbWUsIGdldFBhcmFtcywgc2V0UGFyYW1zKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnc3ViJywgdG9waWNOYW1lKVxuICAgIGlmICghdG9waWNOYW1lKSB7XG4gICAgICB0b3BpY05hbWUgPSBDb25zdC5UT1BJQ19ORVc7XG4gICAgfVxuXG4gICAgcGt0LnN1Yi5nZXQgPSBnZXRQYXJhbXM7XG5cbiAgICBpZiAoc2V0UGFyYW1zKSB7XG4gICAgICBpZiAoc2V0UGFyYW1zLnN1Yikge1xuICAgICAgICBwa3Quc3ViLnNldC5zdWIgPSBzZXRQYXJhbXMuc3ViO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2V0UGFyYW1zLmRlc2MpIHtcbiAgICAgICAgY29uc3QgZGVzYyA9IHNldFBhcmFtcy5kZXNjO1xuICAgICAgICBpZiAoVGlub2RlLmlzTmV3R3JvdXBUb3BpY05hbWUodG9waWNOYW1lKSkge1xuICAgICAgICAgIC8vIEZ1bGwgc2V0LmRlc2MgcGFyYW1zIGFyZSB1c2VkIGZvciBuZXcgdG9waWNzIG9ubHlcbiAgICAgICAgICBwa3Quc3ViLnNldC5kZXNjID0gZGVzYztcbiAgICAgICAgfSBlbHNlIGlmIChUaW5vZGUuaXNQMlBUb3BpY05hbWUodG9waWNOYW1lKSAmJiBkZXNjLmRlZmFjcykge1xuICAgICAgICAgIC8vIFVzZSBvcHRpb25hbCBkZWZhdWx0IHBlcm1pc3Npb25zIG9ubHkuXG4gICAgICAgICAgcGt0LnN1Yi5zZXQuZGVzYyA9IHtcbiAgICAgICAgICAgIGRlZmFjczogZGVzYy5kZWZhY3NcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFNlZSBpZiBleHRlcm5hbCBvYmplY3RzIHdlcmUgdXNlZCBpbiB0b3BpYyBkZXNjcmlwdGlvbi5cbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHNldFBhcmFtcy5hdHRhY2htZW50cykgJiYgc2V0UGFyYW1zLmF0dGFjaG1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcGt0LmV4dHJhID0ge1xuICAgICAgICAgIGF0dGFjaG1lbnRzOiBzZXRQYXJhbXMuYXR0YWNobWVudHMuZmlsdGVyKHJlZiA9PiBpc1VybFJlbGF0aXZlKHJlZikpXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGlmIChzZXRQYXJhbXMudGFncykge1xuICAgICAgICBwa3Quc3ViLnNldC50YWdzID0gc2V0UGFyYW1zLnRhZ3M7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLiNzZW5kKHBrdCwgcGt0LnN1Yi5pZCk7XG4gIH1cblxuICAvKipcbiAgICogRGV0YWNoIGFuZCBvcHRpb25hbGx5IHVuc3Vic2NyaWJlIGZyb20gdGhlIHRvcGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpYyAtIFRvcGljIHRvIGRldGFjaCBmcm9tLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHVuc3ViIC0gSWYgPGNvZGU+dHJ1ZTwvY29kZT4sIGRldGFjaCBhbmQgdW5zdWJzY3JpYmUsIG90aGVyd2lzZSBqdXN0IGRldGFjaC5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgbGVhdmUodG9waWMsIHVuc3ViKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnbGVhdmUnLCB0b3BpYyk7XG4gICAgcGt0LmxlYXZlLnVuc3ViID0gdW5zdWI7XG5cbiAgICByZXR1cm4gdGhpcy4jc2VuZChwa3QsIHBrdC5sZWF2ZS5pZCk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIG1lc3NhZ2UgZHJhZnQgd2l0aG91dCBzZW5kaW5nIGl0IHRvIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpYyAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIHB1Ymxpc2ggdG8uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZW50IC0gUGF5bG9hZCB0byBwdWJsaXNoLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBub0VjaG8gLSBJZiA8Y29kZT50cnVlPC9jb2RlPiwgdGVsbCB0aGUgc2VydmVyIG5vdCB0byBlY2hvIHRoZSBtZXNzYWdlIHRvIHRoZSBvcmlnaW5hbCBzZXNzaW9uLlxuICAgKlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBuZXcgbWVzc2FnZSB3aGljaCBjYW4gYmUgc2VudCB0byB0aGUgc2VydmVyIG9yIG90aGVyd2lzZSB1c2VkLlxuICAgKi9cbiAgY3JlYXRlTWVzc2FnZSh0b3BpYywgY29udGVudCwgbm9FY2hvKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgncHViJywgdG9waWMpO1xuXG4gICAgbGV0IGRmdCA9IHR5cGVvZiBjb250ZW50ID09ICdzdHJpbmcnID8gRHJhZnR5LnBhcnNlKGNvbnRlbnQpIDogY29udGVudDtcbiAgICBpZiAoZGZ0ICYmICFEcmFmdHkuaXNQbGFpblRleHQoZGZ0KSkge1xuICAgICAgcGt0LnB1Yi5oZWFkID0ge1xuICAgICAgICBtaW1lOiBEcmFmdHkuZ2V0Q29udGVudFR5cGUoKVxuICAgICAgfTtcbiAgICAgIGNvbnRlbnQgPSBkZnQ7XG4gICAgfVxuICAgIHBrdC5wdWIubm9lY2hvID0gbm9FY2hvO1xuICAgIHBrdC5wdWIuY29udGVudCA9IGNvbnRlbnQ7XG5cbiAgICByZXR1cm4gcGt0LnB1YjtcbiAgfVxuXG4gIC8qKlxuICAgKiBQdWJsaXNoIHtkYXRhfSBtZXNzYWdlIHRvIHRvcGljLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gcHVibGlzaCB0by5cbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRlbnQgLSBQYXlsb2FkIHRvIHB1Ymxpc2guXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IG5vRWNobyAtIElmIDxjb2RlPnRydWU8L2NvZGU+LCB0ZWxsIHRoZSBzZXJ2ZXIgbm90IHRvIGVjaG8gdGhlIG1lc3NhZ2UgdG8gdGhlIG9yaWdpbmFsIHNlc3Npb24uXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIHB1Ymxpc2godG9waWNOYW1lLCBjb250ZW50LCBub0VjaG8pIHtcbiAgICByZXR1cm4gdGhpcy5wdWJsaXNoTWVzc2FnZShcbiAgICAgIHRoaXMuY3JlYXRlTWVzc2FnZSh0b3BpY05hbWUsIGNvbnRlbnQsIG5vRWNobylcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIFB1Ymxpc2ggbWVzc2FnZSB0byB0b3BpYy4gVGhlIG1lc3NhZ2Ugc2hvdWxkIGJlIGNyZWF0ZWQgYnkge0BsaW5rIFRpbm9kZSNjcmVhdGVNZXNzYWdlfS5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHB1YiAtIE1lc3NhZ2UgdG8gcHVibGlzaC5cbiAgICogQHBhcmFtIHtBcnJheS48c3RyaW5nPj19IGF0dGFjaG1lbnRzIC0gYXJyYXkgb2YgVVJMcyB3aXRoIGF0dGFjaG1lbnRzLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICBwdWJsaXNoTWVzc2FnZShwdWIsIGF0dGFjaG1lbnRzKSB7XG4gICAgLy8gTWFrZSBhIHNoYWxsb3cgY29weS4gTmVlZGVkIGluIG9yZGVyIHRvIGNsZWFyIGxvY2FsbHktYXNzaWduZWQgdGVtcCB2YWx1ZXM7XG4gICAgcHViID0gT2JqZWN0LmFzc2lnbih7fSwgcHViKTtcbiAgICBwdWIuc2VxID0gdW5kZWZpbmVkO1xuICAgIHB1Yi5mcm9tID0gdW5kZWZpbmVkO1xuICAgIHB1Yi50cyA9IHVuZGVmaW5lZDtcbiAgICBjb25zdCBtc2cgPSB7XG4gICAgICBwdWI6IHB1YixcbiAgICB9O1xuICAgIGlmIChhdHRhY2htZW50cykge1xuICAgICAgbXNnLmV4dHJhID0ge1xuICAgICAgICBhdHRhY2htZW50czogYXR0YWNobWVudHMuZmlsdGVyKHJlZiA9PiBpc1VybFJlbGF0aXZlKHJlZikpXG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy4jc2VuZChtc2csIHB1Yi5pZCk7XG4gIH1cblxuICAvKipcbiAgICogT3V0IG9mIGJhbmQgbm90aWZpY2F0aW9uOiBub3RpZnkgdG9waWMgdGhhdCBhbiBleHRlcm5hbCAocHVzaCkgbm90aWZpY2F0aW9uIHdhcyByZWNpdmVkIGJ5IHRoZSBjbGllbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhIC0gbm90aWZpY2F0aW9uIHBheWxvYWQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBkYXRhLndoYXQgLSBub3RpZmljYXRpb24gdHlwZSwgJ21zZycsICdyZWFkJywgJ3N1YicuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBkYXRhLnRvcGljIC0gbmFtZSBvZiB0aGUgdXBkYXRlZCB0b3BpYy5cbiAgICogQHBhcmFtIHtudW1iZXI9fSBkYXRhLnNlcSAtIHNlcSBJRCBvZiB0aGUgYWZmZWN0ZWQgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtzdHJpbmc9fSBkYXRhLnhmcm9tIC0gVUlEIG9mIHRoZSBzZW5kZXIuXG4gICAqIEBwYXJhbSB7b2JqZWN0PX0gZGF0YS5naXZlbiAtIG5ldyBzdWJzY3JpcHRpb24gJ2dpdmVuJywgZS5nLiAnQVNXUC4uLicuXG4gICAqIEBwYXJhbSB7b2JqZWN0PX0gZGF0YS53YW50IC0gbmV3IHN1YnNjcmlwdGlvbiAnd2FudCcsIGUuZy4gJ1JXSi4uLicuXG4gICAqL1xuICBvb2JOb3RpZmljYXRpb24oZGF0YSkge1xuICAgIHRoaXMubG9nZ2VyKFwib29iOiBcIiArICh0aGlzLl90cmltTG9uZ1N0cmluZ3MgPyBKU09OLnN0cmluZ2lmeShkYXRhLCBqc29uTG9nZ2VySGVscGVyKSA6IGRhdGEpKTtcblxuICAgIHN3aXRjaCAoZGF0YS53aGF0KSB7XG4gICAgICBjYXNlICdtc2cnOlxuICAgICAgICBpZiAoIWRhdGEuc2VxIHx8IGRhdGEuc2VxIDwgMSB8fCAhZGF0YS50b3BpYykge1xuICAgICAgICAgIC8vIFNlcnZlciBzZW50IGludmFsaWQgZGF0YS5cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5pc0Nvbm5lY3RlZCgpKSB7XG4gICAgICAgICAgLy8gTGV0J3MgaWdub3JlIHRoZSBtZXNzYWdlIGlzIHRoZXJlIGlzIG5vIGNvbm5lY3Rpb246IG5vIGNvbm5lY3Rpb24gbWVhbnMgdGhlcmUgYXJlIG5vIG9wZW5cbiAgICAgICAgICAvLyB0YWJzIHdpdGggVGlub2RlLlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdG9waWMgPSB0aGlzLiNjYWNoZUdldCgndG9waWMnLCBkYXRhLnRvcGljKTtcbiAgICAgICAgaWYgKCF0b3BpYykge1xuICAgICAgICAgIC8vIFRPRE86IGNoZWNrIGlmIHRoZXJlIGlzIGEgY2FzZSB3aGVuIGEgbWVzc2FnZSBjYW4gYXJyaXZlIGZyb20gYW4gdW5rbm93biB0b3BpYy5cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0b3BpYy5pc1N1YnNjcmliZWQoKSkge1xuICAgICAgICAgIC8vIE5vIG5lZWQgdG8gZmV0Y2g6IHRvcGljIGlzIGFscmVhZHkgc3Vic2NyaWJlZCBhbmQgZ290IGRhdGEgdGhyb3VnaCBub3JtYWwgY2hhbm5lbC5cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0b3BpYy5tYXhNc2dTZXEoKSA8IGRhdGEuc2VxKSB7XG4gICAgICAgICAgaWYgKHRvcGljLmlzQ2hhbm5lbFR5cGUoKSkge1xuICAgICAgICAgICAgdG9waWMuX3VwZGF0ZVJlY2VpdmVkKGRhdGEuc2VxLCAnZmFrZS11aWQnKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBOZXcgbWVzc2FnZS5cbiAgICAgICAgICBpZiAoZGF0YS54ZnJvbSAmJiAhdGhpcy4jY2FjaGVHZXQoJ3VzZXInLCBkYXRhLnhmcm9tKSkge1xuICAgICAgICAgICAgLy8gTWVzc2FnZSBmcm9tIHVua25vd24gc2VuZGVyLCBmZXRjaCBkZXNjcmlwdGlvbiBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAgICAgICAgICAvLyBTZW5kaW5nIGFzeW5jaHJvbm91c2x5IHdpdGhvdXQgYSBzdWJzY3JpcHRpb24uXG4gICAgICAgICAgICB0aGlzLmdldE1ldGEoZGF0YS54ZnJvbSwgbmV3IE1ldGFHZXRCdWlsZGVyKCkud2l0aERlc2MoKS5idWlsZCgpKS5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmxvZ2dlcihcIkZhaWxlZCB0byBnZXQgdGhlIG5hbWUgb2YgYSBuZXcgc2VuZGVyXCIsIGVycik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0b3BpYy5zdWJzY3JpYmUobnVsbCkudGhlbihfID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0b3BpYy5nZXRNZXRhKG5ldyBNZXRhR2V0QnVpbGRlcih0b3BpYykud2l0aExhdGVyRGF0YSgyNCkud2l0aExhdGVyRGVsKDI0KS5idWlsZCgpKTtcbiAgICAgICAgICB9KS50aGVuKF8gPT4ge1xuICAgICAgICAgICAgLy8gQWxsb3cgZGF0YSBmZXRjaCB0byBjb21wbGV0ZSBhbmQgZ2V0IHByb2Nlc3NlZCBzdWNjZXNzZnVsbHkuXG4gICAgICAgICAgICB0b3BpYy5sZWF2ZURlbGF5ZWQoZmFsc2UsIDEwMDApO1xuICAgICAgICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlcihcIk9uIHB1c2ggZGF0YSBmZXRjaCBmYWlsZWRcIiwgZXJyKTtcbiAgICAgICAgICB9KS5maW5hbGx5KF8gPT4ge1xuICAgICAgICAgICAgdGhpcy5nZXRNZVRvcGljKCkuX3JlZnJlc2hDb250YWN0KCdtc2cnLCB0b3BpYyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3JlYWQnOlxuICAgICAgICB0aGlzLmdldE1lVG9waWMoKS5fcm91dGVQcmVzKHtcbiAgICAgICAgICB3aGF0OiAncmVhZCcsXG4gICAgICAgICAgc2VxOiBkYXRhLnNlcVxuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3N1Yic6XG4gICAgICAgIGlmICghdGhpcy5pc01lKGRhdGEueGZyb20pKSB7XG4gICAgICAgICAgLy8gVE9ETzogaGFuZGxlIHVwZGF0ZXMgZnJvbSBvdGhlciB1c2Vycy5cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBtb2RlID0ge1xuICAgICAgICAgIGdpdmVuOiBkYXRhLm1vZGVHaXZlbixcbiAgICAgICAgICB3YW50OiBkYXRhLm1vZGVXYW50XG4gICAgICAgIH07XG4gICAgICAgIGxldCBhY3MgPSBuZXcgQWNjZXNzTW9kZShtb2RlKTtcbiAgICAgICAgbGV0IHByZXMgPSAoIWFjcy5tb2RlIHx8IGFjcy5tb2RlID09IEFjY2Vzc01vZGUuX05PTkUpID9cbiAgICAgICAgICAvLyBTdWJzY3JpcHRpb24gZGVsZXRlZC5cbiAgICAgICAgICB7XG4gICAgICAgICAgICB3aGF0OiAnZ29uZScsXG4gICAgICAgICAgICBzcmM6IGRhdGEudG9waWNcbiAgICAgICAgICB9IDpcbiAgICAgICAgICAvLyBOZXcgc3Vic2NyaXB0aW9uIG9yIHN1YnNjcmlwdGlvbiB1cGRhdGVkLlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHdoYXQ6ICdhY3MnLFxuICAgICAgICAgICAgc3JjOiBkYXRhLnRvcGljLFxuICAgICAgICAgICAgZGFjczogbW9kZVxuICAgICAgICAgIH07XG4gICAgICAgIHRoaXMuZ2V0TWVUb3BpYygpLl9yb3V0ZVByZXMocHJlcyk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLmxvZ2dlcihcIlVua25vd24gcHVzaCB0eXBlIGlnbm9yZWRcIiwgZGF0YS53aGF0KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHR5cGVkZWYgR2V0UXVlcnlcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByb3BlcnR5IHtHZXRPcHRzVHlwZT19IGRlc2MgLSBJZiBwcm92aWRlZCAoZXZlbiBpZiBlbXB0eSksIGZldGNoIHRvcGljIGRlc2NyaXB0aW9uLlxuICAgKiBAcHJvcGVydHkge0dldE9wdHNUeXBlPX0gc3ViIC0gSWYgcHJvdmlkZWQgKGV2ZW4gaWYgZW1wdHkpLCBmZXRjaCB0b3BpYyBzdWJzY3JpcHRpb25zLlxuICAgKiBAcHJvcGVydHkge0dldERhdGFUeXBlPX0gZGF0YSAtIElmIHByb3ZpZGVkIChldmVuIGlmIGVtcHR5KSwgZ2V0IG1lc3NhZ2VzLlxuICAgKi9cblxuICAvKipcbiAgICogQHR5cGVkZWYgR2V0T3B0c1R5cGVcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByb3BlcnR5IHtEYXRlPX0gaW1zIC0gXCJJZiBtb2RpZmllZCBzaW5jZVwiLCBmZXRjaCBkYXRhIG9ubHkgaXQgd2FzIHdhcyBtb2RpZmllZCBzaW5jZSBzdGF0ZWQgZGF0ZS5cbiAgICogQHByb3BlcnR5IHtudW1iZXI9fSBsaW1pdCAtIE1heGltdW0gbnVtYmVyIG9mIHJlc3VsdHMgdG8gcmV0dXJuLiBJZ25vcmVkIHdoZW4gcXVlcnlpbmcgdG9waWMgZGVzY3JpcHRpb24uXG4gICAqL1xuXG4gIC8qKlxuICAgKiBAdHlwZWRlZiBHZXREYXRhVHlwZVxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJvcGVydHkge251bWJlcj19IHNpbmNlIC0gTG9hZCBtZXNzYWdlcyB3aXRoIHNlcSBpZCBlcXVhbCBvciBncmVhdGVyIHRoYW4gdGhpcyB2YWx1ZS5cbiAgICogQHByb3BlcnR5IHtudW1iZXI9fSBiZWZvcmUgLSBMb2FkIG1lc3NhZ2VzIHdpdGggc2VxIGlkIGxvd2VyIHRoYW4gdGhpcyBudW1iZXIuXG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyPX0gbGltaXQgLSBNYXhpbXVtIG51bWJlciBvZiByZXN1bHRzIHRvIHJldHVybi5cbiAgICovXG5cbiAgLyoqXG4gICAqIFJlcXVlc3QgdG9waWMgbWV0YWRhdGFcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gcXVlcnkuXG4gICAqIEBwYXJhbSB7R2V0UXVlcnl9IHBhcmFtcyAtIFBhcmFtZXRlcnMgb2YgdGhlIHF1ZXJ5LiBVc2Uge0BsaW5rIFRpbm9kZS5NZXRhR2V0QnVpbGRlcn0gdG8gZ2VuZXJhdGUuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIGdldE1ldGEodG9waWMsIHBhcmFtcykge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ2dldCcsIHRvcGljKTtcblxuICAgIHBrdC5nZXQgPSBtZXJnZU9iaihwa3QuZ2V0LCBwYXJhbXMpO1xuXG4gICAgcmV0dXJuIHRoaXMuI3NlbmQocGt0LCBwa3QuZ2V0LmlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgdG9waWMncyBtZXRhZGF0YTogZGVzY3JpcHRpb24sIHN1YnNjcmlidGlvbnMuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpYyAtIFRvcGljIHRvIHVwZGF0ZS5cbiAgICogQHBhcmFtIHtTZXRQYXJhbXN9IHBhcmFtcyAtIHRvcGljIG1ldGFkYXRhIHRvIHVwZGF0ZS5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgc2V0TWV0YSh0b3BpYywgcGFyYW1zKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnc2V0JywgdG9waWMpO1xuICAgIGNvbnN0IHdoYXQgPSBbXTtcblxuICAgIGlmIChwYXJhbXMpIHtcbiAgICAgIFsnZGVzYycsICdzdWInLCAndGFncycsICdjcmVkJywgJ2VwaGVtZXJhbCddLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIGlmIChwYXJhbXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgIHdoYXQucHVzaChrZXkpO1xuICAgICAgICAgIHBrdC5zZXRba2V5XSA9IHBhcmFtc1trZXldO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkocGFyYW1zLmF0dGFjaG1lbnRzKSAmJiBwYXJhbXMuYXR0YWNobWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICBwa3QuZXh0cmEgPSB7XG4gICAgICAgICAgYXR0YWNobWVudHM6IHBhcmFtcy5hdHRhY2htZW50cy5maWx0ZXIocmVmID0+IGlzVXJsUmVsYXRpdmUocmVmKSlcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAod2hhdC5sZW5ndGggPT0gMCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkludmFsaWQge3NldH0gcGFyYW1ldGVyc1wiKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuI3NlbmQocGt0LCBwa3Quc2V0LmlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSYW5nZSBvZiBtZXNzYWdlIElEcyB0byBkZWxldGUuXG4gICAqXG4gICAqIEB0eXBlZGVmIERlbFJhbmdlXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBsb3cgLSBsb3cgZW5kIG9mIHRoZSByYW5nZSwgaW5jbHVzaXZlIChjbG9zZWQpLlxuICAgKiBAcHJvcGVydHkge251bWJlcj19IGhpIC0gaGlnaCBlbmQgb2YgdGhlIHJhbmdlLCBleGNsdXNpdmUgKG9wZW4pLlxuICAgKi9cbiAgLyoqXG4gICAqIERlbGV0ZSBzb21lIG9yIGFsbCBtZXNzYWdlcyBpbiBhIHRvcGljLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWMgLSBUb3BpYyBuYW1lIHRvIGRlbGV0ZSBtZXNzYWdlcyBmcm9tLlxuICAgKiBAcGFyYW0ge0RlbFJhbmdlW119IGxpc3QgLSBSYW5nZXMgb2YgbWVzc2FnZSBJRHMgdG8gZGVsZXRlLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBoYXJkIC0gSGFyZCBvciBzb2Z0IGRlbGV0ZVxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICBkZWxNZXNzYWdlcyh0b3BpYywgcmFuZ2VzLCBoYXJkKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnZGVsJywgdG9waWMpO1xuXG4gICAgcGt0LmRlbC53aGF0ID0gJ21zZyc7XG4gICAgcGt0LmRlbC5kZWxzZXEgPSByYW5nZXM7XG4gICAgcGt0LmRlbC5oYXJkID0gaGFyZDtcblxuICAgIHJldHVybiB0aGlzLiNzZW5kKHBrdCwgcGt0LmRlbC5pZCk7XG4gIH1cblxuICAvKipcbiAgICogRGVsZXRlIHRoZSB0b3BpYyBhbGx0b2dldGhlci4gUmVxdWlyZXMgT3duZXIgcGVybWlzc2lvbi5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIGRlbGV0ZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGhhcmQgLSBoYXJkLWRlbGV0ZSB0b3BpYy5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgZGVsVG9waWModG9waWNOYW1lLCBoYXJkKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnZGVsJywgdG9waWNOYW1lKTtcbiAgICBwa3QuZGVsLndoYXQgPSAndG9waWMnO1xuICAgIHBrdC5kZWwuaGFyZCA9IGhhcmQ7XG5cbiAgICByZXR1cm4gdGhpcy4jc2VuZChwa3QsIHBrdC5kZWwuaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlbGV0ZSBzdWJzY3JpcHRpb24uIFJlcXVpcmVzIFNoYXJlIHBlcm1pc3Npb24uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byBkZWxldGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVzZXIgLSBVc2VyIElEIHRvIHJlbW92ZS5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgZGVsU3Vic2NyaXB0aW9uKHRvcGljTmFtZSwgdXNlcikge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ2RlbCcsIHRvcGljTmFtZSk7XG4gICAgcGt0LmRlbC53aGF0ID0gJ3N1Yic7XG4gICAgcGt0LmRlbC51c2VyID0gdXNlcjtcblxuICAgIHJldHVybiB0aGlzLiNzZW5kKHBrdCwgcGt0LmRlbC5pZCk7XG4gIH1cblxuICAvKipcbiAgICogRGVsZXRlIGNyZWRlbnRpYWwuIEFsd2F5cyBzZW50IG9uIDxjb2RlPidtZSc8L2NvZGU+IHRvcGljLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kIC0gdmFsaWRhdGlvbiBtZXRob2Qgc3VjaCBhcyA8Y29kZT4nZW1haWwnPC9jb2RlPiBvciA8Y29kZT4ndGVsJzwvY29kZT4uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIHZhbGlkYXRpb24gdmFsdWUsIGkuZS4gPGNvZGU+J2FsaWNlQGV4YW1wbGUuY29tJzwvY29kZT4uXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIGRlbENyZWRlbnRpYWwobWV0aG9kLCB2YWx1ZSkge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ2RlbCcsIENvbnN0LlRPUElDX01FKTtcbiAgICBwa3QuZGVsLndoYXQgPSAnY3JlZCc7XG4gICAgcGt0LmRlbC5jcmVkID0ge1xuICAgICAgbWV0aDogbWV0aG9kLFxuICAgICAgdmFsOiB2YWx1ZVxuICAgIH07XG5cbiAgICByZXR1cm4gdGhpcy4jc2VuZChwa3QsIHBrdC5kZWwuaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcXVlc3QgdG8gZGVsZXRlIGFjY291bnQgb2YgdGhlIGN1cnJlbnQgdXNlci5cbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBoYXJkIC0gaGFyZC1kZWxldGUgdXNlci5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgZGVsQ3VycmVudFVzZXIoaGFyZCkge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ2RlbCcsIG51bGwpO1xuICAgIHBrdC5kZWwud2hhdCA9ICd1c2VyJztcbiAgICBwa3QuZGVsLmhhcmQgPSBoYXJkO1xuXG4gICAgcmV0dXJuIHRoaXMuI3NlbmQocGt0LCBwa3QuZGVsLmlkKS50aGVuKChjdHJsKSA9PiB7XG4gICAgICB0aGlzLl9teVVJRCA9IG51bGw7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogTm90aWZ5IHNlcnZlciB0aGF0IGEgbWVzc2FnZSBvciBtZXNzYWdlcyB3ZXJlIHJlYWQgb3IgcmVjZWl2ZWQuIERvZXMgTk9UIHJldHVybiBwcm9taXNlLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgd2hlcmUgdGhlIG1lc2FnZSBpcyBiZWluZyBha25vd2xlZGdlZC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHdoYXQgLSBBY3Rpb24gYmVpbmcgYWtub3dsZWRnZWQsIGVpdGhlciA8Y29kZT5cInJlYWRcIjwvY29kZT4gb3IgPGNvZGU+XCJyZWN2XCI8L2NvZGU+LlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2VxIC0gTWF4aW11bSBpZCBvZiB0aGUgbWVzc2FnZSBiZWluZyBhY2tub3dsZWRnZWQuXG4gICAqL1xuICBub3RlKHRvcGljTmFtZSwgd2hhdCwgc2VxKSB7XG4gICAgaWYgKHNlcSA8PSAwIHx8IHNlcSA+PSBDb25zdC5MT0NBTF9TRVFJRCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIG1lc3NhZ2UgaWQgJHtzZXF9YCk7XG4gICAgfVxuXG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnbm90ZScsIHRvcGljTmFtZSk7XG4gICAgcGt0Lm5vdGUud2hhdCA9IHdoYXQ7XG4gICAgcGt0Lm5vdGUuc2VxID0gc2VxO1xuICAgIHRoaXMuI3NlbmQocGt0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCcm9hZGNhc3QgYSBrZXktcHJlc3Mgbm90aWZpY2F0aW9uIHRvIHRvcGljIHN1YnNjcmliZXJzLiBVc2VkIHRvIHNob3dcbiAgICogdHlwaW5nIG5vdGlmaWNhdGlvbnMgXCJ1c2VyIFggaXMgdHlwaW5nLi4uXCIuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byBicm9hZGNhc3QgdG8uXG4gICAqL1xuICBub3RlS2V5UHJlc3ModG9waWNOYW1lKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnbm90ZScsIHRvcGljTmFtZSk7XG4gICAgcGt0Lm5vdGUud2hhdCA9ICdrcCc7XG4gICAgdGhpcy4jc2VuZChwa3QpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSB2aWRlbyBjYWxsIG5vdGlmaWNhdGlvbiB0byB0b3BpYyBzdWJzY3JpYmVycyAoaW5jbHVkaW5nIGRpYWxpbmcsXG4gICAqIGhhbmd1cCwgZXRjLikuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byBicm9hZGNhc3QgdG8uXG4gICAqIEBwYXJhbSB7aW50fSBzZXEgLSBJRCBvZiB0aGUgY2FsbCBtZXNzYWdlIHRoZSBldmVudCBwZXJ0YWlucyB0by5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2dCAtIENhbGwgZXZlbnQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXlsb2FkIC0gUGF5bG9hZCBhc3NvY2lhdGVkIHdpdGggdGhpcyBldmVudCAoZS5nLiBTRFAgc3RyaW5nKS5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgKGZvciBzb21lIGNhbGwgZXZlbnRzKSB3aGljaCB3aWxsXG4gICAqICAgICAgICAgICAgICAgICAgICBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5XG4gICAqL1xuICB2aWRlb0NhbGwodG9waWNOYW1lLCBzZXEsIGV2dCwgcGF5bG9hZCkge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ25vdGUnLCB0b3BpY05hbWUpO1xuICAgIHBrdC5ub3RlLnNlcSA9IHNlcTtcbiAgICBwa3Qubm90ZS53aGF0ID0gJ2NhbGwnO1xuICAgIHBrdC5ub3RlLmV2ZW50ID0gZXZ0O1xuICAgIHBrdC5ub3RlLnBheWxvYWQgPSBwYXlsb2FkO1xuICAgIHRoaXMuI3NlbmQocGt0LCBwa3Qubm90ZS5pZCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGEgbmFtZWQgdG9waWMsIGVpdGhlciBwdWxsIGl0IGZyb20gY2FjaGUgb3IgY3JlYXRlIGEgbmV3IGluc3RhbmNlLlxuICAgKiBUaGVyZSBpcyBhIHNpbmdsZSBpbnN0YW5jZSBvZiB0b3BpYyBmb3IgZWFjaCBuYW1lLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gZ2V0LlxuICAgKlxuICAgKiBAcmV0dXJucyB7VG9waWN9IFJlcXVlc3RlZCBvciBuZXdseSBjcmVhdGVkIHRvcGljIG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4gaWYgdG9waWMgbmFtZSBpcyBpbnZhbGlkLlxuICAgKi9cbiAgZ2V0VG9waWModG9waWNOYW1lKSB7XG4gICAgbGV0IHRvcGljID0gdGhpcy4jY2FjaGVHZXQoJ3RvcGljJywgdG9waWNOYW1lKTtcbiAgICBpZiAoIXRvcGljICYmIHRvcGljTmFtZSkge1xuICAgICAgaWYgKHRvcGljTmFtZSA9PSBDb25zdC5UT1BJQ19NRSkge1xuICAgICAgICB0b3BpYyA9IG5ldyBUb3BpY01lKCk7XG4gICAgICB9IGVsc2UgaWYgKHRvcGljTmFtZSA9PSBDb25zdC5UT1BJQ19GTkQpIHtcbiAgICAgICAgdG9waWMgPSBuZXcgVG9waWNGbmQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRvcGljID0gbmV3IFRvcGljKHRvcGljTmFtZSk7XG4gICAgICB9XG4gICAgICAvLyBDYWNoZSBtYW5hZ2VtZW50LlxuICAgICAgdGhpcy4jYXR0YWNoQ2FjaGVUb1RvcGljKHRvcGljKTtcbiAgICAgIHRvcGljLl9jYWNoZVB1dFNlbGYoKTtcbiAgICAgIC8vIERvbid0IHNhdmUgdG8gREIgaGVyZTogYSByZWNvcmQgd2lsbCBiZSBhZGRlZCB3aGVuIHRoZSB0b3BpYyBpcyBzdWJzY3JpYmVkLlxuICAgIH1cbiAgICByZXR1cm4gdG9waWM7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGEgbmFtZWQgdG9waWMgZnJvbSBjYWNoZS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIGdldC5cbiAgICpcbiAgICogQHJldHVybnMge1RvcGljfSBSZXF1ZXN0ZWQgdG9waWMgb3IgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPiBpZiB0b3BpYyBpcyBub3QgZm91bmQgaW4gY2FjaGUuXG4gICAqL1xuICBjYWNoZUdldFRvcGljKHRvcGljTmFtZSkge1xuICAgIHJldHVybiB0aGlzLiNjYWNoZUdldCgndG9waWMnLCB0b3BpY05hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBuYW1lZCB0b3BpYyBmcm9tIGNhY2hlLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gcmVtb3ZlIGZyb20gY2FjaGUuXG4gICAqL1xuICBjYWNoZVJlbVRvcGljKHRvcGljTmFtZSkge1xuICAgIHRoaXMuI2NhY2hlRGVsKCd0b3BpYycsIHRvcGljTmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogSXRlcmF0ZSBvdmVyIGNhY2hlZCB0b3BpY3MuXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgLSBjYWxsYmFjayB0byBjYWxsIGZvciBlYWNoIHRvcGljLlxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCAtICd0aGlzJyBpbnNpZGUgdGhlICdmdW5jJy5cbiAgICovXG4gIG1hcFRvcGljcyhmdW5jLCBjb250ZXh0KSB7XG4gICAgdGhpcy4jY2FjaGVNYXAoJ3RvcGljJywgZnVuYywgY29udGV4dCk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgbmFtZWQgdG9waWMgaXMgYWxyZWFkeSBwcmVzZW50IGluIGNhY2hlLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIHRvcGljIGlzIGZvdW5kIGluIGNhY2hlLCBmYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICBpc1RvcGljQ2FjaGVkKHRvcGljTmFtZSkge1xuICAgIHJldHVybiAhIXRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIHRvcGljTmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGUgdW5pcXVlIG5hbWUgbGlrZSA8Y29kZT4nbmV3MTIzNDU2JzwvY29kZT4gc3VpdGFibGUgZm9yIGNyZWF0aW5nIGEgbmV3IGdyb3VwIHRvcGljLlxuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGlzQ2hhbiAtIGlmIHRoZSB0b3BpYyBpcyBjaGFubmVsLWVuYWJsZWQuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IG5hbWUgd2hpY2ggY2FuIGJlIHVzZWQgZm9yIGNyZWF0aW5nIGEgbmV3IGdyb3VwIHRvcGljLlxuICAgKi9cbiAgbmV3R3JvdXBUb3BpY05hbWUoaXNDaGFuKSB7XG4gICAgcmV0dXJuIChpc0NoYW4gPyBDb25zdC5UT1BJQ19ORVdfQ0hBTiA6IENvbnN0LlRPUElDX05FVykgKyB0aGlzLmdldE5leHRVbmlxdWVJZCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluc3RhbnRpYXRlIDxjb2RlPidtZSc8L2NvZGU+IHRvcGljIG9yIGdldCBpdCBmcm9tIGNhY2hlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7VG9waWNNZX0gSW5zdGFuY2Ugb2YgPGNvZGU+J21lJzwvY29kZT4gdG9waWMuXG4gICAqL1xuICBnZXRNZVRvcGljKCkge1xuICAgIHJldHVybiB0aGlzLmdldFRvcGljKENvbnN0LlRPUElDX01FKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnN0YW50aWF0ZSA8Y29kZT4nZm5kJzwvY29kZT4gKGZpbmQpIHRvcGljIG9yIGdldCBpdCBmcm9tIGNhY2hlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7VG9waWN9IEluc3RhbmNlIG9mIDxjb2RlPidmbmQnPC9jb2RlPiB0b3BpYy5cbiAgICovXG4gIGdldEZuZFRvcGljKCkge1xuICAgIHJldHVybiB0aGlzLmdldFRvcGljKENvbnN0LlRPUElDX0ZORCk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IHtAbGluayBMYXJnZUZpbGVIZWxwZXJ9IGluc3RhbmNlXG4gICAqXG4gICAqIEByZXR1cm5zIHtMYXJnZUZpbGVIZWxwZXJ9IGluc3RhbmNlIG9mIGEge0BsaW5rIFRpbm9kZS5MYXJnZUZpbGVIZWxwZXJ9LlxuICAgKi9cbiAgZ2V0TGFyZ2VGaWxlSGVscGVyKCkge1xuICAgIHJldHVybiBuZXcgTGFyZ2VGaWxlSGVscGVyKHRoaXMsIENvbnN0LlBST1RPQ09MX1ZFUlNJT04pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgVUlEIG9mIHRoZSB0aGUgY3VycmVudCBhdXRoZW50aWNhdGVkIHVzZXIuXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFVJRCBvZiB0aGUgY3VycmVudCB1c2VyIG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4gaWYgdGhlIHNlc3Npb24gaXMgbm90IHlldFxuICAgKiBhdXRoZW50aWNhdGVkIG9yIGlmIHRoZXJlIGlzIG5vIHNlc3Npb24uXG4gICAqL1xuICBnZXRDdXJyZW50VXNlcklEKCkge1xuICAgIHJldHVybiB0aGlzLl9teVVJRDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgZ2l2ZW4gdXNlciBJRCBpcyBlcXVhbCB0byB0aGUgY3VycmVudCB1c2VyJ3MgVUlELlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gVUlEIHRvIGNoZWNrLlxuICAgKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGUgZ2l2ZW4gVUlEIGJlbG9uZ3MgdG8gdGhlIGN1cnJlbnQgbG9nZ2VkIGluIHVzZXIuXG4gICAqL1xuICBpc01lKHVpZCkge1xuICAgIHJldHVybiB0aGlzLl9teVVJRCA9PT0gdWlkO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBsb2dpbiB1c2VkIGZvciBsYXN0IHN1Y2Nlc3NmdWwgYXV0aGVudGljYXRpb24uXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IGxvZ2luIGxhc3QgdXNlZCBzdWNjZXNzZnVsbHkgb3IgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPi5cbiAgICovXG4gIGdldEN1cnJlbnRMb2dpbigpIHtcbiAgICByZXR1cm4gdGhpcy5fbG9naW47XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGluZm9ybWF0aW9uIGFib3V0IHRoZSBzZXJ2ZXI6IHByb3RvY29sIHZlcnNpb24gYW5kIGJ1aWxkIHRpbWVzdGFtcC5cbiAgICpcbiAgICogQHJldHVybnMge09iamVjdH0gYnVpbGQgYW5kIHZlcnNpb24gb2YgdGhlIHNlcnZlciBvciA8Y29kZT5udWxsPC9jb2RlPiBpZiB0aGVyZSBpcyBubyBjb25uZWN0aW9uIG9yXG4gICAqIGlmIHRoZSBmaXJzdCBzZXJ2ZXIgcmVzcG9uc2UgaGFzIG5vdCBiZWVuIHJlY2VpdmVkIHlldC5cbiAgICovXG4gIGdldFNlcnZlckluZm8oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NlcnZlckluZm87XG4gIH1cblxuICAvKipcbiAgICogUmVwb3J0IGEgdG9waWMgZm9yIGFidXNlLiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI3B1Ymxpc2h9LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gYWN0aW9uIC0gdGhlIG9ubHkgc3VwcG9ydGVkIGFjdGlvbiBpcyAncmVwb3J0Jy5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHRhcmdldCAtIG5hbWUgb2YgdGhlIHRvcGljIGJlaW5nIHJlcG9ydGVkLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gcmVxdWVzdC5cbiAgICovXG4gIHJlcG9ydChhY3Rpb24sIHRhcmdldCkge1xuICAgIHJldHVybiB0aGlzLnB1Ymxpc2goQ29uc3QuVE9QSUNfU1lTLCBEcmFmdHkuYXR0YWNoSlNPTihudWxsLCB7XG4gICAgICAnYWN0aW9uJzogYWN0aW9uLFxuICAgICAgJ3RhcmdldCc6IHRhcmdldFxuICAgIH0pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gc2VydmVyLXByb3ZpZGVkIGNvbmZpZ3VyYXRpb24gdmFsdWUuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIG9mIHRoZSB2YWx1ZSB0byByZXR1cm4uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkZWZhdWx0VmFsdWUgdG8gcmV0dXJuIGluIGNhc2UgdGhlIHBhcmFtZXRlciBpcyBub3Qgc2V0IG9yIG5vdCBmb3VuZC5cbiAgICpcbiAgICogQHJldHVybnMge09iamVjdH0gbmFtZWQgdmFsdWUuXG4gICAqL1xuICBnZXRTZXJ2ZXJQYXJhbShuYW1lLCBkZWZhdWx0VmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5fc2VydmVySW5mbyAmJiB0aGlzLl9zZXJ2ZXJJbmZvW25hbWVdIHx8IGRlZmF1bHRWYWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGUgY29uc29sZSBsb2dnaW5nLiBMb2dnaW5nIGlzIG9mZiBieSBkZWZhdWx0LlxuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZWQgLSBTZXQgdG8gPGNvZGU+dHJ1ZTwvY29kZT4gdG8gZW5hYmxlIGxvZ2dpbmcgdG8gY29uc29sZS5cbiAgICogQHBhcmFtIHtib29sZWFufSB0cmltTG9uZ1N0cmluZ3MgLSBTZXQgdG8gPGNvZGU+dHJ1ZTwvY29kZT4gdG8gdHJpbSBsb25nIHN0cmluZ3MuXG4gICAqL1xuICBlbmFibGVMb2dnaW5nKGVuYWJsZWQsIHRyaW1Mb25nU3RyaW5ncykge1xuICAgIHRoaXMuX2xvZ2dpbmdFbmFibGVkID0gZW5hYmxlZDtcbiAgICB0aGlzLl90cmltTG9uZ1N0cmluZ3MgPSBlbmFibGVkICYmIHRyaW1Mb25nU3RyaW5ncztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgVUkgbGFuZ3VhZ2UgdG8gcmVwb3J0IHRvIHRoZSBzZXJ2ZXIuIE11c3QgYmUgY2FsbGVkIGJlZm9yZSA8Y29kZT4naGknPC9jb2RlPiBpcyBzZW50LCBvdGhlcndpc2UgaXQgd2lsbCBub3QgYmUgdXNlZC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGhsIC0gaHVtYW4gKFVJKSBsYW5ndWFnZSwgbGlrZSA8Y29kZT5cImVuX1VTXCI8L2NvZGU+IG9yIDxjb2RlPlwiemgtSGFuc1wiPC9jb2RlPi5cbiAgICovXG4gIHNldEh1bWFuTGFuZ3VhZ2UoaGwpIHtcbiAgICBpZiAoaGwpIHtcbiAgICAgIHRoaXMuX2h1bWFuTGFuZ3VhZ2UgPSBobDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgZ2l2ZW4gdG9waWMgaXMgb25saW5lLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBvZiB0aGUgdG9waWMgdG8gdGVzdC5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdG9waWMgaXMgb25saW5lLCBmYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICBpc1RvcGljT25saW5lKG5hbWUpIHtcbiAgICBjb25zdCB0b3BpYyA9IHRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIG5hbWUpO1xuICAgIHJldHVybiB0b3BpYyAmJiB0b3BpYy5vbmxpbmU7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGFjY2VzcyBtb2RlIGZvciB0aGUgZ2l2ZW4gY29udGFjdC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgb2YgdGhlIHRvcGljIHRvIHF1ZXJ5LlxuICAgKiBAcmV0dXJucyB7QWNjZXNzTW9kZX0gYWNjZXNzIG1vZGUgaWYgdG9waWMgaXMgZm91bmQsIG51bGwgb3RoZXJ3aXNlLlxuICAgKi9cbiAgZ2V0VG9waWNBY2Nlc3NNb2RlKG5hbWUpIHtcbiAgICBjb25zdCB0b3BpYyA9IHRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIG5hbWUpO1xuICAgIHJldHVybiB0b3BpYyA/IHRvcGljLmFjcyA6IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogSW5jbHVkZSBtZXNzYWdlIElEIGludG8gYWxsIHN1YnNlcXVlc3QgbWVzc2FnZXMgdG8gc2VydmVyIGluc3RydWN0aW4gaXQgdG8gc2VuZCBha25vd2xlZGdlbWVucy5cbiAgICogUmVxdWlyZWQgZm9yIHByb21pc2VzIHRvIGZ1bmN0aW9uLiBEZWZhdWx0IGlzIDxjb2RlPlwib25cIjwvY29kZT4uXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gc3RhdHVzIC0gVHVybiBha25vd2xlZGdlbWVucyBvbiBvciBvZmYuXG4gICAqIEBkZXByZWNhdGVkXG4gICAqL1xuICB3YW50QWtuKHN0YXR1cykge1xuICAgIGlmIChzdGF0dXMpIHtcbiAgICAgIHRoaXMuX21lc3NhZ2VJZCA9IE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiAweEZGRkZGRikgKyAweEZGRkZGRik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX21lc3NhZ2VJZCA9IDA7XG4gICAgfVxuICB9XG5cbiAgLy8gQ2FsbGJhY2tzOlxuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gcmVwb3J0IHdoZW4gdGhlIHdlYnNvY2tldCBpcyBvcGVuZWQuIFRoZSBjYWxsYmFjayBoYXMgbm8gcGFyYW1ldGVycy5cbiAgICpcbiAgICogQHR5cGUge29uV2Vic29ja2V0T3Blbn1cbiAgICovXG4gIG9uV2Vic29ja2V0T3BlbiA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQHR5cGVkZWYgU2VydmVyUGFyYW1zXG4gICAqXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB2ZXIgLSBTZXJ2ZXIgdmVyc2lvblxuICAgKiBAcHJvcGVydHkge3N0cmluZ30gYnVpbGQgLSBTZXJ2ZXIgYnVpbGRcbiAgICogQHByb3BlcnR5IHtzdHJpbmc9fSBzaWQgLSBTZXNzaW9uIElELCBsb25nIHBvbGxpbmcgY29ubmVjdGlvbnMgb25seS5cbiAgICovXG5cbiAgLyoqXG4gICAqIEBjYWxsYmFjayBvbkNvbm5lY3RcbiAgICogQHBhcmFtIHtudW1iZXJ9IGNvZGUgLSBSZXN1bHQgY29kZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dCAtIFRleHQgZXB4cGxhaW5pbmcgdGhlIGNvbXBsZXRpb24sIGkuZSBcIk9LXCIgb3IgYW4gZXJyb3IgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtTZXJ2ZXJQYXJhbXN9IHBhcmFtcyAtIFBhcmFtZXRlcnMgcmV0dXJuZWQgYnkgdGhlIHNlcnZlci5cbiAgICovXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0byByZXBvcnQgd2hlbiBjb25uZWN0aW9uIHdpdGggVGlub2RlIHNlcnZlciBpcyBlc3RhYmxpc2hlZC5cbiAgICogQHR5cGUge29uQ29ubmVjdH1cbiAgICovXG4gIG9uQ29ubmVjdCA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gcmVwb3J0IHdoZW4gY29ubmVjdGlvbiBpcyBsb3N0LiBUaGUgY2FsbGJhY2sgaGFzIG5vIHBhcmFtZXRlcnMuXG4gICAqIEB0eXBlIHtvbkRpc2Nvbm5lY3R9XG4gICAqL1xuICBvbkRpc2Nvbm5lY3QgPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIEBjYWxsYmFjayBvbkxvZ2luXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBjb2RlIC0gTlVtZXJpYyBjb21wbGV0aW9uIGNvZGUsIHNhbWUgYXMgSFRUUCBzdGF0dXMgY29kZXMuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IC0gRXhwbGFuYXRpb24gb2YgdGhlIGNvbXBsZXRpb24gY29kZS5cbiAgICovXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0byByZXBvcnQgbG9naW4gY29tcGxldGlvbi5cbiAgICogQHR5cGUge29uTG9naW59XG4gICAqL1xuICBvbkxvZ2luID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0byByZWNlaXZlIDxjb2RlPntjdHJsfTwvY29kZT4gKGNvbnRyb2wpIG1lc3NhZ2VzLlxuICAgKiBAdHlwZSB7b25DdHJsTWVzc2FnZX1cbiAgICovXG4gIG9uQ3RybE1lc3NhZ2UgPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIHRvIHJlY2lldmUgPGNvZGU+e2RhdGF9PC9jb2RlPiAoY29udGVudCkgbWVzc2FnZXMuXG4gICAqIEB0eXBlIHtvbkRhdGFNZXNzYWdlfVxuICAgKi9cbiAgb25EYXRhTWVzc2FnZSA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gcmVjZWl2ZSA8Y29kZT57cHJlc308L2NvZGU+IChwcmVzZW5jZSkgbWVzc2FnZXMuXG4gICAqIEB0eXBlIHtvblByZXNNZXNzYWdlfVxuICAgKi9cbiAgb25QcmVzTWVzc2FnZSA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gcmVjZWl2ZSBhbGwgbWVzc2FnZXMgYXMgb2JqZWN0cy5cbiAgICogQHR5cGUge29uTWVzc2FnZX1cbiAgICovXG4gIG9uTWVzc2FnZSA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gcmVjZWl2ZSBhbGwgbWVzc2FnZXMgYXMgdW5wYXJzZWQgdGV4dC5cbiAgICogQHR5cGUge29uUmF3TWVzc2FnZX1cbiAgICovXG4gIG9uUmF3TWVzc2FnZSA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gcmVjZWl2ZSBzZXJ2ZXIgcmVzcG9uc2VzIHRvIG5ldHdvcmsgcHJvYmVzLiBTZWUge0BsaW5rIFRpbm9kZSNuZXR3b3JrUHJvYmV9XG4gICAqIEB0eXBlIHtvbk5ldHdvcmtQcm9iZX1cbiAgICovXG4gIG9uTmV0d29ya1Byb2JlID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0byBiZSBub3RpZmllZCB3aGVuIGV4cG9uZW50aWFsIGJhY2tvZmYgaXMgaXRlcmF0aW5nLlxuICAgKiBAdHlwZSB7b25BdXRvcmVjb25uZWN0SXRlcmF0aW9ufVxuICAgKi9cbiAgb25BdXRvcmVjb25uZWN0SXRlcmF0aW9uID0gdW5kZWZpbmVkO1xufTtcblxuLy8gRXhwb3J0ZWQgY29uc3RhbnRzXG5UaW5vZGUuTUVTU0FHRV9TVEFUVVNfTk9ORSA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX05PTkU7XG5UaW5vZGUuTUVTU0FHRV9TVEFUVVNfUVVFVUVEID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfUVVFVUVEO1xuVGlub2RlLk1FU1NBR0VfU1RBVFVTX1NFTkRJTkcgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19TRU5ESU5HO1xuVGlub2RlLk1FU1NBR0VfU1RBVFVTX0ZBSUxFRCA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX0ZBSUxFRDtcblRpbm9kZS5NRVNTQUdFX1NUQVRVU19TRU5UID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfU0VOVDtcblRpbm9kZS5NRVNTQUdFX1NUQVRVU19SRUNFSVZFRCA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX1JFQ0VJVkVEO1xuVGlub2RlLk1FU1NBR0VfU1RBVFVTX1JFQUQgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19SRUFEO1xuVGlub2RlLk1FU1NBR0VfU1RBVFVTX1RPX01FID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfVE9fTUU7XG5UaW5vZGUuTUVTU0FHRV9TVEFUVVNfREVMX1JBTkdFID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfREVMX1JBTkdFO1xuXG4vLyBVbmljb2RlIFtkZWxdIHN5bWJvbC5cblRpbm9kZS5ERUxfQ0hBUiA9IENvbnN0LkRFTF9DSEFSO1xuXG4vLyBOYW1lcyBvZiBrZXlzIHRvIHNlcnZlci1wcm92aWRlZCBjb25maWd1cmF0aW9uIGxpbWl0cy5cblRpbm9kZS5NQVhfTUVTU0FHRV9TSVpFID0gJ21heE1lc3NhZ2VTaXplJztcblRpbm9kZS5NQVhfU1VCU0NSSUJFUl9DT1VOVCA9ICdtYXhTdWJzY3JpYmVyQ291bnQnO1xuVGlub2RlLk1BWF9UQUdfQ09VTlQgPSAnbWF4VGFnQ291bnQnO1xuVGlub2RlLk1BWF9GSUxFX1VQTE9BRF9TSVpFID0gJ21heEZpbGVVcGxvYWRTaXplJztcbiIsIi8qKlxuICogQGZpbGUgVG9waWMgbWFuYWdlbWVudC5cbiAqXG4gKiBAY29weXJpZ2h0IDIwMTUtMjAyMiBUaW5vZGUgTExDLlxuICovXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCBBY2Nlc3NNb2RlIGZyb20gJy4vYWNjZXNzLW1vZGUuanMnO1xuaW1wb3J0IENCdWZmZXIgZnJvbSAnLi9jYnVmZmVyLmpzJztcbmltcG9ydCAqIGFzIENvbnN0IGZyb20gJy4vY29uZmlnLmpzJztcbmltcG9ydCBEcmFmdHkgZnJvbSAnLi9kcmFmdHkuanMnO1xuaW1wb3J0IE1ldGFHZXRCdWlsZGVyIGZyb20gJy4vbWV0YS1idWlsZGVyLmpzJztcbmltcG9ydCB7XG4gIG1lcmdlT2JqLFxuICBtZXJnZVRvQ2FjaGUsXG4gIG5vcm1hbGl6ZUFycmF5XG59IGZyb20gJy4vdXRpbHMuanMnO1xuXG5leHBvcnQgY2xhc3MgVG9waWMge1xuICAvKipcbiAgICogQGNhbGxiYWNrIFRpbm9kZS5Ub3BpYy5vbkRhdGFcbiAgICogQHBhcmFtIHtEYXRhfSBkYXRhIC0gRGF0YSBwYWNrZXRcbiAgICovXG4gIC8qKlxuICAgKiBUb3BpYyBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyBhIGxvZ2ljYWwgY29tbXVuaWNhdGlvbiBjaGFubmVsLlxuICAgKiBAY2xhc3MgVG9waWNcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIGNyZWF0ZS5cbiAgICogQHBhcmFtIHtPYmplY3Q9fSBjYWxsYmFja3MgLSBPYmplY3Qgd2l0aCB2YXJpb3VzIGV2ZW50IGNhbGxiYWNrcy5cbiAgICogQHBhcmFtIHtUaW5vZGUuVG9waWMub25EYXRhfSBjYWxsYmFja3Mub25EYXRhIC0gQ2FsbGJhY2sgd2hpY2ggcmVjZWl2ZXMgYSA8Y29kZT57ZGF0YX08L2NvZGU+IG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7Y2FsbGJhY2t9IGNhbGxiYWNrcy5vbk1ldGEgLSBDYWxsYmFjayB3aGljaCByZWNlaXZlcyBhIDxjb2RlPnttZXRhfTwvY29kZT4gbWVzc2FnZS5cbiAgICogQHBhcmFtIHtjYWxsYmFja30gY2FsbGJhY2tzLm9uUHJlcyAtIENhbGxiYWNrIHdoaWNoIHJlY2VpdmVzIGEgPGNvZGU+e3ByZXN9PC9jb2RlPiBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge2NhbGxiYWNrfSBjYWxsYmFja3Mub25JbmZvIC0gQ2FsbGJhY2sgd2hpY2ggcmVjZWl2ZXMgYW4gPGNvZGU+e2luZm99PC9jb2RlPiBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge2NhbGxiYWNrfSBjYWxsYmFja3Mub25NZXRhRGVzYyAtIENhbGxiYWNrIHdoaWNoIHJlY2VpdmVzIGNoYW5nZXMgdG8gdG9waWMgZGVzY3Rpb3B0aW9uIHtAbGluayBkZXNjfS5cbiAgICogQHBhcmFtIHtjYWxsYmFja30gY2FsbGJhY2tzLm9uTWV0YVN1YiAtIENhbGxlZCBmb3IgYSBzaW5nbGUgc3Vic2NyaXB0aW9uIHJlY29yZCBjaGFuZ2UuXG4gICAqIEBwYXJhbSB7Y2FsbGJhY2t9IGNhbGxiYWNrcy5vblN1YnNVcGRhdGVkIC0gQ2FsbGVkIGFmdGVyIGEgYmF0Y2ggb2Ygc3Vic2NyaXB0aW9uIGNoYW5nZXMgaGF2ZSBiZWVuIHJlY2lldmVkIGFuZCBjYWNoZWQuXG4gICAqIEBwYXJhbSB7Y2FsbGJhY2t9IGNhbGxiYWNrcy5vbkRlbGV0ZVRvcGljIC0gQ2FsbGVkIGFmdGVyIHRoZSB0b3BpYyBpcyBkZWxldGVkLlxuICAgKiBAcGFyYW0ge2NhbGxiYWNrfSBjYWxsYmFjbHMub25BbGxNZXNzYWdlc1JlY2VpdmVkIC0gQ2FsbGVkIHdoZW4gYWxsIHJlcXVlc3RlZCA8Y29kZT57ZGF0YX08L2NvZGU+IG1lc3NhZ2VzIGhhdmUgYmVlbiByZWNpdmVkLlxuICAgKi9cbiAgY29uc3RydWN0b3IobmFtZSwgY2FsbGJhY2tzKSB7XG4gICAgLy8gUGFyZW50IFRpbm9kZSBvYmplY3QuXG4gICAgdGhpcy5fdGlub2RlID0gbnVsbDtcblxuICAgIC8vIFNlcnZlci1wcm92aWRlZCBkYXRhLCBsb2NhbGx5IGltbXV0YWJsZS5cbiAgICAvLyB0b3BpYyBuYW1lXG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAvLyBUaW1lc3RhbXAgd2hlbiB0aGUgdG9waWMgd2FzIGNyZWF0ZWQuXG4gICAgdGhpcy5jcmVhdGVkID0gbnVsbDtcbiAgICAvLyBUaW1lc3RhbXAgd2hlbiB0aGUgdG9waWMgd2FzIGxhc3QgdXBkYXRlZC5cbiAgICB0aGlzLnVwZGF0ZWQgPSBudWxsO1xuICAgIC8vIFRpbWVzdGFtcCBvZiB0aGUgbGFzdCBtZXNzYWdlc1xuICAgIHRoaXMudG91Y2hlZCA9IG5ldyBEYXRlKDApO1xuICAgIC8vIEFjY2VzcyBtb2RlLCBzZWUgQWNjZXNzTW9kZVxuICAgIHRoaXMuYWNzID0gbmV3IEFjY2Vzc01vZGUobnVsbCk7XG4gICAgLy8gUGVyLXRvcGljIHByaXZhdGUgZGF0YSAoYWNjZXNzaWJsZSBieSBjdXJyZW50IHVzZXIgb25seSkuXG4gICAgdGhpcy5wcml2YXRlID0gbnVsbDtcbiAgICAvLyBQZXItdG9waWMgcHVibGljIGRhdGEgKGFjY2Vzc2libGUgYnkgYWxsIHVzZXJzKS5cbiAgICB0aGlzLnB1YmxpYyA9IG51bGw7XG4gICAgLy8gUGVyLXRvcGljIHN5c3RlbS1wcm92aWRlZCBkYXRhIChhY2Nlc3NpYmxlIGJ5IGFsbCB1c2VycykuXG4gICAgdGhpcy50cnVzdGVkID0gbnVsbDtcblxuICAgIC8vIExvY2FsbHkgY2FjaGVkIGRhdGFcbiAgICAvLyBTdWJzY3JpYmVkIHVzZXJzLCBmb3IgdHJhY2tpbmcgcmVhZC9yZWN2L21zZyBub3RpZmljYXRpb25zLlxuICAgIHRoaXMuX3VzZXJzID0ge307XG5cbiAgICAvLyBDdXJyZW50IHZhbHVlIG9mIGxvY2FsbHkgaXNzdWVkIHNlcUlkLCB1c2VkIGZvciBwZW5kaW5nIG1lc3NhZ2VzLlxuICAgIHRoaXMuX3F1ZXVlZFNlcUlkID0gQ29uc3QuTE9DQUxfU0VRSUQ7XG5cbiAgICAvLyBUaGUgbWF4aW11bSBrbm93biB7ZGF0YS5zZXF9IHZhbHVlLlxuICAgIHRoaXMuX21heFNlcSA9IDA7XG4gICAgLy8gVGhlIG1pbmltdW0ga25vd24ge2RhdGEuc2VxfSB2YWx1ZS5cbiAgICB0aGlzLl9taW5TZXEgPSAwO1xuICAgIC8vIEluZGljYXRvciB0aGF0IHRoZSBsYXN0IHJlcXVlc3QgZm9yIGVhcmxpZXIgbWVzc2FnZXMgcmV0dXJuZWQgMC5cbiAgICB0aGlzLl9ub0VhcmxpZXJNc2dzID0gZmFsc2U7XG4gICAgLy8gVGhlIG1heGltdW0ga25vd24gZGVsZXRpb24gSUQuXG4gICAgdGhpcy5fbWF4RGVsID0gMDtcbiAgICAvLyBUaW1lciBvYmplY3QgdXNlZCB0byBzZW5kICdyZWN2JyBub3RpZmljYXRpb25zLlxuICAgIHRoaXMuX3JlY3ZOb3RpZmljYXRpb25UaW1lciA9IG51bGw7XG5cbiAgICAvLyBVc2VyIGRpc2NvdmVyeSB0YWdzXG4gICAgdGhpcy5fdGFncyA9IFtdO1xuICAgIC8vIENyZWRlbnRpYWxzIHN1Y2ggYXMgZW1haWwgb3IgcGhvbmUgbnVtYmVyLlxuICAgIHRoaXMuX2NyZWRlbnRpYWxzID0gW107XG4gICAgLy8gTWVzc2FnZSB2ZXJzaW9ucyBjYWNoZSAoZS5nLiBmb3IgZWRpdGVkIG1lc3NhZ2VzKS5cbiAgICAvLyBLZXlzOiBvcmlnaW5hbCBtZXNzYWdlIHNlcSBpZHMuXG4gICAgLy8gVmFsdWVzOiBDQnVmZmVycyBjb250YWluaW5nIG5ld2VyIHZlcnNpb25zIG9mIHRoZSBvcmlnaW5hbCBtZXNzYWdlXG4gICAgLy8gb3JkZXJlZCBieSBzZXEgaWQuXG4gICAgdGhpcy5fbWVzc2FnZVZlcnNpb25zID0ge307XG4gICAgLy8gTWVzc2FnZSBjYWNoZSwgc29ydGVkIGJ5IG1lc3NhZ2Ugc2VxIHZhbHVlcywgZnJvbSBvbGQgdG8gbmV3LlxuICAgIHRoaXMuX21lc3NhZ2VzID0gbmV3IENCdWZmZXIoKGEsIGIpID0+IHtcbiAgICAgIHJldHVybiBhLnNlcSAtIGIuc2VxO1xuICAgIH0sIHRydWUpO1xuICAgIC8vIEJvb2xlYW4sIHRydWUgaWYgdGhlIHRvcGljIGlzIGN1cnJlbnRseSBsaXZlXG4gICAgdGhpcy5fYXR0YWNoZWQgPSBmYWxzZTtcbiAgICAvLyBUaW1lc3RhcCBvZiB0aGUgbW9zdCByZWNlbnRseSB1cGRhdGVkIHN1YnNjcmlwdGlvbi5cbiAgICB0aGlzLl9sYXN0U3Vic1VwZGF0ZSA9IG5ldyBEYXRlKDApO1xuICAgIC8vIFRvcGljIGNyZWF0ZWQgYnV0IG5vdCB5ZXQgc3luY2VkIHdpdGggdGhlIHNlcnZlci4gVXNlZCBvbmx5IGR1cmluZyBpbml0aWFsaXphdGlvbi5cbiAgICB0aGlzLl9uZXcgPSB0cnVlO1xuICAgIC8vIFRoZSB0b3BpYyBpcyBkZWxldGVkIGF0IHRoZSBzZXJ2ZXIsIHRoaXMgaXMgYSBsb2NhbCBjb3B5LlxuICAgIHRoaXMuX2RlbGV0ZWQgPSBmYWxzZTtcblxuICAgIC8vIFRpbWVyIHVzZWQgdG8gdHJnZ2VyIHtsZWF2ZX0gcmVxdWVzdCBhZnRlciBhIGRlbGF5LlxuICAgIHRoaXMuX2RlbGF5ZWRMZWF2ZVRpbWVyID0gbnVsbDtcblxuICAgIC8vIENhbGxiYWNrc1xuICAgIGlmIChjYWxsYmFja3MpIHtcbiAgICAgIHRoaXMub25EYXRhID0gY2FsbGJhY2tzLm9uRGF0YTtcbiAgICAgIHRoaXMub25NZXRhID0gY2FsbGJhY2tzLm9uTWV0YTtcbiAgICAgIHRoaXMub25QcmVzID0gY2FsbGJhY2tzLm9uUHJlcztcbiAgICAgIHRoaXMub25JbmZvID0gY2FsbGJhY2tzLm9uSW5mbztcbiAgICAgIC8vIEEgc2luZ2xlIGRlc2MgdXBkYXRlO1xuICAgICAgdGhpcy5vbk1ldGFEZXNjID0gY2FsbGJhY2tzLm9uTWV0YURlc2M7XG4gICAgICAvLyBBIHNpbmdsZSBzdWJzY3JpcHRpb24gcmVjb3JkO1xuICAgICAgdGhpcy5vbk1ldGFTdWIgPSBjYWxsYmFja3Mub25NZXRhU3ViO1xuICAgICAgLy8gQWxsIHN1YnNjcmlwdGlvbiByZWNvcmRzIHJlY2VpdmVkO1xuICAgICAgdGhpcy5vblN1YnNVcGRhdGVkID0gY2FsbGJhY2tzLm9uU3Vic1VwZGF0ZWQ7XG4gICAgICB0aGlzLm9uVGFnc1VwZGF0ZWQgPSBjYWxsYmFja3Mub25UYWdzVXBkYXRlZDtcbiAgICAgIHRoaXMub25DcmVkc1VwZGF0ZWQgPSBjYWxsYmFja3Mub25DcmVkc1VwZGF0ZWQ7XG4gICAgICB0aGlzLm9uRGVsZXRlVG9waWMgPSBjYWxsYmFja3Mub25EZWxldGVUb3BpYztcbiAgICAgIHRoaXMub25BbGxNZXNzYWdlc1JlY2VpdmVkID0gY2FsbGJhY2tzLm9uQWxsTWVzc2FnZXNSZWNlaXZlZDtcbiAgICB9XG4gIH1cblxuICAvLyBTdGF0aWMgbWV0aG9kcy5cblxuICAvKipcbiAgICogRGV0ZXJtaW5lIHRvcGljIHR5cGUgZnJvbSB0b3BpYydzIG5hbWU6IGdycCwgcDJwLCBtZSwgZm5kLCBzeXMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byB0ZXN0LlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBPbmUgb2YgPGNvZGU+XCJtZVwiPC9jb2RlPiwgPGNvZGU+XCJmbmRcIjwvY29kZT4sIDxjb2RlPlwic3lzXCI8L2NvZGU+LCA8Y29kZT5cImdycFwiPC9jb2RlPixcbiAgICogICAgPGNvZGU+XCJwMnBcIjwvY29kZT4gb3IgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPi5cbiAgICovXG4gIHN0YXRpYyB0b3BpY1R5cGUobmFtZSkge1xuICAgIGNvbnN0IHR5cGVzID0ge1xuICAgICAgJ21lJzogQ29uc3QuVE9QSUNfTUUsXG4gICAgICAnZm5kJzogQ29uc3QuVE9QSUNfRk5ELFxuICAgICAgJ2dycCc6IENvbnN0LlRPUElDX0dSUCxcbiAgICAgICduZXcnOiBDb25zdC5UT1BJQ19HUlAsXG4gICAgICAnbmNoJzogQ29uc3QuVE9QSUNfR1JQLFxuICAgICAgJ2Nobic6IENvbnN0LlRPUElDX0dSUCxcbiAgICAgICd1c3InOiBDb25zdC5UT1BJQ19QMlAsXG4gICAgICAnc3lzJzogQ29uc3QuVE9QSUNfU1lTXG4gICAgfTtcbiAgICByZXR1cm4gdHlwZXNbKHR5cGVvZiBuYW1lID09ICdzdHJpbmcnKSA/IG5hbWUuc3Vic3RyaW5nKDAsIDMpIDogJ3h4eCddO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhICdtZScgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byB0ZXN0LlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdGhlIG5hbWUgaXMgYSBuYW1lIG9mIGEgJ21lJyB0b3BpYywgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIHN0YXRpYyBpc01lVG9waWNOYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gVG9waWMudG9waWNUeXBlKG5hbWUpID09IENvbnN0LlRPUElDX01FO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhIGdyb3VwIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gdGVzdC5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBuYW1lIGlzIGEgbmFtZSBvZiBhIGdyb3VwIHRvcGljLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgc3RhdGljIGlzR3JvdXBUb3BpY05hbWUobmFtZSkge1xuICAgIHJldHVybiBUb3BpYy50b3BpY1R5cGUobmFtZSkgPT0gQ29uc3QuVE9QSUNfR1JQO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhIHAycCB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIHRlc3QuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGUgbmFtZSBpcyBhIG5hbWUgb2YgYSBwMnAgdG9waWMsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBzdGF0aWMgaXNQMlBUb3BpY05hbWUobmFtZSkge1xuICAgIHJldHVybiBUb3BpYy50b3BpY1R5cGUobmFtZSkgPT0gQ29uc3QuVE9QSUNfUDJQO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhIGNvbW11bmljYXRpb24gdG9waWMsIGkuZS4gUDJQIG9yIGdyb3VwLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gdGVzdC5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBuYW1lIGlzIGEgbmFtZSBvZiBhIHAycCBvciBncm91cCB0b3BpYywgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIHN0YXRpYyBpc0NvbW1Ub3BpY05hbWUobmFtZSkge1xuICAgIHJldHVybiBUb3BpYy5pc1AyUFRvcGljTmFtZShuYW1lKSB8fCBUb3BpYy5pc0dyb3VwVG9waWNOYW1lKG5hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhIG5ldyB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIHRvcGljIG5hbWUgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGUgbmFtZSBpcyBhIG5hbWUgb2YgYSBuZXcgdG9waWMsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBzdGF0aWMgaXNOZXdHcm91cFRvcGljTmFtZShuYW1lKSB7XG4gICAgcmV0dXJuICh0eXBlb2YgbmFtZSA9PSAnc3RyaW5nJykgJiZcbiAgICAgIChuYW1lLnN1YnN0cmluZygwLCAzKSA9PSBDb25zdC5UT1BJQ19ORVcgfHwgbmFtZS5zdWJzdHJpbmcoMCwgMykgPT0gQ29uc3QuVE9QSUNfTkVXX0NIQU4pO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhIGNoYW5uZWwuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSB0b3BpYyBuYW1lIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdGhlIG5hbWUgaXMgYSBuYW1lIG9mIGEgY2hhbm5lbCwgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIHN0YXRpYyBpc0NoYW5uZWxUb3BpY05hbWUobmFtZSkge1xuICAgIHJldHVybiAodHlwZW9mIG5hbWUgPT0gJ3N0cmluZycpICYmXG4gICAgICAobmFtZS5zdWJzdHJpbmcoMCwgMykgPT0gQ29uc3QuVE9QSUNfQ0hBTiB8fCBuYW1lLnN1YnN0cmluZygwLCAzKSA9PSBDb25zdC5UT1BJQ19ORVdfQ0hBTik7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIHRvcGljIGlzIHN1YnNjcmliZWQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlzIHRvcGljIGlzIGF0dGFjaGVkL3N1YnNjcmliZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAgICovXG4gIGlzU3Vic2NyaWJlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fYXR0YWNoZWQ7XG4gIH1cblxuICAvKipcbiAgICogUmVxdWVzdCB0b3BpYyB0byBzdWJzY3JpYmUuIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjc3Vic2NyaWJlfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtUaW5vZGUuR2V0UXVlcnk9fSBnZXRQYXJhbXMgLSBnZXQgcXVlcnkgcGFyYW1ldGVycy5cbiAgICogQHBhcmFtIHtUaW5vZGUuU2V0UGFyYW1zPX0gc2V0UGFyYW1zIC0gc2V0IHBhcmFtZXRlcnMuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byB0aGUgcmVxdWVzdC5cbiAgICovXG4gIHN1YnNjcmliZShnZXRQYXJhbXMsIHNldFBhcmFtcykge1xuICAgIC8vIENsZWFyIHJlcXVlc3QgdG8gbGVhdmUgdG9waWMuXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuX2RlbGF5ZWRMZWF2ZVRpbWVyKTtcbiAgICB0aGlzLl9kZWxheWVkTGVhdmVUaW1lciA9IG51bGw7XG5cbiAgICAvLyBJZiB0aGUgdG9waWMgaXMgYWxyZWFkeSBzdWJzY3JpYmVkLCByZXR1cm4gcmVzb2x2ZWQgcHJvbWlzZVxuICAgIGlmICh0aGlzLl9hdHRhY2hlZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzKTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgdG9waWMgaXMgZGVsZXRlZCwgcmVqZWN0IHN1YnNjcmlwdGlvbiByZXF1ZXN0cy5cbiAgICBpZiAodGhpcy5fZGVsZXRlZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkNvbnZlcnNhdGlvbiBkZWxldGVkXCIpKTtcbiAgICB9XG5cbiAgICAvLyBTZW5kIHN1YnNjcmliZSBtZXNzYWdlLCBoYW5kbGUgYXN5bmMgcmVzcG9uc2UuXG4gICAgLy8gSWYgdG9waWMgbmFtZSBpcyBleHBsaWNpdGx5IHByb3ZpZGVkLCB1c2UgaXQuIElmIG5vIG5hbWUsIHRoZW4gaXQncyBhIG5ldyBncm91cCB0b3BpYyxcbiAgICAvLyB1c2UgXCJuZXdcIi5cbiAgICByZXR1cm4gdGhpcy5fdGlub2RlLnN1YnNjcmliZSh0aGlzLm5hbWUgfHwgQ29uc3QuVE9QSUNfTkVXLCBnZXRQYXJhbXMsIHNldFBhcmFtcykudGhlbigoY3RybCkgPT4ge1xuICAgICAgaWYgKGN0cmwuY29kZSA+PSAzMDApIHtcbiAgICAgICAgLy8gRG8gbm90aGluZyBpZiBzdWJzY3JpcHRpb24gc3RhdHVzIGhhcyBub3QgY2hhbmdlZC5cbiAgICAgICAgcmV0dXJuIGN0cmw7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2F0dGFjaGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuX2RlbGV0ZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMuYWNzID0gKGN0cmwucGFyYW1zICYmIGN0cmwucGFyYW1zLmFjcykgPyBjdHJsLnBhcmFtcy5hY3MgOiB0aGlzLmFjcztcblxuICAgICAgLy8gU2V0IHRvcGljIG5hbWUgZm9yIG5ldyB0b3BpY3MgYW5kIGFkZCBpdCB0byBjYWNoZS5cbiAgICAgIGlmICh0aGlzLl9uZXcpIHtcbiAgICAgICAgZGVsZXRlIHRoaXMuX25ldztcblxuICAgICAgICBpZiAodGhpcy5uYW1lICE9IGN0cmwudG9waWMpIHtcbiAgICAgICAgICAvLyBOYW1lIG1heSBjaGFuZ2UgbmV3MTIzNDU2IC0+IGdycEFiQ2RFZi4gUmVtb3ZlIGZyb20gY2FjaGUgdW5kZXIgdGhlIG9sZCBuYW1lLlxuICAgICAgICAgIHRoaXMuX2NhY2hlRGVsU2VsZigpO1xuICAgICAgICAgIHRoaXMubmFtZSA9IGN0cmwudG9waWM7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fY2FjaGVQdXRTZWxmKCk7XG5cbiAgICAgICAgdGhpcy5jcmVhdGVkID0gY3RybC50cztcbiAgICAgICAgdGhpcy51cGRhdGVkID0gY3RybC50cztcblxuICAgICAgICBpZiAodGhpcy5uYW1lICE9IENvbnN0LlRPUElDX01FICYmIHRoaXMubmFtZSAhPSBDb25zdC5UT1BJQ19GTkQpIHtcbiAgICAgICAgICAvLyBBZGQgdGhlIG5ldyB0b3BpYyB0byB0aGUgbGlzdCBvZiBjb250YWN0cyBtYWludGFpbmVkIGJ5IHRoZSAnbWUnIHRvcGljLlxuICAgICAgICAgIGNvbnN0IG1lID0gdGhpcy5fdGlub2RlLmdldE1lVG9waWMoKTtcbiAgICAgICAgICBpZiAobWUub25NZXRhU3ViKSB7XG4gICAgICAgICAgICBtZS5vbk1ldGFTdWIodGhpcyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChtZS5vblN1YnNVcGRhdGVkKSB7XG4gICAgICAgICAgICBtZS5vblN1YnNVcGRhdGVkKFt0aGlzLm5hbWVdLCAxKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2V0UGFyYW1zICYmIHNldFBhcmFtcy5kZXNjKSB7XG4gICAgICAgICAgc2V0UGFyYW1zLmRlc2MuX25vRm9yd2FyZGluZyA9IHRydWU7XG4gICAgICAgICAgdGhpcy5fcHJvY2Vzc01ldGFEZXNjKHNldFBhcmFtcy5kZXNjKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGN0cmw7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgZHJhZnQgb2YgYSBtZXNzYWdlIHdpdGhvdXQgc2VuZGluZyBpdCB0byB0aGUgc2VydmVyLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZyB8IE9iamVjdH0gZGF0YSAtIENvbnRlbnQgdG8gd3JhcCBpbiBhIGRyYWZ0LlxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBub0VjaG8gLSBJZiA8Y29kZT50cnVlPC9jb2RlPiBzZXJ2ZXIgd2lsbCBub3QgZWNobyBtZXNzYWdlIGJhY2sgdG8gb3JpZ2luYXRpbmdcbiAgICogc2Vzc2lvbi4gT3RoZXJ3aXNlIHRoZSBzZXJ2ZXIgd2lsbCBzZW5kIGEgY29weSBvZiB0aGUgbWVzc2FnZSB0byBzZW5kZXIuXG4gICAqXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IG1lc3NhZ2UgZHJhZnQuXG4gICAqL1xuICBjcmVhdGVNZXNzYWdlKGRhdGEsIG5vRWNobykge1xuICAgIHJldHVybiB0aGlzLl90aW5vZGUuY3JlYXRlTWVzc2FnZSh0aGlzLm5hbWUsIGRhdGEsIG5vRWNobyk7XG4gIH1cblxuICAvKipcbiAgICogSW1tZWRpYXRlbHkgcHVibGlzaCBkYXRhIHRvIHRvcGljLiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI3B1Ymxpc2h9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZyB8IE9iamVjdH0gZGF0YSAtIE1lc3NhZ2UgdG8gcHVibGlzaCwgZWl0aGVyIHBsYWluIHN0cmluZyBvciBhIERyYWZ0eSBvYmplY3QuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IG5vRWNobyAtIElmIDxjb2RlPnRydWU8L2NvZGU+IHNlcnZlciB3aWxsIG5vdCBlY2hvIG1lc3NhZ2UgYmFjayB0byBvcmlnaW5hdGluZ1xuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gdGhlIHJlcXVlc3QuXG4gICAqL1xuICBwdWJsaXNoKGRhdGEsIG5vRWNobykge1xuICAgIHJldHVybiB0aGlzLnB1Ymxpc2hNZXNzYWdlKHRoaXMuY3JlYXRlTWVzc2FnZShkYXRhLCBub0VjaG8pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQdWJsaXNoIG1lc3NhZ2UgY3JlYXRlZCBieSB7QGxpbmsgVGlub2RlLlRvcGljI2NyZWF0ZU1lc3NhZ2V9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcHViIC0ge2RhdGF9IG9iamVjdCB0byBwdWJsaXNoLiBNdXN0IGJlIGNyZWF0ZWQgYnkge0BsaW5rIFRpbm9kZS5Ub3BpYyNjcmVhdGVNZXNzYWdlfVxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gdGhlIHJlcXVlc3QuXG4gICAqL1xuICBwdWJsaXNoTWVzc2FnZShwdWIpIHtcbiAgICBpZiAoIXRoaXMuX2F0dGFjaGVkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiQ2Fubm90IHB1Ymxpc2ggb24gaW5hY3RpdmUgdG9waWNcIikpO1xuICAgIH1cbiAgICBpZiAodGhpcy5fc2VuZGluZykge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIlRoZSBtZXNzYWdlIGlzIGFscmVhZHkgYmVpbmcgc2VudFwiKSk7XG4gICAgfVxuXG4gICAgLy8gU2VuZCBkYXRhLlxuICAgIHB1Yi5fc2VuZGluZyA9IHRydWU7XG4gICAgcHViLl9mYWlsZWQgPSBmYWxzZTtcblxuICAgIC8vIEV4dHJhY3QgcmVmZXJlY2VzIHRvIGF0dGFjaG1lbnRzIGFuZCBvdXQgb2YgYmFuZCBpbWFnZSByZWNvcmRzLlxuICAgIGxldCBhdHRhY2htZW50cyA9IG51bGw7XG4gICAgaWYgKERyYWZ0eS5oYXNFbnRpdGllcyhwdWIuY29udGVudCkpIHtcbiAgICAgIGF0dGFjaG1lbnRzID0gW107XG4gICAgICBEcmFmdHkuZW50aXRpZXMocHViLmNvbnRlbnQsIGRhdGEgPT4ge1xuICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLnJlZikge1xuICAgICAgICAgIGF0dGFjaG1lbnRzLnB1c2goZGF0YS5yZWYpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGlmIChhdHRhY2htZW50cy5sZW5ndGggPT0gMCkge1xuICAgICAgICBhdHRhY2htZW50cyA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3Rpbm9kZS5wdWJsaXNoTWVzc2FnZShwdWIsIGF0dGFjaG1lbnRzKS50aGVuKGN0cmwgPT4ge1xuICAgICAgcHViLl9zZW5kaW5nID0gZmFsc2U7XG4gICAgICBwdWIudHMgPSBjdHJsLnRzO1xuICAgICAgdGhpcy5zd2FwTWVzc2FnZUlkKHB1YiwgY3RybC5wYXJhbXMuc2VxKTtcbiAgICAgIHRoaXMuX21heWJlVXBkYXRlTWVzc2FnZVZlcnNpb25zQ2FjaGUocHViKTtcbiAgICAgIHRoaXMuX3JvdXRlRGF0YShwdWIpO1xuICAgICAgcmV0dXJuIGN0cmw7XG4gICAgfSkuY2F0Y2goZXJyID0+IHtcbiAgICAgIHRoaXMuX3Rpbm9kZS5sb2dnZXIoXCJXQVJOSU5HOiBNZXNzYWdlIHJlamVjdGVkIGJ5IHRoZSBzZXJ2ZXJcIiwgZXJyKTtcbiAgICAgIHB1Yi5fc2VuZGluZyA9IGZhbHNlO1xuICAgICAgcHViLl9mYWlsZWQgPSB0cnVlO1xuICAgICAgaWYgKHRoaXMub25EYXRhKSB7XG4gICAgICAgIHRoaXMub25EYXRhKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIG1lc3NhZ2UgdG8gbG9jYWwgbWVzc2FnZSBjYWNoZSwgc2VuZCB0byB0aGUgc2VydmVyIHdoZW4gdGhlIHByb21pc2UgaXMgcmVzb2x2ZWQuXG4gICAqIElmIHByb21pc2UgaXMgbnVsbCBvciB1bmRlZmluZWQsIHRoZSBtZXNzYWdlIHdpbGwgYmUgc2VudCBpbW1lZGlhdGVseS5cbiAgICogVGhlIG1lc3NhZ2UgaXMgc2VudCB3aGVuIHRoZVxuICAgKiBUaGUgbWVzc2FnZSBzaG91bGQgYmUgY3JlYXRlZCBieSB7QGxpbmsgVGlub2RlLlRvcGljI2NyZWF0ZU1lc3NhZ2V9LlxuICAgKiBUaGlzIGlzIHByb2JhYmx5IG5vdCB0aGUgZmluYWwgQVBJLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcHViIC0gTWVzc2FnZSB0byB1c2UgYXMgYSBkcmFmdC5cbiAgICogQHBhcmFtIHtQcm9taXNlfSBwcm9tIC0gTWVzc2FnZSB3aWxsIGJlIHNlbnQgd2hlbiB0aGlzIHByb21pc2UgaXMgcmVzb2x2ZWQsIGRpc2NhcmRlZCBpZiByZWplY3RlZC5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IGRlcml2ZWQgcHJvbWlzZS5cbiAgICovXG4gIHB1Ymxpc2hEcmFmdChwdWIsIHByb20pIHtcbiAgICBjb25zdCBzZXEgPSBwdWIuc2VxIHx8IHRoaXMuX2dldFF1ZXVlZFNlcUlkKCk7XG4gICAgaWYgKCFwdWIuX25vRm9yd2FyZGluZykge1xuICAgICAgLy8gVGhlICdzZXEnLCAndHMnLCBhbmQgJ2Zyb20nIGFyZSBhZGRlZCB0byBtaW1pYyB7ZGF0YX0uIFRoZXkgYXJlIHJlbW92ZWQgbGF0ZXJcbiAgICAgIC8vIGJlZm9yZSB0aGUgbWVzc2FnZSBpcyBzZW50LlxuICAgICAgcHViLl9ub0ZvcndhcmRpbmcgPSB0cnVlO1xuICAgICAgcHViLnNlcSA9IHNlcTtcbiAgICAgIHB1Yi50cyA9IG5ldyBEYXRlKCk7XG4gICAgICBwdWIuZnJvbSA9IHRoaXMuX3Rpbm9kZS5nZXRDdXJyZW50VXNlcklEKCk7XG5cbiAgICAgIC8vIERvbid0IG5lZWQgYW4gZWNobyBtZXNzYWdlIGJlY2F1c2UgdGhlIG1lc3NhZ2UgaXMgYWRkZWQgdG8gbG9jYWwgY2FjaGUgcmlnaHQgYXdheS5cbiAgICAgIHB1Yi5ub2VjaG8gPSB0cnVlO1xuICAgICAgLy8gQWRkIHRvIGNhY2hlLlxuICAgICAgdGhpcy5fbWVzc2FnZXMucHV0KHB1Yik7XG4gICAgICB0aGlzLl90aW5vZGUuX2RiLmFkZE1lc3NhZ2UocHViKTtcblxuICAgICAgaWYgKHRoaXMub25EYXRhKSB7XG4gICAgICAgIHRoaXMub25EYXRhKHB1Yik7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIElmIHByb21pc2UgaXMgcHJvdmlkZWQsIHNlbmQgdGhlIHF1ZXVlZCBtZXNzYWdlIHdoZW4gaXQncyByZXNvbHZlZC5cbiAgICAvLyBJZiBubyBwcm9taXNlIGlzIHByb3ZpZGVkLCBjcmVhdGUgYSByZXNvbHZlZCBvbmUgYW5kIHNlbmQgaW1tZWRpYXRlbHkuXG4gICAgcmV0dXJuIChwcm9tIHx8IFByb21pc2UucmVzb2x2ZSgpKVxuICAgICAgLnRoZW4oXyA9PiB7XG4gICAgICAgIGlmIChwdWIuX2NhbmNlbGxlZCkge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb2RlOiAzMDAsXG4gICAgICAgICAgICB0ZXh0OiBcImNhbmNlbGxlZFwiXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5wdWJsaXNoTWVzc2FnZShwdWIpO1xuICAgICAgfSkuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgdGhpcy5fdGlub2RlLmxvZ2dlcihcIldBUk5JTkc6IE1lc3NhZ2UgZHJhZnQgcmVqZWN0ZWRcIiwgZXJyKTtcbiAgICAgICAgcHViLl9zZW5kaW5nID0gZmFsc2U7XG4gICAgICAgIHB1Yi5fZmFpbGVkID0gdHJ1ZTtcbiAgICAgICAgaWYgKHRoaXMub25EYXRhKSB7XG4gICAgICAgICAgdGhpcy5vbkRhdGEoKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBSZXRocm93IHRvIGxldCBjYWxsZXIga25vdyB0aGF0IHRoZSBvcGVyYXRpb24gZmFpbGVkLlxuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMZWF2ZSB0aGUgdG9waWMsIG9wdGlvbmFsbHkgdW5zaWJzY3JpYmUuIExlYXZpbmcgdGhlIHRvcGljIG1lYW5zIHRoZSB0b3BpYyB3aWxsIHN0b3BcbiAgICogcmVjZWl2aW5nIHVwZGF0ZXMgZnJvbSB0aGUgc2VydmVyLiBVbnN1YnNjcmliaW5nIHdpbGwgdGVybWluYXRlIHVzZXIncyByZWxhdGlvbnNoaXAgd2l0aCB0aGUgdG9waWMuXG4gICAqIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjbGVhdmV9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSB1bnN1YiAtIElmIHRydWUsIHVuc3Vic2NyaWJlLCBvdGhlcndpc2UganVzdCBsZWF2ZS5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHRoZSByZXF1ZXN0LlxuICAgKi9cbiAgbGVhdmUodW5zdWIpIHtcbiAgICAvLyBJdCdzIHBvc3NpYmxlIHRvIHVuc3Vic2NyaWJlICh1bnN1Yj09dHJ1ZSkgZnJvbSBpbmFjdGl2ZSB0b3BpYy5cbiAgICBpZiAoIXRoaXMuX2F0dGFjaGVkICYmICF1bnN1Yikge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkNhbm5vdCBsZWF2ZSBpbmFjdGl2ZSB0b3BpY1wiKSk7XG4gICAgfVxuXG4gICAgLy8gU2VuZCBhICdsZWF2ZScgbWVzc2FnZSwgaGFuZGxlIGFzeW5jIHJlc3BvbnNlXG4gICAgcmV0dXJuIHRoaXMuX3Rpbm9kZS5sZWF2ZSh0aGlzLm5hbWUsIHVuc3ViKS50aGVuKChjdHJsKSA9PiB7XG4gICAgICB0aGlzLl9yZXNldFN1YigpO1xuICAgICAgaWYgKHVuc3ViKSB7XG4gICAgICAgIHRoaXMuX2dvbmUoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjdHJsO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIExlYXZlIHRoZSB0b3BpYywgb3B0aW9uYWxseSB1bnNpYnNjcmliZSBhZnRlciBhIGRlbGF5LiBMZWF2aW5nIHRoZSB0b3BpYyBtZWFucyB0aGUgdG9waWMgd2lsbCBzdG9wXG4gICAqIHJlY2VpdmluZyB1cGRhdGVzIGZyb20gdGhlIHNlcnZlci4gVW5zdWJzY3JpYmluZyB3aWxsIHRlcm1pbmF0ZSB1c2VyJ3MgcmVsYXRpb25zaGlwIHdpdGggdGhlIHRvcGljLlxuICAgKiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI2xlYXZlfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSB1bnN1YiAtIElmIHRydWUsIHVuc3Vic2NyaWJlLCBvdGhlcndpc2UganVzdCBsZWF2ZS5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGRlbGF5IC0gdGltZSBpbiBtaWxsaXNlY29uZHMgdG8gZGVsYXkgbGVhdmUgcmVxdWVzdC5cbiAgICovXG4gIGxlYXZlRGVsYXllZCh1bnN1YiwgZGVsYXkpIHtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5fZGVsYXllZExlYXZlVGltZXIpO1xuICAgIHRoaXMuX2RlbGF5ZWRMZWF2ZVRpbWVyID0gc2V0VGltZW91dChfID0+IHtcbiAgICAgIHRoaXMuX2RlbGF5ZWRMZWF2ZVRpbWVyID0gbnVsbDtcbiAgICAgIHRoaXMubGVhdmUodW5zdWIpXG4gICAgfSwgZGVsYXkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcXVlc3QgdG9waWMgbWV0YWRhdGEgZnJvbSB0aGUgc2VydmVyLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5HZXRRdWVyeX0gcmVxdWVzdCBwYXJhbWV0ZXJzXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byByZXF1ZXN0LlxuICAgKi9cbiAgZ2V0TWV0YShwYXJhbXMpIHtcbiAgICAvLyBTZW5kIHtnZXR9IG1lc3NhZ2UsIHJldHVybiBwcm9taXNlLlxuICAgIHJldHVybiB0aGlzLl90aW5vZGUuZ2V0TWV0YSh0aGlzLm5hbWUsIHBhcmFtcyk7XG4gIH1cblxuICAvKipcbiAgICogUmVxdWVzdCBtb3JlIG1lc3NhZ2VzIGZyb20gdGhlIHNlcnZlclxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gbGltaXQgbnVtYmVyIG9mIG1lc3NhZ2VzIHRvIGdldC5cbiAgICogQHBhcmFtIHtib29sZWFufSBmb3J3YXJkIGlmIHRydWUsIHJlcXVlc3QgbmV3ZXIgbWVzc2FnZXMuXG4gICAqL1xuICBnZXRNZXNzYWdlc1BhZ2UobGltaXQsIGZvcndhcmQpIHtcbiAgICBsZXQgcXVlcnkgPSBmb3J3YXJkID9cbiAgICAgIHRoaXMuc3RhcnRNZXRhUXVlcnkoKS53aXRoTGF0ZXJEYXRhKGxpbWl0KSA6XG4gICAgICB0aGlzLnN0YXJ0TWV0YVF1ZXJ5KCkud2l0aEVhcmxpZXJEYXRhKGxpbWl0KTtcblxuICAgIC8vIEZpcnN0IHRyeSBmZXRjaGluZyBmcm9tIERCLCB0aGVuIGZyb20gdGhlIHNlcnZlci5cbiAgICByZXR1cm4gdGhpcy5fbG9hZE1lc3NhZ2VzKHRoaXMuX3Rpbm9kZS5fZGIsIHF1ZXJ5LmV4dHJhY3QoJ2RhdGEnKSlcbiAgICAgIC50aGVuKChjb3VudCkgPT4ge1xuICAgICAgICBpZiAoY291bnQgPT0gbGltaXQpIHtcbiAgICAgICAgICAvLyBHb3QgZW5vdWdoIG1lc3NhZ2VzIGZyb20gbG9jYWwgY2FjaGUuXG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7XG4gICAgICAgICAgICB0b3BpYzogdGhpcy5uYW1lLFxuICAgICAgICAgICAgY29kZTogMjAwLFxuICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgIGNvdW50OiBjb3VudFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVkdWNlIHRoZSBjb3VudCBvZiByZXF1ZXN0ZWQgbWVzc2FnZXMuXG4gICAgICAgIGxpbWl0IC09IGNvdW50O1xuICAgICAgICAvLyBVcGRhdGUgcXVlcnkgd2l0aCBuZXcgdmFsdWVzIGxvYWRlZCBmcm9tIERCLlxuICAgICAgICBxdWVyeSA9IGZvcndhcmQgPyB0aGlzLnN0YXJ0TWV0YVF1ZXJ5KCkud2l0aExhdGVyRGF0YShsaW1pdCkgOlxuICAgICAgICAgIHRoaXMuc3RhcnRNZXRhUXVlcnkoKS53aXRoRWFybGllckRhdGEobGltaXQpO1xuICAgICAgICBsZXQgcHJvbWlzZSA9IHRoaXMuZ2V0TWV0YShxdWVyeS5idWlsZCgpKTtcbiAgICAgICAgaWYgKCFmb3J3YXJkKSB7XG4gICAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoY3RybCkgPT4ge1xuICAgICAgICAgICAgaWYgKGN0cmwgJiYgY3RybC5wYXJhbXMgJiYgIWN0cmwucGFyYW1zLmNvdW50KSB7XG4gICAgICAgICAgICAgIHRoaXMuX25vRWFybGllck1zZ3MgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgfSk7XG4gIH1cbiAgLyoqXG4gICAqIFVwZGF0ZSB0b3BpYyBtZXRhZGF0YS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtUaW5vZGUuU2V0UGFyYW1zfSBwYXJhbXMgcGFyYW1ldGVycyB0byB1cGRhdGUuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byByZXF1ZXN0LlxuICAgKi9cbiAgc2V0TWV0YShwYXJhbXMpIHtcbiAgICBpZiAocGFyYW1zLnRhZ3MpIHtcbiAgICAgIHBhcmFtcy50YWdzID0gbm9ybWFsaXplQXJyYXkocGFyYW1zLnRhZ3MpO1xuICAgIH1cbiAgICAvLyBTZW5kIFNldCBtZXNzYWdlLCBoYW5kbGUgYXN5bmMgcmVzcG9uc2UuXG4gICAgcmV0dXJuIHRoaXMuX3Rpbm9kZS5zZXRNZXRhKHRoaXMubmFtZSwgcGFyYW1zKVxuICAgICAgLnRoZW4oKGN0cmwpID0+IHtcbiAgICAgICAgaWYgKGN0cmwgJiYgY3RybC5jb2RlID49IDMwMCkge1xuICAgICAgICAgIC8vIE5vdCBtb2RpZmllZFxuICAgICAgICAgIHJldHVybiBjdHJsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBhcmFtcy5zdWIpIHtcbiAgICAgICAgICBwYXJhbXMuc3ViLnRvcGljID0gdGhpcy5uYW1lO1xuICAgICAgICAgIGlmIChjdHJsLnBhcmFtcyAmJiBjdHJsLnBhcmFtcy5hY3MpIHtcbiAgICAgICAgICAgIHBhcmFtcy5zdWIuYWNzID0gY3RybC5wYXJhbXMuYWNzO1xuICAgICAgICAgICAgcGFyYW1zLnN1Yi51cGRhdGVkID0gY3RybC50cztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFwYXJhbXMuc3ViLnVzZXIpIHtcbiAgICAgICAgICAgIC8vIFRoaXMgaXMgYSBzdWJzY3JpcHRpb24gdXBkYXRlIG9mIHRoZSBjdXJyZW50IHVzZXIuXG4gICAgICAgICAgICAvLyBBc3NpZ24gdXNlciBJRCBvdGhlcndpc2UgdGhlIHVwZGF0ZSB3aWxsIGJlIGlnbm9yZWQgYnkgX3Byb2Nlc3NNZXRhU3ViLlxuICAgICAgICAgICAgcGFyYW1zLnN1Yi51c2VyID0gdGhpcy5fdGlub2RlLmdldEN1cnJlbnRVc2VySUQoKTtcbiAgICAgICAgICAgIGlmICghcGFyYW1zLmRlc2MpIHtcbiAgICAgICAgICAgICAgLy8gRm9yY2UgdXBkYXRlIHRvIHRvcGljJ3MgYXNjLlxuICAgICAgICAgICAgICBwYXJhbXMuZGVzYyA9IHt9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBwYXJhbXMuc3ViLl9ub0ZvcndhcmRpbmcgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuX3Byb2Nlc3NNZXRhU3ViKFtwYXJhbXMuc3ViXSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGFyYW1zLmRlc2MpIHtcbiAgICAgICAgICBpZiAoY3RybC5wYXJhbXMgJiYgY3RybC5wYXJhbXMuYWNzKSB7XG4gICAgICAgICAgICBwYXJhbXMuZGVzYy5hY3MgPSBjdHJsLnBhcmFtcy5hY3M7XG4gICAgICAgICAgICBwYXJhbXMuZGVzYy51cGRhdGVkID0gY3RybC50cztcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5fcHJvY2Vzc01ldGFEZXNjKHBhcmFtcy5kZXNjKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwYXJhbXMudGFncykge1xuICAgICAgICAgIHRoaXMuX3Byb2Nlc3NNZXRhVGFncyhwYXJhbXMudGFncyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhcmFtcy5jcmVkKSB7XG4gICAgICAgICAgdGhpcy5fcHJvY2Vzc01ldGFDcmVkcyhbcGFyYW1zLmNyZWRdLCB0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjdHJsO1xuICAgICAgfSk7XG4gIH1cbiAgLyoqXG4gICAqIFVwZGF0ZSBhY2Nlc3MgbW9kZSBvZiB0aGUgY3VycmVudCB1c2VyIG9yIG9mIGFub3RoZXIgdG9waWMgc3Vic3JpYmVyLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gVUlEIG9mIHRoZSB1c2VyIHRvIHVwZGF0ZSBvciBudWxsIHRvIHVwZGF0ZSBjdXJyZW50IHVzZXIuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1cGRhdGUgLSB0aGUgdXBkYXRlIHZhbHVlLCBmdWxsIG9yIGRlbHRhLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gcmVxdWVzdC5cbiAgICovXG4gIHVwZGF0ZU1vZGUodWlkLCB1cGRhdGUpIHtcbiAgICBjb25zdCB1c2VyID0gdWlkID8gdGhpcy5zdWJzY3JpYmVyKHVpZCkgOiBudWxsO1xuICAgIGNvbnN0IGFtID0gdXNlciA/XG4gICAgICB1c2VyLmFjcy51cGRhdGVHaXZlbih1cGRhdGUpLmdldEdpdmVuKCkgOlxuICAgICAgdGhpcy5nZXRBY2Nlc3NNb2RlKCkudXBkYXRlV2FudCh1cGRhdGUpLmdldFdhbnQoKTtcblxuICAgIHJldHVybiB0aGlzLnNldE1ldGEoe1xuICAgICAgc3ViOiB7XG4gICAgICAgIHVzZXI6IHVpZCxcbiAgICAgICAgbW9kZTogYW1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICAvKipcbiAgICogQ3JlYXRlIG5ldyB0b3BpYyBzdWJzY3JpcHRpb24uIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjc2V0TWV0YX0uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBJRCBvZiB0aGUgdXNlciB0byBpbnZpdGVcbiAgICogQHBhcmFtIHtzdHJpbmc9fSBtb2RlIC0gQWNjZXNzIG1vZGUuIDxjb2RlPm51bGw8L2NvZGU+IG1lYW5zIHRvIHVzZSBkZWZhdWx0LlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gcmVxdWVzdC5cbiAgICovXG4gIGludml0ZSh1aWQsIG1vZGUpIHtcbiAgICByZXR1cm4gdGhpcy5zZXRNZXRhKHtcbiAgICAgIHN1Yjoge1xuICAgICAgICB1c2VyOiB1aWQsXG4gICAgICAgIG1vZGU6IG1vZGVcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICAvKipcbiAgICogQXJjaGl2ZSBvciB1bi1hcmNoaXZlIHRoZSB0b3BpYy4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNzZXRNZXRhfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBhcmNoIC0gdHJ1ZSB0byBhcmNoaXZlIHRoZSB0b3BpYywgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gcmVxdWVzdC5cbiAgICovXG4gIGFyY2hpdmUoYXJjaCkge1xuICAgIGlmICh0aGlzLnByaXZhdGUgJiYgKCF0aGlzLnByaXZhdGUuYXJjaCA9PSAhYXJjaCkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoYXJjaCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNldE1ldGEoe1xuICAgICAgZGVzYzoge1xuICAgICAgICBwcml2YXRlOiB7XG4gICAgICAgICAgYXJjaDogYXJjaCA/IHRydWUgOiBDb25zdC5ERUxfQ0hBUlxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgLyoqXG4gICAqIERlbGV0ZSBtZXNzYWdlcy4gSGFyZC1kZWxldGluZyBtZXNzYWdlcyByZXF1aXJlcyBPd25lciBwZXJtaXNzaW9uLlxuICAgKiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI2RlbE1lc3NhZ2VzfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtUaW5vZGUuRGVsUmFuZ2VbXX0gcmFuZ2VzIC0gUmFuZ2VzIG9mIG1lc3NhZ2UgSURzIHRvIGRlbGV0ZS5cbiAgICogQHBhcmFtIHtib29sZWFuPX0gaGFyZCAtIEhhcmQgb3Igc29mdCBkZWxldGVcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHJlcXVlc3QuXG4gICAqL1xuICBkZWxNZXNzYWdlcyhyYW5nZXMsIGhhcmQpIHtcbiAgICBpZiAoIXRoaXMuX2F0dGFjaGVkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiQ2Fubm90IGRlbGV0ZSBtZXNzYWdlcyBpbiBpbmFjdGl2ZSB0b3BpY1wiKSk7XG4gICAgfVxuXG4gICAgLy8gU29ydCByYW5nZXMgaW4gYWNjZW5kaW5nIG9yZGVyIGJ5IGxvdywgdGhlIGRlc2NlbmRpbmcgYnkgaGkuXG4gICAgcmFuZ2VzLnNvcnQoKHIxLCByMikgPT4ge1xuICAgICAgaWYgKHIxLmxvdyA8IHIyLmxvdykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChyMS5sb3cgPT0gcjIubG93KSB7XG4gICAgICAgIHJldHVybiAhcjIuaGkgfHwgKHIxLmhpID49IHIyLmhpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcblxuICAgIC8vIFJlbW92ZSBwZW5kaW5nIG1lc3NhZ2VzIGZyb20gcmFuZ2VzIHBvc3NpYmx5IGNsaXBwaW5nIHNvbWUgcmFuZ2VzLlxuICAgIGxldCB0b3NlbmQgPSByYW5nZXMucmVkdWNlKChvdXQsIHIpID0+IHtcbiAgICAgIGlmIChyLmxvdyA8IENvbnN0LkxPQ0FMX1NFUUlEKSB7XG4gICAgICAgIGlmICghci5oaSB8fCByLmhpIDwgQ29uc3QuTE9DQUxfU0VRSUQpIHtcbiAgICAgICAgICBvdXQucHVzaChyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBDbGlwIGhpIHRvIG1heCBhbGxvd2VkIHZhbHVlLlxuICAgICAgICAgIG91dC5wdXNoKHtcbiAgICAgICAgICAgIGxvdzogci5sb3csXG4gICAgICAgICAgICBoaTogdGhpcy5fbWF4U2VxICsgMVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0O1xuICAgIH0sIFtdKTtcblxuICAgIC8vIFNlbmQge2RlbH0gbWVzc2FnZSwgcmV0dXJuIHByb21pc2VcbiAgICBsZXQgcmVzdWx0O1xuICAgIGlmICh0b3NlbmQubGVuZ3RoID4gMCkge1xuICAgICAgcmVzdWx0ID0gdGhpcy5fdGlub2RlLmRlbE1lc3NhZ2VzKHRoaXMubmFtZSwgdG9zZW5kLCBoYXJkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0ID0gUHJvbWlzZS5yZXNvbHZlKHtcbiAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgZGVsOiAwXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICAvLyBVcGRhdGUgbG9jYWwgY2FjaGUuXG4gICAgcmV0dXJuIHJlc3VsdC50aGVuKChjdHJsKSA9PiB7XG4gICAgICBpZiAoY3RybC5wYXJhbXMuZGVsID4gdGhpcy5fbWF4RGVsKSB7XG4gICAgICAgIHRoaXMuX21heERlbCA9IGN0cmwucGFyYW1zLmRlbDtcbiAgICAgIH1cblxuICAgICAgcmFuZ2VzLmZvckVhY2goKHIpID0+IHtcbiAgICAgICAgaWYgKHIuaGkpIHtcbiAgICAgICAgICB0aGlzLmZsdXNoTWVzc2FnZVJhbmdlKHIubG93LCByLmhpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmZsdXNoTWVzc2FnZShyLmxvdyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLl91cGRhdGVEZWxldGVkUmFuZ2VzKCk7XG5cbiAgICAgIGlmICh0aGlzLm9uRGF0YSkge1xuICAgICAgICAvLyBDYWxsaW5nIHdpdGggbm8gcGFyYW1ldGVycyB0byBpbmRpY2F0ZSB0aGUgbWVzc2FnZXMgd2VyZSBkZWxldGVkLlxuICAgICAgICB0aGlzLm9uRGF0YSgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGN0cmw7XG4gICAgfSk7XG4gIH1cbiAgLyoqXG4gICAqIERlbGV0ZSBhbGwgbWVzc2FnZXMuIEhhcmQtZGVsZXRpbmcgbWVzc2FnZXMgcmVxdWlyZXMgT3duZXIgcGVybWlzc2lvbi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBoYXJkRGVsIC0gdHJ1ZSBpZiBtZXNzYWdlcyBzaG91bGQgYmUgaGFyZC1kZWxldGVkLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gcmVxdWVzdC5cbiAgICovXG4gIGRlbE1lc3NhZ2VzQWxsKGhhcmREZWwpIHtcbiAgICBpZiAoIXRoaXMuX21heFNlcSB8fCB0aGlzLl9tYXhTZXEgPD0gMCkge1xuICAgICAgLy8gVGhlcmUgYXJlIG5vIG1lc3NhZ2VzIHRvIGRlbGV0ZS5cbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZGVsTWVzc2FnZXMoW3tcbiAgICAgIGxvdzogMSxcbiAgICAgIGhpOiB0aGlzLl9tYXhTZXEgKyAxLFxuICAgICAgX2FsbDogdHJ1ZVxuICAgIH1dLCBoYXJkRGVsKTtcbiAgfVxuICAvKipcbiAgICogRGVsZXRlIG11bHRpcGxlIG1lc3NhZ2VzIGRlZmluZWQgYnkgdGhlaXIgSURzLiBIYXJkLWRlbGV0aW5nIG1lc3NhZ2VzIHJlcXVpcmVzIE93bmVyIHBlcm1pc3Npb24uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7VGlub2RlLkRlbFJhbmdlW119IGxpc3QgLSBsaXN0IG9mIHNlcSBJRHMgdG8gZGVsZXRlXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IGhhcmREZWwgLSB0cnVlIGlmIG1lc3NhZ2VzIHNob3VsZCBiZSBoYXJkLWRlbGV0ZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byByZXF1ZXN0LlxuICAgKi9cbiAgZGVsTWVzc2FnZXNMaXN0KGxpc3QsIGhhcmREZWwpIHtcbiAgICAvLyBTb3J0IHRoZSBsaXN0IGluIGFzY2VuZGluZyBvcmRlclxuICAgIGxpc3Quc29ydCgoYSwgYikgPT4gYSAtIGIpO1xuICAgIC8vIENvbnZlcnQgdGhlIGFycmF5IG9mIElEcyB0byByYW5nZXMuXG4gICAgbGV0IHJhbmdlcyA9IGxpc3QucmVkdWNlKChvdXQsIGlkKSA9PiB7XG4gICAgICBpZiAob3V0Lmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIC8vIEZpcnN0IGVsZW1lbnQuXG4gICAgICAgIG91dC5wdXNoKHtcbiAgICAgICAgICBsb3c6IGlkXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IHByZXYgPSBvdXRbb3V0Lmxlbmd0aCAtIDFdO1xuICAgICAgICBpZiAoKCFwcmV2LmhpICYmIChpZCAhPSBwcmV2LmxvdyArIDEpKSB8fCAoaWQgPiBwcmV2LmhpKSkge1xuICAgICAgICAgIC8vIE5ldyByYW5nZS5cbiAgICAgICAgICBvdXQucHVzaCh7XG4gICAgICAgICAgICBsb3c6IGlkXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gRXhwYW5kIGV4aXN0aW5nIHJhbmdlLlxuICAgICAgICAgIHByZXYuaGkgPSBwcmV2LmhpID8gTWF0aC5tYXgocHJldi5oaSwgaWQgKyAxKSA6IGlkICsgMTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG91dDtcbiAgICB9LCBbXSk7XG4gICAgLy8gU2VuZCB7ZGVsfSBtZXNzYWdlLCByZXR1cm4gcHJvbWlzZVxuICAgIHJldHVybiB0aGlzLmRlbE1lc3NhZ2VzKHJhbmdlcywgaGFyZERlbCk7XG4gIH1cbiAgLyoqXG4gICAqIERlbGV0ZSB0b3BpYy4gUmVxdWlyZXMgT3duZXIgcGVybWlzc2lvbi4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNkZWxUb3BpY30uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gaGFyZCAtIGhhZC1kZWxldGUgdG9waWMuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byB0aGUgcmVxdWVzdC5cbiAgICovXG4gIGRlbFRvcGljKGhhcmQpIHtcbiAgICBpZiAodGhpcy5fZGVsZXRlZCkge1xuICAgICAgLy8gVGhlIHRvcGljIGlzIGFscmVhZHkgZGVsZXRlZCBhdCB0aGUgc2VydmVyLCBqdXN0IHJlbW92ZSBmcm9tIERCLlxuICAgICAgdGhpcy5fZ29uZSgpO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShudWxsKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fdGlub2RlLmRlbFRvcGljKHRoaXMubmFtZSwgaGFyZCkudGhlbigoY3RybCkgPT4ge1xuICAgICAgdGhpcy5fZGVsZXRlZCA9IHRydWU7XG4gICAgICB0aGlzLl9yZXNldFN1YigpO1xuICAgICAgdGhpcy5fZ29uZSgpO1xuICAgICAgcmV0dXJuIGN0cmw7XG4gICAgfSk7XG4gIH1cbiAgLyoqXG4gICAqIERlbGV0ZSBzdWJzY3JpcHRpb24uIFJlcXVpcmVzIFNoYXJlIHBlcm1pc3Npb24uIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjZGVsU3Vic2NyaXB0aW9ufS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVzZXIgLSBJRCBvZiB0aGUgdXNlciB0byByZW1vdmUgc3Vic2NyaXB0aW9uIGZvci5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHJlcXVlc3QuXG4gICAqL1xuICBkZWxTdWJzY3JpcHRpb24odXNlcikge1xuICAgIGlmICghdGhpcy5fYXR0YWNoZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJDYW5ub3QgZGVsZXRlIHN1YnNjcmlwdGlvbiBpbiBpbmFjdGl2ZSB0b3BpY1wiKSk7XG4gICAgfVxuICAgIC8vIFNlbmQge2RlbH0gbWVzc2FnZSwgcmV0dXJuIHByb21pc2VcbiAgICByZXR1cm4gdGhpcy5fdGlub2RlLmRlbFN1YnNjcmlwdGlvbih0aGlzLm5hbWUsIHVzZXIpLnRoZW4oKGN0cmwpID0+IHtcbiAgICAgIC8vIFJlbW92ZSB0aGUgb2JqZWN0IGZyb20gdGhlIHN1YnNjcmlwdGlvbiBjYWNoZTtcbiAgICAgIGRlbGV0ZSB0aGlzLl91c2Vyc1t1c2VyXTtcbiAgICAgIC8vIE5vdGlmeSBsaXN0ZW5lcnNcbiAgICAgIGlmICh0aGlzLm9uU3Vic1VwZGF0ZWQpIHtcbiAgICAgICAgdGhpcy5vblN1YnNVcGRhdGVkKE9iamVjdC5rZXlzKHRoaXMuX3VzZXJzKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY3RybDtcbiAgICB9KTtcbiAgfVxuICAvKipcbiAgICogU2VuZCBhIHJlYWQvcmVjdiBub3RpZmljYXRpb24uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB3aGF0IC0gd2hhdCBub3RpZmljYXRpb24gdG8gc2VuZDogPGNvZGU+cmVjdjwvY29kZT4sIDxjb2RlPnJlYWQ8L2NvZGU+LlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2VxIC0gSUQgb3IgdGhlIG1lc3NhZ2UgcmVhZCBvciByZWNlaXZlZC5cbiAgICovXG4gIG5vdGUod2hhdCwgc2VxKSB7XG4gICAgaWYgKCF0aGlzLl9hdHRhY2hlZCkge1xuICAgICAgLy8gQ2Fubm90IHNlbmRpbmcge25vdGV9IG9uIGFuIGluYWN0aXZlIHRvcGljXCIuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gVXBkYXRlIGxvY2FsIGNhY2hlIHdpdGggdGhlIG5ldyBjb3VudC5cbiAgICBjb25zdCB1c2VyID0gdGhpcy5fdXNlcnNbdGhpcy5fdGlub2RlLmdldEN1cnJlbnRVc2VySUQoKV07XG4gICAgbGV0IHVwZGF0ZSA9IGZhbHNlO1xuICAgIGlmICh1c2VyKSB7XG4gICAgICAvLyBTZWxmLXN1YnNjcmlwdGlvbiBpcyBmb3VuZC5cbiAgICAgIGlmICghdXNlclt3aGF0XSB8fCB1c2VyW3doYXRdIDwgc2VxKSB7XG4gICAgICAgIHVzZXJbd2hhdF0gPSBzZXE7XG4gICAgICAgIHVwZGF0ZSA9IHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFNlbGYtc3Vic2NyaXB0aW9uIGlzIG5vdCBmb3VuZC5cbiAgICAgIHVwZGF0ZSA9ICh0aGlzW3doYXRdIHwgMCkgPCBzZXE7XG4gICAgfVxuXG4gICAgaWYgKHVwZGF0ZSkge1xuICAgICAgLy8gU2VuZCBub3RpZmljYXRpb24gdG8gdGhlIHNlcnZlci5cbiAgICAgIHRoaXMuX3Rpbm9kZS5ub3RlKHRoaXMubmFtZSwgd2hhdCwgc2VxKTtcbiAgICAgIC8vIFVwZGF0ZSBsb2NhbGx5IGNhY2hlZCBjb250YWN0IHdpdGggdGhlIG5ldyBjb3VudC5cbiAgICAgIHRoaXMuX3VwZGF0ZVJlYWRSZWN2KHdoYXQsIHNlcSk7XG5cbiAgICAgIGlmICh0aGlzLmFjcyAhPSBudWxsICYmICF0aGlzLmFjcy5pc011dGVkKCkpIHtcbiAgICAgICAgY29uc3QgbWUgPSB0aGlzLl90aW5vZGUuZ2V0TWVUb3BpYygpO1xuICAgICAgICAvLyBTZW50IGEgbm90aWZpY2F0aW9uIHRvICdtZScgbGlzdGVuZXJzLlxuICAgICAgICBtZS5fcmVmcmVzaENvbnRhY3Qod2hhdCwgdGhpcyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSAncmVjdicgcmVjZWlwdC4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNub3RlUmVjdn0uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXEgLSBJRCBvZiB0aGUgbWVzc2FnZSB0byBha25vd2xlZGdlLlxuICAgKi9cbiAgbm90ZVJlY3Yoc2VxKSB7XG4gICAgdGhpcy5ub3RlKCdyZWN2Jywgc2VxKTtcbiAgfVxuICAvKipcbiAgICogU2VuZCBhICdyZWFkJyByZWNlaXB0LiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI25vdGVSZWFkfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHNlcSAtIElEIG9mIHRoZSBtZXNzYWdlIHRvIGFrbm93bGVkZ2Ugb3IgMC91bmRlZmluZWQgdG8gYWNrbm93bGVkZ2UgdGhlIGxhdGVzdCBtZXNzYWdlcy5cbiAgICovXG4gIG5vdGVSZWFkKHNlcSkge1xuICAgIHNlcSA9IHNlcSB8fCB0aGlzLl9tYXhTZXE7XG4gICAgaWYgKHNlcSA+IDApIHtcbiAgICAgIHRoaXMubm90ZSgncmVhZCcsIHNlcSk7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBTZW5kIGEga2V5LXByZXNzIG5vdGlmaWNhdGlvbi4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNub3RlS2V5UHJlc3N9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKi9cbiAgbm90ZUtleVByZXNzKCkge1xuICAgIGlmICh0aGlzLl9hdHRhY2hlZCkge1xuICAgICAgdGhpcy5fdGlub2RlLm5vdGVLZXlQcmVzcyh0aGlzLm5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl90aW5vZGUubG9nZ2VyKFwiSU5GTzogQ2Fubm90IHNlbmQgbm90aWZpY2F0aW9uIGluIGluYWN0aXZlIHRvcGljXCIpO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICogU2VuZCBhIHtub3RlIHdoYXQ9J2NhbGwnfS4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSN2aWRlb0NhbGx9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZ0IC0gQ2FsbCBldmVudC5cbiAgICogQHBhcmFtIHtpbnR9IHNlcSAtIElEIG9mIHRoZSBjYWxsIG1lc3NhZ2UgdGhlIGV2ZW50IHBlcnRhaW5zIHRvLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGF5bG9hZCAtIFBheWxvYWQgYXNzb2NpYXRlZCB3aXRoIHRoaXMgZXZlbnQgKGUuZy4gU0RQIHN0cmluZykuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIChmb3Igc29tZSBjYWxsIGV2ZW50cykgd2hpY2ggd2lsbFxuICAgKiAgICAgICAgICAgICAgICAgICAgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseVxuICAgKi9cbiAgdmlkZW9DYWxsKGV2dCwgc2VxLCBwYXlsb2FkKSB7XG4gICAgaWYgKCF0aGlzLl9hdHRhY2hlZCAmJiAhWydyaW5naW5nJywgJ2hhbmctdXAnXS5pbmNsdWRlcyhldnQpKSB7XG4gICAgICAvLyBDYW5ub3Qge2NhbGx9IG9uIGFuIGluYWN0aXZlIHRvcGljXCIuXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl90aW5vZGUudmlkZW9DYWxsKHRoaXMubmFtZSwgc2VxLCBldnQsIHBheWxvYWQpO1xuICB9XG5cbiAgLy8gVXBkYXRlIGNhY2hlZCByZWFkL3JlY3YvdW5yZWFkIGNvdW50cy5cbiAgX3VwZGF0ZVJlYWRSZWN2KHdoYXQsIHNlcSwgdHMpIHtcbiAgICBsZXQgb2xkVmFsLCBkb1VwZGF0ZSA9IGZhbHNlO1xuXG4gICAgc2VxID0gc2VxIHwgMDtcbiAgICB0aGlzLnNlcSA9IHRoaXMuc2VxIHwgMDtcbiAgICB0aGlzLnJlYWQgPSB0aGlzLnJlYWQgfCAwO1xuICAgIHRoaXMucmVjdiA9IHRoaXMucmVjdiB8IDA7XG4gICAgc3dpdGNoICh3aGF0KSB7XG4gICAgICBjYXNlICdyZWN2JzpcbiAgICAgICAgb2xkVmFsID0gdGhpcy5yZWN2O1xuICAgICAgICB0aGlzLnJlY3YgPSBNYXRoLm1heCh0aGlzLnJlY3YsIHNlcSk7XG4gICAgICAgIGRvVXBkYXRlID0gKG9sZFZhbCAhPSB0aGlzLnJlY3YpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3JlYWQnOlxuICAgICAgICBvbGRWYWwgPSB0aGlzLnJlYWQ7XG4gICAgICAgIHRoaXMucmVhZCA9IE1hdGgubWF4KHRoaXMucmVhZCwgc2VxKTtcbiAgICAgICAgZG9VcGRhdGUgPSAob2xkVmFsICE9IHRoaXMucmVhZCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbXNnJzpcbiAgICAgICAgb2xkVmFsID0gdGhpcy5zZXE7XG4gICAgICAgIHRoaXMuc2VxID0gTWF0aC5tYXgodGhpcy5zZXEsIHNlcSk7XG4gICAgICAgIGlmICghdGhpcy50b3VjaGVkIHx8IHRoaXMudG91Y2hlZCA8IHRzKSB7XG4gICAgICAgICAgdGhpcy50b3VjaGVkID0gdHM7XG4gICAgICAgIH1cbiAgICAgICAgZG9VcGRhdGUgPSAob2xkVmFsICE9IHRoaXMuc2VxKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgLy8gU2FuaXR5IGNoZWNrcy5cbiAgICBpZiAodGhpcy5yZWN2IDwgdGhpcy5yZWFkKSB7XG4gICAgICB0aGlzLnJlY3YgPSB0aGlzLnJlYWQ7XG4gICAgICBkb1VwZGF0ZSA9IHRydWU7XG4gICAgfVxuICAgIGlmICh0aGlzLnNlcSA8IHRoaXMucmVjdikge1xuICAgICAgdGhpcy5zZXEgPSB0aGlzLnJlY3Y7XG4gICAgICBpZiAoIXRoaXMudG91Y2hlZCB8fCB0aGlzLnRvdWNoZWQgPCB0cykge1xuICAgICAgICB0aGlzLnRvdWNoZWQgPSB0cztcbiAgICAgIH1cbiAgICAgIGRvVXBkYXRlID0gdHJ1ZTtcbiAgICB9XG4gICAgdGhpcy51bnJlYWQgPSB0aGlzLnNlcSAtIHRoaXMucmVhZDtcbiAgICByZXR1cm4gZG9VcGRhdGU7XG4gIH1cbiAgLyoqXG4gICAqIEdldCB1c2VyIGRlc2NyaXB0aW9uIGZyb20gZ2xvYmFsIGNhY2hlLiBUaGUgdXNlciBkb2VzIG5vdCBuZWVkIHRvIGJlIGFcbiAgICogc3Vic2NyaWJlciBvZiB0aGlzIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gSUQgb2YgdGhlIHVzZXIgdG8gZmV0Y2guXG4gICAqIEByZXR1cm4ge09iamVjdH0gdXNlciBkZXNjcmlwdGlvbiBvciB1bmRlZmluZWQuXG4gICAqL1xuICB1c2VyRGVzYyh1aWQpIHtcbiAgICAvLyBUT0RPOiBoYW5kbGUgYXN5bmNocm9ub3VzIHJlcXVlc3RzXG4gICAgY29uc3QgdXNlciA9IHRoaXMuX2NhY2hlR2V0VXNlcih1aWQpO1xuICAgIGlmICh1c2VyKSB7XG4gICAgICByZXR1cm4gdXNlcjsgLy8gUHJvbWlzZS5yZXNvbHZlKHVzZXIpXG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBHZXQgZGVzY3JpcHRpb24gb2YgdGhlIHAycCBwZWVyIGZyb20gc3Vic2NyaXB0aW9uIGNhY2hlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJuIHtPYmplY3R9IHBlZXIncyBkZXNjcmlwdGlvbiBvciB1bmRlZmluZWQuXG4gICAqL1xuICBwMnBQZWVyRGVzYygpIHtcbiAgICBpZiAoIXRoaXMuaXNQMlBUeXBlKCkpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl91c2Vyc1t0aGlzLm5hbWVdO1xuICB9XG4gIC8qKlxuICAgKiBJdGVyYXRlIG92ZXIgY2FjaGVkIHN1YnNjcmliZXJzLiBJZiBjYWxsYmFjayBpcyB1bmRlZmluZWQsIHVzZSB0aGlzLm9uTWV0YVN1Yi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSBDYWxsYmFjayB3aGljaCB3aWxsIHJlY2VpdmUgc3Vic2NyaWJlcnMgb25lIGJ5IG9uZS5cbiAgICogQHBhcmFtIHtPYmplY3Q9fSBjb250ZXh0IC0gVmFsdWUgb2YgYHRoaXNgIGluc2lkZSB0aGUgYGNhbGxiYWNrYC5cbiAgICovXG4gIHN1YnNjcmliZXJzKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgY29uc3QgY2IgPSAoY2FsbGJhY2sgfHwgdGhpcy5vbk1ldGFTdWIpO1xuICAgIGlmIChjYikge1xuICAgICAgZm9yIChsZXQgaWR4IGluIHRoaXMuX3VzZXJzKSB7XG4gICAgICAgIGNiLmNhbGwoY29udGV4dCwgdGhpcy5fdXNlcnNbaWR4XSwgaWR4LCB0aGlzLl91c2Vycyk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBHZXQgYSBjb3B5IG9mIGNhY2hlZCB0YWdzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJuIHtBcnJheS48c3RyaW5nPn0gYSBjb3B5IG9mIHRhZ3NcbiAgICovXG4gIHRhZ3MoKSB7XG4gICAgLy8gUmV0dXJuIGEgY29weS5cbiAgICByZXR1cm4gdGhpcy5fdGFncy5zbGljZSgwKTtcbiAgfVxuICAvKipcbiAgICogR2V0IGNhY2hlZCBzdWJzY3JpcHRpb24gZm9yIHRoZSBnaXZlbiB1c2VyIElELlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gaWQgb2YgdGhlIHVzZXIgdG8gcXVlcnkgZm9yXG4gICAqIEByZXR1cm4gdXNlciBkZXNjcmlwdGlvbiBvciB1bmRlZmluZWQuXG4gICAqL1xuICBzdWJzY3JpYmVyKHVpZCkge1xuICAgIHJldHVybiB0aGlzLl91c2Vyc1t1aWRdO1xuICB9XG4gIC8qKlxuICAgKiBJdGVyYXRlIG92ZXIgdmVyc2lvbnMgb2YgPGNvZGU+bWVzc2FnZTwvY29kZT46IGNhbGwgPGNvZGU+Y2FsbGJhY2s8L2NvZGU+IGZvciBlYWNoIG1lc3NhZ2UuXG4gICAqIElmIDxjb2RlPmNhbGxiYWNrPC9jb2RlPiBpcyB1bmRlZmluZWQsIGRvZXMgbm90aGluZy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtUaW5vZGUuRm9yRWFjaENhbGxiYWNrVHlwZX0gY2FsbGJhY2sgLSBDYWxsYmFjayB3aGljaCB3aWxsIHJlY2VpdmUgbWVzc2FnZXMgb25lIGJ5IG9uZS4gU2VlIHtAbGluayBUaW5vZGUuQ0J1ZmZlciNmb3JFYWNofVxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCAtIFZhbHVlIG9mIGB0aGlzYCBpbnNpZGUgdGhlIGBjYWxsYmFja2AuXG4gICAqL1xuICBtZXNzYWdlVmVyc2lvbnMobWVzc2FnZSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICAvLyBObyBjYWxsYmFjaz8gV2UgYXJlIGRvbmUgdGhlbi5cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgb3JpZ1NlcSA9IHRoaXMuX2lzUmVwbGFjZW1lbnRNc2cobWVzc2FnZSkgPyBwYXJzZUludChtZXNzYWdlLmhlYWQucmVwbGFjZS5zcGxpdCgnOicpWzFdKSA6IG1lc3NhZ2Uuc2VxO1xuICAgIGNvbnN0IHZlcnNpb25zID0gdGhpcy5fbWVzc2FnZVZlcnNpb25zW29yaWdTZXFdO1xuICAgIGlmICghdmVyc2lvbnMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmVyc2lvbnMuZm9yRWFjaChjYWxsYmFjaywgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGNvbnRleHQpO1xuICB9XG4gIC8qKlxuICAgKiBJdGVyYXRlIG92ZXIgY2FjaGVkIG1lc3NhZ2VzOiBjYWxsIDxjb2RlPmNhbGxiYWNrPC9jb2RlPiBmb3IgZWFjaCBtZXNzYWdlIGluIHRoZSByYW5nZSBbc2luY2VJZHgsIGJlZm9yZUlkeCkuXG4gICAqIElmIDxjb2RlPmNhbGxiYWNrPC9jb2RlPiBpcyB1bmRlZmluZWQsIHVzZSA8Y29kZT50aGlzLm9uRGF0YTwvY29kZT4uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7VGlub2RlLkZvckVhY2hDYWxsYmFja1R5cGV9IGNhbGxiYWNrIC0gQ2FsbGJhY2sgd2hpY2ggd2lsbCByZWNlaXZlIG1lc3NhZ2VzIG9uZSBieSBvbmUuIFNlZSB7QGxpbmsgVGlub2RlLkNCdWZmZXIjZm9yRWFjaH1cbiAgICogQHBhcmFtIHtudW1iZXJ9IHNpbmNlSWQgLSBPcHRpb25hbCBzZXFJZCB0byBzdGFydCBpdGVyYXRpbmcgZnJvbSAoaW5jbHVzaXZlKS5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGJlZm9yZUlkIC0gT3B0aW9uYWwgc2VxSWQgdG8gc3RvcCBpdGVyYXRpbmcgYmVmb3JlIGl0IGlzIHJlYWNoZWQgKGV4Y2x1c2l2ZSkuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gVmFsdWUgb2YgYHRoaXNgIGluc2lkZSB0aGUgYGNhbGxiYWNrYC5cbiAgICovXG4gIG1lc3NhZ2VzKGNhbGxiYWNrLCBzaW5jZUlkLCBiZWZvcmVJZCwgY29udGV4dCkge1xuICAgIGNvbnN0IGNiID0gKGNhbGxiYWNrIHx8IHRoaXMub25EYXRhKTtcbiAgICBpZiAoY2IpIHtcbiAgICAgIGNvbnN0IHN0YXJ0SWR4ID0gdHlwZW9mIHNpbmNlSWQgPT0gJ251bWJlcicgPyB0aGlzLl9tZXNzYWdlcy5maW5kKHtcbiAgICAgICAgc2VxOiBzaW5jZUlkXG4gICAgICB9LCB0cnVlKSA6IHVuZGVmaW5lZDtcbiAgICAgIGNvbnN0IGJlZm9yZUlkeCA9IHR5cGVvZiBiZWZvcmVJZCA9PSAnbnVtYmVyJyA/IHRoaXMuX21lc3NhZ2VzLmZpbmQoe1xuICAgICAgICBzZXE6IGJlZm9yZUlkXG4gICAgICB9LCB0cnVlKSA6IHVuZGVmaW5lZDtcbiAgICAgIGlmIChzdGFydElkeCAhPSAtMSAmJiBiZWZvcmVJZHggIT0gLTEpIHtcbiAgICAgICAgLy8gU3RlcCAxLiBGaWx0ZXIgb3V0IGFsbCByZXBsYWNlbWVudCBtZXNzYWdlcyBhbmRcbiAgICAgICAgLy8gc2F2ZSBkaXNwbGF5YWJsZSBtZXNzYWdlcyBpbiBhIHRlbXBvcmFyeSBidWZmZXIuXG4gICAgICAgIGxldCBtc2dzID0gW107XG4gICAgICAgIHRoaXMuX21lc3NhZ2VzLmZvckVhY2goKG1zZywgdW51c2VkMSwgdW51c2VkMiwgaSkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLl9pc1JlcGxhY2VtZW50TXNnKG1zZykpIHtcbiAgICAgICAgICAgIC8vIFNraXAgcmVwbGFjZW1lbnRzLlxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBtc2dzLnB1c2goe1xuICAgICAgICAgICAgZGF0YTogdGhpcy5sYXRlc3RNc2dWZXJzaW9uKG1zZy5zZXEpIHx8IG1zZyxcbiAgICAgICAgICAgIGlkeDogaVxuICAgICAgICAgIH0pO1xuICAgICAgICB9LCBzdGFydElkeCwgYmVmb3JlSWR4LCB7fSk7XG4gICAgICAgIC8vIFN0ZXAgMi4gTG9vcCBvdmVyIGRpc3BsYXlibGUgbWVzc2FnZXMgaW52b2tpbmcgY2Igb24gZWFjaCBvZiB0aGVtLlxuICAgICAgICBtc2dzLmZvckVhY2goKHZhbCwgaSkgPT4ge1xuICAgICAgICAgIGNiLmNhbGwoY29udGV4dCwgdmFsLmRhdGEsXG4gICAgICAgICAgICAoaSA+IDAgPyBtc2dzW2kgLSAxXS5kYXRhIDogdW5kZWZpbmVkKSxcbiAgICAgICAgICAgIChpIDwgbXNncy5sZW5ndGggLSAxID8gbXNnc1tpICsgMV0uZGF0YSA6IHVuZGVmaW5lZCksIHZhbC5pZHgpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLyoqXG4gICAqIEdldCB0aGUgbWVzc2FnZSBmcm9tIGNhY2hlIGJ5IDxjb2RlPnNlcTwvY29kZT4uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXEgLSBtZXNzYWdlIHNlcUlkIHRvIHNlYXJjaCBmb3IuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IHRoZSBtZXNzYWdlIHdpdGggdGhlIGdpdmVuIDxjb2RlPnNlcTwvY29kZT4gb3IgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPiwgaWYgbm8gc3VjaCBtZXNzYWdlIGlzIGZvdW5kLlxuICAgKi9cbiAgZmluZE1lc3NhZ2Uoc2VxKSB7XG4gICAgY29uc3QgaWR4ID0gdGhpcy5fbWVzc2FnZXMuZmluZCh7XG4gICAgICBzZXE6IHNlcVxuICAgIH0pO1xuICAgIGlmIChpZHggPj0gMCkge1xuICAgICAgcmV0dXJuIHRoaXMuX21lc3NhZ2VzLmdldEF0KGlkeCk7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgLyoqXG4gICAqIEdldCB0aGUgbW9zdCByZWNlbnQgbWVzc2FnZSBmcm9tIGNhY2hlLiBUaGlzIG1ldGhvZCBjb3VudHMgYWxsIG1lc3NhZ2VzLCBpbmNsdWRpbmcgZGVsZXRlZCByYW5nZXMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVufSBza2lwRGVsZXRlZCAtIGlmIHRoZSBsYXN0IG1lc3NhZ2UgaXMgYSBkZWxldGVkIHJhbmdlLCBnZXQgdGhlIG9uZSBiZWZvcmUgaXQuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IHRoZSBtb3N0IHJlY2VudCBjYWNoZWQgbWVzc2FnZSBvciA8Y29kZT51bmRlZmluZWQ8L2NvZGU+LCBpZiBubyBtZXNzYWdlcyBhcmUgY2FjaGVkLlxuICAgKi9cbiAgbGF0ZXN0TWVzc2FnZShza2lwRGVsZXRlZCkge1xuICAgIGNvbnN0IG1zZyA9IHRoaXMuX21lc3NhZ2VzLmdldExhc3QoKTtcbiAgICBpZiAoIXNraXBEZWxldGVkIHx8ICFtc2cgfHwgbXNnLl9zdGF0dXMgIT0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfREVMX1JBTkdFKSB7XG4gICAgICByZXR1cm4gbXNnO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fbWVzc2FnZXMuZ2V0TGFzdCgxKTtcbiAgfVxuICAvKipcbiAgICogR2V0IHRoZSBsYXRlc3QgdmVyc2lvbiBmb3IgbWVzc2FnZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHNlcSAtIG9yaWdpbmFsIHNlcSBJRCBvZiB0aGUgbWVzc2FnZS5cbiAgICogQHJldHVybnMge09iamVjdH0gdGhlIGxhdGVzdCB2ZXJzaW9uIG9mIHRoZSBtZXNzYWdlIG9yIG51bGwgaWYgbWVzc2FnZSBub3QgZm91bmQuXG4gICAqL1xuICBsYXRlc3RNc2dWZXJzaW9uKHNlcSkge1xuICAgIGNvbnN0IHZlcnNpb25zID0gdGhpcy5fbWVzc2FnZVZlcnNpb25zW3NlcV07XG4gICAgcmV0dXJuIHZlcnNpb25zID8gdmVyc2lvbnMuZ2V0TGFzdCgpIDogbnVsbDtcbiAgfVxuICAvKipcbiAgICogR2V0IHRoZSBtYXhpbXVtIGNhY2hlZCBzZXEgSUQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IHRoZSBncmVhdGVzdCBzZXEgSUQgaW4gY2FjaGUuXG4gICAqL1xuICBtYXhNc2dTZXEoKSB7XG4gICAgcmV0dXJuIHRoaXMuX21heFNlcTtcbiAgfVxuICAvKipcbiAgICogR2V0IHRoZSBtYXhpbXVtIGRlbGV0aW9uIElELlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSB0aGUgZ3JlYXRlc3QgZGVsZXRpb24gSUQuXG4gICAqL1xuICBtYXhDbGVhcklkKCkge1xuICAgIHJldHVybiB0aGlzLl9tYXhEZWw7XG4gIH1cbiAgLyoqXG4gICAqIEdldCB0aGUgbnVtYmVyIG9mIG1lc3NhZ2VzIGluIHRoZSBjYWNoZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHJldHVybnMge251bWJlcn0gY291bnQgb2YgY2FjaGVkIG1lc3NhZ2VzLlxuICAgKi9cbiAgbWVzc2FnZUNvdW50KCkge1xuICAgIHJldHVybiB0aGlzLl9tZXNzYWdlcy5sZW5ndGgoKTtcbiAgfVxuICAvKipcbiAgICogSXRlcmF0ZSBvdmVyIGNhY2hlZCB1bnNlbnQgbWVzc2FnZXMuIFdyYXBzIHtAbGluayBUaW5vZGUuVG9waWMjbWVzc2FnZXN9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAtIENhbGxiYWNrIHdoaWNoIHdpbGwgcmVjZWl2ZSBtZXNzYWdlcyBvbmUgYnkgb25lLiBTZWUge0BsaW5rIFRpbm9kZS5DQnVmZmVyI2ZvckVhY2h9XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gVmFsdWUgb2YgPGNvZGU+dGhpczwvY29kZT4gaW5zaWRlIHRoZSA8Y29kZT5jYWxsYmFjazwvY29kZT4uXG4gICAqL1xuICBxdWV1ZWRNZXNzYWdlcyhjYWxsYmFjaywgY29udGV4dCkge1xuICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbGxiYWNrIG11c3QgYmUgcHJvdmlkZWRcIik7XG4gICAgfVxuICAgIHRoaXMubWVzc2FnZXMoY2FsbGJhY2ssIENvbnN0LkxPQ0FMX1NFUUlELCB1bmRlZmluZWQsIGNvbnRleHQpO1xuICB9XG4gIC8qKlxuICAgKiBHZXQgdGhlIG51bWJlciBvZiB0b3BpYyBzdWJzY3JpYmVycyB3aG8gbWFya2VkIHRoaXMgbWVzc2FnZSBhcyBlaXRoZXIgcmVjdiBvciByZWFkXG4gICAqIEN1cnJlbnQgdXNlciBpcyBleGNsdWRlZCBmcm9tIHRoZSBjb3VudC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHdoYXQgLSB3aGF0IGFjdGlvbiB0byBjb25zaWRlcjogcmVjZWl2ZWQgPGNvZGU+XCJyZWN2XCI8L2NvZGU+IG9yIHJlYWQgPGNvZGU+XCJyZWFkXCI8L2NvZGU+LlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2VxIC0gSUQgb3IgdGhlIG1lc3NhZ2UgcmVhZCBvciByZWNlaXZlZC5cbiAgICpcbiAgICogQHJldHVybnMge251bWJlcn0gdGhlIG51bWJlciBvZiBzdWJzY3JpYmVycyB3aG8gbWFya2VkIHRoZSBtZXNzYWdlIHdpdGggdGhlIGdpdmVuIElEIGFzIHJlYWQgb3IgcmVjZWl2ZWQuXG4gICAqL1xuICBtc2dSZWNlaXB0Q291bnQod2hhdCwgc2VxKSB7XG4gICAgbGV0IGNvdW50ID0gMDtcbiAgICBpZiAoc2VxID4gMCkge1xuICAgICAgY29uc3QgbWUgPSB0aGlzLl90aW5vZGUuZ2V0Q3VycmVudFVzZXJJRCgpO1xuICAgICAgZm9yIChsZXQgaWR4IGluIHRoaXMuX3VzZXJzKSB7XG4gICAgICAgIGNvbnN0IHVzZXIgPSB0aGlzLl91c2Vyc1tpZHhdO1xuICAgICAgICBpZiAodXNlci51c2VyICE9PSBtZSAmJiB1c2VyW3doYXRdID49IHNlcSkge1xuICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvdW50O1xuICB9XG4gIC8qKlxuICAgKiBHZXQgdGhlIG51bWJlciBvZiB0b3BpYyBzdWJzY3JpYmVycyB3aG8gbWFya2VkIHRoaXMgbWVzc2FnZSAoYW5kIGFsbCBvbGRlciBtZXNzYWdlcykgYXMgcmVhZC5cbiAgICogVGhlIGN1cnJlbnQgdXNlciBpcyBleGNsdWRlZCBmcm9tIHRoZSBjb3VudC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHNlcSAtIG1lc3NhZ2UgaWQgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IG51bWJlciBvZiBzdWJzY3JpYmVycyB3aG8gY2xhaW0gdG8gaGF2ZSByZWNlaXZlZCB0aGUgbWVzc2FnZS5cbiAgICovXG4gIG1zZ1JlYWRDb3VudChzZXEpIHtcbiAgICByZXR1cm4gdGhpcy5tc2dSZWNlaXB0Q291bnQoJ3JlYWQnLCBzZXEpO1xuICB9XG4gIC8qKlxuICAgKiBHZXQgdGhlIG51bWJlciBvZiB0b3BpYyBzdWJzY3JpYmVycyB3aG8gbWFya2VkIHRoaXMgbWVzc2FnZSAoYW5kIGFsbCBvbGRlciBtZXNzYWdlcykgYXMgcmVjZWl2ZWQuXG4gICAqIFRoZSBjdXJyZW50IHVzZXIgaXMgZXhjbHVkZWQgZnJvbSB0aGUgY291bnQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXEgLSBNZXNzYWdlIGlkIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBOdW1iZXIgb2Ygc3Vic2NyaWJlcnMgd2hvIGNsYWltIHRvIGhhdmUgcmVjZWl2ZWQgdGhlIG1lc3NhZ2UuXG4gICAqL1xuICBtc2dSZWN2Q291bnQoc2VxKSB7XG4gICAgcmV0dXJuIHRoaXMubXNnUmVjZWlwdENvdW50KCdyZWN2Jywgc2VxKTtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgY2FjaGVkIG1lc3NhZ2UgSURzIGluZGljYXRlIHRoYXQgdGhlIHNlcnZlciBtYXkgaGF2ZSBtb3JlIG1lc3NhZ2VzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IG5ld2VyIC0gaWYgPGNvZGU+dHJ1ZTwvY29kZT4sIGNoZWNrIGZvciBuZXdlciBtZXNzYWdlcyBvbmx5LlxuICAgKi9cbiAgbXNnSGFzTW9yZU1lc3NhZ2VzKG5ld2VyKSB7XG4gICAgcmV0dXJuIG5ld2VyID8gdGhpcy5zZXEgPiB0aGlzLl9tYXhTZXEgOlxuICAgICAgLy8gX21pblNlcSBjb3VsZCBiZSBtb3JlIHRoYW4gMSwgYnV0IGVhcmxpZXIgbWVzc2FnZXMgY291bGQgaGF2ZSBiZWVuIGRlbGV0ZWQuXG4gICAgICAodGhpcy5fbWluU2VxID4gMSAmJiAhdGhpcy5fbm9FYXJsaWVyTXNncyk7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiBzZXEgSWQgaXMgaWQgb2YgdGhlIG1vc3QgcmVjZW50IG1lc3NhZ2UuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXFJZCBpZCBvZiB0aGUgbWVzc2FnZSB0byBjaGVja1xuICAgKi9cbiAgaXNOZXdNZXNzYWdlKHNlcUlkKSB7XG4gICAgcmV0dXJuIHRoaXMuX21heFNlcSA8PSBzZXFJZDtcbiAgfVxuICAvKipcbiAgICogUmVtb3ZlIG9uZSBtZXNzYWdlIGZyb20gbG9jYWwgY2FjaGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXFJZCBpZCBvZiB0aGUgbWVzc2FnZSB0byByZW1vdmUgZnJvbSBjYWNoZS5cbiAgICogQHJldHVybnMge01lc3NhZ2V9IHJlbW92ZWQgbWVzc2FnZSBvciB1bmRlZmluZWQgaWYgc3VjaCBtZXNzYWdlIHdhcyBub3QgZm91bmQuXG4gICAqL1xuICBmbHVzaE1lc3NhZ2Uoc2VxSWQpIHtcbiAgICBjb25zdCBpZHggPSB0aGlzLl9tZXNzYWdlcy5maW5kKHtcbiAgICAgIHNlcTogc2VxSWRcbiAgICB9KTtcbiAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgIHRoaXMuX3Rpbm9kZS5fZGIucmVtTWVzc2FnZXModGhpcy5uYW1lLCBzZXFJZCk7XG4gICAgICByZXR1cm4gdGhpcy5fbWVzc2FnZXMuZGVsQXQoaWR4KTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICAvKipcbiAgICogVXBkYXRlIG1lc3NhZ2UncyBzZXFJZC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHB1YiBtZXNzYWdlIG9iamVjdC5cbiAgICogQHBhcmFtIHtudW1iZXJ9IG5ld1NlcUlkIG5ldyBzZXEgaWQgZm9yIHB1Yi5cbiAgICovXG4gIHN3YXBNZXNzYWdlSWQocHViLCBuZXdTZXFJZCkge1xuICAgIGNvbnN0IGlkeCA9IHRoaXMuX21lc3NhZ2VzLmZpbmQocHViKTtcbiAgICBjb25zdCBudW1NZXNzYWdlcyA9IHRoaXMuX21lc3NhZ2VzLmxlbmd0aCgpO1xuICAgIGlmICgwIDw9IGlkeCAmJiBpZHggPCBudW1NZXNzYWdlcykge1xuICAgICAgLy8gUmVtb3ZlIG1lc3NhZ2Ugd2l0aCB0aGUgb2xkIHNlcSBJRC5cbiAgICAgIHRoaXMuX21lc3NhZ2VzLmRlbEF0KGlkeCk7XG4gICAgICB0aGlzLl90aW5vZGUuX2RiLnJlbU1lc3NhZ2VzKHRoaXMubmFtZSwgcHViLnNlcSk7XG4gICAgICAvLyBBZGQgbWVzc2FnZSB3aXRoIHRoZSBuZXcgc2VxIElELlxuICAgICAgcHViLnNlcSA9IG5ld1NlcUlkO1xuICAgICAgdGhpcy5fbWVzc2FnZXMucHV0KHB1Yik7XG4gICAgICB0aGlzLl90aW5vZGUuX2RiLmFkZE1lc3NhZ2UocHViKTtcbiAgICB9XG4gIH1cbiAgLyoqXG4gICAqIFJlbW92ZSBhIHJhbmdlIG9mIG1lc3NhZ2VzIGZyb20gdGhlIGxvY2FsIGNhY2hlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gZnJvbUlkIHNlcSBJRCBvZiB0aGUgZmlyc3QgbWVzc2FnZSB0byByZW1vdmUgKGluY2x1c2l2ZSkuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB1bnRpbElkIHNlcUlEIG9mIHRoZSBsYXN0IG1lc3NhZ2UgdG8gcmVtb3ZlIChleGNsdXNpdmUpLlxuICAgKlxuICAgKiBAcmV0dXJucyB7TWVzc2FnZVtdfSBhcnJheSBvZiByZW1vdmVkIG1lc3NhZ2VzIChjb3VsZCBiZSBlbXB0eSkuXG4gICAqL1xuICBmbHVzaE1lc3NhZ2VSYW5nZShmcm9tSWQsIHVudGlsSWQpIHtcbiAgICAvLyBSZW1vdmUgcmFuZ2UgZnJvbSBwZXJzaXN0ZW50IGNhY2hlLlxuICAgIHRoaXMuX3Rpbm9kZS5fZGIucmVtTWVzc2FnZXModGhpcy5uYW1lLCBmcm9tSWQsIHVudGlsSWQpO1xuICAgIC8vIHN0YXJ0LCBlbmQ6IGZpbmQgaW5zZXJ0aW9uIHBvaW50cyAobmVhcmVzdCA9PSB0cnVlKS5cbiAgICBjb25zdCBzaW5jZSA9IHRoaXMuX21lc3NhZ2VzLmZpbmQoe1xuICAgICAgc2VxOiBmcm9tSWRcbiAgICB9LCB0cnVlKTtcbiAgICByZXR1cm4gc2luY2UgPj0gMCA/IHRoaXMuX21lc3NhZ2VzLmRlbFJhbmdlKHNpbmNlLCB0aGlzLl9tZXNzYWdlcy5maW5kKHtcbiAgICAgIHNlcTogdW50aWxJZFxuICAgIH0sIHRydWUpKSA6IFtdO1xuICB9XG4gIC8qKlxuICAgKiBBdHRlbXB0IHRvIHN0b3AgbWVzc2FnZSBmcm9tIGJlaW5nIHNlbnQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXFJZCBpZCBvZiB0aGUgbWVzc2FnZSB0byBzdG9wIHNlbmRpbmcgYW5kIHJlbW92ZSBmcm9tIGNhY2hlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgbWVzc2FnZSB3YXMgY2FuY2VsbGVkLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgY2FuY2VsU2VuZChzZXFJZCkge1xuICAgIGNvbnN0IGlkeCA9IHRoaXMuX21lc3NhZ2VzLmZpbmQoe1xuICAgICAgc2VxOiBzZXFJZFxuICAgIH0pO1xuICAgIGlmIChpZHggPj0gMCkge1xuICAgICAgY29uc3QgbXNnID0gdGhpcy5fbWVzc2FnZXMuZ2V0QXQoaWR4KTtcbiAgICAgIGNvbnN0IHN0YXR1cyA9IHRoaXMubXNnU3RhdHVzKG1zZyk7XG4gICAgICBpZiAoc3RhdHVzID09IENvbnN0Lk1FU1NBR0VfU1RBVFVTX1FVRVVFRCB8fCBzdGF0dXMgPT0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfRkFJTEVEKSB7XG4gICAgICAgIHRoaXMuX3Rpbm9kZS5fZGIucmVtTWVzc2FnZXModGhpcy5uYW1lLCBzZXFJZCk7XG4gICAgICAgIG1zZy5fY2FuY2VsbGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fbWVzc2FnZXMuZGVsQXQoaWR4KTtcbiAgICAgICAgaWYgKHRoaXMub25EYXRhKSB7XG4gICAgICAgICAgLy8gQ2FsbGluZyB3aXRoIG5vIHBhcmFtZXRlcnMgdG8gaW5kaWNhdGUgdGhlIG1lc3NhZ2Ugd2FzIGRlbGV0ZWQuXG4gICAgICAgICAgdGhpcy5vbkRhdGEoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8qKlxuICAgKiBHZXQgdHlwZSBvZiB0aGUgdG9waWM6IG1lLCBwMnAsIGdycCwgZm5kLi4uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IE9uZSBvZiAnbWUnLCAncDJwJywgJ2dycCcsICdmbmQnLCAnc3lzJyBvciA8Y29kZT51bmRlZmluZWQ8L2NvZGU+LlxuICAgKi9cbiAgZ2V0VHlwZSgpIHtcbiAgICByZXR1cm4gVG9waWMudG9waWNUeXBlKHRoaXMubmFtZSk7XG4gIH1cbiAgLyoqXG4gICAqIEdldCBjdXJyZW50IHVzZXIncyBhY2Nlc3MgbW9kZSBvZiB0aGUgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuQWNjZXNzTW9kZX0gLSB1c2VyJ3MgYWNjZXNzIG1vZGVcbiAgICovXG4gIGdldEFjY2Vzc01vZGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWNzO1xuICB9XG4gIC8qKlxuICAgKiBTZXQgY3VycmVudCB1c2VyJ3MgYWNjZXNzIG1vZGUgb2YgdGhlIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge0FjY2Vzc01vZGUgfCBPYmplY3R9IGFjcyAtIGFjY2VzcyBtb2RlIHRvIHNldC5cbiAgICovXG4gIHNldEFjY2Vzc01vZGUoYWNzKSB7XG4gICAgcmV0dXJuIHRoaXMuYWNzID0gbmV3IEFjY2Vzc01vZGUoYWNzKTtcbiAgfVxuICAvKipcbiAgICogR2V0IHRvcGljJ3MgZGVmYXVsdCBhY2Nlc3MgbW9kZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5EZWZBY3N9IC0gYWNjZXNzIG1vZGUsIHN1Y2ggYXMge2F1dGg6IGBSV1BgLCBhbm9uOiBgTmB9LlxuICAgKi9cbiAgZ2V0RGVmYXVsdEFjY2VzcygpIHtcbiAgICByZXR1cm4gdGhpcy5kZWZhY3M7XG4gIH1cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgbmV3IG1ldGEge0BsaW5rIFRpbm9kZS5HZXRRdWVyeX0gYnVpbGRlci4gVGhlIHF1ZXJ5IGlzIGF0dGNoZWQgdG8gdGhlIGN1cnJlbnQgdG9waWMuXG4gICAqIEl0IHdpbGwgbm90IHdvcmsgY29ycmVjdGx5IGlmIHVzZWQgd2l0aCBhIGRpZmZlcmVudCB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gcXVlcnkgYXR0YWNoZWQgdG8gdGhlIGN1cnJlbnQgdG9waWMuXG4gICAqL1xuICBzdGFydE1ldGFRdWVyeSgpIHtcbiAgICByZXR1cm4gbmV3IE1ldGFHZXRCdWlsZGVyKHRoaXMpO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0b3BpYyBpcyBhcmNoaXZlZCwgaS5lLiBwcml2YXRlLmFyY2ggPT0gdHJ1ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdG9waWMgaXMgYXJjaGl2ZWQsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBpc0FyY2hpdmVkKCkge1xuICAgIHJldHVybiB0aGlzLnByaXZhdGUgJiYgISF0aGlzLnByaXZhdGUuYXJjaDtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgdG9waWMgaXMgYSAnbWUnIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0b3BpYyBpcyBhICdtZScgdG9waWMsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBpc01lVHlwZSgpIHtcbiAgICByZXR1cm4gVG9waWMuaXNNZVRvcGljTmFtZSh0aGlzLm5hbWUpO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0b3BpYyBpcyBhIGNoYW5uZWwuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIHRvcGljIGlzIGEgY2hhbm5lbCwgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIGlzQ2hhbm5lbFR5cGUoKSB7XG4gICAgcmV0dXJuIFRvcGljLmlzQ2hhbm5lbFRvcGljTmFtZSh0aGlzLm5hbWUpO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0b3BpYyBpcyBhIGdyb3VwIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0b3BpYyBpcyBhIGdyb3VwLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNHcm91cFR5cGUoKSB7XG4gICAgcmV0dXJuIFRvcGljLmlzR3JvdXBUb3BpY05hbWUodGhpcy5uYW1lKTtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgdG9waWMgaXMgYSBwMnAgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIHRvcGljIGlzIGEgcDJwIHRvcGljLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNQMlBUeXBlKCkge1xuICAgIHJldHVybiBUb3BpYy5pc1AyUFRvcGljTmFtZSh0aGlzLm5hbWUpO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0b3BpYyBpcyBhIGNvbW11bmljYXRpb24gdG9waWMsIGkuZS4gYSBncm91cCBvciBwMnAgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIHRvcGljIGlzIGEgcDJwIG9yIGdyb3VwIHRvcGljLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNDb21tVHlwZSgpIHtcbiAgICByZXR1cm4gVG9waWMuaXNDb21tVG9waWNOYW1lKHRoaXMubmFtZSk7XG4gIH1cbiAgLyoqXG4gICAqIEdldCBzdGF0dXMgKHF1ZXVlZCwgc2VudCwgcmVjZWl2ZWQgZXRjKSBvZiBhIGdpdmVuIG1lc3NhZ2UgaW4gdGhlIGNvbnRleHRcbiAgICogb2YgdGhpcyB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtNZXNzYWdlfSBtc2cgLSBtZXNzYWdlIHRvIGNoZWNrIGZvciBzdGF0dXMuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gdXBkIC0gdXBkYXRlIGNoYWNoZWQgbWVzc2FnZSBzdGF0dXMuXG4gICAqXG4gICAqIEByZXR1cm5zIG1lc3NhZ2Ugc3RhdHVzIGNvbnN0YW50LlxuICAgKi9cbiAgbXNnU3RhdHVzKG1zZywgdXBkKSB7XG4gICAgbGV0IHN0YXR1cyA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX05PTkU7XG4gICAgaWYgKHRoaXMuX3Rpbm9kZS5pc01lKG1zZy5mcm9tKSkge1xuICAgICAgaWYgKG1zZy5fc2VuZGluZykge1xuICAgICAgICBzdGF0dXMgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19TRU5ESU5HO1xuICAgICAgfSBlbHNlIGlmIChtc2cuX2ZhaWxlZCB8fCBtc2cuX2NhbmNlbGxlZCkge1xuICAgICAgICBzdGF0dXMgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19GQUlMRUQ7XG4gICAgICB9IGVsc2UgaWYgKG1zZy5zZXEgPj0gQ29uc3QuTE9DQUxfU0VRSUQpIHtcbiAgICAgICAgc3RhdHVzID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfUVVFVUVEO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLm1zZ1JlYWRDb3VudChtc2cuc2VxKSA+IDApIHtcbiAgICAgICAgc3RhdHVzID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfUkVBRDtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5tc2dSZWN2Q291bnQobXNnLnNlcSkgPiAwKSB7XG4gICAgICAgIHN0YXR1cyA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX1JFQ0VJVkVEO1xuICAgICAgfSBlbHNlIGlmIChtc2cuc2VxID4gMCkge1xuICAgICAgICBzdGF0dXMgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19TRU5UO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAobXNnLl9zdGF0dXMgPT0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfREVMX1JBTkdFKSB7XG4gICAgICBzdGF0dXMgPT0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfREVMX1JBTkdFO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGF0dXMgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19UT19NRTtcbiAgICB9XG5cbiAgICBpZiAodXBkICYmIG1zZy5fc3RhdHVzICE9IHN0YXR1cykge1xuICAgICAgbXNnLl9zdGF0dXMgPSBzdGF0dXM7XG4gICAgICB0aGlzLl90aW5vZGUuX2RiLnVwZE1lc3NhZ2VTdGF0dXModGhpcy5uYW1lLCBtc2cuc2VxLCBzdGF0dXMpO1xuICAgIH1cblxuICAgIHJldHVybiBzdGF0dXM7XG4gIH1cblxuICAvLyBSZXR1cm5zIHRydWUgaWYgcHViIGlzIG1lYW50IHRvIHJlcGxhY2UgYW5vdGhlciBtZXNzYWdlIChlLmcuIG9yaWdpbmFsIG1lc3NhZ2Ugd2FzIGVkaXRlZCkuXG4gIF9pc1JlcGxhY2VtZW50TXNnKHB1Yikge1xuICAgIHJldHVybiBwdWIuaGVhZCAmJiBwdWIuaGVhZC5yZXBsYWNlO1xuICB9XG5cbiAgLy8gSWYgbXNnIGlzIGEgcmVwbGFjZW1lbnQgZm9yIGFub3RoZXIgbWVzc2FnZSwgc2F2ZXMgbXNnIGluIHRoZSBtZXNzYWdlIHZlcnNpb25zIGNhY2hlXG4gIC8vIGFzIGEgbmV3ZXIgdmVyc2lvbiBmb3IgdGhlIG1lc3NhZ2UgaXQncyBzdXBwb3NlZCB0byByZXBsYWNlLlxuICBfbWF5YmVVcGRhdGVNZXNzYWdlVmVyc2lvbnNDYWNoZShtc2cpIHtcbiAgICBpZiAoIXRoaXMuX2lzUmVwbGFjZW1lbnRNc2cobXNnKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCB0YXJnZXRTZXEgPSBwYXJzZUludChtc2cuaGVhZC5yZXBsYWNlLnNwbGl0KCc6JylbMV0pO1xuICAgIGlmICh0YXJnZXRTZXEgPiBtc2cuc2VxKSB7XG4gICAgICAvLyBTdWJzdGl0dXRlcyBhcmUgc3VwcG9zZWQgdG8gaGF2ZSBoaWdoZXIgc2VxIGlkcy5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgbGV0IHZlcnNpb25zID0gdGhpcy5fbWVzc2FnZVZlcnNpb25zW3RhcmdldFNlcV0gfHwgbmV3IENCdWZmZXIoKGEsIGIpID0+IHtcbiAgICAgIHJldHVybiBhLnNlcSAtIGIuc2VxO1xuICAgIH0sIHRydWUpO1xuICAgIHZlcnNpb25zLnB1dChtc2cpO1xuICAgIHRoaXMuX21lc3NhZ2VWZXJzaW9uc1t0YXJnZXRTZXFdID0gdmVyc2lvbnM7XG4gIH1cblxuICAvLyBQcm9jZXNzIGRhdGEgbWVzc2FnZVxuICBfcm91dGVEYXRhKGRhdGEpIHtcbiAgICBpZiAoZGF0YS5jb250ZW50KSB7XG4gICAgICBpZiAoIXRoaXMudG91Y2hlZCB8fCB0aGlzLnRvdWNoZWQgPCBkYXRhLnRzKSB7XG4gICAgICAgIHRoaXMudG91Y2hlZCA9IGRhdGEudHM7XG4gICAgICAgIHRoaXMuX3Rpbm9kZS5fZGIudXBkVG9waWModGhpcyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGRhdGEuc2VxID4gdGhpcy5fbWF4U2VxKSB7XG4gICAgICB0aGlzLl9tYXhTZXEgPSBkYXRhLnNlcTtcbiAgICAgIHRoaXMubXNnU3RhdHVzKGRhdGEsIHRydWUpO1xuICAgICAgLy8gQWNrbiByZWNlaXZpbmcgdGhlIG1lc3NhZ2UuXG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5fcmVjdk5vdGlmaWNhdGlvblRpbWVyKTtcbiAgICAgIHRoaXMuX3JlY3ZOb3RpZmljYXRpb25UaW1lciA9IHNldFRpbWVvdXQoXyA9PiB7XG4gICAgICAgIHRoaXMuX3JlY3ZOb3RpZmljYXRpb25UaW1lciA9IG51bGw7XG4gICAgICAgIHRoaXMubm90ZVJlY3YodGhpcy5fbWF4U2VxKTtcbiAgICAgIH0sIENvbnN0LlJFQ1ZfVElNRU9VVCk7XG4gICAgfVxuXG4gICAgaWYgKGRhdGEuc2VxIDwgdGhpcy5fbWluU2VxIHx8IHRoaXMuX21pblNlcSA9PSAwKSB7XG4gICAgICB0aGlzLl9taW5TZXEgPSBkYXRhLnNlcTtcbiAgICB9XG5cbiAgICBjb25zdCBvdXRnb2luZyA9ICgoIXRoaXMuaXNDaGFubmVsVHlwZSgpICYmICFkYXRhLmZyb20pIHx8IHRoaXMuX3Rpbm9kZS5pc01lKGRhdGEuZnJvbSkpO1xuXG4gICAgaWYgKGRhdGEuaGVhZCAmJiBkYXRhLmhlYWQud2VicnRjICYmIGRhdGEuaGVhZC5taW1lID09IERyYWZ0eS5nZXRDb250ZW50VHlwZSgpICYmIGRhdGEuY29udGVudCkge1xuICAgICAgLy8gUmV3cml0ZSBWQyBib2R5IHdpdGggaW5mbyBmcm9tIHRoZSBoZWFkZXJzLlxuICAgICAgZGF0YS5jb250ZW50ID0gRHJhZnR5LnVwZGF0ZVZpZGVvRW50KGRhdGEuY29udGVudCwge1xuICAgICAgICBzdGF0ZTogZGF0YS5oZWFkLndlYnJ0YyxcbiAgICAgICAgZHVyYXRpb246IGRhdGEuaGVhZFsnd2VicnRjLWR1cmF0aW9uJ10sXG4gICAgICAgIGluY29taW5nOiAhb3V0Z29pbmcsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoIWRhdGEuX25vRm9yd2FyZGluZykge1xuICAgICAgdGhpcy5fbWVzc2FnZXMucHV0KGRhdGEpO1xuICAgICAgdGhpcy5fdGlub2RlLl9kYi5hZGRNZXNzYWdlKGRhdGEpO1xuICAgICAgdGhpcy5fbWF5YmVVcGRhdGVNZXNzYWdlVmVyc2lvbnNDYWNoZShkYXRhKTtcbiAgICAgIHRoaXMuX3VwZGF0ZURlbGV0ZWRSYW5nZXMoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vbkRhdGEpIHtcbiAgICAgIHRoaXMub25EYXRhKGRhdGEpO1xuICAgIH1cblxuICAgIC8vIFVwZGF0ZSBsb2NhbGx5IGNhY2hlZCBjb250YWN0IHdpdGggdGhlIG5ldyBtZXNzYWdlIGNvdW50LlxuICAgIGNvbnN0IHdoYXQgPSBvdXRnb2luZyA/ICdyZWFkJyA6ICdtc2cnO1xuICAgIHRoaXMuX3VwZGF0ZVJlYWRSZWN2KHdoYXQsIGRhdGEuc2VxLCBkYXRhLnRzKTtcbiAgICAvLyBOb3RpZnkgJ21lJyBsaXN0ZW5lcnMgb2YgdGhlIGNoYW5nZS5cbiAgICB0aGlzLl90aW5vZGUuZ2V0TWVUb3BpYygpLl9yZWZyZXNoQ29udGFjdCh3aGF0LCB0aGlzKTtcbiAgfVxuXG4gIC8vIFByb2Nlc3MgbWV0YWRhdGEgbWVzc2FnZVxuICBfcm91dGVNZXRhKG1ldGEpIHtcbiAgICBpZiAobWV0YS5kZXNjKSB7XG4gICAgICB0aGlzLl9wcm9jZXNzTWV0YURlc2MobWV0YS5kZXNjKTtcbiAgICB9XG4gICAgaWYgKG1ldGEuc3ViICYmIG1ldGEuc3ViLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuX3Byb2Nlc3NNZXRhU3ViKG1ldGEuc3ViKTtcbiAgICB9XG4gICAgaWYgKG1ldGEuZGVsKSB7XG4gICAgICB0aGlzLl9wcm9jZXNzRGVsTWVzc2FnZXMobWV0YS5kZWwuY2xlYXIsIG1ldGEuZGVsLmRlbHNlcSk7XG4gICAgfVxuICAgIGlmIChtZXRhLnRhZ3MpIHtcbiAgICAgIHRoaXMuX3Byb2Nlc3NNZXRhVGFncyhtZXRhLnRhZ3MpO1xuICAgIH1cbiAgICBpZiAobWV0YS5jcmVkKSB7XG4gICAgICB0aGlzLl9wcm9jZXNzTWV0YUNyZWRzKG1ldGEuY3JlZCk7XG4gICAgfVxuICAgIGlmICh0aGlzLm9uTWV0YSkge1xuICAgICAgdGhpcy5vbk1ldGEobWV0YSk7XG4gICAgfVxuICB9XG4gIC8vIFByb2Nlc3MgcHJlc2VuY2UgY2hhbmdlIG1lc3NhZ2VcbiAgX3JvdXRlUHJlcyhwcmVzKSB7XG4gICAgbGV0IHVzZXIsIHVpZDtcbiAgICBzd2l0Y2ggKHByZXMud2hhdCkge1xuICAgICAgY2FzZSAnZGVsJzpcbiAgICAgICAgLy8gRGVsZXRlIGNhY2hlZCBtZXNzYWdlcy5cbiAgICAgICAgdGhpcy5fcHJvY2Vzc0RlbE1lc3NhZ2VzKHByZXMuY2xlYXIsIHByZXMuZGVsc2VxKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdvbic6XG4gICAgICBjYXNlICdvZmYnOlxuICAgICAgICAvLyBVcGRhdGUgb25saW5lIHN0YXR1cyBvZiBhIHN1YnNjcmlwdGlvbi5cbiAgICAgICAgdXNlciA9IHRoaXMuX3VzZXJzW3ByZXMuc3JjXTtcbiAgICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgICB1c2VyLm9ubGluZSA9IHByZXMud2hhdCA9PSAnb24nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3Rpbm9kZS5sb2dnZXIoXCJXQVJOSU5HOiBQcmVzZW5jZSB1cGRhdGUgZm9yIGFuIHVua25vd24gdXNlclwiLCB0aGlzLm5hbWUsIHByZXMuc3JjKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3Rlcm0nOlxuICAgICAgICAvLyBBdHRhY2htZW50IHRvIHRvcGljIGlzIHRlcm1pbmF0ZWQgcHJvYmFibHkgZHVlIHRvIGNsdXN0ZXIgcmVoYXNoaW5nLlxuICAgICAgICB0aGlzLl9yZXNldFN1YigpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3VwZCc6XG4gICAgICAgIC8vIEEgdG9waWMgc3Vic2NyaWJlciBoYXMgdXBkYXRlZCBoaXMgZGVzY3JpcHRpb24uXG4gICAgICAgIC8vIElzc3VlIHtnZXQgc3VifSBvbmx5IGlmIHRoZSBjdXJyZW50IHVzZXIgaGFzIG5vIHAycCB0b3BpY3Mgd2l0aCB0aGUgdXBkYXRlZCB1c2VyIChwMnAgbmFtZSBpcyBub3QgaW4gY2FjaGUpLlxuICAgICAgICAvLyBPdGhlcndpc2UgJ21lJyB3aWxsIGlzc3VlIGEge2dldCBkZXNjfSByZXF1ZXN0LlxuICAgICAgICBpZiAocHJlcy5zcmMgJiYgIXRoaXMuX3Rpbm9kZS5pc1RvcGljQ2FjaGVkKHByZXMuc3JjKSkge1xuICAgICAgICAgIHRoaXMuZ2V0TWV0YSh0aGlzLnN0YXJ0TWV0YVF1ZXJ5KCkud2l0aExhdGVyT25lU3ViKHByZXMuc3JjKS5idWlsZCgpKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2Fjcyc6XG4gICAgICAgIHVpZCA9IHByZXMuc3JjIHx8IHRoaXMuX3Rpbm9kZS5nZXRDdXJyZW50VXNlcklEKCk7XG4gICAgICAgIHVzZXIgPSB0aGlzLl91c2Vyc1t1aWRdO1xuICAgICAgICBpZiAoIXVzZXIpIHtcbiAgICAgICAgICAvLyBVcGRhdGUgZm9yIGFuIHVua25vd24gdXNlcjogbm90aWZpY2F0aW9uIG9mIGEgbmV3IHN1YnNjcmlwdGlvbi5cbiAgICAgICAgICBjb25zdCBhY3MgPSBuZXcgQWNjZXNzTW9kZSgpLnVwZGF0ZUFsbChwcmVzLmRhY3MpO1xuICAgICAgICAgIGlmIChhY3MgJiYgYWNzLm1vZGUgIT0gQWNjZXNzTW9kZS5fTk9ORSkge1xuICAgICAgICAgICAgdXNlciA9IHRoaXMuX2NhY2hlR2V0VXNlcih1aWQpO1xuICAgICAgICAgICAgaWYgKCF1c2VyKSB7XG4gICAgICAgICAgICAgIHVzZXIgPSB7XG4gICAgICAgICAgICAgICAgdXNlcjogdWlkLFxuICAgICAgICAgICAgICAgIGFjczogYWNzXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIHRoaXMuZ2V0TWV0YSh0aGlzLnN0YXJ0TWV0YVF1ZXJ5KCkud2l0aE9uZVN1Yih1bmRlZmluZWQsIHVpZCkuYnVpbGQoKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB1c2VyLmFjcyA9IGFjcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHVzZXIudXBkYXRlZCA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9jZXNzTWV0YVN1YihbdXNlcl0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBLbm93biB1c2VyXG4gICAgICAgICAgdXNlci5hY3MudXBkYXRlQWxsKHByZXMuZGFjcyk7XG4gICAgICAgICAgLy8gVXBkYXRlIHVzZXIncyBhY2Nlc3MgbW9kZS5cbiAgICAgICAgICB0aGlzLl9wcm9jZXNzTWV0YVN1Yihbe1xuICAgICAgICAgICAgdXNlcjogdWlkLFxuICAgICAgICAgICAgdXBkYXRlZDogbmV3IERhdGUoKSxcbiAgICAgICAgICAgIGFjczogdXNlci5hY3NcbiAgICAgICAgICB9XSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLl90aW5vZGUubG9nZ2VyKFwiSU5GTzogSWdub3JlZCBwcmVzZW5jZSB1cGRhdGVcIiwgcHJlcy53aGF0KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vblByZXMpIHtcbiAgICAgIHRoaXMub25QcmVzKHByZXMpO1xuICAgIH1cbiAgfVxuICAvLyBQcm9jZXNzIHtpbmZvfSBtZXNzYWdlXG4gIF9yb3V0ZUluZm8oaW5mbykge1xuICAgIHN3aXRjaCAoaW5mby53aGF0KSB7XG4gICAgICBjYXNlICdyZWN2JzpcbiAgICAgIGNhc2UgJ3JlYWQnOlxuICAgICAgICBjb25zdCB1c2VyID0gdGhpcy5fdXNlcnNbaW5mby5mcm9tXTtcbiAgICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgICB1c2VyW2luZm8ud2hhdF0gPSBpbmZvLnNlcTtcbiAgICAgICAgICBpZiAodXNlci5yZWN2IDwgdXNlci5yZWFkKSB7XG4gICAgICAgICAgICB1c2VyLnJlY3YgPSB1c2VyLnJlYWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG1zZyA9IHRoaXMubGF0ZXN0TWVzc2FnZSgpO1xuICAgICAgICBpZiAobXNnKSB7XG4gICAgICAgICAgdGhpcy5tc2dTdGF0dXMobXNnLCB0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHRoaXMgaXMgYW4gdXBkYXRlIGZyb20gdGhlIGN1cnJlbnQgdXNlciwgdXBkYXRlIHRoZSBjYWNoZSB3aXRoIHRoZSBuZXcgY291bnQuXG4gICAgICAgIGlmICh0aGlzLl90aW5vZGUuaXNNZShpbmZvLmZyb20pKSB7XG4gICAgICAgICAgdGhpcy5fdXBkYXRlUmVhZFJlY3YoaW5mby53aGF0LCBpbmZvLnNlcSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBOb3RpZnkgJ21lJyBsaXN0ZW5lciBvZiB0aGUgc3RhdHVzIGNoYW5nZS5cbiAgICAgICAgdGhpcy5fdGlub2RlLmdldE1lVG9waWMoKS5fcmVmcmVzaENvbnRhY3QoaW5mby53aGF0LCB0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdrcCc6XG4gICAgICAgIC8vIERvIG5vdGhpbmcuXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnY2FsbCc6XG4gICAgICAgIC8vIERvIG5vdGhpbmcgaGVyZS5cbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLl90aW5vZGUubG9nZ2VyKFwiSU5GTzogSWdub3JlZCBpbmZvIHVwZGF0ZVwiLCBpbmZvLndoYXQpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9uSW5mbykge1xuICAgICAgdGhpcy5vbkluZm8oaW5mbyk7XG4gICAgfVxuICB9XG4gIC8vIENhbGxlZCBieSBUaW5vZGUgd2hlbiBtZXRhLmRlc2MgcGFja2V0IGlzIHJlY2VpdmVkLlxuICAvLyBDYWxsZWQgYnkgJ21lJyB0b3BpYyBvbiBjb250YWN0IHVwZGF0ZSAoZGVzYy5fbm9Gb3J3YXJkaW5nIGlzIHRydWUpLlxuICBfcHJvY2Vzc01ldGFEZXNjKGRlc2MpIHtcbiAgICBpZiAodGhpcy5pc1AyUFR5cGUoKSkge1xuICAgICAgLy8gU3ludGhldGljIGRlc2MgbWF5IGluY2x1ZGUgZGVmYWNzIGZvciBwMnAgdG9waWNzIHdoaWNoIGlzIHVzZWxlc3MuXG4gICAgICAvLyBSZW1vdmUgaXQuXG4gICAgICBkZWxldGUgZGVzYy5kZWZhY3M7XG5cbiAgICAgIC8vIFVwZGF0ZSB0byBwMnAgZGVzYyBpcyB0aGUgc2FtZSBhcyB1c2VyIHVwZGF0ZS4gVXBkYXRlIGNhY2hlZCB1c2VyLlxuICAgICAgdGhpcy5fdGlub2RlLl9kYi51cGRVc2VyKHRoaXMubmFtZSwgZGVzYy5wdWJsaWMpO1xuICAgIH1cblxuICAgIC8vIENvcHkgcGFyYW1ldGVycyBmcm9tIGRlc2Mgb2JqZWN0IHRvIHRoaXMgdG9waWMuXG4gICAgbWVyZ2VPYmoodGhpcywgZGVzYyk7XG4gICAgLy8gVXBkYXRlIHBlcnNpc3RlbnQgY2FjaGUuXG4gICAgdGhpcy5fdGlub2RlLl9kYi51cGRUb3BpYyh0aGlzKTtcblxuICAgIC8vIE5vdGlmeSAnbWUnIGxpc3RlbmVyLCBpZiBhdmFpbGFibGU6XG4gICAgaWYgKHRoaXMubmFtZSAhPT0gQ29uc3QuVE9QSUNfTUUgJiYgIWRlc2MuX25vRm9yd2FyZGluZykge1xuICAgICAgY29uc3QgbWUgPSB0aGlzLl90aW5vZGUuZ2V0TWVUb3BpYygpO1xuICAgICAgaWYgKG1lLm9uTWV0YVN1Yikge1xuICAgICAgICBtZS5vbk1ldGFTdWIodGhpcyk7XG4gICAgICB9XG4gICAgICBpZiAobWUub25TdWJzVXBkYXRlZCkge1xuICAgICAgICBtZS5vblN1YnNVcGRhdGVkKFt0aGlzLm5hbWVdLCAxKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5vbk1ldGFEZXNjKSB7XG4gICAgICB0aGlzLm9uTWV0YURlc2ModGhpcyk7XG4gICAgfVxuICB9XG4gIC8vIENhbGxlZCBieSBUaW5vZGUgd2hlbiBtZXRhLnN1YiBpcyByZWNpdmVkIG9yIGluIHJlc3BvbnNlIHRvIHJlY2VpdmVkXG4gIC8vIHtjdHJsfSBhZnRlciBzZXRNZXRhLXN1Yi5cbiAgX3Byb2Nlc3NNZXRhU3ViKHN1YnMpIHtcbiAgICBmb3IgKGxldCBpZHggaW4gc3Vicykge1xuICAgICAgY29uc3Qgc3ViID0gc3Vic1tpZHhdO1xuXG4gICAgICAvLyBGaWxsIGRlZmF1bHRzLlxuICAgICAgc3ViLm9ubGluZSA9ICEhc3ViLm9ubGluZTtcbiAgICAgIC8vIFVwZGF0ZSB0aW1lc3RhbXAgb2YgdGhlIG1vc3QgcmVjZW50IHN1YnNjcmlwdGlvbiB1cGRhdGUuXG4gICAgICB0aGlzLl9sYXN0U3Vic1VwZGF0ZSA9IG5ldyBEYXRlKE1hdGgubWF4KHRoaXMuX2xhc3RTdWJzVXBkYXRlLCBzdWIudXBkYXRlZCkpO1xuXG4gICAgICBsZXQgdXNlciA9IG51bGw7XG4gICAgICBpZiAoIXN1Yi5kZWxldGVkKSB7XG4gICAgICAgIC8vIElmIHRoaXMgaXMgYSBjaGFuZ2UgdG8gdXNlcidzIG93biBwZXJtaXNzaW9ucywgdXBkYXRlIHRoZW0gaW4gdG9waWMgdG9vLlxuICAgICAgICAvLyBEZXNjIHdpbGwgdXBkYXRlICdtZScgdG9waWMuXG4gICAgICAgIGlmICh0aGlzLl90aW5vZGUuaXNNZShzdWIudXNlcikgJiYgc3ViLmFjcykge1xuICAgICAgICAgIHRoaXMuX3Byb2Nlc3NNZXRhRGVzYyh7XG4gICAgICAgICAgICB1cGRhdGVkOiBzdWIudXBkYXRlZCxcbiAgICAgICAgICAgIHRvdWNoZWQ6IHN1Yi50b3VjaGVkLFxuICAgICAgICAgICAgYWNzOiBzdWIuYWNzXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdXNlciA9IHRoaXMuX3VwZGF0ZUNhY2hlZFVzZXIoc3ViLnVzZXIsIHN1Yik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBTdWJzY3JpcHRpb24gaXMgZGVsZXRlZCwgcmVtb3ZlIGl0IGZyb20gdG9waWMgKGJ1dCBsZWF2ZSBpbiBVc2VycyBjYWNoZSlcbiAgICAgICAgZGVsZXRlIHRoaXMuX3VzZXJzW3N1Yi51c2VyXTtcbiAgICAgICAgdXNlciA9IHN1YjtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMub25NZXRhU3ViKSB7XG4gICAgICAgIHRoaXMub25NZXRhU3ViKHVzZXIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLm9uU3Vic1VwZGF0ZWQpIHtcbiAgICAgIHRoaXMub25TdWJzVXBkYXRlZChPYmplY3Qua2V5cyh0aGlzLl91c2VycykpO1xuICAgIH1cbiAgfVxuICAvLyBDYWxsZWQgYnkgVGlub2RlIHdoZW4gbWV0YS50YWdzIGlzIHJlY2l2ZWQuXG4gIF9wcm9jZXNzTWV0YVRhZ3ModGFncykge1xuICAgIGlmICh0YWdzLmxlbmd0aCA9PSAxICYmIHRhZ3NbMF0gPT0gQ29uc3QuREVMX0NIQVIpIHtcbiAgICAgIHRhZ3MgPSBbXTtcbiAgICB9XG4gICAgdGhpcy5fdGFncyA9IHRhZ3M7XG4gICAgaWYgKHRoaXMub25UYWdzVXBkYXRlZCkge1xuICAgICAgdGhpcy5vblRhZ3NVcGRhdGVkKHRhZ3MpO1xuICAgIH1cbiAgfVxuICAvLyBEbyBub3RoaW5nIGZvciB0b3BpY3Mgb3RoZXIgdGhhbiAnbWUnXG4gIF9wcm9jZXNzTWV0YUNyZWRzKGNyZWRzKSB7fVxuICAvLyBEZWxldGUgY2FjaGVkIG1lc3NhZ2VzIGFuZCB1cGRhdGUgY2FjaGVkIHRyYW5zYWN0aW9uIElEc1xuICBfcHJvY2Vzc0RlbE1lc3NhZ2VzKGNsZWFyLCBkZWxzZXEpIHtcbiAgICB0aGlzLl9tYXhEZWwgPSBNYXRoLm1heChjbGVhciwgdGhpcy5fbWF4RGVsKTtcbiAgICB0aGlzLmNsZWFyID0gTWF0aC5tYXgoY2xlYXIsIHRoaXMuY2xlYXIpO1xuICAgIGNvbnN0IHRvcGljID0gdGhpcztcbiAgICBsZXQgY291bnQgPSAwO1xuICAgIGlmIChBcnJheS5pc0FycmF5KGRlbHNlcSkpIHtcbiAgICAgIGRlbHNlcS5mb3JFYWNoKGZ1bmN0aW9uKHJhbmdlKSB7XG4gICAgICAgIGlmICghcmFuZ2UuaGkpIHtcbiAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgIHRvcGljLmZsdXNoTWVzc2FnZShyYW5nZS5sb3cpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZvciAobGV0IGkgPSByYW5nZS5sb3c7IGkgPCByYW5nZS5oaTsgaSsrKSB7XG4gICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgICAgdG9waWMuZmx1c2hNZXNzYWdlKGkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGNvdW50ID4gMCkge1xuICAgICAgdGhpcy5fdXBkYXRlRGVsZXRlZFJhbmdlcygpO1xuXG4gICAgICBpZiAodGhpcy5vbkRhdGEpIHtcbiAgICAgICAgdGhpcy5vbkRhdGEoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLy8gVG9waWMgaXMgaW5mb3JtZWQgdGhhdCB0aGUgZW50aXJlIHJlc3BvbnNlIHRvIHtnZXQgd2hhdD1kYXRhfSBoYXMgYmVlbiByZWNlaXZlZC5cbiAgX2FsbE1lc3NhZ2VzUmVjZWl2ZWQoY291bnQpIHtcbiAgICB0aGlzLl91cGRhdGVEZWxldGVkUmFuZ2VzKCk7XG5cbiAgICBpZiAodGhpcy5vbkFsbE1lc3NhZ2VzUmVjZWl2ZWQpIHtcbiAgICAgIHRoaXMub25BbGxNZXNzYWdlc1JlY2VpdmVkKGNvdW50KTtcbiAgICB9XG4gIH1cbiAgLy8gUmVzZXQgc3Vic2NyaWJlZCBzdGF0ZVxuICBfcmVzZXRTdWIoKSB7XG4gICAgdGhpcy5fYXR0YWNoZWQgPSBmYWxzZTtcbiAgfVxuICAvLyBUaGlzIHRvcGljIGlzIGVpdGhlciBkZWxldGVkIG9yIHVuc3Vic2NyaWJlZCBmcm9tLlxuICBfZ29uZSgpIHtcbiAgICB0aGlzLl9tZXNzYWdlcy5yZXNldCgpO1xuICAgIHRoaXMuX3Rpbm9kZS5fZGIucmVtTWVzc2FnZXModGhpcy5uYW1lKTtcbiAgICB0aGlzLl91c2VycyA9IHt9O1xuICAgIHRoaXMuYWNzID0gbmV3IEFjY2Vzc01vZGUobnVsbCk7XG4gICAgdGhpcy5wcml2YXRlID0gbnVsbDtcbiAgICB0aGlzLnB1YmxpYyA9IG51bGw7XG4gICAgdGhpcy50cnVzdGVkID0gbnVsbDtcbiAgICB0aGlzLl9tYXhTZXEgPSAwO1xuICAgIHRoaXMuX21pblNlcSA9IDA7XG4gICAgdGhpcy5fYXR0YWNoZWQgPSBmYWxzZTtcblxuICAgIGNvbnN0IG1lID0gdGhpcy5fdGlub2RlLmdldE1lVG9waWMoKTtcbiAgICBpZiAobWUpIHtcbiAgICAgIG1lLl9yb3V0ZVByZXMoe1xuICAgICAgICBfbm9Gb3J3YXJkaW5nOiB0cnVlLFxuICAgICAgICB3aGF0OiAnZ29uZScsXG4gICAgICAgIHRvcGljOiBDb25zdC5UT1BJQ19NRSxcbiAgICAgICAgc3JjOiB0aGlzLm5hbWVcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAodGhpcy5vbkRlbGV0ZVRvcGljKSB7XG4gICAgICB0aGlzLm9uRGVsZXRlVG9waWMoKTtcbiAgICB9XG4gIH1cbiAgLy8gVXBkYXRlIGdsb2JhbCB1c2VyIGNhY2hlIGFuZCBsb2NhbCBzdWJzY3JpYmVycyBjYWNoZS5cbiAgLy8gRG9uJ3QgY2FsbCB0aGlzIG1ldGhvZCBmb3Igbm9uLXN1YnNjcmliZXJzLlxuICBfdXBkYXRlQ2FjaGVkVXNlcih1aWQsIG9iaikge1xuICAgIC8vIEZldGNoIHVzZXIgb2JqZWN0IGZyb20gdGhlIGdsb2JhbCBjYWNoZS5cbiAgICAvLyBUaGlzIGlzIGEgY2xvbmUgb2YgdGhlIHN0b3JlZCBvYmplY3RcbiAgICBsZXQgY2FjaGVkID0gdGhpcy5fY2FjaGVHZXRVc2VyKHVpZCk7XG4gICAgY2FjaGVkID0gbWVyZ2VPYmooY2FjaGVkIHx8IHt9LCBvYmopO1xuICAgIC8vIFNhdmUgdG8gZ2xvYmFsIGNhY2hlXG4gICAgdGhpcy5fY2FjaGVQdXRVc2VyKHVpZCwgY2FjaGVkKTtcbiAgICAvLyBTYXZlIHRvIHRoZSBsaXN0IG9mIHRvcGljIHN1YnNyaWJlcnMuXG4gICAgcmV0dXJuIG1lcmdlVG9DYWNoZSh0aGlzLl91c2VycywgdWlkLCBjYWNoZWQpO1xuICB9XG4gIC8vIEdldCBsb2NhbCBzZXFJZCBmb3IgYSBxdWV1ZWQgbWVzc2FnZS5cbiAgX2dldFF1ZXVlZFNlcUlkKCkge1xuICAgIHJldHVybiB0aGlzLl9xdWV1ZWRTZXFJZCsrO1xuICB9XG4gIC8vIENhbGN1bGF0ZSByYW5nZXMgb2YgbWlzc2luZyBtZXNzYWdlcy5cbiAgX3VwZGF0ZURlbGV0ZWRSYW5nZXMoKSB7XG4gICAgY29uc3QgcmFuZ2VzID0gW107XG5cbiAgICAvLyBHYXAgbWFya2VyLCBwb3NzaWJseSBlbXB0eS5cbiAgICBsZXQgcHJldiA9IG51bGw7XG5cbiAgICAvLyBDaGVjayBmb3IgZ2FwIGluIHRoZSBiZWdpbm5pbmcsIGJlZm9yZSB0aGUgZmlyc3QgbWVzc2FnZS5cbiAgICBjb25zdCBmaXJzdCA9IHRoaXMuX21lc3NhZ2VzLmdldEF0KDApO1xuICAgIGlmIChmaXJzdCAmJiB0aGlzLl9taW5TZXEgPiAxICYmICF0aGlzLl9ub0VhcmxpZXJNc2dzKSB7XG4gICAgICAvLyBTb21lIG1lc3NhZ2VzIGFyZSBtaXNzaW5nIGluIHRoZSBiZWdpbm5pbmcuXG4gICAgICBpZiAoZmlyc3QuaGkpIHtcbiAgICAgICAgLy8gVGhlIGZpcnN0IG1lc3NhZ2UgYWxyZWFkeSByZXByZXNlbnRzIGEgZ2FwLlxuICAgICAgICBpZiAoZmlyc3Quc2VxID4gMSkge1xuICAgICAgICAgIGZpcnN0LnNlcSA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZpcnN0LmhpIDwgdGhpcy5fbWluU2VxIC0gMSkge1xuICAgICAgICAgIGZpcnN0LmhpID0gdGhpcy5fbWluU2VxIC0gMTtcbiAgICAgICAgfVxuICAgICAgICBwcmV2ID0gZmlyc3Q7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBDcmVhdGUgbmV3IGdhcC5cbiAgICAgICAgcHJldiA9IHtcbiAgICAgICAgICBzZXE6IDEsXG4gICAgICAgICAgaGk6IHRoaXMuX21pblNlcSAtIDFcbiAgICAgICAgfTtcbiAgICAgICAgcmFuZ2VzLnB1c2gocHJldik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIE5vIGdhcCBpbiB0aGUgYmVnaW5uaW5nLlxuICAgICAgcHJldiA9IHtcbiAgICAgICAgc2VxOiAwLFxuICAgICAgICBoaTogMFxuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBGaW5kIG5ldyBnYXBzIGluIHRoZSBsaXN0IG9mIHJlY2VpdmVkIG1lc3NhZ2VzLiBUaGUgbGlzdCBjb250YWlucyBtZXNzYWdlcy1wcm9wZXIgYXMgd2VsbFxuICAgIC8vIGFzIHBsYWNlaG9sZGVycyBmb3IgZGVsZXRlZCByYW5nZXMuXG4gICAgLy8gVGhlIG1lc3NhZ2VzIGFyZSBpdGVyYXRlZCBieSBzZXEgSUQgaW4gYXNjZW5kaW5nIG9yZGVyLlxuICAgIHRoaXMuX21lc3NhZ2VzLmZpbHRlcigoZGF0YSkgPT4ge1xuICAgICAgLy8gRG8gbm90IGNyZWF0ZSBhIGdhcCBiZXR3ZWVuIHRoZSBsYXN0IHNlbnQgbWVzc2FnZSBhbmQgdGhlIGZpcnN0IHVuc2VudCBhcyB3ZWxsIGFzIGJldHdlZW4gdW5zZW50IG1lc3NhZ2VzLlxuICAgICAgaWYgKGRhdGEuc2VxID49IENvbnN0LkxPQ0FMX1NFUUlEKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBDaGVjayBmb3IgYSBnYXAgYmV0d2VlbiB0aGUgcHJldmlvdXMgbWVzc2FnZS9tYXJrZXIgYW5kIHRoaXMgbWVzc2FnZS9tYXJrZXIuXG4gICAgICBpZiAoZGF0YS5zZXEgPT0gKHByZXYuaGkgfHwgcHJldi5zZXEpICsgMSkge1xuICAgICAgICAvLyBObyBnYXAgYmV0d2VlbiB0aGlzIG1lc3NhZ2UgYW5kIHRoZSBwcmV2aW91cy5cbiAgICAgICAgaWYgKGRhdGEuaGkgJiYgcHJldi5oaSkge1xuICAgICAgICAgIC8vIFR3byBnYXAgbWFya2VycyBpbiBhIHJvdy4gRXh0ZW5kIHRoZSBwcmV2aW91cyBvbmUsIGRpc2NhcmQgdGhlIGN1cnJlbnQuXG4gICAgICAgICAgcHJldi5oaSA9IGRhdGEuaGk7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHByZXYgPSBkYXRhO1xuXG4gICAgICAgIC8vIEtlZXAgY3VycmVudC5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIC8vIEZvdW5kIGEgbmV3IGdhcC5cbiAgICAgIC8vIENoZWNrIGlmIHRoZSBwcmV2aW91cyBpcyBhbHNvIGEgZ2FwIG1hcmtlci5cbiAgICAgIGlmIChwcmV2LmhpKSB7XG4gICAgICAgIC8vIEFsdGVyIGl0IGluc3RlYWQgb2YgY3JlYXRpbmcgYSBuZXcgb25lLlxuICAgICAgICBwcmV2LmhpID0gZGF0YS5oaSB8fCBkYXRhLnNlcTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFByZXZpb3VzIGlzIG5vdCBhIGdhcCBtYXJrZXIuIENyZWF0ZSBhIG5ldyBvbmUuXG4gICAgICAgIHByZXYgPSB7XG4gICAgICAgICAgc2VxOiBwcmV2LnNlcSArIDEsXG4gICAgICAgICAgaGk6IGRhdGEuaGkgfHwgZGF0YS5zZXFcbiAgICAgICAgfTtcbiAgICAgICAgcmFuZ2VzLnB1c2gocHJldik7XG4gICAgICB9XG5cbiAgICAgIC8vIElmIG1hcmtlciwgcmVtb3ZlOyBrZWVwIGlmIHJlZ3VsYXIgbWVzc2FnZS5cbiAgICAgIGlmICghZGF0YS5oaSkge1xuICAgICAgICAvLyBLZWVwaW5nIHRoZSBjdXJyZW50IHJlZ3VsYXIgbWVzc2FnZSwgc2F2ZSBpdCBhcyBwcmV2aW91cy5cbiAgICAgICAgcHJldiA9IGRhdGE7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBEaXNjYXJkIHRoZSBjdXJyZW50IGdhcCBtYXJrZXI6IHdlIGVpdGhlciBjcmVhdGVkIGFuIGVhcmxpZXIgZ2FwLCBvciBleHRlbmRlZCB0aGUgcHJldm91cyBvbmUuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG5cbiAgICAvLyBDaGVjayBmb3IgbWlzc2luZyBtZXNzYWdlcyBhdCB0aGUgZW5kLlxuICAgIC8vIEFsbCBtZXNzYWdlcyBjb3VsZCBiZSBtaXNzaW5nIG9yIGl0IGNvdWxkIGJlIGEgbmV3IHRvcGljIHdpdGggbm8gbWVzc2FnZXMuXG4gICAgY29uc3QgbGFzdCA9IHRoaXMuX21lc3NhZ2VzLmdldExhc3QoKTtcbiAgICBjb25zdCBtYXhTZXEgPSBNYXRoLm1heCh0aGlzLnNlcSwgdGhpcy5fbWF4U2VxKSB8fCAwO1xuICAgIGlmICgobWF4U2VxID4gMCAmJiAhbGFzdCkgfHwgKGxhc3QgJiYgKChsYXN0LmhpIHx8IGxhc3Quc2VxKSA8IG1heFNlcSkpKSB7XG4gICAgICBpZiAobGFzdCAmJiBsYXN0LmhpKSB7XG4gICAgICAgIC8vIEV4dGVuZCBleGlzdGluZyBnYXBcbiAgICAgICAgbGFzdC5oaSA9IG1heFNlcTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIENyZWF0ZSBuZXcgZ2FwLlxuICAgICAgICByYW5nZXMucHVzaCh7XG4gICAgICAgICAgc2VxOiBsYXN0ID8gbGFzdC5zZXEgKyAxIDogMSxcbiAgICAgICAgICBoaTogbWF4U2VxXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEluc2VydCBuZXcgZ2FwcyBpbnRvIGNhY2hlLlxuICAgIHJhbmdlcy5mb3JFYWNoKChnYXApID0+IHtcbiAgICAgIGdhcC5fc3RhdHVzID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfREVMX1JBTkdFO1xuICAgICAgdGhpcy5fbWVzc2FnZXMucHV0KGdhcCk7XG4gICAgfSk7XG4gIH1cbiAgLy8gTG9hZCBtb3N0IHJlY2VudCBtZXNzYWdlcyBmcm9tIHBlcnNpc3RlbnQgY2FjaGUuXG4gIF9sb2FkTWVzc2FnZXMoZGIsIHBhcmFtcykge1xuICAgIGNvbnN0IHtcbiAgICAgIHNpbmNlLFxuICAgICAgYmVmb3JlLFxuICAgICAgbGltaXRcbiAgICB9ID0gcGFyYW1zIHx8IHt9O1xuICAgIHJldHVybiBkYi5yZWFkTWVzc2FnZXModGhpcy5uYW1lLCB7XG4gICAgICAgIHNpbmNlOiBzaW5jZSxcbiAgICAgICAgYmVmb3JlOiBiZWZvcmUsXG4gICAgICAgIGxpbWl0OiBsaW1pdCB8fCBDb25zdC5ERUZBVUxUX01FU1NBR0VTX1BBR0VcbiAgICAgIH0pXG4gICAgICAudGhlbigobXNncykgPT4ge1xuICAgICAgICBtc2dzLmZvckVhY2goKGRhdGEpID0+IHtcbiAgICAgICAgICBpZiAoZGF0YS5zZXEgPiB0aGlzLl9tYXhTZXEpIHtcbiAgICAgICAgICAgIHRoaXMuX21heFNlcSA9IGRhdGEuc2VxO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZGF0YS5zZXEgPCB0aGlzLl9taW5TZXEgfHwgdGhpcy5fbWluU2VxID09IDApIHtcbiAgICAgICAgICAgIHRoaXMuX21pblNlcSA9IGRhdGEuc2VxO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLl9tZXNzYWdlcy5wdXQoZGF0YSk7XG4gICAgICAgICAgdGhpcy5fbWF5YmVVcGRhdGVNZXNzYWdlVmVyc2lvbnNDYWNoZShkYXRhKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChtc2dzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB0aGlzLl91cGRhdGVEZWxldGVkUmFuZ2VzKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1zZ3MubGVuZ3RoO1xuICAgICAgfSk7XG4gIH1cbiAgLy8gUHVzaCBvciB7cHJlc306IG1lc3NhZ2UgcmVjZWl2ZWQuXG4gIF91cGRhdGVSZWNlaXZlZChzZXEsIGFjdCkge1xuICAgIHRoaXMudG91Y2hlZCA9IG5ldyBEYXRlKCk7XG4gICAgdGhpcy5zZXEgPSBzZXEgfCAwO1xuICAgIC8vIENoZWNrIGlmIG1lc3NhZ2UgaXMgc2VudCBieSB0aGUgY3VycmVudCB1c2VyLiBJZiBzbyBpdCdzIGJlZW4gcmVhZCBhbHJlYWR5LlxuICAgIGlmICghYWN0IHx8IHRoaXMuX3Rpbm9kZS5pc01lKGFjdCkpIHtcbiAgICAgIHRoaXMucmVhZCA9IHRoaXMucmVhZCA/IE1hdGgubWF4KHRoaXMucmVhZCwgdGhpcy5zZXEpIDogdGhpcy5zZXE7XG4gICAgICB0aGlzLnJlY3YgPSB0aGlzLnJlY3YgPyBNYXRoLm1heCh0aGlzLnJlYWQsIHRoaXMucmVjdikgOiB0aGlzLnJlYWQ7XG4gICAgfVxuICAgIHRoaXMudW5yZWFkID0gdGhpcy5zZXEgLSAodGhpcy5yZWFkIHwgMCk7XG4gICAgdGhpcy5fdGlub2RlLl9kYi51cGRUb3BpYyh0aGlzKTtcbiAgfVxufVxuXG5cbi8qKlxuICogQGNsYXNzIFRvcGljTWUgLSBzcGVjaWFsIGNhc2Ugb2Yge0BsaW5rIFRpbm9kZS5Ub3BpY30gZm9yXG4gKiBtYW5hZ2luZyBkYXRhIG9mIHRoZSBjdXJyZW50IHVzZXIsIGluY2x1ZGluZyBjb250YWN0IGxpc3QuXG4gKiBAZXh0ZW5kcyBUaW5vZGUuVG9waWNcbiAqIEBtZW1iZXJvZiBUaW5vZGVcbiAqXG4gKiBAcGFyYW0ge1RvcGljTWUuQ2FsbGJhY2tzfSBjYWxsYmFja3MgLSBDYWxsYmFja3MgdG8gcmVjZWl2ZSB2YXJpb3VzIGV2ZW50cy5cbiAqL1xuLyoqXG4gKiBAY2xhc3MgVG9waWNNZSAtIHNwZWNpYWwgY2FzZSBvZiB7QGxpbmsgVGlub2RlLlRvcGljfSBmb3JcbiAqIG1hbmFnaW5nIGRhdGEgb2YgdGhlIGN1cnJlbnQgdXNlciwgaW5jbHVkaW5nIGNvbnRhY3QgbGlzdC5cbiAqIEBleHRlbmRzIFRpbm9kZS5Ub3BpY1xuICogQG1lbWJlcm9mIFRpbm9kZVxuICpcbiAqIEBwYXJhbSB7VG9waWNNZS5DYWxsYmFja3N9IGNhbGxiYWNrcyAtIENhbGxiYWNrcyB0byByZWNlaXZlIHZhcmlvdXMgZXZlbnRzLlxuICovXG5leHBvcnQgY2xhc3MgVG9waWNNZSBleHRlbmRzIFRvcGljIHtcbiAgb25Db250YWN0VXBkYXRlO1xuXG4gIGNvbnN0cnVjdG9yKGNhbGxiYWNrcykge1xuICAgIHN1cGVyKENvbnN0LlRPUElDX01FLCBjYWxsYmFja3MpO1xuXG4gICAgLy8gbWUtc3BlY2lmaWMgY2FsbGJhY2tzXG4gICAgaWYgKGNhbGxiYWNrcykge1xuICAgICAgdGhpcy5vbkNvbnRhY3RVcGRhdGUgPSBjYWxsYmFja3Mub25Db250YWN0VXBkYXRlO1xuICAgIH1cbiAgfVxuXG4gIC8vIE92ZXJyaWRlIHRoZSBvcmlnaW5hbCBUb3BpYy5fcHJvY2Vzc01ldGFEZXNjLlxuICBfcHJvY2Vzc01ldGFEZXNjKGRlc2MpIHtcbiAgICAvLyBDaGVjayBpZiBvbmxpbmUgY29udGFjdHMgbmVlZCB0byBiZSB0dXJuZWQgb2ZmIGJlY2F1c2UgUCBwZXJtaXNzaW9uIHdhcyByZW1vdmVkLlxuICAgIGNvbnN0IHR1cm5PZmYgPSAoZGVzYy5hY3MgJiYgIWRlc2MuYWNzLmlzUHJlc2VuY2VyKCkpICYmICh0aGlzLmFjcyAmJiB0aGlzLmFjcy5pc1ByZXNlbmNlcigpKTtcblxuICAgIC8vIENvcHkgcGFyYW1ldGVycyBmcm9tIGRlc2Mgb2JqZWN0IHRvIHRoaXMgdG9waWMuXG4gICAgbWVyZ2VPYmoodGhpcywgZGVzYyk7XG4gICAgdGhpcy5fdGlub2RlLl9kYi51cGRUb3BpYyh0aGlzKTtcbiAgICAvLyBVcGRhdGUgY3VycmVudCB1c2VyJ3MgcmVjb3JkIGluIHRoZSBnbG9iYWwgY2FjaGUuXG4gICAgdGhpcy5fdXBkYXRlQ2FjaGVkVXNlcih0aGlzLl90aW5vZGUuX215VUlELCBkZXNjKTtcblxuICAgIC8vICdQJyBwZXJtaXNzaW9uIHdhcyByZW1vdmVkLiBBbGwgdG9waWNzIGFyZSBvZmZsaW5lIG5vdy5cbiAgICBpZiAodHVybk9mZikge1xuICAgICAgdGhpcy5fdGlub2RlLm1hcFRvcGljcygoY29udCkgPT4ge1xuICAgICAgICBpZiAoY29udC5vbmxpbmUpIHtcbiAgICAgICAgICBjb250Lm9ubGluZSA9IGZhbHNlO1xuICAgICAgICAgIGNvbnQuc2VlbiA9IE9iamVjdC5hc3NpZ24oY29udC5zZWVuIHx8IHt9LCB7XG4gICAgICAgICAgICB3aGVuOiBuZXcgRGF0ZSgpXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy5fcmVmcmVzaENvbnRhY3QoJ29mZicsIGNvbnQpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vbk1ldGFEZXNjKSB7XG4gICAgICB0aGlzLm9uTWV0YURlc2ModGhpcyk7XG4gICAgfVxuICB9XG5cbiAgLy8gT3ZlcnJpZGUgdGhlIG9yaWdpbmFsIFRvcGljLl9wcm9jZXNzTWV0YVN1YlxuICBfcHJvY2Vzc01ldGFTdWIoc3Vicykge1xuICAgIGxldCB1cGRhdGVDb3VudCA9IDA7XG4gICAgc3Vicy5mb3JFYWNoKChzdWIpID0+IHtcbiAgICAgIGNvbnN0IHRvcGljTmFtZSA9IHN1Yi50b3BpYztcbiAgICAgIC8vIERvbid0IHNob3cgJ21lJyBhbmQgJ2ZuZCcgdG9waWNzIGluIHRoZSBsaXN0IG9mIGNvbnRhY3RzLlxuICAgICAgaWYgKHRvcGljTmFtZSA9PSBDb25zdC5UT1BJQ19GTkQgfHwgdG9waWNOYW1lID09IENvbnN0LlRPUElDX01FKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHN1Yi5vbmxpbmUgPSAhIXN1Yi5vbmxpbmU7XG5cbiAgICAgIGxldCBjb250ID0gbnVsbDtcbiAgICAgIGlmIChzdWIuZGVsZXRlZCkge1xuICAgICAgICBjb250ID0gc3ViO1xuICAgICAgICB0aGlzLl90aW5vZGUuY2FjaGVSZW1Ub3BpYyh0b3BpY05hbWUpO1xuICAgICAgICB0aGlzLl90aW5vZGUuX2RiLnJlbVRvcGljKHRvcGljTmFtZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBFbnN1cmUgdGhlIHZhbHVlcyBhcmUgZGVmaW5lZCBhbmQgYXJlIGludGVnZXJzLlxuICAgICAgICBpZiAodHlwZW9mIHN1Yi5zZXEgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICBzdWIuc2VxID0gc3ViLnNlcSB8IDA7XG4gICAgICAgICAgc3ViLnJlY3YgPSBzdWIucmVjdiB8IDA7XG4gICAgICAgICAgc3ViLnJlYWQgPSBzdWIucmVhZCB8IDA7XG4gICAgICAgICAgc3ViLnVucmVhZCA9IHN1Yi5zZXEgLSBzdWIucmVhZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRvcGljID0gdGhpcy5fdGlub2RlLmdldFRvcGljKHRvcGljTmFtZSk7XG4gICAgICAgIGlmICh0b3BpYy5fbmV3KSB7XG4gICAgICAgICAgZGVsZXRlIHRvcGljLl9uZXc7XG4gICAgICAgIH1cblxuICAgICAgICBjb250ID0gbWVyZ2VPYmoodG9waWMsIHN1Yik7XG4gICAgICAgIHRoaXMuX3Rpbm9kZS5fZGIudXBkVG9waWMoY29udCk7XG5cbiAgICAgICAgaWYgKFRvcGljLmlzUDJQVG9waWNOYW1lKHRvcGljTmFtZSkpIHtcbiAgICAgICAgICB0aGlzLl9jYWNoZVB1dFVzZXIodG9waWNOYW1lLCBjb250KTtcbiAgICAgICAgICB0aGlzLl90aW5vZGUuX2RiLnVwZFVzZXIodG9waWNOYW1lLCBjb250LnB1YmxpYyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gTm90aWZ5IHRvcGljIG9mIHRoZSB1cGRhdGUgaWYgaXQncyBhbiBleHRlcm5hbCB1cGRhdGUuXG4gICAgICAgIGlmICghc3ViLl9ub0ZvcndhcmRpbmcgJiYgdG9waWMpIHtcbiAgICAgICAgICBzdWIuX25vRm9yd2FyZGluZyA9IHRydWU7XG4gICAgICAgICAgdG9waWMuX3Byb2Nlc3NNZXRhRGVzYyhzdWIpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHVwZGF0ZUNvdW50Kys7XG5cbiAgICAgIGlmICh0aGlzLm9uTWV0YVN1Yikge1xuICAgICAgICB0aGlzLm9uTWV0YVN1Yihjb250KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICh0aGlzLm9uU3Vic1VwZGF0ZWQgJiYgdXBkYXRlQ291bnQgPiAwKSB7XG4gICAgICBjb25zdCBrZXlzID0gW107XG4gICAgICBzdWJzLmZvckVhY2goKHMpID0+IHtcbiAgICAgICAga2V5cy5wdXNoKHMudG9waWMpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLm9uU3Vic1VwZGF0ZWQoa2V5cywgdXBkYXRlQ291bnQpO1xuICAgIH1cbiAgfVxuXG4gIC8vIENhbGxlZCBieSBUaW5vZGUgd2hlbiBtZXRhLnN1YiBpcyByZWNpdmVkLlxuICBfcHJvY2Vzc01ldGFDcmVkcyhjcmVkcywgdXBkKSB7XG4gICAgaWYgKGNyZWRzLmxlbmd0aCA9PSAxICYmIGNyZWRzWzBdID09IENvbnN0LkRFTF9DSEFSKSB7XG4gICAgICBjcmVkcyA9IFtdO1xuICAgIH1cbiAgICBpZiAodXBkKSB7XG4gICAgICBjcmVkcy5mb3JFYWNoKChjcikgPT4ge1xuICAgICAgICBpZiAoY3IudmFsKSB7XG4gICAgICAgICAgLy8gQWRkaW5nIGEgY3JlZGVudGlhbC5cbiAgICAgICAgICBsZXQgaWR4ID0gdGhpcy5fY3JlZGVudGlhbHMuZmluZEluZGV4KChlbCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGVsLm1ldGggPT0gY3IubWV0aCAmJiBlbC52YWwgPT0gY3IudmFsO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmIChpZHggPCAwKSB7XG4gICAgICAgICAgICAvLyBOb3QgZm91bmQuXG4gICAgICAgICAgICBpZiAoIWNyLmRvbmUpIHtcbiAgICAgICAgICAgICAgLy8gVW5jb25maXJtZWQgY3JlZGVudGlhbCByZXBsYWNlcyBwcmV2aW91cyB1bmNvbmZpcm1lZCBjcmVkZW50aWFsIG9mIHRoZSBzYW1lIG1ldGhvZC5cbiAgICAgICAgICAgICAgaWR4ID0gdGhpcy5fY3JlZGVudGlhbHMuZmluZEluZGV4KChlbCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBlbC5tZXRoID09IGNyLm1ldGggJiYgIWVsLmRvbmU7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgICAgICAgICAgICAvLyBSZW1vdmUgcHJldmlvdXMgdW5jb25maXJtZWQgY3JlZGVudGlhbC5cbiAgICAgICAgICAgICAgICB0aGlzLl9jcmVkZW50aWFscy5zcGxpY2UoaWR4LCAxKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fY3JlZGVudGlhbHMucHVzaChjcik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIEZvdW5kLiBNYXliZSBjaGFuZ2UgJ2RvbmUnIHN0YXR1cy5cbiAgICAgICAgICAgIHRoaXMuX2NyZWRlbnRpYWxzW2lkeF0uZG9uZSA9IGNyLmRvbmU7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGNyLnJlc3ApIHtcbiAgICAgICAgICAvLyBIYW5kbGUgY3JlZGVudGlhbCBjb25maXJtYXRpb24uXG4gICAgICAgICAgY29uc3QgaWR4ID0gdGhpcy5fY3JlZGVudGlhbHMuZmluZEluZGV4KChlbCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGVsLm1ldGggPT0gY3IubWV0aCAmJiAhZWwuZG9uZTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgICAgICAgIHRoaXMuX2NyZWRlbnRpYWxzW2lkeF0uZG9uZSA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fY3JlZGVudGlhbHMgPSBjcmVkcztcbiAgICB9XG4gICAgaWYgKHRoaXMub25DcmVkc1VwZGF0ZWQpIHtcbiAgICAgIHRoaXMub25DcmVkc1VwZGF0ZWQodGhpcy5fY3JlZGVudGlhbHMpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFByb2Nlc3MgcHJlc2VuY2UgY2hhbmdlIG1lc3NhZ2VcbiAgX3JvdXRlUHJlcyhwcmVzKSB7XG4gICAgaWYgKHByZXMud2hhdCA9PSAndGVybScpIHtcbiAgICAgIC8vIFRoZSAnbWUnIHRvcGljIGl0c2VsZiBpcyBkZXRhY2hlZC4gTWFyayBhcyB1bnN1YnNjcmliZWQuXG4gICAgICB0aGlzLl9yZXNldFN1YigpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChwcmVzLndoYXQgPT0gJ3VwZCcgJiYgcHJlcy5zcmMgPT0gQ29uc3QuVE9QSUNfTUUpIHtcbiAgICAgIC8vIFVwZGF0ZSB0byBtZSdzIGRlc2NyaXB0aW9uLiBSZXF1ZXN0IHVwZGF0ZWQgdmFsdWUuXG4gICAgICB0aGlzLmdldE1ldGEodGhpcy5zdGFydE1ldGFRdWVyeSgpLndpdGhEZXNjKCkuYnVpbGQoKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgY29udCA9IHRoaXMuX3Rpbm9kZS5jYWNoZUdldFRvcGljKHByZXMuc3JjKTtcbiAgICBpZiAoY29udCkge1xuICAgICAgc3dpdGNoIChwcmVzLndoYXQpIHtcbiAgICAgICAgY2FzZSAnb24nOiAvLyB0b3BpYyBjYW1lIG9ubGluZVxuICAgICAgICAgIGNvbnQub25saW5lID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnb2ZmJzogLy8gdG9waWMgd2VudCBvZmZsaW5lXG4gICAgICAgICAgaWYgKGNvbnQub25saW5lKSB7XG4gICAgICAgICAgICBjb250Lm9ubGluZSA9IGZhbHNlO1xuICAgICAgICAgICAgY29udC5zZWVuID0gT2JqZWN0LmFzc2lnbihjb250LnNlZW4gfHwge30sIHtcbiAgICAgICAgICAgICAgd2hlbjogbmV3IERhdGUoKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdtc2cnOiAvLyBuZXcgbWVzc2FnZSByZWNlaXZlZFxuICAgICAgICAgIGNvbnQuX3VwZGF0ZVJlY2VpdmVkKHByZXMuc2VxLCBwcmVzLmFjdCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3VwZCc6IC8vIGRlc2MgdXBkYXRlZFxuICAgICAgICAgIC8vIFJlcXVlc3QgdXBkYXRlZCBzdWJzY3JpcHRpb24uXG4gICAgICAgICAgdGhpcy5nZXRNZXRhKHRoaXMuc3RhcnRNZXRhUXVlcnkoKS53aXRoTGF0ZXJPbmVTdWIocHJlcy5zcmMpLmJ1aWxkKCkpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdhY3MnOiAvLyBhY2Nlc3MgbW9kZSBjaGFuZ2VkXG4gICAgICAgICAgaWYgKGNvbnQuYWNzKSB7XG4gICAgICAgICAgICBjb250LmFjcy51cGRhdGVBbGwocHJlcy5kYWNzKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29udC5hY3MgPSBuZXcgQWNjZXNzTW9kZSgpLnVwZGF0ZUFsbChwcmVzLmRhY3MpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250LnRvdWNoZWQgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd1YSc6XG4gICAgICAgICAgLy8gdXNlciBhZ2VudCBjaGFuZ2VkLlxuICAgICAgICAgIGNvbnQuc2VlbiA9IHtcbiAgICAgICAgICAgIHdoZW46IG5ldyBEYXRlKCksXG4gICAgICAgICAgICB1YTogcHJlcy51YVxuICAgICAgICAgIH07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3JlY3YnOlxuICAgICAgICAgIC8vIHVzZXIncyBvdGhlciBzZXNzaW9uIG1hcmtlZCBzb21lIG1lc3NnZXMgYXMgcmVjZWl2ZWQuXG4gICAgICAgICAgcHJlcy5zZXEgPSBwcmVzLnNlcSB8IDA7XG4gICAgICAgICAgY29udC5yZWN2ID0gY29udC5yZWN2ID8gTWF0aC5tYXgoY29udC5yZWN2LCBwcmVzLnNlcSkgOiBwcmVzLnNlcTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAncmVhZCc6XG4gICAgICAgICAgLy8gdXNlcidzIG90aGVyIHNlc3Npb24gbWFya2VkIHNvbWUgbWVzc2FnZXMgYXMgcmVhZC5cbiAgICAgICAgICBwcmVzLnNlcSA9IHByZXMuc2VxIHwgMDtcbiAgICAgICAgICBjb250LnJlYWQgPSBjb250LnJlYWQgPyBNYXRoLm1heChjb250LnJlYWQsIHByZXMuc2VxKSA6IHByZXMuc2VxO1xuICAgICAgICAgIGNvbnQucmVjdiA9IGNvbnQucmVjdiA/IE1hdGgubWF4KGNvbnQucmVhZCwgY29udC5yZWN2KSA6IGNvbnQucmVjdjtcbiAgICAgICAgICBjb250LnVucmVhZCA9IGNvbnQuc2VxIC0gY29udC5yZWFkO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdnb25lJzpcbiAgICAgICAgICAvLyB0b3BpYyBkZWxldGVkIG9yIHVuc3Vic2NyaWJlZCBmcm9tLlxuICAgICAgICAgIGlmICghY29udC5fZGVsZXRlZCkge1xuICAgICAgICAgICAgY29udC5fZGVsZXRlZCA9IHRydWU7XG4gICAgICAgICAgICBjb250Ll9hdHRhY2hlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5fdGlub2RlLl9kYi5tYXJrVG9waWNBc0RlbGV0ZWQocHJlcy5zcmMpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl90aW5vZGUuX2RiLnJlbVRvcGljKHByZXMuc3JjKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2RlbCc6XG4gICAgICAgICAgLy8gVXBkYXRlIHRvcGljLmRlbCB2YWx1ZS5cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aGlzLl90aW5vZGUubG9nZ2VyKFwiSU5GTzogVW5zdXBwb3J0ZWQgcHJlc2VuY2UgdXBkYXRlIGluICdtZSdcIiwgcHJlcy53aGF0KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fcmVmcmVzaENvbnRhY3QocHJlcy53aGF0LCBjb250KTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHByZXMud2hhdCA9PSAnYWNzJykge1xuICAgICAgICAvLyBOZXcgc3Vic2NyaXB0aW9ucyBhbmQgZGVsZXRlZC9iYW5uZWQgc3Vic2NyaXB0aW9ucyBoYXZlIGZ1bGxcbiAgICAgICAgLy8gYWNjZXNzIG1vZGUgKG5vICsgb3IgLSBpbiB0aGUgZGFjcyBzdHJpbmcpLiBDaGFuZ2VzIHRvIGtub3duIHN1YnNjcmlwdGlvbnMgYXJlIHNlbnQgYXNcbiAgICAgICAgLy8gZGVsdGFzLCBidXQgdGhleSBzaG91bGQgbm90IGhhcHBlbiBoZXJlLlxuICAgICAgICBjb25zdCBhY3MgPSBuZXcgQWNjZXNzTW9kZShwcmVzLmRhY3MpO1xuICAgICAgICBpZiAoIWFjcyB8fCBhY3MubW9kZSA9PSBBY2Nlc3NNb2RlLl9JTlZBTElEKSB7XG4gICAgICAgICAgdGhpcy5fdGlub2RlLmxvZ2dlcihcIkVSUk9SOiBJbnZhbGlkIGFjY2VzcyBtb2RlIHVwZGF0ZVwiLCBwcmVzLnNyYywgcHJlcy5kYWNzKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSBpZiAoYWNzLm1vZGUgPT0gQWNjZXNzTW9kZS5fTk9ORSkge1xuICAgICAgICAgIHRoaXMuX3Rpbm9kZS5sb2dnZXIoXCJXQVJOSU5HOiBSZW1vdmluZyBub24tZXhpc3RlbnQgc3Vic2NyaXB0aW9uXCIsIHByZXMuc3JjLCBwcmVzLmRhY3MpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBOZXcgc3Vic2NyaXB0aW9uLiBTZW5kIHJlcXVlc3QgZm9yIHRoZSBmdWxsIGRlc2NyaXB0aW9uLlxuICAgICAgICAgIC8vIFVzaW5nIC53aXRoT25lU3ViIChub3QgLndpdGhMYXRlck9uZVN1YikgdG8gbWFrZSBzdXJlIElmTW9kaWZpZWRTaW5jZSBpcyBub3Qgc2V0LlxuICAgICAgICAgIHRoaXMuZ2V0TWV0YSh0aGlzLnN0YXJ0TWV0YVF1ZXJ5KCkud2l0aE9uZVN1Yih1bmRlZmluZWQsIHByZXMuc3JjKS5idWlsZCgpKTtcbiAgICAgICAgICAvLyBDcmVhdGUgYSBkdW1teSBlbnRyeSB0byBjYXRjaCBvbmxpbmUgc3RhdHVzIHVwZGF0ZS5cbiAgICAgICAgICBjb25zdCBkdW1teSA9IHRoaXMuX3Rpbm9kZS5nZXRUb3BpYyhwcmVzLnNyYyk7XG4gICAgICAgICAgZHVtbXkudG9waWMgPSBwcmVzLnNyYztcbiAgICAgICAgICBkdW1teS5vbmxpbmUgPSBmYWxzZTtcbiAgICAgICAgICBkdW1teS5hY3MgPSBhY3M7XG4gICAgICAgICAgdGhpcy5fdGlub2RlLl9kYi51cGRUb3BpYyhkdW1teSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAocHJlcy53aGF0ID09ICd0YWdzJykge1xuICAgICAgICB0aGlzLmdldE1ldGEodGhpcy5zdGFydE1ldGFRdWVyeSgpLndpdGhUYWdzKCkuYnVpbGQoKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub25QcmVzKSB7XG4gICAgICB0aGlzLm9uUHJlcyhwcmVzKTtcbiAgICB9XG4gIH1cblxuICAvLyBDb250YWN0IGlzIHVwZGF0ZWQsIGV4ZWN1dGUgY2FsbGJhY2tzLlxuICBfcmVmcmVzaENvbnRhY3Qod2hhdCwgY29udCkge1xuICAgIGlmICh0aGlzLm9uQ29udGFjdFVwZGF0ZSkge1xuICAgICAgdGhpcy5vbkNvbnRhY3RVcGRhdGUod2hhdCwgY29udCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFB1Ymxpc2hpbmcgdG8gVG9waWNNZSBpcyBub3Qgc3VwcG9ydGVkLiB7QGxpbmsgVG9waWMjcHVibGlzaH0gaXMgb3ZlcnJpZGVuIGFuZCB0aG93cyBhbiB7RXJyb3J9IGlmIGNhbGxlZC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpY01lI1xuICAgKiBAdGhyb3dzIHtFcnJvcn0gQWx3YXlzIHRocm93cyBhbiBlcnJvci5cbiAgICovXG4gIHB1Ymxpc2goKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIlB1Ymxpc2hpbmcgdG8gJ21lJyBpcyBub3Qgc3VwcG9ydGVkXCIpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxldGUgdmFsaWRhdGlvbiBjcmVkZW50aWFsLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljTWUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpYyAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIGRlbGV0ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXNlciAtIFVzZXIgSUQgdG8gcmVtb3ZlLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICBkZWxDcmVkZW50aWFsKG1ldGhvZCwgdmFsdWUpIHtcbiAgICBpZiAoIXRoaXMuX2F0dGFjaGVkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiQ2Fubm90IGRlbGV0ZSBjcmVkZW50aWFsIGluIGluYWN0aXZlICdtZScgdG9waWNcIikpO1xuICAgIH1cbiAgICAvLyBTZW5kIHtkZWx9IG1lc3NhZ2UsIHJldHVybiBwcm9taXNlXG4gICAgcmV0dXJuIHRoaXMuX3Rpbm9kZS5kZWxDcmVkZW50aWFsKG1ldGhvZCwgdmFsdWUpLnRoZW4oKGN0cmwpID0+IHtcbiAgICAgIC8vIFJlbW92ZSBkZWxldGVkIGNyZWRlbnRpYWwgZnJvbSB0aGUgY2FjaGUuXG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMuX2NyZWRlbnRpYWxzLmZpbmRJbmRleCgoZWwpID0+IHtcbiAgICAgICAgcmV0dXJuIGVsLm1ldGggPT0gbWV0aG9kICYmIGVsLnZhbCA9PSB2YWx1ZTtcbiAgICAgIH0pO1xuICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgdGhpcy5fY3JlZGVudGlhbHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIH1cbiAgICAgIC8vIE5vdGlmeSBsaXN0ZW5lcnNcbiAgICAgIGlmICh0aGlzLm9uQ3JlZHNVcGRhdGVkKSB7XG4gICAgICAgIHRoaXMub25DcmVkc1VwZGF0ZWQodGhpcy5fY3JlZGVudGlhbHMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGN0cmw7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQGNhbGxiYWNrIGNvbnRhY3RGaWx0ZXJcbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRhY3QgdG8gY2hlY2sgZm9yIGluY2x1c2lvbi5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIGNvbnRhY3Qgc2hvdWxkIGJlIHByb2Nlc3NlZCwgPGNvZGU+ZmFsc2U8L2NvZGU+IHRvIGV4Y2x1ZGUgaXQuXG4gICAqL1xuICAvKipcbiAgICogSXRlcmF0ZSBvdmVyIGNhY2hlZCBjb250YWN0cy5cbiAgICpcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWNNZSNcbiAgICogQHBhcmFtIHtUb3BpY01lLkNvbnRhY3RDYWxsYmFja30gY2FsbGJhY2sgLSBDYWxsYmFjayB0byBjYWxsIGZvciBlYWNoIGNvbnRhY3QuXG4gICAqIEBwYXJhbSB7Y29udGFjdEZpbHRlcj19IGZpbHRlciAtIE9wdGlvbmFsbHkgZmlsdGVyIGNvbnRhY3RzOyBpbmNsdWRlIGFsbCBpZiBmaWx0ZXIgaXMgZmFsc2UtaXNoLCBvdGhlcndpc2VcbiAgICogICAgICBpbmNsdWRlIHRob3NlIGZvciB3aGljaCBmaWx0ZXIgcmV0dXJucyB0cnVlLWlzaC5cbiAgICogQHBhcmFtIHtPYmplY3Q9fSBjb250ZXh0IC0gQ29udGV4dCB0byB1c2UgZm9yIGNhbGxpbmcgdGhlIGBjYWxsYmFja2AsIGkuZS4gdGhlIHZhbHVlIG9mIGB0aGlzYCBpbnNpZGUgdGhlIGNhbGxiYWNrLlxuICAgKi9cbiAgY29udGFjdHMoY2FsbGJhY2ssIGZpbHRlciwgY29udGV4dCkge1xuICAgIHRoaXMuX3Rpbm9kZS5tYXBUb3BpY3MoKGMsIGlkeCkgPT4ge1xuICAgICAgaWYgKGMuaXNDb21tVHlwZSgpICYmICghZmlsdGVyIHx8IGZpbHRlcihjKSkpIHtcbiAgICAgICAgY2FsbGJhY2suY2FsbChjb250ZXh0LCBjLCBpZHgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhIGNvbnRhY3QgZnJvbSBjYWNoZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpY01lI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIGNvbnRhY3QgdG8gZ2V0LCBlaXRoZXIgYSBVSUQgKGZvciBwMnAgdG9waWNzKSBvciBhIHRvcGljIG5hbWUuXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuQ29udGFjdH0gLSBDb250YWN0IG9yIGB1bmRlZmluZWRgLlxuICAgKi9cbiAgZ2V0Q29udGFjdChuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Rpbm9kZS5jYWNoZUdldFRvcGljKG5hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhY2Nlc3MgbW9kZSBvZiBhIGdpdmVuIGNvbnRhY3QgZnJvbSBjYWNoZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpY01lI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIGNvbnRhY3QgdG8gZ2V0IGFjY2VzcyBtb2RlIGZvciwgZWl0aGVyIGEgVUlEIChmb3IgcDJwIHRvcGljcylcbiAgICogICAgICAgIG9yIGEgdG9waWMgbmFtZTsgaWYgbWlzc2luZywgYWNjZXNzIG1vZGUgZm9yIHRoZSAnbWUnIHRvcGljIGl0c2VsZi5cbiAgICogQHJldHVybnMge3N0cmluZ30gLSBhY2Nlc3MgbW9kZSwgc3VjaCBhcyBgUldQYC5cbiAgICovXG4gIGdldEFjY2Vzc01vZGUobmFtZSkge1xuICAgIGlmIChuYW1lKSB7XG4gICAgICBjb25zdCBjb250ID0gdGhpcy5fdGlub2RlLmNhY2hlR2V0VG9waWMobmFtZSk7XG4gICAgICByZXR1cm4gY29udCA/IGNvbnQuYWNzIDogbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuYWNzO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGNvbnRhY3QgaXMgYXJjaGl2ZWQsIGkuZS4gY29udGFjdC5wcml2YXRlLmFyY2ggPT0gdHJ1ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpY01lI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIGNvbnRhY3QgdG8gY2hlY2sgYXJjaGl2ZWQgc3RhdHVzLCBlaXRoZXIgYSBVSUQgKGZvciBwMnAgdG9waWNzKSBvciBhIHRvcGljIG5hbWUuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIHRydWUgaWYgY29udGFjdCBpcyBhcmNoaXZlZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNBcmNoaXZlZChuYW1lKSB7XG4gICAgY29uc3QgY29udCA9IHRoaXMuX3Rpbm9kZS5jYWNoZUdldFRvcGljKG5hbWUpO1xuICAgIHJldHVybiBjb250ICYmIGNvbnQucHJpdmF0ZSAmJiAhIWNvbnQucHJpdmF0ZS5hcmNoO1xuICB9XG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIFRpbm9kZS5DcmVkZW50aWFsXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHR5cGUgT2JqZWN0XG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBtZXRoIC0gdmFsaWRhdGlvbiBtZXRob2Qgc3VjaCBhcyAnZW1haWwnIG9yICd0ZWwnLlxuICAgKiBAcHJvcGVydHkge3N0cmluZ30gdmFsIC0gY3JlZGVudGlhbCB2YWx1ZSwgaS5lLiAnamRvZUBleGFtcGxlLmNvbScgb3IgJysxNzAyNTU1MTIzNCdcbiAgICogQHByb3BlcnR5IHtib29sZWFufSBkb25lIC0gdHJ1ZSBpZiBjcmVkZW50aWFsIGlzIHZhbGlkYXRlZC5cbiAgICovXG4gIC8qKlxuICAgKiBHZXQgdGhlIHVzZXIncyBjcmVkZW50aWFsczogZW1haWwsIHBob25lLCBldGMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWNNZSNcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5DcmVkZW50aWFsW119IC0gYXJyYXkgb2YgY3JlZGVudGlhbHMuXG4gICAqL1xuICBnZXRDcmVkZW50aWFscygpIHtcbiAgICByZXR1cm4gdGhpcy5fY3JlZGVudGlhbHM7XG4gIH1cbn1cblxuLyoqXG4gKiBAY2xhc3MgVG9waWNGbmQgLSBzcGVjaWFsIGNhc2Ugb2Yge0BsaW5rIFRpbm9kZS5Ub3BpY30gZm9yIHNlYXJjaGluZyBmb3JcbiAqIGNvbnRhY3RzIGFuZCBncm91cCB0b3BpY3MuXG4gKiBAZXh0ZW5kcyBUaW5vZGUuVG9waWNcbiAqIEBtZW1iZXJvZiBUaW5vZGVcbiAqXG4gKiBAcGFyYW0ge1RvcGljRm5kLkNhbGxiYWNrc30gY2FsbGJhY2tzIC0gQ2FsbGJhY2tzIHRvIHJlY2VpdmUgdmFyaW91cyBldmVudHMuXG4gKi9cbmV4cG9ydCBjbGFzcyBUb3BpY0ZuZCBleHRlbmRzIFRvcGljIHtcbiAgLy8gTGlzdCBvZiB1c2VycyBhbmQgdG9waWNzIHVpZCBvciB0b3BpY19uYW1lIC0+IENvbnRhY3Qgb2JqZWN0KVxuICBfY29udGFjdHMgPSB7fTtcblxuICBjb25zdHJ1Y3RvcihjYWxsYmFja3MpIHtcbiAgICBzdXBlcihDb25zdC5UT1BJQ19GTkQsIGNhbGxiYWNrcyk7XG4gIH1cblxuICAvLyBPdmVycmlkZSB0aGUgb3JpZ2luYWwgVG9waWMuX3Byb2Nlc3NNZXRhU3ViXG4gIF9wcm9jZXNzTWV0YVN1YihzdWJzKSB7XG4gICAgbGV0IHVwZGF0ZUNvdW50ID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGhpcy5fY29udGFjdHMpLmxlbmd0aDtcbiAgICAvLyBSZXNldCBjb250YWN0IGxpc3QuXG4gICAgdGhpcy5fY29udGFjdHMgPSB7fTtcbiAgICBmb3IgKGxldCBpZHggaW4gc3Vicykge1xuICAgICAgbGV0IHN1YiA9IHN1YnNbaWR4XTtcbiAgICAgIGNvbnN0IGluZGV4QnkgPSBzdWIudG9waWMgPyBzdWIudG9waWMgOiBzdWIudXNlcjtcblxuICAgICAgc3ViID0gbWVyZ2VUb0NhY2hlKHRoaXMuX2NvbnRhY3RzLCBpbmRleEJ5LCBzdWIpO1xuICAgICAgdXBkYXRlQ291bnQrKztcblxuICAgICAgaWYgKHRoaXMub25NZXRhU3ViKSB7XG4gICAgICAgIHRoaXMub25NZXRhU3ViKHN1Yik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHVwZGF0ZUNvdW50ID4gMCAmJiB0aGlzLm9uU3Vic1VwZGF0ZWQpIHtcbiAgICAgIHRoaXMub25TdWJzVXBkYXRlZChPYmplY3Qua2V5cyh0aGlzLl9jb250YWN0cykpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQdWJsaXNoaW5nIHRvIFRvcGljRm5kIGlzIG5vdCBzdXBwb3J0ZWQuIHtAbGluayBUb3BpYyNwdWJsaXNofSBpcyBvdmVycmlkZW4gYW5kIHRob3dzIGFuIHtFcnJvcn0gaWYgY2FsbGVkLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljRm5kI1xuICAgKiBAdGhyb3dzIHtFcnJvcn0gQWx3YXlzIHRocm93cyBhbiBlcnJvci5cbiAgICovXG4gIHB1Ymxpc2goKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIlB1Ymxpc2hpbmcgdG8gJ2ZuZCcgaXMgbm90IHN1cHBvcnRlZFwiKSk7XG4gIH1cblxuICAvKipcbiAgICogc2V0TWV0YSB0byBUb3BpY0ZuZCByZXNldHMgY29udGFjdCBsaXN0IGluIGFkZGl0aW9uIHRvIHNlbmRpbmcgdGhlIG1lc3NhZ2UuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWNGbmQjXG4gICAqIEBwYXJhbSB7VGlub2RlLlNldFBhcmFtc30gcGFyYW1zIHBhcmFtZXRlcnMgdG8gdXBkYXRlLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gcmVxdWVzdC5cbiAgICovXG4gIHNldE1ldGEocGFyYW1zKSB7XG4gICAgcmV0dXJuIE9iamVjdC5nZXRQcm90b3R5cGVPZihUb3BpY0ZuZC5wcm90b3R5cGUpLnNldE1ldGEuY2FsbCh0aGlzLCBwYXJhbXMpLnRoZW4oKCkgPT4ge1xuICAgICAgaWYgKE9iamVjdC5rZXlzKHRoaXMuX2NvbnRhY3RzKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRoaXMuX2NvbnRhY3RzID0ge307XG4gICAgICAgIGlmICh0aGlzLm9uU3Vic1VwZGF0ZWQpIHtcbiAgICAgICAgICB0aGlzLm9uU3Vic1VwZGF0ZWQoW10pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogSXRlcmF0ZSBvdmVyIGZvdW5kIGNvbnRhY3RzLiBJZiBjYWxsYmFjayBpcyB1bmRlZmluZWQsIHVzZSB7QGxpbmsgdGhpcy5vbk1ldGFTdWJ9LlxuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpY0ZuZCNcbiAgICogQHBhcmFtIHtUb3BpY0ZuZC5Db250YWN0Q2FsbGJhY2t9IGNhbGxiYWNrIC0gQ2FsbGJhY2sgdG8gY2FsbCBmb3IgZWFjaCBjb250YWN0LlxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCAtIENvbnRleHQgdG8gdXNlIGZvciBjYWxsaW5nIHRoZSBgY2FsbGJhY2tgLCBpLmUuIHRoZSB2YWx1ZSBvZiBgdGhpc2AgaW5zaWRlIHRoZSBjYWxsYmFjay5cbiAgICovXG4gIGNvbnRhY3RzKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgY29uc3QgY2IgPSAoY2FsbGJhY2sgfHwgdGhpcy5vbk1ldGFTdWIpO1xuICAgIGlmIChjYikge1xuICAgICAgZm9yIChsZXQgaWR4IGluIHRoaXMuX2NvbnRhY3RzKSB7XG4gICAgICAgIGNiLmNhbGwoY29udGV4dCwgdGhpcy5fY29udGFjdHNbaWR4XSwgaWR4LCB0aGlzLl9jb250YWN0cyk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iLCIvKipcbiAqIEBmaWxlIFV0aWxpdGllcyB1c2VkIGluIG11bHRpcGxlIHBsYWNlcy5cbiAqXG4gKiBAY29weXJpZ2h0IDIwMTUtMjAyMiBUaW5vZGUgTExDLlxuICovXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCBBY2Nlc3NNb2RlIGZyb20gJy4vYWNjZXNzLW1vZGUuanMnO1xuaW1wb3J0IHtcbiAgREVMX0NIQVJcbn0gZnJvbSAnLi9jb25maWcuanMnO1xuXG4vLyBBdHRlbXB0IHRvIGNvbnZlcnQgZGF0ZSBhbmQgQWNjZXNzTW9kZSBzdHJpbmdzIHRvIG9iamVjdHMuXG5leHBvcnQgZnVuY3Rpb24ganNvblBhcnNlSGVscGVyKGtleSwgdmFsKSB7XG4gIC8vIFRyeSB0byBjb252ZXJ0IHN0cmluZyB0aW1lc3RhbXBzIHdpdGggb3B0aW9uYWwgbWlsbGlzZWNvbmRzIHRvIERhdGUsXG4gIC8vIGUuZy4gMjAxNS0wOS0wMlQwMTo0NTo0M1suMTIzXVpcbiAgaWYgKHR5cGVvZiB2YWwgPT0gJ3N0cmluZycgJiYgdmFsLmxlbmd0aCA+PSAyMCAmJiB2YWwubGVuZ3RoIDw9IDI0ICYmIFsndHMnLCAndG91Y2hlZCcsICd1cGRhdGVkJywgJ2NyZWF0ZWQnLCAnd2hlbicsICdkZWxldGVkJywgJ2V4cGlyZXMnXS5pbmNsdWRlcyhrZXkpKSB7XG5cbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUodmFsKTtcbiAgICBpZiAoIWlzTmFOKGRhdGUpKSB7XG4gICAgICByZXR1cm4gZGF0ZTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoa2V5ID09PSAnYWNzJyAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBuZXcgQWNjZXNzTW9kZSh2YWwpO1xuICB9XG4gIHJldHVybiB2YWw7XG59XG5cbi8vIENoZWNrcyBpZiBVUkwgaXMgYSByZWxhdGl2ZSB1cmwsIGkuZS4gaGFzIG5vICdzY2hlbWU6Ly8nLCBpbmNsdWRpbmcgdGhlIGNhc2Ugb2YgbWlzc2luZyBzY2hlbWUgJy8vJy5cbi8vIFRoZSBzY2hlbWUgaXMgZXhwZWN0ZWQgdG8gYmUgUkZDLWNvbXBsaWFudCwgZS5nLiBbYS16XVthLXowLTkrLi1dKlxuLy8gZXhhbXBsZS5odG1sIC0gb2tcbi8vIGh0dHBzOmV4YW1wbGUuY29tIC0gbm90IG9rLlxuLy8gaHR0cDovZXhhbXBsZS5jb20gLSBub3Qgb2suXG4vLyAnIOKGsiBodHRwczovL2V4YW1wbGUuY29tJyAtIG5vdCBvay4gKOKGsiBtZWFucyBjYXJyaWFnZSByZXR1cm4pXG5leHBvcnQgZnVuY3Rpb24gaXNVcmxSZWxhdGl2ZSh1cmwpIHtcbiAgcmV0dXJuIHVybCAmJiAhL15cXHMqKFthLXpdW2EtejAtOSsuLV0qOnxcXC9cXC8pL2ltLnRlc3QodXJsKTtcbn1cblxuZnVuY3Rpb24gaXNWYWxpZERhdGUoZCkge1xuICByZXR1cm4gKGQgaW5zdGFuY2VvZiBEYXRlKSAmJiAhaXNOYU4oZCkgJiYgKGQuZ2V0VGltZSgpICE9IDApO1xufVxuXG4vLyBSRkMzMzM5IGZvcm1hdGVyIG9mIERhdGVcbmV4cG9ydCBmdW5jdGlvbiByZmMzMzM5RGF0ZVN0cmluZyhkKSB7XG4gIGlmICghaXNWYWxpZERhdGUoZCkpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgY29uc3QgcGFkID0gZnVuY3Rpb24odmFsLCBzcCkge1xuICAgIHNwID0gc3AgfHwgMjtcbiAgICByZXR1cm4gJzAnLnJlcGVhdChzcCAtICgnJyArIHZhbCkubGVuZ3RoKSArIHZhbDtcbiAgfTtcblxuICBjb25zdCBtaWxsaXMgPSBkLmdldFVUQ01pbGxpc2Vjb25kcygpO1xuICByZXR1cm4gZC5nZXRVVENGdWxsWWVhcigpICsgJy0nICsgcGFkKGQuZ2V0VVRDTW9udGgoKSArIDEpICsgJy0nICsgcGFkKGQuZ2V0VVRDRGF0ZSgpKSArXG4gICAgJ1QnICsgcGFkKGQuZ2V0VVRDSG91cnMoKSkgKyAnOicgKyBwYWQoZC5nZXRVVENNaW51dGVzKCkpICsgJzonICsgcGFkKGQuZ2V0VVRDU2Vjb25kcygpKSArXG4gICAgKG1pbGxpcyA/ICcuJyArIHBhZChtaWxsaXMsIDMpIDogJycpICsgJ1onO1xufVxuXG4vLyBSZWN1cnNpdmVseSBtZXJnZSBzcmMncyBvd24gcHJvcGVydGllcyB0byBkc3QuXG4vLyBJZ25vcmUgcHJvcGVydGllcyB3aGVyZSBpZ25vcmVbcHJvcGVydHldIGlzIHRydWUuXG4vLyBBcnJheSBhbmQgRGF0ZSBvYmplY3RzIGFyZSBzaGFsbG93LWNvcGllZC5cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZU9iaihkc3QsIHNyYywgaWdub3JlKSB7XG4gIGlmICh0eXBlb2Ygc3JjICE9ICdvYmplY3QnKSB7XG4gICAgaWYgKHNyYyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gZHN0O1xuICAgIH1cbiAgICBpZiAoc3JjID09PSBERUxfQ0hBUikge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIHNyYztcbiAgfVxuICAvLyBKUyBpcyBjcmF6eTogdHlwZW9mIG51bGwgaXMgJ29iamVjdCcuXG4gIGlmIChzcmMgPT09IG51bGwpIHtcbiAgICByZXR1cm4gc3JjO1xuICB9XG5cbiAgLy8gSGFuZGxlIERhdGVcbiAgaWYgKHNyYyBpbnN0YW5jZW9mIERhdGUgJiYgIWlzTmFOKHNyYykpIHtcbiAgICByZXR1cm4gKCFkc3QgfHwgIShkc3QgaW5zdGFuY2VvZiBEYXRlKSB8fCBpc05hTihkc3QpIHx8IGRzdCA8IHNyYykgPyBzcmMgOiBkc3Q7XG4gIH1cblxuICAvLyBBY2Nlc3MgbW9kZVxuICBpZiAoc3JjIGluc3RhbmNlb2YgQWNjZXNzTW9kZSkge1xuICAgIHJldHVybiBuZXcgQWNjZXNzTW9kZShzcmMpO1xuICB9XG5cbiAgLy8gSGFuZGxlIEFycmF5XG4gIGlmIChzcmMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgIHJldHVybiBzcmM7XG4gIH1cblxuICBpZiAoIWRzdCB8fCBkc3QgPT09IERFTF9DSEFSKSB7XG4gICAgZHN0ID0gc3JjLmNvbnN0cnVjdG9yKCk7XG4gIH1cblxuICBmb3IgKGxldCBwcm9wIGluIHNyYykge1xuICAgIGlmIChzcmMuaGFzT3duUHJvcGVydHkocHJvcCkgJiYgKCFpZ25vcmUgfHwgIWlnbm9yZVtwcm9wXSkgJiYgKHByb3AgIT0gJ19ub0ZvcndhcmRpbmcnKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgZHN0W3Byb3BdID0gbWVyZ2VPYmooZHN0W3Byb3BdLCBzcmNbcHJvcF0pO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIC8vIEZJWE1FOiBwcm9iYWJseSBuZWVkIHRvIGxvZyBzb21ldGhpbmcgaGVyZS5cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRzdDtcbn1cblxuLy8gVXBkYXRlIG9iamVjdCBzdG9yZWQgaW4gYSBjYWNoZS4gUmV0dXJucyB1cGRhdGVkIHZhbHVlLlxuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlVG9DYWNoZShjYWNoZSwga2V5LCBuZXd2YWwsIGlnbm9yZSkge1xuICBjYWNoZVtrZXldID0gbWVyZ2VPYmooY2FjaGVba2V5XSwgbmV3dmFsLCBpZ25vcmUpO1xuICByZXR1cm4gY2FjaGVba2V5XTtcbn1cblxuLy8gU3RyaXBzIGFsbCB2YWx1ZXMgZnJvbSBhbiBvYmplY3Qgb2YgdGhleSBldmFsdWF0ZSB0byBmYWxzZSBvciBpZiB0aGVpciBuYW1lIHN0YXJ0cyB3aXRoICdfJy5cbi8vIFVzZWQgb24gYWxsIG91dGdvaW5nIG9iamVjdCBiZWZvcmUgc2VyaWFsaXphdGlvbiB0byBzdHJpbmcuXG5leHBvcnQgZnVuY3Rpb24gc2ltcGxpZnkob2JqKSB7XG4gIE9iamVjdC5rZXlzKG9iaikuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgaWYgKGtleVswXSA9PSAnXycpIHtcbiAgICAgIC8vIFN0cmlwIGZpZWxkcyBsaWtlIFwib2JqLl9rZXlcIi5cbiAgICAgIGRlbGV0ZSBvYmpba2V5XTtcbiAgICB9IGVsc2UgaWYgKCFvYmpba2V5XSkge1xuICAgICAgLy8gU3RyaXAgZmllbGRzIHdoaWNoIGV2YWx1YXRlIHRvIGZhbHNlLlxuICAgICAgZGVsZXRlIG9ialtrZXldO1xuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShvYmpba2V5XSkgJiYgb2JqW2tleV0ubGVuZ3RoID09IDApIHtcbiAgICAgIC8vIFN0cmlwIGVtcHR5IGFycmF5cy5cbiAgICAgIGRlbGV0ZSBvYmpba2V5XTtcbiAgICB9IGVsc2UgaWYgKCFvYmpba2V5XSkge1xuICAgICAgLy8gU3RyaXAgZmllbGRzIHdoaWNoIGV2YWx1YXRlIHRvIGZhbHNlLlxuICAgICAgZGVsZXRlIG9ialtrZXldO1xuICAgIH0gZWxzZSBpZiAob2JqW2tleV0gaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAvLyBTdHJpcCBpbnZhbGlkIG9yIHplcm8gZGF0ZS5cbiAgICAgIGlmICghaXNWYWxpZERhdGUob2JqW2tleV0pKSB7XG4gICAgICAgIGRlbGV0ZSBvYmpba2V5XTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBvYmpba2V5XSA9PSAnb2JqZWN0Jykge1xuICAgICAgc2ltcGxpZnkob2JqW2tleV0pO1xuICAgICAgLy8gU3RyaXAgZW1wdHkgb2JqZWN0cy5cbiAgICAgIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvYmpba2V5XSkubGVuZ3RoID09IDApIHtcbiAgICAgICAgZGVsZXRlIG9ialtrZXldO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvYmo7XG59O1xuXG5cbi8vIFRyaW0gd2hpdGVzcGFjZSwgc3RyaXAgZW1wdHkgYW5kIGR1cGxpY2F0ZSBlbGVtZW50cyBlbGVtZW50cy5cbi8vIElmIHRoZSByZXN1bHQgaXMgYW4gZW1wdHkgYXJyYXksIGFkZCBhIHNpbmdsZSBlbGVtZW50IFwiXFx1MjQyMVwiIChVbmljb2RlIERlbCBjaGFyYWN0ZXIpLlxuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZUFycmF5KGFycikge1xuICBsZXQgb3V0ID0gW107XG4gIGlmIChBcnJheS5pc0FycmF5KGFycikpIHtcbiAgICAvLyBUcmltLCB0aHJvdyBhd2F5IHZlcnkgc2hvcnQgYW5kIGVtcHR5IHRhZ3MuXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSBhcnIubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBsZXQgdCA9IGFycltpXTtcbiAgICAgIGlmICh0KSB7XG4gICAgICAgIHQgPSB0LnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBpZiAodC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgb3V0LnB1c2godCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgb3V0LnNvcnQoKS5maWx0ZXIoZnVuY3Rpb24oaXRlbSwgcG9zLCBhcnkpIHtcbiAgICAgIHJldHVybiAhcG9zIHx8IGl0ZW0gIT0gYXJ5W3BvcyAtIDFdO1xuICAgIH0pO1xuICB9XG4gIGlmIChvdXQubGVuZ3RoID09IDApIHtcbiAgICAvLyBBZGQgc2luZ2xlIHRhZyB3aXRoIGEgVW5pY29kZSBEZWwgY2hhcmFjdGVyLCBvdGhlcndpc2UgYW4gYW1wdHkgYXJyYXlcbiAgICAvLyBpcyBhbWJpZ3Vvcy4gVGhlIERlbCB0YWcgd2lsbCBiZSBzdHJpcHBlZCBieSB0aGUgc2VydmVyLlxuICAgIG91dC5wdXNoKERFTF9DSEFSKTtcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuIiwibW9kdWxlLmV4cG9ydHM9e1widmVyc2lvblwiOiBcIjAuMjEuMC1iZXRhMVwifVxuIl19

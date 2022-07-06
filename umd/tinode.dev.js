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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
    _insertSorted.add(this);

    _findNearest.add(this);

    _comparator.set(this, {
      writable: true,
      value: undefined
    });

    _unique.set(this, {
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
exports.DEL_CHAR = exports.DEFAULT_MESSAGES_PAGE = exports.RECV_TIMEOUT = exports.EXPIRE_PROMISES_PERIOD = exports.EXPIRE_PROMISES_TIMEOUT = exports.MESSAGE_STATUS_DEL_RANGE = exports.MESSAGE_STATUS_TO_ME = exports.MESSAGE_STATUS_READ = exports.MESSAGE_STATUS_RECEIVED = exports.MESSAGE_STATUS_SENT = exports.MESSAGE_STATUS_FAILED = exports.MESSAGE_STATUS_SENDING = exports.MESSAGE_STATUS_QUEUED = exports.MESSAGE_STATUS_NONE = exports.LOCAL_SEQID = exports.USER_NEW = exports.TOPIC_P2P = exports.TOPIC_GRP = exports.TOPIC_CHAN = exports.TOPIC_SYS = exports.TOPIC_FND = exports.TOPIC_ME = exports.TOPIC_NEW_CHAN = exports.TOPIC_NEW = exports.LIBRARY = exports.VERSION = exports.PROTOCOL_VERSION = void 0;

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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
    _init_ws.add(this);

    _init_lp.add(this);

    _boffReset.add(this);

    _boffStop.add(this);

    _boffReconnect.add(this);

    _boffTimer.set(this, {
      writable: true,
      value: null
    });

    _boffIteration.set(this, {
      writable: true,
      value: 0
    });

    _boffClosed.set(this, {
      writable: true,
      value: false
    });

    _socket.set(this, {
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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
    _mapObjects.add(this);

    _onError.set(this, {
      writable: true,
      value: _ => {}
    });

    _logger.set(this, {
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
    if (!this._authToken) {
      throw new Error("Must authenticate first");
    }

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
    this.xhr.setRequestHeader('X-Tinode-Auth', `Token ${this._authToken.token}`);
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
    if (!Tinode.isRelativeURL(relativeUrl)) {
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

function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }

var _get_desc_ims = new WeakSet();

var _get_subs_ims = new WeakSet();

class MetaGetBuilder {
  constructor(parent) {
    _get_subs_ims.add(this);

    _get_desc_ims.add(this);

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
    global.btoa = function (input = '') {
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
    global.atob = function (input = '') {
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
    _loginSuccessful.add(this);

    _attachCacheToTopic.add(this);

    _cacheMap.add(this);

    _cacheDel.add(this);

    _cacheGet.add(this);

    _cachePut.add(this);

    _initPacket.add(this);

    _getUserAgent.add(this);

    _disconnected.add(this);

    _connectionOpen.add(this);

    _dispatchMessage.add(this);

    _send.add(this);

    _execPromise.add(this);

    _makePromise.add(this);

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

  logger(str, ...args) {
    if (this._loggingEnabled) {
      const d = new Date();
      const dateString = ('0' + d.getUTCHours()).slice(-2) + ':' + ('0' + d.getUTCMinutes()).slice(-2) + ':' + ('0' + d.getUTCSeconds()).slice(-2) + '.' + ('00' + d.getUTCMilliseconds()).slice(-3);
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
exports.TopicFnd = exports.TopicMe = exports.Topic = void 0;

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
exports.jsonParseHelper = jsonParseHelper;
exports.isUrlRelative = isUrlRelative;
exports.rfc3339DateString = rfc3339DateString;
exports.mergeObj = mergeObj;
exports.mergeToCache = mergeToCache;
exports.simplify = simplify;
exports.normalizeArray = normalizeArray;

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
module.exports={"version": "0.20.0-beta2"}

},{}]},{},[9])(9)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYWNjZXNzLW1vZGUuanMiLCJzcmMvY2J1ZmZlci5qcyIsInNyYy9jb25maWcuanMiLCJzcmMvY29ubmVjdGlvbi5qcyIsInNyYy9kYi5qcyIsInNyYy9kcmFmdHkuanMiLCJzcmMvbGFyZ2UtZmlsZS5qcyIsInNyYy9tZXRhLWJ1aWxkZXIuanMiLCJzcmMvdGlub2RlLmpzIiwic3JjL3RvcGljLmpzIiwic3JjL3V0aWxzLmpzIiwidmVyc2lvbi5qc29uIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDS0E7Ozs7Ozs7Ozs7O0FBY2UsTUFBTSxVQUFOLENBQWlCO0FBQzlCLEVBQUEsV0FBVyxDQUFDLEdBQUQsRUFBTTtBQUNmLFFBQUksR0FBSixFQUFTO0FBQ1AsV0FBSyxLQUFMLEdBQWEsT0FBTyxHQUFHLENBQUMsS0FBWCxJQUFvQixRQUFwQixHQUErQixHQUFHLENBQUMsS0FBbkMsR0FBMkMsVUFBVSxDQUFDLE1BQVgsQ0FBa0IsR0FBRyxDQUFDLEtBQXRCLENBQXhEO0FBQ0EsV0FBSyxJQUFMLEdBQVksT0FBTyxHQUFHLENBQUMsSUFBWCxJQUFtQixRQUFuQixHQUE4QixHQUFHLENBQUMsSUFBbEMsR0FBeUMsVUFBVSxDQUFDLE1BQVgsQ0FBa0IsR0FBRyxDQUFDLElBQXRCLENBQXJEO0FBQ0EsV0FBSyxJQUFMLEdBQVksR0FBRyxDQUFDLElBQUosR0FBWSxPQUFPLEdBQUcsQ0FBQyxJQUFYLElBQW1CLFFBQW5CLEdBQThCLEdBQUcsQ0FBQyxJQUFsQyxHQUF5QyxVQUFVLENBQUMsTUFBWCxDQUFrQixHQUFHLENBQUMsSUFBdEIsQ0FBckQsR0FDVCxLQUFLLEtBQUwsR0FBYSxLQUFLLElBRHJCO0FBRUQ7QUFDRjs7QUFpQlksU0FBTixNQUFNLENBQUMsR0FBRCxFQUFNO0FBQ2pCLFFBQUksQ0FBQyxHQUFMLEVBQVU7QUFDUixhQUFPLElBQVA7QUFDRCxLQUZELE1BRU8sSUFBSSxPQUFPLEdBQVAsSUFBYyxRQUFsQixFQUE0QjtBQUNqQyxhQUFPLEdBQUcsR0FBRyxVQUFVLENBQUMsUUFBeEI7QUFDRCxLQUZNLE1BRUEsSUFBSSxHQUFHLEtBQUssR0FBUixJQUFlLEdBQUcsS0FBSyxHQUEzQixFQUFnQztBQUNyQyxhQUFPLFVBQVUsQ0FBQyxLQUFsQjtBQUNEOztBQUVELFVBQU0sT0FBTyxHQUFHO0FBQ2QsV0FBSyxVQUFVLENBQUMsS0FERjtBQUVkLFdBQUssVUFBVSxDQUFDLEtBRkY7QUFHZCxXQUFLLFVBQVUsQ0FBQyxNQUhGO0FBSWQsV0FBSyxVQUFVLENBQUMsS0FKRjtBQUtkLFdBQUssVUFBVSxDQUFDLFFBTEY7QUFNZCxXQUFLLFVBQVUsQ0FBQyxNQU5GO0FBT2QsV0FBSyxVQUFVLENBQUMsT0FQRjtBQVFkLFdBQUssVUFBVSxDQUFDO0FBUkYsS0FBaEI7QUFXQSxRQUFJLEVBQUUsR0FBRyxVQUFVLENBQUMsS0FBcEI7O0FBRUEsU0FBSyxJQUFJLENBQUMsR0FBRyxDQUFiLEVBQWdCLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBeEIsRUFBZ0MsQ0FBQyxFQUFqQyxFQUFxQztBQUNuQyxZQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQUosQ0FBVyxDQUFYLEVBQWMsV0FBZCxFQUFELENBQW5COztBQUNBLFVBQUksQ0FBQyxHQUFMLEVBQVU7QUFFUjtBQUNEOztBQUNELE1BQUEsRUFBRSxJQUFJLEdBQU47QUFDRDs7QUFDRCxXQUFPLEVBQVA7QUFDRDs7QUFVWSxTQUFOLE1BQU0sQ0FBQyxHQUFELEVBQU07QUFDakIsUUFBSSxHQUFHLEtBQUssSUFBUixJQUFnQixHQUFHLEtBQUssVUFBVSxDQUFDLFFBQXZDLEVBQWlEO0FBQy9DLGFBQU8sSUFBUDtBQUNELEtBRkQsTUFFTyxJQUFJLEdBQUcsS0FBSyxVQUFVLENBQUMsS0FBdkIsRUFBOEI7QUFDbkMsYUFBTyxHQUFQO0FBQ0Q7O0FBRUQsVUFBTSxPQUFPLEdBQUcsQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEdBQVgsRUFBZ0IsR0FBaEIsRUFBcUIsR0FBckIsRUFBMEIsR0FBMUIsRUFBK0IsR0FBL0IsRUFBb0MsR0FBcEMsQ0FBaEI7QUFDQSxRQUFJLEdBQUcsR0FBRyxFQUFWOztBQUNBLFNBQUssSUFBSSxDQUFDLEdBQUcsQ0FBYixFQUFnQixDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQTVCLEVBQW9DLENBQUMsRUFBckMsRUFBeUM7QUFDdkMsVUFBSSxDQUFDLEdBQUcsR0FBSSxLQUFLLENBQWIsS0FBb0IsQ0FBeEIsRUFBMkI7QUFDekIsUUFBQSxHQUFHLEdBQUcsR0FBRyxHQUFHLE9BQU8sQ0FBQyxDQUFELENBQW5CO0FBQ0Q7QUFDRjs7QUFDRCxXQUFPLEdBQVA7QUFDRDs7QUFjWSxTQUFOLE1BQU0sQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXO0FBQ3RCLFFBQUksQ0FBQyxHQUFELElBQVEsT0FBTyxHQUFQLElBQWMsUUFBMUIsRUFBb0M7QUFDbEMsYUFBTyxHQUFQO0FBQ0Q7O0FBRUQsUUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQUosQ0FBVyxDQUFYLENBQWI7O0FBQ0EsUUFBSSxNQUFNLElBQUksR0FBVixJQUFpQixNQUFNLElBQUksR0FBL0IsRUFBb0M7QUFDbEMsVUFBSSxJQUFJLEdBQUcsR0FBWDtBQUVBLFlBQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFKLENBQVUsUUFBVixDQUFkOztBQUdBLFdBQUssSUFBSSxDQUFDLEdBQUcsQ0FBYixFQUFnQixDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU4sR0FBZSxDQUFuQyxFQUFzQyxDQUFDLElBQUksQ0FBM0MsRUFBOEM7QUFDNUMsUUFBQSxNQUFNLEdBQUcsS0FBSyxDQUFDLENBQUQsQ0FBZDtBQUNBLGNBQU0sRUFBRSxHQUFHLFVBQVUsQ0FBQyxNQUFYLENBQWtCLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBTCxDQUF2QixDQUFYOztBQUNBLFlBQUksRUFBRSxJQUFJLFVBQVUsQ0FBQyxRQUFyQixFQUErQjtBQUM3QixpQkFBTyxHQUFQO0FBQ0Q7O0FBQ0QsWUFBSSxFQUFFLElBQUksSUFBVixFQUFnQjtBQUNkO0FBQ0Q7O0FBQ0QsWUFBSSxNQUFNLEtBQUssR0FBZixFQUFvQjtBQUNsQixVQUFBLElBQUksSUFBSSxFQUFSO0FBQ0QsU0FGRCxNQUVPLElBQUksTUFBTSxLQUFLLEdBQWYsRUFBb0I7QUFDekIsVUFBQSxJQUFJLElBQUksQ0FBQyxFQUFUO0FBQ0Q7QUFDRjs7QUFDRCxNQUFBLEdBQUcsR0FBRyxJQUFOO0FBQ0QsS0F0QkQsTUFzQk87QUFFTCxZQUFNLElBQUksR0FBRyxVQUFVLENBQUMsTUFBWCxDQUFrQixHQUFsQixDQUFiOztBQUNBLFVBQUksSUFBSSxJQUFJLFVBQVUsQ0FBQyxRQUF2QixFQUFpQztBQUMvQixRQUFBLEdBQUcsR0FBRyxJQUFOO0FBQ0Q7QUFDRjs7QUFFRCxXQUFPLEdBQVA7QUFDRDs7QUFXVSxTQUFKLElBQUksQ0FBQyxFQUFELEVBQUssRUFBTCxFQUFTO0FBQ2xCLElBQUEsRUFBRSxHQUFHLFVBQVUsQ0FBQyxNQUFYLENBQWtCLEVBQWxCLENBQUw7QUFDQSxJQUFBLEVBQUUsR0FBRyxVQUFVLENBQUMsTUFBWCxDQUFrQixFQUFsQixDQUFMOztBQUVBLFFBQUksRUFBRSxJQUFJLFVBQVUsQ0FBQyxRQUFqQixJQUE2QixFQUFFLElBQUksVUFBVSxDQUFDLFFBQWxELEVBQTREO0FBQzFELGFBQU8sVUFBVSxDQUFDLFFBQWxCO0FBQ0Q7O0FBQ0QsV0FBTyxFQUFFLEdBQUcsQ0FBQyxFQUFiO0FBQ0Q7O0FBVUQsRUFBQSxRQUFRLEdBQUc7QUFDVCxXQUFPLGVBQWUsVUFBVSxDQUFDLE1BQVgsQ0FBa0IsS0FBSyxJQUF2QixDQUFmLEdBQ0wsZUFESyxHQUNhLFVBQVUsQ0FBQyxNQUFYLENBQWtCLEtBQUssS0FBdkIsQ0FEYixHQUVMLGNBRkssR0FFWSxVQUFVLENBQUMsTUFBWCxDQUFrQixLQUFLLElBQXZCLENBRlosR0FFMkMsSUFGbEQ7QUFHRDs7QUFVRCxFQUFBLFVBQVUsR0FBRztBQUNYLFdBQU87QUFDTCxNQUFBLElBQUksRUFBRSxVQUFVLENBQUMsTUFBWCxDQUFrQixLQUFLLElBQXZCLENBREQ7QUFFTCxNQUFBLEtBQUssRUFBRSxVQUFVLENBQUMsTUFBWCxDQUFrQixLQUFLLEtBQXZCLENBRkY7QUFHTCxNQUFBLElBQUksRUFBRSxVQUFVLENBQUMsTUFBWCxDQUFrQixLQUFLLElBQXZCO0FBSEQsS0FBUDtBQUtEOztBQWNELEVBQUEsT0FBTyxDQUFDLENBQUQsRUFBSTtBQUNULFNBQUssSUFBTCxHQUFZLFVBQVUsQ0FBQyxNQUFYLENBQWtCLENBQWxCLENBQVo7QUFDQSxXQUFPLElBQVA7QUFDRDs7QUFjRCxFQUFBLFVBQVUsQ0FBQyxDQUFELEVBQUk7QUFDWixTQUFLLElBQUwsR0FBWSxVQUFVLENBQUMsTUFBWCxDQUFrQixLQUFLLElBQXZCLEVBQTZCLENBQTdCLENBQVo7QUFDQSxXQUFPLElBQVA7QUFDRDs7QUFhRCxFQUFBLE9BQU8sR0FBRztBQUNSLFdBQU8sVUFBVSxDQUFDLE1BQVgsQ0FBa0IsS0FBSyxJQUF2QixDQUFQO0FBQ0Q7O0FBY0QsRUFBQSxRQUFRLENBQUMsQ0FBRCxFQUFJO0FBQ1YsU0FBSyxLQUFMLEdBQWEsVUFBVSxDQUFDLE1BQVgsQ0FBa0IsQ0FBbEIsQ0FBYjtBQUNBLFdBQU8sSUFBUDtBQUNEOztBQWNELEVBQUEsV0FBVyxDQUFDLENBQUQsRUFBSTtBQUNiLFNBQUssS0FBTCxHQUFhLFVBQVUsQ0FBQyxNQUFYLENBQWtCLEtBQUssS0FBdkIsRUFBOEIsQ0FBOUIsQ0FBYjtBQUNBLFdBQU8sSUFBUDtBQUNEOztBQWFELEVBQUEsUUFBUSxHQUFHO0FBQ1QsV0FBTyxVQUFVLENBQUMsTUFBWCxDQUFrQixLQUFLLEtBQXZCLENBQVA7QUFDRDs7QUFjRCxFQUFBLE9BQU8sQ0FBQyxDQUFELEVBQUk7QUFDVCxTQUFLLElBQUwsR0FBWSxVQUFVLENBQUMsTUFBWCxDQUFrQixDQUFsQixDQUFaO0FBQ0EsV0FBTyxJQUFQO0FBQ0Q7O0FBY0QsRUFBQSxVQUFVLENBQUMsQ0FBRCxFQUFJO0FBQ1osU0FBSyxJQUFMLEdBQVksVUFBVSxDQUFDLE1BQVgsQ0FBa0IsS0FBSyxJQUF2QixFQUE2QixDQUE3QixDQUFaO0FBQ0EsV0FBTyxJQUFQO0FBQ0Q7O0FBYUQsRUFBQSxPQUFPLEdBQUc7QUFDUixXQUFPLFVBQVUsQ0FBQyxNQUFYLENBQWtCLEtBQUssSUFBdkIsQ0FBUDtBQUNEOztBQWVELEVBQUEsVUFBVSxHQUFHO0FBQ1gsV0FBTyxVQUFVLENBQUMsTUFBWCxDQUFrQixLQUFLLElBQUwsR0FBWSxDQUFDLEtBQUssS0FBcEMsQ0FBUDtBQUNEOztBQWNELEVBQUEsWUFBWSxHQUFHO0FBQ2IsV0FBTyxVQUFVLENBQUMsTUFBWCxDQUFrQixLQUFLLEtBQUwsR0FBYSxDQUFDLEtBQUssSUFBckMsQ0FBUDtBQUNEOztBQWNELEVBQUEsU0FBUyxDQUFDLEdBQUQsRUFBTTtBQUNiLFFBQUksR0FBSixFQUFTO0FBQ1AsV0FBSyxXQUFMLENBQWlCLEdBQUcsQ0FBQyxLQUFyQjtBQUNBLFdBQUssVUFBTCxDQUFnQixHQUFHLENBQUMsSUFBcEI7QUFDQSxXQUFLLElBQUwsR0FBWSxLQUFLLEtBQUwsR0FBYSxLQUFLLElBQTlCO0FBQ0Q7O0FBQ0QsV0FBTyxJQUFQO0FBQ0Q7O0FBYUQsRUFBQSxPQUFPLENBQUMsSUFBRCxFQUFPO0FBQ1osd0NBQU8sVUFBUCxFQTVZaUIsVUE0WWpCLG1CQUFPLFVBQVAsRUFBNkIsSUFBN0IsRUFBbUMsSUFBbkMsRUFBeUMsVUFBVSxDQUFDLE1BQXBEO0FBQ0Q7O0FBYUQsRUFBQSxXQUFXLENBQUMsSUFBRCxFQUFPO0FBQ2hCLHdDQUFPLFVBQVAsRUEzWmlCLFVBMlpqQixtQkFBTyxVQUFQLEVBQTZCLElBQTdCLEVBQW1DLElBQW5DLEVBQXlDLFVBQVUsQ0FBQyxLQUFwRDtBQUNEOztBQWFELEVBQUEsT0FBTyxDQUFDLElBQUQsRUFBTztBQUNaLFdBQU8sQ0FBQyxLQUFLLFdBQUwsQ0FBaUIsSUFBakIsQ0FBUjtBQUNEOztBQWFELEVBQUEsUUFBUSxDQUFDLElBQUQsRUFBTztBQUNiLHdDQUFPLFVBQVAsRUF6YmlCLFVBeWJqQixtQkFBTyxVQUFQLEVBQTZCLElBQTdCLEVBQW1DLElBQW5DLEVBQXlDLFVBQVUsQ0FBQyxLQUFwRDtBQUNEOztBQWFELEVBQUEsUUFBUSxDQUFDLElBQUQsRUFBTztBQUNiLHdDQUFPLFVBQVAsRUF4Y2lCLFVBd2NqQixtQkFBTyxVQUFQLEVBQTZCLElBQTdCLEVBQW1DLElBQW5DLEVBQXlDLFVBQVUsQ0FBQyxLQUFwRDtBQUNEOztBQWFELEVBQUEsUUFBUSxDQUFDLElBQUQsRUFBTztBQUNiLHdDQUFPLFVBQVAsRUF2ZGlCLFVBdWRqQixtQkFBTyxVQUFQLEVBQTZCLElBQTdCLEVBQW1DLElBQW5DLEVBQXlDLFVBQVUsQ0FBQyxNQUFwRDtBQUNEOztBQWFELEVBQUEsVUFBVSxDQUFDLElBQUQsRUFBTztBQUNmLHdDQUFPLFVBQVAsRUF0ZWlCLFVBc2VqQixtQkFBTyxVQUFQLEVBQTZCLElBQTdCLEVBQW1DLElBQW5DLEVBQXlDLFVBQVUsQ0FBQyxRQUFwRDtBQUNEOztBQWFELEVBQUEsT0FBTyxDQUFDLElBQUQsRUFBTztBQUNaLFdBQU8sS0FBSyxPQUFMLENBQWEsSUFBYixLQUFzQixLQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsQ0FBN0I7QUFDRDs7QUFhRCxFQUFBLFFBQVEsQ0FBQyxJQUFELEVBQU87QUFDYixXQUFPLEtBQUssT0FBTCxDQUFhLElBQWIsa0NBQXNCLFVBQXRCLEVBcGdCVSxVQW9nQlYsbUJBQXNCLFVBQXRCLEVBQTRDLElBQTVDLEVBQWtELElBQWxELEVBQXdELFVBQVUsQ0FBQyxNQUFuRSxDQUFQO0FBQ0Q7O0FBYUQsRUFBQSxTQUFTLENBQUMsSUFBRCxFQUFPO0FBQ2Qsd0NBQU8sVUFBUCxFQW5oQmlCLFVBbWhCakIsbUJBQU8sVUFBUCxFQUE2QixJQUE3QixFQUFtQyxJQUFuQyxFQUF5QyxVQUFVLENBQUMsT0FBcEQ7QUFDRDs7QUFwaEI2Qjs7OztvQkFVWixHLEVBQUssSSxFQUFNLEksRUFBTTtBQUNqQyxFQUFBLElBQUksR0FBRyxJQUFJLElBQUksTUFBZjs7QUFDQSxNQUFJLENBQUMsT0FBRCxFQUFVLE1BQVYsRUFBa0IsTUFBbEIsRUFBMEIsUUFBMUIsQ0FBbUMsSUFBbkMsQ0FBSixFQUE4QztBQUM1QyxXQUFRLENBQUMsR0FBRyxDQUFDLElBQUQsQ0FBSCxHQUFZLElBQWIsS0FBc0IsQ0FBOUI7QUFDRDs7QUFDRCxRQUFNLElBQUksS0FBSixDQUFXLGlDQUFnQyxJQUFLLEdBQWhELENBQU47QUFDRDs7QUF1Z0JILFVBQVUsQ0FBQyxLQUFYLEdBQW1CLElBQW5CO0FBQ0EsVUFBVSxDQUFDLEtBQVgsR0FBbUIsSUFBbkI7QUFDQSxVQUFVLENBQUMsS0FBWCxHQUFtQixJQUFuQjtBQUNBLFVBQVUsQ0FBQyxNQUFYLEdBQW9CLElBQXBCO0FBQ0EsVUFBVSxDQUFDLEtBQVgsR0FBbUIsSUFBbkI7QUFDQSxVQUFVLENBQUMsUUFBWCxHQUFzQixJQUF0QjtBQUNBLFVBQVUsQ0FBQyxNQUFYLEdBQW9CLElBQXBCO0FBQ0EsVUFBVSxDQUFDLE9BQVgsR0FBcUIsSUFBckI7QUFDQSxVQUFVLENBQUMsTUFBWCxHQUFvQixJQUFwQjtBQUVBLFVBQVUsQ0FBQyxRQUFYLEdBQXNCLFVBQVUsQ0FBQyxLQUFYLEdBQW1CLFVBQVUsQ0FBQyxLQUE5QixHQUFzQyxVQUFVLENBQUMsTUFBakQsR0FBMEQsVUFBVSxDQUFDLEtBQXJFLEdBQ3BCLFVBQVUsQ0FBQyxRQURTLEdBQ0UsVUFBVSxDQUFDLE1BRGIsR0FDc0IsVUFBVSxDQUFDLE9BRGpDLEdBQzJDLFVBQVUsQ0FBQyxNQUQ1RTtBQUVBLFVBQVUsQ0FBQyxRQUFYLEdBQXNCLFFBQXRCOzs7QUNqakJBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWNlLE1BQU0sT0FBTixDQUFjO0FBSzNCLEVBQUEsV0FBVyxDQUFDLFFBQUQsRUFBVyxPQUFYLEVBQW9CO0FBQUE7O0FBQUE7O0FBQUE7QUFBQTtBQUFBLGFBSmpCO0FBSWlCOztBQUFBO0FBQUE7QUFBQSxhQUhyQjtBQUdxQjs7QUFBQSxvQ0FGdEIsRUFFc0I7O0FBQzdCLDZDQUFtQixRQUFRLEtBQUssQ0FBQyxDQUFELEVBQUksQ0FBSixLQUFVO0FBQ3hDLGFBQU8sQ0FBQyxLQUFLLENBQU4sR0FBVSxDQUFWLEdBQWMsQ0FBQyxHQUFHLENBQUosR0FBUSxDQUFDLENBQVQsR0FBYSxDQUFsQztBQUNELEtBRjBCLENBQTNCOztBQUdBLHlDQUFlLE9BQWY7QUFDRDs7QUFvREQsRUFBQSxLQUFLLENBQUMsRUFBRCxFQUFLO0FBQ1IsV0FBTyxLQUFLLE1BQUwsQ0FBWSxFQUFaLENBQVA7QUFDRDs7QUFTRCxFQUFBLE9BQU8sQ0FBQyxFQUFELEVBQUs7QUFDVixJQUFBLEVBQUUsSUFBSSxDQUFOO0FBQ0EsV0FBTyxLQUFLLE1BQUwsQ0FBWSxNQUFaLEdBQXFCLEVBQXJCLEdBQTBCLEtBQUssTUFBTCxDQUFZLEtBQUssTUFBTCxDQUFZLE1BQVosR0FBcUIsQ0FBckIsR0FBeUIsRUFBckMsQ0FBMUIsR0FBcUUsU0FBNUU7QUFDRDs7QUFTRCxFQUFBLEdBQUcsR0FBRztBQUNKLFFBQUksTUFBSjs7QUFFQSxRQUFJLFNBQVMsQ0FBQyxNQUFWLElBQW9CLENBQXBCLElBQXlCLEtBQUssQ0FBQyxPQUFOLENBQWMsU0FBUyxDQUFDLENBQUQsQ0FBdkIsQ0FBN0IsRUFBMEQ7QUFDeEQsTUFBQSxNQUFNLEdBQUcsU0FBUyxDQUFDLENBQUQsQ0FBbEI7QUFDRCxLQUZELE1BRU87QUFDTCxNQUFBLE1BQU0sR0FBRyxTQUFUO0FBQ0Q7O0FBQ0QsU0FBSyxJQUFJLEdBQVQsSUFBZ0IsTUFBaEIsRUFBd0I7QUFDdEIsNkVBQW1CLE1BQU0sQ0FBQyxHQUFELENBQXpCLEVBQWdDLEtBQUssTUFBckM7QUFDRDtBQUNGOztBQVFELEVBQUEsS0FBSyxDQUFDLEVBQUQsRUFBSztBQUNSLElBQUEsRUFBRSxJQUFJLENBQU47QUFDQSxRQUFJLENBQUMsR0FBRyxLQUFLLE1BQUwsQ0FBWSxNQUFaLENBQW1CLEVBQW5CLEVBQXVCLENBQXZCLENBQVI7O0FBQ0EsUUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQUYsR0FBVyxDQUFwQixFQUF1QjtBQUNyQixhQUFPLENBQUMsQ0FBQyxDQUFELENBQVI7QUFDRDs7QUFDRCxXQUFPLFNBQVA7QUFDRDs7QUFVRCxFQUFBLFFBQVEsQ0FBQyxLQUFELEVBQVEsTUFBUixFQUFnQjtBQUN0QixXQUFPLEtBQUssTUFBTCxDQUFZLE1BQVosQ0FBbUIsS0FBbkIsRUFBMEIsTUFBTSxHQUFHLEtBQW5DLENBQVA7QUFDRDs7QUFPRCxFQUFBLE1BQU0sR0FBRztBQUNQLFdBQU8sS0FBSyxNQUFMLENBQVksTUFBbkI7QUFDRDs7QUFNRCxFQUFBLEtBQUssR0FBRztBQUNOLFNBQUssTUFBTCxHQUFjLEVBQWQ7QUFDRDs7QUFxQkQsRUFBQSxPQUFPLENBQUMsUUFBRCxFQUFXLFFBQVgsRUFBcUIsU0FBckIsRUFBZ0MsT0FBaEMsRUFBeUM7QUFDOUMsSUFBQSxRQUFRLEdBQUcsUUFBUSxHQUFHLENBQXRCO0FBQ0EsSUFBQSxTQUFTLEdBQUcsU0FBUyxJQUFJLEtBQUssTUFBTCxDQUFZLE1BQXJDOztBQUVBLFNBQUssSUFBSSxDQUFDLEdBQUcsUUFBYixFQUF1QixDQUFDLEdBQUcsU0FBM0IsRUFBc0MsQ0FBQyxFQUF2QyxFQUEyQztBQUN6QyxNQUFBLFFBQVEsQ0FBQyxJQUFULENBQWMsT0FBZCxFQUF1QixLQUFLLE1BQUwsQ0FBWSxDQUFaLENBQXZCLEVBQ0csQ0FBQyxHQUFHLFFBQUosR0FBZSxLQUFLLE1BQUwsQ0FBWSxDQUFDLEdBQUcsQ0FBaEIsQ0FBZixHQUFvQyxTQUR2QyxFQUVHLENBQUMsR0FBRyxTQUFTLEdBQUcsQ0FBaEIsR0FBb0IsS0FBSyxNQUFMLENBQVksQ0FBQyxHQUFHLENBQWhCLENBQXBCLEdBQXlDLFNBRjVDLEVBRXdELENBRnhEO0FBR0Q7QUFDRjs7QUFVRCxFQUFBLElBQUksQ0FBQyxJQUFELEVBQU8sT0FBUCxFQUFnQjtBQUNsQixVQUFNO0FBQ0osTUFBQTtBQURJLCtCQUVGLElBRkUsb0NBRUYsSUFGRSxFQUVnQixJQUZoQixFQUVzQixLQUFLLE1BRjNCLEVBRW1DLENBQUMsT0FGcEMsQ0FBTjs7QUFHQSxXQUFPLEdBQVA7QUFDRDs7QUFrQkQsRUFBQSxNQUFNLENBQUMsUUFBRCxFQUFXLE9BQVgsRUFBb0I7QUFDeEIsUUFBSSxLQUFLLEdBQUcsQ0FBWjs7QUFDQSxTQUFLLElBQUksQ0FBQyxHQUFHLENBQWIsRUFBZ0IsQ0FBQyxHQUFHLEtBQUssTUFBTCxDQUFZLE1BQWhDLEVBQXdDLENBQUMsRUFBekMsRUFBNkM7QUFDM0MsVUFBSSxRQUFRLENBQUMsSUFBVCxDQUFjLE9BQWQsRUFBdUIsS0FBSyxNQUFMLENBQVksQ0FBWixDQUF2QixFQUF1QyxDQUF2QyxDQUFKLEVBQStDO0FBQzdDLGFBQUssTUFBTCxDQUFZLEtBQVosSUFBcUIsS0FBSyxNQUFMLENBQVksQ0FBWixDQUFyQjtBQUNBLFFBQUEsS0FBSztBQUNOO0FBQ0Y7O0FBRUQsU0FBSyxNQUFMLENBQVksTUFBWixDQUFtQixLQUFuQjtBQUNEOztBQXJOMEI7Ozs7dUJBWWQsSSxFQUFNLEcsRUFBSyxLLEVBQU87QUFDN0IsTUFBSSxLQUFLLEdBQUcsQ0FBWjtBQUNBLE1BQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxNQUFKLEdBQWEsQ0FBdkI7QUFDQSxNQUFJLEtBQUssR0FBRyxDQUFaO0FBQ0EsTUFBSSxJQUFJLEdBQUcsQ0FBWDtBQUNBLE1BQUksS0FBSyxHQUFHLEtBQVo7O0FBRUEsU0FBTyxLQUFLLElBQUksR0FBaEIsRUFBcUI7QUFDbkIsSUFBQSxLQUFLLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBVCxJQUFnQixDQUFoQixHQUFvQixDQUE1QjtBQUNBLElBQUEsSUFBSSx5QkFBRyxJQUFILG9CQUFHLElBQUgsRUFBb0IsR0FBRyxDQUFDLEtBQUQsQ0FBdkIsRUFBZ0MsSUFBaEMsQ0FBSjs7QUFDQSxRQUFJLElBQUksR0FBRyxDQUFYLEVBQWM7QUFDWixNQUFBLEtBQUssR0FBRyxLQUFLLEdBQUcsQ0FBaEI7QUFDRCxLQUZELE1BRU8sSUFBSSxJQUFJLEdBQUcsQ0FBWCxFQUFjO0FBQ25CLE1BQUEsR0FBRyxHQUFHLEtBQUssR0FBRyxDQUFkO0FBQ0QsS0FGTSxNQUVBO0FBQ0wsTUFBQSxLQUFLLEdBQUcsSUFBUjtBQUNBO0FBQ0Q7QUFDRjs7QUFDRCxNQUFJLEtBQUosRUFBVztBQUNULFdBQU87QUFDTCxNQUFBLEdBQUcsRUFBRSxLQURBO0FBRUwsTUFBQSxLQUFLLEVBQUU7QUFGRixLQUFQO0FBSUQ7O0FBQ0QsTUFBSSxLQUFKLEVBQVc7QUFDVCxXQUFPO0FBQ0wsTUFBQSxHQUFHLEVBQUUsQ0FBQztBQURELEtBQVA7QUFHRDs7QUFFRCxTQUFPO0FBQ0wsSUFBQSxHQUFHLEVBQUUsSUFBSSxHQUFHLENBQVAsR0FBVyxLQUFLLEdBQUcsQ0FBbkIsR0FBdUI7QUFEdkIsR0FBUDtBQUdEOzt3QkFHYSxJLEVBQU0sRyxFQUFLO0FBQ3ZCLFFBQU0sS0FBSywwQkFBRyxJQUFILG9DQUFHLElBQUgsRUFBcUIsSUFBckIsRUFBMkIsR0FBM0IsRUFBZ0MsS0FBaEMsQ0FBWDs7QUFDQSxRQUFNLEtBQUssR0FBSSxLQUFLLENBQUMsS0FBTiwwQkFBZSxJQUFmLFVBQUQsR0FBZ0MsQ0FBaEMsR0FBb0MsQ0FBbEQ7QUFDQSxFQUFBLEdBQUcsQ0FBQyxNQUFKLENBQVcsS0FBSyxDQUFDLEdBQWpCLEVBQXNCLEtBQXRCLEVBQTZCLElBQTdCO0FBQ0EsU0FBTyxHQUFQO0FBQ0Q7OztBQ3BFSDs7Ozs7OztBQUVBOztBQUtPLE1BQU0sZ0JBQWdCLEdBQUcsR0FBekI7O0FBQ0EsTUFBTSxPQUFPLEdBQUcsb0JBQW1CLE1BQW5DOztBQUNBLE1BQU0sT0FBTyxHQUFHLGNBQWMsT0FBOUI7O0FBR0EsTUFBTSxTQUFTLEdBQUcsS0FBbEI7O0FBQ0EsTUFBTSxjQUFjLEdBQUcsS0FBdkI7O0FBQ0EsTUFBTSxRQUFRLEdBQUcsSUFBakI7O0FBQ0EsTUFBTSxTQUFTLEdBQUcsS0FBbEI7O0FBQ0EsTUFBTSxTQUFTLEdBQUcsS0FBbEI7O0FBQ0EsTUFBTSxVQUFVLEdBQUcsS0FBbkI7O0FBQ0EsTUFBTSxTQUFTLEdBQUcsTUFBbEI7O0FBQ0EsTUFBTSxTQUFTLEdBQUcsS0FBbEI7O0FBQ0EsTUFBTSxRQUFRLEdBQUcsS0FBakI7O0FBR0EsTUFBTSxXQUFXLEdBQUcsU0FBcEI7O0FBR0EsTUFBTSxtQkFBbUIsR0FBRyxDQUE1Qjs7QUFDQSxNQUFNLHFCQUFxQixHQUFHLENBQTlCOztBQUNBLE1BQU0sc0JBQXNCLEdBQUcsQ0FBL0I7O0FBQ0EsTUFBTSxxQkFBcUIsR0FBRyxDQUE5Qjs7QUFDQSxNQUFNLG1CQUFtQixHQUFHLENBQTVCOztBQUNBLE1BQU0sdUJBQXVCLEdBQUcsQ0FBaEM7O0FBQ0EsTUFBTSxtQkFBbUIsR0FBRyxDQUE1Qjs7QUFDQSxNQUFNLG9CQUFvQixHQUFHLENBQTdCOztBQUNBLE1BQU0sd0JBQXdCLEdBQUcsQ0FBakM7O0FBR0EsTUFBTSx1QkFBdUIsR0FBRyxJQUFoQzs7QUFFQSxNQUFNLHNCQUFzQixHQUFHLElBQS9COztBQUdBLE1BQU0sWUFBWSxHQUFHLEdBQXJCOztBQUdBLE1BQU0scUJBQXFCLEdBQUcsRUFBOUI7O0FBR0EsTUFBTSxRQUFRLEdBQUcsUUFBakI7Ozs7QUNoRFA7Ozs7Ozs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBSUEsSUFBSSxpQkFBSjtBQUNBLElBQUksV0FBSjtBQUdBLE1BQU0sYUFBYSxHQUFHLEdBQXRCO0FBQ0EsTUFBTSxrQkFBa0IsR0FBRyxtQkFBM0I7QUFHQSxNQUFNLFlBQVksR0FBRyxHQUFyQjtBQUNBLE1BQU0saUJBQWlCLEdBQUcsd0JBQTFCO0FBR0EsTUFBTSxVQUFVLEdBQUcsSUFBbkI7QUFDQSxNQUFNLGNBQWMsR0FBRyxFQUF2QjtBQUNBLE1BQU0sWUFBWSxHQUFHLEdBQXJCOztBQUdBLFNBQVMsV0FBVCxDQUFxQixJQUFyQixFQUEyQixRQUEzQixFQUFxQyxPQUFyQyxFQUE4QyxNQUE5QyxFQUFzRDtBQUNwRCxNQUFJLEdBQUcsR0FBRyxJQUFWOztBQUVBLE1BQUksQ0FBQyxNQUFELEVBQVMsT0FBVCxFQUFrQixJQUFsQixFQUF3QixLQUF4QixFQUErQixRQUEvQixDQUF3QyxRQUF4QyxDQUFKLEVBQXVEO0FBQ3JELElBQUEsR0FBRyxHQUFJLEdBQUUsUUFBUyxNQUFLLElBQUssRUFBNUI7O0FBQ0EsUUFBSSxHQUFHLENBQUMsTUFBSixDQUFXLEdBQUcsQ0FBQyxNQUFKLEdBQWEsQ0FBeEIsTUFBK0IsR0FBbkMsRUFBd0M7QUFDdEMsTUFBQSxHQUFHLElBQUksR0FBUDtBQUNEOztBQUNELElBQUEsR0FBRyxJQUFJLE1BQU0sT0FBTixHQUFnQixXQUF2Qjs7QUFDQSxRQUFJLENBQUMsTUFBRCxFQUFTLE9BQVQsRUFBa0IsUUFBbEIsQ0FBMkIsUUFBM0IsQ0FBSixFQUEwQztBQUd4QyxNQUFBLEdBQUcsSUFBSSxLQUFQO0FBQ0Q7O0FBQ0QsSUFBQSxHQUFHLElBQUksYUFBYSxNQUFwQjtBQUNEOztBQUNELFNBQU8sR0FBUDtBQUNEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCYyxNQUFNLFVBQU4sQ0FBaUI7QUFxQjlCLEVBQUEsV0FBVyxDQUFDLE1BQUQsRUFBUyxRQUFULEVBQW1CLGNBQW5CLEVBQW1DO0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7QUFBQTtBQUFBLGFBakJqQztBQWlCaUM7O0FBQUE7QUFBQTtBQUFBLGFBaEI3QjtBQWdCNkI7O0FBQUE7QUFBQTtBQUFBLGFBZmhDO0FBZWdDOztBQUFBO0FBQUE7QUFBQSxhQVpwQztBQVlvQzs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQSx1Q0E2WmxDLFNBN1prQzs7QUFBQSwwQ0FvYS9CLFNBcGErQjs7QUFBQSxvQ0E0YXJDLFNBNWFxQzs7QUFBQSxzREEyYm5CLFNBM2JtQjs7QUFDNUMsU0FBSyxJQUFMLEdBQVksTUFBTSxDQUFDLElBQW5CO0FBQ0EsU0FBSyxNQUFMLEdBQWMsTUFBTSxDQUFDLE1BQXJCO0FBQ0EsU0FBSyxNQUFMLEdBQWMsTUFBTSxDQUFDLE1BQXJCO0FBRUEsU0FBSyxPQUFMLEdBQWUsUUFBZjtBQUNBLFNBQUssYUFBTCxHQUFxQixjQUFyQjs7QUFFQSxRQUFJLE1BQU0sQ0FBQyxTQUFQLEtBQXFCLElBQXpCLEVBQStCO0FBRTdCOztBQUNBLFdBQUssV0FBTCxHQUFtQixJQUFuQjtBQUNELEtBSkQsTUFJTyxJQUFJLE1BQU0sQ0FBQyxTQUFQLEtBQXFCLElBQXpCLEVBQStCO0FBR3BDOztBQUNBLFdBQUssV0FBTCxHQUFtQixJQUFuQjtBQUNEOztBQUVELFFBQUksQ0FBQyxLQUFLLFdBQVYsRUFBdUI7QUFFckIsc0NBQUEsVUFBVSxFQTFDSyxVQTBDTCxPQUFWLE1BQUEsVUFBVSxFQUFNLGdHQUFOLENBQVY7O0FBQ0EsWUFBTSxJQUFJLEtBQUosQ0FBVSxnR0FBVixDQUFOO0FBQ0Q7QUFDRjs7QUFTeUIsU0FBbkIsbUJBQW1CLENBQUMsVUFBRCxFQUFhLFdBQWIsRUFBMEI7QUFDbEQsSUFBQSxpQkFBaUIsR0FBRyxVQUFwQjtBQUNBLElBQUEsV0FBVyxHQUFHLFdBQWQ7QUFDRDs7QUFRZ0IsYUFBTixNQUFNLENBQUMsQ0FBRCxFQUFJO0FBQ25CLG9DQUFBLFVBQVUsRUFsRU8sVUFrRVAsUUFBUSxDQUFSLENBQVY7QUFDRDs7QUFVRCxFQUFBLE9BQU8sQ0FBQyxLQUFELEVBQVEsS0FBUixFQUFlO0FBQ3BCLFdBQU8sT0FBTyxDQUFDLE1BQVIsQ0FBZSxJQUFmLENBQVA7QUFDRDs7QUFRRCxFQUFBLFNBQVMsQ0FBQyxLQUFELEVBQVEsQ0FBRTs7QUFNbkIsRUFBQSxVQUFVLEdBQUcsQ0FBRTs7QUFTZixFQUFBLFFBQVEsQ0FBQyxHQUFELEVBQU0sQ0FBRTs7QUFPaEIsRUFBQSxXQUFXLEdBQUc7QUFDWixXQUFPLEtBQVA7QUFDRDs7QUFPRCxFQUFBLFNBQVMsR0FBRztBQUNWLFdBQU8sS0FBSyxXQUFaO0FBQ0Q7O0FBTUQsRUFBQSxLQUFLLEdBQUc7QUFDTixTQUFLLFFBQUwsQ0FBYyxHQUFkO0FBQ0Q7O0FBTUQsRUFBQSxZQUFZLEdBQUc7QUFDYjtBQUNEOztBQXhJNkI7Ozs7MkJBMkliO0FBRWYsRUFBQSxZQUFZLHVCQUFDLElBQUQsY0FBWjs7QUFFQSxRQUFNLE9BQU8sR0FBRyxVQUFVLElBQUksSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFULHdCQUFZLElBQVosc0JBQW9DLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxNQUFMLEVBQXpELENBQUosQ0FBMUI7O0FBRUEsOENBQXVCLCtDQUF1QixjQUF2Qix5QkFBd0MsSUFBeEMsb0JBQThELDhDQUFzQixDQUEzRzs7QUFDQSxNQUFJLEtBQUssd0JBQVQsRUFBbUM7QUFDakMsU0FBSyx3QkFBTCxDQUE4QixPQUE5QjtBQUNEOztBQUVELDBDQUFrQixVQUFVLENBQUMsQ0FBQyxJQUFJO0FBQ2hDLG9DQUFBLFVBQVUsRUF2SkssVUF1SkwsT0FBVixNQUFBLFVBQVUsRUFBTyxzQkFBRCxzQkFBc0IsSUFBdEIsaUJBQTBDLGFBQVksT0FBUSxFQUFwRSxDQUFWOztBQUVBLFFBQUksdUJBQUMsSUFBRCxjQUFKLEVBQXVCO0FBQ3JCLFlBQU0sSUFBSSxHQUFHLEtBQUssT0FBTCxFQUFiOztBQUNBLFVBQUksS0FBSyx3QkFBVCxFQUFtQztBQUNqQyxhQUFLLHdCQUFMLENBQThCLENBQTlCLEVBQWlDLElBQWpDO0FBQ0QsT0FGRCxNQUVPO0FBRUwsUUFBQSxJQUFJLENBQUMsS0FBTCxDQUFXLE1BQU0sQ0FFaEIsQ0FGRDtBQUdEO0FBQ0YsS0FWRCxNQVVPLElBQUksS0FBSyx3QkFBVCxFQUFtQztBQUN4QyxXQUFLLHdCQUFMLENBQThCLENBQUMsQ0FBL0I7QUFDRDtBQUNGLEdBaEIyQixFQWdCekIsT0FoQnlCLENBQTVCO0FBaUJEOztzQkFHVztBQUNWLEVBQUEsWUFBWSx1QkFBQyxJQUFELGNBQVo7O0FBQ0EsMENBQWtCLElBQWxCO0FBQ0Q7O3VCQUdZO0FBQ1gsOENBQXNCLENBQXRCO0FBQ0Q7O3FCQUdVO0FBQ1QsUUFBTSxVQUFVLEdBQUcsQ0FBbkI7QUFDQSxRQUFNLFVBQVUsR0FBRyxDQUFuQjtBQUNBLFFBQU0sb0JBQW9CLEdBQUcsQ0FBN0I7QUFDQSxRQUFNLFdBQVcsR0FBRyxDQUFwQjtBQUNBLFFBQU0sUUFBUSxHQUFHLENBQWpCO0FBR0EsTUFBSSxNQUFNLEdBQUcsSUFBYjtBQUVBLE1BQUksT0FBTyxHQUFHLElBQWQ7QUFDQSxNQUFJLE9BQU8sR0FBRyxJQUFkOztBQUVBLE1BQUksU0FBUyxHQUFJLElBQUQsSUFBVTtBQUN4QixVQUFNLE1BQU0sR0FBRyxJQUFJLFdBQUosRUFBZjs7QUFDQSxJQUFBLE1BQU0sQ0FBQyxrQkFBUCxHQUE2QixHQUFELElBQVM7QUFDbkMsVUFBSSxNQUFNLENBQUMsVUFBUCxJQUFxQixRQUFyQixJQUFpQyxNQUFNLENBQUMsTUFBUCxJQUFpQixHQUF0RCxFQUEyRDtBQUV6RCxjQUFNLElBQUksS0FBSixDQUFXLHFCQUFvQixNQUFNLENBQUMsTUFBTyxFQUE3QyxDQUFOO0FBQ0Q7QUFDRixLQUxEOztBQU9BLElBQUEsTUFBTSxDQUFDLElBQVAsQ0FBWSxNQUFaLEVBQW9CLElBQXBCLEVBQTBCLElBQTFCO0FBQ0EsV0FBTyxNQUFQO0FBQ0QsR0FYRDs7QUFhQSxNQUFJLFNBQVMsR0FBRyxDQUFDLElBQUQsRUFBTyxPQUFQLEVBQWdCLE1BQWhCLEtBQTJCO0FBQ3pDLFFBQUksTUFBTSxHQUFHLElBQUksV0FBSixFQUFiO0FBQ0EsUUFBSSxnQkFBZ0IsR0FBRyxLQUF2Qjs7QUFFQSxJQUFBLE1BQU0sQ0FBQyxrQkFBUCxHQUE2QixHQUFELElBQVM7QUFDbkMsVUFBSSxNQUFNLENBQUMsVUFBUCxJQUFxQixRQUF6QixFQUFtQztBQUNqQyxZQUFJLE1BQU0sQ0FBQyxNQUFQLElBQWlCLEdBQXJCLEVBQTBCO0FBQ3hCLGNBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFMLENBQVcsTUFBTSxDQUFDLFlBQWxCLEVBQWdDLHNCQUFoQyxDQUFWO0FBQ0EsVUFBQSxNQUFNLEdBQUcsSUFBSSxHQUFHLE9BQVAsR0FBaUIsR0FBRyxDQUFDLElBQUosQ0FBUyxNQUFULENBQWdCLEdBQTFDO0FBQ0EsVUFBQSxNQUFNLEdBQUcsU0FBUyxDQUFDLE1BQUQsQ0FBbEI7QUFDQSxVQUFBLE1BQU0sQ0FBQyxJQUFQLENBQVksSUFBWjs7QUFDQSxjQUFJLEtBQUssTUFBVCxFQUFpQjtBQUNmLGlCQUFLLE1BQUw7QUFDRDs7QUFFRCxjQUFJLE9BQUosRUFBYTtBQUNYLFlBQUEsZ0JBQWdCLEdBQUcsSUFBbkI7QUFDQSxZQUFBLE9BQU87QUFDUjs7QUFFRCxjQUFJLEtBQUssYUFBVCxFQUF3QjtBQUN0QjtBQUNEO0FBQ0YsU0FqQkQsTUFpQk8sSUFBSSxNQUFNLENBQUMsTUFBUCxHQUFnQixHQUFwQixFQUF5QjtBQUM5QixjQUFJLEtBQUssU0FBVCxFQUFvQjtBQUNsQixpQkFBSyxTQUFMLENBQWUsTUFBTSxDQUFDLFlBQXRCO0FBQ0Q7O0FBQ0QsVUFBQSxNQUFNLEdBQUcsU0FBUyxDQUFDLE1BQUQsQ0FBbEI7QUFDQSxVQUFBLE1BQU0sQ0FBQyxJQUFQLENBQVksSUFBWjtBQUNELFNBTk0sTUFNQTtBQUVMLGNBQUksTUFBTSxJQUFJLENBQUMsZ0JBQWYsRUFBaUM7QUFDL0IsWUFBQSxnQkFBZ0IsR0FBRyxJQUFuQjtBQUNBLFlBQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFSLENBQU47QUFDRDs7QUFDRCxjQUFJLEtBQUssU0FBTCxJQUFrQixNQUFNLENBQUMsWUFBN0IsRUFBMkM7QUFDekMsaUJBQUssU0FBTCxDQUFlLE1BQU0sQ0FBQyxZQUF0QjtBQUNEOztBQUNELGNBQUksS0FBSyxZQUFULEVBQXVCO0FBQ3JCLGtCQUFNLElBQUksR0FBRyxNQUFNLENBQUMsTUFBUCxLQUFrQiwyQ0FBbUIsWUFBbkIsR0FBa0MsYUFBcEQsQ0FBYjtBQUNBLGtCQUFNLElBQUksR0FBRyxNQUFNLENBQUMsWUFBUCxLQUF3QiwyQ0FBbUIsaUJBQW5CLEdBQXVDLGtCQUEvRCxDQUFiO0FBQ0EsaUJBQUssWUFBTCxDQUFrQixJQUFJLEtBQUosQ0FBVSxJQUFJLEdBQUcsSUFBUCxHQUFjLElBQWQsR0FBcUIsR0FBL0IsQ0FBbEIsRUFBdUQsSUFBdkQ7QUFDRDs7QUFHRCxVQUFBLE1BQU0sR0FBRyxJQUFUOztBQUNBLGNBQUksdUJBQUMsSUFBRCxrQkFBcUIsS0FBSyxhQUE5QixFQUE2QztBQUMzQztBQUNEO0FBQ0Y7QUFDRjtBQUNGLEtBL0NEOztBQWlEQSxJQUFBLE1BQU0sQ0FBQyxJQUFQLENBQVksTUFBWixFQUFvQixJQUFwQixFQUEwQixJQUExQjtBQUNBLFdBQU8sTUFBUDtBQUNELEdBdkREOztBQXlEQSxPQUFLLE9BQUwsR0FBZSxDQUFDLEtBQUQsRUFBUSxLQUFSLEtBQWtCO0FBQy9CLDZDQUFtQixLQUFuQjs7QUFFQSxRQUFJLE9BQUosRUFBYTtBQUNYLFVBQUksQ0FBQyxLQUFMLEVBQVk7QUFDVixlQUFPLE9BQU8sQ0FBQyxPQUFSLEVBQVA7QUFDRDs7QUFDRCxNQUFBLE9BQU8sQ0FBQyxrQkFBUixHQUE2QixTQUE3Qjs7QUFDQSxNQUFBLE9BQU8sQ0FBQyxLQUFSOztBQUNBLE1BQUEsT0FBTyxHQUFHLElBQVY7QUFDRDs7QUFFRCxRQUFJLEtBQUosRUFBVztBQUNULFdBQUssSUFBTCxHQUFZLEtBQVo7QUFDRDs7QUFFRCxXQUFPLElBQUksT0FBSixDQUFZLENBQUMsT0FBRCxFQUFVLE1BQVYsS0FBcUI7QUFDdEMsWUFBTSxHQUFHLEdBQUcsV0FBVyxDQUFDLEtBQUssSUFBTixFQUFZLEtBQUssTUFBTCxHQUFjLE9BQWQsR0FBd0IsTUFBcEMsRUFBNEMsS0FBSyxPQUFqRCxFQUEwRCxLQUFLLE1BQS9ELENBQXZCOztBQUNBLHNDQUFBLFVBQVUsRUExUkcsVUEwUkgsT0FBVixNQUFBLFVBQVUsRUFBTSxtQkFBTixFQUEyQixHQUEzQixDQUFWOztBQUNBLE1BQUEsT0FBTyxHQUFHLFNBQVMsQ0FBQyxHQUFELEVBQU0sT0FBTixFQUFlLE1BQWYsQ0FBbkI7O0FBQ0EsTUFBQSxPQUFPLENBQUMsSUFBUixDQUFhLElBQWI7QUFDRCxLQUxNLEVBS0osS0FMSSxDQUtHLEdBQUQsSUFBUztBQUNoQixzQ0FBQSxVQUFVLEVBOVJHLFVBOFJILE9BQVYsTUFBQSxVQUFVLEVBQU0sdUJBQU4sRUFBK0IsR0FBL0IsQ0FBVjtBQUNELEtBUE0sQ0FBUDtBQVFELEdBeEJEOztBQTBCQSxPQUFLLFNBQUwsR0FBa0IsS0FBRCxJQUFXO0FBQzFCOztBQUNBLFNBQUssT0FBTCxDQUFhLElBQWIsRUFBbUIsS0FBbkI7QUFDRCxHQUhEOztBQUtBLE9BQUssVUFBTCxHQUFrQixNQUFNO0FBQ3RCLDZDQUFtQixJQUFuQjs7QUFDQTs7QUFFQSxRQUFJLE9BQUosRUFBYTtBQUNYLE1BQUEsT0FBTyxDQUFDLGtCQUFSLEdBQTZCLFNBQTdCOztBQUNBLE1BQUEsT0FBTyxDQUFDLEtBQVI7O0FBQ0EsTUFBQSxPQUFPLEdBQUcsSUFBVjtBQUNEOztBQUNELFFBQUksT0FBSixFQUFhO0FBQ1gsTUFBQSxPQUFPLENBQUMsa0JBQVIsR0FBNkIsU0FBN0I7O0FBQ0EsTUFBQSxPQUFPLENBQUMsS0FBUjs7QUFDQSxNQUFBLE9BQU8sR0FBRyxJQUFWO0FBQ0Q7O0FBRUQsUUFBSSxLQUFLLFlBQVQsRUFBdUI7QUFDckIsV0FBSyxZQUFMLENBQWtCLElBQUksS0FBSixDQUFVLGlCQUFpQixHQUFHLElBQXBCLEdBQTJCLFlBQTNCLEdBQTBDLEdBQXBELENBQWxCLEVBQTRFLFlBQTVFO0FBQ0Q7O0FBRUQsSUFBQSxNQUFNLEdBQUcsSUFBVDtBQUNELEdBcEJEOztBQXNCQSxPQUFLLFFBQUwsR0FBaUIsR0FBRCxJQUFTO0FBQ3ZCLElBQUEsT0FBTyxHQUFHLFNBQVMsQ0FBQyxNQUFELENBQW5COztBQUNBLFFBQUksT0FBTyxJQUFLLE9BQU8sQ0FBQyxVQUFSLElBQXNCLFVBQXRDLEVBQW1EO0FBQ2pELE1BQUEsT0FBTyxDQUFDLElBQVIsQ0FBYSxHQUFiO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsWUFBTSxJQUFJLEtBQUosQ0FBVSwrQkFBVixDQUFOO0FBQ0Q7QUFDRixHQVBEOztBQVNBLE9BQUssV0FBTCxHQUFtQixNQUFNO0FBQ3ZCLFdBQVEsT0FBTyxJQUFJLElBQW5CO0FBQ0QsR0FGRDtBQUdEOztxQkFHVTtBQUNULE9BQUssT0FBTCxHQUFlLENBQUMsS0FBRCxFQUFRLEtBQVIsS0FBa0I7QUFDL0IsNkNBQW1CLEtBQW5COztBQUVBLDhCQUFJLElBQUosWUFBa0I7QUFDaEIsVUFBSSxDQUFDLEtBQUQsSUFBVSxxQ0FBYSxVQUFiLElBQTJCLHFDQUFhLElBQXRELEVBQTREO0FBQzFELGVBQU8sT0FBTyxDQUFDLE9BQVIsRUFBUDtBQUNEOztBQUNELDJDQUFhLEtBQWI7O0FBQ0EsMkNBQWUsSUFBZjtBQUNEOztBQUVELFFBQUksS0FBSixFQUFXO0FBQ1QsV0FBSyxJQUFMLEdBQVksS0FBWjtBQUNEOztBQUVELFdBQU8sSUFBSSxPQUFKLENBQVksQ0FBQyxPQUFELEVBQVUsTUFBVixLQUFxQjtBQUN0QyxZQUFNLEdBQUcsR0FBRyxXQUFXLENBQUMsS0FBSyxJQUFOLEVBQVksS0FBSyxNQUFMLEdBQWMsS0FBZCxHQUFzQixJQUFsQyxFQUF3QyxLQUFLLE9BQTdDLEVBQXNELEtBQUssTUFBM0QsQ0FBdkI7O0FBRUEsc0NBQUEsVUFBVSxFQS9WRyxVQStWSCxPQUFWLE1BQUEsVUFBVSxFQUFNLG9CQUFOLEVBQTRCLEdBQTVCLENBQVY7O0FBSUEsWUFBTSxJQUFJLEdBQUcsSUFBSSxpQkFBSixDQUFzQixHQUF0QixDQUFiOztBQUVBLE1BQUEsSUFBSSxDQUFDLE9BQUwsR0FBZ0IsR0FBRCxJQUFTO0FBQ3RCLFFBQUEsTUFBTSxDQUFDLEdBQUQsQ0FBTjtBQUNELE9BRkQ7O0FBSUEsTUFBQSxJQUFJLENBQUMsTUFBTCxHQUFlLEdBQUQsSUFBUztBQUNyQixZQUFJLEtBQUssYUFBVCxFQUF3QjtBQUN0QjtBQUNEOztBQUVELFlBQUksS0FBSyxNQUFULEVBQWlCO0FBQ2YsZUFBSyxNQUFMO0FBQ0Q7O0FBRUQsUUFBQSxPQUFPO0FBQ1IsT0FWRDs7QUFZQSxNQUFBLElBQUksQ0FBQyxPQUFMLEdBQWdCLEdBQUQsSUFBUztBQUN0Qiw2Q0FBZSxJQUFmOztBQUVBLFlBQUksS0FBSyxZQUFULEVBQXVCO0FBQ3JCLGdCQUFNLElBQUksR0FBRywyQ0FBbUIsWUFBbkIsR0FBa0MsYUFBL0M7QUFDQSxlQUFLLFlBQUwsQ0FBa0IsSUFBSSxLQUFKLENBQVUsMkNBQW1CLGlCQUFuQixHQUF1QyxrQkFBa0IsR0FDbkYsSUFEaUUsR0FDMUQsSUFEMEQsR0FDbkQsR0FERSxDQUFsQixFQUNzQixJQUR0QjtBQUVEOztBQUVELFlBQUksdUJBQUMsSUFBRCxrQkFBcUIsS0FBSyxhQUE5QixFQUE2QztBQUMzQztBQUNEO0FBQ0YsT0FaRDs7QUFjQSxNQUFBLElBQUksQ0FBQyxTQUFMLEdBQWtCLEdBQUQsSUFBUztBQUN4QixZQUFJLEtBQUssU0FBVCxFQUFvQjtBQUNsQixlQUFLLFNBQUwsQ0FBZSxHQUFHLENBQUMsSUFBbkI7QUFDRDtBQUNGLE9BSkQ7O0FBTUEsMkNBQWUsSUFBZjtBQUNELEtBOUNNLENBQVA7QUErQ0QsR0E5REQ7O0FBZ0VBLE9BQUssU0FBTCxHQUFrQixLQUFELElBQVc7QUFDMUI7O0FBQ0EsU0FBSyxPQUFMLENBQWEsSUFBYixFQUFtQixLQUFuQjtBQUNELEdBSEQ7O0FBS0EsT0FBSyxVQUFMLEdBQWtCLE1BQU07QUFDdEIsNkNBQW1CLElBQW5COztBQUNBOztBQUVBLFFBQUksdUJBQUMsSUFBRCxVQUFKLEVBQW1CO0FBQ2pCO0FBQ0Q7O0FBQ0QseUNBQWEsS0FBYjs7QUFDQSx5Q0FBZSxJQUFmO0FBQ0QsR0FURDs7QUFXQSxPQUFLLFFBQUwsR0FBaUIsR0FBRCxJQUFTO0FBQ3ZCLFFBQUksd0NBQWlCLHFDQUFhLFVBQWIsSUFBMkIscUNBQWEsSUFBN0QsRUFBb0U7QUFDbEUsMkNBQWEsSUFBYixDQUFrQixHQUFsQjtBQUNELEtBRkQsTUFFTztBQUNMLFlBQU0sSUFBSSxLQUFKLENBQVUsNEJBQVYsQ0FBTjtBQUNEO0FBQ0YsR0FORDs7QUFRQSxPQUFLLFdBQUwsR0FBbUIsTUFBTTtBQUN2QixXQUFRLHdDQUFpQixxQ0FBYSxVQUFiLElBQTJCLHFDQUFhLElBQWpFO0FBQ0QsR0FGRDtBQUdEOzs7O1NBdGFhLENBQUMsSUFBSSxDQUFFOztBQWlkdkIsVUFBVSxDQUFDLGFBQVgsR0FBMkIsYUFBM0I7QUFDQSxVQUFVLENBQUMsa0JBQVgsR0FBZ0Msa0JBQWhDO0FBQ0EsVUFBVSxDQUFDLFlBQVgsR0FBMEIsWUFBMUI7QUFDQSxVQUFVLENBQUMsaUJBQVgsR0FBK0IsaUJBQS9COzs7QUMvZ0JBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU1BLE1BQU0sVUFBVSxHQUFHLENBQW5CO0FBQ0EsTUFBTSxPQUFPLEdBQUcsWUFBaEI7QUFFQSxJQUFJLFdBQUo7Ozs7Ozs7O0FBRWUsTUFBTSxFQUFOLENBQVM7QUFTdEIsRUFBQSxXQUFXLENBQUMsT0FBRCxFQUFVLE1BQVYsRUFBa0I7QUFBQTs7QUFBQTtBQUFBO0FBQUEsYUFSbEIsQ0FBQyxJQUFJLENBQUU7QUFRVzs7QUFBQTtBQUFBO0FBQUEsYUFQbkIsQ0FBQyxJQUFJLENBQUU7QUFPWTs7QUFBQSxnQ0FKeEIsSUFJd0I7O0FBQUEsc0NBRmxCLEtBRWtCOztBQUMzQiwwQ0FBZ0IsT0FBTywwQkFBSSxJQUFKLFdBQXZCOztBQUNBLHlDQUFlLE1BQU0sMEJBQUksSUFBSixVQUFyQjtBQUNEOztBQThCRCxFQUFBLFlBQVksR0FBRztBQUNiLFdBQU8sSUFBSSxPQUFKLENBQVksQ0FBQyxPQUFELEVBQVUsTUFBVixLQUFxQjtBQUV0QyxZQUFNLEdBQUcsR0FBRyxXQUFXLENBQUMsSUFBWixDQUFpQixPQUFqQixFQUEwQixVQUExQixDQUFaOztBQUNBLE1BQUEsR0FBRyxDQUFDLFNBQUosR0FBaUIsS0FBRCxJQUFXO0FBQ3pCLGFBQUssRUFBTCxHQUFVLEtBQUssQ0FBQyxNQUFOLENBQWEsTUFBdkI7QUFDQSxhQUFLLFFBQUwsR0FBZ0IsS0FBaEI7QUFDQSxRQUFBLE9BQU8sQ0FBQyxLQUFLLEVBQU4sQ0FBUDtBQUNELE9BSkQ7O0FBS0EsTUFBQSxHQUFHLENBQUMsT0FBSixHQUFlLEtBQUQsSUFBVztBQUN2Qix3REFBYSxRQUFiLEVBQXVCLHNCQUF2QixFQUErQyxLQUEvQzs7QUFDQSxRQUFBLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTixDQUFhLEtBQWQsQ0FBTjs7QUFDQSx5REFBYyxLQUFLLENBQUMsTUFBTixDQUFhLEtBQTNCO0FBQ0QsT0FKRDs7QUFLQSxNQUFBLEdBQUcsQ0FBQyxlQUFKLEdBQXNCLFVBQVMsS0FBVCxFQUFnQjtBQUNwQyxhQUFLLEVBQUwsR0FBVSxLQUFLLENBQUMsTUFBTixDQUFhLE1BQXZCOztBQUVBLGFBQUssRUFBTCxDQUFRLE9BQVIsR0FBa0IsVUFBUyxLQUFULEVBQWdCO0FBQ2hDLDBEQUFhLFFBQWIsRUFBdUIsMEJBQXZCLEVBQW1ELEtBQW5EOztBQUNBLDJEQUFjLEtBQUssQ0FBQyxNQUFOLENBQWEsS0FBM0I7QUFDRCxTQUhEOztBQU9BLGFBQUssRUFBTCxDQUFRLGlCQUFSLENBQTBCLE9BQTFCLEVBQW1DO0FBQ2pDLFVBQUEsT0FBTyxFQUFFO0FBRHdCLFNBQW5DO0FBS0EsYUFBSyxFQUFMLENBQVEsaUJBQVIsQ0FBMEIsTUFBMUIsRUFBa0M7QUFDaEMsVUFBQSxPQUFPLEVBQUU7QUFEdUIsU0FBbEM7QUFLQSxhQUFLLEVBQUwsQ0FBUSxpQkFBUixDQUEwQixjQUExQixFQUEwQztBQUN4QyxVQUFBLE9BQU8sRUFBRSxDQUFDLE9BQUQsRUFBVSxLQUFWO0FBRCtCLFNBQTFDO0FBS0EsYUFBSyxFQUFMLENBQVEsaUJBQVIsQ0FBMEIsU0FBMUIsRUFBcUM7QUFDbkMsVUFBQSxPQUFPLEVBQUUsQ0FBQyxPQUFELEVBQVUsS0FBVjtBQUQwQixTQUFyQztBQUdELE9BNUJEO0FBNkJELEtBMUNNLENBQVA7QUEyQ0Q7O0FBS0QsRUFBQSxjQUFjLEdBQUc7QUFFZixRQUFJLEtBQUssRUFBVCxFQUFhO0FBQ1gsV0FBSyxFQUFMLENBQVEsS0FBUjtBQUNBLFdBQUssRUFBTCxHQUFVLElBQVY7QUFDRDs7QUFDRCxXQUFPLElBQUksT0FBSixDQUFZLENBQUMsT0FBRCxFQUFVLE1BQVYsS0FBcUI7QUFDdEMsWUFBTSxHQUFHLEdBQUcsV0FBVyxDQUFDLGNBQVosQ0FBMkIsT0FBM0IsQ0FBWjs7QUFDQSxNQUFBLEdBQUcsQ0FBQyxTQUFKLEdBQWdCLFVBQVMsS0FBVCxFQUFnQjtBQUM5QixZQUFJLEtBQUssRUFBVCxFQUFhO0FBQ1gsZUFBSyxFQUFMLENBQVEsS0FBUjtBQUNEOztBQUNELGNBQU0sR0FBRyxHQUFHLElBQUksS0FBSixDQUFVLFNBQVYsQ0FBWjs7QUFDQSx3REFBYSxRQUFiLEVBQXVCLGdCQUF2QixFQUF5QyxHQUF6Qzs7QUFDQSxRQUFBLE1BQU0sQ0FBQyxHQUFELENBQU47QUFDRCxPQVBEOztBQVFBLE1BQUEsR0FBRyxDQUFDLFNBQUosR0FBaUIsS0FBRCxJQUFXO0FBQ3pCLGFBQUssRUFBTCxHQUFVLElBQVY7QUFDQSxhQUFLLFFBQUwsR0FBZ0IsSUFBaEI7QUFDQSxRQUFBLE9BQU8sQ0FBQyxJQUFELENBQVA7QUFDRCxPQUpEOztBQUtBLE1BQUEsR0FBRyxDQUFDLE9BQUosR0FBZSxLQUFELElBQVc7QUFDdkIsd0RBQWEsUUFBYixFQUF1QixnQkFBdkIsRUFBeUMsS0FBSyxDQUFDLE1BQU4sQ0FBYSxLQUF0RDs7QUFDQSxRQUFBLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTixDQUFhLEtBQWQsQ0FBTjtBQUNELE9BSEQ7QUFJRCxLQW5CTSxDQUFQO0FBb0JEOztBQU9ELEVBQUEsT0FBTyxHQUFHO0FBQ1IsV0FBTyxDQUFDLENBQUMsS0FBSyxFQUFkO0FBQ0Q7O0FBVUQsRUFBQSxRQUFRLENBQUMsS0FBRCxFQUFRO0FBQ2QsUUFBSSxDQUFDLEtBQUssT0FBTCxFQUFMLEVBQXFCO0FBQ25CLGFBQU8sS0FBSyxRQUFMLEdBQ0wsT0FBTyxDQUFDLE9BQVIsRUFESyxHQUVMLE9BQU8sQ0FBQyxNQUFSLENBQWUsSUFBSSxLQUFKLENBQVUsaUJBQVYsQ0FBZixDQUZGO0FBR0Q7O0FBQ0QsV0FBTyxJQUFJLE9BQUosQ0FBWSxDQUFDLE9BQUQsRUFBVSxNQUFWLEtBQXFCO0FBQ3RDLFlBQU0sR0FBRyxHQUFHLEtBQUssRUFBTCxDQUFRLFdBQVIsQ0FBb0IsQ0FBQyxPQUFELENBQXBCLEVBQStCLFdBQS9CLENBQVo7O0FBQ0EsTUFBQSxHQUFHLENBQUMsVUFBSixHQUFrQixLQUFELElBQVc7QUFDMUIsUUFBQSxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU4sQ0FBYSxNQUFkLENBQVA7QUFDRCxPQUZEOztBQUdBLE1BQUEsR0FBRyxDQUFDLE9BQUosR0FBZSxLQUFELElBQVc7QUFDdkIsd0RBQWEsUUFBYixFQUF1QixVQUF2QixFQUFtQyxLQUFLLENBQUMsTUFBTixDQUFhLEtBQWhEOztBQUNBLFFBQUEsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFOLENBQWEsS0FBZCxDQUFOO0FBQ0QsT0FIRDs7QUFJQSxZQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsV0FBSixDQUFnQixPQUFoQixFQUF5QixHQUF6QixDQUE2QixLQUFLLENBQUMsSUFBbkMsQ0FBWjs7QUFDQSxNQUFBLEdBQUcsQ0FBQyxTQUFKLEdBQWlCLEtBQUQsSUFBVztBQUN6QixRQUFBLEdBQUcsQ0FBQyxXQUFKLENBQWdCLE9BQWhCLEVBQXlCLEdBQXpCLDhCQUE2QixFQUE3QixFQXpKYSxFQXlKYix3QkFBNkIsRUFBN0IsRUFBZ0QsR0FBRyxDQUFDLE1BQXBELEVBQTRELEtBQTVEO0FBQ0EsUUFBQSxHQUFHLENBQUMsTUFBSjtBQUNELE9BSEQ7QUFJRCxLQWRNLENBQVA7QUFlRDs7QUFRRCxFQUFBLGtCQUFrQixDQUFDLElBQUQsRUFBTztBQUN2QixRQUFJLENBQUMsS0FBSyxPQUFMLEVBQUwsRUFBcUI7QUFDbkIsYUFBTyxLQUFLLFFBQUwsR0FDTCxPQUFPLENBQUMsT0FBUixFQURLLEdBRUwsT0FBTyxDQUFDLE1BQVIsQ0FBZSxJQUFJLEtBQUosQ0FBVSxpQkFBVixDQUFmLENBRkY7QUFHRDs7QUFDRCxXQUFPLElBQUksT0FBSixDQUFZLENBQUMsT0FBRCxFQUFVLE1BQVYsS0FBcUI7QUFDdEMsWUFBTSxHQUFHLEdBQUcsS0FBSyxFQUFMLENBQVEsV0FBUixDQUFvQixDQUFDLE9BQUQsQ0FBcEIsRUFBK0IsV0FBL0IsQ0FBWjs7QUFDQSxNQUFBLEdBQUcsQ0FBQyxVQUFKLEdBQWtCLEtBQUQsSUFBVztBQUMxQixRQUFBLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTixDQUFhLE1BQWQsQ0FBUDtBQUNELE9BRkQ7O0FBR0EsTUFBQSxHQUFHLENBQUMsT0FBSixHQUFlLEtBQUQsSUFBVztBQUN2Qix3REFBYSxRQUFiLEVBQXVCLG9CQUF2QixFQUE2QyxLQUFLLENBQUMsTUFBTixDQUFhLEtBQTFEOztBQUNBLFFBQUEsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFOLENBQWEsS0FBZCxDQUFOO0FBQ0QsT0FIRDs7QUFJQSxZQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsV0FBSixDQUFnQixPQUFoQixFQUF5QixHQUF6QixDQUE2QixJQUE3QixDQUFaOztBQUNBLE1BQUEsR0FBRyxDQUFDLFNBQUosR0FBaUIsS0FBRCxJQUFXO0FBQ3pCLGNBQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFOLENBQWEsTUFBM0I7QUFDQSxRQUFBLEtBQUssQ0FBQyxRQUFOLEdBQWlCLElBQWpCO0FBQ0EsUUFBQSxHQUFHLENBQUMsV0FBSixDQUFnQixPQUFoQixFQUF5QixHQUF6QixDQUE2QixLQUE3QjtBQUNBLFFBQUEsR0FBRyxDQUFDLE1BQUo7QUFDRCxPQUxEO0FBTUQsS0FoQk0sQ0FBUDtBQWlCRDs7QUFRRCxFQUFBLFFBQVEsQ0FBQyxJQUFELEVBQU87QUFDYixRQUFJLENBQUMsS0FBSyxPQUFMLEVBQUwsRUFBcUI7QUFDbkIsYUFBTyxLQUFLLFFBQUwsR0FDTCxPQUFPLENBQUMsT0FBUixFQURLLEdBRUwsT0FBTyxDQUFDLE1BQVIsQ0FBZSxJQUFJLEtBQUosQ0FBVSxpQkFBVixDQUFmLENBRkY7QUFHRDs7QUFDRCxXQUFPLElBQUksT0FBSixDQUFZLENBQUMsT0FBRCxFQUFVLE1BQVYsS0FBcUI7QUFDdEMsWUFBTSxHQUFHLEdBQUcsS0FBSyxFQUFMLENBQVEsV0FBUixDQUFvQixDQUFDLE9BQUQsRUFBVSxjQUFWLEVBQTBCLFNBQTFCLENBQXBCLEVBQTBELFdBQTFELENBQVo7O0FBQ0EsTUFBQSxHQUFHLENBQUMsVUFBSixHQUFrQixLQUFELElBQVc7QUFDMUIsUUFBQSxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU4sQ0FBYSxNQUFkLENBQVA7QUFDRCxPQUZEOztBQUdBLE1BQUEsR0FBRyxDQUFDLE9BQUosR0FBZSxLQUFELElBQVc7QUFDdkIsd0RBQWEsUUFBYixFQUF1QixVQUF2QixFQUFtQyxLQUFLLENBQUMsTUFBTixDQUFhLEtBQWhEOztBQUNBLFFBQUEsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFOLENBQWEsS0FBZCxDQUFOO0FBQ0QsT0FIRDs7QUFJQSxNQUFBLEdBQUcsQ0FBQyxXQUFKLENBQWdCLE9BQWhCLEVBQXlCLE1BQXpCLENBQWdDLFdBQVcsQ0FBQyxJQUFaLENBQWlCLElBQWpCLENBQWhDO0FBQ0EsTUFBQSxHQUFHLENBQUMsV0FBSixDQUFnQixjQUFoQixFQUFnQyxNQUFoQyxDQUF1QyxXQUFXLENBQUMsS0FBWixDQUFrQixDQUFDLElBQUQsRUFBTyxHQUFQLENBQWxCLEVBQStCLENBQUMsSUFBRCxFQUFPLEdBQVAsQ0FBL0IsQ0FBdkM7QUFDQSxNQUFBLEdBQUcsQ0FBQyxXQUFKLENBQWdCLFNBQWhCLEVBQTJCLE1BQTNCLENBQWtDLFdBQVcsQ0FBQyxLQUFaLENBQWtCLENBQUMsSUFBRCxFQUFPLENBQVAsQ0FBbEIsRUFBNkIsQ0FBQyxJQUFELEVBQU8sTUFBTSxDQUFDLGdCQUFkLENBQTdCLENBQWxDO0FBQ0EsTUFBQSxHQUFHLENBQUMsTUFBSjtBQUNELEtBYk0sQ0FBUDtBQWNEOztBQVNELEVBQUEsU0FBUyxDQUFDLFFBQUQsRUFBVyxPQUFYLEVBQW9CO0FBQzNCLGtDQUFPLElBQVAsa0NBQU8sSUFBUCxFQUF3QixPQUF4QixFQUFpQyxRQUFqQyxFQUEyQyxPQUEzQztBQUNEOztBQVFELEVBQUEsZ0JBQWdCLENBQUMsS0FBRCxFQUFRLEdBQVIsRUFBYTtBQUMzQixpQ0FBQSxFQUFFLEVBNU9lLEVBNE9mLG9CQUFGLE1BQUEsRUFBRSxFQUFtQixLQUFuQixFQUEwQixHQUExQixDQUFGO0FBQ0Q7O0FBVUQsRUFBQSxPQUFPLENBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVztBQUNoQixRQUFJLFNBQVMsQ0FBQyxNQUFWLEdBQW1CLENBQW5CLElBQXdCLEdBQUcsS0FBSyxTQUFwQyxFQUErQztBQUU3QztBQUNEOztBQUNELFFBQUksQ0FBQyxLQUFLLE9BQUwsRUFBTCxFQUFxQjtBQUNuQixhQUFPLEtBQUssUUFBTCxHQUNMLE9BQU8sQ0FBQyxPQUFSLEVBREssR0FFTCxPQUFPLENBQUMsTUFBUixDQUFlLElBQUksS0FBSixDQUFVLGlCQUFWLENBQWYsQ0FGRjtBQUdEOztBQUNELFdBQU8sSUFBSSxPQUFKLENBQVksQ0FBQyxPQUFELEVBQVUsTUFBVixLQUFxQjtBQUN0QyxZQUFNLEdBQUcsR0FBRyxLQUFLLEVBQUwsQ0FBUSxXQUFSLENBQW9CLENBQUMsTUFBRCxDQUFwQixFQUE4QixXQUE5QixDQUFaOztBQUNBLE1BQUEsR0FBRyxDQUFDLFVBQUosR0FBa0IsS0FBRCxJQUFXO0FBQzFCLFFBQUEsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFOLENBQWEsTUFBZCxDQUFQO0FBQ0QsT0FGRDs7QUFHQSxNQUFBLEdBQUcsQ0FBQyxPQUFKLEdBQWUsS0FBRCxJQUFXO0FBQ3ZCLHdEQUFhLFFBQWIsRUFBdUIsU0FBdkIsRUFBa0MsS0FBSyxDQUFDLE1BQU4sQ0FBYSxLQUEvQzs7QUFDQSxRQUFBLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTixDQUFhLEtBQWQsQ0FBTjtBQUNELE9BSEQ7O0FBSUEsTUFBQSxHQUFHLENBQUMsV0FBSixDQUFnQixNQUFoQixFQUF3QixHQUF4QixDQUE0QjtBQUMxQixRQUFBLEdBQUcsRUFBRSxHQURxQjtBQUUxQixRQUFBLE1BQU0sRUFBRTtBQUZrQixPQUE1QjtBQUlBLE1BQUEsR0FBRyxDQUFDLE1BQUo7QUFDRCxLQWRNLENBQVA7QUFlRDs7QUFRRCxFQUFBLE9BQU8sQ0FBQyxHQUFELEVBQU07QUFDWCxRQUFJLENBQUMsS0FBSyxPQUFMLEVBQUwsRUFBcUI7QUFDbkIsYUFBTyxLQUFLLFFBQUwsR0FDTCxPQUFPLENBQUMsT0FBUixFQURLLEdBRUwsT0FBTyxDQUFDLE1BQVIsQ0FBZSxJQUFJLEtBQUosQ0FBVSxpQkFBVixDQUFmLENBRkY7QUFHRDs7QUFDRCxXQUFPLElBQUksT0FBSixDQUFZLENBQUMsT0FBRCxFQUFVLE1BQVYsS0FBcUI7QUFDdEMsWUFBTSxHQUFHLEdBQUcsS0FBSyxFQUFMLENBQVEsV0FBUixDQUFvQixDQUFDLE1BQUQsQ0FBcEIsRUFBOEIsV0FBOUIsQ0FBWjs7QUFDQSxNQUFBLEdBQUcsQ0FBQyxVQUFKLEdBQWtCLEtBQUQsSUFBVztBQUMxQixRQUFBLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTixDQUFhLE1BQWQsQ0FBUDtBQUNELE9BRkQ7O0FBR0EsTUFBQSxHQUFHLENBQUMsT0FBSixHQUFlLEtBQUQsSUFBVztBQUN2Qix3REFBYSxRQUFiLEVBQXVCLFNBQXZCLEVBQWtDLEtBQUssQ0FBQyxNQUFOLENBQWEsS0FBL0M7O0FBQ0EsUUFBQSxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU4sQ0FBYSxLQUFkLENBQU47QUFDRCxPQUhEOztBQUlBLE1BQUEsR0FBRyxDQUFDLFdBQUosQ0FBZ0IsTUFBaEIsRUFBd0IsTUFBeEIsQ0FBK0IsV0FBVyxDQUFDLElBQVosQ0FBaUIsR0FBakIsQ0FBL0I7QUFDQSxNQUFBLEdBQUcsQ0FBQyxNQUFKO0FBQ0QsS0FYTSxDQUFQO0FBWUQ7O0FBU0QsRUFBQSxRQUFRLENBQUMsUUFBRCxFQUFXLE9BQVgsRUFBb0I7QUFDMUIsa0NBQU8sSUFBUCxrQ0FBTyxJQUFQLEVBQXdCLE1BQXhCLEVBQWdDLFFBQWhDLEVBQTBDLE9BQTFDO0FBQ0Q7O0FBUUQsRUFBQSxPQUFPLENBQUMsR0FBRCxFQUFNO0FBQ1gsUUFBSSxDQUFDLEtBQUssT0FBTCxFQUFMLEVBQXFCO0FBQ25CLGFBQU8sS0FBSyxRQUFMLEdBQ0wsT0FBTyxDQUFDLE9BQVIsRUFESyxHQUVMLE9BQU8sQ0FBQyxNQUFSLENBQWUsSUFBSSxLQUFKLENBQVUsaUJBQVYsQ0FBZixDQUZGO0FBR0Q7O0FBQ0QsV0FBTyxJQUFJLE9BQUosQ0FBWSxDQUFDLE9BQUQsRUFBVSxNQUFWLEtBQXFCO0FBQ3RDLFlBQU0sR0FBRyxHQUFHLEtBQUssRUFBTCxDQUFRLFdBQVIsQ0FBb0IsQ0FBQyxNQUFELENBQXBCLENBQVo7O0FBQ0EsTUFBQSxHQUFHLENBQUMsVUFBSixHQUFrQixLQUFELElBQVc7QUFDMUIsY0FBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLE1BQU4sQ0FBYSxNQUExQjtBQUNBLFFBQUEsT0FBTyxDQUFDO0FBQ04sVUFBQSxJQUFJLEVBQUUsSUFBSSxDQUFDLEdBREw7QUFFTixVQUFBLE1BQU0sRUFBRSxJQUFJLENBQUM7QUFGUCxTQUFELENBQVA7QUFJRCxPQU5EOztBQU9BLE1BQUEsR0FBRyxDQUFDLE9BQUosR0FBZSxLQUFELElBQVc7QUFDdkIsd0RBQWEsUUFBYixFQUF1QixTQUF2QixFQUFrQyxLQUFLLENBQUMsTUFBTixDQUFhLEtBQS9DOztBQUNBLFFBQUEsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFOLENBQWEsS0FBZCxDQUFOO0FBQ0QsT0FIRDs7QUFJQSxNQUFBLEdBQUcsQ0FBQyxXQUFKLENBQWdCLE1BQWhCLEVBQXdCLEdBQXhCLENBQTRCLEdBQTVCO0FBQ0QsS0FkTSxDQUFQO0FBZUQ7O0FBV0QsRUFBQSxlQUFlLENBQUMsU0FBRCxFQUFZLEdBQVosRUFBaUIsR0FBakIsRUFBc0I7QUFDbkMsUUFBSSxDQUFDLEtBQUssT0FBTCxFQUFMLEVBQXFCO0FBQ25CLGFBQU8sS0FBSyxRQUFMLEdBQ0wsT0FBTyxDQUFDLE9BQVIsRUFESyxHQUVMLE9BQU8sQ0FBQyxNQUFSLENBQWUsSUFBSSxLQUFKLENBQVUsaUJBQVYsQ0FBZixDQUZGO0FBR0Q7O0FBQ0QsV0FBTyxJQUFJLE9BQUosQ0FBWSxDQUFDLE9BQUQsRUFBVSxNQUFWLEtBQXFCO0FBQ3RDLFlBQU0sR0FBRyxHQUFHLEtBQUssRUFBTCxDQUFRLFdBQVIsQ0FBb0IsQ0FBQyxjQUFELENBQXBCLEVBQXNDLFdBQXRDLENBQVo7O0FBQ0EsTUFBQSxHQUFHLENBQUMsVUFBSixHQUFrQixLQUFELElBQVc7QUFDMUIsUUFBQSxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU4sQ0FBYSxNQUFkLENBQVA7QUFDRCxPQUZEOztBQUdBLE1BQUEsR0FBRyxDQUFDLE9BQUosR0FBZSxLQUFELElBQVc7QUFDdkIsd0RBQWEsUUFBYixFQUF1QixpQkFBdkIsRUFBMEMsS0FBSyxDQUFDLE1BQU4sQ0FBYSxLQUF2RDs7QUFDQSxRQUFBLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTixDQUFhLEtBQWQsQ0FBTjtBQUNELE9BSEQ7O0FBSUEsTUFBQSxHQUFHLENBQUMsV0FBSixDQUFnQixjQUFoQixFQUFnQyxHQUFoQyxDQUFvQyxDQUFDLFNBQUQsRUFBWSxHQUFaLENBQXBDLEVBQXNELFNBQXRELEdBQW1FLEtBQUQsSUFBVztBQUMzRSxRQUFBLEdBQUcsQ0FBQyxXQUFKLENBQWdCLGNBQWhCLEVBQWdDLEdBQWhDLDhCQUFvQyxFQUFwQyxFQTdXYSxFQTZXYiwrQkFBb0MsRUFBcEMsRUFBOEQsS0FBSyxDQUFDLE1BQU4sQ0FBYSxNQUEzRSxFQUFtRixTQUFuRixFQUE4RixHQUE5RixFQUFtRyxHQUFuRztBQUNBLFFBQUEsR0FBRyxDQUFDLE1BQUo7QUFDRCxPQUhEO0FBSUQsS0FiTSxDQUFQO0FBY0Q7O0FBVUQsRUFBQSxnQkFBZ0IsQ0FBQyxTQUFELEVBQVksUUFBWixFQUFzQixPQUF0QixFQUErQjtBQUM3QyxRQUFJLENBQUMsS0FBSyxPQUFMLEVBQUwsRUFBcUI7QUFDbkIsYUFBTyxLQUFLLFFBQUwsR0FDTCxPQUFPLENBQUMsT0FBUixDQUFnQixFQUFoQixDQURLLEdBRUwsT0FBTyxDQUFDLE1BQVIsQ0FBZSxJQUFJLEtBQUosQ0FBVSxpQkFBVixDQUFmLENBRkY7QUFHRDs7QUFDRCxXQUFPLElBQUksT0FBSixDQUFZLENBQUMsT0FBRCxFQUFVLE1BQVYsS0FBcUI7QUFDdEMsWUFBTSxHQUFHLEdBQUcsS0FBSyxFQUFMLENBQVEsV0FBUixDQUFvQixDQUFDLGNBQUQsQ0FBcEIsQ0FBWjs7QUFDQSxNQUFBLEdBQUcsQ0FBQyxPQUFKLEdBQWUsS0FBRCxJQUFXO0FBQ3ZCLHdEQUFhLFFBQWIsRUFBdUIsa0JBQXZCLEVBQTJDLEtBQUssQ0FBQyxNQUFOLENBQWEsS0FBeEQ7O0FBQ0EsUUFBQSxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU4sQ0FBYSxLQUFkLENBQU47QUFDRCxPQUhEOztBQUlBLE1BQUEsR0FBRyxDQUFDLFdBQUosQ0FBZ0IsY0FBaEIsRUFBZ0MsTUFBaEMsQ0FBdUMsV0FBVyxDQUFDLEtBQVosQ0FBa0IsQ0FBQyxTQUFELEVBQVksR0FBWixDQUFsQixFQUFvQyxDQUFDLFNBQUQsRUFBWSxHQUFaLENBQXBDLENBQXZDLEVBQThGLFNBQTlGLEdBQTJHLEtBQUQsSUFBVztBQUNuSCxZQUFJLFFBQUosRUFBYztBQUNaLFVBQUEsS0FBSyxDQUFDLE1BQU4sQ0FBYSxNQUFiLENBQW9CLE9BQXBCLENBQTZCLEtBQUQsSUFBVztBQUNyQyxZQUFBLFFBQVEsQ0FBQyxJQUFULENBQWMsT0FBZCxFQUF1QixLQUF2QjtBQUNELFdBRkQ7QUFHRDs7QUFDRCxRQUFBLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTixDQUFhLE1BQWQsQ0FBUDtBQUNELE9BUEQ7QUFRRCxLQWRNLENBQVA7QUFlRDs7QUFXRCxFQUFBLFVBQVUsQ0FBQyxHQUFELEVBQU07QUFDZCxRQUFJLENBQUMsS0FBSyxPQUFMLEVBQUwsRUFBcUI7QUFDbkIsYUFBTyxLQUFLLFFBQUwsR0FDTCxPQUFPLENBQUMsT0FBUixFQURLLEdBRUwsT0FBTyxDQUFDLE1BQVIsQ0FBZSxJQUFJLEtBQUosQ0FBVSxpQkFBVixDQUFmLENBRkY7QUFHRDs7QUFDRCxXQUFPLElBQUksT0FBSixDQUFZLENBQUMsT0FBRCxFQUFVLE1BQVYsS0FBcUI7QUFDdEMsWUFBTSxHQUFHLEdBQUcsS0FBSyxFQUFMLENBQVEsV0FBUixDQUFvQixDQUFDLFNBQUQsQ0FBcEIsRUFBaUMsV0FBakMsQ0FBWjs7QUFDQSxNQUFBLEdBQUcsQ0FBQyxTQUFKLEdBQWlCLEtBQUQsSUFBVztBQUN6QixRQUFBLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTixDQUFhLE1BQWQsQ0FBUDtBQUNELE9BRkQ7O0FBR0EsTUFBQSxHQUFHLENBQUMsT0FBSixHQUFlLEtBQUQsSUFBVztBQUN2Qix3REFBYSxRQUFiLEVBQXVCLFlBQXZCLEVBQXFDLEtBQUssQ0FBQyxNQUFOLENBQWEsS0FBbEQ7O0FBQ0EsUUFBQSxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU4sQ0FBYSxLQUFkLENBQU47QUFDRCxPQUhEOztBQUlBLE1BQUEsR0FBRyxDQUFDLFdBQUosQ0FBZ0IsU0FBaEIsRUFBMkIsR0FBM0IsOEJBQStCLEVBQS9CLEVBMWFlLEVBMGFmLDBCQUErQixFQUEvQixFQUFvRCxJQUFwRCxFQUEwRCxHQUExRDtBQUNBLE1BQUEsR0FBRyxDQUFDLE1BQUo7QUFDRCxLQVhNLENBQVA7QUFZRDs7QUFVRCxFQUFBLGdCQUFnQixDQUFDLFNBQUQsRUFBWSxHQUFaLEVBQWlCLE1BQWpCLEVBQXlCO0FBQ3ZDLFFBQUksQ0FBQyxLQUFLLE9BQUwsRUFBTCxFQUFxQjtBQUNuQixhQUFPLEtBQUssUUFBTCxHQUNMLE9BQU8sQ0FBQyxPQUFSLEVBREssR0FFTCxPQUFPLENBQUMsTUFBUixDQUFlLElBQUksS0FBSixDQUFVLGlCQUFWLENBQWYsQ0FGRjtBQUdEOztBQUNELFdBQU8sSUFBSSxPQUFKLENBQVksQ0FBQyxPQUFELEVBQVUsTUFBVixLQUFxQjtBQUN0QyxZQUFNLEdBQUcsR0FBRyxLQUFLLEVBQUwsQ0FBUSxXQUFSLENBQW9CLENBQUMsU0FBRCxDQUFwQixFQUFpQyxXQUFqQyxDQUFaOztBQUNBLE1BQUEsR0FBRyxDQUFDLFNBQUosR0FBaUIsS0FBRCxJQUFXO0FBQ3pCLFFBQUEsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFOLENBQWEsTUFBZCxDQUFQO0FBQ0QsT0FGRDs7QUFHQSxNQUFBLEdBQUcsQ0FBQyxPQUFKLEdBQWUsS0FBRCxJQUFXO0FBQ3ZCLHdEQUFhLFFBQWIsRUFBdUIsa0JBQXZCLEVBQTJDLEtBQUssQ0FBQyxNQUFOLENBQWEsS0FBeEQ7O0FBQ0EsUUFBQSxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU4sQ0FBYSxLQUFkLENBQU47QUFDRCxPQUhEOztBQUlBLFlBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxXQUFKLENBQWdCLFNBQWhCLEVBQTJCLEdBQTNCLENBQStCLFdBQVcsQ0FBQyxJQUFaLENBQWlCLENBQUMsU0FBRCxFQUFZLEdBQVosQ0FBakIsQ0FBL0IsQ0FBWjs7QUFDQSxNQUFBLEdBQUcsQ0FBQyxTQUFKLEdBQWlCLEtBQUQsSUFBVztBQUN6QixjQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsTUFBSixJQUFjLEtBQUssQ0FBQyxNQUFOLENBQWEsTUFBdkM7O0FBQ0EsWUFBSSxDQUFDLEdBQUQsSUFBUSxHQUFHLENBQUMsT0FBSixJQUFlLE1BQTNCLEVBQW1DO0FBQ2pDLFVBQUEsR0FBRyxDQUFDLE1BQUo7QUFDQTtBQUNEOztBQUNELFFBQUEsR0FBRyxDQUFDLFdBQUosQ0FBZ0IsU0FBaEIsRUFBMkIsR0FBM0IsOEJBQStCLEVBQS9CLEVBN2NhLEVBNmNiLDBCQUErQixFQUEvQixFQUFvRCxHQUFwRCxFQUF5RDtBQUN2RCxVQUFBLEtBQUssRUFBRSxTQURnRDtBQUV2RCxVQUFBLEdBQUcsRUFBRSxHQUZrRDtBQUd2RCxVQUFBLE9BQU8sRUFBRTtBQUg4QyxTQUF6RDtBQUtBLFFBQUEsR0FBRyxDQUFDLE1BQUo7QUFDRCxPQVpEO0FBYUQsS0F2Qk0sQ0FBUDtBQXdCRDs7QUFVRCxFQUFBLFdBQVcsQ0FBQyxTQUFELEVBQVksSUFBWixFQUFrQixFQUFsQixFQUFzQjtBQUMvQixRQUFJLENBQUMsS0FBSyxPQUFMLEVBQUwsRUFBcUI7QUFDbkIsYUFBTyxLQUFLLFFBQUwsR0FDTCxPQUFPLENBQUMsT0FBUixFQURLLEdBRUwsT0FBTyxDQUFDLE1BQVIsQ0FBZSxJQUFJLEtBQUosQ0FBVSxpQkFBVixDQUFmLENBRkY7QUFHRDs7QUFDRCxXQUFPLElBQUksT0FBSixDQUFZLENBQUMsT0FBRCxFQUFVLE1BQVYsS0FBcUI7QUFDdEMsVUFBSSxDQUFDLElBQUQsSUFBUyxDQUFDLEVBQWQsRUFBa0I7QUFDaEIsUUFBQSxJQUFJLEdBQUcsQ0FBUDtBQUNBLFFBQUEsRUFBRSxHQUFHLE1BQU0sQ0FBQyxnQkFBWjtBQUNEOztBQUNELFlBQU0sS0FBSyxHQUFHLEVBQUUsR0FBRyxDQUFMLEdBQVMsV0FBVyxDQUFDLEtBQVosQ0FBa0IsQ0FBQyxTQUFELEVBQVksSUFBWixDQUFsQixFQUFxQyxDQUFDLFNBQUQsRUFBWSxFQUFaLENBQXJDLEVBQXNELEtBQXRELEVBQTZELElBQTdELENBQVQsR0FDWixXQUFXLENBQUMsSUFBWixDQUFpQixDQUFDLFNBQUQsRUFBWSxJQUFaLENBQWpCLENBREY7QUFFQSxZQUFNLEdBQUcsR0FBRyxLQUFLLEVBQUwsQ0FBUSxXQUFSLENBQW9CLENBQUMsU0FBRCxDQUFwQixFQUFpQyxXQUFqQyxDQUFaOztBQUNBLE1BQUEsR0FBRyxDQUFDLFNBQUosR0FBaUIsS0FBRCxJQUFXO0FBQ3pCLFFBQUEsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFOLENBQWEsTUFBZCxDQUFQO0FBQ0QsT0FGRDs7QUFHQSxNQUFBLEdBQUcsQ0FBQyxPQUFKLEdBQWUsS0FBRCxJQUFXO0FBQ3ZCLHdEQUFhLFFBQWIsRUFBdUIsYUFBdkIsRUFBc0MsS0FBSyxDQUFDLE1BQU4sQ0FBYSxLQUFuRDs7QUFDQSxRQUFBLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTixDQUFhLEtBQWQsQ0FBTjtBQUNELE9BSEQ7O0FBSUEsTUFBQSxHQUFHLENBQUMsV0FBSixDQUFnQixTQUFoQixFQUEyQixNQUEzQixDQUFrQyxLQUFsQztBQUNBLE1BQUEsR0FBRyxDQUFDLE1BQUo7QUFDRCxLQWpCTSxDQUFQO0FBa0JEOztBQWFELEVBQUEsWUFBWSxDQUFDLFNBQUQsRUFBWSxLQUFaLEVBQW1CLFFBQW5CLEVBQTZCLE9BQTdCLEVBQXNDO0FBQ2hELFFBQUksQ0FBQyxLQUFLLE9BQUwsRUFBTCxFQUFxQjtBQUNuQixhQUFPLEtBQUssUUFBTCxHQUNMLE9BQU8sQ0FBQyxPQUFSLENBQWdCLEVBQWhCLENBREssR0FFTCxPQUFPLENBQUMsTUFBUixDQUFlLElBQUksS0FBSixDQUFVLGlCQUFWLENBQWYsQ0FGRjtBQUdEOztBQUNELFdBQU8sSUFBSSxPQUFKLENBQVksQ0FBQyxPQUFELEVBQVUsTUFBVixLQUFxQjtBQUN0QyxNQUFBLEtBQUssR0FBRyxLQUFLLElBQUksRUFBakI7QUFDQSxZQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBTixHQUFjLENBQWQsR0FBa0IsS0FBSyxDQUFDLEtBQXhCLEdBQWdDLENBQTlDO0FBQ0EsWUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU4sR0FBZSxDQUFmLEdBQW1CLEtBQUssQ0FBQyxNQUF6QixHQUFrQyxNQUFNLENBQUMsZ0JBQXhEO0FBQ0EsWUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQU4sR0FBYyxDQUE1QjtBQUVBLFlBQU0sTUFBTSxHQUFHLEVBQWY7QUFDQSxZQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsS0FBWixDQUFrQixDQUFDLFNBQUQsRUFBWSxLQUFaLENBQWxCLEVBQXNDLENBQUMsU0FBRCxFQUFZLE1BQVosQ0FBdEMsRUFBMkQsS0FBM0QsRUFBa0UsSUFBbEUsQ0FBZDtBQUNBLFlBQU0sR0FBRyxHQUFHLEtBQUssRUFBTCxDQUFRLFdBQVIsQ0FBb0IsQ0FBQyxTQUFELENBQXBCLENBQVo7O0FBQ0EsTUFBQSxHQUFHLENBQUMsT0FBSixHQUFlLEtBQUQsSUFBVztBQUN2Qix3REFBYSxRQUFiLEVBQXVCLGNBQXZCLEVBQXVDLEtBQUssQ0FBQyxNQUFOLENBQWEsS0FBcEQ7O0FBQ0EsUUFBQSxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU4sQ0FBYSxLQUFkLENBQU47QUFDRCxPQUhEOztBQUtBLE1BQUEsR0FBRyxDQUFDLFdBQUosQ0FBZ0IsU0FBaEIsRUFBMkIsVUFBM0IsQ0FBc0MsS0FBdEMsRUFBNkMsTUFBN0MsRUFBcUQsU0FBckQsR0FBa0UsS0FBRCxJQUFXO0FBQzFFLGNBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFOLENBQWEsTUFBNUI7O0FBQ0EsWUFBSSxNQUFKLEVBQVk7QUFDVixjQUFJLFFBQUosRUFBYztBQUNaLFlBQUEsUUFBUSxDQUFDLElBQVQsQ0FBYyxPQUFkLEVBQXVCLE1BQU0sQ0FBQyxLQUE5QjtBQUNEOztBQUNELFVBQUEsTUFBTSxDQUFDLElBQVAsQ0FBWSxNQUFNLENBQUMsS0FBbkI7O0FBQ0EsY0FBSSxLQUFLLElBQUksQ0FBVCxJQUFjLE1BQU0sQ0FBQyxNQUFQLEdBQWdCLEtBQWxDLEVBQXlDO0FBQ3ZDLFlBQUEsTUFBTSxDQUFDLFFBQVA7QUFDRCxXQUZELE1BRU87QUFDTCxZQUFBLE9BQU8sQ0FBQyxNQUFELENBQVA7QUFDRDtBQUNGLFNBVkQsTUFVTztBQUNMLFVBQUEsT0FBTyxDQUFDLE1BQUQsQ0FBUDtBQUNEO0FBQ0YsT0FmRDtBQWdCRCxLQTlCTSxDQUFQO0FBK0JEOztBQWdGeUIsU0FBbkIsbUJBQW1CLENBQUMsV0FBRCxFQUFjO0FBQ3RDLElBQUEsV0FBVyxHQUFHLFdBQWQ7QUFDRDs7QUEzbkJxQjs7OztzQkFjVixNLEVBQVEsUSxFQUFVLE8sRUFBUztBQUNyQyxNQUFJLENBQUMsS0FBSyxFQUFWLEVBQWM7QUFDWixXQUFPLFFBQVEsR0FDYixPQUFPLENBQUMsT0FBUixDQUFnQixFQUFoQixDQURhLEdBRWIsT0FBTyxDQUFDLE1BQVIsQ0FBZSxJQUFJLEtBQUosQ0FBVSxpQkFBVixDQUFmLENBRkY7QUFHRDs7QUFFRCxTQUFPLElBQUksT0FBSixDQUFZLENBQUMsT0FBRCxFQUFVLE1BQVYsS0FBcUI7QUFDdEMsVUFBTSxHQUFHLEdBQUcsS0FBSyxFQUFMLENBQVEsV0FBUixDQUFvQixDQUFDLE1BQUQsQ0FBcEIsQ0FBWjs7QUFDQSxJQUFBLEdBQUcsQ0FBQyxPQUFKLEdBQWUsS0FBRCxJQUFXO0FBQ3ZCLHNEQUFhLFFBQWIsRUFBdUIsWUFBdkIsRUFBcUMsTUFBckMsRUFBNkMsS0FBSyxDQUFDLE1BQU4sQ0FBYSxLQUExRDs7QUFDQSxNQUFBLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTixDQUFhLEtBQWQsQ0FBTjtBQUNELEtBSEQ7O0FBSUEsSUFBQSxHQUFHLENBQUMsV0FBSixDQUFnQixNQUFoQixFQUF3QixNQUF4QixHQUFpQyxTQUFqQyxHQUE4QyxLQUFELElBQVc7QUFDdEQsVUFBSSxRQUFKLEVBQWM7QUFDWixRQUFBLEtBQUssQ0FBQyxNQUFOLENBQWEsTUFBYixDQUFvQixPQUFwQixDQUE2QixLQUFELElBQVc7QUFDckMsVUFBQSxRQUFRLENBQUMsSUFBVCxDQUFjLE9BQWQsRUFBdUIsS0FBdkI7QUFDRCxTQUZEO0FBR0Q7O0FBQ0QsTUFBQSxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU4sQ0FBYSxNQUFkLENBQVA7QUFDRCxLQVBEO0FBUUQsR0FkTSxDQUFQO0FBZUQ7OzJCQStnQndCLEssRUFBTyxHLEVBQUs7QUFDbkMsa0NBQUEsRUFBRSxFQXBqQmUsRUFvakJmLGdCQUFGLENBQWlCLE9BQWpCLENBQTBCLENBQUQsSUFBTztBQUM5QixRQUFJLEdBQUcsQ0FBQyxjQUFKLENBQW1CLENBQW5CLENBQUosRUFBMkI7QUFDekIsTUFBQSxLQUFLLENBQUMsQ0FBRCxDQUFMLEdBQVcsR0FBRyxDQUFDLENBQUQsQ0FBZDtBQUNEO0FBQ0YsR0FKRDs7QUFLQSxNQUFJLEtBQUssQ0FBQyxPQUFOLENBQWMsR0FBRyxDQUFDLElBQWxCLENBQUosRUFBNkI7QUFDM0IsSUFBQSxLQUFLLENBQUMsS0FBTixHQUFjLEdBQUcsQ0FBQyxJQUFsQjtBQUNEOztBQUNELE1BQUksR0FBRyxDQUFDLEdBQVIsRUFBYTtBQUNYLElBQUEsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsR0FBRyxDQUFDLEdBQXhCO0FBQ0Q7O0FBQ0QsRUFBQSxLQUFLLENBQUMsR0FBTixJQUFhLENBQWI7QUFDQSxFQUFBLEtBQUssQ0FBQyxJQUFOLElBQWMsQ0FBZDtBQUNBLEVBQUEsS0FBSyxDQUFDLE1BQU4sR0FBZSxJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsRUFBWSxLQUFLLENBQUMsR0FBTixHQUFZLEtBQUssQ0FBQyxJQUE5QixDQUFmO0FBQ0Q7O3lCQUdzQixHLEVBQUssRyxFQUFLO0FBQy9CLFFBQU0sR0FBRyxHQUFHLEdBQUcsSUFBSTtBQUNqQixJQUFBLElBQUksRUFBRSxHQUFHLENBQUM7QUFETyxHQUFuQjs7QUFHQSxrQ0FBQSxFQUFFLEVBemtCZSxFQXlrQmYsZ0JBQUYsQ0FBaUIsT0FBakIsQ0FBMEIsQ0FBRCxJQUFPO0FBQzlCLFFBQUksR0FBRyxDQUFDLGNBQUosQ0FBbUIsQ0FBbkIsQ0FBSixFQUEyQjtBQUN6QixNQUFBLEdBQUcsQ0FBQyxDQUFELENBQUgsR0FBUyxHQUFHLENBQUMsQ0FBRCxDQUFaO0FBQ0Q7QUFDRixHQUpEOztBQUtBLE1BQUksS0FBSyxDQUFDLE9BQU4sQ0FBYyxHQUFHLENBQUMsS0FBbEIsQ0FBSixFQUE4QjtBQUM1QixJQUFBLEdBQUcsQ0FBQyxJQUFKLEdBQVcsR0FBRyxDQUFDLEtBQWY7QUFDRDs7QUFDRCxNQUFJLEdBQUcsQ0FBQyxHQUFSLEVBQWE7QUFDWCxJQUFBLEdBQUcsQ0FBQyxHQUFKLEdBQVUsR0FBRyxDQUFDLGFBQUosR0FBb0IsVUFBcEIsRUFBVjtBQUNEOztBQUNELFNBQU8sR0FBUDtBQUNEOztnQ0FFNkIsRyxFQUFLLFMsRUFBVyxHLEVBQUssRyxFQUFLO0FBQ3RELFFBQU0sTUFBTSxHQUFHLENBQUMsU0FBRCxFQUFZLE1BQVosRUFBb0IsTUFBcEIsRUFBNEIsTUFBNUIsRUFBb0MsT0FBcEMsRUFBNkMsVUFBN0MsRUFBeUQsV0FBekQsQ0FBZjtBQUNBLFFBQU0sR0FBRyxHQUFHLEdBQUcsSUFBSTtBQUNqQixJQUFBLEtBQUssRUFBRSxTQURVO0FBRWpCLElBQUEsR0FBRyxFQUFFO0FBRlksR0FBbkI7QUFLQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLENBQWdCLENBQUQsSUFBTztBQUNwQixRQUFJLEdBQUcsQ0FBQyxjQUFKLENBQW1CLENBQW5CLENBQUosRUFBMkI7QUFDekIsTUFBQSxHQUFHLENBQUMsQ0FBRCxDQUFILEdBQVMsR0FBRyxDQUFDLENBQUQsQ0FBWjtBQUNEO0FBQ0YsR0FKRDtBQU1BLFNBQU8sR0FBUDtBQUNEOzsyQkFFd0IsRyxFQUFLLEcsRUFBSztBQUVqQyxRQUFNLE1BQU0sR0FBRyxDQUFDLE9BQUQsRUFBVSxLQUFWLEVBQWlCLElBQWpCLEVBQXVCLFNBQXZCLEVBQWtDLE1BQWxDLEVBQTBDLE1BQTFDLEVBQWtELFNBQWxELENBQWY7QUFDQSxRQUFNLEdBQUcsR0FBRyxHQUFHLElBQUksRUFBbkI7QUFDQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLENBQWdCLENBQUQsSUFBTztBQUNwQixRQUFJLEdBQUcsQ0FBQyxjQUFKLENBQW1CLENBQW5CLENBQUosRUFBMkI7QUFDekIsTUFBQSxHQUFHLENBQUMsQ0FBRCxDQUFILEdBQVMsR0FBRyxDQUFDLENBQUQsQ0FBWjtBQUNEO0FBQ0YsR0FKRDtBQUtBLFNBQU8sR0FBUDtBQUNEOzs7O1NBbkVzQixDQUFDLFNBQUQsRUFBWSxTQUFaLEVBQXVCLFNBQXZCLEVBQWtDLE1BQWxDLEVBQTBDLE1BQTFDLEVBQWtELEtBQWxELEVBQXlELE9BQXpELEVBQWtFLFFBQWxFLEVBQ3JCLE9BRHFCLEVBQ1osUUFEWSxFQUNGLFNBREUsRUFDUyxTQURULEVBQ29CLFNBRHBCLEVBQytCLFVBRC9COzs7O0FDOWpCekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOztBQU1BLE1BQU0saUJBQWlCLEdBQUcsQ0FBMUI7QUFDQSxNQUFNLHVCQUF1QixHQUFHLENBQWhDO0FBQ0EsTUFBTSxxQkFBcUIsR0FBRyxFQUE5QjtBQUNBLE1BQU0sY0FBYyxHQUFHLGtCQUF2QjtBQUNBLE1BQU0sZ0JBQWdCLEdBQUcsZUFBekI7QUFDQSxNQUFNLGtCQUFrQixHQUFHLENBQUMsS0FBRCxFQUFRLFFBQVIsRUFBa0IsVUFBbEIsRUFBOEIsVUFBOUIsRUFBMEMsTUFBMUMsRUFBa0QsTUFBbEQsRUFBMEQsU0FBMUQsRUFDekIsS0FEeUIsRUFDbEIsTUFEa0IsRUFDVixPQURVLEVBQ0QsS0FEQyxFQUNNLEtBRE4sRUFDYSxPQURiLENBQTNCO0FBTUEsTUFBTSxhQUFhLEdBQUcsQ0FFcEI7QUFDRSxFQUFBLElBQUksRUFBRSxJQURSO0FBRUUsRUFBQSxLQUFLLEVBQUUsdUJBRlQ7QUFHRSxFQUFBLEdBQUcsRUFBRTtBQUhQLENBRm9CLEVBUXBCO0FBQ0UsRUFBQSxJQUFJLEVBQUUsSUFEUjtBQUVFLEVBQUEsS0FBSyxFQUFFLG1CQUZUO0FBR0UsRUFBQSxHQUFHLEVBQUU7QUFIUCxDQVJvQixFQWNwQjtBQUNFLEVBQUEsSUFBSSxFQUFFLElBRFI7QUFFRSxFQUFBLEtBQUssRUFBRSxzQkFGVDtBQUdFLEVBQUEsR0FBRyxFQUFFO0FBSFAsQ0Fkb0IsRUFvQnBCO0FBQ0UsRUFBQSxJQUFJLEVBQUUsSUFEUjtBQUVFLEVBQUEsS0FBSyxFQUFFLGlCQUZUO0FBR0UsRUFBQSxHQUFHLEVBQUU7QUFIUCxDQXBCb0IsQ0FBdEI7QUE0QkEsTUFBTSxVQUFVLEdBQUcsQ0FBQyxJQUFELENBQW5CO0FBR0EsTUFBTSxZQUFZLEdBQUcsQ0FFbkI7QUFDRSxFQUFBLElBQUksRUFBRSxJQURSO0FBRUUsRUFBQSxRQUFRLEVBQUUsS0FGWjtBQUdFLEVBQUEsSUFBSSxFQUFFLFVBQVMsR0FBVCxFQUFjO0FBRWxCLFFBQUksQ0FBQyxnQkFBZ0IsSUFBaEIsQ0FBcUIsR0FBckIsQ0FBTCxFQUFnQztBQUM5QixNQUFBLEdBQUcsR0FBRyxZQUFZLEdBQWxCO0FBQ0Q7O0FBQ0QsV0FBTztBQUNMLE1BQUEsR0FBRyxFQUFFO0FBREEsS0FBUDtBQUdELEdBWEg7QUFZRSxFQUFBLEVBQUUsRUFBRTtBQVpOLENBRm1CLEVBaUJuQjtBQUNFLEVBQUEsSUFBSSxFQUFFLElBRFI7QUFFRSxFQUFBLFFBQVEsRUFBRSxLQUZaO0FBR0UsRUFBQSxJQUFJLEVBQUUsVUFBUyxHQUFULEVBQWM7QUFDbEIsV0FBTztBQUNMLE1BQUEsR0FBRyxFQUFFLEdBQUcsQ0FBQyxLQUFKLENBQVUsQ0FBVjtBQURBLEtBQVA7QUFHRCxHQVBIO0FBUUUsRUFBQSxFQUFFLEVBQUU7QUFSTixDQWpCbUIsRUE0Qm5CO0FBQ0UsRUFBQSxJQUFJLEVBQUUsSUFEUjtBQUVFLEVBQUEsUUFBUSxFQUFFLEtBRlo7QUFHRSxFQUFBLElBQUksRUFBRSxVQUFTLEdBQVQsRUFBYztBQUNsQixXQUFPO0FBQ0wsTUFBQSxHQUFHLEVBQUUsR0FBRyxDQUFDLEtBQUosQ0FBVSxDQUFWO0FBREEsS0FBUDtBQUdELEdBUEg7QUFRRSxFQUFBLEVBQUUsRUFBRTtBQVJOLENBNUJtQixDQUFyQjtBQXlDQSxNQUFNLFNBQVMsR0FBRztBQUNoQixFQUFBLEVBQUUsRUFBRTtBQUNGLElBQUEsSUFBSSxFQUFFLE9BREo7QUFFRixJQUFBLE1BQU0sRUFBRTtBQUZOLEdBRFk7QUFLaEIsRUFBQSxFQUFFLEVBQUU7QUFDRixJQUFBLElBQUksRUFBRSxRQURKO0FBRUYsSUFBQSxNQUFNLEVBQUU7QUFGTixHQUxZO0FBU2hCLEVBQUEsRUFBRSxFQUFFO0FBQ0YsSUFBQSxJQUFJLEVBQUUsSUFESjtBQUVGLElBQUEsTUFBTSxFQUFFO0FBRk4sR0FUWTtBQWFoQixFQUFBLEVBQUUsRUFBRTtBQUNGLElBQUEsSUFBSSxFQUFFLElBREo7QUFFRixJQUFBLE1BQU0sRUFBRTtBQUZOLEdBYlk7QUFpQmhCLEVBQUEsRUFBRSxFQUFFO0FBQ0YsSUFBQSxJQUFJLEVBQUUsS0FESjtBQUVGLElBQUEsTUFBTSxFQUFFO0FBRk4sR0FqQlk7QUFxQmhCLEVBQUEsRUFBRSxFQUFFO0FBQ0YsSUFBQSxJQUFJLEVBQUUsR0FESjtBQUVGLElBQUEsTUFBTSxFQUFFO0FBRk4sR0FyQlk7QUF5QmhCLEVBQUEsRUFBRSxFQUFFO0FBQ0YsSUFBQSxJQUFJLEVBQUUsRUFESjtBQUVGLElBQUEsTUFBTSxFQUFFO0FBRk4sR0F6Qlk7QUE2QmhCLEVBQUEsRUFBRSxFQUFFO0FBQ0YsSUFBQSxJQUFJLEVBQUUsS0FESjtBQUVGLElBQUEsTUFBTSxFQUFFO0FBRk4sR0E3Qlk7QUFpQ2hCLEVBQUEsRUFBRSxFQUFFO0FBQ0YsSUFBQSxJQUFJLEVBQUUsRUFESjtBQUVGLElBQUEsTUFBTSxFQUFFO0FBRk4sR0FqQ1k7QUFxQ2hCLEVBQUEsRUFBRSxFQUFFO0FBQ0YsSUFBQSxJQUFJLEVBQUUsTUFESjtBQUVGLElBQUEsTUFBTSxFQUFFO0FBRk4sR0FyQ1k7QUF5Q2hCLEVBQUEsRUFBRSxFQUFFO0FBQ0YsSUFBQSxJQUFJLEVBQUUsR0FESjtBQUVGLElBQUEsTUFBTSxFQUFFO0FBRk4sR0F6Q1k7QUE2Q2hCLEVBQUEsRUFBRSxFQUFFO0FBQ0YsSUFBQSxJQUFJLEVBQUUsS0FESjtBQUVGLElBQUEsTUFBTSxFQUFFO0FBRk4sR0E3Q1k7QUFpRGhCLEVBQUEsRUFBRSxFQUFFO0FBQ0YsSUFBQSxJQUFJLEVBQUUsR0FESjtBQUVGLElBQUEsTUFBTSxFQUFFO0FBRk4sR0FqRFk7QUFxRGhCLEVBQUEsRUFBRSxFQUFFO0FBQ0YsSUFBQSxJQUFJLEVBQUUsR0FESjtBQUVGLElBQUEsTUFBTSxFQUFFO0FBRk4sR0FyRFk7QUF5RGhCLEVBQUEsRUFBRSxFQUFFO0FBQ0YsSUFBQSxJQUFJLEVBQUUsS0FESjtBQUVGLElBQUEsTUFBTSxFQUFFO0FBRk4sR0F6RFk7QUE2RGhCLEVBQUEsRUFBRSxFQUFFO0FBQ0YsSUFBQSxJQUFJLEVBQUUsS0FESjtBQUVGLElB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QUFYLENBQWtCLFVBQVMsSUFBVCxFQUFlLEdBQWYsRUFBb0IsR0FBcEIsRUFBeUI7QUFDekMsYUFBTyxDQUFDLEdBQUQsSUFBUSxJQUFJLElBQUksR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFQLENBQTFCO0FBQ0QsS0FGRDtBQUdEOztBQUNELE1BQUksR0FBRyxDQUFDLE1BQUosSUFBYyxDQUFsQixFQUFxQjtBQUduQixJQUFBLEdBQUcsQ0FBQyxJQUFKLENBQVMsZ0JBQVQ7QUFDRDs7QUFDRCxTQUFPLEdBQVA7QUFDRDs7O0FDNUtEO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKipcbiAqIEBmaWxlIEFjY2VzcyBjb250cm9sIG1vZGVsLlxuICpcbiAqIEBjb3B5cmlnaHQgMjAxNS0yMDIyIFRpbm9kZSBMTEMuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuLy8gTk9URSBUTyBERVZFTE9QRVJTOlxuLy8gTG9jYWxpemFibGUgc3RyaW5ncyBzaG91bGQgYmUgZG91YmxlIHF1b3RlZCBcItGB0YLRgNC+0LrQsCDQvdCwINC00YDRg9Cz0L7QvCDRj9C30YvQutC1XCIsXG4vLyBub24tbG9jYWxpemFibGUgc3RyaW5ncyBzaG91bGQgYmUgc2luZ2xlIHF1b3RlZCAnbm9uLWxvY2FsaXplZCcuXG5cbi8qKlxuICogSGVscGVyIGNsYXNzIGZvciBoYW5kbGluZyBhY2Nlc3MgbW9kZS5cbiAqXG4gKiBAY2xhc3MgQWNjZXNzTW9kZVxuICogQG1lbWJlcm9mIFRpbm9kZVxuICpcbiAqIEBwYXJhbSB7QWNjZXNzTW9kZXxPYmplY3Q9fSBhY3MgLSBBY2Nlc3NNb2RlIHRvIGNvcHkgb3IgYWNjZXNzIG1vZGUgb2JqZWN0IHJlY2VpdmVkIGZyb20gdGhlIHNlcnZlci5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWNjZXNzTW9kZSB7XG4gIGNvbnN0cnVjdG9yKGFjcykge1xuICAgIGlmIChhY3MpIHtcbiAgICAgIHRoaXMuZ2l2ZW4gPSB0eXBlb2YgYWNzLmdpdmVuID09ICdudW1iZXInID8gYWNzLmdpdmVuIDogQWNjZXNzTW9kZS5kZWNvZGUoYWNzLmdpdmVuKTtcbiAgICAgIHRoaXMud2FudCA9IHR5cGVvZiBhY3Mud2FudCA9PSAnbnVtYmVyJyA/IGFjcy53YW50IDogQWNjZXNzTW9kZS5kZWNvZGUoYWNzLndhbnQpO1xuICAgICAgdGhpcy5tb2RlID0gYWNzLm1vZGUgPyAodHlwZW9mIGFjcy5tb2RlID09ICdudW1iZXInID8gYWNzLm1vZGUgOiBBY2Nlc3NNb2RlLmRlY29kZShhY3MubW9kZSkpIDpcbiAgICAgICAgKHRoaXMuZ2l2ZW4gJiB0aGlzLndhbnQpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyAjY2hlY2tGbGFnKHZhbCwgc2lkZSwgZmxhZykge1xuICAgIHNpZGUgPSBzaWRlIHx8ICdtb2RlJztcbiAgICBpZiAoWydnaXZlbicsICd3YW50JywgJ21vZGUnXS5pbmNsdWRlcyhzaWRlKSkge1xuICAgICAgcmV0dXJuICgodmFsW3NpZGVdICYgZmxhZykgIT0gMCk7XG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBBY2Nlc3NNb2RlIGNvbXBvbmVudCAnJHtzaWRlfSdgKTtcbiAgfVxuICAvKipcbiAgICogUGFyc2Ugc3RyaW5nIGludG8gYW4gYWNjZXNzIG1vZGUgdmFsdWUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgTnVtYmVyfSBtb2RlIC0gZWl0aGVyIGEgU3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBhY2Nlc3MgbW9kZSB0byBwYXJzZSBvciBhIHNldCBvZiBiaXRzIHRvIGFzc2lnbi5cbiAgICogQHJldHVybnMge251bWJlcn0gLSBBY2Nlc3MgbW9kZSBhcyBhIG51bWVyaWMgdmFsdWUuXG4gICAqL1xuICBzdGF0aWMgZGVjb2RlKHN0cikge1xuICAgIGlmICghc3RyKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBzdHIgPT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiBzdHIgJiBBY2Nlc3NNb2RlLl9CSVRNQVNLO1xuICAgIH0gZWxzZSBpZiAoc3RyID09PSAnTicgfHwgc3RyID09PSAnbicpIHtcbiAgICAgIHJldHVybiBBY2Nlc3NNb2RlLl9OT05FO1xuICAgIH1cblxuICAgIGNvbnN0IGJpdG1hc2sgPSB7XG4gICAgICAnSic6IEFjY2Vzc01vZGUuX0pPSU4sXG4gICAgICAnUic6IEFjY2Vzc01vZGUuX1JFQUQsXG4gICAgICAnVyc6IEFjY2Vzc01vZGUuX1dSSVRFLFxuICAgICAgJ1AnOiBBY2Nlc3NNb2RlLl9QUkVTLFxuICAgICAgJ0EnOiBBY2Nlc3NNb2RlLl9BUFBST1ZFLFxuICAgICAgJ1MnOiBBY2Nlc3NNb2RlLl9TSEFSRSxcbiAgICAgICdEJzogQWNjZXNzTW9kZS5fREVMRVRFLFxuICAgICAgJ08nOiBBY2Nlc3NNb2RlLl9PV05FUlxuICAgIH07XG5cbiAgICBsZXQgbTAgPSBBY2Nlc3NNb2RlLl9OT05FO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGJpdCA9IGJpdG1hc2tbc3RyLmNoYXJBdChpKS50b1VwcGVyQ2FzZSgpXTtcbiAgICAgIGlmICghYml0KSB7XG4gICAgICAgIC8vIFVucmVjb2duaXplZCBiaXQsIHNraXAuXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgbTAgfD0gYml0O1xuICAgIH1cbiAgICByZXR1cm4gbTA7XG4gIH1cbiAgLyoqXG4gICAqIENvbnZlcnQgbnVtZXJpYyByZXByZXNlbnRhdGlvbiBvZiB0aGUgYWNjZXNzIG1vZGUgaW50byBhIHN0cmluZy5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHZhbCAtIGFjY2VzcyBtb2RlIHZhbHVlIHRvIGNvbnZlcnQgdG8gYSBzdHJpbmcuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IC0gQWNjZXNzIG1vZGUgYXMgYSBzdHJpbmcuXG4gICAqL1xuICBzdGF0aWMgZW5jb2RlKHZhbCkge1xuICAgIGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSBBY2Nlc3NNb2RlLl9JTlZBTElEKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9IGVsc2UgaWYgKHZhbCA9PT0gQWNjZXNzTW9kZS5fTk9ORSkge1xuICAgICAgcmV0dXJuICdOJztcbiAgICB9XG5cbiAgICBjb25zdCBiaXRtYXNrID0gWydKJywgJ1InLCAnVycsICdQJywgJ0EnLCAnUycsICdEJywgJ08nXTtcbiAgICBsZXQgcmVzID0gJyc7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBiaXRtYXNrLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoKHZhbCAmICgxIDw8IGkpKSAhPSAwKSB7XG4gICAgICAgIHJlcyA9IHJlcyArIGJpdG1hc2tbaV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXM7XG4gIH1cbiAgLyoqXG4gICAqIFVwZGF0ZSBudW1lcmljIHJlcHJlc2VudGF0aW9uIG9mIGFjY2VzcyBtb2RlIHdpdGggdGhlIG5ldyB2YWx1ZS4gVGhlIHZhbHVlXG4gICAqIGlzIG9uZSBvZiB0aGUgZm9sbG93aW5nOlxuICAgKiAgLSBhIHN0cmluZyBzdGFydGluZyB3aXRoIDxjb2RlPicrJzwvY29kZT4gb3IgPGNvZGU+Jy0nPC9jb2RlPiB0aGVuIHRoZSBiaXRzIHRvIGFkZCBvciByZW1vdmUsIGUuZy4gPGNvZGU+JytSLVcnPC9jb2RlPiBvciA8Y29kZT4nLVBTJzwvY29kZT4uXG4gICAqICAtIGEgbmV3IHZhbHVlIG9mIGFjY2VzcyBtb2RlXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB2YWwgLSBhY2Nlc3MgbW9kZSB2YWx1ZSB0byB1cGRhdGUuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1cGQgLSB1cGRhdGUgdG8gYXBwbHkgdG8gdmFsLlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSAtIHVwZGF0ZWQgYWNjZXNzIG1vZGUuXG4gICAqL1xuICBzdGF0aWMgdXBkYXRlKHZhbCwgdXBkKSB7XG4gICAgaWYgKCF1cGQgfHwgdHlwZW9mIHVwZCAhPSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIHZhbDtcbiAgICB9XG5cbiAgICBsZXQgYWN0aW9uID0gdXBkLmNoYXJBdCgwKTtcbiAgICBpZiAoYWN0aW9uID09ICcrJyB8fCBhY3Rpb24gPT0gJy0nKSB7XG4gICAgICBsZXQgdmFsMCA9IHZhbDtcbiAgICAgIC8vIFNwbGl0IGRlbHRhLXN0cmluZyBsaWtlICcrQUJDLURFRitaJyBpbnRvIGFuIGFycmF5IG9mIHBhcnRzIGluY2x1ZGluZyArIGFuZCAtLlxuICAgICAgY29uc3QgcGFydHMgPSB1cGQuc3BsaXQoLyhbLStdKS8pO1xuICAgICAgLy8gU3RhcnRpbmcgaXRlcmF0aW9uIGZyb20gMSBiZWNhdXNlIFN0cmluZy5zcGxpdCgpIGNyZWF0ZXMgYW4gYXJyYXkgd2l0aCB0aGUgZmlyc3QgZW1wdHkgZWxlbWVudC5cbiAgICAgIC8vIEl0ZXJhdGluZyBieSAyIGJlY2F1c2Ugd2UgcGFyc2UgcGFpcnMgKy8tIHRoZW4gZGF0YS5cbiAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgcGFydHMubGVuZ3RoIC0gMTsgaSArPSAyKSB7XG4gICAgICAgIGFjdGlvbiA9IHBhcnRzW2ldO1xuICAgICAgICBjb25zdCBtMCA9IEFjY2Vzc01vZGUuZGVjb2RlKHBhcnRzW2kgKyAxXSk7XG4gICAgICAgIGlmIChtMCA9PSBBY2Nlc3NNb2RlLl9JTlZBTElEKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAobTAgPT0gbnVsbCkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhY3Rpb24gPT09ICcrJykge1xuICAgICAgICAgIHZhbDAgfD0gbTA7XG4gICAgICAgIH0gZWxzZSBpZiAoYWN0aW9uID09PSAnLScpIHtcbiAgICAgICAgICB2YWwwICY9IH5tMDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdmFsID0gdmFsMDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVGhlIHN0cmluZyBpcyBhbiBleHBsaWNpdCBuZXcgdmFsdWUgJ0FCQycgcmF0aGVyIHRoYW4gZGVsdGEuXG4gICAgICBjb25zdCB2YWwwID0gQWNjZXNzTW9kZS5kZWNvZGUodXBkKTtcbiAgICAgIGlmICh2YWwwICE9IEFjY2Vzc01vZGUuX0lOVkFMSUQpIHtcbiAgICAgICAgdmFsID0gdmFsMDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdmFsO1xuICB9XG4gIC8qKlxuICAgKiBCaXRzIHByZXNlbnQgaW4gYTEgYnV0IG1pc3NpbmcgaW4gYTIuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlciB8IHN0cmluZ30gYTEgLSBhY2Nlc3MgbW9kZSB0byBzdWJ0cmFjdCBmcm9tLlxuICAgKiBAcGFyYW0ge251bWJlciB8IHN0cmluZ30gYTIgLSBhY2Nlc3MgbW9kZSB0byBzdWJ0cmFjdC5cbiAgICogQHJldHVybnMge251bWJlcn0gYWNjZXNzIG1vZGUgd2l0aCBiaXRzIHByZXNlbnQgaW4gPGNvZGU+YTE8L2NvZGU+IGJ1dCBtaXNzaW5nIGluIDxjb2RlPmEyPC9jb2RlPi5cbiAgICovXG4gIHN0YXRpYyBkaWZmKGExLCBhMikge1xuICAgIGExID0gQWNjZXNzTW9kZS5kZWNvZGUoYTEpO1xuICAgIGEyID0gQWNjZXNzTW9kZS5kZWNvZGUoYTIpO1xuXG4gICAgaWYgKGExID09IEFjY2Vzc01vZGUuX0lOVkFMSUQgfHwgYTIgPT0gQWNjZXNzTW9kZS5fSU5WQUxJRCkge1xuICAgICAgcmV0dXJuIEFjY2Vzc01vZGUuX0lOVkFMSUQ7XG4gICAgfVxuICAgIHJldHVybiBhMSAmIH5hMjtcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIEN1c3RvbSBmb3JtYXR0ZXJcbiAgICovXG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiAne1wibW9kZVwiOiBcIicgKyBBY2Nlc3NNb2RlLmVuY29kZSh0aGlzLm1vZGUpICtcbiAgICAgICdcIiwgXCJnaXZlblwiOiBcIicgKyBBY2Nlc3NNb2RlLmVuY29kZSh0aGlzLmdpdmVuKSArXG4gICAgICAnXCIsIFwid2FudFwiOiBcIicgKyBBY2Nlc3NNb2RlLmVuY29kZSh0aGlzLndhbnQpICsgJ1wifSc7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBudW1lcmljIHZhbHVlcyB0byBzdHJpbmdzLlxuICAgKi9cbiAganNvbkhlbHBlcigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbW9kZTogQWNjZXNzTW9kZS5lbmNvZGUodGhpcy5tb2RlKSxcbiAgICAgIGdpdmVuOiBBY2Nlc3NNb2RlLmVuY29kZSh0aGlzLmdpdmVuKSxcbiAgICAgIHdhbnQ6IEFjY2Vzc01vZGUuZW5jb2RlKHRoaXMud2FudClcbiAgICB9O1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQXNzaWduIHZhbHVlIHRvICdtb2RlJy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgTnVtYmVyfSBtIC0gZWl0aGVyIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBhY2Nlc3MgbW9kZSBvciBhIHNldCBvZiBiaXRzLlxuICAgKiBAcmV0dXJucyB7QWNjZXNzTW9kZX0gLSA8Y29kZT50aGlzPC9jb2RlPiBBY2Nlc3NNb2RlLlxuICAgKi9cbiAgc2V0TW9kZShtKSB7XG4gICAgdGhpcy5tb2RlID0gQWNjZXNzTW9kZS5kZWNvZGUobSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBVcGRhdGUgPGNvZGU+bW9kZTwvY29kZT4gdmFsdWUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdSAtIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgY2hhbmdlcyB0byBhcHBseSB0byBhY2Nlc3MgbW9kZS5cbiAgICogQHJldHVybnMge0FjY2Vzc01vZGV9IC0gPGNvZGU+dGhpczwvY29kZT4gQWNjZXNzTW9kZS5cbiAgICovXG4gIHVwZGF0ZU1vZGUodSkge1xuICAgIHRoaXMubW9kZSA9IEFjY2Vzc01vZGUudXBkYXRlKHRoaXMubW9kZSwgdSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBHZXQgPGNvZGU+bW9kZTwvY29kZT4gdmFsdWUgYXMgYSBzdHJpbmcuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSAtIDxjb2RlPm1vZGU8L2NvZGU+IHZhbHVlLlxuICAgKi9cbiAgZ2V0TW9kZSgpIHtcbiAgICByZXR1cm4gQWNjZXNzTW9kZS5lbmNvZGUodGhpcy5tb2RlKTtcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIEFzc2lnbiA8Y29kZT5naXZlbjwvY29kZT4gIHZhbHVlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmcgfCBOdW1iZXJ9IGcgLSBlaXRoZXIgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIGFjY2VzcyBtb2RlIG9yIGEgc2V0IG9mIGJpdHMuXG4gICAqIEByZXR1cm5zIHtBY2Nlc3NNb2RlfSAtIDxjb2RlPnRoaXM8L2NvZGU+IEFjY2Vzc01vZGUuXG4gICAqL1xuICBzZXRHaXZlbihnKSB7XG4gICAgdGhpcy5naXZlbiA9IEFjY2Vzc01vZGUuZGVjb2RlKGcpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogVXBkYXRlICdnaXZlbicgdmFsdWUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdSAtIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgY2hhbmdlcyB0byBhcHBseSB0byBhY2Nlc3MgbW9kZS5cbiAgICogQHJldHVybnMge0FjY2Vzc01vZGV9IC0gPGNvZGU+dGhpczwvY29kZT4gQWNjZXNzTW9kZS5cbiAgICovXG4gIHVwZGF0ZUdpdmVuKHUpIHtcbiAgICB0aGlzLmdpdmVuID0gQWNjZXNzTW9kZS51cGRhdGUodGhpcy5naXZlbiwgdSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBHZXQgJ2dpdmVuJyB2YWx1ZSBhcyBhIHN0cmluZy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IC0gPGI+Z2l2ZW48L2I+IHZhbHVlLlxuICAgKi9cbiAgZ2V0R2l2ZW4oKSB7XG4gICAgcmV0dXJuIEFjY2Vzc01vZGUuZW5jb2RlKHRoaXMuZ2l2ZW4pO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQXNzaWduICd3YW50JyB2YWx1ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgTnVtYmVyfSB3IC0gZWl0aGVyIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBhY2Nlc3MgbW9kZSBvciBhIHNldCBvZiBiaXRzLlxuICAgKiBAcmV0dXJucyB7QWNjZXNzTW9kZX0gLSA8Y29kZT50aGlzPC9jb2RlPiBBY2Nlc3NNb2RlLlxuICAgKi9cbiAgc2V0V2FudCh3KSB7XG4gICAgdGhpcy53YW50ID0gQWNjZXNzTW9kZS5kZWNvZGUodyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBVcGRhdGUgJ3dhbnQnIHZhbHVlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHUgLSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIGNoYW5nZXMgdG8gYXBwbHkgdG8gYWNjZXNzIG1vZGUuXG4gICAqIEByZXR1cm5zIHtBY2Nlc3NNb2RlfSAtIDxjb2RlPnRoaXM8L2NvZGU+IEFjY2Vzc01vZGUuXG4gICAqL1xuICB1cGRhdGVXYW50KHUpIHtcbiAgICB0aGlzLndhbnQgPSBBY2Nlc3NNb2RlLnVwZGF0ZSh0aGlzLndhbnQsIHUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogR2V0ICd3YW50JyB2YWx1ZSBhcyBhIHN0cmluZy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IC0gPGI+d2FudDwvYj4gdmFsdWUuXG4gICAqL1xuICBnZXRXYW50KCkge1xuICAgIHJldHVybiBBY2Nlc3NNb2RlLmVuY29kZSh0aGlzLndhbnQpO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogR2V0IHBlcm1pc3Npb25zIHByZXNlbnQgaW4gJ3dhbnQnIGJ1dCBtaXNzaW5nIGluICdnaXZlbicuXG4gICAqIEludmVyc2Ugb2Yge0BsaW5rIFRpbm9kZS5BY2Nlc3NNb2RlI2dldEV4Y2Vzc2l2ZX1cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IHBlcm1pc3Npb25zIHByZXNlbnQgaW4gPGI+d2FudDwvYj4gYnV0IG1pc3NpbmcgaW4gPGI+Z2l2ZW48L2I+LlxuICAgKi9cbiAgZ2V0TWlzc2luZygpIHtcbiAgICByZXR1cm4gQWNjZXNzTW9kZS5lbmNvZGUodGhpcy53YW50ICYgfnRoaXMuZ2l2ZW4pO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogR2V0IHBlcm1pc3Npb25zIHByZXNlbnQgaW4gJ2dpdmVuJyBidXQgbWlzc2luZyBpbiAnd2FudCcuXG4gICAqIEludmVyc2Ugb2Yge0BsaW5rIFRpbm9kZS5BY2Nlc3NNb2RlI2dldE1pc3Npbmd9XG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBwZXJtaXNzaW9ucyBwcmVzZW50IGluIDxiPmdpdmVuPC9iPiBidXQgbWlzc2luZyBpbiA8Yj53YW50PC9iPi5cbiAgICovXG4gIGdldEV4Y2Vzc2l2ZSgpIHtcbiAgICByZXR1cm4gQWNjZXNzTW9kZS5lbmNvZGUodGhpcy5naXZlbiAmIH50aGlzLndhbnQpO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogVXBkYXRlICd3YW50JywgJ2dpdmUnLCBhbmQgJ21vZGUnIHZhbHVlcy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEBwYXJhbSB7QWNjZXNzTW9kZX0gdmFsIC0gbmV3IGFjY2VzcyBtb2RlIHZhbHVlLlxuICAgKiBAcmV0dXJucyB7QWNjZXNzTW9kZX0gLSA8Y29kZT50aGlzPC9jb2RlPiBBY2Nlc3NNb2RlLlxuICAgKi9cbiAgdXBkYXRlQWxsKHZhbCkge1xuICAgIGlmICh2YWwpIHtcbiAgICAgIHRoaXMudXBkYXRlR2l2ZW4odmFsLmdpdmVuKTtcbiAgICAgIHRoaXMudXBkYXRlV2FudCh2YWwud2FudCk7XG4gICAgICB0aGlzLm1vZGUgPSB0aGlzLmdpdmVuICYgdGhpcy53YW50O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIENoZWNrIGlmIE93bmVyIChPKSBmbGFnIGlzIHNldC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gc2lkZSAtIHdoaWNoIHBlcm1pc3Npb24gdG8gY2hlY2s6IGdpdmVuLCB3YW50LCBtb2RlOyBkZWZhdWx0OiBtb2RlLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiBmbGFnIGlzIHNldC5cbiAgICovXG4gIGlzT3duZXIoc2lkZSkge1xuICAgIHJldHVybiBBY2Nlc3NNb2RlLiNjaGVja0ZsYWcodGhpcywgc2lkZSwgQWNjZXNzTW9kZS5fT1dORVIpO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQ2hlY2sgaWYgUHJlc2VuY2UgKFApIGZsYWcgaXMgc2V0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICogQHBhcmFtIHtzdHJpbmc9fSBzaWRlIC0gd2hpY2ggcGVybWlzc2lvbiB0byBjaGVjazogZ2l2ZW4sIHdhbnQsIG1vZGU7IGRlZmF1bHQ6IG1vZGUuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIGZsYWcgaXMgc2V0LlxuICAgKi9cbiAgaXNQcmVzZW5jZXIoc2lkZSkge1xuICAgIHJldHVybiBBY2Nlc3NNb2RlLiNjaGVja0ZsYWcodGhpcywgc2lkZSwgQWNjZXNzTW9kZS5fUFJFUyk7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBDaGVjayBpZiBQcmVzZW5jZSAoUCkgZmxhZyBpcyBOT1Qgc2V0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICogQHBhcmFtIHtzdHJpbmc9fSBzaWRlIC0gd2hpY2ggcGVybWlzc2lvbiB0byBjaGVjazogZ2l2ZW4sIHdhbnQsIG1vZGU7IGRlZmF1bHQ6IG1vZGUuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIGZsYWcgaXMgc2V0LlxuICAgKi9cbiAgaXNNdXRlZChzaWRlKSB7XG4gICAgcmV0dXJuICF0aGlzLmlzUHJlc2VuY2VyKHNpZGUpO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQ2hlY2sgaWYgSm9pbiAoSikgZmxhZyBpcyBzZXQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IHNpZGUgLSB3aGljaCBwZXJtaXNzaW9uIHRvIGNoZWNrOiBnaXZlbiwgd2FudCwgbW9kZTsgZGVmYXVsdDogbW9kZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgZmxhZyBpcyBzZXQuXG4gICAqL1xuICBpc0pvaW5lcihzaWRlKSB7XG4gICAgcmV0dXJuIEFjY2Vzc01vZGUuI2NoZWNrRmxhZyh0aGlzLCBzaWRlLCBBY2Nlc3NNb2RlLl9KT0lOKTtcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIENoZWNrIGlmIFJlYWRlciAoUikgZmxhZyBpcyBzZXQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IHNpZGUgLSB3aGljaCBwZXJtaXNzaW9uIHRvIGNoZWNrOiBnaXZlbiwgd2FudCwgbW9kZTsgZGVmYXVsdDogbW9kZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgZmxhZyBpcyBzZXQuXG4gICAqL1xuICBpc1JlYWRlcihzaWRlKSB7XG4gICAgcmV0dXJuIEFjY2Vzc01vZGUuI2NoZWNrRmxhZyh0aGlzLCBzaWRlLCBBY2Nlc3NNb2RlLl9SRUFEKTtcbiAgfVxuICAvKipcbiAgICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAY2xhc3MgQWNjZXNzTW9kZVxuICAgKi9cbiAgLyoqXG4gICAqIENoZWNrIGlmIFdyaXRlciAoVykgZmxhZyBpcyBzZXQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IHNpZGUgLSB3aGljaCBwZXJtaXNzaW9uIHRvIGNoZWNrOiBnaXZlbiwgd2FudCwgbW9kZTsgZGVmYXVsdDogbW9kZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgZmxhZyBpcyBzZXQuXG4gICAqL1xuICBpc1dyaXRlcihzaWRlKSB7XG4gICAgcmV0dXJuIEFjY2Vzc01vZGUuI2NoZWNrRmxhZyh0aGlzLCBzaWRlLCBBY2Nlc3NNb2RlLl9XUklURSk7XG4gIH1cbiAgLyoqXG4gICAqIEFjY2Vzc01vZGUgaXMgYSBjbGFzcyByZXByZXNlbnRpbmcgdG9waWMgYWNjZXNzIG1vZGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQGNsYXNzIEFjY2Vzc01vZGVcbiAgICovXG4gIC8qKlxuICAgKiBDaGVjayBpZiBBcHByb3ZlciAoQSkgZmxhZyBpcyBzZXQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IHNpZGUgLSB3aGljaCBwZXJtaXNzaW9uIHRvIGNoZWNrOiBnaXZlbiwgd2FudCwgbW9kZTsgZGVmYXVsdDogbW9kZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgZmxhZyBpcyBzZXQuXG4gICAqL1xuICBpc0FwcHJvdmVyKHNpZGUpIHtcbiAgICByZXR1cm4gQWNjZXNzTW9kZS4jY2hlY2tGbGFnKHRoaXMsIHNpZGUsIEFjY2Vzc01vZGUuX0FQUFJPVkUpO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQ2hlY2sgaWYgZWl0aGVyIG9uZSBvZiBPd25lciAoTykgb3IgQXBwcm92ZXIgKEEpIGZsYWdzIGlzIHNldC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gc2lkZSAtIHdoaWNoIHBlcm1pc3Npb24gdG8gY2hlY2s6IGdpdmVuLCB3YW50LCBtb2RlOyBkZWZhdWx0OiBtb2RlLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiBmbGFnIGlzIHNldC5cbiAgICovXG4gIGlzQWRtaW4oc2lkZSkge1xuICAgIHJldHVybiB0aGlzLmlzT3duZXIoc2lkZSkgfHwgdGhpcy5pc0FwcHJvdmVyKHNpZGUpO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQ2hlY2sgaWYgZWl0aGVyIG9uZSBvZiBPd25lciAoTyksIEFwcHJvdmVyIChBKSwgb3IgU2hhcmVyIChTKSBmbGFncyBpcyBzZXQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IHNpZGUgLSB3aGljaCBwZXJtaXNzaW9uIHRvIGNoZWNrOiBnaXZlbiwgd2FudCwgbW9kZTsgZGVmYXVsdDogbW9kZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgZmxhZyBpcyBzZXQuXG4gICAqL1xuICBpc1NoYXJlcihzaWRlKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNBZG1pbihzaWRlKSB8fCBBY2Nlc3NNb2RlLiNjaGVja0ZsYWcodGhpcywgc2lkZSwgQWNjZXNzTW9kZS5fU0hBUkUpO1xuICB9XG4gIC8qKlxuICAgKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gICAqL1xuICAvKipcbiAgICogQ2hlY2sgaWYgRGVsZXRlciAoRCkgZmxhZyBpcyBzZXQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IHNpZGUgLSB3aGljaCBwZXJtaXNzaW9uIHRvIGNoZWNrOiBnaXZlbiwgd2FudCwgbW9kZTsgZGVmYXVsdDogbW9kZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgZmxhZyBpcyBzZXQuXG4gICAqL1xuICBpc0RlbGV0ZXIoc2lkZSkge1xuICAgIHJldHVybiBBY2Nlc3NNb2RlLiNjaGVja0ZsYWcodGhpcywgc2lkZSwgQWNjZXNzTW9kZS5fREVMRVRFKTtcbiAgfVxufVxuXG5BY2Nlc3NNb2RlLl9OT05FID0gMHgwMDtcbkFjY2Vzc01vZGUuX0pPSU4gPSAweDAxO1xuQWNjZXNzTW9kZS5fUkVBRCA9IDB4MDI7XG5BY2Nlc3NNb2RlLl9XUklURSA9IDB4MDQ7XG5BY2Nlc3NNb2RlLl9QUkVTID0gMHgwODtcbkFjY2Vzc01vZGUuX0FQUFJPVkUgPSAweDEwO1xuQWNjZXNzTW9kZS5fU0hBUkUgPSAweDIwO1xuQWNjZXNzTW9kZS5fREVMRVRFID0gMHg0MDtcbkFjY2Vzc01vZGUuX09XTkVSID0gMHg4MDtcblxuQWNjZXNzTW9kZS5fQklUTUFTSyA9IEFjY2Vzc01vZGUuX0pPSU4gfCBBY2Nlc3NNb2RlLl9SRUFEIHwgQWNjZXNzTW9kZS5fV1JJVEUgfCBBY2Nlc3NNb2RlLl9QUkVTIHxcbiAgQWNjZXNzTW9kZS5fQVBQUk9WRSB8IEFjY2Vzc01vZGUuX1NIQVJFIHwgQWNjZXNzTW9kZS5fREVMRVRFIHwgQWNjZXNzTW9kZS5fT1dORVI7XG5BY2Nlc3NNb2RlLl9JTlZBTElEID0gMHgxMDAwMDA7XG4iLCIvKipcbiAqIEBmaWxlIEluLW1lbW9yeSBzb3J0ZWQgY2FjaGUgb2Ygb2JqZWN0cy5cbiAqXG4gKiBAY29weXJpZ2h0IDIwMTUtMjAyMiBUaW5vZGUgTExDLlxuICovXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogSW4tbWVtb3J5IHNvcnRlZCBjYWNoZSBvZiBvYmplY3RzLlxuICpcbiAqIEBjbGFzcyBDQnVmZmVyXG4gKiBAbWVtYmVyb2YgVGlub2RlXG4gKiBAcHJvdGVjdGVkXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbn0gY29tcGFyZSBjdXN0b20gY29tcGFyYXRvciBvZiBvYmplY3RzLiBUYWtlcyB0d28gcGFyYW1ldGVycyA8Y29kZT5hPC9jb2RlPiBhbmQgPGNvZGU+YjwvY29kZT47XG4gKiAgICByZXR1cm5zIDxjb2RlPi0xPC9jb2RlPiBpZiA8Y29kZT5hIDwgYjwvY29kZT4sIDxjb2RlPjA8L2NvZGU+IGlmIDxjb2RlPmEgPT0gYjwvY29kZT4sIDxjb2RlPjE8L2NvZGU+IG90aGVyd2lzZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gdW5pcXVlIGVuZm9yY2UgZWxlbWVudCB1bmlxdWVuZXNzOiB3aGVuIDxjb2RlPnRydWU8L2NvZGU+IHJlcGxhY2UgZXhpc3RpbmcgZWxlbWVudCB3aXRoIGEgbmV3XG4gKiAgICBvbmUgb24gY29uZmxpY3Q7IHdoZW4gPGNvZGU+ZmFsc2U8L2NvZGU+IGtlZXAgYm90aCBlbGVtZW50cy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ0J1ZmZlciB7XG4gICNjb21wYXJhdG9yID0gdW5kZWZpbmVkO1xuICAjdW5pcXVlID0gZmFsc2U7XG4gIGJ1ZmZlciA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKGNvbXBhcmVfLCB1bmlxdWVfKSB7XG4gICAgdGhpcy4jY29tcGFyYXRvciA9IGNvbXBhcmVfIHx8ICgoYSwgYikgPT4ge1xuICAgICAgcmV0dXJuIGEgPT09IGIgPyAwIDogYSA8IGIgPyAtMSA6IDE7XG4gICAgfSk7XG4gICAgdGhpcy4jdW5pcXVlID0gdW5pcXVlXztcbiAgfVxuXG4gICNmaW5kTmVhcmVzdChlbGVtLCBhcnIsIGV4YWN0KSB7XG4gICAgbGV0IHN0YXJ0ID0gMDtcbiAgICBsZXQgZW5kID0gYXJyLmxlbmd0aCAtIDE7XG4gICAgbGV0IHBpdm90ID0gMDtcbiAgICBsZXQgZGlmZiA9IDA7XG4gICAgbGV0IGZvdW5kID0gZmFsc2U7XG5cbiAgICB3aGlsZSAoc3RhcnQgPD0gZW5kKSB7XG4gICAgICBwaXZvdCA9IChzdGFydCArIGVuZCkgLyAyIHwgMDtcbiAgICAgIGRpZmYgPSB0aGlzLiNjb21wYXJhdG9yKGFycltwaXZvdF0sIGVsZW0pO1xuICAgICAgaWYgKGRpZmYgPCAwKSB7XG4gICAgICAgIHN0YXJ0ID0gcGl2b3QgKyAxO1xuICAgICAgfSBlbHNlIGlmIChkaWZmID4gMCkge1xuICAgICAgICBlbmQgPSBwaXZvdCAtIDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZm91bmQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlkeDogcGl2b3QsXG4gICAgICAgIGV4YWN0OiB0cnVlXG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAoZXhhY3QpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlkeDogLTFcbiAgICAgIH07XG4gICAgfVxuICAgIC8vIE5vdCBleGFjdCAtIGluc2VydGlvbiBwb2ludFxuICAgIHJldHVybiB7XG4gICAgICBpZHg6IGRpZmYgPCAwID8gcGl2b3QgKyAxIDogcGl2b3RcbiAgICB9O1xuICB9XG5cbiAgLy8gSW5zZXJ0IGVsZW1lbnQgaW50byBhIHNvcnRlZCBhcnJheS5cbiAgI2luc2VydFNvcnRlZChlbGVtLCBhcnIpIHtcbiAgICBjb25zdCBmb3VuZCA9IHRoaXMuI2ZpbmROZWFyZXN0KGVsZW0sIGFyciwgZmFsc2UpO1xuICAgIGNvbnN0IGNvdW50ID0gKGZvdW5kLmV4YWN0ICYmIHRoaXMuI3VuaXF1ZSkgPyAxIDogMDtcbiAgICBhcnIuc3BsaWNlKGZvdW5kLmlkeCwgY291bnQsIGVsZW0pO1xuICAgIHJldHVybiBhcnI7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGFuIGVsZW1lbnQgYXQgdGhlIGdpdmVuIHBvc2l0aW9uLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNCdWZmZXIjXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBhdCAtIFBvc2l0aW9uIHRvIGZldGNoIGZyb20uXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IEVsZW1lbnQgYXQgdGhlIGdpdmVuIHBvc2l0aW9uIG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4uXG4gICAqL1xuICBnZXRBdChhdCkge1xuICAgIHJldHVybiB0aGlzLmJ1ZmZlclthdF07XG4gIH1cblxuICAvKipcbiAgICogQ29udmVuaWVuY2UgbWV0aG9kIGZvciBnZXR0aW5nIHRoZSBlbGVtZW50IGZyb20gdGhlIGVuZCBvZiB0aGUgYnVmZmVyLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNCdWZmZXIjXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBhdCAtIHBvc2l0aW9uIHRvIGZldGNoIGZyb20sIGNvdW50aW5nIGZyb20gdGhlIGVuZDtcbiAgICogICAgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPiBvciA8Y29kZT5udWxsPC9jb2RlPiAgbWVhbiBcImxhc3RcIi5cbiAgICogQHJldHVybnMge09iamVjdH0gVGhlIGxhc3QgZWxlbWVudCBpbiB0aGUgYnVmZmVyIG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4gaWYgYnVmZmVyIGlzIGVtcHR5LlxuICAgKi9cbiAgZ2V0TGFzdChhdCkge1xuICAgIGF0IHw9IDA7XG4gICAgcmV0dXJuIHRoaXMuYnVmZmVyLmxlbmd0aCA+IGF0ID8gdGhpcy5idWZmZXJbdGhpcy5idWZmZXIubGVuZ3RoIC0gMSAtIGF0XSA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgbmV3IGVsZW1lbnQocykgdG8gdGhlIGJ1ZmZlci4gVmFyaWFkaWM6IHRha2VzIG9uZSBvciBtb3JlIGFyZ3VtZW50cy4gSWYgYW4gYXJyYXkgaXMgcGFzc2VkIGFzIGEgc2luZ2xlXG4gICAqIGFyZ3VtZW50LCBpdHMgZWxlbWVudHMgYXJlIGluc2VydGVkIGluZGl2aWR1YWxseS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKlxuICAgKiBAcGFyYW0gey4uLk9iamVjdHxBcnJheX0gLSBPbmUgb3IgbW9yZSBvYmplY3RzIHRvIGluc2VydC5cbiAgICovXG4gIHB1dCgpIHtcbiAgICBsZXQgaW5zZXJ0O1xuICAgIC8vIGluc3BlY3QgYXJndW1lbnRzOiBpZiBhcnJheSwgaW5zZXJ0IGl0cyBlbGVtZW50cywgaWYgb25lIG9yIG1vcmUgbm9uLWFycmF5IGFyZ3VtZW50cywgaW5zZXJ0IHRoZW0gb25lIGJ5IG9uZVxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDEgJiYgQXJyYXkuaXNBcnJheShhcmd1bWVudHNbMF0pKSB7XG4gICAgICBpbnNlcnQgPSBhcmd1bWVudHNbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGluc2VydCA9IGFyZ3VtZW50cztcbiAgICB9XG4gICAgZm9yIChsZXQgaWR4IGluIGluc2VydCkge1xuICAgICAgdGhpcy4jaW5zZXJ0U29ydGVkKGluc2VydFtpZHhdLCB0aGlzLmJ1ZmZlcik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBlbGVtZW50IGF0IHRoZSBnaXZlbiBwb3NpdGlvbi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKiBAcGFyYW0ge251bWJlcn0gYXQgLSBQb3NpdGlvbiB0byBkZWxldGUgYXQuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IEVsZW1lbnQgYXQgdGhlIGdpdmVuIHBvc2l0aW9uIG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4uXG4gICAqL1xuICBkZWxBdChhdCkge1xuICAgIGF0IHw9IDA7XG4gICAgbGV0IHIgPSB0aGlzLmJ1ZmZlci5zcGxpY2UoYXQsIDEpO1xuICAgIGlmIChyICYmIHIubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIHJbMF07XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGVsZW1lbnRzIGJldHdlZW4gdHdvIHBvc2l0aW9ucy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKiBAcGFyYW0ge251bWJlcn0gc2luY2UgLSBQb3NpdGlvbiB0byBkZWxldGUgZnJvbSAoaW5jbHVzaXZlKS5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGJlZm9yZSAtIFBvc2l0aW9uIHRvIGRlbGV0ZSB0byAoZXhjbHVzaXZlKS5cbiAgICpcbiAgICogQHJldHVybnMge0FycmF5fSBhcnJheSBvZiByZW1vdmVkIGVsZW1lbnRzIChjb3VsZCBiZSB6ZXJvIGxlbmd0aCkuXG4gICAqL1xuICBkZWxSYW5nZShzaW5jZSwgYmVmb3JlKSB7XG4gICAgcmV0dXJuIHRoaXMuYnVmZmVyLnNwbGljZShzaW5jZSwgYmVmb3JlIC0gc2luY2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIHRoZSBidWZmZXIgaG9sZHMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ0J1ZmZlciNcbiAgICogQHJldHVybiB7bnVtYmVyfSBOdW1iZXIgb2YgZWxlbWVudHMgaW4gdGhlIGJ1ZmZlci5cbiAgICovXG4gIGxlbmd0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5idWZmZXIubGVuZ3RoO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0IHRoZSBidWZmZXIgZGlzY2FyZGluZyBhbGwgZWxlbWVudHNcbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKi9cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5idWZmZXIgPSBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayBmb3IgaXRlcmF0aW5nIGNvbnRlbnRzIG9mIGJ1ZmZlci4gU2VlIHtAbGluayBUaW5vZGUuQ0J1ZmZlciNmb3JFYWNofS5cbiAgICogQGNhbGxiYWNrIEZvckVhY2hDYWxsYmFja1R5cGVcbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKiBAcGFyYW0ge09iamVjdH0gZWxlbSAtIEN1cnJlbnQgZWxlbWVudCBvZiB0aGUgYnVmZmVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gcHJldiAtIFByZXZpb3VzIGVsZW1lbnQgb2YgdGhlIGJ1ZmZlci5cbiAgICogQHBhcmFtIHtPYmplY3R9IG5leHQgLSBOZXh0IGVsZW1lbnQgb2YgdGhlIGJ1ZmZlci5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IC0gSW5kZXggb2YgdGhlIGN1cnJlbnQgZWxlbWVudC5cbiAgICovXG5cbiAgLyoqXG4gICAqIEFwcGx5IGdpdmVuIDxjb2RlPmNhbGxiYWNrPC9jb2RlPiB0byBhbGwgZWxlbWVudHMgb2YgdGhlIGJ1ZmZlci5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgKlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5Gb3JFYWNoQ2FsbGJhY2tUeXBlfSBjYWxsYmFjayAtIEZ1bmN0aW9uIHRvIGNhbGwgZm9yIGVhY2ggZWxlbWVudC5cbiAgICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0SWR4IC0gT3B0aW9uYWwgaW5kZXggdG8gc3RhcnQgaXRlcmF0aW5nIGZyb20gKGluY2x1c2l2ZSkuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBiZWZvcmVJZHggLSBPcHRpb25hbCBpbmRleCB0byBzdG9wIGl0ZXJhdGluZyBiZWZvcmUgKGV4Y2x1c2l2ZSkuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gY2FsbGluZyBjb250ZXh0IChpLmUuIHZhbHVlIG9mIDxjb2RlPnRoaXM8L2NvZGU+IGluIGNhbGxiYWNrKVxuICAgKi9cbiAgZm9yRWFjaChjYWxsYmFjaywgc3RhcnRJZHgsIGJlZm9yZUlkeCwgY29udGV4dCkge1xuICAgIHN0YXJ0SWR4ID0gc3RhcnRJZHggfCAwO1xuICAgIGJlZm9yZUlkeCA9IGJlZm9yZUlkeCB8fCB0aGlzLmJ1ZmZlci5sZW5ndGg7XG5cbiAgICBmb3IgKGxldCBpID0gc3RhcnRJZHg7IGkgPCBiZWZvcmVJZHg7IGkrKykge1xuICAgICAgY2FsbGJhY2suY2FsbChjb250ZXh0LCB0aGlzLmJ1ZmZlcltpXSxcbiAgICAgICAgKGkgPiBzdGFydElkeCA/IHRoaXMuYnVmZmVyW2kgLSAxXSA6IHVuZGVmaW5lZCksXG4gICAgICAgIChpIDwgYmVmb3JlSWR4IC0gMSA/IHRoaXMuYnVmZmVyW2kgKyAxXSA6IHVuZGVmaW5lZCksIGkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kIGVsZW1lbnQgaW4gYnVmZmVyIHVzaW5nIGJ1ZmZlcidzIGNvbXBhcmlzb24gZnVuY3Rpb24uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ0J1ZmZlciNcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IGVsZW0gLSBlbGVtZW50IHRvIGZpbmQuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IG5lYXJlc3QgLSB3aGVuIHRydWUgYW5kIGV4YWN0IG1hdGNoIGlzIG5vdCBmb3VuZCwgcmV0dXJuIHRoZSBuZWFyZXN0IGVsZW1lbnQgKGluc2VydGlvbiBwb2ludCkuXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IGluZGV4IG9mIHRoZSBlbGVtZW50IGluIHRoZSBidWZmZXIgb3IgLTEuXG4gICAqL1xuICBmaW5kKGVsZW0sIG5lYXJlc3QpIHtcbiAgICBjb25zdCB7XG4gICAgICBpZHhcbiAgICB9ID0gdGhpcy4jZmluZE5lYXJlc3QoZWxlbSwgdGhpcy5idWZmZXIsICFuZWFyZXN0KTtcbiAgICByZXR1cm4gaWR4O1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIGZvciBmaWx0ZXJpbmcgdGhlIGJ1ZmZlci4gU2VlIHtAbGluayBUaW5vZGUuQ0J1ZmZlciNmaWx0ZXJ9LlxuICAgKiBAY2FsbGJhY2sgRm9yRWFjaENhbGxiYWNrVHlwZVxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNCdWZmZXIjXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtIC0gQ3VycmVudCBlbGVtZW50IG9mIHRoZSBidWZmZXIuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCAtIEluZGV4IG9mIHRoZSBjdXJyZW50IGVsZW1lbnQuXG4gICAqIEByZXR1cm5zIHtib29sZW59IDxjb2RlPnRydWU8L2NvZGU+IHRvIGtlZXAgdGhlIGVsZW1lbnQsIDxjb2RlPmZhbHNlPC9jb2RlPiB0byByZW1vdmUuXG4gICAqL1xuXG4gIC8qKlxuICAgKiBSZW1vdmUgYWxsIGVsZW1lbnRzIHRoYXQgZG8gbm90IHBhc3MgdGhlIHRlc3QgaW1wbGVtZW50ZWQgYnkgdGhlIHByb3ZpZGVkIGNhbGxiYWNrIGZ1bmN0aW9uLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNCdWZmZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7VGlub2RlLkZpbHRlckNhbGxiYWNrVHlwZX0gY2FsbGJhY2sgLSBGdW5jdGlvbiB0byBjYWxsIGZvciBlYWNoIGVsZW1lbnQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gY2FsbGluZyBjb250ZXh0IChpLmUuIHZhbHVlIG9mIDxjb2RlPnRoaXM8L2NvZGU+IGluIHRoZSBjYWxsYmFjaylcbiAgICovXG4gIGZpbHRlcihjYWxsYmFjaywgY29udGV4dCkge1xuICAgIGxldCBjb3VudCA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmJ1ZmZlci5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGNhbGxiYWNrLmNhbGwoY29udGV4dCwgdGhpcy5idWZmZXJbaV0sIGkpKSB7XG4gICAgICAgIHRoaXMuYnVmZmVyW2NvdW50XSA9IHRoaXMuYnVmZmVyW2ldO1xuICAgICAgICBjb3VudCsrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuYnVmZmVyLnNwbGljZShjb3VudCk7XG4gIH1cbn1cbiIsIi8qKlxuICogQGZpbGUgR2xvYmFsIGNvbnN0YW50cyBhbmQgY29uZmlndXJhdGlvbiBwYXJhbWV0ZXJzLlxuICpcbiAqIEBjb3B5cmlnaHQgMjAxNS0yMDIyIFRpbm9kZSBMTENcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge1xuICB2ZXJzaW9uIGFzIHBhY2thZ2VfdmVyc2lvblxufSBmcm9tICcuLi92ZXJzaW9uLmpzb24nO1xuXG4vLyBHbG9iYWwgY29uc3RhbnRzXG5leHBvcnQgY29uc3QgUFJPVE9DT0xfVkVSU0lPTiA9ICcwJzsgLy8gTWFqb3IgY29tcG9uZW50IG9mIHRoZSB2ZXJzaW9uLCBlLmcuICcwJyBpbiAnMC4xNy4xJy5cbmV4cG9ydCBjb25zdCBWRVJTSU9OID0gcGFja2FnZV92ZXJzaW9uIHx8ICcwLjIwJztcbmV4cG9ydCBjb25zdCBMSUJSQVJZID0gJ3Rpbm9kZWpzLycgKyBWRVJTSU9OO1xuXG4vLyBUb3BpYyBuYW1lIHByZWZpeGVzLlxuZXhwb3J0IGNvbnN0IFRPUElDX05FVyA9ICduZXcnO1xuZXhwb3J0IGNvbnN0IFRPUElDX05FV19DSEFOID0gJ25jaCc7XG5leHBvcnQgY29uc3QgVE9QSUNfTUUgPSAnbWUnO1xuZXhwb3J0IGNvbnN0IFRPUElDX0ZORCA9ICdmbmQnO1xuZXhwb3J0IGNvbnN0IFRPUElDX1NZUyA9ICdzeXMnO1xuZXhwb3J0IGNvbnN0IFRPUElDX0NIQU4gPSAnY2huJztcbmV4cG9ydCBjb25zdCBUT1BJQ19HUlAgPSAnZ3JwOydcbmV4cG9ydCBjb25zdCBUT1BJQ19QMlAgPSAncDJwJztcbmV4cG9ydCBjb25zdCBVU0VSX05FVyA9ICduZXcnO1xuXG4vLyBTdGFydGluZyB2YWx1ZSBvZiBhIGxvY2FsbHktZ2VuZXJhdGVkIHNlcUlkIHVzZWQgZm9yIHBlbmRpbmcgbWVzc2FnZXMuXG5leHBvcnQgY29uc3QgTE9DQUxfU0VRSUQgPSAweEZGRkZGRkY7XG5cbi8vIFN0YXR1cyBjb2Rlcy5cbmV4cG9ydCBjb25zdCBNRVNTQUdFX1NUQVRVU19OT05FID0gMDsgLy8gU3RhdHVzIG5vdCBhc3NpZ25lZC5cbmV4cG9ydCBjb25zdCBNRVNTQUdFX1NUQVRVU19RVUVVRUQgPSAxOyAvLyBMb2NhbCBJRCBhc3NpZ25lZCwgaW4gcHJvZ3Jlc3MgdG8gYmUgc2VudC5cbmV4cG9ydCBjb25zdCBNRVNTQUdFX1NUQVRVU19TRU5ESU5HID0gMjsgLy8gVHJhbnNtaXNzaW9uIHN0YXJ0ZWQuXG5leHBvcnQgY29uc3QgTUVTU0FHRV9TVEFUVVNfRkFJTEVEID0gMzsgLy8gQXQgbGVhc3Qgb25lIGF0dGVtcHQgd2FzIG1hZGUgdG8gc2VuZCB0aGUgbWVzc2FnZS5cbmV4cG9ydCBjb25zdCBNRVNTQUdFX1NUQVRVU19TRU5UID0gNDsgLy8gRGVsaXZlcmVkIHRvIHRoZSBzZXJ2ZXIuXG5leHBvcnQgY29uc3QgTUVTU0FHRV9TVEFUVVNfUkVDRUlWRUQgPSA1OyAvLyBSZWNlaXZlZCBieSB0aGUgY2xpZW50LlxuZXhwb3J0IGNvbnN0IE1FU1NBR0VfU1RBVFVTX1JFQUQgPSA2OyAvLyBSZWFkIGJ5IHRoZSB1c2VyLlxuZXhwb3J0IGNvbnN0IE1FU1NBR0VfU1RBVFVTX1RPX01FID0gNzsgLy8gVGhlIG1lc3NhZ2UgaXMgcmVjZWl2ZWQgZnJvbSBhbm90aGVyIHVzZXIuXG5leHBvcnQgY29uc3QgTUVTU0FHRV9TVEFUVVNfREVMX1JBTkdFID0gODsgLy8gVGhlIG1lc3NhZ2UgcmVwcmVzZW50cyBhIGRlbGV0ZWQgcmFuZ2UuXG5cbi8vIFJlamVjdCB1bnJlc29sdmVkIGZ1dHVyZXMgYWZ0ZXIgdGhpcyBtYW55IG1pbGxpc2Vjb25kcy5cbmV4cG9ydCBjb25zdCBFWFBJUkVfUFJPTUlTRVNfVElNRU9VVCA9IDUwMDA7XG4vLyBQZXJpb2RpY2l0eSBvZiBnYXJiYWdlIGNvbGxlY3Rpb24gb2YgdW5yZXNvbHZlZCBmdXR1cmVzLlxuZXhwb3J0IGNvbnN0IEVYUElSRV9QUk9NSVNFU19QRVJJT0QgPSAxMDAwO1xuXG4vLyBEZWxheSBiZWZvcmUgYWNrbm93bGVkZ2luZyB0aGF0IGEgbWVzc2FnZSB3YXMgcmVjaXZlZC5cbmV4cG9ydCBjb25zdCBSRUNWX1RJTUVPVVQgPSAxMDA7XG5cbi8vIERlZmF1bHQgbnVtYmVyIG9mIG1lc3NhZ2VzIHRvIHB1bGwgaW50byBtZW1vcnkgZnJvbSBwZXJzaXN0ZW50IGNhY2hlLlxuZXhwb3J0IGNvbnN0IERFRkFVTFRfTUVTU0FHRVNfUEFHRSA9IDI0O1xuXG4vLyBVbmljb2RlIERFTCBjaGFyYWN0ZXIgaW5kaWNhdGluZyBkYXRhIHdhcyBkZWxldGVkLlxuZXhwb3J0IGNvbnN0IERFTF9DSEFSID0gJ1xcdTI0MjEnO1xuIiwiLyoqXG4gKiBAZmlsZSBBYnN0cmFjdGlvbiBsYXllciBmb3Igd2Vic29ja2V0IGFuZCBsb25nIHBvbGxpbmcgY29ubmVjdGlvbnMuXG4gKlxuICogQGNvcHlyaWdodCAyMDE1LTIwMjIgVGlub2RlIExMQy5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge1xuICBqc29uUGFyc2VIZWxwZXJcbn0gZnJvbSAnLi91dGlscy5qcyc7XG5cbmxldCBXZWJTb2NrZXRQcm92aWRlcjtcbmxldCBYSFJQcm92aWRlcjtcblxuLy8gRXJyb3IgY29kZSB0byByZXR1cm4gaW4gY2FzZSBvZiBhIG5ldHdvcmsgcHJvYmxlbS5cbmNvbnN0IE5FVFdPUktfRVJST1IgPSA1MDM7XG5jb25zdCBORVRXT1JLX0VSUk9SX1RFWFQgPSBcIkNvbm5lY3Rpb24gZmFpbGVkXCI7XG5cbi8vIEVycm9yIGNvZGUgdG8gcmV0dXJuIHdoZW4gdXNlciBkaXNjb25uZWN0ZWQgZnJvbSBzZXJ2ZXIuXG5jb25zdCBORVRXT1JLX1VTRVIgPSA0MTg7XG5jb25zdCBORVRXT1JLX1VTRVJfVEVYVCA9IFwiRGlzY29ubmVjdGVkIGJ5IGNsaWVudFwiO1xuXG4vLyBTZXR0aW5ncyBmb3IgZXhwb25lbnRpYWwgYmFja29mZlxuY29uc3QgX0JPRkZfQkFTRSA9IDIwMDA7IC8vIDIwMDAgbWlsbGlzZWNvbmRzLCBtaW5pbXVtIGRlbGF5IGJldHdlZW4gcmVjb25uZWN0c1xuY29uc3QgX0JPRkZfTUFYX0lURVIgPSAxMDsgLy8gTWF4aW11bSBkZWxheSBiZXR3ZWVuIHJlY29ubmVjdHMgMl4xMCAqIDIwMDAgfiAzNCBtaW51dGVzXG5jb25zdCBfQk9GRl9KSVRURVIgPSAwLjM7IC8vIEFkZCByYW5kb20gZGVsYXlcblxuLy8gSGVscGVyIGZ1bmN0aW9uIGZvciBjcmVhdGluZyBhbiBlbmRwb2ludCBVUkwuXG5mdW5jdGlvbiBtYWtlQmFzZVVybChob3N0LCBwcm90b2NvbCwgdmVyc2lvbiwgYXBpS2V5KSB7XG4gIGxldCB1cmwgPSBudWxsO1xuXG4gIGlmIChbJ2h0dHAnLCAnaHR0cHMnLCAnd3MnLCAnd3NzJ10uaW5jbHVkZXMocHJvdG9jb2wpKSB7XG4gICAgdXJsID0gYCR7cHJvdG9jb2x9Oi8vJHtob3N0fWA7XG4gICAgaWYgKHVybC5jaGFyQXQodXJsLmxlbmd0aCAtIDEpICE9PSAnLycpIHtcbiAgICAgIHVybCArPSAnLyc7XG4gICAgfVxuICAgIHVybCArPSAndicgKyB2ZXJzaW9uICsgJy9jaGFubmVscyc7XG4gICAgaWYgKFsnaHR0cCcsICdodHRwcyddLmluY2x1ZGVzKHByb3RvY29sKSkge1xuICAgICAgLy8gTG9uZyBwb2xsaW5nIGVuZHBvaW50IGVuZHMgd2l0aCBcImxwXCIsIGkuZS5cbiAgICAgIC8vICcvdjAvY2hhbm5lbHMvbHAnIHZzIGp1c3QgJy92MC9jaGFubmVscycgZm9yIHdzXG4gICAgICB1cmwgKz0gJy9scCc7XG4gICAgfVxuICAgIHVybCArPSAnP2FwaWtleT0nICsgYXBpS2V5O1xuICB9XG4gIHJldHVybiB1cmw7XG59XG5cbi8qKlxuICogQW4gYWJzdHJhY3Rpb24gZm9yIGEgd2Vic29ja2V0IG9yIGEgbG9uZyBwb2xsaW5nIGNvbm5lY3Rpb24uXG4gKlxuICogQGNsYXNzIENvbm5lY3Rpb25cbiAqIEBtZW1iZXJvZiBUaW5vZGVcblxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyAtIGNvbmZpZ3VyYXRpb24gcGFyYW1ldGVycy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBjb25maWcuaG9zdCAtIEhvc3QgbmFtZSBhbmQgb3B0aW9uYWwgcG9ydCBudW1iZXIgdG8gY29ubmVjdCB0by5cbiAqIEBwYXJhbSB7c3RyaW5nfSBjb25maWcuYXBpS2V5IC0gQVBJIGtleSBnZW5lcmF0ZWQgYnkgPGNvZGU+a2V5Z2VuPC9jb2RlPi5cbiAqIEBwYXJhbSB7c3RyaW5nfSBjb25maWcudHJhbnNwb3J0IC0gTmV0d29yayB0cmFuc3BvcnQgdG8gdXNlLCBlaXRoZXIgPGNvZGU+XCJ3c1wiPGNvZGU+Lzxjb2RlPlwid3NzXCI8L2NvZGU+IGZvciB3ZWJzb2NrZXQgb3JcbiAqICAgICAgPGNvZGU+bHA8L2NvZGU+IGZvciBsb25nIHBvbGxpbmcuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGNvbmZpZy5zZWN1cmUgLSBVc2UgU2VjdXJlIFdlYlNvY2tldCBpZiA8Y29kZT50cnVlPC9jb2RlPi5cbiAqIEBwYXJhbSB7c3RyaW5nfSB2ZXJzaW9uXyAtIE1ham9yIHZhbHVlIG9mIHRoZSBwcm90b2NvbCB2ZXJzaW9uLCBlLmcuICcwJyBpbiAnMC4xNy4xJy5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYXV0b3JlY29ubmVjdF8gLSBJZiBjb25uZWN0aW9uIGlzIGxvc3QsIHRyeSB0byByZWNvbm5lY3QgYXV0b21hdGljYWxseS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29ubmVjdGlvbiB7XG4gIC8vIExvZ2dlciwgZG9lcyBub3RoaW5nIGJ5IGRlZmF1bHQuXG4gIHN0YXRpYyAjbG9nID0gXyA9PiB7fTtcblxuICAjYm9mZlRpbWVyID0gbnVsbDtcbiAgI2JvZmZJdGVyYXRpb24gPSAwO1xuICAjYm9mZkNsb3NlZCA9IGZhbHNlOyAvLyBJbmRpY2F0b3IgaWYgdGhlIHNvY2tldCB3YXMgbWFudWFsbHkgY2xvc2VkIC0gZG9uJ3QgYXV0b3JlY29ubmVjdCBpZiB0cnVlLlxuXG4gIC8vIFdlYnNvY2tldC5cbiAgI3NvY2tldCA9IG51bGw7XG5cbiAgaG9zdDtcbiAgc2VjdXJlO1xuICBhcGlLZXk7XG5cbiAgdmVyc2lvbjtcbiAgYXV0b3JlY29ubmVjdDtcblxuICBpbml0aWFsaXplZDtcblxuICAvLyAoY29uZmlnLmhvc3QsIGNvbmZpZy5hcGlLZXksIGNvbmZpZy50cmFuc3BvcnQsIGNvbmZpZy5zZWN1cmUpLCBQUk9UT0NPTF9WRVJTSU9OLCB0cnVlXG4gIGNvbnN0cnVjdG9yKGNvbmZpZywgdmVyc2lvbl8sIGF1dG9yZWNvbm5lY3RfKSB7XG4gICAgdGhpcy5ob3N0ID0gY29uZmlnLmhvc3Q7XG4gICAgdGhpcy5zZWN1cmUgPSBjb25maWcuc2VjdXJlO1xuICAgIHRoaXMuYXBpS2V5ID0gY29uZmlnLmFwaUtleTtcblxuICAgIHRoaXMudmVyc2lvbiA9IHZlcnNpb25fO1xuICAgIHRoaXMuYXV0b3JlY29ubmVjdCA9IGF1dG9yZWNvbm5lY3RfO1xuXG4gICAgaWYgKGNvbmZpZy50cmFuc3BvcnQgPT09ICdscCcpIHtcbiAgICAgIC8vIGV4cGxpY2l0IHJlcXVlc3QgdG8gdXNlIGxvbmcgcG9sbGluZ1xuICAgICAgdGhpcy4jaW5pdF9scCgpO1xuICAgICAgdGhpcy5pbml0aWFsaXplZCA9ICdscCc7XG4gICAgfSBlbHNlIGlmIChjb25maWcudHJhbnNwb3J0ID09PSAnd3MnKSB7XG4gICAgICAvLyBleHBsaWNpdCByZXF1ZXN0IHRvIHVzZSB3ZWIgc29ja2V0XG4gICAgICAvLyBpZiB3ZWJzb2NrZXRzIGFyZSBub3QgYXZhaWxhYmxlLCBob3JyaWJsZSB0aGluZ3Mgd2lsbCBoYXBwZW5cbiAgICAgIHRoaXMuI2luaXRfd3MoKTtcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSAnd3MnO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5pbml0aWFsaXplZCkge1xuICAgICAgLy8gSW52YWxpZCBvciB1bmRlZmluZWQgbmV0d29yayB0cmFuc3BvcnQuXG4gICAgICBDb25uZWN0aW9uLiNsb2coXCJVbmtub3duIG9yIGludmFsaWQgbmV0d29yayB0cmFuc3BvcnQuIFJ1bm5pbmcgdW5kZXIgTm9kZT8gQ2FsbCAnVGlub2RlLnNldE5ldHdvcmtQcm92aWRlcnMoKScuXCIpO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biBvciBpbnZhbGlkIG5ldHdvcmsgdHJhbnNwb3J0LiBSdW5uaW5nIHVuZGVyIE5vZGU/IENhbGwgJ1Rpbm9kZS5zZXROZXR3b3JrUHJvdmlkZXJzKCknLlwiKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVG8gdXNlIENvbm5lY3Rpb24gaW4gYSBub24gYnJvd3NlciBjb250ZXh0LCBzdXBwbHkgV2ViU29ja2V0IGFuZCBYTUxIdHRwUmVxdWVzdCBwcm92aWRlcnMuXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlcm9mIENvbm5lY3Rpb25cbiAgICogQHBhcmFtIHdzUHJvdmlkZXIgV2ViU29ja2V0IHByb3ZpZGVyLCBlLmcuIGZvciBub2RlSlMgLCA8Y29kZT5yZXF1aXJlKCd3cycpPC9jb2RlPi5cbiAgICogQHBhcmFtIHhoclByb3ZpZGVyIFhNTEh0dHBSZXF1ZXN0IHByb3ZpZGVyLCBlLmcuIGZvciBub2RlIDxjb2RlPnJlcXVpcmUoJ3hocicpPC9jb2RlPi5cbiAgICovXG4gIHN0YXRpYyBzZXROZXR3b3JrUHJvdmlkZXJzKHdzUHJvdmlkZXIsIHhoclByb3ZpZGVyKSB7XG4gICAgV2ViU29ja2V0UHJvdmlkZXIgPSB3c1Byb3ZpZGVyO1xuICAgIFhIUlByb3ZpZGVyID0geGhyUHJvdmlkZXI7XG4gIH1cblxuICAvKipcbiAgICogQXNzaWduIGEgbm9uLWRlZmF1bHQgbG9nZ2VyLlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJvZiBDb25uZWN0aW9uXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGwgdmFyaWFkaWMgbG9nZ2luZyBmdW5jdGlvbi5cbiAgICovXG4gIHN0YXRpYyBzZXQgbG9nZ2VyKGwpIHtcbiAgICBDb25uZWN0aW9uLiNsb2cgPSBsO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYXRlIGEgbmV3IGNvbm5lY3Rpb25cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uI1xuICAgKiBAcGFyYW0ge3N0cmluZ30gaG9zdF8gSG9zdCBuYW1lIHRvIGNvbm5lY3QgdG87IGlmIDxjb2RlPm51bGw8L2NvZGU+IHRoZSBvbGQgaG9zdCBuYW1lIHdpbGwgYmUgdXNlZC5cbiAgICogQHBhcmFtIHtib29sZWFufSBmb3JjZSBGb3JjZSBuZXcgY29ubmVjdGlvbiBldmVuIGlmIG9uZSBhbHJlYWR5IGV4aXN0cy5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gUHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBjb25uZWN0aW9uIGNhbGwgY29tcGxldGVzLCByZXNvbHV0aW9uIGlzIGNhbGxlZCB3aXRob3V0XG4gICAqICBwYXJhbWV0ZXJzLCByZWplY3Rpb24gcGFzc2VzIHRoZSB7RXJyb3J9IGFzIHBhcmFtZXRlci5cbiAgICovXG4gIGNvbm5lY3QoaG9zdF8sIGZvcmNlKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG51bGwpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyeSB0byByZXN0b3JlIGEgbmV0d29yayBjb25uZWN0aW9uLCBhbHNvIHJlc2V0IGJhY2tvZmYuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ29ubmVjdGlvbiNcbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBmb3JjZSAtIHJlY29ubmVjdCBldmVuIGlmIHRoZXJlIGlzIGEgbGl2ZSBjb25uZWN0aW9uIGFscmVhZHkuXG4gICAqL1xuICByZWNvbm5lY3QoZm9yY2UpIHt9XG5cbiAgLyoqXG4gICAqIFRlcm1pbmF0ZSB0aGUgbmV0d29yayBjb25uZWN0aW9uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ29ubmVjdGlvbiNcbiAgICovXG4gIGRpc2Nvbm5lY3QoKSB7fVxuXG4gIC8qKlxuICAgKiBTZW5kIGEgc3RyaW5nIHRvIHRoZSBzZXJ2ZXIuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ29ubmVjdGlvbiNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1zZyAtIFN0cmluZyB0byBzZW5kLlxuICAgKiBAdGhyb3dzIFRocm93cyBhbiBleGNlcHRpb24gaWYgdGhlIHVuZGVybHlpbmcgY29ubmVjdGlvbiBpcyBub3QgbGl2ZS5cbiAgICovXG4gIHNlbmRUZXh0KG1zZykge31cblxuICAvKipcbiAgICogQ2hlY2sgaWYgY29ubmVjdGlvbiBpcyBhbGl2ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uI1xuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgY29ubmVjdGlvbiBpcyBsaXZlLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNDb25uZWN0ZWQoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgbmFtZSBvZiB0aGUgY3VycmVudCBuZXR3b3JrIHRyYW5zcG9ydC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uI1xuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBuYW1lIG9mIHRoZSB0cmFuc3BvcnQgc3VjaCBhcyA8Y29kZT5cIndzXCI8L2NvZGU+IG9yIDxjb2RlPlwibHBcIjwvY29kZT4uXG4gICAqL1xuICB0cmFuc3BvcnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5pdGlhbGl6ZWQ7XG4gIH1cblxuICAvKipcbiAgICogU2VuZCBuZXR3b3JrIHByb2JlIHRvIGNoZWNrIGlmIGNvbm5lY3Rpb24gaXMgaW5kZWVkIGxpdmUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ29ubmVjdGlvbiNcbiAgICovXG4gIHByb2JlKCkge1xuICAgIHRoaXMuc2VuZFRleHQoJzEnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldCBhdXRvcmVjb25uZWN0IGNvdW50ZXIgdG8gemVyby5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uI1xuICAgKi9cbiAgYmFja29mZlJlc2V0KCkge1xuICAgIHRoaXMuI2JvZmZSZXNldCgpO1xuICB9XG5cbiAgLy8gQmFja29mZiBpbXBsZW1lbnRhdGlvbiAtIHJlY29ubmVjdCBhZnRlciBhIHRpbWVvdXQuXG4gICNib2ZmUmVjb25uZWN0KCkge1xuICAgIC8vIENsZWFyIHRpbWVyXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuI2JvZmZUaW1lcik7XG4gICAgLy8gQ2FsY3VsYXRlIHdoZW4gdG8gZmlyZSB0aGUgcmVjb25uZWN0IGF0dGVtcHRcbiAgICBjb25zdCB0aW1lb3V0ID0gX0JPRkZfQkFTRSAqIChNYXRoLnBvdygyLCB0aGlzLiNib2ZmSXRlcmF0aW9uKSAqICgxLjAgKyBfQk9GRl9KSVRURVIgKiBNYXRoLnJhbmRvbSgpKSk7XG4gICAgLy8gVXBkYXRlIGl0ZXJhdGlvbiBjb3VudGVyIGZvciBmdXR1cmUgdXNlXG4gICAgdGhpcy4jYm9mZkl0ZXJhdGlvbiA9ICh0aGlzLiNib2ZmSXRlcmF0aW9uID49IF9CT0ZGX01BWF9JVEVSID8gdGhpcy4jYm9mZkl0ZXJhdGlvbiA6IHRoaXMuI2JvZmZJdGVyYXRpb24gKyAxKTtcbiAgICBpZiAodGhpcy5vbkF1dG9yZWNvbm5lY3RJdGVyYXRpb24pIHtcbiAgICAgIHRoaXMub25BdXRvcmVjb25uZWN0SXRlcmF0aW9uKHRpbWVvdXQpO1xuICAgIH1cblxuICAgIHRoaXMuI2JvZmZUaW1lciA9IHNldFRpbWVvdXQoXyA9PiB7XG4gICAgICBDb25uZWN0aW9uLiNsb2coYFJlY29ubmVjdGluZywgaXRlcj0ke3RoaXMuI2JvZmZJdGVyYXRpb259LCB0aW1lb3V0PSR7dGltZW91dH1gKTtcbiAgICAgIC8vIE1heWJlIHRoZSBzb2NrZXQgd2FzIGNsb3NlZCB3aGlsZSB3ZSB3YWl0ZWQgZm9yIHRoZSB0aW1lcj9cbiAgICAgIGlmICghdGhpcy4jYm9mZkNsb3NlZCkge1xuICAgICAgICBjb25zdCBwcm9tID0gdGhpcy5jb25uZWN0KCk7XG4gICAgICAgIGlmICh0aGlzLm9uQXV0b3JlY29ubmVjdEl0ZXJhdGlvbikge1xuICAgICAgICAgIHRoaXMub25BdXRvcmVjb25uZWN0SXRlcmF0aW9uKDAsIHByb20pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIFN1cHByZXNzIGVycm9yIGlmIGl0J3Mgbm90IHVzZWQuXG4gICAgICAgICAgcHJvbS5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAvKiBkbyBub3RoaW5nICovXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5vbkF1dG9yZWNvbm5lY3RJdGVyYXRpb24pIHtcbiAgICAgICAgdGhpcy5vbkF1dG9yZWNvbm5lY3RJdGVyYXRpb24oLTEpO1xuICAgICAgfVxuICAgIH0sIHRpbWVvdXQpO1xuICB9XG5cbiAgLy8gVGVybWluYXRlIGF1dG8tcmVjb25uZWN0IHByb2Nlc3MuXG4gICNib2ZmU3RvcCgpIHtcbiAgICBjbGVhclRpbWVvdXQodGhpcy4jYm9mZlRpbWVyKTtcbiAgICB0aGlzLiNib2ZmVGltZXIgPSBudWxsO1xuICB9XG5cbiAgLy8gUmVzZXQgYXV0by1yZWNvbm5lY3QgaXRlcmF0aW9uIGNvdW50ZXIuXG4gICNib2ZmUmVzZXQoKSB7XG4gICAgdGhpcy4jYm9mZkl0ZXJhdGlvbiA9IDA7XG4gIH1cblxuICAvLyBJbml0aWFsaXphdGlvbiBmb3IgbG9uZyBwb2xsaW5nLlxuICAjaW5pdF9scCgpIHtcbiAgICBjb25zdCBYRFJfVU5TRU5UID0gMDsgLy8gQ2xpZW50IGhhcyBiZWVuIGNyZWF0ZWQuIG9wZW4oKSBub3QgY2FsbGVkIHlldC5cbiAgICBjb25zdCBYRFJfT1BFTkVEID0gMTsgLy8gb3BlbigpIGhhcyBiZWVuIGNhbGxlZC5cbiAgICBjb25zdCBYRFJfSEVBREVSU19SRUNFSVZFRCA9IDI7IC8vIHNlbmQoKSBoYXMgYmVlbiBjYWxsZWQsIGFuZCBoZWFkZXJzIGFuZCBzdGF0dXMgYXJlIGF2YWlsYWJsZS5cbiAgICBjb25zdCBYRFJfTE9BRElORyA9IDM7IC8vIERvd25sb2FkaW5nOyByZXNwb25zZVRleHQgaG9sZHMgcGFydGlhbCBkYXRhLlxuICAgIGNvbnN0IFhEUl9ET05FID0gNDsgLy8gVGhlIG9wZXJhdGlvbiBpcyBjb21wbGV0ZS5cblxuICAgIC8vIEZ1bGx5IGNvbXBvc2VkIGVuZHBvaW50IFVSTCwgd2l0aCBBUEkga2V5ICYgU0lEXG4gICAgbGV0IF9scFVSTCA9IG51bGw7XG5cbiAgICBsZXQgX3BvbGxlciA9IG51bGw7XG4gICAgbGV0IF9zZW5kZXIgPSBudWxsO1xuXG4gICAgbGV0IGxwX3NlbmRlciA9ICh1cmxfKSA9PiB7XG4gICAgICBjb25zdCBzZW5kZXIgPSBuZXcgWEhSUHJvdmlkZXIoKTtcbiAgICAgIHNlbmRlci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoZXZ0KSA9PiB7XG4gICAgICAgIGlmIChzZW5kZXIucmVhZHlTdGF0ZSA9PSBYRFJfRE9ORSAmJiBzZW5kZXIuc3RhdHVzID49IDQwMCkge1xuICAgICAgICAgIC8vIFNvbWUgc29ydCBvZiBlcnJvciByZXNwb25zZVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgTFAgc2VuZGVyIGZhaWxlZCwgJHtzZW5kZXIuc3RhdHVzfWApO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBzZW5kZXIub3BlbignUE9TVCcsIHVybF8sIHRydWUpO1xuICAgICAgcmV0dXJuIHNlbmRlcjtcbiAgICB9XG5cbiAgICBsZXQgbHBfcG9sbGVyID0gKHVybF8sIHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgbGV0IHBvbGxlciA9IG5ldyBYSFJQcm92aWRlcigpO1xuICAgICAgbGV0IHByb21pc2VDb21wbGV0ZWQgPSBmYWxzZTtcblxuICAgICAgcG9sbGVyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IChldnQpID0+IHtcbiAgICAgICAgaWYgKHBvbGxlci5yZWFkeVN0YXRlID09IFhEUl9ET05FKSB7XG4gICAgICAgICAgaWYgKHBvbGxlci5zdGF0dXMgPT0gMjAxKSB7IC8vIDIwMSA9PSBIVFRQLkNyZWF0ZWQsIGdldCBTSURcbiAgICAgICAgICAgIGxldCBwa3QgPSBKU09OLnBhcnNlKHBvbGxlci5yZXNwb25zZVRleHQsIGpzb25QYXJzZUhlbHBlcik7XG4gICAgICAgICAgICBfbHBVUkwgPSB1cmxfICsgJyZzaWQ9JyArIHBrdC5jdHJsLnBhcmFtcy5zaWQ7XG4gICAgICAgICAgICBwb2xsZXIgPSBscF9wb2xsZXIoX2xwVVJMKTtcbiAgICAgICAgICAgIHBvbGxlci5zZW5kKG51bGwpO1xuICAgICAgICAgICAgaWYgKHRoaXMub25PcGVuKSB7XG4gICAgICAgICAgICAgIHRoaXMub25PcGVuKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChyZXNvbHZlKSB7XG4gICAgICAgICAgICAgIHByb21pc2VDb21wbGV0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmF1dG9yZWNvbm5lY3QpIHtcbiAgICAgICAgICAgICAgdGhpcy4jYm9mZlN0b3AoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKHBvbGxlci5zdGF0dXMgPCA0MDApIHsgLy8gNDAwID0gSFRUUC5CYWRSZXF1ZXN0XG4gICAgICAgICAgICBpZiAodGhpcy5vbk1lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgdGhpcy5vbk1lc3NhZ2UocG9sbGVyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwb2xsZXIgPSBscF9wb2xsZXIoX2xwVVJMKTtcbiAgICAgICAgICAgIHBvbGxlci5zZW5kKG51bGwpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBEb24ndCB0aHJvdyBhbiBlcnJvciBoZXJlLCBncmFjZWZ1bGx5IGhhbmRsZSBzZXJ2ZXIgZXJyb3JzXG4gICAgICAgICAgICBpZiAocmVqZWN0ICYmICFwcm9taXNlQ29tcGxldGVkKSB7XG4gICAgICAgICAgICAgIHByb21pc2VDb21wbGV0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICByZWplY3QocG9sbGVyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5vbk1lc3NhZ2UgJiYgcG9sbGVyLnJlc3BvbnNlVGV4dCkge1xuICAgICAgICAgICAgICB0aGlzLm9uTWVzc2FnZShwb2xsZXIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLm9uRGlzY29ubmVjdCkge1xuICAgICAgICAgICAgICBjb25zdCBjb2RlID0gcG9sbGVyLnN0YXR1cyB8fCAodGhpcy4jYm9mZkNsb3NlZCA/IE5FVFdPUktfVVNFUiA6IE5FVFdPUktfRVJST1IpO1xuICAgICAgICAgICAgICBjb25zdCB0ZXh0ID0gcG9sbGVyLnJlc3BvbnNlVGV4dCB8fCAodGhpcy4jYm9mZkNsb3NlZCA/IE5FVFdPUktfVVNFUl9URVhUIDogTkVUV09SS19FUlJPUl9URVhUKTtcbiAgICAgICAgICAgICAgdGhpcy5vbkRpc2Nvbm5lY3QobmV3IEVycm9yKHRleHQgKyAnICgnICsgY29kZSArICcpJyksIGNvZGUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBQb2xsaW5nIGhhcyBzdG9wcGVkLiBJbmRpY2F0ZSBpdCBieSBzZXR0aW5nIHBvbGxlciB0byBudWxsLlxuICAgICAgICAgICAgcG9sbGVyID0gbnVsbDtcbiAgICAgICAgICAgIGlmICghdGhpcy4jYm9mZkNsb3NlZCAmJiB0aGlzLmF1dG9yZWNvbm5lY3QpIHtcbiAgICAgICAgICAgICAgdGhpcy4jYm9mZlJlY29ubmVjdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIC8vIFVzaW5nIFBPU1QgdG8gYXZvaWQgY2FjaGluZyByZXNwb25zZSBieSBzZXJ2aWNlIHdvcmtlci5cbiAgICAgIHBvbGxlci5vcGVuKCdQT1NUJywgdXJsXywgdHJ1ZSk7XG4gICAgICByZXR1cm4gcG9sbGVyO1xuICAgIH1cblxuICAgIHRoaXMuY29ubmVjdCA9IChob3N0XywgZm9yY2UpID0+IHtcbiAgICAgIHRoaXMuI2JvZmZDbG9zZWQgPSBmYWxzZTtcblxuICAgICAgaWYgKF9wb2xsZXIpIHtcbiAgICAgICAgaWYgKCFmb3JjZSkge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgICAgICBfcG9sbGVyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgX3BvbGxlci5hYm9ydCgpO1xuICAgICAgICBfcG9sbGVyID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgaWYgKGhvc3RfKSB7XG4gICAgICAgIHRoaXMuaG9zdCA9IGhvc3RfO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBjb25zdCB1cmwgPSBtYWtlQmFzZVVybCh0aGlzLmhvc3QsIHRoaXMuc2VjdXJlID8gJ2h0dHBzJyA6ICdodHRwJywgdGhpcy52ZXJzaW9uLCB0aGlzLmFwaUtleSk7XG4gICAgICAgIENvbm5lY3Rpb24uI2xvZyhcIkxQIGNvbm5lY3RpbmcgdG86XCIsIHVybCk7XG4gICAgICAgIF9wb2xsZXIgPSBscF9wb2xsZXIodXJsLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICBfcG9sbGVyLnNlbmQobnVsbCk7XG4gICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgIENvbm5lY3Rpb24uI2xvZyhcIkxQIGNvbm5lY3Rpb24gZmFpbGVkOlwiLCBlcnIpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIHRoaXMucmVjb25uZWN0ID0gKGZvcmNlKSA9PiB7XG4gICAgICB0aGlzLiNib2ZmU3RvcCgpO1xuICAgICAgdGhpcy5jb25uZWN0KG51bGwsIGZvcmNlKTtcbiAgICB9O1xuXG4gICAgdGhpcy5kaXNjb25uZWN0ID0gKCkgPT4ge1xuICAgICAgdGhpcy4jYm9mZkNsb3NlZCA9IHRydWU7XG4gICAgICB0aGlzLiNib2ZmU3RvcCgpO1xuXG4gICAgICBpZiAoX3NlbmRlcikge1xuICAgICAgICBfc2VuZGVyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgX3NlbmRlci5hYm9ydCgpO1xuICAgICAgICBfc2VuZGVyID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIGlmIChfcG9sbGVyKSB7XG4gICAgICAgIF9wb2xsZXIub25yZWFkeXN0YXRlY2hhbmdlID0gdW5kZWZpbmVkO1xuICAgICAgICBfcG9sbGVyLmFib3J0KCk7XG4gICAgICAgIF9wb2xsZXIgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5vbkRpc2Nvbm5lY3QpIHtcbiAgICAgICAgdGhpcy5vbkRpc2Nvbm5lY3QobmV3IEVycm9yKE5FVFdPUktfVVNFUl9URVhUICsgJyAoJyArIE5FVFdPUktfVVNFUiArICcpJyksIE5FVFdPUktfVVNFUik7XG4gICAgICB9XG4gICAgICAvLyBFbnN1cmUgaXQncyByZWNvbnN0cnVjdGVkXG4gICAgICBfbHBVUkwgPSBudWxsO1xuICAgIH07XG5cbiAgICB0aGlzLnNlbmRUZXh0ID0gKG1zZykgPT4ge1xuICAgICAgX3NlbmRlciA9IGxwX3NlbmRlcihfbHBVUkwpO1xuICAgICAgaWYgKF9zZW5kZXIgJiYgKF9zZW5kZXIucmVhZHlTdGF0ZSA9PSBYRFJfT1BFTkVEKSkgeyAvLyAxID09IE9QRU5FRFxuICAgICAgICBfc2VuZGVyLnNlbmQobXNnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkxvbmcgcG9sbGVyIGZhaWxlZCB0byBjb25uZWN0XCIpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLmlzQ29ubmVjdGVkID0gKCkgPT4ge1xuICAgICAgcmV0dXJuIChfcG9sbGVyICYmIHRydWUpO1xuICAgIH07XG4gIH1cblxuICAvLyBJbml0aWFsaXphdGlvbiBmb3IgV2Vic29ja2V0XG4gICNpbml0X3dzKCkge1xuICAgIHRoaXMuY29ubmVjdCA9IChob3N0XywgZm9yY2UpID0+IHtcbiAgICAgIHRoaXMuI2JvZmZDbG9zZWQgPSBmYWxzZTtcblxuICAgICAgaWYgKHRoaXMuI3NvY2tldCkge1xuICAgICAgICBpZiAoIWZvcmNlICYmIHRoaXMuI3NvY2tldC5yZWFkeVN0YXRlID09IHRoaXMuI3NvY2tldC5PUEVOKSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuI3NvY2tldC5jbG9zZSgpO1xuICAgICAgICB0aGlzLiNzb2NrZXQgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBpZiAoaG9zdF8pIHtcbiAgICAgICAgdGhpcy5ob3N0ID0gaG9zdF87XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGNvbnN0IHVybCA9IG1ha2VCYXNlVXJsKHRoaXMuaG9zdCwgdGhpcy5zZWN1cmUgPyAnd3NzJyA6ICd3cycsIHRoaXMudmVyc2lvbiwgdGhpcy5hcGlLZXkpO1xuXG4gICAgICAgIENvbm5lY3Rpb24uI2xvZyhcIldTIGNvbm5lY3RpbmcgdG86IFwiLCB1cmwpO1xuXG4gICAgICAgIC8vIEl0IHRocm93cyB3aGVuIHRoZSBzZXJ2ZXIgaXMgbm90IGFjY2Vzc2libGUgYnV0IHRoZSBleGNlcHRpb24gY2Fubm90IGJlIGNhdWdodDpcbiAgICAgICAgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzEwMDI1OTIvamF2YXNjcmlwdC1kb2VzbnQtY2F0Y2gtZXJyb3ItaW4td2Vic29ja2V0LWluc3RhbnRpYXRpb24vMzEwMDMwNTdcbiAgICAgICAgY29uc3QgY29ubiA9IG5ldyBXZWJTb2NrZXRQcm92aWRlcih1cmwpO1xuXG4gICAgICAgIGNvbm4ub25lcnJvciA9IChlcnIpID0+IHtcbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25uLm9ub3BlbiA9IChldnQpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5hdXRvcmVjb25uZWN0KSB7XG4gICAgICAgICAgICB0aGlzLiNib2ZmU3RvcCgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh0aGlzLm9uT3Blbikge1xuICAgICAgICAgICAgdGhpcy5vbk9wZW4oKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29ubi5vbmNsb3NlID0gKGV2dCkgPT4ge1xuICAgICAgICAgIHRoaXMuI3NvY2tldCA9IG51bGw7XG5cbiAgICAgICAgICBpZiAodGhpcy5vbkRpc2Nvbm5lY3QpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvZGUgPSB0aGlzLiNib2ZmQ2xvc2VkID8gTkVUV09SS19VU0VSIDogTkVUV09SS19FUlJPUjtcbiAgICAgICAgICAgIHRoaXMub25EaXNjb25uZWN0KG5ldyBFcnJvcih0aGlzLiNib2ZmQ2xvc2VkID8gTkVUV09SS19VU0VSX1RFWFQgOiBORVRXT1JLX0VSUk9SX1RFWFQgK1xuICAgICAgICAgICAgICAnICgnICsgY29kZSArICcpJyksIGNvZGUpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghdGhpcy4jYm9mZkNsb3NlZCAmJiB0aGlzLmF1dG9yZWNvbm5lY3QpIHtcbiAgICAgICAgICAgIHRoaXMuI2JvZmZSZWNvbm5lY3QoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgY29ubi5vbm1lc3NhZ2UgPSAoZXZ0KSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMub25NZXNzYWdlKSB7XG4gICAgICAgICAgICB0aGlzLm9uTWVzc2FnZShldnQuZGF0YSk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuI3NvY2tldCA9IGNvbm47XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLnJlY29ubmVjdCA9IChmb3JjZSkgPT4ge1xuICAgICAgdGhpcy4jYm9mZlN0b3AoKTtcbiAgICAgIHRoaXMuY29ubmVjdChudWxsLCBmb3JjZSk7XG4gICAgfTtcblxuICAgIHRoaXMuZGlzY29ubmVjdCA9ICgpID0+IHtcbiAgICAgIHRoaXMuI2JvZmZDbG9zZWQgPSB0cnVlO1xuICAgICAgdGhpcy4jYm9mZlN0b3AoKTtcblxuICAgICAgaWYgKCF0aGlzLiNzb2NrZXQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy4jc29ja2V0LmNsb3NlKCk7XG4gICAgICB0aGlzLiNzb2NrZXQgPSBudWxsO1xuICAgIH07XG5cbiAgICB0aGlzLnNlbmRUZXh0ID0gKG1zZykgPT4ge1xuICAgICAgaWYgKHRoaXMuI3NvY2tldCAmJiAodGhpcy4jc29ja2V0LnJlYWR5U3RhdGUgPT0gdGhpcy4jc29ja2V0Lk9QRU4pKSB7XG4gICAgICAgIHRoaXMuI3NvY2tldC5zZW5kKG1zZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJXZWJzb2NrZXQgaXMgbm90IGNvbm5lY3RlZFwiKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5pc0Nvbm5lY3RlZCA9ICgpID0+IHtcbiAgICAgIHJldHVybiAodGhpcy4jc29ja2V0ICYmICh0aGlzLiNzb2NrZXQucmVhZHlTdGF0ZSA9PSB0aGlzLiNzb2NrZXQuT1BFTikpO1xuICAgIH07XG4gIH1cblxuICAvLyBDYWxsYmFja3M6XG5cbiAgLyoqXG4gICAqIEEgY2FsbGJhY2sgdG8gcGFzcyBpbmNvbWluZyBtZXNzYWdlcyB0by4gU2VlIHtAbGluayBUaW5vZGUuQ29ubmVjdGlvbiNvbk1lc3NhZ2V9LlxuICAgKiBAY2FsbGJhY2sgVGlub2RlLkNvbm5lY3Rpb24uT25NZXNzYWdlXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ29ubmVjdGlvblxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSAtIE1lc3NhZ2UgdG8gcHJvY2Vzcy5cbiAgICovXG4gIG9uTWVzc2FnZSA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQSBjYWxsYmFjayBmb3IgcmVwb3J0aW5nIGEgZHJvcHBlZCBjb25uZWN0aW9uLlxuICAgKiBAdHlwZSB7ZnVuY3Rpb259XG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ29ubmVjdGlvbiNcbiAgICovXG4gIG9uRGlzY29ubmVjdCA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQSBjYWxsYmFjayBjYWxsZWQgd2hlbiB0aGUgY29ubmVjdGlvbiBpcyByZWFkeSB0byBiZSB1c2VkIGZvciBzZW5kaW5nLiBGb3Igd2Vic29ja2V0cyBpdCdzIHNvY2tldCBvcGVuLFxuICAgKiBmb3IgbG9uZyBwb2xsaW5nIGl0J3MgPGNvZGU+cmVhZHlTdGF0ZT0xPC9jb2RlPiAoT1BFTkVEKVxuICAgKiBAdHlwZSB7ZnVuY3Rpb259XG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ29ubmVjdGlvbiNcbiAgICovXG4gIG9uT3BlbiA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQSBjYWxsYmFjayB0byBub3RpZnkgb2YgcmVjb25uZWN0aW9uIGF0dGVtcHRzLiBTZWUge0BsaW5rIFRpbm9kZS5Db25uZWN0aW9uI29uQXV0b3JlY29ubmVjdEl0ZXJhdGlvbn0uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ29ubmVjdGlvblxuICAgKiBAY2FsbGJhY2sgQXV0b3JlY29ubmVjdEl0ZXJhdGlvblR5cGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRpbWVvdXQgLSB0aW1lIHRpbGwgdGhlIG5leHQgcmVjb25uZWN0IGF0dGVtcHQgaW4gbWlsbGlzZWNvbmRzLiA8Y29kZT4tMTwvY29kZT4gbWVhbnMgcmVjb25uZWN0IHdhcyBza2lwcGVkLlxuICAgKiBAcGFyYW0ge1Byb21pc2V9IHByb21pc2UgcmVzb2x2ZWQgb3IgcmVqZWN0ZWQgd2hlbiB0aGUgcmVjb25uZWN0IGF0dGVtcCBjb21wbGV0ZXMuXG4gICAqXG4gICAqL1xuICAvKipcbiAgICogQSBjYWxsYmFjayB0byBpbmZvcm0gd2hlbiB0aGUgbmV4dCBhdHRhbXB0IHRvIHJlY29ubmVjdCB3aWxsIGhhcHBlbiBhbmQgdG8gcmVjZWl2ZSBjb25uZWN0aW9uIHByb21pc2UuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ29ubmVjdGlvbiNcbiAgICogQHR5cGUge1Rpbm9kZS5Db25uZWN0aW9uLkF1dG9yZWNvbm5lY3RJdGVyYXRpb25UeXBlfVxuICAgKi9cbiAgb25BdXRvcmVjb25uZWN0SXRlcmF0aW9uID0gdW5kZWZpbmVkO1xufVxuXG5Db25uZWN0aW9uLk5FVFdPUktfRVJST1IgPSBORVRXT1JLX0VSUk9SO1xuQ29ubmVjdGlvbi5ORVRXT1JLX0VSUk9SX1RFWFQgPSBORVRXT1JLX0VSUk9SX1RFWFQ7XG5Db25uZWN0aW9uLk5FVFdPUktfVVNFUiA9IE5FVFdPUktfVVNFUjtcbkNvbm5lY3Rpb24uTkVUV09SS19VU0VSX1RFWFQgPSBORVRXT1JLX1VTRVJfVEVYVDtcbiIsIi8qKlxuICogQGZpbGUgSGVscGVyIG1ldGhvZHMgZm9yIGRlYWxpbmcgd2l0aCBJbmRleGVkREIgY2FjaGUgb2YgbWVzc2FnZXMsIHVzZXJzLCBhbmQgdG9waWNzLlxuICpcbiAqIEBjb3B5cmlnaHQgMjAxNS0yMDIyIFRpbm9kZSBMTEMuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuLy8gTk9URSBUTyBERVZFTE9QRVJTOlxuLy8gTG9jYWxpemFibGUgc3RyaW5ncyBzaG91bGQgYmUgZG91YmxlIHF1b3RlZCBcItGB0YLRgNC+0LrQsCDQvdCwINC00YDRg9Cz0L7QvCDRj9C30YvQutC1XCIsXG4vLyBub24tbG9jYWxpemFibGUgc3RyaW5ncyBzaG91bGQgYmUgc2luZ2xlIHF1b3RlZCAnbm9uLWxvY2FsaXplZCcuXG5cbmNvbnN0IERCX1ZFUlNJT04gPSAxO1xuY29uc3QgREJfTkFNRSA9ICd0aW5vZGUtd2ViJztcblxubGV0IElEQlByb3ZpZGVyO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEQiB7XG4gICNvbkVycm9yID0gXyA9PiB7fTtcbiAgI2xvZ2dlciA9IF8gPT4ge307XG5cbiAgLy8gSW5zdGFuY2Ugb2YgSW5kZXhEQi5cbiAgZGIgPSBudWxsO1xuICAvLyBJbmRpY2F0b3IgdGhhdCB0aGUgY2FjaGUgaXMgZGlzYWJsZWQuXG4gIGRpc2FibGVkID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3Iob25FcnJvciwgbG9nZ2VyKSB7XG4gICAgdGhpcy4jb25FcnJvciA9IG9uRXJyb3IgfHwgdGhpcy4jb25FcnJvcjtcbiAgICB0aGlzLiNsb2dnZXIgPSBsb2dnZXIgfHwgdGhpcy4jbG9nZ2VyO1xuICB9XG5cbiAgI21hcE9iamVjdHMoc291cmNlLCBjYWxsYmFjaywgY29udGV4dCkge1xuICAgIGlmICghdGhpcy5kYikge1xuICAgICAgcmV0dXJuIGRpc2FibGVkID9cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKFtdKSA6XG4gICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIm5vdCBpbml0aWFsaXplZFwiKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHRyeCA9IHRoaXMuZGIudHJhbnNhY3Rpb24oW3NvdXJjZV0pO1xuICAgICAgdHJ4Lm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCAnbWFwT2JqZWN0cycsIHNvdXJjZSwgZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9iamVjdFN0b3JlKHNvdXJjZSkuZ2V0QWxsKCkub25zdWNjZXNzID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgIGV2ZW50LnRhcmdldC5yZXN1bHQuZm9yRWFjaCgodG9waWMpID0+IHtcbiAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgdG9waWMpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJlc29sdmUoZXZlbnQudGFyZ2V0LnJlc3VsdCk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgcGVyc2lzdGVudCBjYWNoZTogb3BlbiBvciBjcmVhdGUvdXBncmFkZSBpZiBuZWVkZWQuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBwcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIERCIGlzIGluaXRpYWxpemVkLlxuICAgKi9cbiAgaW5pdERhdGFiYXNlKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAvLyBPcGVuIHRoZSBkYXRhYmFzZSBhbmQgaW5pdGlhbGl6ZSBjYWxsYmFja3MuXG4gICAgICBjb25zdCByZXEgPSBJREJQcm92aWRlci5vcGVuKERCX05BTUUsIERCX1ZFUlNJT04pO1xuICAgICAgcmVxLm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLmRiID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcbiAgICAgICAgdGhpcy5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICByZXNvbHZlKHRoaXMuZGIpO1xuICAgICAgfTtcbiAgICAgIHJlcS5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgXCJmYWlsZWQgdG8gaW5pdGlhbGl6ZVwiLCBldmVudCk7XG4gICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICB0aGlzLiNvbkVycm9yKGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICB9O1xuICAgICAgcmVxLm9udXBncmFkZW5lZWRlZCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuZGIgPSBldmVudC50YXJnZXQucmVzdWx0O1xuXG4gICAgICAgIHRoaXMuZGIub25lcnJvciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCBcImZhaWxlZCB0byBjcmVhdGUgc3RvcmFnZVwiLCBldmVudCk7XG4gICAgICAgICAgdGhpcy4jb25FcnJvcihldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIEluZGl2aWR1YWwgb2JqZWN0IHN0b3Jlcy5cbiAgICAgICAgLy8gT2JqZWN0IHN0b3JlICh0YWJsZSkgZm9yIHRvcGljcy4gVGhlIHByaW1hcnkga2V5IGlzIHRvcGljIG5hbWUuXG4gICAgICAgIHRoaXMuZGIuY3JlYXRlT2JqZWN0U3RvcmUoJ3RvcGljJywge1xuICAgICAgICAgIGtleVBhdGg6ICduYW1lJ1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBVc2VycyBvYmplY3Qgc3RvcmUuIFVJRCBpcyB0aGUgcHJpbWFyeSBrZXkuXG4gICAgICAgIHRoaXMuZGIuY3JlYXRlT2JqZWN0U3RvcmUoJ3VzZXInLCB7XG4gICAgICAgICAga2V5UGF0aDogJ3VpZCdcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gU3Vic2NyaXB0aW9ucyBvYmplY3Qgc3RvcmUgdG9waWMgPC0+IHVzZXIuIFRvcGljIG5hbWUgKyBVSUQgaXMgdGhlIHByaW1hcnkga2V5LlxuICAgICAgICB0aGlzLmRiLmNyZWF0ZU9iamVjdFN0b3JlKCdzdWJzY3JpcHRpb24nLCB7XG4gICAgICAgICAga2V5UGF0aDogWyd0b3BpYycsICd1aWQnXVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBNZXNzYWdlcyBvYmplY3Qgc3RvcmUuIFRoZSBwcmltYXJ5IGtleSBpcyB0b3BpYyBuYW1lICsgc2VxLlxuICAgICAgICB0aGlzLmRiLmNyZWF0ZU9iamVjdFN0b3JlKCdtZXNzYWdlJywge1xuICAgICAgICAgIGtleVBhdGg6IFsndG9waWMnLCAnc2VxJ11cbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIERlbGV0ZSBwZXJzaXN0ZW50IGNhY2hlLlxuICAgKi9cbiAgZGVsZXRlRGF0YWJhc2UoKSB7XG4gICAgLy8gQ2xvc2UgY29ubmVjdGlvbiwgb3RoZXJ3aXNlIG9wZXJhdGlvbnMgd2lsbCBmYWlsIHdpdGggJ29uYmxvY2tlZCcuXG4gICAgaWYgKHRoaXMuZGIpIHtcbiAgICAgIHRoaXMuZGIuY2xvc2UoKTtcbiAgICAgIHRoaXMuZGIgPSBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgcmVxID0gSURCUHJvdmlkZXIuZGVsZXRlRGF0YWJhc2UoREJfTkFNRSk7XG4gICAgICByZXEub25ibG9ja2VkID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuZGIpIHtcbiAgICAgICAgICB0aGlzLmRiLmNsb3NlKCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZXJyID0gbmV3IEVycm9yKFwiYmxvY2tlZFwiKTtcbiAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCAnZGVsZXRlRGF0YWJhc2UnLCBlcnIpO1xuICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgIH07XG4gICAgICByZXEub25zdWNjZXNzID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuZGIgPSBudWxsO1xuICAgICAgICB0aGlzLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgIH07XG4gICAgICByZXEub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsICdkZWxldGVEYXRhYmFzZScsIGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBwZXJzaXN0ZW50IGNhY2hlIGlzIHJlYWR5IGZvciB1c2UuXG4gICAqIEBtZW1iZXJPZiBEQlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgY2FjaGUgaXMgcmVhZHksIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBpc1JlYWR5KCkge1xuICAgIHJldHVybiAhIXRoaXMuZGI7XG4gIH1cblxuICAvLyBUb3BpY3MuXG5cbiAgLyoqXG4gICAqIFNhdmUgdG8gY2FjaGUgb3IgdXBkYXRlIHRvcGljIGluIHBlcnNpc3RlbnQgY2FjaGUuXG4gICAqIEBtZW1iZXJPZiBEQlxuICAgKiBAcGFyYW0ge1RvcGljfSB0b3BpYyAtIHRvcGljIHRvIGJlIGFkZGVkIG9yIHVwZGF0ZWQuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgKi9cbiAgdXBkVG9waWModG9waWMpIHtcbiAgICBpZiAoIXRoaXMuaXNSZWFkeSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/XG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpIDpcbiAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwibm90IGluaXRpYWxpemVkXCIpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHRyeCA9IHRoaXMuZGIudHJhbnNhY3Rpb24oWyd0b3BpYyddLCAncmVhZHdyaXRlJyk7XG4gICAgICB0cngub25jb21wbGV0ZSA9IChldmVudCkgPT4ge1xuICAgICAgICByZXNvbHZlKGV2ZW50LnRhcmdldC5yZXN1bHQpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2xvZ2dlcignUENhY2hlJywgJ3VwZFRvcGljJywgZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICB9O1xuICAgICAgY29uc3QgcmVxID0gdHJ4Lm9iamVjdFN0b3JlKCd0b3BpYycpLmdldCh0b3BpYy5uYW1lKTtcbiAgICAgIHJlcS5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdHJ4Lm9iamVjdFN0b3JlKCd0b3BpYycpLnB1dChEQi4jc2VyaWFsaXplVG9waWMocmVxLnJlc3VsdCwgdG9waWMpKTtcbiAgICAgICAgdHJ4LmNvbW1pdCgpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXJrIG9yIHVubWFyayB0b3BpYyBhcyBkZWxldGVkLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBuYW1lIG9mIHRoZSB0b3BpYyB0byBtYXJrIG9yIHVubWFyay5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCBvbiBvcGVyYXRpb24gY29tcGxldGlvbi5cbiAgICovXG4gIG1hcmtUb3BpY0FzRGVsZXRlZChuYW1lKSB7XG4gICAgaWYgKCF0aGlzLmlzUmVhZHkoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgP1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKSA6XG4gICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIm5vdCBpbml0aWFsaXplZFwiKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB0cnggPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFsndG9waWMnXSwgJ3JlYWR3cml0ZScpO1xuICAgICAgdHJ4Lm9uY29tcGxldGUgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgcmVzb2x2ZShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgIH07XG4gICAgICB0cngub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsICdtYXJrVG9waWNBc0RlbGV0ZWQnLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgICBjb25zdCByZXEgPSB0cngub2JqZWN0U3RvcmUoJ3RvcGljJykuZ2V0KG5hbWUpO1xuICAgICAgcmVxLm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xuICAgICAgICBjb25zdCB0b3BpYyA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XG4gICAgICAgIHRvcGljLl9kZWxldGVkID0gdHJ1ZTtcbiAgICAgICAgdHJ4Lm9iamVjdFN0b3JlKCd0b3BpYycpLnB1dCh0b3BpYyk7XG4gICAgICAgIHRyeC5jb21taXQoKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIHRvcGljIGZyb20gcGVyc2lzdGVudCBjYWNoZS5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gbmFtZSBvZiB0aGUgdG9waWMgdG8gcmVtb3ZlIGZyb20gZGF0YWJhc2UuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gb3BlcmF0aW9uIGNvbXBsZXRpb24uXG4gICAqL1xuICByZW1Ub3BpYyhuYW1lKSB7XG4gICAgaWYgKCF0aGlzLmlzUmVhZHkoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgP1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKSA6XG4gICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIm5vdCBpbml0aWFsaXplZFwiKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB0cnggPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFsndG9waWMnLCAnc3Vic2NyaXB0aW9uJywgJ21lc3NhZ2UnXSwgJ3JlYWR3cml0ZScpO1xuICAgICAgdHJ4Lm9uY29tcGxldGUgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgcmVzb2x2ZShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgIH07XG4gICAgICB0cngub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsICdyZW1Ub3BpYycsIGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vYmplY3RTdG9yZSgndG9waWMnKS5kZWxldGUoSURCS2V5UmFuZ2Uub25seShuYW1lKSk7XG4gICAgICB0cngub2JqZWN0U3RvcmUoJ3N1YnNjcmlwdGlvbicpLmRlbGV0ZShJREJLZXlSYW5nZS5ib3VuZChbbmFtZSwgJy0nXSwgW25hbWUsICd+J10pKTtcbiAgICAgIHRyeC5vYmplY3RTdG9yZSgnbWVzc2FnZScpLmRlbGV0ZShJREJLZXlSYW5nZS5ib3VuZChbbmFtZSwgMF0sIFtuYW1lLCBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUl0pKTtcbiAgICAgIHRyeC5jb21taXQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeGVjdXRlIGEgY2FsbGJhY2sgZm9yIGVhY2ggc3RvcmVkIHRvcGljLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSBmdW5jdGlvbiB0byBjYWxsIGZvciBlYWNoIHRvcGljLlxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCAtIHRoZSB2YWx1ZSBvciA8Y29kZT50aGlzPC9jb2RlPiBpbnNpZGUgdGhlIGNhbGxiYWNrLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgKi9cbiAgbWFwVG9waWNzKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMuI21hcE9iamVjdHMoJ3RvcGljJywgY2FsbGJhY2ssIGNvbnRleHQpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvcHkgZGF0YSBmcm9tIHNlcmlhbGl6ZWQgb2JqZWN0IHRvIHRvcGljLlxuICAgKiBAbWVtYmVyT2YgREJcbiAgICogQHBhcmFtIHtUb3BpY30gdG9waWMgLSB0YXJnZXQgdG8gZGVzZXJpYWxpemUgdG8uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzcmMgLSBzZXJpYWxpemVkIGRhdGEgdG8gY29weSBmcm9tLlxuICAgKi9cbiAgZGVzZXJpYWxpemVUb3BpYyh0b3BpYywgc3JjKSB7XG4gICAgREIuI2Rlc2VyaWFsaXplVG9waWModG9waWMsIHNyYyk7XG4gIH1cblxuICAvLyBVc2Vycy5cbiAgLyoqXG4gICAqIEFkZCBvciB1cGRhdGUgdXNlciBvYmplY3QgaW4gdGhlIHBlcnNpc3RlbnQgY2FjaGUuXG4gICAqIEBtZW1iZXJPZiBEQlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gSUQgb2YgdGhlIHVzZXIgdG8gc2F2ZSBvciB1cGRhdGUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwdWIgLSB1c2VyJ3MgPGNvZGU+cHVibGljPC9jb2RlPiBpbmZvcm1hdGlvbi5cbiAgICogQHJldHVybnMge1Byb21pc2V9IHByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gb3BlcmF0aW9uIGNvbXBsZXRpb24uXG4gICAqL1xuICB1cGRVc2VyKHVpZCwgcHViKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyIHx8IHB1YiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBObyBwb2ludCBpbnVwZGF0aW5nIHVzZXIgd2l0aCBpbnZhbGlkIGRhdGEuXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghdGhpcy5pc1JlYWR5KCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpc2FibGVkID9cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkgOlxuICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJub3QgaW5pdGlhbGl6ZWRcIikpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgdHJ4ID0gdGhpcy5kYi50cmFuc2FjdGlvbihbJ3VzZXInXSwgJ3JlYWR3cml0ZScpO1xuICAgICAgdHJ4Lm9uY29tcGxldGUgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgcmVzb2x2ZShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgIH07XG4gICAgICB0cngub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNsb2dnZXIoJ1BDYWNoZScsICd1cGRVc2VyJywgZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9iamVjdFN0b3JlKCd1c2VyJykucHV0KHtcbiAgICAgICAgdWlkOiB1aWQsXG4gICAgICAgIHB1YmxpYzogcHViXG4gICAgICB9KTtcbiAgICAgIHRyeC5jb21taXQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgdXNlciBmcm9tIHBlcnNpc3RlbnQgY2FjaGUuXG4gICAqIEBtZW1iZXJPZiBEQlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gSUQgb2YgdGhlIHVzZXIgdG8gcmVtb3ZlIGZyb20gdGhlIGNhY2hlLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgKi9cbiAgcmVtVXNlcih1aWQpIHtcbiAgICBpZiAoIXRoaXMuaXNSZWFkeSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/XG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpIDpcbiAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwibm90IGluaXRpYWxpemVkXCIpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHRyeCA9IHRoaXMuZGIudHJhbnNhY3Rpb24oWyd1c2VyJ10sICdyZWFkd3JpdGUnKTtcbiAgICAgIHRyeC5vbmNvbXBsZXRlID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHJlc29sdmUoZXZlbnQudGFyZ2V0LnJlc3VsdCk7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCAncmVtVXNlcicsIGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vYmplY3RTdG9yZSgndXNlcicpLmRlbGV0ZShJREJLZXlSYW5nZS5vbmx5KHVpZCkpO1xuICAgICAgdHJ4LmNvbW1pdCgpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGUgYSBjYWxsYmFjayBmb3IgZWFjaCBzdG9yZWQgdXNlci5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0gZnVuY3Rpb24gdG8gY2FsbCBmb3IgZWFjaCB0b3BpYy5cbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSB0aGUgdmFsdWUgb3IgPGNvZGU+dGhpczwvY29kZT4gaW5zaWRlIHRoZSBjYWxsYmFjay5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCBvbiBvcGVyYXRpb24gY29tcGxldGlvbi5cbiAgICovXG4gIG1hcFVzZXJzKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMuI21hcE9iamVjdHMoJ3VzZXInLCBjYWxsYmFjaywgY29udGV4dCk7XG4gIH1cblxuICAvKipcbiAgICogUmVhZCBhIHNpbmdsZSB1c2VyIGZyb20gcGVyc2lzdGVudCBjYWNoZS5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBJRCBvZiB0aGUgdXNlciB0byBmZXRjaCBmcm9tIGNhY2hlLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgKi9cbiAgZ2V0VXNlcih1aWQpIHtcbiAgICBpZiAoIXRoaXMuaXNSZWFkeSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/XG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpIDpcbiAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwibm90IGluaXRpYWxpemVkXCIpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHRyeCA9IHRoaXMuZGIudHJhbnNhY3Rpb24oWyd1c2VyJ10pO1xuICAgICAgdHJ4Lm9uY29tcGxldGUgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgY29uc3QgdXNlciA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XG4gICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgIHVzZXI6IHVzZXIudWlkLFxuICAgICAgICAgIHB1YmxpYzogdXNlci5wdWJsaWNcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCAnZ2V0VXNlcicsIGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vYmplY3RTdG9yZSgndXNlcicpLmdldCh1aWQpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gU3Vic2NyaXB0aW9ucy5cbiAgLyoqXG4gICAqIEFkZCBvciB1cGRhdGUgc3Vic2NyaXB0aW9uIGluIHBlcnNpc3RlbnQgY2FjaGUuXG4gICAqIEBtZW1iZXJPZiBEQlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gbmFtZSBvZiB0aGUgdG9waWMgd2hpY2ggb3ducyB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHVpZCAtIElEIG9mIHRoZSBzdWJzY3JpYmVkIHVzZXIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzdWIgLSBzdWJzY3JpcHRpb24gdG8gc2F2ZS5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCBvbiBvcGVyYXRpb24gY29tcGxldGlvbi5cbiAgICovXG4gIHVwZFN1YnNjcmlwdGlvbih0b3BpY05hbWUsIHVpZCwgc3ViKSB7XG4gICAgaWYgKCF0aGlzLmlzUmVhZHkoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgP1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKSA6XG4gICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIm5vdCBpbml0aWFsaXplZFwiKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB0cnggPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFsnc3Vic2NyaXB0aW9uJ10sICdyZWFkd3JpdGUnKTtcbiAgICAgIHRyeC5vbmNvbXBsZXRlID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHJlc29sdmUoZXZlbnQudGFyZ2V0LnJlc3VsdCk7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCAndXBkU3Vic2NyaXB0aW9uJywgZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9iamVjdFN0b3JlKCdzdWJzY3JpcHRpb24nKS5nZXQoW3RvcGljTmFtZSwgdWlkXSkub25zdWNjZXNzID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRyeC5vYmplY3RTdG9yZSgnc3Vic2NyaXB0aW9uJykucHV0KERCLiNzZXJpYWxpemVTdWJzY3JpcHRpb24oZXZlbnQudGFyZ2V0LnJlc3VsdCwgdG9waWNOYW1lLCB1aWQsIHN1YikpO1xuICAgICAgICB0cnguY29tbWl0KCk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGUgYSBjYWxsYmFjayBmb3IgZWFjaCBjYWNoZWQgc3Vic2NyaXB0aW9uIGluIGEgZ2l2ZW4gdG9waWMuXG4gICAqIEBtZW1iZXJPZiBEQlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gbmFtZSBvZiB0aGUgdG9waWMgd2hpY2ggb3ducyB0aGUgc3Vic2NyaXB0aW9ucy5cbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSBmdW5jdGlvbiB0byBjYWxsIGZvciBlYWNoIHN1YnNjcmlwdGlvbi5cbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSB0aGUgdmFsdWUgb3IgPGNvZGU+dGhpczwvY29kZT4gaW5zaWRlIHRoZSBjYWxsYmFjay5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCBvbiBvcGVyYXRpb24gY29tcGxldGlvbi5cbiAgICovXG4gIG1hcFN1YnNjcmlwdGlvbnModG9waWNOYW1lLCBjYWxsYmFjaywgY29udGV4dCkge1xuICAgIGlmICghdGhpcy5pc1JlYWR5KCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpc2FibGVkID9cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKFtdKSA6XG4gICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIm5vdCBpbml0aWFsaXplZFwiKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB0cnggPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFsnc3Vic2NyaXB0aW9uJ10pO1xuICAgICAgdHJ4Lm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCAnbWFwU3Vic2NyaXB0aW9ucycsIGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vYmplY3RTdG9yZSgnc3Vic2NyaXB0aW9uJykuZ2V0QWxsKElEQktleVJhbmdlLmJvdW5kKFt0b3BpY05hbWUsICctJ10sIFt0b3BpY05hbWUsICd+J10pKS5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgZXZlbnQudGFyZ2V0LnJlc3VsdC5mb3JFYWNoKCh0b3BpYykgPT4ge1xuICAgICAgICAgICAgY2FsbGJhY2suY2FsbChjb250ZXh0LCB0b3BpYyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmVzb2x2ZShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICAvLyBNZXNzYWdlcy5cblxuICAvKipcbiAgICogU2F2ZSBtZXNzYWdlIHRvIHBlcnNpc3RlbnQgY2FjaGUuXG4gICAqIEBtZW1iZXJPZiBEQlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gbmFtZSBvZiB0aGUgdG9waWMgd2hpY2ggb3ducyB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG1zZyAtIG1lc3NhZ2UgdG8gc2F2ZS5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCBvbiBvcGVyYXRpb24gY29tcGxldGlvbi5cbiAgICovXG4gIGFkZE1lc3NhZ2UobXNnKSB7XG4gICAgaWYgKCF0aGlzLmlzUmVhZHkoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgP1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKSA6XG4gICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIm5vdCBpbml0aWFsaXplZFwiKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB0cnggPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFsnbWVzc2FnZSddLCAncmVhZHdyaXRlJyk7XG4gICAgICB0cngub25zdWNjZXNzID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHJlc29sdmUoZXZlbnQudGFyZ2V0LnJlc3VsdCk7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCAnYWRkTWVzc2FnZScsIGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgfTtcbiAgICAgIHRyeC5vYmplY3RTdG9yZSgnbWVzc2FnZScpLmFkZChEQi4jc2VyaWFsaXplTWVzc2FnZShudWxsLCBtc2cpKTtcbiAgICAgIHRyeC5jb21taXQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgZGVsaXZlcnkgc3RhdHVzIG9mIGEgbWVzc2FnZSBzdG9yZWQgaW4gcGVyc2lzdGVudCBjYWNoZS5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBuYW1lIG9mIHRoZSB0b3BpYyB3aGljaCBvd25zIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2VxIC0gSUQgb2YgdGhlIG1lc3NhZ2UgdG8gdXBkYXRlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzdGF0dXMgLSBuZXcgZGVsaXZlcnkgc3RhdHVzIG9mIHRoZSBtZXNzYWdlLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgKi9cbiAgdXBkTWVzc2FnZVN0YXR1cyh0b3BpY05hbWUsIHNlcSwgc3RhdHVzKSB7XG4gICAgaWYgKCF0aGlzLmlzUmVhZHkoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgP1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKSA6XG4gICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIm5vdCBpbml0aWFsaXplZFwiKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB0cnggPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFsnbWVzc2FnZSddLCAncmVhZHdyaXRlJyk7XG4gICAgICB0cngub25zdWNjZXNzID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHJlc29sdmUoZXZlbnQudGFyZ2V0LnJlc3VsdCk7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCAndXBkTWVzc2FnZVN0YXR1cycsIGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgfTtcbiAgICAgIGNvbnN0IHJlcSA9IHRyeC5vYmplY3RTdG9yZSgnbWVzc2FnZScpLmdldChJREJLZXlSYW5nZS5vbmx5KFt0b3BpY05hbWUsIHNlcV0pKTtcbiAgICAgIHJlcS5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgY29uc3Qgc3JjID0gcmVxLnJlc3VsdCB8fCBldmVudC50YXJnZXQucmVzdWx0O1xuICAgICAgICBpZiAoIXNyYyB8fCBzcmMuX3N0YXR1cyA9PSBzdGF0dXMpIHtcbiAgICAgICAgICB0cnguY29tbWl0KCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRyeC5vYmplY3RTdG9yZSgnbWVzc2FnZScpLnB1dChEQi4jc2VyaWFsaXplTWVzc2FnZShzcmMsIHtcbiAgICAgICAgICB0b3BpYzogdG9waWNOYW1lLFxuICAgICAgICAgIHNlcTogc2VxLFxuICAgICAgICAgIF9zdGF0dXM6IHN0YXR1c1xuICAgICAgICB9KSk7XG4gICAgICAgIHRyeC5jb21taXQoKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIG9uZSBvciBtb3JlIG1lc3NhZ2VzIGZyb20gcGVyc2lzdGVudCBjYWNoZS5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBuYW1lIG9mIHRoZSB0b3BpYyB3aGljaCBvd25zIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge251bWJlcn0gZnJvbSAtIGlkIG9mIHRoZSBtZXNzYWdlIHRvIHJlbW92ZSBvciBsb3dlciBib3VuZGFyeSB3aGVuIHJlbW92aW5nIHJhbmdlIChpbmNsdXNpdmUpLlxuICAgKiBAcGFyYW0ge251bWJlcj19IHRvIC0gdXBwZXIgYm91bmRhcnkgKGV4Y2x1c2l2ZSkgd2hlbiByZW1vdmluZyBhIHJhbmdlIG9mIG1lc3NhZ2VzLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgKi9cbiAgcmVtTWVzc2FnZXModG9waWNOYW1lLCBmcm9tLCB0bykge1xuICAgIGlmICghdGhpcy5pc1JlYWR5KCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpc2FibGVkID9cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkgOlxuICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJub3QgaW5pdGlhbGl6ZWRcIikpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgaWYgKCFmcm9tICYmICF0bykge1xuICAgICAgICBmcm9tID0gMDtcbiAgICAgICAgdG8gPSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHJhbmdlID0gdG8gPiAwID8gSURCS2V5UmFuZ2UuYm91bmQoW3RvcGljTmFtZSwgZnJvbV0sIFt0b3BpY05hbWUsIHRvXSwgZmFsc2UsIHRydWUpIDpcbiAgICAgICAgSURCS2V5UmFuZ2Uub25seShbdG9waWNOYW1lLCBmcm9tXSk7XG4gICAgICBjb25zdCB0cnggPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFsnbWVzc2FnZSddLCAncmVhZHdyaXRlJyk7XG4gICAgICB0cngub25zdWNjZXNzID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHJlc29sdmUoZXZlbnQudGFyZ2V0LnJlc3VsdCk7XG4gICAgICB9O1xuICAgICAgdHJ4Lm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCAncmVtTWVzc2FnZXMnLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgIH07XG4gICAgICB0cngub2JqZWN0U3RvcmUoJ21lc3NhZ2UnKS5kZWxldGUocmFuZ2UpO1xuICAgICAgdHJ4LmNvbW1pdCgpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIG1lc3NhZ2VzIGZyb20gcGVyc2lzdGVudCBzdG9yZS5cbiAgICogQG1lbWJlck9mIERCXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBuYW1lIG9mIHRoZSB0b3BpYyB0byByZXRyaWV2ZSBtZXNzYWdlcyBmcm9tLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayB0byBjYWxsIGZvciBlYWNoIHJldHJpZXZlZCBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gcXVlcnkgLSBwYXJhbWV0ZXJzIG9mIHRoZSBtZXNzYWdlIHJhbmdlIHRvIHJldHJpZXZlLlxuICAgKiBAcGFyYW0ge251bWJlcj19IHF1ZXJ5LnNpbmNlIC0gdGhlIGxlYXN0IG1lc3NhZ2UgSUQgdG8gcmV0cmlldmUgKGluY2x1c2l2ZSkuXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gcXVlcnkuYmVmb3JlIC0gdGhlIGdyZWF0ZXN0IG1lc3NhZ2UgSUQgdG8gcmV0cmlldmUgKGV4Y2x1c2l2ZSkuXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gcXVlcnkubGltaXQgLSB0aGUgbWF4aW11bSBudW1iZXIgb2YgbWVzc2FnZXMgdG8gcmV0cmlldmUuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gb3BlcmF0aW9uIGNvbXBsZXRpb24uXG4gICAqL1xuICByZWFkTWVzc2FnZXModG9waWNOYW1lLCBxdWVyeSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICBpZiAoIXRoaXMuaXNSZWFkeSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/XG4gICAgICAgIFByb21pc2UucmVzb2x2ZShbXSkgOlxuICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJub3QgaW5pdGlhbGl6ZWRcIikpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgcXVlcnkgPSBxdWVyeSB8fCB7fTtcbiAgICAgIGNvbnN0IHNpbmNlID0gcXVlcnkuc2luY2UgPiAwID8gcXVlcnkuc2luY2UgOiAwO1xuICAgICAgY29uc3QgYmVmb3JlID0gcXVlcnkuYmVmb3JlID4gMCA/IHF1ZXJ5LmJlZm9yZSA6IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xuICAgICAgY29uc3QgbGltaXQgPSBxdWVyeS5saW1pdCB8IDA7XG5cbiAgICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuICAgICAgY29uc3QgcmFuZ2UgPSBJREJLZXlSYW5nZS5ib3VuZChbdG9waWNOYW1lLCBzaW5jZV0sIFt0b3BpY05hbWUsIGJlZm9yZV0sIGZhbHNlLCB0cnVlKTtcbiAgICAgIGNvbnN0IHRyeCA9IHRoaXMuZGIudHJhbnNhY3Rpb24oWydtZXNzYWdlJ10pO1xuICAgICAgdHJ4Lm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbG9nZ2VyKCdQQ2FjaGUnLCAncmVhZE1lc3NhZ2VzJywgZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICB9O1xuICAgICAgLy8gSXRlcmF0ZSBpbiBkZXNjZW5kaW5nIG9yZGVyLlxuICAgICAgdHJ4Lm9iamVjdFN0b3JlKCdtZXNzYWdlJykub3BlbkN1cnNvcihyYW5nZSwgJ3ByZXYnKS5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgY29uc3QgY3Vyc29yID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcbiAgICAgICAgaWYgKGN1cnNvcikge1xuICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgY2FsbGJhY2suY2FsbChjb250ZXh0LCBjdXJzb3IudmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXN1bHQucHVzaChjdXJzb3IudmFsdWUpO1xuICAgICAgICAgIGlmIChsaW1pdCA8PSAwIHx8IHJlc3VsdC5sZW5ndGggPCBsaW1pdCkge1xuICAgICAgICAgICAgY3Vyc29yLmNvbnRpbnVlKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgLy8gUHJpdmF0ZSBtZXRob2RzLlxuXG4gIC8vIFNlcmlhbGl6YWJsZSB0b3BpYyBmaWVsZHMuXG4gIHN0YXRpYyAjdG9waWNfZmllbGRzID0gWydjcmVhdGVkJywgJ3VwZGF0ZWQnLCAnZGVsZXRlZCcsICdyZWFkJywgJ3JlY3YnLCAnc2VxJywgJ2NsZWFyJywgJ2RlZmFjcycsXG4gICAgJ2NyZWRzJywgJ3B1YmxpYycsICd0cnVzdGVkJywgJ3ByaXZhdGUnLCAndG91Y2hlZCcsICdfZGVsZXRlZCdcbiAgXTtcblxuICAvLyBDb3B5IGRhdGEgZnJvbSBzcmMgdG8gVG9waWMgb2JqZWN0LlxuICBzdGF0aWMgI2Rlc2VyaWFsaXplVG9waWModG9waWMsIHNyYykge1xuICAgIERCLiN0b3BpY19maWVsZHMuZm9yRWFjaCgoZikgPT4ge1xuICAgICAgaWYgKHNyYy5oYXNPd25Qcm9wZXJ0eShmKSkge1xuICAgICAgICB0b3BpY1tmXSA9IHNyY1tmXTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShzcmMudGFncykpIHtcbiAgICAgIHRvcGljLl90YWdzID0gc3JjLnRhZ3M7XG4gICAgfVxuICAgIGlmIChzcmMuYWNzKSB7XG4gICAgICB0b3BpYy5zZXRBY2Nlc3NNb2RlKHNyYy5hY3MpO1xuICAgIH1cbiAgICB0b3BpYy5zZXEgfD0gMDtcbiAgICB0b3BpYy5yZWFkIHw9IDA7XG4gICAgdG9waWMudW5yZWFkID0gTWF0aC5tYXgoMCwgdG9waWMuc2VxIC0gdG9waWMucmVhZCk7XG4gIH1cblxuICAvLyBDb3B5IHZhbHVlcyBmcm9tICdzcmMnIHRvICdkc3QnLiBBbGxvY2F0ZSBkc3QgaWYgaXQncyBudWxsIG9yIHVuZGVmaW5lZC5cbiAgc3RhdGljICNzZXJpYWxpemVUb3BpYyhkc3QsIHNyYykge1xuICAgIGNvbnN0IHJlcyA9IGRzdCB8fCB7XG4gICAgICBuYW1lOiBzcmMubmFtZVxuICAgIH07XG4gICAgREIuI3RvcGljX2ZpZWxkcy5mb3JFYWNoKChmKSA9PiB7XG4gICAgICBpZiAoc3JjLmhhc093blByb3BlcnR5KGYpKSB7XG4gICAgICAgIHJlc1tmXSA9IHNyY1tmXTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShzcmMuX3RhZ3MpKSB7XG4gICAgICByZXMudGFncyA9IHNyYy5fdGFncztcbiAgICB9XG4gICAgaWYgKHNyYy5hY3MpIHtcbiAgICAgIHJlcy5hY3MgPSBzcmMuZ2V0QWNjZXNzTW9kZSgpLmpzb25IZWxwZXIoKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIHN0YXRpYyAjc2VyaWFsaXplU3Vic2NyaXB0aW9uKGRzdCwgdG9waWNOYW1lLCB1aWQsIHN1Yikge1xuICAgIGNvbnN0IGZpZWxkcyA9IFsndXBkYXRlZCcsICdtb2RlJywgJ3JlYWQnLCAncmVjdicsICdjbGVhcicsICdsYXN0U2VlbicsICd1c2VyQWdlbnQnXTtcbiAgICBjb25zdCByZXMgPSBkc3QgfHwge1xuICAgICAgdG9waWM6IHRvcGljTmFtZSxcbiAgICAgIHVpZDogdWlkXG4gICAgfTtcblxuICAgIGZpZWxkcy5mb3JFYWNoKChmKSA9PiB7XG4gICAgICBpZiAoc3ViLmhhc093blByb3BlcnR5KGYpKSB7XG4gICAgICAgIHJlc1tmXSA9IHN1YltmXTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiByZXM7XG4gIH1cblxuICBzdGF0aWMgI3NlcmlhbGl6ZU1lc3NhZ2UoZHN0LCBtc2cpIHtcbiAgICAvLyBTZXJpYWxpemFibGUgZmllbGRzLlxuICAgIGNvbnN0IGZpZWxkcyA9IFsndG9waWMnLCAnc2VxJywgJ3RzJywgJ19zdGF0dXMnLCAnZnJvbScsICdoZWFkJywgJ2NvbnRlbnQnXTtcbiAgICBjb25zdCByZXMgPSBkc3QgfHwge307XG4gICAgZmllbGRzLmZvckVhY2goKGYpID0+IHtcbiAgICAgIGlmIChtc2cuaGFzT3duUHJvcGVydHkoZikpIHtcbiAgICAgICAgcmVzW2ZdID0gbXNnW2ZdO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXM7XG4gIH1cblxuICAvKipcbiAgICogVG8gdXNlIERCIGluIGEgbm9uIGJyb3dzZXIgY29udGV4dCwgc3VwcGx5IGluZGV4ZWREQiBwcm92aWRlci5cbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyb2YgREJcbiAgICogQHBhcmFtIGlkYlByb3ZpZGVyIGluZGV4ZWREQiBwcm92aWRlciwgZS5nLiBmb3Igbm9kZSA8Y29kZT5yZXF1aXJlKCdmYWtlLWluZGV4ZWRkYicpPC9jb2RlPi5cbiAgICovXG4gIHN0YXRpYyBzZXREYXRhYmFzZVByb3ZpZGVyKGlkYlByb3ZpZGVyKSB7XG4gICAgSURCUHJvdmlkZXIgPSBpZGJQcm92aWRlcjtcbiAgfVxufVxuIiwiLyoqXG4gKiBAY29weXJpZ2h0IDIwMTUtMjAyMiBUaW5vZGUgTExDLlxuICogQHN1bW1hcnkgTWluaW1hbGx5IHJpY2ggdGV4dCByZXByZXNlbnRhdGlvbiBhbmQgZm9ybWF0dGluZyBmb3IgVGlub2RlLlxuICogQGxpY2Vuc2UgQXBhY2hlIDIuMFxuICpcbiAqIEBmaWxlIEJhc2ljIHBhcnNlciBhbmQgZm9ybWF0dGVyIGZvciB2ZXJ5IHNpbXBsZSB0ZXh0IG1hcmt1cC4gTW9zdGx5IHRhcmdldGVkIGF0XG4gKiBtb2JpbGUgdXNlIGNhc2VzIHNpbWlsYXIgdG8gVGVsZWdyYW0sIFdoYXRzQXBwLCBhbmQgRkIgTWVzc2VuZ2VyLlxuICpcbiAqIDxwPlN1cHBvcnRzIGNvbnZlcnNpb24gb2YgdXNlciBrZXlib2FyZCBpbnB1dCB0byBmb3JtYXR0ZWQgdGV4dDo8L3A+XG4gKiA8dWw+XG4gKiAgIDxsaT4qYWJjKiAmcmFycjsgPGI+YWJjPC9iPjwvbGk+XG4gKiAgIDxsaT5fYWJjXyAmcmFycjsgPGk+YWJjPC9pPjwvbGk+XG4gKiAgIDxsaT5+YWJjfiAmcmFycjsgPGRlbD5hYmM8L2RlbD48L2xpPlxuICogICA8bGk+YGFiY2AgJnJhcnI7IDx0dD5hYmM8L3R0PjwvbGk+XG4gKiA8L3VsPlxuICogQWxzbyBzdXBwb3J0cyBmb3JtcyBhbmQgYnV0dG9ucy5cbiAqXG4gKiBOZXN0ZWQgZm9ybWF0dGluZyBpcyBzdXBwb3J0ZWQsIGUuZy4gKmFiYyBfZGVmXyogLT4gPGI+YWJjIDxpPmRlZjwvaT48L2I+XG4gKiBVUkxzLCBAbWVudGlvbnMsIGFuZCAjaGFzaHRhZ3MgYXJlIGV4dHJhY3RlZCBhbmQgY29udmVydGVkIGludG8gbGlua3MuXG4gKiBGb3JtcyBhbmQgYnV0dG9ucyBjYW4gYmUgYWRkZWQgcHJvY2VkdXJhbGx5LlxuICogSlNPTiBkYXRhIHJlcHJlc2VudGF0aW9uIGlzIGluc3BpcmVkIGJ5IERyYWZ0LmpzIHJhdyBmb3JtYXR0aW5nLlxuICpcbiAqXG4gKiBAZXhhbXBsZVxuICogVGV4dDpcbiAqIDxwcmU+XG4gKiAgICAgdGhpcyBpcyAqYm9sZCosIGBjb2RlYCBhbmQgX2l0YWxpY18sIH5zdHJpa2V+XG4gKiAgICAgY29tYmluZWQgKmJvbGQgYW5kIF9pdGFsaWNfKlxuICogICAgIGFuIHVybDogaHR0cHM6Ly93d3cuZXhhbXBsZS5jb20vYWJjI2ZyYWdtZW50IGFuZCBhbm90aGVyIF93d3cudGlub2RlLmNvX1xuICogICAgIHRoaXMgaXMgYSBAbWVudGlvbiBhbmQgYSAjaGFzaHRhZyBpbiBhIHN0cmluZ1xuICogICAgIHNlY29uZCAjaGFzaHRhZ1xuICogPC9wcmU+XG4gKlxuICogIFNhbXBsZSBKU09OIHJlcHJlc2VudGF0aW9uIG9mIHRoZSB0ZXh0IGFib3ZlOlxuICogIHtcbiAqICAgICBcInR4dFwiOiBcInRoaXMgaXMgYm9sZCwgY29kZSBhbmQgaXRhbGljLCBzdHJpa2UgY29tYmluZWQgYm9sZCBhbmQgaXRhbGljIGFuIHVybDogaHR0cHM6Ly93d3cuZXhhbXBsZS5jb20vYWJjI2ZyYWdtZW50IFwiICtcbiAqICAgICAgICAgICAgIFwiYW5kIGFub3RoZXIgd3d3LnRpbm9kZS5jbyB0aGlzIGlzIGEgQG1lbnRpb24gYW5kIGEgI2hhc2h0YWcgaW4gYSBzdHJpbmcgc2Vjb25kICNoYXNodGFnXCIsXG4gKiAgICAgXCJmbXRcIjogW1xuICogICAgICAgICB7IFwiYXRcIjo4LCBcImxlblwiOjQsXCJ0cFwiOlwiU1RcIiB9LHsgXCJhdFwiOjE0LCBcImxlblwiOjQsIFwidHBcIjpcIkNPXCIgfSx7IFwiYXRcIjoyMywgXCJsZW5cIjo2LCBcInRwXCI6XCJFTVwifSxcbiAqICAgICAgICAgeyBcImF0XCI6MzEsIFwibGVuXCI6NiwgXCJ0cFwiOlwiRExcIiB9LHsgXCJ0cFwiOlwiQlJcIiwgXCJsZW5cIjoxLCBcImF0XCI6MzcgfSx7IFwiYXRcIjo1NiwgXCJsZW5cIjo2LCBcInRwXCI6XCJFTVwiIH0sXG4gKiAgICAgICAgIHsgXCJhdFwiOjQ3LCBcImxlblwiOjE1LCBcInRwXCI6XCJTVFwiIH0seyBcInRwXCI6XCJCUlwiLCBcImxlblwiOjEsIFwiYXRcIjo2MiB9LHsgXCJhdFwiOjEyMCwgXCJsZW5cIjoxMywgXCJ0cFwiOlwiRU1cIiB9LFxuICogICAgICAgICB7IFwiYXRcIjo3MSwgXCJsZW5cIjozNiwgXCJrZXlcIjowIH0seyBcImF0XCI6MTIwLCBcImxlblwiOjEzLCBcImtleVwiOjEgfSx7IFwidHBcIjpcIkJSXCIsIFwibGVuXCI6MSwgXCJhdFwiOjEzMyB9LFxuICogICAgICAgICB7IFwiYXRcIjoxNDQsIFwibGVuXCI6OCwgXCJrZXlcIjoyIH0seyBcImF0XCI6MTU5LCBcImxlblwiOjgsIFwia2V5XCI6MyB9LHsgXCJ0cFwiOlwiQlJcIiwgXCJsZW5cIjoxLCBcImF0XCI6MTc5IH0sXG4gKiAgICAgICAgIHsgXCJhdFwiOjE4NywgXCJsZW5cIjo4LCBcImtleVwiOjMgfSx7IFwidHBcIjpcIkJSXCIsIFwibGVuXCI6MSwgXCJhdFwiOjE5NSB9XG4gKiAgICAgXSxcbiAqICAgICBcImVudFwiOiBbXG4gKiAgICAgICAgIHsgXCJ0cFwiOlwiTE5cIiwgXCJkYXRhXCI6eyBcInVybFwiOlwiaHR0cHM6Ly93d3cuZXhhbXBsZS5jb20vYWJjI2ZyYWdtZW50XCIgfSB9LFxuICogICAgICAgICB7IFwidHBcIjpcIkxOXCIsIFwiZGF0YVwiOnsgXCJ1cmxcIjpcImh0dHA6Ly93d3cudGlub2RlLmNvXCIgfSB9LFxuICogICAgICAgICB7IFwidHBcIjpcIk1OXCIsIFwiZGF0YVwiOnsgXCJ2YWxcIjpcIm1lbnRpb25cIiB9IH0sXG4gKiAgICAgICAgIHsgXCJ0cFwiOlwiSFRcIiwgXCJkYXRhXCI6eyBcInZhbFwiOlwiaGFzaHRhZ1wiIH0gfVxuICogICAgIF1cbiAqICB9XG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vLyBOT1RFIFRPIERFVkVMT1BFUlM6XG4vLyBMb2NhbGl6YWJsZSBzdHJpbmdzIHNob3VsZCBiZSBkb3VibGUgcXVvdGVkIFwi0YHRgtGA0L7QutCwINC90LAg0LTRgNGD0LPQvtC8INGP0LfRi9C60LVcIixcbi8vIG5vbi1sb2NhbGl6YWJsZSBzdHJpbmdzIHNob3VsZCBiZSBzaW5nbGUgcXVvdGVkICdub24tbG9jYWxpemVkJy5cblxuY29uc3QgTUFYX0ZPUk1fRUxFTUVOVFMgPSA4O1xuY29uc3QgTUFYX1BSRVZJRVdfQVRUQUNITUVOVFMgPSAzO1xuY29uc3QgTUFYX1BSRVZJRVdfREFUQV9TSVpFID0gNjQ7XG5jb25zdCBKU09OX01JTUVfVFlQRSA9ICdhcHBsaWNhdGlvbi9qc29uJztcbmNvbnN0IERSQUZUWV9NSU1FX1RZUEUgPSAndGV4dC94LWRyYWZ0eSc7XG5jb25zdCBBTExPV0VEX0VOVF9GSUVMRFMgPSBbJ2FjdCcsICdoZWlnaHQnLCAnZHVyYXRpb24nLCAnaW5jb21pbmcnLCAnbWltZScsICduYW1lJywgJ3ByZXZpZXcnLFxuICAncmVmJywgJ3NpemUnLCAnc3RhdGUnLCAndXJsJywgJ3ZhbCcsICd3aWR0aCdcbl07XG5cbi8vIFJlZ3VsYXIgZXhwcmVzc2lvbnMgZm9yIHBhcnNpbmcgaW5saW5lIGZvcm1hdHMuIEphdmFzY3JpcHQgZG9lcyBub3Qgc3VwcG9ydCBsb29rYmVoaW5kLFxuLy8gc28gaXQncyBhIGJpdCBtZXNzeS5cbmNvbnN0IElOTElORV9TVFlMRVMgPSBbXG4gIC8vIFN0cm9uZyA9IGJvbGQsICpib2xkIHRleHQqXG4gIHtcbiAgICBuYW1lOiAnU1QnLFxuICAgIHN0YXJ0OiAvKD86XnxbXFxXX10pKFxcKilbXlxccypdLyxcbiAgICBlbmQ6IC9bXlxccypdKFxcKikoPz0kfFtcXFdfXSkvXG4gIH0sXG4gIC8vIEVtcGhlc2l6ZWQgPSBpdGFsaWMsIF9pdGFsaWMgdGV4dF9cbiAge1xuICAgIG5hbWU6ICdFTScsXG4gICAgc3RhcnQ6IC8oPzpefFxcVykoXylbXlxcc19dLyxcbiAgICBlbmQ6IC9bXlxcc19dKF8pKD89JHxcXFcpL1xuICB9LFxuICAvLyBEZWxldGVkLCB+c3RyaWtlIHRoaXMgdGhvdWdoflxuICB7XG4gICAgbmFtZTogJ0RMJyxcbiAgICBzdGFydDogLyg/Ol58W1xcV19dKSh+KVteXFxzfl0vLFxuICAgIGVuZDogL1teXFxzfl0ofikoPz0kfFtcXFdfXSkvXG4gIH0sXG4gIC8vIENvZGUgYmxvY2sgYHRoaXMgaXMgbW9ub3NwYWNlYFxuICB7XG4gICAgbmFtZTogJ0NPJyxcbiAgICBzdGFydDogLyg/Ol58XFxXKShgKVteYF0vLFxuICAgIGVuZDogL1teYF0oYCkoPz0kfFxcVykvXG4gIH1cbl07XG5cbi8vIFJlbGF0aXZlIHdlaWdodHMgb2YgZm9ybWF0dGluZyBzcGFucy4gR3JlYXRlciBpbmRleCBpbiBhcnJheSBtZWFucyBncmVhdGVyIHdlaWdodC5cbmNvbnN0IEZNVF9XRUlHSFQgPSBbJ1FRJ107XG5cbi8vIFJlZ0V4cHMgZm9yIGVudGl0eSBleHRyYWN0aW9uIChSRiA9IHJlZmVyZW5jZSlcbmNvbnN0IEVOVElUWV9UWVBFUyA9IFtcbiAgLy8gVVJMc1xuICB7XG4gICAgbmFtZTogJ0xOJyxcbiAgICBkYXRhTmFtZTogJ3VybCcsXG4gICAgcGFjazogZnVuY3Rpb24odmFsKSB7XG4gICAgICAvLyBDaGVjayBpZiB0aGUgcHJvdG9jb2wgaXMgc3BlY2lmaWVkLCBpZiBub3QgdXNlIGh0dHBcbiAgICAgIGlmICghL15bYS16XSs6XFwvXFwvL2kudGVzdCh2YWwpKSB7XG4gICAgICAgIHZhbCA9ICdodHRwOi8vJyArIHZhbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHVybDogdmFsXG4gICAgICB9O1xuICAgIH0sXG4gICAgcmU6IC8oPzooPzpodHRwcz98ZnRwKTpcXC9cXC98d3d3XFwufGZ0cFxcLilbLUEtWjAtOSsmQCNcXC8lPX5ffCQ/ITosLl0qW0EtWjAtOSsmQCNcXC8lPX5ffCRdL2lnXG4gIH0sXG4gIC8vIE1lbnRpb25zIEB1c2VyIChtdXN0IGJlIDIgb3IgbW9yZSBjaGFyYWN0ZXJzKVxuICB7XG4gICAgbmFtZTogJ01OJyxcbiAgICBkYXRhTmFtZTogJ3ZhbCcsXG4gICAgcGFjazogZnVuY3Rpb24odmFsKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB2YWw6IHZhbC5zbGljZSgxKVxuICAgICAgfTtcbiAgICB9LFxuICAgIHJlOiAvXFxCQChbXFxwe0x9XFxwe059XVsuX1xccHtMfVxccHtOfV0qW1xccHtMfVxccHtOfV0pL3VnXG4gIH0sXG4gIC8vIEhhc2h0YWdzICNoYXNodGFnLCBsaWtlIG1ldGlvbiAyIG9yIG1vcmUgY2hhcmFjdGVycy5cbiAge1xuICAgIG5hbWU6ICdIVCcsXG4gICAgZGF0YU5hbWU6ICd2YWwnLFxuICAgIHBhY2s6IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdmFsOiB2YWwuc2xpY2UoMSlcbiAgICAgIH07XG4gICAgfSxcbiAgICByZTogL1xcQiMoW1xccHtMfVxccHtOfV1bLl9cXHB7TH1cXHB7Tn1dKltcXHB7TH1cXHB7Tn1dKS91Z1xuICB9XG5dO1xuXG4vLyBIVE1MIHRhZyBuYW1lIHN1Z2dlc3Rpb25zXG5jb25zdCBIVE1MX1RBR1MgPSB7XG4gIEFVOiB7XG4gICAgbmFtZTogJ2F1ZGlvJyxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIEJOOiB7XG4gICAgbmFtZTogJ2J1dHRvbicsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBCUjoge1xuICAgIG5hbWU6ICdicicsXG4gICAgaXNWb2lkOiB0cnVlXG4gIH0sXG4gIENPOiB7XG4gICAgbmFtZTogJ3R0JyxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIERMOiB7XG4gICAgbmFtZTogJ2RlbCcsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBFTToge1xuICAgIG5hbWU6ICdpJyxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIEVYOiB7XG4gICAgbmFtZTogJycsXG4gICAgaXNWb2lkOiB0cnVlXG4gIH0sXG4gIEZNOiB7XG4gICAgbmFtZTogJ2RpdicsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBIRDoge1xuICAgIG5hbWU6ICcnLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgSEw6IHtcbiAgICBuYW1lOiAnc3BhbicsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBIVDoge1xuICAgIG5hbWU6ICdhJyxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIElNOiB7XG4gICAgbmFtZTogJ2ltZycsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBMTjoge1xuICAgIG5hbWU6ICdhJyxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIE1OOiB7XG4gICAgbmFtZTogJ2EnLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgUlc6IHtcbiAgICBuYW1lOiAnZGl2JyxcbiAgICBpc1ZvaWQ6IGZhbHNlLFxuICB9LFxuICBRUToge1xuICAgIG5hbWU6ICdkaXYnLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgU1Q6IHtcbiAgICBuYW1lOiAnYicsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBWQzoge1xuICAgIG5hbWU6ICdkaXYnLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbn07XG5cbi8vIENvbnZlcnQgYmFzZTY0LWVuY29kZWQgc3RyaW5nIGludG8gQmxvYi5cbmZ1bmN0aW9uIGJhc2U2NHRvT2JqZWN0VXJsKGI2NCwgY29udGVudFR5cGUsIGxvZ2dlcikge1xuICBpZiAoIWI2NCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBjb25zdCBiaW4gPSBhdG9iKGI2NCk7XG4gICAgY29uc3QgbGVuZ3RoID0gYmluLmxlbmd0aDtcbiAgICBjb25zdCBidWYgPSBuZXcgQXJyYXlCdWZmZXIobGVuZ3RoKTtcbiAgICBjb25zdCBhcnIgPSBuZXcgVWludDhBcnJheShidWYpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGFycltpXSA9IGJpbi5jaGFyQ29kZUF0KGkpO1xuICAgIH1cblxuICAgIHJldHVybiBVUkwuY3JlYXRlT2JqZWN0VVJMKG5ldyBCbG9iKFtidWZdLCB7XG4gICAgICB0eXBlOiBjb250ZW50VHlwZVxuICAgIH0pKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgaWYgKGxvZ2dlcikge1xuICAgICAgbG9nZ2VyKFwiRHJhZnR5OiBmYWlsZWQgdG8gY29udmVydCBvYmplY3QuXCIsIGVyci5tZXNzYWdlKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gYmFzZTY0dG9EYXRhVXJsKGI2NCwgY29udGVudFR5cGUpIHtcbiAgaWYgKCFiNjQpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBjb250ZW50VHlwZSA9IGNvbnRlbnRUeXBlIHx8ICdpbWFnZS9qcGVnJztcbiAgcmV0dXJuICdkYXRhOicgKyBjb250ZW50VHlwZSArICc7YmFzZTY0LCcgKyBiNjQ7XG59XG5cbi8vIEhlbHBlcnMgZm9yIGNvbnZlcnRpbmcgRHJhZnR5IHRvIEhUTUwuXG5jb25zdCBERUNPUkFUT1JTID0ge1xuICAvLyBWaXNpYWwgc3R5bGVzXG4gIFNUOiB7XG4gICAgb3BlbjogXyA9PiAnPGI+JyxcbiAgICBjbG9zZTogXyA9PiAnPC9iPidcbiAgfSxcbiAgRU06IHtcbiAgICBvcGVuOiBfID0+ICc8aT4nLFxuICAgIGNsb3NlOiBfID0+ICc8L2k+J1xuICB9LFxuICBETDoge1xuICAgIG9wZW46IF8gPT4gJzxkZWw+JyxcbiAgICBjbG9zZTogXyA9PiAnPC9kZWw+J1xuICB9LFxuICBDTzoge1xuICAgIG9wZW46IF8gPT4gJzx0dD4nLFxuICAgIGNsb3NlOiBfID0+ICc8L3R0PidcbiAgfSxcbiAgLy8gTGluZSBicmVha1xuICBCUjoge1xuICAgIG9wZW46IF8gPT4gJzxici8+JyxcbiAgICBjbG9zZTogXyA9PiAnJ1xuICB9LFxuICAvLyBIaWRkZW4gZWxlbWVudFxuICBIRDoge1xuICAgIG9wZW46IF8gPT4gJycsXG4gICAgY2xvc2U6IF8gPT4gJydcbiAgfSxcbiAgLy8gSGlnaGxpZ2h0ZWQgZWxlbWVudC5cbiAgSEw6IHtcbiAgICBvcGVuOiBfID0+ICc8c3BhbiBzdHlsZT1cImNvbG9yOnRlYWxcIj4nLFxuICAgIGNsb3NlOiBfID0+ICc8L3NwYW4+J1xuICB9LFxuICAvLyBMaW5rIChVUkwpXG4gIExOOiB7XG4gICAgb3BlbjogKGRhdGEpID0+IHtcbiAgICAgIHJldHVybiAnPGEgaHJlZj1cIicgKyBkYXRhLnVybCArICdcIj4nO1xuICAgIH0sXG4gICAgY2xvc2U6IF8gPT4gJzwvYT4nLFxuICAgIHByb3BzOiAoZGF0YSkgPT4ge1xuICAgICAgcmV0dXJuIGRhdGEgPyB7XG4gICAgICAgIGhyZWY6IGRhdGEudXJsLFxuICAgICAgICB0YXJnZXQ6ICdfYmxhbmsnXG4gICAgICB9IDogbnVsbDtcbiAgICB9LFxuICB9LFxuICAvLyBNZW50aW9uXG4gIE1OOiB7XG4gICAgb3BlbjogKGRhdGEpID0+IHtcbiAgICAgIHJldHVybiAnPGEgaHJlZj1cIiMnICsgZGF0YS52YWwgKyAnXCI+JztcbiAgICB9LFxuICAgIGNsb3NlOiBfID0+ICc8L2E+JyxcbiAgICBwcm9wczogKGRhdGEpID0+IHtcbiAgICAgIHJldHVybiBkYXRhID8ge1xuICAgICAgICBpZDogZGF0YS52YWxcbiAgICAgIH0gOiBudWxsO1xuICAgIH0sXG4gIH0sXG4gIC8vIEhhc2h0YWdcbiAgSFQ6IHtcbiAgICBvcGVuOiAoZGF0YSkgPT4ge1xuICAgICAgcmV0dXJuICc8YSBocmVmPVwiIycgKyBkYXRhLnZhbCArICdcIj4nO1xuICAgIH0sXG4gICAgY2xvc2U6IF8gPT4gJzwvYT4nLFxuICAgIHByb3BzOiAoZGF0YSkgPT4ge1xuICAgICAgcmV0dXJuIGRhdGEgPyB7XG4gICAgICAgIGlkOiBkYXRhLnZhbFxuICAgICAgfSA6IG51bGw7XG4gICAgfSxcbiAgfSxcbiAgLy8gQnV0dG9uXG4gIEJOOiB7XG4gICAgb3BlbjogXyA9PiAnPGJ1dHRvbj4nLFxuICAgIGNsb3NlOiBfID0+ICc8L2J1dHRvbj4nLFxuICAgIHByb3BzOiAoZGF0YSkgPT4ge1xuICAgICAgcmV0dXJuIGRhdGEgPyB7XG4gICAgICAgICdkYXRhLWFjdCc6IGRhdGEuYWN0LFxuICAgICAgICAnZGF0YS12YWwnOiBkYXRhLnZhbCxcbiAgICAgICAgJ2RhdGEtbmFtZSc6IGRhdGEubmFtZSxcbiAgICAgICAgJ2RhdGEtcmVmJzogZGF0YS5yZWZcbiAgICAgIH0gOiBudWxsO1xuICAgIH0sXG4gIH0sXG4gIC8vIEF1ZGlvIHJlY29yZGluZ1xuICBBVToge1xuICAgIG9wZW46IChkYXRhKSA9PiB7XG4gICAgICBjb25zdCB1cmwgPSBkYXRhLnJlZiB8fCBiYXNlNjR0b09iamVjdFVybChkYXRhLnZhbCwgZGF0YS5taW1lLCBEcmFmdHkubG9nZ2VyKTtcbiAgICAgIHJldHVybiAnPGF1ZGlvIGNvbnRyb2xzIHNyYz1cIicgKyB1cmwgKyAnXCI+JztcbiAgICB9LFxuICAgIGNsb3NlOiBfID0+ICc8L2F1ZGlvPicsXG4gICAgcHJvcHM6IChkYXRhKSA9PiB7XG4gICAgICBpZiAoIWRhdGEpIHJldHVybiBudWxsO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLy8gRW1iZWRkZWQgZGF0YSBvciBleHRlcm5hbCBsaW5rLlxuICAgICAgICBzcmM6IGRhdGEucmVmIHx8IGJhc2U2NHRvT2JqZWN0VXJsKGRhdGEudmFsLCBkYXRhLm1pbWUsIERyYWZ0eS5sb2dnZXIpLFxuICAgICAgICAnZGF0YS1wcmVsb2FkJzogZGF0YS5yZWYgPyAnbWV0YWRhdGEnIDogJ2F1dG8nLFxuICAgICAgICAnZGF0YS1kdXJhdGlvbic6IGRhdGEuZHVyYXRpb24sXG4gICAgICAgICdkYXRhLW5hbWUnOiBkYXRhLm5hbWUsXG4gICAgICAgICdkYXRhLXNpemUnOiBkYXRhLnZhbCA/ICgoZGF0YS52YWwubGVuZ3RoICogMC43NSkgfCAwKSA6IChkYXRhLnNpemUgfCAwKSxcbiAgICAgICAgJ2RhdGEtbWltZSc6IGRhdGEubWltZSxcbiAgICAgIH07XG4gICAgfVxuICB9LFxuICAvLyBJbWFnZVxuICBJTToge1xuICAgIG9wZW46IChkYXRhKSA9PiB7XG4gICAgICAvLyBEb24ndCB1c2UgZGF0YS5yZWYgZm9yIHByZXZpZXc6IGl0J3MgYSBzZWN1cml0eSByaXNrLlxuICAgICAgY29uc3QgdG1wUHJldmlld1VybCA9IGJhc2U2NHRvRGF0YVVybChkYXRhLl90ZW1wUHJldmlldywgZGF0YS5taW1lKTtcbiAgICAgIGNvbnN0IHByZXZpZXdVcmwgPSBiYXNlNjR0b09iamVjdFVybChkYXRhLnZhbCwgZGF0YS5taW1lLCBEcmFmdHkubG9nZ2VyKTtcbiAgICAgIGNvbnN0IGRvd25sb2FkVXJsID0gZGF0YS5yZWYgfHwgcHJldmlld1VybDtcbiAgICAgIHJldHVybiAoZGF0YS5uYW1lID8gJzxhIGhyZWY9XCInICsgZG93bmxvYWRVcmwgKyAnXCIgZG93bmxvYWQ9XCInICsgZGF0YS5uYW1lICsgJ1wiPicgOiAnJykgK1xuICAgICAgICAnPGltZyBzcmM9XCInICsgKHRtcFByZXZpZXdVcmwgfHwgcHJldmlld1VybCkgKyAnXCInICtcbiAgICAgICAgKGRhdGEud2lkdGggPyAnIHdpZHRoPVwiJyArIGRhdGEud2lkdGggKyAnXCInIDogJycpICtcbiAgICAgICAgKGRhdGEuaGVpZ2h0ID8gJyBoZWlnaHQ9XCInICsgZGF0YS5oZWlnaHQgKyAnXCInIDogJycpICsgJyBib3JkZXI9XCIwXCIgLz4nO1xuICAgIH0sXG4gICAgY2xvc2U6IChkYXRhKSA9PiB7XG4gICAgICByZXR1cm4gKGRhdGEubmFtZSA/ICc8L2E+JyA6ICcnKTtcbiAgICB9LFxuICAgIHByb3BzOiAoZGF0YSkgPT4ge1xuICAgICAgaWYgKCFkYXRhKSByZXR1cm4gbnVsbDtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC8vIFRlbXBvcmFyeSBwcmV2aWV3LCBvciBwZXJtYW5lbnQgcHJldmlldywgb3IgZXh0ZXJuYWwgbGluay5cbiAgICAgICAgc3JjOiBiYXNlNjR0b0RhdGFVcmwoZGF0YS5fdGVtcFByZXZpZXcsIGRhdGEubWltZSkgfHxcbiAgICAgICAgICBkYXRhLnJlZiB8fCBiYXNlNjR0b09iamVjdFVybChkYXRhLnZhbCwgZGF0YS5taW1lLCBEcmFmdHkubG9nZ2VyKSxcbiAgICAgICAgdGl0bGU6IGRhdGEubmFtZSxcbiAgICAgICAgYWx0OiBkYXRhLm5hbWUsXG4gICAgICAgICdkYXRhLXdpZHRoJzogZGF0YS53aWR0aCxcbiAgICAgICAgJ2RhdGEtaGVpZ2h0JzogZGF0YS5oZWlnaHQsXG4gICAgICAgICdkYXRhLW5hbWUnOiBkYXRhLm5hbWUsXG4gICAgICAgICdkYXRhLXNpemUnOiBkYXRhLnZhbCA/ICgoZGF0YS52YWwubGVuZ3RoICogMC43NSkgfCAwKSA6IChkYXRhLnNpemUgfCAwKSxcbiAgICAgICAgJ2RhdGEtbWltZSc6IGRhdGEubWltZSxcbiAgICAgIH07XG4gICAgfSxcbiAgfSxcbiAgLy8gRm9ybSAtIHN0cnVjdHVyZWQgbGF5b3V0IG9mIGVsZW1lbnRzLlxuICBGTToge1xuICAgIG9wZW46IF8gPT4gJzxkaXY+JyxcbiAgICBjbG9zZTogXyA9PiAnPC9kaXY+J1xuICB9LFxuICAvLyBSb3c6IGxvZ2ljIGdyb3VwaW5nIG9mIGVsZW1lbnRzXG4gIFJXOiB7XG4gICAgb3BlbjogXyA9PiAnPGRpdj4nLFxuICAgIGNsb3NlOiBfID0+ICc8L2Rpdj4nXG4gIH0sXG4gIC8vIFF1b3RlZCBibG9jay5cbiAgUVE6IHtcbiAgICBvcGVuOiBfID0+ICc8ZGl2PicsXG4gICAgY2xvc2U6IF8gPT4gJzwvZGl2PicsXG4gICAgcHJvcHM6IChkYXRhKSA9PiB7XG4gICAgICByZXR1cm4gZGF0YSA/IHt9IDogbnVsbDtcbiAgICB9LFxuICB9LFxuICAvLyBWaWRlbyBjYWxsXG4gIFZDOiB7XG4gICAgb3BlbjogXyA9PiAnPGRpdj4nLFxuICAgIGNsb3NlOiBfID0+ICc8L2Rpdj4nLFxuICAgIHByb3BzOiBkYXRhID0+IHtcbiAgICAgIGlmICghZGF0YSkgcmV0dXJuIHt9O1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgJ2RhdGEtZHVyYXRpb24nOiBkYXRhLmR1cmF0aW9uLFxuICAgICAgICAnZGF0YS1zdGF0ZSc6IGRhdGEuc3RhdGUsXG4gICAgICB9O1xuICAgIH1cbiAgfSxcbn07XG5cbi8qKlxuICogVGhlIG1haW4gb2JqZWN0IHdoaWNoIHBlcmZvcm1zIGFsbCB0aGUgZm9ybWF0dGluZyBhY3Rpb25zLlxuICogQGNsYXNzIERyYWZ0eVxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmNvbnN0IERyYWZ0eSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnR4dCA9ICcnO1xuICB0aGlzLmZtdCA9IFtdO1xuICB0aGlzLmVudCA9IFtdO1xufVxuXG4vKipcbiAqIEluaXRpYWxpemUgRHJhZnR5IGRvY3VtZW50IHRvIGEgcGxhaW4gdGV4dCBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHBsYWluVGV4dCAtIHN0cmluZyB0byB1c2UgYXMgRHJhZnR5IGNvbnRlbnQuXG4gKlxuICogQHJldHVybnMgbmV3IERyYWZ0eSBkb2N1bWVudCBvciBudWxsIGlzIHBsYWluVGV4dCBpcyBub3QgYSBzdHJpbmcgb3IgdW5kZWZpbmVkLlxuICovXG5EcmFmdHkuaW5pdCA9IGZ1bmN0aW9uKHBsYWluVGV4dCkge1xuICBpZiAodHlwZW9mIHBsYWluVGV4dCA9PSAndW5kZWZpbmVkJykge1xuICAgIHBsYWluVGV4dCA9ICcnO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBwbGFpblRleHQgIT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgdHh0OiBwbGFpblRleHRcbiAgfTtcbn1cblxuLyoqXG4gKiBQYXJzZSBwbGFpbiB0ZXh0IGludG8gRHJhZnR5IGRvY3VtZW50LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb250ZW50IC0gcGxhaW4tdGV4dCBjb250ZW50IHRvIHBhcnNlLlxuICogQHJldHVybiB7RHJhZnR5fSBwYXJzZWQgZG9jdW1lbnQgb3IgbnVsbCBpZiB0aGUgc291cmNlIGlzIG5vdCBwbGFpbiB0ZXh0LlxuICovXG5EcmFmdHkucGFyc2UgPSBmdW5jdGlvbihjb250ZW50KSB7XG4gIC8vIE1ha2Ugc3VyZSB3ZSBhcmUgcGFyc2luZyBzdHJpbmdzIG9ubHkuXG4gIGlmICh0eXBlb2YgY29udGVudCAhPSAnc3RyaW5nJykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gU3BsaXQgdGV4dCBpbnRvIGxpbmVzLiBJdCBtYWtlcyBmdXJ0aGVyIHByb2Nlc3NpbmcgZWFzaWVyLlxuICBjb25zdCBsaW5lcyA9IGNvbnRlbnQuc3BsaXQoL1xccj9cXG4vKTtcblxuICAvLyBIb2xkcyBlbnRpdGllcyByZWZlcmVuY2VkIGZyb20gdGV4dFxuICBjb25zdCBlbnRpdHlNYXAgPSBbXTtcbiAgY29uc3QgZW50aXR5SW5kZXggPSB7fTtcblxuICAvLyBQcm9jZXNzaW5nIGxpbmVzIG9uZSBieSBvbmUsIGhvbGQgaW50ZXJtZWRpYXRlIHJlc3VsdCBpbiBibHguXG4gIGNvbnN0IGJseCA9IFtdO1xuICBsaW5lcy5mb3JFYWNoKChsaW5lKSA9PiB7XG4gICAgbGV0IHNwYW5zID0gW107XG4gICAgbGV0IGVudGl0aWVzO1xuXG4gICAgLy8gRmluZCBmb3JtYXR0ZWQgc3BhbnMgaW4gdGhlIHN0cmluZy5cbiAgICAvLyBUcnkgdG8gbWF0Y2ggZWFjaCBzdHlsZS5cbiAgICBJTkxJTkVfU1RZTEVTLmZvckVhY2goKHRhZykgPT4ge1xuICAgICAgLy8gRWFjaCBzdHlsZSBjb3VsZCBiZSBtYXRjaGVkIG11bHRpcGxlIHRpbWVzLlxuICAgICAgc3BhbnMgPSBzcGFucy5jb25jYXQoc3Bhbm5pZnkobGluZSwgdGFnLnN0YXJ0LCB0YWcuZW5kLCB0YWcubmFtZSkpO1xuICAgIH0pO1xuXG4gICAgbGV0IGJsb2NrO1xuICAgIGlmIChzcGFucy5sZW5ndGggPT0gMCkge1xuICAgICAgYmxvY2sgPSB7XG4gICAgICAgIHR4dDogbGluZVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gU29ydCBzcGFucyBieSBzdHlsZSBvY2N1cmVuY2UgZWFybHkgLT4gbGF0ZSwgdGhlbiBieSBsZW5ndGg6IGZpcnN0IGxvbmcgdGhlbiBzaG9ydC5cbiAgICAgIHNwYW5zLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgY29uc3QgZGlmZiA9IGEuYXQgLSBiLmF0O1xuICAgICAgICByZXR1cm4gZGlmZiAhPSAwID8gZGlmZiA6IGIuZW5kIC0gYS5lbmQ7XG4gICAgICB9KTtcblxuICAgICAgLy8gQ29udmVydCBhbiBhcnJheSBvZiBwb3NzaWJseSBvdmVybGFwcGluZyBzcGFucyBpbnRvIGEgdHJlZS5cbiAgICAgIHNwYW5zID0gdG9TcGFuVHJlZShzcGFucyk7XG5cbiAgICAgIC8vIEJ1aWxkIGEgdHJlZSByZXByZXNlbnRhdGlvbiBvZiB0aGUgZW50aXJlIHN0cmluZywgbm90XG4gICAgICAvLyBqdXN0IHRoZSBmb3JtYXR0ZWQgcGFydHMuXG4gICAgICBjb25zdCBjaHVua3MgPSBjaHVua2lmeShsaW5lLCAwLCBsaW5lLmxlbmd0aCwgc3BhbnMpO1xuXG4gICAgICBjb25zdCBkcmFmdHkgPSBkcmFmdGlmeShjaHVua3MsIDApO1xuXG4gICAgICBibG9jayA9IHtcbiAgICAgICAgdHh0OiBkcmFmdHkudHh0LFxuICAgICAgICBmbXQ6IGRyYWZ0eS5mbXRcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gRXh0cmFjdCBlbnRpdGllcyBmcm9tIHRoZSBjbGVhbmVkIHVwIHN0cmluZy5cbiAgICBlbnRpdGllcyA9IGV4dHJhY3RFbnRpdGllcyhibG9jay50eHQpO1xuICAgIGlmIChlbnRpdGllcy5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCByYW5nZXMgPSBbXTtcbiAgICAgIGZvciAobGV0IGkgaW4gZW50aXRpZXMpIHtcbiAgICAgICAgLy8ge29mZnNldDogbWF0Y2hbJ2luZGV4J10sIHVuaXF1ZTogbWF0Y2hbMF0sIGxlbjogbWF0Y2hbMF0ubGVuZ3RoLCBkYXRhOiBlbnQucGFja2VyKCksIHR5cGU6IGVudC5uYW1lfVxuICAgICAgICBjb25zdCBlbnRpdHkgPSBlbnRpdGllc1tpXTtcbiAgICAgICAgbGV0IGluZGV4ID0gZW50aXR5SW5kZXhbZW50aXR5LnVuaXF1ZV07XG4gICAgICAgIGlmICghaW5kZXgpIHtcbiAgICAgICAgICBpbmRleCA9IGVudGl0eU1hcC5sZW5ndGg7XG4gICAgICAgICAgZW50aXR5SW5kZXhbZW50aXR5LnVuaXF1ZV0gPSBpbmRleDtcbiAgICAgICAgICBlbnRpdHlNYXAucHVzaCh7XG4gICAgICAgICAgICB0cDogZW50aXR5LnR5cGUsXG4gICAgICAgICAgICBkYXRhOiBlbnRpdHkuZGF0YVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJhbmdlcy5wdXNoKHtcbiAgICAgICAgICBhdDogZW50aXR5Lm9mZnNldCxcbiAgICAgICAgICBsZW46IGVudGl0eS5sZW4sXG4gICAgICAgICAga2V5OiBpbmRleFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGJsb2NrLmVudCA9IHJhbmdlcztcbiAgICB9XG5cbiAgICBibHgucHVzaChibG9jayk7XG4gIH0pO1xuXG4gIGNvbnN0IHJlc3VsdCA9IHtcbiAgICB0eHQ6ICcnXG4gIH07XG5cbiAgLy8gTWVyZ2UgbGluZXMgYW5kIHNhdmUgbGluZSBicmVha3MgYXMgQlIgaW5saW5lIGZvcm1hdHRpbmcuXG4gIGlmIChibHgubGVuZ3RoID4gMCkge1xuICAgIHJlc3VsdC50eHQgPSBibHhbMF0udHh0O1xuICAgIHJlc3VsdC5mbXQgPSAoYmx4WzBdLmZtdCB8fCBbXSkuY29uY2F0KGJseFswXS5lbnQgfHwgW10pO1xuXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBibHgubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGJsb2NrID0gYmx4W2ldO1xuICAgICAgY29uc3Qgb2Zmc2V0ID0gcmVzdWx0LnR4dC5sZW5ndGggKyAxO1xuXG4gICAgICByZXN1bHQuZm10LnB1c2goe1xuICAgICAgICB0cDogJ0JSJyxcbiAgICAgICAgbGVuOiAxLFxuICAgICAgICBhdDogb2Zmc2V0IC0gMVxuICAgICAgfSk7XG5cbiAgICAgIHJlc3VsdC50eHQgKz0gJyAnICsgYmxvY2sudHh0O1xuICAgICAgaWYgKGJsb2NrLmZtdCkge1xuICAgICAgICByZXN1bHQuZm10ID0gcmVzdWx0LmZtdC5jb25jYXQoYmxvY2suZm10Lm1hcCgocykgPT4ge1xuICAgICAgICAgIHMuYXQgKz0gb2Zmc2V0O1xuICAgICAgICAgIHJldHVybiBzO1xuICAgICAgICB9KSk7XG4gICAgICB9XG4gICAgICBpZiAoYmxvY2suZW50KSB7XG4gICAgICAgIHJlc3VsdC5mbXQgPSByZXN1bHQuZm10LmNvbmNhdChibG9jay5lbnQubWFwKChzKSA9PiB7XG4gICAgICAgICAgcy5hdCArPSBvZmZzZXQ7XG4gICAgICAgICAgcmV0dXJuIHM7XG4gICAgICAgIH0pKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocmVzdWx0LmZtdC5sZW5ndGggPT0gMCkge1xuICAgICAgZGVsZXRlIHJlc3VsdC5mbXQ7XG4gICAgfVxuXG4gICAgaWYgKGVudGl0eU1hcC5sZW5ndGggPiAwKSB7XG4gICAgICByZXN1bHQuZW50ID0gZW50aXR5TWFwO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEFwcGVuZCBvbmUgRHJhZnR5IGRvY3VtZW50IHRvIGFub3RoZXIuXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGZpcnN0IC0gRHJhZnR5IGRvY3VtZW50IHRvIGFwcGVuZCB0by5cbiAqIEBwYXJhbSB7RHJhZnR5fHN0cmluZ30gc2Vjb25kIC0gRHJhZnR5IGRvY3VtZW50IG9yIHN0cmluZyBiZWluZyBhcHBlbmRlZC5cbiAqXG4gKiBAcmV0dXJuIHtEcmFmdHl9IGZpcnN0IGRvY3VtZW50IHdpdGggdGhlIHNlY29uZCBhcHBlbmRlZCB0byBpdC5cbiAqL1xuRHJhZnR5LmFwcGVuZCA9IGZ1bmN0aW9uKGZpcnN0LCBzZWNvbmQpIHtcbiAgaWYgKCFmaXJzdCkge1xuICAgIHJldHVybiBzZWNvbmQ7XG4gIH1cbiAgaWYgKCFzZWNvbmQpIHtcbiAgICByZXR1cm4gZmlyc3Q7XG4gIH1cblxuICBmaXJzdC50eHQgPSBmaXJzdC50eHQgfHwgJyc7XG4gIGNvbnN0IGxlbiA9IGZpcnN0LnR4dC5sZW5ndGg7XG5cbiAgaWYgKHR5cGVvZiBzZWNvbmQgPT0gJ3N0cmluZycpIHtcbiAgICBmaXJzdC50eHQgKz0gc2Vjb25kO1xuICB9IGVsc2UgaWYgKHNlY29uZC50eHQpIHtcbiAgICBmaXJzdC50eHQgKz0gc2Vjb25kLnR4dDtcbiAgfVxuXG4gIGlmIChBcnJheS5pc0FycmF5KHNlY29uZC5mbXQpKSB7XG4gICAgZmlyc3QuZm10ID0gZmlyc3QuZm10IHx8IFtdO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHNlY29uZC5lbnQpKSB7XG4gICAgICBmaXJzdC5lbnQgPSBmaXJzdC5lbnQgfHwgW107XG4gICAgfVxuICAgIHNlY29uZC5mbXQuZm9yRWFjaChzcmMgPT4ge1xuICAgICAgY29uc3QgZm10ID0ge1xuICAgICAgICBhdDogKHNyYy5hdCB8IDApICsgbGVuLFxuICAgICAgICBsZW46IHNyYy5sZW4gfCAwXG4gICAgICB9O1xuICAgICAgLy8gU3BlY2lhbCBjYXNlIGZvciB0aGUgb3V0c2lkZSBvZiB0aGUgbm9ybWFsIHJlbmRlcmluZyBmbG93IHN0eWxlcy5cbiAgICAgIGlmIChzcmMuYXQgPT0gLTEpIHtcbiAgICAgICAgZm10LmF0ID0gLTE7XG4gICAgICAgIGZtdC5sZW4gPSAwO1xuICAgICAgfVxuICAgICAgaWYgKHNyYy50cCkge1xuICAgICAgICBmbXQudHAgPSBzcmMudHA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmbXQua2V5ID0gZmlyc3QuZW50Lmxlbmd0aDtcbiAgICAgICAgZmlyc3QuZW50LnB1c2goc2Vjb25kLmVudFtzcmMua2V5IHx8IDBdKTtcbiAgICAgIH1cbiAgICAgIGZpcnN0LmZtdC5wdXNoKGZtdCk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gZmlyc3Q7XG59XG5cbi8qKlxuICogQHR5cGVkZWYgRHJhZnR5LkltYWdlRGVzY1xuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHR5cGUgT2JqZWN0XG4gKiBAcGFyYW0ge3N0cmluZ30gbWltZSAtIG1pbWUtdHlwZSBvZiB0aGUgaW1hZ2UsIGUuZy4gXCJpbWFnZS9wbmdcIlxuICogQHBhcmFtIHtzdHJpbmd9IHByZXZpZXcgLSBiYXNlNjQtZW5jb2RlZCBpbWFnZSBjb250ZW50IChvciBwcmV2aWV3LCBpZiBsYXJnZSBpbWFnZSBpcyBhdHRhY2hlZCkuIENvdWxkIGJlIG51bGwvdW5kZWZpbmVkLlxuICogQHBhcmFtIHtpbnRlZ2VyfSB3aWR0aCAtIHdpZHRoIG9mIHRoZSBpbWFnZVxuICogQHBhcmFtIHtpbnRlZ2VyfSBoZWlnaHQgLSBoZWlnaHQgb2YgdGhlIGltYWdlXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZW5hbWUgLSBmaWxlIG5hbWUgc3VnZ2VzdGlvbiBmb3IgZG93bmxvYWRpbmcgdGhlIGltYWdlLlxuICogQHBhcmFtIHtpbnRlZ2VyfSBzaXplIC0gc2l6ZSBvZiB0aGUgaW1hZ2UgaW4gYnl0ZXMuIFRyZWF0IGlzIGFzIGFuIHVudHJ1c3RlZCBoaW50LlxuICogQHBhcmFtIHtzdHJpbmd9IHJlZnVybCAtIHJlZmVyZW5jZSB0byB0aGUgY29udGVudC4gQ291bGQgYmUgbnVsbC91bmRlZmluZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gX3RlbXBQcmV2aWV3IC0gYmFzZTY0LWVuY29kZWQgaW1hZ2UgcHJldmlldyB1c2VkIGR1cmluZyB1cGxvYWQgcHJvY2Vzczsgbm90IHNlcmlhbGl6YWJsZS5cbiAqIEBwYXJhbSB7UHJvbWlzZX0gdXJsUHJvbWlzZSAtIFByb21pc2Ugd2hpY2ggcmV0dXJucyBjb250ZW50IFVSTCB3aGVuIHJlc29sdmVkLlxuICovXG5cbi8qKlxuICogSW5zZXJ0IGlubGluZSBpbWFnZSBpbnRvIERyYWZ0eSBkb2N1bWVudC5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIGRvY3VtZW50IHRvIGFkZCBpbWFnZSB0by5cbiAqIEBwYXJhbSB7aW50ZWdlcn0gYXQgLSBpbmRleCB3aGVyZSB0aGUgb2JqZWN0IGlzIGluc2VydGVkLiBUaGUgbGVuZ3RoIG9mIHRoZSBpbWFnZSBpcyBhbHdheXMgMS5cbiAqIEBwYXJhbSB7SW1hZ2VEZXNjfSBpbWFnZURlc2MgLSBvYmplY3Qgd2l0aCBpbWFnZSBwYXJhbWVuZXRzIGFuZCBkYXRhLlxuICpcbiAqIEByZXR1cm4ge0RyYWZ0eX0gdXBkYXRlZCBkb2N1bWVudC5cbiAqL1xuRHJhZnR5Lmluc2VydEltYWdlID0gZnVuY3Rpb24oY29udGVudCwgYXQsIGltYWdlRGVzYykge1xuICBjb250ZW50ID0gY29udGVudCB8fCB7XG4gICAgdHh0OiAnICdcbiAgfTtcbiAgY29udGVudC5lbnQgPSBjb250ZW50LmVudCB8fCBbXTtcbiAgY29udGVudC5mbXQgPSBjb250ZW50LmZtdCB8fCBbXTtcblxuICBjb250ZW50LmZtdC5wdXNoKHtcbiAgICBhdDogYXQgfCAwLFxuICAgIGxlbjogMSxcbiAgICBrZXk6IGNvbnRlbnQuZW50Lmxlbmd0aFxuICB9KTtcblxuICBjb25zdCBleCA9IHtcbiAgICB0cDogJ0lNJyxcbiAgICBkYXRhOiB7XG4gICAgICBtaW1lOiBpbWFnZURlc2MubWltZSxcbiAgICAgIHZhbDogaW1hZ2VEZXNjLnByZXZpZXcsXG4gICAgICB3aWR0aDogaW1hZ2VEZXNjLndpZHRoLFxuICAgICAgaGVpZ2h0OiBpbWFnZURlc2MuaGVpZ2h0LFxuICAgICAgbmFtZTogaW1hZ2VEZXNjLmZpbGVuYW1lLFxuICAgICAgc2l6ZTogaW1hZ2VEZXNjLnNpemUgfCAwLFxuICAgICAgcmVmOiBpbWFnZURlc2MucmVmdXJsXG4gICAgfVxuICB9O1xuXG4gIGlmIChpbWFnZURlc2MudXJsUHJvbWlzZSkge1xuICAgIGV4LmRhdGEuX3RlbXBQcmV2aWV3ID0gaW1hZ2VEZXNjLl90ZW1wUHJldmlldztcbiAgICBleC5kYXRhLl9wcm9jZXNzaW5nID0gdHJ1ZTtcbiAgICBpbWFnZURlc2MudXJsUHJvbWlzZS50aGVuKFxuICAgICAgdXJsID0+IHtcbiAgICAgICAgZXguZGF0YS5yZWYgPSB1cmw7XG4gICAgICAgIGV4LmRhdGEuX3RlbXBQcmV2aWV3ID0gdW5kZWZpbmVkO1xuICAgICAgICBleC5kYXRhLl9wcm9jZXNzaW5nID0gdW5kZWZpbmVkO1xuICAgICAgfSxcbiAgICAgIF8gPT4ge1xuICAgICAgICAvLyBDYXRjaCB0aGUgZXJyb3IsIG90aGVyd2lzZSBpdCB3aWxsIGFwcGVhciBpbiB0aGUgY29uc29sZS5cbiAgICAgICAgZXguZGF0YS5fcHJvY2Vzc2luZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgY29udGVudC5lbnQucHVzaChleCk7XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbi8qKlxuICogQHR5cGVkZWYgRHJhZnR5LkF1ZGlvRGVzY1xuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHR5cGUgT2JqZWN0XG4gKiBAcGFyYW0ge3N0cmluZ30gbWltZSAtIG1pbWUtdHlwZSBvZiB0aGUgYXVkaW8sIGUuZy4gXCJhdWRpby9vZ2dcIi5cbiAqIEBwYXJhbSB7c3RyaW5nfSBkYXRhIC0gYmFzZTY0LWVuY29kZWQgYXVkaW8gY29udGVudC4gQ291bGQgYmUgbnVsbC91bmRlZmluZWQuXG4gKiBAcGFyYW0ge2ludGVnZXJ9IGR1cmF0aW9uIC0gZHVyYXRpb24gb2YgdGhlIHJlY29yZCBpbiBtaWxsaXNlY29uZHMuXG4gKiBAcGFyYW0ge3N0cmluZ30gcHJldmlldyAtIGJhc2U2NCBlbmNvZGVkIHNob3J0IGFycmF5IG9mIGFtcGxpdHVkZSB2YWx1ZXMgMC4uMTAwLlxuICogQHBhcmFtIHtzdHJpbmd9IGZpbGVuYW1lIC0gZmlsZSBuYW1lIHN1Z2dlc3Rpb24gZm9yIGRvd25sb2FkaW5nIHRoZSBhdWRpby5cbiAqIEBwYXJhbSB7aW50ZWdlcn0gc2l6ZSAtIHNpemUgb2YgdGhlIHJlY29yZGluZyBpbiBieXRlcy4gVHJlYXQgaXMgYXMgYW4gdW50cnVzdGVkIGhpbnQuXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVmdXJsIC0gcmVmZXJlbmNlIHRvIHRoZSBjb250ZW50LiBDb3VsZCBiZSBudWxsL3VuZGVmaW5lZC5cbiAqIEBwYXJhbSB7UHJvbWlzZX0gdXJsUHJvbWlzZSAtIFByb21pc2Ugd2hpY2ggcmV0dXJucyBjb250ZW50IFVSTCB3aGVuIHJlc29sdmVkLlxuICovXG5cbi8qKlxuICogSW5zZXJ0IGF1ZGlvIHJlY29yZGluZyBpbnRvIERyYWZ0eSBkb2N1bWVudC5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIGRvY3VtZW50IHRvIGFkZCBhdWRpbyByZWNvcmQgdG8uXG4gKiBAcGFyYW0ge2ludGVnZXJ9IGF0IC0gaW5kZXggd2hlcmUgdGhlIG9iamVjdCBpcyBpbnNlcnRlZC4gVGhlIGxlbmd0aCBvZiB0aGUgcmVjb3JkIGlzIGFsd2F5cyAxLlxuICogQHBhcmFtIHtBdWRpb0Rlc2N9IGF1ZGlvRGVzYyAtIG9iamVjdCB3aXRoIHRoZSBhdWRpbyBwYXJhbWVuZXRzIGFuZCBkYXRhLlxuICpcbiAqIEByZXR1cm4ge0RyYWZ0eX0gdXBkYXRlZCBkb2N1bWVudC5cbiAqL1xuRHJhZnR5Lmluc2VydEF1ZGlvID0gZnVuY3Rpb24oY29udGVudCwgYXQsIGF1ZGlvRGVzYykge1xuICBjb250ZW50ID0gY29udGVudCB8fCB7XG4gICAgdHh0OiAnICdcbiAgfTtcbiAgY29udGVudC5lbnQgPSBjb250ZW50LmVudCB8fCBbXTtcbiAgY29udGVudC5mbXQgPSBjb250ZW50LmZtdCB8fCBbXTtcblxuICBjb250ZW50LmZtdC5wdXNoKHtcbiAgICBhdDogYXQgfCAwLFxuICAgIGxlbjogMSxcbiAgICBrZXk6IGNvbnRlbnQuZW50Lmxlbmd0aFxuICB9KTtcblxuICBjb25zdCBleCA9IHtcbiAgICB0cDogJ0FVJyxcbiAgICBkYXRhOiB7XG4gICAgICBtaW1lOiBhdWRpb0Rlc2MubWltZSxcbiAgICAgIHZhbDogYXVkaW9EZXNjLmRhdGEsXG4gICAgICBkdXJhdGlvbjogYXVkaW9EZXNjLmR1cmF0aW9uIHwgMCxcbiAgICAgIHByZXZpZXc6IGF1ZGlvRGVzYy5wcmV2aWV3LFxuICAgICAgbmFtZTogYXVkaW9EZXNjLmZpbGVuYW1lLFxuICAgICAgc2l6ZTogYXVkaW9EZXNjLnNpemUgfCAwLFxuICAgICAgcmVmOiBhdWRpb0Rlc2MucmVmdXJsXG4gICAgfVxuICB9O1xuXG4gIGlmIChhdWRpb0Rlc2MudXJsUHJvbWlzZSkge1xuICAgIGV4LmRhdGEuX3Byb2Nlc3NpbmcgPSB0cnVlO1xuICAgIGF1ZGlvRGVzYy51cmxQcm9taXNlLnRoZW4oXG4gICAgICB1cmwgPT4ge1xuICAgICAgICBleC5kYXRhLnJlZiA9IHVybDtcbiAgICAgICAgZXguZGF0YS5fcHJvY2Vzc2luZyA9IHVuZGVmaW5lZDtcbiAgICAgIH0sXG4gICAgICBfID0+IHtcbiAgICAgICAgLy8gQ2F0Y2ggdGhlIGVycm9yLCBvdGhlcndpc2UgaXQgd2lsbCBhcHBlYXIgaW4gdGhlIGNvbnNvbGUuXG4gICAgICAgIGV4LmRhdGEuX3Byb2Nlc3NpbmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gIGNvbnRlbnQuZW50LnB1c2goZXgpO1xuXG4gIHJldHVybiBjb250ZW50O1xufVxuXG4vKipcbiAqIENyZWF0ZSBhIChzZWxmLWNvbnRhaW5lZCkgdmlkZW8gY2FsbCBEcmFmdHkgZG9jdW1lbnQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHJldHVybnMgVmlkZW8gQ2FsbCBkcmFmdHkgZG9jdW1lbnQuXG4gKi9cbkRyYWZ0eS52aWRlb0NhbGwgPSBmdW5jdGlvbigpIHtcbiAgY29uc3QgY29udGVudCA9IHtcbiAgICB0eHQ6ICcgJyxcbiAgICBmbXQ6IFt7XG4gICAgICBhdDogMCxcbiAgICAgIGxlbjogMSxcbiAgICAgIGtleTogMFxuICAgIH1dLFxuICAgIGVudDogW3tcbiAgICAgIHRwOiAnVkMnXG4gICAgfV1cbiAgfTtcbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbi8qKlxuICogVXBkYXRlIHZpZGVvIGNhbGwgKFZDKSBlbnRpdHkgd2l0aCB0aGUgbmV3IHN0YXR1cyBhbmQgZHVyYXRpb24uXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBWQyBkb2N1bWVudCB0byB1cGRhdGUuXG4gKiBAcGFyYW0ge29iamVjdH0gcGFyYW1zIC0gbmV3IHZpZGVvIGNhbGwgcGFyYW1ldGVycy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXJhbXMuc3RhdGUgLSBzdGF0ZSBvZiB2aWRlbyBjYWxsLlxuICogQHBhcmFtIHtudW1iZXJ9IHBhcmFtcy5kdXJhdGlvbiAtIGR1cmF0aW9uIG9mIHRoZSB2aWRlbyBjYWxsIGluIG1pbGxpc2Vjb25kcy5cbiAqXG4gKiBAcmV0dXJucyB0aGUgc2FtZSBkb2N1bWVudCB3aXRoIHVwZGF0ZSBhcHBsaWVkLlxuICovXG5EcmFmdHkudXBkYXRlVmlkZW9FbnQgPSBmdW5jdGlvbihjb250ZW50LCBwYXJhbXMpIHtcbiAgLy8gVGhlIHZpZGVvIGVsZW1lbnQgY291bGQgYmUganVzdCBhIGZvcm1hdCBvciBhIGZvcm1hdCArIGVudGl0eS5cbiAgLy8gTXVzdCBlbnN1cmUgaXQncyB0aGUgbGF0dGVyIGZpcnN0LlxuICBjb25zdCBmbXQgPSAoKGNvbnRlbnQgfHwge30pLmZtdCB8fCBbXSlbMF07XG4gIGlmICghZm10KSB7XG4gICAgLy8gVW5yZWNvZ25pemVkIGNvbnRlbnQuXG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cblxuICBsZXQgZW50O1xuICBpZiAoZm10LnRwID09ICdWQycpIHtcbiAgICAvLyBKdXN0IGEgZm9ybWF0LCBjb252ZXJ0IHRvIGZvcm1hdCArIGVudGl0eS5cbiAgICBkZWxldGUgZm10LnRwO1xuICAgIGZtdC5rZXkgPSAwO1xuICAgIGVudCA9IHtcbiAgICAgIHRwOiAnVkMnXG4gICAgfTtcbiAgICBjb250ZW50LmVudCA9IFtlbnRdO1xuICB9IGVsc2Uge1xuICAgIGVudCA9IChjb250ZW50LmVudCB8fCBbXSlbZm10LmtleSB8IDBdO1xuICAgIGlmICghZW50IHx8IGVudC50cCAhPSAnVkMnKSB7XG4gICAgICAvLyBOb3QgYSBWQyBlbnRpdHkuXG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9XG4gIH1cbiAgZW50LmRhdGEgPSBlbnQuZGF0YSB8fCB7fTtcbiAgT2JqZWN0LmFzc2lnbihlbnQuZGF0YSwgcGFyYW1zKTtcbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgcXVvdGUgdG8gRHJhZnR5IGRvY3VtZW50LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBoZWFkZXIgLSBRdW90ZSBoZWFkZXIgKHRpdGxlLCBldGMuKS5cbiAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBVSUQgb2YgdGhlIGF1dGhvciB0byBtZW50aW9uLlxuICogQHBhcmFtIHtEcmFmdHl9IGJvZHkgLSBCb2R5IG9mIHRoZSBxdW90ZWQgbWVzc2FnZS5cbiAqXG4gKiBAcmV0dXJucyBSZXBseSBxdW90ZSBEcmFmdHkgZG9jIHdpdGggdGhlIHF1b3RlIGZvcm1hdHRpbmcuXG4gKi9cbkRyYWZ0eS5xdW90ZSA9IGZ1bmN0aW9uKGhlYWRlciwgdWlkLCBib2R5KSB7XG4gIGNvbnN0IHF1b3RlID0gRHJhZnR5LmFwcGVuZChEcmFmdHkuYXBwZW5kTGluZUJyZWFrKERyYWZ0eS5tZW50aW9uKGhlYWRlciwgdWlkKSksIGJvZHkpO1xuXG4gIC8vIFdyYXAgaW50byBhIHF1b3RlLlxuICBxdW90ZS5mbXQucHVzaCh7XG4gICAgYXQ6IDAsXG4gICAgbGVuOiBxdW90ZS50eHQubGVuZ3RoLFxuICAgIHRwOiAnUVEnXG4gIH0pO1xuXG4gIHJldHVybiBxdW90ZTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBEcmFmdHkgZG9jdW1lbnQgd2l0aCBhIG1lbnRpb24uXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBtZW50aW9uZWQgbmFtZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBtZW50aW9uZWQgdXNlciBJRC5cbiAqXG4gKiBAcmV0dXJucyB7RHJhZnR5fSBkb2N1bWVudCB3aXRoIHRoZSBtZW50aW9uLlxuICovXG5EcmFmdHkubWVudGlvbiA9IGZ1bmN0aW9uKG5hbWUsIHVpZCkge1xuICByZXR1cm4ge1xuICAgIHR4dDogbmFtZSB8fCAnJyxcbiAgICBmbXQ6IFt7XG4gICAgICBhdDogMCxcbiAgICAgIGxlbjogKG5hbWUgfHwgJycpLmxlbmd0aCxcbiAgICAgIGtleTogMFxuICAgIH1dLFxuICAgIGVudDogW3tcbiAgICAgIHRwOiAnTU4nLFxuICAgICAgZGF0YToge1xuICAgICAgICB2YWw6IHVpZFxuICAgICAgfVxuICAgIH1dXG4gIH07XG59XG5cbi8qKlxuICogQXBwZW5kIGEgbGluayB0byBhIERyYWZ0eSBkb2N1bWVudC5cbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIERyYWZ0eSBkb2N1bWVudCB0byBhcHBlbmQgbGluayB0by5cbiAqIEBwYXJhbSB7T2JqZWN0fSBsaW5rRGF0YSAtIExpbmsgaW5mbyBpbiBmb3JtYXQgPGNvZGU+e3R4dDogJ2Fua29yIHRleHQnLCB1cmw6ICdodHRwOi8vLi4uJ308L2NvZGU+LlxuICpcbiAqIEByZXR1cm5zIHtEcmFmdHl9IHRoZSBzYW1lIGRvY3VtZW50IGFzIDxjb2RlPmNvbnRlbnQ8L2NvZGU+LlxuICovXG5EcmFmdHkuYXBwZW5kTGluayA9IGZ1bmN0aW9uKGNvbnRlbnQsIGxpbmtEYXRhKSB7XG4gIGNvbnRlbnQgPSBjb250ZW50IHx8IHtcbiAgICB0eHQ6ICcnXG4gIH07XG5cbiAgY29udGVudC5lbnQgPSBjb250ZW50LmVudCB8fCBbXTtcbiAgY29udGVudC5mbXQgPSBjb250ZW50LmZtdCB8fCBbXTtcblxuICBjb250ZW50LmZtdC5wdXNoKHtcbiAgICBhdDogY29udGVudC50eHQubGVuZ3RoLFxuICAgIGxlbjogbGlua0RhdGEudHh0Lmxlbmd0aCxcbiAgICBrZXk6IGNvbnRlbnQuZW50Lmxlbmd0aFxuICB9KTtcbiAgY29udGVudC50eHQgKz0gbGlua0RhdGEudHh0O1xuXG4gIGNvbnN0IGV4ID0ge1xuICAgIHRwOiAnTE4nLFxuICAgIGRhdGE6IHtcbiAgICAgIHVybDogbGlua0RhdGEudXJsXG4gICAgfVxuICB9XG4gIGNvbnRlbnQuZW50LnB1c2goZXgpO1xuXG4gIHJldHVybiBjb250ZW50O1xufVxuXG4vKipcbiAqIEFwcGVuZCBpbWFnZSB0byBEcmFmdHkgZG9jdW1lbnQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBkb2N1bWVudCB0byBhZGQgaW1hZ2UgdG8uXG4gKiBAcGFyYW0ge0ltYWdlRGVzY30gaW1hZ2VEZXNjIC0gb2JqZWN0IHdpdGggaW1hZ2UgcGFyYW1lbmV0cy5cbiAqXG4gKiBAcmV0dXJuIHtEcmFmdHl9IHVwZGF0ZWQgZG9jdW1lbnQuXG4gKi9cbkRyYWZ0eS5hcHBlbmRJbWFnZSA9IGZ1bmN0aW9uKGNvbnRlbnQsIGltYWdlRGVzYykge1xuICBjb250ZW50ID0gY29udGVudCB8fCB7XG4gICAgdHh0OiAnJ1xuICB9O1xuICBjb250ZW50LnR4dCArPSAnICc7XG4gIHJldHVybiBEcmFmdHkuaW5zZXJ0SW1hZ2UoY29udGVudCwgY29udGVudC50eHQubGVuZ3RoIC0gMSwgaW1hZ2VEZXNjKTtcbn1cblxuLyoqXG4gKiBBcHBlbmQgYXVkaW8gcmVjb2RyaW5nIHRvIERyYWZ0eSBkb2N1bWVudC5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIGRvY3VtZW50IHRvIGFkZCByZWNvcmRpbmcgdG8uXG4gKiBAcGFyYW0ge0F1ZGlvRGVzY30gYXVkaW9EZXNjIC0gb2JqZWN0IHdpdGggYXVkaW8gZGF0YS5cbiAqXG4gKiBAcmV0dXJuIHtEcmFmdHl9IHVwZGF0ZWQgZG9jdW1lbnQuXG4gKi9cbkRyYWZ0eS5hcHBlbmRBdWRpbyA9IGZ1bmN0aW9uKGNvbnRlbnQsIGF1ZGlvRGVzYykge1xuICBjb250ZW50ID0gY29udGVudCB8fCB7XG4gICAgdHh0OiAnJ1xuICB9O1xuICBjb250ZW50LnR4dCArPSAnICc7XG4gIHJldHVybiBEcmFmdHkuaW5zZXJ0QXVkaW8oY29udGVudCwgY29udGVudC50eHQubGVuZ3RoIC0gMSwgYXVkaW9EZXNjKTtcbn1cblxuLyoqXG4gKiBAdHlwZWRlZiBEcmFmdHkuQXR0YWNobWVudERlc2NcbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEB0eXBlIE9iamVjdFxuICogQHBhcmFtIHtzdHJpbmd9IG1pbWUgLSBtaW1lLXR5cGUgb2YgdGhlIGF0dGFjaG1lbnQsIGUuZy4gXCJhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cIlxuICogQHBhcmFtIHtzdHJpbmd9IGRhdGEgLSBiYXNlNjQtZW5jb2RlZCBpbi1iYW5kIGNvbnRlbnQgb2Ygc21hbGwgYXR0YWNobWVudHMuIENvdWxkIGJlIG51bGwvdW5kZWZpbmVkLlxuICogQHBhcmFtIHtzdHJpbmd9IGZpbGVuYW1lIC0gZmlsZSBuYW1lIHN1Z2dlc3Rpb24gZm9yIGRvd25sb2FkaW5nIHRoZSBhdHRhY2htZW50LlxuICogQHBhcmFtIHtpbnRlZ2VyfSBzaXplIC0gc2l6ZSBvZiB0aGUgZmlsZSBpbiBieXRlcy4gVHJlYXQgaXMgYXMgYW4gdW50cnVzdGVkIGhpbnQuXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVmdXJsIC0gcmVmZXJlbmNlIHRvIHRoZSBvdXQtb2YtYmFuZCBjb250ZW50LiBDb3VsZCBiZSBudWxsL3VuZGVmaW5lZC5cbiAqIEBwYXJhbSB7UHJvbWlzZX0gdXJsUHJvbWlzZSAtIFByb21pc2Ugd2hpY2ggcmV0dXJucyBjb250ZW50IFVSTCB3aGVuIHJlc29sdmVkLlxuICovXG5cbi8qKlxuICogQXR0YWNoIGZpbGUgdG8gRHJhZnR5IGNvbnRlbnQuIEVpdGhlciBhcyBhIGJsb2Igb3IgYXMgYSByZWZlcmVuY2UuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBkb2N1bWVudCB0byBhdHRhY2ggZmlsZSB0by5cbiAqIEBwYXJhbSB7QXR0YWNobWVudERlc2N9IG9iamVjdCAtIGNvbnRhaW5pbmcgYXR0YWNobWVudCBkZXNjcmlwdGlvbiBhbmQgZGF0YS5cbiAqXG4gKiBAcmV0dXJuIHtEcmFmdHl9IHVwZGF0ZWQgZG9jdW1lbnQuXG4gKi9cbkRyYWZ0eS5hdHRhY2hGaWxlID0gZnVuY3Rpb24oY29udGVudCwgYXR0YWNobWVudERlc2MpIHtcbiAgY29udGVudCA9IGNvbnRlbnQgfHwge1xuICAgIHR4dDogJydcbiAgfTtcblxuICBjb250ZW50LmVudCA9IGNvbnRlbnQuZW50IHx8IFtdO1xuICBjb250ZW50LmZtdCA9IGNvbnRlbnQuZm10IHx8IFtdO1xuXG4gIGNvbnRlbnQuZm10LnB1c2goe1xuICAgIGF0OiAtMSxcbiAgICBsZW46IDAsXG4gICAga2V5OiBjb250ZW50LmVudC5sZW5ndGhcbiAgfSk7XG5cbiAgY29uc3QgZXggPSB7XG4gICAgdHA6ICdFWCcsXG4gICAgZGF0YToge1xuICAgICAgbWltZTogYXR0YWNobWVudERlc2MubWltZSxcbiAgICAgIHZhbDogYXR0YWNobWVudERlc2MuZGF0YSxcbiAgICAgIG5hbWU6IGF0dGFjaG1lbnREZXNjLmZpbGVuYW1lLFxuICAgICAgcmVmOiBhdHRhY2htZW50RGVzYy5yZWZ1cmwsXG4gICAgICBzaXplOiBhdHRhY2htZW50RGVzYy5zaXplIHwgMFxuICAgIH1cbiAgfVxuICBpZiAoYXR0YWNobWVudERlc2MudXJsUHJvbWlzZSkge1xuICAgIGV4LmRhdGEuX3Byb2Nlc3NpbmcgPSB0cnVlO1xuICAgIGF0dGFjaG1lbnREZXNjLnVybFByb21pc2UudGhlbihcbiAgICAgICh1cmwpID0+IHtcbiAgICAgICAgZXguZGF0YS5yZWYgPSB1cmw7XG4gICAgICAgIGV4LmRhdGEuX3Byb2Nlc3NpbmcgPSB1bmRlZmluZWQ7XG4gICAgICB9LFxuICAgICAgKGVycikgPT4ge1xuICAgICAgICAvKiBjYXRjaCB0aGUgZXJyb3IsIG90aGVyd2lzZSBpdCB3aWxsIGFwcGVhciBpbiB0aGUgY29uc29sZS4gKi9cbiAgICAgICAgZXguZGF0YS5fcHJvY2Vzc2luZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICApO1xuICB9XG4gIGNvbnRlbnQuZW50LnB1c2goZXgpO1xuXG4gIHJldHVybiBjb250ZW50O1xufVxuXG4vKipcbiAqIFdyYXBzIGRyYWZ0eSBkb2N1bWVudCBpbnRvIGEgc2ltcGxlIGZvcm1hdHRpbmcgc3R5bGUuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl8c3RyaW5nfSBjb250ZW50IC0gZG9jdW1lbnQgb3Igc3RyaW5nIHRvIHdyYXAgaW50byBhIHN0eWxlLlxuICogQHBhcmFtIHtzdHJpbmd9IHN0eWxlIC0gdHdvLWxldHRlciBzdHlsZSB0byB3cmFwIGludG8uXG4gKiBAcGFyYW0ge251bWJlcn0gYXQgLSBpbmRleCB3aGVyZSB0aGUgc3R5bGUgc3RhcnRzLCBkZWZhdWx0IDAuXG4gKiBAcGFyYW0ge251bWJlcn0gbGVuIC0gbGVuZ3RoIG9mIHRoZSBmb3JtIGNvbnRlbnQsIGRlZmF1bHQgYWxsIG9mIGl0LlxuICpcbiAqIEByZXR1cm4ge0RyYWZ0eX0gdXBkYXRlZCBkb2N1bWVudC5cbiAqL1xuRHJhZnR5LndyYXBJbnRvID0gZnVuY3Rpb24oY29udGVudCwgc3R5bGUsIGF0LCBsZW4pIHtcbiAgaWYgKHR5cGVvZiBjb250ZW50ID09ICdzdHJpbmcnKSB7XG4gICAgY29udGVudCA9IHtcbiAgICAgIHR4dDogY29udGVudFxuICAgIH07XG4gIH1cbiAgY29udGVudC5mbXQgPSBjb250ZW50LmZtdCB8fCBbXTtcblxuICBjb250ZW50LmZtdC5wdXNoKHtcbiAgICBhdDogYXQgfHwgMCxcbiAgICBsZW46IGxlbiB8fCBjb250ZW50LnR4dC5sZW5ndGgsXG4gICAgdHA6IHN0eWxlLFxuICB9KTtcblxuICByZXR1cm4gY29udGVudDtcbn1cblxuLyoqXG4gKiBXcmFwcyBjb250ZW50IGludG8gYW4gaW50ZXJhY3RpdmUgZm9ybS5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eXxzdHJpbmd9IGNvbnRlbnQgLSB0byB3cmFwIGludG8gYSBmb3JtLlxuICogQHBhcmFtIHtudW1iZXJ9IGF0IC0gaW5kZXggd2hlcmUgdGhlIGZvcm1zIHN0YXJ0cy5cbiAqIEBwYXJhbSB7bnVtYmVyfSBsZW4gLSBsZW5ndGggb2YgdGhlIGZvcm0gY29udGVudC5cbiAqXG4gKiBAcmV0dXJuIHtEcmFmdHl9IHVwZGF0ZWQgZG9jdW1lbnQuXG4gKi9cbkRyYWZ0eS53cmFwQXNGb3JtID0gZnVuY3Rpb24oY29udGVudCwgYXQsIGxlbikge1xuICByZXR1cm4gRHJhZnR5LndyYXBJbnRvKGNvbnRlbnQsICdGTScsIGF0LCBsZW4pO1xufVxuXG4vKipcbiAqIEluc2VydCBjbGlja2FibGUgYnV0dG9uIGludG8gRHJhZnR5IGRvY3VtZW50LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fHN0cmluZ30gY29udGVudCAtIERyYWZ0eSBkb2N1bWVudCB0byBpbnNlcnQgYnV0dG9uIHRvIG9yIGEgc3RyaW5nIHRvIGJlIHVzZWQgYXMgYnV0dG9uIHRleHQuXG4gKiBAcGFyYW0ge251bWJlcn0gYXQgLSBsb2NhdGlvbiB3aGVyZSB0aGUgYnV0dG9uIGlzIGluc2VydGVkLlxuICogQHBhcmFtIHtudW1iZXJ9IGxlbiAtIHRoZSBsZW5ndGggb2YgdGhlIHRleHQgdG8gYmUgdXNlZCBhcyBidXR0b24gdGl0bGUuXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIHRoZSBidXR0b24uIENsaWVudCBzaG91bGQgcmV0dXJuIGl0IHRvIHRoZSBzZXJ2ZXIgd2hlbiB0aGUgYnV0dG9uIGlzIGNsaWNrZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gYWN0aW9uVHlwZSAtIHRoZSB0eXBlIG9mIHRoZSBidXR0b24sIG9uZSBvZiAndXJsJyBvciAncHViJy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBhY3Rpb25WYWx1ZSAtIHRoZSB2YWx1ZSB0byByZXR1cm4gb24gY2xpY2s6XG4gKiBAcGFyYW0ge3N0cmluZ30gcmVmVXJsIC0gdGhlIFVSTCB0byBnbyB0byB3aGVuIHRoZSAndXJsJyBidXR0b24gaXMgY2xpY2tlZC5cbiAqXG4gKiBAcmV0dXJuIHtEcmFmdHl9IHVwZGF0ZWQgZG9jdW1lbnQuXG4gKi9cbkRyYWZ0eS5pbnNlcnRCdXR0b24gPSBmdW5jdGlvbihjb250ZW50LCBhdCwgbGVuLCBuYW1lLCBhY3Rpb25UeXBlLCBhY3Rpb25WYWx1ZSwgcmVmVXJsKSB7XG4gIGlmICh0eXBlb2YgY29udGVudCA9PSAnc3RyaW5nJykge1xuICAgIGNvbnRlbnQgPSB7XG4gICAgICB0eHQ6IGNvbnRlbnRcbiAgICB9O1xuICB9XG5cbiAgaWYgKCFjb250ZW50IHx8ICFjb250ZW50LnR4dCB8fCBjb250ZW50LnR4dC5sZW5ndGggPCBhdCArIGxlbikge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaWYgKGxlbiA8PSAwIHx8IFsndXJsJywgJ3B1YiddLmluZGV4T2YoYWN0aW9uVHlwZSkgPT0gLTEpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICAvLyBFbnN1cmUgcmVmVXJsIGlzIGEgc3RyaW5nLlxuICBpZiAoYWN0aW9uVHlwZSA9PSAndXJsJyAmJiAhcmVmVXJsKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmVmVXJsID0gJycgKyByZWZVcmw7XG5cbiAgY29udGVudC5lbnQgPSBjb250ZW50LmVudCB8fCBbXTtcbiAgY29udGVudC5mbXQgPSBjb250ZW50LmZtdCB8fCBbXTtcblxuICBjb250ZW50LmZtdC5wdXNoKHtcbiAgICBhdDogYXQgfCAwLFxuICAgIGxlbjogbGVuLFxuICAgIGtleTogY29udGVudC5lbnQubGVuZ3RoXG4gIH0pO1xuICBjb250ZW50LmVudC5wdXNoKHtcbiAgICB0cDogJ0JOJyxcbiAgICBkYXRhOiB7XG4gICAgICBhY3Q6IGFjdGlvblR5cGUsXG4gICAgICB2YWw6IGFjdGlvblZhbHVlLFxuICAgICAgcmVmOiByZWZVcmwsXG4gICAgICBuYW1lOiBuYW1lXG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gY29udGVudDtcbn1cblxuLyoqXG4gKiBBcHBlbmQgY2xpY2thYmxlIGJ1dHRvbiB0byBEcmFmdHkgZG9jdW1lbnQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl8c3RyaW5nfSBjb250ZW50IC0gRHJhZnR5IGRvY3VtZW50IHRvIGluc2VydCBidXR0b24gdG8gb3IgYSBzdHJpbmcgdG8gYmUgdXNlZCBhcyBidXR0b24gdGV4dC5cbiAqIEBwYXJhbSB7c3RyaW5nfSB0aXRsZSAtIHRoZSB0ZXh0IHRvIGJlIHVzZWQgYXMgYnV0dG9uIHRpdGxlLlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSB0aGUgYnV0dG9uLiBDbGllbnQgc2hvdWxkIHJldHVybiBpdCB0byB0aGUgc2VydmVyIHdoZW4gdGhlIGJ1dHRvbiBpcyBjbGlja2VkLlxuICogQHBhcmFtIHtzdHJpbmd9IGFjdGlvblR5cGUgLSB0aGUgdHlwZSBvZiB0aGUgYnV0dG9uLCBvbmUgb2YgJ3VybCcgb3IgJ3B1YicuXG4gKiBAcGFyYW0ge3N0cmluZ30gYWN0aW9uVmFsdWUgLSB0aGUgdmFsdWUgdG8gcmV0dXJuIG9uIGNsaWNrOlxuICogQHBhcmFtIHtzdHJpbmd9IHJlZlVybCAtIHRoZSBVUkwgdG8gZ28gdG8gd2hlbiB0aGUgJ3VybCcgYnV0dG9uIGlzIGNsaWNrZWQuXG4gKlxuICogQHJldHVybiB7RHJhZnR5fSB1cGRhdGVkIGRvY3VtZW50LlxuICovXG5EcmFmdHkuYXBwZW5kQnV0dG9uID0gZnVuY3Rpb24oY29udGVudCwgdGl0bGUsIG5hbWUsIGFjdGlvblR5cGUsIGFjdGlvblZhbHVlLCByZWZVcmwpIHtcbiAgY29udGVudCA9IGNvbnRlbnQgfHwge1xuICAgIHR4dDogJydcbiAgfTtcbiAgY29uc3QgYXQgPSBjb250ZW50LnR4dC5sZW5ndGg7XG4gIGNvbnRlbnQudHh0ICs9IHRpdGxlO1xuICByZXR1cm4gRHJhZnR5Lmluc2VydEJ1dHRvbihjb250ZW50LCBhdCwgdGl0bGUubGVuZ3RoLCBuYW1lLCBhY3Rpb25UeXBlLCBhY3Rpb25WYWx1ZSwgcmVmVXJsKTtcbn1cblxuLyoqXG4gKiBBdHRhY2ggYSBnZW5lcmljIEpTIG9iamVjdC4gVGhlIG9iamVjdCBpcyBhdHRhY2hlZCBhcyBhIGpzb24gc3RyaW5nLlxuICogSW50ZW5kZWQgZm9yIHJlcHJlc2VudGluZyBhIGZvcm0gcmVzcG9uc2UuXG4gKlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gRHJhZnR5IGRvY3VtZW50IHRvIGF0dGFjaCBmaWxlIHRvLlxuICogQHBhcmFtIHtPYmplY3R9IGRhdGEgLSBkYXRhIHRvIGNvbnZlcnQgdG8ganNvbiBzdHJpbmcgYW5kIGF0dGFjaC5cbiAqIEByZXR1cm5zIHtEcmFmdHl9IHRoZSBzYW1lIGRvY3VtZW50IGFzIDxjb2RlPmNvbnRlbnQ8L2NvZGU+LlxuICovXG5EcmFmdHkuYXR0YWNoSlNPTiA9IGZ1bmN0aW9uKGNvbnRlbnQsIGRhdGEpIHtcbiAgY29udGVudCA9IGNvbnRlbnQgfHwge1xuICAgIHR4dDogJydcbiAgfTtcbiAgY29udGVudC5lbnQgPSBjb250ZW50LmVudCB8fCBbXTtcbiAgY29udGVudC5mbXQgPSBjb250ZW50LmZtdCB8fCBbXTtcblxuICBjb250ZW50LmZtdC5wdXNoKHtcbiAgICBhdDogLTEsXG4gICAgbGVuOiAwLFxuICAgIGtleTogY29udGVudC5lbnQubGVuZ3RoXG4gIH0pO1xuXG4gIGNvbnRlbnQuZW50LnB1c2goe1xuICAgIHRwOiAnRVgnLFxuICAgIGRhdGE6IHtcbiAgICAgIG1pbWU6IEpTT05fTUlNRV9UWVBFLFxuICAgICAgdmFsOiBkYXRhXG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gY29udGVudDtcbn1cbi8qKlxuICogQXBwZW5kIGxpbmUgYnJlYWsgdG8gYSBEcmFmdHkgZG9jdW1lbnQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBEcmFmdHkgZG9jdW1lbnQgdG8gYXBwZW5kIGxpbmVicmVhayB0by5cbiAqIEByZXR1cm5zIHtEcmFmdHl9IHRoZSBzYW1lIGRvY3VtZW50IGFzIDxjb2RlPmNvbnRlbnQ8L2NvZGU+LlxuICovXG5EcmFmdHkuYXBwZW5kTGluZUJyZWFrID0gZnVuY3Rpb24oY29udGVudCkge1xuICBjb250ZW50ID0gY29udGVudCB8fCB7XG4gICAgdHh0OiAnJ1xuICB9O1xuICBjb250ZW50LmZtdCA9IGNvbnRlbnQuZm10IHx8IFtdO1xuICBjb250ZW50LmZtdC5wdXNoKHtcbiAgICBhdDogY29udGVudC50eHQubGVuZ3RoLFxuICAgIGxlbjogMSxcbiAgICB0cDogJ0JSJ1xuICB9KTtcbiAgY29udGVudC50eHQgKz0gJyAnO1xuXG4gIHJldHVybiBjb250ZW50O1xufVxuLyoqXG4gKiBHaXZlbiBEcmFmdHkgZG9jdW1lbnQsIGNvbnZlcnQgaXQgdG8gSFRNTC5cbiAqIE5vIGF0dGVtcHQgaXMgbWFkZSB0byBzdHJpcCBwcmUtZXhpc3RpbmcgaHRtbCBtYXJrdXAuXG4gKiBUaGlzIGlzIHBvdGVudGlhbGx5IHVuc2FmZSBiZWNhdXNlIDxjb2RlPmNvbnRlbnQudHh0PC9jb2RlPiBtYXkgY29udGFpbiBtYWxpY2lvdXMgSFRNTFxuICogbWFya3VwLlxuICogQG1lbWJlcm9mIFRpbm9kZS5EcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gZG9jIC0gZG9jdW1lbnQgdG8gY29udmVydC5cbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBIVE1MLXJlcHJlc2VudGF0aW9uIG9mIGNvbnRlbnQuXG4gKi9cbkRyYWZ0eS5VTlNBRkVfdG9IVE1MID0gZnVuY3Rpb24oZG9jKSB7XG4gIGxldCB0cmVlID0gZHJhZnR5VG9UcmVlKGRvYyk7XG4gIGNvbnN0IGh0bWxGb3JtYXR0ZXIgPSBmdW5jdGlvbih0eXBlLCBkYXRhLCB2YWx1ZXMpIHtcbiAgICBjb25zdCB0YWcgPSBERUNPUkFUT1JTW3R5cGVdO1xuICAgIGxldCByZXN1bHQgPSB2YWx1ZXMgPyB2YWx1ZXMuam9pbignJykgOiAnJztcbiAgICBpZiAodGFnKSB7XG4gICAgICByZXN1bHQgPSB0YWcub3BlbihkYXRhKSArIHJlc3VsdCArIHRhZy5jbG9zZShkYXRhKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbiAgcmV0dXJuIHRyZWVCb3R0b21VcCh0cmVlLCBodG1sRm9ybWF0dGVyLCAwKTtcbn1cblxuLyoqXG4gKiBDYWxsYmFjayBmb3IgYXBwbHlpbmcgY3VzdG9tIGZvcm1hdHRpbmcgdG8gYSBEcmFmdHkgZG9jdW1lbnQuXG4gKiBDYWxsZWQgb25jZSBmb3IgZWFjaCBzdHlsZSBzcGFuLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBjYWxsYmFjayBGb3JtYXR0ZXJcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHlsZSAtIHN0eWxlIGNvZGUgc3VjaCBhcyBcIlNUXCIgb3IgXCJJTVwiLlxuICogQHBhcmFtIHtPYmplY3R9IGRhdGEgLSBlbnRpdHkncyBkYXRhLlxuICogQHBhcmFtIHtPYmplY3R9IHZhbHVlcyAtIHBvc3NpYmx5IHN0eWxlZCBzdWJzcGFucyBjb250YWluZWQgaW4gdGhpcyBzdHlsZSBzcGFuLlxuICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IC0gaW5kZXggb2YgdGhlIGVsZW1lbnQgZ3VhcmFudGVlZCB0byBiZSB1bmlxdWUuXG4gKi9cblxuLyoqXG4gKiBDb252ZXJ0IERyYWZ0eSBkb2N1bWVudCB0byBhIHJlcHJlc2VudGF0aW9uIHN1aXRhYmxlIGZvciBkaXNwbGF5LlxuICogVGhlIDxjb2RlPmNvbnRleHQ8L2NvZGU+IG1heSBleHBvc2UgYSBmdW5jdGlvbiA8Y29kZT5nZXRGb3JtYXR0ZXIoc3R5bGUpPC9jb2RlPi4gSWYgaXQncyBhdmFpbGFibGVcbiAqIGl0IHdpbGwgY2FsbCBpdCB0byBvYnRhaW4gYSA8Y29kZT5mb3JtYXR0ZXI8L2NvZGU+IGZvciBhIHN1YnRyZWUgb2Ygc3R5bGVzIHVuZGVyIHRoZSA8Y29kZT5zdHlsZTwvY29kZT4uXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl8T2JqZWN0fSBjb250ZW50IC0gRHJhZnR5IGRvY3VtZW50IHRvIHRyYW5zZm9ybS5cbiAqIEBwYXJhbSB7Rm9ybWF0dGVyfSBmb3JtYXR0ZXIgLSBjYWxsYmFjayB3aGljaCBmb3JtYXRzIGluZGl2aWR1YWwgZWxlbWVudHMuXG4gKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCAtIGNvbnRleHQgcHJvdmlkZWQgdG8gZm9ybWF0dGVyIGFzIDxjb2RlPnRoaXM8L2NvZGU+LlxuICpcbiAqIEByZXR1cm4ge09iamVjdH0gdHJhbnNmb3JtZWQgb2JqZWN0XG4gKi9cbkRyYWZ0eS5mb3JtYXQgPSBmdW5jdGlvbihvcmlnaW5hbCwgZm9ybWF0dGVyLCBjb250ZXh0KSB7XG4gIHJldHVybiB0cmVlQm90dG9tVXAoZHJhZnR5VG9UcmVlKG9yaWdpbmFsKSwgZm9ybWF0dGVyLCAwLCBbXSwgY29udGV4dCk7XG59XG5cbi8qKlxuICogU2hvcnRlbiBEcmFmdHkgZG9jdW1lbnQgbWFraW5nIHRoZSBkcmFmdHkgdGV4dCBubyBsb25nZXIgdGhhbiB0aGUgbGltaXQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl8c3RyaW5nfSBvcmlnaW5hbCAtIERyYWZ0eSBvYmplY3QgdG8gc2hvcnRlbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBsaW1pdCAtIGxlbmd0aCBpbiBjaGFyYWNyZXRzIHRvIHNob3J0ZW4gdG8uXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGxpZ2h0IC0gcmVtb3ZlIGhlYXZ5IGRhdGEgZnJvbSBlbnRpdGllcy5cbiAqIEByZXR1cm5zIG5ldyBzaG9ydGVuZWQgRHJhZnR5IG9iamVjdCBsZWF2aW5nIHRoZSBvcmlnaW5hbCBpbnRhY3QuXG4gKi9cbkRyYWZ0eS5zaG9ydGVuID0gZnVuY3Rpb24ob3JpZ2luYWwsIGxpbWl0LCBsaWdodCkge1xuICBsZXQgdHJlZSA9IGRyYWZ0eVRvVHJlZShvcmlnaW5hbCk7XG4gIHRyZWUgPSBzaG9ydGVuVHJlZSh0cmVlLCBsaW1pdCwgJ+KApicpO1xuICBpZiAodHJlZSAmJiBsaWdodCkge1xuICAgIHRyZWUgPSBsaWdodEVudGl0eSh0cmVlKTtcbiAgfVxuICByZXR1cm4gdHJlZVRvRHJhZnR5KHt9LCB0cmVlLCBbXSk7XG59XG5cbi8qKlxuICogVHJhbnNmb3JtIERyYWZ0eSBkb2MgZm9yIGZvcndhcmRpbmc6IHN0cmlwIGxlYWRpbmcgQG1lbnRpb24gYW5kIGFueSBsZWFkaW5nIGxpbmUgYnJlYWtzIG9yIHdoaXRlc3BhY2UuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl8c3RyaW5nfSBvcmlnaW5hbCAtIERyYWZ0eSBvYmplY3QgdG8gc2hvcnRlbi5cbiAqIEByZXR1cm5zIGNvbnZlcnRlZCBEcmFmdHkgb2JqZWN0IGxlYXZpbmcgdGhlIG9yaWdpbmFsIGludGFjdC5cbiAqL1xuRHJhZnR5LmZvcndhcmRlZENvbnRlbnQgPSBmdW5jdGlvbihvcmlnaW5hbCkge1xuICBsZXQgdHJlZSA9IGRyYWZ0eVRvVHJlZShvcmlnaW5hbCk7XG4gIGNvbnN0IHJtTWVudGlvbiA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICBpZiAobm9kZS50eXBlID09ICdNTicpIHtcbiAgICAgIGlmICghbm9kZS5wYXJlbnQgfHwgIW5vZGUucGFyZW50LnR5cGUpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBub2RlO1xuICB9XG4gIC8vIFN0cmlwIGxlYWRpbmcgbWVudGlvbi5cbiAgdHJlZSA9IHRyZWVUb3BEb3duKHRyZWUsIHJtTWVudGlvbik7XG4gIC8vIFJlbW92ZSBsZWFkaW5nIHdoaXRlc3BhY2UuXG4gIHRyZWUgPSBsVHJpbSh0cmVlKTtcbiAgLy8gQ29udmVydCBiYWNrIHRvIERyYWZ0eS5cbiAgcmV0dXJuIHRyZWVUb0RyYWZ0eSh7fSwgdHJlZSwgW10pO1xufVxuXG4vKipcbiAqIFByZXBhcmUgRHJhZnR5IGRvYyBmb3Igd3JhcHBpbmcgaW50byBRUSBhcyBhIHJlcGx5OlxuICogIC0gUmVwbGFjZSBmb3J3YXJkaW5nIG1lbnRpb24gd2l0aCBzeW1ib2wgJ+KepicgYW5kIHJlbW92ZSBkYXRhIChVSUQpLlxuICogIC0gUmVtb3ZlIHF1b3RlZCB0ZXh0IGNvbXBsZXRlbHkuXG4gKiAgLSBSZXBsYWNlIGxpbmUgYnJlYWtzIHdpdGggc3BhY2VzLlxuICogIC0gU3RyaXAgZW50aXRpZXMgb2YgaGVhdnkgY29udGVudC5cbiAqICAtIE1vdmUgYXR0YWNobWVudHMgdG8gdGhlIGVuZCBvZiB0aGUgZG9jdW1lbnQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl8c3RyaW5nfSBvcmlnaW5hbCAtIERyYWZ0eSBvYmplY3QgdG8gc2hvcnRlbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBsaW1pdCAtIGxlbmd0aCBpbiBjaGFyYWN0ZXJzIHRvIHNob3J0ZW4gdG8uXG4gKiBAcmV0dXJucyBjb252ZXJ0ZWQgRHJhZnR5IG9iamVjdCBsZWF2aW5nIHRoZSBvcmlnaW5hbCBpbnRhY3QuXG4gKi9cbkRyYWZ0eS5yZXBseUNvbnRlbnQgPSBmdW5jdGlvbihvcmlnaW5hbCwgbGltaXQpIHtcbiAgY29uc3QgY29udk1OblFRbkJSID0gZnVuY3Rpb24obm9kZSkge1xuICAgIGlmIChub2RlLnR5cGUgPT0gJ1FRJykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBlbHNlIGlmIChub2RlLnR5cGUgPT0gJ01OJykge1xuICAgICAgaWYgKCghbm9kZS5wYXJlbnQgfHwgIW5vZGUucGFyZW50LnR5cGUpICYmIChub2RlLnRleHQgfHwgJycpLnN0YXJ0c1dpdGgoJ+KepicpKSB7XG4gICAgICAgIG5vZGUudGV4dCA9ICfinqYnO1xuICAgICAgICBkZWxldGUgbm9kZS5jaGlsZHJlbjtcbiAgICAgICAgZGVsZXRlIG5vZGUuZGF0YTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG5vZGUudHlwZSA9PSAnQlInKSB7XG4gICAgICBub2RlLnRleHQgPSAnICc7XG4gICAgICBkZWxldGUgbm9kZS50eXBlO1xuICAgICAgZGVsZXRlIG5vZGUuY2hpbGRyZW47XG4gICAgfVxuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgbGV0IHRyZWUgPSBkcmFmdHlUb1RyZWUob3JpZ2luYWwpO1xuICBpZiAoIXRyZWUpIHtcbiAgICByZXR1cm4gb3JpZ2luYWw7XG4gIH1cblxuICAvLyBTdHJpcCBsZWFkaW5nIG1lbnRpb24uXG4gIHRyZWUgPSB0cmVlVG9wRG93bih0cmVlLCBjb252TU5uUVFuQlIpO1xuICAvLyBNb3ZlIGF0dGFjaG1lbnRzIHRvIHRoZSBlbmQgb2YgdGhlIGRvYy5cbiAgdHJlZSA9IGF0dGFjaG1lbnRzVG9FbmQodHJlZSwgTUFYX1BSRVZJRVdfQVRUQUNITUVOVFMpO1xuICAvLyBTaG9ydGVuIHRoZSBkb2MuXG4gIHRyZWUgPSBzaG9ydGVuVHJlZSh0cmVlLCBsaW1pdCwgJ+KApicpO1xuICAvLyBTdHJpcCBoZWF2eSBlbGVtZW50cyBleGNlcHQgSU0uZGF0YVsndmFsJ10gKGhhdmUgdG8ga2VlcCB0aGVtIHRvIGdlbmVyYXRlIHByZXZpZXdzIGxhdGVyKS5cbiAgdHJlZSA9IGxpZ2h0RW50aXR5KHRyZWUsIG5vZGUgPT4gKG5vZGUudHlwZSA9PSAnSU0nID8gWyd2YWwnXSA6IG51bGwpKTtcbiAgLy8gQ29udmVydCBiYWNrIHRvIERyYWZ0eS5cbiAgcmV0dXJuIHRyZWVUb0RyYWZ0eSh7fSwgdHJlZSwgW10pO1xufVxuXG5cbi8qKlxuICogR2VuZXJhdGUgZHJhZnR5IHByZXZpZXc6XG4gKiAgLSBTaG9ydGVuIHRoZSBkb2N1bWVudC5cbiAqICAtIFN0cmlwIGFsbCBoZWF2eSBlbnRpdHkgZGF0YSBsZWF2aW5nIGp1c3QgaW5saW5lIHN0eWxlcyBhbmQgZW50aXR5IHJlZmVyZW5jZXMuXG4gKiAgLSBSZXBsYWNlIGxpbmUgYnJlYWtzIHdpdGggc3BhY2VzLlxuICogIC0gUmVwbGFjZSBjb250ZW50IG9mIFFRIHdpdGggYSBzcGFjZS5cbiAqICAtIFJlcGxhY2UgZm9yd2FyZGluZyBtZW50aW9uIHdpdGggc3ltYm9sICfinqYnLlxuICogbW92ZSBhbGwgYXR0YWNobWVudHMgdG8gdGhlIGVuZCBvZiB0aGUgZG9jdW1lbnQgYW5kIG1ha2UgdGhlbSB2aXNpYmxlLlxuICogVGhlIDxjb2RlPmNvbnRleHQ8L2NvZGU+IG1heSBleHBvc2UgYSBmdW5jdGlvbiA8Y29kZT5nZXRGb3JtYXR0ZXIoc3R5bGUpPC9jb2RlPi4gSWYgaXQncyBhdmFpbGFibGVcbiAqIGl0IHdpbGwgY2FsbCBpdCB0byBvYnRhaW4gYSA8Y29kZT5mb3JtYXR0ZXI8L2NvZGU+IGZvciBhIHN1YnRyZWUgb2Ygc3R5bGVzIHVuZGVyIHRoZSA8Y29kZT5zdHlsZTwvY29kZT4uXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl8c3RyaW5nfSBvcmlnaW5hbCAtIERyYWZ0eSBvYmplY3QgdG8gc2hvcnRlbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBsaW1pdCAtIGxlbmd0aCBpbiBjaGFyYWN0ZXJzIHRvIHNob3J0ZW4gdG8uXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGZvcndhcmRpbmcgLSB0aGlzIGEgZm9yd2FyZGluZyBtZXNzYWdlIHByZXZpZXcuXG4gKiBAcmV0dXJucyBuZXcgc2hvcnRlbmVkIERyYWZ0eSBvYmplY3QgbGVhdmluZyB0aGUgb3JpZ2luYWwgaW50YWN0LlxuICovXG5EcmFmdHkucHJldmlldyA9IGZ1bmN0aW9uKG9yaWdpbmFsLCBsaW1pdCwgZm9yd2FyZGluZykge1xuICBsZXQgdHJlZSA9IGRyYWZ0eVRvVHJlZShvcmlnaW5hbCk7XG5cbiAgLy8gTW92ZSBhdHRhY2htZW50cyB0byB0aGUgZW5kLlxuICB0cmVlID0gYXR0YWNobWVudHNUb0VuZCh0cmVlLCBNQVhfUFJFVklFV19BVFRBQ0hNRU5UUyk7XG5cbiAgLy8gQ29udmVydCBsZWFkaW5nIG1lbnRpb24gdG8gJ+KepicgYW5kIHJlcGxhY2UgUVEgYW5kIEJSIHdpdGggYSBzcGFjZSAnICcuXG4gIGNvbnN0IGNvbnZNTm5RUW5CUiA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICBpZiAobm9kZS50eXBlID09ICdNTicpIHtcbiAgICAgIGlmICgoIW5vZGUucGFyZW50IHx8ICFub2RlLnBhcmVudC50eXBlKSAmJiAobm9kZS50ZXh0IHx8ICcnKS5zdGFydHNXaXRoKCfinqYnKSkge1xuICAgICAgICBub2RlLnRleHQgPSAn4p6mJztcbiAgICAgICAgZGVsZXRlIG5vZGUuY2hpbGRyZW47XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChub2RlLnR5cGUgPT0gJ1FRJykge1xuICAgICAgbm9kZS50ZXh0ID0gJyAnO1xuICAgICAgZGVsZXRlIG5vZGUuY2hpbGRyZW47XG4gICAgfSBlbHNlIGlmIChub2RlLnR5cGUgPT0gJ0JSJykge1xuICAgICAgbm9kZS50ZXh0ID0gJyAnO1xuICAgICAgZGVsZXRlIG5vZGUuY2hpbGRyZW47XG4gICAgICBkZWxldGUgbm9kZS50eXBlO1xuICAgIH1cbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuICB0cmVlID0gdHJlZVRvcERvd24odHJlZSwgY29udk1OblFRbkJSKTtcblxuICB0cmVlID0gc2hvcnRlblRyZWUodHJlZSwgbGltaXQsICfigKYnKTtcbiAgaWYgKGZvcndhcmRpbmcpIHtcbiAgICAvLyBLZWVwIElNIGRhdGEgZm9yIHByZXZpZXcuXG4gICAgdHJlZSA9IGxpZ2h0RW50aXR5KHRyZWUsIG5vZGUgPT4gKG5vZGUudHlwZSA9PSAnSU0nID8gWyd2YWwnXSA6IG51bGwpKTtcbiAgfSBlbHNlIHtcbiAgICB0cmVlID0gbGlnaHRFbnRpdHkodHJlZSk7XG4gIH1cblxuICAvLyBDb252ZXJ0IGJhY2sgdG8gRHJhZnR5LlxuICByZXR1cm4gdHJlZVRvRHJhZnR5KHt9LCB0cmVlLCBbXSk7XG59XG5cbi8qKlxuICogR2l2ZW4gRHJhZnR5IGRvY3VtZW50LCBjb252ZXJ0IGl0IHRvIHBsYWluIHRleHQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBkb2N1bWVudCB0byBjb252ZXJ0IHRvIHBsYWluIHRleHQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBwbGFpbi10ZXh0IHJlcHJlc2VudGF0aW9uIG9mIHRoZSBkcmFmdHkgZG9jdW1lbnQuXG4gKi9cbkRyYWZ0eS50b1BsYWluVGV4dCA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcbiAgcmV0dXJuIHR5cGVvZiBjb250ZW50ID09ICdzdHJpbmcnID8gY29udGVudCA6IGNvbnRlbnQudHh0O1xufVxuXG4vKipcbiAqIENoZWNrIGlmIHRoZSBkb2N1bWVudCBoYXMgbm8gbWFya3VwIGFuZCBubyBlbnRpdGllcy5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIGNvbnRlbnQgdG8gY2hlY2sgZm9yIHByZXNlbmNlIG9mIG1hcmt1cC5cbiAqIEByZXR1cm5zIDxjb2RlPnRydWU8L2NvZGU+IGlzIGNvbnRlbnQgaXMgcGxhaW4gdGV4dCwgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAqL1xuRHJhZnR5LmlzUGxhaW5UZXh0ID0gZnVuY3Rpb24oY29udGVudCkge1xuICByZXR1cm4gdHlwZW9mIGNvbnRlbnQgPT0gJ3N0cmluZycgfHwgIShjb250ZW50LmZtdCB8fCBjb250ZW50LmVudCk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIHRoZSBvYmplY3QgcmVwcmVzZXRzIGlzIGEgdmFsaWQgRHJhZnR5IGRvY3VtZW50LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gY29udGVudCB0byBjaGVjayBmb3IgdmFsaWRpdHkuXG4gKiBAcmV0dXJucyA8Y29kZT50cnVlPC9jb2RlPiBpcyBjb250ZW50IGlzIHZhbGlkLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICovXG5EcmFmdHkuaXNWYWxpZCA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcbiAgaWYgKCFjb250ZW50KSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3Qge1xuICAgIHR4dCxcbiAgICBmbXQsXG4gICAgZW50XG4gIH0gPSBjb250ZW50O1xuXG4gIGlmICghdHh0ICYmIHR4dCAhPT0gJycgJiYgIWZtdCAmJiAhZW50KSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgdHh0X3R5cGUgPSB0eXBlb2YgdHh0O1xuICBpZiAodHh0X3R5cGUgIT0gJ3N0cmluZycgJiYgdHh0X3R5cGUgIT0gJ3VuZGVmaW5lZCcgJiYgdHh0ICE9PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBmbXQgIT0gJ3VuZGVmaW5lZCcgJiYgIUFycmF5LmlzQXJyYXkoZm10KSAmJiBmbXQgIT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAodHlwZW9mIGVudCAhPSAndW5kZWZpbmVkJyAmJiAhQXJyYXkuaXNBcnJheShlbnQpICYmIGVudCAhPT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgZHJhZnR5IGRvY3VtZW50IGhhcyBhdHRhY2htZW50czogc3R5bGUgRVggYW5kIG91dHNpZGUgb2Ygbm9ybWFsIHJlbmRlcmluZyBmbG93LFxuICogaS5lLiA8Y29kZT5hdCA9IC0xPC9jb2RlPi5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIGRvY3VtZW50IHRvIGNoZWNrIGZvciBhdHRhY2htZW50cy5cbiAqIEByZXR1cm5zIDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZXJlIGFyZSBhdHRhY2htZW50cy5cbiAqL1xuRHJhZnR5Lmhhc0F0dGFjaG1lbnRzID0gZnVuY3Rpb24oY29udGVudCkge1xuICBpZiAoIUFycmF5LmlzQXJyYXkoY29udGVudC5mbXQpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGZvciAobGV0IGkgaW4gY29udGVudC5mbXQpIHtcbiAgICBjb25zdCBmbXQgPSBjb250ZW50LmZtdFtpXTtcbiAgICBpZiAoZm10ICYmIGZtdC5hdCA8IDApIHtcbiAgICAgIGNvbnN0IGVudCA9IGNvbnRlbnQuZW50W2ZtdC5rZXkgfCAwXTtcbiAgICAgIHJldHVybiBlbnQgJiYgZW50LnRwID09ICdFWCcgJiYgZW50LmRhdGE7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBDYWxsYmFjayBmb3IgYXBwbHlpbmcgY3VzdG9tIGZvcm1hdHRpbmcvdHJhbnNmb3JtYXRpb24gdG8gYSBEcmFmdHkgZG9jdW1lbnQuXG4gKiBDYWxsZWQgb25jZSBmb3IgZWFjaCBlbnRpdHkuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQGNhbGxiYWNrIEVudGl0eUNhbGxiYWNrXG4gKiBAcGFyYW0ge09iamVjdH0gZGF0YSBlbnRpdHkgZGF0YS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBlbnRpdHkgdHlwZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCBlbnRpdHkncyBpbmRleCBpbiBgY29udGVudC5lbnRgLlxuICovXG5cbi8qKlxuICogRW51bWVyYXRlIGF0dGFjaG1lbnRzOiBzdHlsZSBFWCBhbmQgb3V0c2lkZSBvZiBub3JtYWwgcmVuZGVyaW5nIGZsb3csIGkuZS4gPGNvZGU+YXQgPSAtMTwvY29kZT4uXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBkb2N1bWVudCB0byBwcm9jZXNzIGZvciBhdHRhY2htZW50cy5cbiAqIEBwYXJhbSB7RW50aXR5Q2FsbGJhY2t9IGNhbGxiYWNrIC0gY2FsbGJhY2sgdG8gY2FsbCBmb3IgZWFjaCBhdHRhY2htZW50LlxuICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSB2YWx1ZSBvZiBcInRoaXNcIiBmb3IgY2FsbGJhY2suXG4gKi9cbkRyYWZ0eS5hdHRhY2htZW50cyA9IGZ1bmN0aW9uKGNvbnRlbnQsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShjb250ZW50LmZtdCkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgbGV0IGkgPSAwO1xuICBjb250ZW50LmZtdC5mb3JFYWNoKGZtdCA9PiB7XG4gICAgaWYgKGZtdCAmJiBmbXQuYXQgPCAwKSB7XG4gICAgICBjb25zdCBlbnQgPSBjb250ZW50LmVudFtmbXQua2V5IHwgMF07XG4gICAgICBpZiAoZW50ICYmIGVudC50cCA9PSAnRVgnICYmIGVudC5kYXRhKSB7XG4gICAgICAgIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgZW50LmRhdGEsIGkrKywgJ0VYJyk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgZHJhZnR5IGRvY3VtZW50IGhhcyBlbnRpdGllcy5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIGRvY3VtZW50IHRvIGNoZWNrIGZvciBlbnRpdGllcy5cbiAqIEByZXR1cm5zIDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZXJlIGFyZSBlbnRpdGllcy5cbiAqL1xuRHJhZnR5Lmhhc0VudGl0aWVzID0gZnVuY3Rpb24oY29udGVudCkge1xuICByZXR1cm4gY29udGVudC5lbnQgJiYgY29udGVudC5lbnQubGVuZ3RoID4gMDtcbn1cblxuLyoqXG4gKiBFbnVtZXJhdGUgZW50aXRpZXMuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBkb2N1bWVudCB3aXRoIGVudGl0aWVzIHRvIGVudW1lcmF0ZS5cbiAqIEBwYXJhbSB7RW50aXR5Q2FsbGJhY2t9IGNhbGxiYWNrIC0gY2FsbGJhY2sgdG8gY2FsbCBmb3IgZWFjaCBlbnRpdHkuXG4gKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCAtIHZhbHVlIG9mIFwidGhpc1wiIGZvciBjYWxsYmFjay5cbiAqL1xuRHJhZnR5LmVudGl0aWVzID0gZnVuY3Rpb24oY29udGVudCwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgaWYgKGNvbnRlbnQuZW50ICYmIGNvbnRlbnQuZW50Lmxlbmd0aCA+IDApIHtcbiAgICBmb3IgKGxldCBpIGluIGNvbnRlbnQuZW50KSB7XG4gICAgICBpZiAoY29udGVudC5lbnRbaV0pIHtcbiAgICAgICAgY2FsbGJhY2suY2FsbChjb250ZXh0LCBjb250ZW50LmVudFtpXS5kYXRhLCBpLCBjb250ZW50LmVudFtpXS50cCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogUmVtb3ZlIHVucmVjb2duaXplZCBmaWVsZHMgZnJvbSBlbnRpdHkgZGF0YVxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gZG9jdW1lbnQgd2l0aCBlbnRpdGllcyB0byBlbnVtZXJhdGUuXG4gKiBAcmV0dXJucyBjb250ZW50LlxuICovXG5EcmFmdHkuc2FuaXRpemVFbnRpdGllcyA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcbiAgaWYgKGNvbnRlbnQgJiYgY29udGVudC5lbnQgJiYgY29udGVudC5lbnQubGVuZ3RoID4gMCkge1xuICAgIGZvciAobGV0IGkgaW4gY29udGVudC5lbnQpIHtcbiAgICAgIGNvbnN0IGVudCA9IGNvbnRlbnQuZW50W2ldO1xuICAgICAgaWYgKGVudCAmJiBlbnQuZGF0YSkge1xuICAgICAgICBjb25zdCBkYXRhID0gY29weUVudERhdGEoZW50LmRhdGEpO1xuICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgIGNvbnRlbnQuZW50W2ldLmRhdGEgPSBkYXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRlbGV0ZSBjb250ZW50LmVudFtpXS5kYXRhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBjb250ZW50O1xufVxuXG4vKipcbiAqIEdpdmVuIHRoZSBlbnRpdHksIGdldCBVUkwgd2hpY2ggY2FuIGJlIHVzZWQgZm9yIGRvd25sb2FkaW5nXG4gKiBlbnRpdHkgZGF0YS5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZW50RGF0YSAtIGVudGl0eS5kYXRhIHRvIGdldCB0aGUgVVJsIGZyb20uXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBVUkwgdG8gZG93bmxvYWQgZW50aXR5IGRhdGEgb3IgPGNvZGU+bnVsbDwvY29kZT4uXG4gKi9cbkRyYWZ0eS5nZXREb3dubG9hZFVybCA9IGZ1bmN0aW9uKGVudERhdGEpIHtcbiAgbGV0IHVybCA9IG51bGw7XG4gIGlmIChlbnREYXRhLm1pbWUgIT0gSlNPTl9NSU1FX1RZUEUgJiYgZW50RGF0YS52YWwpIHtcbiAgICB1cmwgPSBiYXNlNjR0b09iamVjdFVybChlbnREYXRhLnZhbCwgZW50RGF0YS5taW1lLCBEcmFmdHkubG9nZ2VyKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZW50RGF0YS5yZWYgPT0gJ3N0cmluZycpIHtcbiAgICB1cmwgPSBlbnREYXRhLnJlZjtcbiAgfVxuICByZXR1cm4gdXJsO1xufVxuXG4vKipcbiAqIENoZWNrIGlmIHRoZSBlbnRpdHkgZGF0YSBpcyBub3QgcmVhZHkgZm9yIHNlbmRpbmcsIHN1Y2ggYXMgYmVpbmcgdXBsb2FkZWQgdG8gdGhlIHNlcnZlci5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZW50aXR5LmRhdGEgdG8gZ2V0IHRoZSBVUmwgZnJvbS5cbiAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIHVwbG9hZCBpcyBpbiBwcm9ncmVzcywgZmFsc2Ugb3RoZXJ3aXNlLlxuICovXG5EcmFmdHkuaXNQcm9jZXNzaW5nID0gZnVuY3Rpb24oZW50RGF0YSkge1xuICByZXR1cm4gISFlbnREYXRhLl9wcm9jZXNzaW5nO1xufVxuXG4vKipcbiAqIEdpdmVuIHRoZSBlbnRpdHksIGdldCBVUkwgd2hpY2ggY2FuIGJlIHVzZWQgZm9yIHByZXZpZXdpbmdcbiAqIHRoZSBlbnRpdHkuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGVudGl0eS5kYXRhIHRvIGdldCB0aGUgVVJsIGZyb20uXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gdXJsIGZvciBwcmV2aWV3aW5nIG9yIG51bGwgaWYgbm8gc3VjaCB1cmwgaXMgYXZhaWxhYmxlLlxuICovXG5EcmFmdHkuZ2V0UHJldmlld1VybCA9IGZ1bmN0aW9uKGVudERhdGEpIHtcbiAgcmV0dXJuIGVudERhdGEudmFsID8gYmFzZTY0dG9PYmplY3RVcmwoZW50RGF0YS52YWwsIGVudERhdGEubWltZSwgRHJhZnR5LmxvZ2dlcikgOiBudWxsO1xufVxuXG4vKipcbiAqIEdldCBhcHByb3hpbWF0ZSBzaXplIG9mIHRoZSBlbnRpdHkuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGVudERhdGEgLSBlbnRpdHkuZGF0YSB0byBnZXQgdGhlIHNpemUgZm9yLlxuICogQHJldHVybnMge251bWJlcn0gc2l6ZSBvZiBlbnRpdHkgZGF0YSBpbiBieXRlcy5cbiAqL1xuRHJhZnR5LmdldEVudGl0eVNpemUgPSBmdW5jdGlvbihlbnREYXRhKSB7XG4gIC8vIEVpdGhlciBzaXplIGhpbnQgb3IgbGVuZ3RoIG9mIHZhbHVlLiBUaGUgdmFsdWUgaXMgYmFzZTY0IGVuY29kZWQsXG4gIC8vIHRoZSBhY3R1YWwgb2JqZWN0IHNpemUgaXMgc21hbGxlciB0aGFuIHRoZSBlbmNvZGVkIGxlbmd0aC5cbiAgcmV0dXJuIGVudERhdGEuc2l6ZSA/IGVudERhdGEuc2l6ZSA6IGVudERhdGEudmFsID8gKGVudERhdGEudmFsLmxlbmd0aCAqIDAuNzUpIHwgMCA6IDA7XG59XG5cbi8qKlxuICogR2V0IGVudGl0eSBtaW1lIHR5cGUuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGVudERhdGEgLSBlbnRpdHkuZGF0YSB0byBnZXQgdGhlIHR5cGUgZm9yLlxuICogQHJldHVybnMge3N0cmluZ30gbWltZSB0eXBlIG9mIGVudGl0eS5cbiAqL1xuRHJhZnR5LmdldEVudGl0eU1pbWVUeXBlID0gZnVuY3Rpb24oZW50RGF0YSkge1xuICByZXR1cm4gZW50RGF0YS5taW1lIHx8ICd0ZXh0L3BsYWluJztcbn1cblxuLyoqXG4gKiBHZXQgSFRNTCB0YWcgZm9yIGEgZ2l2ZW4gdHdvLWxldHRlciBzdHlsZSBuYW1lLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHlsZSAtIHR3by1sZXR0ZXIgc3R5bGUsIGxpa2UgU1Qgb3IgTE4uXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gSFRNTCB0YWcgbmFtZSBpZiBzdHlsZSBpcyBmb3VuZCwge2NvZGU6IHVuZGVmaW5lZH0gaWYgc3R5bGUgaXMgZmFsc2lzaCBvciBub3QgZm91bmQuXG4gKi9cbkRyYWZ0eS50YWdOYW1lID0gZnVuY3Rpb24oc3R5bGUpIHtcbiAgcmV0dXJuIEhUTUxfVEFHU1tzdHlsZV0gJiYgSFRNTF9UQUdTW3N0eWxlXS5uYW1lO1xufVxuXG4vKipcbiAqIEZvciBhIGdpdmVuIGRhdGEgYnVuZGxlIGdlbmVyYXRlIGFuIG9iamVjdCB3aXRoIEhUTUwgYXR0cmlidXRlcyxcbiAqIGZvciBpbnN0YW5jZSwgZ2l2ZW4ge3VybDogXCJodHRwOi8vd3d3LmV4YW1wbGUuY29tL1wifSByZXR1cm5cbiAqIHtocmVmOiBcImh0dHA6Ly93d3cuZXhhbXBsZS5jb20vXCJ9XG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHN0eWxlIC0gdHdvLWxldHRlciBzdHlsZSB0byBnZW5lcmF0ZSBhdHRyaWJ1dGVzIGZvci5cbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIC0gZGF0YSBidW5kbGUgdG8gY29udmVydCB0byBhdHRyaWJ1dGVzXG4gKlxuICogQHJldHVybnMge09iamVjdH0gb2JqZWN0IHdpdGggSFRNTCBhdHRyaWJ1dGVzLlxuICovXG5EcmFmdHkuYXR0clZhbHVlID0gZnVuY3Rpb24oc3R5bGUsIGRhdGEpIHtcbiAgaWYgKGRhdGEgJiYgREVDT1JBVE9SU1tzdHlsZV0pIHtcbiAgICByZXR1cm4gREVDT1JBVE9SU1tzdHlsZV0ucHJvcHMoZGF0YSk7XG4gIH1cblxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIERyYWZ0eSBNSU1FIHR5cGUuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gY29udGVudC1UeXBlIFwidGV4dC94LWRyYWZ0eVwiLlxuICovXG5EcmFmdHkuZ2V0Q29udGVudFR5cGUgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIERSQUZUWV9NSU1FX1RZUEU7XG59XG5cbi8vID09PT09PT09PT09PT09PT09XG4vLyBVdGlsaXR5IG1ldGhvZHMuXG4vLyA9PT09PT09PT09PT09PT09PVxuXG4vLyBUYWtlIGEgc3RyaW5nIGFuZCBkZWZpbmVkIGVhcmxpZXIgc3R5bGUgc3BhbnMsIHJlLWNvbXBvc2UgdGhlbSBpbnRvIGEgdHJlZSB3aGVyZSBlYWNoIGxlYWYgaXNcbi8vIGEgc2FtZS1zdHlsZSAoaW5jbHVkaW5nIHVuc3R5bGVkKSBzdHJpbmcuIEkuZS4gJ2hlbGxvICpib2xkIF9pdGFsaWNfKiBhbmQgfm1vcmV+IHdvcmxkJyAtPlxuLy8gKCdoZWxsbyAnLCAoYjogJ2JvbGQgJywgKGk6ICdpdGFsaWMnKSksICcgYW5kICcsIChzOiAnbW9yZScpLCAnIHdvcmxkJyk7XG4vL1xuLy8gVGhpcyBpcyBuZWVkZWQgaW4gb3JkZXIgdG8gY2xlYXIgbWFya3VwLCBpLmUuICdoZWxsbyAqd29ybGQqJyAtPiAnaGVsbG8gd29ybGQnIGFuZCBjb252ZXJ0XG4vLyByYW5nZXMgZnJvbSBtYXJrdXAtZWQgb2Zmc2V0cyB0byBwbGFpbiB0ZXh0IG9mZnNldHMuXG5mdW5jdGlvbiBjaHVua2lmeShsaW5lLCBzdGFydCwgZW5kLCBzcGFucykge1xuICBjb25zdCBjaHVua3MgPSBbXTtcblxuICBpZiAoc3BhbnMubGVuZ3RoID09IDApIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBmb3IgKGxldCBpIGluIHNwYW5zKSB7XG4gICAgLy8gR2V0IHRoZSBuZXh0IGNodW5rIGZyb20gdGhlIHF1ZXVlXG4gICAgY29uc3Qgc3BhbiA9IHNwYW5zW2ldO1xuXG4gICAgLy8gR3JhYiB0aGUgaW5pdGlhbCB1bnN0eWxlZCBjaHVua1xuICAgIGlmIChzcGFuLmF0ID4gc3RhcnQpIHtcbiAgICAgIGNodW5rcy5wdXNoKHtcbiAgICAgICAgdHh0OiBsaW5lLnNsaWNlKHN0YXJ0LCBzcGFuLmF0KVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gR3JhYiB0aGUgc3R5bGVkIGNodW5rLiBJdCBtYXkgaW5jbHVkZSBzdWJjaHVua3MuXG4gICAgY29uc3QgY2h1bmsgPSB7XG4gICAgICB0cDogc3Bhbi50cFxuICAgIH07XG4gICAgY29uc3QgY2hsZCA9IGNodW5raWZ5KGxpbmUsIHNwYW4uYXQgKyAxLCBzcGFuLmVuZCwgc3Bhbi5jaGlsZHJlbik7XG4gICAgaWYgKGNobGQubGVuZ3RoID4gMCkge1xuICAgICAgY2h1bmsuY2hpbGRyZW4gPSBjaGxkO1xuICAgIH0gZWxzZSB7XG4gICAgICBjaHVuay50eHQgPSBzcGFuLnR4dDtcbiAgICB9XG4gICAgY2h1bmtzLnB1c2goY2h1bmspO1xuICAgIHN0YXJ0ID0gc3Bhbi5lbmQgKyAxOyAvLyAnKzEnIGlzIHRvIHNraXAgdGhlIGZvcm1hdHRpbmcgY2hhcmFjdGVyXG4gIH1cblxuICAvLyBHcmFiIHRoZSByZW1haW5pbmcgdW5zdHlsZWQgY2h1bmssIGFmdGVyIHRoZSBsYXN0IHNwYW5cbiAgaWYgKHN0YXJ0IDwgZW5kKSB7XG4gICAgY2h1bmtzLnB1c2goe1xuICAgICAgdHh0OiBsaW5lLnNsaWNlKHN0YXJ0LCBlbmQpXG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gY2h1bmtzO1xufVxuXG4vLyBEZXRlY3Qgc3RhcnRzIGFuZCBlbmRzIG9mIGZvcm1hdHRpbmcgc3BhbnMuIFVuZm9ybWF0dGVkIHNwYW5zIGFyZVxuLy8gaWdub3JlZCBhdCB0aGlzIHN0YWdlLlxuZnVuY3Rpb24gc3Bhbm5pZnkob3JpZ2luYWwsIHJlX3N0YXJ0LCByZV9lbmQsIHR5cGUpIHtcbiAgY29uc3QgcmVzdWx0ID0gW107XG4gIGxldCBpbmRleCA9IDA7XG4gIGxldCBsaW5lID0gb3JpZ2luYWwuc2xpY2UoMCk7IC8vIG1ha2UgYSBjb3B5O1xuXG4gIHdoaWxlIChsaW5lLmxlbmd0aCA+IDApIHtcbiAgICAvLyBtYXRjaFswXTsgLy8gbWF0Y2gsIGxpa2UgJyphYmMqJ1xuICAgIC8vIG1hdGNoWzFdOyAvLyBtYXRjaCBjYXB0dXJlZCBpbiBwYXJlbnRoZXNpcywgbGlrZSAnYWJjJ1xuICAgIC8vIG1hdGNoWydpbmRleCddOyAvLyBvZmZzZXQgd2hlcmUgdGhlIG1hdGNoIHN0YXJ0ZWQuXG5cbiAgICAvLyBGaW5kIHRoZSBvcGVuaW5nIHRva2VuLlxuICAgIGNvbnN0IHN0YXJ0ID0gcmVfc3RhcnQuZXhlYyhsaW5lKTtcbiAgICBpZiAoc3RhcnQgPT0gbnVsbCkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgLy8gQmVjYXVzZSBqYXZhc2NyaXB0IFJlZ0V4cCBkb2VzIG5vdCBzdXBwb3J0IGxvb2tiZWhpbmQsIHRoZSBhY3R1YWwgb2Zmc2V0IG1heSBub3QgcG9pbnRcbiAgICAvLyBhdCB0aGUgbWFya3VwIGNoYXJhY3Rlci4gRmluZCBpdCBpbiB0aGUgbWF0Y2hlZCBzdHJpbmcuXG4gICAgbGV0IHN0YXJ0X29mZnNldCA9IHN0YXJ0WydpbmRleCddICsgc3RhcnRbMF0ubGFzdEluZGV4T2Yoc3RhcnRbMV0pO1xuICAgIC8vIENsaXAgdGhlIHByb2Nlc3NlZCBwYXJ0IG9mIHRoZSBzdHJpbmcuXG4gICAgbGluZSA9IGxpbmUuc2xpY2Uoc3RhcnRfb2Zmc2V0ICsgMSk7XG4gICAgLy8gc3RhcnRfb2Zmc2V0IGlzIGFuIG9mZnNldCB3aXRoaW4gdGhlIGNsaXBwZWQgc3RyaW5nLiBDb252ZXJ0IHRvIG9yaWdpbmFsIGluZGV4LlxuICAgIHN0YXJ0X29mZnNldCArPSBpbmRleDtcbiAgICAvLyBJbmRleCBub3cgcG9pbnQgdG8gdGhlIGJlZ2lubmluZyBvZiAnbGluZScgd2l0aGluIHRoZSAnb3JpZ2luYWwnIHN0cmluZy5cbiAgICBpbmRleCA9IHN0YXJ0X29mZnNldCArIDE7XG5cbiAgICAvLyBGaW5kIHRoZSBtYXRjaGluZyBjbG9zaW5nIHRva2VuLlxuICAgIGNvbnN0IGVuZCA9IHJlX2VuZCA/IHJlX2VuZC5leGVjKGxpbmUpIDogbnVsbDtcbiAgICBpZiAoZW5kID09IG51bGwpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBsZXQgZW5kX29mZnNldCA9IGVuZFsnaW5kZXgnXSArIGVuZFswXS5pbmRleE9mKGVuZFsxXSk7XG4gICAgLy8gQ2xpcCB0aGUgcHJvY2Vzc2VkIHBhcnQgb2YgdGhlIHN0cmluZy5cbiAgICBsaW5lID0gbGluZS5zbGljZShlbmRfb2Zmc2V0ICsgMSk7XG4gICAgLy8gVXBkYXRlIG9mZnNldHNcbiAgICBlbmRfb2Zmc2V0ICs9IGluZGV4O1xuICAgIC8vIEluZGV4IG5vdyBwb2ludHMgdG8gdGhlIGJlZ2lubmluZyBvZiAnbGluZScgd2l0aGluIHRoZSAnb3JpZ2luYWwnIHN0cmluZy5cbiAgICBpbmRleCA9IGVuZF9vZmZzZXQgKyAxO1xuXG4gICAgcmVzdWx0LnB1c2goe1xuICAgICAgdHh0OiBvcmlnaW5hbC5zbGljZShzdGFydF9vZmZzZXQgKyAxLCBlbmRfb2Zmc2V0KSxcbiAgICAgIGNoaWxkcmVuOiBbXSxcbiAgICAgIGF0OiBzdGFydF9vZmZzZXQsXG4gICAgICBlbmQ6IGVuZF9vZmZzZXQsXG4gICAgICB0cDogdHlwZVxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLy8gQ29udmVydCBsaW5lYXIgYXJyYXkgb3Igc3BhbnMgaW50byBhIHRyZWUgcmVwcmVzZW50YXRpb24uXG4vLyBLZWVwIHN0YW5kYWxvbmUgYW5kIG5lc3RlZCBzcGFucywgdGhyb3cgYXdheSBwYXJ0aWFsbHkgb3ZlcmxhcHBpbmcgc3BhbnMuXG5mdW5jdGlvbiB0b1NwYW5UcmVlKHNwYW5zKSB7XG4gIGlmIChzcGFucy5sZW5ndGggPT0gMCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGNvbnN0IHRyZWUgPSBbc3BhbnNbMF1dO1xuICBsZXQgbGFzdCA9IHNwYW5zWzBdO1xuICBmb3IgKGxldCBpID0gMTsgaSA8IHNwYW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgLy8gS2VlcCBzcGFucyB3aGljaCBzdGFydCBhZnRlciB0aGUgZW5kIG9mIHRoZSBwcmV2aW91cyBzcGFuIG9yIHRob3NlIHdoaWNoXG4gICAgLy8gYXJlIGNvbXBsZXRlIHdpdGhpbiB0aGUgcHJldmlvdXMgc3Bhbi5cbiAgICBpZiAoc3BhbnNbaV0uYXQgPiBsYXN0LmVuZCkge1xuICAgICAgLy8gU3BhbiBpcyBjb21wbGV0ZWx5IG91dHNpZGUgb2YgdGhlIHByZXZpb3VzIHNwYW4uXG4gICAgICB0cmVlLnB1c2goc3BhbnNbaV0pO1xuICAgICAgbGFzdCA9IHNwYW5zW2ldO1xuICAgIH0gZWxzZSBpZiAoc3BhbnNbaV0uZW5kIDw9IGxhc3QuZW5kKSB7XG4gICAgICAvLyBTcGFuIGlzIGZ1bGx5IGluc2lkZSBvZiB0aGUgcHJldmlvdXMgc3Bhbi4gUHVzaCB0byBzdWJub2RlLlxuICAgICAgbGFzdC5jaGlsZHJlbi5wdXNoKHNwYW5zW2ldKTtcbiAgICB9XG4gICAgLy8gU3BhbiBjb3VsZCBwYXJ0aWFsbHkgb3ZlcmxhcCwgaWdub3JpbmcgaXQgYXMgaW52YWxpZC5cbiAgfVxuXG4gIC8vIFJlY3Vyc2l2ZWx5IHJlYXJyYW5nZSB0aGUgc3Vibm9kZXMuXG4gIGZvciAobGV0IGkgaW4gdHJlZSkge1xuICAgIHRyZWVbaV0uY2hpbGRyZW4gPSB0b1NwYW5UcmVlKHRyZWVbaV0uY2hpbGRyZW4pO1xuICB9XG5cbiAgcmV0dXJuIHRyZWU7XG59XG5cbi8vIENvbnZlcnQgZHJhZnR5IGRvY3VtZW50IHRvIGEgdHJlZS5cbmZ1bmN0aW9uIGRyYWZ0eVRvVHJlZShkb2MpIHtcbiAgaWYgKCFkb2MpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGRvYyA9ICh0eXBlb2YgZG9jID09ICdzdHJpbmcnKSA/IHtcbiAgICB0eHQ6IGRvY1xuICB9IDogZG9jO1xuICBsZXQge1xuICAgIHR4dCxcbiAgICBmbXQsXG4gICAgZW50XG4gIH0gPSBkb2M7XG5cbiAgdHh0ID0gdHh0IHx8ICcnO1xuICBpZiAoIUFycmF5LmlzQXJyYXkoZW50KSkge1xuICAgIGVudCA9IFtdO1xuICB9XG5cbiAgaWYgKCFBcnJheS5pc0FycmF5KGZtdCkgfHwgZm10Lmxlbmd0aCA9PSAwKSB7XG4gICAgaWYgKGVudC5sZW5ndGggPT0gMCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdGV4dDogdHh0XG4gICAgICB9O1xuICAgIH1cblxuICAgIC8vIEhhbmRsZSBzcGVjaWFsIGNhc2Ugd2hlbiBhbGwgdmFsdWVzIGluIGZtdCBhcmUgMCBhbmQgZm10IHRoZXJlZm9yZSBpcyBza2lwcGVkLlxuICAgIGZtdCA9IFt7XG4gICAgICBhdDogMCxcbiAgICAgIGxlbjogMCxcbiAgICAgIGtleTogMFxuICAgIH1dO1xuICB9XG5cbiAgLy8gU2FuaXRpemUgc3BhbnMuXG4gIGNvbnN0IHNwYW5zID0gW107XG4gIGNvbnN0IGF0dGFjaG1lbnRzID0gW107XG4gIGZtdC5mb3JFYWNoKChzcGFuKSA9PiB7XG4gICAgaWYgKCFzcGFuIHx8IHR5cGVvZiBzcGFuICE9ICdvYmplY3QnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFbJ3VuZGVmaW5lZCcsICdudW1iZXInXS5pbmNsdWRlcyh0eXBlb2Ygc3Bhbi5hdCkpIHtcbiAgICAgIC8vIFByZXNlbnQsIGJ1dCBub24tbnVtZXJpYyAnYXQnLlxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIVsndW5kZWZpbmVkJywgJ251bWJlciddLmluY2x1ZGVzKHR5cGVvZiBzcGFuLmxlbikpIHtcbiAgICAgIC8vIFByZXNlbnQsIGJ1dCBub24tbnVtZXJpYyAnbGVuJy5cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IGF0ID0gc3Bhbi5hdCB8IDA7XG4gICAgbGV0IGxlbiA9IHNwYW4ubGVuIHwgMDtcbiAgICBpZiAobGVuIDwgMCkge1xuICAgICAgLy8gSW52YWxpZCBzcGFuIGxlbmd0aC5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQga2V5ID0gc3Bhbi5rZXkgfHwgMDtcbiAgICBpZiAoZW50Lmxlbmd0aCA+IDAgJiYgKHR5cGVvZiBrZXkgIT0gJ251bWJlcicgfHwga2V5IDwgMCB8fCBrZXkgPj0gZW50Lmxlbmd0aCkpIHtcbiAgICAgIC8vIEludmFsaWQga2V5IHZhbHVlLlxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChhdCA8PSAtMSkge1xuICAgICAgLy8gQXR0YWNobWVudC4gU3RvcmUgYXR0YWNobWVudHMgc2VwYXJhdGVseS5cbiAgICAgIGF0dGFjaG1lbnRzLnB1c2goe1xuICAgICAgICBzdGFydDogLTEsXG4gICAgICAgIGVuZDogMCxcbiAgICAgICAga2V5OiBrZXlcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSBpZiAoYXQgKyBsZW4gPiB0eHQubGVuZ3RoKSB7XG4gICAgICAvLyBTcGFuIGlzIG91dCBvZiBib3VuZHMuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFzcGFuLnRwKSB7XG4gICAgICBpZiAoZW50Lmxlbmd0aCA+IDAgJiYgKHR5cGVvZiBlbnRba2V5XSA9PSAnb2JqZWN0JykpIHtcbiAgICAgICAgc3BhbnMucHVzaCh7XG4gICAgICAgICAgc3RhcnQ6IGF0LFxuICAgICAgICAgIGVuZDogYXQgKyBsZW4sXG4gICAgICAgICAga2V5OiBrZXlcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHNwYW5zLnB1c2goe1xuICAgICAgICB0eXBlOiBzcGFuLnRwLFxuICAgICAgICBzdGFydDogYXQsXG4gICAgICAgIGVuZDogYXQgKyBsZW5cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gU29ydCBzcGFucyBmaXJzdCBieSBzdGFydCBpbmRleCAoYXNjKSB0aGVuIGJ5IGxlbmd0aCAoZGVzYyksIHRoZW4gYnkgd2VpZ2h0LlxuICBzcGFucy5zb3J0KChhLCBiKSA9PiB7XG4gICAgbGV0IGRpZmYgPSBhLnN0YXJ0IC0gYi5zdGFydDtcbiAgICBpZiAoZGlmZiAhPSAwKSB7XG4gICAgICByZXR1cm4gZGlmZjtcbiAgICB9XG4gICAgZGlmZiA9IGIuZW5kIC0gYS5lbmQ7XG4gICAgaWYgKGRpZmYgIT0gMCkge1xuICAgICAgcmV0dXJuIGRpZmY7XG4gICAgfVxuICAgIHJldHVybiBGTVRfV0VJR0hULmluZGV4T2YoYi50eXBlKSAtIEZNVF9XRUlHSFQuaW5kZXhPZihhLnR5cGUpO1xuICB9KTtcblxuICAvLyBNb3ZlIGF0dGFjaG1lbnRzIHRvIHRoZSBlbmQgb2YgdGhlIGxpc3QuXG4gIGlmIChhdHRhY2htZW50cy5sZW5ndGggPiAwKSB7XG4gICAgc3BhbnMucHVzaCguLi5hdHRhY2htZW50cyk7XG4gIH1cblxuICBzcGFucy5mb3JFYWNoKChzcGFuKSA9PiB7XG4gICAgaWYgKGVudC5sZW5ndGggPiAwICYmICFzcGFuLnR5cGUgJiYgZW50W3NwYW4ua2V5XSAmJiB0eXBlb2YgZW50W3NwYW4ua2V5XSA9PSAnb2JqZWN0Jykge1xuICAgICAgc3Bhbi50eXBlID0gZW50W3NwYW4ua2V5XS50cDtcbiAgICAgIHNwYW4uZGF0YSA9IGVudFtzcGFuLmtleV0uZGF0YTtcbiAgICB9XG5cbiAgICAvLyBJcyB0eXBlIHN0aWxsIHVuZGVmaW5lZD8gSGlkZSB0aGUgaW52YWxpZCBlbGVtZW50IVxuICAgIGlmICghc3Bhbi50eXBlKSB7XG4gICAgICBzcGFuLnR5cGUgPSAnSEQnO1xuICAgIH1cbiAgfSk7XG5cbiAgbGV0IHRyZWUgPSBzcGFuc1RvVHJlZSh7fSwgdHh0LCAwLCB0eHQubGVuZ3RoLCBzcGFucyk7XG5cbiAgLy8gRmxhdHRlbiB0cmVlIG5vZGVzLlxuICBjb25zdCBmbGF0dGVuID0gZnVuY3Rpb24obm9kZSkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KG5vZGUuY2hpbGRyZW4pICYmIG5vZGUuY2hpbGRyZW4ubGVuZ3RoID09IDEpIHtcbiAgICAgIC8vIFVud3JhcC5cbiAgICAgIGNvbnN0IGNoaWxkID0gbm9kZS5jaGlsZHJlblswXTtcbiAgICAgIGlmICghbm9kZS50eXBlKSB7XG4gICAgICAgIGNvbnN0IHBhcmVudCA9IG5vZGUucGFyZW50O1xuICAgICAgICBub2RlID0gY2hpbGQ7XG4gICAgICAgIG5vZGUucGFyZW50ID0gcGFyZW50O1xuICAgICAgfSBlbHNlIGlmICghY2hpbGQudHlwZSAmJiAhY2hpbGQuY2hpbGRyZW4pIHtcbiAgICAgICAgbm9kZS50ZXh0ID0gY2hpbGQudGV4dDtcbiAgICAgICAgZGVsZXRlIG5vZGUuY2hpbGRyZW47XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBub2RlO1xuICB9XG4gIHRyZWUgPSB0cmVlVG9wRG93bih0cmVlLCBmbGF0dGVuKTtcblxuICByZXR1cm4gdHJlZTtcbn1cblxuLy8gQWRkIHRyZWUgbm9kZSB0byBhIHBhcmVudCB0cmVlLlxuZnVuY3Rpb24gYWRkTm9kZShwYXJlbnQsIG4pIHtcbiAgaWYgKCFuKSB7XG4gICAgcmV0dXJuIHBhcmVudDtcbiAgfVxuXG4gIGlmICghcGFyZW50LmNoaWxkcmVuKSB7XG4gICAgcGFyZW50LmNoaWxkcmVuID0gW107XG4gIH1cblxuICAvLyBJZiB0ZXh0IGlzIHByZXNlbnQsIG1vdmUgaXQgdG8gYSBzdWJub2RlLlxuICBpZiAocGFyZW50LnRleHQpIHtcbiAgICBwYXJlbnQuY2hpbGRyZW4ucHVzaCh7XG4gICAgICB0ZXh0OiBwYXJlbnQudGV4dCxcbiAgICAgIHBhcmVudDogcGFyZW50XG4gICAgfSk7XG4gICAgZGVsZXRlIHBhcmVudC50ZXh0O1xuICB9XG5cbiAgbi5wYXJlbnQgPSBwYXJlbnQ7XG4gIHBhcmVudC5jaGlsZHJlbi5wdXNoKG4pO1xuXG4gIHJldHVybiBwYXJlbnQ7XG59XG5cbi8vIFJldHVybnMgYSB0cmVlIG9mIG5vZGVzLlxuZnVuY3Rpb24gc3BhbnNUb1RyZWUocGFyZW50LCB0ZXh0LCBzdGFydCwgZW5kLCBzcGFucykge1xuICBpZiAoIXNwYW5zIHx8IHNwYW5zLmxlbmd0aCA9PSAwKSB7XG4gICAgaWYgKHN0YXJ0IDwgZW5kKSB7XG4gICAgICBhZGROb2RlKHBhcmVudCwge1xuICAgICAgICB0ZXh0OiB0ZXh0LnN1YnN0cmluZyhzdGFydCwgZW5kKVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBwYXJlbnQ7XG4gIH1cblxuICAvLyBQcm9jZXNzIHN1YnNwYW5zLlxuICBmb3IgKGxldCBpID0gMDsgaSA8IHNwYW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3Qgc3BhbiA9IHNwYW5zW2ldO1xuICAgIGlmIChzcGFuLnN0YXJ0IDwgMCAmJiBzcGFuLnR5cGUgPT0gJ0VYJykge1xuICAgICAgYWRkTm9kZShwYXJlbnQsIHtcbiAgICAgICAgdHlwZTogc3Bhbi50eXBlLFxuICAgICAgICBkYXRhOiBzcGFuLmRhdGEsXG4gICAgICAgIGtleTogc3Bhbi5rZXksXG4gICAgICAgIGF0dDogdHJ1ZVxuICAgICAgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBBZGQgdW4tc3R5bGVkIHJhbmdlIGJlZm9yZSB0aGUgc3R5bGVkIHNwYW4gc3RhcnRzLlxuICAgIGlmIChzdGFydCA8IHNwYW4uc3RhcnQpIHtcbiAgICAgIGFkZE5vZGUocGFyZW50LCB7XG4gICAgICAgIHRleHQ6IHRleHQuc3Vic3RyaW5nKHN0YXJ0LCBzcGFuLnN0YXJ0KVxuICAgICAgfSk7XG4gICAgICBzdGFydCA9IHNwYW4uc3RhcnQ7XG4gICAgfVxuXG4gICAgLy8gR2V0IGFsbCBzcGFucyB3aGljaCBhcmUgd2l0aGluIHRoZSBjdXJyZW50IHNwYW4uXG4gICAgY29uc3Qgc3Vic3BhbnMgPSBbXTtcbiAgICB3aGlsZSAoaSA8IHNwYW5zLmxlbmd0aCAtIDEpIHtcbiAgICAgIGNvbnN0IGlubmVyID0gc3BhbnNbaSArIDFdO1xuICAgICAgaWYgKGlubmVyLnN0YXJ0IDwgMCkge1xuICAgICAgICAvLyBBdHRhY2htZW50cyBhcmUgaW4gdGhlIGVuZC4gU3RvcC5cbiAgICAgICAgYnJlYWs7XG4gICAgICB9IGVsc2UgaWYgKGlubmVyLnN0YXJ0IDwgc3Bhbi5lbmQpIHtcbiAgICAgICAgaWYgKGlubmVyLmVuZCA8PSBzcGFuLmVuZCkge1xuICAgICAgICAgIGNvbnN0IHRhZyA9IEhUTUxfVEFHU1tpbm5lci50cF0gfHwge307XG4gICAgICAgICAgaWYgKGlubmVyLnN0YXJ0IDwgaW5uZXIuZW5kIHx8IHRhZy5pc1ZvaWQpIHtcbiAgICAgICAgICAgIC8vIFZhbGlkIHN1YnNwYW46IGNvbXBsZXRlbHkgd2l0aGluIHRoZSBjdXJyZW50IHNwYW4gYW5kXG4gICAgICAgICAgICAvLyBlaXRoZXIgbm9uLXplcm8gbGVuZ3RoIG9yIHplcm8gbGVuZ3RoIGlzIGFjY2VwdGFibGUuXG4gICAgICAgICAgICBzdWJzcGFucy5wdXNoKGlubmVyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaSsrO1xuICAgICAgICAvLyBPdmVybGFwcGluZyBzdWJzcGFucyBhcmUgaWdub3JlZC5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFBhc3QgdGhlIGVuZCBvZiB0aGUgY3VycmVudCBzcGFuLiBTdG9wLlxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhZGROb2RlKHBhcmVudCwgc3BhbnNUb1RyZWUoe1xuICAgICAgdHlwZTogc3Bhbi50eXBlLFxuICAgICAgZGF0YTogc3Bhbi5kYXRhLFxuICAgICAga2V5OiBzcGFuLmtleVxuICAgIH0sIHRleHQsIHN0YXJ0LCBzcGFuLmVuZCwgc3Vic3BhbnMpKTtcbiAgICBzdGFydCA9IHNwYW4uZW5kO1xuICB9XG5cbiAgLy8gQWRkIHRoZSBsYXN0IHVuZm9ybWF0dGVkIHJhbmdlLlxuICBpZiAoc3RhcnQgPCBlbmQpIHtcbiAgICBhZGROb2RlKHBhcmVudCwge1xuICAgICAgdGV4dDogdGV4dC5zdWJzdHJpbmcoc3RhcnQsIGVuZClcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBwYXJlbnQ7XG59XG5cbi8vIEFwcGVuZCBhIHRyZWUgdG8gYSBEcmFmdHkgZG9jLlxuZnVuY3Rpb24gdHJlZVRvRHJhZnR5KGRvYywgdHJlZSwga2V5bWFwKSB7XG4gIGlmICghdHJlZSkge1xuICAgIHJldHVybiBkb2M7XG4gIH1cblxuICBkb2MudHh0ID0gZG9jLnR4dCB8fCAnJztcblxuICAvLyBDaGVja3BvaW50IHRvIG1lYXN1cmUgbGVuZ3RoIG9mIHRoZSBjdXJyZW50IHRyZWUgbm9kZS5cbiAgY29uc3Qgc3RhcnQgPSBkb2MudHh0Lmxlbmd0aDtcblxuICBpZiAodHJlZS50ZXh0KSB7XG4gICAgZG9jLnR4dCArPSB0cmVlLnRleHQ7XG4gIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh0cmVlLmNoaWxkcmVuKSkge1xuICAgIHRyZWUuY2hpbGRyZW4uZm9yRWFjaCgoYykgPT4ge1xuICAgICAgdHJlZVRvRHJhZnR5KGRvYywgYywga2V5bWFwKTtcbiAgICB9KTtcbiAgfVxuXG4gIGlmICh0cmVlLnR5cGUpIHtcbiAgICBjb25zdCBsZW4gPSBkb2MudHh0Lmxlbmd0aCAtIHN0YXJ0O1xuICAgIGRvYy5mbXQgPSBkb2MuZm10IHx8IFtdO1xuICAgIGlmIChPYmplY3Qua2V5cyh0cmVlLmRhdGEgfHwge30pLmxlbmd0aCA+IDApIHtcbiAgICAgIGRvYy5lbnQgPSBkb2MuZW50IHx8IFtdO1xuICAgICAgY29uc3QgbmV3S2V5ID0gKHR5cGVvZiBrZXltYXBbdHJlZS5rZXldID09ICd1bmRlZmluZWQnKSA/IGRvYy5lbnQubGVuZ3RoIDoga2V5bWFwW3RyZWUua2V5XTtcbiAgICAgIGtleW1hcFt0cmVlLmtleV0gPSBuZXdLZXk7XG4gICAgICBkb2MuZW50W25ld0tleV0gPSB7XG4gICAgICAgIHRwOiB0cmVlLnR5cGUsXG4gICAgICAgIGRhdGE6IHRyZWUuZGF0YVxuICAgICAgfTtcbiAgICAgIGlmICh0cmVlLmF0dCkge1xuICAgICAgICAvLyBBdHRhY2htZW50LlxuICAgICAgICBkb2MuZm10LnB1c2goe1xuICAgICAgICAgIGF0OiAtMSxcbiAgICAgICAgICBsZW46IDAsXG4gICAgICAgICAga2V5OiBuZXdLZXlcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkb2MuZm10LnB1c2goe1xuICAgICAgICAgIGF0OiBzdGFydCxcbiAgICAgICAgICBsZW46IGxlbixcbiAgICAgICAgICBrZXk6IG5ld0tleVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZG9jLmZtdC5wdXNoKHtcbiAgICAgICAgdHA6IHRyZWUudHlwZSxcbiAgICAgICAgYXQ6IHN0YXJ0LFxuICAgICAgICBsZW46IGxlblxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBkb2M7XG59XG5cbi8vIFRyYXZlcnNlIHRoZSB0cmVlIHRvcCBkb3duIHRyYW5zZm9ybWluZyB0aGUgbm9kZXM6IGFwcGx5IHRyYW5zZm9ybWVyIHRvIGV2ZXJ5IHRyZWUgbm9kZS5cbmZ1bmN0aW9uIHRyZWVUb3BEb3duKHNyYywgdHJhbnNmb3JtZXIsIGNvbnRleHQpIHtcbiAgaWYgKCFzcmMpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGxldCBkc3QgPSB0cmFuc2Zvcm1lci5jYWxsKGNvbnRleHQsIHNyYyk7XG4gIGlmICghZHN0IHx8ICFkc3QuY2hpbGRyZW4pIHtcbiAgICByZXR1cm4gZHN0O1xuICB9XG5cbiAgY29uc3QgY2hpbGRyZW4gPSBbXTtcbiAgZm9yIChsZXQgaSBpbiBkc3QuY2hpbGRyZW4pIHtcbiAgICBsZXQgbiA9IGRzdC5jaGlsZHJlbltpXTtcbiAgICBpZiAobikge1xuICAgICAgbiA9IHRyZWVUb3BEb3duKG4sIHRyYW5zZm9ybWVyLCBjb250ZXh0KTtcbiAgICAgIGlmIChuKSB7XG4gICAgICAgIGNoaWxkcmVuLnB1c2gobik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKGNoaWxkcmVuLmxlbmd0aCA9PSAwKSB7XG4gICAgZHN0LmNoaWxkcmVuID0gbnVsbDtcbiAgfSBlbHNlIHtcbiAgICBkc3QuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgfVxuXG4gIHJldHVybiBkc3Q7XG59XG5cbi8vIFRyYXZlcnNlIHRoZSB0cmVlIGJvdHRvbS11cDogYXBwbHkgZm9ybWF0dGVyIHRvIGV2ZXJ5IG5vZGUuXG4vLyBUaGUgZm9ybWF0dGVyIG11c3QgbWFpbnRhaW4gaXRzIHN0YXRlIHRocm91Z2ggY29udGV4dC5cbmZ1bmN0aW9uIHRyZWVCb3R0b21VcChzcmMsIGZvcm1hdHRlciwgaW5kZXgsIHN0YWNrLCBjb250ZXh0KSB7XG4gIGlmICghc3JjKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBpZiAoc3RhY2sgJiYgc3JjLnR5cGUpIHtcbiAgICBzdGFjay5wdXNoKHNyYy50eXBlKTtcbiAgfVxuXG4gIGxldCB2YWx1ZXMgPSBbXTtcbiAgZm9yIChsZXQgaSBpbiBzcmMuY2hpbGRyZW4pIHtcbiAgICBjb25zdCBuID0gdHJlZUJvdHRvbVVwKHNyYy5jaGlsZHJlbltpXSwgZm9ybWF0dGVyLCBpLCBzdGFjaywgY29udGV4dCk7XG4gICAgaWYgKG4pIHtcbiAgICAgIHZhbHVlcy5wdXNoKG4pO1xuICAgIH1cbiAgfVxuICBpZiAodmFsdWVzLmxlbmd0aCA9PSAwKSB7XG4gICAgaWYgKHNyYy50ZXh0KSB7XG4gICAgICB2YWx1ZXMgPSBbc3JjLnRleHRdO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZXMgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGlmIChzdGFjayAmJiBzcmMudHlwZSkge1xuICAgIHN0YWNrLnBvcCgpO1xuICB9XG5cbiAgcmV0dXJuIGZvcm1hdHRlci5jYWxsKGNvbnRleHQsIHNyYy50eXBlLCBzcmMuZGF0YSwgdmFsdWVzLCBpbmRleCwgc3RhY2spO1xufVxuXG4vLyBDbGlwIHRyZWUgdG8gdGhlIHByb3ZpZGVkIGxpbWl0LlxuZnVuY3Rpb24gc2hvcnRlblRyZWUodHJlZSwgbGltaXQsIHRhaWwpIHtcbiAgaWYgKCF0cmVlKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBpZiAodGFpbCkge1xuICAgIGxpbWl0IC09IHRhaWwubGVuZ3RoO1xuICB9XG5cbiAgY29uc3Qgc2hvcnRlbmVyID0gZnVuY3Rpb24obm9kZSkge1xuICAgIGlmIChsaW1pdCA8PSAtMSkge1xuICAgICAgLy8gTGltaXQgLTEgbWVhbnMgdGhlIGRvYyB3YXMgYWxyZWFkeSBjbGlwcGVkLlxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUuYXR0KSB7XG4gICAgICAvLyBBdHRhY2htZW50cyBhcmUgdW5jaGFuZ2VkLlxuICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuICAgIGlmIChsaW1pdCA9PSAwKSB7XG4gICAgICBub2RlLnRleHQgPSB0YWlsO1xuICAgICAgbGltaXQgPSAtMTtcbiAgICB9IGVsc2UgaWYgKG5vZGUudGV4dCkge1xuICAgICAgY29uc3QgbGVuID0gbm9kZS50ZXh0Lmxlbmd0aDtcbiAgICAgIGlmIChsZW4gPiBsaW1pdCkge1xuICAgICAgICBub2RlLnRleHQgPSBub2RlLnRleHQuc3Vic3RyaW5nKDAsIGxpbWl0KSArIHRhaWw7XG4gICAgICAgIGxpbWl0ID0gLTE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsaW1pdCAtPSBsZW47XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgcmV0dXJuIHRyZWVUb3BEb3duKHRyZWUsIHNob3J0ZW5lcik7XG59XG5cbi8vIFN0cmlwIGhlYXZ5IGVudGl0aWVzIGZyb20gYSB0cmVlLlxuZnVuY3Rpb24gbGlnaHRFbnRpdHkodHJlZSwgYWxsb3cpIHtcbiAgY29uc3QgbGlnaHRDb3B5ID0gKG5vZGUpID0+IHtcbiAgICBjb25zdCBkYXRhID0gY29weUVudERhdGEobm9kZS5kYXRhLCB0cnVlLCBhbGxvdyA/IGFsbG93KG5vZGUpIDogbnVsbCk7XG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIG5vZGUuZGF0YSA9IGRhdGE7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSBub2RlLmRhdGE7XG4gICAgfVxuICAgIHJldHVybiBub2RlO1xuICB9XG4gIHJldHVybiB0cmVlVG9wRG93bih0cmVlLCBsaWdodENvcHkpO1xufVxuXG4vLyBSZW1vdmUgc3BhY2VzIGFuZCBicmVha3Mgb24gdGhlIGxlZnQuXG5mdW5jdGlvbiBsVHJpbSh0cmVlKSB7XG4gIGlmICh0cmVlLnR5cGUgPT0gJ0JSJykge1xuICAgIHRyZWUgPSBudWxsO1xuICB9IGVsc2UgaWYgKHRyZWUudGV4dCkge1xuICAgIGlmICghdHJlZS50eXBlKSB7XG4gICAgICB0cmVlLnRleHQgPSB0cmVlLnRleHQudHJpbVN0YXJ0KCk7XG4gICAgICBpZiAoIXRyZWUudGV4dCkge1xuICAgICAgICB0cmVlID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAoIXRyZWUudHlwZSAmJiB0cmVlLmNoaWxkcmVuICYmIHRyZWUuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgIGNvbnN0IGMgPSBsVHJpbSh0cmVlLmNoaWxkcmVuWzBdKTtcbiAgICBpZiAoYykge1xuICAgICAgdHJlZS5jaGlsZHJlblswXSA9IGM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyZWUuY2hpbGRyZW4uc2hpZnQoKTtcbiAgICAgIGlmICghdHJlZS50eXBlICYmIHRyZWUuY2hpbGRyZW4ubGVuZ3RoID09IDApIHtcbiAgICAgICAgdHJlZSA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB0cmVlO1xufVxuXG4vLyBNb3ZlIGF0dGFjaG1lbnRzIHRvIHRoZSBlbmQuIEF0dGFjaG1lbnRzIG11c3QgYmUgYXQgdGhlIHRvcCBsZXZlbCwgbm8gbmVlZCB0byB0cmF2ZXJzZSB0aGUgdHJlZS5cbmZ1bmN0aW9uIGF0dGFjaG1lbnRzVG9FbmQodHJlZSwgbGltaXQpIHtcbiAgaWYgKCF0cmVlKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBpZiAodHJlZS5hdHQpIHtcbiAgICB0cmVlLnRleHQgPSAnICc7XG4gICAgZGVsZXRlIHRyZWUuYXR0O1xuICAgIGRlbGV0ZSB0cmVlLmNoaWxkcmVuO1xuICB9IGVsc2UgaWYgKHRyZWUuY2hpbGRyZW4pIHtcbiAgICBjb25zdCBhdHRhY2htZW50cyA9IFtdO1xuICAgIGNvbnN0IGNoaWxkcmVuID0gW107XG4gICAgZm9yIChsZXQgaSBpbiB0cmVlLmNoaWxkcmVuKSB7XG4gICAgICBjb25zdCBjID0gdHJlZS5jaGlsZHJlbltpXTtcbiAgICAgIGlmIChjLmF0dCkge1xuICAgICAgICBpZiAoYXR0YWNobWVudHMubGVuZ3RoID09IGxpbWl0KSB7XG4gICAgICAgICAgLy8gVG9vIG1hbnkgYXR0YWNobWVudHMgdG8gcHJldmlldztcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYy5kYXRhWydtaW1lJ10gPT0gSlNPTl9NSU1FX1RZUEUpIHtcbiAgICAgICAgICAvLyBKU09OIGF0dGFjaG1lbnRzIGFyZSBub3Qgc2hvd24gaW4gcHJldmlldy5cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlbGV0ZSBjLmF0dDtcbiAgICAgICAgZGVsZXRlIGMuY2hpbGRyZW47XG4gICAgICAgIGMudGV4dCA9ICcgJztcbiAgICAgICAgYXR0YWNobWVudHMucHVzaChjKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNoaWxkcmVuLnB1c2goYyk7XG4gICAgICB9XG4gICAgfVxuICAgIHRyZWUuY2hpbGRyZW4gPSBjaGlsZHJlbi5jb25jYXQoYXR0YWNobWVudHMpO1xuICB9XG4gIHJldHVybiB0cmVlO1xufVxuXG4vLyBHZXQgYSBsaXN0IG9mIGVudGl0aWVzIGZyb20gYSB0ZXh0LlxuZnVuY3Rpb24gZXh0cmFjdEVudGl0aWVzKGxpbmUpIHtcbiAgbGV0IG1hdGNoO1xuICBsZXQgZXh0cmFjdGVkID0gW107XG4gIEVOVElUWV9UWVBFUy5mb3JFYWNoKChlbnRpdHkpID0+IHtcbiAgICB3aGlsZSAoKG1hdGNoID0gZW50aXR5LnJlLmV4ZWMobGluZSkpICE9PSBudWxsKSB7XG4gICAgICBleHRyYWN0ZWQucHVzaCh7XG4gICAgICAgIG9mZnNldDogbWF0Y2hbJ2luZGV4J10sXG4gICAgICAgIGxlbjogbWF0Y2hbMF0ubGVuZ3RoLFxuICAgICAgICB1bmlxdWU6IG1hdGNoWzBdLFxuICAgICAgICBkYXRhOiBlbnRpdHkucGFjayhtYXRjaFswXSksXG4gICAgICAgIHR5cGU6IGVudGl0eS5uYW1lXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG4gIGlmIChleHRyYWN0ZWQubGVuZ3RoID09IDApIHtcbiAgICByZXR1cm4gZXh0cmFjdGVkO1xuICB9XG5cbiAgLy8gUmVtb3ZlIGVudGl0aWVzIGRldGVjdGVkIGluc2lkZSBvdGhlciBlbnRpdGllcywgbGlrZSAjaGFzaHRhZyBpbiBhIFVSTC5cbiAgZXh0cmFjdGVkLnNvcnQoKGEsIGIpID0+IHtcbiAgICByZXR1cm4gYS5vZmZzZXQgLSBiLm9mZnNldDtcbiAgfSk7XG5cbiAgbGV0IGlkeCA9IC0xO1xuICBleHRyYWN0ZWQgPSBleHRyYWN0ZWQuZmlsdGVyKChlbCkgPT4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IChlbC5vZmZzZXQgPiBpZHgpO1xuICAgIGlkeCA9IGVsLm9mZnNldCArIGVsLmxlbjtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9KTtcblxuICByZXR1cm4gZXh0cmFjdGVkO1xufVxuXG4vLyBDb252ZXJ0IHRoZSBjaHVua3MgaW50byBmb3JtYXQgc3VpdGFibGUgZm9yIHNlcmlhbGl6YXRpb24uXG5mdW5jdGlvbiBkcmFmdGlmeShjaHVua3MsIHN0YXJ0QXQpIHtcbiAgbGV0IHBsYWluID0gJyc7XG4gIGxldCByYW5nZXMgPSBbXTtcbiAgZm9yIChsZXQgaSBpbiBjaHVua3MpIHtcbiAgICBjb25zdCBjaHVuayA9IGNodW5rc1tpXTtcbiAgICBpZiAoIWNodW5rLnR4dCkge1xuICAgICAgY29uc3QgZHJhZnR5ID0gZHJhZnRpZnkoY2h1bmsuY2hpbGRyZW4sIHBsYWluLmxlbmd0aCArIHN0YXJ0QXQpO1xuICAgICAgY2h1bmsudHh0ID0gZHJhZnR5LnR4dDtcbiAgICAgIHJhbmdlcyA9IHJhbmdlcy5jb25jYXQoZHJhZnR5LmZtdCk7XG4gICAgfVxuXG4gICAgaWYgKGNodW5rLnRwKSB7XG4gICAgICByYW5nZXMucHVzaCh7XG4gICAgICAgIGF0OiBwbGFpbi5sZW5ndGggKyBzdGFydEF0LFxuICAgICAgICBsZW46IGNodW5rLnR4dC5sZW5ndGgsXG4gICAgICAgIHRwOiBjaHVuay50cFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcGxhaW4gKz0gY2h1bmsudHh0O1xuICB9XG4gIHJldHVybiB7XG4gICAgdHh0OiBwbGFpbixcbiAgICBmbXQ6IHJhbmdlc1xuICB9O1xufVxuXG4vLyBDcmVhdGUgYSBjb3B5IG9mIGVudGl0eSBkYXRhIHdpdGggKGxpZ2h0PWZhbHNlKSBvciB3aXRob3V0IChsaWdodD10cnVlKSB0aGUgbGFyZ2UgcGF5bG9hZC5cbi8vIFRoZSBhcnJheSAnYWxsb3cnIGNvbnRhaW5zIGEgbGlzdCBvZiBmaWVsZHMgZXhlbXB0IGZyb20gc3RyaXBwaW5nLlxuZnVuY3Rpb24gY29weUVudERhdGEoZGF0YSwgbGlnaHQsIGFsbG93KSB7XG4gIGlmIChkYXRhICYmIE9iamVjdC5lbnRyaWVzKGRhdGEpLmxlbmd0aCA+IDApIHtcbiAgICBhbGxvdyA9IGFsbG93IHx8IFtdO1xuICAgIGNvbnN0IGRjID0ge307XG4gICAgQUxMT1dFRF9FTlRfRklFTERTLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgaWYgKGRhdGFba2V5XSkge1xuICAgICAgICBpZiAobGlnaHQgJiYgIWFsbG93LmluY2x1ZGVzKGtleSkgJiZcbiAgICAgICAgICAodHlwZW9mIGRhdGFba2V5XSA9PSAnc3RyaW5nJyB8fCBBcnJheS5pc0FycmF5KGRhdGFba2V5XSkpICYmXG4gICAgICAgICAgZGF0YVtrZXldLmxlbmd0aCA+IE1BWF9QUkVWSUVXX0RBVEFfU0laRSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGRhdGFba2V5XSA9PSAnb2JqZWN0Jykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBkY1trZXldID0gZGF0YVtrZXldO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKE9iamVjdC5lbnRyaWVzKGRjKS5sZW5ndGggIT0gMCkge1xuICAgICAgcmV0dXJuIGRjO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuaWYgKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBEcmFmdHk7XG59XG4iLCIvKipcbiAqIEBmaWxlIFV0aWxpdGllcyBmb3IgdXBsb2FkaW5nIGFuZCBkb3dubG9hZGluZyBmaWxlcy5cbiAqXG4gKiBAY29weXJpZ2h0IDIwMTUtMjAyMiBUaW5vZGUgTExDLlxuICovXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7XG4gIGpzb25QYXJzZUhlbHBlclxufSBmcm9tICcuL3V0aWxzLmpzJztcblxubGV0IFhIUlByb3ZpZGVyO1xuXG4vKipcbiAqIEBjbGFzcyBMYXJnZUZpbGVIZWxwZXIgLSB1dGlsaXRpZXMgZm9yIHVwbG9hZGluZyBhbmQgZG93bmxvYWRpbmcgZmlsZXMgb3V0IG9mIGJhbmQuXG4gKiBEb24ndCBpbnN0YW50aWF0ZSB0aGlzIGNsYXNzIGRpcmVjdGx5LiBVc2Uge1Rpbm9kZS5nZXRMYXJnZUZpbGVIZWxwZXJ9IGluc3RlYWQuXG4gKiBAbWVtYmVyb2YgVGlub2RlXG4gKlxuICogQHBhcmFtIHtUaW5vZGV9IHRpbm9kZSAtIHRoZSBtYWluIFRpbm9kZSBvYmplY3QuXG4gKiBAcGFyYW0ge3N0cmluZ30gdmVyc2lvbiAtIHByb3RvY29sIHZlcnNpb24sIGkuZS4gJzAnLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMYXJnZUZpbGVIZWxwZXIge1xuICBjb25zdHJ1Y3Rvcih0aW5vZGUsIHZlcnNpb24pIHtcbiAgICB0aGlzLl90aW5vZGUgPSB0aW5vZGU7XG4gICAgdGhpcy5fdmVyc2lvbiA9IHZlcnNpb247XG5cbiAgICB0aGlzLl9hcGlLZXkgPSB0aW5vZGUuX2FwaUtleTtcbiAgICB0aGlzLl9hdXRoVG9rZW4gPSB0aW5vZGUuZ2V0QXV0aFRva2VuKCk7XG4gICAgdGhpcy5fcmVxSWQgPSB0aW5vZGUuZ2V0TmV4dFVuaXF1ZUlkKCk7XG4gICAgdGhpcy54aHIgPSBuZXcgWEhSUHJvdmlkZXIoKTtcblxuICAgIC8vIFByb21pc2VcbiAgICB0aGlzLnRvUmVzb2x2ZSA9IG51bGw7XG4gICAgdGhpcy50b1JlamVjdCA9IG51bGw7XG5cbiAgICAvLyBDYWxsYmFja3NcbiAgICB0aGlzLm9uUHJvZ3Jlc3MgPSBudWxsO1xuICAgIHRoaXMub25TdWNjZXNzID0gbnVsbDtcbiAgICB0aGlzLm9uRmFpbHVyZSA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnQgdXBsb2FkaW5nIHRoZSBmaWxlIHRvIGEgbm9uLWRlZmF1bHQgZW5kcG9pbnQuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTGFyZ2VGaWxlSGVscGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gYmFzZVVybCBhbHRlcm5hdGl2ZSBiYXNlIFVSTCBvZiB1cGxvYWQgc2VydmVyLlxuICAgKiBAcGFyYW0ge0ZpbGV8QmxvYn0gZGF0YSB0byB1cGxvYWQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhdmF0YXJGb3IgdG9waWMgbmFtZSBpZiB0aGUgdXBsb2FkIHJlcHJlc2VudHMgYW4gYXZhdGFyLlxuICAgKiBAcGFyYW0ge0NhbGxiYWNrfSBvblByb2dyZXNzIGNhbGxiYWNrLiBUYWtlcyBvbmUge2Zsb2F0fSBwYXJhbWV0ZXIgMC4uMVxuICAgKiBAcGFyYW0ge0NhbGxiYWNrfSBvblN1Y2Nlc3MgY2FsbGJhY2suIENhbGxlZCB3aGVuIHRoZSBmaWxlIGlzIHN1Y2Nlc3NmdWxseSB1cGxvYWRlZC5cbiAgICogQHBhcmFtIHtDYWxsYmFja30gb25GYWlsdXJlIGNhbGxiYWNrLiBDYWxsZWQgaW4gY2FzZSBvZiBhIGZhaWx1cmUuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSB1cGxvYWQgaXMgY29tcGxldGVkL2ZhaWxlZC5cbiAgICovXG4gIHVwbG9hZFdpdGhCYXNlVXJsKGJhc2VVcmwsIGRhdGEsIGF2YXRhckZvciwgb25Qcm9ncmVzcywgb25TdWNjZXNzLCBvbkZhaWx1cmUpIHtcbiAgICBpZiAoIXRoaXMuX2F1dGhUb2tlbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTXVzdCBhdXRoZW50aWNhdGUgZmlyc3RcIik7XG4gICAgfVxuICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcztcblxuICAgIGxldCB1cmwgPSBgL3Yke3RoaXMuX3ZlcnNpb259L2ZpbGUvdS9gO1xuICAgIGlmIChiYXNlVXJsKSB7XG4gICAgICBsZXQgYmFzZSA9IGJhc2VVcmw7XG4gICAgICBpZiAoYmFzZS5lbmRzV2l0aCgnLycpKSB7XG4gICAgICAgIC8vIFJlbW92aW5nIHRyYWlsaW5nIHNsYXNoLlxuICAgICAgICBiYXNlID0gYmFzZS5zbGljZSgwLCAtMSk7XG4gICAgICB9XG4gICAgICBpZiAoYmFzZS5zdGFydHNXaXRoKCdodHRwOi8vJykgfHwgYmFzZS5zdGFydHNXaXRoKCdodHRwczovLycpKSB7XG4gICAgICAgIHVybCA9IGJhc2UgKyB1cmw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgYmFzZSBVUkwgJyR7YmFzZVVybH0nYCk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMueGhyLm9wZW4oJ1BPU1QnLCB1cmwsIHRydWUpO1xuICAgIHRoaXMueGhyLnNldFJlcXVlc3RIZWFkZXIoJ1gtVGlub2RlLUFQSUtleScsIHRoaXMuX2FwaUtleSk7XG4gICAgdGhpcy54aHIuc2V0UmVxdWVzdEhlYWRlcignWC1UaW5vZGUtQXV0aCcsIGBUb2tlbiAke3RoaXMuX2F1dGhUb2tlbi50b2tlbn1gKTtcbiAgICBjb25zdCByZXN1bHQgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLnRvUmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgICB0aGlzLnRvUmVqZWN0ID0gcmVqZWN0O1xuICAgIH0pO1xuXG4gICAgdGhpcy5vblByb2dyZXNzID0gb25Qcm9ncmVzcztcbiAgICB0aGlzLm9uU3VjY2VzcyA9IG9uU3VjY2VzcztcbiAgICB0aGlzLm9uRmFpbHVyZSA9IG9uRmFpbHVyZTtcblxuICAgIHRoaXMueGhyLnVwbG9hZC5vbnByb2dyZXNzID0gKGUpID0+IHtcbiAgICAgIGlmIChlLmxlbmd0aENvbXB1dGFibGUgJiYgaW5zdGFuY2Uub25Qcm9ncmVzcykge1xuICAgICAgICBpbnN0YW5jZS5vblByb2dyZXNzKGUubG9hZGVkIC8gZS50b3RhbCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMueGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IHBrdDtcbiAgICAgIHRyeSB7XG4gICAgICAgIHBrdCA9IEpTT04ucGFyc2UodGhpcy5yZXNwb25zZSwganNvblBhcnNlSGVscGVyKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBpbnN0YW5jZS5fdGlub2RlLmxvZ2dlcihcIkVSUk9SOiBJbnZhbGlkIHNlcnZlciByZXNwb25zZSBpbiBMYXJnZUZpbGVIZWxwZXJcIiwgdGhpcy5yZXNwb25zZSk7XG4gICAgICAgIHBrdCA9IHtcbiAgICAgICAgICBjdHJsOiB7XG4gICAgICAgICAgICBjb2RlOiB0aGlzLnN0YXR1cyxcbiAgICAgICAgICAgIHRleHQ6IHRoaXMuc3RhdHVzVGV4dFxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuc3RhdHVzID49IDIwMCAmJiB0aGlzLnN0YXR1cyA8IDMwMCkge1xuICAgICAgICBpZiAoaW5zdGFuY2UudG9SZXNvbHZlKSB7XG4gICAgICAgICAgaW5zdGFuY2UudG9SZXNvbHZlKHBrdC5jdHJsLnBhcmFtcy51cmwpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbnN0YW5jZS5vblN1Y2Nlc3MpIHtcbiAgICAgICAgICBpbnN0YW5jZS5vblN1Y2Nlc3MocGt0LmN0cmwpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdHVzID49IDQwMCkge1xuICAgICAgICBpZiAoaW5zdGFuY2UudG9SZWplY3QpIHtcbiAgICAgICAgICBpbnN0YW5jZS50b1JlamVjdChuZXcgRXJyb3IoYCR7cGt0LmN0cmwudGV4dH0gKCR7cGt0LmN0cmwuY29kZX0pYCkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbnN0YW5jZS5vbkZhaWx1cmUpIHtcbiAgICAgICAgICBpbnN0YW5jZS5vbkZhaWx1cmUocGt0LmN0cmwpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnN0YW5jZS5fdGlub2RlLmxvZ2dlcihcIkVSUk9SOiBVbmV4cGVjdGVkIHNlcnZlciByZXNwb25zZSBzdGF0dXNcIiwgdGhpcy5zdGF0dXMsIHRoaXMucmVzcG9uc2UpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLnhoci5vbmVycm9yID0gZnVuY3Rpb24oZSkge1xuICAgICAgaWYgKGluc3RhbmNlLnRvUmVqZWN0KSB7XG4gICAgICAgIGluc3RhbmNlLnRvUmVqZWN0KG5ldyBFcnJvcihcImZhaWxlZFwiKSk7XG4gICAgICB9XG4gICAgICBpZiAoaW5zdGFuY2Uub25GYWlsdXJlKSB7XG4gICAgICAgIGluc3RhbmNlLm9uRmFpbHVyZShudWxsKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy54aHIub25hYm9ydCA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgIGlmIChpbnN0YW5jZS50b1JlamVjdCkge1xuICAgICAgICBpbnN0YW5jZS50b1JlamVjdChuZXcgRXJyb3IoXCJ1cGxvYWQgY2FuY2VsbGVkIGJ5IHVzZXJcIikpO1xuICAgICAgfVxuICAgICAgaWYgKGluc3RhbmNlLm9uRmFpbHVyZSkge1xuICAgICAgICBpbnN0YW5jZS5vbkZhaWx1cmUobnVsbCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCBmb3JtID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgICBmb3JtLmFwcGVuZCgnZmlsZScsIGRhdGEpO1xuICAgICAgZm9ybS5zZXQoJ2lkJywgdGhpcy5fcmVxSWQpO1xuICAgICAgaWYgKGF2YXRhckZvcikge1xuICAgICAgICBmb3JtLnNldCgndG9waWMnLCBhdmF0YXJGb3IpO1xuICAgICAgfVxuICAgICAgdGhpcy54aHIuc2VuZChmb3JtKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGlmICh0aGlzLnRvUmVqZWN0KSB7XG4gICAgICAgIHRoaXMudG9SZWplY3QoZXJyKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm9uRmFpbHVyZSkge1xuICAgICAgICB0aGlzLm9uRmFpbHVyZShudWxsKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIC8qKlxuICAgKiBTdGFydCB1cGxvYWRpbmcgdGhlIGZpbGUgdG8gZGVmYXVsdCBlbmRwb2ludC5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZS5MYXJnZUZpbGVIZWxwZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7RmlsZXxCbG9ifSBkYXRhIHRvIHVwbG9hZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gYXZhdGFyRm9yIHRvcGljIG5hbWUgaWYgdGhlIHVwbG9hZCByZXByZXNlbnRzIGFuIGF2YXRhci5cbiAgICogQHBhcmFtIHtDYWxsYmFja30gb25Qcm9ncmVzcyBjYWxsYmFjay4gVGFrZXMgb25lIHtmbG9hdH0gcGFyYW1ldGVyIDAuLjFcbiAgICogQHBhcmFtIHtDYWxsYmFja30gb25TdWNjZXNzIGNhbGxiYWNrLiBDYWxsZWQgd2hlbiB0aGUgZmlsZSBpcyBzdWNjZXNzZnVsbHkgdXBsb2FkZWQuXG4gICAqIEBwYXJhbSB7Q2FsbGJhY2t9IG9uRmFpbHVyZSBjYWxsYmFjay4gQ2FsbGVkIGluIGNhc2Ugb2YgYSBmYWlsdXJlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgdXBsb2FkIGlzIGNvbXBsZXRlZC9mYWlsZWQuXG4gICAqL1xuICB1cGxvYWQoZGF0YSwgYXZhdGFyRm9yLCBvblByb2dyZXNzLCBvblN1Y2Nlc3MsIG9uRmFpbHVyZSkge1xuICAgIGNvbnN0IGJhc2VVcmwgPSAodGhpcy5fdGlub2RlLl9zZWN1cmUgPyAnaHR0cHM6Ly8nIDogJ2h0dHA6Ly8nKSArIHRoaXMuX3Rpbm9kZS5faG9zdDtcbiAgICByZXR1cm4gdGhpcy51cGxvYWRXaXRoQmFzZVVybChiYXNlVXJsLCBkYXRhLCBhdmF0YXJGb3IsIG9uUHJvZ3Jlc3MsIG9uU3VjY2Vzcywgb25GYWlsdXJlKTtcbiAgfVxuICAvKipcbiAgICogRG93bmxvYWQgdGhlIGZpbGUgZnJvbSBhIGdpdmVuIFVSTCB1c2luZyBHRVQgcmVxdWVzdC4gVGhpcyBtZXRob2Qgd29ya3Mgd2l0aCB0aGUgVGlub2RlIHNlcnZlciBvbmx5LlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkxhcmdlRmlsZUhlbHBlciNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHJlbGF0aXZlVXJsIC0gVVJMIHRvIGRvd25sb2FkIHRoZSBmaWxlIGZyb20uIE11c3QgYmUgcmVsYXRpdmUgdXJsLCBpLmUuIG11c3Qgbm90IGNvbnRhaW4gdGhlIGhvc3QuXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gZmlsZW5hbWUgLSBmaWxlIG5hbWUgdG8gdXNlIGZvciB0aGUgZG93bmxvYWRlZCBmaWxlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgZG93bmxvYWQgaXMgY29tcGxldGVkL2ZhaWxlZC5cbiAgICovXG4gIGRvd25sb2FkKHJlbGF0aXZlVXJsLCBmaWxlbmFtZSwgbWltZXR5cGUsIG9uUHJvZ3Jlc3MsIG9uRXJyb3IpIHtcbiAgICBpZiAoIVRpbm9kZS5pc1JlbGF0aXZlVVJMKHJlbGF0aXZlVXJsKSkge1xuICAgICAgLy8gQXMgYSBzZWN1cml0eSBtZWFzdXJlIHJlZnVzZSB0byBkb3dubG9hZCBmcm9tIGFuIGFic29sdXRlIFVSTC5cbiAgICAgIGlmIChvbkVycm9yKSB7XG4gICAgICAgIG9uRXJyb3IoYFRoZSBVUkwgJyR7cmVsYXRpdmVVcmx9JyBtdXN0IGJlIHJlbGF0aXZlLCBub3QgYWJzb2x1dGVgKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCF0aGlzLl9hdXRoVG9rZW4pIHtcbiAgICAgIGlmIChvbkVycm9yKSB7XG4gICAgICAgIG9uRXJyb3IoXCJNdXN0IGF1dGhlbnRpY2F0ZSBmaXJzdFwiKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzO1xuICAgIC8vIEdldCBkYXRhIGFzIGJsb2IgKHN0b3JlZCBieSB0aGUgYnJvd3NlciBhcyBhIHRlbXBvcmFyeSBmaWxlKS5cbiAgICB0aGlzLnhoci5vcGVuKCdHRVQnLCByZWxhdGl2ZVVybCwgdHJ1ZSk7XG4gICAgdGhpcy54aHIuc2V0UmVxdWVzdEhlYWRlcignWC1UaW5vZGUtQVBJS2V5JywgdGhpcy5fYXBpS2V5KTtcbiAgICB0aGlzLnhoci5zZXRSZXF1ZXN0SGVhZGVyKCdYLVRpbm9kZS1BdXRoJywgJ1Rva2VuICcgKyB0aGlzLl9hdXRoVG9rZW4udG9rZW4pO1xuICAgIHRoaXMueGhyLnJlc3BvbnNlVHlwZSA9ICdibG9iJztcblxuICAgIHRoaXMub25Qcm9ncmVzcyA9IG9uUHJvZ3Jlc3M7XG4gICAgdGhpcy54aHIub25wcm9ncmVzcyA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgIGlmIChpbnN0YW5jZS5vblByb2dyZXNzKSB7XG4gICAgICAgIC8vIFBhc3NpbmcgZS5sb2FkZWQgaW5zdGVhZCBvZiBlLmxvYWRlZC9lLnRvdGFsIGJlY2F1c2UgZS50b3RhbFxuICAgICAgICAvLyBpcyBhbHdheXMgMCB3aXRoIGd6aXAgY29tcHJlc3Npb24gZW5hYmxlZCBieSB0aGUgc2VydmVyLlxuICAgICAgICBpbnN0YW5jZS5vblByb2dyZXNzKGUubG9hZGVkKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgcmVzdWx0ID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy50b1Jlc29sdmUgPSByZXNvbHZlO1xuICAgICAgdGhpcy50b1JlamVjdCA9IHJlamVjdDtcbiAgICB9KTtcblxuICAgIC8vIFRoZSBibG9iIG5lZWRzIHRvIGJlIHNhdmVkIGFzIGZpbGUuIFRoZXJlIGlzIG5vIGtub3duIHdheSB0b1xuICAgIC8vIHNhdmUgdGhlIGJsb2IgYXMgZmlsZSBvdGhlciB0aGFuIHRvIGZha2UgYSBjbGljayBvbiBhbiA8YSBocmVmLi4uIGRvd25sb2FkPS4uLj4uXG4gICAgdGhpcy54aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5zdGF0dXMgPT0gMjAwKSB7XG4gICAgICAgIGNvbnN0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgIC8vIFVSTC5jcmVhdGVPYmplY3RVUkwgaXMgbm90IGF2YWlsYWJsZSBpbiBub24tYnJvd3NlciBlbnZpcm9ubWVudC4gVGhpcyBjYWxsIHdpbGwgZmFpbC5cbiAgICAgICAgbGluay5ocmVmID0gd2luZG93LlVSTC5jcmVhdGVPYmplY3RVUkwobmV3IEJsb2IoW3RoaXMucmVzcG9uc2VdLCB7XG4gICAgICAgICAgdHlwZTogbWltZXR5cGVcbiAgICAgICAgfSkpO1xuICAgICAgICBsaW5rLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIGxpbmsuc2V0QXR0cmlidXRlKCdkb3dubG9hZCcsIGZpbGVuYW1lKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsaW5rKTtcbiAgICAgICAgbGluay5jbGljaygpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGxpbmspO1xuICAgICAgICB3aW5kb3cuVVJMLnJldm9rZU9iamVjdFVSTChsaW5rLmhyZWYpO1xuICAgICAgICBpZiAoaW5zdGFuY2UudG9SZXNvbHZlKSB7XG4gICAgICAgICAgaW5zdGFuY2UudG9SZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0dXMgPj0gNDAwICYmIGluc3RhbmNlLnRvUmVqZWN0KSB7XG4gICAgICAgIC8vIFRoZSB0aGlzLnJlc3BvbnNlVGV4dCBpcyB1bmRlZmluZWQsIG11c3QgdXNlIHRoaXMucmVzcG9uc2Ugd2hpY2ggaXMgYSBibG9iLlxuICAgICAgICAvLyBOZWVkIHRvIGNvbnZlcnQgdGhpcy5yZXNwb25zZSB0byBKU09OLiBUaGUgYmxvYiBjYW4gb25seSBiZSBhY2Nlc3NlZCBieSB0aGVcbiAgICAgICAgLy8gRmlsZVJlYWRlci5cbiAgICAgICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICAgICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBwa3QgPSBKU09OLnBhcnNlKHRoaXMucmVzdWx0LCBqc29uUGFyc2VIZWxwZXIpO1xuICAgICAgICAgICAgaW5zdGFuY2UudG9SZWplY3QobmV3IEVycm9yKGAke3BrdC5jdHJsLnRleHR9ICgke3BrdC5jdHJsLmNvZGV9KWApKTtcbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGluc3RhbmNlLl90aW5vZGUubG9nZ2VyKFwiRVJST1I6IEludmFsaWQgc2VydmVyIHJlc3BvbnNlIGluIExhcmdlRmlsZUhlbHBlclwiLCB0aGlzLnJlc3VsdCk7XG4gICAgICAgICAgICBpbnN0YW5jZS50b1JlamVjdChlcnIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcmVhZGVyLnJlYWRBc1RleHQodGhpcy5yZXNwb25zZSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMueGhyLm9uZXJyb3IgPSBmdW5jdGlvbihlKSB7XG4gICAgICBpZiAoaW5zdGFuY2UudG9SZWplY3QpIHtcbiAgICAgICAgaW5zdGFuY2UudG9SZWplY3QobmV3IEVycm9yKFwiZmFpbGVkXCIpKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy54aHIub25hYm9ydCA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKGluc3RhbmNlLnRvUmVqZWN0KSB7XG4gICAgICAgIGluc3RhbmNlLnRvUmVqZWN0KG51bGwpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0cnkge1xuICAgICAgdGhpcy54aHIuc2VuZCgpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgaWYgKHRoaXMudG9SZWplY3QpIHtcbiAgICAgICAgdGhpcy50b1JlamVjdChlcnIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgLyoqXG4gICAqIFRyeSB0byBjYW5jZWwgYW4gb25nb2luZyB1cGxvYWQgb3IgZG93bmxvYWQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTGFyZ2VGaWxlSGVscGVyI1xuICAgKi9cbiAgY2FuY2VsKCkge1xuICAgIGlmICh0aGlzLnhociAmJiB0aGlzLnhoci5yZWFkeVN0YXRlIDwgNCkge1xuICAgICAgdGhpcy54aHIuYWJvcnQoKTtcbiAgICB9XG4gIH1cbiAgLyoqXG4gICAqIEdldCB1bmlxdWUgaWQgb2YgdGhpcyByZXF1ZXN0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkxhcmdlRmlsZUhlbHBlciNcbiAgICpcbiAgICogQHJldHVybnMge3N0cmluZ30gdW5pcXVlIGlkXG4gICAqL1xuICBnZXRJZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fcmVxSWQ7XG4gIH1cbiAgLyoqXG4gICAqIFRvIHVzZSBMYXJnZUZpbGVIZWxwZXIgaW4gYSBub24gYnJvd3NlciBjb250ZXh0LCBzdXBwbHkgWE1MSHR0cFJlcXVlc3QgcHJvdmlkZXIuXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlcm9mIExhcmdlRmlsZUhlbHBlclxuICAgKiBAcGFyYW0geGhyUHJvdmlkZXIgWE1MSHR0cFJlcXVlc3QgcHJvdmlkZXIsIGUuZy4gZm9yIG5vZGUgPGNvZGU+cmVxdWlyZSgneGhyJyk8L2NvZGU+LlxuICAgKi9cbiAgc3RhdGljIHNldE5ldHdvcmtQcm92aWRlcih4aHJQcm92aWRlcikge1xuICAgIFhIUlByb3ZpZGVyID0geGhyUHJvdmlkZXI7XG4gIH1cbn1cbiIsIi8qKlxuICogQGZpbGUgSGVscGVyIGNsYXNzIGZvciBjb25zdHJ1Y3Rpbmcge0BsaW5rIFRpbm9kZS5HZXRRdWVyeX0uXG4gKlxuICogQGNvcHlyaWdodCAyMDE1LTIwMjIgVGlub2RlIExMQy5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEhlbHBlciBjbGFzcyBmb3IgY29uc3RydWN0aW5nIHtAbGluayBUaW5vZGUuR2V0UXVlcnl9LlxuICpcbiAqIEBjbGFzcyBNZXRhR2V0QnVpbGRlclxuICogQG1lbWJlcm9mIFRpbm9kZVxuICpcbiAqIEBwYXJhbSB7VGlub2RlLlRvcGljfSBwYXJlbnQgdG9waWMgd2hpY2ggaW5zdGFudGlhdGVkIHRoaXMgYnVpbGRlci5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWV0YUdldEJ1aWxkZXIge1xuICBjb25zdHJ1Y3RvcihwYXJlbnQpIHtcbiAgICB0aGlzLnRvcGljID0gcGFyZW50O1xuICAgIHRoaXMud2hhdCA9IHt9O1xuICB9XG5cbiAgLy8gR2V0IHRpbWVzdGFtcCBvZiB0aGUgbW9zdCByZWNlbnQgZGVzYyB1cGRhdGUuXG4gICNnZXRfZGVzY19pbXMoKSB7XG4gICAgcmV0dXJuIHRoaXMudG9waWMudXBkYXRlZDtcbiAgfVxuXG4gIC8vIEdldCB0aW1lc3RhbXAgb2YgdGhlIG1vc3QgcmVjZW50IHN1YnMgdXBkYXRlLlxuICAjZ2V0X3N1YnNfaW1zKCkge1xuICAgIGlmICh0aGlzLnRvcGljLmlzUDJQVHlwZSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy4jZ2V0X2Rlc2NfaW1zKCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnRvcGljLl9sYXN0U3Vic1VwZGF0ZTtcbiAgfVxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggbWVzc2FnZXMgd2l0aGluIGV4cGxpY2l0IGxpbWl0cy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXI9fSBzaW5jZSAtIG1lc3NhZ2VzIG5ld2VyIHRoYW4gdGhpcyAoaW5jbHVzaXZlKTtcbiAgICogQHBhcmFtIHtudW1iZXI9fSBiZWZvcmUgLSBvbGRlciB0aGFuIHRoaXMgKGV4Y2x1c2l2ZSlcbiAgICogQHBhcmFtIHtudW1iZXI9fSBsaW1pdCAtIG51bWJlciBvZiBtZXNzYWdlcyB0byBmZXRjaFxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSA8Y29kZT50aGlzPC9jb2RlPiBvYmplY3QuXG4gICAqL1xuICB3aXRoRGF0YShzaW5jZSwgYmVmb3JlLCBsaW1pdCkge1xuICAgIHRoaXMud2hhdFsnZGF0YSddID0ge1xuICAgICAgc2luY2U6IHNpbmNlLFxuICAgICAgYmVmb3JlOiBiZWZvcmUsXG4gICAgICBsaW1pdDogbGltaXRcbiAgICB9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8qKlxuICAgKiBBZGQgcXVlcnkgcGFyYW1ldGVycyB0byBmZXRjaCBtZXNzYWdlcyBuZXdlciB0aGFuIHRoZSBsYXRlc3Qgc2F2ZWQgbWVzc2FnZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXI9fSBsaW1pdCAtIG51bWJlciBvZiBtZXNzYWdlcyB0byBmZXRjaFxuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSA8Y29kZT50aGlzPC9jb2RlPiBvYmplY3QuXG4gICAqL1xuICB3aXRoTGF0ZXJEYXRhKGxpbWl0KSB7XG4gICAgcmV0dXJuIHRoaXMud2l0aERhdGEodGhpcy50b3BpYy5fbWF4U2VxID4gMCA/IHRoaXMudG9waWMuX21heFNlcSArIDEgOiB1bmRlZmluZWQsIHVuZGVmaW5lZCwgbGltaXQpO1xuICB9XG4gIC8qKlxuICAgKiBBZGQgcXVlcnkgcGFyYW1ldGVycyB0byBmZXRjaCBtZXNzYWdlcyBvbGRlciB0aGFuIHRoZSBlYXJsaWVzdCBzYXZlZCBtZXNzYWdlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcj19IGxpbWl0IC0gbWF4aW11bSBudW1iZXIgb2YgbWVzc2FnZXMgdG8gZmV0Y2guXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IDxjb2RlPnRoaXM8L2NvZGU+IG9iamVjdC5cbiAgICovXG4gIHdpdGhFYXJsaWVyRGF0YShsaW1pdCkge1xuICAgIHJldHVybiB0aGlzLndpdGhEYXRhKHVuZGVmaW5lZCwgdGhpcy50b3BpYy5fbWluU2VxID4gMCA/IHRoaXMudG9waWMuX21pblNlcSA6IHVuZGVmaW5lZCwgbGltaXQpO1xuICB9XG4gIC8qKlxuICAgKiBBZGQgcXVlcnkgcGFyYW1ldGVycyB0byBmZXRjaCB0b3BpYyBkZXNjcmlwdGlvbiBpZiBpdCdzIG5ld2VyIHRoYW4gdGhlIGdpdmVuIHRpbWVzdGFtcC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICpcbiAgICogQHBhcmFtIHtEYXRlPX0gaW1zIC0gZmV0Y2ggbWVzc2FnZXMgbmV3ZXIgdGhhbiB0aGlzIHRpbWVzdGFtcC5cbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aERlc2MoaW1zKSB7XG4gICAgdGhpcy53aGF0WydkZXNjJ10gPSB7XG4gICAgICBpbXM6IGltc1xuICAgIH07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIHRvcGljIGRlc2NyaXB0aW9uIGlmIGl0J3MgbmV3ZXIgdGhhbiB0aGUgbGFzdCB1cGRhdGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IDxjb2RlPnRoaXM8L2NvZGU+IG9iamVjdC5cbiAgICovXG4gIHdpdGhMYXRlckRlc2MoKSB7XG4gICAgcmV0dXJuIHRoaXMud2l0aERlc2ModGhpcy4jZ2V0X2Rlc2NfaW1zKCkpO1xuICB9XG4gIC8qKlxuICAgKiBBZGQgcXVlcnkgcGFyYW1ldGVycyB0byBmZXRjaCBzdWJzY3JpcHRpb25zLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge0RhdGU9fSBpbXMgLSBmZXRjaCBzdWJzY3JpcHRpb25zIG1vZGlmaWVkIG1vcmUgcmVjZW50bHkgdGhhbiB0aGlzIHRpbWVzdGFtcFxuICAgKiBAcGFyYW0ge251bWJlcj19IGxpbWl0IC0gbWF4aW11bSBudW1iZXIgb2Ygc3Vic2NyaXB0aW9ucyB0byBmZXRjaC5cbiAgICogQHBhcmFtIHtzdHJpbmc9fSB1c2VyT3JUb3BpYyAtIHVzZXIgSUQgb3IgdG9waWMgbmFtZSB0byBmZXRjaCBmb3IgZmV0Y2hpbmcgb25lIHN1YnNjcmlwdGlvbi5cbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aFN1YihpbXMsIGxpbWl0LCB1c2VyT3JUb3BpYykge1xuICAgIGNvbnN0IG9wdHMgPSB7XG4gICAgICBpbXM6IGltcyxcbiAgICAgIGxpbWl0OiBsaW1pdFxuICAgIH07XG4gICAgaWYgKHRoaXMudG9waWMuZ2V0VHlwZSgpID09ICdtZScpIHtcbiAgICAgIG9wdHMudG9waWMgPSB1c2VyT3JUb3BpYztcbiAgICB9IGVsc2Uge1xuICAgICAgb3B0cy51c2VyID0gdXNlck9yVG9waWM7XG4gICAgfVxuICAgIHRoaXMud2hhdFsnc3ViJ10gPSBvcHRzO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8qKlxuICAgKiBBZGQgcXVlcnkgcGFyYW1ldGVycyB0byBmZXRjaCBhIHNpbmdsZSBzdWJzY3JpcHRpb24uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7RGF0ZT19IGltcyAtIGZldGNoIHN1YnNjcmlwdGlvbnMgbW9kaWZpZWQgbW9yZSByZWNlbnRseSB0aGFuIHRoaXMgdGltZXN0YW1wXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gdXNlck9yVG9waWMgLSB1c2VyIElEIG9yIHRvcGljIG5hbWUgdG8gZmV0Y2ggZm9yIGZldGNoaW5nIG9uZSBzdWJzY3JpcHRpb24uXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IDxjb2RlPnRoaXM8L2NvZGU+IG9iamVjdC5cbiAgICovXG4gIHdpdGhPbmVTdWIoaW1zLCB1c2VyT3JUb3BpYykge1xuICAgIHJldHVybiB0aGlzLndpdGhTdWIoaW1zLCB1bmRlZmluZWQsIHVzZXJPclRvcGljKTtcbiAgfVxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggYSBzaW5nbGUgc3Vic2NyaXB0aW9uIGlmIGl0J3MgYmVlbiB1cGRhdGVkIHNpbmNlIHRoZSBsYXN0IHVwZGF0ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmc9fSB1c2VyT3JUb3BpYyAtIHVzZXIgSUQgb3IgdG9waWMgbmFtZSB0byBmZXRjaCBmb3IgZmV0Y2hpbmcgb25lIHN1YnNjcmlwdGlvbi5cbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aExhdGVyT25lU3ViKHVzZXJPclRvcGljKSB7XG4gICAgcmV0dXJuIHRoaXMud2l0aE9uZVN1Yih0aGlzLnRvcGljLl9sYXN0U3Vic1VwZGF0ZSwgdXNlck9yVG9waWMpO1xuICB9XG4gIC8qKlxuICAgKiBBZGQgcXVlcnkgcGFyYW1ldGVycyB0byBmZXRjaCBzdWJzY3JpcHRpb25zIHVwZGF0ZWQgc2luY2UgdGhlIGxhc3QgdXBkYXRlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcj19IGxpbWl0IC0gbWF4aW11bSBudW1iZXIgb2Ygc3Vic2NyaXB0aW9ucyB0byBmZXRjaC5cbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aExhdGVyU3ViKGxpbWl0KSB7XG4gICAgcmV0dXJuIHRoaXMud2l0aFN1Yih0aGlzLiNnZXRfc3Vic19pbXMoKSwgbGltaXQpO1xuICB9XG4gIC8qKlxuICAgKiBBZGQgcXVlcnkgcGFyYW1ldGVycyB0byBmZXRjaCB0b3BpYyB0YWdzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSA8Y29kZT50aGlzPC9jb2RlPiBvYmplY3QuXG4gICAqL1xuICB3aXRoVGFncygpIHtcbiAgICB0aGlzLndoYXRbJ3RhZ3MnXSA9IHRydWU7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIHVzZXIncyBjcmVkZW50aWFscy4gPGNvZGU+J21lJzwvY29kZT4gdG9waWMgb25seS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aENyZWQoKSB7XG4gICAgaWYgKHRoaXMudG9waWMuZ2V0VHlwZSgpID09ICdtZScpIHtcbiAgICAgIHRoaXMud2hhdFsnY3JlZCddID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50b3BpYy5fdGlub2RlLmxvZ2dlcihcIkVSUk9SOiBJbnZhbGlkIHRvcGljIHR5cGUgZm9yIE1ldGFHZXRCdWlsZGVyOndpdGhDcmVkc1wiLCB0aGlzLnRvcGljLmdldFR5cGUoKSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8qKlxuICAgKiBBZGQgcXVlcnkgcGFyYW1ldGVycyB0byBmZXRjaCBkZWxldGVkIG1lc3NhZ2VzIHdpdGhpbiBleHBsaWNpdCBsaW1pdHMuIEFueS9hbGwgcGFyYW1ldGVycyBjYW4gYmUgbnVsbC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXI9fSBzaW5jZSAtIGlkcyBvZiBtZXNzYWdlcyBkZWxldGVkIHNpbmNlIHRoaXMgJ2RlbCcgaWQgKGluY2x1c2l2ZSlcbiAgICogQHBhcmFtIHtudW1iZXI9fSBsaW1pdCAtIG51bWJlciBvZiBkZWxldGVkIG1lc3NhZ2UgaWRzIHRvIGZldGNoXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IDxjb2RlPnRoaXM8L2NvZGU+IG9iamVjdC5cbiAgICovXG4gIHdpdGhEZWwoc2luY2UsIGxpbWl0KSB7XG4gICAgaWYgKHNpbmNlIHx8IGxpbWl0KSB7XG4gICAgICB0aGlzLndoYXRbJ2RlbCddID0ge1xuICAgICAgICBzaW5jZTogc2luY2UsXG4gICAgICAgIGxpbWl0OiBsaW1pdFxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIG1lc3NhZ2VzIGRlbGV0ZWQgYWZ0ZXIgdGhlIHNhdmVkIDxjb2RlPidkZWwnPC9jb2RlPiBpZC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXI9fSBsaW1pdCAtIG51bWJlciBvZiBkZWxldGVkIG1lc3NhZ2UgaWRzIHRvIGZldGNoXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IDxjb2RlPnRoaXM8L2NvZGU+IG9iamVjdC5cbiAgICovXG4gIHdpdGhMYXRlckRlbChsaW1pdCkge1xuICAgIC8vIFNwZWNpZnkgJ3NpbmNlJyBvbmx5IGlmIHdlIGhhdmUgYWxyZWFkeSByZWNlaXZlZCBzb21lIG1lc3NhZ2VzLiBJZlxuICAgIC8vIHdlIGhhdmUgbm8gbG9jYWxseSBjYWNoZWQgbWVzc2FnZXMgdGhlbiB3ZSBkb24ndCBjYXJlIGlmIGFueSBtZXNzYWdlcyB3ZXJlIGRlbGV0ZWQuXG4gICAgcmV0dXJuIHRoaXMud2l0aERlbCh0aGlzLnRvcGljLl9tYXhTZXEgPiAwID8gdGhpcy50b3BpYy5fbWF4RGVsICsgMSA6IHVuZGVmaW5lZCwgbGltaXQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4dHJhY3Qgc3VicXVlcnk6IGdldCBhbiBvYmplY3QgdGhhdCBjb250YWlucyBzcGVjaWZpZWQgc3VicXVlcnkuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB3aGF0IC0gc3VicXVlcnkgdG8gcmV0dXJuOiBvbmUgb2YgJ2RhdGEnLCAnc3ViJywgJ2Rlc2MnLCAndGFncycsICdjcmVkJywgJ2RlbCcuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IHJlcXVlc3RlZCBzdWJxdWVyeSBvciA8Y29kZT51bmRlZmluZWQ8L2NvZGU+LlxuICAgKi9cbiAgZXh0cmFjdCh3aGF0KSB7XG4gICAgcmV0dXJuIHRoaXMud2hhdFt3aGF0XTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3QgcGFyYW1ldGVycy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5HZXRRdWVyeX0gR2V0IHF1ZXJ5XG4gICAqL1xuICBidWlsZCgpIHtcbiAgICBjb25zdCB3aGF0ID0gW107XG4gICAgbGV0IHBhcmFtcyA9IHt9O1xuICAgIFsnZGF0YScsICdzdWInLCAnZGVzYycsICd0YWdzJywgJ2NyZWQnLCAnZGVsJ10uZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICBpZiAodGhpcy53aGF0Lmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgd2hhdC5wdXNoKGtleSk7XG4gICAgICAgIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0aGlzLndoYXRba2V5XSkubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHBhcmFtc1trZXldID0gdGhpcy53aGF0W2tleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAod2hhdC5sZW5ndGggPiAwKSB7XG4gICAgICBwYXJhbXMud2hhdCA9IHdoYXQuam9pbignICcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJhbXMgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiBwYXJhbXM7XG4gIH1cbn1cbiIsIi8qKlxuICogQGZpbGUgU0RLIHRvIGNvbm5lY3QgdG8gVGlub2RlIGNoYXQgc2VydmVyLlxuICogU2VlIDxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vdGlub2RlL3dlYmFwcFwiPmh0dHBzOi8vZ2l0aHViLmNvbS90aW5vZGUvd2ViYXBwPC9hPiBmb3IgcmVhbC1saWZlIHVzYWdlLlxuICpcbiAqIEBjb3B5cmlnaHQgMjAxNS0yMDIyIFRpbm9kZSBMTEMuXG4gKiBAc3VtbWFyeSBKYXZhc2NyaXB0IGJpbmRpbmdzIGZvciBUaW5vZGUuXG4gKiBAbGljZW5zZSBBcGFjaGUgMi4wXG4gKiBAdmVyc2lvbiAwLjIwXG4gKlxuICogQGV4YW1wbGVcbiAqIDxoZWFkPlxuICogPHNjcmlwdCBzcmM9XCIuLi4vdGlub2RlLmpzXCI+PC9zY3JpcHQ+XG4gKiA8L2hlYWQ+XG4gKlxuICogPGJvZHk+XG4gKiAgLi4uXG4gKiA8c2NyaXB0PlxuICogIC8vIEluc3RhbnRpYXRlIHRpbm9kZS5cbiAqICBjb25zdCB0aW5vZGUgPSBuZXcgVGlub2RlKGNvbmZpZywgKCkgPT4ge1xuICogICAgLy8gQ2FsbGVkIG9uIGluaXQgY29tcGxldGlvbi5cbiAqICB9KTtcbiAqICB0aW5vZGUuZW5hYmxlTG9nZ2luZyh0cnVlKTtcbiAqICB0aW5vZGUub25EaXNjb25uZWN0ID0gKGVycikgPT4ge1xuICogICAgLy8gSGFuZGxlIGRpc2Nvbm5lY3QuXG4gKiAgfTtcbiAqICAvLyBDb25uZWN0IHRvIHRoZSBzZXJ2ZXIuXG4gKiAgdGlub2RlLmNvbm5lY3QoJ2h0dHBzOi8vZXhhbXBsZS5jb20vJykudGhlbigoKSA9PiB7XG4gKiAgICAvLyBDb25uZWN0ZWQuIExvZ2luIG5vdy5cbiAqICAgIHJldHVybiB0aW5vZGUubG9naW5CYXNpYyhsb2dpbiwgcGFzc3dvcmQpO1xuICogIH0pLnRoZW4oKGN0cmwpID0+IHtcbiAqICAgIC8vIExvZ2dlZCBpbiBmaW5lLCBhdHRhY2ggY2FsbGJhY2tzLCBzdWJzY3JpYmUgdG8gJ21lJy5cbiAqICAgIGNvbnN0IG1lID0gdGlub2RlLmdldE1lVG9waWMoKTtcbiAqICAgIG1lLm9uTWV0YURlc2MgPSBmdW5jdGlvbihtZXRhKSB7IC4uLiB9O1xuICogICAgLy8gU3Vic2NyaWJlLCBmZXRjaCB0b3BpYyBkZXNjcmlwdGlvbiBhbmQgdGhlIGxpc3Qgb2YgY29udGFjdHMuXG4gKiAgICBtZS5zdWJzY3JpYmUoe2dldDoge2Rlc2M6IHt9LCBzdWI6IHt9fX0pO1xuICogIH0pLmNhdGNoKChlcnIpID0+IHtcbiAqICAgIC8vIExvZ2luIG9yIHN1YnNjcmlwdGlvbiBmYWlsZWQsIGRvIHNvbWV0aGluZy5cbiAqICAgIC4uLlxuICogIH0pO1xuICogIC4uLlxuICogPC9zY3JpcHQ+XG4gKiA8L2JvZHk+XG4gKi9cbid1c2Ugc3RyaWN0JztcblxuLy8gTk9URSBUTyBERVZFTE9QRVJTOlxuLy8gTG9jYWxpemFibGUgc3RyaW5ncyBzaG91bGQgYmUgZG91YmxlIHF1b3RlZCBcItGB0YLRgNC+0LrQsCDQvdCwINC00YDRg9Cz0L7QvCDRj9C30YvQutC1XCIsXG4vLyBub24tbG9jYWxpemFibGUgc3RyaW5ncyBzaG91bGQgYmUgc2luZ2xlIHF1b3RlZCAnbm9uLWxvY2FsaXplZCcuXG5cbmltcG9ydCBBY2Nlc3NNb2RlIGZyb20gJy4vYWNjZXNzLW1vZGUuanMnO1xuaW1wb3J0ICogYXMgQ29uc3QgZnJvbSAnLi9jb25maWcuanMnO1xuaW1wb3J0IENvbm5lY3Rpb24gZnJvbSAnLi9jb25uZWN0aW9uLmpzJztcbmltcG9ydCBEQkNhY2hlIGZyb20gJy4vZGIuanMnO1xuaW1wb3J0IERyYWZ0eSBmcm9tICcuL2RyYWZ0eS5qcyc7XG5pbXBvcnQgTGFyZ2VGaWxlSGVscGVyIGZyb20gJy4vbGFyZ2UtZmlsZS5qcyc7XG5pbXBvcnQgTWV0YUdldEJ1aWxkZXIgZnJvbSAnLi9tZXRhLWJ1aWxkZXIuanMnO1xuaW1wb3J0IHtcbiAgVG9waWMsXG4gIFRvcGljTWUsXG4gIFRvcGljRm5kXG59IGZyb20gJy4vdG9waWMuanMnO1xuXG5pbXBvcnQge1xuICBqc29uUGFyc2VIZWxwZXIsXG4gIG1lcmdlT2JqLFxuICByZmMzMzM5RGF0ZVN0cmluZyxcbiAgc2ltcGxpZnlcbn0gZnJvbSAnLi91dGlscy5qcyc7XG5cbmxldCBXZWJTb2NrZXRQcm92aWRlcjtcbmlmICh0eXBlb2YgV2ViU29ja2V0ICE9ICd1bmRlZmluZWQnKSB7XG4gIFdlYlNvY2tldFByb3ZpZGVyID0gV2ViU29ja2V0O1xufVxuXG5sZXQgWEhSUHJvdmlkZXI7XG5pZiAodHlwZW9mIFhNTEh0dHBSZXF1ZXN0ICE9ICd1bmRlZmluZWQnKSB7XG4gIFhIUlByb3ZpZGVyID0gWE1MSHR0cFJlcXVlc3Q7XG59XG5cbmxldCBJbmRleGVkREJQcm92aWRlcjtcbmlmICh0eXBlb2YgaW5kZXhlZERCICE9ICd1bmRlZmluZWQnKSB7XG4gIEluZGV4ZWREQlByb3ZpZGVyID0gaW5kZXhlZERCO1xufVxuXG4vLyBSZS1leHBvcnQgRHJhZnR5LlxuZXhwb3J0IHtcbiAgRHJhZnR5XG59XG5cbmluaXRGb3JOb25Ccm93c2VyQXBwKCk7XG5cbi8vIFV0aWxpdHkgZnVuY3Rpb25zXG5cbi8vIFBvbHlmaWxsIGZvciBub24tYnJvd3NlciBjb250ZXh0LCBlLmcuIE5vZGVKcy5cbmZ1bmN0aW9uIGluaXRGb3JOb25Ccm93c2VyQXBwKCkge1xuICAvLyBUaW5vZGUgcmVxdWlyZW1lbnQgaW4gbmF0aXZlIG1vZGUgYmVjYXVzZSByZWFjdCBuYXRpdmUgZG9lc24ndCBwcm92aWRlIEJhc2U2NCBtZXRob2RcbiAgY29uc3QgY2hhcnMgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLz0nO1xuXG4gIGlmICh0eXBlb2YgYnRvYSA9PSAndW5kZWZpbmVkJykge1xuICAgIGdsb2JhbC5idG9hID0gZnVuY3Rpb24oaW5wdXQgPSAnJykge1xuICAgICAgbGV0IHN0ciA9IGlucHV0O1xuICAgICAgbGV0IG91dHB1dCA9ICcnO1xuXG4gICAgICBmb3IgKGxldCBibG9jayA9IDAsIGNoYXJDb2RlLCBpID0gMCwgbWFwID0gY2hhcnM7IHN0ci5jaGFyQXQoaSB8IDApIHx8IChtYXAgPSAnPScsIGkgJSAxKTsgb3V0cHV0ICs9IG1hcC5jaGFyQXQoNjMgJiBibG9jayA+PiA4IC0gaSAlIDEgKiA4KSkge1xuXG4gICAgICAgIGNoYXJDb2RlID0gc3RyLmNoYXJDb2RlQXQoaSArPSAzIC8gNCk7XG5cbiAgICAgICAgaWYgKGNoYXJDb2RlID4gMHhGRikge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIididG9hJyBmYWlsZWQ6IFRoZSBzdHJpbmcgdG8gYmUgZW5jb2RlZCBjb250YWlucyBjaGFyYWN0ZXJzIG91dHNpZGUgb2YgdGhlIExhdGluMSByYW5nZS5cIik7XG4gICAgICAgIH1cbiAgICAgICAgYmxvY2sgPSBibG9jayA8PCA4IHwgY2hhckNvZGU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgYXRvYiA9PSAndW5kZWZpbmVkJykge1xuICAgIGdsb2JhbC5hdG9iID0gZnVuY3Rpb24oaW5wdXQgPSAnJykge1xuICAgICAgbGV0IHN0ciA9IGlucHV0LnJlcGxhY2UoLz0rJC8sICcnKTtcbiAgICAgIGxldCBvdXRwdXQgPSAnJztcblxuICAgICAgaWYgKHN0ci5sZW5ndGggJSA0ID09IDEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiJ2F0b2InIGZhaWxlZDogVGhlIHN0cmluZyB0byBiZSBkZWNvZGVkIGlzIG5vdCBjb3JyZWN0bHkgZW5jb2RlZC5cIik7XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBiYyA9IDAsIGJzID0gMCwgYnVmZmVyLCBpID0gMDsgYnVmZmVyID0gc3RyLmNoYXJBdChpKyspO1xuXG4gICAgICAgIH5idWZmZXIgJiYgKGJzID0gYmMgJSA0ID8gYnMgKiA2NCArIGJ1ZmZlciA6IGJ1ZmZlcixcbiAgICAgICAgICBiYysrICUgNCkgPyBvdXRwdXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSgyNTUgJiBicyA+PiAoLTIgKiBiYyAmIDYpKSA6IDBcbiAgICAgICkge1xuICAgICAgICBidWZmZXIgPSBjaGFycy5pbmRleE9mKGJ1ZmZlcik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfTtcbiAgfVxuXG4gIGlmICh0eXBlb2Ygd2luZG93ID09ICd1bmRlZmluZWQnKSB7XG4gICAgZ2xvYmFsLndpbmRvdyA9IHtcbiAgICAgIFdlYlNvY2tldDogV2ViU29ja2V0UHJvdmlkZXIsXG4gICAgICBYTUxIdHRwUmVxdWVzdDogWEhSUHJvdmlkZXIsXG4gICAgICBpbmRleGVkREI6IEluZGV4ZWREQlByb3ZpZGVyLFxuICAgICAgVVJMOiB7XG4gICAgICAgIGNyZWF0ZU9iamVjdFVSTDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5hYmxlIHRvIHVzZSBVUkwuY3JlYXRlT2JqZWN0VVJMIGluIGEgbm9uLWJyb3dzZXIgYXBwbGljYXRpb25cIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBDb25uZWN0aW9uLnNldE5ldHdvcmtQcm92aWRlcnMoV2ViU29ja2V0UHJvdmlkZXIsIFhIUlByb3ZpZGVyKTtcbiAgTGFyZ2VGaWxlSGVscGVyLnNldE5ldHdvcmtQcm92aWRlcihYSFJQcm92aWRlcik7XG4gIERCQ2FjaGUuc2V0RGF0YWJhc2VQcm92aWRlcihJbmRleGVkREJQcm92aWRlcik7XG59XG5cbi8vIERldGVjdCBmaW5kIG1vc3QgdXNlZnVsIG5ldHdvcmsgdHJhbnNwb3J0LlxuZnVuY3Rpb24gZGV0ZWN0VHJhbnNwb3J0KCkge1xuICBpZiAodHlwZW9mIHdpbmRvdyA9PSAnb2JqZWN0Jykge1xuICAgIGlmICh3aW5kb3dbJ1dlYlNvY2tldCddKSB7XG4gICAgICByZXR1cm4gJ3dzJztcbiAgICB9IGVsc2UgaWYgKHdpbmRvd1snWE1MSHR0cFJlcXVlc3QnXSkge1xuICAgICAgLy8gVGhlIGJyb3dzZXIgb3Igbm9kZSBoYXMgbm8gd2Vic29ja2V0cywgdXNpbmcgbG9uZyBwb2xsaW5nLlxuICAgICAgcmV0dXJuICdscCc7XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vLyBidG9hIHJlcGxhY2VtZW50LiBTdG9jayBidG9hIGZhaWxzIG9uIG9uIG5vbi1MYXRpbjEgc3RyaW5ncy5cbmZ1bmN0aW9uIGI2NEVuY29kZVVuaWNvZGUoc3RyKSB7XG4gIC8vIFRoZSBlbmNvZGVVUklDb21wb25lbnQgcGVyY2VudC1lbmNvZGVzIFVURi04IHN0cmluZyxcbiAgLy8gdGhlbiB0aGUgcGVyY2VudCBlbmNvZGluZyBpcyBjb252ZXJ0ZWQgaW50byByYXcgYnl0ZXMgd2hpY2hcbiAgLy8gY2FuIGJlIGZlZCBpbnRvIGJ0b2EuXG4gIHJldHVybiBidG9hKGVuY29kZVVSSUNvbXBvbmVudChzdHIpLnJlcGxhY2UoLyUoWzAtOUEtRl17Mn0pL2csXG4gICAgZnVuY3Rpb24gdG9Tb2xpZEJ5dGVzKG1hdGNoLCBwMSkge1xuICAgICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoJzB4JyArIHAxKTtcbiAgICB9KSk7XG59XG5cbi8vIEpTT04gc3RyaW5naWZ5IGhlbHBlciAtIHByZS1wcm9jZXNzb3IgZm9yIEpTT04uc3RyaW5naWZ5XG5mdW5jdGlvbiBqc29uQnVpbGRIZWxwZXIoa2V5LCB2YWwpIHtcbiAgaWYgKHZhbCBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAvLyBDb252ZXJ0IGphdmFzY3JpcHQgRGF0ZSBvYmplY3RzIHRvIHJmYzMzMzkgc3RyaW5nc1xuICAgIHZhbCA9IHJmYzMzMzlEYXRlU3RyaW5nKHZhbCk7XG4gIH0gZWxzZSBpZiAodmFsIGluc3RhbmNlb2YgQWNjZXNzTW9kZSkge1xuICAgIHZhbCA9IHZhbC5qc29uSGVscGVyKCk7XG4gIH0gZWxzZSBpZiAodmFsID09PSB1bmRlZmluZWQgfHwgdmFsID09PSBudWxsIHx8IHZhbCA9PT0gZmFsc2UgfHxcbiAgICAoQXJyYXkuaXNBcnJheSh2YWwpICYmIHZhbC5sZW5ndGggPT0gMCkgfHxcbiAgICAoKHR5cGVvZiB2YWwgPT0gJ29iamVjdCcpICYmIChPYmplY3Qua2V5cyh2YWwpLmxlbmd0aCA9PSAwKSkpIHtcbiAgICAvLyBzdHJpcCBvdXQgZW1wdHkgZWxlbWVudHMgd2hpbGUgc2VyaWFsaXppbmcgb2JqZWN0cyB0byBKU09OXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHJldHVybiB2YWw7XG59O1xuXG4vLyBUcmltcyB2ZXJ5IGxvbmcgc3RyaW5ncyAoZW5jb2RlZCBpbWFnZXMpIHRvIG1ha2UgbG9nZ2VkIHBhY2tldHMgbW9yZSByZWFkYWJsZS5cbmZ1bmN0aW9uIGpzb25Mb2dnZXJIZWxwZXIoa2V5LCB2YWwpIHtcbiAgaWYgKHR5cGVvZiB2YWwgPT0gJ3N0cmluZycgJiYgdmFsLmxlbmd0aCA+IDEyOCkge1xuICAgIHJldHVybiAnPCcgKyB2YWwubGVuZ3RoICsgJywgYnl0ZXM6ICcgKyB2YWwuc3Vic3RyaW5nKDAsIDEyKSArICcuLi4nICsgdmFsLnN1YnN0cmluZyh2YWwubGVuZ3RoIC0gMTIpICsgJz4nO1xuICB9XG4gIHJldHVybiBqc29uQnVpbGRIZWxwZXIoa2V5LCB2YWwpO1xufTtcblxuLy8gUGFyc2UgYnJvd3NlciB1c2VyIGFnZW50IHRvIGV4dHJhY3QgYnJvd3NlciBuYW1lIGFuZCB2ZXJzaW9uLlxuZnVuY3Rpb24gZ2V0QnJvd3NlckluZm8odWEsIHByb2R1Y3QpIHtcbiAgdWEgPSB1YSB8fCAnJztcbiAgbGV0IHJlYWN0bmF0aXZlID0gJyc7XG4gIC8vIENoZWNrIGlmIHRoaXMgaXMgYSBSZWFjdE5hdGl2ZSBhcHAuXG4gIGlmICgvcmVhY3RuYXRpdmUvaS50ZXN0KHByb2R1Y3QpKSB7XG4gICAgcmVhY3RuYXRpdmUgPSAnUmVhY3ROYXRpdmU7ICc7XG4gIH1cbiAgbGV0IHJlc3VsdDtcbiAgLy8gUmVtb3ZlIHVzZWxlc3Mgc3RyaW5nLlxuICB1YSA9IHVhLnJlcGxhY2UoJyAoS0hUTUwsIGxpa2UgR2Vja28pJywgJycpO1xuICAvLyBUZXN0IGZvciBXZWJLaXQtYmFzZWQgYnJvd3Nlci5cbiAgbGV0IG0gPSB1YS5tYXRjaCgvKEFwcGxlV2ViS2l0XFwvWy5cXGRdKykvaSk7XG4gIGlmIChtKSB7XG4gICAgLy8gTGlzdCBvZiBjb21tb24gc3RyaW5ncywgZnJvbSBtb3JlIHVzZWZ1bCB0byBsZXNzIHVzZWZ1bC5cbiAgICAvLyBBbGwgdW5rbm93biBzdHJpbmdzIGdldCB0aGUgaGlnaGVzdCAoLTEpIHByaW9yaXR5LlxuICAgIGNvbnN0IHByaW9yaXR5ID0gWydlZGcnLCAnY2hyb21lJywgJ3NhZmFyaScsICdtb2JpbGUnLCAndmVyc2lvbiddO1xuICAgIGxldCB0bXAgPSB1YS5zdWJzdHIobS5pbmRleCArIG1bMF0ubGVuZ3RoKS5zcGxpdCgnICcpO1xuICAgIGxldCB0b2tlbnMgPSBbXTtcbiAgICBsZXQgdmVyc2lvbjsgLy8gMS4wIGluIFZlcnNpb24vMS4wIG9yIHVuZGVmaW5lZDtcbiAgICAvLyBTcGxpdCBzdHJpbmcgbGlrZSAnTmFtZS8wLjAuMCcgaW50byBbJ05hbWUnLCAnMC4wLjAnLCAzXSB3aGVyZSB0aGUgbGFzdCBlbGVtZW50IGlzIHRoZSBwcmlvcml0eS5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRtcC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IG0yID0gLyhbXFx3Ll0rKVtcXC9dKFtcXC5cXGRdKykvLmV4ZWModG1wW2ldKTtcbiAgICAgIGlmIChtMikge1xuICAgICAgICAvLyBVbmtub3duIHZhbHVlcyBhcmUgaGlnaGVzdCBwcmlvcml0eSAoLTEpLlxuICAgICAgICB0b2tlbnMucHVzaChbbTJbMV0sIG0yWzJdLCBwcmlvcml0eS5maW5kSW5kZXgoKGUpID0+IHtcbiAgICAgICAgICByZXR1cm4gbTJbMV0udG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoKGUpO1xuICAgICAgICB9KV0pO1xuICAgICAgICBpZiAobTJbMV0gPT0gJ1ZlcnNpb24nKSB7XG4gICAgICAgICAgdmVyc2lvbiA9IG0yWzJdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIC8vIFNvcnQgYnkgcHJpb3JpdHk6IG1vcmUgaW50ZXJlc3RpbmcgaXMgZWFybGllciB0aGFuIGxlc3MgaW50ZXJlc3RpbmcuXG4gICAgdG9rZW5zLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIHJldHVybiBhWzJdIC0gYlsyXTtcbiAgICB9KTtcbiAgICBpZiAodG9rZW5zLmxlbmd0aCA+IDApIHtcbiAgICAgIC8vIFJldHVybiB0aGUgbGVhc3QgY29tbW9uIGJyb3dzZXIgc3RyaW5nIGFuZCB2ZXJzaW9uLlxuICAgICAgaWYgKHRva2Vuc1swXVswXS50b0xvd2VyQ2FzZSgpLnN0YXJ0c1dpdGgoJ2VkZycpKSB7XG4gICAgICAgIHRva2Vuc1swXVswXSA9ICdFZGdlJztcbiAgICAgIH0gZWxzZSBpZiAodG9rZW5zWzBdWzBdID09ICdPUFInKSB7XG4gICAgICAgIHRva2Vuc1swXVswXSA9ICdPcGVyYSc7XG4gICAgICB9IGVsc2UgaWYgKHRva2Vuc1swXVswXSA9PSAnU2FmYXJpJyAmJiB2ZXJzaW9uKSB7XG4gICAgICAgIHRva2Vuc1swXVsxXSA9IHZlcnNpb247XG4gICAgICB9XG4gICAgICByZXN1bHQgPSB0b2tlbnNbMF1bMF0gKyAnLycgKyB0b2tlbnNbMF1bMV07XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEZhaWxlZCB0byBJRCB0aGUgYnJvd3Nlci4gUmV0dXJuIHRoZSB3ZWJraXQgdmVyc2lvbi5cbiAgICAgIHJlc3VsdCA9IG1bMV07XG4gICAgfVxuICB9IGVsc2UgaWYgKC9maXJlZm94L2kudGVzdCh1YSkpIHtcbiAgICBtID0gL0ZpcmVmb3hcXC8oWy5cXGRdKykvZy5leGVjKHVhKTtcbiAgICBpZiAobSkge1xuICAgICAgcmVzdWx0ID0gJ0ZpcmVmb3gvJyArIG1bMV07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdCA9ICdGaXJlZm94Lz8nO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBOZWl0aGVyIEFwcGxlV2ViS2l0IG5vciBGaXJlZm94LiBUcnkgdGhlIGxhc3QgcmVzb3J0LlxuICAgIG0gPSAvKFtcXHcuXSspXFwvKFsuXFxkXSspLy5leGVjKHVhKTtcbiAgICBpZiAobSkge1xuICAgICAgcmVzdWx0ID0gbVsxXSArICcvJyArIG1bMl07XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSB1YS5zcGxpdCgnICcpO1xuICAgICAgcmVzdWx0ID0gbVswXTtcbiAgICB9XG4gIH1cblxuICAvLyBTaG9ydGVuIHRoZSB2ZXJzaW9uIHRvIG9uZSBkb3QgJ2EuYmIuY2NjLmQgLT4gYS5iYicgYXQgbW9zdC5cbiAgbSA9IHJlc3VsdC5zcGxpdCgnLycpO1xuICBpZiAobS5sZW5ndGggPiAxKSB7XG4gICAgY29uc3QgdiA9IG1bMV0uc3BsaXQoJy4nKTtcbiAgICBjb25zdCBtaW5vciA9IHZbMV0gPyAnLicgKyB2WzFdLnN1YnN0cigwLCAyKSA6ICcnO1xuICAgIHJlc3VsdCA9IGAke21bMF19LyR7dlswXX0ke21pbm9yfWA7XG4gIH1cbiAgcmV0dXJuIHJlYWN0bmF0aXZlICsgcmVzdWx0O1xufVxuXG4vKipcbiAqIEBjbGFzcyBUaW5vZGVcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIC0gY29uZmlndXJhdGlvbiBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtzdHJpbmd9IGNvbmZpZy5hcHBOYW1lIC0gTmFtZSBvZiB0aGUgY2FsbGluZyBhcHBsaWNhdGlvbiB0byBiZSByZXBvcnRlZCBpbiB0aGUgVXNlciBBZ2VudC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBjb25maWcuaG9zdCAtIEhvc3QgbmFtZSBhbmQgb3B0aW9uYWwgcG9ydCBudW1iZXIgdG8gY29ubmVjdCB0by5cbiAqIEBwYXJhbSB7c3RyaW5nfSBjb25maWcuYXBpS2V5IC0gQVBJIGtleSBnZW5lcmF0ZWQgYnkgPGNvZGU+a2V5Z2VuPC9jb2RlPi5cbiAqIEBwYXJhbSB7c3RyaW5nfSBjb25maWcudHJhbnNwb3J0IC0gU2VlIHtAbGluayBUaW5vZGUuQ29ubmVjdGlvbiN0cmFuc3BvcnR9LlxuICogQHBhcmFtIHtib29sZWFufSBjb25maWcuc2VjdXJlIC0gVXNlIFNlY3VyZSBXZWJTb2NrZXQgaWYgPGNvZGU+dHJ1ZTwvY29kZT4uXG4gKiBAcGFyYW0ge3N0cmluZ30gY29uZmlnLnBsYXRmb3JtIC0gT3B0aW9uYWwgcGxhdGZvcm0gaWRlbnRpZmllciwgb25lIG9mIDxjb2RlPlwiaW9zXCI8L2NvZGU+LCA8Y29kZT5cIndlYlwiPC9jb2RlPiwgPGNvZGU+XCJhbmRyb2lkXCI8L2NvZGU+LlxuICogQHBhcmFtIHtib29sZW59IGNvbmZpZy5wZXJzaXN0IC0gVXNlIEluZGV4ZWREQiBwZXJzaXN0ZW50IHN0b3JhZ2UuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBvbkNvbXBsZXRlIC0gY2FsbGJhY2sgdG8gY2FsbCB3aGVuIGluaXRpYWxpemF0aW9uIGlzIGNvbXBsZXRlZC5cbiAqL1xuZXhwb3J0IGNsYXNzIFRpbm9kZSB7XG4gIF9ob3N0O1xuICBfc2VjdXJlO1xuXG4gIF9hcHBOYW1lO1xuXG4gIC8vIEFQSSBLZXkuXG4gIF9hcGlLZXk7XG5cbiAgLy8gTmFtZSBhbmQgdmVyc2lvbiBvZiB0aGUgYnJvd3Nlci5cbiAgX2Jyb3dzZXIgPSAnJztcbiAgX3BsYXRmb3JtO1xuICAvLyBIYXJkd2FyZVxuICBfaHdvcyA9ICd1bmRlZmluZWQnO1xuICBfaHVtYW5MYW5ndWFnZSA9ICd4eCc7XG5cbiAgLy8gTG9nZ2luZyB0byBjb25zb2xlIGVuYWJsZWRcbiAgX2xvZ2dpbmdFbmFibGVkID0gZmFsc2U7XG4gIC8vIFdoZW4gbG9nZ2luZywgdHJpcCBsb25nIHN0cmluZ3MgKGJhc2U2NC1lbmNvZGVkIGltYWdlcykgZm9yIHJlYWRhYmlsaXR5XG4gIF90cmltTG9uZ1N0cmluZ3MgPSBmYWxzZTtcbiAgLy8gVUlEIG9mIHRoZSBjdXJyZW50bHkgYXV0aGVudGljYXRlZCB1c2VyLlxuICBfbXlVSUQgPSBudWxsO1xuICAvLyBTdGF0dXMgb2YgY29ubmVjdGlvbjogYXV0aGVudGljYXRlZCBvciBub3QuXG4gIF9hdXRoZW50aWNhdGVkID0gZmFsc2U7XG4gIC8vIExvZ2luIHVzZWQgaW4gdGhlIGxhc3Qgc3VjY2Vzc2Z1bCBiYXNpYyBhdXRoZW50aWNhdGlvblxuICBfbG9naW4gPSBudWxsO1xuICAvLyBUb2tlbiB3aGljaCBjYW4gYmUgdXNlZCBmb3IgbG9naW4gaW5zdGVhZCBvZiBsb2dpbi9wYXNzd29yZC5cbiAgX2F1dGhUb2tlbiA9IG51bGw7XG4gIC8vIENvdW50ZXIgb2YgcmVjZWl2ZWQgcGFja2V0c1xuICBfaW5QYWNrZXRDb3VudCA9IDA7XG4gIC8vIENvdW50ZXIgZm9yIGdlbmVyYXRpbmcgdW5pcXVlIG1lc3NhZ2UgSURzXG4gIF9tZXNzYWdlSWQgPSBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogMHhGRkZGKSArIDB4RkZGRik7XG4gIC8vIEluZm9ybWF0aW9uIGFib3V0IHRoZSBzZXJ2ZXIsIGlmIGNvbm5lY3RlZFxuICBfc2VydmVySW5mbyA9IG51bGw7XG4gIC8vIFB1c2ggbm90aWZpY2F0aW9uIHRva2VuLiBDYWxsZWQgZGV2aWNlVG9rZW4gZm9yIGNvbnNpc3RlbmN5IHdpdGggdGhlIEFuZHJvaWQgU0RLLlxuICBfZGV2aWNlVG9rZW4gPSBudWxsO1xuXG4gIC8vIENhY2hlIG9mIHBlbmRpbmcgcHJvbWlzZXMgYnkgbWVzc2FnZSBpZC5cbiAgX3BlbmRpbmdQcm9taXNlcyA9IHt9O1xuICAvLyBUaGUgVGltZW91dCBvYmplY3QgcmV0dXJuZWQgYnkgdGhlIHJlamVjdCBleHBpcmVkIHByb21pc2VzIHNldEludGVydmFsLlxuICBfZXhwaXJlUHJvbWlzZXMgPSBudWxsO1xuXG4gIC8vIFdlYnNvY2tldCBvciBsb25nIHBvbGxpbmcgY29ubmVjdGlvbi5cbiAgX2Nvbm5lY3Rpb24gPSBudWxsO1xuXG4gIC8vIFVzZSBpbmRleERCIGZvciBjYWNoaW5nIHRvcGljcyBhbmQgbWVzc2FnZXMuXG4gIF9wZXJzaXN0ID0gZmFsc2U7XG4gIC8vIEluZGV4ZWREQiB3cmFwcGVyIG9iamVjdC5cbiAgX2RiID0gbnVsbDtcblxuICAvLyBUaW5vZGUncyBjYWNoZSBvZiBvYmplY3RzXG4gIF9jYWNoZSA9IHt9O1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZywgb25Db21wbGV0ZSkge1xuICAgIHRoaXMuX2hvc3QgPSBjb25maWcuaG9zdDtcbiAgICB0aGlzLl9zZWN1cmUgPSBjb25maWcuc2VjdXJlO1xuXG4gICAgLy8gQ2xpZW50LXByb3ZpZGVkIGFwcGxpY2F0aW9uIG5hbWUsIGZvcm1hdCA8TmFtZT4vPHZlcnNpb24gbnVtYmVyPlxuICAgIHRoaXMuX2FwcE5hbWUgPSBjb25maWcuYXBwTmFtZSB8fCBcIlVuZGVmaW5lZFwiO1xuXG4gICAgLy8gQVBJIEtleS5cbiAgICB0aGlzLl9hcGlLZXkgPSBjb25maWcuYXBpS2V5O1xuXG4gICAgLy8gTmFtZSBhbmQgdmVyc2lvbiBvZiB0aGUgYnJvd3Nlci5cbiAgICB0aGlzLl9wbGF0Zm9ybSA9IGNvbmZpZy5wbGF0Zm9ybSB8fCAnd2ViJztcbiAgICAvLyBVbmRlcmx5aW5nIE9TLlxuICAgIGlmICh0eXBlb2YgbmF2aWdhdG9yICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aGlzLl9icm93c2VyID0gZ2V0QnJvd3NlckluZm8obmF2aWdhdG9yLnVzZXJBZ2VudCwgbmF2aWdhdG9yLnByb2R1Y3QpO1xuICAgICAgdGhpcy5faHdvcyA9IG5hdmlnYXRvci5wbGF0Zm9ybTtcbiAgICAgIC8vIFRoaXMgaXMgdGhlIGRlZmF1bHQgbGFuZ3VhZ2UuIEl0IGNvdWxkIGJlIGNoYW5nZWQgYnkgY2xpZW50LlxuICAgICAgdGhpcy5faHVtYW5MYW5ndWFnZSA9IG5hdmlnYXRvci5sYW5ndWFnZSB8fCAnZW4tVVMnO1xuICAgIH1cblxuICAgIENvbm5lY3Rpb24ubG9nZ2VyID0gdGhpcy5sb2dnZXI7XG4gICAgRHJhZnR5LmxvZ2dlciA9IHRoaXMubG9nZ2VyO1xuXG4gICAgLy8gV2ViU29ja2V0IG9yIGxvbmcgcG9sbGluZyBuZXR3b3JrIGNvbm5lY3Rpb24uXG4gICAgaWYgKGNvbmZpZy50cmFuc3BvcnQgIT0gJ2xwJyAmJiBjb25maWcudHJhbnNwb3J0ICE9ICd3cycpIHtcbiAgICAgIGNvbmZpZy50cmFuc3BvcnQgPSBkZXRlY3RUcmFuc3BvcnQoKTtcbiAgICB9XG4gICAgdGhpcy5fY29ubmVjdGlvbiA9IG5ldyBDb25uZWN0aW9uKGNvbmZpZywgQ29uc3QuUFJPVE9DT0xfVkVSU0lPTiwgLyogYXV0b3JlY29ubmVjdCAqLyB0cnVlKTtcbiAgICB0aGlzLl9jb25uZWN0aW9uLm9uTWVzc2FnZSA9IChkYXRhKSA9PiB7XG4gICAgICAvLyBDYWxsIHRoZSBtYWluIG1lc3NhZ2UgZGlzcGF0Y2hlci5cbiAgICAgIHRoaXMuI2Rpc3BhdGNoTWVzc2FnZShkYXRhKTtcbiAgICB9XG4gICAgdGhpcy5fY29ubmVjdGlvbi5vbk9wZW4gPSAoKSA9PiB7XG4gICAgICAvLyBSZWFkeSB0byBzdGFydCBzZW5kaW5nLlxuICAgICAgdGhpcy4jY29ubmVjdGlvbk9wZW4oKTtcbiAgICB9XG4gICAgdGhpcy5fY29ubmVjdGlvbi5vbkRpc2Nvbm5lY3QgPSAoZXJyLCBjb2RlKSA9PiB7XG4gICAgICB0aGlzLiNkaXNjb25uZWN0ZWQoZXJyLCBjb2RlKTtcbiAgICB9XG4gICAgLy8gV3JhcHBlciBmb3IgdGhlIHJlY29ubmVjdCBpdGVyYXRvciBjYWxsYmFjay5cbiAgICB0aGlzLl9jb25uZWN0aW9uLm9uQXV0b3JlY29ubmVjdEl0ZXJhdGlvbiA9ICh0aW1lb3V0LCBwcm9taXNlKSA9PiB7XG4gICAgICBpZiAodGhpcy5vbkF1dG9yZWNvbm5lY3RJdGVyYXRpb24pIHtcbiAgICAgICAgdGhpcy5vbkF1dG9yZWNvbm5lY3RJdGVyYXRpb24odGltZW91dCwgcHJvbWlzZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fcGVyc2lzdCA9IGNvbmZpZy5wZXJzaXN0O1xuICAgIC8vIEluaXRpYWxpemUgb2JqZWN0IHJlZ2FyZGxlc3MuIEl0IHNpbXBsaWZpZXMgdGhlIGNvZGUuXG4gICAgdGhpcy5fZGIgPSBuZXcgREJDYWNoZShlcnIgPT4ge1xuICAgICAgdGhpcy5sb2dnZXIoJ0RCJywgZXJyKTtcbiAgICB9LCB0aGlzLmxvZ2dlcik7XG5cbiAgICBpZiAodGhpcy5fcGVyc2lzdCkge1xuICAgICAgLy8gQ3JlYXRlIHRoZSBwZXJzaXN0ZW50IGNhY2hlLlxuICAgICAgLy8gU3RvcmUgcHJvbWlzZXMgdG8gYmUgcmVzb2x2ZWQgd2hlbiBtZXNzYWdlcyBsb2FkIGludG8gbWVtb3J5LlxuICAgICAgY29uc3QgcHJvbSA9IFtdO1xuICAgICAgdGhpcy5fZGIuaW5pdERhdGFiYXNlKCkudGhlbihfID0+IHtcbiAgICAgICAgLy8gRmlyc3QgbG9hZCB0b3BpY3MgaW50byBtZW1vcnkuXG4gICAgICAgIHJldHVybiB0aGlzLl9kYi5tYXBUb3BpY3MoKGRhdGEpID0+IHtcbiAgICAgICAgICBsZXQgdG9waWMgPSB0aGlzLiNjYWNoZUdldCgndG9waWMnLCBkYXRhLm5hbWUpO1xuICAgICAgICAgIGlmICh0b3BpYykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZGF0YS5uYW1lID09IENvbnN0LlRPUElDX01FKSB7XG4gICAgICAgICAgICB0b3BpYyA9IG5ldyBUb3BpY01lKCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChkYXRhLm5hbWUgPT0gQ29uc3QuVE9QSUNfRk5EKSB7XG4gICAgICAgICAgICB0b3BpYyA9IG5ldyBUb3BpY0ZuZCgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0b3BpYyA9IG5ldyBUb3BpYyhkYXRhLm5hbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLl9kYi5kZXNlcmlhbGl6ZVRvcGljKHRvcGljLCBkYXRhKTtcbiAgICAgICAgICB0aGlzLiNhdHRhY2hDYWNoZVRvVG9waWModG9waWMpO1xuICAgICAgICAgIHRvcGljLl9jYWNoZVB1dFNlbGYoKTtcbiAgICAgICAgICAvLyBUb3BpYyBsb2FkZWQgZnJvbSBEQiBpcyBub3QgbmV3LlxuICAgICAgICAgIGRlbGV0ZSB0b3BpYy5fbmV3O1xuICAgICAgICAgIC8vIFJlcXVlc3QgdG8gbG9hZCBtZXNzYWdlcyBhbmQgc2F2ZSB0aGUgcHJvbWlzZS5cbiAgICAgICAgICBwcm9tLnB1c2godG9waWMuX2xvYWRNZXNzYWdlcyh0aGlzLl9kYikpO1xuICAgICAgICB9KTtcbiAgICAgIH0pLnRoZW4oXyA9PiB7XG4gICAgICAgIC8vIFRoZW4gbG9hZCB1c2Vycy5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2RiLm1hcFVzZXJzKChkYXRhKSA9PiB7XG4gICAgICAgICAgdGhpcy4jY2FjaGVQdXQoJ3VzZXInLCBkYXRhLnVpZCwgbWVyZ2VPYmooe30sIGRhdGEucHVibGljKSk7XG4gICAgICAgIH0pO1xuICAgICAgfSkudGhlbihfID0+IHtcbiAgICAgICAgLy8gTm93IHdhaXQgZm9yIGFsbCBtZXNzYWdlcyB0byBmaW5pc2ggbG9hZGluZy5cbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHByb20pO1xuICAgICAgfSkudGhlbihfID0+IHtcbiAgICAgICAgaWYgKG9uQ29tcGxldGUpIHtcbiAgICAgICAgICBvbkNvbXBsZXRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sb2dnZXIoXCJQZXJzaXN0ZW50IGNhY2hlIGluaXRpYWxpemVkLlwiKTtcbiAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgaWYgKG9uQ29tcGxldGUpIHtcbiAgICAgICAgICBvbkNvbXBsZXRlKGVycik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sb2dnZXIoXCJGYWlsZWQgdG8gaW5pdGlhbGl6ZSBwZXJzaXN0ZW50IGNhY2hlOlwiLCBlcnIpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2RiLmRlbGV0ZURhdGFiYXNlKCkudGhlbihfID0+IHtcbiAgICAgICAgaWYgKG9uQ29tcGxldGUpIHtcbiAgICAgICAgICBvbkNvbXBsZXRlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIFByaXZhdGUgbWV0aG9kcy5cblxuICAvLyBDb25zb2xlIGxvZ2dlci4gQmFiZWwgc29tZWhvdyBmYWlscyB0byBwYXJzZSAnLi4ucmVzdCcgcGFyYW1ldGVyLlxuICBsb2dnZXIoc3RyLCAuLi5hcmdzKSB7XG4gICAgaWYgKHRoaXMuX2xvZ2dpbmdFbmFibGVkKSB7XG4gICAgICBjb25zdCBkID0gbmV3IERhdGUoKTtcbiAgICAgIGNvbnN0IGRhdGVTdHJpbmcgPSAoJzAnICsgZC5nZXRVVENIb3VycygpKS5zbGljZSgtMikgKyAnOicgK1xuICAgICAgICAoJzAnICsgZC5nZXRVVENNaW51dGVzKCkpLnNsaWNlKC0yKSArICc6JyArXG4gICAgICAgICgnMCcgKyBkLmdldFVUQ1NlY29uZHMoKSkuc2xpY2UoLTIpICsgJy4nICtcbiAgICAgICAgKCcwMCcgKyBkLmdldFVUQ01pbGxpc2Vjb25kcygpKS5zbGljZSgtMyk7XG5cbiAgICAgIGNvbnNvbGUubG9nKCdbJyArIGRhdGVTdHJpbmcgKyAnXScsIHN0ciwgYXJncy5qb2luKCcgJykpO1xuICAgIH1cbiAgfVxuXG4gIC8vIEdlbmVyYXRvciBvZiBkZWZhdWx0IHByb21pc2VzIGZvciBzZW50IHBhY2tldHMuXG4gICNtYWtlUHJvbWlzZShpZCkge1xuICAgIGxldCBwcm9taXNlID0gbnVsbDtcbiAgICBpZiAoaWQpIHtcbiAgICAgIHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIC8vIFN0b3JlZCBjYWxsYmFja3Mgd2lsbCBiZSBjYWxsZWQgd2hlbiB0aGUgcmVzcG9uc2UgcGFja2V0IHdpdGggdGhpcyBJZCBhcnJpdmVzXG4gICAgICAgIHRoaXMuX3BlbmRpbmdQcm9taXNlc1tpZF0gPSB7XG4gICAgICAgICAgJ3Jlc29sdmUnOiByZXNvbHZlLFxuICAgICAgICAgICdyZWplY3QnOiByZWplY3QsXG4gICAgICAgICAgJ3RzJzogbmV3IERhdGUoKVxuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBwcm9taXNlO1xuICB9O1xuXG4gIC8vIFJlc29sdmUgb3IgcmVqZWN0IGEgcGVuZGluZyBwcm9taXNlLlxuICAvLyBVbnJlc29sdmVkIHByb21pc2VzIGFyZSBzdG9yZWQgaW4gX3BlbmRpbmdQcm9taXNlcy5cbiAgI2V4ZWNQcm9taXNlKGlkLCBjb2RlLCBvbk9LLCBlcnJvclRleHQpIHtcbiAgICBjb25zdCBjYWxsYmFja3MgPSB0aGlzLl9wZW5kaW5nUHJvbWlzZXNbaWRdO1xuICAgIGlmIChjYWxsYmFja3MpIHtcbiAgICAgIGRlbGV0ZSB0aGlzLl9wZW5kaW5nUHJvbWlzZXNbaWRdO1xuICAgICAgaWYgKGNvZGUgPj0gMjAwICYmIGNvZGUgPCA0MDApIHtcbiAgICAgICAgaWYgKGNhbGxiYWNrcy5yZXNvbHZlKSB7XG4gICAgICAgICAgY2FsbGJhY2tzLnJlc29sdmUob25PSyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoY2FsbGJhY2tzLnJlamVjdCkge1xuICAgICAgICBjYWxsYmFja3MucmVqZWN0KG5ldyBFcnJvcihgJHtlcnJvclRleHR9ICgke2NvZGV9KWApKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBTZW5kIGEgcGFja2V0LiBJZiBwYWNrZXQgaWQgaXMgcHJvdmlkZWQgcmV0dXJuIGEgcHJvbWlzZS5cbiAgI3NlbmQocGt0LCBpZCkge1xuICAgIGxldCBwcm9taXNlO1xuICAgIGlmIChpZCkge1xuICAgICAgcHJvbWlzZSA9IHRoaXMuI21ha2VQcm9taXNlKGlkKTtcbiAgICB9XG4gICAgcGt0ID0gc2ltcGxpZnkocGt0KTtcbiAgICBsZXQgbXNnID0gSlNPTi5zdHJpbmdpZnkocGt0KTtcbiAgICB0aGlzLmxvZ2dlcihcIm91dDogXCIgKyAodGhpcy5fdHJpbUxvbmdTdHJpbmdzID8gSlNPTi5zdHJpbmdpZnkocGt0LCBqc29uTG9nZ2VySGVscGVyKSA6IG1zZykpO1xuICAgIHRyeSB7XG4gICAgICB0aGlzLl9jb25uZWN0aW9uLnNlbmRUZXh0KG1zZyk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAvLyBJZiBzZW5kVGV4dCB0aHJvd3MsIHdyYXAgdGhlIGVycm9yIGluIGEgcHJvbWlzZSBvciByZXRocm93LlxuICAgICAgaWYgKGlkKSB7XG4gICAgICAgIHRoaXMuI2V4ZWNQcm9taXNlKGlkLCBDb25uZWN0aW9uLk5FVFdPUktfRVJST1IsIG51bGwsIGVyci5tZXNzYWdlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICAvLyBUaGUgbWFpbiBtZXNzYWdlIGRpc3BhdGNoZXIuXG4gICNkaXNwYXRjaE1lc3NhZ2UoZGF0YSkge1xuICAgIC8vIFNraXAgZW1wdHkgcmVzcG9uc2UuIFRoaXMgaGFwcGVucyB3aGVuIExQIHRpbWVzIG91dC5cbiAgICBpZiAoIWRhdGEpXG4gICAgICByZXR1cm47XG5cbiAgICB0aGlzLl9pblBhY2tldENvdW50Kys7XG5cbiAgICAvLyBTZW5kIHJhdyBtZXNzYWdlIHRvIGxpc3RlbmVyXG4gICAgaWYgKHRoaXMub25SYXdNZXNzYWdlKSB7XG4gICAgICB0aGlzLm9uUmF3TWVzc2FnZShkYXRhKTtcbiAgICB9XG5cbiAgICBpZiAoZGF0YSA9PT0gJzAnKSB7XG4gICAgICAvLyBTZXJ2ZXIgcmVzcG9uc2UgdG8gYSBuZXR3b3JrIHByb2JlLlxuICAgICAgaWYgKHRoaXMub25OZXR3b3JrUHJvYmUpIHtcbiAgICAgICAgdGhpcy5vbk5ldHdvcmtQcm9iZSgpO1xuICAgICAgfVxuICAgICAgLy8gTm8gcHJvY2Vzc2luZyBpcyBuZWNlc3NhcnkuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHBrdCA9IEpTT04ucGFyc2UoZGF0YSwganNvblBhcnNlSGVscGVyKTtcbiAgICBpZiAoIXBrdCkge1xuICAgICAgdGhpcy5sb2dnZXIoXCJpbjogXCIgKyBkYXRhKTtcbiAgICAgIHRoaXMubG9nZ2VyKFwiRVJST1I6IGZhaWxlZCB0byBwYXJzZSBkYXRhXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxvZ2dlcihcImluOiBcIiArICh0aGlzLl90cmltTG9uZ1N0cmluZ3MgPyBKU09OLnN0cmluZ2lmeShwa3QsIGpzb25Mb2dnZXJIZWxwZXIpIDogZGF0YSkpO1xuXG4gICAgICAvLyBTZW5kIGNvbXBsZXRlIHBhY2tldCB0byBsaXN0ZW5lclxuICAgICAgaWYgKHRoaXMub25NZXNzYWdlKSB7XG4gICAgICAgIHRoaXMub25NZXNzYWdlKHBrdCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChwa3QuY3RybCkge1xuICAgICAgICAvLyBIYW5kbGluZyB7Y3RybH0gbWVzc2FnZVxuICAgICAgICBpZiAodGhpcy5vbkN0cmxNZXNzYWdlKSB7XG4gICAgICAgICAgdGhpcy5vbkN0cmxNZXNzYWdlKHBrdC5jdHJsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlc29sdmUgb3IgcmVqZWN0IGEgcGVuZGluZyBwcm9taXNlLCBpZiBhbnlcbiAgICAgICAgaWYgKHBrdC5jdHJsLmlkKSB7XG4gICAgICAgICAgdGhpcy4jZXhlY1Byb21pc2UocGt0LmN0cmwuaWQsIHBrdC5jdHJsLmNvZGUsIHBrdC5jdHJsLCBwa3QuY3RybC50ZXh0KTtcbiAgICAgICAgfVxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBpZiAocGt0LmN0cmwuY29kZSA9PSAyMDUgJiYgcGt0LmN0cmwudGV4dCA9PSAnZXZpY3RlZCcpIHtcbiAgICAgICAgICAgIC8vIFVzZXIgZXZpY3RlZCBmcm9tIHRvcGljLlxuICAgICAgICAgICAgY29uc3QgdG9waWMgPSB0aGlzLiNjYWNoZUdldCgndG9waWMnLCBwa3QuY3RybC50b3BpYyk7XG4gICAgICAgICAgICBpZiAodG9waWMpIHtcbiAgICAgICAgICAgICAgdG9waWMuX3Jlc2V0U3ViKCk7XG4gICAgICAgICAgICAgIGlmIChwa3QuY3RybC5wYXJhbXMgJiYgcGt0LmN0cmwucGFyYW1zLnVuc3ViKSB7XG4gICAgICAgICAgICAgICAgdG9waWMuX2dvbmUoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAocGt0LmN0cmwuY29kZSA8IDMwMCAmJiBwa3QuY3RybC5wYXJhbXMpIHtcbiAgICAgICAgICAgIGlmIChwa3QuY3RybC5wYXJhbXMud2hhdCA9PSAnZGF0YScpIHtcbiAgICAgICAgICAgICAgLy8gY29kZT0yMDgsIGFsbCBtZXNzYWdlcyByZWNlaXZlZDogXCJwYXJhbXNcIjp7XCJjb3VudFwiOjExLFwid2hhdFwiOlwiZGF0YVwifSxcbiAgICAgICAgICAgICAgY29uc3QgdG9waWMgPSB0aGlzLiNjYWNoZUdldCgndG9waWMnLCBwa3QuY3RybC50b3BpYyk7XG4gICAgICAgICAgICAgIGlmICh0b3BpYykge1xuICAgICAgICAgICAgICAgIHRvcGljLl9hbGxNZXNzYWdlc1JlY2VpdmVkKHBrdC5jdHJsLnBhcmFtcy5jb3VudCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAocGt0LmN0cmwucGFyYW1zLndoYXQgPT0gJ3N1YicpIHtcbiAgICAgICAgICAgICAgLy8gY29kZT0yMDQsIHRoZSB0b3BpYyBoYXMgbm8gKHJlZnJlc2hlZCkgc3Vic2NyaXB0aW9ucy5cbiAgICAgICAgICAgICAgY29uc3QgdG9waWMgPSB0aGlzLiNjYWNoZUdldCgndG9waWMnLCBwa3QuY3RybC50b3BpYyk7XG4gICAgICAgICAgICAgIGlmICh0b3BpYykge1xuICAgICAgICAgICAgICAgIC8vIFRyaWdnZXIgdG9waWMub25TdWJzVXBkYXRlZC5cbiAgICAgICAgICAgICAgICB0b3BpYy5fcHJvY2Vzc01ldGFTdWIoW10pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LCAwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGlmIChwa3QubWV0YSkge1xuICAgICAgICAgICAgLy8gSGFuZGxpbmcgYSB7bWV0YX0gbWVzc2FnZS5cbiAgICAgICAgICAgIC8vIFByZWZlcnJlZCBBUEk6IFJvdXRlIG1ldGEgdG8gdG9waWMsIGlmIG9uZSBpcyByZWdpc3RlcmVkXG4gICAgICAgICAgICBjb25zdCB0b3BpYyA9IHRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIHBrdC5tZXRhLnRvcGljKTtcbiAgICAgICAgICAgIGlmICh0b3BpYykge1xuICAgICAgICAgICAgICB0b3BpYy5fcm91dGVNZXRhKHBrdC5tZXRhKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHBrdC5tZXRhLmlkKSB7XG4gICAgICAgICAgICAgIHRoaXMuI2V4ZWNQcm9taXNlKHBrdC5tZXRhLmlkLCAyMDAsIHBrdC5tZXRhLCAnTUVUQScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBTZWNvbmRhcnkgQVBJOiBjYWxsYmFja1xuICAgICAgICAgICAgaWYgKHRoaXMub25NZXRhTWVzc2FnZSkge1xuICAgICAgICAgICAgICB0aGlzLm9uTWV0YU1lc3NhZ2UocGt0Lm1ldGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAocGt0LmRhdGEpIHtcbiAgICAgICAgICAgIC8vIEhhbmRsaW5nIHtkYXRhfSBtZXNzYWdlXG4gICAgICAgICAgICAvLyBQcmVmZXJyZWQgQVBJOiBSb3V0ZSBkYXRhIHRvIHRvcGljLCBpZiBvbmUgaXMgcmVnaXN0ZXJlZFxuICAgICAgICAgICAgY29uc3QgdG9waWMgPSB0aGlzLiNjYWNoZUdldCgndG9waWMnLCBwa3QuZGF0YS50b3BpYyk7XG4gICAgICAgICAgICBpZiAodG9waWMpIHtcbiAgICAgICAgICAgICAgdG9waWMuX3JvdXRlRGF0YShwa3QuZGF0YSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFNlY29uZGFyeSBBUEk6IENhbGwgY2FsbGJhY2tcbiAgICAgICAgICAgIGlmICh0aGlzLm9uRGF0YU1lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgdGhpcy5vbkRhdGFNZXNzYWdlKHBrdC5kYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKHBrdC5wcmVzKSB7XG4gICAgICAgICAgICAvLyBIYW5kbGluZyB7cHJlc30gbWVzc2FnZVxuICAgICAgICAgICAgLy8gUHJlZmVycmVkIEFQSTogUm91dGUgcHJlc2VuY2UgdG8gdG9waWMsIGlmIG9uZSBpcyByZWdpc3RlcmVkXG4gICAgICAgICAgICBjb25zdCB0b3BpYyA9IHRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIHBrdC5wcmVzLnRvcGljKTtcbiAgICAgICAgICAgIGlmICh0b3BpYykge1xuICAgICAgICAgICAgICB0b3BpYy5fcm91dGVQcmVzKHBrdC5wcmVzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gU2Vjb25kYXJ5IEFQSSAtIGNhbGxiYWNrXG4gICAgICAgICAgICBpZiAodGhpcy5vblByZXNNZXNzYWdlKSB7XG4gICAgICAgICAgICAgIHRoaXMub25QcmVzTWVzc2FnZShwa3QucHJlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChwa3QuaW5mbykge1xuICAgICAgICAgICAgLy8ge2luZm99IG1lc3NhZ2UgLSByZWFkL3JlY2VpdmVkIG5vdGlmaWNhdGlvbnMgYW5kIGtleSBwcmVzc2VzXG4gICAgICAgICAgICAvLyBQcmVmZXJyZWQgQVBJOiBSb3V0ZSB7aW5mb319IHRvIHRvcGljLCBpZiBvbmUgaXMgcmVnaXN0ZXJlZFxuICAgICAgICAgICAgY29uc3QgdG9waWMgPSB0aGlzLiNjYWNoZUdldCgndG9waWMnLCBwa3QuaW5mby50b3BpYyk7XG4gICAgICAgICAgICBpZiAodG9waWMpIHtcbiAgICAgICAgICAgICAgdG9waWMuX3JvdXRlSW5mbyhwa3QuaW5mbyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFNlY29uZGFyeSBBUEkgLSBjYWxsYmFja1xuICAgICAgICAgICAgaWYgKHRoaXMub25JbmZvTWVzc2FnZSkge1xuICAgICAgICAgICAgICB0aGlzLm9uSW5mb01lc3NhZ2UocGt0LmluZm8pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlcihcIkVSUk9SOiBVbmtub3duIHBhY2tldCByZWNlaXZlZC5cIik7XG4gICAgICAgICAgfVxuICAgICAgICB9LCAwKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBDb25uZWN0aW9uIG9wZW4sIHJlYWR5IHRvIHN0YXJ0IHNlbmRpbmcuXG4gICNjb25uZWN0aW9uT3BlbigpIHtcbiAgICBpZiAoIXRoaXMuX2V4cGlyZVByb21pc2VzKSB7XG4gICAgICAvLyBSZWplY3QgcHJvbWlzZXMgd2hpY2ggaGF2ZSBub3QgYmVlbiByZXNvbHZlZCBmb3IgdG9vIGxvbmcuXG4gICAgICB0aGlzLl9leHBpcmVQcm9taXNlcyA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgY29uc3QgZXJyID0gbmV3IEVycm9yKFwiVGltZW91dCAoNTA0KVwiKTtcbiAgICAgICAgY29uc3QgZXhwaXJlcyA9IG5ldyBEYXRlKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gQ29uc3QuRVhQSVJFX1BST01JU0VTX1RJTUVPVVQpO1xuICAgICAgICBmb3IgKGxldCBpZCBpbiB0aGlzLl9wZW5kaW5nUHJvbWlzZXMpIHtcbiAgICAgICAgICBsZXQgY2FsbGJhY2tzID0gdGhpcy5fcGVuZGluZ1Byb21pc2VzW2lkXTtcbiAgICAgICAgICBpZiAoY2FsbGJhY2tzICYmIGNhbGxiYWNrcy50cyA8IGV4cGlyZXMpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyKFwiUHJvbWlzZSBleHBpcmVkXCIsIGlkKTtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9wZW5kaW5nUHJvbWlzZXNbaWRdO1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrcy5yZWplY3QpIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2tzLnJlamVjdChlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwgQ29uc3QuRVhQSVJFX1BST01JU0VTX1BFUklPRCk7XG4gICAgfVxuICAgIHRoaXMuaGVsbG8oKTtcbiAgfVxuXG4gICNkaXNjb25uZWN0ZWQoZXJyLCBjb2RlKSB7XG4gICAgdGhpcy5faW5QYWNrZXRDb3VudCA9IDA7XG4gICAgdGhpcy5fc2VydmVySW5mbyA9IG51bGw7XG4gICAgdGhpcy5fYXV0aGVudGljYXRlZCA9IGZhbHNlO1xuXG4gICAgaWYgKHRoaXMuX2V4cGlyZVByb21pc2VzKSB7XG4gICAgICBjbGVhckludGVydmFsKHRoaXMuX2V4cGlyZVByb21pc2VzKTtcbiAgICAgIHRoaXMuX2V4cGlyZVByb21pc2VzID0gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBNYXJrIGFsbCB0b3BpY3MgYXMgdW5zdWJzY3JpYmVkXG4gICAgdGhpcy4jY2FjaGVNYXAoJ3RvcGljJywgKHRvcGljLCBrZXkpID0+IHtcbiAgICAgIHRvcGljLl9yZXNldFN1YigpO1xuICAgIH0pO1xuXG4gICAgLy8gUmVqZWN0IGFsbCBwZW5kaW5nIHByb21pc2VzXG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMuX3BlbmRpbmdQcm9taXNlcykge1xuICAgICAgY29uc3QgY2FsbGJhY2tzID0gdGhpcy5fcGVuZGluZ1Byb21pc2VzW2tleV07XG4gICAgICBpZiAoY2FsbGJhY2tzICYmIGNhbGxiYWNrcy5yZWplY3QpIHtcbiAgICAgICAgY2FsbGJhY2tzLnJlamVjdChlcnIpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLl9wZW5kaW5nUHJvbWlzZXMgPSB7fTtcblxuICAgIGlmICh0aGlzLm9uRGlzY29ubmVjdCkge1xuICAgICAgdGhpcy5vbkRpc2Nvbm5lY3QoZXJyKTtcbiAgICB9XG4gIH1cblxuICAvLyBHZXQgVXNlciBBZ2VudCBzdHJpbmdcbiAgI2dldFVzZXJBZ2VudCgpIHtcbiAgICByZXR1cm4gdGhpcy5fYXBwTmFtZSArICcgKCcgKyAodGhpcy5fYnJvd3NlciA/IHRoaXMuX2Jyb3dzZXIgKyAnOyAnIDogJycpICsgdGhpcy5faHdvcyArICcpOyAnICsgQ29uc3QuTElCUkFSWTtcbiAgfVxuXG4gIC8vIEdlbmVyYXRvciBvZiBwYWNrZXRzIHN0dWJzXG4gICNpbml0UGFja2V0KHR5cGUsIHRvcGljKSB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlICdoaSc6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ2hpJzoge1xuICAgICAgICAgICAgJ2lkJzogdGhpcy5nZXROZXh0VW5pcXVlSWQoKSxcbiAgICAgICAgICAgICd2ZXInOiBDb25zdC5WRVJTSU9OLFxuICAgICAgICAgICAgJ3VhJzogdGhpcy4jZ2V0VXNlckFnZW50KCksXG4gICAgICAgICAgICAnZGV2JzogdGhpcy5fZGV2aWNlVG9rZW4sXG4gICAgICAgICAgICAnbGFuZyc6IHRoaXMuX2h1bWFuTGFuZ3VhZ2UsXG4gICAgICAgICAgICAncGxhdGYnOiB0aGlzLl9wbGF0Zm9ybVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgY2FzZSAnYWNjJzpcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAnYWNjJzoge1xuICAgICAgICAgICAgJ2lkJzogdGhpcy5nZXROZXh0VW5pcXVlSWQoKSxcbiAgICAgICAgICAgICd1c2VyJzogbnVsbCxcbiAgICAgICAgICAgICdzY2hlbWUnOiBudWxsLFxuICAgICAgICAgICAgJ3NlY3JldCc6IG51bGwsXG4gICAgICAgICAgICAnbG9naW4nOiBmYWxzZSxcbiAgICAgICAgICAgICd0YWdzJzogbnVsbCxcbiAgICAgICAgICAgICdkZXNjJzoge30sXG4gICAgICAgICAgICAnY3JlZCc6IHt9XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICBjYXNlICdsb2dpbic6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ2xvZ2luJzoge1xuICAgICAgICAgICAgJ2lkJzogdGhpcy5nZXROZXh0VW5pcXVlSWQoKSxcbiAgICAgICAgICAgICdzY2hlbWUnOiBudWxsLFxuICAgICAgICAgICAgJ3NlY3JldCc6IG51bGxcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgIGNhc2UgJ3N1Yic6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ3N1Yic6IHtcbiAgICAgICAgICAgICdpZCc6IHRoaXMuZ2V0TmV4dFVuaXF1ZUlkKCksXG4gICAgICAgICAgICAndG9waWMnOiB0b3BpYyxcbiAgICAgICAgICAgICdzZXQnOiB7fSxcbiAgICAgICAgICAgICdnZXQnOiB7fVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgY2FzZSAnbGVhdmUnOlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICdsZWF2ZSc6IHtcbiAgICAgICAgICAgICdpZCc6IHRoaXMuZ2V0TmV4dFVuaXF1ZUlkKCksXG4gICAgICAgICAgICAndG9waWMnOiB0b3BpYyxcbiAgICAgICAgICAgICd1bnN1Yic6IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICBjYXNlICdwdWInOlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICdwdWInOiB7XG4gICAgICAgICAgICAnaWQnOiB0aGlzLmdldE5leHRVbmlxdWVJZCgpLFxuICAgICAgICAgICAgJ3RvcGljJzogdG9waWMsXG4gICAgICAgICAgICAnbm9lY2hvJzogZmFsc2UsXG4gICAgICAgICAgICAnaGVhZCc6IG51bGwsXG4gICAgICAgICAgICAnY29udGVudCc6IHt9XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICBjYXNlICdnZXQnOlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICdnZXQnOiB7XG4gICAgICAgICAgICAnaWQnOiB0aGlzLmdldE5leHRVbmlxdWVJZCgpLFxuICAgICAgICAgICAgJ3RvcGljJzogdG9waWMsXG4gICAgICAgICAgICAnd2hhdCc6IG51bGwsXG4gICAgICAgICAgICAnZGVzYyc6IHt9LFxuICAgICAgICAgICAgJ3N1Yic6IHt9LFxuICAgICAgICAgICAgJ2RhdGEnOiB7fVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgY2FzZSAnc2V0JzpcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAnc2V0Jzoge1xuICAgICAgICAgICAgJ2lkJzogdGhpcy5nZXROZXh0VW5pcXVlSWQoKSxcbiAgICAgICAgICAgICd0b3BpYyc6IHRvcGljLFxuICAgICAgICAgICAgJ2Rlc2MnOiB7fSxcbiAgICAgICAgICAgICdzdWInOiB7fSxcbiAgICAgICAgICAgICd0YWdzJzogW10sXG4gICAgICAgICAgICAnZXBoZW1lcmFsJzoge31cbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgIGNhc2UgJ2RlbCc6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ2RlbCc6IHtcbiAgICAgICAgICAgICdpZCc6IHRoaXMuZ2V0TmV4dFVuaXF1ZUlkKCksXG4gICAgICAgICAgICAndG9waWMnOiB0b3BpYyxcbiAgICAgICAgICAgICd3aGF0JzogbnVsbCxcbiAgICAgICAgICAgICdkZWxzZXEnOiBudWxsLFxuICAgICAgICAgICAgJ3VzZXInOiBudWxsLFxuICAgICAgICAgICAgJ2hhcmQnOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgY2FzZSAnbm90ZSc6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ25vdGUnOiB7XG4gICAgICAgICAgICAvLyBubyBpZCBieSBkZXNpZ24gKGV4Y2VwdCBjYWxscykuXG4gICAgICAgICAgICAndG9waWMnOiB0b3BpYyxcbiAgICAgICAgICAgICd3aGF0JzogbnVsbCwgLy8gb25lIG9mIFwicmVjdlwiLCBcInJlYWRcIiwgXCJrcFwiLCBcImNhbGxcIlxuICAgICAgICAgICAgJ3NlcSc6IHVuZGVmaW5lZCAvLyB0aGUgc2VydmVyLXNpZGUgbWVzc2FnZSBpZCBhY2tub3dsZWRnZWQgYXMgcmVjZWl2ZWQgb3IgcmVhZC5cbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5rbm93biBwYWNrZXQgdHlwZSByZXF1ZXN0ZWQ6ICR7dHlwZX1gKTtcbiAgICB9XG4gIH1cblxuICAvLyBDYWNoZSBtYW5hZ2VtZW50XG4gICNjYWNoZVB1dCh0eXBlLCBuYW1lLCBvYmopIHtcbiAgICB0aGlzLl9jYWNoZVt0eXBlICsgJzonICsgbmFtZV0gPSBvYmo7XG4gIH1cbiAgI2NhY2hlR2V0KHR5cGUsIG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fY2FjaGVbdHlwZSArICc6JyArIG5hbWVdO1xuICB9XG4gICNjYWNoZURlbCh0eXBlLCBuYW1lKSB7XG4gICAgZGVsZXRlIHRoaXMuX2NhY2hlW3R5cGUgKyAnOicgKyBuYW1lXTtcbiAgfVxuXG4gIC8vIEVudW1lcmF0ZSBhbGwgaXRlbXMgaW4gY2FjaGUsIGNhbGwgZnVuYyBmb3IgZWFjaCBpdGVtLlxuICAvLyBFbnVtZXJhdGlvbiBzdG9wcyBpZiBmdW5jIHJldHVybnMgdHJ1ZS5cbiAgI2NhY2hlTWFwKHR5cGUsIGZ1bmMsIGNvbnRleHQpIHtcbiAgICBjb25zdCBrZXkgPSB0eXBlID8gdHlwZSArICc6JyA6IHVuZGVmaW5lZDtcbiAgICBmb3IgKGxldCBpZHggaW4gdGhpcy5fY2FjaGUpIHtcbiAgICAgIGlmICgha2V5IHx8IGlkeC5pbmRleE9mKGtleSkgPT0gMCkge1xuICAgICAgICBpZiAoZnVuYy5jYWxsKGNvbnRleHQsIHRoaXMuX2NhY2hlW2lkeF0sIGlkeCkpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIE1ha2UgbGltaXRlZCBjYWNoZSBtYW5hZ2VtZW50IGF2YWlsYWJsZSB0byB0b3BpYy5cbiAgLy8gQ2FjaGluZyB1c2VyLnB1YmxpYyBvbmx5LiBFdmVyeXRoaW5nIGVsc2UgaXMgcGVyLXRvcGljLlxuICAjYXR0YWNoQ2FjaGVUb1RvcGljKHRvcGljKSB7XG4gICAgdG9waWMuX3Rpbm9kZSA9IHRoaXM7XG5cbiAgICB0b3BpYy5fY2FjaGVHZXRVc2VyID0gKHVpZCkgPT4ge1xuICAgICAgY29uc3QgcHViID0gdGhpcy4jY2FjaGVHZXQoJ3VzZXInLCB1aWQpO1xuICAgICAgaWYgKHB1Yikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHVzZXI6IHVpZCxcbiAgICAgICAgICBwdWJsaWM6IG1lcmdlT2JqKHt9LCBwdWIpXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH07XG4gICAgdG9waWMuX2NhY2hlUHV0VXNlciA9ICh1aWQsIHVzZXIpID0+IHtcbiAgICAgIHRoaXMuI2NhY2hlUHV0KCd1c2VyJywgdWlkLCBtZXJnZU9iaih7fSwgdXNlci5wdWJsaWMpKTtcbiAgICB9O1xuICAgIHRvcGljLl9jYWNoZURlbFVzZXIgPSAodWlkKSA9PiB7XG4gICAgICB0aGlzLiNjYWNoZURlbCgndXNlcicsIHVpZCk7XG4gICAgfTtcbiAgICB0b3BpYy5fY2FjaGVQdXRTZWxmID0gXyA9PiB7XG4gICAgICB0aGlzLiNjYWNoZVB1dCgndG9waWMnLCB0b3BpYy5uYW1lLCB0b3BpYyk7XG4gICAgfTtcbiAgICB0b3BpYy5fY2FjaGVEZWxTZWxmID0gXyA9PiB7XG4gICAgICB0aGlzLiNjYWNoZURlbCgndG9waWMnLCB0b3BpYy5uYW1lKTtcbiAgICB9O1xuICB9XG5cbiAgLy8gT24gc3VjY2Vzc2Z1bCBsb2dpbiBzYXZlIHNlcnZlci1wcm92aWRlZCBkYXRhLlxuICAjbG9naW5TdWNjZXNzZnVsKGN0cmwpIHtcbiAgICBpZiAoIWN0cmwucGFyYW1zIHx8ICFjdHJsLnBhcmFtcy51c2VyKSB7XG4gICAgICByZXR1cm4gY3RybDtcbiAgICB9XG4gICAgLy8gVGhpcyBpcyBhIHJlc3BvbnNlIHRvIGEgc3VjY2Vzc2Z1bCBsb2dpbixcbiAgICAvLyBleHRyYWN0IFVJRCBhbmQgc2VjdXJpdHkgdG9rZW4sIHNhdmUgaXQgaW4gVGlub2RlIG1vZHVsZVxuICAgIHRoaXMuX215VUlEID0gY3RybC5wYXJhbXMudXNlcjtcbiAgICB0aGlzLl9hdXRoZW50aWNhdGVkID0gKGN0cmwgJiYgY3RybC5jb2RlID49IDIwMCAmJiBjdHJsLmNvZGUgPCAzMDApO1xuICAgIGlmIChjdHJsLnBhcmFtcyAmJiBjdHJsLnBhcmFtcy50b2tlbiAmJiBjdHJsLnBhcmFtcy5leHBpcmVzKSB7XG4gICAgICB0aGlzLl9hdXRoVG9rZW4gPSB7XG4gICAgICAgIHRva2VuOiBjdHJsLnBhcmFtcy50b2tlbixcbiAgICAgICAgZXhwaXJlczogY3RybC5wYXJhbXMuZXhwaXJlc1xuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fYXV0aFRva2VuID0gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vbkxvZ2luKSB7XG4gICAgICB0aGlzLm9uTG9naW4oY3RybC5jb2RlLCBjdHJsLnRleHQpO1xuICAgIH1cblxuICAgIHJldHVybiBjdHJsO1xuICB9XG5cbiAgLy8gU3RhdGljIG1ldGhvZHMuXG4gIC8qKlxuICAgKiBIZWxwZXIgbWV0aG9kIHRvIHBhY2thZ2UgYWNjb3VudCBjcmVkZW50aWFsLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmcgfCBDcmVkZW50aWFsfSBtZXRoIC0gdmFsaWRhdGlvbiBtZXRob2Qgb3Igb2JqZWN0IHdpdGggdmFsaWRhdGlvbiBkYXRhLlxuICAgKiBAcGFyYW0ge3N0cmluZz19IHZhbCAtIHZhbGlkYXRpb24gdmFsdWUgKGUuZy4gZW1haWwgb3IgcGhvbmUgbnVtYmVyKS5cbiAgICogQHBhcmFtIHtPYmplY3Q9fSBwYXJhbXMgLSB2YWxpZGF0aW9uIHBhcmFtZXRlcnMuXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gcmVzcCAtIHZhbGlkYXRpb24gcmVzcG9uc2UuXG4gICAqXG4gICAqIEByZXR1cm5zIHtBcnJheS48Q3JlZGVudGlhbD59IGFycmF5IHdpdGggYSBzaW5nbGUgY3JlZGVudGlhbCBvciA8Y29kZT5udWxsPC9jb2RlPiBpZiBubyB2YWxpZCBjcmVkZW50aWFscyB3ZXJlIGdpdmVuLlxuICAgKi9cbiAgc3RhdGljIGNyZWRlbnRpYWwobWV0aCwgdmFsLCBwYXJhbXMsIHJlc3ApIHtcbiAgICBpZiAodHlwZW9mIG1ldGggPT0gJ29iamVjdCcpIHtcbiAgICAgICh7XG4gICAgICAgIHZhbCxcbiAgICAgICAgcGFyYW1zLFxuICAgICAgICByZXNwLFxuICAgICAgICBtZXRoXG4gICAgICB9ID0gbWV0aCk7XG4gICAgfVxuICAgIGlmIChtZXRoICYmICh2YWwgfHwgcmVzcCkpIHtcbiAgICAgIHJldHVybiBbe1xuICAgICAgICAnbWV0aCc6IG1ldGgsXG4gICAgICAgICd2YWwnOiB2YWwsXG4gICAgICAgICdyZXNwJzogcmVzcCxcbiAgICAgICAgJ3BhcmFtcyc6IHBhcmFtc1xuICAgICAgfV07XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZSB0b3BpYyB0eXBlIGZyb20gdG9waWMncyBuYW1lOiBncnAsIHAycCwgbWUsIGZuZCwgc3lzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byB0ZXN0LlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBPbmUgb2YgPGNvZGU+XCJtZVwiPC9jb2RlPiwgPGNvZGU+XCJmbmRcIjwvY29kZT4sIDxjb2RlPlwic3lzXCI8L2NvZGU+LCA8Y29kZT5cImdycFwiPC9jb2RlPixcbiAgICogICAgPGNvZGU+XCJwMnBcIjwvY29kZT4gb3IgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPi5cbiAgICovXG4gIHN0YXRpYyB0b3BpY1R5cGUobmFtZSkge1xuICAgIHJldHVybiBUb3BpYy50b3BpY1R5cGUobmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIGdpdmVuIHRvcGljIG5hbWUgaXMgYSBuYW1lIG9mIGEgJ21lJyB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gdGVzdC5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBuYW1lIGlzIGEgbmFtZSBvZiBhICdtZScgdG9waWMsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBzdGF0aWMgaXNNZVRvcGljTmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIFRvcGljLmlzTWVUb3BpY05hbWUobmFtZSk7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhIGdyb3VwIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byB0ZXN0LlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdGhlIG5hbWUgaXMgYSBuYW1lIG9mIGEgZ3JvdXAgdG9waWMsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBzdGF0aWMgaXNHcm91cFRvcGljTmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIFRvcGljLmlzR3JvdXBUb3BpY05hbWUobmFtZSk7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhIHAycCB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gdGVzdC5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBuYW1lIGlzIGEgbmFtZSBvZiBhIHAycCB0b3BpYywgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIHN0YXRpYyBpc1AyUFRvcGljTmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIFRvcGljLmlzUDJQVG9waWNOYW1lKG5hbWUpO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgZ2l2ZW4gdG9waWMgbmFtZSBpcyBhIG5hbWUgb2YgYSBjb21tdW5pY2F0aW9uIHRvcGljLCBpLmUuIFAyUCBvciBncm91cC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gdGVzdC5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBuYW1lIGlzIGEgbmFtZSBvZiBhIHAycCBvciBncm91cCB0b3BpYywgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIHN0YXRpYyBpc0NvbW1Ub3BpY05hbWUobmFtZSkge1xuICAgIHJldHVybiBUb3BpYy5pc0NvbW1Ub3BpY05hbWUobmFtZSk7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhIG5ldyB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gdG9waWMgbmFtZSB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBuYW1lIGlzIGEgbmFtZSBvZiBhIG5ldyB0b3BpYywgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIHN0YXRpYyBpc05ld0dyb3VwVG9waWNOYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gVG9waWMuaXNOZXdHcm91cFRvcGljTmFtZShuYW1lKTtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIHRvcGljIG5hbWUgaXMgYSBuYW1lIG9mIGEgY2hhbm5lbC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gdG9waWMgbmFtZSB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBuYW1lIGlzIGEgbmFtZSBvZiBhIGNoYW5uZWwsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBzdGF0aWMgaXNDaGFubmVsVG9waWNOYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gVG9waWMuaXNDaGFubmVsVG9waWNOYW1lKG5hbWUpO1xuICB9XG4gIC8qKlxuICAgKiBSZXR1cm4gaW5mb3JtYXRpb24gYWJvdXQgdGhlIGN1cnJlbnQgdmVyc2lvbiBvZiB0aGlzIFRpbm9kZSBjbGllbnQgbGlicmFyeS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IHNlbWFudGljIHZlcnNpb24gb2YgdGhlIGxpYnJhcnksIGUuZy4gPGNvZGU+XCIwLjE1LjUtcmMxXCI8L2NvZGU+LlxuICAgKi9cbiAgc3RhdGljIGdldFZlcnNpb24oKSB7XG4gICAgcmV0dXJuIENvbnN0LlZFUlNJT047XG4gIH1cbiAgLyoqXG4gICAqIFRvIHVzZSBUaW5vZGUgaW4gYSBub24gYnJvd3NlciBjb250ZXh0LCBzdXBwbHkgV2ViU29ja2V0IGFuZCBYTUxIdHRwUmVxdWVzdCBwcm92aWRlcnMuXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAcGFyYW0gd3NQcm92aWRlciA8Y29kZT5XZWJTb2NrZXQ8L2NvZGU+IHByb3ZpZGVyLCBlLmcuIGZvciBub2RlSlMgLCA8Y29kZT5yZXF1aXJlKCd3cycpPC9jb2RlPi5cbiAgICogQHBhcmFtIHhoclByb3ZpZGVyIDxjb2RlPlhNTEh0dHBSZXF1ZXN0PC9jb2RlPiBwcm92aWRlciwgZS5nLiBmb3Igbm9kZSA8Y29kZT5yZXF1aXJlKCd4aHInKTwvY29kZT4uXG4gICAqL1xuICBzdGF0aWMgc2V0TmV0d29ya1Byb3ZpZGVycyh3c1Byb3ZpZGVyLCB4aHJQcm92aWRlcikge1xuICAgIFdlYlNvY2tldFByb3ZpZGVyID0gd3NQcm92aWRlcjtcbiAgICBYSFJQcm92aWRlciA9IHhoclByb3ZpZGVyO1xuXG4gICAgQ29ubmVjdGlvbi5zZXROZXR3b3JrUHJvdmlkZXJzKFdlYlNvY2tldFByb3ZpZGVyLCBYSFJQcm92aWRlcik7XG4gICAgTGFyZ2VGaWxlSGVscGVyLnNldE5ldHdvcmtQcm92aWRlcihYSFJQcm92aWRlcik7XG4gIH1cbiAgLyoqXG4gICAqIFRvIHVzZSBUaW5vZGUgaW4gYSBub24gYnJvd3NlciBjb250ZXh0LCBzdXBwbHkgPGNvZGU+aW5kZXhlZERCPC9jb2RlPiBwcm92aWRlci5cbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBwYXJhbSBpZGJQcm92aWRlciA8Y29kZT5pbmRleGVkREI8L2NvZGU+IHByb3ZpZGVyLCBlLmcuIGZvciBub2RlSlMgLCA8Y29kZT5yZXF1aXJlKCdmYWtlLWluZGV4ZWRkYicpPC9jb2RlPi5cbiAgICovXG4gIHN0YXRpYyBzZXREYXRhYmFzZVByb3ZpZGVyKGlkYlByb3ZpZGVyKSB7XG4gICAgSW5kZXhlZERCUHJvdmlkZXIgPSBpZGJQcm92aWRlcjtcblxuICAgIERCQ2FjaGUuc2V0RGF0YWJhc2VQcm92aWRlcihJbmRleGVkREJQcm92aWRlcik7XG4gIH1cbiAgLyoqXG4gICAqIFJldHVybiBpbmZvcm1hdGlvbiBhYm91dCB0aGUgY3VycmVudCBuYW1lIGFuZCB2ZXJzaW9uIG9mIHRoaXMgVGlub2RlIGxpYnJhcnkuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSB0aGUgbmFtZSBvZiB0aGUgbGlicmFyeSBhbmQgaXQncyB2ZXJzaW9uLlxuICAgKi9cbiAgc3RhdGljIGdldExpYnJhcnkoKSB7XG4gICAgcmV0dXJuIENvbnN0LkxJQlJBUlk7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiBzdHJpbmcgcmVwcmVzZW50cyA8Y29kZT5OVUxMPC9jb2RlPiB2YWx1ZSBhcyBkZWZpbmVkIGJ5IFRpbm9kZSAoPGNvZGU+J1xcdTI0MjEnPC9jb2RlPikuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyIC0gc3RyaW5nIHRvIGNoZWNrIGZvciA8Y29kZT5OVUxMPC9jb2RlPiB2YWx1ZS5cbiAgICpcbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHN0cmluZyByZXByZXNlbnRzIDxjb2RlPk5VTEw8L2NvZGU+IHZhbHVlLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgc3RhdGljIGlzTnVsbFZhbHVlKHN0cikge1xuICAgIHJldHVybiBzdHIgPT09IENvbnN0LkRFTF9DSEFSO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgZ2l2ZW4gVVJMIHN0cmluZyBpcyBhIHJlbGF0aXZlIFVSTC5cbiAgICogQ2hlY2sgZm9yIGNhc2VzIGxpa2U6XG4gICAqICA8Y29kZT4naHR0cDovL2V4YW1wbGUuY29tJzwvY29kZT5cbiAgICogIDxjb2RlPicgaHR0cDovL2V4YW1wbGUuY29tJzwvY29kZT5cbiAgICogIDxjb2RlPicvL2V4YW1wbGUuY29tLyc8L2NvZGU+XG4gICAqICA8Y29kZT4naHR0cDpleGFtcGxlLmNvbSc8L2NvZGU+XG4gICAqICA8Y29kZT4naHR0cDovZXhhbXBsZS5jb20nPC9jb2RlPlxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIFVSTCBzdHJpbmcgdG8gY2hlY2suXG4gICAqXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGUgVVJMIGlzIHJlbGF0aXZlLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgc3RhdGljIGlzUmVsYXRpdmVVUkwodXJsKSB7XG4gICAgcmV0dXJuICEvXlxccyooW2Etel1bYS16MC05Ky4tXSo6fFxcL1xcLykvaW0udGVzdCh1cmwpO1xuICB9XG5cbiAgLy8gSW5zdGFuY2UgbWV0aG9kcy5cblxuICAvLyBHZW5lcmF0ZXMgdW5pcXVlIG1lc3NhZ2UgSURzXG4gIGdldE5leHRVbmlxdWVJZCgpIHtcbiAgICByZXR1cm4gKHRoaXMuX21lc3NhZ2VJZCAhPSAwKSA/ICcnICsgdGhpcy5fbWVzc2FnZUlkKysgOiB1bmRlZmluZWQ7XG4gIH07XG5cbiAgLyoqXG4gICAqIENvbm5lY3QgdG8gdGhlIHNlcnZlci5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGhvc3RfIC0gbmFtZSBvZiB0aGUgaG9zdCB0byBjb25uZWN0IHRvLlxuICAgKlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBQcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIGNvbm5lY3Rpb24gY2FsbCBjb21wbGV0ZXM6XG4gICAqICAgIDxjb2RlPnJlc29sdmUoKTwvY29kZT4gaXMgY2FsbGVkIHdpdGhvdXQgcGFyYW1ldGVycywgPGNvZGU+cmVqZWN0KCk8L2NvZGU+IHJlY2VpdmVzIHRoZVxuICAgKiAgICA8Y29kZT5FcnJvcjwvY29kZT4gYXMgYSBzaW5nbGUgcGFyYW1ldGVyLlxuICAgKi9cbiAgY29ubmVjdChob3N0Xykge1xuICAgIHJldHVybiB0aGlzLl9jb25uZWN0aW9uLmNvbm5lY3QoaG9zdF8pO1xuICB9XG5cbiAgLyoqXG4gICAqIEF0dGVtcHQgdG8gcmVjb25uZWN0IHRvIHRoZSBzZXJ2ZXIgaW1tZWRpYXRlbHkuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmb3JjZSAtIHJlY29ubmVjdCBldmVuIGlmIHRoZXJlIGlzIGEgY29ubmVjdGlvbiBhbHJlYWR5LlxuICAgKi9cbiAgcmVjb25uZWN0KGZvcmNlKSB7XG4gICAgdGhpcy5fY29ubmVjdGlvbi5yZWNvbm5lY3QoZm9yY2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc2Nvbm5lY3QgZnJvbSB0aGUgc2VydmVyLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKi9cbiAgZGlzY29ubmVjdCgpIHtcbiAgICB0aGlzLl9jb25uZWN0aW9uLmRpc2Nvbm5lY3QoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhciBwZXJzaXN0ZW50IGNhY2hlOiByZW1vdmUgSW5kZXhlZERCLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBQcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIG9wZXJhdGlvbiBpcyBjb21wbGV0ZWQuXG4gICAqL1xuICBjbGVhclN0b3JhZ2UoKSB7XG4gICAgaWYgKHRoaXMuX2RiLmlzUmVhZHkoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2RiLmRlbGV0ZURhdGFiYXNlKCk7XG4gICAgfVxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHBlcnNpc3RlbnQgY2FjaGU6IGNyZWF0ZSBJbmRleGVkREIgY2FjaGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IFByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgb3BlcmF0aW9uIGlzIGNvbXBsZXRlZC5cbiAgICovXG4gIGluaXRTdG9yYWdlKCkge1xuICAgIGlmICghdGhpcy5fZGIuaXNSZWFkeSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5fZGIuaW5pdERhdGFiYXNlKCk7XG4gICAgfVxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIGEgbmV0d29yayBwcm9iZSBtZXNzYWdlIHRvIG1ha2Ugc3VyZSB0aGUgY29ubmVjdGlvbiBpcyBhbGl2ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICovXG4gIG5ldHdvcmtQcm9iZSgpIHtcbiAgICB0aGlzLl9jb25uZWN0aW9uLnByb2JlKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgZm9yIGxpdmUgY29ubmVjdGlvbiB0byBzZXJ2ZXIuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGVyZSBpcyBhIGxpdmUgY29ubmVjdGlvbiwgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIGlzQ29ubmVjdGVkKCkge1xuICAgIHJldHVybiB0aGlzLl9jb25uZWN0aW9uLmlzQ29ubmVjdGVkKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgY29ubmVjdGlvbiBpcyBhdXRoZW50aWNhdGVkIChsYXN0IGxvZ2luIHdhcyBzdWNjZXNzZnVsKS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIGF1dGhlbnRpY2F0ZWQsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBpc0F1dGhlbnRpY2F0ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2F1dGhlbnRpY2F0ZWQ7XG4gIH1cblxuICAvKipcbiAgICogQWRkIEFQSSBrZXkgYW5kIGF1dGggdG9rZW4gdG8gdGhlIHJlbGF0aXZlIFVSTCBtYWtpbmcgaXQgdXNhYmxlIGZvciBnZXR0aW5nIGRhdGFcbiAgICogZnJvbSB0aGUgc2VydmVyIGluIGEgc2ltcGxlIDxjb2RlPkhUVFAgR0VUPC9jb2RlPiByZXF1ZXN0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gVVJMIC0gVVJMIHRvIHdyYXAuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFVSTCB3aXRoIGFwcGVuZGVkIEFQSSBrZXkgYW5kIHRva2VuLCBpZiB2YWxpZCB0b2tlbiBpcyBwcmVzZW50LlxuICAgKi9cbiAgYXV0aG9yaXplVVJMKHVybCkge1xuICAgIGlmICh0eXBlb2YgdXJsICE9ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gdXJsO1xuICAgIH1cblxuICAgIGlmIChUaW5vZGUuaXNSZWxhdGl2ZVVSTCh1cmwpKSB7XG4gICAgICAvLyBGYWtlIGJhc2UgdG8gbWFrZSB0aGUgcmVsYXRpdmUgVVJMIHBhcnNlYWJsZS5cbiAgICAgIGNvbnN0IGJhc2UgPSAnc2NoZW1lOi8vaG9zdC8nO1xuICAgICAgY29uc3QgcGFyc2VkID0gbmV3IFVSTCh1cmwsIGJhc2UpO1xuICAgICAgaWYgKHRoaXMuX2FwaUtleSkge1xuICAgICAgICBwYXJzZWQuc2VhcmNoUGFyYW1zLmFwcGVuZCgnYXBpa2V5JywgdGhpcy5fYXBpS2V5KTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLl9hdXRoVG9rZW4gJiYgdGhpcy5fYXV0aFRva2VuLnRva2VuKSB7XG4gICAgICAgIHBhcnNlZC5zZWFyY2hQYXJhbXMuYXBwZW5kKCdhdXRoJywgJ3Rva2VuJyk7XG4gICAgICAgIHBhcnNlZC5zZWFyY2hQYXJhbXMuYXBwZW5kKCdzZWNyZXQnLCB0aGlzLl9hdXRoVG9rZW4udG9rZW4pO1xuICAgICAgfVxuICAgICAgLy8gQ29udmVydCBiYWNrIHRvIHN0cmluZyBhbmQgc3RyaXAgZmFrZSBiYXNlIFVSTCBleGNlcHQgZm9yIHRoZSByb290IHNsYXNoLlxuICAgICAgdXJsID0gcGFyc2VkLnRvU3RyaW5nKCkuc3Vic3RyaW5nKGJhc2UubGVuZ3RoIC0gMSk7XG4gICAgfVxuICAgIHJldHVybiB1cmw7XG4gIH1cblxuICAvKipcbiAgICogQHR5cGVkZWYgQWNjb3VudFBhcmFtc1xuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcm9wZXJ0eSB7VGlub2RlLkRlZkFjcz19IGRlZmFjcyAtIERlZmF1bHQgYWNjZXNzIHBhcmFtZXRlcnMgZm9yIHVzZXIncyA8Y29kZT5tZTwvY29kZT4gdG9waWMuXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0PX0gcHVibGljIC0gUHVibGljIGFwcGxpY2F0aW9uLWRlZmluZWQgZGF0YSBleHBvc2VkIG9uIDxjb2RlPm1lPC9jb2RlPiB0b3BpYy5cbiAgICogQHByb3BlcnR5IHtPYmplY3Q9fSBwcml2YXRlIC0gUHJpdmF0ZSBhcHBsaWNhdGlvbi1kZWZpbmVkIGRhdGEgYWNjZXNzaWJsZSBvbiA8Y29kZT5tZTwvY29kZT4gdG9waWMuXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0PX0gdHJ1c3RlZCAtIFRydXN0ZWQgdXNlciBkYXRhIHdoaWNoIGNhbiBiZSBzZXQgYnkgYSByb290IHVzZXIgb25seS5cbiAgICogQHByb3BlcnR5IHtBcnJheS48c3RyaW5nPn0gdGFncyAtIGFycmF5IG9mIHN0cmluZyB0YWdzIGZvciB1c2VyIGRpc2NvdmVyeS5cbiAgICogQHByb3BlcnR5IHtzdHJpbmc9fSB0b2tlbiAtIGF1dGhlbnRpY2F0aW9uIHRva2VuIHRvIHVzZS5cbiAgICogQHByb3BlcnR5IHtBcnJheS48c3RyaW5nPj19IGF0dGFjaG1lbnRzIC0gQXJyYXkgb2YgcmVmZXJlbmNlcyB0byBvdXQgb2YgYmFuZCBhdHRhY2htZW50cyB1c2VkIGluIGFjY291bnQgZGVzY3JpcHRpb24uXG4gICAqL1xuICAvKipcbiAgICogQHR5cGVkZWYgRGVmQWNzXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByb3BlcnR5IHtzdHJpbmc9fSBhdXRoIC0gQWNjZXNzIG1vZGUgZm9yIDxjb2RlPm1lPC9jb2RlPiBmb3IgYXV0aGVudGljYXRlZCB1c2Vycy5cbiAgICogQHByb3BlcnR5IHtzdHJpbmc9fSBhbm9uIC0gQWNjZXNzIG1vZGUgZm9yIDxjb2RlPm1lPC9jb2RlPiBmb3IgYW5vbnltb3VzIHVzZXJzLlxuICAgKi9cblxuICAvKipcbiAgICogQ3JlYXRlIG9yIHVwZGF0ZSBhbiBhY2NvdW50LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gVXNlciBpZCB0byB1cGRhdGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNjaGVtZSAtIEF1dGhlbnRpY2F0aW9uIHNjaGVtZTsgPGNvZGU+XCJiYXNpY1wiPC9jb2RlPiBhbmQgPGNvZGU+XCJhbm9ueW1vdXNcIjwvY29kZT4gYXJlIHRoZSBjdXJyZW50bHkgc3VwcG9ydGVkIHNjaGVtZXMuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzZWNyZXQgLSBBdXRoZW50aWNhdGlvbiBzZWNyZXQsIGFzc3VtZWQgdG8gYmUgYWxyZWFkeSBiYXNlNjQgZW5jb2RlZC5cbiAgICogQHBhcmFtIHtib29sZWFuPX0gbG9naW4gLSBVc2UgbmV3IGFjY291bnQgdG8gYXV0aGVudGljYXRlIGN1cnJlbnQgc2Vzc2lvblxuICAgKiBAcGFyYW0ge1Rpbm9kZS5BY2NvdW50UGFyYW1zPX0gcGFyYW1zIC0gVXNlciBkYXRhIHRvIHBhc3MgdG8gdGhlIHNlcnZlci5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHNlcnZlciByZXBseSBpcyByZWNlaXZlZC5cbiAgICovXG4gIGFjY291bnQodWlkLCBzY2hlbWUsIHNlY3JldCwgbG9naW4sIHBhcmFtcykge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ2FjYycpO1xuICAgIHBrdC5hY2MudXNlciA9IHVpZDtcbiAgICBwa3QuYWNjLnNjaGVtZSA9IHNjaGVtZTtcbiAgICBwa3QuYWNjLnNlY3JldCA9IHNlY3JldDtcbiAgICAvLyBMb2cgaW4gdG8gdGhlIG5ldyBhY2NvdW50IHVzaW5nIHNlbGVjdGVkIHNjaGVtZVxuICAgIHBrdC5hY2MubG9naW4gPSBsb2dpbjtcblxuICAgIGlmIChwYXJhbXMpIHtcbiAgICAgIHBrdC5hY2MuZGVzYy5kZWZhY3MgPSBwYXJhbXMuZGVmYWNzO1xuICAgICAgcGt0LmFjYy5kZXNjLnB1YmxpYyA9IHBhcmFtcy5wdWJsaWM7XG4gICAgICBwa3QuYWNjLmRlc2MucHJpdmF0ZSA9IHBhcmFtcy5wcml2YXRlO1xuICAgICAgcGt0LmFjYy5kZXNjLnRydXN0ZWQgPSBwYXJhbXMudHJ1c3RlZDtcblxuICAgICAgcGt0LmFjYy50YWdzID0gcGFyYW1zLnRhZ3M7XG4gICAgICBwa3QuYWNjLmNyZWQgPSBwYXJhbXMuY3JlZDtcblxuICAgICAgcGt0LmFjYy50b2tlbiA9IHBhcmFtcy50b2tlbjtcblxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkocGFyYW1zLmF0dGFjaG1lbnRzKSAmJiBwYXJhbXMuYXR0YWNobWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICBwa3QuZXh0cmEgPSB7XG4gICAgICAgICAgYXR0YWNobWVudHM6IHBhcmFtcy5hdHRhY2htZW50cy5maWx0ZXIocmVmID0+IFRpbm9kZS5pc1JlbGF0aXZlVVJMKHJlZikpXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuI3NlbmQocGt0LCBwa3QuYWNjLmlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgdXNlci4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNhY2NvdW50fS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNjaGVtZSAtIEF1dGhlbnRpY2F0aW9uIHNjaGVtZTsgPGNvZGU+XCJiYXNpY1wiPC9jb2RlPiBpcyB0aGUgb25seSBjdXJyZW50bHkgc3VwcG9ydGVkIHNjaGVtZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHNlY3JldCAtIEF1dGhlbnRpY2F0aW9uLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBsb2dpbiAtIFVzZSBuZXcgYWNjb3VudCB0byBhdXRoZW50aWNhdGUgY3VycmVudCBzZXNzaW9uXG4gICAqIEBwYXJhbSB7VGlub2RlLkFjY291bnRQYXJhbXM9fSBwYXJhbXMgLSBVc2VyIGRhdGEgdG8gcGFzcyB0byB0aGUgc2VydmVyLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gc2VydmVyIHJlcGx5IGlzIHJlY2VpdmVkLlxuICAgKi9cbiAgY3JlYXRlQWNjb3VudChzY2hlbWUsIHNlY3JldCwgbG9naW4sIHBhcmFtcykge1xuICAgIGxldCBwcm9taXNlID0gdGhpcy5hY2NvdW50KENvbnN0LlVTRVJfTkVXLCBzY2hlbWUsIHNlY3JldCwgbG9naW4sIHBhcmFtcyk7XG4gICAgaWYgKGxvZ2luKSB7XG4gICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChjdHJsKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLiNsb2dpblN1Y2Nlc3NmdWwoY3RybCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIHVzZXIgd2l0aCA8Y29kZT4nYmFzaWMnPC9jb2RlPiBhdXRoZW50aWNhdGlvbiBzY2hlbWUgYW5kIGltbWVkaWF0ZWx5XG4gICAqIHVzZSBpdCBmb3IgYXV0aGVudGljYXRpb24uIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjYWNjb3VudH0uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1c2VybmFtZSAtIExvZ2luIHRvIHVzZSBmb3IgdGhlIG5ldyBhY2NvdW50LlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGFzc3dvcmQgLSBVc2VyJ3MgcGFzc3dvcmQuXG4gICAqIEBwYXJhbSB7VGlub2RlLkFjY291bnRQYXJhbXM9fSBwYXJhbXMgLSBVc2VyIGRhdGEgdG8gcGFzcyB0byB0aGUgc2VydmVyLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gc2VydmVyIHJlcGx5IGlzIHJlY2VpdmVkLlxuICAgKi9cbiAgY3JlYXRlQWNjb3VudEJhc2ljKHVzZXJuYW1lLCBwYXNzd29yZCwgcGFyYW1zKSB7XG4gICAgLy8gTWFrZSBzdXJlIHdlIGFyZSBub3QgdXNpbmcgJ251bGwnIG9yICd1bmRlZmluZWQnO1xuICAgIHVzZXJuYW1lID0gdXNlcm5hbWUgfHwgJyc7XG4gICAgcGFzc3dvcmQgPSBwYXNzd29yZCB8fCAnJztcbiAgICByZXR1cm4gdGhpcy5jcmVhdGVBY2NvdW50KCdiYXNpYycsXG4gICAgICBiNjRFbmNvZGVVbmljb2RlKHVzZXJuYW1lICsgJzonICsgcGFzc3dvcmQpLCB0cnVlLCBwYXJhbXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSB1c2VyJ3MgY3JlZGVudGlhbHMgZm9yIDxjb2RlPidiYXNpYyc8L2NvZGU+IGF1dGhlbnRpY2F0aW9uIHNjaGVtZS4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNhY2NvdW50fS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVpZCAtIFVzZXIgSUQgdG8gdXBkYXRlLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXNlcm5hbWUgLSBMb2dpbiB0byB1c2UgZm9yIHRoZSBuZXcgYWNjb3VudC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhc3N3b3JkIC0gVXNlcidzIHBhc3N3b3JkLlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5BY2NvdW50UGFyYW1zPX0gcGFyYW1zIC0gZGF0YSB0byBwYXNzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiBzZXJ2ZXIgcmVwbHkgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICB1cGRhdGVBY2NvdW50QmFzaWModWlkLCB1c2VybmFtZSwgcGFzc3dvcmQsIHBhcmFtcykge1xuICAgIC8vIE1ha2Ugc3VyZSB3ZSBhcmUgbm90IHVzaW5nICdudWxsJyBvciAndW5kZWZpbmVkJztcbiAgICB1c2VybmFtZSA9IHVzZXJuYW1lIHx8ICcnO1xuICAgIHBhc3N3b3JkID0gcGFzc3dvcmQgfHwgJyc7XG4gICAgcmV0dXJuIHRoaXMuYWNjb3VudCh1aWQsICdiYXNpYycsXG4gICAgICBiNjRFbmNvZGVVbmljb2RlKHVzZXJuYW1lICsgJzonICsgcGFzc3dvcmQpLCBmYWxzZSwgcGFyYW1zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIGhhbmRzaGFrZSB0byB0aGUgc2VydmVyLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gc2VydmVyIHJlcGx5IGlzIHJlY2VpdmVkLlxuICAgKi9cbiAgaGVsbG8oKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnaGknKTtcblxuICAgIHJldHVybiB0aGlzLiNzZW5kKHBrdCwgcGt0LmhpLmlkKVxuICAgICAgLnRoZW4oKGN0cmwpID0+IHtcbiAgICAgICAgLy8gUmVzZXQgYmFja29mZiBjb3VudGVyIG9uIHN1Y2Nlc3NmdWwgY29ubmVjdGlvbi5cbiAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5iYWNrb2ZmUmVzZXQoKTtcblxuICAgICAgICAvLyBTZXJ2ZXIgcmVzcG9uc2UgY29udGFpbnMgc2VydmVyIHByb3RvY29sIHZlcnNpb24sIGJ1aWxkLCBjb25zdHJhaW50cyxcbiAgICAgICAgLy8gc2Vzc2lvbiBJRCBmb3IgbG9uZyBwb2xsaW5nLiBTYXZlIHRoZW0uXG4gICAgICAgIGlmIChjdHJsLnBhcmFtcykge1xuICAgICAgICAgIHRoaXMuX3NlcnZlckluZm8gPSBjdHJsLnBhcmFtcztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm9uQ29ubmVjdCkge1xuICAgICAgICAgIHRoaXMub25Db25uZWN0KCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY3RybDtcbiAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5yZWNvbm5lY3QodHJ1ZSk7XG5cbiAgICAgICAgaWYgKHRoaXMub25EaXNjb25uZWN0KSB7XG4gICAgICAgICAgdGhpcy5vbkRpc2Nvbm5lY3QoZXJyKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogU2V0IG9yIHJlZnJlc2ggdGhlIHB1c2ggbm90aWZpY2F0aW9ucy9kZXZpY2UgdG9rZW4uIElmIHRoZSBjbGllbnQgaXMgY29ubmVjdGVkLFxuICAgKiB0aGUgZGV2aWNlVG9rZW4gY2FuIGJlIHNlbnQgdG8gdGhlIHNlcnZlci5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICogQHBhcmFtIHtzdHJpbmd9IGR0IC0gdG9rZW4gb2J0YWluZWQgZnJvbSB0aGUgcHJvdmlkZXIgb3IgPGNvZGU+ZmFsc2U8L2NvZGU+LFxuICAgKiAgICA8Y29kZT5udWxsPC9jb2RlPiBvciA8Y29kZT51bmRlZmluZWQ8L2NvZGU+IHRvIGNsZWFyIHRoZSB0b2tlbi5cbiAgICpcbiAgICogQHJldHVybnMgPGNvZGU+dHJ1ZTwvY29kZT4gaWYgYXR0ZW1wdCB3YXMgbWFkZSB0byBzZW5kIHRoZSB1cGRhdGUgdG8gdGhlIHNlcnZlci5cbiAgICovXG4gIHNldERldmljZVRva2VuKGR0KSB7XG4gICAgbGV0IHNlbnQgPSBmYWxzZTtcbiAgICAvLyBDb252ZXJ0IGFueSBmYWxzaXNoIHZhbHVlIHRvIG51bGwuXG4gICAgZHQgPSBkdCB8fCBudWxsO1xuICAgIGlmIChkdCAhPSB0aGlzLl9kZXZpY2VUb2tlbikge1xuICAgICAgdGhpcy5fZGV2aWNlVG9rZW4gPSBkdDtcbiAgICAgIGlmICh0aGlzLmlzQ29ubmVjdGVkKCkgJiYgdGhpcy5pc0F1dGhlbnRpY2F0ZWQoKSkge1xuICAgICAgICB0aGlzLiNzZW5kKHtcbiAgICAgICAgICAnaGknOiB7XG4gICAgICAgICAgICAnZGV2JzogZHQgfHwgVGlub2RlLkRFTF9DSEFSXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgc2VudCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIENyZWRlbnRpYWxcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IG1ldGggLSB2YWxpZGF0aW9uIG1ldGhvZC5cbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IHZhbCAtIHZhbHVlIHRvIHZhbGlkYXRlIChlLmcuIGVtYWlsIG9yIHBob25lIG51bWJlcikuXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSByZXNwIC0gdmFsaWRhdGlvbiByZXNwb25zZS5cbiAgICogQHByb3BlcnR5IHtPYmplY3R9IHBhcmFtcyAtIHZhbGlkYXRpb24gcGFyYW1ldGVycy5cbiAgICovXG4gIC8qKlxuICAgKiBBdXRoZW50aWNhdGUgY3VycmVudCBzZXNzaW9uLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2NoZW1lIC0gQXV0aGVudGljYXRpb24gc2NoZW1lOyA8Y29kZT5cImJhc2ljXCI8L2NvZGU+IGlzIHRoZSBvbmx5IGN1cnJlbnRseSBzdXBwb3J0ZWQgc2NoZW1lLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2VjcmV0IC0gQXV0aGVudGljYXRpb24gc2VjcmV0LCBhc3N1bWVkIHRvIGJlIGFscmVhZHkgYmFzZTY0IGVuY29kZWQuXG4gICAqIEBwYXJhbSB7Q3JlZGVudGlhbD19IGNyZWQgLSBjcmVkZW50aWFsIGNvbmZpcm1hdGlvbiwgaWYgcmVxdWlyZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiBzZXJ2ZXIgcmVwbHkgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICBsb2dpbihzY2hlbWUsIHNlY3JldCwgY3JlZCkge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ2xvZ2luJyk7XG4gICAgcGt0LmxvZ2luLnNjaGVtZSA9IHNjaGVtZTtcbiAgICBwa3QubG9naW4uc2VjcmV0ID0gc2VjcmV0O1xuICAgIHBrdC5sb2dpbi5jcmVkID0gY3JlZDtcblxuICAgIHJldHVybiB0aGlzLiNzZW5kKHBrdCwgcGt0LmxvZ2luLmlkKVxuICAgICAgLnRoZW4oKGN0cmwpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI2xvZ2luU3VjY2Vzc2Z1bChjdHJsKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjbG9naW59IHdpdGggYmFzaWMgYXV0aGVudGljYXRpb25cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVuYW1lIC0gVXNlciBuYW1lLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGFzc3dvcmQgIC0gUGFzc3dvcmQuXG4gICAqIEBwYXJhbSB7Q3JlZGVudGlhbD19IGNyZWQgLSBjcmVkZW50aWFsIGNvbmZpcm1hdGlvbiwgaWYgcmVxdWlyZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIGxvZ2luQmFzaWModW5hbWUsIHBhc3N3b3JkLCBjcmVkKSB7XG4gICAgcmV0dXJuIHRoaXMubG9naW4oJ2Jhc2ljJywgYjY0RW5jb2RlVW5pY29kZSh1bmFtZSArICc6JyArIHBhc3N3b3JkKSwgY3JlZClcbiAgICAgIC50aGVuKChjdHJsKSA9PiB7XG4gICAgICAgIHRoaXMuX2xvZ2luID0gdW5hbWU7XG4gICAgICAgIHJldHVybiBjdHJsO1xuICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNsb2dpbn0gd2l0aCB0b2tlbiBhdXRoZW50aWNhdGlvblxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9rZW4gLSBUb2tlbiByZWNlaXZlZCBpbiByZXNwb25zZSB0byBlYXJsaWVyIGxvZ2luLlxuICAgKiBAcGFyYW0ge0NyZWRlbnRpYWw9fSBjcmVkIC0gY3JlZGVudGlhbCBjb25maXJtYXRpb24sIGlmIHJlcXVpcmVkLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICBsb2dpblRva2VuKHRva2VuLCBjcmVkKSB7XG4gICAgcmV0dXJuIHRoaXMubG9naW4oJ3Rva2VuJywgdG9rZW4sIGNyZWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSByZXF1ZXN0IGZvciByZXNldHRpbmcgYW4gYXV0aGVudGljYXRpb24gc2VjcmV0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2NoZW1lIC0gYXV0aGVudGljYXRpb24gc2NoZW1lIHRvIHJlc2V0LlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kIC0gbWV0aG9kIHRvIHVzZSBmb3IgcmVzZXR0aW5nIHRoZSBzZWNyZXQsIHN1Y2ggYXMgXCJlbWFpbFwiIG9yIFwidGVsXCIuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIHZhbHVlIG9mIHRoZSBjcmVkZW50aWFsIHRvIHVzZSwgYSBzcGVjaWZpYyBlbWFpbCBhZGRyZXNzIG9yIGEgcGhvbmUgbnVtYmVyLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyB0aGUgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgcmVxdWVzdFJlc2V0QXV0aFNlY3JldChzY2hlbWUsIG1ldGhvZCwgdmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5sb2dpbigncmVzZXQnLCBiNjRFbmNvZGVVbmljb2RlKHNjaGVtZSArICc6JyArIG1ldGhvZCArICc6JyArIHZhbHVlKSk7XG4gIH1cblxuICAvKipcbiAgICogQHR5cGVkZWYgQXV0aFRva2VuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IHRva2VuIC0gVG9rZW4gdmFsdWUuXG4gICAqIEBwcm9wZXJ0eSB7RGF0ZX0gZXhwaXJlcyAtIFRva2VuIGV4cGlyYXRpb24gdGltZS5cbiAgICovXG4gIC8qKlxuICAgKiBHZXQgc3RvcmVkIGF1dGhlbnRpY2F0aW9uIHRva2VuLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLkF1dGhUb2tlbn0gYXV0aGVudGljYXRpb24gdG9rZW4uXG4gICAqL1xuICBnZXRBdXRoVG9rZW4oKSB7XG4gICAgaWYgKHRoaXMuX2F1dGhUb2tlbiAmJiAodGhpcy5fYXV0aFRva2VuLmV4cGlyZXMuZ2V0VGltZSgpID4gRGF0ZS5ub3coKSkpIHtcbiAgICAgIHJldHVybiB0aGlzLl9hdXRoVG9rZW47XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2F1dGhUb2tlbiA9IG51bGw7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGxpY2F0aW9uIG1heSBwcm92aWRlIGEgc2F2ZWQgYXV0aGVudGljYXRpb24gdG9rZW4uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7VGlub2RlLkF1dGhUb2tlbn0gdG9rZW4gLSBhdXRoZW50aWNhdGlvbiB0b2tlbi5cbiAgICovXG4gIHNldEF1dGhUb2tlbih0b2tlbikge1xuICAgIHRoaXMuX2F1dGhUb2tlbiA9IHRva2VuO1xuICB9XG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIFNldFBhcmFtc1xuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBwcm9wZXJ0eSB7VGlub2RlLlNldERlc2M9fSBkZXNjIC0gVG9waWMgaW5pdGlhbGl6YXRpb24gcGFyYW1ldGVycyB3aGVuIGNyZWF0aW5nIGEgbmV3IHRvcGljIG9yIGEgbmV3IHN1YnNjcmlwdGlvbi5cbiAgICogQHByb3BlcnR5IHtUaW5vZGUuU2V0U3ViPX0gc3ViIC0gU3Vic2NyaXB0aW9uIGluaXRpYWxpemF0aW9uIHBhcmFtZXRlcnMuXG4gICAqIEBwcm9wZXJ0eSB7QXJyYXkuPHN0cmluZz49fSBhdHRhY2htZW50cyAtIFVSTHMgb2Ygb3V0IG9mIGJhbmQgYXR0YWNobWVudHMgdXNlZCBpbiBwYXJhbWV0ZXJzLlxuICAgKi9cbiAgLyoqXG4gICAqIEB0eXBlZGVmIFNldERlc2NcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAcHJvcGVydHkge1Rpbm9kZS5EZWZBY3M9fSBkZWZhY3MgLSBEZWZhdWx0IGFjY2VzcyBtb2RlLlxuICAgKiBAcHJvcGVydHkge09iamVjdD19IHB1YmxpYyAtIEZyZWUtZm9ybSB0b3BpYyBkZXNjcmlwdGlvbiwgcHVibGljYWxseSBhY2Nlc3NpYmxlLlxuICAgKiBAcHJvcGVydHkge09iamVjdD19IHByaXZhdGUgLSBGcmVlLWZvcm0gdG9waWMgZGVzY3JpcHRpb24gYWNjZXNzaWJsZSBvbmx5IHRvIHRoZSBvd25lci5cbiAgICogQHByb3BlcnR5IHtPYmplY3Q9fSB0cnVzdGVkIC0gVHJ1c3RlZCB1c2VyIGRhdGEgd2hpY2ggY2FuIGJlIHNldCBieSBhIHJvb3QgdXNlciBvbmx5LlxuICAgKi9cbiAgLyoqXG4gICAqIEB0eXBlZGVmIFNldFN1YlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nPX0gdXNlciAtIFVJRCBvZiB0aGUgdXNlciBhZmZlY3RlZCBieSB0aGUgcmVxdWVzdC4gRGVmYXVsdCAoZW1wdHkpIC0gY3VycmVudCB1c2VyLlxuICAgKiBAcHJvcGVydHkge3N0cmluZz19IG1vZGUgLSBVc2VyIGFjY2VzcyBtb2RlLCBlaXRoZXIgcmVxdWVzdGVkIG9yIGFzc2lnbmVkIGRlcGVuZGVudCBvbiBjb250ZXh0LlxuICAgKi9cbiAgLyoqXG4gICAqIFBhcmFtZXRlcnMgcGFzc2VkIHRvIHtAbGluayBUaW5vZGUjc3Vic2NyaWJlfS5cbiAgICpcbiAgICogQHR5cGVkZWYgU3Vic2NyaXB0aW9uUGFyYW1zXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHByb3BlcnR5IHtUaW5vZGUuU2V0UGFyYW1zPX0gc2V0IC0gUGFyYW1ldGVycyB1c2VkIHRvIGluaXRpYWxpemUgdG9waWNcbiAgICogQHByb3BlcnR5IHtUaW5vZGUuR2V0UXVlcnk9fSBnZXQgLSBRdWVyeSBmb3IgZmV0Y2hpbmcgZGF0YSBmcm9tIHRvcGljLlxuICAgKi9cblxuICAvKipcbiAgICogU2VuZCBhIHRvcGljIHN1YnNjcmlwdGlvbiByZXF1ZXN0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWMgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byBzdWJzY3JpYmUgdG8uXG4gICAqIEBwYXJhbSB7VGlub2RlLkdldFF1ZXJ5PX0gZ2V0UGFyYW1zIC0gT3B0aW9uYWwgc3Vic2NyaXB0aW9uIG1ldGFkYXRhIHF1ZXJ5XG4gICAqIEBwYXJhbSB7VGlub2RlLlNldFBhcmFtcz19IHNldFBhcmFtcyAtIE9wdGlvbmFsIGluaXRpYWxpemF0aW9uIHBhcmFtZXRlcnNcbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgc3Vic2NyaWJlKHRvcGljTmFtZSwgZ2V0UGFyYW1zLCBzZXRQYXJhbXMpIHtcbiAgICBjb25zdCBwa3QgPSB0aGlzLiNpbml0UGFja2V0KCdzdWInLCB0b3BpY05hbWUpXG4gICAgaWYgKCF0b3BpY05hbWUpIHtcbiAgICAgIHRvcGljTmFtZSA9IENvbnN0LlRPUElDX05FVztcbiAgICB9XG5cbiAgICBwa3Quc3ViLmdldCA9IGdldFBhcmFtcztcblxuICAgIGlmIChzZXRQYXJhbXMpIHtcbiAgICAgIGlmIChzZXRQYXJhbXMuc3ViKSB7XG4gICAgICAgIHBrdC5zdWIuc2V0LnN1YiA9IHNldFBhcmFtcy5zdWI7XG4gICAgICB9XG5cbiAgICAgIGlmIChzZXRQYXJhbXMuZGVzYykge1xuICAgICAgICBjb25zdCBkZXNjID0gc2V0UGFyYW1zLmRlc2M7XG4gICAgICAgIGlmIChUaW5vZGUuaXNOZXdHcm91cFRvcGljTmFtZSh0b3BpY05hbWUpKSB7XG4gICAgICAgICAgLy8gRnVsbCBzZXQuZGVzYyBwYXJhbXMgYXJlIHVzZWQgZm9yIG5ldyB0b3BpY3Mgb25seVxuICAgICAgICAgIHBrdC5zdWIuc2V0LmRlc2MgPSBkZXNjO1xuICAgICAgICB9IGVsc2UgaWYgKFRpbm9kZS5pc1AyUFRvcGljTmFtZSh0b3BpY05hbWUpICYmIGRlc2MuZGVmYWNzKSB7XG4gICAgICAgICAgLy8gVXNlIG9wdGlvbmFsIGRlZmF1bHQgcGVybWlzc2lvbnMgb25seS5cbiAgICAgICAgICBwa3Quc3ViLnNldC5kZXNjID0ge1xuICAgICAgICAgICAgZGVmYWNzOiBkZXNjLmRlZmFjc1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gU2VlIGlmIGV4dGVybmFsIG9iamVjdHMgd2VyZSB1c2VkIGluIHRvcGljIGRlc2NyaXB0aW9uLlxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoc2V0UGFyYW1zLmF0dGFjaG1lbnRzKSAmJiBzZXRQYXJhbXMuYXR0YWNobWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICBwa3QuZXh0cmEgPSB7XG4gICAgICAgICAgYXR0YWNobWVudHM6IHNldFBhcmFtcy5hdHRhY2htZW50cy5maWx0ZXIocmVmID0+IFRpbm9kZS5pc1JlbGF0aXZlVVJMKHJlZikpXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGlmIChzZXRQYXJhbXMudGFncykge1xuICAgICAgICBwa3Quc3ViLnNldC50YWdzID0gc2V0UGFyYW1zLnRhZ3M7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLiNzZW5kKHBrdCwgcGt0LnN1Yi5pZCk7XG4gIH1cblxuICAvKipcbiAgICogRGV0YWNoIGFuZCBvcHRpb25hbGx5IHVuc3Vic2NyaWJlIGZyb20gdGhlIHRvcGljXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpYyAtIFRvcGljIHRvIGRldGFjaCBmcm9tLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHVuc3ViIC0gSWYgPGNvZGU+dHJ1ZTwvY29kZT4sIGRldGFjaCBhbmQgdW5zdWJzY3JpYmUsIG90aGVyd2lzZSBqdXN0IGRldGFjaC5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgbGVhdmUodG9waWMsIHVuc3ViKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnbGVhdmUnLCB0b3BpYyk7XG4gICAgcGt0LmxlYXZlLnVuc3ViID0gdW5zdWI7XG5cbiAgICByZXR1cm4gdGhpcy4jc2VuZChwa3QsIHBrdC5sZWF2ZS5pZCk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIG1lc3NhZ2UgZHJhZnQgd2l0aG91dCBzZW5kaW5nIGl0IHRvIHRoZSBzZXJ2ZXIuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpYyAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIHB1Ymxpc2ggdG8uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZW50IC0gUGF5bG9hZCB0byBwdWJsaXNoLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBub0VjaG8gLSBJZiA8Y29kZT50cnVlPC9jb2RlPiwgdGVsbCB0aGUgc2VydmVyIG5vdCB0byBlY2hvIHRoZSBtZXNzYWdlIHRvIHRoZSBvcmlnaW5hbCBzZXNzaW9uLlxuICAgKlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBuZXcgbWVzc2FnZSB3aGljaCBjYW4gYmUgc2VudCB0byB0aGUgc2VydmVyIG9yIG90aGVyd2lzZSB1c2VkLlxuICAgKi9cbiAgY3JlYXRlTWVzc2FnZSh0b3BpYywgY29udGVudCwgbm9FY2hvKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgncHViJywgdG9waWMpO1xuXG4gICAgbGV0IGRmdCA9IHR5cGVvZiBjb250ZW50ID09ICdzdHJpbmcnID8gRHJhZnR5LnBhcnNlKGNvbnRlbnQpIDogY29udGVudDtcbiAgICBpZiAoZGZ0ICYmICFEcmFmdHkuaXNQbGFpblRleHQoZGZ0KSkge1xuICAgICAgcGt0LnB1Yi5oZWFkID0ge1xuICAgICAgICBtaW1lOiBEcmFmdHkuZ2V0Q29udGVudFR5cGUoKVxuICAgICAgfTtcbiAgICAgIGNvbnRlbnQgPSBkZnQ7XG4gICAgfVxuICAgIHBrdC5wdWIubm9lY2hvID0gbm9FY2hvO1xuICAgIHBrdC5wdWIuY29udGVudCA9IGNvbnRlbnQ7XG5cbiAgICByZXR1cm4gcGt0LnB1YjtcbiAgfVxuXG4gIC8qKlxuICAgKiBQdWJsaXNoIHtkYXRhfSBtZXNzYWdlIHRvIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gcHVibGlzaCB0by5cbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRlbnQgLSBQYXlsb2FkIHRvIHB1Ymxpc2guXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IG5vRWNobyAtIElmIDxjb2RlPnRydWU8L2NvZGU+LCB0ZWxsIHRoZSBzZXJ2ZXIgbm90IHRvIGVjaG8gdGhlIG1lc3NhZ2UgdG8gdGhlIG9yaWdpbmFsIHNlc3Npb24uXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIHB1Ymxpc2godG9waWNOYW1lLCBjb250ZW50LCBub0VjaG8pIHtcbiAgICByZXR1cm4gdGhpcy5wdWJsaXNoTWVzc2FnZShcbiAgICAgIHRoaXMuY3JlYXRlTWVzc2FnZSh0b3BpY05hbWUsIGNvbnRlbnQsIG5vRWNobylcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIFB1Ymxpc2ggbWVzc2FnZSB0byB0b3BpYy4gVGhlIG1lc3NhZ2Ugc2hvdWxkIGJlIGNyZWF0ZWQgYnkge0BsaW5rIFRpbm9kZSNjcmVhdGVNZXNzYWdlfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHB1YiAtIE1lc3NhZ2UgdG8gcHVibGlzaC5cbiAgICogQHBhcmFtIHtBcnJheS48c3RyaW5nPj19IGF0dGFjaG1lbnRzIC0gYXJyYXkgb2YgVVJMcyB3aXRoIGF0dGFjaG1lbnRzLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICBwdWJsaXNoTWVzc2FnZShwdWIsIGF0dGFjaG1lbnRzKSB7XG4gICAgLy8gTWFrZSBhIHNoYWxsb3cgY29weS4gTmVlZGVkIGluIG9yZGVyIHRvIGNsZWFyIGxvY2FsbHktYXNzaWduZWQgdGVtcCB2YWx1ZXM7XG4gICAgcHViID0gT2JqZWN0LmFzc2lnbih7fSwgcHViKTtcbiAgICBwdWIuc2VxID0gdW5kZWZpbmVkO1xuICAgIHB1Yi5mcm9tID0gdW5kZWZpbmVkO1xuICAgIHB1Yi50cyA9IHVuZGVmaW5lZDtcbiAgICBjb25zdCBtc2cgPSB7XG4gICAgICBwdWI6IHB1YixcbiAgICB9O1xuICAgIGlmIChhdHRhY2htZW50cykge1xuICAgICAgbXNnLmV4dHJhID0ge1xuICAgICAgICBhdHRhY2htZW50czogYXR0YWNobWVudHMuZmlsdGVyKHJlZiA9PiBUaW5vZGUuaXNSZWxhdGl2ZVVSTChyZWYpKVxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuI3NlbmQobXNnLCBwdWIuaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIE91dCBvZiBiYW5kIG5vdGlmaWNhdGlvbjogbm90aWZ5IHRvcGljIHRoYXQgYW4gZXh0ZXJuYWwgKHB1c2gpIG5vdGlmaWNhdGlvbiB3YXMgcmVjaXZlZCBieSB0aGUgY2xpZW50LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gZGF0YSAtIG5vdGlmaWNhdGlvbiBwYXlsb2FkLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZGF0YS53aGF0IC0gbm90aWZpY2F0aW9uIHR5cGUsICdtc2cnLCAncmVhZCcsICdzdWInLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZGF0YS50b3BpYyAtIG5hbWUgb2YgdGhlIHVwZGF0ZWQgdG9waWMuXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gZGF0YS5zZXEgLSBzZXEgSUQgb2YgdGhlIGFmZmVjdGVkIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gZGF0YS54ZnJvbSAtIFVJRCBvZiB0aGUgc2VuZGVyLlxuICAgKiBAcGFyYW0ge29iamVjdD19IGRhdGEuZ2l2ZW4gLSBuZXcgc3Vic2NyaXB0aW9uICdnaXZlbicsIGUuZy4gJ0FTV1AuLi4nLlxuICAgKiBAcGFyYW0ge29iamVjdD19IGRhdGEud2FudCAtIG5ldyBzdWJzY3JpcHRpb24gJ3dhbnQnLCBlLmcuICdSV0ouLi4nLlxuICAgKi9cbiAgb29iTm90aWZpY2F0aW9uKGRhdGEpIHtcbiAgICB0aGlzLmxvZ2dlcihcIm9vYjogXCIgKyAodGhpcy5fdHJpbUxvbmdTdHJpbmdzID8gSlNPTi5zdHJpbmdpZnkoZGF0YSwganNvbkxvZ2dlckhlbHBlcikgOiBkYXRhKSk7XG5cbiAgICBzd2l0Y2ggKGRhdGEud2hhdCkge1xuICAgICAgY2FzZSAnbXNnJzpcbiAgICAgICAgaWYgKCFkYXRhLnNlcSB8fCBkYXRhLnNlcSA8IDEgfHwgIWRhdGEudG9waWMpIHtcbiAgICAgICAgICAvLyBTZXJ2ZXIgc2VudCBpbnZhbGlkIGRhdGEuXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuaXNDb25uZWN0ZWQoKSkge1xuICAgICAgICAgIC8vIExldCdzIGlnbm9yZSB0aGUgbWVzc2FnZSBpcyB0aGVyZSBpcyBubyBjb25uZWN0aW9uOiBubyBjb25uZWN0aW9uIG1lYW5zIHRoZXJlIGFyZSBubyBvcGVuXG4gICAgICAgICAgLy8gdGFicyB3aXRoIFRpbm9kZS5cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRvcGljID0gdGhpcy4jY2FjaGVHZXQoJ3RvcGljJywgZGF0YS50b3BpYyk7XG4gICAgICAgIGlmICghdG9waWMpIHtcbiAgICAgICAgICAvLyBUT0RPOiBjaGVjayBpZiB0aGVyZSBpcyBhIGNhc2Ugd2hlbiBhIG1lc3NhZ2UgY2FuIGFycml2ZSBmcm9tIGFuIHVua25vd24gdG9waWMuXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodG9waWMuaXNTdWJzY3JpYmVkKCkpIHtcbiAgICAgICAgICAvLyBObyBuZWVkIHRvIGZldGNoOiB0b3BpYyBpcyBhbHJlYWR5IHN1YnNjcmliZWQgYW5kIGdvdCBkYXRhIHRocm91Z2ggbm9ybWFsIGNoYW5uZWwuXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodG9waWMubWF4TXNnU2VxKCkgPCBkYXRhLnNlcSkge1xuICAgICAgICAgIGlmICh0b3BpYy5pc0NoYW5uZWxUeXBlKCkpIHtcbiAgICAgICAgICAgIHRvcGljLl91cGRhdGVSZWNlaXZlZChkYXRhLnNlcSwgJ2Zha2UtdWlkJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gTmV3IG1lc3NhZ2UuXG4gICAgICAgICAgaWYgKGRhdGEueGZyb20gJiYgIXRoaXMuI2NhY2hlR2V0KCd1c2VyJywgZGF0YS54ZnJvbSkpIHtcbiAgICAgICAgICAgIC8vIE1lc3NhZ2UgZnJvbSB1bmtub3duIHNlbmRlciwgZmV0Y2ggZGVzY3JpcHRpb24gZnJvbSB0aGUgc2VydmVyLlxuICAgICAgICAgICAgLy8gU2VuZGluZyBhc3luY2hyb25vdXNseSB3aXRob3V0IGEgc3Vic2NyaXB0aW9uLlxuICAgICAgICAgICAgdGhpcy5nZXRNZXRhKGRhdGEueGZyb20sIG5ldyBNZXRhR2V0QnVpbGRlcigpLndpdGhEZXNjKCkuYnVpbGQoKSkuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5sb2dnZXIoXCJGYWlsZWQgdG8gZ2V0IHRoZSBuYW1lIG9mIGEgbmV3IHNlbmRlclwiLCBlcnIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdG9waWMuc3Vic2NyaWJlKG51bGwpLnRoZW4oXyA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdG9waWMuZ2V0TWV0YShuZXcgTWV0YUdldEJ1aWxkZXIodG9waWMpLndpdGhMYXRlckRhdGEoMjQpLndpdGhMYXRlckRlbCgyNCkuYnVpbGQoKSk7XG4gICAgICAgICAgfSkudGhlbihfID0+IHtcbiAgICAgICAgICAgIC8vIEFsbG93IGRhdGEgZmV0Y2ggdG8gY29tcGxldGUgYW5kIGdldCBwcm9jZXNzZWQgc3VjY2Vzc2Z1bGx5LlxuICAgICAgICAgICAgdG9waWMubGVhdmVEZWxheWVkKGZhbHNlLCAxMDAwKTtcbiAgICAgICAgICB9KS5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIoXCJPbiBwdXNoIGRhdGEgZmV0Y2ggZmFpbGVkXCIsIGVycik7XG4gICAgICAgICAgfSkuZmluYWxseShfID0+IHtcbiAgICAgICAgICAgIHRoaXMuZ2V0TWVUb3BpYygpLl9yZWZyZXNoQ29udGFjdCgnbXNnJywgdG9waWMpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdyZWFkJzpcbiAgICAgICAgdGhpcy5nZXRNZVRvcGljKCkuX3JvdXRlUHJlcyh7XG4gICAgICAgICAgd2hhdDogJ3JlYWQnLFxuICAgICAgICAgIHNlcTogZGF0YS5zZXFcbiAgICAgICAgfSk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdzdWInOlxuICAgICAgICBpZiAoIXRoaXMuaXNNZShkYXRhLnhmcm9tKSkge1xuICAgICAgICAgIC8vIFRPRE86IGhhbmRsZSB1cGRhdGVzIGZyb20gb3RoZXIgdXNlcnMuXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbW9kZSA9IHtcbiAgICAgICAgICBnaXZlbjogZGF0YS5tb2RlR2l2ZW4sXG4gICAgICAgICAgd2FudDogZGF0YS5tb2RlV2FudFxuICAgICAgICB9O1xuICAgICAgICBsZXQgYWNzID0gbmV3IEFjY2Vzc01vZGUobW9kZSk7XG4gICAgICAgIGxldCBwcmVzID0gKCFhY3MubW9kZSB8fCBhY3MubW9kZSA9PSBBY2Nlc3NNb2RlLl9OT05FKSA/XG4gICAgICAgICAgLy8gU3Vic2NyaXB0aW9uIGRlbGV0ZWQuXG4gICAgICAgICAge1xuICAgICAgICAgICAgd2hhdDogJ2dvbmUnLFxuICAgICAgICAgICAgc3JjOiBkYXRhLnRvcGljXG4gICAgICAgICAgfSA6XG4gICAgICAgICAgLy8gTmV3IHN1YnNjcmlwdGlvbiBvciBzdWJzY3JpcHRpb24gdXBkYXRlZC5cbiAgICAgICAgICB7XG4gICAgICAgICAgICB3aGF0OiAnYWNzJyxcbiAgICAgICAgICAgIHNyYzogZGF0YS50b3BpYyxcbiAgICAgICAgICAgIGRhY3M6IG1vZGVcbiAgICAgICAgICB9O1xuICAgICAgICB0aGlzLmdldE1lVG9waWMoKS5fcm91dGVQcmVzKHByZXMpO1xuICAgICAgICBicmVhaztcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5sb2dnZXIoXCJVbmtub3duIHB1c2ggdHlwZSBpZ25vcmVkXCIsIGRhdGEud2hhdCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIEdldFF1ZXJ5XG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHByb3BlcnR5IHtUaW5vZGUuR2V0T3B0c1R5cGU9fSBkZXNjIC0gSWYgcHJvdmlkZWQgKGV2ZW4gaWYgZW1wdHkpLCBmZXRjaCB0b3BpYyBkZXNjcmlwdGlvbi5cbiAgICogQHByb3BlcnR5IHtUaW5vZGUuR2V0T3B0c1R5cGU9fSBzdWIgLSBJZiBwcm92aWRlZCAoZXZlbiBpZiBlbXB0eSksIGZldGNoIHRvcGljIHN1YnNjcmlwdGlvbnMuXG4gICAqIEBwcm9wZXJ0eSB7VGlub2RlLkdldERhdGFUeXBlPX0gZGF0YSAtIElmIHByb3ZpZGVkIChldmVuIGlmIGVtcHR5KSwgZ2V0IG1lc3NhZ2VzLlxuICAgKi9cblxuICAvKipcbiAgICogQHR5cGVkZWYgR2V0T3B0c1R5cGVcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAcHJvcGVydHkge0RhdGU9fSBpbXMgLSBcIklmIG1vZGlmaWVkIHNpbmNlXCIsIGZldGNoIGRhdGEgb25seSBpdCB3YXMgd2FzIG1vZGlmaWVkIHNpbmNlIHN0YXRlZCBkYXRlLlxuICAgKiBAcHJvcGVydHkge251bWJlcj19IGxpbWl0IC0gTWF4aW11bSBudW1iZXIgb2YgcmVzdWx0cyB0byByZXR1cm4uIElnbm9yZWQgd2hlbiBxdWVyeWluZyB0b3BpYyBkZXNjcmlwdGlvbi5cbiAgICovXG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIEdldERhdGFUeXBlXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHByb3BlcnR5IHtudW1iZXI9fSBzaW5jZSAtIExvYWQgbWVzc2FnZXMgd2l0aCBzZXEgaWQgZXF1YWwgb3IgZ3JlYXRlciB0aGFuIHRoaXMgdmFsdWUuXG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyPX0gYmVmb3JlIC0gTG9hZCBtZXNzYWdlcyB3aXRoIHNlcSBpZCBsb3dlciB0aGFuIHRoaXMgbnVtYmVyLlxuICAgKiBAcHJvcGVydHkge251bWJlcj19IGxpbWl0IC0gTWF4aW11bSBudW1iZXIgb2YgcmVzdWx0cyB0byByZXR1cm4uXG4gICAqL1xuXG4gIC8qKlxuICAgKiBSZXF1ZXN0IHRvcGljIG1ldGFkYXRhXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpYyAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIHF1ZXJ5LlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5HZXRRdWVyeX0gcGFyYW1zIC0gUGFyYW1ldGVycyBvZiB0aGUgcXVlcnkuIFVzZSB7QGxpbmsgVGlub2RlLk1ldGFHZXRCdWlsZGVyfSB0byBnZW5lcmF0ZS5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgZ2V0TWV0YSh0b3BpYywgcGFyYW1zKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnZ2V0JywgdG9waWMpO1xuXG4gICAgcGt0LmdldCA9IG1lcmdlT2JqKHBrdC5nZXQsIHBhcmFtcyk7XG5cbiAgICByZXR1cm4gdGhpcy4jc2VuZChwa3QsIHBrdC5nZXQuaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSB0b3BpYydzIG1ldGFkYXRhOiBkZXNjcmlwdGlvbiwgc3Vic2NyaWJ0aW9ucy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljIC0gVG9waWMgdG8gdXBkYXRlLlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5TZXRQYXJhbXN9IHBhcmFtcyAtIHRvcGljIG1ldGFkYXRhIHRvIHVwZGF0ZS5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgc2V0TWV0YSh0b3BpYywgcGFyYW1zKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy4jaW5pdFBhY2tldCgnc2V0JywgdG9waWMpO1xuICAgIGNvbnN0IHdoYXQgPSBbXTtcblxuICAgIGlmIChwYXJhbXMpIHtcbiAgICAgIFsnZGVzYycsICdzdWInLCAndGFncycsICdjcmVkJywgJ2VwaGVtZXJhbCddLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIGlmIChwYXJhbXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgIHdoYXQucHVzaChrZXkpO1xuICAgICAgICAgIHBrdC5zZXRba2V5XSA9IHBhcmFtc1trZXldO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkocGFyYW1zLmF0dGFjaG1lbnRzKSAmJiBwYXJhbXMuYXR0YWNobWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICBwa3QuZXh0cmEgPSB7XG4gICAgICAgICAgYXR0YWNobWVudHM6IHBhcmFtcy5hdHRhY2htZW50cy5maWx0ZXIocmVmID0+IFRpbm9kZS5pc1JlbGF0aXZlVVJMKHJlZikpXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHdoYXQubGVuZ3RoID09IDApIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJJbnZhbGlkIHtzZXR9IHBhcmFtZXRlcnNcIikpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLiNzZW5kKHBrdCwgcGt0LnNldC5pZCk7XG4gIH1cblxuICAvKipcbiAgICogUmFuZ2Ugb2YgbWVzc2FnZSBJRHMgdG8gZGVsZXRlLlxuICAgKlxuICAgKiBAdHlwZWRlZiBEZWxSYW5nZVxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBsb3cgLSBsb3cgZW5kIG9mIHRoZSByYW5nZSwgaW5jbHVzaXZlIChjbG9zZWQpLlxuICAgKiBAcHJvcGVydHkge251bWJlcj19IGhpIC0gaGlnaCBlbmQgb2YgdGhlIHJhbmdlLCBleGNsdXNpdmUgKG9wZW4pLlxuICAgKi9cbiAgLyoqXG4gICAqIERlbGV0ZSBzb21lIG9yIGFsbCBtZXNzYWdlcyBpbiBhIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWMgLSBUb3BpYyBuYW1lIHRvIGRlbGV0ZSBtZXNzYWdlcyBmcm9tLlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5EZWxSYW5nZVtdfSBsaXN0IC0gUmFuZ2VzIG9mIG1lc3NhZ2UgSURzIHRvIGRlbGV0ZS5cbiAgICogQHBhcmFtIHtib29sZWFuPX0gaGFyZCAtIEhhcmQgb3Igc29mdCBkZWxldGVcbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgZGVsTWVzc2FnZXModG9waWMsIHJhbmdlcywgaGFyZCkge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ2RlbCcsIHRvcGljKTtcblxuICAgIHBrdC5kZWwud2hhdCA9ICdtc2cnO1xuICAgIHBrdC5kZWwuZGVsc2VxID0gcmFuZ2VzO1xuICAgIHBrdC5kZWwuaGFyZCA9IGhhcmQ7XG5cbiAgICByZXR1cm4gdGhpcy4jc2VuZChwa3QsIHBrdC5kZWwuaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlbGV0ZSB0aGUgdG9waWMgYWxsdG9nZXRoZXIuIFJlcXVpcmVzIE93bmVyIHBlcm1pc3Npb24uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byBkZWxldGVcbiAgICogQHBhcmFtIHtib29sZWFufSBoYXJkIC0gaGFyZC1kZWxldGUgdG9waWMuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIGRlbFRvcGljKHRvcGljTmFtZSwgaGFyZCkge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ2RlbCcsIHRvcGljTmFtZSk7XG4gICAgcGt0LmRlbC53aGF0ID0gJ3RvcGljJztcbiAgICBwa3QuZGVsLmhhcmQgPSBoYXJkO1xuXG4gICAgcmV0dXJuIHRoaXMuI3NlbmQocGt0LCBwa3QuZGVsLmlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxldGUgc3Vic2NyaXB0aW9uLiBSZXF1aXJlcyBTaGFyZSBwZXJtaXNzaW9uLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gZGVsZXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1c2VyIC0gVXNlciBJRCB0byByZW1vdmUuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIGRlbFN1YnNjcmlwdGlvbih0b3BpY05hbWUsIHVzZXIpIHtcbiAgICBjb25zdCBwa3QgPSB0aGlzLiNpbml0UGFja2V0KCdkZWwnLCB0b3BpY05hbWUpO1xuICAgIHBrdC5kZWwud2hhdCA9ICdzdWInO1xuICAgIHBrdC5kZWwudXNlciA9IHVzZXI7XG5cbiAgICByZXR1cm4gdGhpcy4jc2VuZChwa3QsIHBrdC5kZWwuaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlbGV0ZSBjcmVkZW50aWFsLiBBbHdheXMgc2VudCBvbiA8Y29kZT4nbWUnPC9jb2RlPiB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1ldGhvZCAtIHZhbGlkYXRpb24gbWV0aG9kIHN1Y2ggYXMgPGNvZGU+J2VtYWlsJzwvY29kZT4gb3IgPGNvZGU+J3RlbCc8L2NvZGU+LlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgLSB2YWxpZGF0aW9uIHZhbHVlLCBpLmUuIDxjb2RlPidhbGljZUBleGFtcGxlLmNvbSc8L2NvZGU+LlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICBkZWxDcmVkZW50aWFsKG1ldGhvZCwgdmFsdWUpIHtcbiAgICBjb25zdCBwa3QgPSB0aGlzLiNpbml0UGFja2V0KCdkZWwnLCBDb25zdC5UT1BJQ19NRSk7XG4gICAgcGt0LmRlbC53aGF0ID0gJ2NyZWQnO1xuICAgIHBrdC5kZWwuY3JlZCA9IHtcbiAgICAgIG1ldGg6IG1ldGhvZCxcbiAgICAgIHZhbDogdmFsdWVcbiAgICB9O1xuXG4gICAgcmV0dXJuIHRoaXMuI3NlbmQocGt0LCBwa3QuZGVsLmlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXF1ZXN0IHRvIGRlbGV0ZSBhY2NvdW50IG9mIHRoZSBjdXJyZW50IHVzZXIuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gaGFyZCAtIGhhcmQtZGVsZXRlIHVzZXIuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIGRlbEN1cnJlbnRVc2VyKGhhcmQpIHtcbiAgICBjb25zdCBwa3QgPSB0aGlzLiNpbml0UGFja2V0KCdkZWwnLCBudWxsKTtcbiAgICBwa3QuZGVsLndoYXQgPSAndXNlcic7XG4gICAgcGt0LmRlbC5oYXJkID0gaGFyZDtcblxuICAgIHJldHVybiB0aGlzLiNzZW5kKHBrdCwgcGt0LmRlbC5pZCkudGhlbigoY3RybCkgPT4ge1xuICAgICAgdGhpcy5fbXlVSUQgPSBudWxsO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIE5vdGlmeSBzZXJ2ZXIgdGhhdCBhIG1lc3NhZ2Ugb3IgbWVzc2FnZXMgd2VyZSByZWFkIG9yIHJlY2VpdmVkLiBEb2VzIE5PVCByZXR1cm4gcHJvbWlzZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHdoZXJlIHRoZSBtZXNhZ2UgaXMgYmVpbmcgYWtub3dsZWRnZWQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB3aGF0IC0gQWN0aW9uIGJlaW5nIGFrbm93bGVkZ2VkLCBlaXRoZXIgPGNvZGU+XCJyZWFkXCI8L2NvZGU+IG9yIDxjb2RlPlwicmVjdlwiPC9jb2RlPi5cbiAgICogQHBhcmFtIHtudW1iZXJ9IHNlcSAtIE1heGltdW0gaWQgb2YgdGhlIG1lc3NhZ2UgYmVpbmcgYWNrbm93bGVkZ2VkLlxuICAgKi9cbiAgbm90ZSh0b3BpY05hbWUsIHdoYXQsIHNlcSkge1xuICAgIGlmIChzZXEgPD0gMCB8fCBzZXEgPj0gQ29uc3QuTE9DQUxfU0VRSUQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBtZXNzYWdlIGlkICR7c2VxfWApO1xuICAgIH1cblxuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ25vdGUnLCB0b3BpY05hbWUpO1xuICAgIHBrdC5ub3RlLndoYXQgPSB3aGF0O1xuICAgIHBrdC5ub3RlLnNlcSA9IHNlcTtcbiAgICB0aGlzLiNzZW5kKHBrdCk7XG4gIH1cblxuICAvKipcbiAgICogQnJvYWRjYXN0IGEga2V5LXByZXNzIG5vdGlmaWNhdGlvbiB0byB0b3BpYyBzdWJzY3JpYmVycy4gVXNlZCB0byBzaG93XG4gICAqIHR5cGluZyBub3RpZmljYXRpb25zIFwidXNlciBYIGlzIHR5cGluZy4uLlwiLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gYnJvYWRjYXN0IHRvLlxuICAgKi9cbiAgbm90ZUtleVByZXNzKHRvcGljTmFtZSkge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuI2luaXRQYWNrZXQoJ25vdGUnLCB0b3BpY05hbWUpO1xuICAgIHBrdC5ub3RlLndoYXQgPSAna3AnO1xuICAgIHRoaXMuI3NlbmQocGt0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIGEgdmlkZW8gY2FsbCBub3RpZmljYXRpb24gdG8gdG9waWMgc3Vic2NyaWJlcnMgKGluY2x1ZGluZyBkaWFsaW5nLFxuICAgKiBoYW5ndXAsIGV0Yy4pLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gYnJvYWRjYXN0IHRvLlxuICAgKiBAcGFyYW0ge2ludH0gc2VxIC0gSUQgb2YgdGhlIGNhbGwgbWVzc2FnZSB0aGUgZXZlbnQgcGVydGFpbnMgdG8uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldnQgLSBDYWxsIGV2ZW50LlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGF5bG9hZCAtIFBheWxvYWQgYXNzb2NpYXRlZCB3aXRoIHRoaXMgZXZlbnQgKGUuZy4gU0RQIHN0cmluZykuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIChmb3Igc29tZSBjYWxsIGV2ZW50cykgd2hpY2ggd2lsbFxuICAgKiAgICAgICAgICAgICAgICAgICAgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseVxuICAgKi9cbiAgdmlkZW9DYWxsKHRvcGljTmFtZSwgc2VxLCBldnQsIHBheWxvYWQpIHtcbiAgICBjb25zdCBwa3QgPSB0aGlzLiNpbml0UGFja2V0KCdub3RlJywgdG9waWNOYW1lKTtcbiAgICBwa3Qubm90ZS5zZXEgPSBzZXE7XG4gICAgcGt0Lm5vdGUud2hhdCA9ICdjYWxsJztcbiAgICBwa3Qubm90ZS5ldmVudCA9IGV2dDtcbiAgICBwa3Qubm90ZS5wYXlsb2FkID0gcGF5bG9hZDtcbiAgICB0aGlzLiNzZW5kKHBrdCwgcGt0Lm5vdGUuaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhIG5hbWVkIHRvcGljLCBlaXRoZXIgcHVsbCBpdCBmcm9tIGNhY2hlIG9yIGNyZWF0ZSBhIG5ldyBpbnN0YW5jZS5cbiAgICogVGhlcmUgaXMgYSBzaW5nbGUgaW5zdGFuY2Ugb2YgdG9waWMgZm9yIGVhY2ggbmFtZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIGdldC5cbiAgICogQHJldHVybnMge1Rpbm9kZS5Ub3BpY30gUmVxdWVzdGVkIG9yIG5ld2x5IGNyZWF0ZWQgdG9waWMgb3IgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPiBpZiB0b3BpYyBuYW1lIGlzIGludmFsaWQuXG4gICAqL1xuICBnZXRUb3BpYyh0b3BpY05hbWUpIHtcbiAgICBsZXQgdG9waWMgPSB0aGlzLiNjYWNoZUdldCgndG9waWMnLCB0b3BpY05hbWUpO1xuICAgIGlmICghdG9waWMgJiYgdG9waWNOYW1lKSB7XG4gICAgICBpZiAodG9waWNOYW1lID09IENvbnN0LlRPUElDX01FKSB7XG4gICAgICAgIHRvcGljID0gbmV3IFRvcGljTWUoKTtcbiAgICAgIH0gZWxzZSBpZiAodG9waWNOYW1lID09IENvbnN0LlRPUElDX0ZORCkge1xuICAgICAgICB0b3BpYyA9IG5ldyBUb3BpY0ZuZCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdG9waWMgPSBuZXcgVG9waWModG9waWNOYW1lKTtcbiAgICAgIH1cbiAgICAgIC8vIENhY2hlIG1hbmFnZW1lbnQuXG4gICAgICB0aGlzLiNhdHRhY2hDYWNoZVRvVG9waWModG9waWMpO1xuICAgICAgdG9waWMuX2NhY2hlUHV0U2VsZigpO1xuICAgICAgLy8gRG9uJ3Qgc2F2ZSB0byBEQiBoZXJlOiBhIHJlY29yZCB3aWxsIGJlIGFkZGVkIHdoZW4gdGhlIHRvcGljIGlzIHN1YnNjcmliZWQuXG4gICAgfVxuICAgIHJldHVybiB0b3BpYztcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYSBuYW1lZCB0b3BpYyBmcm9tIGNhY2hlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gZ2V0LlxuICAgKiBAcmV0dXJucyB7VGlub2RlLlRvcGljfSBSZXF1ZXN0ZWQgdG9waWMgb3IgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPiBpZiB0b3BpYyBpcyBub3QgZm91bmQgaW4gY2FjaGUuXG4gICAqL1xuICBjYWNoZUdldFRvcGljKHRvcGljTmFtZSkge1xuICAgIHJldHVybiB0aGlzLiNjYWNoZUdldCgndG9waWMnLCB0b3BpY05hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBuYW1lZCB0b3BpYyBmcm9tIGNhY2hlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gcmVtb3ZlIGZyb20gY2FjaGUuXG4gICAqL1xuICBjYWNoZVJlbVRvcGljKHRvcGljTmFtZSkge1xuICAgIHRoaXMuI2NhY2hlRGVsKCd0b3BpYycsIHRvcGljTmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogSXRlcmF0ZSBvdmVyIGNhY2hlZCB0b3BpY3MuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgLSBjYWxsYmFjayB0byBjYWxsIGZvciBlYWNoIHRvcGljLlxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCAtICd0aGlzJyBpbnNpZGUgdGhlICdmdW5jJy5cbiAgICovXG4gIG1hcFRvcGljcyhmdW5jLCBjb250ZXh0KSB7XG4gICAgdGhpcy4jY2FjaGVNYXAoJ3RvcGljJywgZnVuYywgY29udGV4dCk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgbmFtZWQgdG9waWMgaXMgYWxyZWFkeSBwcmVzZW50IGluIGNhY2hlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIHRvcGljIGlzIGZvdW5kIGluIGNhY2hlLCBmYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICBpc1RvcGljQ2FjaGVkKHRvcGljTmFtZSkge1xuICAgIHJldHVybiAhIXRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIHRvcGljTmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGUgdW5pcXVlIG5hbWUgbGlrZSA8Y29kZT4nbmV3MTIzNDU2JzwvY29kZT4gc3VpdGFibGUgZm9yIGNyZWF0aW5nIGEgbmV3IGdyb3VwIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGlzQ2hhbiAtIGlmIHRoZSB0b3BpYyBpcyBjaGFubmVsLWVuYWJsZWQuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IG5hbWUgd2hpY2ggY2FuIGJlIHVzZWQgZm9yIGNyZWF0aW5nIGEgbmV3IGdyb3VwIHRvcGljLlxuICAgKi9cbiAgbmV3R3JvdXBUb3BpY05hbWUoaXNDaGFuKSB7XG4gICAgcmV0dXJuIChpc0NoYW4gPyBDb25zdC5UT1BJQ19ORVdfQ0hBTiA6IENvbnN0LlRPUElDX05FVykgKyB0aGlzLmdldE5leHRVbmlxdWVJZCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluc3RhbnRpYXRlIDxjb2RlPidtZSc8L2NvZGU+IHRvcGljIG9yIGdldCBpdCBmcm9tIGNhY2hlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLlRvcGljTWV9IEluc3RhbmNlIG9mIDxjb2RlPidtZSc8L2NvZGU+IHRvcGljLlxuICAgKi9cbiAgZ2V0TWVUb3BpYygpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRUb3BpYyhDb25zdC5UT1BJQ19NRSk7XG4gIH1cblxuICAvKipcbiAgICogSW5zdGFudGlhdGUgPGNvZGU+J2ZuZCc8L2NvZGU+IChmaW5kKSB0b3BpYyBvciBnZXQgaXQgZnJvbSBjYWNoZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5Ub3BpY30gSW5zdGFuY2Ugb2YgPGNvZGU+J2ZuZCc8L2NvZGU+IHRvcGljLlxuICAgKi9cbiAgZ2V0Rm5kVG9waWMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VG9waWMoQ29uc3QuVE9QSUNfRk5EKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcge0BsaW5rIExhcmdlRmlsZUhlbHBlcn0gaW5zdGFuY2VcbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5MYXJnZUZpbGVIZWxwZXJ9IGluc3RhbmNlIG9mIGEge0BsaW5rIFRpbm9kZS5MYXJnZUZpbGVIZWxwZXJ9LlxuICAgKi9cbiAgZ2V0TGFyZ2VGaWxlSGVscGVyKCkge1xuICAgIHJldHVybiBuZXcgTGFyZ2VGaWxlSGVscGVyKHRoaXMsIENvbnN0LlBST1RPQ09MX1ZFUlNJT04pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgVUlEIG9mIHRoZSB0aGUgY3VycmVudCBhdXRoZW50aWNhdGVkIHVzZXIuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFVJRCBvZiB0aGUgY3VycmVudCB1c2VyIG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4gaWYgdGhlIHNlc3Npb24gaXMgbm90IHlldCBhdXRoZW50aWNhdGVkIG9yIGlmIHRoZXJlIGlzIG5vIHNlc3Npb24uXG4gICAqL1xuICBnZXRDdXJyZW50VXNlcklEKCkge1xuICAgIHJldHVybiB0aGlzLl9teVVJRDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgZ2l2ZW4gdXNlciBJRCBpcyBlcXVhbCB0byB0aGUgY3VycmVudCB1c2VyJ3MgVUlELlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gVUlEIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGUgZ2l2ZW4gVUlEIGJlbG9uZ3MgdG8gdGhlIGN1cnJlbnQgbG9nZ2VkIGluIHVzZXIuXG4gICAqL1xuICBpc01lKHVpZCkge1xuICAgIHJldHVybiB0aGlzLl9teVVJRCA9PT0gdWlkO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBsb2dpbiB1c2VkIGZvciBsYXN0IHN1Y2Nlc3NmdWwgYXV0aGVudGljYXRpb24uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IGxvZ2luIGxhc3QgdXNlZCBzdWNjZXNzZnVsbHkgb3IgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPi5cbiAgICovXG4gIGdldEN1cnJlbnRMb2dpbigpIHtcbiAgICByZXR1cm4gdGhpcy5fbG9naW47XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGluZm9ybWF0aW9uIGFib3V0IHRoZSBzZXJ2ZXI6IHByb3RvY29sIHZlcnNpb24gYW5kIGJ1aWxkIHRpbWVzdGFtcC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICogQHJldHVybnMge09iamVjdH0gYnVpbGQgYW5kIHZlcnNpb24gb2YgdGhlIHNlcnZlciBvciA8Y29kZT5udWxsPC9jb2RlPiBpZiB0aGVyZSBpcyBubyBjb25uZWN0aW9uIG9yIGlmIHRoZSBmaXJzdCBzZXJ2ZXIgcmVzcG9uc2UgaGFzIG5vdCBiZWVuIHJlY2VpdmVkIHlldC5cbiAgICovXG4gIGdldFNlcnZlckluZm8oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NlcnZlckluZm87XG4gIH1cblxuICAvKipcbiAgICogUmVwb3J0IGEgdG9waWMgZm9yIGFidXNlLiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI3B1Ymxpc2h9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gYWN0aW9uIC0gdGhlIG9ubHkgc3VwcG9ydGVkIGFjdGlvbiBpcyAncmVwb3J0Jy5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHRhcmdldCAtIG5hbWUgb2YgdGhlIHRvcGljIGJlaW5nIHJlcG9ydGVkLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gcmVxdWVzdC5cbiAgICovXG4gIHJlcG9ydChhY3Rpb24sIHRhcmdldCkge1xuICAgIHJldHVybiB0aGlzLnB1Ymxpc2goQ29uc3QuVE9QSUNfU1lTLCBEcmFmdHkuYXR0YWNoSlNPTihudWxsLCB7XG4gICAgICAnYWN0aW9uJzogYWN0aW9uLFxuICAgICAgJ3RhcmdldCc6IHRhcmdldFxuICAgIH0pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gc2VydmVyLXByb3ZpZGVkIGNvbmZpZ3VyYXRpb24gdmFsdWUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIG9mIHRoZSB2YWx1ZSB0byByZXR1cm4uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkZWZhdWx0VmFsdWUgdG8gcmV0dXJuIGluIGNhc2UgdGhlIHBhcmFtZXRlciBpcyBub3Qgc2V0IG9yIG5vdCBmb3VuZC5cbiAgICogQHJldHVybnMge09iamVjdH0gbmFtZWQgdmFsdWUuXG4gICAqL1xuICBnZXRTZXJ2ZXJQYXJhbShuYW1lLCBkZWZhdWx0VmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5fc2VydmVySW5mbyAmJiB0aGlzLl9zZXJ2ZXJJbmZvW25hbWVdIHx8IGRlZmF1bHRWYWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGUgY29uc29sZSBsb2dnaW5nLiBMb2dnaW5nIGlzIG9mZiBieSBkZWZhdWx0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZWQgLSBTZXQgdG8gPGNvZGU+dHJ1ZTwvY29kZT4gdG8gZW5hYmxlIGxvZ2dpbmcgdG8gY29uc29sZS5cbiAgICogQHBhcmFtIHtib29sZWFufSB0cmltTG9uZ1N0cmluZ3MgLSBTZXQgdG8gPGNvZGU+dHJ1ZTwvY29kZT4gdG8gdHJpbSBsb25nIHN0cmluZ3MuXG4gICAqL1xuICBlbmFibGVMb2dnaW5nKGVuYWJsZWQsIHRyaW1Mb25nU3RyaW5ncykge1xuICAgIHRoaXMuX2xvZ2dpbmdFbmFibGVkID0gZW5hYmxlZDtcbiAgICB0aGlzLl90cmltTG9uZ1N0cmluZ3MgPSBlbmFibGVkICYmIHRyaW1Mb25nU3RyaW5ncztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgVUkgbGFuZ3VhZ2UgdG8gcmVwb3J0IHRvIHRoZSBzZXJ2ZXIuIE11c3QgYmUgY2FsbGVkIGJlZm9yZSA8Y29kZT4naGknPC9jb2RlPiBpcyBzZW50LCBvdGhlcndpc2UgaXQgd2lsbCBub3QgYmUgdXNlZC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGhsIC0gaHVtYW4gKFVJKSBsYW5ndWFnZSwgbGlrZSA8Y29kZT5cImVuX1VTXCI8L2NvZGU+IG9yIDxjb2RlPlwiemgtSGFuc1wiPC9jb2RlPi5cbiAgICovXG4gIHNldEh1bWFuTGFuZ3VhZ2UoaGwpIHtcbiAgICBpZiAoaGwpIHtcbiAgICAgIHRoaXMuX2h1bWFuTGFuZ3VhZ2UgPSBobDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgZ2l2ZW4gdG9waWMgaXMgb25saW5lLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBvZiB0aGUgdG9waWMgdG8gdGVzdC5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdG9waWMgaXMgb25saW5lLCBmYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICBpc1RvcGljT25saW5lKG5hbWUpIHtcbiAgICBjb25zdCB0b3BpYyA9IHRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIG5hbWUpO1xuICAgIHJldHVybiB0b3BpYyAmJiB0b3BpYy5vbmxpbmU7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGFjY2VzcyBtb2RlIGZvciB0aGUgZ2l2ZW4gY29udGFjdC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgb2YgdGhlIHRvcGljIHRvIHF1ZXJ5LlxuICAgKiBAcmV0dXJucyB7QWNjZXNzTW9kZX0gYWNjZXNzIG1vZGUgaWYgdG9waWMgaXMgZm91bmQsIG51bGwgb3RoZXJ3aXNlLlxuICAgKi9cbiAgZ2V0VG9waWNBY2Nlc3NNb2RlKG5hbWUpIHtcbiAgICBjb25zdCB0b3BpYyA9IHRoaXMuI2NhY2hlR2V0KCd0b3BpYycsIG5hbWUpO1xuICAgIHJldHVybiB0b3BpYyA/IHRvcGljLmFjcyA6IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogSW5jbHVkZSBtZXNzYWdlIElEIGludG8gYWxsIHN1YnNlcXVlc3QgbWVzc2FnZXMgdG8gc2VydmVyIGluc3RydWN0aW4gaXQgdG8gc2VuZCBha25vd2xlZGdlbWVucy5cbiAgICogUmVxdWlyZWQgZm9yIHByb21pc2VzIHRvIGZ1bmN0aW9uLiBEZWZhdWx0IGlzIDxjb2RlPlwib25cIjwvY29kZT4uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gc3RhdHVzIC0gVHVybiBha25vd2xlZGdlbWVucyBvbiBvciBvZmYuXG4gICAqIEBkZXByZWNhdGVkXG4gICAqL1xuICB3YW50QWtuKHN0YXR1cykge1xuICAgIGlmIChzdGF0dXMpIHtcbiAgICAgIHRoaXMuX21lc3NhZ2VJZCA9IE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiAweEZGRkZGRikgKyAweEZGRkZGRik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX21lc3NhZ2VJZCA9IDA7XG4gICAgfVxuICB9XG5cbiAgLy8gQ2FsbGJhY2tzOlxuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gcmVwb3J0IHdoZW4gdGhlIHdlYnNvY2tldCBpcyBvcGVuZWQuIFRoZSBjYWxsYmFjayBoYXMgbm8gcGFyYW1ldGVycy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICogQHR5cGUge1Rpbm9kZS5vbldlYnNvY2tldE9wZW59XG4gICAqL1xuICBvbldlYnNvY2tldE9wZW4gPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIFRpbm9kZS5TZXJ2ZXJQYXJhbXNcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJvcGVydHkge3N0cmluZ30gdmVyIC0gU2VydmVyIHZlcnNpb25cbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IGJ1aWxkIC0gU2VydmVyIGJ1aWxkXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nPX0gc2lkIC0gU2Vzc2lvbiBJRCwgbG9uZyBwb2xsaW5nIGNvbm5lY3Rpb25zIG9ubHkuXG4gICAqL1xuXG4gIC8qKlxuICAgKiBAY2FsbGJhY2sgVGlub2RlLm9uQ29ubmVjdFxuICAgKiBAcGFyYW0ge251bWJlcn0gY29kZSAtIFJlc3VsdCBjb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IC0gVGV4dCBlcHhwbGFpbmluZyB0aGUgY29tcGxldGlvbiwgaS5lIFwiT0tcIiBvciBhbiBlcnJvciBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5TZXJ2ZXJQYXJhbXN9IHBhcmFtcyAtIFBhcmFtZXRlcnMgcmV0dXJuZWQgYnkgdGhlIHNlcnZlci5cbiAgICovXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0byByZXBvcnQgd2hlbiBjb25uZWN0aW9uIHdpdGggVGlub2RlIHNlcnZlciBpcyBlc3RhYmxpc2hlZC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICogQHR5cGUge1Rpbm9kZS5vbkNvbm5lY3R9XG4gICAqL1xuICBvbkNvbm5lY3QgPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIHRvIHJlcG9ydCB3aGVuIGNvbm5lY3Rpb24gaXMgbG9zdC4gVGhlIGNhbGxiYWNrIGhhcyBubyBwYXJhbWV0ZXJzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKiBAdHlwZSB7VGlub2RlLm9uRGlzY29ubmVjdH1cbiAgICovXG4gIG9uRGlzY29ubmVjdCA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQGNhbGxiYWNrIFRpbm9kZS5vbkxvZ2luXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBjb2RlIC0gTlVtZXJpYyBjb21wbGV0aW9uIGNvZGUsIHNhbWUgYXMgSFRUUCBzdGF0dXMgY29kZXMuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IC0gRXhwbGFuYXRpb24gb2YgdGhlIGNvbXBsZXRpb24gY29kZS5cbiAgICovXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0byByZXBvcnQgbG9naW4gY29tcGxldGlvbi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICogQHR5cGUge1Rpbm9kZS5vbkxvZ2lufVxuICAgKi9cbiAgb25Mb2dpbiA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gcmVjZWl2ZSA8Y29kZT57Y3RybH08L2NvZGU+IChjb250cm9sKSBtZXNzYWdlcy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICogQHR5cGUge1Rpbm9kZS5vbkN0cmxNZXNzYWdlfVxuICAgKi9cbiAgb25DdHJsTWVzc2FnZSA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gcmVjaWV2ZSA8Y29kZT57ZGF0YX08L2NvZGU+IChjb250ZW50KSBtZXNzYWdlcy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICogQHR5cGUge1Rpbm9kZS5vbkRhdGFNZXNzYWdlfVxuICAgKi9cbiAgb25EYXRhTWVzc2FnZSA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gcmVjZWl2ZSA8Y29kZT57cHJlc308L2NvZGU+IChwcmVzZW5jZSkgbWVzc2FnZXMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqIEB0eXBlIHtUaW5vZGUub25QcmVzTWVzc2FnZX1cbiAgICovXG4gIG9uUHJlc01lc3NhZ2UgPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIHRvIHJlY2VpdmUgYWxsIG1lc3NhZ2VzIGFzIG9iamVjdHMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqIEB0eXBlIHtUaW5vZGUub25NZXNzYWdlfVxuICAgKi9cbiAgb25NZXNzYWdlID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0byByZWNlaXZlIGFsbCBtZXNzYWdlcyBhcyB1bnBhcnNlZCB0ZXh0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKiBAdHlwZSB7VGlub2RlLm9uUmF3TWVzc2FnZX1cbiAgICovXG4gIG9uUmF3TWVzc2FnZSA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gcmVjZWl2ZSBzZXJ2ZXIgcmVzcG9uc2VzIHRvIG5ldHdvcmsgcHJvYmVzLiBTZWUge0BsaW5rIFRpbm9kZSNuZXR3b3JrUHJvYmV9XG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqIEB0eXBlIHtUaW5vZGUub25OZXR3b3JrUHJvYmV9XG4gICAqL1xuICBvbk5ldHdvcmtQcm9iZSA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gYmUgbm90aWZpZWQgd2hlbiBleHBvbmVudGlhbCBiYWNrb2ZmIGlzIGl0ZXJhdGluZy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICogQHR5cGUge1Rpbm9kZS5vbkF1dG9yZWNvbm5lY3RJdGVyYXRpb259XG4gICAqL1xuICBvbkF1dG9yZWNvbm5lY3RJdGVyYXRpb24gPSB1bmRlZmluZWQ7XG59O1xuXG4vLyBFeHBvcnRlZCBjb25zdGFudHNcblRpbm9kZS5NRVNTQUdFX1NUQVRVU19OT05FID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfTk9ORTtcblRpbm9kZS5NRVNTQUdFX1NUQVRVU19RVUVVRUQgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19RVUVVRUQ7XG5UaW5vZGUuTUVTU0FHRV9TVEFUVVNfU0VORElORyA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX1NFTkRJTkc7XG5UaW5vZGUuTUVTU0FHRV9TVEFUVVNfRkFJTEVEID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfRkFJTEVEO1xuVGlub2RlLk1FU1NBR0VfU1RBVFVTX1NFTlQgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19TRU5UO1xuVGlub2RlLk1FU1NBR0VfU1RBVFVTX1JFQ0VJVkVEID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfUkVDRUlWRUQ7XG5UaW5vZGUuTUVTU0FHRV9TVEFUVVNfUkVBRCA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX1JFQUQ7XG5UaW5vZGUuTUVTU0FHRV9TVEFUVVNfVE9fTUUgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19UT19NRTtcblRpbm9kZS5NRVNTQUdFX1NUQVRVU19ERUxfUkFOR0UgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19ERUxfUkFOR0U7XG5cbi8vIFVuaWNvZGUgW2RlbF0gc3ltYm9sLlxuVGlub2RlLkRFTF9DSEFSID0gQ29uc3QuREVMX0NIQVI7XG5cbi8vIE5hbWVzIG9mIGtleXMgdG8gc2VydmVyLXByb3ZpZGVkIGNvbmZpZ3VyYXRpb24gbGltaXRzLlxuVGlub2RlLk1BWF9NRVNTQUdFX1NJWkUgPSAnbWF4TWVzc2FnZVNpemUnO1xuVGlub2RlLk1BWF9TVUJTQ1JJQkVSX0NPVU5UID0gJ21heFN1YnNjcmliZXJDb3VudCc7XG5UaW5vZGUuTUFYX1RBR19DT1VOVCA9ICdtYXhUYWdDb3VudCc7XG5UaW5vZGUuTUFYX0ZJTEVfVVBMT0FEX1NJWkUgPSAnbWF4RmlsZVVwbG9hZFNpemUnO1xuIiwiLyoqXG4gKiBAZmlsZSBUb3BpYyBtYW5hZ2VtZW50LlxuICpcbiAqIEBjb3B5cmlnaHQgMjAxNS0yMDIyIFRpbm9kZSBMTEMuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IEFjY2Vzc01vZGUgZnJvbSAnLi9hY2Nlc3MtbW9kZS5qcyc7XG5pbXBvcnQgQ0J1ZmZlciBmcm9tICcuL2NidWZmZXIuanMnO1xuaW1wb3J0ICogYXMgQ29uc3QgZnJvbSAnLi9jb25maWcuanMnO1xuaW1wb3J0IERyYWZ0eSBmcm9tICcuL2RyYWZ0eS5qcyc7XG5pbXBvcnQgTWV0YUdldEJ1aWxkZXIgZnJvbSAnLi9tZXRhLWJ1aWxkZXIuanMnO1xuaW1wb3J0IHtcbiAgbWVyZ2VPYmosXG4gIG1lcmdlVG9DYWNoZSxcbiAgbm9ybWFsaXplQXJyYXlcbn0gZnJvbSAnLi91dGlscy5qcyc7XG5cbmV4cG9ydCBjbGFzcyBUb3BpYyB7XG4gIC8qKlxuICAgKiBAY2FsbGJhY2sgVGlub2RlLlRvcGljLm9uRGF0YVxuICAgKiBAcGFyYW0ge0RhdGF9IGRhdGEgLSBEYXRhIHBhY2tldFxuICAgKi9cbiAgLyoqXG4gICAqIFRvcGljIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIGEgbG9naWNhbCBjb21tdW5pY2F0aW9uIGNoYW5uZWwuXG4gICAqIEBjbGFzcyBUb3BpY1xuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gY3JlYXRlLlxuICAgKiBAcGFyYW0ge09iamVjdD19IGNhbGxiYWNrcyAtIE9iamVjdCB3aXRoIHZhcmlvdXMgZXZlbnQgY2FsbGJhY2tzLlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5Ub3BpYy5vbkRhdGF9IGNhbGxiYWNrcy5vbkRhdGEgLSBDYWxsYmFjayB3aGljaCByZWNlaXZlcyBhIDxjb2RlPntkYXRhfTwvY29kZT4gbWVzc2FnZS5cbiAgICogQHBhcmFtIHtjYWxsYmFja30gY2FsbGJhY2tzLm9uTWV0YSAtIENhbGxiYWNrIHdoaWNoIHJlY2VpdmVzIGEgPGNvZGU+e21ldGF9PC9jb2RlPiBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge2NhbGxiYWNrfSBjYWxsYmFja3Mub25QcmVzIC0gQ2FsbGJhY2sgd2hpY2ggcmVjZWl2ZXMgYSA8Y29kZT57cHJlc308L2NvZGU+IG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7Y2FsbGJhY2t9IGNhbGxiYWNrcy5vbkluZm8gLSBDYWxsYmFjayB3aGljaCByZWNlaXZlcyBhbiA8Y29kZT57aW5mb308L2NvZGU+IG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7Y2FsbGJhY2t9IGNhbGxiYWNrcy5vbk1ldGFEZXNjIC0gQ2FsbGJhY2sgd2hpY2ggcmVjZWl2ZXMgY2hhbmdlcyB0byB0b3BpYyBkZXNjdGlvcHRpb24ge0BsaW5rIGRlc2N9LlxuICAgKiBAcGFyYW0ge2NhbGxiYWNrfSBjYWxsYmFja3Mub25NZXRhU3ViIC0gQ2FsbGVkIGZvciBhIHNpbmdsZSBzdWJzY3JpcHRpb24gcmVjb3JkIGNoYW5nZS5cbiAgICogQHBhcmFtIHtjYWxsYmFja30gY2FsbGJhY2tzLm9uU3Vic1VwZGF0ZWQgLSBDYWxsZWQgYWZ0ZXIgYSBiYXRjaCBvZiBzdWJzY3JpcHRpb24gY2hhbmdlcyBoYXZlIGJlZW4gcmVjaWV2ZWQgYW5kIGNhY2hlZC5cbiAgICogQHBhcmFtIHtjYWxsYmFja30gY2FsbGJhY2tzLm9uRGVsZXRlVG9waWMgLSBDYWxsZWQgYWZ0ZXIgdGhlIHRvcGljIGlzIGRlbGV0ZWQuXG4gICAqIEBwYXJhbSB7Y2FsbGJhY2t9IGNhbGxiYWNscy5vbkFsbE1lc3NhZ2VzUmVjZWl2ZWQgLSBDYWxsZWQgd2hlbiBhbGwgcmVxdWVzdGVkIDxjb2RlPntkYXRhfTwvY29kZT4gbWVzc2FnZXMgaGF2ZSBiZWVuIHJlY2l2ZWQuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihuYW1lLCBjYWxsYmFja3MpIHtcbiAgICAvLyBQYXJlbnQgVGlub2RlIG9iamVjdC5cbiAgICB0aGlzLl90aW5vZGUgPSBudWxsO1xuXG4gICAgLy8gU2VydmVyLXByb3ZpZGVkIGRhdGEsIGxvY2FsbHkgaW1tdXRhYmxlLlxuICAgIC8vIHRvcGljIG5hbWVcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIC8vIFRpbWVzdGFtcCB3aGVuIHRoZSB0b3BpYyB3YXMgY3JlYXRlZC5cbiAgICB0aGlzLmNyZWF0ZWQgPSBudWxsO1xuICAgIC8vIFRpbWVzdGFtcCB3aGVuIHRoZSB0b3BpYyB3YXMgbGFzdCB1cGRhdGVkLlxuICAgIHRoaXMudXBkYXRlZCA9IG51bGw7XG4gICAgLy8gVGltZXN0YW1wIG9mIHRoZSBsYXN0IG1lc3NhZ2VzXG4gICAgdGhpcy50b3VjaGVkID0gbmV3IERhdGUoMCk7XG4gICAgLy8gQWNjZXNzIG1vZGUsIHNlZSBBY2Nlc3NNb2RlXG4gICAgdGhpcy5hY3MgPSBuZXcgQWNjZXNzTW9kZShudWxsKTtcbiAgICAvLyBQZXItdG9waWMgcHJpdmF0ZSBkYXRhIChhY2Nlc3NpYmxlIGJ5IGN1cnJlbnQgdXNlciBvbmx5KS5cbiAgICB0aGlzLnByaXZhdGUgPSBudWxsO1xuICAgIC8vIFBlci10b3BpYyBwdWJsaWMgZGF0YSAoYWNjZXNzaWJsZSBieSBhbGwgdXNlcnMpLlxuICAgIHRoaXMucHVibGljID0gbnVsbDtcbiAgICAvLyBQZXItdG9waWMgc3lzdGVtLXByb3ZpZGVkIGRhdGEgKGFjY2Vzc2libGUgYnkgYWxsIHVzZXJzKS5cbiAgICB0aGlzLnRydXN0ZWQgPSBudWxsO1xuXG4gICAgLy8gTG9jYWxseSBjYWNoZWQgZGF0YVxuICAgIC8vIFN1YnNjcmliZWQgdXNlcnMsIGZvciB0cmFja2luZyByZWFkL3JlY3YvbXNnIG5vdGlmaWNhdGlvbnMuXG4gICAgdGhpcy5fdXNlcnMgPSB7fTtcblxuICAgIC8vIEN1cnJlbnQgdmFsdWUgb2YgbG9jYWxseSBpc3N1ZWQgc2VxSWQsIHVzZWQgZm9yIHBlbmRpbmcgbWVzc2FnZXMuXG4gICAgdGhpcy5fcXVldWVkU2VxSWQgPSBDb25zdC5MT0NBTF9TRVFJRDtcblxuICAgIC8vIFRoZSBtYXhpbXVtIGtub3duIHtkYXRhLnNlcX0gdmFsdWUuXG4gICAgdGhpcy5fbWF4U2VxID0gMDtcbiAgICAvLyBUaGUgbWluaW11bSBrbm93biB7ZGF0YS5zZXF9IHZhbHVlLlxuICAgIHRoaXMuX21pblNlcSA9IDA7XG4gICAgLy8gSW5kaWNhdG9yIHRoYXQgdGhlIGxhc3QgcmVxdWVzdCBmb3IgZWFybGllciBtZXNzYWdlcyByZXR1cm5lZCAwLlxuICAgIHRoaXMuX25vRWFybGllck1zZ3MgPSBmYWxzZTtcbiAgICAvLyBUaGUgbWF4aW11bSBrbm93biBkZWxldGlvbiBJRC5cbiAgICB0aGlzLl9tYXhEZWwgPSAwO1xuICAgIC8vIFRpbWVyIG9iamVjdCB1c2VkIHRvIHNlbmQgJ3JlY3YnIG5vdGlmaWNhdGlvbnMuXG4gICAgdGhpcy5fcmVjdk5vdGlmaWNhdGlvblRpbWVyID0gbnVsbDtcblxuICAgIC8vIFVzZXIgZGlzY292ZXJ5IHRhZ3NcbiAgICB0aGlzLl90YWdzID0gW107XG4gICAgLy8gQ3JlZGVudGlhbHMgc3VjaCBhcyBlbWFpbCBvciBwaG9uZSBudW1iZXIuXG4gICAgdGhpcy5fY3JlZGVudGlhbHMgPSBbXTtcbiAgICAvLyBNZXNzYWdlIHZlcnNpb25zIGNhY2hlIChlLmcuIGZvciBlZGl0ZWQgbWVzc2FnZXMpLlxuICAgIC8vIEtleXM6IG9yaWdpbmFsIG1lc3NhZ2Ugc2VxIGlkcy5cbiAgICAvLyBWYWx1ZXM6IENCdWZmZXJzIGNvbnRhaW5pbmcgbmV3ZXIgdmVyc2lvbnMgb2YgdGhlIG9yaWdpbmFsIG1lc3NhZ2VcbiAgICAvLyBvcmRlcmVkIGJ5IHNlcSBpZC5cbiAgICB0aGlzLl9tZXNzYWdlVmVyc2lvbnMgPSB7fTtcbiAgICAvLyBNZXNzYWdlIGNhY2hlLCBzb3J0ZWQgYnkgbWVzc2FnZSBzZXEgdmFsdWVzLCBmcm9tIG9sZCB0byBuZXcuXG4gICAgdGhpcy5fbWVzc2FnZXMgPSBuZXcgQ0J1ZmZlcigoYSwgYikgPT4ge1xuICAgICAgcmV0dXJuIGEuc2VxIC0gYi5zZXE7XG4gICAgfSwgdHJ1ZSk7XG4gICAgLy8gQm9vbGVhbiwgdHJ1ZSBpZiB0aGUgdG9waWMgaXMgY3VycmVudGx5IGxpdmVcbiAgICB0aGlzLl9hdHRhY2hlZCA9IGZhbHNlO1xuICAgIC8vIFRpbWVzdGFwIG9mIHRoZSBtb3N0IHJlY2VudGx5IHVwZGF0ZWQgc3Vic2NyaXB0aW9uLlxuICAgIHRoaXMuX2xhc3RTdWJzVXBkYXRlID0gbmV3IERhdGUoMCk7XG4gICAgLy8gVG9waWMgY3JlYXRlZCBidXQgbm90IHlldCBzeW5jZWQgd2l0aCB0aGUgc2VydmVyLiBVc2VkIG9ubHkgZHVyaW5nIGluaXRpYWxpemF0aW9uLlxuICAgIHRoaXMuX25ldyA9IHRydWU7XG4gICAgLy8gVGhlIHRvcGljIGlzIGRlbGV0ZWQgYXQgdGhlIHNlcnZlciwgdGhpcyBpcyBhIGxvY2FsIGNvcHkuXG4gICAgdGhpcy5fZGVsZXRlZCA9IGZhbHNlO1xuXG4gICAgLy8gVGltZXIgdXNlZCB0byB0cmdnZXIge2xlYXZlfSByZXF1ZXN0IGFmdGVyIGEgZGVsYXkuXG4gICAgdGhpcy5fZGVsYXllZExlYXZlVGltZXIgPSBudWxsO1xuXG4gICAgLy8gQ2FsbGJhY2tzXG4gICAgaWYgKGNhbGxiYWNrcykge1xuICAgICAgdGhpcy5vbkRhdGEgPSBjYWxsYmFja3Mub25EYXRhO1xuICAgICAgdGhpcy5vbk1ldGEgPSBjYWxsYmFja3Mub25NZXRhO1xuICAgICAgdGhpcy5vblByZXMgPSBjYWxsYmFja3Mub25QcmVzO1xuICAgICAgdGhpcy5vbkluZm8gPSBjYWxsYmFja3Mub25JbmZvO1xuICAgICAgLy8gQSBzaW5nbGUgZGVzYyB1cGRhdGU7XG4gICAgICB0aGlzLm9uTWV0YURlc2MgPSBjYWxsYmFja3Mub25NZXRhRGVzYztcbiAgICAgIC8vIEEgc2luZ2xlIHN1YnNjcmlwdGlvbiByZWNvcmQ7XG4gICAgICB0aGlzLm9uTWV0YVN1YiA9IGNhbGxiYWNrcy5vbk1ldGFTdWI7XG4gICAgICAvLyBBbGwgc3Vic2NyaXB0aW9uIHJlY29yZHMgcmVjZWl2ZWQ7XG4gICAgICB0aGlzLm9uU3Vic1VwZGF0ZWQgPSBjYWxsYmFja3Mub25TdWJzVXBkYXRlZDtcbiAgICAgIHRoaXMub25UYWdzVXBkYXRlZCA9IGNhbGxiYWNrcy5vblRhZ3NVcGRhdGVkO1xuICAgICAgdGhpcy5vbkNyZWRzVXBkYXRlZCA9IGNhbGxiYWNrcy5vbkNyZWRzVXBkYXRlZDtcbiAgICAgIHRoaXMub25EZWxldGVUb3BpYyA9IGNhbGxiYWNrcy5vbkRlbGV0ZVRvcGljO1xuICAgICAgdGhpcy5vbkFsbE1lc3NhZ2VzUmVjZWl2ZWQgPSBjYWxsYmFja3Mub25BbGxNZXNzYWdlc1JlY2VpdmVkO1xuICAgIH1cbiAgfVxuXG4gIC8vIFN0YXRpYyBtZXRob2RzLlxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmUgdG9waWMgdHlwZSBmcm9tIHRvcGljJ3MgbmFtZTogZ3JwLCBwMnAsIG1lLCBmbmQsIHN5cy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIHRlc3QuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IE9uZSBvZiA8Y29kZT5cIm1lXCI8L2NvZGU+LCA8Y29kZT5cImZuZFwiPC9jb2RlPiwgPGNvZGU+XCJzeXNcIjwvY29kZT4sIDxjb2RlPlwiZ3JwXCI8L2NvZGU+LFxuICAgKiAgICA8Y29kZT5cInAycFwiPC9jb2RlPiBvciA8Y29kZT51bmRlZmluZWQ8L2NvZGU+LlxuICAgKi9cbiAgc3RhdGljIHRvcGljVHlwZShuYW1lKSB7XG4gICAgY29uc3QgdHlwZXMgPSB7XG4gICAgICAnbWUnOiBDb25zdC5UT1BJQ19NRSxcbiAgICAgICdmbmQnOiBDb25zdC5UT1BJQ19GTkQsXG4gICAgICAnZ3JwJzogQ29uc3QuVE9QSUNfR1JQLFxuICAgICAgJ25ldyc6IENvbnN0LlRPUElDX0dSUCxcbiAgICAgICduY2gnOiBDb25zdC5UT1BJQ19HUlAsXG4gICAgICAnY2huJzogQ29uc3QuVE9QSUNfR1JQLFxuICAgICAgJ3Vzcic6IENvbnN0LlRPUElDX1AyUCxcbiAgICAgICdzeXMnOiBDb25zdC5UT1BJQ19TWVNcbiAgICB9O1xuICAgIHJldHVybiB0eXBlc1sodHlwZW9mIG5hbWUgPT0gJ3N0cmluZycpID8gbmFtZS5zdWJzdHJpbmcoMCwgMykgOiAneHh4J107XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIGdpdmVuIHRvcGljIG5hbWUgaXMgYSBuYW1lIG9mIGEgJ21lJyB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIHRlc3QuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGUgbmFtZSBpcyBhIG5hbWUgb2YgYSAnbWUnIHRvcGljLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgc3RhdGljIGlzTWVUb3BpY05hbWUobmFtZSkge1xuICAgIHJldHVybiBUb3BpYy50b3BpY1R5cGUobmFtZSkgPT0gQ29uc3QuVE9QSUNfTUU7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIGdpdmVuIHRvcGljIG5hbWUgaXMgYSBuYW1lIG9mIGEgZ3JvdXAgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byB0ZXN0LlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdGhlIG5hbWUgaXMgYSBuYW1lIG9mIGEgZ3JvdXAgdG9waWMsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBzdGF0aWMgaXNHcm91cFRvcGljTmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIFRvcGljLnRvcGljVHlwZShuYW1lKSA9PSBDb25zdC5UT1BJQ19HUlA7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIGdpdmVuIHRvcGljIG5hbWUgaXMgYSBuYW1lIG9mIGEgcDJwIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gdGVzdC5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBuYW1lIGlzIGEgbmFtZSBvZiBhIHAycCB0b3BpYywgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIHN0YXRpYyBpc1AyUFRvcGljTmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIFRvcGljLnRvcGljVHlwZShuYW1lKSA9PSBDb25zdC5UT1BJQ19QMlA7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIGdpdmVuIHRvcGljIG5hbWUgaXMgYSBuYW1lIG9mIGEgY29tbXVuaWNhdGlvbiB0b3BpYywgaS5lLiBQMlAgb3IgZ3JvdXAuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byB0ZXN0LlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdGhlIG5hbWUgaXMgYSBuYW1lIG9mIGEgcDJwIG9yIGdyb3VwIHRvcGljLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgc3RhdGljIGlzQ29tbVRvcGljTmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIFRvcGljLmlzUDJQVG9waWNOYW1lKG5hbWUpIHx8IFRvcGljLmlzR3JvdXBUb3BpY05hbWUobmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIHRvcGljIG5hbWUgaXMgYSBuYW1lIG9mIGEgbmV3IHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gdG9waWMgbmFtZSB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBuYW1lIGlzIGEgbmFtZSBvZiBhIG5ldyB0b3BpYywgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIHN0YXRpYyBpc05ld0dyb3VwVG9waWNOYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gKHR5cGVvZiBuYW1lID09ICdzdHJpbmcnKSAmJlxuICAgICAgKG5hbWUuc3Vic3RyaW5nKDAsIDMpID09IENvbnN0LlRPUElDX05FVyB8fCBuYW1lLnN1YnN0cmluZygwLCAzKSA9PSBDb25zdC5UT1BJQ19ORVdfQ0hBTik7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIHRvcGljIG5hbWUgaXMgYSBuYW1lIG9mIGEgY2hhbm5lbC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIHRvcGljIG5hbWUgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGUgbmFtZSBpcyBhIG5hbWUgb2YgYSBjaGFubmVsLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgc3RhdGljIGlzQ2hhbm5lbFRvcGljTmFtZShuYW1lKSB7XG4gICAgcmV0dXJuICh0eXBlb2YgbmFtZSA9PSAnc3RyaW5nJykgJiZcbiAgICAgIChuYW1lLnN1YnN0cmluZygwLCAzKSA9PSBDb25zdC5UT1BJQ19DSEFOIHx8IG5hbWUuc3Vic3RyaW5nKDAsIDMpID09IENvbnN0LlRPUElDX05FV19DSEFOKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgdG9waWMgaXMgc3Vic2NyaWJlZC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaXMgdG9waWMgaXMgYXR0YWNoZWQvc3Vic2NyaWJlZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNTdWJzY3JpYmVkKCkge1xuICAgIHJldHVybiB0aGlzLl9hdHRhY2hlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXF1ZXN0IHRvcGljIHRvIHN1YnNjcmliZS4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNzdWJzY3JpYmV9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5HZXRRdWVyeT19IGdldFBhcmFtcyAtIGdldCBxdWVyeSBwYXJhbWV0ZXJzLlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5TZXRQYXJhbXM9fSBzZXRQYXJhbXMgLSBzZXQgcGFyYW1ldGVycy5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHRoZSByZXF1ZXN0LlxuICAgKi9cbiAgc3Vic2NyaWJlKGdldFBhcmFtcywgc2V0UGFyYW1zKSB7XG4gICAgLy8gQ2xlYXIgcmVxdWVzdCB0byBsZWF2ZSB0b3BpYy5cbiAgICBjbGVhclRpbWVvdXQodGhpcy5fZGVsYXllZExlYXZlVGltZXIpO1xuICAgIHRoaXMuX2RlbGF5ZWRMZWF2ZVRpbWVyID0gbnVsbDtcblxuICAgIC8vIElmIHRoZSB0b3BpYyBpcyBhbHJlYWR5IHN1YnNjcmliZWQsIHJldHVybiByZXNvbHZlZCBwcm9taXNlXG4gICAgaWYgKHRoaXMuX2F0dGFjaGVkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMpO1xuICAgIH1cblxuICAgIC8vIElmIHRoZSB0b3BpYyBpcyBkZWxldGVkLCByZWplY3Qgc3Vic2NyaXB0aW9uIHJlcXVlc3RzLlxuICAgIGlmICh0aGlzLl9kZWxldGVkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiQ29udmVyc2F0aW9uIGRlbGV0ZWRcIikpO1xuICAgIH1cblxuICAgIC8vIFNlbmQgc3Vic2NyaWJlIG1lc3NhZ2UsIGhhbmRsZSBhc3luYyByZXNwb25zZS5cbiAgICAvLyBJZiB0b3BpYyBuYW1lIGlzIGV4cGxpY2l0bHkgcHJvdmlkZWQsIHVzZSBpdC4gSWYgbm8gbmFtZSwgdGhlbiBpdCdzIGEgbmV3IGdyb3VwIHRvcGljLFxuICAgIC8vIHVzZSBcIm5ld1wiLlxuICAgIHJldHVybiB0aGlzLl90aW5vZGUuc3Vic2NyaWJlKHRoaXMubmFtZSB8fCBDb25zdC5UT1BJQ19ORVcsIGdldFBhcmFtcywgc2V0UGFyYW1zKS50aGVuKChjdHJsKSA9PiB7XG4gICAgICBpZiAoY3RybC5jb2RlID49IDMwMCkge1xuICAgICAgICAvLyBEbyBub3RoaW5nIGlmIHN1YnNjcmlwdGlvbiBzdGF0dXMgaGFzIG5vdCBjaGFuZ2VkLlxuICAgICAgICByZXR1cm4gY3RybDtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fYXR0YWNoZWQgPSB0cnVlO1xuICAgICAgdGhpcy5fZGVsZXRlZCA9IGZhbHNlO1xuICAgICAgdGhpcy5hY3MgPSAoY3RybC5wYXJhbXMgJiYgY3RybC5wYXJhbXMuYWNzKSA/IGN0cmwucGFyYW1zLmFjcyA6IHRoaXMuYWNzO1xuXG4gICAgICAvLyBTZXQgdG9waWMgbmFtZSBmb3IgbmV3IHRvcGljcyBhbmQgYWRkIGl0IHRvIGNhY2hlLlxuICAgICAgaWYgKHRoaXMuX25ldykge1xuICAgICAgICBkZWxldGUgdGhpcy5fbmV3O1xuXG4gICAgICAgIGlmICh0aGlzLm5hbWUgIT0gY3RybC50b3BpYykge1xuICAgICAgICAgIC8vIE5hbWUgbWF5IGNoYW5nZSBuZXcxMjM0NTYgLT4gZ3JwQWJDZEVmLiBSZW1vdmUgZnJvbSBjYWNoZSB1bmRlciB0aGUgb2xkIG5hbWUuXG4gICAgICAgICAgdGhpcy5fY2FjaGVEZWxTZWxmKCk7XG4gICAgICAgICAgdGhpcy5uYW1lID0gY3RybC50b3BpYztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jYWNoZVB1dFNlbGYoKTtcblxuICAgICAgICB0aGlzLmNyZWF0ZWQgPSBjdHJsLnRzO1xuICAgICAgICB0aGlzLnVwZGF0ZWQgPSBjdHJsLnRzO1xuXG4gICAgICAgIGlmICh0aGlzLm5hbWUgIT0gQ29uc3QuVE9QSUNfTUUgJiYgdGhpcy5uYW1lICE9IENvbnN0LlRPUElDX0ZORCkge1xuICAgICAgICAgIC8vIEFkZCB0aGUgbmV3IHRvcGljIHRvIHRoZSBsaXN0IG9mIGNvbnRhY3RzIG1haW50YWluZWQgYnkgdGhlICdtZScgdG9waWMuXG4gICAgICAgICAgY29uc3QgbWUgPSB0aGlzLl90aW5vZGUuZ2V0TWVUb3BpYygpO1xuICAgICAgICAgIGlmIChtZS5vbk1ldGFTdWIpIHtcbiAgICAgICAgICAgIG1lLm9uTWV0YVN1Yih0aGlzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKG1lLm9uU3Vic1VwZGF0ZWQpIHtcbiAgICAgICAgICAgIG1lLm9uU3Vic1VwZGF0ZWQoW3RoaXMubmFtZV0sIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzZXRQYXJhbXMgJiYgc2V0UGFyYW1zLmRlc2MpIHtcbiAgICAgICAgICBzZXRQYXJhbXMuZGVzYy5fbm9Gb3J3YXJkaW5nID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLl9wcm9jZXNzTWV0YURlc2Moc2V0UGFyYW1zLmRlc2MpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gY3RybDtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBkcmFmdCBvZiBhIG1lc3NhZ2Ugd2l0aG91dCBzZW5kaW5nIGl0IHRvIHRoZSBzZXJ2ZXIuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgT2JqZWN0fSBkYXRhIC0gQ29udGVudCB0byB3cmFwIGluIGEgZHJhZnQuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IG5vRWNobyAtIElmIDxjb2RlPnRydWU8L2NvZGU+IHNlcnZlciB3aWxsIG5vdCBlY2hvIG1lc3NhZ2UgYmFjayB0byBvcmlnaW5hdGluZ1xuICAgKiBzZXNzaW9uLiBPdGhlcndpc2UgdGhlIHNlcnZlciB3aWxsIHNlbmQgYSBjb3B5IG9mIHRoZSBtZXNzYWdlIHRvIHNlbmRlci5cbiAgICpcbiAgICogQHJldHVybnMge09iamVjdH0gbWVzc2FnZSBkcmFmdC5cbiAgICovXG4gIGNyZWF0ZU1lc3NhZ2UoZGF0YSwgbm9FY2hvKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Rpbm9kZS5jcmVhdGVNZXNzYWdlKHRoaXMubmFtZSwgZGF0YSwgbm9FY2hvKTtcbiAgfVxuICAvKipcbiAgICogSW1tZWRpYXRlbHkgcHVibGlzaCBkYXRhIHRvIHRvcGljLiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI3B1Ymxpc2h9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZyB8IE9iamVjdH0gZGF0YSAtIERhdGEgdG8gcHVibGlzaCwgZWl0aGVyIHBsYWluIHN0cmluZyBvciBhIERyYWZ0eSBvYmplY3QuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IG5vRWNobyAtIElmIDxjb2RlPnRydWU8L2NvZGU+IHNlcnZlciB3aWxsIG5vdCBlY2hvIG1lc3NhZ2UgYmFjayB0byBvcmlnaW5hdGluZ1xuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gdGhlIHJlcXVlc3QuXG4gICAqL1xuICBwdWJsaXNoKGRhdGEsIG5vRWNobykge1xuICAgIHJldHVybiB0aGlzLnB1Ymxpc2hNZXNzYWdlKHRoaXMuY3JlYXRlTWVzc2FnZShkYXRhLCBub0VjaG8pKTtcbiAgfVxuICAvKipcbiAgICogUHVibGlzaCBtZXNzYWdlIGNyZWF0ZWQgYnkge0BsaW5rIFRpbm9kZS5Ub3BpYyNjcmVhdGVNZXNzYWdlfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHB1YiAtIHtkYXRhfSBvYmplY3QgdG8gcHVibGlzaC4gTXVzdCBiZSBjcmVhdGVkIGJ5IHtAbGluayBUaW5vZGUuVG9waWMjY3JlYXRlTWVzc2FnZX1cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHRoZSByZXF1ZXN0LlxuICAgKi9cbiAgcHVibGlzaE1lc3NhZ2UocHViKSB7XG4gICAgaWYgKCF0aGlzLl9hdHRhY2hlZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkNhbm5vdCBwdWJsaXNoIG9uIGluYWN0aXZlIHRvcGljXCIpKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuX3NlbmRpbmcpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJUaGUgbWVzc2FnZSBpcyBhbHJlYWR5IGJlaW5nIHNlbnRcIikpO1xuICAgIH1cblxuICAgIC8vIFNlbmQgZGF0YS5cbiAgICBwdWIuX3NlbmRpbmcgPSB0cnVlO1xuICAgIHB1Yi5fZmFpbGVkID0gZmFsc2U7XG5cbiAgICAvLyBFeHRyYWN0IHJlZmVyZWNlcyB0byBhdHRhY2htZW50cyBhbmQgb3V0IG9mIGJhbmQgaW1hZ2UgcmVjb3Jkcy5cbiAgICBsZXQgYXR0YWNobWVudHMgPSBudWxsO1xuICAgIGlmIChEcmFmdHkuaGFzRW50aXRpZXMocHViLmNvbnRlbnQpKSB7XG4gICAgICBhdHRhY2htZW50cyA9IFtdO1xuICAgICAgRHJhZnR5LmVudGl0aWVzKHB1Yi5jb250ZW50LCAoZGF0YSkgPT4ge1xuICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLnJlZikge1xuICAgICAgICAgIGF0dGFjaG1lbnRzLnB1c2goZGF0YS5yZWYpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGlmIChhdHRhY2htZW50cy5sZW5ndGggPT0gMCkge1xuICAgICAgICBhdHRhY2htZW50cyA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3Rpbm9kZS5wdWJsaXNoTWVzc2FnZShwdWIsIGF0dGFjaG1lbnRzKS50aGVuKChjdHJsKSA9PiB7XG4gICAgICBwdWIuX3NlbmRpbmcgPSBmYWxzZTtcbiAgICAgIHB1Yi50cyA9IGN0cmwudHM7XG4gICAgICB0aGlzLnN3YXBNZXNzYWdlSWQocHViLCBjdHJsLnBhcmFtcy5zZXEpO1xuICAgICAgdGhpcy5fcm91dGVEYXRhKHB1Yik7XG4gICAgICByZXR1cm4gY3RybDtcbiAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICB0aGlzLl90aW5vZGUubG9nZ2VyKFwiV0FSTklORzogTWVzc2FnZSByZWplY3RlZCBieSB0aGUgc2VydmVyXCIsIGVycik7XG4gICAgICBwdWIuX3NlbmRpbmcgPSBmYWxzZTtcbiAgICAgIHB1Yi5fZmFpbGVkID0gdHJ1ZTtcbiAgICAgIGlmICh0aGlzLm9uRGF0YSkge1xuICAgICAgICB0aGlzLm9uRGF0YSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIC8qKlxuICAgKiBBZGQgbWVzc2FnZSB0byBsb2NhbCBtZXNzYWdlIGNhY2hlLCBzZW5kIHRvIHRoZSBzZXJ2ZXIgd2hlbiB0aGUgcHJvbWlzZSBpcyByZXNvbHZlZC5cbiAgICogSWYgcHJvbWlzZSBpcyBudWxsIG9yIHVuZGVmaW5lZCwgdGhlIG1lc3NhZ2Ugd2lsbCBiZSBzZW50IGltbWVkaWF0ZWx5LlxuICAgKiBUaGUgbWVzc2FnZSBpcyBzZW50IHdoZW4gdGhlXG4gICAqIFRoZSBtZXNzYWdlIHNob3VsZCBiZSBjcmVhdGVkIGJ5IHtAbGluayBUaW5vZGUuVG9waWMjY3JlYXRlTWVzc2FnZX0uXG4gICAqIFRoaXMgaXMgcHJvYmFibHkgbm90IHRoZSBmaW5hbCBBUEkuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwdWIgLSBNZXNzYWdlIHRvIHVzZSBhcyBhIGRyYWZ0LlxuICAgKiBAcGFyYW0ge1Byb21pc2V9IHByb20gLSBNZXNzYWdlIHdpbGwgYmUgc2VudCB3aGVuIHRoaXMgcHJvbWlzZSBpcyByZXNvbHZlZCwgZGlzY2FyZGVkIGlmIHJlamVjdGVkLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gZGVyaXZlZCBwcm9taXNlLlxuICAgKi9cbiAgcHVibGlzaERyYWZ0KHB1YiwgcHJvbSkge1xuICAgIGNvbnN0IHNlcSA9IHB1Yi5zZXEgfHwgdGhpcy5fZ2V0UXVldWVkU2VxSWQoKTtcbiAgICBpZiAoIXB1Yi5fbm9Gb3J3YXJkaW5nKSB7XG4gICAgICAvLyBUaGUgJ3NlcScsICd0cycsIGFuZCAnZnJvbScgYXJlIGFkZGVkIHRvIG1pbWljIHtkYXRhfS4gVGhleSBhcmUgcmVtb3ZlZCBsYXRlclxuICAgICAgLy8gYmVmb3JlIHRoZSBtZXNzYWdlIGlzIHNlbnQuXG4gICAgICBwdWIuX25vRm9yd2FyZGluZyA9IHRydWU7XG4gICAgICBwdWIuc2VxID0gc2VxO1xuICAgICAgcHViLnRzID0gbmV3IERhdGUoKTtcbiAgICAgIHB1Yi5mcm9tID0gdGhpcy5fdGlub2RlLmdldEN1cnJlbnRVc2VySUQoKTtcblxuICAgICAgLy8gRG9uJ3QgbmVlZCBhbiBlY2hvIG1lc3NhZ2UgYmVjYXVzZSB0aGUgbWVzc2FnZSBpcyBhZGRlZCB0byBsb2NhbCBjYWNoZSByaWdodCBhd2F5LlxuICAgICAgcHViLm5vZWNobyA9IHRydWU7XG4gICAgICAvLyBBZGQgdG8gY2FjaGUuXG4gICAgICB0aGlzLl9tZXNzYWdlcy5wdXQocHViKTtcbiAgICAgIHRoaXMuX3Rpbm9kZS5fZGIuYWRkTWVzc2FnZShwdWIpO1xuXG4gICAgICBpZiAodGhpcy5vbkRhdGEpIHtcbiAgICAgICAgdGhpcy5vbkRhdGEocHViKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gSWYgcHJvbWlzZSBpcyBwcm92aWRlZCwgc2VuZCB0aGUgcXVldWVkIG1lc3NhZ2Ugd2hlbiBpdCdzIHJlc29sdmVkLlxuICAgIC8vIElmIG5vIHByb21pc2UgaXMgcHJvdmlkZWQsIGNyZWF0ZSBhIHJlc29sdmVkIG9uZSBhbmQgc2VuZCBpbW1lZGlhdGVseS5cbiAgICByZXR1cm4gKHByb20gfHwgUHJvbWlzZS5yZXNvbHZlKCkpXG4gICAgICAudGhlbihfID0+IHtcbiAgICAgICAgaWYgKHB1Yi5fY2FuY2VsbGVkKSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvZGU6IDMwMCxcbiAgICAgICAgICAgIHRleHQ6IFwiY2FuY2VsbGVkXCJcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnB1Ymxpc2hNZXNzYWdlKHB1Yik7XG4gICAgICB9KS5jYXRjaChlcnIgPT4ge1xuICAgICAgICB0aGlzLl90aW5vZGUubG9nZ2VyKFwiV0FSTklORzogTWVzc2FnZSBkcmFmdCByZWplY3RlZFwiLCBlcnIpO1xuICAgICAgICBwdWIuX3NlbmRpbmcgPSBmYWxzZTtcbiAgICAgICAgcHViLl9mYWlsZWQgPSB0cnVlO1xuICAgICAgICBpZiAodGhpcy5vbkRhdGEpIHtcbiAgICAgICAgICB0aGlzLm9uRGF0YSgpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFJldGhyb3cgdG8gbGV0IGNhbGxlciBrbm93IHRoYXQgdGhlIG9wZXJhdGlvbiBmYWlsZWQuXG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIExlYXZlIHRoZSB0b3BpYywgb3B0aW9uYWxseSB1bnNpYnNjcmliZS4gTGVhdmluZyB0aGUgdG9waWMgbWVhbnMgdGhlIHRvcGljIHdpbGwgc3RvcFxuICAgKiByZWNlaXZpbmcgdXBkYXRlcyBmcm9tIHRoZSBzZXJ2ZXIuIFVuc3Vic2NyaWJpbmcgd2lsbCB0ZXJtaW5hdGUgdXNlcidzIHJlbGF0aW9uc2hpcCB3aXRoIHRoZSB0b3BpYy5cbiAgICogV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNsZWF2ZX0uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IHVuc3ViIC0gSWYgdHJ1ZSwgdW5zdWJzY3JpYmUsIG90aGVyd2lzZSBqdXN0IGxlYXZlLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gdGhlIHJlcXVlc3QuXG4gICAqL1xuICBsZWF2ZSh1bnN1Yikge1xuICAgIC8vIEl0J3MgcG9zc2libGUgdG8gdW5zdWJzY3JpYmUgKHVuc3ViPT10cnVlKSBmcm9tIGluYWN0aXZlIHRvcGljLlxuICAgIGlmICghdGhpcy5fYXR0YWNoZWQgJiYgIXVuc3ViKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiQ2Fubm90IGxlYXZlIGluYWN0aXZlIHRvcGljXCIpKTtcbiAgICB9XG5cbiAgICAvLyBTZW5kIGEgJ2xlYXZlJyBtZXNzYWdlLCBoYW5kbGUgYXN5bmMgcmVzcG9uc2VcbiAgICByZXR1cm4gdGhpcy5fdGlub2RlLmxlYXZlKHRoaXMubmFtZSwgdW5zdWIpLnRoZW4oKGN0cmwpID0+IHtcbiAgICAgIHRoaXMuX3Jlc2V0U3ViKCk7XG4gICAgICBpZiAodW5zdWIpIHtcbiAgICAgICAgdGhpcy5fZ29uZSgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGN0cmw7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogTGVhdmUgdGhlIHRvcGljLCBvcHRpb25hbGx5IHVuc2lic2NyaWJlIGFmdGVyIGEgZGVsYXkuIExlYXZpbmcgdGhlIHRvcGljIG1lYW5zIHRoZSB0b3BpYyB3aWxsIHN0b3BcbiAgICogcmVjZWl2aW5nIHVwZGF0ZXMgZnJvbSB0aGUgc2VydmVyLiBVbnN1YnNjcmliaW5nIHdpbGwgdGVybWluYXRlIHVzZXIncyByZWxhdGlvbnNoaXAgd2l0aCB0aGUgdG9waWMuXG4gICAqIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjbGVhdmV9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHVuc3ViIC0gSWYgdHJ1ZSwgdW5zdWJzY3JpYmUsIG90aGVyd2lzZSBqdXN0IGxlYXZlLlxuICAgKiBAcGFyYW0ge251bWJlcn0gZGVsYXkgLSB0aW1lIGluIG1pbGxpc2Vjb25kcyB0byBkZWxheSBsZWF2ZSByZXF1ZXN0LlxuICAgKi9cbiAgbGVhdmVEZWxheWVkKHVuc3ViLCBkZWxheSkge1xuICAgIGNsZWFyVGltZW91dCh0aGlzLl9kZWxheWVkTGVhdmVUaW1lcik7XG4gICAgdGhpcy5fZGVsYXllZExlYXZlVGltZXIgPSBzZXRUaW1lb3V0KF8gPT4ge1xuICAgICAgdGhpcy5fZGVsYXllZExlYXZlVGltZXIgPSBudWxsO1xuICAgICAgdGhpcy5sZWF2ZSh1bnN1YilcbiAgICB9LCBkZWxheSk7XG4gIH1cblxuICAvKipcbiAgICogUmVxdWVzdCB0b3BpYyBtZXRhZGF0YSBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7VGlub2RlLkdldFF1ZXJ5fSByZXF1ZXN0IHBhcmFtZXRlcnNcbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHJlcXVlc3QuXG4gICAqL1xuICBnZXRNZXRhKHBhcmFtcykge1xuICAgIC8vIFNlbmQge2dldH0gbWVzc2FnZSwgcmV0dXJuIHByb21pc2UuXG4gICAgcmV0dXJuIHRoaXMuX3Rpbm9kZS5nZXRNZXRhKHRoaXMubmFtZSwgcGFyYW1zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXF1ZXN0IG1vcmUgbWVzc2FnZXMgZnJvbSB0aGUgc2VydmVyXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBsaW1pdCBudW1iZXIgb2YgbWVzc2FnZXMgdG8gZ2V0LlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvcndhcmQgaWYgdHJ1ZSwgcmVxdWVzdCBuZXdlciBtZXNzYWdlcy5cbiAgICovXG4gIGdldE1lc3NhZ2VzUGFnZShsaW1pdCwgZm9yd2FyZCkge1xuICAgIGxldCBxdWVyeSA9IGZvcndhcmQgP1xuICAgICAgdGhpcy5zdGFydE1ldGFRdWVyeSgpLndpdGhMYXRlckRhdGEobGltaXQpIDpcbiAgICAgIHRoaXMuc3RhcnRNZXRhUXVlcnkoKS53aXRoRWFybGllckRhdGEobGltaXQpO1xuXG4gICAgLy8gRmlyc3QgdHJ5IGZldGNoaW5nIGZyb20gREIsIHRoZW4gZnJvbSB0aGUgc2VydmVyLlxuICAgIHJldHVybiB0aGlzLl9sb2FkTWVzc2FnZXModGhpcy5fdGlub2RlLl9kYiwgcXVlcnkuZXh0cmFjdCgnZGF0YScpKVxuICAgICAgLnRoZW4oKGNvdW50KSA9PiB7XG4gICAgICAgIGlmIChjb3VudCA9PSBsaW1pdCkge1xuICAgICAgICAgIC8vIEdvdCBlbm91Z2ggbWVzc2FnZXMgZnJvbSBsb2NhbCBjYWNoZS5cbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHtcbiAgICAgICAgICAgIHRvcGljOiB0aGlzLm5hbWUsXG4gICAgICAgICAgICBjb2RlOiAyMDAsXG4gICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgY291bnQ6IGNvdW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZWR1Y2UgdGhlIGNvdW50IG9mIHJlcXVlc3RlZCBtZXNzYWdlcy5cbiAgICAgICAgbGltaXQgLT0gY291bnQ7XG4gICAgICAgIC8vIFVwZGF0ZSBxdWVyeSB3aXRoIG5ldyB2YWx1ZXMgbG9hZGVkIGZyb20gREIuXG4gICAgICAgIHF1ZXJ5ID0gZm9yd2FyZCA/IHRoaXMuc3RhcnRNZXRhUXVlcnkoKS53aXRoTGF0ZXJEYXRhKGxpbWl0KSA6XG4gICAgICAgICAgdGhpcy5zdGFydE1ldGFRdWVyeSgpLndpdGhFYXJsaWVyRGF0YShsaW1pdCk7XG4gICAgICAgIGxldCBwcm9taXNlID0gdGhpcy5nZXRNZXRhKHF1ZXJ5LmJ1aWxkKCkpO1xuICAgICAgICBpZiAoIWZvcndhcmQpIHtcbiAgICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChjdHJsKSA9PiB7XG4gICAgICAgICAgICBpZiAoY3RybCAmJiBjdHJsLnBhcmFtcyAmJiAhY3RybC5wYXJhbXMuY291bnQpIHtcbiAgICAgICAgICAgICAgdGhpcy5fbm9FYXJsaWVyTXNncyA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICB9KTtcbiAgfVxuICAvKipcbiAgICogVXBkYXRlIHRvcGljIG1ldGFkYXRhLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5TZXRQYXJhbXN9IHBhcmFtcyBwYXJhbWV0ZXJzIHRvIHVwZGF0ZS5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHJlcXVlc3QuXG4gICAqL1xuICBzZXRNZXRhKHBhcmFtcykge1xuICAgIGlmIChwYXJhbXMudGFncykge1xuICAgICAgcGFyYW1zLnRhZ3MgPSBub3JtYWxpemVBcnJheShwYXJhbXMudGFncyk7XG4gICAgfVxuICAgIC8vIFNlbmQgU2V0IG1lc3NhZ2UsIGhhbmRsZSBhc3luYyByZXNwb25zZS5cbiAgICByZXR1cm4gdGhpcy5fdGlub2RlLnNldE1ldGEodGhpcy5uYW1lLCBwYXJhbXMpXG4gICAgICAudGhlbigoY3RybCkgPT4ge1xuICAgICAgICBpZiAoY3RybCAmJiBjdHJsLmNvZGUgPj0gMzAwKSB7XG4gICAgICAgICAgLy8gTm90IG1vZGlmaWVkXG4gICAgICAgICAgcmV0dXJuIGN0cmw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGFyYW1zLnN1Yikge1xuICAgICAgICAgIHBhcmFtcy5zdWIudG9waWMgPSB0aGlzLm5hbWU7XG4gICAgICAgICAgaWYgKGN0cmwucGFyYW1zICYmIGN0cmwucGFyYW1zLmFjcykge1xuICAgICAgICAgICAgcGFyYW1zLnN1Yi5hY3MgPSBjdHJsLnBhcmFtcy5hY3M7XG4gICAgICAgICAgICBwYXJhbXMuc3ViLnVwZGF0ZWQgPSBjdHJsLnRzO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIXBhcmFtcy5zdWIudXNlcikge1xuICAgICAgICAgICAgLy8gVGhpcyBpcyBhIHN1YnNjcmlwdGlvbiB1cGRhdGUgb2YgdGhlIGN1cnJlbnQgdXNlci5cbiAgICAgICAgICAgIC8vIEFzc2lnbiB1c2VyIElEIG90aGVyd2lzZSB0aGUgdXBkYXRlIHdpbGwgYmUgaWdub3JlZCBieSBfcHJvY2Vzc01ldGFTdWIuXG4gICAgICAgICAgICBwYXJhbXMuc3ViLnVzZXIgPSB0aGlzLl90aW5vZGUuZ2V0Q3VycmVudFVzZXJJRCgpO1xuICAgICAgICAgICAgaWYgKCFwYXJhbXMuZGVzYykge1xuICAgICAgICAgICAgICAvLyBGb3JjZSB1cGRhdGUgdG8gdG9waWMncyBhc2MuXG4gICAgICAgICAgICAgIHBhcmFtcy5kZXNjID0ge307XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHBhcmFtcy5zdWIuX25vRm9yd2FyZGluZyA9IHRydWU7XG4gICAgICAgICAgdGhpcy5fcHJvY2Vzc01ldGFTdWIoW3BhcmFtcy5zdWJdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwYXJhbXMuZGVzYykge1xuICAgICAgICAgIGlmIChjdHJsLnBhcmFtcyAmJiBjdHJsLnBhcmFtcy5hY3MpIHtcbiAgICAgICAgICAgIHBhcmFtcy5kZXNjLmFjcyA9IGN0cmwucGFyYW1zLmFjcztcbiAgICAgICAgICAgIHBhcmFtcy5kZXNjLnVwZGF0ZWQgPSBjdHJsLnRzO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLl9wcm9jZXNzTWV0YURlc2MocGFyYW1zLmRlc2MpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBhcmFtcy50YWdzKSB7XG4gICAgICAgICAgdGhpcy5fcHJvY2Vzc01ldGFUYWdzKHBhcmFtcy50YWdzKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFyYW1zLmNyZWQpIHtcbiAgICAgICAgICB0aGlzLl9wcm9jZXNzTWV0YUNyZWRzKFtwYXJhbXMuY3JlZF0sIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGN0cmw7XG4gICAgICB9KTtcbiAgfVxuICAvKipcbiAgICogVXBkYXRlIGFjY2VzcyBtb2RlIG9mIHRoZSBjdXJyZW50IHVzZXIgb3Igb2YgYW5vdGhlciB0b3BpYyBzdWJzcmliZXIuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBVSUQgb2YgdGhlIHVzZXIgdG8gdXBkYXRlIG9yIG51bGwgdG8gdXBkYXRlIGN1cnJlbnQgdXNlci5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHVwZGF0ZSAtIHRoZSB1cGRhdGUgdmFsdWUsIGZ1bGwgb3IgZGVsdGEuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byByZXF1ZXN0LlxuICAgKi9cbiAgdXBkYXRlTW9kZSh1aWQsIHVwZGF0ZSkge1xuICAgIGNvbnN0IHVzZXIgPSB1aWQgPyB0aGlzLnN1YnNjcmliZXIodWlkKSA6IG51bGw7XG4gICAgY29uc3QgYW0gPSB1c2VyID9cbiAgICAgIHVzZXIuYWNzLnVwZGF0ZUdpdmVuKHVwZGF0ZSkuZ2V0R2l2ZW4oKSA6XG4gICAgICB0aGlzLmdldEFjY2Vzc01vZGUoKS51cGRhdGVXYW50KHVwZGF0ZSkuZ2V0V2FudCgpO1xuXG4gICAgcmV0dXJuIHRoaXMuc2V0TWV0YSh7XG4gICAgICBzdWI6IHtcbiAgICAgICAgdXNlcjogdWlkLFxuICAgICAgICBtb2RlOiBhbVxuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIC8qKlxuICAgKiBDcmVhdGUgbmV3IHRvcGljIHN1YnNjcmlwdGlvbi4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNzZXRNZXRhfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVpZCAtIElEIG9mIHRoZSB1c2VyIHRvIGludml0ZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IG1vZGUgLSBBY2Nlc3MgbW9kZS4gPGNvZGU+bnVsbDwvY29kZT4gbWVhbnMgdG8gdXNlIGRlZmF1bHQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byByZXF1ZXN0LlxuICAgKi9cbiAgaW52aXRlKHVpZCwgbW9kZSkge1xuICAgIHJldHVybiB0aGlzLnNldE1ldGEoe1xuICAgICAgc3ViOiB7XG4gICAgICAgIHVzZXI6IHVpZCxcbiAgICAgICAgbW9kZTogbW9kZVxuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIC8qKlxuICAgKiBBcmNoaXZlIG9yIHVuLWFyY2hpdmUgdGhlIHRvcGljLiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI3NldE1ldGF9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGFyY2ggLSB0cnVlIHRvIGFyY2hpdmUgdGhlIHRvcGljLCBmYWxzZSBvdGhlcndpc2UuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byByZXF1ZXN0LlxuICAgKi9cbiAgYXJjaGl2ZShhcmNoKSB7XG4gICAgaWYgKHRoaXMucHJpdmF0ZSAmJiAoIXRoaXMucHJpdmF0ZS5hcmNoID09ICFhcmNoKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShhcmNoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2V0TWV0YSh7XG4gICAgICBkZXNjOiB7XG4gICAgICAgIHByaXZhdGU6IHtcbiAgICAgICAgICBhcmNoOiBhcmNoID8gdHJ1ZSA6IENvbnN0LkRFTF9DSEFSXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICAvKipcbiAgICogRGVsZXRlIG1lc3NhZ2VzLiBIYXJkLWRlbGV0aW5nIG1lc3NhZ2VzIHJlcXVpcmVzIE93bmVyIHBlcm1pc3Npb24uXG4gICAqIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjZGVsTWVzc2FnZXN9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5EZWxSYW5nZVtdfSByYW5nZXMgLSBSYW5nZXMgb2YgbWVzc2FnZSBJRHMgdG8gZGVsZXRlLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBoYXJkIC0gSGFyZCBvciBzb2Z0IGRlbGV0ZVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gcmVxdWVzdC5cbiAgICovXG4gIGRlbE1lc3NhZ2VzKHJhbmdlcywgaGFyZCkge1xuICAgIGlmICghdGhpcy5fYXR0YWNoZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJDYW5ub3QgZGVsZXRlIG1lc3NhZ2VzIGluIGluYWN0aXZlIHRvcGljXCIpKTtcbiAgICB9XG5cbiAgICAvLyBTb3J0IHJhbmdlcyBpbiBhY2NlbmRpbmcgb3JkZXIgYnkgbG93LCB0aGUgZGVzY2VuZGluZyBieSBoaS5cbiAgICByYW5nZXMuc29ydCgocjEsIHIyKSA9PiB7XG4gICAgICBpZiAocjEubG93IDwgcjIubG93KSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKHIxLmxvdyA9PSByMi5sb3cpIHtcbiAgICAgICAgcmV0dXJuICFyMi5oaSB8fCAocjEuaGkgPj0gcjIuaGkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuXG4gICAgLy8gUmVtb3ZlIHBlbmRpbmcgbWVzc2FnZXMgZnJvbSByYW5nZXMgcG9zc2libHkgY2xpcHBpbmcgc29tZSByYW5nZXMuXG4gICAgbGV0IHRvc2VuZCA9IHJhbmdlcy5yZWR1Y2UoKG91dCwgcikgPT4ge1xuICAgICAgaWYgKHIubG93IDwgQ29uc3QuTE9DQUxfU0VRSUQpIHtcbiAgICAgICAgaWYgKCFyLmhpIHx8IHIuaGkgPCBDb25zdC5MT0NBTF9TRVFJRCkge1xuICAgICAgICAgIG91dC5wdXNoKHIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIENsaXAgaGkgdG8gbWF4IGFsbG93ZWQgdmFsdWUuXG4gICAgICAgICAgb3V0LnB1c2goe1xuICAgICAgICAgICAgbG93OiByLmxvdyxcbiAgICAgICAgICAgIGhpOiB0aGlzLl9tYXhTZXEgKyAxXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBvdXQ7XG4gICAgfSwgW10pO1xuXG4gICAgLy8gU2VuZCB7ZGVsfSBtZXNzYWdlLCByZXR1cm4gcHJvbWlzZVxuICAgIGxldCByZXN1bHQ7XG4gICAgaWYgKHRvc2VuZC5sZW5ndGggPiAwKSB7XG4gICAgICByZXN1bHQgPSB0aGlzLl90aW5vZGUuZGVsTWVzc2FnZXModGhpcy5uYW1lLCB0b3NlbmQsIGhhcmQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQgPSBQcm9taXNlLnJlc29sdmUoe1xuICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICBkZWw6IDBcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIC8vIFVwZGF0ZSBsb2NhbCBjYWNoZS5cbiAgICByZXR1cm4gcmVzdWx0LnRoZW4oKGN0cmwpID0+IHtcbiAgICAgIGlmIChjdHJsLnBhcmFtcy5kZWwgPiB0aGlzLl9tYXhEZWwpIHtcbiAgICAgICAgdGhpcy5fbWF4RGVsID0gY3RybC5wYXJhbXMuZGVsO1xuICAgICAgfVxuXG4gICAgICByYW5nZXMuZm9yRWFjaCgocikgPT4ge1xuICAgICAgICBpZiAoci5oaSkge1xuICAgICAgICAgIHRoaXMuZmx1c2hNZXNzYWdlUmFuZ2Uoci5sb3csIHIuaGkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZmx1c2hNZXNzYWdlKHIubG93KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuX3VwZGF0ZURlbGV0ZWRSYW5nZXMoKTtcblxuICAgICAgaWYgKHRoaXMub25EYXRhKSB7XG4gICAgICAgIC8vIENhbGxpbmcgd2l0aCBubyBwYXJhbWV0ZXJzIHRvIGluZGljYXRlIHRoZSBtZXNzYWdlcyB3ZXJlIGRlbGV0ZWQuXG4gICAgICAgIHRoaXMub25EYXRhKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY3RybDtcbiAgICB9KTtcbiAgfVxuICAvKipcbiAgICogRGVsZXRlIGFsbCBtZXNzYWdlcy4gSGFyZC1kZWxldGluZyBtZXNzYWdlcyByZXF1aXJlcyBPd25lciBwZXJtaXNzaW9uLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGhhcmREZWwgLSB0cnVlIGlmIG1lc3NhZ2VzIHNob3VsZCBiZSBoYXJkLWRlbGV0ZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byByZXF1ZXN0LlxuICAgKi9cbiAgZGVsTWVzc2FnZXNBbGwoaGFyZERlbCkge1xuICAgIGlmICghdGhpcy5fbWF4U2VxIHx8IHRoaXMuX21heFNlcSA8PSAwKSB7XG4gICAgICAvLyBUaGVyZSBhcmUgbm8gbWVzc2FnZXMgdG8gZGVsZXRlLlxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5kZWxNZXNzYWdlcyhbe1xuICAgICAgbG93OiAxLFxuICAgICAgaGk6IHRoaXMuX21heFNlcSArIDEsXG4gICAgICBfYWxsOiB0cnVlXG4gICAgfV0sIGhhcmREZWwpO1xuICB9XG4gIC8qKlxuICAgKiBEZWxldGUgbXVsdGlwbGUgbWVzc2FnZXMgZGVmaW5lZCBieSB0aGVpciBJRHMuIEhhcmQtZGVsZXRpbmcgbWVzc2FnZXMgcmVxdWlyZXMgT3duZXIgcGVybWlzc2lvbi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtUaW5vZGUuRGVsUmFuZ2VbXX0gbGlzdCAtIGxpc3Qgb2Ygc2VxIElEcyB0byBkZWxldGVcbiAgICogQHBhcmFtIHtib29sZWFuPX0gaGFyZERlbCAtIHRydWUgaWYgbWVzc2FnZXMgc2hvdWxkIGJlIGhhcmQtZGVsZXRlZC5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHJlcXVlc3QuXG4gICAqL1xuICBkZWxNZXNzYWdlc0xpc3QobGlzdCwgaGFyZERlbCkge1xuICAgIC8vIFNvcnQgdGhlIGxpc3QgaW4gYXNjZW5kaW5nIG9yZGVyXG4gICAgbGlzdC5zb3J0KChhLCBiKSA9PiBhIC0gYik7XG4gICAgLy8gQ29udmVydCB0aGUgYXJyYXkgb2YgSURzIHRvIHJhbmdlcy5cbiAgICBsZXQgcmFuZ2VzID0gbGlzdC5yZWR1Y2UoKG91dCwgaWQpID0+IHtcbiAgICAgIGlmIChvdXQubGVuZ3RoID09IDApIHtcbiAgICAgICAgLy8gRmlyc3QgZWxlbWVudC5cbiAgICAgICAgb3V0LnB1c2goe1xuICAgICAgICAgIGxvdzogaWRcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgcHJldiA9IG91dFtvdXQubGVuZ3RoIC0gMV07XG4gICAgICAgIGlmICgoIXByZXYuaGkgJiYgKGlkICE9IHByZXYubG93ICsgMSkpIHx8IChpZCA+IHByZXYuaGkpKSB7XG4gICAgICAgICAgLy8gTmV3IHJhbmdlLlxuICAgICAgICAgIG91dC5wdXNoKHtcbiAgICAgICAgICAgIGxvdzogaWRcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBFeHBhbmQgZXhpc3RpbmcgcmFuZ2UuXG4gICAgICAgICAgcHJldi5oaSA9IHByZXYuaGkgPyBNYXRoLm1heChwcmV2LmhpLCBpZCArIDEpIDogaWQgKyAxO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0O1xuICAgIH0sIFtdKTtcbiAgICAvLyBTZW5kIHtkZWx9IG1lc3NhZ2UsIHJldHVybiBwcm9taXNlXG4gICAgcmV0dXJuIHRoaXMuZGVsTWVzc2FnZXMocmFuZ2VzLCBoYXJkRGVsKTtcbiAgfVxuICAvKipcbiAgICogRGVsZXRlIHRvcGljLiBSZXF1aXJlcyBPd25lciBwZXJtaXNzaW9uLiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI2RlbFRvcGljfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBoYXJkIC0gaGFkLWRlbGV0ZSB0b3BpYy5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHRoZSByZXF1ZXN0LlxuICAgKi9cbiAgZGVsVG9waWMoaGFyZCkge1xuICAgIGlmICh0aGlzLl9kZWxldGVkKSB7XG4gICAgICAvLyBUaGUgdG9waWMgaXMgYWxyZWFkeSBkZWxldGVkIGF0IHRoZSBzZXJ2ZXIsIGp1c3QgcmVtb3ZlIGZyb20gREIuXG4gICAgICB0aGlzLl9nb25lKCk7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl90aW5vZGUuZGVsVG9waWModGhpcy5uYW1lLCBoYXJkKS50aGVuKChjdHJsKSA9PiB7XG4gICAgICB0aGlzLl9kZWxldGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuX3Jlc2V0U3ViKCk7XG4gICAgICB0aGlzLl9nb25lKCk7XG4gICAgICByZXR1cm4gY3RybDtcbiAgICB9KTtcbiAgfVxuICAvKipcbiAgICogRGVsZXRlIHN1YnNjcmlwdGlvbi4gUmVxdWlyZXMgU2hhcmUgcGVybWlzc2lvbi4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNkZWxTdWJzY3JpcHRpb259LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXNlciAtIElEIG9mIHRoZSB1c2VyIHRvIHJlbW92ZSBzdWJzY3JpcHRpb24gZm9yLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gcmVxdWVzdC5cbiAgICovXG4gIGRlbFN1YnNjcmlwdGlvbih1c2VyKSB7XG4gICAgaWYgKCF0aGlzLl9hdHRhY2hlZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkNhbm5vdCBkZWxldGUgc3Vic2NyaXB0aW9uIGluIGluYWN0aXZlIHRvcGljXCIpKTtcbiAgICB9XG4gICAgLy8gU2VuZCB7ZGVsfSBtZXNzYWdlLCByZXR1cm4gcHJvbWlzZVxuICAgIHJldHVybiB0aGlzLl90aW5vZGUuZGVsU3Vic2NyaXB0aW9uKHRoaXMubmFtZSwgdXNlcikudGhlbigoY3RybCkgPT4ge1xuICAgICAgLy8gUmVtb3ZlIHRoZSBvYmplY3QgZnJvbSB0aGUgc3Vic2NyaXB0aW9uIGNhY2hlO1xuICAgICAgZGVsZXRlIHRoaXMuX3VzZXJzW3VzZXJdO1xuICAgICAgLy8gTm90aWZ5IGxpc3RlbmVyc1xuICAgICAgaWYgKHRoaXMub25TdWJzVXBkYXRlZCkge1xuICAgICAgICB0aGlzLm9uU3Vic1VwZGF0ZWQoT2JqZWN0LmtleXModGhpcy5fdXNlcnMpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjdHJsO1xuICAgIH0pO1xuICB9XG4gIC8qKlxuICAgKiBTZW5kIGEgcmVhZC9yZWN2IG5vdGlmaWNhdGlvbi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHdoYXQgLSB3aGF0IG5vdGlmaWNhdGlvbiB0byBzZW5kOiA8Y29kZT5yZWN2PC9jb2RlPiwgPGNvZGU+cmVhZDwvY29kZT4uXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXEgLSBJRCBvciB0aGUgbWVzc2FnZSByZWFkIG9yIHJlY2VpdmVkLlxuICAgKi9cbiAgbm90ZSh3aGF0LCBzZXEpIHtcbiAgICBpZiAoIXRoaXMuX2F0dGFjaGVkKSB7XG4gICAgICAvLyBDYW5ub3Qgc2VuZGluZyB7bm90ZX0gb24gYW4gaW5hY3RpdmUgdG9waWNcIi5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBVcGRhdGUgbG9jYWwgY2FjaGUgd2l0aCB0aGUgbmV3IGNvdW50LlxuICAgIGNvbnN0IHVzZXIgPSB0aGlzLl91c2Vyc1t0aGlzLl90aW5vZGUuZ2V0Q3VycmVudFVzZXJJRCgpXTtcbiAgICBsZXQgdXBkYXRlID0gZmFsc2U7XG4gICAgaWYgKHVzZXIpIHtcbiAgICAgIC8vIFNlbGYtc3Vic2NyaXB0aW9uIGlzIGZvdW5kLlxuICAgICAgaWYgKCF1c2VyW3doYXRdIHx8IHVzZXJbd2hhdF0gPCBzZXEpIHtcbiAgICAgICAgdXNlclt3aGF0XSA9IHNlcTtcbiAgICAgICAgdXBkYXRlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gU2VsZi1zdWJzY3JpcHRpb24gaXMgbm90IGZvdW5kLlxuICAgICAgdXBkYXRlID0gKHRoaXNbd2hhdF0gfCAwKSA8IHNlcTtcbiAgICB9XG5cbiAgICBpZiAodXBkYXRlKSB7XG4gICAgICAvLyBTZW5kIG5vdGlmaWNhdGlvbiB0byB0aGUgc2VydmVyLlxuICAgICAgdGhpcy5fdGlub2RlLm5vdGUodGhpcy5uYW1lLCB3aGF0LCBzZXEpO1xuICAgICAgLy8gVXBkYXRlIGxvY2FsbHkgY2FjaGVkIGNvbnRhY3Qgd2l0aCB0aGUgbmV3IGNvdW50LlxuICAgICAgdGhpcy5fdXBkYXRlUmVhZFJlY3Yod2hhdCwgc2VxKTtcblxuICAgICAgaWYgKHRoaXMuYWNzICE9IG51bGwgJiYgIXRoaXMuYWNzLmlzTXV0ZWQoKSkge1xuICAgICAgICBjb25zdCBtZSA9IHRoaXMuX3Rpbm9kZS5nZXRNZVRvcGljKCk7XG4gICAgICAgIC8vIFNlbnQgYSBub3RpZmljYXRpb24gdG8gJ21lJyBsaXN0ZW5lcnMuXG4gICAgICAgIG1lLl9yZWZyZXNoQ29udGFjdCh3aGF0LCB0aGlzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2VuZCBhICdyZWN2JyByZWNlaXB0LiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI25vdGVSZWN2fS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHNlcSAtIElEIG9mIHRoZSBtZXNzYWdlIHRvIGFrbm93bGVkZ2UuXG4gICAqL1xuICBub3RlUmVjdihzZXEpIHtcbiAgICB0aGlzLm5vdGUoJ3JlY3YnLCBzZXEpO1xuICB9XG4gIC8qKlxuICAgKiBTZW5kIGEgJ3JlYWQnIHJlY2VpcHQuIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjbm90ZVJlYWR9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2VxIC0gSUQgb2YgdGhlIG1lc3NhZ2UgdG8gYWtub3dsZWRnZSBvciAwL3VuZGVmaW5lZCB0byBhY2tub3dsZWRnZSB0aGUgbGF0ZXN0IG1lc3NhZ2VzLlxuICAgKi9cbiAgbm90ZVJlYWQoc2VxKSB7XG4gICAgc2VxID0gc2VxIHx8IHRoaXMuX21heFNlcTtcbiAgICBpZiAoc2VxID4gMCkge1xuICAgICAgdGhpcy5ub3RlKCdyZWFkJywgc2VxKTtcbiAgICB9XG4gIH1cbiAgLyoqXG4gICAqIFNlbmQgYSBrZXktcHJlc3Mgbm90aWZpY2F0aW9uLiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI25vdGVLZXlQcmVzc30uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqL1xuICBub3RlS2V5UHJlc3MoKSB7XG4gICAgaWYgKHRoaXMuX2F0dGFjaGVkKSB7XG4gICAgICB0aGlzLl90aW5vZGUubm90ZUtleVByZXNzKHRoaXMubmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3Rpbm9kZS5sb2dnZXIoXCJJTkZPOiBDYW5ub3Qgc2VuZCBub3RpZmljYXRpb24gaW4gaW5hY3RpdmUgdG9waWNcIik7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBTZW5kIGEge25vdGUgd2hhdD0nY2FsbCd9LiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI3ZpZGVvQ2FsbH0uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldnQgLSBDYWxsIGV2ZW50LlxuICAgKiBAcGFyYW0ge2ludH0gc2VxIC0gSUQgb2YgdGhlIGNhbGwgbWVzc2FnZSB0aGUgZXZlbnQgcGVydGFpbnMgdG8uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXlsb2FkIC0gUGF5bG9hZCBhc3NvY2lhdGVkIHdpdGggdGhpcyBldmVudCAoZS5nLiBTRFAgc3RyaW5nKS5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgKGZvciBzb21lIGNhbGwgZXZlbnRzKSB3aGljaCB3aWxsXG4gICAqICAgICAgICAgICAgICAgICAgICBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5XG4gICAqL1xuICB2aWRlb0NhbGwoZXZ0LCBzZXEsIHBheWxvYWQpIHtcbiAgICBpZiAoIXRoaXMuX2F0dGFjaGVkICYmICFbJ3JpbmdpbmcnLCAnaGFuZy11cCddLmluY2x1ZGVzKGV2dCkpIHtcbiAgICAgIC8vIENhbm5vdCB7Y2FsbH0gb24gYW4gaW5hY3RpdmUgdG9waWNcIi5cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3Rpbm9kZS52aWRlb0NhbGwodGhpcy5uYW1lLCBzZXEsIGV2dCwgcGF5bG9hZCk7XG4gIH1cblxuICAvLyBVcGRhdGUgY2FjaGVkIHJlYWQvcmVjdi91bnJlYWQgY291bnRzLlxuICBfdXBkYXRlUmVhZFJlY3Yod2hhdCwgc2VxLCB0cykge1xuICAgIGxldCBvbGRWYWwsIGRvVXBkYXRlID0gZmFsc2U7XG5cbiAgICBzZXEgPSBzZXEgfCAwO1xuICAgIHRoaXMuc2VxID0gdGhpcy5zZXEgfCAwO1xuICAgIHRoaXMucmVhZCA9IHRoaXMucmVhZCB8IDA7XG4gICAgdGhpcy5yZWN2ID0gdGhpcy5yZWN2IHwgMDtcbiAgICBzd2l0Y2ggKHdoYXQpIHtcbiAgICAgIGNhc2UgJ3JlY3YnOlxuICAgICAgICBvbGRWYWwgPSB0aGlzLnJlY3Y7XG4gICAgICAgIHRoaXMucmVjdiA9IE1hdGgubWF4KHRoaXMucmVjdiwgc2VxKTtcbiAgICAgICAgZG9VcGRhdGUgPSAob2xkVmFsICE9IHRoaXMucmVjdik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncmVhZCc6XG4gICAgICAgIG9sZFZhbCA9IHRoaXMucmVhZDtcbiAgICAgICAgdGhpcy5yZWFkID0gTWF0aC5tYXgodGhpcy5yZWFkLCBzZXEpO1xuICAgICAgICBkb1VwZGF0ZSA9IChvbGRWYWwgIT0gdGhpcy5yZWFkKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtc2cnOlxuICAgICAgICBvbGRWYWwgPSB0aGlzLnNlcTtcbiAgICAgICAgdGhpcy5zZXEgPSBNYXRoLm1heCh0aGlzLnNlcSwgc2VxKTtcbiAgICAgICAgaWYgKCF0aGlzLnRvdWNoZWQgfHwgdGhpcy50b3VjaGVkIDwgdHMpIHtcbiAgICAgICAgICB0aGlzLnRvdWNoZWQgPSB0cztcbiAgICAgICAgfVxuICAgICAgICBkb1VwZGF0ZSA9IChvbGRWYWwgIT0gdGhpcy5zZXEpO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyBTYW5pdHkgY2hlY2tzLlxuICAgIGlmICh0aGlzLnJlY3YgPCB0aGlzLnJlYWQpIHtcbiAgICAgIHRoaXMucmVjdiA9IHRoaXMucmVhZDtcbiAgICAgIGRvVXBkYXRlID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKHRoaXMuc2VxIDwgdGhpcy5yZWN2KSB7XG4gICAgICB0aGlzLnNlcSA9IHRoaXMucmVjdjtcbiAgICAgIGlmICghdGhpcy50b3VjaGVkIHx8IHRoaXMudG91Y2hlZCA8IHRzKSB7XG4gICAgICAgIHRoaXMudG91Y2hlZCA9IHRzO1xuICAgICAgfVxuICAgICAgZG9VcGRhdGUgPSB0cnVlO1xuICAgIH1cbiAgICB0aGlzLnVucmVhZCA9IHRoaXMuc2VxIC0gdGhpcy5yZWFkO1xuICAgIHJldHVybiBkb1VwZGF0ZTtcbiAgfVxuICAvKipcbiAgICogR2V0IHVzZXIgZGVzY3JpcHRpb24gZnJvbSBnbG9iYWwgY2FjaGUuIFRoZSB1c2VyIGRvZXMgbm90IG5lZWQgdG8gYmUgYVxuICAgKiBzdWJzY3JpYmVyIG9mIHRoaXMgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBJRCBvZiB0aGUgdXNlciB0byBmZXRjaC5cbiAgICogQHJldHVybiB7T2JqZWN0fSB1c2VyIGRlc2NyaXB0aW9uIG9yIHVuZGVmaW5lZC5cbiAgICovXG4gIHVzZXJEZXNjKHVpZCkge1xuICAgIC8vIFRPRE86IGhhbmRsZSBhc3luY2hyb25vdXMgcmVxdWVzdHNcbiAgICBjb25zdCB1c2VyID0gdGhpcy5fY2FjaGVHZXRVc2VyKHVpZCk7XG4gICAgaWYgKHVzZXIpIHtcbiAgICAgIHJldHVybiB1c2VyOyAvLyBQcm9taXNlLnJlc29sdmUodXNlcilcbiAgICB9XG4gIH1cbiAgLyoqXG4gICAqIEdldCBkZXNjcmlwdGlvbiBvZiB0aGUgcDJwIHBlZXIgZnJvbSBzdWJzY3JpcHRpb24gY2FjaGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm4ge09iamVjdH0gcGVlcidzIGRlc2NyaXB0aW9uIG9yIHVuZGVmaW5lZC5cbiAgICovXG4gIHAycFBlZXJEZXNjKCkge1xuICAgIGlmICghdGhpcy5pc1AyUFR5cGUoKSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3VzZXJzW3RoaXMubmFtZV07XG4gIH1cbiAgLyoqXG4gICAqIEl0ZXJhdGUgb3ZlciBjYWNoZWQgc3Vic2NyaWJlcnMuIElmIGNhbGxiYWNrIGlzIHVuZGVmaW5lZCwgdXNlIHRoaXMub25NZXRhU3ViLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAtIENhbGxiYWNrIHdoaWNoIHdpbGwgcmVjZWl2ZSBzdWJzY3JpYmVycyBvbmUgYnkgb25lLlxuICAgKiBAcGFyYW0ge09iamVjdD19IGNvbnRleHQgLSBWYWx1ZSBvZiBgdGhpc2AgaW5zaWRlIHRoZSBgY2FsbGJhY2tgLlxuICAgKi9cbiAgc3Vic2NyaWJlcnMoY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICBjb25zdCBjYiA9IChjYWxsYmFjayB8fCB0aGlzLm9uTWV0YVN1Yik7XG4gICAgaWYgKGNiKSB7XG4gICAgICBmb3IgKGxldCBpZHggaW4gdGhpcy5fdXNlcnMpIHtcbiAgICAgICAgY2IuY2FsbChjb250ZXh0LCB0aGlzLl91c2Vyc1tpZHhdLCBpZHgsIHRoaXMuX3VzZXJzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLyoqXG4gICAqIEdldCBhIGNvcHkgb2YgY2FjaGVkIHRhZ3MuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm4ge0FycmF5LjxzdHJpbmc+fSBhIGNvcHkgb2YgdGFnc1xuICAgKi9cbiAgdGFncygpIHtcbiAgICAvLyBSZXR1cm4gYSBjb3B5LlxuICAgIHJldHVybiB0aGlzLl90YWdzLnNsaWNlKDApO1xuICB9XG4gIC8qKlxuICAgKiBHZXQgY2FjaGVkIHN1YnNjcmlwdGlvbiBmb3IgdGhlIGdpdmVuIHVzZXIgSUQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBpZCBvZiB0aGUgdXNlciB0byBxdWVyeSBmb3JcbiAgICogQHJldHVybiB1c2VyIGRlc2NyaXB0aW9uIG9yIHVuZGVmaW5lZC5cbiAgICovXG4gIHN1YnNjcmliZXIodWlkKSB7XG4gICAgcmV0dXJuIHRoaXMuX3VzZXJzW3VpZF07XG4gIH1cbiAgLyoqXG4gICAqIEl0ZXJhdGUgb3ZlciB2ZXJzaW9ucyBvZiA8Y29kZT5tZXNzYWdlPC9jb2RlPjogY2FsbCA8Y29kZT5jYWxsYmFjazwvY29kZT4gZm9yIGVhY2ggbWVzc2FnZS5cbiAgICogSWYgPGNvZGU+Y2FsbGJhY2s8L2NvZGU+IGlzIHVuZGVmaW5lZCwgZG9lcyBub3RoaW5nLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5Gb3JFYWNoQ2FsbGJhY2tUeXBlfSBjYWxsYmFjayAtIENhbGxiYWNrIHdoaWNoIHdpbGwgcmVjZWl2ZSBtZXNzYWdlcyBvbmUgYnkgb25lLiBTZWUge0BsaW5rIFRpbm9kZS5DQnVmZmVyI2ZvckVhY2h9XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gVmFsdWUgb2YgYHRoaXNgIGluc2lkZSB0aGUgYGNhbGxiYWNrYC5cbiAgICovXG4gIG1lc3NhZ2VWZXJzaW9ucyhtZXNzYWdlLCBjYWxsYmFjaywgY29udGV4dCkge1xuICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgIC8vIE5vIGNhbGxiYWNrPyBXZSBhcmUgZG9uZSB0aGVuLlxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBvcmlnU2VxID0gdGhpcy5faXNSZXBsYWNlbWVudE1zZyhtZXNzYWdlKSA/IHBhcnNlSW50KG1lc3NhZ2UuaGVhZC5yZXBsYWNlLnNwbGl0KCc6JylbMV0pIDogbWVzc2FnZS5zZXE7XG4gICAgY29uc3QgdmVyc2lvbnMgPSB0aGlzLl9tZXNzYWdlVmVyc2lvbnNbb3JpZ1NlcV07XG4gICAgaWYgKCF2ZXJzaW9ucykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2ZXJzaW9ucy5mb3JFYWNoKGNhbGxiYWNrLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgY29udGV4dCk7XG4gIH1cbiAgLyoqXG4gICAqIEl0ZXJhdGUgb3ZlciBjYWNoZWQgbWVzc2FnZXM6IGNhbGwgPGNvZGU+Y2FsbGJhY2s8L2NvZGU+IGZvciBlYWNoIG1lc3NhZ2UgaW4gdGhlIHJhbmdlIFtzaW5jZUlkeCwgYmVmb3JlSWR4KS5cbiAgICogSWYgPGNvZGU+Y2FsbGJhY2s8L2NvZGU+IGlzIHVuZGVmaW5lZCwgdXNlIDxjb2RlPnRoaXMub25EYXRhPC9jb2RlPi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtUaW5vZGUuRm9yRWFjaENhbGxiYWNrVHlwZX0gY2FsbGJhY2sgLSBDYWxsYmFjayB3aGljaCB3aWxsIHJlY2VpdmUgbWVzc2FnZXMgb25lIGJ5IG9uZS4gU2VlIHtAbGluayBUaW5vZGUuQ0J1ZmZlciNmb3JFYWNofVxuICAgKiBAcGFyYW0ge251bWJlcn0gc2luY2VJZCAtIE9wdGlvbmFsIHNlcUlkIHRvIHN0YXJ0IGl0ZXJhdGluZyBmcm9tIChpbmNsdXNpdmUpLlxuICAgKiBAcGFyYW0ge251bWJlcn0gYmVmb3JlSWQgLSBPcHRpb25hbCBzZXFJZCB0byBzdG9wIGl0ZXJhdGluZyBiZWZvcmUgaXQgaXMgcmVhY2hlZCAoZXhjbHVzaXZlKS5cbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSBWYWx1ZSBvZiBgdGhpc2AgaW5zaWRlIHRoZSBgY2FsbGJhY2tgLlxuICAgKi9cbiAgbWVzc2FnZXMoY2FsbGJhY2ssIHNpbmNlSWQsIGJlZm9yZUlkLCBjb250ZXh0KSB7XG4gICAgY29uc3QgY2IgPSAoY2FsbGJhY2sgfHwgdGhpcy5vbkRhdGEpO1xuICAgIGlmIChjYikge1xuICAgICAgY29uc3Qgc3RhcnRJZHggPSB0eXBlb2Ygc2luY2VJZCA9PSAnbnVtYmVyJyA/IHRoaXMuX21lc3NhZ2VzLmZpbmQoe1xuICAgICAgICBzZXE6IHNpbmNlSWRcbiAgICAgIH0sIHRydWUpIDogdW5kZWZpbmVkO1xuICAgICAgY29uc3QgYmVmb3JlSWR4ID0gdHlwZW9mIGJlZm9yZUlkID09ICdudW1iZXInID8gdGhpcy5fbWVzc2FnZXMuZmluZCh7XG4gICAgICAgIHNlcTogYmVmb3JlSWRcbiAgICAgIH0sIHRydWUpIDogdW5kZWZpbmVkO1xuICAgICAgaWYgKHN0YXJ0SWR4ICE9IC0xICYmIGJlZm9yZUlkeCAhPSAtMSkge1xuICAgICAgICAvLyBTdGVwIDEuIEZpbHRlciBvdXQgYWxsIHJlcGxhY2VtZW50IG1lc3NhZ2VzIGFuZFxuICAgICAgICAvLyBzYXZlIGRpc3BsYXlhYmxlIG1lc3NhZ2VzIGluIGEgdGVtcG9yYXJ5IGJ1ZmZlci5cbiAgICAgICAgbGV0IG1zZ3MgPSBbXTtcbiAgICAgICAgdGhpcy5fbWVzc2FnZXMuZm9yRWFjaCgobXNnLCB1bnVzZWQxLCB1bnVzZWQyLCBpKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMuX2lzUmVwbGFjZW1lbnRNc2cobXNnKSkge1xuICAgICAgICAgICAgLy8gU2tpcCByZXBsYWNlbWVudHMuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIG1zZ3MucHVzaCh7XG4gICAgICAgICAgICBkYXRhOiB0aGlzLmxhdGVzdE1zZ1ZlcnNpb24obXNnLnNlcSkgfHwgbXNnLFxuICAgICAgICAgICAgaWR4OiBpXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sIHN0YXJ0SWR4LCBiZWZvcmVJZHgsIHt9KTtcbiAgICAgICAgLy8gU3RlcCAyLiBMb29wIG92ZXIgZGlzcGxheWJsZSBtZXNzYWdlcyBpbnZva2luZyBjYiBvbiBlYWNoIG9mIHRoZW0uXG4gICAgICAgIG1zZ3MuZm9yRWFjaCgodmFsLCBpKSA9PiB7XG4gICAgICAgICAgY2IuY2FsbChjb250ZXh0LCB2YWwuZGF0YSxcbiAgICAgICAgICAgIChpID4gMCA/IG1zZ3NbaSAtIDFdLmRhdGEgOiB1bmRlZmluZWQpLFxuICAgICAgICAgICAgKGkgPCBtc2dzLmxlbmd0aCAtIDEgPyBtc2dzW2kgKyAxXS5kYXRhIDogdW5kZWZpbmVkKSwgdmFsLmlkeCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICAvKipcbiAgICogR2V0IHRoZSBtZXNzYWdlIGZyb20gY2FjaGUgYnkgPGNvZGU+c2VxPC9jb2RlPi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHNlcSAtIG1lc3NhZ2Ugc2VxSWQgdG8gc2VhcmNoIGZvci5cbiAgICogQHJldHVybnMge09iamVjdH0gdGhlIG1lc3NhZ2Ugd2l0aCB0aGUgZ2l2ZW4gPGNvZGU+c2VxPC9jb2RlPiBvciA8Y29kZT51bmRlZmluZWQ8L2NvZGU+LCBpZiBubyBzdWNoIG1lc3NhZ2UgaXMgZm91bmQuXG4gICAqL1xuICBmaW5kTWVzc2FnZShzZXEpIHtcbiAgICBjb25zdCBpZHggPSB0aGlzLl9tZXNzYWdlcy5maW5kKHtcbiAgICAgIHNlcTogc2VxXG4gICAgfSk7XG4gICAgaWYgKGlkeCA+PSAwKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbWVzc2FnZXMuZ2V0QXQoaWR4KTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICAvKipcbiAgICogR2V0IHRoZSBtb3N0IHJlY2VudCBtZXNzYWdlIGZyb20gY2FjaGUuIFRoaXMgbWV0aG9kIGNvdW50cyBhbGwgbWVzc2FnZXMsIGluY2x1ZGluZyBkZWxldGVkIHJhbmdlcy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtib29sZW59IHNraXBEZWxldGVkIC0gaWYgdGhlIGxhc3QgbWVzc2FnZSBpcyBhIGRlbGV0ZWQgcmFuZ2UsIGdldCB0aGUgb25lIGJlZm9yZSBpdC5cbiAgICogQHJldHVybnMge09iamVjdH0gdGhlIG1vc3QgcmVjZW50IGNhY2hlZCBtZXNzYWdlIG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4sIGlmIG5vIG1lc3NhZ2VzIGFyZSBjYWNoZWQuXG4gICAqL1xuICBsYXRlc3RNZXNzYWdlKHNraXBEZWxldGVkKSB7XG4gICAgY29uc3QgbXNnID0gdGhpcy5fbWVzc2FnZXMuZ2V0TGFzdCgpO1xuICAgIGlmICghc2tpcERlbGV0ZWQgfHwgIW1zZyB8fCBtc2cuX3N0YXR1cyAhPSBDb25zdC5NRVNTQUdFX1NUQVRVU19ERUxfUkFOR0UpIHtcbiAgICAgIHJldHVybiBtc2c7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9tZXNzYWdlcy5nZXRMYXN0KDEpO1xuICB9XG4gIC8qKlxuICAgKiBHZXQgdGhlIGxhdGVzdCB2ZXJzaW9uIGZvciBtZXNzYWdlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2VxIC0gb3JpZ2luYWwgc2VxIElEIG9mIHRoZSBtZXNzYWdlLlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSB0aGUgbGF0ZXN0IHZlcnNpb24gb2YgdGhlIG1lc3NhZ2Ugb3IgbnVsbCBpZiBtZXNzYWdlIG5vdCBmb3VuZC5cbiAgICovXG4gIGxhdGVzdE1zZ1ZlcnNpb24oc2VxKSB7XG4gICAgY29uc3QgdmVyc2lvbnMgPSB0aGlzLl9tZXNzYWdlVmVyc2lvbnNbc2VxXTtcbiAgICByZXR1cm4gdmVyc2lvbnMgPyB2ZXJzaW9ucy5nZXRMYXN0KCkgOiBudWxsO1xuICB9XG4gIC8qKlxuICAgKiBHZXQgdGhlIG1heGltdW0gY2FjaGVkIHNlcSBJRC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHJldHVybnMge251bWJlcn0gdGhlIGdyZWF0ZXN0IHNlcSBJRCBpbiBjYWNoZS5cbiAgICovXG4gIG1heE1zZ1NlcSgpIHtcbiAgICByZXR1cm4gdGhpcy5fbWF4U2VxO1xuICB9XG4gIC8qKlxuICAgKiBHZXQgdGhlIG1heGltdW0gZGVsZXRpb24gSUQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IHRoZSBncmVhdGVzdCBkZWxldGlvbiBJRC5cbiAgICovXG4gIG1heENsZWFySWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX21heERlbDtcbiAgfVxuICAvKipcbiAgICogR2V0IHRoZSBudW1iZXIgb2YgbWVzc2FnZXMgaW4gdGhlIGNhY2hlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBjb3VudCBvZiBjYWNoZWQgbWVzc2FnZXMuXG4gICAqL1xuICBtZXNzYWdlQ291bnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX21lc3NhZ2VzLmxlbmd0aCgpO1xuICB9XG4gIC8qKlxuICAgKiBJdGVyYXRlIG92ZXIgY2FjaGVkIHVuc2VudCBtZXNzYWdlcy4gV3JhcHMge0BsaW5rIFRpbm9kZS5Ub3BpYyNtZXNzYWdlc30uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0gQ2FsbGJhY2sgd2hpY2ggd2lsbCByZWNlaXZlIG1lc3NhZ2VzIG9uZSBieSBvbmUuIFNlZSB7QGxpbmsgVGlub2RlLkNCdWZmZXIjZm9yRWFjaH1cbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSBWYWx1ZSBvZiA8Y29kZT50aGlzPC9jb2RlPiBpbnNpZGUgdGhlIDxjb2RlPmNhbGxiYWNrPC9jb2RlPi5cbiAgICovXG4gIHF1ZXVlZE1lc3NhZ2VzKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FsbGJhY2sgbXVzdCBiZSBwcm92aWRlZFwiKTtcbiAgICB9XG4gICAgdGhpcy5tZXNzYWdlcyhjYWxsYmFjaywgQ29uc3QuTE9DQUxfU0VRSUQsIHVuZGVmaW5lZCwgY29udGV4dCk7XG4gIH1cbiAgLyoqXG4gICAqIEdldCB0aGUgbnVtYmVyIG9mIHRvcGljIHN1YnNjcmliZXJzIHdobyBtYXJrZWQgdGhpcyBtZXNzYWdlIGFzIGVpdGhlciByZWN2IG9yIHJlYWRcbiAgICogQ3VycmVudCB1c2VyIGlzIGV4Y2x1ZGVkIGZyb20gdGhlIGNvdW50LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gd2hhdCAtIHdoYXQgYWN0aW9uIHRvIGNvbnNpZGVyOiByZWNlaXZlZCA8Y29kZT5cInJlY3ZcIjwvY29kZT4gb3IgcmVhZCA8Y29kZT5cInJlYWRcIjwvY29kZT4uXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXEgLSBJRCBvciB0aGUgbWVzc2FnZSByZWFkIG9yIHJlY2VpdmVkLlxuICAgKlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSB0aGUgbnVtYmVyIG9mIHN1YnNjcmliZXJzIHdobyBtYXJrZWQgdGhlIG1lc3NhZ2Ugd2l0aCB0aGUgZ2l2ZW4gSUQgYXMgcmVhZCBvciByZWNlaXZlZC5cbiAgICovXG4gIG1zZ1JlY2VpcHRDb3VudCh3aGF0LCBzZXEpIHtcbiAgICBsZXQgY291bnQgPSAwO1xuICAgIGlmIChzZXEgPiAwKSB7XG4gICAgICBjb25zdCBtZSA9IHRoaXMuX3Rpbm9kZS5nZXRDdXJyZW50VXNlcklEKCk7XG4gICAgICBmb3IgKGxldCBpZHggaW4gdGhpcy5fdXNlcnMpIHtcbiAgICAgICAgY29uc3QgdXNlciA9IHRoaXMuX3VzZXJzW2lkeF07XG4gICAgICAgIGlmICh1c2VyLnVzZXIgIT09IG1lICYmIHVzZXJbd2hhdF0gPj0gc2VxKSB7XG4gICAgICAgICAgY291bnQrKztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY291bnQ7XG4gIH1cbiAgLyoqXG4gICAqIEdldCB0aGUgbnVtYmVyIG9mIHRvcGljIHN1YnNjcmliZXJzIHdobyBtYXJrZWQgdGhpcyBtZXNzYWdlIChhbmQgYWxsIG9sZGVyIG1lc3NhZ2VzKSBhcyByZWFkLlxuICAgKiBUaGUgY3VycmVudCB1c2VyIGlzIGV4Y2x1ZGVkIGZyb20gdGhlIGNvdW50LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2VxIC0gbWVzc2FnZSBpZCB0byBjaGVjay5cbiAgICogQHJldHVybnMge251bWJlcn0gbnVtYmVyIG9mIHN1YnNjcmliZXJzIHdobyBjbGFpbSB0byBoYXZlIHJlY2VpdmVkIHRoZSBtZXNzYWdlLlxuICAgKi9cbiAgbXNnUmVhZENvdW50KHNlcSkge1xuICAgIHJldHVybiB0aGlzLm1zZ1JlY2VpcHRDb3VudCgncmVhZCcsIHNlcSk7XG4gIH1cbiAgLyoqXG4gICAqIEdldCB0aGUgbnVtYmVyIG9mIHRvcGljIHN1YnNjcmliZXJzIHdobyBtYXJrZWQgdGhpcyBtZXNzYWdlIChhbmQgYWxsIG9sZGVyIG1lc3NhZ2VzKSBhcyByZWNlaXZlZC5cbiAgICogVGhlIGN1cnJlbnQgdXNlciBpcyBleGNsdWRlZCBmcm9tIHRoZSBjb3VudC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHNlcSAtIE1lc3NhZ2UgaWQgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IE51bWJlciBvZiBzdWJzY3JpYmVycyB3aG8gY2xhaW0gdG8gaGF2ZSByZWNlaXZlZCB0aGUgbWVzc2FnZS5cbiAgICovXG4gIG1zZ1JlY3ZDb3VudChzZXEpIHtcbiAgICByZXR1cm4gdGhpcy5tc2dSZWNlaXB0Q291bnQoJ3JlY3YnLCBzZXEpO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiBjYWNoZWQgbWVzc2FnZSBJRHMgaW5kaWNhdGUgdGhhdCB0aGUgc2VydmVyIG1heSBoYXZlIG1vcmUgbWVzc2FnZXMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gbmV3ZXIgLSBpZiA8Y29kZT50cnVlPC9jb2RlPiwgY2hlY2sgZm9yIG5ld2VyIG1lc3NhZ2VzIG9ubHkuXG4gICAqL1xuICBtc2dIYXNNb3JlTWVzc2FnZXMobmV3ZXIpIHtcbiAgICByZXR1cm4gbmV3ZXIgPyB0aGlzLnNlcSA+IHRoaXMuX21heFNlcSA6XG4gICAgICAvLyBfbWluU2VxIGNvdWxkIGJlIG1vcmUgdGhhbiAxLCBidXQgZWFybGllciBtZXNzYWdlcyBjb3VsZCBoYXZlIGJlZW4gZGVsZXRlZC5cbiAgICAgICh0aGlzLl9taW5TZXEgPiAxICYmICF0aGlzLl9ub0VhcmxpZXJNc2dzKTtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIGdpdmVuIHNlcSBJZCBpcyBpZCBvZiB0aGUgbW9zdCByZWNlbnQgbWVzc2FnZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHNlcUlkIGlkIG9mIHRoZSBtZXNzYWdlIHRvIGNoZWNrXG4gICAqL1xuICBpc05ld01lc3NhZ2Uoc2VxSWQpIHtcbiAgICByZXR1cm4gdGhpcy5fbWF4U2VxIDw9IHNlcUlkO1xuICB9XG4gIC8qKlxuICAgKiBSZW1vdmUgb25lIG1lc3NhZ2UgZnJvbSBsb2NhbCBjYWNoZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHNlcUlkIGlkIG9mIHRoZSBtZXNzYWdlIHRvIHJlbW92ZSBmcm9tIGNhY2hlLlxuICAgKiBAcmV0dXJucyB7TWVzc2FnZX0gcmVtb3ZlZCBtZXNzYWdlIG9yIHVuZGVmaW5lZCBpZiBzdWNoIG1lc3NhZ2Ugd2FzIG5vdCBmb3VuZC5cbiAgICovXG4gIGZsdXNoTWVzc2FnZShzZXFJZCkge1xuICAgIGNvbnN0IGlkeCA9IHRoaXMuX21lc3NhZ2VzLmZpbmQoe1xuICAgICAgc2VxOiBzZXFJZFxuICAgIH0pO1xuICAgIGlmIChpZHggPj0gMCkge1xuICAgICAgdGhpcy5fdGlub2RlLl9kYi5yZW1NZXNzYWdlcyh0aGlzLm5hbWUsIHNlcUlkKTtcbiAgICAgIHJldHVybiB0aGlzLl9tZXNzYWdlcy5kZWxBdChpZHgpO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIC8qKlxuICAgKiBVcGRhdGUgbWVzc2FnZSdzIHNlcUlkLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcHViIG1lc3NhZ2Ugb2JqZWN0LlxuICAgKiBAcGFyYW0ge251bWJlcn0gbmV3U2VxSWQgbmV3IHNlcSBpZCBmb3IgcHViLlxuICAgKi9cbiAgc3dhcE1lc3NhZ2VJZChwdWIsIG5ld1NlcUlkKSB7XG4gICAgY29uc3QgaWR4ID0gdGhpcy5fbWVzc2FnZXMuZmluZChwdWIpO1xuICAgIGNvbnN0IG51bU1lc3NhZ2VzID0gdGhpcy5fbWVzc2FnZXMubGVuZ3RoKCk7XG4gICAgaWYgKDAgPD0gaWR4ICYmIGlkeCA8IG51bU1lc3NhZ2VzKSB7XG4gICAgICAvLyBSZW1vdmUgbWVzc2FnZSB3aXRoIHRoZSBvbGQgc2VxIElELlxuICAgICAgdGhpcy5fbWVzc2FnZXMuZGVsQXQoaWR4KTtcbiAgICAgIHRoaXMuX3Rpbm9kZS5fZGIucmVtTWVzc2FnZXModGhpcy5uYW1lLCBwdWIuc2VxKTtcbiAgICAgIC8vIEFkZCBtZXNzYWdlIHdpdGggdGhlIG5ldyBzZXEgSUQuXG4gICAgICBwdWIuc2VxID0gbmV3U2VxSWQ7XG4gICAgICB0aGlzLl9tZXNzYWdlcy5wdXQocHViKTtcbiAgICAgIHRoaXMuX3Rpbm9kZS5fZGIuYWRkTWVzc2FnZShwdWIpO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICogUmVtb3ZlIGEgcmFuZ2Ugb2YgbWVzc2FnZXMgZnJvbSB0aGUgbG9jYWwgY2FjaGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBmcm9tSWQgc2VxIElEIG9mIHRoZSBmaXJzdCBtZXNzYWdlIHRvIHJlbW92ZSAoaW5jbHVzaXZlKS5cbiAgICogQHBhcmFtIHtudW1iZXJ9IHVudGlsSWQgc2VxSUQgb2YgdGhlIGxhc3QgbWVzc2FnZSB0byByZW1vdmUgKGV4Y2x1c2l2ZSkuXG4gICAqXG4gICAqIEByZXR1cm5zIHtNZXNzYWdlW119IGFycmF5IG9mIHJlbW92ZWQgbWVzc2FnZXMgKGNvdWxkIGJlIGVtcHR5KS5cbiAgICovXG4gIGZsdXNoTWVzc2FnZVJhbmdlKGZyb21JZCwgdW50aWxJZCkge1xuICAgIC8vIFJlbW92ZSByYW5nZSBmcm9tIHBlcnNpc3RlbnQgY2FjaGUuXG4gICAgdGhpcy5fdGlub2RlLl9kYi5yZW1NZXNzYWdlcyh0aGlzLm5hbWUsIGZyb21JZCwgdW50aWxJZCk7XG4gICAgLy8gc3RhcnQsIGVuZDogZmluZCBpbnNlcnRpb24gcG9pbnRzIChuZWFyZXN0ID09IHRydWUpLlxuICAgIGNvbnN0IHNpbmNlID0gdGhpcy5fbWVzc2FnZXMuZmluZCh7XG4gICAgICBzZXE6IGZyb21JZFxuICAgIH0sIHRydWUpO1xuICAgIHJldHVybiBzaW5jZSA+PSAwID8gdGhpcy5fbWVzc2FnZXMuZGVsUmFuZ2Uoc2luY2UsIHRoaXMuX21lc3NhZ2VzLmZpbmQoe1xuICAgICAgc2VxOiB1bnRpbElkXG4gICAgfSwgdHJ1ZSkpIDogW107XG4gIH1cbiAgLyoqXG4gICAqIEF0dGVtcHQgdG8gc3RvcCBtZXNzYWdlIGZyb20gYmVpbmcgc2VudC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHNlcUlkIGlkIG9mIHRoZSBtZXNzYWdlIHRvIHN0b3Agc2VuZGluZyBhbmQgcmVtb3ZlIGZyb20gY2FjaGUuXG4gICAqXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiBtZXNzYWdlIHdhcyBjYW5jZWxsZWQsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBjYW5jZWxTZW5kKHNlcUlkKSB7XG4gICAgY29uc3QgaWR4ID0gdGhpcy5fbWVzc2FnZXMuZmluZCh7XG4gICAgICBzZXE6IHNlcUlkXG4gICAgfSk7XG4gICAgaWYgKGlkeCA+PSAwKSB7XG4gICAgICBjb25zdCBtc2cgPSB0aGlzLl9tZXNzYWdlcy5nZXRBdChpZHgpO1xuICAgICAgY29uc3Qgc3RhdHVzID0gdGhpcy5tc2dTdGF0dXMobXNnKTtcbiAgICAgIGlmIChzdGF0dXMgPT0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfUVVFVUVEIHx8IHN0YXR1cyA9PSBDb25zdC5NRVNTQUdFX1NUQVRVU19GQUlMRUQpIHtcbiAgICAgICAgdGhpcy5fdGlub2RlLl9kYi5yZW1NZXNzYWdlcyh0aGlzLm5hbWUsIHNlcUlkKTtcbiAgICAgICAgbXNnLl9jYW5jZWxsZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLl9tZXNzYWdlcy5kZWxBdChpZHgpO1xuICAgICAgICBpZiAodGhpcy5vbkRhdGEpIHtcbiAgICAgICAgICAvLyBDYWxsaW5nIHdpdGggbm8gcGFyYW1ldGVycyB0byBpbmRpY2F0ZSB0aGUgbWVzc2FnZSB3YXMgZGVsZXRlZC5cbiAgICAgICAgICB0aGlzLm9uRGF0YSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLyoqXG4gICAqIEdldCB0eXBlIG9mIHRoZSB0b3BpYzogbWUsIHAycCwgZ3JwLCBmbmQuLi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHJldHVybnMge3N0cmluZ30gT25lIG9mICdtZScsICdwMnAnLCAnZ3JwJywgJ2ZuZCcsICdzeXMnIG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4uXG4gICAqL1xuICBnZXRUeXBlKCkge1xuICAgIHJldHVybiBUb3BpYy50b3BpY1R5cGUodGhpcy5uYW1lKTtcbiAgfVxuICAvKipcbiAgICogR2V0IGN1cnJlbnQgdXNlcidzIGFjY2VzcyBtb2RlIG9mIHRoZSB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5BY2Nlc3NNb2RlfSAtIHVzZXIncyBhY2Nlc3MgbW9kZVxuICAgKi9cbiAgZ2V0QWNjZXNzTW9kZSgpIHtcbiAgICByZXR1cm4gdGhpcy5hY3M7XG4gIH1cbiAgLyoqXG4gICAqIFNldCBjdXJyZW50IHVzZXIncyBhY2Nlc3MgbW9kZSBvZiB0aGUgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7QWNjZXNzTW9kZSB8IE9iamVjdH0gYWNzIC0gYWNjZXNzIG1vZGUgdG8gc2V0LlxuICAgKi9cbiAgc2V0QWNjZXNzTW9kZShhY3MpIHtcbiAgICByZXR1cm4gdGhpcy5hY3MgPSBuZXcgQWNjZXNzTW9kZShhY3MpO1xuICB9XG4gIC8qKlxuICAgKiBHZXQgdG9waWMncyBkZWZhdWx0IGFjY2VzcyBtb2RlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLkRlZkFjc30gLSBhY2Nlc3MgbW9kZSwgc3VjaCBhcyB7YXV0aDogYFJXUGAsIGFub246IGBOYH0uXG4gICAqL1xuICBnZXREZWZhdWx0QWNjZXNzKCkge1xuICAgIHJldHVybiB0aGlzLmRlZmFjcztcbiAgfVxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBuZXcgbWV0YSB7QGxpbmsgVGlub2RlLkdldFF1ZXJ5fSBidWlsZGVyLiBUaGUgcXVlcnkgaXMgYXR0Y2hlZCB0byB0aGUgY3VycmVudCB0b3BpYy5cbiAgICogSXQgd2lsbCBub3Qgd29yayBjb3JyZWN0bHkgaWYgdXNlZCB3aXRoIGEgZGlmZmVyZW50IHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSBxdWVyeSBhdHRhY2hlZCB0byB0aGUgY3VycmVudCB0b3BpYy5cbiAgICovXG4gIHN0YXJ0TWV0YVF1ZXJ5KCkge1xuICAgIHJldHVybiBuZXcgTWV0YUdldEJ1aWxkZXIodGhpcyk7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRvcGljIGlzIGFyY2hpdmVkLCBpLmUuIHByaXZhdGUuYXJjaCA9PSB0cnVlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0b3BpYyBpcyBhcmNoaXZlZCwgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIGlzQXJjaGl2ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJpdmF0ZSAmJiAhIXRoaXMucHJpdmF0ZS5hcmNoO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0b3BpYyBpcyBhICdtZScgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIHRvcGljIGlzIGEgJ21lJyB0b3BpYywgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIGlzTWVUeXBlKCkge1xuICAgIHJldHVybiBUb3BpYy5pc01lVG9waWNOYW1lKHRoaXMubmFtZSk7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRvcGljIGlzIGEgY2hhbm5lbC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdG9waWMgaXMgYSBjaGFubmVsLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNDaGFubmVsVHlwZSgpIHtcbiAgICByZXR1cm4gVG9waWMuaXNDaGFubmVsVG9waWNOYW1lKHRoaXMubmFtZSk7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRvcGljIGlzIGEgZ3JvdXAgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIHRvcGljIGlzIGEgZ3JvdXAsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBpc0dyb3VwVHlwZSgpIHtcbiAgICByZXR1cm4gVG9waWMuaXNHcm91cFRvcGljTmFtZSh0aGlzLm5hbWUpO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0b3BpYyBpcyBhIHAycCB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdG9waWMgaXMgYSBwMnAgdG9waWMsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBpc1AyUFR5cGUoKSB7XG4gICAgcmV0dXJuIFRvcGljLmlzUDJQVG9waWNOYW1lKHRoaXMubmFtZSk7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRvcGljIGlzIGEgY29tbXVuaWNhdGlvbiB0b3BpYywgaS5lLiBhIGdyb3VwIG9yIHAycCB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdG9waWMgaXMgYSBwMnAgb3IgZ3JvdXAgdG9waWMsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBpc0NvbW1UeXBlKCkge1xuICAgIHJldHVybiBUb3BpYy5pc0NvbW1Ub3BpY05hbWUodGhpcy5uYW1lKTtcbiAgfVxuICAvKipcbiAgICogR2V0IHN0YXR1cyAocXVldWVkLCBzZW50LCByZWNlaXZlZCBldGMpIG9mIGEgZ2l2ZW4gbWVzc2FnZSBpbiB0aGUgY29udGV4dFxuICAgKiBvZiB0aGlzIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge01lc3NhZ2V9IG1zZyAtIG1lc3NhZ2UgdG8gY2hlY2sgZm9yIHN0YXR1cy5cbiAgICogQHBhcmFtIHtib29sZWFufSB1cGQgLSB1cGRhdGUgY2hhY2hlZCBtZXNzYWdlIHN0YXR1cy5cbiAgICpcbiAgICogQHJldHVybnMgbWVzc2FnZSBzdGF0dXMgY29uc3RhbnQuXG4gICAqL1xuICBtc2dTdGF0dXMobXNnLCB1cGQpIHtcbiAgICBsZXQgc3RhdHVzID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfTk9ORTtcbiAgICBpZiAodGhpcy5fdGlub2RlLmlzTWUobXNnLmZyb20pKSB7XG4gICAgICBpZiAobXNnLl9zZW5kaW5nKSB7XG4gICAgICAgIHN0YXR1cyA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX1NFTkRJTkc7XG4gICAgICB9IGVsc2UgaWYgKG1zZy5fZmFpbGVkIHx8IG1zZy5fY2FuY2VsbGVkKSB7XG4gICAgICAgIHN0YXR1cyA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX0ZBSUxFRDtcbiAgICAgIH0gZWxzZSBpZiAobXNnLnNlcSA+PSBDb25zdC5MT0NBTF9TRVFJRCkge1xuICAgICAgICBzdGF0dXMgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19RVUVVRUQ7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMubXNnUmVhZENvdW50KG1zZy5zZXEpID4gMCkge1xuICAgICAgICBzdGF0dXMgPSBDb25zdC5NRVNTQUdFX1NUQVRVU19SRUFEO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLm1zZ1JlY3ZDb3VudChtc2cuc2VxKSA+IDApIHtcbiAgICAgICAgc3RhdHVzID0gQ29uc3QuTUVTU0FHRV9TVEFUVVNfUkVDRUlWRUQ7XG4gICAgICB9IGVsc2UgaWYgKG1zZy5zZXEgPiAwKSB7XG4gICAgICAgIHN0YXR1cyA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX1NFTlQ7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChtc2cuX3N0YXR1cyA9PSBDb25zdC5NRVNTQUdFX1NUQVRVU19ERUxfUkFOR0UpIHtcbiAgICAgIHN0YXR1cyA9PSBDb25zdC5NRVNTQUdFX1NUQVRVU19ERUxfUkFOR0U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXR1cyA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX1RPX01FO1xuICAgIH1cblxuICAgIGlmICh1cGQgJiYgbXNnLl9zdGF0dXMgIT0gc3RhdHVzKSB7XG4gICAgICBtc2cuX3N0YXR1cyA9IHN0YXR1cztcbiAgICAgIHRoaXMuX3Rpbm9kZS5fZGIudXBkTWVzc2FnZVN0YXR1cyh0aGlzLm5hbWUsIG1zZy5zZXEsIHN0YXR1cyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0YXR1cztcbiAgfVxuXG4gIC8vIFJldHVybnMgdHJ1ZSBpZiBwdWIgaXMgbWVhbnQgdG8gcmVwbGFjZSBhbm90aGVyIG1lc3NhZ2UgKGUuZy4gb3JpZ2luYWwgbWVzc2FnZSB3YXMgZWRpdGVkKS5cbiAgX2lzUmVwbGFjZW1lbnRNc2cocHViKSB7XG4gICAgcmV0dXJuIHB1Yi5oZWFkICYmIHB1Yi5oZWFkLnJlcGxhY2U7XG4gIH1cblxuICAvLyBJZiBtc2cgaXMgYSByZXBsYWNlbWVudCBmb3IgYW5vdGhlciBtZXNzYWdlLCBzYXZlcyBtc2cgaW4gdGhlIG1lc3NhZ2UgdmVyc2lvbnMgY2FjaGVcbiAgLy8gYXMgYSBuZXdlciB2ZXJzaW9uIGZvciB0aGUgbWVzc2FnZSBpdCdzIHN1cHBvc2VkIHRvIHJlcGxhY2UuXG4gIF9tYXliZVVwZGF0ZU1lc3NhZ2VWZXJzaW9uc0NhY2hlKG1zZykge1xuICAgIGlmICghdGhpcy5faXNSZXBsYWNlbWVudE1zZyhtc2cpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHRhcmdldFNlcSA9IHBhcnNlSW50KG1zZy5oZWFkLnJlcGxhY2Uuc3BsaXQoJzonKVsxXSk7XG4gICAgaWYgKHRhcmdldFNlcSA+IG1zZy5zZXEpIHtcbiAgICAgIC8vIFN1YnN0aXR1dGVzIGFyZSBzdXBwb3NlZCB0byBoYXZlIGhpZ2hlciBzZXEgaWRzLlxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBsZXQgdmVyc2lvbnMgPSB0aGlzLl9tZXNzYWdlVmVyc2lvbnNbdGFyZ2V0U2VxXSB8fCBuZXcgQ0J1ZmZlcigoYSwgYikgPT4ge1xuICAgICAgcmV0dXJuIGEuc2VxIC0gYi5zZXE7XG4gICAgfSwgdHJ1ZSk7XG4gICAgdmVyc2lvbnMucHV0KG1zZyk7XG4gICAgdGhpcy5fbWVzc2FnZVZlcnNpb25zW3RhcmdldFNlcV0gPSB2ZXJzaW9ucztcbiAgfVxuXG4gIC8vIFByb2Nlc3MgZGF0YSBtZXNzYWdlXG4gIF9yb3V0ZURhdGEoZGF0YSkge1xuICAgIGlmIChkYXRhLmNvbnRlbnQpIHtcbiAgICAgIGlmICghdGhpcy50b3VjaGVkIHx8IHRoaXMudG91Y2hlZCA8IGRhdGEudHMpIHtcbiAgICAgICAgdGhpcy50b3VjaGVkID0gZGF0YS50cztcbiAgICAgICAgdGhpcy5fdGlub2RlLl9kYi51cGRUb3BpYyh0aGlzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZGF0YS5zZXEgPiB0aGlzLl9tYXhTZXEpIHtcbiAgICAgIHRoaXMuX21heFNlcSA9IGRhdGEuc2VxO1xuICAgICAgdGhpcy5tc2dTdGF0dXMoZGF0YSwgdHJ1ZSk7XG4gICAgICAvLyBBY2tuIHJlY2VpdmluZyB0aGUgbWVzc2FnZS5cbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9yZWN2Tm90aWZpY2F0aW9uVGltZXIpO1xuICAgICAgdGhpcy5fcmVjdk5vdGlmaWNhdGlvblRpbWVyID0gc2V0VGltZW91dChfID0+IHtcbiAgICAgICAgdGhpcy5fcmVjdk5vdGlmaWNhdGlvblRpbWVyID0gbnVsbDtcbiAgICAgICAgdGhpcy5ub3RlUmVjdih0aGlzLl9tYXhTZXEpO1xuICAgICAgfSwgQ29uc3QuUkVDVl9USU1FT1VUKTtcbiAgICB9XG5cbiAgICBpZiAoZGF0YS5zZXEgPCB0aGlzLl9taW5TZXEgfHwgdGhpcy5fbWluU2VxID09IDApIHtcbiAgICAgIHRoaXMuX21pblNlcSA9IGRhdGEuc2VxO1xuICAgIH1cblxuICAgIGNvbnN0IG91dGdvaW5nID0gKCghdGhpcy5pc0NoYW5uZWxUeXBlKCkgJiYgIWRhdGEuZnJvbSkgfHwgdGhpcy5fdGlub2RlLmlzTWUoZGF0YS5mcm9tKSk7XG5cbiAgICBpZiAoZGF0YS5oZWFkICYmIGRhdGEuaGVhZC53ZWJydGMgJiYgZGF0YS5oZWFkLm1pbWUgPT0gRHJhZnR5LmdldENvbnRlbnRUeXBlKCkgJiYgZGF0YS5jb250ZW50KSB7XG4gICAgICAvLyBSZXdyaXRlIFZDIGJvZHkgd2l0aCBpbmZvIGZyb20gdGhlIGhlYWRlcnMuXG4gICAgICBkYXRhLmNvbnRlbnQgPSBEcmFmdHkudXBkYXRlVmlkZW9FbnQoZGF0YS5jb250ZW50LCB7XG4gICAgICAgIHN0YXRlOiBkYXRhLmhlYWQud2VicnRjLFxuICAgICAgICBkdXJhdGlvbjogZGF0YS5oZWFkWyd3ZWJydGMtZHVyYXRpb24nXSxcbiAgICAgICAgaW5jb21pbmc6ICFvdXRnb2luZyxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICghZGF0YS5fbm9Gb3J3YXJkaW5nKSB7XG4gICAgICB0aGlzLl9tZXNzYWdlcy5wdXQoZGF0YSk7XG4gICAgICB0aGlzLl90aW5vZGUuX2RiLmFkZE1lc3NhZ2UoZGF0YSk7XG4gICAgICB0aGlzLl9tYXliZVVwZGF0ZU1lc3NhZ2VWZXJzaW9uc0NhY2hlKGRhdGEpO1xuICAgICAgdGhpcy5fdXBkYXRlRGVsZXRlZFJhbmdlcygpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9uRGF0YSkge1xuICAgICAgdGhpcy5vbkRhdGEoZGF0YSk7XG4gICAgfVxuXG4gICAgLy8gVXBkYXRlIGxvY2FsbHkgY2FjaGVkIGNvbnRhY3Qgd2l0aCB0aGUgbmV3IG1lc3NhZ2UgY291bnQuXG4gICAgY29uc3Qgd2hhdCA9IG91dGdvaW5nID8gJ3JlYWQnIDogJ21zZyc7XG4gICAgdGhpcy5fdXBkYXRlUmVhZFJlY3Yod2hhdCwgZGF0YS5zZXEsIGRhdGEudHMpO1xuICAgIC8vIE5vdGlmeSAnbWUnIGxpc3RlbmVycyBvZiB0aGUgY2hhbmdlLlxuICAgIHRoaXMuX3Rpbm9kZS5nZXRNZVRvcGljKCkuX3JlZnJlc2hDb250YWN0KHdoYXQsIHRoaXMpO1xuICB9XG5cbiAgLy8gUHJvY2VzcyBtZXRhZGF0YSBtZXNzYWdlXG4gIF9yb3V0ZU1ldGEobWV0YSkge1xuICAgIGlmIChtZXRhLmRlc2MpIHtcbiAgICAgIHRoaXMuX3Byb2Nlc3NNZXRhRGVzYyhtZXRhLmRlc2MpO1xuICAgIH1cbiAgICBpZiAobWV0YS5zdWIgJiYgbWV0YS5zdWIubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5fcHJvY2Vzc01ldGFTdWIobWV0YS5zdWIpO1xuICAgIH1cbiAgICBpZiAobWV0YS5kZWwpIHtcbiAgICAgIHRoaXMuX3Byb2Nlc3NEZWxNZXNzYWdlcyhtZXRhLmRlbC5jbGVhciwgbWV0YS5kZWwuZGVsc2VxKTtcbiAgICB9XG4gICAgaWYgKG1ldGEudGFncykge1xuICAgICAgdGhpcy5fcHJvY2Vzc01ldGFUYWdzKG1ldGEudGFncyk7XG4gICAgfVxuICAgIGlmIChtZXRhLmNyZWQpIHtcbiAgICAgIHRoaXMuX3Byb2Nlc3NNZXRhQ3JlZHMobWV0YS5jcmVkKTtcbiAgICB9XG4gICAgaWYgKHRoaXMub25NZXRhKSB7XG4gICAgICB0aGlzLm9uTWV0YShtZXRhKTtcbiAgICB9XG4gIH1cbiAgLy8gUHJvY2VzcyBwcmVzZW5jZSBjaGFuZ2UgbWVzc2FnZVxuICBfcm91dGVQcmVzKHByZXMpIHtcbiAgICBsZXQgdXNlciwgdWlkO1xuICAgIHN3aXRjaCAocHJlcy53aGF0KSB7XG4gICAgICBjYXNlICdkZWwnOlxuICAgICAgICAvLyBEZWxldGUgY2FjaGVkIG1lc3NhZ2VzLlxuICAgICAgICB0aGlzLl9wcm9jZXNzRGVsTWVzc2FnZXMocHJlcy5jbGVhciwgcHJlcy5kZWxzZXEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ29uJzpcbiAgICAgIGNhc2UgJ29mZic6XG4gICAgICAgIC8vIFVwZGF0ZSBvbmxpbmUgc3RhdHVzIG9mIGEgc3Vic2NyaXB0aW9uLlxuICAgICAgICB1c2VyID0gdGhpcy5fdXNlcnNbcHJlcy5zcmNdO1xuICAgICAgICBpZiAodXNlcikge1xuICAgICAgICAgIHVzZXIub25saW5lID0gcHJlcy53aGF0ID09ICdvbic7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fdGlub2RlLmxvZ2dlcihcIldBUk5JTkc6IFByZXNlbmNlIHVwZGF0ZSBmb3IgYW4gdW5rbm93biB1c2VyXCIsIHRoaXMubmFtZSwgcHJlcy5zcmMpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndGVybSc6XG4gICAgICAgIC8vIEF0dGFjaG1lbnQgdG8gdG9waWMgaXMgdGVybWluYXRlZCBwcm9iYWJseSBkdWUgdG8gY2x1c3RlciByZWhhc2hpbmcuXG4gICAgICAgIHRoaXMuX3Jlc2V0U3ViKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndXBkJzpcbiAgICAgICAgLy8gQSB0b3BpYyBzdWJzY3JpYmVyIGhhcyB1cGRhdGVkIGhpcyBkZXNjcmlwdGlvbi5cbiAgICAgICAgLy8gSXNzdWUge2dldCBzdWJ9IG9ubHkgaWYgdGhlIGN1cnJlbnQgdXNlciBoYXMgbm8gcDJwIHRvcGljcyB3aXRoIHRoZSB1cGRhdGVkIHVzZXIgKHAycCBuYW1lIGlzIG5vdCBpbiBjYWNoZSkuXG4gICAgICAgIC8vIE90aGVyd2lzZSAnbWUnIHdpbGwgaXNzdWUgYSB7Z2V0IGRlc2N9IHJlcXVlc3QuXG4gICAgICAgIGlmIChwcmVzLnNyYyAmJiAhdGhpcy5fdGlub2RlLmlzVG9waWNDYWNoZWQocHJlcy5zcmMpKSB7XG4gICAgICAgICAgdGhpcy5nZXRNZXRhKHRoaXMuc3RhcnRNZXRhUXVlcnkoKS53aXRoTGF0ZXJPbmVTdWIocHJlcy5zcmMpLmJ1aWxkKCkpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnYWNzJzpcbiAgICAgICAgdWlkID0gcHJlcy5zcmMgfHwgdGhpcy5fdGlub2RlLmdldEN1cnJlbnRVc2VySUQoKTtcbiAgICAgICAgdXNlciA9IHRoaXMuX3VzZXJzW3VpZF07XG4gICAgICAgIGlmICghdXNlcikge1xuICAgICAgICAgIC8vIFVwZGF0ZSBmb3IgYW4gdW5rbm93biB1c2VyOiBub3RpZmljYXRpb24gb2YgYSBuZXcgc3Vic2NyaXB0aW9uLlxuICAgICAgICAgIGNvbnN0IGFjcyA9IG5ldyBBY2Nlc3NNb2RlKCkudXBkYXRlQWxsKHByZXMuZGFjcyk7XG4gICAgICAgICAgaWYgKGFjcyAmJiBhY3MubW9kZSAhPSBBY2Nlc3NNb2RlLl9OT05FKSB7XG4gICAgICAgICAgICB1c2VyID0gdGhpcy5fY2FjaGVHZXRVc2VyKHVpZCk7XG4gICAgICAgICAgICBpZiAoIXVzZXIpIHtcbiAgICAgICAgICAgICAgdXNlciA9IHtcbiAgICAgICAgICAgICAgICB1c2VyOiB1aWQsXG4gICAgICAgICAgICAgICAgYWNzOiBhY3NcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgdGhpcy5nZXRNZXRhKHRoaXMuc3RhcnRNZXRhUXVlcnkoKS53aXRoT25lU3ViKHVuZGVmaW5lZCwgdWlkKS5idWlsZCgpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHVzZXIuYWNzID0gYWNzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdXNlci51cGRhdGVkID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2Nlc3NNZXRhU3ViKFt1c2VyXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIEtub3duIHVzZXJcbiAgICAgICAgICB1c2VyLmFjcy51cGRhdGVBbGwocHJlcy5kYWNzKTtcbiAgICAgICAgICAvLyBVcGRhdGUgdXNlcidzIGFjY2VzcyBtb2RlLlxuICAgICAgICAgIHRoaXMuX3Byb2Nlc3NNZXRhU3ViKFt7XG4gICAgICAgICAgICB1c2VyOiB1aWQsXG4gICAgICAgICAgICB1cGRhdGVkOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgYWNzOiB1c2VyLmFjc1xuICAgICAgICAgIH1dKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMuX3Rpbm9kZS5sb2dnZXIoXCJJTkZPOiBJZ25vcmVkIHByZXNlbmNlIHVwZGF0ZVwiLCBwcmVzLndoYXQpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9uUHJlcykge1xuICAgICAgdGhpcy5vblByZXMocHJlcyk7XG4gICAgfVxuICB9XG4gIC8vIFByb2Nlc3Mge2luZm99IG1lc3NhZ2VcbiAgX3JvdXRlSW5mbyhpbmZvKSB7XG4gICAgaWYgKGluZm8ud2hhdCAhPT0gJ2twJykge1xuICAgICAgY29uc3QgdXNlciA9IHRoaXMuX3VzZXJzW2luZm8uZnJvbV07XG4gICAgICBpZiAodXNlcikge1xuICAgICAgICB1c2VyW2luZm8ud2hhdF0gPSBpbmZvLnNlcTtcbiAgICAgICAgaWYgKHVzZXIucmVjdiA8IHVzZXIucmVhZCkge1xuICAgICAgICAgIHVzZXIucmVjdiA9IHVzZXIucmVhZDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3QgbXNnID0gdGhpcy5sYXRlc3RNZXNzYWdlKCk7XG4gICAgICBpZiAobXNnKSB7XG4gICAgICAgIHRoaXMubXNnU3RhdHVzKG1zZywgdHJ1ZSk7XG4gICAgICB9XG5cbiAgICAgIC8vIElmIHRoaXMgaXMgYW4gdXBkYXRlIGZyb20gdGhlIGN1cnJlbnQgdXNlciwgdXBkYXRlIHRoZSBjYWNoZSB3aXRoIHRoZSBuZXcgY291bnQuXG4gICAgICBpZiAodGhpcy5fdGlub2RlLmlzTWUoaW5mby5mcm9tKSkge1xuICAgICAgICB0aGlzLl91cGRhdGVSZWFkUmVjdihpbmZvLndoYXQsIGluZm8uc2VxKTtcbiAgICAgIH1cblxuICAgICAgLy8gTm90aWZ5ICdtZScgbGlzdGVuZXIgb2YgdGhlIHN0YXR1cyBjaGFuZ2UuXG4gICAgICB0aGlzLl90aW5vZGUuZ2V0TWVUb3BpYygpLl9yZWZyZXNoQ29udGFjdChpbmZvLndoYXQsIHRoaXMpO1xuICAgIH1cbiAgICBpZiAodGhpcy5vbkluZm8pIHtcbiAgICAgIHRoaXMub25JbmZvKGluZm8pO1xuICAgIH1cbiAgfVxuICAvLyBDYWxsZWQgYnkgVGlub2RlIHdoZW4gbWV0YS5kZXNjIHBhY2tldCBpcyByZWNlaXZlZC5cbiAgLy8gQ2FsbGVkIGJ5ICdtZScgdG9waWMgb24gY29udGFjdCB1cGRhdGUgKGRlc2MuX25vRm9yd2FyZGluZyBpcyB0cnVlKS5cbiAgX3Byb2Nlc3NNZXRhRGVzYyhkZXNjKSB7XG4gICAgaWYgKHRoaXMuaXNQMlBUeXBlKCkpIHtcbiAgICAgIC8vIFN5bnRoZXRpYyBkZXNjIG1heSBpbmNsdWRlIGRlZmFjcyBmb3IgcDJwIHRvcGljcyB3aGljaCBpcyB1c2VsZXNzLlxuICAgICAgLy8gUmVtb3ZlIGl0LlxuICAgICAgZGVsZXRlIGRlc2MuZGVmYWNzO1xuXG4gICAgICAvLyBVcGRhdGUgdG8gcDJwIGRlc2MgaXMgdGhlIHNhbWUgYXMgdXNlciB1cGRhdGUuIFVwZGF0ZSBjYWNoZWQgdXNlci5cbiAgICAgIHRoaXMuX3Rpbm9kZS5fZGIudXBkVXNlcih0aGlzLm5hbWUsIGRlc2MucHVibGljKTtcbiAgICB9XG5cbiAgICAvLyBDb3B5IHBhcmFtZXRlcnMgZnJvbSBkZXNjIG9iamVjdCB0byB0aGlzIHRvcGljLlxuICAgIG1lcmdlT2JqKHRoaXMsIGRlc2MpO1xuICAgIC8vIFVwZGF0ZSBwZXJzaXN0ZW50IGNhY2hlLlxuICAgIHRoaXMuX3Rpbm9kZS5fZGIudXBkVG9waWModGhpcyk7XG5cbiAgICAvLyBOb3RpZnkgJ21lJyBsaXN0ZW5lciwgaWYgYXZhaWxhYmxlOlxuICAgIGlmICh0aGlzLm5hbWUgIT09IENvbnN0LlRPUElDX01FICYmICFkZXNjLl9ub0ZvcndhcmRpbmcpIHtcbiAgICAgIGNvbnN0IG1lID0gdGhpcy5fdGlub2RlLmdldE1lVG9waWMoKTtcbiAgICAgIGlmIChtZS5vbk1ldGFTdWIpIHtcbiAgICAgICAgbWUub25NZXRhU3ViKHRoaXMpO1xuICAgICAgfVxuICAgICAgaWYgKG1lLm9uU3Vic1VwZGF0ZWQpIHtcbiAgICAgICAgbWUub25TdWJzVXBkYXRlZChbdGhpcy5uYW1lXSwgMSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub25NZXRhRGVzYykge1xuICAgICAgdGhpcy5vbk1ldGFEZXNjKHRoaXMpO1xuICAgIH1cbiAgfVxuICAvLyBDYWxsZWQgYnkgVGlub2RlIHdoZW4gbWV0YS5zdWIgaXMgcmVjaXZlZCBvciBpbiByZXNwb25zZSB0byByZWNlaXZlZFxuICAvLyB7Y3RybH0gYWZ0ZXIgc2V0TWV0YS1zdWIuXG4gIF9wcm9jZXNzTWV0YVN1YihzdWJzKSB7XG4gICAgZm9yIChsZXQgaWR4IGluIHN1YnMpIHtcbiAgICAgIGNvbnN0IHN1YiA9IHN1YnNbaWR4XTtcblxuICAgICAgLy8gRmlsbCBkZWZhdWx0cy5cbiAgICAgIHN1Yi5vbmxpbmUgPSAhIXN1Yi5vbmxpbmU7XG4gICAgICAvLyBVcGRhdGUgdGltZXN0YW1wIG9mIHRoZSBtb3N0IHJlY2VudCBzdWJzY3JpcHRpb24gdXBkYXRlLlxuICAgICAgdGhpcy5fbGFzdFN1YnNVcGRhdGUgPSBuZXcgRGF0ZShNYXRoLm1heCh0aGlzLl9sYXN0U3Vic1VwZGF0ZSwgc3ViLnVwZGF0ZWQpKTtcblxuICAgICAgbGV0IHVzZXIgPSBudWxsO1xuICAgICAgaWYgKCFzdWIuZGVsZXRlZCkge1xuICAgICAgICAvLyBJZiB0aGlzIGlzIGEgY2hhbmdlIHRvIHVzZXIncyBvd24gcGVybWlzc2lvbnMsIHVwZGF0ZSB0aGVtIGluIHRvcGljIHRvby5cbiAgICAgICAgLy8gRGVzYyB3aWxsIHVwZGF0ZSAnbWUnIHRvcGljLlxuICAgICAgICBpZiAodGhpcy5fdGlub2RlLmlzTWUoc3ViLnVzZXIpICYmIHN1Yi5hY3MpIHtcbiAgICAgICAgICB0aGlzLl9wcm9jZXNzTWV0YURlc2Moe1xuICAgICAgICAgICAgdXBkYXRlZDogc3ViLnVwZGF0ZWQsXG4gICAgICAgICAgICB0b3VjaGVkOiBzdWIudG91Y2hlZCxcbiAgICAgICAgICAgIGFjczogc3ViLmFjc1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHVzZXIgPSB0aGlzLl91cGRhdGVDYWNoZWRVc2VyKHN1Yi51c2VyLCBzdWIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gU3Vic2NyaXB0aW9uIGlzIGRlbGV0ZWQsIHJlbW92ZSBpdCBmcm9tIHRvcGljIChidXQgbGVhdmUgaW4gVXNlcnMgY2FjaGUpXG4gICAgICAgIGRlbGV0ZSB0aGlzLl91c2Vyc1tzdWIudXNlcl07XG4gICAgICAgIHVzZXIgPSBzdWI7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm9uTWV0YVN1Yikge1xuICAgICAgICB0aGlzLm9uTWV0YVN1Yih1c2VyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5vblN1YnNVcGRhdGVkKSB7XG4gICAgICB0aGlzLm9uU3Vic1VwZGF0ZWQoT2JqZWN0LmtleXModGhpcy5fdXNlcnMpKTtcbiAgICB9XG4gIH1cbiAgLy8gQ2FsbGVkIGJ5IFRpbm9kZSB3aGVuIG1ldGEudGFncyBpcyByZWNpdmVkLlxuICBfcHJvY2Vzc01ldGFUYWdzKHRhZ3MpIHtcbiAgICBpZiAodGFncy5sZW5ndGggPT0gMSAmJiB0YWdzWzBdID09IENvbnN0LkRFTF9DSEFSKSB7XG4gICAgICB0YWdzID0gW107XG4gICAgfVxuICAgIHRoaXMuX3RhZ3MgPSB0YWdzO1xuICAgIGlmICh0aGlzLm9uVGFnc1VwZGF0ZWQpIHtcbiAgICAgIHRoaXMub25UYWdzVXBkYXRlZCh0YWdzKTtcbiAgICB9XG4gIH1cbiAgLy8gRG8gbm90aGluZyBmb3IgdG9waWNzIG90aGVyIHRoYW4gJ21lJ1xuICBfcHJvY2Vzc01ldGFDcmVkcyhjcmVkcykge31cbiAgLy8gRGVsZXRlIGNhY2hlZCBtZXNzYWdlcyBhbmQgdXBkYXRlIGNhY2hlZCB0cmFuc2FjdGlvbiBJRHNcbiAgX3Byb2Nlc3NEZWxNZXNzYWdlcyhjbGVhciwgZGVsc2VxKSB7XG4gICAgdGhpcy5fbWF4RGVsID0gTWF0aC5tYXgoY2xlYXIsIHRoaXMuX21heERlbCk7XG4gICAgdGhpcy5jbGVhciA9IE1hdGgubWF4KGNsZWFyLCB0aGlzLmNsZWFyKTtcbiAgICBjb25zdCB0b3BpYyA9IHRoaXM7XG4gICAgbGV0IGNvdW50ID0gMDtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShkZWxzZXEpKSB7XG4gICAgICBkZWxzZXEuZm9yRWFjaChmdW5jdGlvbihyYW5nZSkge1xuICAgICAgICBpZiAoIXJhbmdlLmhpKSB7XG4gICAgICAgICAgY291bnQrKztcbiAgICAgICAgICB0b3BpYy5mbHVzaE1lc3NhZ2UocmFuZ2UubG93KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmb3IgKGxldCBpID0gcmFuZ2UubG93OyBpIDwgcmFuZ2UuaGk7IGkrKykge1xuICAgICAgICAgICAgY291bnQrKztcbiAgICAgICAgICAgIHRvcGljLmZsdXNoTWVzc2FnZShpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChjb3VudCA+IDApIHtcbiAgICAgIHRoaXMuX3VwZGF0ZURlbGV0ZWRSYW5nZXMoKTtcblxuICAgICAgaWYgKHRoaXMub25EYXRhKSB7XG4gICAgICAgIHRoaXMub25EYXRhKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIC8vIFRvcGljIGlzIGluZm9ybWVkIHRoYXQgdGhlIGVudGlyZSByZXNwb25zZSB0byB7Z2V0IHdoYXQ9ZGF0YX0gaGFzIGJlZW4gcmVjZWl2ZWQuXG4gIF9hbGxNZXNzYWdlc1JlY2VpdmVkKGNvdW50KSB7XG4gICAgdGhpcy5fdXBkYXRlRGVsZXRlZFJhbmdlcygpO1xuXG4gICAgaWYgKHRoaXMub25BbGxNZXNzYWdlc1JlY2VpdmVkKSB7XG4gICAgICB0aGlzLm9uQWxsTWVzc2FnZXNSZWNlaXZlZChjb3VudCk7XG4gICAgfVxuICB9XG4gIC8vIFJlc2V0IHN1YnNjcmliZWQgc3RhdGVcbiAgX3Jlc2V0U3ViKCkge1xuICAgIHRoaXMuX2F0dGFjaGVkID0gZmFsc2U7XG4gIH1cbiAgLy8gVGhpcyB0b3BpYyBpcyBlaXRoZXIgZGVsZXRlZCBvciB1bnN1YnNjcmliZWQgZnJvbS5cbiAgX2dvbmUoKSB7XG4gICAgdGhpcy5fbWVzc2FnZXMucmVzZXQoKTtcbiAgICB0aGlzLl90aW5vZGUuX2RiLnJlbU1lc3NhZ2VzKHRoaXMubmFtZSk7XG4gICAgdGhpcy5fdXNlcnMgPSB7fTtcbiAgICB0aGlzLmFjcyA9IG5ldyBBY2Nlc3NNb2RlKG51bGwpO1xuICAgIHRoaXMucHJpdmF0ZSA9IG51bGw7XG4gICAgdGhpcy5wdWJsaWMgPSBudWxsO1xuICAgIHRoaXMudHJ1c3RlZCA9IG51bGw7XG4gICAgdGhpcy5fbWF4U2VxID0gMDtcbiAgICB0aGlzLl9taW5TZXEgPSAwO1xuICAgIHRoaXMuX2F0dGFjaGVkID0gZmFsc2U7XG5cbiAgICBjb25zdCBtZSA9IHRoaXMuX3Rpbm9kZS5nZXRNZVRvcGljKCk7XG4gICAgaWYgKG1lKSB7XG4gICAgICBtZS5fcm91dGVQcmVzKHtcbiAgICAgICAgX25vRm9yd2FyZGluZzogdHJ1ZSxcbiAgICAgICAgd2hhdDogJ2dvbmUnLFxuICAgICAgICB0b3BpYzogQ29uc3QuVE9QSUNfTUUsXG4gICAgICAgIHNyYzogdGhpcy5uYW1lXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKHRoaXMub25EZWxldGVUb3BpYykge1xuICAgICAgdGhpcy5vbkRlbGV0ZVRvcGljKCk7XG4gICAgfVxuICB9XG4gIC8vIFVwZGF0ZSBnbG9iYWwgdXNlciBjYWNoZSBhbmQgbG9jYWwgc3Vic2NyaWJlcnMgY2FjaGUuXG4gIC8vIERvbid0IGNhbGwgdGhpcyBtZXRob2QgZm9yIG5vbi1zdWJzY3JpYmVycy5cbiAgX3VwZGF0ZUNhY2hlZFVzZXIodWlkLCBvYmopIHtcbiAgICAvLyBGZXRjaCB1c2VyIG9iamVjdCBmcm9tIHRoZSBnbG9iYWwgY2FjaGUuXG4gICAgLy8gVGhpcyBpcyBhIGNsb25lIG9mIHRoZSBzdG9yZWQgb2JqZWN0XG4gICAgbGV0IGNhY2hlZCA9IHRoaXMuX2NhY2hlR2V0VXNlcih1aWQpO1xuICAgIGNhY2hlZCA9IG1lcmdlT2JqKGNhY2hlZCB8fCB7fSwgb2JqKTtcbiAgICAvLyBTYXZlIHRvIGdsb2JhbCBjYWNoZVxuICAgIHRoaXMuX2NhY2hlUHV0VXNlcih1aWQsIGNhY2hlZCk7XG4gICAgLy8gU2F2ZSB0byB0aGUgbGlzdCBvZiB0b3BpYyBzdWJzcmliZXJzLlxuICAgIHJldHVybiBtZXJnZVRvQ2FjaGUodGhpcy5fdXNlcnMsIHVpZCwgY2FjaGVkKTtcbiAgfVxuICAvLyBHZXQgbG9jYWwgc2VxSWQgZm9yIGEgcXVldWVkIG1lc3NhZ2UuXG4gIF9nZXRRdWV1ZWRTZXFJZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fcXVldWVkU2VxSWQrKztcbiAgfVxuICAvLyBDYWxjdWxhdGUgcmFuZ2VzIG9mIG1pc3NpbmcgbWVzc2FnZXMuXG4gIF91cGRhdGVEZWxldGVkUmFuZ2VzKCkge1xuICAgIGNvbnN0IHJhbmdlcyA9IFtdO1xuXG4gICAgLy8gR2FwIG1hcmtlciwgcG9zc2libHkgZW1wdHkuXG4gICAgbGV0IHByZXYgPSBudWxsO1xuXG4gICAgLy8gQ2hlY2sgZm9yIGdhcCBpbiB0aGUgYmVnaW5uaW5nLCBiZWZvcmUgdGhlIGZpcnN0IG1lc3NhZ2UuXG4gICAgY29uc3QgZmlyc3QgPSB0aGlzLl9tZXNzYWdlcy5nZXRBdCgwKTtcbiAgICBpZiAoZmlyc3QgJiYgdGhpcy5fbWluU2VxID4gMSAmJiAhdGhpcy5fbm9FYXJsaWVyTXNncykge1xuICAgICAgLy8gU29tZSBtZXNzYWdlcyBhcmUgbWlzc2luZyBpbiB0aGUgYmVnaW5uaW5nLlxuICAgICAgaWYgKGZpcnN0LmhpKSB7XG4gICAgICAgIC8vIFRoZSBmaXJzdCBtZXNzYWdlIGFscmVhZHkgcmVwcmVzZW50cyBhIGdhcC5cbiAgICAgICAgaWYgKGZpcnN0LnNlcSA+IDEpIHtcbiAgICAgICAgICBmaXJzdC5zZXEgPSAxO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmaXJzdC5oaSA8IHRoaXMuX21pblNlcSAtIDEpIHtcbiAgICAgICAgICBmaXJzdC5oaSA9IHRoaXMuX21pblNlcSAtIDE7XG4gICAgICAgIH1cbiAgICAgICAgcHJldiA9IGZpcnN0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQ3JlYXRlIG5ldyBnYXAuXG4gICAgICAgIHByZXYgPSB7XG4gICAgICAgICAgc2VxOiAxLFxuICAgICAgICAgIGhpOiB0aGlzLl9taW5TZXEgLSAxXG4gICAgICAgIH07XG4gICAgICAgIHJhbmdlcy5wdXNoKHByZXYpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBObyBnYXAgaW4gdGhlIGJlZ2lubmluZy5cbiAgICAgIHByZXYgPSB7XG4gICAgICAgIHNlcTogMCxcbiAgICAgICAgaGk6IDBcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gRmluZCBuZXcgZ2FwcyBpbiB0aGUgbGlzdCBvZiByZWNlaXZlZCBtZXNzYWdlcy4gVGhlIGxpc3QgY29udGFpbnMgbWVzc2FnZXMtcHJvcGVyIGFzIHdlbGxcbiAgICAvLyBhcyBwbGFjZWhvbGRlcnMgZm9yIGRlbGV0ZWQgcmFuZ2VzLlxuICAgIC8vIFRoZSBtZXNzYWdlcyBhcmUgaXRlcmF0ZWQgYnkgc2VxIElEIGluIGFzY2VuZGluZyBvcmRlci5cbiAgICB0aGlzLl9tZXNzYWdlcy5maWx0ZXIoKGRhdGEpID0+IHtcbiAgICAgIC8vIERvIG5vdCBjcmVhdGUgYSBnYXAgYmV0d2VlbiB0aGUgbGFzdCBzZW50IG1lc3NhZ2UgYW5kIHRoZSBmaXJzdCB1bnNlbnQgYXMgd2VsbCBhcyBiZXR3ZWVuIHVuc2VudCBtZXNzYWdlcy5cbiAgICAgIGlmIChkYXRhLnNlcSA+PSBDb25zdC5MT0NBTF9TRVFJRCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgLy8gQ2hlY2sgZm9yIGEgZ2FwIGJldHdlZW4gdGhlIHByZXZpb3VzIG1lc3NhZ2UvbWFya2VyIGFuZCB0aGlzIG1lc3NhZ2UvbWFya2VyLlxuICAgICAgaWYgKGRhdGEuc2VxID09IChwcmV2LmhpIHx8IHByZXYuc2VxKSArIDEpIHtcbiAgICAgICAgLy8gTm8gZ2FwIGJldHdlZW4gdGhpcyBtZXNzYWdlIGFuZCB0aGUgcHJldmlvdXMuXG4gICAgICAgIGlmIChkYXRhLmhpICYmIHByZXYuaGkpIHtcbiAgICAgICAgICAvLyBUd28gZ2FwIG1hcmtlcnMgaW4gYSByb3cuIEV4dGVuZCB0aGUgcHJldmlvdXMgb25lLCBkaXNjYXJkIHRoZSBjdXJyZW50LlxuICAgICAgICAgIHByZXYuaGkgPSBkYXRhLmhpO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBwcmV2ID0gZGF0YTtcblxuICAgICAgICAvLyBLZWVwIGN1cnJlbnQuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBGb3VuZCBhIG5ldyBnYXAuXG4gICAgICAvLyBDaGVjayBpZiB0aGUgcHJldmlvdXMgaXMgYWxzbyBhIGdhcCBtYXJrZXIuXG4gICAgICBpZiAocHJldi5oaSkge1xuICAgICAgICAvLyBBbHRlciBpdCBpbnN0ZWFkIG9mIGNyZWF0aW5nIGEgbmV3IG9uZS5cbiAgICAgICAgcHJldi5oaSA9IGRhdGEuaGkgfHwgZGF0YS5zZXE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBQcmV2aW91cyBpcyBub3QgYSBnYXAgbWFya2VyLiBDcmVhdGUgYSBuZXcgb25lLlxuICAgICAgICBwcmV2ID0ge1xuICAgICAgICAgIHNlcTogcHJldi5zZXEgKyAxLFxuICAgICAgICAgIGhpOiBkYXRhLmhpIHx8IGRhdGEuc2VxXG4gICAgICAgIH07XG4gICAgICAgIHJhbmdlcy5wdXNoKHByZXYpO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiBtYXJrZXIsIHJlbW92ZTsga2VlcCBpZiByZWd1bGFyIG1lc3NhZ2UuXG4gICAgICBpZiAoIWRhdGEuaGkpIHtcbiAgICAgICAgLy8gS2VlcGluZyB0aGUgY3VycmVudCByZWd1bGFyIG1lc3NhZ2UsIHNhdmUgaXQgYXMgcHJldmlvdXMuXG4gICAgICAgIHByZXYgPSBkYXRhO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgLy8gRGlzY2FyZCB0aGUgY3VycmVudCBnYXAgbWFya2VyOiB3ZSBlaXRoZXIgY3JlYXRlZCBhbiBlYXJsaWVyIGdhcCwgb3IgZXh0ZW5kZWQgdGhlIHByZXZvdXMgb25lLlxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuXG4gICAgLy8gQ2hlY2sgZm9yIG1pc3NpbmcgbWVzc2FnZXMgYXQgdGhlIGVuZC5cbiAgICAvLyBBbGwgbWVzc2FnZXMgY291bGQgYmUgbWlzc2luZyBvciBpdCBjb3VsZCBiZSBhIG5ldyB0b3BpYyB3aXRoIG5vIG1lc3NhZ2VzLlxuICAgIGNvbnN0IGxhc3QgPSB0aGlzLl9tZXNzYWdlcy5nZXRMYXN0KCk7XG4gICAgY29uc3QgbWF4U2VxID0gTWF0aC5tYXgodGhpcy5zZXEsIHRoaXMuX21heFNlcSkgfHwgMDtcbiAgICBpZiAoKG1heFNlcSA+IDAgJiYgIWxhc3QpIHx8IChsYXN0ICYmICgobGFzdC5oaSB8fCBsYXN0LnNlcSkgPCBtYXhTZXEpKSkge1xuICAgICAgaWYgKGxhc3QgJiYgbGFzdC5oaSkge1xuICAgICAgICAvLyBFeHRlbmQgZXhpc3RpbmcgZ2FwXG4gICAgICAgIGxhc3QuaGkgPSBtYXhTZXE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBDcmVhdGUgbmV3IGdhcC5cbiAgICAgICAgcmFuZ2VzLnB1c2goe1xuICAgICAgICAgIHNlcTogbGFzdCA/IGxhc3Quc2VxICsgMSA6IDEsXG4gICAgICAgICAgaGk6IG1heFNlcVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJbnNlcnQgbmV3IGdhcHMgaW50byBjYWNoZS5cbiAgICByYW5nZXMuZm9yRWFjaCgoZ2FwKSA9PiB7XG4gICAgICBnYXAuX3N0YXR1cyA9IENvbnN0Lk1FU1NBR0VfU1RBVFVTX0RFTF9SQU5HRTtcbiAgICAgIHRoaXMuX21lc3NhZ2VzLnB1dChnYXApO1xuICAgIH0pO1xuICB9XG4gIC8vIExvYWQgbW9zdCByZWNlbnQgbWVzc2FnZXMgZnJvbSBwZXJzaXN0ZW50IGNhY2hlLlxuICBfbG9hZE1lc3NhZ2VzKGRiLCBwYXJhbXMpIHtcbiAgICBjb25zdCB7XG4gICAgICBzaW5jZSxcbiAgICAgIGJlZm9yZSxcbiAgICAgIGxpbWl0XG4gICAgfSA9IHBhcmFtcyB8fCB7fTtcbiAgICByZXR1cm4gZGIucmVhZE1lc3NhZ2VzKHRoaXMubmFtZSwge1xuICAgICAgICBzaW5jZTogc2luY2UsXG4gICAgICAgIGJlZm9yZTogYmVmb3JlLFxuICAgICAgICBsaW1pdDogbGltaXQgfHwgQ29uc3QuREVGQVVMVF9NRVNTQUdFU19QQUdFXG4gICAgICB9KVxuICAgICAgLnRoZW4oKG1zZ3MpID0+IHtcbiAgICAgICAgbXNncy5mb3JFYWNoKChkYXRhKSA9PiB7XG4gICAgICAgICAgaWYgKGRhdGEuc2VxID4gdGhpcy5fbWF4U2VxKSB7XG4gICAgICAgICAgICB0aGlzLl9tYXhTZXEgPSBkYXRhLnNlcTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGRhdGEuc2VxIDwgdGhpcy5fbWluU2VxIHx8IHRoaXMuX21pblNlcSA9PSAwKSB7XG4gICAgICAgICAgICB0aGlzLl9taW5TZXEgPSBkYXRhLnNlcTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5fbWVzc2FnZXMucHV0KGRhdGEpO1xuICAgICAgICAgIHRoaXMuX21heWJlVXBkYXRlTWVzc2FnZVZlcnNpb25zQ2FjaGUoZGF0YSk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAobXNncy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgdGhpcy5fdXBkYXRlRGVsZXRlZFJhbmdlcygpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtc2dzLmxlbmd0aDtcbiAgICAgIH0pO1xuICB9XG4gIC8vIFB1c2ggb3Ige3ByZXN9OiBtZXNzYWdlIHJlY2VpdmVkLlxuICBfdXBkYXRlUmVjZWl2ZWQoc2VxLCBhY3QpIHtcbiAgICB0aGlzLnRvdWNoZWQgPSBuZXcgRGF0ZSgpO1xuICAgIHRoaXMuc2VxID0gc2VxIHwgMDtcbiAgICAvLyBDaGVjayBpZiBtZXNzYWdlIGlzIHNlbnQgYnkgdGhlIGN1cnJlbnQgdXNlci4gSWYgc28gaXQncyBiZWVuIHJlYWQgYWxyZWFkeS5cbiAgICBpZiAoIWFjdCB8fCB0aGlzLl90aW5vZGUuaXNNZShhY3QpKSB7XG4gICAgICB0aGlzLnJlYWQgPSB0aGlzLnJlYWQgPyBNYXRoLm1heCh0aGlzLnJlYWQsIHRoaXMuc2VxKSA6IHRoaXMuc2VxO1xuICAgICAgdGhpcy5yZWN2ID0gdGhpcy5yZWN2ID8gTWF0aC5tYXgodGhpcy5yZWFkLCB0aGlzLnJlY3YpIDogdGhpcy5yZWFkO1xuICAgIH1cbiAgICB0aGlzLnVucmVhZCA9IHRoaXMuc2VxIC0gKHRoaXMucmVhZCB8IDApO1xuICAgIHRoaXMuX3Rpbm9kZS5fZGIudXBkVG9waWModGhpcyk7XG4gIH1cbn1cblxuXG4vKipcbiAqIEBjbGFzcyBUb3BpY01lIC0gc3BlY2lhbCBjYXNlIG9mIHtAbGluayBUaW5vZGUuVG9waWN9IGZvclxuICogbWFuYWdpbmcgZGF0YSBvZiB0aGUgY3VycmVudCB1c2VyLCBpbmNsdWRpbmcgY29udGFjdCBsaXN0LlxuICogQGV4dGVuZHMgVGlub2RlLlRvcGljXG4gKiBAbWVtYmVyb2YgVGlub2RlXG4gKlxuICogQHBhcmFtIHtUb3BpY01lLkNhbGxiYWNrc30gY2FsbGJhY2tzIC0gQ2FsbGJhY2tzIHRvIHJlY2VpdmUgdmFyaW91cyBldmVudHMuXG4gKi9cbi8qKlxuICogQGNsYXNzIFRvcGljTWUgLSBzcGVjaWFsIGNhc2Ugb2Yge0BsaW5rIFRpbm9kZS5Ub3BpY30gZm9yXG4gKiBtYW5hZ2luZyBkYXRhIG9mIHRoZSBjdXJyZW50IHVzZXIsIGluY2x1ZGluZyBjb250YWN0IGxpc3QuXG4gKiBAZXh0ZW5kcyBUaW5vZGUuVG9waWNcbiAqIEBtZW1iZXJvZiBUaW5vZGVcbiAqXG4gKiBAcGFyYW0ge1RvcGljTWUuQ2FsbGJhY2tzfSBjYWxsYmFja3MgLSBDYWxsYmFja3MgdG8gcmVjZWl2ZSB2YXJpb3VzIGV2ZW50cy5cbiAqL1xuZXhwb3J0IGNsYXNzIFRvcGljTWUgZXh0ZW5kcyBUb3BpYyB7XG4gIG9uQ29udGFjdFVwZGF0ZTtcblxuICBjb25zdHJ1Y3RvcihjYWxsYmFja3MpIHtcbiAgICBzdXBlcihDb25zdC5UT1BJQ19NRSwgY2FsbGJhY2tzKTtcblxuICAgIC8vIG1lLXNwZWNpZmljIGNhbGxiYWNrc1xuICAgIGlmIChjYWxsYmFja3MpIHtcbiAgICAgIHRoaXMub25Db250YWN0VXBkYXRlID0gY2FsbGJhY2tzLm9uQ29udGFjdFVwZGF0ZTtcbiAgICB9XG4gIH1cblxuICAvLyBPdmVycmlkZSB0aGUgb3JpZ2luYWwgVG9waWMuX3Byb2Nlc3NNZXRhRGVzYy5cbiAgX3Byb2Nlc3NNZXRhRGVzYyhkZXNjKSB7XG4gICAgLy8gQ2hlY2sgaWYgb25saW5lIGNvbnRhY3RzIG5lZWQgdG8gYmUgdHVybmVkIG9mZiBiZWNhdXNlIFAgcGVybWlzc2lvbiB3YXMgcmVtb3ZlZC5cbiAgICBjb25zdCB0dXJuT2ZmID0gKGRlc2MuYWNzICYmICFkZXNjLmFjcy5pc1ByZXNlbmNlcigpKSAmJiAodGhpcy5hY3MgJiYgdGhpcy5hY3MuaXNQcmVzZW5jZXIoKSk7XG5cbiAgICAvLyBDb3B5IHBhcmFtZXRlcnMgZnJvbSBkZXNjIG9iamVjdCB0byB0aGlzIHRvcGljLlxuICAgIG1lcmdlT2JqKHRoaXMsIGRlc2MpO1xuICAgIHRoaXMuX3Rpbm9kZS5fZGIudXBkVG9waWModGhpcyk7XG4gICAgLy8gVXBkYXRlIGN1cnJlbnQgdXNlcidzIHJlY29yZCBpbiB0aGUgZ2xvYmFsIGNhY2hlLlxuICAgIHRoaXMuX3VwZGF0ZUNhY2hlZFVzZXIodGhpcy5fdGlub2RlLl9teVVJRCwgZGVzYyk7XG5cbiAgICAvLyAnUCcgcGVybWlzc2lvbiB3YXMgcmVtb3ZlZC4gQWxsIHRvcGljcyBhcmUgb2ZmbGluZSBub3cuXG4gICAgaWYgKHR1cm5PZmYpIHtcbiAgICAgIHRoaXMuX3Rpbm9kZS5tYXBUb3BpY3MoKGNvbnQpID0+IHtcbiAgICAgICAgaWYgKGNvbnQub25saW5lKSB7XG4gICAgICAgICAgY29udC5vbmxpbmUgPSBmYWxzZTtcbiAgICAgICAgICBjb250LnNlZW4gPSBPYmplY3QuYXNzaWduKGNvbnQuc2VlbiB8fCB7fSwge1xuICAgICAgICAgICAgd2hlbjogbmV3IERhdGUoKVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMuX3JlZnJlc2hDb250YWN0KCdvZmYnLCBjb250KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub25NZXRhRGVzYykge1xuICAgICAgdGhpcy5vbk1ldGFEZXNjKHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIC8vIE92ZXJyaWRlIHRoZSBvcmlnaW5hbCBUb3BpYy5fcHJvY2Vzc01ldGFTdWJcbiAgX3Byb2Nlc3NNZXRhU3ViKHN1YnMpIHtcbiAgICBsZXQgdXBkYXRlQ291bnQgPSAwO1xuICAgIHN1YnMuZm9yRWFjaCgoc3ViKSA9PiB7XG4gICAgICBjb25zdCB0b3BpY05hbWUgPSBzdWIudG9waWM7XG4gICAgICAvLyBEb24ndCBzaG93ICdtZScgYW5kICdmbmQnIHRvcGljcyBpbiB0aGUgbGlzdCBvZiBjb250YWN0cy5cbiAgICAgIGlmICh0b3BpY05hbWUgPT0gQ29uc3QuVE9QSUNfRk5EIHx8IHRvcGljTmFtZSA9PSBDb25zdC5UT1BJQ19NRSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBzdWIub25saW5lID0gISFzdWIub25saW5lO1xuXG4gICAgICBsZXQgY29udCA9IG51bGw7XG4gICAgICBpZiAoc3ViLmRlbGV0ZWQpIHtcbiAgICAgICAgY29udCA9IHN1YjtcbiAgICAgICAgdGhpcy5fdGlub2RlLmNhY2hlUmVtVG9waWModG9waWNOYW1lKTtcbiAgICAgICAgdGhpcy5fdGlub2RlLl9kYi5yZW1Ub3BpYyh0b3BpY05hbWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gRW5zdXJlIHRoZSB2YWx1ZXMgYXJlIGRlZmluZWQgYW5kIGFyZSBpbnRlZ2Vycy5cbiAgICAgICAgaWYgKHR5cGVvZiBzdWIuc2VxICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgc3ViLnNlcSA9IHN1Yi5zZXEgfCAwO1xuICAgICAgICAgIHN1Yi5yZWN2ID0gc3ViLnJlY3YgfCAwO1xuICAgICAgICAgIHN1Yi5yZWFkID0gc3ViLnJlYWQgfCAwO1xuICAgICAgICAgIHN1Yi51bnJlYWQgPSBzdWIuc2VxIC0gc3ViLnJlYWQ7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0b3BpYyA9IHRoaXMuX3Rpbm9kZS5nZXRUb3BpYyh0b3BpY05hbWUpO1xuICAgICAgICBpZiAodG9waWMuX25ldykge1xuICAgICAgICAgIGRlbGV0ZSB0b3BpYy5fbmV3O1xuICAgICAgICB9XG5cbiAgICAgICAgY29udCA9IG1lcmdlT2JqKHRvcGljLCBzdWIpO1xuICAgICAgICB0aGlzLl90aW5vZGUuX2RiLnVwZFRvcGljKGNvbnQpO1xuXG4gICAgICAgIGlmIChUb3BpYy5pc1AyUFRvcGljTmFtZSh0b3BpY05hbWUpKSB7XG4gICAgICAgICAgdGhpcy5fY2FjaGVQdXRVc2VyKHRvcGljTmFtZSwgY29udCk7XG4gICAgICAgICAgdGhpcy5fdGlub2RlLl9kYi51cGRVc2VyKHRvcGljTmFtZSwgY29udC5wdWJsaWMpO1xuICAgICAgICB9XG4gICAgICAgIC8vIE5vdGlmeSB0b3BpYyBvZiB0aGUgdXBkYXRlIGlmIGl0J3MgYW4gZXh0ZXJuYWwgdXBkYXRlLlxuICAgICAgICBpZiAoIXN1Yi5fbm9Gb3J3YXJkaW5nICYmIHRvcGljKSB7XG4gICAgICAgICAgc3ViLl9ub0ZvcndhcmRpbmcgPSB0cnVlO1xuICAgICAgICAgIHRvcGljLl9wcm9jZXNzTWV0YURlc2Moc3ViKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB1cGRhdGVDb3VudCsrO1xuXG4gICAgICBpZiAodGhpcy5vbk1ldGFTdWIpIHtcbiAgICAgICAgdGhpcy5vbk1ldGFTdWIoY29udCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5vblN1YnNVcGRhdGVkICYmIHVwZGF0ZUNvdW50ID4gMCkge1xuICAgICAgY29uc3Qga2V5cyA9IFtdO1xuICAgICAgc3Vicy5mb3JFYWNoKChzKSA9PiB7XG4gICAgICAgIGtleXMucHVzaChzLnRvcGljKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5vblN1YnNVcGRhdGVkKGtleXMsIHVwZGF0ZUNvdW50KTtcbiAgICB9XG4gIH1cblxuICAvLyBDYWxsZWQgYnkgVGlub2RlIHdoZW4gbWV0YS5zdWIgaXMgcmVjaXZlZC5cbiAgX3Byb2Nlc3NNZXRhQ3JlZHMoY3JlZHMsIHVwZCkge1xuICAgIGlmIChjcmVkcy5sZW5ndGggPT0gMSAmJiBjcmVkc1swXSA9PSBDb25zdC5ERUxfQ0hBUikge1xuICAgICAgY3JlZHMgPSBbXTtcbiAgICB9XG4gICAgaWYgKHVwZCkge1xuICAgICAgY3JlZHMuZm9yRWFjaCgoY3IpID0+IHtcbiAgICAgICAgaWYgKGNyLnZhbCkge1xuICAgICAgICAgIC8vIEFkZGluZyBhIGNyZWRlbnRpYWwuXG4gICAgICAgICAgbGV0IGlkeCA9IHRoaXMuX2NyZWRlbnRpYWxzLmZpbmRJbmRleCgoZWwpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBlbC5tZXRoID09IGNyLm1ldGggJiYgZWwudmFsID09IGNyLnZhbDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoaWR4IDwgMCkge1xuICAgICAgICAgICAgLy8gTm90IGZvdW5kLlxuICAgICAgICAgICAgaWYgKCFjci5kb25lKSB7XG4gICAgICAgICAgICAgIC8vIFVuY29uZmlybWVkIGNyZWRlbnRpYWwgcmVwbGFjZXMgcHJldmlvdXMgdW5jb25maXJtZWQgY3JlZGVudGlhbCBvZiB0aGUgc2FtZSBtZXRob2QuXG4gICAgICAgICAgICAgIGlkeCA9IHRoaXMuX2NyZWRlbnRpYWxzLmZpbmRJbmRleCgoZWwpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZWwubWV0aCA9PSBjci5tZXRoICYmICFlbC5kb25lO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgaWYgKGlkeCA+PSAwKSB7XG4gICAgICAgICAgICAgICAgLy8gUmVtb3ZlIHByZXZpb3VzIHVuY29uZmlybWVkIGNyZWRlbnRpYWwuXG4gICAgICAgICAgICAgICAgdGhpcy5fY3JlZGVudGlhbHMuc3BsaWNlKGlkeCwgMSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX2NyZWRlbnRpYWxzLnB1c2goY3IpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBGb3VuZC4gTWF5YmUgY2hhbmdlICdkb25lJyBzdGF0dXMuXG4gICAgICAgICAgICB0aGlzLl9jcmVkZW50aWFsc1tpZHhdLmRvbmUgPSBjci5kb25lO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChjci5yZXNwKSB7XG4gICAgICAgICAgLy8gSGFuZGxlIGNyZWRlbnRpYWwgY29uZmlybWF0aW9uLlxuICAgICAgICAgIGNvbnN0IGlkeCA9IHRoaXMuX2NyZWRlbnRpYWxzLmZpbmRJbmRleCgoZWwpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBlbC5tZXRoID09IGNyLm1ldGggJiYgIWVsLmRvbmU7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKGlkeCA+PSAwKSB7XG4gICAgICAgICAgICB0aGlzLl9jcmVkZW50aWFsc1tpZHhdLmRvbmUgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2NyZWRlbnRpYWxzID0gY3JlZHM7XG4gICAgfVxuICAgIGlmICh0aGlzLm9uQ3JlZHNVcGRhdGVkKSB7XG4gICAgICB0aGlzLm9uQ3JlZHNVcGRhdGVkKHRoaXMuX2NyZWRlbnRpYWxzKTtcbiAgICB9XG4gIH1cblxuICAvLyBQcm9jZXNzIHByZXNlbmNlIGNoYW5nZSBtZXNzYWdlXG4gIF9yb3V0ZVByZXMocHJlcykge1xuICAgIGlmIChwcmVzLndoYXQgPT0gJ3Rlcm0nKSB7XG4gICAgICAvLyBUaGUgJ21lJyB0b3BpYyBpdHNlbGYgaXMgZGV0YWNoZWQuIE1hcmsgYXMgdW5zdWJzY3JpYmVkLlxuICAgICAgdGhpcy5fcmVzZXRTdWIoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAocHJlcy53aGF0ID09ICd1cGQnICYmIHByZXMuc3JjID09IENvbnN0LlRPUElDX01FKSB7XG4gICAgICAvLyBVcGRhdGUgdG8gbWUncyBkZXNjcmlwdGlvbi4gUmVxdWVzdCB1cGRhdGVkIHZhbHVlLlxuICAgICAgdGhpcy5nZXRNZXRhKHRoaXMuc3RhcnRNZXRhUXVlcnkoKS53aXRoRGVzYygpLmJ1aWxkKCkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbnQgPSB0aGlzLl90aW5vZGUuY2FjaGVHZXRUb3BpYyhwcmVzLnNyYyk7XG4gICAgaWYgKGNvbnQpIHtcbiAgICAgIHN3aXRjaCAocHJlcy53aGF0KSB7XG4gICAgICAgIGNhc2UgJ29uJzogLy8gdG9waWMgY2FtZSBvbmxpbmVcbiAgICAgICAgICBjb250Lm9ubGluZSA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ29mZic6IC8vIHRvcGljIHdlbnQgb2ZmbGluZVxuICAgICAgICAgIGlmIChjb250Lm9ubGluZSkge1xuICAgICAgICAgICAgY29udC5vbmxpbmUgPSBmYWxzZTtcbiAgICAgICAgICAgIGNvbnQuc2VlbiA9IE9iamVjdC5hc3NpZ24oY29udC5zZWVuIHx8IHt9LCB7XG4gICAgICAgICAgICAgIHdoZW46IG5ldyBEYXRlKClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnbXNnJzogLy8gbmV3IG1lc3NhZ2UgcmVjZWl2ZWRcbiAgICAgICAgICBjb250Ll91cGRhdGVSZWNlaXZlZChwcmVzLnNlcSwgcHJlcy5hY3QpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd1cGQnOiAvLyBkZXNjIHVwZGF0ZWRcbiAgICAgICAgICAvLyBSZXF1ZXN0IHVwZGF0ZWQgc3Vic2NyaXB0aW9uLlxuICAgICAgICAgIHRoaXMuZ2V0TWV0YSh0aGlzLnN0YXJ0TWV0YVF1ZXJ5KCkud2l0aExhdGVyT25lU3ViKHByZXMuc3JjKS5idWlsZCgpKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnYWNzJzogLy8gYWNjZXNzIG1vZGUgY2hhbmdlZFxuICAgICAgICAgIGlmIChjb250LmFjcykge1xuICAgICAgICAgICAgY29udC5hY3MudXBkYXRlQWxsKHByZXMuZGFjcyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnQuYWNzID0gbmV3IEFjY2Vzc01vZGUoKS51cGRhdGVBbGwocHJlcy5kYWNzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udC50b3VjaGVkID0gbmV3IERhdGUoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAndWEnOlxuICAgICAgICAgIC8vIHVzZXIgYWdlbnQgY2hhbmdlZC5cbiAgICAgICAgICBjb250LnNlZW4gPSB7XG4gICAgICAgICAgICB3aGVuOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgdWE6IHByZXMudWFcbiAgICAgICAgICB9O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdyZWN2JzpcbiAgICAgICAgICAvLyB1c2VyJ3Mgb3RoZXIgc2Vzc2lvbiBtYXJrZWQgc29tZSBtZXNzZ2VzIGFzIHJlY2VpdmVkLlxuICAgICAgICAgIHByZXMuc2VxID0gcHJlcy5zZXEgfCAwO1xuICAgICAgICAgIGNvbnQucmVjdiA9IGNvbnQucmVjdiA/IE1hdGgubWF4KGNvbnQucmVjdiwgcHJlcy5zZXEpIDogcHJlcy5zZXE7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3JlYWQnOlxuICAgICAgICAgIC8vIHVzZXIncyBvdGhlciBzZXNzaW9uIG1hcmtlZCBzb21lIG1lc3NhZ2VzIGFzIHJlYWQuXG4gICAgICAgICAgcHJlcy5zZXEgPSBwcmVzLnNlcSB8IDA7XG4gICAgICAgICAgY29udC5yZWFkID0gY29udC5yZWFkID8gTWF0aC5tYXgoY29udC5yZWFkLCBwcmVzLnNlcSkgOiBwcmVzLnNlcTtcbiAgICAgICAgICBjb250LnJlY3YgPSBjb250LnJlY3YgPyBNYXRoLm1heChjb250LnJlYWQsIGNvbnQucmVjdikgOiBjb250LnJlY3Y7XG4gICAgICAgICAgY29udC51bnJlYWQgPSBjb250LnNlcSAtIGNvbnQucmVhZDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnZ29uZSc6XG4gICAgICAgICAgLy8gdG9waWMgZGVsZXRlZCBvciB1bnN1YnNjcmliZWQgZnJvbS5cbiAgICAgICAgICBpZiAoIWNvbnQuX2RlbGV0ZWQpIHtcbiAgICAgICAgICAgIGNvbnQuX2RlbGV0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgY29udC5fYXR0YWNoZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuX3Rpbm9kZS5fZGIubWFya1RvcGljQXNEZWxldGVkKHByZXMuc3JjKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fdGlub2RlLl9kYi5yZW1Ub3BpYyhwcmVzLnNyYyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdkZWwnOlxuICAgICAgICAgIC8vIFVwZGF0ZSB0b3BpYy5kZWwgdmFsdWUuXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhpcy5fdGlub2RlLmxvZ2dlcihcIklORk86IFVuc3VwcG9ydGVkIHByZXNlbmNlIHVwZGF0ZSBpbiAnbWUnXCIsIHByZXMud2hhdCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3JlZnJlc2hDb250YWN0KHByZXMud2hhdCwgY29udCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChwcmVzLndoYXQgPT0gJ2FjcycpIHtcbiAgICAgICAgLy8gTmV3IHN1YnNjcmlwdGlvbnMgYW5kIGRlbGV0ZWQvYmFubmVkIHN1YnNjcmlwdGlvbnMgaGF2ZSBmdWxsXG4gICAgICAgIC8vIGFjY2VzcyBtb2RlIChubyArIG9yIC0gaW4gdGhlIGRhY3Mgc3RyaW5nKS4gQ2hhbmdlcyB0byBrbm93biBzdWJzY3JpcHRpb25zIGFyZSBzZW50IGFzXG4gICAgICAgIC8vIGRlbHRhcywgYnV0IHRoZXkgc2hvdWxkIG5vdCBoYXBwZW4gaGVyZS5cbiAgICAgICAgY29uc3QgYWNzID0gbmV3IEFjY2Vzc01vZGUocHJlcy5kYWNzKTtcbiAgICAgICAgaWYgKCFhY3MgfHwgYWNzLm1vZGUgPT0gQWNjZXNzTW9kZS5fSU5WQUxJRCkge1xuICAgICAgICAgIHRoaXMuX3Rpbm9kZS5sb2dnZXIoXCJFUlJPUjogSW52YWxpZCBhY2Nlc3MgbW9kZSB1cGRhdGVcIiwgcHJlcy5zcmMsIHByZXMuZGFjcyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2UgaWYgKGFjcy5tb2RlID09IEFjY2Vzc01vZGUuX05PTkUpIHtcbiAgICAgICAgICB0aGlzLl90aW5vZGUubG9nZ2VyKFwiV0FSTklORzogUmVtb3Zpbmcgbm9uLWV4aXN0ZW50IHN1YnNjcmlwdGlvblwiLCBwcmVzLnNyYywgcHJlcy5kYWNzKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gTmV3IHN1YnNjcmlwdGlvbi4gU2VuZCByZXF1ZXN0IGZvciB0aGUgZnVsbCBkZXNjcmlwdGlvbi5cbiAgICAgICAgICAvLyBVc2luZyAud2l0aE9uZVN1YiAobm90IC53aXRoTGF0ZXJPbmVTdWIpIHRvIG1ha2Ugc3VyZSBJZk1vZGlmaWVkU2luY2UgaXMgbm90IHNldC5cbiAgICAgICAgICB0aGlzLmdldE1ldGEodGhpcy5zdGFydE1ldGFRdWVyeSgpLndpdGhPbmVTdWIodW5kZWZpbmVkLCBwcmVzLnNyYykuYnVpbGQoKSk7XG4gICAgICAgICAgLy8gQ3JlYXRlIGEgZHVtbXkgZW50cnkgdG8gY2F0Y2ggb25saW5lIHN0YXR1cyB1cGRhdGUuXG4gICAgICAgICAgY29uc3QgZHVtbXkgPSB0aGlzLl90aW5vZGUuZ2V0VG9waWMocHJlcy5zcmMpO1xuICAgICAgICAgIGR1bW15LnRvcGljID0gcHJlcy5zcmM7XG4gICAgICAgICAgZHVtbXkub25saW5lID0gZmFsc2U7XG4gICAgICAgICAgZHVtbXkuYWNzID0gYWNzO1xuICAgICAgICAgIHRoaXMuX3Rpbm9kZS5fZGIudXBkVG9waWMoZHVtbXkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHByZXMud2hhdCA9PSAndGFncycpIHtcbiAgICAgICAgdGhpcy5nZXRNZXRhKHRoaXMuc3RhcnRNZXRhUXVlcnkoKS53aXRoVGFncygpLmJ1aWxkKCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLm9uUHJlcykge1xuICAgICAgdGhpcy5vblByZXMocHJlcyk7XG4gICAgfVxuICB9XG5cbiAgLy8gQ29udGFjdCBpcyB1cGRhdGVkLCBleGVjdXRlIGNhbGxiYWNrcy5cbiAgX3JlZnJlc2hDb250YWN0KHdoYXQsIGNvbnQpIHtcbiAgICBpZiAodGhpcy5vbkNvbnRhY3RVcGRhdGUpIHtcbiAgICAgIHRoaXMub25Db250YWN0VXBkYXRlKHdoYXQsIGNvbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQdWJsaXNoaW5nIHRvIFRvcGljTWUgaXMgbm90IHN1cHBvcnRlZC4ge0BsaW5rIFRvcGljI3B1Ymxpc2h9IGlzIG92ZXJyaWRlbiBhbmQgdGhvd3MgYW4ge0Vycm9yfSBpZiBjYWxsZWQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWNNZSNcbiAgICogQHRocm93cyB7RXJyb3J9IEFsd2F5cyB0aHJvd3MgYW4gZXJyb3IuXG4gICAqL1xuICBwdWJsaXNoKCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJQdWJsaXNoaW5nIHRvICdtZScgaXMgbm90IHN1cHBvcnRlZFwiKSk7XG4gIH1cblxuICAvKipcbiAgICogRGVsZXRlIHZhbGlkYXRpb24gY3JlZGVudGlhbC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpY01lI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWMgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byBkZWxldGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVzZXIgLSBVc2VyIElEIHRvIHJlbW92ZS5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgZGVsQ3JlZGVudGlhbChtZXRob2QsIHZhbHVlKSB7XG4gICAgaWYgKCF0aGlzLl9hdHRhY2hlZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkNhbm5vdCBkZWxldGUgY3JlZGVudGlhbCBpbiBpbmFjdGl2ZSAnbWUnIHRvcGljXCIpKTtcbiAgICB9XG4gICAgLy8gU2VuZCB7ZGVsfSBtZXNzYWdlLCByZXR1cm4gcHJvbWlzZVxuICAgIHJldHVybiB0aGlzLl90aW5vZGUuZGVsQ3JlZGVudGlhbChtZXRob2QsIHZhbHVlKS50aGVuKChjdHJsKSA9PiB7XG4gICAgICAvLyBSZW1vdmUgZGVsZXRlZCBjcmVkZW50aWFsIGZyb20gdGhlIGNhY2hlLlxuICAgICAgY29uc3QgaW5kZXggPSB0aGlzLl9jcmVkZW50aWFscy5maW5kSW5kZXgoKGVsKSA9PiB7XG4gICAgICAgIHJldHVybiBlbC5tZXRoID09IG1ldGhvZCAmJiBlbC52YWwgPT0gdmFsdWU7XG4gICAgICB9KTtcbiAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgIHRoaXMuX2NyZWRlbnRpYWxzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICB9XG4gICAgICAvLyBOb3RpZnkgbGlzdGVuZXJzXG4gICAgICBpZiAodGhpcy5vbkNyZWRzVXBkYXRlZCkge1xuICAgICAgICB0aGlzLm9uQ3JlZHNVcGRhdGVkKHRoaXMuX2NyZWRlbnRpYWxzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjdHJsO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBjYWxsYmFjayBjb250YWN0RmlsdGVyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250YWN0IHRvIGNoZWNrIGZvciBpbmNsdXNpb24uXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiBjb250YWN0IHNob3VsZCBiZSBwcm9jZXNzZWQsIDxjb2RlPmZhbHNlPC9jb2RlPiB0byBleGNsdWRlIGl0LlxuICAgKi9cbiAgLyoqXG4gICAqIEl0ZXJhdGUgb3ZlciBjYWNoZWQgY29udGFjdHMuXG4gICAqXG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljTWUjXG4gICAqIEBwYXJhbSB7VG9waWNNZS5Db250YWN0Q2FsbGJhY2t9IGNhbGxiYWNrIC0gQ2FsbGJhY2sgdG8gY2FsbCBmb3IgZWFjaCBjb250YWN0LlxuICAgKiBAcGFyYW0ge2NvbnRhY3RGaWx0ZXI9fSBmaWx0ZXIgLSBPcHRpb25hbGx5IGZpbHRlciBjb250YWN0czsgaW5jbHVkZSBhbGwgaWYgZmlsdGVyIGlzIGZhbHNlLWlzaCwgb3RoZXJ3aXNlXG4gICAqICAgICAgaW5jbHVkZSB0aG9zZSBmb3Igd2hpY2ggZmlsdGVyIHJldHVybnMgdHJ1ZS1pc2guXG4gICAqIEBwYXJhbSB7T2JqZWN0PX0gY29udGV4dCAtIENvbnRleHQgdG8gdXNlIGZvciBjYWxsaW5nIHRoZSBgY2FsbGJhY2tgLCBpLmUuIHRoZSB2YWx1ZSBvZiBgdGhpc2AgaW5zaWRlIHRoZSBjYWxsYmFjay5cbiAgICovXG4gIGNvbnRhY3RzKGNhbGxiYWNrLCBmaWx0ZXIsIGNvbnRleHQpIHtcbiAgICB0aGlzLl90aW5vZGUubWFwVG9waWNzKChjLCBpZHgpID0+IHtcbiAgICAgIGlmIChjLmlzQ29tbVR5cGUoKSAmJiAoIWZpbHRlciB8fCBmaWx0ZXIoYykpKSB7XG4gICAgICAgIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgYywgaWR4KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYSBjb250YWN0IGZyb20gY2FjaGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWNNZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBjb250YWN0IHRvIGdldCwgZWl0aGVyIGEgVUlEIChmb3IgcDJwIHRvcGljcykgb3IgYSB0b3BpYyBuYW1lLlxuICAgKiBAcmV0dXJucyB7VGlub2RlLkNvbnRhY3R9IC0gQ29udGFjdCBvciBgdW5kZWZpbmVkYC5cbiAgICovXG4gIGdldENvbnRhY3QobmFtZSkge1xuICAgIHJldHVybiB0aGlzLl90aW5vZGUuY2FjaGVHZXRUb3BpYyhuYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYWNjZXNzIG1vZGUgb2YgYSBnaXZlbiBjb250YWN0IGZyb20gY2FjaGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWNNZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBjb250YWN0IHRvIGdldCBhY2Nlc3MgbW9kZSBmb3IsIGVpdGhlciBhIFVJRCAoZm9yIHAycCB0b3BpY3MpXG4gICAqICAgICAgICBvciBhIHRvcGljIG5hbWU7IGlmIG1pc3NpbmcsIGFjY2VzcyBtb2RlIGZvciB0aGUgJ21lJyB0b3BpYyBpdHNlbGYuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IC0gYWNjZXNzIG1vZGUsIHN1Y2ggYXMgYFJXUGAuXG4gICAqL1xuICBnZXRBY2Nlc3NNb2RlKG5hbWUpIHtcbiAgICBpZiAobmFtZSkge1xuICAgICAgY29uc3QgY29udCA9IHRoaXMuX3Rpbm9kZS5jYWNoZUdldFRvcGljKG5hbWUpO1xuICAgICAgcmV0dXJuIGNvbnQgPyBjb250LmFjcyA6IG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmFjcztcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBjb250YWN0IGlzIGFyY2hpdmVkLCBpLmUuIGNvbnRhY3QucHJpdmF0ZS5hcmNoID09IHRydWUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWNNZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBjb250YWN0IHRvIGNoZWNrIGFyY2hpdmVkIHN0YXR1cywgZWl0aGVyIGEgVUlEIChmb3IgcDJwIHRvcGljcykgb3IgYSB0b3BpYyBuYW1lLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSB0cnVlIGlmIGNvbnRhY3QgaXMgYXJjaGl2ZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAgICovXG4gIGlzQXJjaGl2ZWQobmFtZSkge1xuICAgIGNvbnN0IGNvbnQgPSB0aGlzLl90aW5vZGUuY2FjaGVHZXRUb3BpYyhuYW1lKTtcbiAgICByZXR1cm4gY29udCAmJiBjb250LnByaXZhdGUgJiYgISFjb250LnByaXZhdGUuYXJjaDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAdHlwZWRlZiBUaW5vZGUuQ3JlZGVudGlhbFxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEB0eXBlIE9iamVjdFxuICAgKiBAcHJvcGVydHkge3N0cmluZ30gbWV0aCAtIHZhbGlkYXRpb24gbWV0aG9kIHN1Y2ggYXMgJ2VtYWlsJyBvciAndGVsJy5cbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IHZhbCAtIGNyZWRlbnRpYWwgdmFsdWUsIGkuZS4gJ2pkb2VAZXhhbXBsZS5jb20nIG9yICcrMTcwMjU1NTEyMzQnXG4gICAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gZG9uZSAtIHRydWUgaWYgY3JlZGVudGlhbCBpcyB2YWxpZGF0ZWQuXG4gICAqL1xuICAvKipcbiAgICogR2V0IHRoZSB1c2VyJ3MgY3JlZGVudGlhbHM6IGVtYWlsLCBwaG9uZSwgZXRjLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljTWUjXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuQ3JlZGVudGlhbFtdfSAtIGFycmF5IG9mIGNyZWRlbnRpYWxzLlxuICAgKi9cbiAgZ2V0Q3JlZGVudGlhbHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NyZWRlbnRpYWxzO1xuICB9XG59XG5cbi8qKlxuICogQGNsYXNzIFRvcGljRm5kIC0gc3BlY2lhbCBjYXNlIG9mIHtAbGluayBUaW5vZGUuVG9waWN9IGZvciBzZWFyY2hpbmcgZm9yXG4gKiBjb250YWN0cyBhbmQgZ3JvdXAgdG9waWNzLlxuICogQGV4dGVuZHMgVGlub2RlLlRvcGljXG4gKiBAbWVtYmVyb2YgVGlub2RlXG4gKlxuICogQHBhcmFtIHtUb3BpY0ZuZC5DYWxsYmFja3N9IGNhbGxiYWNrcyAtIENhbGxiYWNrcyB0byByZWNlaXZlIHZhcmlvdXMgZXZlbnRzLlxuICovXG5leHBvcnQgY2xhc3MgVG9waWNGbmQgZXh0ZW5kcyBUb3BpYyB7XG4gIC8vIExpc3Qgb2YgdXNlcnMgYW5kIHRvcGljcyB1aWQgb3IgdG9waWNfbmFtZSAtPiBDb250YWN0IG9iamVjdClcbiAgX2NvbnRhY3RzID0ge307XG5cbiAgY29uc3RydWN0b3IoY2FsbGJhY2tzKSB7XG4gICAgc3VwZXIoQ29uc3QuVE9QSUNfRk5ELCBjYWxsYmFja3MpO1xuICB9XG5cbiAgLy8gT3ZlcnJpZGUgdGhlIG9yaWdpbmFsIFRvcGljLl9wcm9jZXNzTWV0YVN1YlxuICBfcHJvY2Vzc01ldGFTdWIoc3Vicykge1xuICAgIGxldCB1cGRhdGVDb3VudCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRoaXMuX2NvbnRhY3RzKS5sZW5ndGg7XG4gICAgLy8gUmVzZXQgY29udGFjdCBsaXN0LlxuICAgIHRoaXMuX2NvbnRhY3RzID0ge307XG4gICAgZm9yIChsZXQgaWR4IGluIHN1YnMpIHtcbiAgICAgIGxldCBzdWIgPSBzdWJzW2lkeF07XG4gICAgICBjb25zdCBpbmRleEJ5ID0gc3ViLnRvcGljID8gc3ViLnRvcGljIDogc3ViLnVzZXI7XG5cbiAgICAgIHN1YiA9IG1lcmdlVG9DYWNoZSh0aGlzLl9jb250YWN0cywgaW5kZXhCeSwgc3ViKTtcbiAgICAgIHVwZGF0ZUNvdW50Kys7XG5cbiAgICAgIGlmICh0aGlzLm9uTWV0YVN1Yikge1xuICAgICAgICB0aGlzLm9uTWV0YVN1YihzdWIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh1cGRhdGVDb3VudCA+IDAgJiYgdGhpcy5vblN1YnNVcGRhdGVkKSB7XG4gICAgICB0aGlzLm9uU3Vic1VwZGF0ZWQoT2JqZWN0LmtleXModGhpcy5fY29udGFjdHMpKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUHVibGlzaGluZyB0byBUb3BpY0ZuZCBpcyBub3Qgc3VwcG9ydGVkLiB7QGxpbmsgVG9waWMjcHVibGlzaH0gaXMgb3ZlcnJpZGVuIGFuZCB0aG93cyBhbiB7RXJyb3J9IGlmIGNhbGxlZC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpY0ZuZCNcbiAgICogQHRocm93cyB7RXJyb3J9IEFsd2F5cyB0aHJvd3MgYW4gZXJyb3IuXG4gICAqL1xuICBwdWJsaXNoKCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJQdWJsaXNoaW5nIHRvICdmbmQnIGlzIG5vdCBzdXBwb3J0ZWRcIikpO1xuICB9XG5cbiAgLyoqXG4gICAqIHNldE1ldGEgdG8gVG9waWNGbmQgcmVzZXRzIGNvbnRhY3QgbGlzdCBpbiBhZGRpdGlvbiB0byBzZW5kaW5nIHRoZSBtZXNzYWdlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljRm5kI1xuICAgKiBAcGFyYW0ge1Rpbm9kZS5TZXRQYXJhbXN9IHBhcmFtcyBwYXJhbWV0ZXJzIHRvIHVwZGF0ZS5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHJlcXVlc3QuXG4gICAqL1xuICBzZXRNZXRhKHBhcmFtcykge1xuICAgIHJldHVybiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoVG9waWNGbmQucHJvdG90eXBlKS5zZXRNZXRhLmNhbGwodGhpcywgcGFyYW1zKS50aGVuKCgpID0+IHtcbiAgICAgIGlmIChPYmplY3Qua2V5cyh0aGlzLl9jb250YWN0cykubGVuZ3RoID4gMCkge1xuICAgICAgICB0aGlzLl9jb250YWN0cyA9IHt9O1xuICAgICAgICBpZiAodGhpcy5vblN1YnNVcGRhdGVkKSB7XG4gICAgICAgICAgdGhpcy5vblN1YnNVcGRhdGVkKFtdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEl0ZXJhdGUgb3ZlciBmb3VuZCBjb250YWN0cy4gSWYgY2FsbGJhY2sgaXMgdW5kZWZpbmVkLCB1c2Uge0BsaW5rIHRoaXMub25NZXRhU3VifS5cbiAgICogQGZ1bmN0aW9uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWNGbmQjXG4gICAqIEBwYXJhbSB7VG9waWNGbmQuQ29udGFjdENhbGxiYWNrfSBjYWxsYmFjayAtIENhbGxiYWNrIHRvIGNhbGwgZm9yIGVhY2ggY29udGFjdC5cbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSBDb250ZXh0IHRvIHVzZSBmb3IgY2FsbGluZyB0aGUgYGNhbGxiYWNrYCwgaS5lLiB0aGUgdmFsdWUgb2YgYHRoaXNgIGluc2lkZSB0aGUgY2FsbGJhY2suXG4gICAqL1xuICBjb250YWN0cyhjYWxsYmFjaywgY29udGV4dCkge1xuICAgIGNvbnN0IGNiID0gKGNhbGxiYWNrIHx8IHRoaXMub25NZXRhU3ViKTtcbiAgICBpZiAoY2IpIHtcbiAgICAgIGZvciAobGV0IGlkeCBpbiB0aGlzLl9jb250YWN0cykge1xuICAgICAgICBjYi5jYWxsKGNvbnRleHQsIHRoaXMuX2NvbnRhY3RzW2lkeF0sIGlkeCwgdGhpcy5fY29udGFjdHMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIiwiLyoqXG4gKiBAZmlsZSBVdGlsaXRpZXMgdXNlZCBpbiBtdWx0aXBsZSBwbGFjZXMuXG4gKlxuICogQGNvcHlyaWdodCAyMDE1LTIwMjIgVGlub2RlIExMQy5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgQWNjZXNzTW9kZSBmcm9tICcuL2FjY2Vzcy1tb2RlLmpzJztcbmltcG9ydCB7XG4gIERFTF9DSEFSXG59IGZyb20gJy4vY29uZmlnLmpzJztcblxuLy8gQXR0ZW1wdCB0byBjb252ZXJ0IGRhdGUgYW5kIEFjY2Vzc01vZGUgc3RyaW5ncyB0byBvYmplY3RzLlxuZXhwb3J0IGZ1bmN0aW9uIGpzb25QYXJzZUhlbHBlcihrZXksIHZhbCkge1xuICAvLyBUcnkgdG8gY29udmVydCBzdHJpbmcgdGltZXN0YW1wcyB3aXRoIG9wdGlvbmFsIG1pbGxpc2Vjb25kcyB0byBEYXRlLFxuICAvLyBlLmcuIDIwMTUtMDktMDJUMDE6NDU6NDNbLjEyM11aXG4gIGlmICh0eXBlb2YgdmFsID09ICdzdHJpbmcnICYmIHZhbC5sZW5ndGggPj0gMjAgJiYgdmFsLmxlbmd0aCA8PSAyNCAmJiBbJ3RzJywgJ3RvdWNoZWQnLCAndXBkYXRlZCcsICdjcmVhdGVkJywgJ3doZW4nLCAnZGVsZXRlZCcsICdleHBpcmVzJ10uaW5jbHVkZXMoa2V5KSkge1xuXG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHZhbCk7XG4gICAgaWYgKCFpc05hTihkYXRlKSkge1xuICAgICAgcmV0dXJuIGRhdGU7XG4gICAgfVxuICB9IGVsc2UgaWYgKGtleSA9PT0gJ2FjcycgJiYgdHlwZW9mIHZhbCA9PT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gbmV3IEFjY2Vzc01vZGUodmFsKTtcbiAgfVxuICByZXR1cm4gdmFsO1xufVxuXG4vLyBDaGVja3MgaWYgVVJMIGlzIGEgcmVsYXRpdmUgdXJsLCBpLmUuIGhhcyBubyAnc2NoZW1lOi8vJywgaW5jbHVkaW5nIHRoZSBjYXNlIG9mIG1pc3Npbmcgc2NoZW1lICcvLycuXG4vLyBUaGUgc2NoZW1lIGlzIGV4cGVjdGVkIHRvIGJlIFJGQy1jb21wbGlhbnQsIGUuZy4gW2Etel1bYS16MC05Ky4tXSpcbi8vIGV4YW1wbGUuaHRtbCAtIG9rXG4vLyBodHRwczpleGFtcGxlLmNvbSAtIG5vdCBvay5cbi8vIGh0dHA6L2V4YW1wbGUuY29tIC0gbm90IG9rLlxuLy8gJyDihrIgaHR0cHM6Ly9leGFtcGxlLmNvbScgLSBub3Qgb2suICjihrIgbWVhbnMgY2FycmlhZ2UgcmV0dXJuKVxuZXhwb3J0IGZ1bmN0aW9uIGlzVXJsUmVsYXRpdmUodXJsKSB7XG4gIHJldHVybiB1cmwgJiYgIS9eXFxzKihbYS16XVthLXowLTkrLi1dKjp8XFwvXFwvKS9pbS50ZXN0KHVybCk7XG59XG5cbmZ1bmN0aW9uIGlzVmFsaWREYXRlKGQpIHtcbiAgcmV0dXJuIChkIGluc3RhbmNlb2YgRGF0ZSkgJiYgIWlzTmFOKGQpICYmIChkLmdldFRpbWUoKSAhPSAwKTtcbn1cblxuLy8gUkZDMzMzOSBmb3JtYXRlciBvZiBEYXRlXG5leHBvcnQgZnVuY3Rpb24gcmZjMzMzOURhdGVTdHJpbmcoZCkge1xuICBpZiAoIWlzVmFsaWREYXRlKGQpKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGNvbnN0IHBhZCA9IGZ1bmN0aW9uKHZhbCwgc3ApIHtcbiAgICBzcCA9IHNwIHx8IDI7XG4gICAgcmV0dXJuICcwJy5yZXBlYXQoc3AgLSAoJycgKyB2YWwpLmxlbmd0aCkgKyB2YWw7XG4gIH07XG5cbiAgY29uc3QgbWlsbGlzID0gZC5nZXRVVENNaWxsaXNlY29uZHMoKTtcbiAgcmV0dXJuIGQuZ2V0VVRDRnVsbFllYXIoKSArICctJyArIHBhZChkLmdldFVUQ01vbnRoKCkgKyAxKSArICctJyArIHBhZChkLmdldFVUQ0RhdGUoKSkgK1xuICAgICdUJyArIHBhZChkLmdldFVUQ0hvdXJzKCkpICsgJzonICsgcGFkKGQuZ2V0VVRDTWludXRlcygpKSArICc6JyArIHBhZChkLmdldFVUQ1NlY29uZHMoKSkgK1xuICAgIChtaWxsaXMgPyAnLicgKyBwYWQobWlsbGlzLCAzKSA6ICcnKSArICdaJztcbn1cblxuLy8gUmVjdXJzaXZlbHkgbWVyZ2Ugc3JjJ3Mgb3duIHByb3BlcnRpZXMgdG8gZHN0LlxuLy8gSWdub3JlIHByb3BlcnRpZXMgd2hlcmUgaWdub3JlW3Byb3BlcnR5XSBpcyB0cnVlLlxuLy8gQXJyYXkgYW5kIERhdGUgb2JqZWN0cyBhcmUgc2hhbGxvdy1jb3BpZWQuXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VPYmooZHN0LCBzcmMsIGlnbm9yZSkge1xuICBpZiAodHlwZW9mIHNyYyAhPSAnb2JqZWN0Jykge1xuICAgIGlmIChzcmMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGRzdDtcbiAgICB9XG4gICAgaWYgKHNyYyA9PT0gREVMX0NIQVIpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiBzcmM7XG4gIH1cbiAgLy8gSlMgaXMgY3Jhenk6IHR5cGVvZiBudWxsIGlzICdvYmplY3QnLlxuICBpZiAoc3JjID09PSBudWxsKSB7XG4gICAgcmV0dXJuIHNyYztcbiAgfVxuXG4gIC8vIEhhbmRsZSBEYXRlXG4gIGlmIChzcmMgaW5zdGFuY2VvZiBEYXRlICYmICFpc05hTihzcmMpKSB7XG4gICAgcmV0dXJuICghZHN0IHx8ICEoZHN0IGluc3RhbmNlb2YgRGF0ZSkgfHwgaXNOYU4oZHN0KSB8fCBkc3QgPCBzcmMpID8gc3JjIDogZHN0O1xuICB9XG5cbiAgLy8gQWNjZXNzIG1vZGVcbiAgaWYgKHNyYyBpbnN0YW5jZW9mIEFjY2Vzc01vZGUpIHtcbiAgICByZXR1cm4gbmV3IEFjY2Vzc01vZGUoc3JjKTtcbiAgfVxuXG4gIC8vIEhhbmRsZSBBcnJheVxuICBpZiAoc3JjIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICByZXR1cm4gc3JjO1xuICB9XG5cbiAgaWYgKCFkc3QgfHwgZHN0ID09PSBERUxfQ0hBUikge1xuICAgIGRzdCA9IHNyYy5jb25zdHJ1Y3RvcigpO1xuICB9XG5cbiAgZm9yIChsZXQgcHJvcCBpbiBzcmMpIHtcbiAgICBpZiAoc3JjLmhhc093blByb3BlcnR5KHByb3ApICYmICghaWdub3JlIHx8ICFpZ25vcmVbcHJvcF0pICYmIChwcm9wICE9ICdfbm9Gb3J3YXJkaW5nJykpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGRzdFtwcm9wXSA9IG1lcmdlT2JqKGRzdFtwcm9wXSwgc3JjW3Byb3BdKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAvLyBGSVhNRTogcHJvYmFibHkgbmVlZCB0byBsb2cgc29tZXRoaW5nIGhlcmUuXG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBkc3Q7XG59XG5cbi8vIFVwZGF0ZSBvYmplY3Qgc3RvcmVkIGluIGEgY2FjaGUuIFJldHVybnMgdXBkYXRlZCB2YWx1ZS5cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZVRvQ2FjaGUoY2FjaGUsIGtleSwgbmV3dmFsLCBpZ25vcmUpIHtcbiAgY2FjaGVba2V5XSA9IG1lcmdlT2JqKGNhY2hlW2tleV0sIG5ld3ZhbCwgaWdub3JlKTtcbiAgcmV0dXJuIGNhY2hlW2tleV07XG59XG5cbi8vIFN0cmlwcyBhbGwgdmFsdWVzIGZyb20gYW4gb2JqZWN0IG9mIHRoZXkgZXZhbHVhdGUgdG8gZmFsc2Ugb3IgaWYgdGhlaXIgbmFtZSBzdGFydHMgd2l0aCAnXycuXG4vLyBVc2VkIG9uIGFsbCBvdXRnb2luZyBvYmplY3QgYmVmb3JlIHNlcmlhbGl6YXRpb24gdG8gc3RyaW5nLlxuZXhwb3J0IGZ1bmN0aW9uIHNpbXBsaWZ5KG9iaikge1xuICBPYmplY3Qua2V5cyhvYmopLmZvckVhY2goKGtleSkgPT4ge1xuICAgIGlmIChrZXlbMF0gPT0gJ18nKSB7XG4gICAgICAvLyBTdHJpcCBmaWVsZHMgbGlrZSBcIm9iai5fa2V5XCIuXG4gICAgICBkZWxldGUgb2JqW2tleV07XG4gICAgfSBlbHNlIGlmICghb2JqW2tleV0pIHtcbiAgICAgIC8vIFN0cmlwIGZpZWxkcyB3aGljaCBldmFsdWF0ZSB0byBmYWxzZS5cbiAgICAgIGRlbGV0ZSBvYmpba2V5XTtcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkob2JqW2tleV0pICYmIG9ialtrZXldLmxlbmd0aCA9PSAwKSB7XG4gICAgICAvLyBTdHJpcCBlbXB0eSBhcnJheXMuXG4gICAgICBkZWxldGUgb2JqW2tleV07XG4gICAgfSBlbHNlIGlmICghb2JqW2tleV0pIHtcbiAgICAgIC8vIFN0cmlwIGZpZWxkcyB3aGljaCBldmFsdWF0ZSB0byBmYWxzZS5cbiAgICAgIGRlbGV0ZSBvYmpba2V5XTtcbiAgICB9IGVsc2UgaWYgKG9ialtrZXldIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgLy8gU3RyaXAgaW52YWxpZCBvciB6ZXJvIGRhdGUuXG4gICAgICBpZiAoIWlzVmFsaWREYXRlKG9ialtrZXldKSkge1xuICAgICAgICBkZWxldGUgb2JqW2tleV07XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygb2JqW2tleV0gPT0gJ29iamVjdCcpIHtcbiAgICAgIHNpbXBsaWZ5KG9ialtrZXldKTtcbiAgICAgIC8vIFN0cmlwIGVtcHR5IG9iamVjdHMuXG4gICAgICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMob2JqW2tleV0pLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIGRlbGV0ZSBvYmpba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb2JqO1xufTtcblxuXG4vLyBUcmltIHdoaXRlc3BhY2UsIHN0cmlwIGVtcHR5IGFuZCBkdXBsaWNhdGUgZWxlbWVudHMgZWxlbWVudHMuXG4vLyBJZiB0aGUgcmVzdWx0IGlzIGFuIGVtcHR5IGFycmF5LCBhZGQgYSBzaW5nbGUgZWxlbWVudCBcIlxcdTI0MjFcIiAoVW5pY29kZSBEZWwgY2hhcmFjdGVyKS5cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVBcnJheShhcnIpIHtcbiAgbGV0IG91dCA9IFtdO1xuICBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7XG4gICAgLy8gVHJpbSwgdGhyb3cgYXdheSB2ZXJ5IHNob3J0IGFuZCBlbXB0eSB0YWdzLlxuICAgIGZvciAobGV0IGkgPSAwLCBsID0gYXJyLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgbGV0IHQgPSBhcnJbaV07XG4gICAgICBpZiAodCkge1xuICAgICAgICB0ID0gdC50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgaWYgKHQubGVuZ3RoID4gMSkge1xuICAgICAgICAgIG91dC5wdXNoKHQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIG91dC5zb3J0KCkuZmlsdGVyKGZ1bmN0aW9uKGl0ZW0sIHBvcywgYXJ5KSB7XG4gICAgICByZXR1cm4gIXBvcyB8fCBpdGVtICE9IGFyeVtwb3MgLSAxXTtcbiAgICB9KTtcbiAgfVxuICBpZiAob3V0Lmxlbmd0aCA9PSAwKSB7XG4gICAgLy8gQWRkIHNpbmdsZSB0YWcgd2l0aCBhIFVuaWNvZGUgRGVsIGNoYXJhY3Rlciwgb3RoZXJ3aXNlIGFuIGFtcHR5IGFycmF5XG4gICAgLy8gaXMgYW1iaWd1b3MuIFRoZSBEZWwgdGFnIHdpbGwgYmUgc3RyaXBwZWQgYnkgdGhlIHNlcnZlci5cbiAgICBvdXQucHVzaChERUxfQ0hBUik7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cbiIsIm1vZHVsZS5leHBvcnRzPXtcInZlcnNpb25cIjogXCIwLjIwLjAtYmV0YTJcIn1cbiJdfQ==

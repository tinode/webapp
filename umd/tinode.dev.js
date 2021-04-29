(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Tinode = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * @file In-memory sorted cache of objects..
 *
 * @copyright 2015-2021 Tinode
 * @summary Javascript bindings for Tinode.
 * @license Apache 2.0
 * @version 0.17
 */
'use strict';

/**
 * In-memory sorted cache of objects.
 *
 * @class CBuffer
 * @memberof Tinode
 * @protected
 *
 * @param {function} compare custom comparator of objects. Takes two parameters <code>a</code> and <code>b</code>;
 *    returns <code>-1</code> if <code>a < b</code>, <code>0</code> if <code>a == b</code>, <code>1</code> otherwise.
 * @param {boolean} unique enforce element uniqueness: when <code>true</code> replace existing element with a new
 *    one on conflict; when <code>false</code> keep both elements.
 */
const CBuffer = function(compare, unique) {
  let buffer = [];

  compare = compare || function(a, b) {
    return a === b ? 0 : a < b ? -1 : 1;
  };

  function findNearest(elem, arr, exact) {
    let start = 0;
    let end = arr.length - 1;
    let pivot = 0;
    let diff = 0;
    let found = false;

    while (start <= end) {
      pivot = (start + end) / 2 | 0;
      diff = compare(arr[pivot], elem);
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
    // Not exact - insertion point
    return {
      idx: diff < 0 ? pivot + 1 : pivot
    };
  }

  // Insert element into a sorted array.
  function insertSorted(elem, arr) {
    const found = findNearest(elem, arr, false);
    const count = (found.exact && unique) ? 1 : 0;
    arr.splice(found.idx, count, elem);
    return arr;
  }

  return {
    /**
     * Get an element at the given position.
     * @memberof Tinode.CBuffer#
     * @param {number} at - Position to fetch from.
     * @returns {Object} Element at the given position or <code>undefined</code>.
     */
    getAt: function(at) {
      return buffer[at];
    },

    /**
     * Convenience method for getting the last element of the buffer.
     * @memberof Tinode.CBuffer#
     * @returns {Object} The last element in the buffer or <code>undefined</code> if buffer is empty.
     */
    getLast: function() {
      return buffer.length > 0 ? buffer[buffer.length - 1] : undefined;
    },

    /**
     * Add new element(s) to the buffer. Variadic: takes one or more arguments. If an array is passed as a single
     * argument, its elements are inserted individually.
     * @memberof Tinode.CBuffer#
     *
     * @param {...Object|Array} - One or more objects to insert.
     */
    put: function() {
      let insert;
      // inspect arguments: if array, insert its elements, if one or more non-array arguments, insert them one by one
      if (arguments.length == 1 && Array.isArray(arguments[0])) {
        insert = arguments[0];
      } else {
        insert = arguments;
      }
      for (let idx in insert) {
        insertSorted(insert[idx], buffer);
      }
    },

    /**
     * Remove element at the given position.
     * @memberof Tinode.CBuffer#
     * @param {number} at - Position to delete at.
     * @returns {Object} Element at the given position or <code>undefined</code>.
     */
    delAt: function(at) {
      let r = buffer.splice(at, 1);
      if (r && r.length > 0) {
        return r[0];
      }
      return undefined;
    },

    /**
     * Remove elements between two positions.
     * @memberof Tinode.CBuffer#
     * @param {number} since - Position to delete from (inclusive).
     * @param {number} before - Position to delete to (exclusive).
     *
     * @returns {Array} array of removed elements (could be zero length).
     */
    delRange: function(since, before) {
      return buffer.splice(since, before - since);
    },

    /**
     * Return the number of elements the buffer holds.
     * @memberof Tinode.CBuffer#
     * @return {number} Number of elements in the buffer.
     */
    length: function() {
      return buffer.length;
    },

    /**
     * Reset the buffer discarding all elements
     * @memberof Tinode.CBuffer#
     */
    reset: function() {
      buffer = [];
    },

    /**
     * Callback for iterating contents of buffer. See {@link Tinode.CBuffer#forEach}.
     * @callback ForEachCallbackType
     * @memberof Tinode.CBuffer#
     * @param {Object} elem - Element of the buffer.
     * @param {number} index - Index of the current element.
     */

    /**
     * Apply given <code>callback</code> to all elements of the buffer.
     * @memberof Tinode.CBuffer#
     *
     * @param {Tinode.ForEachCallbackType} callback - Function to call for each element.
     * @param {number} startIdx - Optional index to start iterating from (inclusive).
     * @param {number} beforeIdx - Optional index to stop iterating before (exclusive).
     * @param {Object} context - calling context (i.e. value of <code>this</code> in callback)
     */
    forEach: function(callback, startIdx, beforeIdx, context) {
      startIdx = startIdx | 0;
      beforeIdx = beforeIdx || buffer.length;
      for (let i = startIdx; i < beforeIdx; i++) {
        callback.call(context, buffer[i], i);
      }
    },

    /**
     * Find element in buffer using buffer's comparison function.
     * @memberof Tinode.CBuffer#
     *
     * @param {Object} elem - element to find.
     * @param {boolean=} nearest - when true and exact match is not found, return the nearest element (insertion point).
     * @returns {number} index of the element in the buffer or -1.
     */
    find: function(elem, nearest) {
      const {
        idx
      } = findNearest(elem, buffer, !nearest);
      return idx;
    }
  }
}

if (typeof module != 'undefined') {
  module.exports = CBuffer;
}

},{}],2:[function(require,module,exports){
(function (global){(function (){
/**
 * @file Abstraction layer for websocket and long polling connections.
 * See <a href="https://github.com/tinode/webapp">https://github.com/tinode/webapp</a> for real-life usage.
 *
 * @copyright 2015-2021 Tinode
 * @summary Javascript bindings for Tinode.
 * @license Apache 2.0
 * @version 0.17
 */
'use strict';

let WebSocketProvider;
if (typeof WebSocket != 'undefined') {
  WebSocketProvider = WebSocket;
}

let XHRProvider;
if (typeof XMLHttpRequest != 'undefined') {
  XHRProvider = XMLHttpRequest;
}

if (typeof window == 'undefined') {
  global.window = {
    WebSocket: WebSocketProvider,
    XMLHttpRequest: XHRProvider,
  }
}

// Error code to return in case of a network problem.
const NETWORK_ERROR = 503;
const NETWORK_ERROR_TEXT = "Connection failed";

// Error code to return when user disconnected from server.
const NETWORK_USER = 418;
const NETWORK_USER_TEXT = "Disconnected by client";

// Helper function for creating an endpoint URL.
function makeBaseUrl(host, protocol, version, apiKey) {
  let url = null;

  if (protocol === 'http' || protocol === 'https' || protocol === 'ws' || protocol === 'wss') {
    url = protocol + '://';
    url += host;
    if (url.charAt(url.length - 1) !== '/') {
      url += '/';
    }
    url += 'v' + version + '/channels';
    if (protocol === 'http' || protocol === 'https') {
      // Long polling endpoint end with "lp", i.e.
      // '/v0/channels/lp' vs just '/v0/channels' for ws
      url += '/lp';
    }
    url += '?apikey=' + apiKey;
  }

  return url;
}

/**
 * An abstraction for a websocket or a long polling connection.
 *
 * @class Connection
 * @memberof Tinode
 *
 * @param {string} host_ - Host name and port number to connect to.
 * @param {string} version_ - Major value of the protocol version, e.g. '0' in '0.17.1'.
 * @param {string} apiKey_ - API key generated by keygen
 * @param {string} transport_ - Network transport to use, either <code>"ws"<code>/<code>"wss"</code> for websocket or
 *      <code>lp</code> for long polling.
 * @param {boolean} secure_ - Use secure WebSocket (wss) if <code>true</code>.
 * @param {boolean} autoreconnect_ - If connection is lost, try to reconnect automatically.
 */
const Connection = function(host_, version_, apiKey_, transport_, secure_, autoreconnect_) {
  let host = host_;
  let version = version_;
  let secure = secure_;
  let apiKey = apiKey_;

  let autoreconnect = autoreconnect_;

  // Settings for exponential backoff
  const _BOFF_BASE = 2000; // 2000 milliseconds, minimum delay between reconnects
  const _BOFF_MAX_ITER = 10; // Maximum delay between reconnects 2^10 * 2000 ~ 34 minutes
  const _BOFF_JITTER = 0.3; // Add random delay

  let _boffTimer = null;
  let _boffIteration = 0;
  let _boffClosed = false; // Indicator if the socket was manually closed - don't autoreconnect if true.

  const log = (text, ...args) => {
    if (this.logger) {
      this.logger(text, ...args);
    }
  }

  // Backoff implementation - reconnect after a timeout.
  function boffReconnect() {
    // Clear timer
    clearTimeout(_boffTimer);
    // Calculate when to fire the reconnect attempt
    const timeout = _BOFF_BASE * (Math.pow(2, _boffIteration) * (1.0 + _BOFF_JITTER * Math.random()));
    // Update iteration counter for future use
    _boffIteration = (_boffIteration >= _BOFF_MAX_ITER ? _boffIteration : _boffIteration + 1);
    if (this.onAutoreconnectIteration) {
      this.onAutoreconnectIteration(timeout);
    }

    _boffTimer = setTimeout(() => {
      log(`Reconnecting, iter=${_boffIteration}, timeout=${timeout}`);
      // Maybe the socket was closed while we waited for the timer?
      if (!_boffClosed) {
        const prom = this.connect();
        if (this.onAutoreconnectIteration) {
          this.onAutoreconnectIteration(0, prom);
        } else {
          // Suppress error if it's not used.
          prom.catch(() => {
            /* do nothing */
          });
        }
      } else if (this.onAutoreconnectIteration) {
        this.onAutoreconnectIteration(-1);
      }
    }, timeout);
  }

  // Terminate auto-reconnect process.
  function boffStop() {
    clearTimeout(_boffTimer);
    _boffTimer = null;
  }

  // Reset auto-reconnect iteration counter.
  function boffReset() {
    _boffIteration = 0;
  }

  // Initialization for Websocket
  function init_ws(instance) {
    let _socket = null;

    /**
     * Initiate a new connection
     * @memberof Tinode.Connection#
     * @param {string} host_ Host name to connect to; if <code>null</code> the old host name will be used.
     * @param {boolean} force Force new connection even if one already exists.
     * @return {Promise} Promise resolved/rejected when the connection call completes, resolution is called without
     *  parameters, rejection passes the {Error} as parameter.
     */
    instance.connect = function(host_, force) {
      _boffClosed = false;

      if (_socket) {
        if (!force && _socket.readyState == _socket.OPEN) {
          return Promise.resolve();
        }
        _socket.close();
        _socket = null;
      }

      if (host_) {
        host = host_;
      }

      return new Promise(function(resolve, reject) {
        const url = makeBaseUrl(host, secure ? 'wss' : 'ws', version, apiKey);

        log("Connecting to: ", url);

        // It throws when the server is not accessible but the exception cannot be caught:
        // https://stackoverflow.com/questions/31002592/javascript-doesnt-catch-error-in-websocket-instantiation/31003057
        const conn = new WebSocketProvider(url);

        conn.onerror = function(err) {
          reject(err);
        }

        conn.onopen = function(evt) {
          if (autoreconnect) {
            boffStop();
          }

          if (instance.onOpen) {
            instance.onOpen();
          }

          resolve();
        }

        conn.onclose = function(evt) {
          _socket = null;

          if (instance.onDisconnect) {
            const code = _boffClosed ? NETWORK_USER : NETWORK_ERROR;
            instance.onDisconnect(new Error(_boffClosed ? NETWORK_USER_TEXT : NETWORK_ERROR_TEXT +
              ' (' + code + ')'), code);
          }

          if (!_boffClosed && autoreconnect) {
            boffReconnect.call(instance);
          }
        }

        conn.onmessage = function(evt) {
          if (instance.onMessage) {
            instance.onMessage(evt.data);
          }
        }
        _socket = conn;
      });
    }

    /**
     * Try to restore a network connection, also reset backoff.
     * @memberof Tinode.Connection#
     *
     * @param {boolean} force - reconnect even if there is a live connection already.
     */
    instance.reconnect = function(force) {
      boffStop();
      instance.connect(null, force);
    }

    /**
     * Terminate the network connection
     * @memberof Tinode.Connection#
     */
    instance.disconnect = function() {
      _boffClosed = true;
      boffStop();

      if (!_socket) {
        return;
      }
      _socket.close();
      _socket = null;
    }

    /**
     * Send a string to the server.
     * @memberof Tinode.Connection#
     *
     * @param {string} msg - String to send.
     * @throws Throws an exception if the underlying connection is not live.
     */
    instance.sendText = function(msg) {
      if (_socket && (_socket.readyState == _socket.OPEN)) {
        _socket.send(msg);
      } else {
        throw new Error("Websocket is not connected");
      }
    };

    /**
     * Check if socket is alive.
     * @memberof Tinode.Connection#
     * @returns {boolean} <code>true</code> if connection is live, <code>false</code> otherwise.
     */
    instance.isConnected = function() {
      return (_socket && (_socket.readyState == _socket.OPEN));
    }

    /**
     * Get the name of the current network transport.
     * @memberof Tinode.Connection#
     * @returns {string} name of the transport such as <code>"ws"</code> or <code>"lp"</code>.
     */
    instance.transport = function() {
      return 'ws';
    }

    /**
     * Send network probe to check if connection is indeed live.
     * @memberof Tinode.Connection#
     */
    instance.probe = function() {
      instance.sendText('1');
    }
  }

  // Initialization for long polling.
  function init_lp(instance) {
    const XDR_UNSENT = 0; // Client has been created. open() not called yet.
    const XDR_OPENED = 1; // open() has been called.
    const XDR_HEADERS_RECEIVED = 2; // send() has been called, and headers and status are available.
    const XDR_LOADING = 3; // Downloading; responseText holds partial data.
    const XDR_DONE = 4; // The operation is complete.
    // Fully composed endpoint URL, with API key & SID
    let _lpURL = null;

    let _poller = null;
    let _sender = null;

    function lp_sender(url_) {
      let sender = new XMLHttpRequest();
      sender.onreadystatechange = function(evt) {
        if (sender.readyState == XDR_DONE && sender.status >= 400) {
          // Some sort of error response
          throw new Error(`LP sender failed, ${sender.status}`);
        }
      }

      sender.open('POST', url_, true);
      return sender;
    }

    function lp_poller(url_, resolve, reject) {
      let poller = new XMLHttpRequest();
      let promiseCompleted = false;

      poller.onreadystatechange = function(evt) {

        if (poller.readyState == XDR_DONE) {
          if (poller.status == 201) { // 201 == HTTP.Created, get SID
            let pkt = JSON.parse(poller.responseText, jsonParseHelper);
            _lpURL = url_ + '&sid=' + pkt.ctrl.params.sid
            poller = lp_poller(_lpURL);
            poller.send(null)
            if (instance.onOpen) {
              instance.onOpen();
            }

            if (resolve) {
              promiseCompleted = true;
              resolve();
            }

            if (autoreconnect) {
              boffStop();
            }
          } else if (poller.status < 400) { // 400 = HTTP.BadRequest
            if (instance.onMessage) {
              instance.onMessage(poller.responseText)
            }
            poller = lp_poller(_lpURL);
            poller.send(null);
          } else {
            // Don't throw an error here, gracefully handle server errors
            if (reject && !promiseCompleted) {
              promiseCompleted = true;
              reject(poller.responseText);
            }
            if (instance.onMessage && poller.responseText) {
              instance.onMessage(poller.responseText);
            }
            if (instance.onDisconnect) {
              const code = poller.status || (_boffClosed ? NETWORK_USER : NETWORK_ERROR);
              const text = poller.responseText || (_boffClosed ? NETWORK_USER_TEXT : NETWORK_ERROR_TEXT);
              instance.onDisconnect(new Error(text + ' (' + code + ')'), code);
            }

            // Polling has stopped. Indicate it by setting poller to null.
            poller = null;
            if (!_boffClosed && autoreconnect) {
              boffReconnect.call(instance);
            }
          }
        }
      }
      poller.open('GET', url_, true);
      return poller;
    }

    instance.connect = function(host_, force) {
      _boffClosed = false;

      if (_poller) {
        if (!force) {
          return Promise.resolve();
        }
        _poller.onreadystatechange = undefined;
        _poller.abort();
        _poller = null;
      }

      if (host_) {
        host = host_;
      }

      return new Promise(function(resolve, reject) {
        const url = makeBaseUrl(host, secure ? 'https' : 'http', version, apiKey);
        log("Connecting to: ", url);
        _poller = lp_poller(url, resolve, reject);
        _poller.send(null)
      }).catch((err) => {
        log("LP connection failed:", err);
      });
    };

    instance.reconnect = function(force) {
      boffStop();
      instance.connect(null, force);
    };

    instance.disconnect = function() {
      _boffClosed = true;
      boffStop();

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

      if (instance.onDisconnect) {
        instance.onDisconnect(new Error(NETWORK_USER_TEXT + ' (' + NETWORK_USER + ')'), NETWORK_USER);
      }
      // Ensure it's reconstructed
      _lpURL = null;
    }

    instance.sendText = function(msg) {
      _sender = lp_sender(_lpURL);
      if (_sender && (_sender.readyState == 1)) { // 1 == OPENED
        _sender.send(msg);
      } else {
        throw new Error("Long poller failed to connect");
      }
    };

    instance.isConnected = function() {
      return (_poller && true);
    }

    instance.transport = function() {
      return 'lp';
    }

    instance.probe = function() {
      instance.sendText('1');
    }
  }

  let initialized = false;
  if (transport_ === 'lp') {
    // explicit request to use long polling
    init_lp(this);
    initialized = true;
  } else if (transport_ === 'ws') {
    // explicit request to use web socket
    // if websockets are not available, horrible things will happen
    init_ws(this);
    initialized = true;

    // Default transport selection
  } else if (typeof window == 'object') {
    if (window['WebSocket']) {
      // Using web sockets -- default.
      init_ws(this);
      initialized = true;
    } else if (window['XMLHttpRequest']) {
      // The browser has no websockets, using long polling.
      init_lp(this);
      initialized = true;
    }
  }

  if (!initialized) {
    // No transport is avaiilable.
    log("No network transport is available. Running under Node? Call 'Tinode.setNetworkProviders()'.");
    throw new Error("No network transport is available. Running under Node? Call 'Tinode.setNetworkProviders()'.");
  }

  /**
   * Check if the given network transport is available.
   * @memberof Tinode.Connection#
   * @param {string} trans - either <code>"ws"</code> (websocket) or <code>"lp"</code> (long polling).
   * @returns true if given transport is available, false otherwise.
   */
  this.transportAvailable = function(transp) {
    switch (transp) {
      case 'ws':
        return typeof window == 'object' && window['WebSocket'];
      case 'lp':
        return typeof window == 'object' && window['XMLHttpRequest'];
      default:
        log("Request for unknown transport", transp);
        return false;
    }
  }

  /**
   * Reset autoreconnect counter to zero.
   * @memberof Tinode.Connection#
   */
  this.backoffReset = function() {
    boffReset();
  }

  // Callbacks:
  /**
   * A callback to pass incoming messages to. See {@link Tinode.Connection#onMessage}.
   * @callback Tinode.Connection.OnMessage
   * @memberof Tinode.Connection
   * @param {string} message - Message to process.
   */
  /**
   * A callback to pass incoming messages to.
   * @type {Tinode.Connection.OnMessage}
   * @memberof Tinode.Connection#
   */
  this.onMessage = undefined;

  /**
   * A callback for reporting a dropped connection.
   * @type {function}
   * @memberof Tinode.Connection#
   */
  this.onDisconnect = undefined;

  /**
   * A callback called when the connection is ready to be used for sending. For websockets it's socket open,
   * for long polling it's <code>readyState=1</code> (OPENED)
   * @type {function}
   * @memberof Tinode.Connection#
   */
  this.onOpen = undefined;

  /**
   * A callback to notify of reconnection attempts. See {@link Tinode.Connection#onAutoreconnectIteration}.
   * @memberof Tinode.Connection
   * @callback AutoreconnectIterationType
   * @param {string} timeout - time till the next reconnect attempt in milliseconds. <code>-1</code> means reconnect was skipped.
   * @param {Promise} promise resolved or rejected when the reconnect attemp completes.
   *
   */
  /**
   * A callback to inform when the next attampt to reconnect will happen and to receive connection promise.
   * @memberof Tinode.Connection#
   * @type {Tinode.Connection.AutoreconnectIterationType}
   */
  this.onAutoreconnectIteration = undefined;

  /**
   * A callback to log events from Connection. See {@link Tinode.Connection#logger}.
   * @memberof Tinode.Connection
   * @callback LoggerCallbackType
   * @param {string} event - Event to log.
   */
  /**
   * A callback to report logging events.
   * @memberof Tinode.Connection#
   * @type {Tinode.Connection.LoggerCallbackType}
   */
  this.logger = undefined;
};

/**
 * To use Connection in a non browser context, supply WebSocket and XMLHttpRequest providers.
 * @static
 * @memberof Connection
 * @param wsProvider WebSocket provider, e.g. for nodeJS , <code>require('ws')</code>.
 * @param xhrProvider XMLHttpRequest provider, e.g. for node <code>require('xhr')</code>.
 */
Connection.setNetworkProviders = function(wsProvider, xhrProvider) {
  WebSocketProvider = wsProvider;
  XHRProvider = xhrProvider;
};

Connection.NETWORK_ERROR = NETWORK_ERROR;
Connection.NETWORK_ERROR_TEXT = NETWORK_ERROR_TEXT;
Connection.NETWORK_USER = NETWORK_USER;
Connection.NETWORK_USER_TEXT = NETWORK_USER_TEXT;

if (typeof module != 'undefined') {
  module.exports = Connection;
}

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],3:[function(require,module,exports){
/**
 * @file Helper methods for dealing with IndexedDB cache of messages, users, and topics.
 * See <a href="https://github.com/tinode/webapp">https://github.com/tinode/webapp</a> for real-life usage.
 *
 * @copyright 2015-2021 Tinode
 * @summary Javascript bindings for Tinode.
 * @license Apache 2.0
 * @version 0.17
 */
'use strict';

// NOTE TO DEVELOPERS:
// Localizable strings should be double quoted "строка на другом языке",
// non-localizable strings should be single quoted 'non-localized'.

const DB_VERSION = 1;
const DB_NAME = 'tinode-web';

const DB = function(onError, logger) {
  onError = onError || function() {}
  logger = logger || function() {}

  // Placeholder DB which does nothing.
  let db = null;
  // Indicator that the cache is disabled.
  let disabled = false;

  // Serializable topic fields.
  const topic_fields = ['created', 'updated', 'deleted', 'read', 'recv', 'seq', 'clear', 'defacs',
    'creds', 'public', 'private', 'touched'
  ];

  // Copy values from 'src' to 'dst'. Allocate dst if 'it's null or undefined.
  function serializeTopic(dst, src) {
    const res = dst || {
      name: src.name
    };
    topic_fields.forEach((f) => {
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

  // Copy data from src to Topic object.
  function deserializeTopic(topic, src) {
    topic_fields.forEach((f) => {
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
  }

  function serializeSubscription(dst, topicName, uid, sub) {
    const fields = ['updated', 'mode', 'read', 'recv', 'clear', 'lastSeen', 'userAgent'];
    const res = dst || {
      topic: topicName,
      uid: uid
    };

    fields.forEach((f) => {
      if (sub.hasOwnProperty(f)) {
        res[f] = sub[f];
      }
    });

    return res;
  }

  function serializeMessage(dst, msg) {
    // Serializable fields.
    const fields = ['topic', 'seq', 'ts', '_status', 'from', 'head', 'content'];
    const res = dst || {};
    fields.forEach((f) => {
      if (msg.hasOwnProperty(f)) {
        res[f] = msg[f];
      }
    });
    return res;
  }

  return {
    /**
     * Initialize persistent cache: open or create/upgrade if needed.
     * @returns {Promise} promise to be resolved/rejected when the DB is initialized.
     */
    initDatabase: function() {
      return new Promise((resolve, reject) => {
        // Open the database and initialize callbacks.
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onsuccess = (event) => {
          db = event.target.result;
          resolve(db);
        };
        req.onerror = (event) => {
          logger("PCache", "failed to initialize", event);
          reject(event.target.error);
          if (onError) {
            onError(event.target.error);
          }
        };
        req.onupgradeneeded = function(event) {
          db = event.target.result;

          db.onerror = function(event) {
            logger("PCache", "failed to create storage", event);
            if (onError) {
              onError(event.target.error);
            }
          };

          // Individual object stores.

          // Object store (table) for topics. The primary key is topic name.
          db.createObjectStore('topic', {
            keyPath: 'name'
          });

          // Users object store. UID is the primary key.
          db.createObjectStore('user', {
            keyPath: 'uid'
          });

          // Subscriptions object store topic <-> user. Topic name + UID is the primary key.
          db.createObjectStore('subscription', {
            keyPath: ['topic', 'uid']
          });

          // Messages object store. The primary key is topic name + seq.
          db.createObjectStore('message', {
            keyPath: ['topic', 'seq']
          });
        };
      });
    },

    /**
     * Delete persistent cache.
     */
    deleteDatabase: function() {
      return new Promise((resolve, reject) => {
        const req = indexedDB.deleteDatabase(DB_NAME);
        req.onsuccess = function(event) {
          resolve(true);
        };
        req.onerror = function(event) {
          logger("PCache", "deleteDatabase", event.target.error);
          reject(event.target.error);
        };
      });
    },

    /**
     * Check if persistent cache is ready for use.
     * @returns {boolean} <code>true</code> if cache is ready, <code>false</code> otherwise.
     */
    isReady: function() {
      return !!db;
    },

    /**
     * Disable persistent cache: all operations do nothing but return success.
     */
    disable: function() {
      db = null;
      disabled = true;
    },

    // Topics.
    /**
     * Add or update topic in persistent cache.
     * @memberOf DB
     * @param {Topic} topic - topic to be added to persistent storage.
     * @returns {Promise} promise resolved/rejected on operation completion.
     */
    updTopic: function(topic) {
      if (!this.isReady()) {
        return disabled ?
          Promise.resolve() :
          Promise.reject(new Error("not initialized"));
      }
      return new Promise((resolve, reject) => {
        const trx = db.transaction(['topic'], 'readwrite');
        trx.oncomplete = (event) => {
          resolve(event.target.result);
        };
        trx.onerror = (event) => {
          logger("PCache", "updTopic", event.target.error);
          reject(event.target.error);
        };
        const req = trx.objectStore('topic').get(topic.name);
        req.onsuccess = (event) => {
          trx.objectStore('topic').put(serializeTopic(req.result, topic));
          trx.commit();
        };
      });
    },

    /**
     * Remove topic from persistent cache.
     * @memberOf DB
     * @param {string} name - name of the topic to remove from database.
     * @return {Promise} promise resolved/rejected on operation completion.
     */
    remTopic: function(name) {
      if (!this.isReady()) {
        return disabled ?
          Promise.resolve() :
          Promise.reject(new Error("not initialized"));
      }
      return new Promise((resolve, reject) => {
        const trx = db.transaction(['topic', 'subscription', 'message'], 'readwrite');
        trx.oncomplete = (event) => {
          resolve(event.target.result);
        };
        trx.onerror = (event) => {
          logger("PCache", "remTopic", event.target.error);
          reject(event.target.error);
        };
        trx.objectStore('topic').delete(IDBKeyRange.only(name));
        trx.objectStore('subscription').delete(IDBKeyRange.bound([name, '-'], [name, '~']));
        trx.objectStore('message').delete(IDBKeyRange.bound([name, 0], [name, Number.MAX_SAFE_INTEGER]));
        trx.commit();
      });
    },

    /**
     * Execute a callback for each stored topic.
     * @memberOf DB
     * @param {function} callback - function to call for each topic.
     * @param {Object} context - the value or <code>this</code> inside the callback.
     * @return {Promise} promise resolved/rejected on operation completion.
     */
    mapTopics: function(callback, context) {
      if (!this.isReady()) {
        return disabled ?
          Promise.resolve([]) :
          Promise.reject(new Error("not initialized"));
      }
      return new Promise((resolve, reject) => {
        const trx = db.transaction(['topic']);
        trx.onerror = (event) => {
          logger("PCache", "mapTopics", event.target.error);
          reject(event.target.error);
        };
        trx.objectStore('topic').getAll().onsuccess = (event) => {
          if (callback) {
            event.target.result.forEach((topic) => {
              callback.call(context, topic);
            });
          }
          resolve(event.target.result);
        };
      });
    },

    /**
     * Copy data from serialized object to topic.
     * @memberOf DB
     * @param {Topic} topic - target to deserialize to.
     * @param {Object} src - serialized data to copy from.
     */
    deserializeTopic: function(topic, src) {
      deserializeTopic(topic, src);
    },

    // Users.
    /**
     * Add or update user object in the persistent cache.
     * @memberOf DB
     * @param {string} uid - ID of the user to save.
     * @param {Object} pub - user's <code>public</code> information.
     * @returns {Promise} promise resolved/rejected on operation completion.
     */
    updUser: function(uid, pub) {
      if (arguments.length < 2 || pub === undefined) {
        // No point inupdating user with invalid data.
        return;
      }
      if (!this.isReady()) {
        return disabled ?
          Promise.resolve() :
          Promise.reject(new Error("not initialized"));
      }
      return new Promise((resolve, reject) => {
        const trx = db.transaction(['user'], 'readwrite');
        trx.oncomplete = (event) => {
          resolve(event.target.result);
        };
        trx.onerror = (event) => {
          logger("PCache", "updUser", event.target.error);
          reject(event.target.error);
        };
        trx.objectStore('user').put({
          uid: uid,
          public: pub
        });
        trx.commit();
      });
    },

    /**
     * Remove user from persistent cache.
     * @memberOf DB
     * @param {string} uid - ID of the user to remove from the cache.
     * @return {Promise} promise resolved/rejected on operation completion.
     */
    remUser: function(uid) {
      if (!this.isReady()) {
        return disabled ?
          Promise.resolve() :
          Promise.reject(new Error("not initialized"));
      }
      return new Promise((resolve, reject) => {
        const trx = db.transaction(['user'], 'readwrite');
        trx.oncomplete = (event) => {
          resolve(event.target.result);
        };
        trx.onerror = (event) => {
          logger("PCache", "remUser", event.target.error);
          reject(event.target.error);
        };
        trx.objectStore('user').delete(IDBKeyRange.only(uid));
        trx.commit();
      });
    },

    /**
     * Read a single user from persistent cache.
     * @memberOf DB
     * @param {string} uid - ID of the user to fetch from cache.
     * @return {Promise} promise resolved/rejected on operation completion.
     */
    getUser: function(uid) {
      if (!this.isReady()) {
        return disabled ?
          Promise.resolve() :
          Promise.reject(new Error("not initialized"));
      }
      return new Promise((resolve, reject) => {
        const trx = db.transaction(['user']);
        trx.oncomplete = (event) => {
          const user = event.target.result;
          resolve({
            user: user.uid,
            public: user.public
          });
        };
        trx.onerror = (event) => {
          logger("PCache", "getUser", event.target.error);
          reject(event.target.error);
        };
        trx.objectStore('user').get(uid);
      });
    },

    // Subscriptions.

    /**
     * Add or update subscription in persistent cache.
     * @memberOf DB
     * @param {string} topicName - name of the topic which owns the message.
     * @param {string} uid - ID of the subscribed user.
     * @param {Object} sub - subscription to save.
     * @return {Promise} promise resolved/rejected on operation completion.
     */
    updSubscription: function(topicName, uid, sub) {
      if (!this.isReady()) {
        return disabled ?
          Promise.resolve() :
          Promise.reject(new Error("not initialized"));
      }
      return new Promise((resolve, reject) => {
        const trx = db.transaction(['subscription'], 'readwrite');
        trx.oncomplete = (event) => {
          resolve(event.target.result);
        };
        trx.onerror = (event) => {
          logger("PCache", "updSubscription", event.target.error);
          reject(event.target.error);
        };
        trx.objectStore('subscription').get([topicName, uid]).onsuccess = (event) => {
          trx.objectStore('subscription').put(serializeSubscription(event.target.result, topicName, uid, sub));
          trx.commit();
        };
      });
    },

    /**
     * Execute a callback for each cached subscription in a given topic.
     * @memberOf DB
     * @param {string} topicName - name of the topic which owns the subscriptions.
     * @param {function} callback - function to call for each subscription.
     * @param {Object} context - the value or <code>this</code> inside the callback.
     * @return {Promise} promise resolved/rejected on operation completion.
     */
    mapSubscriptions: function(topicName, callback, context) {
      if (!this.isReady()) {
        return disabled ?
          Promise.resolve([]) :
          Promise.reject(new Error("not initialized"));
      }
      return new Promise((resolve, reject) => {
        const trx = db.transaction(['subscription']);
        trx.onerror = (event) => {
          logger("PCache", "mapSubscriptions", event.target.error);
          reject(event.target.error);
        };
        trx.objectStore('subscription').getAll(IDBKeyRange.bound([topicName, '-'], [topicName, '~'])).onsuccess = (event) => {
          if (callback) {
            event.target.result.forEach((topic) => {
              callback.call(context, topic);
            });
          }
          resolve(event.target.result);
        };
      });
    },

    // Messages.

    /**
     * Save message to persistent cache.
     * @memberOf DB
     * @param {string} topicName - name of the topic which owns the message.
     * @param {Object} msg - message to save.
     * @return {Promise} promise resolved/rejected on operation completion.
     */
    addMessage: function(msg) {
      if (!this.isReady()) {
        return disabled ?
          Promise.resolve() :
          Promise.reject(new Error("not initialized"));
      }
      return new Promise((resolve, reject) => {
        const trx = db.transaction(['message'], 'readwrite');
        trx.onsuccess = (event) => {
          resolve(event.target.result);
        };
        trx.onerror = (event) => {
          logger("PCache", "addMesssage", event.target.error);
          reject(event.target.error);
        };
        trx.objectStore('message').add(serializeMessage(null, msg));
        trx.commit();
      });
    },

    /**
     * Update delivery status of a message stored in persistent cache.
     * @memberOf DB
     * @param {string} topicName - name of the topic which owns the message.
     * @param {number} seq - ID of the message to update
     * @param {number} status - new delivery status of the message.
     * @return {Promise} promise resolved/rejected on operation completion.
     */
    updMessageStatus: function(topicName, seq, status) {
      if (!this.isReady()) {
        return disabled ?
          Promise.resolve() :
          Promise.reject(new Error("not initialized"));
      }
      return new Promise((resolve, reject) => {
        const trx = db.transaction(['message'], 'readwrite');
        trx.onsuccess = (event) => {
          resolve(event.target.result);
        };
        trx.onerror = (event) => {
          logger("PCache", "updMessageStatus", event.target.error);
          reject(event.target.error);
        };
        const req = trx.objectStore('message').get(IDBKeyRange.only([topicName, seq]));
        req.onsuccess = (event) => {
          const src = req.result || event.target.result;
          if (!src || src._status == status) {
            trx.commit();
            return;
          }
          trx.objectStore('message').put(serializeMessage(src, {
            topic: topicName,
            seq: seq,
            _status: status
          }));
          trx.commit();
        };
      });
    },

    /**
     * Remove one or more messages from persistent cache.
     * @memberOf DB
     * @param {string} topicName - name of the topic which owns the message.
     * @param {number} from - id of the message to remove or lower boundary when removing range (inclusive).
     * @param {number=} to - upper boundary (exclusive) when removing a range of messages.
     * @return {Promise} promise resolved/rejected on operation completion.
     */
    remMessages: function(topicName, from, to) {
      if (!this.isReady()) {
        return disabled ?
          Promise.resolve() :
          Promise.reject(new Error("not initialized"));
      }
      return new Promise((resolve, reject) => {
        if (!from && !to) {
          from = 0;
          to = Number.MAX_SAFE_INTEGER;
        }
        const range = to > 0 ? IDBKeyRange.bound([topicName, from], [topicName, to], false, true) :
          IDBKeyRange.only([topicName, from]);
        const trx = db.transaction(['message'], 'readwrite');
        trx.onsuccess = (event) => {
          resolve(event.target.result);
        };
        trx.onerror = (event) => {
          logger("PCache", "remMessages", event.target.error);
          reject(event.target.error);
        };
        trx.objectStore('message').delete(range);
        trx.commit();
      });
    },

    /**
     * Retrieve messages from persistent store.
     * @memberOf DB
     * @param {string} topicName - name of the topic to retrieve messages from.
     * @param {function} callback to call for each retrieved message.
     * @param {Object} query - parameters of the message range to retrieve.
     * @param {number=} query.from - the least message ID to retrieve (inclusive).
     * @param {number=} query.to - the greatest message ID to retrieve (exclusive).
     * @param {number=} query.limit - the maximum number of messages to retrieve.
     * @return {Promise} promise resolved/rejected on operation completion.
     */
    readMessages: function(topicName, query, callback, context) {
      if (!this.isReady()) {
        return disabled ?
          Promise.resolve([]) :
          Promise.reject(new Error("not initialized"));
      }
      return new Promise((resolve, reject) => {
        query = query || {};
        const from = query.from > 0 ? query.from : 0;
        const to = query.to > 0 ? query.to : Number.MAX_SAFE_INTEGER;
        const limit = query.limit | 0;

        const result = [];
        const range = IDBKeyRange.bound([topicName, from], [topicName, to], false, true);
        const trx = db.transaction(['message']);
        trx.onerror = (event) => {
          logger("PCache", "readMessages", event.target.error);
          reject(event.target.error);
        };
        // Iterate in descending order.
        trx.objectStore('message').openCursor(range, 'prev').onsuccess = (event) => {
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
  };
}

if (typeof module != 'undefined') {
  module.exports = DB;
}

},{}],4:[function(require,module,exports){
/**
 * @copyright 2015-2021 Tinode
 * @summary Minimally rich text representation and formatting for Tinode.
 * @license Apache 2.0
 * @version 0.16
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

// NOTE TO DEVELOPERS:
// Localizable strings should be double quoted "строка на другом языке",
// non-localizable strings should be single quoted 'non-localized'.

const MAX_FORM_ELEMENTS = 8;
const JSON_MIME_TYPE = 'application/json';

// Regular expressions for parsing inline formats. Javascript does not support lookbehind,
// so it's a bit messy.
const INLINE_STYLES = [
  // Strong = bold, *bold text*
  {
    name: 'ST',
    start: /(?:^|[\W_])(\*)[^\s*]/,
    end: /[^\s*](\*)(?=$|[\W_])/
  },
  // Emphesized = italic, _italic text_
  {
    name: 'EM',
    start: /(?:^|\W)(_)[^\s_]/,
    end: /[^\s_](_)(?=$|\W)/
  },
  // Deleted, ~strike this though~
  {
    name: 'DL',
    start: /(?:^|[\W_])(~)[^\s~]/,
    end: /[^\s~](~)(?=$|[\W_])/
  },
  // Code block `this is monospace`
  {
    name: 'CO',
    start: /(?:^|\W)(`)[^`]/,
    end: /[^`](`)(?=$|\W)/
  }
];

// RegExps for entity extraction (RF = reference)
const ENTITY_TYPES = [
  // URLs
  {
    name: 'LN',
    dataName: 'url',
    pack: function(val) {
      // Check if the protocol is specified, if not use http
      if (!/^[a-z]+:\/\//i.test(val)) {
        val = 'http://' + val;
      }
      return {
        url: val
      };
    },
    re: /(?:(?:https?|ftp):\/\/|www\.|ftp\.)[-A-Z0-9+&@#\/%=~_|$?!:,.]*[A-Z0-9+&@#\/%=~_|$]/ig
  },
  // Mentions @user (must be 2 or more characters)
  {
    name: 'MN',
    dataName: 'val',
    pack: function(val) {
      return {
        val: val.slice(1)
      };
    },
    re: /\B@(\w\w+)/g
  },
  // Hashtags #hashtag, like metion 2 or more characters.
  {
    name: 'HT',
    dataName: 'val',
    pack: function(val) {
      return {
        val: val.slice(1)
      };
    },
    re: /\B#(\w\w+)/g
  }
];

// HTML tag name suggestions
const HTML_TAGS = {
  ST: {
    name: 'b',
    isVoid: false
  },
  EM: {
    name: 'i',
    isVoid: false
  },
  DL: {
    name: 'del',
    isVoid: false
  },
  CO: {
    name: 'tt',
    isVoid: false
  },
  BR: {
    name: 'br',
    isVoid: true
  },
  LN: {
    name: 'a',
    isVoid: false
  },
  MN: {
    name: 'a',
    isVoid: false
  },
  HT: {
    name: 'a',
    isVoid: false
  },
  IM: {
    name: 'img',
    isVoid: true
  },
  FM: {
    name: 'div',
    isVoid: false
  },
  RW: {
    name: 'div',
    isVoid: false,
  },
  BN: {
    name: 'button',
    isVoid: false
  },
  HD: {
    name: '',
    isVoid: false
  },
  HL: {
    name: 'span',
    isVoid: false
  }
};

// Convert base64-encoded string into Blob.
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

// Helpers for converting Drafty to HTML.
const DECORATORS = {
  // Visial styles
  ST: {
    open: function() {
      return '<b>';
    },
    close: function() {
      return '</b>';
    }
  },
  EM: {
    open: function() {
      return '<i>';
    },
    close: function() {
      return '</i>'
    }
  },
  DL: {
    open: function() {
      return '<del>';
    },
    close: function() {
      return '</del>'
    }
  },
  CO: {
    open: function() {
      return '<tt>';
    },
    close: function() {
      return '</tt>'
    }
  },
  // Line break
  BR: {
    open: function() {
      return '<br/>';
    },
    close: function() {
      return ''
    }
  },
  // Hidden element
  HD: {
    open: function() {
      return '';
    },
    close: function() {
      return '';
    }
  },
  // Highlighted element.
  HL: {
    open: function() {
      return '<span style="color:teal">';
    },
    close: function() {
      return '</span>';
    }
  },
  // Link (URL)
  LN: {
    open: function(data) {
      return '<a href="' + data.url + '">';
    },
    close: function(data) {
      return '</a>';
    },
    props: function(data) {
      return data ? {
        href: data.url,
        target: "_blank"
      } : null;
    },
  },
  // Mention
  MN: {
    open: function(data) {
      return '<a href="#' + data.val + '">';
    },
    close: function(data) {
      return '</a>';
    },
    props: function(data) {
      return data ? {
        name: data.val
      } : null;
    },
  },
  // Hashtag
  HT: {
    open: function(data) {
      return '<a href="#' + data.val + '">';
    },
    close: function(data) {
      return '</a>';
    },
    props: function(data) {
      return data ? {
        name: data.val
      } : null;
    },
  },
  // Button
  BN: {
    open: function(data) {
      return '<button>';
    },
    close: function(data) {
      return '</button>';
    },
    props: function(data) {
      return data ? {
        'data-act': data.act,
        'data-val': data.val,
        'data-name': data.name,
        'data-ref': data.ref
      } : null;
    },
  },
  // Image
  IM: {
    open: function(data) {
      // Don't use data.ref for preview: it's a security risk.
      const tmpPreviewUrl = base64toDataUrl(data._tempPreview, data.mime);
      const previewUrl = base64toObjectUrl(data.val, data.mime, Drafty.logger);
      const downloadUrl = data.ref || previewUrl;
      return (data.name ? '<a href="' + downloadUrl + '" download="' + data.name + '">' : '') +
        '<img src="' + (tmpPreviewUrl || previewUrl) + '"' +
        (data.width ? ' width="' + data.width + '"' : '') +
        (data.height ? ' height="' + data.height + '"' : '') + ' border="0" />';
    },
    close: function(data) {
      return (data.name ? '</a>' : '');
    },
    props: function(data) {
      if (!data) return null;
      return {
        // Temporary preview, or permanent preview, or external link.
        src: base64toDataUrl(data._tempPreview, data.mime) ||
          data.ref || base64toObjectUrl(data.val, data.mime, Drafty.logger),
        title: data.name,
        'data-width': data.width,
        'data-height': data.height,
        'data-name': data.name,
        'data-size': data.val ? ((data.val.length * 0.75) | 0) : (data.size | 0),
        'data-mime': data.mime
      };
    },
  },
  // Form - structured layout of elements.
  FM: {
    open: function(data) {
      return '<div>';
    },
    close: function(data) {
      return '</div>';
    }
  },
  // Row: logic grouping of elements
  RW: {
    open: function(data) {
      return '<div>';
    },
    close: function(data) {
      return '</div>';
    }
  }
};

/**
 * The main object which performs all the formatting actions.
 * @class Drafty
 * @constructor
 */
const Drafty = function() {}

// Take a string and defined earlier style spans, re-compose them into a tree where each leaf is
// a same-style (including unstyled) string. I.e. 'hello *bold _italic_* and ~more~ world' ->
// ('hello ', (b: 'bold ', (i: 'italic')), ' and ', (s: 'more'), ' world');
//
// This is needed in order to clear markup, i.e. 'hello *world*' -> 'hello world' and convert
// ranges from markup-ed offsets to plain text offsets.
function chunkify(line, start, end, spans) {
  const chunks = [];

  if (spans.length == 0) {
    return [];
  }

  for (let i in spans) {
    // Get the next chunk from the queue
    const span = spans[i];

    // Grab the initial unstyled chunk
    if (span.start > start) {
      chunks.push({
        text: line.slice(start, span.start)
      });
    }

    // Grab the styled chunk. It may include subchunks.
    const chunk = {
      type: span.type
    };
    const chld = chunkify(line, span.start + 1, span.end, span.children);
    if (chld.length > 0) {
      chunk.children = chld;
    } else {
      chunk.text = span.text;
    }
    chunks.push(chunk);
    start = span.end + 1; // '+1' is to skip the formatting character
  }

  // Grab the remaining unstyled chunk, after the last span
  if (start < end) {
    chunks.push({
      text: line.slice(start, end)
    });
  }

  return chunks;
}

// Inverse of chunkify. Returns a tree of formatted spans.
function forEach(line, start, end, spans, formatter, context) {
  const result = [];

  // Process ranges calling formatter for each range.
  for (let i = 0; i < spans.length; i++) {
    const span = spans[i];
    if (span.at < 0) {
      // Ask formatter if it wants to do anything with the non-visual span.
      const s = formatter.call(context, span.tp, span.data, undefined, result.length);
      if (s) {
        result.push(s);
      }
      continue;
    }
    // Add un-styled range before the styled span starts.
    if (start < span.at) {
      result.push(formatter.call(context, null, undefined, line.slice(start, span.at), result.length));
      start = span.at;
    }
    // Get all spans which are within current span.
    const subspans = [];
    for (let si = i + 1; si < spans.length && spans[si].at < span.at + span.len; si++) {
      subspans.push(spans[si]);
      i = si;
    }

    const tag = HTML_TAGS[span.tp] || {}
    result.push(formatter.call(context, span.tp, span.data,
      tag.isVoid ? null : forEach(line, start, span.at + span.len, subspans, formatter, context),
      result.length));

    start = span.at + span.len;
  }

  // Add the last unformatted range.
  if (start < end) {
    result.push(formatter.call(context, null, undefined, line.slice(start, end), result.length));
  }

  return result;
}

// Detect starts and ends of formatting spans. Unformatted spans are
// ignored at this stage.
function spannify(original, re_start, re_end, type) {
  const result = [];
  let index = 0;
  let line = original.slice(0); // make a copy;

  while (line.length > 0) {
    // match[0]; // match, like '*abc*'
    // match[1]; // match captured in parenthesis, like 'abc'
    // match['index']; // offset where the match started.

    // Find the opening token.
    const start = re_start.exec(line);
    if (start == null) {
      break;
    }

    // Because javascript RegExp does not support lookbehind, the actual offset may not point
    // at the markup character. Find it in the matched string.
    let start_offset = start['index'] + start[0].lastIndexOf(start[1]);
    // Clip the processed part of the string.
    line = line.slice(start_offset + 1);
    // start_offset is an offset within the clipped string. Convert to original index.
    start_offset += index;
    // Index now point to the beginning of 'line' within the 'original' string.
    index = start_offset + 1;

    // Find the matching closing token.
    const end = re_end ? re_end.exec(line) : null;
    if (end == null) {
      break;
    }
    let end_offset = end['index'] + end[0].indexOf(end[1]);
    // Clip the processed part of the string.
    line = line.slice(end_offset + 1);
    // Update offsets
    end_offset += index;
    // Index now point to the beginning of 'line' within the 'original' string.
    index = end_offset + 1;

    result.push({
      text: original.slice(start_offset + 1, end_offset),
      children: [],
      start: start_offset,
      end: end_offset,
      type: type
    });
  }

  return result;
}

// Convert linear array or spans into a tree representation.
// Keep standalone and nested spans, throw away partially overlapping spans.
function toTree(spans) {
  if (spans.length == 0) {
    return [];
  }

  const tree = [spans[0]];
  let last = spans[0];
  for (let i = 1; i < spans.length; i++) {
    // Keep spans which start after the end of the previous span or those which
    // are complete within the previous span.

    if (spans[i].start > last.end) {
      // Span is completely outside of the previous span.
      tree.push(spans[i]);
      last = spans[i];
    } else if (spans[i].end < last.end) {
      // Span is fully inside of the previous span. Push to subnode.
      last.children.push(spans[i]);
    }
    // Span could partially overlap, ignoring it as invalid.
  }

  // Recursively rearrange the subnodes.
  for (let i in tree) {
    tree[i].children = toTree(tree[i].children);
  }

  return tree;
}

// Get a list of entities from a text.
function extractEntities(line) {
  let match;
  let extracted = [];
  ENTITY_TYPES.map(function(entity) {
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

  // Remove entities detected inside other entities, like #hashtag in a URL.
  extracted.sort(function(a, b) {
    return a.offset - b.offset;
  });

  let idx = -1;
  extracted = extracted.filter(function(el) {
    const result = (el.offset > idx);
    idx = el.offset + el.len;
    return result;
  });

  return extracted;
}

// Convert the chunks into format suitable for serialization.
function draftify(chunks, startAt) {
  let plain = "";
  let ranges = [];
  for (let i in chunks) {
    const chunk = chunks[i];
    if (!chunk.text) {
      const drafty = draftify(chunk.children, plain.length + startAt);
      chunk.text = drafty.txt;
      ranges = ranges.concat(drafty.fmt);
    }

    if (chunk.type) {
      ranges.push({
        at: plain.length + startAt,
        len: chunk.text.length,
        tp: chunk.type
      });
    }

    plain += chunk.text;
  }
  return {
    txt: plain,
    fmt: ranges
  };
}

// Splice two strings: insert second string into the first one at the given index
function splice(src, at, insert) {
  return src.slice(0, at) + insert + src.slice(at);
}

/**
 * Parse plain text into Drafty document.
 * @memberof Drafty
 * @static
 *
 * @param {String} content - plain-text content to parse.
 * @return {Drafty} parsed document or null if the source is not plain text.
 */
Drafty.parse = function(content) {
  // Make sure we are parsing strings only.
  if (typeof content != 'string') {
    return null;
  }

  // Split text into lines. It makes further processing easier.
  const lines = content.split(/\r?\n/);

  // Holds entities referenced from text
  const entityMap = [];
  const entityIndex = {};

  // Processing lines one by one, hold intermediate result in blx.
  const blx = [];
  lines.map(function(line) {
    let spans = [];
    let entities;

    // Find formatted spans in the string.
    // Try to match each style.
    INLINE_STYLES.map(function(style) {
      // Each style could be matched multiple times.
      spans = spans.concat(spannify(line, style.start, style.end, style.name));
    });

    let block;
    if (spans.length == 0) {
      block = {
        txt: line
      };
    } else {
      // Sort spans by style occurence early -> late
      spans.sort(function(a, b) {
        return a.start - b.start;
      });

      // Convert an array of possibly overlapping spans into a tree
      spans = toTree(spans);

      // Build a tree representation of the entire string, not
      // just the formatted parts.
      const chunks = chunkify(line, 0, line.length, spans);

      const drafty = draftify(chunks, 0);

      block = {
        txt: drafty.txt,
        fmt: drafty.fmt
      };
    }

    // Extract entities from the cleaned up string.
    entities = extractEntities(block.txt);
    if (entities.length > 0) {
      const ranges = [];
      for (let i in entities) {
        // {offset: match['index'], unique: match[0], len: match[0].length, data: ent.packer(), type: ent.name}
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
    txt: ""
  };

  // Merge lines and save line breaks as BR inline formatting.
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

      result.txt += " " + block.txt;
      if (block.fmt) {
        result.fmt = result.fmt.concat(block.fmt.map(function(s) {
          s.at += offset;
          return s;
        }));
      }
      if (block.ent) {
        result.fmt = result.fmt.concat(block.ent.map(function(s) {
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
}

/**
 * Initialize Drafty document to a plain text string.
 *
 * @param {String} plainText - string to use as Drafty content.
 *
 * @returns new Drafty document or null is plainText is not a string.
 */
Drafty.init = function(plainText) {
  if (typeof plainText != 'string') {
    return null;
  }
  return {
    txt: plainText
  };
}

/**
 * Append one Drafty document to another.
 *
 * @param {Drafty} first - Drafty document to append to.
 * @param {Drafty} second - Drafty document being appended.
 *
 * @return {Drafty} first document with the second appended to it.
 */
Drafty.append = function(first, second) {
  if (first == null) {
    return second;
  }
  if (second == null) {
    return first;
  }

  first.txt = first.txt || '';
  second.txt = second.txt || '';
  const len = first.txt.length;

  first.txt += second.txt;
  if (Array.isArray(second.fmt)) {
    first.fmt = first.fmt || [];
    if (Array.isArray(second.ent)) {
      first.ent = first.ent || [];
    }
    second.fmt.forEach(src => {
      const fmt = {
        at: src.at + len,
        len: src.len
      };
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
}

/**
 * @typedef Drafty.ImageDesc
 * @memberof Drafty
 * @type Object
 * @param {string} mime - mime-type of the image, e.g. "image/png"
 * @param {string} preview - base64-encoded image content (or preview, if large image is attached). Could be null/undefined.
 * @param {integer} width - width of the image
 * @param {integer} height - height of the image
 * @param {string} filename - file name suggestion for downloading the image.
 * @param {integer} size - size of the image in bytes. Treat is as an untrusted hint.
 * @param {string} refurl - reference to the content. Could be null/undefined.
 * @param {string} _tempPreview - base64-encoded image preview used during upload process; not serializable.
 * @param {Promise} urlPromise - Promise which returns content URL when resolved.
 */

/**
 * Insert inline image into Drafty document.
 * @memberof Drafty
 * @static
 *
 * @param {Drafty} content - document to add image to.
 * @param {integer} at - index where the object is inserted. The length of the image is always 1.
 * @param {ImageDesc} imageDesc - object with image paramenets and data.
 *
 * @return {Drafty} updated document.
 */
Drafty.insertImage = function(content, at, imageDesc) {
  content = content || {
    txt: " "
  };
  content.ent = content.ent || [];
  content.fmt = content.fmt || [];

  content.fmt.push({
    at: at,
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
    imageDesc.urlPromise.then(
      (url) => {
        ex.data.ref = url;
        ex.data._tempPreview = undefined;
        ex.data._processing = undefined;
      },
      (err) => {
        /* catch the error, otherwise it will appear in the console. */
        ex.data._processing = undefined;
      }
    );
  }

  content.ent.push(ex);

  return content;
}

/**
 * Append inline image to Drafty document.
 * @memberof Drafty
 * @static
 *
 * @param {Drafty} content - document to add image to.
 * @param {ImageDesc} imageDesc - object with image paramenets.
 *
 * @return {Drafty} updated document.
 */
Drafty.appendImage = function(content, imageDesc) {
  content = content || {
    txt: ""
  };
  content.txt += " ";
  return Drafty.insertImage(content, content.txt.length - 1, imageDesc);
}

/**
 * @typedef Drafty.AttachmentDesc
 * @memberof Drafty
 * @type Object
 * @param {string} mime - mime-type of the image, e.g. "image/png"
 * @param {string} data - base64-encoded in-band content of small attachments. Could be null/undefined.
 * @param {string} filename - file name suggestion for downloading the attachment.
 * @param {integer} size - size of the file in bytes. Treat is as an untrusted hint.
 * @param {string} refurl - reference to the out-of-band content. Could be null/undefined.
 * @param {Promise} urlPromise - Promise which returns content URL when resolved.
 */

/**
 * Attach file to Drafty content. Either as a blob or as a reference.
 * @memberof Drafty
 * @static
 *
 * @param {Drafty} content - document to attach file to.
 * @param {AttachmentDesc} object - containing attachment description and data.
 *
 * @return {Drafty} updated document.
 */
Drafty.attachFile = function(content, attachmentDesc) {
  content = content || {
    txt: ""
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
  }
  if (attachmentDesc.urlPromise) {
    ex.data._processing = true;
    attachmentDesc.urlPromise.then(
      (url) => {
        ex.data.ref = url;
        ex.data._processing = undefined;
      },
      (err) => {
        /* catch the error, otherwise it will appear in the console. */
        ex.data._processing = undefined;
      }
    );
  }
  content.ent.push(ex);

  return content;
}

/**
 * Wraps content into an interactive form.
 * @memberof Drafty
 * @static
 *
 * @param {Drafty|string} content - to wrap into a form.
 * @param {number} at - index where the forms starts.
 * @param {number} len - length of the form content.
 *
 * @return {Drafty} updated document.
 */
Drafty.wrapAsForm = function(content, at, len) {
  if (typeof content == 'string') {
    content = {
      txt: content
    };
  }
  content.fmt = content.fmt || [];

  content.fmt.push({
    at: at,
    len: len,
    tp: 'FM'
  });

  return content;
}

/**
 * Insert clickable button into Drafty document.
 * @memberof Drafty
 * @static
 *
 * @param {Drafty|string} content - Drafty document to insert button to or a string to be used as button text.
 * @param {number} at - location where the button is inserted.
 * @param {number} len - the length of the text to be used as button title.
 * @param {string} name - the button. Client should return it to the server when the button is clicked.
 * @param {string} actionType - the type of the button, one of 'url' or 'pub'.
 * @param {string} actionValue - the value to return on click:
 * @param {string} refUrl - the URL to go to when the 'url' button is clicked.
 *
 * @return {Drafty} updated document.
 */
Drafty.insertButton = function(content, at, len, name, actionType, actionValue, refUrl) {
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
  // Ensure refUrl is a string.
  if (actionType == 'url' && !refUrl) {
    return null;
  }
  refUrl = '' + refUrl;

  content.ent = content.ent || [];
  content.fmt = content.fmt || [];

  content.fmt.push({
    at: at,
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
}

/**
 * Append clickable button to Drafty document.
 * @memberof Drafty
 * @static
 *
 * @param {Drafty|string} content - Drafty document to insert button to or a string to be used as button text.
 * @param {string} title - the text to be used as button title.
 * @param {string} name - the button. Client should return it to the server when the button is clicked.
 * @param {string} actionType - the type of the button, one of 'url' or 'pub'.
 * @param {string} actionValue - the value to return on click:
 * @param {string} refUrl - the URL to go to when the 'url' button is clicked.
 *
 * @return {Drafty} updated document.
 */
Drafty.appendButton = function(content, title, name, actionType, actionValue, refUrl) {
  content = content || {
    txt: ""
  };
  const at = content.txt.length;
  content.txt += title;
  return Drafty.insertButton(content, at, title.length, name, actionType, actionValue, refUrl);
}

/**
 * Attach a generic JS object. The object is attached as a json string.
 * Intended for representing a form response.
 *
 * @memberof Drafty
 * @static
 *
 * @param {Drafty} content - Drafty document to attach file to.
 * @param {Object} data - data to convert to json string and attach.
 * @returns {Drafty} the same document as <code>content</code>.
 */
Drafty.attachJSON = function(content, data) {
  content = content || {
    txt: ""
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
}
/**
 * Append line break to a Drafty document.
 * @memberof Drafty
 * @static
 *
 * @param {Drafty} content - Drafty document to append linebreak to.
 * @returns {Drafty} the same document as <code>content</code>.
 */
Drafty.appendLineBreak = function(content) {
  content = content || {
    txt: ""
  };
  content.fmt = content.fmt || [];
  content.fmt.push({
    at: content.txt.length,
    len: 1,
    tp: 'BR'
  });
  content.txt += " ";

  return content;
}
/**
 * Given Drafty document, convert it to HTML.
 * No attempt is made to strip pre-existing html markup.
 * This is potentially unsafe because <code>content.txt</code> may contain malicious
 * markup.
 * @memberof Tinode.Drafty
 * @static
 *
 * @param {Drafy} content - document to convert.
 *
 * @returns {string} HTML-representation of content.
 */
Drafty.UNSAFE_toHTML = function(content) {
  let {
    txt,
    fmt,
    ent
  } = content;

  const markup = [];
  if (fmt) {
    for (let i in fmt) {
      const range = fmt[i];
      const at = range.at | 0;
      let tp = range.tp;
      let data;
      if (!tp) {
        const entity = ent[range.key | 0];
        if (entity) {
          tp = entity.tp;
          data = entity.data;
        }
      }

      if (DECORATORS[tp]) {
        // Because we later sort in descending order, closing markup must come first.
        // Otherwise zero-length objects will not be represented correctly.
        markup.push({
          idx: at + range.len,
          len: -range.len,
          what: DECORATORS[tp].close(data)
        });
        markup.push({
          idx: at,
          len: range.len,
          what: DECORATORS[tp].open(data)
        });
      }
    }
  }

  markup.sort(function(a, b) {
    return b.idx == a.idx ? b.len - a.len : b.idx - a.idx; // in descending order
  });

  for (let i in markup) {
    if (markup[i].what) {
      txt = splice(txt, markup[i].idx, markup[i].what);
    }
  }

  return txt;
}

/**
 * Callback for applying custom formatting/transformation to a Drafty document.
 * Called once for each syle span.
 * @memberof Drafty
 * @static
 *
 * @callback Formatter
 * @param {string} style - style code such as "ST" or "IM".
 * @param {Object} data - entity's data
 * @param {Object} values - possibly styled subspans contained in this style span.
 * @param {number} index - of the current element among its siblings.
 */

/**
 * Transform Drafty document using custom formatting.
 * @memberof Drafty
 * @static
 *
 * @param {Drafty} content - content to transform.
 * @param {Formatter} formatter - callback which transforms individual elements
 * @param {Object} context - context provided to formatter as <code>this</code>.
 *
 * @return {Object} transformed object
 */
Drafty.format = function(content, formatter, context) {
  let {
    txt,
    fmt,
    ent
  } = content;

  // Assign default values.
  txt = txt || "";
  if (!Array.isArray(ent)) {
    ent = [];
  }

  if (!Array.isArray(fmt)) {
    // Handle special case when all values in fmt are 0 and fmt is skipped.
    if (ent.length == 1) {
      fmt = [{
        at: 0,
        len: 0,
        key: 0
      }];
    } else {
      return [txt];
    }
  }

  let spans = [].concat(fmt);

  // Zero values may have been stripped. Restore them.
  // Also ensure indexes and lengths are sane.
  spans.map(function(s) {
    s.at = s.at || 0;
    s.len = s.len || 0;
    if (s.len < 0) {
      s.len = 0;
    }
    if (s.at < -1) {
      s.at = -1;
    }
  });

  // Sort spans first by start index (asc) then by length (desc).
  spans.sort(function(a, b) {
    if (a.at - b.at == 0) {
      return b.len - a.len; // longer one comes first (<0)
    }
    return a.at - b.at;
  });

  // Denormalize entities into spans. Create a copy of the objects to leave
  // original Drafty object unchanged.
  spans = spans.map((s) => {
    let data;
    let tp = s.tp;
    if (!tp) {
      s.key = s.key || 0;
      if (ent[s.key]) {
        data = ent[s.key].data;
        tp = ent[s.key].tp;
      }
    }

    // Type still not defined? Hide invalid element.
    tp = tp || 'HD';

    return {
      tp: tp,
      data: data,
      at: s.at,
      len: s.len
    };
  });

  return forEach(txt, 0, txt.length, spans, formatter, context);
}

/**
 * Given Drafty document, convert it to plain text.
 * @memberof Drafty
 * @static
 *
 * @param {Drafty} content - document to convert to plain text.
 * @returns {string} plain-text representation of the drafty document.
 */
Drafty.toPlainText = function(content) {
  return typeof content == 'string' ? content : content.txt;
}

/**
 * Check if the document has no markup and no entities.
 * @memberof Drafty
 * @static
 *
 * @param {Drafty} content - content to check for presence of markup.
 * @returns <code>true</code> is content is plain text, <code>false</code> otherwise.
 */
Drafty.isPlainText = function(content) {
  return typeof content == 'string' || !(content.fmt || content.ent);
}

/**
 * Checks if the object represets is a valid Drafty document.
 * @memberof Drafty
 * @static
 *
 * @param {Drafty} content - content to check for validity.
 * @returns <code>true</code> is content is valid, <code>false</code> otherwise.
 */
Drafty.isValid = function(content) {
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
}

/**
 * Check if the drafty document has attachments.
 * @memberof Drafty
 * @static
 *
 * @param {Drafty} content - document to check for attachments.
 * @returns <code>true</code> if there are attachments.
 */
Drafty.hasAttachments = function(content) {
  if (content.ent && content.ent.length > 0) {
    for (let i in content.ent) {
      if (content.ent[i] && content.ent[i].tp == 'EX') {
        return true;
      }
    }
  }
  return false;
}

/**
 * Callback for applying custom formatting/transformation to a Drafty document.
 * Called once for each syle span.
 * @memberof Drafty
 * @static
 *
 * @callback AttachmentCallback
 * @param {Object} data attachment data
 * @param {number} index attachment's index in `content.ent`.
 */

/**
 * Enumerate attachments.
 * @memberof Drafty
 * @static
 *
 * @param {Drafty} content - document to process for attachments.
 * @param {AttachmentCallback} callback - callback to call for each attachment.
 * @param {Object} context - value of "this" for callback.
 */
Drafty.attachments = function(content, callback, context) {
  if (content.ent && content.ent.length > 0) {
    for (let i in content.ent) {
      if (content.ent[i] && content.ent[i].tp == 'EX') {
        callback.call(context, content.ent[i].data, i);
      }
    }
  }
}

/**
 * Given the entity, get URL which can be used for downloading
 * entity data.
 * @memberof Drafty
 * @static
 *
 * @param {Object} entData - entity.data to get the URl from.
 * @returns {string} URL to download entity data or <code>null</code>.
 */
Drafty.getDownloadUrl = function(entData) {
  let url = null;
  if (entData.mime != JSON_MIME_TYPE && entData.val) {
    url = base64toObjectUrl(entData.val, entData.mime, Drafty.logger);
  } else if (typeof entData.ref == 'string') {
    url = entData.ref;
  }
  return url;
}

/**
 * Check if the entity data is not ready for sending, such as being uploaded to the server.
 * @memberof Drafty
 * @static
 *
 * @param {Object} entity.data to get the URl from.
 * @returns {boolean} true if upload is in progress, false otherwise.
 */
Drafty.isProcessing = function(entData) {
  return !!entData._processing;
}

/**
 * Given the entity, get URL which can be used for previewing
 * the entity.
 * @memberof Drafty
 * @static
 *
 * @param {Object} entity.data to get the URl from.
 *
 * @returns {string} url for previewing or null if no such url is available.
 */
Drafty.getPreviewUrl = function(entData) {
  return entData.val ? base64toObjectUrl(entData.val, entData.mime, Drafty.logger) : null;
}

/**
 * Get approximate size of the entity.
 * @memberof Drafty
 * @static
 *
 * @param {Object} entData - entity.data to get the size for.
 * @returns {number} size of entity data in bytes.
 */
Drafty.getEntitySize = function(entData) {
  // Either size hint or length of value. The value is base64 encoded,
  // the actual object size is smaller than the encoded length.
  return entData.size ? entData.size : entData.val ? (entData.val.length * 0.75) | 0 : 0;
}

/**
 * Get entity mime type.
 * @memberof Drafty
 * @static
 *
 * @param {Object} entData - entity.data to get the type for.
 * @returns {string} mime type of entity.
 */
Drafty.getEntityMimeType = function(entData) {
  return entData.mime || 'text/plain';
}

/**
 * Get HTML tag for a given two-letter style name.
 * @memberof Drafty
 * @static
 *
 * @param {string} style - two-letter style, like ST or LN.
 *
 * @returns {string} HTML tag name if style is found, '_UNKN' if not found, {code: undefined} if style is falsish.
 */
Drafty.tagName = function(style) {
  return style ? (HTML_TAGS[style] ? HTML_TAGS[style].name : '_UNKN') : undefined;
}

/**
 * For a given data bundle generate an object with HTML attributes,
 * for instance, given {url: "http://www.example.com/"} return
 * {href: "http://www.example.com/"}
 * @memberof Drafty
 * @static
 *
 * @param {string} style - two-letter style to generate attributes for.
 * @param {Object} data - data bundle to convert to attributes
 *
 * @returns {Object} object with HTML attributes.
 */
Drafty.attrValue = function(style, data) {
  if (data && DECORATORS[style]) {
    return DECORATORS[style].props(data);
  }

  return undefined;
}

/**
 * Drafty MIME type.
 * @memberof Drafty
 * @static
 *
 * @returns {string} HTTP Content-Type "text/x-drafty".
 */
Drafty.getContentType = function() {
  return 'text/x-drafty';
}

/**
 * Shorten Drafty document and strip all entity data leaving just inline styles and entity references.
 * @memberof Drafty
 * @static
 *
 * @param {Drafty} original - Drafty object to shorten.
 * @param {number} length - length in characters to shorten to.
 * @returns new shortened Drafty object leaving the original intact.
 */
Drafty.preview = function(original, length) {
  if (!original || length <= 0 || typeof original != 'object') {
    return null;
  }

  const {
    txt,
    fmt,
    ent
  } = original;

  const preview = {
    txt: ''
  };
  let len = 0;
  if (typeof txt == 'string') {
    if (txt.length > length) {
      preview.txt = txt.substr(0, length);
    } else {
      preview.txt = txt;
    }
    len = preview.txt.length;
  }

  if (Array.isArray(fmt) && fmt.length > 0) {
    // Old key to new key entity mapping.
    const ent_refs = [];
    // Count styles which start within the new length of the text and save entity keys as a set.
    let fmt_count = 0;
    let ent_count = 0;
    fmt.forEach((st) => {
      if (st.at < len) {
        fmt_count++;
        if (!st.tp) {
          const key = st.key | 0;
          if (!ent_refs[key]) {
            ent_refs[key] = ent_count;
            ent_count++;
          }
        }
      }
    });

    if (fmt_count == 0) {
      return preview;
    }

    // Allocate space for copying styles and entities.
    preview.fmt = [];
    if (Array.isArray(ent) && ent_refs.length > 0) {
      preview.ent = [];
    }

    // Insertion point for styles.
    let fmt_idx = 0;
    fmt.forEach((st) => {
      if (st.at < len) {
        const style = {
          at: st.at,
          len: st.len
        };
        const key = st.key | 0;
        if (st.tp) {
          style.tp = '' + st.tp;
        } else if (Array.isArray(ent) && ent.length > key && typeof ent_refs[key] == 'number') {
          style.key = ent_refs[key];
          preview.ent[style.key] = copyLight(ent[key]);
        } else {
          return;
        }
        preview.fmt[fmt_idx++] = style;
      }
    });
  }

  return preview;
}

// Create a copy of an entity without large data.
function copyLight(ent) {
  let result = {
    tp: ent.tp
  };
  if (ent.data && Object.entries(ent.data).length != 0) {
    const dc = {};
    ["mime", "name", "width", "height", "size"].forEach((key) => {
      const val = ent.data[key];
      if (val) {
        dc[key] = val;
      }
    });
    if (Object.entries(dc).length != 0) {
      result.data = dc;
    }
  }
  return result;
}

if (typeof module != 'undefined') {
  module.exports = Drafty;
}

},{}],5:[function(require,module,exports){
(function (global){(function (){
/**
 * @file SDK to connect to Tinode chat server.
 * See <a href="https://github.com/tinode/webapp">
 * https://github.com/tinode/webapp</a> for real-life usage.
 *
 * @copyright 2015-2021 Tinode
 * @summary Javascript bindings for Tinode.
 * @license Apache 2.0
 * @version 0.17
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
 *  const tinode = new Tinode(APP_NAME, HOST, API_KEY, null, true);
 *  tinode.enableLogging(true);
 *  // Add logic to handle disconnects.
 *  tinode.onDisconnect = function(err) { ... };
 *  // Connect to the server.
 *  tinode.connect().then(() => {
 *    // Connected. Login now.
 *    return tinode.loginBasic(login, password);
 *  }).then((ctrl) => {
 *    // Logged in fine, attach callbacks, subscribe to 'me'.
 *    const me = tinode.getMeTopic();
 *    me.onMetaDesc = function(meta) { ... };
 *    // Subscribe, fetch topic description and the list of contacts.
 *    me.subscribe({get: {desc: {}, sub: {}});
 *  }).catch((err) => {
 *    // Login or subscription failed, do something.
 *    ...
 *  });
 *  ...
 * </script>
 * </body>
 */
'use strict';

// NOTE TO DEVELOPERS:
// Localizable strings should be double quoted "строка на другом языке",
// non-localizable strings should be single quoted 'non-localized'.

// Module imports Node.js style.
if (typeof require != 'function') {
  throw new Error("Unable to load modules: require() is not available.");
}

const CBuffer = require('./cbuffer.js');
const Connection = require('./connection.js');
const DBCache = require('./db.js');
const Drafty = require('./drafty.js');

const package_version = require('../version.json').version;

let WebSocketProvider;
if (typeof WebSocket != 'undefined') {
  WebSocketProvider = WebSocket;
}

let XHRProvider;
if (typeof XMLHttpRequest != 'undefined') {
  XHRProvider = XMLHttpRequest;
}

initForNonBrowserApp();

// Global constants
const PROTOCOL_VERSION = '0'; // Major component of the version, e.g. '0' in '0.17.1'.
const VERSION = package_version || '0.17';
const LIBRARY = 'tinodejs/' + VERSION;

const TOPIC_NEW = 'new';
const TOPIC_NEW_CHAN = 'nch';
const TOPIC_ME = 'me';
const TOPIC_FND = 'fnd';
const TOPIC_SYS = 'sys';
const TOPIC_CHAN = 'chn';
const USER_NEW = 'new';

// Starting value of a locally-generated seqId used for pending messages.
const LOCAL_SEQID = 0xFFFFFFF;

const MESSAGE_STATUS_NONE = 0; // Status not assigned.
const MESSAGE_STATUS_QUEUED = 1; // Local ID assigned, in progress to be sent.
const MESSAGE_STATUS_SENDING = 2; // Transmission started.
const MESSAGE_STATUS_FAILED = 3; // At least one attempt was made to send the message.
const MESSAGE_STATUS_SENT = 4; // Delivered to the server.
const MESSAGE_STATUS_RECEIVED = 5; // Received by the client.
const MESSAGE_STATUS_READ = 6; // Read by the user.
const MESSAGE_STATUS_TO_ME = 7; // Message from another user.

// Reject unresolved futures after this many milliseconds.
const EXPIRE_PROMISES_TIMEOUT = 5000;
// Periodicity of garbage collection of unresolved futures.
const EXPIRE_PROMISES_PERIOD = 1000;

// Default number of messages to pull into memory from persistent cache.
const DEFAULT_MESSAGES_PAGE = 24;

// Utility functions

// Polyfill for non-browser context, e.g. NodeJs.
function initForNonBrowserApp() {
  // Tinode requirement in native mode because react native doesn't provide Base64 method
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  if (typeof btoa == 'undefined') {
    global.btoa = function(input = '') {
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
    global.atob = function(input = '') {
      let str = input.replace(/=+$/, '');
      let output = '';

      if (str.length % 4 == 1) {
        throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
      }
      for (let bc = 0, bs = 0, buffer, i = 0; buffer = str.charAt(i++);

        ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
          bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
      ) {
        buffer = chars.indexOf(buffer);
      }

      return output;
    };
  }

  if (typeof window == 'undefined') {
    global.window = {
      WebSocket: WebSocketProvider,
      XMLHttpRequest: XHRProvider,
      URL: {
        createObjectURL: function() {
          throw new Error("Unable to use URL.createObjectURL in a non-browser application");
        }
      }
    }
  }

  Connection.setNetworkProviders(WebSocketProvider, XHRProvider);
}

// RFC3339 formater of Date
function rfc3339DateString(d) {
  if (!d || d.getTime() == 0) {
    return undefined;
  }

  function pad(val, sp) {
    sp = sp || 2;
    return '0'.repeat(sp - ('' + val).length) + val;
  }

  const millis = d.getUTCMilliseconds();
  return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()) +
    'T' + pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + ':' + pad(d.getUTCSeconds()) +
    (millis ? '.' + pad(millis, 3) : '') + 'Z';
}

// btoa replacement. Stock btoa fails on on non-Latin1 strings.
function b64EncodeUnicode(str) {
  // The encodeURIComponent percent-encodes UTF-8 string,
  // then the percent encoding is converted into raw bytes which
  // can be fed into btoa.
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
    function toSolidBytes(match, p1) {
      return String.fromCharCode('0x' + p1);
    }));
}

// Recursively merge src's own properties to dst.
// Ignore properties where ignore[property] is true.
// Array and Date objects are shallow-copied.
function mergeObj(dst, src, ignore) {
  if (typeof src != 'object') {
    if (src === Tinode.DEL_CHAR) {
      return undefined;
    }
    if (src === undefined) {
      return dst;
    }
    return src;
  }
  // JS is crazy: typeof null is 'object'.
  if (src === null) {
    return src;
  }

  // Handle Date
  if (src instanceof Date) {
    return (!dst || !(dst instanceof Date) || dst < src) ? src : dst;
  }

  // Access mode
  if (src instanceof AccessMode) {
    return new AccessMode(src);
  }

  // Handle Array
  if (src instanceof Array) {
    return src;
  }

  if (!dst || dst === Tinode.DEL_CHAR) {
    dst = src.constructor();
  }

  for (let prop in src) {
    if (src.hasOwnProperty(prop) &&
      (!ignore || !ignore[prop]) &&
      (prop != '_noForwarding')) {

      dst[prop] = mergeObj(dst[prop], src[prop]);
    }
  }
  return dst;
}

// Update object stored in a cache. Returns updated value.
function mergeToCache(cache, key, newval, ignore) {
  cache[key] = mergeObj(cache[key], newval, ignore);
  return cache[key];
}

function stringToDate(obj) {
  if (typeof obj.created == 'string') {
    obj.created = new Date(obj.created);
  }
  if (typeof obj.updated == 'string') {
    obj.updated = new Date(obj.updated);
  }
  if (typeof obj.touched == 'string') {
    obj.touched = new Date(obj.touched);
  }
}

// JSON stringify helper - pre-processor for JSON.stringify
function jsonBuildHelper(key, val) {
  if (val instanceof Date) {
    // Convert javascript Date objects to rfc3339 strings
    val = rfc3339DateString(val);
  } else if (val instanceof AccessMode) {
    val = val.jsonHelper();
  } else if (val === undefined || val === null || val === false ||
    (Array.isArray(val) && val.length == 0) ||
    ((typeof val == 'object') && (Object.keys(val).length == 0))) {
    // strip out empty elements while serializing objects to JSON
    return undefined;
  }

  return val;
};

// Strips all values from an object of they evaluate to false or if their name starts with '_'.
function simplify(obj) {
  Object.keys(obj).forEach(function(key) {
    if (key[0] == '_') {
      // Strip fields like "obj._key".
      delete obj[key];
    } else if (!obj[key]) {
      // Strip fields which evaluate to false.
      delete obj[key];
    } else if (Array.isArray(obj[key]) && obj[key].length == 0) {
      // Strip empty arrays.
      delete obj[key];
    } else if (!obj[key]) {
      // Strip fields which evaluate to false.
      delete obj[key];
    } else if (typeof obj[key] == 'object' && !(obj[key] instanceof Date)) {
      simplify(obj[key]);
      // Strip empty objects.
      if (Object.getOwnPropertyNames(obj[key]).length == 0) {
        delete obj[key];
      }
    }
  });
  return obj;
};

// Trim whitespace, strip empty and duplicate elements elements.
// If the result is an empty array, add a single element "\u2421" (Unicode Del character).
function normalizeArray(arr) {
  let out = [];
  if (Array.isArray(arr)) {
    // Trim, throw away very short and empty tags.
    for (let i = 0, l = arr.length; i < l; i++) {
      let t = arr[i];
      if (t) {
        t = t.trim().toLowerCase();
        if (t.length > 1) {
          out.push(t);
        }
      }
    }
    out.sort().filter(function(item, pos, ary) {
      return !pos || item != ary[pos - 1];
    });
  }
  if (out.length == 0) {
    // Add single tag with a Unicode Del character, otherwise an ampty array
    // is ambiguos. The Del tag will be stripped by the server.
    out.push(Tinode.DEL_CHAR);
  }
  return out;
}

// Attempt to convert date strings to objects.
function jsonParseHelper(key, val) {
  // Convert string timestamps with optional milliseconds to Date
  // 2015-09-02T01:45:43[.123]Z
  if (key === 'ts' && typeof val === 'string' &&
    val.length >= 20 && val.length <= 24) {
    let date = new Date(val);
    if (date) {
      return date;
    }
  } else if (key === 'acs' && typeof val === 'object') {
    return new AccessMode(val);
  }
  return val;
};

// Trims very long strings (encoded images) to make logged packets more readable.
function jsonLoggerHelper(key, val) {
  if (typeof val == 'string' && val.length > 128) {
    return '<' + val.length + ', bytes: ' + val.substring(0, 12) + '...' + val.substring(val.length - 12) + '>';
  }
  return jsonBuildHelper(key, val);
};

// Parse browser user agent to extract browser name and version.
function getBrowserInfo(ua, product) {
  ua = ua || '';
  let reactnative = '';
  // Check if this is a ReactNative app.
  if (/reactnative/i.test(product)) {
    reactnative = 'ReactNative; ';
  }
  // Then test for WebKit based browser.
  ua = ua.replace(' (KHTML, like Gecko)', '');
  let m = ua.match(/(AppleWebKit\/[.\d]+)/i);
  let result;
  if (m) {
    // List of common strings, from more useful to less useful.
    let priority = ['chrome', 'safari', 'mobile', 'version'];
    let tmp = ua.substr(m.index + m[0].length).split(' ');
    let tokens = [];
    // Split Name/0.0.0 into Name and version 0.0.0
    for (let i = 0; i < tmp.length; i++) {
      let m2 = /([\w.]+)[\/]([\.\d]+)/.exec(tmp[i]);
      if (m2) {
        tokens.push([m2[1], m2[2], priority.findIndex(function(e) {
          return (e == m2[1].toLowerCase());
        })]);
      }
    }
    // Sort by priority: more interesting is earlier than less interesting.
    tokens.sort(function(a, b) {
      let diff = a[2] - b[2];
      return diff != 0 ? diff : b[0].length - a[0].length;
    });
    if (tokens.length > 0) {
      // Return the least common browser string and version.
      result = tokens[0][0] + '/' + tokens[0][1];
    } else {
      // Failed to ID the browser. Return the webkit version.
      result = m[1];
    }
    // Test for MSIE.
  } else if (/trident/i.test(ua)) {
    m = /(?:\brv[ :]+([.\d]+))|(?:\bMSIE ([.\d]+))/g.exec(ua);
    if (m) {
      result = 'MSIE/' + (m[1] || m[2]);
    } else {
      result = 'MSIE/?';
    }
    // Test for Firefox.
  } else if (/firefox/i.test(ua)) {
    m = /Firefox\/([.\d]+)/g.exec(ua);
    if (m) {
      result = 'Firefox/' + m[1];
    } else {
      result = 'Firefox/?';
    }
    // Older Opera.
  } else if (/presto/i.test(ua)) {
    m = /Opera\/([.\d]+)/g.exec(ua);
    if (m) {
      result = 'Opera/' + m[1];
    } else {
      result = 'Opera/?';
    }
  } else {
    // Failed to parse anything meaningfull. Try the last resort.
    m = /([\w.]+)\/([.\d]+)/.exec(ua);
    if (m) {
      result = m[1] + '/' + m[2];
    } else {
      m = ua.split(' ');
      result = m[0];
    }
  }

  // Shorten the version to one dot 'a.bb.ccc.d -> a.bb' at most.
  m = result.split('/');
  if (m.length > 1) {
    let v = m[1].split('.');
    result = m[0] + '/' + v[0] + (v[1] ? '.' + v[1] : '');
  }
  return reactnative + result;
}

/**
 * @class Tinode
 *
 * @param {Object} config - configuration parameters.
 * @param {string} config.appName - Name of the calling application to be reported in the User Agent.
 * @param {string} config.host - Host name and port number to connect to.
 * @param {string} config.apiKey - API key generated by <code>keygen</code>.
 * @param {string} config.transport - See {@link Tinode.Connection#transport}.
 * @param {boolean} config.secure - Use Secure WebSocket if <code>true</code>.
 * @param {string} config.platform - Optional platform identifier, one of <code>"ios"</code>, <code>"web"</code>, <code>"android"</code>.
 * @param {boolen} config.persist - use indexDB persistent storage.
 * @param {function} onComplete - callback to call when initialization is completed.
 */
var Tinode = function(config, onComplete) {
  // Client-provided application name, format <Name>/<version number>
  this._appName = config.appName || "Undefined";

  // API Key.
  this._apiKey = config.apiKey;

  // Name and version of the browser.
  this._browser = '';
  this._platform = config.platform || 'web';
  this._hwos = 'undefined';
  this._humanLanguage = 'xx';
  // Underlying OS.
  if (typeof navigator != 'undefined') {
    this._browser = getBrowserInfo(navigator.userAgent, navigator.product);
    this._hwos = navigator.platform;
    // This is the default language. It could be changed by client.
    this._humanLanguage = navigator.language || 'en-US';
  }
  // Logging to console enabled
  this._loggingEnabled = false;
  // When logging, trip long strings (base64-encoded images) for readability
  this._trimLongStrings = false;
  // UID of the currently authenticated user.
  this._myUID = null;
  // Status of connection: authenticated or not.
  this._authenticated = false;
  // Login used in the last successful basic authentication
  this._login = null;
  // Token which can be used for login instead of login/password.
  this._authToken = null;
  // Counter of received packets
  this._inPacketCount = 0;
  // Counter for generating unique message IDs
  this._messageId = Math.floor((Math.random() * 0xFFFF) + 0xFFFF);
  // Information about the server, if connected
  this._serverInfo = null;
  // Push notification token. Called deviceToken for consistency with the Android SDK.
  this._deviceToken = null;

  // Cache of pending promises by message id.
  this._pendingPromises = {};

  // The Timeout object returned by the reject expired promises setInterval.
  this._expirePromises = null;

  /** A connection object, see {@link Tinode.Connection}. */
  this._connection = new Connection(config.host, PROTOCOL_VERSION, config.apiKey, config.transport, config.secure, true);
  // Console logger. Babel somehow fails to parse '...rest' parameter.
  this.logger = (str, ...args) => {
    if (this._loggingEnabled) {
      const d = new Date()
      const dateString = ('0' + d.getUTCHours()).slice(-2) + ':' +
        ('0' + d.getUTCMinutes()).slice(-2) + ':' +
        ('0' + d.getUTCSeconds()).slice(-2) + '.' +
        ('00' + d.getUTCMilliseconds()).slice(-3);

      console.log('[' + dateString + ']', str, args.join(' '));
    }
  }
  this._connection.logger = this.logger;
  Drafty.logger = this.logger;

  // Timestamp of the most recent update to topics in cache.
  this._lastTopicUpdate = null;

  // Tinode's cache of objects
  this._cache = {};

  const cachePut = this.cachePut = (type, name, obj) => {
    this._cache[type + ':' + name] = obj;
  }

  const cacheGet = this.cacheGet = (type, name) => {
    return this._cache[type + ':' + name];
  }

  const cacheDel = this.cacheDel = (type, name) => {
    delete this._cache[type + ':' + name];
  }
  // Enumerate all items in cache, call func for each item.
  // Enumeration stops if func returns true.
  const cacheMap = this.cacheMap = (type, func, context) => {
    const key = type ? type + ':' : undefined;
    for (let idx in this._cache) {
      if (!key || idx.indexOf(key) == 0) {
        if (func.call(context, this._cache[idx], idx)) {
          break;
        }
      }
    }
  }

  // Make limited cache management available to topic.
  // Caching user.public only. Everything else is per-topic.
  this.attachCacheToTopic = (topic) => {
    topic._tinode = this;

    topic._cacheGetUser = (uid) => {
      const pub = cacheGet('user', uid);
      if (pub) {
        return {
          user: uid,
          public: mergeObj({}, pub)
        };
      }
      return undefined;
    };
    topic._cachePutUser = (uid, user) => {
      return cachePut('user', uid, mergeObj({}, user.public));
    };
    topic._cacheDelUser = (uid) => {
      return cacheDel('user', uid);
    };
    topic._cachePutSelf = () => {
      if (topic.updated && topic.updated > this._lastTopicUpdate) {
        this._lastTopicUpdate = topic.updated;
      }
      return cachePut('topic', topic.name, topic);
    }
    topic._cacheDelSelf = () => {
      return cacheDel('topic', topic.name);
    }
  }

  // Use indexDB for caching topics and messages.
  this._persist = config.persist;
  // Initialize object regardless. It simplifies the code.
  this._db = DBCache((err) => {
    this.logger("DB", err);
  }, this.logger);

  if (this._persist) {
    // Create the persistent cache and read topics into memory.
    this._db.initDatabase().then(() => {
      // Store promises to be resolved when messages load into memory.
      const msgs = [];
      // Load topics to memory.
      return this._db.mapTopics((data) => {
        let topic = this.cacheGet('topic', data.name);
        if (topic) {
          return;
        }
        if (data.name == TOPIC_ME) {
          topic = new TopicMe();
        } else if (data.name == TOPIC_FND) {
          topic = new TopicFnd();
        } else {
          topic = new Topic(data.name);
        }

        this._db.deserializeTopic(topic, data);
        this.attachCacheToTopic(topic);
        topic._cachePutSelf();
        // Request to load messages and save the promise.
        msgs.push(topic._loadMessages(this._db));
      }).then(() => {
        // Wait for all messages to load.
        return Promise.all(msgs);
      }).then(() => {
        if (onComplete) {
          onComplete();
        }
        this.logger("Persistent cache initialized.");
      });
    });
  } else {
    this._db.disable();
    if (onComplete) {
      onComplete();
    }
  }

  // Resolve or reject a pending promise.
  // Unresolved promises are stored in _pendingPromises.
  const execPromise = (id, code, onOK, errorText) => {
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

  // Generator of default promises for sent packets.
  const makePromise = (id) => {
    let promise = null;
    if (id) {
      promise = new Promise((resolve, reject) => {
        // Stored callbacks will be called when the response packet with this Id arrives
        this._pendingPromises[id] = {
          'resolve': resolve,
          'reject': reject,
          'ts': new Date()
        };
      })
    }
    return promise;
  }

  // Generates unique message IDs
  const getNextUniqueId = this.getNextUniqueId = () => {
    return (this._messageId != 0) ? '' + this._messageId++ : undefined;
  }

  // Get User Agent string
  const getUserAgent = () => {
    return this._appName + ' (' + (this._browser ? this._browser + '; ' : '') + this._hwos + '); ' + LIBRARY;
  }

  // Generator of packets stubs
  this.initPacket = (type, topic) => {
    switch (type) {
      case 'hi':
        return {
          'hi': {
            'id': getNextUniqueId(),
            'ver': VERSION,
            'ua': getUserAgent(),
            'dev': this._deviceToken,
            'lang': this._humanLanguage,
            'platf': this._platform
          }
        };

      case 'acc':
        return {
          'acc': {
            'id': getNextUniqueId(),
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
            'id': getNextUniqueId(),
            'scheme': null,
            'secret': null
          }
        };

      case 'sub':
        return {
          'sub': {
            'id': getNextUniqueId(),
            'topic': topic,
            'set': {},
            'get': {}
          }
        };

      case 'leave':
        return {
          'leave': {
            'id': getNextUniqueId(),
            'topic': topic,
            'unsub': false
          }
        };

      case 'pub':
        return {
          'pub': {
            'id': getNextUniqueId(),
            'topic': topic,
            'noecho': false,
            'head': null,
            'content': {}
          }
        };

      case 'get':
        return {
          'get': {
            'id': getNextUniqueId(),
            'topic': topic,
            'what': null, // data, sub, desc, space separated list; unknown strings are ignored
            'desc': {},
            'sub': {},
            'data': {}
          }
        };

      case 'set':
        return {
          'set': {
            'id': getNextUniqueId(),
            'topic': topic,
            'desc': {},
            'sub': {},
            'tags': []
          }
        };

      case 'del':
        return {
          'del': {
            'id': getNextUniqueId(),
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
            // no id by design
            'topic': topic,
            'what': null, // one of "recv", "read", "kp"
            'seq': undefined // the server-side message id aknowledged as received or read
          }
        };

      default:
        throw new Error(`Unknown packet type requested: ${type}`);
    }
  }

  // Send a packet. If packet id is provided return a promise.
  this.send = (pkt, id) => {
    let promise;
    if (id) {
      promise = makePromise(id);
    }
    pkt = simplify(pkt);
    let msg = JSON.stringify(pkt);
    this.logger("out: " + (this._trimLongStrings ? JSON.stringify(pkt, jsonLoggerHelper) : msg));
    try {
      this._connection.sendText(msg);
    } catch (err) {
      // If sendText throws, wrap the error in a promise or rethrow.
      if (id) {
        execPromise(id, Connection.NETWORK_ERROR, null, err.message);
      } else {
        throw err;
      }
    }
    return promise;
  }

  // On successful login save server-provided data.
  this.loginSuccessful = (ctrl) => {
    if (!ctrl.params || !ctrl.params.user) {
      return ctrl;
    }
    // This is a response to a successful login,
    // extract UID and security token, save it in Tinode module
    this._myUID = ctrl.params.user;
    this._authenticated = (ctrl && ctrl.code >= 200 && ctrl.code < 300);
    if (ctrl.params && ctrl.params.token && ctrl.params.expires) {
      this._authToken = {
        token: ctrl.params.token,
        expires: new Date(ctrl.params.expires)
      };
    } else {
      this._authToken = null;
    }

    if (this.onLogin) {
      this.onLogin(ctrl.code, ctrl.text);
    }

    return ctrl;
  }

  // The main message dispatcher.
  this._connection.onMessage = (data) => {
    // Skip empty response. This happens when LP times out.
    if (!data) return;

    this._inPacketCount++;

    // Send raw message to listener
    if (this.onRawMessage) {
      this.onRawMessage(data);
    }

    if (data === '0') {
      // Server response to a network probe.
      if (this.onNetworkProbe) {
        this.onNetworkProbe();
      }
      // No processing is necessary.
      return;
    }

    let pkt = JSON.parse(data, jsonParseHelper);
    if (!pkt) {
      this.logger("in: " + data);
      this.logger("ERROR: failed to parse data");
    } else {
      this.logger("in: " + (this._trimLongStrings ? JSON.stringify(pkt, jsonLoggerHelper) : data));

      // Send complete packet to listener
      if (this.onMessage) {
        this.onMessage(pkt);
      }

      if (pkt.ctrl) {
        // Handling {ctrl} message
        if (this.onCtrlMessage) {
          this.onCtrlMessage(pkt.ctrl);
        }

        // Resolve or reject a pending promise, if any
        if (pkt.ctrl.id) {
          execPromise(pkt.ctrl.id, pkt.ctrl.code, pkt.ctrl, pkt.ctrl.text);
        }
        setTimeout(() => {
          if (pkt.ctrl.code == 205 && pkt.ctrl.text == 'evicted') {
            // User evicted from topic.
            const topic = cacheGet('topic', pkt.ctrl.topic);
            if (topic) {
              topic._resetSub();
              if (pkt.ctrl.params && pkt.ctrl.params.unsub) {
                topic._gone();
              }
            }
          } else if (pkt.ctrl.params && pkt.ctrl.params.what == 'data') {
            // All messages received: "params":{"count":11,"what":"data"},
            const topic = cacheGet('topic', pkt.ctrl.topic);
            if (topic) {
              topic._allMessagesReceived(pkt.ctrl.params.count);
            }
          } else if (pkt.ctrl.params && pkt.ctrl.params.what == 'sub') {
            // The topic has no subscriptions.
            const topic = cacheGet('topic', pkt.ctrl.topic);
            if (topic) {
              // Trigger topic.onSubsUpdated.
              topic._processMetaSub([]);
            }
          }
        }, 0);
      } else {
        setTimeout(() => {
          if (pkt.meta) {
            // Handling a {meta} message.

            // Preferred API: Route meta to topic, if one is registered
            const topic = cacheGet('topic', pkt.meta.topic);
            if (topic) {
              topic._routeMeta(pkt.meta);
            }

            if (pkt.meta.id) {
              execPromise(pkt.meta.id, 200, pkt.meta, 'META');
            }

            // Secondary API: callback
            if (this.onMetaMessage) {
              this.onMetaMessage(pkt.meta);
            }
          } else if (pkt.data) {
            // Handling {data} message

            // Preferred API: Route data to topic, if one is registered
            const topic = cacheGet('topic', pkt.data.topic);
            if (topic) {
              topic._routeData(pkt.data);
            }

            // Secondary API: Call callback
            if (this.onDataMessage) {
              this.onDataMessage(pkt.data);
            }
          } else if (pkt.pres) {
            // Handling {pres} message

            // Preferred API: Route presence to topic, if one is registered
            const topic = cacheGet('topic', pkt.pres.topic);
            if (topic) {
              topic._routePres(pkt.pres);
            }

            // Secondary API - callback
            if (this.onPresMessage) {
              this.onPresMessage(pkt.pres);
            }
          } else if (pkt.info) {
            // {info} message - read/received notifications and key presses

            // Preferred API: Route {info}} to topic, if one is registered
            const topic = cacheGet('topic', pkt.info.topic);
            if (topic) {
              topic._routeInfo(pkt.info);
            }

            // Secondary API - callback
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

  // Ready to start sending.
  this._connection.onOpen = () => {
    if (!this._expirePromises) {
      // Reject promises which have not been resolved for too long.
      this._expirePromises = setInterval(() => {
        const err = new Error("Timeout (504)");
        const expires = new Date(new Date().getTime() - EXPIRE_PROMISES_TIMEOUT);
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
      }, EXPIRE_PROMISES_PERIOD);
    }
    this.hello();
  }

  // Wrapper for the reconnect iterator callback.
  this._connection.onAutoreconnectIteration = (timeout, promise) => {
    if (this.onAutoreconnectIteration) {
      this.onAutoreconnectIteration(timeout, promise);
    }
  }

  this._connection.onDisconnect = (err, code) => {
    this._inPacketCount = 0;
    this._serverInfo = null;
    this._authenticated = false;

    if (this._expirePromises) {
      clearInterval(this._expirePromises);
      this._expirePromises = null;
    }

    // Mark all topics as unsubscribed
    cacheMap('topic', (topic, key) => {
      topic._resetSub();
    });

    // Reject all pending promises
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
};

// Static methods.

/**
 * @typedef Credential
 * @type {object}
 * @property {string} meth - validation method.
 * @property {string} val - value to validate (e.g. email or phone number).
 * @property {string} resp - validation response.
 * @property {Object} params - validation parameters.
 */
/**
 * Helper method to package account credential.
 *
 * @memberof Tinode
 * @static
 *
 * @param {string | Credential} meth - validation method or object with validation data.
 * @param {string=} val - validation value (e.g. email or phone number).
 * @param {Object=} params - validation parameters.
 * @param {string=} resp - validation response.
 *
 * @returns {Array.<Credential>} array with a single credential or <code>null</code> if no valid credentials were given.
 */
Tinode.credential = function(meth, val, params, resp) {
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
};

/**
 * Determine topic type from topic's name: grp, p2p, me, fnd, sys.
 * @memberof Tinode
 * @static
 *
 * @param {string} name - Name of the topic to test.
 * @returns {string} One of <code>"me"</code>, <code>"fnd"</code>, <code>"sys"</code>, <code>"grp"</code>,
 *    <code>"p2p"</code> or <code>undefined</code>.
 */
Tinode.topicType = function(name) {
  const types = {
    'me': 'me',
    'fnd': 'fnd',
    'grp': 'grp',
    'new': 'grp',
    'nch': 'grp',
    'chn': 'grp',
    'usr': 'p2p',
    'sys': 'sys'
  };
  return types[(typeof name == 'string') ? name.substring(0, 3) : 'xxx'];
};

/**
 * Check if the given topic name is a name of a 'me' topic.
 * @memberof Tinode
 * @static
 *
 * @param {string} name - Name of the topic to test.
 * @returns {boolean} <code>true</code> if the name is a name of a 'me' topic, <code>false</code> otherwise.
 */
Tinode.isMeTopicName = function(name) {
  return Tinode.topicType(name) == 'me';
};

/**
 * Check if the given topic name is a name of a group topic.
 * @memberof Tinode
 * @static
 *
 * @param {string} name - Name of the topic to test.
 * @returns {boolean} <code>true</code> if the name is a name of a group topic, <code>false</code> otherwise.
 */
Tinode.isGroupTopicName = function(name) {
  return Tinode.topicType(name) == 'grp';
};

/**
 * Check if the given topic name is a name of a p2p topic.
 * @memberof Tinode
 * @static
 *
 * @param {string} name - Name of the topic to test.
 * @returns {boolean} <code>true</code> if the name is a name of a p2p topic, <code>false</code> otherwise.
 */
Tinode.isP2PTopicName = function(name) {
  return Tinode.topicType(name) == 'p2p';
};

/**
 * Check if the given topic name is a name of a communication topic, i.e. P2P or group.
 * @memberof Tinode
 * @static
 *
 * @param {string} name - Name of the topic to test.
 * @returns {boolean} <code>true</code> if the name is a name of a p2p or group topic, <code>false</code> otherwise.
 */
Tinode.isCommTopicName = function(name) {
  return Tinode.isP2PTopicName(name) || Tinode.isGroupTopicName(name);
};

/**
 * Check if the topic name is a name of a new topic.
 * @memberof Tinode
 * @static
 *
 * @param {string} name - topic name to check.
 * @returns {boolean} <code>true</code> if the name is a name of a new topic, <code>false</code> otherwise.
 */
Tinode.isNewGroupTopicName = function(name) {
  return (typeof name == 'string') &&
    (name.substring(0, 3) == TOPIC_NEW || name.substring(0, 3) == TOPIC_NEW_CHAN);
};

/**
 * Check if the topic name is a name of a channel.
 * @memberof Tinode
 * @static
 *
 * @param {string} name - topic name to check.
 * @returns {boolean} <code>true</code> if the name is a name of a channel, <code>false</code> otherwise.
 */
Tinode.isChannelTopicName = function(name) {
  return (typeof name == 'string') &&
    (name.substring(0, 3) == TOPIC_CHAN || name.substring(0, 3) == TOPIC_NEW_CHAN);
};

/**
 * Return information about the current version of this Tinode client library.
 * @memberof Tinode
 * @static
 *
 * @returns {string} semantic version of the library, e.g. <code>"0.15.5-rc1"</code>.
 */
Tinode.getVersion = function() {
  return VERSION;
};

/**
 * To use Tinode in a non browser context, supply WebSocket and XMLHttpRequest providers.
 * @static
 * @memberof Tinode
 * @param wsProvider WebSocket provider, e.g. for nodeJS , <code>require('ws')</code>.
 * @param xhrProvider XMLHttpRequest provider, e.g. for node <code>require('xhr')</code>.
 */
Tinode.setNetworkProviders = function(wsProvider, xhrProvider) {
  WebSocketProvider = wsProvider;
  XHRProvider = xhrProvider;
};

/**
 * Return information about the current name and version of this Tinode library.
 * @memberof Tinode
 * @static
 *
 * @returns {string} the name of the library and it's version.
 */
Tinode.getLibrary = function() {
  return LIBRARY;
};

// Exported constants
Tinode.MESSAGE_STATUS_NONE = MESSAGE_STATUS_NONE;
Tinode.MESSAGE_STATUS_QUEUED = MESSAGE_STATUS_QUEUED;
Tinode.MESSAGE_STATUS_SENDING = MESSAGE_STATUS_SENDING;
Tinode.MESSAGE_STATUS_FAILED = MESSAGE_STATUS_FAILED;
Tinode.MESSAGE_STATUS_SENT = MESSAGE_STATUS_SENT;
Tinode.MESSAGE_STATUS_RECEIVED = MESSAGE_STATUS_RECEIVED;
Tinode.MESSAGE_STATUS_READ = MESSAGE_STATUS_READ;
Tinode.MESSAGE_STATUS_TO_ME = MESSAGE_STATUS_TO_ME;

// Unicode [del] symbol.
Tinode.DEL_CHAR = '\u2421';

/**
 * Check if the given string represents <code>NULL</code> value as defined by Tinode (<code>'\u2421'</code>).
 * @memberof Tinode
 * @static
 *
 * @param {string} str - string to check for <code>NULL</code> value.
 *
 * @returns {boolean} <code>true</code> if string represents <code>NULL</code> value, <code>false</code> otherwise.
 */
Tinode.isNullValue = function(str) {
  return str === Tinode.DEL_CHAR;
};

/**
 * Check if the given URL string is a relative URL.
 * Check for cases like:
 *  <code>'http://example.com'</code>
 *  <code>' http://example.com'</code>
 *  <code>'//example.com/'</code>
 *  <code>'http:example.com'</code>
 *  <code>'http:/example.com'</code>
 * @memberof Tinode
 * @static
 *
 * @param {string} url - URL string to check.
 *
 * @returns {boolean} <code>true</code> if the URL is relative, <code>false</code> otherwise.
 */
Tinode.isRelativeURL = function(url) {
  return !/^\s*([a-z][a-z0-9+.-]*:|\/\/)/im.test(url);
};

// Names of keys to server-provided configuration limits.
Tinode.MAX_MESSAGE_SIZE = 'maxMessageSize';
Tinode.MAX_SUBSCRIBER_COUNT = 'maxSubscriberCount';
Tinode.MAX_TAG_COUNT = 'maxTagCount';
Tinode.MAX_FILE_UPLOAD_SIZE = 'maxFileUploadSize';

// Public methods;
Tinode.prototype = {
  /**
   * Connect to the server.
   * @memberof Tinode#
   *
   * @param {string} host_ - name of the host to connect to.
   *
   * @return {Promise} Promise resolved/rejected when the connection call completes:
   *    <code>resolve()</code> is called without parameters, <code>reject()</code> receives the
   *    <code>Error</code> as a single parameter.
   */
  connect: function(host_) {
    return this._connection.connect(host_);
  },

  /**
   * Attempt to reconnect to the server immediately.
   * @memberof Tinode#
   *
   * @param {string} force - reconnect even if there is a connection already.
   */
  reconnect: function(force) {
    this._connection.reconnect(force);
  },

  /**
   * Disconnect from the server.
   * @memberof Tinode#
   */
  disconnect: function() {
    this._connection.disconnect();
  },

  /**
   * Clear persistent cache: remove indexDB cache of the most recently logged in user.
   */
  clearStorage: function() {
    if (this._db) {
      this._db.deleteDatabase();
    }
  },

  /**
   * Send a network probe message to make sure the connection is alive.
   * @memberof Tinode#
   */
  networkProbe: function() {
    this._connection.probe();
  },

  /**
   * Check for live connection to server.
   * @memberof Tinode#
   *
   * @returns {boolean} <code>true</code> if there is a live connection, <code>false</code> otherwise.
   */
  isConnected: function() {
    return this._connection.isConnected();
  },

  /**
   * Check if connection is authenticated (last login was successful).
   * @memberof Tinode#
   * @returns {boolean} <code>true</code> if authenticated, <code>false</code> otherwise.
   */
  isAuthenticated: function() {
    return this._authenticated;
  },

  /**
   * Add API key and auth token to the relative URL making it usable for getting data
   * from the server in a simple <code>HTTP GET</code> request.
   * @memberof Tinode#
   *
   * @param {string} URL - URL to wrap.
   * @returns {string} URL with appended API key and token, if valid token is present.
   */
  authorizeURL: function(url) {
    if (!url) {
      return url;
    }

    if (Tinode.isRelativeURL(url)) {
      // Fake base to make the relative URL parseable.
      const base = 'scheme://host/';
      const parsed = new URL(url, base);
      if (this._apiKey) {
        parsed.searchParams.append('apikey', this._apiKey);
      }
      if (this._authToken.token) {
        parsed.searchParams.append('auth', 'token');
        parsed.searchParams.append('secret', this._authToken.token);
      }
      // Convert back to string and strip fake base URL except for the root slash.
      url = parsed.toString().substring(base.length - 1);
    }
    return url;
  },

  /**
   * @typedef AccountParams
   * @memberof Tinode
   * @type {Object}
   * @property {Tinode.DefAcs=} defacs - Default access parameters for user's <code>me</code> topic.
   * @property {Object=} public - Public application-defined data exposed on <code>me</code> topic.
   * @property {Object=} private - Private application-defined data accessible on <code>me</code> topic.
   * @property {Array} tags - array of string tags for user discovery.
   * @property {string=} token - authentication token to use.
   */
  /**
   * @typedef DefAcs
   * @memberof Tinode
   * @type {Object}
   * @property {string=} auth - Access mode for <code>me</code> for authenticated users.
   * @property {string=} anon - Access mode for <code>me</code> for anonymous users.
   */

  /**
   * Create or update an account.
   * @memberof Tinode#
   *
   * @param {string} uid - User id to update
   * @param {string} scheme - Authentication scheme; <code>"basic"</code> and <code>"anonymous"</code> are the currently supported schemes.
   * @param {string} secret - Authentication secret, assumed to be already base64 encoded.
   * @param {boolean=} login - Use new account to authenticate current session
   * @param {Tinode.AccountParams=} params - User data to pass to the server.
   */
  account: function(uid, scheme, secret, login, params) {
    const pkt = this.initPacket('acc');
    pkt.acc.user = uid;
    pkt.acc.scheme = scheme;
    pkt.acc.secret = secret;
    // Log in to the new account using selected scheme
    pkt.acc.login = login;

    if (params) {
      pkt.acc.desc.defacs = params.defacs;
      pkt.acc.desc.public = params.public;
      pkt.acc.desc.private = params.private;

      pkt.acc.tags = params.tags;
      pkt.acc.cred = params.cred;

      pkt.acc.token = params.token;
    }

    return this.send(pkt, pkt.acc.id);
  },

  /**
   * Create a new user. Wrapper for {@link Tinode#account}.
   * @memberof Tinode#
   *
   * @param {string} scheme - Authentication scheme; <code>"basic"</code> is the only currently supported scheme.
   * @param {string} secret - Authentication.
   * @param {boolean=} login - Use new account to authenticate current session
   * @param {Tinode.AccountParams=} params - User data to pass to the server.
   *
   * @returns {Promise} Promise which will be resolved/rejected when server reply is received.
   */
  createAccount: function(scheme, secret, login, params) {
    let promise = this.account(USER_NEW, scheme, secret, login, params);
    if (login) {
      promise = promise.then((ctrl) => {
        return this.loginSuccessful(ctrl);
      });
    }
    return promise;
  },

  /**
   * Create user with <code>'basic'</code> authentication scheme and immediately
   * use it for authentication. Wrapper for {@link Tinode#account}.
   * @memberof Tinode#
   *
   * @param {string} username - Login to use for the new account.
   * @param {string} password - User's password.
   * @param {Tinode.AccountParams=} params - User data to pass to the server.
   *
   * @returns {Promise} Promise which will be resolved/rejected when server reply is received.
   */
  createAccountBasic: function(username, password, params) {
    // Make sure we are not using 'null' or 'undefined';
    username = username || '';
    password = password || '';
    return this.createAccount('basic',
      b64EncodeUnicode(username + ':' + password), true, params);
  },

  /**
   * Update user's credentials for <code>'basic'</code> authentication scheme. Wrapper for {@link Tinode#account}.
   * @memberof Tinode#
   *
   * @param {string} uid - User ID to update.
   * @param {string} username - Login to use for the new account.
   * @param {string} password - User's password.
   * @param {Tinode.AccountParams=} params - data to pass to the server.
   *
   * @returns {Promise} Promise which will be resolved/rejected when server reply is received.
   */
  updateAccountBasic: function(uid, username, password, params) {
    // Make sure we are not using 'null' or 'undefined';
    username = username || '';
    password = password || '';
    return this.account(uid, 'basic',
      b64EncodeUnicode(username + ':' + password), false, params);
  },

  /**
   * Send handshake to the server.
   * @memberof Tinode#
   *
   * @returns {Promise} Promise which will be resolved/rejected when server reply is received.
   */
  hello: function() {
    const pkt = this.initPacket('hi');

    return this.send(pkt, pkt.hi.id)
      .then((ctrl) => {
        // Reset backoff counter on successful connection.
        this._connection.backoffReset();

        // Server response contains server protocol version, build, constraints,
        // session ID for long polling. Save them.
        if (ctrl.params) {
          this._serverInfo = ctrl.params;
        }

        if (this.onConnect) {
          this.onConnect();
        }

        return ctrl;
      }).catch((err) => {
        this._connection.reconnect(true);

        if (this.onDisconnect) {
          this.onDisconnect(err);
        }
      });
  },

  /**
   * Set or refresh the push notifications/device token. If the client is connected,
   * the deviceToken can be sent to the server.
   *
   * @memberof Tinode#
   * @param {string} dt - token obtained from the provider or <code>false</code>,
   *    <code>null</code> or <code>undefined</code> to clear the token.
   *
   * @returns <code>true</code> if attempt was made to send the update to the server.
   */
  setDeviceToken: function(dt) {
    let sent = false;
    // Convert any falsish value to null.
    dt = dt || null;
    if (dt != this._deviceToken) {
      this._deviceToken = dt;
      if (this.isConnected() && this.isAuthenticated()) {
        this.send({
          'hi': {
            'dev': dt || Tinode.DEL_CHAR
          }
        });
        sent = true;
      }
    }
    return sent;
  },

  /**
   * Authenticate current session.
   * @memberof Tinode#
   *
   * @param {string} scheme - Authentication scheme; <code>"basic"</code> is the only currently supported scheme.
   * @param {string} secret - Authentication secret, assumed to be already base64 encoded.
   *
   * @returns {Promise} Promise which will be resolved/rejected when server reply is received.
   */
  login: function(scheme, secret, cred) {
    const pkt = this.initPacket('login');
    pkt.login.scheme = scheme;
    pkt.login.secret = secret;
    pkt.login.cred = cred;

    return this.send(pkt, pkt.login.id)
      .then((ctrl) => {
        return this.loginSuccessful(ctrl);
      });
  },

  /**
   * Wrapper for {@link Tinode#login} with basic authentication
   * @memberof Tinode#
   *
   * @param {string} uname - User name.
   * @param {string} password  - Password.
   * @returns {Promise} Promise which will be resolved/rejected on receiving server reply.
   */
  loginBasic: function(uname, password, cred) {
    return this.login('basic', b64EncodeUnicode(uname + ':' + password), cred)
      .then((ctrl) => {
        this._login = uname;
        return ctrl;
      });
  },

  /**
   * Wrapper for {@link Tinode#login} with token authentication
   * @memberof Tinode#
   *
   * @param {string} token - Token received in response to earlier login.
   * @returns {Promise} Promise which will be resolved/rejected on receiving server reply.
   */
  loginToken: function(token, cred) {
    return this.login('token', token, cred);
  },

  /**
   * Send a request for resetting an authentication secret.
   * @memberof Tinode#
   *
   * @param {string} scheme - authentication scheme to reset.
   * @param {string} method - method to use for resetting the secret, such as "email" or "tel".
   * @param {string} value - value of the credential to use, a specific email address or a phone number.
   *
   * @returns {Promise} Promise which will be resolved/rejected on receiving the server reply.
   */
  requestResetAuthSecret: function(scheme, method, value) {
    return this.login('reset', b64EncodeUnicode(scheme + ':' + method + ':' + value));
  },

  /**
   * @typedef AuthToken
   * @memberof Tinode
   * @type {Object}
   * @property {string} token - Token value.
   * @property {Date} expires - Token expiration time.
   */
  /**
   * Get stored authentication token.
   * @memberof Tinode#
   *
   * @returns {Tinode.AuthToken} authentication token.
   */
  getAuthToken: function() {
    if (this._authToken && (this._authToken.expires.getTime() > Date.now())) {
      return this._authToken;
    } else {
      this._authToken = null;
    }
    return null;
  },

  /**
   * Application may provide a saved authentication token.
   * @memberof Tinode#
   *
   * @param {Tinode.AuthToken} token - authentication token.
   */
  setAuthToken: function(token) {
    this._authToken = token;
  },

  /**
   * @typedef SetParams
   * @type {Object}
   * @memberof Tinode
   * @property {Tinode.SetDesc=} desc - Topic initialization parameters when creating a new topic or a new subscription.
   * @property {Tinode.SetSub=} sub - Subscription initialization parameters.
   */
  /**
   * @typedef SetDesc
   * @type {Object}
   * @memberof Tinode
   * @property {Tinode.DefAcs=} defacs - Default access mode.
   * @property {Object=} public - Free-form topic description, publically accessible.
   * @property {Object=} private - Free-form topic descriptionaccessible only to the owner.
   */
  /**
   * @typedef SetSub
   * @type {Object}
   * @memberof Tinode
   * @property {string=} user - UID of the user affected by the request. Default (empty) - current user.
   * @property {string=} mode - User access mode, either requested or assigned dependent on context.
   * @property {Object=} info - Free-form payload to pass to the invited user or topic manager.
   */
  /**
   * Parameters passed to {@link Tinode#subscribe}.
   *
   * @typedef SubscriptionParams
   * @type {Object}
   * @memberof Tinode
   * @property {Tinode.SetParams=} set - Parameters used to initialize topic
   * @property {Tinode.GetQuery=} get - Query for fetching data from topic.
   */

  /**
   * Send a topic subscription request.
   * @memberof Tinode#
   *
   * @param {string} topic - Name of the topic to subscribe to.
   * @param {Tinode.GetQuery=} getParams - Optional subscription metadata query
   * @param {Tinode.SetParams=} setParams - Optional initialization parameters
   *
   * @returns {Promise} Promise which will be resolved/rejected on receiving server reply.
   */
  subscribe: function(topicName, getParams, setParams) {
    const pkt = this.initPacket('sub', topicName)
    if (!topicName) {
      topicName = TOPIC_NEW;
    }

    pkt.sub.get = getParams;

    if (setParams) {
      if (setParams.sub) {
        pkt.sub.set.sub = setParams.sub;
      }

      if (setParams.desc) {
        if (Tinode.isNewGroupTopicName(topicName)) {
          // Full set.desc params are used for new topics only
          pkt.sub.set.desc = setParams.desc;
        } else if (Tinode.isP2PTopicName(topicName) && setParams.desc.defacs) {
          // Use optional default permissions only.
          pkt.sub.set.desc = {
            defacs: setParams.desc.defacs
          };
        }
      }

      if (setParams.tags) {
        pkt.sub.set.tags = setParams.tags;
      }
    }

    return this.send(pkt, pkt.sub.id);
  },

  /**
   * Detach and optionally unsubscribe from the topic
   * @memberof Tinode#
   *
   * @param {string} topic - Topic to detach from.
   * @param {boolean} unsub - If <code>true</code>, detach and unsubscribe, otherwise just detach.
   *
   * @returns {Promise} Promise which will be resolved/rejected on receiving server reply.
   */
  leave: function(topic, unsub) {
    const pkt = this.initPacket('leave', topic);
    pkt.leave.unsub = unsub;

    return this.send(pkt, pkt.leave.id);
  },

  /**
   * Create message draft without sending it to the server.
   * @memberof Tinode#
   *
   * @param {string} topic - Name of the topic to publish to.
   * @param {Object} data - Payload to publish.
   * @param {boolean=} noEcho - If <code>true</code>, tell the server not to echo the message to the original session.
   *
   * @returns {Object} new message which can be sent to the server or otherwise used.
   */
  createMessage: function(topic, data, noEcho) {
    const pkt = this.initPacket('pub', topic);

    let dft = typeof data == 'string' ? Drafty.parse(data) : data;
    if (dft && !Drafty.isPlainText(dft)) {
      pkt.pub.head = {
        mime: Drafty.getContentType()
      };
      data = dft;
    }
    pkt.pub.noecho = noEcho;
    pkt.pub.content = data;

    return pkt.pub;
  },

  /**
   * Publish {data} message to topic.
   * @memberof Tinode#
   *
   * @param {string} topic - Name of the topic to publish to.
   * @param {Object} data - Payload to publish.
   * @param {boolean=} noEcho - If <code>true</code>, tell the server not to echo the message to the original session.
   *
   * @returns {Promise} Promise which will be resolved/rejected on receiving server reply.
   */
  publish: function(topic, data, noEcho) {
    return this.publishMessage(
      this.createMessage(topic, data, noEcho)
    );
  },

  /**
   * Publish message to topic. The message should be created by {@link Tinode#createMessage}.
   * @memberof Tinode#
   *
   * @param {Object} pub - Message to publish.
   *
   * @returns {Promise} Promise which will be resolved/rejected on receiving server reply.
   */
  publishMessage: function(pub) {
    // Make a shallow copy. Needed in order to clear locally-assigned temp values;
    pub = Object.assign({}, pub);
    pub.seq = undefined;
    pub.from = undefined;
    pub.ts = undefined;
    return this.send({
      pub: pub
    }, pub.id);
  },

  /**
   * Out of band notification: notify topic that an external (push) notification was recived by the client.
   * @memberof Tinode#
   *
   * @param {string} topicName - name of the updated topic.
   * @param {number} seq - seq ID of the new message.
   * @param {string=} act - UID of the sender; default is current.
   */
  oobNotification: function(topicName, seq, act) {
    const topic = this.cacheGet('topic', topicName);
    if (topic) {
      topic._updateReceived(seq, act);
      this.getMeTopic()._refreshContact('msg', topic);
    }
  },

  /**
   * @typedef GetQuery
   * @type {Object}
   * @memberof Tinode
   * @property {Tinode.GetOptsType=} desc - If provided (even if empty), fetch topic description.
   * @property {Tinode.GetOptsType=} sub - If provided (even if empty), fetch topic subscriptions.
   * @property {Tinode.GetDataType=} data - If provided (even if empty), get messages.
   */

  /**
   * @typedef GetOptsType
   * @type {Object}
   * @memberof Tinode
   * @property {Date=} ims - "If modified since", fetch data only it was was modified since stated date.
   * @property {number=} limit - Maximum number of results to return. Ignored when querying topic description.
   */

  /**
   * @typedef GetDataType
   * @type {Object}
   * @memberof Tinode
   * @property {number=} since - Load messages with seq id equal or greater than this value.
   * @property {number=} before - Load messages with seq id lower than this number.
   * @property {number=} limit - Maximum number of results to return.
   */

  /**
   * Request topic metadata
   * @memberof Tinode#
   *
   * @param {string} topic - Name of the topic to query.
   * @param {Tinode.GetQuery} params - Parameters of the query. Use {@link Tinode.MetaGetBuilder} to generate.
   *
   * @returns {Promise} Promise which will be resolved/rejected on receiving server reply.
   */
  getMeta: function(topic, params) {
    const pkt = this.initPacket('get', topic);

    pkt.get = mergeObj(pkt.get, params);

    return this.send(pkt, pkt.get.id);
  },

  /**
   * Update topic's metadata: description, subscribtions.
   * @memberof Tinode#
   *
   * @param {string} topic - Topic to update.
   * @param {Tinode.SetParams} params - topic metadata to update.
   * @returns {Promise} Promise which will be resolved/rejected on receiving server reply.
   */
  setMeta: function(topic, params) {
    const pkt = this.initPacket('set', topic);
    const what = [];

    if (params) {
      ['desc', 'sub', 'tags', 'cred'].map(function(key) {
        if (params.hasOwnProperty(key)) {
          what.push(key);
          pkt.set[key] = params[key];
        }
      });
    }

    if (what.length == 0) {
      return Promise.reject(new Error("Invalid {set} parameters"));
    }

    return this.send(pkt, pkt.set.id);
  },

  /**
   * Range of message IDs to delete.
   *
   * @typedef DelRange
   * @type {Object}
   * @memberof Tinode
   * @property {number} low - low end of the range, inclusive (closed).
   * @property {number=} hi - high end of the range, exclusive (open).
   */
  /**
   * Delete some or all messages in a topic.
   * @memberof Tinode#
   *
   * @param {string} topic - Topic name to delete messages from.
   * @param {Tinode.DelRange[]} list - Ranges of message IDs to delete.
   * @param {boolean=} hard - Hard or soft delete
   *
   * @returns {Promise} Promise which will be resolved/rejected on receiving server reply.
   */
  delMessages: function(topic, ranges, hard) {
    const pkt = this.initPacket('del', topic);

    pkt.del.what = 'msg';
    pkt.del.delseq = ranges;
    pkt.del.hard = hard;

    return this.send(pkt, pkt.del.id);
  },

  /**
   * Delete the topic alltogether. Requires Owner permission.
   * @memberof Tinode#
   *
   * @param {string} topicName - Name of the topic to delete
   * @param {boolean} hard - hard-delete topic.
   * @returns {Promise} Promise which will be resolved/rejected on receiving server reply.
   */
  delTopic: function(topicName, hard) {
    const pkt = this.initPacket('del', topicName);
    pkt.del.what = 'topic';
    pkt.del.hard = hard;

    return this.send(pkt, pkt.del.id);
  },

  /**
   * Delete subscription. Requires Share permission.
   * @memberof Tinode#
   *
   * @param {string} topicName - Name of the topic to delete
   * @param {string} user - User ID to remove.
   * @returns {Promise} Promise which will be resolved/rejected on receiving server reply.
   */
  delSubscription: function(topicName, user) {
    const pkt = this.initPacket('del', topicName);
    pkt.del.what = 'sub';
    pkt.del.user = user;

    return this.send(pkt, pkt.del.id);
  },

  /**
   * Delete credential. Always sent on <code>'me'</code> topic.
   * @memberof Tinode#
   *
   * @param {string} method - validation method such as <code>'email'</code> or <code>'tel'</code>.
   * @param {string} value - validation value, i.e. <code>'alice@example.com'</code>.
   * @returns {Promise} Promise which will be resolved/rejected on receiving server reply.
   */
  delCredential: function(method, value) {
    const pkt = this.initPacket('del', TOPIC_ME);
    pkt.del.what = 'cred';
    pkt.del.cred = {
      meth: method,
      val: value
    };

    return this.send(pkt, pkt.del.id);
  },

  /**
   * Request to delete account of the current user.
   * @memberof Tinode#
   *
   * @param {boolean} hard - hard-delete user.
   * @returns {Promise} Promise which will be resolved/rejected on receiving server reply.
   */
  delCurrentUser: function(hard) {
    const pkt = this.initPacket('del', null);
    pkt.del.what = 'user';
    pkt.del.hard = hard;

    return this.send(pkt, pkt.del.id).then((ctrl) => {
      this._myUID = null;
    });
  },

  /**
   * Notify server that a message or messages were read or received. Does NOT return promise.
   * @memberof Tinode#
   *
   * @param {string} topicName - Name of the topic where the mesage is being aknowledged.
   * @param {string} what - Action being aknowledged, either <code>"read"</code> or <code>"recv"</code>.
   * @param {number} seq - Maximum id of the message being acknowledged.
   */
  note: function(topicName, what, seq) {
    if (seq <= 0 || seq >= LOCAL_SEQID) {
      throw new Error(`Invalid message id ${seq}`);
    }

    const pkt = this.initPacket('note', topicName);
    pkt.note.what = what;
    pkt.note.seq = seq;
    this.send(pkt);
  },

  /**
   * Broadcast a key-press notification to topic subscribers. Used to show
   * typing notifications "user X is typing...".
   * @memberof Tinode#
   *
   * @param {string} topicName - Name of the topic to broadcast to.
   */
  noteKeyPress: function(topicName) {
    const pkt = this.initPacket('note', topicName);
    pkt.note.what = 'kp';
    this.send(pkt);
  },

  /**
   * Get a named topic, either pull it from cache or create a new instance.
   * There is a single instance of topic for each name.
   * @memberof Tinode#
   *
   * @param {string} topicName - Name of the topic to get.
   * @returns {Tinode.Topic} Requested or newly created topic or <code>undefined</code> if topic name is invalid.
   */
  getTopic: function(topicName) {
    let topic = this.cacheGet('topic', topicName);
    if (!topic && topicName) {
      if (topicName == TOPIC_ME) {
        topic = new TopicMe();
      } else if (topicName == TOPIC_FND) {
        topic = new TopicFnd();
      } else {
        topic = new Topic(topicName);
      }
      // Cache management.
      this._db.updTopic(topic);
      this.attachCacheToTopic(topic);
      topic._cachePutSelf();
    }
    return topic;
  },

  /**
   * Check if named topic is already present in cache.
   * @memberof Tinode#
   *
   * @param {string} topicName - Name of the topic to check.
   * @returns {boolean} true if topic is found in cache, false oterwise.
   */
  isTopicCached: function(topicName) {
    return !!this.cacheGet('topic', topicName);
  },

  /**
   * Generate unique name like <code>'new123456'</code> suitable for creating a new group topic.
   * @memberof Tinode#
   *
   * @param {boolean} isChan - if the topic is channel-enabled.
   * @returns {string} name which can be used for creating a new group topic.
   */
  newGroupTopicName: function(isChan) {
    return (isChan ? TOPIC_NEW_CHAN : TOPIC_NEW) + this.getNextUniqueId();
  },

  /**
   * Instantiate <code>'me'</code> topic or get it from cache.
   * @memberof Tinode#
   *
   * @returns {Tinode.TopicMe} Instance of <code>'me'</code> topic.
   */
  getMeTopic: function() {
    return this.getTopic(TOPIC_ME);
  },

  /**
   * Instantiate <code>'fnd'</code> (find) topic or get it from cache.
   * @memberof Tinode#
   *
   * @returns {Tinode.Topic} Instance of <code>'fnd'</code> topic.
   */
  getFndTopic: function() {
    return this.getTopic(TOPIC_FND);
  },

  /**
   * Create a new {@link LargeFileHelper} instance
   * @memberof Tinode#
   *
   * @returns {Tinode.LargeFileHelper} instance of a {@link Tinode.LargeFileHelper}.
   */
  getLargeFileHelper: function() {
    return new LargeFileHelper(this);
  },

  /**
   * Get the UID of the the current authenticated user.
   * @memberof Tinode#
   * @returns {string} UID of the current user or <code>undefined</code> if the session is not yet authenticated or if there is no session.
   */
  getCurrentUserID: function() {
    return this._myUID;
  },

  /**
   * Check if the given user ID is equal to the current user's UID.
   * @memberof Tinode#
   * @param {string} uid - UID to check.
   * @returns {boolean} true if the given UID belongs to the current logged in user.
   */
  isMe: function(uid) {
    return this._myUID === uid;
  },

  /**
   * Get login used for last successful authentication.
   * @memberof Tinode#
   * @returns {string} login last used successfully or <code>undefined</code>.
   */
  getCurrentLogin: function() {
    return this._login;
  },

  /**
   * Return information about the server: protocol version and build timestamp.
   * @memberof Tinode#
   * @returns {Object} build and version of the server or <code>null</code> if there is no connection or if the first server response has not been received yet.
   */
  getServerInfo: function() {
    return this._serverInfo;
  },

  /**
   * Return server-provided configuration value (long integer).
   * @memberof Tinode#
   * @param {string} name of the value to return
   * @param {Object} defaultValue to return in case server limit is not set or not found.
   * @returns {number} named value.
   */
  getServerLimit: function(name, defaultValue) {
    return (this._serverInfo ? this._serverInfo[name] : null) || defaultValue;
  },

  /**
   * Toggle console logging. Logging is off by default.
   * @memberof Tinode#
   * @param {boolean} enabled - Set to <code>true</code> to enable logging to console.
   * @param {boolean} trimLongStrings - Set to <code>true</code> to trim long strings.
   */
  enableLogging: function(enabled, trimLongStrings) {
    this._loggingEnabled = enabled;
    this._trimLongStrings = enabled && trimLongStrings;
  },

  /**
   * Set UI language to report to the server. Must be called before <code>'hi'</code> is sent, otherwise it will not be used.
   * @memberof Tinode#
   *
   * @param {string} hl - human (UI) language, like <code>"en_US"</code> or <code>"zh-Hans"</code>.
   */
  setHumanLanguage: function(hl) {
    if (hl) {
      this._humanLanguage = hl;
    }
  },

  /**
   * Check if given topic is online.
   * @memberof Tinode#
   *
   * @param {string} name of the topic to test.
   * @returns {boolean} true if topic is online, false otherwise.
   */
  isTopicOnline: function(name) {
    const topic = this.cacheGet('topic', name);
    return topic && topic.online;
  },

  /**
   * Get access mode for the given contact.
   * @memberof Tinode#
   *
   * @param {string} name of the topic to query.
   * @returns {AccessMode} access mode if topic is found, null otherwise.
   */
  getTopicAccessMode: function(name) {
    const topic = this.cacheGet('topic', name);
    return topic ? topic.acs : null;
  },

  /**
   * Include message ID into all subsequest messages to server instructin it to send aknowledgemens.
   * Required for promises to function. Default is <code>"on"</code>.
   * @memberof Tinode#
   *
   * @param {boolean} status - Turn aknowledgemens on or off.
   * @deprecated
   */
  wantAkn: function(status) {
    if (status) {
      this._messageId = Math.floor((Math.random() * 0xFFFFFF) + 0xFFFFFF);
    } else {
      this._messageId = 0;
    }
  },

  // Callbacks:
  /**
   * Callback to report when the websocket is opened. The callback has no parameters.
   * @memberof Tinode#
   * @type {Tinode.onWebsocketOpen}
   */
  onWebsocketOpen: undefined,

  /**
   * @typedef Tinode.ServerParams
   * @memberof Tinode
   * @type {Object}
   * @property {string} ver - Server version
   * @property {string} build - Server build
   * @property {string=} sid - Session ID, long polling connections only.
   */

  /**
   * @callback Tinode.onConnect
   * @param {number} code - Result code
   * @param {string} text - Text epxplaining the completion, i.e "OK" or an error message.
   * @param {Tinode.ServerParams} params - Parameters returned by the server.
   */
  /**
   * Callback to report when connection with Tinode server is established.
   * @memberof Tinode#
   * @type {Tinode.onConnect}
   */
  onConnect: undefined,

  /**
   * Callback to report when connection is lost. The callback has no parameters.
   * @memberof Tinode#
   * @type {Tinode.onDisconnect}
   */
  onDisconnect: undefined,

  /**
   * @callback Tinode.onLogin
   * @param {number} code - NUmeric completion code, same as HTTP status codes.
   * @param {string} text - Explanation of the completion code.
   */
  /**
   * Callback to report login completion.
   * @memberof Tinode#
   * @type {Tinode.onLogin}
   */
  onLogin: undefined,

  /**
   * Callback to receive <code>{ctrl}</code> (control) messages.
   * @memberof Tinode#
   * @type {Tinode.onCtrlMessage}
   */
  onCtrlMessage: undefined,

  /**
   * Callback to recieve <code>{data}</code> (content) messages.
   * @memberof Tinode#
   * @type {Tinode.onDataMessage}
   */
  onDataMessage: undefined,

  /**
   * Callback to receive <code>{pres}</code> (presence) messages.
   * @memberof Tinode#
   * @type {Tinode.onPresMessage}
   */
  onPresMessage: undefined,

  /**
   * Callback to receive all messages as objects.
   * @memberof Tinode#
   * @type {Tinode.onMessage}
   */
  onMessage: undefined,

  /**
   * Callback to receive all messages as unparsed text.
   * @memberof Tinode#
   * @type {Tinode.onRawMessage}
   */
  onRawMessage: undefined,

  /**
   * Callback to receive server responses to network probes. See {@link Tinode#networkProbe}
   * @memberof Tinode#
   * @type {Tinode.onNetworkProbe}
   */
  onNetworkProbe: undefined,

  /**
   * Callback to be notified when exponential backoff is iterating.
   * @memberof Tinode#
   * @type {Tinode.onAutoreconnectIteration}
   */
  onAutoreconnectIteration: undefined,
};

/**
 * Helper class for constructing {@link Tinode.GetQuery}.
 *
 * @class MetaGetBuilder
 * @memberof Tinode
 *
 * @param {Tinode.Topic} parent topic which instantiated this builder.
 */
var MetaGetBuilder = function(parent) {
  this.topic = parent;
  this.what = {};
}

MetaGetBuilder.prototype = {

  // Get timestamp of the most recent desc update.
  _get_desc_ims: function() {
    const tupd = this.topic._lastDescUpdate || 0;
    return this.topic.updated > tupd ? this.topic.updated : tupd;
  },

  // Get timestamp of the most recent subs update.
  _get_subs_ims: function() {
    if (this.topic.isP2PType()) {
      return this._get_desc_ims();
    }
    if (this.topic.isMeType()) {
      const gupd = this.topic._tinode._lastTopicUpdate || 0;
      if (gupd > this.topic._lastSubsUpdate) {
        return gupd;
      }
    }
    return this.topic._lastSubsUpdate;
  },

  /**
   * Add query parameters to fetch messages within explicit limits.
   * @memberof Tinode.MetaGetBuilder#
   *
   * @param {number=} since - messages newer than this (inclusive);
   * @param {number=} before - older than this (exclusive)
   * @param {number=} limit - number of messages to fetch
   * @returns {Tinode.MetaGetBuilder} <code>this</code> object.
   */
  withData: function(since, before, limit) {
    this.what['data'] = {
      since: since,
      before: before,
      limit: limit
    };
    return this;
  },

  /**
   * Add query parameters to fetch messages newer than the latest saved message.
   * @memberof Tinode.MetaGetBuilder#
   *
   * @param {number=} limit - number of messages to fetch
   *
   * @returns {Tinode.MetaGetBuilder} <code>this</code> object.
   */
  withLaterData: function(limit) {
    return this.withData(this.topic._maxSeq > 0 ? this.topic._maxSeq + 1 : undefined, undefined, limit);
  },

  /**
   * Add query parameters to fetch messages older than the earliest saved message.
   * @memberof Tinode.MetaGetBuilder#
   *
   * @param {number=} limit - maximum number of messages to fetch.
   *
   * @returns {Tinode.MetaGetBuilder} <code>this</code> object.
   */
  withEarlierData: function(limit) {
    return this.withData(undefined, this.topic._minSeq > 0 ? this.topic._minSeq : undefined, limit);
  },

  /**
   * Add query parameters to fetch topic description if it's newer than the given timestamp.
   * @memberof Tinode.MetaGetBuilder#
   *
   * @param {Date=} ims - fetch messages newer than this timestamp.
   *
   * @returns {Tinode.MetaGetBuilder} <code>this</code> object.
   */
  withDesc: function(ims) {
    this.what['desc'] = {
      ims: ims
    };
    return this;
  },

  /**
   * Add query parameters to fetch topic description if it's newer than the last update.
   * @memberof Tinode.MetaGetBuilder#
   *
   * @returns {Tinode.MetaGetBuilder} <code>this</code> object.
   */
  withLaterDesc: function() {
    return this.withDesc(this._get_desc_ims());
  },

  /**
   * Add query parameters to fetch subscriptions.
   * @memberof Tinode.MetaGetBuilder#
   *
   * @param {Date=} ims - fetch subscriptions modified more recently than this timestamp
   * @param {number=} limit - maximum number of subscriptions to fetch.
   * @param {string=} userOrTopic - user ID or topic name to fetch for fetching one subscription.
   *
   * @returns {Tinode.MetaGetBuilder} <code>this</code> object.
   */
  withSub: function(ims, limit, userOrTopic) {
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
  },

  /**
   * Add query parameters to fetch a single subscription.
   * @memberof Tinode.MetaGetBuilder#
   *
   * @param {Date=} ims - fetch subscriptions modified more recently than this timestamp
   * @param {string=} userOrTopic - user ID or topic name to fetch for fetching one subscription.
   *
   * @returns {Tinode.MetaGetBuilder} <code>this</code> object.
   */
  withOneSub: function(ims, userOrTopic) {
    return this.withSub(ims, undefined, userOrTopic);
  },

  /**
   * Add query parameters to fetch a single subscription if it's been updated since the last update.
   * @memberof Tinode.MetaGetBuilder#
   *
   * @param {string=} userOrTopic - user ID or topic name to fetch for fetching one subscription.
   *
   * @returns {Tinode.MetaGetBuilder} <code>this</code> object.
   */
  withLaterOneSub: function(userOrTopic) {
    return this.withOneSub(this.topic._lastSubsUpdate, userOrTopic);
  },

  /**
   * Add query parameters to fetch subscriptions updated since the last update.
   * @memberof Tinode.MetaGetBuilder#
   *
   * @param {number=} limit - maximum number of subscriptions to fetch.
   *
   * @returns {Tinode.MetaGetBuilder} <code>this</code> object.
   */
  withLaterSub: function(limit) {
    return this.withSub(this._get_subs_ims(), limit);
  },

  /**
   * Add query parameters to fetch topic tags.
   * @memberof Tinode.MetaGetBuilder#
   *
   * @returns {Tinode.MetaGetBuilder} <code>this</code> object.
   */
  withTags: function() {
    this.what['tags'] = true;
    return this;
  },

  /**
   * Add query parameters to fetch user's credentials. <code>'me'</code> topic only.
   * @memberof Tinode.MetaGetBuilder#
   *
   * @returns {Tinode.MetaGetBuilder} <code>this</code> object.
   */
  withCred: function() {
    if (this.topic.getType() == 'me') {
      this.what['cred'] = true;
    } else {
      this.topic._tinode.logger("ERROR: Invalid topic type for MetaGetBuilder:withCreds", this.topic.getType());
    }
    return this;
  },

  /**
   * Add query parameters to fetch deleted messages within explicit limits. Any/all parameters can be null.
   * @memberof Tinode.MetaGetBuilder#
   *
   * @param {number=} since - ids of messages deleted since this 'del' id (inclusive)
   * @param {number=} limit - number of deleted message ids to fetch
   *
   * @returns {Tinode.MetaGetBuilder} <code>this</code> object.
   */
  withDel: function(since, limit) {
    if (since || limit) {
      this.what['del'] = {
        since: since,
        limit: limit
      };
    }
    return this;
  },

  /**
   * Add query parameters to fetch messages deleted after the saved <code>'del'</code> id.
   * @memberof Tinode.MetaGetBuilder#
   *
   * @param {number=} limit - number of deleted message ids to fetch
   *
   * @returns {Tinode.MetaGetBuilder} <code>this</code> object.
   */
  withLaterDel: function(limit) {
    // Specify 'since' only if we have already received some messages. If
    // we have no locally cached messages then we don't care if any messages were deleted.
    return this.withDel(this.topic._maxSeq > 0 ? this.topic._maxDel + 1 : undefined, limit);
  },

  /**
   * Construct parameters.
   * @memberof Tinode.MetaGetBuilder#
   *
   * @returns {Tinode.GetQuery} Get query
   */
  build: function() {
    const what = [];
    const instance = this;
    let params = {};
    ['data', 'sub', 'desc', 'tags', 'cred', 'del'].map(function(key) {
      if (instance.what.hasOwnProperty(key)) {
        what.push(key);
        if (Object.getOwnPropertyNames(instance.what[key]).length > 0) {
          params[key] = instance.what[key];
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
};

/**
 * Helper class for handling access mode.
 *
 * @class AccessMode
 * @memberof Tinode
 *
 * @param {AccessMode|Object=} acs - AccessMode to copy or access mode object received from the server.
 */
var AccessMode = function(acs) {
  if (acs) {
    this.given = typeof acs.given == 'number' ? acs.given : AccessMode.decode(acs.given);
    this.want = typeof acs.want == 'number' ? acs.want : AccessMode.decode(acs.want);
    this.mode = acs.mode ? (typeof acs.mode == 'number' ? acs.mode : AccessMode.decode(acs.mode)) :
      (this.given & this.want);
  }
};

AccessMode._NONE = 0x00;
AccessMode._JOIN = 0x01;
AccessMode._READ = 0x02;
AccessMode._WRITE = 0x04;
AccessMode._PRES = 0x08;
AccessMode._APPROVE = 0x10;
AccessMode._SHARE = 0x20;
AccessMode._DELETE = 0x40;
AccessMode._OWNER = 0x80;

AccessMode._BITMASK = AccessMode._JOIN | AccessMode._READ | AccessMode._WRITE | AccessMode._PRES |
  AccessMode._APPROVE | AccessMode._SHARE | AccessMode._DELETE | AccessMode._OWNER;
AccessMode._INVALID = 0x100000;

AccessMode._checkFlag = function(val, side, flag) {
  side = side || 'mode';
  if (['given', 'want', 'mode'].includes(side)) {
    return ((val[side] & flag) != 0);
  }
  throw new Error(`Invalid AccessMode component '${side}'`);
}

/**
 * Parse string into an access mode value.
 * @memberof Tinode.AccessMode
 * @static
 *
 * @param {string | Number} mode - either a String representation of the access mode to parse or a set of bits to assign.
 * @returns {number} - Access mode as a numeric value.
 */
AccessMode.decode = function(str) {
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
      // Unrecognized bit, skip.
      continue;
    }
    m0 |= bit;
  }
  return m0;
};

/**
 * Convert numeric representation of the access mode into a string.
 *
 * @memberof Tinode.AccessMode
 * @static
 *
 * @param {number} val - access mode value to convert to a string.
 * @returns {string} - Access mode as a string.
 */
AccessMode.encode = function(val) {
  if (val === null || val === AccessMode._INVALID) {
    return null;
  } else if (val === AccessMode._NONE) {
    return 'N';
  }

  const bitmask = ['J', 'R', 'W', 'P', 'A', 'S', 'D', 'O'];
  let res = '';
  for (let i = 0; i < bitmask.length; i++) {
    if ((val & (1 << i)) != 0) {
      res = res + bitmask[i];
    }
  }
  return res;
};

/**
 * Update numeric representation of access mode with the new value. The value
 * is one of the following:
 *  - a string starting with <code>'+'</code> or <code>'-'</code> then the bits to add or remove, e.g. <code>'+R-W'</code> or <code>'-PS'</code>.
 *  - a new value of access mode
 *
 * @memberof Tinode.AccessMode
 * @static
 *
 * @param {number} val - access mode value to update.
 * @param {string} upd - update to apply to val.
 * @returns {number} - updated access mode.
 */
AccessMode.update = function(val, upd) {
  if (!upd || typeof upd != 'string') {
    return val;
  }

  let action = upd.charAt(0);
  if (action == '+' || action == '-') {
    let val0 = val;
    // Split delta-string like '+ABC-DEF+Z' into an array of parts including + and -.
    const parts = upd.split(/([-+])/);
    // Starting iteration from 1 because String.split() creates an array with the first empty element.
    // Iterating by 2 because we parse pairs +/- then data.
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
    // The string is an explicit new value 'ABC' rather than delta.
    const val0 = AccessMode.decode(upd);
    if (val0 != AccessMode._INVALID) {
      val = val0;
    }
  }

  return val;
};

/**
 * Bits present in a1 but missing in a2.
 *
 * @static
 * @memberof Tinode
 *
 * @param {number | string} a1 - access mode to subtract from.
 * @param {number | string} a2 - access mode to subtract.
 * @returns {number} access mode with bits present in <code>a1</code> but missing in <code>a2</code>.
 */
AccessMode.diff = function(a1, a2) {
  a1 = AccessMode.decode(a1);
  a2 = AccessMode.decode(a2);

  if (a1 == AccessMode._INVALID || a2 == AccessMode._INVALID) {
    return AccessMode._INVALID;
  }
  return a1 & ~a2;
};

/**
 * AccessMode is a class representing topic access mode.
 *
 * @memberof Tinode
 * @class AccessMode
 */
AccessMode.prototype = {
  /**
   * Custom formatter
   */
  toString: function() {
    return '{"mode": "' + AccessMode.encode(this.mode) +
      '", "given": "' + AccessMode.encode(this.given) +
      '", "want": "' + AccessMode.encode(this.want) + '"}';
  },
  /**
   * Converts numeric values to strings.
   */
  jsonHelper: function() {
    return {
      mode: AccessMode.encode(this.mode),
      given: AccessMode.encode(this.given),
      want: AccessMode.encode(this.want)
    };
  },
  /**
   * Assign value to 'mode'.
   * @memberof Tinode.AccessMode
   *
   * @param {string | Number} m - either a string representation of the access mode or a set of bits.
   * @returns {AccessMode} - <code>this</code> AccessMode.
   */
  setMode: function(m) {
    this.mode = AccessMode.decode(m);
    return this;
  },
  /**
   * Update <code>mode</code> value.
   * @memberof Tinode.AccessMode
   *
   * @param {string} u - string representation of the changes to apply to access mode.
   * @returns {AccessMode} - <code>this</code> AccessMode.
   */
  updateMode: function(u) {
    this.mode = AccessMode.update(this.mode, u);
    return this;
  },
  /**
   * Get <code>mode</code> value as a string.
   * @memberof Tinode.AccessMode
   *
   * @returns {string} - <code>mode</code> value.
   */
  getMode: function() {
    return AccessMode.encode(this.mode);
  },

  /**
   * Assign <code>given</code>  value.
   * @memberof Tinode.AccessMode
   *
   * @param {string | Number} g - either a string representation of the access mode or a set of bits.
   * @returns {AccessMode} - <code>this</code> AccessMode.
   */
  setGiven: function(g) {
    this.given = AccessMode.decode(g);
    return this;
  },
  /**
   * Update 'given' value.
   * @memberof Tinode.AccessMode
   *
   * @param {string} u - string representation of the changes to apply to access mode.
   * @returns {AccessMode} - <code>this</code> AccessMode.
   */
  updateGiven: function(u) {
    this.given = AccessMode.update(this.given, u);
    return this;
  },
  /**
   * Get 'given' value as a string.
   * @memberof Tinode.AccessMode
   *
   * @returns {string} - <b>given</b> value.
   */
  getGiven: function() {
    return AccessMode.encode(this.given);
  },

  /**
   * Assign 'want' value.
   * @memberof Tinode.AccessMode
   *
   * @param {string | Number} w - either a string representation of the access mode or a set of bits.
   * @returns {AccessMode} - <code>this</code> AccessMode.
   */
  setWant: function(w) {
    this.want = AccessMode.decode(w);
    return this;
  },
  /**
   * Update 'want' value.
   * @memberof Tinode.AccessMode
   *
   * @param {string} u - string representation of the changes to apply to access mode.
   * @returns {AccessMode} - <code>this</code> AccessMode.
   */
  updateWant: function(u) {
    this.want = AccessMode.update(this.want, u);
    return this;
  },
  /**
   * Get 'want' value as a string.
   * @memberof Tinode.AccessMode
   *
   * @returns {string} - <b>want</b> value.
   */
  getWant: function() {
    return AccessMode.encode(this.want);
  },

  /**
   * Get permissions present in 'want' but missing in 'given'.
   * Inverse of {@link Tinode.AccessMode#getExcessive}
   *
   * @memberof Tinode.AccessMode
   *
   * @returns {string} permissions present in <b>want</b> but missing in <b>given</b>.
   */
  getMissing: function() {
    return AccessMode.encode(this.want & ~this.given);
  },

  /**
   * Get permissions present in 'given' but missing in 'want'.
   * Inverse of {@link Tinode.AccessMode#getMissing}
   * @memberof Tinode.AccessMode
   *
   * @returns {string} permissions present in <b>given</b> but missing in <b>want</b>.
   */
  getExcessive: function() {
    return AccessMode.encode(this.given & ~this.want);
  },

  /**
   * Update 'want', 'give', and 'mode' values.
   * @memberof Tinode.AccessMode
   *
   * @param {AccessMode} val - new access mode value.
   * @returns {AccessMode} - <code>this</code> AccessMode.
   */
  updateAll: function(val) {
    if (val) {
      this.updateGiven(val.given);
      this.updateWant(val.want);
      this.mode = this.given & this.want;
    }
    return this;
  },

  /**
   * Check if Owner (O) flag is set.
   * @memberof Tinode.AccessMode
   * @param {string=} side - which permission to check: given, want, mode; default: mode.
   * @returns {boolean} - <code>true</code> if flag is set.
   */
  isOwner: function(side) {
    return AccessMode._checkFlag(this, side, AccessMode._OWNER);
  },

  /**
   * Check if Presence (P) flag is set.
   * @memberof Tinode.AccessMode
   * @param {string=} side - which permission to check: given, want, mode; default: mode.
   * @returns {boolean} - <code>true</code> if flag is set.
   */
  isPresencer: function(side) {
    return AccessMode._checkFlag(this, side, AccessMode._PRES);
  },

  /**
   * Check if Presence (P) flag is NOT set.
   * @memberof Tinode.AccessMode
   * @param {string=} side - which permission to check: given, want, mode; default: mode.
   * @returns {boolean} - <code>true</code> if flag is set.
   */
  isMuted: function(side) {
    return !this.isPresencer(side);
  },

  /**
   * Check if Join (J) flag is set.
   * @memberof Tinode.AccessMode
   * @param {string=} side - which permission to check: given, want, mode; default: mode.
   * @returns {boolean} - <code>true</code> if flag is set.
   */
  isJoiner: function(side) {
    return AccessMode._checkFlag(this, side, AccessMode._JOIN);
  },

  /**
   * Check if Reader (R) flag is set.
   * @memberof Tinode.AccessMode
   * @param {string=} side - which permission to check: given, want, mode; default: mode.
   * @returns {boolean} - <code>true</code> if flag is set.
   */
  isReader: function(side) {
    return AccessMode._checkFlag(this, side, AccessMode._READ);
  },

  /**
   * Check if Writer (W) flag is set.
   * @memberof Tinode.AccessMode
   * @param {string=} side - which permission to check: given, want, mode; default: mode.
   * @returns {boolean} - <code>true</code> if flag is set.
   */
  isWriter: function(side) {
    return AccessMode._checkFlag(this, side, AccessMode._WRITE);
  },

  /**
   * Check if Approver (A) flag is set.
   * @memberof Tinode.AccessMode
   * @param {string=} side - which permission to check: given, want, mode; default: mode.
   * @returns {boolean} - <code>true</code> if flag is set.
   */
  isApprover: function(side) {
    return AccessMode._checkFlag(this, side, AccessMode._APPROVE);
  },

  /**
   * Check if either one of Owner (O) or Approver (A) flags is set.
   * @memberof Tinode.AccessMode
   * @param {string=} side - which permission to check: given, want, mode; default: mode.
   * @returns {boolean} - <code>true</code> if flag is set.
   */
  isAdmin: function(side) {
    return this.isOwner(side) || this.isApprover(side);
  },

  /**
   * Check if either one of Owner (O), Approver (A), or Sharer (S) flags is set.
   * @memberof Tinode.AccessMode
   * @param {string=} side - which permission to check: given, want, mode; default: mode.
   * @returns {boolean} - <code>true</code> if flag is set.
   */
  isSharer: function(side) {
    return this.isAdmin(side) || AccessMode._checkFlag(this, side, AccessMode._SHARE);
  },

  /**
   * Check if Deleter (D) flag is set.
   * @memberof Tinode.AccessMode
   * @param {string=} side - which permission to check: given, want, mode; default: mode.
   * @returns {boolean} - <code>true</code> if flag is set.
   */
  isDeleter: function(side) {
    return AccessMode._checkFlag(this, side, AccessMode._DELETE);
  }
};

/**
 * @callback Tinode.Topic.onData
 * @param {Data} data - Data packet
 */
/**
 * Topic is a class representing a logical communication channel.
 * @class Topic
 * @memberof Tinode
 *
 * @param {string} name - Name of the topic to create.
 * @param {Object=} callbacks - Object with various event callbacks.
 * @param {Tinode.Topic.onData} callbacks.onData - Callback which receives a <code>{data}</code> message.
 * @param {callback} callbacks.onMeta - Callback which receives a <code>{meta}</code> message.
 * @param {callback} callbacks.onPres - Callback which receives a <code>{pres}</code> message.
 * @param {callback} callbacks.onInfo - Callback which receives an <code>{info}</code> message.
 * @param {callback} callbacks.onMetaDesc - Callback which receives changes to topic desctioption {@link desc}.
 * @param {callback} callbacks.onMetaSub - Called for a single subscription record change.
 * @param {callback} callbacks.onSubsUpdated - Called after a batch of subscription changes have been recieved and cached.
 * @param {callback} callbacks.onDeleteTopic - Called after the topic is deleted.
 * @param {callback} callbacls.onAllMessagesReceived - Called when all requested <code>{data}</code> messages have been recived.
 */
var Topic = function(name, callbacks) {
  // Parent Tinode object.
  this._tinode = null;

  // Server-provided data, locally immutable.
  // topic name
  this.name = name;
  // timestamp when the topic was created
  this.created = null;
  // timestamp when the topic was last updated
  this.updated = null;
  // timestamp of the last messages
  this.touched = null;
  // access mode, see AccessMode
  this.acs = new AccessMode(null);
  // per-topic private data
  this.private = null;
  // per-topic public data
  this.public = null;

  // Locally cached data
  // Subscribed users, for tracking read/recv/msg notifications.
  this._users = {};

  // Current value of locally issued seqId, used for pending messages.
  this._queuedSeqId = LOCAL_SEQID;

  // The maximum known {data.seq} value.
  this._maxSeq = 0;
  // The minimum known {data.seq} value.
  this._minSeq = 0;
  // Indicator that the last request for earlier messages returned 0.
  this._noEarlierMsgs = false;
  // The maximum known deletion ID.
  this._maxDel = 0;
  // User discovery tags
  this._tags = [];
  // Credentials such as email or phone number.
  this._credentials = [];
  // Message cache, sorted by message seq values, from old to new.
  this._messages = CBuffer(function(a, b) {
    return a.seq - b.seq;
  }, true);
  // Boolean, true if the topic is currently live
  this._subscribed = false;
  // Timestap when topic meta-desc update was recived.
  this._lastDescUpdate = null;
  // Timestap when topic meta-subs update was recived.
  this._lastSubsUpdate = null;
  // Topic created but not yet synced with the server. Used only during initialization.
  this._new = true;

  // Callbacks
  if (callbacks) {
    this.onData = callbacks.onData;
    this.onMeta = callbacks.onMeta;
    this.onPres = callbacks.onPres;
    this.onInfo = callbacks.onInfo;
    // A single desc update;
    this.onMetaDesc = callbacks.onMetaDesc;
    // A single subscription record;
    this.onMetaSub = callbacks.onMetaSub;
    // All subscription records received;
    this.onSubsUpdated = callbacks.onSubsUpdated;
    this.onTagsUpdated = callbacks.onTagsUpdated;
    this.onCredsUpdated = callbacks.onCredsUpdated;
    this.onDeleteTopic = callbacks.onDeleteTopic;
    this.onAllMessagesReceived = callbacks.onAllMessagesReceived;
  }
};

Topic.prototype = {
  /**
   * Check if the topic is subscribed.
   * @memberof Tinode.Topic#
   * @returns {boolean} True is topic is attached/subscribed, false otherwise.
   */
  isSubscribed: function() {
    return this._subscribed;
  },

  /**
   * Request topic to subscribe. Wrapper for {@link Tinode#subscribe}.
   * @memberof Tinode.Topic#
   *
   * @param {Tinode.GetQuery=} getParams - get query parameters.
   * @param {Tinode.SetParams=} setParams - set parameters.
   * @returns {Promise} Promise to be resolved/rejected when the server responds to the request.
   */
  subscribe: function(getParams, setParams) {
    // If the topic is already subscribed, return resolved promise
    if (this._subscribed) {
      return Promise.resolve(this);
    }

    // Send subscribe message, handle async response.
    // If topic name is explicitly provided, use it. If no name, then it's a new group topic,
    // use "new".
    return this._tinode.subscribe(this.name || TOPIC_NEW, getParams, setParams).then((ctrl) => {
      if (ctrl.code >= 300) {
        // Do nothing if subscription status has not changed.
        return ctrl;
      }

      this._subscribed = true;
      this.acs = (ctrl.params && ctrl.params.acs) ? ctrl.params.acs : this.acs;

      // Set topic name for new topics and add it to cache.
      if (this._new) {
        this._new = false;

        // Name may change new123456 -> grpAbCdEf
        this.name = ctrl.topic;

        this.created = ctrl.ts;
        this.updated = ctrl.ts;
        // Don't assign touched, otherwise topic will be put on top of the list on subscribe.

        this._cachePutSelf();

        if (this.name != TOPIC_ME && this.name != TOPIC_FND) {
          // Add the new topic to the list of contacts maintained by the 'me' topic.
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
  },

  /**
   * Create a draft of a message without sending it to the server.
   * @memberof Tinode.Topic#
   *
   * @param {string | Object} data - Content to wrap in a draft.
   * @param {boolean=} noEcho - If <code>true</code> server will not echo message back to originating
   * session. Otherwise the server will send a copy of the message to sender.
   *
   * @returns {Object} message draft.
   */
  createMessage: function(data, noEcho) {
    return this._tinode.createMessage(this.name, data, noEcho);
  },

  /**
   * Immediately publish data to topic. Wrapper for {@link Tinode#publish}.
   * @memberof Tinode.Topic#
   *
   * @param {string | Object} data - Data to publish, either plain string or a Drafty object.
   * @param {boolean=} noEcho - If <code>true</code> server will not echo message back to originating
   * @returns {Promise} Promise to be resolved/rejected when the server responds to the request.
   */
  publish: function(data, noEcho) {
    return this.publishMessage(this.createMessage(data, noEcho));
  },

  /**
   * Publish message created by {@link Tinode.Topic#createMessage}.
   * @memberof Tinode.Topic#
   *
   * @param {Object} pub - {data} object to publish. Must be created by {@link Tinode.Topic#createMessage}
   *
   * @returns {Promise} Promise to be resolved/rejected when the server responds to the request.
   */
  publishMessage: function(pub) {
    if (!this._subscribed) {
      return Promise.reject(new Error("Cannot publish on inactive topic"));
    }

    // Update header with attachment records.
    if (Drafty.hasAttachments(pub.content) && !pub.head.attachments) {
      let attachments = [];
      Drafty.attachments(pub.content, (data) => {
        attachments.push(data.ref);
      });
      pub.head.attachments = attachments;
    }

    // Send data.
    pub._sending = true;
    pub._failed = false;
    return this._tinode.publishMessage(pub).then((ctrl) => {
      pub._sending = false;
      pub.ts = ctrl.ts;
      this.swapMessageId(pub, ctrl.params.seq);
      this._routeData(pub);
      return ctrl;
    }).catch((err) => {
      this._tinode.logger("WARNING: Message rejected by the server", err);
      pub._sending = false;
      pub._failed = true;
      if (this.onData) {
        this.onData();
      }
    });
  },

  /**
   * Add message to local message cache, send to the server when the promise is resolved.
   * If promise is null or undefined, the message will be sent immediately.
   * The message is sent when the
   * The message should be created by {@link Tinode.Topic#createMessage}.
   * This is probably not the final API.
   * @memberof Tinode.Topic#
   *
   * @param {Object} pub - Message to use as a draft.
   * @param {Promise} prom - Message will be sent when this promise is resolved, discarded if rejected.
   *
   * @returns {Promise} derived promise.
   */
  publishDraft: function(pub, prom) {
    if (!prom && !this._subscribed) {
      return Promise.reject(new Error("Cannot publish on inactive topic"));
    }

    const seq = pub.seq || this._getQueuedSeqId();
    if (!pub._noForwarding) {
      // The 'seq', 'ts', and 'from' are added to mimic {data}. They are removed later
      // before the message is sent.

      pub._noForwarding = true;
      pub.seq = seq;
      pub.ts = new Date();
      pub.from = this._tinode.getCurrentUserID();

      // Don't need an echo message because the message is added to local cache right away.
      pub.noecho = true;
      // Add to cache.
      this._messages.put(pub);
      this._tinode._db.addMessage(pub);

      if (this.onData) {
        this.onData(pub);
      }
    }
    // If promise is provided, send the queued message when it's resolved.
    // If no promise is provided, create a resolved one and send immediately.
    prom = (prom || Promise.resolve()).then(
      ( /* argument ignored */ ) => {
        if (pub._cancelled) {
          return {
            code: 300,
            text: "cancelled"
          };
        }
        return this.publishMessage(pub);
      },
      (err) => {
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
  },

  /**
   * Leave the topic, optionally unsibscribe. Leaving the topic means the topic will stop
   * receiving updates from the server. Unsubscribing will terminate user's relationship with the topic.
   * Wrapper for {@link Tinode#leave}.
   * @memberof Tinode.Topic#
   *
   * @param {boolean=} unsub - If true, unsubscribe, otherwise just leave.
   * @returns {Promise} Promise to be resolved/rejected when the server responds to the request.
   */
  leave: function(unsub) {
    // It's possible to unsubscribe (unsub==true) from inactive topic.
    if (!this._subscribed && !unsub) {
      return Promise.reject(new Error("Cannot leave inactive topic"));
    }

    // Send a 'leave' message, handle async response
    return this._tinode.leave(this.name, unsub).then((ctrl) => {
      this._resetSub();
      if (unsub) {
        this._tinode._db.remTopic(this.name);
        this._tinode.cacheDel('topic', this.name);
        this._gone();
      }
      return ctrl;
    });
  },

  /**
   * Request topic metadata from the server.
   * @memberof Tinode.Topic#
   *
   * @param {Tinode.GetQuery} request parameters
   *
   * @returns {Promise} Promise to be resolved/rejected when the server responds to request.
   */
  getMeta: function(params) {
    // Send {get} message, return promise.
    return this._tinode.getMeta(this.name, params);
  },

  /**
   * Request more messages from the server
   * @memberof Tinode.Topic#
   *
   * @param {number} limit number of messages to get.
   * @param {boolean} forward if true, request newer messages.
   */
  getMessagesPage: function(limit, forward) {
    const query = this.startMetaQuery();
    if (forward) {
      query.withLaterData(limit);
    } else {
      query.withEarlierData(limit);
    }
    let promise = this.getMeta(query.build());
    if (!forward) {
      promise = promise.then((ctrl) => {
        if (ctrl && ctrl.params && !ctrl.params.count) {
          this._noEarlierMsgs = true;
        }
      });
    }
    return promise;
  },

  /**
   * Update topic metadata.
   * @memberof Tinode.Topic#
   *
   * @param {Tinode.SetParams} params parameters to update.
   * @returns {Promise} Promise to be resolved/rejected when the server responds to request.
   */
  setMeta: function(params) {
    if (params.tags) {
      params.tags = normalizeArray(params.tags);
    }
    // Send Set message, handle async response.
    return this._tinode.setMeta(this.name, params)
      .then((ctrl) => {
        if (ctrl && ctrl.code >= 300) {
          // Not modified
          return ctrl;
        }

        if (params.sub) {
          params.sub.topic = this.name;
          if (ctrl.params && ctrl.params.acs) {
            params.sub.acs = ctrl.params.acs;
            params.sub.updated = ctrl.ts;
          }
          if (!params.sub.user) {
            // This is a subscription update of the current user.
            // Assign user ID otherwise the update will be ignored by _processMetaSub.
            params.sub.user = this._tinode.getCurrentUserID();
            if (!params.desc) {
              // Force update to topic's asc.
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
  },

  /**
   * Update access mode of the current user or of another topic subsriber.
   * @memberof Tinode.Topic#
   *
   * @param {string} uid - UID of the user to update or null to update current user.
   * @param {string} update - the update value, full or delta.
   * @returns {Promise} Promise to be resolved/rejected when the server responds to request.
   */
  updateMode: function(uid, update) {
    const user = uid ? this.subscriber(uid) : null;
    const am = user ?
      user.acs.updateGiven(update).getGiven() :
      this.getAccessMode().updateWant(update).getWant();

    return this.setMeta({
      sub: {
        user: uid,
        mode: am
      }
    });
  },

  /**
   * Create new topic subscription. Wrapper for {@link Tinode#setMeta}.
   * @memberof Tinode.Topic#
   *
   * @param {string} uid - ID of the user to invite
   * @param {string=} mode - Access mode. <code>null</code> means to use default.
   *
   * @returns {Promise} Promise to be resolved/rejected when the server responds to request.
   */
  invite: function(uid, mode) {
    return this.setMeta({
      sub: {
        user: uid,
        mode: mode
      }
    });
  },

  /**
   * Archive or un-archive the topic. Wrapper for {@link Tinode#setMeta}.
   * @memberof Tinode.Topic#
   *
   * @param {boolean} arch - true to archive the topic, false otherwise.
   *
   * @returns {Promise} Promise to be resolved/rejected when the server responds to request.
   */
  archive: function(arch) {
    if (this.private && this.private.arch == arch) {
      return Promise.resolve(arch);
    }
    return this.setMeta({
      desc: {
        private: {
          arch: arch ? true : Tinode.DEL_CHAR
        }
      }
    });
  },

  /**
   * Delete messages. Hard-deleting messages requires Owner permission.
   * Wrapper for {@link Tinode#delMessages}.
   * @memberof Tinode.Topic#
   *
   * @param {Tinode.DelRange[]} ranges - Ranges of message IDs to delete.
   * @param {boolean=} hard - Hard or soft delete
   * @returns {Promise} Promise to be resolved/rejected when the server responds to request.
   */
  delMessages: function(ranges, hard) {
    if (!this._subscribed) {
      return Promise.reject(new Error("Cannot delete messages in inactive topic"));
    }

    // Sort ranges in accending order by low, the descending by hi.
    ranges.sort((r1, r2) => {
      if (r1.low < r2.low) {
        return true;
      }
      if (r1.low == r2.low) {
        return !r2.hi || (r1.hi >= r2.hi);
      }
      return false;
    });

    // Remove pending messages from ranges possibly clipping some ranges.
    let tosend = ranges.reduce((out, r) => {
      if (r.low < LOCAL_SEQID) {
        if (!r.hi || r.hi < LOCAL_SEQID) {
          out.push(r);
        } else {
          // Clip hi to max allowed value.
          out.push({
            low: r.low,
            hi: this._maxSeq + 1
          });
        }
      }
      return out;
    }, []);

    // Send {del} message, return promise
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
    // Update local cache.
    return result.then((ctrl) => {
      if (ctrl.params.del > this._maxDel) {
        this._maxDel = ctrl.params.del;
      }

      ranges.map((r) => {
        if (r.hi) {
          this.flushMessageRange(r.low, r.hi);
        } else {
          this.flushMessage(r.low);
        }
      });

      this._updateDeletedRanges();

      if (this.onData) {
        // Calling with no parameters to indicate the messages were deleted.
        this.onData();
      }
      return ctrl;
    });
  },

  /**
   * Delete all messages. Hard-deleting messages requires Owner permission.
   * @memberof Tinode.Topic#
   *
   * @param {boolean} hardDel - true if messages should be hard-deleted.
   *
   * @returns {Promise} Promise to be resolved/rejected when the server responds to request.
   */
  delMessagesAll: function(hardDel) {
    if (!this._maxSeq || this._maxSeq <= 0) {
      // There are no messages to delete.
      return Promise.resolve();
    }
    return this.delMessages([{
      low: 1,
      hi: this._maxSeq + 1,
      _all: true
    }], hardDel);
  },

  /**
   * Delete multiple messages defined by their IDs. Hard-deleting messages requires Owner permission.
   * @memberof Tinode.Topic#
   *
   * @param {Tinode.DelRange[]} list - list of seq IDs to delete
   * @param {boolean=} hardDel - true if messages should be hard-deleted.
   *
   * @returns {Promise} Promise to be resolved/rejected when the server responds to request.
   */
  delMessagesList: function(list, hardDel) {
    // Sort the list in ascending order
    list.sort((a, b) => a - b);
    // Convert the array of IDs to ranges.
    let ranges = list.reduce((out, id) => {
      if (out.length == 0) {
        // First element.
        out.push({
          low: id
        });
      } else {
        let prev = out[out.length - 1];
        if ((!prev.hi && (id != prev.low + 1)) || (id > prev.hi)) {
          // New range.
          out.push({
            low: id
          });
        } else {
          // Expand existing range.
          prev.hi = prev.hi ? Math.max(prev.hi, id + 1) : id + 1;
        }
      }
      return out;
    }, []);
    // Send {del} message, return promise
    return this.delMessages(ranges, hardDel)
  },

  /**
   * Delete topic. Requires Owner permission. Wrapper for {@link Tinode#delTopic}.
   * @memberof Tinode.Topic#
   *
   * @param {boolean} hard - had-delete topic.
   * @returns {Promise} Promise to be resolved/rejected when the server responds to the request.
   */
  delTopic: function(hard) {
    return this._tinode.delTopic(this.name, hard).then((ctrl) => {
      this._resetSub();
      this._gone();
      return ctrl;
    });
  },

  /**
   * Delete subscription. Requires Share permission. Wrapper for {@link Tinode#delSubscription}.
   * @memberof Tinode.Topic#
   *
   * @param {string} user - ID of the user to remove subscription for.
   * @returns {Promise} Promise to be resolved/rejected when the server responds to request.
   */
  delSubscription: function(user) {
    if (!this._subscribed) {
      return Promise.reject(new Error("Cannot delete subscription in inactive topic"));
    }
    // Send {del} message, return promise
    return this._tinode.delSubscription(this.name, user).then((ctrl) => {
      // Remove the object from the subscription cache;
      delete this._users[user];
      // Notify listeners
      if (this.onSubsUpdated) {
        this.onSubsUpdated(Object.keys(this._users));
      }
      return ctrl;
    });
  },

  /**
   * Send a read/recv notification.
   * @memberof Tinode.Topic#
   *
   * @param {string} what - what notification to send: <code>recv</code>, <code>read</code>.
   * @param {number} seq - ID or the message read or received.
   */
  note: function(what, seq) {
    if (!this._subscribed) {
      // Cannot sending {note} on an inactive topic".
      return;
    }

    // Update local cache with the new count.
    const user = this._users[this._tinode.getCurrentUserID()];
    let update = false;
    if (user) {
      // Self-subscription is found.
      if (!user[what] || user[what] < seq) {
        user[what] = seq;
        update = true;
      }
    } else {
      // Self-subscription is not found.
      update = (this[what] | 0) < seq;
    }

    if (update) {
      // Send notification to the server.
      this._tinode.note(this.name, what, seq);
      // Update locally cached contact with the new count.
      this._updateReadRecv(what, seq);

      if (this.acs != null && !this.acs.isMuted()) {
        const me = this._tinode.getMeTopic();
        // Sent a notification to 'me' listeners.
        me._refreshContact(what, this);
      }
    }
  },

  /**
   * Send a 'recv' receipt. Wrapper for {@link Tinode#noteRecv}.
   * @memberof Tinode.Topic#
   *
   * @param {number} seq - ID of the message to aknowledge.
   */
  noteRecv: function(seq) {
    this.note('recv', seq);
  },

  /**
   * Send a 'read' receipt. Wrapper for {@link Tinode#noteRead}.
   * @memberof Tinode.Topic#
   *
   * @param {number} seq - ID of the message to aknowledge or 0/undefined to acknowledge the latest messages.
   */
  noteRead: function(seq) {
    seq = seq || this._maxSeq;
    if (seq > 0) {
      this.note('read', seq);
    }
  },

  /**
   * Send a key-press notification. Wrapper for {@link Tinode#noteKeyPress}.
   * @memberof Tinode.Topic#
   */
  noteKeyPress: function() {
    if (this._subscribed) {
      this._tinode.noteKeyPress(this.name);
    } else {
      this._tinode.logger("INFO: Cannot send notification in inactive topic");
    }
  },

  // Update cached read/recv/unread counts.
  _updateReadRecv: function(what, seq, ts) {
    let oldVal, doUpdate = false;

    seq = seq | 0;
    this.seq = this.seq | 0;
    this.read = this.read | 0;
    this.recv = this.recv | 0;
    switch (what) {
      case 'recv':
        oldVal = this.recv;
        this.recv = Math.max(this.recv, seq);
        doUpdate = (oldVal != this.recv);
        break;
      case 'read':
        oldVal = this.read;
        this.read = Math.max(this.read, seq);
        doUpdate = (oldVal != this.read);
        break;
      case 'msg':
        oldVal = this.seq;
        this.seq = Math.max(this.seq, seq);
        if (!this.touched || this.touched < ts) {
          this.touched = ts;
        }
        doUpdate = (oldVal != this.seq);
        break;
    }

    // Sanity checks.
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
  },

  /**
   * Get user description from global cache. The user does not need to be a
   * subscriber of this topic.
   * @memberof Tinode.Topic#
   *
   * @param {string} uid - ID of the user to fetch.
   * @return {Object} user description or undefined.
   */
  userDesc: function(uid) {
    // TODO(gene): handle asynchronous requests

    const user = this._cacheGetUser(uid);
    if (user) {
      return user; // Promise.resolve(user)
    }
  },

  /**
   * Get description of the p2p peer from subscription cache.
   * @memberof Tinode.Topic#
   *
   * @return {Object} peer's description or undefined.
   */
  p2pPeerDesc: function() {
    if (!this.isP2PType()) {
      return undefined;
    }
    return this._users[this.name];
  },

  /**
   * Iterate over cached subscribers. If callback is undefined, use this.onMetaSub.
   * @memberof Tinode.Topic#
   *
   * @param {function} callback - Callback which will receive subscribers one by one.
   * @param {Object=} context - Value of `this` inside the `callback`.
   */
  subscribers: function(callback, context) {
    const cb = (callback || this.onMetaSub);
    if (cb) {
      for (let idx in this._users) {
        cb.call(context, this._users[idx], idx, this._users);
      }
    }
  },

  /**
   * Get a copy of cached tags.
   * @memberof Tinode.Topic#
   *
   * @return {Array.<string>} a copy of tags
   */
  tags: function() {
    // Return a copy.
    return this._tags.slice(0);
  },

  /**
   * Get cached subscription for the given user ID.
   * @memberof Tinode.Topic#
   *
   * @param {string} uid - id of the user to query for
   * @return user description or undefined.
   */
  subscriber: function(uid) {
    return this._users[uid];
  },

  /**
   * Iterate over cached messages. If callback is undefined, use this.onData.
   * @memberof Tinode.Topic#
   *
   * @param {function} callback - Callback which will receive messages one by one. See {@link Tinode.CBuffer#forEach}
   * @param {number} sinceId - Optional seqId to start iterating from (inclusive).
   * @param {number} beforeId - Optional seqId to stop iterating before (exclusive).
   * @param {Object} context - Value of `this` inside the `callback`.
   */
  messages: function(callback, sinceId, beforeId, context) {
    const cb = (callback || this.onData);
    if (cb) {
      let startIdx = typeof sinceId == 'number' ? this._messages.find({
        seq: sinceId
      }, true) : undefined;
      let beforeIdx = typeof beforeId == 'number' ? this._messages.find({
        seq: beforeId
      }, true) : undefined;
      if (startIdx != -1 && beforeIdx != -1) {
        this._messages.forEach(cb, startIdx, beforeIdx, context);
      }
    }
  },

  /**
   * Get the most recent message from cache.
   * @memberof Tinode.Topic#
   *
   * @returns {Object} the most recent cached message or <code>undefined</code>, if no messages are cached.
   */
  latestMessage: function() {
    return this._messages.getLast();
  },

  /**
   * Iterate over cached unsent messages. Wraps {@link Tinode.Topic#messages}.
   * @memberof Tinode.Topic#
   *
   * @param {function} callback - Callback which will receive messages one by one. See {@link Tinode.CBuffer#forEach}
   * @param {Object} context - Value of <code>this</code> inside the <code>callback</code>.
   */
  queuedMessages: function(callback, context) {
    if (!callback) {
      throw new Error("Callback must be provided");
    }
    this.messages(callback, LOCAL_SEQID, undefined, context);
  },

  /**
   * Get the number of topic subscribers who marked this message as either recv or read
   * Current user is excluded from the count.
   * @memberof Tinode.Topic#
   *
   * @param {string} what - what action to consider: received <code>"recv"</code> or read <code>"read"</code>.
   * @param {number} seq - ID or the message read or received.
   *
   * @returns {number} the number of subscribers who marked the message with the given ID as read or received.
   */
  msgReceiptCount: function(what, seq) {
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
  },

  /**
   * Get the number of topic subscribers who marked this message (and all older messages) as read.
   * The current user is excluded from the count.
   * @memberof Tinode.Topic#
   *
   * @param {number} seq - message id to check.
   * @returns {number} number of subscribers who claim to have received the message.
   */
  msgReadCount: function(seq) {
    return this.msgReceiptCount('read', seq);
  },

  /**
   * Get the number of topic subscribers who marked this message (and all older messages) as received.
   * The current user is excluded from the count.
   * @memberof Tinode.Topic#
   *
   * @param {number} seq - Message id to check.
   * @returns {number} Number of subscribers who claim to have received the message.
   */
  msgRecvCount: function(seq) {
    return this.msgReceiptCount('recv', seq);
  },

  /**
   * Check if cached message IDs indicate that the server may have more messages.
   * @memberof Tinode.Topic#
   *
   * @param {boolean} newer - if <code>true</code>, check for newer messages only.
   */
  msgHasMoreMessages: function(newer) {
    return newer ? this.seq > this._maxSeq :
      // _minSeq could be more than 1, but earlier messages could have been deleted.
      (this._minSeq > 1 && !this._noEarlierMsgs);
  },

  /**
   * Check if the given seq Id is id of the most recent message.
   * @memberof Tinode.Topic#
   *
   * @param {number} seqId id of the message to check
   */
  isNewMessage: function(seqId) {
    return this._maxSeq <= seqId;
  },

  /**
   * Remove one message from local cache.
   * @memberof Tinode.Topic#
   *
   * @param {number} seqId id of the message to remove from cache.
   * @returns {Message} removed message or undefined if such message was not found.
   */
  flushMessage: function(seqId) {
    const idx = this._messages.find({
      seq: seqId
    });
    if (idx >= 0) {
      this._tinode._db.remMessages(this.name, seqId);
      return this._messages.delAt(idx);
    }
    return undefined;
  },

  /**
   * Update message's seqId.
   * @memberof Tinode.Topic#
   *
   * @param {Object} pub message object.
   * @param {number} newSeqId new seq id for pub.
   */
  swapMessageId: function(pub, newSeqId) {
    const idx = this._messages.find(pub);
    const numMessages = this._messages.length();
    if (0 <= idx && idx < numMessages) {
      // Remove message with the old seq ID.
      this._messages.delAt(idx);
      this._tinode._db.remMessages(this.name, pub.seq);
      // Add message with the new seq ID.
      pub.seq = newSeqId;
      this._messages.put(pub);
      this._tinode._db.addMessage(pub);
    }
  },

  /**
   * Remove a range of messages from the local cache.
   * @memberof Tinode.Topic#
   *
   * @param {number} fromId seq ID of the first message to remove (inclusive).
   * @param {number} untilId seqID of the last message to remove (exclusive).
   *
   * @returns {Message[]} array of removed messages (could be empty).
   */
  flushMessageRange: function(fromId, untilId) {
    // Remove range from persistent cache.
    this._tinode._db.remMessages(this.name, fromId, untilId);
    // start, end: find insertion points (nearest == true).
    const since = this._messages.find({
      seq: fromId
    }, true);
    return since >= 0 ? this._messages.delRange(since, this._messages.find({
      seq: untilId
    }, true)) : [];
  },

  /**
   * Attempt to stop message from being sent.
   * @memberof Tinode.Topic#
   *
   * @param {number} seqId id of the message to stop sending and remove from cache.
   *
   * @returns {boolean} <code>true</code> if message was cancelled, <code>false</code> otherwise.
   */
  cancelSend: function(seqId) {
    const idx = this._messages.find({
      seq: seqId
    });
    if (idx >= 0) {
      const msg = this._messages.getAt(idx);
      const status = this.msgStatus(msg);
      if (status == MESSAGE_STATUS_QUEUED || status == MESSAGE_STATUS_FAILED) {
        this._tinode._db.remMessages(this.name, seqId);
        msg._cancelled = true;
        this._messages.delAt(idx);
        if (this.onData) {
          // Calling with no parameters to indicate the message was deleted.
          this.onData();
        }
        return true;
      }
    }
    return false;
  },

  /**
   * Get type of the topic: me, p2p, grp, fnd...
   * @memberof Tinode.Topic#
   *
   * @returns {string} One of 'me', 'p2p', 'grp', 'fnd', 'sys' or <code>undefined</code>.
   */
  getType: function() {
    return Tinode.topicType(this.name);
  },

  /**
   * Get current user's access mode of the topic.
   * @memberof Tinode.Topic#
   *
   * @returns {Tinode.AccessMode} - user's access mode
   */
  getAccessMode: function() {
    return this.acs;
  },

  /**
   * Set current user's access mode of the topic.
   * @memberof Tinode.Topic#
   *
   * @param {AccessMode | Object} acs - access mode to set.
   */
  setAccessMode: function(acs) {
    return this.acs = new AccessMode(acs);
  },

  /**
   * Get topic's default access mode.
   * @memberof Tinode.Topic#
   *
   * @returns {Tinode.DefAcs} - access mode, such as {auth: `RWP`, anon: `N`}.
   */
  getDefaultAccess: function() {
    return this.defacs;
  },

  /**
   * Initialize new meta {@link Tinode.GetQuery} builder. The query is attched to the current topic.
   * It will not work correctly if used with a different topic.
   * @memberof Tinode.Topic#
   *
   * @returns {Tinode.MetaGetBuilder} query attached to the current topic.
   */
  startMetaQuery: function() {
    return new MetaGetBuilder(this);
  },

  /**
   * Check if topic is archived, i.e. private.arch == true.
   * @memberof Tinode.Topic#
   *
   * @returns {boolean} - <code>true</code> if topic is archived, <code>false</code> otherwise.
   */
  isArchived: function() {
    return this.private && this.private.arch ? true : false;
  },

  /**
   * Check if topic is a 'me' topic.
   * @memberof Tinode.Topic#
   *
   * @returns {boolean} - <code>true</code> if topic is a 'me' topic, <code>false</code> otherwise.
   */
  isMeType: function() {
    return Tinode.isMeTopicName(this.name);
  },

  /**
   * Check if topic is a channel.
   * @memberof Tinode.Topic#
   *
   * @returns {boolean} - <code>true</code> if topic is a channel, <code>false</code> otherwise.
   */
  isChannelType: function() {
    return Tinode.isChannelTopicName(this.name);
  },

  /**
   * Check if topic is a group topic.
   * @memberof Tinode.Topic#
   *
   * @returns {boolean} - <code>true</code> if topic is a group, <code>false</code> otherwise.
   */
  isGroupType: function() {
    return Tinode.isGroupTopicName(this.name);
  },

  /**
   * Check if topic is a p2p topic.
   * @memberof Tinode.Topic#
   *
   * @returns {boolean} - <code>true</code> if topic is a p2p topic, <code>false</code> otherwise.
   */
  isP2PType: function() {
    return Tinode.isP2PTopicName(this.name);
  },

  /**
   * Check if topic is a communication topic, i.e. a group or p2p topic.
   * @memberof Tinode.Topic#
   *
   * @returns {boolean} - <code>true</code> if topic is a p2p or group topic, <code>false</code> otherwise.
   */
  isCommType: function() {
    return Tinode.isCommTopicName(this.name);
  },

  /**
   * Get status (queued, sent, received etc) of a given message in the context
   * of this topic.
   * @memberof Tinode.Topic#
   *
   * @param {Message} msg - message to check for status.
   * @param {boolean} upd - update chached message status.
   *
   * @returns message status constant.
   */
  msgStatus: function(msg, upd) {
    let status = MESSAGE_STATUS_NONE;
    if (this._tinode.isMe(msg.from)) {
      if (msg._sending) {
        status = MESSAGE_STATUS_SENDING;
      } else if (msg._failed || msg._cancelled) {
        status = MESSAGE_STATUS_FAILED;
      } else if (msg.seq >= LOCAL_SEQID) {
        status = MESSAGE_STATUS_QUEUED;
      } else if (this.msgReadCount(msg.seq) > 0) {
        status = MESSAGE_STATUS_READ;
      } else if (this.msgRecvCount(msg.seq) > 0) {
        status = MESSAGE_STATUS_RECEIVED;
      } else if (msg.seq > 0) {
        status = MESSAGE_STATUS_SENT;
      }
    } else {
      status = MESSAGE_STATUS_TO_ME;
    }

    if (upd && msg._status != status) {
      msg._status = status;
      this._tinode._db.updMessageStatus(this.name, msg.seq, status);
    }

    return status;
  },

  // Process data message
  _routeData: function(data) {
    if (data.content) {
      if (!this.touched || this.touched < data.ts) {
        this.touched = data.ts;
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

    // Update locally cached contact with the new message count.
    const what = ((!this.isChannelType() && !data.from) || this._tinode.isMe(data.from)) ? 'read' : 'msg';
    this._updateReadRecv(what, data.seq, data.ts);
    // Notify 'me' listeners of the change.
    this._tinode.getMeTopic()._refreshContact(what, this);
  },

  // Process metadata message
  _routeMeta: function(meta) {
    if (meta.desc) {
      this._lastDescUpdate = meta.ts;
      this._processMetaDesc(meta.desc);
    }
    if (meta.sub && meta.sub.length > 0) {
      this._lastSubsUpdate = meta.ts;
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
  },

  // Process presence change message
  _routePres: function(pres) {
    let user;
    switch (pres.what) {
      case 'del':
        // Delete cached messages.
        this._processDelMessages(pres.clear, pres.delseq);
        break;
      case 'on':
      case 'off':
        // Update online status of a subscription.
        user = this._users[pres.src];
        if (user) {
          user.online = pres.what == 'on';
        } else {
          this._tinode.logger("WARNING: Presence update for an unknown user", this.name, pres.src);
        }
        break;
      case 'term':
        // Attachment to topic is terminated probably due to cluster rehashing.
        this._resetSub();
        break;
      case 'acs':
        const uid = pres.src || this._tinode.getCurrentUserID();
        user = this._users[uid];
        if (!user) {
          // Update for an unknown user: notification of a new subscription.
          const acs = new AccessMode().updateAll(pres.dacs);
          if (acs && acs.mode != AccessMode._NONE) {
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
          // Known user
          user.acs.updateAll(pres.dacs);
          // Update user's access mode.
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
  },

  // Process {info} message
  _routeInfo: function(info) {
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

      // If this is an update from the current user, update the cache with the new count.
      if (this._tinode.isMe(info.from)) {
        this._updateReadRecv(info.what, info.seq);
      }

      // Notify 'me' listener of the status change.
      this._tinode.getMeTopic()._refreshContact(info.what, this);
    }
    if (this.onInfo) {
      this.onInfo(info);
    }
  },

  // Called by Tinode when meta.desc packet is received.
  // Called by 'me' topic on contact update (desc._noForwarding is true).
  _processMetaDesc: function(desc) {
    if (this.isP2PType()) {
      // Synthetic desc may include defacs for p2p topics which is useless.
      // Remove it.
      delete desc.defacs;

      // Update to p2p desc is the same as user update. Update cached user.
      this._tinode._db.updUser(this.name, desc.public);
    }

    // Copy parameters from desc object to this topic.
    mergeObj(this, desc);
    // Make sure date fields are Date().
    stringToDate(this);
    // Update persistent cache.
    this._tinode._db.updTopic(this);

    // Notify 'me' listener, if available:
    if (this.name !== TOPIC_ME && !desc._noForwarding) {
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
  },

  // Called by Tinode when meta.sub is recived or in response to received
  // {ctrl} after setMeta-sub.
  _processMetaSub: function(subs) {
    for (let idx in subs) {
      const sub = subs[idx];

      // Fill defaults.
      sub.updated = new Date(sub.updated);
      sub.deleted = sub.deleted ? new Date(sub.deleted) : null;
      sub.online = !!sub.online;

      let user = null;
      if (!sub.deleted) {
        // If this is a change to user's own permissions, update them in topic too.
        // Desc will update 'me' topic.
        if (this._tinode.isMe(sub.user) && sub.acs) {
          this._processMetaDesc({
            updated: sub.updated || new Date(),
            touched: sub.updated,
            acs: sub.acs
          });
        }
        user = this._updateCachedUser(sub.user, sub);
      } else {
        // Subscription is deleted, remove it from topic (but leave in Users cache)
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
  },

  // Called by Tinode when meta.tags is recived.
  _processMetaTags: function(tags) {
    if (tags.length == 1 && tags[0] == Tinode.DEL_CHAR) {
      tags = [];
    }
    this._tags = tags;
    if (this.onTagsUpdated) {
      this.onTagsUpdated(tags);
    }
  },

  // Do nothing for topics other than 'me'
  _processMetaCreds: function(creds) {},

  // Delete cached messages and update cached transaction IDs
  _processDelMessages: function(clear, delseq) {
    this._maxDel = Math.max(clear, this._maxDel);
    this.clear = Math.max(clear, this.clear);
    const topic = this;
    let count = 0;
    if (Array.isArray(delseq)) {
      delseq.map(function(range) {
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
  },

  // Topic is informed that the entire response to {get what=data} has been received.
  _allMessagesReceived: function(count) {
    this._updateDeletedRanges();

    if (this.onAllMessagesReceived) {
      this.onAllMessagesReceived(count);
    }
  },

  // Reset subscribed state
  _resetSub: function() {
    this._subscribed = false;
  },

  // This topic is either deleted or unsubscribed from.
  _gone: function() {
    this._messages.reset();
    this._tinode._db.remMessages(this.name);
    this._users = {};
    this.acs = new AccessMode(null);
    this.private = null;
    this.public = null;
    this._maxSeq = 0;
    this._minSeq = 0;
    this._subscribed = false;

    const me = this._tinode.getMeTopic();
    if (me) {
      me._routePres({
        _noForwarding: true,
        what: 'gone',
        topic: TOPIC_ME,
        src: this.name
      });
    }
    if (this.onDeleteTopic) {
      this.onDeleteTopic();
    }
  },

  // Update global user cache and local subscribers cache.
  // Don't call this method for non-subscribers.
  _updateCachedUser: function(uid, obj) {
    // Fetch user object from the global cache.
    // This is a clone of the stored object
    let cached = this._cacheGetUser(uid);
    cached = mergeObj(cached || {}, obj);
    // Save to global cache
    this._cachePutUser(uid, cached);
    // Save to the list of topic subsribers.
    return mergeToCache(this._users, uid, cached);
  },

  // Get local seqId for a queued message.
  _getQueuedSeqId: function() {
    return this._queuedSeqId++;
  },

  // Calculate ranges of missing messages.
  _updateDeletedRanges: function() {
    const ranges = [];

    let prev = null;
    // Check for gap in the beginning, before the first message.
    const first = this._messages.getAt(0);
    if (first && this._minSeq > 1 && !this._noEarlierMsgs) {
      // Some messages are missing in the beginning.
      if (first.hi) {
        // The first message already represents a gap.
        if (first.seq > 1) {
          first.seq = 1;
        }
        if (first.hi < this._minSeq - 1) {
          first.hi = this._minSeq - 1;
        }
        prev = first;
      } else {
        // Create new gap.
        prev = {
          seq: 1,
          hi: this._minSeq - 1
        };
        ranges.push(prev);
      }
    } else {
      // No gap in the beginning.
      prev = {
        seq: 0,
        hi: 0
      };
    }

    // Find gaps in the list of received messages. The list contains messages-proper as well
    // as placeholers for deleted ranges.
    // The messages are iterated by seq ID in ascending order.
    this._messages.forEach((data) => {
      // Do not create a gap between the last sent message and the first unsent.
      if (data.seq >= LOCAL_SEQID) {
        return;
      }

      // New message is reducing the existing gap
      if (data.seq == (prev.hi || prev.seq) + 1) {
        // No new gap. Replace previous with current.
        prev = data;
        return;
      }

      // Found a new gap.
      if (prev.hi) {
        // Previous is also a gap, alter it.
        prev.hi = data.hi || data.seq;
        return;
      }

      // Previous is not a gap. Create a new gap.
      prev = {
        seq: (prev.hi || prev.seq) + 1,
        hi: data.hi || data.seq
      };
      ranges.push(prev);
    });

    // Check for missing messages at the end.
    // All messages could be missing or it could be a new topic with no messages.
    const last = this._messages.getLast();
    const maxSeq = Math.max(this.seq, this._maxSeq) || 0;
    if ((maxSeq > 0 && !last) || (last && ((last.hi || last.seq) < maxSeq))) {
      if (last && last.hi) {
        // Extend existing gap
        last.hi = maxSeq;
      } else {
        // Create new gap.
        ranges.push({
          seq: last ? last.seq + 1 : 1,
          hi: maxSeq
        });
      }
    }

    // Insert new gaps into cache.
    ranges.map((gap) => {
      this._messages.put(gap);
    });
  },

  // Load most recent messages from persistent cache.
  _loadMessages: function(db) {
    return db.readMessages(this.name, {
        limit: DEFAULT_MESSAGES_PAGE
      })
      .then((msgs) => {
        msgs.forEach((data) => {
          if (data.seq > this._maxSeq) {
            this._maxSeq = data.seq;
          }
          if (data.seq < this._minSeq || this._minSeq == 0) {
            this._minSeq = data.seq;
          }
          this._messages.put(data);
        });

        this._updateDeletedRanges();
        return this.name;
      });
  },

  // Push or {pres}: message received.
  _updateReceived: function(seq, act) {
    this.touched = new Date();
    this.seq = seq | 0;
    // Check if message is sent by the current user. If so it's been read already.
    if (!act || this._tinode.isMe(act)) {
      this.read = this.read ? Math.max(this.read, this.seq) : this.seq;
      this.recv = this.recv ? Math.max(this.read, this.recv) : this.read;
    }
    this.unread = this.seq - (this.read | 0);
  }
};

/**
 * @class TopicMe - special case of {@link Tinode.Topic} for
 * managing data of the current user, including contact list.
 * @extends Tinode.Topic
 * @memberof Tinode
 *
 * @param {TopicMe.Callbacks} callbacks - Callbacks to receive various events.
 */
var TopicMe = function(callbacks) {
  Topic.call(this, TOPIC_ME, callbacks);

  // me-specific callbacks
  if (callbacks) {
    this.onContactUpdate = callbacks.onContactUpdate;
  }
};

// Inherit everyting from the generic Topic
TopicMe.prototype = Object.create(Topic.prototype, {
  // Override the original Topic._processMetaDesc.
  _processMetaDesc: {
    value: function(desc) {
      // Check if online contacts need to be turned off because P permission was removed.
      const turnOff = (desc.acs && !desc.acs.isPresencer()) && (this.acs && this.acs.isPresencer());

      // Copy parameters from desc object to this topic.
      mergeObj(this, desc);
      this._tinode._db.updTopic(this);

      // String datetime headers to Date() objects.
      stringToDate(this);

      // 'P' permission was removed. All topics are offline now.
      if (turnOff) {
        this._tinode.cacheMap('topic', (cont) => {
          if (cont.online) {
            cont.online = false;
            if (cont.seen) {
              cont.seen.when = new Date();
            } else {
              cont.seen = {
                when: new Date()
              };
            }
            this._refreshContact('off', cont);
          }
        });
      }

      if (this.onMetaDesc) {
        this.onMetaDesc(this);
      }
    },
    enumerable: true,
    configurable: true
  },

  // Override the original Topic._processMetaSub
  _processMetaSub: {
    value: function(subs) {
      let updateCount = 0;
      subs.forEach((sub) => {
        const topicName = sub.topic;
        // Don't show 'me' and 'fnd' topics in the list of contacts.
        if (topicName == TOPIC_FND || topicName == TOPIC_ME) {
          return;
        }
        sub.updated = new Date(sub.updated);
        sub.touched = sub.touched ? new Date(sub.touched) : undefined;
        sub.deleted = sub.deleted ? new Date(sub.deleted) : null;
        sub.online = !!sub.online;

        let cont = null;
        if (sub.deleted) {
          cont = sub;
          this._tinode.cacheDel('topic', topicName);
          this._tinode._db.remTopic(topicName);
        } else {
          // Ensure the values are defined and are integers.
          if (typeof sub.seq != 'undefined') {
            sub.seq = sub.seq | 0;
            sub.recv = sub.recv | 0;
            sub.read = sub.read | 0;
            sub.unread = sub.seq - sub.read;
          }

          if (sub.seen && sub.seen.when) {
            sub.seen.when = new Date(sub.seen.when);
          }

          cont = mergeObj(this._tinode.getTopic(topicName), sub);
          this._tinode._db.updTopic(cont);

          if (Tinode.isP2PTopicName(topicName)) {
            this._cachePutUser(topicName, cont);
            this._tinode._db.updUser(topicName, cont.public);
          }
          // Notify topic of the update if it's an external update.
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
        subs.forEach((s) => {
          keys.push(s.topic);
        });
        this.onSubsUpdated(keys, updateCount);
      }
    },
    enumerable: true,
    configurable: true
  },

  // Called by Tinode when meta.sub is recived.
  _processMetaCreds: {
    value: function(creds, upd) {
      if (creds.length == 1 && creds[0] == Tinode.DEL_CHAR) {
        creds = [];
      }
      if (upd) {
        creds.map((cr) => {
          if (cr.val) {
            // Adding a credential.
            let idx = this._credentials.findIndex((el) => {
              return el.meth == cr.meth && el.val == cr.val;
            });
            if (idx < 0) {
              // Not found.
              if (!cr.done) {
                // Unconfirmed credential replaces previous unconfirmed credential of the same method.
                idx = this._credentials.findIndex((el) => {
                  return el.meth == cr.meth && !el.done;
                });
                if (idx >= 0) {
                  // Remove previous unconfirmed credential.
                  this._credentials.splice(idx, 1);
                }
              }
              this._credentials.push(cr);
            } else {
              // Found. Maybe change 'done' status.
              this._credentials[idx].done = cr.done;
            }
          } else if (cr.resp) {
            // Handle credential confirmation.
            const idx = this._credentials.findIndex((el) => {
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
    },
    enumerable: true,
    configurable: true
  },

  // Process presence change message
  _routePres: {
    value: function(pres) {
      if (pres.what == 'term') {
        // The 'me' topic itself is detached. Mark as unsubscribed.
        this._resetSub();
        return;
      }

      if (pres.what == 'upd' && pres.src == TOPIC_ME) {
        // Update to me's description. Request updated value.
        this.getMeta(this.startMetaQuery().withDesc().build());
        return;
      }

      const cont = this._tinode.cacheGet('topic', pres.src);
      if (cont) {
        switch (pres.what) {
          case 'on': // topic came online
            cont.online = true;
            break;
          case 'off': // topic went offline
            if (cont.online) {
              cont.online = false;
              if (cont.seen) {
                cont.seen.when = new Date();
              } else {
                cont.seen = {
                  when: new Date()
                };
              }
            }
            break;
          case 'msg': // new message received
            cont._updateReceived(pres.seq, pres.act);
            break;
          case 'upd': // desc updated
            // Request updated subscription.
            this.getMeta(this.startMetaQuery().withLaterOneSub(pres.src).build());
            break;
          case 'acs': // access mode changed
            if (cont.acs) {
              cont.acs.updateAll(pres.dacs);
            } else {
              cont.acs = new AccessMode().updateAll(pres.dacs);
            }
            cont.touched = new Date();
            break;
          case 'ua':
            // user agent changed.
            cont.seen = {
              when: new Date(),
              ua: pres.ua
            };
            break;
          case 'recv':
            // user's other session marked some messges as received.
            pres.seq = pres.seq | 0;
            cont.recv = cont.recv ? Math.max(cont.recv, pres.seq) : pres.seq;
            break;
          case 'read':
            // user's other session marked some messages as read.
            pres.seq = pres.seq | 0;
            cont.read = cont.read ? Math.max(cont.read, pres.seq) : pres.seq;
            cont.recv = cont.recv ? Math.max(cont.read, cont.recv) : cont.recv;
            cont.unread = cont.seq - cont.read;
            break;
          case 'gone':
            // topic deleted or unsubscribed from.
            this._tinode.cacheDel('topic', pres.src);
            this._tinode._db.remTopic(pres.src);
            break;
          case 'del':
            // Update topic.del value.
            break;
          default:
            this._tinode.logger("INFO: Unsupported presence update in 'me'", pres.what);
        }

        this._refreshContact(pres.what, cont);
      } else {
        if (pres.what == 'acs') {
          // New subscriptions and deleted/banned subscriptions have full
          // access mode (no + or - in the dacs string). Changes to known subscriptions are sent as
          // deltas, but they should not happen here.
          const acs = new AccessMode(pres.dacs);
          if (!acs || acs.mode == AccessMode._INVALID) {
            this._tinode.logger("ERROR: Invalid access mode update", pres.src, pres.dacs);
            return;
          } else if (acs.mode == AccessMode._NONE) {
            this._tinode.logger("WARNING: Removing non-existent subscription", pres.src, pres.dacs);
            return;
          } else {
            // New subscription. Send request for the full description.
            // Using .withOneSub (not .withLaterOneSub) to make sure IfModifiedSince is not set.
            this.getMeta(this.startMetaQuery().withOneSub(undefined, pres.src).build());
            // Create a dummy entry to catch online status update.
            const dummy = this._tinode.getTopic(pres.src);
            dummy.touched = new Date();
            dummy.topic = pres.src;
            dummy.online = false;
            dummy.acs = acs;
            this._tinode.attachCacheToTopic(dummy);
            dummy._cachePutSelf();
            this._db.updTopic(dummy);
          }
        } else if (pres.what == 'tags') {
          this.getMeta(this.startMetaQuery().withTags().build());
        }
      }

      if (this.onPres) {
        this.onPres(pres);
      }
    },
    enumerable: true,
    configurable: true
  },

  // Contact is updated, execute callbacks.
  _refreshContact: {
    value: function(what, cont) {
      if (this.onContactUpdate) {
        this.onContactUpdate(what, cont);
      }
    },
    enumerable: true,
    configurable: true
  },

  /**
   * Publishing to TopicMe is not supported. {@link Topic#publish} is overriden and thows an {Error} if called.
   * @memberof Tinode.TopicMe#
   * @throws {Error} Always throws an error.
   */
  publish: {
    value: function() {
      return Promise.reject(new Error("Publishing to 'me' is not supported"));
    },
    enumerable: true,
    configurable: true
  },

  /**
   * Delete validation credential.
   * @memberof Tinode.TopicMe#
   *
   * @param {string} topic - Name of the topic to delete
   * @param {string} user - User ID to remove.
   * @returns {Promise} Promise which will be resolved/rejected on receiving server reply.
   */
  delCredential: {
    value: function(method, value) {
      if (!this._subscribed) {
        return Promise.reject(new Error("Cannot delete credential in inactive 'me' topic"));
      }
      // Send {del} message, return promise
      return this._tinode.delCredential(method, value).then((ctrl) => {
        // Remove deleted credential from the cache.
        const index = this._credentials.findIndex((el) => {
          return el.meth == method && el.val == value;
        });
        if (index > -1) {
          this._credentials.splice(index, 1);
        }
        // Notify listeners
        if (this.onCredsUpdated) {
          this.onCredsUpdated(this._credentials);
        }
        return ctrl;
      });

    },
    enumerable: true,
    configurable: true
  },

  /**
   * @callback contactFilter
   * @param {Object} contact to check for inclusion.
   * @returns {boolean} <code>true</code> if contact should be processed, <code>false</code> to exclude it.
   */
  /**
   * Iterate over cached contacts.
   *
   * @function
   * @memberof Tinode.TopicMe#
   * @param {TopicMe.ContactCallback} callback - Callback to call for each contact.
   * @param {contactFilter=} filter - Optionally filter contacts; include all if filter is false-ish, otherwise
   *      include those for which filter returns true-ish.
   * @param {Object=} context - Context to use for calling the `callback`, i.e. the value of `this` inside the callback.
   */
  contacts: {
    value: function(callback, filter, context) {
      this._tinode.cacheMap('topic', (c, idx) => {
        if (c.isCommType() && (!filter || filter(c))) {
          callback.call(context, c, idx);
        }
      });
    },
    enumerable: true,
    configurable: true
  },

  /**
   * Get a contact from cache.
   * @memberof Tinode.TopicMe#
   *
   * @param {string} name - Name of the contact to get, either a UID (for p2p topics) or a topic name.
   * @returns {Tinode.Contact} - Contact or `undefined`.
   */
  getContact: {
    value: function(name) {
      return this._tinode.cacheGet('topic', name);
    },
    enumerable: true,
    configurable: true
  },

  /**
   * Get access mode of a given contact from cache.
   * @memberof Tinode.TopicMe#
   *
   * @param {string} name - Name of the contact to get access mode for, either a UID (for p2p topics)
   *        or a topic name; if missing, access mode for the 'me' topic itself.
   * @returns {string} - access mode, such as `RWP`.
   */
  getAccessMode: {
    value: function(name) {
      if (name) {
        const cont = this._tinode.cacheGet('topic', name);
        return cont ? cont.acs : null;
      }
      return this.acs;
    },
    enumerable: true,
    configurable: true
  },

  /**
   * Check if contact is archived, i.e. contact.private.arch == true.
   * @memberof Tinode.TopicMe#
   *
   * @param {string} name - Name of the contact to check archived status, either a UID (for p2p topics) or a topic name.
   * @returns {boolean} - true if contact is archived, false otherwise.
   */
  isArchived: {
    value: function(name) {
      const cont = this._tinode.cacheGet('topic', name);
      return cont ? ((cont.private && cont.private.arch) ? true : false) : null;
    },
    enumerable: true,
    configurable: true
  },

  /**
   * @typedef Tinode.Credential
   * @memberof Tinode
   * @type Object
   * @property {string} meth - validation method such as 'email' or 'tel'.
   * @property {string} val - credential value, i.e. 'jdoe@example.com' or '+17025551234'
   * @property {boolean} done - true if credential is validated.
   */
  /**
   * Get the user's credentials: email, phone, etc.
   * @memberof Tinode.TopicMe#
   *
   * @returns {Tinode.Credential[]} - array of credentials.
   */
  getCredentials: {
    value: function() {
      return this._credentials;
    },
    enumerable: true,
    configurable: true
  }
});
TopicMe.prototype.constructor = TopicMe;

/**
 * @class TopicFnd - special case of {@link Tinode.Topic} for searching for
 * contacts and group topics.
 * @extends Tinode.Topic
 * @memberof Tinode
 *
 * @param {TopicFnd.Callbacks} callbacks - Callbacks to receive various events.
 */
var TopicFnd = function(callbacks) {
  Topic.call(this, TOPIC_FND, callbacks);
  // List of users and topics uid or topic_name -> Contact object)
  this._contacts = {};
};

// Inherit everyting from the generic Topic
TopicFnd.prototype = Object.create(Topic.prototype, {
  // Override the original Topic._processMetaSub
  _processMetaSub: {
    value: function(subs) {
      let updateCount = Object.getOwnPropertyNames(this._contacts).length;
      // Reset contact list.
      this._contacts = {};
      for (let idx in subs) {
        let sub = subs[idx];
        const indexBy = sub.topic ? sub.topic : sub.user;

        sub.updated = new Date(sub.updated);
        if (sub.seen && sub.seen.when) {
          sub.seen.when = new Date(sub.seen.when);
        }

        sub = mergeToCache(this._contacts, indexBy, sub);
        updateCount++;

        if (this.onMetaSub) {
          this.onMetaSub(sub);
        }
      }

      if (updateCount > 0 && this.onSubsUpdated) {
        this.onSubsUpdated(Object.keys(this._contacts));
      }
    },
    enumerable: true,
    configurable: true
  },

  /**
   * Publishing to TopicFnd is not supported. {@link Topic#publish} is overriden and thows an {Error} if called.
   * @memberof Tinode.TopicFnd#
   * @throws {Error} Always throws an error.
   */
  publish: {
    value: function() {
      return Promise.reject(new Error("Publishing to 'fnd' is not supported"));
    },
    enumerable: true,
    configurable: true
  },

  /**
   * setMeta to TopicFnd resets contact list in addition to sending the message.
   * @memberof Tinode.TopicFnd#
   * @param {Tinode.SetParams} params parameters to update.
   * @returns {Promise} Promise to be resolved/rejected when the server responds to request.
   */
  setMeta: {
    value: function(params) {
      const instance = this;
      return Object.getPrototypeOf(TopicFnd.prototype).setMeta.call(this, params).then(function() {
        if (Object.keys(instance._contacts).length > 0) {
          instance._contacts = {};
          if (instance.onSubsUpdated) {
            instance.onSubsUpdated([]);
          }
        }
      });
    },
    enumerable: true,
    configurable: true
  },

  /**
   * Iterate over found contacts. If callback is undefined, use {@link this.onMetaSub}.
   * @function
   * @memberof Tinode.TopicFnd#
   * @param {TopicFnd.ContactCallback} callback - Callback to call for each contact.
   * @param {Object} context - Context to use for calling the `callback`, i.e. the value of `this` inside the callback.
   */
  contacts: {
    value: function(callback, context) {
      const cb = (callback || this.onMetaSub);
      if (cb) {
        for (let idx in this._contacts) {
          cb.call(context, this._contacts[idx], idx, this._contacts);
        }
      }
    },
    enumerable: true,
    configurable: true
  }
});
TopicFnd.prototype.constructor = TopicFnd;

/**
 * @class LargeFileHelper - collection of utilities for uploading and downloading files
 * out of band. Don't instantiate this class directly. Use {Tinode.getLargeFileHelper} instead.
 * @memberof Tinode
 *
 * @param {Tinode} tinode - the main Tinode object.
 */
var LargeFileHelper = function(tinode) {
  this._tinode = tinode;

  this._apiKey = tinode._apiKey;
  this._authToken = tinode.getAuthToken();
  this._msgId = tinode.getNextUniqueId();
  this.xhr = new XMLHttpRequest();

  // Promise
  this.toResolve = null;
  this.toReject = null;

  // Callbacks
  this.onProgress = null;
  this.onSuccess = null;
  this.onFailure = null;
}

LargeFileHelper.prototype = {
  /**
   * Start uploading the file to a non-default endpoint.
   *
   * @memberof Tinode.LargeFileHelper#
   *
   * @param {string} baseUrl alternative base URL of upload server.
   * @param {File|Blob} data to upload
   * @param {Callback} onProgress callback. Takes one {float} parameter 0..1
   * @param {Callback} onSuccess callback. Called when the file is successfully uploaded.
   * @param {Callback} onFailure callback. Called in case of a failure.
   *
   * @returns {Promise} resolved/rejected when the upload is completed/failed.
   */
  uploadWithBaseUrl: function(baseUrl, data, onProgress, onSuccess, onFailure) {
    if (!this._authToken) {
      throw new Error("Must authenticate first");
    }
    const instance = this;

    let url = '/v' + PROTOCOL_VERSION + '/file/u/';
    if (baseUrl) {
      if (baseUrl.indexOf('http://') == 0 || baseUrl.indexOf('https://') == 0) {
        url = baseUrl + url;
      } else {
        throw new Error(`Invalid base URL '${baseUrl}'`);
      }
    }
    this.xhr.open('POST', url, true);
    this.xhr.setRequestHeader('X-Tinode-APIKey', this._apiKey);
    this.xhr.setRequestHeader('X-Tinode-Auth', 'Token ' + this._authToken.token);
    const result = new Promise((resolve, reject) => {
      this.toResolve = resolve;
      this.toReject = reject;
    });

    this.onProgress = onProgress;
    this.onSuccess = onSuccess;
    this.onFailure = onFailure;

    this.xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && instance.onProgress) {
        instance.onProgress(e.loaded / e.total);
      }
    }

    this.xhr.onload = function() {
      let pkt;
      try {
        pkt = JSON.parse(this.response, jsonParseHelper);
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
          instance.onFailure(pkt.ctrl)
        }
      } else {
        instance._tinode.logger("ERROR: Unexpected server response status", this.status, this.response);
      }
    };

    this.xhr.onerror = function(e) {
      if (instance.toReject) {
        instance.toReject(new Error("failed"));
      }
      if (instance.onFailure) {
        instance.onFailure(null);
      }
    };

    this.xhr.onabort = function(e) {
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
      form.set('id', this._msgId);
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
  },

  /**
   * Start uploading the file to default endpoint.
   *
   * @memberof Tinode.LargeFileHelper#
   *
   * @param {File|Blob} data to upload
   * @param {Callback} onProgress callback. Takes one {float} parameter 0..1
   * @param {Callback} onSuccess callback. Called when the file is successfully uploaded.
   * @param {Callback} onFailure callback. Called in case of a failure.
   *
   * @returns {Promise} resolved/rejected when the upload is completed/failed.
   */
  upload: function(data, onProgress, onSuccess, onFailure) {
    return this.uploadWithBaseUrl(undefined, data, onProgress, onSuccess, onFailure);
  },

  /**
   * Download the file from a given URL using GET request. This method works with the Tinode server only.
   *
   * @memberof Tinode.LargeFileHelper#
   *
   * @param {string} relativeUrl - URL to download the file from. Must be relative url, i.e. must not contain the host.
   * @param {string=} filename - file name to use for the downloaded file.
   *
   * @returns {Promise} resolved/rejected when the download is completed/failed.
   */
  download: function(relativeUrl, filename, mimetype, onProgress, onError) {
    if (!Tinode.isRelativeURL(relativeUrl)) {
      // As a security measure refuse to download from an absolute URL.
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
    // Get data as blob (stored by the browser as a temporary file).
    this.xhr.open('GET', relativeUrl, true);
    this.xhr.setRequestHeader('X-Tinode-APIKey', this._apiKey);
    this.xhr.setRequestHeader('X-Tinode-Auth', 'Token ' + this._authToken.token);
    this.xhr.responseType = 'blob';

    this.onProgress = onProgress;
    this.xhr.onprogress = function(e) {
      if (instance.onProgress) {
        // Passing e.loaded instead of e.loaded/e.total because e.total
        // is always 0 with gzip compression enabled by the server.
        instance.onProgress(e.loaded);
      }
    };

    const result = new Promise((resolve, reject) => {
      this.toResolve = resolve;
      this.toReject = reject;
    });

    // The blob needs to be saved as file. There is no known way to
    // save the blob as file other than to fake a click on an <a href... download=...>.
    this.xhr.onload = function() {
      if (this.status == 200) {
        const link = document.createElement('a');
        // URL.createObjectURL is not available in non-browser environment. This call will fail.
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
        // The this.responseText is undefined, must use this.response which is a blob.
        // Need to convert this.response to JSON. The blob can only be accessed by the
        // FileReader.
        const reader = new FileReader();
        reader.onload = function() {
          try {
            const pkt = JSON.parse(this.result, jsonParseHelper);
            instance.toReject(new Error(`${pkt.ctrl.text} (${pkt.ctrl.code})`));
          } catch (err) {
            instance._tinode.logger("ERROR: Invalid server response in LargeFileHelper", this.result);
            instance.toReject(err);
          }
        };
        reader.readAsText(this.response);
      }
    };

    this.xhr.onerror = function(e) {
      if (instance.toReject) {
        instance.toReject(new Error("failed"));
      }
    };

    this.xhr.onabort = function() {
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
  },

  /**
   * Try to cancel an ongoing upload or download.
   * @memberof Tinode.LargeFileHelper#
   */
  cancel: function() {
    if (this.xhr && this.xhr.readyState < 4) {
      this.xhr.abort();
    }
  },

  /**
   * Get unique id of this request.
   * @memberof Tinode.LargeFileHelper#
   *
   * @returns {string} unique id
   */
  getId: function() {
    return this._msgId;
  }
};

/**
 * @class Message - definition a communication message.
 * Work in progress.
 * @memberof Tinode
 *
 * @param {string} topic_ - name of the topic the message belongs to.
 * @param {string | Drafty} content_ - message contant.
 */
var Message = function(topic_, content_) {
  this.status = Message.STATUS_NONE;
  this.topic = topic_;
  this.content = content_;
}

Message.STATUS_NONE = MESSAGE_STATUS_NONE;
Message.STATUS_QUEUED = MESSAGE_STATUS_QUEUED;
Message.STATUS_SENDING = MESSAGE_STATUS_SENDING;
Message.STATUS_FAILED = MESSAGE_STATUS_FAILED;
Message.STATUS_SENT = MESSAGE_STATUS_SENT;
Message.STATUS_RECEIVED = MESSAGE_STATUS_RECEIVED;
Message.STATUS_READ = MESSAGE_STATUS_READ;
Message.STATUS_TO_ME = MESSAGE_STATUS_TO_ME;

Message.prototype = {
  /**
   * Convert message object to {pub} packet.
   */
  toJSON: function() {

  },
  /**
   * Parse JSON into message.
   */
  fromJSON: function(json) {

  }
}
Message.prototype.constructor = Message;

if (typeof module != 'undefined') {
  module.exports = Tinode;
  module.exports.Drafty = Drafty;
  module.exports.AccessMode = AccessMode;
}

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../version.json":6,"./cbuffer.js":1,"./connection.js":2,"./db.js":3,"./drafty.js":4}],6:[function(require,module,exports){
module.exports={"version": "0.17.0-rc2"}

},{}]},{},[5])(5)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY2J1ZmZlci5qcyIsInNyYy9jb25uZWN0aW9uLmpzIiwic3JjL2RiLmpzIiwic3JjL2RyYWZ0eS5qcyIsInNyYy90aW5vZGUuanMiLCJ2ZXJzaW9uLmpzb24iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDek1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzVqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlrQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzluREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDbDJLQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyoqXG4gKiBAZmlsZSBJbi1tZW1vcnkgc29ydGVkIGNhY2hlIG9mIG9iamVjdHMuLlxuICpcbiAqIEBjb3B5cmlnaHQgMjAxNS0yMDIxIFRpbm9kZVxuICogQHN1bW1hcnkgSmF2YXNjcmlwdCBiaW5kaW5ncyBmb3IgVGlub2RlLlxuICogQGxpY2Vuc2UgQXBhY2hlIDIuMFxuICogQHZlcnNpb24gMC4xN1xuICovXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogSW4tbWVtb3J5IHNvcnRlZCBjYWNoZSBvZiBvYmplY3RzLlxuICpcbiAqIEBjbGFzcyBDQnVmZmVyXG4gKiBAbWVtYmVyb2YgVGlub2RlXG4gKiBAcHJvdGVjdGVkXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbn0gY29tcGFyZSBjdXN0b20gY29tcGFyYXRvciBvZiBvYmplY3RzLiBUYWtlcyB0d28gcGFyYW1ldGVycyA8Y29kZT5hPC9jb2RlPiBhbmQgPGNvZGU+YjwvY29kZT47XG4gKiAgICByZXR1cm5zIDxjb2RlPi0xPC9jb2RlPiBpZiA8Y29kZT5hIDwgYjwvY29kZT4sIDxjb2RlPjA8L2NvZGU+IGlmIDxjb2RlPmEgPT0gYjwvY29kZT4sIDxjb2RlPjE8L2NvZGU+IG90aGVyd2lzZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gdW5pcXVlIGVuZm9yY2UgZWxlbWVudCB1bmlxdWVuZXNzOiB3aGVuIDxjb2RlPnRydWU8L2NvZGU+IHJlcGxhY2UgZXhpc3RpbmcgZWxlbWVudCB3aXRoIGEgbmV3XG4gKiAgICBvbmUgb24gY29uZmxpY3Q7IHdoZW4gPGNvZGU+ZmFsc2U8L2NvZGU+IGtlZXAgYm90aCBlbGVtZW50cy5cbiAqL1xuY29uc3QgQ0J1ZmZlciA9IGZ1bmN0aW9uKGNvbXBhcmUsIHVuaXF1ZSkge1xuICBsZXQgYnVmZmVyID0gW107XG5cbiAgY29tcGFyZSA9IGNvbXBhcmUgfHwgZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiBhID09PSBiID8gMCA6IGEgPCBiID8gLTEgOiAxO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGZpbmROZWFyZXN0KGVsZW0sIGFyciwgZXhhY3QpIHtcbiAgICBsZXQgc3RhcnQgPSAwO1xuICAgIGxldCBlbmQgPSBhcnIubGVuZ3RoIC0gMTtcbiAgICBsZXQgcGl2b3QgPSAwO1xuICAgIGxldCBkaWZmID0gMDtcbiAgICBsZXQgZm91bmQgPSBmYWxzZTtcblxuICAgIHdoaWxlIChzdGFydCA8PSBlbmQpIHtcbiAgICAgIHBpdm90ID0gKHN0YXJ0ICsgZW5kKSAvIDIgfCAwO1xuICAgICAgZGlmZiA9IGNvbXBhcmUoYXJyW3Bpdm90XSwgZWxlbSk7XG4gICAgICBpZiAoZGlmZiA8IDApIHtcbiAgICAgICAgc3RhcnQgPSBwaXZvdCArIDE7XG4gICAgICB9IGVsc2UgaWYgKGRpZmYgPiAwKSB7XG4gICAgICAgIGVuZCA9IHBpdm90IC0gMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChmb3VuZCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaWR4OiBwaXZvdCxcbiAgICAgICAgZXhhY3Q6IHRydWVcbiAgICAgIH07XG4gICAgfVxuICAgIGlmIChleGFjdCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaWR4OiAtMVxuICAgICAgfTtcbiAgICB9XG4gICAgLy8gTm90IGV4YWN0IC0gaW5zZXJ0aW9uIHBvaW50XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkeDogZGlmZiA8IDAgPyBwaXZvdCArIDEgOiBwaXZvdFxuICAgIH07XG4gIH1cblxuICAvLyBJbnNlcnQgZWxlbWVudCBpbnRvIGEgc29ydGVkIGFycmF5LlxuICBmdW5jdGlvbiBpbnNlcnRTb3J0ZWQoZWxlbSwgYXJyKSB7XG4gICAgY29uc3QgZm91bmQgPSBmaW5kTmVhcmVzdChlbGVtLCBhcnIsIGZhbHNlKTtcbiAgICBjb25zdCBjb3VudCA9IChmb3VuZC5leGFjdCAmJiB1bmlxdWUpID8gMSA6IDA7XG4gICAgYXJyLnNwbGljZShmb3VuZC5pZHgsIGNvdW50LCBlbGVtKTtcbiAgICByZXR1cm4gYXJyO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAvKipcbiAgICAgKiBHZXQgYW4gZWxlbWVudCBhdCB0aGUgZ2l2ZW4gcG9zaXRpb24uXG4gICAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhdCAtIFBvc2l0aW9uIHRvIGZldGNoIGZyb20uXG4gICAgICogQHJldHVybnMge09iamVjdH0gRWxlbWVudCBhdCB0aGUgZ2l2ZW4gcG9zaXRpb24gb3IgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPi5cbiAgICAgKi9cbiAgICBnZXRBdDogZnVuY3Rpb24oYXQpIHtcbiAgICAgIHJldHVybiBidWZmZXJbYXRdO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDb252ZW5pZW5jZSBtZXRob2QgZm9yIGdldHRpbmcgdGhlIGxhc3QgZWxlbWVudCBvZiB0aGUgYnVmZmVyLlxuICAgICAqIEBtZW1iZXJvZiBUaW5vZGUuQ0J1ZmZlciNcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgbGFzdCBlbGVtZW50IGluIHRoZSBidWZmZXIgb3IgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPiBpZiBidWZmZXIgaXMgZW1wdHkuXG4gICAgICovXG4gICAgZ2V0TGFzdDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gYnVmZmVyLmxlbmd0aCA+IDAgPyBidWZmZXJbYnVmZmVyLmxlbmd0aCAtIDFdIDogdW5kZWZpbmVkO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBZGQgbmV3IGVsZW1lbnQocykgdG8gdGhlIGJ1ZmZlci4gVmFyaWFkaWM6IHRha2VzIG9uZSBvciBtb3JlIGFyZ3VtZW50cy4gSWYgYW4gYXJyYXkgaXMgcGFzc2VkIGFzIGEgc2luZ2xlXG4gICAgICogYXJndW1lbnQsIGl0cyBlbGVtZW50cyBhcmUgaW5zZXJ0ZWQgaW5kaXZpZHVhbGx5LlxuICAgICAqIEBtZW1iZXJvZiBUaW5vZGUuQ0J1ZmZlciNcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Li4uT2JqZWN0fEFycmF5fSAtIE9uZSBvciBtb3JlIG9iamVjdHMgdG8gaW5zZXJ0LlxuICAgICAqL1xuICAgIHB1dDogZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgaW5zZXJ0O1xuICAgICAgLy8gaW5zcGVjdCBhcmd1bWVudHM6IGlmIGFycmF5LCBpbnNlcnQgaXRzIGVsZW1lbnRzLCBpZiBvbmUgb3IgbW9yZSBub24tYXJyYXkgYXJndW1lbnRzLCBpbnNlcnQgdGhlbSBvbmUgYnkgb25lXG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAxICYmIEFycmF5LmlzQXJyYXkoYXJndW1lbnRzWzBdKSkge1xuICAgICAgICBpbnNlcnQgPSBhcmd1bWVudHNbMF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnNlcnQgPSBhcmd1bWVudHM7XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBpZHggaW4gaW5zZXJ0KSB7XG4gICAgICAgIGluc2VydFNvcnRlZChpbnNlcnRbaWR4XSwgYnVmZmVyKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGVsZW1lbnQgYXQgdGhlIGdpdmVuIHBvc2l0aW9uLlxuICAgICAqIEBtZW1iZXJvZiBUaW5vZGUuQ0J1ZmZlciNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYXQgLSBQb3NpdGlvbiB0byBkZWxldGUgYXQuXG4gICAgICogQHJldHVybnMge09iamVjdH0gRWxlbWVudCBhdCB0aGUgZ2l2ZW4gcG9zaXRpb24gb3IgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPi5cbiAgICAgKi9cbiAgICBkZWxBdDogZnVuY3Rpb24oYXQpIHtcbiAgICAgIGxldCByID0gYnVmZmVyLnNwbGljZShhdCwgMSk7XG4gICAgICBpZiAociAmJiByLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIHJbMF07XG4gICAgICB9XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgZWxlbWVudHMgYmV0d2VlbiB0d28gcG9zaXRpb25zLlxuICAgICAqIEBtZW1iZXJvZiBUaW5vZGUuQ0J1ZmZlciNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc2luY2UgLSBQb3NpdGlvbiB0byBkZWxldGUgZnJvbSAoaW5jbHVzaXZlKS5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYmVmb3JlIC0gUG9zaXRpb24gdG8gZGVsZXRlIHRvIChleGNsdXNpdmUpLlxuICAgICAqXG4gICAgICogQHJldHVybnMge0FycmF5fSBhcnJheSBvZiByZW1vdmVkIGVsZW1lbnRzIChjb3VsZCBiZSB6ZXJvIGxlbmd0aCkuXG4gICAgICovXG4gICAgZGVsUmFuZ2U6IGZ1bmN0aW9uKHNpbmNlLCBiZWZvcmUpIHtcbiAgICAgIHJldHVybiBidWZmZXIuc3BsaWNlKHNpbmNlLCBiZWZvcmUgLSBzaW5jZSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybiB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIHRoZSBidWZmZXIgaG9sZHMuXG4gICAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgICAqIEByZXR1cm4ge251bWJlcn0gTnVtYmVyIG9mIGVsZW1lbnRzIGluIHRoZSBidWZmZXIuXG4gICAgICovXG4gICAgbGVuZ3RoOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBidWZmZXIubGVuZ3RoO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXNldCB0aGUgYnVmZmVyIGRpc2NhcmRpbmcgYWxsIGVsZW1lbnRzXG4gICAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgICAqL1xuICAgIHJlc2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIGJ1ZmZlciA9IFtdO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDYWxsYmFjayBmb3IgaXRlcmF0aW5nIGNvbnRlbnRzIG9mIGJ1ZmZlci4gU2VlIHtAbGluayBUaW5vZGUuQ0J1ZmZlciNmb3JFYWNofS5cbiAgICAgKiBAY2FsbGJhY2sgRm9yRWFjaENhbGxiYWNrVHlwZVxuICAgICAqIEBtZW1iZXJvZiBUaW5vZGUuQ0J1ZmZlciNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZWxlbSAtIEVsZW1lbnQgb2YgdGhlIGJ1ZmZlci5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggLSBJbmRleCBvZiB0aGUgY3VycmVudCBlbGVtZW50LlxuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogQXBwbHkgZ2l2ZW4gPGNvZGU+Y2FsbGJhY2s8L2NvZGU+IHRvIGFsbCBlbGVtZW50cyBvZiB0aGUgYnVmZmVyLlxuICAgICAqIEBtZW1iZXJvZiBUaW5vZGUuQ0J1ZmZlciNcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7VGlub2RlLkZvckVhY2hDYWxsYmFja1R5cGV9IGNhbGxiYWNrIC0gRnVuY3Rpb24gdG8gY2FsbCBmb3IgZWFjaCBlbGVtZW50LlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydElkeCAtIE9wdGlvbmFsIGluZGV4IHRvIHN0YXJ0IGl0ZXJhdGluZyBmcm9tIChpbmNsdXNpdmUpLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBiZWZvcmVJZHggLSBPcHRpb25hbCBpbmRleCB0byBzdG9wIGl0ZXJhdGluZyBiZWZvcmUgKGV4Y2x1c2l2ZSkuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSBjYWxsaW5nIGNvbnRleHQgKGkuZS4gdmFsdWUgb2YgPGNvZGU+dGhpczwvY29kZT4gaW4gY2FsbGJhY2spXG4gICAgICovXG4gICAgZm9yRWFjaDogZnVuY3Rpb24oY2FsbGJhY2ssIHN0YXJ0SWR4LCBiZWZvcmVJZHgsIGNvbnRleHQpIHtcbiAgICAgIHN0YXJ0SWR4ID0gc3RhcnRJZHggfCAwO1xuICAgICAgYmVmb3JlSWR4ID0gYmVmb3JlSWR4IHx8IGJ1ZmZlci5sZW5ndGg7XG4gICAgICBmb3IgKGxldCBpID0gc3RhcnRJZHg7IGkgPCBiZWZvcmVJZHg7IGkrKykge1xuICAgICAgICBjYWxsYmFjay5jYWxsKGNvbnRleHQsIGJ1ZmZlcltpXSwgaSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEZpbmQgZWxlbWVudCBpbiBidWZmZXIgdXNpbmcgYnVmZmVyJ3MgY29tcGFyaXNvbiBmdW5jdGlvbi5cbiAgICAgKiBAbWVtYmVyb2YgVGlub2RlLkNCdWZmZXIjXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZWxlbSAtIGVsZW1lbnQgdG8gZmluZC5cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBuZWFyZXN0IC0gd2hlbiB0cnVlIGFuZCBleGFjdCBtYXRjaCBpcyBub3QgZm91bmQsIHJldHVybiB0aGUgbmVhcmVzdCBlbGVtZW50IChpbnNlcnRpb24gcG9pbnQpLlxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IGluZGV4IG9mIHRoZSBlbGVtZW50IGluIHRoZSBidWZmZXIgb3IgLTEuXG4gICAgICovXG4gICAgZmluZDogZnVuY3Rpb24oZWxlbSwgbmVhcmVzdCkge1xuICAgICAgY29uc3Qge1xuICAgICAgICBpZHhcbiAgICAgIH0gPSBmaW5kTmVhcmVzdChlbGVtLCBidWZmZXIsICFuZWFyZXN0KTtcbiAgICAgIHJldHVybiBpZHg7XG4gICAgfVxuICB9XG59XG5cbmlmICh0eXBlb2YgbW9kdWxlICE9ICd1bmRlZmluZWQnKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gQ0J1ZmZlcjtcbn1cbiIsIi8qKlxuICogQGZpbGUgQWJzdHJhY3Rpb24gbGF5ZXIgZm9yIHdlYnNvY2tldCBhbmQgbG9uZyBwb2xsaW5nIGNvbm5lY3Rpb25zLlxuICogU2VlIDxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vdGlub2RlL3dlYmFwcFwiPmh0dHBzOi8vZ2l0aHViLmNvbS90aW5vZGUvd2ViYXBwPC9hPiBmb3IgcmVhbC1saWZlIHVzYWdlLlxuICpcbiAqIEBjb3B5cmlnaHQgMjAxNS0yMDIxIFRpbm9kZVxuICogQHN1bW1hcnkgSmF2YXNjcmlwdCBiaW5kaW5ncyBmb3IgVGlub2RlLlxuICogQGxpY2Vuc2UgQXBhY2hlIDIuMFxuICogQHZlcnNpb24gMC4xN1xuICovXG4ndXNlIHN0cmljdCc7XG5cbmxldCBXZWJTb2NrZXRQcm92aWRlcjtcbmlmICh0eXBlb2YgV2ViU29ja2V0ICE9ICd1bmRlZmluZWQnKSB7XG4gIFdlYlNvY2tldFByb3ZpZGVyID0gV2ViU29ja2V0O1xufVxuXG5sZXQgWEhSUHJvdmlkZXI7XG5pZiAodHlwZW9mIFhNTEh0dHBSZXF1ZXN0ICE9ICd1bmRlZmluZWQnKSB7XG4gIFhIUlByb3ZpZGVyID0gWE1MSHR0cFJlcXVlc3Q7XG59XG5cbmlmICh0eXBlb2Ygd2luZG93ID09ICd1bmRlZmluZWQnKSB7XG4gIGdsb2JhbC53aW5kb3cgPSB7XG4gICAgV2ViU29ja2V0OiBXZWJTb2NrZXRQcm92aWRlcixcbiAgICBYTUxIdHRwUmVxdWVzdDogWEhSUHJvdmlkZXIsXG4gIH1cbn1cblxuLy8gRXJyb3IgY29kZSB0byByZXR1cm4gaW4gY2FzZSBvZiBhIG5ldHdvcmsgcHJvYmxlbS5cbmNvbnN0IE5FVFdPUktfRVJST1IgPSA1MDM7XG5jb25zdCBORVRXT1JLX0VSUk9SX1RFWFQgPSBcIkNvbm5lY3Rpb24gZmFpbGVkXCI7XG5cbi8vIEVycm9yIGNvZGUgdG8gcmV0dXJuIHdoZW4gdXNlciBkaXNjb25uZWN0ZWQgZnJvbSBzZXJ2ZXIuXG5jb25zdCBORVRXT1JLX1VTRVIgPSA0MTg7XG5jb25zdCBORVRXT1JLX1VTRVJfVEVYVCA9IFwiRGlzY29ubmVjdGVkIGJ5IGNsaWVudFwiO1xuXG4vLyBIZWxwZXIgZnVuY3Rpb24gZm9yIGNyZWF0aW5nIGFuIGVuZHBvaW50IFVSTC5cbmZ1bmN0aW9uIG1ha2VCYXNlVXJsKGhvc3QsIHByb3RvY29sLCB2ZXJzaW9uLCBhcGlLZXkpIHtcbiAgbGV0IHVybCA9IG51bGw7XG5cbiAgaWYgKHByb3RvY29sID09PSAnaHR0cCcgfHwgcHJvdG9jb2wgPT09ICdodHRwcycgfHwgcHJvdG9jb2wgPT09ICd3cycgfHwgcHJvdG9jb2wgPT09ICd3c3MnKSB7XG4gICAgdXJsID0gcHJvdG9jb2wgKyAnOi8vJztcbiAgICB1cmwgKz0gaG9zdDtcbiAgICBpZiAodXJsLmNoYXJBdCh1cmwubGVuZ3RoIC0gMSkgIT09ICcvJykge1xuICAgICAgdXJsICs9ICcvJztcbiAgICB9XG4gICAgdXJsICs9ICd2JyArIHZlcnNpb24gKyAnL2NoYW5uZWxzJztcbiAgICBpZiAocHJvdG9jb2wgPT09ICdodHRwJyB8fCBwcm90b2NvbCA9PT0gJ2h0dHBzJykge1xuICAgICAgLy8gTG9uZyBwb2xsaW5nIGVuZHBvaW50IGVuZCB3aXRoIFwibHBcIiwgaS5lLlxuICAgICAgLy8gJy92MC9jaGFubmVscy9scCcgdnMganVzdCAnL3YwL2NoYW5uZWxzJyBmb3Igd3NcbiAgICAgIHVybCArPSAnL2xwJztcbiAgICB9XG4gICAgdXJsICs9ICc/YXBpa2V5PScgKyBhcGlLZXk7XG4gIH1cblxuICByZXR1cm4gdXJsO1xufVxuXG4vKipcbiAqIEFuIGFic3RyYWN0aW9uIGZvciBhIHdlYnNvY2tldCBvciBhIGxvbmcgcG9sbGluZyBjb25uZWN0aW9uLlxuICpcbiAqIEBjbGFzcyBDb25uZWN0aW9uXG4gKiBAbWVtYmVyb2YgVGlub2RlXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGhvc3RfIC0gSG9zdCBuYW1lIGFuZCBwb3J0IG51bWJlciB0byBjb25uZWN0IHRvLlxuICogQHBhcmFtIHtzdHJpbmd9IHZlcnNpb25fIC0gTWFqb3IgdmFsdWUgb2YgdGhlIHByb3RvY29sIHZlcnNpb24sIGUuZy4gJzAnIGluICcwLjE3LjEnLlxuICogQHBhcmFtIHtzdHJpbmd9IGFwaUtleV8gLSBBUEkga2V5IGdlbmVyYXRlZCBieSBrZXlnZW5cbiAqIEBwYXJhbSB7c3RyaW5nfSB0cmFuc3BvcnRfIC0gTmV0d29yayB0cmFuc3BvcnQgdG8gdXNlLCBlaXRoZXIgPGNvZGU+XCJ3c1wiPGNvZGU+Lzxjb2RlPlwid3NzXCI8L2NvZGU+IGZvciB3ZWJzb2NrZXQgb3JcbiAqICAgICAgPGNvZGU+bHA8L2NvZGU+IGZvciBsb25nIHBvbGxpbmcuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IHNlY3VyZV8gLSBVc2Ugc2VjdXJlIFdlYlNvY2tldCAod3NzKSBpZiA8Y29kZT50cnVlPC9jb2RlPi5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYXV0b3JlY29ubmVjdF8gLSBJZiBjb25uZWN0aW9uIGlzIGxvc3QsIHRyeSB0byByZWNvbm5lY3QgYXV0b21hdGljYWxseS5cbiAqL1xuY29uc3QgQ29ubmVjdGlvbiA9IGZ1bmN0aW9uKGhvc3RfLCB2ZXJzaW9uXywgYXBpS2V5XywgdHJhbnNwb3J0Xywgc2VjdXJlXywgYXV0b3JlY29ubmVjdF8pIHtcbiAgbGV0IGhvc3QgPSBob3N0XztcbiAgbGV0IHZlcnNpb24gPSB2ZXJzaW9uXztcbiAgbGV0IHNlY3VyZSA9IHNlY3VyZV87XG4gIGxldCBhcGlLZXkgPSBhcGlLZXlfO1xuXG4gIGxldCBhdXRvcmVjb25uZWN0ID0gYXV0b3JlY29ubmVjdF87XG5cbiAgLy8gU2V0dGluZ3MgZm9yIGV4cG9uZW50aWFsIGJhY2tvZmZcbiAgY29uc3QgX0JPRkZfQkFTRSA9IDIwMDA7IC8vIDIwMDAgbWlsbGlzZWNvbmRzLCBtaW5pbXVtIGRlbGF5IGJldHdlZW4gcmVjb25uZWN0c1xuICBjb25zdCBfQk9GRl9NQVhfSVRFUiA9IDEwOyAvLyBNYXhpbXVtIGRlbGF5IGJldHdlZW4gcmVjb25uZWN0cyAyXjEwICogMjAwMCB+IDM0IG1pbnV0ZXNcbiAgY29uc3QgX0JPRkZfSklUVEVSID0gMC4zOyAvLyBBZGQgcmFuZG9tIGRlbGF5XG5cbiAgbGV0IF9ib2ZmVGltZXIgPSBudWxsO1xuICBsZXQgX2JvZmZJdGVyYXRpb24gPSAwO1xuICBsZXQgX2JvZmZDbG9zZWQgPSBmYWxzZTsgLy8gSW5kaWNhdG9yIGlmIHRoZSBzb2NrZXQgd2FzIG1hbnVhbGx5IGNsb3NlZCAtIGRvbid0IGF1dG9yZWNvbm5lY3QgaWYgdHJ1ZS5cblxuICBjb25zdCBsb2cgPSAodGV4dCwgLi4uYXJncykgPT4ge1xuICAgIGlmICh0aGlzLmxvZ2dlcikge1xuICAgICAgdGhpcy5sb2dnZXIodGV4dCwgLi4uYXJncyk7XG4gICAgfVxuICB9XG5cbiAgLy8gQmFja29mZiBpbXBsZW1lbnRhdGlvbiAtIHJlY29ubmVjdCBhZnRlciBhIHRpbWVvdXQuXG4gIGZ1bmN0aW9uIGJvZmZSZWNvbm5lY3QoKSB7XG4gICAgLy8gQ2xlYXIgdGltZXJcbiAgICBjbGVhclRpbWVvdXQoX2JvZmZUaW1lcik7XG4gICAgLy8gQ2FsY3VsYXRlIHdoZW4gdG8gZmlyZSB0aGUgcmVjb25uZWN0IGF0dGVtcHRcbiAgICBjb25zdCB0aW1lb3V0ID0gX0JPRkZfQkFTRSAqIChNYXRoLnBvdygyLCBfYm9mZkl0ZXJhdGlvbikgKiAoMS4wICsgX0JPRkZfSklUVEVSICogTWF0aC5yYW5kb20oKSkpO1xuICAgIC8vIFVwZGF0ZSBpdGVyYXRpb24gY291bnRlciBmb3IgZnV0dXJlIHVzZVxuICAgIF9ib2ZmSXRlcmF0aW9uID0gKF9ib2ZmSXRlcmF0aW9uID49IF9CT0ZGX01BWF9JVEVSID8gX2JvZmZJdGVyYXRpb24gOiBfYm9mZkl0ZXJhdGlvbiArIDEpO1xuICAgIGlmICh0aGlzLm9uQXV0b3JlY29ubmVjdEl0ZXJhdGlvbikge1xuICAgICAgdGhpcy5vbkF1dG9yZWNvbm5lY3RJdGVyYXRpb24odGltZW91dCk7XG4gICAgfVxuXG4gICAgX2JvZmZUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgbG9nKGBSZWNvbm5lY3RpbmcsIGl0ZXI9JHtfYm9mZkl0ZXJhdGlvbn0sIHRpbWVvdXQ9JHt0aW1lb3V0fWApO1xuICAgICAgLy8gTWF5YmUgdGhlIHNvY2tldCB3YXMgY2xvc2VkIHdoaWxlIHdlIHdhaXRlZCBmb3IgdGhlIHRpbWVyP1xuICAgICAgaWYgKCFfYm9mZkNsb3NlZCkge1xuICAgICAgICBjb25zdCBwcm9tID0gdGhpcy5jb25uZWN0KCk7XG4gICAgICAgIGlmICh0aGlzLm9uQXV0b3JlY29ubmVjdEl0ZXJhdGlvbikge1xuICAgICAgICAgIHRoaXMub25BdXRvcmVjb25uZWN0SXRlcmF0aW9uKDAsIHByb20pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIFN1cHByZXNzIGVycm9yIGlmIGl0J3Mgbm90IHVzZWQuXG4gICAgICAgICAgcHJvbS5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAvKiBkbyBub3RoaW5nICovXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5vbkF1dG9yZWNvbm5lY3RJdGVyYXRpb24pIHtcbiAgICAgICAgdGhpcy5vbkF1dG9yZWNvbm5lY3RJdGVyYXRpb24oLTEpO1xuICAgICAgfVxuICAgIH0sIHRpbWVvdXQpO1xuICB9XG5cbiAgLy8gVGVybWluYXRlIGF1dG8tcmVjb25uZWN0IHByb2Nlc3MuXG4gIGZ1bmN0aW9uIGJvZmZTdG9wKCkge1xuICAgIGNsZWFyVGltZW91dChfYm9mZlRpbWVyKTtcbiAgICBfYm9mZlRpbWVyID0gbnVsbDtcbiAgfVxuXG4gIC8vIFJlc2V0IGF1dG8tcmVjb25uZWN0IGl0ZXJhdGlvbiBjb3VudGVyLlxuICBmdW5jdGlvbiBib2ZmUmVzZXQoKSB7XG4gICAgX2JvZmZJdGVyYXRpb24gPSAwO1xuICB9XG5cbiAgLy8gSW5pdGlhbGl6YXRpb24gZm9yIFdlYnNvY2tldFxuICBmdW5jdGlvbiBpbml0X3dzKGluc3RhbmNlKSB7XG4gICAgbGV0IF9zb2NrZXQgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogSW5pdGlhdGUgYSBuZXcgY29ubmVjdGlvblxuICAgICAqIEBtZW1iZXJvZiBUaW5vZGUuQ29ubmVjdGlvbiNcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaG9zdF8gSG9zdCBuYW1lIHRvIGNvbm5lY3QgdG87IGlmIDxjb2RlPm51bGw8L2NvZGU+IHRoZSBvbGQgaG9zdCBuYW1lIHdpbGwgYmUgdXNlZC5cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvcmNlIEZvcmNlIG5ldyBjb25uZWN0aW9uIGV2ZW4gaWYgb25lIGFscmVhZHkgZXhpc3RzLlxuICAgICAqIEByZXR1cm4ge1Byb21pc2V9IFByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgY29ubmVjdGlvbiBjYWxsIGNvbXBsZXRlcywgcmVzb2x1dGlvbiBpcyBjYWxsZWQgd2l0aG91dFxuICAgICAqICBwYXJhbWV0ZXJzLCByZWplY3Rpb24gcGFzc2VzIHRoZSB7RXJyb3J9IGFzIHBhcmFtZXRlci5cbiAgICAgKi9cbiAgICBpbnN0YW5jZS5jb25uZWN0ID0gZnVuY3Rpb24oaG9zdF8sIGZvcmNlKSB7XG4gICAgICBfYm9mZkNsb3NlZCA9IGZhbHNlO1xuXG4gICAgICBpZiAoX3NvY2tldCkge1xuICAgICAgICBpZiAoIWZvcmNlICYmIF9zb2NrZXQucmVhZHlTdGF0ZSA9PSBfc29ja2V0Lk9QRU4pIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgX3NvY2tldC5jbG9zZSgpO1xuICAgICAgICBfc29ja2V0ID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgaWYgKGhvc3RfKSB7XG4gICAgICAgIGhvc3QgPSBob3N0XztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBjb25zdCB1cmwgPSBtYWtlQmFzZVVybChob3N0LCBzZWN1cmUgPyAnd3NzJyA6ICd3cycsIHZlcnNpb24sIGFwaUtleSk7XG5cbiAgICAgICAgbG9nKFwiQ29ubmVjdGluZyB0bzogXCIsIHVybCk7XG5cbiAgICAgICAgLy8gSXQgdGhyb3dzIHdoZW4gdGhlIHNlcnZlciBpcyBub3QgYWNjZXNzaWJsZSBidXQgdGhlIGV4Y2VwdGlvbiBjYW5ub3QgYmUgY2F1Z2h0OlxuICAgICAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8zMTAwMjU5Mi9qYXZhc2NyaXB0LWRvZXNudC1jYXRjaC1lcnJvci1pbi13ZWJzb2NrZXQtaW5zdGFudGlhdGlvbi8zMTAwMzA1N1xuICAgICAgICBjb25zdCBjb25uID0gbmV3IFdlYlNvY2tldFByb3ZpZGVyKHVybCk7XG5cbiAgICAgICAgY29ubi5vbmVycm9yID0gZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH1cblxuICAgICAgICBjb25uLm9ub3BlbiA9IGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICAgIGlmIChhdXRvcmVjb25uZWN0KSB7XG4gICAgICAgICAgICBib2ZmU3RvcCgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChpbnN0YW5jZS5vbk9wZW4pIHtcbiAgICAgICAgICAgIGluc3RhbmNlLm9uT3BlbigpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbm4ub25jbG9zZSA9IGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICAgIF9zb2NrZXQgPSBudWxsO1xuXG4gICAgICAgICAgaWYgKGluc3RhbmNlLm9uRGlzY29ubmVjdCkge1xuICAgICAgICAgICAgY29uc3QgY29kZSA9IF9ib2ZmQ2xvc2VkID8gTkVUV09SS19VU0VSIDogTkVUV09SS19FUlJPUjtcbiAgICAgICAgICAgIGluc3RhbmNlLm9uRGlzY29ubmVjdChuZXcgRXJyb3IoX2JvZmZDbG9zZWQgPyBORVRXT1JLX1VTRVJfVEVYVCA6IE5FVFdPUktfRVJST1JfVEVYVCArXG4gICAgICAgICAgICAgICcgKCcgKyBjb2RlICsgJyknKSwgY29kZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCFfYm9mZkNsb3NlZCAmJiBhdXRvcmVjb25uZWN0KSB7XG4gICAgICAgICAgICBib2ZmUmVjb25uZWN0LmNhbGwoaW5zdGFuY2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbm4ub25tZXNzYWdlID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgICAgaWYgKGluc3RhbmNlLm9uTWVzc2FnZSkge1xuICAgICAgICAgICAgaW5zdGFuY2Uub25NZXNzYWdlKGV2dC5kYXRhKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgX3NvY2tldCA9IGNvbm47XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUcnkgdG8gcmVzdG9yZSBhIG5ldHdvcmsgY29ubmVjdGlvbiwgYWxzbyByZXNldCBiYWNrb2ZmLlxuICAgICAqIEBtZW1iZXJvZiBUaW5vZGUuQ29ubmVjdGlvbiNcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZm9yY2UgLSByZWNvbm5lY3QgZXZlbiBpZiB0aGVyZSBpcyBhIGxpdmUgY29ubmVjdGlvbiBhbHJlYWR5LlxuICAgICAqL1xuICAgIGluc3RhbmNlLnJlY29ubmVjdCA9IGZ1bmN0aW9uKGZvcmNlKSB7XG4gICAgICBib2ZmU3RvcCgpO1xuICAgICAgaW5zdGFuY2UuY29ubmVjdChudWxsLCBmb3JjZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGVybWluYXRlIHRoZSBuZXR3b3JrIGNvbm5lY3Rpb25cbiAgICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAgICovXG4gICAgaW5zdGFuY2UuZGlzY29ubmVjdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgX2JvZmZDbG9zZWQgPSB0cnVlO1xuICAgICAgYm9mZlN0b3AoKTtcblxuICAgICAgaWYgKCFfc29ja2V0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIF9zb2NrZXQuY2xvc2UoKTtcbiAgICAgIF9zb2NrZXQgPSBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNlbmQgYSBzdHJpbmcgdG8gdGhlIHNlcnZlci5cbiAgICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbXNnIC0gU3RyaW5nIHRvIHNlbmQuXG4gICAgICogQHRocm93cyBUaHJvd3MgYW4gZXhjZXB0aW9uIGlmIHRoZSB1bmRlcmx5aW5nIGNvbm5lY3Rpb24gaXMgbm90IGxpdmUuXG4gICAgICovXG4gICAgaW5zdGFuY2Uuc2VuZFRleHQgPSBmdW5jdGlvbihtc2cpIHtcbiAgICAgIGlmIChfc29ja2V0ICYmIChfc29ja2V0LnJlYWR5U3RhdGUgPT0gX3NvY2tldC5PUEVOKSkge1xuICAgICAgICBfc29ja2V0LnNlbmQobXNnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIldlYnNvY2tldCBpcyBub3QgY29ubmVjdGVkXCIpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiBzb2NrZXQgaXMgYWxpdmUuXG4gICAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uI1xuICAgICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiBjb25uZWN0aW9uIGlzIGxpdmUsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAgICovXG4gICAgaW5zdGFuY2UuaXNDb25uZWN0ZWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAoX3NvY2tldCAmJiAoX3NvY2tldC5yZWFkeVN0YXRlID09IF9zb2NrZXQuT1BFTikpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgbmFtZSBvZiB0aGUgY3VycmVudCBuZXR3b3JrIHRyYW5zcG9ydC5cbiAgICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAgICogQHJldHVybnMge3N0cmluZ30gbmFtZSBvZiB0aGUgdHJhbnNwb3J0IHN1Y2ggYXMgPGNvZGU+XCJ3c1wiPC9jb2RlPiBvciA8Y29kZT5cImxwXCI8L2NvZGU+LlxuICAgICAqL1xuICAgIGluc3RhbmNlLnRyYW5zcG9ydCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICd3cyc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2VuZCBuZXR3b3JrIHByb2JlIHRvIGNoZWNrIGlmIGNvbm5lY3Rpb24gaXMgaW5kZWVkIGxpdmUuXG4gICAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uI1xuICAgICAqL1xuICAgIGluc3RhbmNlLnByb2JlID0gZnVuY3Rpb24oKSB7XG4gICAgICBpbnN0YW5jZS5zZW5kVGV4dCgnMScpO1xuICAgIH1cbiAgfVxuXG4gIC8vIEluaXRpYWxpemF0aW9uIGZvciBsb25nIHBvbGxpbmcuXG4gIGZ1bmN0aW9uIGluaXRfbHAoaW5zdGFuY2UpIHtcbiAgICBjb25zdCBYRFJfVU5TRU5UID0gMDsgLy8gQ2xpZW50IGhhcyBiZWVuIGNyZWF0ZWQuIG9wZW4oKSBub3QgY2FsbGVkIHlldC5cbiAgICBjb25zdCBYRFJfT1BFTkVEID0gMTsgLy8gb3BlbigpIGhhcyBiZWVuIGNhbGxlZC5cbiAgICBjb25zdCBYRFJfSEVBREVSU19SRUNFSVZFRCA9IDI7IC8vIHNlbmQoKSBoYXMgYmVlbiBjYWxsZWQsIGFuZCBoZWFkZXJzIGFuZCBzdGF0dXMgYXJlIGF2YWlsYWJsZS5cbiAgICBjb25zdCBYRFJfTE9BRElORyA9IDM7IC8vIERvd25sb2FkaW5nOyByZXNwb25zZVRleHQgaG9sZHMgcGFydGlhbCBkYXRhLlxuICAgIGNvbnN0IFhEUl9ET05FID0gNDsgLy8gVGhlIG9wZXJhdGlvbiBpcyBjb21wbGV0ZS5cbiAgICAvLyBGdWxseSBjb21wb3NlZCBlbmRwb2ludCBVUkwsIHdpdGggQVBJIGtleSAmIFNJRFxuICAgIGxldCBfbHBVUkwgPSBudWxsO1xuXG4gICAgbGV0IF9wb2xsZXIgPSBudWxsO1xuICAgIGxldCBfc2VuZGVyID0gbnVsbDtcblxuICAgIGZ1bmN0aW9uIGxwX3NlbmRlcih1cmxfKSB7XG4gICAgICBsZXQgc2VuZGVyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICBzZW5kZXIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgIGlmIChzZW5kZXIucmVhZHlTdGF0ZSA9PSBYRFJfRE9ORSAmJiBzZW5kZXIuc3RhdHVzID49IDQwMCkge1xuICAgICAgICAgIC8vIFNvbWUgc29ydCBvZiBlcnJvciByZXNwb25zZVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgTFAgc2VuZGVyIGZhaWxlZCwgJHtzZW5kZXIuc3RhdHVzfWApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHNlbmRlci5vcGVuKCdQT1NUJywgdXJsXywgdHJ1ZSk7XG4gICAgICByZXR1cm4gc2VuZGVyO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxwX3BvbGxlcih1cmxfLCByZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIGxldCBwb2xsZXIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgIGxldCBwcm9taXNlQ29tcGxldGVkID0gZmFsc2U7XG5cbiAgICAgIHBvbGxlci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbihldnQpIHtcblxuICAgICAgICBpZiAocG9sbGVyLnJlYWR5U3RhdGUgPT0gWERSX0RPTkUpIHtcbiAgICAgICAgICBpZiAocG9sbGVyLnN0YXR1cyA9PSAyMDEpIHsgLy8gMjAxID09IEhUVFAuQ3JlYXRlZCwgZ2V0IFNJRFxuICAgICAgICAgICAgbGV0IHBrdCA9IEpTT04ucGFyc2UocG9sbGVyLnJlc3BvbnNlVGV4dCwganNvblBhcnNlSGVscGVyKTtcbiAgICAgICAgICAgIF9scFVSTCA9IHVybF8gKyAnJnNpZD0nICsgcGt0LmN0cmwucGFyYW1zLnNpZFxuICAgICAgICAgICAgcG9sbGVyID0gbHBfcG9sbGVyKF9scFVSTCk7XG4gICAgICAgICAgICBwb2xsZXIuc2VuZChudWxsKVxuICAgICAgICAgICAgaWYgKGluc3RhbmNlLm9uT3Blbikge1xuICAgICAgICAgICAgICBpbnN0YW5jZS5vbk9wZW4oKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHJlc29sdmUpIHtcbiAgICAgICAgICAgICAgcHJvbWlzZUNvbXBsZXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGF1dG9yZWNvbm5lY3QpIHtcbiAgICAgICAgICAgICAgYm9mZlN0b3AoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKHBvbGxlci5zdGF0dXMgPCA0MDApIHsgLy8gNDAwID0gSFRUUC5CYWRSZXF1ZXN0XG4gICAgICAgICAgICBpZiAoaW5zdGFuY2Uub25NZXNzYWdlKSB7XG4gICAgICAgICAgICAgIGluc3RhbmNlLm9uTWVzc2FnZShwb2xsZXIucmVzcG9uc2VUZXh0KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcG9sbGVyID0gbHBfcG9sbGVyKF9scFVSTCk7XG4gICAgICAgICAgICBwb2xsZXIuc2VuZChudWxsKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gRG9uJ3QgdGhyb3cgYW4gZXJyb3IgaGVyZSwgZ3JhY2VmdWxseSBoYW5kbGUgc2VydmVyIGVycm9yc1xuICAgICAgICAgICAgaWYgKHJlamVjdCAmJiAhcHJvbWlzZUNvbXBsZXRlZCkge1xuICAgICAgICAgICAgICBwcm9taXNlQ29tcGxldGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgcmVqZWN0KHBvbGxlci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGluc3RhbmNlLm9uTWVzc2FnZSAmJiBwb2xsZXIucmVzcG9uc2VUZXh0KSB7XG4gICAgICAgICAgICAgIGluc3RhbmNlLm9uTWVzc2FnZShwb2xsZXIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpbnN0YW5jZS5vbkRpc2Nvbm5lY3QpIHtcbiAgICAgICAgICAgICAgY29uc3QgY29kZSA9IHBvbGxlci5zdGF0dXMgfHwgKF9ib2ZmQ2xvc2VkID8gTkVUV09SS19VU0VSIDogTkVUV09SS19FUlJPUik7XG4gICAgICAgICAgICAgIGNvbnN0IHRleHQgPSBwb2xsZXIucmVzcG9uc2VUZXh0IHx8IChfYm9mZkNsb3NlZCA/IE5FVFdPUktfVVNFUl9URVhUIDogTkVUV09SS19FUlJPUl9URVhUKTtcbiAgICAgICAgICAgICAgaW5zdGFuY2Uub25EaXNjb25uZWN0KG5ldyBFcnJvcih0ZXh0ICsgJyAoJyArIGNvZGUgKyAnKScpLCBjb2RlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gUG9sbGluZyBoYXMgc3RvcHBlZC4gSW5kaWNhdGUgaXQgYnkgc2V0dGluZyBwb2xsZXIgdG8gbnVsbC5cbiAgICAgICAgICAgIHBvbGxlciA9IG51bGw7XG4gICAgICAgICAgICBpZiAoIV9ib2ZmQ2xvc2VkICYmIGF1dG9yZWNvbm5lY3QpIHtcbiAgICAgICAgICAgICAgYm9mZlJlY29ubmVjdC5jYWxsKGluc3RhbmNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHBvbGxlci5vcGVuKCdHRVQnLCB1cmxfLCB0cnVlKTtcbiAgICAgIHJldHVybiBwb2xsZXI7XG4gICAgfVxuXG4gICAgaW5zdGFuY2UuY29ubmVjdCA9IGZ1bmN0aW9uKGhvc3RfLCBmb3JjZSkge1xuICAgICAgX2JvZmZDbG9zZWQgPSBmYWxzZTtcblxuICAgICAgaWYgKF9wb2xsZXIpIHtcbiAgICAgICAgaWYgKCFmb3JjZSkge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgICAgICBfcG9sbGVyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgX3BvbGxlci5hYm9ydCgpO1xuICAgICAgICBfcG9sbGVyID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgaWYgKGhvc3RfKSB7XG4gICAgICAgIGhvc3QgPSBob3N0XztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBjb25zdCB1cmwgPSBtYWtlQmFzZVVybChob3N0LCBzZWN1cmUgPyAnaHR0cHMnIDogJ2h0dHAnLCB2ZXJzaW9uLCBhcGlLZXkpO1xuICAgICAgICBsb2coXCJDb25uZWN0aW5nIHRvOiBcIiwgdXJsKTtcbiAgICAgICAgX3BvbGxlciA9IGxwX3BvbGxlcih1cmwsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIF9wb2xsZXIuc2VuZChudWxsKVxuICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICBsb2coXCJMUCBjb25uZWN0aW9uIGZhaWxlZDpcIiwgZXJyKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBpbnN0YW5jZS5yZWNvbm5lY3QgPSBmdW5jdGlvbihmb3JjZSkge1xuICAgICAgYm9mZlN0b3AoKTtcbiAgICAgIGluc3RhbmNlLmNvbm5lY3QobnVsbCwgZm9yY2UpO1xuICAgIH07XG5cbiAgICBpbnN0YW5jZS5kaXNjb25uZWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgICBfYm9mZkNsb3NlZCA9IHRydWU7XG4gICAgICBib2ZmU3RvcCgpO1xuXG4gICAgICBpZiAoX3NlbmRlcikge1xuICAgICAgICBfc2VuZGVyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgX3NlbmRlci5hYm9ydCgpO1xuICAgICAgICBfc2VuZGVyID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIGlmIChfcG9sbGVyKSB7XG4gICAgICAgIF9wb2xsZXIub25yZWFkeXN0YXRlY2hhbmdlID0gdW5kZWZpbmVkO1xuICAgICAgICBfcG9sbGVyLmFib3J0KCk7XG4gICAgICAgIF9wb2xsZXIgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBpZiAoaW5zdGFuY2Uub25EaXNjb25uZWN0KSB7XG4gICAgICAgIGluc3RhbmNlLm9uRGlzY29ubmVjdChuZXcgRXJyb3IoTkVUV09SS19VU0VSX1RFWFQgKyAnICgnICsgTkVUV09SS19VU0VSICsgJyknKSwgTkVUV09SS19VU0VSKTtcbiAgICAgIH1cbiAgICAgIC8vIEVuc3VyZSBpdCdzIHJlY29uc3RydWN0ZWRcbiAgICAgIF9scFVSTCA9IG51bGw7XG4gICAgfVxuXG4gICAgaW5zdGFuY2Uuc2VuZFRleHQgPSBmdW5jdGlvbihtc2cpIHtcbiAgICAgIF9zZW5kZXIgPSBscF9zZW5kZXIoX2xwVVJMKTtcbiAgICAgIGlmIChfc2VuZGVyICYmIChfc2VuZGVyLnJlYWR5U3RhdGUgPT0gMSkpIHsgLy8gMSA9PSBPUEVORURcbiAgICAgICAgX3NlbmRlci5zZW5kKG1zZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJMb25nIHBvbGxlciBmYWlsZWQgdG8gY29ubmVjdFwiKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaW5zdGFuY2UuaXNDb25uZWN0ZWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAoX3BvbGxlciAmJiB0cnVlKTtcbiAgICB9XG5cbiAgICBpbnN0YW5jZS50cmFuc3BvcnQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAnbHAnO1xuICAgIH1cblxuICAgIGluc3RhbmNlLnByb2JlID0gZnVuY3Rpb24oKSB7XG4gICAgICBpbnN0YW5jZS5zZW5kVGV4dCgnMScpO1xuICAgIH1cbiAgfVxuXG4gIGxldCBpbml0aWFsaXplZCA9IGZhbHNlO1xuICBpZiAodHJhbnNwb3J0XyA9PT0gJ2xwJykge1xuICAgIC8vIGV4cGxpY2l0IHJlcXVlc3QgdG8gdXNlIGxvbmcgcG9sbGluZ1xuICAgIGluaXRfbHAodGhpcyk7XG4gICAgaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICB9IGVsc2UgaWYgKHRyYW5zcG9ydF8gPT09ICd3cycpIHtcbiAgICAvLyBleHBsaWNpdCByZXF1ZXN0IHRvIHVzZSB3ZWIgc29ja2V0XG4gICAgLy8gaWYgd2Vic29ja2V0cyBhcmUgbm90IGF2YWlsYWJsZSwgaG9ycmlibGUgdGhpbmdzIHdpbGwgaGFwcGVuXG4gICAgaW5pdF93cyh0aGlzKTtcbiAgICBpbml0aWFsaXplZCA9IHRydWU7XG5cbiAgICAvLyBEZWZhdWx0IHRyYW5zcG9ydCBzZWxlY3Rpb25cbiAgfSBlbHNlIGlmICh0eXBlb2Ygd2luZG93ID09ICdvYmplY3QnKSB7XG4gICAgaWYgKHdpbmRvd1snV2ViU29ja2V0J10pIHtcbiAgICAgIC8vIFVzaW5nIHdlYiBzb2NrZXRzIC0tIGRlZmF1bHQuXG4gICAgICBpbml0X3dzKHRoaXMpO1xuICAgICAgaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAod2luZG93WydYTUxIdHRwUmVxdWVzdCddKSB7XG4gICAgICAvLyBUaGUgYnJvd3NlciBoYXMgbm8gd2Vic29ja2V0cywgdXNpbmcgbG9uZyBwb2xsaW5nLlxuICAgICAgaW5pdF9scCh0aGlzKTtcbiAgICAgIGluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBpZiAoIWluaXRpYWxpemVkKSB7XG4gICAgLy8gTm8gdHJhbnNwb3J0IGlzIGF2YWlpbGFibGUuXG4gICAgbG9nKFwiTm8gbmV0d29yayB0cmFuc3BvcnQgaXMgYXZhaWxhYmxlLiBSdW5uaW5nIHVuZGVyIE5vZGU/IENhbGwgJ1Rpbm9kZS5zZXROZXR3b3JrUHJvdmlkZXJzKCknLlwiKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyBuZXR3b3JrIHRyYW5zcG9ydCBpcyBhdmFpbGFibGUuIFJ1bm5pbmcgdW5kZXIgTm9kZT8gQ2FsbCAnVGlub2RlLnNldE5ldHdvcmtQcm92aWRlcnMoKScuXCIpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiBuZXR3b3JrIHRyYW5zcG9ydCBpcyBhdmFpbGFibGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ29ubmVjdGlvbiNcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRyYW5zIC0gZWl0aGVyIDxjb2RlPlwid3NcIjwvY29kZT4gKHdlYnNvY2tldCkgb3IgPGNvZGU+XCJscFwiPC9jb2RlPiAobG9uZyBwb2xsaW5nKS5cbiAgICogQHJldHVybnMgdHJ1ZSBpZiBnaXZlbiB0cmFuc3BvcnQgaXMgYXZhaWxhYmxlLCBmYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICB0aGlzLnRyYW5zcG9ydEF2YWlsYWJsZSA9IGZ1bmN0aW9uKHRyYW5zcCkge1xuICAgIHN3aXRjaCAodHJhbnNwKSB7XG4gICAgICBjYXNlICd3cyc6XG4gICAgICAgIHJldHVybiB0eXBlb2Ygd2luZG93ID09ICdvYmplY3QnICYmIHdpbmRvd1snV2ViU29ja2V0J107XG4gICAgICBjYXNlICdscCc6XG4gICAgICAgIHJldHVybiB0eXBlb2Ygd2luZG93ID09ICdvYmplY3QnICYmIHdpbmRvd1snWE1MSHR0cFJlcXVlc3QnXTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGxvZyhcIlJlcXVlc3QgZm9yIHVua25vd24gdHJhbnNwb3J0XCIsIHRyYW5zcCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVzZXQgYXV0b3JlY29ubmVjdCBjb3VudGVyIHRvIHplcm8uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ29ubmVjdGlvbiNcbiAgICovXG4gIHRoaXMuYmFja29mZlJlc2V0ID0gZnVuY3Rpb24oKSB7XG4gICAgYm9mZlJlc2V0KCk7XG4gIH1cblxuICAvLyBDYWxsYmFja3M6XG4gIC8qKlxuICAgKiBBIGNhbGxiYWNrIHRvIHBhc3MgaW5jb21pbmcgbWVzc2FnZXMgdG8uIFNlZSB7QGxpbmsgVGlub2RlLkNvbm5lY3Rpb24jb25NZXNzYWdlfS5cbiAgICogQGNhbGxiYWNrIFRpbm9kZS5Db25uZWN0aW9uLk9uTWVzc2FnZVxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgLSBNZXNzYWdlIHRvIHByb2Nlc3MuXG4gICAqL1xuICAvKipcbiAgICogQSBjYWxsYmFjayB0byBwYXNzIGluY29taW5nIG1lc3NhZ2VzIHRvLlxuICAgKiBAdHlwZSB7VGlub2RlLkNvbm5lY3Rpb24uT25NZXNzYWdlfVxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAqL1xuICB0aGlzLm9uTWVzc2FnZSA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQSBjYWxsYmFjayBmb3IgcmVwb3J0aW5nIGEgZHJvcHBlZCBjb25uZWN0aW9uLlxuICAgKiBAdHlwZSB7ZnVuY3Rpb259XG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ29ubmVjdGlvbiNcbiAgICovXG4gIHRoaXMub25EaXNjb25uZWN0ID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBBIGNhbGxiYWNrIGNhbGxlZCB3aGVuIHRoZSBjb25uZWN0aW9uIGlzIHJlYWR5IHRvIGJlIHVzZWQgZm9yIHNlbmRpbmcuIEZvciB3ZWJzb2NrZXRzIGl0J3Mgc29ja2V0IG9wZW4sXG4gICAqIGZvciBsb25nIHBvbGxpbmcgaXQncyA8Y29kZT5yZWFkeVN0YXRlPTE8L2NvZGU+IChPUEVORUQpXG4gICAqIEB0eXBlIHtmdW5jdGlvbn1cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uI1xuICAgKi9cbiAgdGhpcy5vbk9wZW4gPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIEEgY2FsbGJhY2sgdG8gbm90aWZ5IG9mIHJlY29ubmVjdGlvbiBhdHRlbXB0cy4gU2VlIHtAbGluayBUaW5vZGUuQ29ubmVjdGlvbiNvbkF1dG9yZWNvbm5lY3RJdGVyYXRpb259LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb25cbiAgICogQGNhbGxiYWNrIEF1dG9yZWNvbm5lY3RJdGVyYXRpb25UeXBlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0aW1lb3V0IC0gdGltZSB0aWxsIHRoZSBuZXh0IHJlY29ubmVjdCBhdHRlbXB0IGluIG1pbGxpc2Vjb25kcy4gPGNvZGU+LTE8L2NvZGU+IG1lYW5zIHJlY29ubmVjdCB3YXMgc2tpcHBlZC5cbiAgICogQHBhcmFtIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkIG9yIHJlamVjdGVkIHdoZW4gdGhlIHJlY29ubmVjdCBhdHRlbXAgY29tcGxldGVzLlxuICAgKlxuICAgKi9cbiAgLyoqXG4gICAqIEEgY2FsbGJhY2sgdG8gaW5mb3JtIHdoZW4gdGhlIG5leHQgYXR0YW1wdCB0byByZWNvbm5lY3Qgd2lsbCBoYXBwZW4gYW5kIHRvIHJlY2VpdmUgY29ubmVjdGlvbiBwcm9taXNlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAqIEB0eXBlIHtUaW5vZGUuQ29ubmVjdGlvbi5BdXRvcmVjb25uZWN0SXRlcmF0aW9uVHlwZX1cbiAgICovXG4gIHRoaXMub25BdXRvcmVjb25uZWN0SXRlcmF0aW9uID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBBIGNhbGxiYWNrIHRvIGxvZyBldmVudHMgZnJvbSBDb25uZWN0aW9uLiBTZWUge0BsaW5rIFRpbm9kZS5Db25uZWN0aW9uI2xvZ2dlcn0uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ29ubmVjdGlvblxuICAgKiBAY2FsbGJhY2sgTG9nZ2VyQ2FsbGJhY2tUeXBlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudCAtIEV2ZW50IHRvIGxvZy5cbiAgICovXG4gIC8qKlxuICAgKiBBIGNhbGxiYWNrIHRvIHJlcG9ydCBsb2dnaW5nIGV2ZW50cy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uI1xuICAgKiBAdHlwZSB7VGlub2RlLkNvbm5lY3Rpb24uTG9nZ2VyQ2FsbGJhY2tUeXBlfVxuICAgKi9cbiAgdGhpcy5sb2dnZXIgPSB1bmRlZmluZWQ7XG59O1xuXG4vKipcbiAqIFRvIHVzZSBDb25uZWN0aW9uIGluIGEgbm9uIGJyb3dzZXIgY29udGV4dCwgc3VwcGx5IFdlYlNvY2tldCBhbmQgWE1MSHR0cFJlcXVlc3QgcHJvdmlkZXJzLlxuICogQHN0YXRpY1xuICogQG1lbWJlcm9mIENvbm5lY3Rpb25cbiAqIEBwYXJhbSB3c1Byb3ZpZGVyIFdlYlNvY2tldCBwcm92aWRlciwgZS5nLiBmb3Igbm9kZUpTICwgPGNvZGU+cmVxdWlyZSgnd3MnKTwvY29kZT4uXG4gKiBAcGFyYW0geGhyUHJvdmlkZXIgWE1MSHR0cFJlcXVlc3QgcHJvdmlkZXIsIGUuZy4gZm9yIG5vZGUgPGNvZGU+cmVxdWlyZSgneGhyJyk8L2NvZGU+LlxuICovXG5Db25uZWN0aW9uLnNldE5ldHdvcmtQcm92aWRlcnMgPSBmdW5jdGlvbih3c1Byb3ZpZGVyLCB4aHJQcm92aWRlcikge1xuICBXZWJTb2NrZXRQcm92aWRlciA9IHdzUHJvdmlkZXI7XG4gIFhIUlByb3ZpZGVyID0geGhyUHJvdmlkZXI7XG59O1xuXG5Db25uZWN0aW9uLk5FVFdPUktfRVJST1IgPSBORVRXT1JLX0VSUk9SO1xuQ29ubmVjdGlvbi5ORVRXT1JLX0VSUk9SX1RFWFQgPSBORVRXT1JLX0VSUk9SX1RFWFQ7XG5Db25uZWN0aW9uLk5FVFdPUktfVVNFUiA9IE5FVFdPUktfVVNFUjtcbkNvbm5lY3Rpb24uTkVUV09SS19VU0VSX1RFWFQgPSBORVRXT1JLX1VTRVJfVEVYVDtcblxuaWYgKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBDb25uZWN0aW9uO1xufVxuIiwiLyoqXG4gKiBAZmlsZSBIZWxwZXIgbWV0aG9kcyBmb3IgZGVhbGluZyB3aXRoIEluZGV4ZWREQiBjYWNoZSBvZiBtZXNzYWdlcywgdXNlcnMsIGFuZCB0b3BpY3MuXG4gKiBTZWUgPGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS90aW5vZGUvd2ViYXBwXCI+aHR0cHM6Ly9naXRodWIuY29tL3Rpbm9kZS93ZWJhcHA8L2E+IGZvciByZWFsLWxpZmUgdXNhZ2UuXG4gKlxuICogQGNvcHlyaWdodCAyMDE1LTIwMjEgVGlub2RlXG4gKiBAc3VtbWFyeSBKYXZhc2NyaXB0IGJpbmRpbmdzIGZvciBUaW5vZGUuXG4gKiBAbGljZW5zZSBBcGFjaGUgMi4wXG4gKiBAdmVyc2lvbiAwLjE3XG4gKi9cbid1c2Ugc3RyaWN0JztcblxuLy8gTk9URSBUTyBERVZFTE9QRVJTOlxuLy8gTG9jYWxpemFibGUgc3RyaW5ncyBzaG91bGQgYmUgZG91YmxlIHF1b3RlZCBcItGB0YLRgNC+0LrQsCDQvdCwINC00YDRg9Cz0L7QvCDRj9C30YvQutC1XCIsXG4vLyBub24tbG9jYWxpemFibGUgc3RyaW5ncyBzaG91bGQgYmUgc2luZ2xlIHF1b3RlZCAnbm9uLWxvY2FsaXplZCcuXG5cbmNvbnN0IERCX1ZFUlNJT04gPSAxO1xuY29uc3QgREJfTkFNRSA9ICd0aW5vZGUtd2ViJztcblxuY29uc3QgREIgPSBmdW5jdGlvbihvbkVycm9yLCBsb2dnZXIpIHtcbiAgb25FcnJvciA9IG9uRXJyb3IgfHwgZnVuY3Rpb24oKSB7fVxuICBsb2dnZXIgPSBsb2dnZXIgfHwgZnVuY3Rpb24oKSB7fVxuXG4gIC8vIFBsYWNlaG9sZGVyIERCIHdoaWNoIGRvZXMgbm90aGluZy5cbiAgbGV0IGRiID0gbnVsbDtcbiAgLy8gSW5kaWNhdG9yIHRoYXQgdGhlIGNhY2hlIGlzIGRpc2FibGVkLlxuICBsZXQgZGlzYWJsZWQgPSBmYWxzZTtcblxuICAvLyBTZXJpYWxpemFibGUgdG9waWMgZmllbGRzLlxuICBjb25zdCB0b3BpY19maWVsZHMgPSBbJ2NyZWF0ZWQnLCAndXBkYXRlZCcsICdkZWxldGVkJywgJ3JlYWQnLCAncmVjdicsICdzZXEnLCAnY2xlYXInLCAnZGVmYWNzJyxcbiAgICAnY3JlZHMnLCAncHVibGljJywgJ3ByaXZhdGUnLCAndG91Y2hlZCdcbiAgXTtcblxuICAvLyBDb3B5IHZhbHVlcyBmcm9tICdzcmMnIHRvICdkc3QnLiBBbGxvY2F0ZSBkc3QgaWYgJ2l0J3MgbnVsbCBvciB1bmRlZmluZWQuXG4gIGZ1bmN0aW9uIHNlcmlhbGl6ZVRvcGljKGRzdCwgc3JjKSB7XG4gICAgY29uc3QgcmVzID0gZHN0IHx8IHtcbiAgICAgIG5hbWU6IHNyYy5uYW1lXG4gICAgfTtcbiAgICB0b3BpY19maWVsZHMuZm9yRWFjaCgoZikgPT4ge1xuICAgICAgaWYgKHNyYy5oYXNPd25Qcm9wZXJ0eShmKSkge1xuICAgICAgICByZXNbZl0gPSBzcmNbZl07XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoc3JjLl90YWdzKSkge1xuICAgICAgcmVzLnRhZ3MgPSBzcmMuX3RhZ3M7XG4gICAgfVxuICAgIGlmIChzcmMuYWNzKSB7XG4gICAgICByZXMuYWNzID0gc3JjLmdldEFjY2Vzc01vZGUoKS5qc29uSGVscGVyKCk7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG4gIH1cblxuICAvLyBDb3B5IGRhdGEgZnJvbSBzcmMgdG8gVG9waWMgb2JqZWN0LlxuICBmdW5jdGlvbiBkZXNlcmlhbGl6ZVRvcGljKHRvcGljLCBzcmMpIHtcbiAgICB0b3BpY19maWVsZHMuZm9yRWFjaCgoZikgPT4ge1xuICAgICAgaWYgKHNyYy5oYXNPd25Qcm9wZXJ0eShmKSkge1xuICAgICAgICB0b3BpY1tmXSA9IHNyY1tmXTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShzcmMudGFncykpIHtcbiAgICAgIHRvcGljLl90YWdzID0gc3JjLnRhZ3M7XG4gICAgfVxuICAgIGlmIChzcmMuYWNzKSB7XG4gICAgICB0b3BpYy5zZXRBY2Nlc3NNb2RlKHNyYy5hY3MpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNlcmlhbGl6ZVN1YnNjcmlwdGlvbihkc3QsIHRvcGljTmFtZSwgdWlkLCBzdWIpIHtcbiAgICBjb25zdCBmaWVsZHMgPSBbJ3VwZGF0ZWQnLCAnbW9kZScsICdyZWFkJywgJ3JlY3YnLCAnY2xlYXInLCAnbGFzdFNlZW4nLCAndXNlckFnZW50J107XG4gICAgY29uc3QgcmVzID0gZHN0IHx8IHtcbiAgICAgIHRvcGljOiB0b3BpY05hbWUsXG4gICAgICB1aWQ6IHVpZFxuICAgIH07XG5cbiAgICBmaWVsZHMuZm9yRWFjaCgoZikgPT4ge1xuICAgICAgaWYgKHN1Yi5oYXNPd25Qcm9wZXJ0eShmKSkge1xuICAgICAgICByZXNbZl0gPSBzdWJbZl07XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgZnVuY3Rpb24gc2VyaWFsaXplTWVzc2FnZShkc3QsIG1zZykge1xuICAgIC8vIFNlcmlhbGl6YWJsZSBmaWVsZHMuXG4gICAgY29uc3QgZmllbGRzID0gWyd0b3BpYycsICdzZXEnLCAndHMnLCAnX3N0YXR1cycsICdmcm9tJywgJ2hlYWQnLCAnY29udGVudCddO1xuICAgIGNvbnN0IHJlcyA9IGRzdCB8fCB7fTtcbiAgICBmaWVsZHMuZm9yRWFjaCgoZikgPT4ge1xuICAgICAgaWYgKG1zZy5oYXNPd25Qcm9wZXJ0eShmKSkge1xuICAgICAgICByZXNbZl0gPSBtc2dbZl07XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZSBwZXJzaXN0ZW50IGNhY2hlOiBvcGVuIG9yIGNyZWF0ZS91cGdyYWRlIGlmIG5lZWRlZC5cbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gcHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBEQiBpcyBpbml0aWFsaXplZC5cbiAgICAgKi9cbiAgICBpbml0RGF0YWJhc2U6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgLy8gT3BlbiB0aGUgZGF0YWJhc2UgYW5kIGluaXRpYWxpemUgY2FsbGJhY2tzLlxuICAgICAgICBjb25zdCByZXEgPSBpbmRleGVkREIub3BlbihEQl9OQU1FLCBEQl9WRVJTSU9OKTtcbiAgICAgICAgcmVxLm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xuICAgICAgICAgIGRiID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcbiAgICAgICAgICByZXNvbHZlKGRiKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmVxLm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgICBsb2dnZXIoXCJQQ2FjaGVcIiwgXCJmYWlsZWQgdG8gaW5pdGlhbGl6ZVwiLCBldmVudCk7XG4gICAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgICAgaWYgKG9uRXJyb3IpIHtcbiAgICAgICAgICAgIG9uRXJyb3IoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJlcS5vbnVwZ3JhZGVuZWVkZWQgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgIGRiID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcblxuICAgICAgICAgIGRiLm9uZXJyb3IgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgbG9nZ2VyKFwiUENhY2hlXCIsIFwiZmFpbGVkIHRvIGNyZWF0ZSBzdG9yYWdlXCIsIGV2ZW50KTtcbiAgICAgICAgICAgIGlmIChvbkVycm9yKSB7XG4gICAgICAgICAgICAgIG9uRXJyb3IoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgLy8gSW5kaXZpZHVhbCBvYmplY3Qgc3RvcmVzLlxuXG4gICAgICAgICAgLy8gT2JqZWN0IHN0b3JlICh0YWJsZSkgZm9yIHRvcGljcy4gVGhlIHByaW1hcnkga2V5IGlzIHRvcGljIG5hbWUuXG4gICAgICAgICAgZGIuY3JlYXRlT2JqZWN0U3RvcmUoJ3RvcGljJywge1xuICAgICAgICAgICAga2V5UGF0aDogJ25hbWUnXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAvLyBVc2VycyBvYmplY3Qgc3RvcmUuIFVJRCBpcyB0aGUgcHJpbWFyeSBrZXkuXG4gICAgICAgICAgZGIuY3JlYXRlT2JqZWN0U3RvcmUoJ3VzZXInLCB7XG4gICAgICAgICAgICBrZXlQYXRoOiAndWlkJ1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgLy8gU3Vic2NyaXB0aW9ucyBvYmplY3Qgc3RvcmUgdG9waWMgPC0+IHVzZXIuIFRvcGljIG5hbWUgKyBVSUQgaXMgdGhlIHByaW1hcnkga2V5LlxuICAgICAgICAgIGRiLmNyZWF0ZU9iamVjdFN0b3JlKCdzdWJzY3JpcHRpb24nLCB7XG4gICAgICAgICAgICBrZXlQYXRoOiBbJ3RvcGljJywgJ3VpZCddXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAvLyBNZXNzYWdlcyBvYmplY3Qgc3RvcmUuIFRoZSBwcmltYXJ5IGtleSBpcyB0b3BpYyBuYW1lICsgc2VxLlxuICAgICAgICAgIGRiLmNyZWF0ZU9iamVjdFN0b3JlKCdtZXNzYWdlJywge1xuICAgICAgICAgICAga2V5UGF0aDogWyd0b3BpYycsICdzZXEnXVxuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIERlbGV0ZSBwZXJzaXN0ZW50IGNhY2hlLlxuICAgICAqL1xuICAgIGRlbGV0ZURhdGFiYXNlOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGNvbnN0IHJlcSA9IGluZGV4ZWREQi5kZWxldGVEYXRhYmFzZShEQl9OQU1FKTtcbiAgICAgICAgcmVxLm9uc3VjY2VzcyA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmVxLm9uZXJyb3IgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgIGxvZ2dlcihcIlBDYWNoZVwiLCBcImRlbGV0ZURhdGFiYXNlXCIsIGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgcGVyc2lzdGVudCBjYWNoZSBpcyByZWFkeSBmb3IgdXNlLlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiBjYWNoZSBpcyByZWFkeSwgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBpc1JlYWR5OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAhIWRiO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBEaXNhYmxlIHBlcnNpc3RlbnQgY2FjaGU6IGFsbCBvcGVyYXRpb25zIGRvIG5vdGhpbmcgYnV0IHJldHVybiBzdWNjZXNzLlxuICAgICAqL1xuICAgIGRpc2FibGU6IGZ1bmN0aW9uKCkge1xuICAgICAgZGIgPSBudWxsO1xuICAgICAgZGlzYWJsZWQgPSB0cnVlO1xuICAgIH0sXG5cbiAgICAvLyBUb3BpY3MuXG4gICAgLyoqXG4gICAgICogQWRkIG9yIHVwZGF0ZSB0b3BpYyBpbiBwZXJzaXN0ZW50IGNhY2hlLlxuICAgICAqIEBtZW1iZXJPZiBEQlxuICAgICAqIEBwYXJhbSB7VG9waWN9IHRvcGljIC0gdG9waWMgdG8gYmUgYWRkZWQgdG8gcGVyc2lzdGVudCBzdG9yYWdlLlxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgICAqL1xuICAgIHVwZFRvcGljOiBmdW5jdGlvbih0b3BpYykge1xuICAgICAgaWYgKCF0aGlzLmlzUmVhZHkoKSkge1xuICAgICAgICByZXR1cm4gZGlzYWJsZWQgP1xuICAgICAgICAgIFByb21pc2UucmVzb2x2ZSgpIDpcbiAgICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJub3QgaW5pdGlhbGl6ZWRcIikpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgY29uc3QgdHJ4ID0gZGIudHJhbnNhY3Rpb24oWyd0b3BpYyddLCAncmVhZHdyaXRlJyk7XG4gICAgICAgIHRyeC5vbmNvbXBsZXRlID0gKGV2ZW50KSA9PiB7XG4gICAgICAgICAgcmVzb2x2ZShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgICAgfTtcbiAgICAgICAgdHJ4Lm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgICBsb2dnZXIoXCJQQ2FjaGVcIiwgXCJ1cGRUb3BpY1wiLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCByZXEgPSB0cngub2JqZWN0U3RvcmUoJ3RvcGljJykuZ2V0KHRvcGljLm5hbWUpO1xuICAgICAgICByZXEub25zdWNjZXNzID0gKGV2ZW50KSA9PiB7XG4gICAgICAgICAgdHJ4Lm9iamVjdFN0b3JlKCd0b3BpYycpLnB1dChzZXJpYWxpemVUb3BpYyhyZXEucmVzdWx0LCB0b3BpYykpO1xuICAgICAgICAgIHRyeC5jb21taXQoKTtcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgdG9waWMgZnJvbSBwZXJzaXN0ZW50IGNhY2hlLlxuICAgICAqIEBtZW1iZXJPZiBEQlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gbmFtZSBvZiB0aGUgdG9waWMgdG8gcmVtb3ZlIGZyb20gZGF0YWJhc2UuXG4gICAgICogQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCBvbiBvcGVyYXRpb24gY29tcGxldGlvbi5cbiAgICAgKi9cbiAgICByZW1Ub3BpYzogZnVuY3Rpb24obmFtZSkge1xuICAgICAgaWYgKCF0aGlzLmlzUmVhZHkoKSkge1xuICAgICAgICByZXR1cm4gZGlzYWJsZWQgP1xuICAgICAgICAgIFByb21pc2UucmVzb2x2ZSgpIDpcbiAgICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJub3QgaW5pdGlhbGl6ZWRcIikpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgY29uc3QgdHJ4ID0gZGIudHJhbnNhY3Rpb24oWyd0b3BpYycsICdzdWJzY3JpcHRpb24nLCAnbWVzc2FnZSddLCAncmVhZHdyaXRlJyk7XG4gICAgICAgIHRyeC5vbmNvbXBsZXRlID0gKGV2ZW50KSA9PiB7XG4gICAgICAgICAgcmVzb2x2ZShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgICAgfTtcbiAgICAgICAgdHJ4Lm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgICBsb2dnZXIoXCJQQ2FjaGVcIiwgXCJyZW1Ub3BpY1wiLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICB9O1xuICAgICAgICB0cngub2JqZWN0U3RvcmUoJ3RvcGljJykuZGVsZXRlKElEQktleVJhbmdlLm9ubHkobmFtZSkpO1xuICAgICAgICB0cngub2JqZWN0U3RvcmUoJ3N1YnNjcmlwdGlvbicpLmRlbGV0ZShJREJLZXlSYW5nZS5ib3VuZChbbmFtZSwgJy0nXSwgW25hbWUsICd+J10pKTtcbiAgICAgICAgdHJ4Lm9iamVjdFN0b3JlKCdtZXNzYWdlJykuZGVsZXRlKElEQktleVJhbmdlLmJvdW5kKFtuYW1lLCAwXSwgW25hbWUsIE51bWJlci5NQVhfU0FGRV9JTlRFR0VSXSkpO1xuICAgICAgICB0cnguY29tbWl0KCk7XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRXhlY3V0ZSBhIGNhbGxiYWNrIGZvciBlYWNoIHN0b3JlZCB0b3BpYy5cbiAgICAgKiBAbWVtYmVyT2YgREJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAtIGZ1bmN0aW9uIHRvIGNhbGwgZm9yIGVhY2ggdG9waWMuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSB0aGUgdmFsdWUgb3IgPGNvZGU+dGhpczwvY29kZT4gaW5zaWRlIHRoZSBjYWxsYmFjay5cbiAgICAgKiBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgICAqL1xuICAgIG1hcFRvcGljczogZnVuY3Rpb24oY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICAgIGlmICghdGhpcy5pc1JlYWR5KCkpIHtcbiAgICAgICAgcmV0dXJuIGRpc2FibGVkID9cbiAgICAgICAgICBQcm9taXNlLnJlc29sdmUoW10pIDpcbiAgICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJub3QgaW5pdGlhbGl6ZWRcIikpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgY29uc3QgdHJ4ID0gZGIudHJhbnNhY3Rpb24oWyd0b3BpYyddKTtcbiAgICAgICAgdHJ4Lm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgICBsb2dnZXIoXCJQQ2FjaGVcIiwgXCJtYXBUb3BpY3NcIiwgZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgfTtcbiAgICAgICAgdHJ4Lm9iamVjdFN0b3JlKCd0b3BpYycpLmdldEFsbCgpLm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xuICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnJlc3VsdC5mb3JFYWNoKCh0b3BpYykgPT4ge1xuICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKGNvbnRleHQsIHRvcGljKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXNvbHZlKGV2ZW50LnRhcmdldC5yZXN1bHQpO1xuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENvcHkgZGF0YSBmcm9tIHNlcmlhbGl6ZWQgb2JqZWN0IHRvIHRvcGljLlxuICAgICAqIEBtZW1iZXJPZiBEQlxuICAgICAqIEBwYXJhbSB7VG9waWN9IHRvcGljIC0gdGFyZ2V0IHRvIGRlc2VyaWFsaXplIHRvLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzcmMgLSBzZXJpYWxpemVkIGRhdGEgdG8gY29weSBmcm9tLlxuICAgICAqL1xuICAgIGRlc2VyaWFsaXplVG9waWM6IGZ1bmN0aW9uKHRvcGljLCBzcmMpIHtcbiAgICAgIGRlc2VyaWFsaXplVG9waWModG9waWMsIHNyYyk7XG4gICAgfSxcblxuICAgIC8vIFVzZXJzLlxuICAgIC8qKlxuICAgICAqIEFkZCBvciB1cGRhdGUgdXNlciBvYmplY3QgaW4gdGhlIHBlcnNpc3RlbnQgY2FjaGUuXG4gICAgICogQG1lbWJlck9mIERCXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHVpZCAtIElEIG9mIHRoZSB1c2VyIHRvIHNhdmUuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHB1YiAtIHVzZXIncyA8Y29kZT5wdWJsaWM8L2NvZGU+IGluZm9ybWF0aW9uLlxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgICAqL1xuICAgIHVwZFVzZXI6IGZ1bmN0aW9uKHVpZCwgcHViKSB7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIgfHwgcHViID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gTm8gcG9pbnQgaW51cGRhdGluZyB1c2VyIHdpdGggaW52YWxpZCBkYXRhLlxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuaXNSZWFkeSgpKSB7XG4gICAgICAgIHJldHVybiBkaXNhYmxlZCA/XG4gICAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkgOlxuICAgICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIm5vdCBpbml0aWFsaXplZFwiKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBjb25zdCB0cnggPSBkYi50cmFuc2FjdGlvbihbJ3VzZXInXSwgJ3JlYWR3cml0ZScpO1xuICAgICAgICB0cngub25jb21wbGV0ZSA9IChldmVudCkgPT4ge1xuICAgICAgICAgIHJlc29sdmUoZXZlbnQudGFyZ2V0LnJlc3VsdCk7XG4gICAgICAgIH07XG4gICAgICAgIHRyeC5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgICAgbG9nZ2VyKFwiUENhY2hlXCIsIFwidXBkVXNlclwiLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICB9O1xuICAgICAgICB0cngub2JqZWN0U3RvcmUoJ3VzZXInKS5wdXQoe1xuICAgICAgICAgIHVpZDogdWlkLFxuICAgICAgICAgIHB1YmxpYzogcHViXG4gICAgICAgIH0pO1xuICAgICAgICB0cnguY29tbWl0KCk7XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIHVzZXIgZnJvbSBwZXJzaXN0ZW50IGNhY2hlLlxuICAgICAqIEBtZW1iZXJPZiBEQlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBJRCBvZiB0aGUgdXNlciB0byByZW1vdmUgZnJvbSB0aGUgY2FjaGUuXG4gICAgICogQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCBvbiBvcGVyYXRpb24gY29tcGxldGlvbi5cbiAgICAgKi9cbiAgICByZW1Vc2VyOiBmdW5jdGlvbih1aWQpIHtcbiAgICAgIGlmICghdGhpcy5pc1JlYWR5KCkpIHtcbiAgICAgICAgcmV0dXJuIGRpc2FibGVkID9cbiAgICAgICAgICBQcm9taXNlLnJlc29sdmUoKSA6XG4gICAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwibm90IGluaXRpYWxpemVkXCIpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGNvbnN0IHRyeCA9IGRiLnRyYW5zYWN0aW9uKFsndXNlciddLCAncmVhZHdyaXRlJyk7XG4gICAgICAgIHRyeC5vbmNvbXBsZXRlID0gKGV2ZW50KSA9PiB7XG4gICAgICAgICAgcmVzb2x2ZShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgICAgfTtcbiAgICAgICAgdHJ4Lm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgICBsb2dnZXIoXCJQQ2FjaGVcIiwgXCJyZW1Vc2VyXCIsIGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIH07XG4gICAgICAgIHRyeC5vYmplY3RTdG9yZSgndXNlcicpLmRlbGV0ZShJREJLZXlSYW5nZS5vbmx5KHVpZCkpO1xuICAgICAgICB0cnguY29tbWl0KCk7XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmVhZCBhIHNpbmdsZSB1c2VyIGZyb20gcGVyc2lzdGVudCBjYWNoZS5cbiAgICAgKiBAbWVtYmVyT2YgREJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gSUQgb2YgdGhlIHVzZXIgdG8gZmV0Y2ggZnJvbSBjYWNoZS5cbiAgICAgKiBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgICAqL1xuICAgIGdldFVzZXI6IGZ1bmN0aW9uKHVpZCkge1xuICAgICAgaWYgKCF0aGlzLmlzUmVhZHkoKSkge1xuICAgICAgICByZXR1cm4gZGlzYWJsZWQgP1xuICAgICAgICAgIFByb21pc2UucmVzb2x2ZSgpIDpcbiAgICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJub3QgaW5pdGlhbGl6ZWRcIikpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgY29uc3QgdHJ4ID0gZGIudHJhbnNhY3Rpb24oWyd1c2VyJ10pO1xuICAgICAgICB0cngub25jb21wbGV0ZSA9IChldmVudCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHVzZXIgPSBldmVudC50YXJnZXQucmVzdWx0O1xuICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgdXNlcjogdXNlci51aWQsXG4gICAgICAgICAgICBwdWJsaWM6IHVzZXIucHVibGljXG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHRyeC5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgICAgbG9nZ2VyKFwiUENhY2hlXCIsIFwiZ2V0VXNlclwiLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICB9O1xuICAgICAgICB0cngub2JqZWN0U3RvcmUoJ3VzZXInKS5nZXQodWlkKTtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvLyBTdWJzY3JpcHRpb25zLlxuXG4gICAgLyoqXG4gICAgICogQWRkIG9yIHVwZGF0ZSBzdWJzY3JpcHRpb24gaW4gcGVyc2lzdGVudCBjYWNoZS5cbiAgICAgKiBAbWVtYmVyT2YgREJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gbmFtZSBvZiB0aGUgdG9waWMgd2hpY2ggb3ducyB0aGUgbWVzc2FnZS5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gSUQgb2YgdGhlIHN1YnNjcmliZWQgdXNlci5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gc3ViIC0gc3Vic2NyaXB0aW9uIHRvIHNhdmUuXG4gICAgICogQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCBvbiBvcGVyYXRpb24gY29tcGxldGlvbi5cbiAgICAgKi9cbiAgICB1cGRTdWJzY3JpcHRpb246IGZ1bmN0aW9uKHRvcGljTmFtZSwgdWlkLCBzdWIpIHtcbiAgICAgIGlmICghdGhpcy5pc1JlYWR5KCkpIHtcbiAgICAgICAgcmV0dXJuIGRpc2FibGVkID9cbiAgICAgICAgICBQcm9taXNlLnJlc29sdmUoKSA6XG4gICAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwibm90IGluaXRpYWxpemVkXCIpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGNvbnN0IHRyeCA9IGRiLnRyYW5zYWN0aW9uKFsnc3Vic2NyaXB0aW9uJ10sICdyZWFkd3JpdGUnKTtcbiAgICAgICAgdHJ4Lm9uY29tcGxldGUgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgICByZXNvbHZlKGV2ZW50LnRhcmdldC5yZXN1bHQpO1xuICAgICAgICB9O1xuICAgICAgICB0cngub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgICAgIGxvZ2dlcihcIlBDYWNoZVwiLCBcInVwZFN1YnNjcmlwdGlvblwiLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICB9O1xuICAgICAgICB0cngub2JqZWN0U3RvcmUoJ3N1YnNjcmlwdGlvbicpLmdldChbdG9waWNOYW1lLCB1aWRdKS5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgICB0cngub2JqZWN0U3RvcmUoJ3N1YnNjcmlwdGlvbicpLnB1dChzZXJpYWxpemVTdWJzY3JpcHRpb24oZXZlbnQudGFyZ2V0LnJlc3VsdCwgdG9waWNOYW1lLCB1aWQsIHN1YikpO1xuICAgICAgICAgIHRyeC5jb21taXQoKTtcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlIGEgY2FsbGJhY2sgZm9yIGVhY2ggY2FjaGVkIHN1YnNjcmlwdGlvbiBpbiBhIGdpdmVuIHRvcGljLlxuICAgICAqIEBtZW1iZXJPZiBEQlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBuYW1lIG9mIHRoZSB0b3BpYyB3aGljaCBvd25zIHRoZSBzdWJzY3JpcHRpb25zLlxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0gZnVuY3Rpb24gdG8gY2FsbCBmb3IgZWFjaCBzdWJzY3JpcHRpb24uXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSB0aGUgdmFsdWUgb3IgPGNvZGU+dGhpczwvY29kZT4gaW5zaWRlIHRoZSBjYWxsYmFjay5cbiAgICAgKiBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgICAqL1xuICAgIG1hcFN1YnNjcmlwdGlvbnM6IGZ1bmN0aW9uKHRvcGljTmFtZSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICAgIGlmICghdGhpcy5pc1JlYWR5KCkpIHtcbiAgICAgICAgcmV0dXJuIGRpc2FibGVkID9cbiAgICAgICAgICBQcm9taXNlLnJlc29sdmUoW10pIDpcbiAgICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJub3QgaW5pdGlhbGl6ZWRcIikpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgY29uc3QgdHJ4ID0gZGIudHJhbnNhY3Rpb24oWydzdWJzY3JpcHRpb24nXSk7XG4gICAgICAgIHRyeC5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgICAgbG9nZ2VyKFwiUENhY2hlXCIsIFwibWFwU3Vic2NyaXB0aW9uc1wiLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICB9O1xuICAgICAgICB0cngub2JqZWN0U3RvcmUoJ3N1YnNjcmlwdGlvbicpLmdldEFsbChJREJLZXlSYW5nZS5ib3VuZChbdG9waWNOYW1lLCAnLSddLCBbdG9waWNOYW1lLCAnfiddKSkub25zdWNjZXNzID0gKGV2ZW50KSA9PiB7XG4gICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBldmVudC50YXJnZXQucmVzdWx0LmZvckVhY2goKHRvcGljKSA9PiB7XG4gICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgdG9waWMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlc29sdmUoZXZlbnQudGFyZ2V0LnJlc3VsdCk7XG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgLy8gTWVzc2FnZXMuXG5cbiAgICAvKipcbiAgICAgKiBTYXZlIG1lc3NhZ2UgdG8gcGVyc2lzdGVudCBjYWNoZS5cbiAgICAgKiBAbWVtYmVyT2YgREJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gbmFtZSBvZiB0aGUgdG9waWMgd2hpY2ggb3ducyB0aGUgbWVzc2FnZS5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gbXNnIC0gbWVzc2FnZSB0byBzYXZlLlxuICAgICAqIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gb3BlcmF0aW9uIGNvbXBsZXRpb24uXG4gICAgICovXG4gICAgYWRkTWVzc2FnZTogZnVuY3Rpb24obXNnKSB7XG4gICAgICBpZiAoIXRoaXMuaXNSZWFkeSgpKSB7XG4gICAgICAgIHJldHVybiBkaXNhYmxlZCA/XG4gICAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkgOlxuICAgICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIm5vdCBpbml0aWFsaXplZFwiKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBjb25zdCB0cnggPSBkYi50cmFuc2FjdGlvbihbJ21lc3NhZ2UnXSwgJ3JlYWR3cml0ZScpO1xuICAgICAgICB0cngub25zdWNjZXNzID0gKGV2ZW50KSA9PiB7XG4gICAgICAgICAgcmVzb2x2ZShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgICAgfTtcbiAgICAgICAgdHJ4Lm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgICBsb2dnZXIoXCJQQ2FjaGVcIiwgXCJhZGRNZXNzc2FnZVwiLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICB9O1xuICAgICAgICB0cngub2JqZWN0U3RvcmUoJ21lc3NhZ2UnKS5hZGQoc2VyaWFsaXplTWVzc2FnZShudWxsLCBtc2cpKTtcbiAgICAgICAgdHJ4LmNvbW1pdCgpO1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZSBkZWxpdmVyeSBzdGF0dXMgb2YgYSBtZXNzYWdlIHN0b3JlZCBpbiBwZXJzaXN0ZW50IGNhY2hlLlxuICAgICAqIEBtZW1iZXJPZiBEQlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBuYW1lIG9mIHRoZSB0b3BpYyB3aGljaCBvd25zIHRoZSBtZXNzYWdlLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzZXEgLSBJRCBvZiB0aGUgbWVzc2FnZSB0byB1cGRhdGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3RhdHVzIC0gbmV3IGRlbGl2ZXJ5IHN0YXR1cyBvZiB0aGUgbWVzc2FnZS5cbiAgICAgKiBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgICAqL1xuICAgIHVwZE1lc3NhZ2VTdGF0dXM6IGZ1bmN0aW9uKHRvcGljTmFtZSwgc2VxLCBzdGF0dXMpIHtcbiAgICAgIGlmICghdGhpcy5pc1JlYWR5KCkpIHtcbiAgICAgICAgcmV0dXJuIGRpc2FibGVkID9cbiAgICAgICAgICBQcm9taXNlLnJlc29sdmUoKSA6XG4gICAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwibm90IGluaXRpYWxpemVkXCIpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGNvbnN0IHRyeCA9IGRiLnRyYW5zYWN0aW9uKFsnbWVzc2FnZSddLCAncmVhZHdyaXRlJyk7XG4gICAgICAgIHRyeC5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgICByZXNvbHZlKGV2ZW50LnRhcmdldC5yZXN1bHQpO1xuICAgICAgICB9O1xuICAgICAgICB0cngub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgICAgIGxvZ2dlcihcIlBDYWNoZVwiLCBcInVwZE1lc3NhZ2VTdGF0dXNcIiwgZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgcmVxID0gdHJ4Lm9iamVjdFN0b3JlKCdtZXNzYWdlJykuZ2V0KElEQktleVJhbmdlLm9ubHkoW3RvcGljTmFtZSwgc2VxXSkpO1xuICAgICAgICByZXEub25zdWNjZXNzID0gKGV2ZW50KSA9PiB7XG4gICAgICAgICAgY29uc3Qgc3JjID0gcmVxLnJlc3VsdCB8fCBldmVudC50YXJnZXQucmVzdWx0O1xuICAgICAgICAgIGlmICghc3JjIHx8IHNyYy5fc3RhdHVzID09IHN0YXR1cykge1xuICAgICAgICAgICAgdHJ4LmNvbW1pdCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0cngub2JqZWN0U3RvcmUoJ21lc3NhZ2UnKS5wdXQoc2VyaWFsaXplTWVzc2FnZShzcmMsIHtcbiAgICAgICAgICAgIHRvcGljOiB0b3BpY05hbWUsXG4gICAgICAgICAgICBzZXE6IHNlcSxcbiAgICAgICAgICAgIF9zdGF0dXM6IHN0YXR1c1xuICAgICAgICAgIH0pKTtcbiAgICAgICAgICB0cnguY29tbWl0KCk7XG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIG9uZSBvciBtb3JlIG1lc3NhZ2VzIGZyb20gcGVyc2lzdGVudCBjYWNoZS5cbiAgICAgKiBAbWVtYmVyT2YgREJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gbmFtZSBvZiB0aGUgdG9waWMgd2hpY2ggb3ducyB0aGUgbWVzc2FnZS5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZnJvbSAtIGlkIG9mIHRoZSBtZXNzYWdlIHRvIHJlbW92ZSBvciBsb3dlciBib3VuZGFyeSB3aGVuIHJlbW92aW5nIHJhbmdlIChpbmNsdXNpdmUpLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyPX0gdG8gLSB1cHBlciBib3VuZGFyeSAoZXhjbHVzaXZlKSB3aGVuIHJlbW92aW5nIGEgcmFuZ2Ugb2YgbWVzc2FnZXMuXG4gICAgICogQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCBvbiBvcGVyYXRpb24gY29tcGxldGlvbi5cbiAgICAgKi9cbiAgICByZW1NZXNzYWdlczogZnVuY3Rpb24odG9waWNOYW1lLCBmcm9tLCB0bykge1xuICAgICAgaWYgKCF0aGlzLmlzUmVhZHkoKSkge1xuICAgICAgICByZXR1cm4gZGlzYWJsZWQgP1xuICAgICAgICAgIFByb21pc2UucmVzb2x2ZSgpIDpcbiAgICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJub3QgaW5pdGlhbGl6ZWRcIikpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgaWYgKCFmcm9tICYmICF0bykge1xuICAgICAgICAgIGZyb20gPSAwO1xuICAgICAgICAgIHRvID0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmFuZ2UgPSB0byA+IDAgPyBJREJLZXlSYW5nZS5ib3VuZChbdG9waWNOYW1lLCBmcm9tXSwgW3RvcGljTmFtZSwgdG9dLCBmYWxzZSwgdHJ1ZSkgOlxuICAgICAgICAgIElEQktleVJhbmdlLm9ubHkoW3RvcGljTmFtZSwgZnJvbV0pO1xuICAgICAgICBjb25zdCB0cnggPSBkYi50cmFuc2FjdGlvbihbJ21lc3NhZ2UnXSwgJ3JlYWR3cml0ZScpO1xuICAgICAgICB0cngub25zdWNjZXNzID0gKGV2ZW50KSA9PiB7XG4gICAgICAgICAgcmVzb2x2ZShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgICAgfTtcbiAgICAgICAgdHJ4Lm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgICBsb2dnZXIoXCJQQ2FjaGVcIiwgXCJyZW1NZXNzYWdlc1wiLCBldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xuICAgICAgICB9O1xuICAgICAgICB0cngub2JqZWN0U3RvcmUoJ21lc3NhZ2UnKS5kZWxldGUocmFuZ2UpO1xuICAgICAgICB0cnguY29tbWl0KCk7XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0cmlldmUgbWVzc2FnZXMgZnJvbSBwZXJzaXN0ZW50IHN0b3JlLlxuICAgICAqIEBtZW1iZXJPZiBEQlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBuYW1lIG9mIHRoZSB0b3BpYyB0byByZXRyaWV2ZSBtZXNzYWdlcyBmcm9tLlxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIHRvIGNhbGwgZm9yIGVhY2ggcmV0cmlldmVkIG1lc3NhZ2UuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHF1ZXJ5IC0gcGFyYW1ldGVycyBvZiB0aGUgbWVzc2FnZSByYW5nZSB0byByZXRyaWV2ZS5cbiAgICAgKiBAcGFyYW0ge251bWJlcj19IHF1ZXJ5LmZyb20gLSB0aGUgbGVhc3QgbWVzc2FnZSBJRCB0byByZXRyaWV2ZSAoaW5jbHVzaXZlKS5cbiAgICAgKiBAcGFyYW0ge251bWJlcj19IHF1ZXJ5LnRvIC0gdGhlIGdyZWF0ZXN0IG1lc3NhZ2UgSUQgdG8gcmV0cmlldmUgKGV4Y2x1c2l2ZSkuXG4gICAgICogQHBhcmFtIHtudW1iZXI9fSBxdWVyeS5saW1pdCAtIHRoZSBtYXhpbXVtIG51bWJlciBvZiBtZXNzYWdlcyB0byByZXRyaWV2ZS5cbiAgICAgKiBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIG9uIG9wZXJhdGlvbiBjb21wbGV0aW9uLlxuICAgICAqL1xuICAgIHJlYWRNZXNzYWdlczogZnVuY3Rpb24odG9waWNOYW1lLCBxdWVyeSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICAgIGlmICghdGhpcy5pc1JlYWR5KCkpIHtcbiAgICAgICAgcmV0dXJuIGRpc2FibGVkID9cbiAgICAgICAgICBQcm9taXNlLnJlc29sdmUoW10pIDpcbiAgICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJub3QgaW5pdGlhbGl6ZWRcIikpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgcXVlcnkgPSBxdWVyeSB8fCB7fTtcbiAgICAgICAgY29uc3QgZnJvbSA9IHF1ZXJ5LmZyb20gPiAwID8gcXVlcnkuZnJvbSA6IDA7XG4gICAgICAgIGNvbnN0IHRvID0gcXVlcnkudG8gPiAwID8gcXVlcnkudG8gOiBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcbiAgICAgICAgY29uc3QgbGltaXQgPSBxdWVyeS5saW1pdCB8IDA7XG5cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgICAgIGNvbnN0IHJhbmdlID0gSURCS2V5UmFuZ2UuYm91bmQoW3RvcGljTmFtZSwgZnJvbV0sIFt0b3BpY05hbWUsIHRvXSwgZmFsc2UsIHRydWUpO1xuICAgICAgICBjb25zdCB0cnggPSBkYi50cmFuc2FjdGlvbihbJ21lc3NhZ2UnXSk7XG4gICAgICAgIHRyeC5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgICAgbG9nZ2VyKFwiUENhY2hlXCIsIFwicmVhZE1lc3NhZ2VzXCIsIGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XG4gICAgICAgIH07XG4gICAgICAgIC8vIEl0ZXJhdGUgaW4gZGVzY2VuZGluZyBvcmRlci5cbiAgICAgICAgdHJ4Lm9iamVjdFN0b3JlKCdtZXNzYWdlJykub3BlbkN1cnNvcihyYW5nZSwgJ3ByZXYnKS5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgICBjb25zdCBjdXJzb3IgPSBldmVudC50YXJnZXQucmVzdWx0O1xuICAgICAgICAgIGlmIChjdXJzb3IpIHtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKGNvbnRleHQsIGN1cnNvci52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXN1bHQucHVzaChjdXJzb3IudmFsdWUpO1xuICAgICAgICAgICAgaWYgKGxpbWl0IDw9IDAgfHwgcmVzdWx0Lmxlbmd0aCA8IGxpbWl0KSB7XG4gICAgICAgICAgICAgIGN1cnNvci5jb250aW51ZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xufVxuXG5pZiAodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJykge1xuICBtb2R1bGUuZXhwb3J0cyA9IERCO1xufVxuIiwiLyoqXG4gKiBAY29weXJpZ2h0IDIwMTUtMjAyMSBUaW5vZGVcbiAqIEBzdW1tYXJ5IE1pbmltYWxseSByaWNoIHRleHQgcmVwcmVzZW50YXRpb24gYW5kIGZvcm1hdHRpbmcgZm9yIFRpbm9kZS5cbiAqIEBsaWNlbnNlIEFwYWNoZSAyLjBcbiAqIEB2ZXJzaW9uIDAuMTZcbiAqXG4gKiBAZmlsZSBCYXNpYyBwYXJzZXIgYW5kIGZvcm1hdHRlciBmb3IgdmVyeSBzaW1wbGUgdGV4dCBtYXJrdXAuIE1vc3RseSB0YXJnZXRlZCBhdFxuICogbW9iaWxlIHVzZSBjYXNlcyBzaW1pbGFyIHRvIFRlbGVncmFtLCBXaGF0c0FwcCwgYW5kIEZCIE1lc3Nlbmdlci5cbiAqXG4gKiA8cD5TdXBwb3J0cyBjb252ZXJzaW9uIG9mIHVzZXIga2V5Ym9hcmQgaW5wdXQgdG8gZm9ybWF0dGVkIHRleHQ6PC9wPlxuICogPHVsPlxuICogICA8bGk+KmFiYyogJnJhcnI7IDxiPmFiYzwvYj48L2xpPlxuICogICA8bGk+X2FiY18gJnJhcnI7IDxpPmFiYzwvaT48L2xpPlxuICogICA8bGk+fmFiY34gJnJhcnI7IDxkZWw+YWJjPC9kZWw+PC9saT5cbiAqICAgPGxpPmBhYmNgICZyYXJyOyA8dHQ+YWJjPC90dD48L2xpPlxuICogPC91bD5cbiAqIEFsc28gc3VwcG9ydHMgZm9ybXMgYW5kIGJ1dHRvbnMuXG4gKlxuICogTmVzdGVkIGZvcm1hdHRpbmcgaXMgc3VwcG9ydGVkLCBlLmcuICphYmMgX2RlZl8qIC0+IDxiPmFiYyA8aT5kZWY8L2k+PC9iPlxuICogVVJMcywgQG1lbnRpb25zLCBhbmQgI2hhc2h0YWdzIGFyZSBleHRyYWN0ZWQgYW5kIGNvbnZlcnRlZCBpbnRvIGxpbmtzLlxuICogRm9ybXMgYW5kIGJ1dHRvbnMgY2FuIGJlIGFkZGVkIHByb2NlZHVyYWxseS5cbiAqIEpTT04gZGF0YSByZXByZXNlbnRhdGlvbiBpcyBpbnNwaXJlZCBieSBEcmFmdC5qcyByYXcgZm9ybWF0dGluZy5cbiAqXG4gKlxuICogQGV4YW1wbGVcbiAqIFRleHQ6XG4gKiA8cHJlPlxuICogICAgIHRoaXMgaXMgKmJvbGQqLCBgY29kZWAgYW5kIF9pdGFsaWNfLCB+c3RyaWtlflxuICogICAgIGNvbWJpbmVkICpib2xkIGFuZCBfaXRhbGljXypcbiAqICAgICBhbiB1cmw6IGh0dHBzOi8vd3d3LmV4YW1wbGUuY29tL2FiYyNmcmFnbWVudCBhbmQgYW5vdGhlciBfd3d3LnRpbm9kZS5jb19cbiAqICAgICB0aGlzIGlzIGEgQG1lbnRpb24gYW5kIGEgI2hhc2h0YWcgaW4gYSBzdHJpbmdcbiAqICAgICBzZWNvbmQgI2hhc2h0YWdcbiAqIDwvcHJlPlxuICpcbiAqICBTYW1wbGUgSlNPTiByZXByZXNlbnRhdGlvbiBvZiB0aGUgdGV4dCBhYm92ZTpcbiAqICB7XG4gKiAgICAgXCJ0eHRcIjogXCJ0aGlzIGlzIGJvbGQsIGNvZGUgYW5kIGl0YWxpYywgc3RyaWtlIGNvbWJpbmVkIGJvbGQgYW5kIGl0YWxpYyBhbiB1cmw6IGh0dHBzOi8vd3d3LmV4YW1wbGUuY29tL2FiYyNmcmFnbWVudCBcIiArXG4gKiAgICAgICAgICAgICBcImFuZCBhbm90aGVyIHd3dy50aW5vZGUuY28gdGhpcyBpcyBhIEBtZW50aW9uIGFuZCBhICNoYXNodGFnIGluIGEgc3RyaW5nIHNlY29uZCAjaGFzaHRhZ1wiLFxuICogICAgIFwiZm10XCI6IFtcbiAqICAgICAgICAgeyBcImF0XCI6OCwgXCJsZW5cIjo0LFwidHBcIjpcIlNUXCIgfSx7IFwiYXRcIjoxNCwgXCJsZW5cIjo0LCBcInRwXCI6XCJDT1wiIH0seyBcImF0XCI6MjMsIFwibGVuXCI6NiwgXCJ0cFwiOlwiRU1cIn0sXG4gKiAgICAgICAgIHsgXCJhdFwiOjMxLCBcImxlblwiOjYsIFwidHBcIjpcIkRMXCIgfSx7IFwidHBcIjpcIkJSXCIsIFwibGVuXCI6MSwgXCJhdFwiOjM3IH0seyBcImF0XCI6NTYsIFwibGVuXCI6NiwgXCJ0cFwiOlwiRU1cIiB9LFxuICogICAgICAgICB7IFwiYXRcIjo0NywgXCJsZW5cIjoxNSwgXCJ0cFwiOlwiU1RcIiB9LHsgXCJ0cFwiOlwiQlJcIiwgXCJsZW5cIjoxLCBcImF0XCI6NjIgfSx7IFwiYXRcIjoxMjAsIFwibGVuXCI6MTMsIFwidHBcIjpcIkVNXCIgfSxcbiAqICAgICAgICAgeyBcImF0XCI6NzEsIFwibGVuXCI6MzYsIFwia2V5XCI6MCB9LHsgXCJhdFwiOjEyMCwgXCJsZW5cIjoxMywgXCJrZXlcIjoxIH0seyBcInRwXCI6XCJCUlwiLCBcImxlblwiOjEsIFwiYXRcIjoxMzMgfSxcbiAqICAgICAgICAgeyBcImF0XCI6MTQ0LCBcImxlblwiOjgsIFwia2V5XCI6MiB9LHsgXCJhdFwiOjE1OSwgXCJsZW5cIjo4LCBcImtleVwiOjMgfSx7IFwidHBcIjpcIkJSXCIsIFwibGVuXCI6MSwgXCJhdFwiOjE3OSB9LFxuICogICAgICAgICB7IFwiYXRcIjoxODcsIFwibGVuXCI6OCwgXCJrZXlcIjozIH0seyBcInRwXCI6XCJCUlwiLCBcImxlblwiOjEsIFwiYXRcIjoxOTUgfVxuICogICAgIF0sXG4gKiAgICAgXCJlbnRcIjogW1xuICogICAgICAgICB7IFwidHBcIjpcIkxOXCIsIFwiZGF0YVwiOnsgXCJ1cmxcIjpcImh0dHBzOi8vd3d3LmV4YW1wbGUuY29tL2FiYyNmcmFnbWVudFwiIH0gfSxcbiAqICAgICAgICAgeyBcInRwXCI6XCJMTlwiLCBcImRhdGFcIjp7IFwidXJsXCI6XCJodHRwOi8vd3d3LnRpbm9kZS5jb1wiIH0gfSxcbiAqICAgICAgICAgeyBcInRwXCI6XCJNTlwiLCBcImRhdGFcIjp7IFwidmFsXCI6XCJtZW50aW9uXCIgfSB9LFxuICogICAgICAgICB7IFwidHBcIjpcIkhUXCIsIFwiZGF0YVwiOnsgXCJ2YWxcIjpcImhhc2h0YWdcIiB9IH1cbiAqICAgICBdXG4gKiAgfVxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLy8gTk9URSBUTyBERVZFTE9QRVJTOlxuLy8gTG9jYWxpemFibGUgc3RyaW5ncyBzaG91bGQgYmUgZG91YmxlIHF1b3RlZCBcItGB0YLRgNC+0LrQsCDQvdCwINC00YDRg9Cz0L7QvCDRj9C30YvQutC1XCIsXG4vLyBub24tbG9jYWxpemFibGUgc3RyaW5ncyBzaG91bGQgYmUgc2luZ2xlIHF1b3RlZCAnbm9uLWxvY2FsaXplZCcuXG5cbmNvbnN0IE1BWF9GT1JNX0VMRU1FTlRTID0gODtcbmNvbnN0IEpTT05fTUlNRV9UWVBFID0gJ2FwcGxpY2F0aW9uL2pzb24nO1xuXG4vLyBSZWd1bGFyIGV4cHJlc3Npb25zIGZvciBwYXJzaW5nIGlubGluZSBmb3JtYXRzLiBKYXZhc2NyaXB0IGRvZXMgbm90IHN1cHBvcnQgbG9va2JlaGluZCxcbi8vIHNvIGl0J3MgYSBiaXQgbWVzc3kuXG5jb25zdCBJTkxJTkVfU1RZTEVTID0gW1xuICAvLyBTdHJvbmcgPSBib2xkLCAqYm9sZCB0ZXh0KlxuICB7XG4gICAgbmFtZTogJ1NUJyxcbiAgICBzdGFydDogLyg/Ol58W1xcV19dKShcXCopW15cXHMqXS8sXG4gICAgZW5kOiAvW15cXHMqXShcXCopKD89JHxbXFxXX10pL1xuICB9LFxuICAvLyBFbXBoZXNpemVkID0gaXRhbGljLCBfaXRhbGljIHRleHRfXG4gIHtcbiAgICBuYW1lOiAnRU0nLFxuICAgIHN0YXJ0OiAvKD86XnxcXFcpKF8pW15cXHNfXS8sXG4gICAgZW5kOiAvW15cXHNfXShfKSg/PSR8XFxXKS9cbiAgfSxcbiAgLy8gRGVsZXRlZCwgfnN0cmlrZSB0aGlzIHRob3VnaH5cbiAge1xuICAgIG5hbWU6ICdETCcsXG4gICAgc3RhcnQ6IC8oPzpefFtcXFdfXSkofilbXlxcc35dLyxcbiAgICBlbmQ6IC9bXlxcc35dKH4pKD89JHxbXFxXX10pL1xuICB9LFxuICAvLyBDb2RlIGJsb2NrIGB0aGlzIGlzIG1vbm9zcGFjZWBcbiAge1xuICAgIG5hbWU6ICdDTycsXG4gICAgc3RhcnQ6IC8oPzpefFxcVykoYClbXmBdLyxcbiAgICBlbmQ6IC9bXmBdKGApKD89JHxcXFcpL1xuICB9XG5dO1xuXG4vLyBSZWdFeHBzIGZvciBlbnRpdHkgZXh0cmFjdGlvbiAoUkYgPSByZWZlcmVuY2UpXG5jb25zdCBFTlRJVFlfVFlQRVMgPSBbXG4gIC8vIFVSTHNcbiAge1xuICAgIG5hbWU6ICdMTicsXG4gICAgZGF0YU5hbWU6ICd1cmwnLFxuICAgIHBhY2s6IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgLy8gQ2hlY2sgaWYgdGhlIHByb3RvY29sIGlzIHNwZWNpZmllZCwgaWYgbm90IHVzZSBodHRwXG4gICAgICBpZiAoIS9eW2Etel0rOlxcL1xcLy9pLnRlc3QodmFsKSkge1xuICAgICAgICB2YWwgPSAnaHR0cDovLycgKyB2YWw7XG4gICAgICB9XG4gICAgICByZXR1cm4ge1xuICAgICAgICB1cmw6IHZhbFxuICAgICAgfTtcbiAgICB9LFxuICAgIHJlOiAvKD86KD86aHR0cHM/fGZ0cCk6XFwvXFwvfHd3d1xcLnxmdHBcXC4pWy1BLVowLTkrJkAjXFwvJT1+X3wkPyE6LC5dKltBLVowLTkrJkAjXFwvJT1+X3wkXS9pZ1xuICB9LFxuICAvLyBNZW50aW9ucyBAdXNlciAobXVzdCBiZSAyIG9yIG1vcmUgY2hhcmFjdGVycylcbiAge1xuICAgIG5hbWU6ICdNTicsXG4gICAgZGF0YU5hbWU6ICd2YWwnLFxuICAgIHBhY2s6IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdmFsOiB2YWwuc2xpY2UoMSlcbiAgICAgIH07XG4gICAgfSxcbiAgICByZTogL1xcQkAoXFx3XFx3KykvZ1xuICB9LFxuICAvLyBIYXNodGFncyAjaGFzaHRhZywgbGlrZSBtZXRpb24gMiBvciBtb3JlIGNoYXJhY3RlcnMuXG4gIHtcbiAgICBuYW1lOiAnSFQnLFxuICAgIGRhdGFOYW1lOiAndmFsJyxcbiAgICBwYWNrOiBmdW5jdGlvbih2YWwpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHZhbDogdmFsLnNsaWNlKDEpXG4gICAgICB9O1xuICAgIH0sXG4gICAgcmU6IC9cXEIjKFxcd1xcdyspL2dcbiAgfVxuXTtcblxuLy8gSFRNTCB0YWcgbmFtZSBzdWdnZXN0aW9uc1xuY29uc3QgSFRNTF9UQUdTID0ge1xuICBTVDoge1xuICAgIG5hbWU6ICdiJyxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIEVNOiB7XG4gICAgbmFtZTogJ2knLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgREw6IHtcbiAgICBuYW1lOiAnZGVsJyxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIENPOiB7XG4gICAgbmFtZTogJ3R0JyxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIEJSOiB7XG4gICAgbmFtZTogJ2JyJyxcbiAgICBpc1ZvaWQ6IHRydWVcbiAgfSxcbiAgTE46IHtcbiAgICBuYW1lOiAnYScsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBNTjoge1xuICAgIG5hbWU6ICdhJyxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIEhUOiB7XG4gICAgbmFtZTogJ2EnLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgSU06IHtcbiAgICBuYW1lOiAnaW1nJyxcbiAgICBpc1ZvaWQ6IHRydWVcbiAgfSxcbiAgRk06IHtcbiAgICBuYW1lOiAnZGl2JyxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIFJXOiB7XG4gICAgbmFtZTogJ2RpdicsXG4gICAgaXNWb2lkOiBmYWxzZSxcbiAgfSxcbiAgQk46IHtcbiAgICBuYW1lOiAnYnV0dG9uJyxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIEhEOiB7XG4gICAgbmFtZTogJycsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBITDoge1xuICAgIG5hbWU6ICdzcGFuJyxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH1cbn07XG5cbi8vIENvbnZlcnQgYmFzZTY0LWVuY29kZWQgc3RyaW5nIGludG8gQmxvYi5cbmZ1bmN0aW9uIGJhc2U2NHRvT2JqZWN0VXJsKGI2NCwgY29udGVudFR5cGUsIGxvZ2dlcikge1xuICBpZiAoIWI2NCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBjb25zdCBiaW4gPSBhdG9iKGI2NCk7XG4gICAgY29uc3QgbGVuZ3RoID0gYmluLmxlbmd0aDtcbiAgICBjb25zdCBidWYgPSBuZXcgQXJyYXlCdWZmZXIobGVuZ3RoKTtcbiAgICBjb25zdCBhcnIgPSBuZXcgVWludDhBcnJheShidWYpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGFycltpXSA9IGJpbi5jaGFyQ29kZUF0KGkpO1xuICAgIH1cblxuICAgIHJldHVybiBVUkwuY3JlYXRlT2JqZWN0VVJMKG5ldyBCbG9iKFtidWZdLCB7XG4gICAgICB0eXBlOiBjb250ZW50VHlwZVxuICAgIH0pKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgaWYgKGxvZ2dlcikge1xuICAgICAgbG9nZ2VyKFwiRHJhZnR5OiBmYWlsZWQgdG8gY29udmVydCBvYmplY3QuXCIsIGVyci5tZXNzYWdlKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gYmFzZTY0dG9EYXRhVXJsKGI2NCwgY29udGVudFR5cGUpIHtcbiAgaWYgKCFiNjQpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBjb250ZW50VHlwZSA9IGNvbnRlbnRUeXBlIHx8ICdpbWFnZS9qcGVnJztcbiAgcmV0dXJuICdkYXRhOicgKyBjb250ZW50VHlwZSArICc7YmFzZTY0LCcgKyBiNjQ7XG59XG5cbi8vIEhlbHBlcnMgZm9yIGNvbnZlcnRpbmcgRHJhZnR5IHRvIEhUTUwuXG5jb25zdCBERUNPUkFUT1JTID0ge1xuICAvLyBWaXNpYWwgc3R5bGVzXG4gIFNUOiB7XG4gICAgb3BlbjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gJzxiPic7XG4gICAgfSxcbiAgICBjbG9zZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gJzwvYj4nO1xuICAgIH1cbiAgfSxcbiAgRU06IHtcbiAgICBvcGVuOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAnPGk+JztcbiAgICB9LFxuICAgIGNsb3NlOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAnPC9pPidcbiAgICB9XG4gIH0sXG4gIERMOiB7XG4gICAgb3BlbjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gJzxkZWw+JztcbiAgICB9LFxuICAgIGNsb3NlOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAnPC9kZWw+J1xuICAgIH1cbiAgfSxcbiAgQ086IHtcbiAgICBvcGVuOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAnPHR0Pic7XG4gICAgfSxcbiAgICBjbG9zZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gJzwvdHQ+J1xuICAgIH1cbiAgfSxcbiAgLy8gTGluZSBicmVha1xuICBCUjoge1xuICAgIG9wZW46IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICc8YnIvPic7XG4gICAgfSxcbiAgICBjbG9zZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gJydcbiAgICB9XG4gIH0sXG4gIC8vIEhpZGRlbiBlbGVtZW50XG4gIEhEOiB7XG4gICAgb3BlbjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfSxcbiAgICBjbG9zZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICB9LFxuICAvLyBIaWdobGlnaHRlZCBlbGVtZW50LlxuICBITDoge1xuICAgIG9wZW46IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICc8c3BhbiBzdHlsZT1cImNvbG9yOnRlYWxcIj4nO1xuICAgIH0sXG4gICAgY2xvc2U6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICc8L3NwYW4+JztcbiAgICB9XG4gIH0sXG4gIC8vIExpbmsgKFVSTClcbiAgTE46IHtcbiAgICBvcGVuOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICByZXR1cm4gJzxhIGhyZWY9XCInICsgZGF0YS51cmwgKyAnXCI+JztcbiAgICB9LFxuICAgIGNsb3NlOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICByZXR1cm4gJzwvYT4nO1xuICAgIH0sXG4gICAgcHJvcHM6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHJldHVybiBkYXRhID8ge1xuICAgICAgICBocmVmOiBkYXRhLnVybCxcbiAgICAgICAgdGFyZ2V0OiBcIl9ibGFua1wiXG4gICAgICB9IDogbnVsbDtcbiAgICB9LFxuICB9LFxuICAvLyBNZW50aW9uXG4gIE1OOiB7XG4gICAgb3BlbjogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgcmV0dXJuICc8YSBocmVmPVwiIycgKyBkYXRhLnZhbCArICdcIj4nO1xuICAgIH0sXG4gICAgY2xvc2U6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHJldHVybiAnPC9hPic7XG4gICAgfSxcbiAgICBwcm9wczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgcmV0dXJuIGRhdGEgPyB7XG4gICAgICAgIG5hbWU6IGRhdGEudmFsXG4gICAgICB9IDogbnVsbDtcbiAgICB9LFxuICB9LFxuICAvLyBIYXNodGFnXG4gIEhUOiB7XG4gICAgb3BlbjogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgcmV0dXJuICc8YSBocmVmPVwiIycgKyBkYXRhLnZhbCArICdcIj4nO1xuICAgIH0sXG4gICAgY2xvc2U6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHJldHVybiAnPC9hPic7XG4gICAgfSxcbiAgICBwcm9wczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgcmV0dXJuIGRhdGEgPyB7XG4gICAgICAgIG5hbWU6IGRhdGEudmFsXG4gICAgICB9IDogbnVsbDtcbiAgICB9LFxuICB9LFxuICAvLyBCdXR0b25cbiAgQk46IHtcbiAgICBvcGVuOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICByZXR1cm4gJzxidXR0b24+JztcbiAgICB9LFxuICAgIGNsb3NlOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICByZXR1cm4gJzwvYnV0dG9uPic7XG4gICAgfSxcbiAgICBwcm9wczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgcmV0dXJuIGRhdGEgPyB7XG4gICAgICAgICdkYXRhLWFjdCc6IGRhdGEuYWN0LFxuICAgICAgICAnZGF0YS12YWwnOiBkYXRhLnZhbCxcbiAgICAgICAgJ2RhdGEtbmFtZSc6IGRhdGEubmFtZSxcbiAgICAgICAgJ2RhdGEtcmVmJzogZGF0YS5yZWZcbiAgICAgIH0gOiBudWxsO1xuICAgIH0sXG4gIH0sXG4gIC8vIEltYWdlXG4gIElNOiB7XG4gICAgb3BlbjogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgLy8gRG9uJ3QgdXNlIGRhdGEucmVmIGZvciBwcmV2aWV3OiBpdCdzIGEgc2VjdXJpdHkgcmlzay5cbiAgICAgIGNvbnN0IHRtcFByZXZpZXdVcmwgPSBiYXNlNjR0b0RhdGFVcmwoZGF0YS5fdGVtcFByZXZpZXcsIGRhdGEubWltZSk7XG4gICAgICBjb25zdCBwcmV2aWV3VXJsID0gYmFzZTY0dG9PYmplY3RVcmwoZGF0YS52YWwsIGRhdGEubWltZSwgRHJhZnR5LmxvZ2dlcik7XG4gICAgICBjb25zdCBkb3dubG9hZFVybCA9IGRhdGEucmVmIHx8IHByZXZpZXdVcmw7XG4gICAgICByZXR1cm4gKGRhdGEubmFtZSA/ICc8YSBocmVmPVwiJyArIGRvd25sb2FkVXJsICsgJ1wiIGRvd25sb2FkPVwiJyArIGRhdGEubmFtZSArICdcIj4nIDogJycpICtcbiAgICAgICAgJzxpbWcgc3JjPVwiJyArICh0bXBQcmV2aWV3VXJsIHx8IHByZXZpZXdVcmwpICsgJ1wiJyArXG4gICAgICAgIChkYXRhLndpZHRoID8gJyB3aWR0aD1cIicgKyBkYXRhLndpZHRoICsgJ1wiJyA6ICcnKSArXG4gICAgICAgIChkYXRhLmhlaWdodCA/ICcgaGVpZ2h0PVwiJyArIGRhdGEuaGVpZ2h0ICsgJ1wiJyA6ICcnKSArICcgYm9yZGVyPVwiMFwiIC8+JztcbiAgICB9LFxuICAgIGNsb3NlOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICByZXR1cm4gKGRhdGEubmFtZSA/ICc8L2E+JyA6ICcnKTtcbiAgICB9LFxuICAgIHByb3BzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBpZiAoIWRhdGEpIHJldHVybiBudWxsO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLy8gVGVtcG9yYXJ5IHByZXZpZXcsIG9yIHBlcm1hbmVudCBwcmV2aWV3LCBvciBleHRlcm5hbCBsaW5rLlxuICAgICAgICBzcmM6IGJhc2U2NHRvRGF0YVVybChkYXRhLl90ZW1wUHJldmlldywgZGF0YS5taW1lKSB8fFxuICAgICAgICAgIGRhdGEucmVmIHx8IGJhc2U2NHRvT2JqZWN0VXJsKGRhdGEudmFsLCBkYXRhLm1pbWUsIERyYWZ0eS5sb2dnZXIpLFxuICAgICAgICB0aXRsZTogZGF0YS5uYW1lLFxuICAgICAgICAnZGF0YS13aWR0aCc6IGRhdGEud2lkdGgsXG4gICAgICAgICdkYXRhLWhlaWdodCc6IGRhdGEuaGVpZ2h0LFxuICAgICAgICAnZGF0YS1uYW1lJzogZGF0YS5uYW1lLFxuICAgICAgICAnZGF0YS1zaXplJzogZGF0YS52YWwgPyAoKGRhdGEudmFsLmxlbmd0aCAqIDAuNzUpIHwgMCkgOiAoZGF0YS5zaXplIHwgMCksXG4gICAgICAgICdkYXRhLW1pbWUnOiBkYXRhLm1pbWVcbiAgICAgIH07XG4gICAgfSxcbiAgfSxcbiAgLy8gRm9ybSAtIHN0cnVjdHVyZWQgbGF5b3V0IG9mIGVsZW1lbnRzLlxuICBGTToge1xuICAgIG9wZW46IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHJldHVybiAnPGRpdj4nO1xuICAgIH0sXG4gICAgY2xvc2U6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHJldHVybiAnPC9kaXY+JztcbiAgICB9XG4gIH0sXG4gIC8vIFJvdzogbG9naWMgZ3JvdXBpbmcgb2YgZWxlbWVudHNcbiAgUlc6IHtcbiAgICBvcGVuOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICByZXR1cm4gJzxkaXY+JztcbiAgICB9LFxuICAgIGNsb3NlOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICByZXR1cm4gJzwvZGl2Pic7XG4gICAgfVxuICB9XG59O1xuXG4vKipcbiAqIFRoZSBtYWluIG9iamVjdCB3aGljaCBwZXJmb3JtcyBhbGwgdGhlIGZvcm1hdHRpbmcgYWN0aW9ucy5cbiAqIEBjbGFzcyBEcmFmdHlcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5jb25zdCBEcmFmdHkgPSBmdW5jdGlvbigpIHt9XG5cbi8vIFRha2UgYSBzdHJpbmcgYW5kIGRlZmluZWQgZWFybGllciBzdHlsZSBzcGFucywgcmUtY29tcG9zZSB0aGVtIGludG8gYSB0cmVlIHdoZXJlIGVhY2ggbGVhZiBpc1xuLy8gYSBzYW1lLXN0eWxlIChpbmNsdWRpbmcgdW5zdHlsZWQpIHN0cmluZy4gSS5lLiAnaGVsbG8gKmJvbGQgX2l0YWxpY18qIGFuZCB+bW9yZX4gd29ybGQnIC0+XG4vLyAoJ2hlbGxvICcsIChiOiAnYm9sZCAnLCAoaTogJ2l0YWxpYycpKSwgJyBhbmQgJywgKHM6ICdtb3JlJyksICcgd29ybGQnKTtcbi8vXG4vLyBUaGlzIGlzIG5lZWRlZCBpbiBvcmRlciB0byBjbGVhciBtYXJrdXAsIGkuZS4gJ2hlbGxvICp3b3JsZConIC0+ICdoZWxsbyB3b3JsZCcgYW5kIGNvbnZlcnRcbi8vIHJhbmdlcyBmcm9tIG1hcmt1cC1lZCBvZmZzZXRzIHRvIHBsYWluIHRleHQgb2Zmc2V0cy5cbmZ1bmN0aW9uIGNodW5raWZ5KGxpbmUsIHN0YXJ0LCBlbmQsIHNwYW5zKSB7XG4gIGNvbnN0IGNodW5rcyA9IFtdO1xuXG4gIGlmIChzcGFucy5sZW5ndGggPT0gMCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGZvciAobGV0IGkgaW4gc3BhbnMpIHtcbiAgICAvLyBHZXQgdGhlIG5leHQgY2h1bmsgZnJvbSB0aGUgcXVldWVcbiAgICBjb25zdCBzcGFuID0gc3BhbnNbaV07XG5cbiAgICAvLyBHcmFiIHRoZSBpbml0aWFsIHVuc3R5bGVkIGNodW5rXG4gICAgaWYgKHNwYW4uc3RhcnQgPiBzdGFydCkge1xuICAgICAgY2h1bmtzLnB1c2goe1xuICAgICAgICB0ZXh0OiBsaW5lLnNsaWNlKHN0YXJ0LCBzcGFuLnN0YXJ0KVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gR3JhYiB0aGUgc3R5bGVkIGNodW5rLiBJdCBtYXkgaW5jbHVkZSBzdWJjaHVua3MuXG4gICAgY29uc3QgY2h1bmsgPSB7XG4gICAgICB0eXBlOiBzcGFuLnR5cGVcbiAgICB9O1xuICAgIGNvbnN0IGNobGQgPSBjaHVua2lmeShsaW5lLCBzcGFuLnN0YXJ0ICsgMSwgc3Bhbi5lbmQsIHNwYW4uY2hpbGRyZW4pO1xuICAgIGlmIChjaGxkLmxlbmd0aCA+IDApIHtcbiAgICAgIGNodW5rLmNoaWxkcmVuID0gY2hsZDtcbiAgICB9IGVsc2Uge1xuICAgICAgY2h1bmsudGV4dCA9IHNwYW4udGV4dDtcbiAgICB9XG4gICAgY2h1bmtzLnB1c2goY2h1bmspO1xuICAgIHN0YXJ0ID0gc3Bhbi5lbmQgKyAxOyAvLyAnKzEnIGlzIHRvIHNraXAgdGhlIGZvcm1hdHRpbmcgY2hhcmFjdGVyXG4gIH1cblxuICAvLyBHcmFiIHRoZSByZW1haW5pbmcgdW5zdHlsZWQgY2h1bmssIGFmdGVyIHRoZSBsYXN0IHNwYW5cbiAgaWYgKHN0YXJ0IDwgZW5kKSB7XG4gICAgY2h1bmtzLnB1c2goe1xuICAgICAgdGV4dDogbGluZS5zbGljZShzdGFydCwgZW5kKVxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIGNodW5rcztcbn1cblxuLy8gSW52ZXJzZSBvZiBjaHVua2lmeS4gUmV0dXJucyBhIHRyZWUgb2YgZm9ybWF0dGVkIHNwYW5zLlxuZnVuY3Rpb24gZm9yRWFjaChsaW5lLCBzdGFydCwgZW5kLCBzcGFucywgZm9ybWF0dGVyLCBjb250ZXh0KSB7XG4gIGNvbnN0IHJlc3VsdCA9IFtdO1xuXG4gIC8vIFByb2Nlc3MgcmFuZ2VzIGNhbGxpbmcgZm9ybWF0dGVyIGZvciBlYWNoIHJhbmdlLlxuICBmb3IgKGxldCBpID0gMDsgaSA8IHNwYW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3Qgc3BhbiA9IHNwYW5zW2ldO1xuICAgIGlmIChzcGFuLmF0IDwgMCkge1xuICAgICAgLy8gQXNrIGZvcm1hdHRlciBpZiBpdCB3YW50cyB0byBkbyBhbnl0aGluZyB3aXRoIHRoZSBub24tdmlzdWFsIHNwYW4uXG4gICAgICBjb25zdCBzID0gZm9ybWF0dGVyLmNhbGwoY29udGV4dCwgc3Bhbi50cCwgc3Bhbi5kYXRhLCB1bmRlZmluZWQsIHJlc3VsdC5sZW5ndGgpO1xuICAgICAgaWYgKHMpIHtcbiAgICAgICAgcmVzdWx0LnB1c2gocyk7XG4gICAgICB9XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgLy8gQWRkIHVuLXN0eWxlZCByYW5nZSBiZWZvcmUgdGhlIHN0eWxlZCBzcGFuIHN0YXJ0cy5cbiAgICBpZiAoc3RhcnQgPCBzcGFuLmF0KSB7XG4gICAgICByZXN1bHQucHVzaChmb3JtYXR0ZXIuY2FsbChjb250ZXh0LCBudWxsLCB1bmRlZmluZWQsIGxpbmUuc2xpY2Uoc3RhcnQsIHNwYW4uYXQpLCByZXN1bHQubGVuZ3RoKSk7XG4gICAgICBzdGFydCA9IHNwYW4uYXQ7XG4gICAgfVxuICAgIC8vIEdldCBhbGwgc3BhbnMgd2hpY2ggYXJlIHdpdGhpbiBjdXJyZW50IHNwYW4uXG4gICAgY29uc3Qgc3Vic3BhbnMgPSBbXTtcbiAgICBmb3IgKGxldCBzaSA9IGkgKyAxOyBzaSA8IHNwYW5zLmxlbmd0aCAmJiBzcGFuc1tzaV0uYXQgPCBzcGFuLmF0ICsgc3Bhbi5sZW47IHNpKyspIHtcbiAgICAgIHN1YnNwYW5zLnB1c2goc3BhbnNbc2ldKTtcbiAgICAgIGkgPSBzaTtcbiAgICB9XG5cbiAgICBjb25zdCB0YWcgPSBIVE1MX1RBR1Nbc3Bhbi50cF0gfHwge31cbiAgICByZXN1bHQucHVzaChmb3JtYXR0ZXIuY2FsbChjb250ZXh0LCBzcGFuLnRwLCBzcGFuLmRhdGEsXG4gICAgICB0YWcuaXNWb2lkID8gbnVsbCA6IGZvckVhY2gobGluZSwgc3RhcnQsIHNwYW4uYXQgKyBzcGFuLmxlbiwgc3Vic3BhbnMsIGZvcm1hdHRlciwgY29udGV4dCksXG4gICAgICByZXN1bHQubGVuZ3RoKSk7XG5cbiAgICBzdGFydCA9IHNwYW4uYXQgKyBzcGFuLmxlbjtcbiAgfVxuXG4gIC8vIEFkZCB0aGUgbGFzdCB1bmZvcm1hdHRlZCByYW5nZS5cbiAgaWYgKHN0YXJ0IDwgZW5kKSB7XG4gICAgcmVzdWx0LnB1c2goZm9ybWF0dGVyLmNhbGwoY29udGV4dCwgbnVsbCwgdW5kZWZpbmVkLCBsaW5lLnNsaWNlKHN0YXJ0LCBlbmQpLCByZXN1bHQubGVuZ3RoKSk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vLyBEZXRlY3Qgc3RhcnRzIGFuZCBlbmRzIG9mIGZvcm1hdHRpbmcgc3BhbnMuIFVuZm9ybWF0dGVkIHNwYW5zIGFyZVxuLy8gaWdub3JlZCBhdCB0aGlzIHN0YWdlLlxuZnVuY3Rpb24gc3Bhbm5pZnkob3JpZ2luYWwsIHJlX3N0YXJ0LCByZV9lbmQsIHR5cGUpIHtcbiAgY29uc3QgcmVzdWx0ID0gW107XG4gIGxldCBpbmRleCA9IDA7XG4gIGxldCBsaW5lID0gb3JpZ2luYWwuc2xpY2UoMCk7IC8vIG1ha2UgYSBjb3B5O1xuXG4gIHdoaWxlIChsaW5lLmxlbmd0aCA+IDApIHtcbiAgICAvLyBtYXRjaFswXTsgLy8gbWF0Y2gsIGxpa2UgJyphYmMqJ1xuICAgIC8vIG1hdGNoWzFdOyAvLyBtYXRjaCBjYXB0dXJlZCBpbiBwYXJlbnRoZXNpcywgbGlrZSAnYWJjJ1xuICAgIC8vIG1hdGNoWydpbmRleCddOyAvLyBvZmZzZXQgd2hlcmUgdGhlIG1hdGNoIHN0YXJ0ZWQuXG5cbiAgICAvLyBGaW5kIHRoZSBvcGVuaW5nIHRva2VuLlxuICAgIGNvbnN0IHN0YXJ0ID0gcmVfc3RhcnQuZXhlYyhsaW5lKTtcbiAgICBpZiAoc3RhcnQgPT0gbnVsbCkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgLy8gQmVjYXVzZSBqYXZhc2NyaXB0IFJlZ0V4cCBkb2VzIG5vdCBzdXBwb3J0IGxvb2tiZWhpbmQsIHRoZSBhY3R1YWwgb2Zmc2V0IG1heSBub3QgcG9pbnRcbiAgICAvLyBhdCB0aGUgbWFya3VwIGNoYXJhY3Rlci4gRmluZCBpdCBpbiB0aGUgbWF0Y2hlZCBzdHJpbmcuXG4gICAgbGV0IHN0YXJ0X29mZnNldCA9IHN0YXJ0WydpbmRleCddICsgc3RhcnRbMF0ubGFzdEluZGV4T2Yoc3RhcnRbMV0pO1xuICAgIC8vIENsaXAgdGhlIHByb2Nlc3NlZCBwYXJ0IG9mIHRoZSBzdHJpbmcuXG4gICAgbGluZSA9IGxpbmUuc2xpY2Uoc3RhcnRfb2Zmc2V0ICsgMSk7XG4gICAgLy8gc3RhcnRfb2Zmc2V0IGlzIGFuIG9mZnNldCB3aXRoaW4gdGhlIGNsaXBwZWQgc3RyaW5nLiBDb252ZXJ0IHRvIG9yaWdpbmFsIGluZGV4LlxuICAgIHN0YXJ0X29mZnNldCArPSBpbmRleDtcbiAgICAvLyBJbmRleCBub3cgcG9pbnQgdG8gdGhlIGJlZ2lubmluZyBvZiAnbGluZScgd2l0aGluIHRoZSAnb3JpZ2luYWwnIHN0cmluZy5cbiAgICBpbmRleCA9IHN0YXJ0X29mZnNldCArIDE7XG5cbiAgICAvLyBGaW5kIHRoZSBtYXRjaGluZyBjbG9zaW5nIHRva2VuLlxuICAgIGNvbnN0IGVuZCA9IHJlX2VuZCA/IHJlX2VuZC5leGVjKGxpbmUpIDogbnVsbDtcbiAgICBpZiAoZW5kID09IG51bGwpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBsZXQgZW5kX29mZnNldCA9IGVuZFsnaW5kZXgnXSArIGVuZFswXS5pbmRleE9mKGVuZFsxXSk7XG4gICAgLy8gQ2xpcCB0aGUgcHJvY2Vzc2VkIHBhcnQgb2YgdGhlIHN0cmluZy5cbiAgICBsaW5lID0gbGluZS5zbGljZShlbmRfb2Zmc2V0ICsgMSk7XG4gICAgLy8gVXBkYXRlIG9mZnNldHNcbiAgICBlbmRfb2Zmc2V0ICs9IGluZGV4O1xuICAgIC8vIEluZGV4IG5vdyBwb2ludCB0byB0aGUgYmVnaW5uaW5nIG9mICdsaW5lJyB3aXRoaW4gdGhlICdvcmlnaW5hbCcgc3RyaW5nLlxuICAgIGluZGV4ID0gZW5kX29mZnNldCArIDE7XG5cbiAgICByZXN1bHQucHVzaCh7XG4gICAgICB0ZXh0OiBvcmlnaW5hbC5zbGljZShzdGFydF9vZmZzZXQgKyAxLCBlbmRfb2Zmc2V0KSxcbiAgICAgIGNoaWxkcmVuOiBbXSxcbiAgICAgIHN0YXJ0OiBzdGFydF9vZmZzZXQsXG4gICAgICBlbmQ6IGVuZF9vZmZzZXQsXG4gICAgICB0eXBlOiB0eXBlXG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vLyBDb252ZXJ0IGxpbmVhciBhcnJheSBvciBzcGFucyBpbnRvIGEgdHJlZSByZXByZXNlbnRhdGlvbi5cbi8vIEtlZXAgc3RhbmRhbG9uZSBhbmQgbmVzdGVkIHNwYW5zLCB0aHJvdyBhd2F5IHBhcnRpYWxseSBvdmVybGFwcGluZyBzcGFucy5cbmZ1bmN0aW9uIHRvVHJlZShzcGFucykge1xuICBpZiAoc3BhbnMubGVuZ3RoID09IDApIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBjb25zdCB0cmVlID0gW3NwYW5zWzBdXTtcbiAgbGV0IGxhc3QgPSBzcGFuc1swXTtcbiAgZm9yIChsZXQgaSA9IDE7IGkgPCBzcGFucy5sZW5ndGg7IGkrKykge1xuICAgIC8vIEtlZXAgc3BhbnMgd2hpY2ggc3RhcnQgYWZ0ZXIgdGhlIGVuZCBvZiB0aGUgcHJldmlvdXMgc3BhbiBvciB0aG9zZSB3aGljaFxuICAgIC8vIGFyZSBjb21wbGV0ZSB3aXRoaW4gdGhlIHByZXZpb3VzIHNwYW4uXG5cbiAgICBpZiAoc3BhbnNbaV0uc3RhcnQgPiBsYXN0LmVuZCkge1xuICAgICAgLy8gU3BhbiBpcyBjb21wbGV0ZWx5IG91dHNpZGUgb2YgdGhlIHByZXZpb3VzIHNwYW4uXG4gICAgICB0cmVlLnB1c2goc3BhbnNbaV0pO1xuICAgICAgbGFzdCA9IHNwYW5zW2ldO1xuICAgIH0gZWxzZSBpZiAoc3BhbnNbaV0uZW5kIDwgbGFzdC5lbmQpIHtcbiAgICAgIC8vIFNwYW4gaXMgZnVsbHkgaW5zaWRlIG9mIHRoZSBwcmV2aW91cyBzcGFuLiBQdXNoIHRvIHN1Ym5vZGUuXG4gICAgICBsYXN0LmNoaWxkcmVuLnB1c2goc3BhbnNbaV0pO1xuICAgIH1cbiAgICAvLyBTcGFuIGNvdWxkIHBhcnRpYWxseSBvdmVybGFwLCBpZ25vcmluZyBpdCBhcyBpbnZhbGlkLlxuICB9XG5cbiAgLy8gUmVjdXJzaXZlbHkgcmVhcnJhbmdlIHRoZSBzdWJub2Rlcy5cbiAgZm9yIChsZXQgaSBpbiB0cmVlKSB7XG4gICAgdHJlZVtpXS5jaGlsZHJlbiA9IHRvVHJlZSh0cmVlW2ldLmNoaWxkcmVuKTtcbiAgfVxuXG4gIHJldHVybiB0cmVlO1xufVxuXG4vLyBHZXQgYSBsaXN0IG9mIGVudGl0aWVzIGZyb20gYSB0ZXh0LlxuZnVuY3Rpb24gZXh0cmFjdEVudGl0aWVzKGxpbmUpIHtcbiAgbGV0IG1hdGNoO1xuICBsZXQgZXh0cmFjdGVkID0gW107XG4gIEVOVElUWV9UWVBFUy5tYXAoZnVuY3Rpb24oZW50aXR5KSB7XG4gICAgd2hpbGUgKChtYXRjaCA9IGVudGl0eS5yZS5leGVjKGxpbmUpKSAhPT0gbnVsbCkge1xuICAgICAgZXh0cmFjdGVkLnB1c2goe1xuICAgICAgICBvZmZzZXQ6IG1hdGNoWydpbmRleCddLFxuICAgICAgICBsZW46IG1hdGNoWzBdLmxlbmd0aCxcbiAgICAgICAgdW5pcXVlOiBtYXRjaFswXSxcbiAgICAgICAgZGF0YTogZW50aXR5LnBhY2sobWF0Y2hbMF0pLFxuICAgICAgICB0eXBlOiBlbnRpdHkubmFtZVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcblxuICBpZiAoZXh0cmFjdGVkLmxlbmd0aCA9PSAwKSB7XG4gICAgcmV0dXJuIGV4dHJhY3RlZDtcbiAgfVxuXG4gIC8vIFJlbW92ZSBlbnRpdGllcyBkZXRlY3RlZCBpbnNpZGUgb3RoZXIgZW50aXRpZXMsIGxpa2UgI2hhc2h0YWcgaW4gYSBVUkwuXG4gIGV4dHJhY3RlZC5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICByZXR1cm4gYS5vZmZzZXQgLSBiLm9mZnNldDtcbiAgfSk7XG5cbiAgbGV0IGlkeCA9IC0xO1xuICBleHRyYWN0ZWQgPSBleHRyYWN0ZWQuZmlsdGVyKGZ1bmN0aW9uKGVsKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gKGVsLm9mZnNldCA+IGlkeCk7XG4gICAgaWR4ID0gZWwub2Zmc2V0ICsgZWwubGVuO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH0pO1xuXG4gIHJldHVybiBleHRyYWN0ZWQ7XG59XG5cbi8vIENvbnZlcnQgdGhlIGNodW5rcyBpbnRvIGZvcm1hdCBzdWl0YWJsZSBmb3Igc2VyaWFsaXphdGlvbi5cbmZ1bmN0aW9uIGRyYWZ0aWZ5KGNodW5rcywgc3RhcnRBdCkge1xuICBsZXQgcGxhaW4gPSBcIlwiO1xuICBsZXQgcmFuZ2VzID0gW107XG4gIGZvciAobGV0IGkgaW4gY2h1bmtzKSB7XG4gICAgY29uc3QgY2h1bmsgPSBjaHVua3NbaV07XG4gICAgaWYgKCFjaHVuay50ZXh0KSB7XG4gICAgICBjb25zdCBkcmFmdHkgPSBkcmFmdGlmeShjaHVuay5jaGlsZHJlbiwgcGxhaW4ubGVuZ3RoICsgc3RhcnRBdCk7XG4gICAgICBjaHVuay50ZXh0ID0gZHJhZnR5LnR4dDtcbiAgICAgIHJhbmdlcyA9IHJhbmdlcy5jb25jYXQoZHJhZnR5LmZtdCk7XG4gICAgfVxuXG4gICAgaWYgKGNodW5rLnR5cGUpIHtcbiAgICAgIHJhbmdlcy5wdXNoKHtcbiAgICAgICAgYXQ6IHBsYWluLmxlbmd0aCArIHN0YXJ0QXQsXG4gICAgICAgIGxlbjogY2h1bmsudGV4dC5sZW5ndGgsXG4gICAgICAgIHRwOiBjaHVuay50eXBlXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBwbGFpbiArPSBjaHVuay50ZXh0O1xuICB9XG4gIHJldHVybiB7XG4gICAgdHh0OiBwbGFpbixcbiAgICBmbXQ6IHJhbmdlc1xuICB9O1xufVxuXG4vLyBTcGxpY2UgdHdvIHN0cmluZ3M6IGluc2VydCBzZWNvbmQgc3RyaW5nIGludG8gdGhlIGZpcnN0IG9uZSBhdCB0aGUgZ2l2ZW4gaW5kZXhcbmZ1bmN0aW9uIHNwbGljZShzcmMsIGF0LCBpbnNlcnQpIHtcbiAgcmV0dXJuIHNyYy5zbGljZSgwLCBhdCkgKyBpbnNlcnQgKyBzcmMuc2xpY2UoYXQpO1xufVxuXG4vKipcbiAqIFBhcnNlIHBsYWluIHRleHQgaW50byBEcmFmdHkgZG9jdW1lbnQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGNvbnRlbnQgLSBwbGFpbi10ZXh0IGNvbnRlbnQgdG8gcGFyc2UuXG4gKiBAcmV0dXJuIHtEcmFmdHl9IHBhcnNlZCBkb2N1bWVudCBvciBudWxsIGlmIHRoZSBzb3VyY2UgaXMgbm90IHBsYWluIHRleHQuXG4gKi9cbkRyYWZ0eS5wYXJzZSA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcbiAgLy8gTWFrZSBzdXJlIHdlIGFyZSBwYXJzaW5nIHN0cmluZ3Mgb25seS5cbiAgaWYgKHR5cGVvZiBjb250ZW50ICE9ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvLyBTcGxpdCB0ZXh0IGludG8gbGluZXMuIEl0IG1ha2VzIGZ1cnRoZXIgcHJvY2Vzc2luZyBlYXNpZXIuXG4gIGNvbnN0IGxpbmVzID0gY29udGVudC5zcGxpdCgvXFxyP1xcbi8pO1xuXG4gIC8vIEhvbGRzIGVudGl0aWVzIHJlZmVyZW5jZWQgZnJvbSB0ZXh0XG4gIGNvbnN0IGVudGl0eU1hcCA9IFtdO1xuICBjb25zdCBlbnRpdHlJbmRleCA9IHt9O1xuXG4gIC8vIFByb2Nlc3NpbmcgbGluZXMgb25lIGJ5IG9uZSwgaG9sZCBpbnRlcm1lZGlhdGUgcmVzdWx0IGluIGJseC5cbiAgY29uc3QgYmx4ID0gW107XG4gIGxpbmVzLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgbGV0IHNwYW5zID0gW107XG4gICAgbGV0IGVudGl0aWVzO1xuXG4gICAgLy8gRmluZCBmb3JtYXR0ZWQgc3BhbnMgaW4gdGhlIHN0cmluZy5cbiAgICAvLyBUcnkgdG8gbWF0Y2ggZWFjaCBzdHlsZS5cbiAgICBJTkxJTkVfU1RZTEVTLm1hcChmdW5jdGlvbihzdHlsZSkge1xuICAgICAgLy8gRWFjaCBzdHlsZSBjb3VsZCBiZSBtYXRjaGVkIG11bHRpcGxlIHRpbWVzLlxuICAgICAgc3BhbnMgPSBzcGFucy5jb25jYXQoc3Bhbm5pZnkobGluZSwgc3R5bGUuc3RhcnQsIHN0eWxlLmVuZCwgc3R5bGUubmFtZSkpO1xuICAgIH0pO1xuXG4gICAgbGV0IGJsb2NrO1xuICAgIGlmIChzcGFucy5sZW5ndGggPT0gMCkge1xuICAgICAgYmxvY2sgPSB7XG4gICAgICAgIHR4dDogbGluZVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gU29ydCBzcGFucyBieSBzdHlsZSBvY2N1cmVuY2UgZWFybHkgLT4gbGF0ZVxuICAgICAgc3BhbnMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgIHJldHVybiBhLnN0YXJ0IC0gYi5zdGFydDtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBDb252ZXJ0IGFuIGFycmF5IG9mIHBvc3NpYmx5IG92ZXJsYXBwaW5nIHNwYW5zIGludG8gYSB0cmVlXG4gICAgICBzcGFucyA9IHRvVHJlZShzcGFucyk7XG5cbiAgICAgIC8vIEJ1aWxkIGEgdHJlZSByZXByZXNlbnRhdGlvbiBvZiB0aGUgZW50aXJlIHN0cmluZywgbm90XG4gICAgICAvLyBqdXN0IHRoZSBmb3JtYXR0ZWQgcGFydHMuXG4gICAgICBjb25zdCBjaHVua3MgPSBjaHVua2lmeShsaW5lLCAwLCBsaW5lLmxlbmd0aCwgc3BhbnMpO1xuXG4gICAgICBjb25zdCBkcmFmdHkgPSBkcmFmdGlmeShjaHVua3MsIDApO1xuXG4gICAgICBibG9jayA9IHtcbiAgICAgICAgdHh0OiBkcmFmdHkudHh0LFxuICAgICAgICBmbXQ6IGRyYWZ0eS5mbXRcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gRXh0cmFjdCBlbnRpdGllcyBmcm9tIHRoZSBjbGVhbmVkIHVwIHN0cmluZy5cbiAgICBlbnRpdGllcyA9IGV4dHJhY3RFbnRpdGllcyhibG9jay50eHQpO1xuICAgIGlmIChlbnRpdGllcy5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCByYW5nZXMgPSBbXTtcbiAgICAgIGZvciAobGV0IGkgaW4gZW50aXRpZXMpIHtcbiAgICAgICAgLy8ge29mZnNldDogbWF0Y2hbJ2luZGV4J10sIHVuaXF1ZTogbWF0Y2hbMF0sIGxlbjogbWF0Y2hbMF0ubGVuZ3RoLCBkYXRhOiBlbnQucGFja2VyKCksIHR5cGU6IGVudC5uYW1lfVxuICAgICAgICBjb25zdCBlbnRpdHkgPSBlbnRpdGllc1tpXTtcbiAgICAgICAgbGV0IGluZGV4ID0gZW50aXR5SW5kZXhbZW50aXR5LnVuaXF1ZV07XG4gICAgICAgIGlmICghaW5kZXgpIHtcbiAgICAgICAgICBpbmRleCA9IGVudGl0eU1hcC5sZW5ndGg7XG4gICAgICAgICAgZW50aXR5SW5kZXhbZW50aXR5LnVuaXF1ZV0gPSBpbmRleDtcbiAgICAgICAgICBlbnRpdHlNYXAucHVzaCh7XG4gICAgICAgICAgICB0cDogZW50aXR5LnR5cGUsXG4gICAgICAgICAgICBkYXRhOiBlbnRpdHkuZGF0YVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJhbmdlcy5wdXNoKHtcbiAgICAgICAgICBhdDogZW50aXR5Lm9mZnNldCxcbiAgICAgICAgICBsZW46IGVudGl0eS5sZW4sXG4gICAgICAgICAga2V5OiBpbmRleFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGJsb2NrLmVudCA9IHJhbmdlcztcbiAgICB9XG5cbiAgICBibHgucHVzaChibG9jayk7XG4gIH0pO1xuXG4gIGNvbnN0IHJlc3VsdCA9IHtcbiAgICB0eHQ6IFwiXCJcbiAgfTtcblxuICAvLyBNZXJnZSBsaW5lcyBhbmQgc2F2ZSBsaW5lIGJyZWFrcyBhcyBCUiBpbmxpbmUgZm9ybWF0dGluZy5cbiAgaWYgKGJseC5sZW5ndGggPiAwKSB7XG4gICAgcmVzdWx0LnR4dCA9IGJseFswXS50eHQ7XG4gICAgcmVzdWx0LmZtdCA9IChibHhbMF0uZm10IHx8IFtdKS5jb25jYXQoYmx4WzBdLmVudCB8fCBbXSk7XG5cbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IGJseC5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgYmxvY2sgPSBibHhbaV07XG4gICAgICBjb25zdCBvZmZzZXQgPSByZXN1bHQudHh0Lmxlbmd0aCArIDE7XG5cbiAgICAgIHJlc3VsdC5mbXQucHVzaCh7XG4gICAgICAgIHRwOiAnQlInLFxuICAgICAgICBsZW46IDEsXG4gICAgICAgIGF0OiBvZmZzZXQgLSAxXG4gICAgICB9KTtcblxuICAgICAgcmVzdWx0LnR4dCArPSBcIiBcIiArIGJsb2NrLnR4dDtcbiAgICAgIGlmIChibG9jay5mbXQpIHtcbiAgICAgICAgcmVzdWx0LmZtdCA9IHJlc3VsdC5mbXQuY29uY2F0KGJsb2NrLmZtdC5tYXAoZnVuY3Rpb24ocykge1xuICAgICAgICAgIHMuYXQgKz0gb2Zmc2V0O1xuICAgICAgICAgIHJldHVybiBzO1xuICAgICAgICB9KSk7XG4gICAgICB9XG4gICAgICBpZiAoYmxvY2suZW50KSB7XG4gICAgICAgIHJlc3VsdC5mbXQgPSByZXN1bHQuZm10LmNvbmNhdChibG9jay5lbnQubWFwKGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgICBzLmF0ICs9IG9mZnNldDtcbiAgICAgICAgICByZXR1cm4gcztcbiAgICAgICAgfSkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChyZXN1bHQuZm10Lmxlbmd0aCA9PSAwKSB7XG4gICAgICBkZWxldGUgcmVzdWx0LmZtdDtcbiAgICB9XG5cbiAgICBpZiAoZW50aXR5TWFwLmxlbmd0aCA+IDApIHtcbiAgICAgIHJlc3VsdC5lbnQgPSBlbnRpdHlNYXA7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBEcmFmdHkgZG9jdW1lbnQgdG8gYSBwbGFpbiB0ZXh0IHN0cmluZy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gcGxhaW5UZXh0IC0gc3RyaW5nIHRvIHVzZSBhcyBEcmFmdHkgY29udGVudC5cbiAqXG4gKiBAcmV0dXJucyBuZXcgRHJhZnR5IGRvY3VtZW50IG9yIG51bGwgaXMgcGxhaW5UZXh0IGlzIG5vdCBhIHN0cmluZy5cbiAqL1xuRHJhZnR5LmluaXQgPSBmdW5jdGlvbihwbGFpblRleHQpIHtcbiAgaWYgKHR5cGVvZiBwbGFpblRleHQgIT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZXR1cm4ge1xuICAgIHR4dDogcGxhaW5UZXh0XG4gIH07XG59XG5cbi8qKlxuICogQXBwZW5kIG9uZSBEcmFmdHkgZG9jdW1lbnQgdG8gYW5vdGhlci5cbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gZmlyc3QgLSBEcmFmdHkgZG9jdW1lbnQgdG8gYXBwZW5kIHRvLlxuICogQHBhcmFtIHtEcmFmdHl9IHNlY29uZCAtIERyYWZ0eSBkb2N1bWVudCBiZWluZyBhcHBlbmRlZC5cbiAqXG4gKiBAcmV0dXJuIHtEcmFmdHl9IGZpcnN0IGRvY3VtZW50IHdpdGggdGhlIHNlY29uZCBhcHBlbmRlZCB0byBpdC5cbiAqL1xuRHJhZnR5LmFwcGVuZCA9IGZ1bmN0aW9uKGZpcnN0LCBzZWNvbmQpIHtcbiAgaWYgKGZpcnN0ID09IG51bGwpIHtcbiAgICByZXR1cm4gc2Vjb25kO1xuICB9XG4gIGlmIChzZWNvbmQgPT0gbnVsbCkge1xuICAgIHJldHVybiBmaXJzdDtcbiAgfVxuXG4gIGZpcnN0LnR4dCA9IGZpcnN0LnR4dCB8fCAnJztcbiAgc2Vjb25kLnR4dCA9IHNlY29uZC50eHQgfHwgJyc7XG4gIGNvbnN0IGxlbiA9IGZpcnN0LnR4dC5sZW5ndGg7XG5cbiAgZmlyc3QudHh0ICs9IHNlY29uZC50eHQ7XG4gIGlmIChBcnJheS5pc0FycmF5KHNlY29uZC5mbXQpKSB7XG4gICAgZmlyc3QuZm10ID0gZmlyc3QuZm10IHx8IFtdO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHNlY29uZC5lbnQpKSB7XG4gICAgICBmaXJzdC5lbnQgPSBmaXJzdC5lbnQgfHwgW107XG4gICAgfVxuICAgIHNlY29uZC5mbXQuZm9yRWFjaChzcmMgPT4ge1xuICAgICAgY29uc3QgZm10ID0ge1xuICAgICAgICBhdDogc3JjLmF0ICsgbGVuLFxuICAgICAgICBsZW46IHNyYy5sZW5cbiAgICAgIH07XG4gICAgICBpZiAoc3JjLnRwKSB7XG4gICAgICAgIGZtdC50cCA9IHNyYy50cDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZtdC5rZXkgPSBmaXJzdC5lbnQubGVuZ3RoO1xuICAgICAgICBmaXJzdC5lbnQucHVzaChzZWNvbmQuZW50W3NyYy5rZXkgfHwgMF0pO1xuICAgICAgfVxuICAgICAgZmlyc3QuZm10LnB1c2goZm10KTtcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBmaXJzdDtcbn1cblxuLyoqXG4gKiBAdHlwZWRlZiBEcmFmdHkuSW1hZ2VEZXNjXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAdHlwZSBPYmplY3RcbiAqIEBwYXJhbSB7c3RyaW5nfSBtaW1lIC0gbWltZS10eXBlIG9mIHRoZSBpbWFnZSwgZS5nLiBcImltYWdlL3BuZ1wiXG4gKiBAcGFyYW0ge3N0cmluZ30gcHJldmlldyAtIGJhc2U2NC1lbmNvZGVkIGltYWdlIGNvbnRlbnQgKG9yIHByZXZpZXcsIGlmIGxhcmdlIGltYWdlIGlzIGF0dGFjaGVkKS4gQ291bGQgYmUgbnVsbC91bmRlZmluZWQuXG4gKiBAcGFyYW0ge2ludGVnZXJ9IHdpZHRoIC0gd2lkdGggb2YgdGhlIGltYWdlXG4gKiBAcGFyYW0ge2ludGVnZXJ9IGhlaWdodCAtIGhlaWdodCBvZiB0aGUgaW1hZ2VcbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlbmFtZSAtIGZpbGUgbmFtZSBzdWdnZXN0aW9uIGZvciBkb3dubG9hZGluZyB0aGUgaW1hZ2UuXG4gKiBAcGFyYW0ge2ludGVnZXJ9IHNpemUgLSBzaXplIG9mIHRoZSBpbWFnZSBpbiBieXRlcy4gVHJlYXQgaXMgYXMgYW4gdW50cnVzdGVkIGhpbnQuXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVmdXJsIC0gcmVmZXJlbmNlIHRvIHRoZSBjb250ZW50LiBDb3VsZCBiZSBudWxsL3VuZGVmaW5lZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBfdGVtcFByZXZpZXcgLSBiYXNlNjQtZW5jb2RlZCBpbWFnZSBwcmV2aWV3IHVzZWQgZHVyaW5nIHVwbG9hZCBwcm9jZXNzOyBub3Qgc2VyaWFsaXphYmxlLlxuICogQHBhcmFtIHtQcm9taXNlfSB1cmxQcm9taXNlIC0gUHJvbWlzZSB3aGljaCByZXR1cm5zIGNvbnRlbnQgVVJMIHdoZW4gcmVzb2x2ZWQuXG4gKi9cblxuLyoqXG4gKiBJbnNlcnQgaW5saW5lIGltYWdlIGludG8gRHJhZnR5IGRvY3VtZW50LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gZG9jdW1lbnQgdG8gYWRkIGltYWdlIHRvLlxuICogQHBhcmFtIHtpbnRlZ2VyfSBhdCAtIGluZGV4IHdoZXJlIHRoZSBvYmplY3QgaXMgaW5zZXJ0ZWQuIFRoZSBsZW5ndGggb2YgdGhlIGltYWdlIGlzIGFsd2F5cyAxLlxuICogQHBhcmFtIHtJbWFnZURlc2N9IGltYWdlRGVzYyAtIG9iamVjdCB3aXRoIGltYWdlIHBhcmFtZW5ldHMgYW5kIGRhdGEuXG4gKlxuICogQHJldHVybiB7RHJhZnR5fSB1cGRhdGVkIGRvY3VtZW50LlxuICovXG5EcmFmdHkuaW5zZXJ0SW1hZ2UgPSBmdW5jdGlvbihjb250ZW50LCBhdCwgaW1hZ2VEZXNjKSB7XG4gIGNvbnRlbnQgPSBjb250ZW50IHx8IHtcbiAgICB0eHQ6IFwiIFwiXG4gIH07XG4gIGNvbnRlbnQuZW50ID0gY29udGVudC5lbnQgfHwgW107XG4gIGNvbnRlbnQuZm10ID0gY29udGVudC5mbXQgfHwgW107XG5cbiAgY29udGVudC5mbXQucHVzaCh7XG4gICAgYXQ6IGF0LFxuICAgIGxlbjogMSxcbiAgICBrZXk6IGNvbnRlbnQuZW50Lmxlbmd0aFxuICB9KTtcblxuICBjb25zdCBleCA9IHtcbiAgICB0cDogJ0lNJyxcbiAgICBkYXRhOiB7XG4gICAgICBtaW1lOiBpbWFnZURlc2MubWltZSxcbiAgICAgIHZhbDogaW1hZ2VEZXNjLnByZXZpZXcsXG4gICAgICB3aWR0aDogaW1hZ2VEZXNjLndpZHRoLFxuICAgICAgaGVpZ2h0OiBpbWFnZURlc2MuaGVpZ2h0LFxuICAgICAgbmFtZTogaW1hZ2VEZXNjLmZpbGVuYW1lLFxuICAgICAgc2l6ZTogaW1hZ2VEZXNjLnNpemUgfCAwLFxuICAgICAgcmVmOiBpbWFnZURlc2MucmVmdXJsXG4gICAgfVxuICB9O1xuXG4gIGlmIChpbWFnZURlc2MudXJsUHJvbWlzZSkge1xuICAgIGV4LmRhdGEuX3RlbXBQcmV2aWV3ID0gaW1hZ2VEZXNjLl90ZW1wUHJldmlldztcbiAgICBleC5kYXRhLl9wcm9jZXNzaW5nID0gdHJ1ZTtcbiAgICBpbWFnZURlc2MudXJsUHJvbWlzZS50aGVuKFxuICAgICAgKHVybCkgPT4ge1xuICAgICAgICBleC5kYXRhLnJlZiA9IHVybDtcbiAgICAgICAgZXguZGF0YS5fdGVtcFByZXZpZXcgPSB1bmRlZmluZWQ7XG4gICAgICAgIGV4LmRhdGEuX3Byb2Nlc3NpbmcgPSB1bmRlZmluZWQ7XG4gICAgICB9LFxuICAgICAgKGVycikgPT4ge1xuICAgICAgICAvKiBjYXRjaCB0aGUgZXJyb3IsIG90aGVyd2lzZSBpdCB3aWxsIGFwcGVhciBpbiB0aGUgY29uc29sZS4gKi9cbiAgICAgICAgZXguZGF0YS5fcHJvY2Vzc2luZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgY29udGVudC5lbnQucHVzaChleCk7XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbi8qKlxuICogQXBwZW5kIGlubGluZSBpbWFnZSB0byBEcmFmdHkgZG9jdW1lbnQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBkb2N1bWVudCB0byBhZGQgaW1hZ2UgdG8uXG4gKiBAcGFyYW0ge0ltYWdlRGVzY30gaW1hZ2VEZXNjIC0gb2JqZWN0IHdpdGggaW1hZ2UgcGFyYW1lbmV0cy5cbiAqXG4gKiBAcmV0dXJuIHtEcmFmdHl9IHVwZGF0ZWQgZG9jdW1lbnQuXG4gKi9cbkRyYWZ0eS5hcHBlbmRJbWFnZSA9IGZ1bmN0aW9uKGNvbnRlbnQsIGltYWdlRGVzYykge1xuICBjb250ZW50ID0gY29udGVudCB8fCB7XG4gICAgdHh0OiBcIlwiXG4gIH07XG4gIGNvbnRlbnQudHh0ICs9IFwiIFwiO1xuICByZXR1cm4gRHJhZnR5Lmluc2VydEltYWdlKGNvbnRlbnQsIGNvbnRlbnQudHh0Lmxlbmd0aCAtIDEsIGltYWdlRGVzYyk7XG59XG5cbi8qKlxuICogQHR5cGVkZWYgRHJhZnR5LkF0dGFjaG1lbnREZXNjXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAdHlwZSBPYmplY3RcbiAqIEBwYXJhbSB7c3RyaW5nfSBtaW1lIC0gbWltZS10eXBlIG9mIHRoZSBpbWFnZSwgZS5nLiBcImltYWdlL3BuZ1wiXG4gKiBAcGFyYW0ge3N0cmluZ30gZGF0YSAtIGJhc2U2NC1lbmNvZGVkIGluLWJhbmQgY29udGVudCBvZiBzbWFsbCBhdHRhY2htZW50cy4gQ291bGQgYmUgbnVsbC91bmRlZmluZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZW5hbWUgLSBmaWxlIG5hbWUgc3VnZ2VzdGlvbiBmb3IgZG93bmxvYWRpbmcgdGhlIGF0dGFjaG1lbnQuXG4gKiBAcGFyYW0ge2ludGVnZXJ9IHNpemUgLSBzaXplIG9mIHRoZSBmaWxlIGluIGJ5dGVzLiBUcmVhdCBpcyBhcyBhbiB1bnRydXN0ZWQgaGludC5cbiAqIEBwYXJhbSB7c3RyaW5nfSByZWZ1cmwgLSByZWZlcmVuY2UgdG8gdGhlIG91dC1vZi1iYW5kIGNvbnRlbnQuIENvdWxkIGJlIG51bGwvdW5kZWZpbmVkLlxuICogQHBhcmFtIHtQcm9taXNlfSB1cmxQcm9taXNlIC0gUHJvbWlzZSB3aGljaCByZXR1cm5zIGNvbnRlbnQgVVJMIHdoZW4gcmVzb2x2ZWQuXG4gKi9cblxuLyoqXG4gKiBBdHRhY2ggZmlsZSB0byBEcmFmdHkgY29udGVudC4gRWl0aGVyIGFzIGEgYmxvYiBvciBhcyBhIHJlZmVyZW5jZS5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIGRvY3VtZW50IHRvIGF0dGFjaCBmaWxlIHRvLlxuICogQHBhcmFtIHtBdHRhY2htZW50RGVzY30gb2JqZWN0IC0gY29udGFpbmluZyBhdHRhY2htZW50IGRlc2NyaXB0aW9uIGFuZCBkYXRhLlxuICpcbiAqIEByZXR1cm4ge0RyYWZ0eX0gdXBkYXRlZCBkb2N1bWVudC5cbiAqL1xuRHJhZnR5LmF0dGFjaEZpbGUgPSBmdW5jdGlvbihjb250ZW50LCBhdHRhY2htZW50RGVzYykge1xuICBjb250ZW50ID0gY29udGVudCB8fCB7XG4gICAgdHh0OiBcIlwiXG4gIH07XG4gIGNvbnRlbnQuZW50ID0gY29udGVudC5lbnQgfHwgW107XG4gIGNvbnRlbnQuZm10ID0gY29udGVudC5mbXQgfHwgW107XG5cbiAgY29udGVudC5mbXQucHVzaCh7XG4gICAgYXQ6IC0xLFxuICAgIGxlbjogMCxcbiAgICBrZXk6IGNvbnRlbnQuZW50Lmxlbmd0aFxuICB9KTtcblxuICBjb25zdCBleCA9IHtcbiAgICB0cDogJ0VYJyxcbiAgICBkYXRhOiB7XG4gICAgICBtaW1lOiBhdHRhY2htZW50RGVzYy5taW1lLFxuICAgICAgdmFsOiBhdHRhY2htZW50RGVzYy5kYXRhLFxuICAgICAgbmFtZTogYXR0YWNobWVudERlc2MuZmlsZW5hbWUsXG4gICAgICByZWY6IGF0dGFjaG1lbnREZXNjLnJlZnVybCxcbiAgICAgIHNpemU6IGF0dGFjaG1lbnREZXNjLnNpemUgfCAwXG4gICAgfVxuICB9XG4gIGlmIChhdHRhY2htZW50RGVzYy51cmxQcm9taXNlKSB7XG4gICAgZXguZGF0YS5fcHJvY2Vzc2luZyA9IHRydWU7XG4gICAgYXR0YWNobWVudERlc2MudXJsUHJvbWlzZS50aGVuKFxuICAgICAgKHVybCkgPT4ge1xuICAgICAgICBleC5kYXRhLnJlZiA9IHVybDtcbiAgICAgICAgZXguZGF0YS5fcHJvY2Vzc2luZyA9IHVuZGVmaW5lZDtcbiAgICAgIH0sXG4gICAgICAoZXJyKSA9PiB7XG4gICAgICAgIC8qIGNhdGNoIHRoZSBlcnJvciwgb3RoZXJ3aXNlIGl0IHdpbGwgYXBwZWFyIGluIHRoZSBjb25zb2xlLiAqL1xuICAgICAgICBleC5kYXRhLl9wcm9jZXNzaW5nID0gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgICk7XG4gIH1cbiAgY29udGVudC5lbnQucHVzaChleCk7XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbi8qKlxuICogV3JhcHMgY29udGVudCBpbnRvIGFuIGludGVyYWN0aXZlIGZvcm0uXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl8c3RyaW5nfSBjb250ZW50IC0gdG8gd3JhcCBpbnRvIGEgZm9ybS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBhdCAtIGluZGV4IHdoZXJlIHRoZSBmb3JtcyBzdGFydHMuXG4gKiBAcGFyYW0ge251bWJlcn0gbGVuIC0gbGVuZ3RoIG9mIHRoZSBmb3JtIGNvbnRlbnQuXG4gKlxuICogQHJldHVybiB7RHJhZnR5fSB1cGRhdGVkIGRvY3VtZW50LlxuICovXG5EcmFmdHkud3JhcEFzRm9ybSA9IGZ1bmN0aW9uKGNvbnRlbnQsIGF0LCBsZW4pIHtcbiAgaWYgKHR5cGVvZiBjb250ZW50ID09ICdzdHJpbmcnKSB7XG4gICAgY29udGVudCA9IHtcbiAgICAgIHR4dDogY29udGVudFxuICAgIH07XG4gIH1cbiAgY29udGVudC5mbXQgPSBjb250ZW50LmZtdCB8fCBbXTtcblxuICBjb250ZW50LmZtdC5wdXNoKHtcbiAgICBhdDogYXQsXG4gICAgbGVuOiBsZW4sXG4gICAgdHA6ICdGTSdcbiAgfSk7XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbi8qKlxuICogSW5zZXJ0IGNsaWNrYWJsZSBidXR0b24gaW50byBEcmFmdHkgZG9jdW1lbnQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl8c3RyaW5nfSBjb250ZW50IC0gRHJhZnR5IGRvY3VtZW50IHRvIGluc2VydCBidXR0b24gdG8gb3IgYSBzdHJpbmcgdG8gYmUgdXNlZCBhcyBidXR0b24gdGV4dC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBhdCAtIGxvY2F0aW9uIHdoZXJlIHRoZSBidXR0b24gaXMgaW5zZXJ0ZWQuXG4gKiBAcGFyYW0ge251bWJlcn0gbGVuIC0gdGhlIGxlbmd0aCBvZiB0aGUgdGV4dCB0byBiZSB1c2VkIGFzIGJ1dHRvbiB0aXRsZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gdGhlIGJ1dHRvbi4gQ2xpZW50IHNob3VsZCByZXR1cm4gaXQgdG8gdGhlIHNlcnZlciB3aGVuIHRoZSBidXR0b24gaXMgY2xpY2tlZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBhY3Rpb25UeXBlIC0gdGhlIHR5cGUgb2YgdGhlIGJ1dHRvbiwgb25lIG9mICd1cmwnIG9yICdwdWInLlxuICogQHBhcmFtIHtzdHJpbmd9IGFjdGlvblZhbHVlIC0gdGhlIHZhbHVlIHRvIHJldHVybiBvbiBjbGljazpcbiAqIEBwYXJhbSB7c3RyaW5nfSByZWZVcmwgLSB0aGUgVVJMIHRvIGdvIHRvIHdoZW4gdGhlICd1cmwnIGJ1dHRvbiBpcyBjbGlja2VkLlxuICpcbiAqIEByZXR1cm4ge0RyYWZ0eX0gdXBkYXRlZCBkb2N1bWVudC5cbiAqL1xuRHJhZnR5Lmluc2VydEJ1dHRvbiA9IGZ1bmN0aW9uKGNvbnRlbnQsIGF0LCBsZW4sIG5hbWUsIGFjdGlvblR5cGUsIGFjdGlvblZhbHVlLCByZWZVcmwpIHtcbiAgaWYgKHR5cGVvZiBjb250ZW50ID09ICdzdHJpbmcnKSB7XG4gICAgY29udGVudCA9IHtcbiAgICAgIHR4dDogY29udGVudFxuICAgIH07XG4gIH1cblxuICBpZiAoIWNvbnRlbnQgfHwgIWNvbnRlbnQudHh0IHx8IGNvbnRlbnQudHh0Lmxlbmd0aCA8IGF0ICsgbGVuKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBpZiAobGVuIDw9IDAgfHwgWyd1cmwnLCAncHViJ10uaW5kZXhPZihhY3Rpb25UeXBlKSA9PSAtMSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIC8vIEVuc3VyZSByZWZVcmwgaXMgYSBzdHJpbmcuXG4gIGlmIChhY3Rpb25UeXBlID09ICd1cmwnICYmICFyZWZVcmwpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZWZVcmwgPSAnJyArIHJlZlVybDtcblxuICBjb250ZW50LmVudCA9IGNvbnRlbnQuZW50IHx8IFtdO1xuICBjb250ZW50LmZtdCA9IGNvbnRlbnQuZm10IHx8IFtdO1xuXG4gIGNvbnRlbnQuZm10LnB1c2goe1xuICAgIGF0OiBhdCxcbiAgICBsZW46IGxlbixcbiAgICBrZXk6IGNvbnRlbnQuZW50Lmxlbmd0aFxuICB9KTtcbiAgY29udGVudC5lbnQucHVzaCh7XG4gICAgdHA6ICdCTicsXG4gICAgZGF0YToge1xuICAgICAgYWN0OiBhY3Rpb25UeXBlLFxuICAgICAgdmFsOiBhY3Rpb25WYWx1ZSxcbiAgICAgIHJlZjogcmVmVXJsLFxuICAgICAgbmFtZTogbmFtZVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbi8qKlxuICogQXBwZW5kIGNsaWNrYWJsZSBidXR0b24gdG8gRHJhZnR5IGRvY3VtZW50LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fHN0cmluZ30gY29udGVudCAtIERyYWZ0eSBkb2N1bWVudCB0byBpbnNlcnQgYnV0dG9uIHRvIG9yIGEgc3RyaW5nIHRvIGJlIHVzZWQgYXMgYnV0dG9uIHRleHQuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGl0bGUgLSB0aGUgdGV4dCB0byBiZSB1c2VkIGFzIGJ1dHRvbiB0aXRsZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gdGhlIGJ1dHRvbi4gQ2xpZW50IHNob3VsZCByZXR1cm4gaXQgdG8gdGhlIHNlcnZlciB3aGVuIHRoZSBidXR0b24gaXMgY2xpY2tlZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBhY3Rpb25UeXBlIC0gdGhlIHR5cGUgb2YgdGhlIGJ1dHRvbiwgb25lIG9mICd1cmwnIG9yICdwdWInLlxuICogQHBhcmFtIHtzdHJpbmd9IGFjdGlvblZhbHVlIC0gdGhlIHZhbHVlIHRvIHJldHVybiBvbiBjbGljazpcbiAqIEBwYXJhbSB7c3RyaW5nfSByZWZVcmwgLSB0aGUgVVJMIHRvIGdvIHRvIHdoZW4gdGhlICd1cmwnIGJ1dHRvbiBpcyBjbGlja2VkLlxuICpcbiAqIEByZXR1cm4ge0RyYWZ0eX0gdXBkYXRlZCBkb2N1bWVudC5cbiAqL1xuRHJhZnR5LmFwcGVuZEJ1dHRvbiA9IGZ1bmN0aW9uKGNvbnRlbnQsIHRpdGxlLCBuYW1lLCBhY3Rpb25UeXBlLCBhY3Rpb25WYWx1ZSwgcmVmVXJsKSB7XG4gIGNvbnRlbnQgPSBjb250ZW50IHx8IHtcbiAgICB0eHQ6IFwiXCJcbiAgfTtcbiAgY29uc3QgYXQgPSBjb250ZW50LnR4dC5sZW5ndGg7XG4gIGNvbnRlbnQudHh0ICs9IHRpdGxlO1xuICByZXR1cm4gRHJhZnR5Lmluc2VydEJ1dHRvbihjb250ZW50LCBhdCwgdGl0bGUubGVuZ3RoLCBuYW1lLCBhY3Rpb25UeXBlLCBhY3Rpb25WYWx1ZSwgcmVmVXJsKTtcbn1cblxuLyoqXG4gKiBBdHRhY2ggYSBnZW5lcmljIEpTIG9iamVjdC4gVGhlIG9iamVjdCBpcyBhdHRhY2hlZCBhcyBhIGpzb24gc3RyaW5nLlxuICogSW50ZW5kZWQgZm9yIHJlcHJlc2VudGluZyBhIGZvcm0gcmVzcG9uc2UuXG4gKlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gRHJhZnR5IGRvY3VtZW50IHRvIGF0dGFjaCBmaWxlIHRvLlxuICogQHBhcmFtIHtPYmplY3R9IGRhdGEgLSBkYXRhIHRvIGNvbnZlcnQgdG8ganNvbiBzdHJpbmcgYW5kIGF0dGFjaC5cbiAqIEByZXR1cm5zIHtEcmFmdHl9IHRoZSBzYW1lIGRvY3VtZW50IGFzIDxjb2RlPmNvbnRlbnQ8L2NvZGU+LlxuICovXG5EcmFmdHkuYXR0YWNoSlNPTiA9IGZ1bmN0aW9uKGNvbnRlbnQsIGRhdGEpIHtcbiAgY29udGVudCA9IGNvbnRlbnQgfHwge1xuICAgIHR4dDogXCJcIlxuICB9O1xuICBjb250ZW50LmVudCA9IGNvbnRlbnQuZW50IHx8IFtdO1xuICBjb250ZW50LmZtdCA9IGNvbnRlbnQuZm10IHx8IFtdO1xuXG4gIGNvbnRlbnQuZm10LnB1c2goe1xuICAgIGF0OiAtMSxcbiAgICBsZW46IDAsXG4gICAga2V5OiBjb250ZW50LmVudC5sZW5ndGhcbiAgfSk7XG5cbiAgY29udGVudC5lbnQucHVzaCh7XG4gICAgdHA6ICdFWCcsXG4gICAgZGF0YToge1xuICAgICAgbWltZTogSlNPTl9NSU1FX1RZUEUsXG4gICAgICB2YWw6IGRhdGFcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBjb250ZW50O1xufVxuLyoqXG4gKiBBcHBlbmQgbGluZSBicmVhayB0byBhIERyYWZ0eSBkb2N1bWVudC5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIERyYWZ0eSBkb2N1bWVudCB0byBhcHBlbmQgbGluZWJyZWFrIHRvLlxuICogQHJldHVybnMge0RyYWZ0eX0gdGhlIHNhbWUgZG9jdW1lbnQgYXMgPGNvZGU+Y29udGVudDwvY29kZT4uXG4gKi9cbkRyYWZ0eS5hcHBlbmRMaW5lQnJlYWsgPSBmdW5jdGlvbihjb250ZW50KSB7XG4gIGNvbnRlbnQgPSBjb250ZW50IHx8IHtcbiAgICB0eHQ6IFwiXCJcbiAgfTtcbiAgY29udGVudC5mbXQgPSBjb250ZW50LmZtdCB8fCBbXTtcbiAgY29udGVudC5mbXQucHVzaCh7XG4gICAgYXQ6IGNvbnRlbnQudHh0Lmxlbmd0aCxcbiAgICBsZW46IDEsXG4gICAgdHA6ICdCUidcbiAgfSk7XG4gIGNvbnRlbnQudHh0ICs9IFwiIFwiO1xuXG4gIHJldHVybiBjb250ZW50O1xufVxuLyoqXG4gKiBHaXZlbiBEcmFmdHkgZG9jdW1lbnQsIGNvbnZlcnQgaXQgdG8gSFRNTC5cbiAqIE5vIGF0dGVtcHQgaXMgbWFkZSB0byBzdHJpcCBwcmUtZXhpc3RpbmcgaHRtbCBtYXJrdXAuXG4gKiBUaGlzIGlzIHBvdGVudGlhbGx5IHVuc2FmZSBiZWNhdXNlIDxjb2RlPmNvbnRlbnQudHh0PC9jb2RlPiBtYXkgY29udGFpbiBtYWxpY2lvdXNcbiAqIG1hcmt1cC5cbiAqIEBtZW1iZXJvZiBUaW5vZGUuRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmeX0gY29udGVudCAtIGRvY3VtZW50IHRvIGNvbnZlcnQuXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gSFRNTC1yZXByZXNlbnRhdGlvbiBvZiBjb250ZW50LlxuICovXG5EcmFmdHkuVU5TQUZFX3RvSFRNTCA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcbiAgbGV0IHtcbiAgICB0eHQsXG4gICAgZm10LFxuICAgIGVudFxuICB9ID0gY29udGVudDtcblxuICBjb25zdCBtYXJrdXAgPSBbXTtcbiAgaWYgKGZtdCkge1xuICAgIGZvciAobGV0IGkgaW4gZm10KSB7XG4gICAgICBjb25zdCByYW5nZSA9IGZtdFtpXTtcbiAgICAgIGNvbnN0IGF0ID0gcmFuZ2UuYXQgfCAwO1xuICAgICAgbGV0IHRwID0gcmFuZ2UudHA7XG4gICAgICBsZXQgZGF0YTtcbiAgICAgIGlmICghdHApIHtcbiAgICAgICAgY29uc3QgZW50aXR5ID0gZW50W3JhbmdlLmtleSB8IDBdO1xuICAgICAgICBpZiAoZW50aXR5KSB7XG4gICAgICAgICAgdHAgPSBlbnRpdHkudHA7XG4gICAgICAgICAgZGF0YSA9IGVudGl0eS5kYXRhO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChERUNPUkFUT1JTW3RwXSkge1xuICAgICAgICAvLyBCZWNhdXNlIHdlIGxhdGVyIHNvcnQgaW4gZGVzY2VuZGluZyBvcmRlciwgY2xvc2luZyBtYXJrdXAgbXVzdCBjb21lIGZpcnN0LlxuICAgICAgICAvLyBPdGhlcndpc2UgemVyby1sZW5ndGggb2JqZWN0cyB3aWxsIG5vdCBiZSByZXByZXNlbnRlZCBjb3JyZWN0bHkuXG4gICAgICAgIG1hcmt1cC5wdXNoKHtcbiAgICAgICAgICBpZHg6IGF0ICsgcmFuZ2UubGVuLFxuICAgICAgICAgIGxlbjogLXJhbmdlLmxlbixcbiAgICAgICAgICB3aGF0OiBERUNPUkFUT1JTW3RwXS5jbG9zZShkYXRhKVxuICAgICAgICB9KTtcbiAgICAgICAgbWFya3VwLnB1c2goe1xuICAgICAgICAgIGlkeDogYXQsXG4gICAgICAgICAgbGVuOiByYW5nZS5sZW4sXG4gICAgICAgICAgd2hhdDogREVDT1JBVE9SU1t0cF0ub3BlbihkYXRhKVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBtYXJrdXAuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIGIuaWR4ID09IGEuaWR4ID8gYi5sZW4gLSBhLmxlbiA6IGIuaWR4IC0gYS5pZHg7IC8vIGluIGRlc2NlbmRpbmcgb3JkZXJcbiAgfSk7XG5cbiAgZm9yIChsZXQgaSBpbiBtYXJrdXApIHtcbiAgICBpZiAobWFya3VwW2ldLndoYXQpIHtcbiAgICAgIHR4dCA9IHNwbGljZSh0eHQsIG1hcmt1cFtpXS5pZHgsIG1hcmt1cFtpXS53aGF0KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHh0O1xufVxuXG4vKipcbiAqIENhbGxiYWNrIGZvciBhcHBseWluZyBjdXN0b20gZm9ybWF0dGluZy90cmFuc2Zvcm1hdGlvbiB0byBhIERyYWZ0eSBkb2N1bWVudC5cbiAqIENhbGxlZCBvbmNlIGZvciBlYWNoIHN5bGUgc3Bhbi5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAY2FsbGJhY2sgRm9ybWF0dGVyXG4gKiBAcGFyYW0ge3N0cmluZ30gc3R5bGUgLSBzdHlsZSBjb2RlIHN1Y2ggYXMgXCJTVFwiIG9yIFwiSU1cIi5cbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIC0gZW50aXR5J3MgZGF0YVxuICogQHBhcmFtIHtPYmplY3R9IHZhbHVlcyAtIHBvc3NpYmx5IHN0eWxlZCBzdWJzcGFucyBjb250YWluZWQgaW4gdGhpcyBzdHlsZSBzcGFuLlxuICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IC0gb2YgdGhlIGN1cnJlbnQgZWxlbWVudCBhbW9uZyBpdHMgc2libGluZ3MuXG4gKi9cblxuLyoqXG4gKiBUcmFuc2Zvcm0gRHJhZnR5IGRvY3VtZW50IHVzaW5nIGN1c3RvbSBmb3JtYXR0aW5nLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gY29udGVudCB0byB0cmFuc2Zvcm0uXG4gKiBAcGFyYW0ge0Zvcm1hdHRlcn0gZm9ybWF0dGVyIC0gY2FsbGJhY2sgd2hpY2ggdHJhbnNmb3JtcyBpbmRpdmlkdWFsIGVsZW1lbnRzXG4gKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCAtIGNvbnRleHQgcHJvdmlkZWQgdG8gZm9ybWF0dGVyIGFzIDxjb2RlPnRoaXM8L2NvZGU+LlxuICpcbiAqIEByZXR1cm4ge09iamVjdH0gdHJhbnNmb3JtZWQgb2JqZWN0XG4gKi9cbkRyYWZ0eS5mb3JtYXQgPSBmdW5jdGlvbihjb250ZW50LCBmb3JtYXR0ZXIsIGNvbnRleHQpIHtcbiAgbGV0IHtcbiAgICB0eHQsXG4gICAgZm10LFxuICAgIGVudFxuICB9ID0gY29udGVudDtcblxuICAvLyBBc3NpZ24gZGVmYXVsdCB2YWx1ZXMuXG4gIHR4dCA9IHR4dCB8fCBcIlwiO1xuICBpZiAoIUFycmF5LmlzQXJyYXkoZW50KSkge1xuICAgIGVudCA9IFtdO1xuICB9XG5cbiAgaWYgKCFBcnJheS5pc0FycmF5KGZtdCkpIHtcbiAgICAvLyBIYW5kbGUgc3BlY2lhbCBjYXNlIHdoZW4gYWxsIHZhbHVlcyBpbiBmbXQgYXJlIDAgYW5kIGZtdCBpcyBza2lwcGVkLlxuICAgIGlmIChlbnQubGVuZ3RoID09IDEpIHtcbiAgICAgIGZtdCA9IFt7XG4gICAgICAgIGF0OiAwLFxuICAgICAgICBsZW46IDAsXG4gICAgICAgIGtleTogMFxuICAgICAgfV07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBbdHh0XTtcbiAgICB9XG4gIH1cblxuICBsZXQgc3BhbnMgPSBbXS5jb25jYXQoZm10KTtcblxuICAvLyBaZXJvIHZhbHVlcyBtYXkgaGF2ZSBiZWVuIHN0cmlwcGVkLiBSZXN0b3JlIHRoZW0uXG4gIC8vIEFsc28gZW5zdXJlIGluZGV4ZXMgYW5kIGxlbmd0aHMgYXJlIHNhbmUuXG4gIHNwYW5zLm1hcChmdW5jdGlvbihzKSB7XG4gICAgcy5hdCA9IHMuYXQgfHwgMDtcbiAgICBzLmxlbiA9IHMubGVuIHx8IDA7XG4gICAgaWYgKHMubGVuIDwgMCkge1xuICAgICAgcy5sZW4gPSAwO1xuICAgIH1cbiAgICBpZiAocy5hdCA8IC0xKSB7XG4gICAgICBzLmF0ID0gLTE7XG4gICAgfVxuICB9KTtcblxuICAvLyBTb3J0IHNwYW5zIGZpcnN0IGJ5IHN0YXJ0IGluZGV4IChhc2MpIHRoZW4gYnkgbGVuZ3RoIChkZXNjKS5cbiAgc3BhbnMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgaWYgKGEuYXQgLSBiLmF0ID09IDApIHtcbiAgICAgIHJldHVybiBiLmxlbiAtIGEubGVuOyAvLyBsb25nZXIgb25lIGNvbWVzIGZpcnN0ICg8MClcbiAgICB9XG4gICAgcmV0dXJuIGEuYXQgLSBiLmF0O1xuICB9KTtcblxuICAvLyBEZW5vcm1hbGl6ZSBlbnRpdGllcyBpbnRvIHNwYW5zLiBDcmVhdGUgYSBjb3B5IG9mIHRoZSBvYmplY3RzIHRvIGxlYXZlXG4gIC8vIG9yaWdpbmFsIERyYWZ0eSBvYmplY3QgdW5jaGFuZ2VkLlxuICBzcGFucyA9IHNwYW5zLm1hcCgocykgPT4ge1xuICAgIGxldCBkYXRhO1xuICAgIGxldCB0cCA9IHMudHA7XG4gICAgaWYgKCF0cCkge1xuICAgICAgcy5rZXkgPSBzLmtleSB8fCAwO1xuICAgICAgaWYgKGVudFtzLmtleV0pIHtcbiAgICAgICAgZGF0YSA9IGVudFtzLmtleV0uZGF0YTtcbiAgICAgICAgdHAgPSBlbnRbcy5rZXldLnRwO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFR5cGUgc3RpbGwgbm90IGRlZmluZWQ/IEhpZGUgaW52YWxpZCBlbGVtZW50LlxuICAgIHRwID0gdHAgfHwgJ0hEJztcblxuICAgIHJldHVybiB7XG4gICAgICB0cDogdHAsXG4gICAgICBkYXRhOiBkYXRhLFxuICAgICAgYXQ6IHMuYXQsXG4gICAgICBsZW46IHMubGVuXG4gICAgfTtcbiAgfSk7XG5cbiAgcmV0dXJuIGZvckVhY2godHh0LCAwLCB0eHQubGVuZ3RoLCBzcGFucywgZm9ybWF0dGVyLCBjb250ZXh0KTtcbn1cblxuLyoqXG4gKiBHaXZlbiBEcmFmdHkgZG9jdW1lbnQsIGNvbnZlcnQgaXQgdG8gcGxhaW4gdGV4dC5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIGRvY3VtZW50IHRvIGNvbnZlcnQgdG8gcGxhaW4gdGV4dC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IHBsYWluLXRleHQgcmVwcmVzZW50YXRpb24gb2YgdGhlIGRyYWZ0eSBkb2N1bWVudC5cbiAqL1xuRHJhZnR5LnRvUGxhaW5UZXh0ID0gZnVuY3Rpb24oY29udGVudCkge1xuICByZXR1cm4gdHlwZW9mIGNvbnRlbnQgPT0gJ3N0cmluZycgPyBjb250ZW50IDogY29udGVudC50eHQ7XG59XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhlIGRvY3VtZW50IGhhcyBubyBtYXJrdXAgYW5kIG5vIGVudGl0aWVzLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gY29udGVudCB0byBjaGVjayBmb3IgcHJlc2VuY2Ugb2YgbWFya3VwLlxuICogQHJldHVybnMgPGNvZGU+dHJ1ZTwvY29kZT4gaXMgY29udGVudCBpcyBwbGFpbiB0ZXh0LCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICovXG5EcmFmdHkuaXNQbGFpblRleHQgPSBmdW5jdGlvbihjb250ZW50KSB7XG4gIHJldHVybiB0eXBlb2YgY29udGVudCA9PSAnc3RyaW5nJyB8fCAhKGNvbnRlbnQuZm10IHx8IGNvbnRlbnQuZW50KTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgdGhlIG9iamVjdCByZXByZXNldHMgaXMgYSB2YWxpZCBEcmFmdHkgZG9jdW1lbnQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBjb250ZW50IHRvIGNoZWNrIGZvciB2YWxpZGl0eS5cbiAqIEByZXR1cm5zIDxjb2RlPnRydWU8L2NvZGU+IGlzIGNvbnRlbnQgaXMgdmFsaWQsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gKi9cbkRyYWZ0eS5pc1ZhbGlkID0gZnVuY3Rpb24oY29udGVudCkge1xuICBpZiAoIWNvbnRlbnQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCB7XG4gICAgdHh0LFxuICAgIGZtdCxcbiAgICBlbnRcbiAgfSA9IGNvbnRlbnQ7XG5cbiAgaWYgKCF0eHQgJiYgdHh0ICE9PSAnJyAmJiAhZm10ICYmICFlbnQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCB0eHRfdHlwZSA9IHR5cGVvZiB0eHQ7XG4gIGlmICh0eHRfdHlwZSAhPSAnc3RyaW5nJyAmJiB0eHRfdHlwZSAhPSAndW5kZWZpbmVkJyAmJiB0eHQgIT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAodHlwZW9mIGZtdCAhPSAndW5kZWZpbmVkJyAmJiAhQXJyYXkuaXNBcnJheShmbXQpICYmIGZtdCAhPT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgZW50ICE9ICd1bmRlZmluZWQnICYmICFBcnJheS5pc0FycmF5KGVudCkgJiYgZW50ICE9PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqIENoZWNrIGlmIHRoZSBkcmFmdHkgZG9jdW1lbnQgaGFzIGF0dGFjaG1lbnRzLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gZG9jdW1lbnQgdG8gY2hlY2sgZm9yIGF0dGFjaG1lbnRzLlxuICogQHJldHVybnMgPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdGhlcmUgYXJlIGF0dGFjaG1lbnRzLlxuICovXG5EcmFmdHkuaGFzQXR0YWNobWVudHMgPSBmdW5jdGlvbihjb250ZW50KSB7XG4gIGlmIChjb250ZW50LmVudCAmJiBjb250ZW50LmVudC5sZW5ndGggPiAwKSB7XG4gICAgZm9yIChsZXQgaSBpbiBjb250ZW50LmVudCkge1xuICAgICAgaWYgKGNvbnRlbnQuZW50W2ldICYmIGNvbnRlbnQuZW50W2ldLnRwID09ICdFWCcpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBDYWxsYmFjayBmb3IgYXBwbHlpbmcgY3VzdG9tIGZvcm1hdHRpbmcvdHJhbnNmb3JtYXRpb24gdG8gYSBEcmFmdHkgZG9jdW1lbnQuXG4gKiBDYWxsZWQgb25jZSBmb3IgZWFjaCBzeWxlIHNwYW4uXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQGNhbGxiYWNrIEF0dGFjaG1lbnRDYWxsYmFja1xuICogQHBhcmFtIHtPYmplY3R9IGRhdGEgYXR0YWNobWVudCBkYXRhXG4gKiBAcGFyYW0ge251bWJlcn0gaW5kZXggYXR0YWNobWVudCdzIGluZGV4IGluIGBjb250ZW50LmVudGAuXG4gKi9cblxuLyoqXG4gKiBFbnVtZXJhdGUgYXR0YWNobWVudHMuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBkb2N1bWVudCB0byBwcm9jZXNzIGZvciBhdHRhY2htZW50cy5cbiAqIEBwYXJhbSB7QXR0YWNobWVudENhbGxiYWNrfSBjYWxsYmFjayAtIGNhbGxiYWNrIHRvIGNhbGwgZm9yIGVhY2ggYXR0YWNobWVudC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gdmFsdWUgb2YgXCJ0aGlzXCIgZm9yIGNhbGxiYWNrLlxuICovXG5EcmFmdHkuYXR0YWNobWVudHMgPSBmdW5jdGlvbihjb250ZW50LCBjYWxsYmFjaywgY29udGV4dCkge1xuICBpZiAoY29udGVudC5lbnQgJiYgY29udGVudC5lbnQubGVuZ3RoID4gMCkge1xuICAgIGZvciAobGV0IGkgaW4gY29udGVudC5lbnQpIHtcbiAgICAgIGlmIChjb250ZW50LmVudFtpXSAmJiBjb250ZW50LmVudFtpXS50cCA9PSAnRVgnKSB7XG4gICAgICAgIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgY29udGVudC5lbnRbaV0uZGF0YSwgaSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogR2l2ZW4gdGhlIGVudGl0eSwgZ2V0IFVSTCB3aGljaCBjYW4gYmUgdXNlZCBmb3IgZG93bmxvYWRpbmdcbiAqIGVudGl0eSBkYXRhLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBlbnREYXRhIC0gZW50aXR5LmRhdGEgdG8gZ2V0IHRoZSBVUmwgZnJvbS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFVSTCB0byBkb3dubG9hZCBlbnRpdHkgZGF0YSBvciA8Y29kZT5udWxsPC9jb2RlPi5cbiAqL1xuRHJhZnR5LmdldERvd25sb2FkVXJsID0gZnVuY3Rpb24oZW50RGF0YSkge1xuICBsZXQgdXJsID0gbnVsbDtcbiAgaWYgKGVudERhdGEubWltZSAhPSBKU09OX01JTUVfVFlQRSAmJiBlbnREYXRhLnZhbCkge1xuICAgIHVybCA9IGJhc2U2NHRvT2JqZWN0VXJsKGVudERhdGEudmFsLCBlbnREYXRhLm1pbWUsIERyYWZ0eS5sb2dnZXIpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBlbnREYXRhLnJlZiA9PSAnc3RyaW5nJykge1xuICAgIHVybCA9IGVudERhdGEucmVmO1xuICB9XG4gIHJldHVybiB1cmw7XG59XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhlIGVudGl0eSBkYXRhIGlzIG5vdCByZWFkeSBmb3Igc2VuZGluZywgc3VjaCBhcyBiZWluZyB1cGxvYWRlZCB0byB0aGUgc2VydmVyLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBlbnRpdHkuZGF0YSB0byBnZXQgdGhlIFVSbCBmcm9tLlxuICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdXBsb2FkIGlzIGluIHByb2dyZXNzLCBmYWxzZSBvdGhlcndpc2UuXG4gKi9cbkRyYWZ0eS5pc1Byb2Nlc3NpbmcgPSBmdW5jdGlvbihlbnREYXRhKSB7XG4gIHJldHVybiAhIWVudERhdGEuX3Byb2Nlc3Npbmc7XG59XG5cbi8qKlxuICogR2l2ZW4gdGhlIGVudGl0eSwgZ2V0IFVSTCB3aGljaCBjYW4gYmUgdXNlZCBmb3IgcHJldmlld2luZ1xuICogdGhlIGVudGl0eS5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZW50aXR5LmRhdGEgdG8gZ2V0IHRoZSBVUmwgZnJvbS5cbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSB1cmwgZm9yIHByZXZpZXdpbmcgb3IgbnVsbCBpZiBubyBzdWNoIHVybCBpcyBhdmFpbGFibGUuXG4gKi9cbkRyYWZ0eS5nZXRQcmV2aWV3VXJsID0gZnVuY3Rpb24oZW50RGF0YSkge1xuICByZXR1cm4gZW50RGF0YS52YWwgPyBiYXNlNjR0b09iamVjdFVybChlbnREYXRhLnZhbCwgZW50RGF0YS5taW1lLCBEcmFmdHkubG9nZ2VyKSA6IG51bGw7XG59XG5cbi8qKlxuICogR2V0IGFwcHJveGltYXRlIHNpemUgb2YgdGhlIGVudGl0eS5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZW50RGF0YSAtIGVudGl0eS5kYXRhIHRvIGdldCB0aGUgc2l6ZSBmb3IuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBzaXplIG9mIGVudGl0eSBkYXRhIGluIGJ5dGVzLlxuICovXG5EcmFmdHkuZ2V0RW50aXR5U2l6ZSA9IGZ1bmN0aW9uKGVudERhdGEpIHtcbiAgLy8gRWl0aGVyIHNpemUgaGludCBvciBsZW5ndGggb2YgdmFsdWUuIFRoZSB2YWx1ZSBpcyBiYXNlNjQgZW5jb2RlZCxcbiAgLy8gdGhlIGFjdHVhbCBvYmplY3Qgc2l6ZSBpcyBzbWFsbGVyIHRoYW4gdGhlIGVuY29kZWQgbGVuZ3RoLlxuICByZXR1cm4gZW50RGF0YS5zaXplID8gZW50RGF0YS5zaXplIDogZW50RGF0YS52YWwgPyAoZW50RGF0YS52YWwubGVuZ3RoICogMC43NSkgfCAwIDogMDtcbn1cblxuLyoqXG4gKiBHZXQgZW50aXR5IG1pbWUgdHlwZS5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZW50RGF0YSAtIGVudGl0eS5kYXRhIHRvIGdldCB0aGUgdHlwZSBmb3IuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBtaW1lIHR5cGUgb2YgZW50aXR5LlxuICovXG5EcmFmdHkuZ2V0RW50aXR5TWltZVR5cGUgPSBmdW5jdGlvbihlbnREYXRhKSB7XG4gIHJldHVybiBlbnREYXRhLm1pbWUgfHwgJ3RleHQvcGxhaW4nO1xufVxuXG4vKipcbiAqIEdldCBIVE1MIHRhZyBmb3IgYSBnaXZlbiB0d28tbGV0dGVyIHN0eWxlIG5hbWUuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHN0eWxlIC0gdHdvLWxldHRlciBzdHlsZSwgbGlrZSBTVCBvciBMTi5cbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBIVE1MIHRhZyBuYW1lIGlmIHN0eWxlIGlzIGZvdW5kLCAnX1VOS04nIGlmIG5vdCBmb3VuZCwge2NvZGU6IHVuZGVmaW5lZH0gaWYgc3R5bGUgaXMgZmFsc2lzaC5cbiAqL1xuRHJhZnR5LnRhZ05hbWUgPSBmdW5jdGlvbihzdHlsZSkge1xuICByZXR1cm4gc3R5bGUgPyAoSFRNTF9UQUdTW3N0eWxlXSA/IEhUTUxfVEFHU1tzdHlsZV0ubmFtZSA6ICdfVU5LTicpIDogdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIEZvciBhIGdpdmVuIGRhdGEgYnVuZGxlIGdlbmVyYXRlIGFuIG9iamVjdCB3aXRoIEhUTUwgYXR0cmlidXRlcyxcbiAqIGZvciBpbnN0YW5jZSwgZ2l2ZW4ge3VybDogXCJodHRwOi8vd3d3LmV4YW1wbGUuY29tL1wifSByZXR1cm5cbiAqIHtocmVmOiBcImh0dHA6Ly93d3cuZXhhbXBsZS5jb20vXCJ9XG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHN0eWxlIC0gdHdvLWxldHRlciBzdHlsZSB0byBnZW5lcmF0ZSBhdHRyaWJ1dGVzIGZvci5cbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIC0gZGF0YSBidW5kbGUgdG8gY29udmVydCB0byBhdHRyaWJ1dGVzXG4gKlxuICogQHJldHVybnMge09iamVjdH0gb2JqZWN0IHdpdGggSFRNTCBhdHRyaWJ1dGVzLlxuICovXG5EcmFmdHkuYXR0clZhbHVlID0gZnVuY3Rpb24oc3R5bGUsIGRhdGEpIHtcbiAgaWYgKGRhdGEgJiYgREVDT1JBVE9SU1tzdHlsZV0pIHtcbiAgICByZXR1cm4gREVDT1JBVE9SU1tzdHlsZV0ucHJvcHMoZGF0YSk7XG4gIH1cblxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIERyYWZ0eSBNSU1FIHR5cGUuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gSFRUUCBDb250ZW50LVR5cGUgXCJ0ZXh0L3gtZHJhZnR5XCIuXG4gKi9cbkRyYWZ0eS5nZXRDb250ZW50VHlwZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gJ3RleHQveC1kcmFmdHknO1xufVxuXG4vKipcbiAqIFNob3J0ZW4gRHJhZnR5IGRvY3VtZW50IGFuZCBzdHJpcCBhbGwgZW50aXR5IGRhdGEgbGVhdmluZyBqdXN0IGlubGluZSBzdHlsZXMgYW5kIGVudGl0eSByZWZlcmVuY2VzLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBvcmlnaW5hbCAtIERyYWZ0eSBvYmplY3QgdG8gc2hvcnRlbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBsZW5ndGggLSBsZW5ndGggaW4gY2hhcmFjdGVycyB0byBzaG9ydGVuIHRvLlxuICogQHJldHVybnMgbmV3IHNob3J0ZW5lZCBEcmFmdHkgb2JqZWN0IGxlYXZpbmcgdGhlIG9yaWdpbmFsIGludGFjdC5cbiAqL1xuRHJhZnR5LnByZXZpZXcgPSBmdW5jdGlvbihvcmlnaW5hbCwgbGVuZ3RoKSB7XG4gIGlmICghb3JpZ2luYWwgfHwgbGVuZ3RoIDw9IDAgfHwgdHlwZW9mIG9yaWdpbmFsICE9ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCB7XG4gICAgdHh0LFxuICAgIGZtdCxcbiAgICBlbnRcbiAgfSA9IG9yaWdpbmFsO1xuXG4gIGNvbnN0IHByZXZpZXcgPSB7XG4gICAgdHh0OiAnJ1xuICB9O1xuICBsZXQgbGVuID0gMDtcbiAgaWYgKHR5cGVvZiB0eHQgPT0gJ3N0cmluZycpIHtcbiAgICBpZiAodHh0Lmxlbmd0aCA+IGxlbmd0aCkge1xuICAgICAgcHJldmlldy50eHQgPSB0eHQuc3Vic3RyKDAsIGxlbmd0aCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHByZXZpZXcudHh0ID0gdHh0O1xuICAgIH1cbiAgICBsZW4gPSBwcmV2aWV3LnR4dC5sZW5ndGg7XG4gIH1cblxuICBpZiAoQXJyYXkuaXNBcnJheShmbXQpICYmIGZtdC5sZW5ndGggPiAwKSB7XG4gICAgLy8gT2xkIGtleSB0byBuZXcga2V5IGVudGl0eSBtYXBwaW5nLlxuICAgIGNvbnN0IGVudF9yZWZzID0gW107XG4gICAgLy8gQ291bnQgc3R5bGVzIHdoaWNoIHN0YXJ0IHdpdGhpbiB0aGUgbmV3IGxlbmd0aCBvZiB0aGUgdGV4dCBhbmQgc2F2ZSBlbnRpdHkga2V5cyBhcyBhIHNldC5cbiAgICBsZXQgZm10X2NvdW50ID0gMDtcbiAgICBsZXQgZW50X2NvdW50ID0gMDtcbiAgICBmbXQuZm9yRWFjaCgoc3QpID0+IHtcbiAgICAgIGlmIChzdC5hdCA8IGxlbikge1xuICAgICAgICBmbXRfY291bnQrKztcbiAgICAgICAgaWYgKCFzdC50cCkge1xuICAgICAgICAgIGNvbnN0IGtleSA9IHN0LmtleSB8IDA7XG4gICAgICAgICAgaWYgKCFlbnRfcmVmc1trZXldKSB7XG4gICAgICAgICAgICBlbnRfcmVmc1trZXldID0gZW50X2NvdW50O1xuICAgICAgICAgICAgZW50X2NvdW50Kys7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoZm10X2NvdW50ID09IDApIHtcbiAgICAgIHJldHVybiBwcmV2aWV3O1xuICAgIH1cblxuICAgIC8vIEFsbG9jYXRlIHNwYWNlIGZvciBjb3B5aW5nIHN0eWxlcyBhbmQgZW50aXRpZXMuXG4gICAgcHJldmlldy5mbXQgPSBbXTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShlbnQpICYmIGVudF9yZWZzLmxlbmd0aCA+IDApIHtcbiAgICAgIHByZXZpZXcuZW50ID0gW107XG4gICAgfVxuXG4gICAgLy8gSW5zZXJ0aW9uIHBvaW50IGZvciBzdHlsZXMuXG4gICAgbGV0IGZtdF9pZHggPSAwO1xuICAgIGZtdC5mb3JFYWNoKChzdCkgPT4ge1xuICAgICAgaWYgKHN0LmF0IDwgbGVuKSB7XG4gICAgICAgIGNvbnN0IHN0eWxlID0ge1xuICAgICAgICAgIGF0OiBzdC5hdCxcbiAgICAgICAgICBsZW46IHN0LmxlblxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBrZXkgPSBzdC5rZXkgfCAwO1xuICAgICAgICBpZiAoc3QudHApIHtcbiAgICAgICAgICBzdHlsZS50cCA9ICcnICsgc3QudHA7XG4gICAgICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShlbnQpICYmIGVudC5sZW5ndGggPiBrZXkgJiYgdHlwZW9mIGVudF9yZWZzW2tleV0gPT0gJ251bWJlcicpIHtcbiAgICAgICAgICBzdHlsZS5rZXkgPSBlbnRfcmVmc1trZXldO1xuICAgICAgICAgIHByZXZpZXcuZW50W3N0eWxlLmtleV0gPSBjb3B5TGlnaHQoZW50W2tleV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBwcmV2aWV3LmZtdFtmbXRfaWR4KytdID0gc3R5bGU7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gcHJldmlldztcbn1cblxuLy8gQ3JlYXRlIGEgY29weSBvZiBhbiBlbnRpdHkgd2l0aG91dCBsYXJnZSBkYXRhLlxuZnVuY3Rpb24gY29weUxpZ2h0KGVudCkge1xuICBsZXQgcmVzdWx0ID0ge1xuICAgIHRwOiBlbnQudHBcbiAgfTtcbiAgaWYgKGVudC5kYXRhICYmIE9iamVjdC5lbnRyaWVzKGVudC5kYXRhKS5sZW5ndGggIT0gMCkge1xuICAgIGNvbnN0IGRjID0ge307XG4gICAgW1wibWltZVwiLCBcIm5hbWVcIiwgXCJ3aWR0aFwiLCBcImhlaWdodFwiLCBcInNpemVcIl0uZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICBjb25zdCB2YWwgPSBlbnQuZGF0YVtrZXldO1xuICAgICAgaWYgKHZhbCkge1xuICAgICAgICBkY1trZXldID0gdmFsO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChPYmplY3QuZW50cmllcyhkYykubGVuZ3RoICE9IDApIHtcbiAgICAgIHJlc3VsdC5kYXRhID0gZGM7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmlmICh0eXBlb2YgbW9kdWxlICE9ICd1bmRlZmluZWQnKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gRHJhZnR5O1xufVxuIiwiLyoqXG4gKiBAZmlsZSBTREsgdG8gY29ubmVjdCB0byBUaW5vZGUgY2hhdCBzZXJ2ZXIuXG4gKiBTZWUgPGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS90aW5vZGUvd2ViYXBwXCI+XG4gKiBodHRwczovL2dpdGh1Yi5jb20vdGlub2RlL3dlYmFwcDwvYT4gZm9yIHJlYWwtbGlmZSB1c2FnZS5cbiAqXG4gKiBAY29weXJpZ2h0IDIwMTUtMjAyMSBUaW5vZGVcbiAqIEBzdW1tYXJ5IEphdmFzY3JpcHQgYmluZGluZ3MgZm9yIFRpbm9kZS5cbiAqIEBsaWNlbnNlIEFwYWNoZSAyLjBcbiAqIEB2ZXJzaW9uIDAuMTdcbiAqXG4gKiBAZXhhbXBsZVxuICogPGhlYWQ+XG4gKiA8c2NyaXB0IHNyYz1cIi4uLi90aW5vZGUuanNcIj48L3NjcmlwdD5cbiAqIDwvaGVhZD5cbiAqXG4gKiA8Ym9keT5cbiAqICAuLi5cbiAqIDxzY3JpcHQ+XG4gKiAgLy8gSW5zdGFudGlhdGUgdGlub2RlLlxuICogIGNvbnN0IHRpbm9kZSA9IG5ldyBUaW5vZGUoQVBQX05BTUUsIEhPU1QsIEFQSV9LRVksIG51bGwsIHRydWUpO1xuICogIHRpbm9kZS5lbmFibGVMb2dnaW5nKHRydWUpO1xuICogIC8vIEFkZCBsb2dpYyB0byBoYW5kbGUgZGlzY29ubmVjdHMuXG4gKiAgdGlub2RlLm9uRGlzY29ubmVjdCA9IGZ1bmN0aW9uKGVycikgeyAuLi4gfTtcbiAqICAvLyBDb25uZWN0IHRvIHRoZSBzZXJ2ZXIuXG4gKiAgdGlub2RlLmNvbm5lY3QoKS50aGVuKCgpID0+IHtcbiAqICAgIC8vIENvbm5lY3RlZC4gTG9naW4gbm93LlxuICogICAgcmV0dXJuIHRpbm9kZS5sb2dpbkJhc2ljKGxvZ2luLCBwYXNzd29yZCk7XG4gKiAgfSkudGhlbigoY3RybCkgPT4ge1xuICogICAgLy8gTG9nZ2VkIGluIGZpbmUsIGF0dGFjaCBjYWxsYmFja3MsIHN1YnNjcmliZSB0byAnbWUnLlxuICogICAgY29uc3QgbWUgPSB0aW5vZGUuZ2V0TWVUb3BpYygpO1xuICogICAgbWUub25NZXRhRGVzYyA9IGZ1bmN0aW9uKG1ldGEpIHsgLi4uIH07XG4gKiAgICAvLyBTdWJzY3JpYmUsIGZldGNoIHRvcGljIGRlc2NyaXB0aW9uIGFuZCB0aGUgbGlzdCBvZiBjb250YWN0cy5cbiAqICAgIG1lLnN1YnNjcmliZSh7Z2V0OiB7ZGVzYzoge30sIHN1Yjoge319KTtcbiAqICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gKiAgICAvLyBMb2dpbiBvciBzdWJzY3JpcHRpb24gZmFpbGVkLCBkbyBzb21ldGhpbmcuXG4gKiAgICAuLi5cbiAqICB9KTtcbiAqICAuLi5cbiAqIDwvc2NyaXB0PlxuICogPC9ib2R5PlxuICovXG4ndXNlIHN0cmljdCc7XG5cbi8vIE5PVEUgVE8gREVWRUxPUEVSUzpcbi8vIExvY2FsaXphYmxlIHN0cmluZ3Mgc2hvdWxkIGJlIGRvdWJsZSBxdW90ZWQgXCLRgdGC0YDQvtC60LAg0L3QsCDQtNGA0YPQs9C+0Lwg0Y/Qt9GL0LrQtVwiLFxuLy8gbm9uLWxvY2FsaXphYmxlIHN0cmluZ3Mgc2hvdWxkIGJlIHNpbmdsZSBxdW90ZWQgJ25vbi1sb2NhbGl6ZWQnLlxuXG4vLyBNb2R1bGUgaW1wb3J0cyBOb2RlLmpzIHN0eWxlLlxuaWYgKHR5cGVvZiByZXF1aXJlICE9ICdmdW5jdGlvbicpIHtcbiAgdGhyb3cgbmV3IEVycm9yKFwiVW5hYmxlIHRvIGxvYWQgbW9kdWxlczogcmVxdWlyZSgpIGlzIG5vdCBhdmFpbGFibGUuXCIpO1xufVxuXG5jb25zdCBDQnVmZmVyID0gcmVxdWlyZSgnLi9jYnVmZmVyLmpzJyk7XG5jb25zdCBDb25uZWN0aW9uID0gcmVxdWlyZSgnLi9jb25uZWN0aW9uLmpzJyk7XG5jb25zdCBEQkNhY2hlID0gcmVxdWlyZSgnLi9kYi5qcycpO1xuY29uc3QgRHJhZnR5ID0gcmVxdWlyZSgnLi9kcmFmdHkuanMnKTtcblxuY29uc3QgcGFja2FnZV92ZXJzaW9uID0gcmVxdWlyZSgnLi4vdmVyc2lvbi5qc29uJykudmVyc2lvbjtcblxubGV0IFdlYlNvY2tldFByb3ZpZGVyO1xuaWYgKHR5cGVvZiBXZWJTb2NrZXQgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgV2ViU29ja2V0UHJvdmlkZXIgPSBXZWJTb2NrZXQ7XG59XG5cbmxldCBYSFJQcm92aWRlcjtcbmlmICh0eXBlb2YgWE1MSHR0cFJlcXVlc3QgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgWEhSUHJvdmlkZXIgPSBYTUxIdHRwUmVxdWVzdDtcbn1cblxuaW5pdEZvck5vbkJyb3dzZXJBcHAoKTtcblxuLy8gR2xvYmFsIGNvbnN0YW50c1xuY29uc3QgUFJPVE9DT0xfVkVSU0lPTiA9ICcwJzsgLy8gTWFqb3IgY29tcG9uZW50IG9mIHRoZSB2ZXJzaW9uLCBlLmcuICcwJyBpbiAnMC4xNy4xJy5cbmNvbnN0IFZFUlNJT04gPSBwYWNrYWdlX3ZlcnNpb24gfHwgJzAuMTcnO1xuY29uc3QgTElCUkFSWSA9ICd0aW5vZGVqcy8nICsgVkVSU0lPTjtcblxuY29uc3QgVE9QSUNfTkVXID0gJ25ldyc7XG5jb25zdCBUT1BJQ19ORVdfQ0hBTiA9ICduY2gnO1xuY29uc3QgVE9QSUNfTUUgPSAnbWUnO1xuY29uc3QgVE9QSUNfRk5EID0gJ2ZuZCc7XG5jb25zdCBUT1BJQ19TWVMgPSAnc3lzJztcbmNvbnN0IFRPUElDX0NIQU4gPSAnY2huJztcbmNvbnN0IFVTRVJfTkVXID0gJ25ldyc7XG5cbi8vIFN0YXJ0aW5nIHZhbHVlIG9mIGEgbG9jYWxseS1nZW5lcmF0ZWQgc2VxSWQgdXNlZCBmb3IgcGVuZGluZyBtZXNzYWdlcy5cbmNvbnN0IExPQ0FMX1NFUUlEID0gMHhGRkZGRkZGO1xuXG5jb25zdCBNRVNTQUdFX1NUQVRVU19OT05FID0gMDsgLy8gU3RhdHVzIG5vdCBhc3NpZ25lZC5cbmNvbnN0IE1FU1NBR0VfU1RBVFVTX1FVRVVFRCA9IDE7IC8vIExvY2FsIElEIGFzc2lnbmVkLCBpbiBwcm9ncmVzcyB0byBiZSBzZW50LlxuY29uc3QgTUVTU0FHRV9TVEFUVVNfU0VORElORyA9IDI7IC8vIFRyYW5zbWlzc2lvbiBzdGFydGVkLlxuY29uc3QgTUVTU0FHRV9TVEFUVVNfRkFJTEVEID0gMzsgLy8gQXQgbGVhc3Qgb25lIGF0dGVtcHQgd2FzIG1hZGUgdG8gc2VuZCB0aGUgbWVzc2FnZS5cbmNvbnN0IE1FU1NBR0VfU1RBVFVTX1NFTlQgPSA0OyAvLyBEZWxpdmVyZWQgdG8gdGhlIHNlcnZlci5cbmNvbnN0IE1FU1NBR0VfU1RBVFVTX1JFQ0VJVkVEID0gNTsgLy8gUmVjZWl2ZWQgYnkgdGhlIGNsaWVudC5cbmNvbnN0IE1FU1NBR0VfU1RBVFVTX1JFQUQgPSA2OyAvLyBSZWFkIGJ5IHRoZSB1c2VyLlxuY29uc3QgTUVTU0FHRV9TVEFUVVNfVE9fTUUgPSA3OyAvLyBNZXNzYWdlIGZyb20gYW5vdGhlciB1c2VyLlxuXG4vLyBSZWplY3QgdW5yZXNvbHZlZCBmdXR1cmVzIGFmdGVyIHRoaXMgbWFueSBtaWxsaXNlY29uZHMuXG5jb25zdCBFWFBJUkVfUFJPTUlTRVNfVElNRU9VVCA9IDUwMDA7XG4vLyBQZXJpb2RpY2l0eSBvZiBnYXJiYWdlIGNvbGxlY3Rpb24gb2YgdW5yZXNvbHZlZCBmdXR1cmVzLlxuY29uc3QgRVhQSVJFX1BST01JU0VTX1BFUklPRCA9IDEwMDA7XG5cbi8vIERlZmF1bHQgbnVtYmVyIG9mIG1lc3NhZ2VzIHRvIHB1bGwgaW50byBtZW1vcnkgZnJvbSBwZXJzaXN0ZW50IGNhY2hlLlxuY29uc3QgREVGQVVMVF9NRVNTQUdFU19QQUdFID0gMjQ7XG5cbi8vIFV0aWxpdHkgZnVuY3Rpb25zXG5cbi8vIFBvbHlmaWxsIGZvciBub24tYnJvd3NlciBjb250ZXh0LCBlLmcuIE5vZGVKcy5cbmZ1bmN0aW9uIGluaXRGb3JOb25Ccm93c2VyQXBwKCkge1xuICAvLyBUaW5vZGUgcmVxdWlyZW1lbnQgaW4gbmF0aXZlIG1vZGUgYmVjYXVzZSByZWFjdCBuYXRpdmUgZG9lc24ndCBwcm92aWRlIEJhc2U2NCBtZXRob2RcbiAgY29uc3QgY2hhcnMgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLz0nO1xuXG4gIGlmICh0eXBlb2YgYnRvYSA9PSAndW5kZWZpbmVkJykge1xuICAgIGdsb2JhbC5idG9hID0gZnVuY3Rpb24oaW5wdXQgPSAnJykge1xuICAgICAgbGV0IHN0ciA9IGlucHV0O1xuICAgICAgbGV0IG91dHB1dCA9ICcnO1xuXG4gICAgICBmb3IgKGxldCBibG9jayA9IDAsIGNoYXJDb2RlLCBpID0gMCwgbWFwID0gY2hhcnM7IHN0ci5jaGFyQXQoaSB8IDApIHx8IChtYXAgPSAnPScsIGkgJSAxKTsgb3V0cHV0ICs9IG1hcC5jaGFyQXQoNjMgJiBibG9jayA+PiA4IC0gaSAlIDEgKiA4KSkge1xuXG4gICAgICAgIGNoYXJDb2RlID0gc3RyLmNoYXJDb2RlQXQoaSArPSAzIC8gNCk7XG5cbiAgICAgICAgaWYgKGNoYXJDb2RlID4gMHhGRikge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIididG9hJyBmYWlsZWQ6IFRoZSBzdHJpbmcgdG8gYmUgZW5jb2RlZCBjb250YWlucyBjaGFyYWN0ZXJzIG91dHNpZGUgb2YgdGhlIExhdGluMSByYW5nZS5cIik7XG4gICAgICAgIH1cbiAgICAgICAgYmxvY2sgPSBibG9jayA8PCA4IHwgY2hhckNvZGU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgYXRvYiA9PSAndW5kZWZpbmVkJykge1xuICAgIGdsb2JhbC5hdG9iID0gZnVuY3Rpb24oaW5wdXQgPSAnJykge1xuICAgICAgbGV0IHN0ciA9IGlucHV0LnJlcGxhY2UoLz0rJC8sICcnKTtcbiAgICAgIGxldCBvdXRwdXQgPSAnJztcblxuICAgICAgaWYgKHN0ci5sZW5ndGggJSA0ID09IDEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiJ2F0b2InIGZhaWxlZDogVGhlIHN0cmluZyB0byBiZSBkZWNvZGVkIGlzIG5vdCBjb3JyZWN0bHkgZW5jb2RlZC5cIik7XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBiYyA9IDAsIGJzID0gMCwgYnVmZmVyLCBpID0gMDsgYnVmZmVyID0gc3RyLmNoYXJBdChpKyspO1xuXG4gICAgICAgIH5idWZmZXIgJiYgKGJzID0gYmMgJSA0ID8gYnMgKiA2NCArIGJ1ZmZlciA6IGJ1ZmZlcixcbiAgICAgICAgICBiYysrICUgNCkgPyBvdXRwdXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSgyNTUgJiBicyA+PiAoLTIgKiBiYyAmIDYpKSA6IDBcbiAgICAgICkge1xuICAgICAgICBidWZmZXIgPSBjaGFycy5pbmRleE9mKGJ1ZmZlcik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfTtcbiAgfVxuXG4gIGlmICh0eXBlb2Ygd2luZG93ID09ICd1bmRlZmluZWQnKSB7XG4gICAgZ2xvYmFsLndpbmRvdyA9IHtcbiAgICAgIFdlYlNvY2tldDogV2ViU29ja2V0UHJvdmlkZXIsXG4gICAgICBYTUxIdHRwUmVxdWVzdDogWEhSUHJvdmlkZXIsXG4gICAgICBVUkw6IHtcbiAgICAgICAgY3JlYXRlT2JqZWN0VVJMOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmFibGUgdG8gdXNlIFVSTC5jcmVhdGVPYmplY3RVUkwgaW4gYSBub24tYnJvd3NlciBhcHBsaWNhdGlvblwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIENvbm5lY3Rpb24uc2V0TmV0d29ya1Byb3ZpZGVycyhXZWJTb2NrZXRQcm92aWRlciwgWEhSUHJvdmlkZXIpO1xufVxuXG4vLyBSRkMzMzM5IGZvcm1hdGVyIG9mIERhdGVcbmZ1bmN0aW9uIHJmYzMzMzlEYXRlU3RyaW5nKGQpIHtcbiAgaWYgKCFkIHx8IGQuZ2V0VGltZSgpID09IDApIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFkKHZhbCwgc3ApIHtcbiAgICBzcCA9IHNwIHx8IDI7XG4gICAgcmV0dXJuICcwJy5yZXBlYXQoc3AgLSAoJycgKyB2YWwpLmxlbmd0aCkgKyB2YWw7XG4gIH1cblxuICBjb25zdCBtaWxsaXMgPSBkLmdldFVUQ01pbGxpc2Vjb25kcygpO1xuICByZXR1cm4gZC5nZXRVVENGdWxsWWVhcigpICsgJy0nICsgcGFkKGQuZ2V0VVRDTW9udGgoKSArIDEpICsgJy0nICsgcGFkKGQuZ2V0VVRDRGF0ZSgpKSArXG4gICAgJ1QnICsgcGFkKGQuZ2V0VVRDSG91cnMoKSkgKyAnOicgKyBwYWQoZC5nZXRVVENNaW51dGVzKCkpICsgJzonICsgcGFkKGQuZ2V0VVRDU2Vjb25kcygpKSArXG4gICAgKG1pbGxpcyA/ICcuJyArIHBhZChtaWxsaXMsIDMpIDogJycpICsgJ1onO1xufVxuXG4vLyBidG9hIHJlcGxhY2VtZW50LiBTdG9jayBidG9hIGZhaWxzIG9uIG9uIG5vbi1MYXRpbjEgc3RyaW5ncy5cbmZ1bmN0aW9uIGI2NEVuY29kZVVuaWNvZGUoc3RyKSB7XG4gIC8vIFRoZSBlbmNvZGVVUklDb21wb25lbnQgcGVyY2VudC1lbmNvZGVzIFVURi04IHN0cmluZyxcbiAgLy8gdGhlbiB0aGUgcGVyY2VudCBlbmNvZGluZyBpcyBjb252ZXJ0ZWQgaW50byByYXcgYnl0ZXMgd2hpY2hcbiAgLy8gY2FuIGJlIGZlZCBpbnRvIGJ0b2EuXG4gIHJldHVybiBidG9hKGVuY29kZVVSSUNvbXBvbmVudChzdHIpLnJlcGxhY2UoLyUoWzAtOUEtRl17Mn0pL2csXG4gICAgZnVuY3Rpb24gdG9Tb2xpZEJ5dGVzKG1hdGNoLCBwMSkge1xuICAgICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoJzB4JyArIHAxKTtcbiAgICB9KSk7XG59XG5cbi8vIFJlY3Vyc2l2ZWx5IG1lcmdlIHNyYydzIG93biBwcm9wZXJ0aWVzIHRvIGRzdC5cbi8vIElnbm9yZSBwcm9wZXJ0aWVzIHdoZXJlIGlnbm9yZVtwcm9wZXJ0eV0gaXMgdHJ1ZS5cbi8vIEFycmF5IGFuZCBEYXRlIG9iamVjdHMgYXJlIHNoYWxsb3ctY29waWVkLlxuZnVuY3Rpb24gbWVyZ2VPYmooZHN0LCBzcmMsIGlnbm9yZSkge1xuICBpZiAodHlwZW9mIHNyYyAhPSAnb2JqZWN0Jykge1xuICAgIGlmIChzcmMgPT09IFRpbm9kZS5ERUxfQ0hBUikge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgaWYgKHNyYyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gZHN0O1xuICAgIH1cbiAgICByZXR1cm4gc3JjO1xuICB9XG4gIC8vIEpTIGlzIGNyYXp5OiB0eXBlb2YgbnVsbCBpcyAnb2JqZWN0Jy5cbiAgaWYgKHNyYyA9PT0gbnVsbCkge1xuICAgIHJldHVybiBzcmM7XG4gIH1cblxuICAvLyBIYW5kbGUgRGF0ZVxuICBpZiAoc3JjIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgIHJldHVybiAoIWRzdCB8fCAhKGRzdCBpbnN0YW5jZW9mIERhdGUpIHx8IGRzdCA8IHNyYykgPyBzcmMgOiBkc3Q7XG4gIH1cblxuICAvLyBBY2Nlc3MgbW9kZVxuICBpZiAoc3JjIGluc3RhbmNlb2YgQWNjZXNzTW9kZSkge1xuICAgIHJldHVybiBuZXcgQWNjZXNzTW9kZShzcmMpO1xuICB9XG5cbiAgLy8gSGFuZGxlIEFycmF5XG4gIGlmIChzcmMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgIHJldHVybiBzcmM7XG4gIH1cblxuICBpZiAoIWRzdCB8fCBkc3QgPT09IFRpbm9kZS5ERUxfQ0hBUikge1xuICAgIGRzdCA9IHNyYy5jb25zdHJ1Y3RvcigpO1xuICB9XG5cbiAgZm9yIChsZXQgcHJvcCBpbiBzcmMpIHtcbiAgICBpZiAoc3JjLmhhc093blByb3BlcnR5KHByb3ApICYmXG4gICAgICAoIWlnbm9yZSB8fCAhaWdub3JlW3Byb3BdKSAmJlxuICAgICAgKHByb3AgIT0gJ19ub0ZvcndhcmRpbmcnKSkge1xuXG4gICAgICBkc3RbcHJvcF0gPSBtZXJnZU9iaihkc3RbcHJvcF0sIHNyY1twcm9wXSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBkc3Q7XG59XG5cbi8vIFVwZGF0ZSBvYmplY3Qgc3RvcmVkIGluIGEgY2FjaGUuIFJldHVybnMgdXBkYXRlZCB2YWx1ZS5cbmZ1bmN0aW9uIG1lcmdlVG9DYWNoZShjYWNoZSwga2V5LCBuZXd2YWwsIGlnbm9yZSkge1xuICBjYWNoZVtrZXldID0gbWVyZ2VPYmooY2FjaGVba2V5XSwgbmV3dmFsLCBpZ25vcmUpO1xuICByZXR1cm4gY2FjaGVba2V5XTtcbn1cblxuZnVuY3Rpb24gc3RyaW5nVG9EYXRlKG9iaikge1xuICBpZiAodHlwZW9mIG9iai5jcmVhdGVkID09ICdzdHJpbmcnKSB7XG4gICAgb2JqLmNyZWF0ZWQgPSBuZXcgRGF0ZShvYmouY3JlYXRlZCk7XG4gIH1cbiAgaWYgKHR5cGVvZiBvYmoudXBkYXRlZCA9PSAnc3RyaW5nJykge1xuICAgIG9iai51cGRhdGVkID0gbmV3IERhdGUob2JqLnVwZGF0ZWQpO1xuICB9XG4gIGlmICh0eXBlb2Ygb2JqLnRvdWNoZWQgPT0gJ3N0cmluZycpIHtcbiAgICBvYmoudG91Y2hlZCA9IG5ldyBEYXRlKG9iai50b3VjaGVkKTtcbiAgfVxufVxuXG4vLyBKU09OIHN0cmluZ2lmeSBoZWxwZXIgLSBwcmUtcHJvY2Vzc29yIGZvciBKU09OLnN0cmluZ2lmeVxuZnVuY3Rpb24ganNvbkJ1aWxkSGVscGVyKGtleSwgdmFsKSB7XG4gIGlmICh2YWwgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgLy8gQ29udmVydCBqYXZhc2NyaXB0IERhdGUgb2JqZWN0cyB0byByZmMzMzM5IHN0cmluZ3NcbiAgICB2YWwgPSByZmMzMzM5RGF0ZVN0cmluZyh2YWwpO1xuICB9IGVsc2UgaWYgKHZhbCBpbnN0YW5jZW9mIEFjY2Vzc01vZGUpIHtcbiAgICB2YWwgPSB2YWwuanNvbkhlbHBlcigpO1xuICB9IGVsc2UgaWYgKHZhbCA9PT0gdW5kZWZpbmVkIHx8IHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IGZhbHNlIHx8XG4gICAgKEFycmF5LmlzQXJyYXkodmFsKSAmJiB2YWwubGVuZ3RoID09IDApIHx8XG4gICAgKCh0eXBlb2YgdmFsID09ICdvYmplY3QnKSAmJiAoT2JqZWN0LmtleXModmFsKS5sZW5ndGggPT0gMCkpKSB7XG4gICAgLy8gc3RyaXAgb3V0IGVtcHR5IGVsZW1lbnRzIHdoaWxlIHNlcmlhbGl6aW5nIG9iamVjdHMgdG8gSlNPTlxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICByZXR1cm4gdmFsO1xufTtcblxuLy8gU3RyaXBzIGFsbCB2YWx1ZXMgZnJvbSBhbiBvYmplY3Qgb2YgdGhleSBldmFsdWF0ZSB0byBmYWxzZSBvciBpZiB0aGVpciBuYW1lIHN0YXJ0cyB3aXRoICdfJy5cbmZ1bmN0aW9uIHNpbXBsaWZ5KG9iaikge1xuICBPYmplY3Qua2V5cyhvYmopLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgaWYgKGtleVswXSA9PSAnXycpIHtcbiAgICAgIC8vIFN0cmlwIGZpZWxkcyBsaWtlIFwib2JqLl9rZXlcIi5cbiAgICAgIGRlbGV0ZSBvYmpba2V5XTtcbiAgICB9IGVsc2UgaWYgKCFvYmpba2V5XSkge1xuICAgICAgLy8gU3RyaXAgZmllbGRzIHdoaWNoIGV2YWx1YXRlIHRvIGZhbHNlLlxuICAgICAgZGVsZXRlIG9ialtrZXldO1xuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShvYmpba2V5XSkgJiYgb2JqW2tleV0ubGVuZ3RoID09IDApIHtcbiAgICAgIC8vIFN0cmlwIGVtcHR5IGFycmF5cy5cbiAgICAgIGRlbGV0ZSBvYmpba2V5XTtcbiAgICB9IGVsc2UgaWYgKCFvYmpba2V5XSkge1xuICAgICAgLy8gU3RyaXAgZmllbGRzIHdoaWNoIGV2YWx1YXRlIHRvIGZhbHNlLlxuICAgICAgZGVsZXRlIG9ialtrZXldO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG9ialtrZXldID09ICdvYmplY3QnICYmICEob2JqW2tleV0gaW5zdGFuY2VvZiBEYXRlKSkge1xuICAgICAgc2ltcGxpZnkob2JqW2tleV0pO1xuICAgICAgLy8gU3RyaXAgZW1wdHkgb2JqZWN0cy5cbiAgICAgIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvYmpba2V5XSkubGVuZ3RoID09IDApIHtcbiAgICAgICAgZGVsZXRlIG9ialtrZXldO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvYmo7XG59O1xuXG4vLyBUcmltIHdoaXRlc3BhY2UsIHN0cmlwIGVtcHR5IGFuZCBkdXBsaWNhdGUgZWxlbWVudHMgZWxlbWVudHMuXG4vLyBJZiB0aGUgcmVzdWx0IGlzIGFuIGVtcHR5IGFycmF5LCBhZGQgYSBzaW5nbGUgZWxlbWVudCBcIlxcdTI0MjFcIiAoVW5pY29kZSBEZWwgY2hhcmFjdGVyKS5cbmZ1bmN0aW9uIG5vcm1hbGl6ZUFycmF5KGFycikge1xuICBsZXQgb3V0ID0gW107XG4gIGlmIChBcnJheS5pc0FycmF5KGFycikpIHtcbiAgICAvLyBUcmltLCB0aHJvdyBhd2F5IHZlcnkgc2hvcnQgYW5kIGVtcHR5IHRhZ3MuXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSBhcnIubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBsZXQgdCA9IGFycltpXTtcbiAgICAgIGlmICh0KSB7XG4gICAgICAgIHQgPSB0LnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBpZiAodC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgb3V0LnB1c2godCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgb3V0LnNvcnQoKS5maWx0ZXIoZnVuY3Rpb24oaXRlbSwgcG9zLCBhcnkpIHtcbiAgICAgIHJldHVybiAhcG9zIHx8IGl0ZW0gIT0gYXJ5W3BvcyAtIDFdO1xuICAgIH0pO1xuICB9XG4gIGlmIChvdXQubGVuZ3RoID09IDApIHtcbiAgICAvLyBBZGQgc2luZ2xlIHRhZyB3aXRoIGEgVW5pY29kZSBEZWwgY2hhcmFjdGVyLCBvdGhlcndpc2UgYW4gYW1wdHkgYXJyYXlcbiAgICAvLyBpcyBhbWJpZ3Vvcy4gVGhlIERlbCB0YWcgd2lsbCBiZSBzdHJpcHBlZCBieSB0aGUgc2VydmVyLlxuICAgIG91dC5wdXNoKFRpbm9kZS5ERUxfQ0hBUik7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuLy8gQXR0ZW1wdCB0byBjb252ZXJ0IGRhdGUgc3RyaW5ncyB0byBvYmplY3RzLlxuZnVuY3Rpb24ganNvblBhcnNlSGVscGVyKGtleSwgdmFsKSB7XG4gIC8vIENvbnZlcnQgc3RyaW5nIHRpbWVzdGFtcHMgd2l0aCBvcHRpb25hbCBtaWxsaXNlY29uZHMgdG8gRGF0ZVxuICAvLyAyMDE1LTA5LTAyVDAxOjQ1OjQzWy4xMjNdWlxuICBpZiAoa2V5ID09PSAndHMnICYmIHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnICYmXG4gICAgdmFsLmxlbmd0aCA+PSAyMCAmJiB2YWwubGVuZ3RoIDw9IDI0KSB7XG4gICAgbGV0IGRhdGUgPSBuZXcgRGF0ZSh2YWwpO1xuICAgIGlmIChkYXRlKSB7XG4gICAgICByZXR1cm4gZGF0ZTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoa2V5ID09PSAnYWNzJyAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBuZXcgQWNjZXNzTW9kZSh2YWwpO1xuICB9XG4gIHJldHVybiB2YWw7XG59O1xuXG4vLyBUcmltcyB2ZXJ5IGxvbmcgc3RyaW5ncyAoZW5jb2RlZCBpbWFnZXMpIHRvIG1ha2UgbG9nZ2VkIHBhY2tldHMgbW9yZSByZWFkYWJsZS5cbmZ1bmN0aW9uIGpzb25Mb2dnZXJIZWxwZXIoa2V5LCB2YWwpIHtcbiAgaWYgKHR5cGVvZiB2YWwgPT0gJ3N0cmluZycgJiYgdmFsLmxlbmd0aCA+IDEyOCkge1xuICAgIHJldHVybiAnPCcgKyB2YWwubGVuZ3RoICsgJywgYnl0ZXM6ICcgKyB2YWwuc3Vic3RyaW5nKDAsIDEyKSArICcuLi4nICsgdmFsLnN1YnN0cmluZyh2YWwubGVuZ3RoIC0gMTIpICsgJz4nO1xuICB9XG4gIHJldHVybiBqc29uQnVpbGRIZWxwZXIoa2V5LCB2YWwpO1xufTtcblxuLy8gUGFyc2UgYnJvd3NlciB1c2VyIGFnZW50IHRvIGV4dHJhY3QgYnJvd3NlciBuYW1lIGFuZCB2ZXJzaW9uLlxuZnVuY3Rpb24gZ2V0QnJvd3NlckluZm8odWEsIHByb2R1Y3QpIHtcbiAgdWEgPSB1YSB8fCAnJztcbiAgbGV0IHJlYWN0bmF0aXZlID0gJyc7XG4gIC8vIENoZWNrIGlmIHRoaXMgaXMgYSBSZWFjdE5hdGl2ZSBhcHAuXG4gIGlmICgvcmVhY3RuYXRpdmUvaS50ZXN0KHByb2R1Y3QpKSB7XG4gICAgcmVhY3RuYXRpdmUgPSAnUmVhY3ROYXRpdmU7ICc7XG4gIH1cbiAgLy8gVGhlbiB0ZXN0IGZvciBXZWJLaXQgYmFzZWQgYnJvd3Nlci5cbiAgdWEgPSB1YS5yZXBsYWNlKCcgKEtIVE1MLCBsaWtlIEdlY2tvKScsICcnKTtcbiAgbGV0IG0gPSB1YS5tYXRjaCgvKEFwcGxlV2ViS2l0XFwvWy5cXGRdKykvaSk7XG4gIGxldCByZXN1bHQ7XG4gIGlmIChtKSB7XG4gICAgLy8gTGlzdCBvZiBjb21tb24gc3RyaW5ncywgZnJvbSBtb3JlIHVzZWZ1bCB0byBsZXNzIHVzZWZ1bC5cbiAgICBsZXQgcHJpb3JpdHkgPSBbJ2Nocm9tZScsICdzYWZhcmknLCAnbW9iaWxlJywgJ3ZlcnNpb24nXTtcbiAgICBsZXQgdG1wID0gdWEuc3Vic3RyKG0uaW5kZXggKyBtWzBdLmxlbmd0aCkuc3BsaXQoJyAnKTtcbiAgICBsZXQgdG9rZW5zID0gW107XG4gICAgLy8gU3BsaXQgTmFtZS8wLjAuMCBpbnRvIE5hbWUgYW5kIHZlcnNpb24gMC4wLjBcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRtcC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IG0yID0gLyhbXFx3Ll0rKVtcXC9dKFtcXC5cXGRdKykvLmV4ZWModG1wW2ldKTtcbiAgICAgIGlmIChtMikge1xuICAgICAgICB0b2tlbnMucHVzaChbbTJbMV0sIG0yWzJdLCBwcmlvcml0eS5maW5kSW5kZXgoZnVuY3Rpb24oZSkge1xuICAgICAgICAgIHJldHVybiAoZSA9PSBtMlsxXS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgfSldKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gU29ydCBieSBwcmlvcml0eTogbW9yZSBpbnRlcmVzdGluZyBpcyBlYXJsaWVyIHRoYW4gbGVzcyBpbnRlcmVzdGluZy5cbiAgICB0b2tlbnMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICBsZXQgZGlmZiA9IGFbMl0gLSBiWzJdO1xuICAgICAgcmV0dXJuIGRpZmYgIT0gMCA/IGRpZmYgOiBiWzBdLmxlbmd0aCAtIGFbMF0ubGVuZ3RoO1xuICAgIH0pO1xuICAgIGlmICh0b2tlbnMubGVuZ3RoID4gMCkge1xuICAgICAgLy8gUmV0dXJuIHRoZSBsZWFzdCBjb21tb24gYnJvd3NlciBzdHJpbmcgYW5kIHZlcnNpb24uXG4gICAgICByZXN1bHQgPSB0b2tlbnNbMF1bMF0gKyAnLycgKyB0b2tlbnNbMF1bMV07XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEZhaWxlZCB0byBJRCB0aGUgYnJvd3Nlci4gUmV0dXJuIHRoZSB3ZWJraXQgdmVyc2lvbi5cbiAgICAgIHJlc3VsdCA9IG1bMV07XG4gICAgfVxuICAgIC8vIFRlc3QgZm9yIE1TSUUuXG4gIH0gZWxzZSBpZiAoL3RyaWRlbnQvaS50ZXN0KHVhKSkge1xuICAgIG0gPSAvKD86XFxicnZbIDpdKyhbLlxcZF0rKSl8KD86XFxiTVNJRSAoWy5cXGRdKykpL2cuZXhlYyh1YSk7XG4gICAgaWYgKG0pIHtcbiAgICAgIHJlc3VsdCA9ICdNU0lFLycgKyAobVsxXSB8fCBtWzJdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0ID0gJ01TSUUvPyc7XG4gICAgfVxuICAgIC8vIFRlc3QgZm9yIEZpcmVmb3guXG4gIH0gZWxzZSBpZiAoL2ZpcmVmb3gvaS50ZXN0KHVhKSkge1xuICAgIG0gPSAvRmlyZWZveFxcLyhbLlxcZF0rKS9nLmV4ZWModWEpO1xuICAgIGlmIChtKSB7XG4gICAgICByZXN1bHQgPSAnRmlyZWZveC8nICsgbVsxXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0ID0gJ0ZpcmVmb3gvPyc7XG4gICAgfVxuICAgIC8vIE9sZGVyIE9wZXJhLlxuICB9IGVsc2UgaWYgKC9wcmVzdG8vaS50ZXN0KHVhKSkge1xuICAgIG0gPSAvT3BlcmFcXC8oWy5cXGRdKykvZy5leGVjKHVhKTtcbiAgICBpZiAobSkge1xuICAgICAgcmVzdWx0ID0gJ09wZXJhLycgKyBtWzFdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQgPSAnT3BlcmEvPyc7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIEZhaWxlZCB0byBwYXJzZSBhbnl0aGluZyBtZWFuaW5nZnVsbC4gVHJ5IHRoZSBsYXN0IHJlc29ydC5cbiAgICBtID0gLyhbXFx3Ll0rKVxcLyhbLlxcZF0rKS8uZXhlYyh1YSk7XG4gICAgaWYgKG0pIHtcbiAgICAgIHJlc3VsdCA9IG1bMV0gKyAnLycgKyBtWzJdO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gdWEuc3BsaXQoJyAnKTtcbiAgICAgIHJlc3VsdCA9IG1bMF07XG4gICAgfVxuICB9XG5cbiAgLy8gU2hvcnRlbiB0aGUgdmVyc2lvbiB0byBvbmUgZG90ICdhLmJiLmNjYy5kIC0+IGEuYmInIGF0IG1vc3QuXG4gIG0gPSByZXN1bHQuc3BsaXQoJy8nKTtcbiAgaWYgKG0ubGVuZ3RoID4gMSkge1xuICAgIGxldCB2ID0gbVsxXS5zcGxpdCgnLicpO1xuICAgIHJlc3VsdCA9IG1bMF0gKyAnLycgKyB2WzBdICsgKHZbMV0gPyAnLicgKyB2WzFdIDogJycpO1xuICB9XG4gIHJldHVybiByZWFjdG5hdGl2ZSArIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBAY2xhc3MgVGlub2RlXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyAtIGNvbmZpZ3VyYXRpb24gcGFyYW1ldGVycy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBjb25maWcuYXBwTmFtZSAtIE5hbWUgb2YgdGhlIGNhbGxpbmcgYXBwbGljYXRpb24gdG8gYmUgcmVwb3J0ZWQgaW4gdGhlIFVzZXIgQWdlbnQuXG4gKiBAcGFyYW0ge3N0cmluZ30gY29uZmlnLmhvc3QgLSBIb3N0IG5hbWUgYW5kIHBvcnQgbnVtYmVyIHRvIGNvbm5lY3QgdG8uXG4gKiBAcGFyYW0ge3N0cmluZ30gY29uZmlnLmFwaUtleSAtIEFQSSBrZXkgZ2VuZXJhdGVkIGJ5IDxjb2RlPmtleWdlbjwvY29kZT4uXG4gKiBAcGFyYW0ge3N0cmluZ30gY29uZmlnLnRyYW5zcG9ydCAtIFNlZSB7QGxpbmsgVGlub2RlLkNvbm5lY3Rpb24jdHJhbnNwb3J0fS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gY29uZmlnLnNlY3VyZSAtIFVzZSBTZWN1cmUgV2ViU29ja2V0IGlmIDxjb2RlPnRydWU8L2NvZGU+LlxuICogQHBhcmFtIHtzdHJpbmd9IGNvbmZpZy5wbGF0Zm9ybSAtIE9wdGlvbmFsIHBsYXRmb3JtIGlkZW50aWZpZXIsIG9uZSBvZiA8Y29kZT5cImlvc1wiPC9jb2RlPiwgPGNvZGU+XCJ3ZWJcIjwvY29kZT4sIDxjb2RlPlwiYW5kcm9pZFwiPC9jb2RlPi5cbiAqIEBwYXJhbSB7Ym9vbGVufSBjb25maWcucGVyc2lzdCAtIHVzZSBpbmRleERCIHBlcnNpc3RlbnQgc3RvcmFnZS5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IG9uQ29tcGxldGUgLSBjYWxsYmFjayB0byBjYWxsIHdoZW4gaW5pdGlhbGl6YXRpb24gaXMgY29tcGxldGVkLlxuICovXG52YXIgVGlub2RlID0gZnVuY3Rpb24oY29uZmlnLCBvbkNvbXBsZXRlKSB7XG4gIC8vIENsaWVudC1wcm92aWRlZCBhcHBsaWNhdGlvbiBuYW1lLCBmb3JtYXQgPE5hbWU+Lzx2ZXJzaW9uIG51bWJlcj5cbiAgdGhpcy5fYXBwTmFtZSA9IGNvbmZpZy5hcHBOYW1lIHx8IFwiVW5kZWZpbmVkXCI7XG5cbiAgLy8gQVBJIEtleS5cbiAgdGhpcy5fYXBpS2V5ID0gY29uZmlnLmFwaUtleTtcblxuICAvLyBOYW1lIGFuZCB2ZXJzaW9uIG9mIHRoZSBicm93c2VyLlxuICB0aGlzLl9icm93c2VyID0gJyc7XG4gIHRoaXMuX3BsYXRmb3JtID0gY29uZmlnLnBsYXRmb3JtIHx8ICd3ZWInO1xuICB0aGlzLl9od29zID0gJ3VuZGVmaW5lZCc7XG4gIHRoaXMuX2h1bWFuTGFuZ3VhZ2UgPSAneHgnO1xuICAvLyBVbmRlcmx5aW5nIE9TLlxuICBpZiAodHlwZW9mIG5hdmlnYXRvciAhPSAndW5kZWZpbmVkJykge1xuICAgIHRoaXMuX2Jyb3dzZXIgPSBnZXRCcm93c2VySW5mbyhuYXZpZ2F0b3IudXNlckFnZW50LCBuYXZpZ2F0b3IucHJvZHVjdCk7XG4gICAgdGhpcy5faHdvcyA9IG5hdmlnYXRvci5wbGF0Zm9ybTtcbiAgICAvLyBUaGlzIGlzIHRoZSBkZWZhdWx0IGxhbmd1YWdlLiBJdCBjb3VsZCBiZSBjaGFuZ2VkIGJ5IGNsaWVudC5cbiAgICB0aGlzLl9odW1hbkxhbmd1YWdlID0gbmF2aWdhdG9yLmxhbmd1YWdlIHx8ICdlbi1VUyc7XG4gIH1cbiAgLy8gTG9nZ2luZyB0byBjb25zb2xlIGVuYWJsZWRcbiAgdGhpcy5fbG9nZ2luZ0VuYWJsZWQgPSBmYWxzZTtcbiAgLy8gV2hlbiBsb2dnaW5nLCB0cmlwIGxvbmcgc3RyaW5ncyAoYmFzZTY0LWVuY29kZWQgaW1hZ2VzKSBmb3IgcmVhZGFiaWxpdHlcbiAgdGhpcy5fdHJpbUxvbmdTdHJpbmdzID0gZmFsc2U7XG4gIC8vIFVJRCBvZiB0aGUgY3VycmVudGx5IGF1dGhlbnRpY2F0ZWQgdXNlci5cbiAgdGhpcy5fbXlVSUQgPSBudWxsO1xuICAvLyBTdGF0dXMgb2YgY29ubmVjdGlvbjogYXV0aGVudGljYXRlZCBvciBub3QuXG4gIHRoaXMuX2F1dGhlbnRpY2F0ZWQgPSBmYWxzZTtcbiAgLy8gTG9naW4gdXNlZCBpbiB0aGUgbGFzdCBzdWNjZXNzZnVsIGJhc2ljIGF1dGhlbnRpY2F0aW9uXG4gIHRoaXMuX2xvZ2luID0gbnVsbDtcbiAgLy8gVG9rZW4gd2hpY2ggY2FuIGJlIHVzZWQgZm9yIGxvZ2luIGluc3RlYWQgb2YgbG9naW4vcGFzc3dvcmQuXG4gIHRoaXMuX2F1dGhUb2tlbiA9IG51bGw7XG4gIC8vIENvdW50ZXIgb2YgcmVjZWl2ZWQgcGFja2V0c1xuICB0aGlzLl9pblBhY2tldENvdW50ID0gMDtcbiAgLy8gQ291bnRlciBmb3IgZ2VuZXJhdGluZyB1bmlxdWUgbWVzc2FnZSBJRHNcbiAgdGhpcy5fbWVzc2FnZUlkID0gTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIDB4RkZGRikgKyAweEZGRkYpO1xuICAvLyBJbmZvcm1hdGlvbiBhYm91dCB0aGUgc2VydmVyLCBpZiBjb25uZWN0ZWRcbiAgdGhpcy5fc2VydmVySW5mbyA9IG51bGw7XG4gIC8vIFB1c2ggbm90aWZpY2F0aW9uIHRva2VuLiBDYWxsZWQgZGV2aWNlVG9rZW4gZm9yIGNvbnNpc3RlbmN5IHdpdGggdGhlIEFuZHJvaWQgU0RLLlxuICB0aGlzLl9kZXZpY2VUb2tlbiA9IG51bGw7XG5cbiAgLy8gQ2FjaGUgb2YgcGVuZGluZyBwcm9taXNlcyBieSBtZXNzYWdlIGlkLlxuICB0aGlzLl9wZW5kaW5nUHJvbWlzZXMgPSB7fTtcblxuICAvLyBUaGUgVGltZW91dCBvYmplY3QgcmV0dXJuZWQgYnkgdGhlIHJlamVjdCBleHBpcmVkIHByb21pc2VzIHNldEludGVydmFsLlxuICB0aGlzLl9leHBpcmVQcm9taXNlcyA9IG51bGw7XG5cbiAgLyoqIEEgY29ubmVjdGlvbiBvYmplY3QsIHNlZSB7QGxpbmsgVGlub2RlLkNvbm5lY3Rpb259LiAqL1xuICB0aGlzLl9jb25uZWN0aW9uID0gbmV3IENvbm5lY3Rpb24oY29uZmlnLmhvc3QsIFBST1RPQ09MX1ZFUlNJT04sIGNvbmZpZy5hcGlLZXksIGNvbmZpZy50cmFuc3BvcnQsIGNvbmZpZy5zZWN1cmUsIHRydWUpO1xuICAvLyBDb25zb2xlIGxvZ2dlci4gQmFiZWwgc29tZWhvdyBmYWlscyB0byBwYXJzZSAnLi4ucmVzdCcgcGFyYW1ldGVyLlxuICB0aGlzLmxvZ2dlciA9IChzdHIsIC4uLmFyZ3MpID0+IHtcbiAgICBpZiAodGhpcy5fbG9nZ2luZ0VuYWJsZWQpIHtcbiAgICAgIGNvbnN0IGQgPSBuZXcgRGF0ZSgpXG4gICAgICBjb25zdCBkYXRlU3RyaW5nID0gKCcwJyArIGQuZ2V0VVRDSG91cnMoKSkuc2xpY2UoLTIpICsgJzonICtcbiAgICAgICAgKCcwJyArIGQuZ2V0VVRDTWludXRlcygpKS5zbGljZSgtMikgKyAnOicgK1xuICAgICAgICAoJzAnICsgZC5nZXRVVENTZWNvbmRzKCkpLnNsaWNlKC0yKSArICcuJyArXG4gICAgICAgICgnMDAnICsgZC5nZXRVVENNaWxsaXNlY29uZHMoKSkuc2xpY2UoLTMpO1xuXG4gICAgICBjb25zb2xlLmxvZygnWycgKyBkYXRlU3RyaW5nICsgJ10nLCBzdHIsIGFyZ3Muam9pbignICcpKTtcbiAgICB9XG4gIH1cbiAgdGhpcy5fY29ubmVjdGlvbi5sb2dnZXIgPSB0aGlzLmxvZ2dlcjtcbiAgRHJhZnR5LmxvZ2dlciA9IHRoaXMubG9nZ2VyO1xuXG4gIC8vIFRpbWVzdGFtcCBvZiB0aGUgbW9zdCByZWNlbnQgdXBkYXRlIHRvIHRvcGljcyBpbiBjYWNoZS5cbiAgdGhpcy5fbGFzdFRvcGljVXBkYXRlID0gbnVsbDtcblxuICAvLyBUaW5vZGUncyBjYWNoZSBvZiBvYmplY3RzXG4gIHRoaXMuX2NhY2hlID0ge307XG5cbiAgY29uc3QgY2FjaGVQdXQgPSB0aGlzLmNhY2hlUHV0ID0gKHR5cGUsIG5hbWUsIG9iaikgPT4ge1xuICAgIHRoaXMuX2NhY2hlW3R5cGUgKyAnOicgKyBuYW1lXSA9IG9iajtcbiAgfVxuXG4gIGNvbnN0IGNhY2hlR2V0ID0gdGhpcy5jYWNoZUdldCA9ICh0eXBlLCBuYW1lKSA9PiB7XG4gICAgcmV0dXJuIHRoaXMuX2NhY2hlW3R5cGUgKyAnOicgKyBuYW1lXTtcbiAgfVxuXG4gIGNvbnN0IGNhY2hlRGVsID0gdGhpcy5jYWNoZURlbCA9ICh0eXBlLCBuYW1lKSA9PiB7XG4gICAgZGVsZXRlIHRoaXMuX2NhY2hlW3R5cGUgKyAnOicgKyBuYW1lXTtcbiAgfVxuICAvLyBFbnVtZXJhdGUgYWxsIGl0ZW1zIGluIGNhY2hlLCBjYWxsIGZ1bmMgZm9yIGVhY2ggaXRlbS5cbiAgLy8gRW51bWVyYXRpb24gc3RvcHMgaWYgZnVuYyByZXR1cm5zIHRydWUuXG4gIGNvbnN0IGNhY2hlTWFwID0gdGhpcy5jYWNoZU1hcCA9ICh0eXBlLCBmdW5jLCBjb250ZXh0KSA9PiB7XG4gICAgY29uc3Qga2V5ID0gdHlwZSA/IHR5cGUgKyAnOicgOiB1bmRlZmluZWQ7XG4gICAgZm9yIChsZXQgaWR4IGluIHRoaXMuX2NhY2hlKSB7XG4gICAgICBpZiAoIWtleSB8fCBpZHguaW5kZXhPZihrZXkpID09IDApIHtcbiAgICAgICAgaWYgKGZ1bmMuY2FsbChjb250ZXh0LCB0aGlzLl9jYWNoZVtpZHhdLCBpZHgpKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBNYWtlIGxpbWl0ZWQgY2FjaGUgbWFuYWdlbWVudCBhdmFpbGFibGUgdG8gdG9waWMuXG4gIC8vIENhY2hpbmcgdXNlci5wdWJsaWMgb25seS4gRXZlcnl0aGluZyBlbHNlIGlzIHBlci10b3BpYy5cbiAgdGhpcy5hdHRhY2hDYWNoZVRvVG9waWMgPSAodG9waWMpID0+IHtcbiAgICB0b3BpYy5fdGlub2RlID0gdGhpcztcblxuICAgIHRvcGljLl9jYWNoZUdldFVzZXIgPSAodWlkKSA9PiB7XG4gICAgICBjb25zdCBwdWIgPSBjYWNoZUdldCgndXNlcicsIHVpZCk7XG4gICAgICBpZiAocHViKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdXNlcjogdWlkLFxuICAgICAgICAgIHB1YmxpYzogbWVyZ2VPYmooe30sIHB1YilcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfTtcbiAgICB0b3BpYy5fY2FjaGVQdXRVc2VyID0gKHVpZCwgdXNlcikgPT4ge1xuICAgICAgcmV0dXJuIGNhY2hlUHV0KCd1c2VyJywgdWlkLCBtZXJnZU9iaih7fSwgdXNlci5wdWJsaWMpKTtcbiAgICB9O1xuICAgIHRvcGljLl9jYWNoZURlbFVzZXIgPSAodWlkKSA9PiB7XG4gICAgICByZXR1cm4gY2FjaGVEZWwoJ3VzZXInLCB1aWQpO1xuICAgIH07XG4gICAgdG9waWMuX2NhY2hlUHV0U2VsZiA9ICgpID0+IHtcbiAgICAgIGlmICh0b3BpYy51cGRhdGVkICYmIHRvcGljLnVwZGF0ZWQgPiB0aGlzLl9sYXN0VG9waWNVcGRhdGUpIHtcbiAgICAgICAgdGhpcy5fbGFzdFRvcGljVXBkYXRlID0gdG9waWMudXBkYXRlZDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjYWNoZVB1dCgndG9waWMnLCB0b3BpYy5uYW1lLCB0b3BpYyk7XG4gICAgfVxuICAgIHRvcGljLl9jYWNoZURlbFNlbGYgPSAoKSA9PiB7XG4gICAgICByZXR1cm4gY2FjaGVEZWwoJ3RvcGljJywgdG9waWMubmFtZSk7XG4gICAgfVxuICB9XG5cbiAgLy8gVXNlIGluZGV4REIgZm9yIGNhY2hpbmcgdG9waWNzIGFuZCBtZXNzYWdlcy5cbiAgdGhpcy5fcGVyc2lzdCA9IGNvbmZpZy5wZXJzaXN0O1xuICAvLyBJbml0aWFsaXplIG9iamVjdCByZWdhcmRsZXNzLiBJdCBzaW1wbGlmaWVzIHRoZSBjb2RlLlxuICB0aGlzLl9kYiA9IERCQ2FjaGUoKGVycikgPT4ge1xuICAgIHRoaXMubG9nZ2VyKFwiREJcIiwgZXJyKTtcbiAgfSwgdGhpcy5sb2dnZXIpO1xuXG4gIGlmICh0aGlzLl9wZXJzaXN0KSB7XG4gICAgLy8gQ3JlYXRlIHRoZSBwZXJzaXN0ZW50IGNhY2hlIGFuZCByZWFkIHRvcGljcyBpbnRvIG1lbW9yeS5cbiAgICB0aGlzLl9kYi5pbml0RGF0YWJhc2UoKS50aGVuKCgpID0+IHtcbiAgICAgIC8vIFN0b3JlIHByb21pc2VzIHRvIGJlIHJlc29sdmVkIHdoZW4gbWVzc2FnZXMgbG9hZCBpbnRvIG1lbW9yeS5cbiAgICAgIGNvbnN0IG1zZ3MgPSBbXTtcbiAgICAgIC8vIExvYWQgdG9waWNzIHRvIG1lbW9yeS5cbiAgICAgIHJldHVybiB0aGlzLl9kYi5tYXBUb3BpY3MoKGRhdGEpID0+IHtcbiAgICAgICAgbGV0IHRvcGljID0gdGhpcy5jYWNoZUdldCgndG9waWMnLCBkYXRhLm5hbWUpO1xuICAgICAgICBpZiAodG9waWMpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRhdGEubmFtZSA9PSBUT1BJQ19NRSkge1xuICAgICAgICAgIHRvcGljID0gbmV3IFRvcGljTWUoKTtcbiAgICAgICAgfSBlbHNlIGlmIChkYXRhLm5hbWUgPT0gVE9QSUNfRk5EKSB7XG4gICAgICAgICAgdG9waWMgPSBuZXcgVG9waWNGbmQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0b3BpYyA9IG5ldyBUb3BpYyhkYXRhLm5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fZGIuZGVzZXJpYWxpemVUb3BpYyh0b3BpYywgZGF0YSk7XG4gICAgICAgIHRoaXMuYXR0YWNoQ2FjaGVUb1RvcGljKHRvcGljKTtcbiAgICAgICAgdG9waWMuX2NhY2hlUHV0U2VsZigpO1xuICAgICAgICAvLyBSZXF1ZXN0IHRvIGxvYWQgbWVzc2FnZXMgYW5kIHNhdmUgdGhlIHByb21pc2UuXG4gICAgICAgIG1zZ3MucHVzaCh0b3BpYy5fbG9hZE1lc3NhZ2VzKHRoaXMuX2RiKSk7XG4gICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgLy8gV2FpdCBmb3IgYWxsIG1lc3NhZ2VzIHRvIGxvYWQuXG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChtc2dzKTtcbiAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICBpZiAob25Db21wbGV0ZSkge1xuICAgICAgICAgIG9uQ29tcGxldGUoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxvZ2dlcihcIlBlcnNpc3RlbnQgY2FjaGUgaW5pdGlhbGl6ZWQuXCIpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5fZGIuZGlzYWJsZSgpO1xuICAgIGlmIChvbkNvbXBsZXRlKSB7XG4gICAgICBvbkNvbXBsZXRlKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gUmVzb2x2ZSBvciByZWplY3QgYSBwZW5kaW5nIHByb21pc2UuXG4gIC8vIFVucmVzb2x2ZWQgcHJvbWlzZXMgYXJlIHN0b3JlZCBpbiBfcGVuZGluZ1Byb21pc2VzLlxuICBjb25zdCBleGVjUHJvbWlzZSA9IChpZCwgY29kZSwgb25PSywgZXJyb3JUZXh0KSA9PiB7XG4gICAgY29uc3QgY2FsbGJhY2tzID0gdGhpcy5fcGVuZGluZ1Byb21pc2VzW2lkXTtcbiAgICBpZiAoY2FsbGJhY2tzKSB7XG4gICAgICBkZWxldGUgdGhpcy5fcGVuZGluZ1Byb21pc2VzW2lkXTtcbiAgICAgIGlmIChjb2RlID49IDIwMCAmJiBjb2RlIDwgNDAwKSB7XG4gICAgICAgIGlmIChjYWxsYmFja3MucmVzb2x2ZSkge1xuICAgICAgICAgIGNhbGxiYWNrcy5yZXNvbHZlKG9uT0spO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGNhbGxiYWNrcy5yZWplY3QpIHtcbiAgICAgICAgY2FsbGJhY2tzLnJlamVjdChuZXcgRXJyb3IoYCR7ZXJyb3JUZXh0fSAoJHtjb2RlfSlgKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gR2VuZXJhdG9yIG9mIGRlZmF1bHQgcHJvbWlzZXMgZm9yIHNlbnQgcGFja2V0cy5cbiAgY29uc3QgbWFrZVByb21pc2UgPSAoaWQpID0+IHtcbiAgICBsZXQgcHJvbWlzZSA9IG51bGw7XG4gICAgaWYgKGlkKSB7XG4gICAgICBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAvLyBTdG9yZWQgY2FsbGJhY2tzIHdpbGwgYmUgY2FsbGVkIHdoZW4gdGhlIHJlc3BvbnNlIHBhY2tldCB3aXRoIHRoaXMgSWQgYXJyaXZlc1xuICAgICAgICB0aGlzLl9wZW5kaW5nUHJvbWlzZXNbaWRdID0ge1xuICAgICAgICAgICdyZXNvbHZlJzogcmVzb2x2ZSxcbiAgICAgICAgICAncmVqZWN0JzogcmVqZWN0LFxuICAgICAgICAgICd0cyc6IG5ldyBEYXRlKClcbiAgICAgICAgfTtcbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgLy8gR2VuZXJhdGVzIHVuaXF1ZSBtZXNzYWdlIElEc1xuICBjb25zdCBnZXROZXh0VW5pcXVlSWQgPSB0aGlzLmdldE5leHRVbmlxdWVJZCA9ICgpID0+IHtcbiAgICByZXR1cm4gKHRoaXMuX21lc3NhZ2VJZCAhPSAwKSA/ICcnICsgdGhpcy5fbWVzc2FnZUlkKysgOiB1bmRlZmluZWQ7XG4gIH1cblxuICAvLyBHZXQgVXNlciBBZ2VudCBzdHJpbmdcbiAgY29uc3QgZ2V0VXNlckFnZW50ID0gKCkgPT4ge1xuICAgIHJldHVybiB0aGlzLl9hcHBOYW1lICsgJyAoJyArICh0aGlzLl9icm93c2VyID8gdGhpcy5fYnJvd3NlciArICc7ICcgOiAnJykgKyB0aGlzLl9od29zICsgJyk7ICcgKyBMSUJSQVJZO1xuICB9XG5cbiAgLy8gR2VuZXJhdG9yIG9mIHBhY2tldHMgc3R1YnNcbiAgdGhpcy5pbml0UGFja2V0ID0gKHR5cGUsIHRvcGljKSA9PiB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlICdoaSc6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ2hpJzoge1xuICAgICAgICAgICAgJ2lkJzogZ2V0TmV4dFVuaXF1ZUlkKCksXG4gICAgICAgICAgICAndmVyJzogVkVSU0lPTixcbiAgICAgICAgICAgICd1YSc6IGdldFVzZXJBZ2VudCgpLFxuICAgICAgICAgICAgJ2Rldic6IHRoaXMuX2RldmljZVRva2VuLFxuICAgICAgICAgICAgJ2xhbmcnOiB0aGlzLl9odW1hbkxhbmd1YWdlLFxuICAgICAgICAgICAgJ3BsYXRmJzogdGhpcy5fcGxhdGZvcm1cbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgIGNhc2UgJ2FjYyc6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ2FjYyc6IHtcbiAgICAgICAgICAgICdpZCc6IGdldE5leHRVbmlxdWVJZCgpLFxuICAgICAgICAgICAgJ3VzZXInOiBudWxsLFxuICAgICAgICAgICAgJ3NjaGVtZSc6IG51bGwsXG4gICAgICAgICAgICAnc2VjcmV0JzogbnVsbCxcbiAgICAgICAgICAgICdsb2dpbic6IGZhbHNlLFxuICAgICAgICAgICAgJ3RhZ3MnOiBudWxsLFxuICAgICAgICAgICAgJ2Rlc2MnOiB7fSxcbiAgICAgICAgICAgICdjcmVkJzoge31cbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgIGNhc2UgJ2xvZ2luJzpcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAnbG9naW4nOiB7XG4gICAgICAgICAgICAnaWQnOiBnZXROZXh0VW5pcXVlSWQoKSxcbiAgICAgICAgICAgICdzY2hlbWUnOiBudWxsLFxuICAgICAgICAgICAgJ3NlY3JldCc6IG51bGxcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgIGNhc2UgJ3N1Yic6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ3N1Yic6IHtcbiAgICAgICAgICAgICdpZCc6IGdldE5leHRVbmlxdWVJZCgpLFxuICAgICAgICAgICAgJ3RvcGljJzogdG9waWMsXG4gICAgICAgICAgICAnc2V0Jzoge30sXG4gICAgICAgICAgICAnZ2V0Jzoge31cbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgIGNhc2UgJ2xlYXZlJzpcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAnbGVhdmUnOiB7XG4gICAgICAgICAgICAnaWQnOiBnZXROZXh0VW5pcXVlSWQoKSxcbiAgICAgICAgICAgICd0b3BpYyc6IHRvcGljLFxuICAgICAgICAgICAgJ3Vuc3ViJzogZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgIGNhc2UgJ3B1Yic6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ3B1Yic6IHtcbiAgICAgICAgICAgICdpZCc6IGdldE5leHRVbmlxdWVJZCgpLFxuICAgICAgICAgICAgJ3RvcGljJzogdG9waWMsXG4gICAgICAgICAgICAnbm9lY2hvJzogZmFsc2UsXG4gICAgICAgICAgICAnaGVhZCc6IG51bGwsXG4gICAgICAgICAgICAnY29udGVudCc6IHt9XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICBjYXNlICdnZXQnOlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICdnZXQnOiB7XG4gICAgICAgICAgICAnaWQnOiBnZXROZXh0VW5pcXVlSWQoKSxcbiAgICAgICAgICAgICd0b3BpYyc6IHRvcGljLFxuICAgICAgICAgICAgJ3doYXQnOiBudWxsLCAvLyBkYXRhLCBzdWIsIGRlc2MsIHNwYWNlIHNlcGFyYXRlZCBsaXN0OyB1bmtub3duIHN0cmluZ3MgYXJlIGlnbm9yZWRcbiAgICAgICAgICAgICdkZXNjJzoge30sXG4gICAgICAgICAgICAnc3ViJzoge30sXG4gICAgICAgICAgICAnZGF0YSc6IHt9XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICBjYXNlICdzZXQnOlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICdzZXQnOiB7XG4gICAgICAgICAgICAnaWQnOiBnZXROZXh0VW5pcXVlSWQoKSxcbiAgICAgICAgICAgICd0b3BpYyc6IHRvcGljLFxuICAgICAgICAgICAgJ2Rlc2MnOiB7fSxcbiAgICAgICAgICAgICdzdWInOiB7fSxcbiAgICAgICAgICAgICd0YWdzJzogW11cbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgIGNhc2UgJ2RlbCc6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ2RlbCc6IHtcbiAgICAgICAgICAgICdpZCc6IGdldE5leHRVbmlxdWVJZCgpLFxuICAgICAgICAgICAgJ3RvcGljJzogdG9waWMsXG4gICAgICAgICAgICAnd2hhdCc6IG51bGwsXG4gICAgICAgICAgICAnZGVsc2VxJzogbnVsbCxcbiAgICAgICAgICAgICd1c2VyJzogbnVsbCxcbiAgICAgICAgICAgICdoYXJkJzogZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgIGNhc2UgJ25vdGUnOlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICdub3RlJzoge1xuICAgICAgICAgICAgLy8gbm8gaWQgYnkgZGVzaWduXG4gICAgICAgICAgICAndG9waWMnOiB0b3BpYyxcbiAgICAgICAgICAgICd3aGF0JzogbnVsbCwgLy8gb25lIG9mIFwicmVjdlwiLCBcInJlYWRcIiwgXCJrcFwiXG4gICAgICAgICAgICAnc2VxJzogdW5kZWZpbmVkIC8vIHRoZSBzZXJ2ZXItc2lkZSBtZXNzYWdlIGlkIGFrbm93bGVkZ2VkIGFzIHJlY2VpdmVkIG9yIHJlYWRcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5rbm93biBwYWNrZXQgdHlwZSByZXF1ZXN0ZWQ6ICR7dHlwZX1gKTtcbiAgICB9XG4gIH1cblxuICAvLyBTZW5kIGEgcGFja2V0LiBJZiBwYWNrZXQgaWQgaXMgcHJvdmlkZWQgcmV0dXJuIGEgcHJvbWlzZS5cbiAgdGhpcy5zZW5kID0gKHBrdCwgaWQpID0+IHtcbiAgICBsZXQgcHJvbWlzZTtcbiAgICBpZiAoaWQpIHtcbiAgICAgIHByb21pc2UgPSBtYWtlUHJvbWlzZShpZCk7XG4gICAgfVxuICAgIHBrdCA9IHNpbXBsaWZ5KHBrdCk7XG4gICAgbGV0IG1zZyA9IEpTT04uc3RyaW5naWZ5KHBrdCk7XG4gICAgdGhpcy5sb2dnZXIoXCJvdXQ6IFwiICsgKHRoaXMuX3RyaW1Mb25nU3RyaW5ncyA/IEpTT04uc3RyaW5naWZ5KHBrdCwganNvbkxvZ2dlckhlbHBlcikgOiBtc2cpKTtcbiAgICB0cnkge1xuICAgICAgdGhpcy5fY29ubmVjdGlvbi5zZW5kVGV4dChtc2cpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgLy8gSWYgc2VuZFRleHQgdGhyb3dzLCB3cmFwIHRoZSBlcnJvciBpbiBhIHByb21pc2Ugb3IgcmV0aHJvdy5cbiAgICAgIGlmIChpZCkge1xuICAgICAgICBleGVjUHJvbWlzZShpZCwgQ29ubmVjdGlvbi5ORVRXT1JLX0VSUk9SLCBudWxsLCBlcnIubWVzc2FnZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgLy8gT24gc3VjY2Vzc2Z1bCBsb2dpbiBzYXZlIHNlcnZlci1wcm92aWRlZCBkYXRhLlxuICB0aGlzLmxvZ2luU3VjY2Vzc2Z1bCA9IChjdHJsKSA9PiB7XG4gICAgaWYgKCFjdHJsLnBhcmFtcyB8fCAhY3RybC5wYXJhbXMudXNlcikge1xuICAgICAgcmV0dXJuIGN0cmw7XG4gICAgfVxuICAgIC8vIFRoaXMgaXMgYSByZXNwb25zZSB0byBhIHN1Y2Nlc3NmdWwgbG9naW4sXG4gICAgLy8gZXh0cmFjdCBVSUQgYW5kIHNlY3VyaXR5IHRva2VuLCBzYXZlIGl0IGluIFRpbm9kZSBtb2R1bGVcbiAgICB0aGlzLl9teVVJRCA9IGN0cmwucGFyYW1zLnVzZXI7XG4gICAgdGhpcy5fYXV0aGVudGljYXRlZCA9IChjdHJsICYmIGN0cmwuY29kZSA+PSAyMDAgJiYgY3RybC5jb2RlIDwgMzAwKTtcbiAgICBpZiAoY3RybC5wYXJhbXMgJiYgY3RybC5wYXJhbXMudG9rZW4gJiYgY3RybC5wYXJhbXMuZXhwaXJlcykge1xuICAgICAgdGhpcy5fYXV0aFRva2VuID0ge1xuICAgICAgICB0b2tlbjogY3RybC5wYXJhbXMudG9rZW4sXG4gICAgICAgIGV4cGlyZXM6IG5ldyBEYXRlKGN0cmwucGFyYW1zLmV4cGlyZXMpXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9hdXRoVG9rZW4gPSBudWxsO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9uTG9naW4pIHtcbiAgICAgIHRoaXMub25Mb2dpbihjdHJsLmNvZGUsIGN0cmwudGV4dCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGN0cmw7XG4gIH1cblxuICAvLyBUaGUgbWFpbiBtZXNzYWdlIGRpc3BhdGNoZXIuXG4gIHRoaXMuX2Nvbm5lY3Rpb24ub25NZXNzYWdlID0gKGRhdGEpID0+IHtcbiAgICAvLyBTa2lwIGVtcHR5IHJlc3BvbnNlLiBUaGlzIGhhcHBlbnMgd2hlbiBMUCB0aW1lcyBvdXQuXG4gICAgaWYgKCFkYXRhKSByZXR1cm47XG5cbiAgICB0aGlzLl9pblBhY2tldENvdW50Kys7XG5cbiAgICAvLyBTZW5kIHJhdyBtZXNzYWdlIHRvIGxpc3RlbmVyXG4gICAgaWYgKHRoaXMub25SYXdNZXNzYWdlKSB7XG4gICAgICB0aGlzLm9uUmF3TWVzc2FnZShkYXRhKTtcbiAgICB9XG5cbiAgICBpZiAoZGF0YSA9PT0gJzAnKSB7XG4gICAgICAvLyBTZXJ2ZXIgcmVzcG9uc2UgdG8gYSBuZXR3b3JrIHByb2JlLlxuICAgICAgaWYgKHRoaXMub25OZXR3b3JrUHJvYmUpIHtcbiAgICAgICAgdGhpcy5vbk5ldHdvcmtQcm9iZSgpO1xuICAgICAgfVxuICAgICAgLy8gTm8gcHJvY2Vzc2luZyBpcyBuZWNlc3NhcnkuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHBrdCA9IEpTT04ucGFyc2UoZGF0YSwganNvblBhcnNlSGVscGVyKTtcbiAgICBpZiAoIXBrdCkge1xuICAgICAgdGhpcy5sb2dnZXIoXCJpbjogXCIgKyBkYXRhKTtcbiAgICAgIHRoaXMubG9nZ2VyKFwiRVJST1I6IGZhaWxlZCB0byBwYXJzZSBkYXRhXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxvZ2dlcihcImluOiBcIiArICh0aGlzLl90cmltTG9uZ1N0cmluZ3MgPyBKU09OLnN0cmluZ2lmeShwa3QsIGpzb25Mb2dnZXJIZWxwZXIpIDogZGF0YSkpO1xuXG4gICAgICAvLyBTZW5kIGNvbXBsZXRlIHBhY2tldCB0byBsaXN0ZW5lclxuICAgICAgaWYgKHRoaXMub25NZXNzYWdlKSB7XG4gICAgICAgIHRoaXMub25NZXNzYWdlKHBrdCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChwa3QuY3RybCkge1xuICAgICAgICAvLyBIYW5kbGluZyB7Y3RybH0gbWVzc2FnZVxuICAgICAgICBpZiAodGhpcy5vbkN0cmxNZXNzYWdlKSB7XG4gICAgICAgICAgdGhpcy5vbkN0cmxNZXNzYWdlKHBrdC5jdHJsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlc29sdmUgb3IgcmVqZWN0IGEgcGVuZGluZyBwcm9taXNlLCBpZiBhbnlcbiAgICAgICAgaWYgKHBrdC5jdHJsLmlkKSB7XG4gICAgICAgICAgZXhlY1Byb21pc2UocGt0LmN0cmwuaWQsIHBrdC5jdHJsLmNvZGUsIHBrdC5jdHJsLCBwa3QuY3RybC50ZXh0KTtcbiAgICAgICAgfVxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBpZiAocGt0LmN0cmwuY29kZSA9PSAyMDUgJiYgcGt0LmN0cmwudGV4dCA9PSAnZXZpY3RlZCcpIHtcbiAgICAgICAgICAgIC8vIFVzZXIgZXZpY3RlZCBmcm9tIHRvcGljLlxuICAgICAgICAgICAgY29uc3QgdG9waWMgPSBjYWNoZUdldCgndG9waWMnLCBwa3QuY3RybC50b3BpYyk7XG4gICAgICAgICAgICBpZiAodG9waWMpIHtcbiAgICAgICAgICAgICAgdG9waWMuX3Jlc2V0U3ViKCk7XG4gICAgICAgICAgICAgIGlmIChwa3QuY3RybC5wYXJhbXMgJiYgcGt0LmN0cmwucGFyYW1zLnVuc3ViKSB7XG4gICAgICAgICAgICAgICAgdG9waWMuX2dvbmUoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAocGt0LmN0cmwucGFyYW1zICYmIHBrdC5jdHJsLnBhcmFtcy53aGF0ID09ICdkYXRhJykge1xuICAgICAgICAgICAgLy8gQWxsIG1lc3NhZ2VzIHJlY2VpdmVkOiBcInBhcmFtc1wiOntcImNvdW50XCI6MTEsXCJ3aGF0XCI6XCJkYXRhXCJ9LFxuICAgICAgICAgICAgY29uc3QgdG9waWMgPSBjYWNoZUdldCgndG9waWMnLCBwa3QuY3RybC50b3BpYyk7XG4gICAgICAgICAgICBpZiAodG9waWMpIHtcbiAgICAgICAgICAgICAgdG9waWMuX2FsbE1lc3NhZ2VzUmVjZWl2ZWQocGt0LmN0cmwucGFyYW1zLmNvdW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKHBrdC5jdHJsLnBhcmFtcyAmJiBwa3QuY3RybC5wYXJhbXMud2hhdCA9PSAnc3ViJykge1xuICAgICAgICAgICAgLy8gVGhlIHRvcGljIGhhcyBubyBzdWJzY3JpcHRpb25zLlxuICAgICAgICAgICAgY29uc3QgdG9waWMgPSBjYWNoZUdldCgndG9waWMnLCBwa3QuY3RybC50b3BpYyk7XG4gICAgICAgICAgICBpZiAodG9waWMpIHtcbiAgICAgICAgICAgICAgLy8gVHJpZ2dlciB0b3BpYy5vblN1YnNVcGRhdGVkLlxuICAgICAgICAgICAgICB0b3BpYy5fcHJvY2Vzc01ldGFTdWIoW10pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSwgMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBpZiAocGt0Lm1ldGEpIHtcbiAgICAgICAgICAgIC8vIEhhbmRsaW5nIGEge21ldGF9IG1lc3NhZ2UuXG5cbiAgICAgICAgICAgIC8vIFByZWZlcnJlZCBBUEk6IFJvdXRlIG1ldGEgdG8gdG9waWMsIGlmIG9uZSBpcyByZWdpc3RlcmVkXG4gICAgICAgICAgICBjb25zdCB0b3BpYyA9IGNhY2hlR2V0KCd0b3BpYycsIHBrdC5tZXRhLnRvcGljKTtcbiAgICAgICAgICAgIGlmICh0b3BpYykge1xuICAgICAgICAgICAgICB0b3BpYy5fcm91dGVNZXRhKHBrdC5tZXRhKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHBrdC5tZXRhLmlkKSB7XG4gICAgICAgICAgICAgIGV4ZWNQcm9taXNlKHBrdC5tZXRhLmlkLCAyMDAsIHBrdC5tZXRhLCAnTUVUQScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBTZWNvbmRhcnkgQVBJOiBjYWxsYmFja1xuICAgICAgICAgICAgaWYgKHRoaXMub25NZXRhTWVzc2FnZSkge1xuICAgICAgICAgICAgICB0aGlzLm9uTWV0YU1lc3NhZ2UocGt0Lm1ldGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAocGt0LmRhdGEpIHtcbiAgICAgICAgICAgIC8vIEhhbmRsaW5nIHtkYXRhfSBtZXNzYWdlXG5cbiAgICAgICAgICAgIC8vIFByZWZlcnJlZCBBUEk6IFJvdXRlIGRhdGEgdG8gdG9waWMsIGlmIG9uZSBpcyByZWdpc3RlcmVkXG4gICAgICAgICAgICBjb25zdCB0b3BpYyA9IGNhY2hlR2V0KCd0b3BpYycsIHBrdC5kYXRhLnRvcGljKTtcbiAgICAgICAgICAgIGlmICh0b3BpYykge1xuICAgICAgICAgICAgICB0b3BpYy5fcm91dGVEYXRhKHBrdC5kYXRhKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gU2Vjb25kYXJ5IEFQSTogQ2FsbCBjYWxsYmFja1xuICAgICAgICAgICAgaWYgKHRoaXMub25EYXRhTWVzc2FnZSkge1xuICAgICAgICAgICAgICB0aGlzLm9uRGF0YU1lc3NhZ2UocGt0LmRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAocGt0LnByZXMpIHtcbiAgICAgICAgICAgIC8vIEhhbmRsaW5nIHtwcmVzfSBtZXNzYWdlXG5cbiAgICAgICAgICAgIC8vIFByZWZlcnJlZCBBUEk6IFJvdXRlIHByZXNlbmNlIHRvIHRvcGljLCBpZiBvbmUgaXMgcmVnaXN0ZXJlZFxuICAgICAgICAgICAgY29uc3QgdG9waWMgPSBjYWNoZUdldCgndG9waWMnLCBwa3QucHJlcy50b3BpYyk7XG4gICAgICAgICAgICBpZiAodG9waWMpIHtcbiAgICAgICAgICAgICAgdG9waWMuX3JvdXRlUHJlcyhwa3QucHJlcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFNlY29uZGFyeSBBUEkgLSBjYWxsYmFja1xuICAgICAgICAgICAgaWYgKHRoaXMub25QcmVzTWVzc2FnZSkge1xuICAgICAgICAgICAgICB0aGlzLm9uUHJlc01lc3NhZ2UocGt0LnByZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAocGt0LmluZm8pIHtcbiAgICAgICAgICAgIC8vIHtpbmZvfSBtZXNzYWdlIC0gcmVhZC9yZWNlaXZlZCBub3RpZmljYXRpb25zIGFuZCBrZXkgcHJlc3Nlc1xuXG4gICAgICAgICAgICAvLyBQcmVmZXJyZWQgQVBJOiBSb3V0ZSB7aW5mb319IHRvIHRvcGljLCBpZiBvbmUgaXMgcmVnaXN0ZXJlZFxuICAgICAgICAgICAgY29uc3QgdG9waWMgPSBjYWNoZUdldCgndG9waWMnLCBwa3QuaW5mby50b3BpYyk7XG4gICAgICAgICAgICBpZiAodG9waWMpIHtcbiAgICAgICAgICAgICAgdG9waWMuX3JvdXRlSW5mbyhwa3QuaW5mbyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFNlY29uZGFyeSBBUEkgLSBjYWxsYmFja1xuICAgICAgICAgICAgaWYgKHRoaXMub25JbmZvTWVzc2FnZSkge1xuICAgICAgICAgICAgICB0aGlzLm9uSW5mb01lc3NhZ2UocGt0LmluZm8pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlcihcIkVSUk9SOiBVbmtub3duIHBhY2tldCByZWNlaXZlZC5cIik7XG4gICAgICAgICAgfVxuICAgICAgICB9LCAwKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBSZWFkeSB0byBzdGFydCBzZW5kaW5nLlxuICB0aGlzLl9jb25uZWN0aW9uLm9uT3BlbiA9ICgpID0+IHtcbiAgICBpZiAoIXRoaXMuX2V4cGlyZVByb21pc2VzKSB7XG4gICAgICAvLyBSZWplY3QgcHJvbWlzZXMgd2hpY2ggaGF2ZSBub3QgYmVlbiByZXNvbHZlZCBmb3IgdG9vIGxvbmcuXG4gICAgICB0aGlzLl9leHBpcmVQcm9taXNlcyA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgY29uc3QgZXJyID0gbmV3IEVycm9yKFwiVGltZW91dCAoNTA0KVwiKTtcbiAgICAgICAgY29uc3QgZXhwaXJlcyA9IG5ldyBEYXRlKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gRVhQSVJFX1BST01JU0VTX1RJTUVPVVQpO1xuICAgICAgICBmb3IgKGxldCBpZCBpbiB0aGlzLl9wZW5kaW5nUHJvbWlzZXMpIHtcbiAgICAgICAgICBsZXQgY2FsbGJhY2tzID0gdGhpcy5fcGVuZGluZ1Byb21pc2VzW2lkXTtcbiAgICAgICAgICBpZiAoY2FsbGJhY2tzICYmIGNhbGxiYWNrcy50cyA8IGV4cGlyZXMpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyKFwiUHJvbWlzZSBleHBpcmVkXCIsIGlkKTtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9wZW5kaW5nUHJvbWlzZXNbaWRdO1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrcy5yZWplY3QpIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2tzLnJlamVjdChlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwgRVhQSVJFX1BST01JU0VTX1BFUklPRCk7XG4gICAgfVxuICAgIHRoaXMuaGVsbG8oKTtcbiAgfVxuXG4gIC8vIFdyYXBwZXIgZm9yIHRoZSByZWNvbm5lY3QgaXRlcmF0b3IgY2FsbGJhY2suXG4gIHRoaXMuX2Nvbm5lY3Rpb24ub25BdXRvcmVjb25uZWN0SXRlcmF0aW9uID0gKHRpbWVvdXQsIHByb21pc2UpID0+IHtcbiAgICBpZiAodGhpcy5vbkF1dG9yZWNvbm5lY3RJdGVyYXRpb24pIHtcbiAgICAgIHRoaXMub25BdXRvcmVjb25uZWN0SXRlcmF0aW9uKHRpbWVvdXQsIHByb21pc2UpO1xuICAgIH1cbiAgfVxuXG4gIHRoaXMuX2Nvbm5lY3Rpb24ub25EaXNjb25uZWN0ID0gKGVyciwgY29kZSkgPT4ge1xuICAgIHRoaXMuX2luUGFja2V0Q291bnQgPSAwO1xuICAgIHRoaXMuX3NlcnZlckluZm8gPSBudWxsO1xuICAgIHRoaXMuX2F1dGhlbnRpY2F0ZWQgPSBmYWxzZTtcblxuICAgIGlmICh0aGlzLl9leHBpcmVQcm9taXNlcykge1xuICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLl9leHBpcmVQcm9taXNlcyk7XG4gICAgICB0aGlzLl9leHBpcmVQcm9taXNlcyA9IG51bGw7XG4gICAgfVxuXG4gICAgLy8gTWFyayBhbGwgdG9waWNzIGFzIHVuc3Vic2NyaWJlZFxuICAgIGNhY2hlTWFwKCd0b3BpYycsICh0b3BpYywga2V5KSA9PiB7XG4gICAgICB0b3BpYy5fcmVzZXRTdWIoKTtcbiAgICB9KTtcblxuICAgIC8vIFJlamVjdCBhbGwgcGVuZGluZyBwcm9taXNlc1xuICAgIGZvciAobGV0IGtleSBpbiB0aGlzLl9wZW5kaW5nUHJvbWlzZXMpIHtcbiAgICAgIGNvbnN0IGNhbGxiYWNrcyA9IHRoaXMuX3BlbmRpbmdQcm9taXNlc1trZXldO1xuICAgICAgaWYgKGNhbGxiYWNrcyAmJiBjYWxsYmFja3MucmVqZWN0KSB7XG4gICAgICAgIGNhbGxiYWNrcy5yZWplY3QoZXJyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5fcGVuZGluZ1Byb21pc2VzID0ge307XG5cbiAgICBpZiAodGhpcy5vbkRpc2Nvbm5lY3QpIHtcbiAgICAgIHRoaXMub25EaXNjb25uZWN0KGVycik7XG4gICAgfVxuICB9XG59O1xuXG4vLyBTdGF0aWMgbWV0aG9kcy5cblxuLyoqXG4gKiBAdHlwZWRlZiBDcmVkZW50aWFsXG4gKiBAdHlwZSB7b2JqZWN0fVxuICogQHByb3BlcnR5IHtzdHJpbmd9IG1ldGggLSB2YWxpZGF0aW9uIG1ldGhvZC5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB2YWwgLSB2YWx1ZSB0byB2YWxpZGF0ZSAoZS5nLiBlbWFpbCBvciBwaG9uZSBudW1iZXIpLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IHJlc3AgLSB2YWxpZGF0aW9uIHJlc3BvbnNlLlxuICogQHByb3BlcnR5IHtPYmplY3R9IHBhcmFtcyAtIHZhbGlkYXRpb24gcGFyYW1ldGVycy5cbiAqL1xuLyoqXG4gKiBIZWxwZXIgbWV0aG9kIHRvIHBhY2thZ2UgYWNjb3VudCBjcmVkZW50aWFsLlxuICpcbiAqIEBtZW1iZXJvZiBUaW5vZGVcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZyB8IENyZWRlbnRpYWx9IG1ldGggLSB2YWxpZGF0aW9uIG1ldGhvZCBvciBvYmplY3Qgd2l0aCB2YWxpZGF0aW9uIGRhdGEuXG4gKiBAcGFyYW0ge3N0cmluZz19IHZhbCAtIHZhbGlkYXRpb24gdmFsdWUgKGUuZy4gZW1haWwgb3IgcGhvbmUgbnVtYmVyKS5cbiAqIEBwYXJhbSB7T2JqZWN0PX0gcGFyYW1zIC0gdmFsaWRhdGlvbiBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtzdHJpbmc9fSByZXNwIC0gdmFsaWRhdGlvbiByZXNwb25zZS5cbiAqXG4gKiBAcmV0dXJucyB7QXJyYXkuPENyZWRlbnRpYWw+fSBhcnJheSB3aXRoIGEgc2luZ2xlIGNyZWRlbnRpYWwgb3IgPGNvZGU+bnVsbDwvY29kZT4gaWYgbm8gdmFsaWQgY3JlZGVudGlhbHMgd2VyZSBnaXZlbi5cbiAqL1xuVGlub2RlLmNyZWRlbnRpYWwgPSBmdW5jdGlvbihtZXRoLCB2YWwsIHBhcmFtcywgcmVzcCkge1xuICBpZiAodHlwZW9mIG1ldGggPT0gJ29iamVjdCcpIHtcbiAgICAoe1xuICAgICAgdmFsLFxuICAgICAgcGFyYW1zLFxuICAgICAgcmVzcCxcbiAgICAgIG1ldGhcbiAgICB9ID0gbWV0aCk7XG4gIH1cbiAgaWYgKG1ldGggJiYgKHZhbCB8fCByZXNwKSkge1xuICAgIHJldHVybiBbe1xuICAgICAgJ21ldGgnOiBtZXRoLFxuICAgICAgJ3ZhbCc6IHZhbCxcbiAgICAgICdyZXNwJzogcmVzcCxcbiAgICAgICdwYXJhbXMnOiBwYXJhbXNcbiAgICB9XTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn07XG5cbi8qKlxuICogRGV0ZXJtaW5lIHRvcGljIHR5cGUgZnJvbSB0b3BpYydzIG5hbWU6IGdycCwgcDJwLCBtZSwgZm5kLCBzeXMuXG4gKiBAbWVtYmVyb2YgVGlub2RlXG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byB0ZXN0LlxuICogQHJldHVybnMge3N0cmluZ30gT25lIG9mIDxjb2RlPlwibWVcIjwvY29kZT4sIDxjb2RlPlwiZm5kXCI8L2NvZGU+LCA8Y29kZT5cInN5c1wiPC9jb2RlPiwgPGNvZGU+XCJncnBcIjwvY29kZT4sXG4gKiAgICA8Y29kZT5cInAycFwiPC9jb2RlPiBvciA8Y29kZT51bmRlZmluZWQ8L2NvZGU+LlxuICovXG5UaW5vZGUudG9waWNUeXBlID0gZnVuY3Rpb24obmFtZSkge1xuICBjb25zdCB0eXBlcyA9IHtcbiAgICAnbWUnOiAnbWUnLFxuICAgICdmbmQnOiAnZm5kJyxcbiAgICAnZ3JwJzogJ2dycCcsXG4gICAgJ25ldyc6ICdncnAnLFxuICAgICduY2gnOiAnZ3JwJyxcbiAgICAnY2huJzogJ2dycCcsXG4gICAgJ3Vzcic6ICdwMnAnLFxuICAgICdzeXMnOiAnc3lzJ1xuICB9O1xuICByZXR1cm4gdHlwZXNbKHR5cGVvZiBuYW1lID09ICdzdHJpbmcnKSA/IG5hbWUuc3Vic3RyaW5nKDAsIDMpIDogJ3h4eCddO1xufTtcblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgZ2l2ZW4gdG9waWMgbmFtZSBpcyBhIG5hbWUgb2YgYSAnbWUnIHRvcGljLlxuICogQG1lbWJlcm9mIFRpbm9kZVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gdGVzdC5cbiAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0aGUgbmFtZSBpcyBhIG5hbWUgb2YgYSAnbWUnIHRvcGljLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICovXG5UaW5vZGUuaXNNZVRvcGljTmFtZSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgcmV0dXJuIFRpbm9kZS50b3BpY1R5cGUobmFtZSkgPT0gJ21lJztcbn07XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhlIGdpdmVuIHRvcGljIG5hbWUgaXMgYSBuYW1lIG9mIGEgZ3JvdXAgdG9waWMuXG4gKiBAbWVtYmVyb2YgVGlub2RlXG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byB0ZXN0LlxuICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBuYW1lIGlzIGEgbmFtZSBvZiBhIGdyb3VwIHRvcGljLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICovXG5UaW5vZGUuaXNHcm91cFRvcGljTmFtZSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgcmV0dXJuIFRpbm9kZS50b3BpY1R5cGUobmFtZSkgPT0gJ2dycCc7XG59O1xuXG4vKipcbiAqIENoZWNrIGlmIHRoZSBnaXZlbiB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhIHAycCB0b3BpYy5cbiAqIEBtZW1iZXJvZiBUaW5vZGVcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIHRlc3QuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdGhlIG5hbWUgaXMgYSBuYW1lIG9mIGEgcDJwIHRvcGljLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICovXG5UaW5vZGUuaXNQMlBUb3BpY05hbWUgPSBmdW5jdGlvbihuYW1lKSB7XG4gIHJldHVybiBUaW5vZGUudG9waWNUeXBlKG5hbWUpID09ICdwMnAnO1xufTtcblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgZ2l2ZW4gdG9waWMgbmFtZSBpcyBhIG5hbWUgb2YgYSBjb21tdW5pY2F0aW9uIHRvcGljLCBpLmUuIFAyUCBvciBncm91cC5cbiAqIEBtZW1iZXJvZiBUaW5vZGVcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIHRlc3QuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdGhlIG5hbWUgaXMgYSBuYW1lIG9mIGEgcDJwIG9yIGdyb3VwIHRvcGljLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICovXG5UaW5vZGUuaXNDb21tVG9waWNOYW1lID0gZnVuY3Rpb24obmFtZSkge1xuICByZXR1cm4gVGlub2RlLmlzUDJQVG9waWNOYW1lKG5hbWUpIHx8IFRpbm9kZS5pc0dyb3VwVG9waWNOYW1lKG5hbWUpO1xufTtcblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgdG9waWMgbmFtZSBpcyBhIG5hbWUgb2YgYSBuZXcgdG9waWMuXG4gKiBAbWVtYmVyb2YgVGlub2RlXG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSB0b3BpYyBuYW1lIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBuYW1lIGlzIGEgbmFtZSBvZiBhIG5ldyB0b3BpYywgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAqL1xuVGlub2RlLmlzTmV3R3JvdXBUb3BpY05hbWUgPSBmdW5jdGlvbihuYW1lKSB7XG4gIHJldHVybiAodHlwZW9mIG5hbWUgPT0gJ3N0cmluZycpICYmXG4gICAgKG5hbWUuc3Vic3RyaW5nKDAsIDMpID09IFRPUElDX05FVyB8fCBuYW1lLnN1YnN0cmluZygwLCAzKSA9PSBUT1BJQ19ORVdfQ0hBTik7XG59O1xuXG4vKipcbiAqIENoZWNrIGlmIHRoZSB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhIGNoYW5uZWwuXG4gKiBAbWVtYmVyb2YgVGlub2RlXG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSB0b3BpYyBuYW1lIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBuYW1lIGlzIGEgbmFtZSBvZiBhIGNoYW5uZWwsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gKi9cblRpbm9kZS5pc0NoYW5uZWxUb3BpY05hbWUgPSBmdW5jdGlvbihuYW1lKSB7XG4gIHJldHVybiAodHlwZW9mIG5hbWUgPT0gJ3N0cmluZycpICYmXG4gICAgKG5hbWUuc3Vic3RyaW5nKDAsIDMpID09IFRPUElDX0NIQU4gfHwgbmFtZS5zdWJzdHJpbmcoMCwgMykgPT0gVE9QSUNfTkVXX0NIQU4pO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gaW5mb3JtYXRpb24gYWJvdXQgdGhlIGN1cnJlbnQgdmVyc2lvbiBvZiB0aGlzIFRpbm9kZSBjbGllbnQgbGlicmFyeS5cbiAqIEBtZW1iZXJvZiBUaW5vZGVcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBzZW1hbnRpYyB2ZXJzaW9uIG9mIHRoZSBsaWJyYXJ5LCBlLmcuIDxjb2RlPlwiMC4xNS41LXJjMVwiPC9jb2RlPi5cbiAqL1xuVGlub2RlLmdldFZlcnNpb24gPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIFZFUlNJT047XG59O1xuXG4vKipcbiAqIFRvIHVzZSBUaW5vZGUgaW4gYSBub24gYnJvd3NlciBjb250ZXh0LCBzdXBwbHkgV2ViU29ja2V0IGFuZCBYTUxIdHRwUmVxdWVzdCBwcm92aWRlcnMuXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyb2YgVGlub2RlXG4gKiBAcGFyYW0gd3NQcm92aWRlciBXZWJTb2NrZXQgcHJvdmlkZXIsIGUuZy4gZm9yIG5vZGVKUyAsIDxjb2RlPnJlcXVpcmUoJ3dzJyk8L2NvZGU+LlxuICogQHBhcmFtIHhoclByb3ZpZGVyIFhNTEh0dHBSZXF1ZXN0IHByb3ZpZGVyLCBlLmcuIGZvciBub2RlIDxjb2RlPnJlcXVpcmUoJ3hocicpPC9jb2RlPi5cbiAqL1xuVGlub2RlLnNldE5ldHdvcmtQcm92aWRlcnMgPSBmdW5jdGlvbih3c1Byb3ZpZGVyLCB4aHJQcm92aWRlcikge1xuICBXZWJTb2NrZXRQcm92aWRlciA9IHdzUHJvdmlkZXI7XG4gIFhIUlByb3ZpZGVyID0geGhyUHJvdmlkZXI7XG59O1xuXG4vKipcbiAqIFJldHVybiBpbmZvcm1hdGlvbiBhYm91dCB0aGUgY3VycmVudCBuYW1lIGFuZCB2ZXJzaW9uIG9mIHRoaXMgVGlub2RlIGxpYnJhcnkuXG4gKiBAbWVtYmVyb2YgVGlub2RlXG4gKiBAc3RhdGljXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gdGhlIG5hbWUgb2YgdGhlIGxpYnJhcnkgYW5kIGl0J3MgdmVyc2lvbi5cbiAqL1xuVGlub2RlLmdldExpYnJhcnkgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIExJQlJBUlk7XG59O1xuXG4vLyBFeHBvcnRlZCBjb25zdGFudHNcblRpbm9kZS5NRVNTQUdFX1NUQVRVU19OT05FID0gTUVTU0FHRV9TVEFUVVNfTk9ORTtcblRpbm9kZS5NRVNTQUdFX1NUQVRVU19RVUVVRUQgPSBNRVNTQUdFX1NUQVRVU19RVUVVRUQ7XG5UaW5vZGUuTUVTU0FHRV9TVEFUVVNfU0VORElORyA9IE1FU1NBR0VfU1RBVFVTX1NFTkRJTkc7XG5UaW5vZGUuTUVTU0FHRV9TVEFUVVNfRkFJTEVEID0gTUVTU0FHRV9TVEFUVVNfRkFJTEVEO1xuVGlub2RlLk1FU1NBR0VfU1RBVFVTX1NFTlQgPSBNRVNTQUdFX1NUQVRVU19TRU5UO1xuVGlub2RlLk1FU1NBR0VfU1RBVFVTX1JFQ0VJVkVEID0gTUVTU0FHRV9TVEFUVVNfUkVDRUlWRUQ7XG5UaW5vZGUuTUVTU0FHRV9TVEFUVVNfUkVBRCA9IE1FU1NBR0VfU1RBVFVTX1JFQUQ7XG5UaW5vZGUuTUVTU0FHRV9TVEFUVVNfVE9fTUUgPSBNRVNTQUdFX1NUQVRVU19UT19NRTtcblxuLy8gVW5pY29kZSBbZGVsXSBzeW1ib2wuXG5UaW5vZGUuREVMX0NIQVIgPSAnXFx1MjQyMSc7XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhlIGdpdmVuIHN0cmluZyByZXByZXNlbnRzIDxjb2RlPk5VTEw8L2NvZGU+IHZhbHVlIGFzIGRlZmluZWQgYnkgVGlub2RlICg8Y29kZT4nXFx1MjQyMSc8L2NvZGU+KS5cbiAqIEBtZW1iZXJvZiBUaW5vZGVcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyIC0gc3RyaW5nIHRvIGNoZWNrIGZvciA8Y29kZT5OVUxMPC9jb2RlPiB2YWx1ZS5cbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgc3RyaW5nIHJlcHJlc2VudHMgPGNvZGU+TlVMTDwvY29kZT4gdmFsdWUsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gKi9cblRpbm9kZS5pc051bGxWYWx1ZSA9IGZ1bmN0aW9uKHN0cikge1xuICByZXR1cm4gc3RyID09PSBUaW5vZGUuREVMX0NIQVI7XG59O1xuXG4vKipcbiAqIENoZWNrIGlmIHRoZSBnaXZlbiBVUkwgc3RyaW5nIGlzIGEgcmVsYXRpdmUgVVJMLlxuICogQ2hlY2sgZm9yIGNhc2VzIGxpa2U6XG4gKiAgPGNvZGU+J2h0dHA6Ly9leGFtcGxlLmNvbSc8L2NvZGU+XG4gKiAgPGNvZGU+JyBodHRwOi8vZXhhbXBsZS5jb20nPC9jb2RlPlxuICogIDxjb2RlPicvL2V4YW1wbGUuY29tLyc8L2NvZGU+XG4gKiAgPGNvZGU+J2h0dHA6ZXhhbXBsZS5jb20nPC9jb2RlPlxuICogIDxjb2RlPidodHRwOi9leGFtcGxlLmNvbSc8L2NvZGU+XG4gKiBAbWVtYmVyb2YgVGlub2RlXG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIFVSTCBzdHJpbmcgdG8gY2hlY2suXG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHRoZSBVUkwgaXMgcmVsYXRpdmUsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gKi9cblRpbm9kZS5pc1JlbGF0aXZlVVJMID0gZnVuY3Rpb24odXJsKSB7XG4gIHJldHVybiAhL15cXHMqKFthLXpdW2EtejAtOSsuLV0qOnxcXC9cXC8pL2ltLnRlc3QodXJsKTtcbn07XG5cbi8vIE5hbWVzIG9mIGtleXMgdG8gc2VydmVyLXByb3ZpZGVkIGNvbmZpZ3VyYXRpb24gbGltaXRzLlxuVGlub2RlLk1BWF9NRVNTQUdFX1NJWkUgPSAnbWF4TWVzc2FnZVNpemUnO1xuVGlub2RlLk1BWF9TVUJTQ1JJQkVSX0NPVU5UID0gJ21heFN1YnNjcmliZXJDb3VudCc7XG5UaW5vZGUuTUFYX1RBR19DT1VOVCA9ICdtYXhUYWdDb3VudCc7XG5UaW5vZGUuTUFYX0ZJTEVfVVBMT0FEX1NJWkUgPSAnbWF4RmlsZVVwbG9hZFNpemUnO1xuXG4vLyBQdWJsaWMgbWV0aG9kcztcblRpbm9kZS5wcm90b3R5cGUgPSB7XG4gIC8qKlxuICAgKiBDb25uZWN0IHRvIHRoZSBzZXJ2ZXIuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBob3N0XyAtIG5hbWUgb2YgdGhlIGhvc3QgdG8gY29ubmVjdCB0by5cbiAgICpcbiAgICogQHJldHVybiB7UHJvbWlzZX0gUHJvbWlzZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBjb25uZWN0aW9uIGNhbGwgY29tcGxldGVzOlxuICAgKiAgICA8Y29kZT5yZXNvbHZlKCk8L2NvZGU+IGlzIGNhbGxlZCB3aXRob3V0IHBhcmFtZXRlcnMsIDxjb2RlPnJlamVjdCgpPC9jb2RlPiByZWNlaXZlcyB0aGVcbiAgICogICAgPGNvZGU+RXJyb3I8L2NvZGU+IGFzIGEgc2luZ2xlIHBhcmFtZXRlci5cbiAgICovXG4gIGNvbm5lY3Q6IGZ1bmN0aW9uKGhvc3RfKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Nvbm5lY3Rpb24uY29ubmVjdChob3N0Xyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEF0dGVtcHQgdG8gcmVjb25uZWN0IHRvIHRoZSBzZXJ2ZXIgaW1tZWRpYXRlbHkuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmb3JjZSAtIHJlY29ubmVjdCBldmVuIGlmIHRoZXJlIGlzIGEgY29ubmVjdGlvbiBhbHJlYWR5LlxuICAgKi9cbiAgcmVjb25uZWN0OiBmdW5jdGlvbihmb3JjZSkge1xuICAgIHRoaXMuX2Nvbm5lY3Rpb24ucmVjb25uZWN0KGZvcmNlKTtcbiAgfSxcblxuICAvKipcbiAgICogRGlzY29ubmVjdCBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqL1xuICBkaXNjb25uZWN0OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLl9jb25uZWN0aW9uLmRpc2Nvbm5lY3QoKTtcbiAgfSxcblxuICAvKipcbiAgICogQ2xlYXIgcGVyc2lzdGVudCBjYWNoZTogcmVtb3ZlIGluZGV4REIgY2FjaGUgb2YgdGhlIG1vc3QgcmVjZW50bHkgbG9nZ2VkIGluIHVzZXIuXG4gICAqL1xuICBjbGVhclN0b3JhZ2U6IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLl9kYikge1xuICAgICAgdGhpcy5fZGIuZGVsZXRlRGF0YWJhc2UoKTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNlbmQgYSBuZXR3b3JrIHByb2JlIG1lc3NhZ2UgdG8gbWFrZSBzdXJlIHRoZSBjb25uZWN0aW9uIGlzIGFsaXZlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKi9cbiAgbmV0d29ya1Byb2JlOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLl9jb25uZWN0aW9uLnByb2JlKCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENoZWNrIGZvciBsaXZlIGNvbm5lY3Rpb24gdG8gc2VydmVyLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdGhlcmUgaXMgYSBsaXZlIGNvbm5lY3Rpb24sIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBpc0Nvbm5lY3RlZDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Nvbm5lY3Rpb24uaXNDb25uZWN0ZWQoKTtcbiAgfSxcblxuICAvKipcbiAgICogQ2hlY2sgaWYgY29ubmVjdGlvbiBpcyBhdXRoZW50aWNhdGVkIChsYXN0IGxvZ2luIHdhcyBzdWNjZXNzZnVsKS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICogQHJldHVybnMge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIGF1dGhlbnRpY2F0ZWQsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBpc0F1dGhlbnRpY2F0ZWQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9hdXRoZW50aWNhdGVkO1xuICB9LFxuXG4gIC8qKlxuICAgKiBBZGQgQVBJIGtleSBhbmQgYXV0aCB0b2tlbiB0byB0aGUgcmVsYXRpdmUgVVJMIG1ha2luZyBpdCB1c2FibGUgZm9yIGdldHRpbmcgZGF0YVxuICAgKiBmcm9tIHRoZSBzZXJ2ZXIgaW4gYSBzaW1wbGUgPGNvZGU+SFRUUCBHRVQ8L2NvZGU+IHJlcXVlc3QuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBVUkwgLSBVUkwgdG8gd3JhcC5cbiAgICogQHJldHVybnMge3N0cmluZ30gVVJMIHdpdGggYXBwZW5kZWQgQVBJIGtleSBhbmQgdG9rZW4sIGlmIHZhbGlkIHRva2VuIGlzIHByZXNlbnQuXG4gICAqL1xuICBhdXRob3JpemVVUkw6IGZ1bmN0aW9uKHVybCkge1xuICAgIGlmICghdXJsKSB7XG4gICAgICByZXR1cm4gdXJsO1xuICAgIH1cblxuICAgIGlmIChUaW5vZGUuaXNSZWxhdGl2ZVVSTCh1cmwpKSB7XG4gICAgICAvLyBGYWtlIGJhc2UgdG8gbWFrZSB0aGUgcmVsYXRpdmUgVVJMIHBhcnNlYWJsZS5cbiAgICAgIGNvbnN0IGJhc2UgPSAnc2NoZW1lOi8vaG9zdC8nO1xuICAgICAgY29uc3QgcGFyc2VkID0gbmV3IFVSTCh1cmwsIGJhc2UpO1xuICAgICAgaWYgKHRoaXMuX2FwaUtleSkge1xuICAgICAgICBwYXJzZWQuc2VhcmNoUGFyYW1zLmFwcGVuZCgnYXBpa2V5JywgdGhpcy5fYXBpS2V5KTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLl9hdXRoVG9rZW4udG9rZW4pIHtcbiAgICAgICAgcGFyc2VkLnNlYXJjaFBhcmFtcy5hcHBlbmQoJ2F1dGgnLCAndG9rZW4nKTtcbiAgICAgICAgcGFyc2VkLnNlYXJjaFBhcmFtcy5hcHBlbmQoJ3NlY3JldCcsIHRoaXMuX2F1dGhUb2tlbi50b2tlbik7XG4gICAgICB9XG4gICAgICAvLyBDb252ZXJ0IGJhY2sgdG8gc3RyaW5nIGFuZCBzdHJpcCBmYWtlIGJhc2UgVVJMIGV4Y2VwdCBmb3IgdGhlIHJvb3Qgc2xhc2guXG4gICAgICB1cmwgPSBwYXJzZWQudG9TdHJpbmcoKS5zdWJzdHJpbmcoYmFzZS5sZW5ndGggLSAxKTtcbiAgICB9XG4gICAgcmV0dXJuIHVybDtcbiAgfSxcblxuICAvKipcbiAgICogQHR5cGVkZWYgQWNjb3VudFBhcmFtc1xuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcm9wZXJ0eSB7VGlub2RlLkRlZkFjcz19IGRlZmFjcyAtIERlZmF1bHQgYWNjZXNzIHBhcmFtZXRlcnMgZm9yIHVzZXIncyA8Y29kZT5tZTwvY29kZT4gdG9waWMuXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0PX0gcHVibGljIC0gUHVibGljIGFwcGxpY2F0aW9uLWRlZmluZWQgZGF0YSBleHBvc2VkIG9uIDxjb2RlPm1lPC9jb2RlPiB0b3BpYy5cbiAgICogQHByb3BlcnR5IHtPYmplY3Q9fSBwcml2YXRlIC0gUHJpdmF0ZSBhcHBsaWNhdGlvbi1kZWZpbmVkIGRhdGEgYWNjZXNzaWJsZSBvbiA8Y29kZT5tZTwvY29kZT4gdG9waWMuXG4gICAqIEBwcm9wZXJ0eSB7QXJyYXl9IHRhZ3MgLSBhcnJheSBvZiBzdHJpbmcgdGFncyBmb3IgdXNlciBkaXNjb3ZlcnkuXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nPX0gdG9rZW4gLSBhdXRoZW50aWNhdGlvbiB0b2tlbiB0byB1c2UuXG4gICAqL1xuICAvKipcbiAgICogQHR5cGVkZWYgRGVmQWNzXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByb3BlcnR5IHtzdHJpbmc9fSBhdXRoIC0gQWNjZXNzIG1vZGUgZm9yIDxjb2RlPm1lPC9jb2RlPiBmb3IgYXV0aGVudGljYXRlZCB1c2Vycy5cbiAgICogQHByb3BlcnR5IHtzdHJpbmc9fSBhbm9uIC0gQWNjZXNzIG1vZGUgZm9yIDxjb2RlPm1lPC9jb2RlPiBmb3IgYW5vbnltb3VzIHVzZXJzLlxuICAgKi9cblxuICAvKipcbiAgICogQ3JlYXRlIG9yIHVwZGF0ZSBhbiBhY2NvdW50LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gVXNlciBpZCB0byB1cGRhdGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNjaGVtZSAtIEF1dGhlbnRpY2F0aW9uIHNjaGVtZTsgPGNvZGU+XCJiYXNpY1wiPC9jb2RlPiBhbmQgPGNvZGU+XCJhbm9ueW1vdXNcIjwvY29kZT4gYXJlIHRoZSBjdXJyZW50bHkgc3VwcG9ydGVkIHNjaGVtZXMuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzZWNyZXQgLSBBdXRoZW50aWNhdGlvbiBzZWNyZXQsIGFzc3VtZWQgdG8gYmUgYWxyZWFkeSBiYXNlNjQgZW5jb2RlZC5cbiAgICogQHBhcmFtIHtib29sZWFuPX0gbG9naW4gLSBVc2UgbmV3IGFjY291bnQgdG8gYXV0aGVudGljYXRlIGN1cnJlbnQgc2Vzc2lvblxuICAgKiBAcGFyYW0ge1Rpbm9kZS5BY2NvdW50UGFyYW1zPX0gcGFyYW1zIC0gVXNlciBkYXRhIHRvIHBhc3MgdG8gdGhlIHNlcnZlci5cbiAgICovXG4gIGFjY291bnQ6IGZ1bmN0aW9uKHVpZCwgc2NoZW1lLCBzZWNyZXQsIGxvZ2luLCBwYXJhbXMpIHtcbiAgICBjb25zdCBwa3QgPSB0aGlzLmluaXRQYWNrZXQoJ2FjYycpO1xuICAgIHBrdC5hY2MudXNlciA9IHVpZDtcbiAgICBwa3QuYWNjLnNjaGVtZSA9IHNjaGVtZTtcbiAgICBwa3QuYWNjLnNlY3JldCA9IHNlY3JldDtcbiAgICAvLyBMb2cgaW4gdG8gdGhlIG5ldyBhY2NvdW50IHVzaW5nIHNlbGVjdGVkIHNjaGVtZVxuICAgIHBrdC5hY2MubG9naW4gPSBsb2dpbjtcblxuICAgIGlmIChwYXJhbXMpIHtcbiAgICAgIHBrdC5hY2MuZGVzYy5kZWZhY3MgPSBwYXJhbXMuZGVmYWNzO1xuICAgICAgcGt0LmFjYy5kZXNjLnB1YmxpYyA9IHBhcmFtcy5wdWJsaWM7XG4gICAgICBwa3QuYWNjLmRlc2MucHJpdmF0ZSA9IHBhcmFtcy5wcml2YXRlO1xuXG4gICAgICBwa3QuYWNjLnRhZ3MgPSBwYXJhbXMudGFncztcbiAgICAgIHBrdC5hY2MuY3JlZCA9IHBhcmFtcy5jcmVkO1xuXG4gICAgICBwa3QuYWNjLnRva2VuID0gcGFyYW1zLnRva2VuO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnNlbmQocGt0LCBwa3QuYWNjLmlkKTtcbiAgfSxcblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IHVzZXIuIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjYWNjb3VudH0uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzY2hlbWUgLSBBdXRoZW50aWNhdGlvbiBzY2hlbWU7IDxjb2RlPlwiYmFzaWNcIjwvY29kZT4gaXMgdGhlIG9ubHkgY3VycmVudGx5IHN1cHBvcnRlZCBzY2hlbWUuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzZWNyZXQgLSBBdXRoZW50aWNhdGlvbi5cbiAgICogQHBhcmFtIHtib29sZWFuPX0gbG9naW4gLSBVc2UgbmV3IGFjY291bnQgdG8gYXV0aGVudGljYXRlIGN1cnJlbnQgc2Vzc2lvblxuICAgKiBAcGFyYW0ge1Rpbm9kZS5BY2NvdW50UGFyYW1zPX0gcGFyYW1zIC0gVXNlciBkYXRhIHRvIHBhc3MgdG8gdGhlIHNlcnZlci5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHNlcnZlciByZXBseSBpcyByZWNlaXZlZC5cbiAgICovXG4gIGNyZWF0ZUFjY291bnQ6IGZ1bmN0aW9uKHNjaGVtZSwgc2VjcmV0LCBsb2dpbiwgcGFyYW1zKSB7XG4gICAgbGV0IHByb21pc2UgPSB0aGlzLmFjY291bnQoVVNFUl9ORVcsIHNjaGVtZSwgc2VjcmV0LCBsb2dpbiwgcGFyYW1zKTtcbiAgICBpZiAobG9naW4pIHtcbiAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKGN0cmwpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9naW5TdWNjZXNzZnVsKGN0cmwpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBwcm9taXNlO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDcmVhdGUgdXNlciB3aXRoIDxjb2RlPidiYXNpYyc8L2NvZGU+IGF1dGhlbnRpY2F0aW9uIHNjaGVtZSBhbmQgaW1tZWRpYXRlbHlcbiAgICogdXNlIGl0IGZvciBhdXRoZW50aWNhdGlvbi4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNhY2NvdW50fS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVzZXJuYW1lIC0gTG9naW4gdG8gdXNlIGZvciB0aGUgbmV3IGFjY291bnQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXNzd29yZCAtIFVzZXIncyBwYXNzd29yZC5cbiAgICogQHBhcmFtIHtUaW5vZGUuQWNjb3VudFBhcmFtcz19IHBhcmFtcyAtIFVzZXIgZGF0YSB0byBwYXNzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiBzZXJ2ZXIgcmVwbHkgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICBjcmVhdGVBY2NvdW50QmFzaWM6IGZ1bmN0aW9uKHVzZXJuYW1lLCBwYXNzd29yZCwgcGFyYW1zKSB7XG4gICAgLy8gTWFrZSBzdXJlIHdlIGFyZSBub3QgdXNpbmcgJ251bGwnIG9yICd1bmRlZmluZWQnO1xuICAgIHVzZXJuYW1lID0gdXNlcm5hbWUgfHwgJyc7XG4gICAgcGFzc3dvcmQgPSBwYXNzd29yZCB8fCAnJztcbiAgICByZXR1cm4gdGhpcy5jcmVhdGVBY2NvdW50KCdiYXNpYycsXG4gICAgICBiNjRFbmNvZGVVbmljb2RlKHVzZXJuYW1lICsgJzonICsgcGFzc3dvcmQpLCB0cnVlLCBwYXJhbXMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBVcGRhdGUgdXNlcidzIGNyZWRlbnRpYWxzIGZvciA8Y29kZT4nYmFzaWMnPC9jb2RlPiBhdXRoZW50aWNhdGlvbiBzY2hlbWUuIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjYWNjb3VudH0uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBVc2VyIElEIHRvIHVwZGF0ZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHVzZXJuYW1lIC0gTG9naW4gdG8gdXNlIGZvciB0aGUgbmV3IGFjY291bnQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXNzd29yZCAtIFVzZXIncyBwYXNzd29yZC5cbiAgICogQHBhcmFtIHtUaW5vZGUuQWNjb3VudFBhcmFtcz19IHBhcmFtcyAtIGRhdGEgdG8gcGFzcyB0byB0aGUgc2VydmVyLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gc2VydmVyIHJlcGx5IGlzIHJlY2VpdmVkLlxuICAgKi9cbiAgdXBkYXRlQWNjb3VudEJhc2ljOiBmdW5jdGlvbih1aWQsIHVzZXJuYW1lLCBwYXNzd29yZCwgcGFyYW1zKSB7XG4gICAgLy8gTWFrZSBzdXJlIHdlIGFyZSBub3QgdXNpbmcgJ251bGwnIG9yICd1bmRlZmluZWQnO1xuICAgIHVzZXJuYW1lID0gdXNlcm5hbWUgfHwgJyc7XG4gICAgcGFzc3dvcmQgPSBwYXNzd29yZCB8fCAnJztcbiAgICByZXR1cm4gdGhpcy5hY2NvdW50KHVpZCwgJ2Jhc2ljJyxcbiAgICAgIGI2NEVuY29kZVVuaWNvZGUodXNlcm5hbWUgKyAnOicgKyBwYXNzd29yZCksIGZhbHNlLCBwYXJhbXMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTZW5kIGhhbmRzaGFrZSB0byB0aGUgc2VydmVyLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gc2VydmVyIHJlcGx5IGlzIHJlY2VpdmVkLlxuICAgKi9cbiAgaGVsbG86IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuaW5pdFBhY2tldCgnaGknKTtcblxuICAgIHJldHVybiB0aGlzLnNlbmQocGt0LCBwa3QuaGkuaWQpXG4gICAgICAudGhlbigoY3RybCkgPT4ge1xuICAgICAgICAvLyBSZXNldCBiYWNrb2ZmIGNvdW50ZXIgb24gc3VjY2Vzc2Z1bCBjb25uZWN0aW9uLlxuICAgICAgICB0aGlzLl9jb25uZWN0aW9uLmJhY2tvZmZSZXNldCgpO1xuXG4gICAgICAgIC8vIFNlcnZlciByZXNwb25zZSBjb250YWlucyBzZXJ2ZXIgcHJvdG9jb2wgdmVyc2lvbiwgYnVpbGQsIGNvbnN0cmFpbnRzLFxuICAgICAgICAvLyBzZXNzaW9uIElEIGZvciBsb25nIHBvbGxpbmcuIFNhdmUgdGhlbS5cbiAgICAgICAgaWYgKGN0cmwucGFyYW1zKSB7XG4gICAgICAgICAgdGhpcy5fc2VydmVySW5mbyA9IGN0cmwucGFyYW1zO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMub25Db25uZWN0KSB7XG4gICAgICAgICAgdGhpcy5vbkNvbm5lY3QoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjdHJsO1xuICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICB0aGlzLl9jb25uZWN0aW9uLnJlY29ubmVjdCh0cnVlKTtcblxuICAgICAgICBpZiAodGhpcy5vbkRpc2Nvbm5lY3QpIHtcbiAgICAgICAgICB0aGlzLm9uRGlzY29ubmVjdChlcnIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogU2V0IG9yIHJlZnJlc2ggdGhlIHB1c2ggbm90aWZpY2F0aW9ucy9kZXZpY2UgdG9rZW4uIElmIHRoZSBjbGllbnQgaXMgY29ubmVjdGVkLFxuICAgKiB0aGUgZGV2aWNlVG9rZW4gY2FuIGJlIHNlbnQgdG8gdGhlIHNlcnZlci5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICogQHBhcmFtIHtzdHJpbmd9IGR0IC0gdG9rZW4gb2J0YWluZWQgZnJvbSB0aGUgcHJvdmlkZXIgb3IgPGNvZGU+ZmFsc2U8L2NvZGU+LFxuICAgKiAgICA8Y29kZT5udWxsPC9jb2RlPiBvciA8Y29kZT51bmRlZmluZWQ8L2NvZGU+IHRvIGNsZWFyIHRoZSB0b2tlbi5cbiAgICpcbiAgICogQHJldHVybnMgPGNvZGU+dHJ1ZTwvY29kZT4gaWYgYXR0ZW1wdCB3YXMgbWFkZSB0byBzZW5kIHRoZSB1cGRhdGUgdG8gdGhlIHNlcnZlci5cbiAgICovXG4gIHNldERldmljZVRva2VuOiBmdW5jdGlvbihkdCkge1xuICAgIGxldCBzZW50ID0gZmFsc2U7XG4gICAgLy8gQ29udmVydCBhbnkgZmFsc2lzaCB2YWx1ZSB0byBudWxsLlxuICAgIGR0ID0gZHQgfHwgbnVsbDtcbiAgICBpZiAoZHQgIT0gdGhpcy5fZGV2aWNlVG9rZW4pIHtcbiAgICAgIHRoaXMuX2RldmljZVRva2VuID0gZHQ7XG4gICAgICBpZiAodGhpcy5pc0Nvbm5lY3RlZCgpICYmIHRoaXMuaXNBdXRoZW50aWNhdGVkKCkpIHtcbiAgICAgICAgdGhpcy5zZW5kKHtcbiAgICAgICAgICAnaGknOiB7XG4gICAgICAgICAgICAnZGV2JzogZHQgfHwgVGlub2RlLkRFTF9DSEFSXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgc2VudCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzZW50O1xuICB9LFxuXG4gIC8qKlxuICAgKiBBdXRoZW50aWNhdGUgY3VycmVudCBzZXNzaW9uLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2NoZW1lIC0gQXV0aGVudGljYXRpb24gc2NoZW1lOyA8Y29kZT5cImJhc2ljXCI8L2NvZGU+IGlzIHRoZSBvbmx5IGN1cnJlbnRseSBzdXBwb3J0ZWQgc2NoZW1lLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2VjcmV0IC0gQXV0aGVudGljYXRpb24gc2VjcmV0LCBhc3N1bWVkIHRvIGJlIGFscmVhZHkgYmFzZTY0IGVuY29kZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiBzZXJ2ZXIgcmVwbHkgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICBsb2dpbjogZnVuY3Rpb24oc2NoZW1lLCBzZWNyZXQsIGNyZWQpIHtcbiAgICBjb25zdCBwa3QgPSB0aGlzLmluaXRQYWNrZXQoJ2xvZ2luJyk7XG4gICAgcGt0LmxvZ2luLnNjaGVtZSA9IHNjaGVtZTtcbiAgICBwa3QubG9naW4uc2VjcmV0ID0gc2VjcmV0O1xuICAgIHBrdC5sb2dpbi5jcmVkID0gY3JlZDtcblxuICAgIHJldHVybiB0aGlzLnNlbmQocGt0LCBwa3QubG9naW4uaWQpXG4gICAgICAudGhlbigoY3RybCkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2dpblN1Y2Nlc3NmdWwoY3RybCk7XG4gICAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNsb2dpbn0gd2l0aCBiYXNpYyBhdXRoZW50aWNhdGlvblxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdW5hbWUgLSBVc2VyIG5hbWUuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXNzd29yZCAgLSBQYXNzd29yZC5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgbG9naW5CYXNpYzogZnVuY3Rpb24odW5hbWUsIHBhc3N3b3JkLCBjcmVkKSB7XG4gICAgcmV0dXJuIHRoaXMubG9naW4oJ2Jhc2ljJywgYjY0RW5jb2RlVW5pY29kZSh1bmFtZSArICc6JyArIHBhc3N3b3JkKSwgY3JlZClcbiAgICAgIC50aGVuKChjdHJsKSA9PiB7XG4gICAgICAgIHRoaXMuX2xvZ2luID0gdW5hbWU7XG4gICAgICAgIHJldHVybiBjdHJsO1xuICAgICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjbG9naW59IHdpdGggdG9rZW4gYXV0aGVudGljYXRpb25cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRva2VuIC0gVG9rZW4gcmVjZWl2ZWQgaW4gcmVzcG9uc2UgdG8gZWFybGllciBsb2dpbi5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgbG9naW5Ub2tlbjogZnVuY3Rpb24odG9rZW4sIGNyZWQpIHtcbiAgICByZXR1cm4gdGhpcy5sb2dpbigndG9rZW4nLCB0b2tlbiwgY3JlZCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNlbmQgYSByZXF1ZXN0IGZvciByZXNldHRpbmcgYW4gYXV0aGVudGljYXRpb24gc2VjcmV0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2NoZW1lIC0gYXV0aGVudGljYXRpb24gc2NoZW1lIHRvIHJlc2V0LlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kIC0gbWV0aG9kIHRvIHVzZSBmb3IgcmVzZXR0aW5nIHRoZSBzZWNyZXQsIHN1Y2ggYXMgXCJlbWFpbFwiIG9yIFwidGVsXCIuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIHZhbHVlIG9mIHRoZSBjcmVkZW50aWFsIHRvIHVzZSwgYSBzcGVjaWZpYyBlbWFpbCBhZGRyZXNzIG9yIGEgcGhvbmUgbnVtYmVyLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyB0aGUgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgcmVxdWVzdFJlc2V0QXV0aFNlY3JldDogZnVuY3Rpb24oc2NoZW1lLCBtZXRob2QsIHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMubG9naW4oJ3Jlc2V0JywgYjY0RW5jb2RlVW5pY29kZShzY2hlbWUgKyAnOicgKyBtZXRob2QgKyAnOicgKyB2YWx1ZSkpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBAdHlwZWRlZiBBdXRoVG9rZW5cbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJvcGVydHkge3N0cmluZ30gdG9rZW4gLSBUb2tlbiB2YWx1ZS5cbiAgICogQHByb3BlcnR5IHtEYXRlfSBleHBpcmVzIC0gVG9rZW4gZXhwaXJhdGlvbiB0aW1lLlxuICAgKi9cbiAgLyoqXG4gICAqIEdldCBzdG9yZWQgYXV0aGVudGljYXRpb24gdG9rZW4uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuQXV0aFRva2VufSBhdXRoZW50aWNhdGlvbiB0b2tlbi5cbiAgICovXG4gIGdldEF1dGhUb2tlbjogZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuX2F1dGhUb2tlbiAmJiAodGhpcy5fYXV0aFRva2VuLmV4cGlyZXMuZ2V0VGltZSgpID4gRGF0ZS5ub3coKSkpIHtcbiAgICAgIHJldHVybiB0aGlzLl9hdXRoVG9rZW47XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2F1dGhUb2tlbiA9IG51bGw7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9LFxuXG4gIC8qKlxuICAgKiBBcHBsaWNhdGlvbiBtYXkgcHJvdmlkZSBhIHNhdmVkIGF1dGhlbnRpY2F0aW9uIHRva2VuLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5BdXRoVG9rZW59IHRva2VuIC0gYXV0aGVudGljYXRpb24gdG9rZW4uXG4gICAqL1xuICBzZXRBdXRoVG9rZW46IGZ1bmN0aW9uKHRva2VuKSB7XG4gICAgdGhpcy5fYXV0aFRva2VuID0gdG9rZW47XG4gIH0sXG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIFNldFBhcmFtc1xuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBwcm9wZXJ0eSB7VGlub2RlLlNldERlc2M9fSBkZXNjIC0gVG9waWMgaW5pdGlhbGl6YXRpb24gcGFyYW1ldGVycyB3aGVuIGNyZWF0aW5nIGEgbmV3IHRvcGljIG9yIGEgbmV3IHN1YnNjcmlwdGlvbi5cbiAgICogQHByb3BlcnR5IHtUaW5vZGUuU2V0U3ViPX0gc3ViIC0gU3Vic2NyaXB0aW9uIGluaXRpYWxpemF0aW9uIHBhcmFtZXRlcnMuXG4gICAqL1xuICAvKipcbiAgICogQHR5cGVkZWYgU2V0RGVzY1xuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBwcm9wZXJ0eSB7VGlub2RlLkRlZkFjcz19IGRlZmFjcyAtIERlZmF1bHQgYWNjZXNzIG1vZGUuXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0PX0gcHVibGljIC0gRnJlZS1mb3JtIHRvcGljIGRlc2NyaXB0aW9uLCBwdWJsaWNhbGx5IGFjY2Vzc2libGUuXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0PX0gcHJpdmF0ZSAtIEZyZWUtZm9ybSB0b3BpYyBkZXNjcmlwdGlvbmFjY2Vzc2libGUgb25seSB0byB0aGUgb3duZXIuXG4gICAqL1xuICAvKipcbiAgICogQHR5cGVkZWYgU2V0U3ViXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHByb3BlcnR5IHtzdHJpbmc9fSB1c2VyIC0gVUlEIG9mIHRoZSB1c2VyIGFmZmVjdGVkIGJ5IHRoZSByZXF1ZXN0LiBEZWZhdWx0IChlbXB0eSkgLSBjdXJyZW50IHVzZXIuXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nPX0gbW9kZSAtIFVzZXIgYWNjZXNzIG1vZGUsIGVpdGhlciByZXF1ZXN0ZWQgb3IgYXNzaWduZWQgZGVwZW5kZW50IG9uIGNvbnRleHQuXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0PX0gaW5mbyAtIEZyZWUtZm9ybSBwYXlsb2FkIHRvIHBhc3MgdG8gdGhlIGludml0ZWQgdXNlciBvciB0b3BpYyBtYW5hZ2VyLlxuICAgKi9cbiAgLyoqXG4gICAqIFBhcmFtZXRlcnMgcGFzc2VkIHRvIHtAbGluayBUaW5vZGUjc3Vic2NyaWJlfS5cbiAgICpcbiAgICogQHR5cGVkZWYgU3Vic2NyaXB0aW9uUGFyYW1zXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHByb3BlcnR5IHtUaW5vZGUuU2V0UGFyYW1zPX0gc2V0IC0gUGFyYW1ldGVycyB1c2VkIHRvIGluaXRpYWxpemUgdG9waWNcbiAgICogQHByb3BlcnR5IHtUaW5vZGUuR2V0UXVlcnk9fSBnZXQgLSBRdWVyeSBmb3IgZmV0Y2hpbmcgZGF0YSBmcm9tIHRvcGljLlxuICAgKi9cblxuICAvKipcbiAgICogU2VuZCBhIHRvcGljIHN1YnNjcmlwdGlvbiByZXF1ZXN0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWMgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byBzdWJzY3JpYmUgdG8uXG4gICAqIEBwYXJhbSB7VGlub2RlLkdldFF1ZXJ5PX0gZ2V0UGFyYW1zIC0gT3B0aW9uYWwgc3Vic2NyaXB0aW9uIG1ldGFkYXRhIHF1ZXJ5XG4gICAqIEBwYXJhbSB7VGlub2RlLlNldFBhcmFtcz19IHNldFBhcmFtcyAtIE9wdGlvbmFsIGluaXRpYWxpemF0aW9uIHBhcmFtZXRlcnNcbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgc3Vic2NyaWJlOiBmdW5jdGlvbih0b3BpY05hbWUsIGdldFBhcmFtcywgc2V0UGFyYW1zKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy5pbml0UGFja2V0KCdzdWInLCB0b3BpY05hbWUpXG4gICAgaWYgKCF0b3BpY05hbWUpIHtcbiAgICAgIHRvcGljTmFtZSA9IFRPUElDX05FVztcbiAgICB9XG5cbiAgICBwa3Quc3ViLmdldCA9IGdldFBhcmFtcztcblxuICAgIGlmIChzZXRQYXJhbXMpIHtcbiAgICAgIGlmIChzZXRQYXJhbXMuc3ViKSB7XG4gICAgICAgIHBrdC5zdWIuc2V0LnN1YiA9IHNldFBhcmFtcy5zdWI7XG4gICAgICB9XG5cbiAgICAgIGlmIChzZXRQYXJhbXMuZGVzYykge1xuICAgICAgICBpZiAoVGlub2RlLmlzTmV3R3JvdXBUb3BpY05hbWUodG9waWNOYW1lKSkge1xuICAgICAgICAgIC8vIEZ1bGwgc2V0LmRlc2MgcGFyYW1zIGFyZSB1c2VkIGZvciBuZXcgdG9waWNzIG9ubHlcbiAgICAgICAgICBwa3Quc3ViLnNldC5kZXNjID0gc2V0UGFyYW1zLmRlc2M7XG4gICAgICAgIH0gZWxzZSBpZiAoVGlub2RlLmlzUDJQVG9waWNOYW1lKHRvcGljTmFtZSkgJiYgc2V0UGFyYW1zLmRlc2MuZGVmYWNzKSB7XG4gICAgICAgICAgLy8gVXNlIG9wdGlvbmFsIGRlZmF1bHQgcGVybWlzc2lvbnMgb25seS5cbiAgICAgICAgICBwa3Quc3ViLnNldC5kZXNjID0ge1xuICAgICAgICAgICAgZGVmYWNzOiBzZXRQYXJhbXMuZGVzYy5kZWZhY3NcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChzZXRQYXJhbXMudGFncykge1xuICAgICAgICBwa3Quc3ViLnNldC50YWdzID0gc2V0UGFyYW1zLnRhZ3M7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuc2VuZChwa3QsIHBrdC5zdWIuaWQpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBEZXRhY2ggYW5kIG9wdGlvbmFsbHkgdW5zdWJzY3JpYmUgZnJvbSB0aGUgdG9waWNcbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljIC0gVG9waWMgdG8gZGV0YWNoIGZyb20uXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gdW5zdWIgLSBJZiA8Y29kZT50cnVlPC9jb2RlPiwgZGV0YWNoIGFuZCB1bnN1YnNjcmliZSwgb3RoZXJ3aXNlIGp1c3QgZGV0YWNoLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICBsZWF2ZTogZnVuY3Rpb24odG9waWMsIHVuc3ViKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy5pbml0UGFja2V0KCdsZWF2ZScsIHRvcGljKTtcbiAgICBwa3QubGVhdmUudW5zdWIgPSB1bnN1YjtcblxuICAgIHJldHVybiB0aGlzLnNlbmQocGt0LCBwa3QubGVhdmUuaWQpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDcmVhdGUgbWVzc2FnZSBkcmFmdCB3aXRob3V0IHNlbmRpbmcgaXQgdG8gdGhlIHNlcnZlci5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gcHVibGlzaCB0by5cbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgLSBQYXlsb2FkIHRvIHB1Ymxpc2guXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IG5vRWNobyAtIElmIDxjb2RlPnRydWU8L2NvZGU+LCB0ZWxsIHRoZSBzZXJ2ZXIgbm90IHRvIGVjaG8gdGhlIG1lc3NhZ2UgdG8gdGhlIG9yaWdpbmFsIHNlc3Npb24uXG4gICAqXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IG5ldyBtZXNzYWdlIHdoaWNoIGNhbiBiZSBzZW50IHRvIHRoZSBzZXJ2ZXIgb3Igb3RoZXJ3aXNlIHVzZWQuXG4gICAqL1xuICBjcmVhdGVNZXNzYWdlOiBmdW5jdGlvbih0b3BpYywgZGF0YSwgbm9FY2hvKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy5pbml0UGFja2V0KCdwdWInLCB0b3BpYyk7XG5cbiAgICBsZXQgZGZ0ID0gdHlwZW9mIGRhdGEgPT0gJ3N0cmluZycgPyBEcmFmdHkucGFyc2UoZGF0YSkgOiBkYXRhO1xuICAgIGlmIChkZnQgJiYgIURyYWZ0eS5pc1BsYWluVGV4dChkZnQpKSB7XG4gICAgICBwa3QucHViLmhlYWQgPSB7XG4gICAgICAgIG1pbWU6IERyYWZ0eS5nZXRDb250ZW50VHlwZSgpXG4gICAgICB9O1xuICAgICAgZGF0YSA9IGRmdDtcbiAgICB9XG4gICAgcGt0LnB1Yi5ub2VjaG8gPSBub0VjaG87XG4gICAgcGt0LnB1Yi5jb250ZW50ID0gZGF0YTtcblxuICAgIHJldHVybiBwa3QucHViO1xuICB9LFxuXG4gIC8qKlxuICAgKiBQdWJsaXNoIHtkYXRhfSBtZXNzYWdlIHRvIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWMgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byBwdWJsaXNoIHRvLlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSAtIFBheWxvYWQgdG8gcHVibGlzaC5cbiAgICogQHBhcmFtIHtib29sZWFuPX0gbm9FY2hvIC0gSWYgPGNvZGU+dHJ1ZTwvY29kZT4sIHRlbGwgdGhlIHNlcnZlciBub3QgdG8gZWNobyB0aGUgbWVzc2FnZSB0byB0aGUgb3JpZ2luYWwgc2Vzc2lvbi5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgcHVibGlzaDogZnVuY3Rpb24odG9waWMsIGRhdGEsIG5vRWNobykge1xuICAgIHJldHVybiB0aGlzLnB1Ymxpc2hNZXNzYWdlKFxuICAgICAgdGhpcy5jcmVhdGVNZXNzYWdlKHRvcGljLCBkYXRhLCBub0VjaG8pXG4gICAgKTtcbiAgfSxcblxuICAvKipcbiAgICogUHVibGlzaCBtZXNzYWdlIHRvIHRvcGljLiBUaGUgbWVzc2FnZSBzaG91bGQgYmUgY3JlYXRlZCBieSB7QGxpbmsgVGlub2RlI2NyZWF0ZU1lc3NhZ2V9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcHViIC0gTWVzc2FnZSB0byBwdWJsaXNoLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICBwdWJsaXNoTWVzc2FnZTogZnVuY3Rpb24ocHViKSB7XG4gICAgLy8gTWFrZSBhIHNoYWxsb3cgY29weS4gTmVlZGVkIGluIG9yZGVyIHRvIGNsZWFyIGxvY2FsbHktYXNzaWduZWQgdGVtcCB2YWx1ZXM7XG4gICAgcHViID0gT2JqZWN0LmFzc2lnbih7fSwgcHViKTtcbiAgICBwdWIuc2VxID0gdW5kZWZpbmVkO1xuICAgIHB1Yi5mcm9tID0gdW5kZWZpbmVkO1xuICAgIHB1Yi50cyA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gdGhpcy5zZW5kKHtcbiAgICAgIHB1YjogcHViXG4gICAgfSwgcHViLmlkKTtcbiAgfSxcblxuICAvKipcbiAgICogT3V0IG9mIGJhbmQgbm90aWZpY2F0aW9uOiBub3RpZnkgdG9waWMgdGhhdCBhbiBleHRlcm5hbCAocHVzaCkgbm90aWZpY2F0aW9uIHdhcyByZWNpdmVkIGJ5IHRoZSBjbGllbnQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBuYW1lIG9mIHRoZSB1cGRhdGVkIHRvcGljLlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2VxIC0gc2VxIElEIG9mIHRoZSBuZXcgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtzdHJpbmc9fSBhY3QgLSBVSUQgb2YgdGhlIHNlbmRlcjsgZGVmYXVsdCBpcyBjdXJyZW50LlxuICAgKi9cbiAgb29iTm90aWZpY2F0aW9uOiBmdW5jdGlvbih0b3BpY05hbWUsIHNlcSwgYWN0KSB7XG4gICAgY29uc3QgdG9waWMgPSB0aGlzLmNhY2hlR2V0KCd0b3BpYycsIHRvcGljTmFtZSk7XG4gICAgaWYgKHRvcGljKSB7XG4gICAgICB0b3BpYy5fdXBkYXRlUmVjZWl2ZWQoc2VxLCBhY3QpO1xuICAgICAgdGhpcy5nZXRNZVRvcGljKCkuX3JlZnJlc2hDb250YWN0KCdtc2cnLCB0b3BpYyk7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBAdHlwZWRlZiBHZXRRdWVyeVxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBwcm9wZXJ0eSB7VGlub2RlLkdldE9wdHNUeXBlPX0gZGVzYyAtIElmIHByb3ZpZGVkIChldmVuIGlmIGVtcHR5KSwgZmV0Y2ggdG9waWMgZGVzY3JpcHRpb24uXG4gICAqIEBwcm9wZXJ0eSB7VGlub2RlLkdldE9wdHNUeXBlPX0gc3ViIC0gSWYgcHJvdmlkZWQgKGV2ZW4gaWYgZW1wdHkpLCBmZXRjaCB0b3BpYyBzdWJzY3JpcHRpb25zLlxuICAgKiBAcHJvcGVydHkge1Rpbm9kZS5HZXREYXRhVHlwZT19IGRhdGEgLSBJZiBwcm92aWRlZCAoZXZlbiBpZiBlbXB0eSksIGdldCBtZXNzYWdlcy5cbiAgICovXG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIEdldE9wdHNUeXBlXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHByb3BlcnR5IHtEYXRlPX0gaW1zIC0gXCJJZiBtb2RpZmllZCBzaW5jZVwiLCBmZXRjaCBkYXRhIG9ubHkgaXQgd2FzIHdhcyBtb2RpZmllZCBzaW5jZSBzdGF0ZWQgZGF0ZS5cbiAgICogQHByb3BlcnR5IHtudW1iZXI9fSBsaW1pdCAtIE1heGltdW0gbnVtYmVyIG9mIHJlc3VsdHMgdG8gcmV0dXJuLiBJZ25vcmVkIHdoZW4gcXVlcnlpbmcgdG9waWMgZGVzY3JpcHRpb24uXG4gICAqL1xuXG4gIC8qKlxuICAgKiBAdHlwZWRlZiBHZXREYXRhVHlwZVxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyPX0gc2luY2UgLSBMb2FkIG1lc3NhZ2VzIHdpdGggc2VxIGlkIGVxdWFsIG9yIGdyZWF0ZXIgdGhhbiB0aGlzIHZhbHVlLlxuICAgKiBAcHJvcGVydHkge251bWJlcj19IGJlZm9yZSAtIExvYWQgbWVzc2FnZXMgd2l0aCBzZXEgaWQgbG93ZXIgdGhhbiB0aGlzIG51bWJlci5cbiAgICogQHByb3BlcnR5IHtudW1iZXI9fSBsaW1pdCAtIE1heGltdW0gbnVtYmVyIG9mIHJlc3VsdHMgdG8gcmV0dXJuLlxuICAgKi9cblxuICAvKipcbiAgICogUmVxdWVzdCB0b3BpYyBtZXRhZGF0YVxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWMgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byBxdWVyeS5cbiAgICogQHBhcmFtIHtUaW5vZGUuR2V0UXVlcnl9IHBhcmFtcyAtIFBhcmFtZXRlcnMgb2YgdGhlIHF1ZXJ5LiBVc2Uge0BsaW5rIFRpbm9kZS5NZXRhR2V0QnVpbGRlcn0gdG8gZ2VuZXJhdGUuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIGdldE1ldGE6IGZ1bmN0aW9uKHRvcGljLCBwYXJhbXMpIHtcbiAgICBjb25zdCBwa3QgPSB0aGlzLmluaXRQYWNrZXQoJ2dldCcsIHRvcGljKTtcblxuICAgIHBrdC5nZXQgPSBtZXJnZU9iaihwa3QuZ2V0LCBwYXJhbXMpO1xuXG4gICAgcmV0dXJuIHRoaXMuc2VuZChwa3QsIHBrdC5nZXQuaWQpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBVcGRhdGUgdG9waWMncyBtZXRhZGF0YTogZGVzY3JpcHRpb24sIHN1YnNjcmlidGlvbnMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpYyAtIFRvcGljIHRvIHVwZGF0ZS5cbiAgICogQHBhcmFtIHtUaW5vZGUuU2V0UGFyYW1zfSBwYXJhbXMgLSB0b3BpYyBtZXRhZGF0YSB0byB1cGRhdGUuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIHNldE1ldGE6IGZ1bmN0aW9uKHRvcGljLCBwYXJhbXMpIHtcbiAgICBjb25zdCBwa3QgPSB0aGlzLmluaXRQYWNrZXQoJ3NldCcsIHRvcGljKTtcbiAgICBjb25zdCB3aGF0ID0gW107XG5cbiAgICBpZiAocGFyYW1zKSB7XG4gICAgICBbJ2Rlc2MnLCAnc3ViJywgJ3RhZ3MnLCAnY3JlZCddLm1hcChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgaWYgKHBhcmFtcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgd2hhdC5wdXNoKGtleSk7XG4gICAgICAgICAgcGt0LnNldFtrZXldID0gcGFyYW1zW2tleV07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICh3aGF0Lmxlbmd0aCA9PSAwKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiSW52YWxpZCB7c2V0fSBwYXJhbWV0ZXJzXCIpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5zZW5kKHBrdCwgcGt0LnNldC5pZCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJhbmdlIG9mIG1lc3NhZ2UgSURzIHRvIGRlbGV0ZS5cbiAgICpcbiAgICogQHR5cGVkZWYgRGVsUmFuZ2VcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAcHJvcGVydHkge251bWJlcn0gbG93IC0gbG93IGVuZCBvZiB0aGUgcmFuZ2UsIGluY2x1c2l2ZSAoY2xvc2VkKS5cbiAgICogQHByb3BlcnR5IHtudW1iZXI9fSBoaSAtIGhpZ2ggZW5kIG9mIHRoZSByYW5nZSwgZXhjbHVzaXZlIChvcGVuKS5cbiAgICovXG4gIC8qKlxuICAgKiBEZWxldGUgc29tZSBvciBhbGwgbWVzc2FnZXMgaW4gYSB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljIC0gVG9waWMgbmFtZSB0byBkZWxldGUgbWVzc2FnZXMgZnJvbS5cbiAgICogQHBhcmFtIHtUaW5vZGUuRGVsUmFuZ2VbXX0gbGlzdCAtIFJhbmdlcyBvZiBtZXNzYWdlIElEcyB0byBkZWxldGUuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IGhhcmQgLSBIYXJkIG9yIHNvZnQgZGVsZXRlXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIGRlbE1lc3NhZ2VzOiBmdW5jdGlvbih0b3BpYywgcmFuZ2VzLCBoYXJkKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy5pbml0UGFja2V0KCdkZWwnLCB0b3BpYyk7XG5cbiAgICBwa3QuZGVsLndoYXQgPSAnbXNnJztcbiAgICBwa3QuZGVsLmRlbHNlcSA9IHJhbmdlcztcbiAgICBwa3QuZGVsLmhhcmQgPSBoYXJkO1xuXG4gICAgcmV0dXJuIHRoaXMuc2VuZChwa3QsIHBrdC5kZWwuaWQpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBEZWxldGUgdGhlIHRvcGljIGFsbHRvZ2V0aGVyLiBSZXF1aXJlcyBPd25lciBwZXJtaXNzaW9uLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gZGVsZXRlXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gaGFyZCAtIGhhcmQtZGVsZXRlIHRvcGljLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICBkZWxUb3BpYzogZnVuY3Rpb24odG9waWNOYW1lLCBoYXJkKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy5pbml0UGFja2V0KCdkZWwnLCB0b3BpY05hbWUpO1xuICAgIHBrdC5kZWwud2hhdCA9ICd0b3BpYyc7XG4gICAgcGt0LmRlbC5oYXJkID0gaGFyZDtcblxuICAgIHJldHVybiB0aGlzLnNlbmQocGt0LCBwa3QuZGVsLmlkKTtcbiAgfSxcblxuICAvKipcbiAgICogRGVsZXRlIHN1YnNjcmlwdGlvbi4gUmVxdWlyZXMgU2hhcmUgcGVybWlzc2lvbi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIGRlbGV0ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXNlciAtIFVzZXIgSUQgdG8gcmVtb3ZlLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICBkZWxTdWJzY3JpcHRpb246IGZ1bmN0aW9uKHRvcGljTmFtZSwgdXNlcikge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuaW5pdFBhY2tldCgnZGVsJywgdG9waWNOYW1lKTtcbiAgICBwa3QuZGVsLndoYXQgPSAnc3ViJztcbiAgICBwa3QuZGVsLnVzZXIgPSB1c2VyO1xuXG4gICAgcmV0dXJuIHRoaXMuc2VuZChwa3QsIHBrdC5kZWwuaWQpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBEZWxldGUgY3JlZGVudGlhbC4gQWx3YXlzIHNlbnQgb24gPGNvZGU+J21lJzwvY29kZT4gdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2QgLSB2YWxpZGF0aW9uIG1ldGhvZCBzdWNoIGFzIDxjb2RlPidlbWFpbCc8L2NvZGU+IG9yIDxjb2RlPid0ZWwnPC9jb2RlPi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIC0gdmFsaWRhdGlvbiB2YWx1ZSwgaS5lLiA8Y29kZT4nYWxpY2VAZXhhbXBsZS5jb20nPC9jb2RlPi5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgZGVsQ3JlZGVudGlhbDogZnVuY3Rpb24obWV0aG9kLCB2YWx1ZSkge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuaW5pdFBhY2tldCgnZGVsJywgVE9QSUNfTUUpO1xuICAgIHBrdC5kZWwud2hhdCA9ICdjcmVkJztcbiAgICBwa3QuZGVsLmNyZWQgPSB7XG4gICAgICBtZXRoOiBtZXRob2QsXG4gICAgICB2YWw6IHZhbHVlXG4gICAgfTtcblxuICAgIHJldHVybiB0aGlzLnNlbmQocGt0LCBwa3QuZGVsLmlkKTtcbiAgfSxcblxuICAvKipcbiAgICogUmVxdWVzdCB0byBkZWxldGUgYWNjb3VudCBvZiB0aGUgY3VycmVudCB1c2VyLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGhhcmQgLSBoYXJkLWRlbGV0ZSB1c2VyLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICBkZWxDdXJyZW50VXNlcjogZnVuY3Rpb24oaGFyZCkge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuaW5pdFBhY2tldCgnZGVsJywgbnVsbCk7XG4gICAgcGt0LmRlbC53aGF0ID0gJ3VzZXInO1xuICAgIHBrdC5kZWwuaGFyZCA9IGhhcmQ7XG5cbiAgICByZXR1cm4gdGhpcy5zZW5kKHBrdCwgcGt0LmRlbC5pZCkudGhlbigoY3RybCkgPT4ge1xuICAgICAgdGhpcy5fbXlVSUQgPSBudWxsO1xuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBOb3RpZnkgc2VydmVyIHRoYXQgYSBtZXNzYWdlIG9yIG1lc3NhZ2VzIHdlcmUgcmVhZCBvciByZWNlaXZlZC4gRG9lcyBOT1QgcmV0dXJuIHByb21pc2UuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB3aGVyZSB0aGUgbWVzYWdlIGlzIGJlaW5nIGFrbm93bGVkZ2VkLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gd2hhdCAtIEFjdGlvbiBiZWluZyBha25vd2xlZGdlZCwgZWl0aGVyIDxjb2RlPlwicmVhZFwiPC9jb2RlPiBvciA8Y29kZT5cInJlY3ZcIjwvY29kZT4uXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXEgLSBNYXhpbXVtIGlkIG9mIHRoZSBtZXNzYWdlIGJlaW5nIGFja25vd2xlZGdlZC5cbiAgICovXG4gIG5vdGU6IGZ1bmN0aW9uKHRvcGljTmFtZSwgd2hhdCwgc2VxKSB7XG4gICAgaWYgKHNlcSA8PSAwIHx8IHNlcSA+PSBMT0NBTF9TRVFJRCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIG1lc3NhZ2UgaWQgJHtzZXF9YCk7XG4gICAgfVxuXG4gICAgY29uc3QgcGt0ID0gdGhpcy5pbml0UGFja2V0KCdub3RlJywgdG9waWNOYW1lKTtcbiAgICBwa3Qubm90ZS53aGF0ID0gd2hhdDtcbiAgICBwa3Qubm90ZS5zZXEgPSBzZXE7XG4gICAgdGhpcy5zZW5kKHBrdCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEJyb2FkY2FzdCBhIGtleS1wcmVzcyBub3RpZmljYXRpb24gdG8gdG9waWMgc3Vic2NyaWJlcnMuIFVzZWQgdG8gc2hvd1xuICAgKiB0eXBpbmcgbm90aWZpY2F0aW9ucyBcInVzZXIgWCBpcyB0eXBpbmcuLi5cIi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljTmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIGJyb2FkY2FzdCB0by5cbiAgICovXG4gIG5vdGVLZXlQcmVzczogZnVuY3Rpb24odG9waWNOYW1lKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy5pbml0UGFja2V0KCdub3RlJywgdG9waWNOYW1lKTtcbiAgICBwa3Qubm90ZS53aGF0ID0gJ2twJztcbiAgICB0aGlzLnNlbmQocGt0KTtcbiAgfSxcblxuICAvKipcbiAgICogR2V0IGEgbmFtZWQgdG9waWMsIGVpdGhlciBwdWxsIGl0IGZyb20gY2FjaGUgb3IgY3JlYXRlIGEgbmV3IGluc3RhbmNlLlxuICAgKiBUaGVyZSBpcyBhIHNpbmdsZSBpbnN0YW5jZSBvZiB0b3BpYyBmb3IgZWFjaCBuYW1lLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNOYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gZ2V0LlxuICAgKiBAcmV0dXJucyB7VGlub2RlLlRvcGljfSBSZXF1ZXN0ZWQgb3IgbmV3bHkgY3JlYXRlZCB0b3BpYyBvciA8Y29kZT51bmRlZmluZWQ8L2NvZGU+IGlmIHRvcGljIG5hbWUgaXMgaW52YWxpZC5cbiAgICovXG4gIGdldFRvcGljOiBmdW5jdGlvbih0b3BpY05hbWUpIHtcbiAgICBsZXQgdG9waWMgPSB0aGlzLmNhY2hlR2V0KCd0b3BpYycsIHRvcGljTmFtZSk7XG4gICAgaWYgKCF0b3BpYyAmJiB0b3BpY05hbWUpIHtcbiAgICAgIGlmICh0b3BpY05hbWUgPT0gVE9QSUNfTUUpIHtcbiAgICAgICAgdG9waWMgPSBuZXcgVG9waWNNZSgpO1xuICAgICAgfSBlbHNlIGlmICh0b3BpY05hbWUgPT0gVE9QSUNfRk5EKSB7XG4gICAgICAgIHRvcGljID0gbmV3IFRvcGljRm5kKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0b3BpYyA9IG5ldyBUb3BpYyh0b3BpY05hbWUpO1xuICAgICAgfVxuICAgICAgLy8gQ2FjaGUgbWFuYWdlbWVudC5cbiAgICAgIHRoaXMuX2RiLnVwZFRvcGljKHRvcGljKTtcbiAgICAgIHRoaXMuYXR0YWNoQ2FjaGVUb1RvcGljKHRvcGljKTtcbiAgICAgIHRvcGljLl9jYWNoZVB1dFNlbGYoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRvcGljO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBuYW1lZCB0b3BpYyBpcyBhbHJlYWR5IHByZXNlbnQgaW4gY2FjaGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY05hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdG9waWMgaXMgZm91bmQgaW4gY2FjaGUsIGZhbHNlIG90ZXJ3aXNlLlxuICAgKi9cbiAgaXNUb3BpY0NhY2hlZDogZnVuY3Rpb24odG9waWNOYW1lKSB7XG4gICAgcmV0dXJuICEhdGhpcy5jYWNoZUdldCgndG9waWMnLCB0b3BpY05hbWUpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZSB1bmlxdWUgbmFtZSBsaWtlIDxjb2RlPiduZXcxMjM0NTYnPC9jb2RlPiBzdWl0YWJsZSBmb3IgY3JlYXRpbmcgYSBuZXcgZ3JvdXAgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNDaGFuIC0gaWYgdGhlIHRvcGljIGlzIGNoYW5uZWwtZW5hYmxlZC5cbiAgICogQHJldHVybnMge3N0cmluZ30gbmFtZSB3aGljaCBjYW4gYmUgdXNlZCBmb3IgY3JlYXRpbmcgYSBuZXcgZ3JvdXAgdG9waWMuXG4gICAqL1xuICBuZXdHcm91cFRvcGljTmFtZTogZnVuY3Rpb24oaXNDaGFuKSB7XG4gICAgcmV0dXJuIChpc0NoYW4gPyBUT1BJQ19ORVdfQ0hBTiA6IFRPUElDX05FVykgKyB0aGlzLmdldE5leHRVbmlxdWVJZCgpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBJbnN0YW50aWF0ZSA8Y29kZT4nbWUnPC9jb2RlPiB0b3BpYyBvciBnZXQgaXQgZnJvbSBjYWNoZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5Ub3BpY01lfSBJbnN0YW5jZSBvZiA8Y29kZT4nbWUnPC9jb2RlPiB0b3BpYy5cbiAgICovXG4gIGdldE1lVG9waWM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmdldFRvcGljKFRPUElDX01FKTtcbiAgfSxcblxuICAvKipcbiAgICogSW5zdGFudGlhdGUgPGNvZGU+J2ZuZCc8L2NvZGU+IChmaW5kKSB0b3BpYyBvciBnZXQgaXQgZnJvbSBjYWNoZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5Ub3BpY30gSW5zdGFuY2Ugb2YgPGNvZGU+J2ZuZCc8L2NvZGU+IHRvcGljLlxuICAgKi9cbiAgZ2V0Rm5kVG9waWM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmdldFRvcGljKFRPUElDX0ZORCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyB7QGxpbmsgTGFyZ2VGaWxlSGVscGVyfSBpbnN0YW5jZVxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLkxhcmdlRmlsZUhlbHBlcn0gaW5zdGFuY2Ugb2YgYSB7QGxpbmsgVGlub2RlLkxhcmdlRmlsZUhlbHBlcn0uXG4gICAqL1xuICBnZXRMYXJnZUZpbGVIZWxwZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgTGFyZ2VGaWxlSGVscGVyKHRoaXMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIFVJRCBvZiB0aGUgdGhlIGN1cnJlbnQgYXV0aGVudGljYXRlZCB1c2VyLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBVSUQgb2YgdGhlIGN1cnJlbnQgdXNlciBvciA8Y29kZT51bmRlZmluZWQ8L2NvZGU+IGlmIHRoZSBzZXNzaW9uIGlzIG5vdCB5ZXQgYXV0aGVudGljYXRlZCBvciBpZiB0aGVyZSBpcyBubyBzZXNzaW9uLlxuICAgKi9cbiAgZ2V0Q3VycmVudFVzZXJJRDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX215VUlEO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgZ2l2ZW4gdXNlciBJRCBpcyBlcXVhbCB0byB0aGUgY3VycmVudCB1c2VyJ3MgVUlELlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gVUlEIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGUgZ2l2ZW4gVUlEIGJlbG9uZ3MgdG8gdGhlIGN1cnJlbnQgbG9nZ2VkIGluIHVzZXIuXG4gICAqL1xuICBpc01lOiBmdW5jdGlvbih1aWQpIHtcbiAgICByZXR1cm4gdGhpcy5fbXlVSUQgPT09IHVpZDtcbiAgfSxcblxuICAvKipcbiAgICogR2V0IGxvZ2luIHVzZWQgZm9yIGxhc3Qgc3VjY2Vzc2Z1bCBhdXRoZW50aWNhdGlvbi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICogQHJldHVybnMge3N0cmluZ30gbG9naW4gbGFzdCB1c2VkIHN1Y2Nlc3NmdWxseSBvciA8Y29kZT51bmRlZmluZWQ8L2NvZGU+LlxuICAgKi9cbiAgZ2V0Q3VycmVudExvZ2luOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fbG9naW47XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJldHVybiBpbmZvcm1hdGlvbiBhYm91dCB0aGUgc2VydmVyOiBwcm90b2NvbCB2ZXJzaW9uIGFuZCBidWlsZCB0aW1lc3RhbXAuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IGJ1aWxkIGFuZCB2ZXJzaW9uIG9mIHRoZSBzZXJ2ZXIgb3IgPGNvZGU+bnVsbDwvY29kZT4gaWYgdGhlcmUgaXMgbm8gY29ubmVjdGlvbiBvciBpZiB0aGUgZmlyc3Qgc2VydmVyIHJlc3BvbnNlIGhhcyBub3QgYmVlbiByZWNlaXZlZCB5ZXQuXG4gICAqL1xuICBnZXRTZXJ2ZXJJbmZvOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fc2VydmVySW5mbztcbiAgfSxcblxuICAvKipcbiAgICogUmV0dXJuIHNlcnZlci1wcm92aWRlZCBjb25maWd1cmF0aW9uIHZhbHVlIChsb25nIGludGVnZXIpLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBvZiB0aGUgdmFsdWUgdG8gcmV0dXJuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkZWZhdWx0VmFsdWUgdG8gcmV0dXJuIGluIGNhc2Ugc2VydmVyIGxpbWl0IGlzIG5vdCBzZXQgb3Igbm90IGZvdW5kLlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBuYW1lZCB2YWx1ZS5cbiAgICovXG4gIGdldFNlcnZlckxpbWl0OiBmdW5jdGlvbihuYW1lLCBkZWZhdWx0VmFsdWUpIHtcbiAgICByZXR1cm4gKHRoaXMuX3NlcnZlckluZm8gPyB0aGlzLl9zZXJ2ZXJJbmZvW25hbWVdIDogbnVsbCkgfHwgZGVmYXVsdFZhbHVlO1xuICB9LFxuXG4gIC8qKlxuICAgKiBUb2dnbGUgY29uc29sZSBsb2dnaW5nLiBMb2dnaW5nIGlzIG9mZiBieSBkZWZhdWx0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZWQgLSBTZXQgdG8gPGNvZGU+dHJ1ZTwvY29kZT4gdG8gZW5hYmxlIGxvZ2dpbmcgdG8gY29uc29sZS5cbiAgICogQHBhcmFtIHtib29sZWFufSB0cmltTG9uZ1N0cmluZ3MgLSBTZXQgdG8gPGNvZGU+dHJ1ZTwvY29kZT4gdG8gdHJpbSBsb25nIHN0cmluZ3MuXG4gICAqL1xuICBlbmFibGVMb2dnaW5nOiBmdW5jdGlvbihlbmFibGVkLCB0cmltTG9uZ1N0cmluZ3MpIHtcbiAgICB0aGlzLl9sb2dnaW5nRW5hYmxlZCA9IGVuYWJsZWQ7XG4gICAgdGhpcy5fdHJpbUxvbmdTdHJpbmdzID0gZW5hYmxlZCAmJiB0cmltTG9uZ1N0cmluZ3M7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNldCBVSSBsYW5ndWFnZSB0byByZXBvcnQgdG8gdGhlIHNlcnZlci4gTXVzdCBiZSBjYWxsZWQgYmVmb3JlIDxjb2RlPidoaSc8L2NvZGU+IGlzIHNlbnQsIG90aGVyd2lzZSBpdCB3aWxsIG5vdCBiZSB1c2VkLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaGwgLSBodW1hbiAoVUkpIGxhbmd1YWdlLCBsaWtlIDxjb2RlPlwiZW5fVVNcIjwvY29kZT4gb3IgPGNvZGU+XCJ6aC1IYW5zXCI8L2NvZGU+LlxuICAgKi9cbiAgc2V0SHVtYW5MYW5ndWFnZTogZnVuY3Rpb24oaGwpIHtcbiAgICBpZiAoaGwpIHtcbiAgICAgIHRoaXMuX2h1bWFuTGFuZ3VhZ2UgPSBobDtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGdpdmVuIHRvcGljIGlzIG9ubGluZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgb2YgdGhlIHRvcGljIHRvIHRlc3QuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIHRvcGljIGlzIG9ubGluZSwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNUb3BpY09ubGluZTogZnVuY3Rpb24obmFtZSkge1xuICAgIGNvbnN0IHRvcGljID0gdGhpcy5jYWNoZUdldCgndG9waWMnLCBuYW1lKTtcbiAgICByZXR1cm4gdG9waWMgJiYgdG9waWMub25saW5lO1xuICB9LFxuXG4gIC8qKlxuICAgKiBHZXQgYWNjZXNzIG1vZGUgZm9yIHRoZSBnaXZlbiBjb250YWN0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBvZiB0aGUgdG9waWMgdG8gcXVlcnkuXG4gICAqIEByZXR1cm5zIHtBY2Nlc3NNb2RlfSBhY2Nlc3MgbW9kZSBpZiB0b3BpYyBpcyBmb3VuZCwgbnVsbCBvdGhlcndpc2UuXG4gICAqL1xuICBnZXRUb3BpY0FjY2Vzc01vZGU6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBjb25zdCB0b3BpYyA9IHRoaXMuY2FjaGVHZXQoJ3RvcGljJywgbmFtZSk7XG4gICAgcmV0dXJuIHRvcGljID8gdG9waWMuYWNzIDogbnVsbDtcbiAgfSxcblxuICAvKipcbiAgICogSW5jbHVkZSBtZXNzYWdlIElEIGludG8gYWxsIHN1YnNlcXVlc3QgbWVzc2FnZXMgdG8gc2VydmVyIGluc3RydWN0aW4gaXQgdG8gc2VuZCBha25vd2xlZGdlbWVucy5cbiAgICogUmVxdWlyZWQgZm9yIHByb21pc2VzIHRvIGZ1bmN0aW9uLiBEZWZhdWx0IGlzIDxjb2RlPlwib25cIjwvY29kZT4uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gc3RhdHVzIC0gVHVybiBha25vd2xlZGdlbWVucyBvbiBvciBvZmYuXG4gICAqIEBkZXByZWNhdGVkXG4gICAqL1xuICB3YW50QWtuOiBmdW5jdGlvbihzdGF0dXMpIHtcbiAgICBpZiAoc3RhdHVzKSB7XG4gICAgICB0aGlzLl9tZXNzYWdlSWQgPSBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogMHhGRkZGRkYpICsgMHhGRkZGRkYpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9tZXNzYWdlSWQgPSAwO1xuICAgIH1cbiAgfSxcblxuICAvLyBDYWxsYmFja3M6XG4gIC8qKlxuICAgKiBDYWxsYmFjayB0byByZXBvcnQgd2hlbiB0aGUgd2Vic29ja2V0IGlzIG9wZW5lZC4gVGhlIGNhbGxiYWNrIGhhcyBubyBwYXJhbWV0ZXJzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKiBAdHlwZSB7VGlub2RlLm9uV2Vic29ja2V0T3Blbn1cbiAgICovXG4gIG9uV2Vic29ja2V0T3BlbjogdW5kZWZpbmVkLFxuXG4gIC8qKlxuICAgKiBAdHlwZWRlZiBUaW5vZGUuU2VydmVyUGFyYW1zXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IHZlciAtIFNlcnZlciB2ZXJzaW9uXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBidWlsZCAtIFNlcnZlciBidWlsZFxuICAgKiBAcHJvcGVydHkge3N0cmluZz19IHNpZCAtIFNlc3Npb24gSUQsIGxvbmcgcG9sbGluZyBjb25uZWN0aW9ucyBvbmx5LlxuICAgKi9cblxuICAvKipcbiAgICogQGNhbGxiYWNrIFRpbm9kZS5vbkNvbm5lY3RcbiAgICogQHBhcmFtIHtudW1iZXJ9IGNvZGUgLSBSZXN1bHQgY29kZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dCAtIFRleHQgZXB4cGxhaW5pbmcgdGhlIGNvbXBsZXRpb24sIGkuZSBcIk9LXCIgb3IgYW4gZXJyb3IgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtUaW5vZGUuU2VydmVyUGFyYW1zfSBwYXJhbXMgLSBQYXJhbWV0ZXJzIHJldHVybmVkIGJ5IHRoZSBzZXJ2ZXIuXG4gICAqL1xuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gcmVwb3J0IHdoZW4gY29ubmVjdGlvbiB3aXRoIFRpbm9kZSBzZXJ2ZXIgaXMgZXN0YWJsaXNoZWQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqIEB0eXBlIHtUaW5vZGUub25Db25uZWN0fVxuICAgKi9cbiAgb25Db25uZWN0OiB1bmRlZmluZWQsXG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIHRvIHJlcG9ydCB3aGVuIGNvbm5lY3Rpb24gaXMgbG9zdC4gVGhlIGNhbGxiYWNrIGhhcyBubyBwYXJhbWV0ZXJzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKiBAdHlwZSB7VGlub2RlLm9uRGlzY29ubmVjdH1cbiAgICovXG4gIG9uRGlzY29ubmVjdDogdW5kZWZpbmVkLFxuXG4gIC8qKlxuICAgKiBAY2FsbGJhY2sgVGlub2RlLm9uTG9naW5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGNvZGUgLSBOVW1lcmljIGNvbXBsZXRpb24gY29kZSwgc2FtZSBhcyBIVFRQIHN0YXR1cyBjb2Rlcy5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHRleHQgLSBFeHBsYW5hdGlvbiBvZiB0aGUgY29tcGxldGlvbiBjb2RlLlxuICAgKi9cbiAgLyoqXG4gICAqIENhbGxiYWNrIHRvIHJlcG9ydCBsb2dpbiBjb21wbGV0aW9uLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKiBAdHlwZSB7VGlub2RlLm9uTG9naW59XG4gICAqL1xuICBvbkxvZ2luOiB1bmRlZmluZWQsXG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIHRvIHJlY2VpdmUgPGNvZGU+e2N0cmx9PC9jb2RlPiAoY29udHJvbCkgbWVzc2FnZXMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqIEB0eXBlIHtUaW5vZGUub25DdHJsTWVzc2FnZX1cbiAgICovXG4gIG9uQ3RybE1lc3NhZ2U6IHVuZGVmaW5lZCxcblxuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gcmVjaWV2ZSA8Y29kZT57ZGF0YX08L2NvZGU+IChjb250ZW50KSBtZXNzYWdlcy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICogQHR5cGUge1Rpbm9kZS5vbkRhdGFNZXNzYWdlfVxuICAgKi9cbiAgb25EYXRhTWVzc2FnZTogdW5kZWZpbmVkLFxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0byByZWNlaXZlIDxjb2RlPntwcmVzfTwvY29kZT4gKHByZXNlbmNlKSBtZXNzYWdlcy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICogQHR5cGUge1Rpbm9kZS5vblByZXNNZXNzYWdlfVxuICAgKi9cbiAgb25QcmVzTWVzc2FnZTogdW5kZWZpbmVkLFxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0byByZWNlaXZlIGFsbCBtZXNzYWdlcyBhcyBvYmplY3RzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKiBAdHlwZSB7VGlub2RlLm9uTWVzc2FnZX1cbiAgICovXG4gIG9uTWVzc2FnZTogdW5kZWZpbmVkLFxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0byByZWNlaXZlIGFsbCBtZXNzYWdlcyBhcyB1bnBhcnNlZCB0ZXh0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKiBAdHlwZSB7VGlub2RlLm9uUmF3TWVzc2FnZX1cbiAgICovXG4gIG9uUmF3TWVzc2FnZTogdW5kZWZpbmVkLFxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0byByZWNlaXZlIHNlcnZlciByZXNwb25zZXMgdG8gbmV0d29yayBwcm9iZXMuIFNlZSB7QGxpbmsgVGlub2RlI25ldHdvcmtQcm9iZX1cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICogQHR5cGUge1Rpbm9kZS5vbk5ldHdvcmtQcm9iZX1cbiAgICovXG4gIG9uTmV0d29ya1Byb2JlOiB1bmRlZmluZWQsXG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIHRvIGJlIG5vdGlmaWVkIHdoZW4gZXhwb25lbnRpYWwgYmFja29mZiBpcyBpdGVyYXRpbmcuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqIEB0eXBlIHtUaW5vZGUub25BdXRvcmVjb25uZWN0SXRlcmF0aW9ufVxuICAgKi9cbiAgb25BdXRvcmVjb25uZWN0SXRlcmF0aW9uOiB1bmRlZmluZWQsXG59O1xuXG4vKipcbiAqIEhlbHBlciBjbGFzcyBmb3IgY29uc3RydWN0aW5nIHtAbGluayBUaW5vZGUuR2V0UXVlcnl9LlxuICpcbiAqIEBjbGFzcyBNZXRhR2V0QnVpbGRlclxuICogQG1lbWJlcm9mIFRpbm9kZVxuICpcbiAqIEBwYXJhbSB7VGlub2RlLlRvcGljfSBwYXJlbnQgdG9waWMgd2hpY2ggaW5zdGFudGlhdGVkIHRoaXMgYnVpbGRlci5cbiAqL1xudmFyIE1ldGFHZXRCdWlsZGVyID0gZnVuY3Rpb24ocGFyZW50KSB7XG4gIHRoaXMudG9waWMgPSBwYXJlbnQ7XG4gIHRoaXMud2hhdCA9IHt9O1xufVxuXG5NZXRhR2V0QnVpbGRlci5wcm90b3R5cGUgPSB7XG5cbiAgLy8gR2V0IHRpbWVzdGFtcCBvZiB0aGUgbW9zdCByZWNlbnQgZGVzYyB1cGRhdGUuXG4gIF9nZXRfZGVzY19pbXM6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IHR1cGQgPSB0aGlzLnRvcGljLl9sYXN0RGVzY1VwZGF0ZSB8fCAwO1xuICAgIHJldHVybiB0aGlzLnRvcGljLnVwZGF0ZWQgPiB0dXBkID8gdGhpcy50b3BpYy51cGRhdGVkIDogdHVwZDtcbiAgfSxcblxuICAvLyBHZXQgdGltZXN0YW1wIG9mIHRoZSBtb3N0IHJlY2VudCBzdWJzIHVwZGF0ZS5cbiAgX2dldF9zdWJzX2ltczogZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMudG9waWMuaXNQMlBUeXBlKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLl9nZXRfZGVzY19pbXMoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMudG9waWMuaXNNZVR5cGUoKSkge1xuICAgICAgY29uc3QgZ3VwZCA9IHRoaXMudG9waWMuX3Rpbm9kZS5fbGFzdFRvcGljVXBkYXRlIHx8IDA7XG4gICAgICBpZiAoZ3VwZCA+IHRoaXMudG9waWMuX2xhc3RTdWJzVXBkYXRlKSB7XG4gICAgICAgIHJldHVybiBndXBkO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy50b3BpYy5fbGFzdFN1YnNVcGRhdGU7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIG1lc3NhZ2VzIHdpdGhpbiBleHBsaWNpdCBsaW1pdHMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gc2luY2UgLSBtZXNzYWdlcyBuZXdlciB0aGFuIHRoaXMgKGluY2x1c2l2ZSk7XG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gYmVmb3JlIC0gb2xkZXIgdGhhbiB0aGlzIChleGNsdXNpdmUpXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gbGltaXQgLSBudW1iZXIgb2YgbWVzc2FnZXMgdG8gZmV0Y2hcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aERhdGE6IGZ1bmN0aW9uKHNpbmNlLCBiZWZvcmUsIGxpbWl0KSB7XG4gICAgdGhpcy53aGF0WydkYXRhJ10gPSB7XG4gICAgICBzaW5jZTogc2luY2UsXG4gICAgICBiZWZvcmU6IGJlZm9yZSxcbiAgICAgIGxpbWl0OiBsaW1pdFxuICAgIH07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIG1lc3NhZ2VzIG5ld2VyIHRoYW4gdGhlIGxhdGVzdCBzYXZlZCBtZXNzYWdlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcj19IGxpbWl0IC0gbnVtYmVyIG9mIG1lc3NhZ2VzIHRvIGZldGNoXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IDxjb2RlPnRoaXM8L2NvZGU+IG9iamVjdC5cbiAgICovXG4gIHdpdGhMYXRlckRhdGE6IGZ1bmN0aW9uKGxpbWl0KSB7XG4gICAgcmV0dXJuIHRoaXMud2l0aERhdGEodGhpcy50b3BpYy5fbWF4U2VxID4gMCA/IHRoaXMudG9waWMuX21heFNlcSArIDEgOiB1bmRlZmluZWQsIHVuZGVmaW5lZCwgbGltaXQpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBBZGQgcXVlcnkgcGFyYW1ldGVycyB0byBmZXRjaCBtZXNzYWdlcyBvbGRlciB0aGFuIHRoZSBlYXJsaWVzdCBzYXZlZCBtZXNzYWdlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcj19IGxpbWl0IC0gbWF4aW11bSBudW1iZXIgb2YgbWVzc2FnZXMgdG8gZmV0Y2guXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IDxjb2RlPnRoaXM8L2NvZGU+IG9iamVjdC5cbiAgICovXG4gIHdpdGhFYXJsaWVyRGF0YTogZnVuY3Rpb24obGltaXQpIHtcbiAgICByZXR1cm4gdGhpcy53aXRoRGF0YSh1bmRlZmluZWQsIHRoaXMudG9waWMuX21pblNlcSA+IDAgPyB0aGlzLnRvcGljLl9taW5TZXEgOiB1bmRlZmluZWQsIGxpbWl0KTtcbiAgfSxcblxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggdG9waWMgZGVzY3JpcHRpb24gaWYgaXQncyBuZXdlciB0aGFuIHRoZSBnaXZlbiB0aW1lc3RhbXAuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7RGF0ZT19IGltcyAtIGZldGNoIG1lc3NhZ2VzIG5ld2VyIHRoYW4gdGhpcyB0aW1lc3RhbXAuXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IDxjb2RlPnRoaXM8L2NvZGU+IG9iamVjdC5cbiAgICovXG4gIHdpdGhEZXNjOiBmdW5jdGlvbihpbXMpIHtcbiAgICB0aGlzLndoYXRbJ2Rlc2MnXSA9IHtcbiAgICAgIGltczogaW1zXG4gICAgfTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggdG9waWMgZGVzY3JpcHRpb24gaWYgaXQncyBuZXdlciB0aGFuIHRoZSBsYXN0IHVwZGF0ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aExhdGVyRGVzYzogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMud2l0aERlc2ModGhpcy5fZ2V0X2Rlc2NfaW1zKCkpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBBZGQgcXVlcnkgcGFyYW1ldGVycyB0byBmZXRjaCBzdWJzY3JpcHRpb25zLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge0RhdGU9fSBpbXMgLSBmZXRjaCBzdWJzY3JpcHRpb25zIG1vZGlmaWVkIG1vcmUgcmVjZW50bHkgdGhhbiB0aGlzIHRpbWVzdGFtcFxuICAgKiBAcGFyYW0ge251bWJlcj19IGxpbWl0IC0gbWF4aW11bSBudW1iZXIgb2Ygc3Vic2NyaXB0aW9ucyB0byBmZXRjaC5cbiAgICogQHBhcmFtIHtzdHJpbmc9fSB1c2VyT3JUb3BpYyAtIHVzZXIgSUQgb3IgdG9waWMgbmFtZSB0byBmZXRjaCBmb3IgZmV0Y2hpbmcgb25lIHN1YnNjcmlwdGlvbi5cbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aFN1YjogZnVuY3Rpb24oaW1zLCBsaW1pdCwgdXNlck9yVG9waWMpIHtcbiAgICBjb25zdCBvcHRzID0ge1xuICAgICAgaW1zOiBpbXMsXG4gICAgICBsaW1pdDogbGltaXRcbiAgICB9O1xuICAgIGlmICh0aGlzLnRvcGljLmdldFR5cGUoKSA9PSAnbWUnKSB7XG4gICAgICBvcHRzLnRvcGljID0gdXNlck9yVG9waWM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wdHMudXNlciA9IHVzZXJPclRvcGljO1xuICAgIH1cbiAgICB0aGlzLndoYXRbJ3N1YiddID0gb3B0cztcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggYSBzaW5nbGUgc3Vic2NyaXB0aW9uLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge0RhdGU9fSBpbXMgLSBmZXRjaCBzdWJzY3JpcHRpb25zIG1vZGlmaWVkIG1vcmUgcmVjZW50bHkgdGhhbiB0aGlzIHRpbWVzdGFtcFxuICAgKiBAcGFyYW0ge3N0cmluZz19IHVzZXJPclRvcGljIC0gdXNlciBJRCBvciB0b3BpYyBuYW1lIHRvIGZldGNoIGZvciBmZXRjaGluZyBvbmUgc3Vic2NyaXB0aW9uLlxuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSA8Y29kZT50aGlzPC9jb2RlPiBvYmplY3QuXG4gICAqL1xuICB3aXRoT25lU3ViOiBmdW5jdGlvbihpbXMsIHVzZXJPclRvcGljKSB7XG4gICAgcmV0dXJuIHRoaXMud2l0aFN1YihpbXMsIHVuZGVmaW5lZCwgdXNlck9yVG9waWMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBBZGQgcXVlcnkgcGFyYW1ldGVycyB0byBmZXRjaCBhIHNpbmdsZSBzdWJzY3JpcHRpb24gaWYgaXQncyBiZWVuIHVwZGF0ZWQgc2luY2UgdGhlIGxhc3QgdXBkYXRlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZz19IHVzZXJPclRvcGljIC0gdXNlciBJRCBvciB0b3BpYyBuYW1lIHRvIGZldGNoIGZvciBmZXRjaGluZyBvbmUgc3Vic2NyaXB0aW9uLlxuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSA8Y29kZT50aGlzPC9jb2RlPiBvYmplY3QuXG4gICAqL1xuICB3aXRoTGF0ZXJPbmVTdWI6IGZ1bmN0aW9uKHVzZXJPclRvcGljKSB7XG4gICAgcmV0dXJuIHRoaXMud2l0aE9uZVN1Yih0aGlzLnRvcGljLl9sYXN0U3Vic1VwZGF0ZSwgdXNlck9yVG9waWMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBBZGQgcXVlcnkgcGFyYW1ldGVycyB0byBmZXRjaCBzdWJzY3JpcHRpb25zIHVwZGF0ZWQgc2luY2UgdGhlIGxhc3QgdXBkYXRlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcj19IGxpbWl0IC0gbWF4aW11bSBudW1iZXIgb2Ygc3Vic2NyaXB0aW9ucyB0byBmZXRjaC5cbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aExhdGVyU3ViOiBmdW5jdGlvbihsaW1pdCkge1xuICAgIHJldHVybiB0aGlzLndpdGhTdWIodGhpcy5fZ2V0X3N1YnNfaW1zKCksIGxpbWl0KTtcbiAgfSxcblxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggdG9waWMgdGFncy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPGNvZGU+dGhpczwvY29kZT4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aFRhZ3M6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMud2hhdFsndGFncyddID0gdHJ1ZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggdXNlcidzIGNyZWRlbnRpYWxzLiA8Y29kZT4nbWUnPC9jb2RlPiB0b3BpYyBvbmx5LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSA8Y29kZT50aGlzPC9jb2RlPiBvYmplY3QuXG4gICAqL1xuICB3aXRoQ3JlZDogZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMudG9waWMuZ2V0VHlwZSgpID09ICdtZScpIHtcbiAgICAgIHRoaXMud2hhdFsnY3JlZCddID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50b3BpYy5fdGlub2RlLmxvZ2dlcihcIkVSUk9SOiBJbnZhbGlkIHRvcGljIHR5cGUgZm9yIE1ldGFHZXRCdWlsZGVyOndpdGhDcmVkc1wiLCB0aGlzLnRvcGljLmdldFR5cGUoKSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIC8qKlxuICAgKiBBZGQgcXVlcnkgcGFyYW1ldGVycyB0byBmZXRjaCBkZWxldGVkIG1lc3NhZ2VzIHdpdGhpbiBleHBsaWNpdCBsaW1pdHMuIEFueS9hbGwgcGFyYW1ldGVycyBjYW4gYmUgbnVsbC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXI9fSBzaW5jZSAtIGlkcyBvZiBtZXNzYWdlcyBkZWxldGVkIHNpbmNlIHRoaXMgJ2RlbCcgaWQgKGluY2x1c2l2ZSlcbiAgICogQHBhcmFtIHtudW1iZXI9fSBsaW1pdCAtIG51bWJlciBvZiBkZWxldGVkIG1lc3NhZ2UgaWRzIHRvIGZldGNoXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IDxjb2RlPnRoaXM8L2NvZGU+IG9iamVjdC5cbiAgICovXG4gIHdpdGhEZWw6IGZ1bmN0aW9uKHNpbmNlLCBsaW1pdCkge1xuICAgIGlmIChzaW5jZSB8fCBsaW1pdCkge1xuICAgICAgdGhpcy53aGF0WydkZWwnXSA9IHtcbiAgICAgICAgc2luY2U6IHNpbmNlLFxuICAgICAgICBsaW1pdDogbGltaXRcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIC8qKlxuICAgKiBBZGQgcXVlcnkgcGFyYW1ldGVycyB0byBmZXRjaCBtZXNzYWdlcyBkZWxldGVkIGFmdGVyIHRoZSBzYXZlZCA8Y29kZT4nZGVsJzwvY29kZT4gaWQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gbGltaXQgLSBudW1iZXIgb2YgZGVsZXRlZCBtZXNzYWdlIGlkcyB0byBmZXRjaFxuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSA8Y29kZT50aGlzPC9jb2RlPiBvYmplY3QuXG4gICAqL1xuICB3aXRoTGF0ZXJEZWw6IGZ1bmN0aW9uKGxpbWl0KSB7XG4gICAgLy8gU3BlY2lmeSAnc2luY2UnIG9ubHkgaWYgd2UgaGF2ZSBhbHJlYWR5IHJlY2VpdmVkIHNvbWUgbWVzc2FnZXMuIElmXG4gICAgLy8gd2UgaGF2ZSBubyBsb2NhbGx5IGNhY2hlZCBtZXNzYWdlcyB0aGVuIHdlIGRvbid0IGNhcmUgaWYgYW55IG1lc3NhZ2VzIHdlcmUgZGVsZXRlZC5cbiAgICByZXR1cm4gdGhpcy53aXRoRGVsKHRoaXMudG9waWMuX21heFNlcSA+IDAgPyB0aGlzLnRvcGljLl9tYXhEZWwgKyAxIDogdW5kZWZpbmVkLCBsaW1pdCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdCBwYXJhbWV0ZXJzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLkdldFF1ZXJ5fSBHZXQgcXVlcnlcbiAgICovXG4gIGJ1aWxkOiBmdW5jdGlvbigpIHtcbiAgICBjb25zdCB3aGF0ID0gW107XG4gICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzO1xuICAgIGxldCBwYXJhbXMgPSB7fTtcbiAgICBbJ2RhdGEnLCAnc3ViJywgJ2Rlc2MnLCAndGFncycsICdjcmVkJywgJ2RlbCddLm1hcChmdW5jdGlvbihrZXkpIHtcbiAgICAgIGlmIChpbnN0YW5jZS53aGF0Lmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgd2hhdC5wdXNoKGtleSk7XG4gICAgICAgIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhpbnN0YW5jZS53aGF0W2tleV0pLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBwYXJhbXNba2V5XSA9IGluc3RhbmNlLndoYXRba2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICh3aGF0Lmxlbmd0aCA+IDApIHtcbiAgICAgIHBhcmFtcy53aGF0ID0gd2hhdC5qb2luKCcgJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcmFtcyA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIHBhcmFtcztcbiAgfVxufTtcblxuLyoqXG4gKiBIZWxwZXIgY2xhc3MgZm9yIGhhbmRsaW5nIGFjY2VzcyBtb2RlLlxuICpcbiAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gKiBAbWVtYmVyb2YgVGlub2RlXG4gKlxuICogQHBhcmFtIHtBY2Nlc3NNb2RlfE9iamVjdD19IGFjcyAtIEFjY2Vzc01vZGUgdG8gY29weSBvciBhY2Nlc3MgbW9kZSBvYmplY3QgcmVjZWl2ZWQgZnJvbSB0aGUgc2VydmVyLlxuICovXG52YXIgQWNjZXNzTW9kZSA9IGZ1bmN0aW9uKGFjcykge1xuICBpZiAoYWNzKSB7XG4gICAgdGhpcy5naXZlbiA9IHR5cGVvZiBhY3MuZ2l2ZW4gPT0gJ251bWJlcicgPyBhY3MuZ2l2ZW4gOiBBY2Nlc3NNb2RlLmRlY29kZShhY3MuZ2l2ZW4pO1xuICAgIHRoaXMud2FudCA9IHR5cGVvZiBhY3Mud2FudCA9PSAnbnVtYmVyJyA/IGFjcy53YW50IDogQWNjZXNzTW9kZS5kZWNvZGUoYWNzLndhbnQpO1xuICAgIHRoaXMubW9kZSA9IGFjcy5tb2RlID8gKHR5cGVvZiBhY3MubW9kZSA9PSAnbnVtYmVyJyA/IGFjcy5tb2RlIDogQWNjZXNzTW9kZS5kZWNvZGUoYWNzLm1vZGUpKSA6XG4gICAgICAodGhpcy5naXZlbiAmIHRoaXMud2FudCk7XG4gIH1cbn07XG5cbkFjY2Vzc01vZGUuX05PTkUgPSAweDAwO1xuQWNjZXNzTW9kZS5fSk9JTiA9IDB4MDE7XG5BY2Nlc3NNb2RlLl9SRUFEID0gMHgwMjtcbkFjY2Vzc01vZGUuX1dSSVRFID0gMHgwNDtcbkFjY2Vzc01vZGUuX1BSRVMgPSAweDA4O1xuQWNjZXNzTW9kZS5fQVBQUk9WRSA9IDB4MTA7XG5BY2Nlc3NNb2RlLl9TSEFSRSA9IDB4MjA7XG5BY2Nlc3NNb2RlLl9ERUxFVEUgPSAweDQwO1xuQWNjZXNzTW9kZS5fT1dORVIgPSAweDgwO1xuXG5BY2Nlc3NNb2RlLl9CSVRNQVNLID0gQWNjZXNzTW9kZS5fSk9JTiB8IEFjY2Vzc01vZGUuX1JFQUQgfCBBY2Nlc3NNb2RlLl9XUklURSB8IEFjY2Vzc01vZGUuX1BSRVMgfFxuICBBY2Nlc3NNb2RlLl9BUFBST1ZFIHwgQWNjZXNzTW9kZS5fU0hBUkUgfCBBY2Nlc3NNb2RlLl9ERUxFVEUgfCBBY2Nlc3NNb2RlLl9PV05FUjtcbkFjY2Vzc01vZGUuX0lOVkFMSUQgPSAweDEwMDAwMDtcblxuQWNjZXNzTW9kZS5fY2hlY2tGbGFnID0gZnVuY3Rpb24odmFsLCBzaWRlLCBmbGFnKSB7XG4gIHNpZGUgPSBzaWRlIHx8ICdtb2RlJztcbiAgaWYgKFsnZ2l2ZW4nLCAnd2FudCcsICdtb2RlJ10uaW5jbHVkZXMoc2lkZSkpIHtcbiAgICByZXR1cm4gKCh2YWxbc2lkZV0gJiBmbGFnKSAhPSAwKTtcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgQWNjZXNzTW9kZSBjb21wb25lbnQgJyR7c2lkZX0nYCk7XG59XG5cbi8qKlxuICogUGFyc2Ugc3RyaW5nIGludG8gYW4gYWNjZXNzIG1vZGUgdmFsdWUuXG4gKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZyB8IE51bWJlcn0gbW9kZSAtIGVpdGhlciBhIFN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgYWNjZXNzIG1vZGUgdG8gcGFyc2Ugb3IgYSBzZXQgb2YgYml0cyB0byBhc3NpZ24uXG4gKiBAcmV0dXJucyB7bnVtYmVyfSAtIEFjY2VzcyBtb2RlIGFzIGEgbnVtZXJpYyB2YWx1ZS5cbiAqL1xuQWNjZXNzTW9kZS5kZWNvZGUgPSBmdW5jdGlvbihzdHIpIHtcbiAgaWYgKCFzdHIpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfSBlbHNlIGlmICh0eXBlb2Ygc3RyID09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIHN0ciAmIEFjY2Vzc01vZGUuX0JJVE1BU0s7XG4gIH0gZWxzZSBpZiAoc3RyID09PSAnTicgfHwgc3RyID09PSAnbicpIHtcbiAgICByZXR1cm4gQWNjZXNzTW9kZS5fTk9ORTtcbiAgfVxuXG4gIGNvbnN0IGJpdG1hc2sgPSB7XG4gICAgJ0onOiBBY2Nlc3NNb2RlLl9KT0lOLFxuICAgICdSJzogQWNjZXNzTW9kZS5fUkVBRCxcbiAgICAnVyc6IEFjY2Vzc01vZGUuX1dSSVRFLFxuICAgICdQJzogQWNjZXNzTW9kZS5fUFJFUyxcbiAgICAnQSc6IEFjY2Vzc01vZGUuX0FQUFJPVkUsXG4gICAgJ1MnOiBBY2Nlc3NNb2RlLl9TSEFSRSxcbiAgICAnRCc6IEFjY2Vzc01vZGUuX0RFTEVURSxcbiAgICAnTyc6IEFjY2Vzc01vZGUuX09XTkVSXG4gIH07XG5cbiAgbGV0IG0wID0gQWNjZXNzTW9kZS5fTk9ORTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGJpdCA9IGJpdG1hc2tbc3RyLmNoYXJBdChpKS50b1VwcGVyQ2FzZSgpXTtcbiAgICBpZiAoIWJpdCkge1xuICAgICAgLy8gVW5yZWNvZ25pemVkIGJpdCwgc2tpcC5cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBtMCB8PSBiaXQ7XG4gIH1cbiAgcmV0dXJuIG0wO1xufTtcblxuLyoqXG4gKiBDb252ZXJ0IG51bWVyaWMgcmVwcmVzZW50YXRpb24gb2YgdGhlIGFjY2VzcyBtb2RlIGludG8gYSBzdHJpbmcuXG4gKlxuICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IHZhbCAtIGFjY2VzcyBtb2RlIHZhbHVlIHRvIGNvbnZlcnQgdG8gYSBzdHJpbmcuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSAtIEFjY2VzcyBtb2RlIGFzIGEgc3RyaW5nLlxuICovXG5BY2Nlc3NNb2RlLmVuY29kZSA9IGZ1bmN0aW9uKHZhbCkge1xuICBpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gQWNjZXNzTW9kZS5fSU5WQUxJRCkge1xuICAgIHJldHVybiBudWxsO1xuICB9IGVsc2UgaWYgKHZhbCA9PT0gQWNjZXNzTW9kZS5fTk9ORSkge1xuICAgIHJldHVybiAnTic7XG4gIH1cblxuICBjb25zdCBiaXRtYXNrID0gWydKJywgJ1InLCAnVycsICdQJywgJ0EnLCAnUycsICdEJywgJ08nXTtcbiAgbGV0IHJlcyA9ICcnO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGJpdG1hc2subGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoKHZhbCAmICgxIDw8IGkpKSAhPSAwKSB7XG4gICAgICByZXMgPSByZXMgKyBiaXRtYXNrW2ldO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzO1xufTtcblxuLyoqXG4gKiBVcGRhdGUgbnVtZXJpYyByZXByZXNlbnRhdGlvbiBvZiBhY2Nlc3MgbW9kZSB3aXRoIHRoZSBuZXcgdmFsdWUuIFRoZSB2YWx1ZVxuICogaXMgb25lIG9mIHRoZSBmb2xsb3dpbmc6XG4gKiAgLSBhIHN0cmluZyBzdGFydGluZyB3aXRoIDxjb2RlPicrJzwvY29kZT4gb3IgPGNvZGU+Jy0nPC9jb2RlPiB0aGVuIHRoZSBiaXRzIHRvIGFkZCBvciByZW1vdmUsIGUuZy4gPGNvZGU+JytSLVcnPC9jb2RlPiBvciA8Y29kZT4nLVBTJzwvY29kZT4uXG4gKiAgLSBhIG5ldyB2YWx1ZSBvZiBhY2Nlc3MgbW9kZVxuICpcbiAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSB2YWwgLSBhY2Nlc3MgbW9kZSB2YWx1ZSB0byB1cGRhdGUuXG4gKiBAcGFyYW0ge3N0cmluZ30gdXBkIC0gdXBkYXRlIHRvIGFwcGx5IHRvIHZhbC5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IC0gdXBkYXRlZCBhY2Nlc3MgbW9kZS5cbiAqL1xuQWNjZXNzTW9kZS51cGRhdGUgPSBmdW5jdGlvbih2YWwsIHVwZCkge1xuICBpZiAoIXVwZCB8fCB0eXBlb2YgdXBkICE9ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHZhbDtcbiAgfVxuXG4gIGxldCBhY3Rpb24gPSB1cGQuY2hhckF0KDApO1xuICBpZiAoYWN0aW9uID09ICcrJyB8fCBhY3Rpb24gPT0gJy0nKSB7XG4gICAgbGV0IHZhbDAgPSB2YWw7XG4gICAgLy8gU3BsaXQgZGVsdGEtc3RyaW5nIGxpa2UgJytBQkMtREVGK1onIGludG8gYW4gYXJyYXkgb2YgcGFydHMgaW5jbHVkaW5nICsgYW5kIC0uXG4gICAgY29uc3QgcGFydHMgPSB1cGQuc3BsaXQoLyhbLStdKS8pO1xuICAgIC8vIFN0YXJ0aW5nIGl0ZXJhdGlvbiBmcm9tIDEgYmVjYXVzZSBTdHJpbmcuc3BsaXQoKSBjcmVhdGVzIGFuIGFycmF5IHdpdGggdGhlIGZpcnN0IGVtcHR5IGVsZW1lbnQuXG4gICAgLy8gSXRlcmF0aW5nIGJ5IDIgYmVjYXVzZSB3ZSBwYXJzZSBwYWlycyArLy0gdGhlbiBkYXRhLlxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgcGFydHMubGVuZ3RoIC0gMTsgaSArPSAyKSB7XG4gICAgICBhY3Rpb24gPSBwYXJ0c1tpXTtcbiAgICAgIGNvbnN0IG0wID0gQWNjZXNzTW9kZS5kZWNvZGUocGFydHNbaSArIDFdKTtcbiAgICAgIGlmIChtMCA9PSBBY2Nlc3NNb2RlLl9JTlZBTElEKSB7XG4gICAgICAgIHJldHVybiB2YWw7XG4gICAgICB9XG4gICAgICBpZiAobTAgPT0gbnVsbCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmIChhY3Rpb24gPT09ICcrJykge1xuICAgICAgICB2YWwwIHw9IG0wO1xuICAgICAgfSBlbHNlIGlmIChhY3Rpb24gPT09ICctJykge1xuICAgICAgICB2YWwwICY9IH5tMDtcbiAgICAgIH1cbiAgICB9XG4gICAgdmFsID0gdmFsMDtcbiAgfSBlbHNlIHtcbiAgICAvLyBUaGUgc3RyaW5nIGlzIGFuIGV4cGxpY2l0IG5ldyB2YWx1ZSAnQUJDJyByYXRoZXIgdGhhbiBkZWx0YS5cbiAgICBjb25zdCB2YWwwID0gQWNjZXNzTW9kZS5kZWNvZGUodXBkKTtcbiAgICBpZiAodmFsMCAhPSBBY2Nlc3NNb2RlLl9JTlZBTElEKSB7XG4gICAgICB2YWwgPSB2YWwwO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB2YWw7XG59O1xuXG4vKipcbiAqIEJpdHMgcHJlc2VudCBpbiBhMSBidXQgbWlzc2luZyBpbiBhMi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyb2YgVGlub2RlXG4gKlxuICogQHBhcmFtIHtudW1iZXIgfCBzdHJpbmd9IGExIC0gYWNjZXNzIG1vZGUgdG8gc3VidHJhY3QgZnJvbS5cbiAqIEBwYXJhbSB7bnVtYmVyIHwgc3RyaW5nfSBhMiAtIGFjY2VzcyBtb2RlIHRvIHN1YnRyYWN0LlxuICogQHJldHVybnMge251bWJlcn0gYWNjZXNzIG1vZGUgd2l0aCBiaXRzIHByZXNlbnQgaW4gPGNvZGU+YTE8L2NvZGU+IGJ1dCBtaXNzaW5nIGluIDxjb2RlPmEyPC9jb2RlPi5cbiAqL1xuQWNjZXNzTW9kZS5kaWZmID0gZnVuY3Rpb24oYTEsIGEyKSB7XG4gIGExID0gQWNjZXNzTW9kZS5kZWNvZGUoYTEpO1xuICBhMiA9IEFjY2Vzc01vZGUuZGVjb2RlKGEyKTtcblxuICBpZiAoYTEgPT0gQWNjZXNzTW9kZS5fSU5WQUxJRCB8fCBhMiA9PSBBY2Nlc3NNb2RlLl9JTlZBTElEKSB7XG4gICAgcmV0dXJuIEFjY2Vzc01vZGUuX0lOVkFMSUQ7XG4gIH1cbiAgcmV0dXJuIGExICYgfmEyO1xufTtcblxuLyoqXG4gKiBBY2Nlc3NNb2RlIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIHRvcGljIGFjY2VzcyBtb2RlLlxuICpcbiAqIEBtZW1iZXJvZiBUaW5vZGVcbiAqIEBjbGFzcyBBY2Nlc3NNb2RlXG4gKi9cbkFjY2Vzc01vZGUucHJvdG90eXBlID0ge1xuICAvKipcbiAgICogQ3VzdG9tIGZvcm1hdHRlclxuICAgKi9cbiAgdG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAne1wibW9kZVwiOiBcIicgKyBBY2Nlc3NNb2RlLmVuY29kZSh0aGlzLm1vZGUpICtcbiAgICAgICdcIiwgXCJnaXZlblwiOiBcIicgKyBBY2Nlc3NNb2RlLmVuY29kZSh0aGlzLmdpdmVuKSArXG4gICAgICAnXCIsIFwid2FudFwiOiBcIicgKyBBY2Nlc3NNb2RlLmVuY29kZSh0aGlzLndhbnQpICsgJ1wifSc7XG4gIH0sXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBudW1lcmljIHZhbHVlcyB0byBzdHJpbmdzLlxuICAgKi9cbiAganNvbkhlbHBlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1vZGU6IEFjY2Vzc01vZGUuZW5jb2RlKHRoaXMubW9kZSksXG4gICAgICBnaXZlbjogQWNjZXNzTW9kZS5lbmNvZGUodGhpcy5naXZlbiksXG4gICAgICB3YW50OiBBY2Nlc3NNb2RlLmVuY29kZSh0aGlzLndhbnQpXG4gICAgfTtcbiAgfSxcbiAgLyoqXG4gICAqIEFzc2lnbiB2YWx1ZSB0byAnbW9kZScuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZyB8IE51bWJlcn0gbSAtIGVpdGhlciBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgYWNjZXNzIG1vZGUgb3IgYSBzZXQgb2YgYml0cy5cbiAgICogQHJldHVybnMge0FjY2Vzc01vZGV9IC0gPGNvZGU+dGhpczwvY29kZT4gQWNjZXNzTW9kZS5cbiAgICovXG4gIHNldE1vZGU6IGZ1bmN0aW9uKG0pIHtcbiAgICB0aGlzLm1vZGUgPSBBY2Nlc3NNb2RlLmRlY29kZShtKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgLyoqXG4gICAqIFVwZGF0ZSA8Y29kZT5tb2RlPC9jb2RlPiB2YWx1ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1IC0gc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBjaGFuZ2VzIHRvIGFwcGx5IHRvIGFjY2VzcyBtb2RlLlxuICAgKiBAcmV0dXJucyB7QWNjZXNzTW9kZX0gLSA8Y29kZT50aGlzPC9jb2RlPiBBY2Nlc3NNb2RlLlxuICAgKi9cbiAgdXBkYXRlTW9kZTogZnVuY3Rpb24odSkge1xuICAgIHRoaXMubW9kZSA9IEFjY2Vzc01vZGUudXBkYXRlKHRoaXMubW9kZSwgdSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIC8qKlxuICAgKiBHZXQgPGNvZGU+bW9kZTwvY29kZT4gdmFsdWUgYXMgYSBzdHJpbmcuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSAtIDxjb2RlPm1vZGU8L2NvZGU+IHZhbHVlLlxuICAgKi9cbiAgZ2V0TW9kZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIEFjY2Vzc01vZGUuZW5jb2RlKHRoaXMubW9kZSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEFzc2lnbiA8Y29kZT5naXZlbjwvY29kZT4gIHZhbHVlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmcgfCBOdW1iZXJ9IGcgLSBlaXRoZXIgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIGFjY2VzcyBtb2RlIG9yIGEgc2V0IG9mIGJpdHMuXG4gICAqIEByZXR1cm5zIHtBY2Nlc3NNb2RlfSAtIDxjb2RlPnRoaXM8L2NvZGU+IEFjY2Vzc01vZGUuXG4gICAqL1xuICBzZXRHaXZlbjogZnVuY3Rpb24oZykge1xuICAgIHRoaXMuZ2l2ZW4gPSBBY2Nlc3NNb2RlLmRlY29kZShnKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgLyoqXG4gICAqIFVwZGF0ZSAnZ2l2ZW4nIHZhbHVlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHUgLSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIGNoYW5nZXMgdG8gYXBwbHkgdG8gYWNjZXNzIG1vZGUuXG4gICAqIEByZXR1cm5zIHtBY2Nlc3NNb2RlfSAtIDxjb2RlPnRoaXM8L2NvZGU+IEFjY2Vzc01vZGUuXG4gICAqL1xuICB1cGRhdGVHaXZlbjogZnVuY3Rpb24odSkge1xuICAgIHRoaXMuZ2l2ZW4gPSBBY2Nlc3NNb2RlLnVwZGF0ZSh0aGlzLmdpdmVuLCB1KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgLyoqXG4gICAqIEdldCAnZ2l2ZW4nIHZhbHVlIGFzIGEgc3RyaW5nLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICpcbiAgICogQHJldHVybnMge3N0cmluZ30gLSA8Yj5naXZlbjwvYj4gdmFsdWUuXG4gICAqL1xuICBnZXRHaXZlbjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIEFjY2Vzc01vZGUuZW5jb2RlKHRoaXMuZ2l2ZW4pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBBc3NpZ24gJ3dhbnQnIHZhbHVlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmcgfCBOdW1iZXJ9IHcgLSBlaXRoZXIgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIGFjY2VzcyBtb2RlIG9yIGEgc2V0IG9mIGJpdHMuXG4gICAqIEByZXR1cm5zIHtBY2Nlc3NNb2RlfSAtIDxjb2RlPnRoaXM8L2NvZGU+IEFjY2Vzc01vZGUuXG4gICAqL1xuICBzZXRXYW50OiBmdW5jdGlvbih3KSB7XG4gICAgdGhpcy53YW50ID0gQWNjZXNzTW9kZS5kZWNvZGUodyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIC8qKlxuICAgKiBVcGRhdGUgJ3dhbnQnIHZhbHVlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHUgLSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIGNoYW5nZXMgdG8gYXBwbHkgdG8gYWNjZXNzIG1vZGUuXG4gICAqIEByZXR1cm5zIHtBY2Nlc3NNb2RlfSAtIDxjb2RlPnRoaXM8L2NvZGU+IEFjY2Vzc01vZGUuXG4gICAqL1xuICB1cGRhdGVXYW50OiBmdW5jdGlvbih1KSB7XG4gICAgdGhpcy53YW50ID0gQWNjZXNzTW9kZS51cGRhdGUodGhpcy53YW50LCB1KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgLyoqXG4gICAqIEdldCAnd2FudCcgdmFsdWUgYXMgYSBzdHJpbmcuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSAtIDxiPndhbnQ8L2I+IHZhbHVlLlxuICAgKi9cbiAgZ2V0V2FudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIEFjY2Vzc01vZGUuZW5jb2RlKHRoaXMud2FudCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEdldCBwZXJtaXNzaW9ucyBwcmVzZW50IGluICd3YW50JyBidXQgbWlzc2luZyBpbiAnZ2l2ZW4nLlxuICAgKiBJbnZlcnNlIG9mIHtAbGluayBUaW5vZGUuQWNjZXNzTW9kZSNnZXRFeGNlc3NpdmV9XG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBwZXJtaXNzaW9ucyBwcmVzZW50IGluIDxiPndhbnQ8L2I+IGJ1dCBtaXNzaW5nIGluIDxiPmdpdmVuPC9iPi5cbiAgICovXG4gIGdldE1pc3Npbmc6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBBY2Nlc3NNb2RlLmVuY29kZSh0aGlzLndhbnQgJiB+dGhpcy5naXZlbik7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEdldCBwZXJtaXNzaW9ucyBwcmVzZW50IGluICdnaXZlbicgYnV0IG1pc3NpbmcgaW4gJ3dhbnQnLlxuICAgKiBJbnZlcnNlIG9mIHtAbGluayBUaW5vZGUuQWNjZXNzTW9kZSNnZXRNaXNzaW5nfVxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICpcbiAgICogQHJldHVybnMge3N0cmluZ30gcGVybWlzc2lvbnMgcHJlc2VudCBpbiA8Yj5naXZlbjwvYj4gYnV0IG1pc3NpbmcgaW4gPGI+d2FudDwvYj4uXG4gICAqL1xuICBnZXRFeGNlc3NpdmU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBBY2Nlc3NNb2RlLmVuY29kZSh0aGlzLmdpdmVuICYgfnRoaXMud2FudCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFVwZGF0ZSAnd2FudCcsICdnaXZlJywgYW5kICdtb2RlJyB2YWx1ZXMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcGFyYW0ge0FjY2Vzc01vZGV9IHZhbCAtIG5ldyBhY2Nlc3MgbW9kZSB2YWx1ZS5cbiAgICogQHJldHVybnMge0FjY2Vzc01vZGV9IC0gPGNvZGU+dGhpczwvY29kZT4gQWNjZXNzTW9kZS5cbiAgICovXG4gIHVwZGF0ZUFsbDogZnVuY3Rpb24odmFsKSB7XG4gICAgaWYgKHZhbCkge1xuICAgICAgdGhpcy51cGRhdGVHaXZlbih2YWwuZ2l2ZW4pO1xuICAgICAgdGhpcy51cGRhdGVXYW50KHZhbC53YW50KTtcbiAgICAgIHRoaXMubW9kZSA9IHRoaXMuZ2l2ZW4gJiB0aGlzLndhbnQ7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBPd25lciAoTykgZmxhZyBpcyBzZXQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IHNpZGUgLSB3aGljaCBwZXJtaXNzaW9uIHRvIGNoZWNrOiBnaXZlbiwgd2FudCwgbW9kZTsgZGVmYXVsdDogbW9kZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgZmxhZyBpcyBzZXQuXG4gICAqL1xuICBpc093bmVyOiBmdW5jdGlvbihzaWRlKSB7XG4gICAgcmV0dXJuIEFjY2Vzc01vZGUuX2NoZWNrRmxhZyh0aGlzLCBzaWRlLCBBY2Nlc3NNb2RlLl9PV05FUik7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIFByZXNlbmNlIChQKSBmbGFnIGlzIHNldC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gc2lkZSAtIHdoaWNoIHBlcm1pc3Npb24gdG8gY2hlY2s6IGdpdmVuLCB3YW50LCBtb2RlOyBkZWZhdWx0OiBtb2RlLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiBmbGFnIGlzIHNldC5cbiAgICovXG4gIGlzUHJlc2VuY2VyOiBmdW5jdGlvbihzaWRlKSB7XG4gICAgcmV0dXJuIEFjY2Vzc01vZGUuX2NoZWNrRmxhZyh0aGlzLCBzaWRlLCBBY2Nlc3NNb2RlLl9QUkVTKTtcbiAgfSxcblxuICAvKipcbiAgICogQ2hlY2sgaWYgUHJlc2VuY2UgKFApIGZsYWcgaXMgTk9UIHNldC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gc2lkZSAtIHdoaWNoIHBlcm1pc3Npb24gdG8gY2hlY2s6IGdpdmVuLCB3YW50LCBtb2RlOyBkZWZhdWx0OiBtb2RlLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiBmbGFnIGlzIHNldC5cbiAgICovXG4gIGlzTXV0ZWQ6IGZ1bmN0aW9uKHNpZGUpIHtcbiAgICByZXR1cm4gIXRoaXMuaXNQcmVzZW5jZXIoc2lkZSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIEpvaW4gKEopIGZsYWcgaXMgc2V0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICogQHBhcmFtIHtzdHJpbmc9fSBzaWRlIC0gd2hpY2ggcGVybWlzc2lvbiB0byBjaGVjazogZ2l2ZW4sIHdhbnQsIG1vZGU7IGRlZmF1bHQ6IG1vZGUuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIGZsYWcgaXMgc2V0LlxuICAgKi9cbiAgaXNKb2luZXI6IGZ1bmN0aW9uKHNpZGUpIHtcbiAgICByZXR1cm4gQWNjZXNzTW9kZS5fY2hlY2tGbGFnKHRoaXMsIHNpZGUsIEFjY2Vzc01vZGUuX0pPSU4pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBSZWFkZXIgKFIpIGZsYWcgaXMgc2V0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICogQHBhcmFtIHtzdHJpbmc9fSBzaWRlIC0gd2hpY2ggcGVybWlzc2lvbiB0byBjaGVjazogZ2l2ZW4sIHdhbnQsIG1vZGU7IGRlZmF1bHQ6IG1vZGUuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIGZsYWcgaXMgc2V0LlxuICAgKi9cbiAgaXNSZWFkZXI6IGZ1bmN0aW9uKHNpZGUpIHtcbiAgICByZXR1cm4gQWNjZXNzTW9kZS5fY2hlY2tGbGFnKHRoaXMsIHNpZGUsIEFjY2Vzc01vZGUuX1JFQUQpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBXcml0ZXIgKFcpIGZsYWcgaXMgc2V0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICogQHBhcmFtIHtzdHJpbmc9fSBzaWRlIC0gd2hpY2ggcGVybWlzc2lvbiB0byBjaGVjazogZ2l2ZW4sIHdhbnQsIG1vZGU7IGRlZmF1bHQ6IG1vZGUuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIGZsYWcgaXMgc2V0LlxuICAgKi9cbiAgaXNXcml0ZXI6IGZ1bmN0aW9uKHNpZGUpIHtcbiAgICByZXR1cm4gQWNjZXNzTW9kZS5fY2hlY2tGbGFnKHRoaXMsIHNpZGUsIEFjY2Vzc01vZGUuX1dSSVRFKTtcbiAgfSxcblxuICAvKipcbiAgICogQ2hlY2sgaWYgQXBwcm92ZXIgKEEpIGZsYWcgaXMgc2V0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICogQHBhcmFtIHtzdHJpbmc9fSBzaWRlIC0gd2hpY2ggcGVybWlzc2lvbiB0byBjaGVjazogZ2l2ZW4sIHdhbnQsIG1vZGU7IGRlZmF1bHQ6IG1vZGUuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIGZsYWcgaXMgc2V0LlxuICAgKi9cbiAgaXNBcHByb3ZlcjogZnVuY3Rpb24oc2lkZSkge1xuICAgIHJldHVybiBBY2Nlc3NNb2RlLl9jaGVja0ZsYWcodGhpcywgc2lkZSwgQWNjZXNzTW9kZS5fQVBQUk9WRSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGVpdGhlciBvbmUgb2YgT3duZXIgKE8pIG9yIEFwcHJvdmVyIChBKSBmbGFncyBpcyBzZXQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IHNpZGUgLSB3aGljaCBwZXJtaXNzaW9uIHRvIGNoZWNrOiBnaXZlbiwgd2FudCwgbW9kZTsgZGVmYXVsdDogbW9kZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgZmxhZyBpcyBzZXQuXG4gICAqL1xuICBpc0FkbWluOiBmdW5jdGlvbihzaWRlKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNPd25lcihzaWRlKSB8fCB0aGlzLmlzQXBwcm92ZXIoc2lkZSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGVpdGhlciBvbmUgb2YgT3duZXIgKE8pLCBBcHByb3ZlciAoQSksIG9yIFNoYXJlciAoUykgZmxhZ3MgaXMgc2V0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICogQHBhcmFtIHtzdHJpbmc9fSBzaWRlIC0gd2hpY2ggcGVybWlzc2lvbiB0byBjaGVjazogZ2l2ZW4sIHdhbnQsIG1vZGU7IGRlZmF1bHQ6IG1vZGUuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIGZsYWcgaXMgc2V0LlxuICAgKi9cbiAgaXNTaGFyZXI6IGZ1bmN0aW9uKHNpZGUpIHtcbiAgICByZXR1cm4gdGhpcy5pc0FkbWluKHNpZGUpIHx8IEFjY2Vzc01vZGUuX2NoZWNrRmxhZyh0aGlzLCBzaWRlLCBBY2Nlc3NNb2RlLl9TSEFSRSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIERlbGV0ZXIgKEQpIGZsYWcgaXMgc2V0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICogQHBhcmFtIHtzdHJpbmc9fSBzaWRlIC0gd2hpY2ggcGVybWlzc2lvbiB0byBjaGVjazogZ2l2ZW4sIHdhbnQsIG1vZGU7IGRlZmF1bHQ6IG1vZGUuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIGZsYWcgaXMgc2V0LlxuICAgKi9cbiAgaXNEZWxldGVyOiBmdW5jdGlvbihzaWRlKSB7XG4gICAgcmV0dXJuIEFjY2Vzc01vZGUuX2NoZWNrRmxhZyh0aGlzLCBzaWRlLCBBY2Nlc3NNb2RlLl9ERUxFVEUpO1xuICB9XG59O1xuXG4vKipcbiAqIEBjYWxsYmFjayBUaW5vZGUuVG9waWMub25EYXRhXG4gKiBAcGFyYW0ge0RhdGF9IGRhdGEgLSBEYXRhIHBhY2tldFxuICovXG4vKipcbiAqIFRvcGljIGlzIGEgY2xhc3MgcmVwcmVzZW50aW5nIGEgbG9naWNhbCBjb21tdW5pY2F0aW9uIGNoYW5uZWwuXG4gKiBAY2xhc3MgVG9waWNcbiAqIEBtZW1iZXJvZiBUaW5vZGVcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIGNyZWF0ZS5cbiAqIEBwYXJhbSB7T2JqZWN0PX0gY2FsbGJhY2tzIC0gT2JqZWN0IHdpdGggdmFyaW91cyBldmVudCBjYWxsYmFja3MuXG4gKiBAcGFyYW0ge1Rpbm9kZS5Ub3BpYy5vbkRhdGF9IGNhbGxiYWNrcy5vbkRhdGEgLSBDYWxsYmFjayB3aGljaCByZWNlaXZlcyBhIDxjb2RlPntkYXRhfTwvY29kZT4gbWVzc2FnZS5cbiAqIEBwYXJhbSB7Y2FsbGJhY2t9IGNhbGxiYWNrcy5vbk1ldGEgLSBDYWxsYmFjayB3aGljaCByZWNlaXZlcyBhIDxjb2RlPnttZXRhfTwvY29kZT4gbWVzc2FnZS5cbiAqIEBwYXJhbSB7Y2FsbGJhY2t9IGNhbGxiYWNrcy5vblByZXMgLSBDYWxsYmFjayB3aGljaCByZWNlaXZlcyBhIDxjb2RlPntwcmVzfTwvY29kZT4gbWVzc2FnZS5cbiAqIEBwYXJhbSB7Y2FsbGJhY2t9IGNhbGxiYWNrcy5vbkluZm8gLSBDYWxsYmFjayB3aGljaCByZWNlaXZlcyBhbiA8Y29kZT57aW5mb308L2NvZGU+IG1lc3NhZ2UuXG4gKiBAcGFyYW0ge2NhbGxiYWNrfSBjYWxsYmFja3Mub25NZXRhRGVzYyAtIENhbGxiYWNrIHdoaWNoIHJlY2VpdmVzIGNoYW5nZXMgdG8gdG9waWMgZGVzY3Rpb3B0aW9uIHtAbGluayBkZXNjfS5cbiAqIEBwYXJhbSB7Y2FsbGJhY2t9IGNhbGxiYWNrcy5vbk1ldGFTdWIgLSBDYWxsZWQgZm9yIGEgc2luZ2xlIHN1YnNjcmlwdGlvbiByZWNvcmQgY2hhbmdlLlxuICogQHBhcmFtIHtjYWxsYmFja30gY2FsbGJhY2tzLm9uU3Vic1VwZGF0ZWQgLSBDYWxsZWQgYWZ0ZXIgYSBiYXRjaCBvZiBzdWJzY3JpcHRpb24gY2hhbmdlcyBoYXZlIGJlZW4gcmVjaWV2ZWQgYW5kIGNhY2hlZC5cbiAqIEBwYXJhbSB7Y2FsbGJhY2t9IGNhbGxiYWNrcy5vbkRlbGV0ZVRvcGljIC0gQ2FsbGVkIGFmdGVyIHRoZSB0b3BpYyBpcyBkZWxldGVkLlxuICogQHBhcmFtIHtjYWxsYmFja30gY2FsbGJhY2xzLm9uQWxsTWVzc2FnZXNSZWNlaXZlZCAtIENhbGxlZCB3aGVuIGFsbCByZXF1ZXN0ZWQgPGNvZGU+e2RhdGF9PC9jb2RlPiBtZXNzYWdlcyBoYXZlIGJlZW4gcmVjaXZlZC5cbiAqL1xudmFyIFRvcGljID0gZnVuY3Rpb24obmFtZSwgY2FsbGJhY2tzKSB7XG4gIC8vIFBhcmVudCBUaW5vZGUgb2JqZWN0LlxuICB0aGlzLl90aW5vZGUgPSBudWxsO1xuXG4gIC8vIFNlcnZlci1wcm92aWRlZCBkYXRhLCBsb2NhbGx5IGltbXV0YWJsZS5cbiAgLy8gdG9waWMgbmFtZVxuICB0aGlzLm5hbWUgPSBuYW1lO1xuICAvLyB0aW1lc3RhbXAgd2hlbiB0aGUgdG9waWMgd2FzIGNyZWF0ZWRcbiAgdGhpcy5jcmVhdGVkID0gbnVsbDtcbiAgLy8gdGltZXN0YW1wIHdoZW4gdGhlIHRvcGljIHdhcyBsYXN0IHVwZGF0ZWRcbiAgdGhpcy51cGRhdGVkID0gbnVsbDtcbiAgLy8gdGltZXN0YW1wIG9mIHRoZSBsYXN0IG1lc3NhZ2VzXG4gIHRoaXMudG91Y2hlZCA9IG51bGw7XG4gIC8vIGFjY2VzcyBtb2RlLCBzZWUgQWNjZXNzTW9kZVxuICB0aGlzLmFjcyA9IG5ldyBBY2Nlc3NNb2RlKG51bGwpO1xuICAvLyBwZXItdG9waWMgcHJpdmF0ZSBkYXRhXG4gIHRoaXMucHJpdmF0ZSA9IG51bGw7XG4gIC8vIHBlci10b3BpYyBwdWJsaWMgZGF0YVxuICB0aGlzLnB1YmxpYyA9IG51bGw7XG5cbiAgLy8gTG9jYWxseSBjYWNoZWQgZGF0YVxuICAvLyBTdWJzY3JpYmVkIHVzZXJzLCBmb3IgdHJhY2tpbmcgcmVhZC9yZWN2L21zZyBub3RpZmljYXRpb25zLlxuICB0aGlzLl91c2VycyA9IHt9O1xuXG4gIC8vIEN1cnJlbnQgdmFsdWUgb2YgbG9jYWxseSBpc3N1ZWQgc2VxSWQsIHVzZWQgZm9yIHBlbmRpbmcgbWVzc2FnZXMuXG4gIHRoaXMuX3F1ZXVlZFNlcUlkID0gTE9DQUxfU0VRSUQ7XG5cbiAgLy8gVGhlIG1heGltdW0ga25vd24ge2RhdGEuc2VxfSB2YWx1ZS5cbiAgdGhpcy5fbWF4U2VxID0gMDtcbiAgLy8gVGhlIG1pbmltdW0ga25vd24ge2RhdGEuc2VxfSB2YWx1ZS5cbiAgdGhpcy5fbWluU2VxID0gMDtcbiAgLy8gSW5kaWNhdG9yIHRoYXQgdGhlIGxhc3QgcmVxdWVzdCBmb3IgZWFybGllciBtZXNzYWdlcyByZXR1cm5lZCAwLlxuICB0aGlzLl9ub0VhcmxpZXJNc2dzID0gZmFsc2U7XG4gIC8vIFRoZSBtYXhpbXVtIGtub3duIGRlbGV0aW9uIElELlxuICB0aGlzLl9tYXhEZWwgPSAwO1xuICAvLyBVc2VyIGRpc2NvdmVyeSB0YWdzXG4gIHRoaXMuX3RhZ3MgPSBbXTtcbiAgLy8gQ3JlZGVudGlhbHMgc3VjaCBhcyBlbWFpbCBvciBwaG9uZSBudW1iZXIuXG4gIHRoaXMuX2NyZWRlbnRpYWxzID0gW107XG4gIC8vIE1lc3NhZ2UgY2FjaGUsIHNvcnRlZCBieSBtZXNzYWdlIHNlcSB2YWx1ZXMsIGZyb20gb2xkIHRvIG5ldy5cbiAgdGhpcy5fbWVzc2FnZXMgPSBDQnVmZmVyKGZ1bmN0aW9uKGEsIGIpIHtcbiAgICByZXR1cm4gYS5zZXEgLSBiLnNlcTtcbiAgfSwgdHJ1ZSk7XG4gIC8vIEJvb2xlYW4sIHRydWUgaWYgdGhlIHRvcGljIGlzIGN1cnJlbnRseSBsaXZlXG4gIHRoaXMuX3N1YnNjcmliZWQgPSBmYWxzZTtcbiAgLy8gVGltZXN0YXAgd2hlbiB0b3BpYyBtZXRhLWRlc2MgdXBkYXRlIHdhcyByZWNpdmVkLlxuICB0aGlzLl9sYXN0RGVzY1VwZGF0ZSA9IG51bGw7XG4gIC8vIFRpbWVzdGFwIHdoZW4gdG9waWMgbWV0YS1zdWJzIHVwZGF0ZSB3YXMgcmVjaXZlZC5cbiAgdGhpcy5fbGFzdFN1YnNVcGRhdGUgPSBudWxsO1xuICAvLyBUb3BpYyBjcmVhdGVkIGJ1dCBub3QgeWV0IHN5bmNlZCB3aXRoIHRoZSBzZXJ2ZXIuIFVzZWQgb25seSBkdXJpbmcgaW5pdGlhbGl6YXRpb24uXG4gIHRoaXMuX25ldyA9IHRydWU7XG5cbiAgLy8gQ2FsbGJhY2tzXG4gIGlmIChjYWxsYmFja3MpIHtcbiAgICB0aGlzLm9uRGF0YSA9IGNhbGxiYWNrcy5vbkRhdGE7XG4gICAgdGhpcy5vbk1ldGEgPSBjYWxsYmFja3Mub25NZXRhO1xuICAgIHRoaXMub25QcmVzID0gY2FsbGJhY2tzLm9uUHJlcztcbiAgICB0aGlzLm9uSW5mbyA9IGNhbGxiYWNrcy5vbkluZm87XG4gICAgLy8gQSBzaW5nbGUgZGVzYyB1cGRhdGU7XG4gICAgdGhpcy5vbk1ldGFEZXNjID0gY2FsbGJhY2tzLm9uTWV0YURlc2M7XG4gICAgLy8gQSBzaW5nbGUgc3Vic2NyaXB0aW9uIHJlY29yZDtcbiAgICB0aGlzLm9uTWV0YVN1YiA9IGNhbGxiYWNrcy5vbk1ldGFTdWI7XG4gICAgLy8gQWxsIHN1YnNjcmlwdGlvbiByZWNvcmRzIHJlY2VpdmVkO1xuICAgIHRoaXMub25TdWJzVXBkYXRlZCA9IGNhbGxiYWNrcy5vblN1YnNVcGRhdGVkO1xuICAgIHRoaXMub25UYWdzVXBkYXRlZCA9IGNhbGxiYWNrcy5vblRhZ3NVcGRhdGVkO1xuICAgIHRoaXMub25DcmVkc1VwZGF0ZWQgPSBjYWxsYmFja3Mub25DcmVkc1VwZGF0ZWQ7XG4gICAgdGhpcy5vbkRlbGV0ZVRvcGljID0gY2FsbGJhY2tzLm9uRGVsZXRlVG9waWM7XG4gICAgdGhpcy5vbkFsbE1lc3NhZ2VzUmVjZWl2ZWQgPSBjYWxsYmFja3Mub25BbGxNZXNzYWdlc1JlY2VpdmVkO1xuICB9XG59O1xuXG5Ub3BpYy5wcm90b3R5cGUgPSB7XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgdG9waWMgaXMgc3Vic2NyaWJlZC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaXMgdG9waWMgaXMgYXR0YWNoZWQvc3Vic2NyaWJlZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNTdWJzY3JpYmVkOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fc3Vic2NyaWJlZDtcbiAgfSxcblxuICAvKipcbiAgICogUmVxdWVzdCB0b3BpYyB0byBzdWJzY3JpYmUuIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjc3Vic2NyaWJlfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtUaW5vZGUuR2V0UXVlcnk9fSBnZXRQYXJhbXMgLSBnZXQgcXVlcnkgcGFyYW1ldGVycy5cbiAgICogQHBhcmFtIHtUaW5vZGUuU2V0UGFyYW1zPX0gc2V0UGFyYW1zIC0gc2V0IHBhcmFtZXRlcnMuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byB0aGUgcmVxdWVzdC5cbiAgICovXG4gIHN1YnNjcmliZTogZnVuY3Rpb24oZ2V0UGFyYW1zLCBzZXRQYXJhbXMpIHtcbiAgICAvLyBJZiB0aGUgdG9waWMgaXMgYWxyZWFkeSBzdWJzY3JpYmVkLCByZXR1cm4gcmVzb2x2ZWQgcHJvbWlzZVxuICAgIGlmICh0aGlzLl9zdWJzY3JpYmVkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMpO1xuICAgIH1cblxuICAgIC8vIFNlbmQgc3Vic2NyaWJlIG1lc3NhZ2UsIGhhbmRsZSBhc3luYyByZXNwb25zZS5cbiAgICAvLyBJZiB0b3BpYyBuYW1lIGlzIGV4cGxpY2l0bHkgcHJvdmlkZWQsIHVzZSBpdC4gSWYgbm8gbmFtZSwgdGhlbiBpdCdzIGEgbmV3IGdyb3VwIHRvcGljLFxuICAgIC8vIHVzZSBcIm5ld1wiLlxuICAgIHJldHVybiB0aGlzLl90aW5vZGUuc3Vic2NyaWJlKHRoaXMubmFtZSB8fCBUT1BJQ19ORVcsIGdldFBhcmFtcywgc2V0UGFyYW1zKS50aGVuKChjdHJsKSA9PiB7XG4gICAgICBpZiAoY3RybC5jb2RlID49IDMwMCkge1xuICAgICAgICAvLyBEbyBub3RoaW5nIGlmIHN1YnNjcmlwdGlvbiBzdGF0dXMgaGFzIG5vdCBjaGFuZ2VkLlxuICAgICAgICByZXR1cm4gY3RybDtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fc3Vic2NyaWJlZCA9IHRydWU7XG4gICAgICB0aGlzLmFjcyA9IChjdHJsLnBhcmFtcyAmJiBjdHJsLnBhcmFtcy5hY3MpID8gY3RybC5wYXJhbXMuYWNzIDogdGhpcy5hY3M7XG5cbiAgICAgIC8vIFNldCB0b3BpYyBuYW1lIGZvciBuZXcgdG9waWNzIGFuZCBhZGQgaXQgdG8gY2FjaGUuXG4gICAgICBpZiAodGhpcy5fbmV3KSB7XG4gICAgICAgIHRoaXMuX25ldyA9IGZhbHNlO1xuXG4gICAgICAgIC8vIE5hbWUgbWF5IGNoYW5nZSBuZXcxMjM0NTYgLT4gZ3JwQWJDZEVmXG4gICAgICAgIHRoaXMubmFtZSA9IGN0cmwudG9waWM7XG5cbiAgICAgICAgdGhpcy5jcmVhdGVkID0gY3RybC50cztcbiAgICAgICAgdGhpcy51cGRhdGVkID0gY3RybC50cztcbiAgICAgICAgLy8gRG9uJ3QgYXNzaWduIHRvdWNoZWQsIG90aGVyd2lzZSB0b3BpYyB3aWxsIGJlIHB1dCBvbiB0b3Agb2YgdGhlIGxpc3Qgb24gc3Vic2NyaWJlLlxuXG4gICAgICAgIHRoaXMuX2NhY2hlUHV0U2VsZigpO1xuXG4gICAgICAgIGlmICh0aGlzLm5hbWUgIT0gVE9QSUNfTUUgJiYgdGhpcy5uYW1lICE9IFRPUElDX0ZORCkge1xuICAgICAgICAgIC8vIEFkZCB0aGUgbmV3IHRvcGljIHRvIHRoZSBsaXN0IG9mIGNvbnRhY3RzIG1haW50YWluZWQgYnkgdGhlICdtZScgdG9waWMuXG4gICAgICAgICAgY29uc3QgbWUgPSB0aGlzLl90aW5vZGUuZ2V0TWVUb3BpYygpO1xuICAgICAgICAgIGlmIChtZS5vbk1ldGFTdWIpIHtcbiAgICAgICAgICAgIG1lLm9uTWV0YVN1Yih0aGlzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKG1lLm9uU3Vic1VwZGF0ZWQpIHtcbiAgICAgICAgICAgIG1lLm9uU3Vic1VwZGF0ZWQoW3RoaXMubmFtZV0sIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzZXRQYXJhbXMgJiYgc2V0UGFyYW1zLmRlc2MpIHtcbiAgICAgICAgICBzZXRQYXJhbXMuZGVzYy5fbm9Gb3J3YXJkaW5nID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLl9wcm9jZXNzTWV0YURlc2Moc2V0UGFyYW1zLmRlc2MpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjdHJsO1xuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBkcmFmdCBvZiBhIG1lc3NhZ2Ugd2l0aG91dCBzZW5kaW5nIGl0IHRvIHRoZSBzZXJ2ZXIuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgT2JqZWN0fSBkYXRhIC0gQ29udGVudCB0byB3cmFwIGluIGEgZHJhZnQuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IG5vRWNobyAtIElmIDxjb2RlPnRydWU8L2NvZGU+IHNlcnZlciB3aWxsIG5vdCBlY2hvIG1lc3NhZ2UgYmFjayB0byBvcmlnaW5hdGluZ1xuICAgKiBzZXNzaW9uLiBPdGhlcndpc2UgdGhlIHNlcnZlciB3aWxsIHNlbmQgYSBjb3B5IG9mIHRoZSBtZXNzYWdlIHRvIHNlbmRlci5cbiAgICpcbiAgICogQHJldHVybnMge09iamVjdH0gbWVzc2FnZSBkcmFmdC5cbiAgICovXG4gIGNyZWF0ZU1lc3NhZ2U6IGZ1bmN0aW9uKGRhdGEsIG5vRWNobykge1xuICAgIHJldHVybiB0aGlzLl90aW5vZGUuY3JlYXRlTWVzc2FnZSh0aGlzLm5hbWUsIGRhdGEsIG5vRWNobyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEltbWVkaWF0ZWx5IHB1Ymxpc2ggZGF0YSB0byB0b3BpYy4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNwdWJsaXNofS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmcgfCBPYmplY3R9IGRhdGEgLSBEYXRhIHRvIHB1Ymxpc2gsIGVpdGhlciBwbGFpbiBzdHJpbmcgb3IgYSBEcmFmdHkgb2JqZWN0LlxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBub0VjaG8gLSBJZiA8Y29kZT50cnVlPC9jb2RlPiBzZXJ2ZXIgd2lsbCBub3QgZWNobyBtZXNzYWdlIGJhY2sgdG8gb3JpZ2luYXRpbmdcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHRoZSByZXF1ZXN0LlxuICAgKi9cbiAgcHVibGlzaDogZnVuY3Rpb24oZGF0YSwgbm9FY2hvKSB7XG4gICAgcmV0dXJuIHRoaXMucHVibGlzaE1lc3NhZ2UodGhpcy5jcmVhdGVNZXNzYWdlKGRhdGEsIG5vRWNobykpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBQdWJsaXNoIG1lc3NhZ2UgY3JlYXRlZCBieSB7QGxpbmsgVGlub2RlLlRvcGljI2NyZWF0ZU1lc3NhZ2V9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcHViIC0ge2RhdGF9IG9iamVjdCB0byBwdWJsaXNoLiBNdXN0IGJlIGNyZWF0ZWQgYnkge0BsaW5rIFRpbm9kZS5Ub3BpYyNjcmVhdGVNZXNzYWdlfVxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gdGhlIHJlcXVlc3QuXG4gICAqL1xuICBwdWJsaXNoTWVzc2FnZTogZnVuY3Rpb24ocHViKSB7XG4gICAgaWYgKCF0aGlzLl9zdWJzY3JpYmVkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiQ2Fubm90IHB1Ymxpc2ggb24gaW5hY3RpdmUgdG9waWNcIikpO1xuICAgIH1cblxuICAgIC8vIFVwZGF0ZSBoZWFkZXIgd2l0aCBhdHRhY2htZW50IHJlY29yZHMuXG4gICAgaWYgKERyYWZ0eS5oYXNBdHRhY2htZW50cyhwdWIuY29udGVudCkgJiYgIXB1Yi5oZWFkLmF0dGFjaG1lbnRzKSB7XG4gICAgICBsZXQgYXR0YWNobWVudHMgPSBbXTtcbiAgICAgIERyYWZ0eS5hdHRhY2htZW50cyhwdWIuY29udGVudCwgKGRhdGEpID0+IHtcbiAgICAgICAgYXR0YWNobWVudHMucHVzaChkYXRhLnJlZik7XG4gICAgICB9KTtcbiAgICAgIHB1Yi5oZWFkLmF0dGFjaG1lbnRzID0gYXR0YWNobWVudHM7XG4gICAgfVxuXG4gICAgLy8gU2VuZCBkYXRhLlxuICAgIHB1Yi5fc2VuZGluZyA9IHRydWU7XG4gICAgcHViLl9mYWlsZWQgPSBmYWxzZTtcbiAgICByZXR1cm4gdGhpcy5fdGlub2RlLnB1Ymxpc2hNZXNzYWdlKHB1YikudGhlbigoY3RybCkgPT4ge1xuICAgICAgcHViLl9zZW5kaW5nID0gZmFsc2U7XG4gICAgICBwdWIudHMgPSBjdHJsLnRzO1xuICAgICAgdGhpcy5zd2FwTWVzc2FnZUlkKHB1YiwgY3RybC5wYXJhbXMuc2VxKTtcbiAgICAgIHRoaXMuX3JvdXRlRGF0YShwdWIpO1xuICAgICAgcmV0dXJuIGN0cmw7XG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgdGhpcy5fdGlub2RlLmxvZ2dlcihcIldBUk5JTkc6IE1lc3NhZ2UgcmVqZWN0ZWQgYnkgdGhlIHNlcnZlclwiLCBlcnIpO1xuICAgICAgcHViLl9zZW5kaW5nID0gZmFsc2U7XG4gICAgICBwdWIuX2ZhaWxlZCA9IHRydWU7XG4gICAgICBpZiAodGhpcy5vbkRhdGEpIHtcbiAgICAgICAgdGhpcy5vbkRhdGEoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogQWRkIG1lc3NhZ2UgdG8gbG9jYWwgbWVzc2FnZSBjYWNoZSwgc2VuZCB0byB0aGUgc2VydmVyIHdoZW4gdGhlIHByb21pc2UgaXMgcmVzb2x2ZWQuXG4gICAqIElmIHByb21pc2UgaXMgbnVsbCBvciB1bmRlZmluZWQsIHRoZSBtZXNzYWdlIHdpbGwgYmUgc2VudCBpbW1lZGlhdGVseS5cbiAgICogVGhlIG1lc3NhZ2UgaXMgc2VudCB3aGVuIHRoZVxuICAgKiBUaGUgbWVzc2FnZSBzaG91bGQgYmUgY3JlYXRlZCBieSB7QGxpbmsgVGlub2RlLlRvcGljI2NyZWF0ZU1lc3NhZ2V9LlxuICAgKiBUaGlzIGlzIHByb2JhYmx5IG5vdCB0aGUgZmluYWwgQVBJLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcHViIC0gTWVzc2FnZSB0byB1c2UgYXMgYSBkcmFmdC5cbiAgICogQHBhcmFtIHtQcm9taXNlfSBwcm9tIC0gTWVzc2FnZSB3aWxsIGJlIHNlbnQgd2hlbiB0aGlzIHByb21pc2UgaXMgcmVzb2x2ZWQsIGRpc2NhcmRlZCBpZiByZWplY3RlZC5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IGRlcml2ZWQgcHJvbWlzZS5cbiAgICovXG4gIHB1Ymxpc2hEcmFmdDogZnVuY3Rpb24ocHViLCBwcm9tKSB7XG4gICAgaWYgKCFwcm9tICYmICF0aGlzLl9zdWJzY3JpYmVkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiQ2Fubm90IHB1Ymxpc2ggb24gaW5hY3RpdmUgdG9waWNcIikpO1xuICAgIH1cblxuICAgIGNvbnN0IHNlcSA9IHB1Yi5zZXEgfHwgdGhpcy5fZ2V0UXVldWVkU2VxSWQoKTtcbiAgICBpZiAoIXB1Yi5fbm9Gb3J3YXJkaW5nKSB7XG4gICAgICAvLyBUaGUgJ3NlcScsICd0cycsIGFuZCAnZnJvbScgYXJlIGFkZGVkIHRvIG1pbWljIHtkYXRhfS4gVGhleSBhcmUgcmVtb3ZlZCBsYXRlclxuICAgICAgLy8gYmVmb3JlIHRoZSBtZXNzYWdlIGlzIHNlbnQuXG5cbiAgICAgIHB1Yi5fbm9Gb3J3YXJkaW5nID0gdHJ1ZTtcbiAgICAgIHB1Yi5zZXEgPSBzZXE7XG4gICAgICBwdWIudHMgPSBuZXcgRGF0ZSgpO1xuICAgICAgcHViLmZyb20gPSB0aGlzLl90aW5vZGUuZ2V0Q3VycmVudFVzZXJJRCgpO1xuXG4gICAgICAvLyBEb24ndCBuZWVkIGFuIGVjaG8gbWVzc2FnZSBiZWNhdXNlIHRoZSBtZXNzYWdlIGlzIGFkZGVkIHRvIGxvY2FsIGNhY2hlIHJpZ2h0IGF3YXkuXG4gICAgICBwdWIubm9lY2hvID0gdHJ1ZTtcbiAgICAgIC8vIEFkZCB0byBjYWNoZS5cbiAgICAgIHRoaXMuX21lc3NhZ2VzLnB1dChwdWIpO1xuICAgICAgdGhpcy5fdGlub2RlLl9kYi5hZGRNZXNzYWdlKHB1Yik7XG5cbiAgICAgIGlmICh0aGlzLm9uRGF0YSkge1xuICAgICAgICB0aGlzLm9uRGF0YShwdWIpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBJZiBwcm9taXNlIGlzIHByb3ZpZGVkLCBzZW5kIHRoZSBxdWV1ZWQgbWVzc2FnZSB3aGVuIGl0J3MgcmVzb2x2ZWQuXG4gICAgLy8gSWYgbm8gcHJvbWlzZSBpcyBwcm92aWRlZCwgY3JlYXRlIGEgcmVzb2x2ZWQgb25lIGFuZCBzZW5kIGltbWVkaWF0ZWx5LlxuICAgIHByb20gPSAocHJvbSB8fCBQcm9taXNlLnJlc29sdmUoKSkudGhlbihcbiAgICAgICggLyogYXJndW1lbnQgaWdub3JlZCAqLyApID0+IHtcbiAgICAgICAgaWYgKHB1Yi5fY2FuY2VsbGVkKSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvZGU6IDMwMCxcbiAgICAgICAgICAgIHRleHQ6IFwiY2FuY2VsbGVkXCJcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnB1Ymxpc2hNZXNzYWdlKHB1Yik7XG4gICAgICB9LFxuICAgICAgKGVycikgPT4ge1xuICAgICAgICB0aGlzLl90aW5vZGUubG9nZ2VyKFwiV0FSTklORzogTWVzc2FnZSBkcmFmdCByZWplY3RlZFwiLCBlcnIpO1xuICAgICAgICBwdWIuX3NlbmRpbmcgPSBmYWxzZTtcbiAgICAgICAgcHViLl9mYWlsZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLl9tZXNzYWdlcy5kZWxBdCh0aGlzLl9tZXNzYWdlcy5maW5kKHB1YikpO1xuICAgICAgICB0aGlzLl90aW5vZGUuX2RiLnJlbU1lc3NhZ2VzKHRoaXMubmFtZSwgcHViLnNlcSk7XG4gICAgICAgIGlmICh0aGlzLm9uRGF0YSkge1xuICAgICAgICAgIHRoaXMub25EYXRhKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIHJldHVybiBwcm9tO1xuICB9LFxuXG4gIC8qKlxuICAgKiBMZWF2ZSB0aGUgdG9waWMsIG9wdGlvbmFsbHkgdW5zaWJzY3JpYmUuIExlYXZpbmcgdGhlIHRvcGljIG1lYW5zIHRoZSB0b3BpYyB3aWxsIHN0b3BcbiAgICogcmVjZWl2aW5nIHVwZGF0ZXMgZnJvbSB0aGUgc2VydmVyLiBVbnN1YnNjcmliaW5nIHdpbGwgdGVybWluYXRlIHVzZXIncyByZWxhdGlvbnNoaXAgd2l0aCB0aGUgdG9waWMuXG4gICAqIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjbGVhdmV9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSB1bnN1YiAtIElmIHRydWUsIHVuc3Vic2NyaWJlLCBvdGhlcndpc2UganVzdCBsZWF2ZS5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHRoZSByZXF1ZXN0LlxuICAgKi9cbiAgbGVhdmU6IGZ1bmN0aW9uKHVuc3ViKSB7XG4gICAgLy8gSXQncyBwb3NzaWJsZSB0byB1bnN1YnNjcmliZSAodW5zdWI9PXRydWUpIGZyb20gaW5hY3RpdmUgdG9waWMuXG4gICAgaWYgKCF0aGlzLl9zdWJzY3JpYmVkICYmICF1bnN1Yikge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkNhbm5vdCBsZWF2ZSBpbmFjdGl2ZSB0b3BpY1wiKSk7XG4gICAgfVxuXG4gICAgLy8gU2VuZCBhICdsZWF2ZScgbWVzc2FnZSwgaGFuZGxlIGFzeW5jIHJlc3BvbnNlXG4gICAgcmV0dXJuIHRoaXMuX3Rpbm9kZS5sZWF2ZSh0aGlzLm5hbWUsIHVuc3ViKS50aGVuKChjdHJsKSA9PiB7XG4gICAgICB0aGlzLl9yZXNldFN1YigpO1xuICAgICAgaWYgKHVuc3ViKSB7XG4gICAgICAgIHRoaXMuX3Rpbm9kZS5fZGIucmVtVG9waWModGhpcy5uYW1lKTtcbiAgICAgICAgdGhpcy5fdGlub2RlLmNhY2hlRGVsKCd0b3BpYycsIHRoaXMubmFtZSk7XG4gICAgICAgIHRoaXMuX2dvbmUoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjdHJsO1xuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZXF1ZXN0IHRvcGljIG1ldGFkYXRhIGZyb20gdGhlIHNlcnZlci5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtUaW5vZGUuR2V0UXVlcnl9IHJlcXVlc3QgcGFyYW1ldGVyc1xuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gcmVxdWVzdC5cbiAgICovXG4gIGdldE1ldGE6IGZ1bmN0aW9uKHBhcmFtcykge1xuICAgIC8vIFNlbmQge2dldH0gbWVzc2FnZSwgcmV0dXJuIHByb21pc2UuXG4gICAgcmV0dXJuIHRoaXMuX3Rpbm9kZS5nZXRNZXRhKHRoaXMubmFtZSwgcGFyYW1zKTtcbiAgfSxcblxuICAvKipcbiAgICogUmVxdWVzdCBtb3JlIG1lc3NhZ2VzIGZyb20gdGhlIHNlcnZlclxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gbGltaXQgbnVtYmVyIG9mIG1lc3NhZ2VzIHRvIGdldC5cbiAgICogQHBhcmFtIHtib29sZWFufSBmb3J3YXJkIGlmIHRydWUsIHJlcXVlc3QgbmV3ZXIgbWVzc2FnZXMuXG4gICAqL1xuICBnZXRNZXNzYWdlc1BhZ2U6IGZ1bmN0aW9uKGxpbWl0LCBmb3J3YXJkKSB7XG4gICAgY29uc3QgcXVlcnkgPSB0aGlzLnN0YXJ0TWV0YVF1ZXJ5KCk7XG4gICAgaWYgKGZvcndhcmQpIHtcbiAgICAgIHF1ZXJ5LndpdGhMYXRlckRhdGEobGltaXQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBxdWVyeS53aXRoRWFybGllckRhdGEobGltaXQpO1xuICAgIH1cbiAgICBsZXQgcHJvbWlzZSA9IHRoaXMuZ2V0TWV0YShxdWVyeS5idWlsZCgpKTtcbiAgICBpZiAoIWZvcndhcmQpIHtcbiAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKGN0cmwpID0+IHtcbiAgICAgICAgaWYgKGN0cmwgJiYgY3RybC5wYXJhbXMgJiYgIWN0cmwucGFyYW1zLmNvdW50KSB7XG4gICAgICAgICAgdGhpcy5fbm9FYXJsaWVyTXNncyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfSxcblxuICAvKipcbiAgICogVXBkYXRlIHRvcGljIG1ldGFkYXRhLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5TZXRQYXJhbXN9IHBhcmFtcyBwYXJhbWV0ZXJzIHRvIHVwZGF0ZS5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHJlcXVlc3QuXG4gICAqL1xuICBzZXRNZXRhOiBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICBpZiAocGFyYW1zLnRhZ3MpIHtcbiAgICAgIHBhcmFtcy50YWdzID0gbm9ybWFsaXplQXJyYXkocGFyYW1zLnRhZ3MpO1xuICAgIH1cbiAgICAvLyBTZW5kIFNldCBtZXNzYWdlLCBoYW5kbGUgYXN5bmMgcmVzcG9uc2UuXG4gICAgcmV0dXJuIHRoaXMuX3Rpbm9kZS5zZXRNZXRhKHRoaXMubmFtZSwgcGFyYW1zKVxuICAgICAgLnRoZW4oKGN0cmwpID0+IHtcbiAgICAgICAgaWYgKGN0cmwgJiYgY3RybC5jb2RlID49IDMwMCkge1xuICAgICAgICAgIC8vIE5vdCBtb2RpZmllZFxuICAgICAgICAgIHJldHVybiBjdHJsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBhcmFtcy5zdWIpIHtcbiAgICAgICAgICBwYXJhbXMuc3ViLnRvcGljID0gdGhpcy5uYW1lO1xuICAgICAgICAgIGlmIChjdHJsLnBhcmFtcyAmJiBjdHJsLnBhcmFtcy5hY3MpIHtcbiAgICAgICAgICAgIHBhcmFtcy5zdWIuYWNzID0gY3RybC5wYXJhbXMuYWNzO1xuICAgICAgICAgICAgcGFyYW1zLnN1Yi51cGRhdGVkID0gY3RybC50cztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFwYXJhbXMuc3ViLnVzZXIpIHtcbiAgICAgICAgICAgIC8vIFRoaXMgaXMgYSBzdWJzY3JpcHRpb24gdXBkYXRlIG9mIHRoZSBjdXJyZW50IHVzZXIuXG4gICAgICAgICAgICAvLyBBc3NpZ24gdXNlciBJRCBvdGhlcndpc2UgdGhlIHVwZGF0ZSB3aWxsIGJlIGlnbm9yZWQgYnkgX3Byb2Nlc3NNZXRhU3ViLlxuICAgICAgICAgICAgcGFyYW1zLnN1Yi51c2VyID0gdGhpcy5fdGlub2RlLmdldEN1cnJlbnRVc2VySUQoKTtcbiAgICAgICAgICAgIGlmICghcGFyYW1zLmRlc2MpIHtcbiAgICAgICAgICAgICAgLy8gRm9yY2UgdXBkYXRlIHRvIHRvcGljJ3MgYXNjLlxuICAgICAgICAgICAgICBwYXJhbXMuZGVzYyA9IHt9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBwYXJhbXMuc3ViLl9ub0ZvcndhcmRpbmcgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuX3Byb2Nlc3NNZXRhU3ViKFtwYXJhbXMuc3ViXSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGFyYW1zLmRlc2MpIHtcbiAgICAgICAgICBpZiAoY3RybC5wYXJhbXMgJiYgY3RybC5wYXJhbXMuYWNzKSB7XG4gICAgICAgICAgICBwYXJhbXMuZGVzYy5hY3MgPSBjdHJsLnBhcmFtcy5hY3M7XG4gICAgICAgICAgICBwYXJhbXMuZGVzYy51cGRhdGVkID0gY3RybC50cztcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5fcHJvY2Vzc01ldGFEZXNjKHBhcmFtcy5kZXNjKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwYXJhbXMudGFncykge1xuICAgICAgICAgIHRoaXMuX3Byb2Nlc3NNZXRhVGFncyhwYXJhbXMudGFncyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhcmFtcy5jcmVkKSB7XG4gICAgICAgICAgdGhpcy5fcHJvY2Vzc01ldGFDcmVkcyhbcGFyYW1zLmNyZWRdLCB0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjdHJsO1xuICAgICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBhY2Nlc3MgbW9kZSBvZiB0aGUgY3VycmVudCB1c2VyIG9yIG9mIGFub3RoZXIgdG9waWMgc3Vic3JpYmVyLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gVUlEIG9mIHRoZSB1c2VyIHRvIHVwZGF0ZSBvciBudWxsIHRvIHVwZGF0ZSBjdXJyZW50IHVzZXIuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1cGRhdGUgLSB0aGUgdXBkYXRlIHZhbHVlLCBmdWxsIG9yIGRlbHRhLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gcmVxdWVzdC5cbiAgICovXG4gIHVwZGF0ZU1vZGU6IGZ1bmN0aW9uKHVpZCwgdXBkYXRlKSB7XG4gICAgY29uc3QgdXNlciA9IHVpZCA/IHRoaXMuc3Vic2NyaWJlcih1aWQpIDogbnVsbDtcbiAgICBjb25zdCBhbSA9IHVzZXIgP1xuICAgICAgdXNlci5hY3MudXBkYXRlR2l2ZW4odXBkYXRlKS5nZXRHaXZlbigpIDpcbiAgICAgIHRoaXMuZ2V0QWNjZXNzTW9kZSgpLnVwZGF0ZVdhbnQodXBkYXRlKS5nZXRXYW50KCk7XG5cbiAgICByZXR1cm4gdGhpcy5zZXRNZXRhKHtcbiAgICAgIHN1Yjoge1xuICAgICAgICB1c2VyOiB1aWQsXG4gICAgICAgIG1vZGU6IGFtXG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENyZWF0ZSBuZXcgdG9waWMgc3Vic2NyaXB0aW9uLiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI3NldE1ldGF9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdWlkIC0gSUQgb2YgdGhlIHVzZXIgdG8gaW52aXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gbW9kZSAtIEFjY2VzcyBtb2RlLiA8Y29kZT5udWxsPC9jb2RlPiBtZWFucyB0byB1c2UgZGVmYXVsdC5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHJlcXVlc3QuXG4gICAqL1xuICBpbnZpdGU6IGZ1bmN0aW9uKHVpZCwgbW9kZSkge1xuICAgIHJldHVybiB0aGlzLnNldE1ldGEoe1xuICAgICAgc3ViOiB7XG4gICAgICAgIHVzZXI6IHVpZCxcbiAgICAgICAgbW9kZTogbW9kZVxuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBBcmNoaXZlIG9yIHVuLWFyY2hpdmUgdGhlIHRvcGljLiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI3NldE1ldGF9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGFyY2ggLSB0cnVlIHRvIGFyY2hpdmUgdGhlIHRvcGljLCBmYWxzZSBvdGhlcndpc2UuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byByZXF1ZXN0LlxuICAgKi9cbiAgYXJjaGl2ZTogZnVuY3Rpb24oYXJjaCkge1xuICAgIGlmICh0aGlzLnByaXZhdGUgJiYgdGhpcy5wcml2YXRlLmFyY2ggPT0gYXJjaCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShhcmNoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2V0TWV0YSh7XG4gICAgICBkZXNjOiB7XG4gICAgICAgIHByaXZhdGU6IHtcbiAgICAgICAgICBhcmNoOiBhcmNoID8gdHJ1ZSA6IFRpbm9kZS5ERUxfQ0hBUlxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIERlbGV0ZSBtZXNzYWdlcy4gSGFyZC1kZWxldGluZyBtZXNzYWdlcyByZXF1aXJlcyBPd25lciBwZXJtaXNzaW9uLlxuICAgKiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI2RlbE1lc3NhZ2VzfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtUaW5vZGUuRGVsUmFuZ2VbXX0gcmFuZ2VzIC0gUmFuZ2VzIG9mIG1lc3NhZ2UgSURzIHRvIGRlbGV0ZS5cbiAgICogQHBhcmFtIHtib29sZWFuPX0gaGFyZCAtIEhhcmQgb3Igc29mdCBkZWxldGVcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHJlcXVlc3QuXG4gICAqL1xuICBkZWxNZXNzYWdlczogZnVuY3Rpb24ocmFuZ2VzLCBoYXJkKSB7XG4gICAgaWYgKCF0aGlzLl9zdWJzY3JpYmVkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiQ2Fubm90IGRlbGV0ZSBtZXNzYWdlcyBpbiBpbmFjdGl2ZSB0b3BpY1wiKSk7XG4gICAgfVxuXG4gICAgLy8gU29ydCByYW5nZXMgaW4gYWNjZW5kaW5nIG9yZGVyIGJ5IGxvdywgdGhlIGRlc2NlbmRpbmcgYnkgaGkuXG4gICAgcmFuZ2VzLnNvcnQoKHIxLCByMikgPT4ge1xuICAgICAgaWYgKHIxLmxvdyA8IHIyLmxvdykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChyMS5sb3cgPT0gcjIubG93KSB7XG4gICAgICAgIHJldHVybiAhcjIuaGkgfHwgKHIxLmhpID49IHIyLmhpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcblxuICAgIC8vIFJlbW92ZSBwZW5kaW5nIG1lc3NhZ2VzIGZyb20gcmFuZ2VzIHBvc3NpYmx5IGNsaXBwaW5nIHNvbWUgcmFuZ2VzLlxuICAgIGxldCB0b3NlbmQgPSByYW5nZXMucmVkdWNlKChvdXQsIHIpID0+IHtcbiAgICAgIGlmIChyLmxvdyA8IExPQ0FMX1NFUUlEKSB7XG4gICAgICAgIGlmICghci5oaSB8fCByLmhpIDwgTE9DQUxfU0VRSUQpIHtcbiAgICAgICAgICBvdXQucHVzaChyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBDbGlwIGhpIHRvIG1heCBhbGxvd2VkIHZhbHVlLlxuICAgICAgICAgIG91dC5wdXNoKHtcbiAgICAgICAgICAgIGxvdzogci5sb3csXG4gICAgICAgICAgICBoaTogdGhpcy5fbWF4U2VxICsgMVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0O1xuICAgIH0sIFtdKTtcblxuICAgIC8vIFNlbmQge2RlbH0gbWVzc2FnZSwgcmV0dXJuIHByb21pc2VcbiAgICBsZXQgcmVzdWx0O1xuICAgIGlmICh0b3NlbmQubGVuZ3RoID4gMCkge1xuICAgICAgcmVzdWx0ID0gdGhpcy5fdGlub2RlLmRlbE1lc3NhZ2VzKHRoaXMubmFtZSwgdG9zZW5kLCBoYXJkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0ID0gUHJvbWlzZS5yZXNvbHZlKHtcbiAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgZGVsOiAwXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICAvLyBVcGRhdGUgbG9jYWwgY2FjaGUuXG4gICAgcmV0dXJuIHJlc3VsdC50aGVuKChjdHJsKSA9PiB7XG4gICAgICBpZiAoY3RybC5wYXJhbXMuZGVsID4gdGhpcy5fbWF4RGVsKSB7XG4gICAgICAgIHRoaXMuX21heERlbCA9IGN0cmwucGFyYW1zLmRlbDtcbiAgICAgIH1cblxuICAgICAgcmFuZ2VzLm1hcCgocikgPT4ge1xuICAgICAgICBpZiAoci5oaSkge1xuICAgICAgICAgIHRoaXMuZmx1c2hNZXNzYWdlUmFuZ2Uoci5sb3csIHIuaGkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZmx1c2hNZXNzYWdlKHIubG93KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuX3VwZGF0ZURlbGV0ZWRSYW5nZXMoKTtcblxuICAgICAgaWYgKHRoaXMub25EYXRhKSB7XG4gICAgICAgIC8vIENhbGxpbmcgd2l0aCBubyBwYXJhbWV0ZXJzIHRvIGluZGljYXRlIHRoZSBtZXNzYWdlcyB3ZXJlIGRlbGV0ZWQuXG4gICAgICAgIHRoaXMub25EYXRhKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY3RybDtcbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogRGVsZXRlIGFsbCBtZXNzYWdlcy4gSGFyZC1kZWxldGluZyBtZXNzYWdlcyByZXF1aXJlcyBPd25lciBwZXJtaXNzaW9uLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGhhcmREZWwgLSB0cnVlIGlmIG1lc3NhZ2VzIHNob3VsZCBiZSBoYXJkLWRlbGV0ZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byByZXF1ZXN0LlxuICAgKi9cbiAgZGVsTWVzc2FnZXNBbGw6IGZ1bmN0aW9uKGhhcmREZWwpIHtcbiAgICBpZiAoIXRoaXMuX21heFNlcSB8fCB0aGlzLl9tYXhTZXEgPD0gMCkge1xuICAgICAgLy8gVGhlcmUgYXJlIG5vIG1lc3NhZ2VzIHRvIGRlbGV0ZS5cbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZGVsTWVzc2FnZXMoW3tcbiAgICAgIGxvdzogMSxcbiAgICAgIGhpOiB0aGlzLl9tYXhTZXEgKyAxLFxuICAgICAgX2FsbDogdHJ1ZVxuICAgIH1dLCBoYXJkRGVsKTtcbiAgfSxcblxuICAvKipcbiAgICogRGVsZXRlIG11bHRpcGxlIG1lc3NhZ2VzIGRlZmluZWQgYnkgdGhlaXIgSURzLiBIYXJkLWRlbGV0aW5nIG1lc3NhZ2VzIHJlcXVpcmVzIE93bmVyIHBlcm1pc3Npb24uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7VGlub2RlLkRlbFJhbmdlW119IGxpc3QgLSBsaXN0IG9mIHNlcSBJRHMgdG8gZGVsZXRlXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IGhhcmREZWwgLSB0cnVlIGlmIG1lc3NhZ2VzIHNob3VsZCBiZSBoYXJkLWRlbGV0ZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byByZXF1ZXN0LlxuICAgKi9cbiAgZGVsTWVzc2FnZXNMaXN0OiBmdW5jdGlvbihsaXN0LCBoYXJkRGVsKSB7XG4gICAgLy8gU29ydCB0aGUgbGlzdCBpbiBhc2NlbmRpbmcgb3JkZXJcbiAgICBsaXN0LnNvcnQoKGEsIGIpID0+IGEgLSBiKTtcbiAgICAvLyBDb252ZXJ0IHRoZSBhcnJheSBvZiBJRHMgdG8gcmFuZ2VzLlxuICAgIGxldCByYW5nZXMgPSBsaXN0LnJlZHVjZSgob3V0LCBpZCkgPT4ge1xuICAgICAgaWYgKG91dC5sZW5ndGggPT0gMCkge1xuICAgICAgICAvLyBGaXJzdCBlbGVtZW50LlxuICAgICAgICBvdXQucHVzaCh7XG4gICAgICAgICAgbG93OiBpZFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBwcmV2ID0gb3V0W291dC5sZW5ndGggLSAxXTtcbiAgICAgICAgaWYgKCghcHJldi5oaSAmJiAoaWQgIT0gcHJldi5sb3cgKyAxKSkgfHwgKGlkID4gcHJldi5oaSkpIHtcbiAgICAgICAgICAvLyBOZXcgcmFuZ2UuXG4gICAgICAgICAgb3V0LnB1c2goe1xuICAgICAgICAgICAgbG93OiBpZFxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIEV4cGFuZCBleGlzdGluZyByYW5nZS5cbiAgICAgICAgICBwcmV2LmhpID0gcHJldi5oaSA/IE1hdGgubWF4KHByZXYuaGksIGlkICsgMSkgOiBpZCArIDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBvdXQ7XG4gICAgfSwgW10pO1xuICAgIC8vIFNlbmQge2RlbH0gbWVzc2FnZSwgcmV0dXJuIHByb21pc2VcbiAgICByZXR1cm4gdGhpcy5kZWxNZXNzYWdlcyhyYW5nZXMsIGhhcmREZWwpXG4gIH0sXG5cbiAgLyoqXG4gICAqIERlbGV0ZSB0b3BpYy4gUmVxdWlyZXMgT3duZXIgcGVybWlzc2lvbi4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNkZWxUb3BpY30uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gaGFyZCAtIGhhZC1kZWxldGUgdG9waWMuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byB0aGUgcmVxdWVzdC5cbiAgICovXG4gIGRlbFRvcGljOiBmdW5jdGlvbihoYXJkKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Rpbm9kZS5kZWxUb3BpYyh0aGlzLm5hbWUsIGhhcmQpLnRoZW4oKGN0cmwpID0+IHtcbiAgICAgIHRoaXMuX3Jlc2V0U3ViKCk7XG4gICAgICB0aGlzLl9nb25lKCk7XG4gICAgICByZXR1cm4gY3RybDtcbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogRGVsZXRlIHN1YnNjcmlwdGlvbi4gUmVxdWlyZXMgU2hhcmUgcGVybWlzc2lvbi4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNkZWxTdWJzY3JpcHRpb259LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXNlciAtIElEIG9mIHRoZSB1c2VyIHRvIHJlbW92ZSBzdWJzY3JpcHRpb24gZm9yLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gcmVxdWVzdC5cbiAgICovXG4gIGRlbFN1YnNjcmlwdGlvbjogZnVuY3Rpb24odXNlcikge1xuICAgIGlmICghdGhpcy5fc3Vic2NyaWJlZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkNhbm5vdCBkZWxldGUgc3Vic2NyaXB0aW9uIGluIGluYWN0aXZlIHRvcGljXCIpKTtcbiAgICB9XG4gICAgLy8gU2VuZCB7ZGVsfSBtZXNzYWdlLCByZXR1cm4gcHJvbWlzZVxuICAgIHJldHVybiB0aGlzLl90aW5vZGUuZGVsU3Vic2NyaXB0aW9uKHRoaXMubmFtZSwgdXNlcikudGhlbigoY3RybCkgPT4ge1xuICAgICAgLy8gUmVtb3ZlIHRoZSBvYmplY3QgZnJvbSB0aGUgc3Vic2NyaXB0aW9uIGNhY2hlO1xuICAgICAgZGVsZXRlIHRoaXMuX3VzZXJzW3VzZXJdO1xuICAgICAgLy8gTm90aWZ5IGxpc3RlbmVyc1xuICAgICAgaWYgKHRoaXMub25TdWJzVXBkYXRlZCkge1xuICAgICAgICB0aGlzLm9uU3Vic1VwZGF0ZWQoT2JqZWN0LmtleXModGhpcy5fdXNlcnMpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjdHJsO1xuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTZW5kIGEgcmVhZC9yZWN2IG5vdGlmaWNhdGlvbi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHdoYXQgLSB3aGF0IG5vdGlmaWNhdGlvbiB0byBzZW5kOiA8Y29kZT5yZWN2PC9jb2RlPiwgPGNvZGU+cmVhZDwvY29kZT4uXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXEgLSBJRCBvciB0aGUgbWVzc2FnZSByZWFkIG9yIHJlY2VpdmVkLlxuICAgKi9cbiAgbm90ZTogZnVuY3Rpb24od2hhdCwgc2VxKSB7XG4gICAgaWYgKCF0aGlzLl9zdWJzY3JpYmVkKSB7XG4gICAgICAvLyBDYW5ub3Qgc2VuZGluZyB7bm90ZX0gb24gYW4gaW5hY3RpdmUgdG9waWNcIi5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBVcGRhdGUgbG9jYWwgY2FjaGUgd2l0aCB0aGUgbmV3IGNvdW50LlxuICAgIGNvbnN0IHVzZXIgPSB0aGlzLl91c2Vyc1t0aGlzLl90aW5vZGUuZ2V0Q3VycmVudFVzZXJJRCgpXTtcbiAgICBsZXQgdXBkYXRlID0gZmFsc2U7XG4gICAgaWYgKHVzZXIpIHtcbiAgICAgIC8vIFNlbGYtc3Vic2NyaXB0aW9uIGlzIGZvdW5kLlxuICAgICAgaWYgKCF1c2VyW3doYXRdIHx8IHVzZXJbd2hhdF0gPCBzZXEpIHtcbiAgICAgICAgdXNlclt3aGF0XSA9IHNlcTtcbiAgICAgICAgdXBkYXRlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gU2VsZi1zdWJzY3JpcHRpb24gaXMgbm90IGZvdW5kLlxuICAgICAgdXBkYXRlID0gKHRoaXNbd2hhdF0gfCAwKSA8IHNlcTtcbiAgICB9XG5cbiAgICBpZiAodXBkYXRlKSB7XG4gICAgICAvLyBTZW5kIG5vdGlmaWNhdGlvbiB0byB0aGUgc2VydmVyLlxuICAgICAgdGhpcy5fdGlub2RlLm5vdGUodGhpcy5uYW1lLCB3aGF0LCBzZXEpO1xuICAgICAgLy8gVXBkYXRlIGxvY2FsbHkgY2FjaGVkIGNvbnRhY3Qgd2l0aCB0aGUgbmV3IGNvdW50LlxuICAgICAgdGhpcy5fdXBkYXRlUmVhZFJlY3Yod2hhdCwgc2VxKTtcblxuICAgICAgaWYgKHRoaXMuYWNzICE9IG51bGwgJiYgIXRoaXMuYWNzLmlzTXV0ZWQoKSkge1xuICAgICAgICBjb25zdCBtZSA9IHRoaXMuX3Rpbm9kZS5nZXRNZVRvcGljKCk7XG4gICAgICAgIC8vIFNlbnQgYSBub3RpZmljYXRpb24gdG8gJ21lJyBsaXN0ZW5lcnMuXG4gICAgICAgIG1lLl9yZWZyZXNoQ29udGFjdCh3aGF0LCB0aGlzKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNlbmQgYSAncmVjdicgcmVjZWlwdC4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNub3RlUmVjdn0uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXEgLSBJRCBvZiB0aGUgbWVzc2FnZSB0byBha25vd2xlZGdlLlxuICAgKi9cbiAgbm90ZVJlY3Y6IGZ1bmN0aW9uKHNlcSkge1xuICAgIHRoaXMubm90ZSgncmVjdicsIHNlcSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNlbmQgYSAncmVhZCcgcmVjZWlwdC4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNub3RlUmVhZH0uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXEgLSBJRCBvZiB0aGUgbWVzc2FnZSB0byBha25vd2xlZGdlIG9yIDAvdW5kZWZpbmVkIHRvIGFja25vd2xlZGdlIHRoZSBsYXRlc3QgbWVzc2FnZXMuXG4gICAqL1xuICBub3RlUmVhZDogZnVuY3Rpb24oc2VxKSB7XG4gICAgc2VxID0gc2VxIHx8IHRoaXMuX21heFNlcTtcbiAgICBpZiAoc2VxID4gMCkge1xuICAgICAgdGhpcy5ub3RlKCdyZWFkJywgc2VxKTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNlbmQgYSBrZXktcHJlc3Mgbm90aWZpY2F0aW9uLiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI25vdGVLZXlQcmVzc30uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqL1xuICBub3RlS2V5UHJlc3M6IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLl9zdWJzY3JpYmVkKSB7XG4gICAgICB0aGlzLl90aW5vZGUubm90ZUtleVByZXNzKHRoaXMubmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3Rpbm9kZS5sb2dnZXIoXCJJTkZPOiBDYW5ub3Qgc2VuZCBub3RpZmljYXRpb24gaW4gaW5hY3RpdmUgdG9waWNcIik7XG4gICAgfVxuICB9LFxuXG4gIC8vIFVwZGF0ZSBjYWNoZWQgcmVhZC9yZWN2L3VucmVhZCBjb3VudHMuXG4gIF91cGRhdGVSZWFkUmVjdjogZnVuY3Rpb24od2hhdCwgc2VxLCB0cykge1xuICAgIGxldCBvbGRWYWwsIGRvVXBkYXRlID0gZmFsc2U7XG5cbiAgICBzZXEgPSBzZXEgfCAwO1xuICAgIHRoaXMuc2VxID0gdGhpcy5zZXEgfCAwO1xuICAgIHRoaXMucmVhZCA9IHRoaXMucmVhZCB8IDA7XG4gICAgdGhpcy5yZWN2ID0gdGhpcy5yZWN2IHwgMDtcbiAgICBzd2l0Y2ggKHdoYXQpIHtcbiAgICAgIGNhc2UgJ3JlY3YnOlxuICAgICAgICBvbGRWYWwgPSB0aGlzLnJlY3Y7XG4gICAgICAgIHRoaXMucmVjdiA9IE1hdGgubWF4KHRoaXMucmVjdiwgc2VxKTtcbiAgICAgICAgZG9VcGRhdGUgPSAob2xkVmFsICE9IHRoaXMucmVjdik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncmVhZCc6XG4gICAgICAgIG9sZFZhbCA9IHRoaXMucmVhZDtcbiAgICAgICAgdGhpcy5yZWFkID0gTWF0aC5tYXgodGhpcy5yZWFkLCBzZXEpO1xuICAgICAgICBkb1VwZGF0ZSA9IChvbGRWYWwgIT0gdGhpcy5yZWFkKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtc2cnOlxuICAgICAgICBvbGRWYWwgPSB0aGlzLnNlcTtcbiAgICAgICAgdGhpcy5zZXEgPSBNYXRoLm1heCh0aGlzLnNlcSwgc2VxKTtcbiAgICAgICAgaWYgKCF0aGlzLnRvdWNoZWQgfHwgdGhpcy50b3VjaGVkIDwgdHMpIHtcbiAgICAgICAgICB0aGlzLnRvdWNoZWQgPSB0cztcbiAgICAgICAgfVxuICAgICAgICBkb1VwZGF0ZSA9IChvbGRWYWwgIT0gdGhpcy5zZXEpO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyBTYW5pdHkgY2hlY2tzLlxuICAgIGlmICh0aGlzLnJlY3YgPCB0aGlzLnJlYWQpIHtcbiAgICAgIHRoaXMucmVjdiA9IHRoaXMucmVhZDtcbiAgICAgIGRvVXBkYXRlID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKHRoaXMuc2VxIDwgdGhpcy5yZWN2KSB7XG4gICAgICB0aGlzLnNlcSA9IHRoaXMucmVjdjtcbiAgICAgIGlmICghdGhpcy50b3VjaGVkIHx8IHRoaXMudG91Y2hlZCA8IHRzKSB7XG4gICAgICAgIHRoaXMudG91Y2hlZCA9IHRzO1xuICAgICAgfVxuICAgICAgZG9VcGRhdGUgPSB0cnVlO1xuICAgIH1cbiAgICB0aGlzLnVucmVhZCA9IHRoaXMuc2VxIC0gdGhpcy5yZWFkO1xuICAgIHJldHVybiBkb1VwZGF0ZTtcbiAgfSxcblxuICAvKipcbiAgICogR2V0IHVzZXIgZGVzY3JpcHRpb24gZnJvbSBnbG9iYWwgY2FjaGUuIFRoZSB1c2VyIGRvZXMgbm90IG5lZWQgdG8gYmUgYVxuICAgKiBzdWJzY3JpYmVyIG9mIHRoaXMgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBJRCBvZiB0aGUgdXNlciB0byBmZXRjaC5cbiAgICogQHJldHVybiB7T2JqZWN0fSB1c2VyIGRlc2NyaXB0aW9uIG9yIHVuZGVmaW5lZC5cbiAgICovXG4gIHVzZXJEZXNjOiBmdW5jdGlvbih1aWQpIHtcbiAgICAvLyBUT0RPKGdlbmUpOiBoYW5kbGUgYXN5bmNocm9ub3VzIHJlcXVlc3RzXG5cbiAgICBjb25zdCB1c2VyID0gdGhpcy5fY2FjaGVHZXRVc2VyKHVpZCk7XG4gICAgaWYgKHVzZXIpIHtcbiAgICAgIHJldHVybiB1c2VyOyAvLyBQcm9taXNlLnJlc29sdmUodXNlcilcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIEdldCBkZXNjcmlwdGlvbiBvZiB0aGUgcDJwIHBlZXIgZnJvbSBzdWJzY3JpcHRpb24gY2FjaGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm4ge09iamVjdH0gcGVlcidzIGRlc2NyaXB0aW9uIG9yIHVuZGVmaW5lZC5cbiAgICovXG4gIHAycFBlZXJEZXNjOiBmdW5jdGlvbigpIHtcbiAgICBpZiAoIXRoaXMuaXNQMlBUeXBlKCkpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl91c2Vyc1t0aGlzLm5hbWVdO1xuICB9LFxuXG4gIC8qKlxuICAgKiBJdGVyYXRlIG92ZXIgY2FjaGVkIHN1YnNjcmliZXJzLiBJZiBjYWxsYmFjayBpcyB1bmRlZmluZWQsIHVzZSB0aGlzLm9uTWV0YVN1Yi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSBDYWxsYmFjayB3aGljaCB3aWxsIHJlY2VpdmUgc3Vic2NyaWJlcnMgb25lIGJ5IG9uZS5cbiAgICogQHBhcmFtIHtPYmplY3Q9fSBjb250ZXh0IC0gVmFsdWUgb2YgYHRoaXNgIGluc2lkZSB0aGUgYGNhbGxiYWNrYC5cbiAgICovXG4gIHN1YnNjcmliZXJzOiBmdW5jdGlvbihjYWxsYmFjaywgY29udGV4dCkge1xuICAgIGNvbnN0IGNiID0gKGNhbGxiYWNrIHx8IHRoaXMub25NZXRhU3ViKTtcbiAgICBpZiAoY2IpIHtcbiAgICAgIGZvciAobGV0IGlkeCBpbiB0aGlzLl91c2Vycykge1xuICAgICAgICBjYi5jYWxsKGNvbnRleHQsIHRoaXMuX3VzZXJzW2lkeF0sIGlkeCwgdGhpcy5fdXNlcnMpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogR2V0IGEgY29weSBvZiBjYWNoZWQgdGFncy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHJldHVybiB7QXJyYXkuPHN0cmluZz59IGEgY29weSBvZiB0YWdzXG4gICAqL1xuICB0YWdzOiBmdW5jdGlvbigpIHtcbiAgICAvLyBSZXR1cm4gYSBjb3B5LlxuICAgIHJldHVybiB0aGlzLl90YWdzLnNsaWNlKDApO1xuICB9LFxuXG4gIC8qKlxuICAgKiBHZXQgY2FjaGVkIHN1YnNjcmlwdGlvbiBmb3IgdGhlIGdpdmVuIHVzZXIgSUQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1aWQgLSBpZCBvZiB0aGUgdXNlciB0byBxdWVyeSBmb3JcbiAgICogQHJldHVybiB1c2VyIGRlc2NyaXB0aW9uIG9yIHVuZGVmaW5lZC5cbiAgICovXG4gIHN1YnNjcmliZXI6IGZ1bmN0aW9uKHVpZCkge1xuICAgIHJldHVybiB0aGlzLl91c2Vyc1t1aWRdO1xuICB9LFxuXG4gIC8qKlxuICAgKiBJdGVyYXRlIG92ZXIgY2FjaGVkIG1lc3NhZ2VzLiBJZiBjYWxsYmFjayBpcyB1bmRlZmluZWQsIHVzZSB0aGlzLm9uRGF0YS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSBDYWxsYmFjayB3aGljaCB3aWxsIHJlY2VpdmUgbWVzc2FnZXMgb25lIGJ5IG9uZS4gU2VlIHtAbGluayBUaW5vZGUuQ0J1ZmZlciNmb3JFYWNofVxuICAgKiBAcGFyYW0ge251bWJlcn0gc2luY2VJZCAtIE9wdGlvbmFsIHNlcUlkIHRvIHN0YXJ0IGl0ZXJhdGluZyBmcm9tIChpbmNsdXNpdmUpLlxuICAgKiBAcGFyYW0ge251bWJlcn0gYmVmb3JlSWQgLSBPcHRpb25hbCBzZXFJZCB0byBzdG9wIGl0ZXJhdGluZyBiZWZvcmUgKGV4Y2x1c2l2ZSkuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gVmFsdWUgb2YgYHRoaXNgIGluc2lkZSB0aGUgYGNhbGxiYWNrYC5cbiAgICovXG4gIG1lc3NhZ2VzOiBmdW5jdGlvbihjYWxsYmFjaywgc2luY2VJZCwgYmVmb3JlSWQsIGNvbnRleHQpIHtcbiAgICBjb25zdCBjYiA9IChjYWxsYmFjayB8fCB0aGlzLm9uRGF0YSk7XG4gICAgaWYgKGNiKSB7XG4gICAgICBsZXQgc3RhcnRJZHggPSB0eXBlb2Ygc2luY2VJZCA9PSAnbnVtYmVyJyA/IHRoaXMuX21lc3NhZ2VzLmZpbmQoe1xuICAgICAgICBzZXE6IHNpbmNlSWRcbiAgICAgIH0sIHRydWUpIDogdW5kZWZpbmVkO1xuICAgICAgbGV0IGJlZm9yZUlkeCA9IHR5cGVvZiBiZWZvcmVJZCA9PSAnbnVtYmVyJyA/IHRoaXMuX21lc3NhZ2VzLmZpbmQoe1xuICAgICAgICBzZXE6IGJlZm9yZUlkXG4gICAgICB9LCB0cnVlKSA6IHVuZGVmaW5lZDtcbiAgICAgIGlmIChzdGFydElkeCAhPSAtMSAmJiBiZWZvcmVJZHggIT0gLTEpIHtcbiAgICAgICAgdGhpcy5fbWVzc2FnZXMuZm9yRWFjaChjYiwgc3RhcnRJZHgsIGJlZm9yZUlkeCwgY29udGV4dCk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIG1vc3QgcmVjZW50IG1lc3NhZ2UgZnJvbSBjYWNoZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHJldHVybnMge09iamVjdH0gdGhlIG1vc3QgcmVjZW50IGNhY2hlZCBtZXNzYWdlIG9yIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4sIGlmIG5vIG1lc3NhZ2VzIGFyZSBjYWNoZWQuXG4gICAqL1xuICBsYXRlc3RNZXNzYWdlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fbWVzc2FnZXMuZ2V0TGFzdCgpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBJdGVyYXRlIG92ZXIgY2FjaGVkIHVuc2VudCBtZXNzYWdlcy4gV3JhcHMge0BsaW5rIFRpbm9kZS5Ub3BpYyNtZXNzYWdlc30uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0gQ2FsbGJhY2sgd2hpY2ggd2lsbCByZWNlaXZlIG1lc3NhZ2VzIG9uZSBieSBvbmUuIFNlZSB7QGxpbmsgVGlub2RlLkNCdWZmZXIjZm9yRWFjaH1cbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSBWYWx1ZSBvZiA8Y29kZT50aGlzPC9jb2RlPiBpbnNpZGUgdGhlIDxjb2RlPmNhbGxiYWNrPC9jb2RlPi5cbiAgICovXG4gIHF1ZXVlZE1lc3NhZ2VzOiBmdW5jdGlvbihjYWxsYmFjaywgY29udGV4dCkge1xuICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbGxiYWNrIG11c3QgYmUgcHJvdmlkZWRcIik7XG4gICAgfVxuICAgIHRoaXMubWVzc2FnZXMoY2FsbGJhY2ssIExPQ0FMX1NFUUlELCB1bmRlZmluZWQsIGNvbnRleHQpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIG51bWJlciBvZiB0b3BpYyBzdWJzY3JpYmVycyB3aG8gbWFya2VkIHRoaXMgbWVzc2FnZSBhcyBlaXRoZXIgcmVjdiBvciByZWFkXG4gICAqIEN1cnJlbnQgdXNlciBpcyBleGNsdWRlZCBmcm9tIHRoZSBjb3VudC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHdoYXQgLSB3aGF0IGFjdGlvbiB0byBjb25zaWRlcjogcmVjZWl2ZWQgPGNvZGU+XCJyZWN2XCI8L2NvZGU+IG9yIHJlYWQgPGNvZGU+XCJyZWFkXCI8L2NvZGU+LlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2VxIC0gSUQgb3IgdGhlIG1lc3NhZ2UgcmVhZCBvciByZWNlaXZlZC5cbiAgICpcbiAgICogQHJldHVybnMge251bWJlcn0gdGhlIG51bWJlciBvZiBzdWJzY3JpYmVycyB3aG8gbWFya2VkIHRoZSBtZXNzYWdlIHdpdGggdGhlIGdpdmVuIElEIGFzIHJlYWQgb3IgcmVjZWl2ZWQuXG4gICAqL1xuICBtc2dSZWNlaXB0Q291bnQ6IGZ1bmN0aW9uKHdoYXQsIHNlcSkge1xuICAgIGxldCBjb3VudCA9IDA7XG4gICAgaWYgKHNlcSA+IDApIHtcbiAgICAgIGNvbnN0IG1lID0gdGhpcy5fdGlub2RlLmdldEN1cnJlbnRVc2VySUQoKTtcbiAgICAgIGZvciAobGV0IGlkeCBpbiB0aGlzLl91c2Vycykge1xuICAgICAgICBjb25zdCB1c2VyID0gdGhpcy5fdXNlcnNbaWR4XTtcbiAgICAgICAgaWYgKHVzZXIudXNlciAhPT0gbWUgJiYgdXNlclt3aGF0XSA+PSBzZXEpIHtcbiAgICAgICAgICBjb3VudCsrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb3VudDtcbiAgfSxcblxuICAvKipcbiAgICogR2V0IHRoZSBudW1iZXIgb2YgdG9waWMgc3Vic2NyaWJlcnMgd2hvIG1hcmtlZCB0aGlzIG1lc3NhZ2UgKGFuZCBhbGwgb2xkZXIgbWVzc2FnZXMpIGFzIHJlYWQuXG4gICAqIFRoZSBjdXJyZW50IHVzZXIgaXMgZXhjbHVkZWQgZnJvbSB0aGUgY291bnQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXEgLSBtZXNzYWdlIGlkIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBudW1iZXIgb2Ygc3Vic2NyaWJlcnMgd2hvIGNsYWltIHRvIGhhdmUgcmVjZWl2ZWQgdGhlIG1lc3NhZ2UuXG4gICAqL1xuICBtc2dSZWFkQ291bnQ6IGZ1bmN0aW9uKHNlcSkge1xuICAgIHJldHVybiB0aGlzLm1zZ1JlY2VpcHRDb3VudCgncmVhZCcsIHNlcSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEdldCB0aGUgbnVtYmVyIG9mIHRvcGljIHN1YnNjcmliZXJzIHdobyBtYXJrZWQgdGhpcyBtZXNzYWdlIChhbmQgYWxsIG9sZGVyIG1lc3NhZ2VzKSBhcyByZWNlaXZlZC5cbiAgICogVGhlIGN1cnJlbnQgdXNlciBpcyBleGNsdWRlZCBmcm9tIHRoZSBjb3VudC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHNlcSAtIE1lc3NhZ2UgaWQgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IE51bWJlciBvZiBzdWJzY3JpYmVycyB3aG8gY2xhaW0gdG8gaGF2ZSByZWNlaXZlZCB0aGUgbWVzc2FnZS5cbiAgICovXG4gIG1zZ1JlY3ZDb3VudDogZnVuY3Rpb24oc2VxKSB7XG4gICAgcmV0dXJuIHRoaXMubXNnUmVjZWlwdENvdW50KCdyZWN2Jywgc2VxKTtcbiAgfSxcblxuICAvKipcbiAgICogQ2hlY2sgaWYgY2FjaGVkIG1lc3NhZ2UgSURzIGluZGljYXRlIHRoYXQgdGhlIHNlcnZlciBtYXkgaGF2ZSBtb3JlIG1lc3NhZ2VzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IG5ld2VyIC0gaWYgPGNvZGU+dHJ1ZTwvY29kZT4sIGNoZWNrIGZvciBuZXdlciBtZXNzYWdlcyBvbmx5LlxuICAgKi9cbiAgbXNnSGFzTW9yZU1lc3NhZ2VzOiBmdW5jdGlvbihuZXdlcikge1xuICAgIHJldHVybiBuZXdlciA/IHRoaXMuc2VxID4gdGhpcy5fbWF4U2VxIDpcbiAgICAgIC8vIF9taW5TZXEgY291bGQgYmUgbW9yZSB0aGFuIDEsIGJ1dCBlYXJsaWVyIG1lc3NhZ2VzIGNvdWxkIGhhdmUgYmVlbiBkZWxldGVkLlxuICAgICAgKHRoaXMuX21pblNlcSA+IDEgJiYgIXRoaXMuX25vRWFybGllck1zZ3MpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgZ2l2ZW4gc2VxIElkIGlzIGlkIG9mIHRoZSBtb3N0IHJlY2VudCBtZXNzYWdlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2VxSWQgaWQgb2YgdGhlIG1lc3NhZ2UgdG8gY2hlY2tcbiAgICovXG4gIGlzTmV3TWVzc2FnZTogZnVuY3Rpb24oc2VxSWQpIHtcbiAgICByZXR1cm4gdGhpcy5fbWF4U2VxIDw9IHNlcUlkO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZW1vdmUgb25lIG1lc3NhZ2UgZnJvbSBsb2NhbCBjYWNoZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHNlcUlkIGlkIG9mIHRoZSBtZXNzYWdlIHRvIHJlbW92ZSBmcm9tIGNhY2hlLlxuICAgKiBAcmV0dXJucyB7TWVzc2FnZX0gcmVtb3ZlZCBtZXNzYWdlIG9yIHVuZGVmaW5lZCBpZiBzdWNoIG1lc3NhZ2Ugd2FzIG5vdCBmb3VuZC5cbiAgICovXG4gIGZsdXNoTWVzc2FnZTogZnVuY3Rpb24oc2VxSWQpIHtcbiAgICBjb25zdCBpZHggPSB0aGlzLl9tZXNzYWdlcy5maW5kKHtcbiAgICAgIHNlcTogc2VxSWRcbiAgICB9KTtcbiAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgIHRoaXMuX3Rpbm9kZS5fZGIucmVtTWVzc2FnZXModGhpcy5uYW1lLCBzZXFJZCk7XG4gICAgICByZXR1cm4gdGhpcy5fbWVzc2FnZXMuZGVsQXQoaWR4KTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfSxcblxuICAvKipcbiAgICogVXBkYXRlIG1lc3NhZ2UncyBzZXFJZC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHB1YiBtZXNzYWdlIG9iamVjdC5cbiAgICogQHBhcmFtIHtudW1iZXJ9IG5ld1NlcUlkIG5ldyBzZXEgaWQgZm9yIHB1Yi5cbiAgICovXG4gIHN3YXBNZXNzYWdlSWQ6IGZ1bmN0aW9uKHB1YiwgbmV3U2VxSWQpIHtcbiAgICBjb25zdCBpZHggPSB0aGlzLl9tZXNzYWdlcy5maW5kKHB1Yik7XG4gICAgY29uc3QgbnVtTWVzc2FnZXMgPSB0aGlzLl9tZXNzYWdlcy5sZW5ndGgoKTtcbiAgICBpZiAoMCA8PSBpZHggJiYgaWR4IDwgbnVtTWVzc2FnZXMpIHtcbiAgICAgIC8vIFJlbW92ZSBtZXNzYWdlIHdpdGggdGhlIG9sZCBzZXEgSUQuXG4gICAgICB0aGlzLl9tZXNzYWdlcy5kZWxBdChpZHgpO1xuICAgICAgdGhpcy5fdGlub2RlLl9kYi5yZW1NZXNzYWdlcyh0aGlzLm5hbWUsIHB1Yi5zZXEpO1xuICAgICAgLy8gQWRkIG1lc3NhZ2Ugd2l0aCB0aGUgbmV3IHNlcSBJRC5cbiAgICAgIHB1Yi5zZXEgPSBuZXdTZXFJZDtcbiAgICAgIHRoaXMuX21lc3NhZ2VzLnB1dChwdWIpO1xuICAgICAgdGhpcy5fdGlub2RlLl9kYi5hZGRNZXNzYWdlKHB1Yik7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSByYW5nZSBvZiBtZXNzYWdlcyBmcm9tIHRoZSBsb2NhbCBjYWNoZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IGZyb21JZCBzZXEgSUQgb2YgdGhlIGZpcnN0IG1lc3NhZ2UgdG8gcmVtb3ZlIChpbmNsdXNpdmUpLlxuICAgKiBAcGFyYW0ge251bWJlcn0gdW50aWxJZCBzZXFJRCBvZiB0aGUgbGFzdCBtZXNzYWdlIHRvIHJlbW92ZSAoZXhjbHVzaXZlKS5cbiAgICpcbiAgICogQHJldHVybnMge01lc3NhZ2VbXX0gYXJyYXkgb2YgcmVtb3ZlZCBtZXNzYWdlcyAoY291bGQgYmUgZW1wdHkpLlxuICAgKi9cbiAgZmx1c2hNZXNzYWdlUmFuZ2U6IGZ1bmN0aW9uKGZyb21JZCwgdW50aWxJZCkge1xuICAgIC8vIFJlbW92ZSByYW5nZSBmcm9tIHBlcnNpc3RlbnQgY2FjaGUuXG4gICAgdGhpcy5fdGlub2RlLl9kYi5yZW1NZXNzYWdlcyh0aGlzLm5hbWUsIGZyb21JZCwgdW50aWxJZCk7XG4gICAgLy8gc3RhcnQsIGVuZDogZmluZCBpbnNlcnRpb24gcG9pbnRzIChuZWFyZXN0ID09IHRydWUpLlxuICAgIGNvbnN0IHNpbmNlID0gdGhpcy5fbWVzc2FnZXMuZmluZCh7XG4gICAgICBzZXE6IGZyb21JZFxuICAgIH0sIHRydWUpO1xuICAgIHJldHVybiBzaW5jZSA+PSAwID8gdGhpcy5fbWVzc2FnZXMuZGVsUmFuZ2Uoc2luY2UsIHRoaXMuX21lc3NhZ2VzLmZpbmQoe1xuICAgICAgc2VxOiB1bnRpbElkXG4gICAgfSwgdHJ1ZSkpIDogW107XG4gIH0sXG5cbiAgLyoqXG4gICAqIEF0dGVtcHQgdG8gc3RvcCBtZXNzYWdlIGZyb20gYmVpbmcgc2VudC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHNlcUlkIGlkIG9mIHRoZSBtZXNzYWdlIHRvIHN0b3Agc2VuZGluZyBhbmQgcmVtb3ZlIGZyb20gY2FjaGUuXG4gICAqXG4gICAqIEByZXR1cm5zIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiBtZXNzYWdlIHdhcyBjYW5jZWxsZWQsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBjYW5jZWxTZW5kOiBmdW5jdGlvbihzZXFJZCkge1xuICAgIGNvbnN0IGlkeCA9IHRoaXMuX21lc3NhZ2VzLmZpbmQoe1xuICAgICAgc2VxOiBzZXFJZFxuICAgIH0pO1xuICAgIGlmIChpZHggPj0gMCkge1xuICAgICAgY29uc3QgbXNnID0gdGhpcy5fbWVzc2FnZXMuZ2V0QXQoaWR4KTtcbiAgICAgIGNvbnN0IHN0YXR1cyA9IHRoaXMubXNnU3RhdHVzKG1zZyk7XG4gICAgICBpZiAoc3RhdHVzID09IE1FU1NBR0VfU1RBVFVTX1FVRVVFRCB8fCBzdGF0dXMgPT0gTUVTU0FHRV9TVEFUVVNfRkFJTEVEKSB7XG4gICAgICAgIHRoaXMuX3Rpbm9kZS5fZGIucmVtTWVzc2FnZXModGhpcy5uYW1lLCBzZXFJZCk7XG4gICAgICAgIG1zZy5fY2FuY2VsbGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fbWVzc2FnZXMuZGVsQXQoaWR4KTtcbiAgICAgICAgaWYgKHRoaXMub25EYXRhKSB7XG4gICAgICAgICAgLy8gQ2FsbGluZyB3aXRoIG5vIHBhcmFtZXRlcnMgdG8gaW5kaWNhdGUgdGhlIG1lc3NhZ2Ugd2FzIGRlbGV0ZWQuXG4gICAgICAgICAgdGhpcy5vbkRhdGEoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuXG4gIC8qKlxuICAgKiBHZXQgdHlwZSBvZiB0aGUgdG9waWM6IG1lLCBwMnAsIGdycCwgZm5kLi4uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IE9uZSBvZiAnbWUnLCAncDJwJywgJ2dycCcsICdmbmQnLCAnc3lzJyBvciA8Y29kZT51bmRlZmluZWQ8L2NvZGU+LlxuICAgKi9cbiAgZ2V0VHlwZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFRpbm9kZS50b3BpY1R5cGUodGhpcy5uYW1lKTtcbiAgfSxcblxuICAvKipcbiAgICogR2V0IGN1cnJlbnQgdXNlcidzIGFjY2VzcyBtb2RlIG9mIHRoZSB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5BY2Nlc3NNb2RlfSAtIHVzZXIncyBhY2Nlc3MgbW9kZVxuICAgKi9cbiAgZ2V0QWNjZXNzTW9kZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuYWNzO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTZXQgY3VycmVudCB1c2VyJ3MgYWNjZXNzIG1vZGUgb2YgdGhlIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge0FjY2Vzc01vZGUgfCBPYmplY3R9IGFjcyAtIGFjY2VzcyBtb2RlIHRvIHNldC5cbiAgICovXG4gIHNldEFjY2Vzc01vZGU6IGZ1bmN0aW9uKGFjcykge1xuICAgIHJldHVybiB0aGlzLmFjcyA9IG5ldyBBY2Nlc3NNb2RlKGFjcyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEdldCB0b3BpYydzIGRlZmF1bHQgYWNjZXNzIG1vZGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuRGVmQWNzfSAtIGFjY2VzcyBtb2RlLCBzdWNoIGFzIHthdXRoOiBgUldQYCwgYW5vbjogYE5gfS5cbiAgICovXG4gIGdldERlZmF1bHRBY2Nlc3M6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmRlZmFjcztcbiAgfSxcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBuZXcgbWV0YSB7QGxpbmsgVGlub2RlLkdldFF1ZXJ5fSBidWlsZGVyLiBUaGUgcXVlcnkgaXMgYXR0Y2hlZCB0byB0aGUgY3VycmVudCB0b3BpYy5cbiAgICogSXQgd2lsbCBub3Qgd29yayBjb3JyZWN0bHkgaWYgdXNlZCB3aXRoIGEgZGlmZmVyZW50IHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSBxdWVyeSBhdHRhY2hlZCB0byB0aGUgY3VycmVudCB0b3BpYy5cbiAgICovXG4gIHN0YXJ0TWV0YVF1ZXJ5OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IE1ldGFHZXRCdWlsZGVyKHRoaXMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0b3BpYyBpcyBhcmNoaXZlZCwgaS5lLiBwcml2YXRlLmFyY2ggPT0gdHJ1ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdG9waWMgaXMgYXJjaGl2ZWQsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBpc0FyY2hpdmVkOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5wcml2YXRlICYmIHRoaXMucHJpdmF0ZS5hcmNoID8gdHJ1ZSA6IGZhbHNlO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0b3BpYyBpcyBhICdtZScgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIDxjb2RlPnRydWU8L2NvZGU+IGlmIHRvcGljIGlzIGEgJ21lJyB0b3BpYywgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIGlzTWVUeXBlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gVGlub2RlLmlzTWVUb3BpY05hbWUodGhpcy5uYW1lKTtcbiAgfSxcblxuICAvKipcbiAgICogQ2hlY2sgaWYgdG9waWMgaXMgYSBjaGFubmVsLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0b3BpYyBpcyBhIGNoYW5uZWwsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBpc0NoYW5uZWxUeXBlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gVGlub2RlLmlzQ2hhbm5lbFRvcGljTmFtZSh0aGlzLm5hbWUpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0b3BpYyBpcyBhIGdyb3VwIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0b3BpYyBpcyBhIGdyb3VwLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNHcm91cFR5cGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBUaW5vZGUuaXNHcm91cFRvcGljTmFtZSh0aGlzLm5hbWUpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0b3BpYyBpcyBhIHAycCB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgdG9waWMgaXMgYSBwMnAgdG9waWMsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gICAqL1xuICBpc1AyUFR5cGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBUaW5vZGUuaXNQMlBUb3BpY05hbWUodGhpcy5uYW1lKTtcbiAgfSxcblxuICAvKipcbiAgICogQ2hlY2sgaWYgdG9waWMgaXMgYSBjb21tdW5pY2F0aW9uIHRvcGljLCBpLmUuIGEgZ3JvdXAgb3IgcDJwIHRvcGljLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSA8Y29kZT50cnVlPC9jb2RlPiBpZiB0b3BpYyBpcyBhIHAycCBvciBncm91cCB0b3BpYywgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAgICovXG4gIGlzQ29tbVR5cGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBUaW5vZGUuaXNDb21tVG9waWNOYW1lKHRoaXMubmFtZSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEdldCBzdGF0dXMgKHF1ZXVlZCwgc2VudCwgcmVjZWl2ZWQgZXRjKSBvZiBhIGdpdmVuIG1lc3NhZ2UgaW4gdGhlIGNvbnRleHRcbiAgICogb2YgdGhpcyB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtNZXNzYWdlfSBtc2cgLSBtZXNzYWdlIHRvIGNoZWNrIGZvciBzdGF0dXMuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gdXBkIC0gdXBkYXRlIGNoYWNoZWQgbWVzc2FnZSBzdGF0dXMuXG4gICAqXG4gICAqIEByZXR1cm5zIG1lc3NhZ2Ugc3RhdHVzIGNvbnN0YW50LlxuICAgKi9cbiAgbXNnU3RhdHVzOiBmdW5jdGlvbihtc2csIHVwZCkge1xuICAgIGxldCBzdGF0dXMgPSBNRVNTQUdFX1NUQVRVU19OT05FO1xuICAgIGlmICh0aGlzLl90aW5vZGUuaXNNZShtc2cuZnJvbSkpIHtcbiAgICAgIGlmIChtc2cuX3NlbmRpbmcpIHtcbiAgICAgICAgc3RhdHVzID0gTUVTU0FHRV9TVEFUVVNfU0VORElORztcbiAgICAgIH0gZWxzZSBpZiAobXNnLl9mYWlsZWQgfHwgbXNnLl9jYW5jZWxsZWQpIHtcbiAgICAgICAgc3RhdHVzID0gTUVTU0FHRV9TVEFUVVNfRkFJTEVEO1xuICAgICAgfSBlbHNlIGlmIChtc2cuc2VxID49IExPQ0FMX1NFUUlEKSB7XG4gICAgICAgIHN0YXR1cyA9IE1FU1NBR0VfU1RBVFVTX1FVRVVFRDtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5tc2dSZWFkQ291bnQobXNnLnNlcSkgPiAwKSB7XG4gICAgICAgIHN0YXR1cyA9IE1FU1NBR0VfU1RBVFVTX1JFQUQ7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMubXNnUmVjdkNvdW50KG1zZy5zZXEpID4gMCkge1xuICAgICAgICBzdGF0dXMgPSBNRVNTQUdFX1NUQVRVU19SRUNFSVZFRDtcbiAgICAgIH0gZWxzZSBpZiAobXNnLnNlcSA+IDApIHtcbiAgICAgICAgc3RhdHVzID0gTUVTU0FHRV9TVEFUVVNfU0VOVDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3RhdHVzID0gTUVTU0FHRV9TVEFUVVNfVE9fTUU7XG4gICAgfVxuXG4gICAgaWYgKHVwZCAmJiBtc2cuX3N0YXR1cyAhPSBzdGF0dXMpIHtcbiAgICAgIG1zZy5fc3RhdHVzID0gc3RhdHVzO1xuICAgICAgdGhpcy5fdGlub2RlLl9kYi51cGRNZXNzYWdlU3RhdHVzKHRoaXMubmFtZSwgbXNnLnNlcSwgc3RhdHVzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3RhdHVzO1xuICB9LFxuXG4gIC8vIFByb2Nlc3MgZGF0YSBtZXNzYWdlXG4gIF9yb3V0ZURhdGE6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBpZiAoZGF0YS5jb250ZW50KSB7XG4gICAgICBpZiAoIXRoaXMudG91Y2hlZCB8fCB0aGlzLnRvdWNoZWQgPCBkYXRhLnRzKSB7XG4gICAgICAgIHRoaXMudG91Y2hlZCA9IGRhdGEudHM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGRhdGEuc2VxID4gdGhpcy5fbWF4U2VxKSB7XG4gICAgICB0aGlzLl9tYXhTZXEgPSBkYXRhLnNlcTtcbiAgICB9XG4gICAgaWYgKGRhdGEuc2VxIDwgdGhpcy5fbWluU2VxIHx8IHRoaXMuX21pblNlcSA9PSAwKSB7XG4gICAgICB0aGlzLl9taW5TZXEgPSBkYXRhLnNlcTtcbiAgICB9XG5cbiAgICBpZiAoIWRhdGEuX25vRm9yd2FyZGluZykge1xuICAgICAgdGhpcy5fbWVzc2FnZXMucHV0KGRhdGEpO1xuICAgICAgdGhpcy5fdGlub2RlLl9kYi5hZGRNZXNzYWdlKGRhdGEpO1xuICAgICAgdGhpcy5fdXBkYXRlRGVsZXRlZFJhbmdlcygpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9uRGF0YSkge1xuICAgICAgdGhpcy5vbkRhdGEoZGF0YSk7XG4gICAgfVxuXG4gICAgLy8gVXBkYXRlIGxvY2FsbHkgY2FjaGVkIGNvbnRhY3Qgd2l0aCB0aGUgbmV3IG1lc3NhZ2UgY291bnQuXG4gICAgY29uc3Qgd2hhdCA9ICgoIXRoaXMuaXNDaGFubmVsVHlwZSgpICYmICFkYXRhLmZyb20pIHx8IHRoaXMuX3Rpbm9kZS5pc01lKGRhdGEuZnJvbSkpID8gJ3JlYWQnIDogJ21zZyc7XG4gICAgdGhpcy5fdXBkYXRlUmVhZFJlY3Yod2hhdCwgZGF0YS5zZXEsIGRhdGEudHMpO1xuICAgIC8vIE5vdGlmeSAnbWUnIGxpc3RlbmVycyBvZiB0aGUgY2hhbmdlLlxuICAgIHRoaXMuX3Rpbm9kZS5nZXRNZVRvcGljKCkuX3JlZnJlc2hDb250YWN0KHdoYXQsIHRoaXMpO1xuICB9LFxuXG4gIC8vIFByb2Nlc3MgbWV0YWRhdGEgbWVzc2FnZVxuICBfcm91dGVNZXRhOiBmdW5jdGlvbihtZXRhKSB7XG4gICAgaWYgKG1ldGEuZGVzYykge1xuICAgICAgdGhpcy5fbGFzdERlc2NVcGRhdGUgPSBtZXRhLnRzO1xuICAgICAgdGhpcy5fcHJvY2Vzc01ldGFEZXNjKG1ldGEuZGVzYyk7XG4gICAgfVxuICAgIGlmIChtZXRhLnN1YiAmJiBtZXRhLnN1Yi5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLl9sYXN0U3Vic1VwZGF0ZSA9IG1ldGEudHM7XG4gICAgICB0aGlzLl9wcm9jZXNzTWV0YVN1YihtZXRhLnN1Yik7XG4gICAgfVxuICAgIGlmIChtZXRhLmRlbCkge1xuICAgICAgdGhpcy5fcHJvY2Vzc0RlbE1lc3NhZ2VzKG1ldGEuZGVsLmNsZWFyLCBtZXRhLmRlbC5kZWxzZXEpO1xuICAgIH1cbiAgICBpZiAobWV0YS50YWdzKSB7XG4gICAgICB0aGlzLl9wcm9jZXNzTWV0YVRhZ3MobWV0YS50YWdzKTtcbiAgICB9XG4gICAgaWYgKG1ldGEuY3JlZCkge1xuICAgICAgdGhpcy5fcHJvY2Vzc01ldGFDcmVkcyhtZXRhLmNyZWQpO1xuICAgIH1cbiAgICBpZiAodGhpcy5vbk1ldGEpIHtcbiAgICAgIHRoaXMub25NZXRhKG1ldGEpO1xuICAgIH1cbiAgfSxcblxuICAvLyBQcm9jZXNzIHByZXNlbmNlIGNoYW5nZSBtZXNzYWdlXG4gIF9yb3V0ZVByZXM6IGZ1bmN0aW9uKHByZXMpIHtcbiAgICBsZXQgdXNlcjtcbiAgICBzd2l0Y2ggKHByZXMud2hhdCkge1xuICAgICAgY2FzZSAnZGVsJzpcbiAgICAgICAgLy8gRGVsZXRlIGNhY2hlZCBtZXNzYWdlcy5cbiAgICAgICAgdGhpcy5fcHJvY2Vzc0RlbE1lc3NhZ2VzKHByZXMuY2xlYXIsIHByZXMuZGVsc2VxKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdvbic6XG4gICAgICBjYXNlICdvZmYnOlxuICAgICAgICAvLyBVcGRhdGUgb25saW5lIHN0YXR1cyBvZiBhIHN1YnNjcmlwdGlvbi5cbiAgICAgICAgdXNlciA9IHRoaXMuX3VzZXJzW3ByZXMuc3JjXTtcbiAgICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgICB1c2VyLm9ubGluZSA9IHByZXMud2hhdCA9PSAnb24nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3Rpbm9kZS5sb2dnZXIoXCJXQVJOSU5HOiBQcmVzZW5jZSB1cGRhdGUgZm9yIGFuIHVua25vd24gdXNlclwiLCB0aGlzLm5hbWUsIHByZXMuc3JjKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3Rlcm0nOlxuICAgICAgICAvLyBBdHRhY2htZW50IHRvIHRvcGljIGlzIHRlcm1pbmF0ZWQgcHJvYmFibHkgZHVlIHRvIGNsdXN0ZXIgcmVoYXNoaW5nLlxuICAgICAgICB0aGlzLl9yZXNldFN1YigpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2Fjcyc6XG4gICAgICAgIGNvbnN0IHVpZCA9IHByZXMuc3JjIHx8IHRoaXMuX3Rpbm9kZS5nZXRDdXJyZW50VXNlcklEKCk7XG4gICAgICAgIHVzZXIgPSB0aGlzLl91c2Vyc1t1aWRdO1xuICAgICAgICBpZiAoIXVzZXIpIHtcbiAgICAgICAgICAvLyBVcGRhdGUgZm9yIGFuIHVua25vd24gdXNlcjogbm90aWZpY2F0aW9uIG9mIGEgbmV3IHN1YnNjcmlwdGlvbi5cbiAgICAgICAgICBjb25zdCBhY3MgPSBuZXcgQWNjZXNzTW9kZSgpLnVwZGF0ZUFsbChwcmVzLmRhY3MpO1xuICAgICAgICAgIGlmIChhY3MgJiYgYWNzLm1vZGUgIT0gQWNjZXNzTW9kZS5fTk9ORSkge1xuICAgICAgICAgICAgdXNlciA9IHRoaXMuX2NhY2hlR2V0VXNlcih1aWQpO1xuICAgICAgICAgICAgaWYgKCF1c2VyKSB7XG4gICAgICAgICAgICAgIHVzZXIgPSB7XG4gICAgICAgICAgICAgICAgdXNlcjogdWlkLFxuICAgICAgICAgICAgICAgIGFjczogYWNzXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIHRoaXMuZ2V0TWV0YSh0aGlzLnN0YXJ0TWV0YVF1ZXJ5KCkud2l0aE9uZVN1Yih1bmRlZmluZWQsIHVpZCkuYnVpbGQoKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB1c2VyLmFjcyA9IGFjcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHVzZXIudXBkYXRlZCA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9wcm9jZXNzTWV0YVN1YihbdXNlcl0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBLbm93biB1c2VyXG4gICAgICAgICAgdXNlci5hY3MudXBkYXRlQWxsKHByZXMuZGFjcyk7XG4gICAgICAgICAgLy8gVXBkYXRlIHVzZXIncyBhY2Nlc3MgbW9kZS5cbiAgICAgICAgICB0aGlzLl9wcm9jZXNzTWV0YVN1Yihbe1xuICAgICAgICAgICAgdXNlcjogdWlkLFxuICAgICAgICAgICAgdXBkYXRlZDogbmV3IERhdGUoKSxcbiAgICAgICAgICAgIGFjczogdXNlci5hY3NcbiAgICAgICAgICB9XSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLl90aW5vZGUubG9nZ2VyKFwiSU5GTzogSWdub3JlZCBwcmVzZW5jZSB1cGRhdGVcIiwgcHJlcy53aGF0KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vblByZXMpIHtcbiAgICAgIHRoaXMub25QcmVzKHByZXMpO1xuICAgIH1cbiAgfSxcblxuICAvLyBQcm9jZXNzIHtpbmZvfSBtZXNzYWdlXG4gIF9yb3V0ZUluZm86IGZ1bmN0aW9uKGluZm8pIHtcbiAgICBpZiAoaW5mby53aGF0ICE9PSAna3AnKSB7XG4gICAgICBjb25zdCB1c2VyID0gdGhpcy5fdXNlcnNbaW5mby5mcm9tXTtcbiAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgIHVzZXJbaW5mby53aGF0XSA9IGluZm8uc2VxO1xuICAgICAgICBpZiAodXNlci5yZWN2IDwgdXNlci5yZWFkKSB7XG4gICAgICAgICAgdXNlci5yZWN2ID0gdXNlci5yZWFkO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCBtc2cgPSB0aGlzLmxhdGVzdE1lc3NhZ2UoKTtcbiAgICAgIGlmIChtc2cpIHtcbiAgICAgICAgdGhpcy5tc2dTdGF0dXMobXNnLCB0cnVlKTtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgdGhpcyBpcyBhbiB1cGRhdGUgZnJvbSB0aGUgY3VycmVudCB1c2VyLCB1cGRhdGUgdGhlIGNhY2hlIHdpdGggdGhlIG5ldyBjb3VudC5cbiAgICAgIGlmICh0aGlzLl90aW5vZGUuaXNNZShpbmZvLmZyb20pKSB7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVJlYWRSZWN2KGluZm8ud2hhdCwgaW5mby5zZXEpO1xuICAgICAgfVxuXG4gICAgICAvLyBOb3RpZnkgJ21lJyBsaXN0ZW5lciBvZiB0aGUgc3RhdHVzIGNoYW5nZS5cbiAgICAgIHRoaXMuX3Rpbm9kZS5nZXRNZVRvcGljKCkuX3JlZnJlc2hDb250YWN0KGluZm8ud2hhdCwgdGhpcyk7XG4gICAgfVxuICAgIGlmICh0aGlzLm9uSW5mbykge1xuICAgICAgdGhpcy5vbkluZm8oaW5mbyk7XG4gICAgfVxuICB9LFxuXG4gIC8vIENhbGxlZCBieSBUaW5vZGUgd2hlbiBtZXRhLmRlc2MgcGFja2V0IGlzIHJlY2VpdmVkLlxuICAvLyBDYWxsZWQgYnkgJ21lJyB0b3BpYyBvbiBjb250YWN0IHVwZGF0ZSAoZGVzYy5fbm9Gb3J3YXJkaW5nIGlzIHRydWUpLlxuICBfcHJvY2Vzc01ldGFEZXNjOiBmdW5jdGlvbihkZXNjKSB7XG4gICAgaWYgKHRoaXMuaXNQMlBUeXBlKCkpIHtcbiAgICAgIC8vIFN5bnRoZXRpYyBkZXNjIG1heSBpbmNsdWRlIGRlZmFjcyBmb3IgcDJwIHRvcGljcyB3aGljaCBpcyB1c2VsZXNzLlxuICAgICAgLy8gUmVtb3ZlIGl0LlxuICAgICAgZGVsZXRlIGRlc2MuZGVmYWNzO1xuXG4gICAgICAvLyBVcGRhdGUgdG8gcDJwIGRlc2MgaXMgdGhlIHNhbWUgYXMgdXNlciB1cGRhdGUuIFVwZGF0ZSBjYWNoZWQgdXNlci5cbiAgICAgIHRoaXMuX3Rpbm9kZS5fZGIudXBkVXNlcih0aGlzLm5hbWUsIGRlc2MucHVibGljKTtcbiAgICB9XG5cbiAgICAvLyBDb3B5IHBhcmFtZXRlcnMgZnJvbSBkZXNjIG9iamVjdCB0byB0aGlzIHRvcGljLlxuICAgIG1lcmdlT2JqKHRoaXMsIGRlc2MpO1xuICAgIC8vIE1ha2Ugc3VyZSBkYXRlIGZpZWxkcyBhcmUgRGF0ZSgpLlxuICAgIHN0cmluZ1RvRGF0ZSh0aGlzKTtcbiAgICAvLyBVcGRhdGUgcGVyc2lzdGVudCBjYWNoZS5cbiAgICB0aGlzLl90aW5vZGUuX2RiLnVwZFRvcGljKHRoaXMpO1xuXG4gICAgLy8gTm90aWZ5ICdtZScgbGlzdGVuZXIsIGlmIGF2YWlsYWJsZTpcbiAgICBpZiAodGhpcy5uYW1lICE9PSBUT1BJQ19NRSAmJiAhZGVzYy5fbm9Gb3J3YXJkaW5nKSB7XG4gICAgICBjb25zdCBtZSA9IHRoaXMuX3Rpbm9kZS5nZXRNZVRvcGljKCk7XG4gICAgICBpZiAobWUub25NZXRhU3ViKSB7XG4gICAgICAgIG1lLm9uTWV0YVN1Yih0aGlzKTtcbiAgICAgIH1cbiAgICAgIGlmIChtZS5vblN1YnNVcGRhdGVkKSB7XG4gICAgICAgIG1lLm9uU3Vic1VwZGF0ZWQoW3RoaXMubmFtZV0sIDEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLm9uTWV0YURlc2MpIHtcbiAgICAgIHRoaXMub25NZXRhRGVzYyh0aGlzKTtcbiAgICB9XG4gIH0sXG5cbiAgLy8gQ2FsbGVkIGJ5IFRpbm9kZSB3aGVuIG1ldGEuc3ViIGlzIHJlY2l2ZWQgb3IgaW4gcmVzcG9uc2UgdG8gcmVjZWl2ZWRcbiAgLy8ge2N0cmx9IGFmdGVyIHNldE1ldGEtc3ViLlxuICBfcHJvY2Vzc01ldGFTdWI6IGZ1bmN0aW9uKHN1YnMpIHtcbiAgICBmb3IgKGxldCBpZHggaW4gc3Vicykge1xuICAgICAgY29uc3Qgc3ViID0gc3Vic1tpZHhdO1xuXG4gICAgICAvLyBGaWxsIGRlZmF1bHRzLlxuICAgICAgc3ViLnVwZGF0ZWQgPSBuZXcgRGF0ZShzdWIudXBkYXRlZCk7XG4gICAgICBzdWIuZGVsZXRlZCA9IHN1Yi5kZWxldGVkID8gbmV3IERhdGUoc3ViLmRlbGV0ZWQpIDogbnVsbDtcbiAgICAgIHN1Yi5vbmxpbmUgPSAhIXN1Yi5vbmxpbmU7XG5cbiAgICAgIGxldCB1c2VyID0gbnVsbDtcbiAgICAgIGlmICghc3ViLmRlbGV0ZWQpIHtcbiAgICAgICAgLy8gSWYgdGhpcyBpcyBhIGNoYW5nZSB0byB1c2VyJ3Mgb3duIHBlcm1pc3Npb25zLCB1cGRhdGUgdGhlbSBpbiB0b3BpYyB0b28uXG4gICAgICAgIC8vIERlc2Mgd2lsbCB1cGRhdGUgJ21lJyB0b3BpYy5cbiAgICAgICAgaWYgKHRoaXMuX3Rpbm9kZS5pc01lKHN1Yi51c2VyKSAmJiBzdWIuYWNzKSB7XG4gICAgICAgICAgdGhpcy5fcHJvY2Vzc01ldGFEZXNjKHtcbiAgICAgICAgICAgIHVwZGF0ZWQ6IHN1Yi51cGRhdGVkIHx8IG5ldyBEYXRlKCksXG4gICAgICAgICAgICB0b3VjaGVkOiBzdWIudXBkYXRlZCxcbiAgICAgICAgICAgIGFjczogc3ViLmFjc1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHVzZXIgPSB0aGlzLl91cGRhdGVDYWNoZWRVc2VyKHN1Yi51c2VyLCBzdWIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gU3Vic2NyaXB0aW9uIGlzIGRlbGV0ZWQsIHJlbW92ZSBpdCBmcm9tIHRvcGljIChidXQgbGVhdmUgaW4gVXNlcnMgY2FjaGUpXG4gICAgICAgIGRlbGV0ZSB0aGlzLl91c2Vyc1tzdWIudXNlcl07XG4gICAgICAgIHVzZXIgPSBzdWI7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm9uTWV0YVN1Yikge1xuICAgICAgICB0aGlzLm9uTWV0YVN1Yih1c2VyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5vblN1YnNVcGRhdGVkKSB7XG4gICAgICB0aGlzLm9uU3Vic1VwZGF0ZWQoT2JqZWN0LmtleXModGhpcy5fdXNlcnMpKTtcbiAgICB9XG4gIH0sXG5cbiAgLy8gQ2FsbGVkIGJ5IFRpbm9kZSB3aGVuIG1ldGEudGFncyBpcyByZWNpdmVkLlxuICBfcHJvY2Vzc01ldGFUYWdzOiBmdW5jdGlvbih0YWdzKSB7XG4gICAgaWYgKHRhZ3MubGVuZ3RoID09IDEgJiYgdGFnc1swXSA9PSBUaW5vZGUuREVMX0NIQVIpIHtcbiAgICAgIHRhZ3MgPSBbXTtcbiAgICB9XG4gICAgdGhpcy5fdGFncyA9IHRhZ3M7XG4gICAgaWYgKHRoaXMub25UYWdzVXBkYXRlZCkge1xuICAgICAgdGhpcy5vblRhZ3NVcGRhdGVkKHRhZ3MpO1xuICAgIH1cbiAgfSxcblxuICAvLyBEbyBub3RoaW5nIGZvciB0b3BpY3Mgb3RoZXIgdGhhbiAnbWUnXG4gIF9wcm9jZXNzTWV0YUNyZWRzOiBmdW5jdGlvbihjcmVkcykge30sXG5cbiAgLy8gRGVsZXRlIGNhY2hlZCBtZXNzYWdlcyBhbmQgdXBkYXRlIGNhY2hlZCB0cmFuc2FjdGlvbiBJRHNcbiAgX3Byb2Nlc3NEZWxNZXNzYWdlczogZnVuY3Rpb24oY2xlYXIsIGRlbHNlcSkge1xuICAgIHRoaXMuX21heERlbCA9IE1hdGgubWF4KGNsZWFyLCB0aGlzLl9tYXhEZWwpO1xuICAgIHRoaXMuY2xlYXIgPSBNYXRoLm1heChjbGVhciwgdGhpcy5jbGVhcik7XG4gICAgY29uc3QgdG9waWMgPSB0aGlzO1xuICAgIGxldCBjb3VudCA9IDA7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZGVsc2VxKSkge1xuICAgICAgZGVsc2VxLm1hcChmdW5jdGlvbihyYW5nZSkge1xuICAgICAgICBpZiAoIXJhbmdlLmhpKSB7XG4gICAgICAgICAgY291bnQrKztcbiAgICAgICAgICB0b3BpYy5mbHVzaE1lc3NhZ2UocmFuZ2UubG93KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmb3IgKGxldCBpID0gcmFuZ2UubG93OyBpIDwgcmFuZ2UuaGk7IGkrKykge1xuICAgICAgICAgICAgY291bnQrKztcbiAgICAgICAgICAgIHRvcGljLmZsdXNoTWVzc2FnZShpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChjb3VudCA+IDApIHtcbiAgICAgIHRoaXMuX3VwZGF0ZURlbGV0ZWRSYW5nZXMoKTtcblxuICAgICAgaWYgKHRoaXMub25EYXRhKSB7XG4gICAgICAgIHRoaXMub25EYXRhKCk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIC8vIFRvcGljIGlzIGluZm9ybWVkIHRoYXQgdGhlIGVudGlyZSByZXNwb25zZSB0byB7Z2V0IHdoYXQ9ZGF0YX0gaGFzIGJlZW4gcmVjZWl2ZWQuXG4gIF9hbGxNZXNzYWdlc1JlY2VpdmVkOiBmdW5jdGlvbihjb3VudCkge1xuICAgIHRoaXMuX3VwZGF0ZURlbGV0ZWRSYW5nZXMoKTtcblxuICAgIGlmICh0aGlzLm9uQWxsTWVzc2FnZXNSZWNlaXZlZCkge1xuICAgICAgdGhpcy5vbkFsbE1lc3NhZ2VzUmVjZWl2ZWQoY291bnQpO1xuICAgIH1cbiAgfSxcblxuICAvLyBSZXNldCBzdWJzY3JpYmVkIHN0YXRlXG4gIF9yZXNldFN1YjogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5fc3Vic2NyaWJlZCA9IGZhbHNlO1xuICB9LFxuXG4gIC8vIFRoaXMgdG9waWMgaXMgZWl0aGVyIGRlbGV0ZWQgb3IgdW5zdWJzY3JpYmVkIGZyb20uXG4gIF9nb25lOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLl9tZXNzYWdlcy5yZXNldCgpO1xuICAgIHRoaXMuX3Rpbm9kZS5fZGIucmVtTWVzc2FnZXModGhpcy5uYW1lKTtcbiAgICB0aGlzLl91c2VycyA9IHt9O1xuICAgIHRoaXMuYWNzID0gbmV3IEFjY2Vzc01vZGUobnVsbCk7XG4gICAgdGhpcy5wcml2YXRlID0gbnVsbDtcbiAgICB0aGlzLnB1YmxpYyA9IG51bGw7XG4gICAgdGhpcy5fbWF4U2VxID0gMDtcbiAgICB0aGlzLl9taW5TZXEgPSAwO1xuICAgIHRoaXMuX3N1YnNjcmliZWQgPSBmYWxzZTtcblxuICAgIGNvbnN0IG1lID0gdGhpcy5fdGlub2RlLmdldE1lVG9waWMoKTtcbiAgICBpZiAobWUpIHtcbiAgICAgIG1lLl9yb3V0ZVByZXMoe1xuICAgICAgICBfbm9Gb3J3YXJkaW5nOiB0cnVlLFxuICAgICAgICB3aGF0OiAnZ29uZScsXG4gICAgICAgIHRvcGljOiBUT1BJQ19NRSxcbiAgICAgICAgc3JjOiB0aGlzLm5hbWVcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAodGhpcy5vbkRlbGV0ZVRvcGljKSB7XG4gICAgICB0aGlzLm9uRGVsZXRlVG9waWMoKTtcbiAgICB9XG4gIH0sXG5cbiAgLy8gVXBkYXRlIGdsb2JhbCB1c2VyIGNhY2hlIGFuZCBsb2NhbCBzdWJzY3JpYmVycyBjYWNoZS5cbiAgLy8gRG9uJ3QgY2FsbCB0aGlzIG1ldGhvZCBmb3Igbm9uLXN1YnNjcmliZXJzLlxuICBfdXBkYXRlQ2FjaGVkVXNlcjogZnVuY3Rpb24odWlkLCBvYmopIHtcbiAgICAvLyBGZXRjaCB1c2VyIG9iamVjdCBmcm9tIHRoZSBnbG9iYWwgY2FjaGUuXG4gICAgLy8gVGhpcyBpcyBhIGNsb25lIG9mIHRoZSBzdG9yZWQgb2JqZWN0XG4gICAgbGV0IGNhY2hlZCA9IHRoaXMuX2NhY2hlR2V0VXNlcih1aWQpO1xuICAgIGNhY2hlZCA9IG1lcmdlT2JqKGNhY2hlZCB8fCB7fSwgb2JqKTtcbiAgICAvLyBTYXZlIHRvIGdsb2JhbCBjYWNoZVxuICAgIHRoaXMuX2NhY2hlUHV0VXNlcih1aWQsIGNhY2hlZCk7XG4gICAgLy8gU2F2ZSB0byB0aGUgbGlzdCBvZiB0b3BpYyBzdWJzcmliZXJzLlxuICAgIHJldHVybiBtZXJnZVRvQ2FjaGUodGhpcy5fdXNlcnMsIHVpZCwgY2FjaGVkKTtcbiAgfSxcblxuICAvLyBHZXQgbG9jYWwgc2VxSWQgZm9yIGEgcXVldWVkIG1lc3NhZ2UuXG4gIF9nZXRRdWV1ZWRTZXFJZDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3F1ZXVlZFNlcUlkKys7XG4gIH0sXG5cbiAgLy8gQ2FsY3VsYXRlIHJhbmdlcyBvZiBtaXNzaW5nIG1lc3NhZ2VzLlxuICBfdXBkYXRlRGVsZXRlZFJhbmdlczogZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgcmFuZ2VzID0gW107XG5cbiAgICBsZXQgcHJldiA9IG51bGw7XG4gICAgLy8gQ2hlY2sgZm9yIGdhcCBpbiB0aGUgYmVnaW5uaW5nLCBiZWZvcmUgdGhlIGZpcnN0IG1lc3NhZ2UuXG4gICAgY29uc3QgZmlyc3QgPSB0aGlzLl9tZXNzYWdlcy5nZXRBdCgwKTtcbiAgICBpZiAoZmlyc3QgJiYgdGhpcy5fbWluU2VxID4gMSAmJiAhdGhpcy5fbm9FYXJsaWVyTXNncykge1xuICAgICAgLy8gU29tZSBtZXNzYWdlcyBhcmUgbWlzc2luZyBpbiB0aGUgYmVnaW5uaW5nLlxuICAgICAgaWYgKGZpcnN0LmhpKSB7XG4gICAgICAgIC8vIFRoZSBmaXJzdCBtZXNzYWdlIGFscmVhZHkgcmVwcmVzZW50cyBhIGdhcC5cbiAgICAgICAgaWYgKGZpcnN0LnNlcSA+IDEpIHtcbiAgICAgICAgICBmaXJzdC5zZXEgPSAxO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmaXJzdC5oaSA8IHRoaXMuX21pblNlcSAtIDEpIHtcbiAgICAgICAgICBmaXJzdC5oaSA9IHRoaXMuX21pblNlcSAtIDE7XG4gICAgICAgIH1cbiAgICAgICAgcHJldiA9IGZpcnN0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQ3JlYXRlIG5ldyBnYXAuXG4gICAgICAgIHByZXYgPSB7XG4gICAgICAgICAgc2VxOiAxLFxuICAgICAgICAgIGhpOiB0aGlzLl9taW5TZXEgLSAxXG4gICAgICAgIH07XG4gICAgICAgIHJhbmdlcy5wdXNoKHByZXYpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBObyBnYXAgaW4gdGhlIGJlZ2lubmluZy5cbiAgICAgIHByZXYgPSB7XG4gICAgICAgIHNlcTogMCxcbiAgICAgICAgaGk6IDBcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gRmluZCBnYXBzIGluIHRoZSBsaXN0IG9mIHJlY2VpdmVkIG1lc3NhZ2VzLiBUaGUgbGlzdCBjb250YWlucyBtZXNzYWdlcy1wcm9wZXIgYXMgd2VsbFxuICAgIC8vIGFzIHBsYWNlaG9sZXJzIGZvciBkZWxldGVkIHJhbmdlcy5cbiAgICAvLyBUaGUgbWVzc2FnZXMgYXJlIGl0ZXJhdGVkIGJ5IHNlcSBJRCBpbiBhc2NlbmRpbmcgb3JkZXIuXG4gICAgdGhpcy5fbWVzc2FnZXMuZm9yRWFjaCgoZGF0YSkgPT4ge1xuICAgICAgLy8gRG8gbm90IGNyZWF0ZSBhIGdhcCBiZXR3ZWVuIHRoZSBsYXN0IHNlbnQgbWVzc2FnZSBhbmQgdGhlIGZpcnN0IHVuc2VudC5cbiAgICAgIGlmIChkYXRhLnNlcSA+PSBMT0NBTF9TRVFJRCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIE5ldyBtZXNzYWdlIGlzIHJlZHVjaW5nIHRoZSBleGlzdGluZyBnYXBcbiAgICAgIGlmIChkYXRhLnNlcSA9PSAocHJldi5oaSB8fCBwcmV2LnNlcSkgKyAxKSB7XG4gICAgICAgIC8vIE5vIG5ldyBnYXAuIFJlcGxhY2UgcHJldmlvdXMgd2l0aCBjdXJyZW50LlxuICAgICAgICBwcmV2ID0gZGF0YTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBGb3VuZCBhIG5ldyBnYXAuXG4gICAgICBpZiAocHJldi5oaSkge1xuICAgICAgICAvLyBQcmV2aW91cyBpcyBhbHNvIGEgZ2FwLCBhbHRlciBpdC5cbiAgICAgICAgcHJldi5oaSA9IGRhdGEuaGkgfHwgZGF0YS5zZXE7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gUHJldmlvdXMgaXMgbm90IGEgZ2FwLiBDcmVhdGUgYSBuZXcgZ2FwLlxuICAgICAgcHJldiA9IHtcbiAgICAgICAgc2VxOiAocHJldi5oaSB8fCBwcmV2LnNlcSkgKyAxLFxuICAgICAgICBoaTogZGF0YS5oaSB8fCBkYXRhLnNlcVxuICAgICAgfTtcbiAgICAgIHJhbmdlcy5wdXNoKHByZXYpO1xuICAgIH0pO1xuXG4gICAgLy8gQ2hlY2sgZm9yIG1pc3NpbmcgbWVzc2FnZXMgYXQgdGhlIGVuZC5cbiAgICAvLyBBbGwgbWVzc2FnZXMgY291bGQgYmUgbWlzc2luZyBvciBpdCBjb3VsZCBiZSBhIG5ldyB0b3BpYyB3aXRoIG5vIG1lc3NhZ2VzLlxuICAgIGNvbnN0IGxhc3QgPSB0aGlzLl9tZXNzYWdlcy5nZXRMYXN0KCk7XG4gICAgY29uc3QgbWF4U2VxID0gTWF0aC5tYXgodGhpcy5zZXEsIHRoaXMuX21heFNlcSkgfHwgMDtcbiAgICBpZiAoKG1heFNlcSA+IDAgJiYgIWxhc3QpIHx8IChsYXN0ICYmICgobGFzdC5oaSB8fCBsYXN0LnNlcSkgPCBtYXhTZXEpKSkge1xuICAgICAgaWYgKGxhc3QgJiYgbGFzdC5oaSkge1xuICAgICAgICAvLyBFeHRlbmQgZXhpc3RpbmcgZ2FwXG4gICAgICAgIGxhc3QuaGkgPSBtYXhTZXE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBDcmVhdGUgbmV3IGdhcC5cbiAgICAgICAgcmFuZ2VzLnB1c2goe1xuICAgICAgICAgIHNlcTogbGFzdCA/IGxhc3Quc2VxICsgMSA6IDEsXG4gICAgICAgICAgaGk6IG1heFNlcVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJbnNlcnQgbmV3IGdhcHMgaW50byBjYWNoZS5cbiAgICByYW5nZXMubWFwKChnYXApID0+IHtcbiAgICAgIHRoaXMuX21lc3NhZ2VzLnB1dChnYXApO1xuICAgIH0pO1xuICB9LFxuXG4gIC8vIExvYWQgbW9zdCByZWNlbnQgbWVzc2FnZXMgZnJvbSBwZXJzaXN0ZW50IGNhY2hlLlxuICBfbG9hZE1lc3NhZ2VzOiBmdW5jdGlvbihkYikge1xuICAgIHJldHVybiBkYi5yZWFkTWVzc2FnZXModGhpcy5uYW1lLCB7XG4gICAgICAgIGxpbWl0OiBERUZBVUxUX01FU1NBR0VTX1BBR0VcbiAgICAgIH0pXG4gICAgICAudGhlbigobXNncykgPT4ge1xuICAgICAgICBtc2dzLmZvckVhY2goKGRhdGEpID0+IHtcbiAgICAgICAgICBpZiAoZGF0YS5zZXEgPiB0aGlzLl9tYXhTZXEpIHtcbiAgICAgICAgICAgIHRoaXMuX21heFNlcSA9IGRhdGEuc2VxO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZGF0YS5zZXEgPCB0aGlzLl9taW5TZXEgfHwgdGhpcy5fbWluU2VxID09IDApIHtcbiAgICAgICAgICAgIHRoaXMuX21pblNlcSA9IGRhdGEuc2VxO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLl9tZXNzYWdlcy5wdXQoZGF0YSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuX3VwZGF0ZURlbGV0ZWRSYW5nZXMoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMubmFtZTtcbiAgICAgIH0pO1xuICB9LFxuXG4gIC8vIFB1c2ggb3Ige3ByZXN9OiBtZXNzYWdlIHJlY2VpdmVkLlxuICBfdXBkYXRlUmVjZWl2ZWQ6IGZ1bmN0aW9uKHNlcSwgYWN0KSB7XG4gICAgdGhpcy50b3VjaGVkID0gbmV3IERhdGUoKTtcbiAgICB0aGlzLnNlcSA9IHNlcSB8IDA7XG4gICAgLy8gQ2hlY2sgaWYgbWVzc2FnZSBpcyBzZW50IGJ5IHRoZSBjdXJyZW50IHVzZXIuIElmIHNvIGl0J3MgYmVlbiByZWFkIGFscmVhZHkuXG4gICAgaWYgKCFhY3QgfHwgdGhpcy5fdGlub2RlLmlzTWUoYWN0KSkge1xuICAgICAgdGhpcy5yZWFkID0gdGhpcy5yZWFkID8gTWF0aC5tYXgodGhpcy5yZWFkLCB0aGlzLnNlcSkgOiB0aGlzLnNlcTtcbiAgICAgIHRoaXMucmVjdiA9IHRoaXMucmVjdiA/IE1hdGgubWF4KHRoaXMucmVhZCwgdGhpcy5yZWN2KSA6IHRoaXMucmVhZDtcbiAgICB9XG4gICAgdGhpcy51bnJlYWQgPSB0aGlzLnNlcSAtICh0aGlzLnJlYWQgfCAwKTtcbiAgfVxufTtcblxuLyoqXG4gKiBAY2xhc3MgVG9waWNNZSAtIHNwZWNpYWwgY2FzZSBvZiB7QGxpbmsgVGlub2RlLlRvcGljfSBmb3JcbiAqIG1hbmFnaW5nIGRhdGEgb2YgdGhlIGN1cnJlbnQgdXNlciwgaW5jbHVkaW5nIGNvbnRhY3QgbGlzdC5cbiAqIEBleHRlbmRzIFRpbm9kZS5Ub3BpY1xuICogQG1lbWJlcm9mIFRpbm9kZVxuICpcbiAqIEBwYXJhbSB7VG9waWNNZS5DYWxsYmFja3N9IGNhbGxiYWNrcyAtIENhbGxiYWNrcyB0byByZWNlaXZlIHZhcmlvdXMgZXZlbnRzLlxuICovXG52YXIgVG9waWNNZSA9IGZ1bmN0aW9uKGNhbGxiYWNrcykge1xuICBUb3BpYy5jYWxsKHRoaXMsIFRPUElDX01FLCBjYWxsYmFja3MpO1xuXG4gIC8vIG1lLXNwZWNpZmljIGNhbGxiYWNrc1xuICBpZiAoY2FsbGJhY2tzKSB7XG4gICAgdGhpcy5vbkNvbnRhY3RVcGRhdGUgPSBjYWxsYmFja3Mub25Db250YWN0VXBkYXRlO1xuICB9XG59O1xuXG4vLyBJbmhlcml0IGV2ZXJ5dGluZyBmcm9tIHRoZSBnZW5lcmljIFRvcGljXG5Ub3BpY01lLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoVG9waWMucHJvdG90eXBlLCB7XG4gIC8vIE92ZXJyaWRlIHRoZSBvcmlnaW5hbCBUb3BpYy5fcHJvY2Vzc01ldGFEZXNjLlxuICBfcHJvY2Vzc01ldGFEZXNjOiB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uKGRlc2MpIHtcbiAgICAgIC8vIENoZWNrIGlmIG9ubGluZSBjb250YWN0cyBuZWVkIHRvIGJlIHR1cm5lZCBvZmYgYmVjYXVzZSBQIHBlcm1pc3Npb24gd2FzIHJlbW92ZWQuXG4gICAgICBjb25zdCB0dXJuT2ZmID0gKGRlc2MuYWNzICYmICFkZXNjLmFjcy5pc1ByZXNlbmNlcigpKSAmJiAodGhpcy5hY3MgJiYgdGhpcy5hY3MuaXNQcmVzZW5jZXIoKSk7XG5cbiAgICAgIC8vIENvcHkgcGFyYW1ldGVycyBmcm9tIGRlc2Mgb2JqZWN0IHRvIHRoaXMgdG9waWMuXG4gICAgICBtZXJnZU9iaih0aGlzLCBkZXNjKTtcbiAgICAgIHRoaXMuX3Rpbm9kZS5fZGIudXBkVG9waWModGhpcyk7XG5cbiAgICAgIC8vIFN0cmluZyBkYXRldGltZSBoZWFkZXJzIHRvIERhdGUoKSBvYmplY3RzLlxuICAgICAgc3RyaW5nVG9EYXRlKHRoaXMpO1xuXG4gICAgICAvLyAnUCcgcGVybWlzc2lvbiB3YXMgcmVtb3ZlZC4gQWxsIHRvcGljcyBhcmUgb2ZmbGluZSBub3cuXG4gICAgICBpZiAodHVybk9mZikge1xuICAgICAgICB0aGlzLl90aW5vZGUuY2FjaGVNYXAoJ3RvcGljJywgKGNvbnQpID0+IHtcbiAgICAgICAgICBpZiAoY29udC5vbmxpbmUpIHtcbiAgICAgICAgICAgIGNvbnQub25saW5lID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAoY29udC5zZWVuKSB7XG4gICAgICAgICAgICAgIGNvbnQuc2Vlbi53aGVuID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnQuc2VlbiA9IHtcbiAgICAgICAgICAgICAgICB3aGVuOiBuZXcgRGF0ZSgpXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9yZWZyZXNoQ29udGFjdCgnb2ZmJywgY29udCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMub25NZXRhRGVzYykge1xuICAgICAgICB0aGlzLm9uTWV0YURlc2ModGhpcyk7XG4gICAgICB9XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9LFxuXG4gIC8vIE92ZXJyaWRlIHRoZSBvcmlnaW5hbCBUb3BpYy5fcHJvY2Vzc01ldGFTdWJcbiAgX3Byb2Nlc3NNZXRhU3ViOiB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uKHN1YnMpIHtcbiAgICAgIGxldCB1cGRhdGVDb3VudCA9IDA7XG4gICAgICBzdWJzLmZvckVhY2goKHN1YikgPT4ge1xuICAgICAgICBjb25zdCB0b3BpY05hbWUgPSBzdWIudG9waWM7XG4gICAgICAgIC8vIERvbid0IHNob3cgJ21lJyBhbmQgJ2ZuZCcgdG9waWNzIGluIHRoZSBsaXN0IG9mIGNvbnRhY3RzLlxuICAgICAgICBpZiAodG9waWNOYW1lID09IFRPUElDX0ZORCB8fCB0b3BpY05hbWUgPT0gVE9QSUNfTUUpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgc3ViLnVwZGF0ZWQgPSBuZXcgRGF0ZShzdWIudXBkYXRlZCk7XG4gICAgICAgIHN1Yi50b3VjaGVkID0gc3ViLnRvdWNoZWQgPyBuZXcgRGF0ZShzdWIudG91Y2hlZCkgOiB1bmRlZmluZWQ7XG4gICAgICAgIHN1Yi5kZWxldGVkID0gc3ViLmRlbGV0ZWQgPyBuZXcgRGF0ZShzdWIuZGVsZXRlZCkgOiBudWxsO1xuICAgICAgICBzdWIub25saW5lID0gISFzdWIub25saW5lO1xuXG4gICAgICAgIGxldCBjb250ID0gbnVsbDtcbiAgICAgICAgaWYgKHN1Yi5kZWxldGVkKSB7XG4gICAgICAgICAgY29udCA9IHN1YjtcbiAgICAgICAgICB0aGlzLl90aW5vZGUuY2FjaGVEZWwoJ3RvcGljJywgdG9waWNOYW1lKTtcbiAgICAgICAgICB0aGlzLl90aW5vZGUuX2RiLnJlbVRvcGljKHRvcGljTmFtZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gRW5zdXJlIHRoZSB2YWx1ZXMgYXJlIGRlZmluZWQgYW5kIGFyZSBpbnRlZ2Vycy5cbiAgICAgICAgICBpZiAodHlwZW9mIHN1Yi5zZXEgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHN1Yi5zZXEgPSBzdWIuc2VxIHwgMDtcbiAgICAgICAgICAgIHN1Yi5yZWN2ID0gc3ViLnJlY3YgfCAwO1xuICAgICAgICAgICAgc3ViLnJlYWQgPSBzdWIucmVhZCB8IDA7XG4gICAgICAgICAgICBzdWIudW5yZWFkID0gc3ViLnNlcSAtIHN1Yi5yZWFkO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChzdWIuc2VlbiAmJiBzdWIuc2Vlbi53aGVuKSB7XG4gICAgICAgICAgICBzdWIuc2Vlbi53aGVuID0gbmV3IERhdGUoc3ViLnNlZW4ud2hlbik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29udCA9IG1lcmdlT2JqKHRoaXMuX3Rpbm9kZS5nZXRUb3BpYyh0b3BpY05hbWUpLCBzdWIpO1xuICAgICAgICAgIHRoaXMuX3Rpbm9kZS5fZGIudXBkVG9waWMoY29udCk7XG5cbiAgICAgICAgICBpZiAoVGlub2RlLmlzUDJQVG9waWNOYW1lKHRvcGljTmFtZSkpIHtcbiAgICAgICAgICAgIHRoaXMuX2NhY2hlUHV0VXNlcih0b3BpY05hbWUsIGNvbnQpO1xuICAgICAgICAgICAgdGhpcy5fdGlub2RlLl9kYi51cGRVc2VyKHRvcGljTmFtZSwgY29udC5wdWJsaWMpO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBOb3RpZnkgdG9waWMgb2YgdGhlIHVwZGF0ZSBpZiBpdCdzIGFuIGV4dGVybmFsIHVwZGF0ZS5cbiAgICAgICAgICBpZiAoIXN1Yi5fbm9Gb3J3YXJkaW5nKSB7XG4gICAgICAgICAgICBjb25zdCB0b3BpYyA9IHRoaXMuX3Rpbm9kZS5nZXRUb3BpYyh0b3BpY05hbWUpO1xuICAgICAgICAgICAgaWYgKHRvcGljKSB7XG4gICAgICAgICAgICAgIHN1Yi5fbm9Gb3J3YXJkaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgdG9waWMuX3Byb2Nlc3NNZXRhRGVzYyhzdWIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZUNvdW50Kys7XG5cbiAgICAgICAgaWYgKHRoaXMub25NZXRhU3ViKSB7XG4gICAgICAgICAgdGhpcy5vbk1ldGFTdWIoY29udCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBpZiAodGhpcy5vblN1YnNVcGRhdGVkICYmIHVwZGF0ZUNvdW50ID4gMCkge1xuICAgICAgICBjb25zdCBrZXlzID0gW107XG4gICAgICAgIHN1YnMuZm9yRWFjaCgocykgPT4ge1xuICAgICAgICAgIGtleXMucHVzaChzLnRvcGljKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMub25TdWJzVXBkYXRlZChrZXlzLCB1cGRhdGVDb3VudCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9LFxuXG4gIC8vIENhbGxlZCBieSBUaW5vZGUgd2hlbiBtZXRhLnN1YiBpcyByZWNpdmVkLlxuICBfcHJvY2Vzc01ldGFDcmVkczoge1xuICAgIHZhbHVlOiBmdW5jdGlvbihjcmVkcywgdXBkKSB7XG4gICAgICBpZiAoY3JlZHMubGVuZ3RoID09IDEgJiYgY3JlZHNbMF0gPT0gVGlub2RlLkRFTF9DSEFSKSB7XG4gICAgICAgIGNyZWRzID0gW107XG4gICAgICB9XG4gICAgICBpZiAodXBkKSB7XG4gICAgICAgIGNyZWRzLm1hcCgoY3IpID0+IHtcbiAgICAgICAgICBpZiAoY3IudmFsKSB7XG4gICAgICAgICAgICAvLyBBZGRpbmcgYSBjcmVkZW50aWFsLlxuICAgICAgICAgICAgbGV0IGlkeCA9IHRoaXMuX2NyZWRlbnRpYWxzLmZpbmRJbmRleCgoZWwpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIGVsLm1ldGggPT0gY3IubWV0aCAmJiBlbC52YWwgPT0gY3IudmFsO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoaWR4IDwgMCkge1xuICAgICAgICAgICAgICAvLyBOb3QgZm91bmQuXG4gICAgICAgICAgICAgIGlmICghY3IuZG9uZSkge1xuICAgICAgICAgICAgICAgIC8vIFVuY29uZmlybWVkIGNyZWRlbnRpYWwgcmVwbGFjZXMgcHJldmlvdXMgdW5jb25maXJtZWQgY3JlZGVudGlhbCBvZiB0aGUgc2FtZSBtZXRob2QuXG4gICAgICAgICAgICAgICAgaWR4ID0gdGhpcy5fY3JlZGVudGlhbHMuZmluZEluZGV4KChlbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGVsLm1ldGggPT0gY3IubWV0aCAmJiAhZWwuZG9uZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgICAgICAgICAgICAgIC8vIFJlbW92ZSBwcmV2aW91cyB1bmNvbmZpcm1lZCBjcmVkZW50aWFsLlxuICAgICAgICAgICAgICAgICAgdGhpcy5fY3JlZGVudGlhbHMuc3BsaWNlKGlkeCwgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHRoaXMuX2NyZWRlbnRpYWxzLnB1c2goY3IpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gRm91bmQuIE1heWJlIGNoYW5nZSAnZG9uZScgc3RhdHVzLlxuICAgICAgICAgICAgICB0aGlzLl9jcmVkZW50aWFsc1tpZHhdLmRvbmUgPSBjci5kb25lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoY3IucmVzcCkge1xuICAgICAgICAgICAgLy8gSGFuZGxlIGNyZWRlbnRpYWwgY29uZmlybWF0aW9uLlxuICAgICAgICAgICAgY29uc3QgaWR4ID0gdGhpcy5fY3JlZGVudGlhbHMuZmluZEluZGV4KChlbCkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gZWwubWV0aCA9PSBjci5tZXRoICYmICFlbC5kb25lO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgICAgICAgICAgdGhpcy5fY3JlZGVudGlhbHNbaWR4XS5kb25lID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fY3JlZGVudGlhbHMgPSBjcmVkcztcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm9uQ3JlZHNVcGRhdGVkKSB7XG4gICAgICAgIHRoaXMub25DcmVkc1VwZGF0ZWQodGhpcy5fY3JlZGVudGlhbHMpO1xuICAgICAgfVxuICAgIH0sXG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSxcblxuICAvLyBQcm9jZXNzIHByZXNlbmNlIGNoYW5nZSBtZXNzYWdlXG4gIF9yb3V0ZVByZXM6IHtcbiAgICB2YWx1ZTogZnVuY3Rpb24ocHJlcykge1xuICAgICAgaWYgKHByZXMud2hhdCA9PSAndGVybScpIHtcbiAgICAgICAgLy8gVGhlICdtZScgdG9waWMgaXRzZWxmIGlzIGRldGFjaGVkLiBNYXJrIGFzIHVuc3Vic2NyaWJlZC5cbiAgICAgICAgdGhpcy5fcmVzZXRTdWIoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAocHJlcy53aGF0ID09ICd1cGQnICYmIHByZXMuc3JjID09IFRPUElDX01FKSB7XG4gICAgICAgIC8vIFVwZGF0ZSB0byBtZSdzIGRlc2NyaXB0aW9uLiBSZXF1ZXN0IHVwZGF0ZWQgdmFsdWUuXG4gICAgICAgIHRoaXMuZ2V0TWV0YSh0aGlzLnN0YXJ0TWV0YVF1ZXJ5KCkud2l0aERlc2MoKS5idWlsZCgpKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjb250ID0gdGhpcy5fdGlub2RlLmNhY2hlR2V0KCd0b3BpYycsIHByZXMuc3JjKTtcbiAgICAgIGlmIChjb250KSB7XG4gICAgICAgIHN3aXRjaCAocHJlcy53aGF0KSB7XG4gICAgICAgICAgY2FzZSAnb24nOiAvLyB0b3BpYyBjYW1lIG9ubGluZVxuICAgICAgICAgICAgY29udC5vbmxpbmUgPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnb2ZmJzogLy8gdG9waWMgd2VudCBvZmZsaW5lXG4gICAgICAgICAgICBpZiAoY29udC5vbmxpbmUpIHtcbiAgICAgICAgICAgICAgY29udC5vbmxpbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgaWYgKGNvbnQuc2Vlbikge1xuICAgICAgICAgICAgICAgIGNvbnQuc2Vlbi53aGVuID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb250LnNlZW4gPSB7XG4gICAgICAgICAgICAgICAgICB3aGVuOiBuZXcgRGF0ZSgpXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnbXNnJzogLy8gbmV3IG1lc3NhZ2UgcmVjZWl2ZWRcbiAgICAgICAgICAgIGNvbnQuX3VwZGF0ZVJlY2VpdmVkKHByZXMuc2VxLCBwcmVzLmFjdCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICd1cGQnOiAvLyBkZXNjIHVwZGF0ZWRcbiAgICAgICAgICAgIC8vIFJlcXVlc3QgdXBkYXRlZCBzdWJzY3JpcHRpb24uXG4gICAgICAgICAgICB0aGlzLmdldE1ldGEodGhpcy5zdGFydE1ldGFRdWVyeSgpLndpdGhMYXRlck9uZVN1YihwcmVzLnNyYykuYnVpbGQoKSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdhY3MnOiAvLyBhY2Nlc3MgbW9kZSBjaGFuZ2VkXG4gICAgICAgICAgICBpZiAoY29udC5hY3MpIHtcbiAgICAgICAgICAgICAgY29udC5hY3MudXBkYXRlQWxsKHByZXMuZGFjcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjb250LmFjcyA9IG5ldyBBY2Nlc3NNb2RlKCkudXBkYXRlQWxsKHByZXMuZGFjcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb250LnRvdWNoZWQgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAndWEnOlxuICAgICAgICAgICAgLy8gdXNlciBhZ2VudCBjaGFuZ2VkLlxuICAgICAgICAgICAgY29udC5zZWVuID0ge1xuICAgICAgICAgICAgICB3aGVuOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgICB1YTogcHJlcy51YVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3JlY3YnOlxuICAgICAgICAgICAgLy8gdXNlcidzIG90aGVyIHNlc3Npb24gbWFya2VkIHNvbWUgbWVzc2dlcyBhcyByZWNlaXZlZC5cbiAgICAgICAgICAgIHByZXMuc2VxID0gcHJlcy5zZXEgfCAwO1xuICAgICAgICAgICAgY29udC5yZWN2ID0gY29udC5yZWN2ID8gTWF0aC5tYXgoY29udC5yZWN2LCBwcmVzLnNlcSkgOiBwcmVzLnNlcTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3JlYWQnOlxuICAgICAgICAgICAgLy8gdXNlcidzIG90aGVyIHNlc3Npb24gbWFya2VkIHNvbWUgbWVzc2FnZXMgYXMgcmVhZC5cbiAgICAgICAgICAgIHByZXMuc2VxID0gcHJlcy5zZXEgfCAwO1xuICAgICAgICAgICAgY29udC5yZWFkID0gY29udC5yZWFkID8gTWF0aC5tYXgoY29udC5yZWFkLCBwcmVzLnNlcSkgOiBwcmVzLnNlcTtcbiAgICAgICAgICAgIGNvbnQucmVjdiA9IGNvbnQucmVjdiA/IE1hdGgubWF4KGNvbnQucmVhZCwgY29udC5yZWN2KSA6IGNvbnQucmVjdjtcbiAgICAgICAgICAgIGNvbnQudW5yZWFkID0gY29udC5zZXEgLSBjb250LnJlYWQ7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdnb25lJzpcbiAgICAgICAgICAgIC8vIHRvcGljIGRlbGV0ZWQgb3IgdW5zdWJzY3JpYmVkIGZyb20uXG4gICAgICAgICAgICB0aGlzLl90aW5vZGUuY2FjaGVEZWwoJ3RvcGljJywgcHJlcy5zcmMpO1xuICAgICAgICAgICAgdGhpcy5fdGlub2RlLl9kYi5yZW1Ub3BpYyhwcmVzLnNyYyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdkZWwnOlxuICAgICAgICAgICAgLy8gVXBkYXRlIHRvcGljLmRlbCB2YWx1ZS5cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0aGlzLl90aW5vZGUubG9nZ2VyKFwiSU5GTzogVW5zdXBwb3J0ZWQgcHJlc2VuY2UgdXBkYXRlIGluICdtZSdcIiwgcHJlcy53aGF0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3JlZnJlc2hDb250YWN0KHByZXMud2hhdCwgY29udCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAocHJlcy53aGF0ID09ICdhY3MnKSB7XG4gICAgICAgICAgLy8gTmV3IHN1YnNjcmlwdGlvbnMgYW5kIGRlbGV0ZWQvYmFubmVkIHN1YnNjcmlwdGlvbnMgaGF2ZSBmdWxsXG4gICAgICAgICAgLy8gYWNjZXNzIG1vZGUgKG5vICsgb3IgLSBpbiB0aGUgZGFjcyBzdHJpbmcpLiBDaGFuZ2VzIHRvIGtub3duIHN1YnNjcmlwdGlvbnMgYXJlIHNlbnQgYXNcbiAgICAgICAgICAvLyBkZWx0YXMsIGJ1dCB0aGV5IHNob3VsZCBub3QgaGFwcGVuIGhlcmUuXG4gICAgICAgICAgY29uc3QgYWNzID0gbmV3IEFjY2Vzc01vZGUocHJlcy5kYWNzKTtcbiAgICAgICAgICBpZiAoIWFjcyB8fCBhY3MubW9kZSA9PSBBY2Nlc3NNb2RlLl9JTlZBTElEKSB7XG4gICAgICAgICAgICB0aGlzLl90aW5vZGUubG9nZ2VyKFwiRVJST1I6IEludmFsaWQgYWNjZXNzIG1vZGUgdXBkYXRlXCIsIHByZXMuc3JjLCBwcmVzLmRhY3MpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH0gZWxzZSBpZiAoYWNzLm1vZGUgPT0gQWNjZXNzTW9kZS5fTk9ORSkge1xuICAgICAgICAgICAgdGhpcy5fdGlub2RlLmxvZ2dlcihcIldBUk5JTkc6IFJlbW92aW5nIG5vbi1leGlzdGVudCBzdWJzY3JpcHRpb25cIiwgcHJlcy5zcmMsIHByZXMuZGFjcyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIE5ldyBzdWJzY3JpcHRpb24uIFNlbmQgcmVxdWVzdCBmb3IgdGhlIGZ1bGwgZGVzY3JpcHRpb24uXG4gICAgICAgICAgICAvLyBVc2luZyAud2l0aE9uZVN1YiAobm90IC53aXRoTGF0ZXJPbmVTdWIpIHRvIG1ha2Ugc3VyZSBJZk1vZGlmaWVkU2luY2UgaXMgbm90IHNldC5cbiAgICAgICAgICAgIHRoaXMuZ2V0TWV0YSh0aGlzLnN0YXJ0TWV0YVF1ZXJ5KCkud2l0aE9uZVN1Yih1bmRlZmluZWQsIHByZXMuc3JjKS5idWlsZCgpKTtcbiAgICAgICAgICAgIC8vIENyZWF0ZSBhIGR1bW15IGVudHJ5IHRvIGNhdGNoIG9ubGluZSBzdGF0dXMgdXBkYXRlLlxuICAgICAgICAgICAgY29uc3QgZHVtbXkgPSB0aGlzLl90aW5vZGUuZ2V0VG9waWMocHJlcy5zcmMpO1xuICAgICAgICAgICAgZHVtbXkudG91Y2hlZCA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICBkdW1teS50b3BpYyA9IHByZXMuc3JjO1xuICAgICAgICAgICAgZHVtbXkub25saW5lID0gZmFsc2U7XG4gICAgICAgICAgICBkdW1teS5hY3MgPSBhY3M7XG4gICAgICAgICAgICB0aGlzLl90aW5vZGUuYXR0YWNoQ2FjaGVUb1RvcGljKGR1bW15KTtcbiAgICAgICAgICAgIGR1bW15Ll9jYWNoZVB1dFNlbGYoKTtcbiAgICAgICAgICAgIHRoaXMuX2RiLnVwZFRvcGljKGR1bW15KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAocHJlcy53aGF0ID09ICd0YWdzJykge1xuICAgICAgICAgIHRoaXMuZ2V0TWV0YSh0aGlzLnN0YXJ0TWV0YVF1ZXJ5KCkud2l0aFRhZ3MoKS5idWlsZCgpKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5vblByZXMpIHtcbiAgICAgICAgdGhpcy5vblByZXMocHJlcyk7XG4gICAgICB9XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9LFxuXG4gIC8vIENvbnRhY3QgaXMgdXBkYXRlZCwgZXhlY3V0ZSBjYWxsYmFja3MuXG4gIF9yZWZyZXNoQ29udGFjdDoge1xuICAgIHZhbHVlOiBmdW5jdGlvbih3aGF0LCBjb250KSB7XG4gICAgICBpZiAodGhpcy5vbkNvbnRhY3RVcGRhdGUpIHtcbiAgICAgICAgdGhpcy5vbkNvbnRhY3RVcGRhdGUod2hhdCwgY29udCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9LFxuXG4gIC8qKlxuICAgKiBQdWJsaXNoaW5nIHRvIFRvcGljTWUgaXMgbm90IHN1cHBvcnRlZC4ge0BsaW5rIFRvcGljI3B1Ymxpc2h9IGlzIG92ZXJyaWRlbiBhbmQgdGhvd3MgYW4ge0Vycm9yfSBpZiBjYWxsZWQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWNNZSNcbiAgICogQHRocm93cyB7RXJyb3J9IEFsd2F5cyB0aHJvd3MgYW4gZXJyb3IuXG4gICAqL1xuICBwdWJsaXNoOiB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIlB1Ymxpc2hpbmcgdG8gJ21lJyBpcyBub3Qgc3VwcG9ydGVkXCIpKTtcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0sXG5cbiAgLyoqXG4gICAqIERlbGV0ZSB2YWxpZGF0aW9uIGNyZWRlbnRpYWwuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWNNZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gZGVsZXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1c2VyIC0gVXNlciBJRCB0byByZW1vdmUuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIGRlbENyZWRlbnRpYWw6IHtcbiAgICB2YWx1ZTogZnVuY3Rpb24obWV0aG9kLCB2YWx1ZSkge1xuICAgICAgaWYgKCF0aGlzLl9zdWJzY3JpYmVkKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJDYW5ub3QgZGVsZXRlIGNyZWRlbnRpYWwgaW4gaW5hY3RpdmUgJ21lJyB0b3BpY1wiKSk7XG4gICAgICB9XG4gICAgICAvLyBTZW5kIHtkZWx9IG1lc3NhZ2UsIHJldHVybiBwcm9taXNlXG4gICAgICByZXR1cm4gdGhpcy5fdGlub2RlLmRlbENyZWRlbnRpYWwobWV0aG9kLCB2YWx1ZSkudGhlbigoY3RybCkgPT4ge1xuICAgICAgICAvLyBSZW1vdmUgZGVsZXRlZCBjcmVkZW50aWFsIGZyb20gdGhlIGNhY2hlLlxuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuX2NyZWRlbnRpYWxzLmZpbmRJbmRleCgoZWwpID0+IHtcbiAgICAgICAgICByZXR1cm4gZWwubWV0aCA9PSBtZXRob2QgJiYgZWwudmFsID09IHZhbHVlO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICB0aGlzLl9jcmVkZW50aWFscy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9XG4gICAgICAgIC8vIE5vdGlmeSBsaXN0ZW5lcnNcbiAgICAgICAgaWYgKHRoaXMub25DcmVkc1VwZGF0ZWQpIHtcbiAgICAgICAgICB0aGlzLm9uQ3JlZHNVcGRhdGVkKHRoaXMuX2NyZWRlbnRpYWxzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY3RybDtcbiAgICAgIH0pO1xuXG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9LFxuXG4gIC8qKlxuICAgKiBAY2FsbGJhY2sgY29udGFjdEZpbHRlclxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGFjdCB0byBjaGVjayBmb3IgaW5jbHVzaW9uLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgY29udGFjdCBzaG91bGQgYmUgcHJvY2Vzc2VkLCA8Y29kZT5mYWxzZTwvY29kZT4gdG8gZXhjbHVkZSBpdC5cbiAgICovXG4gIC8qKlxuICAgKiBJdGVyYXRlIG92ZXIgY2FjaGVkIGNvbnRhY3RzLlxuICAgKlxuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpY01lI1xuICAgKiBAcGFyYW0ge1RvcGljTWUuQ29udGFjdENhbGxiYWNrfSBjYWxsYmFjayAtIENhbGxiYWNrIHRvIGNhbGwgZm9yIGVhY2ggY29udGFjdC5cbiAgICogQHBhcmFtIHtjb250YWN0RmlsdGVyPX0gZmlsdGVyIC0gT3B0aW9uYWxseSBmaWx0ZXIgY29udGFjdHM7IGluY2x1ZGUgYWxsIGlmIGZpbHRlciBpcyBmYWxzZS1pc2gsIG90aGVyd2lzZVxuICAgKiAgICAgIGluY2x1ZGUgdGhvc2UgZm9yIHdoaWNoIGZpbHRlciByZXR1cm5zIHRydWUtaXNoLlxuICAgKiBAcGFyYW0ge09iamVjdD19IGNvbnRleHQgLSBDb250ZXh0IHRvIHVzZSBmb3IgY2FsbGluZyB0aGUgYGNhbGxiYWNrYCwgaS5lLiB0aGUgdmFsdWUgb2YgYHRoaXNgIGluc2lkZSB0aGUgY2FsbGJhY2suXG4gICAqL1xuICBjb250YWN0czoge1xuICAgIHZhbHVlOiBmdW5jdGlvbihjYWxsYmFjaywgZmlsdGVyLCBjb250ZXh0KSB7XG4gICAgICB0aGlzLl90aW5vZGUuY2FjaGVNYXAoJ3RvcGljJywgKGMsIGlkeCkgPT4ge1xuICAgICAgICBpZiAoYy5pc0NvbW1UeXBlKCkgJiYgKCFmaWx0ZXIgfHwgZmlsdGVyKGMpKSkge1xuICAgICAgICAgIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgYywgaWR4KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9LFxuXG4gIC8qKlxuICAgKiBHZXQgYSBjb250YWN0IGZyb20gY2FjaGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWNNZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBjb250YWN0IHRvIGdldCwgZWl0aGVyIGEgVUlEIChmb3IgcDJwIHRvcGljcykgb3IgYSB0b3BpYyBuYW1lLlxuICAgKiBAcmV0dXJucyB7VGlub2RlLkNvbnRhY3R9IC0gQ29udGFjdCBvciBgdW5kZWZpbmVkYC5cbiAgICovXG4gIGdldENvbnRhY3Q6IHtcbiAgICB2YWx1ZTogZnVuY3Rpb24obmFtZSkge1xuICAgICAgcmV0dXJuIHRoaXMuX3Rpbm9kZS5jYWNoZUdldCgndG9waWMnLCBuYW1lKTtcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0sXG5cbiAgLyoqXG4gICAqIEdldCBhY2Nlc3MgbW9kZSBvZiBhIGdpdmVuIGNvbnRhY3QgZnJvbSBjYWNoZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpY01lI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIGNvbnRhY3QgdG8gZ2V0IGFjY2VzcyBtb2RlIGZvciwgZWl0aGVyIGEgVUlEIChmb3IgcDJwIHRvcGljcylcbiAgICogICAgICAgIG9yIGEgdG9waWMgbmFtZTsgaWYgbWlzc2luZywgYWNjZXNzIG1vZGUgZm9yIHRoZSAnbWUnIHRvcGljIGl0c2VsZi5cbiAgICogQHJldHVybnMge3N0cmluZ30gLSBhY2Nlc3MgbW9kZSwgc3VjaCBhcyBgUldQYC5cbiAgICovXG4gIGdldEFjY2Vzc01vZGU6IHtcbiAgICB2YWx1ZTogZnVuY3Rpb24obmFtZSkge1xuICAgICAgaWYgKG5hbWUpIHtcbiAgICAgICAgY29uc3QgY29udCA9IHRoaXMuX3Rpbm9kZS5jYWNoZUdldCgndG9waWMnLCBuYW1lKTtcbiAgICAgICAgcmV0dXJuIGNvbnQgPyBjb250LmFjcyA6IG51bGw7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5hY3M7XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9LFxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBjb250YWN0IGlzIGFyY2hpdmVkLCBpLmUuIGNvbnRhY3QucHJpdmF0ZS5hcmNoID09IHRydWUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWNNZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBjb250YWN0IHRvIGNoZWNrIGFyY2hpdmVkIHN0YXR1cywgZWl0aGVyIGEgVUlEIChmb3IgcDJwIHRvcGljcykgb3IgYSB0b3BpYyBuYW1lLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSB0cnVlIGlmIGNvbnRhY3QgaXMgYXJjaGl2ZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAgICovXG4gIGlzQXJjaGl2ZWQ6IHtcbiAgICB2YWx1ZTogZnVuY3Rpb24obmFtZSkge1xuICAgICAgY29uc3QgY29udCA9IHRoaXMuX3Rpbm9kZS5jYWNoZUdldCgndG9waWMnLCBuYW1lKTtcbiAgICAgIHJldHVybiBjb250ID8gKChjb250LnByaXZhdGUgJiYgY29udC5wcml2YXRlLmFyY2gpID8gdHJ1ZSA6IGZhbHNlKSA6IG51bGw7XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9LFxuXG4gIC8qKlxuICAgKiBAdHlwZWRlZiBUaW5vZGUuQ3JlZGVudGlhbFxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEB0eXBlIE9iamVjdFxuICAgKiBAcHJvcGVydHkge3N0cmluZ30gbWV0aCAtIHZhbGlkYXRpb24gbWV0aG9kIHN1Y2ggYXMgJ2VtYWlsJyBvciAndGVsJy5cbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IHZhbCAtIGNyZWRlbnRpYWwgdmFsdWUsIGkuZS4gJ2pkb2VAZXhhbXBsZS5jb20nIG9yICcrMTcwMjU1NTEyMzQnXG4gICAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gZG9uZSAtIHRydWUgaWYgY3JlZGVudGlhbCBpcyB2YWxpZGF0ZWQuXG4gICAqL1xuICAvKipcbiAgICogR2V0IHRoZSB1c2VyJ3MgY3JlZGVudGlhbHM6IGVtYWlsLCBwaG9uZSwgZXRjLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljTWUjXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuQ3JlZGVudGlhbFtdfSAtIGFycmF5IG9mIGNyZWRlbnRpYWxzLlxuICAgKi9cbiAgZ2V0Q3JlZGVudGlhbHM6IHtcbiAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fY3JlZGVudGlhbHM7XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9XG59KTtcblRvcGljTWUucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gVG9waWNNZTtcblxuLyoqXG4gKiBAY2xhc3MgVG9waWNGbmQgLSBzcGVjaWFsIGNhc2Ugb2Yge0BsaW5rIFRpbm9kZS5Ub3BpY30gZm9yIHNlYXJjaGluZyBmb3JcbiAqIGNvbnRhY3RzIGFuZCBncm91cCB0b3BpY3MuXG4gKiBAZXh0ZW5kcyBUaW5vZGUuVG9waWNcbiAqIEBtZW1iZXJvZiBUaW5vZGVcbiAqXG4gKiBAcGFyYW0ge1RvcGljRm5kLkNhbGxiYWNrc30gY2FsbGJhY2tzIC0gQ2FsbGJhY2tzIHRvIHJlY2VpdmUgdmFyaW91cyBldmVudHMuXG4gKi9cbnZhciBUb3BpY0ZuZCA9IGZ1bmN0aW9uKGNhbGxiYWNrcykge1xuICBUb3BpYy5jYWxsKHRoaXMsIFRPUElDX0ZORCwgY2FsbGJhY2tzKTtcbiAgLy8gTGlzdCBvZiB1c2VycyBhbmQgdG9waWNzIHVpZCBvciB0b3BpY19uYW1lIC0+IENvbnRhY3Qgb2JqZWN0KVxuICB0aGlzLl9jb250YWN0cyA9IHt9O1xufTtcblxuLy8gSW5oZXJpdCBldmVyeXRpbmcgZnJvbSB0aGUgZ2VuZXJpYyBUb3BpY1xuVG9waWNGbmQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShUb3BpYy5wcm90b3R5cGUsIHtcbiAgLy8gT3ZlcnJpZGUgdGhlIG9yaWdpbmFsIFRvcGljLl9wcm9jZXNzTWV0YVN1YlxuICBfcHJvY2Vzc01ldGFTdWI6IHtcbiAgICB2YWx1ZTogZnVuY3Rpb24oc3Vicykge1xuICAgICAgbGV0IHVwZGF0ZUNvdW50ID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGhpcy5fY29udGFjdHMpLmxlbmd0aDtcbiAgICAgIC8vIFJlc2V0IGNvbnRhY3QgbGlzdC5cbiAgICAgIHRoaXMuX2NvbnRhY3RzID0ge307XG4gICAgICBmb3IgKGxldCBpZHggaW4gc3Vicykge1xuICAgICAgICBsZXQgc3ViID0gc3Vic1tpZHhdO1xuICAgICAgICBjb25zdCBpbmRleEJ5ID0gc3ViLnRvcGljID8gc3ViLnRvcGljIDogc3ViLnVzZXI7XG5cbiAgICAgICAgc3ViLnVwZGF0ZWQgPSBuZXcgRGF0ZShzdWIudXBkYXRlZCk7XG4gICAgICAgIGlmIChzdWIuc2VlbiAmJiBzdWIuc2Vlbi53aGVuKSB7XG4gICAgICAgICAgc3ViLnNlZW4ud2hlbiA9IG5ldyBEYXRlKHN1Yi5zZWVuLndoZW4pO1xuICAgICAgICB9XG5cbiAgICAgICAgc3ViID0gbWVyZ2VUb0NhY2hlKHRoaXMuX2NvbnRhY3RzLCBpbmRleEJ5LCBzdWIpO1xuICAgICAgICB1cGRhdGVDb3VudCsrO1xuXG4gICAgICAgIGlmICh0aGlzLm9uTWV0YVN1Yikge1xuICAgICAgICAgIHRoaXMub25NZXRhU3ViKHN1Yik7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHVwZGF0ZUNvdW50ID4gMCAmJiB0aGlzLm9uU3Vic1VwZGF0ZWQpIHtcbiAgICAgICAgdGhpcy5vblN1YnNVcGRhdGVkKE9iamVjdC5rZXlzKHRoaXMuX2NvbnRhY3RzKSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9LFxuXG4gIC8qKlxuICAgKiBQdWJsaXNoaW5nIHRvIFRvcGljRm5kIGlzIG5vdCBzdXBwb3J0ZWQuIHtAbGluayBUb3BpYyNwdWJsaXNofSBpcyBvdmVycmlkZW4gYW5kIHRob3dzIGFuIHtFcnJvcn0gaWYgY2FsbGVkLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljRm5kI1xuICAgKiBAdGhyb3dzIHtFcnJvcn0gQWx3YXlzIHRocm93cyBhbiBlcnJvci5cbiAgICovXG4gIHB1Ymxpc2g6IHtcbiAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiUHVibGlzaGluZyB0byAnZm5kJyBpcyBub3Qgc3VwcG9ydGVkXCIpKTtcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0sXG5cbiAgLyoqXG4gICAqIHNldE1ldGEgdG8gVG9waWNGbmQgcmVzZXRzIGNvbnRhY3QgbGlzdCBpbiBhZGRpdGlvbiB0byBzZW5kaW5nIHRoZSBtZXNzYWdlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljRm5kI1xuICAgKiBAcGFyYW0ge1Rpbm9kZS5TZXRQYXJhbXN9IHBhcmFtcyBwYXJhbWV0ZXJzIHRvIHVwZGF0ZS5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHJlcXVlc3QuXG4gICAqL1xuICBzZXRNZXRhOiB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uKHBhcmFtcykge1xuICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzO1xuICAgICAgcmV0dXJuIE9iamVjdC5nZXRQcm90b3R5cGVPZihUb3BpY0ZuZC5wcm90b3R5cGUpLnNldE1ldGEuY2FsbCh0aGlzLCBwYXJhbXMpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhpbnN0YW5jZS5fY29udGFjdHMpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBpbnN0YW5jZS5fY29udGFjdHMgPSB7fTtcbiAgICAgICAgICBpZiAoaW5zdGFuY2Uub25TdWJzVXBkYXRlZCkge1xuICAgICAgICAgICAgaW5zdGFuY2Uub25TdWJzVXBkYXRlZChbXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0sXG5cbiAgLyoqXG4gICAqIEl0ZXJhdGUgb3ZlciBmb3VuZCBjb250YWN0cy4gSWYgY2FsbGJhY2sgaXMgdW5kZWZpbmVkLCB1c2Uge0BsaW5rIHRoaXMub25NZXRhU3VifS5cbiAgICogQGZ1bmN0aW9uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWNGbmQjXG4gICAqIEBwYXJhbSB7VG9waWNGbmQuQ29udGFjdENhbGxiYWNrfSBjYWxsYmFjayAtIENhbGxiYWNrIHRvIGNhbGwgZm9yIGVhY2ggY29udGFjdC5cbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSBDb250ZXh0IHRvIHVzZSBmb3IgY2FsbGluZyB0aGUgYGNhbGxiYWNrYCwgaS5lLiB0aGUgdmFsdWUgb2YgYHRoaXNgIGluc2lkZSB0aGUgY2FsbGJhY2suXG4gICAqL1xuICBjb250YWN0czoge1xuICAgIHZhbHVlOiBmdW5jdGlvbihjYWxsYmFjaywgY29udGV4dCkge1xuICAgICAgY29uc3QgY2IgPSAoY2FsbGJhY2sgfHwgdGhpcy5vbk1ldGFTdWIpO1xuICAgICAgaWYgKGNiKSB7XG4gICAgICAgIGZvciAobGV0IGlkeCBpbiB0aGlzLl9jb250YWN0cykge1xuICAgICAgICAgIGNiLmNhbGwoY29udGV4dCwgdGhpcy5fY29udGFjdHNbaWR4XSwgaWR4LCB0aGlzLl9jb250YWN0cyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH1cbn0pO1xuVG9waWNGbmQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gVG9waWNGbmQ7XG5cbi8qKlxuICogQGNsYXNzIExhcmdlRmlsZUhlbHBlciAtIGNvbGxlY3Rpb24gb2YgdXRpbGl0aWVzIGZvciB1cGxvYWRpbmcgYW5kIGRvd25sb2FkaW5nIGZpbGVzXG4gKiBvdXQgb2YgYmFuZC4gRG9uJ3QgaW5zdGFudGlhdGUgdGhpcyBjbGFzcyBkaXJlY3RseS4gVXNlIHtUaW5vZGUuZ2V0TGFyZ2VGaWxlSGVscGVyfSBpbnN0ZWFkLlxuICogQG1lbWJlcm9mIFRpbm9kZVxuICpcbiAqIEBwYXJhbSB7VGlub2RlfSB0aW5vZGUgLSB0aGUgbWFpbiBUaW5vZGUgb2JqZWN0LlxuICovXG52YXIgTGFyZ2VGaWxlSGVscGVyID0gZnVuY3Rpb24odGlub2RlKSB7XG4gIHRoaXMuX3Rpbm9kZSA9IHRpbm9kZTtcblxuICB0aGlzLl9hcGlLZXkgPSB0aW5vZGUuX2FwaUtleTtcbiAgdGhpcy5fYXV0aFRva2VuID0gdGlub2RlLmdldEF1dGhUb2tlbigpO1xuICB0aGlzLl9tc2dJZCA9IHRpbm9kZS5nZXROZXh0VW5pcXVlSWQoKTtcbiAgdGhpcy54aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAvLyBQcm9taXNlXG4gIHRoaXMudG9SZXNvbHZlID0gbnVsbDtcbiAgdGhpcy50b1JlamVjdCA9IG51bGw7XG5cbiAgLy8gQ2FsbGJhY2tzXG4gIHRoaXMub25Qcm9ncmVzcyA9IG51bGw7XG4gIHRoaXMub25TdWNjZXNzID0gbnVsbDtcbiAgdGhpcy5vbkZhaWx1cmUgPSBudWxsO1xufVxuXG5MYXJnZUZpbGVIZWxwZXIucHJvdG90eXBlID0ge1xuICAvKipcbiAgICogU3RhcnQgdXBsb2FkaW5nIHRoZSBmaWxlIHRvIGEgbm9uLWRlZmF1bHQgZW5kcG9pbnQuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTGFyZ2VGaWxlSGVscGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gYmFzZVVybCBhbHRlcm5hdGl2ZSBiYXNlIFVSTCBvZiB1cGxvYWQgc2VydmVyLlxuICAgKiBAcGFyYW0ge0ZpbGV8QmxvYn0gZGF0YSB0byB1cGxvYWRcbiAgICogQHBhcmFtIHtDYWxsYmFja30gb25Qcm9ncmVzcyBjYWxsYmFjay4gVGFrZXMgb25lIHtmbG9hdH0gcGFyYW1ldGVyIDAuLjFcbiAgICogQHBhcmFtIHtDYWxsYmFja30gb25TdWNjZXNzIGNhbGxiYWNrLiBDYWxsZWQgd2hlbiB0aGUgZmlsZSBpcyBzdWNjZXNzZnVsbHkgdXBsb2FkZWQuXG4gICAqIEBwYXJhbSB7Q2FsbGJhY2t9IG9uRmFpbHVyZSBjYWxsYmFjay4gQ2FsbGVkIGluIGNhc2Ugb2YgYSBmYWlsdXJlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgdXBsb2FkIGlzIGNvbXBsZXRlZC9mYWlsZWQuXG4gICAqL1xuICB1cGxvYWRXaXRoQmFzZVVybDogZnVuY3Rpb24oYmFzZVVybCwgZGF0YSwgb25Qcm9ncmVzcywgb25TdWNjZXNzLCBvbkZhaWx1cmUpIHtcbiAgICBpZiAoIXRoaXMuX2F1dGhUb2tlbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTXVzdCBhdXRoZW50aWNhdGUgZmlyc3RcIik7XG4gICAgfVxuICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcztcblxuICAgIGxldCB1cmwgPSAnL3YnICsgUFJPVE9DT0xfVkVSU0lPTiArICcvZmlsZS91Lyc7XG4gICAgaWYgKGJhc2VVcmwpIHtcbiAgICAgIGlmIChiYXNlVXJsLmluZGV4T2YoJ2h0dHA6Ly8nKSA9PSAwIHx8IGJhc2VVcmwuaW5kZXhPZignaHR0cHM6Ly8nKSA9PSAwKSB7XG4gICAgICAgIHVybCA9IGJhc2VVcmwgKyB1cmw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgYmFzZSBVUkwgJyR7YmFzZVVybH0nYCk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMueGhyLm9wZW4oJ1BPU1QnLCB1cmwsIHRydWUpO1xuICAgIHRoaXMueGhyLnNldFJlcXVlc3RIZWFkZXIoJ1gtVGlub2RlLUFQSUtleScsIHRoaXMuX2FwaUtleSk7XG4gICAgdGhpcy54aHIuc2V0UmVxdWVzdEhlYWRlcignWC1UaW5vZGUtQXV0aCcsICdUb2tlbiAnICsgdGhpcy5fYXV0aFRva2VuLnRva2VuKTtcbiAgICBjb25zdCByZXN1bHQgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLnRvUmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgICB0aGlzLnRvUmVqZWN0ID0gcmVqZWN0O1xuICAgIH0pO1xuXG4gICAgdGhpcy5vblByb2dyZXNzID0gb25Qcm9ncmVzcztcbiAgICB0aGlzLm9uU3VjY2VzcyA9IG9uU3VjY2VzcztcbiAgICB0aGlzLm9uRmFpbHVyZSA9IG9uRmFpbHVyZTtcblxuICAgIHRoaXMueGhyLnVwbG9hZC5vbnByb2dyZXNzID0gKGUpID0+IHtcbiAgICAgIGlmIChlLmxlbmd0aENvbXB1dGFibGUgJiYgaW5zdGFuY2Uub25Qcm9ncmVzcykge1xuICAgICAgICBpbnN0YW5jZS5vblByb2dyZXNzKGUubG9hZGVkIC8gZS50b3RhbCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy54aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgcGt0O1xuICAgICAgdHJ5IHtcbiAgICAgICAgcGt0ID0gSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlLCBqc29uUGFyc2VIZWxwZXIpO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGluc3RhbmNlLl90aW5vZGUubG9nZ2VyKFwiRVJST1I6IEludmFsaWQgc2VydmVyIHJlc3BvbnNlIGluIExhcmdlRmlsZUhlbHBlclwiLCB0aGlzLnJlc3BvbnNlKTtcbiAgICAgICAgcGt0ID0ge1xuICAgICAgICAgIGN0cmw6IHtcbiAgICAgICAgICAgIGNvZGU6IHRoaXMuc3RhdHVzLFxuICAgICAgICAgICAgdGV4dDogdGhpcy5zdGF0dXNUZXh0XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5zdGF0dXMgPj0gMjAwICYmIHRoaXMuc3RhdHVzIDwgMzAwKSB7XG4gICAgICAgIGlmIChpbnN0YW5jZS50b1Jlc29sdmUpIHtcbiAgICAgICAgICBpbnN0YW5jZS50b1Jlc29sdmUocGt0LmN0cmwucGFyYW1zLnVybCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGluc3RhbmNlLm9uU3VjY2Vzcykge1xuICAgICAgICAgIGluc3RhbmNlLm9uU3VjY2Vzcyhwa3QuY3RybCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0dXMgPj0gNDAwKSB7XG4gICAgICAgIGlmIChpbnN0YW5jZS50b1JlamVjdCkge1xuICAgICAgICAgIGluc3RhbmNlLnRvUmVqZWN0KG5ldyBFcnJvcihgJHtwa3QuY3RybC50ZXh0fSAoJHtwa3QuY3RybC5jb2RlfSlgKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGluc3RhbmNlLm9uRmFpbHVyZSkge1xuICAgICAgICAgIGluc3RhbmNlLm9uRmFpbHVyZShwa3QuY3RybClcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5zdGFuY2UuX3Rpbm9kZS5sb2dnZXIoXCJFUlJPUjogVW5leHBlY3RlZCBzZXJ2ZXIgcmVzcG9uc2Ugc3RhdHVzXCIsIHRoaXMuc3RhdHVzLCB0aGlzLnJlc3BvbnNlKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy54aHIub25lcnJvciA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgIGlmIChpbnN0YW5jZS50b1JlamVjdCkge1xuICAgICAgICBpbnN0YW5jZS50b1JlamVjdChuZXcgRXJyb3IoXCJmYWlsZWRcIikpO1xuICAgICAgfVxuICAgICAgaWYgKGluc3RhbmNlLm9uRmFpbHVyZSkge1xuICAgICAgICBpbnN0YW5jZS5vbkZhaWx1cmUobnVsbCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMueGhyLm9uYWJvcnQgPSBmdW5jdGlvbihlKSB7XG4gICAgICBpZiAoaW5zdGFuY2UudG9SZWplY3QpIHtcbiAgICAgICAgaW5zdGFuY2UudG9SZWplY3QobmV3IEVycm9yKFwidXBsb2FkIGNhbmNlbGxlZCBieSB1c2VyXCIpKTtcbiAgICAgIH1cbiAgICAgIGlmIChpbnN0YW5jZS5vbkZhaWx1cmUpIHtcbiAgICAgICAgaW5zdGFuY2Uub25GYWlsdXJlKG51bGwpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgZm9ybSA9IG5ldyBGb3JtRGF0YSgpO1xuICAgICAgZm9ybS5hcHBlbmQoJ2ZpbGUnLCBkYXRhKTtcbiAgICAgIGZvcm0uc2V0KCdpZCcsIHRoaXMuX21zZ0lkKTtcbiAgICAgIHRoaXMueGhyLnNlbmQoZm9ybSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBpZiAodGhpcy50b1JlamVjdCkge1xuICAgICAgICB0aGlzLnRvUmVqZWN0KGVycik7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5vbkZhaWx1cmUpIHtcbiAgICAgICAgdGhpcy5vbkZhaWx1cmUobnVsbCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSxcblxuICAvKipcbiAgICogU3RhcnQgdXBsb2FkaW5nIHRoZSBmaWxlIHRvIGRlZmF1bHQgZW5kcG9pbnQuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTGFyZ2VGaWxlSGVscGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge0ZpbGV8QmxvYn0gZGF0YSB0byB1cGxvYWRcbiAgICogQHBhcmFtIHtDYWxsYmFja30gb25Qcm9ncmVzcyBjYWxsYmFjay4gVGFrZXMgb25lIHtmbG9hdH0gcGFyYW1ldGVyIDAuLjFcbiAgICogQHBhcmFtIHtDYWxsYmFja30gb25TdWNjZXNzIGNhbGxiYWNrLiBDYWxsZWQgd2hlbiB0aGUgZmlsZSBpcyBzdWNjZXNzZnVsbHkgdXBsb2FkZWQuXG4gICAqIEBwYXJhbSB7Q2FsbGJhY2t9IG9uRmFpbHVyZSBjYWxsYmFjay4gQ2FsbGVkIGluIGNhc2Ugb2YgYSBmYWlsdXJlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgdXBsb2FkIGlzIGNvbXBsZXRlZC9mYWlsZWQuXG4gICAqL1xuICB1cGxvYWQ6IGZ1bmN0aW9uKGRhdGEsIG9uUHJvZ3Jlc3MsIG9uU3VjY2Vzcywgb25GYWlsdXJlKSB7XG4gICAgcmV0dXJuIHRoaXMudXBsb2FkV2l0aEJhc2VVcmwodW5kZWZpbmVkLCBkYXRhLCBvblByb2dyZXNzLCBvblN1Y2Nlc3MsIG9uRmFpbHVyZSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIERvd25sb2FkIHRoZSBmaWxlIGZyb20gYSBnaXZlbiBVUkwgdXNpbmcgR0VUIHJlcXVlc3QuIFRoaXMgbWV0aG9kIHdvcmtzIHdpdGggdGhlIFRpbm9kZSBzZXJ2ZXIgb25seS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZS5MYXJnZUZpbGVIZWxwZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSByZWxhdGl2ZVVybCAtIFVSTCB0byBkb3dubG9hZCB0aGUgZmlsZSBmcm9tLiBNdXN0IGJlIHJlbGF0aXZlIHVybCwgaS5lLiBtdXN0IG5vdCBjb250YWluIHRoZSBob3N0LlxuICAgKiBAcGFyYW0ge3N0cmluZz19IGZpbGVuYW1lIC0gZmlsZSBuYW1lIHRvIHVzZSBmb3IgdGhlIGRvd25sb2FkZWQgZmlsZS5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIGRvd25sb2FkIGlzIGNvbXBsZXRlZC9mYWlsZWQuXG4gICAqL1xuICBkb3dubG9hZDogZnVuY3Rpb24ocmVsYXRpdmVVcmwsIGZpbGVuYW1lLCBtaW1ldHlwZSwgb25Qcm9ncmVzcywgb25FcnJvcikge1xuICAgIGlmICghVGlub2RlLmlzUmVsYXRpdmVVUkwocmVsYXRpdmVVcmwpKSB7XG4gICAgICAvLyBBcyBhIHNlY3VyaXR5IG1lYXN1cmUgcmVmdXNlIHRvIGRvd25sb2FkIGZyb20gYW4gYWJzb2x1dGUgVVJMLlxuICAgICAgaWYgKG9uRXJyb3IpIHtcbiAgICAgICAgb25FcnJvcihgVGhlIFVSTCAnJHtyZWxhdGl2ZVVybH0nIG11c3QgYmUgcmVsYXRpdmUsIG5vdCBhYnNvbHV0ZWApO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuX2F1dGhUb2tlbikge1xuICAgICAgaWYgKG9uRXJyb3IpIHtcbiAgICAgICAgb25FcnJvcihcIk11c3QgYXV0aGVudGljYXRlIGZpcnN0XCIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXM7XG4gICAgLy8gR2V0IGRhdGEgYXMgYmxvYiAoc3RvcmVkIGJ5IHRoZSBicm93c2VyIGFzIGEgdGVtcG9yYXJ5IGZpbGUpLlxuICAgIHRoaXMueGhyLm9wZW4oJ0dFVCcsIHJlbGF0aXZlVXJsLCB0cnVlKTtcbiAgICB0aGlzLnhoci5zZXRSZXF1ZXN0SGVhZGVyKCdYLVRpbm9kZS1BUElLZXknLCB0aGlzLl9hcGlLZXkpO1xuICAgIHRoaXMueGhyLnNldFJlcXVlc3RIZWFkZXIoJ1gtVGlub2RlLUF1dGgnLCAnVG9rZW4gJyArIHRoaXMuX2F1dGhUb2tlbi50b2tlbik7XG4gICAgdGhpcy54aHIucmVzcG9uc2VUeXBlID0gJ2Jsb2InO1xuXG4gICAgdGhpcy5vblByb2dyZXNzID0gb25Qcm9ncmVzcztcbiAgICB0aGlzLnhoci5vbnByb2dyZXNzID0gZnVuY3Rpb24oZSkge1xuICAgICAgaWYgKGluc3RhbmNlLm9uUHJvZ3Jlc3MpIHtcbiAgICAgICAgLy8gUGFzc2luZyBlLmxvYWRlZCBpbnN0ZWFkIG9mIGUubG9hZGVkL2UudG90YWwgYmVjYXVzZSBlLnRvdGFsXG4gICAgICAgIC8vIGlzIGFsd2F5cyAwIHdpdGggZ3ppcCBjb21wcmVzc2lvbiBlbmFibGVkIGJ5IHRoZSBzZXJ2ZXIuXG4gICAgICAgIGluc3RhbmNlLm9uUHJvZ3Jlc3MoZS5sb2FkZWQpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCByZXN1bHQgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLnRvUmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgICB0aGlzLnRvUmVqZWN0ID0gcmVqZWN0O1xuICAgIH0pO1xuXG4gICAgLy8gVGhlIGJsb2IgbmVlZHMgdG8gYmUgc2F2ZWQgYXMgZmlsZS4gVGhlcmUgaXMgbm8ga25vd24gd2F5IHRvXG4gICAgLy8gc2F2ZSB0aGUgYmxvYiBhcyBmaWxlIG90aGVyIHRoYW4gdG8gZmFrZSBhIGNsaWNrIG9uIGFuIDxhIGhyZWYuLi4gZG93bmxvYWQ9Li4uPi5cbiAgICB0aGlzLnhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLnN0YXR1cyA9PSAyMDApIHtcbiAgICAgICAgY29uc3QgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgICAgLy8gVVJMLmNyZWF0ZU9iamVjdFVSTCBpcyBub3QgYXZhaWxhYmxlIGluIG5vbi1icm93c2VyIGVudmlyb25tZW50LiBUaGlzIGNhbGwgd2lsbCBmYWlsLlxuICAgICAgICBsaW5rLmhyZWYgPSB3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTChuZXcgQmxvYihbdGhpcy5yZXNwb25zZV0sIHtcbiAgICAgICAgICB0eXBlOiBtaW1ldHlwZVxuICAgICAgICB9KSk7XG4gICAgICAgIGxpbmsuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgbGluay5zZXRBdHRyaWJ1dGUoJ2Rvd25sb2FkJywgZmlsZW5hbWUpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpbmspO1xuICAgICAgICBsaW5rLmNsaWNrKCk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQobGluayk7XG4gICAgICAgIHdpbmRvdy5VUkwucmV2b2tlT2JqZWN0VVJMKGxpbmsuaHJlZik7XG4gICAgICAgIGlmIChpbnN0YW5jZS50b1Jlc29sdmUpIHtcbiAgICAgICAgICBpbnN0YW5jZS50b1Jlc29sdmUoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLnN0YXR1cyA+PSA0MDAgJiYgaW5zdGFuY2UudG9SZWplY3QpIHtcbiAgICAgICAgLy8gVGhlIHRoaXMucmVzcG9uc2VUZXh0IGlzIHVuZGVmaW5lZCwgbXVzdCB1c2UgdGhpcy5yZXNwb25zZSB3aGljaCBpcyBhIGJsb2IuXG4gICAgICAgIC8vIE5lZWQgdG8gY29udmVydCB0aGlzLnJlc3BvbnNlIHRvIEpTT04uIFRoZSBibG9iIGNhbiBvbmx5IGJlIGFjY2Vzc2VkIGJ5IHRoZVxuICAgICAgICAvLyBGaWxlUmVhZGVyLlxuICAgICAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHBrdCA9IEpTT04ucGFyc2UodGhpcy5yZXN1bHQsIGpzb25QYXJzZUhlbHBlcik7XG4gICAgICAgICAgICBpbnN0YW5jZS50b1JlamVjdChuZXcgRXJyb3IoYCR7cGt0LmN0cmwudGV4dH0gKCR7cGt0LmN0cmwuY29kZX0pYCkpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgaW5zdGFuY2UuX3Rpbm9kZS5sb2dnZXIoXCJFUlJPUjogSW52YWxpZCBzZXJ2ZXIgcmVzcG9uc2UgaW4gTGFyZ2VGaWxlSGVscGVyXCIsIHRoaXMucmVzdWx0KTtcbiAgICAgICAgICAgIGluc3RhbmNlLnRvUmVqZWN0KGVycik7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZWFkZXIucmVhZEFzVGV4dCh0aGlzLnJlc3BvbnNlKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy54aHIub25lcnJvciA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgIGlmIChpbnN0YW5jZS50b1JlamVjdCkge1xuICAgICAgICBpbnN0YW5jZS50b1JlamVjdChuZXcgRXJyb3IoXCJmYWlsZWRcIikpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLnhoci5vbmFib3J0ID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoaW5zdGFuY2UudG9SZWplY3QpIHtcbiAgICAgICAgaW5zdGFuY2UudG9SZWplY3QobnVsbCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRyeSB7XG4gICAgICB0aGlzLnhoci5zZW5kKCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBpZiAodGhpcy50b1JlamVjdCkge1xuICAgICAgICB0aGlzLnRvUmVqZWN0KGVycik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSxcblxuICAvKipcbiAgICogVHJ5IHRvIGNhbmNlbCBhbiBvbmdvaW5nIHVwbG9hZCBvciBkb3dubG9hZC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5MYXJnZUZpbGVIZWxwZXIjXG4gICAqL1xuICBjYW5jZWw6IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLnhociAmJiB0aGlzLnhoci5yZWFkeVN0YXRlIDwgNCkge1xuICAgICAgdGhpcy54aHIuYWJvcnQoKTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIEdldCB1bmlxdWUgaWQgb2YgdGhpcyByZXF1ZXN0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkxhcmdlRmlsZUhlbHBlciNcbiAgICpcbiAgICogQHJldHVybnMge3N0cmluZ30gdW5pcXVlIGlkXG4gICAqL1xuICBnZXRJZDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX21zZ0lkO1xuICB9XG59O1xuXG4vKipcbiAqIEBjbGFzcyBNZXNzYWdlIC0gZGVmaW5pdGlvbiBhIGNvbW11bmljYXRpb24gbWVzc2FnZS5cbiAqIFdvcmsgaW4gcHJvZ3Jlc3MuXG4gKiBAbWVtYmVyb2YgVGlub2RlXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRvcGljXyAtIG5hbWUgb2YgdGhlIHRvcGljIHRoZSBtZXNzYWdlIGJlbG9uZ3MgdG8uXG4gKiBAcGFyYW0ge3N0cmluZyB8IERyYWZ0eX0gY29udGVudF8gLSBtZXNzYWdlIGNvbnRhbnQuXG4gKi9cbnZhciBNZXNzYWdlID0gZnVuY3Rpb24odG9waWNfLCBjb250ZW50Xykge1xuICB0aGlzLnN0YXR1cyA9IE1lc3NhZ2UuU1RBVFVTX05PTkU7XG4gIHRoaXMudG9waWMgPSB0b3BpY187XG4gIHRoaXMuY29udGVudCA9IGNvbnRlbnRfO1xufVxuXG5NZXNzYWdlLlNUQVRVU19OT05FID0gTUVTU0FHRV9TVEFUVVNfTk9ORTtcbk1lc3NhZ2UuU1RBVFVTX1FVRVVFRCA9IE1FU1NBR0VfU1RBVFVTX1FVRVVFRDtcbk1lc3NhZ2UuU1RBVFVTX1NFTkRJTkcgPSBNRVNTQUdFX1NUQVRVU19TRU5ESU5HO1xuTWVzc2FnZS5TVEFUVVNfRkFJTEVEID0gTUVTU0FHRV9TVEFUVVNfRkFJTEVEO1xuTWVzc2FnZS5TVEFUVVNfU0VOVCA9IE1FU1NBR0VfU1RBVFVTX1NFTlQ7XG5NZXNzYWdlLlNUQVRVU19SRUNFSVZFRCA9IE1FU1NBR0VfU1RBVFVTX1JFQ0VJVkVEO1xuTWVzc2FnZS5TVEFUVVNfUkVBRCA9IE1FU1NBR0VfU1RBVFVTX1JFQUQ7XG5NZXNzYWdlLlNUQVRVU19UT19NRSA9IE1FU1NBR0VfU1RBVFVTX1RPX01FO1xuXG5NZXNzYWdlLnByb3RvdHlwZSA9IHtcbiAgLyoqXG4gICAqIENvbnZlcnQgbWVzc2FnZSBvYmplY3QgdG8ge3B1Yn0gcGFja2V0LlxuICAgKi9cbiAgdG9KU09OOiBmdW5jdGlvbigpIHtcblxuICB9LFxuICAvKipcbiAgICogUGFyc2UgSlNPTiBpbnRvIG1lc3NhZ2UuXG4gICAqL1xuICBmcm9tSlNPTjogZnVuY3Rpb24oanNvbikge1xuXG4gIH1cbn1cbk1lc3NhZ2UucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gTWVzc2FnZTtcblxuaWYgKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBUaW5vZGU7XG4gIG1vZHVsZS5leHBvcnRzLkRyYWZ0eSA9IERyYWZ0eTtcbiAgbW9kdWxlLmV4cG9ydHMuQWNjZXNzTW9kZSA9IEFjY2Vzc01vZGU7XG59XG4iLCJtb2R1bGUuZXhwb3J0cz17XCJ2ZXJzaW9uXCI6IFwiMC4xNy4wLXJjMlwifVxuIl19

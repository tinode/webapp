// Babel JSX

'use strict';

if (typeof require == 'function') {
  if (typeof React == 'undefined') {
    var React = require('react');
    var ReactDOM = require('react-dom');
  }
  if (typeof Tinode == 'undefined') {
    var Tinode = require('tinode-sdk');
    var Drafty = Tinode.Drafty;
  }
  if (typeof firebase == 'undefined') {
    var firebase = require('firebase/app');
    require('firebase/messaging');
  }
  if (typeof ReactIntl == 'undefined') {
    var ReactIntl = require('react-intl');
    var {IntlProvider, FormattedMessage} = ReactIntl;
  }
  var package_version = require('../version.json').version;
}

// Name of this application, used in the User-Agent.
const APP_NAME = 'TinodeWeb/' + (package_version || '0.15');

const KNOWN_HOSTS = {hosted: 'api.tinode.co', local: 'localhost:6060'};
// Default host name and port to connect to.
const DEFAULT_HOST = KNOWN_HOSTS.hosted;
// var DEFAULT_HOST = KNOWN_HOSTS.local;

// Sound to play on message received.
const POP_SOUND = new Audio('audio/msg.mp3');

// API key. Use https://github.com/tinode/chat/tree/master/keygen to generate your own
const API_KEY = 'AQEAAAABAAD_rAp4DJh05a1HAwFT3A6K';

// Minimum time between two keypress notifications, milliseconds.
const KEYPRESS_DELAY = 3*1000;
// Delay before sending a {note} for reciving a message, milliseconds.
const RECEIVED_DELAY = 500;
// Delay before sending a read notification, milliseconds.
const READ_DELAY = 1000;

// The shortest allowed tag length. Matches one on the server.
const MIN_TAG_LENGTH = 4;

// Mediaquery breakpoint between desktop and mobile, in px. Should match the value
// in @meadia (max-size: 640px) in base.css
const MEDIA_BREAKPOINT = 640;
// Size of css 'rem' unit in pixels. Default 1rem = 10pt = 13px.
const REM_SIZE = 13;

// Size of the avatar image
const AVATAR_SIZE = 128;

// Number of chat messages to fetch in one call.
const MESSAGES_PAGE = 24;

// Maximum in-band (included directly into the message) attachment size which fits into
// a message of 256K in size, assuming base64 encoding and 1024 bytes of overhead.
// This is size of an object *before* base64 encoding is applied.
// Increase this limit to a greater value in production, if desired. Also increase
// max_message_size in server config.
//  MAX_INBAND_ATTACHMENT_SIZE = base64DecodedLen(max_message_size - overhead);
const MAX_INBAND_ATTACHMENT_SIZE = 195840;

// Absolute maximum attachment size to be used with the server = 8MB. Increase to
// something like 100MB in production.
const MAX_EXTERN_ATTACHMENT_SIZE = 1 << 23;

// Maximum allowed linear dimension of an inline image in pixels. You may want
// to adjust it to 1600 or 2400 for production.
const MAX_IMAGE_DIM = 768;

// Supported image MIME types and corresponding file extensions.
const SUPPORTED_IMAGE_FORMATS = ['image/jpeg', 'image/gif', 'image/png', 'image/svg', 'image/svg+xml'];
const MIME_EXTENSIONS         = ['jpg',        'gif',       'png',       'svg',       'svg'];

// Helper functions for storing values in localStorage.
// By default localStorage can store only strings, not objects or other types.

// Replace old object with the new one.
Storage.prototype.setObject = function(key, value) {
  this.setItem(key, JSON.stringify(value));
}
// Get stored object.
Storage.prototype.getObject = function(key) {
  let value = this.getItem(key);
  return value && JSON.parse(value);
}
// Partially or wholly update stored object.
Storage.prototype.updateObject = function(key, value) {
  let oldVal = this.getObject(key);
  this.setObject(key, Object.assign(oldVal || {}, value));
}

// Short representation of time in the past.
function shortDateFormat(then) {
  var locale = window.navigator.userLanguage || window.navigator.language;
  var now = new Date();
  if (then.getFullYear() == now.getFullYear()) {
    if (then.getMonth() == now.getMonth() && then.getDate() == now.getDate()) {
	    return then.toLocaleTimeString(locale, {hour12: false, hour: '2-digit', minute: '2-digit'});
    } else {
	    return then.toLocaleDateString(locale,
        {hour12: false, month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'});
    }
  }
  return then.toLocaleDateString(locale,
    {hour12: false, year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'});
}

// Convert a number of bytes to human-readable format.
function bytesToHumanSize(bytes) {
  if (!bytes || bytes == 0) {
    return '0 Bytes';
  }

  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  var bucket = Math.min(Math.floor(Math.log2(bytes) / 10) | 0, sizes.length-1);
  var count = bytes / Math.pow(1024, bucket);
  var round = bucket > 0 ? (count < 3 ? 2 : (count < 30 ? 1 : 0)) : 0;
  return count.toFixed(round) + ' ' + sizes[bucket];
}

// Make a data URL from public.photo
function makeImageUrl(photo) {
  return (photo && photo.type && photo.data) ?
    'data:image/' + photo.type + ';base64,' + photo.data : null;
}

// Calculate linear dimensions for scaling image down to fit under a certain size.
// Returns an object which contains destination sizes, source sizes, and offsets
// into source (when making square images).
function fitImageSize(width, height, maxWidth, maxHeight, forceSquare) {
  if (!width || !height || !maxWidth || !maxHeight) {
    return null;
  }

  if (forceSquare) {
    maxWidth = maxHeight = Math.min(maxWidth, maxHeight);
  }

  let scale = Math.min(
    Math.min(width, maxWidth) / width,
    Math.min(height, maxHeight) / height
  );

  let size = {
    dstWidth: (width * scale) | 0,
    dstHeight: (height * scale) | 0,
  };

  if (forceSquare) {
    // Also calculate parameters for making the image square.
    size.dstWidth = size.dstHeight = Math.min(size.dstWidth, size.dstHeight);
    size.srcWidth = size.srcHeight = Math.min(width, height);
    size.xoffset = ((width - size.srcWidth) / 2) | 0;
    size.yoffset = ((height - size.srcWidth) / 2) | 0;
  } else {
    size.xoffset = size.yoffset = 0;
    size.srcWidth = width;
    size.srcHeight = height;
  }
  return size;
}

// Ensure file's extension matches mime content type
function fileNameForMime(fname, mime) {
  var idx = SUPPORTED_IMAGE_FORMATS.indexOf(mime);
  var ext = MIME_EXTENSIONS[idx];

  var at = fname.lastIndexOf('.');
  if (at >= 0) {
    fname = fname.substring(0, at);
  }
  return fname + '.' + ext;
}

// Get mime type from data URL header.
function getMimeType(header) {
  var mime = /^data:(image\/[-+a-z0-9.]+);base64/.exec(header);
  return (mime && mime.length > 1) ? mime[1] : null;
}

// Given length of a binary object in bytes, calculate the length after
// base64 encoding.
function base64EncodedLen(n) {
  return Math.floor((n + 2) / 3) * 4;
}

// Given length of a base64-encoded object, calculate decoded size of the
// pbject in bytes.
function base64DecodedLen(n) {
  return Math.floor(n / 4) * 3;
}

// Re-encode string to standard base64 encoding with padding.
// The string may be base64-URL encoded without the padding.
function base64ReEncode(str) {
  if (str) {
    str = str.replace('-', '+').replace('_', '/');
    try {
      str = btoa(atob(str));
    } catch(err) {
      console.log("Failed to base64 re-decode string");
      str = null;
    }
  }
  return str;
}

// Convert uploaded image into a base64-encoded string possibly scaling
// linear dimensions or constraining to a square.
function imageFileScaledToBase64(file, width, height, forceSquare, onSuccess, onError) {
  var img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onerror = function(err) {
    onError("Image format unrecognized");
  }
  img.onload = function() {
    var dim = fitImageSize(this.width, this.height, width, height, forceSquare);
    if (!dim) {
      onError("Invalid image");
      return;
    }
    var canvas = document.createElement('canvas');
    canvas.width = dim.dstWidth;
    canvas.height = dim.dstHeight;
    var ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(this, dim.xoffset, dim.yoffset, dim.srcWidth, dim.srcHeight,
      0, 0, dim.dstWidth, dim.dstHeight);

    var mime = (this.width != dim.dstWidth ||
      this.height != dim.dstHeight ||
      SUPPORTED_IMAGE_FORMATS.indexOf(file.type) < 0) ? 'image/jpeg' : file.type;
    var imageBits = canvas.toDataURL(mime);
    var parts = imageBits.split(',');
    // Get actual image type: 'data:image/png;base64,'
    mime = getMimeType(parts[0]);
    if (!mime) {
      onError("Unsupported image format");
      return;
    }
    // Ensure the image is not too large
    var quality = 0.78;
    if (base64DecodedLen(imageBits.length) > MAX_INBAND_ATTACHMENT_SIZE) {
      mime = 'image/jpeg';
    }
    if (mime == 'image/jpeg') {
      // Reduce size of the jpeg by reducing image quality
      while (base64DecodedLen(imageBits.length) > MAX_INBAND_ATTACHMENT_SIZE && quality > 0.45) {
        imageBits = canvas.toDataURL(mime, quality);
        quality *= 0.84;
      }
    }
    if (base64DecodedLen(imageBits.length) > MAX_INBAND_ATTACHMENT_SIZE) {
      onError("The image size " + bytesToHumanSize(base64DecodedLen(imageBits.length)) +
        " exceeds the "  + bytesToHumanSize(MAX_INBAND_ATTACHMENT_SIZE) + " limit.", "err");
      return;
    }
    canvas = null;
    onSuccess(imageBits.split(',')[1], mime, dim.dstWidth, dim.dstHeight, fileNameForMime(file.name, mime));
  };
  img.src = URL.createObjectURL(file);
}

// Convert uploaded image file to base64-encoded string without scaling/converting the image
function imageFileToBase64(file, onSuccess, onError) {
  var reader = new FileReader();
  reader.addEventListener('load', function() {
    var parts = reader.result.split(',');
    var mime = getMimeType(parts[0]);
    if (!mime) {
      onError("Failed to process image file");
      return;
    }

    // Get image size.
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function() {
      onSuccess(parts[1], mime, this.width, this.height, fileNameForMime(file.name, mime));
    }
    img.onerror = function(err) {
      onError("Image format not recognized");
    }
    img.src = URL.createObjectURL(file);
  }, false);
  reader.readAsDataURL(file);
}

function fileToBase64(file, onSuccess, onError) {
  var reader = new FileReader();
  reader.addEventListener('load', function() {
    onSuccess(file.type, reader.result.split(',')[1], file.name);
  });
  reader.readAsDataURL(file);
}

// File pasted from the clipboard. It's either an inline image or a file attachment.
// FIXME: handle large files out of band.
function filePasted(event, onImageSuccess, onAttachmentSuccess, onError) {
  var items = (event.clipboardData || event.originalEvent.clipboardData || {}).items;
  for (var i in items) {
    var item = items[i];
    if (item.kind === 'file') {
      var file = item.getAsFile();
      if (!file) {
        console.log("Failed to get file object from pasted file item", item.kind, item.type);
        continue;
      }
      if (file.type && file.type.split('/')[0] == 'image') {
        // Handle inline image
        if (file.size > MAX_INBAND_ATTACHMENT_SIZE || SUPPORTED_IMAGE_FORMATS.indexOf(file.type) < 0) {
          imageFileScaledToBase64(file, MAX_IMAGE_DIM, MAX_IMAGE_DIM, false, onImageSuccess, onError);
        } else {
          imageFileToBase64(file, onImageSuccess, onError);
        }
      } else {
        // Handle file attachment
        fileToBase64(file, onAttachmentSuccess, onError)
      }
      // Indicate that the pasted data contains a file.
      return true;
    }
  }
  // No file found.
  return false;
}

// Make shortcut icon appear with a green dot + show unread count in title.
function updateFavicon(count) {
  var oldIcon = document.getElementById('shortcut-icon');
  if (oldIcon) {
    var head = document.head || document.getElementsByTagName('head')[0];
    var newIcon = document.createElement('link');
    newIcon.type = 'image/png';
    newIcon.id = 'shortcut-icon';
    newIcon.rel = 'shortcut icon';
    newIcon.href = 'img/logo32x32' + (count > 0 ? 'a' : '') + '.png';
    head.removeChild(oldIcon);
    head.appendChild(newIcon);
  }
  document.title = (count > 0 ? '('+count+') ' : '') + 'Tinode';
}

// Get 32 bit integer hash value for a string. Ideally it should produce the same value
// as Java's String#hash().
function stringHash(value) {
  var hash = 0;
  value = '' + value;
  for (var i = 0; i < value.length; i++) {
    hash = ((hash << 5) - hash) + value.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

// Helper functions for hash navigation.

// Parse hash as in http://www.example.com/path#hash as if it were
// path and arguments.
function parseUrlHash(hash) {
  // Split path from args, path -> parts[0], args->path[1]
  let parts = hash.split('?', 2);
  let params = {};
  let path = [];
  if (parts[0]) {
    path = parts[0].substr(1).split('/');
  }
  if (parts[1]) {
    parts[1].split('&').forEach(function(part) {
      let item = part.split('=');
      if (item[0]) {
        params[decodeURIComponent(item[0])] = decodeURIComponent(item[1]);
      }
    });
  }
  return {path: path, params: params};
}

function navigateTo(url) {
  window.location.hash = url;
}

function composeUrlHash(path, params) {
  var url = path.join('/');
  var args = [];
  for (var key in params) {
    if (params.hasOwnProperty(key)) {
      args.push(key + '=' + params[key]);
    }
  }
  if (args.length > 0) {
    url += '?' + args.join('&');
  }
  return url;
}

function addUrlParam(hash, key, value) {
  var parsed = parseUrlHash(hash);
  parsed.params[key] = value;
  return composeUrlHash(parsed.path, parsed.params);
}

function removeUrlParam(hash, key) {
  var parsed = parseUrlHash(hash);
  delete parsed.params[key];
  return composeUrlHash(parsed.path, parsed.params);
}
function setUrlSidePanel(hash, sidepanel) {
  var parsed = parseUrlHash(hash);
  parsed.path[0] = sidepanel;
  return composeUrlHash(parsed.path, parsed.params);
}
function setUrlTopic(hash, topic) {
  var parsed = parseUrlHash(hash);
  parsed.path[1] = topic;
  // Close InfoView on topic change.
  delete parsed.params.info;
  return composeUrlHash(parsed.path, parsed.params);
}
// END of hash navigation helper functions


// Detect server address from the URL
function detectServerAddress() {
  let host = DEFAULT_HOST;
  if (typeof window.location == 'object') {
    if (window.location.protocol == 'file:' || window.location.hostname == 'localhost') {
      host = KNOWN_HOSTS.local;
    } else if (window.location.hostname) {
      host = window.location.hostname + (window.location.port ? ':' + window.location.port : '');
    }
  }
  return host;
}

// Detect if the page is served over HTTPS.
function isSecureConnection() {
  if (typeof window.location == 'object') {
    return window.location.protocol == 'https:';
  }
  return false;
}

function isLocalHost() {
  if (typeof window.location == 'object') {
    return window.location.hostname == 'localhost';
  }
  return false;
}

// Create VCard which represents topic 'public' info
function vcard(fn, imageDataUrl) {
  var card = null;

  if ((fn && fn.trim()) || imageDataUrl) {
    card = {};
    if (fn) {
      card.fn = fn.trim();
    }
    if (imageDataUrl) {
      var dataStart = imageDataUrl.indexOf(',');
      card.photo = {
        data: imageDataUrl.substring(dataStart+1),
        type: 'jpg'
      };
    }
  }
  return card;
}

// Deep-shallow compare two arrays: shallow compare each element.
function arrayEqual(a, b) {
  // Compare lengths first.
  if (a.length != b.length) {
    return false;
  }
  // Order of elements is ignored.
  a.sort();
  b.sort();
  for (var i = 0, l = a.length; i < l; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

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

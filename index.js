// Name of this application, used in the User-Agent
const APP_NAME = "TinodeWeb/0.15";

const KNOWN_HOSTS = {hosted: "api.tinode.co", local: "localhost:6060"};
// Default host name and port to connect to.
const DEFAULT_HOST = KNOWN_HOSTS.hosted;
// var DEFAULT_HOST = KNOWN_HOSTS.local;

// Sound to play on message received.
const POP_SOUND = new Audio('audio/msg.mp3');

// Unicode symbol used to clear objects
const DEL_CHAR = "\u2421";

// API key. Use https://github.com/tinode/chat/tree/master/keygen to generate your own
const API_KEY = "AQEAAAABAAD_rAp4DJh05a1HAwFT3A6K";

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

// Tinode is defined in 'tinode.js'.
var Drafty = Tinode.Drafty;

// Helper functions for storing values in localStorage.
// By default localStorage can store only strings, not objects or other types.
Storage.prototype.setObject = function(key, value) {
  this.setItem(key, JSON.stringify(value));
}
Storage.prototype.getObject = function(key) {
  var value = this.getItem(key);
  return value && JSON.parse(value);
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
    var canvas = document.createElement("canvas");
    canvas.width = dim.dstWidth;
    canvas.height = dim.dstHeight;
    var ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(this, dim.xoffset, dim.yoffset, dim.srcWidth, dim.srcHeight,
      0, 0, dim.dstWidth, dim.dstHeight);

    var mime = (this.width != dim.dstWidth ||
      this.height != dim.dstHeight ||
      SUPPORTED_IMAGE_FORMATS.indexOf(file.type) < 0) ? "image/jpeg" : file.type;
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
      mime = "image/jpeg";
    }
    if (mime == "image/jpeg") {
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
  reader.addEventListener("load", function() {
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
  reader.addEventListener("load", function() {
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
    if (item.kind === "file") {
      var file = item.getAsFile();
      if (!file) {
        console.log("Failed to get file object from pasted file item", item.kind, item.type);
        continue;
      }
      if (file.type && file.type.split("/")[0] == "image") {
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
  var oldIcon = document.getElementById("shortcut-icon");
  if (oldIcon) {
    var head = document.head || document.getElementsByTagName('head')[0];
    var newIcon = document.createElement('link');
    newIcon.type = "image/png";
    newIcon.id = "shortcut-icon";
    newIcon.rel = "shortcut icon";
    newIcon.href = "img/logo32x32" + (count > 0 ? 'a' : '') + ".png";
    head.removeChild(oldIcon);
    head.appendChild(newIcon);
  }
  document.title = (count > 0 ? '('+count+') ' : '') + "Tinode";
}

// Get 32 bit integer hash value for a string. Ideally it should produce the same value
// as Java's String#hash().
function stringHash(value) {
  var hash = 0;
  value = "" + value;
  for (var i = 0; i < value.length; i++) {
    hash = ((hash<<5)-hash) + value.charCodeAt(i);
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
    path = parts[0].substr(1).split("/");
  }
  if (parts[1]) {
    parts[1].split("&").forEach(function(part) {
      let item = part.split("=");
      if (item[0]) {
        params[decodeURIComponent(item[0])] = decodeURIComponent(item[1]);
      }
    });
  }
  return {path: path, params: params};
}

function composeUrlHash(path, params) {
  var url = path.join("/");
  var args = [];
  for (var key in params) {
    if (params.hasOwnProperty(key)) {
      args.push(key + "=" + params[key]);
    }
  }
  if (args.length > 0) {
    url += "?" + args.join("&");
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
  var host = DEFAULT_HOST;
  if (window.location.protocol === 'file:' || window.location.hostname === 'localhost') {
    host = KNOWN_HOSTS.local;
  } else if (window.location.hostname) {
    host = window.location.hostname + (window.location.port ? ':' + window.location.port : '');
  }
  return host;
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
      var dataStart = imageDataUrl.indexOf(",");
      card.photo = {
        data: imageDataUrl.substring(dataStart+1),
        type: "jpg"
      };
    }
  }
  return card;
}

// Deep-shallow compare two arrays.
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

/* BEGIN Context Menu: popup/dropdown menu */

// Function is used by context menu to set permissions.
function topicPermissionSetter(mode, params, errorHandler) {
  var topic = Tinode.getTopic(params.topicName);
  if (!topic) {
    console.log("Topic not found", params.topicName);
    return;
  }

  var am, user;
  if (params.user) {
    user = topic.subscriber(params.user);
    if (!user) {
      console.log("Subscriber not found", params.topicName + "[" + params.user + "]");
      return;
    }
    am = user.acs.updateGiven(mode).getGiven();
  } else {
    am = topic.getAccessMode().updateWant(mode).getWant();
  }

  var instance = this;
  topic.setMeta({sub: {user: params.user, mode: am}}).catch(function(err) {
    if (errorHandler) {
      errorHandler(err.message, "err");
    }
  });
}

function deleteMessages(all, hard, params, errorHandler) {
  var topic = Tinode.getTopic(params.topicName);
  if (!topic) {
    console.log("Topic not found: ", params.topicName);
    return;
  }
  // We don't know if the message is still pending (e.g. attachment is being uploaded),
  // so try cancelling first. No harm if we can't cancel.
  if (topic.cancelSend(params.seq)) {
    return new Promise.resolve();
  }
  // Can't cancel. Delete instead.
  var promise = all ?
    topic.delMessagesAll(hard) :
    topic.delMessagesList([params.seq], hard);
  promise.catch(function(err) {
    if (errorHandler) {
      errorHandler(err.message, "err");
    }
  });
}

// Context menu items.
var ContextMenuItems = {
    "topic_info":     {title: "Info", handler: null},

    "messages_clear": {title: "Clear messages", handler: function(params, errorHandler) {
      deleteMessages(true, false, params, errorHandler);
    }},
    "messages_clear_hard": {title: "Clear for All", handler: function(params, errorHandler) {
      deleteMessages(true, true, params, errorHandler);
    }},
    "message_delete": {title: "Delete", handler: function(params, errorHandler) {
      deleteMessages(false, false, params, errorHandler);
    }},
    "message_delete_hard": {title: "Delete for All", handler: function(params, errorHandler) {
      deleteMessages(false, true, params, errorHandler);
    }},
    "topic_unmute":   {title: "Unmute", handler: topicPermissionSetter.bind(this, "+P")},
    "topic_mute":     {title: "Mute", handler: topicPermissionSetter.bind(this, "-P")},
    "topic_unblock":  {title: "Unblock", handler: topicPermissionSetter.bind(this, "+J")},
    "topic_block":    {title: "Block", handler: topicPermissionSetter.bind(this, "-J")},
    "topic_delete":   {title: "Delete", handler: function(params, errorHandler) {
      var topic = Tinode.getTopic(params.topicName);
      if (!topic) {
        console.log("Topic not found: ", params.topicName);
        return;
      }
      topic.delTopic().catch(function(err) {
        if (errorHandler) {
          errorHandler(err.message, "err");
        }
      });
    }},

    "permissions":    {title: "Edit permissions", handler: null},
    "member_delete":  {title: "Remove", handler: function(params, errorHandler) {
      var topic = Tinode.getTopic(params.topicName);
      if (!topic || !params.user) {
        console.log("Topic or user not found: '" + params.topicName + "', '" + params.user + "'");
        return;
      }
      topic.delSubscription(params.user).catch(function(err) {
        if (errorHandler) {
          errorHandler(err.message, "err");
        }
      });
    }},
    "member_mute":    {title: "Mute", handler: topicPermissionSetter.bind(this, "-P")},
    "member_unmute":  {title: "Unmute", handler: topicPermissionSetter.bind(this, "+P")},
    "member_block":   {title: "Block", handler: topicPermissionSetter.bind(this, "-J")},
    "member_unblock": {title: "Unblock", handler: topicPermissionSetter.bind(this, "+J")},
};

class ContextMenu extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.handleEscapeKey = this.handleEscapeKey.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillUnmount() {
    this.toggle(false);
  }

  componentWillReceiveProps(nextProps) {
    this.toggle(nextProps.visible);
  }

  toggle(visible) {
    if (visible) {
      document.addEventListener('mousedown', this.handlePageClick, false);
      document.addEventListener('keyup', this.handleEscapeKey, false);
    } else {
      document.removeEventListener('mousedown', this.handlePageClick, false);
      document.removeEventListener('keyup', this.handleEscapeKey, false);
    }
  }

  handlePageClick(e) {
    if (ReactDOM.findDOMNode(this).contains(e.target)) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    this.props.hide();
  }

  handleEscapeKey(e) {
    if (e.keyCode === 27) {
      this.props.hide();
    }
  }

  handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.hide();
    var item = this.props.items[e.currentTarget.dataset.id];
    item.handler(this.props.params, this.props.onError);
  }

  render() {
    if (!this.props.visible) {
      return null;
    }

    var count = 0;
    var instance = this;
    var menu = [];
    this.props.items.map(function(item) {
      if (item && item.title) {
        menu.push(
          item.title === "-" ?
            <li className="separator" key={count} />
            :
            <li onClick={instance.handleClick} data-id={count} key={count}>{item.title}</li>
        );
      }
      count++;
    });

    // Ensure that menu is inside the app-container.
    var hSize = 12 * REM_SIZE;
    var vSize = REM_SIZE * (0.7 + menu.length * 2.5);
    var left = (this.props.bounds.right - this.props.clickAt.x < hSize) ?
        (this.props.clickAt.x - this.props.bounds.left - hSize) :
        (this.props.clickAt.x - this.props.bounds.left);
    var top = (this.props.bounds.bottom - this.props.clickAt.y < vSize) ?
        (this.props.clickAt.y - this.props.bounds.top - vSize) :
        (this.props.clickAt.y - this.props.bounds.top);

    var position = {
      left: left + "px",
      top: top + "px"
    };

    return (
      <ul className="menu" style={position}>
        {menu}
      </ul>
    );
  }
}
/* END Popup/dropdown menu */

/* The X menu to be displayed in title bars */
class MenuCancel extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <a href="javascript:;" onClick={this.props.onCancel}><i className="material-icons">close</i></a>
    );
  }
}

class LoadSpinner extends React.PureComponent {
  render() {
    return (this.props.show ?
      <div className="load-spinner-box"><div className="loader-spinner"></div></div> : null);
  }
}

// Toggle [Title text >] -> [Title text v]
class MoreButton extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      open: props.open
    };
    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle() {
    var open = !this.state.open;
    this.setState({open: open});
    if (this.props.onToggle) {
      this.props.onToggle(open);
    }
  }

  render() {
    return (<label className="small" onClick={this.handleToggle}>{this.props.title}...
      {this.state.open ? <i className="material-icons">expand_more</i> :
        <i className="material-icons">chevron_right</i>}
      </label>);
  }
}

/* BEGIN Lettertile: Avatar box: either a bitmap or a letter tile or a stock icon. */
class LetterTile extends React.PureComponent {
  render() {
    var avatar;
    if (this.props.avatar === true) {
      if (this.props.topic && this.props.title && this.props.title.trim()) {
        var letter = this.props.title.trim().charAt(0);
        var color = "lettertile dark-color" + (Math.abs(stringHash(this.props.topic)) % 16);
        avatar = (<div className={color}><div>{letter}</div></div>)
      } else {
        avatar = (Tinode.topicType(this.props.topic) === "grp") ?
          <i className="material-icons">group</i> :
          <i className="material-icons">person</i>;
      }
    } else if (this.props.avatar) {
      avatar = <img className="avatar" alt="avatar" src={this.props.avatar} />;
    } else {
      avatar = null;
    }
    return avatar;
  }
}
/* END Lettertile */

/* BEGIN In-place text editor. Shows text with an icon
 * which toggles it into an input field */
class InPlaceEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: props.state,
      text: props.text || ""
    };

    this.handeTextChange = this.handeTextChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleStartEditing = this.handleStartEditing.bind(this);
    this.handleEditingFinished = this.handleEditingFinished.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // If text has changed while in read mode, update text and discard changes.
    // Ignore update if in edit mode.
    if (this.props.text != nextProps.text && !this.state.active) {
      this.setState({text: nextProps.text || ""});
    }
  }

  handeTextChange(e) {
    this.setState({text: e.target.value});
  }

  handleKeyDown(e) {
    if (e.keyCode === 27) {
      // Escape pressed
      this.setState({text: this.props.text, active: false});
    } else if (e.keyCode === 13) {
      // Enter pressed
      this.handleEditingFinished();
    }
  }

  handleStartEditing() {
    if (!this.props.readOnly) {
      ReactDOM.findDOMNode(this).focus();
      this.setState({active: true});
    }
  }

  handleEditingFinished() {
    this.setState({active: false});
    var text = this.state.text.trim();
    if ((text || this.props.text) && (text !== this.props.text)) {
      this.props.onFinished(text);
    }
  }

  render() {
    var spanText = this.props.type === "password" ?
      "••••••••" : this.state.text;
    var spanClass = "in-place-edit" +
      (this.props.readOnly ? " disabled" : "");
    if (!spanText) {
      spanText = this.props.placeholder;
      spanClass += " placeholder";
    }
    if (spanText.length > 20) {
      spanText = spanText.substring(0, 19) + "...";
    }
    return (
      this.state.active ?
        <input type={this.props.type || "text"}
          value={this.state.text}
          placeholder={this.props.placeholder}
          onChange={this.handeTextChange}
          onKeyDown={this.handleKeyDown}
          onBlur={this.handleEditingFinished}
          autoFocus />
        :
        <span className={spanClass} onClick={this.handleStartEditing}>
          <span className="content">{spanText}</span>
        </span>
    );
  }
};
/* END InPlaceEdit */

/* BEGIN Combobox for selecting host name */
class HostSelector extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      hostName: props.serverAddress,
      changed: false
    };

    this.handleHostNameChange = this.handleHostNameChange.bind(this);
    this.handleEditingFinished = this.handleEditingFinished.bind(this);
  }

  handleHostNameChange(e) {
    this.setState({hostName: e.target.value, changed: true});
  }

  handleEditingFinished() {
    if (this.state.changed) {
      this.setState({changed: false});
      this.props.onServerAddressChange(this.state.hostName.trim());
    }
  }

  render() {
    var hostOptions = [];
    for (var key in KNOWN_HOSTS) {
      var item = KNOWN_HOSTS[key];
      hostOptions.push(
        <option key={item} value={item} />
      );
    }
    return (
      <div>
        <label htmlFor="host-name">Server address:</label>
        <input type="search" id="host-name" placeholder={this.props.hostName} list="known-hosts"
          value={this.state.hostName} onChange={this.handleHostNameChange}
          onBlur={this.handleEditingFinished} required />
        <datalist id="known-hosts">
          {hostOptions}
        </datalist>
      </div>);
  }
}
/* END Combobox for selecting host name */

/* BEGIN CheckBox: styled checkbox */
class CheckBox extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.props.onChange(this.props.name, !this.props.checked);
  }

  render() {
    return (
      this.props.onChange ? (
        this.props.checked ?
          <i className="material-icons blue clickable" onClick={this.handleChange}>check_box</i> :
          <i className="material-icons blue clickable" onClick={this.handleChange}>check_box_outline_blank</i>
        ) : (
          this.props.checked ?
            <i className="material-icons">check_box</i> :
            <i className="material-icons">check_box_outline_blank</i>
        )
    );
  }
}
/* END CheckBox */

/* BEGIN PermissionsEditor: Component for editing permissions */
// <PermissionsEditor mode="JWROD" skip="O" onChange={this.handleCheckboxTest} />
class PermissionsEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mode: (props.mode || "").replace("N", "")
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleChange(val) {
    var mode = this.state.mode;
    var idx = mode.indexOf(val);
    if (idx == -1) {
      mode += val;
    } else {
      mode = mode.replace(val, "");
    }
    this.setState({mode: mode});
  }

  handleSubmit() {
    // Normalize string, otherwise cannot check if mode has changed.
    var mode = (this.state.mode || "N").split('').sort().join('');
    var before = (this.props.mode || "N").split('').sort().join('')
    if (mode !== before) {
      this.props.onSubmit(mode);
    } else {
      this.props.onCancel();
    }
  }

  handleCancel() {
    this.props.onCancel();
  }

  render() {
    var all = 'JRWPASDO';
    var names = {
      'J': 'Join (J)',
      'R': 'Read (R)',
      'W': 'Write (W)',
      'P': 'Get notified (P)',
      'A': 'Approve (A)',
      'S': 'Share (S)',
      'D': 'Delete (D)',
      'O': 'Owner (O)'
    };

    var skip = this.props.skip || "";
    var mode = this.state.mode;
    var compare = (this.props.compare || "").replace("N", "");
    var items = [];
    for (var i=0; i<all.length; i++) {
      var c = all.charAt(i);
      if (skip.indexOf(c) >= 0 && mode.indexOf(c) < 0) {
        // Permission is marked as inactive: hide unchecked permissions, disable checked permissions
        continue;
      }
      items.push(
        <tr key={c}>
          <td>{names[c]}</td>
          <td className="checkbox">{skip.indexOf(c) < 0 ?
            <CheckBox name={c} checked={(mode.indexOf(c) >= 0)} onChange={this.handleChange}/>
            :
            <CheckBox name={c} checked={(mode.indexOf(c) >= 0)} />
          }</td>{this.props.compare ? <td className="checkbox">
            <CheckBox name={c} checked={(compare.indexOf(c) >= 0)}/>
          </td> : null}
        </tr>
      );
    }

    return (
      <div className="panel-form-column">
        {this.props.userTitle ?
          <ul className="contact-box"><Contact
            item={this.props.item}
            title={this.props.userTitle}
            avatar={makeImageUrl(this.props.userAvatar ? this.props.userAvatar : null)} /></ul> : null}
        <label className="small">Permissions</label>
        <table className="permission-editor">
        {this.props.compare ?
          <thead><tr>
            <th></th><th>{this.props.modeTitle}</th>
            <th>{this.props.compareTitle}</th>
          </tr></thead> :
          null}
        <tbody>
          {items}
        </tbody></table>
        <br />
        <div className="dialog-buttons">
          <button className="blue" onClick={this.handleSubmit}>Ok</button>
          <button className="white" onClick={this.handleCancel}>Cancel</button>
        </div>
      </div>
    );
  }
};
/* END PermissionsEditor */

/* BEGIN ChipInput: group membership widget */
class ChipInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      placeholder: props.chips ? "" : props.prompt,
      sortedChips: ChipInput.sortChips(props.chips, props.required),
      chipIndex: ChipInput.indexChips(props.chips),
      input: '',
      focused: false
    };

    this.handleTextInput = this.handleTextInput.bind(this);
    this.removeChipAt = this.removeChipAt.bind(this);
    this.handleChipCancel = this.handleChipCancel.bind(this);
    this.handleFocusGained = this.handleFocusGained.bind(this);
    this.handleFocusLost = this.handleFocusLost.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      sortedChips: ChipInput.sortChips(nextProps.chips, nextProps.required),
      chipIndex: ChipInput.indexChips(nextProps.chips)
    });
    if (nextProps.chips.length > this.props.chips.length) {
      // Chip added: clear input.
      this.setState({input: ''});
    }
  }

  // Map chip index to user name
  static indexChips(chips) {
    var index = {};
    var count = 0;
    chips.map(function(item) {
      index[item.user] = count;
      count ++;
    });
    return index;
  }

  // Have non-removable chips appear before all other chips.
  static sortChips(chips, keep) {
    var required = [];
    var normal = [];
    chips.map(function(item) {
      if (item.user === keep) {
        required.push(item);
      } else {
        normal.push(item);
      }
    });
    return required.concat(normal);
  }

  handleTextInput(e) {
    this.setState({input: e.target.value});
    if (this.props.filterFunc) {
      this.props.filterFunc(e.target.value);
    }
  }

  removeChipAt(idx) {
    var removed = this.state.sortedChips[idx];
    this.props.onChipRemoved(removed.user, this.state.chipIndex[removed.user]);
  }

  handleChipCancel(item, idx) {
    this.removeChipAt(idx);
  }

  handleFocusGained() {
    this.setState({focused: true});
  }

  handleFocusLost() {
    this.setState({focused: false});
    if (this.props.onFocusLost) {
      this.props.onFocusLost(this.state.input);
    }
  }

  handleKeyDown(e) {
    if (e.key === 'Backspace') {
      if (this.state.input.length == 0 && this.state.sortedChips.length > 0) {
        var at = this.state.sortedChips.length - 1;
        if (this.state.sortedChips[at].user !== this.props.required) {
          this.removeChipAt(at);
        }
      }
    } else if (e.key === 'Enter') {
      if (this.props.onEnter) {
        this.props.onEnter(this.state.input);
      }
    } else if (e.key === 'Escape') {
      if (this.props.onCancel) {
        this.props.onCancel();
      }
    }
  }

  render() {
    var chips = [];

    var instance = this;
    var count = 0;
    this.state.sortedChips.map(function(item) {
      chips.push(
        <Chip
          onCancel={instance.handleChipCancel}
          avatar={makeImageUrl(item.public ? item.public.photo : null)}
          title={item.public ? item.public.fn : undefined}
          noAvatar={instance.props.avatarDisabled}
          topic={item.user}
          required={item.user === instance.props.required}
          index={count}
          key={item.user} />
      );
      count++;
    });
    var className = "chip-input" + (this.state.focused ? " focused" : "");
    return (
      <div className={className}>
        {chips}
        <input type="text"
          placeholder={this.state.placeholder}
          onChange={this.handleTextInput}
          onFocus={this.handleFocusGained}
          onBlur={this.handleFocusLost}
          onKeyDown={this.handleKeyDown}
          value={this.state.input}
          autoFocus />
      </div>
    );
  }
};

class Chip extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleCancel = this.handleCancel.bind(this);
  }

  handleCancel() {
    this.props.onCancel(this.props.topic, this.props.index);
  }

  render() {
    var title = this.props.title || this.props.topic;
    return (
      <div className="chip">
        {this.props.noAvatar ?
          <span className="spacer" /> :
          <div className="avatar-box">
            <LetterTile
              avatar={this.props.avatar || true}
              topic={this.props.topic}
              title={this.props.title} />
          </div>
        }
        <span>{title}</span>
        {this.props.onCancel && !this.props.required ?
          <a href="javascript:;" onClick={this.handleCancel} >&times;</a>
          : <span className="spacer" />}
      </div>
    );
  }
};
/* END ChipInput */

/* BEGIN GroupSubs: a list of group subscribers currently online */
class GroupSubs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      onlineSubs: props.subscribers || []
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({onlineSubs: nextProps.subscribers ? nextProps.subscribers : []});
  }

  render() {
    var usersOnline = [];
    this.state.onlineSubs.map((sub) => {
      usersOnline.push(
        <div className="avatar-box">
          <LetterTile
            topic={sub.user}
            avatar={makeImageUrl(sub.public ? sub.public.photo : null) || true}
            title={sub.public ? sub.public.fn : null}
            key={sub.user} />
        </div>
      );
    });
    return (
      <div id="topic-users">{usersOnline}</div>
    );
  }
};
/* END GroupSubs */

/* BEGIN Login: a login form */
class LoginView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      login: props.login,
      password: '',
      hostName: props.serverAddress,
      saveToken: localStorage.getObject("keep-logged-in")
    };
    this.handleLoginChange = this.handleLoginChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleServerAddressChange = this.handleServerAddressChange.bind(this);
    this.handleToggleSaveToken = this.handleToggleSaveToken.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleLoginChange(e) {
    this.setState({login: e.target.value});
  }

  handlePasswordChange(e) {
    this.setState({password: e.target.value});
  }

  handleServerAddressChange(name) {
    this.setState({hostName: name});
    this.props.onServerAddressChange(name);
  }

  handleToggleSaveToken() {
    localStorage.setObject("keep-logged-in", !this.state.saveToken);
    this.setState({saveToken: !this.state.saveToken});
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.onLogin(this.state.login.trim(), this.state.password.trim());
  }

  render() {
    var submitClasses = "blue";
    if (this.props.disabled) {
      submitClasses += " disabled";
    }
    return (
      <form id="login-form" onSubmit={this.handleSubmit}>
        <input type="text" id="inputLogin"
          placeholder="Login (alice, bob, carol, dave, frank)"
          autoComplete="username"
          value={this.state.login}
          onChange={this.handleLoginChange}
          required autoFocus />
        <input type="password" id="inputPassword"
          placeholder="Password (alice123, bob123, ...)"
          autoComplete="current-password"
          value={this.state.password}
          onChange={this.handlePasswordChange}
          required />
        <div className="panel-form-row">
          <HostSelector serverAddress={this.props.serverAddress}
            onServerAddressChange={this.handleServerAddressChange} />
        </div>
        <div className="panel-form-row">
          <CheckBox id="save-token" name="save-token" checked={this.state.saveToken}
            onChange={this.handleToggleSaveToken} />
          <label forHtml="save-token">&nbsp;Keep me logged in</label>
        </div>
        <div className="dialog-buttons">
          <button className={submitClasses} type="submit">Sign in</button>
        </div>
      </form>
    );
  }
};
/* END Login */

/* BEGIN Account registration */
class CreateAccountView extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      login: '',
      password: '',
      password2: '',
      email: '',
      fn: '', // full/formatted name
      imageDataUrl: null,
      errorCleared: false,
      saveToken: localStorage.getObject("keep-logged-in")
    };

    this.handleLoginChange = this.handleLoginChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handlePassword2Change = this.handlePassword2Change.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleFnChange = this.handleFnChange.bind(this);
    this.handleImageChanged = this.handleImageChanged.bind(this);
    this.handleToggleSaveToken = this.handleToggleSaveToken.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleLoginChange(e) {
    this.setState({login: e.target.value});
  }

  handlePasswordChange(e) {
    this.setState({password: e.target.value});
  }

  handlePassword2Change(e) {
    this.setState({password2: e.target.value});
  }

  handleEmailChange(e) {
    this.setState({email: e.target.value})
  }

  handleFnChange(e) {
    this.setState({fn: e.target.value});
  }

  handleImageChanged(img) {
    this.setState({imageDataUrl: img});
  }

  handleToggleSaveToken() {
    localStorage.setObject("keep-logged-in", !this.state.saveToken);
    this.setState({saveToken: !this.state.saveToken});
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.password.trim() != this.state.password2.trim()) {
      this.props.onError("Passwords don't match", "warn");
    } else {
      // TODO: check email for validity
      this.setState({errorCleared: false});
      this.props.onCreateAccount(
        this.state.login.trim(),
        this.state.password.trim(),
        vcard(this.state.fn, this.state.imageDataUrl),
        {"meth": "email", "val": this.state.email});
    }
  }

  render() {
    var submitClasses = "blue";
    if (this.props.disabled) {
      submitClasses += " disabled";
    }
    return (
      <form className="panel-form-column" onSubmit={this.handleSubmit}>
        <div className="panel-form-row">
          <div className="panel-form-column">
            <input type="text" placeholder="Login" autoComplete="user-name"
              value={this.state.login} onChange={this.handleLoginChange} required autoFocus />
            <input type="password" placeholder="Password" autoComplete="new-password"
              value={this.state.password} onChange={this.handlePasswordChange} required />
            <input type="password" placeholder="Repeat password" autoComplete="new-password"
              value={this.state.password2} onChange={this.handlePassword2Change} required />
          </div>
          <AvatarUpload
            onImageChanged={this.handleImageChanged}
            onError={this.props.onError} />
        </div>
        <div className="panel-form-row">
          <input type="email" placeholder="Email, e.g john.doe@example.com"
            autoComplete="email" value={this.state.email} onChange={this.handleEmailChange} required/>
        </div>
        <div  className="panel-form-row">
          <input type="text" placeholder="Full name, e.g. John Doe" autoComplete="name"
            value={this.state.fn} onChange={this.handleFnChange} required/>
        </div>
        <div className="panel-form-row">
          <CheckBox id="save-token" name="save-token" checked={this.state.saveToken}
            onChange={this.handleToggleSaveToken} />
          <label forHtml="save-token">&nbsp;Keep me logged in</label>
        </div>
        <div className="dialog-buttons">
          <button className={submitClasses} type="submit">Sign up</button>
        </div>
      </form>
    );
  }
};

class AvatarUpload extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataUrl: props.avatar
    };

    this.handleFileUpload = this.handleFileUpload.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.avatar != nextProps.avatar) {
      this.setState({dataUrl: nextProps.avatar});
    }
  }

  handleFileUpload(e) {
    var instance = this;
    imageFileScaledToBase64(e.target.files[0], AVATAR_SIZE, AVATAR_SIZE, true,
      // Success
      function(base64bits, mime) {
        var du = makeImageUrl({data: base64bits, type: mime});
        instance.setState({dataUrl: du});
        instance.props.onImageChanged(du);
      },
      // Failure
      function(err) {
        this.props.onError(err, "err");
      });
    // Clear the value so the same file can be uploaded again.
    e.target.value = '';
  }

  render() {
    // Randomize id value in case more than one AvatarUpload is shown
    // at the same time.
    var randId = "file-input-avatar-" + (Math.random() + '').substr(2);
    return (
      <div className="avatar-upload">
        {this.state.dataUrl ?
          <img src={this.state.dataUrl} className="preview" /> :
          this.props.readOnly && this.props.uid ?
            <div className="avatar-box">
              <LetterTile avatar={true} topic={this.props.uid} title={this.props.title} />
            </div>
            :
            <div className="blank">128&times;128</div>}
        {this.props.readOnly ? null :
          <input type="file" id={randId} className="inputfile hidden"
            accept="image/*" onChange={this.handleFileUpload} />}
        {this.props.readOnly ? null :
        <label htmlFor={randId} className="round">
          <i className="material-icons">file_upload</i>
        </label>}
      </div>
    );
  }
};
/* END Account registration */

/* BEGIN Tinode config panel */
class SettingsView extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      transport: props.transport || "def",
      messageSounds: props.messageSounds
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleMessageSoundsToggle = this.handleMessageSoundsToggle.bind(this);
    this.handleTransportSelected = this.handleTransportSelected.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.onUpdate(null, this.state.transport, this.state.messageSounds);
  }

  handleMessageSoundsToggle(unused, checked) {
    this.setState({messageSounds: checked});
  }

  handleTransportSelected(e) {
    this.setState({transport: e.currentTarget.value});
  }

  render() {
    var names = {def: "default", ws: "websocket", lp: "long polling"};
    var transportOptions = [];
    var instance = this;
    ["def", "ws", "lp"].map(function(item){
      var id = "transport-" + item;
      var name = names[item];
      transportOptions.push(
        <li key={item}>
          <input type="radio" id={id} name="transport-select" value={item}
            checked={instance.state.transport === item}
            onChange={instance.handleTransportSelected} />
          <label htmlFor={id}>{name}</label>
        </li>
      );
    });
    return (
      <form id="settings-form" onSubmit={this.handleSubmit}>
        <div className="panel-form-row">
          <label forHtml="message-sound">Message sound:</label>
          <CheckBox id="message-sound"
            checked={this.state.messageSounds}
            onChange={this.handleMessageSoundsToggle} />
        </div>
        <div className="panel-form-row">
          <label className="small">Wire transport:</label>
        </div>
        <div className="panel-form-row">
          <ul className="quoted">
            {transportOptions}
          </ul>
        </div>
        <div className="dialog-buttons">
          <button type="submit" className="blue">Update</button>
        </div>
      </form>
    );
  }
};
/* END Tinode config panel */

/* BEGIN Manage side panel - handle Login, Account Registration, Contacts, NewTopic views */
class SideNavbar extends React.PureComponent {
  render() {
    return (
        <div id="side-caption-panel" className="caption-panel">
          <div id="self-avatar" className="avatar-box">
            <LetterTile avatar={this.props.avatar} topic={this.props.myUserId} title={this.props.title} />
          </div>
          <div id="sidepanel-title" className="panel-title">{this.props.title}</div>
          {this.props.state === 'login' ?
              <MenuStart onSignUp={this.props.onSignUp} onSettings={this.props.onSettings} /> :
            this.props.state === 'contacts' ?
              <MenuContacts onNewTopic={this.props.onNewTopic} onSettings={this.props.onSettings} /> :
            null}
          {this.props.onCancel ?
             <MenuCancel onCancel={this.props.onCancel} /> : null}
        </div>
    );
  }
};

class MenuStart extends React.PureComponent {
  render() {
    return (
        <div>
          <a href="javascript:;" onClick={this.props.onSignUp}><i className="material-icons">person_add</i></a>
          &nbsp;
          <a href="javascript:;" onClick={this.props.onSettings}><i className="material-icons">settings</i></a>
        </div>
    );
  }
};

class MenuContacts extends React.PureComponent {
  render() {
    return (
      <div>
        <a href="javascript:;" onClick={this.props.onNewTopic}><i className="material-icons">chat</i></a>
        &nbsp;
        <a href="javascript:;" onClick={this.props.onSettings}><i className="material-icons">settings</i></a>
      </div>
    );
  }
};

class SidepanelView extends React.Component {
  constructor(props) {
    super(props);

    this.handleLoginRequested = this.handleLoginRequested.bind(this);
  }

  handleLoginRequested(login, password) {
    this.props.onLoginRequest(login, password);
  }

  render() {
    var title = null;
    var avatar = false;
    var onCancel = undefined;
    var view = this.props.state || (this.props.myUserId ? 'contacts' : 'login');
    switch (view) {
      case 'login':
        title = "Sign In";
        break;
      case 'register':
        title = "Create Account";
        onCancel = this.props.onCancel;
        break;
      case 'settings':
        title = "Settings";
        onCancel = this.props.onCancel;
        break;
      case 'edit':
        title = "Edit Account";
        onCancel = this.props.onCancel;
        break;
      case 'contacts':
        title = this.props.title;
        avatar = this.props.avatar ? this.props.avatar : true;
        break;
      case 'newtpk':
        title = "Start New Chat";
        onCancel = this.props.onCancel;
        break;
      case 'cred':
        title = "Confirm Credentials";
        onCancel = this.props.onCancel;
        break;
      default:;
    };
    return (
      <div id="sidepanel" className={this.props.hideSelf ? 'nodisplay' : null}>
        <SideNavbar state={view}
          title={title} avatar={avatar}
          myUserId={this.props.myUserId}
          onSignUp={this.props.onSignUp}
          onSettings={this.props.onSettings}
          onNewTopic={this.props.onNewTopic}
          onCancel={onCancel} />

        <ErrorPanel
          level={this.props.errorLevel}
          text={this.props.errorText}
          onClearError={this.props.onError} />

        {view === 'login' ?
          <LoginView login={this.props.login}
            disabled={this.props.loginDisabled}
            serverAddress={this.props.serverAddress}
            onLogin={this.handleLoginRequested}
            onServerAddressChange={this.props.onGlobalSettings} /> :

          view === 'register' ?
          <CreateAccountView
            onCreateAccount={this.props.onCreateAccount}
            onCancel={this.props.onCancel}
            onError={this.props.onError} /> :

          view === 'settings' ?
          <SettingsView
            transport={this.props.transport}
            messageSounds={this.props.messageSounds}
            onCancel={this.props.onCancel}
            onUpdate={this.props.onGlobalSettings}
            /> :

          view === 'edit' ?
          <EditAccountView
            login={this.props.login}
            onSubmit={this.props.onUpdateAccount}
            onUpdateTags={this.props.onUpdateAccountTags}
            onLogout={this.props.onLogout}
            onCancel={this.props.onCancel}
            onError={this.props.onError} /> :

          view === 'contacts' ?
          <ContactsView
            connected={this.props.connected}
            topicSelected={this.props.topicSelected}
            showContextMenu={this.props.showContextMenu}
            messageSounds={this.props.messageSounds}
            onTopicSelected={this.props.onTopicSelected}
            onAcsChange={this.props.onAcsChange}
            onOnlineChange={this.props.onOnlineChange} /> :

          view === 'newtpk' ?
          <NewTopicView
            contactsSearchQuery={this.props.contactsSearchQuery}
            foundContacts={this.props.foundContacts}
            onInitFind={this.props.onInitFind}
            onSearchContacts={this.props.onSearchContacts}
            onCreateTopic={this.props.onCreateTopic}
            onError={this.props.onError} /> :

          view === 'cred' ?
          <ValidationView
            credCode={this.props.credCode}
            credMethod={this.props.credMethod}
            onSubmit={this.props.onValidateCredentials}
            onCancel={this.props.onCancel}
            onError={this.props.onError} /> :

          null}
      </div>
    );
  }
};

class ErrorPanel extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
    };

    this.hide = this.hide.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({show: !(!nextProps.level)});
  }

  hide() {
    this.setState({show: false});
    if (this.props.onClearError) {
      this.props.onClearError();
    }
  }

  render() {
    var icon = this.props.level == "err" ? "error": "warning";
    return (
      <div className={this.state.show ?
        (this.props.level == "err" ? "alert-box error" : "alert-box warning") :
        "alert-box"}>
        <div className="icon"><i className="material-icons">{icon}</i></div>
        {this.props.text}
        <div className="cancel"><MenuCancel onCancel={this.hide} /></div>
      </div>
    );
  }
};

/* END Side panel */

/* EditAccount parameters */
class EditAccountView extends React.Component {
  constructor(props) {
    super(props);

    let me = Tinode.getMeTopic();
    let defacs = me.getDefaultAccess();
    let fnd = Tinode.getFndTopic();
    this.state = {
      fullName: me.public ? me.public.fn : undefined,
      avatar: makeImageUrl(me.public ? me.public.photo : null),
      address: Tinode.getCurrentUserID(),
      auth: defacs.auth,
      anon: defacs.anon,
      tags: fnd.tags(),
      previousOnTags: fnd.onTagsUpdated
    };

    this.tnNewTags = this.tnNewTags.bind(this);
    this.handleFullNameUpdate = this.handleFullNameUpdate.bind(this);
    this.handlePasswordUpdate = this.handlePasswordUpdate.bind(this);
    this.handleImageChanged = this.handleImageChanged.bind(this);
    this.handleTagsUpdated = this.handleTagsUpdated.bind(this);
  }

  componentDidMount() {
    let fnd = Tinode.getFndTopic();
    fnd.onTagsUpdated = this.tnNewTags;
    if (!fnd.isSubscribed()) {
      fnd.subscribe(fnd.startMetaQuery().withLaterDesc().withTags().build()).catch((err) => {
        this.props.onError(err.message, "err");
      });
    }
  }

  componentWillUnmount() {
    var fnd = Tinode.getFndTopic();
    fnd.onTagsUpdated = this.state.previousOnTags;
  }

  tnNewTags(tags) {
    this.setState({tags: tags});
  }

  handleFullNameUpdate(fn) {
    this.setState({fullName: fn});
    this.props.onSubmit(null, vcard(fn, this.state.avatar));
  }

  handlePasswordUpdate(pwd) {
    this.setState({password: pwd});
    this.props.onSubmit(pwd, null);
  }

  handleImageChanged(img) {
    this.setState({avatar: img});
    this.props.onSubmit(null, vcard(this.state.fullName, img));
  }

  handleTagsUpdated(tags) {
    // Check if tags have actually changed.
    if (arrayEqual(this.state.tags.slice(0), tags.slice(0))) {
      return;
    }
    this.props.onUpdateTags(tags);
  }

  render() {
    var tags = [];
    this.state.tags.map(function(tag) {
      tags.push(<span className="badge" key={tags.length}>{tag}</span>);
    });
    if (tags.length == 0) {
      tags = <i>No tags defined. Add some.</i>;
    }
    return (
      <div id="edit-account" className="panel-form">
        <div className="panel-form-row">
          <div className="panel-form-column">
            <div><label className="small">Your name</label></div>
            <div><InPlaceEdit
                placeholder="Full name, e.g. John Doe"
                text={this.state.fullName}
                onFinished={this.handleFullNameUpdate} /></div>
            <div><label className="small">Password</label></div>
            <div><InPlaceEdit
                placeholder="Unchanged"
                type="password"
                onFinished={this.handlePasswordUpdate} /></div>
          </div>
          <AvatarUpload
            avatar={this.state.avatar}
            uid={this.state.address}
            title={this.state.fullName}
            onImageChanged={this.handleImageChanged}
            onError={this.props.onError} />
        </div>
        <div className="hr" />
        <div className="panel-form-column">
          <div className="panel-form-row">
            <label>Login:</label>
            <tt>{this.props.login}</tt>
          </div>
          <div className="panel-form-row">
            <label>Address:</label>
            <tt>{this.state.address}</tt>
          </div>
          <div>
            <label className="small">Default access mode:</label>
          </div>
          <div className="quoted">
            <div>Auth: <tt>{this.state.auth}</tt></div>
            <div>Anon: <tt>{this.state.anon}</tt></div>
          </div>
        </div>
        <div className="hr" />
        <TagManager
          title="Tags (user discovery)"
          activated={false}
          tags={this.state.tags}
          onSubmit={this.handleTagsUpdated} />
        <div className="hr" />
        <div className="panel-form-column">
          <a href="javascript:;" className="red flat-button" onClick={this.props.onLogout}>
            <i className="material-icons">exit_to_app</i> Logout
          </a>
        </div>
      </div>
    );
  }
};
/* END EditAccount */

/* BEGIN TagManager: edit topic or user tags */
class TagManager extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: this.props.tags,
      tagInput: '',
      activated: this.props.activated,
      noTagsMessage: 'Add some tags'
    };

    this.handleShowTagManager = this.handleShowTagManager.bind(this);
    this.handleTagInput = this.handleTagInput.bind(this);
    this.handleAddTag = this.handleAddTag.bind(this);
    this.handleRemoveTag = this.handleRemoveTag.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({tags: nextProps.tags});
  }

  handleShowTagManager() {
    this.setState({activated: true});
  }

  handleTagInput(text) {
    this.setState({tagInput: text});
    // Check if user entered ',', ' ' or ';'
    if (text.length > 0) {
      var last = text[text.length-1];
      if (last == ',' || last == ' ' || last == ';') {
        var tag = text.substr(0, text.length-1).trim();
        if (tag.length >= MIN_TAG_LENGTH) {
          this.handleAddTag(tag);
        }
      }
    }
  }

  handleAddTag(tag) {
    tag = tag.trim();
    if (tag.length > 0) {
      var tags = this.state.tags.slice(0);
      tags.push(tag);
      this.setState({tags: tags, tagInput: ''});

      if (this.props.onTagsChanged) {
        this.props.onTagsChanged(tags);
      }
    }
  }

  handleRemoveTag(tag, index) {
    var tags = this.state.tags.slice(0);
    tags.splice(index, 1);
    this.setState({tags: tags});
    if (this.props.onTagsChanged) {
      this.props.onTagsChanged(tags);
    }
  }

  handleSubmit() {
    var tags = this.state.tags.slice(0);
    var inp = this.state.tagInput.trim();
    if (inp.length > 0) {
      tags.push(inp);
      if (this.props.onTagsChanged) {
        this.props.onTagsChanged(tags);
      }
    }
    this.props.onSubmit(tags);
    this.setState({activated: false, tagInput: '', tags: this.props.tags});
  }

  handleCancel() {
    this.setState({activated: false, tagInput: '', tags: this.props.tags});
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  }

  render() {
    var tags = [];
    if (this.state.activated) {
      this.state.tags.map(function(tag) {
        tags.push({user: tag});
      });
    } else {
      this.state.tags.map(function(tag) {
        tags.push(<span className="badge" key={tags.length}>{tag}</span>);
      });
      if (tags.length == 0) {
        tags = <i>No tags defined. Add some.</i>;
      }
    }
    return (
      <div className="panel-form-column">
        <div className="panel-form-row">
          <label className="small">{this.props.title}</label>
        </div>
        {this.state.activated ?
          <div>
          <ChipInput
            chips={tags}
            avatarDisabled={true}
            prompt={this.state.noTagsMessage}
            onEnter={this.handleAddTag}
            onFocusLost={this.handleAddTag}
            onCancel={this.handleCancel}
            onChipRemoved={this.handleRemoveTag}
            filterFunc={this.handleTagInput} />
          {this.props.onSubmit || this.props.onCancel ?
            <div id="tag-manager-buttons" className="panel-form-row">
              <button className="blue" onClick={this.handleSubmit}>OK</button>
              <button className="white" onClick={this.handleCancel}>Cancel</button>
            </div>
          : null}
          </div>
        :
          <div>
            <a href="javascript:;" className="flat-button" onClick={this.handleShowTagManager}>
              <i className="material-icons">edit</i> Manage tags
            </a>
            <span>{tags}</span>
          </div>
      }
      </div>
    );
  }
};
/* END TagManager */

/* BEGIN Contact list (list of topics) */
/* A single topic */;
class Contact extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleContextClick = this.handleContextClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (this.props.onSelected) {
      this.props.onSelected(this.props.item, this.props.index, this.props.now, this.props.acs);
    }
  }

  handleContextClick(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.showContextMenu({ topicName: this.props.item, y: e.pageY, x: e.pageX });
  }

  render() {
    var title = this.props.title;
    if (!title) {
      title = <i>unknown</i>;
    } else if (title.length > 30) {
      title = title.substring(0, 28) + "...";
    }
    var online = this.props.now ? "online" : "offline";
    var avatar = this.props.avatar ? this.props.avatar : true;
    var badges = [];
    if (this.props.badges && this.props.badges.length > 0) {
      var count = 0;
      this.props.badges.map(function(b) {
        var style = "badge" + (b.color ? " " + b.color : "");
        badges.push(<span className={style} key={count}>{b.name}</span>);
        count ++;
      });
    }
    if (this.props.showMode && this.props.acs) {
      badges.push(<span className="badge" key="mode">{this.props.acs.getMode()}</span>);
    }

    return (
      <li className={!this.props.showCheckmark && this.props.selected ? "selected" : null}
        onClick={this.handleClick}>
        <div className="avatar-box">
          <LetterTile
            avatar={avatar} title={this.props.title} topic={this.props.item} />

          {this.props.showOnline ? <span className={online} /> :
            (this.props.showCheckmark && this.props.selected ?
            <i className="checkmark material-icons">check_circle</i>
            : null)}
        </div>
        <div className="text-box">
          <div><span className="contact-title">{title}</span>
          {this.props.unread > 0 ? <UnreadBadge count={this.props.unread} /> : null}
          </div>
          {this.props.comment ? <div className="contact-comment">{this.props.comment}</div> : null}
          <span>{badges}</span>
        </div>
        {this.props.showContextMenu ?
          <span className="menuTrigger">
            <a href="javascript:;" onClick={this.handleContextClick}>
              <i className="material-icons">expand_more</i>
            </a>
          </span> : null}
        </li>
    );
  }
};

/* The counter of unread messages in the topic */
class UnreadBadge extends React.PureComponent {
    render() {
      var showUnreadBadge = null;
      if (this.props.count > 0) {
        var count = this.props.count > 9 ? "9+" : this.props.count;
        showUnreadBadge = <span className="unread">{count}</span>;
      }
      return showUnreadBadge;
    }
};

/* Contact's labels: [you], [muted], [blocked], etc */
// FIXME: this class is unused.
class ContactBadges_UNUSED_REMOVE extends React.PureComponent {
    render() {
      let badges = null;
      if (this.props.badges && this.props.badges.length > 0) {
        badges = [];
        this.props.badges.map(function(b) {
          var style = "badge" + (b.color ? " " + b.color : "");
          // Badge names are expected to be unique, so using the name as the key.
          badges.push(<span className={style} key={b.name}>{b.name}</span>);
        });
      }
      return badges;
    }
};

/* ContactsView holds all contacts-related stuff */
class ContactsView extends React.Component {
  constructor(props) {
    super(props);

    this.prepareContactList = this.prepareContactList.bind(this);

    this.state = {
      contactList: this.prepareContactList()
    };

    this.tnMeContactUpdate = this.tnMeContactUpdate.bind(this);
    this.tnMeSubsUpdated = this.tnMeSubsUpdated.bind(this);
    this.resetContactList = this.resetContactList.bind(this);

    var me = Tinode.getMeTopic();
    me.onContactUpdate = this.tnMeContactUpdate;
    me.onSubsUpdated = this.tnMeSubsUpdated;
  }

  componentWillUnmount() {
    var me = Tinode.getMeTopic();
    me.onContactUpdate = undefined;
    me.onSubsUpdated = undefined;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.topicSelected != nextProps.topicSelected) {
      // If topicSelecetd is changed externally, update the
      // topic with online status and access mode.
      for (var i=0;i<this.state.contactList.length;i++) {
        var c = this.state.contactList[i];
        if (c.topic == nextProps.topicSelected) {
          nextProps.onOnlineChange(c.online);
          nextProps.onAcsChange(c.acs);
          break;
        }
      }
    }
  }

  // Reactions to updates to the contact list.
  tnMeContactUpdate(what, cont) {
    if (what == "on" || what == "off") {
      this.resetContactList();
      if (this.props.topicSelected == cont.topic) {
        this.props.onOnlineChange(what === "on");
      }
    } else if (what === "read") {
      this.resetContactList();
    } else if (what === "msg") {
      // New message received
      // Skip update if the topic is currently open, otherwise the badge will annoyingly flash.
      if (this.props.topicSelected !== cont.topic) {
        if (this.props.messageSounds) {
          POP_SOUND.play();
        }
        this.resetContactList();
      } else if (document.hidden && this.props.messageSounds) {
        POP_SOUND.play();
      }
    } else if (what === "recv") {
      // Explicitly ignoring "recv" -- it causes no visible updates to contact list.
    } else if (what === "gone" || what === "unsub") {
      // Topic deleted or user unsubscribed. Remove topic from view.
      // If the currently selected topic is gone, clear the selection.
      if (this.props.topicSelected === cont.topic) {
        this.props.onTopicSelected(null);
      }
      // Redraw without the deleted topic.
      this.resetContactList();
    } else if (what === "acs") {
      // Permissions changed. If it's for the currently selected topic,
      // update the views.
      if (this.props.topicSelected === cont.topic) {
        this.props.onAcsChange(cont.acs);
      }
    } else if (what == "del") {
      // messages deleted (hard or soft) -- update pill counter.
    } else {
      // TODO(gene): handle other types of notifications:
      // * ua -- user agent changes (maybe display a pictogram for mobile/desktop).
      // * upd -- topic 'public' updated, issue getMeta().
      console.log("Unsupported (yet) presence update:" + what + " in: " + cont.topic);
    }
  }

  tnMeSubsUpdated(names) {
    this.resetContactList();
  }

  prepareContactList() {
    var instance = this;
    var contacts = [];
    var unreadThreads = 0;
    Tinode.getMeTopic().contacts(function(c) {
      // Force to integers;
      c.seq = ~~c.seq;
      c.read = ~~c.read;
      c.unread = c.seq - c.read;
      unreadThreads += c.unread > 0 ? 1 : 0;
      contacts.push(c);
      if (instance.props.topicSelected == c.topic) {
        instance.props.onOnlineChange(c.online);
        instance.props.onAcsChange(c.acs);
      }
    }, this);
    contacts.sort(function(a,b){
      return b.touched - a.touched;
    });
    updateFavicon(unreadThreads);
    return contacts;
  }

  resetContactList() {
    this.setState({contactList: this.prepareContactList()});
  }

  render() {
    return (
      <ContactList
        connected={this.props.connected}
        contacts={this.state.contactList}
        emptyListMessage={<span>You have no chats<br />¯\_(ツ)_/¯</span>}
        topicSelected={this.props.topicSelected}
        showOnline={true}
        showUnread={true}
        onTopicSelected={this.props.onTopicSelected}
        showContextMenu={this.props.showContextMenu} />
    );
  }
};
/* END Contact list */

/* BEGIN ContactList: component for showing a list of contacts,
 * such as a list of group members in a group chat */
class ContactList extends React.Component {
  render() {
    var me = Tinode.getCurrentUserID();
    var contactNodes = [];
    var instance = this;
    var showCheckmark = Array.isArray(this.props.topicSelected);
    if (this.props.contacts && this.props.contacts.length > 0) {
      this.props.contacts.map(function(c) {
        var key = c.topic ? c.topic : c.user;
        // If filter function is provided, filter out the items
        // which don't satisfy the condition.
        if (instance.props.filterFunc && instance.props.filter) {
          var content = [key];
          if (c.private && c.private.comment) {
            content.push(("" + c.private.comment).toLowerCase());
          }
          if (c.public && c.public.fn) {
            content.push(("" + c.public.fn).toLowerCase());
          }
          if (!instance.props.filterFunc(instance.props.filter, content)) {
            return;
          }
        }

        var selected = showCheckmark ?
          (this.props.topicSelected.indexOf(key) > -1) :
          (this.props.topicSelected === key);
        var badges = [];
        if (this.props.showMode) {
          if (key === me) {
            badges.push({name: 'you', color: 'green'});
          }
          if (c.acs && c.acs.isOwner()) {
            badges.push({name: 'owner'});
          }
        }
        var comment = Array.isArray(c.private) ?
          c.private.join(", ") : (c.private ? c.private.comment : null);

        contactNodes.push(
          <Contact
            title={c.public ? c.public.fn : null}
            avatar={makeImageUrl(c.public ? c.public.photo : null)}
            comment={comment}
            unread={this.props.showUnread ? c.unread : 0}
            now={c.online && this.props.connected}
            acs={c.acs}
            showMode={this.props.showMode}
            badges={badges}
            showCheckmark={showCheckmark}
            selected={selected}
            showOnline={this.props.showOnline}
            onSelected={this.props.onTopicSelected}
            showContextMenu={this.props.showContextMenu}
            item={key}
            index={contactNodes.length}
            key={key} />
        );
      }, this);
    }

    return (
      <div className={this.props.noScroll ? null : "scrollable-panel"}>
        {contactNodes.length > 0 ?
          <ul className="contact-box">
            {contactNodes}
          </ul>
          :
          <div className="center-medium-text">
            {this.props.emptyListMessage}
          </div>}
      </div>
    );
  }
};
/* END ContactList */

/* BEGIN GroupMembers: control for managing a list of group members */
class GroupManager extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      members: props.members,
      index: GroupManager.indexMembers(props.members),
      contactFilter: '',
      noContactsMessage: 'You have no contacts :-(',
      selectedContacts: GroupManager.selectedContacts(props.members)
    };

    this.handleContactSelected = this.handleContactSelected.bind(this);
    this.handleMemberRemoved = this.handleMemberRemoved.bind(this);
    this.handleContactFilter = this.handleContactFilter.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  static indexMembers(members) {
    var index = {};
    members.map(function(m) {
      index[m.user] = {delta: 0, present: true}; // Delta: 0 unchanged, +1 added, -1 removed
    });
    return index;
  }

  static selectedContacts(members) {
    var sel = [];
    members.map(function(m) {
      sel.push(m.user);
    });
    return sel;
  }

  handleContactSelected(userId, index) {
    var status = this.state.index[userId];
    if (status) {
      if (status.present) {
        // Prevent duplicate members
        return;
      }
      status.delta += 1;
      status.present = true;
    } else {
      status = {delta: 1, present: true};
    }

    var m = this.state.members.slice();
    m.push(this.props.contacts[index]);

    var sel = GroupManager.selectedContacts(m);

    var i = this.state.index;
    i[userId] = status;

    this.setState({members: m, index: i, selectedContacts: sel});
  }

  handleMemberRemoved(userId, index) {
    var status = this.state.index[userId];
    if (!status || !status.present) {
      return;
    }
    status.present = false;
    status.delta -= 1;

    var m = this.state.members.slice();
    m.splice(index, 1);

    var sel = GroupManager.selectedContacts(m);

    var i = this.state.index;
    i[userId] = status;

    this.setState({members: m, index: i, selectedContacts: sel});
  }

  handleContactFilter(val) {
    var msg = !val ?
      "You have no contacts :-(" :
      "No contacts match '" + val + "'";

    this.setState({contactFilter: val, noContactsMessage: msg});
  }

  static doContactFiltering(filter, values) {
    if (filter) {
      for (var i=0; i<values.length; i++) {
        if (values[i].indexOf(filter) >= 0) {
          return true;
        }
      }
      return false;
    }
    return true;
  }

  handleSubmit() {
    var instance = this;
    var members = [];
    var added = [];
    var removed = [];

    var keys = Object.keys(this.state.index);
    keys.map(function(k) {
      if (instance.state.index[k].present) {
        members.push(k);
      }

      if (instance.state.index[k].delta > 0) {
        added.push(k);
      } else if (instance.state.index[k].delta < 0) {
        removed.push(k);
      }
    });
    this.props.onSubmit(members, added, removed);
  }

  handleCancel() {
    this.props.onCancel();
  }

  render() {
    return (
      <div id="group-manager">
        <div className="panel-form-row">
          <label className="small">Group members</label>
        </div>
        <div className="panel-form-row">
          <ChipInput
            chips={this.state.members}
            required={this.props.requiredMember}
            prompt="add members"
            filterFunc={this.handleContactFilter}
            onChipRemoved={this.handleMemberRemoved} />
        </div>
        <div className="panel-form-row">
          <label className="small">All contacts</label>
        </div>
        <ContactList
          contacts={this.props.contacts}
          topicSelected={this.state.selectedContacts}
          filter={this.state.contactFilter}
          filterFunc={GroupManager.doContactFiltering}
          emptyListMessage={this.state.noContactsMessage}
          showOnline={false}
          showUnread={false}
          onTopicSelected={this.handleContactSelected} />
        <div id="group-manager-buttons" className="panel-form-row">
          <button className="blue" onClick={this.handleSubmit}>OK</button>
          <button className="white" onClick={this.handleCancel}>Cancel</button>
        </div>
      </div>
    );
  }
};
/* END GroupManager */

/* BEGIN Create new topic and invite users or send an invite */
class NewTopicView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tabSelected: "p2p",
      searchQuery: props.contactsSearchQuery,
      contactList: props.foundContacts
    };

    this.handleTabClick = this.handleTabClick.bind(this);
    this.handleContactSelected = this.handleContactSelected.bind(this);
    this.handleNewGroupSubmit = this.handleNewGroupSubmit.bind(this);
    this.handleGroupByID = this.handleGroupByID.bind(this);
  }

  componentDidMount() {
    this.props.onInitFind();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      searchQuery: nextProps.contactsSearchQuery,
      contactList: nextProps.foundContacts
    };
  }

  handleTabClick(e) {
    e.preventDefault();
    window.location.hash = addUrlParam(window.location.hash, 'tab', e.currentTarget.dataset.id);
    this.setState({tabSelected: e.currentTarget.dataset.id});
  }

  handleContactSelected(sel) {
    if (this.state.tabSelected === "p2p") {
      window.location.hash = removeUrlParam(window.location.hash, 'tab');
      this.props.onCreateTopic(sel, undefined);
    }
  }

  handleNewGroupSubmit(name, dataUrl, priv, tags) {
    window.location.hash = removeUrlParam(window.location.hash, 'tab');
    this.props.onCreateTopic(undefined, vcard(name, dataUrl), priv, tags);
  }

  handleGroupByID(topicName) {
    window.location.hash = removeUrlParam(window.location.hash, 'tab');
    this.props.onCreateTopic(topicName);
  }

  render() {
    return (
      <div className="flex-column">
        <ul className="tabbar">
          <li className={this.state.tabSelected === "p2p" ? "active" : null}>
            <a href="javascript:;" data-id="p2p" onClick={this.handleTabClick}>find</a>
          </li>
          <li className={this.state.tabSelected === "grp" ? "active" : null}>
            <a href="javascript:;" data-id="grp" onClick={this.handleTabClick}>new group</a>
          </li>
          <li className={this.state.tabSelected === "byid" ? "active" : null}>
            <a href="javascript:;" data-id="byid" onClick={this.handleTabClick}>by id</a>
          </li>
        </ul>
        {this.state.tabSelected === "grp" ?
          <NewTopicGroup onSubmit={this.handleNewGroupSubmit} /> :
          this.state.tabSelected === "byid" ?
          <NewTopicById
            onSubmit={this.handleGroupByID}
            onError={this.props.onError} /> :
          <div className="flex-column">
            <SearchContacts type="p2p"
              searchQuery={this.state.searchQuery}
              onSearchContacts={this.props.onSearchContacts} />
            <ContactList
              contacts={this.state.contactList}
              emptyListMessage="Use search to find contacts"
              topicSelected={this.state.selectedContact}
              showOnline={false}
              showUnread={false}
              showContextMenu={false}
              onTopicSelected={this.handleContactSelected} />
          </div>}
      </div>
    );
  }
};

class NewTopicGroup extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      fn: '', // full/formatted name
      private: '',
      imageDataUrl: null,
      tags: []
    };

    this.handleFnChange = this.handleFnChange.bind(this);
    this.handlePrivateChange = this.handlePrivateChange.bind(this);
    this.handleImageChanged = this.handleImageChanged.bind(this);
    this.handleTagsChanged = this.handleTagsChanged.bind(this);
    this.handleTagsChanged = this.handleTagsChanged.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleFnChange(e) {
    this.setState({fn: e.target.value});
  }

  handlePrivateChange(e) {
    this.setState({private: e.target.value});
  }

  handleImageChanged(img) {
    this.setState({imageDataUrl: img});
  }

  handleTagsChanged(tags) {
    this.setState({tags: tags});
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.fn && this.state.fn.trim()) {
      this.props.onSubmit(this.state.fn.trim(),
        this.state.imageDataUrl, this.state.private.trim(),
        this.state.tags);
    }
  }

  render() {
    var submitClasses = "blue";
    if (this.props.disabled) {
      submitClasses += " disabled";
    }
    return (
      <form className="panel-form" onSubmit={this.handleSubmit}>
        <div className="panel-form-row">
          <div className="panel-form-column">
            <label className="small" htmlFor="new-topic-fn">Group name</label>
            <input type="text" id="new-topic-fn" placeholder="Freeform name of the group"
              value={this.state.fn} onChange={this.handleFnChange} autoFocus required />
            <br />
            <label className="small" htmlFor="new-topic-priv">Private comment</label>
            <input type="text" id="new-topic-priv" placeholder="Visible to you only"
              value={this.state.private} onChange={this.handlePrivateChange} />
          </div>
          <AvatarUpload
            onError={this.props.onError}
            onImageChanged={this.handleImageChanged} />
        </div>
        <TagManager
          tags={this.state.tags}
          activated={true}
          onTagsChanged={this.handleTagsChanged}
          title="Optional tags (search and discovery)" />
        <div className="dialog-buttons">
          <button className={submitClasses}>Create</button>
        </div>
      </form>
    );
  }
};

class SearchContacts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      edited: false,
      search: props.searchQuery
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentWillUnmount() {
    if (this.state.search) {
      this.setState({search: ''});
      this.props.onSearchContacts(DEL_CHAR);
    }
  }

  handleSearchChange(e) {
    this.setState({search: e.target.value});
  }

  handleSearch(e) {
    e.preventDefault();
    var query = this.state.search.trim();
    if (query.length > 0) {
      this.setState({edited: true});
      this.props.onSearchContacts(query);
    } else if (this.props.searchQuery) {
      this.props.onSearchContacts(DEL_CHAR);
    }
  }

  handleClear() {
    if (this.state.edited || this.state.search) {
      this.props.onSearchContacts(DEL_CHAR);
    }
    this.setState({search: '', edited: false});
  }

  handleKeyDown(e) {
    if (e.key === 'Enter') {
      this.handleSearch(e);
    } else if (e.key === 'Escape') {
      this.handleClear();
    }
  }

  render() {
    return (
      <div className="panel-form">
        <div className="panel-form-row">
          <i className="material-icons search">search</i>
          <input className="search" type="text"
            placeholder="List like email:alice@example.com, tel:17025550003..."
            value={this.state.search} onChange={this.handleSearchChange}
            onKeyDown={this.handleKeyDown} required autoFocus />
          <a href="javascript:;" onClick={this.handleClear}>
            <i className="material-icons">close</i>
          </a>
        </div>
      </div>
    );
  }
};

class NewTopicById extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      groupId: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({groupId: e.target.value});
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.handleSubmit(e);
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.groupId) {
      var name = this.state.groupId.trim();
      if (name.length > 3 && (name.substr(0, 3) == 'usr' || name.substr(0, 3) == 'grp')) {
        this.props.onSubmit(name);
      } else {
        this.props.onError("Invalid ID", "err");
      }
    }
  }

  render() {
    return (
      <div className="panel-form">
        <div className="panel-form-row">
        <input type="text" placeholder="Group or User ID"
          value={this.state.groupId} onChange={this.handleChange}
          onKeyPress={this.handleKeyPress} required />
        </div>
        <div className="dialog-buttons">
          <button className="blue" onClick={this.handleSubmit}>Subscribe</button>
        </div>
      </div>
    );
  }
};
/* END Create new topic and invite users or send an invite */

/* BEGIN ValidationView: panel for confirming credentials, like email or phone */
class ValidationView extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      code: props.credCode
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({code: nextProps.credCode});
  }

  handleChange(e) {
    this.setState({code: e.target.value});
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.handleSubmit(e);
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.code && this.state.code.trim()) {
      this.props.onSubmit(this.props.credMethod, this.state.code.trim());
    }
  }

  render() {
    var methods = {'email': 'email', 'tel': 'phone'};
    var method = methods[this.props.credMethod] || this.props.credMethod;
    return (
      <div className="panel-form">
        <div className="panel-form-row">
          <label className="small" htmlFor="enter-confirmation-code">
            Enter confirmation code sent to you by {method}:
          </label>
        </div>
        <div className="panel-form-row">
        <input type="text" id="enter-confirmation-code" placeholder="Numbers only"
          value={this.state.code} onChange={this.handleChange}
          onKeyPress={this.handleKeyPress} required />
        </div>
        <div className="dialog-buttons">
          <button className="blue" onClick={this.handleSubmit}>Confirm</button>
        </div>
      </div>
    );
  }
};
/* END ValidationView */

/* BEGIN InfoView: panel with topic/user info */
class InfoView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      topic: null,
      owner: false,
      admin: false,
      sharer: false,
      muted: false,
      address: null,
      groupTopic: undefined,
      fullName: undefined,
      avatar: null,
      private: null,
      selectedContact: null,
      access: null,
      modeGiven: null,
      modeWant: null,
      modeGiven2: null, // P2P topic, the other user mode given
      modeWant2: null,  // P2P topic, the other user mode want
      auth: null,
      anon: null,
      contactList: [],
      tags: [],
      showMemberPanel: false,
      showPermissionEditorFor: undefined,
      moreInfoExpanded: false,
      previousMetaDesc: undefined,
      previousSubsUpdated: undefined,
      previousTagsUpdated: undefined
    };

    this.resetSubs = this.resetSubs.bind(this);
    this.resetDesc = this.resetDesc.bind(this);
    this.onMetaDesc = this.onMetaDesc.bind(this);
    this.onSubsUpdated = this.onSubsUpdated.bind(this);
    this.onTagsUpdated = this.onTagsUpdated.bind(this);
    this.handleFullNameUpdate = this.handleFullNameUpdate.bind(this);
    this.handlePrivateUpdate = this.handlePrivateUpdate.bind(this);
    this.handleImageChanged = this.handleImageChanged.bind(this);
    this.handleMuted = this.handleMuted.bind(this);
    this.handlePermissionsChanged = this.handlePermissionsChanged.bind(this);
    this.handleLaunchPermissionsEditor = this.handleLaunchPermissionsEditor.bind(this);
    this.handleHidePermissionsEditor = this.handleHidePermissionsEditor.bind(this);
    this.handleShowAddMembers = this.handleShowAddMembers.bind(this);
    this.handleHideAddMembers = this.handleHideAddMembers.bind(this);
    this.handleMemberUpdateRequest = this.handleMemberUpdateRequest.bind(this);
    this.handleLeave = this.handleLeave.bind(this);
    this.handleMemberSelected = this.handleMemberSelected.bind(this);
    this.handleMoreInfo = this.handleMoreInfo.bind(this);
    this.handleTagsUpdated = this.handleTagsUpdated.bind(this);
    this.handleContextMenu = this.handleContextMenu.bind(this);
  }

  // No need to separately handle component mount.
  componentWillReceiveProps(props) {
    var topic = Tinode.getTopic(props.topic);
    if (!topic) {
      return;
    }

    if (this.onMetaDesc != topic.onMetaDesc) {
      this.previousMetaDesc = topic.onMetaDesc;
      topic.onMetaDesc = this.onMetaDesc;

      this.previousSubsUpdated = topic.onSubsUpdated;
      topic.onSubsUpdated = this.onSubsUpdated;

      if (topic.getType() === "grp") {
        this.previousTagsUpdated = topic.onTagsUpdated;
        topic.onTagsUpdated = this.onTagsUpdated;
      } else {
        this.previousTagsUpdated = undefined;
      }
    }

    if (this.state.topic != props.topic) {
      this.setState({topic: props.topic});
      this.resetDesc(topic, props);
      this.resetSubs(topic, props);
    }
  }

  componentWillUnmount() {
    var topic = Tinode.getTopic(this.props.topic);
    if (!topic) {
      return;
    }
    this.setState({topic: null});
    topic.onMetaDesc = this.previousMetaDesc;
    topic.onSubsUpdated = this.previousSubsUpdated;
    topic.onTagsUpdated = this.previousTagsUpdated;
  }

  resetSubs(topic, props) {
    var newState = {contactList: []};
    if (topic.getType() === "p2p") {
      // Fetch the other party in the p2p conversation.
      // Topic may not be ready yet, so check if user is found.
      var user2 = topic.subscriber(props.topic);
      if (user2) {
        newState.modeGiven2 = user2.acs.getGiven();
        newState.modeWant2 = user2.acs.getWant();
      }
    } else {
      topic.subscribers(function(sub) {
        newState.contactList.push(sub);
      }, this);
    }

    this.setState(newState);
  }

  resetDesc(topic, props) {
    var defacs = topic.getDefaultAccess() || {};
    var acs = topic.getAccessMode();
    this.setState({
      owner: acs && acs.isOwner(),
      admin: acs && acs.isAdmin(),
      sharer: acs && (acs.isAdmin() || acs.isSharer()),
      muted: acs && acs.isMuted(),

      fullName: topic.public ? topic.public.fn : undefined,
      avatar: makeImageUrl(topic.public ? topic.public.photo : null),
      private: topic.private ? topic.private.comment : null,
      address: topic.name,
      groupTopic: (topic.getType() === "grp"),
      showMemberPanel: false,
      access: acs ? acs.getMode() : undefined,
      modeGiven: acs ? acs.getGiven() : undefined,
      modeWant: acs ? acs.getWant() : undefined,
      auth: defacs.auth,
      anon: defacs.anon
    });

    if (topic.getType() === "grp" && acs && acs.isOwner()) {
      // Requesting tags: owner is editing the topic.
      topic.getMeta(topic.startMetaQuery().withTags().build());
    }
  }

  onMetaDesc(desc) {
    var topic = Tinode.getTopic(this.props.topic);
    if (!topic) {
      return;
    }
    this.resetDesc(topic, this.props);

    if (this.previousMetaDesc && this.previousMetaDesc != this.onMetaDesc) {
      this.previousMetaDesc(desc);
    }
  }

  onSubsUpdated() {
    var topic = Tinode.getTopic(this.props.topic);
    if (!topic) {
      return;
    }
    this.resetSubs(topic, this.props);

    if (this.previousSubsUpdated && this.previousSubsUpdated != this.onSubsUpdated) {
      this.previousSubsUpdated();
    }
  }

  onTagsUpdated(tags) {
    this.setState({tags: tags});

    if (this.previousTagsUpdated && this.previousTagsUpdated != this.onTagsUpdated) {
      this.previousTagsUpdated();
    }
  }

  handleFullNameUpdate(fn) {
    if (this.state.fullName !== fn) {
      this.setState({fullName: fn});
      this.props.onTopicDescUpdate(this.props.topic,
        vcard(fn, this.state.avatar),
        null);
    }
  }

  handlePrivateUpdate(priv) {
    if (this.state.priv !== priv) {
      this.setState({private: priv});
      this.props.onTopicDescUpdate(this.props.topic,
        null,
        priv);
    }
  }

  handleImageChanged(img) {
    this.setState({avatar: img});
    this.props.onTopicDescUpdate(this.props.topic,
      vcard(this.state.fullName, img),
      null);
  }

  handleMuted(ignored, checked) {
    this.setState({muted: checked});
    this.props.onChangePermissions(this.props.topic, checked ? "-P" : "+P");
  }

  handlePermissionsChanged(perm) {
    switch (this.state.showPermissionEditorFor) {
      case 'auth':
        this.props.onTopicDescUpdate(this.props.topic, null, null, {auth: perm});
        break;
      case 'anon':
        this.props.onTopicDescUpdate(this.props.topic, null, null, {anon: perm});
        break;
      case 'mode':
      case 'want':
        this.props.onChangePermissions(this.props.topic, perm);
        break;
      case 'given':
        this.props.onChangePermissions(this.props.topic, perm, this.props.topic);
        break;
      case 'user':
        this.props.onChangePermissions(this.props.topic, perm, this.state.userPermissionsEdited);
        break;
    }

    this.setState({showPermissionEditorFor: undefined});
  }

  handleLaunchPermissionsEditor(which, uid) {
    var toEdit, toCompare, toSkip, titleEdit, titleCompare, userTitle, userAvatar
    switch (which) {
      case 'mode':
        toEdit = this.state.access;
        break;
      case 'want':
        toEdit = this.state.modeWant;
        toCompare = this.state.modeGiven;
        toSkip = this.state.groupTopic ? 'O' : 'ASDO';
        titleEdit = 'Requested';
        titleCompare = 'Granted';
        break;
      case 'given':
        toEdit = this.state.modeGiven2;
        toCompare = this.state.modeWant2;
        toSkip = this.state.groupTopic ? (this.state.owner ? '' : 'O') : 'ASDO';
        titleEdit = 'Granted';
        titleCompare = 'Requested';
        break;
      case 'auth':
        toEdit = this.state.auth;
        toSkip = 'O';
        break;
      case 'anon':
        toEdit = this.state.anon;
        toSkip = 'O';
        break;
      case 'user': {
        var topic = Tinode.getTopic(this.props.topic);
        if (!topic) {
          return;
        }
        var user = topic.subscriber(uid);
        if (!user || !user.acs) {
          return;
        }
        toEdit = user.acs.getGiven();
        toCompare = user.acs.getWant();
        toSkip = this.state.owner ? '' : 'O';
        titleEdit = 'Granted';
        titleCompare = 'Requested';
        if (user.public) {
          userTitle = user.public.fn;
          userAvatar = user.public.photo;
        }
        break;
      }
      default:
        console.log("Unknown permission editing mode '" + which + "'");
        break;
    }
    this.setState({
      showPermissionEditorFor: which,
      userPermissionsEdited: uid,
      userPermissionsTitle: userTitle,
      userPermissionsAvatar: userAvatar,
      editedPermissions: toEdit,
      immutablePermissions: toCompare,
      editedPermissionsTitle: titleEdit,
      immutablePermissionsTitle: titleCompare,
      editedPermissionsSkipped: toSkip,
    });
  }

  handleHidePermissionsEditor() {
    this.setState({showPermissionEditorFor: undefined});
  }

  handleShowAddMembers() {
    this.props.onInitFind();
    this.setState({showMemberPanel: true});
  }

  handleHideAddMembers() {
    this.setState({showMemberPanel: false});
  }

  handleMemberUpdateRequest(members, added, removed) {
    this.props.onMemberUpdateRequest(this.props.topic, added, removed);
    this.setState({showMemberPanel: false});
  }

  handleLeave() {
    this.props.onLeaveTopic(this.props.topic);
  }

  handleMemberSelected(uid) {
    this.setState({selectedContact: uid});
  }

  handleMoreInfo(open) {
    this.setState({moreInfoExpanded: open});
  }

  handleTagsUpdated(tags) {
    if (!arrayEqual(this.state.tags.slice(0), tags.slice(0))) {
      this.props.onTopicTagsUpdate(this.props.topic, tags);
    }
  }

  handleContextMenu(params) {
    var instance = this;
    var topic = Tinode.getTopic(this.props.topic);
    if (!topic) {
      return;
    }
    var user = topic.subscriber(params.topicName);
    if (!user || !user.acs) {
      return;
    }

    var menuItems = [
      {title: "Edit permissions", handler: function() {
        instance.handleLaunchPermissionsEditor("user", params.topicName);
      }},
      ContextMenuItems["member_delete"],
      user.acs.isMuted() ? ContextMenuItems["member_unmute"] : ContextMenuItems["member_mute"],
      user.acs.isJoiner() ? ContextMenuItems["member_block"] : ContextMenuItems["member_unblock"]
    ];
    this.props.showContextMenu({
      topicName: this.props.topic,
      x: params.x,
      y: params.y,
      user: params.topicName}, menuItems);
  }

  render() {
    return (
      <div id="info-view">
        <div className="caption-panel" id="info-caption-panel">
          <div className="panel-title" id="info-title">Info</div>
          <div>
            <MenuCancel onCancel={this.props.onCancel} />
          </div>
        </div>
        {this.props.displayMobile ?
          <ErrorPanel
            level={this.props.errorLevel}
            text={this.props.errorText}
            onClearError={this.props.onError} /> : null}
        {this.state.showMemberPanel ?
          <GroupManager
            members={this.state.contactList}
            requiredMember={this.props.myUserId}
            contacts={this.props.foundContacts}
            onCancel={this.handleHideAddMembers}
            onSubmit={this.handleMemberUpdateRequest} />
          :
        this.state.showPermissionEditorFor ?
          <PermissionsEditor
            mode={this.state.editedPermissions}
            compare={this.state.immutablePermissions}
            skip={this.state.editedPermissionsSkipped}
            modeTitle={this.state.editedPermissionsTitle}
            compareTitle={this.state.immutablePermissionsTitle}
            userTitle={this.state.userPermissionsTitle}
            item={this.state.userPermissionsEdited}
            userAvatar={this.state.userPermissionsAvatar}
            skip={this.state.editedPermissionsSkipped}
            onSubmit={this.handlePermissionsChanged}
            onCancel={this.handleHidePermissionsEditor}
            />
          :
          <div id="info-view-content" className="scrollable-panel">
            <div className="panel-form-row">
              <div className="panel-form-column">
                <div><label className="small">Name</label></div>
                <div><InPlaceEdit
                    placeholder="Group name"
                    readOnly={!this.state.owner}
                    text={this.state.fullName}
                    onFinished={this.handleFullNameUpdate} /></div>
                <div><label className="small">Private comment</label></div>
                <div><InPlaceEdit
                    placeholder="Visible to you only"
                    text={this.state.private}
                    onFinished={this.handlePrivateUpdate} /></div>
              </div>
              <AvatarUpload
                avatar={this.state.avatar}
                readOnly={!this.state.owner}
                uid={this.props.topic}
                title={this.state.fullName}
                onImageChanged={this.handleImageChanged}
                onError={this.props.onError} />
            </div>
            <div className="hr" />
            <div className="panel-form-column">
              <div className="panel-form-row">
                <label>Muted:</label>
                <CheckBox name="P" checked={this.state.muted}
                    onChange={this.handleMuted} />
              </div>
              <MoreButton
                title="More"
                open={this.state.moreInfoExpanded}
                onToggle={this.handleMoreInfo} />
              {this.state.moreInfoExpanded ?
                <div className="panel-form-column">
                <div className="panel-form-row">
                  <label>Address:</label>
                  <tt>{this.state.address}</tt>
                </div>
                {this.state.groupTopic ?
                  <div className="panel-form-row">
                    <label>Your permissions:</label>
                    <tt className="clickable"
                      onClick={this.handleLaunchPermissionsEditor.bind(this, 'want')}>
                      {this.state.access}
                    </tt>
                  </div>
                  :
                  <div>
                    <div><label className="small">Permissions:</label></div>
                    <div className="quoted">
                      <div>Yours: &nbsp;<tt className="clickable"
                        onClick={this.handleLaunchPermissionsEditor.bind(this, 'want')}>
                        {this.state.access}
                      </tt></div>
                      <div>{this.state.fullName}&prime;s: &nbsp;<tt className="clickable"
                        onClick={this.handleLaunchPermissionsEditor.bind(this, 'given')}>
                        {this.state.modeGiven2}
                      </tt></div>
                    </div>
                  </div>
                }
                {this.state.sharer && (this.state.auth || this.state.anon) ?
                  <div>
                    <div><label className="small">Default access mode:</label></div>
                    <div className="quoted">
                      <div>Auth: {this.state.admin ?
                        <tt className="clickable"
                          onClick={this.handleLaunchPermissionsEditor.bind(this, 'auth')}>
                          {this.state.auth}
                        </tt>
                        :
                        <tt>{this.state.auth}</tt>
                      }
                      </div>
                      <div>Anon: {this.state.admin ?
                        <tt className="clickable"
                          onClick={this.handleLaunchPermissionsEditor.bind(this, 'anon')}>
                          {this.state.anon}
                        </tt>
                        :
                        <tt>{this.state.anon}</tt>
                      }
                      </div>
                    </div>
                  </div>
                  :
                  null
                }
                </div>
              :
              null
              }
            </div>
            <div className="hr" />
            {this.state.owner ?
              <TagManager
                title="Tags"
                tags={this.state.tags}
                activated={false}
                onSubmit={this.handleTagsUpdated} />
              :
              null
            }
            {this.state.owner ? <div className="hr" /> : null }
            {this.state.groupTopic ?
              <div className="panel-form-column">
                <div className="panel-form-row">
                  <label className="small">Group members:</label>
                </div>
                <div className="panel-form-row">
                  {this.state.sharer ?
                    <a href="javascript:;" className="flat-button" onClick={this.handleShowAddMembers}>
                      <i className="material-icons">person_add</i> Add members
                    </a>
                    : null}
                  {!this.state.owner ?
                    <a href="javascript:;" className="red flat-button" onClick={this.handleLeave}>
                      <i className="material-icons">exit_to_app</i> Leave
                    </a>
                    : null}
                </div>
                <ContactList
                  contacts={this.state.contactList}
                  emptyListMessage="No members"
                  topicSelected={this.state.selectedContact}
                  showOnline={false}
                  showUnread={false}
                  showMode={true}
                  noScroll={true}
                  onTopicSelected={this.handleMemberSelected}
                  showContextMenu={this.state.admin ? this.handleContextMenu : false}
                />
              </div>
              :
              <div className="panel-form-row">
                <a href="javascript:;" className="red flat-button" onClick={this.handleLeave}>
                  <i className="material-icons">exit_to_app</i> Leave
                </a>
              </div>
            }
          </div>
        }
      </div>
    );
  }
};
/* END InfoView */

/* BEGIN Conversation panel */
class ChatMessage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      progress: 0
    };

    if (props.uploader) {
      props.uploader.onProgress = this.handleProgress.bind(this);
    }

    this.handlePreviewImage = this.handlePreviewImage.bind(this);
    this.handleContextClick = this.handleContextClick.bind(this);
    this.handleCancelUpload = this.handleCancelUpload.bind(this);
  }

  handlePreviewImage(e) {
    e.preventDefault();
    this.props.onImagePreview({
      url: e.target.src,
      filename: e.target.title,
      width: e.target.dataset.width,
      height: e.target.dataset.height,
      size: e.target.dataset.size,
      type: e.target.dataset.mime
    });
  }

  handleContextClick(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.showContextMenu({ seq: this.props.seq, y: e.pageY, x: e.pageX });
  }

  handleProgress(ratio) {
    this.setState({progress: ratio});
  }

  handleCancelUpload() {
    this.props.uploader.cancel();
  }

  render() {
    var elementKey = 0;

    var formatter = function(style, data, values) {
      elementKey += 1;
      var el = Drafty.tagName(style);
      if (el) {
        var attr = Drafty.attrValue(style, data) || {};
        attr.key = elementKey;
        if (style == "IM") {
          // Additional processing for images
          var dim = fitImageSize(data.width, data.height,
            Math.min(this.props.viewportWidth - REM_SIZE * 4, REM_SIZE * 36), REM_SIZE * 24, false);
          attr.className = "inline-image";
          attr.style = dim ? { width: dim.dstWidth + "px", height: dim.dstHeight + "px" } : null;
          attr.onClick = this.handlePreviewImage;
        }
        return React.createElement(el, attr, values);
      } else {
        return values;
      }
    };

    var sideClass = this.props.sequence + " " + (this.props.response ? "left" : "right");
    var bubbleClass = (this.props.sequence === "single" || this.props.sequence === "last") ?
      "bubble tip" : "bubble";
    var avatar = this.props.userAvatar || true;
    var fullDisplay = (this.props.userFrom && this.props.response &&
      (this.props.sequence === "single" || this.props.sequence === "last"));

    var content = this.props.content;
    var attachments = [];
    if (this.props.mimeType == Drafty.getContentType()) {
      Drafty.attachments(content, function(att, i) {
        attachments.push(<Attachment
          downloadUrl={Drafty.getDownloadUrl(att)}
          filename={att.name} uploader={Drafty.isUploading(att)}
          mimetype={att.mime} size={Drafty.getEntitySize(att)}
          progress={this.state.progress}
          onCancelUpload={this.handleCancelUpload}
          onError={this.props.onError}
          key={i} />);
      }, this);
      content = React.createElement('span', null, Drafty.format(content, formatter, this));
    }

    return (
      <li className={sideClass}>
        {this.props.userFrom && this.props.response ?
          <div className="avatar-box">
            {fullDisplay ?
              <LetterTile topic={this.props.userFrom}
                title={this.props.userName} avatar={avatar} /> :
              null}
          </div> :
          null}
        <div>
          <div className={bubbleClass}>
            <p>{content}
            {attachments}
            <ReceivedMarker
              timestamp={this.props.timestamp}
              received={this.props.received} />
            </p>
            <span className="menuTrigger">
              <a href="javascript:;" onClick={this.handleContextClick}>
                <i className="material-icons">expand_more</i>
              </a>
            </span>
          </div>
          {fullDisplay ? <div className="author">{this.props.userName}</div> : null}
        </div>
      </li>
    );
  }
};

/* Received/read indicator */
class ReceivedMarker extends React.PureComponent {
  render() {
    var timestamp = (this.props.received <= Tinode.MESSAGE_STATUS_SENDING) ?
      "sending ..." :
      shortDateFormat(this.props.timestamp);

    var marker = null;
    if (this.props.received <= Tinode.MESSAGE_STATUS_SENDING) {
      marker = (<i className="material-icons small">access_time</i>); // watch face
    } else if (this.props.received == Tinode.MESSAGE_STATUS_SENT) {
      marker = (<i className="material-icons small">done</i>); // checkmark
    } else if (this.props.received == Tinode.MESSAGE_STATUS_RECEIVED) {
      marker = (<i className="material-icons small">done_all</i>); // double checkmark
    } else if (this.props.received == Tinode.MESSAGE_STATUS_READ) {
      marker = (<i className="material-icons small blue">done_all</i>); // open eye
    }

    return (
      <span className="timestamp">
        {timestamp}{'\u00a0'}{marker}
      </span>
    );
  }
};

/* File uload/download progress indicator with a cancel inside */
class FileProgress extends React.PureComponent {
  render() {
    return (
      <div className="uploader">
        <div><span style={{width: (this.props.progress * 100) + "%"}}></span></div>
        {this.props.progress < 0.999 ?
          <a href="javascript:;" onClick={this.props.onCancel}><i className="material-icons">close</i> cancel</a>
          :
          <span>finishing...</span>
        }
      </div>
    );
  }
}

class Attachment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      downloader: null,
      progress: 0
    };

    this.downloadFile = this.downloadFile.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  downloadFile(url, filename, mimetype) {
    var downloader = Tinode.getLargeFileHelper();
    this.setState({downloader: downloader});
    downloader.download(url, filename, mimetype, (loaded) => {
      this.setState({progress: loaded / this.props.size});
    }).then(() => {
      this.setState({downloader: null, progress: 0});
    }).catch((err) => {
      if (err) {
        this.props.onError("Error downloading file: " + err.message, "err");
      }
      this.setState({downloader: null, progress: 0});
    });
  }

  handleCancel() {
    if (this.props.uploader) {
      this.props.onCancelUpload();
    } else if (this.state.downloader) {
      this.state.downloader.cancel();
    }
  }

  render() {
    let filename = this.props.filename || "file_attachment";
    if (filename.length > 36) {
      filename = filename.substr(0, 16) + "..." + filename.substr(-16);
    }
    let size = this.props.size > 0 ?
      <span className="small gray">({bytesToHumanSize(this.props.size)})</span> :
      null;

    // Detect if the download URL is relative or absolute.
    // If the URL is relative use LargeFileHelper to attach authentication
    // credentials to the request.
    let url, helperFunc;
    if (!this.props.uploader && !this.state.downloader &&
        !(/^(?:(?:[a-z]+:)?\/\/)/i.test(this.props.downloadUrl))) {
      // Relative URL. Use download helper.
      url = "javascript:;";
      helperFunc = (e) => {
        this.downloadFile(this.props.downloadUrl, this.props.filename, this.props.mimetype);
      };
    } else {
      url = this.props.downloadUrl;
      helperFunc = null;
    }
    return (
      <div className="attachment">
        <div><i className="material-icons big gray">insert_drive_file</i></div>
        <div className="flex-column">
          <div>{filename} {size}</div>
          {this.props.uploader || this.state.downloader ?
            <FileProgress progress={this.props.uploader ? this.props.progress : this.state.progress}
              onCancel={this.handleCancel} />
            :
            <div><a href={url} download={this.props.filename} onClick={helperFunc} >
              <i className="material-icons">file_download</i> save
            </a></div>
          }
        </div>
      </div>
    );
  }
};

class MessagesView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      onlineSubs: [],
      topic: '',
      title: '',
      avatar: null,
      scrollPosition: 0,
      readOnly: props.acs ? !props.acs.isWriter() : true,
      writeOnly: props.acs ? !props.acs.isReader() : true,
      typingIndicator: false,
      imagePreview: null
    };

    this.propsChange = this.propsChange.bind(this);
    this.leave = this.leave.bind(this);
    this.handleScrollReference = this.handleScrollReference.bind(this);
    this.fetchMoreMessages = this.fetchMoreMessages.bind(this);
    this.handleDescChange = this.handleDescChange.bind(this);
    this.handleSubsUpdated = this.handleSubsUpdated.bind(this);
    this.handleNewMessage = this.handleNewMessage.bind(this);
    this.handleInfoReceipt = this.handleInfoReceipt.bind(this);
    this.handleImagePreview = this.handleImagePreview.bind(this);
    this.handleCloseImagePreview = this.handleCloseImagePreview.bind(this);
    this.handleContextClick = this.handleContextClick.bind(this);
    this.handleShowContextMenuMessage = this.handleShowContextMenuMessage.bind(this);
    this.handleBackNavigation = this.handleBackNavigation.bind(this);
  }

  // Scroll last message into view on component update e.g. on message received.
  componentDidUpdate(prevProps, prevState) {
    if (this.messagesScroller &&
      (prevState.title != this.state.title ||
        prevState.messages.length != this.state.messages.length)) {
      this.messagesScroller.scrollTop = this.messagesScroller.scrollHeight - this.state.scrollPosition;
    }
  }

  componentDidMount() {
    this.propsChange(this.props);
    if (this.messagesScroller) {
      this.messagesScroller.addEventListener('scroll', this.fetchMoreMessages);
    }
  }

  componentWillUnmount() {
    this.leave();
    if (this.messagesScroller) {
      this.messagesScroller.removeEventListener('scroll', this.fetchMoreMessages);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.propsChange(nextProps);
  }

  propsChange(props) {
    if (!props || !props.topic) {
      this.setState({messages: [], onlineSubs: [], topic: null});
      this.leave();
      return;
    }

    if (!props.connected) {
      // connection lost, clear online subs
      this.setState({onlineSubs: []});
      return;
    }

    var tryToResubscribe = !this.props.connected && props.connected;

    var topic = Tinode.getTopic(props.topic);
    if (props.topic != this.state.topic) {
      var msgs = [];
      var subs = [];

      // Bind the new topic to component.
      topic.onData = this.handleNewMessage;
      topic.onInfo = this.handleInfoReceipt;
      topic.onMetaDesc = this.handleDescChange;
      topic.onSubsUpdated = this.handleSubsUpdated;
      topic.onPres = this.handleSubsUpdated;
      // Unbind the previous topic from this component.
      this.leave();

      this.handleDescChange(topic);
      var myId = this.props.myUserId;
      topic.subscribers(function(sub) {
        if (sub.online && sub.user != myId) {
          subs.push(sub);
        }
      });

      topic.messages(function(msg) {
        if (!msg.deleted) {
          msgs = msgs.concat(msg);
        }
      });

      this.setState({
        messages: msgs,
        onlineSubs: subs,
        topic: props.topic,
        imagePreview: null,
        scrollPosition: 0
      });
      tryToResubscribe = true;

      // The user switched to the new topic before the timer for
      // the previous topic has triggered, kill it.
      this.props.readTimerHandler(null);
    }

    this.setState({
      readOnly: props.acs ? !props.acs.isWriter() : true,
      writeOnly: props.acs ? !props.acs.isReader() : true
    });

    if (!topic.isSubscribed() && tryToResubscribe) {
      var getQuery = topic.startMetaQuery()
        .withLaterDesc()
        .withLaterSub()
        .withLaterData(MESSAGES_PAGE)
        .withLaterDel();
      // Don't request the tags. They are useless unless the user
      // is the owner and is editing the topic.
      // getQuery = topic.getType() == 'grp' ? getQuery.withTags() : getQuery;
      // Show "loading" spinner.
      this.setState({ fetchingMessages: true });
      topic.subscribe(getQuery.build())
        .then(() => {
          // Hide spinner.
          this.setState({ fetchingMessages: false });
        })
        .catch((err) => {
          this.props.onError(err.message, "err");
          this.setState({
            title: "Not found",
            avatar: null,
            readOnly: true,
            writeOnly: true,
            fetchingMessages: false
          });
        });
    }
  }

  leave() {
    if (this.state.topic) {
      var oldTopic = Tinode.getTopic(this.state.topic);
      if (oldTopic) {
        if (oldTopic.isSubscribed()) {
          oldTopic.leave(false).catch(function(err) {
            // do nothing
            console.log(err);
          });
        }
        oldTopic.onData = undefined;
        oldTopic.onInfo = undefined;
        oldTopic.onMetaDesc = undefined;
        oldTopic.onSubsUpdated = undefined;
        oldTopic.onPres = undefined;
      }
    }
  }

  handleScrollReference(node) {
    if (node) {
      node.addEventListener('scroll', this.fetchMoreMessages);
      this.messagesScroller = node;
    }
  }

  // Get older messages
  fetchMoreMessages(event) {
    var instance = this;
    if (event.target.scrollTop <= 0) {
      var started = false;
      var newState = {scrollPosition: event.target.scrollHeight - event.target.scrollTop};
      this.setState(function(prevState, props) {
        if (!prevState.fetchingMessages) {
          var topic = Tinode.getTopic(instance.state.topic);
          if (topic && topic.isSubscribed() && topic.msgHasMoreMessages()) {
            newState.fetchingMessages = true;
            topic.getMessagesPage(MESSAGES_PAGE).then(function() {
              instance.setState({fetchingMessages: false});
            }).catch(function(err) {
              instance.setState({fetchingMessages: false});
              instance.props.onError(err.message, "err");
            });
          }
        }
        return newState;
      });
    }
  }

  handleDescChange(desc) {
    if (desc.public) {
      this.setState({
        title: desc.public.fn,
        avatar: makeImageUrl(desc.public.photo)
      });
    }
    if (desc.acs) {
      this.setState({
        readOnly: !desc.acs.isWriter(),
        writeOnly: !desc.acs.isReader()
      });
    }
  }

  handleSubsUpdated() {
    if (this.state.topic) {
      var subs = [];
      var myId = this.props.myUserId;
      var topic = Tinode.getTopic(this.state.topic);
      topic.subscribers(function(sub) {
        if (sub.online && sub.user != myId) {
          subs.push(sub);
        }
      });
      this.setState({onlineSubs: subs});
    }
  }

  handleNewMessage(msg) {
    // Regenerate messages list
    var topic = Tinode.getTopic(this.state.topic);
    var newState = {messages: []};
    topic.messages(function(m) {
      if (!m.deleted) {
        newState.messages = newState.messages.concat(m);
      }
    });

    // msg could be null if one or more messages were deleted.
    if (msg && !msg.deleted) {
      // If the message is added to the end of the message list,
      // scroll to the bottom.
      if (topic.isNewMessage(msg.seq)) {
        newState.scrollPosition = 0;
      }

      // Aknowledge all messages, including own messges.
      let status = topic.msgStatus(msg);
      if (status >= Tinode.MESSAGE_STATUS_SENT) {
        this.props.readTimerHandler(() => {
          topic.noteRead(msg.seq);
        });
      }
      this.props.onData(msg);
    }

    this.setState(newState);
  }

  handleInfoReceipt(info) {
    switch (info.what) {
      case "kp": {
        clearTimeout(this.keyPressTimer);
        var instance = this;
        this.keyPressTimer = setTimeout(function() {
          instance.setState({typingIndicator: false});
        }, KEYPRESS_DELAY + 1000);
        if (!this.state.typingIndicator) {
          this.setState({typingIndicator: true});
        }
        break;
      }
      case "read":
      case "recv":
        // Redraw due to changed recv/read status.
        this.forceUpdate();
        break;
      default:
        console.log("Other change in topic: ", info.what);
    }
  }

  handleImagePreview(content) {
    this.setState({ imagePreview: content });
  }

  handleCloseImagePreview() {
    this.setState({ imagePreview: null });
  }

  handleContextClick(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.showContextMenu({ topicName: this.state.topic, y: e.pageY, x: e.pageX });
  }

  handleShowContextMenuMessage(params) {
    params.topicName = this.state.topic;
    var menuItems = [ContextMenuItems["message_delete"]];
    var topic = Tinode.getTopic(params.topicName);
    if (topic) {
      var acs = topic.getAccessMode();
      if (acs && acs.isDeleter()) {
        menuItems.push(ContextMenuItems["message_delete_hard"]);
      }
    }
    this.props.showContextMenu(params, menuItems);
  }

  handleBackNavigation() {
    this.props.onHideMessagesView();
  }

  render() {
    var component = null;
    if (this.state.topic) {
      var messageNodes = [];
      var topic = Tinode.getTopic(this.state.topic);
      var groupTopic = topic.getType() === "grp";
      var previousFrom = null;
      for (var i=0; i<this.state.messages.length; i++) {
        var msg = this.state.messages[i];
        var nextFrom = null;

        if (i + 1 < this.state.messages.length) {
          nextFrom = this.state.messages[i+1].from
        }

        var sequence = "single";
        if (msg.from === previousFrom) {
          if (msg.from === nextFrom) {
            sequence = "middle";
          } else {
            sequence = "last";
          }
        } else if (msg.from === nextFrom) {
          sequence = "first";
        }
        previousFrom = msg.from;

        var isReply = !(msg.from === this.props.myUserId);
        var deliveryStatus = topic.msgStatus(msg);

        var userName, userAvatar, userFrom, chatBoxClass;
        if (groupTopic) {
          var user = topic.userDesc(msg.from);
          if (user && user.public) {
            userName = user.public.fn;
            userAvatar = makeImageUrl(user.public.photo);
          }
          userFrom = msg.from;
          chatBoxClass="chat-box group";
        } else {
          chatBoxClass="chat-box";
        }

        messageNodes.push(
          <ChatMessage content={msg.content} mimeType={msg.head ? msg.head.mime : null}
            timestamp={msg.ts} response={isReply} seq={msg.seq}
            userFrom={userFrom} userName={userName} userAvatar={userAvatar}
            sequence={sequence} received={deliveryStatus} uploader={msg._uploader}
            viewportWidth={this.props.viewportWidth}
            showContextMenu={this.handleShowContextMenuMessage}
            onImagePreview={this.handleImagePreview}
            onError={this.props.onError}
            key={msg.seq} />
        );
      }

      var lastSeen = null;
      var cont = Tinode.getMeTopic().getContact(this.state.topic);
      if (cont && Tinode.topicType(cont.topic) === "p2p") {
        if (cont.online) {
          lastSeen = "online now";
        } else if (cont.seen) {
          lastSeen = "Last active: " + shortDateFormat(cont.seen.when);
          // TODO(gene): also handle user agent in c.seen.ua
        }
      }
      var avatar = this.state.avatar || true;
      var online = this.props.online ? "online" + (this.state.typingIndicator ? " typing" : "") : "offline";

      component = (
        <div id="topic-view" className={this.props.hideSelf ? 'nodisplay' : null}>
          <div id="topic-caption-panel" className="caption-panel">
            {this.props.displayMobile ?
              <a href="javascript:;" id="hide-message-view" onClick={this.handleBackNavigation}>
                <i className="material-icons">arrow_back</i>
              </a>
              :
              null}
            <div className="avatar-box">
              <LetterTile avatar={avatar}
                topic={this.state.topic} title={this.state.title} />
              <span className={online} />
            </div>
            <div id="topic-title-group">
              <div id="topic-title" className="panel-title">{this.state.title}</div>
              <div id="topic-last-seen">{lastSeen}</div>
            </div>
            {groupTopic ?
              <GroupSubs
                subscribers={this.state.onlineSubs} /> :
              <div id="topic-users" />
            }
            <div>
              <a href="javascript:;" onClick={this.handleContextClick}>
                <i className="material-icons">more_vert</i>
              </a>
            </div>
          </div>
          {this.props.displayMobile ?
            <ErrorPanel
              level={this.props.errorLevel}
              text={this.props.errorText}
              onClearError={this.props.onError} />
            : null}
          <LoadSpinner show={this.state.fetchingMessages} />
          <div id="messages-container">
            <div id="messages-panel" ref={this.handleScrollReference}>
              <ul id="scroller" className={chatBoxClass}>
                {messageNodes}
              </ul>
            </div>
          {this.state.writeOnly ?
            <div id="write-only-background">
              <div id="write-only-note">no access to messages</div>
            </div>
            :
            null
          }
          </div>
          <SendMessage
            topic={this.props.topic}
            disabled={this.state.readOnly}
            sendMessage={this.props.sendMessage}
            onError={this.props.onError} />
          {this.state.imagePreview ?
            <ImagePreview content={this.state.imagePreview}
              onClose={this.handleCloseImagePreview} /> : null}
        </div>
      );
    } else {
      component = (
        <LogoView hideSelf={this.props.hideSelf}
          serverVersion={this.props.serverVersion}
          serverAddress={this.props.serverAddress} />
      );
    }
    return component;
  }
};

/* Send message form */
class SendMessage extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
      // Make initial keypress time as if it happened 5001 milliseconds in the past.
      keypressTimestamp: new Date().getTime() - KEYPRESS_DELAY - 1
    };

    this.handlePasteEvent = this.handlePasteEvent.bind(this);
    this.handleAttachImage = this.handleAttachImage.bind(this);
    this.handleAttachFile = this.handleAttachFile.bind(this);
    this.handleSend = this.handleSend.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleMessageTyping = this.handleMessageTyping.bind(this);
  }

  componentDidMount() {
    this.pasteFile.addEventListener('paste', this.handlePasteEvent, false);
  }

  componentWillUnmount() {
    this.pasteFile.removeEventListener('paste', this.handlePasteEvent, false)
  }

  handlePasteEvent(e) {
    if (this.props.disabled) {
      return;
    }
    // FIXME: handle large files too.
    if (filePasted(e,
      (bits, mime, width, height, fname) => {
        this.props.sendMessage(Drafty.insertImage(null,
          0, mime, bits, width, height, fname));
      },
      (mime, bits, fname) => {
        this.props.sendMessage(Drafty.attachFile(null, mime, bits, fname));
      },
      this.props.onError)) {

      // If a file was pasted, don't paste base64 data into input field.
      e.preventDefault();
    }
  }

  handleAttachImage(e) {
    if (e.target.files && e.target.files.length > 0) {
      let file = e.target.files[0];
      // Check if the uploaded file is indeed an image and if it isn't too large.
      if (file.size > MAX_INBAND_ATTACHMENT_SIZE || SUPPORTED_IMAGE_FORMATS.indexOf(file.type) < 0) {
        // Convert image for size or format.
        imageFileScaledToBase64(file, MAX_IMAGE_DIM, MAX_IMAGE_DIM, false,
          // Success
          (bits, mime, width, height, fname) => {
            this.props.sendMessage(Drafty.insertImage(null,
              0, mime, bits, width, height, fname));
          },
          // Failure
          (err) => {
            this.props.onError(err, "err");
          });
      } else {
        // Image can be uploaded as is. No conversion is needed.
        imageFileToBase64(file,
          // Success
          (bits, mime, width, height, fname) => {
            this.props.sendMessage(Drafty.insertImage(null,
              0, mime, bits, width, height, fname));
          },
          // Failure
          (err) => {
            this.props.onError(err, "err");
          }
        );
      }
    }
    // Clear the value so the same file can be uploaded again.
    e.target.value = '';
  }

  handleAttachFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      var file = e.target.files[0];
      if (file.size > MAX_EXTERN_ATTACHMENT_SIZE) {
        // Too large.
        this.props.onError("The file size " + bytesToHumanSize(file.size) +
          " exceeds the "  + bytesToHumanSize(MAX_EXTERN_ATTACHMENT_SIZE) + " limit.", "err");
      } else if (file.size > MAX_INBAND_ATTACHMENT_SIZE) {
        // Too large to send inband - uploading out of band and sending as a link.
        let uploader = Tinode.getLargeFileHelper();
        if (!uploader) {
          this.props.onError("Cannot initiate file upload.");
          return;
        }
        // Format data and initiate upload.
        let uploadCompletionPromise = uploader.upload(file);
        let msg = Drafty.attachFile(null, file.type, null, file.name, file.size, uploadCompletionPromise);
        // Pass data and the uploader to the TinodeWeb.
        this.props.sendMessage(msg, uploadCompletionPromise, uploader);
      } else {
        // Small enough to send inband.
        fileToBase64(file,
          (mime, bits, fname) => {
            this.props.sendMessage(Drafty.attachFile(null, mime, bits, fname));
          },
          this.props.onError
        );
      }
    }
    // Clear the value so the same file can be uploaded again.
    e.target.value = '';
  }

  handleSend() {
    var message = this.state.message.trim();
    if (message) {
      this.props.sendMessage(this.state.message.trim());
      this.setState({message: ''});
    }
  }

  /* Send on Enter key */
  handleKeyPress(e) {
    // Remove this if you don't want Enter to trigger send
    if (e.key === 'Enter') {
      // Have Shift-Enter insert a line break instead
      if (!e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();

        this.handleSend();
      }
    }
  }

  handleMessageTyping(e) {
    var newState = {message: e.target.value};
    var now = new Date().getTime();
    if (now - this.state.keypressTimestamp > KEYPRESS_DELAY) {
      var topic = Tinode.getTopic(this.props.topic);
      if (topic.isSubscribed()) {
        topic.noteKeyPress();
      }
      newState.keypressTimestamp = now;
    }
    this.setState(newState);
  }

  render() {
    var prompt = this.props.disabled ? "Messaging disabled" : "New message";
    var instance = this;
    return (
      <div id="send-message-panel">
        {this.props.disabled ?
          <i className="material-icons disabled">photo</i> :
          <a href="javascript:;" onClick={function(e) {instance.attachImage.click();}} title="Add image">
            <i className="material-icons secondary">photo</i>
          </a>}
        {this.props.disabled ?
          <i className="material-icons disabled">attach_file</i> :
          <a href="javascript:;" onClick={function(e) {instance.attachFile.click();}} title="Attach file">
            <i className="material-icons secondary">attach_file</i>
          </a>}
        <textarea id="sendMessage" placeholder={prompt}
          disabled={this.props.disabled} value={this.state.message}
          onChange={this.handleMessageTyping} onKeyPress={this.handleKeyPress}
          ref={function(ref) {instance.pasteFile = ref;}}
          autoFocus />
          {this.props.disabled ?
            <i className="material-icons disabled">send</i> :
            <a href="javascript:;" onClick={this.handleSend} title="Send"><i className="material-icons">send</i></a>}
      <input type="file" ref={function(ref) {instance.attachFile = ref;}}
        onChange={this.handleAttachFile} style={{display: 'none'}} />
      <input type="file" ref={function(ref) {instance.attachImage = ref;}} accept="image/*"
        onChange={this.handleAttachImage} style={{display: 'none'}} />
      </div>
    );
  }
};

/* This is just a static page to display when no conversation is selected. */
class LogoView extends React.PureComponent {
  render() {
    var version = Tinode.getVersion() + " build " + document.lastModified;
    return (
      <div id="dummy-view" className={this.props.hideSelf ? 'nodisplay' : null}>
        <div>
        <a href="https://github.com/tinode/chat/">
          <img id="logo" alt="logo" src="img/logo.svg" />
          <h2>Tinode Demo Chat</h2>
        </a>
        <p>Client: {version}</p>
        <p>Server: {this.props.serverVersion} ({this.props.serverAddress})</p>
        </div>
      </div>
    );
  }
};

class ImagePreview extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.setState({
      width: this.container.clientWidth,
      height: this.container.clientHeight
    });
  }

  render() {
    if (!this.props.content) {
      return null;
    }
    var instance = this;
    var dim = fitImageSize(this.props.content.width, this.props.content.height,
      this.state.width, this.state.height, false);
    var size = dim ? { width: dim.dstWidth + "px", height: dim.dstHeight + "px" } :
      ((this.props.content.width > this.props.content.height) ? {width: '100%'} : {height: '100%'});
    size.maxWidth = "100%";
    size.maxHeight = "100%";

    var filename = this.props.content.filename;
    var maxlength = (this.props.content.width / REM_SIZE) | 0;
    if (filename.length > maxlength) {
      filename = filename.slice(0, maxlength-2) + "..." + filename.slice(2-maxlength);
    }
    return (
      <div id="image-preview" onClick={this.props.onClose}>
        <div id="image-preview-caption-panel">
          <a href="javascript:;" download={this.props.content.filename}>
            <i className="material-icons">file_download</i> download
          </a>
          <a href="javascript:;" onClick={this.props.onClose}><i className="material-icons gray">close</i></a>
        </div>
        <div id="image-preview-container" ref={function(ref) {instance.container = ref;}}>
          <img src={this.props.content.url} style={size} />
        </div>
        <div id="image-preview-footer">
          <div><div><b>File name</b>:</div><div><span title={this.props.content.filename}>{filename}</span></div></div>
          <div><div><b>Content type</b>:</div><div>{this.props.content.type}</div></div>
          <div>
            <div><b>Size</b>:</div>
            <div>{this.props.content.width} &times; {this.props.content.height} px; {bytesToHumanSize(this.props.content.size)}</div>
          </div>
        </div>
      </div>
    );
  }
};
/* END Conversation panel */

/* The top-level class to hold all fuinctionality together */
class TinodeWeb extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.getBlankState();

    this.handleResize = this.handleResize.bind(this);
    this.handleHashRoute = this.handleHashRoute.bind(this);
    this.handleOnline = this.handleOnline.bind(this);
    this.handleAppVisibility = this.handleAppVisibility.bind(this);
    this.handleReadTimer = this.handleReadTimer.bind(this);
    this.handleVisibilityEvent = this.handleVisibilityEvent.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleLoginRequest = this.handleLoginRequest.bind(this);
    this.handleConnected = this.handleConnected.bind(this);
    this.doLogin = this.doLogin.bind(this);
    this.handleCredentialsRequest = this.handleCredentialsRequest.bind(this);
    this.handleLoginSuccessful = this.handleLoginSuccessful.bind(this);
    this.handleDisconnect = this.handleDisconnect.bind(this);
    this.tnMeMetaDesc = this.tnMeMetaDesc.bind(this);
    this.tnData = this.tnData.bind(this);
    this.tnInitFind = this.tnInitFind.bind(this);
    this.tnFndSubsUpdated = this.tnFndSubsUpdated.bind(this);
    this.handleSearchContacts = this.handleSearchContacts.bind(this);
    this.handleTopicSelected = this.handleTopicSelected.bind(this);
    this.handleTopicSelectedOnline = this.handleTopicSelectedOnline.bind(this);
    this.handleTopicSelectedAcs = this.handleTopicSelectedAcs.bind(this);
    this.handleHideMessagesView = this.handleHideMessagesView.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.handleNewAccount = this.handleNewAccount.bind(this);
    this.handleNewAccountRequest = this.handleNewAccountRequest.bind(this);
    this.handleUpdateAccountRequest = this.handleUpdateAccountRequest.bind(this);
    this.handleUpdateAccountTagsRequest = this.handleUpdateAccountTagsRequest.bind(this);
    this.handleSettings = this.handleSettings.bind(this);
    this.handleGlobalSettings = this.handleGlobalSettings.bind(this);
    this.handleSidepanelCancel = this.handleSidepanelCancel.bind(this);
    this.handleNewTopic = this.handleNewTopic.bind(this);
    this.handleNewTopicRequest = this.handleNewTopicRequest.bind(this);
    this.handleTopicUpdateRequest = this.handleTopicUpdateRequest.bind(this);
    this.handleChangePermissions = this.handleChangePermissions.bind(this);
    this.handleTagsUpdated = this.handleTagsUpdated.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleLeaveUnsubRequest = this.handleLeaveUnsubRequest.bind(this);
    this.handleDialogCancel = this.handleDialogCancel.bind(this);
    this.handleShowContextMenu = this.handleShowContextMenu.bind(this);
    this.defaultTopicContextMenu = this.defaultTopicContextMenu.bind(this);
    this.handleHideContextMenu = this.handleHideContextMenu.bind(this);
    this.handleShowInfoView = this.handleShowInfoView.bind(this);
    this.handleHideInfoView = this.handleHideInfoView.bind(this);
    this.handleMemberUpdateRequest = this.handleMemberUpdateRequest.bind(this);
    this.handleValidateCredentialsRequest = this.handleValidateCredentialsRequest.bind(this);

    this.handleHashRoute();
  }

  getBlankState() {
    let settings = localStorage.getObject("settings") || {};

    return {
      connected: false,
      transport: settings.transport || null,
      serverAddress: settings.serverAddress || detectServerAddress(),
      // "On" is the default, so saving the "off" state.
      messageSounds: !settings.messageSoundsOff,
      sidePanelSelected: 'login',
      sidePanelTitle: null,
      sidePanelAvatar: null,
      dialogSelected: null,
      contextMenuVisible: false,
      login: '',
      password: '',
      myUserId: null,
      errorText: '',
      errorLevel: null,
      liveConnection: navigator.onLine,
      topicSelected: '',
      topicSelectedOnline: false,
      topicSelectedAcs: null,
      loginDisabled: false,
      displayMobile: (window.innerWidth <= MEDIA_BREAKPOINT),
      showInfoPanel: false,
      mobilePanel: 'sidepanel',
      contextMenuVisible: false,
      contextMenuBounds: null,
      contextMenuClickAt: null,
      contextMenuParams: null,
      contextMenuItems: [],
      serverVersion: 'no connection',
      contactsSearchQuery: undefined,
      foundContacts: [],
      credMethod: undefined,
      credCode: undefined
    };
  }

  componentDidMount() {
    var instance = this;
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('online', function(e) { instance.handleOnline(true); });
    window.addEventListener('offline', function(e) { instance.handleOnline(false); });
    window.addEventListener('hashchange', this.handleHashRoute);
    // Window/tab visible or invisible for pausing timers.
    document.addEventListener("visibilitychange", this.handleVisibilityEvent);

    this.setState({viewportWidth: document.documentElement.clientWidth});

    Tinode.enableLogging(true, true);
    Tinode.onConnect = this.handleConnected;
    Tinode.onDisconnect = this.handleDisconnect;
    TinodeWeb.tnSetup(this.state.serverAddress, this.state.transport);
    var token;
    if (localStorage.getObject("keep-logged-in")) {
      token = localStorage.getObject("auth-token");
    }
    if (token) {
      // When reading from storage, date is returned as string.
      token.expires = new Date(token.expires);
      Tinode.setAuthToken(token);
      Tinode.connect().catch(function(err) {
        // Socket error
        instance.handleError(err.message, "err");
      });
      var parsed = parseUrlHash(window.location.hash);
      delete parsed.params.info;
      delete parsed.params.tab;
      parsed.path[0] = '';
      window.location.hash = composeUrlHash(parsed.path, parsed.params);
    } else {
      window.location.hash = "";
    }
    this.readTimer = null;
    this.readTimerCallback = null;
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('hashchange', this.handleHashRoute);
    document.removeEventListener("visibilitychange", this.handleVisibilityEvent);
  }

  // Setup transport (usually websocket) and server address. This will terminate connection with the server.
  static tnSetup(serverAddress, transport) {
    Tinode.setup(APP_NAME, serverAddress, API_KEY, transport);
  }

  handleResize() {
    var mobile = document.documentElement.clientWidth <= MEDIA_BREAKPOINT;
    this.setState({viewportWidth: document.documentElement.clientWidth});
    if (this.state.displayMobile != mobile) {
      this.setState({displayMobile: mobile});
    }
  }

  // Handle for hashchange event: display appropriate panels.
  handleHashRoute() {
    var hash = parseUrlHash(window.location.hash);
    // Left-side panel selector.
    if (hash.path && hash.path.length > 0) {
      if (['register','settings','edit','cred','newtpk','contacts',''].includes(hash.path[0])) {
        this.setState({sidePanelSelected: hash.path[0]});
      } else {
        console.log("Unknown sidepanel view", hash.path[0]);
      }
    } else {
      // Empty hashpath
      this.setState({sidePanelSelected: ''});
    }
    // Topic for MessagesView selector.
    if (hash.path.length > 1 && hash.path[1] != this.state.topicSelected) {
      var tp = Tinode.topicType(hash.path[1]);
      if (tp) {
        this.setState({
          topicSelected: hash.path[1],
          topicSelectedOnline: false,
          topicSelectedAcs: null
        });
      } else {
        this.setState({topicSelected: null});
      }
    }

    // Save validation credentials, if available.
    if (hash.params.method) {
      this.setState({ credMethod: hash.params.method });
    }
    if (hash.params.code) {
      this.setState({ credCode: hash.params.code });
    }

    // Additional parameters of panels.
    this.setState({
      showInfoPanel: hash.params.info,
      newTopicTabSelected: hash.params.tab
    });
  }

  handleOnline(online) {
    var newState = {liveConnection: online};
    if (online) {
      this.handleError("", null);
    } else {
      this.handleError("No connection", "warn");
    }
    this.setState({liveConnection: online});
  }

  // Handling read notifications here to be able to pause
  // them then the window/tab is not visible.
  handleAppVisibility(visible, callback) {
    clearTimeout(this.readTimer);
    this.readTimerCallback = callback;
    if (visible && callback) {
      this.readTimer = setTimeout(callback, READ_DELAY);
    } else {
      this.readTimer = null;
    }
  }

  handleReadTimer(callback) {
    this.handleAppVisibility(!document.hidden, callback);
  }

  handleVisibilityEvent() {
    this.handleAppVisibility(!document.hidden, this.readTimerCallback);
  }

  handleError(err, level) {
    this.setState({errorText: err, errorLevel: level});
  }

  // User clicked Login button in the side panel.
  handleLoginRequest(login, password) {
    this.setState({loginDisabled: true, login: login, password: password});
    this.handleError("", null);

    if (Tinode.isConnected()) {
      this.doLogin(login, password, {meth: this.state.credMethod, resp: this.state.credCode});
    } else {
      Tinode.connect().catch((err) => {
        // Socket error
        this.setState({loginDisabled: false});
        this.handleError(err.message, "err");
      });
    }
  }

  // Connection succeeded.
  handleConnected() {
    var params = Tinode.getServerInfo();
    this.setState({
      serverVersion: params.ver + " " + (params.build ? params.build : "none") + "; "
    });
    this.doLogin(this.state.login, this.state.password, {meth: this.state.credMethod, resp: this.state.credCode});
  }

  doLogin(login, password, cred) {
    if (Tinode.isAuthenticated()) {
      // Already logged in. Go to default screen.
      window.location.hash = "";
      return;
    }

    cred = cred ? Tinode.addCredential(null, cred) : undefined;
    cred = cred ? cred.cred : undefined;

    // Try to login with login/password. If they are not available, try token. If no token, ask for login/password.
    let promise = null;
    let token = Tinode.getAuthToken();
    if (login && password) {
      this.setState({password: null});
      promise = Tinode.loginBasic(login, password, cred);
    } else if (token) {
      promise = Tinode.loginToken(token.token, cred);
    }

    if (promise) {
      promise.then((ctrl) => {
        if (ctrl.code >= 300 && ctrl.text === "validate credentials") {
          if (cred) {
            this.handleError("Code does not match", "warn");
          }
          this.handleCredentialsRequest(ctrl.params);
        } else {
          this.handleLoginSuccessful(this);
        }
      }).catch((err) => {
        // Login failed, report error.
        this.setState({loginDisabled: false, credMethod: undefined, credCode: undefined});
        this.handleError(err.message, "err");
        localStorage.removeItem("auth-token");
        window.location.hash = "";
      });
    } else {
      // No login credentials provided.
      // Make sure we are on the login page.
      window.location.hash = "";
      this.setState({loginDisabled: false});
    }
  }

  handleCredentialsRequest(params) {
    var parsed = parseUrlHash(window.location.hash);
    parsed.path[0] = 'cred';
    parsed.params['method'] = params.cred[0];
    window.location.hash = composeUrlHash(parsed.path, parsed.params);
  }

  handleLoginSuccessful(instance) {
    instance.handleError("", null);

    // Refresh authentication token.
    if (localStorage.getObject("keep-logged-in")) {
      localStorage.setObject("auth-token", Tinode.getAuthToken());
    }
    // Logged in fine, subscribe to 'me' attaching callbacks from the contacts view.
    var me = Tinode.getMeTopic();
    me.onMetaDesc = instance.tnMeMetaDesc;
    instance.setState({
      connected: true,
      credMethod: undefined,
      credCode: undefined,
      myUserId: Tinode.getCurrentUserID()
    });
    // Subscribe, fetch topic desc, the list of subscriptions. Messages are not fetched.
    me.subscribe(
      me.startMetaQuery().
        withLaterSub().
        withDesc().
        build()
      ).catch(function(err){
        localStorage.removeItem("auth-token");
        instance.handleError(err.message, "err");
        window.location.hash = "";
      });
    window.location.hash = setUrlSidePanel(window.location.hash, 'contacts');
  }

  handleDisconnect(err) {
    this.setState({
      connected: false,
      topicSelectedOnline: false,
      dialogSelected: null,
      errorText: err && err.message ? err.message : 'Disconnected',
      errorLevel: err && err.message ? "err" : "warn",
      loginDisabled: false,
      contextMenuVisible: false,
      serverVersion: 'no connection'
    });
  }

  tnMeMetaDesc(desc) {
    if (desc && desc.public) {
      this.setState({
        sidePanelTitle: desc.public.fn,
        sidePanelAvatar: makeImageUrl(desc.public.photo)
      });
    }
  }

  // Sending "received" notifications
  tnData(data) {
    let topic = Tinode.getTopic(data.topic);
    if (topic.msgStatus(data) > Tinode.MESSAGE_STATUS_SENDING) {
      clearTimeout(this.receivedTimer);
      this.receivedTimer = setTimeout(() => {
        this.receivedTimer = undefined;
        topic.noteRecv(data.seq);
      }, RECEIVED_DELAY);
    }
  }

  /* Fnd topic: find contacts by tokens */
  tnInitFind() {
    var fnd = Tinode.getFndTopic();
    if (fnd.isSubscribed()) {
      this.setState({contactsSearchQuery: ''});
      this.tnFndSubsUpdated();
    } else {
      fnd.onSubsUpdated = this.tnFndSubsUpdated;
      fnd.subscribe(fnd.startMetaQuery().withSub().withTags().build()).catch((err) => {
        this.handleError(err.message, "err");
      });
    }
  }

  tnFndSubsUpdated() {
    var contacts = [];
    // Don't attempt to create P2P topics which already exist. Server will reject the duplicates.
    Tinode.getFndTopic().contacts(function(s) {
      contacts.push(s);
    });
    this.setState({foundContacts: contacts});
  }

  /** Called when the user enters a contact into the contact search field in the NewAccount panel
    @param query {Array} is an array of contacts to search for
   */
  handleSearchContacts(query) {
    var fnd = Tinode.getFndTopic();
    this.setState({contactsSearchQuery: query == DEL_CHAR ? '' : query});
    fnd.setMeta({desc: {public: query}}).then((ctrl) => {
      return fnd.getMeta(fnd.startMetaQuery().withSub().build());
    }).catch((err) => {
      this.handleError(err.message, "err");
    });
  }

  // User clicked on a contact in the side panel or deleted a contact.
  handleTopicSelected(topicName, unused_index, online, acs) {
    if (topicName) {
      // Contact selected
      if (this.state.topicSelected != topicName) {
        window.location.hash = setUrlTopic(window.location.hash, topicName);
      }
      this.setState({
        errorText: '',
        errorLevel: null,
        mobilePanel: 'topic-view',
        topicSelectedOnline: online,
        topicSelectedAcs: acs,
        showInfoPanel: false
      });
    } else {
      if (this.state.topicSelected) {
        window.location.hash = setUrlTopic(window.location.hash, null);
      }
      // Currently selected contact deleted
      this.setState({
        errorText: '',
        errorLevel: null,
        mobilePanel: 'sidepanel',
        topicSelectedOnline: false,
        topicSelectedAcs: null,
        showInfoPanel: false
      });
    }
  }

  handleTopicSelectedOnline(online) {
    if (typeof online == 'boolean') {
      this.setState({topicSelectedOnline: online});
    }
  }
  // Permissions of a currently selected topic have been updated by server.
  handleTopicSelectedAcs(acs) {
    this.setState({topicSelectedAcs: acs});
  }

  // In mobile view user requested to show sidepanel
  handleHideMessagesView() {
    this.setState({
      mobilePanel: 'sidepanel'
    });
    window.location.hash = setUrlTopic(window.location.hash, null);
  }

  // User is sending a message, either plain text or a drafty object with attachments.
  handleSendMessage(msg, promise, uploader) {
    let topic = Tinode.getTopic(this.state.topicSelected);
    let dft = Drafty.parse(msg);
    if (dft && !Drafty.isPlainText(dft)) {
      msg = dft;
    }
    msg = topic.createMessage(msg);
    msg._uploader = uploader;

    if (promise) {
      promise.catch((err) => {
        this.handleError(err.message, "err");
      });
    }
    if (!topic.isSubscribed()) {
      if (!promise) {
        promise = Promise.resolve();
      }
      promise = promise.then(() => { return topic.subscribe(); });
    }
    topic.publishDraft(msg, promise)
      .catch((err) => {
        this.handleError(err.message, "err");
      });
  }

  // User chose a Sign Up menu item.
  handleNewAccount() {
    window.location.hash = setUrlSidePanel(window.location.hash, 'register');
  }

  // Actual registration of a new account.
  handleNewAccountRequest(login_, password_, public_, cred_, tags_) {
    Tinode.connect(this.state.serverAddress)
      .then(function() {
        var params = Tinode.addCredential({public: public_, tags: tags_}, cred_);
        return Tinode.createAccountBasic(login_, password_, params);
      }).then((ctrl) => {
        if (ctrl.code >= 300 && ctrl.text === "validate credentials") {
          this.handleCredentialsRequest(ctrl.params);
        } else {
          this.handleLoginSuccessful(this);
        }
      }).catch((err) => {
        this.handleError(err.message, "err");
      });
  }

  handleUpdateAccountRequest(password, pub, priv) {
    var instance = this;
    if (pub || priv) {
      Tinode.getMeTopic().setMeta({desc: {public: pub, private: priv}}).catch(function(err) {
        instance.handleError(err.message, "err");
      });
    }
    if (password) {
      Tinode.updateAccountBasic(null, Tinode.getCurrentLogin(), password).catch(function(err) {
        instance.handleError(err.message, "err");
      });
    }
  }

  handleUpdateAccountTagsRequest(tags) {
    var instance = this;
    Tinode.getFndTopic().setMeta({tags: tags})
      .catch(function(err) {
        instance.handleError(err.message, "err");
      });
  }

  // User chose Settings menu item.
  handleSettings() {
    window.location.hash = setUrlSidePanel(window.location.hash, this.state.myUserId ? 'edit' : 'settings');
  }

  // User updated global parameters.
  handleGlobalSettings(serverAddress, transport, messageSounds) {
    transport = transport || this.state.transport;
    serverAddress = serverAddress || this.state.serverAddress;
    messageSounds = (typeof messageSounds == 'boolean') ? messageSounds : this.state.messageSounds;

    this.setState({
      serverAddress: serverAddress,
      transport: transport,
      messageSounds: messageSounds,
      sidePanelSelected: 'login'
    });
    localStorage.setObject({
      serverAddress: serverAddress,
      messageSoundsOff: !messageSounds,
      transport: this.state.transport
    });
    TinodeWeb.tnSetup(serverAddress, transport);
  }

  // User clicked Cancel button in Setting or Sign Up panel.
  handleSidepanelCancel() {
    var parsed = parseUrlHash(window.location.hash);
    parsed.path[0] = this.state.myUserId ? 'contacts' : '';
    if (parsed.params) {
      delete parsed.params.code;
      delete parsed.params.method;
      delete parsed.params.tab;
    }
    window.location.hash = composeUrlHash(parsed.path, parsed.params);
    this.setState({errorText: '', errorLevel: null});
  }

  // User clicked a (+) menu item.
  handleNewTopic() {
    window.location.hash = setUrlSidePanel(window.location.hash, 'newtpk');
  }

  // Create of a new topic. New P2P topic requires peer's name.
  handleNewTopicRequest(peerName, pub, priv, tags) {
    var instance = this;
    var topic = peerName ? Tinode.newTopicWith(peerName) : Tinode.newTopic();
    var query = topic.startMetaQuery().withDesc().withSub().withData();
    var setParams;
    if (!peerName) {
      // Creator is the owner, has access to tags.
      // Fetch default group topic tags, if any.
      query = query.withTags();
      setParams = {desc: {public: pub, private: priv}, tags: tags};
    }
    topic.subscribe(query.build(), setParams).then(function() {
      window.location.hash = setUrlSidePanel(window.location.hash, 'contacts');
      instance.handleTopicSelected(topic.name, undefined, Tinode.isTopicOnline(topic.name), topic.getAccessMode());
    }).catch(function(err) {
      instance.handleError(err.message, "err");
    });
  }

  handleTopicUpdateRequest(topicName, pub, priv, permissions) {
    var instance = this;
    var topic = Tinode.getTopic(topicName);
    if (topic) {
      var params = {};
      if (pub) {
        params.public = pub;
      }
      if (priv) {
        params.private = {comment: priv};
      }
      if (permissions) {
        params.defacs = permissions;
      }
      topic.setMeta({desc: params}).catch(function(err) {
        instance.handleError(err.message, "err");
      });
    }
  }

  handleChangePermissions(topicName, mode, uid) {
    var instance = this;
    var topic = Tinode.getTopic(topicName);
    if (topic) {
      var am = topic.getAccessMode();
      if (uid) {
        am.updateGiven(mode);
        mode = am.getGiven();
      } else {
        am.updateWant(mode);
        mode = am.getWant();
      }
      topic.setMeta({sub: {user: uid, mode: mode}}).catch(function(err) {
        instance.handleError(err.message, "err");
      });
    }
  }

  handleTagsUpdated(topicName, tags) {
    var topic = Tinode.getTopic(topicName);
    if (topic) {
      var instance = this;
      topic.setMeta({tags: tags}).catch(function(err) {
        instance.handleError(err.message, "err");
      });
    }
  }

  handleLogout() {
    localStorage.removeItem("auth-token");
    this.setState(this.getBlankState());
    TinodeWeb.tnSetup(this.state.serverAddress, this.state.transport);
    window.location.hash = "";
  }

  handleLeaveUnsubRequest(topicName) {
    var topic = Tinode.getTopic(topicName);
    if (!topic) {
      return;
    }

    topic.leave(true).then((ctrl) => {
      // Hide MessagesView and InfoView panels.
      window.location.hash = setUrlTopic(window.location.hash, '');
    }).catch((err) => {
      this.handleError(err.message, "err");
    });
  }

  handleDialogCancel() {
    this.setState({dialogSelected: null});
  }

  handleShowContextMenu(params, menuItems) {
    this.setState({
      contextMenuVisible: true,
      contextMenuClickAt: {x: params.x, y: params.y},
      contextMenuParams: params,
      contextMenuItems: menuItems || this.defaultTopicContextMenu(params.topicName),
      contextMenuBounds: ReactDOM.findDOMNode(this).getBoundingClientRect()
    });
  }

  defaultTopicContextMenu(topicName) {
    var muted = false, blocked = false, subscribed = false, deleter = false;
    var topic = Tinode.getTopic(topicName);
    if (topic) {
      if (topic.isSubscribed()) {
        subscribed = true;
        var acs = topic.getAccessMode();
        muted = acs && acs.isMuted();
        blocked = acs && !acs.isJoiner();
        deleter = acs && acs.isDeleter();
      }
    }

    return [
      subscribed ? {title: "Info", handler: this.handleShowInfoView} : null,
      subscribed ? ContextMenuItems["messages_clear"] : null,
      subscribed && deleter ? ContextMenuItems["messages_clear_hard"] : null,
      subscribed ? (muted ? ContextMenuItems["topic_unmute"] : ContextMenuItems["topic_mute"]) : null,
      subscribed ? (blocked ? ContextMenuItems["topic_unblock"] : ContextMenuItems["topic_block"]) : null,
      ContextMenuItems["topic_delete"]
    ];
  }

  handleHideContextMenu() {
    this.setState({
      contextMenuVisible: false,
      contextMenuClickAt: null,
      contextMenuParams: null,
      contextMenuBounds: null
    });
  }

  handleShowInfoView() {
    window.location.hash = addUrlParam(window.location.hash, 'info', true);
    this.setState({showInfoPanel: true});
  }

  handleHideInfoView() {
    window.location.hash = removeUrlParam(window.location.hash, 'info');
    this.setState({showInfoPanel: false});
  }

  handleMemberUpdateRequest(topicName, added, removed) {
    if (!topicName) {
      return;
    }

    var topic = Tinode.getTopic(topicName);
    if (!topic) {
      return;
    }

    var instance = this;

    if (added && added.length > 0) {
      added.map(function(uid) {
        topic.invite(uid, null).catch(function(err) {
          instance.handleError(err.message, "err");
        });
      });
    }

    if (removed && removed.length > 0) {
      removed.map(function(uid) {
        topic.delSubscription(uid).catch(function(err) {
          instance.handleError(err.message, "err");
        });
      });
    }
  }

  handleValidateCredentialsRequest(cred, code) {
    this.setState({credMethod: cred, credCode: code});
    this.doLogin(null, null, {meth: cred, resp: code});
  }

  render() {
    return (
      <div id="app-container">
        <ContextMenu
          bounds={this.state.contextMenuBounds}
          clickAt={this.state.contextMenuClickAt}
          visible={this.state.contextMenuVisible}
          params={this.state.contextMenuParams}
          items={this.state.contextMenuItems}
          hide={this.handleHideContextMenu}
          onAction={this.handleContextMenuAction}
          onError={this.handleError} />

        <SidepanelView
          connected={this.state.connected}
          displayMobile={this.state.displayMobile}
          hideSelf={this.state.displayMobile && this.state.mobilePanel !== 'sidepanel'}
          state={this.state.sidePanelSelected}
          title={this.state.sidePanelTitle}
          avatar={this.state.sidePanelAvatar}
          login={this.state.login}
          myUserId={this.state.myUserId}
          loginDisabled={this.state.loginDisabled}
          errorText={this.state.errorText}
          errorLevel={this.state.errorLevel}
          topicSelected={this.state.topicSelected}
          credMethod={this.state.credMethod}
          credCode={this.state.credCode}

          transport={this.state.transport}
          messageSounds={this.state.messageSounds}
          serverAddress={this.state.serverAddress}
          onGlobalSettings={this.handleGlobalSettings}

          onSignUp={this.handleNewAccount}
          onSettings={this.handleSettings}
          onLoginRequest={this.handleLoginRequest}
          onCreateAccount={this.handleNewAccountRequest}
          onUpdateAccount={this.handleUpdateAccountRequest}
          onUpdateAccountTags={this.handleUpdateAccountTagsRequest}
          onTopicSelected={this.handleTopicSelected}
          onCreateTopic={this.handleNewTopicRequest}
          onNewTopic={this.handleNewTopic}
          onLogout={this.handleLogout}
          onCancel={this.handleSidepanelCancel}
          onOnlineChange={this.handleTopicSelectedOnline}
          onAcsChange={this.handleTopicSelectedAcs}
          onError={this.handleError}
          onValidateCredentials={this.handleValidateCredentialsRequest}

          onInitFind={this.tnInitFind}
          contactsSearchQuery={this.state.contactsSearchQuery}
          foundContacts={this.state.foundContacts}
          onSearchContacts={this.handleSearchContacts}

          showContextMenu={this.handleShowContextMenu} />

        <MessagesView
          connected={this.state.connected}
          online={this.state.topicSelectedOnline}
          acs={this.state.topicSelectedAcs}
          displayMobile={this.state.displayMobile}
          viewportWidth={this.state.viewportWidth}
          hideSelf={this.state.displayMobile &&
            (this.state.mobilePanel !== 'topic-view' || this.state.showInfoPanel)}
          topic={this.state.topicSelected}
          myUserId={this.state.myUserId}
          serverVersion={this.state.serverVersion}
          serverAddress={this.state.serverAddress}
          errorText={this.state.errorText}
          errorLevel={this.state.errorLevel}

          onHideMessagesView={this.handleHideMessagesView}
          onData={this.tnData}
          onError={this.handleError}
          readTimerHandler={this.handleReadTimer}
          showContextMenu={this.handleShowContextMenu}
          sendMessage={this.handleSendMessage} />

        {this.state.showInfoPanel ?
          <InfoView
            connected={this.state.connected}
            displayMobile={this.state.displayMobile}
            topic={this.state.topicSelected}
            foundContacts={this.state.foundContacts}
            myUserId={this.state.myUserId}
            errorText={this.state.errorText}
            errorLevel={this.state.errorLevel}

            onTopicDescUpdate={this.handleTopicUpdateRequest}
            onCancel={this.handleHideInfoView}
            onChangePermissions={this.handleChangePermissions}
            onMemberUpdateRequest={this.handleMemberUpdateRequest}
            onLeaveTopic={this.handleLeaveUnsubRequest}
            onAddMember={this.handleManageGroupMembers}
            onTopicTagsUpdate={this.handleTagsUpdated}
            onInitFind={this.tnInitFind}
            onError={this.handleError}

            showContextMenu={this.handleShowContextMenu}
            />
          :
          null
        }
      </div>
    );
  }
};

ReactDOM.render(
  <TinodeWeb />,
  document.getElementById('mountPoint')
);

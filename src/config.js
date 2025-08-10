import { PACKAGE_VERSION } from './version.js';

// Name of this application, used in the User-Agent.
export const APP_NAME = 'TinodeWeb/' + (PACKAGE_VERSION || '0.24');

// API key. Use https://github.com/tinode/chat/tree/master/keygen to generate your own
export const API_KEY = 'AQEAAAABAAD_rAp4DJh05a1HAwFT3A6K';

// The array of possible hosts to connect to.
export const KNOWN_HOSTS = {hosted: 'web.tinode.co', local: 'localhost:6060'};

// Default host name and port to connect to.
export const DEFAULT_HOST = KNOWN_HOSTS.hosted;

// Enable console logging.
export const LOGGING_ENABLED = true;

// Minimum time between two keypress notifications, milliseconds.
export const KEYPRESS_DELAY = 3_000;
// Delay before sending a read notification, milliseconds.
export const READ_DELAY = 1_500;

// The default shortest allowed tag length. Matches the value on the server.
export const MIN_TAG_LENGTH = 2;
// The default greatest allowed tag length. Matches the value on the server.
export const MAX_TAG_LENGTH = 96;
// The default maximum number of tags allowed. Matches the value on the server.
export const MAX_TAG_COUNT = 16;

// Access mode for P2P subscriptions initiated by the current user.
export const DEFAULT_P2P_ACCESS_MODE = 'JRWPS';
// Access mode for new group topics created by the current user.
export const NEW_GRP_ACCESS_MODE = 'JRWPSAO';
// Access mode for a channel.
export const CHANNEL_ACCESS_MODE = 'JR';

// Access mode for no access.
export const NO_ACCESS_MODE = 'N';

// Mediaquery breakpoint between desktop and mobile, in px. Should match the value
// in @media (max-size: 640px) in base.css
export const MEDIA_BREAKPOINT = 640;
// Size of css 'rem' unit in pixels. Default 1rem = 10pt = 13px.
export const REM_SIZE = 13;

// Size of the avatar image: when image dimensions are greater or the image is not square, it's resized to
// a square of this size or less.
export const AVATAR_SIZE = 384;

// Maximum size of an avatar in bytes for sending in-band. Bigger avatars will be sent out of band (as uploads).
export const MAX_AVATAR_BYTES = 4096;

// Size of the broken_image shown in MessagesView
export const BROKEN_IMAGE_SIZE = 32;

// Size of video preview when dimensions are missing.
export const NO_DIMENSIONS_VIDEO = 128;

// Number of chat messages to fetch in one call.
export const MESSAGES_PAGE = 24;

// Default maximum in-band (included directly into the message) attachment size which fits into
// a message of 256K in size. Used when the server-provided value is unavailable. The actual
// binary size of the attachment should be smaller due to base64 encoding expansion and some overhead,
// for instance 1024 bytes.
// Increase this limit to a greater value in production, if desired. Also increase
// max_message_size in the server config.
export const MAX_INBAND_ATTACHMENT_SIZE = 262_144;

// Default absolute maximum attachment size to be used with the server = 8MB.
// Used when the server-provided value is unavailable. Increase to something like 100MB in production.
export const MAX_EXTERN_ATTACHMENT_SIZE = 1 << 23;

// Maximum allowed linear dimension (pixels) of an image sent inline. Larger images will be shrunk
// to make the larger dimension fit under this size. You may want to adjust it to 1600 or
// 2400 for production.
export const MAX_IMAGE_DIM = 1024;

// Linear dimensions of image preview: shrink image under this size for previews.
export const IMAGE_PREVIEW_DIM = 64;

// Linear dimensions of video screencapture: shrink image under this size for previews.
export const VIDEO_PREVIEW_DIM = 96;

// Linear dimensions of image thumbnail: shrink image under this size for thumbnails in reply quote previews.
export const IMAGE_THUMBNAIL_DIM = 36;
// Width of video thumbnail: allow it to be wider, but not taller. Use IMAGE_THUMBNAIL_DIM for height.
export const VIDEO_THUMBNAIL_WIDTH = 48;

// Maximum number of online users to be shown in a topic title bar. Others will be
// hidden under "+X more"
export const MAX_ONLINE_IN_TOPIC = 4;

// Maximum length of user name, topic title, and private comment.
export const MAX_TITLE_LENGTH = 60;
// Maximum length of topic description.
export const MAX_TOPIC_DESCRIPTION_LENGTH = 360;
// Maximum length of user name when displaying a video call.
export const MAX_PEER_TITLE_LENGTH = 24;

// Length of message previews in chat list, in characters.
export const MESSAGE_PREVIEW_LENGTH = 80;

// Length of a quote in quoted reply (for outgoing messages).
export const QUOTED_REPLY_LENGTH = 30;
// Length of a preview of a forwarded message.
export const FORWARDED_PREVIEW_LENGTH = 84;
// Length of preview for a message being edited.
export const EDIT_PREVIEW_LENGTH = 48;

// Minimum duration of an audio recording in milliseconds (2 sec).
export const MIN_DURATION = 2_000;
// Maximum duration of an audio recording in milliseconds (10 min).
export const MAX_DURATION = 600_000;

// Link for "Contact Us".
export const LINK_CONTACT_US = 'mailto:support@tinode.co';

// Link to Privacy Policy.
export const LINK_PRIVACY_POLICY = 'https://tinode.co/privacy.html';

// Link to Terms of Service.
export const LINK_TERMS_OF_SERVICE = 'https://tinode.co/terms.html';

// When user starts a P2P topic, automatic subscription does not
// happen until the first message. Setting this option to true enables
// immediate subscription.
export const IMMEDIATE_P2P_SUBSCRIPTION = false;

// URL schemes permitted to appear in links (i.e. no javascript: scheme).
export const CLICKABLE_URL_SCHEMES = ['http', 'https', 'ftp', 'ftps'];

// Size of the QR code in the app.
export const QRCODE_SIZE = 128;

// How much time has to pass to consider computer awoken from sleep (80 sec).
// Chrome throttles ticker events in inactive tabs to once per minute. This
// value ensures that these once-a-minute events do not trigger a reconnect.
export const WAKE_UP_TIMEOUT = 80000;
// Timer interval between checks if computer woke up from sleep (1 sec).
export const WAKE_UP_TICK = 1000;

// Swipe distance to register as a gesture, in pixels.
export const MIN_SWIPE_DISTANCE = REM_SIZE * 3;

// Self-topic avatar as an SVG icon encoded as data URI
export const SELF_AVATAR_URI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZpZXdCb3g9IjAgMCAxNyAxNyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMy41NjIgMXYxNS40NTlsNC42ODYtMy4yNyA0Ljc1MiAzLjI2di0xNS40NDloLTkuNDM4ek0xMiAxNC41NTFsLTMuNzU2LTIuNTc4LTMuNjgxIDIuNTY4di0xMi41NDFoNy40Mzd2MTIuNTUxeiIgZmlsbD0iIzU1NTU1NSIgLz48L3N2Zz4=' // eslint-disable-line max-len

// Toast display duration, milliseconds.
export const TOAST_DURATION = 3_000;

// MIME type for the legacy Drafty form-response data.
export const DRAFTY_FR_MIME_TYPE_LEGACY = 'application/json'; // Remove in 2026.

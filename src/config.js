import { PACKAGE_VERSION } from './version.js';

// Name of this application, used in the User-Agent.
export const APP_NAME = 'TinodeWeb/' + (PACKAGE_VERSION || '0.16');

// API key. Use https://github.com/tinode/chat/tree/master/keygen to generate your own
export const API_KEY = 'AQEAAAABAAD_rAp4DJh05a1HAwFT3A6K';

// The array of possible hosts to connect to.
export const KNOWN_HOSTS = {hosted: 'web.tinode.co', local: 'localhost:6060'};

// Default host name and port to connect to.
export const DEFAULT_HOST = KNOWN_HOSTS.hosted;

// Enable console logging.
export const LOGGING_ENABLED = true;

// Minimum time between two keypress notifications, milliseconds.
export const KEYPRESS_DELAY = 3*1000;
// Delay before sending a {note} for reciving a message, milliseconds.
export const RECEIVED_DELAY = 500;
// Delay before sending a read notification, milliseconds.
export const READ_DELAY = 1000;

// The shortest allowed tag length. Matches the value on the server.
export const MIN_TAG_LENGTH = 4;

// Access mode for P2P subscriptions initiated by the current user.
export const DEFAULT_P2P_ACCESS_MODE = 'JRWPS';
// Access mode for new group topics created by the current user.
export const NEW_GRP_ACCESS_MODE = 'JRWPSAO';

// Access mode for no access.
export const NO_ACCESS_MODE = 'N';

// Mediaquery breakpoint between desktop and mobile, in px. Should match the value
// in @media (max-size: 640px) in base.css
export const MEDIA_BREAKPOINT = 640;
// Size of css 'rem' unit in pixels. Default 1rem = 10pt = 13px.
export const REM_SIZE = 13;

// Size of the avatar image: When an avatar image is uploaded, it's resized to
// a square of this size.
export const AVATAR_SIZE = 128;

// Size of the broken_image shown in MessagesView
export const BROKEN_IMAGE_SIZE = 32;

// Number of chat messages to fetch in one call.
export const MESSAGES_PAGE = 24;

// Maximum in-band (included directly into the message) attachment size which fits into
// a message of 256K in size, assuming base64 encoding and 1024 bytes of overhead.
// This is size of an object *before* base64 encoding is applied.
// Increase this limit to a greater value in production, if desired. Also increase
// max_message_size in server config.
//  MAX_INBAND_ATTACHMENT_SIZE = base64DecodedLen(max_message_size - overhead);
export const MAX_INBAND_ATTACHMENT_SIZE = 195840;

// Absolute maximum attachment size to be used with the server = 8MB. Increase to
// something like 100MB in production.
export const MAX_EXTERN_ATTACHMENT_SIZE = 1 << 23;

// Maximum allowed linear dimension of an inline image in pixels. You may want
// to adjust it to 1600 or 2400 for production.
export const MAX_IMAGE_DIM = 768;

// Maximum number of online users to be shown in a topic title bar. Others will be
// hidden under "+X more"
export const MAX_ONLINE_IN_TOPIC = 4;

// Maximum length of user name, topic title, and private comment.
export const MAX_TITLE_LENGTH = 60;

// Link for "Contact Us".
export const LINK_CONTACT_US = 'email:info@tinode.co';

// Link to Privacy Policy.
export const LINK_PRIVACY_POLICY = 'https://tinode.co/privacy.html';

// Link to Terms of Service.
export const LINK_TERMS_OF_SERVICE = 'https://tinode.co/terms.html';

/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@firebase/util/dist/index.esm.js":
/*!*******************************************************!*\
  !*** ./node_modules/@firebase/util/dist/index.esm.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CONSTANTS: function() { return /* binding */ CONSTANTS; },
/* harmony export */   DecodeBase64StringError: function() { return /* binding */ DecodeBase64StringError; },
/* harmony export */   Deferred: function() { return /* binding */ Deferred; },
/* harmony export */   ErrorFactory: function() { return /* binding */ ErrorFactory; },
/* harmony export */   FirebaseError: function() { return /* binding */ FirebaseError; },
/* harmony export */   MAX_VALUE_MILLIS: function() { return /* binding */ MAX_VALUE_MILLIS; },
/* harmony export */   RANDOM_FACTOR: function() { return /* binding */ RANDOM_FACTOR; },
/* harmony export */   Sha1: function() { return /* binding */ Sha1; },
/* harmony export */   areCookiesEnabled: function() { return /* binding */ areCookiesEnabled; },
/* harmony export */   assert: function() { return /* binding */ assert; },
/* harmony export */   assertionError: function() { return /* binding */ assertionError; },
/* harmony export */   async: function() { return /* binding */ async; },
/* harmony export */   base64: function() { return /* binding */ base64; },
/* harmony export */   base64Decode: function() { return /* binding */ base64Decode; },
/* harmony export */   base64Encode: function() { return /* binding */ base64Encode; },
/* harmony export */   base64urlEncodeWithoutPadding: function() { return /* binding */ base64urlEncodeWithoutPadding; },
/* harmony export */   calculateBackoffMillis: function() { return /* binding */ calculateBackoffMillis; },
/* harmony export */   contains: function() { return /* binding */ contains; },
/* harmony export */   createMockUserToken: function() { return /* binding */ createMockUserToken; },
/* harmony export */   createSubscribe: function() { return /* binding */ createSubscribe; },
/* harmony export */   decode: function() { return /* binding */ decode; },
/* harmony export */   deepCopy: function() { return /* binding */ deepCopy; },
/* harmony export */   deepEqual: function() { return /* binding */ deepEqual; },
/* harmony export */   deepExtend: function() { return /* binding */ deepExtend; },
/* harmony export */   errorPrefix: function() { return /* binding */ errorPrefix; },
/* harmony export */   extractQuerystring: function() { return /* binding */ extractQuerystring; },
/* harmony export */   generateSHA256Hash: function() { return /* binding */ generateSHA256Hash; },
/* harmony export */   getDefaultAppConfig: function() { return /* binding */ getDefaultAppConfig; },
/* harmony export */   getDefaultEmulatorHost: function() { return /* binding */ getDefaultEmulatorHost; },
/* harmony export */   getDefaultEmulatorHostnameAndPort: function() { return /* binding */ getDefaultEmulatorHostnameAndPort; },
/* harmony export */   getDefaults: function() { return /* binding */ getDefaults; },
/* harmony export */   getExperimentalSetting: function() { return /* binding */ getExperimentalSetting; },
/* harmony export */   getGlobal: function() { return /* binding */ getGlobal; },
/* harmony export */   getModularInstance: function() { return /* binding */ getModularInstance; },
/* harmony export */   getUA: function() { return /* binding */ getUA; },
/* harmony export */   isAdmin: function() { return /* binding */ isAdmin; },
/* harmony export */   isBrowser: function() { return /* binding */ isBrowser; },
/* harmony export */   isBrowserExtension: function() { return /* binding */ isBrowserExtension; },
/* harmony export */   isCloudWorkstation: function() { return /* binding */ isCloudWorkstation; },
/* harmony export */   isCloudflareWorker: function() { return /* binding */ isCloudflareWorker; },
/* harmony export */   isElectron: function() { return /* binding */ isElectron; },
/* harmony export */   isEmpty: function() { return /* binding */ isEmpty; },
/* harmony export */   isIE: function() { return /* binding */ isIE; },
/* harmony export */   isIndexedDBAvailable: function() { return /* binding */ isIndexedDBAvailable; },
/* harmony export */   isMobileCordova: function() { return /* binding */ isMobileCordova; },
/* harmony export */   isNode: function() { return /* binding */ isNode; },
/* harmony export */   isNodeSdk: function() { return /* binding */ isNodeSdk; },
/* harmony export */   isReactNative: function() { return /* binding */ isReactNative; },
/* harmony export */   isSafari: function() { return /* binding */ isSafari; },
/* harmony export */   isSafariOrWebkit: function() { return /* binding */ isSafariOrWebkit; },
/* harmony export */   isUWP: function() { return /* binding */ isUWP; },
/* harmony export */   isValidFormat: function() { return /* binding */ isValidFormat; },
/* harmony export */   isValidTimestamp: function() { return /* binding */ isValidTimestamp; },
/* harmony export */   isWebWorker: function() { return /* binding */ isWebWorker; },
/* harmony export */   issuedAtTime: function() { return /* binding */ issuedAtTime; },
/* harmony export */   jsonEval: function() { return /* binding */ jsonEval; },
/* harmony export */   map: function() { return /* binding */ map; },
/* harmony export */   ordinal: function() { return /* binding */ ordinal; },
/* harmony export */   pingServer: function() { return /* binding */ pingServer; },
/* harmony export */   promiseWithTimeout: function() { return /* binding */ promiseWithTimeout; },
/* harmony export */   querystring: function() { return /* binding */ querystring; },
/* harmony export */   querystringDecode: function() { return /* binding */ querystringDecode; },
/* harmony export */   safeGet: function() { return /* binding */ safeGet; },
/* harmony export */   stringLength: function() { return /* binding */ stringLength; },
/* harmony export */   stringToByteArray: function() { return /* binding */ stringToByteArray; },
/* harmony export */   stringify: function() { return /* binding */ stringify; },
/* harmony export */   validateArgCount: function() { return /* binding */ validateArgCount; },
/* harmony export */   validateCallback: function() { return /* binding */ validateCallback; },
/* harmony export */   validateContextObject: function() { return /* binding */ validateContextObject; },
/* harmony export */   validateIndexedDBOpenable: function() { return /* binding */ validateIndexedDBOpenable; },
/* harmony export */   validateNamespace: function() { return /* binding */ validateNamespace; }
/* harmony export */ });
/* harmony import */ var _postinstall_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./postinstall.mjs */ "./node_modules/@firebase/util/dist/postinstall.mjs");


/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @fileoverview Firebase constants.  Some of these (@defines) can be overridden at compile-time.
 */
const CONSTANTS = {
    /**
     * @define {boolean} Whether this is the client Node.js SDK.
     */
    NODE_CLIENT: false,
    /**
     * @define {boolean} Whether this is the Admin Node.js SDK.
     */
    NODE_ADMIN: false,
    /**
     * Firebase SDK Version
     */
    SDK_VERSION: '${JSCORE_VERSION}'
};

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Throws an error if the provided assertion is falsy
 */
const assert = function (assertion, message) {
    if (!assertion) {
        throw assertionError(message);
    }
};
/**
 * Returns an Error object suitable for throwing.
 */
const assertionError = function (message) {
    return new Error('Firebase Database (' +
        CONSTANTS.SDK_VERSION +
        ') INTERNAL ASSERT FAILED: ' +
        message);
};

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const stringToByteArray$1 = function (str) {
    // TODO(user): Use native implementations if/when available
    const out = [];
    let p = 0;
    for (let i = 0; i < str.length; i++) {
        let c = str.charCodeAt(i);
        if (c < 128) {
            out[p++] = c;
        }
        else if (c < 2048) {
            out[p++] = (c >> 6) | 192;
            out[p++] = (c & 63) | 128;
        }
        else if ((c & 0xfc00) === 0xd800 &&
            i + 1 < str.length &&
            (str.charCodeAt(i + 1) & 0xfc00) === 0xdc00) {
            // Surrogate Pair
            c = 0x10000 + ((c & 0x03ff) << 10) + (str.charCodeAt(++i) & 0x03ff);
            out[p++] = (c >> 18) | 240;
            out[p++] = ((c >> 12) & 63) | 128;
            out[p++] = ((c >> 6) & 63) | 128;
            out[p++] = (c & 63) | 128;
        }
        else {
            out[p++] = (c >> 12) | 224;
            out[p++] = ((c >> 6) & 63) | 128;
            out[p++] = (c & 63) | 128;
        }
    }
    return out;
};
/**
 * Turns an array of numbers into the string given by the concatenation of the
 * characters to which the numbers correspond.
 * @param bytes Array of numbers representing characters.
 * @return Stringification of the array.
 */
const byteArrayToString = function (bytes) {
    // TODO(user): Use native implementations if/when available
    const out = [];
    let pos = 0, c = 0;
    while (pos < bytes.length) {
        const c1 = bytes[pos++];
        if (c1 < 128) {
            out[c++] = String.fromCharCode(c1);
        }
        else if (c1 > 191 && c1 < 224) {
            const c2 = bytes[pos++];
            out[c++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
        }
        else if (c1 > 239 && c1 < 365) {
            // Surrogate Pair
            const c2 = bytes[pos++];
            const c3 = bytes[pos++];
            const c4 = bytes[pos++];
            const u = (((c1 & 7) << 18) | ((c2 & 63) << 12) | ((c3 & 63) << 6) | (c4 & 63)) -
                0x10000;
            out[c++] = String.fromCharCode(0xd800 + (u >> 10));
            out[c++] = String.fromCharCode(0xdc00 + (u & 1023));
        }
        else {
            const c2 = bytes[pos++];
            const c3 = bytes[pos++];
            out[c++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        }
    }
    return out.join('');
};
// We define it as an object literal instead of a class because a class compiled down to es5 can't
// be treeshaked. https://github.com/rollup/rollup/issues/1691
// Static lookup maps, lazily populated by init_()
// TODO(dlarocque): Define this as a class, since we no longer target ES5.
const base64 = {
    /**
     * Maps bytes to characters.
     */
    byteToCharMap_: null,
    /**
     * Maps characters to bytes.
     */
    charToByteMap_: null,
    /**
     * Maps bytes to websafe characters.
     * @private
     */
    byteToCharMapWebSafe_: null,
    /**
     * Maps websafe characters to bytes.
     * @private
     */
    charToByteMapWebSafe_: null,
    /**
     * Our default alphabet, shared between
     * ENCODED_VALS and ENCODED_VALS_WEBSAFE
     */
    ENCODED_VALS_BASE: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 'abcdefghijklmnopqrstuvwxyz' + '0123456789',
    /**
     * Our default alphabet. Value 64 (=) is special; it means "nothing."
     */
    get ENCODED_VALS() {
        return this.ENCODED_VALS_BASE + '+/=';
    },
    /**
     * Our websafe alphabet.
     */
    get ENCODED_VALS_WEBSAFE() {
        return this.ENCODED_VALS_BASE + '-_.';
    },
    /**
     * Whether this browser supports the atob and btoa functions. This extension
     * started at Mozilla but is now implemented by many browsers. We use the
     * ASSUME_* variables to avoid pulling in the full useragent detection library
     * but still allowing the standard per-browser compilations.
     *
     */
    HAS_NATIVE_SUPPORT: typeof atob === 'function',
    /**
     * Base64-encode an array of bytes.
     *
     * @param input An array of bytes (numbers with
     *     value in [0, 255]) to encode.
     * @param webSafe Boolean indicating we should use the
     *     alternative alphabet.
     * @return The base64 encoded string.
     */
    encodeByteArray(input, webSafe) {
        if (!Array.isArray(input)) {
            throw Error('encodeByteArray takes an array as a parameter');
        }
        this.init_();
        const byteToCharMap = webSafe
            ? this.byteToCharMapWebSafe_
            : this.byteToCharMap_;
        const output = [];
        for (let i = 0; i < input.length; i += 3) {
            const byte1 = input[i];
            const haveByte2 = i + 1 < input.length;
            const byte2 = haveByte2 ? input[i + 1] : 0;
            const haveByte3 = i + 2 < input.length;
            const byte3 = haveByte3 ? input[i + 2] : 0;
            const outByte1 = byte1 >> 2;
            const outByte2 = ((byte1 & 0x03) << 4) | (byte2 >> 4);
            let outByte3 = ((byte2 & 0x0f) << 2) | (byte3 >> 6);
            let outByte4 = byte3 & 0x3f;
            if (!haveByte3) {
                outByte4 = 64;
                if (!haveByte2) {
                    outByte3 = 64;
                }
            }
            output.push(byteToCharMap[outByte1], byteToCharMap[outByte2], byteToCharMap[outByte3], byteToCharMap[outByte4]);
        }
        return output.join('');
    },
    /**
     * Base64-encode a string.
     *
     * @param input A string to encode.
     * @param webSafe If true, we should use the
     *     alternative alphabet.
     * @return The base64 encoded string.
     */
    encodeString(input, webSafe) {
        // Shortcut for Mozilla browsers that implement
        // a native base64 encoder in the form of "btoa/atob"
        if (this.HAS_NATIVE_SUPPORT && !webSafe) {
            return btoa(input);
        }
        return this.encodeByteArray(stringToByteArray$1(input), webSafe);
    },
    /**
     * Base64-decode a string.
     *
     * @param input to decode.
     * @param webSafe True if we should use the
     *     alternative alphabet.
     * @return string representing the decoded value.
     */
    decodeString(input, webSafe) {
        // Shortcut for Mozilla browsers that implement
        // a native base64 encoder in the form of "btoa/atob"
        if (this.HAS_NATIVE_SUPPORT && !webSafe) {
            return atob(input);
        }
        return byteArrayToString(this.decodeStringToByteArray(input, webSafe));
    },
    /**
     * Base64-decode a string.
     *
     * In base-64 decoding, groups of four characters are converted into three
     * bytes.  If the encoder did not apply padding, the input length may not
     * be a multiple of 4.
     *
     * In this case, the last group will have fewer than 4 characters, and
     * padding will be inferred.  If the group has one or two characters, it decodes
     * to one byte.  If the group has three characters, it decodes to two bytes.
     *
     * @param input Input to decode.
     * @param webSafe True if we should use the web-safe alphabet.
     * @return bytes representing the decoded value.
     */
    decodeStringToByteArray(input, webSafe) {
        this.init_();
        const charToByteMap = webSafe
            ? this.charToByteMapWebSafe_
            : this.charToByteMap_;
        const output = [];
        for (let i = 0; i < input.length;) {
            const byte1 = charToByteMap[input.charAt(i++)];
            const haveByte2 = i < input.length;
            const byte2 = haveByte2 ? charToByteMap[input.charAt(i)] : 0;
            ++i;
            const haveByte3 = i < input.length;
            const byte3 = haveByte3 ? charToByteMap[input.charAt(i)] : 64;
            ++i;
            const haveByte4 = i < input.length;
            const byte4 = haveByte4 ? charToByteMap[input.charAt(i)] : 64;
            ++i;
            if (byte1 == null || byte2 == null || byte3 == null || byte4 == null) {
                throw new DecodeBase64StringError();
            }
            const outByte1 = (byte1 << 2) | (byte2 >> 4);
            output.push(outByte1);
            if (byte3 !== 64) {
                const outByte2 = ((byte2 << 4) & 0xf0) | (byte3 >> 2);
                output.push(outByte2);
                if (byte4 !== 64) {
                    const outByte3 = ((byte3 << 6) & 0xc0) | byte4;
                    output.push(outByte3);
                }
            }
        }
        return output;
    },
    /**
     * Lazy static initialization function. Called before
     * accessing any of the static map variables.
     * @private
     */
    init_() {
        if (!this.byteToCharMap_) {
            this.byteToCharMap_ = {};
            this.charToByteMap_ = {};
            this.byteToCharMapWebSafe_ = {};
            this.charToByteMapWebSafe_ = {};
            // We want quick mappings back and forth, so we precompute two maps.
            for (let i = 0; i < this.ENCODED_VALS.length; i++) {
                this.byteToCharMap_[i] = this.ENCODED_VALS.charAt(i);
                this.charToByteMap_[this.byteToCharMap_[i]] = i;
                this.byteToCharMapWebSafe_[i] = this.ENCODED_VALS_WEBSAFE.charAt(i);
                this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[i]] = i;
                // Be forgiving when decoding and correctly decode both encodings.
                if (i >= this.ENCODED_VALS_BASE.length) {
                    this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(i)] = i;
                    this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(i)] = i;
                }
            }
        }
    }
};
/**
 * An error encountered while decoding base64 string.
 */
class DecodeBase64StringError extends Error {
    constructor() {
        super(...arguments);
        this.name = 'DecodeBase64StringError';
    }
}
/**
 * URL-safe base64 encoding
 */
const base64Encode = function (str) {
    const utf8Bytes = stringToByteArray$1(str);
    return base64.encodeByteArray(utf8Bytes, true);
};
/**
 * URL-safe base64 encoding (without "." padding in the end).
 * e.g. Used in JSON Web Token (JWT) parts.
 */
const base64urlEncodeWithoutPadding = function (str) {
    // Use base64url encoding and remove padding in the end (dot characters).
    return base64Encode(str).replace(/\./g, '');
};
/**
 * URL-safe base64 decoding
 *
 * NOTE: DO NOT use the global atob() function - it does NOT support the
 * base64Url variant encoding.
 *
 * @param str To be decoded
 * @return Decoded result, if possible
 */
const base64Decode = function (str) {
    try {
        return base64.decodeString(str, true);
    }
    catch (e) {
        console.error('base64Decode failed: ', e);
    }
    return null;
};

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Do a deep-copy of basic JavaScript Objects or Arrays.
 */
function deepCopy(value) {
    return deepExtend(undefined, value);
}
/**
 * Copy properties from source to target (recursively allows extension
 * of Objects and Arrays).  Scalar values in the target are over-written.
 * If target is undefined, an object of the appropriate type will be created
 * (and returned).
 *
 * We recursively copy all child properties of plain Objects in the source- so
 * that namespace- like dictionaries are merged.
 *
 * Note that the target can be a function, in which case the properties in
 * the source Object are copied onto it as static properties of the Function.
 *
 * Note: we don't merge __proto__ to prevent prototype pollution
 */
function deepExtend(target, source) {
    if (!(source instanceof Object)) {
        return source;
    }
    switch (source.constructor) {
        case Date:
            // Treat Dates like scalars; if the target date object had any child
            // properties - they will be lost!
            const dateValue = source;
            return new Date(dateValue.getTime());
        case Object:
            if (target === undefined) {
                target = {};
            }
            break;
        case Array:
            // Always copy the array source and overwrite the target.
            target = [];
            break;
        default:
            // Not a plain Object - treat it as a scalar.
            return source;
    }
    for (const prop in source) {
        // use isValidKey to guard against prototype pollution. See https://snyk.io/vuln/SNYK-JS-LODASH-450202
        if (!source.hasOwnProperty(prop) || !isValidKey(prop)) {
            continue;
        }
        target[prop] = deepExtend(target[prop], source[prop]);
    }
    return target;
}
function isValidKey(key) {
    return key !== '__proto__';
}

/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Polyfill for `globalThis` object.
 * @returns the `globalThis` object for the given environment.
 * @public
 */
function getGlobal() {
    if (typeof self !== 'undefined') {
        return self;
    }
    if (typeof window !== 'undefined') {
        return window;
    }
    if (typeof __webpack_require__.g !== 'undefined') {
        return __webpack_require__.g;
    }
    throw new Error('Unable to locate global object.');
}

/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const getDefaultsFromGlobal = () => getGlobal().__FIREBASE_DEFAULTS__;
/**
 * Attempt to read defaults from a JSON string provided to
 * process(.)env(.)__FIREBASE_DEFAULTS__ or a JSON file whose path is in
 * process(.)env(.)__FIREBASE_DEFAULTS_PATH__
 * The dots are in parens because certain compilers (Vite?) cannot
 * handle seeing that variable in comments.
 * See https://github.com/firebase/firebase-js-sdk/issues/6838
 */
const getDefaultsFromEnvVariable = () => {
    if (typeof process === 'undefined' || typeof process.env === 'undefined') {
        return;
    }
    const defaultsJsonString = process.env.__FIREBASE_DEFAULTS__;
    if (defaultsJsonString) {
        return JSON.parse(defaultsJsonString);
    }
};
const getDefaultsFromCookie = () => {
    if (typeof document === 'undefined') {
        return;
    }
    let match;
    try {
        match = document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/);
    }
    catch (e) {
        // Some environments such as Angular Universal SSR have a
        // `document` object but error on accessing `document.cookie`.
        return;
    }
    const decoded = match && base64Decode(match[1]);
    return decoded && JSON.parse(decoded);
};
/**
 * Get the __FIREBASE_DEFAULTS__ object. It checks in order:
 * (1) if such an object exists as a property of `globalThis`
 * (2) if such an object was provided on a shell environment variable
 * (3) if such an object exists in a cookie
 * @public
 */
const getDefaults = () => {
    try {
        return ((0,_postinstall_mjs__WEBPACK_IMPORTED_MODULE_0__.getDefaultsFromPostinstall)() ||
            getDefaultsFromGlobal() ||
            getDefaultsFromEnvVariable() ||
            getDefaultsFromCookie());
    }
    catch (e) {
        /**
         * Catch-all for being unable to get __FIREBASE_DEFAULTS__ due
         * to any environment case we have not accounted for. Log to
         * info instead of swallowing so we can find these unknown cases
         * and add paths for them if needed.
         */
        console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);
        return;
    }
};
/**
 * Returns emulator host stored in the __FIREBASE_DEFAULTS__ object
 * for the given product.
 * @returns a URL host formatted like `127.0.0.1:9999` or `[::1]:4000` if available
 * @public
 */
const getDefaultEmulatorHost = (productName) => getDefaults()?.emulatorHosts?.[productName];
/**
 * Returns emulator hostname and port stored in the __FIREBASE_DEFAULTS__ object
 * for the given product.
 * @returns a pair of hostname and port like `["::1", 4000]` if available
 * @public
 */
const getDefaultEmulatorHostnameAndPort = (productName) => {
    const host = getDefaultEmulatorHost(productName);
    if (!host) {
        return undefined;
    }
    const separatorIndex = host.lastIndexOf(':'); // Finding the last since IPv6 addr also has colons.
    if (separatorIndex <= 0 || separatorIndex + 1 === host.length) {
        throw new Error(`Invalid host ${host} with no separate hostname and port!`);
    }
    // eslint-disable-next-line no-restricted-globals
    const port = parseInt(host.substring(separatorIndex + 1), 10);
    if (host[0] === '[') {
        // Bracket-quoted `[ipv6addr]:port` => return "ipv6addr" (without brackets).
        return [host.substring(1, separatorIndex - 1), port];
    }
    else {
        return [host.substring(0, separatorIndex), port];
    }
};
/**
 * Returns Firebase app config stored in the __FIREBASE_DEFAULTS__ object.
 * @public
 */
const getDefaultAppConfig = () => getDefaults()?.config;
/**
 * Returns an experimental setting on the __FIREBASE_DEFAULTS__ object (properties
 * prefixed by "_")
 * @public
 */
const getExperimentalSetting = (name) => getDefaults()?.[`_${name}`];

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Deferred {
    constructor() {
        this.reject = () => { };
        this.resolve = () => { };
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
    /**
     * Our API internals are not promisified and cannot because our callback APIs have subtle expectations around
     * invoking promises inline, which Promises are forbidden to do. This method accepts an optional node-style callback
     * and returns a node-style callback which will resolve or reject the Deferred's promise.
     */
    wrapCallback(callback) {
        return (error, value) => {
            if (error) {
                this.reject(error);
            }
            else {
                this.resolve(value);
            }
            if (typeof callback === 'function') {
                // Attaching noop handler just in case developer wasn't expecting
                // promises
                this.promise.catch(() => { });
                // Some of our callbacks don't expect a value and our own tests
                // assert that the parameter length is 1
                if (callback.length === 1) {
                    callback(error);
                }
                else {
                    callback(error, value);
                }
            }
        };
    }
}

/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function createMockUserToken(token, projectId) {
    if (token.uid) {
        throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');
    }
    // Unsecured JWTs use "none" as the algorithm.
    const header = {
        alg: 'none',
        type: 'JWT'
    };
    const project = projectId || 'demo-project';
    const iat = token.iat || 0;
    const sub = token.sub || token.user_id;
    if (!sub) {
        throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");
    }
    const payload = {
        // Set all required fields to decent defaults
        iss: `https://securetoken.google.com/${project}`,
        aud: project,
        iat,
        exp: iat + 3600,
        auth_time: iat,
        sub,
        user_id: sub,
        firebase: {
            sign_in_provider: 'custom',
            identities: {}
        },
        // Override with user options
        ...token
    };
    // Unsecured JWTs use the empty string as a signature.
    const signature = '';
    return [
        base64urlEncodeWithoutPadding(JSON.stringify(header)),
        base64urlEncodeWithoutPadding(JSON.stringify(payload)),
        signature
    ].join('.');
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Returns navigator.userAgent string or '' if it's not defined.
 * @return user agent string
 */
function getUA() {
    if (typeof navigator !== 'undefined' &&
        typeof navigator['userAgent'] === 'string') {
        return navigator['userAgent'];
    }
    else {
        return '';
    }
}
/**
 * Detect Cordova / PhoneGap / Ionic frameworks on a mobile device.
 *
 * Deliberately does not rely on checking `file://` URLs (as this fails PhoneGap
 * in the Ripple emulator) nor Cordova `onDeviceReady`, which would normally
 * wait for a callback.
 */
function isMobileCordova() {
    return (typeof window !== 'undefined' &&
        // @ts-ignore Setting up an broadly applicable index signature for Window
        // just to deal with this case would probably be a bad idea.
        !!(window['cordova'] || window['phonegap'] || window['PhoneGap']) &&
        /ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(getUA()));
}
/**
 * Detect Node.js.
 *
 * @return true if Node.js environment is detected or specified.
 */
// Node detection logic from: https://github.com/iliakan/detect-node/
function isNode() {
    const forceEnvironment = getDefaults()?.forceEnvironment;
    if (forceEnvironment === 'node') {
        return true;
    }
    else if (forceEnvironment === 'browser') {
        return false;
    }
    try {
        return (Object.prototype.toString.call(__webpack_require__.g.process) === '[object process]');
    }
    catch (e) {
        return false;
    }
}
/**
 * Detect Browser Environment.
 * Note: This will return true for certain test frameworks that are incompletely
 * mimicking a browser, and should not lead to assuming all browser APIs are
 * available.
 */
function isBrowser() {
    return typeof window !== 'undefined' || isWebWorker();
}
/**
 * Detect Web Worker context.
 */
function isWebWorker() {
    return (typeof WorkerGlobalScope !== 'undefined' &&
        typeof self !== 'undefined' &&
        self instanceof WorkerGlobalScope);
}
/**
 * Detect Cloudflare Worker context.
 */
function isCloudflareWorker() {
    return (typeof navigator !== 'undefined' &&
        navigator.userAgent === 'Cloudflare-Workers');
}
function isBrowserExtension() {
    const runtime = typeof chrome === 'object'
        ? chrome.runtime
        : typeof browser === 'object'
            ? browser.runtime
            : undefined;
    return typeof runtime === 'object' && runtime.id !== undefined;
}
/**
 * Detect React Native.
 *
 * @return true if ReactNative environment is detected.
 */
function isReactNative() {
    return (typeof navigator === 'object' && navigator['product'] === 'ReactNative');
}
/** Detects Electron apps. */
function isElectron() {
    return getUA().indexOf('Electron/') >= 0;
}
/** Detects Internet Explorer. */
function isIE() {
    const ua = getUA();
    return ua.indexOf('MSIE ') >= 0 || ua.indexOf('Trident/') >= 0;
}
/** Detects Universal Windows Platform apps. */
function isUWP() {
    return getUA().indexOf('MSAppHost/') >= 0;
}
/**
 * Detect whether the current SDK build is the Node version.
 *
 * @return true if it's the Node SDK build.
 */
function isNodeSdk() {
    return CONSTANTS.NODE_CLIENT === true || CONSTANTS.NODE_ADMIN === true;
}
/** Returns true if we are running in Safari. */
function isSafari() {
    return (!isNode() &&
        !!navigator.userAgent &&
        navigator.userAgent.includes('Safari') &&
        !navigator.userAgent.includes('Chrome'));
}
/** Returns true if we are running in Safari or WebKit */
function isSafariOrWebkit() {
    return (!isNode() &&
        !!navigator.userAgent &&
        (navigator.userAgent.includes('Safari') ||
            navigator.userAgent.includes('WebKit')) &&
        !navigator.userAgent.includes('Chrome'));
}
/**
 * This method checks if indexedDB is supported by current browser/service worker context
 * @return true if indexedDB is supported by current browser/service worker context
 */
function isIndexedDBAvailable() {
    try {
        return typeof indexedDB === 'object';
    }
    catch (e) {
        return false;
    }
}
/**
 * This method validates browser/sw context for indexedDB by opening a dummy indexedDB database and reject
 * if errors occur during the database open operation.
 *
 * @throws exception if current browser/sw context can't run idb.open (ex: Safari iframe, Firefox
 * private browsing)
 */
function validateIndexedDBOpenable() {
    return new Promise((resolve, reject) => {
        try {
            let preExist = true;
            const DB_CHECK_NAME = 'validate-browser-context-for-indexeddb-analytics-module';
            const request = self.indexedDB.open(DB_CHECK_NAME);
            request.onsuccess = () => {
                request.result.close();
                // delete database only when it doesn't pre-exist
                if (!preExist) {
                    self.indexedDB.deleteDatabase(DB_CHECK_NAME);
                }
                resolve(true);
            };
            request.onupgradeneeded = () => {
                preExist = false;
            };
            request.onerror = () => {
                reject(request.error?.message || '');
            };
        }
        catch (error) {
            reject(error);
        }
    });
}
/**
 *
 * This method checks whether cookie is enabled within current browser
 * @return true if cookie is enabled within current browser
 */
function areCookiesEnabled() {
    if (typeof navigator === 'undefined' || !navigator.cookieEnabled) {
        return false;
    }
    return true;
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @fileoverview Standardized Firebase Error.
 *
 * Usage:
 *
 *   // TypeScript string literals for type-safe codes
 *   type Err =
 *     'unknown' |
 *     'object-not-found'
 *     ;
 *
 *   // Closure enum for type-safe error codes
 *   // at-enum {string}
 *   var Err = {
 *     UNKNOWN: 'unknown',
 *     OBJECT_NOT_FOUND: 'object-not-found',
 *   }
 *
 *   let errors: Map<Err, string> = {
 *     'generic-error': "Unknown error",
 *     'file-not-found': "Could not find file: {$file}",
 *   };
 *
 *   // Type-safe function - must pass a valid error code as param.
 *   let error = new ErrorFactory<Err>('service', 'Service', errors);
 *
 *   ...
 *   throw error.create(Err.GENERIC);
 *   ...
 *   throw error.create(Err.FILE_NOT_FOUND, {'file': fileName});
 *   ...
 *   // Service: Could not file file: foo.txt (service/file-not-found).
 *
 *   catch (e) {
 *     assert(e.message === "Could not find file: foo.txt.");
 *     if ((e as FirebaseError)?.code === 'service/file-not-found') {
 *       console.log("Could not read file: " + e['file']);
 *     }
 *   }
 */
const ERROR_NAME = 'FirebaseError';
// Based on code from:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#Custom_Error_Types
class FirebaseError extends Error {
    constructor(
    /** The error code for this error. */
    code, message, 
    /** Custom data for this error. */
    customData) {
        super(message);
        this.code = code;
        this.customData = customData;
        /** The custom name for all FirebaseErrors. */
        this.name = ERROR_NAME;
        // Fix For ES5
        // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        // TODO(dlarocque): Replace this with `new.target`: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html#support-for-newtarget
        //                   which we can now use since we no longer target ES5.
        Object.setPrototypeOf(this, FirebaseError.prototype);
        // Maintains proper stack trace for where our error was thrown.
        // Only available on V8.
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ErrorFactory.prototype.create);
        }
    }
}
class ErrorFactory {
    constructor(service, serviceName, errors) {
        this.service = service;
        this.serviceName = serviceName;
        this.errors = errors;
    }
    create(code, ...data) {
        const customData = data[0] || {};
        const fullCode = `${this.service}/${code}`;
        const template = this.errors[code];
        const message = template ? replaceTemplate(template, customData) : 'Error';
        // Service Name: Error message (service/code).
        const fullMessage = `${this.serviceName}: ${message} (${fullCode}).`;
        const error = new FirebaseError(fullCode, fullMessage, customData);
        return error;
    }
}
function replaceTemplate(template, data) {
    return template.replace(PATTERN, (_, key) => {
        const value = data[key];
        return value != null ? String(value) : `<${key}?>`;
    });
}
const PATTERN = /\{\$([^}]+)}/g;

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Evaluates a JSON string into a javascript object.
 *
 * @param {string} str A string containing JSON.
 * @return {*} The javascript object representing the specified JSON.
 */
function jsonEval(str) {
    return JSON.parse(str);
}
/**
 * Returns JSON representing a javascript object.
 * @param {*} data JavaScript object to be stringified.
 * @return {string} The JSON contents of the object.
 */
function stringify(data) {
    return JSON.stringify(data);
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Decodes a Firebase auth. token into constituent parts.
 *
 * Notes:
 * - May return with invalid / incomplete claims if there's no native base64 decoding support.
 * - Doesn't check if the token is actually valid.
 */
const decode = function (token) {
    let header = {}, claims = {}, data = {}, signature = '';
    try {
        const parts = token.split('.');
        header = jsonEval(base64Decode(parts[0]) || '');
        claims = jsonEval(base64Decode(parts[1]) || '');
        signature = parts[2];
        data = claims['d'] || {};
        delete claims['d'];
    }
    catch (e) { }
    return {
        header,
        claims,
        data,
        signature
    };
};
/**
 * Decodes a Firebase auth. token and checks the validity of its time-based claims. Will return true if the
 * token is within the time window authorized by the 'nbf' (not-before) and 'iat' (issued-at) claims.
 *
 * Notes:
 * - May return a false negative if there's no native base64 decoding support.
 * - Doesn't check if the token is actually valid.
 */
const isValidTimestamp = function (token) {
    const claims = decode(token).claims;
    const now = Math.floor(new Date().getTime() / 1000);
    let validSince = 0, validUntil = 0;
    if (typeof claims === 'object') {
        if (claims.hasOwnProperty('nbf')) {
            validSince = claims['nbf'];
        }
        else if (claims.hasOwnProperty('iat')) {
            validSince = claims['iat'];
        }
        if (claims.hasOwnProperty('exp')) {
            validUntil = claims['exp'];
        }
        else {
            // token will expire after 24h by default
            validUntil = validSince + 86400;
        }
    }
    return (!!now &&
        !!validSince &&
        !!validUntil &&
        now >= validSince &&
        now <= validUntil);
};
/**
 * Decodes a Firebase auth. token and returns its issued at time if valid, null otherwise.
 *
 * Notes:
 * - May return null if there's no native base64 decoding support.
 * - Doesn't check if the token is actually valid.
 */
const issuedAtTime = function (token) {
    const claims = decode(token).claims;
    if (typeof claims === 'object' && claims.hasOwnProperty('iat')) {
        return claims['iat'];
    }
    return null;
};
/**
 * Decodes a Firebase auth. token and checks the validity of its format. Expects a valid issued-at time.
 *
 * Notes:
 * - May return a false negative if there's no native base64 decoding support.
 * - Doesn't check if the token is actually valid.
 */
const isValidFormat = function (token) {
    const decoded = decode(token), claims = decoded.claims;
    return !!claims && typeof claims === 'object' && claims.hasOwnProperty('iat');
};
/**
 * Attempts to peer into an auth token and determine if it's an admin auth token by looking at the claims portion.
 *
 * Notes:
 * - May return a false negative if there's no native base64 decoding support.
 * - Doesn't check if the token is actually valid.
 */
const isAdmin = function (token) {
    const claims = decode(token).claims;
    return typeof claims === 'object' && claims['admin'] === true;
};

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function contains(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}
function safeGet(obj, key) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
        return obj[key];
    }
    else {
        return undefined;
    }
}
function isEmpty(obj) {
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return false;
        }
    }
    return true;
}
function map(obj, fn, contextObj) {
    const res = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            res[key] = fn.call(contextObj, obj[key], key, obj);
        }
    }
    return res;
}
/**
 * Deep equal two objects. Support Arrays and Objects.
 */
function deepEqual(a, b) {
    if (a === b) {
        return true;
    }
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    for (const k of aKeys) {
        if (!bKeys.includes(k)) {
            return false;
        }
        const aProp = a[k];
        const bProp = b[k];
        if (isObject(aProp) && isObject(bProp)) {
            if (!deepEqual(aProp, bProp)) {
                return false;
            }
        }
        else if (aProp !== bProp) {
            return false;
        }
    }
    for (const k of bKeys) {
        if (!aKeys.includes(k)) {
            return false;
        }
    }
    return true;
}
function isObject(thing) {
    return thing !== null && typeof thing === 'object';
}

/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Rejects if the given promise doesn't resolve in timeInMS milliseconds.
 * @internal
 */
function promiseWithTimeout(promise, timeInMS = 2000) {
    const deferredPromise = new Deferred();
    setTimeout(() => deferredPromise.reject('timeout!'), timeInMS);
    promise.then(deferredPromise.resolve, deferredPromise.reject);
    return deferredPromise.promise;
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Returns a querystring-formatted string (e.g. &arg=val&arg2=val2) from a
 * params object (e.g. {arg: 'val', arg2: 'val2'})
 * Note: You must prepend it with ? when adding it to a URL.
 */
function querystring(querystringParams) {
    const params = [];
    for (const [key, value] of Object.entries(querystringParams)) {
        if (Array.isArray(value)) {
            value.forEach(arrayVal => {
                params.push(encodeURIComponent(key) + '=' + encodeURIComponent(arrayVal));
            });
        }
        else {
            params.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
        }
    }
    return params.length ? '&' + params.join('&') : '';
}
/**
 * Decodes a querystring (e.g. ?arg=val&arg2=val2) into a params object
 * (e.g. {arg: 'val', arg2: 'val2'})
 */
function querystringDecode(querystring) {
    const obj = {};
    const tokens = querystring.replace(/^\?/, '').split('&');
    tokens.forEach(token => {
        if (token) {
            const [key, value] = token.split('=');
            obj[decodeURIComponent(key)] = decodeURIComponent(value);
        }
    });
    return obj;
}
/**
 * Extract the query string part of a URL, including the leading question mark (if present).
 */
function extractQuerystring(url) {
    const queryStart = url.indexOf('?');
    if (!queryStart) {
        return '';
    }
    const fragmentStart = url.indexOf('#', queryStart);
    return url.substring(queryStart, fragmentStart > 0 ? fragmentStart : undefined);
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @fileoverview SHA-1 cryptographic hash.
 * Variable names follow the notation in FIPS PUB 180-3:
 * http://csrc.nist.gov/publications/fips/fips180-3/fips180-3_final.pdf.
 *
 * Usage:
 *   var sha1 = new sha1();
 *   sha1.update(bytes);
 *   var hash = sha1.digest();
 *
 * Performance:
 *   Chrome 23:   ~400 Mbit/s
 *   Firefox 16:  ~250 Mbit/s
 *
 */
/**
 * SHA-1 cryptographic hash constructor.
 *
 * The properties declared here are discussed in the above algorithm document.
 * @constructor
 * @final
 * @struct
 */
class Sha1 {
    constructor() {
        /**
         * Holds the previous values of accumulated variables a-e in the compress_
         * function.
         * @private
         */
        this.chain_ = [];
        /**
         * A buffer holding the partially computed hash result.
         * @private
         */
        this.buf_ = [];
        /**
         * An array of 80 bytes, each a part of the message to be hashed.  Referred to
         * as the message schedule in the docs.
         * @private
         */
        this.W_ = [];
        /**
         * Contains data needed to pad messages less than 64 bytes.
         * @private
         */
        this.pad_ = [];
        /**
         * @private {number}
         */
        this.inbuf_ = 0;
        /**
         * @private {number}
         */
        this.total_ = 0;
        this.blockSize = 512 / 8;
        this.pad_[0] = 128;
        for (let i = 1; i < this.blockSize; ++i) {
            this.pad_[i] = 0;
        }
        this.reset();
    }
    reset() {
        this.chain_[0] = 0x67452301;
        this.chain_[1] = 0xefcdab89;
        this.chain_[2] = 0x98badcfe;
        this.chain_[3] = 0x10325476;
        this.chain_[4] = 0xc3d2e1f0;
        this.inbuf_ = 0;
        this.total_ = 0;
    }
    /**
     * Internal compress helper function.
     * @param buf Block to compress.
     * @param offset Offset of the block in the buffer.
     * @private
     */
    compress_(buf, offset) {
        if (!offset) {
            offset = 0;
        }
        const W = this.W_;
        // get 16 big endian words
        if (typeof buf === 'string') {
            for (let i = 0; i < 16; i++) {
                // TODO(user): [bug 8140122] Recent versions of Safari for Mac OS and iOS
                // have a bug that turns the post-increment ++ operator into pre-increment
                // during JIT compilation.  We have code that depends heavily on SHA-1 for
                // correctness and which is affected by this bug, so I've removed all uses
                // of post-increment ++ in which the result value is used.  We can revert
                // this change once the Safari bug
                // (https://bugs.webkit.org/show_bug.cgi?id=109036) has been fixed and
                // most clients have been updated.
                W[i] =
                    (buf.charCodeAt(offset) << 24) |
                        (buf.charCodeAt(offset + 1) << 16) |
                        (buf.charCodeAt(offset + 2) << 8) |
                        buf.charCodeAt(offset + 3);
                offset += 4;
            }
        }
        else {
            for (let i = 0; i < 16; i++) {
                W[i] =
                    (buf[offset] << 24) |
                        (buf[offset + 1] << 16) |
                        (buf[offset + 2] << 8) |
                        buf[offset + 3];
                offset += 4;
            }
        }
        // expand to 80 words
        for (let i = 16; i < 80; i++) {
            const t = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
            W[i] = ((t << 1) | (t >>> 31)) & 0xffffffff;
        }
        let a = this.chain_[0];
        let b = this.chain_[1];
        let c = this.chain_[2];
        let d = this.chain_[3];
        let e = this.chain_[4];
        let f, k;
        // TODO(user): Try to unroll this loop to speed up the computation.
        for (let i = 0; i < 80; i++) {
            if (i < 40) {
                if (i < 20) {
                    f = d ^ (b & (c ^ d));
                    k = 0x5a827999;
                }
                else {
                    f = b ^ c ^ d;
                    k = 0x6ed9eba1;
                }
            }
            else {
                if (i < 60) {
                    f = (b & c) | (d & (b | c));
                    k = 0x8f1bbcdc;
                }
                else {
                    f = b ^ c ^ d;
                    k = 0xca62c1d6;
                }
            }
            const t = (((a << 5) | (a >>> 27)) + f + e + k + W[i]) & 0xffffffff;
            e = d;
            d = c;
            c = ((b << 30) | (b >>> 2)) & 0xffffffff;
            b = a;
            a = t;
        }
        this.chain_[0] = (this.chain_[0] + a) & 0xffffffff;
        this.chain_[1] = (this.chain_[1] + b) & 0xffffffff;
        this.chain_[2] = (this.chain_[2] + c) & 0xffffffff;
        this.chain_[3] = (this.chain_[3] + d) & 0xffffffff;
        this.chain_[4] = (this.chain_[4] + e) & 0xffffffff;
    }
    update(bytes, length) {
        // TODO(johnlenz): tighten the function signature and remove this check
        if (bytes == null) {
            return;
        }
        if (length === undefined) {
            length = bytes.length;
        }
        const lengthMinusBlock = length - this.blockSize;
        let n = 0;
        // Using local instead of member variables gives ~5% speedup on Firefox 16.
        const buf = this.buf_;
        let inbuf = this.inbuf_;
        // The outer while loop should execute at most twice.
        while (n < length) {
            // When we have no data in the block to top up, we can directly process the
            // input buffer (assuming it contains sufficient data). This gives ~25%
            // speedup on Chrome 23 and ~15% speedup on Firefox 16, but requires that
            // the data is provided in large chunks (or in multiples of 64 bytes).
            if (inbuf === 0) {
                while (n <= lengthMinusBlock) {
                    this.compress_(bytes, n);
                    n += this.blockSize;
                }
            }
            if (typeof bytes === 'string') {
                while (n < length) {
                    buf[inbuf] = bytes.charCodeAt(n);
                    ++inbuf;
                    ++n;
                    if (inbuf === this.blockSize) {
                        this.compress_(buf);
                        inbuf = 0;
                        // Jump to the outer loop so we use the full-block optimization.
                        break;
                    }
                }
            }
            else {
                while (n < length) {
                    buf[inbuf] = bytes[n];
                    ++inbuf;
                    ++n;
                    if (inbuf === this.blockSize) {
                        this.compress_(buf);
                        inbuf = 0;
                        // Jump to the outer loop so we use the full-block optimization.
                        break;
                    }
                }
            }
        }
        this.inbuf_ = inbuf;
        this.total_ += length;
    }
    /** @override */
    digest() {
        const digest = [];
        let totalBits = this.total_ * 8;
        // Add pad 0x80 0x00*.
        if (this.inbuf_ < 56) {
            this.update(this.pad_, 56 - this.inbuf_);
        }
        else {
            this.update(this.pad_, this.blockSize - (this.inbuf_ - 56));
        }
        // Add # bits.
        for (let i = this.blockSize - 1; i >= 56; i--) {
            this.buf_[i] = totalBits & 255;
            totalBits /= 256; // Don't use bit-shifting here!
        }
        this.compress_(this.buf_);
        let n = 0;
        for (let i = 0; i < 5; i++) {
            for (let j = 24; j >= 0; j -= 8) {
                digest[n] = (this.chain_[i] >> j) & 255;
                ++n;
            }
        }
        return digest;
    }
}

/**
 * Helper to make a Subscribe function (just like Promise helps make a
 * Thenable).
 *
 * @param executor Function which can make calls to a single Observer
 *     as a proxy.
 * @param onNoObservers Callback when count of Observers goes to zero.
 */
function createSubscribe(executor, onNoObservers) {
    const proxy = new ObserverProxy(executor, onNoObservers);
    return proxy.subscribe.bind(proxy);
}
/**
 * Implement fan-out for any number of Observers attached via a subscribe
 * function.
 */
class ObserverProxy {
    /**
     * @param executor Function which can make calls to a single Observer
     *     as a proxy.
     * @param onNoObservers Callback when count of Observers goes to zero.
     */
    constructor(executor, onNoObservers) {
        this.observers = [];
        this.unsubscribes = [];
        this.observerCount = 0;
        // Micro-task scheduling by calling task.then().
        this.task = Promise.resolve();
        this.finalized = false;
        this.onNoObservers = onNoObservers;
        // Call the executor asynchronously so subscribers that are called
        // synchronously after the creation of the subscribe function
        // can still receive the very first value generated in the executor.
        this.task
            .then(() => {
            executor(this);
        })
            .catch(e => {
            this.error(e);
        });
    }
    next(value) {
        this.forEachObserver((observer) => {
            observer.next(value);
        });
    }
    error(error) {
        this.forEachObserver((observer) => {
            observer.error(error);
        });
        this.close(error);
    }
    complete() {
        this.forEachObserver((observer) => {
            observer.complete();
        });
        this.close();
    }
    /**
     * Subscribe function that can be used to add an Observer to the fan-out list.
     *
     * - We require that no event is sent to a subscriber synchronously to their
     *   call to subscribe().
     */
    subscribe(nextOrObserver, error, complete) {
        let observer;
        if (nextOrObserver === undefined &&
            error === undefined &&
            complete === undefined) {
            throw new Error('Missing Observer.');
        }
        // Assemble an Observer object when passed as callback functions.
        if (implementsAnyMethods(nextOrObserver, [
            'next',
            'error',
            'complete'
        ])) {
            observer = nextOrObserver;
        }
        else {
            observer = {
                next: nextOrObserver,
                error,
                complete
            };
        }
        if (observer.next === undefined) {
            observer.next = noop;
        }
        if (observer.error === undefined) {
            observer.error = noop;
        }
        if (observer.complete === undefined) {
            observer.complete = noop;
        }
        const unsub = this.unsubscribeOne.bind(this, this.observers.length);
        // Attempt to subscribe to a terminated Observable - we
        // just respond to the Observer with the final error or complete
        // event.
        if (this.finalized) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this.task.then(() => {
                try {
                    if (this.finalError) {
                        observer.error(this.finalError);
                    }
                    else {
                        observer.complete();
                    }
                }
                catch (e) {
                    // nothing
                }
                return;
            });
        }
        this.observers.push(observer);
        return unsub;
    }
    // Unsubscribe is synchronous - we guarantee that no events are sent to
    // any unsubscribed Observer.
    unsubscribeOne(i) {
        if (this.observers === undefined || this.observers[i] === undefined) {
            return;
        }
        delete this.observers[i];
        this.observerCount -= 1;
        if (this.observerCount === 0 && this.onNoObservers !== undefined) {
            this.onNoObservers(this);
        }
    }
    forEachObserver(fn) {
        if (this.finalized) {
            // Already closed by previous event....just eat the additional values.
            return;
        }
        // Since sendOne calls asynchronously - there is no chance that
        // this.observers will become undefined.
        for (let i = 0; i < this.observers.length; i++) {
            this.sendOne(i, fn);
        }
    }
    // Call the Observer via one of it's callback function. We are careful to
    // confirm that the observe has not been unsubscribed since this asynchronous
    // function had been queued.
    sendOne(i, fn) {
        // Execute the callback asynchronously
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.task.then(() => {
            if (this.observers !== undefined && this.observers[i] !== undefined) {
                try {
                    fn(this.observers[i]);
                }
                catch (e) {
                    // Ignore exceptions raised in Observers or missing methods of an
                    // Observer.
                    // Log error to console. b/31404806
                    if (typeof console !== 'undefined' && console.error) {
                        console.error(e);
                    }
                }
            }
        });
    }
    close(err) {
        if (this.finalized) {
            return;
        }
        this.finalized = true;
        if (err !== undefined) {
            this.finalError = err;
        }
        // Proxy is no longer needed - garbage collect references
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.task.then(() => {
            this.observers = undefined;
            this.onNoObservers = undefined;
        });
    }
}
/** Turn synchronous function into one called asynchronously. */
// eslint-disable-next-line @typescript-eslint/ban-types
function async(fn, onError) {
    return (...args) => {
        Promise.resolve(true)
            .then(() => {
            fn(...args);
        })
            .catch((error) => {
            if (onError) {
                onError(error);
            }
        });
    };
}
/**
 * Return true if the object passed in implements any of the named methods.
 */
function implementsAnyMethods(obj, methods) {
    if (typeof obj !== 'object' || obj === null) {
        return false;
    }
    for (const method of methods) {
        if (method in obj && typeof obj[method] === 'function') {
            return true;
        }
    }
    return false;
}
function noop() {
    // do nothing
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Check to make sure the appropriate number of arguments are provided for a public function.
 * Throws an error if it fails.
 *
 * @param fnName The function name
 * @param minCount The minimum number of arguments to allow for the function call
 * @param maxCount The maximum number of argument to allow for the function call
 * @param argCount The actual number of arguments provided.
 */
const validateArgCount = function (fnName, minCount, maxCount, argCount) {
    let argError;
    if (argCount < minCount) {
        argError = 'at least ' + minCount;
    }
    else if (argCount > maxCount) {
        argError = maxCount === 0 ? 'none' : 'no more than ' + maxCount;
    }
    if (argError) {
        const error = fnName +
            ' failed: Was called with ' +
            argCount +
            (argCount === 1 ? ' argument.' : ' arguments.') +
            ' Expects ' +
            argError +
            '.';
        throw new Error(error);
    }
};
/**
 * Generates a string to prefix an error message about failed argument validation
 *
 * @param fnName The function name
 * @param argName The name of the argument
 * @return The prefix to add to the error thrown for validation.
 */
function errorPrefix(fnName, argName) {
    return `${fnName} failed: ${argName} argument `;
}
/**
 * @param fnName
 * @param argumentNumber
 * @param namespace
 * @param optional
 */
function validateNamespace(fnName, namespace, optional) {
    if (optional && !namespace) {
        return;
    }
    if (typeof namespace !== 'string') {
        //TODO: I should do more validation here. We only allow certain chars in namespaces.
        throw new Error(errorPrefix(fnName, 'namespace') + 'must be a valid firebase namespace.');
    }
}
function validateCallback(fnName, argumentName, 
// eslint-disable-next-line @typescript-eslint/ban-types
callback, optional) {
    if (optional && !callback) {
        return;
    }
    if (typeof callback !== 'function') {
        throw new Error(errorPrefix(fnName, argumentName) + 'must be a valid function.');
    }
}
function validateContextObject(fnName, argumentName, context, optional) {
    if (optional && !context) {
        return;
    }
    if (typeof context !== 'object' || context === null) {
        throw new Error(errorPrefix(fnName, argumentName) + 'must be a valid context object.');
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// Code originally came from goog.crypt.stringToUtf8ByteArray, but for some reason they
// automatically replaced '\r\n' with '\n', and they didn't handle surrogate pairs,
// so it's been modified.
// Note that not all Unicode characters appear as single characters in JavaScript strings.
// fromCharCode returns the UTF-16 encoding of a character - so some Unicode characters
// use 2 characters in JavaScript.  All 4-byte UTF-8 characters begin with a first
// character in the range 0xD800 - 0xDBFF (the first character of a so-called surrogate
// pair).
// See http://www.ecma-international.org/ecma-262/5.1/#sec-15.1.3
/**
 * @param {string} str
 * @return {Array}
 */
const stringToByteArray = function (str) {
    const out = [];
    let p = 0;
    for (let i = 0; i < str.length; i++) {
        let c = str.charCodeAt(i);
        // Is this the lead surrogate in a surrogate pair?
        if (c >= 0xd800 && c <= 0xdbff) {
            const high = c - 0xd800; // the high 10 bits.
            i++;
            assert(i < str.length, 'Surrogate pair missing trail surrogate.');
            const low = str.charCodeAt(i) - 0xdc00; // the low 10 bits.
            c = 0x10000 + (high << 10) + low;
        }
        if (c < 128) {
            out[p++] = c;
        }
        else if (c < 2048) {
            out[p++] = (c >> 6) | 192;
            out[p++] = (c & 63) | 128;
        }
        else if (c < 65536) {
            out[p++] = (c >> 12) | 224;
            out[p++] = ((c >> 6) & 63) | 128;
            out[p++] = (c & 63) | 128;
        }
        else {
            out[p++] = (c >> 18) | 240;
            out[p++] = ((c >> 12) & 63) | 128;
            out[p++] = ((c >> 6) & 63) | 128;
            out[p++] = (c & 63) | 128;
        }
    }
    return out;
};
/**
 * Calculate length without actually converting; useful for doing cheaper validation.
 * @param {string} str
 * @return {number}
 */
const stringLength = function (str) {
    let p = 0;
    for (let i = 0; i < str.length; i++) {
        const c = str.charCodeAt(i);
        if (c < 128) {
            p++;
        }
        else if (c < 2048) {
            p += 2;
        }
        else if (c >= 0xd800 && c <= 0xdbff) {
            // Lead surrogate of a surrogate pair.  The pair together will take 4 bytes to represent.
            p += 4;
            i++; // skip trail surrogate.
        }
        else {
            p += 3;
        }
    }
    return p;
};

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * The amount of milliseconds to exponentially increase.
 */
const DEFAULT_INTERVAL_MILLIS = 1000;
/**
 * The factor to backoff by.
 * Should be a number greater than 1.
 */
const DEFAULT_BACKOFF_FACTOR = 2;
/**
 * The maximum milliseconds to increase to.
 *
 * <p>Visible for testing
 */
const MAX_VALUE_MILLIS = 4 * 60 * 60 * 1000; // Four hours, like iOS and Android.
/**
 * The percentage of backoff time to randomize by.
 * See
 * http://go/safe-client-behavior#step-1-determine-the-appropriate-retry-interval-to-handle-spike-traffic
 * for context.
 *
 * <p>Visible for testing
 */
const RANDOM_FACTOR = 0.5;
/**
 * Based on the backoff method from
 * https://github.com/google/closure-library/blob/master/closure/goog/math/exponentialbackoff.js.
 * Extracted here so we don't need to pass metadata and a stateful ExponentialBackoff object around.
 */
function calculateBackoffMillis(backoffCount, intervalMillis = DEFAULT_INTERVAL_MILLIS, backoffFactor = DEFAULT_BACKOFF_FACTOR) {
    // Calculates an exponentially increasing value.
    // Deviation: calculates value from count and a constant interval, so we only need to save value
    // and count to restore state.
    const currBaseValue = intervalMillis * Math.pow(backoffFactor, backoffCount);
    // A random "fuzz" to avoid waves of retries.
    // Deviation: randomFactor is required.
    const randomWait = Math.round(
    // A fraction of the backoff value to add/subtract.
    // Deviation: changes multiplication order to improve readability.
    RANDOM_FACTOR *
        currBaseValue *
        // A random float (rounded to int by Math.round above) in the range [-1, 1]. Determines
        // if we add or subtract.
        (Math.random() - 0.5) *
        2);
    // Limits backoff to max to avoid effectively permanent backoff.
    return Math.min(MAX_VALUE_MILLIS, currBaseValue + randomWait);
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Provide English ordinal letters after a number
 */
function ordinal(i) {
    if (!Number.isFinite(i)) {
        return `${i}`;
    }
    return i + indicator(i);
}
function indicator(i) {
    i = Math.abs(i);
    const cent = i % 100;
    if (cent >= 10 && cent <= 20) {
        return 'th';
    }
    const dec = i % 10;
    if (dec === 1) {
        return 'st';
    }
    if (dec === 2) {
        return 'nd';
    }
    if (dec === 3) {
        return 'rd';
    }
    return 'th';
}

/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function getModularInstance(service) {
    if (service && service._delegate) {
        return service._delegate;
    }
    else {
        return service;
    }
}

/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Checks whether host is a cloud workstation or not.
 * @public
 */
function isCloudWorkstation(url) {
    // `isCloudWorkstation` is called without protocol in certain connect*Emulator functions
    // In HTTP request builders, it's called with the protocol.
    // If called with protocol prefix, it's a valid URL, so we extract the hostname
    // If called without, we assume the string is the hostname.
    try {
        const host = url.startsWith('http://') || url.startsWith('https://')
            ? new URL(url).hostname
            : url;
        return host.endsWith('.cloudworkstations.dev');
    }
    catch {
        return false;
    }
}
/**
 * Makes a fetch request to the given server.
 * Mostly used for forwarding cookies in Firebase Studio.
 * @public
 */
async function pingServer(endpoint) {
    const result = await fetch(endpoint, {
        credentials: 'include'
    });
    return result.ok;
}

/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @public
 * Generates a SHA-256 hash for the given input string.
 *
 * @param input The string to hash.
 * @returns A promise that resolves to the SHA-256 hash as a hex string.
 */
async function generateSHA256Hash(input) {
    const textEncoder = new TextEncoder();
    const data = textEncoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    // Convert ArrayBuffer to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hexHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hexHash;
}


//# sourceMappingURL=index.esm.js.map


/***/ }),

/***/ "./src/config.js":
/*!***********************!*\
  !*** ./src/config.js ***!
  \***********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   API_KEY: function() { return /* binding */ API_KEY; },
/* harmony export */   APP_NAME: function() { return /* binding */ APP_NAME; },
/* harmony export */   AVATAR_SIZE: function() { return /* binding */ AVATAR_SIZE; },
/* harmony export */   BASE_APP_NAME: function() { return /* binding */ BASE_APP_NAME; },
/* harmony export */   BROKEN_IMAGE_SIZE: function() { return /* binding */ BROKEN_IMAGE_SIZE; },
/* harmony export */   CHANNEL_ACCESS_MODE: function() { return /* binding */ CHANNEL_ACCESS_MODE; },
/* harmony export */   CLICKABLE_URL_SCHEMES: function() { return /* binding */ CLICKABLE_URL_SCHEMES; },
/* harmony export */   DEFAULT_COLOR_SCHEME: function() { return /* binding */ DEFAULT_COLOR_SCHEME; },
/* harmony export */   DEFAULT_HOST: function() { return /* binding */ DEFAULT_HOST; },
/* harmony export */   DEFAULT_P2P_ACCESS_MODE: function() { return /* binding */ DEFAULT_P2P_ACCESS_MODE; },
/* harmony export */   DEFAULT_TEXT_SIZE: function() { return /* binding */ DEFAULT_TEXT_SIZE; },
/* harmony export */   DRAFTY_FR_MIME_TYPE_LEGACY: function() { return /* binding */ DRAFTY_FR_MIME_TYPE_LEGACY; },
/* harmony export */   EDIT_PREVIEW_LENGTH: function() { return /* binding */ EDIT_PREVIEW_LENGTH; },
/* harmony export */   FORWARDED_PREVIEW_LENGTH: function() { return /* binding */ FORWARDED_PREVIEW_LENGTH; },
/* harmony export */   IMAGE_PREVIEW_DIM: function() { return /* binding */ IMAGE_PREVIEW_DIM; },
/* harmony export */   IMAGE_THUMBNAIL_DIM: function() { return /* binding */ IMAGE_THUMBNAIL_DIM; },
/* harmony export */   IMMEDIATE_P2P_SUBSCRIPTION: function() { return /* binding */ IMMEDIATE_P2P_SUBSCRIPTION; },
/* harmony export */   KEYPRESS_DELAY: function() { return /* binding */ KEYPRESS_DELAY; },
/* harmony export */   KNOWN_HOSTS: function() { return /* binding */ KNOWN_HOSTS; },
/* harmony export */   LINK_CONTACT_US: function() { return /* binding */ LINK_CONTACT_US; },
/* harmony export */   LINK_PRIVACY_POLICY: function() { return /* binding */ LINK_PRIVACY_POLICY; },
/* harmony export */   LINK_TERMS_OF_SERVICE: function() { return /* binding */ LINK_TERMS_OF_SERVICE; },
/* harmony export */   LOGGING_ENABLED: function() { return /* binding */ LOGGING_ENABLED; },
/* harmony export */   MAX_AVATAR_BYTES: function() { return /* binding */ MAX_AVATAR_BYTES; },
/* harmony export */   MAX_DURATION: function() { return /* binding */ MAX_DURATION; },
/* harmony export */   MAX_EXTERN_ATTACHMENT_SIZE: function() { return /* binding */ MAX_EXTERN_ATTACHMENT_SIZE; },
/* harmony export */   MAX_IMAGE_DIM: function() { return /* binding */ MAX_IMAGE_DIM; },
/* harmony export */   MAX_INBAND_ATTACHMENT_SIZE: function() { return /* binding */ MAX_INBAND_ATTACHMENT_SIZE; },
/* harmony export */   MAX_ONLINE_IN_TOPIC: function() { return /* binding */ MAX_ONLINE_IN_TOPIC; },
/* harmony export */   MAX_PEER_TITLE_LENGTH: function() { return /* binding */ MAX_PEER_TITLE_LENGTH; },
/* harmony export */   MAX_TAG_COUNT: function() { return /* binding */ MAX_TAG_COUNT; },
/* harmony export */   MAX_TAG_LENGTH: function() { return /* binding */ MAX_TAG_LENGTH; },
/* harmony export */   MAX_TITLE_LENGTH: function() { return /* binding */ MAX_TITLE_LENGTH; },
/* harmony export */   MAX_TOPIC_DESCRIPTION_LENGTH: function() { return /* binding */ MAX_TOPIC_DESCRIPTION_LENGTH; },
/* harmony export */   MEDIA_BREAKPOINT: function() { return /* binding */ MEDIA_BREAKPOINT; },
/* harmony export */   MESSAGES_PAGE: function() { return /* binding */ MESSAGES_PAGE; },
/* harmony export */   MESSAGE_PREVIEW_LENGTH: function() { return /* binding */ MESSAGE_PREVIEW_LENGTH; },
/* harmony export */   MIN_DURATION: function() { return /* binding */ MIN_DURATION; },
/* harmony export */   MIN_SWIPE_DISTANCE: function() { return /* binding */ MIN_SWIPE_DISTANCE; },
/* harmony export */   MIN_TAG_LENGTH: function() { return /* binding */ MIN_TAG_LENGTH; },
/* harmony export */   NEW_GRP_ACCESS_MODE: function() { return /* binding */ NEW_GRP_ACCESS_MODE; },
/* harmony export */   NO_ACCESS_MODE: function() { return /* binding */ NO_ACCESS_MODE; },
/* harmony export */   NO_DIMENSIONS_VIDEO: function() { return /* binding */ NO_DIMENSIONS_VIDEO; },
/* harmony export */   QRCODE_SIZE: function() { return /* binding */ QRCODE_SIZE; },
/* harmony export */   QUOTED_REPLY_LENGTH: function() { return /* binding */ QUOTED_REPLY_LENGTH; },
/* harmony export */   READ_DELAY: function() { return /* binding */ READ_DELAY; },
/* harmony export */   REM_SIZE: function() { return /* binding */ REM_SIZE; },
/* harmony export */   SELF_AVATAR_URI: function() { return /* binding */ SELF_AVATAR_URI; },
/* harmony export */   TOAST_DURATION: function() { return /* binding */ TOAST_DURATION; },
/* harmony export */   VIDEO_PREVIEW_DIM: function() { return /* binding */ VIDEO_PREVIEW_DIM; },
/* harmony export */   VIDEO_THUMBNAIL_WIDTH: function() { return /* binding */ VIDEO_THUMBNAIL_WIDTH; },
/* harmony export */   WAKE_UP_TICK: function() { return /* binding */ WAKE_UP_TICK; },
/* harmony export */   WAKE_UP_TIMEOUT: function() { return /* binding */ WAKE_UP_TIMEOUT; },
/* harmony export */   WALLPAPER_DEFAULTS: function() { return /* binding */ WALLPAPER_DEFAULTS; }
/* harmony export */ });
/* harmony import */ var _version_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./version.js */ "./src/version.js");

const BASE_APP_NAME = 'TinodeWeb';
const APP_NAME = BASE_APP_NAME + '/' + (_version_js__WEBPACK_IMPORTED_MODULE_0__.PACKAGE_VERSION || '0.25');
const API_KEY = 'AQEAAAABAAD_rAp4DJh05a1HAwFT3A6K';
const KNOWN_HOSTS = {
  hosted: 'web.tinode.co',
  local: 'localhost:6060'
};
const DEFAULT_HOST = KNOWN_HOSTS.hosted;
const LOGGING_ENABLED = true;
const KEYPRESS_DELAY = 3_000;
const READ_DELAY = 1_500;
const MIN_TAG_LENGTH = 2;
const MAX_TAG_LENGTH = 96;
const MAX_TAG_COUNT = 16;
const DEFAULT_P2P_ACCESS_MODE = 'JRWPS';
const NEW_GRP_ACCESS_MODE = 'JRWPSAO';
const CHANNEL_ACCESS_MODE = 'JR';
const NO_ACCESS_MODE = 'N';
const MEDIA_BREAKPOINT = 640;
const REM_SIZE = 13;
const AVATAR_SIZE = 384;
const MAX_AVATAR_BYTES = 4096;
const BROKEN_IMAGE_SIZE = 32;
const NO_DIMENSIONS_VIDEO = 128;
const MESSAGES_PAGE = 24;
const MAX_INBAND_ATTACHMENT_SIZE = 262_144;
const MAX_EXTERN_ATTACHMENT_SIZE = 1 << 23;
const MAX_IMAGE_DIM = 1024;
const IMAGE_PREVIEW_DIM = 64;
const VIDEO_PREVIEW_DIM = 96;
const IMAGE_THUMBNAIL_DIM = 36;
const VIDEO_THUMBNAIL_WIDTH = 48;
const MAX_ONLINE_IN_TOPIC = 4;
const MAX_TITLE_LENGTH = 60;
const MAX_TOPIC_DESCRIPTION_LENGTH = 360;
const MAX_PEER_TITLE_LENGTH = 24;
const MESSAGE_PREVIEW_LENGTH = 80;
const QUOTED_REPLY_LENGTH = 30;
const FORWARDED_PREVIEW_LENGTH = 84;
const EDIT_PREVIEW_LENGTH = 48;
const MIN_DURATION = 2_000;
const MAX_DURATION = 600_000;
const LINK_CONTACT_US = 'mailto:support@tinode.co';
const LINK_PRIVACY_POLICY = 'https://tinode.co/privacy.html';
const LINK_TERMS_OF_SERVICE = 'https://tinode.co/terms.html';
const IMMEDIATE_P2P_SUBSCRIPTION = false;
const CLICKABLE_URL_SCHEMES = ['http', 'https', 'ftp', 'ftps'];
const QRCODE_SIZE = 128;
const WAKE_UP_TIMEOUT = 80000;
const WAKE_UP_TICK = 1000;
const MIN_SWIPE_DISTANCE = REM_SIZE * 3;
const SELF_AVATAR_URI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZpZXdCb3g9IjAgMCAxNyAxNyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMy41NjIgMXYxNS40NTlsNC42ODYtMy4yNyA0Ljc1MiAzLjI2di0xNS40NDloLTkuNDM4ek0xMiAxNC41NTFsLTMuNzU2LTIuNTc4LTMuNjgxIDIuNTY4di0xMi41NDFoNy40Mzd2MTIuNTUxeiIgZmlsbD0iIzU1NTU1NSIgLz48L3N2Zz4=';
const TOAST_DURATION = 3_000;
const DEFAULT_COLOR_SCHEME = 'auto';
const DEFAULT_TEXT_SIZE = 10;
const DRAFTY_FR_MIME_TYPE_LEGACY = 'application/json';
const WALLPAPER_DEFAULTS = {
  type: 'patt',
  index: 0,
  path: 'img/bkg/'
};

/***/ }),

/***/ "./src/constants.js":
/*!**************************!*\
  !*** ./src/constants.js ***!
  \**************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CALL_HEAD_STARTED: function() { return /* binding */ CALL_HEAD_STARTED; },
/* harmony export */   CALL_STATE_INCOMING_RECEIVED: function() { return /* binding */ CALL_STATE_INCOMING_RECEIVED; },
/* harmony export */   CALL_STATE_IN_PROGRESS: function() { return /* binding */ CALL_STATE_IN_PROGRESS; },
/* harmony export */   CALL_STATE_NONE: function() { return /* binding */ CALL_STATE_NONE; },
/* harmony export */   CALL_STATE_OUTGOING_INITATED: function() { return /* binding */ CALL_STATE_OUTGOING_INITATED; }
/* harmony export */ });
const CALL_STATE_NONE = 0;
const CALL_STATE_OUTGOING_INITATED = 1;
const CALL_STATE_INCOMING_RECEIVED = 2;
const CALL_STATE_IN_PROGRESS = 3;
const CALL_HEAD_STARTED = 'started';

/***/ }),

/***/ "./src/lib/blob-helpers.js":
/*!*********************************!*\
  !*** ./src/lib/blob-helpers.js ***!
  \*********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MIME_EXTENSIONS: function() { return /* binding */ MIME_EXTENSIONS; },
/* harmony export */   SUPPORTED_IMAGE_FORMATS: function() { return /* binding */ SUPPORTED_IMAGE_FORMATS; },
/* harmony export */   base64DecodedLen: function() { return /* binding */ base64DecodedLen; },
/* harmony export */   base64EncodedLen: function() { return /* binding */ base64EncodedLen; },
/* harmony export */   base64ReEncode: function() { return /* binding */ base64ReEncode; },
/* harmony export */   base64ToBlob: function() { return /* binding */ base64ToBlob; },
/* harmony export */   base64ToIntArray: function() { return /* binding */ base64ToIntArray; },
/* harmony export */   blobToBase64: function() { return /* binding */ blobToBase64; },
/* harmony export */   fileNameForMime: function() { return /* binding */ fileNameForMime; },
/* harmony export */   filePasted: function() { return /* binding */ filePasted; },
/* harmony export */   fileToBase64: function() { return /* binding */ fileToBase64; },
/* harmony export */   fitImageSize: function() { return /* binding */ fitImageSize; },
/* harmony export */   getMimeType: function() { return /* binding */ getMimeType; },
/* harmony export */   imageCrop: function() { return /* binding */ imageCrop; },
/* harmony export */   imageScaled: function() { return /* binding */ imageScaled; },
/* harmony export */   importVCard: function() { return /* binding */ importVCard; },
/* harmony export */   intArrayToBase64: function() { return /* binding */ intArrayToBase64; },
/* harmony export */   makeImageUrl: function() { return /* binding */ makeImageUrl; }
/* harmony export */ });
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_0__);

const SUPPORTED_IMAGE_FORMATS = ['image/jpeg', 'image/gif', 'image/png', 'image/svg', 'image/svg+xml'];
const MIME_EXTENSIONS = ['jpg', 'gif', 'png', 'svg', 'svg'];
function makeImageUrl(photo) {
  if (photo && typeof photo == 'object') {
    if (photo.ref) {
      return photo.ref;
    }
    if (photo.data && photo.type) {
      const mime = photo.type.startsWith('image/') ? photo.type : 'image/' + photo.type;
      return 'data:' + mime + ';base64,' + photo.data;
    }
  }
  return null;
}
function fitImageSize(width, height, maxWidth, maxHeight, forceSquare) {
  width = width | 0;
  height = height | 0;
  maxWidth = maxWidth | 0;
  maxHeight = maxHeight | 0;
  if (width <= 0 || height <= 0 || maxWidth <= 0 || maxHeight <= 0) {
    return null;
  }
  if (forceSquare) {
    maxWidth = maxHeight = Math.min(maxWidth, maxHeight);
  }
  const scale = Math.min(Math.min(width, maxWidth) / width, Math.min(height, maxHeight) / height);
  const size = {
    dstWidth: width * scale | 0,
    dstHeight: height * scale | 0
  };
  if (forceSquare) {
    size.dstWidth = size.dstHeight = Math.min(size.dstWidth, size.dstHeight);
    size.srcWidth = size.srcHeight = Math.min(width, height);
    size.xoffset = (width - size.srcWidth) / 2 | 0;
    size.yoffset = (height - size.srcWidth) / 2 | 0;
  } else {
    size.xoffset = size.yoffset = 0;
    size.srcWidth = width;
    size.srcHeight = height;
  }
  return size;
}
function fileNameForMime(fname, mime) {
  const idx = SUPPORTED_IMAGE_FORMATS.indexOf(mime);
  if (idx < 0 || !fname) {
    return fname;
  }
  const ext = MIME_EXTENSIONS[idx];
  const at = fname.lastIndexOf('.');
  if (at >= 0) {
    fname = fname.substring(0, at);
  }
  return fname + '.' + ext;
}
function imageScaled(fileOrBlob, maxWidth, maxHeight, maxSize, forceSquare) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onerror = function (err) {
      reject(new Error("Image format unrecognized"));
    };
    img.onload = async function () {
      URL.revokeObjectURL(img.src);
      const dim = fitImageSize(img.width, img.height, maxWidth, maxHeight, forceSquare);
      if (!dim) {
        reject(new Error("Invalid image"));
        return;
      }
      let canvas = document.createElement('canvas');
      canvas.width = dim.dstWidth;
      canvas.height = dim.dstHeight;
      let ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(img, dim.xoffset, dim.yoffset, dim.srcWidth, dim.srcHeight, 0, 0, dim.dstWidth, dim.dstHeight);
      const mime = SUPPORTED_IMAGE_FORMATS.includes(fileOrBlob.type) ? fileOrBlob.type : 'image/jpeg';
      let blob = await new Promise(resolve => canvas.toBlob(resolve, mime));
      if (!blob) {
        reject(new Error("Unsupported image format"));
        return;
      }
      while (maxSize > 0 && blob.length > maxSize) {
        dim.dstWidth = dim.dstWidth * 0.70710678118 | 0;
        dim.dstHeight = dim.dstHeight * 0.70710678118 | 0;
        canvas.width = dim.dstWidth;
        canvas.height = dim.dstHeight;
        ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, dim.xoffset, dim.yoffset, dim.srcWidth, dim.srcHeight, 0, 0, dim.dstWidth, dim.dstHeight);
        blob = await new Promise(resolve => canvas.toBlob(resolve, mime));
      }
      canvas = null;
      resolve({
        mime: mime,
        blob: blob,
        width: dim.dstWidth,
        height: dim.dstHeight,
        name: fileNameForMime(fileOrBlob.name, mime)
      });
    };
    img.src = URL.createObjectURL(fileOrBlob);
  });
}
function imageCrop(mime, objURL, left, top, width, height, scale) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onerror = _ => {
      reject(new Error("Image format unrecognized"));
    };
    img.onload = _ => {
      URL.revokeObjectURL(img.src);
      let canvas = document.createElement('canvas');
      canvas.width = width * scale;
      canvas.height = height * scale;
      let ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(img, left, top, width, height, 0, 0, canvas.width, canvas.height);
      mime = SUPPORTED_IMAGE_FORMATS.includes(mime) ? mime : 'image/jpeg';
      canvas.toBlob(blob => {
        canvas = null;
        if (blob) {
          resolve({
            mime: mime,
            blob: blob,
            width: width,
            height: height
          });
        } else {
          reject(new Error("Unsupported image format"));
        }
      }, mime);
    };
    img.src = objURL;
  });
}
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = _ => {
      reject(reader.error);
    };
    reader.onload = _ => {
      resolve({
        mime: file.type,
        bits: reader.result.split(',')[1],
        name: file.name
      });
    };
    reader.readAsDataURL(file);
  });
}
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = _ => {
      reject(reader.error);
    };
    reader.onload = _ => {
      resolve({
        mime: blob.type,
        bits: reader.result.split(',')[1]
      });
    };
    reader.readAsDataURL(blob);
  });
}
function filePasted(event, onImageSuccess, onAttachmentSuccess, onError) {
  const items = (event.clipboardData || event.originalEvent.clipboardData || {}).items;
  if (!items || !items.length) {
    return false;
  }
  for (let i in items) {
    const item = items[i];
    if (item.kind === 'file') {
      const file = item.getAsFile();
      if (!file) {
        console.error("Failed to get file object from pasted file item", item.kind, item.type);
        onError("Failed to get file object from pasted file item");
        continue;
      }
      if (file.type && file.type.split('/')[0] == 'image') {
        onImageSuccess(file);
      } else {
        onAttachmentSuccess(file);
      }
      return true;
    }
  }
  return false;
}
function getMimeType(header) {
  const mime = /^data:(image\/[-+a-z0-9.]+);base64/.exec(header);
  return mime && mime.length > 1 ? mime[1] : null;
}
function base64EncodedLen(n) {
  return Math.floor((n + 2) / 3) * 4;
}
function base64DecodedLen(n) {
  return Math.floor(n / 4) * 3;
}
function base64ReEncode(str) {
  if (str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    try {
      str = btoa(atob(str));
    } catch (err) {
      console.error("Failed to base64 re-encode string.", err);
      str = null;
    }
  }
  return str;
}
function base64ToBlob(str, mime) {
  if (!str) {
    return null;
  }
  try {
    const bin = atob(str);
    const length = bin.length;
    const buf = new ArrayBuffer(length);
    const arr = new Uint8Array(buf);
    for (let i = 0; i < length; i++) {
      arr[i] = bin.charCodeAt(i);
    }
    return new Blob([buf], {
      type: mime
    });
  } catch (err) {
    console.error("Failed to convert base64 to blob: ", err);
  }
  return null;
}
function intArrayToBase64(arr) {
  if (!Array.isArray(arr)) {
    return null;
  }
  try {
    let bin = '';
    new Uint8Array(arr).forEach(b => bin += String.fromCharCode(b));
    return window.btoa(bin);
  } catch (err) {}
  return null;
}
function base64ToIntArray(b64) {
  const arr = [];
  try {
    const bin = window.atob(b64);
    [...bin].forEach(c => {
      arr.push(c.charCodeAt(0));
    });
    return arr;
  } catch (err) {}
  return null;
}
function importVCard(fileOrBlob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = _ => {
      reject(reader.error);
    };
    reader.onload = _ => {
      const card = tinode_sdk__WEBPACK_IMPORTED_MODULE_0__.TheCard.importVCard(reader.result);
      if (!card) {
        reject(new Error("Failed to parse vCard"));
        return;
      }
      resolve(card);
    };
    reader.readAsText(fileOrBlob);
  });
}

/***/ }),

/***/ "./src/lib/formatters.js":
/*!*******************************!*\
  !*** ./src/lib/formatters.js ***!
  \*******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fullFormatter: function() { return /* binding */ fullFormatter; },
/* harmony export */   previewFormatter: function() { return /* binding */ previewFormatter; },
/* harmony export */   replyFormatter: function() { return /* binding */ replyFormatter; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _widgets_audio_player_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../widgets/audio-player.jsx */ "./src/widgets/audio-player.jsx");
/* harmony import */ var _widgets_call_message_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../widgets/call-message.jsx */ "./src/widgets/call-message.jsx");
/* harmony import */ var _widgets_call_status_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../widgets/call-status.jsx */ "./src/widgets/call-status.jsx");
/* harmony import */ var _widgets_inline_video_jsx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../widgets/inline-video.jsx */ "./src/widgets/inline-video.jsx");
/* harmony import */ var _widgets_lazy_image_jsx__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../widgets/lazy-image.jsx */ "./src/widgets/lazy-image.jsx");
/* harmony import */ var _widgets_the_card_mini_jsx__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../widgets/the-card-mini.jsx */ "./src/widgets/the-card-mini.jsx");
/* harmony import */ var _widgets_uploading_image_jsx__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../widgets/uploading-image.jsx */ "./src/widgets/uploading-image.jsx");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _blob_helpers_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./blob-helpers.js */ "./src/lib/blob-helpers.js");
/* harmony import */ var _strformat_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./strformat.js */ "./src/lib/strformat.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./utils.js */ "./src/lib/utils.js");














const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  drafty_form: {
    id: 'drafty_form',
    defaultMessage: 'Form: ',
    description: 'Comment for form in Drafty'
  },
  drafty_attachment: {
    id: 'drafty_attachment',
    defaultMessage: 'Attachment',
    description: 'Comment for attachment in Drafty'
  },
  drafty_image: {
    id: 'drafty_image',
    defaultMessage: 'Picture',
    description: 'Comment for embedded images in Drafty'
  },
  drafty_video: {
    id: 'drafty_video',
    defaultMessage: 'Video recording',
    description: 'Comment for videos embedded in Drafty'
  },
  drafty_unknown: {
    id: 'drafty_unknown',
    defaultMessage: 'Unsupported',
    description: 'Unsupported entity in drafty'
  }
});
function fullFormatter(style, data, values, key, stack) {
  if (stack.includes('QQ')) {
    return quoteFormatter.call(this, style, data, values, key);
  }
  if (!style) {
    return values;
  }
  let el = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.tagName(style);
  let attr = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.attrValue(style, data) || {};
  attr.key = key;
  switch (style) {
    case 'AU':
      if (attr.src) {
        attr.src = this.authorizeURL((0,_utils_js__WEBPACK_IMPORTED_MODULE_13__.sanitizeUrlForMime)(attr.src, 'audio'));
        attr.duration = data.duration > 0 ? data.duration | 0 : undefined;
        attr.preview = data.preview;
        attr.loading = 'lazy';
      }
      el = _widgets_audio_player_jsx__WEBPACK_IMPORTED_MODULE_3__["default"];
      values = null;
      break;
    case 'BR':
      values = null;
      break;
    case 'EX':
      break;
    case 'HL':
      attr.className = 'highlight';
      break;
    case 'HD':
      el = null;
      values = null;
      break;
    case 'IM':
      el = handleImageData.call(this, el, data, attr);
      values = null;
      break;
    case 'BN':
      attr.onClick = e => this.onHandleClick(e, 'form_button');
      let inner = react__WEBPACK_IMPORTED_MODULE_0___default().Children.map(values, child => {
        return typeof child == 'string' ? child : undefined;
      });
      if (!inner || inner.length == 0) {
        inner = [attr.name];
      }
      attr['data-title'] = inner.join('');
      break;
    case 'LN':
      if (attr) {
        attr.href = typeof attr.href == 'string' ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_13__.sanitizeUrl)(attr.href, _config_js__WEBPACK_IMPORTED_MODULE_10__.CLICKABLE_URL_SCHEMES) : '';
      }
      break;
    case 'MN':
      attr.className = 'mention';
      if (data) {
        attr.className += ' ' + (0,_strformat_js__WEBPACK_IMPORTED_MODULE_12__.idToColorClass)(data.val, false, true);
      }
      break;
    case 'FM':
      attr.className = 'bot-form';
      break;
    case 'RW':
      break;
    case 'QQ':
      attr.className = 'reply-quote';
      attr.onClick = e => this.onHandleClick(e, 'quote');
      break;
    case 'TC':
      el = _widgets_the_card_mini_jsx__WEBPACK_IMPORTED_MODULE_8__["default"];
      attr.content = data;
      attr.authorizeURL = this.authorizeURL;
      attr.onChatClick = e => this.onHandleClick(e, 'contact_chat');
      attr.onFindClick = e => this.onHandleClick(e, 'contact_find');
      values = null;
      break;
    case 'VC':
      el = _widgets_call_message_jsx__WEBPACK_IMPORTED_MODULE_4__["default"];
      values = null;
      if (data) {
        attr.callState = data.state;
        attr.incoming = data.incoming;
        attr.duration = data.duration;
      }
      break;
    case 'VD':
      el = handleVideoData.call(this, el, data, attr);
      values = null;
      break;
    default:
      if (!el) {
        el = (react__WEBPACK_IMPORTED_MODULE_0___default().Fragment);
        attr = {
          key: key
        };
        let body = values;
        if (!Array.isArray(values) || !values.join('').trim()) {
          body = [react__WEBPACK_IMPORTED_MODULE_0___default().createElement('span', {
            key: 'x1',
            className: 'gray'
          }, this.formatMessage(messages.drafty_unknown))];
        }
        values = [react__WEBPACK_IMPORTED_MODULE_0___default().createElement('i', {
          key: 'x0',
          className: 'material-icons gray'
        }, 'extension'), ' '].concat(body);
      }
      break;
  }
  if (!el) {
    return values;
  }
  return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(el, attr, values);
}
function handleImageData(el, data, attr) {
  if (!data) {
    attr.src = 'img/broken_image.png';
    attr.style = {
      width: _config_js__WEBPACK_IMPORTED_MODULE_10__.IMAGE_THUMBNAIL_DIM + 'px',
      height: _config_js__WEBPACK_IMPORTED_MODULE_10__.IMAGE_THUMBNAIL_DIM + 'px'
    };
    return el;
  }
  attr.className = 'inline-image';
  const dim = (0,_blob_helpers_js__WEBPACK_IMPORTED_MODULE_11__.fitImageSize)(data.width, data.height, this.viewportWidth > 0 ? Math.min(this.viewportWidth - _config_js__WEBPACK_IMPORTED_MODULE_10__.REM_SIZE * 6.5, _config_js__WEBPACK_IMPORTED_MODULE_10__.REM_SIZE * 34.5) : _config_js__WEBPACK_IMPORTED_MODULE_10__.REM_SIZE * 34.5, _config_js__WEBPACK_IMPORTED_MODULE_10__.REM_SIZE * 24, false) || {
    dstWidth: _config_js__WEBPACK_IMPORTED_MODULE_10__.BROKEN_IMAGE_SIZE,
    dstHeight: _config_js__WEBPACK_IMPORTED_MODULE_10__.BROKEN_IMAGE_SIZE
  };
  attr.style = {
    width: dim.dstWidth + 'px',
    height: dim.dstHeight + 'px',
    minWidth: dim.dstWidth + 'px',
    minHeight: dim.dstHeight + 'px'
  };
  if (!tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.isProcessing(data)) {
    attr.src = this.authorizeURL((0,_utils_js__WEBPACK_IMPORTED_MODULE_13__.sanitizeUrlForMime)(attr.src, 'image'));
    attr.alt = data.name;
    if (attr.src) {
      if (Math.max(data.width || 0, data.height || 0) > _config_js__WEBPACK_IMPORTED_MODULE_10__.IMAGE_THUMBNAIL_DIM) {
        attr.onClick = e => this.onHandleClick(e, 'image');
        attr.className += ' image-clickable';
      }
      attr.loading = 'lazy';
    } else {
      attr.src = null;
    }
  } else {
    el = _widgets_uploading_image_jsx__WEBPACK_IMPORTED_MODULE_9__["default"];
  }
  return el;
}
function handleVideoData(el, data, attr) {
  if (!data) {
    attr.src = 'img/broken_video.png';
    attr.style = {
      width: _config_js__WEBPACK_IMPORTED_MODULE_10__.IMAGE_THUMBNAIL_DIM + 'px',
      height: _config_js__WEBPACK_IMPORTED_MODULE_10__.IMAGE_THUMBNAIL_DIM + 'px'
    };
    return el;
  }
  attr.className = 'inline-image';
  const dim = (0,_blob_helpers_js__WEBPACK_IMPORTED_MODULE_11__.fitImageSize)(data.width, data.height, this.viewportWidth > 0 ? Math.min(this.viewportWidth - _config_js__WEBPACK_IMPORTED_MODULE_10__.REM_SIZE * 6.5, _config_js__WEBPACK_IMPORTED_MODULE_10__.REM_SIZE * 34.5) : _config_js__WEBPACK_IMPORTED_MODULE_10__.REM_SIZE * 34.5, _config_js__WEBPACK_IMPORTED_MODULE_10__.REM_SIZE * 24, false) || {
    dstWidth: _config_js__WEBPACK_IMPORTED_MODULE_10__.NO_DIMENSIONS_VIDEO,
    dstHeight: _config_js__WEBPACK_IMPORTED_MODULE_10__.NO_DIMENSIONS_VIDEO
  };
  attr.style = {
    width: dim.dstWidth + 'px',
    height: dim.dstHeight + 'px',
    minWidth: dim.dstWidth + 'px',
    minHeight: dim.dstHeight + 'px'
  };
  if (!tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.isProcessing(data)) {
    attr.src = this.authorizeURL((0,_utils_js__WEBPACK_IMPORTED_MODULE_13__.sanitizeUrlForMime)(attr.src, 'image'));
    attr.alt = data.name;
    if (data.ref || data.val) {
      attr.onClick = e => this.onHandleClick(e, 'video');
      attr.loading = 'lazy';
    }
    el = _widgets_inline_video_jsx__WEBPACK_IMPORTED_MODULE_6__["default"];
  } else {
    el = _widgets_uploading_image_jsx__WEBPACK_IMPORTED_MODULE_9__["default"];
  }
  return el;
}
function previewFormatter(style, data, values, key) {
  if (!style) {
    return values;
  }
  let el = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.tagName(style);
  const attr = {
    key: key
  };
  switch (style) {
    case 'AU':
      el = (react__WEBPACK_IMPORTED_MODULE_0___default().Fragment);
      values = [react__WEBPACK_IMPORTED_MODULE_0___default().createElement('i', {
        key: 'au',
        className: 'material-icons'
      }, 'mic'), ' ', (0,_strformat_js__WEBPACK_IMPORTED_MODULE_12__.secondsToTime)(data.duration / 1000)];
      break;
    case 'BR':
      el = (react__WEBPACK_IMPORTED_MODULE_0___default().Fragment);
      values = [' '];
      break;
    case 'HL':
      attr.className = 'highlight preview';
      break;
    case 'LN':
    case 'MN':
      el = 'span';
      break;
    case 'IM':
      el = (react__WEBPACK_IMPORTED_MODULE_0___default().Fragment);
      values = [react__WEBPACK_IMPORTED_MODULE_0___default().createElement('i', {
        key: 'im',
        className: 'material-icons'
      }, 'photo'), ' ', this.formatMessage(messages.drafty_image)];
      break;
    case 'BN':
      el = 'span';
      attr.className = 'flat-button faux';
      break;
    case 'FM':
      el = (react__WEBPACK_IMPORTED_MODULE_0___default().Fragment);
      values = [react__WEBPACK_IMPORTED_MODULE_0___default().createElement('i', {
        key: 'fm',
        className: 'material-icons'
      }, 'dashboard'), this.formatMessage(messages.drafty_form)].concat(' ', values || []);
      break;
    case 'RW':
      el = (react__WEBPACK_IMPORTED_MODULE_0___default().Fragment);
      break;
    case 'EX':
      if (data) {
        if (tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.isFormResponseType(data.mime)) {
          return null;
        }
        delete data.val;
        delete data.ref;
      }
      el = (react__WEBPACK_IMPORTED_MODULE_0___default().Fragment);
      values = [react__WEBPACK_IMPORTED_MODULE_0___default().createElement('i', {
        key: 'ex',
        className: 'material-icons'
      }, 'attachment'), ' ', this.formatMessage(messages.drafty_attachment)];
      break;
    case 'VC':
      el = _widgets_call_status_jsx__WEBPACK_IMPORTED_MODULE_5__["default"];
      if (data) {
        attr.callState = data.state;
        attr.incoming = data.incoming;
        attr.duration = data.duration;
      }
      values = null;
      break;
    case 'QQ':
    case 'HD':
      el = null;
      values = null;
      break;
    case 'TC':
      el = (react__WEBPACK_IMPORTED_MODULE_0___default().Fragment);
      values = [react__WEBPACK_IMPORTED_MODULE_0___default().createElement('i', {
        key: 'tc',
        className: 'material-icons'
      }, 'contact_mail'), ' ', tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.TheCard.getFn(data) || this.formatMessage(messages.drafty_unknown)];
      break;
    case 'VD':
      el = (react__WEBPACK_IMPORTED_MODULE_0___default().Fragment);
      values = [react__WEBPACK_IMPORTED_MODULE_0___default().createElement('i', {
        key: 'im',
        className: 'material-icons'
      }, 'play_circle_outline'), ' ', this.formatMessage(messages.drafty_video)];
      break;
    default:
      if (!el) {
        el = (react__WEBPACK_IMPORTED_MODULE_0___default().Fragment);
        values = [react__WEBPACK_IMPORTED_MODULE_0___default().createElement('i', {
          key: 'x0',
          className: 'material-icons gray'
        }, 'extension'), ' ', this.formatMessage(messages.drafty_unknown)];
      }
      break;
  }
  if (!el) {
    return values;
  }
  return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(el, attr, values);
}
;
function inlineImageAttr(attr, data) {
  attr.style = {
    width: _config_js__WEBPACK_IMPORTED_MODULE_10__.IMAGE_THUMBNAIL_DIM + 'px',
    height: _config_js__WEBPACK_IMPORTED_MODULE_10__.IMAGE_THUMBNAIL_DIM + 'px',
    maxWidth: _config_js__WEBPACK_IMPORTED_MODULE_10__.IMAGE_THUMBNAIL_DIM + 'px',
    maxHeight: _config_js__WEBPACK_IMPORTED_MODULE_10__.IMAGE_THUMBNAIL_DIM + 'px'
  };
  attr.className = 'inline-image';
  attr.alt = this.formatMessage(messages.drafty_image);
  if (!data) {
    attr.src = 'img/broken_image.png';
  } else {
    attr.src = attr.src || 'img/broken_image.png';
  }
  attr.title = attr.alt;
  return attr;
}
function inlineVideoAttr(attr, data) {
  const dim = (0,_blob_helpers_js__WEBPACK_IMPORTED_MODULE_11__.fitImageSize)(data.width, data.height, _config_js__WEBPACK_IMPORTED_MODULE_10__.VIDEO_THUMBNAIL_WIDTH, _config_js__WEBPACK_IMPORTED_MODULE_10__.IMAGE_THUMBNAIL_DIM);
  attr.style = {
    width: dim.width + 'px',
    height: dim.height + 'px',
    maxWidth: _config_js__WEBPACK_IMPORTED_MODULE_10__.VIDEO_THUMBNAIL_WIDTH + 'px',
    maxHeight: _config_js__WEBPACK_IMPORTED_MODULE_10__.IMAGE_THUMBNAIL_DIM + 'px'
  };
  attr.className = 'inline-image';
  attr.alt = this.formatMessage(messages.drafty_video);
  attr.title = attr.alt;
  if (!data) {
    attr.src = 'img/broken_video.png';
  } else {
    attr.src = attr.src || 'img/broken_video.png';
  }
  return attr;
}
function quoteFormatter(style, data, values, key) {
  if (['BR', 'EX', 'IM', 'MN', 'VD'].includes(style)) {
    let el = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.tagName(style);
    let attr = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.attrValue(style, data) || {};
    attr.key = key;
    switch (style) {
      case 'BR':
        values = null;
        break;
      case 'IM':
        attr = inlineImageAttr.call(this, attr, data);
        values = [react__WEBPACK_IMPORTED_MODULE_0___default().createElement('img', attr, null), ' ', attr.alt];
        el = (react__WEBPACK_IMPORTED_MODULE_0___default().Fragment);
        attr = {
          key: key
        };
        break;
      case 'VD':
        attr = inlineVideoAttr.call(this, attr, data);
        values = [react__WEBPACK_IMPORTED_MODULE_0___default().createElement('img', attr, null), ' ', attr.alt];
        el = (react__WEBPACK_IMPORTED_MODULE_0___default().Fragment);
        attr = {
          key: key
        };
        break;
      case 'MN':
        el = 'span';
        attr.className = 'mention';
        if (data) {
          attr.className += ' ' + (0,_strformat_js__WEBPACK_IMPORTED_MODULE_12__.idToColorClass)(data.val, false, true);
        }
        break;
      case 'EX':
        let fname;
        if (data) {
          if (tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.isFormResponseType(data.mime)) {
            return null;
          }
          fname = data.name;
          delete data.val;
          delete data.ref;
        }
        el = (react__WEBPACK_IMPORTED_MODULE_0___default().Fragment);
        values = [react__WEBPACK_IMPORTED_MODULE_0___default().createElement('i', {
          key: 'ex',
          className: 'material-icons'
        }, 'attachment'), (0,_strformat_js__WEBPACK_IMPORTED_MODULE_12__.shortenFileName)(fname, 16) || this.formatMessage(messages.drafty_attachment)];
        break;
    }
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(el, attr, values);
  }
  return previewFormatter.call(this, style, data, values, key);
}
function quoteImageOrVideo(data, isVideo) {
  let promise;
  let bits, ref, mime;
  if (isVideo) {
    bits = data.preview;
    mime = data.premime || 'image/jpeg';
    ref = data.preref;
  } else {
    bits = data.val;
    mime = data.mime;
    ref = data.ref;
  }
  if (bits) {
    const blob = (0,_blob_helpers_js__WEBPACK_IMPORTED_MODULE_11__.base64ToBlob)(bits, mime);
    if (!blob) {
      throw new Error("Invalid image");
    }
    promise = Promise.resolve(blob);
  } else if (ref) {
    promise = fetch(this.authorizeURL((0,_utils_js__WEBPACK_IMPORTED_MODULE_13__.sanitizeUrlForMime)(ref, 'image'))).then(evt => {
      if (evt.ok) {
        return evt.blob();
      } else {
        throw new Error(`Image fetch unsuccessful: ${evt.status} ${evt.statusText}`);
      }
    });
  } else {
    throw new Error("Missing image data");
  }
  return promise.then(blob => {
    return (0,_blob_helpers_js__WEBPACK_IMPORTED_MODULE_11__.imageScaled)(blob, isVideo ? _config_js__WEBPACK_IMPORTED_MODULE_10__.VIDEO_THUMBNAIL_WIDTH : _config_js__WEBPACK_IMPORTED_MODULE_10__.IMAGE_THUMBNAIL_DIM, _config_js__WEBPACK_IMPORTED_MODULE_10__.IMAGE_THUMBNAIL_DIM, -1, !isVideo);
  }).then(scaled => {
    if (isVideo) {
      data.premime = scaled.mime;
    } else {
      data.mime = scaled.mime;
    }
    data.size = scaled.blob.size;
    data.width = scaled.width;
    data.height = scaled.height;
    delete data.ref;
    delete data.preref;
    data.src = URL.createObjectURL(scaled.blob);
    return (0,_blob_helpers_js__WEBPACK_IMPORTED_MODULE_11__.blobToBase64)(scaled.blob);
  }).then(b64 => {
    if (isVideo) {
      data.preview = b64.bits;
    } else {
      data.val = b64.bits;
    }
    return data;
  }).catch(err => {
    delete data.val;
    delete data.preview;
    delete data.src;
    data.width = _config_js__WEBPACK_IMPORTED_MODULE_10__.IMAGE_THUMBNAIL_DIM;
    data.height = _config_js__WEBPACK_IMPORTED_MODULE_10__.IMAGE_THUMBNAIL_DIM;
    throw err;
  });
}
function replyFormatter(style, data, values, key, stack) {
  if (style == 'IM' || style == 'VD') {
    const isImage = style == 'IM';
    const attr = isImage ? inlineImageAttr.call(this, {
      key: key
    }, data) : inlineVideoAttr.call(this, {
      key: key
    }, data);
    let loadedPromise;
    try {
      loadedPromise = (0,_utils_js__WEBPACK_IMPORTED_MODULE_13__.cancelablePromise)(quoteImageOrVideo.call(this, data, style == 'VD'));
    } catch (error) {
      console.warn("Failed to quote image:", error.message);
      loadedPromise = (0,_utils_js__WEBPACK_IMPORTED_MODULE_13__.cancelablePromise)(error);
    }
    attr.whenDone = loadedPromise;
    values = [react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_lazy_image_jsx__WEBPACK_IMPORTED_MODULE_7__["default"], attr, null), ' ', attr.alt];
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), {
      key: key
    }, values);
  } else if (style == 'QQ') {
    if (stack.includes('QQ')) {
      return react__WEBPACK_IMPORTED_MODULE_0___default().createElement('span', {
        key: key
      }, [react__WEBPACK_IMPORTED_MODULE_0___default().createElement('i', {
        key: 'qq',
        className: 'material-icons'
      }, 'format_quote'), ' ']);
    }
    const attr = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.attrValue('QQ', data) || {};
    attr.key = key;
    attr.className = 'reply-quote';
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.tagName('QQ'), attr, values);
  }
  return quoteFormatter.call(this, style, data, values, key);
}

/***/ }),

/***/ "./src/lib/host-name.js":
/*!******************************!*\
  !*** ./src/lib/host-name.js ***!
  \******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   detectServerAddress: function() { return /* binding */ detectServerAddress; },
/* harmony export */   isLocalHost: function() { return /* binding */ isLocalHost; },
/* harmony export */   isSecureConnection: function() { return /* binding */ isSecureConnection; }
/* harmony export */ });
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config.js */ "./src/config.js");

function detectServerAddress() {
  let host = _config_js__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_HOST;
  if (typeof window.location == 'object') {
    if (window.location.protocol == 'file:' || window.location.hostname == 'localhost') {
      host = _config_js__WEBPACK_IMPORTED_MODULE_0__.KNOWN_HOSTS.local;
    } else if (window.location.hostname) {
      host = window.location.hostname + (window.location.port ? ':' + window.location.port : '');
    }
  }
  return host;
}
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

/***/ }),

/***/ "./src/lib/local-storage.js":
/*!**********************************!*\
  !*** ./src/lib/local-storage.js ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ LocalStorageUtil; }
/* harmony export */ });
class LocalStorageUtil {
  static setObject(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  static getObject(key) {
    const value = localStorage.getItem(key);
    return value && JSON.parse(value);
  }
  static updateObject(key, value) {
    const oldVal = this.getObject(key);
    this.setObject(key, Object.assign(oldVal || {}, value));
  }
  static removeItem(key) {
    localStorage.removeItem(key);
  }
}

/***/ }),

/***/ "./src/lib/navigation.js":
/*!*******************************!*\
  !*** ./src/lib/navigation.js ***!
  \*******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ HashNavigation; }
/* harmony export */ });
class HashNavigation {
  static parseUrlHash(hash) {
    const parts = hash.split('?', 2);
    const params = {};
    let path = [];
    if (parts[0]) {
      path = parts[0].replace('#', '').split('/');
    }
    if (parts[1]) {
      parts[1].split('&').forEach(arg => {
        const eq = arg.indexOf('=');
        if (eq > 0) {
          params[arg.slice(0, eq)] = decodeURIComponent(arg.slice(eq + 1));
        }
      });
    }
    return {
      path: path,
      params: params
    };
  }
  static navigateTo(url) {
    window.location.hash = url;
  }
  static composeUrlHash(path, params) {
    let url = path.join('/');
    const args = [];
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        if (params[key] !== undefined) {
          args.push(key + '=' + encodeURIComponent(params[key]));
        }
      }
    }
    if (args.length > 0) {
      url += '?' + args.join('&');
    }
    return url;
  }
  static addUrlParam(hash, key, value) {
    const parsed = HashNavigation.parseUrlHash(hash);
    parsed.params[key] = value;
    return HashNavigation.composeUrlHash(parsed.path, parsed.params);
  }
  static removeUrlParam(hash, key) {
    const parsed = HashNavigation.parseUrlHash(hash);
    delete parsed.params[key];
    return HashNavigation.composeUrlHash(parsed.path, parsed.params);
  }
  static removeUrlParams(hash, keys) {
    if (!Array.isArray(keys)) {
      keys = [keys];
    }
    const parsed = HashNavigation.parseUrlHash(hash);
    for (const key of keys) {
      delete parsed.params[key];
    }
    return HashNavigation.composeUrlHash(parsed.path, parsed.params);
  }
  static setUrlSidePanel(hash, sidepanel) {
    const parsed = HashNavigation.parseUrlHash(hash);
    parsed.path[0] = sidepanel;
    return HashNavigation.composeUrlHash(parsed.path, parsed.params);
  }
  static setUrlInfoPanel(hash, infopanel) {
    const parsed = HashNavigation.parseUrlHash(hash);
    if (infopanel) {
      parsed.params.info = infopanel;
    } else {
      delete parsed.params.info;
    }
    return HashNavigation.composeUrlHash(parsed.path, parsed.params);
  }
  static setUrlTopic(hash, topic) {
    const parsed = HashNavigation.parseUrlHash(hash);
    parsed.path[1] = topic;
    delete parsed.params.info;
    return HashNavigation.composeUrlHash(parsed.path, parsed.params);
  }
}

/***/ }),

/***/ "./src/lib/strformat.js":
/*!******************************!*\
  !*** ./src/lib/strformat.js ***!
  \******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bytesToHumanSize: function() { return /* binding */ bytesToHumanSize; },
/* harmony export */   flagEmoji: function() { return /* binding */ flagEmoji; },
/* harmony export */   idToColorClass: function() { return /* binding */ idToColorClass; },
/* harmony export */   letterTileColorId: function() { return /* binding */ letterTileColorId; },
/* harmony export */   relativeDateFormat: function() { return /* binding */ relativeDateFormat; },
/* harmony export */   secondsToTime: function() { return /* binding */ secondsToTime; },
/* harmony export */   shortDateFormat: function() { return /* binding */ shortDateFormat; },
/* harmony export */   shortenFileName: function() { return /* binding */ shortenFileName; },
/* harmony export */   truncateString: function() { return /* binding */ truncateString; }
/* harmony export */ });
function shortDateFormat(then, locale) {
  locale = locale || window.navigator.userLanguage || window.navigator.language;
  const now = new Date();
  if (then.getFullYear() == now.getFullYear()) {
    if (then.getMonth() == now.getMonth() && then.getDate() == now.getDate()) {
      return then.toLocaleTimeString(locale, {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return then.toLocaleDateString(locale, {
      hour12: false,
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  return then.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}
function relativeDateFormat(then, locale) {
  locale = locale || window.navigator.userLanguage || window.navigator.language;
  const now = new Date();
  const thenDays = Math.floor((then.getTime() - then.getTimezoneOffset() * 60_000) / 86_400_000);
  const nowDays = Math.floor((now.getTime() - now.getTimezoneOffset() * 60_000) / 86_400_000);
  const diff = thenDays - nowDays;
  if (Math.abs(diff) < 2) {
    return new Intl.RelativeTimeFormat(locale, {
      numeric: 'auto'
    }).format(diff, 'day');
  }
  return new Intl.DateTimeFormat(locale).format(then);
}
function secondsToTime(seconds, fixedMin) {
  if (typeof seconds != 'number') {
    return '';
  }
  let min = (Math.floor(seconds / 60) | 0) % 60;
  let hours = Math.floor(seconds / 3600) | 0;
  if (fixedMin || hours > 0) {
    min = min < 10 ? `0${min}` : min;
  }
  let sec = (seconds | 0) % 60;
  sec = sec < 10 ? `0${sec}` : sec;
  if (hours == 0) {
    return `${min}:${sec}`;
  }
  return `${hours}:${min}:${sec}`;
}
function bytesToHumanSize(bytes) {
  if (!bytes || bytes == 0) {
    return '0 Bytes';
  }
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const bucket = Math.min(Math.floor(Math.log2(bytes) / 10) | 0, sizes.length - 1);
  const count = bytes / Math.pow(1024, bucket);
  const round = bucket > 0 ? count < 3 ? 2 : count < 30 ? 1 : 0 : 0;
  return count.toFixed(round) + ' ' + sizes[bucket];
}
function shortenFileName(filename, maxLength) {
  if (typeof filename != 'string') {
    return filename;
  }
  return filename.length > maxLength ? filename.slice(0, maxLength / 2 - 1) + '…' + filename.slice(1 - maxLength / 2) : filename;
}
function stringToColorHash(value) {
  let hash = 0;
  value = '' + value;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash = hash & hash;
  }
  return hash;
}
function letterTileColorId(userId) {
  return Math.abs(stringToColorHash(userId)) % 16;
}
function idToColorClass(id, light, fg) {
  return (light ? 'lt-' : 'dk-') + (fg ? 'fg-' : 'bg-') + letterTileColorId(id);
}
function flagEmoji(countryCode) {
  const codePoints = countryCode.toUpperCase().split('').map(char => 0x1F1A5 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}
function truncateString(str, maxLength) {
  if (typeof str !== 'string') {
    return str;
  }
  if (str.length <= maxLength) {
    return str;
  }
  const isRTL = /[\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(str);
  return isRTL ? '…' + str.slice(0, maxLength - 1) : str.slice(0, maxLength - 1) + '…';
}

/***/ }),

/***/ "./src/lib/utils.js":
/*!**************************!*\
  !*** ./src/lib/utils.js ***!
  \**************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   arrayEqual: function() { return /* binding */ arrayEqual; },
/* harmony export */   asEmail: function() { return /* binding */ asEmail; },
/* harmony export */   asPhone: function() { return /* binding */ asPhone; },
/* harmony export */   cancelablePromise: function() { return /* binding */ cancelablePromise; },
/* harmony export */   defaultWallpaper: function() { return /* binding */ defaultWallpaper; },
/* harmony export */   deliveryMarker: function() { return /* binding */ deliveryMarker; },
/* harmony export */   isUrlRelative: function() { return /* binding */ isUrlRelative; },
/* harmony export */   sanitizeUrl: function() { return /* binding */ sanitizeUrl; },
/* harmony export */   sanitizeUrlForMime: function() { return /* binding */ sanitizeUrlForMime; },
/* harmony export */   theCard: function() { return /* binding */ theCard; },
/* harmony export */   updateFavicon: function() { return /* binding */ updateFavicon; },
/* harmony export */   urlAsAttachment: function() { return /* binding */ urlAsAttachment; },
/* harmony export */   wallpaperNameFromUrl: function() { return /* binding */ wallpaperNameFromUrl; },
/* harmony export */   wallpaperTypeFromUrl: function() { return /* binding */ wallpaperTypeFromUrl; }
/* harmony export */ });
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config.js */ "./src/config.js");


function updateFavicon(count) {
  const oldIcon = document.getElementById('shortcut-icon');
  const head = document.head || document.getElementsByTagName('head')[0];
  const newIcon = document.createElement('link');
  newIcon.type = 'image/png';
  newIcon.id = 'shortcut-icon';
  newIcon.rel = 'shortcut icon';
  newIcon.href = 'img/logo32x32' + (count > 0 ? 'a' : '') + '.png';
  if (oldIcon) {
    head.removeChild(oldIcon);
  }
  head.appendChild(newIcon);
  document.title = (count > 0 ? '(' + count + ') ' : '') + 'Tinode';
}
function theCard(fn, imageUrl, imageMimeType, note) {
  let card = null;
  fn = fn && fn.trim();
  note = note && note.trim();
  if (fn) {
    card = {
      fn: fn
    };
  }
  if (typeof note == 'string') {
    card = card || {};
    card.note = note ? note : tinode_sdk__WEBPACK_IMPORTED_MODULE_0__.Tinode.DEL_CHAR;
  }
  if (imageUrl) {
    card = card || {};
    let mimeType = imageMimeType;
    const matches = /^data:(image\/[-a-z0-9+.]+)?(;base64)?,/i.exec(imageUrl);
    if (matches) {
      mimeType = matches[1];
      card.photo = {
        data: imageUrl.substring(imageUrl.indexOf(',') + 1),
        ref: tinode_sdk__WEBPACK_IMPORTED_MODULE_0__.Tinode.DEL_CHAR
      };
    } else {
      card.photo = {
        data: tinode_sdk__WEBPACK_IMPORTED_MODULE_0__.Tinode.DEL_CHAR,
        ref: imageUrl
      };
    }
    card.photo.type = (mimeType || 'image/jpeg').substring('image/'.length);
  }
  return card;
}
function arrayEqual(a, b) {
  if (a === b) {
    return true;
  }
  if (!Array.isArray(a) || !Array.isArray(b)) {
    return false;
  }
  if (a.length != b.length) {
    return false;
  }
  a.sort();
  b.sort();
  for (let i = 0, l = a.length; i < l; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}
function asPhone(val) {
  val = val.trim();
  if (/^(?:\+?(\d{1,3}))?[- (.]*(\d{3})[- ).]*(\d{3})[- .]*(\d{2})[- .]*(\d{2})?$/.test(val)) {
    return val.replaceAll(/[- ().]*/g, '');
  }
  return null;
}
function asEmail(val) {
  val = val.trim();
  if (/^[a-z0-9_.+-]+@[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(val)) {
    return val;
  }
  return null;
}
function isUrlRelative(url) {
  return url && !/^\s*([a-z][a-z0-9+.-]*:|\/\/)/im.test(url.replace(/\\/g, '/'));
}
function sanitizeUrl(url, allowedSchemes) {
  if (typeof url != 'string') {
    return url;
  }
  url = url.replace(/[^\x21-\x7E]/gmi, '').trim();
  url = url.replace(/\\/g, '/');
  if (!/^([a-z][a-z0-9+.-]*:|\/\/)/i.test(url)) {
    return url;
  }
  if (/^blob:http/.test(url)) {
    return url;
  }
  const schemes = Array.isArray(allowedSchemes) ? allowedSchemes.join('|') : 'http|https';
  const re = new RegExp('^((' + schemes + '):|//)', 'i');
  if (!re.test(url)) {
    return null;
  }
  return url;
}
function sanitizeUrlForMime(url, mimeMajor) {
  if (!url) {
    return null;
  }
  const sanitizedUrl = sanitizeUrl(url);
  if (sanitizedUrl) {
    return sanitizedUrl;
  }
  const re = new RegExp(`data:${mimeMajor}\/[-+.a-z0-9]+;base64,`, 'i');
  if (re.test(url.trim())) {
    return url;
  }
  return null;
}
function urlAsAttachment(url) {
  if (url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  let query = '',
    fragment = '';
  const idxF = url.indexOf('#');
  if (idxF > 0) {
    fragment = url.substring(idxF + 1);
    url = url.substring(0, idxF);
  }
  const idxQ = url.indexOf('?');
  if (idxQ > 0) {
    query = url.substring(idxQ + 1);
    url = url.substring(0, idxQ);
  }
  const params = new URLSearchParams(query);
  params.append('asatt', '1');
  return `${url}?${params.toString()}` + (fragment ? `#${fragment}` : '');
}
function deliveryMarker(received) {
  switch (received) {
    case tinode_sdk__WEBPACK_IMPORTED_MODULE_0__.Tinode.MESSAGE_STATUS_SENDING:
      return {
        name: 'access_time'
      };
    case tinode_sdk__WEBPACK_IMPORTED_MODULE_0__.Tinode.MESSAGE_STATUS_FAILED:
    case tinode_sdk__WEBPACK_IMPORTED_MODULE_0__.Tinode.MESSAGE_STATUS_FATAL:
      return {
        name: 'warning',
        color: 'danger-color'
      };
    case tinode_sdk__WEBPACK_IMPORTED_MODULE_0__.Tinode.MESSAGE_STATUS_SENT:
      return {
        name: 'done'
      };
    case tinode_sdk__WEBPACK_IMPORTED_MODULE_0__.Tinode.MESSAGE_STATUS_RECEIVED:
      return {
        name: 'done_all'
      };
    case tinode_sdk__WEBPACK_IMPORTED_MODULE_0__.Tinode.MESSAGE_STATUS_READ:
      return {
        name: 'done_all',
        color: 'blue'
      };
  }
  return null;
}
function cancelablePromise(promise) {
  let hasCanceled = false;
  const wrappedPromise = promise instanceof Error ? Promise.reject(promise) : new Promise((resolve, reject) => {
    promise.then(result => hasCanceled ? reject({
      isCanceled: true
    }) : resolve(result), error => hasCanceled ? reject({
      isCanceled: true
    }) : reject(error));
  });
  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled = true;
    }
  };
}
;
function defaultWallpaper() {
  const wallpaperIndex = __webpack_require__(/*! ../../img/bkg/index.json */ "./img/bkg/index.json");
  const wp = wallpaperIndex[_config_js__WEBPACK_IMPORTED_MODULE_1__.WALLPAPER_DEFAULTS.type][_config_js__WEBPACK_IMPORTED_MODULE_1__.WALLPAPER_DEFAULTS.index];
  return {
    name: `../${_config_js__WEBPACK_IMPORTED_MODULE_1__.WALLPAPER_DEFAULTS.path}${wp.name}`,
    size: wp.size
  };
}
function wallpaperNameFromUrl(wallpaperUrl) {
  const parts = wallpaperUrl.split('/');
  return parts[parts.length - 1];
}
function wallpaperTypeFromUrl(wallpaperUrl) {
  const fname = wallpaperNameFromUrl(wallpaperUrl);
  const wallpaperIndex = __webpack_require__(/*! ../../img/bkg/index.json */ "./img/bkg/index.json");
  for (const type in wallpaperIndex) {
    for (let i = 0; i < wallpaperIndex[type].length; i++) {
      if (wallpaperIndex[type][i].name == fname) {
        return type;
      }
    }
  }
  return null;
}

/***/ }),

/***/ "./src/version.js":
/*!************************!*\
  !*** ./src/version.js ***!
  \************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PACKAGE_VERSION: function() { return /* binding */ PACKAGE_VERSION; }
/* harmony export */ });
const PACKAGE_VERSION = "0.25.3";

/***/ }),

/***/ "./src/views/acc-general-view.jsx":
/*!****************************************!*\
  !*** ./src/views/acc-general-view.jsx ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ AccGeneralView; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");



class AccGeneralView extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.state = {
      colorSchema: props.colorSchema || 'auto',
      textSize: props.textSize * 10 || '100',
      sendOnEnter: props.sendOnEnter || 'plain'
    };
    this.isMac = (navigator.userAgentData && navigator.userAgentData.platform || navigator.platform).toLowerCase().startsWith('mac');
    this.handleColorSchemaSelected = this.handleColorSchemaSelected.bind(this);
    this.handleTextSizeChanged = this.handleTextSizeChanged.bind(this);
    this.handleSendOnEnterSelected = this.handleSendOnEnterSelected.bind(this);
  }
  handleColorSchemaSelected(e) {
    this.setState({
      colorSchema: e.currentTarget.value
    });
    this.props.onChangeColorSchema(e.currentTarget.value);
  }
  handleTextSizeChanged(e) {
    this.setState({
      textSize: e.currentTarget.value
    });
    this.props.onTextSizeChanged(e.currentTarget.value / 10 | 0);
  }
  handleSendOnEnterSelected(e) {
    this.setState({
      sendOnEnter: e.currentTarget.value
    });
    this.props.onSendOnEnterChanged(e.currentTarget.value);
  }
  render() {
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
      id: "settings-form",
      className: "scrollable-panel",
      children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
        className: "panel-form-column",
        children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
          className: "panel-form-row",
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("label", {
            className: "small",
            children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
              id: "label_color_schema",
              defaultMessage: "Theme:",
              description: "Label for selecting color scheme (dark, light) in Settings"
            }, void 0, false)
          }, void 0, false)
        }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
          className: "panel-form-row",
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("ul", {
            className: "quoted",
            children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("li", {
              children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("input", {
                type: "radio",
                id: "system",
                name: "color-scheme-select",
                value: "auto",
                checked: this.state.colorSchema == 'auto',
                onChange: this.handleColorSchemaSelected
              }, void 0, false), "\xA0", (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("label", {
                htmlFor: "system",
                children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
                  id: "color_schema_system",
                  defaultMessage: "System default",
                  description: "Name of the color schema"
                }, void 0, false), "\xA0", (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("img", {
                  src: "img/routine.svg",
                  style: {
                    verticalAlign: 'top',
                    width: '1.6rem',
                    height: '1.6rem'
                  }
                }, void 0, false)]
              }, void 0, true)]
            }, "system", true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("li", {
              children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("input", {
                type: "radio",
                id: "light",
                name: "color-scheme-select",
                value: "light",
                checked: this.state.colorSchema == 'light',
                onChange: this.handleColorSchemaSelected
              }, void 0, false), "\xA0", (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("label", {
                htmlFor: "light",
                children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
                  id: "color_schema_light",
                  defaultMessage: "Light",
                  description: "Name of the color schema"
                }, void 0, false), "\xA0", (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("i", {
                  className: "material-icons orange large",
                  children: "light_mode"
                }, void 0, false)]
              }, void 0, true)]
            }, "light", true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("li", {
              children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("input", {
                type: "radio",
                id: "dark",
                name: "color-scheme-select",
                value: "dark",
                checked: this.state.colorSchema == 'dark',
                onChange: this.handleColorSchemaSelected
              }, void 0, false), "\xA0", (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("label", {
                htmlFor: "dark",
                children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
                  id: "color_schema_dark",
                  defaultMessage: "Dark",
                  description: "Name of the color schema"
                }, void 0, false), "\xA0", (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("i", {
                  className: "material-icons blue large",
                  children: "dark_mode"
                }, void 0, false)]
              }, void 0, true)]
            }, "dark", true)]
          }, void 0, true)
        }, void 0, false)]
      }, void 0, true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
        className: "hr"
      }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
        className: "panel-form-row clean-clickable",
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("a", {
          onClick: this.props.onSelectWallpapers,
          className: "flat-button",
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("i", {
            className: "material-icons",
            children: "wallpaper"
          }, void 0, false), "\xA0", (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "wallpapers",
            defaultMessage: "Wallpapers",
            description: "Link or title for working with wallpapers."
          }, void 0, false)]
        }, void 0, true)
      }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
        className: "hr"
      }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
        className: "panel-form-column",
        children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
          className: "panel-form-row",
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("label", {
            className: "small",
            children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
              id: "label_text_size",
              defaultMessage: "Text size:",
              description: "Label adjusting text size"
            }, void 0, false)
          }, void 0, false)
        }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
          className: "panel-form-row",
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("input", {
            type: "range",
            id: "text_size",
            name: "text_size",
            min: "80",
            max: "120",
            step: "10",
            list: "text_size_options",
            value: this.state.textSize,
            onChange: this.handleTextSizeChanged
          }, void 0, false)
        }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
          className: "panel-form-row",
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("datalist", {
            id: "text_size_options",
            children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("option", {
              value: "80",
              label: "80%"
            }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("option", {
              value: "90",
              label: "90%"
            }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("option", {
              value: "100",
              label: "100%"
            }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("option", {
              value: "110",
              label: "110%"
            }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("option", {
              value: "120",
              label: "120%"
            }, void 0, false)]
          }, void 0, true)
        }, void 0, false)]
      }, void 0, true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
        className: "hr"
      }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
        className: "panel-form-row",
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("label", {
          className: "small",
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "label_keyboard",
            defaultMessage: "Keyboard:",
            description: "Label for send on enter settings"
          }, void 0, false)
        }, void 0, false)
      }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
        className: "panel-form-row",
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("ul", {
          className: "quoted",
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("li", {
            children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("input", {
              type: "radio",
              id: "plain",
              name: "send-select",
              value: "plain",
              checked: this.state.sendOnEnter == 'plain',
              onChange: this.handleSendOnEnterSelected
            }, void 0, false), "\xA0", (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("label", {
              htmlFor: "send_plain",
              children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
                id: "send_plain",
                defaultMessage: "Send on Enter",
                description: "Config option to send message on hitting Enter"
              }, void 0, false), "\xA0"]
            }, void 0, true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
              className: "panel-form-row",
              children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("span", {
                className: "small gray",
                children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
                  id: "send_plain_explained",
                  defaultMessage: "Press Shift + Enter for new line",
                  description: "Explanation how to enter newline when [Send on Enter] is enabled"
                }, void 0, false)
              }, void 0, false)
            }, void 0, false)]
          }, "plain", true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("li", {
            children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("input", {
              type: "radio",
              id: "command",
              name: "send-select",
              value: "command",
              checked: this.state.sendOnEnter == 'command',
              onChange: this.handleSendOnEnterSelected
            }, void 0, false), "\xA0", (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("label", {
              htmlFor: "send_command",
              children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
                id: "send_command",
                defaultMessage: "Send on {key}",
                values: {
                  key: this.isMac ? '⌘ + Enter' : 'Ctrl + Enter'
                },
                description: "Config option to send message on hitting CTRL(or Cmd)-Enter"
              }, void 0, false), "\xA0"]
            }, void 0, true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
              className: "panel-form-row",
              children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("span", {
                className: "small gray",
                children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
                  id: "send_command_explained",
                  defaultMessage: "Press Enter for new line",
                  description: "Explanation how to enter newline when [Send on CTRL-Enter] is enabled"
                }, void 0, false)
              }, void 0, false)
            }, void 0, false)]
          }, "command", true)]
        }, void 0, true)
      }, void 0, false)]
    }, void 0, true);
  }
}
;

/***/ }),

/***/ "./src/views/acc-notifications-view.jsx":
/*!**********************************************!*\
  !*** ./src/views/acc-notifications-view.jsx ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ AccNotificationsView; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../widgets/checkbox.jsx */ "./src/widgets/checkbox.jsx");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");




class AccNotificationsView extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.handleCheckboxClick = this.handleCheckboxClick.bind(this);
  }
  handleCheckboxClick(what, checked) {
    if (what == 'sound') {
      this.props.onToggleMessageSounds(checked);
    } else if (what == 'alert') {
      this.props.onTogglePushNotifications(checked);
    }
  }
  render() {
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)("div", {
      className: "scrollable-panel",
      children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)("div", {
        className: "panel-form-row",
        children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)("label", {
          htmlFor: "message-sound",
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "label_message_sound",
            defaultMessage: "Message sound:",
            description: "Label for message sounds toggle"
          }, void 0, false)
        }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)(_widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
          name: "sound",
          id: "message-sound",
          checked: this.props.messageSounds,
          onChange: this.handleCheckboxClick
        }, void 0, false)]
      }, void 0, true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)("div", {
        className: "panel-form-row",
        children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)("label", {
          htmlFor: "desktop-alerts",
          children: this.props.desktopAlertsEnabled ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "label_push_notifications",
            defaultMessage: "Notification alerts:",
            description: "Label for push notifications switch"
          }, void 0, false) : (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "label_push_notifications_disabled",
            defaultMessage: "Notification alerts (requires HTTPS):",
            description: "Label for push notifications switch"
          }, void 0, false)
        }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)(_widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
          name: "alert",
          id: "desktop-alerts",
          checked: this.props.desktopAlerts,
          onChange: this.props.desktopAlertsEnabled ? this.handleCheckboxClick : null
        }, void 0, false)]
      }, void 0, true)]
    }, void 0, true);
  }
}
;

/***/ }),

/***/ "./src/views/acc-support-view.jsx":
/*!****************************************!*\
  !*** ./src/views/acc-support-view.jsx ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ AccSupportView; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");





class AccSupportView extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
      className: "scrollable-panel",
      children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
        className: "panel-form-column",
        children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("a", {
          href: _config_js__WEBPACK_IMPORTED_MODULE_3__.LINK_CONTACT_US,
          className: "flat-button",
          target: "_blank",
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("i", {
            className: "material-icons",
            children: "email"
          }, void 0, false), " \xA0", (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "link_contact_us",
            defaultMessage: "Contact Us",
            description: "Ancor text for contacting us by email"
          }, void 0, false)]
        }, void 0, true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("a", {
          href: _config_js__WEBPACK_IMPORTED_MODULE_3__.LINK_TERMS_OF_SERVICE,
          className: "flat-button",
          target: "_blank",
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("i", {
            className: "material-icons",
            children: "description"
          }, void 0, false), " \xA0", (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "link_terms_of_service",
            defaultMessage: "Terms of Service",
            description: "Ancor text for terms of service link"
          }, void 0, false)]
        }, void 0, true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("a", {
          href: _config_js__WEBPACK_IMPORTED_MODULE_3__.LINK_PRIVACY_POLICY,
          className: "flat-button",
          target: "_blank",
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("i", {
            className: "material-icons",
            children: "policy"
          }, void 0, false), " \xA0", (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "link_privacy_policy",
            defaultMessage: "Privacy Policy",
            description: "Ancor text for privacy policy link"
          }, void 0, false)]
        }, void 0, true)]
      }, void 0, true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
        className: "hr"
      }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
        className: "panel-form-column",
        children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
          className: "panel-form-row",
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("label", {
            className: "small",
            children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
              id: "label_client",
              defaultMessage: "Client:",
              description: "Label for a client version"
            }, void 0, false)
          }, void 0, false), _config_js__WEBPACK_IMPORTED_MODULE_3__.APP_NAME]
        }, void 0, true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
          className: "panel-form-row",
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("label", {
            className: "small",
            children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
              id: "label_sdk",
              defaultMessage: "SDK:"
            }, void 0, false)
          }, void 0, false), tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.getLibrary()]
        }, void 0, true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
          className: "panel-form-row",
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("label", {
            className: "small",
            children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
              id: "label_server",
              defaultMessage: "Server:",
              description: "Label for a server version"
            }, void 0, false)
          }, void 0, false), this.props.serverVersion]
        }, void 0, true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
          className: "panel-form-row",
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("label", {
            className: "small",
            children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
              id: "label_server_address",
              defaultMessage: "Server address:"
            }, void 0, false)
          }, void 0, false), this.props.serverAddress]
        }, void 0, true)]
      }, void 0, true)]
    }, void 0, true);
  }
}
;

/***/ }),

/***/ "./src/views/contacts-view.jsx":
/*!*************************************!*\
  !*** ./src/views/contacts-view.jsx ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ ContactsView; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _widgets_contact_list_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../widgets/contact-list.jsx */ "./src/widgets/contact-list.jsx");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");





const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  archived_contacts_title: {
    id: "archived_contacts",
    defaultMessage: "Archived contacts ({count})",
    description: "Label for archived chats"
  }
});
class ContactsView extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    this.handleAction = this.handleAction.bind(this);
    this.state = ContactsView.deriveStateFromProps(props);
  }
  static deriveStateFromProps(props) {
    const contacts = [];
    let unreadThreads = 0;
    let archivedCount = 0;
    const me = props.tinode.getMeTopic();
    props.chatList.forEach(c => {
      const blocked = c.acs && !c.acs.isJoiner();
      c.pinned = me.pinnedTopicRank(c.topic);
      if (blocked && props.blocked) {
        contacts.push(c);
      }
      if (blocked || props.blocked) {
        return;
      }
      if (c.private && c.private.arch) {
        if (props.archive) {
          contacts.push(c);
        } else {
          archivedCount++;
        }
      } else if (!props.archive) {
        contacts.push(c);
        unreadThreads += c.unread > 0 ? 1 : 0;
      }
    });
    contacts.sort((a, b) => {
      const pin = b.pinned - a.pinned;
      return pin != 0 ? pin : (b.touched || 0) - (a.touched || 0);
    });
    if (archivedCount > 0) {
      contacts.push({
        action: 'archive',
        title: messages.archived_contacts_title,
        values: {
          count: archivedCount
        }
      });
    }
    return {
      contactList: contacts,
      unreadThreads: unreadThreads
    };
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.chatList != this.props.chatList || prevProps.archive != this.props.archive || prevProps.blocked != this.props.blocked) {
      const newState = ContactsView.deriveStateFromProps(this.props);
      this.setState(newState);
      if (newState.unreadThreads != prevState.unreadThreads) {
        (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_3__.updateFavicon)(newState.unreadThreads);
      }
    }
  }
  handleAction(action_ignored) {
    this.props.onShowArchive();
  }
  render() {
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "contacts_not_found",
      defaultMessage: "You have no chats\\n¯∖_(ツ)_/¯",
      description: "HTML message shown in ContactList when no contacts are found",
      children: no_contacts => (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(_widgets_contact_list_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
        tinode: this.props.tinode,
        connected: this.props.connected,
        contacts: this.state.contactList,
        emptyListMessage: no_contacts,
        topicSelected: this.props.topicSelected,
        myUserId: this.props.myUserId,
        showOnline: true,
        showUnread: true,
        onTopicSelected: this.props.onTopicSelected,
        showContextMenu: this.props.showContextMenu,
        onAction: this.handleAction
      }, void 0, false)
    }, void 0, false);
  }
}
;

/***/ }),

/***/ "./src/views/login-view.jsx":
/*!**********************************!*\
  !*** ./src/views/login-view.jsx ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ LoginView; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../widgets/checkbox.jsx */ "./src/widgets/checkbox.jsx");
/* harmony import */ var _widgets_visible_password_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../widgets/visible-password.jsx */ "./src/widgets/visible-password.jsx");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");





class LoginView extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    this.state = {
      login: props.login,
      password: '',
      hostName: props.serverAddress,
      saveToken: props.persist
    };
    this.handleLoginChange = this.handleLoginChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleToggleSaveToken = this.handleToggleSaveToken.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleLoginChange(e) {
    this.setState({
      login: e.target.value
    });
  }
  handlePasswordChange(e) {
    this.setState({
      password: e.target.value
    });
  }
  handleToggleSaveToken() {
    this.props.onPersistenceChange(!this.state.saveToken);
    this.setState({
      saveToken: !this.state.saveToken
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.onLogin(this.state.login.trim(), this.state.password.trim());
  }
  render() {
    let submitClasses = 'primary';
    if (this.props.disabled) {
      submitClasses += ' disabled';
    }
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("form", {
      id: "login-form",
      onSubmit: this.handleSubmit,
      children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
        id: "login_prompt",
        defaultMessage: "Login",
        description: "Placeholer for username/login",
        children: login_prompt => (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("input", {
          type: "text",
          id: "inputLogin",
          placeholder: login_prompt,
          autoComplete: "username",
          autoCorrect: "off",
          autoCapitalize: "none",
          value: this.state.login,
          onChange: this.handleLoginChange,
          required: true,
          autoFocus: true
        }, void 0, false)
      }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
        id: "password_prompt",
        defaultMessage: "Password",
        description: "Placeholder/prompt for entering password",
        children: password_prompt => (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(_widgets_visible_password_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
          type: "password",
          id: "inputPassword",
          placeholder: password_prompt,
          autoComplete: "current-password",
          value: this.state.password,
          onChange: this.handlePasswordChange,
          required: true
        }, void 0, false)
      }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
        className: "panel-form-row",
        children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(_widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
          id: "save-token",
          name: "save-token",
          checked: this.state.saveToken,
          onChange: this.handleToggleSaveToken
        }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("label", {
          htmlFor: "save-token",
          children: ["\xA0", (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "stay_logged_in",
            defaultMessage: "Stay logged in",
            description: "Label for a checkbox"
          }, void 0, false)]
        }, void 0, true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("a", {
          href: "#reset",
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "forgot_password_link",
            defaultMessage: "Forgot password?",
            description: "Link to Reset password form"
          }, void 0, false)
        }, void 0, false)]
      }, void 0, true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
        className: "dialog-buttons",
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("button", {
          className: submitClasses,
          type: "submit",
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "button_sign_in",
            defaultMessage: "Sign in",
            description: "Button [Sign In]"
          }, void 0, false)
        }, void 0, false)
      }, void 0, false)]
    }, void 0, true);
  }
}
;

/***/ }),

/***/ "./src/views/new-topic-view.jsx":
/*!**************************************!*\
  !*** ./src/views/new-topic-view.jsx ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _widgets_contact_list_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../widgets/contact-list.jsx */ "./src/widgets/contact-list.jsx");
/* harmony import */ var _widgets_new_topic_by_id_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../widgets/new-topic-by-id.jsx */ "./src/widgets/new-topic-by-id.jsx");
/* harmony import */ var _widgets_new_topic_group_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../widgets/new-topic-group.jsx */ "./src/widgets/new-topic-group.jsx");
/* harmony import */ var _widgets_search_contacts_jsx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../widgets/search-contacts.jsx */ "./src/widgets/search-contacts.jsx");
/* harmony import */ var _lib_navigation_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../lib/navigation.js */ "./src/lib/navigation.js");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");










const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  search_for_contacts: {
    id: "search_for_contacts",
    defaultMessage: "Use search to find contacts",
    description: "Text shown in contacts view when user entered no search query."
  },
  search_no_results: {
    id: "search_no_results",
    defaultMessage: "Search returned no results",
    description: "Text shown in contacts view when query returned no results."
  },
  search_placeholder: {
    id: "search_placeholder",
    defaultMessage: "List like alice@example.com, +17025550003...",
    description: "Placeholder in contacts search field"
  }
});
class NewTopicView extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    const urlParams = _lib_navigation_js__WEBPACK_IMPORTED_MODULE_7__["default"].parseUrlHash(window.location.hash).params;
    const initialTab = urlParams['tab'] || 'find';
    const initialQuery = initialTab == 'find' ? urlParams['q'] || null : null;
    this.state = {
      tabSelected: initialTab,
      searchQuery: initialQuery
    };
    this.handleTabClick = this.handleTabClick.bind(this);
    this.handleSearchContacts = this.handleSearchContacts.bind(this);
    this.handleSearchResultSelected = this.handleSearchResultSelected.bind(this);
    this.handleNewGroupSubmit = this.handleNewGroupSubmit.bind(this);
    this.handleGroupByID = this.handleGroupByID.bind(this);
  }
  componentDidMount() {
    this.props.onInitFind();
  }
  handleTabClick(e) {
    e.preventDefault();
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_7__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_7__["default"].addUrlParam(window.location.hash, 'tab', e.currentTarget.dataset.id));
    this.setState({
      tabSelected: e.currentTarget.dataset.id
    });
  }
  handleSearchContacts(query) {
    query = query.trim() || tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.DEL_CHAR;
    if (!/[\s,:]/.test(query) && query != tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.DEL_CHAR) {
      const email = (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_8__.asEmail)(query);
      if (email) {
        query = `${tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.TAG_EMAIL}${email}`;
      } else {
        const tel = (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_8__.asPhone)(query);
        if (tel) {
          query = `${tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.TAG_PHONE}${tel}`;
        } else {
          if (query[0] == '@') {
            query = query.substring(1);
          }
          query = `${tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.TAG_ALIAS}${query},${query}`;
        }
      }
    }
    this.props.onSearchContacts(query);
    this.setState({
      searchQuery: tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.isNullValue(query) ? null : query
    });
  }
  handleSearchResultSelected(topicName) {
    if (this.state.tabSelected == 'find') {
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_7__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_7__["default"].removeUrlParams(window.location.hash, ['tab', 'q']));
      this.props.onCreateTopic(topicName);
    }
  }
  handleNewGroupSubmit(name, description, dataUrl, priv, tags, isChannel) {
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_7__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_7__["default"].removeUrlParams(window.location.hash, ['tab', 'q']));
    this.props.onCreateTopic(undefined, {
      public: (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_8__.theCard)(name, dataUrl, null, description),
      private: priv,
      tags: tags
    }, isChannel);
  }
  handleGroupByID(topicName) {
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_7__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_7__["default"].removeUrlParams(window.location.hash, ['tab', 'q']));
    this.props.onCreateTopic(topicName);
  }
  render() {
    const {
      formatMessage
    } = this.props.intl;
    const no_contacts_placeholder = formatMessage(this.state.searchQuery ? messages.search_no_results : messages.search_for_contacts);
    const search_placeholder = formatMessage(messages.search_placeholder);
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
      className: "flex-column",
      children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("ul", {
        className: "tabbar",
        children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("li", {
          className: this.state.tabSelected === 'find' ? 'active' : null,
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("a", {
            href: "#",
            "data-id": "find",
            onClick: this.handleTabClick,
            children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
              id: "tabtitle_find_user",
              defaultMessage: "find",
              description: "Tab title Find"
            }, void 0, false)
          }, void 0, false)
        }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("li", {
          className: this.state.tabSelected === 'grp' ? 'active' : null,
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("a", {
            href: "#",
            "data-id": "grp",
            onClick: this.handleTabClick,
            children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
              id: "tabtitle_new_group",
              defaultMessage: "new group",
              description: "Tab title New Group"
            }, void 0, false)
          }, void 0, false)
        }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("li", {
          className: this.state.tabSelected === 'byid' ? 'active' : null,
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("a", {
            href: "#",
            "data-id": "byid",
            onClick: this.handleTabClick,
            children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
              id: "tabtitle_group_by_id",
              defaultMessage: "by id",
              description: "Tab title Find topic by ID"
            }, void 0, false)
          }, void 0, false)
        }, void 0, false)]
      }, void 0, true), this.state.tabSelected === 'grp' ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(_widgets_new_topic_group_jsx__WEBPACK_IMPORTED_MODULE_5__["default"], {
        tinode: this.props.tinode,
        onSubmit: this.handleNewGroupSubmit,
        onError: this.props.onError
      }, void 0, false) : this.state.tabSelected === 'byid' ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(_widgets_new_topic_by_id_jsx__WEBPACK_IMPORTED_MODULE_4__["default"], {
        myURI: tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.URI_TOPIC_ID_PREFIX + this.props.tinode.getCurrentUserID(),
        onSubmit: this.handleGroupByID,
        onError: this.props.onError
      }, void 0, false) : (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
        className: "flex-column",
        children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(_widgets_search_contacts_jsx__WEBPACK_IMPORTED_MODULE_6__["default"], {
          placeholder: search_placeholder,
          initialQuery: this.state.searchQuery || '',
          onSearchContacts: this.handleSearchContacts
        }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(_widgets_contact_list_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
          tinode: this.props.tinode,
          contacts: this.props.searchResults,
          myUserId: this.props.myUserId,
          emptyListMessage: no_contacts_placeholder,
          showSelfTopic: !this.state.searchQuery,
          showOnline: false,
          showUnread: false,
          showContextMenu: false,
          onTopicSelected: this.handleSearchResultSelected
        }, void 0, false)]
      }, void 0, true)]
    }, void 0, true);
  }
}
;
/* harmony default export */ __webpack_exports__["default"] = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(NewTopicView));

/***/ }),

/***/ "./src/views/settings-view.jsx":
/*!*************************************!*\
  !*** ./src/views/settings-view.jsx ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ SettingsView; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../widgets/checkbox.jsx */ "./src/widgets/checkbox.jsx");
/* harmony import */ var _widgets_host_selector_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../widgets/host-selector.jsx */ "./src/widgets/host-selector.jsx");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");





class SettingsView extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.state = {
      transport: props.transport || 'def',
      serverAddress: props.serverAddress,
      secureConnection: props.secureConnection
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTransportSelected = this.handleTransportSelected.bind(this);
    this.handleServerAddressChange = this.handleServerAddressChange.bind(this);
    this.handleToggleSecure = this.handleToggleSecure.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.onUpdate({
      transport: this.state.transport,
      serverAddress: this.state.serverAddress,
      secureConnection: this.state.secureConnection
    });
  }
  handleTransportSelected(e) {
    this.setState({
      transport: e.currentTarget.value
    });
  }
  handleServerAddressChange(name) {
    this.setState({
      serverAddress: name
    });
  }
  handleToggleSecure(e) {
    this.setState({
      secureConnection: !this.state.secureConnection
    });
  }
  render() {
    const names = {
      def: "default",
      ws: "websocket",
      lp: "long polling"
    };
    const transportOptions = [];
    ['def', 'ws', 'lp'].forEach(item => {
      const id = 'transport-' + item;
      const name = names[item];
      transportOptions.push((0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("li", {
        children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("input", {
          type: "radio",
          id: id,
          name: "transport-select",
          value: item,
          checked: this.state.transport === item,
          onChange: this.handleTransportSelected
        }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("label", {
          htmlFor: id,
          children: name
        }, void 0, false)]
      }, item, true));
    });
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("form", {
      id: "settings-form",
      className: "panel-form",
      onSubmit: this.handleSubmit,
      children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
        className: "panel-form-row",
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("label", {
          className: "small",
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "label_server_to_use",
            defaultMessage: "Server to use:",
            description: "Label for server selector in SettingsView"
          }, void 0, false)
        }, void 0, false)
      }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(_widgets_host_selector_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
        serverAddress: this.state.serverAddress,
        onServerAddressChange: this.handleServerAddressChange
      }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
        className: "panel-form-row",
        children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(_widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
          id: "secure-connection",
          name: "secure-connection",
          checked: this.state.secureConnection,
          className: "quoted",
          onChange: this.handleToggleSecure
        }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("label", {
          htmlFor: "secure-connection",
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "label_use_secure_connection",
            defaultMessage: "Use secure connection",
            description: "Label for WS/WSS connection type in SettingsView"
          }, void 0, false)
        }, void 0, false)]
      }, void 0, true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
        className: "panel-form-row",
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("label", {
          className: "small",
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "label_wire_transport",
            defaultMessage: "Wire transport:",
            description: "Label for wire transport selection in SettingsView"
          }, void 0, false)
        }, void 0, false)
      }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
        className: "panel-form-row",
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("ul", {
          className: "quoted",
          children: transportOptions
        }, void 0, false)
      }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
        className: "dialog-buttons",
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("button", {
          type: "submit",
          className: "primary",
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "button_update",
            defaultMessage: "Update",
            description: "Button [Update]"
          }, void 0, false)
        }, void 0, false)
      }, void 0, false)]
    }, void 0, true);
  }
}
;

/***/ }),

/***/ "./src/views/sidepanel-view.jsx":
/*!**************************************!*\
  !*** ./src/views/sidepanel-view.jsx ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _widgets_error_panel_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../widgets/error-panel.jsx */ "./src/widgets/error-panel.jsx");
/* harmony import */ var _widgets_load_spinner_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../widgets/load-spinner.jsx */ "./src/widgets/load-spinner.jsx");
/* harmony import */ var _widgets_side_navbar_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../widgets/side-navbar.jsx */ "./src/widgets/side-navbar.jsx");
/* harmony import */ var _topic_common_view_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./topic-common-view.jsx */ "./src/views/topic-common-view.jsx");
/* harmony import */ var _contacts_view_jsx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./contacts-view.jsx */ "./src/views/contacts-view.jsx");
/* harmony import */ var _acc_general_view_jsx__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./acc-general-view.jsx */ "./src/views/acc-general-view.jsx");
/* harmony import */ var _acc_notifications_view_jsx__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./acc-notifications-view.jsx */ "./src/views/acc-notifications-view.jsx");
/* harmony import */ var _acc_support_view_jsx__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./acc-support-view.jsx */ "./src/views/acc-support-view.jsx");
/* harmony import */ var _login_view_jsx__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./login-view.jsx */ "./src/views/login-view.jsx");
/* harmony import */ var _new_topic_view_jsx__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./new-topic-view.jsx */ "./src/views/new-topic-view.jsx");
/* harmony import */ var _settings_view_jsx__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./settings-view.jsx */ "./src/views/settings-view.jsx");
/* harmony import */ var _validation_view_jsx__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./validation-view.jsx */ "./src/views/validation-view.jsx");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");






const AccountSettingsView = react__WEBPACK_IMPORTED_MODULE_0___default().lazy(_ => Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_libphonenumber-js_mobile_exports_parsePhoneNumberWithError_js"), __webpack_require__.e("vendors-node_modules_libphonenumber-js_examples_mobile_json_js-node_modules_libphonenumber-js-883e54"), __webpack_require__.e("src_widgets_phone-edit_jsx"), __webpack_require__.e("src_views_account-settings-view_jsx")]).then(__webpack_require__.bind(__webpack_require__, /*! ./account-settings-view.jsx */ "./src/views/account-settings-view.jsx")));

const CreateAccountView = react__WEBPACK_IMPORTED_MODULE_0___default().lazy(_ => Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_libphonenumber-js_mobile_exports_parsePhoneNumberWithError_js"), __webpack_require__.e("vendors-node_modules_libphonenumber-js_examples_mobile_json_js-node_modules_libphonenumber-js-883e54"), __webpack_require__.e("src_widgets_phone-edit_jsx"), __webpack_require__.e("src_views_create-account-view_jsx")]).then(__webpack_require__.bind(__webpack_require__, /*! ./create-account-view.jsx */ "./src/views/create-account-view.jsx")));


const AccSecurityView = react__WEBPACK_IMPORTED_MODULE_0___default().lazy(_ => __webpack_require__.e(/*! import() */ "src_views_acc-security-view_jsx").then(__webpack_require__.bind(__webpack_require__, /*! ./acc-security-view.jsx */ "./src/views/acc-security-view.jsx")));



const PasswordResetView = react__WEBPACK_IMPORTED_MODULE_0___default().lazy(_ => Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_libphonenumber-js_mobile_exports_parsePhoneNumberWithError_js"), __webpack_require__.e("vendors-node_modules_libphonenumber-js_examples_mobile_json_js-node_modules_libphonenumber-js-883e54"), __webpack_require__.e("src_widgets_phone-edit_jsx"), __webpack_require__.e("src_views_password-reset-view_jsx")]).then(__webpack_require__.bind(__webpack_require__, /*! ./password-reset-view.jsx */ "./src/views/password-reset-view.jsx")));



const WallpapersView = react__WEBPACK_IMPORTED_MODULE_0___default().lazy(_ => __webpack_require__.e(/*! import() */ "src_views_wallpapers_jsx").then(__webpack_require__.bind(__webpack_require__, /*! ./wallpapers.jsx */ "./src/views/wallpapers.jsx")));
const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  login: {
    id: 'sidepanel_title_login',
    description: 'Sidepanel title for LoginView.',
    defaultMessage: 'Sign In'
  },
  register: {
    id: 'sidepanel_title_register',
    description: 'Sidepanel title for CreateAccountView.',
    defaultMessage: 'Create Account'
  },
  settings: {
    id: 'sidepanel_title_settings',
    description: 'Sidepanel title for SettingsView.',
    defaultMessage: 'Settings'
  },
  edit: {
    id: 'sidepanel_title_account_settings',
    description: 'Sidepanel title for AccountSettingsView.',
    defaultMessage: 'Account Settings'
  },
  general: {
    id: 'panel_title_general',
    description: 'Title for TopicCommon.',
    defaultMessage: 'General'
  },
  security: {
    id: 'panel_title_security',
    description: 'Title for TopicSecirity and AccSecurity.',
    defaultMessage: 'Security'
  },
  crop: {
    id: 'panel_title_crop',
    description: 'Title for AvatarCropView.',
    defaultMessage: 'Drag to Adjust'
  },
  notif: {
    id: 'sidepanel_title_acc_notifications',
    description: 'Sidepanel title for AccNotificationsView.',
    defaultMessage: 'Notifications'
  },
  acc_general: {
    id: 'sidepanel_title_acc_general',
    description: 'Sidepanel title for AccGeneralView.',
    defaultMessage: 'General'
  },
  support: {
    id: 'sidepanel_title_acc_support',
    description: 'Sidepanel title for AccSupportView.',
    defaultMessage: 'Support'
  },
  newtpk: {
    id: 'sidepanel_title_newtpk',
    description: 'Sidepanel title for NewTopicView.',
    defaultMessage: 'Start New Chat'
  },
  cred: {
    id: 'sidepanel_title_cred',
    description: 'Sidepanel title for ValidationView.',
    defaultMessage: 'Confirm Credentials'
  },
  reset: {
    id: 'sidepanel_title_reset',
    description: 'Sidepanel title for PasswordResetView.',
    defaultMessage: 'Reset Password'
  },
  archive: {
    id: 'sidepanel_title_archive',
    description: 'Sidepanel title for ContactsView-Archive.',
    defaultMessage: 'Archived Chats'
  },
  blocked: {
    id: 'sidepanel_title_blocked',
    description: 'Sidepanel title for ContactsView-Blocked.',
    defaultMessage: 'Blocked Chats'
  },
  wallpapers: {
    id: 'wallpapers',
    description: 'Link or title for working with wallpapers.',
    defaultMessage: 'Wallpapers'
  }
});
class SidepanelView extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.handleNewTopic = this.handleNewTopic.bind(this);
  }
  handleNewTopic() {
    this.props.onNavigate('newtpk');
  }
  render() {
    const {
      formatMessage
    } = this.props.intl;
    const view = this.props.state || (this.props.myUserId ? 'contacts' : 'login');
    let title, avatar, badges;
    if (view == 'contacts') {
      title = this.props.title;
      avatar = this.props.avatar ? this.props.avatar : true;
      badges = this.props.trustedBadges;
    } else {
      title = formatMessage(messages[view]);
      avatar = false;
      badges = null;
    }
    let onCancel;
    if (['login', 'contacts'].indexOf(view) == -1) {
      onCancel = this.props.onCancel;
    }
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxDEV)("div", {
      id: "sidepanel",
      children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxDEV)(_widgets_side_navbar_jsx__WEBPACK_IMPORTED_MODULE_4__["default"], {
        state: view,
        title: title,
        avatar: avatar,
        tinode: this.props.tinode,
        trustedBadges: badges,
        myUserId: this.props.myUserId,
        onSignUp: this.props.onSignUp,
        onSettings: this.props.onSettings,
        onNewTopic: this.handleNewTopic,
        onCancel: onCancel
      }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxDEV)(_widgets_error_panel_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
        level: this.props.errorLevel,
        text: this.props.errorText,
        action: this.props.errorAction,
        actionText: this.props.errorActionText,
        onClearError: this.props.onError
      }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxDEV)(_widgets_load_spinner_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
        show: this.props.loadSpinnerVisible
      }, void 0, false), view === 'login' ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxDEV)(_login_view_jsx__WEBPACK_IMPORTED_MODULE_10__["default"], {
        login: this.props.login,
        disabled: this.props.loginDisabled,
        persist: this.props.persist,
        onLogin: this.props.onLoginRequest,
        onPersistenceChange: this.props.onPersistenceChange
      }, void 0, false) : view === 'register' ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxDEV)(react__WEBPACK_IMPORTED_MODULE_0__.Suspense, {
        fallback: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxDEV)("div", {
          className: "panel-form-row",
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "loading_note",
            defaultMessage: "Loading...",
            description: "Message shown when component is loading"
          }, void 0, false)
        }, void 0, false),
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxDEV)(CreateAccountView, {
          tinode: this.props.tinode,
          reqCredMethod: this.props.reqCredMethod,
          onShowCountrySelector: this.props.onShowCountrySelector,
          onCreateAccount: this.props.onCreateAccount,
          onCancel: this.props.onCancel,
          onError: this.props.onError
        }, void 0, false)
      }, void 0, false) : view === 'settings' ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxDEV)(_settings_view_jsx__WEBPACK_IMPORTED_MODULE_12__["default"], {
        transport: this.props.transport,
        serverAddress: this.props.serverAddress,
        secureConnection: this.props.secureConnection,
        onCancel: this.props.onCancel,
        onUpdate: this.props.onGlobalSettings
      }, void 0, false) : view === 'edit' ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxDEV)(react__WEBPACK_IMPORTED_MODULE_0__.Suspense, {
        fallback: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxDEV)("div", {
          className: "panel-form-row",
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "loading_note",
            defaultMessage: "Loading...",
            description: "Message shown when component is loading"
          }, void 0, false)
        }, void 0, false),
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxDEV)(AccountSettingsView, {
          tinode: this.props.tinode,
          myUserId: this.props.myUserId,
          trustedBadges: this.props.trustedBadges,
          reqCredMethod: this.props.reqCredMethod,
          onShowCountrySelector: this.props.onShowCountrySelector,
          onNavigate: this.props.onNavigate,
          onCredAdd: this.props.onCredAdd,
          onCredDelete: this.props.onCredDelete,
          onCredConfirm: this.props.onCredConfirm,
          onError: this.props.onError
        }, void 0, false)
      }, void 0, false) : view === 'general' || view === 'crop' ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxDEV)(_topic_common_view_jsx__WEBPACK_IMPORTED_MODULE_5__["default"], {
        topic: "me",
        tinode: this.props.tinode,
        myUserId: this.props.myUserId,
        reqCredMethod: this.props.reqCredMethod,
        onUpdateTopicDesc: this.props.onUpdateAccountDesc,
        onUpdateTagsRequest: this.props.onUpdateAccountTags,
        onError: this.props.onError
      }, void 0, false) : view === 'acc_general' ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxDEV)(_acc_general_view_jsx__WEBPACK_IMPORTED_MODULE_7__["default"], {
        colorSchema: this.props.colorSchema,
        onSelectWallpapers: this.props.onSelectWallpapers,
        textSize: this.props.textSize,
        sendOnEnter: this.props.sendOnEnter,
        onChangeColorSchema: this.props.onChangeColorSchema,
        onTextSizeChanged: this.props.onTextSizeChanged,
        onSendOnEnterChanged: this.props.onSendOnEnterChanged
      }, void 0, false) : view === 'notif' ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxDEV)(_acc_notifications_view_jsx__WEBPACK_IMPORTED_MODULE_8__["default"], {
        messageSounds: this.props.messageSounds,
        desktopAlerts: this.props.desktopAlerts,
        desktopAlertsEnabled: this.props.desktopAlertsEnabled,
        onTogglePushNotifications: this.props.onTogglePushNotifications,
        onToggleMessageSounds: this.props.onToggleMessageSounds
      }, void 0, false) : view === 'security' ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxDEV)(react__WEBPACK_IMPORTED_MODULE_0__.Suspense, {
        fallback: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxDEV)("div", {
          className: "panel-form-row",
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "loading_note",
            defaultMessage: "Loading...",
            description: "Message shown when component is loading"
          }, void 0, false)
        }, void 0, false),
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxDEV)(AccSecurityView, {
          tinode: this.props.tinode,
          incognitoMode: this.props.incognitoMode,
          onUpdateAccountDesc: this.props.onUpdateAccountDesc,
          onUpdatePassword: this.props.onUpdatePassword,
          onLogout: this.props.onLogout,
          onDeleteAccount: this.props.onDeleteAccount,
          onShowAlert: this.props.onShowAlert,
          onShowBlocked: this.props.onShowBlocked,
          onToggleIncognitoMode: this.props.onToggleIncognitoMode
        }, void 0, false)
      }, void 0, false) : view === 'support' ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxDEV)(_acc_support_view_jsx__WEBPACK_IMPORTED_MODULE_9__["default"], {
        serverAddress: this.props.serverAddress,
        serverVersion: this.props.serverVersion
      }, void 0, false) : view === 'wallpapers' ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxDEV)(react__WEBPACK_IMPORTED_MODULE_0__.Suspense, {
        fallback: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxDEV)("div", {
          className: "panel-form-row",
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "loading_note",
            defaultMessage: "Loading...",
            description: "Message shown when component is loading"
          }, void 0, false)
        }, void 0, false),
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxDEV)(WallpapersView, {
          wallpaper: this.props.wallpaper,
          wallpaperSize: this.props.wallpaperSize,
          wallpaperBlur: this.props.wallpaperBlur,
          colorSchema: this.props.colorSchema !== 'auto' ? this.props.colorSchema : this.props.systemColorSchema,
          onWallpaperSelected: this.props.onWallpaperSelected
        }, void 0, false)
      }, void 0, false) : view === 'contacts' || view == 'archive' || view == 'blocked' ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxDEV)(_contacts_view_jsx__WEBPACK_IMPORTED_MODULE_6__["default"], {
        tinode: this.props.tinode,
        myUserId: this.props.myUserId,
        connected: this.props.connected,
        topicSelected: this.props.topicSelected,
        archive: view == 'archive',
        blocked: view == 'blocked',
        chatList: this.props.chatList,
        showContextMenu: this.props.showContextMenu,
        onTopicSelected: this.props.onTopicSelected,
        onShowArchive: this.props.onShowArchive
      }, void 0, false) : view === 'newtpk' ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxDEV)(_new_topic_view_jsx__WEBPACK_IMPORTED_MODULE_11__["default"], {
        tinode: this.props.tinode,
        searchResults: this.props.searchResults,
        onInitFind: this.props.onInitFind,
        onSearchContacts: this.props.onSearchContacts,
        onCreateTopic: this.props.onCreateTopic,
        onError: this.props.onError
      }, void 0, false) : view === 'cred' ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxDEV)(_validation_view_jsx__WEBPACK_IMPORTED_MODULE_13__["default"], {
        credCode: this.props.credCode,
        credMethod: this.props.credMethod,
        credToken: this.props.credToken,
        onSubmit: this.props.onValidateCredentials,
        onCancel: this.props.onCancel
      }, void 0, false) : view === 'reset' ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxDEV)(react__WEBPACK_IMPORTED_MODULE_0__.Suspense, {
        fallback: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxDEV)("div", {
          className: "panel-form-row",
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "loading_note",
            defaultMessage: "Loading...",
            description: "Message shown when component is loading"
          }, void 0, false)
        }, void 0, false),
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxDEV)(PasswordResetView, {
          tinode: this.props.tinode,
          reqCredMethod: this.props.reqCredMethod,
          onShowCountrySelector: this.props.onShowCountrySelector,
          onRequest: this.props.onPasswordResetRequest,
          onReset: this.props.onResetPassword,
          onCancel: this.props.onCancel,
          onError: this.props.onError
        }, void 0, false)
      }, void 0, false) : null]
    }, void 0, true);
  }
}
;
/* harmony default export */ __webpack_exports__["default"] = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(SidepanelView));

/***/ }),

/***/ "./src/views/tinode-web.jsx":
/*!**********************************!*\
  !*** ./src/views/tinode-web.jsx ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var firebase_app__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! firebase/app */ "./node_modules/firebase/app/dist/esm/index.esm.js");
/* harmony import */ var firebase_messaging__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! firebase/messaging */ "./node_modules/firebase/messaging/dist/esm/index.esm.js");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _widgets_alert_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../widgets/alert.jsx */ "./src/widgets/alert.jsx");
/* harmony import */ var _widgets_context_menu_jsx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../widgets/context-menu.jsx */ "./src/widgets/context-menu.jsx");
/* harmony import */ var _widgets_forward_dialog_jsx__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../widgets/forward-dialog.jsx */ "./src/widgets/forward-dialog.jsx");
/* harmony import */ var _widgets_call_incoming_jsx__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../widgets/call-incoming.jsx */ "./src/widgets/call-incoming.jsx");
/* harmony import */ var _sidepanel_view_jsx__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./sidepanel-view.jsx */ "./src/views/sidepanel-view.jsx");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../constants.js */ "./src/constants.js");
/* harmony import */ var _version_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../version.js */ "./src/version.js");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
/* harmony import */ var _lib_host_name_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../lib/host-name.js */ "./src/lib/host-name.js");
/* harmony import */ var _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../lib/local-storage.js */ "./src/lib/local-storage.js");
/* harmony import */ var _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../lib/navigation.js */ "./src/lib/navigation.js");
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");









const PhoneCountrySelector = react__WEBPACK_IMPORTED_MODULE_0___default().lazy(_ => __webpack_require__.e(/*! import() */ "src_widgets_phone-country-selector_jsx").then(__webpack_require__.bind(__webpack_require__, /*! ../widgets/phone-country-selector.jsx */ "./src/widgets/phone-country-selector.jsx")));
const InfoView = react__WEBPACK_IMPORTED_MODULE_0___default().lazy(_ => __webpack_require__.e(/*! import() */ "src_views_info-view_jsx").then(__webpack_require__.bind(__webpack_require__, /*! ./info-view.jsx */ "./src/views/info-view.jsx")));
const MessagesView = react__WEBPACK_IMPORTED_MODULE_0___default().lazy(_ => __webpack_require__.e(/*! import() */ "src_views_messages-view_jsx").then(__webpack_require__.bind(__webpack_require__, /*! ./messages-view.jsx */ "./src/views/messages-view.jsx")));











const POP_SOUND = new Audio('audio/msg.m4a');
const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  reconnect_countdown: {
    id: 'reconnect_countdown',
    defaultMessage: 'Disconnected. Reconnecting in {seconds}…',
    description: 'Message shown when an app update is available.'
  },
  reconnect_now: {
    id: 'reconnect_now',
    defaultMessage: 'Try now',
    description: 'Prompt for reconnecting now'
  },
  push_init_failed: {
    id: 'push_init_failed',
    defaultMessage: 'Failed to initialize push notifications',
    description: 'Error message when push notifications have failed to initialize.'
  },
  invalid_security_token: {
    id: 'invalid_security_token',
    defaultMessage: 'Invalid security token',
    description: 'Error message when resetting password.'
  },
  no_connection: {
    id: 'no_connection',
    defaultMessage: 'No connection',
    description: 'Warning that the user is offline.'
  },
  code_doesnot_match: {
    id: 'code_doesnot_match',
    defaultMessage: 'Code does not match',
    description: 'Error message when the credential validation code is incorrect.'
  },
  menu_item_info: {
    id: 'menu_item_info',
    defaultMessage: 'Info',
    description: 'Show extended topic information'
  },
  menu_item_audio_call: {
    id: 'menu_item_audio_call',
    defaultMessage: 'Call',
    description: 'Start audio call'
  },
  menu_item_video_call: {
    id: 'menu_item_video_call',
    defaultMessage: 'Video call',
    description: 'Start video call'
  },
  cred_confirmed_successfully: {
    id: 'cred_confirmed_successfully',
    defaultMessage: 'Confirmed successfully',
    description: 'Notification message that the credential was successfully validated.'
  },
  password_reset_success: {
    id: 'password_reset_success',
    defaultMessage: 'Password reset successfully',
    description: 'Notification message that the password was successfully reset.'
  },
  select_country: {
    id: 'select_country',
    defaultMessage: 'Select country',
    description: 'Placeholder for the country selector'
  }
});
class TinodeWeb extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    this.selfRef = react__WEBPACK_IMPORTED_MODULE_0___default().createRef();
    this.state = this.getBlankState();
    this.handleResize = this.handleResize.bind(this);
    this.handleHashRoute = this.handleHashRoute.bind(this);
    this.handleOnline = this.handleOnline.bind(this);
    this.handleEscapeKey = this.handleEscapeKey.bind(this);
    this.handleColorSchemeChange = this.handleColorSchemeChange.bind(this);
    this.checkForAppUpdate = this.checkForAppUpdate.bind(this);
    this.handleVisibilityEvent = this.handleVisibilityEvent.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleLoginRequest = this.handleLoginRequest.bind(this);
    this.handlePersistenceChange = this.handlePersistenceChange.bind(this);
    this.handleConnected = this.handleConnected.bind(this);
    this.handleAutoreconnectIteration = this.handleAutoreconnectIteration.bind(this);
    this.doLogin = this.doLogin.bind(this);
    this.handleLoginSuccessful = this.handleLoginSuccessful.bind(this);
    this.handleDisconnect = this.handleDisconnect.bind(this);
    this.tnMeMetaDesc = this.tnMeMetaDesc.bind(this);
    this.tnMeContactUpdate = this.tnMeContactUpdate.bind(this);
    this.tnMeSubsUpdated = this.tnMeSubsUpdated.bind(this);
    this.resetContactList = this.resetContactList.bind(this);
    this.tnInitFind = this.tnInitFind.bind(this);
    this.tnFndSubsUpdated = this.tnFndSubsUpdated.bind(this);
    this.handleSearchContacts = this.handleSearchContacts.bind(this);
    this.handleTopicSelected = this.handleTopicSelected.bind(this);
    this.handleHideMessagesView = this.handleHideMessagesView.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.handleNewChatInvitation = this.handleNewChatInvitation.bind(this);
    this.handleNewAccount = this.handleNewAccount.bind(this);
    this.handleNewAccountRequest = this.handleNewAccountRequest.bind(this);
    this.handleUpdatePasswordRequest = this.handleUpdatePasswordRequest.bind(this);
    this.handleUpdateAccountTagsRequest = this.handleUpdateAccountTagsRequest.bind(this);
    this.handleToggleIncognitoMode = this.handleToggleIncognitoMode.bind(this);
    this.handleChangeColorSchema = this.handleChangeColorSchema.bind(this);
    this.handleChangeTextSize = this.handleChangeTextSize.bind(this);
    this.handleSendOnEnter = this.handleSendOnEnter.bind(this);
    this.handleSelectWallpapers = this.handleSelectWallpapers.bind(this);
    this.handleWallpaperSelected = this.handleWallpaperSelected.bind(this);
    this.handleSettings = this.handleSettings.bind(this);
    this.handleGlobalSettings = this.handleGlobalSettings.bind(this);
    this.handleShowArchive = this.handleShowArchive.bind(this);
    this.handleShowBlocked = this.handleShowBlocked.bind(this);
    this.handleToggleMessageSounds = this.handleToggleMessageSounds.bind(this);
    this.handleCredAdd = this.handleCredAdd.bind(this);
    this.handleCredDelete = this.handleCredDelete.bind(this);
    this.handleCredConfirm = this.handleCredConfirm.bind(this);
    this.initFCMessaging = this.initFCMessaging.bind(this);
    this.toggleFCMToken = this.toggleFCMToken.bind(this);
    this.handlePushMessage = this.handlePushMessage.bind(this);
    this.handleSidepanelCancel = this.handleSidepanelCancel.bind(this);
    this.handleStartTopicRequest = this.handleStartTopicRequest.bind(this);
    this.handleNewTopicCreated = this.handleNewTopicCreated.bind(this);
    this.handleTopicUpdateRequest = this.handleTopicUpdateRequest.bind(this);
    this.handleUnarchive = this.handleUnarchive.bind(this);
    this.handleChangePermissions = this.handleChangePermissions.bind(this);
    this.handleTagsUpdateRequest = this.handleTagsUpdateRequest.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleDeleteAccount = this.handleDeleteAccount.bind(this);
    this.handleDeleteTopicRequest = this.handleDeleteTopicRequest.bind(this);
    this.handleDeleteMessagesRequest = this.handleDeleteMessagesRequest.bind(this);
    this.handleLeaveUnsubRequest = this.handleLeaveUnsubRequest.bind(this);
    this.handleBlockTopicRequest = this.handleBlockTopicRequest.bind(this);
    this.handleReportTopic = this.handleReportTopic.bind(this);
    this.handleShareTheCard = this.handleShareTheCard.bind(this);
    this.handleShowContextMenu = this.handleShowContextMenu.bind(this);
    this.defaultTopicContextMenu = this.defaultTopicContextMenu.bind(this);
    this.handleHideContextMenu = this.handleHideContextMenu.bind(this);
    this.handleShowAlert = this.handleShowAlert.bind(this);
    this.handleShowInfoView = this.handleShowInfoView.bind(this);
    this.handleMemberUpdateRequest = this.handleMemberUpdateRequest.bind(this);
    this.handleValidateCredentialsRequest = this.handleValidateCredentialsRequest.bind(this);
    this.handlePasswordResetRequest = this.handlePasswordResetRequest.bind(this);
    this.handleResetPassword = this.handleResetPassword.bind(this);
    this.handleContextMenuAction = this.handleContextMenuAction.bind(this);
    this.handleShowCountrySelector = this.handleShowCountrySelector.bind(this);
    this.handleShowForwardDialog = this.handleShowForwardDialog.bind(this);
    this.handleHideForwardDialog = this.handleHideForwardDialog.bind(this);
    this.handleStartVideoCall = this.handleStartVideoCall.bind(this);
    this.handleStartAudioCall = this.handleStartAudioCall.bind(this);
    this.handleInfoMessage = this.handleInfoMessage.bind(this);
    this.handleDataMessage = this.handleDataMessage.bind(this);
    this.handleCallClose = this.handleCallClose.bind(this);
    this.handleCallInvite = this.handleCallInvite.bind(this);
    this.handleCallRinging = this.handleCallRinging.bind(this);
    this.handleCallHangup = this.handleCallHangup.bind(this);
    this.handleCallSendOffer = this.handleCallSendOffer.bind(this);
    this.handleCallIceCandidate = this.handleCallIceCandidate.bind(this);
    this.handleCallSendAnswer = this.handleCallSendAnswer.bind(this);
    this.handleCallAccept = this.handleCallAccept.bind(this);
    this.sendMessageToTopic = this.sendMessageToTopic.bind(this);
    this.callTimeoutTimer = null;
  }
  getBlankState() {
    const settings = _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_15__["default"].getObject('settings') || {};
    const persist = !!_lib_local_storage_js__WEBPACK_IMPORTED_MODULE_15__["default"].getObject('keep-logged-in');
    if (!settings.wallpaper) {
      const wallpaper = (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_18__.defaultWallpaper)();
      settings.wallpaper = wallpaper.name || '';
      settings.wallpaperSize = wallpaper.size || 0;
      settings.wallpaperBlur = 0;
    }
    return {
      connected: false,
      ready: false,
      autoLogin: false,
      transport: settings.transport || null,
      serverAddress: settings.serverAddress || (0,_lib_host_name_js__WEBPACK_IMPORTED_MODULE_14__.detectServerAddress)(),
      secureConnection: settings.secureConnection === undefined ? (0,_lib_host_name_js__WEBPACK_IMPORTED_MODULE_14__.isSecureConnection)() : settings.secureConnection,
      serverVersion: "no connection",
      messageSounds: !settings.messageSoundsOff,
      incognitoMode: false,
      colorSchema: settings.colorSchema || _config_js__WEBPACK_IMPORTED_MODULE_10__.DEFAULT_COLOR_SCHEME,
      systemColorSchema: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
      wallpaper: settings.wallpaper,
      wallpaperSize: settings.wallpaperSize,
      wallpaperBlur: 0,
      textSize: settings.textSize || _config_js__WEBPACK_IMPORTED_MODULE_10__.DEFAULT_TEXT_SIZE,
      sendOnEnter: settings.sendOnEnter || 'plain',
      desktopAlerts: persist && !!settings.desktopAlerts,
      desktopAlertsEnabled: ((0,_lib_host_name_js__WEBPACK_IMPORTED_MODULE_14__.isSecureConnection)() || (0,_lib_host_name_js__WEBPACK_IMPORTED_MODULE_14__.isLocalHost)()) && typeof firebase_app__WEBPACK_IMPORTED_MODULE_2__.initializeApp != 'undefined' && typeof navigator != 'undefined' && typeof FIREBASE_INIT != 'undefined',
      firebaseToken: persist ? _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_15__["default"].getObject('firebase-token') : null,
      applicationVisible: !document.hidden,
      errorText: '',
      errorLevel: null,
      errorAction: undefined,
      errorActionText: null,
      sidePanelSelected: 'login',
      sidePanelTitle: null,
      sidePanelAvatar: null,
      myTrustedBadges: [],
      loadSpinnerVisible: false,
      login: '',
      password: '',
      persist: persist,
      myUserId: null,
      liveConnection: navigator.onLine,
      topicSelected: '',
      topicSelectedOnline: false,
      topicSelectedAcs: null,
      newTopicParams: null,
      loginDisabled: false,
      displayMobile: window.innerWidth <= _config_js__WEBPACK_IMPORTED_MODULE_10__.MEDIA_BREAKPOINT,
      infoPanel: undefined,
      mobilePanel: 'sidepanel',
      callTopic: undefined,
      callState: _constants_js__WEBPACK_IMPORTED_MODULE_11__.CALL_STATE_NONE,
      callAudioOnly: undefined,
      callShouldStart: false,
      contextMenuVisible: false,
      contextMenuBounds: null,
      contextMenuClickAt: null,
      contextMenuParams: null,
      contextMenuItems: [],
      forwardDialogVisible: false,
      forwardMessage: null,
      alertVisible: false,
      alertParams: {},
      chatList: [],
      searchResults: [],
      searchableContacts: [],
      reqCredMethod: undefined,
      credMethod: undefined,
      credCode: undefined,
      credToken: undefined,
      requestedTopic: undefined
    };
  }
  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.handleOnlineOn = _ => {
      this.handleOnline(true);
    };
    window.addEventListener('online', this.handleOnlineOn);
    this.handleOnlineOff = _ => {
      this.handleOnline(false);
    };
    window.addEventListener('offline', this.handleOnlineOff);
    window.addEventListener('hashchange', this.handleHashRoute);
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', this.handleColorSchemeChange);
    document.addEventListener('visibilitychange', this.handleVisibilityEvent);
    document.addEventListener('keydown', this.handleEscapeKey);
    document.documentElement.style.colorScheme = this.state.colorSchema == 'auto' ? 'light dark' : this.state.colorSchema;
    document.documentElement.style.setProperty('--message-text-size', `${this.state.textSize}pt`);
    this.applyWallpaperSettings(this.state.wallpaper, this.state.wallpaperSize, this.state.wallpaperBlur, this.state.colorSchema == 'auto' ? this.state.systemColorSchema : this.state.colorSchema);
    if (typeof BroadcastChannel == 'function') {
      const serviceWorkerChannel = new BroadcastChannel('tinode-sw');
      serviceWorkerChannel.addEventListener('message', this.handlePushMessage);
    } else {
      console.warn("Your browser does not support BroadcastChannel. Some features will not be available");
    }
    this.lastWakeUpCheck = new Date().getTime();
    this.wakeUpTicker = setInterval(_ => {
      const now = new Date().getTime();
      if (now - this.lastWakeUpCheck > _config_js__WEBPACK_IMPORTED_MODULE_10__.WAKE_UP_TIMEOUT) {
        this.handleOnlineOn();
      }
      this.lastWakeUpCheck = now;
    }, _config_js__WEBPACK_IMPORTED_MODULE_10__.WAKE_UP_TICK);
    this.setState({
      viewportWidth: document.documentElement.clientWidth,
      viewportHeight: document.documentElement.clientHeight
    });
    new Promise((resolve, reject) => {
      this.tinode = TinodeWeb.tnSetup(this.state.serverAddress, (0,_lib_host_name_js__WEBPACK_IMPORTED_MODULE_14__.isSecureConnection)(), this.state.transport, this.props.intl.locale, this.state.persist, resolve);
      this.tinode.onConnect = this.handleConnected;
      this.tinode.onDisconnect = this.handleDisconnect;
      this.tinode.onAutoreconnectIteration = this.handleAutoreconnectIteration;
      this.tinode.onInfoMessage = this.handleInfoMessage;
      this.tinode.onDataMessage = this.handleDataMessage;
    }).then(_ => {
      if (this.state.desktopAlertsEnabled) {
        this.initFCMessaging().catch(_ => {});
      }
      this.resetContactList();
      const token = this.state.persist ? _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_15__["default"].getObject('auth-token') : undefined;
      if (token) {
        this.setState({
          autoLogin: true
        });
        token.expires = new Date(token.expires);
        this.tinode.setAuthToken(token);
        this.tinode.connect().catch(err => {
          this.handleError(err.message, 'err');
        });
      }
      const parsedNav = _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].parseUrlHash(window.location.hash);
      if (!['cred', 'reset', 'register'].includes(parsedNav.path[0])) {
        this.setState({
          requestedTopic: parsedNav.path[1]
        });
        const path = parsedNav.params && parsedNav.params.cred_done ? _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].addUrlParam('', 'cred_done', parsedNav.params.cred_done) : '';
        _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].navigateTo(path);
      } else {
        this.handleHashRoute();
      }
    });
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('hashchange', this.handleHashRoute);
    window.removeEventListener('online', this.handleOnlineOn);
    window.removeEventListener('offline', this.handleOnlineOff);
    window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', this.handleColorSchemeChange);
    document.removeEventListener('visibilitychange', this.handleVisibilityEvent);
    document.removeEventListener('keydown', this.handleEscapeKey);
    clearInterval(this.wakeUpTicker);
  }
  static tnSetup(serverAddress, secureConnection, transport, locale, persistentCache, onSetupCompleted) {
    const tinode = new tinode_sdk__WEBPACK_IMPORTED_MODULE_4__.Tinode({
      appName: _config_js__WEBPACK_IMPORTED_MODULE_10__.APP_NAME,
      host: serverAddress,
      apiKey: _config_js__WEBPACK_IMPORTED_MODULE_10__.API_KEY,
      transport: transport,
      secure: secureConnection,
      persist: persistentCache
    }, onSetupCompleted);
    tinode.setHumanLanguage(locale);
    tinode.enableLogging(_config_js__WEBPACK_IMPORTED_MODULE_10__.LOGGING_ENABLED, true);
    return tinode;
  }
  handlePushMessage(payload) {
    this.tinode.oobNotification(payload.data || {});
  }
  initFCMessaging() {
    const {
      formatMessage,
      locale
    } = this.props.intl;
    const onError = (msg, err) => {
      console.error(msg, err);
      this.handleError(formatMessage(messages.push_init_failed), 'err');
      this.setState({
        firebaseToken: null
      });
      _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_15__["default"].updateObject('settings', {
        desktopAlerts: false
      });
    };
    try {
      this.fcm = (0,firebase_messaging__WEBPACK_IMPORTED_MODULE_3__.getMessaging)((0,firebase_app__WEBPACK_IMPORTED_MODULE_2__.initializeApp)(FIREBASE_INIT, _config_js__WEBPACK_IMPORTED_MODULE_10__.BASE_APP_NAME));
      return navigator.serviceWorker.getRegistration('/service-worker.js').then(reg => {
        return reg || navigator.serviceWorker.register('/service-worker.js').then(reg => {
          this.checkForAppUpdate(reg);
          return reg;
        });
      }).then(reg => {
        (reg.active || reg.installing).postMessage(JSON.stringify({
          locale: locale,
          version: _version_js__WEBPACK_IMPORTED_MODULE_12__.PACKAGE_VERSION
        }));
        return TinodeWeb.requestFCMToken(this.fcm, reg);
      }).then(token => {
        const persist = _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_15__["default"].getObject('keep-logged-in');
        if (token != this.state.firebaseToken) {
          this.tinode.setDeviceToken(token);
          if (persist) {
            _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_15__["default"].setObject('firebase-token', token);
          }
        }
        this.setState({
          firebaseToken: token,
          desktopAlerts: true
        });
        if (persist) {
          _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_15__["default"].updateObject('settings', {
            desktopAlerts: true
          });
        }
        (0,firebase_messaging__WEBPACK_IMPORTED_MODULE_3__.onMessage)(this.fcm, payload => {
          this.handlePushMessage(payload);
        });
      }).catch(err => {
        onError(err);
        throw err;
      });
    } catch (err) {
      onError(err);
      return Promise.reject(err);
    }
  }
  static requestFCMToken(fcm, sw) {
    return (0,firebase_messaging__WEBPACK_IMPORTED_MODULE_3__.getToken)(fcm, {
      serviceWorkerRegistration: sw,
      vapidKey: FIREBASE_INIT.messagingVapidKey
    }).then(token => {
      if (token) {
        return token;
      } else if (typeof Notification != 'undefined') {
        return Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            return (0,firebase_messaging__WEBPACK_IMPORTED_MODULE_3__.getToken)(fcm, {
              serviceWorkerRegistration: sw,
              vapidKey: FIREBASE_INIT.messagingVapidKey
            }).then(token => {
              if (token) {
                return token;
              } else {
                throw new Error("Failed to initialize notifications");
              }
            });
          } else {
            throw new Error("No permission to send notifications: " + permission);
          }
        });
      }
      throw new Error("Notifications are not supported");
    });
  }
  handleResize() {
    const mobile = document.documentElement.clientWidth <= _config_js__WEBPACK_IMPORTED_MODULE_10__.MEDIA_BREAKPOINT;
    this.setState({
      viewportWidth: document.documentElement.clientWidth,
      viewportHeight: document.documentElement.clientHeight
    });
    if (this.state.displayMobile != mobile) {
      this.setState({
        displayMobile: mobile
      });
    }
  }
  handleEscapeKey(e) {
    if (e.key === 'Escape' || e.keyCode === 27) {
      this.setState({
        topicSelected: null,
        errorText: '',
        errorLevel: null,
        mobilePanel: 'sidepanel',
        topicSelectedOnline: false,
        topicSelectedAcs: null,
        infoPanel: undefined,
        forwardMessage: null,
        contextMenuVisible: false,
        forwardDialogVisible: false,
        alertVisible: false
      });
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].setUrlTopic('', null));
    }
  }
  checkForAppUpdate(reg) {
    reg.onupdatefound = _ => {
      const installingWorker = reg.installing;
      installingWorker.onstatechange = _ => {
        if (installingWorker.state == 'installed' && navigator.serviceWorker.controller) {
          const msg = (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_19__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_19__.Fragment, {
            children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_19__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
              id: "update_available",
              defaultMessage: "Update available.",
              description: "Message shown when an app update is available."
            }, void 0, false), " ", (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_19__.jsxDEV)("a", {
              href: "",
              children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_19__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
                id: "reload_update",
                defaultMessage: "Reload",
                description: "Call to action to reload application when update is available."
              }, void 0, false)
            }, void 0, false), "."]
          }, void 0, true);
          this.handleError(msg, 'info');
        }
      };
    };
  }
  handleHashRoute() {
    const hash = _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].parseUrlHash(window.location.hash);
    const newState = {
      infoPanel: hash.params.info,
      newTopicTabSelected: hash.params.tab
    };
    if (hash.path && hash.path.length > 0) {
      if (['acc_general', 'archive', 'blocked', 'contacts', 'cred', 'crop', 'edit', 'general', 'newtpk', 'notif', 'register', 'reset', 'security', 'settings', 'support', 'wallpapers', ''].includes(hash.path[0])) {
        newState.sidePanelSelected = hash.path[0];
      } else {
        console.warn("Unknown sidepanel view", hash.path[0]);
      }
      let topicName = hash.path[1] || null;
      if (topicName != this.state.topicSelected) {
        if (!tinode_sdk__WEBPACK_IMPORTED_MODULE_4__.Tinode.topicType(topicName)) {
          topicName = null;
          newState.mobilePanel = 'sidepanel';
        } else {
          newState.mobilePanel = 'topic-view';
        }
        Object.assign(newState, {
          topicSelected: topicName,
          topicSelectedAcs: this.tinode.getTopicAccessMode(topicName)
        });
      }
    } else {
      Object.assign(newState, {
        sidePanelSelected: '',
        topicSelected: null
      });
    }
    if (hash.params.method) {
      newState.credMethod = hash.params.method;
    }
    if (hash.params.code) {
      newState.credCode = hash.params.code;
    }
    if (hash.params.token) {
      newState.credToken = hash.params.token;
    }
    if (hash.params.cred_done) {
      Object.assign(newState, TinodeWeb.stateForError(this.props.intl.formatMessage(messages.cred_confirmed_successfully), 'info'));
    }
    this.setState(newState);
  }
  handleOnline(online) {
    if (online) {
      this.handleError();
      clearInterval(this.reconnectCountdown);
      this.tinode.reconnect();
    } else {
      this.handleError(this.props.intl.formatMessage(messages.no_connection), 'warn');
    }
    this.setState({
      liveConnection: online
    });
  }
  handleVisibilityEvent() {
    this.setState({
      applicationVisible: !document.hidden
    });
  }
  static stateForError(err, level, action, actionText) {
    return {
      errorText: err,
      errorLevel: level,
      errorAction: action,
      errorActionText: actionText,
      callShouldStart: false
    };
  }
  handleError(err, level, action, actionText) {
    this.setState(TinodeWeb.stateForError(err, level, action, actionText));
  }
  handleLoginRequest(login, password) {
    this.setState({
      loginDisabled: true,
      login: login,
      password: password,
      loadSpinnerVisible: true,
      autoLogin: true
    });
    this.handleError('', null);
    if (this.tinode.isConnected()) {
      this.doLogin(login, password, null, {
        meth: this.state.credMethod,
        resp: this.state.credCode
      });
    } else {
      this.tinode.connect().catch(err => {
        this.setState({
          loginDisabled: false,
          autoLogin: false,
          loadSpinnerVisible: false
        });
        this.handleError(err.message, 'err');
      });
    }
    if (this.state.desktopAlertsEnabled && !this.state.firebaseToken) {
      this.initFCMessaging();
    }
  }
  handlePersistenceChange(persist) {
    if (persist) {
      this.tinode.initStorage().then(_ => {
        _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_15__["default"].setObject('keep-logged-in', true);
        this.setState({
          persist: true
        });
      });
    } else {
      this.tinode.clearStorage().then(_ => {
        _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_15__["default"].setObject('keep-logged-in', false);
        this.setState({
          persist: false
        });
      });
    }
  }
  handleConnected() {
    clearInterval(this.reconnectCountdown);
    this.handleError();
    const params = this.tinode.getServerInfo();
    this.setState({
      serverVersion: params.ver + ' ' + (params.build ? params.build : 'none'),
      reqCredMethod: ((params.reqCred || {}).auth || [])[0] || 'email'
    });
    if (this.state.autoLogin) {
      this.doLogin(this.state.login, this.state.password, null, {
        meth: this.state.credMethod,
        resp: this.state.credCode
      });
    }
  }
  handleAutoreconnectIteration(sec, prom) {
    clearInterval(this.reconnectCountdown);
    if (sec < 0) {
      this.handleError();
      return;
    }
    if (prom) {
      prom.then(_ => {
        this.handleError();
      }).catch(err => {
        this.handleError(err.message, 'err');
      });
      return;
    }
    const {
      formatMessage
    } = this.props.intl;
    let count = sec / 1000;
    count = count | count;
    this.reconnectCountdown = setInterval(_ => {
      if (count < -10) {
        clearInterval(this.reconnectCountdown);
        this.tinode.reconnect();
        return;
      }
      const fmtTime = count > 99 ? (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_17__.secondsToTime)(count) : count;
      this.handleError(formatMessage(messages.reconnect_countdown, {
        seconds: fmtTime
      }), 'warn', _ => {
        clearInterval(this.reconnectCountdown);
        this.tinode.reconnect();
      }, formatMessage(messages.reconnect_now));
      count -= 1;
    }, 1000);
  }
  handleDisconnect(err) {
    this.setState({
      connected: false,
      ready: false,
      topicSelectedOnline: false,
      errorText: err && err.message ? err.message : "Disconnected",
      errorLevel: err && err.message ? 'err' : 'warn',
      loginDisabled: false,
      contextMenuVisible: false,
      forwardDialogVisible: false,
      serverVersion: "no connection"
    });
  }
  doLogin(login, password, tmpToken, cred) {
    if (this.tinode.isAuthenticated()) {
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].navigateTo('');
      return;
    }
    let token = tmpToken || (this.tinode.getAuthToken() || {}).token;
    if (!(login && password) && !token) {
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].navigateTo('');
      this.setState({
        loginDisabled: false
      });
      return;
    }
    cred = tinode_sdk__WEBPACK_IMPORTED_MODULE_4__.Tinode.credential(cred);
    let connectionPromise = this.tinode.isConnected() ? Promise.resolve() : this.tinode.connect();
    let loginPromise;
    if (login && password) {
      token = null;
      this.setState({
        password: null
      });
      loginPromise = connectionPromise.then(_ => this.tinode.loginBasic(login, password, cred));
    } else {
      loginPromise = connectionPromise.then(_ => this.tinode.loginToken(token, cred));
    }
    loginPromise.then(ctrl => {
      if (ctrl.code >= 300 && ctrl.text === 'validate credentials') {
        this.setState({
          loadSpinnerVisible: false
        });
        if (cred) {
          this.handleError(this.props.intl.formatMessage(messages.code_doesnot_match), 'warn');
        }
        TinodeWeb.navigateToCredentialsView(ctrl.params);
      } else {
        this.handleLoginSuccessful();
      }
    }).catch(err => {
      const autoLogin = err.code >= 500;
      this.setState({
        loginDisabled: false,
        credMethod: undefined,
        credCode: undefined,
        loadSpinnerVisible: false,
        autoLogin: autoLogin
      });
      this.handleError(err.message, 'err');
      console.warn("Login failed", err);
      if (!autoLogin) {
        if (token) {
          this.handleLogout();
        }
        _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].navigateTo('');
      }
    });
  }
  static navigateToCredentialsView(params) {
    const parsed = _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].parseUrlHash(window.location.hash);
    parsed.path[0] = 'cred';
    parsed.params['method'] = params.cred[0];
    parsed.params['token'] = params.token;
    parsed.params['code'] = params.code;
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].composeUrlHash(parsed.path, parsed.params));
  }
  handleLoginSuccessful() {
    this.handleError();
    if (_lib_local_storage_js__WEBPACK_IMPORTED_MODULE_15__["default"].getObject('keep-logged-in')) {
      _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_15__["default"].setObject('auth-token', this.tinode.getAuthToken());
    }
    const goToTopic = this.state.requestedTopic || this.state.topicSelected;
    const me = this.tinode.getMeTopic();
    me.onMetaDesc = this.tnMeMetaDesc;
    me.onContactUpdate = this.tnMeContactUpdate;
    me.onSubsUpdated = this.tnMeSubsUpdated;
    this.setState({
      connected: true,
      credMethod: undefined,
      credCode: undefined,
      credToken: undefined,
      myUserId: this.tinode.getCurrentUserID(),
      autoLogin: true,
      requestedTopic: undefined
    });
    me.subscribe(me.startMetaQuery().withLaterSub().withDesc().withTags().withCred().build()).catch(err => {
      this.tinode.disconnect();
      localStorage.removeItem('auth-token');
      this.handleError(err.message, 'err');
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].navigateTo('');
    }).finally(_ => {
      this.setState({
        loadSpinnerVisible: false
      });
    });
    let urlHash = _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].setUrlSidePanel(window.location.hash, 'contacts');
    if (goToTopic) {
      urlHash = _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].setUrlTopic(urlHash, goToTopic);
    }
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].navigateTo(urlHash);
  }
  tnMeMetaDesc(desc) {
    if (!desc) {
      return;
    }
    if (desc.public) {
      this.setState({
        sidePanelTitle: desc.public.fn,
        sidePanelAvatar: (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_13__.makeImageUrl)(desc.public.photo)
      });
    }
    if (desc.trusted) {
      const badges = [];
      for (const [key, val] of Object.entries(desc.trusted)) {
        if (val) {
          badges.push(key);
        }
      }
      this.setState({
        myTrustedBadges: badges
      });
    }
    if (desc.acs) {
      this.setState({
        incognitoMode: !desc.acs.isPresencer()
      });
    }
    if (TinodeWeb.checkIfPinsUpdated(desc, this.state.chatList)) {
      this.resetContactList();
    }
  }
  tnMeContactUpdate(what, cont) {
    if (what == 'on' || what == 'off') {
      this.resetContactList();
      if (this.state.topicSelected == cont.topic) {
        this.setState({
          topicSelectedOnline: what == 'on'
        });
      }
    } else if (what == 'read') {
      this.resetContactList();
    } else if (what == 'msg' && cont) {
      const topic = this.tinode.getTopic(cont.topic);
      const archived = topic && topic.isArchived();
      if (cont.unread > 0 && this.state.messageSounds && !archived) {
        if (document.hidden || this.state.topicSelected != cont.topic) {
          POP_SOUND.play().catch(_ => {});
        }
      }
      this.resetContactList();
    } else if (what == 'recv') {} else if (what == 'gone' || what == 'unsub') {
      if (this.state.topicSelected == cont.topic) {
        this.handleTopicSelected(null);
      }
      this.resetContactList();
    } else if (what == 'acs') {
      if (this.state.topicSelected == cont.topic) {
        this.setState({
          topicSelectedAcs: cont.acs
        });
      }
    } else if (what == 'del') {} else if (what == 'upd' || what == 'call') {} else {
      console.info("Unsupported (yet) presence update:", what, "in", (cont || {}).topic);
    }
  }
  tnMeSubsUpdated(unused) {
    this.resetContactList();
  }
  static prepareSearchableContacts(chatList, foundContacts) {
    const merged = {};
    for (const c of chatList) {
      if (tinode_sdk__WEBPACK_IMPORTED_MODULE_4__.Tinode.isP2PTopicName(c.topic)) {
        merged[c.topic] = {
          user: c.topic,
          updated: c.updated,
          public: c.public,
          private: c.private,
          acs: c.acs
        };
      }
    }
    for (const c of foundContacts) {
      if (!merged[c.user]) {
        merged[c.user] = c;
      }
    }
    return Object.values(merged);
  }
  resetContactList() {
    const newState = {
      chatList: []
    };
    if (!this.state.ready) {
      newState.ready = true;
    }
    const me = this.tinode.getMeTopic();
    me.contacts(c => {
      if (!c.topic && !c.user) {
        c.topic = c.name;
      }
      newState.chatList.push(c);
      if (this.state.topicSelected == c.topic) {
        newState.topicSelectedOnline = c.online;
        newState.topicSelectedAcs = c.acs;
      }
    });
    const past = new Date(0);
    newState.chatList.sort((a, b) => {
      const pins = me.pinnedTopicRank(b.topic) - me.pinnedTopicRank(a.topic);
      return pins != 0 ? pins : (b.touched || past).getTime() - (a.touched || past).getTime();
    });
    newState.searchableContacts = TinodeWeb.prepareSearchableContacts(newState.chatList, this.state.searchResults);
    this.setState(newState);
  }
  static checkIfPinsUpdated(me, chatList) {
    for (let i = 0; i < chatList.length; i++) {
      const c = chatList[i];
      if (!!me.pinnedTopicRank(c.topic) != c.pinned) {
        return true;
      }
    }
    return false;
  }
  tnInitFind() {
    const fnd = this.tinode.getFndTopic();
    fnd.onSubsUpdated = this.tnFndSubsUpdated;
    if (fnd.isSubscribed()) {
      this.tnFndSubsUpdated();
    } else {
      fnd.subscribe(fnd.startMetaQuery().withSub().build()).catch(err => {
        this.handleError(err.message, 'err');
      });
    }
  }
  tnFndSubsUpdated() {
    const foundContacts = [];
    this.tinode.getFndTopic().contacts(s => {
      foundContacts.push(s);
    });
    this.setState({
      searchResults: foundContacts,
      searchableContacts: TinodeWeb.prepareSearchableContacts(this.state.chatList, foundContacts)
    });
  }
  handleSearchContacts(query) {
    const fnd = this.tinode.getFndTopic();
    fnd.setMeta({
      desc: {
        public: query
      }
    }).then(_ => fnd.getMeta(fnd.startMetaQuery().withSub().build())).catch(err => this.handleError(err.message, 'err'));
  }
  handleTopicSelected(topicName) {
    if (this.state.newTopicParams && this.state.newTopicParams._topicName != topicName) {
      this.setState({
        newTopicParams: null
      });
    }
    if (topicName) {
      this.setState({
        errorText: '',
        errorLevel: null,
        mobilePanel: 'topic-view',
        infoPanel: undefined
      });
      if (this.state.topicSelected != topicName) {
        this.setState({
          topicSelectedOnline: this.tinode.isTopicOnline(topicName),
          topicSelectedAcs: this.tinode.getTopicAccessMode(topicName),
          forwardMessage: null
        });
        _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].setUrlTopic('', topicName));
      }
    } else {
      this.setState({
        topicSelected: null,
        errorText: '',
        errorLevel: null,
        mobilePanel: 'sidepanel',
        topicSelectedOnline: false,
        topicSelectedAcs: null,
        infoPanel: undefined,
        forwardMessage: null
      });
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].setUrlTopic('', null));
    }
  }
  handleHideMessagesView() {
    this.setState({
      mobilePanel: 'sidepanel'
    });
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].setUrlTopic(window.location.hash, null));
  }
  handleSendMessage(msg, uploadCompletionPromise, uploader, head) {
    const topic = this.tinode.getTopic(this.state.topicSelected);
    return this.sendMessageToTopic(topic, msg, uploadCompletionPromise, uploader, head);
  }
  sendMessageToTopic(topic, msg, uploadCompletionPromise, uploader, head) {
    msg = topic.createMessage(msg, false);
    msg._uploader = uploader;
    if (head) {
      msg.head = Object.assign(msg.head || {}, head);
    }
    const completion = [];
    if (uploadCompletionPromise) {
      completion.push(uploadCompletionPromise);
    }
    if (!topic.isSubscribed()) {
      const subscribePromise = topic.subscribe().then(_ => {
        let calls = [];
        topic.queuedMessages(pub => {
          if (pub._sending || pub.seq == msg.seq) {
            return;
          }
          if (pub.head && pub.head.webrtc) {
            calls.push(pub.seq);
            return;
          }
          if (topic.isSubscribed()) {
            topic.publishMessage(pub);
          }
        });
        if (calls.length > 0) {
          topic.delMessagesList(calls, true);
        }
      });
      completion.push(subscribePromise);
    }
    return topic.publishDraft(msg, Promise.all(completion)).then(ctrl => {
      if (topic.isArchived()) {
        topic.archive(false);
      }
      return ctrl;
    }).catch(err => this.handleError(err.message, 'err'));
  }
  handleNewChatInvitation(topicName, action) {
    const topic = this.tinode.getTopic(topicName);
    let response = null;
    switch (action) {
      case 'accept':
        const mode = topic.getAccessMode().getGiven();
        response = topic.setMeta({
          sub: {
            mode: mode
          }
        });
        if (topic.isP2PType()) {
          response = response.then(_ => topic.setMeta({
            sub: {
              user: topicName,
              mode: mode
            }
          }));
        }
        break;
      case 'delete':
        response = topic.delTopic(true);
        break;
      case 'block':
        const am = topic.getAccessMode().updateWant('-JP').getWant();
        response = topic.setMeta({
          sub: {
            mode: am
          }
        }).then(_ => this.handleTopicSelected(null));
        break;
      default:
        console.warn("Unknown invitation action", '"' + action + '""');
    }
    if (response != null) {
      response.catch(err => this.handleError(err.message, 'err'));
    }
  }
  handleNewAccount() {
    this.handleError();
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].setUrlSidePanel(window.location.hash, 'register'));
  }
  handleNewAccountRequest(login_, password_, public_, cred_, tags_) {
    this.handleError();
    this.tinode.connect(this.state.serverAddress).then(_ => {
      let attachments;
      if (public_ && public_.photo && public_.photo.ref) {
        attachments = [public_.photo.ref];
      }
      return this.tinode.createAccountBasic(login_, password_, {
        public: public_,
        tags: tags_,
        cred: tinode_sdk__WEBPACK_IMPORTED_MODULE_4__.Tinode.credential(cred_),
        attachments: attachments
      });
    }).then(ctrl => {
      if (ctrl.code >= 300 && ctrl.text == 'validate credentials') {
        TinodeWeb.navigateToCredentialsView(ctrl.params);
      } else {
        this.handleLoginSuccessful(this);
      }
    }).catch(err => {
      this.handleError(err.message, 'err');
    });
  }
  handleToggleIncognitoMode(on) {
    this.setState({
      incognitoMode: null
    });
    const me = this.tinode.getMeTopic();
    const am = me.getAccessMode().updateWant(on ? '-P' : '+P').getWant();
    me.setMeta({
      sub: {
        mode: am
      }
    }).catch(err => {
      this.setState({
        incognitoMode: !on
      });
      this.handleError(err.message, 'err');
    });
  }
  handleChangeColorSchema(schema) {
    this.setState({
      colorSchema: schema
    });
    _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_15__["default"].updateObject('settings', {
      colorSchema: schema
    });
    document.documentElement.style.colorScheme = schema == 'auto' ? 'light dark' : schema;
    this.applyColorSchema(schema, this.state.systemColorSchema, this.state.wallpaperSize);
  }
  handleColorSchemeChange(event) {
    const systemSchema = event.matches ? 'dark' : 'light';
    this.setState({
      systemColorSchema: systemSchema
    });
    this.applyColorSchema(this.state.colorSchema, systemSchema, this.state.wallpaperSize);
  }
  applyColorSchema(schema, systemSchema, size) {
    const effectiveSchema = schema == 'auto' ? systemSchema : schema;
    document.documentElement.style.setProperty('--wallpaper-invert', effectiveSchema == 'dark' && size ? '1' : '0');
    document.documentElement.style.setProperty('--wallpaper-brightness', effectiveSchema == 'dark' && !size ? '0.5' : '1');
  }
  handleSelectWallpapers() {
    this.handleError();
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].setUrlSidePanel(window.location.hash, 'wallpapers'));
  }
  applyWallpaperSettings(wallpaper, size, blur, effectiveSchema) {
    document.documentElement.style.setProperty('--wallpaper-url', `url('${wallpaper}')`);
    document.documentElement.style.setProperty('--wallpaper-repeat', size ? 'repeat' : 'no-repeat');
    document.documentElement.style.setProperty('--wallpaper-blur', size ? '0px' : `${blur}px`);
    document.documentElement.style.setProperty('--wallpaper-size', size ? `${size}px` : 'cover');
    document.documentElement.style.setProperty('--wallpaper-position', size ? 'unset' : 'center');
    document.documentElement.style.setProperty('--wallpaper-invert', effectiveSchema == 'dark' && size ? '1' : '0');
    document.documentElement.style.setProperty('--wallpaper-brightness', effectiveSchema == 'dark' && !size ? '0.5' : '1');
  }
  handleWallpaperSelected(wallpaper, size, blur) {
    this.handleError();
    _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_15__["default"].updateObject('settings', {
      wallpaper: wallpaper,
      wallpaperSize: size,
      wallpaperBlur: blur
    });
    this.setState({
      wallpaper: wallpaper,
      wallpaperSize: size,
      wallpaperBlur: blur
    });
    this.applyWallpaperSettings(wallpaper, size, blur, this.state.colorSchema == 'auto' ? this.state.systemColorSchema : this.state.colorSchema);
  }
  handleChangeTextSize(size) {
    this.setState({
      textSize: size | 0
    });
    _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_15__["default"].updateObject('settings', {
      textSize: size
    });
    document.documentElement.style.setProperty('--message-text-size', `${size}pt`);
  }
  handleSendOnEnter(option) {
    this.setState({
      sendOnEnter: option
    });
    _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_15__["default"].updateObject('settings', {
      sendOnEnter: option
    });
  }
  handleUpdateAccountTagsRequest(_, tags) {
    this.tinode.getMeTopic().setMeta({
      tags: tags
    }).catch(err => this.handleError(err.message, 'err'));
  }
  handleSettings() {
    this.handleError();
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].setUrlSidePanel(window.location.hash, this.state.myUserId ? 'edit' : 'settings'));
  }
  handleGlobalSettings(settings) {
    const serverAddress = settings.serverAddress || this.state.serverAddress;
    const transport = settings.transport || this.state.transport;
    const secureConnection = settings.secureConnection === undefined ? this.state.secureConnection : settings.secureConnection;
    if (this.tinode) {
      this.tinode.clearStorage();
      this.tinode.onDisconnect = undefined;
      this.tinode.disconnect();
    }
    this.tinode = TinodeWeb.tnSetup(serverAddress, secureConnection, transport, this.props.intl.locale, _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_15__["default"].getObject('keep-logged-in'));
    this.tinode.onConnect = this.handleConnected;
    this.tinode.onDisconnect = this.handleDisconnect;
    this.tinode.onAutoreconnectIteration = this.handleAutoreconnectIteration;
    this.tinode.onInfoMessage = this.handleInfoMessage;
    this.tinode.onDataMessage = this.handleDataMessage;
    this.setState({
      serverAddress: serverAddress,
      transport: transport,
      secureConnection: secureConnection
    });
    _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_15__["default"].setObject('settings', {
      serverAddress: serverAddress,
      transport: transport,
      secureConnection: secureConnection
    });
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].setUrlSidePanel(window.location.hash, ''));
  }
  handleShowArchive() {
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].setUrlSidePanel(window.location.hash, this.state.myUserId ? 'archive' : ''));
  }
  handleShowBlocked() {
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].setUrlSidePanel(window.location.hash, this.state.myUserId ? 'blocked' : ''));
  }
  toggleFCMToken(enabled) {
    if (enabled) {
      this.setState({
        desktopAlerts: null
      });
      if (!this.state.firebaseToken) {
        this.initFCMessaging();
      } else {
        this.setState({
          desktopAlerts: true
        });
        if (_lib_local_storage_js__WEBPACK_IMPORTED_MODULE_15__["default"].getObject('keep-logged-in')) {
          _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_15__["default"].updateObject('settings', {
            desktopAlerts: true
          });
        }
      }
    } else if (this.state.firebaseToken && this.fcm) {
      (0,firebase_messaging__WEBPACK_IMPORTED_MODULE_3__.deleteToken)(this.fcm).catch(err => {
        console.error("Unable to delete token.", err);
      }).finally(_ => {
        _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_15__["default"].updateObject('settings', {
          desktopAlerts: false
        });
        localStorage.removeItem('firebase-token');
        this.setState({
          desktopAlerts: false,
          firebaseToken: null
        });
        this.tinode.setDeviceToken(null);
      });
    } else {
      this.setState({
        desktopAlerts: false,
        firebaseToken: null
      });
      _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_15__["default"].updateObject('settings', {
        desktopAlerts: false
      });
    }
  }
  handleToggleMessageSounds(enabled) {
    this.setState({
      messageSounds: enabled
    });
    _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_15__["default"].updateObject('settings', {
      messageSoundsOff: !enabled
    });
  }
  handleCredAdd(method, value) {
    const me = this.tinode.getMeTopic();
    me.setMeta({
      cred: {
        meth: method,
        val: value
      }
    }).catch(err => this.handleError(err.message, 'err'));
  }
  handleCredDelete(method, value) {
    const me = this.tinode.getMeTopic();
    me.delCredential(method, value).catch(err => this.handleError(err.message, 'err'));
  }
  handleCredConfirm(method, response) {
    TinodeWeb.navigateToCredentialsView({
      cred: [method],
      code: response
    });
  }
  handleSidepanelCancel() {
    const parsed = _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].parseUrlHash(window.location.hash);
    let path = '';
    if (['security', 'support', 'general', 'notif', 'acc_general'].includes(parsed.path[0])) {
      path = 'edit';
    } else if ('crop' == parsed.path[0]) {
      path = 'general';
    } else if ('blocked' == parsed.path[0]) {
      path = 'security';
    } else if ('wallpapers' == parsed.path[0]) {
      path = 'acc_general';
    } else if (this.state.myUserId) {
      path = 'contacts';
    }
    parsed.path[0] = path;
    if (parsed.params) {
      delete parsed.params.code;
      delete parsed.params.method;
      delete parsed.params.tab;
      delete parsed.params.scheme;
      delete parsed.params.token;
    }
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].composeUrlHash(parsed.path, parsed.params));
    this.setState({
      errorText: '',
      errorLevel: null
    });
  }
  basicNavigator(hash) {
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].setUrlSidePanel(window.location.hash, hash));
  }
  infoNavigator(hash) {
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].setUrlInfoPanel(window.location.hash, hash));
  }
  handleStartTopicRequest(topicName, newTopicParams, isChannel) {
    if (topicName && this.tinode.isTopicCached(topicName)) {
      this.handleTopicSelected(topicName);
      return;
    }
    const params = {};
    if (tinode_sdk__WEBPACK_IMPORTED_MODULE_4__.Tinode.isP2PTopicName(topicName)) {
      params.sub = {
        mode: _config_js__WEBPACK_IMPORTED_MODULE_10__.DEFAULT_P2P_ACCESS_MODE
      };
      params.desc = {
        defacs: {
          auth: _config_js__WEBPACK_IMPORTED_MODULE_10__.DEFAULT_P2P_ACCESS_MODE
        }
      };
    } else {
      topicName = topicName || this.tinode.newGroupTopicName(isChannel);
      if (newTopicParams) {
        params.desc = {
          public: newTopicParams.public,
          private: {
            comment: newTopicParams.private
          }
        };
        params.tags = newTopicParams.tags;
      }
    }
    params._topicName = topicName;
    this.setState({
      newTopicParams: params
    }, _ => {
      this.handleTopicSelected(topicName);
    });
  }
  handleNewTopicCreated(oldName, newName) {
    let nextState = {};
    if (this.state.callShouldStart) {
      nextState = {
        callState: _constants_js__WEBPACK_IMPORTED_MODULE_11__.CALL_STATE_IN_PROGRESS,
        callShouldStart: false
      };
    }
    if (this.state.topicSelected == oldName && oldName != newName) {
      nextState.topicSelected = newName;
    }
    this.setState(nextState, _ => {
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].setUrlTopic('', newName));
    });
  }
  handleTopicUpdateRequest(topicName, pub, priv, defacs) {
    this.handleError();
    const topic = this.tinode.getTopic(topicName);
    if (topic) {
      const params = {};
      let attachments;
      if (pub) {
        if (pub.photo) {
          if (pub.photo.ref && pub.photo.ref != tinode_sdk__WEBPACK_IMPORTED_MODULE_4__.Tinode.DEL_CHAR) {
            attachments = [pub.photo.ref];
          } else if (!pub.photo.data || pub.photo.data == tinode_sdk__WEBPACK_IMPORTED_MODULE_4__.Tinode.DEL_CHAR) {
            pub.photo = tinode_sdk__WEBPACK_IMPORTED_MODULE_4__.Tinode.DEL_CHAR;
          }
        }
        params.public = pub;
      }
      if (typeof priv == 'string') {
        params.private = priv === tinode_sdk__WEBPACK_IMPORTED_MODULE_4__.Tinode.DEL_CHAR ? tinode_sdk__WEBPACK_IMPORTED_MODULE_4__.Tinode.DEL_CHAR : {
          comment: priv
        };
      }
      if (defacs) {
        params.defacs = defacs;
      }
      topic.setMeta({
        desc: params,
        attachments: attachments
      }).catch(err => this.handleError(err.message, 'err'));
    }
  }
  handleUnarchive(topicName) {
    const topic = this.tinode.getTopic(topicName);
    if (topic) {
      topic.archive(false).catch(err => this.handleError(err.message, 'err'));
    }
  }
  handleUpdatePasswordRequest(password) {
    this.handleError();
    if (password) {
      this.tinode.updateAccountBasic(null, this.tinode.getCurrentLogin(), password).catch(err => this.handleError(err.message, 'err'));
    }
  }
  handleChangePermissions(topicName, mode, uid) {
    const topic = this.tinode.getTopic(topicName);
    if (topic) {
      const am = topic.getAccessMode();
      if (uid) {
        am.updateGiven(mode);
        mode = am.getGiven();
      } else {
        am.updateWant(mode);
        mode = am.getWant();
      }
      topic.setMeta({
        sub: {
          user: uid,
          mode: mode
        }
      }).catch(err => this.handleError(err.message, 'err'));
    }
  }
  handleTagsUpdateRequest(topicName, tags) {
    const topic = this.tinode.getTopic(topicName);
    if (topic) {
      topic.setMeta({
        tags: tags
      }).catch(err => this.handleError(err.message, 'err'));
    }
  }
  handleLogout() {
    (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_18__.updateFavicon)(0);
    localStorage.removeItem('auth-token');
    localStorage.removeItem('firebase-token');
    localStorage.removeItem('settings');
    if (this.state.firebaseToken && this.fcm) {
      (0,firebase_messaging__WEBPACK_IMPORTED_MODULE_3__.deleteToken)(this.fcm).catch(err => {
        console.warn('Failed to delete FCM token on logout', err);
      });
    }
    document.documentElement.style.colorScheme = _config_js__WEBPACK_IMPORTED_MODULE_10__.DEFAULT_COLOR_SCHEME == 'auto' ? 'light dark' : _config_js__WEBPACK_IMPORTED_MODULE_10__.DEFAULT_COLOR_SCHEME;
    document.documentElement.style.setProperty('--message-text-size', `${_config_js__WEBPACK_IMPORTED_MODULE_10__.DEFAULT_TEXT_SIZE}pt`);
    clearInterval(this.reconnectCountdown);
    let cleared;
    if (this.tinode) {
      cleared = this.tinode.clearStorage();
      this.tinode.onDisconnect = undefined;
      this.tinode.disconnect();
    } else {
      cleared = Promose.resolve();
    }
    this.setState(this.getBlankState());
    cleared.then(_ => {
      this.tinode = TinodeWeb.tnSetup(this.state.serverAddress, (0,_lib_host_name_js__WEBPACK_IMPORTED_MODULE_14__.isSecureConnection)(), this.state.transport, this.props.intl.locale, _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_15__["default"].getObject('keep-logged-in'), _ => {
        this.tinode.onConnect = this.handleConnected;
        this.tinode.onDisconnect = this.handleDisconnect;
        this.tinode.onAutoreconnectIteration = this.handleAutoreconnectIteration;
        this.tinode.onInfoMessage = this.handleInfoMessage;
        this.tinode.onDataMessage = this.handleDataMessage;
        _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].navigateTo('');
      });
    });
  }
  handleDeleteAccount() {
    this.tinode.delCurrentUser(true).then(_ => {
      this.handleLogout();
    });
  }
  handleDeleteTopicRequest(topicName) {
    const topic = this.tinode.getTopic(topicName);
    if (!topic) {
      return;
    }
    topic.delTopic(true).then(_ => {
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].setUrlTopic(window.location.hash, ''));
    }).catch(err => {
      this.handleError(err.message, 'err');
    });
  }
  handleDeleteMessagesRequest(topicName) {
    const topic = this.tinode.getTopic(topicName);
    if (!topic) {
      return;
    }
    topic.delMessagesAll(true).catch(err => this.handleError(err.message, 'err'));
  }
  handleLeaveUnsubRequest(topicName) {
    const topic = this.tinode.getTopic(topicName);
    if (!topic) {
      return;
    }
    topic.leave(true).then(_ => {
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].setUrlTopic(window.location.hash, ''));
    }).catch(err => {
      this.handleError(err.message, 'err');
    });
  }
  handleBlockTopicRequest(topicName) {
    const topic = this.tinode.getTopic(topicName);
    if (!topic) {
      return;
    }
    topic.updateMode(null, '-JP').then(_ => {
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].setUrlTopic(window.location.hash, ''));
    }).catch(err => this.handleError(err.message, 'err'));
  }
  handleReportTopic(topicName) {
    const topic = this.tinode.getTopic(topicName);
    if (!topic) {
      return;
    }
    this.tinode.report('report', topicName);
    topic.updateMode(null, '-JP').then(_ => {
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].setUrlTopic(window.location.hash, ''));
    }).catch(err => this.handleError(err.message, 'err'));
  }
  handleShowContextMenu(params, menuItems) {
    this.setState({
      contextMenuVisible: true,
      contextMenuClickAt: {
        x: params.x,
        y: params.y
      },
      contextMenuParams: params,
      contextMenuItems: menuItems || this.defaultTopicContextMenu(params.topicName),
      contextMenuBounds: this.selfRef.current.getBoundingClientRect()
    });
  }
  handleShowForwardDialog(params) {
    if (this.state.sidePanelSelected == 'newtpk') {
      this.handleSidepanelCancel();
    }
    const header = params.userName ? '➦ ' + params.userName : '';
    const content = typeof params.content == 'string' ? tinode_sdk__WEBPACK_IMPORTED_MODULE_4__.Drafty.init(params.content) : tinode_sdk__WEBPACK_IMPORTED_MODULE_4__.Drafty.forwardedContent(params.content);
    const preview = tinode_sdk__WEBPACK_IMPORTED_MODULE_4__.Drafty.preview(content, _config_js__WEBPACK_IMPORTED_MODULE_10__.FORWARDED_PREVIEW_LENGTH, true);
    const msg = tinode_sdk__WEBPACK_IMPORTED_MODULE_4__.Drafty.append(tinode_sdk__WEBPACK_IMPORTED_MODULE_4__.Drafty.appendLineBreak(tinode_sdk__WEBPACK_IMPORTED_MODULE_4__.Drafty.mention(header, params.userFrom)), content);
    const msgPreview = tinode_sdk__WEBPACK_IMPORTED_MODULE_4__.Drafty.quote(header, params.userFrom, preview);
    const head = {
      forwarded: params.topicName + ':' + params.seq
    };
    this.setState({
      forwardDialogVisible: true,
      forwardMessage: {
        head: head,
        msg: msg,
        preview: msgPreview
      }
    });
  }
  handleShareTheCard(card) {
    this.setState({
      forwardDialogVisible: true,
      forwardMessage: {
        content: card,
        type: card.contentType
      }
    });
  }
  defaultTopicContextMenu(topicName) {
    const topic = this.tinode.getTopic(topicName);
    if (topic._deleted) {
      return ['topic_delete'];
    }
    const me = this.tinode.getMeTopic();
    let muted = false,
      blocked = false,
      self_blocked = false,
      subscribed = false,
      deleter = false,
      archived = false,
      pinned = false,
      webrtc = false,
      writer = false,
      p2p = false,
      self = false;
    if (topic) {
      subscribed = topic.isSubscribed();
      archived = topic.isArchived();
      pinned = me.pinnedTopicRank(topicName) > 0;
      const acs = topic.getAccessMode();
      if (acs) {
        muted = acs.isMuted();
        blocked = !acs.isJoiner();
        self_blocked = !acs.isJoiner('want');
        deleter = acs.isDeleter();
        writer = acs.isWriter();
      }
    }
    webrtc = writer && !!this.tinode.getServerParam('iceServers');
    p2p = tinode_sdk__WEBPACK_IMPORTED_MODULE_4__.Tinode.isP2PTopicName(topicName);
    self = tinode_sdk__WEBPACK_IMPORTED_MODULE_4__.Tinode.isSelfTopicName(topicName);
    return [subscribed ? {
      title: this.props.intl.formatMessage(messages.menu_item_info),
      handler: this.handleShowInfoView
    } : null, subscribed && p2p && webrtc ? {
      title: this.props.intl.formatMessage(messages.menu_item_audio_call),
      handler: this.handleStartAudioCall
    } : null, subscribed && p2p && webrtc ? {
      title: this.props.intl.formatMessage(messages.menu_item_video_call),
      handler: this.handleStartVideoCall
    } : null, subscribed ? 'messages_clear' : null, subscribed && deleter && !self ? 'messages_clear_hard' : null, self ? null : muted ? blocked ? null : 'topic_unmute' : 'topic_mute', self ? null : self_blocked ? 'topic_unblock' : 'topic_block', pinned ? 'topic_unpin' : 'topic_pin', archived ? 'topic_restore' : 'topic_archive', 'topic_delete'];
  }
  handleHideContextMenu() {
    this.setState({
      contextMenuVisible: false,
      contextMenuClickAt: null,
      contextMenuParams: null,
      contextMenuBounds: null
    });
  }
  handleHideForwardDialog(keepForwardedMessage) {
    this.setState({
      forwardDialogVisible: false,
      forwardMessage: keepForwardedMessage ? this.state.forwardMessage : null
    });
  }
  handleContextMenuAction(action, promise, params) {
    if (action == 'topic_archive') {
      if (promise && params.topicName && params.topicName == this.state.topicSelected) {
        promise.then(_ => {
          this.handleTopicSelected(null);
        });
      }
    } else if (action == 'menu_item_forward') {
      this.handleShowForwardDialog(params);
    }
  }
  handleShowAlert(title, content, onConfirm, confirmText, onReject, rejectText) {
    this.setState({
      alertVisible: true,
      alertParams: {
        title: title,
        content: content,
        onConfirm: onConfirm,
        confirm: confirmText,
        onReject: onReject,
        reject: rejectText
      }
    });
  }
  handleShowInfoView() {
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].addUrlParam(window.location.hash, 'info', 'info'));
    this.setState({
      infoPanel: 'info'
    });
  }
  handleMemberUpdateRequest(topicName, added, removed) {
    if (!topicName) {
      return;
    }
    const topic = this.tinode.getTopic(topicName);
    if (!topic) {
      return;
    }
    if (added && added.length > 0) {
      added.forEach(uid => {
        topic.invite(uid, null).catch(err => this.handleError(err.message, 'err'));
      });
    }
    if (removed && removed.length > 0) {
      removed.forEach(uid => {
        topic.delSubscription(uid).catch(err => this.handleError(err.message, 'err'));
      });
    }
  }
  handleValidateCredentialsRequest(cred, code, token) {
    if (this.tinode.isAuthenticated()) {
      this.tinode.getMeTopic().setMeta({
        cred: {
          meth: cred,
          resp: code
        }
      }).then(_ => _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].setUrlSidePanel(window.location.hash, 'contacts'))).catch(err => this.handleError(err.message, 'err'));
    } else {
      this.setState({
        credMethod: cred,
        credCode: code,
        credToken: token
      });
      this.doLogin(null, null, token, {
        meth: cred,
        resp: code
      });
    }
  }
  handlePasswordResetRequest(method, value) {
    return this.tinode.connect().then(_ => this.tinode.requestResetAuthSecret('basic', method, value)).catch(err => {
      this.handleError(err.message, 'err');
    });
  }
  handleResetPassword(newPassword, tempAuth) {
    const secret = (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_13__.base64ReEncode)(tempAuth.secret);
    if (!secret || !tempAuth.scheme) {
      this.handleError(this.props.intl.formatMessage(messages.invalid_security_token), 'err');
    } else {
      this.tinode.connect().then(_ => this.tinode.updateAccountBasic(null, null, newPassword, {
        scheme: tempAuth.scheme,
        secret: secret
      })).then(_ => {
        this.handleError(this.props.intl.formatMessage(messages.password_reset_success), 'info');
        _lib_navigation_js__WEBPACK_IMPORTED_MODULE_16__["default"].navigateTo('');
      }).catch(err => {
        this.handleError(err.message, 'err');
      });
    }
  }
  handleShowCountrySelector(code, dial, selectedCallback) {
    this.handleShowAlert(this.props.intl.formatMessage(messages.select_country), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_19__.jsxDEV)(react__WEBPACK_IMPORTED_MODULE_0__.Suspense, {
      fallback: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_19__.jsxDEV)("div", {
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_19__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
          id: "loading_note",
          defaultMessage: "Loading...",
          description: "Message shown when component is loading"
        }, void 0, false)
      }, void 0, false),
      children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_19__.jsxDEV)(PhoneCountrySelector, {
        selected: code,
        onSubmit: (c, d) => {
          this.setState({
            alertVisible: false
          });
          selectedCallback(c, d);
        }
      }, void 0, false)
    }, void 0, false), null, null, _ => {}, null);
  }
  handleStartVideoCall() {
    this.setState({
      callTopic: this.state.topicSelected,
      callState: _constants_js__WEBPACK_IMPORTED_MODULE_11__.CALL_STATE_OUTGOING_INITATED,
      callAudioOnly: false
    });
  }
  handleStartAudioCall() {
    this.setState({
      callTopic: this.state.topicSelected,
      callState: _constants_js__WEBPACK_IMPORTED_MODULE_11__.CALL_STATE_OUTGOING_INITATED,
      callAudioOnly: true
    });
  }
  handleCallInvite(callTopic, callSeq, callState, audioOnly) {
    switch (callState) {
      case _constants_js__WEBPACK_IMPORTED_MODULE_11__.CALL_STATE_OUTGOING_INITATED:
        const head = {
          webrtc: _constants_js__WEBPACK_IMPORTED_MODULE_11__.CALL_HEAD_STARTED,
          aonly: !!audioOnly
        };
        return this.handleSendMessage(tinode_sdk__WEBPACK_IMPORTED_MODULE_4__.Drafty.videoCall(audioOnly), undefined, undefined, head).then(ctrl => {
          if (ctrl.code < 200 || ctrl.code >= 300 || !ctrl.params || !ctrl.params.seq) {
            this.handleCallClose();
            return ctrl;
          }
          this.setState({
            callSeq: ctrl.params['seq']
          });
          return ctrl;
        });
      case _constants_js__WEBPACK_IMPORTED_MODULE_11__.CALL_STATE_IN_PROGRESS:
        const topic = this.tinode.getTopic(callTopic);
        if (!topic) {
          return;
        }
        topic.videoCall('accept', callSeq);
        break;
    }
  }
  handleCallRinging(callTopic, callSeq) {
    const topic = this.tinode.getTopic(callTopic);
    if (!topic) {
      return;
    }
    topic.videoCall('ringing', callSeq);
  }
  handleCallHangup(callTopic, callSeq) {
    const topic = this.tinode.getTopic(callTopic);
    if (!topic) {
      return;
    }
    topic.videoCall('hang-up', callSeq);
  }
  handleCallSendOffer(callTopic, callSeq, sdp) {
    const topic = this.tinode.getTopic(callTopic);
    if (!topic) {
      return;
    }
    topic.videoCall('offer', callSeq, sdp);
  }
  handleCallIceCandidate(callTopic, callSeq, candidate) {
    const topic = this.tinode.getTopic(callTopic);
    if (!topic) {
      return;
    }
    topic.videoCall('ice-candidate', callSeq, candidate);
  }
  handleCallSendAnswer(callTopic, callSeq, sdp) {
    const topic = this.tinode.getTopic(callTopic);
    if (!topic) {
      return;
    }
    topic.videoCall('answer', callSeq, sdp);
  }
  handleCallClose() {
    if (this.callTimeoutTimer) {
      clearTimeout(this.callTimeoutTimer);
    }
    this.setState({
      callTopic: undefined,
      callState: _constants_js__WEBPACK_IMPORTED_MODULE_11__.CALL_STATE_NONE,
      callAudioOnly: undefined
    });
  }
  handleCallAccept(topicName, setCallTopic, callSeq) {
    const topic = this.tinode.getTopic(topicName);
    if (!topic) {
      return;
    }
    if (topic.isSubscribed()) {
      this.handleTopicSelected(setCallTopic ? topicName : this.state.callTopic);
      const upd = {
        callState: _constants_js__WEBPACK_IMPORTED_MODULE_11__.CALL_STATE_IN_PROGRESS
      };
      if (setCallTopic) {
        upd.callTopic = topicName;
        upd.callSeq = callSeq;
      }
      this.setState(upd);
    } else {
      this.setState({
        callShouldStart: true
      }, _ => this.handleTopicSelected(this.state.callTopic));
    }
  }
  handleInfoMessage(info) {
    if (info.what != 'call') {
      return;
    }
    switch (info.event) {
      case 'accept':
        if (tinode_sdk__WEBPACK_IMPORTED_MODULE_4__.Tinode.isMeTopicName(info.topic) && this.tinode.isMe(info.from)) {
          this.setState({
            callTopic: null,
            callState: _constants_js__WEBPACK_IMPORTED_MODULE_11__.CALL_STATE_NONE,
            callSeq: null,
            callAudioOnly: undefined
          });
          return;
        }
        if (info.topic == this.state.callTopic) {
          this.setState({
            callState: _constants_js__WEBPACK_IMPORTED_MODULE_11__.CALL_STATE_IN_PROGRESS
          });
        }
        break;
      case 'hang-up':
        this.handleCallClose();
        break;
    }
  }
  handleDataMessage(data) {
    if (data.head && data.head.webrtc && data.head.webrtc == _constants_js__WEBPACK_IMPORTED_MODULE_11__.CALL_HEAD_STARTED && tinode_sdk__WEBPACK_IMPORTED_MODULE_4__.Tinode.isP2PTopicName(data.topic)) {
      const topic = this.tinode.getTopic(data.topic);
      if (topic) {
        const msg = topic.latestMsgVersion(data.seq) || data;
        if (msg.head && msg.head.webrtc && msg.head.webrtc == _constants_js__WEBPACK_IMPORTED_MODULE_11__.CALL_HEAD_STARTED) {
          if (data.from != this.state.myUserId) {
            if (this.state.callState == _constants_js__WEBPACK_IMPORTED_MODULE_11__.CALL_STATE_NONE) {
              this.setState({
                callTopic: data.topic,
                callState: _constants_js__WEBPACK_IMPORTED_MODULE_11__.CALL_STATE_INCOMING_RECEIVED,
                callSeq: data.seq,
                callAudioOnly: !!msg.head.aonly
              });
            } else {
              this.handleCallHangup(data.topic, data.seq);
            }
          }
        }
      } else {
        console.warn("Received vc data message from unknown topic", data.topic);
      }
    }
  }
  render() {
    const colorSchema = this.state.colorSchema !== 'auto' ? this.state.colorSchema : this.state.systemColorSchema;
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_19__.jsxDEV)("div", {
      id: "app-container",
      ref: this.selfRef,
      children: [this.state.contextMenuVisible ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_19__.jsxDEV)(_widgets_context_menu_jsx__WEBPACK_IMPORTED_MODULE_6__["default"], {
        tinode: this.tinode,
        bounds: this.state.contextMenuBounds,
        clickAt: this.state.contextMenuClickAt,
        params: this.state.contextMenuParams,
        items: this.state.contextMenuItems,
        hide: this.handleHideContextMenu,
        onShowAlert: this.handleShowAlert,
        onAction: this.handleContextMenuAction,
        onTopicRemoved: topicName => {
          if (topicName == this.state.topicSelected) {
            this.handleTopicSelected(null);
          }
        },
        onError: this.handleError
      }, void 0, false) : null, this.state.forwardDialogVisible ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_19__.jsxDEV)(_widgets_forward_dialog_jsx__WEBPACK_IMPORTED_MODULE_7__["default"], {
        tinode: this.tinode,
        contacts: this.state.chatList,
        topicSelected: this.state.topicSelected,
        myUserId: this.state.myUserId,
        hide: this.handleHideForwardDialog,
        onInitFind: this.tnInitFind,
        searchResults: this.state.searchResults,
        onSearchContacts: this.handleSearchContacts,
        onTopicSelected: this.handleStartTopicRequest
      }, void 0, false) : null, this.state.callTopic && this.state.callState == _constants_js__WEBPACK_IMPORTED_MODULE_11__.CALL_STATE_INCOMING_RECEIVED ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_19__.jsxDEV)(_widgets_call_incoming_jsx__WEBPACK_IMPORTED_MODULE_8__["default"], {
        tinode: this.tinode,
        topic: this.state.callTopic,
        seq: this.state.callSeq,
        callState: this.state.callState,
        audioOnly: this.state.callAudioOnly,
        onClose: this.handleCallClose,
        onRinging: this.handleCallRinging,
        onAcceptCall: this.handleCallAccept,
        onReject: this.handleCallHangup
      }, void 0, false) : null, this.state.alertVisible ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_19__.jsxDEV)(_widgets_alert_jsx__WEBPACK_IMPORTED_MODULE_5__["default"], {
        title: this.state.alertParams.title,
        content: this.state.alertParams.content,
        onReject: this.state.alertParams.onReject ? _ => this.setState({
          alertVisible: false
        }) : null,
        reject: this.state.alertParams.reject,
        onConfirm: this.state.alertParams.onConfirm ? _ => {
          this.setState({
            alertVisible: false
          });
          this.state.alertParams.onConfirm();
        } : null,
        confirm: this.state.alertParams.confirm
      }, void 0, false) : null, !this.state.displayMobile || this.state.mobilePanel == 'sidepanel' ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_19__.jsxDEV)(_sidepanel_view_jsx__WEBPACK_IMPORTED_MODULE_9__["default"], {
        tinode: this.tinode,
        connected: this.state.connected,
        displayMobile: this.state.displayMobile,
        state: this.state.sidePanelSelected,
        title: this.state.sidePanelTitle,
        avatar: this.state.sidePanelAvatar,
        trustedBadges: this.state.myTrustedBadges,
        login: this.state.login,
        persist: this.state.persist,
        myUserId: this.state.myUserId,
        loginDisabled: this.state.loginDisabled,
        loadSpinnerVisible: this.state.loadSpinnerVisible,
        errorText: this.state.errorText,
        errorLevel: this.state.errorLevel,
        errorAction: this.state.errorAction,
        errorActionText: this.state.errorActionText,
        topicSelected: this.state.topicSelected,
        chatList: this.state.chatList,
        credMethod: this.state.credMethod,
        credCode: this.state.credCode,
        credToken: this.state.credToken,
        transport: this.state.transport,
        messageSounds: this.state.messageSounds,
        desktopAlerts: this.state.desktopAlerts,
        desktopAlertsEnabled: this.state.desktopAlertsEnabled,
        incognitoMode: this.state.incognitoMode,
        serverAddress: this.state.serverAddress,
        secureConnection: this.state.secureConnection,
        serverVersion: this.state.serverVersion,
        reqCredMethod: this.state.reqCredMethod,
        textSize: this.state.textSize,
        colorSchema: this.state.colorSchema,
        wallpaper: this.state.wallpaper,
        wallpaperSize: this.state.wallpaperSize,
        wallpaperBlur: this.state.wallpaperBlur,
        systemColorSchema: this.state.systemColorSchema,
        sendOnEnter: this.state.sendOnEnter,
        onGlobalSettings: this.handleGlobalSettings,
        onSignUp: this.handleNewAccount,
        onSettings: this.handleSettings,
        onNavigate: this.basicNavigator,
        onLoginRequest: this.handleLoginRequest,
        onPersistenceChange: this.handlePersistenceChange,
        onCreateAccount: this.handleNewAccountRequest,
        onUpdateAccountDesc: this.handleTopicUpdateRequest,
        onUpdatePassword: this.handleUpdatePasswordRequest,
        onUpdateAccountTags: this.handleUpdateAccountTagsRequest,
        onTogglePushNotifications: this.toggleFCMToken,
        onToggleMessageSounds: this.handleToggleMessageSounds,
        onToggleIncognitoMode: this.handleToggleIncognitoMode,
        onChangeColorSchema: this.handleChangeColorSchema,
        onTextSizeChanged: this.handleChangeTextSize,
        onSendOnEnterChanged: this.handleSendOnEnter,
        onSelectWallpapers: this.handleSelectWallpapers,
        onWallpaperSelected: this.handleWallpaperSelected,
        onCredAdd: this.handleCredAdd,
        onCredDelete: this.handleCredDelete,
        onCredConfirm: this.handleCredConfirm,
        onTopicSelected: this.handleTopicSelected,
        onCreateTopic: this.handleStartTopicRequest,
        onLogout: this.handleLogout,
        onDeleteAccount: this.handleDeleteAccount,
        onShowAlert: this.handleShowAlert,
        onCancel: this.handleSidepanelCancel,
        onError: this.handleError,
        onValidateCredentials: this.handleValidateCredentialsRequest,
        onPasswordResetRequest: this.handlePasswordResetRequest,
        onResetPassword: this.handleResetPassword,
        onShowArchive: this.handleShowArchive,
        onShowBlocked: this.handleShowBlocked,
        onShowCountrySelector: this.handleShowCountrySelector,
        onInitFind: this.tnInitFind,
        searchResults: this.state.searchResults,
        onSearchContacts: this.handleSearchContacts,
        showContextMenu: this.handleShowContextMenu
      }, void 0, false) : null, !this.state.displayMobile || this.state.mobilePanel == 'topic-view' && !this.state.infoPanel ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_19__.jsxDEV)(react__WEBPACK_IMPORTED_MODULE_0__.Suspense, {
        fallback: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_19__.jsxDEV)("div", {
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_19__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "loading_note",
            defaultMessage: "Loading...",
            description: "Message shown when component is loading"
          }, void 0, false)
        }, void 0, false),
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_19__.jsxDEV)(MessagesView, {
          tinode: this.tinode,
          connected: this.state.connected,
          ready: this.state.ready,
          online: this.state.topicSelectedOnline,
          acs: this.state.topicSelectedAcs,
          displayMobile: this.state.displayMobile,
          viewportWidth: this.state.viewportWidth,
          viewportHeight: this.state.viewportHeight,
          topic: this.state.topicSelected,
          myUserId: this.state.myUserId,
          myUserName: this.state.sidePanelTitle,
          serverVersion: this.state.serverVersion,
          serverAddress: this.state.serverAddress,
          applicationVisible: this.state.applicationVisible,
          colorSchema: colorSchema,
          sendOnEnter: this.state.sendOnEnter,
          wallpaper: this.state.wallpaper,
          forwardMessage: this.state.forwardMessage,
          onCancelForwardMessage: this.handleHideForwardDialog,
          callTopic: this.state.callTopic,
          callSeq: this.state.callSeq,
          callState: this.state.callState,
          callAudioOnly: this.state.callAudioOnly,
          onCallHangup: this.handleCallHangup,
          onAcceptCall: this.handleCallAccept,
          onCallInvite: this.handleCallInvite,
          onCallSendOffer: this.handleCallSendOffer,
          onCallIceCandidate: this.handleCallIceCandidate,
          onCallSendAnswer: this.handleCallSendAnswer,
          errorText: this.state.errorText,
          errorLevel: this.state.errorLevel,
          errorAction: this.state.errorAction,
          errorActionText: this.state.errorActionText,
          newTopicParams: this.state.newTopicParams,
          onHideMessagesView: this.handleHideMessagesView,
          onError: this.handleError,
          onNewTopicCreated: this.handleNewTopicCreated,
          showContextMenu: this.handleShowContextMenu,
          onChangePermissions: this.handleChangePermissions,
          onNewChat: this.handleNewChatInvitation,
          sendMessage: this.handleSendMessage,
          onVideoCallClosed: this.handleCallClose
        }, void 0, false)
      }, void 0, false) : null, this.state.infoPanel ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_19__.jsxDEV)(react__WEBPACK_IMPORTED_MODULE_0__.Suspense, {
        fallback: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_19__.jsxDEV)("div", {
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_19__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "loading_note",
            defaultMessage: "Loading...",
            description: "Message shown when component is loading"
          }, void 0, false)
        }, void 0, false),
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_19__.jsxDEV)(InfoView, {
          tinode: this.tinode,
          connected: this.state.connected,
          displayMobile: this.state.displayMobile,
          topic: this.state.topicSelected,
          searchableContacts: this.state.searchableContacts,
          myUserId: this.state.myUserId,
          panel: this.state.infoPanel,
          errorText: this.state.errorText,
          errorLevel: this.state.errorLevel,
          errorAction: this.state.errorAction,
          errorActionText: this.state.errorActionText,
          onNavigate: this.infoNavigator,
          onTopicDescUpdateRequest: this.handleTopicUpdateRequest,
          onShowAlert: this.handleShowAlert,
          onChangePermissions: this.handleChangePermissions,
          onMemberUpdateRequest: this.handleMemberUpdateRequest,
          onDeleteTopic: this.handleDeleteTopicRequest,
          onDeleteMessages: this.handleDeleteMessagesRequest,
          onLeaveTopic: this.handleLeaveUnsubRequest,
          onBlockTopic: this.handleBlockTopicRequest,
          onReportTopic: this.handleReportTopic,
          onShareTheCard: this.handleShareTheCard,
          onTopicTagsUpdateRequest: this.handleTagsUpdateRequest,
          onTopicUnArchive: this.handleUnarchive,
          onInitFind: this.tnInitFind,
          onError: this.handleError,
          showContextMenu: this.handleShowContextMenu
        }, void 0, false)
      }, void 0, false) : null]
    }, void 0, true);
  }
}
;
/* harmony default export */ __webpack_exports__["default"] = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(TinodeWeb));

/***/ }),

/***/ "./src/views/topic-common-view.jsx":
/*!*****************************************!*\
  !*** ./src/views/topic-common-view.jsx ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ TopicCommonView; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _widgets_topic_desc_edit_jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../widgets/topic-desc-edit.jsx */ "./src/widgets/topic-desc-edit.jsx");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");




class TopicCommonView extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    const topic = this.props.tinode.getTopic(this.props.topic);
    const acs = topic.getAccessMode();
    this.state = {
      tags: []
    };
    this.previousTagsUpdated = undefined;
    this.onTagsUpdated = this.onTagsUpdated.bind(this);
    this.handleTagsUpdated = this.handleTagsUpdated.bind(this);
  }
  componentDidUpdate(props) {
    const topic = this.props.tinode.getTopic(props.topic);
    if (!topic) {
      return;
    }
    if (topic.onTagsUpdated != this.onTagsUpdated) {
      if (topic.getType() == 'grp') {
        this.previousTagsUpdated = topic.onTagsUpdated;
        topic.onTagsUpdated = this.onTagsUpdated;
      } else {
        this.previousTagsUpdated = undefined;
      }
    }
    if (this.state.topic != props.topic) {
      this.setState({
        topic: props.topic
      });
    }
  }
  componentWillUnmount() {
    const topic = this.props.tinode.getTopic(this.props.topic);
    topic.onTagsUpdated = this.previousTagsUpdated;
  }
  onTagsUpdated(tags) {
    this.setState({
      tags: tags
    });
    if (this.previousTagsUpdated && this.previousTagsUpdated != this.onTagsUpdated) {
      this.previousTagsUpdated(tags);
    }
  }
  handleTagsUpdated(tags) {
    if (!(0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_2__.arrayEqual)(this.state.tags.slice(0), tags.slice(0))) {
      this.props.onUpdateTagsRequest(this.props.topic, tags);
    }
  }
  render() {
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)("div", {
      className: "scrollable-panel",
      children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)(_widgets_topic_desc_edit_jsx__WEBPACK_IMPORTED_MODULE_1__["default"], {
        tinode: this.props.tinode,
        topic: this.props.topic,
        onUpdateTopicDesc: this.props.onUpdateTopicDesc,
        onUpdateTags: this.handleTagsUpdated,
        onError: this.props.onError
      }, void 0, false)
    }, void 0, false);
  }
}
;

/***/ }),

/***/ "./src/views/validation-view.jsx":
/*!***************************************!*\
  !*** ./src/views/validation-view.jsx ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");



const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  phone: {
    id: 'phone_dative',
    defaultMessage: 'phone',
    description: "Dative case of 'phone', i.e. 'phone' in 'by phone'"
  },
  email: {
    id: 'email_dative',
    defaultMessage: 'email',
    description: "Dative case of 'email', i.e. 'email' in 'by email'"
  }
});
class ValidationView extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.state = {
      code: props.credCode || '',
      codeReceived: props.credCode
    };
    this.handleCodeChange = this.handleCodeChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.credCode != prevState.codeReceived) {
      return {
        code: nextProps.credCode || '',
        codeReceived: nextProps.credCode
      };
    }
    return prevState;
  }
  componentDidMount() {
    if (this.props.credCode) {
      this.props.onSubmit(this.props.credMethod, this.props.credCode, this.props.credToken);
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.codeReceived && this.state.code && this.state.code != prevState.code) {
      this.props.onSubmit(this.props.credMethod, this.state.code, this.props.credToken);
    }
  }
  handleCodeChange(e) {
    this.setState({
      code: e.target.value.replace(/[^\d]/g, '')
    });
  }
  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.handleSubmit(e);
    } else if (e.key == 'Escape') {
      this.handleCancel(e);
    }
  }
  handleSubmit(e) {
    e.preventDefault();
    if (this.state.code && this.state.code.trim()) {
      this.props.onSubmit(this.props.credMethod, this.state.code.trim(), this.props.credToken);
    }
  }
  handleCancel(e) {
    e.preventDefault();
    this.props.onCancel();
  }
  render() {
    const {
      formatMessage
    } = this.props.intl;
    const methods = {
      'email': formatMessage(messages.email),
      'tel': formatMessage(messages.phone)
    };
    const method = methods[this.props.credMethod] || this.props.credMethod;
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
      className: "panel-form",
      children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
        className: "panel-form-row",
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("label", {
          className: "small gray",
          htmlFor: "enter-confirmation-code",
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "enter_confirmation_code_prompt",
            defaultMessage: "Confirmation code",
            description: "Request to enter confirmation code",
            values: {
              method: method
            }
          }, void 0, false)
        }, void 0, false)
      }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
        className: "panel-form-row",
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
          id: "numeric_confirmation_code_prompt",
          defaultMessage: "Numbers only",
          description: "Prompt for numeric conformation code",
          children: numbers_only => (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("input", {
            type: "text",
            id: "enter-confirmation-code",
            placeholder: numbers_only,
            value: this.state.code,
            onChange: this.handleCodeChange,
            onKeyDown: this.handleKeyPress,
            required: true
          }, void 0, false)
        }, void 0, false)
      }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
        className: "dialog-buttons",
        children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("button", {
          className: "secondary",
          onClick: this.handleCancel,
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "button_cancel",
            defaultMessage: "Cancel",
            description: "Button [Cancel]"
          }, void 0, false)
        }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("button", {
          className: "primary",
          onClick: this.handleSubmit,
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "button_confirm",
            defaultMessage: "Confirm",
            description: "Button [Confirm]"
          }, void 0, false)
        }, void 0, false)]
      }, void 0, true)]
    }, void 0, true);
  }
}
;
/* harmony default export */ __webpack_exports__["default"] = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(ValidationView));

/***/ }),

/***/ "./src/widgets/alert.jsx":
/*!*******************************!*\
  !*** ./src/widgets/alert.jsx ***!
  \*******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Alert; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");



class Alert extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
      className: "alert-container",
      children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
        className: "alert",
        children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
          className: "title",
          children: this.props.title
        }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
          className: "content",
          children: this.props.content
        }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
          className: "dialog-buttons",
          children: [this.props.onReject ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("button", {
            className: "outline",
            onClick: this.props.onReject,
            children: this.props.reject || (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
              id: "button_cancel",
              defaultMessage: "Cancel",
              description: "Button [Cancel]"
            }, void 0, false)
          }, void 0, false) : null, this.props.onConfirm ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("button", {
            className: "primary",
            onClick: this.props.onConfirm,
            children: this.props.confirm || (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
              id: "button_ok",
              defaultMessage: "OK",
              description: "Button [OK]"
            }, void 0, false)
          }, void 0, false) : null]
        }, void 0, true)]
      }, void 0, true)
    }, void 0, false);
  }
}
;

/***/ }),

/***/ "./src/widgets/audio-player.jsx":
/*!**************************************!*\
  !*** ./src/widgets/audio-player.jsx ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _lib_strformat__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/strformat */ "./src/lib/strformat.js");
/* harmony import */ var _lib_blob_helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/blob-helpers */ "./src/lib/blob-helpers.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");





const CANVAS_UPSCALING = 2.0;
const LINE_WIDTH = 3 * CANVAS_UPSCALING;
const SPACING = 2 * CANVAS_UPSCALING;
const BAR_COLOR = '#888A';
const BAR_COLOR_DARK = '#666C';
const THUMB_COLOR = '#1781d7';
const MIN_PREVIEW_LENGTH = 16;
const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  icon_title_play: {
    id: 'icon_title_play',
    defaultMessage: 'Play recording',
    description: 'Icon tool tip for starting audio playback'
  }
});
class AudioPlayer extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    let preview = (0,_lib_blob_helpers__WEBPACK_IMPORTED_MODULE_3__.base64ToIntArray)(this.props.preview);
    if (!Array.isArray(preview) || preview.length < MIN_PREVIEW_LENGTH) {
      preview = null;
    }
    this.state = {
      canPlay: false,
      playing: false,
      currentTime: '0:00',
      duration: this.props.duration > 0 ? (0,_lib_strformat__WEBPACK_IMPORTED_MODULE_2__.secondsToTime)(this.props.duration / 1000) : '-:--',
      longMin: this.props.duration >= 600000,
      preview: preview
    };
    this.initAudio = this.initAudio.bind(this);
    this.initCanvas = this.initCanvas.bind(this);
    this.resampleBars = this.resampleBars.bind(this);
    this.visualize = this.visualize.bind(this);
    this.handlePlay = this.handlePlay.bind(this);
    this.handleSeek = this.handleSeek.bind(this);
    this.handleError = this.handleError.bind(this);
    this.audioPlayer = null;
    this.viewBuffer = [];
    this.canvasRef = react__WEBPACK_IMPORTED_MODULE_0___default().createRef();
  }
  componentDidMount() {
    if (this.props.src) {
      this.initAudio();
    }
    this.initCanvas();
  }
  componentWillUnmount() {
    if (this.audioPlayer) {
      this.audioPlayer.onloadedmetadata = null;
      this.audioPlayer.ontimeupdate = null;
      this.audioPlayer.onended = null;
      this.audioPlayer.pause();
      this.audioPlayer = null;
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.src != prevProps.src) {
      this.initAudio();
    }
    if (this.props.preview != prevProps.preview) {
      let preview = (0,_lib_blob_helpers__WEBPACK_IMPORTED_MODULE_3__.base64ToIntArray)(this.props.preview);
      if (!Array.isArray(preview) || preview.length < MIN_PREVIEW_LENGTH) {
        preview = null;
      }
      this.setState({
        preview: preview
      }, this.initCanvas);
    }
  }
  initAudio() {
    this.audioPlayer = new Audio(this.props.src);
    this.audioPlayer.onloadedmetadata = _ => this.setState({
      canPlay: true
    });
    this.audioPlayer.ontimeupdate = _ => this.setState({
      currentTime: (0,_lib_strformat__WEBPACK_IMPORTED_MODULE_2__.secondsToTime)(this.audioPlayer.currentTime, this.state.longMin)
    });
    this.audioPlayer.onended = _ => {
      this.audioPlayer.currentTime = 0;
      this.setState({
        playing: false,
        currentTime: (0,_lib_strformat__WEBPACK_IMPORTED_MODULE_2__.secondsToTime)(0, this.state.longMin)
      });
    };
  }
  initCanvas() {
    this.canvasRef.current.width = this.canvasRef.current.offsetWidth * CANVAS_UPSCALING;
    this.canvasRef.current.height = this.canvasRef.current.offsetHeight * CANVAS_UPSCALING;
    this.canvasContext = this.canvasRef.current.getContext('2d');
    this.canvasContext.lineCap = 'round';
    this.viewBuffer = this.resampleBars(this.state.preview);
    this.visualize();
  }
  visualize() {
    if (!this.canvasRef.current) {
      return;
    }
    const width = this.effectiveWidth;
    const height = this.canvasRef.current.height;
    this.canvasContext.lineWidth = LINE_WIDTH;
    const drawFrame = _ => {
      if (!this.canvasRef.current || !this.audioPlayer) {
        return;
      }
      this.canvasContext.clearRect(0, 0, this.canvasRef.current.width, height);
      if (this.viewBuffer) {
        if (this.state.playing) {
          window.requestAnimationFrame(drawFrame);
        }
        const thumbAt = this.props.duration ? Math.max(0, Math.min(this.audioPlayer.currentTime * 1000 / this.props.duration, 1)) * (width - LINE_WIDTH * 2) : -1;
        this.canvasContext.beginPath();
        this.canvasContext.strokeStyle = BAR_COLOR_DARK;
        for (let i = 0; i < this.viewBuffer.length; i++) {
          let x = 1 + i * (LINE_WIDTH + SPACING) + LINE_WIDTH * 0.5;
          let y = Math.max(this.viewBuffer[i] * height * 0.9, 1);
          const color = x < thumbAt ? BAR_COLOR_DARK : BAR_COLOR;
          if (this.canvasContext.strokeStyle != color) {
            this.canvasContext.stroke();
            this.canvasContext.beginPath();
            this.canvasContext.strokeStyle = color;
          }
          this.canvasContext.moveTo(x, (height - y) * 0.5);
          this.canvasContext.lineTo(x, (height + y) * 0.5);
        }
        this.canvasContext.stroke();
        if (this.props.duration) {
          this.canvasContext.beginPath();
          this.canvasContext.arc(thumbAt + LINE_WIDTH * 2, height * 0.5, LINE_WIDTH * 2, 0, 2 * Math.PI);
          this.canvasContext.fillStyle = THUMB_COLOR;
          this.canvasContext.fill();
        }
      }
    };
    drawFrame();
  }
  resampleBars(original) {
    const dstCount = (this.canvasRef.current.width - SPACING) / (LINE_WIDTH + SPACING) | 0;
    this.effectiveWidth = dstCount * (LINE_WIDTH + SPACING) + SPACING;
    if (!Array.isArray(original) || original.length == 0) {
      return Array.apply(null, Array(dstCount)).map(_ => 0.01);
    }
    const factor = original.length / dstCount;
    let amps = [];
    let maxAmp = -1;
    for (let i = 0; i < dstCount; i++) {
      let lo = i * factor | 0;
      let hi = (i + 1) * factor | 0;
      if (hi == lo) {
        amps[i] = original[lo];
      } else {
        let amp = 0.0;
        for (let j = lo; j < hi; j++) {
          amp += original[j];
        }
        amps[i] = Math.max(0, amp / (hi - lo));
      }
      maxAmp = Math.max(amps[i], maxAmp);
    }
    if (maxAmp > 0) {
      return amps.map(a => a / maxAmp);
    }
    return Array.apply(null, Array(dstCount)).map(_ => 0.01);
  }
  handlePlay(e) {
    e.preventDefault();
    if (!this.state.canPlay) {
      return;
    }
    if (this.state.playing) {
      this.audioPlayer.pause();
      this.setState({
        playing: false
      });
    } else if (this.audioPlayer.readyState >= 2) {
      this.audioPlayer.play();
      this.setState({
        playing: true
      }, this.visualize);
    }
  }
  handleError(err) {
    console.error(err);
  }
  handleSeek(e) {
    e.preventDefault();
    if (e.target && this.props.duration) {
      const rect = e.target.getBoundingClientRect();
      const offset = (e.clientX - rect.left) / this.effectiveWidth * CANVAS_UPSCALING;
      this.audioPlayer.currentTime = this.props.duration * offset / 1000;
      this.setState({
        currentTime: (0,_lib_strformat__WEBPACK_IMPORTED_MODULE_2__.secondsToTime)(this.audioPlayer.currentTime, this.state.longMin)
      });
      if (!this.state.playing) {
        this.visualize();
      }
    }
  }
  render() {
    const playClass = 'material-icons' + (this.props.short ? '' : ' large') + (this.state.canPlay ? '' : ' disabled');
    const play = (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("a", {
      href: "#",
      onClick: this.handlePlay,
      title: this.props.intl.formatMessage(messages.icon_title_play),
      children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("i", {
        className: playClass,
        children: this.state.playing ? 'pause_circle' : this.state.canPlay ? 'play_circle' : 'not_interested'
      }, void 0, false)
    }, void 0, false);
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
      className: "audio-player",
      children: this.props.short ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
        children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("canvas", {
          className: "playback",
          ref: this.canvasRef,
          onClick: this.handleSeek
        }, void 0, false), play]
      }, void 0, true) : (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
        children: [play, (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("canvas", {
            className: "playback",
            ref: this.canvasRef,
            onClick: this.handleSeek
          }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
            className: "timer",
            children: [this.state.currentTime, "/", this.state.duration]
          }, void 0, true)]
        }, void 0, true)]
      }, void 0, true)
    }, void 0, false);
  }
}
/* harmony default export */ __webpack_exports__["default"] = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(AudioPlayer));

/***/ }),

/***/ "./src/widgets/avatar-crop.jsx":
/*!*************************************!*\
  !*** ./src/widgets/avatar-crop.jsx ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ AvatarCrop; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _cropper_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./cropper.jsx */ "./src/widgets/cropper.jsx");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");





class AvatarCrop extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.state = {
      top: 0,
      left: 0,
      width: 0,
      height: 0,
      scale: 1
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(left, top, width, height, scale) {
    this.setState({
      left: left,
      top: top,
      width: width,
      height: height,
      scale: scale
    });
  }
  handleSubmit() {
    (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_3__.imageCrop)(this.props.mime, this.props.avatar, this.state.left, this.state.top, this.state.width, this.state.height, this.state.scale).then(img => {
      this.props.onSubmit(img.mime, img.blob, img.width, img.height);
    }).catch(err => {
      this.props.onError(err);
    });
  }
  render() {
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
      className: "panel-form",
      children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
        className: "panel-form-row",
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(_cropper_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
          source: this.props.avatar,
          onChange: this.handleChange
        }, void 0, false)
      }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
        className: "dialog-buttons",
        children: [this.props.onCancel ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("button", {
          className: "secondary",
          onClick: this.props.onCancel,
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "button_cancel",
            defaultMessage: "Cancel",
            description: "Button [Cancel]"
          }, void 0, false)
        }, void 0, false) : null, (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("button", {
          className: "primary",
          onClick: this.handleSubmit,
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "button_ok",
            defaultMessage: "OK",
            description: "Button [OK]"
          }, void 0, false)
        }, void 0, false)]
      }, void 0, true)]
    }, void 0, true);
  }
}
;

/***/ }),

/***/ "./src/widgets/avatar-upload.jsx":
/*!***************************************!*\
  !*** ./src/widgets/avatar-upload.jsx ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ AvatarUpload; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _letter_tile_jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./letter-tile.jsx */ "./src/widgets/letter-tile.jsx");
/* harmony import */ var _load_spinner_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./load-spinner.jsx */ "./src/widgets/load-spinner.jsx");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");






class AvatarUpload extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    this.state = {
      source: props.avatar
    };
    this.handleFileReceived = this.handleFileReceived.bind(this);
  }
  componentDidUpdate(prevProps) {
    if (this.props.avatar != prevProps.avatar) {
      this.setState({
        source: this.props.avatar
      });
    }
  }
  handleFileReceived(e) {
    const image = e.target.files[0];
    this.props.onImageUpdated(image.type, URL.createObjectURL(image), image.name);
    e.target.value = '';
  }
  render() {
    const randId = 'file-input-avatar-' + ('' + Math.random()).substring(0, 4);
    const className = 'avatar-upload' + (this.props.readOnly ? ' read-only' : '');
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("div", {
      className: className,
      children: [this.props.readOnly || !this.state.source ? null : (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("a", {
        href: "#",
        className: "clear-avatar",
        onClick: e => {
          e.preventDefault();
          this.props.onImageUpdated();
        },
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("i", {
          className: "material-icons",
          children: "clear"
        }, void 0, false)
      }, void 0, false), this.state.source ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("img", {
        src: this.props.tinode.authorizeURL((0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_3__.sanitizeUrlForMime)(this.state.source, 'image')),
        className: "preview"
      }, void 0, false) : this.props.readOnly && this.props.uid ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("div", {
        className: "avatar-box",
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)(_letter_tile_jsx__WEBPACK_IMPORTED_MODULE_1__["default"], {
          authorizeURL: this.props.tinode.authorizeURL,
          avatar: true,
          topic: this.props.uid,
          title: this.props.title
        }, void 0, false)
      }, void 0, false) : (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("div", {
        className: "blank",
        children: [_config_js__WEBPACK_IMPORTED_MODULE_4__.AVATAR_SIZE, "×", _config_js__WEBPACK_IMPORTED_MODULE_4__.AVATAR_SIZE]
      }, void 0, true), this.props.readOnly ? null : (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("input", {
        type: "file",
        id: randId,
        className: "inputfile hidden",
        accept: "image/*",
        onChange: this.handleFileReceived
      }, void 0, false), this.props.readOnly ? null : (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("label", {
        htmlFor: randId,
        className: "round",
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("i", {
          className: "material-icons",
          children: "file_upload"
        }, void 0, false)
      }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)(_load_spinner_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
        show: this.props.uploading,
        large: true,
        clear: true,
        centered: true
      }, void 0, false)]
    }, void 0, true);
  }
}
;

/***/ }),

/***/ "./src/widgets/badge-list.jsx":
/*!************************************!*\
  !*** ./src/widgets/badge-list.jsx ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");



const icon_mapping = {
  'staff': 'verified_user'
};
const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  badge_verified: {
    id: 'badge_verified',
    defaultMessage: 'Verified/official',
    description: 'Explanation of a verified account or topic badge'
  },
  badge_staff: {
    id: 'badge_staff',
    defaultMessage: 'Staff-managed',
    description: 'Explanation of a staff-managed account or topic badge'
  },
  badge_danger: {
    id: 'badge_danger',
    defaultMessage: 'Untrustworthy',
    description: 'Suspicious or untrustworthy account or topic badge'
  }
});
class BadgeList extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    const {
      formatMessage
    } = this.props.intl;
    let badges = null;
    if (this.props.trustedBadges && this.props.trustedBadges.length > 0) {
      badges = [];
      this.props.trustedBadges.forEach(b => {
        const comment = this.props.short ? null : formatMessage(messages['badge_' + b]);
        const style = 'material-icons ' + b + '-color';
        badges.push((0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
          className: "trusted-badge",
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("i", {
            className: style,
            children: icon_mapping[b] || b
          }, void 0, false), " ", comment]
        }, b, true));
      });
      return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment, {
        children: badges
      }, void 0, false);
    }
    return null;
  }
}
;
/* harmony default export */ __webpack_exports__["default"] = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(BadgeList));

/***/ }),

/***/ "./src/widgets/button-back.jsx":
/*!*************************************!*\
  !*** ./src/widgets/button-back.jsx ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ ButtonBack; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");


class ButtonBack extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxDEV)("a", {
      href: "#",
      onClick: e => {
        e.preventDefault();
        this.props.onBack();
      },
      children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxDEV)("i", {
        className: "material-icons",
        children: "arrow_back"
      }, void 0, false)
    }, void 0, false);
  }
}

/***/ }),

/***/ "./src/widgets/call-incoming.jsx":
/*!***************************************!*\
  !*** ./src/widgets/call-incoming.jsx ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ CallIncoming; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _badge_list_jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./badge-list.jsx */ "./src/widgets/badge-list.jsx");
/* harmony import */ var _letter_tile_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./letter-tile.jsx */ "./src/widgets/letter-tile.jsx");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../constants.js */ "./src/constants.js");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");








const RING_SOUND = new Audio('audio/call-in.m4a');
class CallIncoming extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    this.state = {
      topic: null,
      fullName: undefined,
      avatar: null,
      trustedBadges: [],
      previousMetaDesc: undefined
    };
    this.resetDesc = this.resetDesc.bind(this);
    this.onMetaDesc = this.onMetaDesc.bind(this);
    this.handleRejectCall = this.handleRejectCall.bind(this);
    this.handleAcceptCall = this.handleAcceptCall.bind(this);
    this.ringTimer = null;
  }
  componentDidMount() {
    const topic = this.props.tinode.getTopic(this.props.topic);
    if (!topic) {
      return;
    }
    this.resetDesc(topic);
    if (this.props.callState == _constants_js__WEBPACK_IMPORTED_MODULE_4__.CALL_STATE_INCOMING_RECEIVED) {
      RING_SOUND.play().catch(_ => {});
      this.ringTimer = setInterval(_ => {
        RING_SOUND.play().catch(_ => {});
      }, 2000);
      this.props.onRinging(this.props.topic, this.props.seq);
    }
  }
  componentDidUpdate(props) {
    const topic = this.props.tinode.getTopic(props.topic);
    if (!topic) {
      return;
    }
    if (this.onMetaDesc != topic.onMetaDesc) {
      this.previousMetaDesc = topic.onMetaDesc;
      topic.onMetaDesc = this.onMetaDesc;
    }
    if (this.state.topic != props.topic) {
      this.setState({
        topic: props.topic
      });
      this.resetDesc(topic, props);
    }
  }
  componentWillUnmount() {
    if (this.ringTimer != null) {
      clearInterval(this.ringTimer);
      RING_SOUND.pause();
    }
    const topic = this.props.tinode.getTopic(this.props.topic);
    if (!topic) {
      return;
    }
    this.setState({
      topic: null
    });
    topic.onMetaDesc = this.previousMetaDesc;
  }
  resetDesc(topic) {
    const badges = [];
    if (topic.trusted) {
      for (const [key, val] of Object.entries(topic.trusted)) {
        if (val) {
          badges.push(key);
        }
      }
    }
    this.setState({
      fullName: (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_6__.truncateString)(topic.public ? topic.public.fn : undefined, _config_js__WEBPACK_IMPORTED_MODULE_3__.MAX_TITLE_LENGTH),
      avatar: (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_5__.makeImageUrl)(topic.public ? topic.public.photo : null),
      trustedBadges: badges
    });
  }
  onMetaDesc(desc) {
    const topic = this.props.tinode.getTopic(this.props.topic);
    if (!topic) {
      return;
    }
    this.resetDesc(topic);
    if (this.previousMetaDesc && this.previousMetaDesc != this.onMetaDesc) {
      this.previousMetaDesc(desc);
    }
  }
  handleAcceptCall() {
    this.props.onAcceptCall(this.props.topic);
  }
  handleRejectCall() {
    this.props.onReject(this.props.topic, this.props.seq);
    this.props.onClose();
  }
  render() {
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxDEV)("div", {
      className: "alert-container",
      children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxDEV)("div", {
        className: "incoming-call",
        children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxDEV)("div", {
          className: "caller-card incoming pulse",
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxDEV)("div", {
            className: "avatar-box",
            children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxDEV)(_letter_tile_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
              authorizeURL: this.props.tinode.authorizeURL,
              avatar: this.state.avatar || true,
              topic: this.props.topic,
              title: this.state.fullName
            }, void 0, false)
          }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxDEV)("div", {
            className: "caller-name",
            children: [(0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_6__.truncateString)(this.state.fullName, _config_js__WEBPACK_IMPORTED_MODULE_3__.MAX_PEER_TITLE_LENGTH), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxDEV)(_badge_list_jsx__WEBPACK_IMPORTED_MODULE_1__["default"], {
              short: true,
              trustedBadges: this.state.trustedBadges
            }, void 0, false)]
          }, void 0, true)]
        }, void 0, true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxDEV)("div", {
          id: "controls",
          children: this.props.callState == _constants_js__WEBPACK_IMPORTED_MODULE_4__.CALL_STATE_INCOMING_RECEIVED ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
            children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxDEV)("button", {
              className: "danger",
              onClick: this.handleRejectCall,
              children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxDEV)("i", {
                className: "material-icons",
                children: "call_end"
              }, void 0, false)
            }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxDEV)("button", {
              className: "positive",
              onClick: this.handleAcceptCall,
              children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxDEV)("i", {
                className: "material-icons",
                children: "call"
              }, void 0, false)
            }, void 0, false)]
          }, void 0, true) : null
        }, void 0, false)]
      }, void 0, true)
    }, void 0, false);
  }
}
;

/***/ }),

/***/ "./src/widgets/call-message.jsx":
/*!**************************************!*\
  !*** ./src/widgets/call-message.jsx ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ CallMessage; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");




class CallMessage extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    const isCallDropped = ['busy', 'declined', 'disconnected', 'missed'].includes(this.props.callState);
    const successClass = 'material-icons medium ' + (isCallDropped ? 'red' : 'green');
    const callIcon = this.props.incoming ? isCallDropped ? 'call_missed' : 'call_received' : isCallDropped ? 'call_missed_outgoing' : 'call_made';
    const title = this.props.incoming ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "calls_incoming",
      defaultMessage: "Incoming call",
      description: "Incoming call label"
    }, void 0, false) : (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "calls_outgoing",
      defaultMessage: "Outgoing call",
      description: "Outgoing call label"
    }, void 0, false);
    let duration;
    if (isCallDropped) {
      switch (this.props.callState) {
        case 'busy':
          duration = (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "call_busy",
            defaultMessage: "busy",
            description: "Label for busy call line"
          }, void 0, false);
          break;
        case 'declined':
          duration = (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "call_declined",
            defaultMessage: "declined",
            description: "Label for declined call"
          }, void 0, false);
          break;
        case 'missed':
          duration = this.props.incoming ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "call_missed",
            defaultMessage: "missed",
            description: "Label for missed incoming call"
          }, void 0, false) : (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "call_cancelled",
            defaultMessage: "cancelled",
            description: "Label for cancelled outgoing call"
          }, void 0, false);
          break;
        default:
          duration = (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "call_disconnected",
            defaultMessage: "disconnected",
            description: "Label for disconnected call"
          }, void 0, false);
          break;
      }
    } else {
      duration = (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)("span", {
        children: (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_2__.secondsToTime)(this.props.duration / 1000)
      }, void 0, false);
    }
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)("div", {
      className: "call-message",
      children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)("div", {
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)("i", {
          className: "material-icons big gray",
          children: "call"
        }, void 0, false)
      }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)("div", {
        className: "flex-column narrow",
        children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)("div", {
          children: title
        }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)("div", {
          className: "duration",
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)("i", {
            className: successClass,
            children: callIcon
          }, void 0, false), " ", duration]
        }, void 0, true)]
      }, void 0, true)]
    }, void 0, true);
  }
}

/***/ }),

/***/ "./src/widgets/call-status.jsx":
/*!*************************************!*\
  !*** ./src/widgets/call-status.jsx ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ CallStatus; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");




class CallStatus extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    const isCallDropped = ['busy', 'declined', 'disconnected', 'missed'].includes(this.props.callState);
    const icon2 = this.props.incoming ? isCallDropped ? 'call_missed' : 'call_received' : isCallDropped ? 'call_missed_outgoing' : 'call_made';
    let duration;
    if (isCallDropped) {
      switch (this.props.callState) {
        case 'busy':
          duration = (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "call_busy",
            defaultMessage: "busy",
            description: "Label for busy call line"
          }, void 0, false);
          break;
        case 'declined':
          duration = (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "call_declined",
            defaultMessage: "declined",
            description: "Label for declined call"
          }, void 0, false);
          break;
        case 'missed':
          duration = this.props.incoming ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "call_missed",
            defaultMessage: "missed",
            description: "Label for missed incoming call"
          }, void 0, false) : (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "call_cancelled",
            defaultMessage: "cancelled",
            description: "Label for cancelled outgoing call"
          }, void 0, false);
          break;
        default:
          duration = (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "call_disconnected",
            defaultMessage: "disconnected",
            description: "Label for disconnected call"
          }, void 0, false);
          break;
      }
    } else if (['accepted', 'started'].includes(this.props.callState) && !this.props.duration) {
      duration = (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
        id: "call_in_progress",
        defaultMessage: "in progress",
        description: "Label for call in progress"
      }, void 0, false);
    } else {
      duration = (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)("span", {
        children: (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_2__.secondsToTime)(this.props.duration / 1000)
      }, void 0, false);
    }
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.Fragment, {
      children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)("div", {
        className: "composed-material",
        children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)("i", {
          className: "material-icons",
          children: "call"
        }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)("i", {
          className: "material-icons second",
          children: icon2
        }, void 0, false)]
      }, void 0, true), " ", duration]
    }, void 0, true);
  }
}
;

/***/ }),

/***/ "./src/widgets/checkbox.jsx":
/*!**********************************!*\
  !*** ./src/widgets/checkbox.jsx ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ CheckBox; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

class CheckBox extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange() {
    this.props.onChange(this.props.name, !this.props.checked);
  }
  render() {
    let classList = ['material-icons'];
    let iconName;
    if (Array.isArray(this.props.className)) {
      classList.push(...this.props.className);
    } else if (this.props.className) {
      classList.push(this.props.className);
    }
    if (this.props.onChange) {
      if (this.props.checked) {
        classList.push('blue', 'clickable');
        iconName = 'check_box';
      } else if (this.props.checked === false) {
        classList.push('blue', 'clickable');
        iconName = 'check_box_outline_blank';
      } else {
        classList.push('lt-blue');
        iconName = 'indeterminate_check_box';
      }
    } else {
      if (this.props.checked) {
        iconName = 'check_box';
      } else {
        iconName = 'check_box_outline_blank';
      }
    }
    let attrs = {
      className: classList.join(' '),
      id: this.props.id
    };
    if (this.props.onChange) {
      attrs.onClick = this.handleChange;
    }
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement('i', attrs, iconName);
  }
}

/***/ }),

/***/ "./src/widgets/chip-input.jsx":
/*!************************************!*\
  !*** ./src/widgets/chip-input.jsx ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ ChipInput; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _chip_jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./chip.jsx */ "./src/widgets/chip.jsx");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");




class ChipInput extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    this.state = ChipInput.deriveStateFromProps(props);
    this.state.input = '';
    this.state.focused = false;
    this.handleTextInput = this.handleTextInput.bind(this);
    this.removeChipAt = this.removeChipAt.bind(this);
    this.handleChipCancel = this.handleChipCancel.bind(this);
    this.handleFocusGained = this.handleFocusGained.bind(this);
    this.handleFocusLost = this.handleFocusLost.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }
  static deriveStateFromProps(props) {
    return {
      sortedChips: ChipInput.sortChips(props.chips, props.staticMembers),
      chipIndex: ChipInput.indexChips(props.chips)
    };
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.chips != this.props.chips || prevProps.staticMembers != this.props.staticMembers || prevProps.prompt != this.props.prompt) {
      this.setState(ChipInput.deriveStateFromProps(this.props));
    }
    if (!prevState || this.props.chips.length > prevState.sortedChips.length) {
      this.setState({
        input: ''
      });
    }
  }
  static indexChips(chips) {
    const index = {};
    let count = 0;
    chips.forEach(item => {
      index[item.user] = count;
      count++;
    });
    return index;
  }
  static sortChips(chips, keep) {
    const required = [];
    const normal = [];
    chips.forEach(item => {
      if (keep && keep.includes(item.user)) {
        required.push(item);
      } else {
        normal.push(item);
      }
    });
    return required.concat(normal);
  }
  handleTextInput(e) {
    this.setState({
      input: e.target.value
    });
    if (this.props.filterFunc) {
      this.props.filterFunc(e.target.value);
    }
  }
  removeChipAt(idx) {
    const removed = this.state.sortedChips[idx];
    this.props.onChipRemoved(removed.user, this.state.chipIndex[removed.user]);
  }
  handleChipCancel(item, idx) {
    this.removeChipAt(idx);
  }
  handleFocusGained() {
    this.setState({
      focused: true
    });
  }
  handleFocusLost() {
    this.setState({
      focused: false
    });
    if (this.props.onFocusLost) {
      this.props.onFocusLost(this.state.input);
    }
  }
  handleKeyDown(e) {
    if (e.key === 'Backspace') {
      if (this.state.input.length == 0 && this.state.sortedChips.length > 0) {
        const at = this.state.sortedChips.length - 1;
        if (this.state.sortedChips[at].user !== this.props.staticMembers) {
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
    const chips = [];
    let count = 0;
    const staticMembers = this.props.staticMembers || [];
    this.state.sortedChips.forEach(item => {
      chips.push((0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)(_chip_jsx__WEBPACK_IMPORTED_MODULE_1__["default"], {
        tinode: this.props.tinode,
        onCancel: this.handleChipCancel,
        avatar: (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_2__.makeImageUrl)(item.public ? item.public.photo : null),
        title: item.public ? item.public.fn : undefined,
        noAvatar: this.props.avatarDisabled,
        topic: item.user,
        required: staticMembers.includes(item.user),
        invalid: item.invalid,
        index: count
      }, item.user, false));
      count++;
    });
    const className = "chip-input" + (this.state.focused ? ' focused' : '');
    const autoFocus = !(this.props.tabIndex > 0);
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)("div", {
      className: className,
      children: [chips, (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)("input", {
        type: "text",
        placeholder: this.props.prompt,
        onChange: this.handleTextInput,
        onFocus: this.handleFocusGained,
        onBlur: this.handleFocusLost,
        onKeyDown: this.handleKeyDown,
        value: this.state.input,
        tabIndex: this.props.tabIndex,
        autoFocus: autoFocus
      }, void 0, false)]
    }, void 0, true);
  }
}
;

/***/ }),

/***/ "./src/widgets/chip.jsx":
/*!******************************!*\
  !*** ./src/widgets/chip.jsx ***!
  \******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Chip; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _letter_tile_jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./letter-tile.jsx */ "./src/widgets/letter-tile.jsx");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");



class Chip extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.handleCancel = this.handleCancel.bind(this);
  }
  handleCancel(e) {
    e.preventDefault();
    this.props.onCancel(this.props.topic, this.props.index);
  }
  render() {
    const title = this.props.title || this.props.topic;
    const className = this.props.invalid ? 'chip invalid' : 'chip';
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
      className: className,
      children: [this.props.noAvatar ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("span", {
        className: "spacer"
      }, void 0, false) : (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
        className: "avatar-box",
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)(_letter_tile_jsx__WEBPACK_IMPORTED_MODULE_1__["default"], {
          authorizeURL: this.props.tinode.authorizeURL,
          avatar: this.props.avatar || true,
          topic: this.props.topic,
          title: this.props.title
        }, void 0, false)
      }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("span", {
        children: title
      }, void 0, false), this.props.onCancel && !this.props.required ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("a", {
        href: "#",
        onClick: this.handleCancel,
        children: "×"
      }, void 0, false) : (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("span", {
        className: "spacer"
      }, void 0, false)]
    }, void 0, true);
  }
}
;

/***/ }),

/***/ "./src/widgets/contact-action.jsx":
/*!****************************************!*\
  !*** ./src/widgets/contact-action.jsx ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");



class ContactAction extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.onAction(this.props.action);
  }
  render() {
    const {
      formatMessage
    } = this.props.intl;
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("li", {
      onClick: this.handleClick,
      className: "action",
      children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
        className: "action-text",
        children: formatMessage(this.props.title, this.props.values)
      }, void 0, false)
    }, void 0, false);
  }
}
;
/* harmony default export */ __webpack_exports__["default"] = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(ContactAction));

/***/ }),

/***/ "./src/widgets/contact-badges.jsx":
/*!****************************************!*\
  !*** ./src/widgets/contact-badges.jsx ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ ContactBadges; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");


const icon_mapping = {
  'muted': 'notifications_off',
  'banned': 'block',
  'staff': 'verified_user'
};
class ContactBadges extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    let badges = null;
    if (this.props.badges && this.props.badges.length > 0) {
      badges = [];
      this.props.badges.forEach(b => {
        const color = b.color ? ' ' + b.color : '';
        if (b.icon) {
          badges.push((0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxDEV)("i", {
            className: 'material-icons as-badge' + color,
            children: icon_mapping[b.icon] || b.icon
          }, b.key || b.icon, false));
        } else {
          badges.push((0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxDEV)("span", {
            className: 'badge' + color,
            children: b.name
          }, b.key || b.name, false));
        }
      });
      return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment, {
        children: badges
      }, void 0, false);
    }
    return null;
  }
}
;

/***/ }),

/***/ "./src/widgets/contact-list.jsx":
/*!**************************************!*\
  !*** ./src/widgets/contact-list.jsx ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _contact_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./contact.jsx */ "./src/widgets/contact.jsx");
/* harmony import */ var _contact_action_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./contact-action.jsx */ "./src/widgets/contact-action.jsx");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");








const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  badge_you: {
    id: 'badge_you',
    defaultMessage: 'you',
    description: 'Badge for indicating the current user'
  },
  badge_owner: {
    id: 'badge_owner',
    defaultMessage: 'owner',
    description: 'Badge for indicating the owner'
  }
});
class ContactList extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    const {
      formatMessage
    } = this.props.intl;
    const showCheckmark = Array.isArray(this.props.topicSelected);
    const contactNodes = [];
    let contactsCount = 0;
    if (this.props.showSelfTopic) {
      const selected = showCheckmark ? this.props.topicSelected.indexOf('slf') > -1 : this.props.topicSelected === 'slf';
      contactNodes.push((0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxDEV)(_contact_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
        tinode: this.props.tinode,
        avatar: true,
        showMode: this.props.showMode,
        selected: selected,
        showCheckmark: showCheckmark,
        onSelected: this.props.onTopicSelected,
        showContextMenu: this.props.showContextMenu,
        index: contactNodes.length,
        item: "slf"
      }, 'slf', false));
      contactsCount++;
    }
    if (this.props.contacts && this.props.contacts.length > 0) {
      const usedKeys = {};
      this.props.contacts.forEach(c => {
        if (c.action) {
          contactNodes.push((0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxDEV)(_contact_action_jsx__WEBPACK_IMPORTED_MODULE_4__["default"], {
            title: c.title,
            action: c.action,
            values: c.values,
            onAction: this.props.onAction
          }, c.action, false));
        } else {
          const key = this.props.showMode ? c.user : c.topic || c.user;
          if (usedKeys[key]) {
            return;
          }
          usedKeys[key] = true;
          if (this.props.filterFunc && this.props.filter) {
            const filterOn = [key];
            if (c.private && c.private.comment) {
              filterOn.push(('' + c.private.comment).toLowerCase());
            }
            if (c.public && c.public.fn) {
              filterOn.push(('' + c.public.fn).toLowerCase());
            }
            if (!this.props.filterFunc(this.props.filter, filterOn)) {
              return;
            }
          }
          const isChannel = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.isChannelTopicName(key);
          const isGroup = !isChannel && tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.isGroupTopicName(key);
          const selected = showCheckmark ? this.props.topicSelected.indexOf(key) > -1 : this.props.topicSelected === key;
          const badges = [];
          if (this.props.showMode) {
            if (key == this.props.myUserId) {
              badges.push({
                name: formatMessage(messages.badge_you),
                color: 'green'
              });
            }
            if (c.acs && c.acs.isOwner()) {
              badges.push({
                name: formatMessage(messages.badge_owner),
                color: 'blue'
              });
            }
          }
          const comment = Array.isArray(c.private) ? c.private.join(',') : c.private ? c.private.comment : null;
          let preview;
          let forwarded;
          let previewIsResponse;
          let deliveryStatus;
          if (!this.props.showMode && c.latestMessage) {
            const msg = c.latestMessage();
            if (msg) {
              forwarded = msg.head ? msg.head.forwarded : null;
              deliveryStatus = msg._status || c.msgStatus(msg, true);
              previewIsResponse = msg.from != this.props.myUserId;
              if (msg.content) {
                preview = typeof msg.content == 'string' ? msg.content.substr(0, _config_js__WEBPACK_IMPORTED_MODULE_6__.MESSAGE_PREVIEW_LENGTH) : tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.preview(msg.content, _config_js__WEBPACK_IMPORTED_MODULE_6__.MESSAGE_PREVIEW_LENGTH);
              }
            }
          }
          contactNodes.push((0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxDEV)(_contact_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
            tinode: this.props.tinode,
            title: c.public ? c.public.fn : null,
            avatar: (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_5__.makeImageUrl)(c.public ? c.public.photo : null),
            comment: comment,
            preview: preview,
            previewIsResponse: previewIsResponse,
            forwarded: forwarded,
            received: deliveryStatus,
            unread: this.props.showUnread ? c.unread : 0,
            now: c.online && this.props.connected,
            acs: c.acs,
            showMode: this.props.showMode,
            badges: badges,
            showCheckmark: showCheckmark,
            selected: selected,
            pinned: c.pinned,
            showOnline: this.props.showOnline && !isChannel,
            isChannel: isChannel,
            isGroup: isGroup,
            showContextMenu: this.props.showContextMenu,
            isVerified: c.trusted && c.trusted.verified,
            isStaff: c.trusted && c.trusted.staff,
            isDangerous: c.trusted && c.trusted.danger,
            deleted: c._deleted,
            onSelected: this.props.onTopicSelected,
            item: key,
            index: contactNodes.length
          }, key, false));
          contactsCount++;
        }
      }, this);
    }
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxDEV)("div", {
      className: this.props.noScroll ? null : "scrollable-panel",
      children: [contactsCount == 0 ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxDEV)("div", {
        className: "center-medium-text",
        style: {
          whiteSpace: 'pre-line'
        },
        children: this.props.emptyListMessage
      }, void 0, false) : null, contactNodes.length > 0 ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxDEV)("ul", {
        className: "contact-box",
        children: contactNodes
      }, void 0, false) : null]
    }, void 0, true);
  }
}
;
/* harmony default export */ __webpack_exports__["default"] = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(ContactList));

/***/ }),

/***/ "./src/widgets/contact.jsx":
/*!*********************************!*\
  !*** ./src/widgets/contact.jsx ***!
  \*********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _contact_badges_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./contact-badges.jsx */ "./src/widgets/contact-badges.jsx");
/* harmony import */ var _letter_tile_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./letter-tile.jsx */ "./src/widgets/letter-tile.jsx");
/* harmony import */ var _unread_badge_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./unread-badge.jsx */ "./src/widgets/unread-badge.jsx");
/* harmony import */ var _lib_formatters_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../lib/formatters.js */ "./src/lib/formatters.js");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");











const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  self_topic_name: {
    id: 'self_topic_name',
    defaultMessage: 'Saved messages',
    description: 'Name of self topic for UI'
  },
  self_topic_comment: {
    id: 'self_topic_comment',
    defaultMessage: 'Notes, messages, links, files saved for posterity',
    description: 'Comment for self topic for UI'
  }
});
class Contact extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleContextClick = this.handleContextClick.bind(this);
  }
  handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (this.props.onSelected) {
      this.props.onSelected(this.props.item, this.props.index);
    }
  }
  handleContextClick(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.showContextMenu({
      topicName: this.props.item,
      topicTitle: this.props.title,
      y: e.pageY,
      x: e.pageX
    });
  }
  render() {
    let title = this.props.title;
    const self = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.isSelfTopicName(this.props.item);
    if (!title) {
      if (self) {
        title = this.props.intl.formatMessage(messages.self_topic_name);
      } else {
        title = (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("i", {
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "unnamed_topic",
            defaultMessage: "Unnamed",
            description: "Title shown when the topic has no name"
          }, void 0, false)
        }, void 0, false);
      }
    } else if (title.length > 30) {
      title = (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_8__.truncateString)(title, 30);
    }
    const online = this.props.now ? 'online' : 'offline';
    const avatar = this.props.avatar ? this.props.avatar : true;
    const badges = this.props.badges ? this.props.badges.slice() : [];
    const icon_badges = [];
    if (this.props.isVerified) {
      icon_badges.push({
        icon: 'verified',
        color: 'verified-color'
      });
    }
    if (this.props.isStaff) {
      icon_badges.push({
        icon: 'staff',
        color: 'staff-color'
      });
    }
    if (this.props.isDangerous) {
      icon_badges.push({
        icon: 'dangerous',
        color: 'danger-color'
      });
    }
    if (this.props.acs) {
      if (this.props.showMode) {
        badges.push({
          name: this.props.acs.getMode(),
          key: 'mode'
        });
      }
      if (this.props.acs.isMuted()) {
        icon_badges.push({
          icon: 'muted'
        });
      }
      if (!this.props.acs.isJoiner()) {
        icon_badges.push({
          icon: 'banned'
        });
      }
    }
    let preview;
    if (typeof this.props.preview == 'string') {
      preview = this.props.preview;
    } else if (tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.isValid(this.props.preview)) {
      preview = react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.format(this.props.preview, _lib_formatters_js__WEBPACK_IMPORTED_MODULE_6__.previewFormatter, {
        formatMessage: this.props.intl.formatMessage,
        previewIsResponse: this.props.previewIsResponse
      }));
    } else if (this.props.preview) {
      preview = (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.Fragment, {
        children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("i", {
          className: "material-icons gray",
          children: "warning_amber"
        }, void 0, false), " ", (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("i", {
          className: "gray",
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "invalid_content",
            defaultMessage: "invalid content",
            description: "Shown when the message is unreadable"
          }, void 0, false)
        }, void 0, false)]
      }, void 0, true);
    }
    const icon = (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_7__.deliveryMarker)(this.props.received);
    const marker = icon ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("i", {
      className: 'material-icons small space-right' + (icon.color ? ' ' + icon.color : ''),
      children: icon.name
    }, void 0, false) : null;
    const titleClass = 'contact-title' + (this.props.deleted ? ' deleted' : '');
    const comment = preview || this.props.comment || (self ? this.props.intl.formatMessage(messages.self_topic_comment) : '\u00A0');
    const bgColor = this.props.showCheckmark ? null : this.props.selected ? 'selected' : this.props.pinned ? 'tpinned' : null;
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("li", {
      className: bgColor,
      onClick: this.handleClick,
      children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
        className: "avatar-box",
        children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(_letter_tile_jsx__WEBPACK_IMPORTED_MODULE_4__["default"], {
          authorizeURL: this.props.tinode.authorizeURL,
          avatar: avatar,
          title: this.props.title,
          topic: this.props.item,
          deleted: this.props.deleted
        }, void 0, false), this.props.deleted ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("i", {
          className: "deleted material-icons",
          children: "cancel"
        }, void 0, false) : !self && this.props.showOnline ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("span", {
          className: online
        }, void 0, false) : this.props.showCheckmark && this.props.selected ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("i", {
          className: "checkmark material-icons",
          children: "check_circle"
        }, void 0, false) : null]
      }, void 0, true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
        className: "text-box",
        children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("span", {
            className: titleClass,
            children: title
          }, void 0, false), this.props.isGroup ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("i", {
            className: "material-icons as-badge",
            children: "group"
          }, void 0, false) : null, this.props.isChannel ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("i", {
            className: "material-icons as-badge",
            children: "podcasts"
          }, void 0, false) : null, !self ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(_contact_badges_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
            badges: icon_badges
          }, void 0, false) : null, !this.props.deleted ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(_unread_badge_jsx__WEBPACK_IMPORTED_MODULE_5__["default"], {
            count: this.props.unread
          }, void 0, false) : null]
        }, void 0, true), this.props.showMode ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("span", {
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(_contact_badges_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
            badges: badges
          }, void 0, false)
        }, void 0, false) : this.props.small ? null : (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
          className: "contact-comment",
          children: [marker, (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("span", {
            children: comment
          }, void 0, false)]
        }, void 0, true)]
      }, void 0, true), this.props.showContextMenu ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("span", {
        className: "menuTrigger",
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("a", {
          href: "#",
          onClick: this.handleContextClick,
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("i", {
            className: "material-icons",
            children: "expand_more"
          }, void 0, false)
        }, void 0, false)
      }, void 0, false) : null]
    }, void 0, true);
  }
}
;
/* harmony default export */ __webpack_exports__["default"] = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(Contact));

/***/ }),

/***/ "./src/widgets/context-menu.jsx":
/*!**************************************!*\
  !*** ./src/widgets/context-menu.jsx ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");




const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  info: {
    id: 'menu_item_info',
    defaultMessage: 'Info',
    description: 'Show extended topic information'
  },
  clear_messages: {
    id: 'menu_item_clear_messages',
    defaultMessage: 'Clear messages',
    description: 'Delete all messages'
  },
  clear_for_all: {
    id: 'menu_item_clear_messages_for_all',
    defaultMessage: 'Clear for All',
    description: 'Delete all message(s) for all members'
  },
  delete: {
    id: 'menu_item_delete',
    defaultMessage: 'Delete',
    description: 'Delete selected messages'
  },
  delete_for_all: {
    id: 'menu_item_delete_for_all',
    defaultMessage: 'Delete for All',
    description: 'Delete selected message(s) for all members'
  },
  send_retry: {
    id: 'menu_item_send_retry',
    defaultMessage: 'Retry',
    description: 'Retry sending message'
  },
  mute: {
    id: 'menu_item_mute',
    defaultMessage: 'Mute',
    description: 'Turn off notifications'
  },
  unmute: {
    id: 'menu_item_unmute',
    defaultMessage: 'Unmute',
    description: 'Turn notifications on'
  },
  reply: {
    id: 'menu_item_reply',
    defaultMessage: 'Reply',
    description: 'Reply to message'
  },
  forward: {
    id: 'menu_item_forward',
    defaultMessage: 'Forward',
    description: 'Forward message'
  },
  edit: {
    id: 'menu_item_edit',
    defaultMessage: 'Edit',
    description: 'Edit message'
  },
  topic_delete: {
    id: 'menu_item_delete_topic',
    defaultMessage: 'Delete',
    description: 'Delete entire topic'
  },
  topic_delete_warning: {
    id: 'topic_delete_warning',
    defaultMessage: 'Are you sure you want to delete this conversation? It cannot be undone.',
    description: 'Alert warning when deleting entire topic'
  },
  delete_messages_warning: {
    id: 'delete_messages_warning',
    defaultMessage: 'Are you sure you want to delete all messages for everyone? It cannot be undone.',
    description: 'Alert dialog warning when hard-deleting all messages.'
  },
  unblock: {
    id: 'menu_item_unblock',
    defaultMessage: 'Unblock',
    description: 'Unblock topic or user'
  },
  block: {
    id: 'menu_item_block',
    defaultMessage: 'Block',
    description: 'Block topic or user'
  },
  topic_block_warning: {
    id: 'topic_block_warning',
    defaultMessage: 'Are you sure you want to block this conversation?',
    description: 'Alert warning when blocking a topic.'
  },
  member_delete: {
    id: 'menu_item_member_delete',
    defaultMessage: 'Remove',
    description: 'Remove user from topic'
  },
  archive: {
    id: 'menu_item_archive_topic',
    defaultMessage: 'Archive',
    description: 'Move topic from the list of active chats to archive'
  },
  unarchive: {
    id: 'menu_item_restore_topic',
    defaultMessage: 'Restore',
    description: 'Restore topic from archive'
  },
  edit_permissions: {
    id: 'menu_item_edit_permissions',
    defaultMessage: 'Edit permissions',
    description: 'Menu item [Edit permissions]'
  },
  clear_messages_warning: {
    id: 'clear_messages_warning',
    defaultMessage: 'Are you sure you want to clear all messages? It cannot be undone.',
    description: 'Alert dialog warning when deleting all messages.'
  },
  pin_message: {
    id: 'pin_message',
    defaultMessage: 'Pin',
    description: 'Menu item [Pin] for pinning message to the top.'
  },
  unpin_message: {
    id: 'unpin_message',
    defaultMessage: 'Unpin',
    description: 'Menu item [Unpin] for un-pinning the message.'
  },
  pin_chat: {
    id: 'pin_chat',
    defaultMessage: 'Pin',
    description: 'Menu item [Pin] for pinning chat to the top.'
  },
  unpin_chat: {
    id: 'unpin_chat',
    defaultMessage: 'Unpin',
    description: 'Menu item [Unpin] for un-pinning the chat.'
  }
});
class ContextMenu extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    this.selfRef = react__WEBPACK_IMPORTED_MODULE_0___default().createRef();
    const {
      formatMessage
    } = props.intl;
    this.handlePageClick = this.handlePageClick.bind(this);
    this.handleEscapeKey = this.handleEscapeKey.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.MenuItems = {
      'topic_info': {
        id: 'topic_info',
        title: formatMessage(messages.info),
        handler: null
      },
      'messages_clear': {
        id: 'messages_clear',
        title: formatMessage(messages.clear_messages),
        handler: (params, errorHandler) => {
          return props.onShowAlert(params.topicTitle || formatMessage(messages.clear_messages), formatMessage(messages.clear_messages_warning), _ => {
            this.deleteMessages(true, false, params, errorHandler);
          }, null, true, null);
        }
      },
      'messages_clear_hard': {
        id: 'messages_clear_hard',
        title: formatMessage(messages.clear_for_all),
        handler: (params, errorHandler) => {
          return props.onShowAlert(params.topicTitle || formatMessage(messages.clear_for_all), formatMessage(messages.delete_messages_warning), _ => {
            return this.deleteMessages(true, true, params, errorHandler);
          }, null, true, null);
        }
      },
      'message_delete': {
        id: 'message_delete',
        title: formatMessage(messages.delete),
        handler: (params, errorHandler) => {
          return this.deleteMessages(false, false, params, errorHandler);
        }
      },
      'message_delete_hard': {
        id: 'message_delete_hard',
        title: formatMessage(messages.delete_for_all),
        handler: (params, errorHandler) => {
          return this.deleteMessages(false, true, params, errorHandler);
        }
      },
      'message_delete_generic': {
        id: 'message_delete_generic',
        title: formatMessage(messages.delete),
        handler: (params, errorHandler) => {
          return this.deleteMessages(false, true, params, errorHandler);
        }
      },
      'menu_item_send_retry': {
        id: 'menu_item_send_retry',
        title: formatMessage(messages.send_retry),
        handler: (params, errorHandler) => {
          return this.retryMessage(params, errorHandler);
        }
      },
      'menu_item_reply': {
        id: 'menu_item_reply',
        title: formatMessage(messages.reply),
        handler: (params, errorHandler) => {
          return this.replyToMessage(params, errorHandler);
        }
      },
      'menu_item_forward': {
        id: 'menu_item_forward',
        title: formatMessage(messages.forward),
        handler: _ => {}
      },
      'menu_item_edit': {
        id: 'menu_item_edit',
        title: formatMessage(messages.edit),
        handler: (params, errorHandler) => {
          return this.editMessage(params, errorHandler);
        }
      },
      'menu_item_pin': {
        id: 'menu_item_pin',
        title: formatMessage(messages.pin_message),
        handler: (params, errorHandler) => {
          return this.pinMessage(true, params, errorHandler);
        }
      },
      'menu_item_unpin': {
        id: 'menu_item_unpin',
        title: formatMessage(messages.unpin_message),
        handler: (params, errorHandler) => {
          return this.pinMessage(false, params, errorHandler);
        }
      },
      'topic_unmute': {
        id: 'topic_unmute',
        title: formatMessage(messages.unmute),
        handler: this.topicPermissionSetter.bind(this, '+P')
      },
      'topic_mute': {
        id: 'topic_mute',
        title: formatMessage(messages.mute),
        handler: this.topicPermissionSetter.bind(this, '-P')
      },
      'topic_unblock': {
        id: 'topic_unblock',
        title: formatMessage(messages.unblock),
        handler: this.topicPermissionSetter.bind(this, '+JP')
      },
      'topic_block': {
        id: 'topic_block',
        title: formatMessage(messages.block),
        handler: (params, errorHandler) => {
          return props.onShowAlert(params.topicTitle || formatMessage(messages.block), formatMessage(messages.topic_block_warning), _ => this.topicPermissionSetter('-JP', params, errorHandler).then(ctrl => {
            this.props.onTopicRemoved(params.topicName);
            return ctrl;
          }), null, true, null);
        }
      },
      'topic_delete': {
        id: 'topic_delete',
        title: formatMessage(messages.topic_delete),
        handler: (params, errorHandler) => {
          return props.onShowAlert(params.topicTitle || formatMessage(messages.topic_delete), formatMessage(messages.topic_delete_warning), _ => {
            const topic = this.props.tinode.getTopic(params.topicName);
            if (!topic) {
              console.warn("Topic not found: ", params.topicName);
              return;
            }
            return topic.delTopic(true).catch(err => {
              if (errorHandler) {
                errorHandler(err.message, 'err');
              }
            });
          }, null, true, null);
        }
      },
      'topic_archive': {
        id: 'topic_archive',
        title: formatMessage(messages.archive),
        handler: (params, errorHandler) => {
          const topic = this.props.tinode.getTopic(params.topicName);
          if (!topic) {
            console.warn("Topic not found: ", params.topicName);
            return;
          }
          return topic.archive(true).catch(err => {
            if (errorHandler) {
              errorHandler(err.message, 'err');
            }
          });
        }
      },
      'topic_restore': {
        id: 'topic_restore',
        title: formatMessage(messages.unarchive),
        handler: (params, errorHandler) => {
          const topic = this.props.tinode.getTopic(params.topicName);
          if (!topic) {
            console.warn("Topic not found: ", params.topicName);
            return;
          }
          return topic.archive(false).catch(err => {
            if (errorHandler) {
              errorHandler(err.message, 'err');
            }
          });
        }
      },
      'topic_pin': {
        id: 'topic_pin',
        title: formatMessage(messages.pin_chat),
        handler: (params, errorHandler) => {
          const me = this.props.tinode.getMeTopic();
          if (!me) {
            console.warn("'me' topic not found");
            return;
          }
          return me.pinTopic(params.topicName, true).catch(err => {
            if (errorHandler) {
              errorHandler(err.message, 'err');
            }
          });
        }
      },
      'topic_unpin': {
        id: 'topic_unpin',
        title: formatMessage(messages.unpin_chat),
        handler: (params, errorHandler) => {
          const me = this.props.tinode.getMeTopic();
          if (!me) {
            console.warn("'me' topic not found");
            return;
          }
          return me.pinTopic(params.topicName, false).catch(err => {
            if (errorHandler) {
              errorHandler(err.message, 'err');
            }
          });
        }
      },
      'permissions': {
        id: 'permissions',
        title: formatMessage(messages.edit_permissions),
        handler: null
      },
      'member_delete': {
        id: 'member_delete',
        title: formatMessage(messages.member_delete),
        handler: (params, errorHandler) => {
          const topic = this.props.tinode.getTopic(params.topicName);
          if (!topic || !params.user) {
            console.warn("Topic or user not found: '" + params.topicName + "', '" + params.user + "'");
            return;
          }
          return topic.delSubscription(params.user).catch(err => {
            if (errorHandler) {
              errorHandler(err.message, 'err');
            }
          });
        }
      },
      'member_mute': {
        id: 'member_mute',
        title: formatMessage(messages.mute),
        handler: this.topicPermissionSetter.bind(this, '-P')
      },
      'member_unmute': {
        id: 'member_unmute',
        title: formatMessage(messages.unmute),
        handler: this.topicPermissionSetter.bind(this, '+P')
      },
      'member_block': {
        id: 'member_block',
        title: formatMessage(messages.block),
        handler: this.topicPermissionSetter.bind(this, '-JP')
      },
      'member_unblock': {
        id: 'member_unblock',
        title: formatMessage(messages.unblock),
        handler: this.topicPermissionSetter.bind(this, '+JP')
      }
    };
  }
  componentDidMount() {
    document.addEventListener('mousedown', this.handlePageClick, false);
    document.addEventListener('keyup', this.handleEscapeKey, false);
  }
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handlePageClick, false);
    document.removeEventListener('keyup', this.handleEscapeKey, false);
  }
  handlePageClick(e) {
    if (this.selfRef.current.contains(e.target)) {
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
    let item = this.props.items[e.currentTarget.dataset.id];
    if (typeof item == 'string') {
      item = this.MenuItems[item];
    }
    if (!item) {
      console.error("Invalid menu item ID", e.currentTarget.dataset.id);
    } else {
      this.props.onAction(item.id, item.handler(this.props.params, this.props.onError), this.props.params);
    }
  }
  deleteMessages(all, hard, params, errorHandler) {
    const topic = this.props.tinode.getTopic(params.topicName);
    if (!topic) {
      console.warn("Topic not found: ", params.topicName);
      return;
    }
    if (!all && topic.cancelSend(params.seq)) {
      return;
    }
    const promise = all ? topic.delMessagesAll(hard) : params.replace > 0 ? topic.delMessagesEdits(params.replace, hard) : topic.delMessagesList([params.seq], hard);
    return promise.catch(err => {
      if (errorHandler) {
        errorHandler(err.message, 'err');
      }
    });
  }
  retryMessage(params, errorHandler) {
    const topic = this.props.tinode.getTopic(params.topicName);
    if (!topic || !topic.flushMessage(params.seq)) {
      return;
    }
    const msg = topic.createMessage(params.content, false);
    return topic.publishDraft(msg).catch(err => {
      if (errorHandler) {
        errorHandler(err.message, 'err');
      }
    });
  }
  pinMessage(pin, params, errorHandler) {
    const topic = this.props.tinode.getTopic(params.topicName);
    if (!topic) {
      return;
    }
    topic.pinMessage(params.seq, pin).catch(err => errorHandler ? errorHandler(err.message, 'err') : null);
  }
  topicPermissionSetter(mode, params, errorHandler) {
    const topic = this.props.tinode.getTopic(params.topicName);
    if (!topic) {
      console.warn("Topic not found", params.topicName);
      return;
    }
    let result = topic.updateMode(params.user, mode);
    if (errorHandler) {
      result = result.catch(err => errorHandler(err.message, 'err'));
    }
    return result;
  }
  replyToMessage(params, errorHandler) {
    params.pickReply(params.seq, params.content, params.userFrom, params.userName, errorHandler);
  }
  editMessage(params, errorHandler) {
    params.editMessage(params.replace || params.seq, params.content, errorHandler);
  }
  render() {
    const menu = [];
    let count = 0;
    this.props.items.forEach(item => {
      if (typeof item == 'string') {
        item = this.MenuItems[item];
      }
      if (item && item.title) {
        const className = item.disabled ? 'disabled' : undefined;
        menu.push(item.title == '-' ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)("li", {
          className: "separator"
        }, count, false) : (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)("li", {
          className: className,
          onClick: this.handleClick,
          "data-id": count,
          children: item.title
        }, count, false));
      }
      count++;
    });
    const hSize = 12 * _config_js__WEBPACK_IMPORTED_MODULE_2__.REM_SIZE;
    const vSize = _config_js__WEBPACK_IMPORTED_MODULE_2__.REM_SIZE * (0.7 + menu.length * 2.5);
    const left = this.props.bounds.right - this.props.clickAt.x < hSize ? this.props.clickAt.x - this.props.bounds.left - hSize : this.props.clickAt.x - this.props.bounds.left;
    const top = this.props.bounds.bottom - this.props.clickAt.y < vSize ? this.props.clickAt.y - this.props.bounds.top - vSize : this.props.clickAt.y - this.props.bounds.top;
    const position = {
      left: left + 'px',
      top: top + 'px'
    };
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)("ul", {
      className: "menu",
      style: position,
      ref: this.selfRef,
      children: menu
    }, void 0, false);
  }
}
/* harmony default export */ __webpack_exports__["default"] = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(ContextMenu));

/***/ }),

/***/ "./src/widgets/cropper.jsx":
/*!*********************************!*\
  !*** ./src/widgets/cropper.jsx ***!
  \*********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Cropper; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");


const DEFAULT_MAX_ZOOM = 8;
class Cropper extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    this.state = {
      panX: 0,
      panY: 0,
      originX: 0,
      originY: 0,
      zoom: 1,
      minZoom: 0.001,
      maxZoom: DEFAULT_MAX_ZOOM
    };
    this.overlay = react__WEBPACK_IMPORTED_MODULE_0___default().createRef();
    this.cutout = react__WEBPACK_IMPORTED_MODULE_0___default().createRef();
    this.preview = react__WEBPACK_IMPORTED_MODULE_0___default().createRef();
    this.boundingBox = react__WEBPACK_IMPORTED_MODULE_0___default().createRef();
    this.imageWidth = 0;
    this.imageHeight = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.prevDistance = 0;
    this.cutoutRect = {};
    this.bBoxRect = {};
    this.originX = 0;
    this.originY = 0;
    this.initScaling = this.initScaling.bind(this);
    this.onZoom = this.onZoom.bind(this);
    this.handleZoom = this.handleZoom.bind(this);
    this.mouseDown = this.mouseDown.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    this.mouseMove = this.mouseMove.bind(this);
    this.mouseTouch = this.mouseTouch.bind(this);
    this.positionAll = this.positionAll.bind(this);
    this.translate = this.translate.bind(this);
  }
  componentDidMount() {
    this.overlay.current.addEventListener('mousedown', this.mouseDown, {
      passive: true
    });
    this.overlay.current.addEventListener('touchstart', this.mouseDown, {
      passive: true
    });
    this.bBoxRect = this.boundingBox.current.getBoundingClientRect();
    this.originX = this.bBoxRect.width / 2;
    this.originY = this.bBoxRect.height / 2;
    this.cutoutRect = this.cutout.current.getBoundingClientRect();
  }
  componentWillUnmount() {
    if (this.overlay.current) {
      this.overlay.current.removeEventListener('mousedown', this.mouseDown);
      this.overlay.current.removeEventListener('touchstart', this.mouseDown);
    }
  }
  positionAll(panX, panY, zoom) {
    this.setState({
      panX: panX,
      panY: panY,
      zoom: zoom,
      originX: this.originX - panX,
      originY: this.originY - panY
    });
    const left = (this.originX - panX) * zoom - this.originX;
    const top = (this.originY - panY) * zoom - this.originY;
    this.props.onChange((left + this.cutoutRect.left - this.bBoxRect.left) / zoom, (top + this.cutoutRect.top - this.bBoxRect.top) / zoom, this.cutoutRect.width / zoom, this.cutoutRect.height / zoom, zoom);
  }
  static checkBound(currPan, img, cutout, delta) {
    let nextDiff = Math.min(0, cutout[0] - img[0] - delta, img[1] - cutout[1] + delta);
    if (nextDiff == 0) {
      currPan += delta;
    } else if (Math.min(0, cutout[0] - img[0], img[1] - cutout[1]) < nextDiff) {
      currPan += delta;
    }
    return currPan;
  }
  initScaling() {
    const imgRect = this.preview.current.getBoundingClientRect();
    this.imageWidth = imgRect.width;
    this.imageHeight = imgRect.height;
    const minZoom = Math.max(this.cutoutRect.width / imgRect.width, this.cutoutRect.height / imgRect.height);
    this.setState({
      minZoom: minZoom,
      maxZoom: minZoom * DEFAULT_MAX_ZOOM
    });
    const zoom = Math.max(this.bBoxRect.width / imgRect.width, this.bBoxRect.height / imgRect.height);
    const panX = this.cutoutRect.left - this.bBoxRect.left - (imgRect.width - this.cutoutRect.width) / 2;
    const panY = this.cutoutRect.top - this.bBoxRect.top - (imgRect.height - this.cutoutRect.height) / 2;
    this.positionAll(panX, panY, zoom);
  }
  onZoom(e) {
    this.handleZoom(e.target.value);
  }
  handleZoom(zoom) {
    let panX = this.state.panX;
    let panY = this.state.panY;
    const imgLeft = this.originX - (this.originX - panX) * zoom;
    const imgRight = imgLeft + this.imageWidth * zoom;
    const imgTop = this.originY - (this.originY - panY) * zoom;
    const imgBottom = imgTop + this.imageHeight * zoom;
    const coLeft = this.cutoutRect.left - this.bBoxRect.left;
    const coRight = coLeft + this.cutoutRect.width;
    const coTop = this.cutoutRect.top - this.bBoxRect.top;
    const coBottom = coTop + this.cutoutRect.height;
    if (coLeft < imgLeft) {
      panX -= (imgLeft - coLeft) / zoom;
    } else if (coRight > imgRight) {
      panX += (coRight - imgRight) / zoom;
    }
    if (coTop < imgTop) {
      panY -= (imgTop - coTop) / zoom;
    } else if (coBottom > imgBottom) {
      panY += (coBottom - imgBottom) / zoom;
    }
    this.positionAll(panX, panY, zoom);
  }
  mouseDown(e) {
    if (e.touches) {
      this.mouseX = e.touches[0].pageX;
      this.mouseY = e.touches[0].pageY;
    } else {
      this.mouseX = e.pageX;
      this.mouseY = e.pageY;
    }
    window.addEventListener('mousemove', this.mouseMove, {
      passive: false
    });
    window.addEventListener('touchmove', this.mouseTouch, {
      passive: false
    });
    window.addEventListener('mouseup', this.mouseUp, {
      passive: true
    });
    window.addEventListener('touchend', this.mouseUp, {
      passive: true
    });
    document.body.style['userSelect'] = 'none';
  }
  translate(pageX, pageY) {
    const dX = (pageX - this.mouseX) / this.state.zoom;
    const dY = (pageY - this.mouseY) / this.state.zoom;
    this.mouseX = pageX;
    this.mouseY = pageY;
    const imgRect = this.preview.current.getBoundingClientRect();
    const panX = Cropper.checkBound(this.state.panX, [imgRect.left, imgRect.right], [this.cutoutRect.left, this.cutoutRect.right], dX);
    const panY = Cropper.checkBound(this.state.panY, [imgRect.top, imgRect.bottom], [this.cutoutRect.top, this.cutoutRect.bottom], dY);
    this.positionAll(panX, panY, this.state.zoom);
  }
  mouseMove(e) {
    e.preventDefault();
    this.translate(e.pageX, e.pageY);
  }
  mouseTouch(e) {
    e.preventDefault();
    if (e.touches.length == 1) {
      this.translate(e.touches[0].pageX, e.touches[0].pageY);
      return;
    }
    const [touch0, touch1] = e.touches;
    const distance = Math.sqrt((touch0.pageX - touch1.pageX) * (touch0.pageX - touch1.pageX) + (touch0.pageY - touch1.pageY) * (touch0.pageY - touch1.pageY));
    if (!this.prevDistance) {
      this.prevDistance = distance / this.state.zoom;
    }
    let scale = distance / this.prevDistance;
    this.handleZoom(Math.max(this.minZoom, Math.min(this.maxZoom, scale)));
  }
  mouseUp(e) {
    window.removeEventListener('mousemove', this.mouseMove);
    window.removeEventListener('touchmove', this.mouseTouch);
    window.removeEventListener('mouseup', this.mouseUp);
    window.removeEventListener('touchend', this.mouseUp);
    document.body.style['userSelect'] = '';
    this.positionAll(this.state.panX, this.state.panY, this.state.zoom);
  }
  render() {
    const t3d = `translate3d(${this.state.panX}px, ${this.state.panY}px, 0) scale(${this.state.zoom})`;
    const orig = `${this.state.originX}px ${this.state.originY}px`;
    const overlay = {
      top: `${this.originY - this.state.originY * this.state.zoom}px`,
      left: `${this.originX - this.state.originX * this.state.zoom}px`,
      width: `${this.imageWidth * this.state.zoom}px`,
      height: `${this.imageHeight * this.state.zoom}px`
    };
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxDEV)("div", {
      className: "cropper",
      children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxDEV)("div", {
        className: "bounding-box",
        ref: this.boundingBox,
        children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxDEV)("img", {
          src: this.props.source,
          className: "preview",
          alt: "",
          style: {
            transform: t3d,
            transformOrigin: orig
          },
          ref: this.preview,
          onLoad: this.initScaling
        }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxDEV)("div", {
          className: "cutout circle",
          ref: this.cutout
        }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxDEV)("div", {
          className: "overlay",
          style: overlay,
          ref: this.overlay
        }, void 0, false)]
      }, void 0, true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxDEV)("div", {
        className: "zoom-wrapper",
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxDEV)("input", {
          type: "range",
          className: "zoomer",
          step: "0.001",
          min: this.state.minZoom,
          max: this.state.maxZoom,
          value: this.state.zoom,
          onChange: this.onZoom
        }, void 0, false)
      }, void 0, false)]
    }, void 0, true);
  }
}

/***/ }),

/***/ "./src/widgets/error-panel.jsx":
/*!*************************************!*\
  !*** ./src/widgets/error-panel.jsx ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ ErrorPanel; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _menu_cancel_jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./menu-cancel.jsx */ "./src/widgets/menu-cancel.jsx");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");



class ErrorPanel extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
    this.hide = this.hide.bind(this);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.level !== this.props.level) {
      this.setState({
        show: !!this.props.level
      });
    }
  }
  hide() {
    this.setState({
      show: false
    });
    if (this.props.onClearError) {
      this.props.onClearError();
    }
  }
  render() {
    const icons = {
      err: 'error',
      warn: 'warning',
      info: 'info'
    };
    const level = icons[this.props.level] || '';
    const className = 'info-box ' + level;
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
      className: className,
      children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
        className: "icon",
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("i", {
          className: "material-icons",
          children: level
        }, void 0, false)
      }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("span", {
        children: [this.props.text, this.props.action ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment, {
          children: ["\xA0 ", (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("a", {
            href: "#",
            style: {
              whiteSpace: 'nowrap'
            },
            onClick: e => {
              e.preventDefault();
              this.props.action();
            },
            children: this.props.actionText
          }, void 0, false)]
        }, void 0, true) : null]
      }, void 0, true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
        className: "cancel",
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)(_menu_cancel_jsx__WEBPACK_IMPORTED_MODULE_1__["default"], {
          onCancel: this.hide
        }, void 0, false)
      }, void 0, false)]
    }, void 0, true);
  }
}
;

/***/ }),

/***/ "./src/widgets/file-progress.jsx":
/*!***************************************!*\
  !*** ./src/widgets/file-progress.jsx ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ FileProgress; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");



class FileProgress extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
      className: "uploader",
      children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("span", {
          style: {
            width: this.props.progress * 100 + "%"
          }
        }, void 0, false)
      }, void 0, false), this.props.progress < 0.999 ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("a", {
        href: "#",
        onClick: e => {
          e.preventDefault();
          this.props.onCancel();
        },
        children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("i", {
          className: "material-icons",
          children: "close"
        }, void 0, false), " ", (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
          id: "action_cancel",
          defaultMessage: "cancel",
          description: "Call to action [cancel]"
        }, void 0, false)]
      }, void 0, true) : (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
        id: "upload_finishing",
        defaultMessage: "finishing...",
        description: "Notification that upload is finishing"
      }, void 0, false)]
    }, void 0, true);
  }
}

/***/ }),

/***/ "./src/widgets/forward-dialog.jsx":
/*!****************************************!*\
  !*** ./src/widgets/forward-dialog.jsx ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ ForwardDialog; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _contact_list_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./contact-list.jsx */ "./src/widgets/contact-list.jsx");
/* harmony import */ var _search_contacts_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./search-contacts.jsx */ "./src/widgets/search-contacts.jsx");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");






class ForwardDialog extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    this.state = {
      query: null
    };
    this.handleEscapeKey = this.handleEscapeKey.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSearchContacts = this.handleSearchContacts.bind(this);
    this.handleContactSelected = this.handleContactSelected.bind(this);
  }
  componentDidMount() {
    this.props.onInitFind();
  }
  handleEscapeKey(e) {
    if (e.keyCode === 27) {
      this.props.hide(false);
    }
  }
  handleClose(e) {
    e.preventDefault();
    this.props.hide(false);
  }
  handleSearchContacts(query) {
    this.setState({
      query: tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.isNullValue(query) ? null : query
    });
    this.props.onSearchContacts(query);
  }
  handleContactSelected(uid) {
    this.props.onTopicSelected(uid);
    this.props.hide(true);
  }
  render() {
    let contacts = this.state.query != null ? this.props.searchResults : this.props.contacts;
    contacts = contacts.filter(c => {
      return c.name != this.props.topicSelected && c.acs.isJoiner() && c.acs.isWriter();
    });
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("div", {
      className: "alert-container",
      children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("div", {
        className: "forward-dialog",
        children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("div", {
          className: "title with-control",
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("div", {
            children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
              id: "forward_to",
              defaultMessage: "Forward to",
              desription: "Title of the contact selector dialog when forwarding a message"
            }, void 0, false)
          }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("div", {
            children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("a", {
              href: "#",
              onClick: this.handleClose,
              children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("i", {
                className: "material-icons",
                children: "close"
              }, void 0, false)
            }, void 0, false)
          }, void 0, false)]
        }, void 0, true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
          id: "forward_to_search_placeholder",
          defaultMessage: "Search contacts",
          description: "Contact search prompt when forwarding a message.",
          children: search_placeholder => (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)(_search_contacts_jsx__WEBPACK_IMPORTED_MODULE_4__["default"], {
            placeholder: search_placeholder,
            onSearchContacts: this.handleSearchContacts
          }, void 0, false)
        }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
          id: "search_no_results",
          defaultMessage: "Search returned no results",
          description: "Text shown in contacts view when query returned no results.",
          children: not_found_placeholder => (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)(_contact_list_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
            tinode: this.props.tinode,
            contacts: contacts,
            myUserId: this.props.myUserId,
            emptyListMessage: not_found_placeholder,
            showOnline: false,
            showUnread: false,
            showContextMenu: false,
            onTopicSelected: this.handleContactSelected
          }, void 0, false)
        }, void 0, false)]
      }, void 0, true)
    }, void 0, false);
  }
}

/***/ }),

/***/ "./src/widgets/host-selector.jsx":
/*!***************************************!*\
  !*** ./src/widgets/host-selector.jsx ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ HostSelector; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");



class HostSelector extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.state = {
      hostName: props.serverAddress,
      changed: false
    };
    this.handleHostNameChange = this.handleHostNameChange.bind(this);
    this.handleEditingFinished = this.handleEditingFinished.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }
  handleHostNameChange(e) {
    this.setState({
      hostName: e.target.value,
      changed: true
    });
  }
  handleEditingFinished() {
    if (this.state.changed) {
      this.setState({
        changed: false
      });
      this.props.onServerAddressChange(this.state.hostName.trim());
    }
  }
  handleKeyDown(e) {
    if (e.key == 'Enter') {
      this.handleEditingFinished();
    }
  }
  render() {
    const hostOptions = [];
    for (let key in _config_js__WEBPACK_IMPORTED_MODULE_1__.KNOWN_HOSTS) {
      let item = _config_js__WEBPACK_IMPORTED_MODULE_1__.KNOWN_HOSTS[key];
      hostOptions.push((0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("option", {
        value: item
      }, item, false));
    }
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
      className: "panel-form-row",
      children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("input", {
        type: "search",
        id: "host-name",
        placeholder: this.props.hostName,
        list: "known-hosts",
        className: "quoted",
        value: this.state.hostName,
        onChange: this.handleHostNameChange,
        onBlur: this.handleEditingFinished,
        onKeyDown: this.handleKeyDown,
        required: true
      }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("datalist", {
        id: "known-hosts",
        children: hostOptions
      }, void 0, false)]
    }, void 0, true);
  }
}

/***/ }),

/***/ "./src/widgets/in-place-edit.jsx":
/*!***************************************!*\
  !*** ./src/widgets/in-place-edit.jsx ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ InPlaceEdit; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _visible_password_jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./visible-password.jsx */ "./src/widgets/visible-password.jsx");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");



class InPlaceEdit extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    this.selfRef = react__WEBPACK_IMPORTED_MODULE_0___default().createRef();
    this.state = {
      active: props.active,
      initialValue: props.value || '',
      value: props.value || '',
      valid: true
    };
    this.handeTextChange = this.handeTextChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleStartEditing = this.handleStartEditing.bind(this);
    this.handleEditingFinished = this.handleEditingFinished.bind(this);
    this.handlePasswordFinished = this.handlePasswordFinished.bind(this);
  }
  componentDidUpdate(prevProps, prevState) {
    const newValue = this.props.value || '';
    if (prevState.initialValue != newValue && !prevState.active) {
      this.setState({
        initialValue: newValue,
        value: newValue
      });
    }
  }
  handeTextChange(e) {
    this.setState({
      value: e.target.value || ''
    });
    if (this.props.validator) {
      Promise.resolve(this.props.validator(e.target.value)).then(valid => {
        this.setState({
          valid: valid
        });
      }).catch(err => {
        if (err) {
          this.setState({
            valid: false
          });
        }
      });
    }
  }
  handleKeyDown(e) {
    if (e.keyCode === 27) {
      this.setState({
        value: this.props.value,
        active: false
      });
    } else if (e.keyCode === 13) {
      this.handleEditingFinished(e);
    }
  }
  handleStartEditing() {
    if (!this.props.readOnly) {
      this.setState({
        active: true
      }, _ => {
        if (this.selfRef.current) {
          this.selfRef.current.focus();
        }
      });
    }
  }
  handleEditingFinished(event) {
    const value = this.state.value.trim();
    if (this.props.required && (!event.target.checkValidity() || !value)) {
      this.setState({
        value: this.props.value,
        active: false
      });
      return;
    }
    this.setState({
      active: false
    });
    if ((value || this.props.value) && value !== this.props.value && this.state.valid) {
      this.props.onFinished(value);
    }
  }
  handlePasswordFinished(value) {
    this.setState({
      active: false
    });
    if (value && value !== this.props.value) {
      this.props.onFinished(value);
    }
  }
  render() {
    if (!this.state.active) {
      let spanText = this.props.type == 'password' ? '••••••••' : this.state.value;
      let spanClass = 'in-place-edit' + (this.props.readOnly ? ' disabled' : '');
      if (!spanText) {
        spanText = this.props.placeholder;
        spanClass += ' placeholder';
      }
      if (!this.props.multiline || this.props.multiline == 1) {
        spanClass += ' short';
      }
      return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("span", {
        className: spanClass,
        onClick: this.handleStartEditing,
        children: [this.props.iconLeft && (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("i", {
          className: "material-icons light-gray",
          children: this.props.iconLeft
        }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("span", {
          children: spanText
        }, void 0, false), this.props.iconRight && (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("i", {
          className: "material-icons light-gray",
          children: this.props.iconRight
        }, void 0, false)]
      }, void 0, true);
    }
    let element;
    const attr = {};
    if (this.props.type == 'password') {
      element = _visible_password_jsx__WEBPACK_IMPORTED_MODULE_1__["default"];
      attr.onFinished = this.handlePasswordFinished;
    } else {
      if (this.props.multiline > 1) {
        element = 'textarea';
        attr.rows = this.props.multiline;
        attr.className = 'in-place-edit';
      } else {
        element = 'input';
        attr.type = this.props.type || 'text';
        attr.className = 'in-place-edit' + (this.props.iconLeft ? ' with-icon-left' : this.props.iconRight ? ' with-icon-right' : '');
        if (this.props.maxLength) {
          attr.maxLength = this.props.maxLength;
        }
      }
      attr.value = this.state.value;
      attr.className += this.state.valid ? '' : ' invalid';
      attr.ref = this.selfRef;
      attr.onChange = this.handeTextChange;
      attr.onKeyDown = this.handleKeyDown;
      attr.onBlur = this.handleEditingFinished;
    }
    attr.placeholder = this.props.placeholder;
    attr.required = this.props.required ? 'required' : '';
    attr.autoComplete = this.props.autoComplete;
    attr.autoFocus = true;
    if (this.props.spellCheck !== undefined) {
      attr.spellCheck = this.props.spellCheck ? 'true' : 'false';
    }
    if (this.props.iconLeft || this.props.iconRight) {
      return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment, {
        children: [this.props.iconLeft && (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("i", {
          className: "material-icons light-gray",
          children: this.props.iconLeft
        }, void 0, false), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(element, attr, null), this.props.iconRight && (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("i", {
          className: "material-icons light-gray",
          children: this.props.iconRight
        }, void 0, false)]
      }, void 0, true);
    }
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(element, attr, null);
  }
}
;

/***/ }),

/***/ "./src/widgets/inline-video.jsx":
/*!**************************************!*\
  !*** ./src/widgets/inline-video.jsx ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ InlineVideo; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");



class InlineVideo extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.videoRef = react__WEBPACK_IMPORTED_MODULE_0___default().createRef();
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e) {
    if (this.props.onClick) {
      this.props.onClick(e);
    }
  }
  render() {
    const duration = (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_1__.secondsToTime)(this.props['data-duration'] / 1000);
    const className = 'inline-video' + (this.props.onClick ? ' image-clickable' : '');
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
      className: className,
      children: [react__WEBPACK_IMPORTED_MODULE_0___default().createElement('img', this.props), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
        className: "play-control",
        children: this.props.onClick ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("i", {
          className: "material-icons white x-big",
          children: "play_arrow"
        }, void 0, false) : (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("img", {
          src: "img/broken_video.png",
          style: {
            filter: 'invert(100%)'
          },
          width: "36",
          height: "36"
        }, void 0, false)
      }, void 0, false), duration ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
        className: "duration",
        children: duration
      }, void 0, false) : null]
    }, void 0, true);
  }
}
;

/***/ }),

/***/ "./src/widgets/lazy-image.jsx":
/*!************************************!*\
  !*** ./src/widgets/lazy-image.jsx ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ LazyImage; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

class LazyImage extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.state = {
      src: this.props.isvideo ? 'img/blankvid.png' : 'img/blankimg.png',
      style: Object.assign({
        padding: '4px'
      }, this.props.style),
      className: this.props.className,
      alt: this.props.alt,
      onClick: this.props.onClick
    };
  }
  componentDidMount() {
    this.props.whenDone.promise.then(data => this.setState({
      src: data.src,
      style: {
        ...this.state.style,
        padding: 0
      }
    })).catch(_ => this.setState({
      src: this.props.isvideo ? 'img/broken_video.png' : 'img/broken_image.png'
    }));
  }
  componentWillUnmount() {
    this.props.whenDone.cancel();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.whenDone != this.props.whenDone) {
      this.setState({
        src: this.props.isvideo ? 'img/blankvid.png' : 'img/blankimg.png',
        style: {
          ...this.state.style,
          padding: '4px'
        }
      });
      this.props.whenDone.promise.then(data => this.setState({
        src: data.src,
        style: {
          ...this.state.style,
          padding: 0
        }
      })).catch(_ => this.setState({
        src: this.props.isvideo ? 'img/broken_video.png' : 'img/broken_image.png'
      }));
    }
  }
  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement('img', this.state);
  }
}
;

/***/ }),

/***/ "./src/widgets/letter-tile.jsx":
/*!*************************************!*\
  !*** ./src/widgets/letter-tile.jsx ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ LetterTile; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");






class LetterTile extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    let avatar;
    if (this.props.avatar === true) {
      if (tinode_sdk__WEBPACK_IMPORTED_MODULE_1__.Tinode.isSelfTopicName(this.props.topic)) {
        avatar = (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("img", {
          className: "avatar self",
          alt: "avatar",
          src: _config_js__WEBPACK_IMPORTED_MODULE_4__.SELF_AVATAR_URI
        }, void 0, false);
      } else {
        const isGroup = tinode_sdk__WEBPACK_IMPORTED_MODULE_1__.Tinode.isGroupTopicName(this.props.topic);
        const iconColor = (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_2__.idToColorClass)(this.props.topic, isGroup);
        if (this.props.topic && this.props.title && this.props.title.trim()) {
          const letter = this.props.title.trim().charAt(0);
          const className = 'lettertile ' + iconColor + (this.props.deleted ? ' disabled' : '');
          avatar = (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("div", {
            className: className,
            children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("div", {
              children: letter
            }, void 0, false)
          }, void 0, false);
        } else {
          const className = 'material-icons ' + iconColor + (this.props.deleted ? ' disabled' : '');
          avatar = isGroup ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("i", {
            className: className,
            children: "group"
          }, void 0, false) : (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("i", {
            className: className,
            children: "person"
          }, void 0, false);
        }
      }
    } else if (this.props.avatar) {
      const url = this.props.authorizeURL((0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_3__.sanitizeUrlForMime)(this.props.avatar, 'image'));
      const className = 'avatar' + (this.props.deleted ? ' deleted' : '');
      avatar = (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("img", {
        className: className,
        alt: "avatar",
        src: url,
        onError: e => {
          e.target.onerror = null;
          e.target.src = "img/broken_image.png";
        }
      }, void 0, false);
    } else {
      avatar = null;
    }
    return avatar;
  }
}

/***/ }),

/***/ "./src/widgets/load-spinner.jsx":
/*!**************************************!*\
  !*** ./src/widgets/load-spinner.jsx ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ LoadSpinner; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");


class LoadSpinner extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    const className = 'load-spinner-box' + (this.props.large ? ' large' : '') + (this.props.clear ? ' clear' : '') + (this.props.centered ? ' centered' : '');
    return this.props.show ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxDEV)("div", {
      className: className,
      children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxDEV)("div", {
        className: "loader-spinner"
      }, void 0, false)
    }, void 0, false) : null;
  }
}

/***/ }),

/***/ "./src/widgets/menu-cancel.jsx":
/*!*************************************!*\
  !*** ./src/widgets/menu-cancel.jsx ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ MenuCancel; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");


class MenuCancel extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxDEV)("a", {
      href: "#",
      onClick: e => {
        e.preventDefault();
        this.props.onCancel();
      },
      children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxDEV)("i", {
        className: "material-icons",
        children: "close"
      }, void 0, false)
    }, void 0, false);
  }
}

/***/ }),

/***/ "./src/widgets/menu-contacts.jsx":
/*!***************************************!*\
  !*** ./src/widgets/menu-contacts.jsx ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ MenuContacts; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");


class MenuContacts extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxDEV)("div", {
      children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxDEV)("a", {
        href: "#",
        onClick: e => {
          e.preventDefault();
          this.props.onNewTopic();
        },
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxDEV)("i", {
          className: "material-icons",
          children: "chat"
        }, void 0, false)
      }, void 0, false), "\xA0", (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxDEV)("a", {
        href: "#",
        onClick: e => {
          e.preventDefault();
          this.props.onSettings();
        },
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxDEV)("i", {
          className: "material-icons",
          children: "settings"
        }, void 0, false)
      }, void 0, false)]
    }, void 0, true);
  }
}
;

/***/ }),

/***/ "./src/widgets/menu-start.jsx":
/*!************************************!*\
  !*** ./src/widgets/menu-start.jsx ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ MenuStart; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");


class MenuStart extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxDEV)("div", {
      children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxDEV)("a", {
        href: "#",
        onClick: e => {
          e.preventDefault();
          this.props.onSignUp();
        },
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxDEV)("i", {
          className: "material-icons",
          children: "person_add"
        }, void 0, false)
      }, void 0, false), "\xA0", (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxDEV)("a", {
        href: "#",
        onClick: e => {
          e.preventDefault();
          this.props.onSettings();
        },
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxDEV)("i", {
          className: "material-icons",
          children: "settings"
        }, void 0, false)
      }, void 0, false)]
    }, void 0, true);
  }
}
;

/***/ }),

/***/ "./src/widgets/new-topic-by-id.jsx":
/*!*****************************************!*\
  !*** ./src/widgets/new-topic-by-id.jsx ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var qrcodejs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! qrcodejs */ "qrcodejs");
/* harmony import */ var qrcodejs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(qrcodejs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config */ "./src/config.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");





const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_2__.defineMessages)({
  invalid_id: {
    id: 'error_invalid_id',
    defaultMessage: 'Invalid ID',
    description: 'Error message'
  }
});
class NewTopicById extends (react__WEBPACK_IMPORTED_MODULE_1___default().PureComponent) {
  constructor(props) {
    super(props);
    this.qrCodeRef = react__WEBPACK_IMPORTED_MODULE_1___default().createRef();
    this.state = {
      groupId: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    new (qrcodejs__WEBPACK_IMPORTED_MODULE_0___default())(this.qrCodeRef.current, {
      text: this.props.myURI,
      width: _config__WEBPACK_IMPORTED_MODULE_3__.QRCODE_SIZE,
      height: _config__WEBPACK_IMPORTED_MODULE_3__.QRCODE_SIZE
    });
  }
  handleChange(e) {
    this.setState({
      groupId: e.target.value
    });
  }
  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.handleSubmit(e);
    }
  }
  handleSubmit(e) {
    e.preventDefault();
    if (this.state.groupId) {
      const name = this.state.groupId.trim();
      const prefix = name.substring(0, 3);
      if (name.length > 3 && ['usr', 'grp', 'chn'].includes(prefix)) {
        this.props.onSubmit(name);
      } else {
        this.props.onError(this.props.intl.formatMessage(messages.invalid_id), 'err');
      }
    }
  }
  render() {
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
      className: "panel-form",
      children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
        className: "panel-form-row",
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_2__.FormattedMessage, {
          id: "group_user_id_prompt",
          defaultMessage: "Group or User ID",
          description: "Prompt for entering user or group ID",
          children: prompt => (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("input", {
            type: "text",
            placeholder: prompt,
            value: this.state.groupId,
            onChange: this.handleChange,
            onKeyDown: this.handleKeyPress,
            required: true,
            autoFocus: true
          }, void 0, false)
        }, void 0, false)
      }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
        className: "dialog-buttons",
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("button", {
          className: "primary",
          onClick: this.handleSubmit,
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_2__.FormattedMessage, {
            id: "button_subscribe",
            defaultMessage: "Subscribe",
            description: "Button [Subscribe]"
          }, void 0, false)
        }, void 0, false)
      }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("br", {}, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
        className: "panel-form-column",
        children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("label", {
          className: "small",
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_2__.FormattedMessage, {
            id: "label_scan_id",
            defaultMessage: "Scan my ID:",
            description: "Label [Scan my ID:]"
          }, void 0, false)
        }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
          className: "qr-code",
          ref: this.qrCodeRef
        }, void 0, false)]
      }, void 0, true)]
    }, void 0, true);
  }
}
;
/* harmony default export */ __webpack_exports__["default"] = ((0,react_intl__WEBPACK_IMPORTED_MODULE_2__.injectIntl)(NewTopicById));

/***/ }),

/***/ "./src/widgets/new-topic-group.jsx":
/*!*****************************************!*\
  !*** ./src/widgets/new-topic-group.jsx ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ NewTopicGroup; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _avatar_crop_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./avatar-crop.jsx */ "./src/widgets/avatar-crop.jsx");
/* harmony import */ var _avatar_upload_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./avatar-upload.jsx */ "./src/widgets/avatar-upload.jsx");
/* harmony import */ var _checkbox_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./checkbox.jsx */ "./src/widgets/checkbox.jsx");
/* harmony import */ var _tag_manager_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./tag-manager.jsx */ "./src/widgets/tag-manager.jsx");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");










class NewTopicGroup extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.fullName = react__WEBPACK_IMPORTED_MODULE_0___default().createRef();
    this.state = {
      fullName: '',
      private: '',
      description: '',
      imageUrl: null,
      tags: [],
      isChannel: false,
      newAvatar: null,
      newAvatarMime: null
    };
    this.handleFieldEdit = this.handleFieldEdit.bind(this);
    this.handleImageChanged = this.handleImageChanged.bind(this);
    this.handleAvatarCropped = this.handleAvatarCropped.bind(this);
    this.handleAvatarCropCancel = this.handleAvatarCropCancel.bind(this);
    this.uploadAvatar = this.uploadAvatar.bind(this);
    this.handleTagsChanged = this.handleTagsChanged.bind(this);
    this.handleChannelToggle = this.handleChannelToggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {}
  handleFieldEdit(name, e) {
    this.setState({
      [name]: e.target.value || ''
    });
  }
  handleImageChanged(mime, img) {
    this.setState({
      newAvatar: img,
      newAvatarMime: mime
    });
  }
  handleAvatarCropped(mime, blob, width, height) {
    const url = blob ? URL.createObjectURL(blob) : null;
    this.setState({
      imageUrl: url,
      newAvatar: null,
      newAvatarMime: null
    });
    if (blob) {
      this.uploadAvatar(mime, blob, width, height);
    }
  }
  handleAvatarCropCancel() {
    this.setState({
      newAvatar: null,
      newAvatarMime: null
    });
  }
  uploadAvatar(mime, blob, width, height) {
    const readyToUpload = image => {
      let {
        mime,
        blob
      } = image;
      if (blob.size > _config_js__WEBPACK_IMPORTED_MODULE_6__.MAX_AVATAR_BYTES) {
        const uploader = this.props.tinode.getLargeFileHelper();
        uploader.upload(blob).then(url => this.setState({
          imageUrl: url
        })).catch(err => this.props.onError(err.message, 'err'));
      } else {
        (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_7__.blobToBase64)(blob).then(b64 => this.setState({
          imageUrl: (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_7__.makeImageUrl)({
            data: b64.bits,
            type: mime
          })
        }));
      }
    };
    if (width > _config_js__WEBPACK_IMPORTED_MODULE_6__.AVATAR_SIZE || height > _config_js__WEBPACK_IMPORTED_MODULE_6__.AVATAR_SIZE || width != height) {
      (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_7__.imageScaled)(blob, _config_js__WEBPACK_IMPORTED_MODULE_6__.AVATAR_SIZE, _config_js__WEBPACK_IMPORTED_MODULE_6__.AVATAR_SIZE, _config_js__WEBPACK_IMPORTED_MODULE_6__.MAX_EXTERN_ATTACHMENT_SIZE, true).then(scaled => readyToUpload(scaled)).catch(err => this.props.onError(err.message, 'err'));
    } else {
      readyToUpload({
        mime: mime,
        blob: blob,
        width: width,
        height: height
      });
    }
  }
  handleTagsChanged(tags) {
    this.setState({
      tags: tags
    });
  }
  handleChannelToggle() {
    this.setState({
      isChannel: !this.state.isChannel
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    const fn = (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_8__.truncateString)(this.state.fullName.trim(), _config_js__WEBPACK_IMPORTED_MODULE_6__.MAX_TITLE_LENGTH);
    const comment = (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_8__.truncateString)(this.state.private.trim(), _config_js__WEBPACK_IMPORTED_MODULE_6__.MAX_TITLE_LENGTH);
    const description = (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_8__.truncateString)(this.state.description.trim(), _config_js__WEBPACK_IMPORTED_MODULE_6__.MAX_TOPIC_DESCRIPTION_LENGTH);
    if (fn) {
      this.props.onSubmit(fn, description, this.state.imageUrl, comment, this.state.tags, this.state.isChannel);
    }
  }
  render() {
    if (this.state.newAvatar) {
      return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(_avatar_crop_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
        avatar: this.state.newAvatar,
        mime: this.state.newAvatarMime,
        onSubmit: this.handleAvatarCropped,
        onCancel: this.handleAvatarCropCancel,
        onError: this.props.onError
      }, void 0, false);
    }
    let submitClasses = 'primary';
    if (this.props.disabled) {
      submitClasses += ' disabled';
    }
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("form", {
      className: "panel-form",
      onSubmit: this.handleSubmit,
      children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
        className: "panel-form-column",
        children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("center", {
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(_avatar_upload_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
            tinode: this.props.tinode,
            avatar: this.state.imageUrl,
            onError: this.props.onError,
            onImageUpdated: this.handleImageChanged
          }, void 0, false)
        }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
          className: "group",
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("label", {
            className: "small",
            htmlFor: "new-topic-fn",
            children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
              id: "label_topic_name",
              defaultMessage: "Name",
              description: "Label for editing topic name"
            }, void 0, false)
          }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "topic_name_editing_placeholder",
            defaultMessage: "Freeform name of the group",
            description: "Prompt for entering topic name",
            children: placeholder => (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("input", {
              type: "text",
              id: "new-topic-fn",
              placeholder: placeholder,
              ref: this.fullName,
              value: this.state.fullName,
              onChange: this.handleFieldEdit.bind(this, 'fullName'),
              autoFocus: true,
              required: true,
              tabIndex: 0
            }, void 0, false)
          }, void 0, false)]
        }, void 0, true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
          className: "group",
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("label", {
            className: "small",
            htmlFor: "new-topic-priv",
            children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
              id: "label_private",
              defaultMessage: "Private comment",
              description: "Label for editing 'private'"
            }, void 0, false)
          }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "private_editing_placeholder",
            defaultMessage: "Visible to you only",
            description: "Placeholder for editing 'private'",
            children: placeholder => (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("input", {
              type: "text",
              id: "new-topic-priv",
              placeholder: placeholder,
              value: this.state.private,
              onChange: this.handleFieldEdit.bind(this, 'private'),
              tabIndex: 1
            }, void 0, false)
          }, void 0, false)]
        }, void 0, true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
          className: "group",
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("label", {
            className: "small",
            htmlFor: "new-topic-desc",
            children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
              id: "label_description",
              defaultMessage: "Description",
              description: "Label for description of user or topic"
            }, void 0, false)
          }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "description_editing_placeholder",
            defaultMessage: "Description (optional)",
            description: "Placeholder for editing topic description",
            children: placeholder => (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("input", {
              type: "text",
              id: "new-topic-desc",
              placeholder: placeholder,
              value: this.state.description,
              onChange: this.handleFieldEdit.bind(this, 'description'),
              tabIndex: 2
            }, void 0, false)
          }, void 0, false)]
        }, void 0, true)]
      }, void 0, true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
        className: "panel-form-row",
        children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(_checkbox_jsx__WEBPACK_IMPORTED_MODULE_4__["default"], {
          checked: this.state.isChannel,
          tabIndex: 3,
          onChange: this.handleChannelToggle
        }, void 0, false), "\xA0", (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("label", {
          onClick: this.handleChannelToggle,
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "channel_prompt",
            defaultMessage: "This is a channel",
            description: "Checkbox label when creating a channel"
          }, void 0, false)
        }, void 0, false)]
      }, void 0, true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
        id: "title_tag_manager",
        defaultMessage: "Tags (search & discovery)",
        description: "Section title for TagManager",
        children: title => (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(_tag_manager_jsx__WEBPACK_IMPORTED_MODULE_5__["default"], {
          tinode: this.props.tinode,
          tags: this.state.tags,
          activated: true,
          onTagsChanged: this.handleTagsChanged,
          tabIndex: 4,
          title: title
        }, void 0, false)
      }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
        className: "dialog-buttons",
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("button", {
          className: submitClasses,
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "button_create",
            defaultMessage: "Create",
            description: "Button [Create]"
          }, void 0, false)
        }, void 0, false)
      }, void 0, false)]
    }, void 0, true);
  }
}
;

/***/ }),

/***/ "./src/widgets/search-contacts.jsx":
/*!*****************************************!*\
  !*** ./src/widgets/search-contacts.jsx ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ SearchContacts; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");



class SearchContacts extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.state = {
      edited: false,
      search: this.props.initialQuery || ''
    };
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }
  componentWillUnmount() {
    if (this.state.edited) {
      this.setState({
        search: '',
        edited: false
      });
      this.props.onSearchContacts(tinode_sdk__WEBPACK_IMPORTED_MODULE_1__.Tinode.DEL_CHAR);
    }
  }
  handleSearchChange(e) {
    this.setState({
      search: e.target.value
    });
  }
  handleSearch(e) {
    e.preventDefault();
    const query = this.state.search.trim();
    this.setState({
      edited: query.length > 0
    });
    this.props.onSearchContacts(query.length > 0 ? query : tinode_sdk__WEBPACK_IMPORTED_MODULE_1__.Tinode.DEL_CHAR);
  }
  handleClear(e) {
    e.preventDefault();
    if (this.state.edited) {
      this.props.onSearchContacts(tinode_sdk__WEBPACK_IMPORTED_MODULE_1__.Tinode.DEL_CHAR);
    }
    this.setState({
      search: '',
      edited: false
    });
  }
  handleKeyDown(e) {
    if (e.key === 'Enter') {
      this.handleSearch(e);
    } else if (e.key === 'Escape') {
      e.stopPropagation();
      this.handleClear(e);
    }
  }
  render() {
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
      className: "panel-form",
      children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
        className: "panel-form-row",
        children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("i", {
          className: "material-icons search",
          children: "search"
        }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("input", {
          className: "search",
          type: "text",
          placeholder: this.props.placeholder,
          value: this.state.search,
          onChange: this.handleSearchChange,
          onKeyDown: this.handleKeyDown,
          required: true,
          autoFocus: true
        }, void 0, false), this.state.search ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("a", {
          href: "#",
          onClick: this.handleClear,
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("i", {
            className: "material-icons",
            children: "highlight_off"
          }, void 0, false)
        }, void 0, false) : (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("span", {
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("i", {
            className: "material-icons",
            children: "\xA0"
          }, void 0, false)
        }, void 0, false)]
      }, void 0, true)
    }, void 0, false);
  }
}
;

/***/ }),

/***/ "./src/widgets/side-navbar.jsx":
/*!*************************************!*\
  !*** ./src/widgets/side-navbar.jsx ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ SideNavbar; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _letter_tile_jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./letter-tile.jsx */ "./src/widgets/letter-tile.jsx");
/* harmony import */ var _button_back_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./button-back.jsx */ "./src/widgets/button-back.jsx");
/* harmony import */ var _contact_badges_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./contact-badges.jsx */ "./src/widgets/contact-badges.jsx");
/* harmony import */ var _menu_contacts_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./menu-contacts.jsx */ "./src/widgets/menu-contacts.jsx");
/* harmony import */ var _menu_start_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./menu-start.jsx */ "./src/widgets/menu-start.jsx");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");








class SideNavbar extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    const icon_badges = [];
    if (this.props.trustedBadges) {
      this.props.trustedBadges.forEach(b => {
        icon_badges.push({
          icon: b,
          color: 'badge-inv'
        });
      });
    }
    let avatar = null;
    if (this.props.tinode) {
      avatar = this.props.tinode.authorizeURL((0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_6__.sanitizeUrlForMime)(this.props.avatar, 'image'));
    }
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxDEV)("div", {
      id: "side-caption-panel",
      className: "caption-panel",
      children: [this.props.onCancel ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxDEV)(_button_back_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
        onBack: this.props.onCancel
      }, void 0, false) : null, avatar ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxDEV)("div", {
        id: "self-avatar",
        className: "avatar-box",
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxDEV)(_letter_tile_jsx__WEBPACK_IMPORTED_MODULE_1__["default"], {
          authorizeURL: this.props.tinode.authorizeURL,
          avatar: avatar,
          topic: this.props.myUserId,
          title: this.props.title
        }, void 0, false)
      }, void 0, false) : null, (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxDEV)("div", {
        id: "sidepanel-title",
        className: "panel-title",
        children: [this.props.title, (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxDEV)(_contact_badges_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
          badges: icon_badges
        }, void 0, false)]
      }, void 0, true), this.props.state === 'login' ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxDEV)(_menu_start_jsx__WEBPACK_IMPORTED_MODULE_5__["default"], {
        onSignUp: this.props.onSignUp,
        onSettings: this.props.onSettings
      }, void 0, false) : this.props.state === 'contacts' ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxDEV)(_menu_contacts_jsx__WEBPACK_IMPORTED_MODULE_4__["default"], {
        onNewTopic: this.props.onNewTopic,
        onSettings: this.props.onSettings
      }, void 0, false) : null]
    }, void 0, true);
  }
}
;

/***/ }),

/***/ "./src/widgets/tag-manager.jsx":
/*!*************************************!*\
  !*** ./src/widgets/tag-manager.jsx ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ TagManager; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _chip_input_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./chip-input.jsx */ "./src/widgets/chip-input.jsx");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");







class TagManager extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    this.state = {
      tags: this.props.tags || [],
      alias: tinode_sdk__WEBPACK_IMPORTED_MODULE_3__.Tinode.tagByPrefix(this.props.tags, tinode_sdk__WEBPACK_IMPORTED_MODULE_3__.Tinode.TAG_ALIAS) || '',
      tagInput: '',
      activated: this.props.activated
    };
    this.handleTagInput = this.handleTagInput.bind(this);
    this.handleAddTag = this.handleAddTag.bind(this);
    this.handleRemoveTag = this.handleRemoveTag.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    const tags = nextProps.tags || [];
    if (!(0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_5__.arrayEqual)(tags, prevState.tags) && !prevState.activated) {
      return {
        tags: tags || [],
        alias: tinode_sdk__WEBPACK_IMPORTED_MODULE_3__.Tinode.tagByPrefix(tags, tinode_sdk__WEBPACK_IMPORTED_MODULE_3__.Tinode.TAG_ALIAS) || ''
      };
    }
    return null;
  }
  handleTagInput(text) {
    this.setState({
      tagInput: text
    });
    if (text.length > 0) {
      const last = text[text.length - 1];
      if (text[0] == '"') {
        if (text.length > 1 && last == '"') {
          this.handleAddTag(text.substring(1, text.length - 1));
        }
      } else if (last == ',' || last == ' ' || last == ';' || last == '"') {
        this.handleAddTag(text.substring(0, text.length - 1).trim());
      }
    }
  }
  handleAddTag(tag) {
    const maxTagCount = this.props.tinode.getServerParam(tinode_sdk__WEBPACK_IMPORTED_MODULE_3__.Tinode.MAX_TAG_COUNT, _config_js__WEBPACK_IMPORTED_MODULE_4__.MAX_TAG_COUNT);
    if (tag.length > 0 && this.state.tags.length < maxTagCount) {
      const tags = this.state.tags.slice(0);
      tags.push(tag);
      this.setState({
        tags: tags,
        tagInput: ''
      });
      if (this.props.onTagsChanged) {
        this.props.onTagsChanged(tags);
      }
      return tags;
    }
    return this.state.tags;
  }
  handleRemoveTag(tag, index) {
    const tags = this.state.tags.slice(0);
    tags.splice(index, 1);
    this.setState({
      tags: tags
    });
    if (this.props.onTagsChanged) {
      this.props.onTagsChanged(tags);
    }
  }
  handleSubmit() {
    let tags = this.handleAddTag(this.state.tagInput.trim());
    tags = tinode_sdk__WEBPACK_IMPORTED_MODULE_3__.Tinode.setUniqueTag(tags, this.state.alias);
    this.props.onSubmit(tags);
    this.setState({
      activated: false,
      tags: this.props.tags || []
    });
  }
  handleCancel() {
    this.setState({
      activated: false,
      tagInput: '',
      tags: this.props.tags || []
    });
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  }
  render() {
    const minTagLength = this.props.tinode.getServerParam(tinode_sdk__WEBPACK_IMPORTED_MODULE_3__.Tinode.MIN_TAG_LENGTH, _config_js__WEBPACK_IMPORTED_MODULE_4__.MIN_TAG_LENGTH);
    const maxTagLength = this.props.tinode.getServerParam(tinode_sdk__WEBPACK_IMPORTED_MODULE_3__.Tinode.MAX_TAG_LENGTH, _config_js__WEBPACK_IMPORTED_MODULE_4__.MAX_TAG_LENGTH);
    let tags = [];
    if (this.state.activated) {
      this.state.tags.forEach(tag => {
        if (tag != this.state.alias) {
          tags.push({
            user: tag,
            invalid: tag.length < minTagLength || tag.length > maxTagLength
          });
        }
      });
    } else {
      this.state.tags.forEach(tag => {
        if (tag != this.state.alias) {
          tags.push((0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)("span", {
            className: "badge",
            children: tag
          }, tags.length, false));
        }
      });
      if (tags.length == 0) {
        tags = (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)("i", {
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "tags_not_found",
            defaultMessage: "No tags defined. Add some.",
            description: ""
          }, void 0, false)
        }, void 0, false);
      }
    }
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)("div", {
      className: "panel-form-column",
      children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)("div", {
        className: "panel-form-row",
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)("label", {
          className: "small",
          children: this.props.title
        }, void 0, false)
      }, void 0, false), this.state.activated ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)("div", {
        children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
          id: "tags_editor_no_tags",
          defaultMessage: "Add some tags",
          description: "Tag editor prompt when no tags are found.",
          children: add_tags_prompt => (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)(_chip_input_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
            tinode: this.props.tinode,
            chips: tags,
            avatarDisabled: true,
            prompt: add_tags_prompt,
            tabIndex: this.props.tabIndex,
            onEnter: this.handleAddTag,
            onFocusLost: this.handleAddTag,
            onCancel: this.handleCancel,
            onChipRemoved: this.handleRemoveTag,
            filterFunc: this.handleTagInput
          }, void 0, false)
        }, void 0, false), this.props.onSubmit || this.props.onCancel ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)("div", {
          id: "tag-manager-buttons",
          className: "dialog-buttons panel-form-row",
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)("button", {
            className: "outline",
            onClick: this.handleCancel,
            children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
              id: "button_cancel",
              defaultMessage: "Cancel",
              description: "Button [Cancel]"
            }, void 0, false)
          }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)("button", {
            className: "primary",
            onClick: this.handleSubmit,
            children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
              id: "button_ok",
              defaultMessage: "OK",
              description: "Button [OK]"
            }, void 0, false)
          }, void 0, false)]
        }, void 0, true) : null]
      }, void 0, true) : (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)("div", {
        className: "quoted",
        children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)("a", {
          href: "#",
          className: "flat-button",
          onClick: e => {
            e.preventDefault();
            this.setState({
              activated: true
            });
          },
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)("i", {
            className: "material-icons",
            children: "edit"
          }, void 0, false), " \xA0", (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "title_manage_tags",
            defaultMessage: "Manage",
            description: "Section title for the list of tags"
          }, void 0, false)]
        }, void 0, true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
          children: tags
        }, void 0, false)]
      }, void 0, true)]
    }, void 0, true);
  }
}
;

/***/ }),

/***/ "./src/widgets/the-card-mini.jsx":
/*!***************************************!*\
  !*** ./src/widgets/the-card-mini.jsx ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _letter_tile_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./letter-tile.jsx */ "./src/widgets/letter-tile.jsx");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");





const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  unknown_name: {
    id: 'unknown_name',
    defaultMessage: 'Unknown',
    description: 'Name to show when the name is missing'
  }
});
class TheCardMini extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.handleDownload = this.handleDownload.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
  }
  handleDownload(e) {
    e.preventDefault();
    try {
      const vcard = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.TheCard.exportVCard(this.props.content);
      const blob = new Blob([vcard], {
        type: 'text/vcard'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = (this.props.content.fn || 'contact') + '.vcf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Failed to download vcard", err);
      if (this.props.onError) {
        this.props.onError("Failed to download vcard", 'err');
      }
    }
  }
  handleMessage(e) {}
  render() {
    const card = this.props.content;
    if (!card) {
      return null;
    }
    const uid = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.TheCard.getFirstTinodeID(card);
    const contacts = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.TheCard.getEmails(card).concat(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.TheCard.getPhones(card));
    const org = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.TheCard.getOrg(card);
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
      className: "contact-card",
      children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
        className: "contact-body",
        children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
          className: "avatar-box",
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(_letter_tile_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
            authorizeURL: this.props.authorizeURL,
            topic: uid || 'usr123XXX',
            avatar: tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.TheCard.getPhotoUrl(card) || true,
            title: card.fn
          }, void 0, false)
        }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
          className: "name-box",
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
            className: "name",
            children: card.fn || (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
              ...messages.unknown_name
            }, void 0, false)
          }, void 0, false), org && (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
            className: "org",
            children: org
          }, void 0, false)]
        }, void 0, true)]
      }, void 0, true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
        className: "contact-actions",
        children: [uid ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("a", {
            className: "flat-button",
            "data-val": uid,
            onClick: this.props.onChatClick,
            children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
              id: "chat_now",
              defaultMessage: "Chat",
              description: "Label for message button in contact card"
            }, void 0, false)
          }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
            className: "divider"
          }, void 0, false)]
        }, void 0, true) : contacts.length > 0 ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("a", {
            className: "flat-button",
            "data-val": contacts.join(','),
            onClick: this.props.onFindClick,
            children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
              id: "find_user",
              defaultMessage: "Find",
              description: "Label for search button in contact card"
            }, void 0, false)
          }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
            className: "divider"
          }, void 0, false)]
        }, void 0, true) : null, (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("a", {
          className: "flat-button",
          onClick: this.handleDownload,
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "save_action",
            defaultMessage: "Save",
            description: "Label for Save button"
          }, void 0, false)
        }, void 0, false)]
      }, void 0, true)]
    }, void 0, true);
  }
}
;
/* harmony default export */ __webpack_exports__["default"] = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(TheCardMini));

/***/ }),

/***/ "./src/widgets/topic-desc-edit.jsx":
/*!*****************************************!*\
  !*** ./src/widgets/topic-desc-edit.jsx ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _avatar_crop_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./avatar-crop.jsx */ "./src/widgets/avatar-crop.jsx");
/* harmony import */ var _avatar_upload_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./avatar-upload.jsx */ "./src/widgets/avatar-upload.jsx");
/* harmony import */ var _in_place_edit_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./in-place-edit.jsx */ "./src/widgets/in-place-edit.jsx");
/* harmony import */ var _tag_manager_jsx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./tag-manager.jsx */ "./src/widgets/tag-manager.jsx");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");












const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  alias_invalid: {
    id: 'alias_invalid',
    defaultMessage: '(invalid)',
    description: 'Error message for invalid alias'
  },
  alias_already_taken: {
    id: 'alias_already_taken',
    defaultMessage: '(already taken)',
    description: 'Error message for alias already taken'
  },
  self_topic_name: {
    id: 'self_topic_name',
    defaultMessage: 'Saved messages',
    description: 'Name of self topic for UI'
  },
  self_topic_comment: {
    id: 'self_topic_comment',
    defaultMessage: 'Notes, messages, links, files saved for posterity',
    description: 'Comment for self topic for UI'
  }
});
const ALIAS_AVAILABILITY_CHECK_DELAY = 1000;
class TopicDescEdit extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    const topic = this.props.tinode.getTopic(this.props.topic);
    const acs = topic.getAccessMode();
    const isSelf = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.isSelfTopicName(this.props.topic);
    this.state = {
      isMe: tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.isMeTopicName(this.props.topic),
      isSelf: isSelf,
      owner: acs && acs.isOwner(),
      fullName: topic.public ? topic.public.fn : isSelf ? this.props.intl.formatMessage(messages.self_topic_name) : null,
      private: topic.private ? topic.private.comment : null,
      description: topic.public ? topic.public.note : isSelf ? this.props.intl.formatMessage(messages.self_topic_comment) : null,
      avatar: (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_8__.makeImageUrl)(topic.public ? topic.public.photo : null),
      tags: topic.tags() || [],
      newAvatar: null,
      newAvatarMime: null,
      aliasError: ''
    };
    this.previousOnTags = null;
    this.aliasCheckTimer = null;
    this.aliasCheckPromise = null;
    this.tnNewTags = this.tnNewTags.bind(this);
    this.handleFullNameUpdate = this.handleFullNameUpdate.bind(this);
    this.handleImageUpdated = this.handleImageUpdated.bind(this);
    this.handleAvatarCropped = this.handleAvatarCropped.bind(this);
    this.handleAvatarCropCancel = this.handleAvatarCropCancel.bind(this);
    this.uploadAvatar = this.uploadAvatar.bind(this);
    this.handlePrivateUpdate = this.handlePrivateUpdate.bind(this);
    this.handleAliasUpdate = this.handleAliasUpdate.bind(this);
    this.handleDescriptionUpdate = this.handleDescriptionUpdate.bind(this);
    this.handleTagsUpdated = this.handleTagsUpdated.bind(this);
    this.validateAlias = this.validateAlias.bind(this);
    this.cancelValidator = this.cancelValidator.bind(this);
  }
  componentDidMount() {
    const topic = this.props.tinode.getTopic(this.props.topic);
    this.previousOnTags = topic.onTagsUpdated;
    topic.onTagsUpdated = this.tnNewTags;
  }
  componentWillUnmount() {
    const topic = this.props.tinode.getTopic(this.props.topic);
    topic.onTagsUpdated = this.previousOnTags;
    this.cancelValidator();
  }
  tnNewTags(tags) {
    this.setState({
      tags: tags
    });
  }
  handleFullNameUpdate(fn) {
    fn = (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_9__.truncateString)(fn.trim(), _config_js__WEBPACK_IMPORTED_MODULE_7__.MAX_TITLE_LENGTH);
    if (fn && this.state.fullName !== fn) {
      this.setState({
        fullName: fn
      });
      this.props.onUpdateTopicDesc(this.props.topic, (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_10__.theCard)(fn, null));
    }
  }
  handlePrivateUpdate(comment) {
    comment = comment.trim().substring(0, _config_js__WEBPACK_IMPORTED_MODULE_7__.MAX_TITLE_LENGTH);
    if (this.state.private !== comment) {
      this.setState({
        private: comment
      });
      this.props.onUpdateTopicDesc(this.props.topic, null, comment || tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.DEL_CHAR);
    }
  }
  handleDescriptionUpdate(desc) {
    desc = desc.trim().substring(0, _config_js__WEBPACK_IMPORTED_MODULE_7__.MAX_TOPIC_DESCRIPTION_LENGTH);
    if (desc) {
      this.setState({
        description: desc
      });
      this.props.onUpdateTopicDesc(this.props.topic, (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_10__.theCard)(null, null, null, desc));
    }
  }
  handleImageUpdated(mime, img) {
    this.setState({
      newAvatar: img,
      newAvatarMime: mime
    });
    if (!img) {
      this.setState({
        avatar: null
      });
      this.props.onUpdateTopicDesc(this.props.topic, (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_10__.theCard)(null, tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.DEL_CHAR));
    }
  }
  handleAvatarCropped(mime, blob, width, height) {
    const url = blob ? URL.createObjectURL(blob) : null;
    this.setState({
      avatar: url,
      newAvatar: null,
      newAvatarMime: null
    });
    if (blob) {
      this.uploadAvatar(mime, blob, width, height);
    }
  }
  uploadAvatar(mime, blob, width, height) {
    const readyToUpload = image => {
      let {
        mime,
        blob
      } = image;
      if (blob.size > _config_js__WEBPACK_IMPORTED_MODULE_7__.MAX_AVATAR_BYTES) {
        const uploader = this.props.tinode.getLargeFileHelper();
        uploader.upload(blob).then(url => this.props.onUpdateTopicDesc(this.props.topic, (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_10__.theCard)(null, url))).catch(err => this.props.onError(err.message, 'err'));
      } else {
        (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_8__.blobToBase64)(blob).then(b64 => {
          const du = (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_8__.makeImageUrl)({
            data: b64.bits,
            type: mime
          });
          this.setState({
            source: du
          });
          this.props.onUpdateTopicDesc(this.props.topic, (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_10__.theCard)(null, du));
        });
      }
    };
    if (width > _config_js__WEBPACK_IMPORTED_MODULE_7__.AVATAR_SIZE || height > _config_js__WEBPACK_IMPORTED_MODULE_7__.AVATAR_SIZE || width != height) {
      (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_8__.imageScaled)(blob, _config_js__WEBPACK_IMPORTED_MODULE_7__.AVATAR_SIZE, _config_js__WEBPACK_IMPORTED_MODULE_7__.AVATAR_SIZE, _config_js__WEBPACK_IMPORTED_MODULE_7__.MAX_EXTERN_ATTACHMENT_SIZE, true).then(scaled => readyToUpload(scaled)).catch(err => this.props.onError(err.message, 'err'));
    } else {
      readyToUpload({
        mime: mime,
        blob: blob,
        width: width,
        height: height
      });
    }
  }
  handleAvatarCropCancel() {
    this.setState({
      newAvatar: null,
      newAvatarMime: null
    });
  }
  handleAliasUpdate(alias) {
    alias = (alias || '').trim();
    const tags = alias ? tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.setUniqueTag(this.state.tags, tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.TAG_ALIAS + alias.toLowerCase()) : tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.clearTagPrefix(this.state.tags, tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.TAG_ALIAS);
    this.handleTagsUpdated(tags);
  }
  validateAlias(alias) {
    this.cancelValidator();
    alias = alias.trim();
    if (!alias) {
      this.setState({
        aliasError: ''
      });
      return true;
    }
    const valid = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.isValidTagValue(alias);
    if (!valid) {
      this.setState({
        aliasError: this.props.intl.formatMessage(messages.alias_invalid)
      });
      return false;
    }
    this.setState({
      aliasError: ''
    });
    const fnd = this.props.tinode.getFndTopic();
    if (!fnd) {
      this.setState({
        aliasError: ''
      });
      return true;
    }
    this.aliasCheckPromise = {};
    const validationPromise = new Promise((resolve, reject) => {
      this.aliasCheckPromise.resolve = resolve;
      this.aliasCheckPromise.reject = reject;
    });
    this.aliasCheckTimer = setTimeout(_ => {
      this.aliasCheckTimer = null;
      fnd.checkTagUniqueness(`${tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.TAG_ALIAS}${alias}`, this.props.topic).then(ok => {
        this.aliasCheckPromise.resolve(ok);
        this.setState({
          aliasError: ok ? '' : this.props.intl.formatMessage(messages.alias_already_taken)
        });
      }).catch(err => {
        this.aliasCheckPromise.reject(err);
        this.setState({
          aliasError: err.message
        });
      });
    }, ALIAS_AVAILABILITY_CHECK_DELAY);
    return validationPromise;
  }
  cancelValidator() {
    if (this.aliasCheckTimer) {
      clearTimeout(this.aliasCheckTimer);
      this.aliasCheckTimer = null;
      this.aliasCheckPromise.reject(null);
    }
  }
  handleTagsUpdated(tags) {
    if ((0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_10__.arrayEqual)(this.state.tags.slice(0), tags.slice(0))) {
      return;
    }
    this.props.onUpdateTags(tags);
  }
  render() {
    if (this.state.newAvatar) {
      return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxDEV)(_avatar_crop_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
        avatar: this.state.newAvatar,
        mime: this.state.newAvatarMime,
        onSubmit: this.handleAvatarCropped,
        onCancel: this.handleAvatarCropCancel,
        onError: this.props.onError
      }, void 0, false);
    }
    const editable = this.state.isMe || this.state.owner && !this.state.isSelf;
    let alias = this.state.tags && this.state.tags.find(t => t.startsWith('alias:'));
    if (alias) {
      alias = alias.substring(6);
    }
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__.Fragment, {
      children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxDEV)("div", {
        className: "panel-form-column",
        children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxDEV)("center", {
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxDEV)(_avatar_upload_jsx__WEBPACK_IMPORTED_MODULE_4__["default"], {
            tinode: this.props.tinode,
            avatar: this.state.avatar,
            readOnly: !editable,
            uid: this.props.topic,
            title: this.state.fullName,
            onImageUpdated: this.handleImageUpdated,
            onError: this.props.onError
          }, void 0, false)
        }, void 0, false), this.state.isMe ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxDEV)("div", {
          className: "group",
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxDEV)("label", {
            className: "small",
            children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
              id: "label_your_name",
              defaultMessage: "Your name",
              description: "Label for full name editing"
            }, void 0, false)
          }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxDEV)("div", {
            children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
              id: "full_name_prompt",
              defaultMessage: "Full name, e.g. John Doe",
              description: "Input placeholder for person's full name",
              children: full_name_placeholder => (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxDEV)(_in_place_edit_jsx__WEBPACK_IMPORTED_MODULE_5__["default"], {
                placeholder: full_name_placeholder,
                value: this.state.fullName,
                required: true,
                onFinished: this.handleFullNameUpdate
              }, void 0, false)
            }, void 0, false)
          }, void 0, false)]
        }, void 0, true) : (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__.Fragment, {
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxDEV)("div", {
            className: "group",
            children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxDEV)("div", {
              children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxDEV)("label", {
                className: "small",
                children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
                  id: "label_topic_name",
                  defaultMessage: "Name",
                  description: "Label for editing topic name"
                }, void 0, false)
              }, void 0, false)
            }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxDEV)("div", {
              children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
                id: "topic_name_editing_placeholder",
                defaultMessage: "Freeform name of the group",
                description: "Prompt for entering topic name",
                children: group_name_placeholder => (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxDEV)(_in_place_edit_jsx__WEBPACK_IMPORTED_MODULE_5__["default"], {
                  placeholder: group_name_placeholder,
                  readOnly: !editable,
                  value: this.state.fullName,
                  required: true,
                  maxLength: 32,
                  onFinished: this.handleFullNameUpdate
                }, void 0, false)
              }, void 0, false)
            }, void 0, false)]
          }, void 0, true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxDEV)("div", {
            className: "group",
            children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxDEV)("div", {
              children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxDEV)("label", {
                className: "small",
                children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
                  id: "label_private",
                  defaultMessage: "Private comment",
                  description: "Label for editing 'private'"
                }, void 0, false)
              }, void 0, false)
            }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxDEV)("div", {
              children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
                id: "private_editing_placeholder",
                defaultMessage: "Visible to you only",
                description: "Placeholder for editing 'private'",
                children: private_placeholder => (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxDEV)(_in_place_edit_jsx__WEBPACK_IMPORTED_MODULE_5__["default"], {
                  placeholder: private_placeholder,
                  value: this.state.private,
                  onFinished: this.handlePrivateUpdate
                }, void 0, false)
              }, void 0, false)
            }, void 0, false)]
          }, void 0, true)]
        }, void 0, true), editable || alias ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxDEV)("div", {
          className: "group",
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxDEV)("div", {
            children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxDEV)("label", {
              className: 'small ' + (this.state.aliasError ? 'invalid' : ''),
              children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
                id: "label_alias_edit",
                defaultMessage: "Alias",
                description: "Label for editing user or topic alias"
              }, void 0, false), " ", this.state.aliasError]
            }, void 0, true)
          }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxDEV)("div", {
            children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
              id: "alias_editing_placeholder",
              defaultMessage: "Alias (optional)",
              description: "Placeholder for editing user or topic alias",
              children: private_placeholder => (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxDEV)(_in_place_edit_jsx__WEBPACK_IMPORTED_MODULE_5__["default"], {
                placeholder: private_placeholder,
                readOnly: !editable,
                value: alias,
                validator: this.validateAlias,
                iconLeft: "alternate_email",
                maxLength: 24,
                spellCheck: false,
                onFinished: this.handleAliasUpdate
              }, void 0, false)
            }, void 0, false)
          }, void 0, false)]
        }, void 0, true) : null, editable || this.state.description ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxDEV)("div", {
          className: "group",
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxDEV)("div", {
            children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxDEV)("label", {
              className: "small",
              children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
                id: "label_description",
                defaultMessage: "Description",
                description: "Label for description of user or topic"
              }, void 0, false)
            }, void 0, false)
          }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxDEV)("div", {
            children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
              id: "description_editing_placeholder",
              defaultMessage: "Description (optional)",
              description: "Placeholder for editing topic description",
              children: private_placeholder => (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxDEV)(_in_place_edit_jsx__WEBPACK_IMPORTED_MODULE_5__["default"], {
                placeholder: private_placeholder,
                readOnly: !editable,
                value: this.state.description,
                multiline: 2,
                onFinished: this.handleDescriptionUpdate
              }, void 0, false)
            }, void 0, false)
          }, void 0, false)]
        }, void 0, true) : null]
      }, void 0, true), editable && !this.state.isMe ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__.Fragment, {
        children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxDEV)("div", {
          className: "hr"
        }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
          id: "title_tag_manager",
          defaultMessage: "Tags (search & discovery)",
          description: "Section title for TagManager",
          children: title_tag_manager => (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxDEV)(_tag_manager_jsx__WEBPACK_IMPORTED_MODULE_6__["default"], {
            tinode: this.props.tinode,
            title: title_tag_manager,
            activated: false,
            tags: this.state.tags,
            onSubmit: this.handleTagsUpdated
          }, void 0, false)
        }, void 0, false)]
      }, void 0, true) : null]
    }, void 0, true);
  }
}
;
/* harmony default export */ __webpack_exports__["default"] = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(TopicDescEdit));

/***/ }),

/***/ "./src/widgets/unread-badge.jsx":
/*!**************************************!*\
  !*** ./src/widgets/unread-badge.jsx ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ UnreadBadge; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");


class UnreadBadge extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    return this.props.count > 0 ? (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxDEV)("span", {
      className: "unread",
      children: this.props.count > 9 ? "9+" : this.props.count
    }, void 0, false) : null;
  }
}
;

/***/ }),

/***/ "./src/widgets/uploading-image.jsx":
/*!*****************************************!*\
  !*** ./src/widgets/uploading-image.jsx ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ UploadingImage; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _file_progress_jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./file-progress.jsx */ "./src/widgets/file-progress.jsx");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");



class UploadingImage extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
  }
  render() {
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
      className: "inline-image",
      children: [react__WEBPACK_IMPORTED_MODULE_0___default().createElement('img', this.props), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
        className: "rounded-container",
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)(_file_progress_jsx__WEBPACK_IMPORTED_MODULE_1__["default"], {
          progress: this.props.progress,
          onCancel: this.props.onCancelUpload
        }, void 0, false)
      }, void 0, false)]
    }, void 0, true);
  }
}
;

/***/ }),

/***/ "./src/widgets/visible-password.jsx":
/*!******************************************!*\
  !*** ./src/widgets/visible-password.jsx ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ VisiblePassword; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");


class VisiblePassword extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.inputRef = react__WEBPACK_IMPORTED_MODULE_0___default().createRef();
    this.state = {
      value: this.props.value || '',
      visible: false
    };
    this.handleVisibility = this.handleVisibility.bind(this);
    this.handeTextChange = this.handeTextChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleEditingFinished = this.handleEditingFinished.bind(this);
  }
  componentDidMount() {
    if (this.props.autoFocus) {
      this.inputRef.current.focus();
    }
  }
  handeTextChange(e) {
    this.setState({
      value: e.target.value
    });
    if (this.props.onChange) {
      this.props.onChange(e);
    }
  }
  handleVisibility(e) {
    e.preventDefault();
    this.setState({
      visible: !this.state.visible
    });
  }
  handleKeyDown(e) {
    if (e.keyCode == 27) {
      this.setState({
        value: this.props.value || '',
        visible: false
      });
      if (this.props.onFinished) {
        this.props.onFinished();
      }
    } else if (e.keyCode == 13) {
      this.handleEditingFinished();
    }
  }
  handleEditingFinished(e) {
    if (e) {
      let currentTarget = e.currentTarget;
      setTimeout(_ => {
        if (!currentTarget.contains(document.activeElement)) {
          if (this.props.onFinished) {
            this.props.onFinished(this.state.value);
          }
        }
      }, 0);
    } else if (this.props.onFinished) {
      this.props.onFinished(this.state.value.trim());
    }
  }
  render() {
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxDEV)("div", {
      tabIndex: "-1",
      className: "group-focus",
      onBlur: this.handleEditingFinished,
      children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxDEV)("input", {
        className: "with-icon-right",
        type: this.state.visible ? 'text' : 'password',
        value: this.state.value,
        placeholder: this.props.placeholder,
        maxLength: 32,
        required: this.props.required ? 'required' : '',
        autoFocus: this.props.autoFocus ? 'autoFocus' : '',
        autoComplete: this.props.autoComplete,
        onChange: this.handeTextChange,
        onKeyDown: this.handleKeyDown,
        ref: this.inputRef
      }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxDEV)("span", {
        onClick: this.handleVisibility,
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxDEV)("i", {
          className: "material-icons clickable light-gray",
          children: this.state.visible ? 'visibility' : 'visibility_off'
        }, void 0, false)
      }, void 0, false)]
    }, void 0, true);
  }
}

/***/ }),

/***/ "./node_modules/react-dom/client.js":
/*!******************************************!*\
  !*** ./node_modules/react-dom/client.js ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var m = __webpack_require__(/*! react-dom */ "react-dom");
if (false) // removed by dead control flow
{} else {
  var i = m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  exports.createRoot = function(c, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.createRoot(c, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
  exports.hydrateRoot = function(c, h, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.hydrateRoot(c, h, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
}


/***/ }),

/***/ "./node_modules/react/cjs/react-jsx-dev-runtime.development.js":
/*!*********************************************************************!*\
  !*** ./node_modules/react/cjs/react-jsx-dev-runtime.development.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



if (true) {
  (function() {
'use strict';

var React = __webpack_require__(/*! react */ "react");

// ATTENTION
// When adding new symbols to this file,
// Please consider also adding to 'react-devtools-shared/src/backend/ReactSymbols'
// The Symbol used to tag the ReactElement-like types.
var REACT_ELEMENT_TYPE = Symbol.for('react.element');
var REACT_PORTAL_TYPE = Symbol.for('react.portal');
var REACT_FRAGMENT_TYPE = Symbol.for('react.fragment');
var REACT_STRICT_MODE_TYPE = Symbol.for('react.strict_mode');
var REACT_PROFILER_TYPE = Symbol.for('react.profiler');
var REACT_PROVIDER_TYPE = Symbol.for('react.provider');
var REACT_CONTEXT_TYPE = Symbol.for('react.context');
var REACT_FORWARD_REF_TYPE = Symbol.for('react.forward_ref');
var REACT_SUSPENSE_TYPE = Symbol.for('react.suspense');
var REACT_SUSPENSE_LIST_TYPE = Symbol.for('react.suspense_list');
var REACT_MEMO_TYPE = Symbol.for('react.memo');
var REACT_LAZY_TYPE = Symbol.for('react.lazy');
var REACT_OFFSCREEN_TYPE = Symbol.for('react.offscreen');
var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
var FAUX_ITERATOR_SYMBOL = '@@iterator';
function getIteratorFn(maybeIterable) {
  if (maybeIterable === null || typeof maybeIterable !== 'object') {
    return null;
  }

  var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];

  if (typeof maybeIterator === 'function') {
    return maybeIterator;
  }

  return null;
}

var ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

function error(format) {
  {
    {
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      printWarning('error', format, args);
    }
  }
}

function printWarning(level, format, args) {
  // When changing this logic, you might want to also
  // update consoleWithStackDev.www.js as well.
  {
    var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
    var stack = ReactDebugCurrentFrame.getStackAddendum();

    if (stack !== '') {
      format += '%s';
      args = args.concat([stack]);
    } // eslint-disable-next-line react-internal/safe-string-coercion


    var argsWithFormat = args.map(function (item) {
      return String(item);
    }); // Careful: RN currently depends on this prefix

    argsWithFormat.unshift('Warning: ' + format); // We intentionally don't use spread (or .apply) directly because it
    // breaks IE9: https://github.com/facebook/react/issues/13610
    // eslint-disable-next-line react-internal/no-production-logging

    Function.prototype.apply.call(console[level], console, argsWithFormat);
  }
}

// -----------------------------------------------------------------------------

var enableScopeAPI = false; // Experimental Create Event Handle API.
var enableCacheElement = false;
var enableTransitionTracing = false; // No known bugs, but needs performance testing

var enableLegacyHidden = false; // Enables unstable_avoidThisFallback feature in Fiber
// stuff. Intended to enable React core members to more easily debug scheduling
// issues in DEV builds.

var enableDebugTracing = false; // Track which Fiber(s) schedule render work.

var REACT_MODULE_REFERENCE;

{
  REACT_MODULE_REFERENCE = Symbol.for('react.module.reference');
}

function isValidElementType(type) {
  if (typeof type === 'string' || typeof type === 'function') {
    return true;
  } // Note: typeof might be other than 'symbol' or 'number' (e.g. if it's a polyfill).


  if (type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || enableDebugTracing  || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || enableLegacyHidden  || type === REACT_OFFSCREEN_TYPE || enableScopeAPI  || enableCacheElement  || enableTransitionTracing ) {
    return true;
  }

  if (typeof type === 'object' && type !== null) {
    if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || // This needs to include all possible module reference object
    // types supported by any Flight configuration anywhere since
    // we don't know which Flight build this will end up being used
    // with.
    type.$$typeof === REACT_MODULE_REFERENCE || type.getModuleId !== undefined) {
      return true;
    }
  }

  return false;
}

function getWrappedName(outerType, innerType, wrapperName) {
  var displayName = outerType.displayName;

  if (displayName) {
    return displayName;
  }

  var functionName = innerType.displayName || innerType.name || '';
  return functionName !== '' ? wrapperName + "(" + functionName + ")" : wrapperName;
} // Keep in sync with react-reconciler/getComponentNameFromFiber


function getContextName(type) {
  return type.displayName || 'Context';
} // Note that the reconciler package should generally prefer to use getComponentNameFromFiber() instead.


function getComponentNameFromType(type) {
  if (type == null) {
    // Host root, text node or just invalid type.
    return null;
  }

  {
    if (typeof type.tag === 'number') {
      error('Received an unexpected object in getComponentNameFromType(). ' + 'This is likely a bug in React. Please file an issue.');
    }
  }

  if (typeof type === 'function') {
    return type.displayName || type.name || null;
  }

  if (typeof type === 'string') {
    return type;
  }

  switch (type) {
    case REACT_FRAGMENT_TYPE:
      return 'Fragment';

    case REACT_PORTAL_TYPE:
      return 'Portal';

    case REACT_PROFILER_TYPE:
      return 'Profiler';

    case REACT_STRICT_MODE_TYPE:
      return 'StrictMode';

    case REACT_SUSPENSE_TYPE:
      return 'Suspense';

    case REACT_SUSPENSE_LIST_TYPE:
      return 'SuspenseList';

  }

  if (typeof type === 'object') {
    switch (type.$$typeof) {
      case REACT_CONTEXT_TYPE:
        var context = type;
        return getContextName(context) + '.Consumer';

      case REACT_PROVIDER_TYPE:
        var provider = type;
        return getContextName(provider._context) + '.Provider';

      case REACT_FORWARD_REF_TYPE:
        return getWrappedName(type, type.render, 'ForwardRef');

      case REACT_MEMO_TYPE:
        var outerName = type.displayName || null;

        if (outerName !== null) {
          return outerName;
        }

        return getComponentNameFromType(type.type) || 'Memo';

      case REACT_LAZY_TYPE:
        {
          var lazyComponent = type;
          var payload = lazyComponent._payload;
          var init = lazyComponent._init;

          try {
            return getComponentNameFromType(init(payload));
          } catch (x) {
            return null;
          }
        }

      // eslint-disable-next-line no-fallthrough
    }
  }

  return null;
}

var assign = Object.assign;

// Helpers to patch console.logs to avoid logging during side-effect free
// replaying on render function. This currently only patches the object
// lazily which won't cover if the log function was extracted eagerly.
// We could also eagerly patch the method.
var disabledDepth = 0;
var prevLog;
var prevInfo;
var prevWarn;
var prevError;
var prevGroup;
var prevGroupCollapsed;
var prevGroupEnd;

function disabledLog() {}

disabledLog.__reactDisabledLog = true;
function disableLogs() {
  {
    if (disabledDepth === 0) {
      /* eslint-disable react-internal/no-production-logging */
      prevLog = console.log;
      prevInfo = console.info;
      prevWarn = console.warn;
      prevError = console.error;
      prevGroup = console.group;
      prevGroupCollapsed = console.groupCollapsed;
      prevGroupEnd = console.groupEnd; // https://github.com/facebook/react/issues/19099

      var props = {
        configurable: true,
        enumerable: true,
        value: disabledLog,
        writable: true
      }; // $FlowFixMe Flow thinks console is immutable.

      Object.defineProperties(console, {
        info: props,
        log: props,
        warn: props,
        error: props,
        group: props,
        groupCollapsed: props,
        groupEnd: props
      });
      /* eslint-enable react-internal/no-production-logging */
    }

    disabledDepth++;
  }
}
function reenableLogs() {
  {
    disabledDepth--;

    if (disabledDepth === 0) {
      /* eslint-disable react-internal/no-production-logging */
      var props = {
        configurable: true,
        enumerable: true,
        writable: true
      }; // $FlowFixMe Flow thinks console is immutable.

      Object.defineProperties(console, {
        log: assign({}, props, {
          value: prevLog
        }),
        info: assign({}, props, {
          value: prevInfo
        }),
        warn: assign({}, props, {
          value: prevWarn
        }),
        error: assign({}, props, {
          value: prevError
        }),
        group: assign({}, props, {
          value: prevGroup
        }),
        groupCollapsed: assign({}, props, {
          value: prevGroupCollapsed
        }),
        groupEnd: assign({}, props, {
          value: prevGroupEnd
        })
      });
      /* eslint-enable react-internal/no-production-logging */
    }

    if (disabledDepth < 0) {
      error('disabledDepth fell below zero. ' + 'This is a bug in React. Please file an issue.');
    }
  }
}

var ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher;
var prefix;
function describeBuiltInComponentFrame(name, source, ownerFn) {
  {
    if (prefix === undefined) {
      // Extract the VM specific prefix used by each line.
      try {
        throw Error();
      } catch (x) {
        var match = x.stack.trim().match(/\n( *(at )?)/);
        prefix = match && match[1] || '';
      }
    } // We use the prefix to ensure our stacks line up with native stack frames.


    return '\n' + prefix + name;
  }
}
var reentry = false;
var componentFrameCache;

{
  var PossiblyWeakMap = typeof WeakMap === 'function' ? WeakMap : Map;
  componentFrameCache = new PossiblyWeakMap();
}

function describeNativeComponentFrame(fn, construct) {
  // If something asked for a stack inside a fake render, it should get ignored.
  if ( !fn || reentry) {
    return '';
  }

  {
    var frame = componentFrameCache.get(fn);

    if (frame !== undefined) {
      return frame;
    }
  }

  var control;
  reentry = true;
  var previousPrepareStackTrace = Error.prepareStackTrace; // $FlowFixMe It does accept undefined.

  Error.prepareStackTrace = undefined;
  var previousDispatcher;

  {
    previousDispatcher = ReactCurrentDispatcher.current; // Set the dispatcher in DEV because this might be call in the render function
    // for warnings.

    ReactCurrentDispatcher.current = null;
    disableLogs();
  }

  try {
    // This should throw.
    if (construct) {
      // Something should be setting the props in the constructor.
      var Fake = function () {
        throw Error();
      }; // $FlowFixMe


      Object.defineProperty(Fake.prototype, 'props', {
        set: function () {
          // We use a throwing setter instead of frozen or non-writable props
          // because that won't throw in a non-strict mode function.
          throw Error();
        }
      });

      if (typeof Reflect === 'object' && Reflect.construct) {
        // We construct a different control for this case to include any extra
        // frames added by the construct call.
        try {
          Reflect.construct(Fake, []);
        } catch (x) {
          control = x;
        }

        Reflect.construct(fn, [], Fake);
      } else {
        try {
          Fake.call();
        } catch (x) {
          control = x;
        }

        fn.call(Fake.prototype);
      }
    } else {
      try {
        throw Error();
      } catch (x) {
        control = x;
      }

      fn();
    }
  } catch (sample) {
    // This is inlined manually because closure doesn't do it for us.
    if (sample && control && typeof sample.stack === 'string') {
      // This extracts the first frame from the sample that isn't also in the control.
      // Skipping one frame that we assume is the frame that calls the two.
      var sampleLines = sample.stack.split('\n');
      var controlLines = control.stack.split('\n');
      var s = sampleLines.length - 1;
      var c = controlLines.length - 1;

      while (s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c]) {
        // We expect at least one stack frame to be shared.
        // Typically this will be the root most one. However, stack frames may be
        // cut off due to maximum stack limits. In this case, one maybe cut off
        // earlier than the other. We assume that the sample is longer or the same
        // and there for cut off earlier. So we should find the root most frame in
        // the sample somewhere in the control.
        c--;
      }

      for (; s >= 1 && c >= 0; s--, c--) {
        // Next we find the first one that isn't the same which should be the
        // frame that called our sample function and the control.
        if (sampleLines[s] !== controlLines[c]) {
          // In V8, the first line is describing the message but other VMs don't.
          // If we're about to return the first line, and the control is also on the same
          // line, that's a pretty good indicator that our sample threw at same line as
          // the control. I.e. before we entered the sample frame. So we ignore this result.
          // This can happen if you passed a class to function component, or non-function.
          if (s !== 1 || c !== 1) {
            do {
              s--;
              c--; // We may still have similar intermediate frames from the construct call.
              // The next one that isn't the same should be our match though.

              if (c < 0 || sampleLines[s] !== controlLines[c]) {
                // V8 adds a "new" prefix for native classes. Let's remove it to make it prettier.
                var _frame = '\n' + sampleLines[s].replace(' at new ', ' at '); // If our component frame is labeled "<anonymous>"
                // but we have a user-provided "displayName"
                // splice it in to make the stack more readable.


                if (fn.displayName && _frame.includes('<anonymous>')) {
                  _frame = _frame.replace('<anonymous>', fn.displayName);
                }

                {
                  if (typeof fn === 'function') {
                    componentFrameCache.set(fn, _frame);
                  }
                } // Return the line we found.


                return _frame;
              }
            } while (s >= 1 && c >= 0);
          }

          break;
        }
      }
    }
  } finally {
    reentry = false;

    {
      ReactCurrentDispatcher.current = previousDispatcher;
      reenableLogs();
    }

    Error.prepareStackTrace = previousPrepareStackTrace;
  } // Fallback to just using the name if we couldn't make it throw.


  var name = fn ? fn.displayName || fn.name : '';
  var syntheticFrame = name ? describeBuiltInComponentFrame(name) : '';

  {
    if (typeof fn === 'function') {
      componentFrameCache.set(fn, syntheticFrame);
    }
  }

  return syntheticFrame;
}
function describeFunctionComponentFrame(fn, source, ownerFn) {
  {
    return describeNativeComponentFrame(fn, false);
  }
}

function shouldConstruct(Component) {
  var prototype = Component.prototype;
  return !!(prototype && prototype.isReactComponent);
}

function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {

  if (type == null) {
    return '';
  }

  if (typeof type === 'function') {
    {
      return describeNativeComponentFrame(type, shouldConstruct(type));
    }
  }

  if (typeof type === 'string') {
    return describeBuiltInComponentFrame(type);
  }

  switch (type) {
    case REACT_SUSPENSE_TYPE:
      return describeBuiltInComponentFrame('Suspense');

    case REACT_SUSPENSE_LIST_TYPE:
      return describeBuiltInComponentFrame('SuspenseList');
  }

  if (typeof type === 'object') {
    switch (type.$$typeof) {
      case REACT_FORWARD_REF_TYPE:
        return describeFunctionComponentFrame(type.render);

      case REACT_MEMO_TYPE:
        // Memo may contain any component type so we recursively resolve it.
        return describeUnknownElementTypeFrameInDEV(type.type, source, ownerFn);

      case REACT_LAZY_TYPE:
        {
          var lazyComponent = type;
          var payload = lazyComponent._payload;
          var init = lazyComponent._init;

          try {
            // Lazy may contain any component type so we recursively resolve it.
            return describeUnknownElementTypeFrameInDEV(init(payload), source, ownerFn);
          } catch (x) {}
        }
    }
  }

  return '';
}

var hasOwnProperty = Object.prototype.hasOwnProperty;

var loggedTypeFailures = {};
var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;

function setCurrentlyValidatingElement(element) {
  {
    if (element) {
      var owner = element._owner;
      var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
      ReactDebugCurrentFrame.setExtraStackFrame(stack);
    } else {
      ReactDebugCurrentFrame.setExtraStackFrame(null);
    }
  }
}

function checkPropTypes(typeSpecs, values, location, componentName, element) {
  {
    // $FlowFixMe This is okay but Flow doesn't know it.
    var has = Function.call.bind(hasOwnProperty);

    for (var typeSpecName in typeSpecs) {
      if (has(typeSpecs, typeSpecName)) {
        var error$1 = void 0; // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.

        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            // eslint-disable-next-line react-internal/prod-error-codes
            var err = Error((componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' + 'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.' + 'This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.');
            err.name = 'Invariant Violation';
            throw err;
          }

          error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED');
        } catch (ex) {
          error$1 = ex;
        }

        if (error$1 && !(error$1 instanceof Error)) {
          setCurrentlyValidatingElement(element);

          error('%s: type specification of %s' + ' `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error$1);

          setCurrentlyValidatingElement(null);
        }

        if (error$1 instanceof Error && !(error$1.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error$1.message] = true;
          setCurrentlyValidatingElement(element);

          error('Failed %s type: %s', location, error$1.message);

          setCurrentlyValidatingElement(null);
        }
      }
    }
  }
}

var isArrayImpl = Array.isArray; // eslint-disable-next-line no-redeclare

function isArray(a) {
  return isArrayImpl(a);
}

/*
 * The `'' + value` pattern (used in in perf-sensitive code) throws for Symbol
 * and Temporal.* types. See https://github.com/facebook/react/pull/22064.
 *
 * The functions in this module will throw an easier-to-understand,
 * easier-to-debug exception with a clear errors message message explaining the
 * problem. (Instead of a confusing exception thrown inside the implementation
 * of the `value` object).
 */
// $FlowFixMe only called in DEV, so void return is not possible.
function typeName(value) {
  {
    // toStringTag is needed for namespaced types like Temporal.Instant
    var hasToStringTag = typeof Symbol === 'function' && Symbol.toStringTag;
    var type = hasToStringTag && value[Symbol.toStringTag] || value.constructor.name || 'Object';
    return type;
  }
} // $FlowFixMe only called in DEV, so void return is not possible.


function willCoercionThrow(value) {
  {
    try {
      testStringCoercion(value);
      return false;
    } catch (e) {
      return true;
    }
  }
}

function testStringCoercion(value) {
  // If you ended up here by following an exception call stack, here's what's
  // happened: you supplied an object or symbol value to React (as a prop, key,
  // DOM attribute, CSS property, string ref, etc.) and when React tried to
  // coerce it to a string using `'' + value`, an exception was thrown.
  //
  // The most common types that will cause this exception are `Symbol` instances
  // and Temporal objects like `Temporal.Instant`. But any object that has a
  // `valueOf` or `[Symbol.toPrimitive]` method that throws will also cause this
  // exception. (Library authors do this to prevent users from using built-in
  // numeric operators like `+` or comparison operators like `>=` because custom
  // methods are needed to perform accurate arithmetic or comparison.)
  //
  // To fix the problem, coerce this object or symbol value to a string before
  // passing it to React. The most reliable way is usually `String(value)`.
  //
  // To find which value is throwing, check the browser or debugger console.
  // Before this exception was thrown, there should be `console.error` output
  // that shows the type (Symbol, Temporal.PlainDate, etc.) that caused the
  // problem and how that type was used: key, atrribute, input value prop, etc.
  // In most cases, this console output also shows the component and its
  // ancestor components where the exception happened.
  //
  // eslint-disable-next-line react-internal/safe-string-coercion
  return '' + value;
}
function checkKeyStringCoercion(value) {
  {
    if (willCoercionThrow(value)) {
      error('The provided key is an unsupported type %s.' + ' This value must be coerced to a string before before using it here.', typeName(value));

      return testStringCoercion(value); // throw (to help callers find troubleshooting comments)
    }
  }
}

var ReactCurrentOwner = ReactSharedInternals.ReactCurrentOwner;
var RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true
};
var specialPropKeyWarningShown;
var specialPropRefWarningShown;
var didWarnAboutStringRefs;

{
  didWarnAboutStringRefs = {};
}

function hasValidRef(config) {
  {
    if (hasOwnProperty.call(config, 'ref')) {
      var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;

      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }

  return config.ref !== undefined;
}

function hasValidKey(config) {
  {
    if (hasOwnProperty.call(config, 'key')) {
      var getter = Object.getOwnPropertyDescriptor(config, 'key').get;

      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }

  return config.key !== undefined;
}

function warnIfStringRefCannotBeAutoConverted(config, self) {
  {
    if (typeof config.ref === 'string' && ReactCurrentOwner.current && self && ReactCurrentOwner.current.stateNode !== self) {
      var componentName = getComponentNameFromType(ReactCurrentOwner.current.type);

      if (!didWarnAboutStringRefs[componentName]) {
        error('Component "%s" contains the string ref "%s". ' + 'Support for string refs will be removed in a future major release. ' + 'This case cannot be automatically converted to an arrow function. ' + 'We ask you to manually fix this case by using useRef() or createRef() instead. ' + 'Learn more about using refs safely here: ' + 'https://reactjs.org/link/strict-mode-string-ref', getComponentNameFromType(ReactCurrentOwner.current.type), config.ref);

        didWarnAboutStringRefs[componentName] = true;
      }
    }
  }
}

function defineKeyPropWarningGetter(props, displayName) {
  {
    var warnAboutAccessingKey = function () {
      if (!specialPropKeyWarningShown) {
        specialPropKeyWarningShown = true;

        error('%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://reactjs.org/link/special-props)', displayName);
      }
    };

    warnAboutAccessingKey.isReactWarning = true;
    Object.defineProperty(props, 'key', {
      get: warnAboutAccessingKey,
      configurable: true
    });
  }
}

function defineRefPropWarningGetter(props, displayName) {
  {
    var warnAboutAccessingRef = function () {
      if (!specialPropRefWarningShown) {
        specialPropRefWarningShown = true;

        error('%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://reactjs.org/link/special-props)', displayName);
      }
    };

    warnAboutAccessingRef.isReactWarning = true;
    Object.defineProperty(props, 'ref', {
      get: warnAboutAccessingRef,
      configurable: true
    });
  }
}
/**
 * Factory method to create a new React element. This no longer adheres to
 * the class pattern, so do not use new to call it. Also, instanceof check
 * will not work. Instead test $$typeof field against Symbol.for('react.element') to check
 * if something is a React Element.
 *
 * @param {*} type
 * @param {*} props
 * @param {*} key
 * @param {string|object} ref
 * @param {*} owner
 * @param {*} self A *temporary* helper to detect places where `this` is
 * different from the `owner` when React.createElement is called, so that we
 * can warn. We want to get rid of owner and replace string `ref`s with arrow
 * functions, and as long as `this` and owner are the same, there will be no
 * change in behavior.
 * @param {*} source An annotation object (added by a transpiler or otherwise)
 * indicating filename, line number, and/or other information.
 * @internal
 */


var ReactElement = function (type, key, ref, self, source, owner, props) {
  var element = {
    // This tag allows us to uniquely identify this as a React Element
    $$typeof: REACT_ELEMENT_TYPE,
    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,
    // Record the component responsible for creating this element.
    _owner: owner
  };

  {
    // The validation flag is currently mutative. We put it on
    // an external backing store so that we can freeze the whole object.
    // This can be replaced with a WeakMap once they are implemented in
    // commonly used development environments.
    element._store = {}; // To make comparing ReactElements easier for testing purposes, we make
    // the validation flag non-enumerable (where possible, which should
    // include every environment we run tests in), so the test framework
    // ignores it.

    Object.defineProperty(element._store, 'validated', {
      configurable: false,
      enumerable: false,
      writable: true,
      value: false
    }); // self and source are DEV only properties.

    Object.defineProperty(element, '_self', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: self
    }); // Two elements created in two different places should be considered
    // equal for testing purposes and therefore we hide it from enumeration.

    Object.defineProperty(element, '_source', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: source
    });

    if (Object.freeze) {
      Object.freeze(element.props);
      Object.freeze(element);
    }
  }

  return element;
};
/**
 * https://github.com/reactjs/rfcs/pull/107
 * @param {*} type
 * @param {object} props
 * @param {string} key
 */

function jsxDEV(type, config, maybeKey, source, self) {
  {
    var propName; // Reserved names are extracted

    var props = {};
    var key = null;
    var ref = null; // Currently, key can be spread in as a prop. This causes a potential
    // issue if key is also explicitly declared (ie. <div {...props} key="Hi" />
    // or <div key="Hi" {...props} /> ). We want to deprecate key spread,
    // but as an intermediary step, we will use jsxDEV for everything except
    // <div {...props} key="Hi" />, because we aren't currently able to tell if
    // key is explicitly declared to be undefined or not.

    if (maybeKey !== undefined) {
      {
        checkKeyStringCoercion(maybeKey);
      }

      key = '' + maybeKey;
    }

    if (hasValidKey(config)) {
      {
        checkKeyStringCoercion(config.key);
      }

      key = '' + config.key;
    }

    if (hasValidRef(config)) {
      ref = config.ref;
      warnIfStringRefCannotBeAutoConverted(config, self);
    } // Remaining properties are added to a new props object


    for (propName in config) {
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName];
      }
    } // Resolve default props


    if (type && type.defaultProps) {
      var defaultProps = type.defaultProps;

      for (propName in defaultProps) {
        if (props[propName] === undefined) {
          props[propName] = defaultProps[propName];
        }
      }
    }

    if (key || ref) {
      var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;

      if (key) {
        defineKeyPropWarningGetter(props, displayName);
      }

      if (ref) {
        defineRefPropWarningGetter(props, displayName);
      }
    }

    return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
  }
}

var ReactCurrentOwner$1 = ReactSharedInternals.ReactCurrentOwner;
var ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;

function setCurrentlyValidatingElement$1(element) {
  {
    if (element) {
      var owner = element._owner;
      var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
      ReactDebugCurrentFrame$1.setExtraStackFrame(stack);
    } else {
      ReactDebugCurrentFrame$1.setExtraStackFrame(null);
    }
  }
}

var propTypesMisspellWarningShown;

{
  propTypesMisspellWarningShown = false;
}
/**
 * Verifies the object is a ReactElement.
 * See https://reactjs.org/docs/react-api.html#isvalidelement
 * @param {?object} object
 * @return {boolean} True if `object` is a ReactElement.
 * @final
 */


function isValidElement(object) {
  {
    return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
  }
}

function getDeclarationErrorAddendum() {
  {
    if (ReactCurrentOwner$1.current) {
      var name = getComponentNameFromType(ReactCurrentOwner$1.current.type);

      if (name) {
        return '\n\nCheck the render method of `' + name + '`.';
      }
    }

    return '';
  }
}

function getSourceInfoErrorAddendum(source) {
  {
    if (source !== undefined) {
      var fileName = source.fileName.replace(/^.*[\\\/]/, '');
      var lineNumber = source.lineNumber;
      return '\n\nCheck your code at ' + fileName + ':' + lineNumber + '.';
    }

    return '';
  }
}
/**
 * Warn if there's no key explicitly set on dynamic arrays of children or
 * object keys are not valid. This allows us to keep track of children between
 * updates.
 */


var ownerHasKeyUseWarning = {};

function getCurrentComponentErrorInfo(parentType) {
  {
    var info = getDeclarationErrorAddendum();

    if (!info) {
      var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;

      if (parentName) {
        info = "\n\nCheck the top-level render call using <" + parentName + ">.";
      }
    }

    return info;
  }
}
/**
 * Warn if the element doesn't have an explicit key assigned to it.
 * This element is in an array. The array could grow and shrink or be
 * reordered. All children that haven't already been validated are required to
 * have a "key" property assigned to it. Error statuses are cached so a warning
 * will only be shown once.
 *
 * @internal
 * @param {ReactElement} element Element that requires a key.
 * @param {*} parentType element's parent's type.
 */


function validateExplicitKey(element, parentType) {
  {
    if (!element._store || element._store.validated || element.key != null) {
      return;
    }

    element._store.validated = true;
    var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);

    if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
      return;
    }

    ownerHasKeyUseWarning[currentComponentErrorInfo] = true; // Usually the current owner is the offender, but if it accepts children as a
    // property, it may be the creator of the child that's responsible for
    // assigning it a key.

    var childOwner = '';

    if (element && element._owner && element._owner !== ReactCurrentOwner$1.current) {
      // Give the component that originally created this child.
      childOwner = " It was passed a child from " + getComponentNameFromType(element._owner.type) + ".";
    }

    setCurrentlyValidatingElement$1(element);

    error('Each child in a list should have a unique "key" prop.' + '%s%s See https://reactjs.org/link/warning-keys for more information.', currentComponentErrorInfo, childOwner);

    setCurrentlyValidatingElement$1(null);
  }
}
/**
 * Ensure that every element either is passed in a static location, in an
 * array with an explicit keys property defined, or in an object literal
 * with valid key property.
 *
 * @internal
 * @param {ReactNode} node Statically passed child of any type.
 * @param {*} parentType node's parent's type.
 */


function validateChildKeys(node, parentType) {
  {
    if (typeof node !== 'object') {
      return;
    }

    if (isArray(node)) {
      for (var i = 0; i < node.length; i++) {
        var child = node[i];

        if (isValidElement(child)) {
          validateExplicitKey(child, parentType);
        }
      }
    } else if (isValidElement(node)) {
      // This element was passed in a valid location.
      if (node._store) {
        node._store.validated = true;
      }
    } else if (node) {
      var iteratorFn = getIteratorFn(node);

      if (typeof iteratorFn === 'function') {
        // Entry iterators used to provide implicit keys,
        // but now we print a separate warning for them later.
        if (iteratorFn !== node.entries) {
          var iterator = iteratorFn.call(node);
          var step;

          while (!(step = iterator.next()).done) {
            if (isValidElement(step.value)) {
              validateExplicitKey(step.value, parentType);
            }
          }
        }
      }
    }
  }
}
/**
 * Given an element, validate that its props follow the propTypes definition,
 * provided by the type.
 *
 * @param {ReactElement} element
 */


function validatePropTypes(element) {
  {
    var type = element.type;

    if (type === null || type === undefined || typeof type === 'string') {
      return;
    }

    var propTypes;

    if (typeof type === 'function') {
      propTypes = type.propTypes;
    } else if (typeof type === 'object' && (type.$$typeof === REACT_FORWARD_REF_TYPE || // Note: Memo only checks outer props here.
    // Inner props are checked in the reconciler.
    type.$$typeof === REACT_MEMO_TYPE)) {
      propTypes = type.propTypes;
    } else {
      return;
    }

    if (propTypes) {
      // Intentionally inside to avoid triggering lazy initializers:
      var name = getComponentNameFromType(type);
      checkPropTypes(propTypes, element.props, 'prop', name, element);
    } else if (type.PropTypes !== undefined && !propTypesMisspellWarningShown) {
      propTypesMisspellWarningShown = true; // Intentionally inside to avoid triggering lazy initializers:

      var _name = getComponentNameFromType(type);

      error('Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?', _name || 'Unknown');
    }

    if (typeof type.getDefaultProps === 'function' && !type.getDefaultProps.isReactClassApproved) {
      error('getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.');
    }
  }
}
/**
 * Given a fragment, validate that it can only be provided with fragment props
 * @param {ReactElement} fragment
 */


function validateFragmentProps(fragment) {
  {
    var keys = Object.keys(fragment.props);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];

      if (key !== 'children' && key !== 'key') {
        setCurrentlyValidatingElement$1(fragment);

        error('Invalid prop `%s` supplied to `React.Fragment`. ' + 'React.Fragment can only have `key` and `children` props.', key);

        setCurrentlyValidatingElement$1(null);
        break;
      }
    }

    if (fragment.ref !== null) {
      setCurrentlyValidatingElement$1(fragment);

      error('Invalid attribute `ref` supplied to `React.Fragment`.');

      setCurrentlyValidatingElement$1(null);
    }
  }
}

var didWarnAboutKeySpread = {};
function jsxWithValidation(type, props, key, isStaticChildren, source, self) {
  {
    var validType = isValidElementType(type); // We warn in this case but don't throw. We expect the element creation to
    // succeed and there will likely be errors in render.

    if (!validType) {
      var info = '';

      if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
        info += ' You likely forgot to export your component from the file ' + "it's defined in, or you might have mixed up default and named imports.";
      }

      var sourceInfo = getSourceInfoErrorAddendum(source);

      if (sourceInfo) {
        info += sourceInfo;
      } else {
        info += getDeclarationErrorAddendum();
      }

      var typeString;

      if (type === null) {
        typeString = 'null';
      } else if (isArray(type)) {
        typeString = 'array';
      } else if (type !== undefined && type.$$typeof === REACT_ELEMENT_TYPE) {
        typeString = "<" + (getComponentNameFromType(type.type) || 'Unknown') + " />";
        info = ' Did you accidentally export a JSX literal instead of a component?';
      } else {
        typeString = typeof type;
      }

      error('React.jsx: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', typeString, info);
    }

    var element = jsxDEV(type, props, key, source, self); // The result can be nullish if a mock or a custom function is used.
    // TODO: Drop this when these are no longer allowed as the type argument.

    if (element == null) {
      return element;
    } // Skip key warning if the type isn't valid since our key validation logic
    // doesn't expect a non-string/function type and can throw confusing errors.
    // We don't want exception behavior to differ between dev and prod.
    // (Rendering will throw with a helpful message and as soon as the type is
    // fixed, the key warnings will appear.)


    if (validType) {
      var children = props.children;

      if (children !== undefined) {
        if (isStaticChildren) {
          if (isArray(children)) {
            for (var i = 0; i < children.length; i++) {
              validateChildKeys(children[i], type);
            }

            if (Object.freeze) {
              Object.freeze(children);
            }
          } else {
            error('React.jsx: Static children should always be an array. ' + 'You are likely explicitly calling React.jsxs or React.jsxDEV. ' + 'Use the Babel transform instead.');
          }
        } else {
          validateChildKeys(children, type);
        }
      }
    }

    {
      if (hasOwnProperty.call(props, 'key')) {
        var componentName = getComponentNameFromType(type);
        var keys = Object.keys(props).filter(function (k) {
          return k !== 'key';
        });
        var beforeExample = keys.length > 0 ? '{key: someKey, ' + keys.join(': ..., ') + ': ...}' : '{key: someKey}';

        if (!didWarnAboutKeySpread[componentName + beforeExample]) {
          var afterExample = keys.length > 0 ? '{' + keys.join(': ..., ') + ': ...}' : '{}';

          error('A props object containing a "key" prop is being spread into JSX:\n' + '  let props = %s;\n' + '  <%s {...props} />\n' + 'React keys must be passed directly to JSX without using spread:\n' + '  let props = %s;\n' + '  <%s key={someKey} {...props} />', beforeExample, componentName, afterExample, componentName);

          didWarnAboutKeySpread[componentName + beforeExample] = true;
        }
      }
    }

    if (type === REACT_FRAGMENT_TYPE) {
      validateFragmentProps(element);
    } else {
      validatePropTypes(element);
    }

    return element;
  }
} // These two functions exist to still get child warnings in dev

var jsxDEV$1 =  jsxWithValidation ;

exports.Fragment = REACT_FRAGMENT_TYPE;
exports.jsxDEV = jsxDEV$1;
  })();
}


/***/ }),

/***/ "./node_modules/react/jsx-dev-runtime.js":
/*!***********************************************!*\
  !*** ./node_modules/react/jsx-dev-runtime.js ***!
  \***********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {



if (false) // removed by dead control flow
{} else {
  module.exports = __webpack_require__(/*! ./cjs/react-jsx-dev-runtime.development.js */ "./node_modules/react/cjs/react-jsx-dev-runtime.development.js");
}


/***/ }),

/***/ "qrcodejs":
/*!*************************!*\
  !*** external "QRCode" ***!
  \*************************/
/***/ (function(module) {

module.exports = QRCode;

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ (function(module) {

module.exports = React;

/***/ }),

/***/ "react-dom":
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
/***/ (function(module) {

module.exports = ReactDOM;

/***/ }),

/***/ "react-intl":
/*!****************************!*\
  !*** external "ReactIntl" ***!
  \****************************/
/***/ (function(module) {

module.exports = ReactIntl;

/***/ }),

/***/ "tinode-sdk":
/*!*************************!*\
  !*** external "tinode" ***!
  \*************************/
/***/ (function(module) {

module.exports = tinode;

/***/ }),

/***/ "./node_modules/@firebase/app/dist/esm/index.esm.js":
/*!**********************************************************!*\
  !*** ./node_modules/@firebase/app/dist/esm/index.esm.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FirebaseError: function() { return /* reexport safe */ _firebase_util__WEBPACK_IMPORTED_MODULE_2__.FirebaseError; },
/* harmony export */   SDK_VERSION: function() { return /* binding */ SDK_VERSION; },
/* harmony export */   _DEFAULT_ENTRY_NAME: function() { return /* binding */ DEFAULT_ENTRY_NAME; },
/* harmony export */   _addComponent: function() { return /* binding */ _addComponent; },
/* harmony export */   _addOrOverwriteComponent: function() { return /* binding */ _addOrOverwriteComponent; },
/* harmony export */   _apps: function() { return /* binding */ _apps; },
/* harmony export */   _clearComponents: function() { return /* binding */ _clearComponents; },
/* harmony export */   _components: function() { return /* binding */ _components; },
/* harmony export */   _getProvider: function() { return /* binding */ _getProvider; },
/* harmony export */   _isFirebaseApp: function() { return /* binding */ _isFirebaseApp; },
/* harmony export */   _isFirebaseServerApp: function() { return /* binding */ _isFirebaseServerApp; },
/* harmony export */   _isFirebaseServerAppSettings: function() { return /* binding */ _isFirebaseServerAppSettings; },
/* harmony export */   _registerComponent: function() { return /* binding */ _registerComponent; },
/* harmony export */   _removeServiceInstance: function() { return /* binding */ _removeServiceInstance; },
/* harmony export */   _serverApps: function() { return /* binding */ _serverApps; },
/* harmony export */   deleteApp: function() { return /* binding */ deleteApp; },
/* harmony export */   getApp: function() { return /* binding */ getApp; },
/* harmony export */   getApps: function() { return /* binding */ getApps; },
/* harmony export */   initializeApp: function() { return /* binding */ initializeApp; },
/* harmony export */   initializeServerApp: function() { return /* binding */ initializeServerApp; },
/* harmony export */   onLog: function() { return /* binding */ onLog; },
/* harmony export */   registerVersion: function() { return /* binding */ registerVersion; },
/* harmony export */   setLogLevel: function() { return /* binding */ setLogLevel; }
/* harmony export */ });
/* harmony import */ var _firebase_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @firebase/component */ "./node_modules/@firebase/component/dist/esm/index.esm.js");
/* harmony import */ var _firebase_logger__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @firebase/logger */ "./node_modules/@firebase/logger/dist/esm/index.esm.js");
/* harmony import */ var _firebase_util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @firebase/util */ "./node_modules/@firebase/util/dist/index.esm.js");
/* harmony import */ var idb__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! idb */ "./node_modules/idb/build/index.js");






/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class PlatformLoggerServiceImpl {
    constructor(container) {
        this.container = container;
    }
    // In initial implementation, this will be called by installations on
    // auth token refresh, and installations will send this string.
    getPlatformInfoString() {
        const providers = this.container.getProviders();
        // Loop through providers and get library/version pairs from any that are
        // version components.
        return providers
            .map(provider => {
            if (isVersionServiceProvider(provider)) {
                const service = provider.getImmediate();
                return `${service.library}/${service.version}`;
            }
            else {
                return null;
            }
        })
            .filter(logString => logString)
            .join(' ');
    }
}
/**
 *
 * @param provider check if this provider provides a VersionService
 *
 * NOTE: Using Provider<'app-version'> is a hack to indicate that the provider
 * provides VersionService. The provider is not necessarily a 'app-version'
 * provider.
 */
function isVersionServiceProvider(provider) {
    const component = provider.getComponent();
    return component?.type === "VERSION" /* ComponentType.VERSION */;
}

const name$q = "@firebase/app";
const version$1 = "0.15.0";

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const logger = new _firebase_logger__WEBPACK_IMPORTED_MODULE_1__.Logger('@firebase/app');

const name$p = "@firebase/app-compat";

const name$o = "@firebase/analytics-compat";

const name$n = "@firebase/analytics";

const name$m = "@firebase/app-check-compat";

const name$l = "@firebase/app-check";

const name$k = "@firebase/auth";

const name$j = "@firebase/auth-compat";

const name$i = "@firebase/database";

const name$h = "@firebase/data-connect";

const name$g = "@firebase/database-compat";

const name$f = "@firebase/functions";

const name$e = "@firebase/functions-compat";

const name$d = "@firebase/installations";

const name$c = "@firebase/installations-compat";

const name$b = "@firebase/messaging";

const name$a = "@firebase/messaging-compat";

const name$9 = "@firebase/performance";

const name$8 = "@firebase/performance-compat";

const name$7 = "@firebase/remote-config";

const name$6 = "@firebase/remote-config-compat";

const name$5 = "@firebase/storage";

const name$4 = "@firebase/storage-compat";

const name$3 = "@firebase/firestore";

const name$2 = "@firebase/ai";

const name$1 = "@firebase/firestore-compat";

const name = "firebase";
const version = "12.15.0";

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * The default app name
 *
 * @internal
 */
const DEFAULT_ENTRY_NAME = '[DEFAULT]';
const PLATFORM_LOG_STRING = {
    [name$q]: 'fire-core',
    [name$p]: 'fire-core-compat',
    [name$n]: 'fire-analytics',
    [name$o]: 'fire-analytics-compat',
    [name$l]: 'fire-app-check',
    [name$m]: 'fire-app-check-compat',
    [name$k]: 'fire-auth',
    [name$j]: 'fire-auth-compat',
    [name$i]: 'fire-rtdb',
    [name$h]: 'fire-data-connect',
    [name$g]: 'fire-rtdb-compat',
    [name$f]: 'fire-fn',
    [name$e]: 'fire-fn-compat',
    [name$d]: 'fire-iid',
    [name$c]: 'fire-iid-compat',
    [name$b]: 'fire-fcm',
    [name$a]: 'fire-fcm-compat',
    [name$9]: 'fire-perf',
    [name$8]: 'fire-perf-compat',
    [name$7]: 'fire-rc',
    [name$6]: 'fire-rc-compat',
    [name$5]: 'fire-gcs',
    [name$4]: 'fire-gcs-compat',
    [name$3]: 'fire-fst',
    [name$1]: 'fire-fst-compat',
    [name$2]: 'fire-vertex',
    'fire-js': 'fire-js', // Platform identifier for JS SDK.
    [name]: 'fire-js-all'
};

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @internal
 */
const _apps = new Map();
/**
 * @internal
 */
const _serverApps = new Map();
/**
 * Registered components.
 *
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _components = new Map();
/**
 * @param component - the component being added to this app's container
 *
 * @internal
 */
function _addComponent(app, component) {
    try {
        app.container.addComponent(component);
    }
    catch (e) {
        logger.debug(`Component ${component.name} failed to register with FirebaseApp ${app.name}`, e);
    }
}
/**
 *
 * @internal
 */
function _addOrOverwriteComponent(app, component) {
    app.container.addOrOverwriteComponent(component);
}
/**
 *
 * @param component - the component to register
 * @returns whether or not the component is registered successfully
 *
 * @internal
 */
function _registerComponent(component) {
    const componentName = component.name;
    if (_components.has(componentName)) {
        logger.debug(`There were multiple attempts to register component ${componentName}.`);
        return false;
    }
    _components.set(componentName, component);
    // add the component to existing app instances
    for (const app of _apps.values()) {
        _addComponent(app, component);
    }
    for (const serverApp of _serverApps.values()) {
        _addComponent(serverApp, component);
    }
    return true;
}
/**
 *
 * @param app - FirebaseApp instance
 * @param name - service name
 *
 * @returns the provider for the service with the matching name
 *
 * @internal
 */
function _getProvider(app, name) {
    const heartbeatController = app.container
        .getProvider('heartbeat')
        .getImmediate({ optional: true });
    if (heartbeatController) {
        void heartbeatController.triggerHeartbeat();
    }
    return app.container.getProvider(name);
}
/**
 *
 * @param app - FirebaseApp instance
 * @param name - service name
 * @param instanceIdentifier - service instance identifier in case the service supports multiple instances
 *
 * @internal
 */
function _removeServiceInstance(app, name, instanceIdentifier = DEFAULT_ENTRY_NAME) {
    _getProvider(app, name).clearInstance(instanceIdentifier);
}
/**
 *
 * @param obj - an object of type FirebaseApp, FirebaseOptions or FirebaseAppSettings.
 *
 * @returns true if the provide object is of type FirebaseApp.
 *
 * @internal
 */
function _isFirebaseApp(obj) {
    return obj.options !== undefined;
}
/**
 *
 * @param obj - an object of type FirebaseApp, FirebaseOptions or FirebaseAppSettings.
 *
 * @returns true if the provided object is of type FirebaseServerAppImpl.
 *
 * @internal
 */
function _isFirebaseServerAppSettings(obj) {
    if (_isFirebaseApp(obj)) {
        return false;
    }
    return ('authIdToken' in obj ||
        'appCheckToken' in obj ||
        'releaseOnDeref' in obj ||
        'automaticDataCollectionEnabled' in obj);
}
/**
 *
 * @param obj - an object of type FirebaseApp.
 *
 * @returns true if the provided object is of type FirebaseServerAppImpl.
 *
 * @internal
 */
function _isFirebaseServerApp(obj) {
    if (obj === null || obj === undefined) {
        return false;
    }
    return obj.settings !== undefined;
}
/**
 * Test only
 *
 * @internal
 */
function _clearComponents() {
    _components.clear();
}

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const ERRORS = {
    ["no-app" /* AppError.NO_APP */]: "No Firebase App '{$appName}' has been created - " +
        'call initializeApp() first',
    ["bad-app-name" /* AppError.BAD_APP_NAME */]: "Illegal App name: '{$appName}'",
    ["duplicate-app" /* AppError.DUPLICATE_APP */]: "Firebase App named '{$appName}' already exists with different options or config",
    ["app-deleted" /* AppError.APP_DELETED */]: "Firebase App named '{$appName}' already deleted",
    ["server-app-deleted" /* AppError.SERVER_APP_DELETED */]: 'Firebase Server App has been deleted',
    ["no-options" /* AppError.NO_OPTIONS */]: 'Need to provide options, when not being deployed to hosting via source.',
    ["invalid-app-argument" /* AppError.INVALID_APP_ARGUMENT */]: 'firebase.{$appName}() takes either no argument or a ' +
        'Firebase App instance.',
    ["invalid-log-argument" /* AppError.INVALID_LOG_ARGUMENT */]: 'First argument to `onLog` must be null or a function.',
    ["idb-open" /* AppError.IDB_OPEN */]: 'Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.',
    ["idb-get" /* AppError.IDB_GET */]: 'Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.',
    ["idb-set" /* AppError.IDB_WRITE */]: 'Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.',
    ["idb-delete" /* AppError.IDB_DELETE */]: 'Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.',
    ["finalization-registry-not-supported" /* AppError.FINALIZATION_REGISTRY_NOT_SUPPORTED */]: 'FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.',
    ["invalid-server-app-environment" /* AppError.INVALID_SERVER_APP_ENVIRONMENT */]: 'FirebaseServerApp is not for use in browser environments.'
};
const ERROR_FACTORY = new _firebase_util__WEBPACK_IMPORTED_MODULE_2__.ErrorFactory('app', 'Firebase', ERRORS);

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class FirebaseAppImpl {
    constructor(options, config, container) {
        this._isDeleted = false;
        this._options = { ...options };
        this._config = { ...config };
        this._name = config.name;
        this._automaticDataCollectionEnabled =
            config.automaticDataCollectionEnabled;
        this._container = container;
        this.container.addComponent(new _firebase_component__WEBPACK_IMPORTED_MODULE_0__.Component('app', () => this, "PUBLIC" /* ComponentType.PUBLIC */));
    }
    get automaticDataCollectionEnabled() {
        this.checkDestroyed();
        return this._automaticDataCollectionEnabled;
    }
    set automaticDataCollectionEnabled(val) {
        this.checkDestroyed();
        this._automaticDataCollectionEnabled = val;
    }
    get name() {
        this.checkDestroyed();
        return this._name;
    }
    get options() {
        this.checkDestroyed();
        return this._options;
    }
    get config() {
        this.checkDestroyed();
        return this._config;
    }
    get container() {
        return this._container;
    }
    get isDeleted() {
        return this._isDeleted;
    }
    set isDeleted(val) {
        this._isDeleted = val;
    }
    /**
     * This function will throw an Error if the App has already been deleted -
     * use before performing API actions on the App.
     */
    checkDestroyed() {
        if (this.isDeleted) {
            throw ERROR_FACTORY.create("app-deleted" /* AppError.APP_DELETED */, { appName: this._name });
        }
    }
}

/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// Parse the token and check to see if the `exp` claim is in the future.
// Reports an error to the console if the token or claim could not be parsed, or if `exp` is in
// the past.
function validateTokenTTL(base64Token, tokenName) {
    const secondPart = (0,_firebase_util__WEBPACK_IMPORTED_MODULE_2__.base64Decode)(base64Token.split('.')[1]);
    if (secondPart === null) {
        console.error(`FirebaseServerApp ${tokenName} is invalid: second part could not be parsed.`);
        return;
    }
    const expClaim = JSON.parse(secondPart).exp;
    if (expClaim === undefined) {
        console.error(`FirebaseServerApp ${tokenName} is invalid: expiration claim could not be parsed`);
        return;
    }
    const exp = JSON.parse(secondPart).exp * 1000;
    const now = new Date().getTime();
    const diff = exp - now;
    if (diff <= 0) {
        console.error(`FirebaseServerApp ${tokenName} is invalid: the token has expired.`);
    }
}
class FirebaseServerAppImpl extends FirebaseAppImpl {
    constructor(options, serverConfig, name, container) {
        // Build configuration parameters for the FirebaseAppImpl base class.
        const automaticDataCollectionEnabled = serverConfig.automaticDataCollectionEnabled !== undefined
            ? serverConfig.automaticDataCollectionEnabled
            : true;
        // Create the FirebaseAppSettings object for the FirebaseAppImp constructor.
        const config = {
            name,
            automaticDataCollectionEnabled
        };
        if (options.apiKey !== undefined) {
            // Construct the parent FirebaseAppImp object.
            super(options, config, container);
        }
        else {
            const appImpl = options;
            super(appImpl.options, config, container);
        }
        // Now construct the data for the FirebaseServerAppImpl.
        this._serverConfig = {
            automaticDataCollectionEnabled,
            ...serverConfig
        };
        // Ensure that the current time is within the `authIdtoken` window of validity.
        if (this._serverConfig.authIdToken) {
            validateTokenTTL(this._serverConfig.authIdToken, 'authIdToken');
        }
        // Ensure that the current time is within the `appCheckToken` window of validity.
        if (this._serverConfig.appCheckToken) {
            validateTokenTTL(this._serverConfig.appCheckToken, 'appCheckToken');
        }
        this._finalizationRegistry = null;
        if (typeof FinalizationRegistry !== 'undefined') {
            this._finalizationRegistry = new FinalizationRegistry(() => {
                this.automaticCleanup();
            });
        }
        this._refCount = 0;
        this.incRefCount(this._serverConfig.releaseOnDeref);
        // Do not retain a hard reference to the dref object, otherwise the FinalizationRegistry
        // will never trigger.
        this._serverConfig.releaseOnDeref = undefined;
        serverConfig.releaseOnDeref = undefined;
        registerVersion(name$q, version$1, 'serverapp');
    }
    toJSON() {
        return undefined;
    }
    get refCount() {
        return this._refCount;
    }
    // Increment the reference count of this server app. If an object is provided, register it
    // with the finalization registry.
    incRefCount(obj) {
        if (this.isDeleted) {
            return;
        }
        this._refCount++;
        if (obj !== undefined && this._finalizationRegistry !== null) {
            this._finalizationRegistry.register(obj, this);
        }
    }
    // Decrement the reference count.
    decRefCount() {
        if (this.isDeleted) {
            return 0;
        }
        return --this._refCount;
    }
    // Invoked by the FinalizationRegistry callback to note that this app should go through its
    // reference counts and delete itself if no reference count remain. The coordinating logic that
    // handles this is in deleteApp(...).
    automaticCleanup() {
        void deleteApp(this);
    }
    get settings() {
        this.checkDestroyed();
        return this._serverConfig;
    }
    /**
     * This function will throw an Error if the App has already been deleted -
     * use before performing API actions on the App.
     */
    checkDestroyed() {
        if (this.isDeleted) {
            throw ERROR_FACTORY.create("server-app-deleted" /* AppError.SERVER_APP_DELETED */);
        }
    }
}

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * The current SDK version.
 *
 * @public
 */
const SDK_VERSION = version;
function initializeApp(_options, rawConfig = {}) {
    let options = _options;
    if (typeof rawConfig !== 'object') {
        const name = rawConfig;
        rawConfig = { name };
    }
    const config = {
        name: DEFAULT_ENTRY_NAME,
        automaticDataCollectionEnabled: true,
        ...rawConfig
    };
    const name = config.name;
    if (typeof name !== 'string' || !name) {
        throw ERROR_FACTORY.create("bad-app-name" /* AppError.BAD_APP_NAME */, {
            appName: String(name)
        });
    }
    options || (options = (0,_firebase_util__WEBPACK_IMPORTED_MODULE_2__.getDefaultAppConfig)());
    if (!options) {
        throw ERROR_FACTORY.create("no-options" /* AppError.NO_OPTIONS */);
    }
    const existingApp = _apps.get(name);
    if (existingApp) {
        // return the existing app if options and config deep equal the ones in the existing app.
        if ((0,_firebase_util__WEBPACK_IMPORTED_MODULE_2__.deepEqual)(options, existingApp.options) &&
            (0,_firebase_util__WEBPACK_IMPORTED_MODULE_2__.deepEqual)(config, existingApp.config)) {
            return existingApp;
        }
        else {
            throw ERROR_FACTORY.create("duplicate-app" /* AppError.DUPLICATE_APP */, { appName: name });
        }
    }
    const container = new _firebase_component__WEBPACK_IMPORTED_MODULE_0__.ComponentContainer(name);
    for (const component of _components.values()) {
        container.addComponent(component);
    }
    const newApp = new FirebaseAppImpl(options, config, container);
    _apps.set(name, newApp);
    return newApp;
}
function initializeServerApp(_options, _serverAppConfig = {}) {
    if ((0,_firebase_util__WEBPACK_IMPORTED_MODULE_2__.isBrowser)() && !(0,_firebase_util__WEBPACK_IMPORTED_MODULE_2__.isWebWorker)()) {
        // FirebaseServerApp isn't designed to be run in browsers.
        throw ERROR_FACTORY.create("invalid-server-app-environment" /* AppError.INVALID_SERVER_APP_ENVIRONMENT */);
    }
    let firebaseOptions;
    let serverAppSettings = _serverAppConfig || {};
    if (_options) {
        if (_isFirebaseApp(_options)) {
            firebaseOptions = _options.options;
        }
        else if (_isFirebaseServerAppSettings(_options)) {
            serverAppSettings = _options;
        }
        else {
            firebaseOptions = _options;
        }
    }
    if (serverAppSettings.automaticDataCollectionEnabled === undefined) {
        serverAppSettings.automaticDataCollectionEnabled = true;
    }
    firebaseOptions || (firebaseOptions = (0,_firebase_util__WEBPACK_IMPORTED_MODULE_2__.getDefaultAppConfig)());
    if (!firebaseOptions) {
        throw ERROR_FACTORY.create("no-options" /* AppError.NO_OPTIONS */);
    }
    // Build an app name based on a hash of the configuration options.
    const nameObj = {
        ...serverAppSettings,
        ...firebaseOptions
    };
    // However, Do not mangle the name based on releaseOnDeref, since it will vary between the
    // construction of FirebaseServerApp instances. For example, if the object is the request headers.
    if (nameObj.releaseOnDeref !== undefined) {
        delete nameObj.releaseOnDeref;
    }
    const hashCode = (s) => {
        return [...s].reduce((hash, c) => (Math.imul(31, hash) + c.charCodeAt(0)) | 0, 0);
    };
    if (serverAppSettings.releaseOnDeref !== undefined) {
        if (typeof FinalizationRegistry === 'undefined') {
            throw ERROR_FACTORY.create("finalization-registry-not-supported" /* AppError.FINALIZATION_REGISTRY_NOT_SUPPORTED */, {});
        }
    }
    const nameString = '' + hashCode(JSON.stringify(nameObj));
    const existingApp = _serverApps.get(nameString);
    if (existingApp) {
        existingApp.incRefCount(serverAppSettings.releaseOnDeref);
        return existingApp;
    }
    const container = new _firebase_component__WEBPACK_IMPORTED_MODULE_0__.ComponentContainer(nameString);
    for (const component of _components.values()) {
        container.addComponent(component);
    }
    const newApp = new FirebaseServerAppImpl(firebaseOptions, serverAppSettings, nameString, container);
    _serverApps.set(nameString, newApp);
    return newApp;
}
/**
 * Retrieves a {@link @firebase/app#FirebaseApp} instance.
 *
 * When called with no arguments, the default app is returned. When an app name
 * is provided, the app corresponding to that name is returned.
 *
 * An exception is thrown if the app being retrieved has not yet been
 * initialized.
 *
 * @example
 * ```javascript
 * // Return the default app
 * const app = getApp();
 * ```
 *
 * @example
 * ```javascript
 * // Return a named app
 * const otherApp = getApp("otherApp");
 * ```
 *
 * @param name - Optional name of the app to return. If no name is
 *   provided, the default is `"[DEFAULT]"`.
 *
 * @returns The app corresponding to the provided app name.
 *   If no app name is provided, the default app is returned.
 *
 * @public
 */
function getApp(name = DEFAULT_ENTRY_NAME) {
    const app = _apps.get(name);
    if (!app && name === DEFAULT_ENTRY_NAME && (0,_firebase_util__WEBPACK_IMPORTED_MODULE_2__.getDefaultAppConfig)()) {
        return initializeApp();
    }
    if (!app) {
        throw ERROR_FACTORY.create("no-app" /* AppError.NO_APP */, { appName: name });
    }
    return app;
}
/**
 * A (read-only) array of all initialized apps.
 * @public
 */
function getApps() {
    return Array.from(_apps.values());
}
/**
 * Renders this app unusable and frees the resources of all associated
 * services.
 *
 * @example
 * ```javascript
 * deleteApp(app)
 *   .then(function() {
 *     console.log("App deleted successfully");
 *   })
 *   .catch(function(error) {
 *     console.log("Error deleting app:", error);
 *   });
 * ```
 *
 * @public
 */
async function deleteApp(app) {
    let cleanupProviders = false;
    const name = app.name;
    if (_apps.has(name)) {
        cleanupProviders = true;
        _apps.delete(name);
    }
    else if (_serverApps.has(name)) {
        const firebaseServerApp = app;
        if (firebaseServerApp.decRefCount() <= 0) {
            _serverApps.delete(name);
            cleanupProviders = true;
        }
    }
    if (cleanupProviders) {
        await Promise.all(app.container
            .getProviders()
            .map(provider => provider.delete()));
        app.isDeleted = true;
    }
}
/**
 * Registers a library's name and version for platform logging purposes.
 * @param library - Name of 1p or 3p library (e.g. firestore, angularfire)
 * @param version - Current version of that library.
 * @param variant - Bundle variant, e.g., node, rn, etc.
 *
 * @public
 */
function registerVersion(libraryKeyOrName, version, variant) {
    // TODO: We can use this check to whitelist strings when/if we set up
    // a good whitelist system.
    let library = PLATFORM_LOG_STRING[libraryKeyOrName] ?? libraryKeyOrName;
    if (variant) {
        library += `-${variant}`;
    }
    const libraryMismatch = library.match(/\s|\//);
    const versionMismatch = version.match(/\s|\//);
    if (libraryMismatch || versionMismatch) {
        const warning = [
            `Unable to register library "${library}" with version "${version}":`
        ];
        if (libraryMismatch) {
            warning.push(`library name "${library}" contains illegal characters (whitespace or "/")`);
        }
        if (libraryMismatch && versionMismatch) {
            warning.push('and');
        }
        if (versionMismatch) {
            warning.push(`version name "${version}" contains illegal characters (whitespace or "/")`);
        }
        logger.warn(warning.join(' '));
        return;
    }
    _registerComponent(new _firebase_component__WEBPACK_IMPORTED_MODULE_0__.Component(`${library}-version`, () => ({ library, version }), "VERSION" /* ComponentType.VERSION */));
}
/**
 * Sets log handler for all Firebase SDKs.
 * @param logCallback - An optional custom log handler that executes user code whenever
 * the Firebase SDK makes a logging call.
 *
 * @public
 */
function onLog(logCallback, options) {
    if (logCallback !== null && typeof logCallback !== 'function') {
        throw ERROR_FACTORY.create("invalid-log-argument" /* AppError.INVALID_LOG_ARGUMENT */);
    }
    (0,_firebase_logger__WEBPACK_IMPORTED_MODULE_1__.setUserLogHandler)(logCallback, options);
}
/**
 * Sets log level for all Firebase SDKs.
 *
 * All of the log types above the current log level are captured (i.e. if
 * you set the log level to `info`, errors are logged, but `debug` and
 * `verbose` logs are not).
 *
 * @public
 */
function setLogLevel(logLevel) {
    (0,_firebase_logger__WEBPACK_IMPORTED_MODULE_1__.setLogLevel)(logLevel);
}

/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const DB_NAME = 'firebase-heartbeat-database';
const DB_VERSION = 1;
const STORE_NAME = 'firebase-heartbeat-store';
let dbPromise = null;
function getDbPromise() {
    if (!dbPromise) {
        dbPromise = (0,idb__WEBPACK_IMPORTED_MODULE_3__.openDB)(DB_NAME, DB_VERSION, {
            upgrade: (db, oldVersion) => {
                // We don't use 'break' in this switch statement, the fall-through
                // behavior is what we want, because if there are multiple versions between
                // the old version and the current version, we want ALL the migrations
                // that correspond to those versions to run, not only the last one.
                // eslint-disable-next-line default-case
                switch (oldVersion) {
                    case 0:
                        try {
                            db.createObjectStore(STORE_NAME);
                        }
                        catch (e) {
                            // Safari/iOS browsers throw occasional exceptions on
                            // db.createObjectStore() that may be a bug. Avoid blocking
                            // the rest of the app functionality.
                            console.warn(e);
                        }
                }
            }
        }).catch(e => {
            throw ERROR_FACTORY.create("idb-open" /* AppError.IDB_OPEN */, {
                originalErrorMessage: e.message
            });
        });
    }
    return dbPromise;
}
async function readHeartbeatsFromIndexedDB(app) {
    try {
        const db = await getDbPromise();
        const tx = db.transaction(STORE_NAME);
        const result = await tx.objectStore(STORE_NAME).get(computeKey(app));
        // We already have the value but tx.done can throw,
        // so we need to await it here to catch errors
        await tx.done;
        return result;
    }
    catch (e) {
        if (e instanceof _firebase_util__WEBPACK_IMPORTED_MODULE_2__.FirebaseError) {
            logger.warn(e.message);
        }
        else {
            const idbGetError = ERROR_FACTORY.create("idb-get" /* AppError.IDB_GET */, {
                originalErrorMessage: e?.message
            });
            logger.warn(idbGetError.message);
        }
    }
}
async function writeHeartbeatsToIndexedDB(app, heartbeatObject) {
    try {
        const db = await getDbPromise();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const objectStore = tx.objectStore(STORE_NAME);
        await objectStore.put(heartbeatObject, computeKey(app));
        await tx.done;
    }
    catch (e) {
        if (e instanceof _firebase_util__WEBPACK_IMPORTED_MODULE_2__.FirebaseError) {
            logger.warn(e.message);
        }
        else {
            const idbGetError = ERROR_FACTORY.create("idb-set" /* AppError.IDB_WRITE */, {
                originalErrorMessage: e?.message
            });
            logger.warn(idbGetError.message);
        }
    }
}
function computeKey(app) {
    return `${app.name}!${app.options.appId}`;
}

/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const MAX_HEADER_BYTES = 1024;
const MAX_NUM_STORED_HEARTBEATS = 30;
class HeartbeatServiceImpl {
    constructor(container) {
        this.container = container;
        /**
         * In-memory cache for heartbeats, used by getHeartbeatsHeader() to generate
         * the header string.
         * Stores one record per date. This will be consolidated into the standard
         * format of one record per user agent string before being sent as a header.
         * Populated from indexedDB when the controller is instantiated and should
         * be kept in sync with indexedDB.
         * Leave public for easier testing.
         */
        this._heartbeatsCache = null;
        const app = this.container.getProvider('app').getImmediate();
        this._storage = new HeartbeatStorageImpl(app);
        this._heartbeatsCachePromise = this._storage.read().then(result => {
            this._heartbeatsCache = result;
            return result;
        });
    }
    /**
     * Called to report a heartbeat. The function will generate
     * a HeartbeatsByUserAgent object, update heartbeatsCache, and persist it
     * to IndexedDB.
     * Note that we only store one heartbeat per day. So if a heartbeat for today is
     * already logged, subsequent calls to this function in the same day will be ignored.
     */
    async triggerHeartbeat() {
        try {
            const platformLogger = this.container
                .getProvider('platform-logger')
                .getImmediate();
            // This is the "Firebase user agent" string from the platform logger
            // service, not the browser user agent.
            const agent = platformLogger.getPlatformInfoString();
            const date = getUTCDateString();
            if (this._heartbeatsCache?.heartbeats == null) {
                this._heartbeatsCache = await this._heartbeatsCachePromise;
                // If we failed to construct a heartbeats cache, then return immediately.
                if (this._heartbeatsCache?.heartbeats == null) {
                    return;
                }
            }
            // Do not store a heartbeat if one is already stored for this day
            // or if a header has already been sent today.
            if (this._heartbeatsCache.lastSentHeartbeatDate === date ||
                this._heartbeatsCache.heartbeats.some(singleDateHeartbeat => singleDateHeartbeat.date === date)) {
                return;
            }
            else {
                // There is no entry for this date. Create one.
                this._heartbeatsCache.heartbeats.push({ date, agent });
                // If the number of stored heartbeats exceeds the maximum number of stored heartbeats, remove the heartbeat with the earliest date.
                // Since this is executed each time a heartbeat is pushed, the limit can only be exceeded by one, so only one needs to be removed.
                if (this._heartbeatsCache.heartbeats.length > MAX_NUM_STORED_HEARTBEATS) {
                    const earliestHeartbeatIdx = getEarliestHeartbeatIdx(this._heartbeatsCache.heartbeats);
                    this._heartbeatsCache.heartbeats.splice(earliestHeartbeatIdx, 1);
                }
            }
            return this._storage.overwrite(this._heartbeatsCache);
        }
        catch (e) {
            logger.warn(e);
        }
    }
    /**
     * Returns a base64 encoded string which can be attached to the heartbeat-specific header directly.
     * It also clears all heartbeats from memory as well as in IndexedDB.
     *
     * NOTE: Consuming product SDKs should not send the header if this method
     * returns an empty string.
     */
    async getHeartbeatsHeader() {
        try {
            if (this._heartbeatsCache === null) {
                await this._heartbeatsCachePromise;
            }
            // If it's still null or the array is empty, there is no data to send.
            if (this._heartbeatsCache?.heartbeats == null ||
                this._heartbeatsCache.heartbeats.length === 0) {
                return '';
            }
            const date = getUTCDateString();
            // Extract as many heartbeats from the cache as will fit under the size limit.
            const { heartbeatsToSend, unsentEntries } = extractHeartbeatsForHeader(this._heartbeatsCache.heartbeats);
            const headerString = (0,_firebase_util__WEBPACK_IMPORTED_MODULE_2__.base64urlEncodeWithoutPadding)(JSON.stringify({ version: 2, heartbeats: heartbeatsToSend }));
            // Store last sent date to prevent another being logged/sent for the same day.
            this._heartbeatsCache.lastSentHeartbeatDate = date;
            if (unsentEntries.length > 0) {
                // Store any unsent entries if they exist.
                this._heartbeatsCache.heartbeats = unsentEntries;
                // This seems more likely than emptying the array (below) to lead to some odd state
                // since the cache isn't empty and this will be called again on the next request,
                // and is probably safest if we await it.
                await this._storage.overwrite(this._heartbeatsCache);
            }
            else {
                this._heartbeatsCache.heartbeats = [];
                // Do not wait for this, to reduce latency.
                void this._storage.overwrite(this._heartbeatsCache);
            }
            return headerString;
        }
        catch (e) {
            logger.warn(e);
            return '';
        }
    }
}
function getUTCDateString() {
    const today = new Date();
    // Returns date format 'YYYY-MM-DD'
    return today.toISOString().substring(0, 10);
}
function extractHeartbeatsForHeader(heartbeatsCache, maxSize = MAX_HEADER_BYTES) {
    // Heartbeats grouped by user agent in the standard format to be sent in
    // the header.
    const heartbeatsToSend = [];
    // Single date format heartbeats that are not sent.
    let unsentEntries = heartbeatsCache.slice();
    for (const singleDateHeartbeat of heartbeatsCache) {
        // Look for an existing entry with the same user agent.
        const heartbeatEntry = heartbeatsToSend.find(hb => hb.agent === singleDateHeartbeat.agent);
        if (!heartbeatEntry) {
            // If no entry for this user agent exists, create one.
            heartbeatsToSend.push({
                agent: singleDateHeartbeat.agent,
                dates: [singleDateHeartbeat.date]
            });
            if (countBytes(heartbeatsToSend) > maxSize) {
                // If the header would exceed max size, remove the added heartbeat
                // entry and stop adding to the header.
                heartbeatsToSend.pop();
                break;
            }
        }
        else {
            heartbeatEntry.dates.push(singleDateHeartbeat.date);
            // If the header would exceed max size, remove the added date
            // and stop adding to the header.
            if (countBytes(heartbeatsToSend) > maxSize) {
                heartbeatEntry.dates.pop();
                break;
            }
        }
        // Pop unsent entry from queue. (Skipped if adding the entry exceeded
        // quota and the loop breaks early.)
        unsentEntries = unsentEntries.slice(1);
    }
    return {
        heartbeatsToSend,
        unsentEntries
    };
}
class HeartbeatStorageImpl {
    constructor(app) {
        this.app = app;
        this._canUseIndexedDBPromise = this.runIndexedDBEnvironmentCheck();
    }
    async runIndexedDBEnvironmentCheck() {
        if (!(0,_firebase_util__WEBPACK_IMPORTED_MODULE_2__.isIndexedDBAvailable)()) {
            return false;
        }
        else {
            return (0,_firebase_util__WEBPACK_IMPORTED_MODULE_2__.validateIndexedDBOpenable)()
                .then(() => true)
                .catch(() => false);
        }
    }
    /**
     * Read all heartbeats.
     */
    async read() {
        const canUseIndexedDB = await this._canUseIndexedDBPromise;
        if (!canUseIndexedDB) {
            return { heartbeats: [] };
        }
        else {
            const idbHeartbeatObject = await readHeartbeatsFromIndexedDB(this.app);
            if (idbHeartbeatObject?.heartbeats) {
                return idbHeartbeatObject;
            }
            else {
                return { heartbeats: [] };
            }
        }
    }
    // overwrite the storage with the provided heartbeats
    async overwrite(heartbeatsObject) {
        const canUseIndexedDB = await this._canUseIndexedDBPromise;
        if (!canUseIndexedDB) {
            return;
        }
        else {
            const existingHeartbeatsObject = await this.read();
            return writeHeartbeatsToIndexedDB(this.app, {
                lastSentHeartbeatDate: heartbeatsObject.lastSentHeartbeatDate ??
                    existingHeartbeatsObject.lastSentHeartbeatDate,
                heartbeats: heartbeatsObject.heartbeats
            });
        }
    }
    // add heartbeats
    async add(heartbeatsObject) {
        const canUseIndexedDB = await this._canUseIndexedDBPromise;
        if (!canUseIndexedDB) {
            return;
        }
        else {
            const existingHeartbeatsObject = await this.read();
            return writeHeartbeatsToIndexedDB(this.app, {
                lastSentHeartbeatDate: heartbeatsObject.lastSentHeartbeatDate ??
                    existingHeartbeatsObject.lastSentHeartbeatDate,
                heartbeats: [
                    ...existingHeartbeatsObject.heartbeats,
                    ...heartbeatsObject.heartbeats
                ]
            });
        }
    }
}
/**
 * Calculate bytes of a HeartbeatsByUserAgent array after being wrapped
 * in a platform logging header JSON object, stringified, and converted
 * to base 64.
 */
function countBytes(heartbeatsCache) {
    // base64 has a restricted set of characters, all of which should be 1 byte.
    return (0,_firebase_util__WEBPACK_IMPORTED_MODULE_2__.base64urlEncodeWithoutPadding)(
    // heartbeatsCache wrapper properties
    JSON.stringify({ version: 2, heartbeats: heartbeatsCache })).length;
}
/**
 * Returns the index of the heartbeat with the earliest date.
 * If the heartbeats array is empty, -1 is returned.
 */
function getEarliestHeartbeatIdx(heartbeats) {
    if (heartbeats.length === 0) {
        return -1;
    }
    let earliestHeartbeatIdx = 0;
    let earliestHeartbeatDate = heartbeats[0].date;
    for (let i = 1; i < heartbeats.length; i++) {
        if (heartbeats[i].date < earliestHeartbeatDate) {
            earliestHeartbeatDate = heartbeats[i].date;
            earliestHeartbeatIdx = i;
        }
    }
    return earliestHeartbeatIdx;
}

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function registerCoreComponents(variant) {
    _registerComponent(new _firebase_component__WEBPACK_IMPORTED_MODULE_0__.Component('platform-logger', container => new PlatformLoggerServiceImpl(container), "PRIVATE" /* ComponentType.PRIVATE */));
    _registerComponent(new _firebase_component__WEBPACK_IMPORTED_MODULE_0__.Component('heartbeat', container => new HeartbeatServiceImpl(container), "PRIVATE" /* ComponentType.PRIVATE */));
    // Register `app` package.
    registerVersion(name$q, version$1, variant);
    // BUILD_TARGET will be replaced by values like esm, cjs, etc during the compilation
    registerVersion(name$q, version$1, 'esm2020');
    // Register platform SDK identifier (no version).
    registerVersion('fire-js', '');
}

/**
 * Firebase App
 *
 * @remarks This package coordinates the communication between the different Firebase components
 * @packageDocumentation
 */
registerCoreComponents('');


//# sourceMappingURL=index.esm.js.map


/***/ }),

/***/ "./node_modules/@firebase/component/dist/esm/index.esm.js":
/*!****************************************************************!*\
  !*** ./node_modules/@firebase/component/dist/esm/index.esm.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Component: function() { return /* binding */ Component; },
/* harmony export */   ComponentContainer: function() { return /* binding */ ComponentContainer; },
/* harmony export */   Provider: function() { return /* binding */ Provider; }
/* harmony export */ });
/* harmony import */ var _firebase_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @firebase/util */ "./node_modules/@firebase/util/dist/index.esm.js");


/**
 * Component for service name T, e.g. `auth`, `auth-internal`
 */
class Component {
    /**
     *
     * @param name The public service name, e.g. app, auth, firestore, database
     * @param instanceFactory Service factory responsible for creating the public interface
     * @param type whether the service provided by the component is public or private
     */
    constructor(name, instanceFactory, type) {
        this.name = name;
        this.instanceFactory = instanceFactory;
        this.type = type;
        this.multipleInstances = false;
        /**
         * Properties to be added to the service namespace
         */
        this.serviceProps = {};
        this.instantiationMode = "LAZY" /* InstantiationMode.LAZY */;
        this.onInstanceCreated = null;
    }
    setInstantiationMode(mode) {
        this.instantiationMode = mode;
        return this;
    }
    setMultipleInstances(multipleInstances) {
        this.multipleInstances = multipleInstances;
        return this;
    }
    setServiceProps(props) {
        this.serviceProps = props;
        return this;
    }
    setInstanceCreatedCallback(callback) {
        this.onInstanceCreated = callback;
        return this;
    }
}

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const DEFAULT_ENTRY_NAME = '[DEFAULT]';

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Provider for instance for service name T, e.g. 'auth', 'auth-internal'
 * NameServiceMapping[T] is an alias for the type of the instance
 */
class Provider {
    constructor(name, container) {
        this.name = name;
        this.container = container;
        this.component = null;
        this.instances = new Map();
        this.instancesDeferred = new Map();
        this.instancesOptions = new Map();
        this.onInitCallbacks = new Map();
    }
    /**
     * @param identifier A provider can provide multiple instances of a service
     * if this.component.multipleInstances is true.
     */
    get(identifier) {
        // if multipleInstances is not supported, use the default name
        const normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
        if (!this.instancesDeferred.has(normalizedIdentifier)) {
            const deferred = new _firebase_util__WEBPACK_IMPORTED_MODULE_0__.Deferred();
            this.instancesDeferred.set(normalizedIdentifier, deferred);
            if (this.isInitialized(normalizedIdentifier) ||
                this.shouldAutoInitialize()) {
                // initialize the service if it can be auto-initialized
                try {
                    const instance = this.getOrInitializeService({
                        instanceIdentifier: normalizedIdentifier
                    });
                    if (instance) {
                        deferred.resolve(instance);
                    }
                }
                catch (e) {
                    // when the instance factory throws an exception during get(), it should not cause
                    // a fatal error. We just return the unresolved promise in this case.
                }
            }
        }
        return this.instancesDeferred.get(normalizedIdentifier).promise;
    }
    getImmediate(options) {
        // if multipleInstances is not supported, use the default name
        const normalizedIdentifier = this.normalizeInstanceIdentifier(options?.identifier);
        const optional = options?.optional ?? false;
        if (this.isInitialized(normalizedIdentifier) ||
            this.shouldAutoInitialize()) {
            try {
                return this.getOrInitializeService({
                    instanceIdentifier: normalizedIdentifier
                });
            }
            catch (e) {
                if (optional) {
                    return null;
                }
                else {
                    throw e;
                }
            }
        }
        else {
            // In case a component is not initialized and should/cannot be auto-initialized at the moment, return null if the optional flag is set, or throw
            if (optional) {
                return null;
            }
            else {
                throw Error(`Service ${this.name} is not available`);
            }
        }
    }
    getComponent() {
        return this.component;
    }
    setComponent(component) {
        if (component.name !== this.name) {
            throw Error(`Mismatching Component ${component.name} for Provider ${this.name}.`);
        }
        if (this.component) {
            throw Error(`Component for ${this.name} has already been provided`);
        }
        this.component = component;
        // return early without attempting to initialize the component if the component requires explicit initialization (calling `Provider.initialize()`)
        if (!this.shouldAutoInitialize()) {
            return;
        }
        // if the service is eager, initialize the default instance
        if (isComponentEager(component)) {
            try {
                this.getOrInitializeService({ instanceIdentifier: DEFAULT_ENTRY_NAME });
            }
            catch (e) {
                // when the instance factory for an eager Component throws an exception during the eager
                // initialization, it should not cause a fatal error.
                // TODO: Investigate if we need to make it configurable, because some component may want to cause
                // a fatal error in this case?
            }
        }
        // Create service instances for the pending promises and resolve them
        // NOTE: if this.multipleInstances is false, only the default instance will be created
        // and all promises with resolve with it regardless of the identifier.
        for (const [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()) {
            const normalizedIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);
            try {
                // `getOrInitializeService()` should always return a valid instance since a component is guaranteed. use ! to make typescript happy.
                const instance = this.getOrInitializeService({
                    instanceIdentifier: normalizedIdentifier
                });
                instanceDeferred.resolve(instance);
            }
            catch (e) {
                // when the instance factory throws an exception, it should not cause
                // a fatal error. We just leave the promise unresolved.
            }
        }
    }
    clearInstance(identifier = DEFAULT_ENTRY_NAME) {
        this.instancesDeferred.delete(identifier);
        this.instancesOptions.delete(identifier);
        this.instances.delete(identifier);
    }
    // app.delete() will call this method on every provider to delete the services
    // TODO: should we mark the provider as deleted?
    async delete() {
        const services = Array.from(this.instances.values());
        await Promise.all([
            ...services
                .filter(service => 'INTERNAL' in service) // legacy services
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .map(service => service.INTERNAL.delete()),
            ...services
                .filter(service => '_delete' in service) // modularized services
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .map(service => service._delete())
        ]);
    }
    isComponentSet() {
        return this.component != null;
    }
    isInitialized(identifier = DEFAULT_ENTRY_NAME) {
        return this.instances.has(identifier);
    }
    getOptions(identifier = DEFAULT_ENTRY_NAME) {
        return this.instancesOptions.get(identifier) || {};
    }
    initialize(opts = {}) {
        const { options = {} } = opts;
        const normalizedIdentifier = this.normalizeInstanceIdentifier(opts.instanceIdentifier);
        if (this.isInitialized(normalizedIdentifier)) {
            throw Error(`${this.name}(${normalizedIdentifier}) has already been initialized`);
        }
        if (!this.isComponentSet()) {
            throw Error(`Component ${this.name} has not been registered yet`);
        }
        const instance = this.getOrInitializeService({
            instanceIdentifier: normalizedIdentifier,
            options
        });
        // resolve any pending promise waiting for the service instance
        for (const [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()) {
            const normalizedDeferredIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);
            if (normalizedIdentifier === normalizedDeferredIdentifier) {
                instanceDeferred.resolve(instance);
            }
        }
        return instance;
    }
    /**
     *
     * @param callback - a function that will be invoked  after the provider has been initialized by calling provider.initialize().
     * The function is invoked SYNCHRONOUSLY, so it should not execute any longrunning tasks in order to not block the program.
     *
     * @param identifier An optional instance identifier
     * @returns a function to unregister the callback
     */
    onInit(callback, identifier) {
        const normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
        const existingCallbacks = this.onInitCallbacks.get(normalizedIdentifier) ??
            new Set();
        existingCallbacks.add(callback);
        this.onInitCallbacks.set(normalizedIdentifier, existingCallbacks);
        const existingInstance = this.instances.get(normalizedIdentifier);
        if (existingInstance) {
            callback(existingInstance, normalizedIdentifier);
        }
        return () => {
            existingCallbacks.delete(callback);
        };
    }
    /**
     * Invoke onInit callbacks synchronously
     * @param instance the service instance`
     */
    invokeOnInitCallbacks(instance, identifier) {
        const callbacks = this.onInitCallbacks.get(identifier);
        if (!callbacks) {
            return;
        }
        for (const callback of callbacks) {
            try {
                callback(instance, identifier);
            }
            catch {
                // ignore errors in the onInit callback
            }
        }
    }
    getOrInitializeService({ instanceIdentifier, options = {} }) {
        let instance = this.instances.get(instanceIdentifier);
        if (!instance && this.component) {
            instance = this.component.instanceFactory(this.container, {
                instanceIdentifier: normalizeIdentifierForFactory(instanceIdentifier),
                options
            });
            this.instances.set(instanceIdentifier, instance);
            this.instancesOptions.set(instanceIdentifier, options);
            /**
             * Invoke onInit listeners.
             * Note this.component.onInstanceCreated is different, which is used by the component creator,
             * while onInit listeners are registered by consumers of the provider.
             */
            this.invokeOnInitCallbacks(instance, instanceIdentifier);
            /**
             * Order is important
             * onInstanceCreated() should be called after this.instances.set(instanceIdentifier, instance); which
             * makes `isInitialized()` return true.
             */
            if (this.component.onInstanceCreated) {
                try {
                    this.component.onInstanceCreated(this.container, instanceIdentifier, instance);
                }
                catch {
                    // ignore errors in the onInstanceCreatedCallback
                }
            }
        }
        return instance || null;
    }
    normalizeInstanceIdentifier(identifier = DEFAULT_ENTRY_NAME) {
        if (this.component) {
            return this.component.multipleInstances ? identifier : DEFAULT_ENTRY_NAME;
        }
        else {
            return identifier; // assume multiple instances are supported before the component is provided.
        }
    }
    shouldAutoInitialize() {
        return (!!this.component &&
            this.component.instantiationMode !== "EXPLICIT" /* InstantiationMode.EXPLICIT */);
    }
}
// undefined should be passed to the service factory for the default instance
function normalizeIdentifierForFactory(identifier) {
    return identifier === DEFAULT_ENTRY_NAME ? undefined : identifier;
}
function isComponentEager(component) {
    return component.instantiationMode === "EAGER" /* InstantiationMode.EAGER */;
}

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * ComponentContainer that provides Providers for service name T, e.g. `auth`, `auth-internal`
 */
class ComponentContainer {
    constructor(name) {
        this.name = name;
        this.providers = new Map();
    }
    /**
     *
     * @param component Component being added
     * @param overwrite When a component with the same name has already been registered,
     * if overwrite is true: overwrite the existing component with the new component and create a new
     * provider with the new component. It can be useful in tests where you want to use different mocks
     * for different tests.
     * if overwrite is false: throw an exception
     */
    addComponent(component) {
        const provider = this.getProvider(component.name);
        if (provider.isComponentSet()) {
            throw new Error(`Component ${component.name} has already been registered with ${this.name}`);
        }
        provider.setComponent(component);
    }
    addOrOverwriteComponent(component) {
        const provider = this.getProvider(component.name);
        if (provider.isComponentSet()) {
            // delete the existing provider from the container, so we can register the new component
            this.providers.delete(component.name);
        }
        this.addComponent(component);
    }
    /**
     * getProvider provides a type safe interface where it can only be called with a field name
     * present in NameServiceMapping interface.
     *
     * Firebase SDKs providing services should extend NameServiceMapping interface to register
     * themselves.
     */
    getProvider(name) {
        if (this.providers.has(name)) {
            return this.providers.get(name);
        }
        // create a Provider for a service that hasn't registered with Firebase
        const provider = new Provider(name, this);
        this.providers.set(name, provider);
        return provider;
    }
    getProviders() {
        return Array.from(this.providers.values());
    }
}


//# sourceMappingURL=index.esm.js.map


/***/ }),

/***/ "./node_modules/@firebase/installations/dist/esm/index.esm.js":
/*!********************************************************************!*\
  !*** ./node_modules/@firebase/installations/dist/esm/index.esm.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   deleteInstallations: function() { return /* binding */ deleteInstallations; },
/* harmony export */   getId: function() { return /* binding */ getId; },
/* harmony export */   getInstallations: function() { return /* binding */ getInstallations; },
/* harmony export */   getToken: function() { return /* binding */ getToken; },
/* harmony export */   onIdChange: function() { return /* binding */ onIdChange; }
/* harmony export */ });
/* harmony import */ var _firebase_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @firebase/app */ "./node_modules/@firebase/app/dist/esm/index.esm.js");
/* harmony import */ var _firebase_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @firebase/component */ "./node_modules/@firebase/component/dist/esm/index.esm.js");
/* harmony import */ var _firebase_util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @firebase/util */ "./node_modules/@firebase/util/dist/index.esm.js");
/* harmony import */ var idb__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! idb */ "./node_modules/idb/build/index.js");





const name = "@firebase/installations";
const version = "0.6.22";

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const PENDING_TIMEOUT_MS = 10000;
const PACKAGE_VERSION = `w:${version}`;
const INTERNAL_AUTH_VERSION = 'FIS_v2';
const INSTALLATIONS_API_URL = 'https://firebaseinstallations.googleapis.com/v1';
const TOKEN_EXPIRATION_BUFFER = 60 * 60 * 1000; // One hour
const SERVICE = 'installations';
const SERVICE_NAME = 'Installations';

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const ERROR_DESCRIPTION_MAP = {
    ["missing-app-config-values" /* ErrorCode.MISSING_APP_CONFIG_VALUES */]: 'Missing App configuration value: "{$valueName}"',
    ["not-registered" /* ErrorCode.NOT_REGISTERED */]: 'Firebase Installation is not registered.',
    ["installation-not-found" /* ErrorCode.INSTALLATION_NOT_FOUND */]: 'Firebase Installation not found.',
    ["request-failed" /* ErrorCode.REQUEST_FAILED */]: '{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',
    ["app-offline" /* ErrorCode.APP_OFFLINE */]: 'Could not process request. Application offline.',
    ["delete-pending-registration" /* ErrorCode.DELETE_PENDING_REGISTRATION */]: "Can't delete installation while there is a pending registration request."
};
const ERROR_FACTORY = new _firebase_util__WEBPACK_IMPORTED_MODULE_2__.ErrorFactory(SERVICE, SERVICE_NAME, ERROR_DESCRIPTION_MAP);
/** Returns true if error is a FirebaseError that is based on an error from the server. */
function isServerError(error) {
    return (error instanceof _firebase_util__WEBPACK_IMPORTED_MODULE_2__.FirebaseError &&
        error.code.includes("request-failed" /* ErrorCode.REQUEST_FAILED */));
}

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function getInstallationsEndpoint({ projectId }) {
    return `${INSTALLATIONS_API_URL}/projects/${projectId}/installations`;
}
function extractAuthTokenInfoFromResponse(response) {
    return {
        token: response.token,
        requestStatus: 2 /* RequestStatus.COMPLETED */,
        expiresIn: getExpiresInFromResponseExpiresIn(response.expiresIn),
        creationTime: Date.now()
    };
}
async function getErrorFromResponse(requestName, response) {
    const responseJson = await response.json();
    const errorData = responseJson.error;
    return ERROR_FACTORY.create("request-failed" /* ErrorCode.REQUEST_FAILED */, {
        requestName,
        serverCode: errorData.code,
        serverMessage: errorData.message,
        serverStatus: errorData.status
    });
}
function getHeaders({ apiKey }) {
    return new Headers({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'x-goog-api-key': apiKey
    });
}
function getHeadersWithAuth(appConfig, { refreshToken }) {
    const headers = getHeaders(appConfig);
    headers.append('Authorization', getAuthorizationHeader(refreshToken));
    return headers;
}
/**
 * Calls the passed in fetch wrapper and returns the response.
 * If the returned response has a status of 5xx, re-runs the function once and
 * returns the response.
 */
async function retryIfServerError(fn) {
    const result = await fn();
    if (result.status >= 500 && result.status < 600) {
        // Internal Server Error. Retry request.
        return fn();
    }
    return result;
}
function getExpiresInFromResponseExpiresIn(responseExpiresIn) {
    // This works because the server will never respond with fractions of a second.
    return Number(responseExpiresIn.replace('s', '000'));
}
function getAuthorizationHeader(refreshToken) {
    return `${INTERNAL_AUTH_VERSION} ${refreshToken}`;
}

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function createInstallationRequest({ appConfig, heartbeatServiceProvider }, { fid }) {
    const endpoint = getInstallationsEndpoint(appConfig);
    const headers = getHeaders(appConfig);
    // If heartbeat service exists, add the heartbeat string to the header.
    const heartbeatService = heartbeatServiceProvider.getImmediate({
        optional: true
    });
    if (heartbeatService) {
        const heartbeatsHeader = await heartbeatService.getHeartbeatsHeader();
        if (heartbeatsHeader) {
            headers.append('x-firebase-client', heartbeatsHeader);
        }
    }
    const body = {
        fid,
        authVersion: INTERNAL_AUTH_VERSION,
        appId: appConfig.appId,
        sdkVersion: PACKAGE_VERSION
    };
    const request = {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
    };
    const response = await retryIfServerError(() => fetch(endpoint, request));
    if (response.ok) {
        const responseValue = await response.json();
        const registeredInstallationEntry = {
            fid: responseValue.fid || fid,
            registrationStatus: 2 /* RequestStatus.COMPLETED */,
            refreshToken: responseValue.refreshToken,
            authToken: extractAuthTokenInfoFromResponse(responseValue.authToken)
        };
        return registeredInstallationEntry;
    }
    else {
        throw await getErrorFromResponse('Create Installation', response);
    }
}

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/** Returns a promise that resolves after given time passes. */
function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function bufferToBase64UrlSafe(array) {
    const b64 = btoa(String.fromCharCode(...array));
    return b64.replace(/\+/g, '-').replace(/\//g, '_');
}

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const VALID_FID_PATTERN = /^[cdef][\w-]{21}$/;
const INVALID_FID = '';
/**
 * Generates a new FID using random values from Web Crypto API.
 * Returns an empty string if FID generation fails for any reason.
 */
function generateFid() {
    try {
        // A valid FID has exactly 22 base64 characters, which is 132 bits, or 16.5
        // bytes. our implementation generates a 17 byte array instead.
        const fidByteArray = new Uint8Array(17);
        const crypto = self.crypto || self.msCrypto;
        crypto.getRandomValues(fidByteArray);
        // Replace the first 4 random bits with the constant FID header of 0b0111.
        fidByteArray[0] = 0b01110000 + (fidByteArray[0] % 0b00010000);
        const fid = encode(fidByteArray);
        return VALID_FID_PATTERN.test(fid) ? fid : INVALID_FID;
    }
    catch {
        // FID generation errored
        return INVALID_FID;
    }
}
/** Converts a FID Uint8Array to a base64 string representation. */
function encode(fidByteArray) {
    const b64String = bufferToBase64UrlSafe(fidByteArray);
    // Remove the 23rd character that was added because of the extra 4 bits at the
    // end of our 17 byte array, and the '=' padding.
    return b64String.substr(0, 22);
}

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/** Returns a string key that can be used to identify the app. */
function getKey(appConfig) {
    return `${appConfig.appName}!${appConfig.appId}`;
}

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const fidChangeCallbacks = new Map();
/**
 * Calls the onIdChange callbacks with the new FID value, and broadcasts the
 * change to other tabs.
 */
function fidChanged(appConfig, fid) {
    const key = getKey(appConfig);
    callFidChangeCallbacks(key, fid);
    broadcastFidChange(key, fid);
}
function addCallback(appConfig, callback) {
    // Open the broadcast channel if it's not already open,
    // to be able to listen to change events from other tabs.
    getBroadcastChannel();
    const key = getKey(appConfig);
    let callbackSet = fidChangeCallbacks.get(key);
    if (!callbackSet) {
        callbackSet = new Set();
        fidChangeCallbacks.set(key, callbackSet);
    }
    callbackSet.add(callback);
}
function removeCallback(appConfig, callback) {
    const key = getKey(appConfig);
    const callbackSet = fidChangeCallbacks.get(key);
    if (!callbackSet) {
        return;
    }
    callbackSet.delete(callback);
    if (callbackSet.size === 0) {
        fidChangeCallbacks.delete(key);
    }
    // Close broadcast channel if there are no more callbacks.
    closeBroadcastChannel();
}
function callFidChangeCallbacks(key, fid) {
    const callbacks = fidChangeCallbacks.get(key);
    if (!callbacks) {
        return;
    }
    for (const callback of callbacks) {
        callback(fid);
    }
}
function broadcastFidChange(key, fid) {
    const channel = getBroadcastChannel();
    if (channel) {
        channel.postMessage({ key, fid });
    }
    closeBroadcastChannel();
}
let broadcastChannel = null;
/** Opens and returns a BroadcastChannel if it is supported by the browser. */
function getBroadcastChannel() {
    if (!broadcastChannel && 'BroadcastChannel' in self) {
        broadcastChannel = new BroadcastChannel('[Firebase] FID Change');
        broadcastChannel.onmessage = e => {
            callFidChangeCallbacks(e.data.key, e.data.fid);
        };
    }
    return broadcastChannel;
}
function closeBroadcastChannel() {
    if (fidChangeCallbacks.size === 0 && broadcastChannel) {
        broadcastChannel.close();
        broadcastChannel = null;
    }
}

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const DATABASE_NAME = 'firebase-installations-database';
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = 'firebase-installations-store';
let dbPromise = null;
function getDbPromise() {
    if (!dbPromise) {
        dbPromise = (0,idb__WEBPACK_IMPORTED_MODULE_3__.openDB)(DATABASE_NAME, DATABASE_VERSION, {
            upgrade: (db, oldVersion) => {
                // We don't use 'break' in this switch statement, the fall-through
                // behavior is what we want, because if there are multiple versions between
                // the old version and the current version, we want ALL the migrations
                // that correspond to those versions to run, not only the last one.
                // eslint-disable-next-line default-case
                switch (oldVersion) {
                    case 0:
                        db.createObjectStore(OBJECT_STORE_NAME);
                }
            }
        });
    }
    return dbPromise;
}
/** Assigns or overwrites the record for the given key with the given value. */
async function set(appConfig, value) {
    const key = getKey(appConfig);
    const db = await getDbPromise();
    const tx = db.transaction(OBJECT_STORE_NAME, 'readwrite');
    const objectStore = tx.objectStore(OBJECT_STORE_NAME);
    const oldValue = (await objectStore.get(key));
    await objectStore.put(value, key);
    await tx.done;
    if (!oldValue || oldValue.fid !== value.fid) {
        fidChanged(appConfig, value.fid);
    }
    return value;
}
/** Removes record(s) from the objectStore that match the given key. */
async function remove(appConfig) {
    const key = getKey(appConfig);
    const db = await getDbPromise();
    const tx = db.transaction(OBJECT_STORE_NAME, 'readwrite');
    await tx.objectStore(OBJECT_STORE_NAME).delete(key);
    await tx.done;
}
/**
 * Atomically updates a record with the result of updateFn, which gets
 * called with the current value. If newValue is undefined, the record is
 * deleted instead.
 * @return Updated value
 */
async function update(appConfig, updateFn) {
    const key = getKey(appConfig);
    const db = await getDbPromise();
    const tx = db.transaction(OBJECT_STORE_NAME, 'readwrite');
    const store = tx.objectStore(OBJECT_STORE_NAME);
    const oldValue = (await store.get(key));
    const newValue = updateFn(oldValue);
    if (newValue === undefined) {
        await store.delete(key);
    }
    else {
        await store.put(newValue, key);
    }
    await tx.done;
    if (newValue && (!oldValue || oldValue.fid !== newValue.fid)) {
        fidChanged(appConfig, newValue.fid);
    }
    return newValue;
}

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Updates and returns the InstallationEntry from the database.
 * Also triggers a registration request if it is necessary and possible.
 */
async function getInstallationEntry(installations) {
    let registrationPromise;
    const installationEntry = await update(installations.appConfig, oldEntry => {
        const installationEntry = updateOrCreateInstallationEntry(oldEntry);
        const entryWithPromise = triggerRegistrationIfNecessary(installations, installationEntry);
        registrationPromise = entryWithPromise.registrationPromise;
        return entryWithPromise.installationEntry;
    });
    if (installationEntry.fid === INVALID_FID) {
        // FID generation failed. Waiting for the FID from the server.
        return { installationEntry: await registrationPromise };
    }
    return {
        installationEntry,
        registrationPromise
    };
}
/**
 * Creates a new Installation Entry if one does not exist.
 * Also clears timed out pending requests.
 */
function updateOrCreateInstallationEntry(oldEntry) {
    const entry = oldEntry || {
        fid: generateFid(),
        registrationStatus: 0 /* RequestStatus.NOT_STARTED */
    };
    return clearTimedOutRequest(entry);
}
/**
 * If the Firebase Installation is not registered yet, this will trigger the
 * registration and return an InProgressInstallationEntry.
 *
 * If registrationPromise does not exist, the installationEntry is guaranteed
 * to be registered.
 */
function triggerRegistrationIfNecessary(installations, installationEntry) {
    if (installationEntry.registrationStatus === 0 /* RequestStatus.NOT_STARTED */) {
        if (!navigator.onLine) {
            // Registration required but app is offline.
            const registrationPromiseWithError = Promise.reject(ERROR_FACTORY.create("app-offline" /* ErrorCode.APP_OFFLINE */));
            return {
                installationEntry,
                registrationPromise: registrationPromiseWithError
            };
        }
        // Try registering. Change status to IN_PROGRESS.
        const inProgressEntry = {
            fid: installationEntry.fid,
            registrationStatus: 1 /* RequestStatus.IN_PROGRESS */,
            registrationTime: Date.now()
        };
        const registrationPromise = registerInstallation(installations, inProgressEntry);
        return { installationEntry: inProgressEntry, registrationPromise };
    }
    else if (installationEntry.registrationStatus === 1 /* RequestStatus.IN_PROGRESS */) {
        return {
            installationEntry,
            registrationPromise: waitUntilFidRegistration(installations)
        };
    }
    else {
        return { installationEntry };
    }
}
/** This will be executed only once for each new Firebase Installation. */
async function registerInstallation(installations, installationEntry) {
    try {
        const registeredInstallationEntry = await createInstallationRequest(installations, installationEntry);
        return set(installations.appConfig, registeredInstallationEntry);
    }
    catch (e) {
        if (isServerError(e) && e.customData.serverCode === 409) {
            // Server returned a "FID cannot be used" error.
            // Generate a new ID next time.
            await remove(installations.appConfig);
        }
        else {
            // Registration failed. Set FID as not registered.
            await set(installations.appConfig, {
                fid: installationEntry.fid,
                registrationStatus: 0 /* RequestStatus.NOT_STARTED */
            });
        }
        throw e;
    }
}
/** Call if FID registration is pending in another request. */
async function waitUntilFidRegistration(installations) {
    // Unfortunately, there is no way of reliably observing when a value in
    // IndexedDB changes (yet, see https://github.com/WICG/indexed-db-observers),
    // so we need to poll.
    let entry = await updateInstallationRequest(installations.appConfig);
    while (entry.registrationStatus === 1 /* RequestStatus.IN_PROGRESS */) {
        // createInstallation request still in progress.
        await sleep(100);
        entry = await updateInstallationRequest(installations.appConfig);
    }
    if (entry.registrationStatus === 0 /* RequestStatus.NOT_STARTED */) {
        // The request timed out or failed in a different call. Try again.
        const { installationEntry, registrationPromise } = await getInstallationEntry(installations);
        if (registrationPromise) {
            return registrationPromise;
        }
        else {
            // if there is no registrationPromise, entry is registered.
            return installationEntry;
        }
    }
    return entry;
}
/**
 * Called only if there is a CreateInstallation request in progress.
 *
 * Updates the InstallationEntry in the DB based on the status of the
 * CreateInstallation request.
 *
 * Returns the updated InstallationEntry.
 */
function updateInstallationRequest(appConfig) {
    return update(appConfig, oldEntry => {
        if (!oldEntry) {
            throw ERROR_FACTORY.create("installation-not-found" /* ErrorCode.INSTALLATION_NOT_FOUND */);
        }
        return clearTimedOutRequest(oldEntry);
    });
}
function clearTimedOutRequest(entry) {
    if (hasInstallationRequestTimedOut(entry)) {
        return {
            fid: entry.fid,
            registrationStatus: 0 /* RequestStatus.NOT_STARTED */
        };
    }
    return entry;
}
function hasInstallationRequestTimedOut(installationEntry) {
    return (installationEntry.registrationStatus === 1 /* RequestStatus.IN_PROGRESS */ &&
        installationEntry.registrationTime + PENDING_TIMEOUT_MS < Date.now());
}

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function generateAuthTokenRequest({ appConfig, heartbeatServiceProvider }, installationEntry) {
    const endpoint = getGenerateAuthTokenEndpoint(appConfig, installationEntry);
    const headers = getHeadersWithAuth(appConfig, installationEntry);
    // If heartbeat service exists, add the heartbeat string to the header.
    const heartbeatService = heartbeatServiceProvider.getImmediate({
        optional: true
    });
    if (heartbeatService) {
        const heartbeatsHeader = await heartbeatService.getHeartbeatsHeader();
        if (heartbeatsHeader) {
            headers.append('x-firebase-client', heartbeatsHeader);
        }
    }
    const body = {
        installation: {
            sdkVersion: PACKAGE_VERSION,
            appId: appConfig.appId
        }
    };
    const request = {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
    };
    const response = await retryIfServerError(() => fetch(endpoint, request));
    if (response.ok) {
        const responseValue = await response.json();
        const completedAuthToken = extractAuthTokenInfoFromResponse(responseValue);
        return completedAuthToken;
    }
    else {
        throw await getErrorFromResponse('Generate Auth Token', response);
    }
}
function getGenerateAuthTokenEndpoint(appConfig, { fid }) {
    return `${getInstallationsEndpoint(appConfig)}/${fid}/authTokens:generate`;
}

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Returns a valid authentication token for the installation. Generates a new
 * token if one doesn't exist, is expired or about to expire.
 *
 * Should only be called if the Firebase Installation is registered.
 */
async function refreshAuthToken(installations, forceRefresh = false) {
    let tokenPromise;
    const entry = await update(installations.appConfig, oldEntry => {
        if (!isEntryRegistered(oldEntry)) {
            throw ERROR_FACTORY.create("not-registered" /* ErrorCode.NOT_REGISTERED */);
        }
        const oldAuthToken = oldEntry.authToken;
        if (!forceRefresh && isAuthTokenValid(oldAuthToken)) {
            // There is a valid token in the DB.
            return oldEntry;
        }
        else if (oldAuthToken.requestStatus === 1 /* RequestStatus.IN_PROGRESS */) {
            // There already is a token request in progress.
            tokenPromise = waitUntilAuthTokenRequest(installations, forceRefresh);
            return oldEntry;
        }
        else {
            // No token or token expired.
            if (!navigator.onLine) {
                throw ERROR_FACTORY.create("app-offline" /* ErrorCode.APP_OFFLINE */);
            }
            const inProgressEntry = makeAuthTokenRequestInProgressEntry(oldEntry);
            tokenPromise = fetchAuthTokenFromServer(installations, inProgressEntry);
            return inProgressEntry;
        }
    });
    const authToken = tokenPromise
        ? await tokenPromise
        : entry.authToken;
    return authToken;
}
/**
 * Call only if FID is registered and Auth Token request is in progress.
 *
 * Waits until the current pending request finishes. If the request times out,
 * tries once in this thread as well.
 */
async function waitUntilAuthTokenRequest(installations, forceRefresh) {
    // Unfortunately, there is no way of reliably observing when a value in
    // IndexedDB changes (yet, see https://github.com/WICG/indexed-db-observers),
    // so we need to poll.
    let entry = await updateAuthTokenRequest(installations.appConfig);
    while (entry.authToken.requestStatus === 1 /* RequestStatus.IN_PROGRESS */) {
        // generateAuthToken still in progress.
        await sleep(100);
        entry = await updateAuthTokenRequest(installations.appConfig);
    }
    const authToken = entry.authToken;
    if (authToken.requestStatus === 0 /* RequestStatus.NOT_STARTED */) {
        // The request timed out or failed in a different call. Try again.
        return refreshAuthToken(installations, forceRefresh);
    }
    else {
        return authToken;
    }
}
/**
 * Called only if there is a GenerateAuthToken request in progress.
 *
 * Updates the InstallationEntry in the DB based on the status of the
 * GenerateAuthToken request.
 *
 * Returns the updated InstallationEntry.
 */
function updateAuthTokenRequest(appConfig) {
    return update(appConfig, oldEntry => {
        if (!isEntryRegistered(oldEntry)) {
            throw ERROR_FACTORY.create("not-registered" /* ErrorCode.NOT_REGISTERED */);
        }
        const oldAuthToken = oldEntry.authToken;
        if (hasAuthTokenRequestTimedOut(oldAuthToken)) {
            return {
                ...oldEntry,
                authToken: { requestStatus: 0 /* RequestStatus.NOT_STARTED */ }
            };
        }
        return oldEntry;
    });
}
async function fetchAuthTokenFromServer(installations, installationEntry) {
    try {
        const authToken = await generateAuthTokenRequest(installations, installationEntry);
        const updatedInstallationEntry = {
            ...installationEntry,
            authToken
        };
        await set(installations.appConfig, updatedInstallationEntry);
        return authToken;
    }
    catch (e) {
        if (isServerError(e) &&
            (e.customData.serverCode === 401 || e.customData.serverCode === 404)) {
            // Server returned a "FID not found" or a "Invalid authentication" error.
            // Generate a new ID next time.
            await remove(installations.appConfig);
        }
        else {
            const updatedInstallationEntry = {
                ...installationEntry,
                authToken: { requestStatus: 0 /* RequestStatus.NOT_STARTED */ }
            };
            await set(installations.appConfig, updatedInstallationEntry);
        }
        throw e;
    }
}
function isEntryRegistered(installationEntry) {
    return (installationEntry !== undefined &&
        installationEntry.registrationStatus === 2 /* RequestStatus.COMPLETED */);
}
function isAuthTokenValid(authToken) {
    return (authToken.requestStatus === 2 /* RequestStatus.COMPLETED */ &&
        !isAuthTokenExpired(authToken));
}
function isAuthTokenExpired(authToken) {
    const now = Date.now();
    return (now < authToken.creationTime ||
        authToken.creationTime + authToken.expiresIn < now + TOKEN_EXPIRATION_BUFFER);
}
/** Returns an updated InstallationEntry with an InProgressAuthToken. */
function makeAuthTokenRequestInProgressEntry(oldEntry) {
    const inProgressAuthToken = {
        requestStatus: 1 /* RequestStatus.IN_PROGRESS */,
        requestTime: Date.now()
    };
    return {
        ...oldEntry,
        authToken: inProgressAuthToken
    };
}
function hasAuthTokenRequestTimedOut(authToken) {
    return (authToken.requestStatus === 1 /* RequestStatus.IN_PROGRESS */ &&
        authToken.requestTime + PENDING_TIMEOUT_MS < Date.now());
}

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Creates a Firebase Installation if there isn't one for the app and
 * returns the Installation ID.
 * @param installations - The `Installations` instance.
 *
 * @public
 */
async function getId(installations) {
    const installationsImpl = installations;
    const { installationEntry, registrationPromise } = await getInstallationEntry(installationsImpl);
    if (registrationPromise) {
        registrationPromise.catch(console.error);
    }
    else {
        // If the installation is already registered, update the authentication
        // token if needed.
        refreshAuthToken(installationsImpl).catch(console.error);
    }
    return installationEntry.fid;
}

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Returns a Firebase Installations auth token, identifying the current
 * Firebase Installation.
 * @param installations - The `Installations` instance.
 * @param forceRefresh - Force refresh regardless of token expiration.
 *
 * @public
 */
async function getToken(installations, forceRefresh = false) {
    const installationsImpl = installations;
    await completeInstallationRegistration(installationsImpl);
    // At this point we either have a Registered Installation in the DB, or we've
    // already thrown an error.
    const authToken = await refreshAuthToken(installationsImpl, forceRefresh);
    return authToken.token;
}
async function completeInstallationRegistration(installations) {
    const { registrationPromise } = await getInstallationEntry(installations);
    if (registrationPromise) {
        // A createInstallation request is in progress. Wait until it finishes.
        await registrationPromise;
    }
}

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function deleteInstallationRequest(appConfig, installationEntry) {
    const endpoint = getDeleteEndpoint(appConfig, installationEntry);
    const headers = getHeadersWithAuth(appConfig, installationEntry);
    const request = {
        method: 'DELETE',
        headers
    };
    const response = await retryIfServerError(() => fetch(endpoint, request));
    if (!response.ok) {
        throw await getErrorFromResponse('Delete Installation', response);
    }
}
function getDeleteEndpoint(appConfig, { fid }) {
    return `${getInstallationsEndpoint(appConfig)}/${fid}`;
}

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Deletes the Firebase Installation and all associated data.
 * @param installations - The `Installations` instance.
 *
 * @public
 */
async function deleteInstallations(installations) {
    const { appConfig } = installations;
    const entry = await update(appConfig, oldEntry => {
        if (oldEntry && oldEntry.registrationStatus === 0 /* RequestStatus.NOT_STARTED */) {
            // Delete the unregistered entry without sending a deleteInstallation request.
            return undefined;
        }
        return oldEntry;
    });
    if (entry) {
        if (entry.registrationStatus === 1 /* RequestStatus.IN_PROGRESS */) {
            // Can't delete while trying to register.
            throw ERROR_FACTORY.create("delete-pending-registration" /* ErrorCode.DELETE_PENDING_REGISTRATION */);
        }
        else if (entry.registrationStatus === 2 /* RequestStatus.COMPLETED */) {
            if (!navigator.onLine) {
                throw ERROR_FACTORY.create("app-offline" /* ErrorCode.APP_OFFLINE */);
            }
            else {
                await deleteInstallationRequest(appConfig, entry);
                await remove(appConfig);
            }
        }
    }
}

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Sets a new callback that will get called when Installation ID changes.
 * Returns an unsubscribe function that will remove the callback when called.
 * @param installations - The `Installations` instance.
 * @param callback - The callback function that is invoked when FID changes.
 * @returns A function that can be called to unsubscribe.
 *
 * @public
 */
function onIdChange(installations, callback) {
    const { appConfig } = installations;
    addCallback(appConfig, callback);
    return () => {
        removeCallback(appConfig, callback);
    };
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Returns an instance of {@link Installations} associated with the given
 * {@link @firebase/app#FirebaseApp} instance.
 * @param app - The {@link @firebase/app#FirebaseApp} instance.
 *
 * @public
 */
function getInstallations(app = (0,_firebase_app__WEBPACK_IMPORTED_MODULE_0__.getApp)()) {
    const installationsImpl = (0,_firebase_app__WEBPACK_IMPORTED_MODULE_0__._getProvider)(app, 'installations').getImmediate();
    return installationsImpl;
}

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function extractAppConfig(app) {
    if (!app || !app.options) {
        throw getMissingValueError('App Configuration');
    }
    if (!app.name) {
        throw getMissingValueError('App Name');
    }
    // Required app config keys
    const configKeys = [
        'projectId',
        'apiKey',
        'appId'
    ];
    for (const keyName of configKeys) {
        if (!app.options[keyName]) {
            throw getMissingValueError(keyName);
        }
    }
    return {
        appName: app.name,
        projectId: app.options.projectId,
        apiKey: app.options.apiKey,
        appId: app.options.appId
    };
}
function getMissingValueError(valueName) {
    return ERROR_FACTORY.create("missing-app-config-values" /* ErrorCode.MISSING_APP_CONFIG_VALUES */, {
        valueName
    });
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const INSTALLATIONS_NAME = 'installations';
const INSTALLATIONS_NAME_INTERNAL = 'installations-internal';
const publicFactory = (container) => {
    const app = container.getProvider('app').getImmediate();
    // Throws if app isn't configured properly.
    const appConfig = extractAppConfig(app);
    const heartbeatServiceProvider = (0,_firebase_app__WEBPACK_IMPORTED_MODULE_0__._getProvider)(app, 'heartbeat');
    const installationsImpl = {
        app,
        appConfig,
        heartbeatServiceProvider,
        _delete: () => Promise.resolve()
    };
    return installationsImpl;
};
const internalFactory = (container) => {
    const app = container.getProvider('app').getImmediate();
    // Internal FIS instance relies on public FIS instance.
    const installations = (0,_firebase_app__WEBPACK_IMPORTED_MODULE_0__._getProvider)(app, INSTALLATIONS_NAME).getImmediate();
    const installationsInternal = {
        getId: () => getId(installations),
        getToken: (forceRefresh) => getToken(installations, forceRefresh)
    };
    return installationsInternal;
};
function registerInstallations() {
    (0,_firebase_app__WEBPACK_IMPORTED_MODULE_0__._registerComponent)(new _firebase_component__WEBPACK_IMPORTED_MODULE_1__.Component(INSTALLATIONS_NAME, publicFactory, "PUBLIC" /* ComponentType.PUBLIC */));
    (0,_firebase_app__WEBPACK_IMPORTED_MODULE_0__._registerComponent)(new _firebase_component__WEBPACK_IMPORTED_MODULE_1__.Component(INSTALLATIONS_NAME_INTERNAL, internalFactory, "PRIVATE" /* ComponentType.PRIVATE */));
}

/**
 * The Firebase Installations Web SDK.
 * This SDK does not work in a Node.js environment.
 *
 * @packageDocumentation
 */
registerInstallations();
(0,_firebase_app__WEBPACK_IMPORTED_MODULE_0__.registerVersion)(name, version);
// BUILD_TARGET will be replaced by values like esm, cjs, etc during the compilation
(0,_firebase_app__WEBPACK_IMPORTED_MODULE_0__.registerVersion)(name, version, 'esm2020');


//# sourceMappingURL=index.esm.js.map


/***/ }),

/***/ "./node_modules/@firebase/logger/dist/esm/index.esm.js":
/*!*************************************************************!*\
  !*** ./node_modules/@firebase/logger/dist/esm/index.esm.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LogLevel: function() { return /* binding */ LogLevel; },
/* harmony export */   Logger: function() { return /* binding */ Logger; },
/* harmony export */   setLogLevel: function() { return /* binding */ setLogLevel; },
/* harmony export */   setUserLogHandler: function() { return /* binding */ setUserLogHandler; }
/* harmony export */ });
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * A container for all of the Logger instances
 */
const instances = [];
/**
 * The JS SDK supports 5 log levels and also allows a user the ability to
 * silence the logs altogether.
 *
 * The order is a follows:
 * DEBUG < VERBOSE < INFO < WARN < ERROR
 *
 * All of the log types above the current log level will be captured (i.e. if
 * you set the log level to `INFO`, errors will still be logged, but `DEBUG` and
 * `VERBOSE` logs will not)
 */
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["VERBOSE"] = 1] = "VERBOSE";
    LogLevel[LogLevel["INFO"] = 2] = "INFO";
    LogLevel[LogLevel["WARN"] = 3] = "WARN";
    LogLevel[LogLevel["ERROR"] = 4] = "ERROR";
    LogLevel[LogLevel["SILENT"] = 5] = "SILENT";
})(LogLevel || (LogLevel = {}));
const levelStringToEnum = {
    'debug': LogLevel.DEBUG,
    'verbose': LogLevel.VERBOSE,
    'info': LogLevel.INFO,
    'warn': LogLevel.WARN,
    'error': LogLevel.ERROR,
    'silent': LogLevel.SILENT
};
/**
 * The default log level
 */
const defaultLogLevel = LogLevel.INFO;
/**
 * By default, `console.debug` is not displayed in the developer console (in
 * chrome). To avoid forcing users to have to opt-in to these logs twice
 * (i.e. once for firebase, and once in the console), we are sending `DEBUG`
 * logs to the `console.log` function.
 */
const ConsoleMethod = {
    [LogLevel.DEBUG]: 'log',
    [LogLevel.VERBOSE]: 'log',
    [LogLevel.INFO]: 'info',
    [LogLevel.WARN]: 'warn',
    [LogLevel.ERROR]: 'error'
};
/**
 * The default log handler will forward DEBUG, VERBOSE, INFO, WARN, and ERROR
 * messages on to their corresponding console counterparts (if the log method
 * is supported by the current log level)
 */
const defaultLogHandler = (instance, logType, ...args) => {
    if (logType < instance.logLevel) {
        return;
    }
    const now = new Date().toISOString();
    const method = ConsoleMethod[logType];
    if (method) {
        console[method](`[${now}]  ${instance.name}:`, ...args);
    }
    else {
        throw new Error(`Attempted to log a message with an invalid logType (value: ${logType})`);
    }
};
class Logger {
    /**
     * Gives you an instance of a Logger to capture messages according to
     * Firebase's logging scheme.
     *
     * @param name The name that the logs will be associated with
     */
    constructor(name) {
        this.name = name;
        /**
         * The log level of the given Logger instance.
         */
        this._logLevel = defaultLogLevel;
        /**
         * The main (internal) log handler for the Logger instance.
         * Can be set to a new function in internal package code but not by user.
         */
        this._logHandler = defaultLogHandler;
        /**
         * The optional, additional, user-defined log handler for the Logger instance.
         */
        this._userLogHandler = null;
        /**
         * Capture the current instance for later use
         */
        instances.push(this);
    }
    get logLevel() {
        return this._logLevel;
    }
    set logLevel(val) {
        if (!(val in LogLevel)) {
            throw new TypeError(`Invalid value "${val}" assigned to \`logLevel\``);
        }
        this._logLevel = val;
    }
    // Workaround for setter/getter having to be the same type.
    setLogLevel(val) {
        this._logLevel = typeof val === 'string' ? levelStringToEnum[val] : val;
    }
    get logHandler() {
        return this._logHandler;
    }
    set logHandler(val) {
        if (typeof val !== 'function') {
            throw new TypeError('Value assigned to `logHandler` must be a function');
        }
        this._logHandler = val;
    }
    get userLogHandler() {
        return this._userLogHandler;
    }
    set userLogHandler(val) {
        this._userLogHandler = val;
    }
    /**
     * The functions below are all based on the `console` interface
     */
    debug(...args) {
        this._userLogHandler && this._userLogHandler(this, LogLevel.DEBUG, ...args);
        this._logHandler(this, LogLevel.DEBUG, ...args);
    }
    log(...args) {
        this._userLogHandler &&
            this._userLogHandler(this, LogLevel.VERBOSE, ...args);
        this._logHandler(this, LogLevel.VERBOSE, ...args);
    }
    info(...args) {
        this._userLogHandler && this._userLogHandler(this, LogLevel.INFO, ...args);
        this._logHandler(this, LogLevel.INFO, ...args);
    }
    warn(...args) {
        this._userLogHandler && this._userLogHandler(this, LogLevel.WARN, ...args);
        this._logHandler(this, LogLevel.WARN, ...args);
    }
    error(...args) {
        this._userLogHandler && this._userLogHandler(this, LogLevel.ERROR, ...args);
        this._logHandler(this, LogLevel.ERROR, ...args);
    }
}
function setLogLevel(level) {
    instances.forEach(inst => {
        inst.setLogLevel(level);
    });
}
function setUserLogHandler(logCallback, options) {
    for (const instance of instances) {
        let customLogLevel = null;
        if (options && options.level) {
            customLogLevel = levelStringToEnum[options.level];
        }
        if (logCallback === null) {
            instance.userLogHandler = null;
        }
        else {
            instance.userLogHandler = (instance, level, ...args) => {
                const message = args
                    .map(arg => {
                    if (arg == null) {
                        return null;
                    }
                    else if (typeof arg === 'string') {
                        return arg;
                    }
                    else if (typeof arg === 'number' || typeof arg === 'boolean') {
                        return arg.toString();
                    }
                    else if (arg instanceof Error) {
                        return arg.message;
                    }
                    else {
                        try {
                            return JSON.stringify(arg);
                        }
                        catch (ignored) {
                            return null;
                        }
                    }
                })
                    .filter(arg => arg)
                    .join(' ');
                if (level >= (customLogLevel ?? instance.logLevel)) {
                    logCallback({
                        level: LogLevel[level].toLowerCase(),
                        message,
                        args,
                        type: instance.name
                    });
                }
            };
        }
    }
}


//# sourceMappingURL=index.esm.js.map


/***/ }),

/***/ "./node_modules/@firebase/messaging/dist/esm/index.esm.js":
/*!****************************************************************!*\
  !*** ./node_modules/@firebase/messaging/dist/esm/index.esm.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   deleteToken: function() { return /* binding */ deleteToken; },
/* harmony export */   getMessaging: function() { return /* binding */ getMessagingInWindow; },
/* harmony export */   getToken: function() { return /* binding */ getToken; },
/* harmony export */   isSupported: function() { return /* binding */ isWindowSupported; },
/* harmony export */   onMessage: function() { return /* binding */ onMessage; },
/* harmony export */   onRegistered: function() { return /* binding */ onRegistered; },
/* harmony export */   onUnregistered: function() { return /* binding */ onUnregistered; },
/* harmony export */   register: function() { return /* binding */ register; },
/* harmony export */   unregister: function() { return /* binding */ unregister; }
/* harmony export */ });
/* harmony import */ var _firebase_installations__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @firebase/installations */ "./node_modules/@firebase/installations/dist/esm/index.esm.js");
/* harmony import */ var _firebase_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @firebase/component */ "./node_modules/@firebase/component/dist/esm/index.esm.js");
/* harmony import */ var idb__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! idb */ "./node_modules/idb/build/index.js");
/* harmony import */ var _firebase_util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @firebase/util */ "./node_modules/@firebase/util/dist/index.esm.js");
/* harmony import */ var _firebase_app__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @firebase/app */ "./node_modules/@firebase/app/dist/esm/index.esm.js");






/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const DEFAULT_SW_PATH = '/firebase-messaging-sw.js';
const DEFAULT_SW_SCOPE = '/firebase-cloud-messaging-push-scope';
const DEFAULT_VAPID_KEY = 'BDOU99-h67HcA6JeFXHbSNMu7e2yNNu3RzoMj8TM4W88jITfq7ZmPvIM1Iv-4_l2LxQcYwhqby2xGpWwzjfAnG4';
const ENDPOINT = 'https://fcmregistrations.googleapis.com/v1';
const CONSOLE_CAMPAIGN_ID = 'google.c.a.c_id';
const CONSOLE_CAMPAIGN_NAME = 'google.c.a.c_l';
const CONSOLE_CAMPAIGN_TIME = 'google.c.a.ts';
/** Set to '1' if Analytics is enabled for the campaign */
const CONSOLE_CAMPAIGN_ANALYTICS_ENABLED = 'google.c.a.e';
const DEFAULT_REGISTRATION_TIMEOUT = 10000;
var MessageType$1;
(function (MessageType) {
    MessageType[MessageType["DATA_MESSAGE"] = 1] = "DATA_MESSAGE";
    MessageType[MessageType["DISPLAY_NOTIFICATION"] = 3] = "DISPLAY_NOTIFICATION";
})(MessageType$1 || (MessageType$1 = {}));

/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */
var MessageType;
(function (MessageType) {
    MessageType["PUSH_RECEIVED"] = "push-received";
    MessageType["NOTIFICATION_CLICKED"] = "notification-clicked";
    MessageType["FID_REGISTERED"] = "fid-registered";
})(MessageType || (MessageType = {}));

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function arrayToBase64(array) {
    const uint8Array = new Uint8Array(array);
    const base64String = btoa(String.fromCharCode(...uint8Array));
    return base64String.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}
function base64ToArray(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');
    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const OLD_DB_NAME = 'fcm_token_details_db';
/**
 * The last DB version of 'fcm_token_details_db' was 4. This is one higher, so that the upgrade
 * callback is called for all versions of the old DB.
 */
const OLD_DB_VERSION = 5;
const OLD_OBJECT_STORE_NAME = 'fcm_token_object_Store';
async function migrateOldDatabase(senderId) {
    if ('databases' in indexedDB) {
        // indexedDb.databases() is an IndexedDB v3 API and does not exist in all browsers. TODO: Remove
        // typecast when it lands in TS types.
        const databases = await indexedDB.databases();
        const dbNames = databases.map(db => db.name);
        if (!dbNames.includes(OLD_DB_NAME)) {
            // old DB didn't exist, no need to open.
            return null;
        }
    }
    let tokenDetails = null;
    const db = await (0,idb__WEBPACK_IMPORTED_MODULE_2__.openDB)(OLD_DB_NAME, OLD_DB_VERSION, {
        upgrade: async (db, oldVersion, newVersion, upgradeTransaction) => {
            if (oldVersion < 2) {
                // Database too old, skip migration.
                return;
            }
            if (!db.objectStoreNames.contains(OLD_OBJECT_STORE_NAME)) {
                // Database did not exist. Nothing to do.
                return;
            }
            const objectStore = upgradeTransaction.objectStore(OLD_OBJECT_STORE_NAME);
            const value = await objectStore.index('fcmSenderId').get(senderId);
            await objectStore.clear();
            if (!value) {
                // No entry in the database, nothing to migrate.
                return;
            }
            if (oldVersion === 2) {
                const oldDetails = value;
                if (!oldDetails.auth || !oldDetails.p256dh || !oldDetails.endpoint) {
                    return;
                }
                tokenDetails = {
                    token: oldDetails.fcmToken,
                    createTime: oldDetails.createTime ?? Date.now(),
                    subscriptionOptions: {
                        auth: oldDetails.auth,
                        p256dh: oldDetails.p256dh,
                        endpoint: oldDetails.endpoint,
                        swScope: oldDetails.swScope,
                        vapidKey: typeof oldDetails.vapidKey === 'string'
                            ? oldDetails.vapidKey
                            : arrayToBase64(oldDetails.vapidKey)
                    }
                };
            }
            else if (oldVersion === 3) {
                const oldDetails = value;
                tokenDetails = {
                    token: oldDetails.fcmToken,
                    createTime: oldDetails.createTime,
                    subscriptionOptions: {
                        auth: arrayToBase64(oldDetails.auth),
                        p256dh: arrayToBase64(oldDetails.p256dh),
                        endpoint: oldDetails.endpoint,
                        swScope: oldDetails.swScope,
                        vapidKey: arrayToBase64(oldDetails.vapidKey)
                    }
                };
            }
            else if (oldVersion === 4) {
                const oldDetails = value;
                tokenDetails = {
                    token: oldDetails.fcmToken,
                    createTime: oldDetails.createTime,
                    subscriptionOptions: {
                        auth: arrayToBase64(oldDetails.auth),
                        p256dh: arrayToBase64(oldDetails.p256dh),
                        endpoint: oldDetails.endpoint,
                        swScope: oldDetails.swScope,
                        vapidKey: arrayToBase64(oldDetails.vapidKey)
                    }
                };
            }
        }
    });
    db.close();
    // Delete all old databases.
    await (0,idb__WEBPACK_IMPORTED_MODULE_2__.deleteDB)(OLD_DB_NAME);
    await (0,idb__WEBPACK_IMPORTED_MODULE_2__.deleteDB)('fcm_vapid_details_db');
    await (0,idb__WEBPACK_IMPORTED_MODULE_2__.deleteDB)('undefined');
    return checkTokenDetails(tokenDetails) ? tokenDetails : null;
}
function checkTokenDetails(tokenDetails) {
    if (!tokenDetails || !tokenDetails.subscriptionOptions) {
        return false;
    }
    const { subscriptionOptions } = tokenDetails;
    return (typeof tokenDetails.createTime === 'number' &&
        tokenDetails.createTime > 0 &&
        typeof tokenDetails.token === 'string' &&
        tokenDetails.token.length > 0 &&
        typeof subscriptionOptions.auth === 'string' &&
        subscriptionOptions.auth.length > 0 &&
        typeof subscriptionOptions.p256dh === 'string' &&
        subscriptionOptions.p256dh.length > 0 &&
        typeof subscriptionOptions.endpoint === 'string' &&
        subscriptionOptions.endpoint.length > 0 &&
        typeof subscriptionOptions.swScope === 'string' &&
        subscriptionOptions.swScope.length > 0 &&
        typeof subscriptionOptions.vapidKey === 'string' &&
        subscriptionOptions.vapidKey.length > 0);
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const ERROR_MAP = {
    ["missing-app-config-values" /* ErrorCode.MISSING_APP_CONFIG_VALUES */]: 'Missing App configuration value: "{$valueName}"',
    ["only-available-in-window" /* ErrorCode.AVAILABLE_IN_WINDOW */]: 'This method is available in a Window context.',
    ["only-available-in-sw" /* ErrorCode.AVAILABLE_IN_SW */]: 'This method is available in a service worker context.',
    ["permission-default" /* ErrorCode.PERMISSION_DEFAULT */]: 'The notification permission was not granted and dismissed instead.',
    ["permission-blocked" /* ErrorCode.PERMISSION_BLOCKED */]: 'The notification permission was not granted and blocked instead.',
    ["unsupported-browser" /* ErrorCode.UNSUPPORTED_BROWSER */]: "This browser doesn't support the API's required to use the Firebase SDK.",
    ["indexed-db-unsupported" /* ErrorCode.INDEXED_DB_UNSUPPORTED */]: "This browser doesn't support indexedDb.open() (ex. Safari iFrame, Firefox Private Browsing, etc)",
    ["failed-service-worker-registration" /* ErrorCode.FAILED_DEFAULT_REGISTRATION */]: 'We are unable to register the default service worker. {$browserErrorMessage}',
    ["token-subscribe-failed" /* ErrorCode.TOKEN_SUBSCRIBE_FAILED */]: 'A problem occurred while subscribing the user to FCM: {$errorInfo}',
    ["token-subscribe-no-token" /* ErrorCode.TOKEN_SUBSCRIBE_NO_TOKEN */]: 'FCM returned no token when subscribing the user to push.',
    ["fid-registration-failed" /* ErrorCode.FID_REGISTRATION_FAILED */]: 'A problem occurred while creating an FCM registration via FID: {$errorInfo}',
    ["fid-unregister-failed" /* ErrorCode.FID_UNREGISTER_FAILED */]: 'A problem occurred while unregistering the FCM registration via FID: {$errorInfo}',
    ["fid-registration-idb-schema-unavailable" /* ErrorCode.FID_REGISTRATION_IDB_SCHEMA_UNAVAILABLE */]: 'Unable to read or persist FID registration metadata because the messaging ' +
        'IndexedDB schema is unavailable (for example, the database could not be ' +
        'upgraded to the latest version).',
    ["token-unsubscribe-failed" /* ErrorCode.TOKEN_UNSUBSCRIBE_FAILED */]: 'A problem occurred while unsubscribing the ' +
        'user from FCM: {$errorInfo}',
    ["token-update-failed" /* ErrorCode.TOKEN_UPDATE_FAILED */]: 'A problem occurred while updating the user from FCM: {$errorInfo}',
    ["token-update-no-token" /* ErrorCode.TOKEN_UPDATE_NO_TOKEN */]: 'FCM returned no token when updating the user to push.',
    ["use-sw-after-get-token" /* ErrorCode.USE_SW_AFTER_GET_TOKEN */]: 'The useServiceWorker() method may only be called once and must be ' +
        'called before calling getToken() to ensure your service worker is used.',
    ["invalid-sw-registration" /* ErrorCode.INVALID_SW_REGISTRATION */]: 'The input to useServiceWorker() must be a ServiceWorkerRegistration.',
    ["invalid-bg-handler" /* ErrorCode.INVALID_BG_HANDLER */]: 'The input to setBackgroundMessageHandler() must be a function.',
    ["invalid-vapid-key" /* ErrorCode.INVALID_VAPID_KEY */]: 'The public VAPID key must be a string.',
    ["use-vapid-key-after-get-token" /* ErrorCode.USE_VAPID_KEY_AFTER_GET_TOKEN */]: 'The usePublicVapidKey() method may only be called once and must be ' +
        'called before calling getToken() to ensure your VAPID key is used.',
    ["invalid-on-registered-handler" /* ErrorCode.INVALID_ON_REGISTERED_HANDLER */]: 'No onRegistered callback handler was provided or registered. Implement onRegistered() before register().'
};
const ERROR_FACTORY = new _firebase_util__WEBPACK_IMPORTED_MODULE_3__.ErrorFactory('messaging', 'Messaging', ERROR_MAP);

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const DATABASE_NAME = 'firebase-messaging-database';
const DATABASE_VERSION = 2;
const TOKEN_OBJECT_STORE_NAME = 'firebase-messaging-store';
const FID_REGISTRATION_OBJECT_STORE_NAME = 'firebase-messaging-fid-registration-store';
const defaultIdb = { openDB: idb__WEBPACK_IMPORTED_MODULE_2__.openDB, deleteDB: idb__WEBPACK_IMPORTED_MODULE_2__.deleteDB };
let idbImpl = defaultIdb;
// Open v2, but fall back to v1 if upgrade/open fails. Cache as `unknown` and guard store access.
let dbPromise = null;
function migrateMessagingDb(upgradeDb, oldVersion, targetSchemaVersion) {
    // Intentional fall-through for v2: run all intermediate migrations.
    // eslint-disable-next-line default-case
    switch (oldVersion) {
        case 0:
            upgradeDb.createObjectStore(TOKEN_OBJECT_STORE_NAME);
            if (targetSchemaVersion === 1) {
                break;
            }
        // fall through
        case 1:
            if (targetSchemaVersion === 2) {
                upgradeDb.createObjectStore(FID_REGISTRATION_OBJECT_STORE_NAME);
            }
    }
}
function createOpenDbOptions(targetSchemaVersion) {
    return {
        upgrade: (upgradeDb, oldVersion) => {
            migrateMessagingDb(upgradeDb, oldVersion, targetSchemaVersion);
        },
        blocked: () => {
            /* no-op */
        },
        blocking: (_currentVersion, _blockedVersion, event) => {
            dbPromise = null;
            event.target?.close();
        },
        terminated: () => {
            dbPromise = null;
        }
    };
}
function getDbPromise() {
    if (!dbPromise) {
        const openLatest = idbImpl.openDB(DATABASE_NAME, DATABASE_VERSION, createOpenDbOptions(2));
        // Assign synchronously to avoid concurrent openDB() calls.
        dbPromise = openLatest.catch(() => idbImpl.openDB(DATABASE_NAME, DATABASE_VERSION - 1, createOpenDbOptions(1)));
    }
    return dbPromise;
}
function hasObjectStore(db, storeName) {
    return db.objectStoreNames.contains(storeName);
}
function assertFidRegistrationObjectStore(db) {
    if (!hasObjectStore(db, FID_REGISTRATION_OBJECT_STORE_NAME)) {
        throw ERROR_FACTORY.create("fid-registration-idb-schema-unavailable" /* ErrorCode.FID_REGISTRATION_IDB_SCHEMA_UNAVAILABLE */);
    }
}
async function dbGet(firebaseDependencies) {
    const key = getKey(firebaseDependencies);
    const db = await getDbPromise();
    const tokenDetails = (await db
        .transaction(TOKEN_OBJECT_STORE_NAME)
        .objectStore(TOKEN_OBJECT_STORE_NAME)
        .get(key));
    if (tokenDetails) {
        return tokenDetails;
    }
    else {
        const oldTokenDetails = await migrateOldDatabase(firebaseDependencies.appConfig.senderId);
        if (oldTokenDetails) {
            await dbSet(firebaseDependencies, oldTokenDetails);
            return oldTokenDetails;
        }
    }
}
async function dbSet(firebaseDependencies, tokenDetails) {
    const key = getKey(firebaseDependencies);
    const db = await getDbPromise();
    const stores = [TOKEN_OBJECT_STORE_NAME];
    const hasFidStore = hasObjectStore(db, FID_REGISTRATION_OBJECT_STORE_NAME);
    if (hasFidStore) {
        stores.push(FID_REGISTRATION_OBJECT_STORE_NAME);
    }
    const tx = db.transaction(stores, 'readwrite');
    await tx.objectStore(TOKEN_OBJECT_STORE_NAME).put(tokenDetails, key);
    if (hasFidStore) {
        await tx.objectStore(FID_REGISTRATION_OBJECT_STORE_NAME).delete(key);
    }
    await tx.done;
    return tokenDetails;
}
async function dbRemove(firebaseDependencies) {
    const key = getKey(firebaseDependencies);
    const db = await getDbPromise();
    const tx = db.transaction(TOKEN_OBJECT_STORE_NAME, 'readwrite');
    await tx.objectStore(TOKEN_OBJECT_STORE_NAME).delete(key);
    await tx.done;
}
async function dbGetFidRegistration(firebaseDependencies) {
    const key = getKey(firebaseDependencies);
    const db = await getDbPromise();
    assertFidRegistrationObjectStore(db);
    return (await db
        .transaction(FID_REGISTRATION_OBJECT_STORE_NAME)
        .objectStore(FID_REGISTRATION_OBJECT_STORE_NAME)
        .get(key));
}
async function dbSetFidRegistration(firebaseDependencies, details) {
    const key = getKey(firebaseDependencies);
    const db = await getDbPromise();
    assertFidRegistrationObjectStore(db);
    const tx = db.transaction([TOKEN_OBJECT_STORE_NAME, FID_REGISTRATION_OBJECT_STORE_NAME], 'readwrite');
    await tx.objectStore(FID_REGISTRATION_OBJECT_STORE_NAME).put(details, key);
    await tx.objectStore(TOKEN_OBJECT_STORE_NAME).delete(key);
    await tx.done;
    return details;
}
async function dbRemoveFidRegistration(firebaseDependencies) {
    const key = getKey(firebaseDependencies);
    const db = await getDbPromise();
    assertFidRegistrationObjectStore(db);
    const tx = db.transaction(FID_REGISTRATION_OBJECT_STORE_NAME, 'readwrite');
    await tx.objectStore(FID_REGISTRATION_OBJECT_STORE_NAME).delete(key);
    await tx.done;
}
function getKey({ appConfig }) {
    return appConfig.appId;
}

const name = "@firebase/messaging";
const version = "0.13.0";

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/** Max attempts (initial fetch + retries) when CreateRegistration `fetch()` throws. */
const FID_REGISTRATION_FETCH_MAX_ATTEMPTS = 3;
/** Base delay in ms; backoff is `BASE * 2^attempt` after each failed attempt. */
const FID_REGISTRATION_FETCH_BASE_BACKOFF_MS = 1000;
async function requestGetToken(firebaseDependencies, subscriptionOptions) {
    const headers = await getHeaders(firebaseDependencies);
    const body = getBody(subscriptionOptions, firebaseDependencies.appConfig.appName, 
    /* includeSdkVersion= */ false);
    const subscribeOptions = {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
    };
    let responseData;
    try {
        const response = await fetch(getEndpoint(firebaseDependencies.appConfig), subscribeOptions);
        responseData = await response.json();
    }
    catch (err) {
        throw ERROR_FACTORY.create("token-subscribe-failed" /* ErrorCode.TOKEN_SUBSCRIBE_FAILED */, {
            errorInfo: err?.toString()
        });
    }
    if (responseData.error) {
        const message = responseData.error.message;
        throw ERROR_FACTORY.create("token-subscribe-failed" /* ErrorCode.TOKEN_SUBSCRIBE_FAILED */, {
            errorInfo: message
        });
    }
    if (!responseData.token) {
        throw ERROR_FACTORY.create("token-subscribe-no-token" /* ErrorCode.TOKEN_SUBSCRIBE_NO_TOKEN */);
    }
    return responseData.token;
}
async function requestCreateRegistration(firebaseDependencies, subscriptionOptions) {
    const headers = await getHeaders(firebaseDependencies);
    const body = getBody(subscriptionOptions, firebaseDependencies.appConfig.appName, 
    /* includeSdkVersion= */ true);
    const subscribeOptions = {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
    };
    let response;
    try {
        response = await fetchWithExponentialRetry(() => fetch(getEndpoint(firebaseDependencies.appConfig), subscribeOptions), FID_REGISTRATION_FETCH_MAX_ATTEMPTS, FID_REGISTRATION_FETCH_BASE_BACKOFF_MS);
    }
    catch (err) {
        throw ERROR_FACTORY.create("fid-registration-failed" /* ErrorCode.FID_REGISTRATION_FAILED */, {
            errorInfo: err?.toString()
        });
    }
    if (response.ok) {
        const responseFid = await parseCreateRegistrationSuccessFid(response);
        return { responseFid };
    }
    // `fetch()` succeeded, but the backend returned a non-2xx response.
    // Best-effort parse the body to extract `error.message`, but always fail with
    // `FID_REGISTRATION_FAILED` to keep the error surface uniform.
    // Best-effort extraction of error details; the main signal is response.ok / status.
    let responseData;
    try {
        responseData = (await response.json());
    }
    catch (err) {
        throw ERROR_FACTORY.create("fid-registration-failed" /* ErrorCode.FID_REGISTRATION_FAILED */, {
            errorInfo: response.statusText
        });
    }
    const message = responseData.error?.message ?? response.statusText;
    throw ERROR_FACTORY.create("fid-registration-failed" /* ErrorCode.FID_REGISTRATION_FAILED */, {
        errorInfo: message
    });
}
/**
 * Deletes an FCM Web registration via DeleteRegistration using the Firebase Installation ID (FID).
 */
async function requestDeleteRegistration(firebaseDependencies, fid) {
    const headers = await getHeaders(firebaseDependencies);
    const options = {
        method: 'DELETE',
        headers
    };
    let response;
    try {
        response = await fetch(`${getEndpoint(firebaseDependencies.appConfig)}/${fid}`, options);
    }
    catch (err) {
        throw ERROR_FACTORY.create("fid-unregister-failed" /* ErrorCode.FID_UNREGISTER_FAILED */, {
            errorInfo: err?.toString()
        });
    }
    if (response.ok) {
        return;
    }
    // Best-effort parse error details; surface uniform error code.
    try {
        const responseData = (await response.json());
        const message = responseData.error?.message ?? response.statusText;
        throw message;
    }
    catch (err) {
        // If parsing failed, fall back to status text.
        throw ERROR_FACTORY.create("fid-unregister-failed" /* ErrorCode.FID_UNREGISTER_FAILED */, {
            errorInfo: (typeof err === 'string' && err) ||
                response.statusText ||
                err?.toString()
        });
    }
}
/**
 * Parses a successful CreateRegistration body. The backend must return JSON with a non-empty
 * string `name`: a resource name `projects/{projectId}/registrations/{fid}`
 */
async function parseCreateRegistrationSuccessFid(response) {
    const text = await response.text();
    if (!text.trim()) {
        throw ERROR_FACTORY.create("fid-registration-failed" /* ErrorCode.FID_REGISTRATION_FAILED */, {
            errorInfo: 'CreateRegistration succeeded but response body is empty'
        });
    }
    let data;
    try {
        data = JSON.parse(text);
    }
    catch {
        throw ERROR_FACTORY.create("fid-registration-failed" /* ErrorCode.FID_REGISTRATION_FAILED */, {
            errorInfo: 'CreateRegistration succeeded but response body is not valid JSON'
        });
    }
    const name = data.name;
    if (typeof name !== 'string' || name.length === 0) {
        throw ERROR_FACTORY.create("fid-registration-failed" /* ErrorCode.FID_REGISTRATION_FAILED */, {
            errorInfo: 'CreateRegistration succeeded but response did not include a non-empty name'
        });
    }
    return parseFidFromRegistrationResourceName(name);
}
const REGISTRATIONS_NAME_SEGMENT = '/registrations/';
/** Extracts the Firebase Installation ID from CreateRegistration `name` (resource path). */
function parseFidFromRegistrationResourceName(name) {
    const segmentIndex = name.indexOf(REGISTRATIONS_NAME_SEGMENT);
    if (segmentIndex !== -1) {
        const fid = name.slice(segmentIndex + REGISTRATIONS_NAME_SEGMENT.length);
        if (fid.length > 0) {
            return fid;
        }
    }
    throw ERROR_FACTORY.create("fid-registration-failed" /* ErrorCode.FID_REGISTRATION_FAILED */, {
        errorInfo: 'CreateRegistration succeeded but response name is not a valid registration resource name'
    });
}
async function requestUpdateToken(firebaseDependencies, tokenDetails) {
    const headers = await getHeaders(firebaseDependencies);
    const body = getBody(tokenDetails.subscriptionOptions, firebaseDependencies.appConfig.appName, 
    /* includeSdkVersion= */ false);
    const updateOptions = {
        method: 'PATCH',
        headers,
        body: JSON.stringify(body)
    };
    let responseData;
    try {
        const response = await fetch(`${getEndpoint(firebaseDependencies.appConfig)}/${tokenDetails.token}`, updateOptions);
        responseData = await response.json();
    }
    catch (err) {
        throw ERROR_FACTORY.create("token-update-failed" /* ErrorCode.TOKEN_UPDATE_FAILED */, {
            errorInfo: err?.toString()
        });
    }
    if (responseData.error) {
        const message = responseData.error.message;
        throw ERROR_FACTORY.create("token-update-failed" /* ErrorCode.TOKEN_UPDATE_FAILED */, {
            errorInfo: message
        });
    }
    if (!responseData.token) {
        throw ERROR_FACTORY.create("token-update-no-token" /* ErrorCode.TOKEN_UPDATE_NO_TOKEN */);
    }
    return responseData.token;
}
async function requestDeleteToken(firebaseDependencies, token) {
    const headers = await getHeaders(firebaseDependencies);
    const unsubscribeOptions = {
        method: 'DELETE',
        headers
    };
    try {
        const response = await fetch(`${getEndpoint(firebaseDependencies.appConfig)}/${token}`, unsubscribeOptions);
        const responseData = await response.json();
        if (responseData.error) {
            const message = responseData.error.message;
            throw ERROR_FACTORY.create("token-unsubscribe-failed" /* ErrorCode.TOKEN_UNSUBSCRIBE_FAILED */, {
                errorInfo: message
            });
        }
    }
    catch (err) {
        throw ERROR_FACTORY.create("token-unsubscribe-failed" /* ErrorCode.TOKEN_UNSUBSCRIBE_FAILED */, {
            errorInfo: err?.toString()
        });
    }
}
/**
 * Re-runs `operation` when it throws, with exponential backoff between attempts.
 * Rethrows the last error if all attempts fail.
 */
async function fetchWithExponentialRetry(operation, maxAttempts, baseBackoffMs) {
    let lastError;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
            return await operation();
        }
        catch (err) {
            lastError = err;
            if (attempt < maxAttempts - 1) {
                const delayMs = baseBackoffMs * Math.pow(2, attempt);
                await new Promise(resolve => setTimeout(resolve, delayMs));
            }
        }
    }
    throw lastError;
}
function getEndpoint({ projectId }) {
    return `${ENDPOINT}/projects/${projectId}/registrations`;
}
async function getHeaders({ appConfig, installations }) {
    const authToken = await installations.getToken();
    return new Headers({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'x-goog-api-key': appConfig.apiKey,
        'x-goog-firebase-installations-auth': `FIS ${authToken}`
    });
}
/**
 * Hostname for the registering web client (e.g. `www.example.com`), or the app name
 * (`appNameFallback`) when the scope cannot be resolved (e.g. some test environments).
 */
function getRegistrationOrigin(swScope, appNameFallback) {
    try {
        if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(swScope)) {
            return new URL(swScope).host;
        }
    }
    catch {
        // Fall through to relative-scope handling.
    }
    try {
        if (typeof self !== 'undefined' && self.location?.href) {
            return new URL(swScope, self.location.origin).host;
        }
    }
    catch {
        // Fall through.
    }
    if (typeof self !== 'undefined' && self.location?.host) {
        return self.location.host;
    }
    return appNameFallback;
}
function getBody({ p256dh, auth, endpoint, vapidKey, swScope }, appNameFallback, includeSdkVersion) {
    const body = {
        web: {
            origin: getRegistrationOrigin(swScope, appNameFallback),
            endpoint,
            auth,
            p256dh
        }
    };
    if (includeSdkVersion) {
        // eslint-disable-next-line camelcase
        body.fcm_sdk_version = version;
    }
    if (vapidKey !== DEFAULT_VAPID_KEY) {
        body.web.applicationPubKey = vapidKey;
    }
    return body;
}

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// UpdateRegistration will be called once every week.
const TOKEN_EXPIRATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
async function getTokenInternal(messaging) {
    const pushSubscription = await getPushSubscription$1(messaging.swRegistration, messaging.vapidKey);
    const subscriptionOptions = {
        vapidKey: messaging.vapidKey,
        swScope: messaging.swRegistration.scope,
        endpoint: pushSubscription.endpoint,
        auth: arrayToBase64(pushSubscription.getKey('auth')),
        p256dh: arrayToBase64(pushSubscription.getKey('p256dh'))
    };
    const tokenDetails = await dbGet(messaging.firebaseDependencies);
    if (!tokenDetails) {
        // No token, get a new one.
        return getNewToken(messaging.firebaseDependencies, subscriptionOptions);
    }
    else if (!isTokenValid(tokenDetails.subscriptionOptions, subscriptionOptions)) {
        // Invalid token, get a new one.
        try {
            await requestDeleteToken(messaging.firebaseDependencies, tokenDetails.token);
        }
        catch (e) {
            // Suppress errors because of #2364
            console.warn(e);
        }
        return getNewToken(messaging.firebaseDependencies, subscriptionOptions);
    }
    else if (Date.now() >= tokenDetails.createTime + TOKEN_EXPIRATION_MS) {
        // Weekly token refresh
        return updateToken(messaging, {
            token: tokenDetails.token,
            createTime: Date.now(),
            subscriptionOptions
        });
    }
    else {
        // Valid token, nothing to do.
        return tokenDetails.token;
    }
}
/**
 * Legacy getToken() path: there is a token row in IndexedDB. Revoke it with FCM, drop the row, and
 * clear any leftover FID registration metadata (apps may mix APIs).
 */
async function revokeLegacyFcmTokenAndClearCaches(messaging, tokenDetails) {
    await requestDeleteToken(messaging.firebaseDependencies, tokenDetails.token);
    await dbRemove(messaging.firebaseDependencies);
    await removeFidRegistrationBestEffort(messaging.firebaseDependencies);
}
/**
 * No legacy token row: the client may only have FID-based registration (register() flow). If so,
 * delete that registration on the server, always scrub local FID metadata, then surface
 * onUnregistered when we actually had an FID.
 */
async function revokeFidRegistrationIfStored(messaging) {
    const stored = await dbGetFidRegistration(messaging.firebaseDependencies).catch(() => undefined);
    const fid = stored?.fid;
    if (fid) {
        await requestDeleteRegistration(messaging.firebaseDependencies, fid);
    }
    await removeFidRegistrationBestEffort(messaging.firebaseDependencies);
    if (fid) {
        notifyOnUnregistered(messaging, fid);
    }
}
/**
 * Revokes the app's FCM registration: legacy token (getToken/deleteToken) and/or FID-based
 * registration (register/unregister), clears local caches, notifies onUnregistered when a stored
 * FID existed, then unsubscribes the push subscription when present.
 */
async function revokeRegistrationInternal(messaging) {
    const tokenDetails = await dbGet(messaging.firebaseDependencies);
    if (tokenDetails) {
        await revokeLegacyFcmTokenAndClearCaches(messaging, tokenDetails);
    }
    else {
        await revokeFidRegistrationIfStored(messaging);
    }
    // Unsubscribe from the push subscription.
    const pushSubscription = await messaging.swRegistration.pushManager.getSubscription();
    if (pushSubscription) {
        return pushSubscription.unsubscribe();
    }
    // If there's no SW, consider it a success.
    return true;
}
async function updateToken(messaging, tokenDetails) {
    try {
        const updatedToken = await requestUpdateToken(messaging.firebaseDependencies, tokenDetails);
        const updatedTokenDetails = {
            ...tokenDetails,
            token: updatedToken,
            createTime: Date.now()
        };
        await dbSet(messaging.firebaseDependencies, updatedTokenDetails);
        return updatedToken;
    }
    catch (e) {
        throw e;
    }
}
async function getNewToken(firebaseDependencies, subscriptionOptions) {
    const token = await requestGetToken(firebaseDependencies, subscriptionOptions);
    const tokenDetails = {
        token,
        createTime: Date.now(),
        subscriptionOptions
    };
    await dbSet(firebaseDependencies, tokenDetails);
    return tokenDetails.token;
}
/**
 * Gets a PushSubscription for the current user.
 */
async function getPushSubscription$1(swRegistration, vapidKey) {
    const subscription = await swRegistration.pushManager.getSubscription();
    if (subscription) {
        return subscription;
    }
    return swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        // Chrome <= 75 doesn't support base64-encoded VAPID key. For backward compatibility, VAPID key
        // submitted to pushManager#subscribe must be of type Uint8Array.
        applicationServerKey: base64ToArray(vapidKey)
    });
}
/**
 * Checks if the saved tokenDetails object matches the configuration provided.
 */
function isTokenValid(dbOptions, currentOptions) {
    const isVapidKeyEqual = currentOptions.vapidKey === dbOptions.vapidKey;
    const isEndpointEqual = currentOptions.endpoint === dbOptions.endpoint;
    const isAuthEqual = currentOptions.auth === dbOptions.auth;
    const isP256dhEqual = currentOptions.p256dh === dbOptions.p256dh;
    return isVapidKeyEqual && isEndpointEqual && isAuthEqual && isP256dhEqual;
}
/** Clears FID registration metadata; apps may mix legacy getToken() with FID register/unregister. */
async function removeFidRegistrationBestEffort(firebaseDependencies) {
    try {
        await dbRemoveFidRegistration(firebaseDependencies);
    }
    catch {
        // Ignore.
    }
}
function notifyOnRegistered(messaging, fid) {
    const handler = messaging.onRegisteredHandler;
    if (!handler) {
        return;
    }
    if (typeof handler === 'function') {
        handler(fid);
    }
    else {
        handler.next(fid);
    }
}
function notifyOnUnregistered(messaging, fid) {
    const handler = messaging.onUnregisteredHandler;
    if (!handler) {
        return;
    }
    if (typeof handler === 'function') {
        handler(fid);
    }
    else {
        handler.next(fid);
    }
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function registerDefaultSw(messaging) {
    try {
        messaging.swRegistration = await navigator.serviceWorker.register(DEFAULT_SW_PATH, {
            scope: DEFAULT_SW_SCOPE
        });
        // The timing when browser updates sw when sw has an update is unreliable from experiment. It
        // leads to version conflict when the SDK upgrades to a newer version in the main page, but sw
        // is stuck with the old version. For example,
        // https://github.com/firebase/firebase-js-sdk/issues/2590 The following line reliably updates
        // sw if there was an update.
        messaging.swRegistration.update().catch(() => {
            /* it is non blocking and we don't care if it failed */
        });
        await waitForRegistrationActive(messaging.swRegistration);
    }
    catch (e) {
        throw ERROR_FACTORY.create("failed-service-worker-registration" /* ErrorCode.FAILED_DEFAULT_REGISTRATION */, {
            browserErrorMessage: e?.message
        });
    }
}
/**
 * Waits for registration to become active. MDN documentation claims that
 * a service worker registration should be ready to use after awaiting
 * navigator.serviceWorker.register() but that doesn't seem to be the case in
 * practice, causing the SDK to throw errors when calling
 * swRegistration.pushManager.subscribe() too soon after register(). The only
 * solution seems to be waiting for the service worker registration `state`
 * to become "active".
 */
async function waitForRegistrationActive(registration) {
    return new Promise((resolve, reject) => {
        const rejectTimeout = setTimeout(() => reject(new Error(`Service worker not registered after ${DEFAULT_REGISTRATION_TIMEOUT} ms`)), DEFAULT_REGISTRATION_TIMEOUT);
        const incomingSw = registration.installing || registration.waiting;
        if (registration.active) {
            clearTimeout(rejectTimeout);
            resolve();
        }
        else if (incomingSw) {
            incomingSw.onstatechange = ev => {
                if (ev.target?.state === 'activated') {
                    incomingSw.onstatechange = null;
                    clearTimeout(rejectTimeout);
                    resolve();
                }
            };
        }
        else {
            clearTimeout(rejectTimeout);
            reject(new Error('No incoming service worker found.'));
        }
    });
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function updateSwReg(messaging, swRegistration) {
    if (!swRegistration && !messaging.swRegistration) {
        await registerDefaultSw(messaging);
    }
    if (!swRegistration && !!messaging.swRegistration) {
        return;
    }
    if (!(swRegistration instanceof ServiceWorkerRegistration)) {
        throw ERROR_FACTORY.create("invalid-sw-registration" /* ErrorCode.INVALID_SW_REGISTRATION */);
    }
    messaging.swRegistration = swRegistration;
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function updateVapidKey(messaging, vapidKey) {
    if (!!vapidKey) {
        messaging.vapidKey = vapidKey;
    }
    else if (!messaging.vapidKey) {
        messaging.vapidKey = DEFAULT_VAPID_KEY;
    }
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/** Retries when CreateRegistration echoes an FID that does not match Installations.getId(). */
const FID_REGISTRATION_FID_MATCH_MAX_ATTEMPTS = 3;
/**
 * For the new FID-based register path:
 * - Create (or refresh) an FCM Web registration in the backend via CreateRegistration.
 * - Use the FIS auth token produced by the installations instance (implicitly associated with FID).
 * - CreateRegistration must echo the installation in `name` (e.g.
 *   `projects/{projectId}/registrations/{fid}`); it must match `expectedFid` from
 *   Installations.getId(). On mismatch we refresh the auth token and retry, then fail with
 *   `fid-registration-failed`.
 */
async function registerFcmRegistrationWithFid(messaging, expectedFid) {
    const pushSubscription = await getPushSubscription(messaging.swRegistration, messaging.vapidKey);
    const subscriptionOptions = {
        vapidKey: messaging.vapidKey,
        swScope: messaging.swRegistration.scope,
        endpoint: pushSubscription.endpoint,
        auth: arrayToBase64(pushSubscription.getKey('auth')),
        p256dh: arrayToBase64(pushSubscription.getKey('p256dh'))
    };
    const installations = messaging.firebaseDependencies.installations;
    for (let attempt = 0; attempt < FID_REGISTRATION_FID_MATCH_MAX_ATTEMPTS; attempt++) {
        const { responseFid } = await requestCreateRegistration(messaging.firebaseDependencies, subscriptionOptions);
        if (responseFid === expectedFid) {
            return;
        }
        // If CreateRegistration echoes an unexpected FID, the FIS auth token used for the request may
        // be stale relative to the installation the backend associates with the call. Force-refresh
        // the token before retrying so the next attempt uses credentials aligned with Installations.
        if (attempt < FID_REGISTRATION_FID_MATCH_MAX_ATTEMPTS - 1) {
            await installations.getToken(true);
        }
    }
    throw ERROR_FACTORY.create("fid-registration-failed" /* ErrorCode.FID_REGISTRATION_FAILED */, {
        errorInfo: 'CreateRegistration response FID does not match Firebase Installation ID'
    });
}
async function getPushSubscription(swRegistration, vapidKey) {
    const subscription = await swRegistration.pushManager.getSubscription();
    if (subscription) {
        return subscription;
    }
    // Chrome/Firefox require applicationServerKey to be of type Uint8Array.
    return swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        // `PushManager.subscribe` expects a `BufferSource`; `base64ToArray` produces a typed array.
        // Cast to satisfy the lib typing differences across TS DOM versions.
        applicationServerKey: base64ToArray(vapidKey)
    });
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const FID_REGISTRATION_REFRESH_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
/**
 * Registers the app instance with FCM using its Firebase Installation ID (FID). The FID is
 * delivered via the `onRegistered` callback. Call this to establish an FID-based identity.
 * Once `onRegistered` provides an FID, instruct your backend to remove any legacy token
 * previously associated with this instance. The backend send API supports FID as a target.
 *
 * When called multiple times, `onRegistered` is invoked on each call with the current FID.
 * Backend registration sync runs on first register, when the FID changes, or on weekly refresh.
 *
 * @param messaging - The MessagingService instance.
 * @param options - Optional. Same options as getToken (vapidKey, serviceWorkerRegistration).
 */
async function register$1(messaging, options) {
    if (!navigator) {
        throw ERROR_FACTORY.create("only-available-in-window" /* ErrorCode.AVAILABLE_IN_WINDOW */);
    }
    if (Notification.permission === 'default') {
        await Notification.requestPermission();
    }
    if (Notification.permission !== 'granted') {
        throw ERROR_FACTORY.create("permission-blocked" /* ErrorCode.PERMISSION_BLOCKED */);
    }
    if (!messaging.onRegisteredHandler) {
        throw ERROR_FACTORY.create("invalid-on-registered-handler" /* ErrorCode.INVALID_ON_REGISTERED_HANDLER */);
    }
    await updateVapidKey(messaging, options?.vapidKey);
    await updateSwReg(messaging, options?.serviceWorkerRegistration);
    // Keep the queue alive after a failed register() so future calls can retry.
    const prev = messaging._registerNotifyChain.catch(() => { });
    messaging._registerNotifyChain = prev.then(async () => {
        const fid = await messaging.firebaseDependencies.installations.getId();
        const stored = await dbGetFidRegistration(messaging.firebaseDependencies);
        const now = Date.now();
        const shouldRefresh = !stored ||
            stored.fid !== fid ||
            now >= stored.lastRegisterTime + FID_REGISTRATION_REFRESH_MS;
        if (shouldRefresh) {
            await registerFcmRegistrationWithFid(messaging, fid);
            await dbSetFidRegistration(messaging.firebaseDependencies, {
                fid,
                lastRegisterTime: now,
                vapidKey: messaging.vapidKey
            });
        }
        const handler = messaging.onRegisteredHandler;
        if (!handler) {
            throw ERROR_FACTORY.create("invalid-on-registered-handler" /* ErrorCode.INVALID_ON_REGISTERED_HANDLER */);
        }
        notifyOnRegistered(messaging, fid);
    });
    return messaging._registerNotifyChain;
}

/**
 * @license
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * When the Firebase Installation ID changes, re-run `register()` so FCM registration and
 * onRegistered run for the new FID. No-op if no onRegistered handler is set or the app
 * instance was never registered with FCM.
 */
function subscribeFidChangeRegistration(messaging, installations) {
    return (0,_firebase_installations__WEBPACK_IMPORTED_MODULE_0__.onIdChange)(installations, () => {
        void (async () => {
            if (!messaging.onRegisteredHandler) {
                return;
            }
            const stored = await dbGetFidRegistration(messaging.firebaseDependencies);
            if (!stored) {
                return;
            }
            await register$1(messaging).catch(() => {
                // Best-effort: permission may be revoked or SW unavailable after FID rotation.
            });
        })();
    });
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function externalizePayload(internalPayload) {
    const payload = {
        from: internalPayload.from,
        // eslint-disable-next-line camelcase
        collapseKey: internalPayload.collapse_key,
        // eslint-disable-next-line camelcase
        messageId: internalPayload.fcmMessageId
    };
    propagateNotificationPayload(payload, internalPayload);
    propagateDataPayload(payload, internalPayload);
    propagateFcmOptions(payload, internalPayload);
    return payload;
}
function propagateNotificationPayload(payload, messagePayloadInternal) {
    if (!messagePayloadInternal.notification) {
        return;
    }
    payload.notification = {};
    const title = messagePayloadInternal.notification.title;
    if (!!title) {
        payload.notification.title = title;
    }
    const body = messagePayloadInternal.notification.body;
    if (!!body) {
        payload.notification.body = body;
    }
    const image = messagePayloadInternal.notification.image;
    if (!!image) {
        payload.notification.image = image;
    }
    const icon = messagePayloadInternal.notification.icon;
    if (!!icon) {
        payload.notification.icon = icon;
    }
}
function propagateDataPayload(payload, messagePayloadInternal) {
    if (!messagePayloadInternal.data) {
        return;
    }
    payload.data = messagePayloadInternal.data;
}
function propagateFcmOptions(payload, messagePayloadInternal) {
    // fcmOptions.link value is written into notification.click_action. see more in b/232072111
    if (!messagePayloadInternal.fcmOptions &&
        !messagePayloadInternal.notification?.click_action) {
        return;
    }
    payload.fcmOptions = {};
    const link = messagePayloadInternal.fcmOptions?.link ??
        messagePayloadInternal.notification?.click_action;
    if (!!link) {
        payload.fcmOptions.link = link;
    }
    // eslint-disable-next-line camelcase
    const analyticsLabel = messagePayloadInternal.fcmOptions?.analytics_label;
    if (!!analyticsLabel) {
        payload.fcmOptions.analyticsLabel = analyticsLabel;
    }
}

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function isConsoleMessage(data) {
    // This message has a campaign ID, meaning it was sent using the Firebase Console.
    return typeof data === 'object' && !!data && CONSOLE_CAMPAIGN_ID in data;
}

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
_mergeStrings('AzSCbw63g1R0nCw85jG8', 'Iaya3yLKwmgvh7cF0q4');
function _mergeStrings(s1, s2) {
    const resultArray = [];
    for (let i = 0; i < s1.length; i++) {
        resultArray.push(s1.charAt(i));
        if (i < s2.length) {
            resultArray.push(s2.charAt(i));
        }
    }
    return resultArray.join('');
}

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function extractAppConfig(app) {
    if (!app || !app.options) {
        throw getMissingValueError('App Configuration Object');
    }
    if (!app.name) {
        throw getMissingValueError('App Name');
    }
    // Required app config keys
    const configKeys = [
        'projectId',
        'apiKey',
        'appId',
        'messagingSenderId'
    ];
    const { options } = app;
    for (const keyName of configKeys) {
        if (!options[keyName]) {
            throw getMissingValueError(keyName);
        }
    }
    return {
        appName: app.name,
        projectId: options.projectId,
        apiKey: options.apiKey,
        appId: options.appId,
        senderId: options.messagingSenderId
    };
}
function getMissingValueError(valueName) {
    return ERROR_FACTORY.create("missing-app-config-values" /* ErrorCode.MISSING_APP_CONFIG_VALUES */, {
        valueName
    });
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class MessagingService {
    constructor(app, installations, analyticsProvider) {
        // logging is only done with end user consent. Default to false.
        this.deliveryMetricsExportedToBigQueryEnabled = false;
        this.onBackgroundMessageHandler = null;
        this.onMessageHandler = null;
        /** Observer for the event that the app instance is registered with FCM via Firebase Installation ID (FID). */
        this.onRegisteredHandler = null;
        /** Observer for the event that the app instance is unregistered from FCM (FID no longer active). */
        this.onUnregisteredHandler = null;
        /**
         * Serializes the FID get + compare + notify step so concurrent register() calls
         * do not race each other.
         */
        this._registerNotifyChain = Promise.resolve();
        /** Unsubscribe from Installations `onIdChange` when messaging is deleted. */
        this._fidChangeUnsubscribe = null;
        this.logEvents = [];
        /**
         * Single source of truth for the logging loop lifecycle.
         *
         * `scheduled` holds the active timer id; `flushing` indicates an async dispatch
         * is in progress (prevents duplicate starts); `stopped` means idle.
         */
        this.logQueue = { state: 'stopped' };
        const appConfig = extractAppConfig(app);
        this.firebaseDependencies = {
            app,
            appConfig,
            installations,
            analyticsProvider
        };
    }
    _delete() {
        if (this._fidChangeUnsubscribe) {
            this._fidChangeUnsubscribe();
            this._fidChangeUnsubscribe = null;
        }
        if (this.logQueue.state === 'scheduled') {
            clearTimeout(this.logQueue.timerId);
        }
        this.logQueue = { state: 'stopped' };
        return Promise.resolve();
    }
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function getToken$1(messaging, options) {
    if (!navigator) {
        throw ERROR_FACTORY.create("only-available-in-window" /* ErrorCode.AVAILABLE_IN_WINDOW */);
    }
    if (Notification.permission === 'default') {
        await Notification.requestPermission();
    }
    if (Notification.permission !== 'granted') {
        throw ERROR_FACTORY.create("permission-blocked" /* ErrorCode.PERMISSION_BLOCKED */);
    }
    await updateVapidKey(messaging, options?.vapidKey);
    await updateSwReg(messaging, options?.serviceWorkerRegistration);
    return getTokenInternal(messaging);
}

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function logToScion(messaging, messageType, data) {
    const eventType = getEventType(messageType);
    const analytics = await messaging.firebaseDependencies.analyticsProvider.get();
    analytics.logEvent(eventType, {
        /* eslint-disable camelcase */
        message_id: data[CONSOLE_CAMPAIGN_ID],
        message_name: data[CONSOLE_CAMPAIGN_NAME],
        message_time: data[CONSOLE_CAMPAIGN_TIME],
        message_device_time: Math.floor(Date.now() / 1000)
        /* eslint-enable camelcase */
    });
}
function getEventType(messageType) {
    switch (messageType) {
        case MessageType.NOTIFICATION_CLICKED:
            return 'notification_open';
        case MessageType.PUSH_RECEIVED:
            return 'notification_foreground';
        default:
            throw new Error();
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function messageEventListener(messaging, event) {
    const internalPayload = event.data;
    if (!internalPayload.isFirebaseMessaging) {
        return;
    }
    if (messaging.onMessageHandler &&
        internalPayload.messageType === MessageType.PUSH_RECEIVED) {
        if (typeof messaging.onMessageHandler === 'function') {
            messaging.onMessageHandler(externalizePayload(internalPayload));
        }
        else {
            messaging.onMessageHandler.next(externalizePayload(internalPayload));
        }
    }
    if (messaging.onRegisteredHandler &&
        internalPayload.messageType === MessageType.FID_REGISTERED) {
        const fid = internalPayload.fid;
        if (typeof messaging.onRegisteredHandler === 'function') {
            messaging.onRegisteredHandler(fid);
        }
        else {
            messaging.onRegisteredHandler.next(fid);
        }
    }
    // Log to Scion if applicable
    const dataPayload = internalPayload.data;
    if (isConsoleMessage(dataPayload) &&
        dataPayload[CONSOLE_CAMPAIGN_ANALYTICS_ENABLED] === '1') {
        await logToScion(messaging, internalPayload.messageType, dataPayload);
    }
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const WindowMessagingFactory = (container) => {
    const messaging = new MessagingService(container.getProvider('app').getImmediate(), container.getProvider('installations-internal').getImmediate(), container.getProvider('analytics-internal'));
    navigator.serviceWorker.addEventListener('message', e => messageEventListener(messaging, e));
    messaging._fidChangeUnsubscribe = subscribeFidChangeRegistration(messaging, container.getProvider('installations').getImmediate());
    return messaging;
};
const WindowMessagingInternalFactory = (container) => {
    const messaging = container
        .getProvider('messaging')
        .getImmediate();
    const messagingInternal = {
        getToken: (options) => getToken$1(messaging, options),
        register: (options) => register$1(messaging, options)
    };
    return messagingInternal;
};
function registerMessagingInWindow() {
    (0,_firebase_app__WEBPACK_IMPORTED_MODULE_4__._registerComponent)(new _firebase_component__WEBPACK_IMPORTED_MODULE_1__.Component('messaging', WindowMessagingFactory, "PUBLIC" /* ComponentType.PUBLIC */));
    (0,_firebase_app__WEBPACK_IMPORTED_MODULE_4__._registerComponent)(new _firebase_component__WEBPACK_IMPORTED_MODULE_1__.Component('messaging-internal', WindowMessagingInternalFactory, "PRIVATE" /* ComponentType.PRIVATE */));
    (0,_firebase_app__WEBPACK_IMPORTED_MODULE_4__.registerVersion)(name, version);
    // BUILD_TARGET will be replaced by values like esm, cjs, etc during the compilation
    (0,_firebase_app__WEBPACK_IMPORTED_MODULE_4__.registerVersion)(name, version, 'esm2020');
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Checks if all required APIs exist in the browser.
 * @returns a Promise that resolves to a boolean.
 *
 * @public
 */
async function isWindowSupported() {
    try {
        // This throws if open() is unsupported, so adding it to the conditional
        // statement below can cause an uncaught error.
        await (0,_firebase_util__WEBPACK_IMPORTED_MODULE_3__.validateIndexedDBOpenable)();
    }
    catch (e) {
        return false;
    }
    // firebase-js-sdk/issues/2393 reveals that idb#open in Safari iframe and Firefox private browsing
    // might be prohibited to run. In these contexts, an error would be thrown during the messaging
    // instantiating phase, informing the developers to import/call isSupported for special handling.
    return (typeof window !== 'undefined' &&
        (0,_firebase_util__WEBPACK_IMPORTED_MODULE_3__.isIndexedDBAvailable)() &&
        (0,_firebase_util__WEBPACK_IMPORTED_MODULE_3__.areCookiesEnabled)() &&
        'serviceWorker' in navigator &&
        'PushManager' in window &&
        'Notification' in window &&
        'fetch' in window &&
        ServiceWorkerRegistration.prototype.hasOwnProperty('showNotification') &&
        PushSubscription.prototype.hasOwnProperty('getKey'));
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function deleteToken$1(messaging) {
    if (!navigator) {
        throw ERROR_FACTORY.create("only-available-in-window" /* ErrorCode.AVAILABLE_IN_WINDOW */);
    }
    if (!messaging.swRegistration) {
        await registerDefaultSw(messaging);
    }
    return revokeRegistrationInternal(messaging);
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function onMessage$1(messaging, nextOrObserver) {
    if (!navigator) {
        throw ERROR_FACTORY.create("only-available-in-window" /* ErrorCode.AVAILABLE_IN_WINDOW */);
    }
    messaging.onMessageHandler = nextOrObserver;
    return () => {
        messaging.onMessageHandler = null;
    };
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Subscribes to an event that the app instance is registered with FCM via Firebase Installation ID (FID).
 * Use the FID passed to the callback to upload it to your application server.
 *
 * @param messaging - The {@link MessagingService} instance.
 * @param nextOrObserver - A function or observer object called when an FID is registered.
 * @returns Unsubscribe function to stop listening.
 */
function onRegistered$1(messaging, nextOrObserver) {
    messaging.onRegisteredHandler = nextOrObserver;
    return () => {
        if (messaging.onRegisteredHandler === nextOrObserver) {
            messaging.onRegisteredHandler = null;
        }
    };
}

/**
 * @license
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Subscribes to an event that the app instance is unregistered from FCM so the FID is no longer active.
 * Use this to notify your backend to remove this FID to prevent 404 errors on send.
 *
 * @param messaging - The {@link MessagingService} instance.
 * @param nextOrObserver - A function or observer object called with the unregistered FID.
 * @returns Unsubscribe function to stop listening.
 */
function onUnregistered$1(messaging, nextOrObserver) {
    messaging.onUnregisteredHandler = nextOrObserver;
    return () => {
        if (messaging.onUnregisteredHandler === nextOrObserver) {
            messaging.onUnregisteredHandler = null;
        }
    };
}

/**
 * @license
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Unregisters the app instance from FCM by deleting its FID-based registration.
 *
 * On success, triggers the `onUnregistered` callback (if set) with the unregistered FID.
 *
 * @param messaging - The MessagingService instance.
 */
async function unregister$1(messaging) {
    if (!navigator) {
        throw ERROR_FACTORY.create("only-available-in-window" /* ErrorCode.AVAILABLE_IN_WINDOW */);
    }
    // Prefer the last successfully registered FID from local metadata when available.
    const stored = await dbGetFidRegistration(messaging.firebaseDependencies).catch(() => undefined);
    const fid = stored?.fid ?? (await messaging.firebaseDependencies.installations.getId());
    await requestDeleteRegistration(messaging.firebaseDependencies, fid);
    // Best-effort local cleanup; still resolve even if schema is unavailable.
    try {
        await dbRemoveFidRegistration(messaging.firebaseDependencies);
    }
    catch {
        // Ignore.
    }
    // Best-effort cleanup of legacy token details created via getToken().
    try {
        await dbRemove(messaging.firebaseDependencies);
    }
    catch {
        // Ignore.
    }
    const handler = messaging.onUnregisteredHandler;
    if (!handler) {
        return;
    }
    if (typeof handler === 'function') {
        handler(fid);
    }
    else {
        handler.next(fid);
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Retrieves a Firebase Cloud Messaging instance.
 *
 * @returns The Firebase Cloud Messaging instance associated with the provided firebase app.
 *
 * @public
 */
function getMessagingInWindow(app = (0,_firebase_app__WEBPACK_IMPORTED_MODULE_4__.getApp)()) {
    // Conscious decision to make this async check non-blocking during the messaging instance
    // initialization phase for performance consideration. An error would be thrown latter for
    // developer's information. Developers can then choose to import and call `isSupported` for
    // special handling.
    isWindowSupported().then(isSupported => {
        // If `isWindowSupported()` resolved, but returned false.
        if (!isSupported) {
            throw ERROR_FACTORY.create("unsupported-browser" /* ErrorCode.UNSUPPORTED_BROWSER */);
        }
    }, _ => {
        // If `isWindowSupported()` rejected.
        throw ERROR_FACTORY.create("indexed-db-unsupported" /* ErrorCode.INDEXED_DB_UNSUPPORTED */);
    });
    return (0,_firebase_app__WEBPACK_IMPORTED_MODULE_4__._getProvider)((0,_firebase_util__WEBPACK_IMPORTED_MODULE_3__.getModularInstance)(app), 'messaging').getImmediate();
}
/**
 * Subscribes the {@link Messaging} instance to push notifications. Returns a Firebase Cloud
 * Messaging registration token that can be used to send push messages to that {@link Messaging}
 * instance.
 *
 * If notification permission isn't already granted, this method asks the user for permission. The
 * returned promise rejects if the user does not allow the app to show notifications.
 *
 * @param messaging - The {@link Messaging} instance.
 * @param options - Provides an optional vapid key and an optional service worker registration.
 *
 * @returns The promise resolves with an FCM registration token.
 *
 * @deprecated Use {@link register} together with {@link onRegistered} for Firebase
 * Installation ID-based messaging instead of retrieving an FCM registration token with this API.
 *
 * @public
 */
async function getToken(messaging, options) {
    messaging = (0,_firebase_util__WEBPACK_IMPORTED_MODULE_3__.getModularInstance)(messaging);
    return getToken$1(messaging, options);
}
/**
 * Deletes the registration token associated with this {@link Messaging} instance and unsubscribes
 * the {@link Messaging} instance from the push subscription.
 *
 * If there is no legacy registration token but the client has FID-based registration metadata
 * (from {@link register}), this deletes that registration on the server, clears local metadata, and
 * invokes {@link onUnregistered} with the removed FID when successful.
 *
 * @param messaging - The {@link Messaging} instance.
 *
 * @returns The promise resolves when the token has been successfully deleted.
 *
 * @deprecated Use {@link onUnregistered} to observe when the client is no longer
 * registered and update your backend accordingly, instead of explicitly deleting the
 * registration token with this API.
 *
 * @public
 */
function deleteToken(messaging) {
    messaging = (0,_firebase_util__WEBPACK_IMPORTED_MODULE_3__.getModularInstance)(messaging);
    return deleteToken$1(messaging);
}
/**
 * When a push message is received and the user is currently on a page for your origin, the
 * message is passed to the page and an `onMessage()` event is dispatched with the payload of
 * the push message.
 *
 *
 * @param messaging - The {@link Messaging} instance.
 * @param nextOrObserver - This function, or observer object with `next` defined,
 *     is called when a message is received and the user is currently viewing your page.
 * @returns To stop listening for messages execute this returned function.
 *
 * @public
 */
function onMessage(messaging, nextOrObserver) {
    messaging = (0,_firebase_util__WEBPACK_IMPORTED_MODULE_3__.getModularInstance)(messaging);
    return onMessage$1(messaging, nextOrObserver);
}
/**
 * Registers the app instance with FCM using its Firebase Installation ID (FID). The FID is
 * delivered via the {@link onRegistered} callback, not as a return value. Call this to establish
 * an FID-based identity; once {@link onRegistered} provides an FID, instruct your backend to
 * remove any legacy token previously associated with this instance. The backend send API
 * supports FID as a target.
 *
 * @param messaging - The {@link Messaging} instance.
 * @param options - Optional. VAPID key and/or service worker registration (same as getToken).
 * @returns Promise that resolves when registration has been initiated; FID is delivered via onRegistered.
 *
 * @public
 */
async function register(messaging, options) {
    messaging = (0,_firebase_util__WEBPACK_IMPORTED_MODULE_3__.getModularInstance)(messaging);
    return register$1(messaging, options);
}
/**
 * Unregisters the app instance from FCM by deleting its FID-based registration.
 * On success, triggers {@link onUnregistered} (if registered) with the unregistered FID.
 *
 * @param messaging - The {@link Messaging} instance.
 *
 * @public
 */
async function unregister(messaging) {
    messaging = (0,_firebase_util__WEBPACK_IMPORTED_MODULE_3__.getModularInstance)(messaging);
    return unregister$1(messaging);
}
/**
 * Subscribes to an event that the app instance is registered with FCM via Firebase Installation ID (FID).
 * Use the FID passed to the callback to upload it to your application server. When you receive an FID
 * after calling {@link register}, instruct your backend to remove any legacy token for this instance.
 *
 * @param messaging - The {@link Messaging} instance.
 * @param nextOrObserver - A function or observer object called when an FID is registered.
 * @returns Unsubscribe function to stop listening.
 *
 * @public
 */
function onRegistered(messaging, nextOrObserver) {
    messaging = (0,_firebase_util__WEBPACK_IMPORTED_MODULE_3__.getModularInstance)(messaging);
    return onRegistered$1(messaging, nextOrObserver);
}
/**
 * Subscribes to an event that the app instance is unregistered from FCM (FID no longer active).
 * Use this to notify your backend to remove this FID to prevent 404 errors on send.
 *
 * @param messaging - The {@link Messaging} instance.
 * @param nextOrObserver - A function or observer object called with the unregistered FID.
 * @returns Unsubscribe function to stop listening.
 *
 * @public
 */
function onUnregistered(messaging, nextOrObserver) {
    messaging = (0,_firebase_util__WEBPACK_IMPORTED_MODULE_3__.getModularInstance)(messaging);
    return onUnregistered$1(messaging, nextOrObserver);
}

/**
 * The Firebase Cloud Messaging Web SDK.
 * This SDK does not work in a Node.js environment.
 *
 * @packageDocumentation
 */
registerMessagingInWindow();


//# sourceMappingURL=index.esm.js.map


/***/ }),

/***/ "./node_modules/@firebase/util/dist/postinstall.mjs":
/*!**********************************************************!*\
  !*** ./node_modules/@firebase/util/dist/postinstall.mjs ***!
  \**********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getDefaultsFromPostinstall: function() { return /* binding */ getDefaultsFromPostinstall; }
/* harmony export */ });
const getDefaultsFromPostinstall = () => (undefined);


/***/ }),

/***/ "./node_modules/firebase/app/dist/esm/index.esm.js":
/*!*********************************************************!*\
  !*** ./node_modules/firebase/app/dist/esm/index.esm.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FirebaseError: function() { return /* reexport safe */ _firebase_app__WEBPACK_IMPORTED_MODULE_0__.FirebaseError; },
/* harmony export */   SDK_VERSION: function() { return /* reexport safe */ _firebase_app__WEBPACK_IMPORTED_MODULE_0__.SDK_VERSION; },
/* harmony export */   _DEFAULT_ENTRY_NAME: function() { return /* reexport safe */ _firebase_app__WEBPACK_IMPORTED_MODULE_0__._DEFAULT_ENTRY_NAME; },
/* harmony export */   _addComponent: function() { return /* reexport safe */ _firebase_app__WEBPACK_IMPORTED_MODULE_0__._addComponent; },
/* harmony export */   _addOrOverwriteComponent: function() { return /* reexport safe */ _firebase_app__WEBPACK_IMPORTED_MODULE_0__._addOrOverwriteComponent; },
/* harmony export */   _apps: function() { return /* reexport safe */ _firebase_app__WEBPACK_IMPORTED_MODULE_0__._apps; },
/* harmony export */   _clearComponents: function() { return /* reexport safe */ _firebase_app__WEBPACK_IMPORTED_MODULE_0__._clearComponents; },
/* harmony export */   _components: function() { return /* reexport safe */ _firebase_app__WEBPACK_IMPORTED_MODULE_0__._components; },
/* harmony export */   _getProvider: function() { return /* reexport safe */ _firebase_app__WEBPACK_IMPORTED_MODULE_0__._getProvider; },
/* harmony export */   _isFirebaseApp: function() { return /* reexport safe */ _firebase_app__WEBPACK_IMPORTED_MODULE_0__._isFirebaseApp; },
/* harmony export */   _isFirebaseServerApp: function() { return /* reexport safe */ _firebase_app__WEBPACK_IMPORTED_MODULE_0__._isFirebaseServerApp; },
/* harmony export */   _isFirebaseServerAppSettings: function() { return /* reexport safe */ _firebase_app__WEBPACK_IMPORTED_MODULE_0__._isFirebaseServerAppSettings; },
/* harmony export */   _registerComponent: function() { return /* reexport safe */ _firebase_app__WEBPACK_IMPORTED_MODULE_0__._registerComponent; },
/* harmony export */   _removeServiceInstance: function() { return /* reexport safe */ _firebase_app__WEBPACK_IMPORTED_MODULE_0__._removeServiceInstance; },
/* harmony export */   _serverApps: function() { return /* reexport safe */ _firebase_app__WEBPACK_IMPORTED_MODULE_0__._serverApps; },
/* harmony export */   deleteApp: function() { return /* reexport safe */ _firebase_app__WEBPACK_IMPORTED_MODULE_0__.deleteApp; },
/* harmony export */   getApp: function() { return /* reexport safe */ _firebase_app__WEBPACK_IMPORTED_MODULE_0__.getApp; },
/* harmony export */   getApps: function() { return /* reexport safe */ _firebase_app__WEBPACK_IMPORTED_MODULE_0__.getApps; },
/* harmony export */   initializeApp: function() { return /* reexport safe */ _firebase_app__WEBPACK_IMPORTED_MODULE_0__.initializeApp; },
/* harmony export */   initializeServerApp: function() { return /* reexport safe */ _firebase_app__WEBPACK_IMPORTED_MODULE_0__.initializeServerApp; },
/* harmony export */   onLog: function() { return /* reexport safe */ _firebase_app__WEBPACK_IMPORTED_MODULE_0__.onLog; },
/* harmony export */   registerVersion: function() { return /* reexport safe */ _firebase_app__WEBPACK_IMPORTED_MODULE_0__.registerVersion; },
/* harmony export */   setLogLevel: function() { return /* reexport safe */ _firebase_app__WEBPACK_IMPORTED_MODULE_0__.setLogLevel; }
/* harmony export */ });
/* harmony import */ var _firebase_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @firebase/app */ "./node_modules/@firebase/app/dist/esm/index.esm.js");



var name = "firebase";
var version = "12.15.0";

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(0,_firebase_app__WEBPACK_IMPORTED_MODULE_0__.registerVersion)(name, version, 'app');
//# sourceMappingURL=index.esm.js.map


/***/ }),

/***/ "./node_modules/firebase/messaging/dist/esm/index.esm.js":
/*!***************************************************************!*\
  !*** ./node_modules/firebase/messaging/dist/esm/index.esm.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   deleteToken: function() { return /* reexport safe */ _firebase_messaging__WEBPACK_IMPORTED_MODULE_0__.deleteToken; },
/* harmony export */   getMessaging: function() { return /* reexport safe */ _firebase_messaging__WEBPACK_IMPORTED_MODULE_0__.getMessaging; },
/* harmony export */   getToken: function() { return /* reexport safe */ _firebase_messaging__WEBPACK_IMPORTED_MODULE_0__.getToken; },
/* harmony export */   isSupported: function() { return /* reexport safe */ _firebase_messaging__WEBPACK_IMPORTED_MODULE_0__.isSupported; },
/* harmony export */   onMessage: function() { return /* reexport safe */ _firebase_messaging__WEBPACK_IMPORTED_MODULE_0__.onMessage; },
/* harmony export */   onRegistered: function() { return /* reexport safe */ _firebase_messaging__WEBPACK_IMPORTED_MODULE_0__.onRegistered; },
/* harmony export */   onUnregistered: function() { return /* reexport safe */ _firebase_messaging__WEBPACK_IMPORTED_MODULE_0__.onUnregistered; },
/* harmony export */   register: function() { return /* reexport safe */ _firebase_messaging__WEBPACK_IMPORTED_MODULE_0__.register; },
/* harmony export */   unregister: function() { return /* reexport safe */ _firebase_messaging__WEBPACK_IMPORTED_MODULE_0__.unregister; }
/* harmony export */ });
/* harmony import */ var _firebase_messaging__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @firebase/messaging */ "./node_modules/@firebase/messaging/dist/esm/index.esm.js");

//# sourceMappingURL=index.esm.js.map


/***/ }),

/***/ "./node_modules/idb/build/index.js":
/*!*****************************************!*\
  !*** ./node_modules/idb/build/index.js ***!
  \*****************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   deleteDB: function() { return /* binding */ deleteDB; },
/* harmony export */   openDB: function() { return /* binding */ openDB; },
/* harmony export */   unwrap: function() { return /* reexport safe */ _wrap_idb_value_js__WEBPACK_IMPORTED_MODULE_0__.u; },
/* harmony export */   wrap: function() { return /* reexport safe */ _wrap_idb_value_js__WEBPACK_IMPORTED_MODULE_0__.w; }
/* harmony export */ });
/* harmony import */ var _wrap_idb_value_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./wrap-idb-value.js */ "./node_modules/idb/build/wrap-idb-value.js");



/**
 * Open a database.
 *
 * @param name Name of the database.
 * @param version Schema version.
 * @param callbacks Additional callbacks.
 */
function openDB(name, version, { blocked, upgrade, blocking, terminated } = {}) {
    const request = indexedDB.open(name, version);
    const openPromise = (0,_wrap_idb_value_js__WEBPACK_IMPORTED_MODULE_0__.w)(request);
    if (upgrade) {
        request.addEventListener('upgradeneeded', (event) => {
            upgrade((0,_wrap_idb_value_js__WEBPACK_IMPORTED_MODULE_0__.w)(request.result), event.oldVersion, event.newVersion, (0,_wrap_idb_value_js__WEBPACK_IMPORTED_MODULE_0__.w)(request.transaction), event);
        });
    }
    if (blocked) {
        request.addEventListener('blocked', (event) => blocked(
        // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
        event.oldVersion, event.newVersion, event));
    }
    openPromise
        .then((db) => {
        if (terminated)
            db.addEventListener('close', () => terminated());
        if (blocking) {
            db.addEventListener('versionchange', (event) => blocking(event.oldVersion, event.newVersion, event));
        }
    })
        .catch(() => { });
    return openPromise;
}
/**
 * Delete a database.
 *
 * @param name Name of the database.
 */
function deleteDB(name, { blocked } = {}) {
    const request = indexedDB.deleteDatabase(name);
    if (blocked) {
        request.addEventListener('blocked', (event) => blocked(
        // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
        event.oldVersion, event));
    }
    return (0,_wrap_idb_value_js__WEBPACK_IMPORTED_MODULE_0__.w)(request).then(() => undefined);
}

const readMethods = ['get', 'getKey', 'getAll', 'getAllKeys', 'count'];
const writeMethods = ['put', 'add', 'delete', 'clear'];
const cachedMethods = new Map();
function getMethod(target, prop) {
    if (!(target instanceof IDBDatabase &&
        !(prop in target) &&
        typeof prop === 'string')) {
        return;
    }
    if (cachedMethods.get(prop))
        return cachedMethods.get(prop);
    const targetFuncName = prop.replace(/FromIndex$/, '');
    const useIndex = prop !== targetFuncName;
    const isWrite = writeMethods.includes(targetFuncName);
    if (
    // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
    !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) ||
        !(isWrite || readMethods.includes(targetFuncName))) {
        return;
    }
    const method = async function (storeName, ...args) {
        // isWrite ? 'readwrite' : undefined gzipps better, but fails in Edge :(
        const tx = this.transaction(storeName, isWrite ? 'readwrite' : 'readonly');
        let target = tx.store;
        if (useIndex)
            target = target.index(args.shift());
        // Must reject if op rejects.
        // If it's a write operation, must reject if tx.done rejects.
        // Must reject with op rejection first.
        // Must resolve with op value.
        // Must handle both promises (no unhandled rejections)
        return (await Promise.all([
            target[targetFuncName](...args),
            isWrite && tx.done,
        ]))[0];
    };
    cachedMethods.set(prop, method);
    return method;
}
(0,_wrap_idb_value_js__WEBPACK_IMPORTED_MODULE_0__.r)((oldTraps) => ({
    ...oldTraps,
    get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
    has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop),
}));




/***/ }),

/***/ "./node_modules/idb/build/wrap-idb-value.js":
/*!**************************************************!*\
  !*** ./node_modules/idb/build/wrap-idb-value.js ***!
  \**************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   a: function() { return /* binding */ reverseTransformCache; },
/* harmony export */   i: function() { return /* binding */ instanceOfAny; },
/* harmony export */   r: function() { return /* binding */ replaceTraps; },
/* harmony export */   u: function() { return /* binding */ unwrap; },
/* harmony export */   w: function() { return /* binding */ wrap; }
/* harmony export */ });
const instanceOfAny = (object, constructors) => constructors.some((c) => object instanceof c);

let idbProxyableTypes;
let cursorAdvanceMethods;
// This is a function to prevent it throwing up in node environments.
function getIdbProxyableTypes() {
    return (idbProxyableTypes ||
        (idbProxyableTypes = [
            IDBDatabase,
            IDBObjectStore,
            IDBIndex,
            IDBCursor,
            IDBTransaction,
        ]));
}
// This is a function to prevent it throwing up in node environments.
function getCursorAdvanceMethods() {
    return (cursorAdvanceMethods ||
        (cursorAdvanceMethods = [
            IDBCursor.prototype.advance,
            IDBCursor.prototype.continue,
            IDBCursor.prototype.continuePrimaryKey,
        ]));
}
const cursorRequestMap = new WeakMap();
const transactionDoneMap = new WeakMap();
const transactionStoreNamesMap = new WeakMap();
const transformCache = new WeakMap();
const reverseTransformCache = new WeakMap();
function promisifyRequest(request) {
    const promise = new Promise((resolve, reject) => {
        const unlisten = () => {
            request.removeEventListener('success', success);
            request.removeEventListener('error', error);
        };
        const success = () => {
            resolve(wrap(request.result));
            unlisten();
        };
        const error = () => {
            reject(request.error);
            unlisten();
        };
        request.addEventListener('success', success);
        request.addEventListener('error', error);
    });
    promise
        .then((value) => {
        // Since cursoring reuses the IDBRequest (*sigh*), we cache it for later retrieval
        // (see wrapFunction).
        if (value instanceof IDBCursor) {
            cursorRequestMap.set(value, request);
        }
        // Catching to avoid "Uncaught Promise exceptions"
    })
        .catch(() => { });
    // This mapping exists in reverseTransformCache but doesn't doesn't exist in transformCache. This
    // is because we create many promises from a single IDBRequest.
    reverseTransformCache.set(promise, request);
    return promise;
}
function cacheDonePromiseForTransaction(tx) {
    // Early bail if we've already created a done promise for this transaction.
    if (transactionDoneMap.has(tx))
        return;
    const done = new Promise((resolve, reject) => {
        const unlisten = () => {
            tx.removeEventListener('complete', complete);
            tx.removeEventListener('error', error);
            tx.removeEventListener('abort', error);
        };
        const complete = () => {
            resolve();
            unlisten();
        };
        const error = () => {
            reject(tx.error || new DOMException('AbortError', 'AbortError'));
            unlisten();
        };
        tx.addEventListener('complete', complete);
        tx.addEventListener('error', error);
        tx.addEventListener('abort', error);
    });
    // Cache it for later retrieval.
    transactionDoneMap.set(tx, done);
}
let idbProxyTraps = {
    get(target, prop, receiver) {
        if (target instanceof IDBTransaction) {
            // Special handling for transaction.done.
            if (prop === 'done')
                return transactionDoneMap.get(target);
            // Polyfill for objectStoreNames because of Edge.
            if (prop === 'objectStoreNames') {
                return target.objectStoreNames || transactionStoreNamesMap.get(target);
            }
            // Make tx.store return the only store in the transaction, or undefined if there are many.
            if (prop === 'store') {
                return receiver.objectStoreNames[1]
                    ? undefined
                    : receiver.objectStore(receiver.objectStoreNames[0]);
            }
        }
        // Else transform whatever we get back.
        return wrap(target[prop]);
    },
    set(target, prop, value) {
        target[prop] = value;
        return true;
    },
    has(target, prop) {
        if (target instanceof IDBTransaction &&
            (prop === 'done' || prop === 'store')) {
            return true;
        }
        return prop in target;
    },
};
function replaceTraps(callback) {
    idbProxyTraps = callback(idbProxyTraps);
}
function wrapFunction(func) {
    // Due to expected object equality (which is enforced by the caching in `wrap`), we
    // only create one new func per func.
    // Edge doesn't support objectStoreNames (booo), so we polyfill it here.
    if (func === IDBDatabase.prototype.transaction &&
        !('objectStoreNames' in IDBTransaction.prototype)) {
        return function (storeNames, ...args) {
            const tx = func.call(unwrap(this), storeNames, ...args);
            transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [storeNames]);
            return wrap(tx);
        };
    }
    // Cursor methods are special, as the behaviour is a little more different to standard IDB. In
    // IDB, you advance the cursor and wait for a new 'success' on the IDBRequest that gave you the
    // cursor. It's kinda like a promise that can resolve with many values. That doesn't make sense
    // with real promises, so each advance methods returns a new promise for the cursor object, or
    // undefined if the end of the cursor has been reached.
    if (getCursorAdvanceMethods().includes(func)) {
        return function (...args) {
            // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
            // the original object.
            func.apply(unwrap(this), args);
            return wrap(cursorRequestMap.get(this));
        };
    }
    return function (...args) {
        // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
        // the original object.
        return wrap(func.apply(unwrap(this), args));
    };
}
function transformCachableValue(value) {
    if (typeof value === 'function')
        return wrapFunction(value);
    // This doesn't return, it just creates a 'done' promise for the transaction,
    // which is later returned for transaction.done (see idbObjectHandler).
    if (value instanceof IDBTransaction)
        cacheDonePromiseForTransaction(value);
    if (instanceOfAny(value, getIdbProxyableTypes()))
        return new Proxy(value, idbProxyTraps);
    // Return the same value back if we're not going to transform it.
    return value;
}
function wrap(value) {
    // We sometimes generate multiple promises from a single IDBRequest (eg when cursoring), because
    // IDB is weird and a single IDBRequest can yield many responses, so these can't be cached.
    if (value instanceof IDBRequest)
        return promisifyRequest(value);
    // If we've already transformed this value before, reuse the transformed value.
    // This is faster, but it also provides object equality.
    if (transformCache.has(value))
        return transformCache.get(value);
    const newValue = transformCachableValue(value);
    // Not all types are transformed.
    // These may be primitive types, so they can't be WeakMap keys.
    if (newValue !== value) {
        transformCache.set(value, newValue);
        reverseTransformCache.set(newValue, value);
    }
    return newValue;
}
const unwrap = (value) => reverseTransformCache.get(value);




/***/ }),

/***/ "./img/bkg/index.json":
/*!****************************!*\
  !*** ./img/bkg/index.json ***!
  \****************************/
/***/ (function(module) {

module.exports = /*#__PURE__*/JSON.parse('{"patt":[{"name":"a00.png","size":200},{"name":"a01.jpg","size":384},{"name":"a02.jpg","size":384},{"name":"a03.jpg","size":384},{"name":"a04.png","size":400},{"name":"a05.jpg","size":400},{"name":"a06.jpg","size":256},{"name":"a07.jpg","size":384},{"name":"a08.jpg","size":384},{"name":"a09.jpg","size":400},{"name":"a10.jpg","size":256},{"name":"a11.png","size":200}],"img":[{"name":"w01.jpg","pr":"p01.jpg"},{"name":"w02.jpg","pr":"p02.jpg"},{"name":"w03.jpg","pr":"p03.jpg"},{"name":"w04.jpg","pr":"p04.jpg"},{"name":"w05.jpg","pr":"p05.jpg"},{"name":"w06.jpg","pr":"p06.jpg"},{"name":"w07.jpg","pr":"p07.jpg"},{"name":"w08.jpg","pr":"p08.jpg"},{"name":"w09.jpg","pr":"p09.jpg"},{"name":"w10.jpg","pr":"p10.jpg"},{"name":"w11.jpg","pr":"p11.jpg"},{"name":"w12.jpg","pr":"p12.jpg"},{"name":"w13.jpg","pr":"p13.jpg"},{"name":"w14.jpg","pr":"p14.jpg"},{"name":"w15.jpg","pr":"p15.jpg"},{"name":"w16.jpg","pr":"p16.jpg"},{"name":"w17.jpg","pr":"p17.jpg"},{"name":"w18.jpg","pr":"p18.jpg"},{"name":"w19.jpg","pr":"p19.jpg"},{"name":"w20.jpg","pr":"p20.jpg"},{"name":"w21.jpg","pr":"p21.jpg"},{"name":"w22.jpg","pr":"p22.jpg"},{"name":"w23.jpg","pr":"p23.jpg"},{"name":"w24.jpg","pr":"p24.jpg"}]}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	!function() {
/******/ 		var getProto = Object.getPrototypeOf ? function(obj) { return Object.getPrototypeOf(obj); } : function(obj) { return obj.__proto__; };
/******/ 		var leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; (typeof current == 'object' || typeof current == 'function') && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach(function(key) { def[key] = function() { return value[key]; }; });
/******/ 			}
/******/ 			def['default'] = function() { return value; };
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter/value functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			if(Array.isArray(definition)) {
/******/ 				var i = 0;
/******/ 				while(i < definition.length) {
/******/ 					var key = definition[i++];
/******/ 					var binding = definition[i++];
/******/ 					if(!__webpack_require__.o(exports, key)) {
/******/ 						if(binding === 0) {
/******/ 							Object.defineProperty(exports, key, { enumerable: true, value: definition[i++] });
/******/ 						} else {
/******/ 							Object.defineProperty(exports, key, { enumerable: true, get: binding });
/******/ 						}
/******/ 					} else if(binding === 0) { i++; }
/******/ 				}
/******/ 			} else {
/******/ 				for(var key in definition) {
/******/ 					if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 						Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	!function() {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = function(chunkId) {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce(function(promises, key) {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	!function() {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = function(chunkId) {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".dev.js";
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	!function() {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "tinode-webapp:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = function(url, done, key, chunkId) {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 		
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = function(prev, event) {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach(function(fn) { return fn(event); });
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/set anonymous default export name */
/******/ 	!function() {
/******/ 		// set .name for anonymous default exports per ES spec
/******/ 		__webpack_require__.dn = function(x) {
/******/ 			(Object.getOwnPropertyDescriptor(x, "name") || {}).writable || Object.defineProperty(x, "name", { value: "default", configurable: true });
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	!function() {
/******/ 		__webpack_require__.p = "/umd/";
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	!function() {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"index": 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.j = function(chunkId, promises) {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if(true) { // all chunks have JS
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise(function(resolve, reject) { installedChunkData = installedChunks[chunkId] = [resolve, reject]; });
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = function(event) {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										var realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = function(parentChunkLoadingFunction, data) {
/******/ 			var chunkIds = data[0];
/******/ 			var moreModules = data[1];
/******/ 			var runtime = data[2];
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some(function(id) { return installedChunks[id] !== 0; })) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 		
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunktinode_webapp"] = self["webpackChunktinode_webapp"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
!function() {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _views_tinode_web_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./views/tinode-web.jsx */ "./src/views/tinode-web.jsx");
/* harmony import */ var _lib_navigation_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./lib/navigation.js */ "./src/lib/navigation.js");





if (typeof FIREBASE_INIT != 'undefined' && FIREBASE_INIT && FIREBASE_INIT.measurementId) {
  const head = document.getElementsByTagName('head')[0];
  let script = document.createElement('script');
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + FIREBASE_INIT.measurementId;
  script.async = true;
  head.prepend(script);
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', FIREBASE_INIT.measurementId);
}
const messageLoader = {
  'ar': _ => __webpack_require__.e(/*! import() */ "src_i18n_min_ar_json").then(__webpack_require__.t.bind(__webpack_require__, /*! ./i18n.min/ar.json */ "./src/i18n.min/ar.json", 19)),
  'de': _ => __webpack_require__.e(/*! import() */ "src_i18n_min_de_json").then(__webpack_require__.t.bind(__webpack_require__, /*! ./i18n.min/de.json */ "./src/i18n.min/de.json", 19)),
  'en': _ => __webpack_require__.e(/*! import() */ "src_i18n_min_en_json").then(__webpack_require__.t.bind(__webpack_require__, /*! ./i18n.min/en.json */ "./src/i18n.min/en.json", 19)),
  'es': _ => __webpack_require__.e(/*! import() */ "src_i18n_min_es_json").then(__webpack_require__.t.bind(__webpack_require__, /*! ./i18n.min/es.json */ "./src/i18n.min/es.json", 19)),
  'fr': _ => __webpack_require__.e(/*! import() */ "src_i18n_min_fr_json").then(__webpack_require__.t.bind(__webpack_require__, /*! ./i18n.min/fr.json */ "./src/i18n.min/fr.json", 19)),
  'it': _ => __webpack_require__.e(/*! import() */ "src_i18n_min_it_json").then(__webpack_require__.t.bind(__webpack_require__, /*! ./i18n.min/it.json */ "./src/i18n.min/it.json", 19)),
  'ko': _ => __webpack_require__.e(/*! import() */ "src_i18n_min_ko_json").then(__webpack_require__.t.bind(__webpack_require__, /*! ./i18n.min/ko.json */ "./src/i18n.min/ko.json", 19)),
  'ro': _ => __webpack_require__.e(/*! import() */ "src_i18n_min_ro_json").then(__webpack_require__.t.bind(__webpack_require__, /*! ./i18n.min/ro.json */ "./src/i18n.min/ro.json", 19)),
  'ru': _ => __webpack_require__.e(/*! import() */ "src_i18n_min_ru_json").then(__webpack_require__.t.bind(__webpack_require__, /*! ./i18n.min/ru.json */ "./src/i18n.min/ru.json", 19)),
  'th': _ => __webpack_require__.e(/*! import() */ "src_i18n_min_th_json").then(__webpack_require__.t.bind(__webpack_require__, /*! ./i18n.min/th.json */ "./src/i18n.min/th.json", 19)),
  'uk': _ => __webpack_require__.e(/*! import() */ "src_i18n_min_uk_json").then(__webpack_require__.t.bind(__webpack_require__, /*! ./i18n.min/uk.json */ "./src/i18n.min/uk.json", 19)),
  'vi': _ => __webpack_require__.e(/*! import() */ "src_i18n_min_vi_json").then(__webpack_require__.t.bind(__webpack_require__, /*! ./i18n.min/vi.json */ "./src/i18n.min/vi.json", 19)),
  'zh': _ => __webpack_require__.e(/*! import() */ "src_i18n_min_zh_json").then(__webpack_require__.t.bind(__webpack_require__, /*! ./i18n.min/zh.json */ "./src/i18n.min/zh.json", 19)),
  'zh-TW': _ => __webpack_require__.e(/*! import() */ "src_i18n_min_zh-TW_json").then(__webpack_require__.t.bind(__webpack_require__, /*! ./i18n.min/zh-TW.json */ "./src/i18n.min/zh-TW.json", 19))
};
const rtl = ['ar', 'fa', 'he', 'ur'];
const {
  params
} = _lib_navigation_js__WEBPACK_IMPORTED_MODULE_4__["default"].parseUrlHash(window.location.hash);
const language = params && params.hl || navigator.languages && navigator.languages[0] || navigator.language || navigator.userLanguage || 'en';
const normalized = language.replace('_', '-');
const baseLanguage = normalized.split('-')[0].toLowerCase();
const htmlLang = messageLoader[normalized] ? language : messageLoader[baseLanguage] ? baseLanguage : 'en';
const html = document.getElementsByTagName('html')[0];
html.setAttribute('lang', htmlLang);
if (rtl.includes(baseLanguage)) {
  html.setAttribute('dir', 'rtl');
}
const root = (0,react_dom_client__WEBPACK_IMPORTED_MODULE_1__.createRoot)(document.getElementById('mountPoint'));
messageLoader[htmlLang]().then(messages => root.render(react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_2__.IntlProvider, {
  locale: language,
  messages: messages,
  textComponent: (react__WEBPACK_IMPORTED_MODULE_0___default().Fragment)
}, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_views_tinode_web_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], null))));
}();
/******/ })()
;
//# sourceMappingURL=index.dev.js.map
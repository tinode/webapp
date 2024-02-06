/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@firebase/util/dist/index.esm2017.js":
/*!***********************************************************!*\
  !*** ./node_modules/@firebase/util/dist/index.esm2017.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CONSTANTS: () => (/* binding */ CONSTANTS),
/* harmony export */   DecodeBase64StringError: () => (/* binding */ DecodeBase64StringError),
/* harmony export */   Deferred: () => (/* binding */ Deferred),
/* harmony export */   ErrorFactory: () => (/* binding */ ErrorFactory),
/* harmony export */   FirebaseError: () => (/* binding */ FirebaseError),
/* harmony export */   MAX_VALUE_MILLIS: () => (/* binding */ MAX_VALUE_MILLIS),
/* harmony export */   RANDOM_FACTOR: () => (/* binding */ RANDOM_FACTOR),
/* harmony export */   Sha1: () => (/* binding */ Sha1),
/* harmony export */   areCookiesEnabled: () => (/* binding */ areCookiesEnabled),
/* harmony export */   assert: () => (/* binding */ assert),
/* harmony export */   assertionError: () => (/* binding */ assertionError),
/* harmony export */   async: () => (/* binding */ async),
/* harmony export */   base64: () => (/* binding */ base64),
/* harmony export */   base64Decode: () => (/* binding */ base64Decode),
/* harmony export */   base64Encode: () => (/* binding */ base64Encode),
/* harmony export */   base64urlEncodeWithoutPadding: () => (/* binding */ base64urlEncodeWithoutPadding),
/* harmony export */   calculateBackoffMillis: () => (/* binding */ calculateBackoffMillis),
/* harmony export */   contains: () => (/* binding */ contains),
/* harmony export */   createMockUserToken: () => (/* binding */ createMockUserToken),
/* harmony export */   createSubscribe: () => (/* binding */ createSubscribe),
/* harmony export */   decode: () => (/* binding */ decode),
/* harmony export */   deepCopy: () => (/* binding */ deepCopy),
/* harmony export */   deepEqual: () => (/* binding */ deepEqual),
/* harmony export */   deepExtend: () => (/* binding */ deepExtend),
/* harmony export */   errorPrefix: () => (/* binding */ errorPrefix),
/* harmony export */   extractQuerystring: () => (/* binding */ extractQuerystring),
/* harmony export */   getDefaultAppConfig: () => (/* binding */ getDefaultAppConfig),
/* harmony export */   getDefaultEmulatorHost: () => (/* binding */ getDefaultEmulatorHost),
/* harmony export */   getDefaultEmulatorHostnameAndPort: () => (/* binding */ getDefaultEmulatorHostnameAndPort),
/* harmony export */   getDefaults: () => (/* binding */ getDefaults),
/* harmony export */   getExperimentalSetting: () => (/* binding */ getExperimentalSetting),
/* harmony export */   getGlobal: () => (/* binding */ getGlobal),
/* harmony export */   getModularInstance: () => (/* binding */ getModularInstance),
/* harmony export */   getUA: () => (/* binding */ getUA),
/* harmony export */   isAdmin: () => (/* binding */ isAdmin),
/* harmony export */   isBrowser: () => (/* binding */ isBrowser),
/* harmony export */   isBrowserExtension: () => (/* binding */ isBrowserExtension),
/* harmony export */   isElectron: () => (/* binding */ isElectron),
/* harmony export */   isEmpty: () => (/* binding */ isEmpty),
/* harmony export */   isIE: () => (/* binding */ isIE),
/* harmony export */   isIndexedDBAvailable: () => (/* binding */ isIndexedDBAvailable),
/* harmony export */   isMobileCordova: () => (/* binding */ isMobileCordova),
/* harmony export */   isNode: () => (/* binding */ isNode),
/* harmony export */   isNodeSdk: () => (/* binding */ isNodeSdk),
/* harmony export */   isReactNative: () => (/* binding */ isReactNative),
/* harmony export */   isSafari: () => (/* binding */ isSafari),
/* harmony export */   isUWP: () => (/* binding */ isUWP),
/* harmony export */   isValidFormat: () => (/* binding */ isValidFormat),
/* harmony export */   isValidTimestamp: () => (/* binding */ isValidTimestamp),
/* harmony export */   issuedAtTime: () => (/* binding */ issuedAtTime),
/* harmony export */   jsonEval: () => (/* binding */ jsonEval),
/* harmony export */   map: () => (/* binding */ map),
/* harmony export */   ordinal: () => (/* binding */ ordinal),
/* harmony export */   promiseWithTimeout: () => (/* binding */ promiseWithTimeout),
/* harmony export */   querystring: () => (/* binding */ querystring),
/* harmony export */   querystringDecode: () => (/* binding */ querystringDecode),
/* harmony export */   safeGet: () => (/* binding */ safeGet),
/* harmony export */   stringLength: () => (/* binding */ stringLength),
/* harmony export */   stringToByteArray: () => (/* binding */ stringToByteArray),
/* harmony export */   stringify: () => (/* binding */ stringify),
/* harmony export */   uuidv4: () => (/* binding */ uuidv4),
/* harmony export */   validateArgCount: () => (/* binding */ validateArgCount),
/* harmony export */   validateCallback: () => (/* binding */ validateCallback),
/* harmony export */   validateContextObject: () => (/* binding */ validateContextObject),
/* harmony export */   validateIndexedDBOpenable: () => (/* binding */ validateIndexedDBOpenable),
/* harmony export */   validateNamespace: () => (/* binding */ validateNamespace)
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
        return (getDefaultsFromGlobal() ||
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
const getDefaultEmulatorHost = (productName) => { var _a, _b; return (_b = (_a = getDefaults()) === null || _a === void 0 ? void 0 : _a.emulatorHosts) === null || _b === void 0 ? void 0 : _b[productName]; };
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
const getDefaultAppConfig = () => { var _a; return (_a = getDefaults()) === null || _a === void 0 ? void 0 : _a.config; };
/**
 * Returns an experimental setting on the __FIREBASE_DEFAULTS__ object (properties
 * prefixed by "_")
 * @public
 */
const getExperimentalSetting = (name) => { var _a; return (_a = getDefaults()) === null || _a === void 0 ? void 0 : _a[`_${name}`]; };

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
     * Our API internals are not promiseified and cannot because our callback APIs have subtle expectations around
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
    const payload = Object.assign({ 
        // Set all required fields to decent defaults
        iss: `https://securetoken.google.com/${project}`, aud: project, iat, exp: iat + 3600, auth_time: iat, sub, user_id: sub, firebase: {
            sign_in_provider: 'custom',
            identities: {}
        } }, token);
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
    var _a;
    const forceEnvironment = (_a = getDefaults()) === null || _a === void 0 ? void 0 : _a.forceEnvironment;
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
 * Detect Browser Environment
 */
function isBrowser() {
    return typeof self === 'object' && self.self === self;
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
                var _a;
                reject(((_a = request.error) === null || _a === void 0 ? void 0 : _a.message) || '');
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
 *   // Typescript string literals for type-safe codes
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
 * @param {*} data Javascript object to be stringified.
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
     * - We require that no event is sent to a subscriber sychronously to their
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
// use 2 characters in Javascript.  All 4-byte UTF-8 characters begin with a first
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
 * Copied from https://stackoverflow.com/a/2117523
 * Generates a new uuid.
 * @public
 */
const uuidv4 = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0, v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
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


//# sourceMappingURL=index.esm2017.js.map


/***/ }),

/***/ "./src/config.js":
/*!***********************!*\
  !*** ./src/config.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   API_KEY: () => (/* binding */ API_KEY),
/* harmony export */   APP_NAME: () => (/* binding */ APP_NAME),
/* harmony export */   AVATAR_SIZE: () => (/* binding */ AVATAR_SIZE),
/* harmony export */   BROKEN_IMAGE_SIZE: () => (/* binding */ BROKEN_IMAGE_SIZE),
/* harmony export */   CHANNEL_ACCESS_MODE: () => (/* binding */ CHANNEL_ACCESS_MODE),
/* harmony export */   CLICKABLE_URL_SCHEMES: () => (/* binding */ CLICKABLE_URL_SCHEMES),
/* harmony export */   DEFAULT_HOST: () => (/* binding */ DEFAULT_HOST),
/* harmony export */   DEFAULT_P2P_ACCESS_MODE: () => (/* binding */ DEFAULT_P2P_ACCESS_MODE),
/* harmony export */   EDIT_PREVIEW_LENGTH: () => (/* binding */ EDIT_PREVIEW_LENGTH),
/* harmony export */   FORWARDED_PREVIEW_LENGTH: () => (/* binding */ FORWARDED_PREVIEW_LENGTH),
/* harmony export */   IMAGE_PREVIEW_DIM: () => (/* binding */ IMAGE_PREVIEW_DIM),
/* harmony export */   IMAGE_THUMBNAIL_DIM: () => (/* binding */ IMAGE_THUMBNAIL_DIM),
/* harmony export */   IMMEDIATE_P2P_SUBSCRIPTION: () => (/* binding */ IMMEDIATE_P2P_SUBSCRIPTION),
/* harmony export */   KEYPRESS_DELAY: () => (/* binding */ KEYPRESS_DELAY),
/* harmony export */   KNOWN_HOSTS: () => (/* binding */ KNOWN_HOSTS),
/* harmony export */   LINK_CONTACT_US: () => (/* binding */ LINK_CONTACT_US),
/* harmony export */   LINK_PRIVACY_POLICY: () => (/* binding */ LINK_PRIVACY_POLICY),
/* harmony export */   LINK_TERMS_OF_SERVICE: () => (/* binding */ LINK_TERMS_OF_SERVICE),
/* harmony export */   LOGGING_ENABLED: () => (/* binding */ LOGGING_ENABLED),
/* harmony export */   MAX_AVATAR_BYTES: () => (/* binding */ MAX_AVATAR_BYTES),
/* harmony export */   MAX_DURATION: () => (/* binding */ MAX_DURATION),
/* harmony export */   MAX_EXTERN_ATTACHMENT_SIZE: () => (/* binding */ MAX_EXTERN_ATTACHMENT_SIZE),
/* harmony export */   MAX_IMAGE_DIM: () => (/* binding */ MAX_IMAGE_DIM),
/* harmony export */   MAX_INBAND_ATTACHMENT_SIZE: () => (/* binding */ MAX_INBAND_ATTACHMENT_SIZE),
/* harmony export */   MAX_ONLINE_IN_TOPIC: () => (/* binding */ MAX_ONLINE_IN_TOPIC),
/* harmony export */   MAX_PEER_TITLE_LENGTH: () => (/* binding */ MAX_PEER_TITLE_LENGTH),
/* harmony export */   MAX_TAG_COUNT: () => (/* binding */ MAX_TAG_COUNT),
/* harmony export */   MAX_TAG_LENGTH: () => (/* binding */ MAX_TAG_LENGTH),
/* harmony export */   MAX_TITLE_LENGTH: () => (/* binding */ MAX_TITLE_LENGTH),
/* harmony export */   MAX_TOPIC_DESCRIPTION_LENGTH: () => (/* binding */ MAX_TOPIC_DESCRIPTION_LENGTH),
/* harmony export */   MEDIA_BREAKPOINT: () => (/* binding */ MEDIA_BREAKPOINT),
/* harmony export */   MESSAGES_PAGE: () => (/* binding */ MESSAGES_PAGE),
/* harmony export */   MESSAGE_PREVIEW_LENGTH: () => (/* binding */ MESSAGE_PREVIEW_LENGTH),
/* harmony export */   MIN_DURATION: () => (/* binding */ MIN_DURATION),
/* harmony export */   MIN_TAG_LENGTH: () => (/* binding */ MIN_TAG_LENGTH),
/* harmony export */   NEW_GRP_ACCESS_MODE: () => (/* binding */ NEW_GRP_ACCESS_MODE),
/* harmony export */   NO_ACCESS_MODE: () => (/* binding */ NO_ACCESS_MODE),
/* harmony export */   NO_DIMENSIONS_VIDEO: () => (/* binding */ NO_DIMENSIONS_VIDEO),
/* harmony export */   QRCODE_SIZE: () => (/* binding */ QRCODE_SIZE),
/* harmony export */   QUOTED_REPLY_LENGTH: () => (/* binding */ QUOTED_REPLY_LENGTH),
/* harmony export */   READ_DELAY: () => (/* binding */ READ_DELAY),
/* harmony export */   REM_SIZE: () => (/* binding */ REM_SIZE),
/* harmony export */   VIDEO_PREVIEW_DIM: () => (/* binding */ VIDEO_PREVIEW_DIM),
/* harmony export */   VIDEO_THUMBNAIL_WIDTH: () => (/* binding */ VIDEO_THUMBNAIL_WIDTH)
/* harmony export */ });
/* harmony import */ var _version_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./version.js */ "./src/version.js");

const APP_NAME = 'TinodeWeb/' + (_version_js__WEBPACK_IMPORTED_MODULE_0__.PACKAGE_VERSION || '0.21');
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
const MAX_PEER_TITLE_LENGTH = 20;
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

/***/ }),

/***/ "./src/constants.js":
/*!**************************!*\
  !*** ./src/constants.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CALL_HEAD_STARTED: () => (/* binding */ CALL_HEAD_STARTED),
/* harmony export */   CALL_STATE_INCOMING_RECEIVED: () => (/* binding */ CALL_STATE_INCOMING_RECEIVED),
/* harmony export */   CALL_STATE_IN_PROGRESS: () => (/* binding */ CALL_STATE_IN_PROGRESS),
/* harmony export */   CALL_STATE_NONE: () => (/* binding */ CALL_STATE_NONE),
/* harmony export */   CALL_STATE_OUTGOING_INITATED: () => (/* binding */ CALL_STATE_OUTGOING_INITATED)
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MIME_EXTENSIONS: () => (/* binding */ MIME_EXTENSIONS),
/* harmony export */   SUPPORTED_IMAGE_FORMATS: () => (/* binding */ SUPPORTED_IMAGE_FORMATS),
/* harmony export */   base64DecodedLen: () => (/* binding */ base64DecodedLen),
/* harmony export */   base64EncodedLen: () => (/* binding */ base64EncodedLen),
/* harmony export */   base64ReEncode: () => (/* binding */ base64ReEncode),
/* harmony export */   base64ToBlob: () => (/* binding */ base64ToBlob),
/* harmony export */   base64ToIntArray: () => (/* binding */ base64ToIntArray),
/* harmony export */   blobToBase64: () => (/* binding */ blobToBase64),
/* harmony export */   fileNameForMime: () => (/* binding */ fileNameForMime),
/* harmony export */   filePasted: () => (/* binding */ filePasted),
/* harmony export */   fileToBase64: () => (/* binding */ fileToBase64),
/* harmony export */   fitImageSize: () => (/* binding */ fitImageSize),
/* harmony export */   getMimeType: () => (/* binding */ getMimeType),
/* harmony export */   imageCrop: () => (/* binding */ imageCrop),
/* harmony export */   imageScaled: () => (/* binding */ imageScaled),
/* harmony export */   intArrayToBase64: () => (/* binding */ intArrayToBase64),
/* harmony export */   makeImageUrl: () => (/* binding */ makeImageUrl)
/* harmony export */ });
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
  var mime = /^data:(image\/[-+a-z0-9.]+);base64/.exec(header);
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

/***/ }),

/***/ "./src/lib/formatters.js":
/*!*******************************!*\
  !*** ./src/lib/formatters.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fullFormatter: () => (/* binding */ fullFormatter),
/* harmony export */   previewFormatter: () => (/* binding */ previewFormatter),
/* harmony export */   replyFormatter: () => (/* binding */ replyFormatter)
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
/* harmony import */ var _widgets_uploading_image_jsx__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../widgets/uploading-image.jsx */ "./src/widgets/uploading-image.jsx");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _blob_helpers_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./blob-helpers.js */ "./src/lib/blob-helpers.js");
/* harmony import */ var _strformat_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./strformat.js */ "./src/lib/strformat.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./utils.js */ "./src/lib/utils.js");













const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  drafty_form: {
    id: "drafty_form",
    defaultMessage: [{
      "type": 0,
      "value": "Form:"
    }]
  },
  drafty_attachment: {
    id: "drafty_attachment",
    defaultMessage: [{
      "type": 0,
      "value": "Attachment"
    }]
  },
  drafty_image: {
    id: "drafty_image",
    defaultMessage: [{
      "type": 0,
      "value": "Picture"
    }]
  },
  drafty_video: {
    id: "drafty_video",
    defaultMessage: [{
      "type": 0,
      "value": "Video recording"
    }]
  },
  drafty_unknown: {
    id: "drafty_unknown",
    defaultMessage: [{
      "type": 0,
      "value": "Unsupported"
    }]
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
        attr.src = this.authorizeURL((0,_utils_js__WEBPACK_IMPORTED_MODULE_12__.sanitizeUrlForMime)(attr.src, 'audio'));
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
      attr.onClick = this.onFormButtonClick;
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
        attr.href = typeof attr.href == 'string' ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_12__.sanitizeUrl)(attr.href, _config_js__WEBPACK_IMPORTED_MODULE_9__.CLICKABLE_URL_SCHEMES) : '';
      }
      break;
    case 'MN':
      attr.className = 'mention';
      if (data) {
        attr.className += ' ' + (0,_strformat_js__WEBPACK_IMPORTED_MODULE_11__.idToColorClass)(data.val, false, true);
      }
      break;
    case 'FM':
      attr.className = 'bot-form';
      break;
    case 'RW':
      break;
    case 'QQ':
      attr.className = 'reply-quote';
      attr.onClick = this.onQuoteClick;
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
          body = [react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
            key: "x1",
            className: "gray"
          }, this.formatMessage(messages.drafty_unknown))];
        }
        values = [react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
          key: "x0",
          className: "material-icons gray"
        }, "extension"), ' '].concat(body);
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
      width: _config_js__WEBPACK_IMPORTED_MODULE_9__.IMAGE_THUMBNAIL_DIM + 'px',
      height: _config_js__WEBPACK_IMPORTED_MODULE_9__.IMAGE_THUMBNAIL_DIM + 'px'
    };
    return el;
  }
  attr.className = 'inline-image';
  const dim = (0,_blob_helpers_js__WEBPACK_IMPORTED_MODULE_10__.fitImageSize)(data.width, data.height, this.viewportWidth > 0 ? Math.min(this.viewportWidth - _config_js__WEBPACK_IMPORTED_MODULE_9__.REM_SIZE * 6.5, _config_js__WEBPACK_IMPORTED_MODULE_9__.REM_SIZE * 34.5) : _config_js__WEBPACK_IMPORTED_MODULE_9__.REM_SIZE * 34.5, _config_js__WEBPACK_IMPORTED_MODULE_9__.REM_SIZE * 24, false) || {
    dstWidth: _config_js__WEBPACK_IMPORTED_MODULE_9__.BROKEN_IMAGE_SIZE,
    dstHeight: _config_js__WEBPACK_IMPORTED_MODULE_9__.BROKEN_IMAGE_SIZE
  };
  attr.style = {
    width: dim.dstWidth + 'px',
    height: dim.dstHeight + 'px',
    minWidth: dim.dstWidth + 'px',
    minHeight: dim.dstHeight + 'px'
  };
  if (!tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.isProcessing(data)) {
    attr.src = this.authorizeURL((0,_utils_js__WEBPACK_IMPORTED_MODULE_12__.sanitizeUrlForMime)(attr.src, 'image'));
    attr.alt = data.name;
    if (attr.src) {
      if (Math.max(data.width || 0, data.height || 0) > _config_js__WEBPACK_IMPORTED_MODULE_9__.IMAGE_THUMBNAIL_DIM) {
        attr.onClick = this.onImagePreview;
        attr.className += ' image-clickable';
      }
      attr.loading = 'lazy';
    } else {
      attr.src = null;
    }
  } else {
    el = _widgets_uploading_image_jsx__WEBPACK_IMPORTED_MODULE_8__["default"];
  }
  return el;
}
function handleVideoData(el, data, attr) {
  if (!data) {
    attr.src = 'img/broken_video.png';
    attr.style = {
      width: _config_js__WEBPACK_IMPORTED_MODULE_9__.IMAGE_THUMBNAIL_DIM + 'px',
      height: _config_js__WEBPACK_IMPORTED_MODULE_9__.IMAGE_THUMBNAIL_DIM + 'px'
    };
    return el;
  }
  attr.className = 'inline-image';
  const dim = (0,_blob_helpers_js__WEBPACK_IMPORTED_MODULE_10__.fitImageSize)(data.width, data.height, this.viewportWidth > 0 ? Math.min(this.viewportWidth - _config_js__WEBPACK_IMPORTED_MODULE_9__.REM_SIZE * 6.5, _config_js__WEBPACK_IMPORTED_MODULE_9__.REM_SIZE * 34.5) : _config_js__WEBPACK_IMPORTED_MODULE_9__.REM_SIZE * 34.5, _config_js__WEBPACK_IMPORTED_MODULE_9__.REM_SIZE * 24, false) || {
    dstWidth: _config_js__WEBPACK_IMPORTED_MODULE_9__.NO_DIMENSIONS_VIDEO,
    dstHeight: _config_js__WEBPACK_IMPORTED_MODULE_9__.NO_DIMENSIONS_VIDEO
  };
  attr.style = {
    width: dim.dstWidth + 'px',
    height: dim.dstHeight + 'px',
    minWidth: dim.dstWidth + 'px',
    minHeight: dim.dstHeight + 'px'
  };
  if (!tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.isProcessing(data)) {
    attr.src = this.authorizeURL((0,_utils_js__WEBPACK_IMPORTED_MODULE_12__.sanitizeUrlForMime)(attr.src, 'image'));
    attr.alt = data.name;
    if (data.ref || data.val) {
      attr.onClick = this.onVideoPreview;
      attr.loading = 'lazy';
    }
    el = _widgets_inline_video_jsx__WEBPACK_IMPORTED_MODULE_6__["default"];
  } else {
    el = _widgets_uploading_image_jsx__WEBPACK_IMPORTED_MODULE_8__["default"];
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
      values = [react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
        key: "au",
        className: "material-icons"
      }, "mic"), ' ', (0,_strformat_js__WEBPACK_IMPORTED_MODULE_11__.secondsToTime)(data.duration / 1000)];
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
      values = [react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
        key: "im",
        className: "material-icons"
      }, "photo"), ' ', this.formatMessage(messages.drafty_image)];
      break;
    case 'BN':
      el = 'span';
      attr.className = 'flat-button faux';
      break;
    case 'FM':
      el = (react__WEBPACK_IMPORTED_MODULE_0___default().Fragment);
      values = [react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
        key: "fm",
        className: "material-icons"
      }, "dashboard"), this.formatMessage(messages.drafty_form)].concat(' ', values || []);
      break;
    case 'RW':
      el = (react__WEBPACK_IMPORTED_MODULE_0___default().Fragment);
      break;
    case 'EX':
      if (data) {
        if (data.mime == 'application/json') {
          return null;
        }
        delete data.val;
        delete data.ref;
      }
      el = (react__WEBPACK_IMPORTED_MODULE_0___default().Fragment);
      values = [react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
        key: "ex",
        className: "material-icons"
      }, "attachment"), ' ', this.formatMessage(messages.drafty_attachment)];
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
    case 'VD':
      el = (react__WEBPACK_IMPORTED_MODULE_0___default().Fragment);
      values = [react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
        key: "im",
        className: "material-icons"
      }, "play_circle_outline"), ' ', this.formatMessage(messages.drafty_video)];
      break;
    default:
      if (!el) {
        el = (react__WEBPACK_IMPORTED_MODULE_0___default().Fragment);
        values = [react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
          key: "x0",
          className: "material-icons gray"
        }, "extension"), ' ', this.formatMessage(messages.drafty_unknown)];
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
    width: _config_js__WEBPACK_IMPORTED_MODULE_9__.IMAGE_THUMBNAIL_DIM + 'px',
    height: _config_js__WEBPACK_IMPORTED_MODULE_9__.IMAGE_THUMBNAIL_DIM + 'px',
    maxWidth: _config_js__WEBPACK_IMPORTED_MODULE_9__.IMAGE_THUMBNAIL_DIM + 'px',
    maxHeight: _config_js__WEBPACK_IMPORTED_MODULE_9__.IMAGE_THUMBNAIL_DIM + 'px'
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
  const dim = (0,_blob_helpers_js__WEBPACK_IMPORTED_MODULE_10__.fitImageSize)(data.width, data.height, _config_js__WEBPACK_IMPORTED_MODULE_9__.VIDEO_THUMBNAIL_WIDTH, _config_js__WEBPACK_IMPORTED_MODULE_9__.IMAGE_THUMBNAIL_DIM);
  attr.style = {
    width: dim.width + 'px',
    height: dim.height + 'px',
    maxWidth: _config_js__WEBPACK_IMPORTED_MODULE_9__.VIDEO_THUMBNAIL_WIDTH + 'px',
    maxHeight: _config_js__WEBPACK_IMPORTED_MODULE_9__.IMAGE_THUMBNAIL_DIM + 'px'
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
          attr.className += ' ' + (0,_strformat_js__WEBPACK_IMPORTED_MODULE_11__.idToColorClass)(data.val, false, true);
        }
        break;
      case 'EX':
        let fname;
        if (data) {
          if (data.mime == 'application/json') {
            return null;
          }
          fname = data.name;
          delete data.val;
          delete data.ref;
        }
        el = (react__WEBPACK_IMPORTED_MODULE_0___default().Fragment);
        values = [react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
          key: "ex",
          className: "material-icons"
        }, "attachment"), (0,_strformat_js__WEBPACK_IMPORTED_MODULE_11__.shortenFileName)(fname, 16) || this.formatMessage(messages.drafty_attachment)];
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
    const blob = (0,_blob_helpers_js__WEBPACK_IMPORTED_MODULE_10__.base64ToBlob)(bits, mime);
    if (!blob) {
      throw new Error("Invalid image");
    }
    promise = Promise.resolve(blob);
  } else if (ref) {
    promise = fetch(this.authorizeURL((0,_utils_js__WEBPACK_IMPORTED_MODULE_12__.sanitizeUrlForMime)(ref, 'image'))).then(evt => {
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
    return (0,_blob_helpers_js__WEBPACK_IMPORTED_MODULE_10__.imageScaled)(blob, isVideo ? _config_js__WEBPACK_IMPORTED_MODULE_9__.VIDEO_THUMBNAIL_WIDTH : _config_js__WEBPACK_IMPORTED_MODULE_9__.IMAGE_THUMBNAIL_DIM, _config_js__WEBPACK_IMPORTED_MODULE_9__.IMAGE_THUMBNAIL_DIM, -1, !isVideo);
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
    return (0,_blob_helpers_js__WEBPACK_IMPORTED_MODULE_10__.blobToBase64)(scaled.blob);
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
    data.width = _config_js__WEBPACK_IMPORTED_MODULE_9__.IMAGE_THUMBNAIL_DIM;
    data.height = _config_js__WEBPACK_IMPORTED_MODULE_9__.IMAGE_THUMBNAIL_DIM;
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
      loadedPromise = (0,_utils_js__WEBPACK_IMPORTED_MODULE_12__.cancelablePromise)(quoteImageOrVideo.call(this, data, style == 'VD'));
    } catch (error) {
      console.warn("Failed to quote image:", error.message);
      loadedPromise = (0,_utils_js__WEBPACK_IMPORTED_MODULE_12__.cancelablePromise)(error);
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
      }, [react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
        key: "qq",
        className: "material-icons"
      }, "format_quote"), ' ']);
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   detectServerAddress: () => (/* binding */ detectServerAddress),
/* harmony export */   isLocalHost: () => (/* binding */ isLocalHost),
/* harmony export */   isSecureConnection: () => (/* binding */ isSecureConnection)
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LocalStorageUtil)
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ HashNavigation)
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bytesToHumanSize: () => (/* binding */ bytesToHumanSize),
/* harmony export */   flagEmoji: () => (/* binding */ flagEmoji),
/* harmony export */   idToColorClass: () => (/* binding */ idToColorClass),
/* harmony export */   letterTileColorId: () => (/* binding */ letterTileColorId),
/* harmony export */   relativeDateFormat: () => (/* binding */ relativeDateFormat),
/* harmony export */   secondsToTime: () => (/* binding */ secondsToTime),
/* harmony export */   shortDateFormat: () => (/* binding */ shortDateFormat),
/* harmony export */   shortenFileName: () => (/* binding */ shortenFileName)
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

/***/ }),

/***/ "./src/lib/utils.js":
/*!**************************!*\
  !*** ./src/lib/utils.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   arrayEqual: () => (/* binding */ arrayEqual),
/* harmony export */   asEmail: () => (/* binding */ asEmail),
/* harmony export */   asPhone: () => (/* binding */ asPhone),
/* harmony export */   cancelablePromise: () => (/* binding */ cancelablePromise),
/* harmony export */   clipStr: () => (/* binding */ clipStr),
/* harmony export */   deliveryMarker: () => (/* binding */ deliveryMarker),
/* harmony export */   isUrlRelative: () => (/* binding */ isUrlRelative),
/* harmony export */   sanitizeUrl: () => (/* binding */ sanitizeUrl),
/* harmony export */   sanitizeUrlForMime: () => (/* binding */ sanitizeUrlForMime),
/* harmony export */   theCard: () => (/* binding */ theCard),
/* harmony export */   updateFavicon: () => (/* binding */ updateFavicon),
/* harmony export */   urlAsAttachment: () => (/* binding */ urlAsAttachment)
/* harmony export */ });
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_0__);

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
    return val.replace(/[- ().]*/, '');
  }
  return null;
}
function asEmail(val) {
  val = val.trim();
  if (/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(val)) {
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
  const re = new RegExp(`data:${mimeMajor}\/[a-z0-9.-]+;base64,`, 'i');
  if (re.test(url.trim())) {
    return url;
  }
  return null;
}
function urlAsAttachment(url) {
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
function clipStr(str, length) {
  return str && str.substring(0, length);
}

/***/ }),

/***/ "./src/version.js":
/*!************************!*\
  !*** ./src/version.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PACKAGE_VERSION: () => (/* binding */ PACKAGE_VERSION)
/* harmony export */ });
const PACKAGE_VERSION = "0.22.12";

/***/ }),

/***/ "./src/views/acc-notifications-view.jsx":
/*!**********************************************!*\
  !*** ./src/views/acc-notifications-view.jsx ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EditAccountView)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../widgets/checkbox.jsx */ "./src/widgets/checkbox.jsx");



class EditAccountView extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.handleCheckboxClick = this.handleCheckboxClick.bind(this);
  }
  handleCheckboxClick(what, checked) {
    if (what == 'sound') {
      this.props.onToggleMessageSounds(checked);
    } else if (what == 'alert') {
      this.props.onTogglePushNotifications(checked);
    } else if (what == 'incognito') {
      this.props.onToggleIncognitoMode(checked);
    }
  }
  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "scrollable-panel"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      htmlFor: "message-sound"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_message_sound",
      defaultMessage: [{
        "type": 0,
        "value": "Message sound:"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
      name: "sound",
      id: "message-sound",
      checked: this.props.messageSounds,
      onChange: this.handleCheckboxClick
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      htmlFor: "desktop-alerts"
    }, this.props.desktopAlertsEnabled ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_push_notifications",
      defaultMessage: [{
        "type": 0,
        "value": "Notification alerts:"
      }]
    }) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_push_notifications_disabled",
      defaultMessage: [{
        "type": 0,
        "value": "Notification alerts (requires HTTPS):"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
      name: "alert",
      id: "desktop-alerts",
      checked: this.props.desktopAlerts,
      onChange: this.props.desktopAlertsEnabled ? this.handleCheckboxClick : null
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      htmlFor: "incognito-mode"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_incognito_mode",
      defaultMessage: [{
        "type": 0,
        "value": "Incognito mode:"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
      name: "incognito",
      id: "incognito-mode",
      checked: this.props.incognitoMode,
      onChange: this.handleCheckboxClick
    })));
  }
}
;

/***/ }),

/***/ "./src/views/acc-security-view.jsx":
/*!*****************************************!*\
  !*** ./src/views/acc-security-view.jsx ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _widgets_in_place_edit_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../widgets/in-place-edit.jsx */ "./src/widgets/in-place-edit.jsx");
/* harmony import */ var _widgets_permissions_editor_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../widgets/permissions-editor.jsx */ "./src/widgets/permissions-editor.jsx");




const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  delete_account: {
    id: "delete_account",
    defaultMessage: [{
      "type": 0,
      "value": "Delete account"
    }]
  },
  delete_account_warning: {
    id: "delete_account_warning",
    defaultMessage: [{
      "type": 0,
      "value": "Are you sure you want to delete your account? It cannot be undone."
    }]
  }
});
class AccSecurityView extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    const me = this.props.tinode.getMeTopic();
    let blockedCount = 0;
    me.contacts(c => {
      if (c.acs && !c.acs.isJoiner()) {
        blockedCount++;
      }
    });
    const defacs = me.getDefaultAccess();
    this.state = {
      auth: defacs ? defacs.auth : null,
      anon: defacs ? defacs.anon : null,
      showPermissionEditorFor: undefined,
      blockedCount: blockedCount
    };
    this.handlePasswordUpdate = this.handlePasswordUpdate.bind(this);
    this.handleLaunchPermissionsEditor = this.handleLaunchPermissionsEditor.bind(this);
    this.handleHidePermissionsEditor = this.handleHidePermissionsEditor.bind(this);
    this.handlePermissionsChanged = this.handlePermissionsChanged.bind(this);
    this.handleDeleteAccount = this.handleDeleteAccount.bind(this);
  }
  handlePasswordUpdate(pwd) {
    this.setState({
      password: pwd
    });
    this.props.onUpdatePassword(pwd);
  }
  handleLaunchPermissionsEditor(which) {
    this.setState({
      showPermissionEditorFor: which,
      editedPermissions: this.state[which]
    });
  }
  handleHidePermissionsEditor() {
    this.setState({
      showPermissionEditorFor: undefined
    });
  }
  handlePermissionsChanged(perm) {
    let defacs = {};
    defacs[this.state.showPermissionEditorFor] = perm;
    this.props.onUpdateAccountDesc('me', undefined, undefined, defacs);
    let newState = {
      showPermissionEditorFor: undefined
    };
    newState[this.state.showPermissionEditorFor] = perm;
    this.setState(newState);
  }
  handleDeleteAccount(e) {
    e.preventDefault();
    const {
      formatMessage
    } = this.props.intl;
    this.props.onShowAlert(formatMessage(messages.delete_account), formatMessage(messages.delete_account_warning), _ => this.props.onDeleteAccount(), null, true, null);
  }
  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, this.state.showPermissionEditorFor ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_permissions_editor_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
      mode: this.state.editedPermissions,
      skip: "O",
      onSubmit: this.handlePermissionsChanged,
      onCancel: this.handleHidePermissionsEditor
    }) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "scrollable-panel"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-column"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_password",
      defaultMessage: [{
        "type": 0,
        "value": "Password"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "password_unchanged_prompt",
      defaultMessage: [{
        "type": 0,
        "value": "Unchanged"
      }]
    }, password_unchanged => react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_in_place_edit_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
      placeholder: password_unchanged,
      type: "password",
      onFinished: this.handlePasswordUpdate
    })))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "hr"
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-column"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      className: "danger flat-button",
      onClick: e => {
        e.preventDefault();
        this.props.onLogout();
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "exit_to_app"), " \xA0", react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "button_logout",
      defaultMessage: [{
        "type": 0,
        "value": "Logout"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      className: "danger flat-button",
      onClick: e => {
        this.handleDeleteAccount(e);
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "delete"), " \xA0", react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "button_delete_account",
      defaultMessage: [{
        "type": 0,
        "value": "Delete account"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "hr"
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-column"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_default_access_mode",
      defaultMessage: [{
        "type": 0,
        "value": "Default access mode:"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "quoted"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, "Auth: ", react__WEBPACK_IMPORTED_MODULE_0___default().createElement("tt", {
      className: "clickable",
      onClick: this.handleLaunchPermissionsEditor.bind(this, 'auth')
    }, this.state.auth)), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, "Anon: ", react__WEBPACK_IMPORTED_MODULE_0___default().createElement("tt", {
      className: "clickable",
      onClick: this.handleLaunchPermissionsEditor.bind(this, 'anon')
    }, this.state.anon)))), this.state.blockedCount > 0 ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "hr"
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "block"), "\xA0", react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      className: "gray",
      onClick: e => {
        e.preventDefault();
        this.props.onShowBlocked();
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "blocked_contacts_link",
      defaultMessage: [{
        "type": 0,
        "value": "Blocked contacts ("
      }, {
        "type": 1,
        "value": "count"
      }, {
        "type": 0,
        "value": ")"
      }],
      values: {
        count: this.state.blockedCount
      }
    })))) : null));
  }
}
;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(AccSecurityView));

/***/ }),

/***/ "./src/views/acc-support-view.jsx":
/*!****************************************!*\
  !*** ./src/views/acc-support-view.jsx ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AccSupportView)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config.js */ "./src/config.js");




class AccSupportView extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "scrollable-panel"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-column"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: _config_js__WEBPACK_IMPORTED_MODULE_3__.LINK_CONTACT_US,
      className: "flat-button",
      target: "_blank"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "email"), " \xA0", react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "link_contact_us",
      defaultMessage: [{
        "type": 0,
        "value": "Contact Us"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: _config_js__WEBPACK_IMPORTED_MODULE_3__.LINK_TERMS_OF_SERVICE,
      className: "flat-button",
      target: "_blank"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "description"), " \xA0", react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "link_terms_of_service",
      defaultMessage: [{
        "type": 0,
        "value": "Terms of Service"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: _config_js__WEBPACK_IMPORTED_MODULE_3__.LINK_PRIVACY_POLICY,
      className: "flat-button",
      target: "_blank"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "policy"), " \xA0", react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "link_privacy_policy",
      defaultMessage: [{
        "type": 0,
        "value": "Privacy Policy"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "hr"
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-column"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_client",
      defaultMessage: [{
        "type": 0,
        "value": "Client:"
      }]
    })), _config_js__WEBPACK_IMPORTED_MODULE_3__.APP_NAME), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_sdk",
      defaultMessage: [{
        "type": 0,
        "value": "SDK:"
      }]
    })), tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.getLibrary()), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_server",
      defaultMessage: [{
        "type": 0,
        "value": "Server:"
      }]
    })), this.props.serverVersion), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_server_address",
      defaultMessage: [{
        "type": 0,
        "value": "Server address:"
      }]
    })), this.props.serverAddress)));
  }
}
;

/***/ }),

/***/ "./src/views/contacts-view.jsx":
/*!*************************************!*\
  !*** ./src/views/contacts-view.jsx ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ContactsView)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _widgets_contact_list_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../widgets/contact-list.jsx */ "./src/widgets/contact-list.jsx");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");




const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  archived_contacts_title: {
    id: "archived_contacts",
    defaultMessage: [{
      "type": 0,
      "value": "Archived contacts ("
    }, {
      "type": 1,
      "value": "count"
    }, {
      "type": 0,
      "value": ")"
    }]
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
    props.chatList.map(c => {
      const blocked = c.acs && !c.acs.isJoiner();
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
      return (b.touched || 0) - (a.touched || 0);
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
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "contacts_not_found",
      defaultMessage: [{
        "type": 0,
        "value": "You have no chats"
      }, {
        "type": 0,
        "value": "<br/>"
      }, {
        "type": 0,
        "value": "¯∖_(ツ)_/¯"
      }]
    }, no_contacts => react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_contact_list_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
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
    }));
  }
}
;

/***/ }),

/***/ "./src/views/info-view.jsx":
/*!*********************************!*\
  !*** ./src/views/info-view.jsx ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _widgets_avatar_upload_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../widgets/avatar-upload.jsx */ "./src/widgets/avatar-upload.jsx");
/* harmony import */ var _widgets_badge_list_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../widgets/badge-list.jsx */ "./src/widgets/badge-list.jsx");
/* harmony import */ var _widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../widgets/checkbox.jsx */ "./src/widgets/checkbox.jsx");
/* harmony import */ var _widgets_contact_list_jsx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../widgets/contact-list.jsx */ "./src/widgets/contact-list.jsx");
/* harmony import */ var _widgets_error_panel_jsx__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../widgets/error-panel.jsx */ "./src/widgets/error-panel.jsx");
/* harmony import */ var _widgets_group_manager_jsx__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../widgets/group-manager.jsx */ "./src/widgets/group-manager.jsx");
/* harmony import */ var _widgets_menu_cancel_jsx__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../widgets/menu-cancel.jsx */ "./src/widgets/menu-cancel.jsx");
/* harmony import */ var _widgets_permissions_editor_jsx__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../widgets/permissions-editor.jsx */ "./src/widgets/permissions-editor.jsx");
/* harmony import */ var _widgets_show_qrcode_jsx__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../widgets/show-qrcode.jsx */ "./src/widgets/show-qrcode.jsx");
/* harmony import */ var _topic_common_view_jsx__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./topic-common-view.jsx */ "./src/views/topic-common-view.jsx");
/* harmony import */ var _widgets_topic_security_jsx__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../widgets/topic-security.jsx */ "./src/widgets/topic-security.jsx");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");

















const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  info: {
    id: "panel_title_info",
    defaultMessage: [{
      "type": 0,
      "value": "Info"
    }]
  },
  general: {
    id: "panel_title_general",
    defaultMessage: [{
      "type": 0,
      "value": "General"
    }]
  },
  security: {
    id: "panel_title_security",
    defaultMessage: [{
      "type": 0,
      "value": "Security"
    }]
  },
  members: {
    id: "panel_title_members",
    defaultMessage: [{
      "type": 0,
      "value": "Members"
    }]
  },
  crop: {
    id: "panel_title_crop",
    defaultMessage: [{
      "type": 0,
      "value": "Drag to Adjust"
    }]
  },
  perm_want: {
    id: "requested_permissions",
    defaultMessage: [{
      "type": 0,
      "value": "Requested"
    }]
  },
  perm_given: {
    id: "granted_permissions",
    defaultMessage: [{
      "type": 0,
      "value": "Granted"
    }]
  },
  perm_auth: {
    id: "permissions_authenticated",
    defaultMessage: [{
      "type": 0,
      "value": "Authenticated"
    }]
  },
  perm_anon: {
    id: "permissions_anonymous",
    defaultMessage: [{
      "type": 0,
      "value": "Anonymous"
    }]
  },
  perm_user: {
    id: "permissions_user",
    defaultMessage: [{
      "type": 0,
      "value": "User's Permissions"
    }]
  },
  edit_permissions: {
    id: "menu_item_edit_permissions",
    defaultMessage: [{
      "type": 0,
      "value": "Edit permissions"
    }]
  },
  qrcode: {
    id: "scan_qr_code",
    defaultMessage: [{
      "type": 0,
      "value": "Scan QR Code"
    }]
  }
});
class InfoView extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    this.state = {
      topic: null,
      owner: false,
      admin: false,
      sharer: false,
      deleter: false,
      muted: false,
      address: null,
      groupTopic: undefined,
      channel: undefined,
      fullName: undefined,
      description: undefined,
      avatar: null,
      private: null,
      selectedContact: null,
      access: null,
      modeGiven: null,
      modeWant: null,
      modeGiven2: null,
      modeWant2: null,
      auth: null,
      anon: null,
      contactList: [],
      trustedBadges: [],
      previousMetaDesc: undefined,
      previousSubsUpdated: undefined
    };
    this.resetSubs = this.resetSubs.bind(this);
    this.resetDesc = this.resetDesc.bind(this);
    this.resetTags = this.resetTags.bind(this);
    this.onMetaDesc = this.onMetaDesc.bind(this);
    this.onSubsUpdated = this.onSubsUpdated.bind(this);
    this.handleImageChanged = this.handleImageChanged.bind(this);
    this.handleMuted = this.handleMuted.bind(this);
    this.handleUnarchive = this.handleUnarchive.bind(this);
    this.handlePermissionsChanged = this.handlePermissionsChanged.bind(this);
    this.handleLaunchPermissionsEditor = this.handleLaunchPermissionsEditor.bind(this);
    this.handleCopyID = this.handleCopyID.bind(this);
    this.handleShowQRCode = this.handleShowQRCode.bind(this);
    this.handleShowAddMembers = this.handleShowAddMembers.bind(this);
    this.handleMemberUpdateRequest = this.handleMemberUpdateRequest.bind(this);
    this.handleMemberSelected = this.handleMemberSelected.bind(this);
    this.handleContextMenu = this.handleContextMenu.bind(this);
    this.handleBackNavigate = this.handleBackNavigate.bind(this);
  }
  componentDidUpdate(props) {
    const topic = this.props.tinode.getTopic(props.topic);
    if (!topic) {
      return;
    }
    if (this.onMetaDesc != topic.onMetaDesc) {
      this.previousMetaDesc = topic.onMetaDesc;
      topic.onMetaDesc = this.onMetaDesc;
      this.previousSubsUpdated = topic.onSubsUpdated;
      topic.onSubsUpdated = this.onSubsUpdated;
    }
    if (this.state.topic != props.topic) {
      this.setState({
        topic: props.topic
      });
      this.resetDesc(topic, props);
      this.resetSubs(topic, props);
      this.resetTags(topic);
    }
  }
  componentWillUnmount() {
    const topic = this.props.tinode.getTopic(this.props.topic);
    if (!topic) {
      return;
    }
    this.setState({
      topic: null
    });
    topic.onMetaDesc = this.previousMetaDesc;
    topic.onSubsUpdated = this.previousSubsUpdated;
  }
  resetSubs(topic, props) {
    const newState = {
      contactList: []
    };
    if (topic.getType() == 'p2p') {
      const user2 = topic.subscriber(props.topic);
      if (user2) {
        newState.modeGiven2 = user2.acs.getGiven();
        newState.modeWant2 = user2.acs.getWant();
      } else {
        newState.modeGiven2 = _config_js__WEBPACK_IMPORTED_MODULE_14__.NO_ACCESS_MODE;
        newState.modeWant2 = _config_js__WEBPACK_IMPORTED_MODULE_14__.NO_ACCESS_MODE;
      }
    } else {
      topic.subscribers(sub => {
        newState.contactList.push(sub);
      }, this);
    }
    this.setState(newState);
  }
  resetDesc(topic, props) {
    const defacs = topic.getDefaultAccess() || {};
    const acs = topic.getAccessMode();
    const badges = [];
    if (topic.trusted) {
      for (const [key, val] of Object.entries(topic.trusted)) {
        if (val) {
          badges.push(key);
        }
      }
    }
    this.setState({
      owner: acs && acs.isOwner(),
      admin: acs && acs.isAdmin(),
      sharer: acs && acs.isSharer(),
      deleter: acs && acs.isDeleter(),
      muted: acs && acs.isMuted(),
      fullName: (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_16__.clipStr)(topic.public && topic.public.fn, _config_js__WEBPACK_IMPORTED_MODULE_14__.MAX_TITLE_LENGTH),
      description: (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_16__.clipStr)(topic.public && topic.public.note, _config_js__WEBPACK_IMPORTED_MODULE_14__.MAX_TOPIC_DESCRIPTION_LENGTH),
      avatar: (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_15__.makeImageUrl)(topic.public ? topic.public.photo : null),
      trustedBadges: badges,
      private: (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_16__.clipStr)(topic.private && topic.private.comment, _config_js__WEBPACK_IMPORTED_MODULE_14__.MAX_TITLE_LENGTH),
      archived: topic.isArchived(),
      address: topic.name,
      groupTopic: topic.isGroupType(),
      channel: topic.isChannelType() || topic.chan,
      access: acs ? acs.getMode() : undefined,
      modeGiven: acs ? acs.getGiven() : undefined,
      modeWant: acs ? acs.getWant() : undefined,
      auth: defacs.auth,
      anon: defacs.anon
    });
  }
  resetTags(topic) {
    if (topic.getType() != 'grp') {
      return;
    }
    const acs = topic.getAccessMode();
    if (acs && acs.isOwner()) {
      topic.getMeta(topic.startMetaQuery().withTags().build());
    }
  }
  onMetaDesc(desc) {
    const topic = this.props.tinode.getTopic(this.props.topic);
    if (!topic) {
      return;
    }
    this.resetDesc(topic, this.props);
    if (this.previousMetaDesc && this.previousMetaDesc != this.onMetaDesc) {
      this.previousMetaDesc(desc);
    }
  }
  onSubsUpdated(subs) {
    const topic = this.props.tinode.getTopic(this.props.topic);
    if (!topic) {
      return;
    }
    this.resetSubs(topic, this.props);
    if (this.previousSubsUpdated && this.previousSubsUpdated != this.onSubsUpdated) {
      this.previousSubsUpdated(subs);
    }
  }
  handleImageChanged(mime, img) {
    this.setState({
      avatar: img
    });
    this.props.onTopicDescUpdate(this.props.topic, (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_16__.theCard)(null, img || tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.DEL_CHAR), null);
  }
  handleMuted(ignored, checked) {
    this.setState({
      muted: checked
    });
    this.props.onChangePermissions(this.props.topic, checked ? '-P' : '+P');
  }
  handleUnarchive(ignored, ignored2) {
    this.props.onTopicUnArchive(this.props.topic);
  }
  handlePermissionsChanged(which, perm) {
    switch (which) {
      case 'auth':
        this.props.onTopicDescUpdateRequest(this.props.topic, null, null, {
          auth: perm
        });
        break;
      case 'anon':
        this.props.onTopicDescUpdateRequest(this.props.topic, null, null, {
          anon: perm
        });
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
    this.handleBackNavigate();
  }
  handleLaunchPermissionsEditor(which, uid) {
    const {
      formatMessage
    } = this.props.intl;
    let toEdit, toCompare, toSkip, titleEdit, titleCompare, userTitle, userAvatar;
    switch (which) {
      case 'mode':
        toEdit = this.state.access;
        break;
      case 'want':
        toEdit = this.state.modeWant;
        toCompare = this.state.modeGiven;
        if (this.state.owner) {
          toSkip = 'O';
        } else {
          toSkip = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.AccessMode.encode(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.AccessMode.diff('ASDO', this.state.modeGiven));
          if (this.state.channel) {
            toSkip += 'W';
          }
        }
        titleEdit = formatMessage(messages.perm_want);
        titleCompare = formatMessage(messages.perm_given);
        break;
      case 'given':
        toEdit = this.state.modeGiven2;
        toCompare = this.state.modeWant2;
        toSkip = this.state.groupTopic ? this.state.owner ? '' : 'O' : 'ASDO';
        titleEdit = formatMessage(messages.perm_given);
        titleCompare = formatMessage(messages.perm_want);
        break;
      case 'auth':
        toEdit = this.state.auth;
        toSkip = 'O';
        break;
      case 'anon':
        toEdit = this.state.anon;
        toSkip = 'O';
        break;
      case 'user':
        {
          const topic = this.props.tinode.getTopic(this.props.topic);
          if (!topic) {
            return;
          }
          const user = topic.subscriber(uid);
          if (!user || !user.acs) {
            return;
          }
          toEdit = user.acs.getGiven();
          toCompare = user.acs.getWant();
          toSkip = this.state.owner ? '' : 'O';
          titleEdit = formatMessage(messages.perm_given);
          titleCompare = formatMessage(messages.perm_want);
          if (user.public) {
            userTitle = user.public.fn;
            userAvatar = user.public.photo;
          }
          break;
        }
      default:
        console.error("Unknown permission editing mode '" + which + "'");
        return;
    }
    this.setState({
      userPermissionsEdited: uid,
      userPermissionsTitle: userTitle,
      userPermissionsAvatar: userAvatar,
      editedPermissions: toEdit,
      immutablePermissions: toCompare,
      editedPermissionsTitle: titleEdit,
      immutablePermissionsTitle: titleCompare,
      editedPermissionsSkipped: toSkip
    });
    this.props.onNavigate(`perm/${which}`);
  }
  handleCopyID(e) {
    e.preventDefault();
    navigator.clipboard.writeText(this.props.myUserId);
  }
  handleShowQRCode(e) {
    e.preventDefault();
    this.props.onNavigate('qrcode');
  }
  handleShowAddMembers(e) {
    e.preventDefault();
    this.props.onInitFind();
    this.props.onNavigate('members');
  }
  handleMemberUpdateRequest(members, added, removed) {
    this.props.onMemberUpdateRequest(this.props.topic, added, removed);
    this.props.onNavigate('info');
  }
  handleMemberSelected(uid) {
    this.setState({
      selectedContact: uid
    });
  }
  handleBackNavigate() {
    const args = (this.props.panel || 'info').split('/');
    if (args[0] == 'info') {
      this.props.onNavigate(null);
    } else if (args[0] == 'perm') {
      if (args[1] == 'user') {
        this.props.onNavigate('info');
      } else {
        this.props.onNavigate('security');
      }
    } else {
      this.props.onNavigate('info');
    }
  }
  handleContextMenu(params) {
    const {
      formatMessage
    } = this.props.intl;
    const topic = this.props.tinode.getTopic(this.props.topic);
    if (!topic) {
      return;
    }
    const user = topic.subscriber(params.topicName);
    if (!user || !user.acs) {
      return;
    }
    const isMe = this.props.tinode.isMe(params.topicName);
    const menuItems = [{
      title: formatMessage(messages.edit_permissions),
      handler: _ => this.handleLaunchPermissionsEditor(isMe ? 'want' : 'user', params.topicName)
    }];
    if (!isMe) {
      menuItems.push('member_delete');
    }
    menuItems.push(user.acs.isMuted() ? 'member_unmute' : 'member_mute');
    if (!isMe) {
      menuItems.push(user.acs.isJoiner() ? 'member_block' : 'member_unblock');
    }
    this.props.showContextMenu({
      topicName: this.props.topic,
      x: params.x,
      y: params.y,
      user: params.topicName
    }, menuItems);
  }
  render() {
    const args = (this.props.panel || 'info').split('/');
    const view = args[0];
    args.shift();
    const {
      formatMessage
    } = this.props.intl;
    const panelTitle = formatMessage((view == 'perm' ? messages['perm_' + args[0]] : messages[view]) || messages['info']);
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "info-view"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "caption-panel",
      id: "info-caption-panel"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-title",
      id: "info-title"
    }, panelTitle), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_menu_cancel_jsx__WEBPACK_IMPORTED_MODULE_9__["default"], {
      onCancel: this.handleBackNavigate
    }))), this.props.displayMobile ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_error_panel_jsx__WEBPACK_IMPORTED_MODULE_7__["default"], {
      level: this.props.errorLevel,
      text: this.props.errorText,
      onClearError: this.props.onError
    }) : null, view == 'members' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_group_manager_jsx__WEBPACK_IMPORTED_MODULE_8__["default"], {
      tinode: this.props.tinode,
      members: this.state.contactList,
      requiredMember: this.props.myUserId,
      keepInitialMembers: !this.state.admin && !this.state.owner,
      myUserId: this.props.myUserId,
      contacts: this.props.searchableContacts,
      onCancel: this.handleBackNavigate,
      onSubmit: this.handleMemberUpdateRequest
    }) : view == 'perm' && args.length > 0 ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_permissions_editor_jsx__WEBPACK_IMPORTED_MODULE_10__["default"], {
      tinode: this.props.tinode,
      mode: this.state.editedPermissions,
      compare: this.state.immutablePermissions,
      skip: this.state.editedPermissionsSkipped,
      modeTitle: this.state.editedPermissionsTitle,
      compareTitle: this.state.immutablePermissionsTitle,
      userTitle: this.state.userPermissionsTitle,
      item: this.state.userPermissionsEdited,
      userAvatar: this.state.userPermissionsAvatar,
      onSubmit: mode => this.handlePermissionsChanged(args[0], mode),
      onCancel: this.handleBackNavigate
    }) : view == 'general' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_topic_common_view_jsx__WEBPACK_IMPORTED_MODULE_12__["default"], {
      tinode: this.props.tinode,
      topic: this.props.topic,
      reqCredMethod: this.props.reqCredMethod,
      onCredAdd: this.props.onCredAdd,
      onUpdateTagsRequest: this.props.onTopicTagsUpdateRequest,
      onCredConfirm: this.props.onCredConfirm,
      onCredDelete: this.props.onCredDelete,
      onUpdateTopicDesc: this.props.onTopicDescUpdateRequest,
      onError: this.props.onError
    }) : view == 'security' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_topic_security_jsx__WEBPACK_IMPORTED_MODULE_13__["default"], {
      topic: this.props.topic,
      owner: this.state.owner,
      admin: this.state.admin,
      sharer: this.state.sharer,
      deleter: this.state.deleter,
      muted: this.state.muted,
      groupTopic: this.state.groupTopic,
      channel: this.state.channel,
      access: this.state.access,
      modeGiven: this.state.modeGiven,
      modeWant: this.state.modeWant,
      modeGiven2: this.state.modeGiven2,
      modeWant2: this.state.modeWant2,
      auth: this.state.auth,
      anon: this.state.anon,
      onShowAlert: this.props.onShowAlert,
      onDeleteMessages: this.props.onDeleteMessages,
      onLeaveTopic: this.props.onLeaveTopic,
      onBlockTopic: this.props.onBlockTopic,
      onReportTopic: this.props.onReportTopic,
      onLaunchPermissionsEditor: this.handleLaunchPermissionsEditor,
      onNavigate: this.props.onNavigate
    }) : view == 'qrcode' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_show_qrcode_jsx__WEBPACK_IMPORTED_MODULE_11__["default"], {
      uri: tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.URI_TOPIC_ID_PREFIX + this.props.tinode.myUserId,
      onCancel: this.handleBackNavigate
    }) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "info-view-content",
      className: "scrollable-panel"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-column"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      className: "flat-button float-right",
      onClick: e => {
        e.preventDefault();
        this.props.onNavigate('general');
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "edit"), "\xA0", react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "button_edit",
      defaultMessage: [{
        "type": 0,
        "value": "Edit"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("center", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_avatar_upload_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
      tinode: this.props.tinode,
      avatar: this.state.avatar,
      readOnly: true,
      uid: this.props.topic,
      title: this.state.fullName
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "group"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_topic_name",
      defaultMessage: [{
        "type": 0,
        "value": "Name"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "large ellipsized"
    }, this.state.fullName, this.state.channel ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
      src: "/img/channel.png",
      className: "channel",
      alt: "channel"
    }) : null)), this.state.private ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "group"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_private",
      defaultMessage: [{
        "type": 0,
        "value": "Private comment"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "large ellipsized"
    }, this.state.private)) : null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_user_id",
      defaultMessage: [{
        "type": 0,
        "value": "ID:"
      }]
    })), "\xA0", react__WEBPACK_IMPORTED_MODULE_0___default().createElement("tt", null, this.state.address)), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      style: {
        marginLeft: 'auto'
      }
    }, "\xA0", react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: this.handleCopyID
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "content_copy")), "\xA0 \xA0", react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: this.handleShowQRCode
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "qr_code")), "\xA0")), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "group"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_badge_list_jsx__WEBPACK_IMPORTED_MODULE_4__["default"], {
      trustedBadges: this.state.trustedBadges
    })), this.state.description ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "group"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_description",
      defaultMessage: [{
        "type": 0,
        "value": "Description"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, this.state.description)) : null), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "hr"
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_muting_topic",
      defaultMessage: [{
        "type": 0,
        "value": "Muted:"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_5__["default"], {
      name: "P",
      checked: this.state.muted,
      onChange: this.handleMuted
    })), this.state.archived ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_unarchive_topic",
      defaultMessage: [{
        "type": 0,
        "value": "Archived:"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_5__["default"], {
      name: "archived",
      checked: true,
      onChange: this.handleUnarchive
    })) : null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "hr"
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      className: "flat-button",
      onClick: e => {
        e.preventDefault();
        this.props.onNavigate('security');
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "security"), "\xA0", react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "button_security",
      defaultMessage: [{
        "type": 0,
        "value": "Security"
      }]
    }))), this.state.groupTopic && this.state.sharer ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "hr"
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_group_members",
      defaultMessage: [{
        "type": 0,
        "value": "Group members:"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      className: "flat-button",
      onClick: this.handleShowAddMembers
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "person_add"), " \xA0", react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "button_add_members",
      defaultMessage: [{
        "type": 0,
        "value": "Add members"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "group_has_no_members",
      defaultMessage: [{
        "type": 0,
        "value": "No members"
      }]
    }, no_members => react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_contact_list_jsx__WEBPACK_IMPORTED_MODULE_6__["default"], {
      tinode: this.props.tinode,
      contacts: this.state.contactList,
      myUserId: this.props.myUserId,
      emptyListMessage: no_members,
      topicSelected: this.state.selectedContact,
      showOnline: false,
      showUnread: false,
      showMode: true,
      noScroll: true,
      onTopicSelected: this.handleMemberSelected,
      showContextMenu: this.state.admin ? this.handleContextMenu : false
    }))) : null));
  }
}
;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(InfoView));

/***/ }),

/***/ "./src/views/login-view.jsx":
/*!**********************************!*\
  !*** ./src/views/login-view.jsx ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LoginView)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../widgets/checkbox.jsx */ "./src/widgets/checkbox.jsx");
/* harmony import */ var _widgets_visible_password_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../widgets/visible-password.jsx */ "./src/widgets/visible-password.jsx");




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
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("form", {
      id: "login-form",
      onSubmit: this.handleSubmit
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "login_prompt",
      defaultMessage: [{
        "type": 0,
        "value": "Login"
      }]
    }, login_prompt => react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
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
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "password_prompt",
      defaultMessage: [{
        "type": 0,
        "value": "Password"
      }]
    }, password_prompt => react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_visible_password_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
      type: "password",
      id: "inputPassword",
      placeholder: password_prompt,
      autoComplete: "current-password",
      value: this.state.password,
      onChange: this.handlePasswordChange,
      required: true
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
      id: "save-token",
      name: "save-token",
      checked: this.state.saveToken,
      onChange: this.handleToggleSaveToken
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      htmlFor: "save-token"
    }, "\xA0", react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "stay_logged_in",
      defaultMessage: [{
        "type": 0,
        "value": "Stay logged in"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#reset"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "forgot_password_link",
      defaultMessage: [{
        "type": 0,
        "value": "Forgot password?"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "dialog-buttons"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      className: submitClasses,
      type: "submit"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "button_sign_in",
      defaultMessage: [{
        "type": 0,
        "value": "Sign in"
      }]
    }))));
  }
}
;

/***/ }),

/***/ "./src/views/logo-view.jsx":
/*!*********************************!*\
  !*** ./src/views/logo-view.jsx ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LogoView)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config.js */ "./src/config.js");




class LogoView extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    const version = _config_js__WEBPACK_IMPORTED_MODULE_3__.APP_NAME + ' (' + tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.getLibrary() + ')';
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "dummy-view"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "https://github.com/tinode/chat/"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
      id: "logo",
      alt: "logo",
      src: "img/logo.svg"
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h2", null, "Tinode Web")), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_client",
      defaultMessage: [{
        "type": 0,
        "value": "Client:"
      }]
    }), " ", version), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_server",
      defaultMessage: [{
        "type": 0,
        "value": "Server:"
      }]
    }), " ", this.props.serverVersion, " (", this.props.serverAddress, ")")));
  }
}
;

/***/ }),

/***/ "./src/views/messages-view.jsx":
/*!*************************************!*\
  !*** ./src/views/messages-view.jsx ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _widgets_call_panel_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../widgets/call-panel.jsx */ "./src/widgets/call-panel.jsx");
/* harmony import */ var _widgets_chat_message_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../widgets/chat-message.jsx */ "./src/widgets/chat-message.jsx");
/* harmony import */ var _widgets_contact_badges_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../widgets/contact-badges.jsx */ "./src/widgets/contact-badges.jsx");
/* harmony import */ var _widgets_doc_preview_jsx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../widgets/doc-preview.jsx */ "./src/widgets/doc-preview.jsx");
/* harmony import */ var _widgets_error_panel_jsx__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../widgets/error-panel.jsx */ "./src/widgets/error-panel.jsx");
/* harmony import */ var _widgets_group_subs_jsx__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../widgets/group-subs.jsx */ "./src/widgets/group-subs.jsx");
/* harmony import */ var _widgets_image_preview_jsx__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../widgets/image-preview.jsx */ "./src/widgets/image-preview.jsx");
/* harmony import */ var _widgets_invitation_jsx__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../widgets/invitation.jsx */ "./src/widgets/invitation.jsx");
/* harmony import */ var _widgets_letter_tile_jsx__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../widgets/letter-tile.jsx */ "./src/widgets/letter-tile.jsx");
/* harmony import */ var _widgets_load_spinner_jsx__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../widgets/load-spinner.jsx */ "./src/widgets/load-spinner.jsx");
/* harmony import */ var _logo_view_jsx__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./logo-view.jsx */ "./src/views/logo-view.jsx");
/* harmony import */ var _widgets_meta_message_jsx__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../widgets/meta-message.jsx */ "./src/widgets/meta-message.jsx");
/* harmony import */ var _widgets_send_message_jsx__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../widgets/send-message.jsx */ "./src/widgets/send-message.jsx");
/* harmony import */ var _widgets_video_preview_jsx__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../widgets/video-preview.jsx */ "./src/widgets/video-preview.jsx");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../constants.js */ "./src/constants.js");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
/* harmony import */ var _lib_navigation_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../lib/navigation.js */ "./src/lib/navigation.js");
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");






















const NOTIFICATION_EXEC_INTERVAL = 300;
const SHOW_GO_TO_LAST_DIST = 100;
const FETCH_PAGE_TRIGGER = 40;
const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  online_now: {
    id: "online_now",
    defaultMessage: [{
      "type": 0,
      "value": "online now"
    }]
  },
  last_seen: {
    id: "last_seen_timestamp",
    defaultMessage: [{
      "type": 0,
      "value": "Last seen"
    }]
  },
  not_found: {
    id: "title_not_found",
    defaultMessage: [{
      "type": 0,
      "value": "Not found"
    }]
  },
  channel: {
    id: "channel",
    defaultMessage: [{
      "type": 0,
      "value": "channel"
    }]
  },
  file_attachment_too_large: {
    id: "file_attachment_too_large",
    defaultMessage: [{
      "type": 0,
      "value": "The file size "
    }, {
      "type": 1,
      "value": "size"
    }, {
      "type": 0,
      "value": " exceeds the "
    }, {
      "type": 1,
      "value": "limit"
    }, {
      "type": 0,
      "value": " limit."
    }]
  },
  invalid_content: {
    id: "invalid_content",
    defaultMessage: [{
      "type": 0,
      "value": "invalid content"
    }]
  },
  editing_message: {
    id: "editing_message",
    defaultMessage: [{
      "type": 0,
      "value": "Editing"
    }]
  },
  drag_file: {
    id: "drag_file",
    defaultMessage: [{
      "type": 0,
      "value": "Drag file here"
    }]
  }
});
function isUnconfirmed(acs) {
  if (acs) {
    const ex = acs.getExcessive() || '';
    return acs.isJoiner('given') && (ex.includes('R') || ex.includes('W'));
  }
  return false;
}
function isPeerRestricted(acs) {
  if (acs) {
    const ms = acs.getMissing() || '';
    return acs.isJoiner('want') && (ms.includes('R') || ms.includes('W'));
  }
  return false;
}
function shouldPresentCallPanel(callState) {
  return callState == _constants_js__WEBPACK_IMPORTED_MODULE_18__.CALL_STATE_OUTGOING_INITATED || callState == _constants_js__WEBPACK_IMPORTED_MODULE_18__.CALL_STATE_IN_PROGRESS;
}
class MessagesView extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    this.state = MessagesView.getDerivedStateFromProps(props, {});
    this.componentSetup = this.componentSetup.bind(this);
    this.leave = this.leave.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.retrySend = this.retrySend.bind(this);
    this.sendImageAttachment = this.sendImageAttachment.bind(this);
    this.sendVideoAttachment = this.sendVideoAttachment.bind(this);
    this.sendFileAttachment = this.sendFileAttachment.bind(this);
    this.sendAudioAttachment = this.sendAudioAttachment.bind(this);
    this.sendKeyPress = this.sendKeyPress.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.handleScrollReference = this.handleScrollReference.bind(this);
    this.mountDnDEvents = this.mountDnDEvents.bind(this);
    this.handleScrollEvent = this.handleScrollEvent.bind(this);
    this.handleDescChange = this.handleDescChange.bind(this);
    this.handleSubsUpdated = this.handleSubsUpdated.bind(this);
    this.handleMessageUpdate = this.handleMessageUpdate.bind(this);
    this.handleAllMessagesReceived = this.handleAllMessagesReceived.bind(this);
    this.handleInfoReceipt = this.handleInfoReceipt.bind(this);
    this.handleExpandMedia = this.handleExpandMedia.bind(this);
    this.handleClosePreview = this.handleClosePreview.bind(this);
    this.handleFormResponse = this.handleFormResponse.bind(this);
    this.handleContextClick = this.handleContextClick.bind(this);
    this.handleShowMessageContextMenu = this.handleShowMessageContextMenu.bind(this);
    this.handleNewChatAcceptance = this.handleNewChatAcceptance.bind(this);
    this.handleEnablePeer = this.handleEnablePeer.bind(this);
    this.handleAttachFile = this.handleAttachFile.bind(this);
    this.handleAttachImageOrVideo = this.handleAttachImageOrVideo.bind(this);
    this.handleCancelUpload = this.handleCancelUpload.bind(this);
    this.postReadNotification = this.postReadNotification.bind(this);
    this.clearNotificationQueue = this.clearNotificationQueue.bind(this);
    this.goToLatestMessage = this.goToLatestMessage.bind(this);
    this.handleFileDrop = this.handleFileDrop.bind(this);
    this.handlePickReply = this.handlePickReply.bind(this);
    this.handleEditMessage = this.handleEditMessage.bind(this);
    this.handleCancelReply = this.handleCancelReply.bind(this);
    this.handleQuoteClick = this.handleQuoteClick.bind(this);
    this.handleCallHangup = this.handleCallHangup.bind(this);
    this.isDragEnabled = this.isDragEnabled.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDragIn = this.handleDragIn.bind(this);
    this.handleDragOut = this.handleDragOut.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.chatMessageRefs = {};
    this.getOrCreateMessageRef = this.getOrCreateMessageRef.bind(this);
    this.dragCounter = 0;
    this.dndRef = null;
    this.readNotificationQueue = [];
    this.readNotificationTimer = null;
    this.keyPressTimer = null;
  }
  getOrCreateMessageRef(seqId) {
    if (this.chatMessageRefs.hasOwnProperty(seqId)) {
      return this.chatMessageRefs[seqId];
    }
    const ref = react__WEBPACK_IMPORTED_MODULE_0___default().createRef();
    this.chatMessageRefs[seqId] = ref;
    return ref;
  }
  componentDidMount() {
    if (this.messagesScroller) {
      this.messagesScroller.addEventListener('scroll', this.handleScrollEvent);
    }
    this.mountDnDEvents(this.dndRef);
    this.componentSetup({}, {});
  }
  componentWillUnmount() {
    if (this.messagesScroller) {
      this.messagesScroller.removeEventListener('scroll', this.handleScrollEvent);
    }
    this.clearNotificationQueue();
    if (this.dndRef) {
      this.dndRef.removeEventListener('dragstart', this.handleDragStart);
      this.dndRef.removeEventListener('dragenter', this.handleDragIn);
      this.dndRef.removeEventListener('dragleave', this.handleDragOut);
      this.dndRef.removeEventListener('dragover', this.handleDrag);
      this.dndRef.removeEventListener('drop', this.handleDrop);
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.messagesScroller && (prevState.topic != this.state.topic || prevState.maxSeqId != this.state.maxSeqId || prevState.minSeqId != this.state.minSeqId)) {
      if (this.state.scrollPosition < SHOW_GO_TO_LAST_DIST) {
        this.messagesScroller.scrollTop = this.messagesScroller.scrollHeight - this.state.scrollPosition - this.messagesScroller.offsetHeight;
      }
    }
    if (!this.props.applicationVisible) {
      this.clearNotificationQueue();
    } else {
      this.postReadNotification(0);
    }
    this.componentSetup(prevProps, prevState);
  }
  componentSetup(prevProps, prevState) {
    const topic = this.props.tinode ? this.props.tinode.getTopic(this.state.topic) : undefined;
    if (this.state.topic != prevState.topic) {
      if (prevState.topic && !tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.isNewGroupTopicName(prevState.topic)) {
        this.leave(prevState.topic);
        if (prevState.rtcPanel) {
          this.handleCallHangup(prevState.topic, prevProps.callSeq);
        }
      }
      if (topic) {
        topic.onData = this.handleMessageUpdate;
        topic.onAllMessagesReceived = this.handleAllMessagesReceived;
        topic.onInfo = this.handleInfoReceipt;
        topic.onMetaDesc = this.handleDescChange;
        topic.onSubsUpdated = this.handleSubsUpdated;
        topic.onPres = this.handleSubsUpdated;
      }
    }
    if (topic) {
      if (this.state.topic != prevState.topic || this.props.myUserId && !prevProps.myUserId) {
        const newTopic = this.props.newTopicParams && this.props.newTopicParams._topicName == this.props.topic;
        if (topic.isP2PType() && newTopic && !_config_js__WEBPACK_IMPORTED_MODULE_17__.IMMEDIATE_P2P_SUBSCRIPTION) {
          topic.getMeta(topic.startMetaQuery().withDesc().build());
        } else if (this.props.myUserId) {
          this.subscribe(topic);
        }
      } else if (topic.isSubscribed() && this.state.isReader && !prevState.isReader) {
        topic.getMeta(topic.startMetaQuery().withLaterData().build());
      }
    }
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    let nextState = {};
    if (!nextProps.topic) {
      nextState = {
        minSeqId: -1,
        maxSeqId: -1,
        latestClearId: -1,
        onlineSubs: [],
        topic: null,
        title: '',
        avatar: null,
        isVerified: false,
        isStaff: false,
        isDangerous: false,
        deleted: false,
        docPreview: null,
        imagePreview: null,
        imagePostview: null,
        videoPreview: null,
        videoPostview: null,
        rtcPanel: null,
        typingIndicator: false,
        scrollPosition: 0,
        fetchingMessages: false,
        peerMessagingDisabled: false,
        channel: false,
        reply: null,
        contentToEdit: null,
        showGoToLastButton: false,
        dragging: false,
        subsVersion: 0
      };
    } else if (nextProps.topic != prevState.topic) {
      const topic = nextProps.tinode.getTopic(nextProps.topic);
      nextState = {
        topic: nextProps.topic,
        deleted: topic._deleted,
        docPreview: null,
        imagePreview: null,
        imagePostview: null,
        videoPreview: null,
        videoPostview: null,
        rtcPanel: null,
        typingIndicator: false,
        scrollPosition: 0,
        fetchingMessages: false,
        showGoToLastButton: false,
        contentToEdit: null,
        dragging: false
      };
      if (nextProps.forwardMessage) {
        nextState.reply = {
          content: nextProps.forwardMessage.preview,
          seq: null
        };
      } else {
        nextState.reply = null;
      }
      if (topic) {
        const subs = [];
        if (nextProps.connected) {
          topic.subscribers(sub => {
            if (sub.online && sub.user != nextProps.myUserId) {
              subs.push(sub);
            }
          });
        }
        Object.assign(nextState, {
          onlineSubs: subs
        });
        if (topic.public) {
          Object.assign(nextState, {
            title: topic.public.fn,
            avatar: (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_19__.makeImageUrl)(topic.public.photo)
          });
        } else {
          Object.assign(nextState, {
            title: '',
            avatar: null
          });
        }
        const peer = topic.p2pPeerDesc();
        if (peer) {
          Object.assign(nextState, {
            peerMessagingDisabled: isPeerRestricted(peer.acs)
          });
        } else if (prevState.peerMessagingDisabled) {
          Object.assign(nextState, {
            peerMessagingDisabled: false
          });
        }
        Object.assign(nextState, {
          minSeqId: topic.minMsgSeq(),
          maxSeqId: topic.maxMsgSeq(),
          latestClearId: topic.maxClearId(),
          channel: topic.isChannelType()
        });
        if (nextProps.callTopic == topic.name && shouldPresentCallPanel(nextProps.callState)) {
          nextState.rtcPanel = nextProps.callTopic;
        }
      } else {
        Object.assign(nextState, {
          minSeqId: -1,
          maxSeqId: -1,
          latestClearId: -1,
          onlineSubs: [],
          title: '',
          avatar: null,
          peerMessagingDisabled: false,
          channel: false
        });
      }
    } else {
      if (nextProps.callTopic == prevState.topic && !prevState.rtcPanel && shouldPresentCallPanel(nextProps.callState)) {
        nextState.rtcPanel = nextProps.callTopic;
      }
    }
    if (nextProps.acs) {
      if (nextProps.acs.isWriter() != prevState.isWriter) {
        nextState.isWriter = !prevState.isWriter;
      }
      if (nextProps.acs.isReader() != prevState.isReader) {
        nextState.isReader = !prevState.isReader;
      }
      if (!nextProps.acs.isReader('given') != prevState.readingBlocked) {
        nextState.readingBlocked = !prevState.readingBlocked;
      }
      if (nextProps.acs.isSharer() != prevState.isSharer) {
        nextState.isSharer = !prevState.isSharer;
      }
    } else {
      if (prevState.isWriter) {
        nextState.isWriter = false;
      }
      if (prevState.isReader) {
        nextState.isReader = false;
      }
      if (!prevState.readingBlocked) {
        prevState.readingBlocked = true;
      }
      if (prevState.isSharer) {
        nextState.isSharer = false;
      }
    }
    if (isUnconfirmed(nextProps.acs) == !prevState.unconformed) {
      nextState.unconfirmed = !prevState.unconformed;
    }
    if (!nextProps.connected && prevState.onlineSubs && prevState.onlineSubs.length > 0) {
      nextState.onlineSubs = [];
    }
    return nextState;
  }
  subscribe(topic) {
    if (topic.isSubscribed() || !this.props.ready) {
      return;
    }
    const newTopic = this.props.newTopicParams && this.props.newTopicParams._topicName == this.props.topic;
    let getQuery = topic.startMetaQuery().withLaterDesc().withLaterSub();
    if (this.state.isReader || newTopic) {
      getQuery = getQuery.withLaterData(_config_js__WEBPACK_IMPORTED_MODULE_17__.MESSAGES_PAGE);
      if (this.state.isReader) {
        getQuery = getQuery.withLaterDel();
      }
      this.setState({
        fetchingMessages: true
      });
    }
    const setQuery = newTopic ? this.props.newTopicParams : undefined;
    topic.subscribe(getQuery.build(), setQuery).then(ctrl => {
      if (ctrl.code == 303) {
        _lib_navigation_js__WEBPACK_IMPORTED_MODULE_20__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_20__["default"].setUrlTopic('', ctrl.params.topic));
        return;
      }
      if (this.state.topic != ctrl.topic) {
        this.setState({
          topic: ctrl.topic
        });
      }
      if (this.state.deleted) {
        this.setState({
          deleted: false
        });
      }
      this.props.onNewTopicCreated(this.props.topic, ctrl.topic);
      let discard = [];
      topic.queuedMessages(pub => {
        if (pub._sending) {
          return;
        }
        if (pub._fatal || pub.head && pub.head.webrtc) {
          discard.push(pub.seq);
          return;
        }
        if (topic.isSubscribed()) {
          this.retrySend(pub);
        }
      });
      if (discard.length > 0) {
        topic.delMessagesList(discard, true);
      }
    }).catch(err => {
      console.error("Failed subscription to", this.state.topic, err);
      this.props.onError(err.message, 'err');
      const blankState = MessagesView.getDerivedStateFromProps({}, {});
      blankState.title = this.props.intl.formatMessage(messages.not_found);
      this.setState(blankState);
    });
  }
  leave(oldTopicName) {
    if (!oldTopicName || !this.props.tinode.isTopicCached(oldTopicName)) {
      return;
    }
    const oldTopic = this.props.tinode.getTopic(oldTopicName);
    if (oldTopic && oldTopic.isSubscribed()) {
      oldTopic.leave(false).catch(_ => {}).finally(_ => {
        this.setState({
          fetchingMessages: false
        });
        oldTopic.onData = undefined;
        oldTopic.onAllMessagesReceived = undefined;
        oldTopic.onInfo = undefined;
        oldTopic.onMetaDesc = undefined;
        oldTopic.onSubsUpdated = undefined;
        oldTopic.onPres = undefined;
      });
    }
  }
  handleScrollReference(node) {
    if (node) {
      node.addEventListener('scroll', this.handleScrollEvent);
      this.messagesScroller = node;
      this.messagesScroller.scrollTop = this.messagesScroller.scrollHeight - this.state.scrollPosition - this.messagesScroller.offsetHeight;
    }
  }
  handleScrollEvent(event) {
    const pos = event.target.scrollHeight - event.target.scrollTop - event.target.offsetHeight;
    this.setState({
      scrollPosition: pos,
      showGoToLastButton: pos > SHOW_GO_TO_LAST_DIST && pos < this.state.scrollPosition
    });
    if (this.state.fetchingMessages) {
      return;
    }
    if (event.target.scrollTop <= FETCH_PAGE_TRIGGER) {
      const topic = this.props.tinode.getTopic(this.state.topic);
      if (topic && topic.isSubscribed() && topic.msgHasMoreMessages()) {
        this.setState({
          fetchingMessages: true
        }, _ => {
          topic.getMessagesPage(_config_js__WEBPACK_IMPORTED_MODULE_17__.MESSAGES_PAGE).catch(err => this.props.onError(err.message, 'err')).finally(_ => this.setState({
            fetchingMessages: false
          }));
        });
      }
    }
  }
  mountDnDEvents(dnd) {
    if (dnd) {
      dnd.addEventListener('dragstart', this.handleDragStart);
      dnd.addEventListener('dragenter', this.handleDragIn);
      dnd.addEventListener('dragleave', this.handleDragOut);
      dnd.addEventListener('dragover', this.handleDrag);
      dnd.addEventListener('drop', this.handleDrop);
      this.dndRef = dnd;
    }
  }
  goToLatestMessage() {
    this.setState({
      scrollPosition: 0
    });
    if (this.messagesScroller) {
      this.messagesScroller.scrollTop = this.messagesScroller.scrollHeight - this.messagesScroller.offsetHeight;
    }
  }
  handleDescChange(desc) {
    if (desc.public) {
      this.setState({
        title: desc.public.fn,
        avatar: (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_19__.makeImageUrl)(desc.public.photo)
      });
    } else {
      this.setState({
        title: '',
        avatar: null
      });
    }
    if (desc.acs) {
      this.setState({
        isWriter: desc.acs.isWriter(),
        isReader: desc.acs.isReader(),
        readingBlocked: !desc.acs.isReader('given'),
        unconfirmed: isUnconfirmed(desc.acs)
      });
    }
  }
  postReadNotification(seq) {
    if (!this.props.applicationVisible) {
      return;
    }
    if (!this.readNotificationTimer) {
      this.readNotificationTimer = setInterval(_ => {
        if (this.readNotificationQueue.length == 0) {
          clearInterval(this.readNotificationTimer);
          this.readNotificationTimer = null;
          return;
        }
        let seq = -1;
        while (this.readNotificationQueue.length > 0) {
          const n = this.readNotificationQueue[0];
          if (n.topicName != this.state.topic) {
            this.readNotificationQueue.shift();
            continue;
          }
          const now = new Date();
          if (n.sendAt <= now) {
            this.readNotificationQueue.shift();
            seq = Math.max(seq, n.seq);
          } else {
            break;
          }
        }
        if (seq >= 0) {
          const topic = this.props.tinode.getTopic(this.state.topic);
          if (topic) {
            topic.noteRead(seq);
          }
        }
      }, NOTIFICATION_EXEC_INTERVAL);
    }
    const now = new Date();
    this.readNotificationQueue.push({
      topicName: this.state.topic,
      seq: seq,
      sendAt: now.setMilliseconds(now.getMilliseconds() + _config_js__WEBPACK_IMPORTED_MODULE_17__.READ_DELAY)
    });
  }
  clearNotificationQueue() {
    this.readNotificationQueue = [];
    if (this.readNotificationTimer) {
      clearInterval(this.readNotificationTimer);
      this.readNotificationTimer = null;
    }
  }
  handleSubsUpdated() {
    if (this.state.topic) {
      const subs = [];
      const topic = this.props.tinode.getTopic(this.state.topic);
      topic.subscribers(sub => {
        if (sub.online && sub.user != this.props.myUserId) {
          subs.push(sub);
        }
      });
      const newState = {
        onlineSubs: subs,
        subsVersion: this.state.subsVersion + 1
      };
      const peer = topic.p2pPeerDesc();
      if (peer) {
        Object.assign(newState, {
          peerMessagingDisabled: isPeerRestricted(peer.acs)
        });
      } else if (this.state.peerMessagingDisabled) {
        Object.assign(newState, {
          peerMessagingDisabled: false
        });
      }
      this.setState(newState);
    }
  }
  handleMessageUpdate(msg) {
    if (!this.state.topic) {
      return;
    }
    const topic = this.props.tinode.getTopic(this.state.topic);
    if (!msg) {
      this.setState({
        latestClearId: topic.maxClearId()
      });
      return;
    }
    clearTimeout(this.keyPressTimer);
    this.setState({
      maxSeqId: topic.maxMsgSeq(),
      minSeqId: topic.minMsgSeq(),
      typingIndicator: false
    }, _ => {
      if (topic.isNewMessage(msg.seq)) {
        if (this.state.scrollPosition > SHOW_GO_TO_LAST_DIST) {
          this.setState({
            showGoToLastButton: true
          });
        } else {
          this.goToLatestMessage();
        }
      } else {
        if (this.messagesScroller) {
          this.messagesScroller.scrollTop = this.messagesScroller.scrollHeight - this.state.scrollPosition - this.messagesScroller.offsetHeight;
        }
      }
    });
    const status = topic.msgStatus(msg, true);
    if (status >= tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.MESSAGE_STATUS_SENT && msg.from != this.props.myUserId) {
      this.postReadNotification(msg.seq);
    }
  }
  handleAllMessagesReceived(count) {
    this.setState({
      fetchingMessages: false
    });
    if (count > 0) {
      this.postReadNotification(0);
    }
  }
  handleInfoReceipt(info) {
    switch (info.what) {
      case 'kp':
        {
          clearTimeout(this.keyPressTimer);
          this.keyPressTimer = setTimeout(_ => this.setState({
            typingIndicator: false
          }), _config_js__WEBPACK_IMPORTED_MODULE_17__.KEYPRESS_DELAY + 1000);
          if (!this.state.typingIndicator) {
            this.setState({
              typingIndicator: true
            });
          }
          break;
        }
      case 'read':
      case 'recv':
        this.forceUpdate();
        break;
      default:
        console.info("Other change in topic: ", info.what);
    }
  }
  handleExpandMedia(content) {
    if (!content) {
      return;
    }
    if (content.video) {
      this.setState({
        videoPostview: content
      });
    } else {
      this.setState({
        imagePostview: content
      });
    }
  }
  handleClosePreview() {
    if (this.state.imagePreview && this.state.imagePreview.url) {
      URL.revokeObjectURL(this.state.imagePreview.url);
    }
    if (this.state.videoPreview && this.state.videoPreview.url) {
      URL.revokeObjectURL(this.state.videoPreview.url);
    }
    this.setState({
      imagePostview: null,
      imagePreview: null,
      docPreview: null,
      videoPreview: null,
      videoPostview: null
    });
  }
  handleFormResponse(action, text, data) {
    if (action == 'pub') {
      this.sendMessage(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.attachJSON(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.parse(text), data));
    } else if (action == 'url') {
      const url = new URL(data.ref);
      const params = url.searchParams;
      for (let key in data.resp) {
        if (data.resp.hasOwnProperty(key)) {
          params.set(key, data.resp[key]);
        }
      }
      ['name', 'seq'].map(key => {
        if (data[key]) {
          params.set(key, data[key]);
        }
      });
      params.set('uid', this.props.myUserId);
      params.set('topic', this.state.topic);
      url.search = params;
      window.open(url, '_blank');
    } else {
      console.info("Unknown action in form", action);
    }
  }
  handleContextClick(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.showContextMenu({
      topicName: this.state.topic,
      y: e.pageY,
      x: e.pageX
    });
  }
  handleShowMessageContextMenu(params, messageSpecificMenuItems) {
    if (params.userFrom == 'chan') {
      params.userFrom = this.state.topic;
      params.userName = this.state.title;
    }
    params.topicName = this.state.topic;
    const menuItems = messageSpecificMenuItems || [];
    const topic = this.props.tinode.getTopic(params.topicName);
    if (topic) {
      if (!topic.isChannelType()) {
        menuItems.push('message_delete');
      }
      const acs = topic.getAccessMode();
      if (acs && acs.isDeleter()) {
        menuItems.push('message_delete_hard');
      }
    }
    this.props.showContextMenu(params, menuItems);
  }
  handleNewChatAcceptance(action) {
    this.props.onNewChat(this.state.topic, action);
  }
  handleEnablePeer(e) {
    e.preventDefault();
    this.props.onChangePermissions(this.state.topic, _config_js__WEBPACK_IMPORTED_MODULE_17__.DEFAULT_P2P_ACCESS_MODE, this.state.topic);
  }
  sendKeyPress(audio) {
    const topic = this.props.tinode.getTopic(this.state.topic);
    if (topic.isSubscribed()) {
      if (audio) {
        topic.noteRecording(true);
      } else {
        topic.noteKeyPress();
      }
    }
  }
  sendMessage(msg, uploadCompletionPromise, uploader) {
    let head;
    if (this.props.forwardMessage) {
      msg = this.props.forwardMessage.msg;
      head = this.props.forwardMessage.head;
      this.handleCancelReply();
    } else if (this.state.reply) {
      if (this.state.reply.editing) {
        if (msg == this.state.contentToEdit) {
          this.handleCancelReply();
          return;
        }
        head = {
          replace: ':' + this.state.reply.seq
        };
      } else if (this.state.reply.content) {
        head = {
          reply: '' + this.state.reply.seq
        };
        if (typeof msg == 'string') {
          msg = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.parse(msg);
        }
        msg = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.append(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.sanitizeEntities(this.state.reply.content), msg);
      }
      this.handleCancelReply();
    }
    this.props.sendMessage(msg, uploadCompletionPromise, uploader, head);
  }
  retrySend(pub) {
    this.props.sendMessage(pub.content, undefined, undefined, pub.head).then(_ => {
      const topic = this.props.tinode.getTopic(this.state.topic);
      topic.delMessagesList([pub.seq], true);
    });
  }
  sendFileAttachment(file) {
    const maxInbandAttachmentSize = this.props.tinode.getServerParam('maxMessageSize', _config_js__WEBPACK_IMPORTED_MODULE_17__.MAX_INBAND_ATTACHMENT_SIZE) * 0.75 - 1024 | 0;
    if (file.size > maxInbandAttachmentSize) {
      const uploader = this.props.tinode.getLargeFileHelper();
      if (!uploader) {
        this.props.onError(this.props.intl.formatMessage(messages.cannot_initiate_upload));
        return;
      }
      const uploadCompletionPromise = uploader.upload(file);
      const msg = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.attachFile(null, {
        mime: file.type,
        filename: file.name,
        size: file.size,
        urlPromise: uploadCompletionPromise
      });
      this.sendMessage(msg, uploadCompletionPromise, uploader);
    } else {
      (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_19__.fileToBase64)(file).then(b64 => this.sendMessage(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.attachFile(null, {
        mime: b64.mime,
        data: b64.bits,
        filename: b64.name,
        size: file.size
      }))).catch(err => this.props.onError(err.message, 'err'));
    }
  }
  handleAttachFile(file) {
    const maxExternAttachmentSize = this.props.tinode.getServerParam('maxFileUploadSize', _config_js__WEBPACK_IMPORTED_MODULE_17__.MAX_EXTERN_ATTACHMENT_SIZE);
    if (file.size > maxExternAttachmentSize) {
      this.props.onError(this.props.intl.formatMessage(messages.file_attachment_too_large, {
        size: (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_21__.bytesToHumanSize)(file.size),
        limit: (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_21__.bytesToHumanSize)(maxExternAttachmentSize)
      }), 'err');
    } else {
      this.setState({
        docPreview: {
          file: file,
          name: file.name,
          size: file.size,
          type: file.type
        }
      });
    }
  }
  handleCallHangup(topic, seq) {
    this.props.onVideoCallClosed();
    this.setState({
      rtcPanel: null
    });
    this.props.onCallHangup(topic, seq);
  }
  sendImageAttachment(caption, blob) {
    const mime = this.state.imagePreview.mime;
    const width = this.state.imagePreview.width;
    const height = this.state.imagePreview.height;
    const fname = this.state.imagePreview.filename;
    const maxInbandAttachmentSize = this.props.tinode.getServerParam('maxMessageSize', _config_js__WEBPACK_IMPORTED_MODULE_17__.MAX_INBAND_ATTACHMENT_SIZE) * 0.75 - 1024 | 0;
    if (blob.size > maxInbandAttachmentSize) {
      const uploader = this.props.tinode.getLargeFileHelper();
      if (!uploader) {
        this.props.onError(this.props.intl.formatMessage(messages.cannot_initiate_upload));
        return;
      }
      const uploadCompletionPromise = uploader.upload(blob);
      (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_19__.imageScaled)(blob, _config_js__WEBPACK_IMPORTED_MODULE_17__.IMAGE_PREVIEW_DIM, _config_js__WEBPACK_IMPORTED_MODULE_17__.IMAGE_PREVIEW_DIM, -1, false).then(scaled => (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_19__.blobToBase64)(scaled.blob)).then(b64 => {
        let msg = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.insertImage(null, 0, {
          mime: mime,
          _tempPreview: b64.bits,
          bits: b64.bits,
          width: width,
          height: height,
          filename: fname,
          size: blob.size,
          urlPromise: uploadCompletionPromise
        });
        if (caption) {
          msg = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.appendLineBreak(msg);
          msg = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.append(msg, tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.parse(caption));
        }
        this.sendMessage(msg, uploadCompletionPromise, uploader);
      }).catch(err => this.props.onError(err, 'err'));
      return;
    }
    (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_19__.blobToBase64)(blob).then(b64 => {
      let msg = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.insertImage(null, 0, {
        mime: b64.mime,
        bits: b64.bits,
        width: width,
        height: height,
        filename: fname,
        size: blob.size
      });
      if (caption) {
        msg = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.appendLineBreak(msg);
        msg = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.append(msg, tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.parse(caption));
      }
      this.sendMessage(msg);
    });
  }
  sendVideoAttachment(caption, videoBlob, previewBlob, params) {
    const width = params.width;
    const height = params.height;
    const maxInbandAttachmentSize = this.props.tinode.getServerParam('maxMessageSize', _config_js__WEBPACK_IMPORTED_MODULE_17__.MAX_INBAND_ATTACHMENT_SIZE) * 0.75 - 1024 | 0;
    const uploads = [];
    let uploader;
    if (videoBlob.size + previewBlob.size > maxInbandAttachmentSize) {
      uploader = this.props.tinode.getLargeFileHelper();
      if (!uploader) {
        this.props.onError(this.props.intl.formatMessage(messages.cannot_initiate_upload));
        return;
      }
      uploads[0] = videoBlob.size > maxInbandAttachmentSize * 0.675 ? uploader.upload(videoBlob) : null;
      uploads[1] = previewBlob.size > maxInbandAttachmentSize * 0.275 ? uploader.upload(previewBlob) : null;
    }
    if (uploads.length == 0) {
      Promise.all([(0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_19__.blobToBase64)(videoBlob), (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_19__.blobToBase64)(previewBlob)]).then(b64s => {
        const [v64, i64] = b64s;
        let msg = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.insertVideo(null, 0, {
          mime: v64.mime,
          bits: v64.bits,
          preview: i64.bits,
          premime: i64.mime,
          width: width,
          height: height,
          duration: params.duration,
          filename: params.name,
          size: videoBlob.size
        });
        if (caption) {
          msg = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.appendLineBreak(msg);
          msg = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.append(msg, tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.parse(caption));
        }
        this.sendMessage(msg);
      });
      return;
    }
    const uploadCompletionPromise = Promise.all(uploads);
    const b64conv = [];
    b64conv[0] = uploads[0] ? null : (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_19__.blobToBase64)(videoBlob);
    b64conv[1] = uploads[1] ? null : (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_19__.imageScaled)(previewBlob, _config_js__WEBPACK_IMPORTED_MODULE_17__.MAX_IMAGE_DIM, _config_js__WEBPACK_IMPORTED_MODULE_17__.MAX_IMAGE_DIM, -1, false).then(scaled => (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_19__.blobToBase64)(scaled.blob));
    b64conv[2] = (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_19__.imageScaled)(previewBlob, _config_js__WEBPACK_IMPORTED_MODULE_17__.VIDEO_PREVIEW_DIM, _config_js__WEBPACK_IMPORTED_MODULE_17__.VIDEO_PREVIEW_DIM, -1, false).then(scaled => (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_19__.blobToBase64)(scaled.blob));
    Promise.all(b64conv).then(b64s => {
      const [video, img, preview] = b64s;
      let msg = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.insertVideo(null, 0, {
        mime: params.mime,
        bits: video ? video.bits : null,
        _tempPreview: preview.bits,
        preview: img ? img.bits : preview.bits,
        premime: img ? img.mime : preview.mime,
        width: width,
        height: height,
        duration: params.duration,
        filename: params.name,
        size: videoBlob.size,
        urlPromise: uploadCompletionPromise
      });
      if (caption) {
        msg = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.appendLineBreak(msg);
        msg = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.append(msg, tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.parse(caption));
      }
      this.sendMessage(msg, uploadCompletionPromise, uploader);
    }).catch(err => this.props.onError(err.message, 'err'));
  }
  handleAttachImageOrVideo(file) {
    const maxExternAttachmentSize = this.props.tinode.getServerParam('maxFileUploadSize', _config_js__WEBPACK_IMPORTED_MODULE_17__.MAX_EXTERN_ATTACHMENT_SIZE);
    if (file.type.startsWith('video/')) {
      this.setState({
        videoPreview: {
          url: URL.createObjectURL(file),
          blob: file,
          filename: file.name,
          size: file.size,
          mime: file.type
        }
      });
      return;
    }
    (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_19__.imageScaled)(file, _config_js__WEBPACK_IMPORTED_MODULE_17__.MAX_IMAGE_DIM, _config_js__WEBPACK_IMPORTED_MODULE_17__.MAX_IMAGE_DIM, maxExternAttachmentSize, false).then(scaled => {
      this.setState({
        imagePreview: {
          url: URL.createObjectURL(scaled.blob),
          blob: scaled.blob,
          filename: scaled.name,
          width: scaled.width,
          height: scaled.height,
          size: scaled.blob.size,
          mime: scaled.mime
        }
      });
    }).catch(err => {
      this.props.onError(err.message, 'err');
    });
  }
  handleFileDrop(files) {
    if (!files || files.length == 0) {
      return;
    }
    const file = files[0];
    if (file.type && file.type.startsWith('image/')) {
      this.handleAttachImageOrVideo(file);
    } else {
      this.handleAttachFile(file);
    }
  }
  sendAudioAttachment(url, preview, duration) {
    fetch(url).then(result => result.blob()).then(blob => {
      const maxInbandAttachmentSize = this.props.tinode.getServerParam('maxMessageSize', _config_js__WEBPACK_IMPORTED_MODULE_17__.MAX_INBAND_ATTACHMENT_SIZE) * 0.75 - 1024;
      if (blob.size > maxInbandAttachmentSize) {
        const uploader = this.props.tinode.getLargeFileHelper();
        if (!uploader) {
          this.props.onError(this.props.intl.formatMessage(messages.cannot_initiate_upload));
          return;
        }
        const uploadCompletionPromise = uploader.upload(blob);
        const msg = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.appendAudio(null, {
          mime: blob.type,
          size: blob.size,
          duration: duration,
          preview: preview,
          urlPromise: uploadCompletionPromise
        });
        this.sendMessage(msg, uploadCompletionPromise, uploader);
      } else {
        (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_19__.blobToBase64)(blob).then(b64 => {
          this.sendMessage(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.appendAudio(null, {
            mime: b64.mime,
            bits: b64.bits,
            size: blob.size,
            duration: duration,
            preview: preview
          }));
        });
      }
    }).catch(err => {
      this.props.onError(err.message, 'err');
    });
    ;
  }
  handleCancelUpload(seq, uploader) {
    const topic = this.props.tinode.getTopic(this.state.topic);
    const found = topic.findMessage(seq);
    if (found) {
      found._cancelled = true;
    }
    uploader.cancel();
  }
  handlePickReply(seq, content, senderId, senderName) {
    if (!seq || !content) {
      this.setState({
        reply: null
      });
      return;
    }
    content = typeof content == 'string' ? tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.init(content) : content;
    if (tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.isValid(content)) {
      content = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.replyContent(content, _config_js__WEBPACK_IMPORTED_MODULE_17__.QUOTED_REPLY_LENGTH);
    } else {
      content = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.append(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.init('\u26A0 '), tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.wrapInto(this.props.intl.formatMessage(messages.invalid_content), 'EM'));
    }
    this.setState({
      reply: {
        content: tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.quote(senderName, senderId, content),
        seq: seq
      }
    });
    this.props.onCancelForwardMessage();
  }
  handleEditMessage(seq, content) {
    if (!seq || !content) {
      this.setState({
        reply: null
      });
      return;
    }
    content = typeof content == 'string' ? tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.init(content) : content;
    const editable = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.toMarkdown(content);
    if (tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.isValid(content)) {
      content = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.replyContent(content, _config_js__WEBPACK_IMPORTED_MODULE_17__.EDIT_PREVIEW_LENGTH);
    } else {
      content = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.append(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.init('\u26A0 '), tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.wrapInto(this.props.intl.formatMessage(messages.invalid_content), 'EM'));
    }
    this.setState({
      reply: {
        content: tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.quote(this.props.intl.formatMessage(messages.editing_message), null, content),
        seq: seq,
        editing: true
      },
      contentToEdit: editable
    });
    this.props.onCancelForwardMessage();
  }
  handleCancelReply() {
    this.setState({
      reply: null,
      contentToEdit: null
    });
    this.props.onCancelForwardMessage();
  }
  handleQuoteClick(replyToSeq) {
    const ref = this.getOrCreateMessageRef(replyToSeq);
    if (ref && ref.current) {
      ref.current.scrollIntoView({
        block: "center",
        behavior: "smooth"
      });
      ref.current.classList.add('flash');
      setTimeout(_ => {
        ref.current.classList.remove('flash');
      }, 1000);
    } else {
      console.error("Unresolved message ref", replyToSeq);
    }
  }
  isDragEnabled() {
    return this.state.isWriter && !this.state.unconfirmed && !this.props.forwardMessage && !this.state.peerMessagingDisabled;
  }
  handleDragStart(e) {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.clearData();
  }
  handleDragIn(e) {
    e.preventDefault();
    e.stopPropagation();
    this.dragCounter++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      this.setState({
        dragging: true
      });
    }
  }
  handleDragOut(e) {
    e.preventDefault();
    e.stopPropagation();
    this.dragCounter--;
    if (this.dragCounter <= 0) {
      this.setState({
        dragging: false
      });
    }
  }
  handleDrag(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      dragging: false
    });
    if (this.isDragEnabled() && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      this.handleFileDrop(e.dataTransfer.files);
      this.dragCounter = 0;
    }
  }
  render() {
    const {
      formatMessage
    } = this.props.intl;
    let component;
    if (!this.state.topic) {
      component = react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_logo_view_jsx__WEBPACK_IMPORTED_MODULE_13__["default"], {
        serverVersion: this.props.serverVersion,
        serverAddress: this.props.serverAddress
      });
    } else {
      let component2;
      if (this.state.imagePreview) {
        component2 = react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_image_preview_jsx__WEBPACK_IMPORTED_MODULE_9__["default"], {
          content: this.state.imagePreview,
          tinode: this.props.tinode,
          reply: this.state.reply,
          onCancelReply: this.handleCancelReply,
          onClose: this.handleClosePreview,
          onSendMessage: this.sendImageAttachment
        });
      } else if (this.state.videoPreview) {
        component2 = react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_video_preview_jsx__WEBPACK_IMPORTED_MODULE_16__["default"], {
          content: this.state.videoPreview,
          tinode: this.props.tinode,
          reply: this.state.reply,
          onError: this.props.onError,
          onCancelReply: this.handleCancelReply,
          onClose: this.handleClosePreview,
          onSendMessage: this.sendVideoAttachment
        });
      } else if (this.state.imagePostview) {
        component2 = react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_image_preview_jsx__WEBPACK_IMPORTED_MODULE_9__["default"], {
          content: this.state.imagePostview,
          onClose: this.handleClosePreview
        });
      } else if (this.state.videoPostview) {
        component2 = react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_video_preview_jsx__WEBPACK_IMPORTED_MODULE_16__["default"], {
          content: this.state.videoPostview,
          tinode: this.props.tinode,
          onError: this.props.onError,
          onClose: this.handleClosePreview
        });
      } else if (this.state.docPreview) {
        component2 = react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_doc_preview_jsx__WEBPACK_IMPORTED_MODULE_6__["default"], {
          content: this.state.docPreview,
          tinode: this.props.tinode,
          reply: this.state.reply,
          onCancelReply: this.handleCancelReply,
          onClose: this.handleClosePreview,
          onSendMessage: this.sendFileAttachment
        });
      } else if (this.state.rtcPanel) {
        component2 = react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_call_panel_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
          topic: this.state.topic,
          seq: this.props.callSeq,
          callState: this.props.callState,
          callAudioOnly: this.props.callAudioOnly,
          tinode: this.props.tinode,
          title: this.state.title,
          avatar: this.state.avatar || true,
          onError: this.props.onError,
          onHangup: this.handleCallHangup,
          onInvite: this.props.onCallInvite,
          onSendOffer: this.props.onCallSendOffer,
          onIceCandidate: this.props.onCallIceCandidate,
          onSendAnswer: this.props.onCallSendAnswer
        });
      } else {
        const topic = this.props.tinode.getTopic(this.state.topic);
        const isChannel = topic.isChannelType();
        const groupTopic = topic.isGroupType() && !isChannel;
        const icon_badges = [];
        if (topic.trusted) {
          if (topic.trusted.verified) {
            icon_badges.push({
              icon: 'verified',
              color: 'badge-inv'
            });
          }
          if (topic.trusted.staff) {
            icon_badges.push({
              icon: 'staff',
              color: 'badge-inv'
            });
          }
          if (topic.trusted.danger) {
            icon_badges.push({
              icon: 'dangerous',
              color: 'badge-inv'
            });
          }
        }
        const messageNodes = [];
        let previousFrom = null;
        let prevDate = null;
        let chatBoxClass = null;
        topic.messages((msg, prev, next, i) => {
          let nextFrom = next ? next.from || 'chan' : null;
          let sequence = 'single';
          let thisFrom = msg.from || 'chan';
          if (thisFrom == previousFrom) {
            if (thisFrom == nextFrom) {
              sequence = 'middle';
            } else {
              sequence = 'last';
            }
          } else if (thisFrom == nextFrom) {
            sequence = 'first';
          }
          previousFrom = thisFrom;
          const isReply = !(thisFrom == this.props.myUserId);
          const deliveryStatus = topic.msgStatus(msg, true);
          let userFrom = thisFrom,
            userName,
            userAvatar;
          const user = topic.userDesc(thisFrom);
          if (user && user.public) {
            userName = user.public.fn;
            userAvatar = (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_19__.makeImageUrl)(user.public.photo);
          }
          chatBoxClass = groupTopic ? 'chat-box group' : 'chat-box';
          const ref = this.getOrCreateMessageRef(msg.seq);
          let replyToSeq = msg.head ? parseInt(msg.head.reply) : null;
          if (!replyToSeq || isNaN(replyToSeq)) {
            replyToSeq = null;
          }
          if (msg.hi) {
            messageNodes.push(react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_meta_message_jsx__WEBPACK_IMPORTED_MODULE_14__["default"], {
              deleted: true,
              key: msg.seq
            }));
          } else {
            const thisDate = new Date(msg.ts);
            if (!prevDate || prevDate.toDateString() != thisDate.toDateString()) {
              messageNodes.push(react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_meta_message_jsx__WEBPACK_IMPORTED_MODULE_14__["default"], {
                date: (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_21__.relativeDateFormat)(msg.ts),
                locale: this.props.intl.locale,
                key: 'date-' + msg.seq
              }));
              prevDate = thisDate;
            }
            messageNodes.push(react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_chat_message_jsx__WEBPACK_IMPORTED_MODULE_4__["default"], {
              tinode: this.props.tinode,
              content: msg.content,
              mimeType: msg.head && msg.head.mime,
              replyToSeq: replyToSeq,
              edited: msg.head && !msg.head.webrtc && msg.head.replace,
              timestamp: msg.ts,
              response: isReply,
              seq: msg.seq,
              isGroup: groupTopic,
              isChan: this.state.channel,
              userFrom: userFrom,
              userName: userName,
              userAvatar: userAvatar,
              sequence: sequence,
              received: deliveryStatus,
              uploader: msg._uploader,
              userIsWriter: this.state.isWriter,
              viewportWidth: this.props.viewportWidth,
              showContextMenu: this.handleShowMessageContextMenu,
              onExpandMedia: this.handleExpandMedia,
              onFormResponse: this.handleFormResponse,
              onCancelUpload: this.handleCancelUpload,
              pickReply: this.handlePickReply,
              editMessage: this.handleEditMessage,
              onQuoteClick: this.handleQuoteClick,
              onError: this.props.onError,
              ref: ref,
              key: msg.seq
            }));
          }
        });
        let lastSeen = null;
        if (isChannel) {
          lastSeen = formatMessage(messages.channel);
        } else {
          const cont = this.props.tinode.getMeTopic().getContact(this.state.topic);
          if (cont && tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.isP2PTopicName(cont.topic)) {
            if (cont.online) {
              lastSeen = formatMessage(messages.online_now);
            } else if (cont.seen) {
              lastSeen = formatMessage(messages.last_seen) + ": " + (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_21__.shortDateFormat)(cont.seen.when, this.props.intl.locale);
            }
          }
        }
        const avatar = this.state.avatar || true;
        const online = this.state.deleted ? null : this.props.online ? 'online' + (this.state.typingIndicator ? ' typing' : '') : 'offline';
        const titleClass = 'panel-title' + (this.state.deleted ? ' deleted' : '');
        let messagesComponent = react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
          id: "messages-container"
        }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
          className: 'action-button' + (this.state.showGoToLastButton ? '' : ' hidden'),
          onClick: this.goToLatestMessage
        }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
          className: "material-icons"
        }, "arrow_downward")), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
          id: "messages-panel",
          ref: this.handleScrollReference
        }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("ul", {
          id: "scroller",
          className: chatBoxClass
        }, messageNodes)), !this.state.isReader ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
          id: "write-only-background"
        }, this.state.readingBlocked ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
          id: "write-only-note"
        }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
          id: "messages_not_readable",
          defaultMessage: [{
            "type": 0,
            "value": "no access to messages"
          }]
        })) : null) : null), this.state.peerMessagingDisabled && !this.state.unconfirmed ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
          id: "peer-messaging-disabled-note"
        }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
          className: "material-icons secondary"
        }, "block"), " ", react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
          id: "peers_messaging_disabled",
          defaultMessage: [{
            "type": 0,
            "value": "Peer's messaging is disabled."
          }]
        }), " ", react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
          href: "#",
          onClick: this.handleEnablePeer
        }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
          id: "enable_peers_messaging",
          defaultMessage: [{
            "type": 0,
            "value": "Enable"
          }]
        })), ".") : null, this.state.unconfirmed ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_invitation_jsx__WEBPACK_IMPORTED_MODULE_10__["default"], {
          onAction: this.handleNewChatAcceptance
        }) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_send_message_jsx__WEBPACK_IMPORTED_MODULE_15__["default"], {
          tinode: this.props.tinode,
          topicName: this.state.topic,
          noInput: !!this.props.forwardMessage,
          disabled: !this.state.isWriter || this.state.deleted,
          reply: this.state.reply,
          initMessage: this.state.contentToEdit,
          onKeyPress: this.sendKeyPress,
          onRecordingProgress: this.sendKeyPress,
          onSendMessage: this.sendMessage,
          onAttachFile: this.props.forwardMessage ? null : this.handleAttachFile,
          onAttachImage: this.props.forwardMessage ? null : this.handleAttachImageOrVideo,
          onAttachAudio: this.props.forwardMessage ? null : this.sendAudioAttachment,
          onError: this.props.onError,
          onQuoteClick: this.handleQuoteClick,
          onCancelReply: this.handleCancelReply
        }));
        component2 = react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
          id: "topic-caption-panel",
          className: "caption-panel"
        }, this.props.displayMobile ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
          href: "#",
          id: "hide-message-view",
          onClick: e => {
            e.preventDefault();
            this.leave(this.state.topic);
            this.props.onHideMessagesView();
          }
        }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
          className: "material-icons"
        }, "arrow_back")) : null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
          className: "avatar-box"
        }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_letter_tile_jsx__WEBPACK_IMPORTED_MODULE_11__["default"], {
          tinode: this.props.tinode,
          avatar: avatar,
          topic: this.state.topic,
          title: this.state.title,
          deleted: this.state.deleted
        }), !isChannel ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
          className: online
        }) : null), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
          id: "topic-title-group"
        }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
          id: "topic-title",
          className: titleClass
        }, this.state.title || react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
          id: "unnamed_topic",
          defaultMessage: [{
            "type": 0,
            "value": "Unnamed"
          }]
        })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_contact_badges_jsx__WEBPACK_IMPORTED_MODULE_5__["default"], {
          badges: icon_badges
        })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
          id: "topic-last-seen"
        }, lastSeen)), groupTopic ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_group_subs_jsx__WEBPACK_IMPORTED_MODULE_8__["default"], {
          tinode: this.props.tinode,
          subscribers: this.state.onlineSubs
        }) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
          id: "topic-users"
        }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
          href: "#",
          onClick: this.handleContextClick
        }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
          className: "material-icons"
        }, "more_vert")))), this.props.displayMobile ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_error_panel_jsx__WEBPACK_IMPORTED_MODULE_7__["default"], {
          level: this.props.errorLevel,
          text: this.props.errorText,
          onClearError: this.props.onError
        }) : null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_load_spinner_jsx__WEBPACK_IMPORTED_MODULE_12__["default"], {
          show: this.state.fetchingMessages
        }), messagesComponent, this.state.dragging && this.isDragEnabled() ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
          className: "drag-n-drop"
        }, formatMessage(messages.drag_file)) : null);
      }
      component = react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        id: "topic-view",
        ref: this.mountDnDEvents
      }, component2);
    }
    return component;
  }
}
;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(MessagesView));

/***/ }),

/***/ "./src/views/new-topic-view.jsx":
/*!**************************************!*\
  !*** ./src/views/new-topic-view.jsx ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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









const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  search_for_contacts: {
    id: "search_for_contacts",
    defaultMessage: [{
      "type": 0,
      "value": "Use search to find contacts"
    }]
  },
  search_no_results: {
    id: "search_no_results",
    defaultMessage: [{
      "type": 0,
      "value": "Search returned no results"
    }]
  },
  search_placeholder: {
    id: "search_placeholder",
    defaultMessage: [{
      "type": 0,
      "value": "List like alice@example.com, +17025550003..."
    }]
  }
});
class NewTopicView extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    this.state = {
      tabSelected: 'find',
      searchQuery: null
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
    this.props.onSearchContacts(query);
    this.setState({
      searchQuery: tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.isNullValue(query) ? null : query
    });
  }
  handleSearchResultSelected(topicName) {
    if (this.state.tabSelected == 'find') {
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_7__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_7__["default"].removeUrlParam(window.location.hash, 'tab'));
      this.props.onCreateTopic(topicName);
    }
  }
  handleNewGroupSubmit(name, description, dataUrl, priv, tags, isChannel) {
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_7__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_7__["default"].removeUrlParam(window.location.hash, 'tab'));
    this.props.onCreateTopic(undefined, {
      public: (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_8__.theCard)(name, dataUrl, null, description),
      private: priv,
      tags: tags
    }, isChannel);
  }
  handleGroupByID(topicName) {
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_7__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_7__["default"].removeUrlParam(window.location.hash, 'tab'));
    this.props.onCreateTopic(topicName);
  }
  render() {
    const {
      formatMessage
    } = this.props.intl;
    const no_contacts_placeholder = formatMessage(this.state.searchQuery ? messages.search_no_results : messages.search_for_contacts);
    const search_placeholder = formatMessage(messages.search_placeholder);
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "flex-column"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("ul", {
      className: "tabbar"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", {
      className: this.state.tabSelected === "find" ? "active" : null
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      "data-id": "find",
      onClick: this.handleTabClick
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "tabtitle_find_user",
      defaultMessage: [{
        "type": 0,
        "value": "find"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", {
      className: this.state.tabSelected === "grp" ? "active" : null
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      "data-id": "grp",
      onClick: this.handleTabClick
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "tabtitle_new_group",
      defaultMessage: [{
        "type": 0,
        "value": "new group"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", {
      className: this.state.tabSelected === "byid" ? "active" : null
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      "data-id": "byid",
      onClick: this.handleTabClick
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "tabtitle_group_by_id",
      defaultMessage: [{
        "type": 0,
        "value": "by id"
      }]
    })))), this.state.tabSelected === 'grp' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_new_topic_group_jsx__WEBPACK_IMPORTED_MODULE_5__["default"], {
      tinode: this.props.tinode,
      onSubmit: this.handleNewGroupSubmit,
      onError: this.props.onError
    }) : this.state.tabSelected === 'byid' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_new_topic_by_id_jsx__WEBPACK_IMPORTED_MODULE_4__["default"], {
      myURI: tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.URI_TOPIC_ID_PREFIX + this.props.tinode.getCurrentUserID(),
      onSubmit: this.handleGroupByID,
      onError: this.props.onError
    }) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "flex-column"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_search_contacts_jsx__WEBPACK_IMPORTED_MODULE_6__["default"], {
      placeholder: search_placeholder,
      onSearchContacts: this.handleSearchContacts
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_contact_list_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
      tinode: this.props.tinode,
      contacts: this.props.searchResults,
      myUserId: this.props.myUserId,
      emptyListMessage: no_contacts_placeholder,
      showOnline: false,
      showUnread: false,
      showContextMenu: false,
      onTopicSelected: this.handleSearchResultSelected
    })));
  }
}
;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(NewTopicView));

/***/ }),

/***/ "./src/views/settings-view.jsx":
/*!*************************************!*\
  !*** ./src/views/settings-view.jsx ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SettingsView)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../widgets/checkbox.jsx */ "./src/widgets/checkbox.jsx");
/* harmony import */ var _widgets_host_selector_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../widgets/host-selector.jsx */ "./src/widgets/host-selector.jsx");




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
    ['def', 'ws', 'lp'].map(item => {
      const id = 'transport-' + item;
      const name = names[item];
      transportOptions.push(react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", {
        key: item
      }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
        type: "radio",
        id: id,
        name: "transport-select",
        value: item,
        checked: this.state.transport === item,
        onChange: this.handleTransportSelected
      }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
        htmlFor: id
      }, name)));
    });
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("form", {
      id: "settings-form",
      className: "panel-form",
      onSubmit: this.handleSubmit
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_server_to_use",
      defaultMessage: [{
        "type": 0,
        "value": "Server to use:"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_host_selector_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
      serverAddress: this.state.serverAddress,
      onServerAddressChange: this.handleServerAddressChange
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
      id: "secure-connection",
      name: "secure-connection",
      checked: this.state.secureConnection,
      className: "quoted",
      onChange: this.handleToggleSecure
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      htmlFor: "secure-connection"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_use_secure_connection",
      defaultMessage: [{
        "type": 0,
        "value": "Use secure connection"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_wire_transport",
      defaultMessage: [{
        "type": 0,
        "value": "Wire transport:"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("ul", {
      className: "quoted"
    }, transportOptions)), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "dialog-buttons"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      type: "submit",
      className: "primary"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "button_update",
      defaultMessage: [{
        "type": 0,
        "value": "Update"
      }]
    }))));
  }
}
;

/***/ }),

/***/ "./src/views/sidepanel-view.jsx":
/*!**************************************!*\
  !*** ./src/views/sidepanel-view.jsx ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _widgets_error_panel_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../widgets/error-panel.jsx */ "./src/widgets/error-panel.jsx");
/* harmony import */ var _widgets_load_spinner_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../widgets/load-spinner.jsx */ "./src/widgets/load-spinner.jsx");
/* harmony import */ var _widgets_side_navbar_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../widgets/side-navbar.jsx */ "./src/widgets/side-navbar.jsx");
/* harmony import */ var _topic_common_view_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./topic-common-view.jsx */ "./src/views/topic-common-view.jsx");
/* harmony import */ var _contacts_view_jsx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./contacts-view.jsx */ "./src/views/contacts-view.jsx");
/* harmony import */ var _acc_notifications_view_jsx__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./acc-notifications-view.jsx */ "./src/views/acc-notifications-view.jsx");
/* harmony import */ var _acc_security_view_jsx__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./acc-security-view.jsx */ "./src/views/acc-security-view.jsx");
/* harmony import */ var _acc_support_view_jsx__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./acc-support-view.jsx */ "./src/views/acc-support-view.jsx");
/* harmony import */ var _login_view_jsx__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./login-view.jsx */ "./src/views/login-view.jsx");
/* harmony import */ var _new_topic_view_jsx__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./new-topic-view.jsx */ "./src/views/new-topic-view.jsx");
/* harmony import */ var _settings_view_jsx__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./settings-view.jsx */ "./src/views/settings-view.jsx");
/* harmony import */ var _validation_view_jsx__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./validation-view.jsx */ "./src/views/validation-view.jsx");






const AccountSettingsView = react__WEBPACK_IMPORTED_MODULE_0___default().lazy(_ => Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_libphonenumber-js_examples_mobile_json_js-node_modules_libphonenumber-js-7e28c7"), __webpack_require__.e("src_views_account-settings-view_jsx")]).then(__webpack_require__.bind(__webpack_require__, /*! ./account-settings-view.jsx */ "./src/views/account-settings-view.jsx")));

const CreateAccountView = react__WEBPACK_IMPORTED_MODULE_0___default().lazy(_ => Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_libphonenumber-js_examples_mobile_json_js-node_modules_libphonenumber-js-7e28c7"), __webpack_require__.e("src_views_create-account-view_jsx")]).then(__webpack_require__.bind(__webpack_require__, /*! ./create-account-view.jsx */ "./src/views/create-account-view.jsx")));





const PasswordResetView = react__WEBPACK_IMPORTED_MODULE_0___default().lazy(_ => Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_libphonenumber-js_examples_mobile_json_js-node_modules_libphonenumber-js-7e28c7"), __webpack_require__.e("src_views_password-reset-view_jsx")]).then(__webpack_require__.bind(__webpack_require__, /*! ./password-reset-view.jsx */ "./src/views/password-reset-view.jsx")));


const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  login: {
    id: "sidepanel_title_login",
    defaultMessage: [{
      "type": 0,
      "value": "Sign In"
    }]
  },
  register: {
    id: "sidepanel_title_register",
    defaultMessage: [{
      "type": 0,
      "value": "Create Account"
    }]
  },
  settings: {
    id: "sidepanel_title_settings",
    defaultMessage: [{
      "type": 0,
      "value": "Settings"
    }]
  },
  edit: {
    id: "sidepanel_title_account_settings",
    defaultMessage: [{
      "type": 0,
      "value": "Account Settings"
    }]
  },
  general: {
    id: "panel_title_general",
    defaultMessage: [{
      "type": 0,
      "value": "General"
    }]
  },
  security: {
    id: "panel_title_security",
    defaultMessage: [{
      "type": 0,
      "value": "Security"
    }]
  },
  crop: {
    id: "panel_title_crop",
    defaultMessage: [{
      "type": 0,
      "value": "Drag to Adjust"
    }]
  },
  notif: {
    id: "sidepanel_title_acc_notifications",
    defaultMessage: [{
      "type": 0,
      "value": "Notifications"
    }]
  },
  support: {
    id: "sidepanel_title_acc_support",
    defaultMessage: [{
      "type": 0,
      "value": "Support"
    }]
  },
  newtpk: {
    id: "sidepanel_title_newtpk",
    defaultMessage: [{
      "type": 0,
      "value": "Start New Chat"
    }]
  },
  cred: {
    id: "sidepanel_title_cred",
    defaultMessage: [{
      "type": 0,
      "value": "Confirm Credentials"
    }]
  },
  reset: {
    id: "sidepanel_title_reset",
    defaultMessage: [{
      "type": 0,
      "value": "Reset Password"
    }]
  },
  archive: {
    id: "sidepanel_title_archive",
    defaultMessage: [{
      "type": 0,
      "value": "Archived Chats"
    }]
  },
  blocked: {
    id: "sidepanel_title_blocked",
    defaultMessage: [{
      "type": 0,
      "value": "Blocked Chats"
    }]
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
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "sidepanel"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_side_navbar_jsx__WEBPACK_IMPORTED_MODULE_4__["default"], {
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
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_error_panel_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
      level: this.props.errorLevel,
      text: this.props.errorText,
      action: this.props.errorAction,
      actionText: this.props.errorActionText,
      onClearError: this.props.onError
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_load_spinner_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
      show: this.props.loadSpinnerVisible
    }), view === 'login' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_login_view_jsx__WEBPACK_IMPORTED_MODULE_10__["default"], {
      login: this.props.login,
      disabled: this.props.loginDisabled,
      persist: this.props.persist,
      onLogin: this.props.onLoginRequest,
      onPersistenceChange: this.props.onPersistenceChange
    }) : view === 'register' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react__WEBPACK_IMPORTED_MODULE_0__.Suspense, {
      fallback: react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
        id: "loading_note",
        defaultMessage: [{
          "type": 0,
          "value": "Loading..."
        }]
      }))
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(CreateAccountView, {
      tinode: this.props.tinode,
      reqCredMethod: this.props.reqCredMethod,
      onShowCountrySelector: this.props.onShowCountrySelector,
      onCreateAccount: this.props.onCreateAccount,
      onCancel: this.props.onCancel,
      onError: this.props.onError
    })) : view === 'settings' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_settings_view_jsx__WEBPACK_IMPORTED_MODULE_12__["default"], {
      transport: this.props.transport,
      serverAddress: this.props.serverAddress,
      secureConnection: this.props.secureConnection,
      onCancel: this.props.onCancel,
      onUpdate: this.props.onGlobalSettings
    }) : view === 'edit' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react__WEBPACK_IMPORTED_MODULE_0__.Suspense, {
      fallback: react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
        id: "loading_note",
        defaultMessage: [{
          "type": 0,
          "value": "Loading..."
        }]
      }))
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(AccountSettingsView, {
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
    })) : view === 'general' || view === 'crop' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_topic_common_view_jsx__WEBPACK_IMPORTED_MODULE_5__["default"], {
      topic: "me",
      tinode: this.props.tinode,
      myUserId: this.props.myUserId,
      reqCredMethod: this.props.reqCredMethod,
      onUpdateTopicDesc: this.props.onUpdateAccountDesc,
      onUpdateTagsRequest: this.props.onUpdateAccountTags,
      onError: this.props.onError
    }) : view === 'notif' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_acc_notifications_view_jsx__WEBPACK_IMPORTED_MODULE_7__["default"], {
      messageSounds: this.props.messageSounds,
      desktopAlerts: this.props.desktopAlerts,
      desktopAlertsEnabled: this.props.desktopAlertsEnabled,
      incognitoMode: this.props.incognitoMode,
      onTogglePushNotifications: this.props.onTogglePushNotifications,
      onToggleMessageSounds: this.props.onToggleMessageSounds,
      onToggleIncognitoMode: this.props.onToggleIncognitoMode
    }) : view === 'security' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_acc_security_view_jsx__WEBPACK_IMPORTED_MODULE_8__["default"], {
      tinode: this.props.tinode,
      onUpdateAccountDesc: this.props.onUpdateAccountDesc,
      onUpdatePassword: this.props.onUpdatePassword,
      onLogout: this.props.onLogout,
      onDeleteAccount: this.props.onDeleteAccount,
      onShowAlert: this.props.onShowAlert,
      onShowBlocked: this.props.onShowBlocked
    }) : view === 'support' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_acc_support_view_jsx__WEBPACK_IMPORTED_MODULE_9__["default"], {
      serverAddress: this.props.serverAddress,
      serverVersion: this.props.serverVersion
    }) : view === 'contacts' || view == 'archive' || view == 'blocked' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_contacts_view_jsx__WEBPACK_IMPORTED_MODULE_6__["default"], {
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
    }) : view === 'newtpk' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_new_topic_view_jsx__WEBPACK_IMPORTED_MODULE_11__["default"], {
      tinode: this.props.tinode,
      searchResults: this.props.searchResults,
      onInitFind: this.props.onInitFind,
      onSearchContacts: this.props.onSearchContacts,
      onCreateTopic: this.props.onCreateTopic,
      onError: this.props.onError
    }) : view === 'cred' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_validation_view_jsx__WEBPACK_IMPORTED_MODULE_13__["default"], {
      credCode: this.props.credCode,
      credMethod: this.props.credMethod,
      credToken: this.props.credToken,
      onSubmit: this.props.onValidateCredentials,
      onCancel: this.props.onCancel
    }) : view === 'reset' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react__WEBPACK_IMPORTED_MODULE_0__.Suspense, {
      fallback: react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
        id: "loading_note",
        defaultMessage: [{
          "type": 0,
          "value": "Loading..."
        }]
      }))
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(PasswordResetView, {
      tinode: this.props.tinode,
      reqCredMethod: this.props.reqCredMethod,
      onShowCountrySelector: this.props.onShowCountrySelector,
      onRequest: this.props.onPasswordResetRequest,
      onReset: this.props.onResetPassword,
      onCancel: this.props.onCancel,
      onError: this.props.onError
    })) : null);
  }
}
;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(SidepanelView));

/***/ }),

/***/ "./src/views/tinode-web.jsx":
/*!**********************************!*\
  !*** ./src/views/tinode-web.jsx ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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
/* harmony import */ var _info_view_jsx__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./info-view.jsx */ "./src/views/info-view.jsx");
/* harmony import */ var _messages_view_jsx__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./messages-view.jsx */ "./src/views/messages-view.jsx");
/* harmony import */ var _sidepanel_view_jsx__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./sidepanel-view.jsx */ "./src/views/sidepanel-view.jsx");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../constants.js */ "./src/constants.js");
/* harmony import */ var _version_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../version.js */ "./src/version.js");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
/* harmony import */ var _lib_host_name_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../lib/host-name.js */ "./src/lib/host-name.js");
/* harmony import */ var _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../lib/local-storage.js */ "./src/lib/local-storage.js");
/* harmony import */ var _lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../lib/navigation.js */ "./src/lib/navigation.js");
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");









const PhoneCountrySelector = react__WEBPACK_IMPORTED_MODULE_0___default().lazy(_ => __webpack_require__.e(/*! import() */ "src_widgets_phone-country-selector_jsx").then(__webpack_require__.bind(__webpack_require__, /*! ../widgets/phone-country-selector.jsx */ "./src/widgets/phone-country-selector.jsx")));












const POP_SOUND = new Audio('audio/msg.m4a');
const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  reconnect_countdown: {
    id: "reconnect_countdown",
    defaultMessage: [{
      "type": 0,
      "value": "Disconnected. Reconnecting in "
    }, {
      "type": 1,
      "value": "seconds"
    }, {
      "type": 0,
      "value": "…"
    }]
  },
  reconnect_now: {
    id: "reconnect_now",
    defaultMessage: [{
      "type": 0,
      "value": "Try now"
    }]
  },
  push_init_failed: {
    id: "push_init_failed",
    defaultMessage: [{
      "type": 0,
      "value": "Failed to initialize push notifications"
    }]
  },
  invalid_security_token: {
    id: "invalid_security_token",
    defaultMessage: [{
      "type": 0,
      "value": "Invalid security token"
    }]
  },
  no_connection: {
    id: "no_connection",
    defaultMessage: [{
      "type": 0,
      "value": "No connection"
    }]
  },
  code_doesnot_match: {
    id: "code_doesnot_match",
    defaultMessage: [{
      "type": 0,
      "value": "Code does not match"
    }]
  },
  menu_item_info: {
    id: "menu_item_info",
    defaultMessage: [{
      "type": 0,
      "value": "Info"
    }]
  },
  menu_item_audio_call: {
    id: "menu_item_audio_call",
    defaultMessage: [{
      "type": 0,
      "value": "Call"
    }]
  },
  menu_item_video_call: {
    id: "menu_item_video_call",
    defaultMessage: [{
      "type": 0,
      "value": "Video call"
    }]
  },
  cred_confirmed_successfully: {
    id: "cred_confirmed_successfully",
    defaultMessage: [{
      "type": 0,
      "value": "Confirmed successfully"
    }]
  },
  password_reset_success: {
    id: "password_reset_success",
    defaultMessage: [{
      "type": 0,
      "value": "Password reset successfully"
    }]
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
    const settings = _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_17__["default"].getObject('settings') || {};
    const persist = !!_lib_local_storage_js__WEBPACK_IMPORTED_MODULE_17__["default"].getObject('keep-logged-in');
    return {
      connected: false,
      ready: false,
      autoLogin: false,
      transport: settings.transport || null,
      serverAddress: settings.serverAddress || (0,_lib_host_name_js__WEBPACK_IMPORTED_MODULE_16__.detectServerAddress)(),
      secureConnection: settings.secureConnection === undefined ? (0,_lib_host_name_js__WEBPACK_IMPORTED_MODULE_16__.isSecureConnection)() : settings.secureConnection,
      serverVersion: "no connection",
      messageSounds: !settings.messageSoundsOff,
      incognitoMode: false,
      desktopAlerts: persist && !!settings.desktopAlerts,
      desktopAlertsEnabled: ((0,_lib_host_name_js__WEBPACK_IMPORTED_MODULE_16__.isSecureConnection)() || (0,_lib_host_name_js__WEBPACK_IMPORTED_MODULE_16__.isLocalHost)()) && typeof firebase_app__WEBPACK_IMPORTED_MODULE_2__.initializeApp != 'undefined' && typeof navigator != 'undefined' && typeof FIREBASE_INIT != 'undefined',
      firebaseToken: persist ? _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_17__["default"].getObject('firebase-token') : null,
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
      displayMobile: window.innerWidth <= _config_js__WEBPACK_IMPORTED_MODULE_12__.MEDIA_BREAKPOINT,
      infoPanel: undefined,
      mobilePanel: 'sidepanel',
      callTopic: undefined,
      callState: _constants_js__WEBPACK_IMPORTED_MODULE_13__.CALL_STATE_NONE,
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
    if (typeof BroadcastChannel == 'function') {
      const serviceWorkerChannel = new BroadcastChannel('tinode-sw');
      serviceWorkerChannel.addEventListener('message', this.handlePushMessage);
    } else {
      console.warn("Your browser does not support BroadcastChannel. Some features will not be available");
    }
    document.addEventListener('visibilitychange', this.handleVisibilityEvent);
    this.setState({
      viewportWidth: document.documentElement.clientWidth,
      viewportHeight: document.documentElement.clientHeight
    });
    new Promise((resolve, reject) => {
      this.tinode = TinodeWeb.tnSetup(this.state.serverAddress, (0,_lib_host_name_js__WEBPACK_IMPORTED_MODULE_16__.isSecureConnection)(), this.state.transport, this.props.intl.locale, this.state.persist, resolve);
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
      const token = this.state.persist ? _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_17__["default"].getObject('auth-token') : undefined;
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
      this.readTimer = null;
      this.readTimerCallback = null;
      const parsedNav = _lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].parseUrlHash(window.location.hash);
      if (!['cred', 'reset', 'register'].includes(parsedNav.path[0])) {
        this.setState({
          requestedTopic: parsedNav.path[1]
        });
        const path = parsedNav.params && parsedNav.params.cred_done ? _lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].addUrlParam('', 'cred_done', parsedNav.params.cred_done) : '';
        _lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].navigateTo(path);
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
    document.removeEventListener('visibilitychange', this.handleVisibilityEvent);
  }
  static tnSetup(serverAddress, secureConnection, transport, locale, persistentCache, onSetupCompleted) {
    const tinode = new tinode_sdk__WEBPACK_IMPORTED_MODULE_4__.Tinode({
      appName: _config_js__WEBPACK_IMPORTED_MODULE_12__.APP_NAME,
      host: serverAddress,
      apiKey: _config_js__WEBPACK_IMPORTED_MODULE_12__.API_KEY,
      transport: transport,
      secure: secureConnection,
      persist: persistentCache
    }, onSetupCompleted);
    tinode.setHumanLanguage(locale);
    tinode.enableLogging(_config_js__WEBPACK_IMPORTED_MODULE_12__.LOGGING_ENABLED, true);
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
      _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_17__["default"].updateObject('settings', {
        desktopAlerts: false
      });
    };
    try {
      this.fcm = (0,firebase_messaging__WEBPACK_IMPORTED_MODULE_3__.getMessaging)((0,firebase_app__WEBPACK_IMPORTED_MODULE_2__.initializeApp)(FIREBASE_INIT, _config_js__WEBPACK_IMPORTED_MODULE_12__.APP_NAME));
      return navigator.serviceWorker.getRegistration('/service-worker.js').then(reg => {
        return reg || navigator.serviceWorker.register('/service-worker.js').then(reg => {
          this.checkForAppUpdate(reg);
          return reg;
        });
      }).then(reg => {
        (reg.active || reg.installing).postMessage(JSON.stringify({
          locale: locale,
          version: _version_js__WEBPACK_IMPORTED_MODULE_14__.PACKAGE_VERSION
        }));
        return TinodeWeb.requestFCMToken(this.fcm, reg);
      }).then(token => {
        const persist = _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_17__["default"].getObject('keep-logged-in');
        if (token != this.state.firebaseToken) {
          this.tinode.setDeviceToken(token);
          if (persist) {
            _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_17__["default"].setObject('firebase-token', token);
          }
        }
        this.setState({
          firebaseToken: token,
          desktopAlerts: true
        });
        if (persist) {
          _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_17__["default"].updateObject('settings', {
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
              serviceWorkerRegistration: reg,
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
    const mobile = document.documentElement.clientWidth <= _config_js__WEBPACK_IMPORTED_MODULE_12__.MEDIA_BREAKPOINT;
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
  checkForAppUpdate(reg) {
    reg.onupdatefound = _ => {
      const installingWorker = reg.installing;
      installingWorker.onstatechange = _ => {
        if (installingWorker.state == 'installed' && navigator.serviceWorker.controller) {
          const msg = react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "update_available",
            defaultMessage: [{
              "type": 0,
              "value": "Update available."
            }]
          }), " ", react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
            href: ""
          }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "reload_update",
            defaultMessage: [{
              "type": 0,
              "value": "Reload"
            }]
          })), ".");
          this.handleError(msg, 'info');
        }
      };
    };
  }
  handleHashRoute() {
    const hash = _lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].parseUrlHash(window.location.hash);
    const newState = {
      infoPanel: hash.params.info,
      newTopicTabSelected: hash.params.tab
    };
    if (hash.path && hash.path.length > 0) {
      if (['register', 'settings', 'edit', 'notif', 'security', 'support', 'general', 'crop', 'cred', 'reset', 'newtpk', 'archive', 'blocked', 'contacts', ''].includes(hash.path[0])) {
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
        _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_17__["default"].setObject('keep-logged-in', true);
        this.setState({
          persist: true
        });
      });
    } else {
      this.tinode.clearStorage().then(_ => {
        _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_17__["default"].setObject('keep-logged-in', false);
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
      const fmtTime = count > 99 ? (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_19__.secondsToTime)(count) : count;
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
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].navigateTo('');
      return;
    }
    let token = tmpToken || (this.tinode.getAuthToken() || {}).token;
    if (!(login && password) && !token) {
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].navigateTo('');
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
        _lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].navigateTo('');
      }
    });
  }
  static navigateToCredentialsView(params) {
    const parsed = _lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].parseUrlHash(window.location.hash);
    parsed.path[0] = 'cred';
    parsed.params['method'] = params.cred[0];
    parsed.params['token'] = params.token;
    parsed.params['code'] = params.code;
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].composeUrlHash(parsed.path, parsed.params));
  }
  handleLoginSuccessful() {
    this.handleError();
    if (_lib_local_storage_js__WEBPACK_IMPORTED_MODULE_17__["default"].getObject('keep-logged-in')) {
      _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_17__["default"].setObject('auth-token', this.tinode.getAuthToken());
    }
    const goToTopic = this.state.requestedTopic;
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
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].navigateTo('');
    }).finally(_ => {
      this.setState({
        loadSpinnerVisible: false
      });
    });
    let urlHash = _lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].setUrlSidePanel(window.location.hash, 'contacts');
    if (goToTopic) {
      urlHash = _lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].setUrlTopic(urlHash, goToTopic);
    }
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].navigateTo(urlHash);
  }
  tnMeMetaDesc(desc) {
    if (desc) {
      if (desc.public) {
        this.setState({
          sidePanelTitle: desc.public.fn,
          sidePanelAvatar: (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_15__.makeImageUrl)(desc.public.photo)
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
    this.tinode.getMeTopic().contacts(c => {
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
      return (a.touched || past).getTime() - (b.touched || past).getTime();
    });
    newState.searchableContacts = TinodeWeb.prepareSearchableContacts(newState.chatList, this.state.searchResults);
    this.setState(newState);
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
        _lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].setUrlTopic('', topicName));
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
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].setUrlTopic('', null));
    }
  }
  handleHideMessagesView() {
    this.setState({
      mobilePanel: 'sidepanel'
    });
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].setUrlTopic(window.location.hash, null));
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
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].setUrlSidePanel(window.location.hash, 'register'));
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
  handleUpdateAccountTagsRequest(_, tags) {
    this.tinode.getMeTopic().setMeta({
      tags: tags
    }).catch(err => this.handleError(err.message, 'err'));
  }
  handleSettings() {
    this.handleError();
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].setUrlSidePanel(window.location.hash, this.state.myUserId ? 'edit' : 'settings'));
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
    this.tinode = TinodeWeb.tnSetup(serverAddress, secureConnection, transport, this.props.intl.locale, _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_17__["default"].getObject('keep-logged-in'));
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
    _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_17__["default"].setObject('settings', {
      serverAddress: serverAddress,
      transport: transport,
      secureConnection: secureConnection
    });
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].setUrlSidePanel(window.location.hash, ''));
  }
  handleShowArchive() {
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].setUrlSidePanel(window.location.hash, this.state.myUserId ? 'archive' : ''));
  }
  handleShowBlocked() {
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].setUrlSidePanel(window.location.hash, this.state.myUserId ? 'blocked' : ''));
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
        if (_lib_local_storage_js__WEBPACK_IMPORTED_MODULE_17__["default"].getObject('keep-logged-in')) {
          _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_17__["default"].updateObject('settings', {
            desktopAlerts: true
          });
        }
      }
    } else if (this.state.firebaseToken && this.fcm) {
      (0,firebase_messaging__WEBPACK_IMPORTED_MODULE_3__.deleteToken)(this.fcm).catch(err => {
        console.error("Unable to delete token.", err);
      }).finally(_ => {
        _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_17__["default"].updateObject('settings', {
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
      _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_17__["default"].updateObject('settings', {
        desktopAlerts: false
      });
    }
  }
  handleToggleMessageSounds(enabled) {
    this.setState({
      messageSounds: enabled
    });
    _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_17__["default"].updateObject('settings', {
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
    const parsed = _lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].parseUrlHash(window.location.hash);
    let path = '';
    if (['security', 'support', 'general', 'notif'].includes(parsed.path[0])) {
      path = 'edit';
    } else if ('crop' == parsed.path[0]) {
      path = 'general';
    } else if ('blocked' == parsed.path[0]) {
      path = 'security';
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
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].composeUrlHash(parsed.path, parsed.params));
    this.setState({
      errorText: '',
      errorLevel: null
    });
  }
  basicNavigator(hash) {
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].setUrlSidePanel(window.location.hash, hash));
  }
  infoNavigator(hash) {
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].setUrlInfoPanel(window.location.hash, hash));
  }
  handleStartTopicRequest(topicName, newTopicParams, isChannel) {
    if (topicName && this.tinode.isTopicCached(topicName)) {
      this.handleTopicSelected(topicName);
      return;
    }
    const params = {};
    if (tinode_sdk__WEBPACK_IMPORTED_MODULE_4__.Tinode.isP2PTopicName(topicName)) {
      params.sub = {
        mode: _config_js__WEBPACK_IMPORTED_MODULE_12__.DEFAULT_P2P_ACCESS_MODE
      };
      params.desc = {
        defacs: {
          auth: _config_js__WEBPACK_IMPORTED_MODULE_12__.DEFAULT_P2P_ACCESS_MODE
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
        callState: _constants_js__WEBPACK_IMPORTED_MODULE_13__.CALL_STATE_IN_PROGRESS,
        callShouldStart: false
      };
    }
    if (this.state.topicSelected == oldName && oldName != newName) {
      nextState.topicSelected = newName;
    }
    this.setState(nextState, _ => {
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].setUrlTopic('', newName));
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
    (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_20__.updateFavicon)(0);
    localStorage.removeItem('auth-token');
    localStorage.removeItem('firebase-token');
    localStorage.removeItem('settings');
    if (this.state.firebaseToken) {
      (0,firebase_messaging__WEBPACK_IMPORTED_MODULE_3__.deleteToken)(this.fcm);
    }
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
      this.tinode = TinodeWeb.tnSetup(this.state.serverAddress, (0,_lib_host_name_js__WEBPACK_IMPORTED_MODULE_16__.isSecureConnection)(), this.state.transport, this.props.intl.locale, _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_17__["default"].getObject('keep-logged-in'), _ => {
        this.tinode.onConnect = this.handleConnected;
        this.tinode.onDisconnect = this.handleDisconnect;
        this.tinode.onAutoreconnectIteration = this.handleAutoreconnectIteration;
        this.tinode.onInfoMessage = this.handleInfoMessage;
        this.tinode.onDataMessage = this.handleDataMessage;
        _lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].navigateTo('');
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
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].setUrlTopic(window.location.hash, ''));
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
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].setUrlTopic(window.location.hash, ''));
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
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].setUrlTopic(window.location.hash, ''));
    }).catch(err => this.handleError(err.message, 'err'));
  }
  handleReportTopic(topicName) {
    const topic = this.tinode.getTopic(topicName);
    if (!topic) {
      return;
    }
    this.tinode.report('report', topicName);
    topic.updateMode(null, '-JP').then(_ => {
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].setUrlTopic(window.location.hash, ''));
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
    const header = '➦ ' + params.userName;
    const content = typeof params.content == 'string' ? tinode_sdk__WEBPACK_IMPORTED_MODULE_4__.Drafty.init(params.content) : tinode_sdk__WEBPACK_IMPORTED_MODULE_4__.Drafty.forwardedContent(params.content);
    const preview = tinode_sdk__WEBPACK_IMPORTED_MODULE_4__.Drafty.preview(content, _config_js__WEBPACK_IMPORTED_MODULE_12__.FORWARDED_PREVIEW_LENGTH, true);
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
  defaultTopicContextMenu(topicName) {
    const topic = this.tinode.getTopic(topicName);
    if (topic._deleted) {
      return ['topic_delete'];
    }
    let muted = false,
      blocked = false,
      self_blocked = false,
      subscribed = false,
      deleter = false,
      archived = false,
      webrtc = false;
    if (topic) {
      subscribed = topic.isSubscribed();
      archived = topic.isArchived();
      const acs = topic.getAccessMode();
      if (acs) {
        muted = acs.isMuted();
        blocked = !acs.isJoiner();
        self_blocked = !acs.isJoiner('want');
        deleter = acs.isDeleter();
      }
    }
    webrtc = !!this.tinode.getServerParam('iceServers');
    return [subscribed ? {
      title: this.props.intl.formatMessage(messages.menu_item_info),
      handler: this.handleShowInfoView
    } : null, subscribed && tinode_sdk__WEBPACK_IMPORTED_MODULE_4__.Tinode.isP2PTopicName(topicName) && webrtc ? {
      title: this.props.intl.formatMessage(messages.menu_item_audio_call),
      handler: this.handleStartAudioCall
    } : null, subscribed && tinode_sdk__WEBPACK_IMPORTED_MODULE_4__.Tinode.isP2PTopicName(topicName) && webrtc ? {
      title: this.props.intl.formatMessage(messages.menu_item_video_call),
      handler: this.handleStartVideoCall
    } : null, subscribed ? 'messages_clear' : null, subscribed && deleter ? 'messages_clear_hard' : null, muted ? blocked ? null : 'topic_unmute' : 'topic_mute', self_blocked ? 'topic_unblock' : 'topic_block', archived ? 'topic_restore' : 'topic_archive', 'topic_delete'];
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
    _lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].addUrlParam(window.location.hash, 'info', 'info'));
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
      added.map(uid => {
        topic.invite(uid, null).catch(err => this.handleError(err.message, 'err'));
      });
    }
    if (removed && removed.length > 0) {
      removed.map(uid => {
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
      }).then(_ => _lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].setUrlSidePanel(window.location.hash, 'contacts'))).catch(err => this.handleError(err.message, 'err'));
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
    const secret = (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_15__.base64ReEncode)(tempAuth.secret);
    if (!secret || !tempAuth.scheme) {
      this.handleError(this.props.intl.formatMessage(messages.invalid_security_token), 'err');
    } else {
      this.tinode.connect().then(_ => this.tinode.updateAccountBasic(null, null, newPassword, {
        scheme: tempAuth.scheme,
        secret: secret
      })).then(_ => {
        this.handleError(this.props.intl.formatMessage(messages.password_reset_success), 'info');
        _lib_navigation_js__WEBPACK_IMPORTED_MODULE_18__["default"].navigateTo('');
      }).catch(err => {
        this.handleError(err.message, 'err');
      });
    }
  }
  handleShowCountrySelector(code, dial, selectedCallback) {
    this.handleShowAlert("Select country", react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react__WEBPACK_IMPORTED_MODULE_0__.Suspense, {
      fallback: react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
        id: "loading_note",
        defaultMessage: [{
          "type": 0,
          "value": "Loading..."
        }]
      }))
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(PhoneCountrySelector, {
      selected: code,
      onSubmit: (c, d) => {
        this.setState({
          alertVisible: false
        });
        selectedCallback(c, d);
      }
    })), null, null, _ => {}, "Cancel");
  }
  handleStartVideoCall() {
    this.setState({
      callTopic: this.state.topicSelected,
      callState: _constants_js__WEBPACK_IMPORTED_MODULE_13__.CALL_STATE_OUTGOING_INITATED,
      callAudioOnly: false
    });
  }
  handleStartAudioCall() {
    this.setState({
      callTopic: this.state.topicSelected,
      callState: _constants_js__WEBPACK_IMPORTED_MODULE_13__.CALL_STATE_OUTGOING_INITATED,
      callAudioOnly: true
    });
  }
  handleCallInvite(callTopic, callSeq, callState, audioOnly) {
    switch (callState) {
      case _constants_js__WEBPACK_IMPORTED_MODULE_13__.CALL_STATE_OUTGOING_INITATED:
        const head = {
          webrtc: _constants_js__WEBPACK_IMPORTED_MODULE_13__.CALL_HEAD_STARTED,
          aonly: !!audioOnly
        };
        this.handleSendMessage(tinode_sdk__WEBPACK_IMPORTED_MODULE_4__.Drafty.videoCall(audioOnly), undefined, undefined, head).then(ctrl => {
          if (ctrl.code < 200 || ctrl.code >= 300 || !ctrl.params || !ctrl.params.seq) {
            this.handleCallClose();
            return;
          }
          this.setState({
            callSeq: ctrl.params['seq']
          });
        });
        break;
      case _constants_js__WEBPACK_IMPORTED_MODULE_13__.CALL_STATE_IN_PROGRESS:
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
      callState: _constants_js__WEBPACK_IMPORTED_MODULE_13__.CALL_STATE_NONE,
      callAudioOnly: undefined
    });
  }
  handleCallAccept(topicName) {
    const topic = this.tinode.getTopic(topicName);
    if (!topic) {
      return;
    }
    if (topic.isSubscribed()) {
      this.handleTopicSelected(this.state.callTopic);
      this.setState({
        callState: _constants_js__WEBPACK_IMPORTED_MODULE_13__.CALL_STATE_IN_PROGRESS
      });
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
            callState: _constants_js__WEBPACK_IMPORTED_MODULE_13__.CALL_STATE_NONE,
            callSeq: null,
            callAudioOnly: undefined
          });
          return;
        }
        if (info.topic == this.state.callTopic) {
          this.setState({
            callState: _constants_js__WEBPACK_IMPORTED_MODULE_13__.CALL_STATE_IN_PROGRESS
          });
        }
        break;
      case 'hang-up':
        this.handleCallClose();
        break;
    }
  }
  handleDataMessage(data) {
    if (data.head && data.head.webrtc && data.head.webrtc == _constants_js__WEBPACK_IMPORTED_MODULE_13__.CALL_HEAD_STARTED) {
      const topic = this.tinode.getTopic(data.topic);
      if (topic) {
        const msg = topic.latestMsgVersion(data.seq) || data;
        if (msg.head && msg.head.webrtc && msg.head.webrtc == _constants_js__WEBPACK_IMPORTED_MODULE_13__.CALL_HEAD_STARTED) {
          if (data.from != this.state.myUserId) {
            if (this.state.callState == _constants_js__WEBPACK_IMPORTED_MODULE_13__.CALL_STATE_NONE) {
              this.setState({
                callTopic: data.topic,
                callState: _constants_js__WEBPACK_IMPORTED_MODULE_13__.CALL_STATE_INCOMING_RECEIVED,
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
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "app-container",
      ref: this.selfRef
    }, this.state.contextMenuVisible ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_context_menu_jsx__WEBPACK_IMPORTED_MODULE_6__["default"], {
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
    }) : null, this.state.forwardDialogVisible ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_forward_dialog_jsx__WEBPACK_IMPORTED_MODULE_7__["default"], {
      tinode: this.tinode,
      contacts: this.state.chatList,
      topicSelected: this.state.topicSelected,
      myUserId: this.state.myUserId,
      hide: this.handleHideForwardDialog,
      onInitFind: this.tnInitFind,
      searchResults: this.state.searchResults,
      onSearchContacts: this.handleSearchContacts,
      onTopicSelected: this.handleStartTopicRequest
    }) : null, this.state.callTopic && this.state.callState == _constants_js__WEBPACK_IMPORTED_MODULE_13__.CALL_STATE_INCOMING_RECEIVED ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_call_incoming_jsx__WEBPACK_IMPORTED_MODULE_8__["default"], {
      tinode: this.tinode,
      topic: this.state.callTopic,
      seq: this.state.callSeq,
      callState: this.state.callState,
      audioOnly: this.state.callAudioOnly,
      onClose: this.handleCallClose,
      onRinging: this.handleCallRinging,
      onAcceptCall: this.handleCallAccept,
      onReject: this.handleCallHangup
    }) : null, this.state.alertVisible ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_alert_jsx__WEBPACK_IMPORTED_MODULE_5__["default"], {
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
    }) : null, !this.state.displayMobile || this.state.mobilePanel == 'sidepanel' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_sidepanel_view_jsx__WEBPACK_IMPORTED_MODULE_11__["default"], {
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
    }) : null, !this.state.displayMobile || this.state.mobilePanel == 'topic-view' && !this.state.infoPanel ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_messages_view_jsx__WEBPACK_IMPORTED_MODULE_10__["default"], {
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
      forwardMessage: this.state.forwardMessage,
      onCancelForwardMessage: this.handleHideForwardDialog,
      callTopic: this.state.callTopic,
      callSeq: this.state.callSeq,
      callState: this.state.callState,
      callAudioOnly: this.state.callAudioOnly,
      onCallHangup: this.handleCallHangup,
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
    }) : null, this.state.infoPanel ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_info_view_jsx__WEBPACK_IMPORTED_MODULE_9__["default"], {
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
      onAddMember: this.handleManageGroupMembers,
      onTopicTagsUpdateRequest: this.handleTagsUpdateRequest,
      onTopicUnArchive: this.handleUnarchive,
      onInitFind: this.tnInitFind,
      onError: this.handleError,
      showContextMenu: this.handleShowContextMenu
    }) : null);
  }
}
;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(TinodeWeb));

/***/ }),

/***/ "./src/views/topic-common-view.jsx":
/*!*****************************************!*\
  !*** ./src/views/topic-common-view.jsx ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TopicCommonView)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _widgets_topic_desc_edit_jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../widgets/topic-desc-edit.jsx */ "./src/widgets/topic-desc-edit.jsx");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");



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
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "scrollable-panel"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_topic_desc_edit_jsx__WEBPACK_IMPORTED_MODULE_1__["default"], {
      tinode: this.props.tinode,
      topic: this.props.topic,
      onUpdateTopicDesc: this.props.onUpdateTopicDesc,
      onUpdateTags: this.handleTagsUpdated,
      onError: this.props.onError
    }));
  }
}
;

/***/ }),

/***/ "./src/views/validation-view.jsx":
/*!***************************************!*\
  !*** ./src/views/validation-view.jsx ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);


const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  phone: {
    id: "phone_dative",
    defaultMessage: [{
      "type": 0,
      "value": "phone"
    }]
  },
  email: {
    id: "email_dative",
    defaultMessage: [{
      "type": 0,
      "value": "email"
    }]
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
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small gray",
      htmlFor: "enter-confirmation-code"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "enter_confirmation_code_prompt",
      defaultMessage: [{
        "type": 0,
        "value": "Confirmation code"
      }],
      values: {
        method: method
      }
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "numeric_confirmation_code_prompt",
      defaultMessage: [{
        "type": 0,
        "value": "Numbers only"
      }]
    }, numbers_only => react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
      type: "text",
      id: "enter-confirmation-code",
      placeholder: numbers_only,
      value: this.state.code,
      onChange: this.handleCodeChange,
      onKeyDown: this.handleKeyPress,
      required: true
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "dialog-buttons"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      className: "secondary",
      onClick: this.handleCancel
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "button_cancel",
      defaultMessage: [{
        "type": 0,
        "value": "Cancel"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      className: "primary",
      onClick: this.handleSubmit
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "button_confirm",
      defaultMessage: [{
        "type": 0,
        "value": "Confirm"
      }]
    }))));
  }
}
;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(ValidationView));

/***/ }),

/***/ "./src/widgets/alert.jsx":
/*!*******************************!*\
  !*** ./src/widgets/alert.jsx ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Alert)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);


class Alert extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "alert-container"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "alert"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "title"
    }, this.props.title), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "content"
    }, this.props.content), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "dialog-buttons"
    }, this.props.onReject ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      className: "outline",
      onClick: this.props.onReject
    }, this.props.reject || react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "button_cancel",
      defaultMessage: [{
        "type": 0,
        "value": "Cancel"
      }]
    })) : null, this.props.onConfirm ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      className: "primary",
      onClick: this.props.onConfirm
    }, this.props.confirm || react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "button_ok",
      defaultMessage: [{
        "type": 0,
        "value": "OK"
      }]
    })) : null)));
  }
}
;

/***/ }),

/***/ "./src/widgets/attachment.jsx":
/*!************************************!*\
  !*** ./src/widgets/attachment.jsx ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Attachment)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _file_progress_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./file-progress.jsx */ "./src/widgets/file-progress.jsx");
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");





class Attachment extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
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
    if (!url) {
      this.props.onError("Invalid download URL '" + url + "'");
      return;
    }
    const downloader = this.props.tinode.getLargeFileHelper();
    this.setState({
      downloader: downloader
    });
    downloader.download(url, filename, mimetype, loaded => this.setState({
      progress: loaded / this.props.size
    }), err => this.props.onError(err, 'err')).then(_ => this.setState({
      downloader: null,
      progress: 0
    })).catch(err => {
      if (err) {
        this.props.onError("Error downloading file: " + err.message, 'err');
      }
      this.setState({
        downloader: null,
        progress: 0
      });
    });
  }
  handleCancel() {
    if (this.props.uploading) {
      this.props.onCancelUpload();
    } else if (this.state.downloader) {
      this.state.downloader.cancel();
    }
  }
  render() {
    let filename = this.props.filename || 'file_attachment';
    if (filename.length > 36) {
      filename = filename.substr(0, 16) + '...' + filename.substr(-16);
    }
    let size = this.props.size > 0 ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
      className: "small gray"
    }, "(", (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_3__.bytesToHumanSize)(this.props.size), ")") : null;
    let url, helperFunc;
    if (!this.props.uploading && !this.state.downloader && (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_4__.isUrlRelative)(this.props.downloadUrl)) {
      url = '#';
      helperFunc = e => {
        e.preventDefault();
        this.downloadFile(this.props.downloadUrl, this.props.filename, this.props.mimetype);
      };
    } else {
      url = (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_4__.sanitizeUrl)(this.props.downloadUrl);
      helperFunc = null;
    }
    const downloadWidget = react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "file_download"), " ", react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "save_attachment",
      defaultMessage: [{
        "type": 0,
        "value": "save"
      }]
    }));
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "attachment"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons big gray"
    }, "insert_drive_file")), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "flex-column"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, filename, " ", size), this.props.uploading || this.state.downloader ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_file_progress_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
      progress: this.props.uploading ? this.props.progress : this.state.progress,
      onCancel: this.handleCancel
    }) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, url ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: url,
      download: this.props.filename,
      onClick: helperFunc
    }, downloadWidget) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
      className: "light-gray"
    }, downloadWidget))));
  }
}
;

/***/ }),

/***/ "./src/widgets/audio-player.jsx":
/*!**************************************!*\
  !*** ./src/widgets/audio-player.jsx ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _lib_strformat__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/strformat */ "./src/lib/strformat.js");
/* harmony import */ var _lib_blob_helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/blob-helpers */ "./src/lib/blob-helpers.js");




const CANVAS_UPSCALING = 2.0;
const LINE_WIDTH = 3 * CANVAS_UPSCALING;
const SPACING = 2 * CANVAS_UPSCALING;
const BAR_COLOR = '#888A';
const BAR_COLOR_DARK = '#666C';
const THUMB_COLOR = '#444E';
const MIN_PREVIEW_LENGTH = 16;
const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  icon_title_play: {
    id: "icon_title_play",
    defaultMessage: [{
      "type": 0,
      "value": "Play recording"
    }]
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
    const play = react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: this.handlePlay,
      title: this.props.intl.formatMessage(messages.icon_title_play)
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: playClass
    }, this.state.playing ? 'pause_circle' : this.state.canPlay ? 'play_circle' : 'not_interested'));
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "audio-player"
    }, this.props.short ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("canvas", {
      className: "playback",
      ref: this.canvasRef,
      onClick: this.handleSeek
    }), play) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, play, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("canvas", {
      className: "playback",
      ref: this.canvasRef,
      onClick: this.handleSeek
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "timer"
    }, this.state.currentTime, "/", this.state.duration))));
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(AudioPlayer));

/***/ }),

/***/ "./src/widgets/avatar-crop.jsx":
/*!*************************************!*\
  !*** ./src/widgets/avatar-crop.jsx ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AvatarCrop)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _cropper_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./cropper.jsx */ "./src/widgets/cropper.jsx");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");




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
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_cropper_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
      source: this.props.avatar,
      onChange: this.handleChange
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "dialog-buttons"
    }, this.props.onCancel ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      className: "secondary",
      onClick: this.props.onCancel
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "button_cancel",
      defaultMessage: [{
        "type": 0,
        "value": "Cancel"
      }]
    })) : null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      className: "primary",
      onClick: this.handleSubmit
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "button_ok",
      defaultMessage: [{
        "type": 0,
        "value": "OK"
      }]
    }))));
  }
}
;

/***/ }),

/***/ "./src/widgets/avatar-upload.jsx":
/*!***************************************!*\
  !*** ./src/widgets/avatar-upload.jsx ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AvatarUpload)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _letter_tile_jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./letter-tile.jsx */ "./src/widgets/letter-tile.jsx");
/* harmony import */ var _load_spinner_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./load-spinner.jsx */ "./src/widgets/load-spinner.jsx");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../config.js */ "./src/config.js");





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
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: className
    }, this.props.readOnly || !this.state.source ? null : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      className: "clear-avatar",
      onClick: e => {
        e.preventDefault();
        this.props.onImageUpdated();
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "clear")), this.state.source ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
      src: this.props.tinode.authorizeURL((0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_3__.sanitizeUrlForMime)(this.state.source, 'image')),
      className: "preview"
    }) : this.props.readOnly && this.props.uid ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "avatar-box"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_letter_tile_jsx__WEBPACK_IMPORTED_MODULE_1__["default"], {
      tinode: this.props.tinode,
      avatar: true,
      topic: this.props.uid,
      title: this.props.title
    })) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "blank"
    }, _config_js__WEBPACK_IMPORTED_MODULE_4__.AVATAR_SIZE, "\xD7", _config_js__WEBPACK_IMPORTED_MODULE_4__.AVATAR_SIZE), this.props.readOnly ? null : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
      type: "file",
      id: randId,
      className: "inputfile hidden",
      accept: "image/*",
      onChange: this.handleFileReceived
    }), this.props.readOnly ? null : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      htmlFor: randId,
      className: "round"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "file_upload")), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_load_spinner_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
      show: this.props.uploading,
      large: true,
      clear: true,
      centered: true
    }));
  }
}
;

/***/ }),

/***/ "./src/widgets/badge-list.jsx":
/*!************************************!*\
  !*** ./src/widgets/badge-list.jsx ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);


const icon_mapping = {
  'staff': 'verified_user'
};
const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  badge_verified: {
    id: "badge_verified",
    defaultMessage: [{
      "type": 0,
      "value": "Verified/official"
    }]
  },
  badge_staff: {
    id: "badge_staff",
    defaultMessage: [{
      "type": 0,
      "value": "Staff-managed"
    }]
  },
  badge_danger: {
    id: "badge_danger",
    defaultMessage: [{
      "type": 0,
      "value": "Untrustworthy"
    }]
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
      this.props.trustedBadges.map(b => {
        const comment = this.props.short ? null : formatMessage(messages['badge_' + b]);
        const style = 'material-icons ' + b + '-color';
        badges.push(react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
          className: "trusted-badge",
          key: b
        }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
          className: style
        }, icon_mapping[b] || b), " ", comment));
      });
      return react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, badges);
    }
    return null;
  }
}
;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(BadgeList));

/***/ }),

/***/ "./src/widgets/button-back.jsx":
/*!*************************************!*\
  !*** ./src/widgets/button-back.jsx ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ButtonBack)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

class ButtonBack extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: e => {
        e.preventDefault();
        this.props.onBack();
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "arrow_back"));
  }
}

/***/ }),

/***/ "./src/widgets/call-incoming.jsx":
/*!***************************************!*\
  !*** ./src/widgets/call-incoming.jsx ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CallIncoming)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _badge_list_jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./badge-list.jsx */ "./src/widgets/badge-list.jsx");
/* harmony import */ var _letter_tile_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./letter-tile.jsx */ "./src/widgets/letter-tile.jsx");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../constants.js */ "./src/constants.js");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");







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
      fullName: (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_6__.clipStr)(topic.public ? topic.public.fn : undefined, _config_js__WEBPACK_IMPORTED_MODULE_3__.MAX_TITLE_LENGTH),
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
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "alert-container"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "incoming-call"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "caller-card incoming pulse"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "avatar-box"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_letter_tile_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
      tinode: this.props.tinode,
      avatar: this.state.avatar || true,
      topic: this.props.topic,
      title: this.state.fullName
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "caller-name"
    }, (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_6__.clipStr)(this.state.fullName, _config_js__WEBPACK_IMPORTED_MODULE_3__.MAX_PEER_TITLE_LENGTH), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_badge_list_jsx__WEBPACK_IMPORTED_MODULE_1__["default"], {
      short: true,
      trustedBadges: this.state.trustedBadges
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "controls"
    }, this.props.callState == _constants_js__WEBPACK_IMPORTED_MODULE_4__.CALL_STATE_INCOMING_RECEIVED ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      className: "danger",
      onClick: this.handleRejectCall
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "call_end")), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      className: "positive",
      onClick: this.handleAcceptCall
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "call"))) : null)));
  }
}
;

/***/ }),

/***/ "./src/widgets/call-message.jsx":
/*!**************************************!*\
  !*** ./src/widgets/call-message.jsx ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CallMessage)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");



class CallMessage extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    const isCallDropped = ['busy', 'declined', 'disconnected', 'missed'].includes(this.props.callState);
    const successClass = 'material-icons medium ' + (isCallDropped ? 'red' : 'green');
    const callIcon = this.props.incoming ? isCallDropped ? 'call_missed' : 'call_received' : isCallDropped ? 'call_missed_outgoing' : 'call_made';
    let duration;
    if (isCallDropped) {
      switch (this.props.callState) {
        case 'busy':
          duration = react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "call_busy",
            defaultMessage: [{
              "type": 0,
              "value": "busy"
            }]
          });
          break;
        case 'declined':
          duration = react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "call_declined",
            defaultMessage: [{
              "type": 0,
              "value": "declined"
            }]
          });
          break;
        case 'missed':
          duration = this.props.incoming ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "call_missed",
            defaultMessage: [{
              "type": 0,
              "value": "missed"
            }]
          }) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "call_cancelled",
            defaultMessage: [{
              "type": 0,
              "value": "cancelled"
            }]
          });
          break;
        default:
          duration = react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "call_disconnected",
            defaultMessage: [{
              "type": 0,
              "value": "disconnected"
            }]
          });
          break;
      }
    } else {
      duration = react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_2__.secondsToTime)(this.props.duration / 1000));
    }
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "call-message"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons big gray"
    }, "call")), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "flex-column narrow"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, this.props.incoming ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "calls_incoming",
      defaultMessage: [{
        "type": 0,
        "value": "Incoming call"
      }]
    }) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "calls_outgoing",
      defaultMessage: [{
        "type": 0,
        "value": "Outgoing call"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "duration"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: successClass
    }, callIcon), " ", duration)));
  }
}

/***/ }),

/***/ "./src/widgets/call-panel.jsx":
/*!************************************!*\
  !*** ./src/widgets/call-panel.jsx ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _letter_tile_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./letter-tile.jsx */ "./src/widgets/letter-tile.jsx");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../constants.js */ "./src/constants.js");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");






const RING_SOUND = new Audio('audio/call-out.m4a');
RING_SOUND.loop = true;
const CALL_ENDED_SOUND = new Audio('audio/call-end.m4a');
CALL_ENDED_SOUND.loop = true;
const DIALING_SOUND = new Audio('audio/dialing.m4a');
const VIDEO_MUTED_EVENT = 'video:muted';
const VIDEO_UNMUTED_EVENT = 'video:unmuted';
const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  already_in_call: {
    id: "already_in_call",
    defaultMessage: [{
      "type": 0,
      "value": "You already in an ongoing call!"
    }]
  }
});
class CallPanel extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.state = {
      localStream: undefined,
      remoteStream: undefined,
      pc: undefined,
      dataChannel: undefined,
      previousOnInfo: undefined,
      waitingForPeer: false,
      callInitialSetupComplete: false,
      audioOnly: props.callAudioOnly,
      videoToggleInProgress: false,
      remoteVideoLive: false
    };
    this.localStreamConstraints = {
      audio: true,
      video: !props.callAudioOnly
    };
    this.isOutgoingCall = props.callState == _constants_js__WEBPACK_IMPORTED_MODULE_4__.CALL_STATE_OUTGOING_INITATED;
    this.localRef = react__WEBPACK_IMPORTED_MODULE_0___default().createRef();
    this.remoteRef = react__WEBPACK_IMPORTED_MODULE_0___default().createRef();
    this.remoteIceCandidatesCache = [];
    this.onInfo = this.onInfo.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.createPeerConnection = this.createPeerConnection.bind(this);
    this.canSendOffer = this.canSendOffer.bind(this);
    this.drainRemoteIceCandidatesCache = this.drainRemoteIceCandidatesCache.bind(this);
    this.handleNegotiationNeededEvent = this.handleNegotiationNeededEvent.bind(this);
    this.handleICECandidateEvent = this.handleICECandidateEvent.bind(this);
    this.handleNewICECandidateMsg = this.handleNewICECandidateMsg.bind(this);
    this.handleICEConnectionStateChangeEvent = this.handleICEConnectionStateChangeEvent.bind(this);
    this.handleSignalingStateChangeEvent = this.handleSignalingStateChangeEvent.bind(this);
    this.handleICEGatheringStateChangeEvent = this.handleICEGatheringStateChangeEvent.bind(this);
    this.handleIceCandidateErrorEvent = this.handleIceCandidateErrorEvent.bind(this);
    this.handleTrackEvent = this.handleTrackEvent.bind(this);
    this.handleVideoOfferMsg = this.handleVideoOfferMsg.bind(this);
    this.handleVideoAnswerMsg = this.handleVideoAnswerMsg.bind(this);
    this.handleNewICECandidateMsg = this.handleNewICECandidateMsg.bind(this);
    this.reportError = this.reportError.bind(this);
    this.handleGetUserMediaError = this.handleGetUserMediaError.bind(this);
    this.stopTracks = this.stopTracks.bind(this);
    this.disconnectMedia = this.disconnectMedia.bind(this);
    this.handleCloseClick = this.handleCloseClick.bind(this);
    this.handleToggleCameraClick = this.handleToggleCameraClick.bind(this);
    this.handleToggleMicClick = this.handleToggleMicClick.bind(this);
    this.handleRemoteHangup = this.handleRemoteHangup.bind(this);
    this.handleVideoCallAccepted = this.handleVideoCallAccepted.bind(this);
    this.muteVideo = this.muteVideo.bind(this);
    this.unmuteVideo = this.unmuteVideo.bind(this);
    this.emptyVideoTrack = this.emptyVideoTrack.bind(this);
    this.handleDataChannelEvent = this.handleDataChannelEvent.bind(this);
    this.handleDataChannelError = this.handleDataChannelError.bind(this);
    this.handleDataChannelMessage = this.handleDataChannelMessage.bind(this);
    this.handleDataChannelOpen = this.handleDataChannelOpen.bind(this);
    this.handleDataChannelClose = this.handleDataChannelClose.bind(this);
  }
  componentDidMount() {
    const topic = this.props.tinode.getTopic(this.props.topic);
    this.previousOnInfo = topic.onInfo;
    topic.onInfo = this.onInfo;
    if ((this.props.callState == _constants_js__WEBPACK_IMPORTED_MODULE_4__.CALL_STATE_OUTGOING_INITATED || this.props.callState == _constants_js__WEBPACK_IMPORTED_MODULE_4__.CALL_STATE_IN_PROGRESS) && this.localRef.current) {
      this.start();
    }
  }
  componentWillUnmount() {
    const topic = this.props.tinode.getTopic(this.props.topic);
    topic.onInfo = this.previousOnInfo;
    this.stop();
  }
  handleVideoCallAccepted(info) {
    RING_SOUND.pause();
    const pc = this.createPeerConnection(true);
    const stream = this.state.localStream;
    stream.getTracks().forEach(track => {
      pc.addTrack(track, stream);
      if (track.kind == 'video' && this.state.audioOnly) {
        track.enabled = false;
        track.stop();
        stream.removeTrack(track);
      }
    });
  }
  onInfo(info) {
    if (info.what != 'call') {
      return;
    }
    switch (info.event) {
      case 'accept':
        this.handleVideoCallAccepted(info);
        break;
      case 'answer':
        this.handleVideoAnswerMsg(info);
        break;
      case 'ice-candidate':
        this.handleNewICECandidateMsg(info);
        break;
      case 'hang-up':
        this.handleRemoteHangup(info);
        break;
      case 'offer':
        this.handleVideoOfferMsg(info);
        break;
      case 'ringing':
        RING_SOUND.play().catch(_ => {});
        break;
      default:
        console.warn("Unknown call event", info.event);
        break;
    }
  }
  emptyVideoTrack() {
    const width = 640;
    const height = 480;
    const canvas = Object.assign(document.createElement("canvas"), {
      width,
      height
    });
    canvas.getContext('2d').fillRect(0, 0, width, height);
    const stream = canvas.captureStream(0);
    return Object.assign(stream.getVideoTracks()[0], {
      enabled: false
    });
  }
  start() {
    if (this.state.localStream) {
      this.props.onError(this.props.intl.formatMessage(messages.already_in_call), 'info');
      return;
    }
    if (this.props.callState == _constants_js__WEBPACK_IMPORTED_MODULE_4__.CALL_STATE_IN_PROGRESS) {
      this.props.onInvite(this.props.topic, this.props.seq, _constants_js__WEBPACK_IMPORTED_MODULE_4__.CALL_STATE_IN_PROGRESS, this.props.callAudioOnly);
      return;
    }
    navigator.mediaDevices.getUserMedia(this.localStreamConstraints).then(stream => {
      if (!this.localStreamConstraints.video) {
        stream.addTrack(this.emptyVideoTrack());
      }
      this.setState({
        localStream: stream,
        waitingForPeer: true
      });
      this.localRef.current.srcObject = stream;
      DIALING_SOUND.play();
      this.props.onInvite(this.props.topic, this.props.seq, this.props.callState, this.props.callAudioOnly);
    }).catch(this.handleGetUserMediaError);
  }
  stop() {
    CALL_ENDED_SOUND.pause();
    CALL_ENDED_SOUND.currentTime = 0;
    RING_SOUND.pause();
    RING_SOUND.currentTime = 0;
    this.stopTracks(this.state.localStream);
    this.stopTracks(this.state.remoteStream);
    this.disconnectMedia(this.localRef.current);
    this.disconnectMedia(this.remoteRef.current);
    if (this.state.pc) {
      this.state.pc.ontrack = null;
      this.state.pc.onremovetrack = null;
      this.state.pc.onremovestream = null;
      this.state.pc.onicecandidate = null;
      this.state.pc.oniceconnectionstatechange = null;
      this.state.pc.onsignalingstatechange = null;
      this.state.pc.onicegatheringstatechange = null;
      this.state.pc.onnegotiationneeded = null;
      this.state.pc.onicecandidateerror = null;
      this.state.pc.ondatachannel = null;
      if (this.state.dataChannel && (this.state.dataChannel.readyState == 'open' || this.state.dataChannel.readyState == 'connecting')) {
        this.state.dataChannel.close();
      }
      this.state.pc.close();
    }
    this.setState({
      pc: null,
      waitingForPeer: false
    });
  }
  disconnectMedia(el) {
    if (!el) {
      return;
    }
    el.srcObject = null;
    el.src = '';
  }
  stopTracks(stream) {
    if (!stream) {
      return;
    }
    let tracks = stream.getTracks();
    if (tracks) {
      tracks.forEach(track => {
        track.stop();
        track.enabled = false;
      });
    }
  }
  handleDataChannelError(error) {
    console.error('data channel error', error);
  }
  handleDataChannelMessage(event) {
    switch (event.data) {
      case VIDEO_MUTED_EVENT:
        this.setState({
          remoteVideoLive: false
        }, _ => {
          this.remoteRef.current.srcObject = this.state.remoteStream;
        });
        break;
      case VIDEO_UNMUTED_EVENT:
        this.setState({
          remoteVideoLive: true
        }, _ => {
          this.remoteRef.current.srcObject = this.state.remoteStream;
        });
        break;
      default:
        break;
    }
  }
  handleDataChannelOpen(event) {
    if (!this.state.audioOnly) {
      event.target.send(VIDEO_UNMUTED_EVENT);
    }
  }
  handleDataChannelClose(event) {
    console.log('close data channel:', event);
  }
  handleDataChannelEvent(event) {
    console.log('data channel event:', event);
    const channel = event.channel;
    channel.onerror = this.handleDataChannelError;
    channel.onmessage = this.handleDataChannelMessage;
    channel.onopen = this.handleDataChannelOpen;
    channel.onclose = this.handleDataChannelClose;
    this.setState({
      dataChannel: channel
    });
  }
  createPeerConnection(withDataChannel) {
    const iceServers = this.props.tinode.getServerParam('iceServers', null);
    const pc = iceServers ? new RTCPeerConnection({
      iceServers: iceServers
    }) : new RTCPeerConnection();
    pc.onicecandidate = this.handleICECandidateEvent;
    pc.oniceconnectionstatechange = this.handleICEConnectionStateChangeEvent;
    pc.onicegatheringstatechange = this.handleICEGatheringStateChangeEvent;
    pc.onsignalingstatechange = this.handleSignalingStateChangeEvent;
    pc.onnegotiationneeded = this.handleNegotiationNeededEvent;
    pc.onicecandidateerror = this.handleIceCandidateErrorEvent;
    pc.ontrack = this.handleTrackEvent;
    pc.ondatachannel = this.handleDataChannelEvent;
    let stateUpdate = {
      pc: pc,
      waitingForPeer: false
    };
    if (withDataChannel) {
      const channel = pc.createDataChannel("events", {
        ordered: true
      });
      channel.onerror = this.handleDataChannelError;
      channel.onmessage = this.handleDataChannelMessage;
      channel.onopen = this.handleDataChannelOpen;
      channel.onclose = this.handleDataChannelClose;
      stateUpdate.dataChannel = channel;
    }
    this.setState(stateUpdate);
    return pc;
  }
  handleVideoAnswerMsg(info) {
    const desc = new RTCSessionDescription(info.payload);
    this.state.pc.setRemoteDescription(desc).then(_ => {
      this.setState({
        callInitialSetupComplete: true
      }, _ => this.drainRemoteIceCandidatesCache());
    }).catch(err => this.reportError(err));
  }
  reportError(err) {
    this.props.onError(err.message, 'err');
  }
  canSendOffer() {
    return this.isOutgoingCall || this.state.callInitialSetupComplete;
  }
  handleNegotiationNeededEvent(event) {
    const pc = event.target;
    if (!this.canSendOffer()) {
      return;
    }
    pc.createOffer().then(offer => {
      return pc.setLocalDescription(offer);
    }).then(_ => {
      this.props.onSendOffer(this.props.topic, this.props.seq, pc.localDescription.toJSON());
    }).catch(err => this.reportError(err));
  }
  handleIceCandidateErrorEvent(event) {
    console.warn("ICE candidate error:", event);
  }
  handleICECandidateEvent(event) {
    if (event.candidate) {
      this.props.onIceCandidate(this.props.topic, this.props.seq, event.candidate.toJSON());
    }
  }
  handleNewICECandidateMsg(info) {
    const candidate = new RTCIceCandidate(info.payload);
    if (this.state.callInitialSetupComplete) {
      this.state.pc.addIceCandidate(candidate).catch(err => {
        if (candidate.candidate) {
          this.reportError(err);
        }
        console.warn("Error adding new ice candidate", candidate, err);
      });
    } else {
      this.remoteIceCandidatesCache.push(candidate);
    }
  }
  drainRemoteIceCandidatesCache() {
    this.remoteIceCandidatesCache.forEach(candidate => {
      this.state.pc.addIceCandidate(candidate).catch(err => {
        if (candidate.candidate) {
          this.reportError(err);
        }
        console.warn("Error adding cached ice candidate", candidate, err);
      });
    });
    this.remoteIceCandidatesCache = [];
  }
  handleICEConnectionStateChangeEvent(event) {
    switch (event.target.iceConnectionState) {
      case 'closed':
      case 'failed':
        this.handleCloseClick();
        break;
    }
  }
  handleSignalingStateChangeEvent(event) {
    if (event.target.signalingState == 'closed') {
      this.handleCloseClick();
    }
  }
  handleICEGatheringStateChangeEvent(event) {}
  handleTrackEvent(event) {
    this.remoteRef.current.srcObject = event.streams[0];
    this.setState({
      remoteStream: event.streams[0]
    });
  }
  handleGetUserMediaError(e) {
    console.error("Error opening camera and/or microphone", e);
    switch (e.name) {
      case 'NotFoundError':
        this.reportError(e);
        break;
      case 'SecurityError':
      case 'PermissionDeniedError':
        break;
      default:
        this.reportError(e);
        break;
    }
    this.handleCloseClick();
  }
  handleVideoOfferMsg(info) {
    let localStream = null;
    const pc = this.state.pc ? this.state.pc : this.createPeerConnection(false);
    const desc = new RTCSessionDescription(info.payload);
    pc.setRemoteDescription(desc).then(_ => {
      return navigator.mediaDevices.getUserMedia(this.localStreamConstraints);
    }).then(stream => {
      let dummyVideo;
      if (!this.localStreamConstraints.video) {
        dummyVideo = this.emptyVideoTrack();
        stream.addTrack(dummyVideo);
      }
      localStream = stream;
      this.localRef.current.srcObject = stream;
      this.setState({
        localStream: stream
      });
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });
      if (dummyVideo) {
        dummyVideo.enabled = false;
        dummyVideo.stop();
        stream.removeTrack(dummyVideo);
      }
    }).then(_ => {
      return pc.createAnswer();
    }).then(answer => {
      return pc.setLocalDescription(answer);
    }).then(_ => {
      this.props.onSendAnswer(this.props.topic, this.props.seq, pc.localDescription.toJSON());
      this.setState({
        callInitialSetupComplete: true
      }, _ => this.drainRemoteIceCandidatesCache());
    }).catch(this.handleGetUserMediaError);
  }
  handleRemoteHangup() {
    if (!this.state.waitingForPeer) {
      this.handleCloseClick();
    } else {
      this.setState({
        waitingForPeer: false
      });
      RING_SOUND.pause();
      RING_SOUND.currentTime = 0;
      CALL_ENDED_SOUND.loop = true;
      CALL_ENDED_SOUND.play().catch(_ => {});
      setTimeout(_ => {
        this.handleCloseClick();
      }, 2000);
    }
  }
  handleCloseClick() {
    this.stop();
    this.props.onHangup(this.props.topic, this.props.seq);
  }
  muteVideo() {
    if (!this.state.pc || !this.state.dataChannel) {
      return;
    }
    const stream = this.state.localStream;
    const t = stream.getVideoTracks()[0];
    t.enabled = false;
    t.stop();
    stream.removeTrack(t);
    this.state.dataChannel.send(VIDEO_MUTED_EVENT);
    this.setState({
      videoToggleInProgress: false
    });
  }
  unmuteVideo() {
    if (!this.state.pc || !this.state.dataChannel) {
      return;
    }
    navigator.mediaDevices.getUserMedia({
      video: true
    }).then(stream => {
      this.localRef.current.srcObject = null;
      const sender = this.state.pc.getSenders().find(s => s.track.kind == 'video');
      const track = stream.getVideoTracks()[0];
      stream.removeTrack(track);
      this.state.localStream.addTrack(track);
      return sender.replaceTrack(track);
    }).then(_ => {
      this.localRef.current.srcObject = this.state.localStream;
      this.state.dataChannel.send(VIDEO_UNMUTED_EVENT);
    }).catch(err => this.handleGetUserMediaError(err)).finally(_ => {
      this.setState({
        videoToggleInProgress: false
      });
    });
  }
  handleToggleCameraClick() {
    if (this.state.videoToggleInProgress) {
      return;
    }
    const tracks = this.state.localStream.getVideoTracks();
    this.setState({
      videoToggleInProgress: true
    }, _ => {
      if (tracks && tracks.length > 0 && tracks[0].enabled && tracks[0].readyState == 'live') {
        this.muteVideo();
      } else {
        this.unmuteVideo();
      }
      this.setState({
        audioOnly: !this.state.audioOnly
      });
    });
  }
  handleToggleMicClick() {
    const stream = this.state.localStream;
    const t = stream.getAudioTracks()[0];
    t.enabled = !t.enabled;
    this.forceUpdate();
  }
  render() {
    const audioTracks = this.state.localStream && this.state.localStream.getAudioTracks();
    const videoTracks = !this.state.audioOnly && this.state.localStream && this.state.localStream.getVideoTracks();
    const disabled = !this.state.pc || !this.state.dataChannel || !(audioTracks && audioTracks[0]);
    const audioIcon = audioTracks && audioTracks[0] && audioTracks[0].enabled ? 'mic' : 'mic_off';
    const videoIcon = videoTracks && videoTracks[0] && videoTracks[0].enabled && videoTracks[0].readyState == 'live' ? 'videocam' : 'videocam_off';
    const peerTitle = (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_5__.clipStr)(this.props.title, _config_js__WEBPACK_IMPORTED_MODULE_3__.MAX_PEER_TITLE_LENGTH);
    const pulseAnimation = this.state.waitingForPeer ? ' pulse' : '';
    let remoteActive = false;
    if (this.remoteRef.current && this.remoteRef.current.srcObject && this.state.remoteVideoLive) {
      const rstream = this.remoteRef.current.srcObject;
      if (rstream.getVideoTracks().length > 0) {
        const t = rstream.getVideoTracks()[0];
        remoteActive = t.enabled && t.readyState == 'live';
      }
    }
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "video-container"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "video-container-panel"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "call-party self",
      disabled: this.state.audioOnly
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("video", {
      ref: this.localRef,
      autoPlay: true,
      muted: true,
      playsInline: true
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "caller-name inactive"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "calls_you_label",
      defaultMessage: [{
        "type": 0,
        "value": "You"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "call-party peer",
      disabled: !remoteActive
    }, remoteActive ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("video", {
      ref: this.remoteRef,
      autoPlay: true,
      playsInline: true
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "caller-name inactive"
    }, peerTitle)) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("audio", {
      ref: this.remoteRef,
      autoPlay: true
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: `caller-card${pulseAnimation}`
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "avatar-box"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_letter_tile_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
      tinode: this.props.tinode,
      avatar: this.props.avatar,
      topic: this.props.topic,
      title: this.props.title
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "caller-name"
    }, peerTitle))))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "controls"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      className: "danger",
      onClick: this.handleCloseClick
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "call_end")), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      className: "secondary",
      onClick: this.handleToggleCameraClick,
      disabled: disabled
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, videoIcon)), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      className: "secondary",
      onClick: this.handleToggleMicClick,
      disabled: disabled
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, audioIcon)))));
  }
}
;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(CallPanel));

/***/ }),

/***/ "./src/widgets/call-status.jsx":
/*!*************************************!*\
  !*** ./src/widgets/call-status.jsx ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CallStatus)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");



class CallStatus extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    const isCallDropped = ['busy', 'declined', 'disconnected', 'missed'].includes(this.props.callState);
    const icon2 = this.props.incoming ? isCallDropped ? 'call_missed' : 'call_received' : isCallDropped ? 'call_missed_outgoing' : 'call_made';
    let duration;
    if (isCallDropped) {
      switch (this.props.callState) {
        case 'busy':
          duration = react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "call_busy",
            defaultMessage: [{
              "type": 0,
              "value": "busy"
            }]
          });
          break;
        case 'declined':
          duration = react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "call_declined",
            defaultMessage: [{
              "type": 0,
              "value": "declined"
            }]
          });
          break;
        case 'missed':
          duration = this.props.incoming ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "call_missed",
            defaultMessage: [{
              "type": 0,
              "value": "missed"
            }]
          }) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "call_cancelled",
            defaultMessage: [{
              "type": 0,
              "value": "cancelled"
            }]
          });
          break;
        default:
          duration = react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
            id: "call_disconnected",
            defaultMessage: [{
              "type": 0,
              "value": "disconnected"
            }]
          });
          break;
      }
    } else if (['accepted', 'started'].includes(this.props.callState) && !this.props.duration) {
      duration = react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
        id: "call_in_progress",
        defaultMessage: [{
          "type": 0,
          "value": "in progress"
        }]
      });
    } else {
      duration = react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_2__.secondsToTime)(this.props.duration / 1000));
    }
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "composed-material"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "call"), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons second"
    }, icon2)), " ", duration);
  }
}
;

/***/ }),

/***/ "./src/widgets/chat-message.jsx":
/*!**************************************!*\
  !*** ./src/widgets/chat-message.jsx ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _attachment_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./attachment.jsx */ "./src/widgets/attachment.jsx");
/* harmony import */ var _letter_tile_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./letter-tile.jsx */ "./src/widgets/letter-tile.jsx");
/* harmony import */ var _received_marker_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./received-marker.jsx */ "./src/widgets/received-marker.jsx");
/* harmony import */ var _lib_formatters_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../lib/formatters.js */ "./src/lib/formatters.js");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }








class BaseChatMessage extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0
    };
    if (props.uploader) {
      props.uploader.onProgress = this.handleProgress.bind(this);
    }
    this.handleExpandImage = this.handleExpandImage.bind(this);
    this.handlePlayVideo = this.handlePlayVideo.bind(this);
    this.handleFormButtonClick = this.handleFormButtonClick.bind(this);
    this.handleContextClick = this.handleContextClick.bind(this);
    this.handleCancelUpload = this.handleCancelUpload.bind(this);
    this.handleQuoteClick = this.handleQuoteClick.bind(this);
    this.formatterContext = {
      formatMessage: props.intl.formatMessage.bind(props.intl),
      viewportWidth: props.viewportWidth,
      authorizeURL: props.tinode.authorizeURL.bind(props.tinode),
      onImagePreview: this.handleExpandImage,
      onVideoPreview: this.handlePlayVideo,
      onFormButtonClick: this.handleFormButtonClick,
      onQuoteClick: this.handleQuoteClick
    };
  }
  handleExpandImage(e) {
    e.preventDefault();
    this.props.onExpandMedia({
      url: e.target.src,
      filename: e.target.dataset.name,
      width: e.target.dataset.width,
      height: e.target.dataset.height,
      size: e.target.dataset.size,
      type: e.target.dataset.mime
    });
  }
  handlePlayVideo(e) {
    e.preventDefault();
    this.props.onExpandMedia({
      video: true,
      url: e.target.dataset.src,
      preview: e.target.src,
      filename: e.target.dataset.name,
      width: e.target.dataset.width,
      height: e.target.dataset.height,
      duration: e.target.dataset.duration,
      size: e.target.dataset.size,
      type: e.target.dataset.mime
    });
  }
  handleFormButtonClick(e) {
    e.preventDefault();
    const data = {
      seq: this.props.seq
    };
    data.resp = {};
    if (e.target.dataset.name) {
      data.resp[e.target.dataset.name] = e.target.dataset.val ? e.target.dataset.val : e.target.dataset.val === undefined ? 1 : '' + e.target.dataset.val;
    }
    if (e.target.dataset.act == 'url') {
      data.ref = (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_7__.sanitizeUrl)(e.target.dataset.ref) || 'about:blank';
    }
    const text = e.target.dataset.title || 'unknown';
    this.props.onFormResponse(e.target.dataset.act, text, data);
  }
  handleContextClick(e) {
    e.preventDefault();
    e.stopPropagation();
    const menuItems = [];
    if (this.props.received == tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.MESSAGE_STATUS_FAILED) {
      menuItems.push('menu_item_send_retry');
    }
    if (this.props.userIsWriter && this.props.received > tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.MESSAGE_STATUS_FATAL) {
      menuItems.push('menu_item_reply');
      if (!this.props.response) {
        let immutable = false;
        tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.entities(this.props.content, (_0, _1, tp) => {
          immutable = ['AU', 'EX', 'FM', 'IM', 'VC', 'VD'].includes(tp);
          return immutable;
        });
        if (!immutable) {
          tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.styles(this.props.content, tp => {
            immutable = ['QQ'].includes(tp);
            return immutable;
          });
        }
        if (!immutable) {
          menuItems.push('menu_item_edit');
        }
      }
    }
    menuItems.push('menu_item_forward');
    this.props.showContextMenu({
      seq: this.props.seq,
      replace: this.props.edited ? parseInt(this.props.edited.split(':')[1]) : 0,
      content: this.props.content,
      userFrom: this.props.userFrom,
      userName: this.props.userName,
      y: e.pageY,
      x: e.pageX,
      pickReply: this.props.pickReply,
      editMessage: this.props.editMessage
    }, menuItems);
  }
  handleProgress(ratio) {
    this.setState({
      progress: ratio
    });
  }
  handleCancelUpload() {
    this.props.onCancelUpload(this.props.seq, this.props.uploader);
  }
  handleQuoteClick(e) {
    e.preventDefault();
    e.stopPropagation();
    const replyToSeq = this.props.replyToSeq;
    if (replyToSeq) {
      this.props.onQuoteClick(replyToSeq);
    }
  }
  render() {
    const sideClass = this.props.sequence + ' ' + (this.props.response ? 'left' : 'right');
    const bubbleClass = this.props.sequence == 'single' || this.props.sequence == 'last' ? 'bubble tip' : 'bubble';
    const avatar = this.props.userAvatar || true;
    const fullDisplay = this.props.isGroup && this.props.response && (this.props.sequence == 'single' || this.props.sequence == 'last');
    let content = this.props.content;
    const attachments = [];
    if (this.props.mimeType == tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.getContentType() && tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.isValid(content)) {
      tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.attachments(content, (att, i) => {
        if (att.mime == 'application/json') {
          return;
        }
        attachments.push(react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_attachment_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
          tinode: this.props.tinode,
          downloadUrl: tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.getDownloadUrl(att),
          filename: att.name,
          uploading: tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.isProcessing(att),
          mimetype: att.mime,
          size: tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.getEntitySize(att),
          progress: this.state.progress,
          onCancelUpload: this.handleCancelUpload,
          onError: this.props.onError,
          key: i
        }));
      }, this);
      const tree = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.format(content, _lib_formatters_js__WEBPACK_IMPORTED_MODULE_6__.fullFormatter, this.formatterContext);
      content = react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, tree);
    } else if (typeof content != 'string') {
      content = react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
        className: "material-icons gray"
      }, "warning_amber"), " ", react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
        className: "gray"
      }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
        id: "invalid_content",
        defaultMessage: [{
          "type": 0,
          "value": "invalid content"
        }]
      })));
    }
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", {
      ref: this.props.innerRef,
      className: sideClass
    }, this.props.isGroup && this.props.response ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "avatar-box"
    }, fullDisplay ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_letter_tile_jsx__WEBPACK_IMPORTED_MODULE_4__["default"], {
      tinode: this.props.tinode,
      topic: this.props.userFrom,
      title: this.props.userName,
      avatar: avatar
    }) : null) : null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: bubbleClass
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "content-meta"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "message-content"
    }, content, attachments), this.props.timestamp ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_received_marker_jsx__WEBPACK_IMPORTED_MODULE_5__["default"], {
      edited: this.props.edited,
      timestamp: this.props.timestamp,
      received: this.props.received
    }) : null), this.props.showContextMenu ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
      className: "menuTrigger"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: this.handleContextClick
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "expand_more"))) : null), fullDisplay ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "author"
    }, this.props.userName || react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "user_not_found",
      defaultMessage: [{
        "type": 0,
        "value": "Not found"
      }]
    }))) : null));
  }
}
;
const IntlChatMessage = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(BaseChatMessage);
const ChatMessage = react__WEBPACK_IMPORTED_MODULE_0___default().forwardRef((props, ref) => react__WEBPACK_IMPORTED_MODULE_0___default().createElement(IntlChatMessage, _extends({
  innerRef: ref
}, props)));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ChatMessage);

/***/ }),

/***/ "./src/widgets/checkbox.jsx":
/*!**********************************!*\
  !*** ./src/widgets/checkbox.jsx ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CheckBox)
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ChipInput)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _chip_jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./chip.jsx */ "./src/widgets/chip.jsx");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");



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
      placeholder: props.chips ? '' : props.prompt,
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
    chips.map(item => {
      index[item.user] = count;
      count++;
    });
    return index;
  }
  static sortChips(chips, keep) {
    const required = [];
    const normal = [];
    chips.map(item => {
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
    this.state.sortedChips.map(item => {
      chips.push(react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_chip_jsx__WEBPACK_IMPORTED_MODULE_1__["default"], {
        tinode: this.props.tinode,
        onCancel: this.handleChipCancel,
        avatar: (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_2__.makeImageUrl)(item.public ? item.public.photo : null),
        title: item.public ? item.public.fn : undefined,
        noAvatar: this.props.avatarDisabled,
        topic: item.user,
        required: staticMembers.includes(item.user),
        invalid: item.invalid,
        index: count,
        key: item.user
      }));
      count++;
    });
    const className = "chip-input" + (this.state.focused ? ' focused' : '');
    const autoFocus = !(this.props.tabIndex > 0);
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: className
    }, chips, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
      type: "text",
      placeholder: this.state.placeholder,
      onChange: this.handleTextInput,
      onFocus: this.handleFocusGained,
      onBlur: this.handleFocusLost,
      onKeyDown: this.handleKeyDown,
      value: this.state.input,
      tabIndex: this.props.tabIndex,
      autoFocus: autoFocus
    }));
  }
}
;

/***/ }),

/***/ "./src/widgets/chip.jsx":
/*!******************************!*\
  !*** ./src/widgets/chip.jsx ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Chip)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _letter_tile_jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./letter-tile.jsx */ "./src/widgets/letter-tile.jsx");


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
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: className
    }, this.props.noAvatar ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
      className: "spacer"
    }) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "avatar-box"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_letter_tile_jsx__WEBPACK_IMPORTED_MODULE_1__["default"], {
      tinode: this.props.tinode,
      avatar: this.props.avatar || true,
      topic: this.props.topic,
      title: this.props.title
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, title), this.props.onCancel && !this.props.required ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: this.handleCancel
    }, "\xD7") : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
      className: "spacer"
    }));
  }
}
;

/***/ }),

/***/ "./src/widgets/contact-action.jsx":
/*!****************************************!*\
  !*** ./src/widgets/contact-action.jsx ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);


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
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", {
      onClick: this.handleClick,
      className: "action"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "action-text"
    }, formatMessage(this.props.title, this.props.values)));
  }
}
;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(ContactAction));

/***/ }),

/***/ "./src/widgets/contact-badges.jsx":
/*!****************************************!*\
  !*** ./src/widgets/contact-badges.jsx ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ContactBadges)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

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
      this.props.badges.map(b => {
        const color = b.color ? ' ' + b.color : '';
        if (b.icon) {
          badges.push(react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
            className: 'material-icons as-badge' + color,
            key: b.key || b.icon
          }, icon_mapping[b.icon] || b.icon));
        } else {
          badges.push(react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
            className: 'badge' + color,
            key: b.key || b.name
          }, b.name));
        }
      });
      return react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, badges);
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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







const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  badge_you: {
    id: "badge_you",
    defaultMessage: [{
      "type": 0,
      "value": "you"
    }]
  },
  badge_owner: {
    id: "badge_owner",
    defaultMessage: [{
      "type": 0,
      "value": "owner"
    }]
  }
});
class ContactList extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  render() {
    const {
      formatMessage
    } = this.props.intl;
    const showCheckmark = Array.isArray(this.props.topicSelected);
    const contactNodes = [];
    let contactsCount = 0;
    if (this.props.contacts && this.props.contacts.length > 0) {
      this.props.contacts.map(c => {
        if (c.action) {
          contactNodes.push(react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_contact_action_jsx__WEBPACK_IMPORTED_MODULE_4__["default"], {
            title: c.title,
            action: c.action,
            values: c.values,
            key: c.action,
            onAction: this.props.onAction
          }));
        } else {
          const key = this.props.showMode ? c.user : c.topic || c.user;
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
          contactNodes.push(react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_contact_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
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
            index: contactNodes.length,
            key: key
          }));
          contactsCount++;
        }
      }, this);
    }
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: this.props.noScroll ? null : "scrollable-panel"
    }, contactsCount == 0 ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "center-medium-text",
      dangerouslySetInnerHTML: {
        __html: this.props.emptyListMessage
      }
    }) : null, contactNodes.length > 0 ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("ul", {
      className: "contact-box"
    }, contactNodes) : null);
  }
}
;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(ContactList));

/***/ }),

/***/ "./src/widgets/contact.jsx":
/*!*********************************!*\
  !*** ./src/widgets/contact.jsx ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _contact_badges_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./contact-badges.jsx */ "./src/widgets/contact-badges.jsx");
/* harmony import */ var _letter_tile_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./letter-tile.jsx */ "./src/widgets/letter-tile.jsx");
/* harmony import */ var _unread_badge_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./unread-badge.jsx */ "./src/widgets/unread-badge.jsx");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _lib_formatters_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../lib/formatters.js */ "./src/lib/formatters.js");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");








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
      y: e.pageY,
      x: e.pageX
    });
  }
  render() {
    let title = this.props.title;
    if (!title) {
      title = react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
        id: "unnamed_topic",
        defaultMessage: [{
          "type": 0,
          "value": "Unnamed"
        }]
      }));
    } else if (title.length > 30) {
      title = title.substring(0, 28) + '…';
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
    } else if (tinode_sdk__WEBPACK_IMPORTED_MODULE_5__.Drafty.isValid(this.props.preview)) {
      preview = react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, tinode_sdk__WEBPACK_IMPORTED_MODULE_5__.Drafty.format(this.props.preview, _lib_formatters_js__WEBPACK_IMPORTED_MODULE_6__.previewFormatter, {
        formatMessage: this.props.intl.formatMessage,
        previewIsResponse: this.props.previewIsResponse
      }));
    } else if (this.props.preview) {
      preview = react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
        className: "material-icons gray"
      }, "warning_amber"), " ", react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
        className: "gray"
      }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
        id: "invalid_content",
        defaultMessage: [{
          "type": 0,
          "value": "invalid content"
        }]
      })));
    }
    const icon = (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_7__.deliveryMarker)(this.props.received);
    const marker = icon ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: 'material-icons small space-right' + (icon.color ? ' ' + icon.color : '')
    }, icon.name) : null;
    const titleClass = 'contact-title' + (this.props.deleted ? ' deleted' : '');
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", {
      className: !this.props.showCheckmark && this.props.selected ? 'selected' : null,
      onClick: this.handleClick
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "avatar-box"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_letter_tile_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
      tinode: this.props.tinode,
      avatar: avatar,
      title: this.props.title,
      topic: this.props.item,
      deleted: this.props.deleted
    }), this.props.deleted ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "deleted material-icons"
    }, "cancel") : this.props.showOnline ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
      className: online
    }) : this.props.showCheckmark && this.props.selected ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "checkmark material-icons"
    }, "check_circle") : null), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "text-box"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
      className: titleClass
    }, title), this.props.isGroup ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons as-badge"
    }, "group") : null, this.props.isChannel ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
      src: "/img/channel.png",
      className: "channel",
      alt: "channel"
    }) : null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_contact_badges_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
      badges: icon_badges
    }), !this.props.deleted ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_unread_badge_jsx__WEBPACK_IMPORTED_MODULE_4__["default"], {
      count: this.props.unread
    }) : null), this.props.showMode ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_contact_badges_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
      badges: badges
    })) : this.props.small ? null : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "contact-comment"
    }, marker, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, preview || this.props.comment || '\u00A0'))), this.props.showContextMenu ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
      className: "menuTrigger"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: this.handleContextClick
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "expand_more"))) : null);
  }
}
;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(Contact));

/***/ }),

/***/ "./src/widgets/context-menu.jsx":
/*!**************************************!*\
  !*** ./src/widgets/context-menu.jsx ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../config.js */ "./src/config.js");



const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  info: {
    id: "menu_item_info",
    defaultMessage: [{
      "type": 0,
      "value": "Info"
    }]
  },
  clear_messages: {
    id: "menu_item_clear_messages",
    defaultMessage: [{
      "type": 0,
      "value": "Clear messages"
    }]
  },
  clear_for_all: {
    id: "menu_item_clear_messages_for_all",
    defaultMessage: [{
      "type": 0,
      "value": "Clear for All"
    }]
  },
  delete: {
    id: "menu_item_delete",
    defaultMessage: [{
      "type": 0,
      "value": "Delete"
    }]
  },
  delete_for_all: {
    id: "menu_item_delete_for_all",
    defaultMessage: [{
      "type": 0,
      "value": "Delete for All"
    }]
  },
  send_retry: {
    id: "menu_item_send_retry",
    defaultMessage: [{
      "type": 0,
      "value": "Retry"
    }]
  },
  mute: {
    id: "menu_item_mute",
    defaultMessage: [{
      "type": 0,
      "value": "Mute"
    }]
  },
  unmute: {
    id: "menu_item_unmute",
    defaultMessage: [{
      "type": 0,
      "value": "Unmute"
    }]
  },
  reply: {
    id: "menu_item_reply",
    defaultMessage: [{
      "type": 0,
      "value": "Reply"
    }]
  },
  forward: {
    id: "menu_item_forward",
    defaultMessage: [{
      "type": 0,
      "value": "Forward"
    }]
  },
  edit: {
    id: "menu_item_edit",
    defaultMessage: [{
      "type": 0,
      "value": "Edit"
    }]
  },
  topic_delete: {
    id: "menu_item_delete_topic",
    defaultMessage: [{
      "type": 0,
      "value": "Delete"
    }]
  },
  topic_delete_warning: {
    id: "topic_delete_warning",
    defaultMessage: [{
      "type": 0,
      "value": "Are you sure you want to delete this conversation? It cannot be undone."
    }]
  },
  delete_messages_warning: {
    id: "delete_messages_warning",
    defaultMessage: [{
      "type": 0,
      "value": "Are you sure you want to delete all messages for everyone? It cannot be undone."
    }]
  },
  unblock: {
    id: "menu_item_unblock",
    defaultMessage: [{
      "type": 0,
      "value": "Unblock"
    }]
  },
  block: {
    id: "menu_item_block",
    defaultMessage: [{
      "type": 0,
      "value": "Block"
    }]
  },
  topic_block_warning: {
    id: "topic_block_warning",
    defaultMessage: [{
      "type": 0,
      "value": "Are you sure you want to block this conversation?"
    }]
  },
  member_delete: {
    id: "menu_item_member_delete",
    defaultMessage: [{
      "type": 0,
      "value": "Remove"
    }]
  },
  archive: {
    id: "menu_item_archive_topic",
    defaultMessage: [{
      "type": 0,
      "value": "Archive"
    }]
  },
  unarchive: {
    id: "menu_item_restore_topic",
    defaultMessage: [{
      "type": 0,
      "value": "Restore"
    }]
  },
  edit_permissions: {
    id: "menu_item_edit_permissions",
    defaultMessage: [{
      "type": 0,
      "value": "Edit permissions"
    }]
  },
  clear_messages_warning: {
    id: "clear_messages_warning",
    defaultMessage: [{
      "type": 0,
      "value": "Are you sure you want to clear all messages? It cannot be undone."
    }]
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
          return props.onShowAlert(formatMessage(messages.clear_messages), formatMessage(messages.clear_messages_warning), _ => {
            this.deleteMessages(true, false, params, errorHandler);
          }, null, true, null);
        }
      },
      'messages_clear_hard': {
        id: 'messages_clear_hard',
        title: formatMessage(messages.clear_for_all),
        handler: (params, errorHandler) => {
          return props.onShowAlert(formatMessage(messages.clear_for_all), formatMessage(messages.delete_messages_warning), _ => {
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
          return props.onShowAlert(formatMessage(messages.block), formatMessage(messages.topic_block_warning), _ => this.topicPermissionSetter('-JP', params, errorHandler).then(ctrl => {
            this.props.onTopicRemoved(params.topicName);
            return ctrl;
          }), null, true, null);
        }
      },
      'topic_delete': {
        id: 'topic_delete',
        title: formatMessage(messages.topic_delete),
        handler: (params, errorHandler) => {
          return props.onShowAlert(formatMessage(messages.topic_delete), formatMessage(messages.topic_delete_warning), _ => {
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
    this.props.items.map(item => {
      if (typeof item == 'string') {
        item = this.MenuItems[item];
      }
      if (item && item.title) {
        menu.push(item.title == '-' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", {
          className: "separator",
          key: count
        }) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", {
          onClick: this.handleClick,
          "data-id": count,
          key: count
        }, item.title));
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
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("ul", {
      className: "menu",
      style: position,
      ref: this.selfRef
    }, menu);
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(ContextMenu));

/***/ }),

/***/ "./src/widgets/cropper.jsx":
/*!*********************************!*\
  !*** ./src/widgets/cropper.jsx ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Cropper)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

const DEFAULT_MAX_ZOOM = 2.5;
class Cropper extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    this.state = {
      panX: 0,
      panY: 0,
      originX: 0,
      originY: 0,
      zoom: 1,
      minZoom: 0,
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
    this.overlay.current.removeEventListener('mousedown', this.mouseDown);
    this.overlay.current.removeEventListener('touchstart', this.mouseDown);
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
      maxZoom: Math.max(DEFAULT_MAX_ZOOM, minZoom + 1)
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
    const coLeft = this.cutoutRect.left - this.bBoxRect.left;
    const coRight = coLeft + this.cutoutRect.width;
    if (coLeft < imgLeft) {
      panX -= imgLeft - coLeft;
    } else if (coRight > imgRight) {
      panX += coRight - imgRight;
    }
    const imgTop = this.originY - (this.originY - panY) * zoom;
    const imgBottom = imgTop + this.imageHeight * zoom;
    const coTop = this.cutoutRect.top - this.bBoxRect.top;
    const coBottom = coTop + this.cutoutRect.height;
    if (coTop < imgTop) {
      panY -= imgTop - coTop;
    } else if (coBottom > imgBottom) {
      panY += coBottom - imgBottom;
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
    const dX = pageX - this.mouseX;
    const dY = pageY - this.mouseY;
    this.mouseX = pageX;
    this.mouseY = pageY;
    const imgRect = this.preview.current.getBoundingClientRect();
    let panX = Cropper.checkBound(this.state.panX, [imgRect.left, imgRect.right], [this.cutoutRect.left, this.cutoutRect.right], dX);
    let panY = Cropper.checkBound(this.state.panY, [imgRect.top, imgRect.bottom], [this.cutoutRect.top, this.cutoutRect.bottom], dY);
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
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "cropper"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "bounding-box",
      ref: this.boundingBox
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
      src: this.props.source,
      className: "preview",
      alt: "",
      style: {
        transform: t3d,
        transformOrigin: orig
      },
      ref: this.preview,
      onLoad: this.initScaling
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "cutout circle",
      ref: this.cutout
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "overlay",
      style: overlay,
      ref: this.overlay
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "zoom-wrapper"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
      type: "range",
      className: "zoomer",
      step: "0.001",
      min: this.state.minZoom,
      max: this.state.maxZoom,
      value: this.state.zoom,
      onChange: this.onZoom
    })));
  }
}

/***/ }),

/***/ "./src/widgets/doc-preview.jsx":
/*!*************************************!*\
  !*** ./src/widgets/doc-preview.jsx ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DocPreview)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _widgets_send_message_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../widgets/send-message.jsx */ "./src/widgets/send-message.jsx");
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");




function iconFromMime(mime) {
  const mimeToIcon = {
    default: 'insert_drive_file',
    image: 'image',
    text: 'description',
    video: 'theaters'
  };
  return mimeToIcon[mime] || mimeToIcon[(mime || '').split('/')[0]] || mimeToIcon['default'];
}
class DocPreview extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.handleSendDoc = this.handleSendDoc.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }
  handleKeyDown(e) {
    e.preventDefault();
    if (e.key === 'Escape') {
      this.props.onClose();
    }
  }
  handleSendDoc(caption) {
    this.props.onClose();
    this.props.onSendMessage(this.props.content.file);
  }
  render() {
    if (!this.props.content) {
      return null;
    }
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "image-preview"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "image-preview-caption-panel"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, this.props.content.name), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: e => {
        e.preventDefault();
        this.props.onClose();
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons gray"
    }, "close"))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "image-preview-container"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "flex-column narrow"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons gray"
    }, iconFromMime(this.props.content.type)), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("b", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_file_name",
      defaultMessage: [{
        "type": 0,
        "value": "File name:"
      }]
    })), " ", (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_3__.shortenFileName)(this.props.content.name, 24) || '-'), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("b", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_content_type",
      defaultMessage: [{
        "type": 0,
        "value": "Content type:"
      }]
    })), " ", this.props.content.type || 'application/octet-stream'), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("b", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_size",
      defaultMessage: [{
        "type": 0,
        "value": "Size:"
      }]
    })), " ", (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_3__.bytesToHumanSize)(this.props.content.size)))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_widgets_send_message_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
      noInput: true,
      tinode: this.props.tinode,
      reply: this.props.reply,
      onCancelReply: this.props.onCancelReply,
      onSendMessage: this.handleSendDoc,
      onError: this.props.onError
    }));
  }
}
;

/***/ }),

/***/ "./src/widgets/error-panel.jsx":
/*!*************************************!*\
  !*** ./src/widgets/error-panel.jsx ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ErrorPanel)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _menu_cancel_jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./menu-cancel.jsx */ "./src/widgets/menu-cancel.jsx");


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
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: className
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "icon"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, level)), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, this.props.text, this.props.action ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, "\xA0 ", react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      style: {
        whiteSpace: 'nowrap'
      },
      onClick: e => {
        e.preventDefault();
        this.props.action();
      }
    }, this.props.actionText)) : null), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "cancel"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_menu_cancel_jsx__WEBPACK_IMPORTED_MODULE_1__["default"], {
      onCancel: this.hide
    })));
  }
}
;

/***/ }),

/***/ "./src/widgets/file-progress.jsx":
/*!***************************************!*\
  !*** ./src/widgets/file-progress.jsx ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ FileProgress)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);


class FileProgress extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "uploader"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
      style: {
        width: this.props.progress * 100 + "%"
      }
    })), this.props.progress < 0.999 ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: e => {
        e.preventDefault();
        this.props.onCancel();
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "close"), " ", react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "action_cancel",
      defaultMessage: [{
        "type": 0,
        "value": "cancel"
      }]
    })) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "upload_finishing",
      defaultMessage: [{
        "type": 0,
        "value": "finishing..."
      }]
    }));
  }
}

/***/ }),

/***/ "./src/widgets/forward-dialog.jsx":
/*!****************************************!*\
  !*** ./src/widgets/forward-dialog.jsx ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ForwardDialog)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _contact_list_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./contact-list.jsx */ "./src/widgets/contact-list.jsx");
/* harmony import */ var _search_contacts_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./search-contacts.jsx */ "./src/widgets/search-contacts.jsx");





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
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "alert-container"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "forward-dialog"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "title with-control"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "forward_to",
      defaultMessage: [{
        "type": 0,
        "value": "Forward to"
      }],
      desription: "Title of the contact selector dialog when forwarding a message"
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: this.handleClose
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "close")))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "forward_to_search_placeholder",
      defaultMessage: [{
        "type": 0,
        "value": "Search contacts"
      }]
    }, search_placeholder => react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_search_contacts_jsx__WEBPACK_IMPORTED_MODULE_4__["default"], {
      placeholder: search_placeholder,
      onSearchContacts: this.handleSearchContacts
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "search_no_results",
      defaultMessage: [{
        "type": 0,
        "value": "Search returned no results"
      }]
    }, not_found_placeholder => react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_contact_list_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
      tinode: this.props.tinode,
      contacts: contacts,
      myUserId: this.props.myUserId,
      emptyListMessage: not_found_placeholder,
      showOnline: false,
      showUnread: false,
      showContextMenu: false,
      onTopicSelected: this.handleContactSelected
    }))));
  }
}

/***/ }),

/***/ "./src/widgets/group-manager.jsx":
/*!***************************************!*\
  !*** ./src/widgets/group-manager.jsx ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _chip_input_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./chip-input.jsx */ "./src/widgets/chip-input.jsx");
/* harmony import */ var _contact_list_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./contact-list.jsx */ "./src/widgets/contact-list.jsx");




const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  no_contacts: {
    id: "no_contacts",
    defaultMessage: [{
      "type": 0,
      "value": "You have no contacts :-("
    }]
  },
  contacts_not_found_short: {
    id: "contacts_not_found_short",
    defaultMessage: [{
      "type": 0,
      "value": "No contacts match '"
    }, {
      "type": 1,
      "value": "query"
    }, {
      "type": 0,
      "value": "'"
    }]
  }
});
class GroupManager extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    this.state = {
      members: props.members,
      index: GroupManager.indexMembers(props.members),
      staticMembers: GroupManager.staticMembers(props.members, props.keepInitialMembers, props.requiredMember),
      contactFilter: '',
      noContactsMessage: props.intl.formatMessage(messages.no_contacts),
      selectedContacts: GroupManager.selectedContacts(props.members)
    };
    this.handleContactSelected = this.handleContactSelected.bind(this);
    this.handleMemberRemoved = this.handleMemberRemoved.bind(this);
    this.handleContactFilter = this.handleContactFilter.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }
  static indexMembers(members) {
    let index = {};
    members.map(m => {
      index[m.user] = {
        delta: 0,
        present: true
      };
    });
    return index;
  }
  static staticMembers(members, keepInitial, requiredMember) {
    let stat = [];
    members.map(m => {
      if (keepInitial || m.user == requiredMember) {
        stat.push(m.user);
      }
    });
    return stat;
  }
  static selectedContacts(members) {
    let sel = [];
    members.map(m => {
      sel.push(m.user);
    });
    return sel;
  }
  handleContactSelected(userId, index) {
    let status = this.state.index[userId];
    if (status) {
      if (status.present) {
        return;
      }
      status.delta += 1;
      status.present = true;
    } else {
      status = {
        delta: 1,
        present: true
      };
    }
    let m = this.state.members.slice();
    m.push(this.props.contacts[index]);
    const sel = GroupManager.selectedContacts(m);
    const i = this.state.index;
    i[userId] = status;
    this.setState({
      members: m,
      index: i,
      selectedContacts: sel
    });
  }
  handleMemberRemoved(userId, index) {
    const status = this.state.index[userId];
    if (!status || !status.present) {
      return;
    }
    status.present = false;
    status.delta -= 1;
    let m = this.state.members.slice();
    m.splice(index, 1);
    const sel = GroupManager.selectedContacts(m);
    const i = this.state.index;
    i[userId] = status;
    this.setState({
      members: m,
      index: i,
      selectedContacts: sel
    });
  }
  handleContactFilter(val) {
    const {
      formatMessage
    } = this.props.intl;
    const msg = !val ? formatMessage(messages.no_contacts) : formatMessage(messages.contacts_not_found_short, {
      query: val
    });
    this.setState({
      contactFilter: val,
      noContactsMessage: msg
    });
  }
  static doContactFiltering(filter, values) {
    if (filter) {
      for (let i = 0; i < values.length; i++) {
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
    keys.map(function (k) {
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
    const {
      formatMessage
    } = this.props.intl;
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "group-manager"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "title_group_members",
      defaultMessage: [{
        "type": 0,
        "value": "Group Members"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_chip_input_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
      tinode: this.props.tinode,
      chips: this.state.members,
      staticMembers: this.state.staticMembers,
      prompt: "add members",
      filterFunc: this.handleContactFilter,
      onChipRemoved: this.handleMemberRemoved
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "title_all_contacts",
      defaultMessage: [{
        "type": 0,
        "value": "All Contacts"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_contact_list_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
      tinode: this.props.tinode,
      contacts: this.props.contacts,
      myUserId: this.props.myUserId,
      topicSelected: this.state.selectedContacts,
      filter: this.state.contactFilter,
      filterFunc: GroupManager.doContactFiltering,
      emptyListMessage: this.state.noContactsMessage,
      showOnline: false,
      showUnread: false,
      onTopicSelected: this.handleContactSelected
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "group-manager-buttons",
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      className: "secondary",
      onClick: this.handleCancel
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "button_cancel",
      defaultMessage: [{
        "type": 0,
        "value": "Cancel"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      className: "primary",
      onClick: this.handleSubmit
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "button_ok",
      defaultMessage: [{
        "type": 0,
        "value": "OK"
      }]
    }))));
  }
}
;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(GroupManager));

/***/ }),

/***/ "./src/widgets/group-subs.jsx":
/*!************************************!*\
  !*** ./src/widgets/group-subs.jsx ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ GroupSubs)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _letter_tile_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./letter-tile.jsx */ "./src/widgets/letter-tile.jsx");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");





class GroupSubs extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
  }
  render() {
    const usersOnline = [];
    const totalCount = (this.props.subscribers || []).length;
    const countToShow = Math.min(_config_js__WEBPACK_IMPORTED_MODULE_2__.MAX_ONLINE_IN_TOPIC, totalCount);
    (this.props.subscribers || []).some(sub => {
      usersOnline.push(react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "avatar-box",
        key: sub.user
      }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_letter_tile_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
        tinode: this.props.tinode,
        topic: sub.user,
        avatar: (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_4__.makeImageUrl)(sub.public ? sub.public.photo : null) || true,
        title: sub.public ? sub.public.fn : null
      })));
      return usersOnline.length == countToShow;
    });
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "topic-users"
    }, usersOnline, " ", totalCount > countToShow ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "more_online_members",
      defaultMessage: [{
        "type": 0,
        "value": "+"
      }, {
        "type": 1,
        "value": "overflow"
      }, {
        "type": 0,
        "value": " more"
      }],
      values: {
        overflow: totalCount - countToShow
      }
    })) : null);
  }
}
;

/***/ }),

/***/ "./src/widgets/host-selector.jsx":
/*!***************************************!*\
  !*** ./src/widgets/host-selector.jsx ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ HostSelector)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config.js */ "./src/config.js");


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
    var hostOptions = [];
    for (let key in _config_js__WEBPACK_IMPORTED_MODULE_1__.KNOWN_HOSTS) {
      let item = _config_js__WEBPACK_IMPORTED_MODULE_1__.KNOWN_HOSTS[key];
      hostOptions.push(react__WEBPACK_IMPORTED_MODULE_0___default().createElement("option", {
        key: item,
        value: item
      }));
    }
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
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
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("datalist", {
      id: "known-hosts"
    }, hostOptions));
  }
}

/***/ }),

/***/ "./src/widgets/image-preview.jsx":
/*!***************************************!*\
  !*** ./src/widgets/image-preview.jsx ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ImagePreview)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _send_message_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./send-message.jsx */ "./src/widgets/send-message.jsx");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");







class ImagePreview extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0
    };
    this.handleSendImage = this.handleSendImage.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }
  handleKeyDown(e) {
    if (this.props.onSendMessage) {
      return;
    }
    e.preventDefault();
    if (e.key === 'Escape') {
      this.props.onClose();
    }
  }
  assignWidth(node) {
    if (node && !this.state.width) {
      const bounds = node.getBoundingClientRect();
      this.setState({
        width: bounds.width | 0,
        height: bounds.height | 0
      });
    }
  }
  handleSendImage(caption) {
    this.props.onClose();
    this.props.onSendMessage(caption, this.props.content.blob);
  }
  render() {
    if (!this.props.content) {
      return null;
    }
    const dim = (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_4__.fitImageSize)(this.props.content.width, this.props.content.height, this.state.width, this.state.height, false);
    const size = dim ? {
      width: dim.dstWidth + 'px',
      height: dim.dstHeight + 'px'
    } : this.props.content.width > this.props.content.height ? {
      width: '100%'
    } : {
      height: '100%'
    };
    size.maxWidth = '100%';
    size.maxHeight = '100%';
    const maxlength = Math.max((this.state.width / _config_js__WEBPACK_IMPORTED_MODULE_3__.REM_SIZE / 1.5 | 0) - 2, 12);
    const fname = (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_5__.shortenFileName)(this.props.content.filename, maxlength) || '-';
    const width = this.props.content.width || '-';
    const height = this.props.content.height || '-';
    const download_url = (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_6__.urlAsAttachment)(this.props.content.url);
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "image-preview"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "image-preview-caption-panel"
    }, this.props.onSendMessage ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, fname) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: download_url,
      download: this.props.content.filename
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "file_download"), " ", react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "download_action",
      defaultMessage: [{
        "type": 0,
        "value": "download"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: e => {
        e.preventDefault();
        this.props.onClose();
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons gray"
    }, "close"))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "image-preview-container",
      ref: node => this.assignWidth(node)
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
      src: this.props.content.url,
      style: size,
      className: "image-preview",
      alt: this.props.content.filename
    })), this.props.onSendMessage ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_send_message_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
      messagePrompt: "add_image_caption",
      acceptBlank: true,
      tinode: this.props.tinode,
      reply: this.props.reply,
      onCancelReply: this.props.onCancelReply,
      onSendMessage: this.handleSendImage,
      onError: this.props.onError
    }) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "image-preview-footer"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("b", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_file_name",
      defaultMessage: [{
        "type": 0,
        "value": "File name:"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
      title: this.props.content.filename
    }, fname))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("b", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_content_type",
      defaultMessage: [{
        "type": 0,
        "value": "Content type:"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, this.props.content.type)), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("b", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_size",
      defaultMessage: [{
        "type": 0,
        "value": "Size:"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, width, " \xD7 ", height, " px; ", (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_5__.bytesToHumanSize)(this.props.content.size)))));
  }
}
;

/***/ }),

/***/ "./src/widgets/in-place-edit.jsx":
/*!***************************************!*\
  !*** ./src/widgets/in-place-edit.jsx ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ InPlaceEdit)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _visible_password_jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./visible-password.jsx */ "./src/widgets/visible-password.jsx");


class InPlaceEdit extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    this.selfRef = react__WEBPACK_IMPORTED_MODULE_0___default().createRef();
    this.state = {
      active: props.active,
      initialValue: props.value || '',
      value: props.value || ''
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
    if ((value || this.props.value) && value !== this.props.value) {
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
      return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
        className: spanClass,
        onClick: this.handleStartEditing
      }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, spanText));
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
        attr.className = 'inplace-edit';
      } else {
        element = 'input';
        attr.type = this.props.type || 'text';
      }
      attr.value = this.state.value;
      attr.ref = this.selfRef;
      attr.onChange = this.handeTextChange;
      attr.onKeyDown = this.handleKeyDown;
      attr.onBlur = this.handleEditingFinished;
    }
    attr.placeholder = this.props.placeholder;
    attr.required = this.props.required ? 'required' : '';
    attr.autoComplete = this.props.autoComplete;
    attr.autoFocus = true;
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(element, attr, null);
  }
}
;

/***/ }),

/***/ "./src/widgets/inline-video.jsx":
/*!**************************************!*\
  !*** ./src/widgets/inline-video.jsx ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ InlineVideo)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");


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
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: className
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement('img', this.props), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "play-control"
    }, this.props.onClick ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons white bigger"
    }, "play_arrow") : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
      src: "img/broken_video.png",
      style: {
        filter: 'invert(100%)'
      },
      width: "36",
      height: "36"
    })), duration ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "duration"
    }, duration) : null);
  }
}
;

/***/ }),

/***/ "./src/widgets/invitation.jsx":
/*!************************************!*\
  !*** ./src/widgets/invitation.jsx ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Invitation)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);


class Invitation extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.handleButtonAction = this.handleButtonAction.bind(this);
  }
  handleButtonAction(evt, data) {
    evt.preventDefault();
    this.props.onAction(data);
  }
  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "accept-invite-panel"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "title"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "chat_invitation",
      defaultMessage: [{
        "type": 0,
        "value": "You are invited to start a new chat. What would you like to do?"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "footer"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      className: "primary",
      onClick: event => {
        this.handleButtonAction(event, "accept");
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "chat_invitation_accept",
      defaultMessage: [{
        "type": 0,
        "value": "Accept"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      className: "secondary",
      onClick: event => {
        this.handleButtonAction(event, "delete");
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "chat_invitation_ignore",
      defaultMessage: [{
        "type": 0,
        "value": "Ignore"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      className: "secondary",
      onClick: event => {
        this.handleButtonAction(event, "block");
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "chat_invitation_block",
      defaultMessage: [{
        "type": 0,
        "value": "Block"
      }]
    }))));
  }
}
;

/***/ }),

/***/ "./src/widgets/lazy-image.jsx":
/*!************************************!*\
  !*** ./src/widgets/lazy-image.jsx ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LazyImage)
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LetterTile)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");




class LetterTile extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    let avatar;
    if (this.props.avatar === true) {
      const isGroup = tinode_sdk__WEBPACK_IMPORTED_MODULE_1__.Tinode.isGroupTopicName(this.props.topic);
      const iconColor = (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_2__.idToColorClass)(this.props.topic, isGroup);
      if (this.props.topic && this.props.title && this.props.title.trim()) {
        const letter = this.props.title.trim().charAt(0);
        const className = 'lettertile ' + iconColor + (this.props.deleted ? ' disabled' : '');
        avatar = react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
          className: className
        }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, letter));
      } else {
        const className = 'material-icons ' + iconColor + (this.props.deleted ? ' disabled' : '');
        avatar = isGroup ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
          className: className
        }, "group") : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
          className: className
        }, "person");
      }
    } else if (this.props.avatar) {
      const url = this.props.tinode.authorizeURL((0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_3__.sanitizeUrlForMime)(this.props.avatar, 'image'));
      const className = 'avatar' + (this.props.deleted ? ' deleted' : '');
      avatar = react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
        className: className,
        alt: "avatar",
        src: url,
        onError: e => {
          e.target.onerror = null;
          e.target.src = "../img/broken_image.png";
        }
      });
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LoadSpinner)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

class LoadSpinner extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    const className = 'load-spinner-box' + (this.props.large ? ' large' : '') + (this.props.clear ? ' clear' : '') + (this.props.centered ? ' centered' : '');
    return this.props.show ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: className
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "loader-spinner"
    })) : null;
  }
}

/***/ }),

/***/ "./src/widgets/menu-cancel.jsx":
/*!*************************************!*\
  !*** ./src/widgets/menu-cancel.jsx ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MenuCancel)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

class MenuCancel extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: e => {
        e.preventDefault();
        this.props.onCancel();
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "close"));
  }
}

/***/ }),

/***/ "./src/widgets/menu-contacts.jsx":
/*!***************************************!*\
  !*** ./src/widgets/menu-contacts.jsx ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MenuContacts)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

class MenuContacts extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: e => {
        e.preventDefault();
        this.props.onNewTopic();
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "chat")), "\xA0", react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: e => {
        e.preventDefault();
        this.props.onSettings();
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "settings")));
  }
}
;

/***/ }),

/***/ "./src/widgets/menu-start.jsx":
/*!************************************!*\
  !*** ./src/widgets/menu-start.jsx ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MenuStart)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

class MenuStart extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: e => {
        e.preventDefault();
        this.props.onSignUp();
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "person_add")), "\xA0", react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: e => {
        e.preventDefault();
        this.props.onSettings();
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "settings")));
  }
}
;

/***/ }),

/***/ "./src/widgets/meta-message.jsx":
/*!**************************************!*\
  !*** ./src/widgets/meta-message.jsx ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MetaMessage)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

class MetaMessage extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
  }
  render() {
    let content = null;
    let bubbleClass = 'bubble';
    if (this.props.date) {
      content = react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, this.props.date);
      bubbleClass += ' date';
    }
    if (!content) {
      return react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, null);
    }
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", {
      className: "meta"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: bubbleClass
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "message-content"
    }, content)));
  }
}
;

/***/ }),

/***/ "./src/widgets/new-topic-by-id.jsx":
/*!*****************************************!*\
  !*** ./src/widgets/new-topic-by-id.jsx ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var qrcodejs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! qrcodejs */ "qrcodejs");
/* harmony import */ var qrcodejs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(qrcodejs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config */ "./src/config.js");




const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_2__.defineMessages)({
  invalid_id: {
    id: "error_invalid_id",
    defaultMessage: [{
      "type": 0,
      "value": "Invalid ID"
    }]
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
    return react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
      className: "panel-form"
    }, react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_1___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_2__.FormattedMessage, {
      id: "group_user_id_prompt",
      defaultMessage: [{
        "type": 0,
        "value": "Group or User ID"
      }]
    }, prompt => react__WEBPACK_IMPORTED_MODULE_1___default().createElement("input", {
      type: "text",
      placeholder: prompt,
      value: this.state.groupId,
      onChange: this.handleChange,
      onKeyDown: this.handleKeyPress,
      required: true,
      autoFocus: true
    }))), react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
      className: "dialog-buttons"
    }, react__WEBPACK_IMPORTED_MODULE_1___default().createElement("button", {
      className: "primary",
      onClick: this.handleSubmit
    }, react__WEBPACK_IMPORTED_MODULE_1___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_2__.FormattedMessage, {
      id: "button_subscribe",
      defaultMessage: [{
        "type": 0,
        "value": "Subscribe"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_1___default().createElement("br", null), react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
      className: "panel-form-column"
    }, react__WEBPACK_IMPORTED_MODULE_1___default().createElement("label", {
      className: "small"
    }, "Scan my ID:"), react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
      className: "qr-code",
      ref: this.qrCodeRef
    })));
  }
}
;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_intl__WEBPACK_IMPORTED_MODULE_2__.injectIntl)(NewTopicById));

/***/ }),

/***/ "./src/widgets/new-topic-group.jsx":
/*!*****************************************!*\
  !*** ./src/widgets/new-topic-group.jsx ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ NewTopicGroup)
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
    const fn = this.state.fullName.trim().substring(0, _config_js__WEBPACK_IMPORTED_MODULE_6__.MAX_TITLE_LENGTH);
    const comment = this.state.private.trim().substring(0, _config_js__WEBPACK_IMPORTED_MODULE_6__.MAX_TITLE_LENGTH);
    const description = this.state.description.trim().substring(0, _config_js__WEBPACK_IMPORTED_MODULE_6__.MAX_TOPIC_DESCRIPTION_LENGTH);
    if (fn) {
      this.props.onSubmit(fn, description, this.state.imageUrl, comment, this.state.tags, this.state.isChannel);
    }
  }
  render() {
    if (this.state.newAvatar) {
      return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_avatar_crop_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
        avatar: this.state.newAvatar,
        mime: this.state.newAvatarMime,
        onSubmit: this.handleAvatarCropped,
        onCancel: this.handleAvatarCropCancel,
        onError: this.props.onError
      });
    }
    let submitClasses = 'primary';
    if (this.props.disabled) {
      submitClasses += ' disabled';
    }
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("form", {
      className: "panel-form",
      onSubmit: this.handleSubmit
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-column"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("center", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_avatar_upload_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
      tinode: this.props.tinode,
      avatar: this.state.imageUrl,
      onError: this.props.onError,
      onImageUpdated: this.handleImageChanged
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "group"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small",
      htmlFor: "new-topic-fn"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_topic_name",
      defaultMessage: [{
        "type": 0,
        "value": "Name"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "topic_name_editing_placeholder",
      defaultMessage: [{
        "type": 0,
        "value": "Freeform name of the group"
      }]
    }, placeholder => react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
      type: "text",
      id: "new-topic-fn",
      placeholder: placeholder,
      ref: this.fullName,
      value: this.state.fullName,
      onChange: this.handleFieldEdit.bind(this, 'fullName'),
      autoFocus: true,
      required: true,
      tabIndex: 0
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "group"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small",
      htmlFor: "new-topic-priv"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_private",
      defaultMessage: [{
        "type": 0,
        "value": "Private comment"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "private_editing_placeholder",
      defaultMessage: [{
        "type": 0,
        "value": "Visible to you only"
      }]
    }, placeholder => react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
      type: "text",
      id: "new-topic-priv",
      placeholder: placeholder,
      value: this.state.private,
      onChange: this.handleFieldEdit.bind(this, 'private'),
      tabIndex: 1
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "group"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small",
      htmlFor: "new-topic-desc"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_description",
      defaultMessage: [{
        "type": 0,
        "value": "Description"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "description_editing_placeholder",
      defaultMessage: [{
        "type": 0,
        "value": "Description (optional)"
      }]
    }, placeholder => react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
      type: "text",
      id: "new-topic-desc",
      placeholder: placeholder,
      value: this.state.description,
      onChange: this.handleFieldEdit.bind(this, 'description'),
      tabIndex: 2
    })))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_checkbox_jsx__WEBPACK_IMPORTED_MODULE_4__["default"], {
      checked: this.state.isChannel,
      tabIndex: 3,
      onChange: this.handleChannelToggle
    }), "\xA0", react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      onClick: this.handleChannelToggle
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "channel_prompt",
      defaultMessage: [{
        "type": 0,
        "value": "This is a channel"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "title_tag_manager",
      defaultMessage: [{
        "type": 0,
        "value": "Tags (search & discovery)"
      }]
    }, title => react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_tag_manager_jsx__WEBPACK_IMPORTED_MODULE_5__["default"], {
      tinode: this.props.tinode,
      tags: this.state.tags,
      activated: true,
      onTagsChanged: this.handleTagsChanged,
      tabIndex: 4,
      title: title
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "dialog-buttons"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      className: submitClasses
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "button_create",
      defaultMessage: [{
        "type": 0,
        "value": "Create"
      }]
    }))));
  }
}
;

/***/ }),

/***/ "./src/widgets/permissions-editor.jsx":
/*!********************************************!*\
  !*** ./src/widgets/permissions-editor.jsx ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _checkbox_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./checkbox.jsx */ "./src/widgets/checkbox.jsx");
/* harmony import */ var _contact_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./contact.jsx */ "./src/widgets/contact.jsx");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");





const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  joiner: {
    id: "permission_join",
    defaultMessage: [{
      "type": 0,
      "value": "Join ("
    }, {
      "type": 1,
      "value": "val"
    }, {
      "type": 0,
      "value": ")"
    }]
  },
  reader: {
    id: "permission_read",
    defaultMessage: [{
      "type": 0,
      "value": "Read ("
    }, {
      "type": 1,
      "value": "val"
    }, {
      "type": 0,
      "value": ")"
    }]
  },
  writer: {
    id: "permission_write",
    defaultMessage: [{
      "type": 0,
      "value": "Write ("
    }, {
      "type": 1,
      "value": "val"
    }, {
      "type": 0,
      "value": ")"
    }]
  },
  preser: {
    id: "permission_pres",
    defaultMessage: [{
      "type": 0,
      "value": "Get notified ("
    }, {
      "type": 1,
      "value": "val"
    }, {
      "type": 0,
      "value": ")"
    }]
  },
  approver: {
    id: "permission_admin",
    defaultMessage: [{
      "type": 0,
      "value": "Approve ("
    }, {
      "type": 1,
      "value": "val"
    }, {
      "type": 0,
      "value": ")"
    }]
  },
  sharer: {
    id: "permission_share",
    defaultMessage: [{
      "type": 0,
      "value": "Share ("
    }, {
      "type": 1,
      "value": "val"
    }, {
      "type": 0,
      "value": ")"
    }]
  },
  deleter: {
    id: "permission_delete",
    defaultMessage: [{
      "type": 0,
      "value": "Delete ("
    }, {
      "type": 1,
      "value": "val"
    }, {
      "type": 0,
      "value": ")"
    }]
  },
  owner: {
    id: "permission_owner",
    defaultMessage: [{
      "type": 0,
      "value": "Owner ("
    }, {
      "type": 1,
      "value": "val"
    }, {
      "type": 0,
      "value": ")"
    }]
  }
});
class PermissionsEditor extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    this.state = {
      mode: (props.mode || '').replace('N', '')
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }
  handleChange(val) {
    let mode = this.state.mode;
    const idx = mode.indexOf(val);
    if (idx == -1) {
      mode += val;
    } else {
      mode = mode.replace(val, '');
    }
    this.setState({
      mode: mode
    });
  }
  handleSubmit() {
    const mode = (this.state.mode || 'N').split('').sort().join('');
    const before = (this.props.mode || 'N').split('').sort().join('');
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
    const {
      formatMessage
    } = this.props.intl;
    const all = 'JRWPASDO';
    const names = {
      'J': formatMessage(messages.joiner, {
        val: 'J'
      }),
      'R': formatMessage(messages.reader, {
        val: 'R'
      }),
      'W': formatMessage(messages.writer, {
        val: 'W'
      }),
      'P': formatMessage(messages.preser, {
        val: 'P'
      }),
      'A': formatMessage(messages.approver, {
        val: 'A'
      }),
      'S': formatMessage(messages.sharer, {
        val: 'S'
      }),
      'D': formatMessage(messages.deleter, {
        val: 'D'
      }),
      'O': formatMessage(messages.owner, {
        val: 'O'
      })
    };
    let skip = this.props.skip || '';
    let mode = this.state.mode;
    let compare = (this.props.compare || '').replace('N', '');
    let items = [];
    for (let i = 0; i < all.length; i++) {
      let c = all.charAt(i);
      if (skip.indexOf(c) >= 0 && mode.indexOf(c) < 0) {
        continue;
      }
      items.push(react__WEBPACK_IMPORTED_MODULE_0___default().createElement("tr", {
        key: c
      }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("td", null, names[c]), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("td", {
        className: "checkbox"
      }, skip.indexOf(c) < 0 ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_checkbox_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
        name: c,
        checked: mode.indexOf(c) >= 0,
        onChange: this.handleChange
      }) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_checkbox_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
        name: c,
        checked: mode.indexOf(c) >= 0
      })), this.props.compare ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("td", {
        className: "checkbox"
      }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_checkbox_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
        name: c,
        checked: compare.indexOf(c) >= 0
      })) : null));
    }
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-column"
    }, this.props.userTitle ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("ul", {
      className: "contact-box small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_contact_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
      tinode: this.props.tinode,
      item: this.props.item,
      title: this.props.userTitle,
      small: true,
      avatar: (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_4__.makeImageUrl)(this.props.userAvatar ? this.props.userAvatar : null)
    })) : null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "title_permissions",
      defaultMessage: [{
        "type": 0,
        "value": "Permissions"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("table", {
      className: "permission-editor"
    }, this.props.compare ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("thead", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("tr", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("th", null), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("th", null, this.props.modeTitle), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("th", null, this.props.compareTitle))) : null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("tbody", null, items)), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("br", null), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "dialog-buttons"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      className: "outline",
      onClick: this.handleCancel
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "button_cancel",
      defaultMessage: [{
        "type": 0,
        "value": "Cancel"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      className: "primary",
      onClick: this.handleSubmit
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "button_ok",
      defaultMessage: [{
        "type": 0,
        "value": "OK"
      }]
    }))));
  }
}
;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(PermissionsEditor));

/***/ }),

/***/ "./src/widgets/received-marker.jsx":
/*!*****************************************!*\
  !*** ./src/widgets/received-marker.jsx ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");




const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  message_sending: {
    id: "message_sending",
    defaultMessage: [{
      "type": 0,
      "value": "sending..."
    }]
  },
  message_sending_failed: {
    id: "message_sending_failed",
    defaultMessage: [{
      "type": 0,
      "value": "failed"
    }]
  },
  message_edited_marker: {
    id: "message_edited_marker",
    defaultMessage: [{
      "type": 0,
      "value": ", edited"
    }]
  }
});
class ReceivedMarker extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    const {
      formatMessage
    } = this.props.intl;
    let timestamp;
    if (this.props.received <= tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.MESSAGE_STATUS_SENDING) {
      timestamp = formatMessage(messages.message_sending);
    } else if (this.props.received == tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.MESSAGE_STATUS_FAILED || this.props.received == tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.MESSAGE_STATUS_FATAL) {
      timestamp = formatMessage(messages.message_sending_failed);
    } else {
      timestamp = this.props.timestamp.toLocaleTimeString(this.props.intl.locale, {
        timeStyle: 'short'
      });
    }
    const icon = (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_3__.deliveryMarker)(this.props.received);
    const marker = icon ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: 'material-icons small ' + icon.color
    }, icon.name) : null;
    const edited = this.props.edited ? formatMessage(messages.message_edited_marker) : null;
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
      className: "timestamp"
    }, timestamp, edited, '\u00a0', marker);
  }
}
;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(ReceivedMarker));

/***/ }),

/***/ "./src/widgets/search-contacts.jsx":
/*!*****************************************!*\
  !*** ./src/widgets/search-contacts.jsx ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SearchContacts)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_1__);


class SearchContacts extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.state = {
      edited: false,
      search: ''
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
      this.handleClear();
    }
  }
  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons search"
    }, "search"), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
      className: "search",
      type: "text",
      placeholder: this.props.placeholder,
      value: this.state.search,
      onChange: this.handleSearchChange,
      onKeyDown: this.handleKeyDown,
      required: true,
      autoFocus: true
    }), this.state.search ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: this.handleClear
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "highlight_off")) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "\xA0"))));
  }
}
;

/***/ }),

/***/ "./src/widgets/send-message.jsx":
/*!**************************************!*\
  !*** ./src/widgets/send-message.jsx ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
/* harmony import */ var _lib_formatters_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../lib/formatters.js */ "./src/lib/formatters.js");



const AudioRecorder = react__WEBPACK_IMPORTED_MODULE_0___default().lazy(_ => Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_webm-duration-fix_lib_index_js"), __webpack_require__.e("src_widgets_audio-recorder_jsx")]).then(__webpack_require__.bind(__webpack_require__, /*! ./audio-recorder.jsx */ "./src/widgets/audio-recorder.jsx")));



const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  messaging_disabled: {
    id: "messaging_disabled_prompt",
    defaultMessage: [{
      "type": 0,
      "value": "Messaging disabled"
    }]
  },
  type_new_message: {
    id: "new_message_prompt",
    defaultMessage: [{
      "type": 0,
      "value": "New message"
    }]
  },
  add_image_caption: {
    id: "image_caption_prompt",
    defaultMessage: [{
      "type": 0,
      "value": "Image caption"
    }]
  },
  file_attachment_too_large: {
    id: "file_attachment_too_large",
    defaultMessage: [{
      "type": 0,
      "value": "The file size "
    }, {
      "type": 1,
      "value": "size"
    }, {
      "type": 0,
      "value": " exceeds the "
    }, {
      "type": 1,
      "value": "limit"
    }, {
      "type": 0,
      "value": " limit."
    }]
  },
  cannot_initiate_upload: {
    id: "cannot_initiate_file_upload",
    defaultMessage: [{
      "type": 0,
      "value": "Cannot initiate file upload."
    }]
  },
  icon_title_record_voice: {
    id: "icon_title_record_voice",
    defaultMessage: [{
      "type": 0,
      "value": "Record voice message"
    }]
  },
  icon_title_attach_file: {
    id: "icon_title_attach_file",
    defaultMessage: [{
      "type": 0,
      "value": "Attach file"
    }]
  },
  icon_title_add_image: {
    id: "icon_title_add_image",
    defaultMessage: [{
      "type": 0,
      "value": "Add image"
    }]
  },
  icon_title_send: {
    id: "icon_title_send",
    defaultMessage: [{
      "type": 0,
      "value": "Send message"
    }]
  }
});
class SendMessage extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.state = {
      quote: null,
      message: '',
      audioRec: false,
      audioAvailable: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
    };
    this.keypressTimestamp = 0;
    this.handlePasteEvent = this.handlePasteEvent.bind(this);
    this.handleAttachImage = this.handleAttachImage.bind(this);
    this.handleAttachFile = this.handleAttachFile.bind(this);
    this.handleAttachAudio = this.handleAttachAudio.bind(this);
    this.handleSend = this.handleSend.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleMessageTyping = this.handleMessageTyping.bind(this);
    this.handleDropAttach = this.handleDropAttach.bind(this);
    this.handleQuoteClick = this.handleQuoteClick.bind(this);
    this.formatReply = this.formatReply.bind(this);
  }
  componentDidMount() {
    if (this.messageEditArea) {
      this.messageEditArea.addEventListener('paste', this.handlePasteEvent, false);
      if (window.getComputedStyle(this.messageEditArea).getPropertyValue('transition-property') == 'all') {
        this.messageEditArea.focus();
      }
    }
    this.setState({
      quote: this.formatReply()
    });
  }
  componentWillUnmount() {
    if (this.messageEditArea) {
      this.messageEditArea.removeEventListener('paste', this.handlePasteEvent, false);
    }
  }
  componentDidUpdate(prevProps) {
    if (this.messageEditArea) {
      if (window.getComputedStyle(this.messageEditArea).getPropertyValue('transition-property') == 'all') {
        this.messageEditArea.focus();
      }
      this.messageEditArea.style.height = '0px';
      this.messageEditArea.style.height = this.messageEditArea.scrollHeight + 'px';
    }
    if (prevProps.topicName != this.props.topicName) {
      this.setState({
        message: this.props.initMessage || '',
        audioRec: false,
        quote: null
      });
    } else if (prevProps.initMessage != this.props.initMessage) {
      const msg = this.props.initMessage || '';
      this.setState({
        message: msg
      }, _ => {
        this.messageEditArea.scrollTop = this.messageEditArea.scrollHeight;
        this.messageEditArea.setSelectionRange(msg.length, msg.length);
      });
    }
    if (prevProps.reply != this.props.reply) {
      this.setState({
        quote: this.formatReply()
      });
    }
  }
  formatReply() {
    return this.props.reply ? tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Drafty.format(this.props.reply.content, _lib_formatters_js__WEBPACK_IMPORTED_MODULE_5__.replyFormatter, {
      formatMessage: this.props.intl.formatMessage.bind(this.props.intl),
      authorizeURL: this.props.tinode.authorizeURL.bind(this.props.tinode)
    }) : null;
  }
  handlePasteEvent(e) {
    if (this.props.disabled) {
      return;
    }
    if ((0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_4__.filePasted)(e, file => {
      this.props.onAttachImage(file);
    }, file => {
      this.props.onAttachFile(file);
    }, this.props.onError)) {
      e.preventDefault();
    }
  }
  handleAttachImage(e) {
    if (e.target.files && e.target.files.length > 0) {
      this.props.onAttachImage(e.target.files[0]);
    }
    e.target.value = '';
  }
  handleAttachFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      this.props.onAttachFile(e.target.files[0]);
    }
    e.target.value = '';
  }
  handleDropAttach(files) {
    if (files && files.length > 0) {
      this.props.onAttachFile(files[0]);
    }
  }
  handleAttachAudio(url, preview, duration) {
    this.setState({
      audioRec: false
    });
    this.props.onAttachAudio(url, preview, duration);
  }
  handleSend(e) {
    e.preventDefault();
    const message = this.state.message.trim();
    if (message || this.props.acceptBlank || this.props.noInput) {
      this.props.onSendMessage(message);
      this.setState({
        message: ''
      });
    }
  }
  handleKeyPress(e) {
    if (this.state.audioRec) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (e.key === 'Enter') {
      if (!e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        this.handleSend(e);
      }
    }
  }
  handleMessageTyping(e) {
    this.setState({
      message: e.target.value
    });
    if (this.props.onKeyPress) {
      const now = new Date().getTime();
      if (now - this.keypressTimestamp > _config_js__WEBPACK_IMPORTED_MODULE_3__.KEYPRESS_DELAY) {
        this.props.onKeyPress();
        this.keypressTimestamp = now;
      }
    }
  }
  handleQuoteClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (this.props.reply && this.props.onQuoteClick) {
      const replyToSeq = this.props.reply.seq;
      this.props.onQuoteClick(replyToSeq);
    }
  }
  render() {
    const {
      formatMessage
    } = this.props.intl;
    const prompt = this.props.disabled ? formatMessage(messages.messaging_disabled) : this.props.messagePrompt ? formatMessage(messages[this.props.messagePrompt]) : formatMessage(messages.type_new_message);
    const sendIcon = this.props.reply && this.props.reply.editing ? 'check_circle' : 'send';
    const quote = this.state.quote ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "reply-quote-preview"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "cancel"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: e => {
        e.preventDefault();
        this.props.onCancelReply();
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons gray"
    }, "close"))), this.state.quote) : null;
    const audioEnabled = this.state.audioAvailable && this.props.onAttachAudio;
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "send-message-wrapper"
    }, !this.props.noInput ? quote : null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "send-message-panel"
    }, !this.props.disabled ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, this.props.onAttachFile && !this.state.audioRec ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: e => {
        e.preventDefault();
        this.attachImage.click();
      },
      title: formatMessage(messages.icon_title_add_image)
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons secondary"
    }, "photo")), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: e => {
        e.preventDefault();
        this.attachFile.click();
      },
      title: formatMessage(messages.icon_title_attach_file)
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons secondary"
    }, "attach_file"))) : null, this.props.noInput ? quote || react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "hr thin"
    }) : this.state.audioRec ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react__WEBPACK_IMPORTED_MODULE_0__.Suspense, {
      fallback: react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
        id: "loading_note",
        defaultMessage: [{
          "type": 0,
          "value": "Loading..."
        }]
      }))
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(AudioRecorder, {
      onRecordingProgress: _ => this.props.onKeyPress(true),
      onDeleted: _ => this.setState({
        audioRec: false
      }),
      onFinished: this.handleAttachAudio
    })) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("textarea", {
      id: "send-message-input",
      placeholder: prompt,
      value: this.state.message,
      onChange: this.handleMessageTyping,
      onKeyDown: this.handleKeyPress,
      ref: ref => {
        this.messageEditArea = ref;
      }
    }), this.state.message || !audioEnabled ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: this.handleSend,
      title: formatMessage(messages.icon_title_send)
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, sendIcon)) : !this.state.audioRec ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: e => {
        e.preventDefault();
        this.setState({
          audioRec: true
        });
      },
      title: formatMessage(messages.icon_title_record_voice)
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "mic")) : null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
      type: "file",
      ref: ref => {
        this.attachFile = ref;
      },
      onChange: this.handleAttachFile,
      style: {
        display: 'none'
      }
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
      type: "file",
      ref: ref => {
        this.attachImage = ref;
      },
      accept: "image/*, video/*",
      onChange: this.handleAttachImage,
      style: {
        display: 'none'
      }
    })) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "writing-disabled"
    }, prompt)));
  }
}
;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(SendMessage));

/***/ }),

/***/ "./src/widgets/show-qrcode.jsx":
/*!*************************************!*\
  !*** ./src/widgets/show-qrcode.jsx ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ShowQRCode)
/* harmony export */ });
/* harmony import */ var qrcodejs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! qrcodejs */ "qrcodejs");
/* harmony import */ var qrcodejs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(qrcodejs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config */ "./src/config.js");




class ShowQRCode extends (react__WEBPACK_IMPORTED_MODULE_1___default().PureComponent) {
  constructor(props) {
    super(props);
    this.qrCodeRef = react__WEBPACK_IMPORTED_MODULE_1___default().createRef();
  }
  componentDidMount() {
    new (qrcodejs__WEBPACK_IMPORTED_MODULE_0___default())(this.qrCodeRef.current, {
      text: this.props.uri,
      width: _config__WEBPACK_IMPORTED_MODULE_3__.QRCODE_SIZE,
      height: _config__WEBPACK_IMPORTED_MODULE_3__.QRCODE_SIZE
    });
  }
  render() {
    return react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
      className: "panel-form-column"
    }, react__WEBPACK_IMPORTED_MODULE_1___default().createElement("br", null), react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
      className: "qr-code",
      ref: this.qrCodeRef
    }), react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
      className: "dialog-buttons"
    }, react__WEBPACK_IMPORTED_MODULE_1___default().createElement("button", {
      className: "outline",
      onClick: this.props.onCancel
    }, react__WEBPACK_IMPORTED_MODULE_1___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_2__.FormattedMessage, {
      id: "button_ok",
      defaultMessage: [{
        "type": 0,
        "value": "OK"
      }]
    }))));
  }
}
;

/***/ }),

/***/ "./src/widgets/side-navbar.jsx":
/*!*************************************!*\
  !*** ./src/widgets/side-navbar.jsx ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SideNavbar)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _letter_tile_jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./letter-tile.jsx */ "./src/widgets/letter-tile.jsx");
/* harmony import */ var _button_back_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./button-back.jsx */ "./src/widgets/button-back.jsx");
/* harmony import */ var _contact_badges_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./contact-badges.jsx */ "./src/widgets/contact-badges.jsx");
/* harmony import */ var _menu_contacts_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./menu-contacts.jsx */ "./src/widgets/menu-contacts.jsx");
/* harmony import */ var _menu_start_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./menu-start.jsx */ "./src/widgets/menu-start.jsx");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");







class SideNavbar extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    const icon_badges = [];
    if (this.props.trustedBadges) {
      this.props.trustedBadges.map(b => {
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
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "side-caption-panel",
      className: "caption-panel"
    }, this.props.onCancel ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_button_back_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
      onBack: this.props.onCancel
    }) : null, avatar ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "self-avatar",
      className: "avatar-box"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_letter_tile_jsx__WEBPACK_IMPORTED_MODULE_1__["default"], {
      tinode: this.props.tinode,
      avatar: avatar,
      topic: this.props.myUserId,
      title: this.props.title
    })) : null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "sidepanel-title",
      className: "panel-title"
    }, this.props.title, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_contact_badges_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
      badges: icon_badges
    })), this.props.state === 'login' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_menu_start_jsx__WEBPACK_IMPORTED_MODULE_5__["default"], {
      onSignUp: this.props.onSignUp,
      onSettings: this.props.onSettings
    }) : this.props.state === 'contacts' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_menu_contacts_jsx__WEBPACK_IMPORTED_MODULE_4__["default"], {
      onNewTopic: this.props.onNewTopic,
      onSettings: this.props.onSettings
    }) : null);
  }
}
;

/***/ }),

/***/ "./src/widgets/tag-manager.jsx":
/*!*************************************!*\
  !*** ./src/widgets/tag-manager.jsx ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TagManager)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _chip_input_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./chip-input.jsx */ "./src/widgets/chip-input.jsx");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");





class TagManager extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    this.state = {
      tags: this.props.tags || [],
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
    if (!(0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_4__.arrayEqual)(tags, prevState.tags) && !prevState.activated) {
      return {
        tags: tags
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
    const maxTagCount = this.props.tinode.getServerParam('maxTagCount', _config_js__WEBPACK_IMPORTED_MODULE_3__.MAX_TAG_COUNT);
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
    this.props.onSubmit(this.handleAddTag(this.state.tagInput.trim()));
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
    const minTagLength = this.props.tinode.getServerParam('minTagLength', _config_js__WEBPACK_IMPORTED_MODULE_3__.MIN_TAG_LENGTH);
    const maxTagLength = this.props.tinode.getServerParam('maxTagLength', _config_js__WEBPACK_IMPORTED_MODULE_3__.MAX_TAG_LENGTH);
    let tags = [];
    if (this.state.activated) {
      this.state.tags.map(tag => {
        tags.push({
          user: tag,
          invalid: tag.length < minTagLength || tag.length > maxTagLength
        });
      });
    } else {
      this.state.tags.map(tag => {
        tags.push(react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
          className: "badge",
          key: tags.length
        }, tag));
      });
      if (tags.length == 0) {
        tags = react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
          id: "tags_not_found",
          defaultMessage: [{
            "type": 0,
            "value": "No tags defined. Add some."
          }]
        }));
      }
    }
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-column"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, this.props.title)), this.state.activated ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "tags_editor_no_tags",
      defaultMessage: [{
        "type": 0,
        "value": "Add some tags"
      }]
    }, add_tags_prompt => react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_chip_input_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
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
    })), this.props.onSubmit || this.props.onCancel ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "tag-manager-buttons",
      className: "dialog-buttons panel-form-row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      className: "outline",
      onClick: this.handleCancel
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "button_cancel",
      defaultMessage: [{
        "type": 0,
        "value": "Cancel"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      className: "primary",
      onClick: this.handleSubmit
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "button_ok",
      defaultMessage: [{
        "type": 0,
        "value": "OK"
      }]
    }))) : null) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "quoted"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      className: "flat-button",
      onClick: e => {
        e.preventDefault();
        this.setState({
          activated: true
        });
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "edit"), " \xA0", react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "title_manage_tags",
      defaultMessage: [{
        "type": 0,
        "value": "Manage"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, tags)));
  }
}
;

/***/ }),

/***/ "./src/widgets/topic-desc-edit.jsx":
/*!*****************************************!*\
  !*** ./src/widgets/topic-desc-edit.jsx ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TopicDescEdit)
/* harmony export */ });
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
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");










class TopicDescEdit extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor(props) {
    super(props);
    const topic = this.props.tinode.getTopic(this.props.topic);
    const acs = topic.getAccessMode();
    this.state = {
      isMe: tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.isMeTopicName(this.props.topic),
      owner: acs && acs.isOwner(),
      fullName: topic.public ? topic.public.fn : undefined,
      private: topic.private ? topic.private.comment : null,
      description: topic.public ? topic.public.note : undefined,
      avatar: (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_8__.makeImageUrl)(topic.public ? topic.public.photo : null),
      tags: topic.tags() || [],
      newAvatar: null,
      newAvatarMime: null
    };
    this.previousOnTags = null;
    this.tnNewTags = this.tnNewTags.bind(this);
    this.handleFullNameUpdate = this.handleFullNameUpdate.bind(this);
    this.handleImageUpdated = this.handleImageUpdated.bind(this);
    this.handleAvatarCropped = this.handleAvatarCropped.bind(this);
    this.handleAvatarCropCancel = this.handleAvatarCropCancel.bind(this);
    this.uploadAvatar = this.uploadAvatar.bind(this);
    this.handlePrivateUpdate = this.handlePrivateUpdate.bind(this);
    this.handleDescriptionUpdate = this.handleDescriptionUpdate.bind(this);
    this.handleTagsUpdated = this.handleTagsUpdated.bind(this);
  }
  componentDidMount() {
    const topic = this.props.tinode.getTopic(this.props.topic);
    this.previousOnTags = topic.onTagsUpdated;
    topic.onTagsUpdated = this.tnNewTags;
  }
  componentWillUnmount() {
    const topic = this.props.tinode.getTopic(this.props.topic);
    topic.onTagsUpdated = this.previousOnTags;
  }
  tnNewTags(tags) {
    this.setState({
      tags: tags
    });
  }
  handleFullNameUpdate(fn) {
    fn = fn.trim().substring(0, _config_js__WEBPACK_IMPORTED_MODULE_7__.MAX_TITLE_LENGTH);
    if (fn && this.state.fullName !== fn) {
      this.setState({
        fullName: fn
      });
      this.props.onUpdateTopicDesc(this.props.topic, (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_9__.theCard)(fn, null));
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
      this.props.onUpdateTopicDesc(this.props.topic, (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_9__.theCard)(null, null, null, desc));
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
      this.props.onUpdateTopicDesc(this.props.topic, (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_9__.theCard)(null, tinode_sdk__WEBPACK_IMPORTED_MODULE_2__.Tinode.DEL_CHAR));
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
        uploader.upload(blob).then(url => this.props.onUpdateTopicDesc(this.props.topic, (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_9__.theCard)(null, url))).catch(err => this.props.onError(err.message, 'err'));
      } else {
        (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_8__.blobToBase64)(blob).then(b64 => {
          const du = (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_8__.makeImageUrl)({
            data: b64.bits,
            type: mime
          });
          this.setState({
            source: du
          });
          this.props.onUpdateTopicDesc(this.props.topic, (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_9__.theCard)(null, du));
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
  handleTagsUpdated(tags) {
    if ((0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_9__.arrayEqual)(this.state.tags.slice(0), tags.slice(0))) {
      return;
    }
    this.props.onUpdateTags(tags);
  }
  render() {
    if (this.state.newAvatar) {
      return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_avatar_crop_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
        avatar: this.state.newAvatar,
        mime: this.state.newAvatarMime,
        onSubmit: this.handleAvatarCropped,
        onCancel: this.handleAvatarCropCancel,
        onError: this.props.onError
      });
    }
    const editable = this.state.isMe || this.state.owner;
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-column"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("center", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_avatar_upload_jsx__WEBPACK_IMPORTED_MODULE_4__["default"], {
      tinode: this.props.tinode,
      avatar: this.state.avatar,
      readOnly: !editable,
      uid: this.props.topic,
      title: this.state.fullName,
      onImageUpdated: this.handleImageUpdated,
      onError: this.props.onError
    })), this.state.isMe ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "group"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_your_name",
      defaultMessage: [{
        "type": 0,
        "value": "Your name"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "full_name_prompt",
      defaultMessage: [{
        "type": 0,
        "value": "Full name, e.g. John Doe"
      }]
    }, full_name_placeholder => react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_in_place_edit_jsx__WEBPACK_IMPORTED_MODULE_5__["default"], {
      placeholder: full_name_placeholder,
      value: this.state.fullName,
      required: true,
      onFinished: this.handleFullNameUpdate
    })))) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "group"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_topic_name",
      defaultMessage: [{
        "type": 0,
        "value": "Name"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "topic_name_editing_placeholder",
      defaultMessage: [{
        "type": 0,
        "value": "Freeform name of the group"
      }]
    }, group_name_placeholder => react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_in_place_edit_jsx__WEBPACK_IMPORTED_MODULE_5__["default"], {
      placeholder: group_name_placeholder,
      readOnly: !editable,
      value: this.state.fullName,
      required: true,
      onFinished: this.handleFullNameUpdate
    })))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "group"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_private",
      defaultMessage: [{
        "type": 0,
        "value": "Private comment"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "private_editing_placeholder",
      defaultMessage: [{
        "type": 0,
        "value": "Visible to you only"
      }]
    }, private_placeholder => react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_in_place_edit_jsx__WEBPACK_IMPORTED_MODULE_5__["default"], {
      placeholder: private_placeholder,
      value: this.state.private,
      onFinished: this.handlePrivateUpdate
    }))))), editable || this.state.description ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "group"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_description",
      defaultMessage: [{
        "type": 0,
        "value": "Description"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "description_editing_placeholder",
      defaultMessage: [{
        "type": 0,
        "value": "Description (optional)"
      }]
    }, private_placeholder => react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_in_place_edit_jsx__WEBPACK_IMPORTED_MODULE_5__["default"], {
      placeholder: private_placeholder,
      readOnly: !editable,
      value: this.state.description,
      multiline: 2,
      onFinished: this.handleDescriptionUpdate
    })))) : null), editable ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "hr"
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "title_tag_manager",
      defaultMessage: [{
        "type": 0,
        "value": "Tags (search & discovery)"
      }]
    }, title_tag_manager => react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_tag_manager_jsx__WEBPACK_IMPORTED_MODULE_6__["default"], {
      tinode: this.props.tinode,
      title: title_tag_manager,
      activated: false,
      tags: this.state.tags,
      onSubmit: this.handleTagsUpdated
    }))) : null);
  }
}
;

/***/ }),

/***/ "./src/widgets/topic-security.jsx":
/*!****************************************!*\
  !*** ./src/widgets/topic-security.jsx ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);


const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  clear_messages: {
    id: "action_clear_messages",
    defaultMessage: [{
      "type": 0,
      "value": "Clear Messages"
    }]
  },
  clear_messages_warning: {
    id: "clear_messages_warning",
    defaultMessage: [{
      "type": 0,
      "value": "Are you sure you want to clear all messages? It cannot be undone."
    }]
  },
  delete_messages: {
    id: "action_delete_messages",
    defaultMessage: [{
      "type": 0,
      "value": "Clear Messages for All"
    }]
  },
  delete_messages_warning: {
    id: "delete_messages_warning",
    defaultMessage: [{
      "type": 0,
      "value": "Are you sure you want to delete all messages for everyone? It cannot be undone."
    }]
  },
  topic_delete: {
    id: "topic_delete",
    defaultMessage: [{
      "type": 0,
      "value": "Delete Conversation"
    }]
  },
  topic_delete_warning: {
    id: "topic_delete_warning",
    defaultMessage: [{
      "type": 0,
      "value": "Are you sure you want to delete this conversation? It cannot be undone."
    }]
  },
  leave_chat: {
    id: "action_leave_chat",
    defaultMessage: [{
      "type": 0,
      "value": "Leave Conversation"
    }]
  },
  leave_chat_warning: {
    id: "leave_chat_warning",
    defaultMessage: [{
      "type": 0,
      "value": "Are you sure you want to leave this conversation?"
    }]
  },
  block_contact: {
    id: "action_block_contact",
    defaultMessage: [{
      "type": 0,
      "value": "Block Contact"
    }]
  },
  block_contact_warning: {
    id: "block_contact_warning",
    defaultMessage: [{
      "type": 0,
      "value": "Are you sure you want to block this contact?"
    }]
  },
  report_chat: {
    id: "action_report_chat",
    defaultMessage: [{
      "type": 0,
      "value": "Report Conversation"
    }]
  },
  report_chat_warning: {
    id: "report_chat_warning",
    defaultMessage: [{
      "type": 0,
      "value": "Are you sure you want to block and report this conversation?"
    }]
  },
  other_user: {
    id: "label_other_user",
    defaultMessage: [{
      "type": 0,
      "value": "Other"
    }]
  }
});
class TopicSecurity extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.handleDeleteTopic = this.handleDeleteTopic.bind(this);
    this.handleDeleteMessages = this.handleDeleteMessages.bind(this);
    this.handleLeave = this.handleLeave.bind(this);
    this.handleBlock = this.handleBlock.bind(this);
    this.handleReport = this.handleReport.bind(this);
  }
  handleDeleteTopic(e) {
    e.preventDefault();
    const {
      formatMessage
    } = this.props.intl;
    this.props.onShowAlert(formatMessage(messages.topic_delete), formatMessage(messages.topic_delete_warning), _ => this.props.onDeleteTopic(this.props.topic), null, true, null);
  }
  handleDeleteMessages(e) {
    e.preventDefault();
    const {
      formatMessage
    } = this.props.intl;
    this.props.onShowAlert(formatMessage(this.props.deleter ? messages.delete_messages : messages.clear_messages), formatMessage(this.props.deleter ? messages.delete_messages_warning : messages.clear_messages_warning), _ => this.props.onDeleteMessages(this.props.topic), null, true, null);
  }
  handleLeave(e) {
    e.preventDefault();
    const {
      formatMessage
    } = this.props.intl;
    this.props.onShowAlert(formatMessage(messages.leave_chat), formatMessage(messages.leave_chat_warning), _ => this.props.onLeaveTopic(this.props.topic), null, true, null);
  }
  handleBlock(e) {
    e.preventDefault();
    const {
      formatMessage
    } = this.props.intl;
    this.props.onShowAlert(formatMessage(messages.block_contact), formatMessage(messages.block_contact_warning), _ => this.props.onBlockTopic(this.props.topic), null, true, null);
  }
  handleReport(e) {
    e.preventDefault();
    const {
      formatMessage
    } = this.props.intl;
    this.props.onShowAlert(formatMessage(messages.report_chat), formatMessage(messages.report_chat_warning), _ => {
      this.props.onReportTopic(this.props.topic);
    }, null, true, null);
  }
  render() {
    const {
      formatMessage
    } = this.props.intl;
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "scrollable-panel"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-column"
    }, !this.props.channel ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      className: "flat-button",
      onClick: this.handleDeleteMessages
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "delete_outline"), " \xA0", formatMessage(this.props.deleter ? messages.delete_messages : messages.clear_messages)) : null, this.props.owner ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      className: "danger flat-button",
      onClick: this.handleDeleteTopic
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "delete"), " \xA0", formatMessage(messages.topic_delete)) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      className: "danger flat-button",
      onClick: this.handleLeave
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "exit_to_app"), " \xA0", formatMessage(messages.leave_chat)), !this.props.groupTopic ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      className: "danger flat-button",
      onClick: this.handleBlock
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "block"), " \xA0", formatMessage(messages.block_contact)) : null, !this.props.owner ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      className: "danger flat-button",
      onClick: this.handleReport
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons"
    }, "report"), " \xA0", formatMessage(messages.report_chat)) : null), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "hr"
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-column"
    }, this.props.groupTopic ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "group"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_your_permissions",
      defaultMessage: [{
        "type": 0,
        "value": "Your permissions:"
      }]
    })), " ", react__WEBPACK_IMPORTED_MODULE_0___default().createElement("tt", {
      className: "clickable",
      onClick: e => {
        e.preventDefault();
        this.props.onLaunchPermissionsEditor('want');
      }
    }, this.props.access)), !this.props.channel ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "group"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_default_access_mode",
      defaultMessage: [{
        "type": 0,
        "value": "Default access mode:"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "quoted"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, "Auth: ", react__WEBPACK_IMPORTED_MODULE_0___default().createElement("tt", {
      className: this.props.owner ? 'clickable' : null,
      onClick: e => {
        e.preventDefault();
        if (this.props.owner) {
          this.props.onLaunchPermissionsEditor('auth');
        }
      }
    }, this.props.auth)), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, "Anon: ", react__WEBPACK_IMPORTED_MODULE_0___default().createElement("tt", {
      className: this.props.owner ? 'clickable' : null,
      onClick: e => {
        e.preventDefault();
        if (this.props.owner) {
          this.props.onLaunchPermissionsEditor('anon');
        }
      }
    }, this.props.anon)))) : null) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "group"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_permissions",
      defaultMessage: [{
        "type": 0,
        "value": "Permissions:"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "quoted"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_you",
      defaultMessage: [{
        "type": 0,
        "value": "You:"
      }]
    }), " ", react__WEBPACK_IMPORTED_MODULE_0___default().createElement("tt", {
      className: "clickable",
      onClick: e => {
        e.preventDefault();
        this.props.onLaunchPermissionsEditor('want');
      }
    }, this.props.access)), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, this.props.fullName ? this.props.fullName : formatMessage(messages.other_user), ": \xA0", react__WEBPACK_IMPORTED_MODULE_0___default().createElement("tt", {
      className: "clickable",
      onClick: e => {
        e.preventDefault();
        this.props.onLaunchPermissionsEditor('given');
      }
    }, this.props.modeGiven2))))));
  }
}
;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(TopicSecurity));

/***/ }),

/***/ "./src/widgets/unread-badge.jsx":
/*!**************************************!*\
  !*** ./src/widgets/unread-badge.jsx ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ UnreadBadge)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

class UnreadBadge extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    return this.props.count > 0 ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
      className: "unread"
    }, this.props.count > 9 ? "9+" : this.props.count) : null;
  }
}
;

/***/ }),

/***/ "./src/widgets/uploading-image.jsx":
/*!*****************************************!*\
  !*** ./src/widgets/uploading-image.jsx ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ UploadingImage)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _file_progress_jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./file-progress.jsx */ "./src/widgets/file-progress.jsx");


class UploadingImage extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
  }
  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "inline-image"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement('img', this.props), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "rounded-container"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_file_progress_jsx__WEBPACK_IMPORTED_MODULE_1__["default"], {
      progress: this.props.progress,
      onCancel: this.props.onCancelUpload
    })));
  }
}
;

/***/ }),

/***/ "./src/widgets/video-preview.jsx":
/*!***************************************!*\
  !*** ./src/widgets/video-preview.jsx ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _send_message_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./send-message.jsx */ "./src/widgets/send-message.jsx");
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");




const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  unrecognized_video_format: {
    id: "unrecognized_video_format",
    defaultMessage: [{
      "type": 0,
      "value": "Format of this video is not recognized"
    }]
  }
});
class VideoPreview extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.videoRef = react__WEBPACK_IMPORTED_MODULE_0___default().createRef();
    this.handleSendVideo = this.handleSendVideo.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }
  handleKeyDown(e) {
    if (this.props.onSendMessage) {
      return;
    }
    e.preventDefault();
    if (e.key === 'Escape') {
      this.props.onClose();
    }
  }
  handleSendVideo(caption) {
    this.props.onClose();
    const params = {
      width: this.videoRef.current.videoWidth,
      height: this.videoRef.current.videoHeight,
      duration: this.videoRef.current.duration * 1000 | 0,
      mime: this.props.content.mime,
      name: this.props.content.filename
    };
    if (params.width == 0 || params.height == 0) {
      this.props.onError(this.props.intl.formatMessage(messages.unrecognized_video_format), 'err');
      return;
    }
    const canvas = document.createElement('canvas');
    canvas.width = params.width;
    canvas.height = params.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(this.videoRef.current, 0, 0, canvas.width, canvas.height);
    ctx.canvas.toBlob(preview => this.props.onSendMessage(caption, this.props.content.blob, preview, params), 'image/jpeg', 0.75);
  }
  render() {
    if (!this.props.content) {
      return null;
    }
    const width = this.props.content.width || '-';
    const height = this.props.content.height || '-';
    const controlist = this.props.onSendMessage ? 'nodownload' : '';
    const autoPlay = !this.props.onSendMessage;
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "image-preview"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "image-preview-caption-panel"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, this.props.content.filename), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: e => {
        e.preventDefault();
        this.props.onClose();
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons gray"
    }, "close"))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "image-preview-container"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("video", {
      className: "image-preview",
      controls: true,
      controlsList: controlist,
      disablePictureInPicture: true,
      ref: this.videoRef,
      autoPlay: autoPlay,
      src: this.props.tinode.authorizeURL(this.props.content.url),
      poster: this.props.content.preview,
      alt: this.props.content.filename
    })), this.props.onSendMessage ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_send_message_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
      messagePrompt: "add_image_caption",
      acceptBlank: true,
      tinode: this.props.tinode,
      reply: this.props.reply,
      onCancelReply: this.props.onCancelReply,
      onSendMessage: this.handleSendVideo,
      onError: this.props.onError
    }) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "image-preview-footer"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("b", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_file_name",
      defaultMessage: [{
        "type": 0,
        "value": "File name:"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
      title: this.props.content.filename
    }, this.props.content.filename))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("b", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_content_type",
      defaultMessage: [{
        "type": 0,
        "value": "Content type:"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, this.props.content.type)), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("b", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_size",
      defaultMessage: [{
        "type": 0,
        "value": "Size:"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, width, " \xD7 ", height, " px; ", (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_3__.bytesToHumanSize)(this.props.content.size)))));
  }
}
;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(VideoPreview));

/***/ }),

/***/ "./src/widgets/visible-password.jsx":
/*!******************************************!*\
  !*** ./src/widgets/visible-password.jsx ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ VisiblePassword)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

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
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      tabIndex: "-1",
      className: "group-focus",
      onBlur: this.handleEditingFinished
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
      className: "with-visibility",
      type: this.state.visible ? 'text' : 'password',
      value: this.state.value,
      placeholder: this.props.placeholder,
      required: this.props.required ? 'required' : '',
      autoFocus: this.props.autoFocus ? 'autoFocus' : '',
      autoComplete: this.props.autoComplete,
      onChange: this.handeTextChange,
      onKeyDown: this.handleKeyDown,
      ref: this.inputRef
    }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
      onClick: this.handleVisibility
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "material-icons clickable light-gray"
    }, this.state.visible ? 'visibility' : 'visibility_off')));
  }
}

/***/ }),

/***/ "./node_modules/react-dom/client.js":
/*!******************************************!*\
  !*** ./node_modules/react-dom/client.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



var m = __webpack_require__(/*! react-dom */ "react-dom");
if (false) {} else {
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

/***/ "qrcodejs":
/*!*************************!*\
  !*** external "QRCode" ***!
  \*************************/
/***/ ((module) => {

module.exports = QRCode;

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = React;

/***/ }),

/***/ "react-dom":
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
/***/ ((module) => {

module.exports = ReactDOM;

/***/ }),

/***/ "react-intl":
/*!****************************!*\
  !*** external "ReactIntl" ***!
  \****************************/
/***/ ((module) => {

module.exports = ReactIntl;

/***/ }),

/***/ "tinode-sdk":
/*!*************************!*\
  !*** external "tinode" ***!
  \*************************/
/***/ ((module) => {

module.exports = tinode;

/***/ }),

/***/ "./node_modules/@firebase/app/dist/esm/index.esm2017.js":
/*!**************************************************************!*\
  !*** ./node_modules/@firebase/app/dist/esm/index.esm2017.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FirebaseError: () => (/* reexport safe */ _firebase_util__WEBPACK_IMPORTED_MODULE_2__.FirebaseError),
/* harmony export */   SDK_VERSION: () => (/* binding */ SDK_VERSION),
/* harmony export */   _DEFAULT_ENTRY_NAME: () => (/* binding */ DEFAULT_ENTRY_NAME),
/* harmony export */   _addComponent: () => (/* binding */ _addComponent),
/* harmony export */   _addOrOverwriteComponent: () => (/* binding */ _addOrOverwriteComponent),
/* harmony export */   _apps: () => (/* binding */ _apps),
/* harmony export */   _clearComponents: () => (/* binding */ _clearComponents),
/* harmony export */   _components: () => (/* binding */ _components),
/* harmony export */   _getProvider: () => (/* binding */ _getProvider),
/* harmony export */   _registerComponent: () => (/* binding */ _registerComponent),
/* harmony export */   _removeServiceInstance: () => (/* binding */ _removeServiceInstance),
/* harmony export */   deleteApp: () => (/* binding */ deleteApp),
/* harmony export */   getApp: () => (/* binding */ getApp),
/* harmony export */   getApps: () => (/* binding */ getApps),
/* harmony export */   initializeApp: () => (/* binding */ initializeApp),
/* harmony export */   onLog: () => (/* binding */ onLog),
/* harmony export */   registerVersion: () => (/* binding */ registerVersion),
/* harmony export */   setLogLevel: () => (/* binding */ setLogLevel)
/* harmony export */ });
/* harmony import */ var _firebase_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @firebase/component */ "./node_modules/@firebase/component/dist/esm/index.esm2017.js");
/* harmony import */ var _firebase_logger__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @firebase/logger */ "./node_modules/@firebase/logger/dist/esm/index.esm2017.js");
/* harmony import */ var _firebase_util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @firebase/util */ "./node_modules/@firebase/util/dist/index.esm2017.js");
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
    return (component === null || component === void 0 ? void 0 : component.type) === "VERSION" /* ComponentType.VERSION */;
}

const name$o = "@firebase/app";
const version$1 = "0.9.27";

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

const name$n = "@firebase/app-compat";

const name$m = "@firebase/analytics-compat";

const name$l = "@firebase/analytics";

const name$k = "@firebase/app-check-compat";

const name$j = "@firebase/app-check";

const name$i = "@firebase/auth";

const name$h = "@firebase/auth-compat";

const name$g = "@firebase/database";

const name$f = "@firebase/database-compat";

const name$e = "@firebase/functions";

const name$d = "@firebase/functions-compat";

const name$c = "@firebase/installations";

const name$b = "@firebase/installations-compat";

const name$a = "@firebase/messaging";

const name$9 = "@firebase/messaging-compat";

const name$8 = "@firebase/performance";

const name$7 = "@firebase/performance-compat";

const name$6 = "@firebase/remote-config";

const name$5 = "@firebase/remote-config-compat";

const name$4 = "@firebase/storage";

const name$3 = "@firebase/storage-compat";

const name$2 = "@firebase/firestore";

const name$1 = "@firebase/firestore-compat";

const name = "firebase";
const version = "10.8.0";

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
    [name$o]: 'fire-core',
    [name$n]: 'fire-core-compat',
    [name$l]: 'fire-analytics',
    [name$m]: 'fire-analytics-compat',
    [name$j]: 'fire-app-check',
    [name$k]: 'fire-app-check-compat',
    [name$i]: 'fire-auth',
    [name$h]: 'fire-auth-compat',
    [name$g]: 'fire-rtdb',
    [name$f]: 'fire-rtdb-compat',
    [name$e]: 'fire-fn',
    [name$d]: 'fire-fn-compat',
    [name$c]: 'fire-iid',
    [name$b]: 'fire-iid-compat',
    [name$a]: 'fire-fcm',
    [name$9]: 'fire-fcm-compat',
    [name$8]: 'fire-perf',
    [name$7]: 'fire-perf-compat',
    [name$6]: 'fire-rc',
    [name$5]: 'fire-rc-compat',
    [name$4]: 'fire-gcs',
    [name$3]: 'fire-gcs-compat',
    [name$2]: 'fire-fst',
    [name$1]: 'fire-fst-compat',
    'fire-js': 'fire-js',
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
    ["bad-app-name" /* AppError.BAD_APP_NAME */]: "Illegal App name: '{$appName}",
    ["duplicate-app" /* AppError.DUPLICATE_APP */]: "Firebase App named '{$appName}' already exists with different options or config",
    ["app-deleted" /* AppError.APP_DELETED */]: "Firebase App named '{$appName}' already deleted",
    ["no-options" /* AppError.NO_OPTIONS */]: 'Need to provide options, when not being deployed to hosting via source.',
    ["invalid-app-argument" /* AppError.INVALID_APP_ARGUMENT */]: 'firebase.{$appName}() takes either no argument or a ' +
        'Firebase App instance.',
    ["invalid-log-argument" /* AppError.INVALID_LOG_ARGUMENT */]: 'First argument to `onLog` must be null or a function.',
    ["idb-open" /* AppError.IDB_OPEN */]: 'Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.',
    ["idb-get" /* AppError.IDB_GET */]: 'Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.',
    ["idb-set" /* AppError.IDB_WRITE */]: 'Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.',
    ["idb-delete" /* AppError.IDB_DELETE */]: 'Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.'
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
        this._options = Object.assign({}, options);
        this._config = Object.assign({}, config);
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
    const config = Object.assign({ name: DEFAULT_ENTRY_NAME, automaticDataCollectionEnabled: false }, rawConfig);
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
    const name = app.name;
    if (_apps.has(name)) {
        _apps.delete(name);
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
    var _a;
    // TODO: We can use this check to whitelist strings when/if we set up
    // a good whitelist system.
    let library = (_a = PLATFORM_LOG_STRING[libraryKeyOrName]) !== null && _a !== void 0 ? _a : libraryKeyOrName;
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
                originalErrorMessage: e === null || e === void 0 ? void 0 : e.message
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
                originalErrorMessage: e === null || e === void 0 ? void 0 : e.message
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
// 30 days
const STORED_HEARTBEAT_RETENTION_MAX_MILLIS = 30 * 24 * 60 * 60 * 1000;
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
        var _a, _b;
        const platformLogger = this.container
            .getProvider('platform-logger')
            .getImmediate();
        // This is the "Firebase user agent" string from the platform logger
        // service, not the browser user agent.
        const agent = platformLogger.getPlatformInfoString();
        const date = getUTCDateString();
        if (((_a = this._heartbeatsCache) === null || _a === void 0 ? void 0 : _a.heartbeats) == null) {
            this._heartbeatsCache = await this._heartbeatsCachePromise;
            // If we failed to construct a heartbeats cache, then return immediately.
            if (((_b = this._heartbeatsCache) === null || _b === void 0 ? void 0 : _b.heartbeats) == null) {
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
        }
        // Remove entries older than 30 days.
        this._heartbeatsCache.heartbeats = this._heartbeatsCache.heartbeats.filter(singleDateHeartbeat => {
            const hbTimestamp = new Date(singleDateHeartbeat.date).valueOf();
            const now = Date.now();
            return now - hbTimestamp <= STORED_HEARTBEAT_RETENTION_MAX_MILLIS;
        });
        return this._storage.overwrite(this._heartbeatsCache);
    }
    /**
     * Returns a base64 encoded string which can be attached to the heartbeat-specific header directly.
     * It also clears all heartbeats from memory as well as in IndexedDB.
     *
     * NOTE: Consuming product SDKs should not send the header if this method
     * returns an empty string.
     */
    async getHeartbeatsHeader() {
        var _a;
        if (this._heartbeatsCache === null) {
            await this._heartbeatsCachePromise;
        }
        // If it's still null or the array is empty, there is no data to send.
        if (((_a = this._heartbeatsCache) === null || _a === void 0 ? void 0 : _a.heartbeats) == null ||
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
            if (idbHeartbeatObject === null || idbHeartbeatObject === void 0 ? void 0 : idbHeartbeatObject.heartbeats) {
                return idbHeartbeatObject;
            }
            else {
                return { heartbeats: [] };
            }
        }
    }
    // overwrite the storage with the provided heartbeats
    async overwrite(heartbeatsObject) {
        var _a;
        const canUseIndexedDB = await this._canUseIndexedDBPromise;
        if (!canUseIndexedDB) {
            return;
        }
        else {
            const existingHeartbeatsObject = await this.read();
            return writeHeartbeatsToIndexedDB(this.app, {
                lastSentHeartbeatDate: (_a = heartbeatsObject.lastSentHeartbeatDate) !== null && _a !== void 0 ? _a : existingHeartbeatsObject.lastSentHeartbeatDate,
                heartbeats: heartbeatsObject.heartbeats
            });
        }
    }
    // add heartbeats
    async add(heartbeatsObject) {
        var _a;
        const canUseIndexedDB = await this._canUseIndexedDBPromise;
        if (!canUseIndexedDB) {
            return;
        }
        else {
            const existingHeartbeatsObject = await this.read();
            return writeHeartbeatsToIndexedDB(this.app, {
                lastSentHeartbeatDate: (_a = heartbeatsObject.lastSentHeartbeatDate) !== null && _a !== void 0 ? _a : existingHeartbeatsObject.lastSentHeartbeatDate,
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
    registerVersion(name$o, version$1, variant);
    // BUILD_TARGET will be replaced by values like esm5, esm2017, cjs5, etc during the compilation
    registerVersion(name$o, version$1, 'esm2017');
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


//# sourceMappingURL=index.esm2017.js.map


/***/ }),

/***/ "./node_modules/@firebase/component/dist/esm/index.esm2017.js":
/*!********************************************************************!*\
  !*** ./node_modules/@firebase/component/dist/esm/index.esm2017.js ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Component: () => (/* binding */ Component),
/* harmony export */   ComponentContainer: () => (/* binding */ ComponentContainer),
/* harmony export */   Provider: () => (/* binding */ Provider)
/* harmony export */ });
/* harmony import */ var _firebase_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @firebase/util */ "./node_modules/@firebase/util/dist/index.esm2017.js");


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
     * @param identifier A provider can provide mulitple instances of a service
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
        var _a;
        // if multipleInstances is not supported, use the default name
        const normalizedIdentifier = this.normalizeInstanceIdentifier(options === null || options === void 0 ? void 0 : options.identifier);
        const optional = (_a = options === null || options === void 0 ? void 0 : options.optional) !== null && _a !== void 0 ? _a : false;
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
            // In case a component is not initialized and should/can not be auto-initialized at the moment, return null if the optional flag is set, or throw
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
        var _a;
        const normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
        const existingCallbacks = (_a = this.onInitCallbacks.get(normalizedIdentifier)) !== null && _a !== void 0 ? _a : new Set();
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
            catch (_a) {
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
                catch (_a) {
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


//# sourceMappingURL=index.esm2017.js.map


/***/ }),

/***/ "./node_modules/@firebase/installations/dist/esm/index.esm2017.js":
/*!************************************************************************!*\
  !*** ./node_modules/@firebase/installations/dist/esm/index.esm2017.js ***!
  \************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   deleteInstallations: () => (/* binding */ deleteInstallations),
/* harmony export */   getId: () => (/* binding */ getId),
/* harmony export */   getInstallations: () => (/* binding */ getInstallations),
/* harmony export */   getToken: () => (/* binding */ getToken),
/* harmony export */   onIdChange: () => (/* binding */ onIdChange)
/* harmony export */ });
/* harmony import */ var _firebase_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @firebase/app */ "./node_modules/@firebase/app/dist/esm/index.esm2017.js");
/* harmony import */ var _firebase_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @firebase/component */ "./node_modules/@firebase/component/dist/esm/index.esm2017.js");
/* harmony import */ var _firebase_util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @firebase/util */ "./node_modules/@firebase/util/dist/index.esm2017.js");
/* harmony import */ var idb__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! idb */ "./node_modules/idb/build/index.js");





const name = "@firebase/installations";
const version = "0.6.5";

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
    catch (_a) {
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
            // Server returned a "FID can not be used" error.
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
            return Object.assign(Object.assign({}, oldEntry), { authToken: { requestStatus: 0 /* RequestStatus.NOT_STARTED */ } });
        }
        return oldEntry;
    });
}
async function fetchAuthTokenFromServer(installations, installationEntry) {
    try {
        const authToken = await generateAuthTokenRequest(installations, installationEntry);
        const updatedInstallationEntry = Object.assign(Object.assign({}, installationEntry), { authToken });
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
            const updatedInstallationEntry = Object.assign(Object.assign({}, installationEntry), { authToken: { requestStatus: 0 /* RequestStatus.NOT_STARTED */ } });
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
    return Object.assign(Object.assign({}, oldEntry), { authToken: inProgressAuthToken });
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
// BUILD_TARGET will be replaced by values like esm5, esm2017, cjs5, etc during the compilation
(0,_firebase_app__WEBPACK_IMPORTED_MODULE_0__.registerVersion)(name, version, 'esm2017');


//# sourceMappingURL=index.esm2017.js.map


/***/ }),

/***/ "./node_modules/@firebase/logger/dist/esm/index.esm2017.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@firebase/logger/dist/esm/index.esm2017.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LogLevel: () => (/* binding */ LogLevel),
/* harmony export */   Logger: () => (/* binding */ Logger),
/* harmony export */   setLogLevel: () => (/* binding */ setLogLevel),
/* harmony export */   setUserLogHandler: () => (/* binding */ setUserLogHandler)
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
                if (level >= (customLogLevel !== null && customLogLevel !== void 0 ? customLogLevel : instance.logLevel)) {
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


//# sourceMappingURL=index.esm2017.js.map


/***/ }),

/***/ "./node_modules/@firebase/messaging/dist/esm/index.esm2017.js":
/*!********************************************************************!*\
  !*** ./node_modules/@firebase/messaging/dist/esm/index.esm2017.js ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   deleteToken: () => (/* binding */ deleteToken),
/* harmony export */   getMessaging: () => (/* binding */ getMessagingInWindow),
/* harmony export */   getToken: () => (/* binding */ getToken),
/* harmony export */   isSupported: () => (/* binding */ isWindowSupported),
/* harmony export */   onMessage: () => (/* binding */ onMessage)
/* harmony export */ });
/* harmony import */ var _firebase_installations__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @firebase/installations */ "./node_modules/@firebase/installations/dist/esm/index.esm2017.js");
/* harmony import */ var _firebase_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @firebase/component */ "./node_modules/@firebase/component/dist/esm/index.esm2017.js");
/* harmony import */ var idb__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! idb */ "./node_modules/idb/build/index.js");
/* harmony import */ var _firebase_util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @firebase/util */ "./node_modules/@firebase/util/dist/index.esm2017.js");
/* harmony import */ var _firebase_app__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @firebase/app */ "./node_modules/@firebase/app/dist/esm/index.esm2017.js");






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
            var _a;
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
                    createTime: (_a = oldDetails.createTime) !== null && _a !== void 0 ? _a : Date.now(),
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
// Exported for tests.
const DATABASE_NAME = 'firebase-messaging-database';
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = 'firebase-messaging-store';
let dbPromise = null;
function getDbPromise() {
    if (!dbPromise) {
        dbPromise = (0,idb__WEBPACK_IMPORTED_MODULE_2__.openDB)(DATABASE_NAME, DATABASE_VERSION, {
            upgrade: (upgradeDb, oldVersion) => {
                // We don't use 'break' in this switch statement, the fall-through behavior is what we want,
                // because if there are multiple versions between the old version and the current version, we
                // want ALL the migrations that correspond to those versions to run, not only the last one.
                // eslint-disable-next-line default-case
                switch (oldVersion) {
                    case 0:
                        upgradeDb.createObjectStore(OBJECT_STORE_NAME);
                }
            }
        });
    }
    return dbPromise;
}
/** Gets record(s) from the objectStore that match the given key. */
async function dbGet(firebaseDependencies) {
    const key = getKey(firebaseDependencies);
    const db = await getDbPromise();
    const tokenDetails = (await db
        .transaction(OBJECT_STORE_NAME)
        .objectStore(OBJECT_STORE_NAME)
        .get(key));
    if (tokenDetails) {
        return tokenDetails;
    }
    else {
        // Check if there is a tokenDetails object in the old DB.
        const oldTokenDetails = await migrateOldDatabase(firebaseDependencies.appConfig.senderId);
        if (oldTokenDetails) {
            await dbSet(firebaseDependencies, oldTokenDetails);
            return oldTokenDetails;
        }
    }
}
/** Assigns or overwrites the record for the given key with the given value. */
async function dbSet(firebaseDependencies, tokenDetails) {
    const key = getKey(firebaseDependencies);
    const db = await getDbPromise();
    const tx = db.transaction(OBJECT_STORE_NAME, 'readwrite');
    await tx.objectStore(OBJECT_STORE_NAME).put(tokenDetails, key);
    await tx.done;
    return tokenDetails;
}
/** Removes record(s) from the objectStore that match the given key. */
async function dbRemove(firebaseDependencies) {
    const key = getKey(firebaseDependencies);
    const db = await getDbPromise();
    const tx = db.transaction(OBJECT_STORE_NAME, 'readwrite');
    await tx.objectStore(OBJECT_STORE_NAME).delete(key);
    await tx.done;
}
function getKey({ appConfig }) {
    return appConfig.appId;
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
        'called before calling getToken() to ensure your VAPID key is used.'
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
async function requestGetToken(firebaseDependencies, subscriptionOptions) {
    const headers = await getHeaders(firebaseDependencies);
    const body = getBody(subscriptionOptions);
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
            errorInfo: err === null || err === void 0 ? void 0 : err.toString()
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
async function requestUpdateToken(firebaseDependencies, tokenDetails) {
    const headers = await getHeaders(firebaseDependencies);
    const body = getBody(tokenDetails.subscriptionOptions);
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
            errorInfo: err === null || err === void 0 ? void 0 : err.toString()
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
            errorInfo: err === null || err === void 0 ? void 0 : err.toString()
        });
    }
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
function getBody({ p256dh, auth, endpoint, vapidKey }) {
    const body = {
        web: {
            endpoint,
            auth,
            p256dh
        }
    };
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
    const pushSubscription = await getPushSubscription(messaging.swRegistration, messaging.vapidKey);
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
 * This method deletes the token from the database, unsubscribes the token from FCM, and unregisters
 * the push subscription if it exists.
 */
async function deleteTokenInternal(messaging) {
    const tokenDetails = await dbGet(messaging.firebaseDependencies);
    if (tokenDetails) {
        await requestDeleteToken(messaging.firebaseDependencies, tokenDetails.token);
        await dbRemove(messaging.firebaseDependencies);
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
        const updatedTokenDetails = Object.assign(Object.assign({}, tokenDetails), { token: updatedToken, createTime: Date.now() });
        await dbSet(messaging.firebaseDependencies, updatedTokenDetails);
        return updatedToken;
    }
    catch (e) {
        await deleteTokenInternal(messaging);
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
async function getPushSubscription(swRegistration, vapidKey) {
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
    var _a, _b, _c, _d, _e;
    // fcmOptions.link value is written into notification.click_action. see more in b/232072111
    if (!messagePayloadInternal.fcmOptions &&
        !((_a = messagePayloadInternal.notification) === null || _a === void 0 ? void 0 : _a.click_action)) {
        return;
    }
    payload.fcmOptions = {};
    const link = (_c = (_b = messagePayloadInternal.fcmOptions) === null || _b === void 0 ? void 0 : _b.link) !== null && _c !== void 0 ? _c : (_d = messagePayloadInternal.notification) === null || _d === void 0 ? void 0 : _d.click_action;
    if (!!link) {
        payload.fcmOptions.link = link;
    }
    // eslint-disable-next-line camelcase
    const analyticsLabel = (_e = messagePayloadInternal.fcmOptions) === null || _e === void 0 ? void 0 : _e.analytics_label;
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
_mergeStrings('hts/frbslgigp.ogepscmv/ieo/eaylg', 'tp:/ieaeogn-agolai.o/1frlglgc/o');
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
        this.logEvents = [];
        this.isLogServiceStarted = false;
        const appConfig = extractAppConfig(app);
        this.firebaseDependencies = {
            app,
            appConfig,
            installations,
            analyticsProvider
        };
    }
    _delete() {
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
    }
    catch (e) {
        throw ERROR_FACTORY.create("failed-service-worker-registration" /* ErrorCode.FAILED_DEFAULT_REGISTRATION */, {
            browserErrorMessage: e === null || e === void 0 ? void 0 : e.message
        });
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
    await updateVapidKey(messaging, options === null || options === void 0 ? void 0 : options.vapidKey);
    await updateSwReg(messaging, options === null || options === void 0 ? void 0 : options.serviceWorkerRegistration);
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
    // Log to Scion if applicable
    const dataPayload = internalPayload.data;
    if (isConsoleMessage(dataPayload) &&
        dataPayload[CONSOLE_CAMPAIGN_ANALYTICS_ENABLED] === '1') {
        await logToScion(messaging, internalPayload.messageType, dataPayload);
    }
}

const name = "@firebase/messaging";
const version = "0.12.6";

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
    return messaging;
};
const WindowMessagingInternalFactory = (container) => {
    const messaging = container
        .getProvider('messaging')
        .getImmediate();
    const messagingInternal = {
        getToken: (options) => getToken$1(messaging, options)
    };
    return messagingInternal;
};
function registerMessagingInWindow() {
    (0,_firebase_app__WEBPACK_IMPORTED_MODULE_4__._registerComponent)(new _firebase_component__WEBPACK_IMPORTED_MODULE_1__.Component('messaging', WindowMessagingFactory, "PUBLIC" /* ComponentType.PUBLIC */));
    (0,_firebase_app__WEBPACK_IMPORTED_MODULE_4__._registerComponent)(new _firebase_component__WEBPACK_IMPORTED_MODULE_1__.Component('messaging-internal', WindowMessagingInternalFactory, "PRIVATE" /* ComponentType.PRIVATE */));
    (0,_firebase_app__WEBPACK_IMPORTED_MODULE_4__.registerVersion)(name, version);
    // BUILD_TARGET will be replaced by values like esm5, esm2017, cjs5, etc during the compilation
    (0,_firebase_app__WEBPACK_IMPORTED_MODULE_4__.registerVersion)(name, version, 'esm2017');
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
    return deleteTokenInternal(messaging);
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
 * @param messaging - The {@link Messaging} instance.
 *
 * @returns The promise resolves when the token has been successfully deleted.
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
 * The Firebase Cloud Messaging Web SDK.
 * This SDK does not work in a Node.js environment.
 *
 * @packageDocumentation
 */
registerMessagingInWindow();


//# sourceMappingURL=index.esm2017.js.map


/***/ }),

/***/ "./node_modules/firebase/app/dist/esm/index.esm.js":
/*!*********************************************************!*\
  !*** ./node_modules/firebase/app/dist/esm/index.esm.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FirebaseError: () => (/* reexport safe */ _firebase_app__WEBPACK_IMPORTED_MODULE_0__.FirebaseError),
/* harmony export */   SDK_VERSION: () => (/* reexport safe */ _firebase_app__WEBPACK_IMPORTED_MODULE_0__.SDK_VERSION),
/* harmony export */   _DEFAULT_ENTRY_NAME: () => (/* reexport safe */ _firebase_app__WEBPACK_IMPORTED_MODULE_0__._DEFAULT_ENTRY_NAME),
/* harmony export */   _addComponent: () => (/* reexport safe */ _firebase_app__WEBPACK_IMPORTED_MODULE_0__._addComponent),
/* harmony export */   _addOrOverwriteComponent: () => (/* reexport safe */ _firebase_app__WEBPACK_IMPORTED_MODULE_0__._addOrOverwriteComponent),
/* harmony export */   _apps: () => (/* reexport safe */ _firebase_app__WEBPACK_IMPORTED_MODULE_0__._apps),
/* harmony export */   _clearComponents: () => (/* reexport safe */ _firebase_app__WEBPACK_IMPORTED_MODULE_0__._clearComponents),
/* harmony export */   _components: () => (/* reexport safe */ _firebase_app__WEBPACK_IMPORTED_MODULE_0__._components),
/* harmony export */   _getProvider: () => (/* reexport safe */ _firebase_app__WEBPACK_IMPORTED_MODULE_0__._getProvider),
/* harmony export */   _registerComponent: () => (/* reexport safe */ _firebase_app__WEBPACK_IMPORTED_MODULE_0__._registerComponent),
/* harmony export */   _removeServiceInstance: () => (/* reexport safe */ _firebase_app__WEBPACK_IMPORTED_MODULE_0__._removeServiceInstance),
/* harmony export */   deleteApp: () => (/* reexport safe */ _firebase_app__WEBPACK_IMPORTED_MODULE_0__.deleteApp),
/* harmony export */   getApp: () => (/* reexport safe */ _firebase_app__WEBPACK_IMPORTED_MODULE_0__.getApp),
/* harmony export */   getApps: () => (/* reexport safe */ _firebase_app__WEBPACK_IMPORTED_MODULE_0__.getApps),
/* harmony export */   initializeApp: () => (/* reexport safe */ _firebase_app__WEBPACK_IMPORTED_MODULE_0__.initializeApp),
/* harmony export */   onLog: () => (/* reexport safe */ _firebase_app__WEBPACK_IMPORTED_MODULE_0__.onLog),
/* harmony export */   registerVersion: () => (/* reexport safe */ _firebase_app__WEBPACK_IMPORTED_MODULE_0__.registerVersion),
/* harmony export */   setLogLevel: () => (/* reexport safe */ _firebase_app__WEBPACK_IMPORTED_MODULE_0__.setLogLevel)
/* harmony export */ });
/* harmony import */ var _firebase_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @firebase/app */ "./node_modules/@firebase/app/dist/esm/index.esm2017.js");



var name = "firebase";
var version = "10.8.0";

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
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   deleteToken: () => (/* reexport safe */ _firebase_messaging__WEBPACK_IMPORTED_MODULE_0__.deleteToken),
/* harmony export */   getMessaging: () => (/* reexport safe */ _firebase_messaging__WEBPACK_IMPORTED_MODULE_0__.getMessaging),
/* harmony export */   getToken: () => (/* reexport safe */ _firebase_messaging__WEBPACK_IMPORTED_MODULE_0__.getToken),
/* harmony export */   isSupported: () => (/* reexport safe */ _firebase_messaging__WEBPACK_IMPORTED_MODULE_0__.isSupported),
/* harmony export */   onMessage: () => (/* reexport safe */ _firebase_messaging__WEBPACK_IMPORTED_MODULE_0__.onMessage)
/* harmony export */ });
/* harmony import */ var _firebase_messaging__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @firebase/messaging */ "./node_modules/@firebase/messaging/dist/esm/index.esm2017.js");

//# sourceMappingURL=index.esm.js.map


/***/ }),

/***/ "./node_modules/idb/build/index.js":
/*!*****************************************!*\
  !*** ./node_modules/idb/build/index.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   deleteDB: () => (/* binding */ deleteDB),
/* harmony export */   openDB: () => (/* binding */ openDB),
/* harmony export */   unwrap: () => (/* reexport safe */ _wrap_idb_value_js__WEBPACK_IMPORTED_MODULE_0__.u),
/* harmony export */   wrap: () => (/* reexport safe */ _wrap_idb_value_js__WEBPACK_IMPORTED_MODULE_0__.w)
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
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   a: () => (/* binding */ reverseTransformCache),
/* harmony export */   i: () => (/* binding */ instanceOfAny),
/* harmony export */   r: () => (/* binding */ replaceTraps),
/* harmony export */   u: () => (/* binding */ unwrap),
/* harmony export */   w: () => (/* binding */ wrap)
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
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	(() => {
/******/ 		var getProto = Object.getPrototypeOf ? (obj) => (Object.getPrototypeOf(obj)) : (obj) => (obj.__proto__);
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
/******/ 			for(var current = mode & 2 && value; typeof current == 'object' && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach((key) => (def[key] = () => (value[key])));
/******/ 			}
/******/ 			def['default'] = () => (value);
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".dev.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "tinode-webapp:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
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
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 		
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "/umd/";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"index": 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
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
/******/ 							var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = (event) => {
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
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
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
/******/ 		var chunkLoadingGlobal = globalThis["webpackChunktinode_webapp"] = globalThis["webpackChunktinode_webapp"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
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
  'de': _ => __webpack_require__.e(/*! import() */ "src_i18n_min_de_json").then(__webpack_require__.t.bind(__webpack_require__, /*! ./i18n.min/de.json */ "./src/i18n.min/de.json", 19)),
  'en': _ => __webpack_require__.e(/*! import() */ "src_i18n_min_en_json").then(__webpack_require__.t.bind(__webpack_require__, /*! ./i18n.min/en.json */ "./src/i18n.min/en.json", 19)),
  'es': _ => __webpack_require__.e(/*! import() */ "src_i18n_min_es_json").then(__webpack_require__.t.bind(__webpack_require__, /*! ./i18n.min/es.json */ "./src/i18n.min/es.json", 19)),
  'fr': _ => __webpack_require__.e(/*! import() */ "src_i18n_min_fr_json").then(__webpack_require__.t.bind(__webpack_require__, /*! ./i18n.min/fr.json */ "./src/i18n.min/fr.json", 19)),
  'ko': _ => __webpack_require__.e(/*! import() */ "src_i18n_min_ko_json").then(__webpack_require__.t.bind(__webpack_require__, /*! ./i18n.min/ko.json */ "./src/i18n.min/ko.json", 19)),
  'ro': _ => __webpack_require__.e(/*! import() */ "src_i18n_min_ro_json").then(__webpack_require__.t.bind(__webpack_require__, /*! ./i18n.min/ro.json */ "./src/i18n.min/ro.json", 19)),
  'ru': _ => __webpack_require__.e(/*! import() */ "src_i18n_min_ru_json").then(__webpack_require__.t.bind(__webpack_require__, /*! ./i18n.min/ru.json */ "./src/i18n.min/ru.json", 19)),
  'th': _ => __webpack_require__.e(/*! import() */ "src_i18n_min_th_json").then(__webpack_require__.t.bind(__webpack_require__, /*! ./i18n.min/th.json */ "./src/i18n.min/th.json", 19)),
  'uk': _ => __webpack_require__.e(/*! import() */ "src_i18n_min_uk_json").then(__webpack_require__.t.bind(__webpack_require__, /*! ./i18n.min/uk.json */ "./src/i18n.min/uk.json", 19)),
  'zh': _ => __webpack_require__.e(/*! import() */ "src_i18n_min_zh_json").then(__webpack_require__.t.bind(__webpack_require__, /*! ./i18n.min/zh.json */ "./src/i18n.min/zh.json", 19)),
  'zh-TW': _ => __webpack_require__.e(/*! import() */ "src_i18n_min_zh-TW_json").then(__webpack_require__.t.bind(__webpack_require__, /*! ./i18n.min/zh-TW.json */ "./src/i18n.min/zh-TW.json", 19))
};
const {
  params
} = _lib_navigation_js__WEBPACK_IMPORTED_MODULE_4__["default"].parseUrlHash(window.location.hash);
const language = params && params.hl || navigator.languages && navigator.languages[0] || navigator.language || navigator.userLanguage || 'en';
const normalized = language.replace('_', '-');
const baseLanguage = normalized.split('-')[0].toLowerCase();
const htmlLang = messageLoader[normalized] ? language : messageLoader[baseLanguage] ? baseLanguage : 'en';
document.getElementsByTagName('html')[0].setAttribute('lang', htmlLang);
const root = (0,react_dom_client__WEBPACK_IMPORTED_MODULE_1__.createRoot)(document.getElementById('mountPoint'));
messageLoader[htmlLang]().then(messages => root.render(react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_2__.IntlProvider, {
  locale: language,
  messages: messages,
  textComponent: (react__WEBPACK_IMPORTED_MODULE_0___default().Fragment)
}, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_views_tinode_web_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], null))));
})();

/******/ })()
;
//# sourceMappingURL=index.dev.js.map
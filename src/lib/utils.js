// Odds and ends

import { Tinode } from 'tinode-sdk';

// Make shortcut icon appear with a green dot + show unread count in title.
export function updateFavicon(count) {
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

  document.title = (count > 0 ? '('+count+') ' : '') + 'Tinode';
}

// Create theCard which represents user's or topic's "public" info.
export function theCard(fn, imageUrl, imageMimeType, note) {
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
    card.note = note ? note : Tinode.DEL_CHAR;
  }

  if (imageUrl) {
    card = card || {};
    let mimeType = imageMimeType;
    // Is this a data URL "data:[<mediatype>][;base64],<data>"?
    const matches = /^data:(image\/[-a-z0-9+.]+)?(;base64)?,/i.exec(imageUrl);
    if (matches) {
      mimeType = matches[1];
      card.photo = {
        data: imageUrl.substring(imageUrl.indexOf(',') + 1),
        ref: Tinode.DEL_CHAR
      };
    } else {
      card.photo = {
        data: Tinode.DEL_CHAR,
        ref: imageUrl
      };
    }
    card.photo.type = (mimeType || 'image/jpeg').substring('image/'.length);
  }

  return card;
}

// Deep-shallow compare two arrays: shallow compare each element.
export function arrayEqual(a, b) {
  if (a === b) {
    return true;
  }

  if (!Array.isArray(a) || !Array.isArray(b)) {
    return false;
  }

  // Compare lengths first.
  if (a.length != b.length) {
    return false;
  }
  // Order of elements is ignored.
  a.sort();
  b.sort();
  for (let i = 0, l = a.length; i < l; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

// Checks (loosely) if the given string is a phone. If so, returns the phone number in a format
// as close to E.164 as possible.
export function asPhone(val) {
  val = val.trim();
  if (/^(?:\+?(\d{1,3}))?[- (.]*(\d{3})[- ).]*(\d{3})[- .]*(\d{2})[- .]*(\d{2})?$/.test(val)) {
    return val.replaceAll(/[- ().]*/g, '');
  }
  return null;
}

// Checks (loosely) if the given string is an email. If so returns the email.
export function asEmail(val) {
  val = val.trim();
  if (/^[a-z0-9_.+-]+@[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(val)) {
    return val;
  }
  return null;
}

// Checks if URL is a relative url, i.e. has no 'scheme://', including the case of missing scheme '//'.
// The scheme is expected to be RFC-compliant, e.g. [a-z][a-z0-9+.-]*
// example.html - ok
// https:example.com - not ok.
// http:/example.com - not ok.
// //example.com or \\example.com - not ok.
// ' ↲ https://example.com' - not ok. (↲ means carriage return)
export function isUrlRelative(url) {
  // Replacing backslashes with forward slashes to mimic JS URL parser then testing for
  // 'scheme:' and '//' with optional space at the start.
  return url && !/^\s*([a-z][a-z0-9+.-]*:|\/\/)/im.test(url.replace(/\\/g, '/'));
}

// Ensure URL does not present an XSS risk. Optional allowedSchemes may contain an array of
// strings with permitted URL schemes, such as ['ftp', 'ftps']; otherwise accept http and https only.
export function sanitizeUrl(url, allowedSchemes) {
  if (typeof url != 'string') {
    return url;
  }

  // Strip control characters and whitespace. They are not valid URL characters anyway.
  url = url.replace(/[^\x21-\x7E]/gmi, '').trim();

  // Replace backslashes with forward slashes. They will be replaced in the URL parser anyway.
  url = url.replace(/\\/g, '/');

  // Relative URLs are safe.
  // Relative URL does not start with ':', abcd123: or '//'.
  if (!/^([a-z][a-z0-9+.-]*:|\/\/)/i.test(url)) {
    return url;
  }

  // Blob URLs are safe.
  if (/^blob:http/.test(url)) {
    return url;
  }

  // Absolute URL. Accept only safe schemes, or no scheme.
  const schemes = Array.isArray(allowedSchemes) ? allowedSchemes.join('|') : 'http|https';
  const re = new RegExp('^((' + schemes + '):|//)', 'i');
  if (!re.test(url)) {
    return null;
  }

  return url;
}

// Ensure URL is suitable as a source like <img src="url"> field: the URL must be a relative URL or
// have http:, https:, blob: or data: scheme.
// In case of data: scheme, the URL must must be of the right MIME type such as 'data:{mimeMajor}/XXXX;base64,'.
export function sanitizeUrlForMime(url, mimeMajor) {
  if (!url) {
    return null;
  }

  const sanitizedUrl = sanitizeUrl(url);
  if (sanitizedUrl) {
    return sanitizedUrl;
  }

  // Is this a data: URL of the appropriate mime type?
  const re = new RegExp(`data:${mimeMajor}\/[-+.a-z0-9]+;base64,`, 'i');
  if (re.test(url.trim())) {
    return url;
  }

  return null;
}

// Append query parameter 'asatt=1' to the URL.
// It will cause Tinode server to add 'Content-Disposition: attachment' header when serving it.
// The URL is a string. The URL here is always absolute.
export function urlAsAttachment(url) {
  // TODO: check if URL is local or remote, i.e. compare to window.location.origin.
  /*
  if (typeof window.location == 'object') {
    if (!url.startsWith(window.location.origin)) {
      return url;
    }
  }
  */
  // Check if the URL is a data or blob. Do not alter such URLs.
  if (url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }

  // Split URL into host+path, query, fragment.
  let query = '', fragment = '';
  const idxF = url.indexOf('#');
  if (idxF > 0) {
    fragment = url.substring(idxF+1);
    url = url.substring(0, idxF);
  }
  const idxQ = url.indexOf('?');
  if (idxQ > 0) {
    query = url.substring(idxQ+1);
    url = url.substring(0, idxQ);
  }
  // Add parameter and reassemble.
  const params = new URLSearchParams(query);
  params.append('asatt', '1');
  return `${url}?${params.toString()}` + (fragment ? `#${fragment}` : '');
}

// Given message's received status, return name and color of a delivery indicator icon.
export function deliveryMarker(received) {
  switch (received) {
    case Tinode.MESSAGE_STATUS_SENDING:
      return { name: 'access_time' }; // watch face
    case Tinode.MESSAGE_STATUS_FAILED:
    case Tinode.MESSAGE_STATUS_FATAL:
      return { name: 'warning', color: 'danger-color' }; // yellow icon /!\
    case Tinode.MESSAGE_STATUS_SENT:
      return { name: 'done' }; // checkmark
    case Tinode.MESSAGE_STATUS_RECEIVED:
      return { name: 'done_all' }; // double checkmark
    case Tinode.MESSAGE_STATUS_READ:
      return { name: 'done_all', color: 'blue' }; // blue double checkmark
  }
  return null;
}

// Wraps a promise to make it cancelable.
// The parameter can be either a promise or an error. If it's an error, the wrapped promise is
// created in a rejected state.
export function cancelablePromise(promise) {
  let hasCanceled = false;

  const wrappedPromise = promise instanceof Error ?
    Promise.reject(promise) :
    new Promise((resolve, reject) => {
      promise.then(
        result => hasCanceled ? reject({isCanceled: true}) : resolve(result),
        error => hasCanceled ? reject({isCanceled: true}) : reject(error)
      );
    });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled = true;
    },
  };
};

// Clips string to the specified length.
export function clipStr(str, length) {
  return str && str.substring(0, length);
}

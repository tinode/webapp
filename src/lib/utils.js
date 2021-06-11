// Odds and ends

import Tinode from 'tinode-sdk';

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
export function theCard(fn, imageUrl, imageMimeType) {
  let card = null;
  fn = fn && fn.trim();

  if (fn) {
    card = {
      fn: fn
    };
  }

  if (imageUrl) {
    card = card || {};
    let mimeType = imageMimeType;
    // Is this a data URL "data:[<mediatype>][;base64],<data>"?
    const matches = /^data:(image\/[-a-z0-9+.]+)?(;base64)?,/i.exec(imageUrl);
    if (matches) {
      mimeType = matches[1];
      card.photo = {
        data: imageUrl.substring(imageUrl.indexOf(',') + 1)
      };
    } else {
      card.photo = {
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
    return val.replace(/[- ().]*/, '');
  }
  return null;
}

// Checks (loosely) if the given string is an email. If so returns the email.
export function asEmail(val) {
  val = val.trim();
  if (/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(val)) {
    return val;
  }
  return null;
}

// Checks if URL is a relative url, i.e. has no 'scheme://', including the case of missing scheme '//'.
// The scheme is expected to be RFC-compliant, e.g. [a-z][a-z0-9+.-]*
// example.html - ok
// https:example.com - not ok.
// http:/example.com - not ok.
// ' ↲ https://example.com' - not ok. (↲ means carriage return)
export function isUrlRelative(url) {
  return url && !/^\s*([a-z][a-z0-9+.-]*:|\/\/)/im.test(url);
}

// Ensure URL does not present an XSS risk. Optional allowedSchemes may contain an array of
// strings with permitted URL schemes, such as ['ftp', 'ftps']; otherwise accept http and https only.
// If apikey and/or token is defined, it's appended to relative URL.
export function sanitizeUrl(url, allowedSchemes) {
  if (!url) {
    return null;
  }

  // Strip control characters and whitespace. They are not valid URL characters anyway.
  url = url.replace(/[^\x20-\x7E]/gmi, '').trim();

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

// Ensure URL is suitable for <img src="url"> field: the URL must be a relative URL or
// have http:, https:, blob: or data: scheme.
// The relative URL is appended with the API key and/or auth token.
// In case of data: scheme, the URL must start with a 'data:image/XXXX;base64,'.
export function sanitizeImageUrl(url) {
  if (!url) {
    return null;
  }

  const sanitizedUrl = sanitizeUrl(url);
  if (sanitizedUrl) {
    return sanitizedUrl;
  }

  // Is this a data: URL of an image?
  if (/data:image\/[a-z0-9.-]+;base64,/i.test(url.trim())) {
    return url;
  }

  return null;
}

// Given message's received status, return name and color of a delivery indicator icon.
export function deliveryMarker(received) {
  switch (received) {
    case Tinode.MESSAGE_STATUS_SENDING:
      return { name: 'access_time' }; // watch face
    case Tinode.MESSAGE_STATUS_FAILED:
      return { name: 'warning', color: 'amber' }; // yellow icon /!\
    case Tinode.MESSAGE_STATUS_SENT:
      return { name: 'done' }; // checkmark
    case Tinode.MESSAGE_STATUS_RECEIVED:
      return { name: 'done_all' }; // double checkmark
    case Tinode.MESSAGE_STATUS_READ:
      return { name: 'done_all', color: 'blue' }; // blue double checkmark
  }
  return null;
}

// Odds and ends

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

// Create VCard which represents topic 'public' info
export function vcard(fn, imageDataUrl) {
  let card = null;

  if ((fn && fn.trim()) || imageDataUrl) {
    card = {};
    if (fn) {
      card.fn = fn.trim();
    }
    if (imageDataUrl) {
      const dataStart = imageDataUrl.indexOf(',');
      card.photo = {
        data: imageDataUrl.substring(dataStart+1),
        type: 'jpg'
      };
    }
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

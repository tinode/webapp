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

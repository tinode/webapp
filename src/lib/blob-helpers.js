// File and image helper functions.
import { MAX_INBAND_ATTACHMENT_SIZE, MAX_IMAGE_DIM } from '../config.js';

// Supported image MIME types and corresponding file extensions.
export const SUPPORTED_IMAGE_FORMATS = ['image/jpeg', 'image/gif', 'image/png', 'image/svg', 'image/svg+xml'];
export const MIME_EXTENSIONS         = ['jpg',        'gif',       'png',       'svg',       'svg'];

// Make a data URL from public.photo
export function makeImageUrl(photo) {
  return (photo && photo.type && photo.data) ?
    'data:image/' + photo.type + ';base64,' + photo.data : null;
}

// Calculate linear dimensions for scaling image down to fit under a certain size.
// Returns an object which contains destination sizes, source sizes, and offsets
// into source (when making square images).
export function fitImageSize(width, height, maxWidth, maxHeight, forceSquare) {
  // Sanitize input
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
export function fileNameForMime(fname, mime) {
  var idx = SUPPORTED_IMAGE_FORMATS.indexOf(mime);
  var ext = MIME_EXTENSIONS[idx];

  var at = fname.lastIndexOf('.');
  if (at >= 0) {
    fname = fname.substring(0, at);
  }
  return fname + '.' + ext;
}

// Convert uploaded image into a base64-encoded string possibly scaling
// linear dimensions or constraining to a square.
export function imageFileScaledToBase64(file, width, height, forceSquare, onSuccess, onError) {
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
    var canvas = document.createElement('canvas');
    canvas.width = dim.dstWidth;
    canvas.height = dim.dstHeight;
    var ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(this, dim.xoffset, dim.yoffset, dim.srcWidth, dim.srcHeight,
      0, 0, dim.dstWidth, dim.dstHeight);

    var mime = (this.width != dim.dstWidth ||
      this.height != dim.dstHeight ||
      SUPPORTED_IMAGE_FORMATS.indexOf(file.type) < 0) ? 'image/jpeg' : file.type;
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
      mime = 'image/jpeg';
    }
    if (mime == 'image/jpeg') {
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
export function imageFileToBase64(file, onSuccess, onError) {
  var reader = new FileReader();
  reader.addEventListener('load', function() {
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

export function fileToBase64(file, onSuccess, onError) {
  var reader = new FileReader();
  reader.addEventListener('load', function() {
    onSuccess(file.type, reader.result.split(',')[1], file.name);
  });
  reader.readAsDataURL(file);
}

// File pasted from the clipboard. It's either an inline image or a file attachment.
// FIXME: handle large files out of band.
export function filePasted(event, onImageSuccess, onAttachmentSuccess, onError) {
  var items = (event.clipboardData || event.originalEvent.clipboardData || {}).items;
  for (var i in items) {
    var item = items[i];
    if (item.kind === 'file') {
      var file = item.getAsFile();
      if (!file) {
        console.log("Failed to get file object from pasted file item", item.kind, item.type);
        continue;
      }
      if (file.type && file.type.split('/')[0] == 'image') {
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

// Get mime type from data URL header.
export function getMimeType(header) {
  var mime = /^data:(image\/[-+a-z0-9.]+);base64/.exec(header);
  return (mime && mime.length > 1) ? mime[1] : null;
}

// Given length of a binary object in bytes, calculate the length after
// base64 encoding.
export function base64EncodedLen(n) {
  return Math.floor((n + 2) / 3) * 4;
}

// Given length of a base64-encoded object, calculate decoded size of the
// pbject in bytes.
export function base64DecodedLen(n) {
  return Math.floor(n / 4) * 3;
}

// Re-encode string to standard base64 encoding with padding.
// The string may be base64-URL encoded without the padding.
export function base64ReEncode(str) {
  if (str) {
    str = str.replace('-', '+').replace('_', '/');
    try {
      str = btoa(atob(str));
    } catch(err) {
      console.log("Failed to base64 re-encode string");
      str = null;
    }
  }
  return str;
}

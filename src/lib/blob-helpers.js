// File and image helper functions.
import { MAX_INBAND_ATTACHMENT_SIZE, MAX_IMAGE_DIM } from '../config.js';
import { bytesToHumanSize } from './strformat.js'

// Supported image MIME types and corresponding file extensions.
export const SUPPORTED_IMAGE_FORMATS = ['image/jpeg', 'image/gif', 'image/png', 'image/svg', 'image/svg+xml'];
export const MIME_EXTENSIONS         = ['jpg',        'gif',       'png',       'svg',       'svg'];

// Make a data: URL from public.photo
export function makeImageDataUrl(photo) {
  if (photo) {
    if (photo.data && photo.type) {
      const mime = photo.type.startsWith('image/') ? photo.type : ('image/' + photo.type);
      return 'data:' + mime + ';base64,' + photo.data;
    }
    return photo.ref;
  }
  return null;
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

  const scale = Math.min(
    Math.min(width, maxWidth) / width,
    Math.min(height, maxHeight) / height
  );

  const size = {
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
  const idx = SUPPORTED_IMAGE_FORMATS.indexOf(mime);
  if (idx < 0 || !fname) {
    // Unknown mime or empty name.
    return fname;
  }
  const ext = MIME_EXTENSIONS[idx];

  const at = fname.lastIndexOf('.');
  if (at >= 0) {
    fname = fname.substring(0, at);
  }
  return fname + '.' + ext;
}

// Scale uploaded image to fit under certain dimensions and byte size, optionally constraining to a square.
// On success calls onSuccess callback with the scaled image as Blob.
export function imageScaled(fileOrBlob, maxWidth, maxHeight, maxSize, forceSquare, onSuccess, onError) {
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onerror = function(err) {
    onError("Image format unrecognized");
  }
  img.onload = async function() {
    // Once the image is loaded, the URL is no longer needed.
    URL.revokeObjectURL(img.src);

    // Calculate the desired image dimensions.
    const dim = fitImageSize(this.width, this.height, maxWidth, maxHeight, forceSquare);
    if (!dim) {
      onError("Invalid image");
      return;
    }
    let canvas = document.createElement('canvas');
    canvas.width = dim.dstWidth;
    canvas.height = dim.dstHeight;
    let ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(this, dim.xoffset, dim.yoffset, dim.srcWidth, dim.srcHeight,
      0, 0, dim.dstWidth, dim.dstHeight);

    const mime = SUPPORTED_IMAGE_FORMATS.includes(fileOrBlob.type) ? fileOrBlob.type : 'image/jpeg';
    // Generate blob to check size of the image.
    let blob = await new Promise(resolve => canvas.toBlob(resolve, mime));
    if (!blob) {
      onError("Unsupported image format");
      return;
    }

    // Ensure the image is not too large. Shrink the image keeping the aspect ratio.
    // Do nothing if maxsize is <= 0.
    while (maxSize > 0 && blob.length > maxSize) {
      dim.dstWidth = (dim.dstWidth * 0.70710678118) | 0;
      dim.dstHeight = (dim.dstHeight * 0.70710678118) | 0;
      canvas.width = dim.dstWidth;
      canvas.height = dim.dstHeight;
      ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(this, dim.xoffset, dim.yoffset, dim.srcWidth, dim.srcHeight,
        0, 0, dim.dstWidth, dim.dstHeight);
      blob = await new Promise(resolve => canvas.toBlob(resolve, mime));
    }

    canvas = null;
    onSuccess(mime, blob, dim.dstWidth, dim.dstHeight, fileNameForMime(fileOrBlob.name, mime));
  };
  img.src = URL.createObjectURL(fileOrBlob);
}

// Convert File to base64 string.
export function fileToBase64(file, onSuccess) {
  const reader = new FileReader();
  reader.addEventListener('load', function() {
    onSuccess(file.type, reader.result.split(',')[1], file.name);
  });
  reader.readAsDataURL(file);
}

// Convert Blob to base64 string.
export function blobToBase64(blob, onSuccess) {
  const reader = new FileReader();
  reader.addEventListener('load', function() {
    onSuccess(blob.type, reader.result.split(',')[1]);
  });
  reader.readAsDataURL(blob);
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
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    try {
      str = btoa(atob(str));
    } catch(err) {
      console.log("Failed to base64 re-encode string.", err);
      str = null;
    }
  }
  return str;
}

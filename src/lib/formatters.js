import React from 'react';
import { defineMessages } from 'react-intl';

import { Drafty } from 'tinode-sdk';

import AudioPlayer from '../widgets/audio-player.jsx'
import LazyImage from '../widgets/lazy-image.jsx'
import UploadingImage from '../widgets/uploading-image.jsx'

import { IMAGE_THUMBNAIL_DIM, BROKEN_IMAGE_SIZE, REM_SIZE } from '../config.js';
import { base64ToBlob, blobToBase64, fitImageSize, imageScaled } from './blob-helpers.js';
import { idToColorClass, secondsToTime, shortenFileName } from './strformat.js';
import { cancelablePromise, sanitizeUrlForMime } from './utils.js';

const messages = defineMessages({
  drafty_form: {
    id: 'drafty_form',
    defaultMessage: 'Form: ',
    description: 'Comment for form in drafty'
  },
  drafty_attachment: {
    id: 'drafty_attachment',
    defaultMessage: 'Attachment',
    description: 'Comment for attachment in drafty'
  },
  drafty_image: {
    id: 'drafty_image',
    defaultMessage: 'Picture',
    description: 'Comment for embedded images in drafty'
  },
  drafty_unknown: {
    id: 'drafty_unknown',
    defaultMessage: 'Unsupported',
    description: 'Unsupported entity in drafty'
  }
});

// Additional processing of image data.
function handleImageData(el, data, attr) {
  if (!data) {
    attr.src = 'img/broken_image.png';
    attr.style = {
      width: IMAGE_THUMBNAIL_DIM + 'px',
      height: IMAGE_THUMBNAIL_DIM + 'px',
    };
    return el;
  }

  attr.className = 'inline-image';
  const dim = fitImageSize(data.width, data.height,
    this.viewportWidth > 0 ? Math.min(this.viewportWidth - REM_SIZE * 6.5, REM_SIZE * 34.5) :
      REM_SIZE * 34.5, REM_SIZE * 24, false) ||
      {dstWidth: BROKEN_IMAGE_SIZE, dstHeight: BROKEN_IMAGE_SIZE};
  attr.style = {
    width: dim.dstWidth + 'px',
    height: dim.dstHeight + 'px',
    // Looks like a Chrome bug: broken image does not respect 'width' and 'height'.
    minWidth: dim.dstWidth + 'px',
    minHeight: dim.dstHeight + 'px'
  };
  if (!Drafty.isProcessing(data)) {
    attr.src = this.authorizeURL(sanitizeUrlForMime(attr.src, 'image'));
    attr.alt = data.name;
    if (attr.src) {
      if (Math.max(data.width || 0, data.height || 0) > IMAGE_THUMBNAIL_DIM) {
        // Allow previews for large enough images.
        attr.onClick = this.onImagePreview;
        attr.className += ' image-clickable';
      }
      attr.loading = 'lazy';
    } else {
      attr.src = 'img/broken_image.png';
    }
  } else {
    // Use custom element instead of <img>.
    el = UploadingImage;
  }

  return el;
}

// The main Drafty formatter: converts Drafty elements into React classes. 'this' is set by the caller.
// 'this' must contain:
//    viewportWidth: this.props.viewportWidth;
//    authorizeURL: this.props.tinode.authorizeURL
//    onImagePreview: this.handleImagePreview
//    onFormButtonClick: this.handleFormButtonClick
//    onQuoteClick: this.handleQuoteClick (optional)
export function fullFormatter(style, data, values, key, stack) {
  if (stack.includes('QQ')) {
    return quoteFormatter.call(this, style, data, values, key);
  }

  if (!style) {
    // Unformatted.
    return values;
  }

  let el = Drafty.tagName(style);
  let attr = Drafty.attrValue(style, data) || {};
  attr.key = key;
  switch (style) {
    case 'AU':
      // Show audio player.
      if (attr.src) {
        attr.src = this.authorizeURL(sanitizeUrlForMime(attr.src, 'audio'));
        attr.duration = data.duration > 0 ? (data.duration | 0) : undefined;
        attr.preview = data.preview;
        attr.loading = 'lazy';
      }
      el = AudioPlayer;
      // Audio element cannot have content.
      values = null;
      break;
    case 'BR':
      values = null;
      break;
    case 'EX':
      // Ignore.
      break;
    case 'HL':
      // Highlighted text. Assign class name.
      attr.className = 'highlight';
      break;
    case 'HD':
      el = null;
      values = null;
      break;
    case 'IM':
      // Additional processing for images
      el = handleImageData.call(this, el, data, attr);
      // Image element cannot have content.
      values = null;
      break;
    case 'BN':
      // Button
      attr.onClick = this.onFormButtonClick;
      let inner = React.Children.map(values, (child) => {
        return typeof child == 'string' ? child : undefined;
      });
      if (!inner || inner.length == 0) {
        inner = [attr.name]
      }
      // Get text which will be sent back when the button is clicked.
      attr['data-title'] = inner.join('');
      break;
    case 'MN':
      // Mention
      attr.className = 'mention'
      if (data) {
        attr.className += ' ' + idToColorClass(data.val, false, true);
      }
      break;
    case 'FM':
      // Form
      attr.className = 'bot-form';
      break;
    case 'RW':
      // Form element formatting is dependent on element content.
      break;
    case 'QQ':
      // Quote/citation.
      attr.className = 'reply-quote'
      attr.onClick = this.onQuoteClick;
      break;
    default:
      if (!el) {
        // Unknown element.
        el = React.Fragment;
        attr = {key: key};
        // Generate comment for unknown element.
        let body = values;
        if (!Array.isArray(values) || !values.join('').trim()) {
          body = [<span key="x1" className="gray">{this.formatMessage(messages.drafty_unknown)}</span>];
        }
        values = [<i key="x0" className="material-icons gray">extension</i>, ' '].concat(body);
      }
      break;
  }
  if (!el) {
    return values;
  }
  return React.createElement(el, attr, values);
}

// Converts Drafty object into a one-line preview. 'this' is set by the caller.
// 'this' must contain:
//    formatMessage: this.props.intl.formatMessage
//    messages: formatjs messages defined with defineMessages.
export function previewFormatter(style, data, values, key) {
  if (!style) {
    // Unformatted.
    return values;
  }

  let el = Drafty.tagName(style);
  const attr = { key: key };
  switch (style) {
    case 'AU':
      // Voicemail as '[mic] 0:00'.
      el = React.Fragment;
      values = [<i key="au" className="material-icons">mic</i>, ' ', secondsToTime(data.duration/1000)];
      break;
    case 'BR':
      // Replace new line with a space.
      el = React.Fragment;
      values = [' '];
      break;
    case 'HL':
      // Make highlight less prominent in preview.
      attr.className = 'highlight preview';
      break;
    case 'LN':
    case 'MN':
      // Disable links in previews.
      el = 'span';
      break;
    case 'IM':
      // Replace image with '[icon] Image'.
      el = React.Fragment;
      values = [<i key="im" className="material-icons">photo</i>, ' ', this.formatMessage(messages.drafty_image)];
      break;
    case 'BN':
      el = 'span';
      attr.className = 'flat-button faux';
      break;
    case 'FM':
      el = React.Fragment;
      values = [<i key="fm" className="material-icons">dashboard</i>,
        this.formatMessage(messages.drafty_form)].concat(' ', values || []);
      break;
    case 'RW':
      el = React.Fragment;
      break;
    case 'EX':
      if (data) {
        if (data.mime == 'application/json') {
          // Ignore JSON attachments: they are form response payloads.
          return null;
        }
        // Clear payload.
        delete data.val;
        delete data.ref;
      }
      el = React.Fragment;
      values = [<i key="ex" className="material-icons">attachment</i>, ' ', this.formatMessage(messages.drafty_attachment)];
      break;
    case 'QQ':
    case 'HD':
      el = null;
      values = null;
      break;
    default:
      if (!el) {
        // Unknown element.
        el = React.Fragment;
        values = [<i key="x0" className="material-icons gray">extension</i>, ' ', this.formatMessage(messages.drafty_unknown)];
      }
      break;
  }
  if (!el) {
    return values;
  }
  return React.createElement(el, attr, values);
};

// Converts Drafty object into a quoted reply. 'this' is set by the caller.
function inlineImageAttr(attr, data) {
  attr.style = {
    width: IMAGE_THUMBNAIL_DIM + 'px',
    height: IMAGE_THUMBNAIL_DIM + 'px',
    maxWidth: IMAGE_THUMBNAIL_DIM + 'px',
    maxHeight: IMAGE_THUMBNAIL_DIM + 'px',
  }
  attr.className = 'inline-image';
  attr.alt = this.formatMessage(messages.drafty_image);
  if (!data) {
    attr.src = 'img/broken_image.png';
  }
  attr.title = attr.alt;
  return attr;
}

// Displays a portion of Drafty within 'QQ' quotes. 'this' is set by the caller.
// 'this' must contain:
//    formatMessage: this.props.intl.formatMessage
//    messages: formatjs messages defined with defineMessages.
//    authorizeURL: this.props.tinode.authorizeURL
//    onQuoteClick: this.handleQuoteClick (optional)
function quoteFormatter(style, data, values, key) {
  if (['BR', 'EX', 'IM', 'MN'].includes(style)) {
    let el = Drafty.tagName(style);
    let attr = Drafty.attrValue(style, data) || {};
    attr.key = key;
    switch(style) {
      case 'BR':
        values = null;
        break;
      case 'IM':
        attr = inlineImageAttr.call(this, attr, data);
        values = [React.createElement('img', attr, null), ' ', attr.alt];
        el = React.Fragment;
        // Fragment attributes.
        attr = {key: key};
        break;
      case 'MN':
        el = 'span';
        attr.className = 'mention'
        if (data) {
          attr.className += ' ' + idToColorClass(data.val, false, true);
        }
        break;
      case 'EX':
        let fname;
        if (data) {
          if (data.mime == 'application/json') {
            // Ignore JSON attachments: they are form response payloads.
            return null;
          }
          fname = data.name;
          // Clear payload.
          delete data.val;
          delete data.ref;
        }
        el = React.Fragment;
        values = [<i key="ex" className="material-icons">attachment</i>,
          shortenFileName(fname, 16) || this.formatMessage(messages.drafty_attachment)];
        break;
    }
    return React.createElement(el, attr, values);
  }
  return previewFormatter.call(this, style, data, values, key);
}

// Create image thumbnail suitable for inclusion in a quote.
function quoteImage(data) {
  let promise;
  // Get the blob from the image data.
  if (data.val) {
    const blob = base64ToBlob(data.val, data.mime);
    if (!blob) {
      throw new Error("Invalid image");
    }
    promise = Promise.resolve(blob);
  } else if (data.ref) {
    promise = fetch(this.authorizeURL(sanitizeUrlForMime(data.ref, 'image')))
      .then(evt => {
        if (evt.ok) {
          return evt.blob();
        } else {
          throw new Error(`Image fetch unsuccessful: ${evt.status} ${evt.statusText}`);
        }
      });
  } else {
    throw new Error("Missing image data");
  }

  // Scale the blob.
  return promise
    .then(blob => {
      // Cut the square from the center of the image and shrink it.
      return imageScaled(blob, IMAGE_THUMBNAIL_DIM, IMAGE_THUMBNAIL_DIM, -1, true)
    }).then(scaled => {
      data.mime = scaled.mime;
      data.size = scaled.blob.size;
      data.width = scaled.width;
      data.height = scaled.height;
      delete data.ref;
      // Keeping the original file name, if provided: ex.data.name;

      data.src = URL.createObjectURL(scaled.blob);
      return blobToBase64(scaled.blob);
    }).then(b64 => {
      data.val = b64.bits;
      return data;
    }).catch(err => {
      delete data.val;
      delete data.src;
      data.width = IMAGE_THUMBNAIL_DIM;
      data.height = IMAGE_THUMBNAIL_DIM;
      // Rethrow.
      throw err;
    });
}

// Create a preview of a reply.
export function replyFormatter(style, data, values, key, stack) {
  if (style == 'IM') {
    const attr = inlineImageAttr.call(this, {key: key}, data);
    let loadedPromise;
    try {
      loadedPromise = cancelablePromise(quoteImage.call(this, data));
    } catch (error) {
      loadedPromise = cancelablePromise(error);
    }
    attr.whenDone = loadedPromise;
    values = [React.createElement(LazyImage, attr, null), ' ', attr.alt];
    return React.createElement(React.Fragment, {key: key}, values);
  } else if (style == 'QQ') {
    if (stack.includes('QQ')) {
      // Quote inside quote when forwarding a message.
      return React.createElement('span', {key: key},
        [<i key="qq" className="material-icons">format_quote</i>, ' ']);
    }

    const attr = Drafty.attrValue('QQ', data) || {};
    attr.key = key;
    attr.className = 'reply-quote'
    return React.createElement(Drafty.tagName('QQ'), attr, values);
  }
  return quoteFormatter.call(this, style, data, values, key);
}

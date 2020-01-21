(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Tinode = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * @copyright 2015-2019 Tinode
 * @summary Minimally rich text representation and formatting for Tinode.
 * @license Apache 2.0
 * @version 0.16
 *
 * @file Basic parser and formatter for very simple text markup. Mostly targeted at
 * mobile use cases similar to Telegram, WhatsApp, and FB Messenger.
 *
 * <p>Supports conversion of user keyboard input to formatted text:</p>
 * <ul>
 *   <li>*abc* &rarr; <b>abc</b></li>
 *   <li>_abc_ &rarr; <i>abc</i></li>
 *   <li>~abc~ &rarr; <del>abc</del></li>
 *   <li>`abc` &rarr; <tt>abc</tt></li>
 * </ul>
 * Also supports forms and buttons.
 *
 * Nested formatting is supported, e.g. *abc _def_* -> <b>abc <i>def</i></b>
 * URLs, @mentions, and #hashtags are extracted and converted into links.
 * Forms and buttons can be added procedurally.
 * JSON data representation is inspired by Draft.js raw formatting.
 *
 *
 * @example
 * Text:
 * <pre>
 *     this is *bold*, `code` and _italic_, ~strike~
 *     combined *bold and _italic_*
 *     an url: https://www.example.com/abc#fragment and another _www.tinode.co_
 *     this is a @mention and a #hashtag in a string
 *     second #hashtag
 * </pre>
 *
 *  Sample JSON representation of the text above:
 *  {
 *     "txt": "this is bold, code and italic, strike combined bold and italic an url: https://www.example.com/abc#fragment " +
 *             "and another www.tinode.co this is a @mention and a #hashtag in a string second #hashtag",
 *     "fmt": [
 *         { "at":8, "len":4,"tp":"ST" },{ "at":14, "len":4, "tp":"CO" },{ "at":23, "len":6, "tp":"EM"},
 *         { "at":31, "len":6, "tp":"DL" },{ "tp":"BR", "len":1, "at":37 },{ "at":56, "len":6, "tp":"EM" },
 *         { "at":47, "len":15, "tp":"ST" },{ "tp":"BR", "len":1, "at":62 },{ "at":120, "len":13, "tp":"EM" },
 *         { "at":71, "len":36, "key":0 },{ "at":120, "len":13, "key":1 },{ "tp":"BR", "len":1, "at":133 },
 *         { "at":144, "len":8, "key":2 },{ "at":159, "len":8, "key":3 },{ "tp":"BR", "len":1, "at":179 },
 *         { "at":187, "len":8, "key":3 },{ "tp":"BR", "len":1, "at":195 }
 *     ],
 *     "ent": [
 *         { "tp":"LN", "data":{ "url":"https://www.example.com/abc#fragment" } },
 *         { "tp":"LN", "data":{ "url":"http://www.tinode.co" } },
 *         { "tp":"MN", "data":{ "val":"mention" } },
 *         { "tp":"HT", "data":{ "val":"hashtag" } }
 *     ]
 *  }
 */

'use strict';

const MAX_FORM_ELEMENTS = 8;
const JSON_MIME_TYPE = 'application/json';

// Regular expressions for parsing inline formats. Javascript does not support lookbehind,
// so it's a bit messy.
const INLINE_STYLES = [
  // Strong = bold, *bold text*
  {
    name: 'ST',
    start: /(?:^|[\W_])(\*)[^\s*]/,
    end: /[^\s*](\*)(?=$|[\W_])/
  },
  // Emphesized = italic, _italic text_
  {
    name: 'EM',
    start: /(?:^|\W)(_)[^\s_]/,
    end: /[^\s_](_)(?=$|\W)/
  },
  // Deleted, ~strike this though~
  {
    name: 'DL',
    start: /(?:^|[\W_])(~)[^\s~]/,
    end: /[^\s~](~)(?=$|[\W_])/
  },
  // Code block `this is monospace`
  {
    name: 'CO',
    start: /(?:^|\W)(`)[^`]/,
    end: /[^`](`)(?=$|\W)/
  }
];

// RegExps for entity extraction (RF = reference)
const ENTITY_TYPES = [
  // URLs
  {
    name: 'LN',
    dataName: 'url',
    pack: function(val) {
      // Check if the protocol is specified, if not use http
      if (!/^[a-z]+:\/\//i.test(val)) {
        val = 'http://' + val;
      }
      return {
        url: val
      };
    },
    re: /(?:(?:https?|ftp):\/\/|www\.|ftp\.)[-A-Z0-9+&@#\/%=~_|$?!:,.]*[A-Z0-9+&@#\/%=~_|$]/ig
  },
  // Mentions @user (must be 2 or more characters)
  {
    name: 'MN',
    dataName: 'val',
    pack: function(val) {
      return {
        val: val.slice(1)
      };
    },
    re: /\B@(\w\w+)/g
  },
  // Hashtags #hashtag, like metion 2 or more characters.
  {
    name: 'HT',
    dataName: 'val',
    pack: function(val) {
      return {
        val: val.slice(1)
      };
    },
    re: /\B#(\w\w+)/g
  }
];

// HTML tag name suggestions
const HTML_TAGS = {
  ST: {
    name: 'b',
    isVoid: false
  },
  EM: {
    name: 'i',
    isVoid: false
  },
  DL: {
    name: 'del',
    isVoid: false
  },
  CO: {
    name: 'tt',
    isVoid: false
  },
  BR: {
    name: 'br',
    isVoid: true
  },
  LN: {
    name: 'a',
    isVoid: false
  },
  MN: {
    name: 'a',
    isVoid: false
  },
  HT: {
    name: 'a',
    isVoid: false
  },
  IM: {
    name: 'img',
    isVoid: true
  },
  FM: {
    name: 'div',
    isVoid: false
  },
  RW: {
    name: 'div',
    isVoid: false,
  },
  BN: {
    name: 'button',
    isVoid: false
  },
  HD: {
    name: '',
    isVoid: false
  }
};

// Convert base64-encoded string into Blob.
function base64toObjectUrl(b64, contentType) {
  let bin;
  try {
    bin = atob(b64);
    let length = bin.length;
    let buf = new ArrayBuffer(length);
    let arr = new Uint8Array(buf);
    for (let i = 0; i < length; i++) {
      arr[i] = bin.charCodeAt(i);
    }

    return URL.createObjectURL(new Blob([buf], {
      type: contentType
    }));
  } catch (err) {
    console.log("Drafty: failed to convert object.", err.message);
  }

  return null;
}

// Helpers for converting Drafty to HTML.
const DECORATORS = {
  // Visial styles
  ST: {
    open: function() {
      return '<b>';
    },
    close: function() {
      return '</b>';
    }
  },
  EM: {
    open: function() {
      return '<i>';
    },
    close: function() {
      return '</i>'
    }
  },
  DL: {
    open: function() {
      return '<del>';
    },
    close: function() {
      return '</del>'
    }
  },
  CO: {
    open: function() {
      return '<tt>';
    },
    close: function() {
      return '</tt>'
    }
  },
  // Line break
  BR: {
    open: function() {
      return '<br/>';
    },
    close: function() {
      return ''
    }
  },
  // Hidden element
  HD: {
    open: function() {
      return '';
    },
    close: function() {
      return '';
    }
  },
  // Link (URL)
  LN: {
    open: function(data) {
      return '<a href="' + data.url + '">';
    },
    close: function(data) {
      return '</a>';
    },
    props: function(data) {
      return data ? {
        href: data.url,
        target: "_blank"
      } : null;
    },
  },
  // Mention
  MN: {
    open: function(data) {
      return '<a href="#' + data.val + '">';
    },
    close: function(data) {
      return '</a>';
    },
    props: function(data) {
      return data ? {
        name: data.val
      } : null;
    },
  },
  // Hashtag
  HT: {
    open: function(data) {
      return '<a href="#' + data.val + '">';
    },
    close: function(data) {
      return '</a>';
    },
    props: function(data) {
      return data ? {
        name: data.val
      } : null;
    },
  },
  // Button
  BN: {
    open: function(data) {
      return '<button>';
    },
    close: function(data) {
      return '</button>';
    },
    props: function(data) {
      return data ? {
        'data-act': data.act,
        'data-val': data.val,
        'data-name': data.name,
        'data-ref': data.ref
      } : null;
    },
  },
  // Image
  IM: {
    open: function(data) {
      // Don't use data.ref for preview: it's a security risk.
      const previewUrl = base64toObjectUrl(data.val, data.mime);
      const downloadUrl = data.ref ? data.ref : previewUrl;
      return (data.name ? '<a href="' + downloadUrl + '" download="' + data.name + '">' : '') +
        '<img src="' + previewUrl + '"' +
        (data.width ? ' width="' + data.width + '"' : '') +
        (data.height ? ' height="' + data.height + '"' : '') + ' border="0" />';
    },
    close: function(data) {
      return (data.name ? '</a>' : '');
    },
    props: function(data) {
      if (!data) return null;
      let url = base64toObjectUrl(data.val, data.mime);
      return {
        src: url,
        title: data.name,
        'data-width': data.width,
        'data-height': data.height,
        'data-name': data.name,
        'data-size': data.val ? (data.val.length * 0.75) | 0 : 0,
        'data-mime': data.mime
      };
    },
  },
  // Form - structured layout of elements.
  FM: {
    open: function(data) {
      return '<div>';
    },
    close: function(data) {
      return '</div>';
    }
  },
  // Row: logic grouping of elements
  RW: {
    open: function(data) {
      return '<div>';
    },
    close: function(data) {
      return '</div>';
    }
  }
};

/**
 * The main object which performs all the formatting actions.
 * @class Drafty
 * @constructor
 */
var Drafty = function() {}

// Take a string and defined earlier style spans, re-compose them into a tree where each leaf is
// a same-style (including unstyled) string. I.e. 'hello *bold _italic_* and ~more~ world' ->
// ('hello ', (b: 'bold ', (i: 'italic')), ' and ', (s: 'more'), ' world');
//
// This is needed in order to clear markup, i.e. 'hello *world*' -> 'hello world' and convert
// ranges from markup-ed offsets to plain text offsets.
function chunkify(line, start, end, spans) {
  var chunks = [];

  if (spans.length == 0) {
    return [];
  }

  for (var i in spans) {
    // Get the next chunk from the queue
    var span = spans[i];

    // Grab the initial unstyled chunk
    if (span.start > start) {
      chunks.push({
        text: line.slice(start, span.start)
      });
    }

    // Grab the styled chunk. It may include subchunks.
    var chunk = {
      type: span.type
    };
    var chld = chunkify(line, span.start + 1, span.end, span.children);
    if (chld.length > 0) {
      chunk.children = chld;
    } else {
      chunk.text = span.text;
    }
    chunks.push(chunk);
    start = span.end + 1; // '+1' is to skip the formatting character
  }

  // Grab the remaining unstyled chunk, after the last span
  if (start < end) {
    chunks.push({
      text: line.slice(start, end)
    });
  }

  return chunks;
}

// Inverse of chunkify. Returns a tree of formatted spans.
function forEach(line, start, end, spans, formatter, context) {
  let result = [];

  // Process ranges calling formatter for each range.
  for (let i = 0; i < spans.length; i++) {
    let span = spans[i];
    if (span.at < 0) {
      // throw out non-visual spans.
      continue;
    }
    // Add un-styled range before the styled span starts.
    if (start < span.at) {
      result.push(formatter.call(context, null, undefined, line.slice(start, span.at), result.length));
      start = span.at;
    }
    // Get all spans which are within current span.
    const subspans = [];
    for (let si = i + 1; si < spans.length && spans[si].at < span.at + span.len; si++) {
      subspans.push(spans[si]);
      i = si;
    }

    const tag = HTML_TAGS[span.tp] || {}
    result.push(formatter.call(context, span.tp, span.data,
      tag.isVoid ? null : forEach(line, start, span.at + span.len, subspans, formatter, context),
      result.length));

    start = span.at + span.len;
  }

  // Add the last unformatted range.
  if (start < end) {
    result.push(formatter.call(context, null, undefined, line.slice(start, end), result.length));
  }

  return result;
}

// Detect starts and ends of formatting spans. Unformatted spans are
// ignored at this stage.
function spannify(original, re_start, re_end, type) {
  let result = [];
  let index = 0;
  let line = original.slice(0); // make a copy;

  while (line.length > 0) {
    // match[0]; // match, like '*abc*'
    // match[1]; // match captured in parenthesis, like 'abc'
    // match['index']; // offset where the match started.

    // Find the opening token.
    let start = re_start.exec(line);
    if (start == null) {
      break;
    }

    // Because javascript RegExp does not support lookbehind, the actual offset may not point
    // at the markup character. Find it in the matched string.
    let start_offset = start['index'] + start[0].lastIndexOf(start[1]);
    // Clip the processed part of the string.
    line = line.slice(start_offset + 1);
    // start_offset is an offset within the clipped string. Convert to original index.
    start_offset += index;
    // Index now point to the beginning of 'line' within the 'original' string.
    index = start_offset + 1;

    // Find the matching closing token.
    let end = re_end ? re_end.exec(line) : null;
    if (end == null) {
      break;
    }
    let end_offset = end['index'] + end[0].indexOf(end[1]);
    // Clip the processed part of the string.
    line = line.slice(end_offset + 1);
    // Update offsets
    end_offset += index;
    // Index now point to the beginning of 'line' within the 'original' string.
    index = end_offset + 1;

    result.push({
      text: original.slice(start_offset + 1, end_offset),
      children: [],
      start: start_offset,
      end: end_offset,
      type: type
    });
  }

  return result;
}

// Convert linear array or spans into a tree representation.
// Keep standalone and nested spans, throw away partially overlapping spans.
function toTree(spans) {
  if (spans.length == 0) {
    return [];
  }

  var tree = [spans[0]];
  var last = spans[0];
  for (var i = 1; i < spans.length; i++) {
    // Keep spans which start after the end of the previous span or those which
    // are complete within the previous span.

    if (spans[i].start > last.end) {
      // Span is completely outside of the previous span.
      tree.push(spans[i]);
      last = spans[i];
    } else if (spans[i].end < last.end) {
      // Span is fully inside of the previous span. Push to subnode.
      last.children.push(spans[i]);
    }
    // Span could partially overlap, ignoring it as invalid.
  }

  // Recursively rearrange the subnodes.
  for (var i in tree) {
    tree[i].children = toTree(tree[i].children);
  }

  return tree;
}

// Get a list of entities from a text.
function extractEntities(line) {
  var match;
  var extracted = [];
  ENTITY_TYPES.map(function(entity) {
    while ((match = entity.re.exec(line)) !== null) {
      extracted.push({
        offset: match['index'],
        len: match[0].length,
        unique: match[0],
        data: entity.pack(match[0]),
        type: entity.name
      });
    }
  });

  if (extracted.length == 0) {
    return extracted;
  }

  // Remove entities detected inside other entities, like #hashtag in a URL.
  extracted.sort(function(a, b) {
    return a.offset - b.offset;
  });

  var idx = -1;
  extracted = extracted.filter(function(el) {
    var result = (el.offset > idx);
    idx = el.offset + el.len;
    return result;
  });

  return extracted;
}

// Convert the chunks into format suitable for serialization.
function draftify(chunks, startAt) {
  var plain = "";
  var ranges = [];
  for (var i in chunks) {
    var chunk = chunks[i];
    if (!chunk.text) {
      var drafty = draftify(chunk.children, plain.length + startAt);
      chunk.text = drafty.txt;
      ranges = ranges.concat(drafty.fmt);
    }

    if (chunk.type) {
      ranges.push({
        at: plain.length + startAt,
        len: chunk.text.length,
        tp: chunk.type
      });
    }

    plain += chunk.text;
  }
  return {
    txt: plain,
    fmt: ranges
  };
}

// Splice two strings: insert second string into the first one at the given index
function splice(src, at, insert) {
  return src.slice(0, at) + insert + src.slice(at);
}

/**
 * Parse plain text into Drafty document.
 * @memberof Drafty
 * @static
 *
 * @param {String} content plain-text content to parse.
 * @return {Drafty} parsed object or null if the source is not plain text.
 */
Drafty.parse = function(content) {
  // Make sure we are parsing strings only.
  if (typeof content != 'string') {
    return null;
  }

  // Split text into lines. It makes further processing easier.
  var lines = content.split(/\r?\n/);

  // Holds entities referenced from text
  var entityMap = [];
  var entityIndex = {};

  // Processing lines one by one, hold intermediate result in blx.
  var blx = [];
  lines.map(function(line) {
    var spans = [];
    var entities = [];

    // Find formatted spans in the string.
    // Try to match each style.
    INLINE_STYLES.map(function(style) {
      // Each style could be matched multiple times.
      spans = spans.concat(spannify(line, style.start, style.end, style.name));
    });

    var block;
    if (spans.length == 0) {
      block = {
        txt: line
      };
    } else {
      // Sort spans by style occurence early -> late
      spans.sort(function(a, b) {
        return a.start - b.start;
      });

      // Convert an array of possibly overlapping spans into a tree
      spans = toTree(spans);

      // Build a tree representation of the entire string, not
      // just the formatted parts.
      var chunks = chunkify(line, 0, line.length, spans);

      var drafty = draftify(chunks, 0);

      block = {
        txt: drafty.txt,
        fmt: drafty.fmt
      };
    }

    // Extract entities from the cleaned up string.
    entities = extractEntities(block.txt);
    if (entities.length > 0) {
      var ranges = [];
      for (var i in entities) {
        // {offset: match['index'], unique: match[0], len: match[0].length, data: ent.packer(), type: ent.name}
        var entity = entities[i];
        var index = entityIndex[entity.unique];
        if (!index) {
          index = entityMap.length;
          entityIndex[entity.unique] = index;
          entityMap.push({
            tp: entity.type,
            data: entity.data
          });
        }
        ranges.push({
          at: entity.offset,
          len: entity.len,
          key: index
        });
      }
      block.ent = ranges;
    }

    blx.push(block);
  });

  var result = {
    txt: ""
  };

  // Merge lines and save line breaks as BR inline formatting.
  if (blx.length > 0) {
    result.txt = blx[0].txt;
    result.fmt = (blx[0].fmt || []).concat(blx[0].ent || []);

    for (var i = 1; i < blx.length; i++) {
      var block = blx[i];
      var offset = result.txt.length + 1;

      result.fmt.push({
        tp: 'BR',
        len: 1,
        at: offset - 1
      });

      result.txt += " " + block.txt;
      if (block.fmt) {
        result.fmt = result.fmt.concat(block.fmt.map(function(s) {
          s.at += offset;
          return s;
        }));
      }
      if (block.ent) {
        result.fmt = result.fmt.concat(block.ent.map(function(s) {
          s.at += offset;
          return s;
        }));
      }
    }

    if (result.fmt.length == 0) {
      delete result.fmt;
    }

    if (entityMap.length > 0) {
      result.ent = entityMap;
    }
  }
  return result;
}

/**
 * Initialize Drafty document to a plain text string.
 *
 * @param {String} plainText string to use as Drafty content.
 *
 * @returns new Drafty document or null is plainText is not a string.
 */
Drafty.init = function(plainText) {
  if (typeof plainText != 'string') {
    return null;
  }
  return {
    txt: plainText
  };
}

/**
 * Append one Drafty document to another.
 *
 * @param {Drafty} first Drafty document to append to.
 * @param {Drafty} second Drafty document being appended.
 *
 * @return {Drafty} first document with the second appended to it.
 */
Drafty.append = function(first, second) {
  if (first == null) {
    return second;
  }
  if (second == null) {
    return first;
  }

  first.txt = first.txt || '';
  second.txt = second.txt || '';
  const len = first.txt.length;

  first.txt += second.txt;
  if (Array.isArray(second.fmt)) {
    first.fmt = first.fmt || [];
    if (Array.isArray(second.ent)) {
      first.ent = first.ent || [];
    }
    second.fmt.forEach(src => {
      const fmt = {
        at: src.at + len,
        len: src.len
      };
      if (src.tp) {
        fmt.tp = src.tp;
      } else {
        fmt.key = first.ent.length;
        first.ent.push(second.ent[src.key || 0]);
      }
      first.fmt.push(fmt);
    });
  }

  return first;
}

/**
 * Insert inline image into Drafty document.
 * @memberof Drafty
 * @static
 *
 * @param {Drafty} content object to add image to.
 * @param {integer} at index where the object is inserted. The length of the image is always 1.
 * @param {string} mime mime-type of the image, e.g. "image/png"
 * @param {string} base64bits base64-encoded image content (or preview, if large image is attached)
 * @param {integer} width width of the image
 * @param {integer} height height of the image
 * @param {string} fname file name suggestion for downloading the image.
 * @param {integer} size size of the external file. Treat is as an untrusted hint.
 * @param {string} refurl reference to the content. Could be null or undefined.
 *
 * @return {Drafty} updated content.
 */
Drafty.insertImage = function(content, at, mime, base64bits, width, height, fname, size, refurl) {
  content = content || {
    txt: " "
  };
  content.ent = content.ent || [];
  content.fmt = content.fmt || [];

  content.fmt.push({
    at: at,
    len: 1,
    key: content.ent.length
  });
  content.ent.push({
    tp: 'IM',
    data: {
      mime: mime,
      val: base64bits,
      width: width,
      height: height,
      name: fname,
      ref: refurl,
      size: size | 0
    }
  });

  return content;
}

/**
 * Append image to Drafty content.
 * @memberof Drafty
 * @static
 *
 * @param {Drafty} content object to add image to.
 * @param {string} mime mime-type of the image, e.g. "image/png"
 * @param {string} base64bits base64-encoded image content (or preview, if large image is attached)
 * @param {integer} width width of the image
 * @param {integer} height height of the image
 * @param {string} fname file name suggestion for downloading the image.
 * @param {integer} size size of the external file. Treat is as an untrusted hint.
 * @param {string} refurl reference to the content. Could be null or undefined.
 *
 * @return {Drafty} updated content.
 */
Drafty.appendImage = function(content, mime, base64bits, width, height, fname, size, refurl) {
  content = content || {
    txt: ""
  };
  content.txt += " ";
  return Drafty.insertImage(content, content.txt.length - 1, mime, base64bits, width, height, fname, size, refurl);
}

/**
 * Attach file to Drafty content. Either as a blob or as a reference.
 * @memberof Drafty
 * @static
 *
 * @param {Drafty} content object to attach file to.
 * @param {string} mime mime-type of the file, e.g. "image/png"
 * @param {string} base64bits base64-encoded file content
 * @param {string} fname file name suggestion for downloading.
 * @param {integer} size size of the external file. Treat is as an untrusted hint.
 * @param {string | Promise} refurl optional reference to the content.
 *
 * @return {Drafty} updated content.
 */
Drafty.attachFile = function(content, mime, base64bits, fname, size, refurl) {
  content = content || {
    txt: ""
  };
  content.ent = content.ent || [];
  content.fmt = content.fmt || [];

  content.fmt.push({
    at: -1,
    len: 0,
    key: content.ent.length
  });

  let ex = {
    tp: 'EX',
    data: {
      mime: mime,
      val: base64bits,
      name: fname,
      ref: refurl,
      size: size | 0
    }
  }
  if (refurl instanceof Promise) {
    ex.data.ref = refurl.then(
      (url) => {
        ex.data.ref = url;
      },
      (err) => {
        /* catch the error, otherwise it will appear in the console. */
      }
    );
  }
  content.ent.push(ex);

  return content;
}

/**
 * Wraps content into an interactive form.
 * @memberof Drafty
 * @static
 *
 * @param {Drafty|string} content to wrap into a form.
 * @param {number} at index where the forms starts.
 * @param {number} len length of the form content.
 *
 * @return {Drafty} updated content.
 */
Drafty.wrapAsForm = function(content, at, len) {
  if (typeof content == 'string') {
    content = {
      txt: content
    };
  }
  content.fmt = content.fmt || [];

  content.fmt.push({
    at: at,
    len: len,
    tp: 'FM'
  });

  return content;
}

/**
 * Insert clickable button into Drafty document.
 * @memberof Drafty
 * @static
 *
 * @param {Drafty|string} content is Drafty object to insert button to or a string to be used as button text.
 * @param {number} at is location where the button is inserted.
 * @param {number} len is the length of the text to be used as button title.
 * @param {string} name of the button. Client should return it to the server when the button is clicked.
 * @param {string} actionType is the type of the button, one of 'url' or 'pub'.
 * @param {string} actionValue is the value to return on click:
 * @param {string} refUrl is the URL to go to when the 'url' button is clicked.
 *
 * @return {Drafty} updated content.
 */
Drafty.insertButton = function(content, at, len, name, actionType, actionValue, refUrl) {
  if (typeof content == 'string') {
    content = {
      txt: content
    };
  }

  if (!content || !content.txt || content.txt.length < at + len) {
    return null;
  }

  if (len <= 0 || ['url', 'pub'].indexOf(actionType) == -1) {
    return null;
  }
  // Ensure refUrl is a string.
  if (actionType == 'url' && !refUrl) {
    return null;
  }
  refUrl = '' + refUrl;

  content.ent = content.ent || [];
  content.fmt = content.fmt || [];

  content.fmt.push({
    at: at,
    len: len,
    key: content.ent.length
  });
  content.ent.push({
    tp: 'BN',
    data: {
      act: actionType,
      val: actionValue,
      ref: refUrl,
      name: name
    }
  });

  return content;
}

/**
 * Append clickable button to Drafty document.
 * @memberof Drafty
 * @static
 *
 * @param {Drafty|string} content is Drafty object to insert button to or a string to be used as button text.
 * @param {string} title is the text to be used as button title.
 * @param {string} name of the button. Client should return it to the server when the button is clicked.
 * @param {string} actionType is the type of the button, one of 'url' or 'pub'.
 * @param {string} actionValue is the value to return on click:
 * @param {string} refUrl is the URL to go to when the 'url' button is clicked.
 *
 * @return {Drafty} updated content.
 */
Drafty.appendButton = function(content, title, name, actionType, actionValue, refUrl) {
  content = content || {
    txt: ""
  };
  let at = content.txt.length;
  content.txt += title;
  return Drafty.insertButton(content, at, title.length, name, actionType, actionValue, refUrl);
}

/**
 * Attach a generic JS object. The object is attached as a json string.
 * Intended for representing a form response.
 *
 * @memberof Drafty
 * @static
 *
 * @param {Drafty} content object to attach file to.
 * @param {Object} data to convert to json string and attach.
 */
Drafty.attachJSON = function(content, data) {
  content = content || {
    txt: ""
  };
  content.ent = content.ent || [];
  content.fmt = content.fmt || [];

  content.fmt.push({
    at: -1,
    len: 0,
    key: content.ent.length
  });

  content.ent.push({
    tp: 'EX',
    data: {
      mime: JSON_MIME_TYPE,
      val: data
    }
  });

  return content;
}

Drafty.appendLineBreak = function(content) {
  content = content || {
    txt: ""
  };
  content.fmt = content.fmt || [];
  content.fmt.push({
    at: content.txt.length,
    len: 1,
    tp: 'BR'
  });
  content.txt += " ";

  return content;
}
/**
 * Given the structured representation of rich text, convert it to HTML.
 * No attempt is made to strip pre-existing html markup.
 * This is potentially unsafe because `content.txt` may contain malicious
 * markup.
 * @memberof Tinode.Drafty
 * @static
 *
 * @param {drafy} content - structured representation of rich text.
 *
 * @return HTML-representation of content.
 */
Drafty.UNSAFE_toHTML = function(content) {
  var {
    txt,
    fmt,
    ent
  } = content;

  var markup = [];
  if (fmt) {
    for (let i in fmt) {
      let range = fmt[i];
      let tp = range.tp,
        data;
      if (!tp) {
        let entity = ent[range.key | 0];
        if (entity) {
          tp = entity.tp;
          data = entity.data;
        }
      }

      if (DECORATORS[tp]) {
        // Because we later sort in descending order, closing markup must come first.
        // Otherwise zero-length objects will not be represented correctly.
        markup.push({
          idx: range.at + range.len,
          len: -range.len,
          what: DECORATORS[tp].close(data)
        });
        markup.push({
          idx: range.at,
          len: range.len,
          what: DECORATORS[tp].open(data)
        });
      }
    }
  }

  markup.sort(function(a, b) {
    return b.idx == a.idx ? b.len - a.len : b.idx - a.idx; // in descending order
  });

  for (var i in markup) {
    if (markup[i].what) {
      txt = splice(txt, markup[i].idx, markup[i].what);
    }
  }

  return txt;
}

/**
 * Callback for applying custom formatting/transformation to a Drafty object.
 * Called once for each syle span.
 * @memberof Drafty
 * @static
 *
 * @callback Formatter
 * @param {string} style style code such as "ST" or "IM".
 * @param {Object} data entity's data
 * @param {Object} values possibly styled subspans contained in this style span.
 * @param {number} index of the current element among its siblings.
 */

/**
 * Transform Drafty using custom formatting.
 * @memberof Drafty
 * @static
 *
 * @param {Drafty} content - content to transform.
 * @param {Formatter} formatter - callback which transforms individual elements
 * @param {Object} context - context provided to formatter as 'this'.
 *
 * @return {Object} transformed object
 */
Drafty.format = function(content, formatter, context) {
  let {
    txt,
    fmt,
    ent
  } = content;

  // Assign default values.
  txt = txt || "";
  if (!Array.isArray(ent)) {
    ent = [];
  }

  if (!Array.isArray(fmt)) {
    // Handle special case when all values in fmt are 0 and fmt is skipped.
    if (ent.length == 1) {
      fmt = [{
        at: 0,
        len: 0,
        key: 0
      }];
    } else {
      return [txt];
    }
  }

  let spans = [].concat(fmt);

  // Zero values may have been stripped. Restore them.
  // Also ensure indexes and lengths are sane.
  spans.map(function(s) {
    s.at = s.at || 0;
    s.len = s.len || 0;
    if (s.len < 0) {
      s.len = 0;
    }
    if (s.at < -1) {
      s.at = -1;
    }
  });

  // Sort spans first by start index (asc) then by length (desc).
  spans.sort(function(a, b) {
    if (a.at - b.at == 0) {
      return b.len - a.len; // longer one comes first (<0)
    }
    return a.at - b.at;
  });

  // Denormalize entities into spans. Create a copy of the objects to leave
  // original Drafty object unchanged.
  spans = spans.map((s) => {
    let data;
    let tp = s.tp;
    if (!tp) {
      s.key = s.key || 0;
      if (ent[s.key]) {
        data = ent[s.key].data;
        tp = ent[s.key].tp;
      }
    }

    // Type still not defined? Hide invalid element.
    tp = tp || 'HD';

    return {
      tp: tp,
      data: data,
      at: s.at,
      len: s.len
    };
  });

  return forEach(txt, 0, txt.length, spans, formatter, context);
}

/**
 * Given structured representation of rich text, convert it to plain text.
 * @memberof Drafty
 * @static
 *
 * @param {Drafty} content - content to convert to plain text.
 */
Drafty.toPlainText = function(content) {
  return typeof content == 'string' ? content : content.txt;
}

/**
 * Returns true if content has no markup and no entities.
 * @memberof Drafty
 * @static
 *
 * @param {Drafty} content - content to check for presence of markup.
 * @returns true is content is plain text, false otherwise.
 */
Drafty.isPlainText = function(content) {
  return typeof content == 'string' || !(content.fmt || content.ent);
}

/**
 * Check if the drafty content has attachments.
 * @memberof Drafty
 * @static
 *
 * @param {Drafty} content - content to check for attachments.
 * @returns true if there are attachments.
 */
Drafty.hasAttachments = function(content) {
  if (content.ent && content.ent.length > 0) {
    for (var i in content.ent) {
      if (content.ent[i] && content.ent[i].tp == 'EX') {
        return true;
      }
    }
  }
  return false;
}

/**
 * Callback for applying custom formatting/transformation to a Drafty object.
 * Called once for each syle span.
 * @memberof Drafty
 * @static
 *
 * @callback AttachmentCallback
 * @param {Object} data attachment data
 * @param {number} index attachment's index in `content.ent`.
 */

/**
 * Enumerate attachments.
 * @memberof Drafty
 * @static
 *
 * @param {Drafty} content - drafty object to process for attachments.
 * @param {AttachmentCallback} callback - callback to call for each attachment.
 * @param {Object} content - value of "this" for callback.
 */
Drafty.attachments = function(content, callback, context) {
  if (content.ent && content.ent.length > 0) {
    for (var i in content.ent) {
      if (content.ent[i] && content.ent[i].tp == 'EX') {
        callback.call(context, content.ent[i].data, i);
      }
    }
  }
}

/**
 * Given the entity, get URL which can be used for downloading
 * entity data.
 * @memberof Drafty
 * @static
 *
 * @param {Object} entity.data to get the URl from.
 */
Drafty.getDownloadUrl = function(entData) {
  let url = null;
  if (entData.mime != JSON_MIME_TYPE && entData.val) {
    url = base64toObjectUrl(entData.val, entData.mime);
  } else if (typeof entData.ref == 'string') {
    url = entData.ref;
  }
  return url;
}

/**
 * Check if the entity data is being uploaded to the server.
 * @memberof Drafty
 * @static
 *
 * @param {Object} entity.data to get the URl from.
 * @returns {boolean} true if upload is in progress, false otherwise.
 */
Drafty.isUploading = function(entData) {
  return entData.ref instanceof Promise;
}

/**
 * Given the entity, get URL which can be used for previewing
 * the entity.
 * @memberof Drafty
 * @static
 *
 * @param {Object} entity.data to get the URl from.
 *
 * @returns {string} url for previewing or null if no such url is available.
 */
Drafty.getPreviewUrl = function(entData) {
  return entData.val ? base64toObjectUrl(entData.val, entData.mime) : null;
}

/**
 * Get approximate size of the entity.
 * @memberof Drafty
 * @static
 *
 * @param {Object} entity.data to get the size for.
 */
Drafty.getEntitySize = function(entData) {
  // Either size hint or length of value. The value is base64 encoded,
  // the actual object size is smaller than the encoded length.
  return entData.size ? entData.size : entData.val ? (entData.val.length * 0.75) | 0 : 0;
}

/**
 * Get entity mime type.
 * @memberof Drafty
 * @static
 *
 * @param {Object} entity.data to get the type for.
 */
Drafty.getEntityMimeType = function(entData) {
  return entData.mime || 'text/plain';
}

/**
 * Get HTML tag for a given two-letter style name
 * @memberof Drafty
 * @static
 *
 * @param {string} style - two-letter style, like ST or LN
 *
 * @returns {string} tag name
 */
Drafty.tagName = function(style) {
  return HTML_TAGS[style] ? HTML_TAGS[style].name : undefined;
}

/**
 * For a given data bundle generate an object with HTML attributes,
 * for instance, given {url: "http://www.example.com/"} return
 * {href: "http://www.example.com/"}
 * @memberof Drafty
 * @static
 *
 * @param {string} style - tw-letter style to generate attributes for.
 * @param {Object} data - data bundle to convert to attributes
 *
 * @returns {Object} object with HTML attributes.
 */
Drafty.attrValue = function(style, data) {
  if (data && DECORATORS[style]) {
    return DECORATORS[style].props(data);
  }

  return undefined;
}

/**
 * Drafty MIME type.
 * @memberof Drafty
 * @static
 *
 * @returns {string} HTTP Content-Type "text/x-drafty".
 */
Drafty.getContentType = function() {
  return 'text/x-drafty';
}

if (typeof module != 'undefined') {
  module.exports = Drafty;
}

},{}],2:[function(require,module,exports){
(function (global){
/**
 * @file SDK to connect to Tinode chat server.
 * See <a href="https://github.com/tinode/webapp">
 * https://github.com/tinode/webapp</a> for real-life usage.
 *
 * @copyright 2015-2019 Tinode
 * @summary Javascript bindings for Tinode.
 * @license Apache 2.0
 * @version 0.16
 *
 * @example
 * <head>
 * <script src=".../tinode.js"></script>
 * </head>
 *
 * <body>
 *  ...
 * <script>
 *  // Instantiate tinode.
 *  const tinode = new Tinode(APP_NAME, HOST, API_KEY, null, true);
 *  tinode.enableLogging(true);
 *  // Add logic to handle disconnects.
 *  tinode.onDisconnect = function(err) { ... };
 *  // Connect to the server.
 *  tinode.connect().then(() => {
 *    // Connected. Login now.
 *    return tinode.loginBasic(login, password);
 *  }).then((ctrl) => {
 *    // Logged in fine, attach callbacks, subscribe to 'me'.
 *    const me = tinode.getMeTopic();
 *    me.onMetaDesc = function(meta) { ... };
 *    // Subscribe, fetch topic description and the list of contacts.
 *    me.subscribe({get: {desc: {}, sub: {}});
 *  }).catch((err) => {
 *    // Login or subscription failed, do something.
 *    ...
 *  });
 *  ...
 * </script>
 * </body>
 */
'use strict';

// NOTE TO DEVELOPERS:
// Localizable strings should be double quoted "строка на другом языке",
// non-localizable strings should be single quoted 'non-localized'.

if (typeof require == 'function') {
  if (typeof Drafty == 'undefined') {
    var Drafty = require('./drafty.js');
  }
  var package_version = require('../version.json').version;
}

let WebSocketProvider;
if (typeof WebSocket != 'undefined') {
  WebSocketProvider = WebSocket;
}

let XHRProvider;
if (typeof XMLHttpRequest != 'undefined') {
  XHRProvider = XMLHttpRequest;
}
initForNonBrowserApp();

// Global constants
const PROTOCOL_VERSION = '0';
const VERSION = package_version || '0.16';
const LIBRARY = 'tinodejs/' + VERSION;

const TOPIC_NEW = 'new';
const TOPIC_ME = 'me';
const TOPIC_FND = 'fnd';
const TOPIC_SYS = 'sys';
const USER_NEW = 'new';

// Starting value of a locally-generated seqId used for pending messages.
const LOCAL_SEQID = 0xFFFFFFF;

const MESSAGE_STATUS_NONE = 0; // Status not assigned.
const MESSAGE_STATUS_QUEUED = 1; // Local ID assigned, in progress to be sent.
const MESSAGE_STATUS_SENDING = 2; // Transmission started.
const MESSAGE_STATUS_FAILED = 3; // At least one attempt was made to send the message.
const MESSAGE_STATUS_SENT = 4; // Delivered to the server.
const MESSAGE_STATUS_RECEIVED = 5; // Received by the client.
const MESSAGE_STATUS_READ = 6; // Read by the user.
const MESSAGE_STATUS_TO_ME = 7; // Message from another user.

// Error code to return in case of a network problem.
const NETWORK_ERROR = 503;
const NETWORK_ERROR_TEXT = "Connection failed";

// Reject unresolved futures after this many milliseconds.
const EXPIRE_PROMISES_TIMEOUT = 5000;
// Periodicity of garbage collection of unresolved futures.
const EXPIRE_PROMISES_PERIOD = 1000;

// Error code to return when user disconnected from server.
const NETWORK_USER = 418;
const NETWORK_USER_TEXT = "Disconnected by client";

// Utility functions

// Add brower missing function for non browser app, eg nodeJs
function initForNonBrowserApp() {
  // Tinode requirement in native mode because react native doesn't provide Base64 method
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  if (typeof btoa == 'undefined') {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    global.btoa = function(input = '') {
      let str = input;
      let output = '';

      for (let block = 0, charCode, i = 0, map = chars; str.charAt(i | 0) || (map = '=', i % 1); output += map.charAt(63 & block >> 8 - i % 1 * 8)) {

        charCode = str.charCodeAt(i += 3 / 4);

        if (charCode > 0xFF) {
          throw new Error("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
        }

        block = block << 8 | charCode;
      }

      return output;
    };
  }

  if (typeof atob == 'undefined') {
    global.atob = function(input = '') {
      let str = input.replace(/=+$/, '');
      let output = '';

      if (str.length % 4 == 1) {
        throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
      }
      for (let bc = 0, bs = 0, buffer, i = 0; buffer = str.charAt(i++);

        ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
          bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
      ) {
        buffer = chars.indexOf(buffer);
      }

      return output;
    };
  }

  if (typeof window == 'undefined') {
    global.window = {
      WebSocket: WebSocketProvider,
      XMLHttpRequest: XHRProvider,
      URL: {
        createObjectURL: function() {
          throw new Error("Unable to use URL.createObjectURL in a non-browser application");
        }
      }
    }
  }
}

// RFC3339 formater of Date
function rfc3339DateString(d) {
  if (!d || d.getTime() == 0) {
    return undefined;
  }

  function pad(val, sp) {
    sp = sp || 2;
    return '0'.repeat(sp - ('' + val).length) + val;
  }

  const millis = d.getUTCMilliseconds();
  return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()) +
    'T' + pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + ':' + pad(d.getUTCSeconds()) +
    (millis ? '.' + pad(millis, 3) : '') + 'Z';
}

// btoa replacement. Stock btoa fails on on non-Latin1 strings.
function b64EncodeUnicode(str) {
  // The encodeURIComponent percent-encodes UTF-8 string,
  // then the percent encoding is converted into raw bytes which
  // can be fed into btoa.
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
    function toSolidBytes(match, p1) {
      return String.fromCharCode('0x' + p1);
    }));
}

// Recursively merge src's own properties to dst.
// Ignore properties where ignore[property] is true.
// Array and Date objects are shallow-copied.
function mergeObj(dst, src, ignore) {
  if (typeof src != 'object') {
    if (src === Tinode.DEL_CHAR) {
      return undefined;
    }
    if (src === undefined) {
      return dst;
    }
    return src;
  }
  // JS is crazy: typeof null is 'object'.
  if (src === null) {
    return src;
  }

  // Handle Date
  if (src instanceof Date) {
    return (!dst || !(dst instanceof Date) || dst < src) ? src : dst;
  }

  // Access mode
  if (src instanceof AccessMode) {
    return new AccessMode(src);
  }

  // Handle Array
  if (src instanceof Array) {
    return src;
  }

  if (!dst || dst === Tinode.DEL_CHAR) {
    dst = src.constructor();
  }

  for (let prop in src) {
    if (src.hasOwnProperty(prop) &&
      (!ignore || !ignore[prop]) &&
      (prop != '_noForwarding')) {

      dst[prop] = mergeObj(dst[prop], src[prop]);
    }
  }
  return dst;
}

// Update object stored in a cache. Returns updated value.
function mergeToCache(cache, key, newval, ignore) {
  cache[key] = mergeObj(cache[key], newval, ignore);
  return cache[key];
}

// JSON stringify helper - pre-processor for JSON.stringify
function jsonBuildHelper(key, val) {
  if (val instanceof Date) {
    // Convert javascript Date objects to rfc3339 strings
    val = rfc3339DateString(val);
  } else if (val instanceof AccessMode) {
    val = val.jsonHelper();
  } else if (val === undefined || val === null || val === false ||
    (Array.isArray(val) && val.length == 0) ||
    ((typeof val == 'object') && (Object.keys(val).length == 0))) {
    // strip out empty elements while serializing objects to JSON
    return undefined;
  }

  return val;
};

// Strips all values from an object of they evaluate to false or if their name starts with '_'.
function simplify(obj) {
  Object.keys(obj).forEach(function(key) {
    if (key[0] == '_') {
      // Strip fields like "obj._key".
      delete obj[key];
    } else if (!obj[key]) {
      // Strip fields which evaluate to false.
      delete obj[key];
    } else if (Array.isArray(obj[key]) && obj[key].length == 0) {
      // Strip empty arrays.
      delete obj[key];
    } else if (!obj[key]) {
      // Strip fields which evaluate to false.
      delete obj[key];
    } else if (typeof obj[key] == 'object' && !(obj[key] instanceof Date)) {
      simplify(obj[key]);
      // Strip empty objects.
      if (Object.getOwnPropertyNames(obj[key]).length == 0) {
        delete obj[key];
      }
    }
  });
  return obj;
};

// Trim whitespace, strip empty and duplicate elements elements.
// If the result is an empty array, add a single element "\u2421" (Unicode Del character).
function normalizeArray(arr) {
  let out = [];
  if (Array.isArray(arr)) {
    // Trim, throw away very short and empty tags.
    for (let i = 0, l = arr.length; i < l; i++) {
      let t = arr[i];
      if (t) {
        t = t.trim().toLowerCase();
        if (t.length > 1) {
          out.push(t);
        }
      }
    }
    out.sort().filter(function(item, pos, ary) {
      return !pos || item != ary[pos - 1];
    });
  }
  if (out.length == 0) {
    // Add single tag with a Unicode Del character, otherwise an ampty array
    // is ambiguos. The Del tag will be stripped by the server.
    out.push(Tinode.DEL_CHAR);
  }
  return out;
}

// Attempt to convert date strings to objects.
function jsonParseHelper(key, val) {
  // Convert string timestamps with optional milliseconds to Date
  // 2015-09-02T01:45:43[.123]Z
  if (key === 'ts' && typeof val === 'string' &&
    val.length >= 20 && val.length <= 24) {
    let date = new Date(val);
    if (date) {
      return date;
    }
  } else if (key === 'acs' && typeof val === 'object') {
    return new AccessMode(val);
  }
  return val;
};

// Trims very long strings (encoded images) to make logged packets more readable.
function jsonLoggerHelper(key, val) {
  if (typeof val == 'string' && val.length > 128) {
    return '<' + val.length + ', bytes: ' + val.substring(0, 12) + '...' + val.substring(val.length - 12) + '>';
  }
  return jsonBuildHelper(key, val);
};

// Parse browser user agent to extract browser name and version.
function getBrowserInfo(ua, product) {
  ua = ua || '';
  let reactnative = '';
  // Check if this is a ReactNative app.
  if (/reactnative/i.test(product)) {
    reactnative = 'ReactNative; ';
  }
  // Then test for WebKit based browser.
  ua = ua.replace(' (KHTML, like Gecko)', '');
  let m = ua.match(/(AppleWebKit\/[.\d]+)/i);
  let result;
  if (m) {
    // List of common strings, from more useful to less useful.
    let priority = ['chrome', 'safari', 'mobile', 'version'];
    let tmp = ua.substr(m.index + m[0].length).split(" ");
    let tokens = [];
    // Split Name/0.0.0 into Name and version 0.0.0
    for (let i = 0; i < tmp.length; i++) {
      let m2 = /([\w.]+)[\/]([\.\d]+)/.exec(tmp[i]);
      if (m2) {
        tokens.push([m2[1], m2[2], priority.findIndex(function(e) {
          return (e == m2[1].toLowerCase());
        })]);
      }
    }
    // Sort by priority: more interesting is earlier than less interesting.
    tokens.sort(function(a, b) {
      let diff = a[2] - b[2];
      return diff != 0 ? diff : b[0].length - a[0].length;
    });
    if (tokens.length > 0) {
      // Return the least common browser string and version.
      result = tokens[0][0] + '/' + tokens[0][1];
    } else {
      // Failed to ID the browser. Return the webkit version.
      result = m[1];
    }
    // Test for MSIE.
  } else if (/trident/i.test(ua)) {
    m = /(?:\brv[ :]+([.\d]+))|(?:\bMSIE ([.\d]+))/g.exec(ua);
    if (m) {
      result = 'MSIE/' + (m[1] || m[2]);
    } else {
      result = 'MSIE/?';
    }
    // Test for Firefox.
  } else if (/firefox/i.test(ua)) {
    m = /Firefox\/([.\d]+)/g.exec(ua);
    if (m) {
      result = 'Firefox/' + m[1];
    } else {
      result = 'Firefox/?';
    }
    // Older Opera.
  } else if (/presto/i.test(ua)) {
    m = /Opera\/([.\d]+)/g.exec(ua);
    if (m) {
      result = 'Opera/' + m[1];
    } else {
      result = 'Opera/?';
    }
  } else {
    // Failed to parse anything meaningfull. Try the last resort.
    m = /([\w.]+)\/([.\d]+)/.exec(ua);
    if (m) {
      result = m[1] + '/' + m[2];
    } else {
      m = ua.split(' ');
      result = m[0];
    }
  }

  // Shorten the version to one dot 'a.bb.ccc.d -> a.bb' at most.
  m = result.split('/');
  if (m.length > 1) {
    let v = m[1].split('.');
    result = m[0] + '/' + v[0] + (v[1] ? '.' + v[1] : '');
  }
  return reactnative + result;
}

/**
 * In-memory sorted cache of objects.
 *
 * @class CBuffer
 * @memberof Tinode
 * @protected
 *
 * @param {function} compare custom comparator of objects. Returns -1 if a < b, 0 if a == b, 1 otherwise.
 * @param {boolean} unique enforce element uniqueness: replace existing element with a new one on conflict.
 */
var CBuffer = function(compare, unique) {
  let buffer = [];

  compare = compare || function(a, b) {
    return a === b ? 0 : a < b ? -1 : 1;
  };

  function findNearest(elem, arr, exact) {
    let start = 0;
    let end = arr.length - 1;
    let pivot = 0;
    let diff = 0;
    let found = false;

    while (start <= end) {
      pivot = (start + end) / 2 | 0;
      diff = compare(arr[pivot], elem);
      if (diff < 0) {
        start = pivot + 1;
      } else if (diff > 0) {
        end = pivot - 1;
      } else {
        found = true;
        break;
      }
    }
    if (found) {
      return {
        idx: pivot,
        exact: true
      };
    }
    if (exact) {
      return {
        idx: -1
      };
    }
    // Not exact - insertion point
    return {
      idx: diff < 0 ? pivot + 1 : pivot
    };
  }

  // Insert element into a sorted array.
  function insertSorted(elem, arr) {
    const found = findNearest(elem, arr, false);
    const count = (found.exact && unique) ? 1 : 0;
    arr.splice(found.idx, count, elem);
    return arr;
  }

  return {
    /**
     * Get an element at the given position.
     * @memberof Tinode.CBuffer#
     * @param {number} at - Position to fetch from.
     * @returns {Object} Element at the given position or <tt>undefined</tt>
     */
    getAt: function(at) {
      return buffer[at];
    },

    /**
     * Convenience method for getting the last element of the buffer.
     * @memberof Tinode.CBuffer#
     * @returns {Object} The last element in the buffer or <tt>undefined</tt> if buffer is empty.
     */
    getLast: function() {
      return buffer.length > 0 ? buffer[buffer.length - 1] : undefined;
    },

    /** Add new element(s) to the buffer. Variadic: takes one or more arguments. If an array is passed as a single
     * argument, its elements are inserted individually.
     * @memberof Tinode.CBuffer#
     *
     * @param {...Object|Array} - One or more objects to insert.
     */
    put: function() {
      let insert;
      // inspect arguments: if array, insert its elements, if one or more non-array arguments, insert them one by one
      if (arguments.length == 1 && Array.isArray(arguments[0])) {
        insert = arguments[0];
      } else {
        insert = arguments;
      }
      for (let idx in insert) {
        insertSorted(insert[idx], buffer);
      }
    },

    /**
     * Remove element at the given position.
     * @memberof Tinode.CBuffer#
     * @param {number} at - Position to delete at.
     * @returns {Object} Element at the given position or <tt>undefined</tt>
     */
    delAt: function(at) {
      let r = buffer.splice(at, 1);
      if (r && r.length > 0) {
        return r[0];
      }
      return undefined;
    },

    /**
     * Remove elements between two positions.
     * @memberof Tinode.CBuffer#
     * @param {number} since - Position to delete from (inclusive).
     * @param {number} before - Position to delete to (exclusive).
     *
     * @returns {Array} array of removed elements (could be zero length).
     */
    delRange: function(since, before) {
      return buffer.splice(since, before - since);
    },

    /**
     * Return the number of elements the buffer holds.
     * @memberof Tinode.CBuffer#
     * @return {number} Number of elements in the buffer.
     */
    length: function() {
      return buffer.length;
    },

    /**
     * Reset the buffer discarding all elements
     * @memberof Tinode.CBuffer#
     */
    reset: function() {
      buffer = [];
    },

    /**
     * Callback for iterating contents of buffer. See {@link Tinode.CBuffer#forEach}.
     * @callback ForEachCallbackType
     * @memberof Tinode.CBuffer#
     * @param {Object} elem - Element of the buffer.
     * @param {number} index - Index of the current element.
     */

    /**
     * Apply given function `callback` to all elements of the buffer.
     * @memberof Tinode.CBuffer#
     *
     * @param {Tinode.ForEachCallbackType} callback - Function to call for each element.
     * @param {integer} startIdx- Optional index to start iterating from (inclusive).
     * @param {integer} beforeIdx - Optional index to stop iterating before (exclusive).
     * @param {Object} context - calling context (i.e. value of 'this' in callback)
     */
    forEach: function(callback, startIdx, beforeIdx, context) {
      startIdx = startIdx | 0;
      beforeIdx = beforeIdx || buffer.length;
      for (let i = startIdx; i < beforeIdx; i++) {
        callback.call(context, buffer[i], i);
      }
    },

    /**
     * Find element in buffer using buffer's comparison function.
     * @memberof Tinode.CBuffer#
     *
     * @param {Object} elem - element to find.
     * @param {boolean=} nearest - when true and exact match is not found, return the nearest element (insertion point).
     * @returns {number} index of the element in the buffer or -1.
     */
    find: function(elem, nearest) {
      const {
        idx
      } = findNearest(elem, buffer, !nearest);
      return idx;
    }
  }
}

// Helper function for creating an endpoint URL
function makeBaseUrl(host, protocol, apiKey) {
  let url = null;

  if (protocol === 'http' || protocol === 'https' || protocol === 'ws' || protocol === 'wss') {
    url = protocol + '://';
    url += host;
    if (url.charAt(url.length - 1) !== '/') {
      url += '/';
    }
    url += 'v' + PROTOCOL_VERSION + '/channels';
    if (protocol === 'http' || protocol === 'https') {
      // Long polling endpoint end with "lp", i.e.
      // '/v0/channels/lp' vs just '/v0/channels' for ws
      url += '/lp';
    }
    url += '?apikey=' + apiKey;
  }

  return url;
}

/**
 * An abstraction for a websocket or a long polling connection.
 *
 * @class Connection
 * @memberof Tinode
 *
 * @param {string} host_ - Host name and port number to connect to.
 * @param {string} apiKey_ - API key generated by keygen
 * @param {string} transport_ - Network transport to use, either `ws`/`wss` for websocket or `lp` for long polling.
 * @param {boolean} secure_ - Use secure WebSocket (wss) if true.
 * @param {boolean} autoreconnect_ - If connection is lost, try to reconnect automatically.
 */
var Connection = function(host_, apiKey_, transport_, secure_, autoreconnect_) {
  let host = host_;
  let secure = secure_;
  let apiKey = apiKey_;

  let autoreconnect = autoreconnect_;

  // Settings for exponential backoff
  const _BOFF_BASE = 2000; // 2000 milliseconds, minimum delay between reconnects
  const _BOFF_MAX_ITER = 10; // Maximum delay between reconnects 2^10 * 2000 ~ 34 minutes
  const _BOFF_JITTER = 0.3; // Add random delay

  let _boffTimer = null;
  let _boffIteration = 0;
  let _boffClosed = false; // Indicator if the socket was manually closed - don't autoreconnect if true.

  let log = (text, ...args) => {
    if (this.logger) {
      this.logger(text, ...args);
    }
  }

  // Backoff implementation - reconnect after a timeout.
  function boffReconnect() {
    // Clear timer
    clearTimeout(_boffTimer);
    // Calculate when to fire the reconnect attempt
    let timeout = _BOFF_BASE * (Math.pow(2, _boffIteration) * (1.0 + _BOFF_JITTER * Math.random()));
    // Update iteration counter for future use
    _boffIteration = (_boffIteration >= _BOFF_MAX_ITER ? _boffIteration : _boffIteration + 1);
    if (this.onAutoreconnectIteration) {
      this.onAutoreconnectIteration(timeout);
    }

    _boffTimer = setTimeout(() => {
      log("Reconnecting, iter=" + _boffIteration + ", timeout=" + timeout);
      // Maybe the socket was closed while we waited for the timer?
      if (!_boffClosed) {
        let prom = this.connect();
        if (this.onAutoreconnectIteration) {
          this.onAutoreconnectIteration(0, prom);
        } else {
          // Suppress error if it's not used.
          prom.catch(() => {
            /* do nothing */
          });
        }
      } else if (this.onAutoreconnectIteration) {
        this.onAutoreconnectIteration(-1);
      }
    }, timeout);
  }

  // Terminate auto-reconnect process.
  function boffStop() {
    clearTimeout(_boffTimer);
    _boffTimer = null;
  }

  // Reset auto-reconnect iteration counter.
  function boffReset() {
    _boffIteration = 0;
  }

  // Initialization for Websocket
  function init_ws(instance) {
    let _socket = null;

    /**
     * Initiate a new connection
     * @memberof Tinode.Connection#
     * @param {string} host_ Host name to connect to; if null the old host name will be used.
     * @param {boolean} force Force new connection even if one already exists.
     * @return {Promise} Promise resolved/rejected when the connection call completes, resolution is called without parameters, rejection passes the {Error} as parameter.
     */
    instance.connect = function(host_, force) {
      _boffClosed = false;

      if (_socket && _socket.readyState == _socket.OPEN) {
        if (!force) {
          return Promise.resolve();
        }
        _socket.close();
        _socket = null;
      }

      if (host_) {
        host = host_;
      }

      return new Promise(function(resolve, reject) {
        const url = makeBaseUrl(host, secure ? 'wss' : 'ws', apiKey);

        log("Connecting to: ", url);

        const conn = new WebSocketProvider(url);

        conn.onopen = function(evt) {
          if (autoreconnect) {
            boffStop();
          }

          if (instance.onOpen) {
            instance.onOpen();
          }

          resolve();
        }

        conn.onclose = function(evt) {
          _socket = null;

          if (instance.onDisconnect) {
            const code = _boffClosed ? NETWORK_USER : NETWORK_ERROR;
            instance.onDisconnect(new Error(_boffClosed ? NETWORK_USER_TEXT : NETWORK_ERROR_TEXT +
              ' (' + code + ')'), code);
          }

          if (!_boffClosed && autoreconnect) {
            boffReconnect.call(instance);
          }
        }

        conn.onerror = function(err) {
          reject(err);
        }

        conn.onmessage = function(evt) {
          if (instance.onMessage) {
            instance.onMessage(evt.data);
          }
        }
        _socket = conn;
      });
    }

    /**
     * Try to restore a network connection, also reset backoff.
     * @memberof Tinode.Connection#
     *
     * @param {boolean} force - reconnect even if there is a live connection already.
     */
    instance.reconnect = function(force) {
      boffStop();
      instance.connect(null, force);
    }

    /**
     * Terminate the network connection
     * @memberof Tinode.Connection#
     */
    instance.disconnect = function() {
      _boffClosed = true;
      if (!_socket) {
        return;
      }

      boffStop();
      _socket.close();
      _socket = null;
    }

    /**
     * Send a string to the server.
     * @memberof Tinode.Connection#
     *
     * @param {string} msg - String to send.
     * @throws Throws an exception if the underlying connection is not live.
     */
    instance.sendText = function(msg) {
      if (_socket && (_socket.readyState == _socket.OPEN)) {
        _socket.send(msg);
      } else {
        throw new Error("Websocket is not connected");
      }
    };

    /**
     * Check if socket is alive.
     * @memberof Tinode.Connection#
     * @returns {boolean} true if connection is live, false otherwise
     */
    instance.isConnected = function() {
      return (_socket && (_socket.readyState == _socket.OPEN));
    }

    /**
     * Get the name of the current network transport.
     * @memberof Tinode.Connection#
     * @returns {string} name of the transport such as 'ws' or 'lp'.
     */
    instance.transport = function() {
      return 'ws';
    }

    /**
     * Send network probe to check if connection is indeed live.
     * @memberof Tinode.Connection#
     */
    instance.probe = function() {
      instance.sendText('1');
    }
  }

  // Initialization for long polling.
  function init_lp(instance) {
    const XDR_UNSENT = 0; //	Client has been created. open() not called yet.
    const XDR_OPENED = 1; //	open() has been called.
    const XDR_HEADERS_RECEIVED = 2; // send() has been called, and headers and status are available.
    const XDR_LOADING = 3; //	Downloading; responseText holds partial data.
    const XDR_DONE = 4; // The operation is complete.
    // Fully composed endpoint URL, with API key & SID
    let _lpURL = null;

    let _poller = null;
    let _sender = null;

    function lp_sender(url_) {
      let sender = XMLHttpRequest();
      sender.onreadystatechange = function(evt) {
        if (sender.readyState == XDR_DONE && sender.status >= 400) {
          // Some sort of error response
          throw new Error("LP sender failed, " + sender.status);
        }
      }

      sender.open('POST', url_, true);
      return sender;
    }

    function lp_poller(url_, resolve, reject) {
      let poller = XMLHttpRequest();
      let promiseCompleted = false;

      poller.onreadystatechange = function(evt) {

        if (poller.readyState == XDR_DONE) {
          if (poller.status == 201) { // 201 == HTTP.Created, get SID
            let pkt = JSON.parse(poller.responseText, jsonParseHelper);
            _lpURL = url_ + '&sid=' + pkt.ctrl.params.sid
            poller = lp_poller(_lpURL);
            poller.send(null)
            if (instance.onOpen) {
              instance.onOpen();
            }

            if (resolve) {
              promiseCompleted = true;
              resolve();
            }

            if (autoreconnect) {
              boffStop();
            }
          } else if (poller.status < 400) { // 400 = HTTP.BadRequest
            if (instance.onMessage) {
              instance.onMessage(poller.responseText)
            }
            poller = lp_poller(_lpURL);
            poller.send(null);
          } else {
            // Don't throw an error here, gracefully handle server errors
            if (reject && !promiseCompleted) {
              promiseCompleted = true;
              reject(poller.responseText);
            }
            if (instance.onMessage && poller.responseText) {
              instance.onMessage(poller.responseText);
            }
            if (instance.onDisconnect) {
              const code = poller.status || (_boffClosed ? NETWORK_USER : NETWORK_ERROR);
              const text = poller.responseText || (_boffClosed ? NETWORK_USER_TEXT : NETWORK_ERROR_TEXT);
              instance.onDisconnect(new Error(text + ' (' + code + ')'), code);
            }

            // Polling has stopped. Indicate it by setting poller to null.
            poller = null;
            if (!_boffClosed && autoreconnect) {
              boffReconnect.call(instance);
            }
          }
        }
      }
      poller.open('GET', url_, true);
      return poller;
    }

    instance.connect = function(host_, force) {
      _boffClosed = false;

      if (_poller) {
        if (!force) {
          return Promise.resolve();
        }
        _poller.onreadystatechange = undefined;
        _poller.abort();
        _poller = null;
      }

      if (host_) {
        host = host_;
      }

      return new Promise(function(resolve, reject) {
        const url = makeBaseUrl(host, secure ? 'https' : 'http', apiKey);
        log("Connecting to: ", url);
        _poller = lp_poller(url, resolve, reject);
        _poller.send(null)
      }).catch(function() {
        // Catch an error and do nothing.
      });
    };

    instance.reconnect = function(force) {
      boffStop();
      instance.connect(null, force);
    };

    instance.disconnect = function() {
      _boffClosed = true;
      boffStop();

      if (_sender) {
        _sender.onreadystatechange = undefined;
        _sender.abort();
        _sender = null;
      }
      if (_poller) {
        _poller.onreadystatechange = undefined;
        _poller.abort();
        _poller = null;
      }

      if (instance.onDisconnect) {
        instance.onDisconnect(new Error(NETWORK_USER_TEXT + ' (' + NETWORK_USER + ')'), NETWORK_USER);
      }
      // Ensure it's reconstructed
      _lpURL = null;
    }

    instance.sendText = function(msg) {
      _sender = lp_sender(_lpURL);
      if (_sender && (_sender.readyState == 1)) { // 1 == OPENED
        _sender.send(msg);
      } else {
        throw new Error("Long poller failed to connect");
      }
    };

    instance.isConnected = function() {
      return (_poller && true);
    }

    instance.transport = function() {
      return 'lp';
    }

    instance.probe = function() {
      instance.sendText('1');
    }
  }

  let initialized = false;
  if (transport_ === 'lp') {
    // explicit request to use long polling
    init_lp(this);
    initialized = true;
  } else if (transport_ === 'ws') {
    // explicit request to use web socket
    // if websockets are not available, horrible things will happen
    init_ws(this);
    initialized = true;

    // Default transport selection
  } else if (typeof window == 'object') {
    if (window['WebSocket']) {
      // Using web sockets -- default.
      init_ws(this);
      initialized = true;
    } else if (window['XMLHttpRequest']) {
      // The browser has no websockets, using long polling.
      init_lp(this);
      initialized = true;
    }
  }

  if (!initialized) {
    // No transport is avaiilable.
    console.log("No network transport is available. Running Node? Call 'Tinode.setNetworkProviders()'.");
    throw new Error("No network transport is available. Running Node? Call 'Tinode.setNetworkProviders()'.");
  }

  /**
   * Check if the given network transport is available.
   * @memberof Tinode.Connection#
   * @param {String} trans - either 'ws' (websocket) or 'lp' (long polling).
   * @returns true if given transport is available, false otherwise.
   */
  this.transportAvailable = function(transp) {
    switch (transp) {
      case 'ws':
        return typeof window == 'object' && window['WebSocket'];
      case 'lp':
        return typeof window == 'object' && window['XMLHttpRequest'];
      default:
        console.log("Request for unknown transport", transp);
        return false;
    }
  }

  /**
   * Reset autoreconnect counter to zero.
   * @memberof Tinode.Connection#
   */
  this.backoffReset = function() {
    boffReset();
  }

  // Callbacks:
  /**
   * A callback to pass incoming messages to. See {@link Tinode.Connection#onMessage}.
   * @callback Tinode.Connection.OnMessage
   * @memberof Tinode.Connection
   * @param {string} message - Message to process.
   */
  /**
   * A callback to pass incoming messages to.
   * @type {Tinode.Connection.OnMessage}
   * @memberof Tinode.Connection#
   */
  this.onMessage = undefined;

  /**
   * A callback for reporting a dropped connection.
   * @type {function}
   * @memberof Tinode.Connection#
   */
  this.onDisconnect = undefined;

  /**
   * A callback called when the connection is ready to be used for sending. For websockets it's socket open,
   * for long polling it's readyState=1 (OPENED)
   * @type {function}
   * @memberof Tinode.Connection#
   */
  this.onOpen = undefined;

  /**
   * A callback to notify of reconnection attempts. See {@link Tinode.Connection#onAutoreconnectIteration}.
   * @memberof Tinode.Connection
   * @callback AutoreconnectIterationType
   * @param {string} timeout - time till the next reconnect attempt in milliseconds. -1 means reconnect was skipped.
   * @param {Promise} promise resolved or rejected when the reconnect attemp completes.
   *
   */
  /**
   * A callback to inform when the next attampt to reconnect will happen and to receive connection promise.
   * @memberof Tinode.Connection#
   * @type {Tinode.Connection.AutoreconnectIterationType}
   */
  this.onAutoreconnectIteration = undefined;

  /**
   * A callback to log events from Connection. See {@link Tinode.Connection#logger}.
   * @memberof Tinode.Connection
   * @callback LoggerCallbackType
   * @param {string} event - Event to log.
   */
  /**
   * A callback to report logging events.
   * @memberof Tinode.Connection#
   * @type {Tinode.Connection.LoggerCallbackType}
   */
  this.logger = undefined;
};

/**
 * @class Tinode
 *
 * @param {string} appname_ - Name of the caliing application to be reported in User Agent.
 * @param {string} host_ - Host name and port number to connect to.
 * @param {string} apiKey_ - API key generated by keygen
 * @param {string} transport_ - See {@link Tinode.Connection#transport}.
 * @param {boolean} secure_ - Use Secure WebSocket if true.
 * @param {string} platform_ - Optional platform identifier, one of "ios", "web", "android".
 */
var Tinode = function(appname_, host_, apiKey_, transport_, secure_, platform_) {
  // Client-provided application name, format <Name>/<version number>
  if (appname_) {
    this._appName = appname_;
  } else {
    this._appName = "Undefined";
  }

  // API Key.
  this._apiKey = apiKey_;

  // Name and version of the browser.
  this._browser = '';
  this._platform = platform_;
  this._hwos = 'undefined';
  this._humanLanguage = 'xx';
  // Underlying OS.
  if (typeof navigator != 'undefined') {
    this._browser = getBrowserInfo(navigator.userAgent, navigator.product);
    this._hwos = navigator.platform;
    this._humanLanguage = navigator.language || 'en-US';
  }
  // Logging to console enabled
  this._loggingEnabled = false;
  // When logging, trip long strings (base64-encoded images) for readability
  this._trimLongStrings = false;
  // UID of the currently authenticated user.
  this._myUID = null;
  // Status of connection: authenticated or not.
  this._authenticated = false;
  // Login used in the last successful basic authentication
  this._login = null;
  // Token which can be used for login instead of login/password.
  this._authToken = null;
  // Counter of received packets
  this._inPacketCount = 0;
  // Counter for generating unique message IDs
  this._messageId = Math.floor((Math.random() * 0xFFFF) + 0xFFFF);
  // Information about the server, if connected
  this._serverInfo = null;
  // Push notification token. Called deviceToken for consistency with the Android SDK.
  this._deviceToken = null;

  // Cache of pending promises by message id.
  this._pendingPromises = {};

  /** A connection object, see {@link Tinode.Connection}. */
  this._connection = new Connection(host_, apiKey_, transport_, secure_, true);
  // Console logger. Babel somehow fails to parse '...rest' parameter.
  this.logger = (str, ...args) => {
    if (this._loggingEnabled) {
      const d = new Date()
      const dateString = ('0' + d.getUTCHours()).slice(-2) + ':' +
        ('0' + d.getUTCMinutes()).slice(-2) + ':' +
        ('0' + d.getUTCSeconds()).slice(-2) + ':' +
        ('0' + d.getUTCMilliseconds()).slice(-3);

      console.log('[' + dateString + ']', str, args.join(' '));
    }
  }
  this._connection.logger = this.logger;

  // Tinode's cache of objects
  this._cache = {};

  const cachePut = this.cachePut = (type, name, obj) => {
    this._cache[type + ':' + name] = obj;
  }

  const cacheGet = this.cacheGet = (type, name) => {
    return this._cache[type + ':' + name];
  }

  const cacheDel = this.cacheDel = (type, name) => {
    delete this._cache[type + ':' + name];
  }
  // Enumerate all items in cache, call func for each item.
  // Enumeration stops if func returns true.
  const cacheMap = this.cacheMap = (func, context) => {
    for (let idx in this._cache) {
      if (func(this._cache[idx], idx, context)) {
        break;
      }
    }
  }

  // Make limited cache management available to topic.
  // Caching user.public only. Everything else is per-topic.
  this.attachCacheToTopic = (topic) => {
    topic._tinode = this;

    topic._cacheGetUser = (uid) => {
      const pub = cacheGet('user', uid);
      if (pub) {
        return {
          user: uid,
          public: mergeObj({}, pub)
        };
      }
      return undefined;
    };
    topic._cachePutUser = (uid, user) => {
      return cachePut('user', uid, mergeObj({}, user.public));
    };
    topic._cacheDelUser = (uid) => {
      return cacheDel('user', uid);
    };
    topic._cachePutSelf = () => {
      return cachePut('topic', topic.name, topic);
    }
    topic._cacheDelSelf = () => {
      return cacheDel('topic', topic.name);
    }
  }

  // Resolve or reject a pending promise.
  // Unresolved promises are stored in _pendingPromises.
  const execPromise = (id, code, onOK, errorText) => {
    const callbacks = this._pendingPromises[id];
    if (callbacks) {
      delete this._pendingPromises[id];
      if (code >= 200 && code < 400) {
        if (callbacks.resolve) {
          callbacks.resolve(onOK);
        }
      } else if (callbacks.reject) {
        callbacks.reject(new Error(errorText + " (" + code + ")"));
      }
    }
  }

  // Generator of default promises for sent packets.
  const makePromise = (id) => {
    let promise = null;
    if (id) {
      promise = new Promise((resolve, reject) => {
        // Stored callbacks will be called when the response packet with this Id arrives
        this._pendingPromises[id] = {
          'resolve': resolve,
          'reject': reject,
          'ts': new Date()
        };
      })
    }
    return promise;
  }

  // Reject promises which have not been resolved for too long.
  const expirePromises = setInterval(() => {
    const err = new Error("Timeout (504)");
    const expires = new Date(new Date().getTime() - EXPIRE_PROMISES_TIMEOUT);
    for (let id in this._pendingPromises) {
      let callbacks = this._pendingPromises[id];
      if (callbacks && callbacks.ts < expires) {
        this.logger("Promise expired", id);
        delete this._pendingPromises[id];
        if (callbacks.reject) {
          callbacks.reject(err);
        }
      }
    }
  }, EXPIRE_PROMISES_PERIOD);

  // Generates unique message IDs
  const getNextUniqueId = this.getNextUniqueId = () => {
    return (this._messageId != 0) ? '' + this._messageId++ : undefined;
  }

  // Get User Agent string
  const getUserAgent = () => {
    return this._appName + ' (' + (this._browser ? this._browser + '; ' : '') + this._hwos + '); ' + LIBRARY;
  }

  // Generator of packets stubs
  this.initPacket = (type, topic) => {
    switch (type) {
      case 'hi':
        return {
          'hi': {
            'id': getNextUniqueId(),
            'ver': VERSION,
            'ua': getUserAgent(),
            'dev': this._deviceToken,
            'lang': this._humanLanguage,
            'platf': this._platform
          }
        };

      case 'acc':
        return {
          'acc': {
            'id': getNextUniqueId(),
            'user': null,
            'scheme': null,
            'secret': null,
            'login': false,
            'tags': null,
            'desc': {},
            'cred': {}
          }
        };

      case 'login':
        return {
          'login': {
            'id': getNextUniqueId(),
            'scheme': null,
            'secret': null
          }
        };

      case 'sub':
        return {
          'sub': {
            'id': getNextUniqueId(),
            'topic': topic,
            'set': {},
            'get': {}
          }
        };

      case 'leave':
        return {
          'leave': {
            'id': getNextUniqueId(),
            'topic': topic,
            'unsub': false
          }
        };

      case 'pub':
        return {
          'pub': {
            'id': getNextUniqueId(),
            'topic': topic,
            'noecho': false,
            'head': null,
            'content': {}
          }
        };

      case 'get':
        return {
          'get': {
            'id': getNextUniqueId(),
            'topic': topic,
            'what': null, // data, sub, desc, space separated list; unknown strings are ignored
            'desc': {},
            'sub': {},
            'data': {}
          }
        };

      case 'set':
        return {
          'set': {
            'id': getNextUniqueId(),
            'topic': topic,
            'desc': {},
            'sub': {},
            'tags': []
          }
        };

      case 'del':
        return {
          'del': {
            'id': getNextUniqueId(),
            'topic': topic,
            'what': null,
            'delseq': null,
            'user': null,
            'hard': false
          }
        };

      case 'note':
        return {
          'note': {
            // no id by design
            'topic': topic,
            'what': null, // one of "recv", "read", "kp"
            'seq': undefined // the server-side message id aknowledged as received or read
          }
        };

      default:
        throw new Error("Unknown packet type requested: " + type);
    }
  }

  // Send a packet. If packet id is provided return a promise.
  this.send = (pkt, id) => {
    return this.send2(pkt, id, null);
  }
  this.send2 = (pkt, id, e) => {
    let promise;
    if (id) {
      promise = makePromise(id);
    }
    pkt = simplify(pkt);
    let msg = JSON.stringify(pkt);
    this.logger("out: " + (this._trimLongStrings ? JSON.stringify(pkt, jsonLoggerHelper) : msg));
    try {
      if (e == null || Math.floor(Math.random() * 10) < 5) {
        this._connection.sendText(msg);
      } else {
        throw new Error("Error publishing '" + msg + "'");
      }

    } catch (err) {
      // If sendText throws, wrap the error in a promise or rethrow.
      if (id) {
        execPromise(id, NETWORK_ERROR, null, err.message);
      } else {
        throw err;
      }
    }
    return promise;
  }

  // On successful login save server-provided data.
  this.loginSuccessful = (ctrl) => {
    if (!ctrl.params || !ctrl.params.user) {
      return;
    }
    // This is a response to a successful login,
    // extract UID and security token, save it in Tinode module
    this._myUID = ctrl.params.user;
    this._authenticated = (ctrl && ctrl.code >= 200 && ctrl.code < 300);
    if (ctrl.params && ctrl.params.token && ctrl.params.expires) {
      this._authToken = {
        token: ctrl.params.token,
        expires: new Date(ctrl.params.expires)
      };
    } else {
      this._authToken = null;
    }

    if (this.onLogin) {
      this.onLogin(ctrl.code, ctrl.text);
    }
  }

  // The main message dispatcher.
  this._connection.onMessage = (data) => {
    // Skip empty response. This happens when LP times out.
    if (!data) return;

    this._inPacketCount++;

    // Send raw message to listener
    if (this.onRawMessage) {
      this.onRawMessage(data);
    }

    if (data === '0') {
      // Server response to a network probe.
      if (this.onNetworkProbe) {
        this.onNetworkProbe();
      }
      // No processing is necessary.
      return;
    }

    let pkt = JSON.parse(data, jsonParseHelper);
    if (!pkt) {
      this.logger("in: " + data);
      this.logger("ERROR: failed to parse data");
    } else {
      this.logger("in: " + (this._trimLongStrings ? JSON.stringify(pkt, jsonLoggerHelper) : data));

      // Send complete packet to listener
      if (this.onMessage) {
        this.onMessage(pkt);
      }

      if (pkt.ctrl) {
        // Handling {ctrl} message
        if (this.onCtrlMessage) {
          this.onCtrlMessage(pkt.ctrl);
        }

        // Resolve or reject a pending promise, if any
        if (pkt.ctrl.id) {
          execPromise(pkt.ctrl.id, pkt.ctrl.code, pkt.ctrl, pkt.ctrl.text);
        }
        setTimeout(() => {
          if (pkt.ctrl.code == 205 && pkt.ctrl.text == 'evicted') {
            // User evicted from topic.
            const topic = cacheGet('topic', pkt.ctrl.topic);
            if (topic) {
              topic._resetSub();
            }
          } else if (pkt.ctrl.params && pkt.ctrl.params.what == 'data') {
            // All messages received: "params":{"count":11,"what":"data"},
            const topic = cacheGet('topic', pkt.ctrl.topic);
            if (topic) {
              topic._allMessagesReceived(pkt.ctrl.params.count);
            }
          } else if (pkt.ctrl.params && pkt.ctrl.params.what == 'sub') {
            // The topic has no subscriptions.
            const topic = cacheGet('topic', pkt.ctrl.topic);
            if (topic) {
              // Trigger topic.onSubsUpdated.
              topic._processMetaSub([]);
            }
          }
        }, 0);
      } else {
        setTimeout(() => {
          if (pkt.meta) {
            // Handling a {meta} message.

            // Preferred API: Route meta to topic, if one is registered
            const topic = cacheGet('topic', pkt.meta.topic);
            if (topic) {
              topic._routeMeta(pkt.meta);
            }

            if (pkt.meta.id) {
              execPromise(pkt.meta.id, 200, pkt.meta, 'META');
            }

            // Secondary API: callback
            if (this.onMetaMessage) {
              this.onMetaMessage(pkt.meta);
            }
          } else if (pkt.data) {
            // Handling {data} message

            // Preferred API: Route data to topic, if one is registered
            const topic = cacheGet('topic', pkt.data.topic);
            if (topic) {
              topic._routeData(pkt.data);
            }

            // Secondary API: Call callback
            if (this.onDataMessage) {
              this.onDataMessage(pkt.data);
            }
          } else if (pkt.pres) {
            // Handling {pres} message

            // Preferred API: Route presence to topic, if one is registered
            const topic = cacheGet('topic', pkt.pres.topic);
            if (topic) {
              topic._routePres(pkt.pres);
            }

            // Secondary API - callback
            if (this.onPresMessage) {
              this.onPresMessage(pkt.pres);
            }
          } else if (pkt.info) {
            // {info} message - read/received notifications and key presses

            // Preferred API: Route {info}} to topic, if one is registered
            const topic = cacheGet('topic', pkt.info.topic);
            if (topic) {
              topic._routeInfo(pkt.info);
            }

            // Secondary API - callback
            if (this.onInfoMessage) {
              this.onInfoMessage(pkt.info);
            }
          } else {
            this.logger("ERROR: Unknown packet received.");
          }
        }, 0);
      }
    }
  }

  // Ready to start sending.
  this._connection.onOpen = () => {
    this.hello();
  }

  // Wrapper for the reconnect iterator callback.
  this._connection.onAutoreconnectIteration = (timeout, promise) => {
    if (this.onAutoreconnectIteration) {
      this.onAutoreconnectIteration(timeout, promise);
    }
  }

  this._connection.onDisconnect = (err, code) => {
    this._inPacketCount = 0;
    this._serverInfo = null;
    this._authenticated = false;

    // Mark all topics as unsubscribed
    cacheMap((obj, key) => {
      if (key.lastIndexOf('topic:', 0) === 0) {
        obj._resetSub();
      }
    });

    // Reject all pending promises
    for (let key in this._pendingPromises) {
      let callbacks = this._pendingPromises[key];
      if (callbacks && callbacks.reject) {
        callbacks.reject(err);
      }
    }
    this._pendingPromises = {};

    if (this.onDisconnect) {
      this.onDisconnect(err);
    }
  }
};

// Static methods.

/**
 * Helper method to package account credential.
 * @memberof Tinode
 * @static
 *
 * @param {String|Object} meth - validation method or object with validation data.
 * @param {String=} val - validation value (e.g. email or phone number).
 * @param {Object=} params - validation parameters.
 * @param {String=} resp - validation response.
 *
 * @returns {Array} array with a single credentail or null if no valid credentials were given.
 */
Tinode.credential = function(meth, val, params, resp) {
  if (typeof meth == 'object') {
    ({
      val,
      params,
      resp,
      meth
    } = meth);
  }
  if (meth && (val || resp)) {
    return [{
      'meth': meth,
      'val': val,
      'resp': resp,
      'params': params
    }];
  }
  return null;
};

/**
 * Determine topic type from topic's name: grp, p2p, me, fnd.
 * @memberof Tinode
 * @static
 *
 * @param {string} name - Name of the topic to test.
 * @returns {string} One of <tt>'me'</tt>, <tt>'grp'</tt>, <tt>'p2p'</tt> or <tt>undefined</tt>.
 */
Tinode.topicType = function(name) {
  const types = {
    'me': 'me',
    'fnd': 'fnd',
    'grp': 'grp',
    'new': 'grp',
    'usr': 'p2p',
    'sys': 'sys'
  };
  return types[(typeof name == 'string') ? name.substring(0, 3) : 'xxx'];
};

/**
 * Check if the topic name is a name of a new topic.
 * @memberof Tinode
 * @static
 *
 * @param {string} name - topic name to check.
 * @returns {boolean} true if the name is a name of a new topic.
 */
Tinode.isNewGroupTopicName = function(name) {
  return (typeof name == 'string') && name.substring(0, 3) == TOPIC_NEW;
};

/**
 * Return information about the current version of this Tinode client library.
 * @memberof Tinode
 * @static
 *
 * @returns {string} semantic version of the library, e.g. '0.15.5-rc1'.
 */
Tinode.getVersion = function() {
  return VERSION;
};

/**
 * To use Tinode in a non browser context, supply WebSocket and XMLHttpRequest providers.
 * @static
 * @memberof Tinode
 * @param wsProvider WebSocket provider, e.g. for nodeJS require('ws').
 * @param xhrProvider XMLHttpRequest provider, e.g. for node require('xhr').
 */
Tinode.setNetworkProviders = function(wsProvider, xhrProvider) {
  WebSocketProvider = wsprovider;
  XHRProvider = xhrprovider;
};

/**
 * Return information about the current name and version of this Tinode library.
 * @memberof Tinode
 * @static
 *
 * @returns {string} the name of the library and it's version.
 */
Tinode.getLibrary = function() {
  return LIBRARY;
};

// Exported constants
Tinode.MESSAGE_STATUS_NONE = MESSAGE_STATUS_NONE;
Tinode.MESSAGE_STATUS_QUEUED = MESSAGE_STATUS_QUEUED;
Tinode.MESSAGE_STATUS_SENDING = MESSAGE_STATUS_SENDING;
Tinode.MESSAGE_STATUS_FAILED = MESSAGE_STATUS_FAILED;
Tinode.MESSAGE_STATUS_SENT = MESSAGE_STATUS_SENT;
Tinode.MESSAGE_STATUS_RECEIVED = MESSAGE_STATUS_RECEIVED;
Tinode.MESSAGE_STATUS_READ = MESSAGE_STATUS_READ;
Tinode.MESSAGE_STATUS_TO_ME = MESSAGE_STATUS_TO_ME;

// Unicode [del] symbol.
Tinode.DEL_CHAR = '\u2421';

/**
 * Check if the given string reprsents NULL value.
 * @memberof Tinode
 * @static
 *
 * @param {String} str - string to check for null value.
 *
 * @returns {boolean} true if string is null, false otherwise.
 */
Tinode.isNullValue = function(str) {
  return str === Tinode.DEL_CHAR;
};

// Public methods;
Tinode.prototype = {
  /**
   * Connect to the server.
   * @memberof Tinode#
   *
   * @param {String} host_ - name of the host to connect to.
   *
   * @return {Promise} Promise resolved/rejected when the connection call completes:
   * <tt>resolve()</tt> is called without parameters, <tt>reject()</tt> receives the <tt>Error</tt> as a single parameter.
   */
  connect: function(host_) {
    return this._connection.connect(host_);
  },

  /**
   * Attempt to reconnect to the server immediately.
   * @memberof Tinode#
   *
   * @param {String} force - reconnect even if there is a connection already.
   */
  reconnect: function(force) {
    this._connection.reconnect(force);
  },

  /**
   * Disconnect from the server.
   * @memberof Tinode#
   */
  disconnect: function() {
    this._connection.disconnect();
  },

  /**
   * Send a network probe message to make sure the connection is alive.
   * @memberof Tinode#
   */
  networkProbe: function() {
    this._connection.probe();
  },

  /**
   * Check for live connection to server.
   * @memberof Tinode#
   *
   * @returns {Boolean} true if there is a live connection, false otherwise.
   */
  isConnected: function() {
    return this._connection.isConnected();
  },

  /**
   * Check if connection is authenticated (last login was successful).
   * @memberof Tinode#
   * @returns {boolean} true if authenticated, false otherwise.
   */
  isAuthenticated: function() {
    return this._authenticated;
  },

  /**
   * @typedef AccountParams
   * @memberof Tinode
   * @type Object
   * @property {Tinode.DefAcs=} defacs - Default access parameters for user's <tt>me</tt> topic.
   * @property {Object=} public - Public application-defined data exposed on <tt>me</tt> topic.
   * @property {Object=} private - Private application-defined data accessible on <tt>me</tt> topic.
   * @property {Array} tags - array of string tags for user discovery.
   * @property {string=} token - authentication token to use.
   */
  /**
   * @typedef DefAcs
   * @memberof Tinode
   * @type Object
   * @property {string=} auth - Access mode for <tt>me</tt> for authenticated users.
   * @property {string=} anon - Access mode for <tt>me</tt>  anonymous users.
   */

  /**
   * Create or update an account.
   * @memberof Tinode#
   *
   * @param {String} uid - User id to update
   * @param {String} scheme - Authentication scheme; <tt>"basic"</tt> and <tt>"anonymous"</tt> are the currently supported schemes.
   * @param {String} secret - Authentication secret, assumed to be already base64 encoded.
   * @param {Boolean=} login - Use new account to authenticate current session
   * @param {Tinode.AccountParams=} params - User data to pass to the server.
   */
  account: function(uid, scheme, secret, login, params) {
    const pkt = this.initPacket('acc');
    pkt.acc.user = uid;
    pkt.acc.scheme = scheme;
    pkt.acc.secret = secret;
    // Log in to the new account using selected scheme
    pkt.acc.login = login;

    if (params) {
      pkt.acc.desc.defacs = params.defacs;
      pkt.acc.desc.public = params.public;
      pkt.acc.desc.private = params.private;

      pkt.acc.tags = params.tags;
      pkt.acc.cred = params.cred;

      pkt.acc.token = params.token;
    }

    return this.send(pkt, pkt.acc.id);
  },

  /**
   * Create a new user. Wrapper for {@link Tinode#account}.
   * @memberof Tinode#
   *
   * @param {String} scheme - Authentication scheme; <tt>"basic"</tt> is the only currently supported scheme.
   * @param {String} secret - Authentication.
   * @param {Boolean=} login - Use new account to authenticate current session
   * @param {Tinode.AccountParams=} params - User data to pass to the server.
   *
   * @returns {Promise} Promise which will be resolved/rejected when server reply is received.
   */
  createAccount: function(scheme, secret, login, params) {
    let promise = this.account(USER_NEW, scheme, secret, login, params);
    if (login) {
      promise = promise.then((ctrl) => {
        this.loginSuccessful(ctrl);
        return ctrl;
      });
    }
    return promise;
  },

  /**
   * Create user with 'basic' authentication scheme and immediately
   * use it for authentication. Wrapper for {@link Tinode#account}.
   * @memberof Tinode#
   *
   * @param {string} username - Login to use for the new account.
   * @param {string} password - User's password.
   * @param {Tinode.AccountParams=} params - User data to pass to the server.
   *
   * @returns {Promise} Promise which will be resolved/rejected when server reply is received.
   */
  createAccountBasic: function(username, password, params) {
    // Make sure we are not using 'null' or 'undefined';
    username = username || '';
    password = password || '';
    return this.createAccount('basic',
      b64EncodeUnicode(username + ':' + password), true, params);
  },

  /**
   * Update user's credentials for 'basic' authentication scheme. Wrapper for {@link Tinode#account}.
   * @memberof Tinode#
   *
   * @param {string} uid - User ID to update.
   * @param {string} username - Login to use for the new account.
   * @param {string} password - User's password.
   * @param {Tinode.AccountParams=} params - data to pass to the server.
   *
   * @returns {Promise} Promise which will be resolved/rejected when server reply is received.
   */
  updateAccountBasic: function(uid, username, password, params) {
    // Make sure we are not using 'null' or 'undefined';
    username = username || '';
    password = password || '';
    return this.account(uid, 'basic',
      b64EncodeUnicode(username + ':' + password), false, params);
  },

  /**
   * Send handshake to the server.
   * @memberof Tinode#
   *
   * @returns {Promise} Promise which will be resolved/rejected when server reply is received.
   */
  hello: function() {
    const pkt = this.initPacket('hi');

    return this.send(pkt, pkt.hi.id)
      .then((ctrl) => {
        // Reset backoff counter on successful connection.
        this._connection.backoffReset();

        // Server response contains server protocol version, build, constraints,
        // session ID for long polling. Save them.
        if (ctrl.params) {
          this._serverInfo = ctrl.params;
        }

        if (this.onConnect) {
          this.onConnect();
        }

        return ctrl;
      }).catch((err) => {
        this._connection.reconnect(true);

        if (this.onDisconnect) {
          this.onDisconnect(err);
        }
      });
  },

  /**
   * Set or refresh the push notifications/device token. If the client is connected,
   * the deviceToken can be sent to the server.
   *
   * @memberof Tinode#
   * @param {string} dt - token obtained from the provider.
   * @param {boolean} sendToServer - if true, send dt to server immediately.
   *
   * @param true if attempt was made to send the token to the server.
   */
  setDeviceToken: function(dt, sendToServer) {
    let sent = false;
    if (dt && dt != this._deviceToken) {
      this._deviceToken = dt;
      if (sendToServer && this.isConnected() && this.isAuthenticated()) {
        this.send({
          'hi': {
            'dev': dt
          }
        });
        sent = true;
      }
    }
    return sent;
  },

  /**
   * Authenticate current session.
   * @memberof Tinode#
   *
   * @param {String} scheme - Authentication scheme; <tt>"basic"</tt> is the only currently supported scheme.
   * @param {String} secret - Authentication secret, assumed to be already base64 encoded.
   *
   * @returns {Promise} Promise which will be resolved/rejected when server reply is received.
   */
  login: function(scheme, secret, cred) {
    const pkt = this.initPacket('login');
    pkt.login.scheme = scheme;
    pkt.login.secret = secret;
    pkt.login.cred = cred;

    return this.send(pkt, pkt.login.id)
      .then((ctrl) => {
        this.loginSuccessful(ctrl);
        return ctrl;
      });
  },

  /**
   * Wrapper for {@link Tinode#login} with basic authentication
   * @memberof Tinode#
   *
   * @param {String} uname - User name.
   * @param {String} password  - Password.
   * @returns {Promise} Promise which will be resolved/rejected on receiving server reply.
   */
  loginBasic: function(uname, password, cred) {
    return this.login('basic', b64EncodeUnicode(uname + ':' + password), cred)
      .then((ctrl) => {
        this._login = uname;
        return ctrl;
      });
  },

  /**
   * Wrapper for {@link Tinode#login} with token authentication
   * @memberof Tinode#
   *
   * @param {String} token - Token received in response to earlier login.
   * @returns {Promise} Promise which will be resolved/rejected on receiving server reply.
   */
  loginToken: function(token, cred) {
    return this.login('token', token, cred);
  },

  /**
   * Send a request for resetting an authentication secret.
   * @memberof Tinode#
   *
   * @param {String} scheme - authentication scheme to reset.
   * @param {String} method - method to use for resetting the secret, such as "email" or "tel".
   * @param {String} value - value of the credential to use, a specific email address or a phone number.
   *
   * @returns {Promise} Promise which will be resolved/rejected on receiving the server reply.
   */
  requestResetAuthSecret: function(scheme, method, value) {
    return this.login('reset', b64EncodeUnicode(scheme + ':' + method + ':' + value));
  },

  /**
   * @typedef AuthToken
   * @memberof Tinode
   * @type Object
   * @property {String} token - Token value.
   * @property {Date} expires - Token expiration time.
   */
  /**
   * Get stored authentication token.
   * @memberof Tinode#
   *
   * @returns {Tinode.AuthToken} authentication token.
   */
  getAuthToken: function() {
    if (this._authToken && (this._authToken.expires.getTime() > Date.now())) {
      return this._authToken;
    } else {
      this._authToken = null;
    }
    return null;
  },

  /**
   * Application may provide a saved authentication token.
   * @memberof Tinode#
   *
   * @param {Tinode.AuthToken} token - authentication token.
   */
  setAuthToken: function(token) {
    this._authToken = token;
  },

  /**
   * @typedef SetParams
   * @memberof Tinode
   * @property {Tinode.SetDesc=} desc - Topic initialization parameters when creating a new topic or a new subscription.
   * @property {Tinode.SetSub=} sub - Subscription initialization parameters.
   */
  /**
   * @typedef SetDesc
   * @memberof Tinode
   * @property {Tinode.DefAcs=} defacs - Default access mode.
   * @property {Object=} public - Free-form topic description, publically accessible.
   * @property {Object=} private - Free-form topic descriptionaccessible only to the owner.
   */
  /**
   * @typedef SetSub
   * @memberof Tinode
   * @property {String=} user - UID of the user affected by the request. Default (empty) - current user.
   * @property {String=} mode - User access mode, either requested or assigned dependent on context.
   * @property {Object=} info - Free-form payload to pass to the invited user or topic manager.
   */
  /**
   * Parameters passed to {@link Tinode#subscribe}.
   *
   * @typedef SubscriptionParams
   * @memberof Tinode
   * @property {Tinode.SetParams=} set - Parameters used to initialize topic
   * @property {Tinode.GetQuery=} get - Query for fetching data from topic.
   */

  /**
   * Send a topic subscription request.
   * @memberof Tinode#
   *
   * @param {String} topic - Name of the topic to subscribe to.
   * @param {Tinode.GetQuery=} getParams - Optional subscription metadata query
   * @param {Tinode.SetParams=} setParams - Optional initialization parameters
   *
   * @returns {Promise} Promise which will be resolved/rejected on receiving server reply.
   */
  subscribe: function(topicName, getParams, setParams) {
    const pkt = this.initPacket('sub', topicName)
    if (!topicName) {
      topicName = TOPIC_NEW;
    }

    pkt.sub.get = getParams;

    if (setParams) {
      if (setParams.sub) {
        pkt.sub.set.sub = setParams.sub;
      }

      if (setParams.desc) {
        if (Tinode.isNewGroupTopicName(topicName)) {
          // Full set.desc params are used for new topics only
          pkt.sub.set.desc = setParams.desc;
        } else if (Tinode.topicType(topicName) == 'p2p' && setParams.desc.defacs) {
          // Use optional default permissions only.
          pkt.sub.set.desc = {
            defacs: setParams.desc.defacs
          };
        }
      }

      if (setParams.tags) {
        pkt.sub.set.tags = setParams.tags;
      }
    }

    return this.send(pkt, pkt.sub.id);
  },

  /**
   * Detach and optionally unsubscribe from the topic
   * @memberof Tinode#
   *
   * @param {String} topic - Topic to detach from.
   * @param {Boolean} unsub - If <tt>true</tt>, detach and unsubscribe, otherwise just detach.
   *
   * @returns {Promise} Promise which will be resolved/rejected on receiving server reply.
   */
  leave: function(topic, unsub) {
    const pkt = this.initPacket('leave', topic);
    pkt.leave.unsub = unsub;

    return this.send(pkt, pkt.leave.id);
  },

  /**
   * Create message draft without sending it to the server.
   * @memberof Tinode#
   *
   * @param {String} topic - Name of the topic to publish to.
   * @param {Object} data - Payload to publish.
   * @param {Boolean=} noEcho - If <tt>true</tt>, tell the server not to echo the message to the original session.
   *
   * @returns {Object} new message which can be sent to the server or otherwise used.
   */
  createMessage: function(topic, data, noEcho) {
    const pkt = this.initPacket('pub', topic);

    let dft = typeof data == 'string' ? Drafty.parse(data) : data;
    if (dft && !Drafty.isPlainText(dft)) {
      pkt.pub.head = {
        mime: Drafty.getContentType()
      };
      data = dft;
    }
    pkt.pub.noecho = noEcho;
    pkt.pub.content = data;

    return pkt.pub;
  },

  /**
   * Publish {data} message to topic.
   * @memberof Tinode#
   *
   * @param {String} topic - Name of the topic to publish to.
   * @param {Object} data - Payload to publish.
   * @param {Boolean=} noEcho - If <tt>true</tt>, tell the server not to echo the message to the original session.
   *
   * @returns {Promise} Promise which will be resolved/rejected on receiving server reply.
   */
  publish: function(topic, data, noEcho) {
    return this.publishMessage(
      this.createMessage(topic, data, noEcho)
    );
  },

  /**
   * Publish message to topic. The message should be created by {@link Tinode#createMessage}.
   * @memberof Tinode#
   *
   * @param {Object} pub - Message to publish.
   *
   * @returns {Promise} Promise which will be resolved/rejected on receiving server reply.
   */
  publishMessage: function(pub) {
    // Make a shallow copy. Needed in order to clear locally-assigned temp values;
    pub = Object.assign({}, pub);
    pub.seq = undefined;
    pub.from = undefined;
    pub.ts = undefined;
    return this.send2({
      pub: pub
    }, pub.id, 1);
  },

  /**
   * @typedef GetQuery
   * @type Object
   * @memberof Tinode
   * @property {Tinode.GetOptsType=} desc - If provided (even if empty), fetch topic description.
   * @property {Tinode.GetOptsType=} sub - If provided (even if empty), fetch topic subscriptions.
   * @property {Tinode.GetDataType=} data - If provided (even if empty), get messages.
   */

  /**
   * @typedef GetOptsType
   * @type Object
   * @memberof Tinode
   * @property {Date=} ims - "If modified since", fetch data only it was was modified since stated date.
   * @property {Number=} limit - Maximum number of results to return. Ignored when querying topic description.
   */

  /**
   * @typedef GetDataType
   * @type Object
   * @memberof Tinode
   * @property {Number=} since - Load messages with seq id equal or greater than this value.
   * @property {Number=} before - Load messages with seq id lower than this number.
   * @property {Number=} limit - Maximum number of results to return.
   */

  /**
   * Request topic metadata
   * @memberof Tinode#
   *
   * @param {String} topic - Name of the topic to query.
   * @param {Tinode.GetQuery} params - Parameters of the query. Use {Tinode.MetaGetBuilder} to generate.
   *
   * @returns {Promise} Promise which will be resolved/rejected on receiving server reply.
   */
  getMeta: function(topic, params) {
    const pkt = this.initPacket('get', topic);

    pkt.get = mergeObj(pkt.get, params);

    return this.send(pkt, pkt.get.id);
  },

  /**
   * Update topic's metadata: description, subscribtions.
   * @memberof Tinode#
   *
   * @param {String} topic - Topic to update.
   * @param {Tinode.SetParams} params - topic metadata to update.
   * @returns {Promise} Promise which will be resolved/rejected on receiving server reply.
   */
  setMeta: function(topic, params) {
    const pkt = this.initPacket('set', topic);
    const what = [];

    if (params) {
      ['desc', 'sub', 'tags', 'cred'].map(function(key) {
        if (params.hasOwnProperty(key)) {
          what.push(key);
          pkt.set[key] = params[key];
        }
      });
    }

    if (what.length == 0) {
      return Promise.reject(new Error("Invalid {set} parameters"));
    }

    return this.send(pkt, pkt.set.id);
  },

  /**
   * Range of message IDs to delete.
   *
   * @typedef DelRange
   * @type Object
   * @memberof Tinode
   * @property {Number} low - low end of the range, inclusive (closed).
   * @property {Number=} hi - high end of the range, exclusive (open).
   */
  /**
   * Delete some or all messages in a topic.
   * @memberof Tinode#
   *
   * @param {String} topic - Topic name to delete messages from.
   * @param {Tinode.DelRange[]} list - Ranges of message IDs to delete.
   * @param {Boolean=} hard - Hard or soft delete
   *
   * @returns {Promise} Promise which will be resolved/rejected on receiving server reply.
   */
  delMessages: function(topic, ranges, hard) {
    const pkt = this.initPacket('del', topic);

    pkt.del.what = 'msg';
    pkt.del.delseq = ranges;
    pkt.del.hard = hard;

    return this.send(pkt, pkt.del.id);
  },

  /**
   * Delete the topic alltogether. Requires Owner permission.
   * @memberof Tinode#
   *
   * @param {String} topic - Name of the topic to delete
   * @returns {Promise} Promise which will be resolved/rejected on receiving server reply.
   */
  delTopic: function(topic) {
    const pkt = this.initPacket('del', topic);
    pkt.del.what = 'topic';

    return this.send(pkt, pkt.del.id).then((ctrl) => {
      this.cacheDel('topic', topic);
      return this.ctrl;
    });
  },

  /**
   * Delete subscription. Requires Share permission.
   * @memberof Tinode#
   *
   * @param {String} topic - Name of the topic to delete
   * @param {String} user - User ID to remove.
   * @returns {Promise} Promise which will be resolved/rejected on receiving server reply.
   */
  delSubscription: function(topic, user) {
    const pkt = this.initPacket('del', topic);
    pkt.del.what = 'sub';
    pkt.del.user = user;

    return this.send(pkt, pkt.del.id);
  },

  /**
   * Delete credential. Must be 'me' topic.
   * @memberof Tinode#
   *
   * @param {String} topic - 'me'.
   * @param {String} method - validation method such as 'email' or 'tel'.
   * @param {String} value - validation value, i.e. 'alice@example.com'.
   * @returns {Promise} Promise which will be resolved/rejected on receiving server reply.
   */
  delCredential: function(topic, method, value) {
    if (topic != 'me') {
      throw new Error("Invalid topic for deleting credentials '" + topic + "'");
    }
    const pkt = this.initPacket('del', topic);
    pkt.del.what = 'cred';
    pkt.del.cred = {
      meth: method,
      val: value
    };
    return this.send(pkt, pkt.del.id);
  },

  /**
   * Notify server that a message or messages were read or received. Does NOT return promise.
   * @memberof Tinode#
   *
   * @param {String} topic - Name of the topic where the mesage is being aknowledged.
   * @param {String} what - Action being aknowledged, either "read" or "recv".
   * @param {Number} seq - Maximum id of the message being acknowledged.
   */
  note: function(topic, what, seq) {
    if (seq <= 0 || seq >= LOCAL_SEQID) {
      throw new Error("Invalid message id " + seq);
    }

    const pkt = this.initPacket('note', topic);
    pkt.note.what = what;
    pkt.note.seq = seq;
    this.send(pkt);
  },

  /**
   * Broadcast a key-press notification to topic subscribers. Used to show
   * typing notifications "user X is typing...".
   * @memberof Tinode#
   *
   * @param {String} topic - Name of the topic to broadcast to.
   */
  noteKeyPress: function(topic) {
    const pkt = this.initPacket('note', topic);
    pkt.note.what = 'kp';
    this.send(pkt);
  },

  /**
   * Get a named topic, either pull it from cache or create a new instance.
   * There is a single instance of topic for each name.
   * @memberof Tinode#
   *
   * @param {String} topic - Name of the topic to get.
   * @returns {Tinode.Topic} Requested or newly created topic or <tt>undefined</tt> if topic name is invalid.
   */
  getTopic: function(name) {
    let topic = this.cacheGet('topic', name);
    if (!topic && name) {
      if (name == TOPIC_ME) {
        topic = new TopicMe();
      } else if (name == TOPIC_FND) {
        topic = new TopicFnd();
      } else {
        topic = new Topic(name);
      }
      // topic._new = false;
      this.cachePut('topic', name, topic);
      this.attachCacheToTopic(topic);
    }
    return topic;
  },

  /**
   * Instantiate a new unnamed topic. An actual name will be assigned by the server
   * on {@link Tinode.Topic.subscribe}.
   * @memberof Tinode#
   *
   * @param {Tinode.Callbacks} callbacks - Object with callbacks for various events.
   * @returns {Tinode.Topic} Newly created topic.
   */
  newTopic: function(callbacks) {
    const topic = new Topic(TOPIC_NEW, callbacks);
    this.attachCacheToTopic(topic);
    return topic;
  },

  /**
   * Generate unique name  like 'new123456' suitable for creating a new group topic.
   * @memberof Tinode#
   *
   * @returns {string} name which can be used for creating a new group topic.
   */
  newGroupTopicName: function() {
    return TOPIC_NEW + this.getNextUniqueId();
  },

  /**
   * Instantiate a new P2P topic with a given peer.
   * @memberof Tinode#
   *
   * @param {string} peer - UID of the peer to start topic with.
   * @param {Tinode.Callbacks} callbacks - Object with callbacks for various events.
   * @returns {Tinode.Topic} Newly created topic.
   */
  newTopicWith: function(peer, callbacks) {
    const topic = new Topic(peer, callbacks);
    this.attachCacheToTopic(topic);
    return topic;
  },

  /**
   * Instantiate 'me' topic or get it from cache.
   * @memberof Tinode#
   *
   * @returns {Tinode.TopicMe} Instance of 'me' topic.
   */
  getMeTopic: function() {
    return this.getTopic(TOPIC_ME);
  },

  /**
   * Instantiate 'fnd' (find) topic or get it from cache.
   * @memberof Tinode#
   *
   * @returns {Tinode.Topic} Instance of 'fnd' topic.
   */
  getFndTopic: function() {
    return this.getTopic(TOPIC_FND);
  },

  /**
   * Create a new LargeFileHelper instance
   * @memberof Tinode#
   *
   * @returns {Tinode.LargeFileHelper} instance of a LargeFileHelper.
   */
  getLargeFileHelper: function() {
    return new LargeFileHelper(this);
  },

  /**
   * Get the UID of the the current authenticated user.
   * @memberof Tinode#
   * @returns {string} UID of the current user or <tt>undefined</tt> if the session is not yet authenticated or if there is no session.
   */
  getCurrentUserID: function() {
    return this._myUID;
  },

  /**
   * Check if the given user ID is equal to the current user's UID.
   * @memberof Tinode#
   * @param {string} uid - UID to check.
   * @returns {boolean} true if the given UID belongs to the current logged in user.
   */
  isMe: function(uid) {
    return this._myUID === uid;
  },

  /**
   * Get login used for last successful authentication.
   * @memberof Tinode#
   * @returns {string} login last used successfully or <tt>undefined</tt>.
   */
  getCurrentLogin: function() {
    return this._login;
  },

  /**
   * Return information about the server: protocol version and build timestamp.
   * @memberof Tinode#
   * @returns {Object} build and version of the server or <tt>null</tt> if there is no connection or if the first server response has not been received yet.
   */
  getServerInfo: function() {
    return this._serverInfo;
  },

  /**
   * Toggle console logging. Logging is off by default.
   * @memberof Tinode#
   * @param {boolean} enabled - Set to <tt>true</tt> to enable logging to console.
   */
  enableLogging: function(enabled, trimLongStrings) {
    this._loggingEnabled = enabled;
    this._trimLongStrings = enabled && trimLongStrings;
  },

  /**
   * Check if given topic is online.
   * @memberof Tinode#
   *
   * @param {String} name - Name of the topic to test.
   * @returns {Boolean} true if topic is online, false otherwise.
   */
  isTopicOnline: function(name) {
    const me = this.getMeTopic();
    const cont = me && me.getContact(name);
    return cont && cont.online;
  },

  /**
   * Include message ID into all subsequest messages to server instructin it to send aknowledgemens.
   * Required for promises to function. Default is "on".
   * @memberof Tinode#
   *
   * @param {Boolean} status - Turn aknowledgemens on or off.
   * @deprecated
   */
  wantAkn: function(status) {
    if (status) {
      this._messageId = Math.floor((Math.random() * 0xFFFFFF) + 0xFFFFFF);
    } else {
      this._messageId = 0;
    }
  },

  // Callbacks:
  /**
   * Callback to report when the websocket is opened. The callback has no parameters.
   * @memberof Tinode#
   * @type {Tinode.onWebsocketOpen}
   */
  onWebsocketOpen: undefined,

  /**
   * @typedef Tinode.ServerParams
   * @memberof Tinode
   * @type Object
   * @property {string} ver - Server version
   * @property {string} build - Server build
   * @property {string=} sid - Session ID, long polling connections only.
   */

  /**
   * @callback Tinode.onConnect
   * @param {number} code - Result code
   * @param {string} text - Text epxplaining the completion, i.e "OK" or an error message.
   * @param {Tinode.ServerParams} params - Parameters returned by the server.
   */
  /**
   * Callback to report when connection with Tinode server is established.
   * @memberof Tinode#
   * @type {Tinode.onConnect}
   */
  onConnect: undefined,

  /**
   * Callback to report when connection is lost. The callback has no parameters.
   * @memberof Tinode#
   * @type {Tinode.onDisconnect}
   */
  onDisconnect: undefined,

  /**
   * @callback Tinode.onLogin
   * @param {number} code - NUmeric completion code, same as HTTP status codes.
   * @param {string} text - Explanation of the completion code.
   */
  /**
   * Callback to report login completion.
   * @memberof Tinode#
   * @type {Tinode.onLogin}
   */
  onLogin: undefined,

  /**
   * Callback to receive {ctrl} (control) messages.
   * @memberof Tinode#
   * @type {Tinode.onCtrlMessage}
   */
  onCtrlMessage: undefined,

  /**
   * Callback to recieve {data} (content) messages.
   * @memberof Tinode#
   * @type {Tinode.onDataMessage}
   */
  onDataMessage: undefined,

  /**
   * Callback to receive {pres} (presence) messages.
   * @memberof Tinode#
   * @type {Tinode.onPresMessage}
   */
  onPresMessage: undefined,

  /**
   * Callback to receive all messages as objects.
   * @memberof Tinode#
   * @type {Tinode.onMessage}
   */
  onMessage: undefined,

  /**
   * Callback to receive all messages as unparsed text.
   * @memberof Tinode#
   * @type {Tinode.onRawMessage}
   */
  onRawMessage: undefined,

  /**
   * Callback to receive server responses to network probes. See {@link Tinode#networkProbe}
   * @memberof Tinode#
   * @type {Tinode.onNetworkProbe}
   */
  onNetworkProbe: undefined,

  /**
   * Callback to be notified when exponential backoff is iterating.
   * @memberof Tinode#
   * @type {Tinode.onAutoreconnectIteration}
   */
  onAutoreconnectIteration: undefined,
};

/**
 * Helper class for constructing {@link Tinode.GetQuery}.
 *
 * @class MetaGetBuilder
 * @memberof Tinode
 *
 * @param {Tinode.Topic} parent topic which instantiated this builder.
 */
var MetaGetBuilder = function(parent) {
  this.topic = parent;
  const me = parent._tinode.getMeTopic();
  this.contact = me && me.getContact(parent.name);
  this.what = {};
}

MetaGetBuilder.prototype = {

  // Get latest timestamp
  _get_ims: function() {
    const cupd = this.contact && this.contact.updated;
    const tupd = this.topic._lastDescUpdate || 0;
    return cupd > tupd ? cupd : tupd;
  },

  /**
   * Add query parameters to fetch messages within explicit limits.
   * @memberof Tinode.MetaGetBuilder#
   *
   * @param {Number=} since messages newer than this (inclusive);
   * @param {Number=} before older than this (exclusive)
   * @param {Number=} limit number of messages to fetch
   * @returns {Tinode.MetaGetBuilder} <tt>this</tt> object.
   */
  withData: function(since, before, limit) {
    this.what['data'] = {
      since: since,
      before: before,
      limit: limit
    };
    return this;
  },

  /**
   * Add query parameters to fetch messages newer than the latest saved message.
   * @memberof Tinode.MetaGetBuilder#
   *
   * @param {Number=} limit number of messages to fetch
   *
   * @returns {Tinode.MetaGetBuilder} <tt>this</tt> object.
   */
  withLaterData: function(limit) {
    return this.withData(this.topic._maxSeq > 0 ? this.topic._maxSeq + 1 : undefined, undefined, limit);
  },

  /**
   * Add query parameters to fetch messages older than the earliest saved message.
   * @memberof Tinode.MetaGetBuilder#
   *
   * @param {Number=} limit maximum number of messages to fetch.
   *
   * @returns {Tinode.MetaGetBuilder} <tt>this</tt> object.
   */
  withEarlierData: function(limit) {
    return this.withData(undefined, this.topic._minSeq > 0 ? this.topic._minSeq : undefined, limit);
  },

  /**
   * Add query parameters to fetch topic description if it's newer than the given timestamp.
   * @memberof Tinode.MetaGetBuilder#
   *
   * @param {Date=} ims fetch messages newer than this timestamp.
   *
   * @returns {Tinode.MetaGetBuilder} <tt>this</tt> object.
   */
  withDesc: function(ims) {
    this.what['desc'] = {
      ims: ims
    };
    return this;
  },

  /**
   * Add query parameters to fetch topic description if it's newer than the last update.
   * @memberof Tinode.MetaGetBuilder#
   *
   * @returns {Tinode.MetaGetBuilder} <tt>this</tt> object.
   */
  withLaterDesc: function() {
    return this.withDesc(this._get_ims());
  },

  /**
   * Add query parameters to fetch subscriptions.
   * @memberof Tinode.MetaGetBuilder#
   *
   * @param {Date=} ims fetch subscriptions modified more recently than this timestamp
   * @param {Number=} limit maximum number of subscriptions to fetch.
   * @param {String=} userOrTopic user ID or topic name to fetch for fetching one subscription.
   *
   * @returns {Tinode.MetaGetBuilder} <tt>this</tt> object.
   */
  withSub: function(ims, limit, userOrTopic) {
    const opts = {
      ims: ims,
      limit: limit
    };
    if (this.topic.getType() == 'me') {
      opts.topic = userOrTopic;
    } else {
      opts.user = userOrTopic;
    }
    this.what['sub'] = opts;
    return this;
  },

  /**
   * Add query parameters to fetch a single subscription.
   * @memberof Tinode.MetaGetBuilder#
   *
   * @param {Date=} ims fetch subscriptions modified more recently than this timestamp
   * @param {String=} userOrTopic user ID or topic name to fetch for fetching one subscription.
   *
   * @returns {Tinode.MetaGetBuilder} <tt>this</tt> object.
   */
  withOneSub: function(ims, userOrTopic) {
    return this.withSub(ims, undefined, userOrTopic);
  },

  /**
   * Add query parameters to fetch a single subscription if it's been updated since the last update.
   * @memberof Tinode.MetaGetBuilder#
   *
   * @param {String=} userOrTopic user ID or topic name to fetch for fetching one subscription.
   *
   * @returns {Tinode.MetaGetBuilder} <tt>this</tt> object.
   */
  withLaterOneSub: function(userOrTopic) {
    return this.withOneSub(this.topic._lastSubsUpdate, userOrTopic);
  },

  /**
   * Add query parameters to fetch subscriptions updated since the last update.
   * @memberof Tinode.MetaGetBuilder#
   *
   * @param {Number=} limit maximum number of subscriptions to fetch.
   *
   * @returns {Tinode.MetaGetBuilder} <tt>this</tt> object.
   */
  withLaterSub: function(limit) {
    return this.withSub(
      this.topic.getType() == 'p2p' ? this._get_ims() : this.topic._lastSubsUpdate,
      limit);
  },

  /**
   * Add query parameters to fetch topic tags.
   * @memberof Tinode.MetaGetBuilder#
   *
   * @returns {Tinode.MetaGetBuilder} <tt>this</tt> object.
   */
  withTags: function() {
    this.what['tags'] = true;
    return this;
  },

  /**
   * Add query parameters to fetch user's credentials. 'me' topic only.
   * @memberof Tinode.MetaGetBuilder#
   *
   * @returns {Tinode.MetaGetBuilder} <tt>this</tt> object.
   */
  withCred: function() {
    if (this.topic.getType() == 'me') {
      this.what['cred'] = true;
    } else {
      this.topic._tinode.logger("ERROR: Invalid topic type for MetaGetBuilder:withCreds", this.topic.getType());
    }
    return this;
  },

  /**
   * Add query parameters to fetch deleted messages within explicit limits. Any/all parameters can be null.
   * @memberof Tinode.MetaGetBuilder#
   *
   * @param {Number=} since ids of messages deleted since this 'del' id (inclusive)
   * @param {Number=} limit number of deleted message ids to fetch
   *
   * @returns {Tinode.MetaGetBuilder} <tt>this</tt> object.
   */
  withDel: function(since, limit) {
    if (since || limit) {
      this.what['del'] = {
        since: since,
        limit: limit
      };
    }
    return this;
  },

  /**
   * Add query parameters to fetch messages deleted after the saved 'del' id.
   * @memberof Tinode.MetaGetBuilder#
   *
   * @param {Number=} limit number of deleted message ids to fetch
   *
   * @returns {Tinode.MetaGetBuilder} <tt>this</tt> object.
   */
  withLaterDel: function(limit) {
    // Specify 'since' only if we have already received some messages. If
    // we have no locally cached messages then we don't care if any messages were deleted.
    return this.withDel(this.topic._maxSeq > 0 ? this.topic._maxDel + 1 : undefined, limit);
  },

  /**
   * Construct parameters
   * @memberof Tinode.MetaGetBuilder#
   *
   * @returns {Tinode.GetQuery} Get query
   */
  build: function() {
    const what = [];
    const instance = this;
    let params = {};
    ['data', 'sub', 'desc', 'tags', 'cred', 'del'].map(function(key) {
      if (instance.what.hasOwnProperty(key)) {
        what.push(key);
        if (Object.getOwnPropertyNames(instance.what[key]).length > 0) {
          params[key] = instance.what[key];
        }
      }
    });
    if (what.length > 0) {
      params.what = what.join(' ');
    } else {
      params = undefined;
    }
    return params;
  }
};

/**
 * Helper class for handling access mode.
 *
 * @class AccessMode
 * @memberof Tinode
 *
 * @param {AccessMode|Object=} acs AccessMode to copy or access mode object received from the server.
 */
var AccessMode = function(acs) {
  if (acs) {
    this.given = typeof acs.given == 'number' ? acs.given : AccessMode.decode(acs.given);
    this.want = typeof acs.want == 'number' ? acs.want : AccessMode.decode(acs.want);
    this.mode = acs.mode ? (typeof acs.mode == 'number' ? acs.mode : AccessMode.decode(acs.mode)) :
      (this.given & this.want);
  }
};

AccessMode._NONE = 0x00;
AccessMode._JOIN = 0x01;
AccessMode._READ = 0x02;
AccessMode._WRITE = 0x04;
AccessMode._PRES = 0x08;
AccessMode._APPROVE = 0x10;
AccessMode._SHARE = 0x20;
AccessMode._DELETE = 0x40;
AccessMode._OWNER = 0x80;

AccessMode._BITMASK = AccessMode._JOIN | AccessMode._READ | AccessMode._WRITE | AccessMode._PRES |
  AccessMode._APPROVE | AccessMode._SHARE | AccessMode._DELETE | AccessMode._OWNER;
AccessMode._INVALID = 0x100000;

AccessMode._checkFlag = function(val, side, flag) {
  side = side || 'mode';
  if (['given', 'want', 'mode'].includes(side)) {
    return ((val[side] & flag) != 0);
  }
  throw new Error("Invalid AccessMode component '" + side + "'");
}

/**
 * Parse string into an access mode value.
 * @memberof Tinode.AccessMode
 * @static
 *
 * @param {string | number} mode - either a String representation of the access mode to parse or a set of bits to assign.
 * @returns {number} - Access mode as a numeric value.
 */
AccessMode.decode = function(str) {
  if (!str) {
    return null;
  } else if (typeof str == 'number') {
    return str & AccessMode._BITMASK;
  } else if (str === 'N' || str === 'n') {
    return AccessMode._NONE;
  }

  const bitmask = {
    'J': AccessMode._JOIN,
    'R': AccessMode._READ,
    'W': AccessMode._WRITE,
    'P': AccessMode._PRES,
    'A': AccessMode._APPROVE,
    'S': AccessMode._SHARE,
    'D': AccessMode._DELETE,
    'O': AccessMode._OWNER
  };

  let m0 = AccessMode._NONE;

  for (let i = 0; i < str.length; i++) {
    const bit = bitmask[str.charAt(i).toUpperCase()];
    if (!bit) {
      // Unrecognized bit, skip.
      continue;
    }
    m0 |= bit;
  }
  return m0;
};

/**
 * Convert numeric representation of the access mode into a string.
 *
 * @memberof Tinode.AccessMode
 * @static
 *
 * @param {number} val - access mode value to convert to a string.
 * @returns {string} - Access mode as a string.
 */
AccessMode.encode = function(val) {
  if (val === null || val === AccessMode._INVALID) {
    return null;
  } else if (val === AccessMode._NONE) {
    return 'N';
  }

  const bitmask = ['J', 'R', 'W', 'P', 'A', 'S', 'D', 'O'];
  let res = '';
  for (let i = 0; i < bitmask.length; i++) {
    if ((val & (1 << i)) != 0) {
      res = res + bitmask[i];
    }
  }
  return res;
};

/**
 * Update numeric representation of access mode with the new value. The value
 * is one of the following:
 *  - a string starting with '+' or '-' then the bits to add or remove, e.g. '+R-W' or '-PS'.
 *  - a new value of access mode
 *
 * @memberof Tinode.AccessMode
 * @static
 *
 * @param {number} val - access mode value to update.
 * @param {string} upd - update to apply to val.
 * @returns {number} - updated access mode.
 */
AccessMode.update = function(val, upd) {
  if (!upd || typeof upd != 'string') {
    return val;
  }

  let action = upd.charAt(0);
  if (action == '+' || action == '-') {
    let val0 = val;
    // Split delta-string like '+ABC-DEF+Z' into an array of parts including + and -.
    const parts = upd.split(/([-+])/);
    // Starting iteration from 1 because String.split() creates an array with the first empty element.
    // Iterating by 2 because we parse pairs +/- then data.
    for (let i = 1; i < parts.length - 1; i += 2) {
      action = parts[i];
      const m0 = AccessMode.decode(parts[i + 1]);
      if (m0 == AccessMode._INVALID) {
        return val;
      }
      if (m0 == null) {
        continue;
      }
      if (action === '+') {
        val0 |= m0;
      } else if (action === '-') {
        val0 &= ~m0;
      }
    }
    val = val0;
  } else {
    // The string is an explicit new value 'ABC' rather than delta.
    const val0 = AccessMode.decode(upd);
    if (val0 != AccessMode._INVALID) {
      val = val0;
    }
  }

  return val;
};

/**
 * AccessMode is a class representing topic access mode.
 * @class Topic
 * @memberof Tinode
 */
AccessMode.prototype = {
  /**
   * Custom formatter
   */
  toString: function() {
    return '{"mode": "' + AccessMode.encode(this.mode) +
      '", "given": "' + AccessMode.encode(this.given) +
      '", "want": "' + AccessMode.encode(this.want) + '"}';
  },
  /**
   * Convert numeric values to strings.
   */
  jsonHelper: function() {
    return {
      mode: AccessMode.encode(this.mode),
      given: AccessMode.encode(this.given),
      want: AccessMode.encode(this.want)
    };
  },
  /**
   * Assign value to 'mode'.
   * @memberof Tinode.AccessMode
   *
   * @param {string | number} m - either a string representation of the access mode or a set of bits.
   * @returns {AccessMode} - <b>this</b> AccessMode.
   */
  setMode: function(m) {
    this.mode = AccessMode.decode(m);
    return this;
  },
  /**
   * Update 'mode' value.
   * @memberof Tinode.AccessMode
   *
   * @param {string} u - string representation of the changes to apply to access mode.
   * @returns {AccessMode} - <b>this</b> AccessMode.
   */
  updateMode: function(u) {
    this.mode = AccessMode.update(this.mode, u);
    return this;
  },
  /**
   * Get 'mode' value as a string.
   * @memberof Tinode.AccessMode
   *
   * @returns {string} - <b>mode</b> value.
   */
  getMode: function() {
    return AccessMode.encode(this.mode);
  },

  /**
   * Assign 'given' value.
   * @memberof Tinode.AccessMode
   *
   * @param {string | number} g - either a string representation of the access mode or a set of bits.
   * @returns {AccessMode} - <b>this</b> AccessMode.
   */
  setGiven: function(g) {
    this.given = AccessMode.decode(g);
    return this;
  },
  /**
   * Update 'given' value.
   * @memberof Tinode.AccessMode
   *
   * @param {string} u - string representation of the changes to apply to access mode.
   * @returns {AccessMode} - <b>this</b> AccessMode.
   */
  updateGiven: function(u) {
    this.given = AccessMode.update(this.given, u);
    return this;
  },
  /**
   * Get 'given' value as a string.
   * @memberof Tinode.AccessMode
   *
   * @returns {string} - <b>given</b> value.
   */
  getGiven: function() {
    return AccessMode.encode(this.given);
  },

  /**
   * Assign 'want' value.
   * @memberof Tinode.AccessMode
   *
   * @param {string | number} w - either a string representation of the access mode or a set of bits.
   * @returns {AccessMode} - <b>this</b> AccessMode.
   */
  setWant: function(w) {
    this.want = AccessMode.decode(w);
    return this;
  },
  /**
   * Update 'want' value.
   * @memberof Tinode.AccessMode
   *
   * @param {string} u - string representation of the changes to apply to access mode.
   * @returns {AccessMode} - <b>this</b> AccessMode.
   */
  updateWant: function(u) {
    this.want = AccessMode.update(this.want, u);
    return this;
  },
  /**
   * Get 'want' value as a string.
   * @memberof Tinode.AccessMode
   *
   * @returns {string} - <b>want</b> value.
   */
  getWant: function() {
    return AccessMode.encode(this.want);
  },

  /**
   * Get permissions present in 'want' but missing in 'given'.
   * Inverse of {@link Tinode.AccessMode#getExcessive}
   *
   * @memberof Tinode.AccessMode
   *
   * @returns {string} permissions present in <b>want</b> but missing in <b>given</b>.
   */
  getMissing: function() {
    return AccessMode.encode(this.want & ~this.given);
  },

  /**
   * Get permissions present in 'given' but missing in 'want'.
   * Inverse of {@link Tinode.AccessMode#getMissing}
   * @memberof Tinode.AccessMode
   *
   * @returns {string} permissions present in <b>given</b> but missing in <b>want</b>.
   */
  getExcessive: function() {
    return AccessMode.encode(this.given & ~this.want);
  },

  /**
   * Update 'want', 'give', and 'mode' values.
   * @memberof Tinode.AccessMode
   *
   * @param {AccessMode} val - new access mode value.
   * @returns {AccessMode} - <b>this</b> AccessMode.
   */
  updateAll: function(val) {
    if (val) {
      this.updateGiven(val.given);
      this.updateWant(val.want);
      this.mode = this.given & this.want;
    }
    return this;
  },

  /**
   * Check if Owner (O) flag is set.
   * @memberof Tinode.AccessMode
   * @param {string=} side - which permission to check: given, want, mode; default: mode.
   * @returns {boolean} - true if flag is set.
   */
  isOwner: function(side) {
    return AccessMode._checkFlag(this, side, AccessMode._OWNER);
  },

  /**
   * Check if Presence (P) flag is set.
   * @memberof Tinode.AccessMode
   * @param {string=} side - which permission to check: given, want, mode; default: mode.
   * @returns {boolean} - true if flag is set.
   */
  isPresencer: function(side) {
    return AccessMode._checkFlag(this, side, AccessMode._PRES);
  },

  /**
   * Check if Presence (P) flag is NOT set.
   * @memberof Tinode.AccessMode
   * @param {string=} side - which permission to check: given, want, mode; default: mode.
   * @returns {boolean} - true if flag is set.
   */
  isMuted: function(side) {
    return !this.isPresencer(side);
  },

  /**
   * Check if Join (J) flag is set.
   * @memberof Tinode.AccessMode
   * @param {string=} side - which permission to check: given, want, mode; default: mode.
   * @returns {boolean} - true if flag is set.
   */
  isJoiner: function(side) {
    return AccessMode._checkFlag(this, side, AccessMode._JOIN);
  },

  /**
   * Check if Reader (R) flag is set.
   * @memberof Tinode.AccessMode
   * @param {string=} side - which permission to check: given, want, mode; default: mode.
   * @returns {boolean} - true if flag is set.
   */
  isReader: function(side) {
    return AccessMode._checkFlag(this, side, AccessMode._READ);
  },

  /**
   * Check if Writer (W) flag is set.
   * @memberof Tinode.AccessMode
   * @param {string=} side - which permission to check: given, want, mode; default: mode.
   * @returns {boolean} - true if flag is set.
   */
  isWriter: function(side) {
    return AccessMode._checkFlag(this, side, AccessMode._WRITE);
  },

  /**
   * Check if Approver (A) flag is set.
   * @memberof Tinode.AccessMode
   * @param {string=} side - which permission to check: given, want, mode; default: mode.
   * @returns {boolean} - true if flag is set.
   */
  isApprover: function(side) {
    return AccessMode._checkFlag(this, side, AccessMode._APPROVE);
  },

  /**
   * Check if either one of Owner (O) or Approver (A) flags is set.
   * @memberof Tinode.AccessMode
   * @param {string=} side - which permission to check: given, want, mode; default: mode.
   * @returns {boolean} - true if flag is set.
   */
  isAdmin: function(side) {
    return this.isOwner(side) || this.isApprover(side);
  },

  /**
   * Check if either one of Owner (O), Approver (A), or Sharer (S) flags is set.
   * @memberof Tinode.AccessMode
   * @param {string=} side - which permission to check: given, want, mode; default: mode.
   * @returns {boolean} - true if flag is set.
   */
  isSharer: function(side) {
    return this.isAdmin(side) || AccessMode._checkFlag(this, side, AccessMode._SHARE);
  },

  /**
   * Check if Deleter (D) flag is set.
   * @memberof Tinode.AccessMode
   * @param {string=} side - which permission to check: given, want, mode; default: mode.
   * @returns {boolean} - true if flag is set.
   */
  isDeleter: function(side) {
    return AccessMode._checkFlag(this, side, AccessMode._DELETE);
  }
};

/**
 * @callback Tinode.Topic.onData
 * @param {Data} data - Data packet
 */
/**
 * Topic is a class representing a logical communication channel.
 * @class Topic
 * @memberof Tinode
 *
 * @param {string} name - Name of the topic to create.
 * @param {Object=} callbacks - Object with various event callbacks.
 * @param {Tinode.Topic.onData} callbacks.onData - Callback which receives a {data} message.
 * @param {callback} callbacks.onMeta - Callback which receives a {meta} message.
 * @param {callback} callbacks.onPres - Callback which receives a {pres} message.
 * @param {callback} callbacks.onInfo - Callback which receives an {info} message.
 * @param {callback} callbacks.onMetaDesc - Callback which receives changes to topic desctioption {@link desc}.
 * @param {callback} callbacks.onMetaSub - Called for a single subscription record change.
 * @param {callback} callbacks.onSubsUpdated - Called after a batch of subscription changes have been recieved and cached.
 * @param {callback} callbacks.onDeleteTopic - Called after the topic is deleted.
 * @param {callback} callbacls.onAllMessagesReceived - Called when all requested {data} messages have been recived.
 */
var Topic = function(name, callbacks) {
  // Parent Tinode object.
  this._tinode = null;

  // Server-provided data, locally immutable.
  // topic name
  this.name = name;
  // timestamp when the topic was created
  this.created = null;
  // timestamp when the topic was last updated
  this.updated = null;
  // timestamp of the last messages
  this.touched = null;
  // access mode, see AccessMode
  this.acs = new AccessMode(null);
  // per-topic private data
  this.private = null;
  // per-topic public data
  this.public = null;

  // Locally cached data
  // Subscribed users, for tracking read/recv/msg notifications.
  this._users = {};

  // Current value of locally issued seqId, used for pending messages.
  this._queuedSeqId = LOCAL_SEQID;

  // The maximum known {data.seq} value.
  this._maxSeq = 0;
  // The minimum known {data.seq} value.
  this._minSeq = 0;
  // Indicator that the last request for earlier messages returned 0.
  this._noEarlierMsgs = false;
  // The maximum known deletion ID.
  this._maxDel = 0;
  // User discovery tags
  this._tags = [];
  // Credentials such as email or phone number.
  this._credentials = [];
  // Message cache, sorted by message seq values, from old to new.
  this._messages = CBuffer(function(a, b) {
    return a.seq - b.seq;
  }, true);
  // Boolean, true if the topic is currently live
  this._subscribed = false;
  // Timestap when topic meta-desc update was recived.
  this._lastDescUpdate = null;
  // Timestap when topic meta-subs update was recived.
  this._lastSubsUpdate = null;
  // Topic created but not yet synced with the server. Used only during initialization.
  this._new = true;

  // Callbacks
  if (callbacks) {
    this.onData = callbacks.onData;
    this.onMeta = callbacks.onMeta;
    this.onPres = callbacks.onPres;
    this.onInfo = callbacks.onInfo;
    // A single desc update;
    this.onMetaDesc = callbacks.onMetaDesc;
    // A single subscription record;
    this.onMetaSub = callbacks.onMetaSub;
    // All subscription records received;
    this.onSubsUpdated = callbacks.onSubsUpdated;
    this.onTagsUpdated = callbacks.onTagsUpdated;
    this.onCredsUpdated = callbacls.onCredsUpdated;
    this.onDeleteTopic = callbacks.onDeleteTopic;
    this.onAllMessagesReceived = callbacks.onAllMessagesReceived;
  }
};

Topic.prototype = {
  /**
   * Check if the topic is subscribed.
   * @memberof Tinode.Topic#
   * @returns {boolean} True is topic is attached/subscribed, false otherwise.
   */
  isSubscribed: function() {
    return this._subscribed;
  },

  /**
   * Request topic to subscribe. Wrapper for {@link Tinode#subscribe}.
   * @memberof Tinode.Topic#
   *
   * @param {Tinode.GetQuery=} getParams - get query parameters.
   * @param {Tinode.SetParams=} setParams - set parameters.
   * @returns {Promise} Promise to be resolved/rejected when the server responds to the request.
   */
  subscribe: function(getParams, setParams) {
    // If the topic is already subscribed, return resolved promise
    if (this._subscribed) {
      return Promise.resolve(this);
    }

    // Send subscribe message, handle async response.
    // If topic name is explicitly provided, use it. If no name, then it's a new group topic,
    // use "new".
    return this._tinode.subscribe(this.name || TOPIC_NEW, getParams, setParams).then((ctrl) => {
      if (ctrl.code >= 300) {
        // Do nothing ff the topic is already subscribed to.
        return ctrl;
      }

      this._subscribed = true;
      this.acs = (ctrl.params && ctrl.params.acs) ? ctrl.params.acs : this.acs;

      // Set topic name for new topics and add it to cache.
      if (this._new) {
        this._new = false;

        // Name may change new123456 -> grpAbCdEf
        this.name = ctrl.topic;

        this.created = ctrl.ts;
        this.updated = ctrl.ts;
        // Don't assign touched, otherwise topic will be put on top of the list on subscribe.

        this._cachePutSelf();

        if (this.name != TOPIC_ME && this.name != TOPIC_FND) {
          // Add the new topic to the list of contacts maintained by the 'me' topic.
          const me = this._tinode.getMeTopic();
          if (me) {
            me._processMetaSub([{
              _noForwarding: true,
              topic: this.name,
              created: ctrl.ts,
              updated: ctrl.ts,
              acs: this.acs
            }]);
          }
        }

        if (setParams && setParams.desc) {
          setParams.desc._noForwarding = true;
          this._processMetaDesc(setParams.desc);
        }
      }

      return ctrl;
    });
  },

  /**
   * Create a draft of a message without sending it to the server.
   * @memberof Tinode.Topic#
   *
   * @param {string | Object} data - Content to wrap in a draft.
   * @param {Boolean=} noEcho - If <tt>true</tt> server will not echo message back to originating
   * session. Otherwise the server will send a copy of the message to sender.
   *
   * @returns {Object} message draft.
   */
  createMessage: function(data, noEcho) {
    return this._tinode.createMessage(this.name, data, noEcho);
  },

  /**
   * Immediately publish data to topic. Wrapper for {@link Tinode#publish}.
   * @memberof Tinode.Topic#
   *
   * @param {string | Object} data - Data to publish, either plain string or a Drafty object.
   * @param {Boolean=} noEcho - If <tt>true</tt> server will not echo message back to originating
   * @returns {Promise} Promise to be resolved/rejected when the server responds to the request.
   */
  publish: function(data, noEcho) {
    return this.publishMessage(this.createMessage(data, noEcho));
  },

  /**
   * Publish message created by {@link Tinode.Topic#createMessage}.
   * @memberof Tinode.Topic#
   *
   * @param {Object} pub - {data} object to publish. Must be created by {@link Tinode.Topic#createMessage}
   *
   * @returns {Promise} Promise to be resolved/rejected when the server responds to the request.
   */
  publishMessage: function(pub) {
    if (!this._subscribed) {
      return Promise.reject(new Error("Cannot publish on inactive topic"));
    }

    // Update header with attachment records.
    if (Drafty.hasAttachments(pub.content) && !pub.head.attachments) {
      let attachments = [];
      Drafty.attachments(pub.content, (data) => {
        attachments.push(data.ref);
      });
      pub.head.attachments = attachments;
    }

    // Send data.
    pub._sending = true;
    pub._failed = false;
    return this._tinode.publishMessage(pub).then((ctrl) => {
      pub._sending = false;
      pub.ts = ctrl.ts;
      this.swapMessageId(pub, ctrl.params.seq);
      this._routeData(pub);
      return ctrl;
    }).catch((err) => {
      this._tinode.logger("WARNING: Message rejected by the server", err);
      pub._sending = false;
      pub._failed = true;
      if (this.onData) {
        this.onData();
      }
    });
  },

  /**
   * Add message to local message cache, send to the server when the promise is resolved.
   * If promise is null or undefined, the message will be sent immediately.
   * The message is sent when the
   * The message should be created by {@link Tinode.Topic#createMessage}.
   * This is probably not the final API.
   * @memberof Tinode.Topic#
   *
   * @param {Object} pub - Message to use as a draft.
   * @param {Promise} prom - Message will be sent when this promise is resolved, discarded if rejected.
   *
   * @returns {Promise} derived promise.
   */
  publishDraft: function(pub, prom) {
    if (!prom && !this._subscribed) {
      return Promise.reject(new Error("Cannot publish on inactive topic"));
    }

    const seq = pub.seq || this._getQueuedSeqId();
    if (!pub._noForwarding) {
      // The 'seq', 'ts', and 'from' are added to mimic {data}. They are removed later
      // before the message is sent.

      pub._noForwarding = true;
      pub.seq = seq;
      pub.ts = new Date();
      pub.from = this._tinode.getCurrentUserID();

      // Don't need an echo message because the message is added to local cache right away.
      pub.noecho = true;
      // Add to cache.
      this._messages.put(pub);

      if (this.onData) {
        this.onData(pub);
      }
    }
    // If promise is provided, send the queued message when it's resolved.
    // If no promise is provided, create a resolved one and send immediately.
    prom = (prom || Promise.resolve()).then(
      ( /* argument ignored */ ) => {
        if (pub._cancelled) {
          return {
            code: 300,
            text: "cancelled"
          };
        }

        return this.publishMessage(pub);
      },
      (err) => {
        this._tinode.logger("WARNING: Message draft rejected by the server", err);
        pub._sending = false;
        pub._failed = true;
        this._messages.delAt(this._messages.find(pub));
        if (this.onData) {
          this.onData();
        }
      });
    return prom;
  },

  /**
   * Leave the topic, optionally unsibscribe. Leaving the topic means the topic will stop
   * receiving updates from the server. Unsubscribing will terminate user's relationship with the topic.
   * Wrapper for {@link Tinode#leave}.
   * @memberof Tinode.Topic#
   *
   * @param {Boolean=} unsub - If true, unsubscribe, otherwise just leave.
   * @returns {Promise} Promise to be resolved/rejected when the server responds to the request.
   */
  leave: function(unsub) {
    // It's possible to unsubscribe (unsub==true) from inactive topic.
    if (!this._subscribed && !unsub) {
      return Promise.reject(new Error("Cannot leave inactive topic"));
    }

    // Send a 'leave' message, handle async response
    return this._tinode.leave(this.name, unsub).then((ctrl) => {
      this._resetSub();
      if (unsub) {
        this._gone();
      }
      return ctrl;
    });
  },

  /**
   * Request topic metadata from the server.
   * @memberof Tinode.Topic#
   *
   * @param {Tinode.GetQuery} request parameters
   *
   * @returns {Promise} Promise to be resolved/rejected when the server responds to request.
   */
  getMeta: function(params) {
    // Send {get} message, return promise.
    return this._tinode.getMeta(this.name, params);
  },

  /**
   * Request more messages from the server
   * @memberof Tinode.Topic#
   *
   * @param {integer} limit number of messages to get.
   * @param {boolean} forward if true, request newer messages.
   */
  getMessagesPage: function(limit, forward) {
    const query = this.startMetaQuery();
    if (forward) {
      query.withLaterData(limit);
    } else {
      query.withEarlierData(limit);
    }
    let promise = this.getMeta(query.build());
    if (!forward) {
      promise = promise.then((ctrl) => {
        if (ctrl && ctrl.params && !ctrl.params.count) {
          this._noEarlierMsgs = true;
        }
      });
    }
    return promise;
  },

  /**
   * Update topic metadata.
   * @memberof Tinode.Topic#
   *
   * @param {Tinode.SetParams} params parameters to update.
   * @returns {Promise} Promise to be resolved/rejected when the server responds to request.
   */
  setMeta: function(params) {
    if (params.tags) {
      params.tags = normalizeArray(params.tags);
    }
    // Send Set message, handle async response.
    return this._tinode.setMeta(this.name, params)
      .then((ctrl) => {
        if (ctrl && ctrl.code >= 300) {
          // Not modified
          return ctrl;
        }

        if (params.sub) {
          if (ctrl.params && ctrl.params.acs) {
            params.sub.acs = ctrl.params.acs;
            params.sub.updated = ctrl.ts;
          }

          if (!params.sub.user) {
            // This is a subscription update of the current user.
            // Assign user ID otherwise the update will be ignored by _processMetaSub.
            params.sub.user = this._tinode.getCurrentUserID();
            if (!params.desc) {
              // Force update to topic's asc.
              params.desc = {};
            }
          }
          params.sub._noForwarding = true;
          this._processMetaSub([params.sub]);
        }

        if (params.desc) {
          if (ctrl.params && ctrl.params.acs) {
            params.desc.acs = ctrl.params.acs;
            params.desc.updated = ctrl.ts;
          }
          this._processMetaDesc(params.desc);
        }

        if (params.tags) {
          this._processMetaTags(params.tags);
        }
        if (params.cred) {
          this._processMetaCreds([params.cred], true);
        }

        return ctrl;
      });
  },

  /**
   * Update access mode of the current user or of another topic subsriber.
   * @memberof Tinode.Topic#
   *
   * @param {string} uid - UID of the user to update or null to update current user.
   * @param {string} update - the update value, full or delta.
   * @returns {Promise} Promise to be resolved/rejected when the server responds to request.
   */
  updateMode: function(uid, update) {
    const user = uid ? user = this.subscriber(uid) : null;
    let am;
    if (user) {
      am = user.acs.updateGiven(update).getGiven();
    } else {
      am = topic.getAccessMode().updateWant(update).getWant();
    }

    return topic.setMeta({
      sub: {
        user: uid,
        mode: am
      }
    });
  },

  /**
   * Create new topic subscription. Wrapper for {@link Tinode#setMeta}.
   * @memberof Tinode.Topic#
   *
   * @param {String} uid - ID of the user to invite
   * @param {String=} mode - Access mode. <tt>null</tt> means to use default.
   *
   * @returns {Promise} Promise to be resolved/rejected when the server responds to request.
   */
  invite: function(uid, mode) {
    return this.setMeta({
      sub: {
        user: uid,
        mode: mode
      }
    });
  },

  /**
   * Archive or un-archive the topic. Wrapper for {@link Tinode#setMeta}.
   * @memberof Tinode.Topic#
   *
   * @param {Boolean} arch - true to archive the topic, false otherwise.
   *
   * @returns {Promise} Promise to be resolved/rejected when the server responds to request.
   */
  archive: function(arch) {
    if (this.private && this.private.arch == arch) {
      return Promise.resolve(arch);
    }
    return this.setMeta({
      desc: {
        private: {
          arch: arch ? true : Tinode.DEL_CHAR
        }
      }
    });
  },

  /**
   * Delete messages. Hard-deleting messages requires Owner permission.
   * Wrapper for {@link Tinode#delMessages}.
   * @memberof Tinode.Topic#
   *
   * @param {Tinode.DelRange[]} ranges - Ranges of message IDs to delete.
   * @param {Boolean=} hard - Hard or soft delete
   * @returns {Promise} Promise to be resolved/rejected when the server responds to request.
   */
  delMessages: function(ranges, hard) {
    if (!this._subscribed) {
      return Promise.reject(new Error("Cannot delete messages in inactive topic"));
    }

    // Sort ranges in accending order by low, the descending by hi.
    ranges.sort((r1, r2) => {
      if (r1.low < r2.low) {
        return true;
      }
      if (r1.low == r2.low) {
        return !r2.hi || (r1.hi >= r2.hi);
      }
      return false;
    });

    // Remove pending messages from ranges possibly clipping some ranges.
    let tosend = ranges.reduce((out, r) => {
      if (r.low < LOCAL_SEQID) {
        if (!r.hi || r.hi < LOCAL_SEQID) {
          out.push(r);
        } else {
          // Clip hi to max allowed value.
          out.push({
            low: r.low,
            hi: this._maxSeq + 1
          });
        }
      }
      return out;
    }, []);

    // Send {del} message, return promise
    let result;
    if (tosend.length > 0) {
      result = this._tinode.delMessages(this.name, tosend, hard);
    } else {
      result = Promise.resolve({
        params: {
          del: 0
        }
      });
    }
    // Update local cache.
    return result.then((ctrl) => {
      if (ctrl.params.del > this._maxDel) {
        this._maxDel = ctrl.params.del;
      }

      ranges.map((r) => {
        if (r.hi) {
          this.flushMessageRange(r.low, r.hi);
        } else {
          this.flushMessage(r.low);
        }
      });

      this._updateDeletedRanges();

      if (this.onData) {
        // Calling with no parameters to indicate the messages were deleted.
        this.onData();
      }
      return ctrl;
    });
  },

  /**
   * Delete all messages. Hard-deleting messages requires Owner permission.
   * @memberof Tinode.Topic#
   *
   * @param {boolean} hardDel - true if messages should be hard-deleted.
   *
   * @returns {Promise} Promise to be resolved/rejected when the server responds to request.
   */
  delMessagesAll: function(hardDel) {
    if (!this._maxSeq || this._maxSeq <= 0) {
      // There are no messages to delete.
      return Promise.resolve();
    }
    return this.delMessages([{
      low: 1,
      hi: this._maxSeq + 1,
      _all: true
    }], hardDel);
  },

  /**
   * Delete multiple messages defined by their IDs. Hard-deleting messages requires Owner permission.
   * @memberof Tinode.Topic#
   *
   * @param {Tinode.DelRange[]} list - list of seq IDs to delete
   * @param {Boolean=} hardDel - true if messages should be hard-deleted.
   *
   * @returns {Promise} Promise to be resolved/rejected when the server responds to request.
   */
  delMessagesList: function(list, hardDel) {
    // Sort the list in ascending order
    list.sort((a, b) => a - b);
    // Convert the array of IDs to ranges.
    let ranges = list.reduce((out, id) => {
      if (out.length == 0) {
        // First element.
        out.push({
          low: id
        });
      } else {
        let prev = out[out.length - 1];
        if ((!prev.hi && (id != prev.low + 1)) || (id > prev.hi)) {
          // New range.
          out.push({
            low: id
          });
        } else {
          // Expand existing range.
          prev.hi = prev.hi ? Math.max(prev.hi, id + 1) : id + 1;
        }
      }
      return out;
    }, []);
    // Send {del} message, return promise
    return this.delMessages(ranges, hardDel)
  },

  /**
   * Delete topic. Requires Owner permission. Wrapper for {@link Tinode#delTopic}.
   * @memberof Tinode.Topic#
   *
   * @returns {Promise} Promise to be resolved/rejected when the server responds to the request.
   */
  delTopic: function() {
    const topic = this;
    return this._tinode.delTopic(this.name).then(function(ctrl) {
      topic._resetSub();
      topic._gone();
      return ctrl;
    });
  },

  /**
   * Delete subscription. Requires Share permission. Wrapper for {@link Tinode#delSubscription}.
   * @memberof Tinode.Topic#
   *
   * @param {String} user - ID of the user to remove subscription for.
   * @returns {Promise} Promise to be resolved/rejected when the server responds to request.
   */
  delSubscription: function(user) {
    if (!this._subscribed) {
      return Promise.reject(new Error("Cannot delete subscription in inactive topic"));
    }
    // Send {del} message, return promise
    return this._tinode.delSubscription(this.name, user).then((ctrl) => {
      // Remove the object from the subscription cache;
      delete this._users[user];
      // Notify listeners
      if (this.onSubsUpdated) {
        this.onSubsUpdated(Object.keys(this._users));
      }
      return ctrl;
    });
  },

  /**
   * Send a read/recv notification
   * @memberof Tinode.Topic#
   *
   * @param {String} what - what notification to send: <tt>recv</tt>, <tt>read</tt>.
   * @param {Number} seq - ID or the message read or received.
   */
  note: function(what, seq) {
    const user = this._users[this._tinode.getCurrentUserID()];
    if (user) {
      if (!user[what] || user[what] < seq) {
        if (this._subscribed) {
          this._tinode.note(this.name, what, seq);
        } else {
          this._tinode.logger("INFO: Not sending {note} on inactive topic");
        }

        user[what] = seq;
      }
    } else {
      this._tinode.logger("ERROR: note(): user not found " + this._tinode.getCurrentUserID());
    }

    // Update locally cached contact with the new count
    const me = this._tinode.getMeTopic();
    if (me) {
      me.setMsgReadRecv(this.name, what, seq);
    }
  },

  /**
   * Send a 'recv' receipt. Wrapper for {@link Tinode#noteRecv}.
   * @memberof Tinode.Topic#
   *
   * @param {Number} seq - ID of the message to aknowledge.
   */
  noteRecv: function(seq) {
    this.note('recv', seq);
  },

  /**
   * Send a 'read' receipt. Wrapper for {@link Tinode#noteRead}.
   * @memberof Tinode.Topic#
   *
   * @param {Number} seq - ID of the message to aknowledge.
   */
  noteRead: function(seq) {
    this.note('read', seq);
  },

  /**
   * Send a key-press notification. Wrapper for {@link Tinode#noteKeyPress}.
   * @memberof Tinode.Topic#
   */
  noteKeyPress: function() {
    if (this._subscribed) {
      this._tinode.noteKeyPress(this.name);
    } else {
      this._tinode.logger("INFO: Cannot send notification in inactive topic");
    }
  },

  /**
   * Get user description from global cache. The user does not need to be a
   * subscriber of this topic.
   * @memberof Tinode.Topic#
   *
   * @param {String} uid - ID of the user to fetch.
   * @return {Object} user description or undefined.
   */
  userDesc: function(uid) {
    // TODO(gene): handle asynchronous requests

    const user = this._cacheGetUser(uid);
    if (user) {
      return user; // Promise.resolve(user)
    }
  },

  /**
   * Get description of the p2p peer from subscription cache.
   * @memberof Tinode.Topic#
   *
   * @return {Object} peer's description or undefined.
   */
  p2pPeerDesc: function() {
    if (this.getType() != 'p2p') {
      return undefined;
    }
    return this._users[this.name];
  },

  /**
   * Iterate over cached subscribers. If callback is undefined, use this.onMetaSub.
   * @memberof Tinode.Topic#
   *
   * @param {Function} callback - Callback which will receive subscribers one by one.
   * @param {Object=} context - Value of `this` inside the `callback`.
   */
  subscribers: function(callback, context) {
    const cb = (callback || this.onMetaSub);
    if (cb) {
      for (let idx in this._users) {
        cb.call(context, this._users[idx], idx, this._users);
      }
    }
  },

  /**
   * Get a copy of cached tags.
   * @memberof Tinode.Topic#
   * @return a copy of tags
   */
  tags: function() {
    // Return a copy.
    return this._tags.slice(0);
  },

  /**
   * Get cached subscription for the given user ID.
   * @memberof Tinode.Topic#
   *
   * @param {String} uid - id of the user to query for
   * @return user description or undefined.
   */
  subscriber: function(uid) {
    return this._users[uid];
  },

  /**
   * Iterate over cached messages. If callback is undefined, use this.onData.
   * @memberof Tinode.Topic#
   *
   * @param {function} callback - Callback which will receive messages one by one. See {@link Tinode.CBuffer#forEach}
   * @param {integer} sinceId - Optional seqId to start iterating from (inclusive).
   * @param {integer} beforeId - Optional seqId to stop iterating before (exclusive).
   * @param {Object} context - Value of `this` inside the `callback`.
   */
  messages: function(callback, sinceId, beforeId, context) {
    const cb = (callback || this.onData);
    if (cb) {
      let startIdx = typeof sinceId == 'number' ? this._messages.find({
        seq: sinceId
      }, true) : undefined;
      let beforeIdx = typeof beforeId == 'number' ? this._messages.find({
        seq: beforeId
      }, true) : undefined;
      if (startIdx != -1 && beforeIdx != -1) {
        this._messages.forEach(cb, startIdx, beforeIdx, context);
      }
    }
  },

  /**
   * Iterate over cached unsent messages. Wraps {@link Tinode.Topic#messages}.
   * @memberof Tinode.Topic#
   *
   * @param {function} callback - Callback which will receive messages one by one. See {@link Tinode.CBuffer#forEach}
   * @param {Object} context - Value of `this` inside the `callback`.
   */
  queuedMessages: function(callback, context) {
    if (!callback) {
      throw new Error("Callback must be provided");
    }
    this.messages(callback, LOCAL_SEQID, undefined, context);
  },

  /**
   * Get the number of topic subscribers who marked this message as either recv or read
   * Current user is excluded from the count.
   * @memberof Tinode.Topic#
   *
   * @param {String} what - what notification to send: <tt>recv</tt>, <tt>read</tt>.
   * @param {Number} seq - ID or the message read or received.
   */
  msgReceiptCount: function(what, seq) {
    let count = 0;
    if (seq > 0) {
      const me = this._tinode.getCurrentUserID();
      for (let idx in this._users) {
        const user = this._users[idx];
        if (user.user !== me && user[what] >= seq) {
          count++;
        }
      }
    }
    return count;
  },

  /**
   * Get the number of topic subscribers who marked this message (and all older messages) as read.
   * The current user is excluded from the count.
   * @memberof Tinode.Topic#
   *
   * @param {Number} seq - Message id to check.
   * @returns {Number} Number of subscribers who claim to have received the message.
   */
  msgReadCount: function(seq) {
    return this.msgReceiptCount('read', seq);
  },

  /**
   * Get the number of topic subscribers who marked this message (and all older messages) as received.
   * The current user is excluded from the count.
   * @memberof Tinode.Topic#
   *
   * @param {number} seq - Message id to check.
   * @returns {number} Number of subscribers who claim to have received the message.
   */
  msgRecvCount: function(seq) {
    return this.msgReceiptCount('recv', seq);
  },

  /**
   * Check if cached message IDs indicate that the server may have more messages.
   * @memberof Tinode.Topic#
   *
   * @param {boolean} newer check for newer messages
   */
  msgHasMoreMessages: function(newer) {
    return newer ? this.seq > this._maxSeq :
      // _minSeq cound be more than 1, but earlier messages could have been deleted.
      (this._minSeq > 1 && !this._noEarlierMsgs);
  },

  /**
   * Check if the given seq Id is id of the most recent message.
   * @memberof Tinode.Topic#
   *
   * @param {integer} seqId id of the message to check
   */
  isNewMessage: function(seqId) {
    return this._maxSeq <= seqId;
  },

  /**
   * Remove one message from local cache.
   * @memberof Tinode.Topic#
   *
   * @param {integer} seqId id of the message to remove from cache.
   * @returns {Message} removed message or undefined if such message was not found.
   */
  flushMessage: function(seqId) {
    const idx = this._messages.find({
      seq: seqId
    });
    return idx >= 0 ? this._messages.delAt(idx) : undefined;
  },

  /**
   * Update message's seqId.
   * @memberof Tinode.Topic#
   *
   * @param {Object} pub message object.
   * @param {integer} newSeqId new seq id for pub.
   */
  swapMessageId: function(pub, newSeqId) {
    const idx = this._messages.find({
      seq: pub.seq
    });
    const numMessages = this._messages.length();
    pub.seq = newSeqId;
    if (0 <= idx && idx < numMessages) {
      // this._messages are sorted by `seq`.
      // If changing pub.seq to newSeqId breaks the invariant, fix it.
      if ((idx > 0 && this._messages.getAt(idx - 1).seq >= newSeqId) ||
        (idx + 1 < numMessages && newSeqId < this._messages.getAt(idx + 1).seq <= newSeqId)) {
        this._messages.delAt(idx);
        this._messages.put(pub);
      }
    }
  },

  /**
   * Remove a range of messages from the local cache.
   * @memberof Tinode.Topic#
   *
   * @param {integer} fromId seq ID of the first message to remove (inclusive).
   * @param {integer} untilId seqID of the last message to remove (exclusive).
   *
   * @returns {Message[]} array of removed messages (could be empty).
   */
  flushMessageRange: function(fromId, untilId) {
    // start, end: find insertion points (nearest == true).
    const since = this._messages.find({
      seq: fromId
    }, true);
    return since >= 0 ? this._messages.delRange(since, this._messages.find({
      seq: untilId
    }, true)) : [];
  },

  /**
   * Attempt to stop message from being sent.
   * @memberof Tinode.Topic#
   *
   * @param {integer} seqId id of the message to stop sending and remove from cache.
   *
   * @returns {boolean} true if message was cancelled, false otherwise.
   */
  cancelSend: function(seqId) {
    const idx = this._messages.find({
      seq: seqId
    });
    if (idx >= 0) {
      const msg = this._messages.getAt(idx);
      const status = this.msgStatus(msg);
      if (status == MESSAGE_STATUS_QUEUED || status == MESSAGE_STATUS_FAILED) {
        msg._cancelled = true;
        this._messages.delAt(idx);
        if (this.onData) {
          // Calling with no parameters to indicate the message was deleted.
          this.onData();
        }
        return true;
      }
    }
    return false;
  },

  /**
   * Get type of the topic: me, p2p, grp, fnd...
   * @memberof Tinode.Topic#
   *
   * @returns {String} One of 'me', 'p2p', 'grp', 'fnd' or <tt>undefined</tt>.
   */
  getType: function() {
    return Tinode.topicType(this.name);
  },

  /**
   * Get user's cumulative access mode of the topic.
   * @memberof Tinode.Topic#
   *
   * @returns {Tinode.AccessMode} - user's access mode
   */
  getAccessMode: function() {
    return this.acs;
  },

  /**
   * Get topic's default access mode.
   * @memberof Tinode.Topic#
   *
   * @returns {Tinode.DefAcs} - access mode, such as {auth: `RWP`, anon: `N`}.
   */
  getDefaultAccess: function() {
    return this.defacs;
  },

  /**
   * Initialize new meta {@link Tinode.GetQuery} builder. The query is attched to the current topic.
   * It will not work correctly if used with a different topic.
   * @memberof Tinode.Topic#
   *
   * @returns {Tinode.MetaGetBuilder} query attached to the current topic.
   */
  startMetaQuery: function() {
    return new MetaGetBuilder(this);
  },

  /**
   * Check if topic is archived, i.e. private.arch == true.
   * @memberof Tinode.Topic#
   *
   * @returns {boolean} - true if topic is archived, false otherwise.
   */
  isArchived: function() {
    return this.private && this.private.arch ? true : false;
  },

  /**
   * Get status (queued, sent, received etc) of a given message in the context
   * of this topic.
   * @memberof Tinode.Topic#
   *
   * @param {Message} msg message to check for status.
   * @returns message status constant.
   */
  msgStatus: function(msg) {
    let status = MESSAGE_STATUS_NONE;
    if (this._tinode.isMe(msg.from)) {
      if (msg._sending) {
        status = MESSAGE_STATUS_SENDING;
      } else if (msg._failed) {
        status = MESSAGE_STATUS_FAILED;
      } else if (msg.seq >= LOCAL_SEQID) {
        status = MESSAGE_STATUS_QUEUED;
      } else if (this.msgReadCount(msg.seq) > 0) {
        status = MESSAGE_STATUS_READ;
      } else if (this.msgRecvCount(msg.seq) > 0) {
        status = MESSAGE_STATUS_RECEIVED;
      } else if (msg.seq > 0) {
        status = MESSAGE_STATUS_SENT;
      }
    } else {
      status = MESSAGE_STATUS_TO_ME;
    }
    return status;
  },

  // Process data message
  _routeData: function(data) {
    if (data.content) {
      if (!this.touched || this.touched < data.ts) {
        this.touched = data.ts;
      }
    }

    if (!data._noForwarding) {
      this._messages.put(data);
      this._updateDeletedRanges();
    }

    if (data.seq > this._maxSeq) {
      this._maxSeq = data.seq;
    }
    if (data.seq < this._minSeq || this._minSeq == 0) {
      this._minSeq = data.seq;
    }

    if (this.onData) {
      this.onData(data);
    }

    // Update locally cached contact with the new message count.
    const me = this._tinode.getMeTopic();
    if (me) {
      // Messages from the current user are considered to be read already.
      me.setMsgReadRecv(this.name,
        (!data.from || this._tinode.isMe(data.from)) ? 'read' : 'msg',
        data.seq, data.ts);
    }
  },

  // Process metadata message
  _routeMeta: function(meta) {
    if (meta.desc) {
      this._lastDescUpdate = meta.ts;
      this._processMetaDesc(meta.desc);
    }
    if (meta.sub && meta.sub.length > 0) {
      this._lastSubsUpdate = meta.ts;
      this._processMetaSub(meta.sub);
    }
    if (meta.del) {
      this._processDelMessages(meta.del.clear, meta.del.delseq);
    }
    if (meta.tags) {
      this._processMetaTags(meta.tags);
    }
    if (meta.cred) {
      this._processMetaCreds(meta.cred);
    }
    if (this.onMeta) {
      this.onMeta(meta);
    }
  },

  // Process presence change message
  _routePres: function(pres) {
    let user;
    switch (pres.what) {
      case 'del':
        // Delete cached messages.
        this._processDelMessages(pres.clear, pres.delseq);
        break;
      case 'on':
      case 'off':
        // Update online status of a subscription.
        user = this._users[pres.src];
        if (user) {
          user.online = pres.what == 'on';
        } else {
          this._tinode.logger("WARNING: Presence update for an unknown user", this.name, pres.src);
        }
        break;
      case 'term':
        // Attachment to topic is terminated probably due to cluster rehashing.
        this._resetSub();
        break;
      case 'acs':
        user = this._users[pres.src];
        if (!user) {
          // Update for an unknown user: notification of a new subscription.
          const acs = new AccessMode().updateAll(pres.dacs);
          if (acs && acs.mode != AccessMode._NONE) {
            user = this._cacheGetUser(pres.src);
            if (!user) {
              user = {
                user: pres.src,
                acs: acs
              };
              this.getMeta(this.startMetaQuery().withOneSub(undefined, pres.src).build());
            } else {
              user.acs = acs;
            }
            user.updated = new Date();
            this._processMetaSub([user]);
          }
        } else {
          // Known user
          user.acs.updateAll(pres.dacs);
          // Update user's access mode.
          this._processMetaSub([{
            user: pres.src,
            updated: new Date(),
            acs: user.acs
          }]);
        }
        break;
      default:
        this._tinode.logger("INFO: Ignored presence update", pres.what);
    }

    if (this.onPres) {
      this.onPres(pres);
    }
  },

  // Process {info} message
  _routeInfo: function(info) {
    if (info.what !== 'kp') {
      const user = this._users[info.from];
      if (user) {
        user[info.what] = info.seq;
        if (user.recv < user.read) {
          user.recv = user.read;
        }
      }

      // If this is an update from the current user, update the contact with the new count too.
      if (this._tinode.isMe(info.from)) {
        const me = this._tinode.getMeTopic();
        if (me) {
          me.setMsgReadRecv(info.topic, info.what, info.seq);
        }
      }
    }
    if (this.onInfo) {
      this.onInfo(info);
    }
  },

  // Called by Tinode when meta.desc packet is received.
  // Called by 'me' topic on contact update (desc._noForwarding is true).
  _processMetaDesc: function(desc) {
    // Synthetic desc may include defacs for p2p topics which is useless.
    // Remove it.
    if (this.getType() == 'p2p') {
      delete desc.defacs;
    }

    // Copy parameters from desc object to this topic.
    mergeObj(this, desc);

    if (typeof this.created == 'string') {
      this.created = new Date(this.created);
    }
    if (typeof this.updated == 'string') {
      this.updated = new Date(this.updated);
    }
    if (typeof this.touched == 'string') {
      this.touched = new Date(this.touched);
    }

    // Update relevant contact in the me topic, if available:
    if (this.name !== 'me' && !desc._noForwarding) {
      const me = this._tinode.getMeTopic();
      if (me) {
        // Must use original 'desc' instead of 'this' so not to lose DEL_CHAR.
        me._processMetaSub([{
          _noForwarding: true,
          topic: this.name,
          updated: this.updated,
          touched: this.touched,
          acs: desc.acs,
          seq: desc.seq,
          read: desc.read,
          recv: desc.recv,
          public: desc.public,
          private: desc.private
        }]);
      }
    }

    if (this.onMetaDesc) {
      this.onMetaDesc(this);
    }
  },

  // Called by Tinode when meta.sub is recived or in response to received
  // {ctrl} after setMeta-sub.
  _processMetaSub: function(subs) {
    for (let idx in subs) {
      const sub = subs[idx];

      sub.updated = new Date(sub.updated);
      sub.deleted = sub.deleted ? new Date(sub.deleted) : null;

      let user = null;
      if (!sub.deleted) {
        // If this is a change to user's own permissions, update them in topic too.
        // Desc will update 'me' topic.
        if (this._tinode.isMe(sub.user) && sub.acs) {
          this._processMetaDesc({
            updated: sub.updated || new Date(),
            touched: sub.updated,
            acs: sub.acs
          });
        }
        user = this._updateCachedUser(sub.user, sub);
      } else {
        // Subscription is deleted, remove it from topic (but leave in Users cache)
        delete this._users[sub.user];
        user = sub;
      }

      if (this.onMetaSub) {
        this.onMetaSub(user);
      }
    }

    if (this.onSubsUpdated) {
      this.onSubsUpdated(Object.keys(this._users));
    }
  },

  // Called by Tinode when meta.tags is recived.
  _processMetaTags: function(tags) {
    if (tags.length == 1 && tags[0] == Tinode.DEL_CHAR) {
      tags = [];
    }
    this._tags = tags;
    if (this.onTagsUpdated) {
      this.onTagsUpdated(tags);
    }
  },

  // Do nothing for topics other than 'me'
  _processMetaCreds: function(creds) {},

  // Delete cached messages and update cached transaction IDs
  _processDelMessages: function(clear, delseq) {
    this._maxDel = Math.max(clear, this._maxDel);
    this.clear = Math.max(clear, this.clear);
    const topic = this;
    let count = 0;
    if (Array.isArray(delseq)) {
      delseq.map(function(range) {
        if (!range.hi) {
          count++;
          topic.flushMessage(range.low);
        } else {
          for (let i = range.low; i < range.hi; i++) {
            count++;
            topic.flushMessage(i);
          }
        }
      });
    }

    if (count > 0) {
      this._updateDeletedRanges();

      if (this.onData) {
        this.onData();
      }
    }
  },

  // Topic is informed that the entire response to {get what=data} has been received.
  _allMessagesReceived: function(count) {
    this._updateDeletedRanges();

    if (this.onAllMessagesReceived) {
      this.onAllMessagesReceived(count);
    }
  },

  // Reset subscribed state
  _resetSub: function() {
    this._subscribed = false;
  },

  // This topic is either deleted or unsubscribed from.
  _gone: function() {
    this._messages.reset();
    this._users = {};
    this.acs = new AccessMode(null);
    this.private = null;
    this.public = null;
    this._maxSeq = 0;
    this._minSeq = 0;
    this._subscribed = false;

    const me = this._tinode.getMeTopic();
    if (me) {
      me._routePres({
        _noForwarding: true,
        what: 'gone',
        topic: 'me',
        src: this.name
      });
    }
    if (this.onDeleteTopic) {
      this.onDeleteTopic();
    }
  },

  // Update global user cache and local subscribers cache.
  // Don't call this method for non-subscribers.
  _updateCachedUser: function(uid, obj) {
    // Fetch user object from the global cache.
    // This is a clone of the stored object
    let cached = this._cacheGetUser(uid);
    cached = mergeObj(cached || {}, obj);
    // Save to global cache
    this._cachePutUser(uid, cached);
    // Save to the list of topic subsribers.
    return mergeToCache(this._users, uid, cached);
  },

  // Get local seqId for a queued message.
  _getQueuedSeqId: function() {
    return this._queuedSeqId++;
  },

  // Calculate ranges of missing messages.
  _updateDeletedRanges: function() {
    const ranges = [];

    let prev = null;
    // Check for gap in the beginning, before the first message.
    const first = this._messages.getAt(0);
    if (first && this._minSeq > 1 && !this._noEarlierMsgs) {
      // Some messages are missing in the beginning.
      if (first.hi) {
        // The first message already represents a gap.
        if (first.seq > 1) {
          first.seq = 1;
        }
        if (first.hi < this._minSeq - 1) {
          first.hi = this._minSeq - 1;
        }
        prev = first;
      } else {
        // Create new gap.
        prev = {
          seq: 1,
          hi: this._minSeq - 1
        };
        ranges.push(prev);
      }
    } else {
      // No gap in the beginning.
      prev = {
        seq: 0,
        hi: 0
      };
    }

    // Find gaps in the list of received messages. The list contains messages-proper as well
    // as placeholers for deleted ranges.
    // The messages are iterated by seq ID in ascending order.
    this._messages.forEach((data) => {
      // Do not create a gap between the last sent message and the first unsent.
      if (data.seq >= LOCAL_SEQID) {
        return;
      }
      // New message is reducing the existing gap

      if (data.seq == (prev.hi || prev.seq) + 1) {
        // No new gap. Replace previous with current.
        prev = data;
        return;
      }

      // Found a new gap.

      if (prev.hi) {
        // Previous is also a gap, extend it.
        prev.hi = data.hi || data.seq;
        return;
      }

      // Previous is not a gap. Create a new gap.
      prev = {
        seq: (prev.hi || prev.seq) + 1,
        hi: data.hi || data.seq
      };
      ranges.push(prev);
    });

    // Check for missing messages at the end. All messages could be missing.
    const last = this._messages.getLast();
    const maxSeq = Math.max(this.seq, this._maxSeq);
    if (!last || (last && (last.hi || last.seq) < maxSeq)) {
      if (last && last.hi) {
        // Extend existing gap
        last.hi = maxSeq;
      } else {
        // Create new gap.
        ranges.push({
          seq: last ? last.seq + 1 : 1,
          hi: maxSeq
        });
      }
    }

    // Insert new gaps into cache.
    ranges.map((gap) => {
      this._messages.put(gap);
    });
  }
};

/**
 * @class TopicMe - special case of {@link Tinode.Topic} for
 * managing data of the current user, including contact list.
 * @extends Tinode.Topic
 * @memberof Tinode
 *
 * @param {TopicMe.Callbacks} callbacks - Callbacks to receive various events.
 */
var TopicMe = function(callbacks) {
  Topic.call(this, TOPIC_ME, callbacks);
  // List of contacts (topic_name -> Contact object)
  this._contacts = {};

  // me-specific callbacks
  if (callbacks) {
    this.onContactUpdate = callbacks.onContactUpdate;
  }
};

// Inherit everyting from the generic Topic
TopicMe.prototype = Object.create(Topic.prototype, {
  // Override the original Topic._processMetaSub
  _processMetaSub: {
    value: function(subs) {
      let updateCount = 0;
      for (let idx in subs) {
        const sub = subs[idx];
        const topicName = sub.topic;

        // Don't show 'me' and 'fnd' topics in the list of contacts.
        if (topicName == TOPIC_FND || topicName == TOPIC_ME) {
          continue;
        }
        sub.updated = new Date(sub.updated);
        sub.touched = sub.touched ? new Date(sub.touched) : undefined;
        sub.deleted = sub.deleted ? new Date(sub.deleted) : null;

        let cont = null;
        if (sub.deleted) {
          cont = sub;
          delete this._contacts[topicName];
        } else if (sub.acs && !sub.acs.isJoiner()) {
          cont = sub;
          cont.deleted = new Date();
          delete this._contacts[topicName];
        } else {
          // Ensure the values are defined and are integers.
          if (typeof sub.seq != 'undefined') {
            sub.seq = sub.seq | 0;
            sub.recv = sub.recv | 0;
            sub.read = sub.read | 0;
            sub.unread = sub.seq - sub.read;
          }

          if (sub.seen && sub.seen.when) {
            sub.seen.when = new Date(sub.seen.when);
          }
          cont = mergeToCache(this._contacts, topicName, sub);

          if (Tinode.topicType(topicName) == 'p2p') {
            this._cachePutUser(topicName, cont);
          }
          // Notify topic of the update if it's an external update.
          if (!sub._noForwarding) {
            const topic = this._tinode.getTopic(topicName);
            if (topic) {
              sub._noForwarding = true;
              topic._processMetaDesc(sub);
            }
          }
        }

        updateCount++;

        if (this.onMetaSub) {
          this.onMetaSub(cont);
        }
      }

      if (this.onSubsUpdated) {
        this.onSubsUpdated(Object.keys(this._contacts), updateCount);
      }
    },
    enumerable: true,
    configurable: true,
    writable: false
  },

  // Called by Tinode when meta.sub is recived.
  _processMetaCreds: {
    value: function(creds, upd) {
      if (creds.length == 1 && creds[0] == Tinode.DEL_CHAR) {
        creds = [];
      }
      if (upd) {
        creds.map((cr) => {
          if (cr.val) {
            // Adding a credential.
            let idx = this._credentials.findIndex((el) => {
              return el.meth == cr.meth && el.val == cr.val;
            });
            if (idx < 0) {
              // Not found.
              if (!cr.done) {
                // Unconfirmed credential replaces previous unconfirmed credential of the same method.
                idx = this._credentials.findIndex((el) => {
                  return el.meth == cr.meth && !el.done;
                });
                if (idx >= 0) {
                  // Remove previous unconfirmed credential.
                  this._credentials.splice(idx, 1);
                }
              }
              this._credentials.push(cr);
            } else {
              // Found. Maybe change 'done' status.
              this._credentials[idx].done = cr.done;
            }
          } else if (cr.resp) {
            // Handle credential confirmation.
            const idx = this._credentials.findIndex((el) => {
              return el.meth == cr.meth && !el.done;
            });
            if (idx >= 0) {
              this._credentials[idx].done = true;
            }
          }
        });
      } else {
        this._credentials = creds;
      }
      if (this.onCredsUpdated) {
        this.onCredsUpdated(this._credentials);
      }
    },
    enumerable: true,
    configurable: true,
    writable: false
  },

  // Process presence change message
  _routePres: {
    value: function(pres) {
      if (pres.what == 'term') {
        // The 'me' topic itself is detached. Mark as unsubscribed.
        this._resetSub();
        return;
      }

      if (pres.what == 'upd' && pres.src == TOPIC_ME) {
        // Update to me's description. Request updated value.
        this.getMeta(this.startMetaQuery().withDesc().build());
        return;
      }

      const cont = this._contacts[pres.src];
      if (cont) {
        switch (pres.what) {
          case 'on': // topic came online
            cont.online = true;
            break;
          case 'off': // topic went offline
            if (cont.online) {
              cont.online = false;
              if (cont.seen) {
                cont.seen.when = new Date();
              } else {
                cont.seen = {
                  when: new Date()
                };
              }
            }
            break;
          case 'msg': // new message received
            cont.touched = new Date();
            cont.seq = pres.seq | 0;
            // Check if message is sent by the current user. If so it's been read already.
            if (!pres.act || this._tinode.isMe(pres.act)) {
              cont.read = cont.read ? Math.max(cont.read, cont.seq) : cont.seq;
              cont.recv = cont.recv ? Math.max(cont.read, cont.recv) : cont.recv;
            }
            cont.unread = cont.seq - cont.read;
            break;
          case 'upd': // desc updated
            // Request updated subscription.
            this.getMeta(this.startMetaQuery().withLaterOneSub(pres.src).build());
            break;
          case 'acs': // access mode changed
            if (cont.acs) {
              cont.acs.updateAll(pres.dacs);
            } else {
              cont.acs = new AccessMode().updateAll(pres.dacs);
            }
            cont.touched = new Date();
            break;
          case 'ua': // user agent changed
            cont.seen = {
              when: new Date(),
              ua: pres.ua
            };
            break;
          case 'recv': // user's other session marked some messges as received
            pres.seq = pres.seq | 0;
            cont.recv = cont.recv ? Math.max(cont.recv, pres.seq) : pres.seq;
            break;
          case 'read': // user's other session marked some messages as read
            pres.seq = pres.seq | 0;
            cont.read = cont.read ? Math.max(cont.read, pres.seq) : pres.seq;
            cont.recv = cont.recv ? Math.max(cont.read, cont.recv) : cont.recv;
            cont.unread = cont.seq - cont.read;
            break;
          case 'gone': // topic deleted or unsubscribed from
            delete this._contacts[pres.src];
            break;
          case 'del':
            // Update topic.del value.
            break;
          default:
            this._tinode.logger("INFO: Unsupported presence update in 'me'", pres.what);
        }

        if (this.onContactUpdate) {
          this.onContactUpdate(pres.what, cont);
        }
      } else {
        if (pres.what == 'acs') {
          // New subscriptions and deleted/banned subscriptions have full
          // access mode (no + or - in the dacs string). Changes to known subscriptions are sent as
          // deltas, but they should not happen here.
          const acs = new AccessMode(pres.dacs);
          if (!acs || acs.mode == AccessMode._INVALID) {
            this._tinode.logger("ERROR: Invalid access mode update", pres.src, pres.dacs);
            return;
          } else if (acs.mode == AccessMode._NONE) {
            this._tinode.logger("WARNING: Removing non-existent subscription", pres.src, pres.dacs);
            return;
          } else {
            // New subscription. Send request for the full description.
            // Using .withOneSub (not .withLaterOneSub) to make sure IfModifiedSince is not set.
            this.getMeta(this.startMetaQuery().withOneSub(undefined, pres.src).build());
            // Create a dummy entry to catch online status update.
            this._contacts[pres.src] = {
              touched: new Date(),
              topic: pres.src,
              online: false,
              acs: acs
            };
          }
        } else if (pres.what == 'tags') {
          this.getMeta(this.startMetaQuery().withTags().build());
        }
      }

      if (this.onPres) {
        this.onPres(pres);
      }
    },
    enumerable: true,
    configurable: true,
    writable: false
  },

  /**
   * Publishing to TopicMe is not supported. {@link Topic#publish} is overriden and thows an {Error} if called.
   * @memberof Tinode.TopicMe#
   * @throws {Error} Always throws an error.
   */
  publish: {
    value: function() {
      return Promise.reject(new Error("Publishing to 'me' is not supported"));
    },
    enumerable: true,
    configurable: true,
    writable: false
  },

  /**
   * Delete validation credential.
   * @memberof Tinode.TopicMe#
   *
   * @param {String} topic - Name of the topic to delete
   * @param {String} user - User ID to remove.
   * @returns {Promise} Promise which will be resolved/rejected on receiving server reply.
   */
  delCredential: {
    value: function(method, value) {
      if (!this._subscribed) {
        return Promise.reject(new Error("Cannot delete credential in inactive 'me' topic"));
      }
      // Send {del} message, return promise
      return this._tinode.delCredential(this.name, method, value).then((ctrl) => {
        // Remove deleted credential from the cache.
        const index = this._credentials.findIndex((el) => {
          return el.meth == method && el.val == value;
        });
        if (index > -1) {
          this._credentials.splice(index, 1);
        }
        // Notify listeners
        if (this.onCredsUpdated) {
          this.onCredsUpdated(this._credentials);
        }
        return ctrl;
      });

    },
    enumerable: true,
    configurable: true,
    writable: false
  },

  /**
   * Iterate over cached contacts. If callback is undefined, use {@link this.onMetaSub}.
   * @function
   * @memberof Tinode.TopicMe#
   * @param {TopicMe.ContactCallback=} callback - Callback to call for each contact.
   * @param {boolean=} includeBanned - Include banned contacts.
   * @param {Object=} context - Context to use for calling the `callback`, i.e. the value of `this` inside the callback.
   */
  contacts: {
    value: function(callback, includeBanned, context) {
      const cb = (callback || this.onMetaSub);
      if (cb) {
        for (let idx in this._contacts) {
          if (!includeBanned &&
            (!this._contacts[idx] ||
              !this._contacts[idx].acs ||
              !this._contacts[idx].acs.isJoiner())) {

            continue;
          }
          cb.call(context, this._contacts[idx], idx, this._contacts);
        }
      }
    },
    enumerable: true,
    configurable: true,
    writable: true
  },

  /**
   * Update a cached contact with new read/received/message count.
   * @function
   * @memberof Tinode.TopicMe#
   *
   * @param {String} contactName - UID of contact to update.
   * @param {String} what - Whach count to update, one of <tt>"read", "recv", "msg"</tt>
   * @param {Number} seq - New value of the count.
   * @param {Date} ts - Timestamp of the update.
   */
  setMsgReadRecv: {
    value: function(contactName, what, seq, ts) {
      const cont = this._contacts[contactName];
      let oldVal, doUpdate = false;
      let mode = null;
      if (cont) {
        seq = seq | 0;
        cont.seq = cont.seq | 0;
        cont.read = cont.read | 0;
        cont.recv = cont.recv | 0;
        switch (what) {
          case 'recv':
            oldVal = cont.recv;
            cont.recv = Math.max(cont.recv, seq);
            doUpdate = (oldVal != cont.recv);
            break;
          case 'read':
            oldVal = cont.read;
            cont.read = Math.max(cont.read, seq);
            doUpdate = (oldVal != cont.read);
            break;
          case 'msg':
            oldVal = cont.seq;
            cont.seq = Math.max(cont.seq, seq);
            if (!cont.touched || cont.touched < ts) {
              cont.touched = ts;
            }
            doUpdate = (oldVal != cont.seq);
            break;
        }

        // Sanity checks.
        if (cont.recv < cont.read) {
          cont.recv = cont.read;
          doUpdate = true;
        }
        if (cont.seq < cont.recv) {
          cont.seq = cont.recv;
          if (!cont.touched || cont.touched < ts) {
            cont.touched = ts;
          }
          doUpdate = true;
        }
        cont.unread = cont.seq - cont.read;

        if (doUpdate && (!cont.acs || !cont.acs.isMuted()) && this.onContactUpdate) {
          this.onContactUpdate(what, cont);
        }
      }
    },
    enumerable: true,
    configurable: true,
    writable: true
  },

  /**
   * Get a contact from cache.
   * @memberof Tinode.TopicMe#
   *
   * @param {string} name - Name of the contact to get, either a UID (for p2p topics) or a topic name.
   * @returns {Tinode.Contact} - Contact or `undefined`.
   */
  getContact: {
    value: function(name) {
      return this._contacts[name];
    },
    enumerable: true,
    configurable: true,
    writable: true
  },

  /**
   * Get access mode of a given contact from cache.
   * @memberof Tinode.TopicMe#
   *
   * @param {String} name - Name of the contact to get access mode for, either a UID (for p2p topics) or a topic name.
   * @returns {string} - access mode, such as `RWP`.
   */
  getAccessMode: {
    value: function(name) {
      const cont = this._contacts[name];
      return cont ? cont.acs : null;
    },
    enumerable: true,
    configurable: true,
    writable: true
  },

  /**
   * Check if contact is archived, i.e. contact.private.arch == true.
   * @memberof Tinode.TopicMe#
   *
   * @param {String} name - Name of the contact to check archived status, either a UID (for p2p topics) or a topic name.
   * @returns {boolean} - true if contact is archived, false otherwise.
   */
  isArchived: {
    value: function(name) {
      const cont = this._contacts[name];
      return cont ? ((cont.private && cont.private.arch) ? true : false) : null;
    },
    enumerable: true,
    configurable: true,
    writable: true
  },

  /**
   * @typedef Tinode.Credential
   * @memberof Tinode
   * @type Object
   * @property {string} meth - validation method such as 'email' or 'tel'.
   * @property {string} val - credential value, i.e. 'jdoe@example.com' or '+17025551234'
   * @property {boolean} done - true if credential is validated.
   */
  /**
   * Get the user's credentials: email, phone, etc.
   * @memberof Tinode.TopicMe#
   *
   * @returns {Tinode.Credential[]} - array of credentials.
   */
  getCredentials: {
    value: function() {
      return this._credentials;
    },
    enumerable: true,
    configurable: true,
    writable: true
  }
});
TopicMe.prototype.constructor = TopicMe;

/**
 * @class TopicFnd - special case of {@link Tinode.Topic} for searching for
 * contacts and group topics.
 * @extends Tinode.Topic
 * @memberof Tinode
 *
 * @param {TopicFnd.Callbacks} callbacks - Callbacks to receive various events.
 */
var TopicFnd = function(callbacks) {
  Topic.call(this, TOPIC_FND, callbacks);
  // List of users and topics uid or topic_name -> Contact object)
  this._contacts = {};
};

// Inherit everyting from the generic Topic
TopicFnd.prototype = Object.create(Topic.prototype, {
  // Override the original Topic._processMetaSub
  _processMetaSub: {
    value: function(subs) {
      let updateCount = Object.getOwnPropertyNames(this._contacts).length;
      // Reset contact list.
      this._contacts = {};
      for (let idx in subs) {
        let sub = subs[idx];
        const indexBy = sub.topic ? sub.topic : sub.user;

        sub.updated = new Date(sub.updated);
        if (sub.seen && sub.seen.when) {
          sub.seen.when = new Date(sub.seen.when);
        }

        sub = mergeToCache(this._contacts, indexBy, sub);
        updateCount++;

        if (this.onMetaSub) {
          this.onMetaSub(sub);
        }
      }

      if (updateCount > 0 && this.onSubsUpdated) {
        this.onSubsUpdated(Object.keys(this._contacts));
      }
    },
    enumerable: true,
    configurable: true,
    writable: false
  },

  /**
   * Publishing to TopicFnd is not supported. {@link Topic#publish} is overriden and thows an {Error} if called.
   * @memberof Tinode.TopicFnd#
   * @throws {Error} Always throws an error.
   */
  publish: {
    value: function() {
      return Promise.reject(new Error("Publishing to 'fnd' is not supported"));
    },
    enumerable: true,
    configurable: true,
    writable: false
  },

  /**
   * setMeta to TopicFnd resets contact list in addition to sending the message.
   * @memberof Tinode.TopicFnd#
   * @param {Tinode.SetParams} params parameters to update.
   * @returns {Promise} Promise to be resolved/rejected when the server responds to request.
   */
  setMeta: {
    value: function(params) {
      const instance = this;
      return Object.getPrototypeOf(TopicFnd.prototype).setMeta.call(this, params).then(function() {
        if (Object.keys(instance._contacts).length > 0) {
          instance._contacts = {};
          if (instance.onSubsUpdated) {
            instance.onSubsUpdated([]);
          }
        }
      });
    },
    enumerable: true,
    configurable: true,
    writable: false
  },

  /**
   * Iterate over found contacts. If callback is undefined, use {@link this.onMetaSub}.
   * @function
   * @memberof Tinode.TopicFnd#
   * @param {TopicFnd.ContactCallback} callback - Callback to call for each contact.
   * @param {Object} context - Context to use for calling the `callback`, i.e. the value of `this` inside the callback.
   */
  contacts: {
    value: function(callback, context) {
      const cb = (callback || this.onMetaSub);
      if (cb) {
        for (let idx in this._contacts) {
          cb.call(context, this._contacts[idx], idx, this._contacts);
        }
      }
    },
    enumerable: true,
    configurable: true,
    writable: true
  }
});
TopicFnd.prototype.constructor = TopicFnd;

/**
 * @class LargeFileHelper - collection of utilities for uploading and downloading files
 * out of band. Don't instantiate this class directly. Use {Tinode.getLargeFileHelper} instead.
 * @memberof Tinode
 *
 * @param {Tinode} tinode - the main Tinode object.
 */
var LargeFileHelper = function(tinode) {
  this._tinode = tinode;

  this._apiKey = tinode._apiKey;
  this._authToken = tinode.getAuthToken();
  this._msgId = tinode.getNextUniqueId();
  this.xhr = new XMLHttpRequest();

  // Promise
  this.toResolve = null;
  this.toReject = null;

  // Callbacks
  this.onProgress = null;
  this.onSuccess = null;
  this.onFailure = null;
}

LargeFileHelper.prototype = {
  /**
   * Start uploading the file to a non-default endpoint.
   *
   * @memberof Tinode.LargeFileHelper#
   *
   * @param {String} baseUrl alternative base URL of upload server.
   * @param {File} file to upload
   * @param {Callback} onProgress callback. Takes one {float} parameter 0..1
   * @param {Callback} onSuccess callback. Called when the file is successfully uploaded.
   * @param {Callback} onFailure callback. Called in case of a failure.
   *
   * @returns {Promise} resolved/rejected when the upload is completed/failed.
   */
  uploadWithBaseUrl: function(baseUrl, file, onProgress, onSuccess, onFailure) {
    if (!this._authToken) {
      throw new Error("Must authenticate first");
    }
    const instance = this;

    let url = '/v' + PROTOCOL_VERSION + '/file/u/';
    if (baseUrl) {
      if (baseUrl.indexOf('http://') == 0 || baseUrl.indexOf('https://') == 0) {
        url = baseUrl + url;
      } else {
        throw new Error("Invalid base URL '" + baseUrl + "'");
      }
    }
    this.xhr.open('POST', url, true);
    this.xhr.setRequestHeader('X-Tinode-APIKey', this._apiKey);
    this.xhr.setRequestHeader('X-Tinode-Auth', 'Token ' + this._authToken.token);
    const result = new Promise((resolve, reject) => {
      this.toResolve = resolve;
      this.toReject = reject;
    });

    this.onProgress = onProgress;
    this.onSuccess = onSuccess;
    this.onFailure = onFailure;

    this.xhr.upload.onprogress = function(e) {
      if (e.lengthComputable && instance.onProgress) {
        instance.onProgress(e.loaded / e.total);
      }
    }

    this.xhr.onload = function() {
      let pkt;
      try {
        pkt = JSON.parse(this.response, jsonParseHelper);
      } catch (err) {
        instance._tinode.logger("ERROR: Invalid server response in LargeFileHelper", this.response);
        pkt = {
          ctrl: {
            code: this.status,
            text: this.statusText
          }
        };
      }

      if (this.status >= 200 && this.status < 300) {
        if (instance.toResolve) {
          instance.toResolve(pkt.ctrl.params.url);
        }
        if (instance.onSuccess) {
          instance.onSuccess(pkt.ctrl);
        }
      } else if (this.status >= 400) {
        if (instance.toReject) {
          instance.toReject(new Error(pkt.ctrl.text + " (" + pkt.ctrl.code + ")"));
        }
        if (instance.onFailure) {
          instance.onFailure(pkt.ctrl)
        }
      } else {
        instance._tinode.logger("ERROR: Unexpected server response status", this.status, this.response);
      }
    };

    this.xhr.onerror = function(e) {
      if (instance.toReject) {
        instance.toReject(new Error("failed"));
      }
      if (instance.onFailure) {
        instance.onFailure(null);
      }
    };

    this.xhr.onabort = function(e) {
      if (instance.toReject) {
        instance.toReject(new Error("upload cancelled by user"));
      }
      if (instance.onFailure) {
        instance.onFailure(null);
      }
    };

    try {
      const form = new FormData();
      form.append('file', file);
      form.set('id', this._msgId);
      this.xhr.send(form);
    } catch (err) {
      if (this.toReject) {
        this.toReject(err);
      }
      if (this.onFailure) {
        this.onFailure(null);
      }
    }

    return result;
  },

  /**
   * Start uploading the file to default endpoint.
   *
   * @memberof Tinode.LargeFileHelper#
   *
   * @param {File} file to upload
   * @param {Callback} onProgress callback. Takes one {float} parameter 0..1
   * @param {Callback} onSuccess callback. Called when the file is successfully uploaded.
   * @param {Callback} onFailure callback. Called in case of a failure.
   *
   * @returns {Promise} resolved/rejected when the upload is completed/failed.
   */
  upload: function(file, onProgress, onSuccess, onFailure) {
    return this.uploadWithBaseUrl(undefined, file, onProgress, onSuccess, onFailure);
  },

  /**
   * Download the file from a given URL using GET request. This method works with the Tinode server only.
   *
   * @memberof Tinode.LargeFileHelper#
   *
   * @param {String} relativeUrl - URL to download the file from. Must be relative url, i.e. must not contain the host.
   * @param {String=} filename - file name to use for the downloaded file.
   *
   * @returns {Promise} resolved/rejected when the download is completed/failed.
   */
  download: function(relativeUrl, filename, mimetype, onProgress) {
    // Check if the URL is relative. Check for cases like:
    //  'http://example.com'
    //  ' http://example.com'
    //  '//example.com/'
    //  'http:example.com'
    //  'http:/example.com'
    if (/^\s*([a-z][a-z0-9+.-]*:|\/\/)/im.test(relativeUrl)) {
      // As a security measure refuse to download from an absolute URL.
      throw new Error("The URL '" + relativeUrl + "' must be relative, not absolute");
    }
    if (!this._authToken) {
      throw new Error("Must authenticate first");
    }
    const instance = this;
    // Get data as blob (stored by the browser as a temporary file).
    this.xhr.open('GET', relativeUrl, true);
    this.xhr.setRequestHeader('X-Tinode-APIKey', this._apiKey);
    this.xhr.setRequestHeader('X-Tinode-Auth', 'Token ' + this._authToken.token);
    this.xhr.responseType = 'blob';

    this.onProgress = onProgress;
    this.xhr.onprogress = function(e) {
      if (instance.onProgress) {
        // Passing e.loaded instead of e.loaded/e.total because e.total
        // is always 0 with gzip compression enabled by the server.
        instance.onProgress(e.loaded);
      }
    };

    const result = new Promise((resolve, reject) => {
      this.toResolve = resolve;
      this.toReject = reject;
    });

    // The blob needs to be saved as file. There is no known way to
    // save the blob as file other than to fake a click on an <a href... download=...>.
    this.xhr.onload = function() {
      if (this.status == 200) {
        const link = document.createElement('a');
        // URL.createObjectURL is not available in non-browser environment. This call will fail.
        link.href = window.URL.createObjectURL(new Blob([this.response], {
          type: mimetype
        }));
        link.style.display = 'none';
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
        if (instance.toResolve) {
          instance.toResolve();
        }
      } else if (this.status >= 400 && instance.toReject) {
        // The this.responseText is undefined, must use this.response which is a blob.
        // Need to convert this.response to JSON. The blob can only be accessed by the
        // FileReader.
        const reader = new FileReader();
        reader.onload = function() {
          try {
            const pkt = JSON.parse(this.result, jsonParseHelper);
            instance.toReject(new Error(pkt.ctrl.text + " (" + pkt.ctrl.code + ")"));
          } catch (err) {
            instance._tinode.logger("ERROR: Invalid server response in LargeFileHelper", this.result);
            instance.toReject(err);
          }
        };
        reader.readAsText(this.response);
      }
    };

    this.xhr.onerror = function(e) {
      if (instance.toReject) {
        instance.toReject(new Error("failed"));
      }
    };

    this.xhr.onabort = function() {
      if (instance.toReject) {
        instance.toReject(null);
      }
    };

    try {
      this.xhr.send();
    } catch (err) {
      if (this.toReject) {
        this.toReject(err);
      }
    }

    return result;
  },

  /**
   * Try to cancel an ongoing upload or download.
   * @memberof Tinode.LargeFileHelper#
   */
  cancel: function() {
    if (this.xhr && this.xhr.readyState < 4) {
      this.xhr.abort();
    }
  },

  /**
   * Get unique id of this request.
   * @memberof Tinode.LargeFileHelper#
   *
   * @returns {string} unique id
   */
  getId: function() {
    return this._msgId;
  }
};

/**
 * @class Message - definition a communication message.
 * Work in progress.
 * @memberof Tinode
 *
 * @param {string} topic_ - name of the topic the message belongs to.
 * @param {string | Drafty} content_ - message contant.
 */
var Message = function(topic_, content_) {
  this.status = Message.STATUS_NONE;
  this.topic = topic_;
  this.content = content_;
}

Message.STATUS_NONE = MESSAGE_STATUS_NONE;
Message.STATUS_QUEUED = MESSAGE_STATUS_QUEUED;
Message.STATUS_SENDING = MESSAGE_STATUS_SENDING;
Message.STATUS_FAILED = MESSAGE_STATUS_FAILED;
Message.STATUS_SENT = MESSAGE_STATUS_SENT;
Message.STATUS_RECEIVED = MESSAGE_STATUS_RECEIVED;
Message.STATUS_READ = MESSAGE_STATUS_READ;
Message.STATUS_TO_ME = MESSAGE_STATUS_TO_ME;

Message.prototype = {
  /**
   * Convert message object to {pub} packet.
   */
  toJSON: function() {

  },
  /**
   * Parse JSON into message.
   */
  fromJSON: function(json) {

  }
}
Message.prototype.constructor = Message;

if (typeof module != 'undefined') {
  module.exports = Tinode;
  module.exports.Drafty = Drafty;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../version.json":3,"./drafty.js":1}],3:[function(require,module,exports){
module.exports={"version": "0.16.3-rc9"}

},{}],4:[function(require,module,exports){
(function (global){
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).Tinode=e()}}(function(){var e=function(e){var t;return function(n){return t||e(t={exports:{},parent:n},t.exports),t.exports}},t=e(function(e,t){e.exports={version:"0.16.3-rc9"}}),n=e(function(e,t){"use strict";var n=[{name:"ST",start:/(?:^|[\W_])(\*)[^\s*]/,end:/[^\s*](\*)(?=$|[\W_])/},{name:"EM",start:/(?:^|\W)(_)[^\s_]/,end:/[^\s_](_)(?=$|\W)/},{name:"DL",start:/(?:^|[\W_])(~)[^\s~]/,end:/[^\s~](~)(?=$|[\W_])/},{name:"CO",start:/(?:^|\W)(`)[^`]/,end:/[^`](`)(?=$|\W)/}],i=[{name:"LN",dataName:"url",pack:function(e){return/^[a-z]+:\/\//i.test(e)||(e="http://"+e),{url:e}},re:/(?:(?:https?|ftp):\/\/|www\.|ftp\.)[-A-Z0-9+&@#\/%=~_|$?!:,.]*[A-Z0-9+&@#\/%=~_|$]/gi},{name:"MN",dataName:"val",pack:function(e){return{val:e.slice(1)}},re:/\B@(\w\w+)/g},{name:"HT",dataName:"val",pack:function(e){return{val:e.slice(1)}},re:/\B#(\w\w+)/g}],s={ST:{name:"b",isVoid:!1},EM:{name:"i",isVoid:!1},DL:{name:"del",isVoid:!1},CO:{name:"tt",isVoid:!1},BR:{name:"br",isVoid:!0},LN:{name:"a",isVoid:!1},MN:{name:"a",isVoid:!1},HT:{name:"a",isVoid:!1},IM:{name:"img",isVoid:!0},FM:{name:"div",isVoid:!1},RW:{name:"div",isVoid:!1},BN:{name:"button",isVoid:!1},HD:{name:"",isVoid:!1}};function r(e,t){var n;try{for(var i=(n=atob(e)).length,s=new ArrayBuffer(i),r=new Uint8Array(s),o=0;o<i;o++)r[o]=n.charCodeAt(o);return URL.createObjectURL(new Blob([s],{type:t}))}catch(a){console.log("Drafty: failed to convert object.",a.message)}return null}var o={ST:{open:function(){return"<b>"},close:function(){return"</b>"}},EM:{open:function(){return"<i>"},close:function(){return"</i>"}},DL:{open:function(){return"<del>"},close:function(){return"</del>"}},CO:{open:function(){return"<tt>"},close:function(){return"</tt>"}},BR:{open:function(){return"<br/>"},close:function(){return""}},HD:{open:function(){return""},close:function(){return""}},LN:{open:function(e){return'<a href="'+e.url+'">'},close:function(e){return"</a>"},props:function(e){return e?{href:e.url,target:"_blank"}:null}},MN:{open:function(e){return'<a href="#'+e.val+'">'},close:function(e){return"</a>"},props:function(e){return e?{name:e.val}:null}},HT:{open:function(e){return'<a href="#'+e.val+'">'},close:function(e){return"</a>"},props:function(e){return e?{name:e.val}:null}},BN:{open:function(e){return"<button>"},close:function(e){return"</button>"},props:function(e){return e?{"data-act":e.act,"data-val":e.val,"data-name":e.name,"data-ref":e.ref}:null}},IM:{open:function(e){var t=r(e.val,e.mime),n=e.ref?e.ref:t;return(e.name?'<a href="'+n+'" download="'+e.name+'">':"")+'<img src="'+t+'"'+(e.width?' width="'+e.width+'"':"")+(e.height?' height="'+e.height+'"':"")+' border="0" />'},close:function(e){return e.name?"</a>":""},props:function(e){return e?{src:r(e.val,e.mime),title:e.name,"data-width":e.width,"data-height":e.height,"data-name":e.name,"data-size":e.val?.75*e.val.length|0:0,"data-mime":e.mime}:null}},FM:{open:function(e){return"<div>"},close:function(e){return"</div>"}},RW:{open:function(e){return"<div>"},close:function(e){return"</div>"}}},a=function(){};a.parse=function(e){if("string"!=typeof e)return null;var t=e.split(/\r?\n/),s=[],r={},o=[];t.map(function(e){var t,a,c=[];if(n.map(function(t){c=c.concat(function(e,t,n,i){for(var s=[],r=0,o=e.slice(0);o.length>0;){var a=t.exec(o);if(null==a)break;var c=a.index+a[0].lastIndexOf(a[1]);o=o.slice(c+1),r=(c+=r)+1;var u=n?n.exec(o):null;if(null==u)break;var h=u.index+u[0].indexOf(u[1]);o=o.slice(h+1),r=(h+=r)+1,s.push({text:e.slice(c+1,h),children:[],start:c,end:h,type:i})}return s}(e,t.start,t.end,t.name))}),0==c.length)a={txt:e};else{c.sort(function(e,t){return e.start-t.start}),c=function e(t){if(0==t.length)return[];for(var n=[t[0]],i=t[0],s=1;s<t.length;s++)t[s].start>i.end?(n.push(t[s]),i=t[s]):t[s].end<i.end&&i.children.push(t[s]);for(var s in n)n[s].children=e(n[s].children);return n}(c);var u=function e(t,n){var i="",s=[];for(var r in t){var o=t[r];if(!o.text){var a=e(o.children,i.length+n);o.text=a.txt,s=s.concat(a.fmt)}o.type&&s.push({at:i.length+n,len:o.text.length,tp:o.type}),i+=o.text}return{txt:i,fmt:s}}(function e(t,n,i,s){var r=[];if(0==s.length)return[];for(var o in s){var a=s[o];a.start>n&&r.push({text:t.slice(n,a.start)});var c={type:a.type},u=e(t,a.start+1,a.end,a.children);u.length>0?c.children=u:c.text=a.text,r.push(c),n=a.end+1}return n<i&&r.push({text:t.slice(n,i)}),r}(e,0,e.length,c),0);a={txt:u.txt,fmt:u.fmt}}if((t=function(e){var t,n=[];if(i.map(function(i){for(;null!==(t=i.re.exec(e));)n.push({offset:t.index,len:t[0].length,unique:t[0],data:i.pack(t[0]),type:i.name})}),0==n.length)return n;n.sort(function(e,t){return e.offset-t.offset});var s=-1;return n=n.filter(function(e){var t=e.offset>s;return s=e.offset+e.len,t})}(a.txt)).length>0){var h=[];for(var l in t){var d=t[l],f=r[d.unique];f||(f=s.length,r[d.unique]=f,s.push({tp:d.type,data:d.data})),h.push({at:d.offset,len:d.len,key:f})}a.ent=h}o.push(a)});var a={txt:""};if(o.length>0){a.txt=o[0].txt,a.fmt=(o[0].fmt||[]).concat(o[0].ent||[]);for(var c=1;c<o.length;c++){var u=o[c],h=a.txt.length+1;a.fmt.push({tp:"BR",len:1,at:h-1}),a.txt+=" "+u.txt,u.fmt&&(a.fmt=a.fmt.concat(u.fmt.map(function(e){return e.at+=h,e}))),u.ent&&(a.fmt=a.fmt.concat(u.ent.map(function(e){return e.at+=h,e})))}0==a.fmt.length&&delete a.fmt,s.length>0&&(a.ent=s)}return a},a.init=function(e){return"string"!=typeof e?null:{txt:e}},a.append=function(e,t){if(null==e)return t;if(null==t)return e;e.txt=e.txt||"",t.txt=t.txt||"";var n=e.txt.length;return e.txt+=t.txt,Array.isArray(t.fmt)&&(e.fmt=e.fmt||[],Array.isArray(t.ent)&&(e.ent=e.ent||[]),t.fmt.forEach(function(i){var s={at:i.at+n,len:i.len};i.tp?s.tp=i.tp:(s.key=e.ent.length,e.ent.push(t.ent[i.key||0])),e.fmt.push(s)})),e},a.insertImage=function(e,t,n,i,s,r,o,a,c){return(e=e||{txt:" "}).ent=e.ent||[],e.fmt=e.fmt||[],e.fmt.push({at:t,len:1,key:e.ent.length}),e.ent.push({tp:"IM",data:{mime:n,val:i,width:s,height:r,name:o,ref:c,size:0|a}}),e},a.appendImage=function(e,t,n,i,s,r,o,c){return(e=e||{txt:""}).txt+=" ",a.insertImage(e,e.txt.length-1,t,n,i,s,r,o,c)},a.attachFile=function(e,t,n,i,s,r){(e=e||{txt:""}).ent=e.ent||[],e.fmt=e.fmt||[],e.fmt.push({at:-1,len:0,key:e.ent.length});var o={tp:"EX",data:{mime:t,val:n,name:i,ref:r,size:0|s}};return r instanceof Promise&&(o.data.ref=r.then(function(e){o.data.ref=e},function(e){})),e.ent.push(o),e},a.wrapAsForm=function(e,t,n){return"string"==typeof e&&(e={txt:e}),e.fmt=e.fmt||[],e.fmt.push({at:t,len:n,tp:"FM"}),e},a.insertButton=function(e,t,n,i,s,r,o){return"string"==typeof e&&(e={txt:e}),!e||!e.txt||e.txt.length<t+n?null:n<=0||-1==["url","pub"].indexOf(s)?null:"url"!=s||o?(o=""+o,e.ent=e.ent||[],e.fmt=e.fmt||[],e.fmt.push({at:t,len:n,key:e.ent.length}),e.ent.push({tp:"BN",data:{act:s,val:r,ref:o,name:i}}),e):null},a.appendButton=function(e,t,n,i,s,r){var o=(e=e||{txt:""}).txt.length;return e.txt+=t,a.insertButton(e,o,t.length,n,i,s,r)},a.attachJSON=function(e,t){return(e=e||{txt:""}).ent=e.ent||[],e.fmt=e.fmt||[],e.fmt.push({at:-1,len:0,key:e.ent.length}),e.ent.push({tp:"EX",data:{mime:"application/json",val:t}}),e},a.appendLineBreak=function(e){return(e=e||{txt:""}).fmt=e.fmt||[],e.fmt.push({at:e.txt.length,len:1,tp:"BR"}),e.txt+=" ",e},a.UNSAFE_toHTML=function(e){var t,n,i,s=e.txt,r=e.fmt,a=e.ent,c=[];if(r)for(var u in r){var h=r[u],l=h.tp,d=void 0;if(!l){var f=a[0|h.key];f&&(l=f.tp,d=f.data)}o[l]&&(c.push({idx:h.at+h.len,len:-h.len,what:o[l].close(d)}),c.push({idx:h.at,len:h.len,what:o[l].open(d)}))}for(var p in c.sort(function(e,t){return t.idx==e.idx?t.len-e.len:t.idx-e.idx}),c)c[p].what&&(t=s,n=c[p].idx,i=c[p].what,s=t.slice(0,n)+i+t.slice(n));return s},a.format=function(e,t,n){var i=e.txt,r=e.fmt,o=e.ent;if(i=i||"",Array.isArray(o)||(o=[]),!Array.isArray(r)){if(1!=o.length)return[i];r=[{at:0,len:0,key:0}]}var a=[].concat(r);return a.map(function(e){e.at=e.at||0,e.len=e.len||0,e.len<0&&(e.len=0),e.at<-1&&(e.at=-1)}),a.sort(function(e,t){return e.at-t.at==0?t.len-e.len:e.at-t.at}),a=a.map(function(e){var t,n=e.tp;return n||(e.key=e.key||0,o[e.key]&&(t=o[e.key].data,n=o[e.key].tp)),{tp:n=n||"HD",data:t,at:e.at,len:e.len}}),function e(t,n,i,r,o,a){for(var c=[],u=0;u<r.length;u++){var h=r[u];if(!(h.at<0)){n<h.at&&(c.push(o.call(a,null,void 0,t.slice(n,h.at),c.length)),n=h.at);for(var l=[],d=u+1;d<r.length&&r[d].at<h.at+h.len;d++)l.push(r[d]),u=d;var f=s[h.tp]||{};c.push(o.call(a,h.tp,h.data,f.isVoid?null:e(t,n,h.at+h.len,l,o,a),c.length)),n=h.at+h.len}}return n<i&&c.push(o.call(a,null,void 0,t.slice(n,i),c.length)),c}(i,0,i.length,a,t,n)},a.toPlainText=function(e){return"string"==typeof e?e:e.txt},a.isPlainText=function(e){return"string"==typeof e||!(e.fmt||e.ent)},a.hasAttachments=function(e){if(e.ent&&e.ent.length>0)for(var t in e.ent)if(e.ent[t]&&"EX"==e.ent[t].tp)return!0;return!1},a.attachments=function(e,t,n){if(e.ent&&e.ent.length>0)for(var i in e.ent)e.ent[i]&&"EX"==e.ent[i].tp&&t.call(n,e.ent[i].data,i)},a.getDownloadUrl=function(e){var t=null;return"application/json"!=e.mime&&e.val?t=r(e.val,e.mime):"string"==typeof e.ref&&(t=e.ref),t},a.isUploading=function(e){return e.ref instanceof Promise},a.getPreviewUrl=function(e){return e.val?r(e.val,e.mime):null},a.getEntitySize=function(e){return e.size?e.size:e.val?.75*e.val.length|0:0},a.getEntityMimeType=function(e){return e.mime||"text/plain"},a.tagName=function(e){return s[e]?s[e].name:void 0},a.attrValue=function(e,t){if(t&&o[e])return o[e].props(t)},a.getContentType=function(){return"text/x-drafty"},void 0!==e&&(e.exports=a)}),i={exports:{}};return function(e){"use strict";function s(e){return(s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}if(void 0===r)var r=n({});var o,a,c=t({}).version;"undefined"!=typeof WebSocket&&(o=WebSocket),"undefined"!=typeof XMLHttpRequest&&(a=XMLHttpRequest),"undefined"==typeof btoa&&(e.btoa=function(){for(var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",n="",i=0,s=0,r="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";t.charAt(0|s)||(r="=",s%1);n+=r.charAt(63&i>>8-s%1*8)){if((e=t.charCodeAt(s+=.75))>255)throw new Error("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");i=i<<8|e}return n}),"undefined"==typeof atob&&(e.atob=function(){var e=(arguments.length>0&&void 0!==arguments[0]?arguments[0]:"").replace(/=+$/,""),t="";if(e.length%4==1)throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");for(var n,i=0,s=0,r=0;n=e.charAt(r++);~n&&(s=i%4?64*s+n:n,i++%4)?t+=String.fromCharCode(255&s>>(-2*i&6)):0)n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(n);return t}),"undefined"==typeof window&&(e.window={WebSocket:o,XMLHttpRequest:a,URL:{createObjectURL:function(){throw new Error("Unable to use URL.createObjectURL in a non-browser application")}}});var u="0",h=c||"0.16",l="tinodejs/"+h,d=503,f="Connection failed",p=418,g="Disconnected by client";function v(e){return btoa(encodeURIComponent(e).replace(/%([0-9A-F]{2})/g,function(e,t){return String.fromCharCode("0x"+t)}))}function _(e,t,n){if("object"!=s(t)){if(t===y.DEL_CHAR)return;return void 0===t?e:t}if(null===t)return t;if(t instanceof Date)return e&&e instanceof Date&&!(e<t)?e:t;if(t instanceof T)return new T(t);if(t instanceof Array)return t;for(var i in e&&e!==y.DEL_CHAR||(e=t.constructor()),t)!t.hasOwnProperty(i)||n&&n[i]||"_noForwarding"==i||(e[i]=_(e[i],t[i]));return e}function m(e,t,n,i){return e[t]=_(e[t],n,i),e[t]}function w(e,t){if("ts"===e&&"string"==typeof t&&t.length>=20&&t.length<=24){var n=new Date(t);if(n)return n}else if("acs"===e&&"object"===s(t))return new T(t);return t}function b(e,t){return"string"==typeof t&&t.length>128?"<"+t.length+", bytes: "+t.substring(0,12)+"..."+t.substring(t.length-12)+">":function(e,t){if(t instanceof Date)t=function(e){if(e&&0!=e.getTime()){var t=e.getUTCMilliseconds();return e.getUTCFullYear()+"-"+n(e.getUTCMonth()+1)+"-"+n(e.getUTCDate())+"T"+n(e.getUTCHours())+":"+n(e.getUTCMinutes())+":"+n(e.getUTCSeconds())+(t?"."+n(t,3):"")+"Z"}function n(e,t){return"0".repeat((t=t||2)-(""+e).length)+e}}(t);else if(t instanceof T)t=t.jsonHelper();else if(null==t||!1===t||Array.isArray(t)&&0==t.length||"object"==s(t)&&0==Object.keys(t).length)return;return t}(0,t)}function M(e,t,n){var i=null;return"http"!==t&&"https"!==t&&"ws"!==t&&"wss"!==t||(i=t+"://","/"!==(i+=e).charAt(i.length-1)&&(i+="/"),i+="v"+u+"/channels","http"!==t&&"https"!==t||(i+="/lp"),i+="?apikey="+n),i}var S=function(e,t,n,i,r){var a=this,c=e,u=i,h=t,l=r,v=2e3,_=10,m=.3,b=null,S=0,y=!1,x=function(e){if(a.logger){for(var t=arguments.length,n=new Array(t>1?t-1:0),i=1;i<t;i++)n[i-1]=arguments[i];a.logger.apply(a,[e].concat(n))}};function T(){var e=this;clearTimeout(b);var t=v*(Math.pow(2,S)*(1+m*Math.random()));S=S>=_?S:S+1,this.onAutoreconnectIteration&&this.onAutoreconnectIteration(t),b=setTimeout(function(){if(x("Reconnecting, iter="+S+", timeout="+t),y)e.onAutoreconnectIteration&&e.onAutoreconnectIteration(-1);else{var n=e.connect();e.onAutoreconnectIteration?e.onAutoreconnectIteration(0,n):n.catch(function(){})}},t)}function D(){clearTimeout(b),b=null}function E(e){var t=null;e.connect=function(n,i){if(y=!1,t&&t.readyState==t.OPEN){if(!i)return Promise.resolve();t.close(),t=null}return n&&(c=n),new Promise(function(n,i){var s=M(c,u?"wss":"ws",h);x("Connecting to: ",s);var r=new o(s);r.onopen=function(t){l&&D(),e.onOpen&&e.onOpen(),n()},r.onclose=function(n){if(t=null,e.onDisconnect){var i=y?p:d;e.onDisconnect(new Error(y?g:f+" ("+i+")"),i)}!y&&l&&T.call(e)},r.onerror=function(e){i(e)},r.onmessage=function(t){e.onMessage&&e.onMessage(t.data)},t=r})},e.reconnect=function(t){D(),e.connect(null,t)},e.disconnect=function(){y=!0,t&&(D(),t.close(),t=null)},e.sendText=function(e){if(!t||t.readyState!=t.OPEN)throw new Error("Websocket is not connected");t.send(e)},e.isConnected=function(){return t&&t.readyState==t.OPEN},e.transport=function(){return"ws"},e.probe=function(){e.sendText("1")}}function R(e){var t=null,n=null,i=null;e.connect=function(i,s){if(y=!1,n){if(!s)return Promise.resolve();n.onreadystatechange=void 0,n.abort(),n=null}return i&&(c=i),new Promise(function(i,s){var r=M(c,u?"https":"http",h);x("Connecting to: ",r),(n=function n(i,s,r){var o=XMLHttpRequest(),a=!1;return o.onreadystatechange=function(c){if(4==o.readyState)if(201==o.status){var u=JSON.parse(o.responseText,w);t=i+"&sid="+u.ctrl.params.sid,(o=n(t)).send(null),e.onOpen&&e.onOpen(),s&&(a=!0,s()),l&&D()}else if(o.status<400)e.onMessage&&e.onMessage(o.responseText),(o=n(t)).send(null);else{if(r&&!a&&(a=!0,r(o.responseText)),e.onMessage&&o.responseText&&e.onMessage(o.responseText),e.onDisconnect){var h=o.status||(y?p:d),v=o.responseText||(y?g:f);e.onDisconnect(new Error(v+" ("+h+")"),h)}o=null,!y&&l&&T.call(e)}},o.open("GET",i,!0),o}(r,i,s)).send(null)}).catch(function(){})},e.reconnect=function(t){D(),e.connect(null,t)},e.disconnect=function(){y=!0,D(),i&&(i.onreadystatechange=void 0,i.abort(),i=null),n&&(n.onreadystatechange=void 0,n.abort(),n=null),e.onDisconnect&&e.onDisconnect(new Error(g+" ("+p+")"),p),t=null},e.sendText=function(e){var n,s;if(n=t,(s=XMLHttpRequest()).onreadystatechange=function(e){if(4==s.readyState&&s.status>=400)throw new Error("LP sender failed, "+s.status)},s.open("POST",n,!0),!(i=s)||1!=i.readyState)throw new Error("Long poller failed to connect");i.send(e)},e.isConnected=function(){return n&&!0},e.transport=function(){return"lp"},e.probe=function(){e.sendText("1")}}var A=!1;if("lp"===n?(R(this),A=!0):"ws"===n?(E(this),A=!0):"object"==("undefined"==typeof window?"undefined":s(window))&&(window.WebSocket?(E(this),A=!0):window.XMLHttpRequest&&(R(this),A=!0)),!A)throw console.log("No network transport is available. Running Node? Call 'Tinode.setNetworkProviders()'."),new Error("No network transport is available. Running Node? Call 'Tinode.setNetworkProviders()'.");this.transportAvailable=function(e){switch(e){case"ws":return"object"==("undefined"==typeof window?"undefined":s(window))&&window.WebSocket;case"lp":return"object"==("undefined"==typeof window?"undefined":s(window))&&window.XMLHttpRequest;default:return console.log("Request for unknown transport",e),!1}},this.backoffReset=function(){S=0},this.onMessage=void 0,this.onDisconnect=void 0,this.onOpen=void 0,this.onAutoreconnectIteration=void 0,this.logger=void 0},y=function(e,t,n,i,r,o){var a=this;this._appName=e||"Undefined",this._apiKey=n,this._browser="",this._platform=o,this._hwos="undefined",this._humanLanguage="xx","undefined"!=typeof navigator&&(this._browser=function(e,t){e=e||"";var n="";/reactnative/i.test(t)&&(n="ReactNative; ");var i,s=(e=e.replace(" (KHTML, like Gecko)","")).match(/(AppleWebKit\/[.\d]+)/i);if(s){for(var r=["chrome","safari","mobile","version"],o=e.substr(s.index+s[0].length).split(" "),a=[],c=function(e){var t=/([\w.]+)[\/]([\.\d]+)/.exec(o[e]);t&&a.push([t[1],t[2],r.findIndex(function(e){return e==t[1].toLowerCase()})])},u=0;u<o.length;u++)c(u);a.sort(function(e,t){var n=e[2]-t[2];return 0!=n?n:t[0].length-e[0].length}),i=a.length>0?a[0][0]+"/"+a[0][1]:s[1]}else i=/trident/i.test(e)?(s=/(?:\brv[ :]+([.\d]+))|(?:\bMSIE ([.\d]+))/g.exec(e))?"MSIE/"+(s[1]||s[2]):"MSIE/?":/firefox/i.test(e)?(s=/Firefox\/([.\d]+)/g.exec(e))?"Firefox/"+s[1]:"Firefox/?":/presto/i.test(e)?(s=/Opera\/([.\d]+)/g.exec(e))?"Opera/"+s[1]:"Opera/?":(s=/([\w.]+)\/([.\d]+)/.exec(e))?s[1]+"/"+s[2]:(s=e.split(" "))[0];if((s=i.split("/")).length>1){var h=s[1].split(".");i=s[0]+"/"+h[0]+(h[1]?"."+h[1]:"")}return n+i}(navigator.userAgent,navigator.product),this._hwos=navigator.platform,this._humanLanguage=navigator.language||"en-US"),this._loggingEnabled=!1,this._trimLongStrings=!1,this._myUID=null,this._authenticated=!1,this._login=null,this._authToken=null,this._inPacketCount=0,this._messageId=Math.floor(65535*Math.random()+65535),this._serverInfo=null,this._deviceToken=null,this._pendingPromises={},this._connection=new S(t,n,i,r,!0),this.logger=function(e){if(a._loggingEnabled){for(var t=new Date,n=("0"+t.getUTCHours()).slice(-2)+":"+("0"+t.getUTCMinutes()).slice(-2)+":"+("0"+t.getUTCSeconds()).slice(-2)+":"+("0"+t.getUTCMilliseconds()).slice(-3),i=arguments.length,s=new Array(i>1?i-1:0),r=1;r<i;r++)s[r-1]=arguments[r];console.log("["+n+"]",e,s.join(" "))}},this._connection.logger=this.logger,this._cache={};var c=this.cachePut=function(e,t,n){a._cache[e+":"+t]=n},u=this.cacheGet=function(e,t){return a._cache[e+":"+t]},f=this.cacheDel=function(e,t){delete a._cache[e+":"+t]},p=this.cacheMap=function(e,t){for(var n in a._cache)if(e(a._cache[n],n,t))break};this.attachCacheToTopic=function(e){e._tinode=a,e._cacheGetUser=function(e){var t=u("user",e);if(t)return{user:e,public:_({},t)}},e._cachePutUser=function(e,t){return c("user",e,_({},t.public))},e._cacheDelUser=function(e){return f("user",e)},e._cachePutSelf=function(){return c("topic",e.name,e)},e._cacheDelSelf=function(){return f("topic",e.name)}};var g=function(e,t,n,i){var s=a._pendingPromises[e];s&&(delete a._pendingPromises[e],t>=200&&t<400?s.resolve&&s.resolve(n):s.reject&&s.reject(new Error(i+" ("+t+")")))},v=(setInterval(function(){var e=new Error("Timeout (504)"),t=new Date((new Date).getTime()-5e3);for(var n in a._pendingPromises){var i=a._pendingPromises[n];i&&i.ts<t&&(a.logger("Promise expired",n),delete a._pendingPromises[n],i.reject&&i.reject(e))}},1e3),this.getNextUniqueId=function(){return 0!=a._messageId?""+a._messageId++:void 0});this.initPacket=function(e,t){switch(e){case"hi":return{hi:{id:v(),ver:h,ua:a._appName+" ("+(a._browser?a._browser+"; ":"")+a._hwos+"); "+l,dev:a._deviceToken,lang:a._humanLanguage,platf:a._platform}};case"acc":return{acc:{id:v(),user:null,scheme:null,secret:null,login:!1,tags:null,desc:{},cred:{}}};case"login":return{login:{id:v(),scheme:null,secret:null}};case"sub":return{sub:{id:v(),topic:t,set:{},get:{}}};case"leave":return{leave:{id:v(),topic:t,unsub:!1}};case"pub":return{pub:{id:v(),topic:t,noecho:!1,head:null,content:{}}};case"get":return{get:{id:v(),topic:t,what:null,desc:{},sub:{},data:{}}};case"set":return{set:{id:v(),topic:t,desc:{},sub:{},tags:[]}};case"del":return{del:{id:v(),topic:t,what:null,delseq:null,user:null,hard:!1}};case"note":return{note:{topic:t,what:null,seq:void 0}};default:throw new Error("Unknown packet type requested: "+e)}},this.send=function(e,t){return a.send2(e,t,null)},this.send2=function(e,t,n){var i;t&&(i=function(e){var t=null;return e&&(t=new Promise(function(t,n){a._pendingPromises[e]={resolve:t,reject:n,ts:new Date}})),t}(t)),e=function e(t){return Object.keys(t).forEach(function(n){"_"==n[0]?delete t[n]:t[n]?Array.isArray(t[n])&&0==t[n].length?delete t[n]:t[n]?"object"!=s(t[n])||t[n]instanceof Date||(e(t[n]),0==Object.getOwnPropertyNames(t[n]).length&&delete t[n]):delete t[n]:delete t[n]}),t}(e);var r=JSON.stringify(e);a.logger("out: "+(a._trimLongStrings?JSON.stringify(e,b):r));try{if(!(null==n||Math.floor(10*Math.random())<5))throw new Error("Error publishing '"+r+"'");a._connection.sendText(r)}catch(o){if(!t)throw o;g(t,d,null,o.message)}return i},this.loginSuccessful=function(e){e.params&&e.params.user&&(a._myUID=e.params.user,a._authenticated=e&&e.code>=200&&e.code<300,e.params&&e.params.token&&e.params.expires?a._authToken={token:e.params.token,expires:new Date(e.params.expires)}:a._authToken=null,a.onLogin&&a.onLogin(e.code,e.text))},this._connection.onMessage=function(e){if(e)if(a._inPacketCount++,a.onRawMessage&&a.onRawMessage(e),"0"!==e){var t=JSON.parse(e,w);t?(a.logger("in: "+(a._trimLongStrings?JSON.stringify(t,b):e)),a.onMessage&&a.onMessage(t),t.ctrl?(a.onCtrlMessage&&a.onCtrlMessage(t.ctrl),t.ctrl.id&&g(t.ctrl.id,t.ctrl.code,t.ctrl,t.ctrl.text),setTimeout(function(){if(205==t.ctrl.code&&"evicted"==t.ctrl.text){var e=u("topic",t.ctrl.topic);e&&e._resetSub()}else if(t.ctrl.params&&"data"==t.ctrl.params.what){var n=u("topic",t.ctrl.topic);n&&n._allMessagesReceived(t.ctrl.params.count)}else if(t.ctrl.params&&"sub"==t.ctrl.params.what){var i=u("topic",t.ctrl.topic);i&&i._processMetaSub([])}},0)):setTimeout(function(){if(t.meta){var e=u("topic",t.meta.topic);e&&e._routeMeta(t.meta),t.meta.id&&g(t.meta.id,200,t.meta,"META"),a.onMetaMessage&&a.onMetaMessage(t.meta)}else if(t.data){var n=u("topic",t.data.topic);n&&n._routeData(t.data),a.onDataMessage&&a.onDataMessage(t.data)}else if(t.pres){var i=u("topic",t.pres.topic);i&&i._routePres(t.pres),a.onPresMessage&&a.onPresMessage(t.pres)}else if(t.info){var s=u("topic",t.info.topic);s&&s._routeInfo(t.info),a.onInfoMessage&&a.onInfoMessage(t.info)}else a.logger("ERROR: Unknown packet received.")},0)):(a.logger("in: "+e),a.logger("ERROR: failed to parse data"))}else a.onNetworkProbe&&a.onNetworkProbe()},this._connection.onOpen=function(){a.hello()},this._connection.onAutoreconnectIteration=function(e,t){a.onAutoreconnectIteration&&a.onAutoreconnectIteration(e,t)},this._connection.onDisconnect=function(e,t){for(var n in a._inPacketCount=0,a._serverInfo=null,a._authenticated=!1,p(function(e,t){0===t.lastIndexOf("topic:",0)&&e._resetSub()}),a._pendingPromises){var i=a._pendingPromises[n];i&&i.reject&&i.reject(e)}a._pendingPromises={},a.onDisconnect&&a.onDisconnect(e)}};y.credential=function(e,t,n,i){if("object"==s(e)){var r=e;t=r.val,n=r.params,i=r.resp,e=r.meth}return e&&(t||i)?[{meth:e,val:t,resp:i,params:n}]:null},y.topicType=function(e){return{me:"me",fnd:"fnd",grp:"grp",new:"grp",usr:"p2p",sys:"sys"}["string"==typeof e?e.substring(0,3):"xxx"]},y.isNewGroupTopicName=function(e){return"string"==typeof e&&"new"==e.substring(0,3)},y.getVersion=function(){return h},y.setNetworkProviders=function(e,t){o=wsprovider,a=xhrprovider},y.getLibrary=function(){return l},y.MESSAGE_STATUS_NONE=0,y.MESSAGE_STATUS_QUEUED=1,y.MESSAGE_STATUS_SENDING=2,y.MESSAGE_STATUS_FAILED=3,y.MESSAGE_STATUS_SENT=4,y.MESSAGE_STATUS_RECEIVED=5,y.MESSAGE_STATUS_READ=6,y.MESSAGE_STATUS_TO_ME=7,y.DEL_CHAR="\u2421",y.isNullValue=function(e){return e===y.DEL_CHAR},y.prototype={connect:function(e){return this._connection.connect(e)},reconnect:function(e){this._connection.reconnect(e)},disconnect:function(){this._connection.disconnect()},networkProbe:function(){this._connection.probe()},isConnected:function(){return this._connection.isConnected()},isAuthenticated:function(){return this._authenticated},account:function(e,t,n,i,s){var r=this.initPacket("acc");return r.acc.user=e,r.acc.scheme=t,r.acc.secret=n,r.acc.login=i,s&&(r.acc.desc.defacs=s.defacs,r.acc.desc.public=s.public,r.acc.desc.private=s.private,r.acc.tags=s.tags,r.acc.cred=s.cred,r.acc.token=s.token),this.send(r,r.acc.id)},createAccount:function(e,t,n,i){var s=this,r=this.account("new",e,t,n,i);return n&&(r=r.then(function(e){return s.loginSuccessful(e),e})),r},createAccountBasic:function(e,t,n){return e=e||"",t=t||"",this.createAccount("basic",v(e+":"+t),!0,n)},updateAccountBasic:function(e,t,n,i){return t=t||"",n=n||"",this.account(e,"basic",v(t+":"+n),!1,i)},hello:function(){var e=this,t=this.initPacket("hi");return this.send(t,t.hi.id).then(function(t){return e._connection.backoffReset(),t.params&&(e._serverInfo=t.params),e.onConnect&&e.onConnect(),t}).catch(function(t){e._connection.reconnect(!0),e.onDisconnect&&e.onDisconnect(t)})},setDeviceToken:function(e,t){var n=!1;return e&&e!=this._deviceToken&&(this._deviceToken=e,t&&this.isConnected()&&this.isAuthenticated()&&(this.send({hi:{dev:e}}),n=!0)),n},login:function(e,t,n){var i=this,s=this.initPacket("login");return s.login.scheme=e,s.login.secret=t,s.login.cred=n,this.send(s,s.login.id).then(function(e){return i.loginSuccessful(e),e})},loginBasic:function(e,t,n){var i=this;return this.login("basic",v(e+":"+t),n).then(function(t){return i._login=e,t})},loginToken:function(e,t){return this.login("token",e,t)},requestResetAuthSecret:function(e,t,n){return this.login("reset",v(e+":"+t+":"+n))},getAuthToken:function(){return this._authToken&&this._authToken.expires.getTime()>Date.now()?this._authToken:(this._authToken=null,null)},setAuthToken:function(e){this._authToken=e},subscribe:function(e,t,n){var i=this.initPacket("sub",e);return e||(e="new"),i.sub.get=t,n&&(n.sub&&(i.sub.set.sub=n.sub),n.desc&&(y.isNewGroupTopicName(e)?i.sub.set.desc=n.desc:"p2p"==y.topicType(e)&&n.desc.defacs&&(i.sub.set.desc={defacs:n.desc.defacs})),n.tags&&(i.sub.set.tags=n.tags)),this.send(i,i.sub.id)},leave:function(e,t){var n=this.initPacket("leave",e);return n.leave.unsub=t,this.send(n,n.leave.id)},createMessage:function(e,t,n){var i=this.initPacket("pub",e),s="string"==typeof t?r.parse(t):t;return s&&!r.isPlainText(s)&&(i.pub.head={mime:r.getContentType()},t=s),i.pub.noecho=n,i.pub.content=t,i.pub},publish:function(e,t,n){return this.publishMessage(this.createMessage(e,t,n))},publishMessage:function(e){return(e=Object.assign({},e)).seq=void 0,e.from=void 0,e.ts=void 0,this.send2({pub:e},e.id,1)},getMeta:function(e,t){var n=this.initPacket("get",e);return n.get=_(n.get,t),this.send(n,n.get.id)},setMeta:function(e,t){var n=this.initPacket("set",e),i=[];return t&&["desc","sub","tags","cred"].map(function(e){t.hasOwnProperty(e)&&(i.push(e),n.set[e]=t[e])}),0==i.length?Promise.reject(new Error("Invalid {set} parameters")):this.send(n,n.set.id)},delMessages:function(e,t,n){var i=this.initPacket("del",e);return i.del.what="msg",i.del.delseq=t,i.del.hard=n,this.send(i,i.del.id)},delTopic:function(e){var t=this,n=this.initPacket("del",e);return n.del.what="topic",this.send(n,n.del.id).then(function(n){return t.cacheDel("topic",e),t.ctrl})},delSubscription:function(e,t){var n=this.initPacket("del",e);return n.del.what="sub",n.del.user=t,this.send(n,n.del.id)},delCredential:function(e,t,n){if("me"!=e)throw new Error("Invalid topic for deleting credentials '"+e+"'");var i=this.initPacket("del",e);return i.del.what="cred",i.del.cred={meth:t,val:n},this.send(i,i.del.id)},note:function(e,t,n){if(n<=0||n>=268435455)throw new Error("Invalid message id "+n);var i=this.initPacket("note",e);i.note.what=t,i.note.seq=n,this.send(i)},noteKeyPress:function(e){var t=this.initPacket("note",e);t.note.what="kp",this.send(t)},getTopic:function(e){var t=this.cacheGet("topic",e);return!t&&e&&(t="me"==e?new E:"fnd"==e?new R:new D(e),this.cachePut("topic",e,t),this.attachCacheToTopic(t)),t},newTopic:function(e){var t=new D("new",e);return this.attachCacheToTopic(t),t},newGroupTopicName:function(){return"new"+this.getNextUniqueId()},newTopicWith:function(e,t){var n=new D(e,t);return this.attachCacheToTopic(n),n},getMeTopic:function(){return this.getTopic("me")},getFndTopic:function(){return this.getTopic("fnd")},getLargeFileHelper:function(){return new A(this)},getCurrentUserID:function(){return this._myUID},isMe:function(e){return this._myUID===e},getCurrentLogin:function(){return this._login},getServerInfo:function(){return this._serverInfo},enableLogging:function(e,t){this._loggingEnabled=e,this._trimLongStrings=e&&t},isTopicOnline:function(e){var t=this.getMeTopic(),n=t&&t.getContact(e);return n&&n.online},wantAkn:function(e){this._messageId=e?Math.floor(16777215*Math.random()+16777215):0},onWebsocketOpen:void 0,onConnect:void 0,onDisconnect:void 0,onLogin:void 0,onCtrlMessage:void 0,onDataMessage:void 0,onPresMessage:void 0,onMessage:void 0,onRawMessage:void 0,onNetworkProbe:void 0,onAutoreconnectIteration:void 0};var x=function(e){this.topic=e;var t=e._tinode.getMeTopic();this.contact=t&&t.getContact(e.name),this.what={}};x.prototype={_get_ims:function(){var e=this.contact&&this.contact.updated,t=this.topic._lastDescUpdate||0;return e>t?e:t},withData:function(e,t,n){return this.what.data={since:e,before:t,limit:n},this},withLaterData:function(e){return this.withData(this.topic._maxSeq>0?this.topic._maxSeq+1:void 0,void 0,e)},withEarlierData:function(e){return this.withData(void 0,this.topic._minSeq>0?this.topic._minSeq:void 0,e)},withDesc:function(e){return this.what.desc={ims:e},this},withLaterDesc:function(){return this.withDesc(this._get_ims())},withSub:function(e,t,n){var i={ims:e,limit:t};return"me"==this.topic.getType()?i.topic=n:i.user=n,this.what.sub=i,this},withOneSub:function(e,t){return this.withSub(e,void 0,t)},withLaterOneSub:function(e){return this.withOneSub(this.topic._lastSubsUpdate,e)},withLaterSub:function(e){return this.withSub("p2p"==this.topic.getType()?this._get_ims():this.topic._lastSubsUpdate,e)},withTags:function(){return this.what.tags=!0,this},withCred:function(){return"me"==this.topic.getType()?this.what.cred=!0:this.topic._tinode.logger("ERROR: Invalid topic type for MetaGetBuilder:withCreds",this.topic.getType()),this},withDel:function(e,t){return(e||t)&&(this.what.del={since:e,limit:t}),this},withLaterDel:function(e){return this.withDel(this.topic._maxSeq>0?this.topic._maxDel+1:void 0,e)},build:function(){var e=[],t=this,n={};return["data","sub","desc","tags","cred","del"].map(function(i){t.what.hasOwnProperty(i)&&(e.push(i),Object.getOwnPropertyNames(t.what[i]).length>0&&(n[i]=t.what[i]))}),e.length>0?n.what=e.join(" "):n=void 0,n}};var T=function e(t){t&&(this.given="number"==typeof t.given?t.given:e.decode(t.given),this.want="number"==typeof t.want?t.want:e.decode(t.want),this.mode=t.mode?"number"==typeof t.mode?t.mode:e.decode(t.mode):this.given&this.want)};T._NONE=0,T._JOIN=1,T._READ=2,T._WRITE=4,T._PRES=8,T._APPROVE=16,T._SHARE=32,T._DELETE=64,T._OWNER=128,T._BITMASK=T._JOIN|T._READ|T._WRITE|T._PRES|T._APPROVE|T._SHARE|T._DELETE|T._OWNER,T._INVALID=1048576,T._checkFlag=function(e,t,n){if(["given","want","mode"].includes(t=t||"mode"))return 0!=(e[t]&n);throw new Error("Invalid AccessMode component '"+t+"'")},T.decode=function(e){if(!e)return null;if("number"==typeof e)return e&T._BITMASK;if("N"===e||"n"===e)return T._NONE;for(var t={J:T._JOIN,R:T._READ,W:T._WRITE,P:T._PRES,A:T._APPROVE,S:T._SHARE,D:T._DELETE,O:T._OWNER},n=T._NONE,i=0;i<e.length;i++){var s=t[e.charAt(i).toUpperCase()];s&&(n|=s)}return n},T.encode=function(e){if(null===e||e===T._INVALID)return null;if(e===T._NONE)return"N";for(var t=["J","R","W","P","A","S","D","O"],n="",i=0;i<t.length;i++)0!=(e&1<<i)&&(n+=t[i]);return n},T.update=function(e,t){if(!t||"string"!=typeof t)return e;var n=t.charAt(0);if("+"==n||"-"==n){for(var i=e,s=t.split(/([-+])/),r=1;r<s.length-1;r+=2){n=s[r];var o=T.decode(s[r+1]);if(o==T._INVALID)return e;null!=o&&("+"===n?i|=o:"-"===n&&(i&=~o))}e=i}else{var a=T.decode(t);a!=T._INVALID&&(e=a)}return e},T.prototype={toString:function(){return'{"mode": "'+T.encode(this.mode)+'", "given": "'+T.encode(this.given)+'", "want": "'+T.encode(this.want)+'"}'},jsonHelper:function(){return{mode:T.encode(this.mode),given:T.encode(this.given),want:T.encode(this.want)}},setMode:function(e){return this.mode=T.decode(e),this},updateMode:function(e){return this.mode=T.update(this.mode,e),this},getMode:function(){return T.encode(this.mode)},setGiven:function(e){return this.given=T.decode(e),this},updateGiven:function(e){return this.given=T.update(this.given,e),this},getGiven:function(){return T.encode(this.given)},setWant:function(e){return this.want=T.decode(e),this},updateWant:function(e){return this.want=T.update(this.want,e),this},getWant:function(){return T.encode(this.want)},getMissing:function(){return T.encode(this.want&~this.given)},getExcessive:function(){return T.encode(this.given&~this.want)},updateAll:function(e){return e&&(this.updateGiven(e.given),this.updateWant(e.want),this.mode=this.given&this.want),this},isOwner:function(e){return T._checkFlag(this,e,T._OWNER)},isPresencer:function(e){return T._checkFlag(this,e,T._PRES)},isMuted:function(e){return!this.isPresencer(e)},isJoiner:function(e){return T._checkFlag(this,e,T._JOIN)},isReader:function(e){return T._checkFlag(this,e,T._READ)},isWriter:function(e){return T._checkFlag(this,e,T._WRITE)},isApprover:function(e){return T._checkFlag(this,e,T._APPROVE)},isAdmin:function(e){return this.isOwner(e)||this.isApprover(e)},isSharer:function(e){return this.isAdmin(e)||T._checkFlag(this,e,T._SHARE)},isDeleter:function(e){return T._checkFlag(this,e,T._DELETE)}};var D=function(e,t){this._tinode=null,this.name=e,this.created=null,this.updated=null,this.touched=null,this.acs=new T(null),this.private=null,this.public=null,this._users={},this._queuedSeqId=268435455,this._maxSeq=0,this._minSeq=0,this._noEarlierMsgs=!1,this._maxDel=0,this._tags=[],this._credentials=[],this._messages=function(e,t){var n=[];function i(t,n,i){for(var s=0,r=n.length-1,o=0,a=0,c=!1;s<=r;)if((a=e(n[o=(s+r)/2|0],t))<0)s=o+1;else{if(!(a>0)){c=!0;break}r=o-1}return c?{idx:o,exact:!0}:i?{idx:-1}:{idx:a<0?o+1:o}}return e=e||function(e,t){return e===t?0:e<t?-1:1},{getAt:function(e){return n[e]},getLast:function(){return n.length>0?n[n.length-1]:void 0},put:function(){var e,t,s,r,o;for(var a in e=1==arguments.length&&Array.isArray(arguments[0])?arguments[0]:arguments)void 0,void 0,o=(r=i(t=e[a],s=n,!1)).exact?1:0,s.splice(r.idx,o,t)},delAt:function(e){var t=n.splice(e,1);if(t&&t.length>0)return t[0]},delRange:function(e,t){return n.splice(e,t-e)},length:function(){return n.length},reset:function(){n=[]},forEach:function(e,t,i,s){t|=0,i=i||n.length;for(var r=t;r<i;r++)e.call(s,n[r],r)},find:function(e,t){return i(e,n,!t).idx}}}(function(e,t){return e.seq-t.seq}),this._subscribed=!1,this._lastDescUpdate=null,this._lastSubsUpdate=null,this._new=!0,t&&(this.onData=t.onData,this.onMeta=t.onMeta,this.onPres=t.onPres,this.onInfo=t.onInfo,this.onMetaDesc=t.onMetaDesc,this.onMetaSub=t.onMetaSub,this.onSubsUpdated=t.onSubsUpdated,this.onTagsUpdated=t.onTagsUpdated,this.onCredsUpdated=callbacls.onCredsUpdated,this.onDeleteTopic=t.onDeleteTopic,this.onAllMessagesReceived=t.onAllMessagesReceived)};D.prototype={isSubscribed:function(){return this._subscribed},subscribe:function(e,t){var n=this;return this._subscribed?Promise.resolve(this):this._tinode.subscribe(this.name||"new",e,t).then(function(e){if(e.code>=300)return e;if(n._subscribed=!0,n.acs=e.params&&e.params.acs?e.params.acs:n.acs,n._new){if(n._new=!1,n.name=e.topic,n.created=e.ts,n.updated=e.ts,n._cachePutSelf(),"me"!=n.name&&"fnd"!=n.name){var i=n._tinode.getMeTopic();i&&i._processMetaSub([{_noForwarding:!0,topic:n.name,created:e.ts,updated:e.ts,acs:n.acs}])}t&&t.desc&&(t.desc._noForwarding=!0,n._processMetaDesc(t.desc))}return e})},createMessage:function(e,t){return this._tinode.createMessage(this.name,e,t)},publish:function(e,t){return this.publishMessage(this.createMessage(e,t))},publishMessage:function(e){var t=this;if(!this._subscribed)return Promise.reject(new Error("Cannot publish on inactive topic"));if(r.hasAttachments(e.content)&&!e.head.attachments){var n=[];r.attachments(e.content,function(e){n.push(e.ref)}),e.head.attachments=n}return e._sending=!0,e._failed=!1,this._tinode.publishMessage(e).then(function(n){return e._sending=!1,e.ts=n.ts,t.swapMessageId(e,n.params.seq),t._routeData(e),n}).catch(function(n){t._tinode.logger("WARNING: Message rejected by the server",n),e._sending=!1,e._failed=!0,t.onData&&t.onData()})},publishDraft:function(e,t){var n=this;if(!t&&!this._subscribed)return Promise.reject(new Error("Cannot publish on inactive topic"));var i=e.seq||this._getQueuedSeqId();return e._noForwarding||(e._noForwarding=!0,e.seq=i,e.ts=new Date,e.from=this._tinode.getCurrentUserID(),e.noecho=!0,this._messages.put(e),this.onData&&this.onData(e)),(t||Promise.resolve()).then(function(){return e._cancelled?{code:300,text:"cancelled"}:n.publishMessage(e)},function(t){n._tinode.logger("WARNING: Message draft rejected by the server",t),e._sending=!1,e._failed=!0,n._messages.delAt(n._messages.find(e)),n.onData&&n.onData()})},leave:function(e){var t=this;return this._subscribed||e?this._tinode.leave(this.name,e).then(function(n){return t._resetSub(),e&&t._gone(),n}):Promise.reject(new Error("Cannot leave inactive topic"))},getMeta:function(e){return this._tinode.getMeta(this.name,e)},getMessagesPage:function(e,t){var n=this,i=this.startMetaQuery();t?i.withLaterData(e):i.withEarlierData(e);var s=this.getMeta(i.build());return t||(s=s.then(function(e){e&&e.params&&!e.params.count&&(n._noEarlierMsgs=!0)})),s},setMeta:function(e){var t=this;return e.tags&&(e.tags=function(e){var t=[];if(Array.isArray(e)){for(var n=0,i=e.length;n<i;n++){var s=e[n];s&&(s=s.trim().toLowerCase()).length>1&&t.push(s)}t.sort().filter(function(e,t,n){return!t||e!=n[t-1]})}return 0==t.length&&t.push(y.DEL_CHAR),t}(e.tags)),this._tinode.setMeta(this.name,e).then(function(n){return n&&n.code>=300?n:(e.sub&&(n.params&&n.params.acs&&(e.sub.acs=n.params.acs,e.sub.updated=n.ts),e.sub.user||(e.sub.user=t._tinode.getCurrentUserID(),e.desc||(e.desc={})),e.sub._noForwarding=!0,t._processMetaSub([e.sub])),e.desc&&(n.params&&n.params.acs&&(e.desc.acs=n.params.acs,e.desc.updated=n.ts),t._processMetaDesc(e.desc)),e.tags&&t._processMetaTags(e.tags),e.cred&&t._processMetaCreds([e.cred],!0),n)})},updateMode:function(e,t){var n,i=e?(function(e){throw new Error('"user" is read-only')}(),i=this.subscriber(e)):null;return n=i?i.acs.updateGiven(t).getGiven():topic.getAccessMode().updateWant(t).getWant(),topic.setMeta({sub:{user:e,mode:n}})},invite:function(e,t){return this.setMeta({sub:{user:e,mode:t}})},archive:function(e){return this.private&&this.private.arch==e?Promise.resolve(e):this.setMeta({desc:{private:{arch:!!e||y.DEL_CHAR}}})},delMessages:function(e,t){var n=this;if(!this._subscribed)return Promise.reject(new Error("Cannot delete messages in inactive topic"));e.sort(function(e,t){return e.low<t.low||e.low==t.low&&(!t.hi||e.hi>=t.hi)});var i=e.reduce(function(e,t){return t.low<268435455&&(!t.hi||t.hi<268435455?e.push(t):e.push({low:t.low,hi:n._maxSeq+1})),e},[]);return(i.length>0?this._tinode.delMessages(this.name,i,t):Promise.resolve({params:{del:0}})).then(function(t){return t.params.del>n._maxDel&&(n._maxDel=t.params.del),e.map(function(e){e.hi?n.flushMessageRange(e.low,e.hi):n.flushMessage(e.low)}),n._updateDeletedRanges(),n.onData&&n.onData(),t})},delMessagesAll:function(e){return!this._maxSeq||this._maxSeq<=0?Promise.resolve():this.delMessages([{low:1,hi:this._maxSeq+1,_all:!0}],e)},delMessagesList:function(e,t){e.sort(function(e,t){return e-t});var n=e.reduce(function(e,t){if(0==e.length)e.push({low:t});else{var n=e[e.length-1];!n.hi&&t!=n.low+1||t>n.hi?e.push({low:t}):n.hi=n.hi?Math.max(n.hi,t+1):t+1}return e},[]);return this.delMessages(n,t)},delTopic:function(){var e=this;return this._tinode.delTopic(this.name).then(function(t){return e._resetSub(),e._gone(),t})},delSubscription:function(e){var t=this;return this._subscribed?this._tinode.delSubscription(this.name,e).then(function(n){return delete t._users[e],t.onSubsUpdated&&t.onSubsUpdated(Object.keys(t._users)),n}):Promise.reject(new Error("Cannot delete subscription in inactive topic"))},note:function(e,t){var n=this._users[this._tinode.getCurrentUserID()];n?(!n[e]||n[e]<t)&&(this._subscribed?this._tinode.note(this.name,e,t):this._tinode.logger("INFO: Not sending {note} on inactive topic"),n[e]=t):this._tinode.logger("ERROR: note(): user not found "+this._tinode.getCurrentUserID());var i=this._tinode.getMeTopic();i&&i.setMsgReadRecv(this.name,e,t)},noteRecv:function(e){this.note("recv",e)},noteRead:function(e){this.note("read",e)},noteKeyPress:function(){this._subscribed?this._tinode.noteKeyPress(this.name):this._tinode.logger("INFO: Cannot send notification in inactive topic")},userDesc:function(e){var t=this._cacheGetUser(e);if(t)return t},p2pPeerDesc:function(){if("p2p"==this.getType())return this._users[this.name]},subscribers:function(e,t){var n=e||this.onMetaSub;if(n)for(var i in this._users)n.call(t,this._users[i],i,this._users)},tags:function(){return this._tags.slice(0)},subscriber:function(e){return this._users[e]},messages:function(e,t,n,i){var s=e||this.onData;if(s){var r="number"==typeof t?this._messages.find({seq:t},!0):void 0,o="number"==typeof n?this._messages.find({seq:n},!0):void 0;-1!=r&&-1!=o&&this._messages.forEach(s,r,o,i)}},queuedMessages:function(e,t){if(!e)throw new Error("Callback must be provided");this.messages(e,268435455,void 0,t)},msgReceiptCount:function(e,t){var n=0;if(t>0){var i=this._tinode.getCurrentUserID();for(var s in this._users){var r=this._users[s];r.user!==i&&r[e]>=t&&n++}}return n},msgReadCount:function(e){return this.msgReceiptCount("read",e)},msgRecvCount:function(e){return this.msgReceiptCount("recv",e)},msgHasMoreMessages:function(e){return e?this.seq>this._maxSeq:this._minSeq>1&&!this._noEarlierMsgs},isNewMessage:function(e){return this._maxSeq<=e},flushMessage:function(e){var t=this._messages.find({seq:e});return t>=0?this._messages.delAt(t):void 0},swapMessageId:function(e,t){var n=this._messages.find({seq:e.seq}),i=this._messages.length();e.seq=t,0<=n&&n<i&&(n>0&&this._messages.getAt(n-1).seq>=t||n+1<i&&t<this._messages.getAt(n+1).seq<=t)&&(this._messages.delAt(n),this._messages.put(e))},flushMessageRange:function(e,t){var n=this._messages.find({seq:e},!0);return n>=0?this._messages.delRange(n,this._messages.find({seq:t},!0)):[]},cancelSend:function(e){var t=this._messages.find({seq:e});if(t>=0){var n=this._messages.getAt(t),i=this.msgStatus(n);if(1==i||3==i)return n._cancelled=!0,this._messages.delAt(t),this.onData&&this.onData(),!0}return!1},getType:function(){return y.topicType(this.name)},getAccessMode:function(){return this.acs},getDefaultAccess:function(){return this.defacs},startMetaQuery:function(){return new x(this)},isArchived:function(){return!(!this.private||!this.private.arch)},msgStatus:function(e){var t=0;return this._tinode.isMe(e.from)?e._sending?t=2:e._failed?t=3:e.seq>=268435455?t=1:this.msgReadCount(e.seq)>0?t=6:this.msgRecvCount(e.seq)>0?t=5:e.seq>0&&(t=4):t=7,t},_routeData:function(e){e.content&&(!this.touched||this.touched<e.ts)&&(this.touched=e.ts),e._noForwarding||(this._messages.put(e),this._updateDeletedRanges()),e.seq>this._maxSeq&&(this._maxSeq=e.seq),(e.seq<this._minSeq||0==this._minSeq)&&(this._minSeq=e.seq),this.onData&&this.onData(e);var t=this._tinode.getMeTopic();t&&t.setMsgReadRecv(this.name,!e.from||this._tinode.isMe(e.from)?"read":"msg",e.seq,e.ts)},_routeMeta:function(e){e.desc&&(this._lastDescUpdate=e.ts,this._processMetaDesc(e.desc)),e.sub&&e.sub.length>0&&(this._lastSubsUpdate=e.ts,this._processMetaSub(e.sub)),e.del&&this._processDelMessages(e.del.clear,e.del.delseq),e.tags&&this._processMetaTags(e.tags),e.cred&&this._processMetaCreds(e.cred),this.onMeta&&this.onMeta(e)},_routePres:function(e){var t;switch(e.what){case"del":this._processDelMessages(e.clear,e.delseq);break;case"on":case"off":(t=this._users[e.src])?t.online="on"==e.what:this._tinode.logger("WARNING: Presence update for an unknown user",this.name,e.src);break;case"term":this._resetSub();break;case"acs":if(t=this._users[e.src])t.acs.updateAll(e.dacs),this._processMetaSub([{user:e.src,updated:new Date,acs:t.acs}]);else{var n=(new T).updateAll(e.dacs);n&&n.mode!=T._NONE&&((t=this._cacheGetUser(e.src))?t.acs=n:(t={user:e.src,acs:n},this.getMeta(this.startMetaQuery().withOneSub(void 0,e.src).build())),t.updated=new Date,this._processMetaSub([t]))}break;default:this._tinode.logger("INFO: Ignored presence update",e.what)}this.onPres&&this.onPres(e)},_routeInfo:function(e){if("kp"!==e.what){var t=this._users[e.from];if(t&&(t[e.what]=e.seq,t.recv<t.read&&(t.recv=t.read)),this._tinode.isMe(e.from)){var n=this._tinode.getMeTopic();n&&n.setMsgReadRecv(e.topic,e.what,e.seq)}}this.onInfo&&this.onInfo(e)},_processMetaDesc:function(e){if("p2p"==this.getType()&&delete e.defacs,_(this,e),"string"==typeof this.created&&(this.created=new Date(this.created)),"string"==typeof this.updated&&(this.updated=new Date(this.updated)),"string"==typeof this.touched&&(this.touched=new Date(this.touched)),"me"!==this.name&&!e._noForwarding){var t=this._tinode.getMeTopic();t&&t._processMetaSub([{_noForwarding:!0,topic:this.name,updated:this.updated,touched:this.touched,acs:e.acs,seq:e.seq,read:e.read,recv:e.recv,public:e.public,private:e.private}])}this.onMetaDesc&&this.onMetaDesc(this)},_processMetaSub:function(e){for(var t in e){var n=e[t];n.updated=new Date(n.updated),n.deleted=n.deleted?new Date(n.deleted):null;var i=null;n.deleted?(delete this._users[n.user],i=n):(this._tinode.isMe(n.user)&&n.acs&&this._processMetaDesc({updated:n.updated||new Date,touched:n.updated,acs:n.acs}),i=this._updateCachedUser(n.user,n)),this.onMetaSub&&this.onMetaSub(i)}this.onSubsUpdated&&this.onSubsUpdated(Object.keys(this._users))},_processMetaTags:function(e){1==e.length&&e[0]==y.DEL_CHAR&&(e=[]),this._tags=e,this.onTagsUpdated&&this.onTagsUpdated(e)},_processMetaCreds:function(e){},_processDelMessages:function(e,t){this._maxDel=Math.max(e,this._maxDel),this.clear=Math.max(e,this.clear);var n=this,i=0;Array.isArray(t)&&t.map(function(e){if(e.hi)for(var t=e.low;t<e.hi;t++)i++,n.flushMessage(t);else i++,n.flushMessage(e.low)}),i>0&&(this._updateDeletedRanges(),this.onData&&this.onData())},_allMessagesReceived:function(e){this._updateDeletedRanges(),this.onAllMessagesReceived&&this.onAllMessagesReceived(e)},_resetSub:function(){this._subscribed=!1},_gone:function(){this._messages.reset(),this._users={},this.acs=new T(null),this.private=null,this.public=null,this._maxSeq=0,this._minSeq=0,this._subscribed=!1;var e=this._tinode.getMeTopic();e&&e._routePres({_noForwarding:!0,what:"gone",topic:"me",src:this.name}),this.onDeleteTopic&&this.onDeleteTopic()},_updateCachedUser:function(e,t){var n=this._cacheGetUser(e);return n=_(n||{},t),this._cachePutUser(e,n),m(this._users,e,n)},_getQueuedSeqId:function(){return this._queuedSeqId++},_updateDeletedRanges:function(){var e=this,t=[],n=null,i=this._messages.getAt(0);i&&this._minSeq>1&&!this._noEarlierMsgs?i.hi?(i.seq>1&&(i.seq=1),i.hi<this._minSeq-1&&(i.hi=this._minSeq-1),n=i):(n={seq:1,hi:this._minSeq-1},t.push(n)):n={seq:0,hi:0},this._messages.forEach(function(e){e.seq>=268435455||(e.seq!=(n.hi||n.seq)+1?n.hi?n.hi=e.hi||e.seq:(n={seq:(n.hi||n.seq)+1,hi:e.hi||e.seq},t.push(n)):n=e)});var s=this._messages.getLast(),r=Math.max(this.seq,this._maxSeq);(!s||s&&(s.hi||s.seq)<r)&&(s&&s.hi?s.hi=r:t.push({seq:s?s.seq+1:1,hi:r})),t.map(function(t){e._messages.put(t)})}};var E=function(e){D.call(this,"me",e),this._contacts={},e&&(this.onContactUpdate=e.onContactUpdate)};E.prototype=Object.create(D.prototype,{_processMetaSub:{value:function(e){var t=0;for(var n in e){var i=e[n],s=i.topic;if("fnd"!=s&&"me"!=s){i.updated=new Date(i.updated),i.touched=i.touched?new Date(i.touched):void 0,i.deleted=i.deleted?new Date(i.deleted):null;var r=null;if(i.deleted)r=i,delete this._contacts[s];else if(i.acs&&!i.acs.isJoiner())(r=i).deleted=new Date,delete this._contacts[s];else if(void 0!==i.seq&&(i.seq=0|i.seq,i.recv=0|i.recv,i.read=0|i.read,i.unread=i.seq-i.read),i.seen&&i.seen.when&&(i.seen.when=new Date(i.seen.when)),r=m(this._contacts,s,i),"p2p"==y.topicType(s)&&this._cachePutUser(s,r),!i._noForwarding){var o=this._tinode.getTopic(s);o&&(i._noForwarding=!0,o._processMetaDesc(i))}t++,this.onMetaSub&&this.onMetaSub(r)}}this.onSubsUpdated&&this.onSubsUpdated(Object.keys(this._contacts),t)},enumerable:!0,configurable:!0,writable:!1},_processMetaCreds:{value:function(e,t){var n=this;1==e.length&&e[0]==y.DEL_CHAR&&(e=[]),t?e.map(function(e){if(e.val){var t=n._credentials.findIndex(function(t){return t.meth==e.meth&&t.val==e.val});t<0?(e.done||(t=n._credentials.findIndex(function(t){return t.meth==e.meth&&!t.done}))>=0&&n._credentials.splice(t,1),n._credentials.push(e)):n._credentials[t].done=e.done}else if(e.resp){var i=n._credentials.findIndex(function(t){return t.meth==e.meth&&!t.done});i>=0&&(n._credentials[i].done=!0)}}):this._credentials=e,this.onCredsUpdated&&this.onCredsUpdated(this._credentials)},enumerable:!0,configurable:!0,writable:!1},_routePres:{value:function(e){if("term"!=e.what)if("upd"!=e.what||"me"!=e.src){var t=this._contacts[e.src];if(t){switch(e.what){case"on":t.online=!0;break;case"off":t.online&&(t.online=!1,t.seen?t.seen.when=new Date:t.seen={when:new Date});break;case"msg":t.touched=new Date,t.seq=0|e.seq,e.act&&!this._tinode.isMe(e.act)||(t.read=t.read?Math.max(t.read,t.seq):t.seq,t.recv=t.recv?Math.max(t.read,t.recv):t.recv),t.unread=t.seq-t.read;break;case"upd":this.getMeta(this.startMetaQuery().withLaterOneSub(e.src).build());break;case"acs":t.acs?t.acs.updateAll(e.dacs):t.acs=(new T).updateAll(e.dacs),t.touched=new Date;break;case"ua":t.seen={when:new Date,ua:e.ua};break;case"recv":e.seq=0|e.seq,t.recv=t.recv?Math.max(t.recv,e.seq):e.seq;break;case"read":e.seq=0|e.seq,t.read=t.read?Math.max(t.read,e.seq):e.seq,t.recv=t.recv?Math.max(t.read,t.recv):t.recv,t.unread=t.seq-t.read;break;case"gone":delete this._contacts[e.src];break;case"del":break;default:this._tinode.logger("INFO: Unsupported presence update in 'me'",e.what)}this.onContactUpdate&&this.onContactUpdate(e.what,t)}else if("acs"==e.what){var n=new T(e.dacs);if(!n||n.mode==T._INVALID)return void this._tinode.logger("ERROR: Invalid access mode update",e.src,e.dacs);if(n.mode==T._NONE)return void this._tinode.logger("WARNING: Removing non-existent subscription",e.src,e.dacs);this.getMeta(this.startMetaQuery().withOneSub(void 0,e.src).build()),this._contacts[e.src]={touched:new Date,topic:e.src,online:!1,acs:n}}else"tags"==e.what&&this.getMeta(this.startMetaQuery().withTags().build());this.onPres&&this.onPres(e)}else this.getMeta(this.startMetaQuery().withDesc().build());else this._resetSub()},enumerable:!0,configurable:!0,writable:!1},publish:{value:function(){return Promise.reject(new Error("Publishing to 'me' is not supported"))},enumerable:!0,configurable:!0,writable:!1},delCredential:{value:function(e,t){var n=this;return this._subscribed?this._tinode.delCredential(this.name,e,t).then(function(i){var s=n._credentials.findIndex(function(n){return n.meth==e&&n.val==t});return s>-1&&n._credentials.splice(s,1),n.onCredsUpdated&&n.onCredsUpdated(n._credentials),i}):Promise.reject(new Error("Cannot delete credential in inactive 'me' topic"))},enumerable:!0,configurable:!0,writable:!1},contacts:{value:function(e,t,n){var i=e||this.onMetaSub;if(i)for(var s in this._contacts)(t||this._contacts[s]&&this._contacts[s].acs&&this._contacts[s].acs.isJoiner())&&i.call(n,this._contacts[s],s,this._contacts)},enumerable:!0,configurable:!0,writable:!0},setMsgReadRecv:{value:function(e,t,n,i){var s,r=this._contacts[e],o=!1;if(r){switch(n|=0,r.seq=0|r.seq,r.read=0|r.read,r.recv=0|r.recv,t){case"recv":s=r.recv,r.recv=Math.max(r.recv,n),o=s!=r.recv;break;case"read":s=r.read,r.read=Math.max(r.read,n),o=s!=r.read;break;case"msg":s=r.seq,r.seq=Math.max(r.seq,n),(!r.touched||r.touched<i)&&(r.touched=i),o=s!=r.seq}r.recv<r.read&&(r.recv=r.read,o=!0),r.seq<r.recv&&(r.seq=r.recv,(!r.touched||r.touched<i)&&(r.touched=i),o=!0),r.unread=r.seq-r.read,!o||r.acs&&r.acs.isMuted()||!this.onContactUpdate||this.onContactUpdate(t,r)}},enumerable:!0,configurable:!0,writable:!0},getContact:{value:function(e){return this._contacts[e]},enumerable:!0,configurable:!0,writable:!0},getAccessMode:{value:function(e){var t=this._contacts[e];return t?t.acs:null},enumerable:!0,configurable:!0,writable:!0},isArchived:{value:function(e){var t=this._contacts[e];return t?!(!t.private||!t.private.arch):null},enumerable:!0,configurable:!0,writable:!0},getCredentials:{value:function(){return this._credentials},enumerable:!0,configurable:!0,writable:!0}}),E.prototype.constructor=E;var R=function(e){D.call(this,"fnd",e),this._contacts={}};R.prototype=Object.create(D.prototype,{_processMetaSub:{value:function(e){var t=Object.getOwnPropertyNames(this._contacts).length;for(var n in this._contacts={},e){var i=e[n],s=i.topic?i.topic:i.user;i.updated=new Date(i.updated),i.seen&&i.seen.when&&(i.seen.when=new Date(i.seen.when)),i=m(this._contacts,s,i),t++,this.onMetaSub&&this.onMetaSub(i)}t>0&&this.onSubsUpdated&&this.onSubsUpdated(Object.keys(this._contacts))},enumerable:!0,configurable:!0,writable:!1},publish:{value:function(){return Promise.reject(new Error("Publishing to 'fnd' is not supported"))},enumerable:!0,configurable:!0,writable:!1},setMeta:{value:function(e){var t=this;return Object.getPrototypeOf(R.prototype).setMeta.call(this,e).then(function(){Object.keys(t._contacts).length>0&&(t._contacts={},t.onSubsUpdated&&t.onSubsUpdated([]))})},enumerable:!0,configurable:!0,writable:!1},contacts:{value:function(e,t){var n=e||this.onMetaSub;if(n)for(var i in this._contacts)n.call(t,this._contacts[i],i,this._contacts)},enumerable:!0,configurable:!0,writable:!0}}),R.prototype.constructor=R;var A=function(e){this._tinode=e,this._apiKey=e._apiKey,this._authToken=e.getAuthToken(),this._msgId=e.getNextUniqueId(),this.xhr=new XMLHttpRequest,this.toResolve=null,this.toReject=null,this.onProgress=null,this.onSuccess=null,this.onFailure=null};A.prototype={uploadWithBaseUrl:function(e,t,n,i,s){var r=this;if(!this._authToken)throw new Error("Must authenticate first");var o=this,a="/v"+u+"/file/u/";if(e){if(0!=e.indexOf("http://")&&0!=e.indexOf("https://"))throw new Error("Invalid base URL '"+e+"'");a=e+a}this.xhr.open("POST",a,!0),this.xhr.setRequestHeader("X-Tinode-APIKey",this._apiKey),this.xhr.setRequestHeader("X-Tinode-Auth","Token "+this._authToken.token);var c=new Promise(function(e,t){r.toResolve=e,r.toReject=t});this.onProgress=n,this.onSuccess=i,this.onFailure=s,this.xhr.upload.onprogress=function(e){e.lengthComputable&&o.onProgress&&o.onProgress(e.loaded/e.total)},this.xhr.onload=function(){var e;try{e=JSON.parse(this.response,w)}catch(t){o._tinode.logger("ERROR: Invalid server response in LargeFileHelper",this.response),e={ctrl:{code:this.status,text:this.statusText}}}this.status>=200&&this.status<300?(o.toResolve&&o.toResolve(e.ctrl.params.url),o.onSuccess&&o.onSuccess(e.ctrl)):this.status>=400?(o.toReject&&o.toReject(new Error(e.ctrl.text+" ("+e.ctrl.code+")")),o.onFailure&&o.onFailure(e.ctrl)):o._tinode.logger("ERROR: Unexpected server response status",this.status,this.response)},this.xhr.onerror=function(e){o.toReject&&o.toReject(new Error("failed")),o.onFailure&&o.onFailure(null)},this.xhr.onabort=function(e){o.toReject&&o.toReject(new Error("upload cancelled by user")),o.onFailure&&o.onFailure(null)};try{var h=new FormData;h.append("file",t),h.set("id",this._msgId),this.xhr.send(h)}catch(l){this.toReject&&this.toReject(l),this.onFailure&&this.onFailure(null)}return c},upload:function(e,t,n,i){return this.uploadWithBaseUrl(void 0,e,t,n,i)},download:function(e,t,n,i){var s=this;if(/^\s*([a-z][a-z0-9+.-]*:|\/\/)/im.test(e))throw new Error("The URL '"+e+"' must be relative, not absolute");if(!this._authToken)throw new Error("Must authenticate first");var r=this;this.xhr.open("GET",e,!0),this.xhr.setRequestHeader("X-Tinode-APIKey",this._apiKey),this.xhr.setRequestHeader("X-Tinode-Auth","Token "+this._authToken.token),this.xhr.responseType="blob",this.onProgress=i,this.xhr.onprogress=function(e){r.onProgress&&r.onProgress(e.loaded)};var o=new Promise(function(e,t){s.toResolve=e,s.toReject=t});this.xhr.onload=function(){if(200==this.status){var e=document.createElement("a");e.href=window.URL.createObjectURL(new Blob([this.response],{type:n})),e.style.display="none",e.setAttribute("download",t),document.body.appendChild(e),e.click(),document.body.removeChild(e),window.URL.revokeObjectURL(e.href),r.toResolve&&r.toResolve()}else if(this.status>=400&&r.toReject){var i=new FileReader;i.onload=function(){try{var e=JSON.parse(this.result,w);r.toReject(new Error(e.ctrl.text+" ("+e.ctrl.code+")"))}catch(t){r._tinode.logger("ERROR: Invalid server response in LargeFileHelper",this.result),r.toReject(t)}},i.readAsText(this.response)}},this.xhr.onerror=function(e){r.toReject&&r.toReject(new Error("failed"))},this.xhr.onabort=function(){r.toReject&&r.toReject(null)};try{this.xhr.send()}catch(a){this.toReject&&this.toReject(a)}return o},cancel:function(){this.xhr&&this.xhr.readyState<4&&this.xhr.abort()},getId:function(){return this._msgId}};var k=function e(t,n){this.status=e.STATUS_NONE,this.topic=t,this.content=n};k.STATUS_NONE=0,k.STATUS_QUEUED=1,k.STATUS_SENDING=2,k.STATUS_FAILED=3,k.STATUS_SENT=4,k.STATUS_RECEIVED=5,k.STATUS_READ=6,k.STATUS_TO_ME=7,(k.prototype={toJSON:function(){},fromJSON:function(e){}}).constructor=k,i.exports=y,i.exports.Drafty=r}.call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{}),i=i.exports});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[2,4])(4)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZHJhZnR5LmpzIiwic3JjL3Rpbm9kZS5qcyIsInZlcnNpb24uanNvbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDam1MQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyoqXG4gKiBAY29weXJpZ2h0IDIwMTUtMjAxOSBUaW5vZGVcbiAqIEBzdW1tYXJ5IE1pbmltYWxseSByaWNoIHRleHQgcmVwcmVzZW50YXRpb24gYW5kIGZvcm1hdHRpbmcgZm9yIFRpbm9kZS5cbiAqIEBsaWNlbnNlIEFwYWNoZSAyLjBcbiAqIEB2ZXJzaW9uIDAuMTZcbiAqXG4gKiBAZmlsZSBCYXNpYyBwYXJzZXIgYW5kIGZvcm1hdHRlciBmb3IgdmVyeSBzaW1wbGUgdGV4dCBtYXJrdXAuIE1vc3RseSB0YXJnZXRlZCBhdFxuICogbW9iaWxlIHVzZSBjYXNlcyBzaW1pbGFyIHRvIFRlbGVncmFtLCBXaGF0c0FwcCwgYW5kIEZCIE1lc3Nlbmdlci5cbiAqXG4gKiA8cD5TdXBwb3J0cyBjb252ZXJzaW9uIG9mIHVzZXIga2V5Ym9hcmQgaW5wdXQgdG8gZm9ybWF0dGVkIHRleHQ6PC9wPlxuICogPHVsPlxuICogICA8bGk+KmFiYyogJnJhcnI7IDxiPmFiYzwvYj48L2xpPlxuICogICA8bGk+X2FiY18gJnJhcnI7IDxpPmFiYzwvaT48L2xpPlxuICogICA8bGk+fmFiY34gJnJhcnI7IDxkZWw+YWJjPC9kZWw+PC9saT5cbiAqICAgPGxpPmBhYmNgICZyYXJyOyA8dHQ+YWJjPC90dD48L2xpPlxuICogPC91bD5cbiAqIEFsc28gc3VwcG9ydHMgZm9ybXMgYW5kIGJ1dHRvbnMuXG4gKlxuICogTmVzdGVkIGZvcm1hdHRpbmcgaXMgc3VwcG9ydGVkLCBlLmcuICphYmMgX2RlZl8qIC0+IDxiPmFiYyA8aT5kZWY8L2k+PC9iPlxuICogVVJMcywgQG1lbnRpb25zLCBhbmQgI2hhc2h0YWdzIGFyZSBleHRyYWN0ZWQgYW5kIGNvbnZlcnRlZCBpbnRvIGxpbmtzLlxuICogRm9ybXMgYW5kIGJ1dHRvbnMgY2FuIGJlIGFkZGVkIHByb2NlZHVyYWxseS5cbiAqIEpTT04gZGF0YSByZXByZXNlbnRhdGlvbiBpcyBpbnNwaXJlZCBieSBEcmFmdC5qcyByYXcgZm9ybWF0dGluZy5cbiAqXG4gKlxuICogQGV4YW1wbGVcbiAqIFRleHQ6XG4gKiA8cHJlPlxuICogICAgIHRoaXMgaXMgKmJvbGQqLCBgY29kZWAgYW5kIF9pdGFsaWNfLCB+c3RyaWtlflxuICogICAgIGNvbWJpbmVkICpib2xkIGFuZCBfaXRhbGljXypcbiAqICAgICBhbiB1cmw6IGh0dHBzOi8vd3d3LmV4YW1wbGUuY29tL2FiYyNmcmFnbWVudCBhbmQgYW5vdGhlciBfd3d3LnRpbm9kZS5jb19cbiAqICAgICB0aGlzIGlzIGEgQG1lbnRpb24gYW5kIGEgI2hhc2h0YWcgaW4gYSBzdHJpbmdcbiAqICAgICBzZWNvbmQgI2hhc2h0YWdcbiAqIDwvcHJlPlxuICpcbiAqICBTYW1wbGUgSlNPTiByZXByZXNlbnRhdGlvbiBvZiB0aGUgdGV4dCBhYm92ZTpcbiAqICB7XG4gKiAgICAgXCJ0eHRcIjogXCJ0aGlzIGlzIGJvbGQsIGNvZGUgYW5kIGl0YWxpYywgc3RyaWtlIGNvbWJpbmVkIGJvbGQgYW5kIGl0YWxpYyBhbiB1cmw6IGh0dHBzOi8vd3d3LmV4YW1wbGUuY29tL2FiYyNmcmFnbWVudCBcIiArXG4gKiAgICAgICAgICAgICBcImFuZCBhbm90aGVyIHd3dy50aW5vZGUuY28gdGhpcyBpcyBhIEBtZW50aW9uIGFuZCBhICNoYXNodGFnIGluIGEgc3RyaW5nIHNlY29uZCAjaGFzaHRhZ1wiLFxuICogICAgIFwiZm10XCI6IFtcbiAqICAgICAgICAgeyBcImF0XCI6OCwgXCJsZW5cIjo0LFwidHBcIjpcIlNUXCIgfSx7IFwiYXRcIjoxNCwgXCJsZW5cIjo0LCBcInRwXCI6XCJDT1wiIH0seyBcImF0XCI6MjMsIFwibGVuXCI6NiwgXCJ0cFwiOlwiRU1cIn0sXG4gKiAgICAgICAgIHsgXCJhdFwiOjMxLCBcImxlblwiOjYsIFwidHBcIjpcIkRMXCIgfSx7IFwidHBcIjpcIkJSXCIsIFwibGVuXCI6MSwgXCJhdFwiOjM3IH0seyBcImF0XCI6NTYsIFwibGVuXCI6NiwgXCJ0cFwiOlwiRU1cIiB9LFxuICogICAgICAgICB7IFwiYXRcIjo0NywgXCJsZW5cIjoxNSwgXCJ0cFwiOlwiU1RcIiB9LHsgXCJ0cFwiOlwiQlJcIiwgXCJsZW5cIjoxLCBcImF0XCI6NjIgfSx7IFwiYXRcIjoxMjAsIFwibGVuXCI6MTMsIFwidHBcIjpcIkVNXCIgfSxcbiAqICAgICAgICAgeyBcImF0XCI6NzEsIFwibGVuXCI6MzYsIFwia2V5XCI6MCB9LHsgXCJhdFwiOjEyMCwgXCJsZW5cIjoxMywgXCJrZXlcIjoxIH0seyBcInRwXCI6XCJCUlwiLCBcImxlblwiOjEsIFwiYXRcIjoxMzMgfSxcbiAqICAgICAgICAgeyBcImF0XCI6MTQ0LCBcImxlblwiOjgsIFwia2V5XCI6MiB9LHsgXCJhdFwiOjE1OSwgXCJsZW5cIjo4LCBcImtleVwiOjMgfSx7IFwidHBcIjpcIkJSXCIsIFwibGVuXCI6MSwgXCJhdFwiOjE3OSB9LFxuICogICAgICAgICB7IFwiYXRcIjoxODcsIFwibGVuXCI6OCwgXCJrZXlcIjozIH0seyBcInRwXCI6XCJCUlwiLCBcImxlblwiOjEsIFwiYXRcIjoxOTUgfVxuICogICAgIF0sXG4gKiAgICAgXCJlbnRcIjogW1xuICogICAgICAgICB7IFwidHBcIjpcIkxOXCIsIFwiZGF0YVwiOnsgXCJ1cmxcIjpcImh0dHBzOi8vd3d3LmV4YW1wbGUuY29tL2FiYyNmcmFnbWVudFwiIH0gfSxcbiAqICAgICAgICAgeyBcInRwXCI6XCJMTlwiLCBcImRhdGFcIjp7IFwidXJsXCI6XCJodHRwOi8vd3d3LnRpbm9kZS5jb1wiIH0gfSxcbiAqICAgICAgICAgeyBcInRwXCI6XCJNTlwiLCBcImRhdGFcIjp7IFwidmFsXCI6XCJtZW50aW9uXCIgfSB9LFxuICogICAgICAgICB7IFwidHBcIjpcIkhUXCIsIFwiZGF0YVwiOnsgXCJ2YWxcIjpcImhhc2h0YWdcIiB9IH1cbiAqICAgICBdXG4gKiAgfVxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuY29uc3QgTUFYX0ZPUk1fRUxFTUVOVFMgPSA4O1xuY29uc3QgSlNPTl9NSU1FX1RZUEUgPSAnYXBwbGljYXRpb24vanNvbic7XG5cbi8vIFJlZ3VsYXIgZXhwcmVzc2lvbnMgZm9yIHBhcnNpbmcgaW5saW5lIGZvcm1hdHMuIEphdmFzY3JpcHQgZG9lcyBub3Qgc3VwcG9ydCBsb29rYmVoaW5kLFxuLy8gc28gaXQncyBhIGJpdCBtZXNzeS5cbmNvbnN0IElOTElORV9TVFlMRVMgPSBbXG4gIC8vIFN0cm9uZyA9IGJvbGQsICpib2xkIHRleHQqXG4gIHtcbiAgICBuYW1lOiAnU1QnLFxuICAgIHN0YXJ0OiAvKD86XnxbXFxXX10pKFxcKilbXlxccypdLyxcbiAgICBlbmQ6IC9bXlxccypdKFxcKikoPz0kfFtcXFdfXSkvXG4gIH0sXG4gIC8vIEVtcGhlc2l6ZWQgPSBpdGFsaWMsIF9pdGFsaWMgdGV4dF9cbiAge1xuICAgIG5hbWU6ICdFTScsXG4gICAgc3RhcnQ6IC8oPzpefFxcVykoXylbXlxcc19dLyxcbiAgICBlbmQ6IC9bXlxcc19dKF8pKD89JHxcXFcpL1xuICB9LFxuICAvLyBEZWxldGVkLCB+c3RyaWtlIHRoaXMgdGhvdWdoflxuICB7XG4gICAgbmFtZTogJ0RMJyxcbiAgICBzdGFydDogLyg/Ol58W1xcV19dKSh+KVteXFxzfl0vLFxuICAgIGVuZDogL1teXFxzfl0ofikoPz0kfFtcXFdfXSkvXG4gIH0sXG4gIC8vIENvZGUgYmxvY2sgYHRoaXMgaXMgbW9ub3NwYWNlYFxuICB7XG4gICAgbmFtZTogJ0NPJyxcbiAgICBzdGFydDogLyg/Ol58XFxXKShgKVteYF0vLFxuICAgIGVuZDogL1teYF0oYCkoPz0kfFxcVykvXG4gIH1cbl07XG5cbi8vIFJlZ0V4cHMgZm9yIGVudGl0eSBleHRyYWN0aW9uIChSRiA9IHJlZmVyZW5jZSlcbmNvbnN0IEVOVElUWV9UWVBFUyA9IFtcbiAgLy8gVVJMc1xuICB7XG4gICAgbmFtZTogJ0xOJyxcbiAgICBkYXRhTmFtZTogJ3VybCcsXG4gICAgcGFjazogZnVuY3Rpb24odmFsKSB7XG4gICAgICAvLyBDaGVjayBpZiB0aGUgcHJvdG9jb2wgaXMgc3BlY2lmaWVkLCBpZiBub3QgdXNlIGh0dHBcbiAgICAgIGlmICghL15bYS16XSs6XFwvXFwvL2kudGVzdCh2YWwpKSB7XG4gICAgICAgIHZhbCA9ICdodHRwOi8vJyArIHZhbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHVybDogdmFsXG4gICAgICB9O1xuICAgIH0sXG4gICAgcmU6IC8oPzooPzpodHRwcz98ZnRwKTpcXC9cXC98d3d3XFwufGZ0cFxcLilbLUEtWjAtOSsmQCNcXC8lPX5ffCQ/ITosLl0qW0EtWjAtOSsmQCNcXC8lPX5ffCRdL2lnXG4gIH0sXG4gIC8vIE1lbnRpb25zIEB1c2VyIChtdXN0IGJlIDIgb3IgbW9yZSBjaGFyYWN0ZXJzKVxuICB7XG4gICAgbmFtZTogJ01OJyxcbiAgICBkYXRhTmFtZTogJ3ZhbCcsXG4gICAgcGFjazogZnVuY3Rpb24odmFsKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB2YWw6IHZhbC5zbGljZSgxKVxuICAgICAgfTtcbiAgICB9LFxuICAgIHJlOiAvXFxCQChcXHdcXHcrKS9nXG4gIH0sXG4gIC8vIEhhc2h0YWdzICNoYXNodGFnLCBsaWtlIG1ldGlvbiAyIG9yIG1vcmUgY2hhcmFjdGVycy5cbiAge1xuICAgIG5hbWU6ICdIVCcsXG4gICAgZGF0YU5hbWU6ICd2YWwnLFxuICAgIHBhY2s6IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdmFsOiB2YWwuc2xpY2UoMSlcbiAgICAgIH07XG4gICAgfSxcbiAgICByZTogL1xcQiMoXFx3XFx3KykvZ1xuICB9XG5dO1xuXG4vLyBIVE1MIHRhZyBuYW1lIHN1Z2dlc3Rpb25zXG5jb25zdCBIVE1MX1RBR1MgPSB7XG4gIFNUOiB7XG4gICAgbmFtZTogJ2InLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgRU06IHtcbiAgICBuYW1lOiAnaScsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBETDoge1xuICAgIG5hbWU6ICdkZWwnLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgQ086IHtcbiAgICBuYW1lOiAndHQnLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgQlI6IHtcbiAgICBuYW1lOiAnYnInLFxuICAgIGlzVm9pZDogdHJ1ZVxuICB9LFxuICBMTjoge1xuICAgIG5hbWU6ICdhJyxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH0sXG4gIE1OOiB7XG4gICAgbmFtZTogJ2EnLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgSFQ6IHtcbiAgICBuYW1lOiAnYScsXG4gICAgaXNWb2lkOiBmYWxzZVxuICB9LFxuICBJTToge1xuICAgIG5hbWU6ICdpbWcnLFxuICAgIGlzVm9pZDogdHJ1ZVxuICB9LFxuICBGTToge1xuICAgIG5hbWU6ICdkaXYnLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgUlc6IHtcbiAgICBuYW1lOiAnZGl2JyxcbiAgICBpc1ZvaWQ6IGZhbHNlLFxuICB9LFxuICBCTjoge1xuICAgIG5hbWU6ICdidXR0b24nLFxuICAgIGlzVm9pZDogZmFsc2VcbiAgfSxcbiAgSEQ6IHtcbiAgICBuYW1lOiAnJyxcbiAgICBpc1ZvaWQ6IGZhbHNlXG4gIH1cbn07XG5cbi8vIENvbnZlcnQgYmFzZTY0LWVuY29kZWQgc3RyaW5nIGludG8gQmxvYi5cbmZ1bmN0aW9uIGJhc2U2NHRvT2JqZWN0VXJsKGI2NCwgY29udGVudFR5cGUpIHtcbiAgbGV0IGJpbjtcbiAgdHJ5IHtcbiAgICBiaW4gPSBhdG9iKGI2NCk7XG4gICAgbGV0IGxlbmd0aCA9IGJpbi5sZW5ndGg7XG4gICAgbGV0IGJ1ZiA9IG5ldyBBcnJheUJ1ZmZlcihsZW5ndGgpO1xuICAgIGxldCBhcnIgPSBuZXcgVWludDhBcnJheShidWYpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGFycltpXSA9IGJpbi5jaGFyQ29kZUF0KGkpO1xuICAgIH1cblxuICAgIHJldHVybiBVUkwuY3JlYXRlT2JqZWN0VVJMKG5ldyBCbG9iKFtidWZdLCB7XG4gICAgICB0eXBlOiBjb250ZW50VHlwZVxuICAgIH0pKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgY29uc29sZS5sb2coXCJEcmFmdHk6IGZhaWxlZCB0byBjb252ZXJ0IG9iamVjdC5cIiwgZXJyLm1lc3NhZ2UpO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8vIEhlbHBlcnMgZm9yIGNvbnZlcnRpbmcgRHJhZnR5IHRvIEhUTUwuXG5jb25zdCBERUNPUkFUT1JTID0ge1xuICAvLyBWaXNpYWwgc3R5bGVzXG4gIFNUOiB7XG4gICAgb3BlbjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gJzxiPic7XG4gICAgfSxcbiAgICBjbG9zZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gJzwvYj4nO1xuICAgIH1cbiAgfSxcbiAgRU06IHtcbiAgICBvcGVuOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAnPGk+JztcbiAgICB9LFxuICAgIGNsb3NlOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAnPC9pPidcbiAgICB9XG4gIH0sXG4gIERMOiB7XG4gICAgb3BlbjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gJzxkZWw+JztcbiAgICB9LFxuICAgIGNsb3NlOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAnPC9kZWw+J1xuICAgIH1cbiAgfSxcbiAgQ086IHtcbiAgICBvcGVuOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAnPHR0Pic7XG4gICAgfSxcbiAgICBjbG9zZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gJzwvdHQ+J1xuICAgIH1cbiAgfSxcbiAgLy8gTGluZSBicmVha1xuICBCUjoge1xuICAgIG9wZW46IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICc8YnIvPic7XG4gICAgfSxcbiAgICBjbG9zZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gJydcbiAgICB9XG4gIH0sXG4gIC8vIEhpZGRlbiBlbGVtZW50XG4gIEhEOiB7XG4gICAgb3BlbjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfSxcbiAgICBjbG9zZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICB9LFxuICAvLyBMaW5rIChVUkwpXG4gIExOOiB7XG4gICAgb3BlbjogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgcmV0dXJuICc8YSBocmVmPVwiJyArIGRhdGEudXJsICsgJ1wiPic7XG4gICAgfSxcbiAgICBjbG9zZTogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgcmV0dXJuICc8L2E+JztcbiAgICB9LFxuICAgIHByb3BzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICByZXR1cm4gZGF0YSA/IHtcbiAgICAgICAgaHJlZjogZGF0YS51cmwsXG4gICAgICAgIHRhcmdldDogXCJfYmxhbmtcIlxuICAgICAgfSA6IG51bGw7XG4gICAgfSxcbiAgfSxcbiAgLy8gTWVudGlvblxuICBNTjoge1xuICAgIG9wZW46IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHJldHVybiAnPGEgaHJlZj1cIiMnICsgZGF0YS52YWwgKyAnXCI+JztcbiAgICB9LFxuICAgIGNsb3NlOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICByZXR1cm4gJzwvYT4nO1xuICAgIH0sXG4gICAgcHJvcHM6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHJldHVybiBkYXRhID8ge1xuICAgICAgICBuYW1lOiBkYXRhLnZhbFxuICAgICAgfSA6IG51bGw7XG4gICAgfSxcbiAgfSxcbiAgLy8gSGFzaHRhZ1xuICBIVDoge1xuICAgIG9wZW46IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHJldHVybiAnPGEgaHJlZj1cIiMnICsgZGF0YS52YWwgKyAnXCI+JztcbiAgICB9LFxuICAgIGNsb3NlOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICByZXR1cm4gJzwvYT4nO1xuICAgIH0sXG4gICAgcHJvcHM6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHJldHVybiBkYXRhID8ge1xuICAgICAgICBuYW1lOiBkYXRhLnZhbFxuICAgICAgfSA6IG51bGw7XG4gICAgfSxcbiAgfSxcbiAgLy8gQnV0dG9uXG4gIEJOOiB7XG4gICAgb3BlbjogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgcmV0dXJuICc8YnV0dG9uPic7XG4gICAgfSxcbiAgICBjbG9zZTogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgcmV0dXJuICc8L2J1dHRvbj4nO1xuICAgIH0sXG4gICAgcHJvcHM6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHJldHVybiBkYXRhID8ge1xuICAgICAgICAnZGF0YS1hY3QnOiBkYXRhLmFjdCxcbiAgICAgICAgJ2RhdGEtdmFsJzogZGF0YS52YWwsXG4gICAgICAgICdkYXRhLW5hbWUnOiBkYXRhLm5hbWUsXG4gICAgICAgICdkYXRhLXJlZic6IGRhdGEucmVmXG4gICAgICB9IDogbnVsbDtcbiAgICB9LFxuICB9LFxuICAvLyBJbWFnZVxuICBJTToge1xuICAgIG9wZW46IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIC8vIERvbid0IHVzZSBkYXRhLnJlZiBmb3IgcHJldmlldzogaXQncyBhIHNlY3VyaXR5IHJpc2suXG4gICAgICBjb25zdCBwcmV2aWV3VXJsID0gYmFzZTY0dG9PYmplY3RVcmwoZGF0YS52YWwsIGRhdGEubWltZSk7XG4gICAgICBjb25zdCBkb3dubG9hZFVybCA9IGRhdGEucmVmID8gZGF0YS5yZWYgOiBwcmV2aWV3VXJsO1xuICAgICAgcmV0dXJuIChkYXRhLm5hbWUgPyAnPGEgaHJlZj1cIicgKyBkb3dubG9hZFVybCArICdcIiBkb3dubG9hZD1cIicgKyBkYXRhLm5hbWUgKyAnXCI+JyA6ICcnKSArXG4gICAgICAgICc8aW1nIHNyYz1cIicgKyBwcmV2aWV3VXJsICsgJ1wiJyArXG4gICAgICAgIChkYXRhLndpZHRoID8gJyB3aWR0aD1cIicgKyBkYXRhLndpZHRoICsgJ1wiJyA6ICcnKSArXG4gICAgICAgIChkYXRhLmhlaWdodCA/ICcgaGVpZ2h0PVwiJyArIGRhdGEuaGVpZ2h0ICsgJ1wiJyA6ICcnKSArICcgYm9yZGVyPVwiMFwiIC8+JztcbiAgICB9LFxuICAgIGNsb3NlOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICByZXR1cm4gKGRhdGEubmFtZSA/ICc8L2E+JyA6ICcnKTtcbiAgICB9LFxuICAgIHByb3BzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBpZiAoIWRhdGEpIHJldHVybiBudWxsO1xuICAgICAgbGV0IHVybCA9IGJhc2U2NHRvT2JqZWN0VXJsKGRhdGEudmFsLCBkYXRhLm1pbWUpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc3JjOiB1cmwsXG4gICAgICAgIHRpdGxlOiBkYXRhLm5hbWUsXG4gICAgICAgICdkYXRhLXdpZHRoJzogZGF0YS53aWR0aCxcbiAgICAgICAgJ2RhdGEtaGVpZ2h0JzogZGF0YS5oZWlnaHQsXG4gICAgICAgICdkYXRhLW5hbWUnOiBkYXRhLm5hbWUsXG4gICAgICAgICdkYXRhLXNpemUnOiBkYXRhLnZhbCA/IChkYXRhLnZhbC5sZW5ndGggKiAwLjc1KSB8IDAgOiAwLFxuICAgICAgICAnZGF0YS1taW1lJzogZGF0YS5taW1lXG4gICAgICB9O1xuICAgIH0sXG4gIH0sXG4gIC8vIEZvcm0gLSBzdHJ1Y3R1cmVkIGxheW91dCBvZiBlbGVtZW50cy5cbiAgRk06IHtcbiAgICBvcGVuOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICByZXR1cm4gJzxkaXY+JztcbiAgICB9LFxuICAgIGNsb3NlOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICByZXR1cm4gJzwvZGl2Pic7XG4gICAgfVxuICB9LFxuICAvLyBSb3c6IGxvZ2ljIGdyb3VwaW5nIG9mIGVsZW1lbnRzXG4gIFJXOiB7XG4gICAgb3BlbjogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgcmV0dXJuICc8ZGl2Pic7XG4gICAgfSxcbiAgICBjbG9zZTogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgcmV0dXJuICc8L2Rpdj4nO1xuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBUaGUgbWFpbiBvYmplY3Qgd2hpY2ggcGVyZm9ybXMgYWxsIHRoZSBmb3JtYXR0aW5nIGFjdGlvbnMuXG4gKiBAY2xhc3MgRHJhZnR5XG4gKiBAY29uc3RydWN0b3JcbiAqL1xudmFyIERyYWZ0eSA9IGZ1bmN0aW9uKCkge31cblxuLy8gVGFrZSBhIHN0cmluZyBhbmQgZGVmaW5lZCBlYXJsaWVyIHN0eWxlIHNwYW5zLCByZS1jb21wb3NlIHRoZW0gaW50byBhIHRyZWUgd2hlcmUgZWFjaCBsZWFmIGlzXG4vLyBhIHNhbWUtc3R5bGUgKGluY2x1ZGluZyB1bnN0eWxlZCkgc3RyaW5nLiBJLmUuICdoZWxsbyAqYm9sZCBfaXRhbGljXyogYW5kIH5tb3JlfiB3b3JsZCcgLT5cbi8vICgnaGVsbG8gJywgKGI6ICdib2xkICcsIChpOiAnaXRhbGljJykpLCAnIGFuZCAnLCAoczogJ21vcmUnKSwgJyB3b3JsZCcpO1xuLy9cbi8vIFRoaXMgaXMgbmVlZGVkIGluIG9yZGVyIHRvIGNsZWFyIG1hcmt1cCwgaS5lLiAnaGVsbG8gKndvcmxkKicgLT4gJ2hlbGxvIHdvcmxkJyBhbmQgY29udmVydFxuLy8gcmFuZ2VzIGZyb20gbWFya3VwLWVkIG9mZnNldHMgdG8gcGxhaW4gdGV4dCBvZmZzZXRzLlxuZnVuY3Rpb24gY2h1bmtpZnkobGluZSwgc3RhcnQsIGVuZCwgc3BhbnMpIHtcbiAgdmFyIGNodW5rcyA9IFtdO1xuXG4gIGlmIChzcGFucy5sZW5ndGggPT0gMCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGZvciAodmFyIGkgaW4gc3BhbnMpIHtcbiAgICAvLyBHZXQgdGhlIG5leHQgY2h1bmsgZnJvbSB0aGUgcXVldWVcbiAgICB2YXIgc3BhbiA9IHNwYW5zW2ldO1xuXG4gICAgLy8gR3JhYiB0aGUgaW5pdGlhbCB1bnN0eWxlZCBjaHVua1xuICAgIGlmIChzcGFuLnN0YXJ0ID4gc3RhcnQpIHtcbiAgICAgIGNodW5rcy5wdXNoKHtcbiAgICAgICAgdGV4dDogbGluZS5zbGljZShzdGFydCwgc3Bhbi5zdGFydClcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEdyYWIgdGhlIHN0eWxlZCBjaHVuay4gSXQgbWF5IGluY2x1ZGUgc3ViY2h1bmtzLlxuICAgIHZhciBjaHVuayA9IHtcbiAgICAgIHR5cGU6IHNwYW4udHlwZVxuICAgIH07XG4gICAgdmFyIGNobGQgPSBjaHVua2lmeShsaW5lLCBzcGFuLnN0YXJ0ICsgMSwgc3Bhbi5lbmQsIHNwYW4uY2hpbGRyZW4pO1xuICAgIGlmIChjaGxkLmxlbmd0aCA+IDApIHtcbiAgICAgIGNodW5rLmNoaWxkcmVuID0gY2hsZDtcbiAgICB9IGVsc2Uge1xuICAgICAgY2h1bmsudGV4dCA9IHNwYW4udGV4dDtcbiAgICB9XG4gICAgY2h1bmtzLnB1c2goY2h1bmspO1xuICAgIHN0YXJ0ID0gc3Bhbi5lbmQgKyAxOyAvLyAnKzEnIGlzIHRvIHNraXAgdGhlIGZvcm1hdHRpbmcgY2hhcmFjdGVyXG4gIH1cblxuICAvLyBHcmFiIHRoZSByZW1haW5pbmcgdW5zdHlsZWQgY2h1bmssIGFmdGVyIHRoZSBsYXN0IHNwYW5cbiAgaWYgKHN0YXJ0IDwgZW5kKSB7XG4gICAgY2h1bmtzLnB1c2goe1xuICAgICAgdGV4dDogbGluZS5zbGljZShzdGFydCwgZW5kKVxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIGNodW5rcztcbn1cblxuLy8gSW52ZXJzZSBvZiBjaHVua2lmeS4gUmV0dXJucyBhIHRyZWUgb2YgZm9ybWF0dGVkIHNwYW5zLlxuZnVuY3Rpb24gZm9yRWFjaChsaW5lLCBzdGFydCwgZW5kLCBzcGFucywgZm9ybWF0dGVyLCBjb250ZXh0KSB7XG4gIGxldCByZXN1bHQgPSBbXTtcblxuICAvLyBQcm9jZXNzIHJhbmdlcyBjYWxsaW5nIGZvcm1hdHRlciBmb3IgZWFjaCByYW5nZS5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzcGFucy5sZW5ndGg7IGkrKykge1xuICAgIGxldCBzcGFuID0gc3BhbnNbaV07XG4gICAgaWYgKHNwYW4uYXQgPCAwKSB7XG4gICAgICAvLyB0aHJvdyBvdXQgbm9uLXZpc3VhbCBzcGFucy5cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICAvLyBBZGQgdW4tc3R5bGVkIHJhbmdlIGJlZm9yZSB0aGUgc3R5bGVkIHNwYW4gc3RhcnRzLlxuICAgIGlmIChzdGFydCA8IHNwYW4uYXQpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGZvcm1hdHRlci5jYWxsKGNvbnRleHQsIG51bGwsIHVuZGVmaW5lZCwgbGluZS5zbGljZShzdGFydCwgc3Bhbi5hdCksIHJlc3VsdC5sZW5ndGgpKTtcbiAgICAgIHN0YXJ0ID0gc3Bhbi5hdDtcbiAgICB9XG4gICAgLy8gR2V0IGFsbCBzcGFucyB3aGljaCBhcmUgd2l0aGluIGN1cnJlbnQgc3Bhbi5cbiAgICBjb25zdCBzdWJzcGFucyA9IFtdO1xuICAgIGZvciAobGV0IHNpID0gaSArIDE7IHNpIDwgc3BhbnMubGVuZ3RoICYmIHNwYW5zW3NpXS5hdCA8IHNwYW4uYXQgKyBzcGFuLmxlbjsgc2krKykge1xuICAgICAgc3Vic3BhbnMucHVzaChzcGFuc1tzaV0pO1xuICAgICAgaSA9IHNpO1xuICAgIH1cblxuICAgIGNvbnN0IHRhZyA9IEhUTUxfVEFHU1tzcGFuLnRwXSB8fCB7fVxuICAgIHJlc3VsdC5wdXNoKGZvcm1hdHRlci5jYWxsKGNvbnRleHQsIHNwYW4udHAsIHNwYW4uZGF0YSxcbiAgICAgIHRhZy5pc1ZvaWQgPyBudWxsIDogZm9yRWFjaChsaW5lLCBzdGFydCwgc3Bhbi5hdCArIHNwYW4ubGVuLCBzdWJzcGFucywgZm9ybWF0dGVyLCBjb250ZXh0KSxcbiAgICAgIHJlc3VsdC5sZW5ndGgpKTtcblxuICAgIHN0YXJ0ID0gc3Bhbi5hdCArIHNwYW4ubGVuO1xuICB9XG5cbiAgLy8gQWRkIHRoZSBsYXN0IHVuZm9ybWF0dGVkIHJhbmdlLlxuICBpZiAoc3RhcnQgPCBlbmQpIHtcbiAgICByZXN1bHQucHVzaChmb3JtYXR0ZXIuY2FsbChjb250ZXh0LCBudWxsLCB1bmRlZmluZWQsIGxpbmUuc2xpY2Uoc3RhcnQsIGVuZCksIHJlc3VsdC5sZW5ndGgpKTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8vIERldGVjdCBzdGFydHMgYW5kIGVuZHMgb2YgZm9ybWF0dGluZyBzcGFucy4gVW5mb3JtYXR0ZWQgc3BhbnMgYXJlXG4vLyBpZ25vcmVkIGF0IHRoaXMgc3RhZ2UuXG5mdW5jdGlvbiBzcGFubmlmeShvcmlnaW5hbCwgcmVfc3RhcnQsIHJlX2VuZCwgdHlwZSkge1xuICBsZXQgcmVzdWx0ID0gW107XG4gIGxldCBpbmRleCA9IDA7XG4gIGxldCBsaW5lID0gb3JpZ2luYWwuc2xpY2UoMCk7IC8vIG1ha2UgYSBjb3B5O1xuXG4gIHdoaWxlIChsaW5lLmxlbmd0aCA+IDApIHtcbiAgICAvLyBtYXRjaFswXTsgLy8gbWF0Y2gsIGxpa2UgJyphYmMqJ1xuICAgIC8vIG1hdGNoWzFdOyAvLyBtYXRjaCBjYXB0dXJlZCBpbiBwYXJlbnRoZXNpcywgbGlrZSAnYWJjJ1xuICAgIC8vIG1hdGNoWydpbmRleCddOyAvLyBvZmZzZXQgd2hlcmUgdGhlIG1hdGNoIHN0YXJ0ZWQuXG5cbiAgICAvLyBGaW5kIHRoZSBvcGVuaW5nIHRva2VuLlxuICAgIGxldCBzdGFydCA9IHJlX3N0YXJ0LmV4ZWMobGluZSk7XG4gICAgaWYgKHN0YXJ0ID09IG51bGwpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIEJlY2F1c2UgamF2YXNjcmlwdCBSZWdFeHAgZG9lcyBub3Qgc3VwcG9ydCBsb29rYmVoaW5kLCB0aGUgYWN0dWFsIG9mZnNldCBtYXkgbm90IHBvaW50XG4gICAgLy8gYXQgdGhlIG1hcmt1cCBjaGFyYWN0ZXIuIEZpbmQgaXQgaW4gdGhlIG1hdGNoZWQgc3RyaW5nLlxuICAgIGxldCBzdGFydF9vZmZzZXQgPSBzdGFydFsnaW5kZXgnXSArIHN0YXJ0WzBdLmxhc3RJbmRleE9mKHN0YXJ0WzFdKTtcbiAgICAvLyBDbGlwIHRoZSBwcm9jZXNzZWQgcGFydCBvZiB0aGUgc3RyaW5nLlxuICAgIGxpbmUgPSBsaW5lLnNsaWNlKHN0YXJ0X29mZnNldCArIDEpO1xuICAgIC8vIHN0YXJ0X29mZnNldCBpcyBhbiBvZmZzZXQgd2l0aGluIHRoZSBjbGlwcGVkIHN0cmluZy4gQ29udmVydCB0byBvcmlnaW5hbCBpbmRleC5cbiAgICBzdGFydF9vZmZzZXQgKz0gaW5kZXg7XG4gICAgLy8gSW5kZXggbm93IHBvaW50IHRvIHRoZSBiZWdpbm5pbmcgb2YgJ2xpbmUnIHdpdGhpbiB0aGUgJ29yaWdpbmFsJyBzdHJpbmcuXG4gICAgaW5kZXggPSBzdGFydF9vZmZzZXQgKyAxO1xuXG4gICAgLy8gRmluZCB0aGUgbWF0Y2hpbmcgY2xvc2luZyB0b2tlbi5cbiAgICBsZXQgZW5kID0gcmVfZW5kID8gcmVfZW5kLmV4ZWMobGluZSkgOiBudWxsO1xuICAgIGlmIChlbmQgPT0gbnVsbCkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGxldCBlbmRfb2Zmc2V0ID0gZW5kWydpbmRleCddICsgZW5kWzBdLmluZGV4T2YoZW5kWzFdKTtcbiAgICAvLyBDbGlwIHRoZSBwcm9jZXNzZWQgcGFydCBvZiB0aGUgc3RyaW5nLlxuICAgIGxpbmUgPSBsaW5lLnNsaWNlKGVuZF9vZmZzZXQgKyAxKTtcbiAgICAvLyBVcGRhdGUgb2Zmc2V0c1xuICAgIGVuZF9vZmZzZXQgKz0gaW5kZXg7XG4gICAgLy8gSW5kZXggbm93IHBvaW50IHRvIHRoZSBiZWdpbm5pbmcgb2YgJ2xpbmUnIHdpdGhpbiB0aGUgJ29yaWdpbmFsJyBzdHJpbmcuXG4gICAgaW5kZXggPSBlbmRfb2Zmc2V0ICsgMTtcblxuICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgIHRleHQ6IG9yaWdpbmFsLnNsaWNlKHN0YXJ0X29mZnNldCArIDEsIGVuZF9vZmZzZXQpLFxuICAgICAgY2hpbGRyZW46IFtdLFxuICAgICAgc3RhcnQ6IHN0YXJ0X29mZnNldCxcbiAgICAgIGVuZDogZW5kX29mZnNldCxcbiAgICAgIHR5cGU6IHR5cGVcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8vIENvbnZlcnQgbGluZWFyIGFycmF5IG9yIHNwYW5zIGludG8gYSB0cmVlIHJlcHJlc2VudGF0aW9uLlxuLy8gS2VlcCBzdGFuZGFsb25lIGFuZCBuZXN0ZWQgc3BhbnMsIHRocm93IGF3YXkgcGFydGlhbGx5IG92ZXJsYXBwaW5nIHNwYW5zLlxuZnVuY3Rpb24gdG9UcmVlKHNwYW5zKSB7XG4gIGlmIChzcGFucy5sZW5ndGggPT0gMCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIHZhciB0cmVlID0gW3NwYW5zWzBdXTtcbiAgdmFyIGxhc3QgPSBzcGFuc1swXTtcbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBzcGFucy5sZW5ndGg7IGkrKykge1xuICAgIC8vIEtlZXAgc3BhbnMgd2hpY2ggc3RhcnQgYWZ0ZXIgdGhlIGVuZCBvZiB0aGUgcHJldmlvdXMgc3BhbiBvciB0aG9zZSB3aGljaFxuICAgIC8vIGFyZSBjb21wbGV0ZSB3aXRoaW4gdGhlIHByZXZpb3VzIHNwYW4uXG5cbiAgICBpZiAoc3BhbnNbaV0uc3RhcnQgPiBsYXN0LmVuZCkge1xuICAgICAgLy8gU3BhbiBpcyBjb21wbGV0ZWx5IG91dHNpZGUgb2YgdGhlIHByZXZpb3VzIHNwYW4uXG4gICAgICB0cmVlLnB1c2goc3BhbnNbaV0pO1xuICAgICAgbGFzdCA9IHNwYW5zW2ldO1xuICAgIH0gZWxzZSBpZiAoc3BhbnNbaV0uZW5kIDwgbGFzdC5lbmQpIHtcbiAgICAgIC8vIFNwYW4gaXMgZnVsbHkgaW5zaWRlIG9mIHRoZSBwcmV2aW91cyBzcGFuLiBQdXNoIHRvIHN1Ym5vZGUuXG4gICAgICBsYXN0LmNoaWxkcmVuLnB1c2goc3BhbnNbaV0pO1xuICAgIH1cbiAgICAvLyBTcGFuIGNvdWxkIHBhcnRpYWxseSBvdmVybGFwLCBpZ25vcmluZyBpdCBhcyBpbnZhbGlkLlxuICB9XG5cbiAgLy8gUmVjdXJzaXZlbHkgcmVhcnJhbmdlIHRoZSBzdWJub2Rlcy5cbiAgZm9yICh2YXIgaSBpbiB0cmVlKSB7XG4gICAgdHJlZVtpXS5jaGlsZHJlbiA9IHRvVHJlZSh0cmVlW2ldLmNoaWxkcmVuKTtcbiAgfVxuXG4gIHJldHVybiB0cmVlO1xufVxuXG4vLyBHZXQgYSBsaXN0IG9mIGVudGl0aWVzIGZyb20gYSB0ZXh0LlxuZnVuY3Rpb24gZXh0cmFjdEVudGl0aWVzKGxpbmUpIHtcbiAgdmFyIG1hdGNoO1xuICB2YXIgZXh0cmFjdGVkID0gW107XG4gIEVOVElUWV9UWVBFUy5tYXAoZnVuY3Rpb24oZW50aXR5KSB7XG4gICAgd2hpbGUgKChtYXRjaCA9IGVudGl0eS5yZS5leGVjKGxpbmUpKSAhPT0gbnVsbCkge1xuICAgICAgZXh0cmFjdGVkLnB1c2goe1xuICAgICAgICBvZmZzZXQ6IG1hdGNoWydpbmRleCddLFxuICAgICAgICBsZW46IG1hdGNoWzBdLmxlbmd0aCxcbiAgICAgICAgdW5pcXVlOiBtYXRjaFswXSxcbiAgICAgICAgZGF0YTogZW50aXR5LnBhY2sobWF0Y2hbMF0pLFxuICAgICAgICB0eXBlOiBlbnRpdHkubmFtZVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcblxuICBpZiAoZXh0cmFjdGVkLmxlbmd0aCA9PSAwKSB7XG4gICAgcmV0dXJuIGV4dHJhY3RlZDtcbiAgfVxuXG4gIC8vIFJlbW92ZSBlbnRpdGllcyBkZXRlY3RlZCBpbnNpZGUgb3RoZXIgZW50aXRpZXMsIGxpa2UgI2hhc2h0YWcgaW4gYSBVUkwuXG4gIGV4dHJhY3RlZC5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICByZXR1cm4gYS5vZmZzZXQgLSBiLm9mZnNldDtcbiAgfSk7XG5cbiAgdmFyIGlkeCA9IC0xO1xuICBleHRyYWN0ZWQgPSBleHRyYWN0ZWQuZmlsdGVyKGZ1bmN0aW9uKGVsKSB7XG4gICAgdmFyIHJlc3VsdCA9IChlbC5vZmZzZXQgPiBpZHgpO1xuICAgIGlkeCA9IGVsLm9mZnNldCArIGVsLmxlbjtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9KTtcblxuICByZXR1cm4gZXh0cmFjdGVkO1xufVxuXG4vLyBDb252ZXJ0IHRoZSBjaHVua3MgaW50byBmb3JtYXQgc3VpdGFibGUgZm9yIHNlcmlhbGl6YXRpb24uXG5mdW5jdGlvbiBkcmFmdGlmeShjaHVua3MsIHN0YXJ0QXQpIHtcbiAgdmFyIHBsYWluID0gXCJcIjtcbiAgdmFyIHJhbmdlcyA9IFtdO1xuICBmb3IgKHZhciBpIGluIGNodW5rcykge1xuICAgIHZhciBjaHVuayA9IGNodW5rc1tpXTtcbiAgICBpZiAoIWNodW5rLnRleHQpIHtcbiAgICAgIHZhciBkcmFmdHkgPSBkcmFmdGlmeShjaHVuay5jaGlsZHJlbiwgcGxhaW4ubGVuZ3RoICsgc3RhcnRBdCk7XG4gICAgICBjaHVuay50ZXh0ID0gZHJhZnR5LnR4dDtcbiAgICAgIHJhbmdlcyA9IHJhbmdlcy5jb25jYXQoZHJhZnR5LmZtdCk7XG4gICAgfVxuXG4gICAgaWYgKGNodW5rLnR5cGUpIHtcbiAgICAgIHJhbmdlcy5wdXNoKHtcbiAgICAgICAgYXQ6IHBsYWluLmxlbmd0aCArIHN0YXJ0QXQsXG4gICAgICAgIGxlbjogY2h1bmsudGV4dC5sZW5ndGgsXG4gICAgICAgIHRwOiBjaHVuay50eXBlXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBwbGFpbiArPSBjaHVuay50ZXh0O1xuICB9XG4gIHJldHVybiB7XG4gICAgdHh0OiBwbGFpbixcbiAgICBmbXQ6IHJhbmdlc1xuICB9O1xufVxuXG4vLyBTcGxpY2UgdHdvIHN0cmluZ3M6IGluc2VydCBzZWNvbmQgc3RyaW5nIGludG8gdGhlIGZpcnN0IG9uZSBhdCB0aGUgZ2l2ZW4gaW5kZXhcbmZ1bmN0aW9uIHNwbGljZShzcmMsIGF0LCBpbnNlcnQpIHtcbiAgcmV0dXJuIHNyYy5zbGljZSgwLCBhdCkgKyBpbnNlcnQgKyBzcmMuc2xpY2UoYXQpO1xufVxuXG4vKipcbiAqIFBhcnNlIHBsYWluIHRleHQgaW50byBEcmFmdHkgZG9jdW1lbnQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGNvbnRlbnQgcGxhaW4tdGV4dCBjb250ZW50IHRvIHBhcnNlLlxuICogQHJldHVybiB7RHJhZnR5fSBwYXJzZWQgb2JqZWN0IG9yIG51bGwgaWYgdGhlIHNvdXJjZSBpcyBub3QgcGxhaW4gdGV4dC5cbiAqL1xuRHJhZnR5LnBhcnNlID0gZnVuY3Rpb24oY29udGVudCkge1xuICAvLyBNYWtlIHN1cmUgd2UgYXJlIHBhcnNpbmcgc3RyaW5ncyBvbmx5LlxuICBpZiAodHlwZW9mIGNvbnRlbnQgIT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIFNwbGl0IHRleHQgaW50byBsaW5lcy4gSXQgbWFrZXMgZnVydGhlciBwcm9jZXNzaW5nIGVhc2llci5cbiAgdmFyIGxpbmVzID0gY29udGVudC5zcGxpdCgvXFxyP1xcbi8pO1xuXG4gIC8vIEhvbGRzIGVudGl0aWVzIHJlZmVyZW5jZWQgZnJvbSB0ZXh0XG4gIHZhciBlbnRpdHlNYXAgPSBbXTtcbiAgdmFyIGVudGl0eUluZGV4ID0ge307XG5cbiAgLy8gUHJvY2Vzc2luZyBsaW5lcyBvbmUgYnkgb25lLCBob2xkIGludGVybWVkaWF0ZSByZXN1bHQgaW4gYmx4LlxuICB2YXIgYmx4ID0gW107XG4gIGxpbmVzLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgdmFyIHNwYW5zID0gW107XG4gICAgdmFyIGVudGl0aWVzID0gW107XG5cbiAgICAvLyBGaW5kIGZvcm1hdHRlZCBzcGFucyBpbiB0aGUgc3RyaW5nLlxuICAgIC8vIFRyeSB0byBtYXRjaCBlYWNoIHN0eWxlLlxuICAgIElOTElORV9TVFlMRVMubWFwKGZ1bmN0aW9uKHN0eWxlKSB7XG4gICAgICAvLyBFYWNoIHN0eWxlIGNvdWxkIGJlIG1hdGNoZWQgbXVsdGlwbGUgdGltZXMuXG4gICAgICBzcGFucyA9IHNwYW5zLmNvbmNhdChzcGFubmlmeShsaW5lLCBzdHlsZS5zdGFydCwgc3R5bGUuZW5kLCBzdHlsZS5uYW1lKSk7XG4gICAgfSk7XG5cbiAgICB2YXIgYmxvY2s7XG4gICAgaWYgKHNwYW5zLmxlbmd0aCA9PSAwKSB7XG4gICAgICBibG9jayA9IHtcbiAgICAgICAgdHh0OiBsaW5lXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBTb3J0IHNwYW5zIGJ5IHN0eWxlIG9jY3VyZW5jZSBlYXJseSAtPiBsYXRlXG4gICAgICBzcGFucy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGEuc3RhcnQgLSBiLnN0YXJ0O1xuICAgICAgfSk7XG5cbiAgICAgIC8vIENvbnZlcnQgYW4gYXJyYXkgb2YgcG9zc2libHkgb3ZlcmxhcHBpbmcgc3BhbnMgaW50byBhIHRyZWVcbiAgICAgIHNwYW5zID0gdG9UcmVlKHNwYW5zKTtcblxuICAgICAgLy8gQnVpbGQgYSB0cmVlIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBlbnRpcmUgc3RyaW5nLCBub3RcbiAgICAgIC8vIGp1c3QgdGhlIGZvcm1hdHRlZCBwYXJ0cy5cbiAgICAgIHZhciBjaHVua3MgPSBjaHVua2lmeShsaW5lLCAwLCBsaW5lLmxlbmd0aCwgc3BhbnMpO1xuXG4gICAgICB2YXIgZHJhZnR5ID0gZHJhZnRpZnkoY2h1bmtzLCAwKTtcblxuICAgICAgYmxvY2sgPSB7XG4gICAgICAgIHR4dDogZHJhZnR5LnR4dCxcbiAgICAgICAgZm10OiBkcmFmdHkuZm10XG4gICAgICB9O1xuICAgIH1cblxuICAgIC8vIEV4dHJhY3QgZW50aXRpZXMgZnJvbSB0aGUgY2xlYW5lZCB1cCBzdHJpbmcuXG4gICAgZW50aXRpZXMgPSBleHRyYWN0RW50aXRpZXMoYmxvY2sudHh0KTtcbiAgICBpZiAoZW50aXRpZXMubGVuZ3RoID4gMCkge1xuICAgICAgdmFyIHJhbmdlcyA9IFtdO1xuICAgICAgZm9yICh2YXIgaSBpbiBlbnRpdGllcykge1xuICAgICAgICAvLyB7b2Zmc2V0OiBtYXRjaFsnaW5kZXgnXSwgdW5pcXVlOiBtYXRjaFswXSwgbGVuOiBtYXRjaFswXS5sZW5ndGgsIGRhdGE6IGVudC5wYWNrZXIoKSwgdHlwZTogZW50Lm5hbWV9XG4gICAgICAgIHZhciBlbnRpdHkgPSBlbnRpdGllc1tpXTtcbiAgICAgICAgdmFyIGluZGV4ID0gZW50aXR5SW5kZXhbZW50aXR5LnVuaXF1ZV07XG4gICAgICAgIGlmICghaW5kZXgpIHtcbiAgICAgICAgICBpbmRleCA9IGVudGl0eU1hcC5sZW5ndGg7XG4gICAgICAgICAgZW50aXR5SW5kZXhbZW50aXR5LnVuaXF1ZV0gPSBpbmRleDtcbiAgICAgICAgICBlbnRpdHlNYXAucHVzaCh7XG4gICAgICAgICAgICB0cDogZW50aXR5LnR5cGUsXG4gICAgICAgICAgICBkYXRhOiBlbnRpdHkuZGF0YVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJhbmdlcy5wdXNoKHtcbiAgICAgICAgICBhdDogZW50aXR5Lm9mZnNldCxcbiAgICAgICAgICBsZW46IGVudGl0eS5sZW4sXG4gICAgICAgICAga2V5OiBpbmRleFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGJsb2NrLmVudCA9IHJhbmdlcztcbiAgICB9XG5cbiAgICBibHgucHVzaChibG9jayk7XG4gIH0pO1xuXG4gIHZhciByZXN1bHQgPSB7XG4gICAgdHh0OiBcIlwiXG4gIH07XG5cbiAgLy8gTWVyZ2UgbGluZXMgYW5kIHNhdmUgbGluZSBicmVha3MgYXMgQlIgaW5saW5lIGZvcm1hdHRpbmcuXG4gIGlmIChibHgubGVuZ3RoID4gMCkge1xuICAgIHJlc3VsdC50eHQgPSBibHhbMF0udHh0O1xuICAgIHJlc3VsdC5mbXQgPSAoYmx4WzBdLmZtdCB8fCBbXSkuY29uY2F0KGJseFswXS5lbnQgfHwgW10pO1xuXG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBibHgubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBibG9jayA9IGJseFtpXTtcbiAgICAgIHZhciBvZmZzZXQgPSByZXN1bHQudHh0Lmxlbmd0aCArIDE7XG5cbiAgICAgIHJlc3VsdC5mbXQucHVzaCh7XG4gICAgICAgIHRwOiAnQlInLFxuICAgICAgICBsZW46IDEsXG4gICAgICAgIGF0OiBvZmZzZXQgLSAxXG4gICAgICB9KTtcblxuICAgICAgcmVzdWx0LnR4dCArPSBcIiBcIiArIGJsb2NrLnR4dDtcbiAgICAgIGlmIChibG9jay5mbXQpIHtcbiAgICAgICAgcmVzdWx0LmZtdCA9IHJlc3VsdC5mbXQuY29uY2F0KGJsb2NrLmZtdC5tYXAoZnVuY3Rpb24ocykge1xuICAgICAgICAgIHMuYXQgKz0gb2Zmc2V0O1xuICAgICAgICAgIHJldHVybiBzO1xuICAgICAgICB9KSk7XG4gICAgICB9XG4gICAgICBpZiAoYmxvY2suZW50KSB7XG4gICAgICAgIHJlc3VsdC5mbXQgPSByZXN1bHQuZm10LmNvbmNhdChibG9jay5lbnQubWFwKGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgICBzLmF0ICs9IG9mZnNldDtcbiAgICAgICAgICByZXR1cm4gcztcbiAgICAgICAgfSkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChyZXN1bHQuZm10Lmxlbmd0aCA9PSAwKSB7XG4gICAgICBkZWxldGUgcmVzdWx0LmZtdDtcbiAgICB9XG5cbiAgICBpZiAoZW50aXR5TWFwLmxlbmd0aCA+IDApIHtcbiAgICAgIHJlc3VsdC5lbnQgPSBlbnRpdHlNYXA7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBEcmFmdHkgZG9jdW1lbnQgdG8gYSBwbGFpbiB0ZXh0IHN0cmluZy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gcGxhaW5UZXh0IHN0cmluZyB0byB1c2UgYXMgRHJhZnR5IGNvbnRlbnQuXG4gKlxuICogQHJldHVybnMgbmV3IERyYWZ0eSBkb2N1bWVudCBvciBudWxsIGlzIHBsYWluVGV4dCBpcyBub3QgYSBzdHJpbmcuXG4gKi9cbkRyYWZ0eS5pbml0ID0gZnVuY3Rpb24ocGxhaW5UZXh0KSB7XG4gIGlmICh0eXBlb2YgcGxhaW5UZXh0ICE9ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICB0eHQ6IHBsYWluVGV4dFxuICB9O1xufVxuXG4vKipcbiAqIEFwcGVuZCBvbmUgRHJhZnR5IGRvY3VtZW50IHRvIGFub3RoZXIuXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGZpcnN0IERyYWZ0eSBkb2N1bWVudCB0byBhcHBlbmQgdG8uXG4gKiBAcGFyYW0ge0RyYWZ0eX0gc2Vjb25kIERyYWZ0eSBkb2N1bWVudCBiZWluZyBhcHBlbmRlZC5cbiAqXG4gKiBAcmV0dXJuIHtEcmFmdHl9IGZpcnN0IGRvY3VtZW50IHdpdGggdGhlIHNlY29uZCBhcHBlbmRlZCB0byBpdC5cbiAqL1xuRHJhZnR5LmFwcGVuZCA9IGZ1bmN0aW9uKGZpcnN0LCBzZWNvbmQpIHtcbiAgaWYgKGZpcnN0ID09IG51bGwpIHtcbiAgICByZXR1cm4gc2Vjb25kO1xuICB9XG4gIGlmIChzZWNvbmQgPT0gbnVsbCkge1xuICAgIHJldHVybiBmaXJzdDtcbiAgfVxuXG4gIGZpcnN0LnR4dCA9IGZpcnN0LnR4dCB8fCAnJztcbiAgc2Vjb25kLnR4dCA9IHNlY29uZC50eHQgfHwgJyc7XG4gIGNvbnN0IGxlbiA9IGZpcnN0LnR4dC5sZW5ndGg7XG5cbiAgZmlyc3QudHh0ICs9IHNlY29uZC50eHQ7XG4gIGlmIChBcnJheS5pc0FycmF5KHNlY29uZC5mbXQpKSB7XG4gICAgZmlyc3QuZm10ID0gZmlyc3QuZm10IHx8IFtdO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHNlY29uZC5lbnQpKSB7XG4gICAgICBmaXJzdC5lbnQgPSBmaXJzdC5lbnQgfHwgW107XG4gICAgfVxuICAgIHNlY29uZC5mbXQuZm9yRWFjaChzcmMgPT4ge1xuICAgICAgY29uc3QgZm10ID0ge1xuICAgICAgICBhdDogc3JjLmF0ICsgbGVuLFxuICAgICAgICBsZW46IHNyYy5sZW5cbiAgICAgIH07XG4gICAgICBpZiAoc3JjLnRwKSB7XG4gICAgICAgIGZtdC50cCA9IHNyYy50cDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZtdC5rZXkgPSBmaXJzdC5lbnQubGVuZ3RoO1xuICAgICAgICBmaXJzdC5lbnQucHVzaChzZWNvbmQuZW50W3NyYy5rZXkgfHwgMF0pO1xuICAgICAgfVxuICAgICAgZmlyc3QuZm10LnB1c2goZm10KTtcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBmaXJzdDtcbn1cblxuLyoqXG4gKiBJbnNlcnQgaW5saW5lIGltYWdlIGludG8gRHJhZnR5IGRvY3VtZW50LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IG9iamVjdCB0byBhZGQgaW1hZ2UgdG8uXG4gKiBAcGFyYW0ge2ludGVnZXJ9IGF0IGluZGV4IHdoZXJlIHRoZSBvYmplY3QgaXMgaW5zZXJ0ZWQuIFRoZSBsZW5ndGggb2YgdGhlIGltYWdlIGlzIGFsd2F5cyAxLlxuICogQHBhcmFtIHtzdHJpbmd9IG1pbWUgbWltZS10eXBlIG9mIHRoZSBpbWFnZSwgZS5nLiBcImltYWdlL3BuZ1wiXG4gKiBAcGFyYW0ge3N0cmluZ30gYmFzZTY0Yml0cyBiYXNlNjQtZW5jb2RlZCBpbWFnZSBjb250ZW50IChvciBwcmV2aWV3LCBpZiBsYXJnZSBpbWFnZSBpcyBhdHRhY2hlZClcbiAqIEBwYXJhbSB7aW50ZWdlcn0gd2lkdGggd2lkdGggb2YgdGhlIGltYWdlXG4gKiBAcGFyYW0ge2ludGVnZXJ9IGhlaWdodCBoZWlnaHQgb2YgdGhlIGltYWdlXG4gKiBAcGFyYW0ge3N0cmluZ30gZm5hbWUgZmlsZSBuYW1lIHN1Z2dlc3Rpb24gZm9yIGRvd25sb2FkaW5nIHRoZSBpbWFnZS5cbiAqIEBwYXJhbSB7aW50ZWdlcn0gc2l6ZSBzaXplIG9mIHRoZSBleHRlcm5hbCBmaWxlLiBUcmVhdCBpcyBhcyBhbiB1bnRydXN0ZWQgaGludC5cbiAqIEBwYXJhbSB7c3RyaW5nfSByZWZ1cmwgcmVmZXJlbmNlIHRvIHRoZSBjb250ZW50LiBDb3VsZCBiZSBudWxsIG9yIHVuZGVmaW5lZC5cbiAqXG4gKiBAcmV0dXJuIHtEcmFmdHl9IHVwZGF0ZWQgY29udGVudC5cbiAqL1xuRHJhZnR5Lmluc2VydEltYWdlID0gZnVuY3Rpb24oY29udGVudCwgYXQsIG1pbWUsIGJhc2U2NGJpdHMsIHdpZHRoLCBoZWlnaHQsIGZuYW1lLCBzaXplLCByZWZ1cmwpIHtcbiAgY29udGVudCA9IGNvbnRlbnQgfHwge1xuICAgIHR4dDogXCIgXCJcbiAgfTtcbiAgY29udGVudC5lbnQgPSBjb250ZW50LmVudCB8fCBbXTtcbiAgY29udGVudC5mbXQgPSBjb250ZW50LmZtdCB8fCBbXTtcblxuICBjb250ZW50LmZtdC5wdXNoKHtcbiAgICBhdDogYXQsXG4gICAgbGVuOiAxLFxuICAgIGtleTogY29udGVudC5lbnQubGVuZ3RoXG4gIH0pO1xuICBjb250ZW50LmVudC5wdXNoKHtcbiAgICB0cDogJ0lNJyxcbiAgICBkYXRhOiB7XG4gICAgICBtaW1lOiBtaW1lLFxuICAgICAgdmFsOiBiYXNlNjRiaXRzLFxuICAgICAgd2lkdGg6IHdpZHRoLFxuICAgICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgICBuYW1lOiBmbmFtZSxcbiAgICAgIHJlZjogcmVmdXJsLFxuICAgICAgc2l6ZTogc2l6ZSB8IDBcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBjb250ZW50O1xufVxuXG4vKipcbiAqIEFwcGVuZCBpbWFnZSB0byBEcmFmdHkgY29udGVudC5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCBvYmplY3QgdG8gYWRkIGltYWdlIHRvLlxuICogQHBhcmFtIHtzdHJpbmd9IG1pbWUgbWltZS10eXBlIG9mIHRoZSBpbWFnZSwgZS5nLiBcImltYWdlL3BuZ1wiXG4gKiBAcGFyYW0ge3N0cmluZ30gYmFzZTY0Yml0cyBiYXNlNjQtZW5jb2RlZCBpbWFnZSBjb250ZW50IChvciBwcmV2aWV3LCBpZiBsYXJnZSBpbWFnZSBpcyBhdHRhY2hlZClcbiAqIEBwYXJhbSB7aW50ZWdlcn0gd2lkdGggd2lkdGggb2YgdGhlIGltYWdlXG4gKiBAcGFyYW0ge2ludGVnZXJ9IGhlaWdodCBoZWlnaHQgb2YgdGhlIGltYWdlXG4gKiBAcGFyYW0ge3N0cmluZ30gZm5hbWUgZmlsZSBuYW1lIHN1Z2dlc3Rpb24gZm9yIGRvd25sb2FkaW5nIHRoZSBpbWFnZS5cbiAqIEBwYXJhbSB7aW50ZWdlcn0gc2l6ZSBzaXplIG9mIHRoZSBleHRlcm5hbCBmaWxlLiBUcmVhdCBpcyBhcyBhbiB1bnRydXN0ZWQgaGludC5cbiAqIEBwYXJhbSB7c3RyaW5nfSByZWZ1cmwgcmVmZXJlbmNlIHRvIHRoZSBjb250ZW50LiBDb3VsZCBiZSBudWxsIG9yIHVuZGVmaW5lZC5cbiAqXG4gKiBAcmV0dXJuIHtEcmFmdHl9IHVwZGF0ZWQgY29udGVudC5cbiAqL1xuRHJhZnR5LmFwcGVuZEltYWdlID0gZnVuY3Rpb24oY29udGVudCwgbWltZSwgYmFzZTY0Yml0cywgd2lkdGgsIGhlaWdodCwgZm5hbWUsIHNpemUsIHJlZnVybCkge1xuICBjb250ZW50ID0gY29udGVudCB8fCB7XG4gICAgdHh0OiBcIlwiXG4gIH07XG4gIGNvbnRlbnQudHh0ICs9IFwiIFwiO1xuICByZXR1cm4gRHJhZnR5Lmluc2VydEltYWdlKGNvbnRlbnQsIGNvbnRlbnQudHh0Lmxlbmd0aCAtIDEsIG1pbWUsIGJhc2U2NGJpdHMsIHdpZHRoLCBoZWlnaHQsIGZuYW1lLCBzaXplLCByZWZ1cmwpO1xufVxuXG4vKipcbiAqIEF0dGFjaCBmaWxlIHRvIERyYWZ0eSBjb250ZW50LiBFaXRoZXIgYXMgYSBibG9iIG9yIGFzIGEgcmVmZXJlbmNlLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IG9iamVjdCB0byBhdHRhY2ggZmlsZSB0by5cbiAqIEBwYXJhbSB7c3RyaW5nfSBtaW1lIG1pbWUtdHlwZSBvZiB0aGUgZmlsZSwgZS5nLiBcImltYWdlL3BuZ1wiXG4gKiBAcGFyYW0ge3N0cmluZ30gYmFzZTY0Yml0cyBiYXNlNjQtZW5jb2RlZCBmaWxlIGNvbnRlbnRcbiAqIEBwYXJhbSB7c3RyaW5nfSBmbmFtZSBmaWxlIG5hbWUgc3VnZ2VzdGlvbiBmb3IgZG93bmxvYWRpbmcuXG4gKiBAcGFyYW0ge2ludGVnZXJ9IHNpemUgc2l6ZSBvZiB0aGUgZXh0ZXJuYWwgZmlsZS4gVHJlYXQgaXMgYXMgYW4gdW50cnVzdGVkIGhpbnQuXG4gKiBAcGFyYW0ge3N0cmluZyB8IFByb21pc2V9IHJlZnVybCBvcHRpb25hbCByZWZlcmVuY2UgdG8gdGhlIGNvbnRlbnQuXG4gKlxuICogQHJldHVybiB7RHJhZnR5fSB1cGRhdGVkIGNvbnRlbnQuXG4gKi9cbkRyYWZ0eS5hdHRhY2hGaWxlID0gZnVuY3Rpb24oY29udGVudCwgbWltZSwgYmFzZTY0Yml0cywgZm5hbWUsIHNpemUsIHJlZnVybCkge1xuICBjb250ZW50ID0gY29udGVudCB8fCB7XG4gICAgdHh0OiBcIlwiXG4gIH07XG4gIGNvbnRlbnQuZW50ID0gY29udGVudC5lbnQgfHwgW107XG4gIGNvbnRlbnQuZm10ID0gY29udGVudC5mbXQgfHwgW107XG5cbiAgY29udGVudC5mbXQucHVzaCh7XG4gICAgYXQ6IC0xLFxuICAgIGxlbjogMCxcbiAgICBrZXk6IGNvbnRlbnQuZW50Lmxlbmd0aFxuICB9KTtcblxuICBsZXQgZXggPSB7XG4gICAgdHA6ICdFWCcsXG4gICAgZGF0YToge1xuICAgICAgbWltZTogbWltZSxcbiAgICAgIHZhbDogYmFzZTY0Yml0cyxcbiAgICAgIG5hbWU6IGZuYW1lLFxuICAgICAgcmVmOiByZWZ1cmwsXG4gICAgICBzaXplOiBzaXplIHwgMFxuICAgIH1cbiAgfVxuICBpZiAocmVmdXJsIGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgIGV4LmRhdGEucmVmID0gcmVmdXJsLnRoZW4oXG4gICAgICAodXJsKSA9PiB7XG4gICAgICAgIGV4LmRhdGEucmVmID0gdXJsO1xuICAgICAgfSxcbiAgICAgIChlcnIpID0+IHtcbiAgICAgICAgLyogY2F0Y2ggdGhlIGVycm9yLCBvdGhlcndpc2UgaXQgd2lsbCBhcHBlYXIgaW4gdGhlIGNvbnNvbGUuICovXG4gICAgICB9XG4gICAgKTtcbiAgfVxuICBjb250ZW50LmVudC5wdXNoKGV4KTtcblxuICByZXR1cm4gY29udGVudDtcbn1cblxuLyoqXG4gKiBXcmFwcyBjb250ZW50IGludG8gYW4gaW50ZXJhY3RpdmUgZm9ybS5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eXxzdHJpbmd9IGNvbnRlbnQgdG8gd3JhcCBpbnRvIGEgZm9ybS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBhdCBpbmRleCB3aGVyZSB0aGUgZm9ybXMgc3RhcnRzLlxuICogQHBhcmFtIHtudW1iZXJ9IGxlbiBsZW5ndGggb2YgdGhlIGZvcm0gY29udGVudC5cbiAqXG4gKiBAcmV0dXJuIHtEcmFmdHl9IHVwZGF0ZWQgY29udGVudC5cbiAqL1xuRHJhZnR5LndyYXBBc0Zvcm0gPSBmdW5jdGlvbihjb250ZW50LCBhdCwgbGVuKSB7XG4gIGlmICh0eXBlb2YgY29udGVudCA9PSAnc3RyaW5nJykge1xuICAgIGNvbnRlbnQgPSB7XG4gICAgICB0eHQ6IGNvbnRlbnRcbiAgICB9O1xuICB9XG4gIGNvbnRlbnQuZm10ID0gY29udGVudC5mbXQgfHwgW107XG5cbiAgY29udGVudC5mbXQucHVzaCh7XG4gICAgYXQ6IGF0LFxuICAgIGxlbjogbGVuLFxuICAgIHRwOiAnRk0nXG4gIH0pO1xuXG4gIHJldHVybiBjb250ZW50O1xufVxuXG4vKipcbiAqIEluc2VydCBjbGlja2FibGUgYnV0dG9uIGludG8gRHJhZnR5IGRvY3VtZW50LlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fHN0cmluZ30gY29udGVudCBpcyBEcmFmdHkgb2JqZWN0IHRvIGluc2VydCBidXR0b24gdG8gb3IgYSBzdHJpbmcgdG8gYmUgdXNlZCBhcyBidXR0b24gdGV4dC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBhdCBpcyBsb2NhdGlvbiB3aGVyZSB0aGUgYnV0dG9uIGlzIGluc2VydGVkLlxuICogQHBhcmFtIHtudW1iZXJ9IGxlbiBpcyB0aGUgbGVuZ3RoIG9mIHRoZSB0ZXh0IHRvIGJlIHVzZWQgYXMgYnV0dG9uIHRpdGxlLlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgb2YgdGhlIGJ1dHRvbi4gQ2xpZW50IHNob3VsZCByZXR1cm4gaXQgdG8gdGhlIHNlcnZlciB3aGVuIHRoZSBidXR0b24gaXMgY2xpY2tlZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBhY3Rpb25UeXBlIGlzIHRoZSB0eXBlIG9mIHRoZSBidXR0b24sIG9uZSBvZiAndXJsJyBvciAncHViJy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBhY3Rpb25WYWx1ZSBpcyB0aGUgdmFsdWUgdG8gcmV0dXJuIG9uIGNsaWNrOlxuICogQHBhcmFtIHtzdHJpbmd9IHJlZlVybCBpcyB0aGUgVVJMIHRvIGdvIHRvIHdoZW4gdGhlICd1cmwnIGJ1dHRvbiBpcyBjbGlja2VkLlxuICpcbiAqIEByZXR1cm4ge0RyYWZ0eX0gdXBkYXRlZCBjb250ZW50LlxuICovXG5EcmFmdHkuaW5zZXJ0QnV0dG9uID0gZnVuY3Rpb24oY29udGVudCwgYXQsIGxlbiwgbmFtZSwgYWN0aW9uVHlwZSwgYWN0aW9uVmFsdWUsIHJlZlVybCkge1xuICBpZiAodHlwZW9mIGNvbnRlbnQgPT0gJ3N0cmluZycpIHtcbiAgICBjb250ZW50ID0ge1xuICAgICAgdHh0OiBjb250ZW50XG4gICAgfTtcbiAgfVxuXG4gIGlmICghY29udGVudCB8fCAhY29udGVudC50eHQgfHwgY29udGVudC50eHQubGVuZ3RoIDwgYXQgKyBsZW4pIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmIChsZW4gPD0gMCB8fCBbJ3VybCcsICdwdWInXS5pbmRleE9mKGFjdGlvblR5cGUpID09IC0xKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgLy8gRW5zdXJlIHJlZlVybCBpcyBhIHN0cmluZy5cbiAgaWYgKGFjdGlvblR5cGUgPT0gJ3VybCcgJiYgIXJlZlVybCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJlZlVybCA9ICcnICsgcmVmVXJsO1xuXG4gIGNvbnRlbnQuZW50ID0gY29udGVudC5lbnQgfHwgW107XG4gIGNvbnRlbnQuZm10ID0gY29udGVudC5mbXQgfHwgW107XG5cbiAgY29udGVudC5mbXQucHVzaCh7XG4gICAgYXQ6IGF0LFxuICAgIGxlbjogbGVuLFxuICAgIGtleTogY29udGVudC5lbnQubGVuZ3RoXG4gIH0pO1xuICBjb250ZW50LmVudC5wdXNoKHtcbiAgICB0cDogJ0JOJyxcbiAgICBkYXRhOiB7XG4gICAgICBhY3Q6IGFjdGlvblR5cGUsXG4gICAgICB2YWw6IGFjdGlvblZhbHVlLFxuICAgICAgcmVmOiByZWZVcmwsXG4gICAgICBuYW1lOiBuYW1lXG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gY29udGVudDtcbn1cblxuLyoqXG4gKiBBcHBlbmQgY2xpY2thYmxlIGJ1dHRvbiB0byBEcmFmdHkgZG9jdW1lbnQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl8c3RyaW5nfSBjb250ZW50IGlzIERyYWZ0eSBvYmplY3QgdG8gaW5zZXJ0IGJ1dHRvbiB0byBvciBhIHN0cmluZyB0byBiZSB1c2VkIGFzIGJ1dHRvbiB0ZXh0LlxuICogQHBhcmFtIHtzdHJpbmd9IHRpdGxlIGlzIHRoZSB0ZXh0IHRvIGJlIHVzZWQgYXMgYnV0dG9uIHRpdGxlLlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgb2YgdGhlIGJ1dHRvbi4gQ2xpZW50IHNob3VsZCByZXR1cm4gaXQgdG8gdGhlIHNlcnZlciB3aGVuIHRoZSBidXR0b24gaXMgY2xpY2tlZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBhY3Rpb25UeXBlIGlzIHRoZSB0eXBlIG9mIHRoZSBidXR0b24sIG9uZSBvZiAndXJsJyBvciAncHViJy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBhY3Rpb25WYWx1ZSBpcyB0aGUgdmFsdWUgdG8gcmV0dXJuIG9uIGNsaWNrOlxuICogQHBhcmFtIHtzdHJpbmd9IHJlZlVybCBpcyB0aGUgVVJMIHRvIGdvIHRvIHdoZW4gdGhlICd1cmwnIGJ1dHRvbiBpcyBjbGlja2VkLlxuICpcbiAqIEByZXR1cm4ge0RyYWZ0eX0gdXBkYXRlZCBjb250ZW50LlxuICovXG5EcmFmdHkuYXBwZW5kQnV0dG9uID0gZnVuY3Rpb24oY29udGVudCwgdGl0bGUsIG5hbWUsIGFjdGlvblR5cGUsIGFjdGlvblZhbHVlLCByZWZVcmwpIHtcbiAgY29udGVudCA9IGNvbnRlbnQgfHwge1xuICAgIHR4dDogXCJcIlxuICB9O1xuICBsZXQgYXQgPSBjb250ZW50LnR4dC5sZW5ndGg7XG4gIGNvbnRlbnQudHh0ICs9IHRpdGxlO1xuICByZXR1cm4gRHJhZnR5Lmluc2VydEJ1dHRvbihjb250ZW50LCBhdCwgdGl0bGUubGVuZ3RoLCBuYW1lLCBhY3Rpb25UeXBlLCBhY3Rpb25WYWx1ZSwgcmVmVXJsKTtcbn1cblxuLyoqXG4gKiBBdHRhY2ggYSBnZW5lcmljIEpTIG9iamVjdC4gVGhlIG9iamVjdCBpcyBhdHRhY2hlZCBhcyBhIGpzb24gc3RyaW5nLlxuICogSW50ZW5kZWQgZm9yIHJlcHJlc2VudGluZyBhIGZvcm0gcmVzcG9uc2UuXG4gKlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IG9iamVjdCB0byBhdHRhY2ggZmlsZSB0by5cbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIHRvIGNvbnZlcnQgdG8ganNvbiBzdHJpbmcgYW5kIGF0dGFjaC5cbiAqL1xuRHJhZnR5LmF0dGFjaEpTT04gPSBmdW5jdGlvbihjb250ZW50LCBkYXRhKSB7XG4gIGNvbnRlbnQgPSBjb250ZW50IHx8IHtcbiAgICB0eHQ6IFwiXCJcbiAgfTtcbiAgY29udGVudC5lbnQgPSBjb250ZW50LmVudCB8fCBbXTtcbiAgY29udGVudC5mbXQgPSBjb250ZW50LmZtdCB8fCBbXTtcblxuICBjb250ZW50LmZtdC5wdXNoKHtcbiAgICBhdDogLTEsXG4gICAgbGVuOiAwLFxuICAgIGtleTogY29udGVudC5lbnQubGVuZ3RoXG4gIH0pO1xuXG4gIGNvbnRlbnQuZW50LnB1c2goe1xuICAgIHRwOiAnRVgnLFxuICAgIGRhdGE6IHtcbiAgICAgIG1pbWU6IEpTT05fTUlNRV9UWVBFLFxuICAgICAgdmFsOiBkYXRhXG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gY29udGVudDtcbn1cblxuRHJhZnR5LmFwcGVuZExpbmVCcmVhayA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcbiAgY29udGVudCA9IGNvbnRlbnQgfHwge1xuICAgIHR4dDogXCJcIlxuICB9O1xuICBjb250ZW50LmZtdCA9IGNvbnRlbnQuZm10IHx8IFtdO1xuICBjb250ZW50LmZtdC5wdXNoKHtcbiAgICBhdDogY29udGVudC50eHQubGVuZ3RoLFxuICAgIGxlbjogMSxcbiAgICB0cDogJ0JSJ1xuICB9KTtcbiAgY29udGVudC50eHQgKz0gXCIgXCI7XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG4vKipcbiAqIEdpdmVuIHRoZSBzdHJ1Y3R1cmVkIHJlcHJlc2VudGF0aW9uIG9mIHJpY2ggdGV4dCwgY29udmVydCBpdCB0byBIVE1MLlxuICogTm8gYXR0ZW1wdCBpcyBtYWRlIHRvIHN0cmlwIHByZS1leGlzdGluZyBodG1sIG1hcmt1cC5cbiAqIFRoaXMgaXMgcG90ZW50aWFsbHkgdW5zYWZlIGJlY2F1c2UgYGNvbnRlbnQudHh0YCBtYXkgY29udGFpbiBtYWxpY2lvdXNcbiAqIG1hcmt1cC5cbiAqIEBtZW1iZXJvZiBUaW5vZGUuRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtkcmFmeX0gY29udGVudCAtIHN0cnVjdHVyZWQgcmVwcmVzZW50YXRpb24gb2YgcmljaCB0ZXh0LlxuICpcbiAqIEByZXR1cm4gSFRNTC1yZXByZXNlbnRhdGlvbiBvZiBjb250ZW50LlxuICovXG5EcmFmdHkuVU5TQUZFX3RvSFRNTCA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcbiAgdmFyIHtcbiAgICB0eHQsXG4gICAgZm10LFxuICAgIGVudFxuICB9ID0gY29udGVudDtcblxuICB2YXIgbWFya3VwID0gW107XG4gIGlmIChmbXQpIHtcbiAgICBmb3IgKGxldCBpIGluIGZtdCkge1xuICAgICAgbGV0IHJhbmdlID0gZm10W2ldO1xuICAgICAgbGV0IHRwID0gcmFuZ2UudHAsXG4gICAgICAgIGRhdGE7XG4gICAgICBpZiAoIXRwKSB7XG4gICAgICAgIGxldCBlbnRpdHkgPSBlbnRbcmFuZ2Uua2V5IHwgMF07XG4gICAgICAgIGlmIChlbnRpdHkpIHtcbiAgICAgICAgICB0cCA9IGVudGl0eS50cDtcbiAgICAgICAgICBkYXRhID0gZW50aXR5LmRhdGE7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKERFQ09SQVRPUlNbdHBdKSB7XG4gICAgICAgIC8vIEJlY2F1c2Ugd2UgbGF0ZXIgc29ydCBpbiBkZXNjZW5kaW5nIG9yZGVyLCBjbG9zaW5nIG1hcmt1cCBtdXN0IGNvbWUgZmlyc3QuXG4gICAgICAgIC8vIE90aGVyd2lzZSB6ZXJvLWxlbmd0aCBvYmplY3RzIHdpbGwgbm90IGJlIHJlcHJlc2VudGVkIGNvcnJlY3RseS5cbiAgICAgICAgbWFya3VwLnB1c2goe1xuICAgICAgICAgIGlkeDogcmFuZ2UuYXQgKyByYW5nZS5sZW4sXG4gICAgICAgICAgbGVuOiAtcmFuZ2UubGVuLFxuICAgICAgICAgIHdoYXQ6IERFQ09SQVRPUlNbdHBdLmNsb3NlKGRhdGEpXG4gICAgICAgIH0pO1xuICAgICAgICBtYXJrdXAucHVzaCh7XG4gICAgICAgICAgaWR4OiByYW5nZS5hdCxcbiAgICAgICAgICBsZW46IHJhbmdlLmxlbixcbiAgICAgICAgICB3aGF0OiBERUNPUkFUT1JTW3RwXS5vcGVuKGRhdGEpXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG1hcmt1cC5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICByZXR1cm4gYi5pZHggPT0gYS5pZHggPyBiLmxlbiAtIGEubGVuIDogYi5pZHggLSBhLmlkeDsgLy8gaW4gZGVzY2VuZGluZyBvcmRlclxuICB9KTtcblxuICBmb3IgKHZhciBpIGluIG1hcmt1cCkge1xuICAgIGlmIChtYXJrdXBbaV0ud2hhdCkge1xuICAgICAgdHh0ID0gc3BsaWNlKHR4dCwgbWFya3VwW2ldLmlkeCwgbWFya3VwW2ldLndoYXQpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0eHQ7XG59XG5cbi8qKlxuICogQ2FsbGJhY2sgZm9yIGFwcGx5aW5nIGN1c3RvbSBmb3JtYXR0aW5nL3RyYW5zZm9ybWF0aW9uIHRvIGEgRHJhZnR5IG9iamVjdC5cbiAqIENhbGxlZCBvbmNlIGZvciBlYWNoIHN5bGUgc3Bhbi5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAY2FsbGJhY2sgRm9ybWF0dGVyXG4gKiBAcGFyYW0ge3N0cmluZ30gc3R5bGUgc3R5bGUgY29kZSBzdWNoIGFzIFwiU1RcIiBvciBcIklNXCIuXG4gKiBAcGFyYW0ge09iamVjdH0gZGF0YSBlbnRpdHkncyBkYXRhXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsdWVzIHBvc3NpYmx5IHN0eWxlZCBzdWJzcGFucyBjb250YWluZWQgaW4gdGhpcyBzdHlsZSBzcGFuLlxuICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IG9mIHRoZSBjdXJyZW50IGVsZW1lbnQgYW1vbmcgaXRzIHNpYmxpbmdzLlxuICovXG5cbi8qKlxuICogVHJhbnNmb3JtIERyYWZ0eSB1c2luZyBjdXN0b20gZm9ybWF0dGluZy5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIGNvbnRlbnQgdG8gdHJhbnNmb3JtLlxuICogQHBhcmFtIHtGb3JtYXR0ZXJ9IGZvcm1hdHRlciAtIGNhbGxiYWNrIHdoaWNoIHRyYW5zZm9ybXMgaW5kaXZpZHVhbCBlbGVtZW50c1xuICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSBjb250ZXh0IHByb3ZpZGVkIHRvIGZvcm1hdHRlciBhcyAndGhpcycuXG4gKlxuICogQHJldHVybiB7T2JqZWN0fSB0cmFuc2Zvcm1lZCBvYmplY3RcbiAqL1xuRHJhZnR5LmZvcm1hdCA9IGZ1bmN0aW9uKGNvbnRlbnQsIGZvcm1hdHRlciwgY29udGV4dCkge1xuICBsZXQge1xuICAgIHR4dCxcbiAgICBmbXQsXG4gICAgZW50XG4gIH0gPSBjb250ZW50O1xuXG4gIC8vIEFzc2lnbiBkZWZhdWx0IHZhbHVlcy5cbiAgdHh0ID0gdHh0IHx8IFwiXCI7XG4gIGlmICghQXJyYXkuaXNBcnJheShlbnQpKSB7XG4gICAgZW50ID0gW107XG4gIH1cblxuICBpZiAoIUFycmF5LmlzQXJyYXkoZm10KSkge1xuICAgIC8vIEhhbmRsZSBzcGVjaWFsIGNhc2Ugd2hlbiBhbGwgdmFsdWVzIGluIGZtdCBhcmUgMCBhbmQgZm10IGlzIHNraXBwZWQuXG4gICAgaWYgKGVudC5sZW5ndGggPT0gMSkge1xuICAgICAgZm10ID0gW3tcbiAgICAgICAgYXQ6IDAsXG4gICAgICAgIGxlbjogMCxcbiAgICAgICAga2V5OiAwXG4gICAgICB9XTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFt0eHRdO1xuICAgIH1cbiAgfVxuXG4gIGxldCBzcGFucyA9IFtdLmNvbmNhdChmbXQpO1xuXG4gIC8vIFplcm8gdmFsdWVzIG1heSBoYXZlIGJlZW4gc3RyaXBwZWQuIFJlc3RvcmUgdGhlbS5cbiAgLy8gQWxzbyBlbnN1cmUgaW5kZXhlcyBhbmQgbGVuZ3RocyBhcmUgc2FuZS5cbiAgc3BhbnMubWFwKGZ1bmN0aW9uKHMpIHtcbiAgICBzLmF0ID0gcy5hdCB8fCAwO1xuICAgIHMubGVuID0gcy5sZW4gfHwgMDtcbiAgICBpZiAocy5sZW4gPCAwKSB7XG4gICAgICBzLmxlbiA9IDA7XG4gICAgfVxuICAgIGlmIChzLmF0IDwgLTEpIHtcbiAgICAgIHMuYXQgPSAtMTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIFNvcnQgc3BhbnMgZmlyc3QgYnkgc3RhcnQgaW5kZXggKGFzYykgdGhlbiBieSBsZW5ndGggKGRlc2MpLlxuICBzcGFucy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICBpZiAoYS5hdCAtIGIuYXQgPT0gMCkge1xuICAgICAgcmV0dXJuIGIubGVuIC0gYS5sZW47IC8vIGxvbmdlciBvbmUgY29tZXMgZmlyc3QgKDwwKVxuICAgIH1cbiAgICByZXR1cm4gYS5hdCAtIGIuYXQ7XG4gIH0pO1xuXG4gIC8vIERlbm9ybWFsaXplIGVudGl0aWVzIGludG8gc3BhbnMuIENyZWF0ZSBhIGNvcHkgb2YgdGhlIG9iamVjdHMgdG8gbGVhdmVcbiAgLy8gb3JpZ2luYWwgRHJhZnR5IG9iamVjdCB1bmNoYW5nZWQuXG4gIHNwYW5zID0gc3BhbnMubWFwKChzKSA9PiB7XG4gICAgbGV0IGRhdGE7XG4gICAgbGV0IHRwID0gcy50cDtcbiAgICBpZiAoIXRwKSB7XG4gICAgICBzLmtleSA9IHMua2V5IHx8IDA7XG4gICAgICBpZiAoZW50W3Mua2V5XSkge1xuICAgICAgICBkYXRhID0gZW50W3Mua2V5XS5kYXRhO1xuICAgICAgICB0cCA9IGVudFtzLmtleV0udHA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gVHlwZSBzdGlsbCBub3QgZGVmaW5lZD8gSGlkZSBpbnZhbGlkIGVsZW1lbnQuXG4gICAgdHAgPSB0cCB8fCAnSEQnO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHRwOiB0cCxcbiAgICAgIGRhdGE6IGRhdGEsXG4gICAgICBhdDogcy5hdCxcbiAgICAgIGxlbjogcy5sZW5cbiAgICB9O1xuICB9KTtcblxuICByZXR1cm4gZm9yRWFjaCh0eHQsIDAsIHR4dC5sZW5ndGgsIHNwYW5zLCBmb3JtYXR0ZXIsIGNvbnRleHQpO1xufVxuXG4vKipcbiAqIEdpdmVuIHN0cnVjdHVyZWQgcmVwcmVzZW50YXRpb24gb2YgcmljaCB0ZXh0LCBjb252ZXJ0IGl0IHRvIHBsYWluIHRleHQuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBjb250ZW50IHRvIGNvbnZlcnQgdG8gcGxhaW4gdGV4dC5cbiAqL1xuRHJhZnR5LnRvUGxhaW5UZXh0ID0gZnVuY3Rpb24oY29udGVudCkge1xuICByZXR1cm4gdHlwZW9mIGNvbnRlbnQgPT0gJ3N0cmluZycgPyBjb250ZW50IDogY29udGVudC50eHQ7XG59XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIGNvbnRlbnQgaGFzIG5vIG1hcmt1cCBhbmQgbm8gZW50aXRpZXMuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtEcmFmdHl9IGNvbnRlbnQgLSBjb250ZW50IHRvIGNoZWNrIGZvciBwcmVzZW5jZSBvZiBtYXJrdXAuXG4gKiBAcmV0dXJucyB0cnVlIGlzIGNvbnRlbnQgaXMgcGxhaW4gdGV4dCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICovXG5EcmFmdHkuaXNQbGFpblRleHQgPSBmdW5jdGlvbihjb250ZW50KSB7XG4gIHJldHVybiB0eXBlb2YgY29udGVudCA9PSAnc3RyaW5nJyB8fCAhKGNvbnRlbnQuZm10IHx8IGNvbnRlbnQuZW50KTtcbn1cblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgZHJhZnR5IGNvbnRlbnQgaGFzIGF0dGFjaG1lbnRzLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7RHJhZnR5fSBjb250ZW50IC0gY29udGVudCB0byBjaGVjayBmb3IgYXR0YWNobWVudHMuXG4gKiBAcmV0dXJucyB0cnVlIGlmIHRoZXJlIGFyZSBhdHRhY2htZW50cy5cbiAqL1xuRHJhZnR5Lmhhc0F0dGFjaG1lbnRzID0gZnVuY3Rpb24oY29udGVudCkge1xuICBpZiAoY29udGVudC5lbnQgJiYgY29udGVudC5lbnQubGVuZ3RoID4gMCkge1xuICAgIGZvciAodmFyIGkgaW4gY29udGVudC5lbnQpIHtcbiAgICAgIGlmIChjb250ZW50LmVudFtpXSAmJiBjb250ZW50LmVudFtpXS50cCA9PSAnRVgnKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogQ2FsbGJhY2sgZm9yIGFwcGx5aW5nIGN1c3RvbSBmb3JtYXR0aW5nL3RyYW5zZm9ybWF0aW9uIHRvIGEgRHJhZnR5IG9iamVjdC5cbiAqIENhbGxlZCBvbmNlIGZvciBlYWNoIHN5bGUgc3Bhbi5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAY2FsbGJhY2sgQXR0YWNobWVudENhbGxiYWNrXG4gKiBAcGFyYW0ge09iamVjdH0gZGF0YSBhdHRhY2htZW50IGRhdGFcbiAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCBhdHRhY2htZW50J3MgaW5kZXggaW4gYGNvbnRlbnQuZW50YC5cbiAqL1xuXG4vKipcbiAqIEVudW1lcmF0ZSBhdHRhY2htZW50cy5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge0RyYWZ0eX0gY29udGVudCAtIGRyYWZ0eSBvYmplY3QgdG8gcHJvY2VzcyBmb3IgYXR0YWNobWVudHMuXG4gKiBAcGFyYW0ge0F0dGFjaG1lbnRDYWxsYmFja30gY2FsbGJhY2sgLSBjYWxsYmFjayB0byBjYWxsIGZvciBlYWNoIGF0dGFjaG1lbnQuXG4gKiBAcGFyYW0ge09iamVjdH0gY29udGVudCAtIHZhbHVlIG9mIFwidGhpc1wiIGZvciBjYWxsYmFjay5cbiAqL1xuRHJhZnR5LmF0dGFjaG1lbnRzID0gZnVuY3Rpb24oY29udGVudCwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgaWYgKGNvbnRlbnQuZW50ICYmIGNvbnRlbnQuZW50Lmxlbmd0aCA+IDApIHtcbiAgICBmb3IgKHZhciBpIGluIGNvbnRlbnQuZW50KSB7XG4gICAgICBpZiAoY29udGVudC5lbnRbaV0gJiYgY29udGVudC5lbnRbaV0udHAgPT0gJ0VYJykge1xuICAgICAgICBjYWxsYmFjay5jYWxsKGNvbnRleHQsIGNvbnRlbnQuZW50W2ldLmRhdGEsIGkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEdpdmVuIHRoZSBlbnRpdHksIGdldCBVUkwgd2hpY2ggY2FuIGJlIHVzZWQgZm9yIGRvd25sb2FkaW5nXG4gKiBlbnRpdHkgZGF0YS5cbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZW50aXR5LmRhdGEgdG8gZ2V0IHRoZSBVUmwgZnJvbS5cbiAqL1xuRHJhZnR5LmdldERvd25sb2FkVXJsID0gZnVuY3Rpb24oZW50RGF0YSkge1xuICBsZXQgdXJsID0gbnVsbDtcbiAgaWYgKGVudERhdGEubWltZSAhPSBKU09OX01JTUVfVFlQRSAmJiBlbnREYXRhLnZhbCkge1xuICAgIHVybCA9IGJhc2U2NHRvT2JqZWN0VXJsKGVudERhdGEudmFsLCBlbnREYXRhLm1pbWUpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBlbnREYXRhLnJlZiA9PSAnc3RyaW5nJykge1xuICAgIHVybCA9IGVudERhdGEucmVmO1xuICB9XG4gIHJldHVybiB1cmw7XG59XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhlIGVudGl0eSBkYXRhIGlzIGJlaW5nIHVwbG9hZGVkIHRvIHRoZSBzZXJ2ZXIuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGVudGl0eS5kYXRhIHRvIGdldCB0aGUgVVJsIGZyb20uXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiB1cGxvYWQgaXMgaW4gcHJvZ3Jlc3MsIGZhbHNlIG90aGVyd2lzZS5cbiAqL1xuRHJhZnR5LmlzVXBsb2FkaW5nID0gZnVuY3Rpb24oZW50RGF0YSkge1xuICByZXR1cm4gZW50RGF0YS5yZWYgaW5zdGFuY2VvZiBQcm9taXNlO1xufVxuXG4vKipcbiAqIEdpdmVuIHRoZSBlbnRpdHksIGdldCBVUkwgd2hpY2ggY2FuIGJlIHVzZWQgZm9yIHByZXZpZXdpbmdcbiAqIHRoZSBlbnRpdHkuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGVudGl0eS5kYXRhIHRvIGdldCB0aGUgVVJsIGZyb20uXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gdXJsIGZvciBwcmV2aWV3aW5nIG9yIG51bGwgaWYgbm8gc3VjaCB1cmwgaXMgYXZhaWxhYmxlLlxuICovXG5EcmFmdHkuZ2V0UHJldmlld1VybCA9IGZ1bmN0aW9uKGVudERhdGEpIHtcbiAgcmV0dXJuIGVudERhdGEudmFsID8gYmFzZTY0dG9PYmplY3RVcmwoZW50RGF0YS52YWwsIGVudERhdGEubWltZSkgOiBudWxsO1xufVxuXG4vKipcbiAqIEdldCBhcHByb3hpbWF0ZSBzaXplIG9mIHRoZSBlbnRpdHkuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGVudGl0eS5kYXRhIHRvIGdldCB0aGUgc2l6ZSBmb3IuXG4gKi9cbkRyYWZ0eS5nZXRFbnRpdHlTaXplID0gZnVuY3Rpb24oZW50RGF0YSkge1xuICAvLyBFaXRoZXIgc2l6ZSBoaW50IG9yIGxlbmd0aCBvZiB2YWx1ZS4gVGhlIHZhbHVlIGlzIGJhc2U2NCBlbmNvZGVkLFxuICAvLyB0aGUgYWN0dWFsIG9iamVjdCBzaXplIGlzIHNtYWxsZXIgdGhhbiB0aGUgZW5jb2RlZCBsZW5ndGguXG4gIHJldHVybiBlbnREYXRhLnNpemUgPyBlbnREYXRhLnNpemUgOiBlbnREYXRhLnZhbCA/IChlbnREYXRhLnZhbC5sZW5ndGggKiAwLjc1KSB8IDAgOiAwO1xufVxuXG4vKipcbiAqIEdldCBlbnRpdHkgbWltZSB0eXBlLlxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBlbnRpdHkuZGF0YSB0byBnZXQgdGhlIHR5cGUgZm9yLlxuICovXG5EcmFmdHkuZ2V0RW50aXR5TWltZVR5cGUgPSBmdW5jdGlvbihlbnREYXRhKSB7XG4gIHJldHVybiBlbnREYXRhLm1pbWUgfHwgJ3RleHQvcGxhaW4nO1xufVxuXG4vKipcbiAqIEdldCBIVE1MIHRhZyBmb3IgYSBnaXZlbiB0d28tbGV0dGVyIHN0eWxlIG5hbWVcbiAqIEBtZW1iZXJvZiBEcmFmdHlcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3R5bGUgLSB0d28tbGV0dGVyIHN0eWxlLCBsaWtlIFNUIG9yIExOXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gdGFnIG5hbWVcbiAqL1xuRHJhZnR5LnRhZ05hbWUgPSBmdW5jdGlvbihzdHlsZSkge1xuICByZXR1cm4gSFRNTF9UQUdTW3N0eWxlXSA/IEhUTUxfVEFHU1tzdHlsZV0ubmFtZSA6IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBGb3IgYSBnaXZlbiBkYXRhIGJ1bmRsZSBnZW5lcmF0ZSBhbiBvYmplY3Qgd2l0aCBIVE1MIGF0dHJpYnV0ZXMsXG4gKiBmb3IgaW5zdGFuY2UsIGdpdmVuIHt1cmw6IFwiaHR0cDovL3d3dy5leGFtcGxlLmNvbS9cIn0gcmV0dXJuXG4gKiB7aHJlZjogXCJodHRwOi8vd3d3LmV4YW1wbGUuY29tL1wifVxuICogQG1lbWJlcm9mIERyYWZ0eVxuICogQHN0YXRpY1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHlsZSAtIHR3LWxldHRlciBzdHlsZSB0byBnZW5lcmF0ZSBhdHRyaWJ1dGVzIGZvci5cbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIC0gZGF0YSBidW5kbGUgdG8gY29udmVydCB0byBhdHRyaWJ1dGVzXG4gKlxuICogQHJldHVybnMge09iamVjdH0gb2JqZWN0IHdpdGggSFRNTCBhdHRyaWJ1dGVzLlxuICovXG5EcmFmdHkuYXR0clZhbHVlID0gZnVuY3Rpb24oc3R5bGUsIGRhdGEpIHtcbiAgaWYgKGRhdGEgJiYgREVDT1JBVE9SU1tzdHlsZV0pIHtcbiAgICByZXR1cm4gREVDT1JBVE9SU1tzdHlsZV0ucHJvcHMoZGF0YSk7XG4gIH1cblxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIERyYWZ0eSBNSU1FIHR5cGUuXG4gKiBAbWVtYmVyb2YgRHJhZnR5XG4gKiBAc3RhdGljXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gSFRUUCBDb250ZW50LVR5cGUgXCJ0ZXh0L3gtZHJhZnR5XCIuXG4gKi9cbkRyYWZ0eS5nZXRDb250ZW50VHlwZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gJ3RleHQveC1kcmFmdHknO1xufVxuXG5pZiAodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJykge1xuICBtb2R1bGUuZXhwb3J0cyA9IERyYWZ0eTtcbn1cbiIsIi8qKlxuICogQGZpbGUgU0RLIHRvIGNvbm5lY3QgdG8gVGlub2RlIGNoYXQgc2VydmVyLlxuICogU2VlIDxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vdGlub2RlL3dlYmFwcFwiPlxuICogaHR0cHM6Ly9naXRodWIuY29tL3Rpbm9kZS93ZWJhcHA8L2E+IGZvciByZWFsLWxpZmUgdXNhZ2UuXG4gKlxuICogQGNvcHlyaWdodCAyMDE1LTIwMTkgVGlub2RlXG4gKiBAc3VtbWFyeSBKYXZhc2NyaXB0IGJpbmRpbmdzIGZvciBUaW5vZGUuXG4gKiBAbGljZW5zZSBBcGFjaGUgMi4wXG4gKiBAdmVyc2lvbiAwLjE2XG4gKlxuICogQGV4YW1wbGVcbiAqIDxoZWFkPlxuICogPHNjcmlwdCBzcmM9XCIuLi4vdGlub2RlLmpzXCI+PC9zY3JpcHQ+XG4gKiA8L2hlYWQ+XG4gKlxuICogPGJvZHk+XG4gKiAgLi4uXG4gKiA8c2NyaXB0PlxuICogIC8vIEluc3RhbnRpYXRlIHRpbm9kZS5cbiAqICBjb25zdCB0aW5vZGUgPSBuZXcgVGlub2RlKEFQUF9OQU1FLCBIT1NULCBBUElfS0VZLCBudWxsLCB0cnVlKTtcbiAqICB0aW5vZGUuZW5hYmxlTG9nZ2luZyh0cnVlKTtcbiAqICAvLyBBZGQgbG9naWMgdG8gaGFuZGxlIGRpc2Nvbm5lY3RzLlxuICogIHRpbm9kZS5vbkRpc2Nvbm5lY3QgPSBmdW5jdGlvbihlcnIpIHsgLi4uIH07XG4gKiAgLy8gQ29ubmVjdCB0byB0aGUgc2VydmVyLlxuICogIHRpbm9kZS5jb25uZWN0KCkudGhlbigoKSA9PiB7XG4gKiAgICAvLyBDb25uZWN0ZWQuIExvZ2luIG5vdy5cbiAqICAgIHJldHVybiB0aW5vZGUubG9naW5CYXNpYyhsb2dpbiwgcGFzc3dvcmQpO1xuICogIH0pLnRoZW4oKGN0cmwpID0+IHtcbiAqICAgIC8vIExvZ2dlZCBpbiBmaW5lLCBhdHRhY2ggY2FsbGJhY2tzLCBzdWJzY3JpYmUgdG8gJ21lJy5cbiAqICAgIGNvbnN0IG1lID0gdGlub2RlLmdldE1lVG9waWMoKTtcbiAqICAgIG1lLm9uTWV0YURlc2MgPSBmdW5jdGlvbihtZXRhKSB7IC4uLiB9O1xuICogICAgLy8gU3Vic2NyaWJlLCBmZXRjaCB0b3BpYyBkZXNjcmlwdGlvbiBhbmQgdGhlIGxpc3Qgb2YgY29udGFjdHMuXG4gKiAgICBtZS5zdWJzY3JpYmUoe2dldDoge2Rlc2M6IHt9LCBzdWI6IHt9fSk7XG4gKiAgfSkuY2F0Y2goKGVycikgPT4ge1xuICogICAgLy8gTG9naW4gb3Igc3Vic2NyaXB0aW9uIGZhaWxlZCwgZG8gc29tZXRoaW5nLlxuICogICAgLi4uXG4gKiAgfSk7XG4gKiAgLi4uXG4gKiA8L3NjcmlwdD5cbiAqIDwvYm9keT5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG4vLyBOT1RFIFRPIERFVkVMT1BFUlM6XG4vLyBMb2NhbGl6YWJsZSBzdHJpbmdzIHNob3VsZCBiZSBkb3VibGUgcXVvdGVkIFwi0YHRgtGA0L7QutCwINC90LAg0LTRgNGD0LPQvtC8INGP0LfRi9C60LVcIixcbi8vIG5vbi1sb2NhbGl6YWJsZSBzdHJpbmdzIHNob3VsZCBiZSBzaW5nbGUgcXVvdGVkICdub24tbG9jYWxpemVkJy5cblxuaWYgKHR5cGVvZiByZXF1aXJlID09ICdmdW5jdGlvbicpIHtcbiAgaWYgKHR5cGVvZiBEcmFmdHkgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICB2YXIgRHJhZnR5ID0gcmVxdWlyZSgnLi9kcmFmdHkuanMnKTtcbiAgfVxuICB2YXIgcGFja2FnZV92ZXJzaW9uID0gcmVxdWlyZSgnLi4vdmVyc2lvbi5qc29uJykudmVyc2lvbjtcbn1cblxubGV0IFdlYlNvY2tldFByb3ZpZGVyO1xuaWYgKHR5cGVvZiBXZWJTb2NrZXQgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgV2ViU29ja2V0UHJvdmlkZXIgPSBXZWJTb2NrZXQ7XG59XG5cbmxldCBYSFJQcm92aWRlcjtcbmlmICh0eXBlb2YgWE1MSHR0cFJlcXVlc3QgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgWEhSUHJvdmlkZXIgPSBYTUxIdHRwUmVxdWVzdDtcbn1cbmluaXRGb3JOb25Ccm93c2VyQXBwKCk7XG5cbi8vIEdsb2JhbCBjb25zdGFudHNcbmNvbnN0IFBST1RPQ09MX1ZFUlNJT04gPSAnMCc7XG5jb25zdCBWRVJTSU9OID0gcGFja2FnZV92ZXJzaW9uIHx8ICcwLjE2JztcbmNvbnN0IExJQlJBUlkgPSAndGlub2RlanMvJyArIFZFUlNJT047XG5cbmNvbnN0IFRPUElDX05FVyA9ICduZXcnO1xuY29uc3QgVE9QSUNfTUUgPSAnbWUnO1xuY29uc3QgVE9QSUNfRk5EID0gJ2ZuZCc7XG5jb25zdCBUT1BJQ19TWVMgPSAnc3lzJztcbmNvbnN0IFVTRVJfTkVXID0gJ25ldyc7XG5cbi8vIFN0YXJ0aW5nIHZhbHVlIG9mIGEgbG9jYWxseS1nZW5lcmF0ZWQgc2VxSWQgdXNlZCBmb3IgcGVuZGluZyBtZXNzYWdlcy5cbmNvbnN0IExPQ0FMX1NFUUlEID0gMHhGRkZGRkZGO1xuXG5jb25zdCBNRVNTQUdFX1NUQVRVU19OT05FID0gMDsgLy8gU3RhdHVzIG5vdCBhc3NpZ25lZC5cbmNvbnN0IE1FU1NBR0VfU1RBVFVTX1FVRVVFRCA9IDE7IC8vIExvY2FsIElEIGFzc2lnbmVkLCBpbiBwcm9ncmVzcyB0byBiZSBzZW50LlxuY29uc3QgTUVTU0FHRV9TVEFUVVNfU0VORElORyA9IDI7IC8vIFRyYW5zbWlzc2lvbiBzdGFydGVkLlxuY29uc3QgTUVTU0FHRV9TVEFUVVNfRkFJTEVEID0gMzsgLy8gQXQgbGVhc3Qgb25lIGF0dGVtcHQgd2FzIG1hZGUgdG8gc2VuZCB0aGUgbWVzc2FnZS5cbmNvbnN0IE1FU1NBR0VfU1RBVFVTX1NFTlQgPSA0OyAvLyBEZWxpdmVyZWQgdG8gdGhlIHNlcnZlci5cbmNvbnN0IE1FU1NBR0VfU1RBVFVTX1JFQ0VJVkVEID0gNTsgLy8gUmVjZWl2ZWQgYnkgdGhlIGNsaWVudC5cbmNvbnN0IE1FU1NBR0VfU1RBVFVTX1JFQUQgPSA2OyAvLyBSZWFkIGJ5IHRoZSB1c2VyLlxuY29uc3QgTUVTU0FHRV9TVEFUVVNfVE9fTUUgPSA3OyAvLyBNZXNzYWdlIGZyb20gYW5vdGhlciB1c2VyLlxuXG4vLyBFcnJvciBjb2RlIHRvIHJldHVybiBpbiBjYXNlIG9mIGEgbmV0d29yayBwcm9ibGVtLlxuY29uc3QgTkVUV09SS19FUlJPUiA9IDUwMztcbmNvbnN0IE5FVFdPUktfRVJST1JfVEVYVCA9IFwiQ29ubmVjdGlvbiBmYWlsZWRcIjtcblxuLy8gUmVqZWN0IHVucmVzb2x2ZWQgZnV0dXJlcyBhZnRlciB0aGlzIG1hbnkgbWlsbGlzZWNvbmRzLlxuY29uc3QgRVhQSVJFX1BST01JU0VTX1RJTUVPVVQgPSA1MDAwO1xuLy8gUGVyaW9kaWNpdHkgb2YgZ2FyYmFnZSBjb2xsZWN0aW9uIG9mIHVucmVzb2x2ZWQgZnV0dXJlcy5cbmNvbnN0IEVYUElSRV9QUk9NSVNFU19QRVJJT0QgPSAxMDAwO1xuXG4vLyBFcnJvciBjb2RlIHRvIHJldHVybiB3aGVuIHVzZXIgZGlzY29ubmVjdGVkIGZyb20gc2VydmVyLlxuY29uc3QgTkVUV09SS19VU0VSID0gNDE4O1xuY29uc3QgTkVUV09SS19VU0VSX1RFWFQgPSBcIkRpc2Nvbm5lY3RlZCBieSBjbGllbnRcIjtcblxuLy8gVXRpbGl0eSBmdW5jdGlvbnNcblxuLy8gQWRkIGJyb3dlciBtaXNzaW5nIGZ1bmN0aW9uIGZvciBub24gYnJvd3NlciBhcHAsIGVnIG5vZGVKc1xuZnVuY3Rpb24gaW5pdEZvck5vbkJyb3dzZXJBcHAoKSB7XG4gIC8vIFRpbm9kZSByZXF1aXJlbWVudCBpbiBuYXRpdmUgbW9kZSBiZWNhdXNlIHJlYWN0IG5hdGl2ZSBkb2Vzbid0IHByb3ZpZGUgQmFzZTY0IG1ldGhvZFxuICBjb25zdCBjaGFycyA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvPSc7XG5cbiAgaWYgKHR5cGVvZiBidG9hID09ICd1bmRlZmluZWQnKSB7XG4gICAgY29uc3QgY2hhcnMgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLz0nO1xuICAgIGdsb2JhbC5idG9hID0gZnVuY3Rpb24oaW5wdXQgPSAnJykge1xuICAgICAgbGV0IHN0ciA9IGlucHV0O1xuICAgICAgbGV0IG91dHB1dCA9ICcnO1xuXG4gICAgICBmb3IgKGxldCBibG9jayA9IDAsIGNoYXJDb2RlLCBpID0gMCwgbWFwID0gY2hhcnM7IHN0ci5jaGFyQXQoaSB8IDApIHx8IChtYXAgPSAnPScsIGkgJSAxKTsgb3V0cHV0ICs9IG1hcC5jaGFyQXQoNjMgJiBibG9jayA+PiA4IC0gaSAlIDEgKiA4KSkge1xuXG4gICAgICAgIGNoYXJDb2RlID0gc3RyLmNoYXJDb2RlQXQoaSArPSAzIC8gNCk7XG5cbiAgICAgICAgaWYgKGNoYXJDb2RlID4gMHhGRikge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIididG9hJyBmYWlsZWQ6IFRoZSBzdHJpbmcgdG8gYmUgZW5jb2RlZCBjb250YWlucyBjaGFyYWN0ZXJzIG91dHNpZGUgb2YgdGhlIExhdGluMSByYW5nZS5cIik7XG4gICAgICAgIH1cblxuICAgICAgICBibG9jayA9IGJsb2NrIDw8IDggfCBjaGFyQ29kZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9O1xuICB9XG5cbiAgaWYgKHR5cGVvZiBhdG9iID09ICd1bmRlZmluZWQnKSB7XG4gICAgZ2xvYmFsLmF0b2IgPSBmdW5jdGlvbihpbnB1dCA9ICcnKSB7XG4gICAgICBsZXQgc3RyID0gaW5wdXQucmVwbGFjZSgvPSskLywgJycpO1xuICAgICAgbGV0IG91dHB1dCA9ICcnO1xuXG4gICAgICBpZiAoc3RyLmxlbmd0aCAlIDQgPT0gMSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCInYXRvYicgZmFpbGVkOiBUaGUgc3RyaW5nIHRvIGJlIGRlY29kZWQgaXMgbm90IGNvcnJlY3RseSBlbmNvZGVkLlwiKTtcbiAgICAgIH1cbiAgICAgIGZvciAobGV0IGJjID0gMCwgYnMgPSAwLCBidWZmZXIsIGkgPSAwOyBidWZmZXIgPSBzdHIuY2hhckF0KGkrKyk7XG5cbiAgICAgICAgfmJ1ZmZlciAmJiAoYnMgPSBiYyAlIDQgPyBicyAqIDY0ICsgYnVmZmVyIDogYnVmZmVyLFxuICAgICAgICAgIGJjKysgJSA0KSA/IG91dHB1dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDI1NSAmIGJzID4+ICgtMiAqIGJjICYgNikpIDogMFxuICAgICAgKSB7XG4gICAgICAgIGJ1ZmZlciA9IGNoYXJzLmluZGV4T2YoYnVmZmVyKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9O1xuICB9XG5cbiAgaWYgKHR5cGVvZiB3aW5kb3cgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBnbG9iYWwud2luZG93ID0ge1xuICAgICAgV2ViU29ja2V0OiBXZWJTb2NrZXRQcm92aWRlcixcbiAgICAgIFhNTEh0dHBSZXF1ZXN0OiBYSFJQcm92aWRlcixcbiAgICAgIFVSTDoge1xuICAgICAgICBjcmVhdGVPYmplY3RVUkw6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVuYWJsZSB0byB1c2UgVVJMLmNyZWF0ZU9iamVjdFVSTCBpbiBhIG5vbi1icm93c2VyIGFwcGxpY2F0aW9uXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8vIFJGQzMzMzkgZm9ybWF0ZXIgb2YgRGF0ZVxuZnVuY3Rpb24gcmZjMzMzOURhdGVTdHJpbmcoZCkge1xuICBpZiAoIWQgfHwgZC5nZXRUaW1lKCkgPT0gMCkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBmdW5jdGlvbiBwYWQodmFsLCBzcCkge1xuICAgIHNwID0gc3AgfHwgMjtcbiAgICByZXR1cm4gJzAnLnJlcGVhdChzcCAtICgnJyArIHZhbCkubGVuZ3RoKSArIHZhbDtcbiAgfVxuXG4gIGNvbnN0IG1pbGxpcyA9IGQuZ2V0VVRDTWlsbGlzZWNvbmRzKCk7XG4gIHJldHVybiBkLmdldFVUQ0Z1bGxZZWFyKCkgKyAnLScgKyBwYWQoZC5nZXRVVENNb250aCgpICsgMSkgKyAnLScgKyBwYWQoZC5nZXRVVENEYXRlKCkpICtcbiAgICAnVCcgKyBwYWQoZC5nZXRVVENIb3VycygpKSArICc6JyArIHBhZChkLmdldFVUQ01pbnV0ZXMoKSkgKyAnOicgKyBwYWQoZC5nZXRVVENTZWNvbmRzKCkpICtcbiAgICAobWlsbGlzID8gJy4nICsgcGFkKG1pbGxpcywgMykgOiAnJykgKyAnWic7XG59XG5cbi8vIGJ0b2EgcmVwbGFjZW1lbnQuIFN0b2NrIGJ0b2EgZmFpbHMgb24gb24gbm9uLUxhdGluMSBzdHJpbmdzLlxuZnVuY3Rpb24gYjY0RW5jb2RlVW5pY29kZShzdHIpIHtcbiAgLy8gVGhlIGVuY29kZVVSSUNvbXBvbmVudCBwZXJjZW50LWVuY29kZXMgVVRGLTggc3RyaW5nLFxuICAvLyB0aGVuIHRoZSBwZXJjZW50IGVuY29kaW5nIGlzIGNvbnZlcnRlZCBpbnRvIHJhdyBieXRlcyB3aGljaFxuICAvLyBjYW4gYmUgZmVkIGludG8gYnRvYS5cbiAgcmV0dXJuIGJ0b2EoZW5jb2RlVVJJQ29tcG9uZW50KHN0cikucmVwbGFjZSgvJShbMC05QS1GXXsyfSkvZyxcbiAgICBmdW5jdGlvbiB0b1NvbGlkQnl0ZXMobWF0Y2gsIHAxKSB7XG4gICAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSgnMHgnICsgcDEpO1xuICAgIH0pKTtcbn1cblxuLy8gUmVjdXJzaXZlbHkgbWVyZ2Ugc3JjJ3Mgb3duIHByb3BlcnRpZXMgdG8gZHN0LlxuLy8gSWdub3JlIHByb3BlcnRpZXMgd2hlcmUgaWdub3JlW3Byb3BlcnR5XSBpcyB0cnVlLlxuLy8gQXJyYXkgYW5kIERhdGUgb2JqZWN0cyBhcmUgc2hhbGxvdy1jb3BpZWQuXG5mdW5jdGlvbiBtZXJnZU9iaihkc3QsIHNyYywgaWdub3JlKSB7XG4gIGlmICh0eXBlb2Ygc3JjICE9ICdvYmplY3QnKSB7XG4gICAgaWYgKHNyYyA9PT0gVGlub2RlLkRFTF9DSEFSKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBpZiAoc3JjID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBkc3Q7XG4gICAgfVxuICAgIHJldHVybiBzcmM7XG4gIH1cbiAgLy8gSlMgaXMgY3Jhenk6IHR5cGVvZiBudWxsIGlzICdvYmplY3QnLlxuICBpZiAoc3JjID09PSBudWxsKSB7XG4gICAgcmV0dXJuIHNyYztcbiAgfVxuXG4gIC8vIEhhbmRsZSBEYXRlXG4gIGlmIChzcmMgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgcmV0dXJuICghZHN0IHx8ICEoZHN0IGluc3RhbmNlb2YgRGF0ZSkgfHwgZHN0IDwgc3JjKSA/IHNyYyA6IGRzdDtcbiAgfVxuXG4gIC8vIEFjY2VzcyBtb2RlXG4gIGlmIChzcmMgaW5zdGFuY2VvZiBBY2Nlc3NNb2RlKSB7XG4gICAgcmV0dXJuIG5ldyBBY2Nlc3NNb2RlKHNyYyk7XG4gIH1cblxuICAvLyBIYW5kbGUgQXJyYXlcbiAgaWYgKHNyYyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgcmV0dXJuIHNyYztcbiAgfVxuXG4gIGlmICghZHN0IHx8IGRzdCA9PT0gVGlub2RlLkRFTF9DSEFSKSB7XG4gICAgZHN0ID0gc3JjLmNvbnN0cnVjdG9yKCk7XG4gIH1cblxuICBmb3IgKGxldCBwcm9wIGluIHNyYykge1xuICAgIGlmIChzcmMuaGFzT3duUHJvcGVydHkocHJvcCkgJiZcbiAgICAgICghaWdub3JlIHx8ICFpZ25vcmVbcHJvcF0pICYmXG4gICAgICAocHJvcCAhPSAnX25vRm9yd2FyZGluZycpKSB7XG5cbiAgICAgIGRzdFtwcm9wXSA9IG1lcmdlT2JqKGRzdFtwcm9wXSwgc3JjW3Byb3BdKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRzdDtcbn1cblxuLy8gVXBkYXRlIG9iamVjdCBzdG9yZWQgaW4gYSBjYWNoZS4gUmV0dXJucyB1cGRhdGVkIHZhbHVlLlxuZnVuY3Rpb24gbWVyZ2VUb0NhY2hlKGNhY2hlLCBrZXksIG5ld3ZhbCwgaWdub3JlKSB7XG4gIGNhY2hlW2tleV0gPSBtZXJnZU9iaihjYWNoZVtrZXldLCBuZXd2YWwsIGlnbm9yZSk7XG4gIHJldHVybiBjYWNoZVtrZXldO1xufVxuXG4vLyBKU09OIHN0cmluZ2lmeSBoZWxwZXIgLSBwcmUtcHJvY2Vzc29yIGZvciBKU09OLnN0cmluZ2lmeVxuZnVuY3Rpb24ganNvbkJ1aWxkSGVscGVyKGtleSwgdmFsKSB7XG4gIGlmICh2YWwgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgLy8gQ29udmVydCBqYXZhc2NyaXB0IERhdGUgb2JqZWN0cyB0byByZmMzMzM5IHN0cmluZ3NcbiAgICB2YWwgPSByZmMzMzM5RGF0ZVN0cmluZyh2YWwpO1xuICB9IGVsc2UgaWYgKHZhbCBpbnN0YW5jZW9mIEFjY2Vzc01vZGUpIHtcbiAgICB2YWwgPSB2YWwuanNvbkhlbHBlcigpO1xuICB9IGVsc2UgaWYgKHZhbCA9PT0gdW5kZWZpbmVkIHx8IHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IGZhbHNlIHx8XG4gICAgKEFycmF5LmlzQXJyYXkodmFsKSAmJiB2YWwubGVuZ3RoID09IDApIHx8XG4gICAgKCh0eXBlb2YgdmFsID09ICdvYmplY3QnKSAmJiAoT2JqZWN0LmtleXModmFsKS5sZW5ndGggPT0gMCkpKSB7XG4gICAgLy8gc3RyaXAgb3V0IGVtcHR5IGVsZW1lbnRzIHdoaWxlIHNlcmlhbGl6aW5nIG9iamVjdHMgdG8gSlNPTlxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICByZXR1cm4gdmFsO1xufTtcblxuLy8gU3RyaXBzIGFsbCB2YWx1ZXMgZnJvbSBhbiBvYmplY3Qgb2YgdGhleSBldmFsdWF0ZSB0byBmYWxzZSBvciBpZiB0aGVpciBuYW1lIHN0YXJ0cyB3aXRoICdfJy5cbmZ1bmN0aW9uIHNpbXBsaWZ5KG9iaikge1xuICBPYmplY3Qua2V5cyhvYmopLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgaWYgKGtleVswXSA9PSAnXycpIHtcbiAgICAgIC8vIFN0cmlwIGZpZWxkcyBsaWtlIFwib2JqLl9rZXlcIi5cbiAgICAgIGRlbGV0ZSBvYmpba2V5XTtcbiAgICB9IGVsc2UgaWYgKCFvYmpba2V5XSkge1xuICAgICAgLy8gU3RyaXAgZmllbGRzIHdoaWNoIGV2YWx1YXRlIHRvIGZhbHNlLlxuICAgICAgZGVsZXRlIG9ialtrZXldO1xuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShvYmpba2V5XSkgJiYgb2JqW2tleV0ubGVuZ3RoID09IDApIHtcbiAgICAgIC8vIFN0cmlwIGVtcHR5IGFycmF5cy5cbiAgICAgIGRlbGV0ZSBvYmpba2V5XTtcbiAgICB9IGVsc2UgaWYgKCFvYmpba2V5XSkge1xuICAgICAgLy8gU3RyaXAgZmllbGRzIHdoaWNoIGV2YWx1YXRlIHRvIGZhbHNlLlxuICAgICAgZGVsZXRlIG9ialtrZXldO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG9ialtrZXldID09ICdvYmplY3QnICYmICEob2JqW2tleV0gaW5zdGFuY2VvZiBEYXRlKSkge1xuICAgICAgc2ltcGxpZnkob2JqW2tleV0pO1xuICAgICAgLy8gU3RyaXAgZW1wdHkgb2JqZWN0cy5cbiAgICAgIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvYmpba2V5XSkubGVuZ3RoID09IDApIHtcbiAgICAgICAgZGVsZXRlIG9ialtrZXldO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvYmo7XG59O1xuXG4vLyBUcmltIHdoaXRlc3BhY2UsIHN0cmlwIGVtcHR5IGFuZCBkdXBsaWNhdGUgZWxlbWVudHMgZWxlbWVudHMuXG4vLyBJZiB0aGUgcmVzdWx0IGlzIGFuIGVtcHR5IGFycmF5LCBhZGQgYSBzaW5nbGUgZWxlbWVudCBcIlxcdTI0MjFcIiAoVW5pY29kZSBEZWwgY2hhcmFjdGVyKS5cbmZ1bmN0aW9uIG5vcm1hbGl6ZUFycmF5KGFycikge1xuICBsZXQgb3V0ID0gW107XG4gIGlmIChBcnJheS5pc0FycmF5KGFycikpIHtcbiAgICAvLyBUcmltLCB0aHJvdyBhd2F5IHZlcnkgc2hvcnQgYW5kIGVtcHR5IHRhZ3MuXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSBhcnIubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBsZXQgdCA9IGFycltpXTtcbiAgICAgIGlmICh0KSB7XG4gICAgICAgIHQgPSB0LnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBpZiAodC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgb3V0LnB1c2godCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgb3V0LnNvcnQoKS5maWx0ZXIoZnVuY3Rpb24oaXRlbSwgcG9zLCBhcnkpIHtcbiAgICAgIHJldHVybiAhcG9zIHx8IGl0ZW0gIT0gYXJ5W3BvcyAtIDFdO1xuICAgIH0pO1xuICB9XG4gIGlmIChvdXQubGVuZ3RoID09IDApIHtcbiAgICAvLyBBZGQgc2luZ2xlIHRhZyB3aXRoIGEgVW5pY29kZSBEZWwgY2hhcmFjdGVyLCBvdGhlcndpc2UgYW4gYW1wdHkgYXJyYXlcbiAgICAvLyBpcyBhbWJpZ3Vvcy4gVGhlIERlbCB0YWcgd2lsbCBiZSBzdHJpcHBlZCBieSB0aGUgc2VydmVyLlxuICAgIG91dC5wdXNoKFRpbm9kZS5ERUxfQ0hBUik7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuLy8gQXR0ZW1wdCB0byBjb252ZXJ0IGRhdGUgc3RyaW5ncyB0byBvYmplY3RzLlxuZnVuY3Rpb24ganNvblBhcnNlSGVscGVyKGtleSwgdmFsKSB7XG4gIC8vIENvbnZlcnQgc3RyaW5nIHRpbWVzdGFtcHMgd2l0aCBvcHRpb25hbCBtaWxsaXNlY29uZHMgdG8gRGF0ZVxuICAvLyAyMDE1LTA5LTAyVDAxOjQ1OjQzWy4xMjNdWlxuICBpZiAoa2V5ID09PSAndHMnICYmIHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnICYmXG4gICAgdmFsLmxlbmd0aCA+PSAyMCAmJiB2YWwubGVuZ3RoIDw9IDI0KSB7XG4gICAgbGV0IGRhdGUgPSBuZXcgRGF0ZSh2YWwpO1xuICAgIGlmIChkYXRlKSB7XG4gICAgICByZXR1cm4gZGF0ZTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoa2V5ID09PSAnYWNzJyAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBuZXcgQWNjZXNzTW9kZSh2YWwpO1xuICB9XG4gIHJldHVybiB2YWw7XG59O1xuXG4vLyBUcmltcyB2ZXJ5IGxvbmcgc3RyaW5ncyAoZW5jb2RlZCBpbWFnZXMpIHRvIG1ha2UgbG9nZ2VkIHBhY2tldHMgbW9yZSByZWFkYWJsZS5cbmZ1bmN0aW9uIGpzb25Mb2dnZXJIZWxwZXIoa2V5LCB2YWwpIHtcbiAgaWYgKHR5cGVvZiB2YWwgPT0gJ3N0cmluZycgJiYgdmFsLmxlbmd0aCA+IDEyOCkge1xuICAgIHJldHVybiAnPCcgKyB2YWwubGVuZ3RoICsgJywgYnl0ZXM6ICcgKyB2YWwuc3Vic3RyaW5nKDAsIDEyKSArICcuLi4nICsgdmFsLnN1YnN0cmluZyh2YWwubGVuZ3RoIC0gMTIpICsgJz4nO1xuICB9XG4gIHJldHVybiBqc29uQnVpbGRIZWxwZXIoa2V5LCB2YWwpO1xufTtcblxuLy8gUGFyc2UgYnJvd3NlciB1c2VyIGFnZW50IHRvIGV4dHJhY3QgYnJvd3NlciBuYW1lIGFuZCB2ZXJzaW9uLlxuZnVuY3Rpb24gZ2V0QnJvd3NlckluZm8odWEsIHByb2R1Y3QpIHtcbiAgdWEgPSB1YSB8fCAnJztcbiAgbGV0IHJlYWN0bmF0aXZlID0gJyc7XG4gIC8vIENoZWNrIGlmIHRoaXMgaXMgYSBSZWFjdE5hdGl2ZSBhcHAuXG4gIGlmICgvcmVhY3RuYXRpdmUvaS50ZXN0KHByb2R1Y3QpKSB7XG4gICAgcmVhY3RuYXRpdmUgPSAnUmVhY3ROYXRpdmU7ICc7XG4gIH1cbiAgLy8gVGhlbiB0ZXN0IGZvciBXZWJLaXQgYmFzZWQgYnJvd3Nlci5cbiAgdWEgPSB1YS5yZXBsYWNlKCcgKEtIVE1MLCBsaWtlIEdlY2tvKScsICcnKTtcbiAgbGV0IG0gPSB1YS5tYXRjaCgvKEFwcGxlV2ViS2l0XFwvWy5cXGRdKykvaSk7XG4gIGxldCByZXN1bHQ7XG4gIGlmIChtKSB7XG4gICAgLy8gTGlzdCBvZiBjb21tb24gc3RyaW5ncywgZnJvbSBtb3JlIHVzZWZ1bCB0byBsZXNzIHVzZWZ1bC5cbiAgICBsZXQgcHJpb3JpdHkgPSBbJ2Nocm9tZScsICdzYWZhcmknLCAnbW9iaWxlJywgJ3ZlcnNpb24nXTtcbiAgICBsZXQgdG1wID0gdWEuc3Vic3RyKG0uaW5kZXggKyBtWzBdLmxlbmd0aCkuc3BsaXQoXCIgXCIpO1xuICAgIGxldCB0b2tlbnMgPSBbXTtcbiAgICAvLyBTcGxpdCBOYW1lLzAuMC4wIGludG8gTmFtZSBhbmQgdmVyc2lvbiAwLjAuMFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG1wLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgbTIgPSAvKFtcXHcuXSspW1xcL10oW1xcLlxcZF0rKS8uZXhlYyh0bXBbaV0pO1xuICAgICAgaWYgKG0yKSB7XG4gICAgICAgIHRva2Vucy5wdXNoKFttMlsxXSwgbTJbMl0sIHByaW9yaXR5LmZpbmRJbmRleChmdW5jdGlvbihlKSB7XG4gICAgICAgICAgcmV0dXJuIChlID09IG0yWzFdLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgICB9KV0pO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBTb3J0IGJ5IHByaW9yaXR5OiBtb3JlIGludGVyZXN0aW5nIGlzIGVhcmxpZXIgdGhhbiBsZXNzIGludGVyZXN0aW5nLlxuICAgIHRva2Vucy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgIGxldCBkaWZmID0gYVsyXSAtIGJbMl07XG4gICAgICByZXR1cm4gZGlmZiAhPSAwID8gZGlmZiA6IGJbMF0ubGVuZ3RoIC0gYVswXS5sZW5ndGg7XG4gICAgfSk7XG4gICAgaWYgKHRva2Vucy5sZW5ndGggPiAwKSB7XG4gICAgICAvLyBSZXR1cm4gdGhlIGxlYXN0IGNvbW1vbiBicm93c2VyIHN0cmluZyBhbmQgdmVyc2lvbi5cbiAgICAgIHJlc3VsdCA9IHRva2Vuc1swXVswXSArICcvJyArIHRva2Vuc1swXVsxXTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRmFpbGVkIHRvIElEIHRoZSBicm93c2VyLiBSZXR1cm4gdGhlIHdlYmtpdCB2ZXJzaW9uLlxuICAgICAgcmVzdWx0ID0gbVsxXTtcbiAgICB9XG4gICAgLy8gVGVzdCBmb3IgTVNJRS5cbiAgfSBlbHNlIGlmICgvdHJpZGVudC9pLnRlc3QodWEpKSB7XG4gICAgbSA9IC8oPzpcXGJydlsgOl0rKFsuXFxkXSspKXwoPzpcXGJNU0lFIChbLlxcZF0rKSkvZy5leGVjKHVhKTtcbiAgICBpZiAobSkge1xuICAgICAgcmVzdWx0ID0gJ01TSUUvJyArIChtWzFdIHx8IG1bMl0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQgPSAnTVNJRS8/JztcbiAgICB9XG4gICAgLy8gVGVzdCBmb3IgRmlyZWZveC5cbiAgfSBlbHNlIGlmICgvZmlyZWZveC9pLnRlc3QodWEpKSB7XG4gICAgbSA9IC9GaXJlZm94XFwvKFsuXFxkXSspL2cuZXhlYyh1YSk7XG4gICAgaWYgKG0pIHtcbiAgICAgIHJlc3VsdCA9ICdGaXJlZm94LycgKyBtWzFdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQgPSAnRmlyZWZveC8/JztcbiAgICB9XG4gICAgLy8gT2xkZXIgT3BlcmEuXG4gIH0gZWxzZSBpZiAoL3ByZXN0by9pLnRlc3QodWEpKSB7XG4gICAgbSA9IC9PcGVyYVxcLyhbLlxcZF0rKS9nLmV4ZWModWEpO1xuICAgIGlmIChtKSB7XG4gICAgICByZXN1bHQgPSAnT3BlcmEvJyArIG1bMV07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdCA9ICdPcGVyYS8/JztcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gRmFpbGVkIHRvIHBhcnNlIGFueXRoaW5nIG1lYW5pbmdmdWxsLiBUcnkgdGhlIGxhc3QgcmVzb3J0LlxuICAgIG0gPSAvKFtcXHcuXSspXFwvKFsuXFxkXSspLy5leGVjKHVhKTtcbiAgICBpZiAobSkge1xuICAgICAgcmVzdWx0ID0gbVsxXSArICcvJyArIG1bMl07XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSB1YS5zcGxpdCgnICcpO1xuICAgICAgcmVzdWx0ID0gbVswXTtcbiAgICB9XG4gIH1cblxuICAvLyBTaG9ydGVuIHRoZSB2ZXJzaW9uIHRvIG9uZSBkb3QgJ2EuYmIuY2NjLmQgLT4gYS5iYicgYXQgbW9zdC5cbiAgbSA9IHJlc3VsdC5zcGxpdCgnLycpO1xuICBpZiAobS5sZW5ndGggPiAxKSB7XG4gICAgbGV0IHYgPSBtWzFdLnNwbGl0KCcuJyk7XG4gICAgcmVzdWx0ID0gbVswXSArICcvJyArIHZbMF0gKyAodlsxXSA/ICcuJyArIHZbMV0gOiAnJyk7XG4gIH1cbiAgcmV0dXJuIHJlYWN0bmF0aXZlICsgcmVzdWx0O1xufVxuXG4vKipcbiAqIEluLW1lbW9yeSBzb3J0ZWQgY2FjaGUgb2Ygb2JqZWN0cy5cbiAqXG4gKiBAY2xhc3MgQ0J1ZmZlclxuICogQG1lbWJlcm9mIFRpbm9kZVxuICogQHByb3RlY3RlZFxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNvbXBhcmUgY3VzdG9tIGNvbXBhcmF0b3Igb2Ygb2JqZWN0cy4gUmV0dXJucyAtMSBpZiBhIDwgYiwgMCBpZiBhID09IGIsIDEgb3RoZXJ3aXNlLlxuICogQHBhcmFtIHtib29sZWFufSB1bmlxdWUgZW5mb3JjZSBlbGVtZW50IHVuaXF1ZW5lc3M6IHJlcGxhY2UgZXhpc3RpbmcgZWxlbWVudCB3aXRoIGEgbmV3IG9uZSBvbiBjb25mbGljdC5cbiAqL1xudmFyIENCdWZmZXIgPSBmdW5jdGlvbihjb21wYXJlLCB1bmlxdWUpIHtcbiAgbGV0IGJ1ZmZlciA9IFtdO1xuXG4gIGNvbXBhcmUgPSBjb21wYXJlIHx8IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICByZXR1cm4gYSA9PT0gYiA/IDAgOiBhIDwgYiA/IC0xIDogMTtcbiAgfTtcblxuICBmdW5jdGlvbiBmaW5kTmVhcmVzdChlbGVtLCBhcnIsIGV4YWN0KSB7XG4gICAgbGV0IHN0YXJ0ID0gMDtcbiAgICBsZXQgZW5kID0gYXJyLmxlbmd0aCAtIDE7XG4gICAgbGV0IHBpdm90ID0gMDtcbiAgICBsZXQgZGlmZiA9IDA7XG4gICAgbGV0IGZvdW5kID0gZmFsc2U7XG5cbiAgICB3aGlsZSAoc3RhcnQgPD0gZW5kKSB7XG4gICAgICBwaXZvdCA9IChzdGFydCArIGVuZCkgLyAyIHwgMDtcbiAgICAgIGRpZmYgPSBjb21wYXJlKGFycltwaXZvdF0sIGVsZW0pO1xuICAgICAgaWYgKGRpZmYgPCAwKSB7XG4gICAgICAgIHN0YXJ0ID0gcGl2b3QgKyAxO1xuICAgICAgfSBlbHNlIGlmIChkaWZmID4gMCkge1xuICAgICAgICBlbmQgPSBwaXZvdCAtIDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZm91bmQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlkeDogcGl2b3QsXG4gICAgICAgIGV4YWN0OiB0cnVlXG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAoZXhhY3QpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlkeDogLTFcbiAgICAgIH07XG4gICAgfVxuICAgIC8vIE5vdCBleGFjdCAtIGluc2VydGlvbiBwb2ludFxuICAgIHJldHVybiB7XG4gICAgICBpZHg6IGRpZmYgPCAwID8gcGl2b3QgKyAxIDogcGl2b3RcbiAgICB9O1xuICB9XG5cbiAgLy8gSW5zZXJ0IGVsZW1lbnQgaW50byBhIHNvcnRlZCBhcnJheS5cbiAgZnVuY3Rpb24gaW5zZXJ0U29ydGVkKGVsZW0sIGFycikge1xuICAgIGNvbnN0IGZvdW5kID0gZmluZE5lYXJlc3QoZWxlbSwgYXJyLCBmYWxzZSk7XG4gICAgY29uc3QgY291bnQgPSAoZm91bmQuZXhhY3QgJiYgdW5pcXVlKSA/IDEgOiAwO1xuICAgIGFyci5zcGxpY2UoZm91bmQuaWR4LCBjb3VudCwgZWxlbSk7XG4gICAgcmV0dXJuIGFycjtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgLyoqXG4gICAgICogR2V0IGFuIGVsZW1lbnQgYXQgdGhlIGdpdmVuIHBvc2l0aW9uLlxuICAgICAqIEBtZW1iZXJvZiBUaW5vZGUuQ0J1ZmZlciNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYXQgLSBQb3NpdGlvbiB0byBmZXRjaCBmcm9tLlxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IEVsZW1lbnQgYXQgdGhlIGdpdmVuIHBvc2l0aW9uIG9yIDx0dD51bmRlZmluZWQ8L3R0PlxuICAgICAqL1xuICAgIGdldEF0OiBmdW5jdGlvbihhdCkge1xuICAgICAgcmV0dXJuIGJ1ZmZlclthdF07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENvbnZlbmllbmNlIG1ldGhvZCBmb3IgZ2V0dGluZyB0aGUgbGFzdCBlbGVtZW50IG9mIHRoZSBidWZmZXIuXG4gICAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBsYXN0IGVsZW1lbnQgaW4gdGhlIGJ1ZmZlciBvciA8dHQ+dW5kZWZpbmVkPC90dD4gaWYgYnVmZmVyIGlzIGVtcHR5LlxuICAgICAqL1xuICAgIGdldExhc3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGJ1ZmZlci5sZW5ndGggPiAwID8gYnVmZmVyW2J1ZmZlci5sZW5ndGggLSAxXSA6IHVuZGVmaW5lZDtcbiAgICB9LFxuXG4gICAgLyoqIEFkZCBuZXcgZWxlbWVudChzKSB0byB0aGUgYnVmZmVyLiBWYXJpYWRpYzogdGFrZXMgb25lIG9yIG1vcmUgYXJndW1lbnRzLiBJZiBhbiBhcnJheSBpcyBwYXNzZWQgYXMgYSBzaW5nbGVcbiAgICAgKiBhcmd1bWVudCwgaXRzIGVsZW1lbnRzIGFyZSBpbnNlcnRlZCBpbmRpdmlkdWFsbHkuXG4gICAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgICAqXG4gICAgICogQHBhcmFtIHsuLi5PYmplY3R8QXJyYXl9IC0gT25lIG9yIG1vcmUgb2JqZWN0cyB0byBpbnNlcnQuXG4gICAgICovXG4gICAgcHV0OiBmdW5jdGlvbigpIHtcbiAgICAgIGxldCBpbnNlcnQ7XG4gICAgICAvLyBpbnNwZWN0IGFyZ3VtZW50czogaWYgYXJyYXksIGluc2VydCBpdHMgZWxlbWVudHMsIGlmIG9uZSBvciBtb3JlIG5vbi1hcnJheSBhcmd1bWVudHMsIGluc2VydCB0aGVtIG9uZSBieSBvbmVcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDEgJiYgQXJyYXkuaXNBcnJheShhcmd1bWVudHNbMF0pKSB7XG4gICAgICAgIGluc2VydCA9IGFyZ3VtZW50c1swXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluc2VydCA9IGFyZ3VtZW50cztcbiAgICAgIH1cbiAgICAgIGZvciAobGV0IGlkeCBpbiBpbnNlcnQpIHtcbiAgICAgICAgaW5zZXJ0U29ydGVkKGluc2VydFtpZHhdLCBidWZmZXIpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgZWxlbWVudCBhdCB0aGUgZ2l2ZW4gcG9zaXRpb24uXG4gICAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhdCAtIFBvc2l0aW9uIHRvIGRlbGV0ZSBhdC5cbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBFbGVtZW50IGF0IHRoZSBnaXZlbiBwb3NpdGlvbiBvciA8dHQ+dW5kZWZpbmVkPC90dD5cbiAgICAgKi9cbiAgICBkZWxBdDogZnVuY3Rpb24oYXQpIHtcbiAgICAgIGxldCByID0gYnVmZmVyLnNwbGljZShhdCwgMSk7XG4gICAgICBpZiAociAmJiByLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIHJbMF07XG4gICAgICB9XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgZWxlbWVudHMgYmV0d2VlbiB0d28gcG9zaXRpb25zLlxuICAgICAqIEBtZW1iZXJvZiBUaW5vZGUuQ0J1ZmZlciNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc2luY2UgLSBQb3NpdGlvbiB0byBkZWxldGUgZnJvbSAoaW5jbHVzaXZlKS5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYmVmb3JlIC0gUG9zaXRpb24gdG8gZGVsZXRlIHRvIChleGNsdXNpdmUpLlxuICAgICAqXG4gICAgICogQHJldHVybnMge0FycmF5fSBhcnJheSBvZiByZW1vdmVkIGVsZW1lbnRzIChjb3VsZCBiZSB6ZXJvIGxlbmd0aCkuXG4gICAgICovXG4gICAgZGVsUmFuZ2U6IGZ1bmN0aW9uKHNpbmNlLCBiZWZvcmUpIHtcbiAgICAgIHJldHVybiBidWZmZXIuc3BsaWNlKHNpbmNlLCBiZWZvcmUgLSBzaW5jZSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybiB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIHRoZSBidWZmZXIgaG9sZHMuXG4gICAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgICAqIEByZXR1cm4ge251bWJlcn0gTnVtYmVyIG9mIGVsZW1lbnRzIGluIHRoZSBidWZmZXIuXG4gICAgICovXG4gICAgbGVuZ3RoOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBidWZmZXIubGVuZ3RoO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXNldCB0aGUgYnVmZmVyIGRpc2NhcmRpbmcgYWxsIGVsZW1lbnRzXG4gICAgICogQG1lbWJlcm9mIFRpbm9kZS5DQnVmZmVyI1xuICAgICAqL1xuICAgIHJlc2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIGJ1ZmZlciA9IFtdO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDYWxsYmFjayBmb3IgaXRlcmF0aW5nIGNvbnRlbnRzIG9mIGJ1ZmZlci4gU2VlIHtAbGluayBUaW5vZGUuQ0J1ZmZlciNmb3JFYWNofS5cbiAgICAgKiBAY2FsbGJhY2sgRm9yRWFjaENhbGxiYWNrVHlwZVxuICAgICAqIEBtZW1iZXJvZiBUaW5vZGUuQ0J1ZmZlciNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZWxlbSAtIEVsZW1lbnQgb2YgdGhlIGJ1ZmZlci5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggLSBJbmRleCBvZiB0aGUgY3VycmVudCBlbGVtZW50LlxuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogQXBwbHkgZ2l2ZW4gZnVuY3Rpb24gYGNhbGxiYWNrYCB0byBhbGwgZWxlbWVudHMgb2YgdGhlIGJ1ZmZlci5cbiAgICAgKiBAbWVtYmVyb2YgVGlub2RlLkNCdWZmZXIjXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1Rpbm9kZS5Gb3JFYWNoQ2FsbGJhY2tUeXBlfSBjYWxsYmFjayAtIEZ1bmN0aW9uIHRvIGNhbGwgZm9yIGVhY2ggZWxlbWVudC5cbiAgICAgKiBAcGFyYW0ge2ludGVnZXJ9IHN0YXJ0SWR4LSBPcHRpb25hbCBpbmRleCB0byBzdGFydCBpdGVyYXRpbmcgZnJvbSAoaW5jbHVzaXZlKS5cbiAgICAgKiBAcGFyYW0ge2ludGVnZXJ9IGJlZm9yZUlkeCAtIE9wdGlvbmFsIGluZGV4IHRvIHN0b3AgaXRlcmF0aW5nIGJlZm9yZSAoZXhjbHVzaXZlKS5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCAtIGNhbGxpbmcgY29udGV4dCAoaS5lLiB2YWx1ZSBvZiAndGhpcycgaW4gY2FsbGJhY2spXG4gICAgICovXG4gICAgZm9yRWFjaDogZnVuY3Rpb24oY2FsbGJhY2ssIHN0YXJ0SWR4LCBiZWZvcmVJZHgsIGNvbnRleHQpIHtcbiAgICAgIHN0YXJ0SWR4ID0gc3RhcnRJZHggfCAwO1xuICAgICAgYmVmb3JlSWR4ID0gYmVmb3JlSWR4IHx8IGJ1ZmZlci5sZW5ndGg7XG4gICAgICBmb3IgKGxldCBpID0gc3RhcnRJZHg7IGkgPCBiZWZvcmVJZHg7IGkrKykge1xuICAgICAgICBjYWxsYmFjay5jYWxsKGNvbnRleHQsIGJ1ZmZlcltpXSwgaSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEZpbmQgZWxlbWVudCBpbiBidWZmZXIgdXNpbmcgYnVmZmVyJ3MgY29tcGFyaXNvbiBmdW5jdGlvbi5cbiAgICAgKiBAbWVtYmVyb2YgVGlub2RlLkNCdWZmZXIjXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZWxlbSAtIGVsZW1lbnQgdG8gZmluZC5cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBuZWFyZXN0IC0gd2hlbiB0cnVlIGFuZCBleGFjdCBtYXRjaCBpcyBub3QgZm91bmQsIHJldHVybiB0aGUgbmVhcmVzdCBlbGVtZW50IChpbnNlcnRpb24gcG9pbnQpLlxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IGluZGV4IG9mIHRoZSBlbGVtZW50IGluIHRoZSBidWZmZXIgb3IgLTEuXG4gICAgICovXG4gICAgZmluZDogZnVuY3Rpb24oZWxlbSwgbmVhcmVzdCkge1xuICAgICAgY29uc3Qge1xuICAgICAgICBpZHhcbiAgICAgIH0gPSBmaW5kTmVhcmVzdChlbGVtLCBidWZmZXIsICFuZWFyZXN0KTtcbiAgICAgIHJldHVybiBpZHg7XG4gICAgfVxuICB9XG59XG5cbi8vIEhlbHBlciBmdW5jdGlvbiBmb3IgY3JlYXRpbmcgYW4gZW5kcG9pbnQgVVJMXG5mdW5jdGlvbiBtYWtlQmFzZVVybChob3N0LCBwcm90b2NvbCwgYXBpS2V5KSB7XG4gIGxldCB1cmwgPSBudWxsO1xuXG4gIGlmIChwcm90b2NvbCA9PT0gJ2h0dHAnIHx8IHByb3RvY29sID09PSAnaHR0cHMnIHx8IHByb3RvY29sID09PSAnd3MnIHx8IHByb3RvY29sID09PSAnd3NzJykge1xuICAgIHVybCA9IHByb3RvY29sICsgJzovLyc7XG4gICAgdXJsICs9IGhvc3Q7XG4gICAgaWYgKHVybC5jaGFyQXQodXJsLmxlbmd0aCAtIDEpICE9PSAnLycpIHtcbiAgICAgIHVybCArPSAnLyc7XG4gICAgfVxuICAgIHVybCArPSAndicgKyBQUk9UT0NPTF9WRVJTSU9OICsgJy9jaGFubmVscyc7XG4gICAgaWYgKHByb3RvY29sID09PSAnaHR0cCcgfHwgcHJvdG9jb2wgPT09ICdodHRwcycpIHtcbiAgICAgIC8vIExvbmcgcG9sbGluZyBlbmRwb2ludCBlbmQgd2l0aCBcImxwXCIsIGkuZS5cbiAgICAgIC8vICcvdjAvY2hhbm5lbHMvbHAnIHZzIGp1c3QgJy92MC9jaGFubmVscycgZm9yIHdzXG4gICAgICB1cmwgKz0gJy9scCc7XG4gICAgfVxuICAgIHVybCArPSAnP2FwaWtleT0nICsgYXBpS2V5O1xuICB9XG5cbiAgcmV0dXJuIHVybDtcbn1cblxuLyoqXG4gKiBBbiBhYnN0cmFjdGlvbiBmb3IgYSB3ZWJzb2NrZXQgb3IgYSBsb25nIHBvbGxpbmcgY29ubmVjdGlvbi5cbiAqXG4gKiBAY2xhc3MgQ29ubmVjdGlvblxuICogQG1lbWJlcm9mIFRpbm9kZVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBob3N0XyAtIEhvc3QgbmFtZSBhbmQgcG9ydCBudW1iZXIgdG8gY29ubmVjdCB0by5cbiAqIEBwYXJhbSB7c3RyaW5nfSBhcGlLZXlfIC0gQVBJIGtleSBnZW5lcmF0ZWQgYnkga2V5Z2VuXG4gKiBAcGFyYW0ge3N0cmluZ30gdHJhbnNwb3J0XyAtIE5ldHdvcmsgdHJhbnNwb3J0IHRvIHVzZSwgZWl0aGVyIGB3c2AvYHdzc2AgZm9yIHdlYnNvY2tldCBvciBgbHBgIGZvciBsb25nIHBvbGxpbmcuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IHNlY3VyZV8gLSBVc2Ugc2VjdXJlIFdlYlNvY2tldCAod3NzKSBpZiB0cnVlLlxuICogQHBhcmFtIHtib29sZWFufSBhdXRvcmVjb25uZWN0XyAtIElmIGNvbm5lY3Rpb24gaXMgbG9zdCwgdHJ5IHRvIHJlY29ubmVjdCBhdXRvbWF0aWNhbGx5LlxuICovXG52YXIgQ29ubmVjdGlvbiA9IGZ1bmN0aW9uKGhvc3RfLCBhcGlLZXlfLCB0cmFuc3BvcnRfLCBzZWN1cmVfLCBhdXRvcmVjb25uZWN0Xykge1xuICBsZXQgaG9zdCA9IGhvc3RfO1xuICBsZXQgc2VjdXJlID0gc2VjdXJlXztcbiAgbGV0IGFwaUtleSA9IGFwaUtleV87XG5cbiAgbGV0IGF1dG9yZWNvbm5lY3QgPSBhdXRvcmVjb25uZWN0XztcblxuICAvLyBTZXR0aW5ncyBmb3IgZXhwb25lbnRpYWwgYmFja29mZlxuICBjb25zdCBfQk9GRl9CQVNFID0gMjAwMDsgLy8gMjAwMCBtaWxsaXNlY29uZHMsIG1pbmltdW0gZGVsYXkgYmV0d2VlbiByZWNvbm5lY3RzXG4gIGNvbnN0IF9CT0ZGX01BWF9JVEVSID0gMTA7IC8vIE1heGltdW0gZGVsYXkgYmV0d2VlbiByZWNvbm5lY3RzIDJeMTAgKiAyMDAwIH4gMzQgbWludXRlc1xuICBjb25zdCBfQk9GRl9KSVRURVIgPSAwLjM7IC8vIEFkZCByYW5kb20gZGVsYXlcblxuICBsZXQgX2JvZmZUaW1lciA9IG51bGw7XG4gIGxldCBfYm9mZkl0ZXJhdGlvbiA9IDA7XG4gIGxldCBfYm9mZkNsb3NlZCA9IGZhbHNlOyAvLyBJbmRpY2F0b3IgaWYgdGhlIHNvY2tldCB3YXMgbWFudWFsbHkgY2xvc2VkIC0gZG9uJ3QgYXV0b3JlY29ubmVjdCBpZiB0cnVlLlxuXG4gIGxldCBsb2cgPSAodGV4dCwgLi4uYXJncykgPT4ge1xuICAgIGlmICh0aGlzLmxvZ2dlcikge1xuICAgICAgdGhpcy5sb2dnZXIodGV4dCwgLi4uYXJncyk7XG4gICAgfVxuICB9XG5cbiAgLy8gQmFja29mZiBpbXBsZW1lbnRhdGlvbiAtIHJlY29ubmVjdCBhZnRlciBhIHRpbWVvdXQuXG4gIGZ1bmN0aW9uIGJvZmZSZWNvbm5lY3QoKSB7XG4gICAgLy8gQ2xlYXIgdGltZXJcbiAgICBjbGVhclRpbWVvdXQoX2JvZmZUaW1lcik7XG4gICAgLy8gQ2FsY3VsYXRlIHdoZW4gdG8gZmlyZSB0aGUgcmVjb25uZWN0IGF0dGVtcHRcbiAgICBsZXQgdGltZW91dCA9IF9CT0ZGX0JBU0UgKiAoTWF0aC5wb3coMiwgX2JvZmZJdGVyYXRpb24pICogKDEuMCArIF9CT0ZGX0pJVFRFUiAqIE1hdGgucmFuZG9tKCkpKTtcbiAgICAvLyBVcGRhdGUgaXRlcmF0aW9uIGNvdW50ZXIgZm9yIGZ1dHVyZSB1c2VcbiAgICBfYm9mZkl0ZXJhdGlvbiA9IChfYm9mZkl0ZXJhdGlvbiA+PSBfQk9GRl9NQVhfSVRFUiA/IF9ib2ZmSXRlcmF0aW9uIDogX2JvZmZJdGVyYXRpb24gKyAxKTtcbiAgICBpZiAodGhpcy5vbkF1dG9yZWNvbm5lY3RJdGVyYXRpb24pIHtcbiAgICAgIHRoaXMub25BdXRvcmVjb25uZWN0SXRlcmF0aW9uKHRpbWVvdXQpO1xuICAgIH1cblxuICAgIF9ib2ZmVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGxvZyhcIlJlY29ubmVjdGluZywgaXRlcj1cIiArIF9ib2ZmSXRlcmF0aW9uICsgXCIsIHRpbWVvdXQ9XCIgKyB0aW1lb3V0KTtcbiAgICAgIC8vIE1heWJlIHRoZSBzb2NrZXQgd2FzIGNsb3NlZCB3aGlsZSB3ZSB3YWl0ZWQgZm9yIHRoZSB0aW1lcj9cbiAgICAgIGlmICghX2JvZmZDbG9zZWQpIHtcbiAgICAgICAgbGV0IHByb20gPSB0aGlzLmNvbm5lY3QoKTtcbiAgICAgICAgaWYgKHRoaXMub25BdXRvcmVjb25uZWN0SXRlcmF0aW9uKSB7XG4gICAgICAgICAgdGhpcy5vbkF1dG9yZWNvbm5lY3RJdGVyYXRpb24oMCwgcHJvbSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gU3VwcHJlc3MgZXJyb3IgaWYgaXQncyBub3QgdXNlZC5cbiAgICAgICAgICBwcm9tLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgIC8qIGRvIG5vdGhpbmcgKi9cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLm9uQXV0b3JlY29ubmVjdEl0ZXJhdGlvbikge1xuICAgICAgICB0aGlzLm9uQXV0b3JlY29ubmVjdEl0ZXJhdGlvbigtMSk7XG4gICAgICB9XG4gICAgfSwgdGltZW91dCk7XG4gIH1cblxuICAvLyBUZXJtaW5hdGUgYXV0by1yZWNvbm5lY3QgcHJvY2Vzcy5cbiAgZnVuY3Rpb24gYm9mZlN0b3AoKSB7XG4gICAgY2xlYXJUaW1lb3V0KF9ib2ZmVGltZXIpO1xuICAgIF9ib2ZmVGltZXIgPSBudWxsO1xuICB9XG5cbiAgLy8gUmVzZXQgYXV0by1yZWNvbm5lY3QgaXRlcmF0aW9uIGNvdW50ZXIuXG4gIGZ1bmN0aW9uIGJvZmZSZXNldCgpIHtcbiAgICBfYm9mZkl0ZXJhdGlvbiA9IDA7XG4gIH1cblxuICAvLyBJbml0aWFsaXphdGlvbiBmb3IgV2Vic29ja2V0XG4gIGZ1bmN0aW9uIGluaXRfd3MoaW5zdGFuY2UpIHtcbiAgICBsZXQgX3NvY2tldCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBJbml0aWF0ZSBhIG5ldyBjb25uZWN0aW9uXG4gICAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uI1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBob3N0XyBIb3N0IG5hbWUgdG8gY29ubmVjdCB0bzsgaWYgbnVsbCB0aGUgb2xkIGhvc3QgbmFtZSB3aWxsIGJlIHVzZWQuXG4gICAgICogQHBhcmFtIHtib29sZWFufSBmb3JjZSBGb3JjZSBuZXcgY29ubmVjdGlvbiBldmVuIGlmIG9uZSBhbHJlYWR5IGV4aXN0cy5cbiAgICAgKiBAcmV0dXJuIHtQcm9taXNlfSBQcm9taXNlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIGNvbm5lY3Rpb24gY2FsbCBjb21wbGV0ZXMsIHJlc29sdXRpb24gaXMgY2FsbGVkIHdpdGhvdXQgcGFyYW1ldGVycywgcmVqZWN0aW9uIHBhc3NlcyB0aGUge0Vycm9yfSBhcyBwYXJhbWV0ZXIuXG4gICAgICovXG4gICAgaW5zdGFuY2UuY29ubmVjdCA9IGZ1bmN0aW9uKGhvc3RfLCBmb3JjZSkge1xuICAgICAgX2JvZmZDbG9zZWQgPSBmYWxzZTtcblxuICAgICAgaWYgKF9zb2NrZXQgJiYgX3NvY2tldC5yZWFkeVN0YXRlID09IF9zb2NrZXQuT1BFTikge1xuICAgICAgICBpZiAoIWZvcmNlKSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICAgIF9zb2NrZXQuY2xvc2UoKTtcbiAgICAgICAgX3NvY2tldCA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIGlmIChob3N0Xykge1xuICAgICAgICBob3N0ID0gaG9zdF87XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgY29uc3QgdXJsID0gbWFrZUJhc2VVcmwoaG9zdCwgc2VjdXJlID8gJ3dzcycgOiAnd3MnLCBhcGlLZXkpO1xuXG4gICAgICAgIGxvZyhcIkNvbm5lY3RpbmcgdG86IFwiLCB1cmwpO1xuXG4gICAgICAgIGNvbnN0IGNvbm4gPSBuZXcgV2ViU29ja2V0UHJvdmlkZXIodXJsKTtcblxuICAgICAgICBjb25uLm9ub3BlbiA9IGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICAgIGlmIChhdXRvcmVjb25uZWN0KSB7XG4gICAgICAgICAgICBib2ZmU3RvcCgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChpbnN0YW5jZS5vbk9wZW4pIHtcbiAgICAgICAgICAgIGluc3RhbmNlLm9uT3BlbigpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbm4ub25jbG9zZSA9IGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICAgIF9zb2NrZXQgPSBudWxsO1xuXG4gICAgICAgICAgaWYgKGluc3RhbmNlLm9uRGlzY29ubmVjdCkge1xuICAgICAgICAgICAgY29uc3QgY29kZSA9IF9ib2ZmQ2xvc2VkID8gTkVUV09SS19VU0VSIDogTkVUV09SS19FUlJPUjtcbiAgICAgICAgICAgIGluc3RhbmNlLm9uRGlzY29ubmVjdChuZXcgRXJyb3IoX2JvZmZDbG9zZWQgPyBORVRXT1JLX1VTRVJfVEVYVCA6IE5FVFdPUktfRVJST1JfVEVYVCArXG4gICAgICAgICAgICAgICcgKCcgKyBjb2RlICsgJyknKSwgY29kZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCFfYm9mZkNsb3NlZCAmJiBhdXRvcmVjb25uZWN0KSB7XG4gICAgICAgICAgICBib2ZmUmVjb25uZWN0LmNhbGwoaW5zdGFuY2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbm4ub25lcnJvciA9IGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29ubi5vbm1lc3NhZ2UgPSBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgICBpZiAoaW5zdGFuY2Uub25NZXNzYWdlKSB7XG4gICAgICAgICAgICBpbnN0YW5jZS5vbk1lc3NhZ2UoZXZ0LmRhdGEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBfc29ja2V0ID0gY29ubjtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRyeSB0byByZXN0b3JlIGEgbmV0d29yayBjb25uZWN0aW9uLCBhbHNvIHJlc2V0IGJhY2tvZmYuXG4gICAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uI1xuICAgICAqXG4gICAgICogQHBhcmFtIHtib29sZWFufSBmb3JjZSAtIHJlY29ubmVjdCBldmVuIGlmIHRoZXJlIGlzIGEgbGl2ZSBjb25uZWN0aW9uIGFscmVhZHkuXG4gICAgICovXG4gICAgaW5zdGFuY2UucmVjb25uZWN0ID0gZnVuY3Rpb24oZm9yY2UpIHtcbiAgICAgIGJvZmZTdG9wKCk7XG4gICAgICBpbnN0YW5jZS5jb25uZWN0KG51bGwsIGZvcmNlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUZXJtaW5hdGUgdGhlIG5ldHdvcmsgY29ubmVjdGlvblxuICAgICAqIEBtZW1iZXJvZiBUaW5vZGUuQ29ubmVjdGlvbiNcbiAgICAgKi9cbiAgICBpbnN0YW5jZS5kaXNjb25uZWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgICBfYm9mZkNsb3NlZCA9IHRydWU7XG4gICAgICBpZiAoIV9zb2NrZXQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBib2ZmU3RvcCgpO1xuICAgICAgX3NvY2tldC5jbG9zZSgpO1xuICAgICAgX3NvY2tldCA9IG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2VuZCBhIHN0cmluZyB0byB0aGUgc2VydmVyLlxuICAgICAqIEBtZW1iZXJvZiBUaW5vZGUuQ29ubmVjdGlvbiNcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtc2cgLSBTdHJpbmcgdG8gc2VuZC5cbiAgICAgKiBAdGhyb3dzIFRocm93cyBhbiBleGNlcHRpb24gaWYgdGhlIHVuZGVybHlpbmcgY29ubmVjdGlvbiBpcyBub3QgbGl2ZS5cbiAgICAgKi9cbiAgICBpbnN0YW5jZS5zZW5kVGV4dCA9IGZ1bmN0aW9uKG1zZykge1xuICAgICAgaWYgKF9zb2NrZXQgJiYgKF9zb2NrZXQucmVhZHlTdGF0ZSA9PSBfc29ja2V0Lk9QRU4pKSB7XG4gICAgICAgIF9zb2NrZXQuc2VuZChtc2cpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiV2Vic29ja2V0IGlzIG5vdCBjb25uZWN0ZWRcIik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIHNvY2tldCBpcyBhbGl2ZS5cbiAgICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgY29ubmVjdGlvbiBpcyBsaXZlLCBmYWxzZSBvdGhlcndpc2VcbiAgICAgKi9cbiAgICBpbnN0YW5jZS5pc0Nvbm5lY3RlZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIChfc29ja2V0ICYmIChfc29ja2V0LnJlYWR5U3RhdGUgPT0gX3NvY2tldC5PUEVOKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBuYW1lIG9mIHRoZSBjdXJyZW50IG5ldHdvcmsgdHJhbnNwb3J0LlxuICAgICAqIEBtZW1iZXJvZiBUaW5vZGUuQ29ubmVjdGlvbiNcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBuYW1lIG9mIHRoZSB0cmFuc3BvcnQgc3VjaCBhcyAnd3MnIG9yICdscCcuXG4gICAgICovXG4gICAgaW5zdGFuY2UudHJhbnNwb3J0ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gJ3dzJztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZW5kIG5ldHdvcmsgcHJvYmUgdG8gY2hlY2sgaWYgY29ubmVjdGlvbiBpcyBpbmRlZWQgbGl2ZS5cbiAgICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAgICovXG4gICAgaW5zdGFuY2UucHJvYmUgPSBmdW5jdGlvbigpIHtcbiAgICAgIGluc3RhbmNlLnNlbmRUZXh0KCcxJyk7XG4gICAgfVxuICB9XG5cbiAgLy8gSW5pdGlhbGl6YXRpb24gZm9yIGxvbmcgcG9sbGluZy5cbiAgZnVuY3Rpb24gaW5pdF9scChpbnN0YW5jZSkge1xuICAgIGNvbnN0IFhEUl9VTlNFTlQgPSAwOyAvL1x0Q2xpZW50IGhhcyBiZWVuIGNyZWF0ZWQuIG9wZW4oKSBub3QgY2FsbGVkIHlldC5cbiAgICBjb25zdCBYRFJfT1BFTkVEID0gMTsgLy9cdG9wZW4oKSBoYXMgYmVlbiBjYWxsZWQuXG4gICAgY29uc3QgWERSX0hFQURFUlNfUkVDRUlWRUQgPSAyOyAvLyBzZW5kKCkgaGFzIGJlZW4gY2FsbGVkLCBhbmQgaGVhZGVycyBhbmQgc3RhdHVzIGFyZSBhdmFpbGFibGUuXG4gICAgY29uc3QgWERSX0xPQURJTkcgPSAzOyAvL1x0RG93bmxvYWRpbmc7IHJlc3BvbnNlVGV4dCBob2xkcyBwYXJ0aWFsIGRhdGEuXG4gICAgY29uc3QgWERSX0RPTkUgPSA0OyAvLyBUaGUgb3BlcmF0aW9uIGlzIGNvbXBsZXRlLlxuICAgIC8vIEZ1bGx5IGNvbXBvc2VkIGVuZHBvaW50IFVSTCwgd2l0aCBBUEkga2V5ICYgU0lEXG4gICAgbGV0IF9scFVSTCA9IG51bGw7XG5cbiAgICBsZXQgX3BvbGxlciA9IG51bGw7XG4gICAgbGV0IF9zZW5kZXIgPSBudWxsO1xuXG4gICAgZnVuY3Rpb24gbHBfc2VuZGVyKHVybF8pIHtcbiAgICAgIGxldCBzZW5kZXIgPSBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgc2VuZGVyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICBpZiAoc2VuZGVyLnJlYWR5U3RhdGUgPT0gWERSX0RPTkUgJiYgc2VuZGVyLnN0YXR1cyA+PSA0MDApIHtcbiAgICAgICAgICAvLyBTb21lIHNvcnQgb2YgZXJyb3IgcmVzcG9uc2VcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJMUCBzZW5kZXIgZmFpbGVkLCBcIiArIHNlbmRlci5zdGF0dXMpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHNlbmRlci5vcGVuKCdQT1NUJywgdXJsXywgdHJ1ZSk7XG4gICAgICByZXR1cm4gc2VuZGVyO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxwX3BvbGxlcih1cmxfLCByZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIGxldCBwb2xsZXIgPSBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgbGV0IHByb21pc2VDb21wbGV0ZWQgPSBmYWxzZTtcblxuICAgICAgcG9sbGVyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKGV2dCkge1xuXG4gICAgICAgIGlmIChwb2xsZXIucmVhZHlTdGF0ZSA9PSBYRFJfRE9ORSkge1xuICAgICAgICAgIGlmIChwb2xsZXIuc3RhdHVzID09IDIwMSkgeyAvLyAyMDEgPT0gSFRUUC5DcmVhdGVkLCBnZXQgU0lEXG4gICAgICAgICAgICBsZXQgcGt0ID0gSlNPTi5wYXJzZShwb2xsZXIucmVzcG9uc2VUZXh0LCBqc29uUGFyc2VIZWxwZXIpO1xuICAgICAgICAgICAgX2xwVVJMID0gdXJsXyArICcmc2lkPScgKyBwa3QuY3RybC5wYXJhbXMuc2lkXG4gICAgICAgICAgICBwb2xsZXIgPSBscF9wb2xsZXIoX2xwVVJMKTtcbiAgICAgICAgICAgIHBvbGxlci5zZW5kKG51bGwpXG4gICAgICAgICAgICBpZiAoaW5zdGFuY2Uub25PcGVuKSB7XG4gICAgICAgICAgICAgIGluc3RhbmNlLm9uT3BlbigpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocmVzb2x2ZSkge1xuICAgICAgICAgICAgICBwcm9taXNlQ29tcGxldGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoYXV0b3JlY29ubmVjdCkge1xuICAgICAgICAgICAgICBib2ZmU3RvcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAocG9sbGVyLnN0YXR1cyA8IDQwMCkgeyAvLyA0MDAgPSBIVFRQLkJhZFJlcXVlc3RcbiAgICAgICAgICAgIGlmIChpbnN0YW5jZS5vbk1lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgaW5zdGFuY2Uub25NZXNzYWdlKHBvbGxlci5yZXNwb25zZVRleHQpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwb2xsZXIgPSBscF9wb2xsZXIoX2xwVVJMKTtcbiAgICAgICAgICAgIHBvbGxlci5zZW5kKG51bGwpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBEb24ndCB0aHJvdyBhbiBlcnJvciBoZXJlLCBncmFjZWZ1bGx5IGhhbmRsZSBzZXJ2ZXIgZXJyb3JzXG4gICAgICAgICAgICBpZiAocmVqZWN0ICYmICFwcm9taXNlQ29tcGxldGVkKSB7XG4gICAgICAgICAgICAgIHByb21pc2VDb21wbGV0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICByZWplY3QocG9sbGVyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW5zdGFuY2Uub25NZXNzYWdlICYmIHBvbGxlci5yZXNwb25zZVRleHQpIHtcbiAgICAgICAgICAgICAgaW5zdGFuY2Uub25NZXNzYWdlKHBvbGxlci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGluc3RhbmNlLm9uRGlzY29ubmVjdCkge1xuICAgICAgICAgICAgICBjb25zdCBjb2RlID0gcG9sbGVyLnN0YXR1cyB8fCAoX2JvZmZDbG9zZWQgPyBORVRXT1JLX1VTRVIgOiBORVRXT1JLX0VSUk9SKTtcbiAgICAgICAgICAgICAgY29uc3QgdGV4dCA9IHBvbGxlci5yZXNwb25zZVRleHQgfHwgKF9ib2ZmQ2xvc2VkID8gTkVUV09SS19VU0VSX1RFWFQgOiBORVRXT1JLX0VSUk9SX1RFWFQpO1xuICAgICAgICAgICAgICBpbnN0YW5jZS5vbkRpc2Nvbm5lY3QobmV3IEVycm9yKHRleHQgKyAnICgnICsgY29kZSArICcpJyksIGNvZGUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBQb2xsaW5nIGhhcyBzdG9wcGVkLiBJbmRpY2F0ZSBpdCBieSBzZXR0aW5nIHBvbGxlciB0byBudWxsLlxuICAgICAgICAgICAgcG9sbGVyID0gbnVsbDtcbiAgICAgICAgICAgIGlmICghX2JvZmZDbG9zZWQgJiYgYXV0b3JlY29ubmVjdCkge1xuICAgICAgICAgICAgICBib2ZmUmVjb25uZWN0LmNhbGwoaW5zdGFuY2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcG9sbGVyLm9wZW4oJ0dFVCcsIHVybF8sIHRydWUpO1xuICAgICAgcmV0dXJuIHBvbGxlcjtcbiAgICB9XG5cbiAgICBpbnN0YW5jZS5jb25uZWN0ID0gZnVuY3Rpb24oaG9zdF8sIGZvcmNlKSB7XG4gICAgICBfYm9mZkNsb3NlZCA9IGZhbHNlO1xuXG4gICAgICBpZiAoX3BvbGxlcikge1xuICAgICAgICBpZiAoIWZvcmNlKSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICAgIF9wb2xsZXIub25yZWFkeXN0YXRlY2hhbmdlID0gdW5kZWZpbmVkO1xuICAgICAgICBfcG9sbGVyLmFib3J0KCk7XG4gICAgICAgIF9wb2xsZXIgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBpZiAoaG9zdF8pIHtcbiAgICAgICAgaG9zdCA9IGhvc3RfO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGNvbnN0IHVybCA9IG1ha2VCYXNlVXJsKGhvc3QsIHNlY3VyZSA/ICdodHRwcycgOiAnaHR0cCcsIGFwaUtleSk7XG4gICAgICAgIGxvZyhcIkNvbm5lY3RpbmcgdG86IFwiLCB1cmwpO1xuICAgICAgICBfcG9sbGVyID0gbHBfcG9sbGVyKHVybCwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgX3BvbGxlci5zZW5kKG51bGwpXG4gICAgICB9KS5jYXRjaChmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gQ2F0Y2ggYW4gZXJyb3IgYW5kIGRvIG5vdGhpbmcuXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgaW5zdGFuY2UucmVjb25uZWN0ID0gZnVuY3Rpb24oZm9yY2UpIHtcbiAgICAgIGJvZmZTdG9wKCk7XG4gICAgICBpbnN0YW5jZS5jb25uZWN0KG51bGwsIGZvcmNlKTtcbiAgICB9O1xuXG4gICAgaW5zdGFuY2UuZGlzY29ubmVjdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgX2JvZmZDbG9zZWQgPSB0cnVlO1xuICAgICAgYm9mZlN0b3AoKTtcblxuICAgICAgaWYgKF9zZW5kZXIpIHtcbiAgICAgICAgX3NlbmRlci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSB1bmRlZmluZWQ7XG4gICAgICAgIF9zZW5kZXIuYWJvcnQoKTtcbiAgICAgICAgX3NlbmRlciA9IG51bGw7XG4gICAgICB9XG4gICAgICBpZiAoX3BvbGxlcikge1xuICAgICAgICBfcG9sbGVyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgX3BvbGxlci5hYm9ydCgpO1xuICAgICAgICBfcG9sbGVyID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgaWYgKGluc3RhbmNlLm9uRGlzY29ubmVjdCkge1xuICAgICAgICBpbnN0YW5jZS5vbkRpc2Nvbm5lY3QobmV3IEVycm9yKE5FVFdPUktfVVNFUl9URVhUICsgJyAoJyArIE5FVFdPUktfVVNFUiArICcpJyksIE5FVFdPUktfVVNFUik7XG4gICAgICB9XG4gICAgICAvLyBFbnN1cmUgaXQncyByZWNvbnN0cnVjdGVkXG4gICAgICBfbHBVUkwgPSBudWxsO1xuICAgIH1cblxuICAgIGluc3RhbmNlLnNlbmRUZXh0ID0gZnVuY3Rpb24obXNnKSB7XG4gICAgICBfc2VuZGVyID0gbHBfc2VuZGVyKF9scFVSTCk7XG4gICAgICBpZiAoX3NlbmRlciAmJiAoX3NlbmRlci5yZWFkeVN0YXRlID09IDEpKSB7IC8vIDEgPT0gT1BFTkVEXG4gICAgICAgIF9zZW5kZXIuc2VuZChtc2cpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTG9uZyBwb2xsZXIgZmFpbGVkIHRvIGNvbm5lY3RcIik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGluc3RhbmNlLmlzQ29ubmVjdGVkID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gKF9wb2xsZXIgJiYgdHJ1ZSk7XG4gICAgfVxuXG4gICAgaW5zdGFuY2UudHJhbnNwb3J0ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gJ2xwJztcbiAgICB9XG5cbiAgICBpbnN0YW5jZS5wcm9iZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgaW5zdGFuY2Uuc2VuZFRleHQoJzEnKTtcbiAgICB9XG4gIH1cblxuICBsZXQgaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgaWYgKHRyYW5zcG9ydF8gPT09ICdscCcpIHtcbiAgICAvLyBleHBsaWNpdCByZXF1ZXN0IHRvIHVzZSBsb25nIHBvbGxpbmdcbiAgICBpbml0X2xwKHRoaXMpO1xuICAgIGluaXRpYWxpemVkID0gdHJ1ZTtcbiAgfSBlbHNlIGlmICh0cmFuc3BvcnRfID09PSAnd3MnKSB7XG4gICAgLy8gZXhwbGljaXQgcmVxdWVzdCB0byB1c2Ugd2ViIHNvY2tldFxuICAgIC8vIGlmIHdlYnNvY2tldHMgYXJlIG5vdCBhdmFpbGFibGUsIGhvcnJpYmxlIHRoaW5ncyB3aWxsIGhhcHBlblxuICAgIGluaXRfd3ModGhpcyk7XG4gICAgaW5pdGlhbGl6ZWQgPSB0cnVlO1xuXG4gICAgLy8gRGVmYXVsdCB0cmFuc3BvcnQgc2VsZWN0aW9uXG4gIH0gZWxzZSBpZiAodHlwZW9mIHdpbmRvdyA9PSAnb2JqZWN0Jykge1xuICAgIGlmICh3aW5kb3dbJ1dlYlNvY2tldCddKSB7XG4gICAgICAvLyBVc2luZyB3ZWIgc29ja2V0cyAtLSBkZWZhdWx0LlxuICAgICAgaW5pdF93cyh0aGlzKTtcbiAgICAgIGluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHdpbmRvd1snWE1MSHR0cFJlcXVlc3QnXSkge1xuICAgICAgLy8gVGhlIGJyb3dzZXIgaGFzIG5vIHdlYnNvY2tldHMsIHVzaW5nIGxvbmcgcG9sbGluZy5cbiAgICAgIGluaXRfbHAodGhpcyk7XG4gICAgICBpbml0aWFsaXplZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFpbml0aWFsaXplZCkge1xuICAgIC8vIE5vIHRyYW5zcG9ydCBpcyBhdmFpaWxhYmxlLlxuICAgIGNvbnNvbGUubG9nKFwiTm8gbmV0d29yayB0cmFuc3BvcnQgaXMgYXZhaWxhYmxlLiBSdW5uaW5nIE5vZGU/IENhbGwgJ1Rpbm9kZS5zZXROZXR3b3JrUHJvdmlkZXJzKCknLlwiKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyBuZXR3b3JrIHRyYW5zcG9ydCBpcyBhdmFpbGFibGUuIFJ1bm5pbmcgTm9kZT8gQ2FsbCAnVGlub2RlLnNldE5ldHdvcmtQcm92aWRlcnMoKScuXCIpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBnaXZlbiBuZXR3b3JrIHRyYW5zcG9ydCBpcyBhdmFpbGFibGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ29ubmVjdGlvbiNcbiAgICogQHBhcmFtIHtTdHJpbmd9IHRyYW5zIC0gZWl0aGVyICd3cycgKHdlYnNvY2tldCkgb3IgJ2xwJyAobG9uZyBwb2xsaW5nKS5cbiAgICogQHJldHVybnMgdHJ1ZSBpZiBnaXZlbiB0cmFuc3BvcnQgaXMgYXZhaWxhYmxlLCBmYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICB0aGlzLnRyYW5zcG9ydEF2YWlsYWJsZSA9IGZ1bmN0aW9uKHRyYW5zcCkge1xuICAgIHN3aXRjaCAodHJhbnNwKSB7XG4gICAgICBjYXNlICd3cyc6XG4gICAgICAgIHJldHVybiB0eXBlb2Ygd2luZG93ID09ICdvYmplY3QnICYmIHdpbmRvd1snV2ViU29ja2V0J107XG4gICAgICBjYXNlICdscCc6XG4gICAgICAgIHJldHVybiB0eXBlb2Ygd2luZG93ID09ICdvYmplY3QnICYmIHdpbmRvd1snWE1MSHR0cFJlcXVlc3QnXTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUmVxdWVzdCBmb3IgdW5rbm93biB0cmFuc3BvcnRcIiwgdHJhbnNwKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldCBhdXRvcmVjb25uZWN0IGNvdW50ZXIgdG8gemVyby5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uI1xuICAgKi9cbiAgdGhpcy5iYWNrb2ZmUmVzZXQgPSBmdW5jdGlvbigpIHtcbiAgICBib2ZmUmVzZXQoKTtcbiAgfVxuXG4gIC8vIENhbGxiYWNrczpcbiAgLyoqXG4gICAqIEEgY2FsbGJhY2sgdG8gcGFzcyBpbmNvbWluZyBtZXNzYWdlcyB0by4gU2VlIHtAbGluayBUaW5vZGUuQ29ubmVjdGlvbiNvbk1lc3NhZ2V9LlxuICAgKiBAY2FsbGJhY2sgVGlub2RlLkNvbm5lY3Rpb24uT25NZXNzYWdlXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ29ubmVjdGlvblxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSAtIE1lc3NhZ2UgdG8gcHJvY2Vzcy5cbiAgICovXG4gIC8qKlxuICAgKiBBIGNhbGxiYWNrIHRvIHBhc3MgaW5jb21pbmcgbWVzc2FnZXMgdG8uXG4gICAqIEB0eXBlIHtUaW5vZGUuQ29ubmVjdGlvbi5Pbk1lc3NhZ2V9XG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ29ubmVjdGlvbiNcbiAgICovXG4gIHRoaXMub25NZXNzYWdlID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBBIGNhbGxiYWNrIGZvciByZXBvcnRpbmcgYSBkcm9wcGVkIGNvbm5lY3Rpb24uXG4gICAqIEB0eXBlIHtmdW5jdGlvbn1cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uI1xuICAgKi9cbiAgdGhpcy5vbkRpc2Nvbm5lY3QgPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIEEgY2FsbGJhY2sgY2FsbGVkIHdoZW4gdGhlIGNvbm5lY3Rpb24gaXMgcmVhZHkgdG8gYmUgdXNlZCBmb3Igc2VuZGluZy4gRm9yIHdlYnNvY2tldHMgaXQncyBzb2NrZXQgb3BlbixcbiAgICogZm9yIGxvbmcgcG9sbGluZyBpdCdzIHJlYWR5U3RhdGU9MSAoT1BFTkVEKVxuICAgKiBAdHlwZSB7ZnVuY3Rpb259XG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ29ubmVjdGlvbiNcbiAgICovXG4gIHRoaXMub25PcGVuID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBBIGNhbGxiYWNrIHRvIG5vdGlmeSBvZiByZWNvbm5lY3Rpb24gYXR0ZW1wdHMuIFNlZSB7QGxpbmsgVGlub2RlLkNvbm5lY3Rpb24jb25BdXRvcmVjb25uZWN0SXRlcmF0aW9ufS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uXG4gICAqIEBjYWxsYmFjayBBdXRvcmVjb25uZWN0SXRlcmF0aW9uVHlwZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGltZW91dCAtIHRpbWUgdGlsbCB0aGUgbmV4dCByZWNvbm5lY3QgYXR0ZW1wdCBpbiBtaWxsaXNlY29uZHMuIC0xIG1lYW5zIHJlY29ubmVjdCB3YXMgc2tpcHBlZC5cbiAgICogQHBhcmFtIHtQcm9taXNlfSBwcm9taXNlIHJlc29sdmVkIG9yIHJlamVjdGVkIHdoZW4gdGhlIHJlY29ubmVjdCBhdHRlbXAgY29tcGxldGVzLlxuICAgKlxuICAgKi9cbiAgLyoqXG4gICAqIEEgY2FsbGJhY2sgdG8gaW5mb3JtIHdoZW4gdGhlIG5leHQgYXR0YW1wdCB0byByZWNvbm5lY3Qgd2lsbCBoYXBwZW4gYW5kIHRvIHJlY2VpdmUgY29ubmVjdGlvbiBwcm9taXNlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkNvbm5lY3Rpb24jXG4gICAqIEB0eXBlIHtUaW5vZGUuQ29ubmVjdGlvbi5BdXRvcmVjb25uZWN0SXRlcmF0aW9uVHlwZX1cbiAgICovXG4gIHRoaXMub25BdXRvcmVjb25uZWN0SXRlcmF0aW9uID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBBIGNhbGxiYWNrIHRvIGxvZyBldmVudHMgZnJvbSBDb25uZWN0aW9uLiBTZWUge0BsaW5rIFRpbm9kZS5Db25uZWN0aW9uI2xvZ2dlcn0uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQ29ubmVjdGlvblxuICAgKiBAY2FsbGJhY2sgTG9nZ2VyQ2FsbGJhY2tUeXBlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudCAtIEV2ZW50IHRvIGxvZy5cbiAgICovXG4gIC8qKlxuICAgKiBBIGNhbGxiYWNrIHRvIHJlcG9ydCBsb2dnaW5nIGV2ZW50cy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Db25uZWN0aW9uI1xuICAgKiBAdHlwZSB7VGlub2RlLkNvbm5lY3Rpb24uTG9nZ2VyQ2FsbGJhY2tUeXBlfVxuICAgKi9cbiAgdGhpcy5sb2dnZXIgPSB1bmRlZmluZWQ7XG59O1xuXG4vKipcbiAqIEBjbGFzcyBUaW5vZGVcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gYXBwbmFtZV8gLSBOYW1lIG9mIHRoZSBjYWxpaW5nIGFwcGxpY2F0aW9uIHRvIGJlIHJlcG9ydGVkIGluIFVzZXIgQWdlbnQuXG4gKiBAcGFyYW0ge3N0cmluZ30gaG9zdF8gLSBIb3N0IG5hbWUgYW5kIHBvcnQgbnVtYmVyIHRvIGNvbm5lY3QgdG8uXG4gKiBAcGFyYW0ge3N0cmluZ30gYXBpS2V5XyAtIEFQSSBrZXkgZ2VuZXJhdGVkIGJ5IGtleWdlblxuICogQHBhcmFtIHtzdHJpbmd9IHRyYW5zcG9ydF8gLSBTZWUge0BsaW5rIFRpbm9kZS5Db25uZWN0aW9uI3RyYW5zcG9ydH0uXG4gKiBAcGFyYW0ge2Jvb2xlYW59IHNlY3VyZV8gLSBVc2UgU2VjdXJlIFdlYlNvY2tldCBpZiB0cnVlLlxuICogQHBhcmFtIHtzdHJpbmd9IHBsYXRmb3JtXyAtIE9wdGlvbmFsIHBsYXRmb3JtIGlkZW50aWZpZXIsIG9uZSBvZiBcImlvc1wiLCBcIndlYlwiLCBcImFuZHJvaWRcIi5cbiAqL1xudmFyIFRpbm9kZSA9IGZ1bmN0aW9uKGFwcG5hbWVfLCBob3N0XywgYXBpS2V5XywgdHJhbnNwb3J0Xywgc2VjdXJlXywgcGxhdGZvcm1fKSB7XG4gIC8vIENsaWVudC1wcm92aWRlZCBhcHBsaWNhdGlvbiBuYW1lLCBmb3JtYXQgPE5hbWU+Lzx2ZXJzaW9uIG51bWJlcj5cbiAgaWYgKGFwcG5hbWVfKSB7XG4gICAgdGhpcy5fYXBwTmFtZSA9IGFwcG5hbWVfO1xuICB9IGVsc2Uge1xuICAgIHRoaXMuX2FwcE5hbWUgPSBcIlVuZGVmaW5lZFwiO1xuICB9XG5cbiAgLy8gQVBJIEtleS5cbiAgdGhpcy5fYXBpS2V5ID0gYXBpS2V5XztcblxuICAvLyBOYW1lIGFuZCB2ZXJzaW9uIG9mIHRoZSBicm93c2VyLlxuICB0aGlzLl9icm93c2VyID0gJyc7XG4gIHRoaXMuX3BsYXRmb3JtID0gcGxhdGZvcm1fO1xuICB0aGlzLl9od29zID0gJ3VuZGVmaW5lZCc7XG4gIHRoaXMuX2h1bWFuTGFuZ3VhZ2UgPSAneHgnO1xuICAvLyBVbmRlcmx5aW5nIE9TLlxuICBpZiAodHlwZW9mIG5hdmlnYXRvciAhPSAndW5kZWZpbmVkJykge1xuICAgIHRoaXMuX2Jyb3dzZXIgPSBnZXRCcm93c2VySW5mbyhuYXZpZ2F0b3IudXNlckFnZW50LCBuYXZpZ2F0b3IucHJvZHVjdCk7XG4gICAgdGhpcy5faHdvcyA9IG5hdmlnYXRvci5wbGF0Zm9ybTtcbiAgICB0aGlzLl9odW1hbkxhbmd1YWdlID0gbmF2aWdhdG9yLmxhbmd1YWdlIHx8ICdlbi1VUyc7XG4gIH1cbiAgLy8gTG9nZ2luZyB0byBjb25zb2xlIGVuYWJsZWRcbiAgdGhpcy5fbG9nZ2luZ0VuYWJsZWQgPSBmYWxzZTtcbiAgLy8gV2hlbiBsb2dnaW5nLCB0cmlwIGxvbmcgc3RyaW5ncyAoYmFzZTY0LWVuY29kZWQgaW1hZ2VzKSBmb3IgcmVhZGFiaWxpdHlcbiAgdGhpcy5fdHJpbUxvbmdTdHJpbmdzID0gZmFsc2U7XG4gIC8vIFVJRCBvZiB0aGUgY3VycmVudGx5IGF1dGhlbnRpY2F0ZWQgdXNlci5cbiAgdGhpcy5fbXlVSUQgPSBudWxsO1xuICAvLyBTdGF0dXMgb2YgY29ubmVjdGlvbjogYXV0aGVudGljYXRlZCBvciBub3QuXG4gIHRoaXMuX2F1dGhlbnRpY2F0ZWQgPSBmYWxzZTtcbiAgLy8gTG9naW4gdXNlZCBpbiB0aGUgbGFzdCBzdWNjZXNzZnVsIGJhc2ljIGF1dGhlbnRpY2F0aW9uXG4gIHRoaXMuX2xvZ2luID0gbnVsbDtcbiAgLy8gVG9rZW4gd2hpY2ggY2FuIGJlIHVzZWQgZm9yIGxvZ2luIGluc3RlYWQgb2YgbG9naW4vcGFzc3dvcmQuXG4gIHRoaXMuX2F1dGhUb2tlbiA9IG51bGw7XG4gIC8vIENvdW50ZXIgb2YgcmVjZWl2ZWQgcGFja2V0c1xuICB0aGlzLl9pblBhY2tldENvdW50ID0gMDtcbiAgLy8gQ291bnRlciBmb3IgZ2VuZXJhdGluZyB1bmlxdWUgbWVzc2FnZSBJRHNcbiAgdGhpcy5fbWVzc2FnZUlkID0gTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIDB4RkZGRikgKyAweEZGRkYpO1xuICAvLyBJbmZvcm1hdGlvbiBhYm91dCB0aGUgc2VydmVyLCBpZiBjb25uZWN0ZWRcbiAgdGhpcy5fc2VydmVySW5mbyA9IG51bGw7XG4gIC8vIFB1c2ggbm90aWZpY2F0aW9uIHRva2VuLiBDYWxsZWQgZGV2aWNlVG9rZW4gZm9yIGNvbnNpc3RlbmN5IHdpdGggdGhlIEFuZHJvaWQgU0RLLlxuICB0aGlzLl9kZXZpY2VUb2tlbiA9IG51bGw7XG5cbiAgLy8gQ2FjaGUgb2YgcGVuZGluZyBwcm9taXNlcyBieSBtZXNzYWdlIGlkLlxuICB0aGlzLl9wZW5kaW5nUHJvbWlzZXMgPSB7fTtcblxuICAvKiogQSBjb25uZWN0aW9uIG9iamVjdCwgc2VlIHtAbGluayBUaW5vZGUuQ29ubmVjdGlvbn0uICovXG4gIHRoaXMuX2Nvbm5lY3Rpb24gPSBuZXcgQ29ubmVjdGlvbihob3N0XywgYXBpS2V5XywgdHJhbnNwb3J0Xywgc2VjdXJlXywgdHJ1ZSk7XG4gIC8vIENvbnNvbGUgbG9nZ2VyLiBCYWJlbCBzb21laG93IGZhaWxzIHRvIHBhcnNlICcuLi5yZXN0JyBwYXJhbWV0ZXIuXG4gIHRoaXMubG9nZ2VyID0gKHN0ciwgLi4uYXJncykgPT4ge1xuICAgIGlmICh0aGlzLl9sb2dnaW5nRW5hYmxlZCkge1xuICAgICAgY29uc3QgZCA9IG5ldyBEYXRlKClcbiAgICAgIGNvbnN0IGRhdGVTdHJpbmcgPSAoJzAnICsgZC5nZXRVVENIb3VycygpKS5zbGljZSgtMikgKyAnOicgK1xuICAgICAgICAoJzAnICsgZC5nZXRVVENNaW51dGVzKCkpLnNsaWNlKC0yKSArICc6JyArXG4gICAgICAgICgnMCcgKyBkLmdldFVUQ1NlY29uZHMoKSkuc2xpY2UoLTIpICsgJzonICtcbiAgICAgICAgKCcwJyArIGQuZ2V0VVRDTWlsbGlzZWNvbmRzKCkpLnNsaWNlKC0zKTtcblxuICAgICAgY29uc29sZS5sb2coJ1snICsgZGF0ZVN0cmluZyArICddJywgc3RyLCBhcmdzLmpvaW4oJyAnKSk7XG4gICAgfVxuICB9XG4gIHRoaXMuX2Nvbm5lY3Rpb24ubG9nZ2VyID0gdGhpcy5sb2dnZXI7XG5cbiAgLy8gVGlub2RlJ3MgY2FjaGUgb2Ygb2JqZWN0c1xuICB0aGlzLl9jYWNoZSA9IHt9O1xuXG4gIGNvbnN0IGNhY2hlUHV0ID0gdGhpcy5jYWNoZVB1dCA9ICh0eXBlLCBuYW1lLCBvYmopID0+IHtcbiAgICB0aGlzLl9jYWNoZVt0eXBlICsgJzonICsgbmFtZV0gPSBvYmo7XG4gIH1cblxuICBjb25zdCBjYWNoZUdldCA9IHRoaXMuY2FjaGVHZXQgPSAodHlwZSwgbmFtZSkgPT4ge1xuICAgIHJldHVybiB0aGlzLl9jYWNoZVt0eXBlICsgJzonICsgbmFtZV07XG4gIH1cblxuICBjb25zdCBjYWNoZURlbCA9IHRoaXMuY2FjaGVEZWwgPSAodHlwZSwgbmFtZSkgPT4ge1xuICAgIGRlbGV0ZSB0aGlzLl9jYWNoZVt0eXBlICsgJzonICsgbmFtZV07XG4gIH1cbiAgLy8gRW51bWVyYXRlIGFsbCBpdGVtcyBpbiBjYWNoZSwgY2FsbCBmdW5jIGZvciBlYWNoIGl0ZW0uXG4gIC8vIEVudW1lcmF0aW9uIHN0b3BzIGlmIGZ1bmMgcmV0dXJucyB0cnVlLlxuICBjb25zdCBjYWNoZU1hcCA9IHRoaXMuY2FjaGVNYXAgPSAoZnVuYywgY29udGV4dCkgPT4ge1xuICAgIGZvciAobGV0IGlkeCBpbiB0aGlzLl9jYWNoZSkge1xuICAgICAgaWYgKGZ1bmModGhpcy5fY2FjaGVbaWR4XSwgaWR4LCBjb250ZXh0KSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBNYWtlIGxpbWl0ZWQgY2FjaGUgbWFuYWdlbWVudCBhdmFpbGFibGUgdG8gdG9waWMuXG4gIC8vIENhY2hpbmcgdXNlci5wdWJsaWMgb25seS4gRXZlcnl0aGluZyBlbHNlIGlzIHBlci10b3BpYy5cbiAgdGhpcy5hdHRhY2hDYWNoZVRvVG9waWMgPSAodG9waWMpID0+IHtcbiAgICB0b3BpYy5fdGlub2RlID0gdGhpcztcblxuICAgIHRvcGljLl9jYWNoZUdldFVzZXIgPSAodWlkKSA9PiB7XG4gICAgICBjb25zdCBwdWIgPSBjYWNoZUdldCgndXNlcicsIHVpZCk7XG4gICAgICBpZiAocHViKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdXNlcjogdWlkLFxuICAgICAgICAgIHB1YmxpYzogbWVyZ2VPYmooe30sIHB1YilcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfTtcbiAgICB0b3BpYy5fY2FjaGVQdXRVc2VyID0gKHVpZCwgdXNlcikgPT4ge1xuICAgICAgcmV0dXJuIGNhY2hlUHV0KCd1c2VyJywgdWlkLCBtZXJnZU9iaih7fSwgdXNlci5wdWJsaWMpKTtcbiAgICB9O1xuICAgIHRvcGljLl9jYWNoZURlbFVzZXIgPSAodWlkKSA9PiB7XG4gICAgICByZXR1cm4gY2FjaGVEZWwoJ3VzZXInLCB1aWQpO1xuICAgIH07XG4gICAgdG9waWMuX2NhY2hlUHV0U2VsZiA9ICgpID0+IHtcbiAgICAgIHJldHVybiBjYWNoZVB1dCgndG9waWMnLCB0b3BpYy5uYW1lLCB0b3BpYyk7XG4gICAgfVxuICAgIHRvcGljLl9jYWNoZURlbFNlbGYgPSAoKSA9PiB7XG4gICAgICByZXR1cm4gY2FjaGVEZWwoJ3RvcGljJywgdG9waWMubmFtZSk7XG4gICAgfVxuICB9XG5cbiAgLy8gUmVzb2x2ZSBvciByZWplY3QgYSBwZW5kaW5nIHByb21pc2UuXG4gIC8vIFVucmVzb2x2ZWQgcHJvbWlzZXMgYXJlIHN0b3JlZCBpbiBfcGVuZGluZ1Byb21pc2VzLlxuICBjb25zdCBleGVjUHJvbWlzZSA9IChpZCwgY29kZSwgb25PSywgZXJyb3JUZXh0KSA9PiB7XG4gICAgY29uc3QgY2FsbGJhY2tzID0gdGhpcy5fcGVuZGluZ1Byb21pc2VzW2lkXTtcbiAgICBpZiAoY2FsbGJhY2tzKSB7XG4gICAgICBkZWxldGUgdGhpcy5fcGVuZGluZ1Byb21pc2VzW2lkXTtcbiAgICAgIGlmIChjb2RlID49IDIwMCAmJiBjb2RlIDwgNDAwKSB7XG4gICAgICAgIGlmIChjYWxsYmFja3MucmVzb2x2ZSkge1xuICAgICAgICAgIGNhbGxiYWNrcy5yZXNvbHZlKG9uT0spO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGNhbGxiYWNrcy5yZWplY3QpIHtcbiAgICAgICAgY2FsbGJhY2tzLnJlamVjdChuZXcgRXJyb3IoZXJyb3JUZXh0ICsgXCIgKFwiICsgY29kZSArIFwiKVwiKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gR2VuZXJhdG9yIG9mIGRlZmF1bHQgcHJvbWlzZXMgZm9yIHNlbnQgcGFja2V0cy5cbiAgY29uc3QgbWFrZVByb21pc2UgPSAoaWQpID0+IHtcbiAgICBsZXQgcHJvbWlzZSA9IG51bGw7XG4gICAgaWYgKGlkKSB7XG4gICAgICBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAvLyBTdG9yZWQgY2FsbGJhY2tzIHdpbGwgYmUgY2FsbGVkIHdoZW4gdGhlIHJlc3BvbnNlIHBhY2tldCB3aXRoIHRoaXMgSWQgYXJyaXZlc1xuICAgICAgICB0aGlzLl9wZW5kaW5nUHJvbWlzZXNbaWRdID0ge1xuICAgICAgICAgICdyZXNvbHZlJzogcmVzb2x2ZSxcbiAgICAgICAgICAncmVqZWN0JzogcmVqZWN0LFxuICAgICAgICAgICd0cyc6IG5ldyBEYXRlKClcbiAgICAgICAgfTtcbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgLy8gUmVqZWN0IHByb21pc2VzIHdoaWNoIGhhdmUgbm90IGJlZW4gcmVzb2x2ZWQgZm9yIHRvbyBsb25nLlxuICBjb25zdCBleHBpcmVQcm9taXNlcyA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICBjb25zdCBlcnIgPSBuZXcgRXJyb3IoXCJUaW1lb3V0ICg1MDQpXCIpO1xuICAgIGNvbnN0IGV4cGlyZXMgPSBuZXcgRGF0ZShuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIEVYUElSRV9QUk9NSVNFU19USU1FT1VUKTtcbiAgICBmb3IgKGxldCBpZCBpbiB0aGlzLl9wZW5kaW5nUHJvbWlzZXMpIHtcbiAgICAgIGxldCBjYWxsYmFja3MgPSB0aGlzLl9wZW5kaW5nUHJvbWlzZXNbaWRdO1xuICAgICAgaWYgKGNhbGxiYWNrcyAmJiBjYWxsYmFja3MudHMgPCBleHBpcmVzKSB7XG4gICAgICAgIHRoaXMubG9nZ2VyKFwiUHJvbWlzZSBleHBpcmVkXCIsIGlkKTtcbiAgICAgICAgZGVsZXRlIHRoaXMuX3BlbmRpbmdQcm9taXNlc1tpZF07XG4gICAgICAgIGlmIChjYWxsYmFja3MucmVqZWN0KSB7XG4gICAgICAgICAgY2FsbGJhY2tzLnJlamVjdChlcnIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LCBFWFBJUkVfUFJPTUlTRVNfUEVSSU9EKTtcblxuICAvLyBHZW5lcmF0ZXMgdW5pcXVlIG1lc3NhZ2UgSURzXG4gIGNvbnN0IGdldE5leHRVbmlxdWVJZCA9IHRoaXMuZ2V0TmV4dFVuaXF1ZUlkID0gKCkgPT4ge1xuICAgIHJldHVybiAodGhpcy5fbWVzc2FnZUlkICE9IDApID8gJycgKyB0aGlzLl9tZXNzYWdlSWQrKyA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8vIEdldCBVc2VyIEFnZW50IHN0cmluZ1xuICBjb25zdCBnZXRVc2VyQWdlbnQgPSAoKSA9PiB7XG4gICAgcmV0dXJuIHRoaXMuX2FwcE5hbWUgKyAnICgnICsgKHRoaXMuX2Jyb3dzZXIgPyB0aGlzLl9icm93c2VyICsgJzsgJyA6ICcnKSArIHRoaXMuX2h3b3MgKyAnKTsgJyArIExJQlJBUlk7XG4gIH1cblxuICAvLyBHZW5lcmF0b3Igb2YgcGFja2V0cyBzdHVic1xuICB0aGlzLmluaXRQYWNrZXQgPSAodHlwZSwgdG9waWMpID0+IHtcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgJ2hpJzpcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAnaGknOiB7XG4gICAgICAgICAgICAnaWQnOiBnZXROZXh0VW5pcXVlSWQoKSxcbiAgICAgICAgICAgICd2ZXInOiBWRVJTSU9OLFxuICAgICAgICAgICAgJ3VhJzogZ2V0VXNlckFnZW50KCksXG4gICAgICAgICAgICAnZGV2JzogdGhpcy5fZGV2aWNlVG9rZW4sXG4gICAgICAgICAgICAnbGFuZyc6IHRoaXMuX2h1bWFuTGFuZ3VhZ2UsXG4gICAgICAgICAgICAncGxhdGYnOiB0aGlzLl9wbGF0Zm9ybVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgY2FzZSAnYWNjJzpcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAnYWNjJzoge1xuICAgICAgICAgICAgJ2lkJzogZ2V0TmV4dFVuaXF1ZUlkKCksXG4gICAgICAgICAgICAndXNlcic6IG51bGwsXG4gICAgICAgICAgICAnc2NoZW1lJzogbnVsbCxcbiAgICAgICAgICAgICdzZWNyZXQnOiBudWxsLFxuICAgICAgICAgICAgJ2xvZ2luJzogZmFsc2UsXG4gICAgICAgICAgICAndGFncyc6IG51bGwsXG4gICAgICAgICAgICAnZGVzYyc6IHt9LFxuICAgICAgICAgICAgJ2NyZWQnOiB7fVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgY2FzZSAnbG9naW4nOlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICdsb2dpbic6IHtcbiAgICAgICAgICAgICdpZCc6IGdldE5leHRVbmlxdWVJZCgpLFxuICAgICAgICAgICAgJ3NjaGVtZSc6IG51bGwsXG4gICAgICAgICAgICAnc2VjcmV0JzogbnVsbFxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgY2FzZSAnc3ViJzpcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAnc3ViJzoge1xuICAgICAgICAgICAgJ2lkJzogZ2V0TmV4dFVuaXF1ZUlkKCksXG4gICAgICAgICAgICAndG9waWMnOiB0b3BpYyxcbiAgICAgICAgICAgICdzZXQnOiB7fSxcbiAgICAgICAgICAgICdnZXQnOiB7fVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgY2FzZSAnbGVhdmUnOlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICdsZWF2ZSc6IHtcbiAgICAgICAgICAgICdpZCc6IGdldE5leHRVbmlxdWVJZCgpLFxuICAgICAgICAgICAgJ3RvcGljJzogdG9waWMsXG4gICAgICAgICAgICAndW5zdWInOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgY2FzZSAncHViJzpcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAncHViJzoge1xuICAgICAgICAgICAgJ2lkJzogZ2V0TmV4dFVuaXF1ZUlkKCksXG4gICAgICAgICAgICAndG9waWMnOiB0b3BpYyxcbiAgICAgICAgICAgICdub2VjaG8nOiBmYWxzZSxcbiAgICAgICAgICAgICdoZWFkJzogbnVsbCxcbiAgICAgICAgICAgICdjb250ZW50Jzoge31cbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgIGNhc2UgJ2dldCc6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ2dldCc6IHtcbiAgICAgICAgICAgICdpZCc6IGdldE5leHRVbmlxdWVJZCgpLFxuICAgICAgICAgICAgJ3RvcGljJzogdG9waWMsXG4gICAgICAgICAgICAnd2hhdCc6IG51bGwsIC8vIGRhdGEsIHN1YiwgZGVzYywgc3BhY2Ugc2VwYXJhdGVkIGxpc3Q7IHVua25vd24gc3RyaW5ncyBhcmUgaWdub3JlZFxuICAgICAgICAgICAgJ2Rlc2MnOiB7fSxcbiAgICAgICAgICAgICdzdWInOiB7fSxcbiAgICAgICAgICAgICdkYXRhJzoge31cbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgIGNhc2UgJ3NldCc6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ3NldCc6IHtcbiAgICAgICAgICAgICdpZCc6IGdldE5leHRVbmlxdWVJZCgpLFxuICAgICAgICAgICAgJ3RvcGljJzogdG9waWMsXG4gICAgICAgICAgICAnZGVzYyc6IHt9LFxuICAgICAgICAgICAgJ3N1Yic6IHt9LFxuICAgICAgICAgICAgJ3RhZ3MnOiBbXVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgY2FzZSAnZGVsJzpcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAnZGVsJzoge1xuICAgICAgICAgICAgJ2lkJzogZ2V0TmV4dFVuaXF1ZUlkKCksXG4gICAgICAgICAgICAndG9waWMnOiB0b3BpYyxcbiAgICAgICAgICAgICd3aGF0JzogbnVsbCxcbiAgICAgICAgICAgICdkZWxzZXEnOiBudWxsLFxuICAgICAgICAgICAgJ3VzZXInOiBudWxsLFxuICAgICAgICAgICAgJ2hhcmQnOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgY2FzZSAnbm90ZSc6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ25vdGUnOiB7XG4gICAgICAgICAgICAvLyBubyBpZCBieSBkZXNpZ25cbiAgICAgICAgICAgICd0b3BpYyc6IHRvcGljLFxuICAgICAgICAgICAgJ3doYXQnOiBudWxsLCAvLyBvbmUgb2YgXCJyZWN2XCIsIFwicmVhZFwiLCBcImtwXCJcbiAgICAgICAgICAgICdzZXEnOiB1bmRlZmluZWQgLy8gdGhlIHNlcnZlci1zaWRlIG1lc3NhZ2UgaWQgYWtub3dsZWRnZWQgYXMgcmVjZWl2ZWQgb3IgcmVhZFxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biBwYWNrZXQgdHlwZSByZXF1ZXN0ZWQ6IFwiICsgdHlwZSk7XG4gICAgfVxuICB9XG5cbiAgLy8gU2VuZCBhIHBhY2tldC4gSWYgcGFja2V0IGlkIGlzIHByb3ZpZGVkIHJldHVybiBhIHByb21pc2UuXG4gIHRoaXMuc2VuZCA9IChwa3QsIGlkKSA9PiB7XG4gICAgcmV0dXJuIHRoaXMuc2VuZDIocGt0LCBpZCwgbnVsbCk7XG4gIH1cbiAgdGhpcy5zZW5kMiA9IChwa3QsIGlkLCBlKSA9PiB7XG4gICAgbGV0IHByb21pc2U7XG4gICAgaWYgKGlkKSB7XG4gICAgICBwcm9taXNlID0gbWFrZVByb21pc2UoaWQpO1xuICAgIH1cbiAgICBwa3QgPSBzaW1wbGlmeShwa3QpO1xuICAgIGxldCBtc2cgPSBKU09OLnN0cmluZ2lmeShwa3QpO1xuICAgIHRoaXMubG9nZ2VyKFwib3V0OiBcIiArICh0aGlzLl90cmltTG9uZ1N0cmluZ3MgPyBKU09OLnN0cmluZ2lmeShwa3QsIGpzb25Mb2dnZXJIZWxwZXIpIDogbXNnKSk7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChlID09IG51bGwgfHwgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApIDwgNSkge1xuICAgICAgICB0aGlzLl9jb25uZWN0aW9uLnNlbmRUZXh0KG1zZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFcnJvciBwdWJsaXNoaW5nICdcIiArIG1zZyArIFwiJ1wiKTtcbiAgICAgIH1cblxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgLy8gSWYgc2VuZFRleHQgdGhyb3dzLCB3cmFwIHRoZSBlcnJvciBpbiBhIHByb21pc2Ugb3IgcmV0aHJvdy5cbiAgICAgIGlmIChpZCkge1xuICAgICAgICBleGVjUHJvbWlzZShpZCwgTkVUV09SS19FUlJPUiwgbnVsbCwgZXJyLm1lc3NhZ2UpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIC8vIE9uIHN1Y2Nlc3NmdWwgbG9naW4gc2F2ZSBzZXJ2ZXItcHJvdmlkZWQgZGF0YS5cbiAgdGhpcy5sb2dpblN1Y2Nlc3NmdWwgPSAoY3RybCkgPT4ge1xuICAgIGlmICghY3RybC5wYXJhbXMgfHwgIWN0cmwucGFyYW1zLnVzZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gVGhpcyBpcyBhIHJlc3BvbnNlIHRvIGEgc3VjY2Vzc2Z1bCBsb2dpbixcbiAgICAvLyBleHRyYWN0IFVJRCBhbmQgc2VjdXJpdHkgdG9rZW4sIHNhdmUgaXQgaW4gVGlub2RlIG1vZHVsZVxuICAgIHRoaXMuX215VUlEID0gY3RybC5wYXJhbXMudXNlcjtcbiAgICB0aGlzLl9hdXRoZW50aWNhdGVkID0gKGN0cmwgJiYgY3RybC5jb2RlID49IDIwMCAmJiBjdHJsLmNvZGUgPCAzMDApO1xuICAgIGlmIChjdHJsLnBhcmFtcyAmJiBjdHJsLnBhcmFtcy50b2tlbiAmJiBjdHJsLnBhcmFtcy5leHBpcmVzKSB7XG4gICAgICB0aGlzLl9hdXRoVG9rZW4gPSB7XG4gICAgICAgIHRva2VuOiBjdHJsLnBhcmFtcy50b2tlbixcbiAgICAgICAgZXhwaXJlczogbmV3IERhdGUoY3RybC5wYXJhbXMuZXhwaXJlcylcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2F1dGhUb2tlbiA9IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub25Mb2dpbikge1xuICAgICAgdGhpcy5vbkxvZ2luKGN0cmwuY29kZSwgY3RybC50ZXh0KTtcbiAgICB9XG4gIH1cblxuICAvLyBUaGUgbWFpbiBtZXNzYWdlIGRpc3BhdGNoZXIuXG4gIHRoaXMuX2Nvbm5lY3Rpb24ub25NZXNzYWdlID0gKGRhdGEpID0+IHtcbiAgICAvLyBTa2lwIGVtcHR5IHJlc3BvbnNlLiBUaGlzIGhhcHBlbnMgd2hlbiBMUCB0aW1lcyBvdXQuXG4gICAgaWYgKCFkYXRhKSByZXR1cm47XG5cbiAgICB0aGlzLl9pblBhY2tldENvdW50Kys7XG5cbiAgICAvLyBTZW5kIHJhdyBtZXNzYWdlIHRvIGxpc3RlbmVyXG4gICAgaWYgKHRoaXMub25SYXdNZXNzYWdlKSB7XG4gICAgICB0aGlzLm9uUmF3TWVzc2FnZShkYXRhKTtcbiAgICB9XG5cbiAgICBpZiAoZGF0YSA9PT0gJzAnKSB7XG4gICAgICAvLyBTZXJ2ZXIgcmVzcG9uc2UgdG8gYSBuZXR3b3JrIHByb2JlLlxuICAgICAgaWYgKHRoaXMub25OZXR3b3JrUHJvYmUpIHtcbiAgICAgICAgdGhpcy5vbk5ldHdvcmtQcm9iZSgpO1xuICAgICAgfVxuICAgICAgLy8gTm8gcHJvY2Vzc2luZyBpcyBuZWNlc3NhcnkuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHBrdCA9IEpTT04ucGFyc2UoZGF0YSwganNvblBhcnNlSGVscGVyKTtcbiAgICBpZiAoIXBrdCkge1xuICAgICAgdGhpcy5sb2dnZXIoXCJpbjogXCIgKyBkYXRhKTtcbiAgICAgIHRoaXMubG9nZ2VyKFwiRVJST1I6IGZhaWxlZCB0byBwYXJzZSBkYXRhXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxvZ2dlcihcImluOiBcIiArICh0aGlzLl90cmltTG9uZ1N0cmluZ3MgPyBKU09OLnN0cmluZ2lmeShwa3QsIGpzb25Mb2dnZXJIZWxwZXIpIDogZGF0YSkpO1xuXG4gICAgICAvLyBTZW5kIGNvbXBsZXRlIHBhY2tldCB0byBsaXN0ZW5lclxuICAgICAgaWYgKHRoaXMub25NZXNzYWdlKSB7XG4gICAgICAgIHRoaXMub25NZXNzYWdlKHBrdCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChwa3QuY3RybCkge1xuICAgICAgICAvLyBIYW5kbGluZyB7Y3RybH0gbWVzc2FnZVxuICAgICAgICBpZiAodGhpcy5vbkN0cmxNZXNzYWdlKSB7XG4gICAgICAgICAgdGhpcy5vbkN0cmxNZXNzYWdlKHBrdC5jdHJsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlc29sdmUgb3IgcmVqZWN0IGEgcGVuZGluZyBwcm9taXNlLCBpZiBhbnlcbiAgICAgICAgaWYgKHBrdC5jdHJsLmlkKSB7XG4gICAgICAgICAgZXhlY1Byb21pc2UocGt0LmN0cmwuaWQsIHBrdC5jdHJsLmNvZGUsIHBrdC5jdHJsLCBwa3QuY3RybC50ZXh0KTtcbiAgICAgICAgfVxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBpZiAocGt0LmN0cmwuY29kZSA9PSAyMDUgJiYgcGt0LmN0cmwudGV4dCA9PSAnZXZpY3RlZCcpIHtcbiAgICAgICAgICAgIC8vIFVzZXIgZXZpY3RlZCBmcm9tIHRvcGljLlxuICAgICAgICAgICAgY29uc3QgdG9waWMgPSBjYWNoZUdldCgndG9waWMnLCBwa3QuY3RybC50b3BpYyk7XG4gICAgICAgICAgICBpZiAodG9waWMpIHtcbiAgICAgICAgICAgICAgdG9waWMuX3Jlc2V0U3ViKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChwa3QuY3RybC5wYXJhbXMgJiYgcGt0LmN0cmwucGFyYW1zLndoYXQgPT0gJ2RhdGEnKSB7XG4gICAgICAgICAgICAvLyBBbGwgbWVzc2FnZXMgcmVjZWl2ZWQ6IFwicGFyYW1zXCI6e1wiY291bnRcIjoxMSxcIndoYXRcIjpcImRhdGFcIn0sXG4gICAgICAgICAgICBjb25zdCB0b3BpYyA9IGNhY2hlR2V0KCd0b3BpYycsIHBrdC5jdHJsLnRvcGljKTtcbiAgICAgICAgICAgIGlmICh0b3BpYykge1xuICAgICAgICAgICAgICB0b3BpYy5fYWxsTWVzc2FnZXNSZWNlaXZlZChwa3QuY3RybC5wYXJhbXMuY291bnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAocGt0LmN0cmwucGFyYW1zICYmIHBrdC5jdHJsLnBhcmFtcy53aGF0ID09ICdzdWInKSB7XG4gICAgICAgICAgICAvLyBUaGUgdG9waWMgaGFzIG5vIHN1YnNjcmlwdGlvbnMuXG4gICAgICAgICAgICBjb25zdCB0b3BpYyA9IGNhY2hlR2V0KCd0b3BpYycsIHBrdC5jdHJsLnRvcGljKTtcbiAgICAgICAgICAgIGlmICh0b3BpYykge1xuICAgICAgICAgICAgICAvLyBUcmlnZ2VyIHRvcGljLm9uU3Vic1VwZGF0ZWQuXG4gICAgICAgICAgICAgIHRvcGljLl9wcm9jZXNzTWV0YVN1YihbXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LCAwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGlmIChwa3QubWV0YSkge1xuICAgICAgICAgICAgLy8gSGFuZGxpbmcgYSB7bWV0YX0gbWVzc2FnZS5cblxuICAgICAgICAgICAgLy8gUHJlZmVycmVkIEFQSTogUm91dGUgbWV0YSB0byB0b3BpYywgaWYgb25lIGlzIHJlZ2lzdGVyZWRcbiAgICAgICAgICAgIGNvbnN0IHRvcGljID0gY2FjaGVHZXQoJ3RvcGljJywgcGt0Lm1ldGEudG9waWMpO1xuICAgICAgICAgICAgaWYgKHRvcGljKSB7XG4gICAgICAgICAgICAgIHRvcGljLl9yb3V0ZU1ldGEocGt0Lm1ldGEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocGt0Lm1ldGEuaWQpIHtcbiAgICAgICAgICAgICAgZXhlY1Byb21pc2UocGt0Lm1ldGEuaWQsIDIwMCwgcGt0Lm1ldGEsICdNRVRBJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFNlY29uZGFyeSBBUEk6IGNhbGxiYWNrXG4gICAgICAgICAgICBpZiAodGhpcy5vbk1ldGFNZXNzYWdlKSB7XG4gICAgICAgICAgICAgIHRoaXMub25NZXRhTWVzc2FnZShwa3QubWV0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChwa3QuZGF0YSkge1xuICAgICAgICAgICAgLy8gSGFuZGxpbmcge2RhdGF9IG1lc3NhZ2VcblxuICAgICAgICAgICAgLy8gUHJlZmVycmVkIEFQSTogUm91dGUgZGF0YSB0byB0b3BpYywgaWYgb25lIGlzIHJlZ2lzdGVyZWRcbiAgICAgICAgICAgIGNvbnN0IHRvcGljID0gY2FjaGVHZXQoJ3RvcGljJywgcGt0LmRhdGEudG9waWMpO1xuICAgICAgICAgICAgaWYgKHRvcGljKSB7XG4gICAgICAgICAgICAgIHRvcGljLl9yb3V0ZURhdGEocGt0LmRhdGEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBTZWNvbmRhcnkgQVBJOiBDYWxsIGNhbGxiYWNrXG4gICAgICAgICAgICBpZiAodGhpcy5vbkRhdGFNZXNzYWdlKSB7XG4gICAgICAgICAgICAgIHRoaXMub25EYXRhTWVzc2FnZShwa3QuZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChwa3QucHJlcykge1xuICAgICAgICAgICAgLy8gSGFuZGxpbmcge3ByZXN9IG1lc3NhZ2VcblxuICAgICAgICAgICAgLy8gUHJlZmVycmVkIEFQSTogUm91dGUgcHJlc2VuY2UgdG8gdG9waWMsIGlmIG9uZSBpcyByZWdpc3RlcmVkXG4gICAgICAgICAgICBjb25zdCB0b3BpYyA9IGNhY2hlR2V0KCd0b3BpYycsIHBrdC5wcmVzLnRvcGljKTtcbiAgICAgICAgICAgIGlmICh0b3BpYykge1xuICAgICAgICAgICAgICB0b3BpYy5fcm91dGVQcmVzKHBrdC5wcmVzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gU2Vjb25kYXJ5IEFQSSAtIGNhbGxiYWNrXG4gICAgICAgICAgICBpZiAodGhpcy5vblByZXNNZXNzYWdlKSB7XG4gICAgICAgICAgICAgIHRoaXMub25QcmVzTWVzc2FnZShwa3QucHJlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChwa3QuaW5mbykge1xuICAgICAgICAgICAgLy8ge2luZm99IG1lc3NhZ2UgLSByZWFkL3JlY2VpdmVkIG5vdGlmaWNhdGlvbnMgYW5kIGtleSBwcmVzc2VzXG5cbiAgICAgICAgICAgIC8vIFByZWZlcnJlZCBBUEk6IFJvdXRlIHtpbmZvfX0gdG8gdG9waWMsIGlmIG9uZSBpcyByZWdpc3RlcmVkXG4gICAgICAgICAgICBjb25zdCB0b3BpYyA9IGNhY2hlR2V0KCd0b3BpYycsIHBrdC5pbmZvLnRvcGljKTtcbiAgICAgICAgICAgIGlmICh0b3BpYykge1xuICAgICAgICAgICAgICB0b3BpYy5fcm91dGVJbmZvKHBrdC5pbmZvKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gU2Vjb25kYXJ5IEFQSSAtIGNhbGxiYWNrXG4gICAgICAgICAgICBpZiAodGhpcy5vbkluZm9NZXNzYWdlKSB7XG4gICAgICAgICAgICAgIHRoaXMub25JbmZvTWVzc2FnZShwa3QuaW5mbyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyKFwiRVJST1I6IFVua25vd24gcGFja2V0IHJlY2VpdmVkLlwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIDApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIFJlYWR5IHRvIHN0YXJ0IHNlbmRpbmcuXG4gIHRoaXMuX2Nvbm5lY3Rpb24ub25PcGVuID0gKCkgPT4ge1xuICAgIHRoaXMuaGVsbG8oKTtcbiAgfVxuXG4gIC8vIFdyYXBwZXIgZm9yIHRoZSByZWNvbm5lY3QgaXRlcmF0b3IgY2FsbGJhY2suXG4gIHRoaXMuX2Nvbm5lY3Rpb24ub25BdXRvcmVjb25uZWN0SXRlcmF0aW9uID0gKHRpbWVvdXQsIHByb21pc2UpID0+IHtcbiAgICBpZiAodGhpcy5vbkF1dG9yZWNvbm5lY3RJdGVyYXRpb24pIHtcbiAgICAgIHRoaXMub25BdXRvcmVjb25uZWN0SXRlcmF0aW9uKHRpbWVvdXQsIHByb21pc2UpO1xuICAgIH1cbiAgfVxuXG4gIHRoaXMuX2Nvbm5lY3Rpb24ub25EaXNjb25uZWN0ID0gKGVyciwgY29kZSkgPT4ge1xuICAgIHRoaXMuX2luUGFja2V0Q291bnQgPSAwO1xuICAgIHRoaXMuX3NlcnZlckluZm8gPSBudWxsO1xuICAgIHRoaXMuX2F1dGhlbnRpY2F0ZWQgPSBmYWxzZTtcblxuICAgIC8vIE1hcmsgYWxsIHRvcGljcyBhcyB1bnN1YnNjcmliZWRcbiAgICBjYWNoZU1hcCgob2JqLCBrZXkpID0+IHtcbiAgICAgIGlmIChrZXkubGFzdEluZGV4T2YoJ3RvcGljOicsIDApID09PSAwKSB7XG4gICAgICAgIG9iai5fcmVzZXRTdWIoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFJlamVjdCBhbGwgcGVuZGluZyBwcm9taXNlc1xuICAgIGZvciAobGV0IGtleSBpbiB0aGlzLl9wZW5kaW5nUHJvbWlzZXMpIHtcbiAgICAgIGxldCBjYWxsYmFja3MgPSB0aGlzLl9wZW5kaW5nUHJvbWlzZXNba2V5XTtcbiAgICAgIGlmIChjYWxsYmFja3MgJiYgY2FsbGJhY2tzLnJlamVjdCkge1xuICAgICAgICBjYWxsYmFja3MucmVqZWN0KGVycik7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuX3BlbmRpbmdQcm9taXNlcyA9IHt9O1xuXG4gICAgaWYgKHRoaXMub25EaXNjb25uZWN0KSB7XG4gICAgICB0aGlzLm9uRGlzY29ubmVjdChlcnIpO1xuICAgIH1cbiAgfVxufTtcblxuLy8gU3RhdGljIG1ldGhvZHMuXG5cbi8qKlxuICogSGVscGVyIG1ldGhvZCB0byBwYWNrYWdlIGFjY291bnQgY3JlZGVudGlhbC5cbiAqIEBtZW1iZXJvZiBUaW5vZGVcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xPYmplY3R9IG1ldGggLSB2YWxpZGF0aW9uIG1ldGhvZCBvciBvYmplY3Qgd2l0aCB2YWxpZGF0aW9uIGRhdGEuXG4gKiBAcGFyYW0ge1N0cmluZz19IHZhbCAtIHZhbGlkYXRpb24gdmFsdWUgKGUuZy4gZW1haWwgb3IgcGhvbmUgbnVtYmVyKS5cbiAqIEBwYXJhbSB7T2JqZWN0PX0gcGFyYW1zIC0gdmFsaWRhdGlvbiBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtTdHJpbmc9fSByZXNwIC0gdmFsaWRhdGlvbiByZXNwb25zZS5cbiAqXG4gKiBAcmV0dXJucyB7QXJyYXl9IGFycmF5IHdpdGggYSBzaW5nbGUgY3JlZGVudGFpbCBvciBudWxsIGlmIG5vIHZhbGlkIGNyZWRlbnRpYWxzIHdlcmUgZ2l2ZW4uXG4gKi9cblRpbm9kZS5jcmVkZW50aWFsID0gZnVuY3Rpb24obWV0aCwgdmFsLCBwYXJhbXMsIHJlc3ApIHtcbiAgaWYgKHR5cGVvZiBtZXRoID09ICdvYmplY3QnKSB7XG4gICAgKHtcbiAgICAgIHZhbCxcbiAgICAgIHBhcmFtcyxcbiAgICAgIHJlc3AsXG4gICAgICBtZXRoXG4gICAgfSA9IG1ldGgpO1xuICB9XG4gIGlmIChtZXRoICYmICh2YWwgfHwgcmVzcCkpIHtcbiAgICByZXR1cm4gW3tcbiAgICAgICdtZXRoJzogbWV0aCxcbiAgICAgICd2YWwnOiB2YWwsXG4gICAgICAncmVzcCc6IHJlc3AsXG4gICAgICAncGFyYW1zJzogcGFyYW1zXG4gICAgfV07XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59O1xuXG4vKipcbiAqIERldGVybWluZSB0b3BpYyB0eXBlIGZyb20gdG9waWMncyBuYW1lOiBncnAsIHAycCwgbWUsIGZuZC5cbiAqIEBtZW1iZXJvZiBUaW5vZGVcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIHRlc3QuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBPbmUgb2YgPHR0PidtZSc8L3R0PiwgPHR0PidncnAnPC90dD4sIDx0dD4ncDJwJzwvdHQ+IG9yIDx0dD51bmRlZmluZWQ8L3R0Pi5cbiAqL1xuVGlub2RlLnRvcGljVHlwZSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgY29uc3QgdHlwZXMgPSB7XG4gICAgJ21lJzogJ21lJyxcbiAgICAnZm5kJzogJ2ZuZCcsXG4gICAgJ2dycCc6ICdncnAnLFxuICAgICduZXcnOiAnZ3JwJyxcbiAgICAndXNyJzogJ3AycCcsXG4gICAgJ3N5cyc6ICdzeXMnXG4gIH07XG4gIHJldHVybiB0eXBlc1sodHlwZW9mIG5hbWUgPT0gJ3N0cmluZycpID8gbmFtZS5zdWJzdHJpbmcoMCwgMykgOiAneHh4J107XG59O1xuXG4vKipcbiAqIENoZWNrIGlmIHRoZSB0b3BpYyBuYW1lIGlzIGEgbmFtZSBvZiBhIG5ldyB0b3BpYy5cbiAqIEBtZW1iZXJvZiBUaW5vZGVcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIHRvcGljIG5hbWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGUgbmFtZSBpcyBhIG5hbWUgb2YgYSBuZXcgdG9waWMuXG4gKi9cblRpbm9kZS5pc05ld0dyb3VwVG9waWNOYW1lID0gZnVuY3Rpb24obmFtZSkge1xuICByZXR1cm4gKHR5cGVvZiBuYW1lID09ICdzdHJpbmcnKSAmJiBuYW1lLnN1YnN0cmluZygwLCAzKSA9PSBUT1BJQ19ORVc7XG59O1xuXG4vKipcbiAqIFJldHVybiBpbmZvcm1hdGlvbiBhYm91dCB0aGUgY3VycmVudCB2ZXJzaW9uIG9mIHRoaXMgVGlub2RlIGNsaWVudCBsaWJyYXJ5LlxuICogQG1lbWJlcm9mIFRpbm9kZVxuICogQHN0YXRpY1xuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IHNlbWFudGljIHZlcnNpb24gb2YgdGhlIGxpYnJhcnksIGUuZy4gJzAuMTUuNS1yYzEnLlxuICovXG5UaW5vZGUuZ2V0VmVyc2lvbiA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gVkVSU0lPTjtcbn07XG5cbi8qKlxuICogVG8gdXNlIFRpbm9kZSBpbiBhIG5vbiBicm93c2VyIGNvbnRleHQsIHN1cHBseSBXZWJTb2NrZXQgYW5kIFhNTEh0dHBSZXF1ZXN0IHByb3ZpZGVycy5cbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJvZiBUaW5vZGVcbiAqIEBwYXJhbSB3c1Byb3ZpZGVyIFdlYlNvY2tldCBwcm92aWRlciwgZS5nLiBmb3Igbm9kZUpTIHJlcXVpcmUoJ3dzJykuXG4gKiBAcGFyYW0geGhyUHJvdmlkZXIgWE1MSHR0cFJlcXVlc3QgcHJvdmlkZXIsIGUuZy4gZm9yIG5vZGUgcmVxdWlyZSgneGhyJykuXG4gKi9cblRpbm9kZS5zZXROZXR3b3JrUHJvdmlkZXJzID0gZnVuY3Rpb24od3NQcm92aWRlciwgeGhyUHJvdmlkZXIpIHtcbiAgV2ViU29ja2V0UHJvdmlkZXIgPSB3c3Byb3ZpZGVyO1xuICBYSFJQcm92aWRlciA9IHhocnByb3ZpZGVyO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gaW5mb3JtYXRpb24gYWJvdXQgdGhlIGN1cnJlbnQgbmFtZSBhbmQgdmVyc2lvbiBvZiB0aGlzIFRpbm9kZSBsaWJyYXJ5LlxuICogQG1lbWJlcm9mIFRpbm9kZVxuICogQHN0YXRpY1xuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IHRoZSBuYW1lIG9mIHRoZSBsaWJyYXJ5IGFuZCBpdCdzIHZlcnNpb24uXG4gKi9cblRpbm9kZS5nZXRMaWJyYXJ5ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBMSUJSQVJZO1xufTtcblxuLy8gRXhwb3J0ZWQgY29uc3RhbnRzXG5UaW5vZGUuTUVTU0FHRV9TVEFUVVNfTk9ORSA9IE1FU1NBR0VfU1RBVFVTX05PTkU7XG5UaW5vZGUuTUVTU0FHRV9TVEFUVVNfUVVFVUVEID0gTUVTU0FHRV9TVEFUVVNfUVVFVUVEO1xuVGlub2RlLk1FU1NBR0VfU1RBVFVTX1NFTkRJTkcgPSBNRVNTQUdFX1NUQVRVU19TRU5ESU5HO1xuVGlub2RlLk1FU1NBR0VfU1RBVFVTX0ZBSUxFRCA9IE1FU1NBR0VfU1RBVFVTX0ZBSUxFRDtcblRpbm9kZS5NRVNTQUdFX1NUQVRVU19TRU5UID0gTUVTU0FHRV9TVEFUVVNfU0VOVDtcblRpbm9kZS5NRVNTQUdFX1NUQVRVU19SRUNFSVZFRCA9IE1FU1NBR0VfU1RBVFVTX1JFQ0VJVkVEO1xuVGlub2RlLk1FU1NBR0VfU1RBVFVTX1JFQUQgPSBNRVNTQUdFX1NUQVRVU19SRUFEO1xuVGlub2RlLk1FU1NBR0VfU1RBVFVTX1RPX01FID0gTUVTU0FHRV9TVEFUVVNfVE9fTUU7XG5cbi8vIFVuaWNvZGUgW2RlbF0gc3ltYm9sLlxuVGlub2RlLkRFTF9DSEFSID0gJ1xcdTI0MjEnO1xuXG4vKipcbiAqIENoZWNrIGlmIHRoZSBnaXZlbiBzdHJpbmcgcmVwcnNlbnRzIE5VTEwgdmFsdWUuXG4gKiBAbWVtYmVyb2YgVGlub2RlXG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0ciAtIHN0cmluZyB0byBjaGVjayBmb3IgbnVsbCB2YWx1ZS5cbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiBzdHJpbmcgaXMgbnVsbCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICovXG5UaW5vZGUuaXNOdWxsVmFsdWUgPSBmdW5jdGlvbihzdHIpIHtcbiAgcmV0dXJuIHN0ciA9PT0gVGlub2RlLkRFTF9DSEFSO1xufTtcblxuLy8gUHVibGljIG1ldGhvZHM7XG5UaW5vZGUucHJvdG90eXBlID0ge1xuICAvKipcbiAgICogQ29ubmVjdCB0byB0aGUgc2VydmVyLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaG9zdF8gLSBuYW1lIG9mIHRoZSBob3N0IHRvIGNvbm5lY3QgdG8uXG4gICAqXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IFByb21pc2UgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgY29ubmVjdGlvbiBjYWxsIGNvbXBsZXRlczpcbiAgICogPHR0PnJlc29sdmUoKTwvdHQ+IGlzIGNhbGxlZCB3aXRob3V0IHBhcmFtZXRlcnMsIDx0dD5yZWplY3QoKTwvdHQ+IHJlY2VpdmVzIHRoZSA8dHQ+RXJyb3I8L3R0PiBhcyBhIHNpbmdsZSBwYXJhbWV0ZXIuXG4gICAqL1xuICBjb25uZWN0OiBmdW5jdGlvbihob3N0Xykge1xuICAgIHJldHVybiB0aGlzLl9jb25uZWN0aW9uLmNvbm5lY3QoaG9zdF8pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBBdHRlbXB0IHRvIHJlY29ubmVjdCB0byB0aGUgc2VydmVyIGltbWVkaWF0ZWx5LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gZm9yY2UgLSByZWNvbm5lY3QgZXZlbiBpZiB0aGVyZSBpcyBhIGNvbm5lY3Rpb24gYWxyZWFkeS5cbiAgICovXG4gIHJlY29ubmVjdDogZnVuY3Rpb24oZm9yY2UpIHtcbiAgICB0aGlzLl9jb25uZWN0aW9uLnJlY29ubmVjdChmb3JjZSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIERpc2Nvbm5lY3QgZnJvbSB0aGUgc2VydmVyLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKi9cbiAgZGlzY29ubmVjdDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5fY29ubmVjdGlvbi5kaXNjb25uZWN0KCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNlbmQgYSBuZXR3b3JrIHByb2JlIG1lc3NhZ2UgdG8gbWFrZSBzdXJlIHRoZSBjb25uZWN0aW9uIGlzIGFsaXZlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKi9cbiAgbmV0d29ya1Byb2JlOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLl9jb25uZWN0aW9uLnByb2JlKCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENoZWNrIGZvciBsaXZlIGNvbm5lY3Rpb24gdG8gc2VydmVyLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gdHJ1ZSBpZiB0aGVyZSBpcyBhIGxpdmUgY29ubmVjdGlvbiwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNDb25uZWN0ZWQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9jb25uZWN0aW9uLmlzQ29ubmVjdGVkKCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGNvbm5lY3Rpb24gaXMgYXV0aGVudGljYXRlZCAobGFzdCBsb2dpbiB3YXMgc3VjY2Vzc2Z1bCkuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIGF1dGhlbnRpY2F0ZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAgICovXG4gIGlzQXV0aGVudGljYXRlZDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2F1dGhlbnRpY2F0ZWQ7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIEFjY291bnRQYXJhbXNcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAdHlwZSBPYmplY3RcbiAgICogQHByb3BlcnR5IHtUaW5vZGUuRGVmQWNzPX0gZGVmYWNzIC0gRGVmYXVsdCBhY2Nlc3MgcGFyYW1ldGVycyBmb3IgdXNlcidzIDx0dD5tZTwvdHQ+IHRvcGljLlxuICAgKiBAcHJvcGVydHkge09iamVjdD19IHB1YmxpYyAtIFB1YmxpYyBhcHBsaWNhdGlvbi1kZWZpbmVkIGRhdGEgZXhwb3NlZCBvbiA8dHQ+bWU8L3R0PiB0b3BpYy5cbiAgICogQHByb3BlcnR5IHtPYmplY3Q9fSBwcml2YXRlIC0gUHJpdmF0ZSBhcHBsaWNhdGlvbi1kZWZpbmVkIGRhdGEgYWNjZXNzaWJsZSBvbiA8dHQ+bWU8L3R0PiB0b3BpYy5cbiAgICogQHByb3BlcnR5IHtBcnJheX0gdGFncyAtIGFycmF5IG9mIHN0cmluZyB0YWdzIGZvciB1c2VyIGRpc2NvdmVyeS5cbiAgICogQHByb3BlcnR5IHtzdHJpbmc9fSB0b2tlbiAtIGF1dGhlbnRpY2F0aW9uIHRva2VuIHRvIHVzZS5cbiAgICovXG4gIC8qKlxuICAgKiBAdHlwZWRlZiBEZWZBY3NcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAdHlwZSBPYmplY3RcbiAgICogQHByb3BlcnR5IHtzdHJpbmc9fSBhdXRoIC0gQWNjZXNzIG1vZGUgZm9yIDx0dD5tZTwvdHQ+IGZvciBhdXRoZW50aWNhdGVkIHVzZXJzLlxuICAgKiBAcHJvcGVydHkge3N0cmluZz19IGFub24gLSBBY2Nlc3MgbW9kZSBmb3IgPHR0Pm1lPC90dD4gIGFub255bW91cyB1c2Vycy5cbiAgICovXG5cbiAgLyoqXG4gICAqIENyZWF0ZSBvciB1cGRhdGUgYW4gYWNjb3VudC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHVpZCAtIFVzZXIgaWQgdG8gdXBkYXRlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzY2hlbWUgLSBBdXRoZW50aWNhdGlvbiBzY2hlbWU7IDx0dD5cImJhc2ljXCI8L3R0PiBhbmQgPHR0PlwiYW5vbnltb3VzXCI8L3R0PiBhcmUgdGhlIGN1cnJlbnRseSBzdXBwb3J0ZWQgc2NoZW1lcy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IHNlY3JldCAtIEF1dGhlbnRpY2F0aW9uIHNlY3JldCwgYXNzdW1lZCB0byBiZSBhbHJlYWR5IGJhc2U2NCBlbmNvZGVkLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW49fSBsb2dpbiAtIFVzZSBuZXcgYWNjb3VudCB0byBhdXRoZW50aWNhdGUgY3VycmVudCBzZXNzaW9uXG4gICAqIEBwYXJhbSB7VGlub2RlLkFjY291bnRQYXJhbXM9fSBwYXJhbXMgLSBVc2VyIGRhdGEgdG8gcGFzcyB0byB0aGUgc2VydmVyLlxuICAgKi9cbiAgYWNjb3VudDogZnVuY3Rpb24odWlkLCBzY2hlbWUsIHNlY3JldCwgbG9naW4sIHBhcmFtcykge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuaW5pdFBhY2tldCgnYWNjJyk7XG4gICAgcGt0LmFjYy51c2VyID0gdWlkO1xuICAgIHBrdC5hY2Muc2NoZW1lID0gc2NoZW1lO1xuICAgIHBrdC5hY2Muc2VjcmV0ID0gc2VjcmV0O1xuICAgIC8vIExvZyBpbiB0byB0aGUgbmV3IGFjY291bnQgdXNpbmcgc2VsZWN0ZWQgc2NoZW1lXG4gICAgcGt0LmFjYy5sb2dpbiA9IGxvZ2luO1xuXG4gICAgaWYgKHBhcmFtcykge1xuICAgICAgcGt0LmFjYy5kZXNjLmRlZmFjcyA9IHBhcmFtcy5kZWZhY3M7XG4gICAgICBwa3QuYWNjLmRlc2MucHVibGljID0gcGFyYW1zLnB1YmxpYztcbiAgICAgIHBrdC5hY2MuZGVzYy5wcml2YXRlID0gcGFyYW1zLnByaXZhdGU7XG5cbiAgICAgIHBrdC5hY2MudGFncyA9IHBhcmFtcy50YWdzO1xuICAgICAgcGt0LmFjYy5jcmVkID0gcGFyYW1zLmNyZWQ7XG5cbiAgICAgIHBrdC5hY2MudG9rZW4gPSBwYXJhbXMudG9rZW47XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuc2VuZChwa3QsIHBrdC5hY2MuaWQpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgdXNlci4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNhY2NvdW50fS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHNjaGVtZSAtIEF1dGhlbnRpY2F0aW9uIHNjaGVtZTsgPHR0PlwiYmFzaWNcIjwvdHQ+IGlzIHRoZSBvbmx5IGN1cnJlbnRseSBzdXBwb3J0ZWQgc2NoZW1lLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2VjcmV0IC0gQXV0aGVudGljYXRpb24uXG4gICAqIEBwYXJhbSB7Qm9vbGVhbj19IGxvZ2luIC0gVXNlIG5ldyBhY2NvdW50IHRvIGF1dGhlbnRpY2F0ZSBjdXJyZW50IHNlc3Npb25cbiAgICogQHBhcmFtIHtUaW5vZGUuQWNjb3VudFBhcmFtcz19IHBhcmFtcyAtIFVzZXIgZGF0YSB0byBwYXNzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiBzZXJ2ZXIgcmVwbHkgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICBjcmVhdGVBY2NvdW50OiBmdW5jdGlvbihzY2hlbWUsIHNlY3JldCwgbG9naW4sIHBhcmFtcykge1xuICAgIGxldCBwcm9taXNlID0gdGhpcy5hY2NvdW50KFVTRVJfTkVXLCBzY2hlbWUsIHNlY3JldCwgbG9naW4sIHBhcmFtcyk7XG4gICAgaWYgKGxvZ2luKSB7XG4gICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChjdHJsKSA9PiB7XG4gICAgICAgIHRoaXMubG9naW5TdWNjZXNzZnVsKGN0cmwpO1xuICAgICAgICByZXR1cm4gY3RybDtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfSxcblxuICAvKipcbiAgICogQ3JlYXRlIHVzZXIgd2l0aCAnYmFzaWMnIGF1dGhlbnRpY2F0aW9uIHNjaGVtZSBhbmQgaW1tZWRpYXRlbHlcbiAgICogdXNlIGl0IGZvciBhdXRoZW50aWNhdGlvbi4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNhY2NvdW50fS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVzZXJuYW1lIC0gTG9naW4gdG8gdXNlIGZvciB0aGUgbmV3IGFjY291bnQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXNzd29yZCAtIFVzZXIncyBwYXNzd29yZC5cbiAgICogQHBhcmFtIHtUaW5vZGUuQWNjb3VudFBhcmFtcz19IHBhcmFtcyAtIFVzZXIgZGF0YSB0byBwYXNzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiBzZXJ2ZXIgcmVwbHkgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICBjcmVhdGVBY2NvdW50QmFzaWM6IGZ1bmN0aW9uKHVzZXJuYW1lLCBwYXNzd29yZCwgcGFyYW1zKSB7XG4gICAgLy8gTWFrZSBzdXJlIHdlIGFyZSBub3QgdXNpbmcgJ251bGwnIG9yICd1bmRlZmluZWQnO1xuICAgIHVzZXJuYW1lID0gdXNlcm5hbWUgfHwgJyc7XG4gICAgcGFzc3dvcmQgPSBwYXNzd29yZCB8fCAnJztcbiAgICByZXR1cm4gdGhpcy5jcmVhdGVBY2NvdW50KCdiYXNpYycsXG4gICAgICBiNjRFbmNvZGVVbmljb2RlKHVzZXJuYW1lICsgJzonICsgcGFzc3dvcmQpLCB0cnVlLCBwYXJhbXMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBVcGRhdGUgdXNlcidzIGNyZWRlbnRpYWxzIGZvciAnYmFzaWMnIGF1dGhlbnRpY2F0aW9uIHNjaGVtZS4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNhY2NvdW50fS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVpZCAtIFVzZXIgSUQgdG8gdXBkYXRlLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXNlcm5hbWUgLSBMb2dpbiB0byB1c2UgZm9yIHRoZSBuZXcgYWNjb3VudC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhc3N3b3JkIC0gVXNlcidzIHBhc3N3b3JkLlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5BY2NvdW50UGFyYW1zPX0gcGFyYW1zIC0gZGF0YSB0byBwYXNzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiBzZXJ2ZXIgcmVwbHkgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICB1cGRhdGVBY2NvdW50QmFzaWM6IGZ1bmN0aW9uKHVpZCwgdXNlcm5hbWUsIHBhc3N3b3JkLCBwYXJhbXMpIHtcbiAgICAvLyBNYWtlIHN1cmUgd2UgYXJlIG5vdCB1c2luZyAnbnVsbCcgb3IgJ3VuZGVmaW5lZCc7XG4gICAgdXNlcm5hbWUgPSB1c2VybmFtZSB8fCAnJztcbiAgICBwYXNzd29yZCA9IHBhc3N3b3JkIHx8ICcnO1xuICAgIHJldHVybiB0aGlzLmFjY291bnQodWlkLCAnYmFzaWMnLFxuICAgICAgYjY0RW5jb2RlVW5pY29kZSh1c2VybmFtZSArICc6JyArIHBhc3N3b3JkKSwgZmFsc2UsIHBhcmFtcyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNlbmQgaGFuZHNoYWtlIHRvIHRoZSBzZXJ2ZXIuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiBzZXJ2ZXIgcmVwbHkgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICBoZWxsbzogZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy5pbml0UGFja2V0KCdoaScpO1xuXG4gICAgcmV0dXJuIHRoaXMuc2VuZChwa3QsIHBrdC5oaS5pZClcbiAgICAgIC50aGVuKChjdHJsKSA9PiB7XG4gICAgICAgIC8vIFJlc2V0IGJhY2tvZmYgY291bnRlciBvbiBzdWNjZXNzZnVsIGNvbm5lY3Rpb24uXG4gICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uYmFja29mZlJlc2V0KCk7XG5cbiAgICAgICAgLy8gU2VydmVyIHJlc3BvbnNlIGNvbnRhaW5zIHNlcnZlciBwcm90b2NvbCB2ZXJzaW9uLCBidWlsZCwgY29uc3RyYWludHMsXG4gICAgICAgIC8vIHNlc3Npb24gSUQgZm9yIGxvbmcgcG9sbGluZy4gU2F2ZSB0aGVtLlxuICAgICAgICBpZiAoY3RybC5wYXJhbXMpIHtcbiAgICAgICAgICB0aGlzLl9zZXJ2ZXJJbmZvID0gY3RybC5wYXJhbXM7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5vbkNvbm5lY3QpIHtcbiAgICAgICAgICB0aGlzLm9uQ29ubmVjdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGN0cmw7XG4gICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24ucmVjb25uZWN0KHRydWUpO1xuXG4gICAgICAgIGlmICh0aGlzLm9uRGlzY29ubmVjdCkge1xuICAgICAgICAgIHRoaXMub25EaXNjb25uZWN0KGVycik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTZXQgb3IgcmVmcmVzaCB0aGUgcHVzaCBub3RpZmljYXRpb25zL2RldmljZSB0b2tlbi4gSWYgdGhlIGNsaWVudCBpcyBjb25uZWN0ZWQsXG4gICAqIHRoZSBkZXZpY2VUb2tlbiBjYW4gYmUgc2VudCB0byB0aGUgc2VydmVyLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKiBAcGFyYW0ge3N0cmluZ30gZHQgLSB0b2tlbiBvYnRhaW5lZCBmcm9tIHRoZSBwcm92aWRlci5cbiAgICogQHBhcmFtIHtib29sZWFufSBzZW5kVG9TZXJ2ZXIgLSBpZiB0cnVlLCBzZW5kIGR0IHRvIHNlcnZlciBpbW1lZGlhdGVseS5cbiAgICpcbiAgICogQHBhcmFtIHRydWUgaWYgYXR0ZW1wdCB3YXMgbWFkZSB0byBzZW5kIHRoZSB0b2tlbiB0byB0aGUgc2VydmVyLlxuICAgKi9cbiAgc2V0RGV2aWNlVG9rZW46IGZ1bmN0aW9uKGR0LCBzZW5kVG9TZXJ2ZXIpIHtcbiAgICBsZXQgc2VudCA9IGZhbHNlO1xuICAgIGlmIChkdCAmJiBkdCAhPSB0aGlzLl9kZXZpY2VUb2tlbikge1xuICAgICAgdGhpcy5fZGV2aWNlVG9rZW4gPSBkdDtcbiAgICAgIGlmIChzZW5kVG9TZXJ2ZXIgJiYgdGhpcy5pc0Nvbm5lY3RlZCgpICYmIHRoaXMuaXNBdXRoZW50aWNhdGVkKCkpIHtcbiAgICAgICAgdGhpcy5zZW5kKHtcbiAgICAgICAgICAnaGknOiB7XG4gICAgICAgICAgICAnZGV2JzogZHRcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBzZW50ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNlbnQ7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEF1dGhlbnRpY2F0ZSBjdXJyZW50IHNlc3Npb24uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzY2hlbWUgLSBBdXRoZW50aWNhdGlvbiBzY2hlbWU7IDx0dD5cImJhc2ljXCI8L3R0PiBpcyB0aGUgb25seSBjdXJyZW50bHkgc3VwcG9ydGVkIHNjaGVtZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IHNlY3JldCAtIEF1dGhlbnRpY2F0aW9uIHNlY3JldCwgYXNzdW1lZCB0byBiZSBhbHJlYWR5IGJhc2U2NCBlbmNvZGVkLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gc2VydmVyIHJlcGx5IGlzIHJlY2VpdmVkLlxuICAgKi9cbiAgbG9naW46IGZ1bmN0aW9uKHNjaGVtZSwgc2VjcmV0LCBjcmVkKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy5pbml0UGFja2V0KCdsb2dpbicpO1xuICAgIHBrdC5sb2dpbi5zY2hlbWUgPSBzY2hlbWU7XG4gICAgcGt0LmxvZ2luLnNlY3JldCA9IHNlY3JldDtcbiAgICBwa3QubG9naW4uY3JlZCA9IGNyZWQ7XG5cbiAgICByZXR1cm4gdGhpcy5zZW5kKHBrdCwgcGt0LmxvZ2luLmlkKVxuICAgICAgLnRoZW4oKGN0cmwpID0+IHtcbiAgICAgICAgdGhpcy5sb2dpblN1Y2Nlc3NmdWwoY3RybCk7XG4gICAgICAgIHJldHVybiBjdHJsO1xuICAgICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjbG9naW59IHdpdGggYmFzaWMgYXV0aGVudGljYXRpb25cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHVuYW1lIC0gVXNlciBuYW1lLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGFzc3dvcmQgIC0gUGFzc3dvcmQuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIGxvZ2luQmFzaWM6IGZ1bmN0aW9uKHVuYW1lLCBwYXNzd29yZCwgY3JlZCkge1xuICAgIHJldHVybiB0aGlzLmxvZ2luKCdiYXNpYycsIGI2NEVuY29kZVVuaWNvZGUodW5hbWUgKyAnOicgKyBwYXNzd29yZCksIGNyZWQpXG4gICAgICAudGhlbigoY3RybCkgPT4ge1xuICAgICAgICB0aGlzLl9sb2dpbiA9IHVuYW1lO1xuICAgICAgICByZXR1cm4gY3RybDtcbiAgICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI2xvZ2lufSB3aXRoIHRva2VuIGF1dGhlbnRpY2F0aW9uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0b2tlbiAtIFRva2VuIHJlY2VpdmVkIGluIHJlc3BvbnNlIHRvIGVhcmxpZXIgbG9naW4uXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIGxvZ2luVG9rZW46IGZ1bmN0aW9uKHRva2VuLCBjcmVkKSB7XG4gICAgcmV0dXJuIHRoaXMubG9naW4oJ3Rva2VuJywgdG9rZW4sIGNyZWQpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTZW5kIGEgcmVxdWVzdCBmb3IgcmVzZXR0aW5nIGFuIGF1dGhlbnRpY2F0aW9uIHNlY3JldC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHNjaGVtZSAtIGF1dGhlbnRpY2F0aW9uIHNjaGVtZSB0byByZXNldC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG1ldGhvZCAtIG1ldGhvZCB0byB1c2UgZm9yIHJlc2V0dGluZyB0aGUgc2VjcmV0LCBzdWNoIGFzIFwiZW1haWxcIiBvciBcInRlbFwiLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gdmFsdWUgLSB2YWx1ZSBvZiB0aGUgY3JlZGVudGlhbCB0byB1c2UsIGEgc3BlY2lmaWMgZW1haWwgYWRkcmVzcyBvciBhIHBob25lIG51bWJlci5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgdGhlIHNlcnZlciByZXBseS5cbiAgICovXG4gIHJlcXVlc3RSZXNldEF1dGhTZWNyZXQ6IGZ1bmN0aW9uKHNjaGVtZSwgbWV0aG9kLCB2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLmxvZ2luKCdyZXNldCcsIGI2NEVuY29kZVVuaWNvZGUoc2NoZW1lICsgJzonICsgbWV0aG9kICsgJzonICsgdmFsdWUpKTtcbiAgfSxcblxuICAvKipcbiAgICogQHR5cGVkZWYgQXV0aFRva2VuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHR5cGUgT2JqZWN0XG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSB0b2tlbiAtIFRva2VuIHZhbHVlLlxuICAgKiBAcHJvcGVydHkge0RhdGV9IGV4cGlyZXMgLSBUb2tlbiBleHBpcmF0aW9uIHRpbWUuXG4gICAqL1xuICAvKipcbiAgICogR2V0IHN0b3JlZCBhdXRoZW50aWNhdGlvbiB0b2tlbi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5BdXRoVG9rZW59IGF1dGhlbnRpY2F0aW9uIHRva2VuLlxuICAgKi9cbiAgZ2V0QXV0aFRva2VuOiBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5fYXV0aFRva2VuICYmICh0aGlzLl9hdXRoVG9rZW4uZXhwaXJlcy5nZXRUaW1lKCkgPiBEYXRlLm5vdygpKSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2F1dGhUb2tlbjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fYXV0aFRva2VuID0gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEFwcGxpY2F0aW9uIG1heSBwcm92aWRlIGEgc2F2ZWQgYXV0aGVudGljYXRpb24gdG9rZW4uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7VGlub2RlLkF1dGhUb2tlbn0gdG9rZW4gLSBhdXRoZW50aWNhdGlvbiB0b2tlbi5cbiAgICovXG4gIHNldEF1dGhUb2tlbjogZnVuY3Rpb24odG9rZW4pIHtcbiAgICB0aGlzLl9hdXRoVG9rZW4gPSB0b2tlbjtcbiAgfSxcblxuICAvKipcbiAgICogQHR5cGVkZWYgU2V0UGFyYW1zXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHByb3BlcnR5IHtUaW5vZGUuU2V0RGVzYz19IGRlc2MgLSBUb3BpYyBpbml0aWFsaXphdGlvbiBwYXJhbWV0ZXJzIHdoZW4gY3JlYXRpbmcgYSBuZXcgdG9waWMgb3IgYSBuZXcgc3Vic2NyaXB0aW9uLlxuICAgKiBAcHJvcGVydHkge1Rpbm9kZS5TZXRTdWI9fSBzdWIgLSBTdWJzY3JpcHRpb24gaW5pdGlhbGl6YXRpb24gcGFyYW1ldGVycy5cbiAgICovXG4gIC8qKlxuICAgKiBAdHlwZWRlZiBTZXREZXNjXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHByb3BlcnR5IHtUaW5vZGUuRGVmQWNzPX0gZGVmYWNzIC0gRGVmYXVsdCBhY2Nlc3MgbW9kZS5cbiAgICogQHByb3BlcnR5IHtPYmplY3Q9fSBwdWJsaWMgLSBGcmVlLWZvcm0gdG9waWMgZGVzY3JpcHRpb24sIHB1YmxpY2FsbHkgYWNjZXNzaWJsZS5cbiAgICogQHByb3BlcnR5IHtPYmplY3Q9fSBwcml2YXRlIC0gRnJlZS1mb3JtIHRvcGljIGRlc2NyaXB0aW9uYWNjZXNzaWJsZSBvbmx5IHRvIHRoZSBvd25lci5cbiAgICovXG4gIC8qKlxuICAgKiBAdHlwZWRlZiBTZXRTdWJcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAcHJvcGVydHkge1N0cmluZz19IHVzZXIgLSBVSUQgb2YgdGhlIHVzZXIgYWZmZWN0ZWQgYnkgdGhlIHJlcXVlc3QuIERlZmF1bHQgKGVtcHR5KSAtIGN1cnJlbnQgdXNlci5cbiAgICogQHByb3BlcnR5IHtTdHJpbmc9fSBtb2RlIC0gVXNlciBhY2Nlc3MgbW9kZSwgZWl0aGVyIHJlcXVlc3RlZCBvciBhc3NpZ25lZCBkZXBlbmRlbnQgb24gY29udGV4dC5cbiAgICogQHByb3BlcnR5IHtPYmplY3Q9fSBpbmZvIC0gRnJlZS1mb3JtIHBheWxvYWQgdG8gcGFzcyB0byB0aGUgaW52aXRlZCB1c2VyIG9yIHRvcGljIG1hbmFnZXIuXG4gICAqL1xuICAvKipcbiAgICogUGFyYW1ldGVycyBwYXNzZWQgdG8ge0BsaW5rIFRpbm9kZSNzdWJzY3JpYmV9LlxuICAgKlxuICAgKiBAdHlwZWRlZiBTdWJzY3JpcHRpb25QYXJhbXNcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAcHJvcGVydHkge1Rpbm9kZS5TZXRQYXJhbXM9fSBzZXQgLSBQYXJhbWV0ZXJzIHVzZWQgdG8gaW5pdGlhbGl6ZSB0b3BpY1xuICAgKiBAcHJvcGVydHkge1Rpbm9kZS5HZXRRdWVyeT19IGdldCAtIFF1ZXJ5IGZvciBmZXRjaGluZyBkYXRhIGZyb20gdG9waWMuXG4gICAqL1xuXG4gIC8qKlxuICAgKiBTZW5kIGEgdG9waWMgc3Vic2NyaXB0aW9uIHJlcXVlc3QuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0b3BpYyAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIHN1YnNjcmliZSB0by5cbiAgICogQHBhcmFtIHtUaW5vZGUuR2V0UXVlcnk9fSBnZXRQYXJhbXMgLSBPcHRpb25hbCBzdWJzY3JpcHRpb24gbWV0YWRhdGEgcXVlcnlcbiAgICogQHBhcmFtIHtUaW5vZGUuU2V0UGFyYW1zPX0gc2V0UGFyYW1zIC0gT3B0aW9uYWwgaW5pdGlhbGl6YXRpb24gcGFyYW1ldGVyc1xuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICBzdWJzY3JpYmU6IGZ1bmN0aW9uKHRvcGljTmFtZSwgZ2V0UGFyYW1zLCBzZXRQYXJhbXMpIHtcbiAgICBjb25zdCBwa3QgPSB0aGlzLmluaXRQYWNrZXQoJ3N1YicsIHRvcGljTmFtZSlcbiAgICBpZiAoIXRvcGljTmFtZSkge1xuICAgICAgdG9waWNOYW1lID0gVE9QSUNfTkVXO1xuICAgIH1cblxuICAgIHBrdC5zdWIuZ2V0ID0gZ2V0UGFyYW1zO1xuXG4gICAgaWYgKHNldFBhcmFtcykge1xuICAgICAgaWYgKHNldFBhcmFtcy5zdWIpIHtcbiAgICAgICAgcGt0LnN1Yi5zZXQuc3ViID0gc2V0UGFyYW1zLnN1YjtcbiAgICAgIH1cblxuICAgICAgaWYgKHNldFBhcmFtcy5kZXNjKSB7XG4gICAgICAgIGlmIChUaW5vZGUuaXNOZXdHcm91cFRvcGljTmFtZSh0b3BpY05hbWUpKSB7XG4gICAgICAgICAgLy8gRnVsbCBzZXQuZGVzYyBwYXJhbXMgYXJlIHVzZWQgZm9yIG5ldyB0b3BpY3Mgb25seVxuICAgICAgICAgIHBrdC5zdWIuc2V0LmRlc2MgPSBzZXRQYXJhbXMuZGVzYztcbiAgICAgICAgfSBlbHNlIGlmIChUaW5vZGUudG9waWNUeXBlKHRvcGljTmFtZSkgPT0gJ3AycCcgJiYgc2V0UGFyYW1zLmRlc2MuZGVmYWNzKSB7XG4gICAgICAgICAgLy8gVXNlIG9wdGlvbmFsIGRlZmF1bHQgcGVybWlzc2lvbnMgb25seS5cbiAgICAgICAgICBwa3Quc3ViLnNldC5kZXNjID0ge1xuICAgICAgICAgICAgZGVmYWNzOiBzZXRQYXJhbXMuZGVzYy5kZWZhY3NcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChzZXRQYXJhbXMudGFncykge1xuICAgICAgICBwa3Quc3ViLnNldC50YWdzID0gc2V0UGFyYW1zLnRhZ3M7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuc2VuZChwa3QsIHBrdC5zdWIuaWQpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBEZXRhY2ggYW5kIG9wdGlvbmFsbHkgdW5zdWJzY3JpYmUgZnJvbSB0aGUgdG9waWNcbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHRvcGljIC0gVG9waWMgdG8gZGV0YWNoIGZyb20uXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gdW5zdWIgLSBJZiA8dHQ+dHJ1ZTwvdHQ+LCBkZXRhY2ggYW5kIHVuc3Vic2NyaWJlLCBvdGhlcndpc2UganVzdCBkZXRhY2guXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIGxlYXZlOiBmdW5jdGlvbih0b3BpYywgdW5zdWIpIHtcbiAgICBjb25zdCBwa3QgPSB0aGlzLmluaXRQYWNrZXQoJ2xlYXZlJywgdG9waWMpO1xuICAgIHBrdC5sZWF2ZS51bnN1YiA9IHVuc3ViO1xuXG4gICAgcmV0dXJuIHRoaXMuc2VuZChwa3QsIHBrdC5sZWF2ZS5pZCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENyZWF0ZSBtZXNzYWdlIGRyYWZ0IHdpdGhvdXQgc2VuZGluZyBpdCB0byB0aGUgc2VydmVyLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gdG9waWMgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byBwdWJsaXNoIHRvLlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSAtIFBheWxvYWQgdG8gcHVibGlzaC5cbiAgICogQHBhcmFtIHtCb29sZWFuPX0gbm9FY2hvIC0gSWYgPHR0PnRydWU8L3R0PiwgdGVsbCB0aGUgc2VydmVyIG5vdCB0byBlY2hvIHRoZSBtZXNzYWdlIHRvIHRoZSBvcmlnaW5hbCBzZXNzaW9uLlxuICAgKlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBuZXcgbWVzc2FnZSB3aGljaCBjYW4gYmUgc2VudCB0byB0aGUgc2VydmVyIG9yIG90aGVyd2lzZSB1c2VkLlxuICAgKi9cbiAgY3JlYXRlTWVzc2FnZTogZnVuY3Rpb24odG9waWMsIGRhdGEsIG5vRWNobykge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuaW5pdFBhY2tldCgncHViJywgdG9waWMpO1xuXG4gICAgbGV0IGRmdCA9IHR5cGVvZiBkYXRhID09ICdzdHJpbmcnID8gRHJhZnR5LnBhcnNlKGRhdGEpIDogZGF0YTtcbiAgICBpZiAoZGZ0ICYmICFEcmFmdHkuaXNQbGFpblRleHQoZGZ0KSkge1xuICAgICAgcGt0LnB1Yi5oZWFkID0ge1xuICAgICAgICBtaW1lOiBEcmFmdHkuZ2V0Q29udGVudFR5cGUoKVxuICAgICAgfTtcbiAgICAgIGRhdGEgPSBkZnQ7XG4gICAgfVxuICAgIHBrdC5wdWIubm9lY2hvID0gbm9FY2hvO1xuICAgIHBrdC5wdWIuY29udGVudCA9IGRhdGE7XG5cbiAgICByZXR1cm4gcGt0LnB1YjtcbiAgfSxcblxuICAvKipcbiAgICogUHVibGlzaCB7ZGF0YX0gbWVzc2FnZSB0byB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHRvcGljIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gcHVibGlzaCB0by5cbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgLSBQYXlsb2FkIHRvIHB1Ymxpc2guXG4gICAqIEBwYXJhbSB7Qm9vbGVhbj19IG5vRWNobyAtIElmIDx0dD50cnVlPC90dD4sIHRlbGwgdGhlIHNlcnZlciBub3QgdG8gZWNobyB0aGUgbWVzc2FnZSB0byB0aGUgb3JpZ2luYWwgc2Vzc2lvbi5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgcHVibGlzaDogZnVuY3Rpb24odG9waWMsIGRhdGEsIG5vRWNobykge1xuICAgIHJldHVybiB0aGlzLnB1Ymxpc2hNZXNzYWdlKFxuICAgICAgdGhpcy5jcmVhdGVNZXNzYWdlKHRvcGljLCBkYXRhLCBub0VjaG8pXG4gICAgKTtcbiAgfSxcblxuICAvKipcbiAgICogUHVibGlzaCBtZXNzYWdlIHRvIHRvcGljLiBUaGUgbWVzc2FnZSBzaG91bGQgYmUgY3JlYXRlZCBieSB7QGxpbmsgVGlub2RlI2NyZWF0ZU1lc3NhZ2V9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcHViIC0gTWVzc2FnZSB0byBwdWJsaXNoLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICBwdWJsaXNoTWVzc2FnZTogZnVuY3Rpb24ocHViKSB7XG4gICAgLy8gTWFrZSBhIHNoYWxsb3cgY29weS4gTmVlZGVkIGluIG9yZGVyIHRvIGNsZWFyIGxvY2FsbHktYXNzaWduZWQgdGVtcCB2YWx1ZXM7XG4gICAgcHViID0gT2JqZWN0LmFzc2lnbih7fSwgcHViKTtcbiAgICBwdWIuc2VxID0gdW5kZWZpbmVkO1xuICAgIHB1Yi5mcm9tID0gdW5kZWZpbmVkO1xuICAgIHB1Yi50cyA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gdGhpcy5zZW5kMih7XG4gICAgICBwdWI6IHB1YlxuICAgIH0sIHB1Yi5pZCwgMSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIEdldFF1ZXJ5XG4gICAqIEB0eXBlIE9iamVjdFxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBwcm9wZXJ0eSB7VGlub2RlLkdldE9wdHNUeXBlPX0gZGVzYyAtIElmIHByb3ZpZGVkIChldmVuIGlmIGVtcHR5KSwgZmV0Y2ggdG9waWMgZGVzY3JpcHRpb24uXG4gICAqIEBwcm9wZXJ0eSB7VGlub2RlLkdldE9wdHNUeXBlPX0gc3ViIC0gSWYgcHJvdmlkZWQgKGV2ZW4gaWYgZW1wdHkpLCBmZXRjaCB0b3BpYyBzdWJzY3JpcHRpb25zLlxuICAgKiBAcHJvcGVydHkge1Rpbm9kZS5HZXREYXRhVHlwZT19IGRhdGEgLSBJZiBwcm92aWRlZCAoZXZlbiBpZiBlbXB0eSksIGdldCBtZXNzYWdlcy5cbiAgICovXG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIEdldE9wdHNUeXBlXG4gICAqIEB0eXBlIE9iamVjdFxuICAgKiBAbWVtYmVyb2YgVGlub2RlXG4gICAqIEBwcm9wZXJ0eSB7RGF0ZT19IGltcyAtIFwiSWYgbW9kaWZpZWQgc2luY2VcIiwgZmV0Y2ggZGF0YSBvbmx5IGl0IHdhcyB3YXMgbW9kaWZpZWQgc2luY2Ugc3RhdGVkIGRhdGUuXG4gICAqIEBwcm9wZXJ0eSB7TnVtYmVyPX0gbGltaXQgLSBNYXhpbXVtIG51bWJlciBvZiByZXN1bHRzIHRvIHJldHVybi4gSWdub3JlZCB3aGVuIHF1ZXJ5aW5nIHRvcGljIGRlc2NyaXB0aW9uLlxuICAgKi9cblxuICAvKipcbiAgICogQHR5cGVkZWYgR2V0RGF0YVR5cGVcbiAgICogQHR5cGUgT2JqZWN0XG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHByb3BlcnR5IHtOdW1iZXI9fSBzaW5jZSAtIExvYWQgbWVzc2FnZXMgd2l0aCBzZXEgaWQgZXF1YWwgb3IgZ3JlYXRlciB0aGFuIHRoaXMgdmFsdWUuXG4gICAqIEBwcm9wZXJ0eSB7TnVtYmVyPX0gYmVmb3JlIC0gTG9hZCBtZXNzYWdlcyB3aXRoIHNlcSBpZCBsb3dlciB0aGFuIHRoaXMgbnVtYmVyLlxuICAgKiBAcHJvcGVydHkge051bWJlcj19IGxpbWl0IC0gTWF4aW11bSBudW1iZXIgb2YgcmVzdWx0cyB0byByZXR1cm4uXG4gICAqL1xuXG4gIC8qKlxuICAgKiBSZXF1ZXN0IHRvcGljIG1ldGFkYXRhXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0b3BpYyAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIHF1ZXJ5LlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5HZXRRdWVyeX0gcGFyYW1zIC0gUGFyYW1ldGVycyBvZiB0aGUgcXVlcnkuIFVzZSB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSB0byBnZW5lcmF0ZS5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgZ2V0TWV0YTogZnVuY3Rpb24odG9waWMsIHBhcmFtcykge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuaW5pdFBhY2tldCgnZ2V0JywgdG9waWMpO1xuXG4gICAgcGt0LmdldCA9IG1lcmdlT2JqKHBrdC5nZXQsIHBhcmFtcyk7XG5cbiAgICByZXR1cm4gdGhpcy5zZW5kKHBrdCwgcGt0LmdldC5pZCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFVwZGF0ZSB0b3BpYydzIG1ldGFkYXRhOiBkZXNjcmlwdGlvbiwgc3Vic2NyaWJ0aW9ucy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHRvcGljIC0gVG9waWMgdG8gdXBkYXRlLlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5TZXRQYXJhbXN9IHBhcmFtcyAtIHRvcGljIG1ldGFkYXRhIHRvIHVwZGF0ZS5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgc2V0TWV0YTogZnVuY3Rpb24odG9waWMsIHBhcmFtcykge1xuICAgIGNvbnN0IHBrdCA9IHRoaXMuaW5pdFBhY2tldCgnc2V0JywgdG9waWMpO1xuICAgIGNvbnN0IHdoYXQgPSBbXTtcblxuICAgIGlmIChwYXJhbXMpIHtcbiAgICAgIFsnZGVzYycsICdzdWInLCAndGFncycsICdjcmVkJ10ubWFwKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICBpZiAocGFyYW1zLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICB3aGF0LnB1c2goa2V5KTtcbiAgICAgICAgICBwa3Quc2V0W2tleV0gPSBwYXJhbXNba2V5XTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHdoYXQubGVuZ3RoID09IDApIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJJbnZhbGlkIHtzZXR9IHBhcmFtZXRlcnNcIikpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnNlbmQocGt0LCBwa3Quc2V0LmlkKTtcbiAgfSxcblxuICAvKipcbiAgICogUmFuZ2Ugb2YgbWVzc2FnZSBJRHMgdG8gZGVsZXRlLlxuICAgKlxuICAgKiBAdHlwZWRlZiBEZWxSYW5nZVxuICAgKiBAdHlwZSBPYmplY3RcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAcHJvcGVydHkge051bWJlcn0gbG93IC0gbG93IGVuZCBvZiB0aGUgcmFuZ2UsIGluY2x1c2l2ZSAoY2xvc2VkKS5cbiAgICogQHByb3BlcnR5IHtOdW1iZXI9fSBoaSAtIGhpZ2ggZW5kIG9mIHRoZSByYW5nZSwgZXhjbHVzaXZlIChvcGVuKS5cbiAgICovXG4gIC8qKlxuICAgKiBEZWxldGUgc29tZSBvciBhbGwgbWVzc2FnZXMgaW4gYSB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHRvcGljIC0gVG9waWMgbmFtZSB0byBkZWxldGUgbWVzc2FnZXMgZnJvbS5cbiAgICogQHBhcmFtIHtUaW5vZGUuRGVsUmFuZ2VbXX0gbGlzdCAtIFJhbmdlcyBvZiBtZXNzYWdlIElEcyB0byBkZWxldGUuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbj19IGhhcmQgLSBIYXJkIG9yIHNvZnQgZGVsZXRlXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgb24gcmVjZWl2aW5nIHNlcnZlciByZXBseS5cbiAgICovXG4gIGRlbE1lc3NhZ2VzOiBmdW5jdGlvbih0b3BpYywgcmFuZ2VzLCBoYXJkKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy5pbml0UGFja2V0KCdkZWwnLCB0b3BpYyk7XG5cbiAgICBwa3QuZGVsLndoYXQgPSAnbXNnJztcbiAgICBwa3QuZGVsLmRlbHNlcSA9IHJhbmdlcztcbiAgICBwa3QuZGVsLmhhcmQgPSBoYXJkO1xuXG4gICAgcmV0dXJuIHRoaXMuc2VuZChwa3QsIHBrdC5kZWwuaWQpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBEZWxldGUgdGhlIHRvcGljIGFsbHRvZ2V0aGVyLiBSZXF1aXJlcyBPd25lciBwZXJtaXNzaW9uLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gdG9waWMgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byBkZWxldGVcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCBvbiByZWNlaXZpbmcgc2VydmVyIHJlcGx5LlxuICAgKi9cbiAgZGVsVG9waWM6IGZ1bmN0aW9uKHRvcGljKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy5pbml0UGFja2V0KCdkZWwnLCB0b3BpYyk7XG4gICAgcGt0LmRlbC53aGF0ID0gJ3RvcGljJztcblxuICAgIHJldHVybiB0aGlzLnNlbmQocGt0LCBwa3QuZGVsLmlkKS50aGVuKChjdHJsKSA9PiB7XG4gICAgICB0aGlzLmNhY2hlRGVsKCd0b3BpYycsIHRvcGljKTtcbiAgICAgIHJldHVybiB0aGlzLmN0cmw7XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIERlbGV0ZSBzdWJzY3JpcHRpb24uIFJlcXVpcmVzIFNoYXJlIHBlcm1pc3Npb24uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0b3BpYyAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIGRlbGV0ZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gdXNlciAtIFVzZXIgSUQgdG8gcmVtb3ZlLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICBkZWxTdWJzY3JpcHRpb246IGZ1bmN0aW9uKHRvcGljLCB1c2VyKSB7XG4gICAgY29uc3QgcGt0ID0gdGhpcy5pbml0UGFja2V0KCdkZWwnLCB0b3BpYyk7XG4gICAgcGt0LmRlbC53aGF0ID0gJ3N1Yic7XG4gICAgcGt0LmRlbC51c2VyID0gdXNlcjtcblxuICAgIHJldHVybiB0aGlzLnNlbmQocGt0LCBwa3QuZGVsLmlkKTtcbiAgfSxcblxuICAvKipcbiAgICogRGVsZXRlIGNyZWRlbnRpYWwuIE11c3QgYmUgJ21lJyB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHRvcGljIC0gJ21lJy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG1ldGhvZCAtIHZhbGlkYXRpb24gbWV0aG9kIHN1Y2ggYXMgJ2VtYWlsJyBvciAndGVsJy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IHZhbHVlIC0gdmFsaWRhdGlvbiB2YWx1ZSwgaS5lLiAnYWxpY2VAZXhhbXBsZS5jb20nLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICBkZWxDcmVkZW50aWFsOiBmdW5jdGlvbih0b3BpYywgbWV0aG9kLCB2YWx1ZSkge1xuICAgIGlmICh0b3BpYyAhPSAnbWUnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHRvcGljIGZvciBkZWxldGluZyBjcmVkZW50aWFscyAnXCIgKyB0b3BpYyArIFwiJ1wiKTtcbiAgICB9XG4gICAgY29uc3QgcGt0ID0gdGhpcy5pbml0UGFja2V0KCdkZWwnLCB0b3BpYyk7XG4gICAgcGt0LmRlbC53aGF0ID0gJ2NyZWQnO1xuICAgIHBrdC5kZWwuY3JlZCA9IHtcbiAgICAgIG1ldGg6IG1ldGhvZCxcbiAgICAgIHZhbDogdmFsdWVcbiAgICB9O1xuICAgIHJldHVybiB0aGlzLnNlbmQocGt0LCBwa3QuZGVsLmlkKTtcbiAgfSxcblxuICAvKipcbiAgICogTm90aWZ5IHNlcnZlciB0aGF0IGEgbWVzc2FnZSBvciBtZXNzYWdlcyB3ZXJlIHJlYWQgb3IgcmVjZWl2ZWQuIERvZXMgTk9UIHJldHVybiBwcm9taXNlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gdG9waWMgLSBOYW1lIG9mIHRoZSB0b3BpYyB3aGVyZSB0aGUgbWVzYWdlIGlzIGJlaW5nIGFrbm93bGVkZ2VkLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gd2hhdCAtIEFjdGlvbiBiZWluZyBha25vd2xlZGdlZCwgZWl0aGVyIFwicmVhZFwiIG9yIFwicmVjdlwiLlxuICAgKiBAcGFyYW0ge051bWJlcn0gc2VxIC0gTWF4aW11bSBpZCBvZiB0aGUgbWVzc2FnZSBiZWluZyBhY2tub3dsZWRnZWQuXG4gICAqL1xuICBub3RlOiBmdW5jdGlvbih0b3BpYywgd2hhdCwgc2VxKSB7XG4gICAgaWYgKHNlcSA8PSAwIHx8IHNlcSA+PSBMT0NBTF9TRVFJRCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBtZXNzYWdlIGlkIFwiICsgc2VxKTtcbiAgICB9XG5cbiAgICBjb25zdCBwa3QgPSB0aGlzLmluaXRQYWNrZXQoJ25vdGUnLCB0b3BpYyk7XG4gICAgcGt0Lm5vdGUud2hhdCA9IHdoYXQ7XG4gICAgcGt0Lm5vdGUuc2VxID0gc2VxO1xuICAgIHRoaXMuc2VuZChwa3QpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBCcm9hZGNhc3QgYSBrZXktcHJlc3Mgbm90aWZpY2F0aW9uIHRvIHRvcGljIHN1YnNjcmliZXJzLiBVc2VkIHRvIHNob3dcbiAgICogdHlwaW5nIG5vdGlmaWNhdGlvbnMgXCJ1c2VyIFggaXMgdHlwaW5nLi4uXCIuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0b3BpYyAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIGJyb2FkY2FzdCB0by5cbiAgICovXG4gIG5vdGVLZXlQcmVzczogZnVuY3Rpb24odG9waWMpIHtcbiAgICBjb25zdCBwa3QgPSB0aGlzLmluaXRQYWNrZXQoJ25vdGUnLCB0b3BpYyk7XG4gICAgcGt0Lm5vdGUud2hhdCA9ICdrcCc7XG4gICAgdGhpcy5zZW5kKHBrdCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEdldCBhIG5hbWVkIHRvcGljLCBlaXRoZXIgcHVsbCBpdCBmcm9tIGNhY2hlIG9yIGNyZWF0ZSBhIG5ldyBpbnN0YW5jZS5cbiAgICogVGhlcmUgaXMgYSBzaW5nbGUgaW5zdGFuY2Ugb2YgdG9waWMgZm9yIGVhY2ggbmFtZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHRvcGljIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gZ2V0LlxuICAgKiBAcmV0dXJucyB7VGlub2RlLlRvcGljfSBSZXF1ZXN0ZWQgb3IgbmV3bHkgY3JlYXRlZCB0b3BpYyBvciA8dHQ+dW5kZWZpbmVkPC90dD4gaWYgdG9waWMgbmFtZSBpcyBpbnZhbGlkLlxuICAgKi9cbiAgZ2V0VG9waWM6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBsZXQgdG9waWMgPSB0aGlzLmNhY2hlR2V0KCd0b3BpYycsIG5hbWUpO1xuICAgIGlmICghdG9waWMgJiYgbmFtZSkge1xuICAgICAgaWYgKG5hbWUgPT0gVE9QSUNfTUUpIHtcbiAgICAgICAgdG9waWMgPSBuZXcgVG9waWNNZSgpO1xuICAgICAgfSBlbHNlIGlmIChuYW1lID09IFRPUElDX0ZORCkge1xuICAgICAgICB0b3BpYyA9IG5ldyBUb3BpY0ZuZCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdG9waWMgPSBuZXcgVG9waWMobmFtZSk7XG4gICAgICB9XG4gICAgICAvLyB0b3BpYy5fbmV3ID0gZmFsc2U7XG4gICAgICB0aGlzLmNhY2hlUHV0KCd0b3BpYycsIG5hbWUsIHRvcGljKTtcbiAgICAgIHRoaXMuYXR0YWNoQ2FjaGVUb1RvcGljKHRvcGljKTtcbiAgICB9XG4gICAgcmV0dXJuIHRvcGljO1xuICB9LFxuXG4gIC8qKlxuICAgKiBJbnN0YW50aWF0ZSBhIG5ldyB1bm5hbWVkIHRvcGljLiBBbiBhY3R1YWwgbmFtZSB3aWxsIGJlIGFzc2lnbmVkIGJ5IHRoZSBzZXJ2ZXJcbiAgICogb24ge0BsaW5rIFRpbm9kZS5Ub3BpYy5zdWJzY3JpYmV9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5DYWxsYmFja3N9IGNhbGxiYWNrcyAtIE9iamVjdCB3aXRoIGNhbGxiYWNrcyBmb3IgdmFyaW91cyBldmVudHMuXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuVG9waWN9IE5ld2x5IGNyZWF0ZWQgdG9waWMuXG4gICAqL1xuICBuZXdUb3BpYzogZnVuY3Rpb24oY2FsbGJhY2tzKSB7XG4gICAgY29uc3QgdG9waWMgPSBuZXcgVG9waWMoVE9QSUNfTkVXLCBjYWxsYmFja3MpO1xuICAgIHRoaXMuYXR0YWNoQ2FjaGVUb1RvcGljKHRvcGljKTtcbiAgICByZXR1cm4gdG9waWM7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlIHVuaXF1ZSBuYW1lICBsaWtlICduZXcxMjM0NTYnIHN1aXRhYmxlIGZvciBjcmVhdGluZyBhIG5ldyBncm91cCB0b3BpYy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHJldHVybnMge3N0cmluZ30gbmFtZSB3aGljaCBjYW4gYmUgdXNlZCBmb3IgY3JlYXRpbmcgYSBuZXcgZ3JvdXAgdG9waWMuXG4gICAqL1xuICBuZXdHcm91cFRvcGljTmFtZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFRPUElDX05FVyArIHRoaXMuZ2V0TmV4dFVuaXF1ZUlkKCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEluc3RhbnRpYXRlIGEgbmV3IFAyUCB0b3BpYyB3aXRoIGEgZ2l2ZW4gcGVlci5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBlZXIgLSBVSUQgb2YgdGhlIHBlZXIgdG8gc3RhcnQgdG9waWMgd2l0aC5cbiAgICogQHBhcmFtIHtUaW5vZGUuQ2FsbGJhY2tzfSBjYWxsYmFja3MgLSBPYmplY3Qgd2l0aCBjYWxsYmFja3MgZm9yIHZhcmlvdXMgZXZlbnRzLlxuICAgKiBAcmV0dXJucyB7VGlub2RlLlRvcGljfSBOZXdseSBjcmVhdGVkIHRvcGljLlxuICAgKi9cbiAgbmV3VG9waWNXaXRoOiBmdW5jdGlvbihwZWVyLCBjYWxsYmFja3MpIHtcbiAgICBjb25zdCB0b3BpYyA9IG5ldyBUb3BpYyhwZWVyLCBjYWxsYmFja3MpO1xuICAgIHRoaXMuYXR0YWNoQ2FjaGVUb1RvcGljKHRvcGljKTtcbiAgICByZXR1cm4gdG9waWM7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEluc3RhbnRpYXRlICdtZScgdG9waWMgb3IgZ2V0IGl0IGZyb20gY2FjaGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuVG9waWNNZX0gSW5zdGFuY2Ugb2YgJ21lJyB0b3BpYy5cbiAgICovXG4gIGdldE1lVG9waWM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmdldFRvcGljKFRPUElDX01FKTtcbiAgfSxcblxuICAvKipcbiAgICogSW5zdGFudGlhdGUgJ2ZuZCcgKGZpbmQpIHRvcGljIG9yIGdldCBpdCBmcm9tIGNhY2hlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLlRvcGljfSBJbnN0YW5jZSBvZiAnZm5kJyB0b3BpYy5cbiAgICovXG4gIGdldEZuZFRvcGljOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRUb3BpYyhUT1BJQ19GTkQpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgTGFyZ2VGaWxlSGVscGVyIGluc3RhbmNlXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTGFyZ2VGaWxlSGVscGVyfSBpbnN0YW5jZSBvZiBhIExhcmdlRmlsZUhlbHBlci5cbiAgICovXG4gIGdldExhcmdlRmlsZUhlbHBlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBMYXJnZUZpbGVIZWxwZXIodGhpcyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEdldCB0aGUgVUlEIG9mIHRoZSB0aGUgY3VycmVudCBhdXRoZW50aWNhdGVkIHVzZXIuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFVJRCBvZiB0aGUgY3VycmVudCB1c2VyIG9yIDx0dD51bmRlZmluZWQ8L3R0PiBpZiB0aGUgc2Vzc2lvbiBpcyBub3QgeWV0IGF1dGhlbnRpY2F0ZWQgb3IgaWYgdGhlcmUgaXMgbm8gc2Vzc2lvbi5cbiAgICovXG4gIGdldEN1cnJlbnRVc2VySUQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9teVVJRDtcbiAgfSxcblxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIGdpdmVuIHVzZXIgSUQgaXMgZXF1YWwgdG8gdGhlIGN1cnJlbnQgdXNlcidzIFVJRC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVpZCAtIFVJRCB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdGhlIGdpdmVuIFVJRCBiZWxvbmdzIHRvIHRoZSBjdXJyZW50IGxvZ2dlZCBpbiB1c2VyLlxuICAgKi9cbiAgaXNNZTogZnVuY3Rpb24odWlkKSB7XG4gICAgcmV0dXJuIHRoaXMuX215VUlEID09PSB1aWQ7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEdldCBsb2dpbiB1c2VkIGZvciBsYXN0IHN1Y2Nlc3NmdWwgYXV0aGVudGljYXRpb24uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IGxvZ2luIGxhc3QgdXNlZCBzdWNjZXNzZnVsbHkgb3IgPHR0PnVuZGVmaW5lZDwvdHQ+LlxuICAgKi9cbiAgZ2V0Q3VycmVudExvZ2luOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fbG9naW47XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJldHVybiBpbmZvcm1hdGlvbiBhYm91dCB0aGUgc2VydmVyOiBwcm90b2NvbCB2ZXJzaW9uIGFuZCBidWlsZCB0aW1lc3RhbXAuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IGJ1aWxkIGFuZCB2ZXJzaW9uIG9mIHRoZSBzZXJ2ZXIgb3IgPHR0Pm51bGw8L3R0PiBpZiB0aGVyZSBpcyBubyBjb25uZWN0aW9uIG9yIGlmIHRoZSBmaXJzdCBzZXJ2ZXIgcmVzcG9uc2UgaGFzIG5vdCBiZWVuIHJlY2VpdmVkIHlldC5cbiAgICovXG4gIGdldFNlcnZlckluZm86IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9zZXJ2ZXJJbmZvO1xuICB9LFxuXG4gIC8qKlxuICAgKiBUb2dnbGUgY29uc29sZSBsb2dnaW5nLiBMb2dnaW5nIGlzIG9mZiBieSBkZWZhdWx0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZWQgLSBTZXQgdG8gPHR0PnRydWU8L3R0PiB0byBlbmFibGUgbG9nZ2luZyB0byBjb25zb2xlLlxuICAgKi9cbiAgZW5hYmxlTG9nZ2luZzogZnVuY3Rpb24oZW5hYmxlZCwgdHJpbUxvbmdTdHJpbmdzKSB7XG4gICAgdGhpcy5fbG9nZ2luZ0VuYWJsZWQgPSBlbmFibGVkO1xuICAgIHRoaXMuX3RyaW1Mb25nU3RyaW5ncyA9IGVuYWJsZWQgJiYgdHJpbUxvbmdTdHJpbmdzO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBnaXZlbiB0b3BpYyBpcyBvbmxpbmUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgdG9waWMgdG8gdGVzdC5cbiAgICogQHJldHVybnMge0Jvb2xlYW59IHRydWUgaWYgdG9waWMgaXMgb25saW5lLCBmYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICBpc1RvcGljT25saW5lOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgY29uc3QgbWUgPSB0aGlzLmdldE1lVG9waWMoKTtcbiAgICBjb25zdCBjb250ID0gbWUgJiYgbWUuZ2V0Q29udGFjdChuYW1lKTtcbiAgICByZXR1cm4gY29udCAmJiBjb250Lm9ubGluZTtcbiAgfSxcblxuICAvKipcbiAgICogSW5jbHVkZSBtZXNzYWdlIElEIGludG8gYWxsIHN1YnNlcXVlc3QgbWVzc2FnZXMgdG8gc2VydmVyIGluc3RydWN0aW4gaXQgdG8gc2VuZCBha25vd2xlZGdlbWVucy5cbiAgICogUmVxdWlyZWQgZm9yIHByb21pc2VzIHRvIGZ1bmN0aW9uLiBEZWZhdWx0IGlzIFwib25cIi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICpcbiAgICogQHBhcmFtIHtCb29sZWFufSBzdGF0dXMgLSBUdXJuIGFrbm93bGVkZ2VtZW5zIG9uIG9yIG9mZi5cbiAgICogQGRlcHJlY2F0ZWRcbiAgICovXG4gIHdhbnRBa246IGZ1bmN0aW9uKHN0YXR1cykge1xuICAgIGlmIChzdGF0dXMpIHtcbiAgICAgIHRoaXMuX21lc3NhZ2VJZCA9IE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiAweEZGRkZGRikgKyAweEZGRkZGRik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX21lc3NhZ2VJZCA9IDA7XG4gICAgfVxuICB9LFxuXG4gIC8vIENhbGxiYWNrczpcbiAgLyoqXG4gICAqIENhbGxiYWNrIHRvIHJlcG9ydCB3aGVuIHRoZSB3ZWJzb2NrZXQgaXMgb3BlbmVkLiBUaGUgY2FsbGJhY2sgaGFzIG5vIHBhcmFtZXRlcnMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqIEB0eXBlIHtUaW5vZGUub25XZWJzb2NrZXRPcGVufVxuICAgKi9cbiAgb25XZWJzb2NrZXRPcGVuOiB1bmRlZmluZWQsXG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIFRpbm9kZS5TZXJ2ZXJQYXJhbXNcbiAgICogQG1lbWJlcm9mIFRpbm9kZVxuICAgKiBAdHlwZSBPYmplY3RcbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IHZlciAtIFNlcnZlciB2ZXJzaW9uXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBidWlsZCAtIFNlcnZlciBidWlsZFxuICAgKiBAcHJvcGVydHkge3N0cmluZz19IHNpZCAtIFNlc3Npb24gSUQsIGxvbmcgcG9sbGluZyBjb25uZWN0aW9ucyBvbmx5LlxuICAgKi9cblxuICAvKipcbiAgICogQGNhbGxiYWNrIFRpbm9kZS5vbkNvbm5lY3RcbiAgICogQHBhcmFtIHtudW1iZXJ9IGNvZGUgLSBSZXN1bHQgY29kZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dCAtIFRleHQgZXB4cGxhaW5pbmcgdGhlIGNvbXBsZXRpb24sIGkuZSBcIk9LXCIgb3IgYW4gZXJyb3IgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtUaW5vZGUuU2VydmVyUGFyYW1zfSBwYXJhbXMgLSBQYXJhbWV0ZXJzIHJldHVybmVkIGJ5IHRoZSBzZXJ2ZXIuXG4gICAqL1xuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gcmVwb3J0IHdoZW4gY29ubmVjdGlvbiB3aXRoIFRpbm9kZSBzZXJ2ZXIgaXMgZXN0YWJsaXNoZWQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqIEB0eXBlIHtUaW5vZGUub25Db25uZWN0fVxuICAgKi9cbiAgb25Db25uZWN0OiB1bmRlZmluZWQsXG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIHRvIHJlcG9ydCB3aGVuIGNvbm5lY3Rpb24gaXMgbG9zdC4gVGhlIGNhbGxiYWNrIGhhcyBubyBwYXJhbWV0ZXJzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKiBAdHlwZSB7VGlub2RlLm9uRGlzY29ubmVjdH1cbiAgICovXG4gIG9uRGlzY29ubmVjdDogdW5kZWZpbmVkLFxuXG4gIC8qKlxuICAgKiBAY2FsbGJhY2sgVGlub2RlLm9uTG9naW5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGNvZGUgLSBOVW1lcmljIGNvbXBsZXRpb24gY29kZSwgc2FtZSBhcyBIVFRQIHN0YXR1cyBjb2Rlcy5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHRleHQgLSBFeHBsYW5hdGlvbiBvZiB0aGUgY29tcGxldGlvbiBjb2RlLlxuICAgKi9cbiAgLyoqXG4gICAqIENhbGxiYWNrIHRvIHJlcG9ydCBsb2dpbiBjb21wbGV0aW9uLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKiBAdHlwZSB7VGlub2RlLm9uTG9naW59XG4gICAqL1xuICBvbkxvZ2luOiB1bmRlZmluZWQsXG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIHRvIHJlY2VpdmUge2N0cmx9IChjb250cm9sKSBtZXNzYWdlcy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICogQHR5cGUge1Rpbm9kZS5vbkN0cmxNZXNzYWdlfVxuICAgKi9cbiAgb25DdHJsTWVzc2FnZTogdW5kZWZpbmVkLFxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0byByZWNpZXZlIHtkYXRhfSAoY29udGVudCkgbWVzc2FnZXMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqIEB0eXBlIHtUaW5vZGUub25EYXRhTWVzc2FnZX1cbiAgICovXG4gIG9uRGF0YU1lc3NhZ2U6IHVuZGVmaW5lZCxcblxuICAvKipcbiAgICogQ2FsbGJhY2sgdG8gcmVjZWl2ZSB7cHJlc30gKHByZXNlbmNlKSBtZXNzYWdlcy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICogQHR5cGUge1Rpbm9kZS5vblByZXNNZXNzYWdlfVxuICAgKi9cbiAgb25QcmVzTWVzc2FnZTogdW5kZWZpbmVkLFxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0byByZWNlaXZlIGFsbCBtZXNzYWdlcyBhcyBvYmplY3RzLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKiBAdHlwZSB7VGlub2RlLm9uTWVzc2FnZX1cbiAgICovXG4gIG9uTWVzc2FnZTogdW5kZWZpbmVkLFxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0byByZWNlaXZlIGFsbCBtZXNzYWdlcyBhcyB1bnBhcnNlZCB0ZXh0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlI1xuICAgKiBAdHlwZSB7VGlub2RlLm9uUmF3TWVzc2FnZX1cbiAgICovXG4gIG9uUmF3TWVzc2FnZTogdW5kZWZpbmVkLFxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0byByZWNlaXZlIHNlcnZlciByZXNwb25zZXMgdG8gbmV0d29yayBwcm9iZXMuIFNlZSB7QGxpbmsgVGlub2RlI25ldHdvcmtQcm9iZX1cbiAgICogQG1lbWJlcm9mIFRpbm9kZSNcbiAgICogQHR5cGUge1Rpbm9kZS5vbk5ldHdvcmtQcm9iZX1cbiAgICovXG4gIG9uTmV0d29ya1Byb2JlOiB1bmRlZmluZWQsXG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIHRvIGJlIG5vdGlmaWVkIHdoZW4gZXhwb25lbnRpYWwgYmFja29mZiBpcyBpdGVyYXRpbmcuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUjXG4gICAqIEB0eXBlIHtUaW5vZGUub25BdXRvcmVjb25uZWN0SXRlcmF0aW9ufVxuICAgKi9cbiAgb25BdXRvcmVjb25uZWN0SXRlcmF0aW9uOiB1bmRlZmluZWQsXG59O1xuXG4vKipcbiAqIEhlbHBlciBjbGFzcyBmb3IgY29uc3RydWN0aW5nIHtAbGluayBUaW5vZGUuR2V0UXVlcnl9LlxuICpcbiAqIEBjbGFzcyBNZXRhR2V0QnVpbGRlclxuICogQG1lbWJlcm9mIFRpbm9kZVxuICpcbiAqIEBwYXJhbSB7VGlub2RlLlRvcGljfSBwYXJlbnQgdG9waWMgd2hpY2ggaW5zdGFudGlhdGVkIHRoaXMgYnVpbGRlci5cbiAqL1xudmFyIE1ldGFHZXRCdWlsZGVyID0gZnVuY3Rpb24ocGFyZW50KSB7XG4gIHRoaXMudG9waWMgPSBwYXJlbnQ7XG4gIGNvbnN0IG1lID0gcGFyZW50Ll90aW5vZGUuZ2V0TWVUb3BpYygpO1xuICB0aGlzLmNvbnRhY3QgPSBtZSAmJiBtZS5nZXRDb250YWN0KHBhcmVudC5uYW1lKTtcbiAgdGhpcy53aGF0ID0ge307XG59XG5cbk1ldGFHZXRCdWlsZGVyLnByb3RvdHlwZSA9IHtcblxuICAvLyBHZXQgbGF0ZXN0IHRpbWVzdGFtcFxuICBfZ2V0X2ltczogZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgY3VwZCA9IHRoaXMuY29udGFjdCAmJiB0aGlzLmNvbnRhY3QudXBkYXRlZDtcbiAgICBjb25zdCB0dXBkID0gdGhpcy50b3BpYy5fbGFzdERlc2NVcGRhdGUgfHwgMDtcbiAgICByZXR1cm4gY3VwZCA+IHR1cGQgPyBjdXBkIDogdHVwZDtcbiAgfSxcblxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggbWVzc2FnZXMgd2l0aGluIGV4cGxpY2l0IGxpbWl0cy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXI9fSBzaW5jZSBtZXNzYWdlcyBuZXdlciB0aGFuIHRoaXMgKGluY2x1c2l2ZSk7XG4gICAqIEBwYXJhbSB7TnVtYmVyPX0gYmVmb3JlIG9sZGVyIHRoYW4gdGhpcyAoZXhjbHVzaXZlKVxuICAgKiBAcGFyYW0ge051bWJlcj19IGxpbWl0IG51bWJlciBvZiBtZXNzYWdlcyB0byBmZXRjaFxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSA8dHQ+dGhpczwvdHQ+IG9iamVjdC5cbiAgICovXG4gIHdpdGhEYXRhOiBmdW5jdGlvbihzaW5jZSwgYmVmb3JlLCBsaW1pdCkge1xuICAgIHRoaXMud2hhdFsnZGF0YSddID0ge1xuICAgICAgc2luY2U6IHNpbmNlLFxuICAgICAgYmVmb3JlOiBiZWZvcmUsXG4gICAgICBsaW1pdDogbGltaXRcbiAgICB9O1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIC8qKlxuICAgKiBBZGQgcXVlcnkgcGFyYW1ldGVycyB0byBmZXRjaCBtZXNzYWdlcyBuZXdlciB0aGFuIHRoZSBsYXRlc3Qgc2F2ZWQgbWVzc2FnZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXI9fSBsaW1pdCBudW1iZXIgb2YgbWVzc2FnZXMgdG8gZmV0Y2hcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPHR0PnRoaXM8L3R0PiBvYmplY3QuXG4gICAqL1xuICB3aXRoTGF0ZXJEYXRhOiBmdW5jdGlvbihsaW1pdCkge1xuICAgIHJldHVybiB0aGlzLndpdGhEYXRhKHRoaXMudG9waWMuX21heFNlcSA+IDAgPyB0aGlzLnRvcGljLl9tYXhTZXEgKyAxIDogdW5kZWZpbmVkLCB1bmRlZmluZWQsIGxpbWl0KTtcbiAgfSxcblxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggbWVzc2FnZXMgb2xkZXIgdGhhbiB0aGUgZWFybGllc3Qgc2F2ZWQgbWVzc2FnZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXI9fSBsaW1pdCBtYXhpbXVtIG51bWJlciBvZiBtZXNzYWdlcyB0byBmZXRjaC5cbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPHR0PnRoaXM8L3R0PiBvYmplY3QuXG4gICAqL1xuICB3aXRoRWFybGllckRhdGE6IGZ1bmN0aW9uKGxpbWl0KSB7XG4gICAgcmV0dXJuIHRoaXMud2l0aERhdGEodW5kZWZpbmVkLCB0aGlzLnRvcGljLl9taW5TZXEgPiAwID8gdGhpcy50b3BpYy5fbWluU2VxIDogdW5kZWZpbmVkLCBsaW1pdCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIHRvcGljIGRlc2NyaXB0aW9uIGlmIGl0J3MgbmV3ZXIgdGhhbiB0aGUgZ2l2ZW4gdGltZXN0YW1wLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge0RhdGU9fSBpbXMgZmV0Y2ggbWVzc2FnZXMgbmV3ZXIgdGhhbiB0aGlzIHRpbWVzdGFtcC5cbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPHR0PnRoaXM8L3R0PiBvYmplY3QuXG4gICAqL1xuICB3aXRoRGVzYzogZnVuY3Rpb24oaW1zKSB7XG4gICAgdGhpcy53aGF0WydkZXNjJ10gPSB7XG4gICAgICBpbXM6IGltc1xuICAgIH07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEFkZCBxdWVyeSBwYXJhbWV0ZXJzIHRvIGZldGNoIHRvcGljIGRlc2NyaXB0aW9uIGlmIGl0J3MgbmV3ZXIgdGhhbiB0aGUgbGFzdCB1cGRhdGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IDx0dD50aGlzPC90dD4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aExhdGVyRGVzYzogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMud2l0aERlc2ModGhpcy5fZ2V0X2ltcygpKTtcbiAgfSxcblxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggc3Vic2NyaXB0aW9ucy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICpcbiAgICogQHBhcmFtIHtEYXRlPX0gaW1zIGZldGNoIHN1YnNjcmlwdGlvbnMgbW9kaWZpZWQgbW9yZSByZWNlbnRseSB0aGFuIHRoaXMgdGltZXN0YW1wXG4gICAqIEBwYXJhbSB7TnVtYmVyPX0gbGltaXQgbWF4aW11bSBudW1iZXIgb2Ygc3Vic2NyaXB0aW9ucyB0byBmZXRjaC5cbiAgICogQHBhcmFtIHtTdHJpbmc9fSB1c2VyT3JUb3BpYyB1c2VyIElEIG9yIHRvcGljIG5hbWUgdG8gZmV0Y2ggZm9yIGZldGNoaW5nIG9uZSBzdWJzY3JpcHRpb24uXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IDx0dD50aGlzPC90dD4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aFN1YjogZnVuY3Rpb24oaW1zLCBsaW1pdCwgdXNlck9yVG9waWMpIHtcbiAgICBjb25zdCBvcHRzID0ge1xuICAgICAgaW1zOiBpbXMsXG4gICAgICBsaW1pdDogbGltaXRcbiAgICB9O1xuICAgIGlmICh0aGlzLnRvcGljLmdldFR5cGUoKSA9PSAnbWUnKSB7XG4gICAgICBvcHRzLnRvcGljID0gdXNlck9yVG9waWM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wdHMudXNlciA9IHVzZXJPclRvcGljO1xuICAgIH1cbiAgICB0aGlzLndoYXRbJ3N1YiddID0gb3B0cztcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggYSBzaW5nbGUgc3Vic2NyaXB0aW9uLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLk1ldGFHZXRCdWlsZGVyI1xuICAgKlxuICAgKiBAcGFyYW0ge0RhdGU9fSBpbXMgZmV0Y2ggc3Vic2NyaXB0aW9ucyBtb2RpZmllZCBtb3JlIHJlY2VudGx5IHRoYW4gdGhpcyB0aW1lc3RhbXBcbiAgICogQHBhcmFtIHtTdHJpbmc9fSB1c2VyT3JUb3BpYyB1c2VyIElEIG9yIHRvcGljIG5hbWUgdG8gZmV0Y2ggZm9yIGZldGNoaW5nIG9uZSBzdWJzY3JpcHRpb24uXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IDx0dD50aGlzPC90dD4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aE9uZVN1YjogZnVuY3Rpb24oaW1zLCB1c2VyT3JUb3BpYykge1xuICAgIHJldHVybiB0aGlzLndpdGhTdWIoaW1zLCB1bmRlZmluZWQsIHVzZXJPclRvcGljKTtcbiAgfSxcblxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggYSBzaW5nbGUgc3Vic2NyaXB0aW9uIGlmIGl0J3MgYmVlbiB1cGRhdGVkIHNpbmNlIHRoZSBsYXN0IHVwZGF0ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmc9fSB1c2VyT3JUb3BpYyB1c2VyIElEIG9yIHRvcGljIG5hbWUgdG8gZmV0Y2ggZm9yIGZldGNoaW5nIG9uZSBzdWJzY3JpcHRpb24uXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IDx0dD50aGlzPC90dD4gb2JqZWN0LlxuICAgKi9cbiAgd2l0aExhdGVyT25lU3ViOiBmdW5jdGlvbih1c2VyT3JUb3BpYykge1xuICAgIHJldHVybiB0aGlzLndpdGhPbmVTdWIodGhpcy50b3BpYy5fbGFzdFN1YnNVcGRhdGUsIHVzZXJPclRvcGljKTtcbiAgfSxcblxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggc3Vic2NyaXB0aW9ucyB1cGRhdGVkIHNpbmNlIHRoZSBsYXN0IHVwZGF0ZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXI9fSBsaW1pdCBtYXhpbXVtIG51bWJlciBvZiBzdWJzY3JpcHRpb25zIHRvIGZldGNoLlxuICAgKlxuICAgKiBAcmV0dXJucyB7VGlub2RlLk1ldGFHZXRCdWlsZGVyfSA8dHQ+dGhpczwvdHQ+IG9iamVjdC5cbiAgICovXG4gIHdpdGhMYXRlclN1YjogZnVuY3Rpb24obGltaXQpIHtcbiAgICByZXR1cm4gdGhpcy53aXRoU3ViKFxuICAgICAgdGhpcy50b3BpYy5nZXRUeXBlKCkgPT0gJ3AycCcgPyB0aGlzLl9nZXRfaW1zKCkgOiB0aGlzLnRvcGljLl9sYXN0U3Vic1VwZGF0ZSxcbiAgICAgIGxpbWl0KTtcbiAgfSxcblxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggdG9waWMgdGFncy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPHR0PnRoaXM8L3R0PiBvYmplY3QuXG4gICAqL1xuICB3aXRoVGFnczogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy53aGF0Wyd0YWdzJ10gPSB0cnVlO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIC8qKlxuICAgKiBBZGQgcXVlcnkgcGFyYW1ldGVycyB0byBmZXRjaCB1c2VyJ3MgY3JlZGVudGlhbHMuICdtZScgdG9waWMgb25seS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPHR0PnRoaXM8L3R0PiBvYmplY3QuXG4gICAqL1xuICB3aXRoQ3JlZDogZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMudG9waWMuZ2V0VHlwZSgpID09ICdtZScpIHtcbiAgICAgIHRoaXMud2hhdFsnY3JlZCddID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50b3BpYy5fdGlub2RlLmxvZ2dlcihcIkVSUk9SOiBJbnZhbGlkIHRvcGljIHR5cGUgZm9yIE1ldGFHZXRCdWlsZGVyOndpdGhDcmVkc1wiLCB0aGlzLnRvcGljLmdldFR5cGUoKSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIC8qKlxuICAgKiBBZGQgcXVlcnkgcGFyYW1ldGVycyB0byBmZXRjaCBkZWxldGVkIG1lc3NhZ2VzIHdpdGhpbiBleHBsaWNpdCBsaW1pdHMuIEFueS9hbGwgcGFyYW1ldGVycyBjYW4gYmUgbnVsbC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5NZXRhR2V0QnVpbGRlciNcbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXI9fSBzaW5jZSBpZHMgb2YgbWVzc2FnZXMgZGVsZXRlZCBzaW5jZSB0aGlzICdkZWwnIGlkIChpbmNsdXNpdmUpXG4gICAqIEBwYXJhbSB7TnVtYmVyPX0gbGltaXQgbnVtYmVyIG9mIGRlbGV0ZWQgbWVzc2FnZSBpZHMgdG8gZmV0Y2hcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPHR0PnRoaXM8L3R0PiBvYmplY3QuXG4gICAqL1xuICB3aXRoRGVsOiBmdW5jdGlvbihzaW5jZSwgbGltaXQpIHtcbiAgICBpZiAoc2luY2UgfHwgbGltaXQpIHtcbiAgICAgIHRoaXMud2hhdFsnZGVsJ10gPSB7XG4gICAgICAgIHNpbmNlOiBzaW5jZSxcbiAgICAgICAgbGltaXQ6IGxpbWl0XG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICAvKipcbiAgICogQWRkIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gZmV0Y2ggbWVzc2FnZXMgZGVsZXRlZCBhZnRlciB0aGUgc2F2ZWQgJ2RlbCcgaWQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyPX0gbGltaXQgbnVtYmVyIG9mIGRlbGV0ZWQgbWVzc2FnZSBpZHMgdG8gZmV0Y2hcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5NZXRhR2V0QnVpbGRlcn0gPHR0PnRoaXM8L3R0PiBvYmplY3QuXG4gICAqL1xuICB3aXRoTGF0ZXJEZWw6IGZ1bmN0aW9uKGxpbWl0KSB7XG4gICAgLy8gU3BlY2lmeSAnc2luY2UnIG9ubHkgaWYgd2UgaGF2ZSBhbHJlYWR5IHJlY2VpdmVkIHNvbWUgbWVzc2FnZXMuIElmXG4gICAgLy8gd2UgaGF2ZSBubyBsb2NhbGx5IGNhY2hlZCBtZXNzYWdlcyB0aGVuIHdlIGRvbid0IGNhcmUgaWYgYW55IG1lc3NhZ2VzIHdlcmUgZGVsZXRlZC5cbiAgICByZXR1cm4gdGhpcy53aXRoRGVsKHRoaXMudG9waWMuX21heFNlcSA+IDAgPyB0aGlzLnRvcGljLl9tYXhEZWwgKyAxIDogdW5kZWZpbmVkLCBsaW1pdCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdCBwYXJhbWV0ZXJzXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuTWV0YUdldEJ1aWxkZXIjXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuR2V0UXVlcnl9IEdldCBxdWVyeVxuICAgKi9cbiAgYnVpbGQ6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IHdoYXQgPSBbXTtcbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXM7XG4gICAgbGV0IHBhcmFtcyA9IHt9O1xuICAgIFsnZGF0YScsICdzdWInLCAnZGVzYycsICd0YWdzJywgJ2NyZWQnLCAnZGVsJ10ubWFwKGZ1bmN0aW9uKGtleSkge1xuICAgICAgaWYgKGluc3RhbmNlLndoYXQuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICB3aGF0LnB1c2goa2V5KTtcbiAgICAgICAgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGluc3RhbmNlLndoYXRba2V5XSkubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHBhcmFtc1trZXldID0gaW5zdGFuY2Uud2hhdFtrZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHdoYXQubGVuZ3RoID4gMCkge1xuICAgICAgcGFyYW1zLndoYXQgPSB3aGF0LmpvaW4oJyAnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFyYW1zID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gcGFyYW1zO1xuICB9XG59O1xuXG4vKipcbiAqIEhlbHBlciBjbGFzcyBmb3IgaGFuZGxpbmcgYWNjZXNzIG1vZGUuXG4gKlxuICogQGNsYXNzIEFjY2Vzc01vZGVcbiAqIEBtZW1iZXJvZiBUaW5vZGVcbiAqXG4gKiBAcGFyYW0ge0FjY2Vzc01vZGV8T2JqZWN0PX0gYWNzIEFjY2Vzc01vZGUgdG8gY29weSBvciBhY2Nlc3MgbW9kZSBvYmplY3QgcmVjZWl2ZWQgZnJvbSB0aGUgc2VydmVyLlxuICovXG52YXIgQWNjZXNzTW9kZSA9IGZ1bmN0aW9uKGFjcykge1xuICBpZiAoYWNzKSB7XG4gICAgdGhpcy5naXZlbiA9IHR5cGVvZiBhY3MuZ2l2ZW4gPT0gJ251bWJlcicgPyBhY3MuZ2l2ZW4gOiBBY2Nlc3NNb2RlLmRlY29kZShhY3MuZ2l2ZW4pO1xuICAgIHRoaXMud2FudCA9IHR5cGVvZiBhY3Mud2FudCA9PSAnbnVtYmVyJyA/IGFjcy53YW50IDogQWNjZXNzTW9kZS5kZWNvZGUoYWNzLndhbnQpO1xuICAgIHRoaXMubW9kZSA9IGFjcy5tb2RlID8gKHR5cGVvZiBhY3MubW9kZSA9PSAnbnVtYmVyJyA/IGFjcy5tb2RlIDogQWNjZXNzTW9kZS5kZWNvZGUoYWNzLm1vZGUpKSA6XG4gICAgICAodGhpcy5naXZlbiAmIHRoaXMud2FudCk7XG4gIH1cbn07XG5cbkFjY2Vzc01vZGUuX05PTkUgPSAweDAwO1xuQWNjZXNzTW9kZS5fSk9JTiA9IDB4MDE7XG5BY2Nlc3NNb2RlLl9SRUFEID0gMHgwMjtcbkFjY2Vzc01vZGUuX1dSSVRFID0gMHgwNDtcbkFjY2Vzc01vZGUuX1BSRVMgPSAweDA4O1xuQWNjZXNzTW9kZS5fQVBQUk9WRSA9IDB4MTA7XG5BY2Nlc3NNb2RlLl9TSEFSRSA9IDB4MjA7XG5BY2Nlc3NNb2RlLl9ERUxFVEUgPSAweDQwO1xuQWNjZXNzTW9kZS5fT1dORVIgPSAweDgwO1xuXG5BY2Nlc3NNb2RlLl9CSVRNQVNLID0gQWNjZXNzTW9kZS5fSk9JTiB8IEFjY2Vzc01vZGUuX1JFQUQgfCBBY2Nlc3NNb2RlLl9XUklURSB8IEFjY2Vzc01vZGUuX1BSRVMgfFxuICBBY2Nlc3NNb2RlLl9BUFBST1ZFIHwgQWNjZXNzTW9kZS5fU0hBUkUgfCBBY2Nlc3NNb2RlLl9ERUxFVEUgfCBBY2Nlc3NNb2RlLl9PV05FUjtcbkFjY2Vzc01vZGUuX0lOVkFMSUQgPSAweDEwMDAwMDtcblxuQWNjZXNzTW9kZS5fY2hlY2tGbGFnID0gZnVuY3Rpb24odmFsLCBzaWRlLCBmbGFnKSB7XG4gIHNpZGUgPSBzaWRlIHx8ICdtb2RlJztcbiAgaWYgKFsnZ2l2ZW4nLCAnd2FudCcsICdtb2RlJ10uaW5jbHVkZXMoc2lkZSkpIHtcbiAgICByZXR1cm4gKCh2YWxbc2lkZV0gJiBmbGFnKSAhPSAwKTtcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIEFjY2Vzc01vZGUgY29tcG9uZW50ICdcIiArIHNpZGUgKyBcIidcIik7XG59XG5cbi8qKlxuICogUGFyc2Ugc3RyaW5nIGludG8gYW4gYWNjZXNzIG1vZGUgdmFsdWUuXG4gKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAqIEBzdGF0aWNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZyB8IG51bWJlcn0gbW9kZSAtIGVpdGhlciBhIFN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgYWNjZXNzIG1vZGUgdG8gcGFyc2Ugb3IgYSBzZXQgb2YgYml0cyB0byBhc3NpZ24uXG4gKiBAcmV0dXJucyB7bnVtYmVyfSAtIEFjY2VzcyBtb2RlIGFzIGEgbnVtZXJpYyB2YWx1ZS5cbiAqL1xuQWNjZXNzTW9kZS5kZWNvZGUgPSBmdW5jdGlvbihzdHIpIHtcbiAgaWYgKCFzdHIpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfSBlbHNlIGlmICh0eXBlb2Ygc3RyID09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIHN0ciAmIEFjY2Vzc01vZGUuX0JJVE1BU0s7XG4gIH0gZWxzZSBpZiAoc3RyID09PSAnTicgfHwgc3RyID09PSAnbicpIHtcbiAgICByZXR1cm4gQWNjZXNzTW9kZS5fTk9ORTtcbiAgfVxuXG4gIGNvbnN0IGJpdG1hc2sgPSB7XG4gICAgJ0onOiBBY2Nlc3NNb2RlLl9KT0lOLFxuICAgICdSJzogQWNjZXNzTW9kZS5fUkVBRCxcbiAgICAnVyc6IEFjY2Vzc01vZGUuX1dSSVRFLFxuICAgICdQJzogQWNjZXNzTW9kZS5fUFJFUyxcbiAgICAnQSc6IEFjY2Vzc01vZGUuX0FQUFJPVkUsXG4gICAgJ1MnOiBBY2Nlc3NNb2RlLl9TSEFSRSxcbiAgICAnRCc6IEFjY2Vzc01vZGUuX0RFTEVURSxcbiAgICAnTyc6IEFjY2Vzc01vZGUuX09XTkVSXG4gIH07XG5cbiAgbGV0IG0wID0gQWNjZXNzTW9kZS5fTk9ORTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGJpdCA9IGJpdG1hc2tbc3RyLmNoYXJBdChpKS50b1VwcGVyQ2FzZSgpXTtcbiAgICBpZiAoIWJpdCkge1xuICAgICAgLy8gVW5yZWNvZ25pemVkIGJpdCwgc2tpcC5cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBtMCB8PSBiaXQ7XG4gIH1cbiAgcmV0dXJuIG0wO1xufTtcblxuLyoqXG4gKiBDb252ZXJ0IG51bWVyaWMgcmVwcmVzZW50YXRpb24gb2YgdGhlIGFjY2VzcyBtb2RlIGludG8gYSBzdHJpbmcuXG4gKlxuICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IHZhbCAtIGFjY2VzcyBtb2RlIHZhbHVlIHRvIGNvbnZlcnQgdG8gYSBzdHJpbmcuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSAtIEFjY2VzcyBtb2RlIGFzIGEgc3RyaW5nLlxuICovXG5BY2Nlc3NNb2RlLmVuY29kZSA9IGZ1bmN0aW9uKHZhbCkge1xuICBpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gQWNjZXNzTW9kZS5fSU5WQUxJRCkge1xuICAgIHJldHVybiBudWxsO1xuICB9IGVsc2UgaWYgKHZhbCA9PT0gQWNjZXNzTW9kZS5fTk9ORSkge1xuICAgIHJldHVybiAnTic7XG4gIH1cblxuICBjb25zdCBiaXRtYXNrID0gWydKJywgJ1InLCAnVycsICdQJywgJ0EnLCAnUycsICdEJywgJ08nXTtcbiAgbGV0IHJlcyA9ICcnO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGJpdG1hc2subGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoKHZhbCAmICgxIDw8IGkpKSAhPSAwKSB7XG4gICAgICByZXMgPSByZXMgKyBiaXRtYXNrW2ldO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzO1xufTtcblxuLyoqXG4gKiBVcGRhdGUgbnVtZXJpYyByZXByZXNlbnRhdGlvbiBvZiBhY2Nlc3MgbW9kZSB3aXRoIHRoZSBuZXcgdmFsdWUuIFRoZSB2YWx1ZVxuICogaXMgb25lIG9mIHRoZSBmb2xsb3dpbmc6XG4gKiAgLSBhIHN0cmluZyBzdGFydGluZyB3aXRoICcrJyBvciAnLScgdGhlbiB0aGUgYml0cyB0byBhZGQgb3IgcmVtb3ZlLCBlLmcuICcrUi1XJyBvciAnLVBTJy5cbiAqICAtIGEgbmV3IHZhbHVlIG9mIGFjY2VzcyBtb2RlXG4gKlxuICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gKiBAc3RhdGljXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IHZhbCAtIGFjY2VzcyBtb2RlIHZhbHVlIHRvIHVwZGF0ZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSB1cGQgLSB1cGRhdGUgdG8gYXBwbHkgdG8gdmFsLlxuICogQHJldHVybnMge251bWJlcn0gLSB1cGRhdGVkIGFjY2VzcyBtb2RlLlxuICovXG5BY2Nlc3NNb2RlLnVwZGF0ZSA9IGZ1bmN0aW9uKHZhbCwgdXBkKSB7XG4gIGlmICghdXBkIHx8IHR5cGVvZiB1cGQgIT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsO1xuICB9XG5cbiAgbGV0IGFjdGlvbiA9IHVwZC5jaGFyQXQoMCk7XG4gIGlmIChhY3Rpb24gPT0gJysnIHx8IGFjdGlvbiA9PSAnLScpIHtcbiAgICBsZXQgdmFsMCA9IHZhbDtcbiAgICAvLyBTcGxpdCBkZWx0YS1zdHJpbmcgbGlrZSAnK0FCQy1ERUYrWicgaW50byBhbiBhcnJheSBvZiBwYXJ0cyBpbmNsdWRpbmcgKyBhbmQgLS5cbiAgICBjb25zdCBwYXJ0cyA9IHVwZC5zcGxpdCgvKFstK10pLyk7XG4gICAgLy8gU3RhcnRpbmcgaXRlcmF0aW9uIGZyb20gMSBiZWNhdXNlIFN0cmluZy5zcGxpdCgpIGNyZWF0ZXMgYW4gYXJyYXkgd2l0aCB0aGUgZmlyc3QgZW1wdHkgZWxlbWVudC5cbiAgICAvLyBJdGVyYXRpbmcgYnkgMiBiZWNhdXNlIHdlIHBhcnNlIHBhaXJzICsvLSB0aGVuIGRhdGEuXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBwYXJ0cy5sZW5ndGggLSAxOyBpICs9IDIpIHtcbiAgICAgIGFjdGlvbiA9IHBhcnRzW2ldO1xuICAgICAgY29uc3QgbTAgPSBBY2Nlc3NNb2RlLmRlY29kZShwYXJ0c1tpICsgMV0pO1xuICAgICAgaWYgKG0wID09IEFjY2Vzc01vZGUuX0lOVkFMSUQpIHtcbiAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgIH1cbiAgICAgIGlmIChtMCA9PSBudWxsKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKGFjdGlvbiA9PT0gJysnKSB7XG4gICAgICAgIHZhbDAgfD0gbTA7XG4gICAgICB9IGVsc2UgaWYgKGFjdGlvbiA9PT0gJy0nKSB7XG4gICAgICAgIHZhbDAgJj0gfm0wO1xuICAgICAgfVxuICAgIH1cbiAgICB2YWwgPSB2YWwwO1xuICB9IGVsc2Uge1xuICAgIC8vIFRoZSBzdHJpbmcgaXMgYW4gZXhwbGljaXQgbmV3IHZhbHVlICdBQkMnIHJhdGhlciB0aGFuIGRlbHRhLlxuICAgIGNvbnN0IHZhbDAgPSBBY2Nlc3NNb2RlLmRlY29kZSh1cGQpO1xuICAgIGlmICh2YWwwICE9IEFjY2Vzc01vZGUuX0lOVkFMSUQpIHtcbiAgICAgIHZhbCA9IHZhbDA7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHZhbDtcbn07XG5cbi8qKlxuICogQWNjZXNzTW9kZSBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyB0b3BpYyBhY2Nlc3MgbW9kZS5cbiAqIEBjbGFzcyBUb3BpY1xuICogQG1lbWJlcm9mIFRpbm9kZVxuICovXG5BY2Nlc3NNb2RlLnByb3RvdHlwZSA9IHtcbiAgLyoqXG4gICAqIEN1c3RvbSBmb3JtYXR0ZXJcbiAgICovXG4gIHRvU3RyaW5nOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gJ3tcIm1vZGVcIjogXCInICsgQWNjZXNzTW9kZS5lbmNvZGUodGhpcy5tb2RlKSArXG4gICAgICAnXCIsIFwiZ2l2ZW5cIjogXCInICsgQWNjZXNzTW9kZS5lbmNvZGUodGhpcy5naXZlbikgK1xuICAgICAgJ1wiLCBcIndhbnRcIjogXCInICsgQWNjZXNzTW9kZS5lbmNvZGUodGhpcy53YW50KSArICdcIn0nO1xuICB9LFxuICAvKipcbiAgICogQ29udmVydCBudW1lcmljIHZhbHVlcyB0byBzdHJpbmdzLlxuICAgKi9cbiAganNvbkhlbHBlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1vZGU6IEFjY2Vzc01vZGUuZW5jb2RlKHRoaXMubW9kZSksXG4gICAgICBnaXZlbjogQWNjZXNzTW9kZS5lbmNvZGUodGhpcy5naXZlbiksXG4gICAgICB3YW50OiBBY2Nlc3NNb2RlLmVuY29kZSh0aGlzLndhbnQpXG4gICAgfTtcbiAgfSxcbiAgLyoqXG4gICAqIEFzc2lnbiB2YWx1ZSB0byAnbW9kZScuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZyB8IG51bWJlcn0gbSAtIGVpdGhlciBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgYWNjZXNzIG1vZGUgb3IgYSBzZXQgb2YgYml0cy5cbiAgICogQHJldHVybnMge0FjY2Vzc01vZGV9IC0gPGI+dGhpczwvYj4gQWNjZXNzTW9kZS5cbiAgICovXG4gIHNldE1vZGU6IGZ1bmN0aW9uKG0pIHtcbiAgICB0aGlzLm1vZGUgPSBBY2Nlc3NNb2RlLmRlY29kZShtKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgLyoqXG4gICAqIFVwZGF0ZSAnbW9kZScgdmFsdWUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdSAtIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgY2hhbmdlcyB0byBhcHBseSB0byBhY2Nlc3MgbW9kZS5cbiAgICogQHJldHVybnMge0FjY2Vzc01vZGV9IC0gPGI+dGhpczwvYj4gQWNjZXNzTW9kZS5cbiAgICovXG4gIHVwZGF0ZU1vZGU6IGZ1bmN0aW9uKHUpIHtcbiAgICB0aGlzLm1vZGUgPSBBY2Nlc3NNb2RlLnVwZGF0ZSh0aGlzLm1vZGUsIHUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICAvKipcbiAgICogR2V0ICdtb2RlJyB2YWx1ZSBhcyBhIHN0cmluZy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IC0gPGI+bW9kZTwvYj4gdmFsdWUuXG4gICAqL1xuICBnZXRNb2RlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gQWNjZXNzTW9kZS5lbmNvZGUodGhpcy5tb2RlKTtcbiAgfSxcblxuICAvKipcbiAgICogQXNzaWduICdnaXZlbicgdmFsdWUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZyB8IG51bWJlcn0gZyAtIGVpdGhlciBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgYWNjZXNzIG1vZGUgb3IgYSBzZXQgb2YgYml0cy5cbiAgICogQHJldHVybnMge0FjY2Vzc01vZGV9IC0gPGI+dGhpczwvYj4gQWNjZXNzTW9kZS5cbiAgICovXG4gIHNldEdpdmVuOiBmdW5jdGlvbihnKSB7XG4gICAgdGhpcy5naXZlbiA9IEFjY2Vzc01vZGUuZGVjb2RlKGcpO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICAvKipcbiAgICogVXBkYXRlICdnaXZlbicgdmFsdWUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdSAtIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgY2hhbmdlcyB0byBhcHBseSB0byBhY2Nlc3MgbW9kZS5cbiAgICogQHJldHVybnMge0FjY2Vzc01vZGV9IC0gPGI+dGhpczwvYj4gQWNjZXNzTW9kZS5cbiAgICovXG4gIHVwZGF0ZUdpdmVuOiBmdW5jdGlvbih1KSB7XG4gICAgdGhpcy5naXZlbiA9IEFjY2Vzc01vZGUudXBkYXRlKHRoaXMuZ2l2ZW4sIHUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICAvKipcbiAgICogR2V0ICdnaXZlbicgdmFsdWUgYXMgYSBzdHJpbmcuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSAtIDxiPmdpdmVuPC9iPiB2YWx1ZS5cbiAgICovXG4gIGdldEdpdmVuOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gQWNjZXNzTW9kZS5lbmNvZGUodGhpcy5naXZlbik7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEFzc2lnbiAnd2FudCcgdmFsdWUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZyB8IG51bWJlcn0gdyAtIGVpdGhlciBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgYWNjZXNzIG1vZGUgb3IgYSBzZXQgb2YgYml0cy5cbiAgICogQHJldHVybnMge0FjY2Vzc01vZGV9IC0gPGI+dGhpczwvYj4gQWNjZXNzTW9kZS5cbiAgICovXG4gIHNldFdhbnQ6IGZ1bmN0aW9uKHcpIHtcbiAgICB0aGlzLndhbnQgPSBBY2Nlc3NNb2RlLmRlY29kZSh3KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgLyoqXG4gICAqIFVwZGF0ZSAnd2FudCcgdmFsdWUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdSAtIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgY2hhbmdlcyB0byBhcHBseSB0byBhY2Nlc3MgbW9kZS5cbiAgICogQHJldHVybnMge0FjY2Vzc01vZGV9IC0gPGI+dGhpczwvYj4gQWNjZXNzTW9kZS5cbiAgICovXG4gIHVwZGF0ZVdhbnQ6IGZ1bmN0aW9uKHUpIHtcbiAgICB0aGlzLndhbnQgPSBBY2Nlc3NNb2RlLnVwZGF0ZSh0aGlzLndhbnQsIHUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICAvKipcbiAgICogR2V0ICd3YW50JyB2YWx1ZSBhcyBhIHN0cmluZy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IC0gPGI+d2FudDwvYj4gdmFsdWUuXG4gICAqL1xuICBnZXRXYW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gQWNjZXNzTW9kZS5lbmNvZGUodGhpcy53YW50KTtcbiAgfSxcblxuICAvKipcbiAgICogR2V0IHBlcm1pc3Npb25zIHByZXNlbnQgaW4gJ3dhbnQnIGJ1dCBtaXNzaW5nIGluICdnaXZlbicuXG4gICAqIEludmVyc2Ugb2Yge0BsaW5rIFRpbm9kZS5BY2Nlc3NNb2RlI2dldEV4Y2Vzc2l2ZX1cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IHBlcm1pc3Npb25zIHByZXNlbnQgaW4gPGI+d2FudDwvYj4gYnV0IG1pc3NpbmcgaW4gPGI+Z2l2ZW48L2I+LlxuICAgKi9cbiAgZ2V0TWlzc2luZzogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIEFjY2Vzc01vZGUuZW5jb2RlKHRoaXMud2FudCAmIH50aGlzLmdpdmVuKTtcbiAgfSxcblxuICAvKipcbiAgICogR2V0IHBlcm1pc3Npb25zIHByZXNlbnQgaW4gJ2dpdmVuJyBidXQgbWlzc2luZyBpbiAnd2FudCcuXG4gICAqIEludmVyc2Ugb2Yge0BsaW5rIFRpbm9kZS5BY2Nlc3NNb2RlI2dldE1pc3Npbmd9XG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBwZXJtaXNzaW9ucyBwcmVzZW50IGluIDxiPmdpdmVuPC9iPiBidXQgbWlzc2luZyBpbiA8Yj53YW50PC9iPi5cbiAgICovXG4gIGdldEV4Y2Vzc2l2ZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIEFjY2Vzc01vZGUuZW5jb2RlKHRoaXMuZ2l2ZW4gJiB+dGhpcy53YW50KTtcbiAgfSxcblxuICAvKipcbiAgICogVXBkYXRlICd3YW50JywgJ2dpdmUnLCBhbmQgJ21vZGUnIHZhbHVlcy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqXG4gICAqIEBwYXJhbSB7QWNjZXNzTW9kZX0gdmFsIC0gbmV3IGFjY2VzcyBtb2RlIHZhbHVlLlxuICAgKiBAcmV0dXJucyB7QWNjZXNzTW9kZX0gLSA8Yj50aGlzPC9iPiBBY2Nlc3NNb2RlLlxuICAgKi9cbiAgdXBkYXRlQWxsOiBmdW5jdGlvbih2YWwpIHtcbiAgICBpZiAodmFsKSB7XG4gICAgICB0aGlzLnVwZGF0ZUdpdmVuKHZhbC5naXZlbik7XG4gICAgICB0aGlzLnVwZGF0ZVdhbnQodmFsLndhbnQpO1xuICAgICAgdGhpcy5tb2RlID0gdGhpcy5naXZlbiAmIHRoaXMud2FudDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIE93bmVyIChPKSBmbGFnIGlzIHNldC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gc2lkZSAtIHdoaWNoIHBlcm1pc3Npb24gdG8gY2hlY2s6IGdpdmVuLCB3YW50LCBtb2RlOyBkZWZhdWx0OiBtb2RlLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSB0cnVlIGlmIGZsYWcgaXMgc2V0LlxuICAgKi9cbiAgaXNPd25lcjogZnVuY3Rpb24oc2lkZSkge1xuICAgIHJldHVybiBBY2Nlc3NNb2RlLl9jaGVja0ZsYWcodGhpcywgc2lkZSwgQWNjZXNzTW9kZS5fT1dORVIpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBQcmVzZW5jZSAoUCkgZmxhZyBpcyBzZXQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IHNpZGUgLSB3aGljaCBwZXJtaXNzaW9uIHRvIGNoZWNrOiBnaXZlbiwgd2FudCwgbW9kZTsgZGVmYXVsdDogbW9kZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gdHJ1ZSBpZiBmbGFnIGlzIHNldC5cbiAgICovXG4gIGlzUHJlc2VuY2VyOiBmdW5jdGlvbihzaWRlKSB7XG4gICAgcmV0dXJuIEFjY2Vzc01vZGUuX2NoZWNrRmxhZyh0aGlzLCBzaWRlLCBBY2Nlc3NNb2RlLl9QUkVTKTtcbiAgfSxcblxuICAvKipcbiAgICogQ2hlY2sgaWYgUHJlc2VuY2UgKFApIGZsYWcgaXMgTk9UIHNldC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gc2lkZSAtIHdoaWNoIHBlcm1pc3Npb24gdG8gY2hlY2s6IGdpdmVuLCB3YW50LCBtb2RlOyBkZWZhdWx0OiBtb2RlLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSB0cnVlIGlmIGZsYWcgaXMgc2V0LlxuICAgKi9cbiAgaXNNdXRlZDogZnVuY3Rpb24oc2lkZSkge1xuICAgIHJldHVybiAhdGhpcy5pc1ByZXNlbmNlcihzaWRlKTtcbiAgfSxcblxuICAvKipcbiAgICogQ2hlY2sgaWYgSm9pbiAoSikgZmxhZyBpcyBzZXQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IHNpZGUgLSB3aGljaCBwZXJtaXNzaW9uIHRvIGNoZWNrOiBnaXZlbiwgd2FudCwgbW9kZTsgZGVmYXVsdDogbW9kZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gdHJ1ZSBpZiBmbGFnIGlzIHNldC5cbiAgICovXG4gIGlzSm9pbmVyOiBmdW5jdGlvbihzaWRlKSB7XG4gICAgcmV0dXJuIEFjY2Vzc01vZGUuX2NoZWNrRmxhZyh0aGlzLCBzaWRlLCBBY2Nlc3NNb2RlLl9KT0lOKTtcbiAgfSxcblxuICAvKipcbiAgICogQ2hlY2sgaWYgUmVhZGVyIChSKSBmbGFnIGlzIHNldC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5BY2Nlc3NNb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gc2lkZSAtIHdoaWNoIHBlcm1pc3Npb24gdG8gY2hlY2s6IGdpdmVuLCB3YW50LCBtb2RlOyBkZWZhdWx0OiBtb2RlLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSB0cnVlIGlmIGZsYWcgaXMgc2V0LlxuICAgKi9cbiAgaXNSZWFkZXI6IGZ1bmN0aW9uKHNpZGUpIHtcbiAgICByZXR1cm4gQWNjZXNzTW9kZS5fY2hlY2tGbGFnKHRoaXMsIHNpZGUsIEFjY2Vzc01vZGUuX1JFQUQpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBXcml0ZXIgKFcpIGZsYWcgaXMgc2V0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICogQHBhcmFtIHtzdHJpbmc9fSBzaWRlIC0gd2hpY2ggcGVybWlzc2lvbiB0byBjaGVjazogZ2l2ZW4sIHdhbnQsIG1vZGU7IGRlZmF1bHQ6IG1vZGUuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIHRydWUgaWYgZmxhZyBpcyBzZXQuXG4gICAqL1xuICBpc1dyaXRlcjogZnVuY3Rpb24oc2lkZSkge1xuICAgIHJldHVybiBBY2Nlc3NNb2RlLl9jaGVja0ZsYWcodGhpcywgc2lkZSwgQWNjZXNzTW9kZS5fV1JJVEUpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBBcHByb3ZlciAoQSkgZmxhZyBpcyBzZXQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IHNpZGUgLSB3aGljaCBwZXJtaXNzaW9uIHRvIGNoZWNrOiBnaXZlbiwgd2FudCwgbW9kZTsgZGVmYXVsdDogbW9kZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gdHJ1ZSBpZiBmbGFnIGlzIHNldC5cbiAgICovXG4gIGlzQXBwcm92ZXI6IGZ1bmN0aW9uKHNpZGUpIHtcbiAgICByZXR1cm4gQWNjZXNzTW9kZS5fY2hlY2tGbGFnKHRoaXMsIHNpZGUsIEFjY2Vzc01vZGUuX0FQUFJPVkUpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBlaXRoZXIgb25lIG9mIE93bmVyIChPKSBvciBBcHByb3ZlciAoQSkgZmxhZ3MgaXMgc2V0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICogQHBhcmFtIHtzdHJpbmc9fSBzaWRlIC0gd2hpY2ggcGVybWlzc2lvbiB0byBjaGVjazogZ2l2ZW4sIHdhbnQsIG1vZGU7IGRlZmF1bHQ6IG1vZGUuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIHRydWUgaWYgZmxhZyBpcyBzZXQuXG4gICAqL1xuICBpc0FkbWluOiBmdW5jdGlvbihzaWRlKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNPd25lcihzaWRlKSB8fCB0aGlzLmlzQXBwcm92ZXIoc2lkZSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGVpdGhlciBvbmUgb2YgT3duZXIgKE8pLCBBcHByb3ZlciAoQSksIG9yIFNoYXJlciAoUykgZmxhZ3MgaXMgc2V0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkFjY2Vzc01vZGVcbiAgICogQHBhcmFtIHtzdHJpbmc9fSBzaWRlIC0gd2hpY2ggcGVybWlzc2lvbiB0byBjaGVjazogZ2l2ZW4sIHdhbnQsIG1vZGU7IGRlZmF1bHQ6IG1vZGUuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAtIHRydWUgaWYgZmxhZyBpcyBzZXQuXG4gICAqL1xuICBpc1NoYXJlcjogZnVuY3Rpb24oc2lkZSkge1xuICAgIHJldHVybiB0aGlzLmlzQWRtaW4oc2lkZSkgfHwgQWNjZXNzTW9kZS5fY2hlY2tGbGFnKHRoaXMsIHNpZGUsIEFjY2Vzc01vZGUuX1NIQVJFKTtcbiAgfSxcblxuICAvKipcbiAgICogQ2hlY2sgaWYgRGVsZXRlciAoRCkgZmxhZyBpcyBzZXQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuQWNjZXNzTW9kZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IHNpZGUgLSB3aGljaCBwZXJtaXNzaW9uIHRvIGNoZWNrOiBnaXZlbiwgd2FudCwgbW9kZTsgZGVmYXVsdDogbW9kZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IC0gdHJ1ZSBpZiBmbGFnIGlzIHNldC5cbiAgICovXG4gIGlzRGVsZXRlcjogZnVuY3Rpb24oc2lkZSkge1xuICAgIHJldHVybiBBY2Nlc3NNb2RlLl9jaGVja0ZsYWcodGhpcywgc2lkZSwgQWNjZXNzTW9kZS5fREVMRVRFKTtcbiAgfVxufTtcblxuLyoqXG4gKiBAY2FsbGJhY2sgVGlub2RlLlRvcGljLm9uRGF0YVxuICogQHBhcmFtIHtEYXRhfSBkYXRhIC0gRGF0YSBwYWNrZXRcbiAqL1xuLyoqXG4gKiBUb3BpYyBpcyBhIGNsYXNzIHJlcHJlc2VudGluZyBhIGxvZ2ljYWwgY29tbXVuaWNhdGlvbiBjaGFubmVsLlxuICogQGNsYXNzIFRvcGljXG4gKiBAbWVtYmVyb2YgVGlub2RlXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSB0b3BpYyB0byBjcmVhdGUuXG4gKiBAcGFyYW0ge09iamVjdD19IGNhbGxiYWNrcyAtIE9iamVjdCB3aXRoIHZhcmlvdXMgZXZlbnQgY2FsbGJhY2tzLlxuICogQHBhcmFtIHtUaW5vZGUuVG9waWMub25EYXRhfSBjYWxsYmFja3Mub25EYXRhIC0gQ2FsbGJhY2sgd2hpY2ggcmVjZWl2ZXMgYSB7ZGF0YX0gbWVzc2FnZS5cbiAqIEBwYXJhbSB7Y2FsbGJhY2t9IGNhbGxiYWNrcy5vbk1ldGEgLSBDYWxsYmFjayB3aGljaCByZWNlaXZlcyBhIHttZXRhfSBtZXNzYWdlLlxuICogQHBhcmFtIHtjYWxsYmFja30gY2FsbGJhY2tzLm9uUHJlcyAtIENhbGxiYWNrIHdoaWNoIHJlY2VpdmVzIGEge3ByZXN9IG1lc3NhZ2UuXG4gKiBAcGFyYW0ge2NhbGxiYWNrfSBjYWxsYmFja3Mub25JbmZvIC0gQ2FsbGJhY2sgd2hpY2ggcmVjZWl2ZXMgYW4ge2luZm99IG1lc3NhZ2UuXG4gKiBAcGFyYW0ge2NhbGxiYWNrfSBjYWxsYmFja3Mub25NZXRhRGVzYyAtIENhbGxiYWNrIHdoaWNoIHJlY2VpdmVzIGNoYW5nZXMgdG8gdG9waWMgZGVzY3Rpb3B0aW9uIHtAbGluayBkZXNjfS5cbiAqIEBwYXJhbSB7Y2FsbGJhY2t9IGNhbGxiYWNrcy5vbk1ldGFTdWIgLSBDYWxsZWQgZm9yIGEgc2luZ2xlIHN1YnNjcmlwdGlvbiByZWNvcmQgY2hhbmdlLlxuICogQHBhcmFtIHtjYWxsYmFja30gY2FsbGJhY2tzLm9uU3Vic1VwZGF0ZWQgLSBDYWxsZWQgYWZ0ZXIgYSBiYXRjaCBvZiBzdWJzY3JpcHRpb24gY2hhbmdlcyBoYXZlIGJlZW4gcmVjaWV2ZWQgYW5kIGNhY2hlZC5cbiAqIEBwYXJhbSB7Y2FsbGJhY2t9IGNhbGxiYWNrcy5vbkRlbGV0ZVRvcGljIC0gQ2FsbGVkIGFmdGVyIHRoZSB0b3BpYyBpcyBkZWxldGVkLlxuICogQHBhcmFtIHtjYWxsYmFja30gY2FsbGJhY2xzLm9uQWxsTWVzc2FnZXNSZWNlaXZlZCAtIENhbGxlZCB3aGVuIGFsbCByZXF1ZXN0ZWQge2RhdGF9IG1lc3NhZ2VzIGhhdmUgYmVlbiByZWNpdmVkLlxuICovXG52YXIgVG9waWMgPSBmdW5jdGlvbihuYW1lLCBjYWxsYmFja3MpIHtcbiAgLy8gUGFyZW50IFRpbm9kZSBvYmplY3QuXG4gIHRoaXMuX3Rpbm9kZSA9IG51bGw7XG5cbiAgLy8gU2VydmVyLXByb3ZpZGVkIGRhdGEsIGxvY2FsbHkgaW1tdXRhYmxlLlxuICAvLyB0b3BpYyBuYW1lXG4gIHRoaXMubmFtZSA9IG5hbWU7XG4gIC8vIHRpbWVzdGFtcCB3aGVuIHRoZSB0b3BpYyB3YXMgY3JlYXRlZFxuICB0aGlzLmNyZWF0ZWQgPSBudWxsO1xuICAvLyB0aW1lc3RhbXAgd2hlbiB0aGUgdG9waWMgd2FzIGxhc3QgdXBkYXRlZFxuICB0aGlzLnVwZGF0ZWQgPSBudWxsO1xuICAvLyB0aW1lc3RhbXAgb2YgdGhlIGxhc3QgbWVzc2FnZXNcbiAgdGhpcy50b3VjaGVkID0gbnVsbDtcbiAgLy8gYWNjZXNzIG1vZGUsIHNlZSBBY2Nlc3NNb2RlXG4gIHRoaXMuYWNzID0gbmV3IEFjY2Vzc01vZGUobnVsbCk7XG4gIC8vIHBlci10b3BpYyBwcml2YXRlIGRhdGFcbiAgdGhpcy5wcml2YXRlID0gbnVsbDtcbiAgLy8gcGVyLXRvcGljIHB1YmxpYyBkYXRhXG4gIHRoaXMucHVibGljID0gbnVsbDtcblxuICAvLyBMb2NhbGx5IGNhY2hlZCBkYXRhXG4gIC8vIFN1YnNjcmliZWQgdXNlcnMsIGZvciB0cmFja2luZyByZWFkL3JlY3YvbXNnIG5vdGlmaWNhdGlvbnMuXG4gIHRoaXMuX3VzZXJzID0ge307XG5cbiAgLy8gQ3VycmVudCB2YWx1ZSBvZiBsb2NhbGx5IGlzc3VlZCBzZXFJZCwgdXNlZCBmb3IgcGVuZGluZyBtZXNzYWdlcy5cbiAgdGhpcy5fcXVldWVkU2VxSWQgPSBMT0NBTF9TRVFJRDtcblxuICAvLyBUaGUgbWF4aW11bSBrbm93biB7ZGF0YS5zZXF9IHZhbHVlLlxuICB0aGlzLl9tYXhTZXEgPSAwO1xuICAvLyBUaGUgbWluaW11bSBrbm93biB7ZGF0YS5zZXF9IHZhbHVlLlxuICB0aGlzLl9taW5TZXEgPSAwO1xuICAvLyBJbmRpY2F0b3IgdGhhdCB0aGUgbGFzdCByZXF1ZXN0IGZvciBlYXJsaWVyIG1lc3NhZ2VzIHJldHVybmVkIDAuXG4gIHRoaXMuX25vRWFybGllck1zZ3MgPSBmYWxzZTtcbiAgLy8gVGhlIG1heGltdW0ga25vd24gZGVsZXRpb24gSUQuXG4gIHRoaXMuX21heERlbCA9IDA7XG4gIC8vIFVzZXIgZGlzY292ZXJ5IHRhZ3NcbiAgdGhpcy5fdGFncyA9IFtdO1xuICAvLyBDcmVkZW50aWFscyBzdWNoIGFzIGVtYWlsIG9yIHBob25lIG51bWJlci5cbiAgdGhpcy5fY3JlZGVudGlhbHMgPSBbXTtcbiAgLy8gTWVzc2FnZSBjYWNoZSwgc29ydGVkIGJ5IG1lc3NhZ2Ugc2VxIHZhbHVlcywgZnJvbSBvbGQgdG8gbmV3LlxuICB0aGlzLl9tZXNzYWdlcyA9IENCdWZmZXIoZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiBhLnNlcSAtIGIuc2VxO1xuICB9LCB0cnVlKTtcbiAgLy8gQm9vbGVhbiwgdHJ1ZSBpZiB0aGUgdG9waWMgaXMgY3VycmVudGx5IGxpdmVcbiAgdGhpcy5fc3Vic2NyaWJlZCA9IGZhbHNlO1xuICAvLyBUaW1lc3RhcCB3aGVuIHRvcGljIG1ldGEtZGVzYyB1cGRhdGUgd2FzIHJlY2l2ZWQuXG4gIHRoaXMuX2xhc3REZXNjVXBkYXRlID0gbnVsbDtcbiAgLy8gVGltZXN0YXAgd2hlbiB0b3BpYyBtZXRhLXN1YnMgdXBkYXRlIHdhcyByZWNpdmVkLlxuICB0aGlzLl9sYXN0U3Vic1VwZGF0ZSA9IG51bGw7XG4gIC8vIFRvcGljIGNyZWF0ZWQgYnV0IG5vdCB5ZXQgc3luY2VkIHdpdGggdGhlIHNlcnZlci4gVXNlZCBvbmx5IGR1cmluZyBpbml0aWFsaXphdGlvbi5cbiAgdGhpcy5fbmV3ID0gdHJ1ZTtcblxuICAvLyBDYWxsYmFja3NcbiAgaWYgKGNhbGxiYWNrcykge1xuICAgIHRoaXMub25EYXRhID0gY2FsbGJhY2tzLm9uRGF0YTtcbiAgICB0aGlzLm9uTWV0YSA9IGNhbGxiYWNrcy5vbk1ldGE7XG4gICAgdGhpcy5vblByZXMgPSBjYWxsYmFja3Mub25QcmVzO1xuICAgIHRoaXMub25JbmZvID0gY2FsbGJhY2tzLm9uSW5mbztcbiAgICAvLyBBIHNpbmdsZSBkZXNjIHVwZGF0ZTtcbiAgICB0aGlzLm9uTWV0YURlc2MgPSBjYWxsYmFja3Mub25NZXRhRGVzYztcbiAgICAvLyBBIHNpbmdsZSBzdWJzY3JpcHRpb24gcmVjb3JkO1xuICAgIHRoaXMub25NZXRhU3ViID0gY2FsbGJhY2tzLm9uTWV0YVN1YjtcbiAgICAvLyBBbGwgc3Vic2NyaXB0aW9uIHJlY29yZHMgcmVjZWl2ZWQ7XG4gICAgdGhpcy5vblN1YnNVcGRhdGVkID0gY2FsbGJhY2tzLm9uU3Vic1VwZGF0ZWQ7XG4gICAgdGhpcy5vblRhZ3NVcGRhdGVkID0gY2FsbGJhY2tzLm9uVGFnc1VwZGF0ZWQ7XG4gICAgdGhpcy5vbkNyZWRzVXBkYXRlZCA9IGNhbGxiYWNscy5vbkNyZWRzVXBkYXRlZDtcbiAgICB0aGlzLm9uRGVsZXRlVG9waWMgPSBjYWxsYmFja3Mub25EZWxldGVUb3BpYztcbiAgICB0aGlzLm9uQWxsTWVzc2FnZXNSZWNlaXZlZCA9IGNhbGxiYWNrcy5vbkFsbE1lc3NhZ2VzUmVjZWl2ZWQ7XG4gIH1cbn07XG5cblRvcGljLnByb3RvdHlwZSA9IHtcbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSB0b3BpYyBpcyBzdWJzY3JpYmVkLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpcyB0b3BpYyBpcyBhdHRhY2hlZC9zdWJzY3JpYmVkLCBmYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICBpc1N1YnNjcmliZWQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9zdWJzY3JpYmVkO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZXF1ZXN0IHRvcGljIHRvIHN1YnNjcmliZS4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNzdWJzY3JpYmV9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5HZXRRdWVyeT19IGdldFBhcmFtcyAtIGdldCBxdWVyeSBwYXJhbWV0ZXJzLlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5TZXRQYXJhbXM9fSBzZXRQYXJhbXMgLSBzZXQgcGFyYW1ldGVycy5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHRoZSByZXF1ZXN0LlxuICAgKi9cbiAgc3Vic2NyaWJlOiBmdW5jdGlvbihnZXRQYXJhbXMsIHNldFBhcmFtcykge1xuICAgIC8vIElmIHRoZSB0b3BpYyBpcyBhbHJlYWR5IHN1YnNjcmliZWQsIHJldHVybiByZXNvbHZlZCBwcm9taXNlXG4gICAgaWYgKHRoaXMuX3N1YnNjcmliZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcyk7XG4gICAgfVxuXG4gICAgLy8gU2VuZCBzdWJzY3JpYmUgbWVzc2FnZSwgaGFuZGxlIGFzeW5jIHJlc3BvbnNlLlxuICAgIC8vIElmIHRvcGljIG5hbWUgaXMgZXhwbGljaXRseSBwcm92aWRlZCwgdXNlIGl0LiBJZiBubyBuYW1lLCB0aGVuIGl0J3MgYSBuZXcgZ3JvdXAgdG9waWMsXG4gICAgLy8gdXNlIFwibmV3XCIuXG4gICAgcmV0dXJuIHRoaXMuX3Rpbm9kZS5zdWJzY3JpYmUodGhpcy5uYW1lIHx8IFRPUElDX05FVywgZ2V0UGFyYW1zLCBzZXRQYXJhbXMpLnRoZW4oKGN0cmwpID0+IHtcbiAgICAgIGlmIChjdHJsLmNvZGUgPj0gMzAwKSB7XG4gICAgICAgIC8vIERvIG5vdGhpbmcgZmYgdGhlIHRvcGljIGlzIGFscmVhZHkgc3Vic2NyaWJlZCB0by5cbiAgICAgICAgcmV0dXJuIGN0cmw7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3N1YnNjcmliZWQgPSB0cnVlO1xuICAgICAgdGhpcy5hY3MgPSAoY3RybC5wYXJhbXMgJiYgY3RybC5wYXJhbXMuYWNzKSA/IGN0cmwucGFyYW1zLmFjcyA6IHRoaXMuYWNzO1xuXG4gICAgICAvLyBTZXQgdG9waWMgbmFtZSBmb3IgbmV3IHRvcGljcyBhbmQgYWRkIGl0IHRvIGNhY2hlLlxuICAgICAgaWYgKHRoaXMuX25ldykge1xuICAgICAgICB0aGlzLl9uZXcgPSBmYWxzZTtcblxuICAgICAgICAvLyBOYW1lIG1heSBjaGFuZ2UgbmV3MTIzNDU2IC0+IGdycEFiQ2RFZlxuICAgICAgICB0aGlzLm5hbWUgPSBjdHJsLnRvcGljO1xuXG4gICAgICAgIHRoaXMuY3JlYXRlZCA9IGN0cmwudHM7XG4gICAgICAgIHRoaXMudXBkYXRlZCA9IGN0cmwudHM7XG4gICAgICAgIC8vIERvbid0IGFzc2lnbiB0b3VjaGVkLCBvdGhlcndpc2UgdG9waWMgd2lsbCBiZSBwdXQgb24gdG9wIG9mIHRoZSBsaXN0IG9uIHN1YnNjcmliZS5cblxuICAgICAgICB0aGlzLl9jYWNoZVB1dFNlbGYoKTtcblxuICAgICAgICBpZiAodGhpcy5uYW1lICE9IFRPUElDX01FICYmIHRoaXMubmFtZSAhPSBUT1BJQ19GTkQpIHtcbiAgICAgICAgICAvLyBBZGQgdGhlIG5ldyB0b3BpYyB0byB0aGUgbGlzdCBvZiBjb250YWN0cyBtYWludGFpbmVkIGJ5IHRoZSAnbWUnIHRvcGljLlxuICAgICAgICAgIGNvbnN0IG1lID0gdGhpcy5fdGlub2RlLmdldE1lVG9waWMoKTtcbiAgICAgICAgICBpZiAobWUpIHtcbiAgICAgICAgICAgIG1lLl9wcm9jZXNzTWV0YVN1Yihbe1xuICAgICAgICAgICAgICBfbm9Gb3J3YXJkaW5nOiB0cnVlLFxuICAgICAgICAgICAgICB0b3BpYzogdGhpcy5uYW1lLFxuICAgICAgICAgICAgICBjcmVhdGVkOiBjdHJsLnRzLFxuICAgICAgICAgICAgICB1cGRhdGVkOiBjdHJsLnRzLFxuICAgICAgICAgICAgICBhY3M6IHRoaXMuYWNzXG4gICAgICAgICAgICB9XSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNldFBhcmFtcyAmJiBzZXRQYXJhbXMuZGVzYykge1xuICAgICAgICAgIHNldFBhcmFtcy5kZXNjLl9ub0ZvcndhcmRpbmcgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuX3Byb2Nlc3NNZXRhRGVzYyhzZXRQYXJhbXMuZGVzYyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGN0cmw7XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIGRyYWZ0IG9mIGEgbWVzc2FnZSB3aXRob3V0IHNlbmRpbmcgaXQgdG8gdGhlIHNlcnZlci5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmcgfCBPYmplY3R9IGRhdGEgLSBDb250ZW50IHRvIHdyYXAgaW4gYSBkcmFmdC5cbiAgICogQHBhcmFtIHtCb29sZWFuPX0gbm9FY2hvIC0gSWYgPHR0PnRydWU8L3R0PiBzZXJ2ZXIgd2lsbCBub3QgZWNobyBtZXNzYWdlIGJhY2sgdG8gb3JpZ2luYXRpbmdcbiAgICogc2Vzc2lvbi4gT3RoZXJ3aXNlIHRoZSBzZXJ2ZXIgd2lsbCBzZW5kIGEgY29weSBvZiB0aGUgbWVzc2FnZSB0byBzZW5kZXIuXG4gICAqXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IG1lc3NhZ2UgZHJhZnQuXG4gICAqL1xuICBjcmVhdGVNZXNzYWdlOiBmdW5jdGlvbihkYXRhLCBub0VjaG8pIHtcbiAgICByZXR1cm4gdGhpcy5fdGlub2RlLmNyZWF0ZU1lc3NhZ2UodGhpcy5uYW1lLCBkYXRhLCBub0VjaG8pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBJbW1lZGlhdGVseSBwdWJsaXNoIGRhdGEgdG8gdG9waWMuIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjcHVibGlzaH0uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgT2JqZWN0fSBkYXRhIC0gRGF0YSB0byBwdWJsaXNoLCBlaXRoZXIgcGxhaW4gc3RyaW5nIG9yIGEgRHJhZnR5IG9iamVjdC5cbiAgICogQHBhcmFtIHtCb29sZWFuPX0gbm9FY2hvIC0gSWYgPHR0PnRydWU8L3R0PiBzZXJ2ZXIgd2lsbCBub3QgZWNobyBtZXNzYWdlIGJhY2sgdG8gb3JpZ2luYXRpbmdcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHRoZSByZXF1ZXN0LlxuICAgKi9cbiAgcHVibGlzaDogZnVuY3Rpb24oZGF0YSwgbm9FY2hvKSB7XG4gICAgcmV0dXJuIHRoaXMucHVibGlzaE1lc3NhZ2UodGhpcy5jcmVhdGVNZXNzYWdlKGRhdGEsIG5vRWNobykpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBQdWJsaXNoIG1lc3NhZ2UgY3JlYXRlZCBieSB7QGxpbmsgVGlub2RlLlRvcGljI2NyZWF0ZU1lc3NhZ2V9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcHViIC0ge2RhdGF9IG9iamVjdCB0byBwdWJsaXNoLiBNdXN0IGJlIGNyZWF0ZWQgYnkge0BsaW5rIFRpbm9kZS5Ub3BpYyNjcmVhdGVNZXNzYWdlfVxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gdGhlIHJlcXVlc3QuXG4gICAqL1xuICBwdWJsaXNoTWVzc2FnZTogZnVuY3Rpb24ocHViKSB7XG4gICAgaWYgKCF0aGlzLl9zdWJzY3JpYmVkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiQ2Fubm90IHB1Ymxpc2ggb24gaW5hY3RpdmUgdG9waWNcIikpO1xuICAgIH1cblxuICAgIC8vIFVwZGF0ZSBoZWFkZXIgd2l0aCBhdHRhY2htZW50IHJlY29yZHMuXG4gICAgaWYgKERyYWZ0eS5oYXNBdHRhY2htZW50cyhwdWIuY29udGVudCkgJiYgIXB1Yi5oZWFkLmF0dGFjaG1lbnRzKSB7XG4gICAgICBsZXQgYXR0YWNobWVudHMgPSBbXTtcbiAgICAgIERyYWZ0eS5hdHRhY2htZW50cyhwdWIuY29udGVudCwgKGRhdGEpID0+IHtcbiAgICAgICAgYXR0YWNobWVudHMucHVzaChkYXRhLnJlZik7XG4gICAgICB9KTtcbiAgICAgIHB1Yi5oZWFkLmF0dGFjaG1lbnRzID0gYXR0YWNobWVudHM7XG4gICAgfVxuXG4gICAgLy8gU2VuZCBkYXRhLlxuICAgIHB1Yi5fc2VuZGluZyA9IHRydWU7XG4gICAgcHViLl9mYWlsZWQgPSBmYWxzZTtcbiAgICByZXR1cm4gdGhpcy5fdGlub2RlLnB1Ymxpc2hNZXNzYWdlKHB1YikudGhlbigoY3RybCkgPT4ge1xuICAgICAgcHViLl9zZW5kaW5nID0gZmFsc2U7XG4gICAgICBwdWIudHMgPSBjdHJsLnRzO1xuICAgICAgdGhpcy5zd2FwTWVzc2FnZUlkKHB1YiwgY3RybC5wYXJhbXMuc2VxKTtcbiAgICAgIHRoaXMuX3JvdXRlRGF0YShwdWIpO1xuICAgICAgcmV0dXJuIGN0cmw7XG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgdGhpcy5fdGlub2RlLmxvZ2dlcihcIldBUk5JTkc6IE1lc3NhZ2UgcmVqZWN0ZWQgYnkgdGhlIHNlcnZlclwiLCBlcnIpO1xuICAgICAgcHViLl9zZW5kaW5nID0gZmFsc2U7XG4gICAgICBwdWIuX2ZhaWxlZCA9IHRydWU7XG4gICAgICBpZiAodGhpcy5vbkRhdGEpIHtcbiAgICAgICAgdGhpcy5vbkRhdGEoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogQWRkIG1lc3NhZ2UgdG8gbG9jYWwgbWVzc2FnZSBjYWNoZSwgc2VuZCB0byB0aGUgc2VydmVyIHdoZW4gdGhlIHByb21pc2UgaXMgcmVzb2x2ZWQuXG4gICAqIElmIHByb21pc2UgaXMgbnVsbCBvciB1bmRlZmluZWQsIHRoZSBtZXNzYWdlIHdpbGwgYmUgc2VudCBpbW1lZGlhdGVseS5cbiAgICogVGhlIG1lc3NhZ2UgaXMgc2VudCB3aGVuIHRoZVxuICAgKiBUaGUgbWVzc2FnZSBzaG91bGQgYmUgY3JlYXRlZCBieSB7QGxpbmsgVGlub2RlLlRvcGljI2NyZWF0ZU1lc3NhZ2V9LlxuICAgKiBUaGlzIGlzIHByb2JhYmx5IG5vdCB0aGUgZmluYWwgQVBJLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcHViIC0gTWVzc2FnZSB0byB1c2UgYXMgYSBkcmFmdC5cbiAgICogQHBhcmFtIHtQcm9taXNlfSBwcm9tIC0gTWVzc2FnZSB3aWxsIGJlIHNlbnQgd2hlbiB0aGlzIHByb21pc2UgaXMgcmVzb2x2ZWQsIGRpc2NhcmRlZCBpZiByZWplY3RlZC5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IGRlcml2ZWQgcHJvbWlzZS5cbiAgICovXG4gIHB1Ymxpc2hEcmFmdDogZnVuY3Rpb24ocHViLCBwcm9tKSB7XG4gICAgaWYgKCFwcm9tICYmICF0aGlzLl9zdWJzY3JpYmVkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiQ2Fubm90IHB1Ymxpc2ggb24gaW5hY3RpdmUgdG9waWNcIikpO1xuICAgIH1cblxuICAgIGNvbnN0IHNlcSA9IHB1Yi5zZXEgfHwgdGhpcy5fZ2V0UXVldWVkU2VxSWQoKTtcbiAgICBpZiAoIXB1Yi5fbm9Gb3J3YXJkaW5nKSB7XG4gICAgICAvLyBUaGUgJ3NlcScsICd0cycsIGFuZCAnZnJvbScgYXJlIGFkZGVkIHRvIG1pbWljIHtkYXRhfS4gVGhleSBhcmUgcmVtb3ZlZCBsYXRlclxuICAgICAgLy8gYmVmb3JlIHRoZSBtZXNzYWdlIGlzIHNlbnQuXG5cbiAgICAgIHB1Yi5fbm9Gb3J3YXJkaW5nID0gdHJ1ZTtcbiAgICAgIHB1Yi5zZXEgPSBzZXE7XG4gICAgICBwdWIudHMgPSBuZXcgRGF0ZSgpO1xuICAgICAgcHViLmZyb20gPSB0aGlzLl90aW5vZGUuZ2V0Q3VycmVudFVzZXJJRCgpO1xuXG4gICAgICAvLyBEb24ndCBuZWVkIGFuIGVjaG8gbWVzc2FnZSBiZWNhdXNlIHRoZSBtZXNzYWdlIGlzIGFkZGVkIHRvIGxvY2FsIGNhY2hlIHJpZ2h0IGF3YXkuXG4gICAgICBwdWIubm9lY2hvID0gdHJ1ZTtcbiAgICAgIC8vIEFkZCB0byBjYWNoZS5cbiAgICAgIHRoaXMuX21lc3NhZ2VzLnB1dChwdWIpO1xuXG4gICAgICBpZiAodGhpcy5vbkRhdGEpIHtcbiAgICAgICAgdGhpcy5vbkRhdGEocHViKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gSWYgcHJvbWlzZSBpcyBwcm92aWRlZCwgc2VuZCB0aGUgcXVldWVkIG1lc3NhZ2Ugd2hlbiBpdCdzIHJlc29sdmVkLlxuICAgIC8vIElmIG5vIHByb21pc2UgaXMgcHJvdmlkZWQsIGNyZWF0ZSBhIHJlc29sdmVkIG9uZSBhbmQgc2VuZCBpbW1lZGlhdGVseS5cbiAgICBwcm9tID0gKHByb20gfHwgUHJvbWlzZS5yZXNvbHZlKCkpLnRoZW4oXG4gICAgICAoIC8qIGFyZ3VtZW50IGlnbm9yZWQgKi8gKSA9PiB7XG4gICAgICAgIGlmIChwdWIuX2NhbmNlbGxlZCkge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb2RlOiAzMDAsXG4gICAgICAgICAgICB0ZXh0OiBcImNhbmNlbGxlZFwiXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLnB1Ymxpc2hNZXNzYWdlKHB1Yik7XG4gICAgICB9LFxuICAgICAgKGVycikgPT4ge1xuICAgICAgICB0aGlzLl90aW5vZGUubG9nZ2VyKFwiV0FSTklORzogTWVzc2FnZSBkcmFmdCByZWplY3RlZCBieSB0aGUgc2VydmVyXCIsIGVycik7XG4gICAgICAgIHB1Yi5fc2VuZGluZyA9IGZhbHNlO1xuICAgICAgICBwdWIuX2ZhaWxlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuX21lc3NhZ2VzLmRlbEF0KHRoaXMuX21lc3NhZ2VzLmZpbmQocHViKSk7XG4gICAgICAgIGlmICh0aGlzLm9uRGF0YSkge1xuICAgICAgICAgIHRoaXMub25EYXRhKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIHJldHVybiBwcm9tO1xuICB9LFxuXG4gIC8qKlxuICAgKiBMZWF2ZSB0aGUgdG9waWMsIG9wdGlvbmFsbHkgdW5zaWJzY3JpYmUuIExlYXZpbmcgdGhlIHRvcGljIG1lYW5zIHRoZSB0b3BpYyB3aWxsIHN0b3BcbiAgICogcmVjZWl2aW5nIHVwZGF0ZXMgZnJvbSB0aGUgc2VydmVyLiBVbnN1YnNjcmliaW5nIHdpbGwgdGVybWluYXRlIHVzZXIncyByZWxhdGlvbnNoaXAgd2l0aCB0aGUgdG9waWMuXG4gICAqIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjbGVhdmV9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge0Jvb2xlYW49fSB1bnN1YiAtIElmIHRydWUsIHVuc3Vic2NyaWJlLCBvdGhlcndpc2UganVzdCBsZWF2ZS5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHRoZSByZXF1ZXN0LlxuICAgKi9cbiAgbGVhdmU6IGZ1bmN0aW9uKHVuc3ViKSB7XG4gICAgLy8gSXQncyBwb3NzaWJsZSB0byB1bnN1YnNjcmliZSAodW5zdWI9PXRydWUpIGZyb20gaW5hY3RpdmUgdG9waWMuXG4gICAgaWYgKCF0aGlzLl9zdWJzY3JpYmVkICYmICF1bnN1Yikge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkNhbm5vdCBsZWF2ZSBpbmFjdGl2ZSB0b3BpY1wiKSk7XG4gICAgfVxuXG4gICAgLy8gU2VuZCBhICdsZWF2ZScgbWVzc2FnZSwgaGFuZGxlIGFzeW5jIHJlc3BvbnNlXG4gICAgcmV0dXJuIHRoaXMuX3Rpbm9kZS5sZWF2ZSh0aGlzLm5hbWUsIHVuc3ViKS50aGVuKChjdHJsKSA9PiB7XG4gICAgICB0aGlzLl9yZXNldFN1YigpO1xuICAgICAgaWYgKHVuc3ViKSB7XG4gICAgICAgIHRoaXMuX2dvbmUoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjdHJsO1xuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZXF1ZXN0IHRvcGljIG1ldGFkYXRhIGZyb20gdGhlIHNlcnZlci5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtUaW5vZGUuR2V0UXVlcnl9IHJlcXVlc3QgcGFyYW1ldGVyc1xuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gcmVxdWVzdC5cbiAgICovXG4gIGdldE1ldGE6IGZ1bmN0aW9uKHBhcmFtcykge1xuICAgIC8vIFNlbmQge2dldH0gbWVzc2FnZSwgcmV0dXJuIHByb21pc2UuXG4gICAgcmV0dXJuIHRoaXMuX3Rpbm9kZS5nZXRNZXRhKHRoaXMubmFtZSwgcGFyYW1zKTtcbiAgfSxcblxuICAvKipcbiAgICogUmVxdWVzdCBtb3JlIG1lc3NhZ2VzIGZyb20gdGhlIHNlcnZlclxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge2ludGVnZXJ9IGxpbWl0IG51bWJlciBvZiBtZXNzYWdlcyB0byBnZXQuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gZm9yd2FyZCBpZiB0cnVlLCByZXF1ZXN0IG5ld2VyIG1lc3NhZ2VzLlxuICAgKi9cbiAgZ2V0TWVzc2FnZXNQYWdlOiBmdW5jdGlvbihsaW1pdCwgZm9yd2FyZCkge1xuICAgIGNvbnN0IHF1ZXJ5ID0gdGhpcy5zdGFydE1ldGFRdWVyeSgpO1xuICAgIGlmIChmb3J3YXJkKSB7XG4gICAgICBxdWVyeS53aXRoTGF0ZXJEYXRhKGxpbWl0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcXVlcnkud2l0aEVhcmxpZXJEYXRhKGxpbWl0KTtcbiAgICB9XG4gICAgbGV0IHByb21pc2UgPSB0aGlzLmdldE1ldGEocXVlcnkuYnVpbGQoKSk7XG4gICAgaWYgKCFmb3J3YXJkKSB7XG4gICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChjdHJsKSA9PiB7XG4gICAgICAgIGlmIChjdHJsICYmIGN0cmwucGFyYW1zICYmICFjdHJsLnBhcmFtcy5jb3VudCkge1xuICAgICAgICAgIHRoaXMuX25vRWFybGllck1zZ3MgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFVwZGF0ZSB0b3BpYyBtZXRhZGF0YS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtUaW5vZGUuU2V0UGFyYW1zfSBwYXJhbXMgcGFyYW1ldGVycyB0byB1cGRhdGUuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byByZXF1ZXN0LlxuICAgKi9cbiAgc2V0TWV0YTogZnVuY3Rpb24ocGFyYW1zKSB7XG4gICAgaWYgKHBhcmFtcy50YWdzKSB7XG4gICAgICBwYXJhbXMudGFncyA9IG5vcm1hbGl6ZUFycmF5KHBhcmFtcy50YWdzKTtcbiAgICB9XG4gICAgLy8gU2VuZCBTZXQgbWVzc2FnZSwgaGFuZGxlIGFzeW5jIHJlc3BvbnNlLlxuICAgIHJldHVybiB0aGlzLl90aW5vZGUuc2V0TWV0YSh0aGlzLm5hbWUsIHBhcmFtcylcbiAgICAgIC50aGVuKChjdHJsKSA9PiB7XG4gICAgICAgIGlmIChjdHJsICYmIGN0cmwuY29kZSA+PSAzMDApIHtcbiAgICAgICAgICAvLyBOb3QgbW9kaWZpZWRcbiAgICAgICAgICByZXR1cm4gY3RybDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwYXJhbXMuc3ViKSB7XG4gICAgICAgICAgaWYgKGN0cmwucGFyYW1zICYmIGN0cmwucGFyYW1zLmFjcykge1xuICAgICAgICAgICAgcGFyYW1zLnN1Yi5hY3MgPSBjdHJsLnBhcmFtcy5hY3M7XG4gICAgICAgICAgICBwYXJhbXMuc3ViLnVwZGF0ZWQgPSBjdHJsLnRzO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghcGFyYW1zLnN1Yi51c2VyKSB7XG4gICAgICAgICAgICAvLyBUaGlzIGlzIGEgc3Vic2NyaXB0aW9uIHVwZGF0ZSBvZiB0aGUgY3VycmVudCB1c2VyLlxuICAgICAgICAgICAgLy8gQXNzaWduIHVzZXIgSUQgb3RoZXJ3aXNlIHRoZSB1cGRhdGUgd2lsbCBiZSBpZ25vcmVkIGJ5IF9wcm9jZXNzTWV0YVN1Yi5cbiAgICAgICAgICAgIHBhcmFtcy5zdWIudXNlciA9IHRoaXMuX3Rpbm9kZS5nZXRDdXJyZW50VXNlcklEKCk7XG4gICAgICAgICAgICBpZiAoIXBhcmFtcy5kZXNjKSB7XG4gICAgICAgICAgICAgIC8vIEZvcmNlIHVwZGF0ZSB0byB0b3BpYydzIGFzYy5cbiAgICAgICAgICAgICAgcGFyYW1zLmRlc2MgPSB7fTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcGFyYW1zLnN1Yi5fbm9Gb3J3YXJkaW5nID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLl9wcm9jZXNzTWV0YVN1YihbcGFyYW1zLnN1Yl0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBhcmFtcy5kZXNjKSB7XG4gICAgICAgICAgaWYgKGN0cmwucGFyYW1zICYmIGN0cmwucGFyYW1zLmFjcykge1xuICAgICAgICAgICAgcGFyYW1zLmRlc2MuYWNzID0gY3RybC5wYXJhbXMuYWNzO1xuICAgICAgICAgICAgcGFyYW1zLmRlc2MudXBkYXRlZCA9IGN0cmwudHM7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuX3Byb2Nlc3NNZXRhRGVzYyhwYXJhbXMuZGVzYyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGFyYW1zLnRhZ3MpIHtcbiAgICAgICAgICB0aGlzLl9wcm9jZXNzTWV0YVRhZ3MocGFyYW1zLnRhZ3MpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYXJhbXMuY3JlZCkge1xuICAgICAgICAgIHRoaXMuX3Byb2Nlc3NNZXRhQ3JlZHMoW3BhcmFtcy5jcmVkXSwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY3RybDtcbiAgICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBVcGRhdGUgYWNjZXNzIG1vZGUgb2YgdGhlIGN1cnJlbnQgdXNlciBvciBvZiBhbm90aGVyIHRvcGljIHN1YnNyaWJlci5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVpZCAtIFVJRCBvZiB0aGUgdXNlciB0byB1cGRhdGUgb3IgbnVsbCB0byB1cGRhdGUgY3VycmVudCB1c2VyLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXBkYXRlIC0gdGhlIHVwZGF0ZSB2YWx1ZSwgZnVsbCBvciBkZWx0YS5cbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdG8gYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHJlcXVlc3QuXG4gICAqL1xuICB1cGRhdGVNb2RlOiBmdW5jdGlvbih1aWQsIHVwZGF0ZSkge1xuICAgIGNvbnN0IHVzZXIgPSB1aWQgPyB1c2VyID0gdGhpcy5zdWJzY3JpYmVyKHVpZCkgOiBudWxsO1xuICAgIGxldCBhbTtcbiAgICBpZiAodXNlcikge1xuICAgICAgYW0gPSB1c2VyLmFjcy51cGRhdGVHaXZlbih1cGRhdGUpLmdldEdpdmVuKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFtID0gdG9waWMuZ2V0QWNjZXNzTW9kZSgpLnVwZGF0ZVdhbnQodXBkYXRlKS5nZXRXYW50KCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRvcGljLnNldE1ldGEoe1xuICAgICAgc3ViOiB7XG4gICAgICAgIHVzZXI6IHVpZCxcbiAgICAgICAgbW9kZTogYW1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogQ3JlYXRlIG5ldyB0b3BpYyBzdWJzY3JpcHRpb24uIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjc2V0TWV0YX0uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB1aWQgLSBJRCBvZiB0aGUgdXNlciB0byBpbnZpdGVcbiAgICogQHBhcmFtIHtTdHJpbmc9fSBtb2RlIC0gQWNjZXNzIG1vZGUuIDx0dD5udWxsPC90dD4gbWVhbnMgdG8gdXNlIGRlZmF1bHQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byByZXF1ZXN0LlxuICAgKi9cbiAgaW52aXRlOiBmdW5jdGlvbih1aWQsIG1vZGUpIHtcbiAgICByZXR1cm4gdGhpcy5zZXRNZXRhKHtcbiAgICAgIHN1Yjoge1xuICAgICAgICB1c2VyOiB1aWQsXG4gICAgICAgIG1vZGU6IG1vZGVcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogQXJjaGl2ZSBvciB1bi1hcmNoaXZlIHRoZSB0b3BpYy4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNzZXRNZXRhfS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtCb29sZWFufSBhcmNoIC0gdHJ1ZSB0byBhcmNoaXZlIHRoZSB0b3BpYywgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gcmVxdWVzdC5cbiAgICovXG4gIGFyY2hpdmU6IGZ1bmN0aW9uKGFyY2gpIHtcbiAgICBpZiAodGhpcy5wcml2YXRlICYmIHRoaXMucHJpdmF0ZS5hcmNoID09IGFyY2gpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoYXJjaCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNldE1ldGEoe1xuICAgICAgZGVzYzoge1xuICAgICAgICBwcml2YXRlOiB7XG4gICAgICAgICAgYXJjaDogYXJjaCA/IHRydWUgOiBUaW5vZGUuREVMX0NIQVJcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBEZWxldGUgbWVzc2FnZXMuIEhhcmQtZGVsZXRpbmcgbWVzc2FnZXMgcmVxdWlyZXMgT3duZXIgcGVybWlzc2lvbi5cbiAgICogV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNkZWxNZXNzYWdlc30uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7VGlub2RlLkRlbFJhbmdlW119IHJhbmdlcyAtIFJhbmdlcyBvZiBtZXNzYWdlIElEcyB0byBkZWxldGUuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbj19IGhhcmQgLSBIYXJkIG9yIHNvZnQgZGVsZXRlXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byByZXF1ZXN0LlxuICAgKi9cbiAgZGVsTWVzc2FnZXM6IGZ1bmN0aW9uKHJhbmdlcywgaGFyZCkge1xuICAgIGlmICghdGhpcy5fc3Vic2NyaWJlZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkNhbm5vdCBkZWxldGUgbWVzc2FnZXMgaW4gaW5hY3RpdmUgdG9waWNcIikpO1xuICAgIH1cblxuICAgIC8vIFNvcnQgcmFuZ2VzIGluIGFjY2VuZGluZyBvcmRlciBieSBsb3csIHRoZSBkZXNjZW5kaW5nIGJ5IGhpLlxuICAgIHJhbmdlcy5zb3J0KChyMSwgcjIpID0+IHtcbiAgICAgIGlmIChyMS5sb3cgPCByMi5sb3cpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBpZiAocjEubG93ID09IHIyLmxvdykge1xuICAgICAgICByZXR1cm4gIXIyLmhpIHx8IChyMS5oaSA+PSByMi5oaSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG5cbiAgICAvLyBSZW1vdmUgcGVuZGluZyBtZXNzYWdlcyBmcm9tIHJhbmdlcyBwb3NzaWJseSBjbGlwcGluZyBzb21lIHJhbmdlcy5cbiAgICBsZXQgdG9zZW5kID0gcmFuZ2VzLnJlZHVjZSgob3V0LCByKSA9PiB7XG4gICAgICBpZiAoci5sb3cgPCBMT0NBTF9TRVFJRCkge1xuICAgICAgICBpZiAoIXIuaGkgfHwgci5oaSA8IExPQ0FMX1NFUUlEKSB7XG4gICAgICAgICAgb3V0LnB1c2gocik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gQ2xpcCBoaSB0byBtYXggYWxsb3dlZCB2YWx1ZS5cbiAgICAgICAgICBvdXQucHVzaCh7XG4gICAgICAgICAgICBsb3c6IHIubG93LFxuICAgICAgICAgICAgaGk6IHRoaXMuX21heFNlcSArIDFcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG91dDtcbiAgICB9LCBbXSk7XG5cbiAgICAvLyBTZW5kIHtkZWx9IG1lc3NhZ2UsIHJldHVybiBwcm9taXNlXG4gICAgbGV0IHJlc3VsdDtcbiAgICBpZiAodG9zZW5kLmxlbmd0aCA+IDApIHtcbiAgICAgIHJlc3VsdCA9IHRoaXMuX3Rpbm9kZS5kZWxNZXNzYWdlcyh0aGlzLm5hbWUsIHRvc2VuZCwgaGFyZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdCA9IFByb21pc2UucmVzb2x2ZSh7XG4gICAgICAgIHBhcmFtczoge1xuICAgICAgICAgIGRlbDogMFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgLy8gVXBkYXRlIGxvY2FsIGNhY2hlLlxuICAgIHJldHVybiByZXN1bHQudGhlbigoY3RybCkgPT4ge1xuICAgICAgaWYgKGN0cmwucGFyYW1zLmRlbCA+IHRoaXMuX21heERlbCkge1xuICAgICAgICB0aGlzLl9tYXhEZWwgPSBjdHJsLnBhcmFtcy5kZWw7XG4gICAgICB9XG5cbiAgICAgIHJhbmdlcy5tYXAoKHIpID0+IHtcbiAgICAgICAgaWYgKHIuaGkpIHtcbiAgICAgICAgICB0aGlzLmZsdXNoTWVzc2FnZVJhbmdlKHIubG93LCByLmhpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmZsdXNoTWVzc2FnZShyLmxvdyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLl91cGRhdGVEZWxldGVkUmFuZ2VzKCk7XG5cbiAgICAgIGlmICh0aGlzLm9uRGF0YSkge1xuICAgICAgICAvLyBDYWxsaW5nIHdpdGggbm8gcGFyYW1ldGVycyB0byBpbmRpY2F0ZSB0aGUgbWVzc2FnZXMgd2VyZSBkZWxldGVkLlxuICAgICAgICB0aGlzLm9uRGF0YSgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGN0cmw7XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIERlbGV0ZSBhbGwgbWVzc2FnZXMuIEhhcmQtZGVsZXRpbmcgbWVzc2FnZXMgcmVxdWlyZXMgT3duZXIgcGVybWlzc2lvbi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBoYXJkRGVsIC0gdHJ1ZSBpZiBtZXNzYWdlcyBzaG91bGQgYmUgaGFyZC1kZWxldGVkLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gcmVxdWVzdC5cbiAgICovXG4gIGRlbE1lc3NhZ2VzQWxsOiBmdW5jdGlvbihoYXJkRGVsKSB7XG4gICAgaWYgKCF0aGlzLl9tYXhTZXEgfHwgdGhpcy5fbWF4U2VxIDw9IDApIHtcbiAgICAgIC8vIFRoZXJlIGFyZSBubyBtZXNzYWdlcyB0byBkZWxldGUuXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmRlbE1lc3NhZ2VzKFt7XG4gICAgICBsb3c6IDEsXG4gICAgICBoaTogdGhpcy5fbWF4U2VxICsgMSxcbiAgICAgIF9hbGw6IHRydWVcbiAgICB9XSwgaGFyZERlbCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIERlbGV0ZSBtdWx0aXBsZSBtZXNzYWdlcyBkZWZpbmVkIGJ5IHRoZWlyIElEcy4gSGFyZC1kZWxldGluZyBtZXNzYWdlcyByZXF1aXJlcyBPd25lciBwZXJtaXNzaW9uLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge1Rpbm9kZS5EZWxSYW5nZVtdfSBsaXN0IC0gbGlzdCBvZiBzZXEgSURzIHRvIGRlbGV0ZVxuICAgKiBAcGFyYW0ge0Jvb2xlYW49fSBoYXJkRGVsIC0gdHJ1ZSBpZiBtZXNzYWdlcyBzaG91bGQgYmUgaGFyZC1kZWxldGVkLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gcmVxdWVzdC5cbiAgICovXG4gIGRlbE1lc3NhZ2VzTGlzdDogZnVuY3Rpb24obGlzdCwgaGFyZERlbCkge1xuICAgIC8vIFNvcnQgdGhlIGxpc3QgaW4gYXNjZW5kaW5nIG9yZGVyXG4gICAgbGlzdC5zb3J0KChhLCBiKSA9PiBhIC0gYik7XG4gICAgLy8gQ29udmVydCB0aGUgYXJyYXkgb2YgSURzIHRvIHJhbmdlcy5cbiAgICBsZXQgcmFuZ2VzID0gbGlzdC5yZWR1Y2UoKG91dCwgaWQpID0+IHtcbiAgICAgIGlmIChvdXQubGVuZ3RoID09IDApIHtcbiAgICAgICAgLy8gRmlyc3QgZWxlbWVudC5cbiAgICAgICAgb3V0LnB1c2goe1xuICAgICAgICAgIGxvdzogaWRcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgcHJldiA9IG91dFtvdXQubGVuZ3RoIC0gMV07XG4gICAgICAgIGlmICgoIXByZXYuaGkgJiYgKGlkICE9IHByZXYubG93ICsgMSkpIHx8IChpZCA+IHByZXYuaGkpKSB7XG4gICAgICAgICAgLy8gTmV3IHJhbmdlLlxuICAgICAgICAgIG91dC5wdXNoKHtcbiAgICAgICAgICAgIGxvdzogaWRcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBFeHBhbmQgZXhpc3RpbmcgcmFuZ2UuXG4gICAgICAgICAgcHJldi5oaSA9IHByZXYuaGkgPyBNYXRoLm1heChwcmV2LmhpLCBpZCArIDEpIDogaWQgKyAxO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0O1xuICAgIH0sIFtdKTtcbiAgICAvLyBTZW5kIHtkZWx9IG1lc3NhZ2UsIHJldHVybiBwcm9taXNlXG4gICAgcmV0dXJuIHRoaXMuZGVsTWVzc2FnZXMocmFuZ2VzLCBoYXJkRGVsKVxuICB9LFxuXG4gIC8qKlxuICAgKiBEZWxldGUgdG9waWMuIFJlcXVpcmVzIE93bmVyIHBlcm1pc3Npb24uIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjZGVsVG9waWN9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0byBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gdGhlIHJlcXVlc3QuXG4gICAqL1xuICBkZWxUb3BpYzogZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgdG9waWMgPSB0aGlzO1xuICAgIHJldHVybiB0aGlzLl90aW5vZGUuZGVsVG9waWModGhpcy5uYW1lKS50aGVuKGZ1bmN0aW9uKGN0cmwpIHtcbiAgICAgIHRvcGljLl9yZXNldFN1YigpO1xuICAgICAgdG9waWMuX2dvbmUoKTtcbiAgICAgIHJldHVybiBjdHJsO1xuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBEZWxldGUgc3Vic2NyaXB0aW9uLiBSZXF1aXJlcyBTaGFyZSBwZXJtaXNzaW9uLiBXcmFwcGVyIGZvciB7QGxpbmsgVGlub2RlI2RlbFN1YnNjcmlwdGlvbn0uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB1c2VyIC0gSUQgb2YgdGhlIHVzZXIgdG8gcmVtb3ZlIHN1YnNjcmlwdGlvbiBmb3IuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byByZXF1ZXN0LlxuICAgKi9cbiAgZGVsU3Vic2NyaXB0aW9uOiBmdW5jdGlvbih1c2VyKSB7XG4gICAgaWYgKCF0aGlzLl9zdWJzY3JpYmVkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiQ2Fubm90IGRlbGV0ZSBzdWJzY3JpcHRpb24gaW4gaW5hY3RpdmUgdG9waWNcIikpO1xuICAgIH1cbiAgICAvLyBTZW5kIHtkZWx9IG1lc3NhZ2UsIHJldHVybiBwcm9taXNlXG4gICAgcmV0dXJuIHRoaXMuX3Rpbm9kZS5kZWxTdWJzY3JpcHRpb24odGhpcy5uYW1lLCB1c2VyKS50aGVuKChjdHJsKSA9PiB7XG4gICAgICAvLyBSZW1vdmUgdGhlIG9iamVjdCBmcm9tIHRoZSBzdWJzY3JpcHRpb24gY2FjaGU7XG4gICAgICBkZWxldGUgdGhpcy5fdXNlcnNbdXNlcl07XG4gICAgICAvLyBOb3RpZnkgbGlzdGVuZXJzXG4gICAgICBpZiAodGhpcy5vblN1YnNVcGRhdGVkKSB7XG4gICAgICAgIHRoaXMub25TdWJzVXBkYXRlZChPYmplY3Qua2V5cyh0aGlzLl91c2VycykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGN0cmw7XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNlbmQgYSByZWFkL3JlY3Ygbm90aWZpY2F0aW9uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB3aGF0IC0gd2hhdCBub3RpZmljYXRpb24gdG8gc2VuZDogPHR0PnJlY3Y8L3R0PiwgPHR0PnJlYWQ8L3R0Pi5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHNlcSAtIElEIG9yIHRoZSBtZXNzYWdlIHJlYWQgb3IgcmVjZWl2ZWQuXG4gICAqL1xuICBub3RlOiBmdW5jdGlvbih3aGF0LCBzZXEpIHtcbiAgICBjb25zdCB1c2VyID0gdGhpcy5fdXNlcnNbdGhpcy5fdGlub2RlLmdldEN1cnJlbnRVc2VySUQoKV07XG4gICAgaWYgKHVzZXIpIHtcbiAgICAgIGlmICghdXNlclt3aGF0XSB8fCB1c2VyW3doYXRdIDwgc2VxKSB7XG4gICAgICAgIGlmICh0aGlzLl9zdWJzY3JpYmVkKSB7XG4gICAgICAgICAgdGhpcy5fdGlub2RlLm5vdGUodGhpcy5uYW1lLCB3aGF0LCBzZXEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3Rpbm9kZS5sb2dnZXIoXCJJTkZPOiBOb3Qgc2VuZGluZyB7bm90ZX0gb24gaW5hY3RpdmUgdG9waWNcIik7XG4gICAgICAgIH1cblxuICAgICAgICB1c2VyW3doYXRdID0gc2VxO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl90aW5vZGUubG9nZ2VyKFwiRVJST1I6IG5vdGUoKTogdXNlciBub3QgZm91bmQgXCIgKyB0aGlzLl90aW5vZGUuZ2V0Q3VycmVudFVzZXJJRCgpKTtcbiAgICB9XG5cbiAgICAvLyBVcGRhdGUgbG9jYWxseSBjYWNoZWQgY29udGFjdCB3aXRoIHRoZSBuZXcgY291bnRcbiAgICBjb25zdCBtZSA9IHRoaXMuX3Rpbm9kZS5nZXRNZVRvcGljKCk7XG4gICAgaWYgKG1lKSB7XG4gICAgICBtZS5zZXRNc2dSZWFkUmVjdih0aGlzLm5hbWUsIHdoYXQsIHNlcSk7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBTZW5kIGEgJ3JlY3YnIHJlY2VpcHQuIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjbm90ZVJlY3Z9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gc2VxIC0gSUQgb2YgdGhlIG1lc3NhZ2UgdG8gYWtub3dsZWRnZS5cbiAgICovXG4gIG5vdGVSZWN2OiBmdW5jdGlvbihzZXEpIHtcbiAgICB0aGlzLm5vdGUoJ3JlY3YnLCBzZXEpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTZW5kIGEgJ3JlYWQnIHJlY2VpcHQuIFdyYXBwZXIgZm9yIHtAbGluayBUaW5vZGUjbm90ZVJlYWR9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gc2VxIC0gSUQgb2YgdGhlIG1lc3NhZ2UgdG8gYWtub3dsZWRnZS5cbiAgICovXG4gIG5vdGVSZWFkOiBmdW5jdGlvbihzZXEpIHtcbiAgICB0aGlzLm5vdGUoJ3JlYWQnLCBzZXEpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTZW5kIGEga2V5LXByZXNzIG5vdGlmaWNhdGlvbi4gV3JhcHBlciBmb3Ige0BsaW5rIFRpbm9kZSNub3RlS2V5UHJlc3N9LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKi9cbiAgbm90ZUtleVByZXNzOiBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5fc3Vic2NyaWJlZCkge1xuICAgICAgdGhpcy5fdGlub2RlLm5vdGVLZXlQcmVzcyh0aGlzLm5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl90aW5vZGUubG9nZ2VyKFwiSU5GTzogQ2Fubm90IHNlbmQgbm90aWZpY2F0aW9uIGluIGluYWN0aXZlIHRvcGljXCIpO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogR2V0IHVzZXIgZGVzY3JpcHRpb24gZnJvbSBnbG9iYWwgY2FjaGUuIFRoZSB1c2VyIGRvZXMgbm90IG5lZWQgdG8gYmUgYVxuICAgKiBzdWJzY3JpYmVyIG9mIHRoaXMgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB1aWQgLSBJRCBvZiB0aGUgdXNlciB0byBmZXRjaC5cbiAgICogQHJldHVybiB7T2JqZWN0fSB1c2VyIGRlc2NyaXB0aW9uIG9yIHVuZGVmaW5lZC5cbiAgICovXG4gIHVzZXJEZXNjOiBmdW5jdGlvbih1aWQpIHtcbiAgICAvLyBUT0RPKGdlbmUpOiBoYW5kbGUgYXN5bmNocm9ub3VzIHJlcXVlc3RzXG5cbiAgICBjb25zdCB1c2VyID0gdGhpcy5fY2FjaGVHZXRVc2VyKHVpZCk7XG4gICAgaWYgKHVzZXIpIHtcbiAgICAgIHJldHVybiB1c2VyOyAvLyBQcm9taXNlLnJlc29sdmUodXNlcilcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIEdldCBkZXNjcmlwdGlvbiBvZiB0aGUgcDJwIHBlZXIgZnJvbSBzdWJzY3JpcHRpb24gY2FjaGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm4ge09iamVjdH0gcGVlcidzIGRlc2NyaXB0aW9uIG9yIHVuZGVmaW5lZC5cbiAgICovXG4gIHAycFBlZXJEZXNjOiBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5nZXRUeXBlKCkgIT0gJ3AycCcpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl91c2Vyc1t0aGlzLm5hbWVdO1xuICB9LFxuXG4gIC8qKlxuICAgKiBJdGVyYXRlIG92ZXIgY2FjaGVkIHN1YnNjcmliZXJzLiBJZiBjYWxsYmFjayBpcyB1bmRlZmluZWQsIHVzZSB0aGlzLm9uTWV0YVN1Yi5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBDYWxsYmFjayB3aGljaCB3aWxsIHJlY2VpdmUgc3Vic2NyaWJlcnMgb25lIGJ5IG9uZS5cbiAgICogQHBhcmFtIHtPYmplY3Q9fSBjb250ZXh0IC0gVmFsdWUgb2YgYHRoaXNgIGluc2lkZSB0aGUgYGNhbGxiYWNrYC5cbiAgICovXG4gIHN1YnNjcmliZXJzOiBmdW5jdGlvbihjYWxsYmFjaywgY29udGV4dCkge1xuICAgIGNvbnN0IGNiID0gKGNhbGxiYWNrIHx8IHRoaXMub25NZXRhU3ViKTtcbiAgICBpZiAoY2IpIHtcbiAgICAgIGZvciAobGV0IGlkeCBpbiB0aGlzLl91c2Vycykge1xuICAgICAgICBjYi5jYWxsKGNvbnRleHQsIHRoaXMuX3VzZXJzW2lkeF0sIGlkeCwgdGhpcy5fdXNlcnMpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogR2V0IGEgY29weSBvZiBjYWNoZWQgdGFncy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICogQHJldHVybiBhIGNvcHkgb2YgdGFnc1xuICAgKi9cbiAgdGFnczogZnVuY3Rpb24oKSB7XG4gICAgLy8gUmV0dXJuIGEgY29weS5cbiAgICByZXR1cm4gdGhpcy5fdGFncy5zbGljZSgwKTtcbiAgfSxcblxuICAvKipcbiAgICogR2V0IGNhY2hlZCBzdWJzY3JpcHRpb24gZm9yIHRoZSBnaXZlbiB1c2VyIElELlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gdWlkIC0gaWQgb2YgdGhlIHVzZXIgdG8gcXVlcnkgZm9yXG4gICAqIEByZXR1cm4gdXNlciBkZXNjcmlwdGlvbiBvciB1bmRlZmluZWQuXG4gICAqL1xuICBzdWJzY3JpYmVyOiBmdW5jdGlvbih1aWQpIHtcbiAgICByZXR1cm4gdGhpcy5fdXNlcnNbdWlkXTtcbiAgfSxcblxuICAvKipcbiAgICogSXRlcmF0ZSBvdmVyIGNhY2hlZCBtZXNzYWdlcy4gSWYgY2FsbGJhY2sgaXMgdW5kZWZpbmVkLCB1c2UgdGhpcy5vbkRhdGEuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0gQ2FsbGJhY2sgd2hpY2ggd2lsbCByZWNlaXZlIG1lc3NhZ2VzIG9uZSBieSBvbmUuIFNlZSB7QGxpbmsgVGlub2RlLkNCdWZmZXIjZm9yRWFjaH1cbiAgICogQHBhcmFtIHtpbnRlZ2VyfSBzaW5jZUlkIC0gT3B0aW9uYWwgc2VxSWQgdG8gc3RhcnQgaXRlcmF0aW5nIGZyb20gKGluY2x1c2l2ZSkuXG4gICAqIEBwYXJhbSB7aW50ZWdlcn0gYmVmb3JlSWQgLSBPcHRpb25hbCBzZXFJZCB0byBzdG9wIGl0ZXJhdGluZyBiZWZvcmUgKGV4Y2x1c2l2ZSkuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gVmFsdWUgb2YgYHRoaXNgIGluc2lkZSB0aGUgYGNhbGxiYWNrYC5cbiAgICovXG4gIG1lc3NhZ2VzOiBmdW5jdGlvbihjYWxsYmFjaywgc2luY2VJZCwgYmVmb3JlSWQsIGNvbnRleHQpIHtcbiAgICBjb25zdCBjYiA9IChjYWxsYmFjayB8fCB0aGlzLm9uRGF0YSk7XG4gICAgaWYgKGNiKSB7XG4gICAgICBsZXQgc3RhcnRJZHggPSB0eXBlb2Ygc2luY2VJZCA9PSAnbnVtYmVyJyA/IHRoaXMuX21lc3NhZ2VzLmZpbmQoe1xuICAgICAgICBzZXE6IHNpbmNlSWRcbiAgICAgIH0sIHRydWUpIDogdW5kZWZpbmVkO1xuICAgICAgbGV0IGJlZm9yZUlkeCA9IHR5cGVvZiBiZWZvcmVJZCA9PSAnbnVtYmVyJyA/IHRoaXMuX21lc3NhZ2VzLmZpbmQoe1xuICAgICAgICBzZXE6IGJlZm9yZUlkXG4gICAgICB9LCB0cnVlKSA6IHVuZGVmaW5lZDtcbiAgICAgIGlmIChzdGFydElkeCAhPSAtMSAmJiBiZWZvcmVJZHggIT0gLTEpIHtcbiAgICAgICAgdGhpcy5fbWVzc2FnZXMuZm9yRWFjaChjYiwgc3RhcnRJZHgsIGJlZm9yZUlkeCwgY29udGV4dCk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBJdGVyYXRlIG92ZXIgY2FjaGVkIHVuc2VudCBtZXNzYWdlcy4gV3JhcHMge0BsaW5rIFRpbm9kZS5Ub3BpYyNtZXNzYWdlc30uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0gQ2FsbGJhY2sgd2hpY2ggd2lsbCByZWNlaXZlIG1lc3NhZ2VzIG9uZSBieSBvbmUuIFNlZSB7QGxpbmsgVGlub2RlLkNCdWZmZXIjZm9yRWFjaH1cbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSBWYWx1ZSBvZiBgdGhpc2AgaW5zaWRlIHRoZSBgY2FsbGJhY2tgLlxuICAgKi9cbiAgcXVldWVkTWVzc2FnZXM6IGZ1bmN0aW9uKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FsbGJhY2sgbXVzdCBiZSBwcm92aWRlZFwiKTtcbiAgICB9XG4gICAgdGhpcy5tZXNzYWdlcyhjYWxsYmFjaywgTE9DQUxfU0VRSUQsIHVuZGVmaW5lZCwgY29udGV4dCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEdldCB0aGUgbnVtYmVyIG9mIHRvcGljIHN1YnNjcmliZXJzIHdobyBtYXJrZWQgdGhpcyBtZXNzYWdlIGFzIGVpdGhlciByZWN2IG9yIHJlYWRcbiAgICogQ3VycmVudCB1c2VyIGlzIGV4Y2x1ZGVkIGZyb20gdGhlIGNvdW50LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gd2hhdCAtIHdoYXQgbm90aWZpY2F0aW9uIHRvIHNlbmQ6IDx0dD5yZWN2PC90dD4sIDx0dD5yZWFkPC90dD4uXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzZXEgLSBJRCBvciB0aGUgbWVzc2FnZSByZWFkIG9yIHJlY2VpdmVkLlxuICAgKi9cbiAgbXNnUmVjZWlwdENvdW50OiBmdW5jdGlvbih3aGF0LCBzZXEpIHtcbiAgICBsZXQgY291bnQgPSAwO1xuICAgIGlmIChzZXEgPiAwKSB7XG4gICAgICBjb25zdCBtZSA9IHRoaXMuX3Rpbm9kZS5nZXRDdXJyZW50VXNlcklEKCk7XG4gICAgICBmb3IgKGxldCBpZHggaW4gdGhpcy5fdXNlcnMpIHtcbiAgICAgICAgY29uc3QgdXNlciA9IHRoaXMuX3VzZXJzW2lkeF07XG4gICAgICAgIGlmICh1c2VyLnVzZXIgIT09IG1lICYmIHVzZXJbd2hhdF0gPj0gc2VxKSB7XG4gICAgICAgICAgY291bnQrKztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY291bnQ7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEdldCB0aGUgbnVtYmVyIG9mIHRvcGljIHN1YnNjcmliZXJzIHdobyBtYXJrZWQgdGhpcyBtZXNzYWdlIChhbmQgYWxsIG9sZGVyIG1lc3NhZ2VzKSBhcyByZWFkLlxuICAgKiBUaGUgY3VycmVudCB1c2VyIGlzIGV4Y2x1ZGVkIGZyb20gdGhlIGNvdW50LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gc2VxIC0gTWVzc2FnZSBpZCB0byBjaGVjay5cbiAgICogQHJldHVybnMge051bWJlcn0gTnVtYmVyIG9mIHN1YnNjcmliZXJzIHdobyBjbGFpbSB0byBoYXZlIHJlY2VpdmVkIHRoZSBtZXNzYWdlLlxuICAgKi9cbiAgbXNnUmVhZENvdW50OiBmdW5jdGlvbihzZXEpIHtcbiAgICByZXR1cm4gdGhpcy5tc2dSZWNlaXB0Q291bnQoJ3JlYWQnLCBzZXEpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIG51bWJlciBvZiB0b3BpYyBzdWJzY3JpYmVycyB3aG8gbWFya2VkIHRoaXMgbWVzc2FnZSAoYW5kIGFsbCBvbGRlciBtZXNzYWdlcykgYXMgcmVjZWl2ZWQuXG4gICAqIFRoZSBjdXJyZW50IHVzZXIgaXMgZXhjbHVkZWQgZnJvbSB0aGUgY291bnQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZXEgLSBNZXNzYWdlIGlkIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBOdW1iZXIgb2Ygc3Vic2NyaWJlcnMgd2hvIGNsYWltIHRvIGhhdmUgcmVjZWl2ZWQgdGhlIG1lc3NhZ2UuXG4gICAqL1xuICBtc2dSZWN2Q291bnQ6IGZ1bmN0aW9uKHNlcSkge1xuICAgIHJldHVybiB0aGlzLm1zZ1JlY2VpcHRDb3VudCgncmVjdicsIHNlcSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGNhY2hlZCBtZXNzYWdlIElEcyBpbmRpY2F0ZSB0aGF0IHRoZSBzZXJ2ZXIgbWF5IGhhdmUgbW9yZSBtZXNzYWdlcy5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBuZXdlciBjaGVjayBmb3IgbmV3ZXIgbWVzc2FnZXNcbiAgICovXG4gIG1zZ0hhc01vcmVNZXNzYWdlczogZnVuY3Rpb24obmV3ZXIpIHtcbiAgICByZXR1cm4gbmV3ZXIgPyB0aGlzLnNlcSA+IHRoaXMuX21heFNlcSA6XG4gICAgICAvLyBfbWluU2VxIGNvdW5kIGJlIG1vcmUgdGhhbiAxLCBidXQgZWFybGllciBtZXNzYWdlcyBjb3VsZCBoYXZlIGJlZW4gZGVsZXRlZC5cbiAgICAgICh0aGlzLl9taW5TZXEgPiAxICYmICF0aGlzLl9ub0VhcmxpZXJNc2dzKTtcbiAgfSxcblxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIGdpdmVuIHNlcSBJZCBpcyBpZCBvZiB0aGUgbW9zdCByZWNlbnQgbWVzc2FnZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHBhcmFtIHtpbnRlZ2VyfSBzZXFJZCBpZCBvZiB0aGUgbWVzc2FnZSB0byBjaGVja1xuICAgKi9cbiAgaXNOZXdNZXNzYWdlOiBmdW5jdGlvbihzZXFJZCkge1xuICAgIHJldHVybiB0aGlzLl9tYXhTZXEgPD0gc2VxSWQ7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlbW92ZSBvbmUgbWVzc2FnZSBmcm9tIGxvY2FsIGNhY2hlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge2ludGVnZXJ9IHNlcUlkIGlkIG9mIHRoZSBtZXNzYWdlIHRvIHJlbW92ZSBmcm9tIGNhY2hlLlxuICAgKiBAcmV0dXJucyB7TWVzc2FnZX0gcmVtb3ZlZCBtZXNzYWdlIG9yIHVuZGVmaW5lZCBpZiBzdWNoIG1lc3NhZ2Ugd2FzIG5vdCBmb3VuZC5cbiAgICovXG4gIGZsdXNoTWVzc2FnZTogZnVuY3Rpb24oc2VxSWQpIHtcbiAgICBjb25zdCBpZHggPSB0aGlzLl9tZXNzYWdlcy5maW5kKHtcbiAgICAgIHNlcTogc2VxSWRcbiAgICB9KTtcbiAgICByZXR1cm4gaWR4ID49IDAgPyB0aGlzLl9tZXNzYWdlcy5kZWxBdChpZHgpIDogdW5kZWZpbmVkO1xuICB9LFxuXG4gIC8qKlxuICAgKiBVcGRhdGUgbWVzc2FnZSdzIHNlcUlkLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcHViIG1lc3NhZ2Ugb2JqZWN0LlxuICAgKiBAcGFyYW0ge2ludGVnZXJ9IG5ld1NlcUlkIG5ldyBzZXEgaWQgZm9yIHB1Yi5cbiAgICovXG4gIHN3YXBNZXNzYWdlSWQ6IGZ1bmN0aW9uKHB1YiwgbmV3U2VxSWQpIHtcbiAgICBjb25zdCBpZHggPSB0aGlzLl9tZXNzYWdlcy5maW5kKHtcbiAgICAgIHNlcTogcHViLnNlcVxuICAgIH0pO1xuICAgIGNvbnN0IG51bU1lc3NhZ2VzID0gdGhpcy5fbWVzc2FnZXMubGVuZ3RoKCk7XG4gICAgcHViLnNlcSA9IG5ld1NlcUlkO1xuICAgIGlmICgwIDw9IGlkeCAmJiBpZHggPCBudW1NZXNzYWdlcykge1xuICAgICAgLy8gdGhpcy5fbWVzc2FnZXMgYXJlIHNvcnRlZCBieSBgc2VxYC5cbiAgICAgIC8vIElmIGNoYW5naW5nIHB1Yi5zZXEgdG8gbmV3U2VxSWQgYnJlYWtzIHRoZSBpbnZhcmlhbnQsIGZpeCBpdC5cbiAgICAgIGlmICgoaWR4ID4gMCAmJiB0aGlzLl9tZXNzYWdlcy5nZXRBdChpZHggLSAxKS5zZXEgPj0gbmV3U2VxSWQpIHx8XG4gICAgICAgIChpZHggKyAxIDwgbnVtTWVzc2FnZXMgJiYgbmV3U2VxSWQgPCB0aGlzLl9tZXNzYWdlcy5nZXRBdChpZHggKyAxKS5zZXEgPD0gbmV3U2VxSWQpKSB7XG4gICAgICAgIHRoaXMuX21lc3NhZ2VzLmRlbEF0KGlkeCk7XG4gICAgICAgIHRoaXMuX21lc3NhZ2VzLnB1dChwdWIpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogUmVtb3ZlIGEgcmFuZ2Ugb2YgbWVzc2FnZXMgZnJvbSB0aGUgbG9jYWwgY2FjaGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7aW50ZWdlcn0gZnJvbUlkIHNlcSBJRCBvZiB0aGUgZmlyc3QgbWVzc2FnZSB0byByZW1vdmUgKGluY2x1c2l2ZSkuXG4gICAqIEBwYXJhbSB7aW50ZWdlcn0gdW50aWxJZCBzZXFJRCBvZiB0aGUgbGFzdCBtZXNzYWdlIHRvIHJlbW92ZSAoZXhjbHVzaXZlKS5cbiAgICpcbiAgICogQHJldHVybnMge01lc3NhZ2VbXX0gYXJyYXkgb2YgcmVtb3ZlZCBtZXNzYWdlcyAoY291bGQgYmUgZW1wdHkpLlxuICAgKi9cbiAgZmx1c2hNZXNzYWdlUmFuZ2U6IGZ1bmN0aW9uKGZyb21JZCwgdW50aWxJZCkge1xuICAgIC8vIHN0YXJ0LCBlbmQ6IGZpbmQgaW5zZXJ0aW9uIHBvaW50cyAobmVhcmVzdCA9PSB0cnVlKS5cbiAgICBjb25zdCBzaW5jZSA9IHRoaXMuX21lc3NhZ2VzLmZpbmQoe1xuICAgICAgc2VxOiBmcm9tSWRcbiAgICB9LCB0cnVlKTtcbiAgICByZXR1cm4gc2luY2UgPj0gMCA/IHRoaXMuX21lc3NhZ2VzLmRlbFJhbmdlKHNpbmNlLCB0aGlzLl9tZXNzYWdlcy5maW5kKHtcbiAgICAgIHNlcTogdW50aWxJZFxuICAgIH0sIHRydWUpKSA6IFtdO1xuICB9LFxuXG4gIC8qKlxuICAgKiBBdHRlbXB0IHRvIHN0b3AgbWVzc2FnZSBmcm9tIGJlaW5nIHNlbnQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7aW50ZWdlcn0gc2VxSWQgaWQgb2YgdGhlIG1lc3NhZ2UgdG8gc3RvcCBzZW5kaW5nIGFuZCByZW1vdmUgZnJvbSBjYWNoZS5cbiAgICpcbiAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgbWVzc2FnZSB3YXMgY2FuY2VsbGVkLCBmYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICBjYW5jZWxTZW5kOiBmdW5jdGlvbihzZXFJZCkge1xuICAgIGNvbnN0IGlkeCA9IHRoaXMuX21lc3NhZ2VzLmZpbmQoe1xuICAgICAgc2VxOiBzZXFJZFxuICAgIH0pO1xuICAgIGlmIChpZHggPj0gMCkge1xuICAgICAgY29uc3QgbXNnID0gdGhpcy5fbWVzc2FnZXMuZ2V0QXQoaWR4KTtcbiAgICAgIGNvbnN0IHN0YXR1cyA9IHRoaXMubXNnU3RhdHVzKG1zZyk7XG4gICAgICBpZiAoc3RhdHVzID09IE1FU1NBR0VfU1RBVFVTX1FVRVVFRCB8fCBzdGF0dXMgPT0gTUVTU0FHRV9TVEFUVVNfRkFJTEVEKSB7XG4gICAgICAgIG1zZy5fY2FuY2VsbGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fbWVzc2FnZXMuZGVsQXQoaWR4KTtcbiAgICAgICAgaWYgKHRoaXMub25EYXRhKSB7XG4gICAgICAgICAgLy8gQ2FsbGluZyB3aXRoIG5vIHBhcmFtZXRlcnMgdG8gaW5kaWNhdGUgdGhlIG1lc3NhZ2Ugd2FzIGRlbGV0ZWQuXG4gICAgICAgICAgdGhpcy5vbkRhdGEoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuXG4gIC8qKlxuICAgKiBHZXQgdHlwZSBvZiB0aGUgdG9waWM6IG1lLCBwMnAsIGdycCwgZm5kLi4uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IE9uZSBvZiAnbWUnLCAncDJwJywgJ2dycCcsICdmbmQnIG9yIDx0dD51bmRlZmluZWQ8L3R0Pi5cbiAgICovXG4gIGdldFR5cGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBUaW5vZGUudG9waWNUeXBlKHRoaXMubmFtZSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEdldCB1c2VyJ3MgY3VtdWxhdGl2ZSBhY2Nlc3MgbW9kZSBvZiB0aGUgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuQWNjZXNzTW9kZX0gLSB1c2VyJ3MgYWNjZXNzIG1vZGVcbiAgICovXG4gIGdldEFjY2Vzc01vZGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmFjcztcbiAgfSxcblxuICAvKipcbiAgICogR2V0IHRvcGljJ3MgZGVmYXVsdCBhY2Nlc3MgbW9kZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpYyNcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5EZWZBY3N9IC0gYWNjZXNzIG1vZGUsIHN1Y2ggYXMge2F1dGg6IGBSV1BgLCBhbm9uOiBgTmB9LlxuICAgKi9cbiAgZ2V0RGVmYXVsdEFjY2VzczogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZGVmYWNzO1xuICB9LFxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIG5ldyBtZXRhIHtAbGluayBUaW5vZGUuR2V0UXVlcnl9IGJ1aWxkZXIuIFRoZSBxdWVyeSBpcyBhdHRjaGVkIHRvIHRoZSBjdXJyZW50IHRvcGljLlxuICAgKiBJdCB3aWxsIG5vdCB3b3JrIGNvcnJlY3RseSBpZiB1c2VkIHdpdGggYSBkaWZmZXJlbnQgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuTWV0YUdldEJ1aWxkZXJ9IHF1ZXJ5IGF0dGFjaGVkIHRvIHRoZSBjdXJyZW50IHRvcGljLlxuICAgKi9cbiAgc3RhcnRNZXRhUXVlcnk6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgTWV0YUdldEJ1aWxkZXIodGhpcyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRvcGljIGlzIGFyY2hpdmVkLCBpLmUuIHByaXZhdGUuYXJjaCA9PSB0cnVlLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljI1xuICAgKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSB0cnVlIGlmIHRvcGljIGlzIGFyY2hpdmVkLCBmYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICBpc0FyY2hpdmVkOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5wcml2YXRlICYmIHRoaXMucHJpdmF0ZS5hcmNoID8gdHJ1ZSA6IGZhbHNlO1xuICB9LFxuXG4gIC8qKlxuICAgKiBHZXQgc3RhdHVzIChxdWV1ZWQsIHNlbnQsIHJlY2VpdmVkIGV0Yykgb2YgYSBnaXZlbiBtZXNzYWdlIGluIHRoZSBjb250ZXh0XG4gICAqIG9mIHRoaXMgdG9waWMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWMjXG4gICAqXG4gICAqIEBwYXJhbSB7TWVzc2FnZX0gbXNnIG1lc3NhZ2UgdG8gY2hlY2sgZm9yIHN0YXR1cy5cbiAgICogQHJldHVybnMgbWVzc2FnZSBzdGF0dXMgY29uc3RhbnQuXG4gICAqL1xuICBtc2dTdGF0dXM6IGZ1bmN0aW9uKG1zZykge1xuICAgIGxldCBzdGF0dXMgPSBNRVNTQUdFX1NUQVRVU19OT05FO1xuICAgIGlmICh0aGlzLl90aW5vZGUuaXNNZShtc2cuZnJvbSkpIHtcbiAgICAgIGlmIChtc2cuX3NlbmRpbmcpIHtcbiAgICAgICAgc3RhdHVzID0gTUVTU0FHRV9TVEFUVVNfU0VORElORztcbiAgICAgIH0gZWxzZSBpZiAobXNnLl9mYWlsZWQpIHtcbiAgICAgICAgc3RhdHVzID0gTUVTU0FHRV9TVEFUVVNfRkFJTEVEO1xuICAgICAgfSBlbHNlIGlmIChtc2cuc2VxID49IExPQ0FMX1NFUUlEKSB7XG4gICAgICAgIHN0YXR1cyA9IE1FU1NBR0VfU1RBVFVTX1FVRVVFRDtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5tc2dSZWFkQ291bnQobXNnLnNlcSkgPiAwKSB7XG4gICAgICAgIHN0YXR1cyA9IE1FU1NBR0VfU1RBVFVTX1JFQUQ7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMubXNnUmVjdkNvdW50KG1zZy5zZXEpID4gMCkge1xuICAgICAgICBzdGF0dXMgPSBNRVNTQUdFX1NUQVRVU19SRUNFSVZFRDtcbiAgICAgIH0gZWxzZSBpZiAobXNnLnNlcSA+IDApIHtcbiAgICAgICAgc3RhdHVzID0gTUVTU0FHRV9TVEFUVVNfU0VOVDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3RhdHVzID0gTUVTU0FHRV9TVEFUVVNfVE9fTUU7XG4gICAgfVxuICAgIHJldHVybiBzdGF0dXM7XG4gIH0sXG5cbiAgLy8gUHJvY2VzcyBkYXRhIG1lc3NhZ2VcbiAgX3JvdXRlRGF0YTogZnVuY3Rpb24oZGF0YSkge1xuICAgIGlmIChkYXRhLmNvbnRlbnQpIHtcbiAgICAgIGlmICghdGhpcy50b3VjaGVkIHx8IHRoaXMudG91Y2hlZCA8IGRhdGEudHMpIHtcbiAgICAgICAgdGhpcy50b3VjaGVkID0gZGF0YS50cztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIWRhdGEuX25vRm9yd2FyZGluZykge1xuICAgICAgdGhpcy5fbWVzc2FnZXMucHV0KGRhdGEpO1xuICAgICAgdGhpcy5fdXBkYXRlRGVsZXRlZFJhbmdlcygpO1xuICAgIH1cblxuICAgIGlmIChkYXRhLnNlcSA+IHRoaXMuX21heFNlcSkge1xuICAgICAgdGhpcy5fbWF4U2VxID0gZGF0YS5zZXE7XG4gICAgfVxuICAgIGlmIChkYXRhLnNlcSA8IHRoaXMuX21pblNlcSB8fCB0aGlzLl9taW5TZXEgPT0gMCkge1xuICAgICAgdGhpcy5fbWluU2VxID0gZGF0YS5zZXE7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub25EYXRhKSB7XG4gICAgICB0aGlzLm9uRGF0YShkYXRhKTtcbiAgICB9XG5cbiAgICAvLyBVcGRhdGUgbG9jYWxseSBjYWNoZWQgY29udGFjdCB3aXRoIHRoZSBuZXcgbWVzc2FnZSBjb3VudC5cbiAgICBjb25zdCBtZSA9IHRoaXMuX3Rpbm9kZS5nZXRNZVRvcGljKCk7XG4gICAgaWYgKG1lKSB7XG4gICAgICAvLyBNZXNzYWdlcyBmcm9tIHRoZSBjdXJyZW50IHVzZXIgYXJlIGNvbnNpZGVyZWQgdG8gYmUgcmVhZCBhbHJlYWR5LlxuICAgICAgbWUuc2V0TXNnUmVhZFJlY3YodGhpcy5uYW1lLFxuICAgICAgICAoIWRhdGEuZnJvbSB8fCB0aGlzLl90aW5vZGUuaXNNZShkYXRhLmZyb20pKSA/ICdyZWFkJyA6ICdtc2cnLFxuICAgICAgICBkYXRhLnNlcSwgZGF0YS50cyk7XG4gICAgfVxuICB9LFxuXG4gIC8vIFByb2Nlc3MgbWV0YWRhdGEgbWVzc2FnZVxuICBfcm91dGVNZXRhOiBmdW5jdGlvbihtZXRhKSB7XG4gICAgaWYgKG1ldGEuZGVzYykge1xuICAgICAgdGhpcy5fbGFzdERlc2NVcGRhdGUgPSBtZXRhLnRzO1xuICAgICAgdGhpcy5fcHJvY2Vzc01ldGFEZXNjKG1ldGEuZGVzYyk7XG4gICAgfVxuICAgIGlmIChtZXRhLnN1YiAmJiBtZXRhLnN1Yi5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLl9sYXN0U3Vic1VwZGF0ZSA9IG1ldGEudHM7XG4gICAgICB0aGlzLl9wcm9jZXNzTWV0YVN1YihtZXRhLnN1Yik7XG4gICAgfVxuICAgIGlmIChtZXRhLmRlbCkge1xuICAgICAgdGhpcy5fcHJvY2Vzc0RlbE1lc3NhZ2VzKG1ldGEuZGVsLmNsZWFyLCBtZXRhLmRlbC5kZWxzZXEpO1xuICAgIH1cbiAgICBpZiAobWV0YS50YWdzKSB7XG4gICAgICB0aGlzLl9wcm9jZXNzTWV0YVRhZ3MobWV0YS50YWdzKTtcbiAgICB9XG4gICAgaWYgKG1ldGEuY3JlZCkge1xuICAgICAgdGhpcy5fcHJvY2Vzc01ldGFDcmVkcyhtZXRhLmNyZWQpO1xuICAgIH1cbiAgICBpZiAodGhpcy5vbk1ldGEpIHtcbiAgICAgIHRoaXMub25NZXRhKG1ldGEpO1xuICAgIH1cbiAgfSxcblxuICAvLyBQcm9jZXNzIHByZXNlbmNlIGNoYW5nZSBtZXNzYWdlXG4gIF9yb3V0ZVByZXM6IGZ1bmN0aW9uKHByZXMpIHtcbiAgICBsZXQgdXNlcjtcbiAgICBzd2l0Y2ggKHByZXMud2hhdCkge1xuICAgICAgY2FzZSAnZGVsJzpcbiAgICAgICAgLy8gRGVsZXRlIGNhY2hlZCBtZXNzYWdlcy5cbiAgICAgICAgdGhpcy5fcHJvY2Vzc0RlbE1lc3NhZ2VzKHByZXMuY2xlYXIsIHByZXMuZGVsc2VxKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdvbic6XG4gICAgICBjYXNlICdvZmYnOlxuICAgICAgICAvLyBVcGRhdGUgb25saW5lIHN0YXR1cyBvZiBhIHN1YnNjcmlwdGlvbi5cbiAgICAgICAgdXNlciA9IHRoaXMuX3VzZXJzW3ByZXMuc3JjXTtcbiAgICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgICB1c2VyLm9ubGluZSA9IHByZXMud2hhdCA9PSAnb24nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3Rpbm9kZS5sb2dnZXIoXCJXQVJOSU5HOiBQcmVzZW5jZSB1cGRhdGUgZm9yIGFuIHVua25vd24gdXNlclwiLCB0aGlzLm5hbWUsIHByZXMuc3JjKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3Rlcm0nOlxuICAgICAgICAvLyBBdHRhY2htZW50IHRvIHRvcGljIGlzIHRlcm1pbmF0ZWQgcHJvYmFibHkgZHVlIHRvIGNsdXN0ZXIgcmVoYXNoaW5nLlxuICAgICAgICB0aGlzLl9yZXNldFN1YigpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2Fjcyc6XG4gICAgICAgIHVzZXIgPSB0aGlzLl91c2Vyc1twcmVzLnNyY107XG4gICAgICAgIGlmICghdXNlcikge1xuICAgICAgICAgIC8vIFVwZGF0ZSBmb3IgYW4gdW5rbm93biB1c2VyOiBub3RpZmljYXRpb24gb2YgYSBuZXcgc3Vic2NyaXB0aW9uLlxuICAgICAgICAgIGNvbnN0IGFjcyA9IG5ldyBBY2Nlc3NNb2RlKCkudXBkYXRlQWxsKHByZXMuZGFjcyk7XG4gICAgICAgICAgaWYgKGFjcyAmJiBhY3MubW9kZSAhPSBBY2Nlc3NNb2RlLl9OT05FKSB7XG4gICAgICAgICAgICB1c2VyID0gdGhpcy5fY2FjaGVHZXRVc2VyKHByZXMuc3JjKTtcbiAgICAgICAgICAgIGlmICghdXNlcikge1xuICAgICAgICAgICAgICB1c2VyID0ge1xuICAgICAgICAgICAgICAgIHVzZXI6IHByZXMuc3JjLFxuICAgICAgICAgICAgICAgIGFjczogYWNzXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIHRoaXMuZ2V0TWV0YSh0aGlzLnN0YXJ0TWV0YVF1ZXJ5KCkud2l0aE9uZVN1Yih1bmRlZmluZWQsIHByZXMuc3JjKS5idWlsZCgpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHVzZXIuYWNzID0gYWNzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdXNlci51cGRhdGVkID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2Nlc3NNZXRhU3ViKFt1c2VyXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIEtub3duIHVzZXJcbiAgICAgICAgICB1c2VyLmFjcy51cGRhdGVBbGwocHJlcy5kYWNzKTtcbiAgICAgICAgICAvLyBVcGRhdGUgdXNlcidzIGFjY2VzcyBtb2RlLlxuICAgICAgICAgIHRoaXMuX3Byb2Nlc3NNZXRhU3ViKFt7XG4gICAgICAgICAgICB1c2VyOiBwcmVzLnNyYyxcbiAgICAgICAgICAgIHVwZGF0ZWQ6IG5ldyBEYXRlKCksXG4gICAgICAgICAgICBhY3M6IHVzZXIuYWNzXG4gICAgICAgICAgfV0pO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5fdGlub2RlLmxvZ2dlcihcIklORk86IElnbm9yZWQgcHJlc2VuY2UgdXBkYXRlXCIsIHByZXMud2hhdCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub25QcmVzKSB7XG4gICAgICB0aGlzLm9uUHJlcyhwcmVzKTtcbiAgICB9XG4gIH0sXG5cbiAgLy8gUHJvY2VzcyB7aW5mb30gbWVzc2FnZVxuICBfcm91dGVJbmZvOiBmdW5jdGlvbihpbmZvKSB7XG4gICAgaWYgKGluZm8ud2hhdCAhPT0gJ2twJykge1xuICAgICAgY29uc3QgdXNlciA9IHRoaXMuX3VzZXJzW2luZm8uZnJvbV07XG4gICAgICBpZiAodXNlcikge1xuICAgICAgICB1c2VyW2luZm8ud2hhdF0gPSBpbmZvLnNlcTtcbiAgICAgICAgaWYgKHVzZXIucmVjdiA8IHVzZXIucmVhZCkge1xuICAgICAgICAgIHVzZXIucmVjdiA9IHVzZXIucmVhZDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBJZiB0aGlzIGlzIGFuIHVwZGF0ZSBmcm9tIHRoZSBjdXJyZW50IHVzZXIsIHVwZGF0ZSB0aGUgY29udGFjdCB3aXRoIHRoZSBuZXcgY291bnQgdG9vLlxuICAgICAgaWYgKHRoaXMuX3Rpbm9kZS5pc01lKGluZm8uZnJvbSkpIHtcbiAgICAgICAgY29uc3QgbWUgPSB0aGlzLl90aW5vZGUuZ2V0TWVUb3BpYygpO1xuICAgICAgICBpZiAobWUpIHtcbiAgICAgICAgICBtZS5zZXRNc2dSZWFkUmVjdihpbmZvLnRvcGljLCBpbmZvLndoYXQsIGluZm8uc2VxKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5vbkluZm8pIHtcbiAgICAgIHRoaXMub25JbmZvKGluZm8pO1xuICAgIH1cbiAgfSxcblxuICAvLyBDYWxsZWQgYnkgVGlub2RlIHdoZW4gbWV0YS5kZXNjIHBhY2tldCBpcyByZWNlaXZlZC5cbiAgLy8gQ2FsbGVkIGJ5ICdtZScgdG9waWMgb24gY29udGFjdCB1cGRhdGUgKGRlc2MuX25vRm9yd2FyZGluZyBpcyB0cnVlKS5cbiAgX3Byb2Nlc3NNZXRhRGVzYzogZnVuY3Rpb24oZGVzYykge1xuICAgIC8vIFN5bnRoZXRpYyBkZXNjIG1heSBpbmNsdWRlIGRlZmFjcyBmb3IgcDJwIHRvcGljcyB3aGljaCBpcyB1c2VsZXNzLlxuICAgIC8vIFJlbW92ZSBpdC5cbiAgICBpZiAodGhpcy5nZXRUeXBlKCkgPT0gJ3AycCcpIHtcbiAgICAgIGRlbGV0ZSBkZXNjLmRlZmFjcztcbiAgICB9XG5cbiAgICAvLyBDb3B5IHBhcmFtZXRlcnMgZnJvbSBkZXNjIG9iamVjdCB0byB0aGlzIHRvcGljLlxuICAgIG1lcmdlT2JqKHRoaXMsIGRlc2MpO1xuXG4gICAgaWYgKHR5cGVvZiB0aGlzLmNyZWF0ZWQgPT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuY3JlYXRlZCA9IG5ldyBEYXRlKHRoaXMuY3JlYXRlZCk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgdGhpcy51cGRhdGVkID09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLnVwZGF0ZWQgPSBuZXcgRGF0ZSh0aGlzLnVwZGF0ZWQpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHRoaXMudG91Y2hlZCA9PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy50b3VjaGVkID0gbmV3IERhdGUodGhpcy50b3VjaGVkKTtcbiAgICB9XG5cbiAgICAvLyBVcGRhdGUgcmVsZXZhbnQgY29udGFjdCBpbiB0aGUgbWUgdG9waWMsIGlmIGF2YWlsYWJsZTpcbiAgICBpZiAodGhpcy5uYW1lICE9PSAnbWUnICYmICFkZXNjLl9ub0ZvcndhcmRpbmcpIHtcbiAgICAgIGNvbnN0IG1lID0gdGhpcy5fdGlub2RlLmdldE1lVG9waWMoKTtcbiAgICAgIGlmIChtZSkge1xuICAgICAgICAvLyBNdXN0IHVzZSBvcmlnaW5hbCAnZGVzYycgaW5zdGVhZCBvZiAndGhpcycgc28gbm90IHRvIGxvc2UgREVMX0NIQVIuXG4gICAgICAgIG1lLl9wcm9jZXNzTWV0YVN1Yihbe1xuICAgICAgICAgIF9ub0ZvcndhcmRpbmc6IHRydWUsXG4gICAgICAgICAgdG9waWM6IHRoaXMubmFtZSxcbiAgICAgICAgICB1cGRhdGVkOiB0aGlzLnVwZGF0ZWQsXG4gICAgICAgICAgdG91Y2hlZDogdGhpcy50b3VjaGVkLFxuICAgICAgICAgIGFjczogZGVzYy5hY3MsXG4gICAgICAgICAgc2VxOiBkZXNjLnNlcSxcbiAgICAgICAgICByZWFkOiBkZXNjLnJlYWQsXG4gICAgICAgICAgcmVjdjogZGVzYy5yZWN2LFxuICAgICAgICAgIHB1YmxpYzogZGVzYy5wdWJsaWMsXG4gICAgICAgICAgcHJpdmF0ZTogZGVzYy5wcml2YXRlXG4gICAgICAgIH1dKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5vbk1ldGFEZXNjKSB7XG4gICAgICB0aGlzLm9uTWV0YURlc2ModGhpcyk7XG4gICAgfVxuICB9LFxuXG4gIC8vIENhbGxlZCBieSBUaW5vZGUgd2hlbiBtZXRhLnN1YiBpcyByZWNpdmVkIG9yIGluIHJlc3BvbnNlIHRvIHJlY2VpdmVkXG4gIC8vIHtjdHJsfSBhZnRlciBzZXRNZXRhLXN1Yi5cbiAgX3Byb2Nlc3NNZXRhU3ViOiBmdW5jdGlvbihzdWJzKSB7XG4gICAgZm9yIChsZXQgaWR4IGluIHN1YnMpIHtcbiAgICAgIGNvbnN0IHN1YiA9IHN1YnNbaWR4XTtcblxuICAgICAgc3ViLnVwZGF0ZWQgPSBuZXcgRGF0ZShzdWIudXBkYXRlZCk7XG4gICAgICBzdWIuZGVsZXRlZCA9IHN1Yi5kZWxldGVkID8gbmV3IERhdGUoc3ViLmRlbGV0ZWQpIDogbnVsbDtcblxuICAgICAgbGV0IHVzZXIgPSBudWxsO1xuICAgICAgaWYgKCFzdWIuZGVsZXRlZCkge1xuICAgICAgICAvLyBJZiB0aGlzIGlzIGEgY2hhbmdlIHRvIHVzZXIncyBvd24gcGVybWlzc2lvbnMsIHVwZGF0ZSB0aGVtIGluIHRvcGljIHRvby5cbiAgICAgICAgLy8gRGVzYyB3aWxsIHVwZGF0ZSAnbWUnIHRvcGljLlxuICAgICAgICBpZiAodGhpcy5fdGlub2RlLmlzTWUoc3ViLnVzZXIpICYmIHN1Yi5hY3MpIHtcbiAgICAgICAgICB0aGlzLl9wcm9jZXNzTWV0YURlc2Moe1xuICAgICAgICAgICAgdXBkYXRlZDogc3ViLnVwZGF0ZWQgfHwgbmV3IERhdGUoKSxcbiAgICAgICAgICAgIHRvdWNoZWQ6IHN1Yi51cGRhdGVkLFxuICAgICAgICAgICAgYWNzOiBzdWIuYWNzXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdXNlciA9IHRoaXMuX3VwZGF0ZUNhY2hlZFVzZXIoc3ViLnVzZXIsIHN1Yik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBTdWJzY3JpcHRpb24gaXMgZGVsZXRlZCwgcmVtb3ZlIGl0IGZyb20gdG9waWMgKGJ1dCBsZWF2ZSBpbiBVc2VycyBjYWNoZSlcbiAgICAgICAgZGVsZXRlIHRoaXMuX3VzZXJzW3N1Yi51c2VyXTtcbiAgICAgICAgdXNlciA9IHN1YjtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMub25NZXRhU3ViKSB7XG4gICAgICAgIHRoaXMub25NZXRhU3ViKHVzZXIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLm9uU3Vic1VwZGF0ZWQpIHtcbiAgICAgIHRoaXMub25TdWJzVXBkYXRlZChPYmplY3Qua2V5cyh0aGlzLl91c2VycykpO1xuICAgIH1cbiAgfSxcblxuICAvLyBDYWxsZWQgYnkgVGlub2RlIHdoZW4gbWV0YS50YWdzIGlzIHJlY2l2ZWQuXG4gIF9wcm9jZXNzTWV0YVRhZ3M6IGZ1bmN0aW9uKHRhZ3MpIHtcbiAgICBpZiAodGFncy5sZW5ndGggPT0gMSAmJiB0YWdzWzBdID09IFRpbm9kZS5ERUxfQ0hBUikge1xuICAgICAgdGFncyA9IFtdO1xuICAgIH1cbiAgICB0aGlzLl90YWdzID0gdGFncztcbiAgICBpZiAodGhpcy5vblRhZ3NVcGRhdGVkKSB7XG4gICAgICB0aGlzLm9uVGFnc1VwZGF0ZWQodGFncyk7XG4gICAgfVxuICB9LFxuXG4gIC8vIERvIG5vdGhpbmcgZm9yIHRvcGljcyBvdGhlciB0aGFuICdtZSdcbiAgX3Byb2Nlc3NNZXRhQ3JlZHM6IGZ1bmN0aW9uKGNyZWRzKSB7fSxcblxuICAvLyBEZWxldGUgY2FjaGVkIG1lc3NhZ2VzIGFuZCB1cGRhdGUgY2FjaGVkIHRyYW5zYWN0aW9uIElEc1xuICBfcHJvY2Vzc0RlbE1lc3NhZ2VzOiBmdW5jdGlvbihjbGVhciwgZGVsc2VxKSB7XG4gICAgdGhpcy5fbWF4RGVsID0gTWF0aC5tYXgoY2xlYXIsIHRoaXMuX21heERlbCk7XG4gICAgdGhpcy5jbGVhciA9IE1hdGgubWF4KGNsZWFyLCB0aGlzLmNsZWFyKTtcbiAgICBjb25zdCB0b3BpYyA9IHRoaXM7XG4gICAgbGV0IGNvdW50ID0gMDtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShkZWxzZXEpKSB7XG4gICAgICBkZWxzZXEubWFwKGZ1bmN0aW9uKHJhbmdlKSB7XG4gICAgICAgIGlmICghcmFuZ2UuaGkpIHtcbiAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgIHRvcGljLmZsdXNoTWVzc2FnZShyYW5nZS5sb3cpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZvciAobGV0IGkgPSByYW5nZS5sb3c7IGkgPCByYW5nZS5oaTsgaSsrKSB7XG4gICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgICAgdG9waWMuZmx1c2hNZXNzYWdlKGkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGNvdW50ID4gMCkge1xuICAgICAgdGhpcy5fdXBkYXRlRGVsZXRlZFJhbmdlcygpO1xuXG4gICAgICBpZiAodGhpcy5vbkRhdGEpIHtcbiAgICAgICAgdGhpcy5vbkRhdGEoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgLy8gVG9waWMgaXMgaW5mb3JtZWQgdGhhdCB0aGUgZW50aXJlIHJlc3BvbnNlIHRvIHtnZXQgd2hhdD1kYXRhfSBoYXMgYmVlbiByZWNlaXZlZC5cbiAgX2FsbE1lc3NhZ2VzUmVjZWl2ZWQ6IGZ1bmN0aW9uKGNvdW50KSB7XG4gICAgdGhpcy5fdXBkYXRlRGVsZXRlZFJhbmdlcygpO1xuXG4gICAgaWYgKHRoaXMub25BbGxNZXNzYWdlc1JlY2VpdmVkKSB7XG4gICAgICB0aGlzLm9uQWxsTWVzc2FnZXNSZWNlaXZlZChjb3VudCk7XG4gICAgfVxuICB9LFxuXG4gIC8vIFJlc2V0IHN1YnNjcmliZWQgc3RhdGVcbiAgX3Jlc2V0U3ViOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLl9zdWJzY3JpYmVkID0gZmFsc2U7XG4gIH0sXG5cbiAgLy8gVGhpcyB0b3BpYyBpcyBlaXRoZXIgZGVsZXRlZCBvciB1bnN1YnNjcmliZWQgZnJvbS5cbiAgX2dvbmU6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuX21lc3NhZ2VzLnJlc2V0KCk7XG4gICAgdGhpcy5fdXNlcnMgPSB7fTtcbiAgICB0aGlzLmFjcyA9IG5ldyBBY2Nlc3NNb2RlKG51bGwpO1xuICAgIHRoaXMucHJpdmF0ZSA9IG51bGw7XG4gICAgdGhpcy5wdWJsaWMgPSBudWxsO1xuICAgIHRoaXMuX21heFNlcSA9IDA7XG4gICAgdGhpcy5fbWluU2VxID0gMDtcbiAgICB0aGlzLl9zdWJzY3JpYmVkID0gZmFsc2U7XG5cbiAgICBjb25zdCBtZSA9IHRoaXMuX3Rpbm9kZS5nZXRNZVRvcGljKCk7XG4gICAgaWYgKG1lKSB7XG4gICAgICBtZS5fcm91dGVQcmVzKHtcbiAgICAgICAgX25vRm9yd2FyZGluZzogdHJ1ZSxcbiAgICAgICAgd2hhdDogJ2dvbmUnLFxuICAgICAgICB0b3BpYzogJ21lJyxcbiAgICAgICAgc3JjOiB0aGlzLm5hbWVcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAodGhpcy5vbkRlbGV0ZVRvcGljKSB7XG4gICAgICB0aGlzLm9uRGVsZXRlVG9waWMoKTtcbiAgICB9XG4gIH0sXG5cbiAgLy8gVXBkYXRlIGdsb2JhbCB1c2VyIGNhY2hlIGFuZCBsb2NhbCBzdWJzY3JpYmVycyBjYWNoZS5cbiAgLy8gRG9uJ3QgY2FsbCB0aGlzIG1ldGhvZCBmb3Igbm9uLXN1YnNjcmliZXJzLlxuICBfdXBkYXRlQ2FjaGVkVXNlcjogZnVuY3Rpb24odWlkLCBvYmopIHtcbiAgICAvLyBGZXRjaCB1c2VyIG9iamVjdCBmcm9tIHRoZSBnbG9iYWwgY2FjaGUuXG4gICAgLy8gVGhpcyBpcyBhIGNsb25lIG9mIHRoZSBzdG9yZWQgb2JqZWN0XG4gICAgbGV0IGNhY2hlZCA9IHRoaXMuX2NhY2hlR2V0VXNlcih1aWQpO1xuICAgIGNhY2hlZCA9IG1lcmdlT2JqKGNhY2hlZCB8fCB7fSwgb2JqKTtcbiAgICAvLyBTYXZlIHRvIGdsb2JhbCBjYWNoZVxuICAgIHRoaXMuX2NhY2hlUHV0VXNlcih1aWQsIGNhY2hlZCk7XG4gICAgLy8gU2F2ZSB0byB0aGUgbGlzdCBvZiB0b3BpYyBzdWJzcmliZXJzLlxuICAgIHJldHVybiBtZXJnZVRvQ2FjaGUodGhpcy5fdXNlcnMsIHVpZCwgY2FjaGVkKTtcbiAgfSxcblxuICAvLyBHZXQgbG9jYWwgc2VxSWQgZm9yIGEgcXVldWVkIG1lc3NhZ2UuXG4gIF9nZXRRdWV1ZWRTZXFJZDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3F1ZXVlZFNlcUlkKys7XG4gIH0sXG5cbiAgLy8gQ2FsY3VsYXRlIHJhbmdlcyBvZiBtaXNzaW5nIG1lc3NhZ2VzLlxuICBfdXBkYXRlRGVsZXRlZFJhbmdlczogZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgcmFuZ2VzID0gW107XG5cbiAgICBsZXQgcHJldiA9IG51bGw7XG4gICAgLy8gQ2hlY2sgZm9yIGdhcCBpbiB0aGUgYmVnaW5uaW5nLCBiZWZvcmUgdGhlIGZpcnN0IG1lc3NhZ2UuXG4gICAgY29uc3QgZmlyc3QgPSB0aGlzLl9tZXNzYWdlcy5nZXRBdCgwKTtcbiAgICBpZiAoZmlyc3QgJiYgdGhpcy5fbWluU2VxID4gMSAmJiAhdGhpcy5fbm9FYXJsaWVyTXNncykge1xuICAgICAgLy8gU29tZSBtZXNzYWdlcyBhcmUgbWlzc2luZyBpbiB0aGUgYmVnaW5uaW5nLlxuICAgICAgaWYgKGZpcnN0LmhpKSB7XG4gICAgICAgIC8vIFRoZSBmaXJzdCBtZXNzYWdlIGFscmVhZHkgcmVwcmVzZW50cyBhIGdhcC5cbiAgICAgICAgaWYgKGZpcnN0LnNlcSA+IDEpIHtcbiAgICAgICAgICBmaXJzdC5zZXEgPSAxO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmaXJzdC5oaSA8IHRoaXMuX21pblNlcSAtIDEpIHtcbiAgICAgICAgICBmaXJzdC5oaSA9IHRoaXMuX21pblNlcSAtIDE7XG4gICAgICAgIH1cbiAgICAgICAgcHJldiA9IGZpcnN0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQ3JlYXRlIG5ldyBnYXAuXG4gICAgICAgIHByZXYgPSB7XG4gICAgICAgICAgc2VxOiAxLFxuICAgICAgICAgIGhpOiB0aGlzLl9taW5TZXEgLSAxXG4gICAgICAgIH07XG4gICAgICAgIHJhbmdlcy5wdXNoKHByZXYpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBObyBnYXAgaW4gdGhlIGJlZ2lubmluZy5cbiAgICAgIHByZXYgPSB7XG4gICAgICAgIHNlcTogMCxcbiAgICAgICAgaGk6IDBcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gRmluZCBnYXBzIGluIHRoZSBsaXN0IG9mIHJlY2VpdmVkIG1lc3NhZ2VzLiBUaGUgbGlzdCBjb250YWlucyBtZXNzYWdlcy1wcm9wZXIgYXMgd2VsbFxuICAgIC8vIGFzIHBsYWNlaG9sZXJzIGZvciBkZWxldGVkIHJhbmdlcy5cbiAgICAvLyBUaGUgbWVzc2FnZXMgYXJlIGl0ZXJhdGVkIGJ5IHNlcSBJRCBpbiBhc2NlbmRpbmcgb3JkZXIuXG4gICAgdGhpcy5fbWVzc2FnZXMuZm9yRWFjaCgoZGF0YSkgPT4ge1xuICAgICAgLy8gRG8gbm90IGNyZWF0ZSBhIGdhcCBiZXR3ZWVuIHRoZSBsYXN0IHNlbnQgbWVzc2FnZSBhbmQgdGhlIGZpcnN0IHVuc2VudC5cbiAgICAgIGlmIChkYXRhLnNlcSA+PSBMT0NBTF9TRVFJRCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvLyBOZXcgbWVzc2FnZSBpcyByZWR1Y2luZyB0aGUgZXhpc3RpbmcgZ2FwXG5cbiAgICAgIGlmIChkYXRhLnNlcSA9PSAocHJldi5oaSB8fCBwcmV2LnNlcSkgKyAxKSB7XG4gICAgICAgIC8vIE5vIG5ldyBnYXAuIFJlcGxhY2UgcHJldmlvdXMgd2l0aCBjdXJyZW50LlxuICAgICAgICBwcmV2ID0gZGF0YTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBGb3VuZCBhIG5ldyBnYXAuXG5cbiAgICAgIGlmIChwcmV2LmhpKSB7XG4gICAgICAgIC8vIFByZXZpb3VzIGlzIGFsc28gYSBnYXAsIGV4dGVuZCBpdC5cbiAgICAgICAgcHJldi5oaSA9IGRhdGEuaGkgfHwgZGF0YS5zZXE7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gUHJldmlvdXMgaXMgbm90IGEgZ2FwLiBDcmVhdGUgYSBuZXcgZ2FwLlxuICAgICAgcHJldiA9IHtcbiAgICAgICAgc2VxOiAocHJldi5oaSB8fCBwcmV2LnNlcSkgKyAxLFxuICAgICAgICBoaTogZGF0YS5oaSB8fCBkYXRhLnNlcVxuICAgICAgfTtcbiAgICAgIHJhbmdlcy5wdXNoKHByZXYpO1xuICAgIH0pO1xuXG4gICAgLy8gQ2hlY2sgZm9yIG1pc3NpbmcgbWVzc2FnZXMgYXQgdGhlIGVuZC4gQWxsIG1lc3NhZ2VzIGNvdWxkIGJlIG1pc3NpbmcuXG4gICAgY29uc3QgbGFzdCA9IHRoaXMuX21lc3NhZ2VzLmdldExhc3QoKTtcbiAgICBjb25zdCBtYXhTZXEgPSBNYXRoLm1heCh0aGlzLnNlcSwgdGhpcy5fbWF4U2VxKTtcbiAgICBpZiAoIWxhc3QgfHwgKGxhc3QgJiYgKGxhc3QuaGkgfHwgbGFzdC5zZXEpIDwgbWF4U2VxKSkge1xuICAgICAgaWYgKGxhc3QgJiYgbGFzdC5oaSkge1xuICAgICAgICAvLyBFeHRlbmQgZXhpc3RpbmcgZ2FwXG4gICAgICAgIGxhc3QuaGkgPSBtYXhTZXE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBDcmVhdGUgbmV3IGdhcC5cbiAgICAgICAgcmFuZ2VzLnB1c2goe1xuICAgICAgICAgIHNlcTogbGFzdCA/IGxhc3Quc2VxICsgMSA6IDEsXG4gICAgICAgICAgaGk6IG1heFNlcVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJbnNlcnQgbmV3IGdhcHMgaW50byBjYWNoZS5cbiAgICByYW5nZXMubWFwKChnYXApID0+IHtcbiAgICAgIHRoaXMuX21lc3NhZ2VzLnB1dChnYXApO1xuICAgIH0pO1xuICB9XG59O1xuXG4vKipcbiAqIEBjbGFzcyBUb3BpY01lIC0gc3BlY2lhbCBjYXNlIG9mIHtAbGluayBUaW5vZGUuVG9waWN9IGZvclxuICogbWFuYWdpbmcgZGF0YSBvZiB0aGUgY3VycmVudCB1c2VyLCBpbmNsdWRpbmcgY29udGFjdCBsaXN0LlxuICogQGV4dGVuZHMgVGlub2RlLlRvcGljXG4gKiBAbWVtYmVyb2YgVGlub2RlXG4gKlxuICogQHBhcmFtIHtUb3BpY01lLkNhbGxiYWNrc30gY2FsbGJhY2tzIC0gQ2FsbGJhY2tzIHRvIHJlY2VpdmUgdmFyaW91cyBldmVudHMuXG4gKi9cbnZhciBUb3BpY01lID0gZnVuY3Rpb24oY2FsbGJhY2tzKSB7XG4gIFRvcGljLmNhbGwodGhpcywgVE9QSUNfTUUsIGNhbGxiYWNrcyk7XG4gIC8vIExpc3Qgb2YgY29udGFjdHMgKHRvcGljX25hbWUgLT4gQ29udGFjdCBvYmplY3QpXG4gIHRoaXMuX2NvbnRhY3RzID0ge307XG5cbiAgLy8gbWUtc3BlY2lmaWMgY2FsbGJhY2tzXG4gIGlmIChjYWxsYmFja3MpIHtcbiAgICB0aGlzLm9uQ29udGFjdFVwZGF0ZSA9IGNhbGxiYWNrcy5vbkNvbnRhY3RVcGRhdGU7XG4gIH1cbn07XG5cbi8vIEluaGVyaXQgZXZlcnl0aW5nIGZyb20gdGhlIGdlbmVyaWMgVG9waWNcblRvcGljTWUucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShUb3BpYy5wcm90b3R5cGUsIHtcbiAgLy8gT3ZlcnJpZGUgdGhlIG9yaWdpbmFsIFRvcGljLl9wcm9jZXNzTWV0YVN1YlxuICBfcHJvY2Vzc01ldGFTdWI6IHtcbiAgICB2YWx1ZTogZnVuY3Rpb24oc3Vicykge1xuICAgICAgbGV0IHVwZGF0ZUNvdW50ID0gMDtcbiAgICAgIGZvciAobGV0IGlkeCBpbiBzdWJzKSB7XG4gICAgICAgIGNvbnN0IHN1YiA9IHN1YnNbaWR4XTtcbiAgICAgICAgY29uc3QgdG9waWNOYW1lID0gc3ViLnRvcGljO1xuXG4gICAgICAgIC8vIERvbid0IHNob3cgJ21lJyBhbmQgJ2ZuZCcgdG9waWNzIGluIHRoZSBsaXN0IG9mIGNvbnRhY3RzLlxuICAgICAgICBpZiAodG9waWNOYW1lID09IFRPUElDX0ZORCB8fCB0b3BpY05hbWUgPT0gVE9QSUNfTUUpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBzdWIudXBkYXRlZCA9IG5ldyBEYXRlKHN1Yi51cGRhdGVkKTtcbiAgICAgICAgc3ViLnRvdWNoZWQgPSBzdWIudG91Y2hlZCA/IG5ldyBEYXRlKHN1Yi50b3VjaGVkKSA6IHVuZGVmaW5lZDtcbiAgICAgICAgc3ViLmRlbGV0ZWQgPSBzdWIuZGVsZXRlZCA/IG5ldyBEYXRlKHN1Yi5kZWxldGVkKSA6IG51bGw7XG5cbiAgICAgICAgbGV0IGNvbnQgPSBudWxsO1xuICAgICAgICBpZiAoc3ViLmRlbGV0ZWQpIHtcbiAgICAgICAgICBjb250ID0gc3ViO1xuICAgICAgICAgIGRlbGV0ZSB0aGlzLl9jb250YWN0c1t0b3BpY05hbWVdO1xuICAgICAgICB9IGVsc2UgaWYgKHN1Yi5hY3MgJiYgIXN1Yi5hY3MuaXNKb2luZXIoKSkge1xuICAgICAgICAgIGNvbnQgPSBzdWI7XG4gICAgICAgICAgY29udC5kZWxldGVkID0gbmV3IERhdGUoKTtcbiAgICAgICAgICBkZWxldGUgdGhpcy5fY29udGFjdHNbdG9waWNOYW1lXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBFbnN1cmUgdGhlIHZhbHVlcyBhcmUgZGVmaW5lZCBhbmQgYXJlIGludGVnZXJzLlxuICAgICAgICAgIGlmICh0eXBlb2Ygc3ViLnNlcSAhPSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgc3ViLnNlcSA9IHN1Yi5zZXEgfCAwO1xuICAgICAgICAgICAgc3ViLnJlY3YgPSBzdWIucmVjdiB8IDA7XG4gICAgICAgICAgICBzdWIucmVhZCA9IHN1Yi5yZWFkIHwgMDtcbiAgICAgICAgICAgIHN1Yi51bnJlYWQgPSBzdWIuc2VxIC0gc3ViLnJlYWQ7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHN1Yi5zZWVuICYmIHN1Yi5zZWVuLndoZW4pIHtcbiAgICAgICAgICAgIHN1Yi5zZWVuLndoZW4gPSBuZXcgRGF0ZShzdWIuc2Vlbi53aGVuKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udCA9IG1lcmdlVG9DYWNoZSh0aGlzLl9jb250YWN0cywgdG9waWNOYW1lLCBzdWIpO1xuXG4gICAgICAgICAgaWYgKFRpbm9kZS50b3BpY1R5cGUodG9waWNOYW1lKSA9PSAncDJwJykge1xuICAgICAgICAgICAgdGhpcy5fY2FjaGVQdXRVc2VyKHRvcGljTmFtZSwgY29udCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIE5vdGlmeSB0b3BpYyBvZiB0aGUgdXBkYXRlIGlmIGl0J3MgYW4gZXh0ZXJuYWwgdXBkYXRlLlxuICAgICAgICAgIGlmICghc3ViLl9ub0ZvcndhcmRpbmcpIHtcbiAgICAgICAgICAgIGNvbnN0IHRvcGljID0gdGhpcy5fdGlub2RlLmdldFRvcGljKHRvcGljTmFtZSk7XG4gICAgICAgICAgICBpZiAodG9waWMpIHtcbiAgICAgICAgICAgICAgc3ViLl9ub0ZvcndhcmRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICB0b3BpYy5fcHJvY2Vzc01ldGFEZXNjKHN1Yik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlQ291bnQrKztcblxuICAgICAgICBpZiAodGhpcy5vbk1ldGFTdWIpIHtcbiAgICAgICAgICB0aGlzLm9uTWV0YVN1Yihjb250KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5vblN1YnNVcGRhdGVkKSB7XG4gICAgICAgIHRoaXMub25TdWJzVXBkYXRlZChPYmplY3Qua2V5cyh0aGlzLl9jb250YWN0cyksIHVwZGF0ZUNvdW50KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIHdyaXRhYmxlOiBmYWxzZVxuICB9LFxuXG4gIC8vIENhbGxlZCBieSBUaW5vZGUgd2hlbiBtZXRhLnN1YiBpcyByZWNpdmVkLlxuICBfcHJvY2Vzc01ldGFDcmVkczoge1xuICAgIHZhbHVlOiBmdW5jdGlvbihjcmVkcywgdXBkKSB7XG4gICAgICBpZiAoY3JlZHMubGVuZ3RoID09IDEgJiYgY3JlZHNbMF0gPT0gVGlub2RlLkRFTF9DSEFSKSB7XG4gICAgICAgIGNyZWRzID0gW107XG4gICAgICB9XG4gICAgICBpZiAodXBkKSB7XG4gICAgICAgIGNyZWRzLm1hcCgoY3IpID0+IHtcbiAgICAgICAgICBpZiAoY3IudmFsKSB7XG4gICAgICAgICAgICAvLyBBZGRpbmcgYSBjcmVkZW50aWFsLlxuICAgICAgICAgICAgbGV0IGlkeCA9IHRoaXMuX2NyZWRlbnRpYWxzLmZpbmRJbmRleCgoZWwpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIGVsLm1ldGggPT0gY3IubWV0aCAmJiBlbC52YWwgPT0gY3IudmFsO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoaWR4IDwgMCkge1xuICAgICAgICAgICAgICAvLyBOb3QgZm91bmQuXG4gICAgICAgICAgICAgIGlmICghY3IuZG9uZSkge1xuICAgICAgICAgICAgICAgIC8vIFVuY29uZmlybWVkIGNyZWRlbnRpYWwgcmVwbGFjZXMgcHJldmlvdXMgdW5jb25maXJtZWQgY3JlZGVudGlhbCBvZiB0aGUgc2FtZSBtZXRob2QuXG4gICAgICAgICAgICAgICAgaWR4ID0gdGhpcy5fY3JlZGVudGlhbHMuZmluZEluZGV4KChlbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGVsLm1ldGggPT0gY3IubWV0aCAmJiAhZWwuZG9uZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgICAgICAgICAgICAgIC8vIFJlbW92ZSBwcmV2aW91cyB1bmNvbmZpcm1lZCBjcmVkZW50aWFsLlxuICAgICAgICAgICAgICAgICAgdGhpcy5fY3JlZGVudGlhbHMuc3BsaWNlKGlkeCwgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHRoaXMuX2NyZWRlbnRpYWxzLnB1c2goY3IpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gRm91bmQuIE1heWJlIGNoYW5nZSAnZG9uZScgc3RhdHVzLlxuICAgICAgICAgICAgICB0aGlzLl9jcmVkZW50aWFsc1tpZHhdLmRvbmUgPSBjci5kb25lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoY3IucmVzcCkge1xuICAgICAgICAgICAgLy8gSGFuZGxlIGNyZWRlbnRpYWwgY29uZmlybWF0aW9uLlxuICAgICAgICAgICAgY29uc3QgaWR4ID0gdGhpcy5fY3JlZGVudGlhbHMuZmluZEluZGV4KChlbCkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gZWwubWV0aCA9PSBjci5tZXRoICYmICFlbC5kb25lO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgICAgICAgICAgdGhpcy5fY3JlZGVudGlhbHNbaWR4XS5kb25lID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fY3JlZGVudGlhbHMgPSBjcmVkcztcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm9uQ3JlZHNVcGRhdGVkKSB7XG4gICAgICAgIHRoaXMub25DcmVkc1VwZGF0ZWQodGhpcy5fY3JlZGVudGlhbHMpO1xuICAgICAgfVxuICAgIH0sXG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgd3JpdGFibGU6IGZhbHNlXG4gIH0sXG5cbiAgLy8gUHJvY2VzcyBwcmVzZW5jZSBjaGFuZ2UgbWVzc2FnZVxuICBfcm91dGVQcmVzOiB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uKHByZXMpIHtcbiAgICAgIGlmIChwcmVzLndoYXQgPT0gJ3Rlcm0nKSB7XG4gICAgICAgIC8vIFRoZSAnbWUnIHRvcGljIGl0c2VsZiBpcyBkZXRhY2hlZC4gTWFyayBhcyB1bnN1YnNjcmliZWQuXG4gICAgICAgIHRoaXMuX3Jlc2V0U3ViKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHByZXMud2hhdCA9PSAndXBkJyAmJiBwcmVzLnNyYyA9PSBUT1BJQ19NRSkge1xuICAgICAgICAvLyBVcGRhdGUgdG8gbWUncyBkZXNjcmlwdGlvbi4gUmVxdWVzdCB1cGRhdGVkIHZhbHVlLlxuICAgICAgICB0aGlzLmdldE1ldGEodGhpcy5zdGFydE1ldGFRdWVyeSgpLndpdGhEZXNjKCkuYnVpbGQoKSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgY29udCA9IHRoaXMuX2NvbnRhY3RzW3ByZXMuc3JjXTtcbiAgICAgIGlmIChjb250KSB7XG4gICAgICAgIHN3aXRjaCAocHJlcy53aGF0KSB7XG4gICAgICAgICAgY2FzZSAnb24nOiAvLyB0b3BpYyBjYW1lIG9ubGluZVxuICAgICAgICAgICAgY29udC5vbmxpbmUgPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnb2ZmJzogLy8gdG9waWMgd2VudCBvZmZsaW5lXG4gICAgICAgICAgICBpZiAoY29udC5vbmxpbmUpIHtcbiAgICAgICAgICAgICAgY29udC5vbmxpbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgaWYgKGNvbnQuc2Vlbikge1xuICAgICAgICAgICAgICAgIGNvbnQuc2Vlbi53aGVuID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb250LnNlZW4gPSB7XG4gICAgICAgICAgICAgICAgICB3aGVuOiBuZXcgRGF0ZSgpXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnbXNnJzogLy8gbmV3IG1lc3NhZ2UgcmVjZWl2ZWRcbiAgICAgICAgICAgIGNvbnQudG91Y2hlZCA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICBjb250LnNlcSA9IHByZXMuc2VxIHwgMDtcbiAgICAgICAgICAgIC8vIENoZWNrIGlmIG1lc3NhZ2UgaXMgc2VudCBieSB0aGUgY3VycmVudCB1c2VyLiBJZiBzbyBpdCdzIGJlZW4gcmVhZCBhbHJlYWR5LlxuICAgICAgICAgICAgaWYgKCFwcmVzLmFjdCB8fCB0aGlzLl90aW5vZGUuaXNNZShwcmVzLmFjdCkpIHtcbiAgICAgICAgICAgICAgY29udC5yZWFkID0gY29udC5yZWFkID8gTWF0aC5tYXgoY29udC5yZWFkLCBjb250LnNlcSkgOiBjb250LnNlcTtcbiAgICAgICAgICAgICAgY29udC5yZWN2ID0gY29udC5yZWN2ID8gTWF0aC5tYXgoY29udC5yZWFkLCBjb250LnJlY3YpIDogY29udC5yZWN2O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29udC51bnJlYWQgPSBjb250LnNlcSAtIGNvbnQucmVhZDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3VwZCc6IC8vIGRlc2MgdXBkYXRlZFxuICAgICAgICAgICAgLy8gUmVxdWVzdCB1cGRhdGVkIHN1YnNjcmlwdGlvbi5cbiAgICAgICAgICAgIHRoaXMuZ2V0TWV0YSh0aGlzLnN0YXJ0TWV0YVF1ZXJ5KCkud2l0aExhdGVyT25lU3ViKHByZXMuc3JjKS5idWlsZCgpKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2Fjcyc6IC8vIGFjY2VzcyBtb2RlIGNoYW5nZWRcbiAgICAgICAgICAgIGlmIChjb250LmFjcykge1xuICAgICAgICAgICAgICBjb250LmFjcy51cGRhdGVBbGwocHJlcy5kYWNzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnQuYWNzID0gbmV3IEFjY2Vzc01vZGUoKS51cGRhdGVBbGwocHJlcy5kYWNzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnQudG91Y2hlZCA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICd1YSc6IC8vIHVzZXIgYWdlbnQgY2hhbmdlZFxuICAgICAgICAgICAgY29udC5zZWVuID0ge1xuICAgICAgICAgICAgICB3aGVuOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgICB1YTogcHJlcy51YVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3JlY3YnOiAvLyB1c2VyJ3Mgb3RoZXIgc2Vzc2lvbiBtYXJrZWQgc29tZSBtZXNzZ2VzIGFzIHJlY2VpdmVkXG4gICAgICAgICAgICBwcmVzLnNlcSA9IHByZXMuc2VxIHwgMDtcbiAgICAgICAgICAgIGNvbnQucmVjdiA9IGNvbnQucmVjdiA/IE1hdGgubWF4KGNvbnQucmVjdiwgcHJlcy5zZXEpIDogcHJlcy5zZXE7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdyZWFkJzogLy8gdXNlcidzIG90aGVyIHNlc3Npb24gbWFya2VkIHNvbWUgbWVzc2FnZXMgYXMgcmVhZFxuICAgICAgICAgICAgcHJlcy5zZXEgPSBwcmVzLnNlcSB8IDA7XG4gICAgICAgICAgICBjb250LnJlYWQgPSBjb250LnJlYWQgPyBNYXRoLm1heChjb250LnJlYWQsIHByZXMuc2VxKSA6IHByZXMuc2VxO1xuICAgICAgICAgICAgY29udC5yZWN2ID0gY29udC5yZWN2ID8gTWF0aC5tYXgoY29udC5yZWFkLCBjb250LnJlY3YpIDogY29udC5yZWN2O1xuICAgICAgICAgICAgY29udC51bnJlYWQgPSBjb250LnNlcSAtIGNvbnQucmVhZDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2dvbmUnOiAvLyB0b3BpYyBkZWxldGVkIG9yIHVuc3Vic2NyaWJlZCBmcm9tXG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fY29udGFjdHNbcHJlcy5zcmNdO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnZGVsJzpcbiAgICAgICAgICAgIC8vIFVwZGF0ZSB0b3BpYy5kZWwgdmFsdWUuXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdGhpcy5fdGlub2RlLmxvZ2dlcihcIklORk86IFVuc3VwcG9ydGVkIHByZXNlbmNlIHVwZGF0ZSBpbiAnbWUnXCIsIHByZXMud2hhdCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5vbkNvbnRhY3RVcGRhdGUpIHtcbiAgICAgICAgICB0aGlzLm9uQ29udGFjdFVwZGF0ZShwcmVzLndoYXQsIGNvbnQpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAocHJlcy53aGF0ID09ICdhY3MnKSB7XG4gICAgICAgICAgLy8gTmV3IHN1YnNjcmlwdGlvbnMgYW5kIGRlbGV0ZWQvYmFubmVkIHN1YnNjcmlwdGlvbnMgaGF2ZSBmdWxsXG4gICAgICAgICAgLy8gYWNjZXNzIG1vZGUgKG5vICsgb3IgLSBpbiB0aGUgZGFjcyBzdHJpbmcpLiBDaGFuZ2VzIHRvIGtub3duIHN1YnNjcmlwdGlvbnMgYXJlIHNlbnQgYXNcbiAgICAgICAgICAvLyBkZWx0YXMsIGJ1dCB0aGV5IHNob3VsZCBub3QgaGFwcGVuIGhlcmUuXG4gICAgICAgICAgY29uc3QgYWNzID0gbmV3IEFjY2Vzc01vZGUocHJlcy5kYWNzKTtcbiAgICAgICAgICBpZiAoIWFjcyB8fCBhY3MubW9kZSA9PSBBY2Nlc3NNb2RlLl9JTlZBTElEKSB7XG4gICAgICAgICAgICB0aGlzLl90aW5vZGUubG9nZ2VyKFwiRVJST1I6IEludmFsaWQgYWNjZXNzIG1vZGUgdXBkYXRlXCIsIHByZXMuc3JjLCBwcmVzLmRhY3MpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH0gZWxzZSBpZiAoYWNzLm1vZGUgPT0gQWNjZXNzTW9kZS5fTk9ORSkge1xuICAgICAgICAgICAgdGhpcy5fdGlub2RlLmxvZ2dlcihcIldBUk5JTkc6IFJlbW92aW5nIG5vbi1leGlzdGVudCBzdWJzY3JpcHRpb25cIiwgcHJlcy5zcmMsIHByZXMuZGFjcyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIE5ldyBzdWJzY3JpcHRpb24uIFNlbmQgcmVxdWVzdCBmb3IgdGhlIGZ1bGwgZGVzY3JpcHRpb24uXG4gICAgICAgICAgICAvLyBVc2luZyAud2l0aE9uZVN1YiAobm90IC53aXRoTGF0ZXJPbmVTdWIpIHRvIG1ha2Ugc3VyZSBJZk1vZGlmaWVkU2luY2UgaXMgbm90IHNldC5cbiAgICAgICAgICAgIHRoaXMuZ2V0TWV0YSh0aGlzLnN0YXJ0TWV0YVF1ZXJ5KCkud2l0aE9uZVN1Yih1bmRlZmluZWQsIHByZXMuc3JjKS5idWlsZCgpKTtcbiAgICAgICAgICAgIC8vIENyZWF0ZSBhIGR1bW15IGVudHJ5IHRvIGNhdGNoIG9ubGluZSBzdGF0dXMgdXBkYXRlLlxuICAgICAgICAgICAgdGhpcy5fY29udGFjdHNbcHJlcy5zcmNdID0ge1xuICAgICAgICAgICAgICB0b3VjaGVkOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgICB0b3BpYzogcHJlcy5zcmMsXG4gICAgICAgICAgICAgIG9ubGluZTogZmFsc2UsXG4gICAgICAgICAgICAgIGFjczogYWNzXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChwcmVzLndoYXQgPT0gJ3RhZ3MnKSB7XG4gICAgICAgICAgdGhpcy5nZXRNZXRhKHRoaXMuc3RhcnRNZXRhUXVlcnkoKS53aXRoVGFncygpLmJ1aWxkKCkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm9uUHJlcykge1xuICAgICAgICB0aGlzLm9uUHJlcyhwcmVzKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIHdyaXRhYmxlOiBmYWxzZVxuICB9LFxuXG4gIC8qKlxuICAgKiBQdWJsaXNoaW5nIHRvIFRvcGljTWUgaXMgbm90IHN1cHBvcnRlZC4ge0BsaW5rIFRvcGljI3B1Ymxpc2h9IGlzIG92ZXJyaWRlbiBhbmQgdGhvd3MgYW4ge0Vycm9yfSBpZiBjYWxsZWQuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWNNZSNcbiAgICogQHRocm93cyB7RXJyb3J9IEFsd2F5cyB0aHJvd3MgYW4gZXJyb3IuXG4gICAqL1xuICBwdWJsaXNoOiB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIlB1Ymxpc2hpbmcgdG8gJ21lJyBpcyBub3Qgc3VwcG9ydGVkXCIpKTtcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIHdyaXRhYmxlOiBmYWxzZVxuICB9LFxuXG4gIC8qKlxuICAgKiBEZWxldGUgdmFsaWRhdGlvbiBjcmVkZW50aWFsLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljTWUjXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0b3BpYyAtIE5hbWUgb2YgdGhlIHRvcGljIHRvIGRlbGV0ZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gdXNlciAtIFVzZXIgSUQgdG8gcmVtb3ZlLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIG9uIHJlY2VpdmluZyBzZXJ2ZXIgcmVwbHkuXG4gICAqL1xuICBkZWxDcmVkZW50aWFsOiB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uKG1ldGhvZCwgdmFsdWUpIHtcbiAgICAgIGlmICghdGhpcy5fc3Vic2NyaWJlZCkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiQ2Fubm90IGRlbGV0ZSBjcmVkZW50aWFsIGluIGluYWN0aXZlICdtZScgdG9waWNcIikpO1xuICAgICAgfVxuICAgICAgLy8gU2VuZCB7ZGVsfSBtZXNzYWdlLCByZXR1cm4gcHJvbWlzZVxuICAgICAgcmV0dXJuIHRoaXMuX3Rpbm9kZS5kZWxDcmVkZW50aWFsKHRoaXMubmFtZSwgbWV0aG9kLCB2YWx1ZSkudGhlbigoY3RybCkgPT4ge1xuICAgICAgICAvLyBSZW1vdmUgZGVsZXRlZCBjcmVkZW50aWFsIGZyb20gdGhlIGNhY2hlLlxuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuX2NyZWRlbnRpYWxzLmZpbmRJbmRleCgoZWwpID0+IHtcbiAgICAgICAgICByZXR1cm4gZWwubWV0aCA9PSBtZXRob2QgJiYgZWwudmFsID09IHZhbHVlO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICB0aGlzLl9jcmVkZW50aWFscy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9XG4gICAgICAgIC8vIE5vdGlmeSBsaXN0ZW5lcnNcbiAgICAgICAgaWYgKHRoaXMub25DcmVkc1VwZGF0ZWQpIHtcbiAgICAgICAgICB0aGlzLm9uQ3JlZHNVcGRhdGVkKHRoaXMuX2NyZWRlbnRpYWxzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY3RybDtcbiAgICAgIH0pO1xuXG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICB3cml0YWJsZTogZmFsc2VcbiAgfSxcblxuICAvKipcbiAgICogSXRlcmF0ZSBvdmVyIGNhY2hlZCBjb250YWN0cy4gSWYgY2FsbGJhY2sgaXMgdW5kZWZpbmVkLCB1c2Uge0BsaW5rIHRoaXMub25NZXRhU3VifS5cbiAgICogQGZ1bmN0aW9uXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWNNZSNcbiAgICogQHBhcmFtIHtUb3BpY01lLkNvbnRhY3RDYWxsYmFjaz19IGNhbGxiYWNrIC0gQ2FsbGJhY2sgdG8gY2FsbCBmb3IgZWFjaCBjb250YWN0LlxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBpbmNsdWRlQmFubmVkIC0gSW5jbHVkZSBiYW5uZWQgY29udGFjdHMuXG4gICAqIEBwYXJhbSB7T2JqZWN0PX0gY29udGV4dCAtIENvbnRleHQgdG8gdXNlIGZvciBjYWxsaW5nIHRoZSBgY2FsbGJhY2tgLCBpLmUuIHRoZSB2YWx1ZSBvZiBgdGhpc2AgaW5zaWRlIHRoZSBjYWxsYmFjay5cbiAgICovXG4gIGNvbnRhY3RzOiB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uKGNhbGxiYWNrLCBpbmNsdWRlQmFubmVkLCBjb250ZXh0KSB7XG4gICAgICBjb25zdCBjYiA9IChjYWxsYmFjayB8fCB0aGlzLm9uTWV0YVN1Yik7XG4gICAgICBpZiAoY2IpIHtcbiAgICAgICAgZm9yIChsZXQgaWR4IGluIHRoaXMuX2NvbnRhY3RzKSB7XG4gICAgICAgICAgaWYgKCFpbmNsdWRlQmFubmVkICYmXG4gICAgICAgICAgICAoIXRoaXMuX2NvbnRhY3RzW2lkeF0gfHxcbiAgICAgICAgICAgICAgIXRoaXMuX2NvbnRhY3RzW2lkeF0uYWNzIHx8XG4gICAgICAgICAgICAgICF0aGlzLl9jb250YWN0c1tpZHhdLmFjcy5pc0pvaW5lcigpKSkge1xuXG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2IuY2FsbChjb250ZXh0LCB0aGlzLl9jb250YWN0c1tpZHhdLCBpZHgsIHRoaXMuX2NvbnRhY3RzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgd3JpdGFibGU6IHRydWVcbiAgfSxcblxuICAvKipcbiAgICogVXBkYXRlIGEgY2FjaGVkIGNvbnRhY3Qgd2l0aCBuZXcgcmVhZC9yZWNlaXZlZC9tZXNzYWdlIGNvdW50LlxuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpY01lI1xuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY29udGFjdE5hbWUgLSBVSUQgb2YgY29udGFjdCB0byB1cGRhdGUuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB3aGF0IC0gV2hhY2ggY291bnQgdG8gdXBkYXRlLCBvbmUgb2YgPHR0PlwicmVhZFwiLCBcInJlY3ZcIiwgXCJtc2dcIjwvdHQ+XG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzZXEgLSBOZXcgdmFsdWUgb2YgdGhlIGNvdW50LlxuICAgKiBAcGFyYW0ge0RhdGV9IHRzIC0gVGltZXN0YW1wIG9mIHRoZSB1cGRhdGUuXG4gICAqL1xuICBzZXRNc2dSZWFkUmVjdjoge1xuICAgIHZhbHVlOiBmdW5jdGlvbihjb250YWN0TmFtZSwgd2hhdCwgc2VxLCB0cykge1xuICAgICAgY29uc3QgY29udCA9IHRoaXMuX2NvbnRhY3RzW2NvbnRhY3ROYW1lXTtcbiAgICAgIGxldCBvbGRWYWwsIGRvVXBkYXRlID0gZmFsc2U7XG4gICAgICBsZXQgbW9kZSA9IG51bGw7XG4gICAgICBpZiAoY29udCkge1xuICAgICAgICBzZXEgPSBzZXEgfCAwO1xuICAgICAgICBjb250LnNlcSA9IGNvbnQuc2VxIHwgMDtcbiAgICAgICAgY29udC5yZWFkID0gY29udC5yZWFkIHwgMDtcbiAgICAgICAgY29udC5yZWN2ID0gY29udC5yZWN2IHwgMDtcbiAgICAgICAgc3dpdGNoICh3aGF0KSB7XG4gICAgICAgICAgY2FzZSAncmVjdic6XG4gICAgICAgICAgICBvbGRWYWwgPSBjb250LnJlY3Y7XG4gICAgICAgICAgICBjb250LnJlY3YgPSBNYXRoLm1heChjb250LnJlY3YsIHNlcSk7XG4gICAgICAgICAgICBkb1VwZGF0ZSA9IChvbGRWYWwgIT0gY29udC5yZWN2KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3JlYWQnOlxuICAgICAgICAgICAgb2xkVmFsID0gY29udC5yZWFkO1xuICAgICAgICAgICAgY29udC5yZWFkID0gTWF0aC5tYXgoY29udC5yZWFkLCBzZXEpO1xuICAgICAgICAgICAgZG9VcGRhdGUgPSAob2xkVmFsICE9IGNvbnQucmVhZCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdtc2cnOlxuICAgICAgICAgICAgb2xkVmFsID0gY29udC5zZXE7XG4gICAgICAgICAgICBjb250LnNlcSA9IE1hdGgubWF4KGNvbnQuc2VxLCBzZXEpO1xuICAgICAgICAgICAgaWYgKCFjb250LnRvdWNoZWQgfHwgY29udC50b3VjaGVkIDwgdHMpIHtcbiAgICAgICAgICAgICAgY29udC50b3VjaGVkID0gdHM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkb1VwZGF0ZSA9IChvbGRWYWwgIT0gY29udC5zZXEpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTYW5pdHkgY2hlY2tzLlxuICAgICAgICBpZiAoY29udC5yZWN2IDwgY29udC5yZWFkKSB7XG4gICAgICAgICAgY29udC5yZWN2ID0gY29udC5yZWFkO1xuICAgICAgICAgIGRvVXBkYXRlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29udC5zZXEgPCBjb250LnJlY3YpIHtcbiAgICAgICAgICBjb250LnNlcSA9IGNvbnQucmVjdjtcbiAgICAgICAgICBpZiAoIWNvbnQudG91Y2hlZCB8fCBjb250LnRvdWNoZWQgPCB0cykge1xuICAgICAgICAgICAgY29udC50b3VjaGVkID0gdHM7XG4gICAgICAgICAgfVxuICAgICAgICAgIGRvVXBkYXRlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBjb250LnVucmVhZCA9IGNvbnQuc2VxIC0gY29udC5yZWFkO1xuXG4gICAgICAgIGlmIChkb1VwZGF0ZSAmJiAoIWNvbnQuYWNzIHx8ICFjb250LmFjcy5pc011dGVkKCkpICYmIHRoaXMub25Db250YWN0VXBkYXRlKSB7XG4gICAgICAgICAgdGhpcy5vbkNvbnRhY3RVcGRhdGUod2hhdCwgY29udCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIHdyaXRhYmxlOiB0cnVlXG4gIH0sXG5cbiAgLyoqXG4gICAqIEdldCBhIGNvbnRhY3QgZnJvbSBjYWNoZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpY01lI1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIGNvbnRhY3QgdG8gZ2V0LCBlaXRoZXIgYSBVSUQgKGZvciBwMnAgdG9waWNzKSBvciBhIHRvcGljIG5hbWUuXG4gICAqIEByZXR1cm5zIHtUaW5vZGUuQ29udGFjdH0gLSBDb250YWN0IG9yIGB1bmRlZmluZWRgLlxuICAgKi9cbiAgZ2V0Q29udGFjdDoge1xuICAgIHZhbHVlOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgICByZXR1cm4gdGhpcy5fY29udGFjdHNbbmFtZV07XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICB3cml0YWJsZTogdHJ1ZVxuICB9LFxuXG4gIC8qKlxuICAgKiBHZXQgYWNjZXNzIG1vZGUgb2YgYSBnaXZlbiBjb250YWN0IGZyb20gY2FjaGUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWNNZSNcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBjb250YWN0IHRvIGdldCBhY2Nlc3MgbW9kZSBmb3IsIGVpdGhlciBhIFVJRCAoZm9yIHAycCB0b3BpY3MpIG9yIGEgdG9waWMgbmFtZS5cbiAgICogQHJldHVybnMge3N0cmluZ30gLSBhY2Nlc3MgbW9kZSwgc3VjaCBhcyBgUldQYC5cbiAgICovXG4gIGdldEFjY2Vzc01vZGU6IHtcbiAgICB2YWx1ZTogZnVuY3Rpb24obmFtZSkge1xuICAgICAgY29uc3QgY29udCA9IHRoaXMuX2NvbnRhY3RzW25hbWVdO1xuICAgICAgcmV0dXJuIGNvbnQgPyBjb250LmFjcyA6IG51bGw7XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICB3cml0YWJsZTogdHJ1ZVxuICB9LFxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBjb250YWN0IGlzIGFyY2hpdmVkLCBpLmUuIGNvbnRhY3QucHJpdmF0ZS5hcmNoID09IHRydWUuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWNNZSNcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBjb250YWN0IHRvIGNoZWNrIGFyY2hpdmVkIHN0YXR1cywgZWl0aGVyIGEgVUlEIChmb3IgcDJwIHRvcGljcykgb3IgYSB0b3BpYyBuYW1lLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSB0cnVlIGlmIGNvbnRhY3QgaXMgYXJjaGl2ZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAgICovXG4gIGlzQXJjaGl2ZWQ6IHtcbiAgICB2YWx1ZTogZnVuY3Rpb24obmFtZSkge1xuICAgICAgY29uc3QgY29udCA9IHRoaXMuX2NvbnRhY3RzW25hbWVdO1xuICAgICAgcmV0dXJuIGNvbnQgPyAoKGNvbnQucHJpdmF0ZSAmJiBjb250LnByaXZhdGUuYXJjaCkgPyB0cnVlIDogZmFsc2UpIDogbnVsbDtcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIHdyaXRhYmxlOiB0cnVlXG4gIH0sXG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIFRpbm9kZS5DcmVkZW50aWFsXG4gICAqIEBtZW1iZXJvZiBUaW5vZGVcbiAgICogQHR5cGUgT2JqZWN0XG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBtZXRoIC0gdmFsaWRhdGlvbiBtZXRob2Qgc3VjaCBhcyAnZW1haWwnIG9yICd0ZWwnLlxuICAgKiBAcHJvcGVydHkge3N0cmluZ30gdmFsIC0gY3JlZGVudGlhbCB2YWx1ZSwgaS5lLiAnamRvZUBleGFtcGxlLmNvbScgb3IgJysxNzAyNTU1MTIzNCdcbiAgICogQHByb3BlcnR5IHtib29sZWFufSBkb25lIC0gdHJ1ZSBpZiBjcmVkZW50aWFsIGlzIHZhbGlkYXRlZC5cbiAgICovXG4gIC8qKlxuICAgKiBHZXQgdGhlIHVzZXIncyBjcmVkZW50aWFsczogZW1haWwsIHBob25lLCBldGMuXG4gICAqIEBtZW1iZXJvZiBUaW5vZGUuVG9waWNNZSNcbiAgICpcbiAgICogQHJldHVybnMge1Rpbm9kZS5DcmVkZW50aWFsW119IC0gYXJyYXkgb2YgY3JlZGVudGlhbHMuXG4gICAqL1xuICBnZXRDcmVkZW50aWFsczoge1xuICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9jcmVkZW50aWFscztcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIHdyaXRhYmxlOiB0cnVlXG4gIH1cbn0pO1xuVG9waWNNZS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBUb3BpY01lO1xuXG4vKipcbiAqIEBjbGFzcyBUb3BpY0ZuZCAtIHNwZWNpYWwgY2FzZSBvZiB7QGxpbmsgVGlub2RlLlRvcGljfSBmb3Igc2VhcmNoaW5nIGZvclxuICogY29udGFjdHMgYW5kIGdyb3VwIHRvcGljcy5cbiAqIEBleHRlbmRzIFRpbm9kZS5Ub3BpY1xuICogQG1lbWJlcm9mIFRpbm9kZVxuICpcbiAqIEBwYXJhbSB7VG9waWNGbmQuQ2FsbGJhY2tzfSBjYWxsYmFja3MgLSBDYWxsYmFja3MgdG8gcmVjZWl2ZSB2YXJpb3VzIGV2ZW50cy5cbiAqL1xudmFyIFRvcGljRm5kID0gZnVuY3Rpb24oY2FsbGJhY2tzKSB7XG4gIFRvcGljLmNhbGwodGhpcywgVE9QSUNfRk5ELCBjYWxsYmFja3MpO1xuICAvLyBMaXN0IG9mIHVzZXJzIGFuZCB0b3BpY3MgdWlkIG9yIHRvcGljX25hbWUgLT4gQ29udGFjdCBvYmplY3QpXG4gIHRoaXMuX2NvbnRhY3RzID0ge307XG59O1xuXG4vLyBJbmhlcml0IGV2ZXJ5dGluZyBmcm9tIHRoZSBnZW5lcmljIFRvcGljXG5Ub3BpY0ZuZC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFRvcGljLnByb3RvdHlwZSwge1xuICAvLyBPdmVycmlkZSB0aGUgb3JpZ2luYWwgVG9waWMuX3Byb2Nlc3NNZXRhU3ViXG4gIF9wcm9jZXNzTWV0YVN1Yjoge1xuICAgIHZhbHVlOiBmdW5jdGlvbihzdWJzKSB7XG4gICAgICBsZXQgdXBkYXRlQ291bnQgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0aGlzLl9jb250YWN0cykubGVuZ3RoO1xuICAgICAgLy8gUmVzZXQgY29udGFjdCBsaXN0LlxuICAgICAgdGhpcy5fY29udGFjdHMgPSB7fTtcbiAgICAgIGZvciAobGV0IGlkeCBpbiBzdWJzKSB7XG4gICAgICAgIGxldCBzdWIgPSBzdWJzW2lkeF07XG4gICAgICAgIGNvbnN0IGluZGV4QnkgPSBzdWIudG9waWMgPyBzdWIudG9waWMgOiBzdWIudXNlcjtcblxuICAgICAgICBzdWIudXBkYXRlZCA9IG5ldyBEYXRlKHN1Yi51cGRhdGVkKTtcbiAgICAgICAgaWYgKHN1Yi5zZWVuICYmIHN1Yi5zZWVuLndoZW4pIHtcbiAgICAgICAgICBzdWIuc2Vlbi53aGVuID0gbmV3IERhdGUoc3ViLnNlZW4ud2hlbik7XG4gICAgICAgIH1cblxuICAgICAgICBzdWIgPSBtZXJnZVRvQ2FjaGUodGhpcy5fY29udGFjdHMsIGluZGV4QnksIHN1Yik7XG4gICAgICAgIHVwZGF0ZUNvdW50Kys7XG5cbiAgICAgICAgaWYgKHRoaXMub25NZXRhU3ViKSB7XG4gICAgICAgICAgdGhpcy5vbk1ldGFTdWIoc3ViKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodXBkYXRlQ291bnQgPiAwICYmIHRoaXMub25TdWJzVXBkYXRlZCkge1xuICAgICAgICB0aGlzLm9uU3Vic1VwZGF0ZWQoT2JqZWN0LmtleXModGhpcy5fY29udGFjdHMpKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIHdyaXRhYmxlOiBmYWxzZVxuICB9LFxuXG4gIC8qKlxuICAgKiBQdWJsaXNoaW5nIHRvIFRvcGljRm5kIGlzIG5vdCBzdXBwb3J0ZWQuIHtAbGluayBUb3BpYyNwdWJsaXNofSBpcyBvdmVycmlkZW4gYW5kIHRob3dzIGFuIHtFcnJvcn0gaWYgY2FsbGVkLlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLlRvcGljRm5kI1xuICAgKiBAdGhyb3dzIHtFcnJvcn0gQWx3YXlzIHRocm93cyBhbiBlcnJvci5cbiAgICovXG4gIHB1Ymxpc2g6IHtcbiAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiUHVibGlzaGluZyB0byAnZm5kJyBpcyBub3Qgc3VwcG9ydGVkXCIpKTtcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIHdyaXRhYmxlOiBmYWxzZVxuICB9LFxuXG4gIC8qKlxuICAgKiBzZXRNZXRhIHRvIFRvcGljRm5kIHJlc2V0cyBjb250YWN0IGxpc3QgaW4gYWRkaXRpb24gdG8gc2VuZGluZyB0aGUgbWVzc2FnZS5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpY0ZuZCNcbiAgICogQHBhcmFtIHtUaW5vZGUuU2V0UGFyYW1zfSBwYXJhbXMgcGFyYW1ldGVycyB0byB1cGRhdGUuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHRvIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHNlcnZlciByZXNwb25kcyB0byByZXF1ZXN0LlxuICAgKi9cbiAgc2V0TWV0YToge1xuICAgIHZhbHVlOiBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcztcbiAgICAgIHJldHVybiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoVG9waWNGbmQucHJvdG90eXBlKS5zZXRNZXRhLmNhbGwodGhpcywgcGFyYW1zKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoT2JqZWN0LmtleXMoaW5zdGFuY2UuX2NvbnRhY3RzKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgaW5zdGFuY2UuX2NvbnRhY3RzID0ge307XG4gICAgICAgICAgaWYgKGluc3RhbmNlLm9uU3Vic1VwZGF0ZWQpIHtcbiAgICAgICAgICAgIGluc3RhbmNlLm9uU3Vic1VwZGF0ZWQoW10pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICB3cml0YWJsZTogZmFsc2VcbiAgfSxcblxuICAvKipcbiAgICogSXRlcmF0ZSBvdmVyIGZvdW5kIGNvbnRhY3RzLiBJZiBjYWxsYmFjayBpcyB1bmRlZmluZWQsIHVzZSB7QGxpbmsgdGhpcy5vbk1ldGFTdWJ9LlxuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5Ub3BpY0ZuZCNcbiAgICogQHBhcmFtIHtUb3BpY0ZuZC5Db250YWN0Q2FsbGJhY2t9IGNhbGxiYWNrIC0gQ2FsbGJhY2sgdG8gY2FsbCBmb3IgZWFjaCBjb250YWN0LlxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCAtIENvbnRleHQgdG8gdXNlIGZvciBjYWxsaW5nIHRoZSBgY2FsbGJhY2tgLCBpLmUuIHRoZSB2YWx1ZSBvZiBgdGhpc2AgaW5zaWRlIHRoZSBjYWxsYmFjay5cbiAgICovXG4gIGNvbnRhY3RzOiB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgICBjb25zdCBjYiA9IChjYWxsYmFjayB8fCB0aGlzLm9uTWV0YVN1Yik7XG4gICAgICBpZiAoY2IpIHtcbiAgICAgICAgZm9yIChsZXQgaWR4IGluIHRoaXMuX2NvbnRhY3RzKSB7XG4gICAgICAgICAgY2IuY2FsbChjb250ZXh0LCB0aGlzLl9jb250YWN0c1tpZHhdLCBpZHgsIHRoaXMuX2NvbnRhY3RzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgd3JpdGFibGU6IHRydWVcbiAgfVxufSk7XG5Ub3BpY0ZuZC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBUb3BpY0ZuZDtcblxuLyoqXG4gKiBAY2xhc3MgTGFyZ2VGaWxlSGVscGVyIC0gY29sbGVjdGlvbiBvZiB1dGlsaXRpZXMgZm9yIHVwbG9hZGluZyBhbmQgZG93bmxvYWRpbmcgZmlsZXNcbiAqIG91dCBvZiBiYW5kLiBEb24ndCBpbnN0YW50aWF0ZSB0aGlzIGNsYXNzIGRpcmVjdGx5LiBVc2Uge1Rpbm9kZS5nZXRMYXJnZUZpbGVIZWxwZXJ9IGluc3RlYWQuXG4gKiBAbWVtYmVyb2YgVGlub2RlXG4gKlxuICogQHBhcmFtIHtUaW5vZGV9IHRpbm9kZSAtIHRoZSBtYWluIFRpbm9kZSBvYmplY3QuXG4gKi9cbnZhciBMYXJnZUZpbGVIZWxwZXIgPSBmdW5jdGlvbih0aW5vZGUpIHtcbiAgdGhpcy5fdGlub2RlID0gdGlub2RlO1xuXG4gIHRoaXMuX2FwaUtleSA9IHRpbm9kZS5fYXBpS2V5O1xuICB0aGlzLl9hdXRoVG9rZW4gPSB0aW5vZGUuZ2V0QXV0aFRva2VuKCk7XG4gIHRoaXMuX21zZ0lkID0gdGlub2RlLmdldE5leHRVbmlxdWVJZCgpO1xuICB0aGlzLnhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gIC8vIFByb21pc2VcbiAgdGhpcy50b1Jlc29sdmUgPSBudWxsO1xuICB0aGlzLnRvUmVqZWN0ID0gbnVsbDtcblxuICAvLyBDYWxsYmFja3NcbiAgdGhpcy5vblByb2dyZXNzID0gbnVsbDtcbiAgdGhpcy5vblN1Y2Nlc3MgPSBudWxsO1xuICB0aGlzLm9uRmFpbHVyZSA9IG51bGw7XG59XG5cbkxhcmdlRmlsZUhlbHBlci5wcm90b3R5cGUgPSB7XG4gIC8qKlxuICAgKiBTdGFydCB1cGxvYWRpbmcgdGhlIGZpbGUgdG8gYSBub24tZGVmYXVsdCBlbmRwb2ludC5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZS5MYXJnZUZpbGVIZWxwZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBiYXNlVXJsIGFsdGVybmF0aXZlIGJhc2UgVVJMIG9mIHVwbG9hZCBzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7RmlsZX0gZmlsZSB0byB1cGxvYWRcbiAgICogQHBhcmFtIHtDYWxsYmFja30gb25Qcm9ncmVzcyBjYWxsYmFjay4gVGFrZXMgb25lIHtmbG9hdH0gcGFyYW1ldGVyIDAuLjFcbiAgICogQHBhcmFtIHtDYWxsYmFja30gb25TdWNjZXNzIGNhbGxiYWNrLiBDYWxsZWQgd2hlbiB0aGUgZmlsZSBpcyBzdWNjZXNzZnVsbHkgdXBsb2FkZWQuXG4gICAqIEBwYXJhbSB7Q2FsbGJhY2t9IG9uRmFpbHVyZSBjYWxsYmFjay4gQ2FsbGVkIGluIGNhc2Ugb2YgYSBmYWlsdXJlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgdXBsb2FkIGlzIGNvbXBsZXRlZC9mYWlsZWQuXG4gICAqL1xuICB1cGxvYWRXaXRoQmFzZVVybDogZnVuY3Rpb24oYmFzZVVybCwgZmlsZSwgb25Qcm9ncmVzcywgb25TdWNjZXNzLCBvbkZhaWx1cmUpIHtcbiAgICBpZiAoIXRoaXMuX2F1dGhUb2tlbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTXVzdCBhdXRoZW50aWNhdGUgZmlyc3RcIik7XG4gICAgfVxuICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcztcblxuICAgIGxldCB1cmwgPSAnL3YnICsgUFJPVE9DT0xfVkVSU0lPTiArICcvZmlsZS91Lyc7XG4gICAgaWYgKGJhc2VVcmwpIHtcbiAgICAgIGlmIChiYXNlVXJsLmluZGV4T2YoJ2h0dHA6Ly8nKSA9PSAwIHx8IGJhc2VVcmwuaW5kZXhPZignaHR0cHM6Ly8nKSA9PSAwKSB7XG4gICAgICAgIHVybCA9IGJhc2VVcmwgKyB1cmw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGJhc2UgVVJMICdcIiArIGJhc2VVcmwgKyBcIidcIik7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMueGhyLm9wZW4oJ1BPU1QnLCB1cmwsIHRydWUpO1xuICAgIHRoaXMueGhyLnNldFJlcXVlc3RIZWFkZXIoJ1gtVGlub2RlLUFQSUtleScsIHRoaXMuX2FwaUtleSk7XG4gICAgdGhpcy54aHIuc2V0UmVxdWVzdEhlYWRlcignWC1UaW5vZGUtQXV0aCcsICdUb2tlbiAnICsgdGhpcy5fYXV0aFRva2VuLnRva2VuKTtcbiAgICBjb25zdCByZXN1bHQgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLnRvUmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgICB0aGlzLnRvUmVqZWN0ID0gcmVqZWN0O1xuICAgIH0pO1xuXG4gICAgdGhpcy5vblByb2dyZXNzID0gb25Qcm9ncmVzcztcbiAgICB0aGlzLm9uU3VjY2VzcyA9IG9uU3VjY2VzcztcbiAgICB0aGlzLm9uRmFpbHVyZSA9IG9uRmFpbHVyZTtcblxuICAgIHRoaXMueGhyLnVwbG9hZC5vbnByb2dyZXNzID0gZnVuY3Rpb24oZSkge1xuICAgICAgaWYgKGUubGVuZ3RoQ29tcHV0YWJsZSAmJiBpbnN0YW5jZS5vblByb2dyZXNzKSB7XG4gICAgICAgIGluc3RhbmNlLm9uUHJvZ3Jlc3MoZS5sb2FkZWQgLyBlLnRvdGFsKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIGxldCBwa3Q7XG4gICAgICB0cnkge1xuICAgICAgICBwa3QgPSBKU09OLnBhcnNlKHRoaXMucmVzcG9uc2UsIGpzb25QYXJzZUhlbHBlcik7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgaW5zdGFuY2UuX3Rpbm9kZS5sb2dnZXIoXCJFUlJPUjogSW52YWxpZCBzZXJ2ZXIgcmVzcG9uc2UgaW4gTGFyZ2VGaWxlSGVscGVyXCIsIHRoaXMucmVzcG9uc2UpO1xuICAgICAgICBwa3QgPSB7XG4gICAgICAgICAgY3RybDoge1xuICAgICAgICAgICAgY29kZTogdGhpcy5zdGF0dXMsXG4gICAgICAgICAgICB0ZXh0OiB0aGlzLnN0YXR1c1RleHRcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnN0YXR1cyA+PSAyMDAgJiYgdGhpcy5zdGF0dXMgPCAzMDApIHtcbiAgICAgICAgaWYgKGluc3RhbmNlLnRvUmVzb2x2ZSkge1xuICAgICAgICAgIGluc3RhbmNlLnRvUmVzb2x2ZShwa3QuY3RybC5wYXJhbXMudXJsKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5zdGFuY2Uub25TdWNjZXNzKSB7XG4gICAgICAgICAgaW5zdGFuY2Uub25TdWNjZXNzKHBrdC5jdHJsKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLnN0YXR1cyA+PSA0MDApIHtcbiAgICAgICAgaWYgKGluc3RhbmNlLnRvUmVqZWN0KSB7XG4gICAgICAgICAgaW5zdGFuY2UudG9SZWplY3QobmV3IEVycm9yKHBrdC5jdHJsLnRleHQgKyBcIiAoXCIgKyBwa3QuY3RybC5jb2RlICsgXCIpXCIpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5zdGFuY2Uub25GYWlsdXJlKSB7XG4gICAgICAgICAgaW5zdGFuY2Uub25GYWlsdXJlKHBrdC5jdHJsKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnN0YW5jZS5fdGlub2RlLmxvZ2dlcihcIkVSUk9SOiBVbmV4cGVjdGVkIHNlcnZlciByZXNwb25zZSBzdGF0dXNcIiwgdGhpcy5zdGF0dXMsIHRoaXMucmVzcG9uc2UpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLnhoci5vbmVycm9yID0gZnVuY3Rpb24oZSkge1xuICAgICAgaWYgKGluc3RhbmNlLnRvUmVqZWN0KSB7XG4gICAgICAgIGluc3RhbmNlLnRvUmVqZWN0KG5ldyBFcnJvcihcImZhaWxlZFwiKSk7XG4gICAgICB9XG4gICAgICBpZiAoaW5zdGFuY2Uub25GYWlsdXJlKSB7XG4gICAgICAgIGluc3RhbmNlLm9uRmFpbHVyZShudWxsKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy54aHIub25hYm9ydCA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgIGlmIChpbnN0YW5jZS50b1JlamVjdCkge1xuICAgICAgICBpbnN0YW5jZS50b1JlamVjdChuZXcgRXJyb3IoXCJ1cGxvYWQgY2FuY2VsbGVkIGJ5IHVzZXJcIikpO1xuICAgICAgfVxuICAgICAgaWYgKGluc3RhbmNlLm9uRmFpbHVyZSkge1xuICAgICAgICBpbnN0YW5jZS5vbkZhaWx1cmUobnVsbCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCBmb3JtID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgICBmb3JtLmFwcGVuZCgnZmlsZScsIGZpbGUpO1xuICAgICAgZm9ybS5zZXQoJ2lkJywgdGhpcy5fbXNnSWQpO1xuICAgICAgdGhpcy54aHIuc2VuZChmb3JtKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGlmICh0aGlzLnRvUmVqZWN0KSB7XG4gICAgICAgIHRoaXMudG9SZWplY3QoZXJyKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm9uRmFpbHVyZSkge1xuICAgICAgICB0aGlzLm9uRmFpbHVyZShudWxsKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LFxuXG4gIC8qKlxuICAgKiBTdGFydCB1cGxvYWRpbmcgdGhlIGZpbGUgdG8gZGVmYXVsdCBlbmRwb2ludC5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZS5MYXJnZUZpbGVIZWxwZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7RmlsZX0gZmlsZSB0byB1cGxvYWRcbiAgICogQHBhcmFtIHtDYWxsYmFja30gb25Qcm9ncmVzcyBjYWxsYmFjay4gVGFrZXMgb25lIHtmbG9hdH0gcGFyYW1ldGVyIDAuLjFcbiAgICogQHBhcmFtIHtDYWxsYmFja30gb25TdWNjZXNzIGNhbGxiYWNrLiBDYWxsZWQgd2hlbiB0aGUgZmlsZSBpcyBzdWNjZXNzZnVsbHkgdXBsb2FkZWQuXG4gICAqIEBwYXJhbSB7Q2FsbGJhY2t9IG9uRmFpbHVyZSBjYWxsYmFjay4gQ2FsbGVkIGluIGNhc2Ugb2YgYSBmYWlsdXJlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgdXBsb2FkIGlzIGNvbXBsZXRlZC9mYWlsZWQuXG4gICAqL1xuICB1cGxvYWQ6IGZ1bmN0aW9uKGZpbGUsIG9uUHJvZ3Jlc3MsIG9uU3VjY2Vzcywgb25GYWlsdXJlKSB7XG4gICAgcmV0dXJuIHRoaXMudXBsb2FkV2l0aEJhc2VVcmwodW5kZWZpbmVkLCBmaWxlLCBvblByb2dyZXNzLCBvblN1Y2Nlc3MsIG9uRmFpbHVyZSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIERvd25sb2FkIHRoZSBmaWxlIGZyb20gYSBnaXZlbiBVUkwgdXNpbmcgR0VUIHJlcXVlc3QuIFRoaXMgbWV0aG9kIHdvcmtzIHdpdGggdGhlIFRpbm9kZSBzZXJ2ZXIgb25seS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFRpbm9kZS5MYXJnZUZpbGVIZWxwZXIjXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSByZWxhdGl2ZVVybCAtIFVSTCB0byBkb3dubG9hZCB0aGUgZmlsZSBmcm9tLiBNdXN0IGJlIHJlbGF0aXZlIHVybCwgaS5lLiBtdXN0IG5vdCBjb250YWluIHRoZSBob3N0LlxuICAgKiBAcGFyYW0ge1N0cmluZz19IGZpbGVuYW1lIC0gZmlsZSBuYW1lIHRvIHVzZSBmb3IgdGhlIGRvd25sb2FkZWQgZmlsZS5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIGRvd25sb2FkIGlzIGNvbXBsZXRlZC9mYWlsZWQuXG4gICAqL1xuICBkb3dubG9hZDogZnVuY3Rpb24ocmVsYXRpdmVVcmwsIGZpbGVuYW1lLCBtaW1ldHlwZSwgb25Qcm9ncmVzcykge1xuICAgIC8vIENoZWNrIGlmIHRoZSBVUkwgaXMgcmVsYXRpdmUuIENoZWNrIGZvciBjYXNlcyBsaWtlOlxuICAgIC8vICAnaHR0cDovL2V4YW1wbGUuY29tJ1xuICAgIC8vICAnIGh0dHA6Ly9leGFtcGxlLmNvbSdcbiAgICAvLyAgJy8vZXhhbXBsZS5jb20vJ1xuICAgIC8vICAnaHR0cDpleGFtcGxlLmNvbSdcbiAgICAvLyAgJ2h0dHA6L2V4YW1wbGUuY29tJ1xuICAgIGlmICgvXlxccyooW2Etel1bYS16MC05Ky4tXSo6fFxcL1xcLykvaW0udGVzdChyZWxhdGl2ZVVybCkpIHtcbiAgICAgIC8vIEFzIGEgc2VjdXJpdHkgbWVhc3VyZSByZWZ1c2UgdG8gZG93bmxvYWQgZnJvbSBhbiBhYnNvbHV0ZSBVUkwuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgVVJMICdcIiArIHJlbGF0aXZlVXJsICsgXCInIG11c3QgYmUgcmVsYXRpdmUsIG5vdCBhYnNvbHV0ZVwiKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLl9hdXRoVG9rZW4pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIk11c3QgYXV0aGVudGljYXRlIGZpcnN0XCIpO1xuICAgIH1cbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXM7XG4gICAgLy8gR2V0IGRhdGEgYXMgYmxvYiAoc3RvcmVkIGJ5IHRoZSBicm93c2VyIGFzIGEgdGVtcG9yYXJ5IGZpbGUpLlxuICAgIHRoaXMueGhyLm9wZW4oJ0dFVCcsIHJlbGF0aXZlVXJsLCB0cnVlKTtcbiAgICB0aGlzLnhoci5zZXRSZXF1ZXN0SGVhZGVyKCdYLVRpbm9kZS1BUElLZXknLCB0aGlzLl9hcGlLZXkpO1xuICAgIHRoaXMueGhyLnNldFJlcXVlc3RIZWFkZXIoJ1gtVGlub2RlLUF1dGgnLCAnVG9rZW4gJyArIHRoaXMuX2F1dGhUb2tlbi50b2tlbik7XG4gICAgdGhpcy54aHIucmVzcG9uc2VUeXBlID0gJ2Jsb2InO1xuXG4gICAgdGhpcy5vblByb2dyZXNzID0gb25Qcm9ncmVzcztcbiAgICB0aGlzLnhoci5vbnByb2dyZXNzID0gZnVuY3Rpb24oZSkge1xuICAgICAgaWYgKGluc3RhbmNlLm9uUHJvZ3Jlc3MpIHtcbiAgICAgICAgLy8gUGFzc2luZyBlLmxvYWRlZCBpbnN0ZWFkIG9mIGUubG9hZGVkL2UudG90YWwgYmVjYXVzZSBlLnRvdGFsXG4gICAgICAgIC8vIGlzIGFsd2F5cyAwIHdpdGggZ3ppcCBjb21wcmVzc2lvbiBlbmFibGVkIGJ5IHRoZSBzZXJ2ZXIuXG4gICAgICAgIGluc3RhbmNlLm9uUHJvZ3Jlc3MoZS5sb2FkZWQpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCByZXN1bHQgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLnRvUmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgICB0aGlzLnRvUmVqZWN0ID0gcmVqZWN0O1xuICAgIH0pO1xuXG4gICAgLy8gVGhlIGJsb2IgbmVlZHMgdG8gYmUgc2F2ZWQgYXMgZmlsZS4gVGhlcmUgaXMgbm8ga25vd24gd2F5IHRvXG4gICAgLy8gc2F2ZSB0aGUgYmxvYiBhcyBmaWxlIG90aGVyIHRoYW4gdG8gZmFrZSBhIGNsaWNrIG9uIGFuIDxhIGhyZWYuLi4gZG93bmxvYWQ9Li4uPi5cbiAgICB0aGlzLnhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLnN0YXR1cyA9PSAyMDApIHtcbiAgICAgICAgY29uc3QgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgICAgLy8gVVJMLmNyZWF0ZU9iamVjdFVSTCBpcyBub3QgYXZhaWxhYmxlIGluIG5vbi1icm93c2VyIGVudmlyb25tZW50LiBUaGlzIGNhbGwgd2lsbCBmYWlsLlxuICAgICAgICBsaW5rLmhyZWYgPSB3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTChuZXcgQmxvYihbdGhpcy5yZXNwb25zZV0sIHtcbiAgICAgICAgICB0eXBlOiBtaW1ldHlwZVxuICAgICAgICB9KSk7XG4gICAgICAgIGxpbmsuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgbGluay5zZXRBdHRyaWJ1dGUoJ2Rvd25sb2FkJywgZmlsZW5hbWUpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpbmspO1xuICAgICAgICBsaW5rLmNsaWNrKCk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQobGluayk7XG4gICAgICAgIHdpbmRvdy5VUkwucmV2b2tlT2JqZWN0VVJMKGxpbmsuaHJlZik7XG4gICAgICAgIGlmIChpbnN0YW5jZS50b1Jlc29sdmUpIHtcbiAgICAgICAgICBpbnN0YW5jZS50b1Jlc29sdmUoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLnN0YXR1cyA+PSA0MDAgJiYgaW5zdGFuY2UudG9SZWplY3QpIHtcbiAgICAgICAgLy8gVGhlIHRoaXMucmVzcG9uc2VUZXh0IGlzIHVuZGVmaW5lZCwgbXVzdCB1c2UgdGhpcy5yZXNwb25zZSB3aGljaCBpcyBhIGJsb2IuXG4gICAgICAgIC8vIE5lZWQgdG8gY29udmVydCB0aGlzLnJlc3BvbnNlIHRvIEpTT04uIFRoZSBibG9iIGNhbiBvbmx5IGJlIGFjY2Vzc2VkIGJ5IHRoZVxuICAgICAgICAvLyBGaWxlUmVhZGVyLlxuICAgICAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHBrdCA9IEpTT04ucGFyc2UodGhpcy5yZXN1bHQsIGpzb25QYXJzZUhlbHBlcik7XG4gICAgICAgICAgICBpbnN0YW5jZS50b1JlamVjdChuZXcgRXJyb3IocGt0LmN0cmwudGV4dCArIFwiIChcIiArIHBrdC5jdHJsLmNvZGUgKyBcIilcIikpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgaW5zdGFuY2UuX3Rpbm9kZS5sb2dnZXIoXCJFUlJPUjogSW52YWxpZCBzZXJ2ZXIgcmVzcG9uc2UgaW4gTGFyZ2VGaWxlSGVscGVyXCIsIHRoaXMucmVzdWx0KTtcbiAgICAgICAgICAgIGluc3RhbmNlLnRvUmVqZWN0KGVycik7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZWFkZXIucmVhZEFzVGV4dCh0aGlzLnJlc3BvbnNlKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy54aHIub25lcnJvciA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgIGlmIChpbnN0YW5jZS50b1JlamVjdCkge1xuICAgICAgICBpbnN0YW5jZS50b1JlamVjdChuZXcgRXJyb3IoXCJmYWlsZWRcIikpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLnhoci5vbmFib3J0ID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoaW5zdGFuY2UudG9SZWplY3QpIHtcbiAgICAgICAgaW5zdGFuY2UudG9SZWplY3QobnVsbCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRyeSB7XG4gICAgICB0aGlzLnhoci5zZW5kKCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBpZiAodGhpcy50b1JlamVjdCkge1xuICAgICAgICB0aGlzLnRvUmVqZWN0KGVycik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSxcblxuICAvKipcbiAgICogVHJ5IHRvIGNhbmNlbCBhbiBvbmdvaW5nIHVwbG9hZCBvciBkb3dubG9hZC5cbiAgICogQG1lbWJlcm9mIFRpbm9kZS5MYXJnZUZpbGVIZWxwZXIjXG4gICAqL1xuICBjYW5jZWw6IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLnhociAmJiB0aGlzLnhoci5yZWFkeVN0YXRlIDwgNCkge1xuICAgICAgdGhpcy54aHIuYWJvcnQoKTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIEdldCB1bmlxdWUgaWQgb2YgdGhpcyByZXF1ZXN0LlxuICAgKiBAbWVtYmVyb2YgVGlub2RlLkxhcmdlRmlsZUhlbHBlciNcbiAgICpcbiAgICogQHJldHVybnMge3N0cmluZ30gdW5pcXVlIGlkXG4gICAqL1xuICBnZXRJZDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX21zZ0lkO1xuICB9XG59O1xuXG4vKipcbiAqIEBjbGFzcyBNZXNzYWdlIC0gZGVmaW5pdGlvbiBhIGNvbW11bmljYXRpb24gbWVzc2FnZS5cbiAqIFdvcmsgaW4gcHJvZ3Jlc3MuXG4gKiBAbWVtYmVyb2YgVGlub2RlXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRvcGljXyAtIG5hbWUgb2YgdGhlIHRvcGljIHRoZSBtZXNzYWdlIGJlbG9uZ3MgdG8uXG4gKiBAcGFyYW0ge3N0cmluZyB8IERyYWZ0eX0gY29udGVudF8gLSBtZXNzYWdlIGNvbnRhbnQuXG4gKi9cbnZhciBNZXNzYWdlID0gZnVuY3Rpb24odG9waWNfLCBjb250ZW50Xykge1xuICB0aGlzLnN0YXR1cyA9IE1lc3NhZ2UuU1RBVFVTX05PTkU7XG4gIHRoaXMudG9waWMgPSB0b3BpY187XG4gIHRoaXMuY29udGVudCA9IGNvbnRlbnRfO1xufVxuXG5NZXNzYWdlLlNUQVRVU19OT05FID0gTUVTU0FHRV9TVEFUVVNfTk9ORTtcbk1lc3NhZ2UuU1RBVFVTX1FVRVVFRCA9IE1FU1NBR0VfU1RBVFVTX1FVRVVFRDtcbk1lc3NhZ2UuU1RBVFVTX1NFTkRJTkcgPSBNRVNTQUdFX1NUQVRVU19TRU5ESU5HO1xuTWVzc2FnZS5TVEFUVVNfRkFJTEVEID0gTUVTU0FHRV9TVEFUVVNfRkFJTEVEO1xuTWVzc2FnZS5TVEFUVVNfU0VOVCA9IE1FU1NBR0VfU1RBVFVTX1NFTlQ7XG5NZXNzYWdlLlNUQVRVU19SRUNFSVZFRCA9IE1FU1NBR0VfU1RBVFVTX1JFQ0VJVkVEO1xuTWVzc2FnZS5TVEFUVVNfUkVBRCA9IE1FU1NBR0VfU1RBVFVTX1JFQUQ7XG5NZXNzYWdlLlNUQVRVU19UT19NRSA9IE1FU1NBR0VfU1RBVFVTX1RPX01FO1xuXG5NZXNzYWdlLnByb3RvdHlwZSA9IHtcbiAgLyoqXG4gICAqIENvbnZlcnQgbWVzc2FnZSBvYmplY3QgdG8ge3B1Yn0gcGFja2V0LlxuICAgKi9cbiAgdG9KU09OOiBmdW5jdGlvbigpIHtcblxuICB9LFxuICAvKipcbiAgICogUGFyc2UgSlNPTiBpbnRvIG1lc3NhZ2UuXG4gICAqL1xuICBmcm9tSlNPTjogZnVuY3Rpb24oanNvbikge1xuXG4gIH1cbn1cbk1lc3NhZ2UucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gTWVzc2FnZTtcblxuaWYgKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBUaW5vZGU7XG4gIG1vZHVsZS5leHBvcnRzLkRyYWZ0eSA9IERyYWZ0eTtcbn1cbiIsIm1vZHVsZS5leHBvcnRzPXtcInZlcnNpb25cIjogXCIwLjE2LjMtcmM5XCJ9XG4iXX0=

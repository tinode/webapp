// Basic parser and formatter for very simple text markup. Mostly targeted at
// mobile use cases similar to Telegram and WhatsApp.
//
// Supports:
//   *abc* -> <b>abc</b>
//   _abc_ -> <i>abc</i>
//   ~abc~ -> <del>abc</del>
//   `abc` -> <tt>abc</tt>
// Nested frmatting is supported, e.g. *abc _def_* -> <b>abc <i>def</i></b>
//
// URLs, @mentions, and #hashtags are extracted and converted into links.
//
// JSON data representation is inspired by Draft.js raw formatting.

/*
Text:
    this is *bold*, `code` and _italic_, ~strike~
    combined *bold and _italic_*
    an url: https://www.example.com/abc#fragment and another _www.tinode.co_
    this is a @mention and a #hashtag in a string
    second #hashtag

Sample JSON representation of the text above:
{
   "txt": "this is bold, code and italic, strike combined bold and italic an url: https://www.example.com/abc#fragment " +
           "and another www.tinode.co this is a @mention and a #hashtag in a string second #hashtag",
   "fmt": [
       { "at":8, "len":4,"tp":"ST" },{ "at":14, "len":4, "tp":"CO" },{ "at":23, "len":6, "tp":"EM"},
       { "at":31, "len":6, "tp":"DL" },{ "tp":"BR", "len":1, "at":37 },{ "at":56, "len":6, "tp":"EM" },
       { "at":47, "len":15, "tp":"ST" },{ "tp":"BR", "len":1, "at":62 },{ "at":120, "len":13, "tp":"EM" },
       { "at":71, "len":36, "key":0 },{ "at":120, "len":13, "key":1 },{ "tp":"BR", "len":1, "at":133 },
       { "at":144, "len":8, "key":2 },{ "at":159, "len":8, "key":3 },{ "tp":"BR", "len":1, "at":179 },
       { "at":187, "len":8, "key":3 },{ "tp":"BR", "len":1, "at":195 }
   ],
   "ent": [
       { "tp":"LN", "data":{ "url":"https://www.example.com/abc#fragment" } },
       { "tp":"LN", "data":{ "url":"http://www.tinode.co" } },
       { "tp":"MN", "data":{ "val":"mention" } },
       { "tp":"HT", "data":{ "val":"hashtag" } }
   ]
}
*/

(function(environment) { // closure for web browsers
  'use strict';

  // Regular expressions for parsing inline formats. Javascript does not support lookbehind,
  // so it's a bit messy.
  var INLINE_STYLES = [
    // Strong = bold, *bold text*
    {name: "ST", start: /(?:^|\W)(\*)[^\s*]/, end: /[^\s*](\*)(?=$|\W)/},
    // Emphesized = italic, _italic text_
    {name: "EM", start: /(?:^|[\W_])(_)[^\s_]/, end: /[^\s_](_)(?=$|[\W_])/},
    // Deleted, ~strike this though~
    {name: "DL", start: /(?:^|\W)(~)[^\s~]/, end: /[^\s~](~)(?=$|\W)/},
    // Code block `this is monospace`
    {name: "CO", start: /(?:^|\W)(`)[^`]/, end: /[^`](`)(?=$|\W)/}
  ];

  // RegExps for entity extraction (RF = reference)
  var ENTITY_TYPES = [
    // URLs
    {name: "LN", dataName: "url",
      pack: function(val) {
        // Check if the protocol is specified, if not use http
        if (!/^[a-z]+:\/\//i.test(val)) {
          val = 'http://' + val;
        }
        return {url: val};
      },
      re: /(https?:\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b(?:[-a-zA-Z0-9@:%_\+.~#?&//=]*)/g},
    // Mentions @user (must be 2 or more characters)
    {name: "MN", dataName: "val",
      pack: function(val) { return {val: val.slice(1)}; },
      re: /\B@(\w\w+)/g},
    // Hashtags #hashtag, like metion 2 or more characters.
    {name: "HT", dataName: "val",
      pack: function(val) { return {val: val.slice(1)}; },
      re: /\B#(\w\w+)/g}
  ];

  // HTML tag name suggestions
  var HTML_TAGS = {
    ST: { name: 'b', isVoid: false },
    EM: { name: 'i', isVoid: false },
    DL: { name: 'del', isVoid: false },
    CO: { name: 'tt', isVoid: false },
    BR: { name: 'br', isVoid: true },
    LN: { name: 'a', isVoid: false },
    MN: { name: 'a', isVoid: false },
    HT: { name: 'a', isVoid: false },
    IM: { name: 'img', isVoid: true }
  };

  // Convert base64-encoded string into Blob.
  function base64toObjectUrl(b64, contentType) {
    var bin;
    try {
      bin = atob(b64);
    } catch (err) {
      console.log("Drafty: failed to decode base64-encoded object", err.message);
      bin = atob("");
    }
    var length = bin.length;
    var buf = new ArrayBuffer(length);
    var arr = new Uint8Array(buf);
    for (var i = 0; i < length; i++) {
      arr[i] = bin.charCodeAt(i);
    }

    return URL.createObjectURL(new Blob([buf], {type: contentType}));
  }

  // Helpers for converting Drafty to HTML.
  var DECORATORS = {
    ST: { open: function() { return '<b>'; }, close: function() { return '</b>'; }},
    EM: { open: function() { return '<i>'; }, close: function() { return '</i>'}},
    DL: { open: function() { return '<del>'; }, close: function() { return '</del>'}},
    CO: { open: function() { return '<tt>'; }, close: function() { return '</tt>'}},
    BR: { open: function() { return ''; }, close: function() { return '<br/>'}},
    LN: {
      open: function(data) { return '<a href="' + data.url + '">'; },
      close: function(data) { return '</a>'; },
      props: function(data) { return { href: data.url, target: "_blank" }; },
    },
    MN: {
      open: function(data) { return '<a href="#' + data.val + '">'; },
      close: function(data) { return '</a>'; },
      props: function(data) { return { name: data.val }; },
    },
    HT: {
      open: function(data) { return '<a href="#' + data.val + '">'; },
      close: function(data) { return '</a>'; },
      props: function(data) { return { name: data.val }; },
    },
    IM: {
      open: function(data) {
        // Don't use data.ref for preview: it's a security risk.
        var previewUrl = base64toObjectUrl(data.val, data.mime);
        var downloadUrl = data.ref ? data.ref : previewUrl;
        var res = (data.name ? '<a href="' + downloadUrl + '" download="' + data.name + '">' : '') +
          '<img src="' + previewUrl + '"' +
            (data.width ? ' width="' + data.width + '"' : '') +
            (data.height ? ' height="' + data.height + '"' : '') + ' border="0" />';
        console.log("open: " + res);
        return res;
      },
      close: function(data) {
        return (data.name ? '</a>' : '');
      },
      props: function(data) {
        var url = base64toObjectUrl(data.val, data.mime);
        return {
          src: url,
          title: data.name,
          'data-width': data.width,
          'data-height': data.height,
          'data-name': data.name,
          'data-size': (data.val.length * 0.75) | 0,
          'data-mime': data.mime
        };
      },
    }
  };

  var Drafty = (function() {

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
          chunks.push({text: line.slice(start, span.start)});
        }

        // Grab the styled chunk. It may include subchunks.
        var chunk = {type: span.type};
        var chld = chunkify(line, span.start + 1, span.end - 1, span.children);
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
        chunks.push({text: line.slice(start, end)});
      }

      return chunks;
    }

    // Same as chunkify but used for formatting.
    function forEach(line, start, end, spans, formatter, context) {
      // Add un-styled range before the styled span starts.
      // Process ranges calling formatter for each range.
      var result = [];
      for (var i = 0; i < spans.length; i++) {
        var span = spans[i];

        // Add un-styled range before the styled span starts.
        if (start < span.at) {
          result.push(formatter.call(context, null, undefined, line.slice(start, span.at)));
          start = span.at;
        }
        // Get all spans which are within current span.
        var subspans = [];
        for (var si = i + 1; si < spans.length && spans[si].at < span.at + span.len; si++) {
          subspans.push(spans[si]);
          i = si;
        }

        var tag = HTML_TAGS[span.tp] || {};
        result.push(formatter.call(context, span.tp, span.data,
          tag.isVoid ? null : forEach(line, start, span.at + span.len, subspans, formatter, context)));

        start = span.at + span.len;
      }

      // Add the last unformatted range.
      if (start < end) {
        result.push(formatter.call(context, null, undefined, line.slice(start, end)));
      }

      return result;
    }

    // Detect starts and ends of formatting spans. Unformatted spans are
    // ignored at this stage.
    function spannify(original, re_start, re_end, type) {
      var result = [];
      var index = 0;
      var line = original.slice(0); // make a copy;

      while (line.length > 0) {
        // match[0]; // match, like '*abc*'
        // match[1]; // match captured in parenthesis, like 'abc'
        // match['index']; // offset where the match started.

        // Find the opening token.
        var start = re_start.exec(line);
        if (start == null) {
          break;
        }

        // Because javascript RegExp does not support lookbehind, the actual offset may not point
        // at the markup character. Find it in the matched string.
        var start_offset = start['index'] + start[0].lastIndexOf(start[1]);
        // Clip the processed part of the string.
        line = line.slice(start_offset + 1);
        // start_offset is an offset within the clipped string. Convert to original index.
        start_offset += index;
        // Index now point to the beginning of 'line' within the 'original' string.
        index = start_offset + 1;

        // Find the matching closing token.
        var end = re_end ? re_end.exec(line) : null;
        if (end == null) {
          break;
        }
        var end_offset = end['index'] + end[0].indexOf(end[1]);
        // Clip the processed part of the string.
        line = line.slice(end_offset + 1);
        // Update offsets
        end_offset += index;
        // Index now point to the beginning of 'line' within the 'original' string.
        index = end_offset + 1;

        result.push({
          text: original.slice(start_offset+1, end_offset),
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
            type: entity.name});
        }
      });

      if (extracted.length == 0) {
        return extracted;
      }

      // Remove entities detected inside other entities, like #hashtag in a URL.
      extracted.sort(function(a,b) {
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
          ranges.push({at: plain.length + startAt, len: chunk.text.length, tp: chunk.type});
        }

        plain += chunk.text;
      }
      return {txt: plain, fmt: ranges};
    }

    // Splice two strings: insert second string into the first one at the given index
    function splice(src, at, insert) {
      return src.slice(0, at) + insert + src.slice(at);
    }

    return {

      /**
       * Parse plain text into structured representation.
       * @param {String} content plain-text content to parse.
       * @return {Drafty} parsed object.
       */
      parse: function(content) {
        // Make sure we are parsing strings only.
        if (typeof content != "string") {
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
            block = {txt: line};
          } else {
            // Sort spans by style occurence early -> late
            spans.sort(function(a,b) {
              return a.start - b.start;
            });

            // Convert an array of possibly overlapping spans into a tree
            spans = toTree(spans);

            // Build a tree representation of the entire string, not
            // just the formatted parts.
            var chunks = chunkify(line, 0, line.length, spans);

            var drafty = draftify(chunks, 0);

            block = {txt: drafty.txt, fmt: drafty.fmt};
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
                entityMap.push({tp: entity.type, data: entity.data});
              }
              ranges.push({at: entity.offset, len: entity.len, key: index});
            }
            block.ent = ranges;
          }

          blx.push(block);
        });

        var result = {txt: ""};

        // Merge lines and save line breaks as BR inline formatting.
        if (blx.length > 0) {
          result.txt = blx[0].txt;
          result.fmt = (blx[0].fmt || []).concat(blx[0].ent || []);

          for (var i = 1; i<blx.length; i++) {
            var block = blx[i];
            var offset = result.txt.length + 1;

            result.fmt.push({tp: "BR", len: 1, at: offset - 1});

            result.txt += " " + block.txt;
            if (block.fmt) {
              result.fmt = result.fmt.concat(block.fmt.map(function(s) {
                s.at += offset; return s;
              }));
            }
            if (block.ent) {
              result.fmt = result.fmt.concat(block.ent.map(function(s) {
                s.at += offset; return s;
              }));
            }
          }

          if (result.fmt.length ==  0) {
            delete result.fmt;
          }

          if (entityMap.length > 0) {
            result.ent = entityMap;
          }
        }
        return result;
      },

      /**
       * Add inline image to Drafty content
       *
       * @param {Drafty} content object to add image to.
       * @param {integer} at index where the object is inserted. The length of the image is always 1.
       * @param {string} mime mime-type of the image, e.g. "image/png"
       * @param {string} base64bits base64-encoded image content (or preview, if large image is attached)
       * @param {integer} width width of the image
       * @param {integer} height height of the image
       * @param {string} fname file name suggestion for downloading the image.
       * @param {string} refurl reference to the content. Could be null or undefined.
       * @param {integer} size size of the external file. Treat is as an untrusted hint.
       */
      insertImage: function(content, at, mime, base64bits, width, height, fname, refurl, size) {
        content = content || {txt: " "};
        content.ent = content.ent || [];
        content.fmt = content.fmt || [];

        content.fmt.push({
          at: at,
          len: 1,
          key: content.ent.length
        });
        content.ent.push({
          tp: "IM",
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
      },

      /**
       * Add file to Drafty content. Either as a blob or as a reference.
       *
       * @param {Drafty} content object to attach file to.
       * @param {string} mime mime-type of the file, e.g. "image/png"
       * @param {string} base64bits base64-encoded file content
       * @param {string} fname file name suggestion for downloading.
       * @param {string} refurl reference to the content. Could be null or undefined.
       * @param {integer} size size of the external file. Treat is as an untrusted hint.
       */
      attachFile: function(content, mime, base64bits, fname, refurl, size) {
        content = content || {txt: ""};
        content.ent = content.ent || [];
        content.fmt = content.fmt || [];

        content.fmt.push({
          at: -1,
          len: 0,
          key: content.ent.length
        });

        content.ent.push({
          tp: "EX",
          data: {
            mime: mime,
            val: base64bits,
            name: fname,
            ref: refurl,
            size: size | 0
          }
        });

        return content;
      },

      /**
       * Given the structured representation of rich text, convert it to HTML.
       * No attempt is made to strip pre-existing html markup.
       * This is potentially unsafe because `content.txt` may contain malicious
       * markup.
       *
       * @param {drafy} content - structured representation of rich text.
       *
       * @return HTML-representation of content.
       */
      UNSAFE_toHTML: function(content) {
        var {txt, fmt, ent} = content;

        var markup = [];
        if (fmt) {
          for (var i in fmt) {
            var range = fmt[i];
            var tp = range.tp, data;
            if (!tp) {
              var entity = ent[range.key];
              if (entity) {
                tp = entity.tp;
                data = entity.data;
              }
            }

            if (DECORATORS[tp]) {
              // Because we later sort in descending order, closing markup must come first.
              // Otherwise zero-length objects will not be represented correctly.
              markup.push({idx: range.at + range.len, what: DECORATORS[tp].close(data)});
              markup.push({idx: range.at, what: DECORATORS[tp].open(data)});
            }
          }
        }

        markup.sort(function(a, b) {
          return b.idx - a.idx; // in descending order
        });

        for (var i in markup) {
          if (markup[i].what) {
            txt = splice(txt, markup[i].idx, markup[i].what);
          }
        }

        return txt;
      },

      /**
       * Callback for applying custom formatting/transformation to a Drafty object.
       * Called once for each syle span.
       *
       * @callback Formatter
       * @param {string} style style code such as "ST" or "IM".
       * @param {Object} data entity's data
       * @param {Object} values possibly styled subspans contained in this style span.
       */

      /**
       * Transform Drafty using custom formatting.
       *
       * @param {Drafty} content - content to transform.
       * @param {Formatter} formatter - callback which transforms individual elements
       * @param {Object} context - context provided to formatter as 'this'.
       *
       * @return {Object} transformed object
       */
      format: function(content, formatter, context) {
        var {txt, fmt, ent} = content;

        txt = txt || "";

        if (!fmt) {
          return [txt];
        }

        var spans = [].concat(fmt);

        // Zero values may have been stripped. Restore them.
        spans.map(function(s) {
          s.at = s.at || 0;
          s.len = s.len || 0;
        });

        // Soft spans first by start index (asc) then by length (desc).
        spans.sort(function(a, b) {
          if (a.at - b.at == 0) {
            return b.len - a.len; // longer one comes first (<0)
          }
          return a.at - b.at;
        });

        // Denormalize entities into spans. Create a copy of the objects to leave
        // original Drafty object unchanged.
        spans = spans.map(function(s) {
          var data;
          var tp = s.tp;
          if (!tp) {
            s.key = s.key || 0;
            data = ent[s.key].data;
            tp = ent[s.key].tp;
          }
          return {tp: tp, data: data, at: s.at, len: s.len};
        });

        return forEach(txt, 0, txt.length, spans, formatter, context);
      },

      /**
       * Given structured representation of rich text, convert it to plain text.
       *
       * @param {Drafty} content - content to convert to plain text.
       */
      toPlainText: function(content) {
        return content.txt;
      },

      /**
       * Returns true if content has no markup and no entities.
       *
       * @param {Drafty} content - content to check for presence of markup.
       * @returns true is content is plain text, false otherwise.
       */
      isPlainText: function(content) {
        return !(content.fmt || content.ent);
      },

      /**
       * Check if the drafty content has attachments.
       *
       * @param {Drafty} content - content to check for attachments.
       * @returns true if there are attachments.
       */
      hasAttachment: function(content) {
        if (content.ent && content.ent.length > 0) {
          for (var i in content.ent) {
            if (content.ent[i].tp == "EX") {
              return true;
            }
          }
        }
        return false;
      },

      /**
       * Callback for applying custom formatting/transformation to a Drafty object.
       * Called once for each syle span.
       *
       * @callback AttachmentCallback
       * @param {Object} data attachment data
       * @param {number} index attachment's index in `content.ent`.
       */

      /**
       * Enumerate attachments
       *
       * @param {Drafty} content - drafty object to process for attachments.
       * @param {AttachmentCallback} callback - callback to call for each attachment.
       * @param {Object} content - value of "this" for callback.
       */
      attachments: function(content, callback, context) {
        if (content.ent && content.ent.length > 0) {
          for (var i in content.ent) {
            if (content.ent[i].tp == "EX") {
              callback.call(context, content.ent[i].data, i);
            }
          }
        }
      },

      /**
       * Given the entity, get URL which can be used for downloading
       * entity data.
       *
       * @param {Object} entity to get the URl from.
       */
      getDownloadUrl: function(entity) {
        return entity.ref ? entity.ref : base64toObjectUrl(entity.val, entity.mime);
      },

      /**
       * Given the entity, get URL which can be used for previewing
       * the entity.
       *
       * @param {Object} entity to get the URl from.
       */
      getPreviewUrl: function(entity) {
        return base64toObjectUrl(entity.val, entity.mime);
      },

      /**
       * Get approximate size of the entity.
       *
       * @param {Object} entity to get the size for.
       */
      getEntitySize: function(entity) {
        // Either size hint or length of value. The value is base64 encoded,
        // the actual object size is smaller than the encoded length.
        return entity.size ? entity.size : entity.val ? (entity.val.length * 0.75) | 0 : 0;
      },

      /**
       * Get entity mime type.
       *
       * @param {Object} entity to get the type for.
       */
      getEntityMimeType: function(entity) {
        return entity.mime || "text/plain";
      },

      /**
       * Get HTML tag for a given two-letter style name
       * @param {string} style - two-letter style, like ST or LN
       * @returns
       */
      tagName: function(style) {
        return HTML_TAGS[style] ? HTML_TAGS[style].name : undefined;
      },

      /**
       * For a given data bundle generate an object with HTML attributes,
       * for instance, given {url: "http://www.example.com/"} return
       * {href: "http://www.example.com/"}
       * @param {string} style - tw-letter style to generate attributes for.
       * @param {Object} data - data bundle to convert to attributes
       * @returns object with HTML attributes.
       */
      attrValue: function(style, data) {
        if (data && DECORATORS[style]) {
          return DECORATORS[style].props(data);
        }

        return undefined;
      },

      /**
       * Drafty MIME type.
       * @returns string suitabe for HTTP Content-Type field.
       */
      getContentType: function() {
        return "text/x-drafty";
      }
    };
  });

  // Export for the window object or node; Check that is not already defined.
  if (typeof(environment.Drafty) === 'undefined') {
    environment.Drafty = Drafty();
  }
})(this); // 'this' will be a window object for the browsers.

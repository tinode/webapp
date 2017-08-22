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
// JSON data representation is similar (easily converted) to Draft.js raw formatting.

/*
Text:
  this is *bold*, `code`, _italic_ and ~deleted~.
  nested styles: *just bold _bold-italic_*
  couple of urls: http://www.example.com/path?a=b%20c#fragment, and bolded *www.tinode.co*
  this is a @mention and a #hashtag in a string
  the _#hashtag_ used again

Sample JSON representation of the text above:
{
  "blocks":[
    {
      "txt":"this is bold, code, italic and deleted.",
      "fmt":[
        {
          "at":8,
          "len":4,
          "tp":"ST"
        },
        {
          "at":14,
          "len":4,
          "tp":"CO"
        },
        {
          "at":20,
          "len":6,
          "tp":"EM"
        },
        {
          "at":31,
          "len":7,
          "tp":"DL"
        }
      ]
    },
    {
      "txt":"nested styles: just bold bold-italic",
      "fmt":[
        {
          "at":25,
          "len":11,
          "tp":"EM"
        },
        {
          "at":15,
          "len":21,
          "tp":"ST"
        }
      ]
    },
    {
      "txt":"couple of urls: http://www.example.com/path?a=b%20c#fragment, and bolded www.tinode.co",
      "fmt":[
        {
          "at":73,
          "len":13,
          "tp":"ST"
        }
      ],
      "ent":[
        {
          "at":16,
          "len":44,
          "key":0
        },
        {
          "at":73,
          "len":13,
          "key":1
        }
      ]
    },
    {
      "txt":"this is a @mention and a #hashtag in a string",
      "ent":[
        {
          "at":10,
          "len":8,
          "key":2
        },
        {
          "at":25,
          "len":8,
          "key":3
        }
      ]
    },
    {
      "txt":"the #hashtag used again",
      "fmt":[
        {
          "at":4,
          "len":8,
          "tp":"EM"
        }
      ],
      "ent":[
        {
          "at":4,
          "len":8,
          "key":3
        }
      ]
    }
  ],
  "refs":[
    {
      "tp":"LN",
      "data":{
        "url":"http://www.example.com/path?a=b%20c#fragment"
      }
    },
    {
      "tp":"LN",
      "data":{
        "url":"http://www.tinode.co"
      }
    },
    {
      "tp":"MN",
      "data":{
        "val":"mention"
      }
    },
    {
      "tp":"HT",
      "data":{
        "val":"hashtag"
      }
    }
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
    {name: "DL", start: /(?:^|\W)(~)[^\s~]/g, end: /[^\s~](~)(?=$|\W)/},
    // Code block `this is monospace`
    {name: "CO", start: /(?:^|\W)(`)[^`]/, end: /[^`](`)(?=$|\W)/}
  ];

  // RegExps for entity extraction
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
    // Hashtags #hashtag
    {name: "HT", dataName: "val",
      pack: function(val) { return {val: val.slice(1)}; },
      re: /\b#(\w\w+)/g}
  ];

  // HTML tag name suggestions
  var TAG_NAMES = {
    ST: 'b',
    EM: 'i',
    DL: 'del',
    CO: 'tt',
    BR: 'br',
    LN: 'a',
    MN: 'a',
    HT: 'a'
  };

  // Helpers for converting Drafty to HTML.
  var DECORATORS = {
    ST: { open: function() { return '<b>'; }, close: function() { return '</b>'; }},
    EM: { open: function() { return '<i>'; }, close: function() { return '</i>'}},
    DL: { open: function() { return '<del>'; }, close: function() { return '</del>'}},
    CO: { open: function() { return '<tt>'; }, close: function() { return '</tt>'}},
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

        result.push(formatter.call(context, span.tp, span.data,
          forEach(line, start, span.at + span.len, subspans, formatter, context)));

        start = span.at + span.len;
      }

      // Add the last unformatted range.
      if (start < end) {
        result.push(formatter.call(context, null, undefined, line.slice(start)));
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
        var end = re_end.exec(line);
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
      ENTITY_TYPES.map(function(ent) {
        while ((match = ent.re.exec(line)) !== null) {
          extracted.push({
            offset: match['index'],
            len: match[0].length,
            unique: match[0],
            data: ent.pack(match[0]),
            type: ent.name});
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
       * Parse text into structured representation.
       */
      parse: function(content) {
        // Split text into lines. It makes further processing easier.
        var lines = content.split(/\r?\n/);
        // Holds formatted lines
        var blocks = [];
        // Holds entities referenced from text
        var entityMap = [];
        var entityIndex = {};
        //
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
          var ranges = [];
          if (entities.length > 0) {
            for (var i in entities) {
              // {offset: match['index'], unique: match[0], len: match[0].length, data: ent.packer(), type: ent.name}
              var ent = entities[i];
              var index = entityIndex[ent.unique];
              if (!index) {
                index = entityMap.length;
                entityIndex[ent.unique] = index;
                entityMap.push({tp: ent.type, data: ent.data});
              }
              ranges.push({at: ent.offset, len: ent.len, key: index});
            }
            block.ent = ranges;
          }

          blocks.push(block);
        });

        var result = {blocks: blocks};
        if (entityMap.length > 0) {
          result.refs = entityMap;
        }
        return result;
      },

      /**
       * Given the structured representation of rich text, convert it to HTML.
       * No attempt is made to strip pre-existing html markup.
       * This is potentially unsafe because block.txt may contain malicious
       * markup.
       *
       * @param {drafy} content - structured representation of rich text.
       *
       * @return HTML-representation of content
       */
      unsafeToHTML: function(content) {
        var {blocks} = content;
        var {refs} = content;

        var text = [];
        for (var i in blocks) {
          var line = blocks[i].txt;
          var markup = [];
          if (blocks[i].fmt) {
            for (var j in blocks[i].fmt) {
              var range = blocks[i].fmt[j];
              markup.push({idx: range.at, what: DECORATORS[range.tp].open()});
              markup.push({idx: range.at + range.len, what: DECORATORS[range.tp].close()});
            }
          }

          if (blocks[i].ent) {
            for (var j in blocks[i].ent) {
              var range = blocks[i].ent[j];
              var entity = refs[range.key];
              markup.push({idx: range.at, what: DECORATORS[entity.tp].open(entity.data)});
              markup.push({idx: range.at + range.len, what: DECORATORS[entity.tp].close(entity.data)});
            }
          }

          if (markup.length > 0) {
            markup.sort(function(a, b) {
              return b.idx - a.idx; // in descending order
            });

            for (var j in markup) {
              line = splice(line, markup[j].idx, markup[j].what);
            }
          }
          text.push(line);
        }
        return text.join("<br/>");
      },

      /**
       * Transform using custom formatting.
       *
       * @param {Drafty} content - content to transform.
       * @param {function} formatter - callback which transforms individual elements
       * @param {Object} context - context provided to formatter as 'this'.
       *
       * @return {Object} context
       */
      format: function(content, formatter, context) {
        var {blocks} = content;
        var {refs} = content;

        var result = [];

        // Process blocks one by one
        for (var i=0;i < blocks.length; i++) {
          var block = blocks[i];
          var spans = [];

          // Merge markup ranges and sort in ascending order.
          if (block.fmt) {
            spans = spans.concat(block.fmt);
          }
          if (block.ent) {
            spans = spans.concat(block.ent);
          }

          // Soft spans first by start index (asc) then by length (desc).
          spans.sort(function(a, b) {
            if (a.at - b.at == 0) {
              return b.len - a.len; // longer one comes first (<0)
            }
            return a.at - b.at;
          });

          // Denormalize entities.
          spans.map(function(s) {
            if (s.key + 1 > 0) {
              s.data = refs[s.key].data;
              s.tp = refs[s.key].tp;
            }
          });

          result = result.concat(forEach(block.txt, 0, block.txt.length - 1, spans, formatter, context));

          if (i != blocks.length - 1) {
            // Add line break
            result.push(formatter.call(context, "BR"));
          }
        }

        return result;
      },

      /**
       * Given structured representation of rich text, convert it to plain text.
       * The only structure preserved is line breaks as \n.
       *
       * @param {drafty} content - content to convert to plain text.
       */
      toPlainText: function(content) {
        var {blocks} = content;
        var text = blocks[0].txt;
        for (var i = 1; i < blocks.length; i++) {
          text += (lineBreak ? lineBreak.call(context) : "\n") + blocks[i].txt;
        }
        return text;
      },

      /**
       * Returns true if content has no markup and no entities.
       *
       * @param {drafty} content - content to check for presence of markup.
       * @param {boolean} noLineBreaks - true to treat line breaks as markup, false
       *                                 to treat them as plain text.
       * @returns true is content is plain text, false otherwise.
       */
      isPlainText: function(content, noLineBreaks) {
        if (content.refs) {
          return false;
        }

        var {blocks} = content;

        if (noLineBreaks && blocks.length > 1) {
          return false;
        }

        for (var i in blocks) {
          if (blocks[i].fmt) {
            return false;
          }
        }
        return true;
      },

      tagName: function(style) {
        return TAG_NAMES[style];
      },

      attrValue: function(style, data) {
        if (data && DECORATORS[style]) {
          return DECORATORS[style].props(data);
        }

        return undefined;
      }

    };
  });

  // Export for the window object or node; Check that is not already defined.
  if (typeof(environment.Drafty) === 'undefined') {
    environment.Drafty = Drafty();
  }
})(this); // 'this' will be a window object for the browsers.

// Basic parser and formatter for very simple rich text. Mostly targeted at
// mobile use cases similar to Telegram and WhatsApp.
//
// Supports:
//   *abc* -> <b>abc</b>
//   _abc_ -> <i>abc</i>
//   ~abc~ -> <del>abc</del>
//   `abc` -> <tt>abc</tt>
// Nested frmatting is supported, e.g. *abc _def_* -> <b>abc <i>def</i></b>
//
// URLs, @mentions, and #hashtags are extracted.
//
// JSON data representation is similar to Draft.js raw formatting.

/*
Text:

  this is *bold*, `code` and _italic_ ~strike~ eol
  none *bold _italic_* eol
  this is a url: http://www.example.com/path?a=b%20c#fragment, and another www.tinode.co
  this is a @mention and a #hashtag in a string
  plain unformatted text

Sample JSON format of the text above:
{
   "blocks":[
      {
         "text":"this is bold, code and italic strike eol",
         "styles":[
            {
               "offset":8,
               "len":4,
               "style":"BO"
            },
            {
               "offset":14,
               "len":4,
               "style":"CO"
            },
            {
               "offset":23,
               "len":6,
               "style":"IT"
            },
            {
               "offset":30,
               "len":6,
               "style":"ST"
            }
         ]
      },
      {
         "text":"none bold italic eol",
         "styles":[
            {
               "offset":10,
               "len":6,
               "style":"IT"
            },
            {
               "offset":5,
               "len":11,
               "style":"BO"
            }
         ]
      },
      {
         "text":"this is a url: http://www.example.com/path?a=b%20c#fragment, and another www.tinode.co",
         "ent":[
            {
               "offset":15,
               "len":44,
               "key":0
            },
            {
               "offset":73,
               "len":13,
               "key":1
            }
         ]
      },
      {
         "text":"this is a @mention and a #hashtag in a string",
         "ent":[
            {
               "offset":10,
               "len":8,
               "key":2
            },
            {
               "offset":25,
               "len":8,
               "key":3
            }
         ]
      },
      {
         "text":"plain unformatted text"
      }
   ],
   "refs":[
      {
         "type":"LN",
         "data":{
            "url":"http://www.example.com/path?a=b%20c#fragment"
         }
      },
      {
         "type":"LN",
         "data":{
            "url":"http://www.tinode.co"
         }
      },
      {
         "type":"MN",
         "data":{
            "val":"mention"
         }
      },
      {
         "type":"HT",
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
    // Bold, *bold text*
    {name: "BO", start: /(?:^|\W)(\*)[^\s*]/, end: /[^\s*](\*)(?=$|\W)/},
    // Italic, _italic text_
    {name: "IT", start: /(?:^|[\W_])(_)[^\s_]/, end: /[^\s_](_)(?=$|[\W_])/},
    // Strikethough, ~strike this though~
    {name: "ST", start: /(?:^|\W)(~)[^\s~]/g, end: /[^\s~](~)(?=$|\W)/},
    // Code block `this is monospace`
    {name: "CO", start: /(?:^|\W)(`)[^`]/, end: /[^`](`)(?=$|\W)/}
  ];

  // RegExps for entity extraction
  var ENTITY_TYPES = [
    // URLs
    {name: "LN", dataName: "url",
      pack: function(val) {
        // Check if the protocol is pecified, if not use http
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
      re: /\B#(\w\w+)/g}
  ];

  // Formatting HTML tags
  var STYLE_DECOR = {
    BO: ['<b>', '</b>'],
    IT: ['<i>', '</i>'],
    ST: ['<del>', '</del>'],
    CO: ['<tt>', '</tt>']
  };

  var ENTITY_DECOR = {
    LN: {
      open: function(data) { return '<a href="' + data.url + '">'; },
      close: function(data) { return '</a>'; }
    },
    MN: {
      open: function(data) { return '<a href="#' + data.val + '">'; },
      close: function(data) { return '</a>'; }
    },
    HT: {
      open: function(data) { return '<a href="#' + data.val + '">'; },
      close: function(data) { return '</a>'; }
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

    // Detect starts and ends of formatting spans. Unformatted spans are
    // ignored at this time.
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
        // Because javascript RegExp does not support lookbehind, the actual offset may not be at the beginning of
        // the match. Find it in the matched string.
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
    function extractEntities(line, re, name) {
      var match;
      var extracted = [];
      ENTITY_TYPES.map(function(ent) {
        while((match = ent.re.exec(line)) !== null) {
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
    function toDrafty(chunks, startAt) {
      var plain = "";
      var ranges = [];
      for (var i in chunks) {
        var chunk = chunks[i];
        if (!chunk.text) {
          var drafty = toDrafty(chunk.children, plain.length + startAt);
          chunk.text = drafty.text;
          ranges = ranges.concat(drafty.ranges);
        }

        if (chunk.type) {
          ranges.push({offset: plain.length + startAt, len: chunk.text.length, style: chunk.type});
        }

        plain += chunk.text;
      }
      return {text: plain, ranges: ranges};
    }

    // Splice two strings: insert second string into the first one at the given index
    function splice(src, at, insert) {
      return src.slice(0, at) + insert + src.slice(at);
    }

    return {
      parse: function(content) {
        // Split text into lines. It makes formatting easier
        var lines = content.split('\n');
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
            block = {text: line};
          } else {
            // Sort spans by style occurence early -> late
            spans.sort(function(a,b) {
              return a.start - b.start;
            });

            // Convert an array of possibly overlapping spans into a tree
            spans = toTree(spans);

            // Build tree representation of the format.
            var chunks = chunkify(line, 0, line.length, spans);

            var drafty = toDrafty(chunks, 0);

            block = {text: drafty.text, styles: drafty.ranges};
          }

          // Extract entities from the cleaned up string.
          entities = extractEntities(block.text);
          var ranges = [];
          if (entities.length > 0) {
            for (var i in entities) {
              // {offset: match['index'], unique: match[0], len: match[0].length, data: ent.packer(), type: ent.name}
              var ent = entities[i];
              var index = entityIndex[ent.unique];
              if (!index) {
                index = entityMap.length;
                entityIndex[ent.unique] = index;
                entityMap.push({type: ent.type, data: ent.data});
              }
              ranges.push({offset: ent.offset, len: ent.len, key: index});
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

      format: function(content) {
        var {blocks} = content;
        var {refs} = content;

        var text = "";
        for (var i in blocks) {
          var line = blocks[i].text;
          var markup = [];
          if (blocks[i].styles) {
            for (var j in blocks[i].styles) {
              var range = blocks[i].styles[j];
              markup.push({idx: range.offset, what: STYLE_DECOR[range.style][0]});
              markup.push({idx: range.offset + range.len, what: STYLE_DECOR[range.style][1]});
            }
          }

          if (blocks[i].ent) {
            for (var j in blocks[i].ent) {
              var range = blocks[i].ent[j];
              var entity = refs[range.key];
              markup.push({idx: range.offset, what: ENTITY_DECOR[entity.type].open(entity.data)});
              markup.push({idx: range.offset + range.len, what: ENTITY_DECOR[entity.type].close(entity.data)});
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
          text += line + "<br>";
        }
        return text;
      }
    };
  });

  // Export for the window object or node; Check that is not already defined.
  if (typeof(environment.Drafty) === 'undefined') {
    environment.Drafty = Drafty();
  }
})(this); // 'this' will be window object for the browsers.

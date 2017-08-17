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
// JSON data representation is similar to Draft.js.

(function(environment) { // closure for web browsers
  'use strict';

  var Drafty = (function() {

    // Take a string and defined earlier style spans, re-compose them into a tree where each leaf is
    // a same-style (or no style) string. I.e. 'hello *bold _italic_* and ~more~ world' ->
    // ('hello ', (b: 'bold ', (i: 'italic')), ' and ', (s: 'more'), ' world');
    //
    // This is needed in order to clear markup, i.e. 'hello *world*' -> 'hello world' and convert
    // ranges from markup-ed offsets to plain text offsets;
    //
    // Take string and chunks. Pick first chunk: 1. if it starts at the offset 0, clip the substring
    // equal in length to the chunk.
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

    // Detect starts and ends of formatting spans
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
        // The actual offset may not be at the beginning of the match. Find it in the matched string.
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

    function toTree(spans) {
      if (spans.length == 0) {
        return [];
      }

      // Throw away overlapping spans.
      var cleaned = [spans[0]];
      var last = spans[0];
      for (var i = 1; i < spans.length; i++) {
        // Keep spans which start after the end of the previous span or those which
        // are complete within the previous span.

        if (spans[i].start > last.end) {
          // Span is completely outside of the previous span.
          cleaned.push(spans[i]);
          last = spans[i];
        } else if (spans[i].end < last.end) {
          // Span is fully inside of the previous span. Push to subnode.
          last.children.push(spans[i]);
        }
        // Span could partially overlap, ignoring it as invalid.
      }

      // Recursively rearrange the subnodes.
      for (var i in cleaned) {
        cleaned[i].children = toTree(cleaned[i].children);
      }

      return cleaned;
    }

    // finally convert the chunks to format suitable for serialization.
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
        // Regular expressions for parsing inline formats
        var inlineStyles = [
          // Bold, *bold text*
          {name: "BO", start: /(?:^|\W)(\*)[^\s*]/, end: /[^\s*](\*)(?:$|\W)/},
          // Italic, _italic text_
          {name: "IT", start: /(?:^|[\W_])(_)[^\s_]/, end: /[^\s_](_)(?:$|[\W_])/},
          // Strikethough, ~strike this though~
          {name: "ST", start: /(?:^|\W)(~)[^\s~]/g, end: /[^\s~](~)(?:$|\W)/},
          // Code block `this is monospace`
          {name: "CO", start: /(?:^|\W)(`)[^`]/, end: /[^`](`)(?:$|\W)/}
        ];

        var entities = [
          // URLs
          {name: "LN", re: /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/},
          // Mentions @user
          {name: "MN", re: /@[\w]+/g},
          // Hashtags #hashtag
          {name: "HT", re: /#[\w]+/g}
        ];

        // Split text into lines. It makes formatting easier
        var lines = content.split('\n');
        // Holds formatted lines
        var blocks = [];
        // Holds entities referenced from text
        var entityMap = {};

        //
        lines.map(function(line) {
          var spans = [];
          // Find formatted spans in the string.
          // Try to match each style.
          inlineStyles.map(function(style) {
            // Each style could be matched multiple times.
            spans = spans.concat(spannify(line, style.start, style.end, style.name));
          });

          if (spans.length == 0) {
            blocks.push({text: line});
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

            blocks.push({text: drafty.text, styles: drafty.ranges});
          }
        });

        return {blocks: blocks, entityMap: entityMap};
      },

      format: function(json) {
        var TAGS = {
          BO: ['<b>', '</b>', 7],
          IT: ['<i>', '</i>', 7],
          ST: ['<del>', '</del>', 11],
          CO: ['<tt>', '</tt>', 9]
        };
        var {blocks} = json;
        var text = "";
        for (var i in blocks) {
          var line = blocks[i].text;
          var markup = [];
          if (blocks[i].styles) {
            for (var j in blocks[i].styles) {
              var range = blocks[i].styles[j];
              markup.push({idx: range.offset, what: TAGS[range.style][0]});
              markup.push({idx: range.offset + range.len, what: TAGS[range.style][1]});
            }

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

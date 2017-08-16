// Basic parser and formatter for simple rich text.
// JSON data representation is similar to Draft.js
(function(environment) { // closure for web browsers
  'use strict';

  var Drafty = (function() {

    return {
      parse: function(content) {
        // Regular expressions for parsing inline formats
        var inlineStyles = [
          // Bold, *bold text*
          {name: "BO", re: /(\*(?:[^\s*]|(?:[^\s*]*[^*]*[^\s*]))\*)/g},
          // Italic, _italic text_
          {name: "IT", re: /(_(?:[^\s_]|(?:[^\s_]*[^_]*[^\s_]))_)/g},
          // Strikethough, ~strike this though~
          {name: "ST", re: /(~(?:[^\s~]|(?:[^\s~]*[^~]*[^\s~]))~)/g},
          // Code block `this is monospace`
          {name: "CO", re: /(`[^`]+`)/g}
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
          console.log("processing line: '" + line + "'");
          var spans = [];
          // Find formatted spans in the string.
          // Try to match each style.
          inlineStyles.map(function(style) {
            var match;
            // Each style could be matched multiple times.
            while ((match = style.re.exec(line)) !== null) {
              // match[0]; // match, like '*abc*'
              // match[1]; // matched text in parenthesis, like 'abc'
              // match['index']; // offset where the match started.
              spans.push({
                match: match[1],
                text: match[1].substring(1, match[1].length-1),
                offset: match['index'],
                len: match[1].length,
                type: style.name
              });
            }
          });

          var ranges = [];
          if (spans.length == 0) {
            blocks.push({text: line});
          } else {
            console.log(JSON.stringify(spans));

            // Sort spans by style occurence early -> late
            spans.sort(function(a,b) {
              return a.offset - b.offset;
            });

            // Clear formatting characters from the string, leave just the plain text.
            // Save formatting to inlineStylesRanges array
            var chunks = [];
            var start = 0;
            for (var i = 0; i < spans.length; i++) {
              // Skip empty or invalid (overlapping) chunk.
              if (start > spans[i].offset) {
                continue;
              }

              // Grab the initial unstyled chunk
              if (start < spans[i].offset) {
                chunks.push({text: line.slice(start, spans[i].offset)});
                start = spans[i].offset;
                console.log(i + ": " + chunks[chunks.length-1].text);
              }

              // Grab the styled chunk
              chunks.push({text: line.slice(start, start + spans[i].len), style: spans[i]});
              console.log(i + ": " + chunks[chunks.length-1].text);
              // And grab the unstyled span till the next chunk
              start = start + spans[i].len;
              var end = (i < spans.length - 1) ? spans[i+1].offset : undefined;
              chunks.push({text: line.slice(start, end)});
              console.log(i + ": " + chunks[chunks.length-1].text);
              start = end; // does not matter if undefined.
            }
            console.log("CHUNKS");
            console.log(JSON.stringify(chunks));
            /*
              var offset = spans[i].offset - shiftBy;
              line = line.slice(0, offset) +
                spans[i].text +
                line.slice(offset + spans[i].len);
              console.log(line);
              shiftBy += 2;
              // Save style
              ranges.push({offset: offset, length: spans[i].len - 2, type: spans[i].type});
            }
            */
            blocks.push({text: line, styleRanges: ranges});
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
          var shiftBy = 0;
          var line = blocks[i].text;
          if (blocks[i].styleRanges) {
            for (var j in blocks[i].styleRanges) {
              var range = blocks[i].styleRanges[j];
              line = line.slice(0, range.offset + shiftBy);
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

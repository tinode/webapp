// 1.Flattens messages extracted via the React Intl Babel plugin. An error will be
// thrown if there are messages with the same `id`. The result is a file containing
// `id: message` pairs in "en" locale.
//
// 2. Takes all translations and groups them into a single file.
var fs = require('fs');
var path = require('path');
var globSync = require('glob').sync;
var mkdirpSync = require('mkdirp').sync;

const DEFAULT_TRANSLATION = 'en.json';
const MESSAGES_PATTERN = './src/i18n/src/**/*.json';
const LANG_DIR         = './src/i18n/';
const LANG_PATTERN     = './src/i18n/*.json';
const FINAL_FILE       = './src/messages.json';

const MISSING_MARKER = ':!![MISSING]!!:';
const OBSOLETE_MARKER = ':!![OBSOLETE]!!:';

// The react-intl-babel-plugin saves extracted messages
// into files, one fine per component. Rewrite them into
// a single file en.json.
let messages = globSync(MESSAGES_PATTERN)
  .map((filename) => fs.readFileSync(filename, 'utf8'))
  .map((file) => JSON.parse(file))
  .reduce((collection, descriptors) => {
    descriptors.forEach(({id, defaultMessage}) => {
      if (collection.hasOwnProperty(id)) {
          throw new Error(`Duplicate message id: ${id}`);
      }
      collection[id] = defaultMessage;
    });

    return collection;
  }, {});

let filename = path.join(LANG_DIR, DEFAULT_TRANSLATION);
mkdirpSync(path.dirname(filename));
fs.writeFileSync(filename, JSON.stringify(messages, null, 2)+"\n");

// Find messages present in en.json but missing in translations and vice versa.
// Mark missing or obsolete messages as such in translation files.
globSync(LANG_PATTERN)
  .map((filename) => {
    const parts = filename.split('/');
    if (parts[parts.length-1] != DEFAULT_TRANSLATION) {
      const translated = JSON.parse(fs.readFileSync(filename, 'utf8'));
      // Find missing messages.
      Object.entries(messages).forEach((ent) => {
        if (!translated.hasOwnProperty(ent[0])) {
          translated[ent[0]] = MISSING_MARKER + ent[1];
        }
      });
      // Find no longer needed messages.
      Object.entries(translated).forEach((ent) => {
        if (!messages.hasOwnProperty(ent[0])) {
          let val = translated[ent[0]];
          if (val.indexOf(MISSING_MARKER) == 0) {
            val = val.substring(0, MISSING_MARKER.length);
          }
          if (val.indexOf(OBSOLETE_MARKER) != 0) {
            val = OBSOLETE_MARKER + val;
          }
          translated[ent[0]] = val;
        }
      });
      fs.writeFileSync(filename, JSON.stringify(translated, null, 2)+"\n");
    }
  });

// Combine all translations into a single json {"lang_1": {...}, "lang_2: {...}"}
// while removing messages marked as missing or obsolete.

// Read all translations.
messages = globSync(LANG_PATTERN)
  .map((filename) => {
    const parts = filename.split('/');
    const locale = parts[parts.length - 1].split('.json')[0];
    const translated = JSON.parse(fs.readFileSync(filename, 'utf8'));

    // Strip messages prefixed with MISSING or OBSOLETE markers.
    for (let id in translated) {
      if (translated[id].indexOf(OBSOLETE_MARKER) == 0 ||
          translated[id].indexOf(MISSING_MARKER) == 0) {
        delete translated[id];
      }
    }

    return { [locale]: translated };
  })
  .reduce((collection, descriptors) => {
    return { ...collection, ...descriptors };
  }, {});

// Write file with all translations combined.
mkdirpSync(path.dirname(FINAL_FILE));
fs.writeFileSync(FINAL_FILE, JSON.stringify(messages, null, 2)+"\n");

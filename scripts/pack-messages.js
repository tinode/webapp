// 1. Takes file with messages extracted via the React Intl Babel plugin and converts it into a file containing
// `id: message` pairs in "en" locale.
//
// 2. Takes all translations and groups them into a single file.
const fs = require('fs');
const path = require('path');
const globSync = require('glob').sync;
const mkdirpSync = require('mkdirp').sync;

const EXTRACTED_STRINGS = './src/i18n/ex/base-en.json';
const DEFAULT_TRANSLATION = 'en.json';
const LANG_DIR         = './src/i18n/';
const LANG_PATTERN     = './src/i18n/*.json';
const FINAL_FILE       = './src/messages.json';
const TRANSLATIONS     = './src/translations.js'

const MISSING_MARKER = ':!![MISSING]!!:';
const OBSOLETE_MARKER = ':!![OBSOLETE]!!:';

// The formatjs/cli saves extracted messages into a file {'message_id': {defaultMessage: 'default message text', description: '...'}, ...}.
// Rewrite them into a single file en.json {'message_id': 'default message text', }.

// Read master-set of messages in default language.
const baseMessages = JSON.parse(fs.readFileSync(EXTRACTED_STRINGS, 'utf8'));
// Convert.
const en = {};
for (const [id, msg] of Object.entries(baseMessages)) {
  en[id] = msg.defaultMessage;
}

// Write extracted strings into default language file.
let filename = path.join(LANG_DIR, DEFAULT_TRANSLATION);
mkdirpSync(path.dirname(filename));
fs.writeFileSync(filename, JSON.stringify(en, null, 2)+"\n");

// Find messages present in en.json but missing in translations and vice versa.
// Mark missing or obsolete messages as such in translation files.
globSync(LANG_PATTERN)
  .map((filename) => {
    const parts = filename.split('/');
    if (parts[parts.length-1] != DEFAULT_TRANSLATION) {
      const translated = JSON.parse(fs.readFileSync(filename, 'utf8'));
      // Find missing messages.
      Object.entries(baseMessages).forEach((ent) => {
        if (!translated.hasOwnProperty(ent[0])) {
          // Missing translation.
          translated[ent[0]] = MISSING_MARKER + ent[1];
        } else if (translated[ent[0]].indexOf(OBSOLETE_MARKER) === 0) {
          // No longer obsolete. Remove obsolete marker.
          translated[ent[0]] = translated[ent[0]].substring(0, OBSOLETE_MARKER.length);
        }
      });
      // Find no longer needed messages.
      Object.entries(translated).forEach((ent) => {
        if (!baseMessages.hasOwnProperty(ent[0]) && translated.hasOwnProperty(ent[0])) {
          let val = translated[ent[0]];
          if (val.indexOf(MISSING_MARKER) === 0) {
            // No longer missing.
            val = val.substring(0, MISSING_MARKER.length);
          }
          if (val.indexOf(OBSOLETE_MARKER) !== 0) {
            val = OBSOLETE_MARKER + val;
          }
          translated[ent[0]] = val;
        }
      });
      fs.writeFileSync(filename, JSON.stringify(translated, null, 2)+"\n");
    }
  });

// List of all available translations.
const languageList = {};
// Combine all translations into a single json {"lang_1": {...}, "lang_2: {...}"}
// while removing messages marked as missing or obsolete.

// Read all translations.
const messages = globSync(LANG_PATTERN)
  .map((filename) => {
    const parts = filename.split('/');
    const locale = parts[parts.length - 1].split('.json')[0];
    const translated = JSON.parse(fs.readFileSync(filename, 'utf8'));
    languageList[locale] = locale;
    // Strip messages prefixed with MISSING or OBSOLETE markers.
    for (let id in translated) {
      // process.stdout.write("-- handling translation " + id + "; "+ String(translated[id]) + "; in " + String(filename) + "; --\n");
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

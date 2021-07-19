// 1. Takes file with messages extracted via the React Intl Babel plugin and converts it into a file containing
// `id: message` pairs in "en" locale.
//
// 2. Takes all translations and groups them into a single file.
const fs = require('fs');
const path = require('path');
const globSync = require('glob').sync;
const mkdirpSync = require('mkdirp').sync;

const EXTRACTED_STRINGS = './src/i18n/ex/base-en.json';
const LANG_DIR         = './src/i18n/';
const LANG_PATTERN     = './src/i18n/*.json';
const FINAL_FILE       = './src/messages.json';

const args = process.argv.slice(2);

function getLocaleFromFileName(filename) {
  const parts = filename.split('/');
  return parts[parts.length - 1].split('.json')[0];
}

// Called with a parameter?
if (args[0] == 'missing' || args[0] == 'obsolete') {
  // Extract missing or obsolete translations as requested.
  // Read all translations.
  const extracted = globSync(LANG_PATTERN)
    .map((filename) => {
      const locale = getLocaleFromFileName(filename);
      const translated = JSON.parse(fs.readFileSync(filename, 'utf8'));

      const dest = {};
      // Copy messages while skipping missing and obsolete ones.
      for (let key in translated) {
        if ((args[0] == 'missing' && translated[key].missing) ||
          (args[0] == 'obsolete' && translated[key].obsolete)) {
          dest[key] = translated[key];
        }
      }

      return { [locale]: dest };
    })
    .reduce((collection, descriptors) => {
      return { ...collection, ...descriptors };
    }, {});

  console.log(JSON.stringify(extracted, null, 2)+"\n");
  return;
}

// The formatjs/cli saves extracted messages into a file {'message_id': {defaultMessage: 'default message text', description: '...'}, ...}.
// Rewrite them into a single file en.json {'message_id': 'default message text', }.

// Read master-set of messages in default language.
const baseMessages = JSON.parse(fs.readFileSync(EXTRACTED_STRINGS, 'utf8'));

// Find messages present in baseMessages but missing in translations and vice versa.
// Mark missing or obsolete messages as such.
globSync(LANG_PATTERN)
  .map((filename) => {
    const translated = JSON.parse(fs.readFileSync(filename, 'utf8'));

    // Refresh existing entries with possible new descriptions and default messages, add missing.
    Object.entries(baseMessages).forEach((ent) => {
      const [key, value] = ent;
      translated[key] = {
        translation: translated[key] ? translated[key].translation : "",
        defaultMessage: value.defaultMessage,
        description: value.description,
        missing: !translated[key],
        obsolete: false
      };
    });

    // Find no longer needed messages.
    Object.entries(translated).forEach((ent) => {
      const [key, value] = ent;
      if (!baseMessages[key] && translated[key]) {
        // Obsolete, no longer missing.
        translated[key].missing = false;
        translated[key].obsolete = true;
      }
    });

    fs.writeFileSync(filename, JSON.stringify(translated, null, 2)+"\n");
  });

// Combine all translations into a single json {"lang_1": {...}, "lang_2: {...}"}
// while removing messages marked as missing or obsolete.

// Read all translations.
const messages = globSync(LANG_PATTERN)
  .map((filename) => {
    const locale = getLocaleFromFileName(filename);
    const translated = JSON.parse(fs.readFileSync(filename, 'utf8'));

    const dest = {};
    // Copy messages while skipping missing and obsolete ones.
    for (let key in translated) {
      if (!translated[key].missing && !translated[key].obsolete) {
        dest[key] = translated[key].translation;
      }
    }

    return { [locale]: dest };
  })
  .reduce((collection, descriptors) => {
    return { ...collection, ...descriptors };
  }, {});

// Write a file with all translations combined.
mkdirpSync(path.dirname(FINAL_FILE));
fs.writeFileSync(FINAL_FILE, JSON.stringify(messages));

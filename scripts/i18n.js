// 1. Updates translations files with new messages, mark no longer needed translations as obsolete.
// 2. Takes all translations and groups them into a single file.
// 3. When called with parameters 'missing' or 'obsolete' writes missing and obsolete translations to console.

const fs = require('fs');
const path = require('path');
const globSync = require('glob').sync;
const mkdirpSync = require('mkdirp').sync;

const EXTRACTED_STRINGS = './src/i18n/ex/base-en.json';
const BASE_LANG        = 'en';
const LANG_DIR         = './src/i18n/';
const LANG_PATTERN     = './src/i18n/*.json';
const LANG_PATTERN_ONE = './src/i18n/%s.json';
const FINAL_FILE       = './src/messages.json';

const args = process.argv.slice(2);

function getLocaleFromFileName(filename) {
  const parts = filename.split('/');
  return parts[parts.length - 1].split('.json')[0];
}

function printf(str) {
  const args = [].slice.call(arguments, 1);
  let i = 0;
  return str.replace(/%s/g, () => args[i++]);
}

// Called with one or two parameters?
if (args[0] == 'missing' || args[0] == 'obsolete') {
  // Extract missing or obsolete translations as requested.
  // Read either all or just one translation.
  const pattern = args[1] ? printf(LANG_PATTERN_ONE, args[1]) : LANG_PATTERN;
  const extracted = globSync(pattern)
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
    const locale = getLocaleFromFileName(filename);

    // Refresh existing entries with possible new descriptions and default messages, add missing.
    Object.entries(baseMessages).forEach((ent) => {
      const [key, value] = ent;
      let translation = translated[key] ? translated[key].translation : "";
      if (!translation && locale == BASE_LANG) {
        translation = value.defaultMessage;
      }

      translated[key] = {
        translation: translation,
        defaultMessage: value.defaultMessage,
        description: value.description,
        missing: !translation,
        obsolete: false
      };
    });

    // Find no longer needed messages.
    Object.entries(translated).forEach((ent) => {
      const [key, value] = ent;
      if (!baseMessages[key] && translated[key]) {
        // Obsolete, no longer missing.
        translated[key].missing = !translated[key].translation;
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

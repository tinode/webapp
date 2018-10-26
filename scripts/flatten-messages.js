// Flattens messages extracted via the React Intl Babel plugin. An error will be
// thrown if there are messages with the same `id`. The result is a file containing
// `id: message` pairs in "en" locale.

var fs = require('fs');
var path = require('path');
var globSync = require('glob').sync;
var mkdirpSync = require('mkdirp').sync;

const MESSAGES_PATTERN = './src/i18n/src/**/*.json';
const LANG_DIR         = './src/i18n/';

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

let filename = path.join(LANG_DIR, 'en.json');
mkdirpSync(path.dirname(filename));
fs.writeFileSync(filename, JSON.stringify(messages, null, 2));

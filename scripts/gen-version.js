var fs = require('fs');
var version = require('../package.json').version;

fs.writeFile('./src/version.js',
  '// This is a generated file. Don\'t edit.\n\n'+
  'export const PACKAGE_VERSION = "'+version+'";\n',
  { flag: 'w' },
  function(err) {
    if (err) {
        return console.log(err);
    }
  }
);

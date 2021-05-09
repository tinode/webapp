const fs = require('fs');
const version = require('../package.json').version;

function writeVersion(fileName, useExport) {
  fs.writeFile(fileName,
    '// This is a generated file. Don\'t edit.\n\n'+
    `${useExport ? 'export ' : ''}const PACKAGE_VERSION = "${version}";\n`,
    { flag: 'w' },
    (err) => {
      if (err) {
          return console.log(err);
      }
    }
  );
}

writeVersion('./src/version.js', true);
writeVersion('./version.js', false);

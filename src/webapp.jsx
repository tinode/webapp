if (typeof require == 'function') {
  if (typeof React == 'undefined') {
    var React = require('react');
    var ReactDOM = require('react-dom');
  }
  if (typeof Tinode == 'undefined') {
    var Tinode = require('tinode-sdk');
    var Drafty = Tinode.Drafty;
  }
  if (typeof firebase == 'undefined') {
    var firebase = require('firebase/app');
    require('firebase/messaging');
  }
  if (typeof ReactIntl == 'undefined') {
    var ReactIntl = require('react-intl');
    var {IntlProvider, FormattedMessage} = ReactIntl;
  }
  var package_version = require('../version.json').version;
}

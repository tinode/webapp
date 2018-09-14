// Put all packages together.
// Used to generate umd/index.prod.js

var React = require('react');
var ReactDOM = require('react-dom');
var TinodeWeb = require('./webapp.js');

ReactDOM.render(
  React.createElement(TinodeWeb, null),
  document.getElementById('mountPoint')
);

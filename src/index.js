var React = require('react');
var ReactDOM = require('react-dom');
var Tinode = require('tinode-sdk');
var Drafty = Tinode.Drafty;
var TinodeWeb = require('webapp.js')

ReactDOM.render(
  <TinodeWeb />,
  document.getElementById('mountPoint')
);

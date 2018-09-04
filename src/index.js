let React = require('react');
let ReactDOM = require('react-dom');
let Tinode = require('tinode-sdk');
let TinodeWeb = require('webapp.js')

ReactDOM.render(
  <TinodeWeb />,
  document.getElementById('mountPoint')
);

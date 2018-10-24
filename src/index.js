// Put all packages together.
// Used to generate umd/index.prod.js

import React from 'react';
import ReactDOM from 'react-dom';
import TinodeWeb from './components/tinode-web.jsx';

ReactDOM.render(
  React.createElement(TinodeWeb, null),
  document.getElementById('mountPoint')
);

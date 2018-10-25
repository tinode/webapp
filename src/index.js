// Put all packages together.
// Used to generate umd/index.prod.js

import React from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl';

import TinodeWeb from './views/tinode-web.jsx';

ReactDOM.render(
  <IntlProvider
    locale={navigator.language}>
    <TinodeWeb />
  </IntlProvider>,
  document.getElementById('mountPoint')
);

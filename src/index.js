// Put all packages together.
// Used to generate umd/index.prod.js

import React from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider, addLocaleData } from 'react-intl';
import ruData from 'react-intl/locale-data/ru';
addLocaleData(ruData);
import en from './i18n/en.json';
import ru from './i18n/ru.json';

import TinodeWeb from './views/tinode-web.jsx';

ReactDOM.render(
  <IntlProvider
    locale={navigator.language}
    messages={en} >
    <TinodeWeb />
  </IntlProvider>,
  document.getElementById('mountPoint')
);

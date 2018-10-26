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

import HashNavigation from './lib/navigation.js';

const {params} = HashNavigation.parseUrlHash(window.location.hash);
const language = (params && params.hl) ||
  (navigator.languages && navigator.languages[0]) ||
  navigator.language ||
  navigator.userLanguage;

ReactDOM.render(
  <IntlProvider locale={language} messages={en} >
    <TinodeWeb />
  </IntlProvider>,
  document.getElementById('mountPoint')
);

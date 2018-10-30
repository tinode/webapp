// Put all packages together.
// Used to generate umd/index.prod.js

import React from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider, addLocaleData } from 'react-intl';
import ruData from 'react-intl/locale-data/ru';
addLocaleData(ruData);
import allMessages from './messages.json';

import TinodeWeb from './views/tinode-web.jsx';

import HashNavigation from './lib/navigation.js';

const {params} = HashNavigation.parseUrlHash(window.location.hash);
const language = (params && params.hl) ||
  (navigator.languages && navigator.languages[0]) ||
  navigator.language ||
  navigator.userLanguage;

const baseLanguage = language.toLowerCase().split(/[-_]+/)[0];

// Try full locale, try locale without region code, fallback to 'en'
const messages =
  allMessages[language] ||
  allMessages[baseLanguage] ||
  allMessages.en;

ReactDOM.render(
  <IntlProvider locale={language} messages={messages} textComponent={React.Fragment}>
    <TinodeWeb />
  </IntlProvider>,
  document.getElementById('mountPoint')
);

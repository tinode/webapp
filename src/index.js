// Put all packages together.
// Used to generate umd/index.prod.js

import React from 'react';
import ReactDOM from 'react-dom';

import { IntlProvider, addLocaleData } from 'react-intl';
const reactIntlLocaleData = {
  zh: () => import(/* webpackChunkName: "locale_zh" */ 'react-intl/locale-data/zh'), // Chinese simplified.
  ru: () => import(/* webpackChunkName: "locale_ru" */ 'react-intl/locale-data/ru'), // Russian.
  en: () => import(/* webpackChunkName: "locale_en" */ 'react-intl/locale-data/en') // English, default.
};

// import enLocale from 'react-intl/locale-data/en';
// Russian
// import ruLocale from 'react-intl/locale-data/ru';
// Chinese simplified.
// import zhLocale from 'react-intl/locale-data/zh';
// addLocaleData([...enLocale, ...ruLocale, ...zhLocale]);

import allMessages from './messages.json';
import TinodeWeb from './views/tinode-web.jsx';
import HashNavigation from './lib/navigation.js';

// Detect human language to use in the UI:
// Check parameters from URL hash #?hl=ru, then browser, then use 'en' as a fallback.
const { params } = HashNavigation.parseUrlHash(window.location.hash);
const language = (params && params.hl) ||
  (navigator.languages && navigator.languages[0]) ||
  navigator.language ||
  navigator.userLanguage ||
  'en';

console.log("== Got language", language);

// Gets the base language 'en' from a more specific 'en_GB' or 'en-US' as a partial fallback.
const baseLanguage = language.toLowerCase().split(/[-_]/)[0];

// Dynamically load locale data for the selected language.
const localeDataLoader =
  reactIntlLocaleData[language] ||
  reactIntlLocaleData[baseLanguage] ||
  reactIntlLocaleData['en'];
localeDataLoader().then((data) => {
  addLocaleData(data);
});

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

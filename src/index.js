// Put all packages together.
// Used to generate umd/index.prod.js

console.log("hello!");

import React from 'react';
import { createRoot } from 'react-dom/client';

import { IntlProvider } from 'react-intl';

import allMessages from './messages.json';
import TinodeWeb from './views/tinode-web.jsx';
import HashNavigation from './lib/navigation.js';

/*
// Load just one language.
const messageLoader = {
  'de': _ => import('./i18n.min/de.json'),
  'en': _ => import('./i18n.min/en.json'),
  'es': _ => import('./i18n.min/es.json'),
  'fr': _ => import('./i18n.min/fr.json'),
  'ko': _ => import('./i18n.min/ko.json'),
  'ro': _ => import('./i18n.min/ro.json'),
  'ru': _ => import('./i18n.min/ru.json'),
  'zh': _ => import('./i18n.min/zh.json'),
  'zh-TW': _ => import('./i18n.min/zh-TW.json')
};
*/

// Detect human language to use in the UI:
//  Check parameters from URL hash #?hl=ru, then browser, then use 'en' as a fallback.
const { params } = HashNavigation.parseUrlHash(window.location.hash);
const language = (params && params.hl) ||
  (navigator.languages && navigator.languages[0]) ||
  navigator.language ||
  navigator.userLanguage ||
  'en';

// Make sure names like 'en_GB' and 'en-GB' consistently use '-'.
const normalized = language.replace('_', '-');
// Get the base language 'en' from a more specific 'en_GB' or 'en-US' as a partial fallback.
const baseLanguage = normalized.split(/[-]/)[0].toLowerCase();

// Try the full locale first, then the locale without the region code, fallback to 'en'.
// const htmlLang = messageLoader[normalized] ? language : messageLoader[baseLanguage] ? baseLanguage : 'en';
// const messages = await messageLoader[htmlLang]();
const htmlLang = allMessages[normalized] ? language : allMessages[baseLanguage] ? baseLanguage : 'en';
const messages = allMessages[htmlLang];

console.log("language:", htmlLang, "messages loaded", messages);

// Set lang attribute of the HTML element: <html lang="XX">
document.getElementsByTagName('html')[0].setAttribute('lang', htmlLang);
// Render the app.
const root = createRoot(document.getElementById('mountPoint'));
root.render(
  <IntlProvider locale={language} messages={messages} textComponent={React.Fragment}>
    <TinodeWeb />
  </IntlProvider>
);

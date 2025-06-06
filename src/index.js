// Put all packages together.
// Used to generate umd/index.prod.js

import React from 'react';
import { createRoot } from 'react-dom/client';

import { IntlProvider } from 'react-intl';

import TinodeWeb from './views/tinode-web.jsx';
import HashNavigation from './lib/navigation.js';

// Insert google analytics script and tag if configured.
if (typeof FIREBASE_INIT != 'undefined' && FIREBASE_INIT && FIREBASE_INIT.measurementId) {
  const head = document.getElementsByTagName('head')[0];
  let script = document.createElement('script');
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + FIREBASE_INIT.measurementId;
  script.async = true;
  head.prepend(script);
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', FIREBASE_INIT.measurementId);
}

// Allow loading translation strings for just one language.
const messageLoader = {
  'ar': _ => import('./i18n.min/ar.json'),
  'de': _ => import('./i18n.min/de.json'),
  'en': _ => import('./i18n.min/en.json'),
  'es': _ => import('./i18n.min/es.json'),
  'fr': _ => import('./i18n.min/fr.json'),
  'ko': _ => import('./i18n.min/ko.json'),
  'ro': _ => import('./i18n.min/ro.json'),
  'ru': _ => import('./i18n.min/ru.json'),
  'th': _ => import('./i18n.min/th.json'),
  'uk': _ => import('./i18n.min/uk.json'),
  'zh': _ => import('./i18n.min/zh.json'),
  'zh-TW': _ => import('./i18n.min/zh-TW.json')
};

// List of languages that are written right-to-left.
const rtl = ['ar', 'fa', 'he', 'ur'];

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
// Get the base language 'en' from a more specific 'en-US' as a partial fallback.
const baseLanguage = normalized.split('-')[0].toLowerCase();

// Try the full locale first, then the locale without the region code, fallback to 'en'.
const htmlLang = messageLoader[normalized] ? language : messageLoader[baseLanguage] ? baseLanguage : 'en';

const html = document.getElementsByTagName('html')[0];
// Set lang attribute of the HTML element: <html lang="XX">
html.setAttribute('lang', htmlLang);
if (rtl.includes(baseLanguage)) {
  // Set right-to-left dir attribute of the HTML element: <html dir="rtl">
  html.setAttribute('dir', 'rtl');
}
// Render the app.
const root = createRoot(document.getElementById('mountPoint'));
messageLoader[htmlLang]().then(messages =>
  root.render(
    <IntlProvider locale={language} messages={messages} textComponent={React.Fragment}>
      <TinodeWeb />
    </IntlProvider>
));

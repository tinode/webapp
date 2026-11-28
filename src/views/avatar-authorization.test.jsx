import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Tinode } from 'tinode-sdk';

import { API_KEY } from '../config.js';
import Contact from '../widgets/contact.jsx';
import SideNavbar from '../widgets/side-navbar.jsx';

jest.mock('react-intl', () => ({
  defineMessages: messages => messages,
  injectIntl: Component => Component,
}));

const avatar = '/v0/file/s/example.png';
const token = 'test-token';
let tinode;

beforeAll(async () => {
  global.Audio = jest.fn();
  const TinodeWeb = require('./tinode-web.jsx').default;
  Tinode.setDatabaseProvider({
    deleteDatabase() {
      const request = {};
      queueMicrotask(() => request.onsuccess());
      return request;
    },
  });

  await new Promise(resolve => {
    tinode = TinodeWeb.tnSetup('example.invalid', true, 'ws', 'en', false, resolve);
  });
  tinode.setAuthToken({ token, expires: new Date(Date.now() + 60_000) });
});

afterAll(() => {
  Tinode.setDatabaseProvider(undefined);
  delete global.Audio;
});

function avatarSrc(element) {
  const markup = renderToStaticMarkup(element);
  return markup.match(/<img [^>]*src="([^"]+)"/)[1].replaceAll('&amp;', '&');
}

function expectAuthorizedAvatar(src) {
  const url = new URL(src, 'https://example.invalid');
  expect(url.pathname).toBe(avatar);
  expect(url.searchParams.getAll('apikey')).toEqual([API_KEY]);
  expect(url.searchParams.getAll('auth')).toEqual(['token']);
  expect(url.searchParams.getAll('secret')).toEqual([token]);
}

test('authorizes an uploaded chat-list avatar', () => {
  expectAuthorizedAvatar(avatarSrc(<Contact tinode={tinode} item="usrExample" title="Example" avatar={avatar} />));
});

test('authorizes the sidebar avatar once', () => {
  expectAuthorizedAvatar(avatarSrc(<SideNavbar tinode={tinode} myUserId="usrExample" avatar={avatar} />));
});

test.each(['https://images.invalid/avatar.png', 'data:image/png;base64,dGVzdA=='])(
  'preserves the avatar source %s', src => {
    expect(avatarSrc(<Contact tinode={tinode} item="usrExample" title="Example" avatar={src} />)).toBe(src);
  }
);

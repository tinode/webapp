// Must be located at the root.
importScripts('https://cdn.jsdelivr.net/npm/firebase@8.9.1/firebase-app.js');
importScripts('https://cdn.jsdelivr.net/npm/firebase@8.9.1/firebase-messaging.js');
importScripts('firebase-init.js');
importScripts('version.js');

// Channel to notify the webapp. There is no BroadcastChannel in Safari.
const webAppChannel = (typeof BroadcastChannel == 'function') ?
  new BroadcastChannel('tinode-sw') : null;

// Basic internationalization.
const i18n = {
  'de': {
    'new_message': "Neue Nachricht",
    'new_chat': "Neuer Chat",
  },
  'en': {
    'new_message': "New message",
    'new_chat': "New chat",
  },
  'es': {
    'new_message': "Nuevo mensaje",
    'new_chat': "Nueva conversación",
  },
  'ko': {
    'new_message': "새로운 메시지",
    'new_chat': "새로운 채팅",
  },
  'ro': {
    'new_message': "Mesaj nou",
    'new_chat': "Chat nou",
  },
  'ru': {
    'new_message': "Новое сообщение",
    'new_chat': "Новый чат",
  },
  'zh': {
    'new_message': "新讯息",
    'new_chat': "新聊天",
  },
  'zh-TW': {
    'new_message': "新訊息",
    'new_chat': "新聊天",
  }
};
self.i18nMessage = function(id) {
  // Choose translations: given something like 'de-CH', try 'de-CH' then 'de' then 'en'.
  const lang = i18n[self.locale] || i18n[self.baseLocale] || i18n['en'];
  // Try finding string by id in the specified language, if missing try English, otherwise use the id itself
  // as the last resort.
  return lang[id] || i18n['en'][id] || id;
}

firebase.initializeApp(FIREBASE_INIT);
const fbMessaging = firebase.messaging();

// This method shows the push notifications while the window is in background.
fbMessaging.onBackgroundMessage((payload) => {
  if (payload.data.silent == 'true') {
    return;
  }

  // Notify webapp that a message was received.
  if (webAppChannel) {
    webAppChannel.postMessage(payload.data);
  }

  const pushType = payload.data.what || 'msg';
  const title = payload.data.title || self.i18nMessage(pushType == 'msg' ? 'new_message' : 'new_chat');
  const options = {
    body: payload.data.content || '',
    icon: '/img/logo96.png',
    badge: '/img/badge96.png',
    tag: payload.data.topic || undefined,
    data: {
      topic: payload.data.topic
    }
  };
  return self.registration.showNotification(title, options);
});

// Update service worker immediately for both the current client
// and all other active clients.
self.addEventListener('install', event => {
  self.skipWaiting();
});

// This code handles a click on notification: takes
// the user to the browser tab with the chat or opens a new tab.
self.addEventListener('notificationclick', event => {
  const notification = event.notification;
  notification.close();

  const urlHash = '#/' + notification.data.topic;

  event.waitUntil(self.clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  }).then((windowClients) => {
    let anyClient = null;
    for (let i = 0; i < windowClients.length; i++) {
      const url = new URL(windowClients[i].url);
      if (url.hash.includes(notification.data.topic)) {
        // Found the Tinode tab with the right topic open.
        return windowClients[i].focus();
      } else {
        // This will be the least recently used tab.
        anyClient = windowClients[i];
      }
    }

    // Found tab with Tinode on a different topic,
    // navigate to the right topic.
    if (anyClient) {
      const url = new URL(anyClient.url);
      url.hash = urlHash;
      return anyClient.focus().then(thisClient => {
        return thisClient.navigate(url);
      });
    }

    // Did not find a Tinode browser tab. Open one.
    const url = new URL(self.location.origin);
    url.hash = urlHash;
    return clients.openWindow(url);
  }));
});

// This is needed for 'Add to Home Screen'.
self.addEventListener('fetch', event => {
  if (event.request.method != 'GET') {
    return;
  }

  event.respondWith((async () => {
    //  Try to find the response in the cache.
    const cache = await caches.open(PACKAGE_VERSION);
    const cachedResponse = await cache.match(event.request);
    if (cachedResponse) {
      return cachedResponse;
    }
    // Not found in cache.
    const response = await fetch(event.request);
    if (!response || response.status != 200 || response.type != 'basic') {
      return response;
    }
    if (event.request.url && (event.request.url.startsWith('http://') || event.request.url.startsWith('https://'))) {
      await cache.put(event.request, response.clone());
    }
    return response;
  })());
});

// This code gets the human language from the webapp.
self.addEventListener('message', event => {
  const data = JSON.parse(event.data);

  // The locale is used for selecting strings in an appropriate language.
  self.locale = data.locale || '';
  self.baseLocale = self.locale.toLowerCase().split(/[-_]/)[0];
});

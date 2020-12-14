// Must be located at the root.
importScripts('https://cdn.jsdelivr.net/npm/firebase@7.24.0/firebase-app.js');
importScripts('https://cdn.jsdelivr.net/npm/firebase@7.24.0/firebase-messaging.js');
importScripts('firebase-init.js');

firebase.initializeApp(FIREBASE_INIT);

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
  }
};
self.i18nMessage = function(id) {
  // Choose translations: given something like 'de-CH', try 'de-CH' then 'de' then 'en'.
  const lang = i18n[self.locale] || i18n[self.baseLocale] || i18n['en'];
  // Try finding string by id in the specified language, if missing try English, otherwise use the id itself
  // as the last resort.
  return lang[id] || i18n['en'][id] || id;
}

// This method shows the push notifications.
firebase.messaging().setBackgroundMessageHandler((payload) => {
  if (payload.data.silent == 'true') {
    return;
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
  event.respondWith(
    //  Try to find response in cache.
    caches.match(event.request)
      .then((resp) => {
        // If response is found in cache, return it. Otherwise fetch.
        return resp || fetch(event.request);
      })
      .catch((err) => {
        // Something went wrong.
        console.log("Service worker Fetch:", err);
      })
  );
});

// This code get the human language from the webapp for localization of strings.
self.addEventListener('message', event => {
  const data = JSON.parse(event.data);
  self.locale = data.locale || '';
  self.baseLocale = self.locale.toLowerCase().split(/[-_]/)[0];
});

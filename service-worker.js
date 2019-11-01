// Must be located at the root.
importScripts('https://cdn.jsdelivr.net/npm/firebase@6.6.2/firebase-app.js');
importScripts('https://cdn.jsdelivr.net/npm/firebase@6.6.2/firebase-messaging.js');
importScripts('firebase-init.js');

firebase.initializeApp(FIREBASE_INIT);

// This method shows the notifications.
firebase.messaging().setBackgroundMessageHandler(function(payload) {
  let title = payload.data.title || "New message";
  let options = {
    body: payload.data.content || "",
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
  // Workaround for https://bugs.chromium.org/p/chromium/issues/detail?id=823392
  if (event.request.cache == 'only-if-cached' && event.request.mode != 'same-origin') {
    return;
  }
  event.respondWith(
    //  Try to find response in cache.
    caches.match(event.request)
      .then((resp) => {
        // If response is found in cache, return it. Otherwise fetch.
        return resp || fetch(event.request);
      })
      .catch((err) => {
        // Something went wrong.
        console.log("Service worker Fetch: ", err);
      })
  );
});

// Must be located at the root.
importScripts('https://unpkg.com/firebase@5.8.1/firebase-app.js');
importScripts('https://unpkg.com/firebase@5.8.1/firebase-messaging.js');
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

// This code handles a click on notification: takes
// the user to the browser tab with the chat or opens a new tab.
self.addEventListener('notificationclick', function(event) {
  const notification = event.notification;
  notification.close();

  const urlHash = '#/' + notification.data.topic;

  const promises = self.clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  }).then((windowClients) => {
    let matchingClient = null;
    let anyClient = null;
    for (let i = 0; i < windowClients.length; i++) {
      const url = new URL(windowClients[i].url);
      if (url.hash.includes(notification.data.topic)) {
        matchingClient = windowClients[i];
        break;
      } else {
        anyClient = windowClients[i];
      }
    }

    // Found browser tab with the topic already open.
    if (matchingClient) {
      return matchingClient.focus();
    }

    // Found browser tab with Tinode on a different topic,
    // navigate to the right topic.
    if (anyClient) {
      const url = new URL(anyClient.url);
      url.hash = '#/' + notification.data.topic;
      return anyClient.navigate(url).then(() => { return anyClient.focus(); });
    }

    // Did not find a Tinode browser tab. Open one.
    const url = new URL(self.location.origin);
    url.hash = '#/' + notification.data.topic;
    return clients.openWindow(url);

  });

  event.waitUntil(promises);
});

// This is needed for 'Add to Home Screen'.
self.addEventListener('fetch', function(event) {
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

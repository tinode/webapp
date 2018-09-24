// Must be located at the root.
importScripts("https://unpkg.com/firebase@5.5.1/firebase-app.js");
importScripts("https://unpkg.com/firebase@5.5.1/firebase-messaging.js");
importScripts("/firebase-init.js")

firebase.initializeApp(FIREBASE_INIT);

firebase.messaging().setBackgroundMessageHandler(function(payload) {
  let title = payload.notification.title || "New message";
  let options = {
    body: payload.notification.body || "",
    icon: '/img/logo96.png'
  };
  console.log("background message", payload);

  return self.registration.showNotification(title, options);
});

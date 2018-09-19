// Must be located at the root.
'use strict';

importScripts("https://unpkg.com/firebase@5.5.0/firebase-app.js");
importScripts("https://unpkg.com/firebase@5.5.0/firebase-messaging.js");

const FIREBASE_PUBLIC_API_KEY = "AIzaSyD6X4ULR-RUsobvs1zZ2bHdJuPz39q2tbQ";
const FIREBASE_SENDER_ID = "114126160546";

firebase.initializeApp({
  apiKey: FIREBASE_PUBLIC_API_KEY,
  messagingSenderId: FIREBASE_SENDER_ID
});

firebase.messaging().setBackgroundMessageHandler(function(payload) {
  let title = payload.notification.title || "New message";
  let options = {
    body: payload.notification.body || "",
    icon: '/img/logo96.png'
  };

  return self.registration.showNotification(title, options);
});

# Push notifications

If you want to use the app with your own server and want web push notification to work you have to set them up:

* Register at https://firebase.google.com/, set up the project if you have not done so already.
* Follow instructions to create a web application https://support.google.com/firebase/answer/9326094 in your project.
* Follow instructions at https://support.google.com/firebase/answer/7015592 to get a Firebase configuration object ("Firebase SDK snippet").
* Locate `firebase-init.js` in the root folder of your copy of TinodeWeb app. Copy-paste the following keys from the configuration object to `firebase-init.js`: `apiKey`, `messagingSenderId`, `projectId`, `appId` (you may copy all keys).
* Copy `Web Push certificate` (Project Settings -> Cloud Messaging -> Web configuration -> Web Push certificates) to `messagingVapidKey` field in `firebase-init.js`.
* Double check that `firebase-init.js` contains the following keys: `apiKey`, `messagingSenderId`, `projectId`, `appId`, `messagingVapidKey`. The file may contain other optional keys.
* Copy Google-provided server key to `tinode.conf`, see details [here](https://github.com/tinode/chat/blob/master/docs/faq.md#q-how-to-setup-fcm-push-notifications).

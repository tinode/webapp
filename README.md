# Single-page chat with Tinode

Example using [Tinode](https://github.com/tinode/chat/) to build a single-page chat application. The app uses
[React](https://facebook.github.io/react/), Google's material design [fonts](https://www.google.com/fonts/)
and [icons](https://google.github.io/material-design-icons/#icon-font-for-the-web). The [Tinode javascript library](https://github.com/tinode/tinode-js/) has no external dependencies.

This is work in progress. Bugs are expected. The app was tested in the latest Chrome & Firefox only.

Try it (possibly older version) live at http://api.tinode.co/x/example-react-js/. Login as one of `alice`, `bob`, `carol`, `dave`, `frank`. Password is `<login>123`, e.g. password for `alice` is `alice123`.

License: [Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0)

Photos from https://www.pexels.com/ under [CC0 license](https://www.pexels.com/photo-license/).

Background pattern from http://subtlepatterns.com/, commercial and non-commercial use allowed with attribution.

## Missing functionality

* Cannot manage group members.
* Editing chat parameters is incomplete and buggy.
* Cannot send images or other media.
* No typing indicators.
* No indicators of chat status (muted, blocked, etc.).
* Long polling as a wire transport does not work.
* Browser push notifications are missing.
* No encryption.

## Responsive design

### Desktop

<p align="center">
  <img src="web-desktop.png" alt="Desktop web: full app" width=866 />
</p>

### Mobile

<p align="center">
  <img src="web-mob-contacts.png" alt="Mobile web: contacts" width=323 /> <img src="web-mob-chat.png" alt="Mobile web: chat" width=323 /> <img src="web-mob-topicinfo.png" alt="Mobile web: topic info" width=323 />
</p>

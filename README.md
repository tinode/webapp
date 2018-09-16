# Single-page chat with Tinode

Single-page web chat application built with [Tinode](https://github.com/tinode/chat/). The app uses
[React](https://facebook.github.io/react/), Google's material design [fonts](https://www.google.com/fonts/)
and [icons](https://google.github.io/material-design-icons/#icon-font-for-the-web). The [Tinode javascript SDK](https://github.com/tinode/tinode-js/) has no external dependencies.
Overall it's a lot like open source WhatsApp or Telegram web apps.

The app is about 200KB minified and gzipped. That includes all dependencies (React, ReactDOM), fonts, graphics, css etc.

Although the app is generally usable, keep in mind that this is work in progress. Some bugs probably exist. The app was tested in the latest Chrome & Firefox only. NPM [is available](https://www.npmjs.com/package/tinode-webapp).

Try possibly newer or older version live at https://api.tinode.co/. For login and other instructions [see here](https://github.com/tinode/chat/#demo).

Demo avatar photos are from https://www.pexels.com/ under [CC0 license](https://www.pexels.com/photo-license/).

Background pattern from http://subtlepatterns.com/, commercial and non-commercial use allowed with attribution.

## Getting support

* Read [client-side](http://tinode.github.io/js-api/) and [server-side](https://github.com/tinode/chat/blob/master/docs/API.md) API documentation.
* For support, general questions, discussions post to [https://groups.google.com/d/forum/tinode](https://groups.google.com/d/forum/tinode).
* For bugs and feature requests [open an issue](https://github.com/tinode/webchat/issues/new).

## Missing functionality

* Previews not generated for videos, audio, links or docs.
* Browser push notifications are not implemented.
* No end-to-end encryption.
* Editing chat permissions is incomplete.
* Emoji support is weak.

## Responsive design

### Desktop screenshot

<p align="center">
  <img src="web-desktop-2.png" alt="Desktop web: full app" width=866 />
</p>

### Mobile screenshots

<p align="center">
  <kbd><img src="web-mob-contacts-1.png" alt="Mobile web: contacts" width=323 /></kbd> <kbd><img src="web-mob-chat-1.png" alt="Mobile web: chat" width=323 /></kbd> <kbd><img src="web-mob-info-1.png" alt="Mobile web: topic info" width=323 /></kbd> <kbd><img src="web-mob-new-chat-1.png" alt="Mobile web: start new chat" width=323 /></kbd>
</p>

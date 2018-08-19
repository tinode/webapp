# Single-page chat with Tinode

Single-page web chat application built with [Tinode](https://github.com/tinode/chat/). The app uses
[React](https://facebook.github.io/react/), Google's material design [fonts](https://www.google.com/fonts/)
and [icons](https://google.github.io/material-design-icons/#icon-font-for-the-web). The [Tinode javascript library](https://github.com/tinode/tinode-js/) has no external dependencies. Overall it's a lot like open source WhatsApp or Telegram web apps.

Although the app is generally usable, keep in mind that this is work in progress. Some bugs probably exist. The app was tested in the latest Chrome & Firefox only. NPM [is available](https://www.npmjs.com/package/tinode-webapp).

Try possibly newer or older version live at https://api.tinode.co/. Login as one of `alice`, `bob`, `carol`, `dave`, `frank`. Password is `<login>123`, e.g. password for `alice` is `alice123`. You can discover other users by email or phone by prefixing them with `email:` or `tel:` respectively. Emails are `<login>@example.com`, e.g. `alice@example.com`, phones are `17025550001` through `17025550009`. The demo is reset every night at 2:15am Pacific time.

License: [Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0)

Sample avatar photos from https://www.pexels.com/ under [CC0 license](https://www.pexels.com/photo-license/).

Background pattern from http://subtlepatterns.com/, commercial and non-commercial use allowed with attribution.

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

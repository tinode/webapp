"use strict";
(self["webpackChunktinode_webapp"] = self["webpackChunktinode_webapp"] || []).push([["src_widgets_the-card-preview_jsx"],{

/***/ "./src/widgets/the-card-preview.jsx":
/*!******************************************!*\
  !*** ./src/widgets/the-card-preview.jsx ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ TheCardPreview; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var libphonenumber_js_mobile__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! libphonenumber-js/mobile */ "./node_modules/libphonenumber-js/mobile/exports/parsePhoneNumberWithError.js");
/* harmony import */ var _send_message_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./send-message.jsx */ "./src/widgets/send-message.jsx");
/* harmony import */ var _letter_tile_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./letter-tile.jsx */ "./src/widgets/letter-tile.jsx");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! tinode-sdk */ "tinode-sdk");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");







const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  unknown_name: {
    id: "unknown_name",
    defaultMessage: [{
      "type": 0,
      "value": "Unknown"
    }]
  }
});
class TheCardPreview extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.state = {
      content: props.content.object
    };
    if (!props.content.object) {
      (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_6__.importVCard)(props.content.file).then(card => {
        this.setState({
          content: card
        });
      });
    }
    this.handleSendCard = this.handleSendCard.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }
  handleKeyDown(e) {
    e.preventDefault();
    if (e.key === 'Escape') {
      this.props.onClose();
    }
  }
  handleSendCard() {
    this.props.onClose();
    this.props.onSendMessage(this.props.content);
  }
  render() {
    const card = this.state.content;
    const fullName = tinode_sdk__WEBPACK_IMPORTED_MODULE_5__.TheCard.getFn(card);
    const photoUrl = tinode_sdk__WEBPACK_IMPORTED_MODULE_5__.TheCard.getPhotoUrl(card) || null;
    const note = card?.note;
    const org = tinode_sdk__WEBPACK_IMPORTED_MODULE_5__.TheCard.getOrg(card);
    const emails = tinode_sdk__WEBPACK_IMPORTED_MODULE_5__.TheCard.getComm(card, 'email') || [];
    const phones = tinode_sdk__WEBPACK_IMPORTED_MODULE_5__.TheCard.getComm(card, 'tel') || [];
    const tinodeIds = tinode_sdk__WEBPACK_IMPORTED_MODULE_5__.TheCard.getComm(card, 'tinode') || [];
    const urls = tinode_sdk__WEBPACK_IMPORTED_MODULE_5__.TheCard.getComm(card, 'http') || [];
    const contacts = [];
    emails.forEach((email, idx) => {
      const types = Array.isArray(email.des) ? email.des.join(', ') : '';
      contacts.push(react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "group quoted",
        key: `email-${idx}`
      }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("tt", null, email.value), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
        className: "small gray"
      }, " ", types ? `(${types})` : '')));
    });
    phones.forEach((phone, idx) => {
      let val = phone.value;
      try {
        const number = (0,libphonenumber_js_mobile__WEBPACK_IMPORTED_MODULE_2__.parsePhoneNumberWithError)(phone.value);
        val = number ? number.formatInternational() : phone.value;
      } catch (err) {}
      const types = Array.isArray(phone.des) ? phone.des.join(', ') : '';
      contacts.push(react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "group quoted",
        key: `tel-${idx}`
      }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("tt", null, val), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
        className: "small gray"
      }, " ", types ? `(${types})` : '')));
    });
    tinodeIds.forEach((tid, idx) => {
      const types = Array.isArray(tid.des) ? tid.des.join(', ') : '';
      contacts.push(react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "group quoted",
        key: `tinode-${idx}`
      }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("tt", null, tid.value), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
        className: "small gray"
      }, " ", types ? `(${types})` : '')));
    });
    urls.forEach((url, idx) => {
      const types = Array.isArray(url.des) ? url.des.join(', ') : '';
      contacts.push(react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "group quoted",
        key: `url-${idx}`
      }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("tt", null, url.value), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
        className: "small gray"
      }, " ", types ? `(${types})` : '')));
    });
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "image-preview"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "preview-caption-panel"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_contact_card",
      defaultMessage: [{
        "type": 0,
        "value": "Contact Card"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: e => {
        e.preventDefault();
        this.props.onClose();
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "m-icon gray"
    }, "close"))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "image-preview-container"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "doc-card"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "panel-form-column"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("center", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "avatar-box"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_letter_tile_jsx__WEBPACK_IMPORTED_MODULE_4__["default"], {
      authorizeURL: this.props.tinode.authorizeURL,
      avatar: photoUrl || true,
      topic: "usrXXX123",
      title: fullName
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "group"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "large ellipsized"
    }, fullName || react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, messages.unknown_name))), org ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "group"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, org)) : null, note ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "group"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_description",
      defaultMessage: [{
        "type": 0,
        "value": "Description"
      }]
    })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "quoted"
    }, note)) : null, contacts.length > 0 ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "group"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      className: "small"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_contacts",
      defaultMessage: [{
        "type": 0,
        "value": "Contacts"
      }]
    })), contacts) : null))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_send_message_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
      noInput: true,
      tinode: this.props.tinode,
      reply: this.props.reply,
      onCancelReply: this.props.onCancelReply,
      onSendMessage: this.handleSendCard,
      onError: this.props.onError
    }));
  }
}

/***/ })

}]);
//# sourceMappingURL=src_widgets_the-card-preview_jsx.dev.js.map
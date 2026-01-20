"use strict";
(self["webpackChunktinode_webapp"] = self["webpackChunktinode_webapp"] || []).push([["src_widgets_video-preview_jsx"],{

/***/ "./src/widgets/video-preview.jsx":
/*!***************************************!*\
  !*** ./src/widgets/video-preview.jsx ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _send_message_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./send-message.jsx */ "./src/widgets/send-message.jsx");
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");




const messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_1__.defineMessages)({
  unrecognized_video_format: {
    id: "unrecognized_video_format",
    defaultMessage: [{
      "type": 0,
      "value": "Format of this video is not recognized"
    }]
  }
});
class VideoPreview extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.videoRef = react__WEBPACK_IMPORTED_MODULE_0___default().createRef();
    this.handleSendVideo = this.handleSendVideo.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }
  handleKeyDown(e) {
    if (this.props.onSendMessage) {
      return;
    }
    e.preventDefault();
    if (e.key === 'Escape') {
      this.props.onClose();
    }
  }
  handleSendVideo(caption) {
    this.props.onClose();
    const params = {
      width: this.videoRef.current.videoWidth,
      height: this.videoRef.current.videoHeight,
      duration: this.videoRef.current.duration * 1000 | 0,
      mime: this.props.content.mime,
      name: this.props.content.filename
    };
    if (params.width == 0 || params.height == 0) {
      this.props.onError(this.props.intl.formatMessage(messages.unrecognized_video_format), 'err');
      return;
    }
    const canvas = document.createElement('canvas');
    canvas.width = params.width;
    canvas.height = params.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(this.videoRef.current, 0, 0, canvas.width, canvas.height);
    ctx.canvas.toBlob(preview => this.props.onSendMessage(caption, this.props.content.blob, preview, params), 'image/jpeg', 0.75);
  }
  render() {
    if (!this.props.content) {
      return null;
    }
    const width = this.props.content.width || '-';
    const height = this.props.content.height || '-';
    const controlist = this.props.onSendMessage ? 'nodownload' : '';
    const autoPlay = !this.props.onSendMessage;
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "image-preview"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "preview-caption-panel"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, this.props.content.filename), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: "#",
      onClick: e => {
        e.preventDefault();
        this.props.onClose();
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "m-icon gray"
    }, "close"))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "image-preview-container"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("video", {
      className: "image-preview",
      controls: true,
      controlsList: controlist,
      disablePictureInPicture: true,
      ref: this.videoRef,
      autoPlay: autoPlay,
      src: this.props.tinode.authorizeURL(this.props.content.url),
      poster: this.props.content.preview,
      alt: this.props.content.filename
    })), this.props.onSendMessage ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_send_message_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
      messagePrompt: "add_image_caption",
      acceptBlank: true,
      tinode: this.props.tinode,
      reply: this.props.reply,
      onCancelReply: this.props.onCancelReply,
      onSendMessage: this.handleSendVideo,
      onError: this.props.onError
    }) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "image-preview-footer"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("b", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_file_name",
      defaultMessage: [{
        "type": 0,
        "value": "File name:"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
      title: this.props.content.filename
    }, this.props.content.filename))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("b", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_content_type",
      defaultMessage: [{
        "type": 0,
        "value": "Content type:"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, this.props.content.type)), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("b", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "label_size",
      defaultMessage: [{
        "type": 0,
        "value": "Size:"
      }]
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, width, " \xD7 ", height, " px; ", (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_3__.bytesToHumanSize)(this.props.content.size)))));
  }
}
;
/* harmony default export */ __webpack_exports__["default"] = ((0,react_intl__WEBPACK_IMPORTED_MODULE_1__.injectIntl)(VideoPreview));

/***/ })

}]);
//# sourceMappingURL=src_widgets_video-preview_jsx.dev.js.map
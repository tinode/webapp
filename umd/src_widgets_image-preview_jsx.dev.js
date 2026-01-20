"use strict";
(self["webpackChunktinode_webapp"] = self["webpackChunktinode_webapp"] || []).push([["src_widgets_image-preview_jsx"],{

/***/ "./src/widgets/image-preview.jsx":
/*!***************************************!*\
  !*** ./src/widgets/image-preview.jsx ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ ImagePreview; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _send_message_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./send-message.jsx */ "./src/widgets/send-message.jsx");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");







class ImagePreview extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0
    };
    this.handleSendImage = this.handleSendImage.bind(this);
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
  assignWidth(node) {
    if (node && !this.state.width) {
      const bounds = node.getBoundingClientRect();
      this.setState({
        width: bounds.width | 0,
        height: bounds.height | 0
      });
    }
  }
  handleSendImage(caption) {
    this.props.onClose();
    this.props.onSendMessage(caption, this.props.content.blob);
  }
  render() {
    if (!this.props.content) {
      return null;
    }
    const dim = (0,_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_4__.fitImageSize)(this.props.content.width, this.props.content.height, this.state.width, this.state.height, false);
    const size = dim ? {
      width: dim.dstWidth + 'px',
      height: dim.dstHeight + 'px'
    } : this.props.content.width > this.props.content.height ? {
      width: '100%'
    } : {
      height: '100%'
    };
    size.maxWidth = '100%';
    size.maxHeight = '100%';
    const maxlength = Math.max((this.state.width / _config_js__WEBPACK_IMPORTED_MODULE_3__.REM_SIZE / 1.5 | 0) - 2, 12);
    const fname = (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_5__.shortenFileName)(this.props.content.filename, maxlength) || '-';
    const width = this.props.content.width || '-';
    const height = this.props.content.height || '-';
    const download_url = (0,_lib_utils_js__WEBPACK_IMPORTED_MODULE_6__.urlAsAttachment)(this.props.content.url);
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "image-preview"
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      id: "preview-caption-panel"
    }, this.props.onSendMessage ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, fname) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: download_url,
      download: this.props.content.filename
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "m-icon"
    }, "file_download"), " ", react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
      id: "download_action",
      defaultMessage: [{
        "type": 0,
        "value": "download"
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
      id: "image-preview-container",
      ref: node => this.assignWidth(node)
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
      src: this.props.content.url,
      style: size,
      className: "image-preview",
      alt: this.props.content.filename
    })), this.props.onSendMessage ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_send_message_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
      messagePrompt: "add_image_caption",
      acceptBlank: true,
      tinode: this.props.tinode,
      reply: this.props.reply,
      onCancelReply: this.props.onCancelReply,
      onSendMessage: this.handleSendImage,
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
    }, fname))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("b", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
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
    }))), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, width, " \xD7 ", height, " px; ", (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_5__.bytesToHumanSize)(this.props.content.size)))));
  }
}
;

/***/ })

}]);
//# sourceMappingURL=src_widgets_image-preview_jsx.dev.js.map
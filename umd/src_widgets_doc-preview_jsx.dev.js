"use strict";
(self["webpackChunktinode_webapp"] = self["webpackChunktinode_webapp"] || []).push([["src_widgets_doc-preview_jsx"],{

/***/ "./src/widgets/doc-preview.jsx":
/*!*************************************!*\
  !*** ./src/widgets/doc-preview.jsx ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ DocPreview; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _widgets_send_message_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../widgets/send-message.jsx */ "./src/widgets/send-message.jsx");
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");





function iconFromMime(mime) {
  const mimeToIcon = {
    default: 'insert_drive_file',
    image: 'image',
    text: 'description',
    video: 'theaters'
  };
  return mimeToIcon[mime] || mimeToIcon[(mime || '').split('/')[0]] || mimeToIcon['default'];
}
class DocPreview extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.handleSendDoc = this.handleSendDoc.bind(this);
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
  handleSendDoc(caption) {
    this.props.onClose();
    this.props.onSendMessage(this.props.content.file);
  }
  render() {
    if (!this.props.content) {
      return null;
    }
    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
      id: "image-preview",
      children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
        id: "preview-caption-panel",
        children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("span", {
          children: this.props.content.name
        }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("a", {
          href: "#",
          onClick: e => {
            e.preventDefault();
            this.props.onClose();
          },
          children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("i", {
            className: "material-icons gray",
            children: "close"
          }, void 0, false)
        }, void 0, false)]
      }, void 0, true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
        id: "image-preview-container",
        children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
          className: "doc-card",
          children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("i", {
            className: "material-icons gray",
            children: iconFromMime(this.props.content.type)
          }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
            children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("b", {
              children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
                id: "label_file_name",
                defaultMessage: "File name:",
                description: "Label for a file name"
              }, void 0, false)
            }, void 0, false), " ", (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_3__.shortenFileName)(this.props.content.name, 24) || '-']
          }, void 0, true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
            children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("b", {
              children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
                id: "label_content_type",
                defaultMessage: "Content type:",
                description: "Label for file content type (mime)"
              }, void 0, false)
            }, void 0, false), " ", this.props.content.type || 'application/octet-stream']
          }, void 0, true), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
            children: [(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("b", {
              children: (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, {
                id: "label_size",
                defaultMessage: "Size:",
                description: "Label for file size"
              }, void 0, false)
            }, void 0, false), " ", (0,_lib_strformat_js__WEBPACK_IMPORTED_MODULE_3__.bytesToHumanSize)(this.props.content.size)]
          }, void 0, true)]
        }, void 0, true)
      }, void 0, false), (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(_widgets_send_message_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
        noInput: true,
        tinode: this.props.tinode,
        reply: this.props.reply,
        onCancelReply: this.props.onCancelReply,
        onSendMessage: this.handleSendDoc,
        onError: this.props.onError
      }, void 0, false)]
    }, void 0, true);
  }
}
;

/***/ })

}]);
//# sourceMappingURL=src_widgets_doc-preview_jsx.dev.js.map
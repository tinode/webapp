import React from 'react';
import { FormattedMessage } from 'react-intl';
import SendMessage from '../widgets/send-message.jsx';

import { bytesToHumanSize, shortenFileName } from '../lib/strformat.js';

// Get material icon name from mime type.
function iconFromMime(mime) {
  // If more icons become available in material icons, add them to this mime-to-icon mapping.
  const mimeToIcon = {default: 'insert_drive_file', image: 'image', text: 'description', video: 'theaters'};

  return mimeToIcon[mime] || mimeToIcon[(mime || '').split('/')[0]] || mimeToIcon['default'];
}

export default class DocPreview extends React.PureComponent {
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
    return (
      <div id="image-preview">
        <div id="image-preview-caption-panel">
          <span>{this.props.content.name}</span>
          <a href="#" onClick={(e) => {e.preventDefault(); this.props.onClose();}}><i className="material-icons gray">close</i></a>
        </div>
        <div id="image-preview-container">
          <div className="doc-card">
            <i className="material-icons gray">{iconFromMime(this.props.content.type)}</i>
            <div><b><FormattedMessage id="label_file_name" defaultMessage="File name:"
              description="Label for a file name" /></b> {shortenFileName(this.props.content.name, 24) || '-'}</div>
            <div><b><FormattedMessage id="label_content_type" defaultMessage="Content type:"
              description="Label for file content type (mime)" /></b> {this.props.content.type || 'application/octet-stream'}</div>
            <div><b><FormattedMessage id="label_size" defaultMessage="Size:"
              description="Label for file size" /></b> {bytesToHumanSize(this.props.content.size)}</div>
          </div>
        </div>
        <SendMessage
          noInput={true}
          tinode={this.props.tinode}
          reply={this.props.reply}
          onCancelReply={this.props.onCancelReply}
          onSendMessage={this.handleSendDoc}
          onError={this.props.onError} />
      </div>
    );
  }
};

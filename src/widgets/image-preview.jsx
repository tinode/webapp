import React from 'react';
import { FormattedMessage } from 'react-intl';
import SendMessage from '../widgets/send-message.jsx';

import { REM_SIZE } from '../config.js';
import { fitImageSize } from '../lib/blob-helpers.js';
import { bytesToHumanSize, shortenFileName } from '../lib/strformat.js';

export default class ImagePreview extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      width: 0,
      height: 0
    };

    this.handleSendImage = this.handleSendImage.bind(this);
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

    const dim = fitImageSize(this.props.content.width, this.props.content.height,
      this.state.width, this.state.height, false);
    const size = dim ? { width: dim.dstWidth + 'px', height: dim.dstHeight + 'px' } :
      ((this.props.content.width > this.props.content.height) ? {width: '100%'} : {height: '100%'});
    size.maxWidth = '100%';
    size.maxHeight = '100%';

    // Average font aspect ratio is ~0.5; File name takes 1/3 of the viewport width.
    const maxlength = Math.max(((this.state.width / REM_SIZE / 1.5) | 0) - 2, 12);
    const fname = shortenFileName(this.props.content.name, maxlength) || '-';

    const width = this.props.content.width || '-';
    const height = this.props.content.height || '-';
    return (
      <div id="image-preview">
        <div id="image-preview-caption-panel">
          {!this.props.onSendMessage ?
            <a href={this.props.content.url} download={true}>
              <i className="material-icons">file_download</i> <FormattedMessage
                id="download_action" defaultMessage="download" description="Call to action [download]" />
            </a>
            :
            <span>{fname}</span>
          }
          <a href="#" onClick={(e) => {e.preventDefault(); this.props.onClose();}}><i className="material-icons gray">close</i></a>
        </div>
        <div id="image-preview-container" ref={(node) => this.assignWidth(node)}>
          <img src={this.props.content.url} style={size} className="image-preview" alt={this.props.content.name} />
        </div>
        {this.props.onSendMessage ?
          <SendMessage
            messagePrompt="add_image_caption"
            acceptBlank={true}
            tinode={this.props.tinode}
            reply={this.props.reply}
            onCancelReply={this.props.onCancelReply}
            onSendMessage={this.handleSendImage}
            onError={this.props.onError} />
          :
          <div id="image-preview-footer">
            <div>
              <div><b><FormattedMessage id="label_file_name" defaultMessage="File name:"
                description="Label for a file name" /></b></div>
              <div><span title={this.props.content.name}>{fname}</span></div>
            </div>
            <div>
              <div><b><FormattedMessage id="label_content_type" defaultMessage="Content type:"
                description="Label for file content type (mime)" /></b></div>
              <div>{this.props.content.type}</div>
            </div>
            <div>
              <div><b><FormattedMessage id="label_size" defaultMessage="Size:"
                description="Label for file size" /></b></div>
              <div>{width} &times; {height} px; {bytesToHumanSize(this.props.content.size)}</div>
            </div>
          </div>}
      </div>
    );
  }
};

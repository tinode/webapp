import React from 'react';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import SendMessage from './send-message.jsx';

import { bytesToHumanSize } from '../lib/strformat.js';

const messages = defineMessages({
  unrecognized_video_format: {
    id: 'unrecognized_video_format',
    defaultMessage: 'Format of this video is not recognized',
    description: 'Error message when uploaded video is invalid',
  }
});

class VideoPreview extends React.PureComponent {
  constructor(props) {
    super(props);

    this.videoRef = React.createRef();

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
      duration: (this.videoRef.current.duration * 1000) | 0,
      mime: this.props.content.mime,
      name: this.props.content.filename
    }

    if (params.width == 0 || params.height == 0) {
      this.props.onError(this.props.intl.formatMessage(messages.unrecognized_video_format), 'err');
      return;
    }

    // Capture screen from a video.
    const canvas = document.createElement('canvas');
    canvas.width = params.width;
    canvas.height = params.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(this.videoRef.current, 0, 0, canvas.width, canvas.height);
    ctx.canvas.toBlob(
        preview => this.props.onSendMessage(caption, this.props.content.blob, preview, params),
        'image/jpeg', 0.75
    );
  }

  render() {
    if (!this.props.content) {
      return null;
    }

    const width = this.props.content.width || '-';
    const height = this.props.content.height || '-';

    const controlist = this.props.onSendMessage ? 'nodownload' : '';
    const autoPlay = !this.props.onSendMessage;

    return (
      <div id="image-preview">
        <div id="image-preview-caption-panel">
          <span>{this.props.content.filename}</span>
          <a href="#" onClick={e => {e.preventDefault(); this.props.onClose();}}><i className="material-icons gray">close</i></a>
        </div>
        <div id="image-preview-container">
          <video
            className="image-preview"
            controls controlsList={controlist}
            disablePictureInPicture ref={this.videoRef}
            autoPlay={autoPlay}
            src={this.props.tinode.authorizeURL(this.props.content.url)}
            poster={this.props.content.preview}
            alt={this.props.content.filename} />
        </div>
        {this.props.onSendMessage ?
        <SendMessage
          messagePrompt="add_image_caption"
          acceptBlank={true}
          tinode={this.props.tinode}
          reply={this.props.reply}
          onCancelReply={this.props.onCancelReply}
          onSendMessage={this.handleSendVideo}
          onError={this.props.onError} />
          :
          <div id="image-preview-footer">
            <div>
              <div><b><FormattedMessage id="label_file_name" defaultMessage="File name:"
                description="Label for a file name" /></b></div>
              <div><span title={this.props.content.filename}>{this.props.content.filename}</span></div>
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

export default injectIntl(VideoPreview);

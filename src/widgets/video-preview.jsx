import React from 'react';
import SendMessage from './send-message.jsx';

export default class VideoPreview extends React.PureComponent {
  constructor(props) {
    super(props);

    this.videoRef = React.createRef();

    this.handleSendVideo = this.handleSendVideo.bind(this);
  }

  handleSendVideo(caption) {
    this.props.onClose();
    const params = {
      width: this.videoRef.current.videoWidth,
      height: this.videoRef.current.videoHeight,
      duration: (this.videoRef.current.duration * 1000) | 0,
      mime: this.props.content.mime,
      name: this.props.content.name
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

    return (
      <div id="image-preview">
        <div id="image-preview-caption-panel">
          <span>{this.props.content.name}</span>
          <a href="#" onClick={e => {e.preventDefault(); this.props.onClose();}}><i className="material-icons gray">close</i></a>
        </div>
        <div id="image-preview-container">
          <video controls ref={this.videoRef} src={this.props.content.url} className="image-preview" alt={this.props.content.name} />
        </div>
        <SendMessage
          messagePrompt="add_image_caption"
          acceptBlank={true}
          tinode={this.props.tinode}
          reply={this.props.reply}
          onCancelReply={this.props.onCancelReply}
          onSendMessage={this.handleSendVideo}
          onError={this.props.onError} />
      </div>
    );
  }
};

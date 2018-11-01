// Single message, sent or received.
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Drafty } from 'tinode-sdk'

import Attachment from './attachment.jsx';
import LetterTile from './letter-tile.jsx';
import ReceivedMarker from './received-marker.jsx'

import { REM_SIZE } from '../config.js';
import { fitImageSize } from '../lib/blob-helpers.js';

export default class ChatMessage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      progress: 0
    };

    if (props.uploader) {
      props.uploader.onProgress = this.handleProgress.bind(this);
    }

    this.handlePreviewImage = this.handlePreviewImage.bind(this);
    this.handleContextClick = this.handleContextClick.bind(this);
    this.handleCancelUpload = this.handleCancelUpload.bind(this);
  }

  handlePreviewImage(e) {
    e.preventDefault();
    this.props.onImagePreview({
      url: e.target.src,
      filename: e.target.title,
      width: e.target.dataset.width,
      height: e.target.dataset.height,
      size: e.target.dataset.size,
      type: e.target.dataset.mime
    });
  }

  handleContextClick(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.showContextMenu({ seq: this.props.seq, y: e.pageY, x: e.pageX });
  }

  handleProgress(ratio) {
    this.setState({progress: ratio});
  }

  handleCancelUpload() {
    this.props.uploader.cancel();
  }

  render() {
    let elementKey = 0;
    const formatter = function(style, data, values) {
      elementKey += 1;
      let el = Drafty.tagName(style);
      if (el) {
        let attr = Drafty.attrValue(style, data) || {};
        attr.key = elementKey;
        if (style == 'IM') {
          // Additional processing for images
          let dim = fitImageSize(data.width, data.height,
            Math.min(this.props.viewportWidth - REM_SIZE * 4, REM_SIZE * 36), REM_SIZE * 24, false);
          attr.className = 'inline-image';
          attr.style = dim ? { width: dim.dstWidth + 'px', height: dim.dstHeight + 'px' } : null;
          attr.onClick = this.handlePreviewImage;
        }
        return React.createElement(el, attr, values);
      } else {
        return values;
      }
    };

    var sideClass = this.props.sequence + ' ' + (this.props.response ? 'left' : 'right');
    var bubbleClass = (this.props.sequence == 'single' || this.props.sequence == 'last') ?
      'bubble tip' : 'bubble';
    var avatar = this.props.userAvatar || true;
    var fullDisplay = (this.props.userFrom && this.props.response &&
      (this.props.sequence == 'single' || this.props.sequence == 'last'));

    var content = this.props.content;
    var attachments = [];
    if (this.props.mimeType == Drafty.getContentType()) {
      Drafty.attachments(content, function(att, i) {
        attachments.push(<Attachment
          tinode={this.props.tinode}
          downloadUrl={Drafty.getDownloadUrl(att)}
          filename={att.name} uploader={Drafty.isUploading(att)}
          mimetype={att.mime} size={Drafty.getEntitySize(att)}
          progress={this.state.progress}
          onCancelUpload={this.handleCancelUpload}
          onError={this.props.onError}
          key={i} />);
      }, this);
      content = React.createElement('span', null, Drafty.format(content, formatter, this));
    } else if (typeof content != 'string') {
      content = <span><i className="material-icons">error_outline</i> <i>
        <FormattedMessage id="invalid_content"
          defaultMessage="invalid content" description="Shown when message is unreadable" />
      </i></span>
    }

    return (
      <li className={sideClass}>
        {this.props.userFrom && this.props.response ?
          <div className="avatar-box">
            {fullDisplay ?
              <LetterTile
                topic={this.props.userFrom}
                title={this.props.userName}
                avatar={avatar} /> :
              null}
          </div> :
          null}
        <div>
          <div className={bubbleClass}>
            <div className="message-content">
              {content}
              {attachments}
              <ReceivedMarker
                timestamp={this.props.timestamp}
                received={this.props.received} />
            </div>
            <span className="menuTrigger">
              <a href="javascript:;" onClick={this.handleContextClick}>
                <i className="material-icons">expand_more</i>
              </a>
            </span>
          </div>
          {fullDisplay ? <div className="author">{this.props.userName}</div> : null}
        </div>
      </li>
    );
  }
};

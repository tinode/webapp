// Single message, sent or received.
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Drafty } from 'tinode-sdk'

import Attachment from './attachment.jsx';
import LetterTile from './letter-tile.jsx';
import ReceivedMarker from './received-marker.jsx'
import { sanitizeImageUrl, sanitizeUrl } from '../lib/utils.js';

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
    this.handleFormButtonClick = this.handleFormButtonClick.bind(this);
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

  handleFormButtonClick(e) {
    e.preventDefault();
    const data = {
      seq: this.props.seq
    };
    data.resp = {};
    if (e.target.dataset.name) {
      data.resp[e.target.dataset.name] = e.target.dataset.val ? e.target.dataset.val :
        e.target.dataset.val === undefined ? 1 : '' + e.target.dataset.val;
    }
    if (e.target.dataset.act == 'url') {
      data.ref = sanitizeUrl(e.target.dataset.ref) || 'about:blank';
    }
    const text = e.target.dataset.title || 'unknown';
    this.props.onFormResponse(e.target.dataset.act, text, data);
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
    const sideClass = this.props.sequence + ' ' + (this.props.response ? 'left' : 'right');
    const bubbleClass = (this.props.sequence == 'single' || this.props.sequence == 'last') ?
      'bubble tip' : 'bubble';
    const avatar = this.props.userAvatar || true;
    const fullDisplay = (this.props.userFrom && this.props.response &&
      (this.props.sequence == 'single' || this.props.sequence == 'last'));

    let content = this.props.content;
    const attachments = [];
    if (this.props.mimeType == Drafty.getContentType()) {
      Drafty.attachments(content, function(att, i) {
        if (att.mime == 'application/json') {
          // Don't show json objects as attachments.
          // They are not meant for users.
          return;
        }
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
      content = React.createElement('span', null, Drafty.format(content, draftyFormatter, this));
    } else if (typeof content != 'string') {
      content = <><i className="material-icons">error_outline</i> <i>
        <FormattedMessage id="invalid_content"
          defaultMessage="invalid content" description="Shown when message is unreadable" />
      </i></>
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
              <a href="#" onClick={this.handleContextClick}>
                <i className="material-icons">expand_more</i>
              </a>
            </span>
          </div>
          {fullDisplay ?
            <div className="author">
              <FormattedMessage id="user_not_found" defaultMessage="Not found"
                description="In place of a user's full name when the user is not found.">{
                    (notFound) => {return this.props.userName || <i>{notFound}</i>}
              }</FormattedMessage>
            </div>
            : null
          }
        </div>
      </li>
    );
  }
};

// Convert Drafty object to a tree of React elements.
import { BROKEN_IMAGE_SIZE, REM_SIZE } from '../config.js';
import { fitImageSize } from '../lib/blob-helpers.js';

function draftyFormatter(style, data, values, key) {
  let el = Drafty.tagName(style);
  if (el) {
    let attr = Drafty.attrValue(style, data) || {};
    attr.key = key;
    switch (style) {
      case 'IM':
        // Additional processing for images
        if (data) {
          attr.className = 'inline-image';
          let dim = fitImageSize(data.width, data.height,
            Math.min(this.props.viewportWidth - REM_SIZE * 4, REM_SIZE * 36), REM_SIZE * 24, false);
          dim = dim || {dstWidth: BROKEN_IMAGE_SIZE, dstHeight: BROKEN_IMAGE_SIZE};
          attr.style = { width: dim.dstWidth + 'px', height: dim.dstHeight + 'px' };
          attr.src = sanitizeImageUrl(attr.src);
          if (attr.src) {
            attr.onClick = this.handlePreviewImage;
            attr.className += ' image-clickable';
          } else {
            attr.src = 'img/broken_image.png';
          }
        }
        break;
      case 'BN':
        // Button
        attr.onClick = this.handleFormButtonClick;
        let inner = React.Children.map(values, (child) => {
          return typeof child == 'string' ? child : undefined;
        });
        if (!inner || inner.length == 0) {
          inner = [attr.name]
        }
        // Get text which will be sent back when the button is clicked.
        attr['data-title'] = inner.join('');
        break;
      case 'FM':
        // Form
        attr.className = 'bot-form';
        break;
      case 'FE':
        // Form element formatting is dependent on element content.
        break;
    }
    return React.createElement(el, attr, values);
  } else {
    return values;
  }
};

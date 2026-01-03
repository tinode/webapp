// Single chat message bubble, sent or received.

import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Drafty, Tinode } from 'tinode-sdk';

import Attachment from './attachment.jsx';
import LetterTile from './letter-tile.jsx';
import ReceivedMarker from './received-marker.jsx'

import { fullFormatter } from '../lib/formatters.js';
import { sanitizeUrl } from '../lib/utils.js';
import { shortenCount } from '../lib/strformat.js';
import ReactionPicker from './reaction-picker.jsx';

class BaseChatMessage extends React.PureComponent {
  constructor(props) {
    super(props);

    const emojis = props.tinode.getServerParam(Tinode.REACTION_LIST);
    if (Array.isArray(emojis) && emojis.length > 0) {
      this.emojis = emojis;
    }

    this.state = {
      progress: 0,
      showPicker: false
    };

    if (props.uploader) {
      props.uploader.onProgress = this.handleProgress.bind(this);
    }

    this.handleExpandImage = this.handleExpandImage.bind(this);
    this.handlePlayVideo = this.handlePlayVideo.bind(this);
    this.handleFormButtonClick = this.handleFormButtonClick.bind(this);
    this.handleContextClick = this.handleContextClick.bind(this);
    this.handleCancelUpload = this.handleCancelUpload.bind(this);
    this.handleQuoteClick = this.handleQuoteClick.bind(this);
    this.handleShowPicker = this.handleShowPicker.bind(this);
    this.handleReactionSelected = this.handleReactionSelected.bind(this);

    this.formatterContext = {
      formatMessage: props.intl.formatMessage.bind(props.intl),
      viewportWidth: props.viewportWidth,
      authorizeURL: props.tinode.authorizeURL.bind(props.tinode),

      onImagePreview: this.handleExpandImage,
      onVideoPreview: this.handlePlayVideo,
      onFormButtonClick: this.handleFormButtonClick,
      onQuoteClick: this.handleQuoteClick
    };
  }

  handleExpandImage(e) {
    e.preventDefault();
    this.props.onExpandMedia({
      url: e.target.src,
      filename: e.target.dataset.name,
      width: e.target.dataset.width,
      height: e.target.dataset.height,
      size: e.target.dataset.size,
      type: e.target.dataset.mime
    });
  }

  handlePlayVideo(e) {
    e.preventDefault();
    this.props.onExpandMedia({
      video: true,
      url: e.target.dataset.src,
      preview: e.target.src,
      filename: e.target.dataset.name,
      width: e.target.dataset.width,
      height: e.target.dataset.height,
      duration: e.target.dataset.duration,
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
    const menuItems = [];
    if (this.props.received == Tinode.MESSAGE_STATUS_FAILED) {
      menuItems.push('menu_item_send_retry');
    }
    if (this.props.received > Tinode.MESSAGE_STATUS_FATAL) {
      if (this.props.userIsWriter) {
        menuItems.push('menu_item_reply');
        if (!this.props.response) {
          let immutable = false;
          Drafty.entities(this.props.content, (_0, _1, tp) => {
            immutable = ['AU', 'EX', 'FM', 'IM', 'VC', 'VD'].includes(tp);
            return immutable;
          });
          if (!immutable) {
            Drafty.styles(this.props.content, tp => {
              immutable = ['QQ'].includes(tp);
              return immutable;
            });
          }
          if (!immutable) {
            menuItems.push('menu_item_edit');
          }
        }
      }
      if (this.props.userIsAdmin) {
        menuItems.push(this.props.pinned ? 'menu_item_unpin' : 'menu_item_pin');
      }
    }
    menuItems.push('menu_item_forward');

    this.props.showContextMenu({
      seq: this.props.seq,
      replace: this.props.edited ? parseInt(this.props.edited.split(':')[1]) : 0,
      content: this.props.content,
      userFrom: this.props.userFrom,
      userName: this.props.userName,
      y: e.pageY,
      x: e.pageX,
      pickReply: this.props.pickReply,
      editMessage: this.props.editMessage,
      timestamp: this.props.timestamp,
    }, menuItems);
  }

  handleProgress(ratio) {
    this.setState({progress: ratio});
  }

  handleCancelUpload() {
    this.props.onCancelUpload(this.props.seq, this.props.uploader);
  }

  handleQuoteClick(e) {
    e.preventDefault();
    e.stopPropagation();
    const replyToSeq = this.props.replyToSeq;
    if (replyToSeq) {
      this.props.onQuoteClick(replyToSeq);
    }
  }

  handleShowPicker(e) {
    e.preventDefault();
    e.stopPropagation();

    // Capture app bounds so the picker can position itself.
    // Center of the button is used as the click coordinates.
    const parentRect = this.props.parentRef.getBoundingClientRect();
    const buttonRect = e.target.getBoundingClientRect();
    this.setState({
      showPicker: true,
      pickerAnchor: {
        viewX: buttonRect.left + buttonRect.width / 2,
        viewY: buttonRect.top + buttonRect.height / 2,
        offsetX: e.target.offsetLeft
      },
      parentBounds: {
        left: parentRect.left,
        top: parentRect.top,
        right: parentRect.right,
        bottom: parentRect.bottom,
      }
    });
  }

  handleReactionSelected(e, emo) {
    this.props.onReact(this.props.seq, emo);
    this.setState({showPicker: false});
  }

  render() {
    const sideClass = this.props.sequence + ' ' + (this.props.response ? 'left' : 'right');
    const bubbleClass = (this.props.sequence == 'single' || this.props.sequence == 'last') ? 'bubble tip' : 'bubble';
    const avatar = this.props.userAvatar || true;
    let textSizeClass = 'message-content';
    const fullDisplay = (this.props.isGroup && this.props.response &&
      (this.props.sequence == 'single' || this.props.sequence == 'last'));

    let content = this.props.content;
    const attachments = [];
    if (this.props.mimeType == Drafty.getContentType() && Drafty.isValid(content)) {
      Drafty.attachments(content, (att, i) => {
        if (Drafty.isFormResponseType(att.mime)) {
          // Don't show json drafty form response objects as attachments.
          // They are not meant for users.
          return;
        }
        attachments.push(<Attachment
          tinode={this.props.tinode}
          downloadUrl={Drafty.getDownloadUrl(att)}
          filename={att.name}
          uploading={Drafty.isProcessing(att)}
          mimetype={att.mime}
          size={Drafty.getEntitySize(att)}
          progress={this.state.progress}
          onCancelUpload={this.handleCancelUpload}
          onError={this.props.onError}
          key={i} />);
      }, this);
      const tree = Drafty.format(content, fullFormatter, this.formatterContext);
      content = React.createElement(React.Fragment, null, tree);
    } else if (typeof content == 'string') {
      // Make font bigger for emoji-only messages.
      // Must use 'new RegExp(...)' because React does not like /{1-5}/.
      if (new RegExp('^\\p{RGI_Emoji}{1,5}$', 'v').test(content || '')) {
        // Content consists of 1-5 emoji characters. Count how many and use it to increase the font size.
        textSizeClass += ' emoji-' + (content || '').match(/\p{RGI_Emoji}/vg).length;
      }
    } else {
      content = <><i className="material-icons gray">warning_amber</i> <i className="gray">
        <FormattedMessage id="invalid_content"
          defaultMessage="invalid content" description="Shown when the message is unreadable" /></i></>
    }

    return (
      <li ref={this.props.innerRef} className={sideClass}>
        {this.props.isGroup && this.props.response ?
          <div className="avatar-box">
            {fullDisplay ?
              <LetterTile
                tinode={this.props.tinode}
                topic={this.props.userFrom}
                title={this.props.userName}
                avatar={avatar} /> :
              null}
          </div> :
          null}
        <div>
          <div className={bubbleClass}>
            <div className="content-meta">
              <div className={textSizeClass}>
                {content}
                {attachments}
              </div>
              {this.props.timestamp ?
                <ReceivedMarker
                  edited={this.props.edited}
                  timestamp={this.props.timestamp}
                  received={this.props.received} />
                : null}
            </div>
            {this.props.showContextMenu ?
              <span className="menuTrigger">
                <a href="#" onClick={this.handleContextClick}>
                  <i className="material-icons">expand_more</i>
                </a>
              </span> : null
            }
          </div>
          {this.emojis && <div className="reactions">
            {this.props.reactions.map(r => {
              const you = r.users && this.props.myUserId && r.users.includes(this.props.myUserId);
              return (
                <div key={r.value}
                  data-testid={`reaction-${r.val}`}
                  className={'reaction' + (you ? ' active' : '')}
                  onClick={(e) => this.handleReactionSelected(e, r.val)}>
                  <span className="emoji">{r.val}</span>
                  {r.count > 1 && <span className="count">{shortenCount(r.count)}</span>}
                </div>
              );
            })}
            <div className="reaction-add"
              data-testid="reaction-add"
              onClick={this.handleShowPicker}>
                <i className="material-icons">thumb_up_off_alt</i>
            </div>
          </div>}
          {this.state.showPicker ?
            <ReactionPicker
              emojis={this.emojis}
              onSelect={(emo) => this.handleReactionSelected(null, emo)}
              onClose={() => this.setState({showPicker: false})}
              dataTestPrefix="reaction-picker"
              anchor={this.state.pickerAnchor}
              viewportBounds={this.state.parentBounds} />
            : null}
          {fullDisplay ?
            <div className="author">
              {this.props.userName ||
                <i><FormattedMessage id="user_not_found" defaultMessage="Not found"
                  description="In place of a user's full name when the user is not found." /></i>
              }
            </div>
            : null
          }
        </div>
      </li>
    );
  }
};

const IntlChatMessage = injectIntl(BaseChatMessage);
const ChatMessage = React.forwardRef((props, ref) => <IntlChatMessage innerRef = {ref} {...props} />);

export default ChatMessage;

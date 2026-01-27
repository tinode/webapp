// Single chat message bubble, sent or received.

import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Drafty, Tinode, TheCard } from 'tinode-sdk';

import Attachment from './attachment.jsx';
import LetterTile from './letter-tile.jsx';
import ReactionStrip from './reaction-strip.jsx';
import ReceivedMarker from './received-marker.jsx'

import { fullFormatter } from '../lib/formatters.js';
import { sanitizeUrl } from '../lib/utils.js';
import ReactionPicker from './reaction-picker.jsx';
import HashNavigation from '../lib/navigation.js';

/*
const testReactions = [
  {val: '👍', count: 2, users: ['user1', 'user2']},
  {val: '❤️', count: 1, users: ['user3']},
  {val: '😂', count: 5, users: ['user4', 'user5', 'user6', 'user7', 'user8']},
  {val: '🔥', count: 3, users: ['user9', 'user10', 'user11']},
  {val: "🙏", count: 1, users: ['user1']},
  {val: "✨", count: 2, users: ['user1', 'user2']},
  {val: "😁", count: 1, users: ['user1']},
  {val: "😍", count: 1, users: ['user1']},
  {val: "😊", count: 4, users: ['user1', 'user2', 'user3', 'user4']},
  {val: "🥰", count: 1, users: ['user1']},
  {val: "😭", count: 2, users: ['user1', 'user2']},
  {val: "🙄", count: 1, users: ['user1']}
];
*/

class BaseChatMessage extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      progress: 0
    };

    if (props.uploader) {
      props.uploader.onProgress = this.handleProgress.bind(this);
    }

    this.handleExpandImage = this.handleExpandImage.bind(this);
    this.handlePlayVideo = this.handlePlayVideo.bind(this);
    this.handleFormButtonClick = this.handleFormButtonClick.bind(this);
    this.handleQuoteClick = this.handleQuoteClick.bind(this);
    this.handleContextClick = this.handleContextClick.bind(this);
    this.handleCancelUpload = this.handleCancelUpload.bind(this);
    this.handleQuoteClick = this.handleQuoteClick.bind(this);
    this.handleTogglePicker = this.handleTogglePicker.bind(this);
    this.handleReactionSelected = this.handleReactionSelected.bind(this);
    this.handleDraftyClick = this.handleDraftyClick.bind(this);

    this.formatterContext = {
      formatMessage: props.intl.formatMessage.bind(props.intl),
      viewportWidth: props.viewportWidth,
      authorizeURL: props.tinode.authorizeURL.bind(props.tinode),

      onHandleClick: this.handleDraftyClick
    };
  }

  handleDraftyClick = (e, action) => {
    switch (action) {
      case 'image':
        this.handleExpandImage(e);
        break;
      case 'video':
        this.handlePlayVideo(e);
        break;
      case 'form_button':
        this.handleFormButtonClick(e);
        break;
      case 'quote':
        this.handleQuoteClick(e);
        break;
      case 'contact_chat':
        e.preventDefault();
        try {
          // tinode:topic/usr123abc -> usr123abc
          const pathname = new URL(e.target.dataset.val)?.pathname;
          const parts = pathname.split('/').filter(Boolean);
          HashNavigation.navigateTo(HashNavigation.setUrlTopic('', parts.pop() || ''));
        } catch (error) {
          console.error("Invalid URL:", error);
        }
        break;
      case 'contact_find':
        e.preventDefault();
        let hashUrl = HashNavigation.setUrlSidePanel(window.location.hash, 'newtpk');
        hashUrl = HashNavigation.addUrlParam(hashUrl, 'q', e.target.dataset.val);
        hashUrl = HashNavigation.addUrlParam(hashUrl, 'tab', 'find');
        HashNavigation.navigateTo(hashUrl);
        break;
      default:
        // No special handling; let the browser deal with it.
        console.info('Unhandled drafty action.', action, e.target.dataset);
        break;
    }
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
            immutable = ['AU', 'EX', 'FM', 'IM', 'TC', 'VC', 'VD'].includes(tp);
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

  handleTogglePicker(e) {
    e.preventDefault();

    if (this.props.showPicker) {
      this.props.onToggleReactionPicker(-1);
      return;
    }

    // Capture app bounds so the picker can position itself.
    // Center of the button is used as the click coordinates.
    const parentRect = this.props.parentRef.getBoundingClientRect();
    const buttonRect = e.target.getBoundingClientRect();
    this.setState({
      pickerAnchor: {
        viewX: buttonRect.left + buttonRect.width / 2 - parentRect.left,
        viewY: buttonRect.top + buttonRect.height / 2 - parentRect.top,
        offsetX: e.target.offsetLeft,
        offsetY: e.target.offsetTop
      },
      parentBounds: {
        width: parentRect.right - parentRect.left,
        height: parentRect.bottom - parentRect.top,
      }
    });

    this.props.onToggleReactionPicker(this.props.seq);
  }

  handleReactionSelected(e, emo) {
    this.props.onReact(this.props.seq, emo);
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
      content = <><i className="m-icon gray">warning_amber</i> <i className="gray">
        <FormattedMessage id="invalid_content"
          defaultMessage="invalid content" description="Shown when the message is unreadable" /></i></>
    }

    return (
      <li ref={this.props.innerRef} className={sideClass}>
        {this.props.isGroup && this.props.response ?
          <div className="avatar-box">
            {fullDisplay ?
              <LetterTile
                authorizeURL={this.props.tinode.authorizeURL}
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
              {this.props.reactionList ?
                <ReactionStrip
                  reactions={this.props.reactions}
                  reactionList={this.props.reactionList}
                  maxReactions={this.props.maxReactions}
                  myUserId={this.props.myUserId}
                  pickerShown={this.props.showPicker}
                  onTogglePicker={this.handleTogglePicker}
                  onReactionSelected={this.handleReactionSelected} />
                : <div style={{height: '0.25rem'}}></div>
              }
              {this.props.timestamp ?
                <ReceivedMarker
                  edited={this.props.edited}
                  timestamp={this.props.timestamp}
                  received={this.props.received}
                  style={{ marginBottom: this.props.reactionList ? 'unset' : '0.25rem' }} />
                : null}
            </div>
            {this.props.showContextMenu ?
              <span className="menuTrigger">
                <a href="#" onClick={this.handleContextClick}>
                  <i className="m-icon">expand_more</i>
                </a>
              </span> : null
            }
          </div>
          {this.props.showPicker ?
            <ReactionPicker
              reactions={this.props.reactions}
              reactionList={this.props.reactionList}
              maxReactions={this.props.maxReactions}
              myUserId={this.props.myUserId}
              leftBubble={this.props.response}
              anchor={this.state.pickerAnchor}
              viewportBounds={this.state.parentBounds}
              onSelect={(emo) => this.handleReactionSelected(null, emo)}
              onClose={() => this.props.onToggleReactionPicker(-1)}
              dataTestPrefix="reaction-picker" />
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

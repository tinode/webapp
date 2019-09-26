import React from 'react';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';

import Tinode from 'tinode-sdk';
const Drafty = Tinode.Drafty;

import ChatMessage from '../widgets/chat-message.jsx';
import ErrorPanel from '../widgets/error-panel.jsx';
import GroupSubs from '../widgets/group-subs.jsx';
import ImagePreview from '../widgets/image-preview.jsx';
import Invitation from '../widgets/Invitation.jsx';
import LetterTile from '../widgets/letter-tile.jsx';
import LoadSpinner from '../widgets/load-spinner.jsx';
import LogoView from './logo-view.jsx';
import SendMessage from '../widgets/send-message.jsx';

import { DEFAULT_P2P_ACCESS_MODE, KEYPRESS_DELAY, MESSAGES_PAGE } from '../config.js';
import { makeImageUrl } from '../lib/blob-helpers.js';
import { shortDateFormat } from '../lib/strformat.js';

const messages = defineMessages({
  online_now: {
    id: 'online_now',
    defaultMessage: 'online now',
    description: 'Indicator that the user or topic is currently online',
  },
  last_seen: {
    id: 'last_seen_timestamp',
    defaultMessage: 'Last seen',
    description: 'Label for the timestamp of when the user or topic was last online'
  },
  'not_found': {
    id: 'title_not_found',
    defaultMessage: 'Not found',
    description: 'Title shown when topic is not found'
  }
});

// Checks if the access permissions are granted but not yet accepted.
function isUnconfirmed(acs) {
  if (acs) {
    const ex = acs.getExcessive() || '';
    return acs.isJoiner('given') && (ex.includes('R') || ex.includes('W'));
  }
  return false;
}

function isPeerRestricted(acs) {
  if (acs) {
    const ms = acs.getMissing() || '';
    return acs.isJoiner('want') && (ms.includes('R') || ms.includes('W'));
  }
  return false;
}

class MessagesView extends React.Component {
  constructor(props) {
    super(props);

    this.state = MessagesView.getDerivedStateFromProps(props, {});

    // this.propsChange = this.propsChange.bind(this);
    this.leave = this.leave.bind(this);
    this.handleScrollReference = this.handleScrollReference.bind(this);
    this.handleScrollEvent = this.handleScrollEvent.bind(this);
    this.handleDescChange = this.handleDescChange.bind(this);
    this.handleSubsUpdated = this.handleSubsUpdated.bind(this);
    this.handleNewMessage = this.handleNewMessage.bind(this);
    this.handleAllMessagesReceived = this.handleAllMessagesReceived.bind(this);
    this.handleInfoReceipt = this.handleInfoReceipt.bind(this);
    this.handleImagePreview = this.handleImagePreview.bind(this);
    this.handleCloseImagePreview = this.handleCloseImagePreview.bind(this);
    this.handleFormResponse = this.handleFormResponse.bind(this);
    this.handleContextClick = this.handleContextClick.bind(this);
    this.handleShowContextMenuMessage = this.handleShowContextMenuMessage.bind(this);
    this.handleNewChatAcceptance = this.handleNewChatAcceptance.bind(this);
    this.handleEnablePeer = this.handleEnablePeer.bind(this);
  }

  componentDidMount() {
    // this.propsChange(this.props, this.state);
    if (this.messagesScroller) {
      this.messagesScroller.addEventListener('scroll', this.handleScrollEvent);
    }
  }

  componentWillUnmount() {
    if (this.messagesScroller) {
      this.messagesScroller.removeEventListener('scroll', this.handleScrollEvent);
    }
  }

  // Scroll last message into view on component update e.g. on message received
  // or vertical shrinking.
  componentDidUpdate(prevProps, prevState) {
    if (this.messagesScroller) {
      if (prevState.topic != this.state.topic || prevState.messages.length != this.state.messages.length) {
        this.messagesScroller.scrollTop = this.messagesScroller.scrollHeight - this.state.scrollPosition;
      } else if (prevProps.viewportHeight > this.props.viewportHeight) {
        this.messagesScroller.scrollTop += prevProps.viewportHeight - this.props.viewportHeight;
      }
    }

    const topic = this.props.tinode.getTopic(this.state.topic);
    if (this.state.topic != prevState.topic) {
      if (prevState.topic && !Tinode.isNewGroupTopicName(prevState.topic)) {
        this.leave(prevState.topic);
        this.props.readTimerHandler(null);
      }

      if (topic) {
        topic.onData = this.handleNewMessage;
        topic.onAllMessagesReceived = this.handleAllMessagesReceived;
        topic.onInfo = this.handleInfoReceipt;
        topic.onMetaDesc = this.handleDescChange;
        topic.onSubsUpdated = this.handleSubsUpdated;
        topic.onPres = this.handleSubsUpdated;
      }
    }

    if (topic && !topic.isSubscribed() && this.props.ready &&
        ((this.state.topic != prevState.topic) || !prevProps.ready)) {
      // Is this a new topic?
      const newTopic = (this.props.newTopicParams && this.props.newTopicParams._topicName == this.props.topic);

      // Don't request the tags. They are useless unless the user
      // is the owner and is editing the topic.
      let getQuery = topic.startMetaQuery().withLaterDesc().withLaterSub();
      if (this.state.isReader || newTopic) {
        // If reading is either permitted or we don't know because it's a new topic. Ask for messages.
        getQuery = getQuery.withLaterData(MESSAGES_PAGE);
        if (this.state.isReader) {
          getQuery = getQuery.withLaterDel();
        }
        // And show "loading" spinner.
        this.setState({ fetchingMessages: true });
      }
      const setQuery = newTopic ? this.props.newTopicParams : undefined;
      topic.subscribe(getQuery.build(), setQuery)
        .then((ctrl) => {
          if (this.state.topic != ctrl.topic) {
            this.setState({topic: ctrl.topic});
          }
          this.props.onNewTopicCreated(this.props.topic, ctrl.topic);
          // If there are unsent messages, try sending them now.
          topic.queuedMessages((pub) => {
            if (!pub._sending && topic.isSubscribed()) {
              topic.publishMessage(pub);
            }
          });
        })
        .catch((err) => {
          console.log("Failed subscription to", this.state.topic);
          this.props.onError(err.message, 'err');
          const blankState = MessagesView.getDerivedStateFromProps({}, {});
          blankState.title = this.props.intl.formatMessage(messages.not_found);
          this.setState(blankState);
        });
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let nextState = {};
    if (!nextProps.topic) {
      // Default state: no topic.
      nextState = {
        messages: [],
        onlineSubs: [],
        topic: null,
        title: '',
        avatar: null,
        imagePreview: null,
        typingIndicator: false,
        scrollPosition: 0,
        fetchingMessages: false,
        peerMessagingDisabled: false
      };
    } else if (nextProps.topic != prevState.topic) {
      const topic = nextProps.tinode.getTopic(nextProps.topic);
      nextState = {
        topic: nextProps.topic,
        imagePreview: null,
        typingIndicator: false,
        scrollPosition: 0,
        fetchingMessages: false
      };

      if (topic) {
        // Topic exists.
        const msgs = [];
        const subs = [];

        if (nextProps.connected) {
          topic.subscribers((sub) => {
            if (sub.online && sub.user != nextProps.myUserId) {
              subs.push(sub);
            }
          });
        }

        topic.messages(function(msg) {
          if (!msg.deleted) {
            msgs.push(msg);
          }
        });

        Object.assign(nextState, {
          messages: msgs,
          onlineSubs: subs
        });

        if (topic.public) {
          Object.assign(nextState, {
            title: topic.public.fn,
            avatar: makeImageUrl(topic.public.photo)
          });
        } else {
          Object.assign(nextState, {
            title: '',
            avatar: null
          });
        }

        const peer = topic.p2pPeerDesc();
        if (peer) {
          Object.assign(nextState, {
            peerMessagingDisabled: isPeerRestricted(peer.acs)
          });
        } else if (prevState.peerMessagingDisabled) {
          Object.assign(nextState, {
            peerMessagingDisabled: false
          });
        }
      } else {
        // Invalid topic.
        Object.assign(nextState, {
          messages: [],
          onlineSubs: [],
          title: '',
          avatar: null,
          peerMessagingDisabled: false
        });
      }
    }

    if (nextProps.acs) {
      if (nextProps.acs.isWriter() != prevState.isWriter) {
        nextState.isWriter = !prevState.isWriter;
      }
      if (nextProps.acs.isReader() != prevState.isReader) {
        nextState.isReader = !prevState.isReader;
      }
      if (!nextProps.acs.isReader('given') != prevState.readingBlocked) {
        nextState.readingBlocked = !prevState.readingBlocked;
      }
    } else {
      if (prevState.isWriter) {
        nextState.isWriter = false;
      }
      if (prevState.isReader) {
        nextState.isReader = false;
      }
      if (!prevState.readingBlocked) {
        prevState.readingBlocked = true;
      }
    }

    if (isUnconfirmed(nextProps.acs) == !prevState.unconformed) {
      nextState.unconfirmed = !prevState.unconformed;
    }

    // Clear subscribers online when there is no connection.
    if (!nextProps.connected && prevState.onlineSubs && prevState.onlineSubs.length > 0) {
      nextState.onlineSubs = [];
    }

    return nextState;
  }

  leave(oldTopicName) {
    if (!oldTopicName) {
      return;
    }
    let oldTopic = this.props.tinode.getTopic(oldTopicName);
    if (oldTopic && oldTopic.isSubscribed()) {
      oldTopic.leave(false)
        .catch(() => { /* do nothing here */ })
        .finally(() => {
          // We don't care if the request succeeded or failed.
          // The topic is dead regardless.
          this.setState({fetchingMessages: false});
          oldTopic.onData = undefined;
          oldTopic.onAllMessagesReceived = undefined;
          oldTopic.onInfo = undefined;
          oldTopic.onMetaDesc = undefined;
          oldTopic.onSubsUpdated = undefined;
          oldTopic.onPres = undefined;
        });
    }
  }

  handleScrollReference(node) {
    if (node) {
      node.addEventListener('scroll', this.handleScrollEvent);
      this.messagesScroller = node;
    }
  }

  // Get older messages
  handleScrollEvent(event) {
    this.setState({scrollPosition: event.target.scrollHeight - event.target.scrollTop});
    if (event.target.scrollTop <= 0) {
      this.setState((prevState, props) => {
        const newState = {};
        if (!prevState.fetchingMessages) {
          const topic = this.props.tinode.getTopic(this.state.topic);
          if (topic && topic.isSubscribed() && topic.msgHasMoreMessages()) {
            newState.fetchingMessages = true;
            topic.getMessagesPage(MESSAGES_PAGE).catch((err) => {
              this.setState({fetchingMessages: false});
              this.props.onError(err.message, 'err');
            });
          }
        }
        return newState;
      });
    }
  }

  handleDescChange(desc) {
    if (desc.public) {
      this.setState({
        title: desc.public.fn,
        avatar: makeImageUrl(desc.public.photo)
      });
    } else {
      this.setState({
        title: '',
        avatar: null
      });
    }

    if (desc.acs) {
      this.setState({
        isWriter: desc.acs.isWriter(),
        isReader: desc.acs.isReader(),
        readingBlocked: !desc.acs.isReader('given'),
        unconfirmed: isUnconfirmed(desc.acs),
      });
    }
  }

  handleSubsUpdated() {
    if (this.state.topic) {
      const subs = [];
      const topic = this.props.tinode.getTopic(this.state.topic);
      topic.subscribers((sub) => {
        if (sub.online && sub.user != this.props.myUserId) {
          subs.push(sub);
        }
      });
      const newState = {onlineSubs: subs};
      const peer = topic.p2pPeerDesc();
      if (peer) {
        Object.assign(newState, {
          peerMessagingDisabled: isPeerRestricted(peer.acs)
        });
      } else if (this.state.peerMessagingDisabled) {
        Object.assign(newState, {
          peerMessagingDisabled: false
        });
      }
      this.setState(newState);
    }
  }

  handleNewMessage(msg) {
    // Regenerate messages list
    const topic = this.props.tinode.getTopic(this.state.topic);
    const newState = {messages: []};
    topic.messages((m) => {
      if (!m.deleted) {
        newState.messages.push(m);
      }
    });

    // msg could be null if one or more messages were deleted.
    if (msg && !msg.deleted) {
      // If the message is added to the end of the message list,
      // scroll to the bottom.
      if (topic.isNewMessage(msg.seq)) {
        newState.scrollPosition = 0;
      }

      // Aknowledge messages except own messages. They are
      // automatically assumed to be read and recived.
      const status = topic.msgStatus(msg);
      if (status >= Tinode.MESSAGE_STATUS_SENT && msg.from != this.props.myUserId) {
        this.props.readTimerHandler(() => {
          topic.noteRead(msg.seq);
        });
      }
      this.props.onData(msg);
    }
    this.setState(newState);
  }

  handleAllMessagesReceived(count) {
    this.setState({fetchingMessages: false});
  }

  handleInfoReceipt(info) {
    switch (info.what) {
      case 'kp': {
        clearTimeout(this.keyPressTimer);
        var instance = this;
        this.keyPressTimer = setTimeout(function() {
          instance.setState({typingIndicator: false});
        }, KEYPRESS_DELAY + 1000);
        if (!this.state.typingIndicator) {
          this.setState({typingIndicator: true});
        }
        break;
      }
      case 'read':
      case 'recv':
        // Redraw due to changed recv/read status.
        this.forceUpdate();
        break;
      default:
        console.log("Other change in topic: ", info.what);
    }
  }

  handleImagePreview(content) {
    this.setState({ imagePreview: content });
  }

  handleCloseImagePreview() {
    this.setState({ imagePreview: null });
  }

  handleFormResponse(action, text, data) {
    if (action == 'pub') {
      this.props.sendMessage(Drafty.attachJSON(Drafty.parse(text), data));
    } else if (action == 'url') {
      const url = new URL(data.ref);
      const params = url.searchParams;
      for (let key in data.resp) {
        if (data.resp.hasOwnProperty(key)) {
          params.set(key, data.resp[key]);
        }
      }
      ['name', 'seq'].map(function(key) {
        if (data[key]) {
          params.set(key, data[key]);
        }
      });
      params.set('uid', this.props.myUserId);
      url.search = params;
      window.open(url, '_blank');
    } else {
      console.log("Unknown action in form", action);
    }
  }

  handleContextClick(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.showContextMenu({ topicName: this.state.topic, y: e.pageY, x: e.pageX });
  }

  handleShowContextMenuMessage(params) {
    params.topicName = this.state.topic;
    const menuItems = ['message_delete'];
    const topic = this.props.tinode.getTopic(params.topicName);
    if (topic) {
      const acs = topic.getAccessMode();
      if (acs && acs.isDeleter()) {
        menuItems.push('message_delete_hard');
      }
    }
    this.props.showContextMenu(params, menuItems);
  }

  handleNewChatAcceptance(action) {
    this.props.onNewChat(this.state.topic, action);
  }

  handleEnablePeer(e) {
    e.preventDefault();
    this.props.onChangePermissions(this.state.topic, DEFAULT_P2P_ACCESS_MODE, this.state.topic);
  }

  render() {
    const {formatMessage} = this.props.intl;

    let component;
    if (this.state.topic) {
      const topic = this.props.tinode.getTopic(this.state.topic);
      const groupTopic = topic.getType() == 'grp';
      let messageNodes = [];
      let previousFrom = null;
      let chatBoxClass = null;
      for (let i=0; i<this.state.messages.length; i++) {
        let msg = this.state.messages[i];
        let nextFrom = null;

        if (i + 1 < this.state.messages.length) {
          nextFrom = this.state.messages[i+1].from
        }

        let sequence = 'single';
        if (msg.from == previousFrom) {
          if (msg.from == nextFrom) {
            sequence = 'middle';
          } else {
            sequence = 'last';
          }
        } else if (msg.from == nextFrom) {
          sequence = 'first';
        }
        previousFrom = msg.from;

        const isReply = !(msg.from == this.props.myUserId);
        const deliveryStatus = topic.msgStatus(msg);

        let userName, userAvatar, userFrom;
        if (groupTopic) {
          const user = topic.userDesc(msg.from);
          if (user && user.public) {
            userName = user.public.fn;
            userAvatar = makeImageUrl(user.public.photo);
          }
          userFrom = msg.from;
          chatBoxClass='chat-box group';
        } else {
          chatBoxClass='chat-box';
        }

        messageNodes.push(
          <ChatMessage
            tinode={this.props.tinode}
            content={msg.content}
            mimeType={msg.head ? msg.head.mime : null}
            timestamp={msg.ts} response={isReply} seq={msg.seq}
            userFrom={userFrom} userName={userName} userAvatar={userAvatar}
            sequence={sequence} received={deliveryStatus} uploader={msg._uploader}
            viewportWidth={this.props.viewportWidth}
            showContextMenu={this.handleShowContextMenuMessage}
            onImagePreview={this.handleImagePreview}
            onFormResponse={this.handleFormResponse}
            onError={this.props.onError}
            key={msg.seq} />
        );
      }

      let lastSeen = null;
      const cont = this.props.tinode.getMeTopic().getContact(this.state.topic);
      if (cont && Tinode.topicType(cont.topic) == 'p2p') {
        if (cont.online) {
          lastSeen = formatMessage(messages.online_now);
        } else if (cont.seen) {
          lastSeen = formatMessage(messages.last_seen) + ": " +
            shortDateFormat(cont.seen.when, this.props.intl.locale);
          // TODO: also handle user agent in c.seen.ua
        }
      }
      const avatar = this.state.avatar || true;
      const online = this.props.online ? 'online' + (this.state.typingIndicator ? ' typing' : '') : 'offline';

      component = (
        <div id="topic-view" className={this.props.hideSelf ? 'nodisplay' : null}>
          <div id="topic-caption-panel" className="caption-panel">
            {this.props.displayMobile ?
              <a href="#" id="hide-message-view" onClick={(e) => {e.preventDefault(); this.props.onHideMessagesView();}}>
                <i className="material-icons">arrow_back</i>
              </a>
              :
              null}
            <div className="avatar-box">
              <LetterTile
                avatar={avatar}
                topic={this.state.topic}
                title={this.state.title} />
              <span className={online} />
            </div>
            <div id="topic-title-group">
              <div id="topic-title" className="panel-title">{
                this.state.title ||
                <i><FormattedMessage id="unnamed_topic" defaultMessage="Unnamed"
                  description="Title shown when the topic has no name" /></i>
              }</div>
              <div id="topic-last-seen">{lastSeen}</div>
            </div>
            {groupTopic ?
              <GroupSubs
                subscribers={this.state.onlineSubs} /> :
              <div id="topic-users" />
            }
            <div>
              <a href="#" onClick={this.handleContextClick}>
                <i className="material-icons">more_vert</i>
              </a>
            </div>
          </div>
          {this.props.displayMobile ?
            <ErrorPanel
              level={this.props.errorLevel}
              text={this.props.errorText}
              onClearError={this.props.onError} />
            : null}
          <LoadSpinner show={this.state.fetchingMessages} />
          <div id="messages-container">
            <div id="messages-panel" ref={this.handleScrollReference}>
              <ul id="scroller" className={chatBoxClass}>
                {messageNodes}
              </ul>
            </div>
            {!this.state.isReader ?
            <div id="write-only-background">
              {this.state.readingBlocked ?
              <div id="write-only-note">
                <FormattedMessage id="messages_not_readable" defaultMessage="no access to messages"
                  description="Message shown in topic without the read access" />
              </div>
              : null }
            </div>
            : null }
          </div>
          {this.state.peerMessagingDisabled && !this.state.unconfirmed ?
            <div id="peer-messaging-disabled-note">
              <i className="material-icons secondary">block</i> <FormattedMessage
                id="peers_messaging_disabled" defaultMessage="Peer's messaging is disabled."
                description="Shown when the p2p peer's messaging is disabled" /> <a href="#"
                  onClick={this.handleEnablePeer}><FormattedMessage id="enable_peers_messaging"
                  defaultMessage="Enable" description="Call to action to enable peer's messaging" /></a>.
            </div> : null}
          {this.state.unconfirmed ?
            <Invitation onAction={this.handleNewChatAcceptance} />
            :
            <SendMessage
              tinode={this.props.tinode}
              topic={this.props.topic}
              disabled={!this.state.isWriter}
              sendMessage={this.props.sendMessage}
              onError={this.props.onError} />}
          {this.state.imagePreview ?
            <ImagePreview content={this.state.imagePreview}
              onClose={this.handleCloseImagePreview} /> : null}
        </div>
      );
    } else {
      component = (
        <LogoView hideSelf={this.props.hideSelf}
          serverVersion={this.props.serverVersion}
          serverAddress={this.props.serverAddress} />
      );
    }
    return component;
  }
};

export default injectIntl(MessagesView);

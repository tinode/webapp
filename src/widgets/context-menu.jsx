// Context Menu: popup/dropdown menu.
import React from 'react';
import ReactDom from 'react-dom';

import { REM_SIZE } from '../config.js';

export default class ContextMenu extends React.Component {
  constructor(props) {
    super(props);

    this.handlePageClick = this.handlePageClick.bind(this);
    this.handleEscapeKey = this.handleEscapeKey.bind(this);
    this.handleClick = this.handleClick.bind(this);

    // Preconfigured menu items.
    this.MenuItems = {
      'topic_info':     {title: "Info", handler: null},

      'messages_clear': {title: "Clear messages", handler: (params, errorHandler) => {
        this.deleteMessages(true, false, params, errorHandler);
      }},
      'messages_clear_hard': {title: "Clear for All", handler: (params, errorHandler) => {
        this.deleteMessages(true, true, params, errorHandler);
      }},
      'message_delete': {title: "Delete", handler: (params, errorHandler) => {
        this.deleteMessages(false, false, params, errorHandler);
      }},
      'message_delete_hard': {title: "Delete for All", handler: (params, errorHandler) => {
        this.deleteMessages(false, true, params, errorHandler);
      }},
      'topic_unmute':   {title: "Unmute", handler: this.topicPermissionSetter.bind(this, '+P')},
      'topic_mute':     {title: "Mute", handler: this.topicPermissionSetter.bind(this, '-P')},
      'topic_unblock':  {title: "Unblock", handler: this.topicPermissionSetter.bind(this, '+J')},
      'topic_block':    {title: "Block", handler: this.topicPermissionSetter.bind(this, '-J')},
      'topic_delete':   {title: "Delete", handler: (params, errorHandler) => {
        let topic = this.props.tinode.getTopic(params.topicName);
        if (!topic) {
          console.log("Topic not found: ", params.topicName);
          return;
        }
        topic.delTopic().catch((err) => {
          if (errorHandler) {
            errorHandler(err.message, 'err');
          }
        });
      }},

      'permissions':    {title: "Edit permissions", handler: null},
      'member_delete':  {title: "Remove", handler: (params, errorHandler) => {
        let topic = this.props.tinode.getTopic(params.topicName);
        if (!topic || !params.user) {
          console.log("Topic or user not found: '" + params.topicName + "', '" + params.user + "'");
          return;
        }
        topic.delSubscription(params.user).catch((err) => {
          if (errorHandler) {
            errorHandler(err.message, 'err');
          }
        });
      }},
      'member_mute':    {title: "Mute", handler: this.topicPermissionSetter.bind(this, '-P')},
      'member_unmute':  {title: "Unmute", handler: this.topicPermissionSetter.bind(this, '+P')},
      'member_block':   {title: "Block", handler: this.topicPermissionSetter.bind(this, '-J')},
      'member_unblock': {title: "Unblock", handler: this.topicPermissionSetter.bind(this, '+J')},
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handlePageClick, false);
    document.addEventListener('keyup', this.handleEscapeKey, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handlePageClick, false);
    document.removeEventListener('keyup', this.handleEscapeKey, false);
  }

  handlePageClick(e) {
    if (ReactDOM.findDOMNode(this).contains(e.target)) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    this.props.hide();
  }

  handleEscapeKey(e) {
    if (e.keyCode === 27) {
      this.props.hide();
    }
  }

  handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.hide();
    let item = this.props.items[e.currentTarget.dataset.id];
    if (typeof item == 'string') {
      item = this.MenuItems[item];
    }
    item.handler(this.props.params, this.props.onError);
  }

  // Menu Actions

  deleteMessages(all, hard, params, errorHandler) {
    var topic = this.props.tinode.getTopic(params.topicName);
    if (!topic) {
      console.log("Topic not found: ", params.topicName);
      return;
    }
    // We don't know if the message is still pending (e.g. attachment is being uploaded),
    // so try cancelling first. No harm if we can't cancel.
    if (topic.cancelSend(params.seq)) {
      return Promise.resolve();
    }
    // Can't cancel. Delete instead.
    var promise = all ?
      topic.delMessagesAll(hard) :
      topic.delMessagesList([params.seq], hard);
    promise.catch((err) => {
      if (errorHandler) {
        errorHandler(err.message, 'err');
      }
    });
  }

  // Function is used by context menu to set permissions.
  topicPermissionSetter(mode, params, errorHandler) {
    var topic = this.props.tinode.getTopic(params.topicName);
    if (!topic) {
      console.log("Topic not found", params.topicName);
      return;
    }

    var am, user;
    if (params.user) {
      user = topic.subscriber(params.user);
      if (!user) {
        console.log("Subscriber not found", params.topicName + "[" + params.user + "]");
        return;
      }
      am = user.acs.updateGiven(mode).getGiven();
    } else {
      am = topic.getAccessMode().updateWant(mode).getWant();
    }

    topic.setMeta({sub: {user: params.user, mode: am}}).catch((err) => {
      if (errorHandler) {
        errorHandler(err.message, 'err');
      }
    });
  }

  render() {
    let count = 0;
    let menu = [];
    this.props.items.map((item) => {
      if (typeof item == 'string') {
        item = this.MenuItems[item];
      }
      if (item && item.title) {
        menu.push(
          item.title == '-' ?
            <li className="separator" key={count} />
            :
            <li onClick={this.handleClick} data-id={count} key={count}>{item.title}</li>
        );
      }
      count++;
    });

    // Ensure that menu is inside the app-container.
    var hSize = 12 * REM_SIZE;
    var vSize = REM_SIZE * (0.7 + menu.length * 2.5);
    var left = (this.props.bounds.right - this.props.clickAt.x < hSize) ?
        (this.props.clickAt.x - this.props.bounds.left - hSize) :
        (this.props.clickAt.x - this.props.bounds.left);
    var top = (this.props.bounds.bottom - this.props.clickAt.y < vSize) ?
        (this.props.clickAt.y - this.props.bounds.top - vSize) :
        (this.props.clickAt.y - this.props.bounds.top);

    var position = {
      left: left + 'px',
      top: top + 'px'
    };

    return (
      <ul className="menu" style={position}>
        {menu}
      </ul>
    );
  }
}

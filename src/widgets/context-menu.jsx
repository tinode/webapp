// Context Menu: popup/dropdown menu.
import React from 'react';
import ReactDOM from 'react-dom';
import { injectIntl, defineMessages } from 'react-intl';

import { REM_SIZE } from '../config.js';
import HashNavigation from '../lib/navigation.js';

const messages = defineMessages({
  info: {
    id: 'menu_item_info',
    defaultMessage: 'Info',
    description: 'Show extended topic information'
  },
  clear_messages: {
    id: 'menu_item_clear_messages',
    defaultMessage: 'Clear messages',
    description: 'Delete all messages'
  },
  clear_for_all: {
    id: 'menu_item_clear_messages_for_all',
    defaultMessage: 'Clear for All',
    description: 'Delete all message(s) for all members'
  },
  delete: {
    id: 'menu_item_delete',
    defaultMessage: 'Delete',
    description: 'Delete selected messages'
  },
  delete_for_all: {
    id: 'menu_item_delete_for_all',
    defaultMessage: 'Delete for All',
    description: 'Delete selected message(s) for all members'
  },
  send_retry: {
    id: 'menu_item_send_retry',
    defaultMessage: 'Retry',
    description: 'Retry sending message'
  },
  mute: {
    id: 'menu_item_mute',
    defaultMessage: 'Mute',
    description: 'Turn off notifications'
  },
  unmute: {
    id: 'menu_item_unmute',
    defaultMessage: 'Unmute',
    description: 'Turn notifications on'
  },
  topic_delete: {
    id: 'menu_item_delete_topic',
    defaultMessage: 'Delete',
    description: 'Delete entire topic'
  },
  topic_delete_warning: {
    id: 'topic_delete_warning',
    defaultMessage: 'Are you sure you want to delete this conversation? It cannot be undone.',
    description: 'Alert warning when deleting entire topic'
  },
  delete_messages_warning: {
    id: 'delete_messages_warning',
    defaultMessage: 'Are you sure you want to delete all messages for everyone? It cannot be undone.',
    description: 'Alert dialog warning when hard-deleting all messages.'
  },
  unblock: {
    id: 'menu_item_unblock',
    defaultMessage: 'Unblock',
    description: 'Unblock topic or user'
  },
  // Generic string suitable for either topic or user.
  block: {
    id: 'menu_item_block',
    defaultMessage: 'Block',
    description: 'Block topic or user'
  },
  topic_block_warning: {
    id: 'topic_block_warning',
    defaultMessage: 'Are you sure you want to block this conversation?',
    description: 'Alert warning when blocking a topic.'
  },
  member_delete: {
    id: 'menu_item_member_delete',
    defaultMessage: 'Remove',
    description: 'Remove user from topic'
  },
  archive: {
    id: 'menu_item_archive_topic',
    defaultMessage: 'Archive',
    description: 'Move topic from the list of active chats to archive'
  },
  unarchive: {
    id: 'menu_item_restore_topic',
    defaultMessage: 'Restore',
    description: 'Restore topic from archive'
  },
  edit_permissions: {
    id: 'menu_item_edit_permissions',
    defaultMessage: 'Edit permissions',
    description: 'Menu item [Edit permissions]'
  },
  clear_messages_warning: {
    id: 'clear_messages_warning',
    defaultMessage: 'Are you sure you want to clear all messages? It cannot be undone.',
    description: 'Alert dialog warning when deleting all messages.'
  },
});

class ContextMenu extends React.Component {
  constructor(props) {
    super(props);

    const {formatMessage} = props.intl;

    this.handlePageClick = this.handlePageClick.bind(this);
    this.handleEscapeKey = this.handleEscapeKey.bind(this);
    this.handleClick = this.handleClick.bind(this);

    // Preconfigured menu items.
    this.MenuItems = {
      'topic_info': {
        id: 'topic_info',
        title: formatMessage(messages.info),
        handler: null
      },
      'messages_clear': {
        id: 'messages_clear',
        title: formatMessage(messages.clear_messages),
        handler: (params, errorHandler) => {
          return props.onShowAlert(
            formatMessage(messages.clear_messages), // title
            formatMessage(messages.clear_messages_warning), // content
            (() => { this.deleteMessages(true, false, params, errorHandler); }), // onConfirm
            null, // "OK"
            true, // Show Reject button
            null  // "Cancel"
          );
        }
      },
      'messages_clear_hard': {
        id: 'messages_clear_hard',
        title: formatMessage(messages.clear_for_all),
        handler: (params, errorHandler) => {
          return props.onShowAlert(
            formatMessage(messages.clear_for_all), // title
            formatMessage(message.delete_messages_warning), // content
            (() => { return this.deleteMessages(true, true, params, errorHandler); }),
            null, // "OK"
            true, // Show Reject button
            null  // "Cancel"
          );
        }
      },
      'message_delete': {
        id: 'message_delete',
        title: formatMessage(messages.delete),
        handler: (params, errorHandler) => {
          return this.deleteMessages(false, false, params, errorHandler);
        }
      },
      'message_delete_hard': {
        id: 'message_delete_hard',
        title: formatMessage(messages.delete_for_all),
        handler: (params, errorHandler) => {
          return this.deleteMessages(false, true, params, errorHandler);
        }
      },
      'menu_item_send_retry': {
        id: 'menu_item_send_retry',
        title: formatMessage(messages.send_retry),
        handler: (params, errorHandler) => {
          return this.retryMessage(params, errorHandler);
        }
      },
      'topic_unmute': {
        id: 'topic_unmute',
        title: formatMessage(messages.unmute),
        handler: this.topicPermissionSetter.bind(this, '+P')
      },
      'topic_mute': {
        id: 'topic_mute',
        title: formatMessage(messages.mute),
        handler: this.topicPermissionSetter.bind(this, '-P')
      },
      'topic_unblock': {
        id: 'topic_unblock',
        title: formatMessage(messages.unblock),
        handler: this.topicPermissionSetter.bind(this, '+JP')
      },
      'topic_block': {
        id: 'topic_block',
        title: formatMessage(messages.block),
        handler: (params, errorHandler) => {
          return props.onShowAlert(
            formatMessage(messages.block), // title
            formatMessage(messages.topic_block_warning), // content
            (() => {
              return this.topicPermissionSetter('-JP', params, errorHandler).then((ctrl) => {
                this.props.onTopicRemoved(params.topicName);
                return ctrl;
              });
            }),
            null, // "OK"
            true, // Show Reject button
            null  // "Cancel"
          );
        }
      },
      'topic_delete': {
        id: 'topic_delete',
        title: formatMessage(messages.topic_delete),
        handler: (params, errorHandler) => {
          return props.onShowAlert(
            formatMessage(messages.topic_delete), // title
            formatMessage(messages.topic_delete_warning), // content
            (() => {
              const topic = this.props.tinode.getTopic(params.topicName);
              if (!topic) {
                console.log("Topic not found: ", params.topicName);
                return;
              }
              return topic.delTopic(true).catch((err) => {
                if (errorHandler) {
                  errorHandler(err.message, 'err');
                }
              });
            }),
            null, // "OK"
            true, // Show Reject button
            null  // "Cancel"
          );
        }
      },
      'topic_archive': {
        id: 'topic_archive',
        title: formatMessage(messages.archive),
        handler: (params, errorHandler) => {
          const topic = this.props.tinode.getTopic(params.topicName);
          if (!topic) {
            console.log("Topic not found: ", params.topicName);
            return;
          }
          return topic.archive(true).catch((err) => {
            if (errorHandler) {
              errorHandler(err.message, 'err');
            }
          });
        }
      },
      'topic_restore': {
        id: 'topic_restore',
        title: formatMessage(messages.unarchive),
        handler: (params, errorHandler) => {
          const topic = this.props.tinode.getTopic(params.topicName);
          if (!topic) {
            console.log("Topic not found: ", params.topicName);
            return;
          }
          return topic.archive(false).catch((err) => {
            if (errorHandler) {
              errorHandler(err.message, 'err');
            }
          });
        }
      },
      // menu_item_edit_permissions is defined elsewhere.
      'permissions': {
        id: 'permissions',
        title: formatMessage(messages.edit_permissions),
        handler: null
      },
      'member_delete': {
        id: 'member_delete',
        title: formatMessage(messages.member_delete),
        handler: (params, errorHandler) => {
          const topic = this.props.tinode.getTopic(params.topicName);
          if (!topic || !params.user) {
            console.log("Topic or user not found: '" + params.topicName + "', '" + params.user + "'");
            return;
          }
          return topic.delSubscription(params.user).catch((err) => {
            if (errorHandler) {
              errorHandler(err.message, 'err');
            }
          });
        }
      },
      'member_mute': {
        id: 'member_mute',
        title: formatMessage(messages.mute),
        handler: this.topicPermissionSetter.bind(this, '-P')
      },
      'member_unmute': {
        id: 'member_unmute',
        title: formatMessage(messages.unmute),
        handler: this.topicPermissionSetter.bind(this, '+P')
      },
      'member_block': {
        id: 'member_block',
        title: formatMessage(messages.block),
        handler: this.topicPermissionSetter.bind(this, '-JP')
      },
      'member_unblock': {
        id: 'member_unblock',
        title: formatMessage(messages.unblock),
        handler: this.topicPermissionSetter.bind(this, '+JP')
      },
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

    if (!item) {
      console.log("Invalid menu item ID", e.currentTarget.dataset.id);
    } else {
      this.props.onAction(
        item.id,
        item.handler(this.props.params, this.props.onError),
        this.props.params);
    }
  }

  // Menu Actions

  deleteMessages(all, hard, params, errorHandler) {
    const topic = this.props.tinode.getTopic(params.topicName);
    if (!topic) {
      console.log("Topic not found: ", params.topicName);
      return;
    }

    // We don't know if the message is still pending (e.g. attachment is being uploaded),
    // so try cancelling first. No harm if we can't cancel.
    // The message can be cancelled if transmission to the server has not
    // started yet or if the message send has failed.
    if (!all && topic.cancelSend(params.seq)) {
      return;
    }
    // Can't cancel. Delete instead.
    const promise = all ?
      topic.delMessagesAll(hard) :
      topic.delMessagesList([params.seq], hard);

    return promise.catch((err) => {
      if (errorHandler) {
        errorHandler(err.message, 'err');
      }
    });
  }

  // Retries sending failed message.
  retryMessage(params, errorHandler) {
    const topic = this.props.tinode.getTopic(params.topicName);
    // Remove the existing message entry.
    if (!topic || !topic.flushMessage(params.seq)) {
      return;
    }
    const msg = topic.createMessage(params.content, false);
    return topic.publishDraft(msg).catch((err) => {
      if (errorHandler) {
        errorHandler(err.message, 'err');
      }
    });
  }

  // Function is used by context menu to set permissions.
  topicPermissionSetter(mode, params, errorHandler) {
    const topic = this.props.tinode.getTopic(params.topicName);
    if (!topic) {
      console.log("Topic not found", params.topicName);
      return;
    }

    let result = topic.updateMode(params.user, mode);
    if (errorHandler) {
      result = result.catch((err) => {
        errorHandler(err.message, 'err');
      });
    }
    return result;
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
    const hSize = 12 * REM_SIZE;
    const vSize = REM_SIZE * (0.7 + menu.length * 2.5);
    const left = (this.props.bounds.right - this.props.clickAt.x < hSize) ?
        (this.props.clickAt.x - this.props.bounds.left - hSize) :
        (this.props.clickAt.x - this.props.bounds.left);
    const top = (this.props.bounds.bottom - this.props.clickAt.y < vSize) ?
        (this.props.clickAt.y - this.props.bounds.top - vSize) :
        (this.props.clickAt.y - this.props.bounds.top);

    const position = {
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

export default injectIntl(ContextMenu);

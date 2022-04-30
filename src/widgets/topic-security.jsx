// Edit account parameters.
import React from 'react';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';

import InPlaceEdit from './in-place-edit.jsx';

import { NO_ACCESS_MODE } from '../config.js';

const messages = defineMessages({
  clear_messages: {
    id: 'action_clear_messages',
    defaultMessage: 'Clear Messages',
    description: 'Flat button [Clear Messages] (soft-delete messages)'
  },
  clear_messages_warning: {
    id: 'clear_messages_warning',
    defaultMessage: 'Are you sure you want to clear all messages? It cannot be undone.',
    description: 'Alert dialog warning when deleting all messages.'
  },
  delete_messages: {
    id: 'action_delete_messages',
    defaultMessage: 'Clear Messages for All',
    description: 'Flat button [Clear for All] (hard-delete all messages)'
  },
  delete_messages_warning: {
    id: 'delete_messages_warning',
    defaultMessage: 'Are you sure you want to delete all messages for everyone? It cannot be undone.',
    description: 'Alert dialog warning when hard-deleting all messages.'
  },
  topic_delete: {
    id: 'topic_delete',
    defaultMessage: 'Delete Conversation',
    description: 'Alert title when deleting the topic.'
  },
  topic_delete_warning: {
    id: 'topic_delete_warning',
    defaultMessage: 'Are you sure you want to delete this conversation? It cannot be undone.',
    description: 'Alert warning when deleting entire topic'
  },
  leave_chat: {
    id: 'action_leave_chat',
    defaultMessage: 'Leave Conversation',
    description: 'Flat button [Leave Conversation]'
  },
  leave_chat_warning: {
    id: 'leave_chat_warning',
    defaultMessage: 'Are you sure you want to leave this conversation?',
    description: 'Alert dialog warning when unsubscribing from a chat.'
  },
  block_contact: {
    id: 'action_block_contact',
    defaultMessage: "Block Contact",
    description: "Flat button [Block Contact]"
  },
  block_contact_warning: {
    id: 'block_contact_warning',
    defaultMessage: 'Are you sure you want to block this contact?',
    description: 'Alert dialog warning when blocking a contact.'
  },
  report_chat: {
    id: 'action_report_chat',
    defaultMessage: 'Report Conversation',
    description: 'Flat button [Report Group]'
  },
  report_chat_warning: {
    id: 'report_chat_warning',
    defaultMessage: 'Are you sure you want to block and report this conversation?',
    description: 'Alert dialog warning when reporting a conversation for abuse'
  },
  other_user: {
    id: 'label_other_user',
    defaultMessage: 'Other',
    description: 'Label for the other user when the user is unnamed'
  },
});

class TopicSecurity extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleDeleteTopic = this.handleDeleteTopic.bind(this);
    this.handleDeleteMessages = this.handleDeleteMessages.bind(this);
    this.handleLeave = this.handleLeave.bind(this);
    this.handleBlock = this.handleBlock.bind(this);
    this.handleReport = this.handleReport.bind(this);
  }

  handleDeleteTopic(e) {
    e.preventDefault();
    const {formatMessage} = this.props.intl;
    this.props.onShowAlert(
      formatMessage(messages.topic_delete), // title
      formatMessage(messages.topic_delete_warning), // content
      (() => { this.props.onDeleteTopic(this.props.topic); }), // onConfirm
      null, // "OK"
      true, // Show Reject button
      null  // "Cancel"
    );
  }

  handleDeleteMessages(e) {
    e.preventDefault();
    const {formatMessage} = this.props.intl;
    this.props.onShowAlert(
      formatMessage(this.props.deleter ? messages.delete_messages : messages.clear_messages), // title
      formatMessage(this.props.deleter ? messages.delete_messages_warning : messages.clear_messages_warning), // content
      (() => { this.props.onDeleteMessages(this.props.topic); }), // onConfirm
      null, // "OK"
      true, // Show Reject button
      null  // "Cancel"
    );
  }

  handleLeave(e) {
    e.preventDefault();
    const {formatMessage} = this.props.intl;
    this.props.onShowAlert(
      formatMessage(messages.leave_chat), // title
      formatMessage(messages.leave_chat_warning), // content
      (() => { this.props.onLeaveTopic(this.props.topic); }), // onConfirm
      null, // "OK"
      true, // Show Reject button
      null  // "Cancel"
    );
  }

  handleBlock(e) {
    e.preventDefault();
    const {formatMessage} = this.props.intl;
    this.props.onShowAlert(
      formatMessage(messages.block_contact), // title
      formatMessage(messages.block_contact_warning), // content
      (() => { this.props.onBlockTopic(this.props.topic); }), // onConfirm
      null, // "OK"
      true, // Show Reject button
      null  // "Cancel"
    );
  }

  handleReport(e) {
    e.preventDefault();
    const {formatMessage} = this.props.intl;
    this.props.onShowAlert(
      formatMessage(messages.report_chat), // title
      formatMessage(messages.report_chat_warning), // content
      (_ => { this.props.onReportTopic(this.props.topic); }), // onConfirm
      null, // "OK"
      true, // Show Reject button
      null  // "Cancel"
    );
  }

  render() {
    const {formatMessage} = this.props.intl;
    return (
      <div className="scrollable-panel">
        <div className="panel-form-column">
          {!this.props.channel ?
            <a href="#" className="flat-button" onClick={this.handleDeleteMessages}>
              <i className="material-icons">delete_outline</i> &nbsp;{
                formatMessage(this.props.deleter ? messages.delete_messages : messages.clear_messages)
              }
            </a>
            :
            null
          }
          {this.props.owner ?
            <a href="#" className="danger flat-button" onClick={this.handleDeleteTopic}>
              <i className="material-icons">delete</i> &nbsp;{formatMessage(messages.topic_delete)}
            </a>
            :
            <a href="#" className="danger flat-button" onClick={this.handleLeave}>
              <i className="material-icons">exit_to_app</i> &nbsp;{formatMessage(messages.leave_chat)}
            </a>
          }
          {!this.props.groupTopic ?
            <a href="#" className="danger flat-button" onClick={this.handleBlock}>
              <i className="material-icons">block</i> &nbsp;{formatMessage(messages.block_contact)}
            </a>
            :
            null
          }
          {!this.props.owner ?
            <a href="#" className="danger flat-button" onClick={this.handleReport}>
              <i className="material-icons">report</i> &nbsp;{formatMessage(messages.report_chat)}
            </a>
            :
            null
          }
        </div>
        <div className="hr" />
        <div className="panel-form-column">
          {this.props.groupTopic ?
            <>
              <div className="group">
                <label>
                  <FormattedMessage id="label_your_permissions" defaultMessage="Your permissions:"
                    description="Label for current user permissions" />
                </label> <tt className="clickable"
                  onClick={(e) => {e.preventDefault(); this.props.onLaunchPermissionsEditor('want')}}>
                  {this.props.access}
                </tt>
              </div>
              {!this.props.channel ?
                <div className="group">
                  <div>
                    <label className="small">
                      <FormattedMessage id="label_default_access_mode" defaultMessage="Default access mode:"
                      description="Label for default access mode" />
                    </label>
                  </div>
                  <div className="quoted">
                    <div>Auth: <tt className={this.props.owner ? 'clickable' : null}
                      onClick={(e) => {
                        e.preventDefault();
                        if (this.props.owner) {
                          this.props.onLaunchPermissionsEditor('auth');
                        }
                      }}>{this.props.auth}</tt>
                    </div>
                    <div>Anon: <tt className={this.props.owner ? 'clickable' : null}
                      onClick={(e) => {
                        e.preventDefault();
                        if (this.props.owner) {
                          this.props.onLaunchPermissionsEditor('anon');
                        }
                      }}>{this.props.anon}</tt>
                    </div>
                  </div>
                </div>
              :
                null
              }
            </>
            :
            <div className="group">
              <div>
                <label className="small">
                  <FormattedMessage id="label_permissions" defaultMessage="Permissions:"
                    description="Section title" />
                </label>
              </div>
              <div className="quoted">
                <div>
                  <FormattedMessage id="label_you" defaultMessage="You:"
                    description="Label for the current user" /> <tt className="clickable"
                    onClick={(e) => {e.preventDefault(); this.props.onLaunchPermissionsEditor('want')}}>
                    {this.props.access}
                  </tt>
                </div>
                <div>{this.props.fullName ? this.props.fullName : formatMessage(messages.other_user)}:
                  &nbsp;<tt className="clickable"
                    onClick={(e) => {e.preventDefault(); this.props.onLaunchPermissionsEditor('given')}}>
                    {this.props.modeGiven2}
                  </tt>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
};

export default injectIntl(TopicSecurity);

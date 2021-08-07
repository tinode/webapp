// Edit account parameters.
import React from 'react';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';

import InPlaceEdit from './in-place-edit.jsx';

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

class TopicSecurity extends React.Component {
  constructor(props) {
    super(props);

    const topic = this.props.tinode.getTopic(this.props.topic);
    if (!topic) {
      return;
    }

    const defacs = topic.getDefaultAccess() || {};
    const acs = topic.getAccessMode();

    this.state = {
      owner: acs && acs.isOwner(),
      admin: acs && acs.isAdmin(),
      sharer: acs && acs.isSharer(),
      deleter: acs && acs.isDeleter(),
      muted: acs && acs.isMuted(),

      groupTopic: topic.isGroupType(),
      channel: topic.isChannelType(),
      access: acs ? acs.getMode() : undefined,
      modeGiven: acs ? acs.getGiven() : undefined,
      modeWant: acs ? acs.getWant() : undefined,
      auth: defacs ? defacs.auth : null,
      anon: defacs ? defacs.anon : null,
    };

    this.handleLaunchPermissionsEditor = this.handleLaunchPermissionsEditor.bind(this);
    this.handleDeleteMessages = this.handleDeleteMessages.bind(this);
    this.handleLeave = this.handleLeave.bind(this);
    this.handleBlock = this.handleBlock.bind(this);
    this.handleReport = this.handleReport.bind(this);
  }

  handleLaunchPermissionsEditor(which) {
    this.props.onNavigate(`perm/${which}/${this.state[which] || ''}`);
  }


  handleDeleteMessages(e) {
    e.preventDefault();
    const {formatMessage} = this.props.intl;
    this.props.onShowAlert(
      formatMessage(this.state.deleter ? messages.delete_messages : messages.clear_messages), // title
      formatMessage(this.state.deleter ? messages.delete_messages_warning : messages.clear_messages_warning), // content
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
      (() => { this.props.onReportTopic(this.props.topic); }), // onConfirm
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
          {!this.state.channel ?
            <a href="#" className="flat-button" onClick={this.handleDeleteMessages}>
              <i className="material-icons">delete_outline</i> &nbsp;{
                formatMessage(this.state.deleter ? messages.delete_messages : messages.clear_messages)
              }
            </a>
            :
            null
          }
          <a href="#" className="danger flat-button" onClick={this.handleLeave}>
            <i className="material-icons">exit_to_app</i> &nbsp;{formatMessage(messages.leave_chat)}
          </a>
          {!this.state.groupTopic ?
            <a href="#" className="danger flat-button" onClick={this.handleBlock}>
              <i className="material-icons">block</i> &nbsp;{formatMessage(messages.block_contact)}
            </a>
            :
            null
          }
          {!this.state.owner ?
            <a href="#" className="danger flat-button" onClick={this.handleReport}>
              <i className="material-icons">report</i> &nbsp;{formatMessage(messages.report_chat)}
            </a>
            :
            null
          }
        </div>
        <div className="hr" />
        <div className="panel-form-column">
          {this.state.groupTopic ?
            <div className="group">
              <label>
                <FormattedMessage id="label_your_permissions" defaultMessage="Your permissions:"
                  description="Label for current user permissions" />
              </label> <tt className="clickable"
                onClick={this.handleLaunchPermissionsEditor.bind(this, 'want')}>
                {this.state.access}
              </tt>
            </div>
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
                  onClick={this.handleLaunchPermissionsEditor.bind(this, 'want')}>
                  {this.state.access}
                </tt></div>
                <div>{this.state.fullName ? this.state.fullName : formatMessage(messages.other_user)}:
                  &nbsp;<tt className="clickable" onClick={this.handleLaunchPermissionsEditor.bind(this, 'given')}>
                  {this.state.modeGiven2}
                  </tt>
                </div>
              </div>
            </div>
          }
          <div className="group">
            <div>
              <label className="small">
                <FormattedMessage id="label_default_access_mode" defaultMessage="Default access mode:"
                description="Label for default access mode" />
              </label>
            </div>
            <div className="quoted">
              <div>Auth: <tt className="clickable"
                onClick={this.handleLaunchPermissionsEditor.bind(this, 'auth')}>{this.state.auth}</tt></div>
              <div>Anon: <tt className="clickable"
                onClick={this.handleLaunchPermissionsEditor.bind(this, 'anon')}>{this.state.anon}</tt></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default injectIntl(TopicSecurity);

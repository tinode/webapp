/* ContactsView holds all contacts-related stuff */
import React from 'react';
import { FormattedHTMLMessage, defineMessages } from 'react-intl';

import ContactList from '../widgets/contact-list.jsx';

import { updateFavicon } from '../lib/utils.js';

const messages = defineMessages({
  archived_contacts_title: {
    id: "archived_contacts",
    defaultMessage: "Archived contacts ({count})",
    description: "Label for archived chats"
  }
});

export default class ContactsView extends React.Component {
  constructor(props) {
    super(props);

    this.handleAction = this.handleAction.bind(this);

    this.state = ContactsView.getDerivedStateFromProps(props, {});
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const contacts = [];
    let unreadThreads = 0;
    let archivedCount = 0;
    nextProps.chatList.map((c) => {
      if (c.private && c.private.arch) {
        if (nextProps.archive) {
          contacts.push(c);
        } else {
          archivedCount ++;
        }
      } else if (!nextProps.archive) {
        contacts.push(c);
        unreadThreads += c.unread > 0 ? 1 : 0;
      }
    });
    contacts.sort(function(a, b) {
      return (b.touched || 0) - (a.touched || 0);
    });

    if (archivedCount > 0) {
      contacts.push({
        action: 'archive',
        title: messages.archived_contacts_title,
        values: {count: archivedCount}
      });
    }

    updateFavicon(unreadThreads);

    return {
      contactList: contacts,
      archivedCount: archivedCount
    };
  }

  handleAction(action_ignored) {
    this.props.onShowArchive();
  }

  render() {
    return (
      <FormattedHTMLMessage id="contacts_not_found"
        defaultMessage="You have no chats<br />¯∖_(ツ)_/¯"
        description="HTML message shown in ContactList when no contacts are found">{
        (no_contacts) => <ContactList
          connected={this.props.connected}
          contacts={this.state.contactList}
          emptyListMessage={no_contacts}
          topicSelected={this.props.topicSelected}
          myUserId={this.props.myUserId}
          showOnline={true}
          showUnread={true}
          onTopicSelected={this.props.onTopicSelected}
          showContextMenu={this.props.showContextMenu}
          onAction={this.handleAction} />
      }</FormattedHTMLMessage>
    );
  }
};

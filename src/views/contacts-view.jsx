/* ContactsView holds all contacts-related stuff */
import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';

import ContactList from '../widgets/contact-list.jsx';

import { updateFavicon } from '../lib/utils.js';

// Panel titles for translation.
const messages = defineMessages({
  'contacts_not_found': {
    id: 'contacts_not_found',
    description: 'HTML message shown in ContactList when no contacts are found',
    defaultMessage: 'You have no chats<br />¯\\\\_(ツ)_/¯'
  }
});

class ContactsView extends React.Component {
  constructor(props) {
    super(props);

    this.state = ContactsView.getDerivedStateFromProps(props, {});
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let contacts = [];
    let unreadThreads = 0;
    nextProps.chatList.map((c) => {
      unreadThreads += c.unread > 0 ? 1 : 0;
      contacts.push(c);
    });
    contacts.sort(function(a, b){
      return (b.touched || 0) - (a.touched || 0);
    });

    updateFavicon(unreadThreads);

    return {contactList: contacts};
  }

  render() {
    const {formatHTMLMessage} = this.props.intl;
    return (
      <ContactList
        connected={this.props.connected}
        contacts={this.state.contactList}
        emptyListMessage={<span>{formatHTMLMessage(messages.contacts_not_found)}</span>}
        topicSelected={this.props.topicSelected}
        myUserId={this.props.myUserId}
        showOnline={true}
        showUnread={true}
        onTopicSelected={this.props.onTopicSelected}
        showContextMenu={this.props.showContextMenu} />
    );
  }
};

export default injectIntl(ContactsView);

/* ContactsView holds all contacts-related stuff */
import React from 'react';
import { FormattedHTMLMessage } from 'react-intl';

import ContactList from '../widgets/contact-list.jsx';

import { updateFavicon } from '../lib/utils.js';

export default class ContactsView extends React.Component {
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
    return (
      <FormattedHTMLMessage id="contacts_not_found"
        defaultMesage="You have no chats<br />¯\\\\_(ツ)_/¯"
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
          showContextMenu={this.props.showContextMenu} />
      }</FormattedHTMLMessage>
    );
  }
};

import React from 'react';

/* ContactsView holds all contacts-related stuff */

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
      <ContactList
        connected={this.props.connected}
        contacts={this.state.contactList}
        emptyListMessage={<span>You have no chats<br />¯\_(ツ)_/¯</span>}
        topicSelected={this.props.topicSelected}
        myUserId={this.props.myUserId}
        showOnline={true}
        showUnread={true}
        onTopicSelected={this.props.onTopicSelected}
        showContextMenu={this.props.showContextMenu} />
    );
  }
};

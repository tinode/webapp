// Forward Menu: message forwarding popup/dropdown menu.
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Tinode } from 'tinode-sdk';

import ContactList from './contact-list.jsx';
import SearchContacts from './search-contacts.jsx';

export default class ForwardDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      query: null
    };

    this.handleEscapeKey = this.handleEscapeKey.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.handleSearchContacts = this.handleSearchContacts.bind(this);
    this.handleContactSelected = this.handleContactSelected.bind(this);
  }

  componentDidMount() {
    this.props.onInitFind();
  }

  handleEscapeKey(e) {
    if (e.keyCode === 27) {
      // Not forwarding the message.
      this.props.hide(false);
    }
  }

  handleClose(e) {
    e.preventDefault();
    this.props.hide(false);
  }

  handleSearchContacts(query) {
    this.setState({ query: Tinode.isNullValue(query) ? null : query });
    this.props.onSearchContacts(query);
  }

  handleContactSelected(uid) {
    this.props.onTopicSelected(uid);
    this.props.hide(true);
  }

  render() {
    let contacts = this.state.query != null ? this.props.searchResults : this.props.contacts;
    // Filter out contacts without a 'W' or 'J' permissions as well as the current topic.
    contacts = contacts.filter((c) => {
      return (c.name != this.props.topicSelected) && c.acs.isJoiner() && c.acs.isWriter();
    });

    return (
      <div className="alert-container">
        <div className="forward-dialog">
          <div className="title with-control">
            <div><FormattedMessage id="forward_to" defaultMessage="Forward to"
              desription="Title of the contact selector dialog when forwarding a message" /></div>
            <div><a href="#" onClick={this.handleClose}><i className="material-icons">close</i></a></div>
          </div>
          <FormattedMessage id="forward_to_search_placeholder" defaultMessage="Search contacts"
            description="Contact search prompt when forwarding a message.">{
            (search_placeholder) => <SearchContacts
              placeholder={search_placeholder}
              onSearchContacts={this.handleSearchContacts} />
          }</FormattedMessage>
          <FormattedMessage id="search_no_results" defaultMessage="Search returned no results"
              description="Text shown in contacts view when query returned no results.">{
            (not_found_placeholder) => <ContactList
              tinode={this.props.tinode}
              contacts={contacts}
              myUserId={this.props.myUserId}
              emptyListMessage={not_found_placeholder}
              showOnline={false}
              showUnread={false}
              showContextMenu={false}
              onTopicSelected={this.handleContactSelected} />
          }</FormattedMessage>
        </div>
      </div>
    );
  }
}

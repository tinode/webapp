// Create new topic and invite users or send an invite.
import React from 'react';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';

import Tinode from 'tinode-sdk';

import ContactList from '../widgets/contact-list.jsx';
import NewTopicById from '../widgets/new-topic-by-id.jsx';
import NewTopicGroup from '../widgets/new-topic-group.jsx';
import SearchContacts from '../widgets/search-contacts.jsx';

import HashNavigation from '../lib/navigation.js';
import { theCard } from '../lib/utils.js';

const messages = defineMessages({
  search_for_contacts: {
    id: "search_for_contacts",
    defaultMessage: "Use search to find contacts",
    description: "Text shown in contacts view when user entered no search query."
  },
  search_no_results: {
    id: "search_no_results",
    defaultMessage: "Search returned no results",
    description: "Text shown in contacts view when query returned no results."
  }
});

class NewTopicView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tabSelected: 'p2p',
      searchQuery: null
    };

    this.handleTabClick = this.handleTabClick.bind(this);
    this.handleSearchContacts = this.handleSearchContacts.bind(this);
    this.handleContactSelected = this.handleContactSelected.bind(this);
    this.handleNewGroupSubmit = this.handleNewGroupSubmit.bind(this);
    this.handleGroupByID = this.handleGroupByID.bind(this);
  }

  componentDidMount() {
    this.props.onInitFind();
  }

  handleTabClick(e) {
    e.preventDefault();
    HashNavigation.navigateTo(HashNavigation.addUrlParam(window.location.hash, 'tab', e.currentTarget.dataset.id));
    this.setState({tabSelected: e.currentTarget.dataset.id});
  }

  handleSearchContacts(query) {
    this.props.onSearchContacts(query);
    this.setState({searchQuery: Tinode.isNullValue(query) ? null : query});
  }

  handleContactSelected(sel) {
    if (this.state.tabSelected === 'p2p') {
      HashNavigation.navigateTo(HashNavigation.removeUrlParam(window.location.hash, 'tab'));
      this.props.onCreateTopic(sel);
    }
  }

  handleNewGroupSubmit(name, dataUrl, priv, tags, isChannel) {
    HashNavigation.navigateTo(HashNavigation.removeUrlParam(window.location.hash, 'tab'));
    this.props.onCreateTopic(undefined, theCard(name, dataUrl), priv, tags, isChannel);
  }

  handleGroupByID(topicName) {
    HashNavigation.navigateTo(HashNavigation.removeUrlParam(window.location.hash, 'tab'));
    this.props.onCreateTopic(topicName);
  }

  render() {
    const {formatMessage} = this.props.intl;
    const no_contacts_placeholder = formatMessage(this.state.searchQuery ?
      messages.search_no_results : messages.search_for_contacts);
    return (
      <div className="flex-column">
        <ul className="tabbar">
          <li className={this.state.tabSelected === "p2p" ? "active" : null}>
            <a href="#" data-id="p2p" onClick={this.handleTabClick}>
              <FormattedMessage id="tabtitle_find_user" defaultMessage="find"
                description="Tab title Find" />
            </a>
          </li>
          <li className={this.state.tabSelected === "grp" ? "active" : null}>
            <a href="#" data-id="grp" onClick={this.handleTabClick}>
              <FormattedMessage id="tabtitle_new_group" defaultMessage="new group"
                description="Tab title New Group" />
            </a>
          </li>
          <li className={this.state.tabSelected === "byid" ? "active" : null}>
            <a href="#" data-id="byid" onClick={this.handleTabClick}>
              <FormattedMessage id="tabtitle_group_by_id" defaultMessage="by id"
                description="Tab title Find topic by ID" />
            </a>
          </li>
        </ul>
        {this.state.tabSelected === 'grp' ?
          <NewTopicGroup
            tinode={this.props.tinode}
            onSubmit={this.handleNewGroupSubmit} /> :
          this.state.tabSelected === 'byid' ?
            <NewTopicById
              onSubmit={this.handleGroupByID}
              onError={this.props.onError} /> :
            <div className="flex-column">
              <SearchContacts
                type="p2p"
                onSearchContacts={this.handleSearchContacts} />
              <ContactList
                contacts={this.props.searchResults}
                myUserId={this.props.myUserId}
                emptyListMessage={no_contacts_placeholder}
                showOnline={false}
                showUnread={false}
                showContextMenu={false}
                onTopicSelected={this.handleContactSelected} />
            </div>}
      </div>
    );
  }
};

export default injectIntl(NewTopicView);

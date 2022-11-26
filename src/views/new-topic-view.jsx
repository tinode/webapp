// Create new topic and invite users or send an invite.
import React from 'react';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';

import { Tinode } from 'tinode-sdk';

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
  },
  search_placeholder: {
    id: "search_placeholder",
    defaultMessage: "List like email:alice@example.com, tel:17025550003...",
    description: "Placeholder in contacts search field"
  },
});

class NewTopicView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tabSelected: 'find',
      searchQuery: null
    };

    this.handleTabClick = this.handleTabClick.bind(this);
    this.handleSearchContacts = this.handleSearchContacts.bind(this);
    this.handleSearchResultSelected = this.handleSearchResultSelected.bind(this);
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

  handleSearchResultSelected(name) {
    if (this.state.tabSelected == 'find') {
      HashNavigation.navigateTo(HashNavigation.removeUrlParam(window.location.hash, 'tab'));
      this.props.onCreateTopic(name);
    }
  }

  handleNewGroupSubmit(name, description, dataUrl, priv, tags, isChannel) {
    HashNavigation.navigateTo(HashNavigation.removeUrlParam(window.location.hash, 'tab'));
    this.props.onCreateTopic(undefined,
      {public: theCard(name, dataUrl, null, description), private: priv, tags: tags}, isChannel);
  }

  handleGroupByID(topicName) {
    HashNavigation.navigateTo(HashNavigation.removeUrlParam(window.location.hash, 'tab'));
    this.props.onCreateTopic(topicName);
  }

  render() {
    const {formatMessage} = this.props.intl;
    const no_contacts_placeholder = formatMessage(this.state.searchQuery ?
      messages.search_no_results : messages.search_for_contacts);
    const search_placeholder = formatMessage(messages.search_placeholder);
    return (
      <div className="flex-column">
        <ul className="tabbar">
          <li className={this.state.tabSelected === "find" ? "active" : null}>
            <a href="#" data-id="find" onClick={this.handleTabClick}>
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
                placeholder={search_placeholder}
                onSearchContacts={this.handleSearchContacts} />
              <ContactList
                tinode={this.props.tinode}
                contacts={this.props.searchResults}
                myUserId={this.props.myUserId}
                emptyListMessage={no_contacts_placeholder}
                showOnline={false}
                showUnread={false}
                showContextMenu={false}
                onTopicSelected={this.handleSearchResultSelected} />
            </div>}
      </div>
    );
  }
};

export default injectIntl(NewTopicView);

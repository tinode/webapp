// Create new topic and invite users or send an invite.
import React from 'react';
import { FormattedMessage } from 'react-intl';

import ContactList from '../widgets/contact-list.jsx';
import NewTopicById from '../widgets/new-topic-by-id.jsx';
import NewTopicGroup from '../widgets/new-topic-group.jsx';
import SearchContacts from '../widgets/search-contacts.jsx';

import HashNavigation from '../lib/navigation.js';
import { vcard } from '../lib/utils.js';

export default class NewTopicView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tabSelected: 'p2p'
    };

    this.handleTabClick = this.handleTabClick.bind(this);
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

  handleContactSelected(sel) {
    if (this.state.tabSelected === 'p2p') {
      HashNavigation.navigateTo(HashNavigation.removeUrlParam(window.location.hash, 'tab'));
      this.props.onCreateTopic(sel, undefined);
    }
  }

  handleNewGroupSubmit(name, dataUrl, priv, tags) {
    HashNavigation.navigateTo(HashNavigation.removeUrlParam(window.location.hash, 'tab'));
    this.props.onCreateTopic(undefined, vcard(name, dataUrl), priv, tags);
  }

  handleGroupByID(topicName) {
    HashNavigation.navigateTo(HashNavigation.removeUrlParam(window.location.hash, 'tab'));
    this.props.onCreateTopic(topicName);
  }

  render() {
    return (
      <div className="flex-column">
        <ul className="tabbar">
          <li className={this.state.tabSelected === "p2p" ? "active" : null}>
            <a href="javascript:;" data-id="p2p" onClick={this.handleTabClick}>
              <FormattedMessage id="tabtitle_find_user" defaultMessage="find"
                description="Tab title Find" />
            </a>
          </li>
          <li className={this.state.tabSelected === "grp" ? "active" : null}>
            <a href="javascript:;" data-id="grp" onClick={this.handleTabClick}>
              <FormattedMessage id="tabtitle_new_group" defaultMessage="new group"
                description="Tab title New Group" />
            </a>
          </li>
          <li className={this.state.tabSelected === "byid" ? "active" : null}>
            <a href="javascript:;" data-id="byid" onClick={this.handleTabClick}>
              <FormattedMessage id="tabtitle_group_by_id" defaultMessage="by id"
                description="Tab title Find topic by ID" />
            </a>
          </li>
        </ul>
        {this.state.tabSelected === 'grp' ?
          <NewTopicGroup onSubmit={this.handleNewGroupSubmit} /> :
          this.state.tabSelected === 'byid' ?
          <NewTopicById
            onSubmit={this.handleGroupByID}
            onError={this.props.onError} /> :
          <div className="flex-column">
            <SearchContacts type="p2p"
              onSearchContacts={this.props.onSearchContacts} />
            <FormattedMessage id="search_for_contacts" defaultMessage="Use search to find contacts"
              description="Prompt in search field.">{
              (search_for_contacts) => <ContactList
                contacts={this.props.searchResults}
                myUserId={this.props.myUserId}
                emptyListMessage={search_for_contacts}
                showOnline={false}
                showUnread={false}
                showContextMenu={false}
                onTopicSelected={this.handleContactSelected} />
            }</FormattedMessage>
          </div>}
      </div>
    );
  }
};

/* Create new topic and invite users or send an invite */

import React from 'react';

import ContactList from './contact-list.jsx';
import NewTopicById from './new-topic-by-id.jsx';
import NewTopicGroup from './new-topic-group.jsx';
import SearchContacts from './search-contacts.jsx';

export default class NewTopicView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tabSelected: 'p2p',
      contactList: props.searchResults
    };

    this.handleTabClick = this.handleTabClick.bind(this);
    this.handleContactSelected = this.handleContactSelected.bind(this);
    this.handleNewGroupSubmit = this.handleNewGroupSubmit.bind(this);
    this.handleGroupByID = this.handleGroupByID.bind(this);
  }

  componentDidMount() {
    this.props.onInitFind();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      contactList: nextProps.searchResults
    };
  }

  handleTabClick(e) {
    e.preventDefault();
    navigateTo(addUrlParam(window.location.hash, 'tab', e.currentTarget.dataset.id));
    this.setState({tabSelected: e.currentTarget.dataset.id});
  }

  handleContactSelected(sel) {
    if (this.state.tabSelected === 'p2p') {
      navigateTo(removeUrlParam(window.location.hash, 'tab'));
      this.props.onCreateTopic(sel, undefined);
    }
  }

  handleNewGroupSubmit(name, dataUrl, priv, tags) {
    navigateTo(removeUrlParam(window.location.hash, 'tab'));
    this.props.onCreateTopic(undefined, vcard(name, dataUrl), priv, tags);
  }

  handleGroupByID(topicName) {
    navigateTo(removeUrlParam(window.location.hash, 'tab'));
    this.props.onCreateTopic(topicName);
  }

  render() {
    return (
      <div className="flex-column">
        <ul className="tabbar">
          <li className={this.state.tabSelected === "p2p" ? "active" : null}>
            <a href="javascript:;" data-id="p2p" onClick={this.handleTabClick}>find</a>
          </li>
          <li className={this.state.tabSelected === "grp" ? "active" : null}>
            <a href="javascript:;" data-id="grp" onClick={this.handleTabClick}>new group</a>
          </li>
          <li className={this.state.tabSelected === "byid" ? "active" : null}>
            <a href="javascript:;" data-id="byid" onClick={this.handleTabClick}>by id</a>
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
            <ContactList
              contacts={this.state.contactList}
              myUserId={this.props.myUserId}
              emptyListMessage="Use search to find contacts"
              topicSelected={this.state.selectedContact}
              showOnline={false}
              showUnread={false}
              showContextMenu={false}
              onTopicSelected={this.handleContactSelected} />
          </div>}
      </div>
    );
  }
};

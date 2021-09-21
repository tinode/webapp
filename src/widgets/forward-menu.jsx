// Forward Menu: message forwarding popup/dropdown menu.
import React from 'react';

import Tinode from 'tinode-sdk';

import ContactList from './contact-list.jsx';
import SearchContacts from './search-contacts.jsx';

import HashNavigation from '../lib/navigation.js';
import { REM_SIZE } from '../config.js';

export default class ForwardMenu extends React.Component {
  constructor(props) {
    super(props);

    this.selfRef = React.createRef();
    this.handlePageClick = this.handlePageClick.bind(this);
    this.handleEscapeKey = this.handleEscapeKey.bind(this);

    this.handleSearchContacts = this.handleSearchContacts.bind(this);
    this.handleContactSelected = this.handleContactSelected.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handlePageClick, false);
    document.addEventListener('keyup', this.handleEscapeKey, false);

    this.props.onInitFind();
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handlePageClick, false);
    document.removeEventListener('keyup', this.handleEscapeKey, false);
  }

  handlePageClick(e) {
    if (this.selfRef.current.contains(e.target)) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    // Not forwarding the message.
    this.props.hide(false);
  }

  handleEscapeKey(e) {
    if (e.keyCode === 27) {
      // Not forwarding the message.
      this.props.hide(false);
    }
  }

  handleSearchContacts(query) {
    this.props.onSearchContacts(query);
  }

  handleContactSelected(uid) {
    this.props.onCreateTopic(uid);
    this.props.hide(true);
  }

  render() {
    // Ensure that menu is inside the app-container.
    const hSize = 20 * REM_SIZE;
    const vSize = REM_SIZE * (0.7 + this.props.contacts.length * 3);
    const left = (this.props.bounds.right - this.props.clickAt.x < hSize) ?
        (this.props.clickAt.x - this.props.bounds.left - hSize) :
        (this.props.clickAt.x - this.props.bounds.left);
    const top = (this.props.bounds.bottom - this.props.clickAt.y < vSize) ?
        (this.props.clickAt.y - this.props.bounds.top - vSize) :
        (this.props.clickAt.y - this.props.bounds.top);

    const style = {
      left: left + 'px',
      top: top + 'px',
      maxWidth: hSize + 'px'
    };

    return (
      <div className="forward-menu" style={style} ref={this.selfRef}>
        <div className="flex-column">
          <SearchContacts
            onSearchContacts={this.handleSearchContacts} />
          <ContactList
            tinode={this.props.tinode}
            contacts={this.props.searchResults}
            myUserId={this.props.myUserId}
            emptyListMessage={null}
            showOnline={false}
            showUnread={false}
            showContextMenu={false}
            onTopicSelected={this.handleContactSelected} />
        </div>
      </div>
    );
  }
}

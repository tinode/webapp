// GroupMembers: control for managing a list of group members.
import React from 'react';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';

import ChipInput from './chip-input.jsx';
import ContactList from './contact-list.jsx';

const messages = defineMessages({
  no_contacts: {
    id: 'no_contacts',
    defaultMessage: 'You have no contacts :-(',
    description: 'Shown in ContactsView when the user has no contacts'
  },
  contacts_not_found_short: {
    id: 'contacts_not_found_short',
    defaultMessage: "No contacts match ''{query}''",
    description: 'Shown in ContactsView when search returned no results'
  }
});

class GroupManager extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Array of topic members
      members: props.members,
      index: GroupManager.indexMembers(props.members),
      staticMembers: GroupManager.staticMembers(props.members, props.keepInitialMembers, props.requiredMember),
      contactFilter: '',
      noContactsMessage: props.intl.formatMessage(messages.no_contacts),
      selectedContacts: GroupManager.selectedContacts(props.members)
    };

    this.handleContactSelected = this.handleContactSelected.bind(this);
    this.handleMemberRemoved = this.handleMemberRemoved.bind(this);
    this.handleContactFilter = this.handleContactFilter.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  static indexMembers(members) {
    let index = {};
    members.map((m) => {
      index[m.user] = {delta: 0, present: true}; // Delta: 0 unchanged, +1 added, -1 removed
    });
    return index;
  }

  static staticMembers(members, keepInitial, requiredMember) {
    let stat = [];
    members.map((m) => {
      if (keepInitial || m.user == requiredMember) {
        stat.push(m.user);
      }
    });
    return stat;
  }

  static selectedContacts(members) {
    let sel = [];
    members.map((m) => {
      sel.push(m.user);
    });
    return sel;
  }

  handleContactSelected(userId, index) {
    let status = this.state.index[userId];
    if (status) {
      if (status.present) {
        // Prevent duplicate members
        return;
      }
      status.delta += 1;
      status.present = true;
    } else {
      status = {delta: 1, present: true};
    }

    let m = this.state.members.slice();
    m.push(this.props.contacts[index]);

    const sel = GroupManager.selectedContacts(m);

    const i = this.state.index;
    i[userId] = status;

    this.setState({members: m, index: i, selectedContacts: sel});
  }

  handleMemberRemoved(userId, index) {
    const status = this.state.index[userId];
    if (!status || !status.present) {
      return;
    }
    status.present = false;
    status.delta -= 1;

    let m = this.state.members.slice();
    m.splice(index, 1);

    const sel = GroupManager.selectedContacts(m);

    const i = this.state.index;
    i[userId] = status;

    this.setState({members: m, index: i, selectedContacts: sel});
  }

  handleContactFilter(val) {
    const {formatMessage} = this.props.intl;
    const msg = !val ?
      formatMessage(messages.no_contacts) :
      formatMessage(messages.contacts_not_found_short, {query: val});

    this.setState({contactFilter: val, noContactsMessage: msg});
  }

  static doContactFiltering(filter, values) {
    if (filter) {
      for (let i=0; i<values.length; i++) {
        if (values[i].indexOf(filter) >= 0) {
          return true;
        }
      }
      return false;
    }
    return true;
  }

  handleSubmit() {
    var instance = this;
    var members = [];
    var added = [];
    var removed = [];

    var keys = Object.keys(this.state.index);
    keys.map(function(k) {
      if (instance.state.index[k].present) {
        members.push(k);
      }

      if (instance.state.index[k].delta > 0) {
        added.push(k);
      } else if (instance.state.index[k].delta < 0) {
        removed.push(k);
      }
    });
    this.props.onSubmit(members, added, removed);
  }

  handleCancel() {
    this.props.onCancel();
  }

  render() {
    const {formatMessage} = this.props.intl;
    return (
      <div id="group-manager">
        <div className="panel-form-row">
          <label className="small">
            <FormattedMessage id="title_group_members" defaultMessage="Group Members" description="Section title" />
          </label>
        </div>
        <div className="panel-form-row">
          <ChipInput
            chips={this.state.members}
            staticMembers={this.state.staticMembers}
            prompt="add members"
            filterFunc={this.handleContactFilter}
            onChipRemoved={this.handleMemberRemoved} />
        </div>
        <div className="panel-form-row">
          <label className="small">
            <FormattedMessage id="title_all_contacts" defaultMessage="All Contacts"
              description="Section title [All Contacts]" />
          </label>
        </div>
        <ContactList
          contacts={this.props.contacts}
          myUserId={this.props.myUserId}
          topicSelected={this.state.selectedContacts}
          filter={this.state.contactFilter}
          filterFunc={GroupManager.doContactFiltering}
          emptyListMessage={this.state.noContactsMessage}
          showOnline={false}
          showUnread={false}
          onTopicSelected={this.handleContactSelected} />
        <div id="group-manager-buttons" className="panel-form-row">
          <button className="primary" onClick={this.handleSubmit}>
            <FormattedMessage id="button_ok" defaultMessage="OK" description="Button [OK]" />
          </button>
          <button className="secondary" onClick={this.handleCancel}>
            <FormattedMessage id="button_cancel" defaultMessage="Cancel" description="Button [Cancel]" />
          </button>
        </div>
      </div>
    );
  }
};

export default injectIntl(GroupManager);

import React from 'react';

/* GroupMembers: control for managing a list of group members */
export default class GroupManager extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      members: props.members,
      index: GroupManager.indexMembers(props.members),
      contactFilter: '',
      noContactsMessage: "You have no contacts :-(",
      selectedContacts: GroupManager.selectedContacts(props.members)
    };

    this.handleContactSelected = this.handleContactSelected.bind(this);
    this.handleMemberRemoved = this.handleMemberRemoved.bind(this);
    this.handleContactFilter = this.handleContactFilter.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  static indexMembers(members) {
    var index = {};
    members.map(function(m) {
      index[m.user] = {delta: 0, present: true}; // Delta: 0 unchanged, +1 added, -1 removed
    });
    return index;
  }

  static selectedContacts(members) {
    var sel = [];
    members.map(function(m) {
      sel.push(m.user);
    });
    return sel;
  }

  handleContactSelected(userId, index) {
    var status = this.state.index[userId];
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

    var m = this.state.members.slice();
    m.push(this.props.contacts[index]);

    var sel = GroupManager.selectedContacts(m);

    var i = this.state.index;
    i[userId] = status;

    this.setState({members: m, index: i, selectedContacts: sel});
  }

  handleMemberRemoved(userId, index) {
    var status = this.state.index[userId];
    if (!status || !status.present) {
      return;
    }
    status.present = false;
    status.delta -= 1;

    var m = this.state.members.slice();
    m.splice(index, 1);

    var sel = GroupManager.selectedContacts(m);

    var i = this.state.index;
    i[userId] = status;

    this.setState({members: m, index: i, selectedContacts: sel});
  }

  handleContactFilter(val) {
    var msg = !val ?
      "You have no contacts :-(" :
      "No contacts match '" + val + "'";

    this.setState({contactFilter: val, noContactsMessage: msg});
  }

  static doContactFiltering(filter, values) {
    if (filter) {
      for (var i=0; i<values.length; i++) {
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
    return (
      <div id="group-manager">
        <div className="panel-form-row">
          <label className="small">Group members</label>
        </div>
        <div className="panel-form-row">
          <ChipInput
            chips={this.state.members}
            required={this.props.requiredMember}
            prompt="add members"
            filterFunc={this.handleContactFilter}
            onChipRemoved={this.handleMemberRemoved} />
        </div>
        <div className="panel-form-row">
          <label className="small">All contacts</label>
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
          <button className="blue" onClick={this.handleSubmit}>OK</button>
          <button className="white" onClick={this.handleCancel}>Cancel</button>
        </div>
      </div>
    );
  }
};

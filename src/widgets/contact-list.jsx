// ContactList: component for showing a list of contacts,
// such as a list of group members in a group chat.
import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';

import Contact from './contact.jsx';
import ContactAction from './contact-action.jsx';

import { makeImageUrl } from '../lib/blob-helpers.js';

const messages = defineMessages({
  badge_you: {
    id: 'badge_you',
    defaultMessage: 'you',
    description: 'Badge for indicating the current user'
  },
  badge_owner: {
    id: 'badge_owner',
    defaultMessage: 'owner',
    description: 'Badge for indicating the owner'
  }
});

class ContactList extends React.Component {
  render() {
    const {formatMessage} = this.props.intl;
    const showCheckmark = Array.isArray(this.props.topicSelected);
    const contactNodes = [];
    let contactsCount = 0;
    if (this.props.contacts && this.props.contacts.length > 0) {
      this.props.contacts.map((c) => {
        if (c.action) {
          // Action item
          contactNodes.push(
            <ContactAction
              title={c.title} action={c.action} values={c.values}
              key={c.action}
              onAction={this.props.onAction}
              />);
        } else {
          // Normal contact
          const key = c.topic ? c.topic : c.user;
          // If filter function is provided, filter out the items
          // which don't satisfy the condition.
          if (this.props.filterFunc && this.props.filter) {
            let content = [key];
            if (c.private && c.private.comment) {
              content.push(('' + c.private.comment).toLowerCase());
            }
            if (c.public && c.public.fn) {
              content.push(('' + c.public.fn).toLowerCase());
            }
            if (!this.props.filterFunc(this.props.filter, content)) {
              return;
            }
          }

          const selected = showCheckmark ?
            (this.props.topicSelected.indexOf(key) > -1) :
            (this.props.topicSelected === key);
          const badges = [];
          if (this.props.showMode) {
            if (key === this.props.myUserId) {
              badges.push({name: formatMessage(messages.badge_you), color: 'green'});
            }
            if (c.acs && c.acs.isOwner()) {
              badges.push({name: formatMessage(messages.badge_owner), color: 'blue'});
            }
          }
          const comment = Array.isArray(c.private) ?
            c.private.join(',') : (c.private ? c.private.comment : null);

          contactNodes.push(
            <Contact
              title={c.public ? c.public.fn : null}
              avatar={makeImageUrl(c.public ? c.public.photo : null)}
              comment={comment}
              unread={this.props.showUnread ? c.unread : 0}
              now={c.online && this.props.connected}
              acs={c.acs}
              showMode={this.props.showMode}
              badges={badges}
              showCheckmark={showCheckmark}
              selected={selected}
              showOnline={this.props.showOnline}
              onSelected={this.props.onTopicSelected}
              showContextMenu={this.props.showContextMenu}
              item={key}
              index={contactNodes.length}
              key={key} />
          );
          contactsCount ++;
        }
      }, this);
    }

    return (
      <div className={this.props.noScroll ? null : "scrollable-panel"}>
        {contactsCount == 0 ?
          <div className="center-medium-text"
            dangerouslySetInnerHTML={{__html: this.props.emptyListMessage}} />
          :
          null
        }
        {contactNodes.length > 0 ?
          <ul className="contact-box">
            {contactNodes}
          </ul>
          :
          null
        }
      </div>
    );
  }
};

export default injectIntl(ContactList);

// ContactList: component for showing a list of contacts,
// such as a list of group members in a group chat.
import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';

import { Drafty } from 'tinode-sdk';
import Tinode from 'tinode-sdk';

import Contact from './contact.jsx';
import ContactAction from './contact-action.jsx';

import { makeImageDataUrl } from '../lib/blob-helpers.js';

import { MESSAGE_PREVIEW_LENGTH } from '../config.js';

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
    const { formatMessage } = this.props.intl;
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
          const key = this.props.showMode ? c.user : (c.topic || c.user);
          // If filter function is provided, filter out the items
          // which don't satisfy the condition.
          if (this.props.filterFunc && this.props.filter) {
            const filterOn = [key];
            if (c.private && c.private.comment) {
              filterOn.push(('' + c.private.comment).toLowerCase());
            }
            if (c.public && c.public.fn) {
              filterOn.push(('' + c.public.fn).toLowerCase());
            }
            if (!this.props.filterFunc(this.props.filter, filterOn)) {
              return;
            }
          }

          const isChannel = Tinode.isChannelTopicName(key);
          const selected = showCheckmark ?
            (this.props.topicSelected.indexOf(key) > -1) :
            (this.props.topicSelected === key);
          const badges = [];
          if (this.props.showMode) {
            if (key == this.props.myUserId) {
              badges.push({name: formatMessage(messages.badge_you), color: 'green'});
            }
            if (c.acs && c.acs.isOwner()) {
              badges.push({name: formatMessage(messages.badge_owner), color: 'blue'});
            }
          }

          const comment = Array.isArray(c.private) ?
            c.private.join(',') : (c.private ? c.private.comment : null);
          let preview;
          let deliveryStatus;
          if (!this.props.showMode && c.latestMessage) {
            const msg = c.latestMessage(true);
            if (msg) {
              deliveryStatus = msg._status || c.msgStatus(msg, true);
              preview = typeof msg.content == 'string' ?
                msg.content.substr(0, MESSAGE_PREVIEW_LENGTH) :
                Drafty.preview(msg.content, MESSAGE_PREVIEW_LENGTH);
            }
          }
          contactNodes.push(
            <Contact
              title={c.public ? c.public.fn : null}
              avatar={makeImageDataUrl(c.public ? c.public.photo : null)}
              comment={comment}
              preview={preview}
              received={deliveryStatus}
              unread={this.props.showUnread ? c.unread : 0}
              now={c.online && this.props.connected}
              acs={c.acs}
              showMode={this.props.showMode}
              badges={badges}
              showCheckmark={showCheckmark}
              selected={selected}
              showOnline={this.props.showOnline && !isChannel}
              isChannel={isChannel}
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

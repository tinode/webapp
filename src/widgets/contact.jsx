// A single topic or user.
import React from 'react';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';

import { Tinode } from 'tinode-sdk';

import ContactBadges from './contact-badges.jsx';
import LetterTile from './letter-tile.jsx';
import UnreadBadge from './unread-badge.jsx';

import { Drafty } from 'tinode-sdk';

import { previewFormatter } from '../lib/formatters.js';
import { deliveryMarker } from '../lib/utils.js';

const messages = defineMessages({
  self_topic_name: {
    id: 'self_topic_name',
    defaultMessage: 'Saved messages',
    description: 'Name of self topic for UI'
  },
  self_topic_comment: {
    id: 'self_topic_comment',
    defaultMessage: 'Notes, messages, links, files saved for posterity',
    description: 'Comment for self topic for UI'
  }
});

class Contact extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleContextClick = this.handleContextClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (this.props.onSelected) {
      // Index this.props.index is used by GroupManager.
      this.props.onSelected(this.props.item, this.props.index);
    }
  }

  handleContextClick(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.showContextMenu({ topicName: this.props.item, y: e.pageY, x: e.pageX });
  }

  render() {
    let title = this.props.title;
    const self = Tinode.isSelfTopicName(this.props.item);
    if (!title) {
      if (self) {
        title = this.props.intl.formatMessage(messages.self_topic_name);
      } else {
        title = <i><FormattedMessage id="unnamed_topic" defaultMessage="Unnamed"
          description="Title shown when the topic has no name" /></i>;
      }
    } else if (title.length > 30) {
      // FIXME: this is probably wrong for RTL languages.
      title = title.substring(0, 28) + '…';
    }
    const online = this.props.now ? 'online' : 'offline';
    const avatar = this.props.avatar ? this.props.avatar : true;
    const badges = this.props.badges ? this.props.badges.slice() : [];
    const icon_badges = [];
    if (this.props.isVerified) {
      icon_badges.push({icon: 'verified', color: 'verified-color'});
    }
    if (this.props.isStaff) {
      icon_badges.push({icon: 'staff', color: 'staff-color'});
    }
    if (this.props.isDangerous) {
      icon_badges.push({icon: 'dangerous', color: 'danger-color'});
    }
    if (this.props.acs) {
      if (this.props.showMode) {
        badges.push({name: this.props.acs.getMode(), key: 'mode'});
      }
      if (this.props.acs.isMuted()) {
        icon_badges.push({icon: 'muted'});
      }
      if (!this.props.acs.isJoiner()) {
        icon_badges.push({icon: 'banned'});
      }
    }

    // The this.props.preview contains alreay shortened Drafty or string.
    let preview;
    if (typeof this.props.preview == 'string') {
      preview = this.props.preview;
    } else if (Drafty.isValid(this.props.preview)) {
      preview = React.createElement(React.Fragment, null, Drafty.format(this.props.preview, previewFormatter,
        {formatMessage: this.props.intl.formatMessage, previewIsResponse: this.props.previewIsResponse}));
    } else if (this.props.preview) {
      preview =
        <><i className="material-icons gray">warning_amber</i> <i className="gray">
          <FormattedMessage id="invalid_content"
            defaultMessage="invalid content" description="Shown when the message is unreadable" /></i>
        </>;
    }

    const icon = deliveryMarker(this.props.received);
    const marker = icon ? <i className={'material-icons small space-right' +
      (icon.color ? ' ' + icon.color : '')}>{icon.name}</i> : null;
    const titleClass = 'contact-title' + (this.props.deleted ? ' deleted' : '');

    const comment = preview || this.props.comment ||
      (self ? this.props.intl.formatMessage(messages.self_topic_comment) : '\u00A0');
    return (
      <li className={!this.props.showCheckmark && this.props.selected ? 'selected' : null} onClick={this.handleClick}>
        <div className="avatar-box">
          <LetterTile
            tinode={this.props.tinode}
            avatar={avatar}
            title={this.props.title}
            topic={this.props.item}
            deleted={this.props.deleted} />
          {this.props.deleted ? <i className="deleted material-icons">cancel</i> :
            (!self && this.props.showOnline) ? <span className={online} /> :
            (this.props.showCheckmark && this.props.selected) ?
            <i className="checkmark material-icons">check_circle</i>
            : null}
        </div>
        <div className="text-box">
          <div><span className={titleClass}>{title}</span>
            {this.props.isGroup ? <i className="material-icons as-badge">group</i> : null}
            {this.props.isChannel ? <img src="/img/channel.png" className="channel" alt="channel" /> : null}
            {!self ? <ContactBadges badges={icon_badges} /> : null}
            {!this.props.deleted ? <UnreadBadge count={this.props.unread} /> : null}
          </div>
          {this.props.showMode ?
            <span><ContactBadges badges={badges} /></span> :
            this.props.small ? null : <div className="contact-comment">{marker}<span>{comment}</span></div>}
        </div>
        {this.props.showContextMenu ?
          <span className="menuTrigger">
            <a href="#" onClick={this.handleContextClick}>
              <i className="material-icons">expand_more</i>
            </a>
          </span> : null}
      </li>
    );
  }
};

export default injectIntl(Contact);

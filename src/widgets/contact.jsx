// A single topic or user.
import React from 'react';
import { FormattedMessage } from 'react-intl';

import ContactBadges from './contact-badges.jsx';
import LetterTile from './letter-tile.jsx';
import ReceivedMarker from './received-marker.jsx'
import UnreadBadge from './unread-badge.jsx';

import { Drafty } from 'tinode-sdk';

import { deliveryMarker } from '../lib/utils.js';

export default class Contact extends React.Component {
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
    if (!title) {
      title = <i><FormattedMessage id="unnamed_topic" defaultMessage="Unnamed"
        description="Title shown when the topic has no name" /></i>;
    } else if (title.length > 30) {
      // FIXME: this is probably wrong for RTL languages.
      title = title.substring(0, 28) + '…';
    }
    const online = this.props.now ? 'online' : 'offline';
    const avatar = this.props.avatar ? this.props.avatar : true;
    const badges = this.props.badges ? this.props.badges.slice() : [];
    const icon_badges = [];
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

    const subtitle = this.props.preview ?
      (typeof this.props.preview == 'string' ? this.props.preview :
        React.createElement(React.Fragment, null, Drafty.format(this.props.preview, draftyFormatter, this))) :
      this.props.comment;

    const icon = deliveryMarker(this.props.received);
    const marker = icon ? <i className={'material-icons small space-right ' + icon.color}>{icon.name}</i> : null;

    return (
      <li className={!this.props.showCheckmark && this.props.selected ? 'selected' : null} onClick={this.handleClick}>
        <div className="avatar-box">
          <LetterTile
            avatar={avatar}
            title={this.props.title}
            topic={this.props.item} />
          {this.props.showOnline ? <span className={online} /> :
            (this.props.showCheckmark && this.props.selected ?
            <i className="checkmark material-icons">check_circle</i>
            : null)}
        </div>
        <div className="text-box">
          <div><span className="contact-title">{title}</span>
            {this.props.isChannel ? <img src="/img/channel.png" className="channel" alt="channel" /> : null}
            <UnreadBadge count={this.props.unread} /><ContactBadges badges={icon_badges} />
          </div>
          <div className="contact-comment">{marker}{subtitle || '\u00A0'}</div>
          <span><ContactBadges badges={badges} /></span>
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


// Converts Drafty object into a one-line preview.
function draftyFormatter(style, data, values, key) {
  let el = Drafty.tagName(style);
  const attr = { key: key };
  if (el) {
    switch (style) {
      case 'BR':
        // Replace new line with a space.
        el = React.Fragment;
        values = [' '];
        break;
      case 'HL':
        // Make highlight less prominent in preview.
        attr.className = 'highlight preview';
        break;
      case 'LN':
        // Disable links in previews.
        el = 'span';
        break;
      case 'IM':
        // Replace image with '[icon] Image'.
        el = React.Fragment;
        values = [<i key="im" className="material-icons">photo</i>, 'Picture'];
        break;
      case 'BN':
        el = 'span';
        attr.className = 'flat-button faux';
        break;
      case 'FM':
        el = React.Fragment;
        values = [<i key="fm" className="material-icons">dashboard</i>, 'Form: '].concat(values || []);
        break;
      case 'RW':
        el = React.Fragment;
        break;
      case 'EX':
        el = React.Fragment;
        values = [<i key="ex" className="material-icons">attachment</i>, 'Attachment'];
        break;
      default:
        if (el == '_UNKN') {
          el = React.Fragment;
          values = [<i key="unkn" className="material-icons">extension</i>];
        }
        break;
    }
    return React.createElement(el, attr, values);
  } else {
    return values;
  }
};

// A single topic or user.
import React from 'react';
import { FormattedMessage } from 'react-intl';

import LetterTile from './letter-tile.jsx';
import UnreadBadge from './unread-badge.jsx';

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
      this.props.onSelected(this.props.item, this.props.index, this.props.now, this.props.acs);
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
      title = <i><FormattedMessage id="unnamed_topic" /></i>;
    } else if (title.length > 30) {
      // FIXME: this is probably wrong for RTL languages.
      title = title.substring(0, 28) + '...';
    }
    let online = this.props.now ? 'online' : 'offline';
    let avatar = this.props.avatar ? this.props.avatar : true;
    let badges = [];
    if (this.props.badges && this.props.badges.length > 0) {
      let count = 0;
      this.props.badges.map(function(b) {
        let style = 'badge' + (b.color ? ' ' + b.color : '');
        badges.push(<span className={style} key={count}>{b.name}</span>);
        count ++;
      });
    }
    if (this.props.showMode && this.props.acs) {
      badges.push(<span className="badge" key="mode">{this.props.acs.getMode()}</span>);
    }

    return (
      <li className={!this.props.showCheckmark && this.props.selected ? "selected" : null}
        onClick={this.handleClick}>
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
          {this.props.unread > 0 ? <UnreadBadge count={this.props.unread} /> : null}
          </div>
          {this.props.comment ? <div className="contact-comment">{this.props.comment}</div> : null}
          <span>{badges}</span>
        </div>
        {this.props.showContextMenu ?
          <span className="menuTrigger">
            <a href="javascript:;" onClick={this.handleContextClick}>
              <i className="material-icons">expand_more</i>
            </a>
          </span> : null}
        </li>
    );
  }
};

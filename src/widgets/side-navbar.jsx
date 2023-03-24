import React from 'react';

import LetterTile from './letter-tile.jsx';
import ButtonBack from './button-back.jsx';
import ContactBadges from './contact-badges.jsx';
import MenuContacts from './menu-contacts.jsx';
import MenuStart from './menu-start.jsx';

import { sanitizeUrlForMime } from '../lib/utils.js';

export default class SideNavbar extends React.PureComponent {
  render() {
    const icon_badges = [];
    if (this.props.trustedBadges) {
      this.props.trustedBadges.forEach(b => {
        icon_badges.push({icon: b, color: 'badge-inv'});
      });
    }
    let avatar = null;
    if (this.props.tinode) {
      avatar = this.props.tinode.authorizeURL(sanitizeUrlForMime(this.props.avatar, 'image'));
    }
    return (
      <div id="side-caption-panel" className="caption-panel">
        {this.props.onCancel ? <ButtonBack onBack={this.props.onCancel} /> : null}
        {avatar ?
          <div id="self-avatar" className="avatar-box">
            <LetterTile
              tinode={this.props.tinode}
              avatar={avatar}
              topic={this.props.myUserId}
              title={this.props.title} />
          </div>
          :
          null}
        <div id="sidepanel-title" className="panel-title">{this.props.title}<ContactBadges badges={icon_badges}/></div>
        {this.props.state === 'login' ?
            <MenuStart onSignUp={this.props.onSignUp} onSettings={this.props.onSettings} /> :
          this.props.state === 'contacts' ?
            <MenuContacts onNewTopic={this.props.onNewTopic} onSettings={this.props.onSettings} /> :
          null}
      </div>
    );
  }
};

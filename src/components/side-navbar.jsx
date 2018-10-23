import React from 'react';

import LetterTile from './letter-tile.jsx';
import MenuCancel from './menu-cancel.jsx';
import MenuContacts from './menu-contacts.jsx';
import MenuStart from './menu-start.jsx';

export default class SideNavbar extends React.PureComponent {
  render() {
    return (
        <div id="side-caption-panel" className="caption-panel">
          <div id="self-avatar" className="avatar-box">
            <LetterTile
              avatar={this.props.avatar}
              topic={this.props.myUserId}
              title={this.props.title} />
          </div>
          <div id="sidepanel-title" className="panel-title">{this.props.title}</div>
          {this.props.state === 'login' ?
              <MenuStart onSignUp={this.props.onSignUp} onSettings={this.props.onSettings} /> :
            this.props.state === 'contacts' ?
              <MenuContacts onNewTopic={this.props.onNewTopic} onSettings={this.props.onSettings} /> :
            null}
          {this.props.onCancel ?
             <MenuCancel onCancel={this.props.onCancel} /> : null}
        </div>
    );
  }
};

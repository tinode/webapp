import React from 'react';

import LetterTile from './letter-tile.jsx';
import ButtonBack from './button-back.jsx';
import MenuContacts from './menu-contacts.jsx';
import MenuStart from './menu-start.jsx';

export default class SideNavbar extends React.PureComponent {
  render() {
    return (
        <div id="side-caption-panel" className="caption-panel">
          {this.props.onCancel ? <ButtonBack onBack={this.props.onCancel} /> : null}
          {this.props.avatar ?
            <div id="self-avatar" className="avatar-box">
              <LetterTile
                avatar={this.props.avatar}
                topic={this.props.myUserId}
                title={this.props.title} />
            </div>
            :
            null}
          <div id="sidepanel-title" className="panel-title">{this.props.title}</div>
          {this.props.state === 'login' ?
              <MenuStart onSignUp={this.props.onSignUp} onSettings={this.props.onSettings} /> :
            this.props.state === 'contacts' ?
              <MenuContacts onNewTopic={this.props.onNewTopic} onSettings={this.props.onSettings} /> :
            null}
        </div>
    );
  }
};

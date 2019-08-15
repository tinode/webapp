import React from 'react';

export default class MenuContacts extends React.PureComponent {
  render() {
    return (
      <div>
        <a href="#" onClick={(e) => {e.preventDefault(); this.props.onNewTopic();}}><i className="material-icons">chat</i></a>
        &nbsp;
        <a href="#" onClick={(e) => {e.preventDefault(); this.props.onSettings();}}><i className="material-icons">settings</i></a>
      </div>
    );
  }
};

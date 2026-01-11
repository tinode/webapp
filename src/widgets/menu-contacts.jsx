import React from 'react';

export default class MenuContacts extends React.PureComponent {
  render() {
    return (
      <div>
        <a href="#" onClick={(e) => {e.preventDefault(); this.props.onNewTopic();}}><i className="m-icon">chat</i></a>
        &nbsp;
        <a href="#" onClick={(e) => {e.preventDefault(); this.props.onSettings();}}><i className="m-icon">settings</i></a>
      </div>
    );
  }
};

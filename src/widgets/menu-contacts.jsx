import React from 'react';

export default class MenuContacts extends React.PureComponent {
  render() {
    return (
      <div>
        <a href="javascript:;" onClick={this.props.onNewTopic}><i className="material-icons">chat</i></a>
        &nbsp;
        <a href="javascript:;" onClick={this.props.onSettings}><i className="material-icons">settings</i></a>
      </div>
    );
  }
};

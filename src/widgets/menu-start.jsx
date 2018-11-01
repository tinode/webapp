import React from 'react';

export default class MenuStart extends React.PureComponent {
  render() {
    return (
        <div>
          <a href="javascript:;" onClick={this.props.onSignUp}><i className="material-icons">person_add</i></a>
          &nbsp;
          <a href="javascript:;" onClick={this.props.onSettings}><i className="material-icons">settings</i></a>
        </div>
    );
  }
};

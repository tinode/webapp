import React from 'react';

export default class MenuStart extends React.PureComponent {
  render() {
    return (
        <div>
          <a href="#" onClick={(e) => {e.preventDefault(); this.props.onSignUp();}}><i className="m-icon">person_add</i></a>
          &nbsp;
          <a href="#" onClick={(e) => {e.preventDefault(); this.props.onSettings();}}><i className="m-icon">settings</i></a>
        </div>
    );
  }
};

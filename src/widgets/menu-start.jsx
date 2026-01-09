import React from 'react';

export default class MenuStart extends React.PureComponent {
  render() {
    return (
        <div>
          <a href="#" onClick={(e) => {e.preventDefault(); this.props.onSignUp();}}><i className="material-symbols-outlined">person_add</i></a>
          &nbsp;
          <a href="#" onClick={(e) => {e.preventDefault(); this.props.onSettings();}}><i className="material-symbols-outlined">settings</i></a>
        </div>
    );
  }
};

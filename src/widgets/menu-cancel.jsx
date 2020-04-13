// The X menu to be displayed in title bars.
import React from 'react';

export default class MenuCancel extends React.PureComponent {
  render() {
    return (
      <a href="#" onClick={(e) => {e.preventDefault(); this.props.onCancel();}}>
        <i className="material-icons">close</i>
      </a>
    );
  }
}

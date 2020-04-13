// The <- button to be displayed in title bars.
import React from 'react';

export default class ButtonBack extends React.PureComponent {
  render() {
    return (
      <a href="#" onClick={(e) => {e.preventDefault(); this.props.onBack();}}>
        <i className="material-icons">arrow_back</i>
      </a>
    );
  }
}

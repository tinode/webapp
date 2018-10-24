import React from 'react';

export default class LoadSpinner extends React.PureComponent {
  render() {
    return (this.props.show ?
      <div className="load-spinner-box"><div className="loader-spinner"></div></div> : null);
  }
}

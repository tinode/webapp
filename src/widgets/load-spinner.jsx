import React from 'react';

export default class LoadSpinner extends React.PureComponent {
  render() {
    const className = 'load-spinner-box' + (this.props.large ? ' large' : '')
      + (this.props.clear ? ' clear' : '') + (this.props.centered ? ' centered' : '');
    return (this.props.show ?
      <div className={className}><div className="loader-spinner"></div></div> : null);
  }
}

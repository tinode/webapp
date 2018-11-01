import React from 'react';

import MenuCancel from './menu-cancel.jsx';

export default class ErrorPanel extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
    };

    this.hide = this.hide.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      show: !(!nextProps.level)
    };
  }

  hide() {
    this.setState({show: false});
    if (this.props.onClearError) {
      this.props.onClearError();
    }
  }

  render() {
    const icons = {err: 'error', warn: 'warning', info: 'info'}
    const level = icons[this.props.level] || '';
    const className = 'alert-box ' + level;
    return (
      <div className={className}>
        <div className="icon"><i className="material-icons">{level}</i></div>
        <span dangerouslySetInnerHTML={{__html: this.props.text}} />
        <div className="cancel"><MenuCancel onCancel={this.hide} /></div>
      </div>
    );
  }
};

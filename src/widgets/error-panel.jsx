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
    var icon = this.props.level == 'err' ? 'error': 'warning';
    return (
      <div className={this.state.show ?
        (this.props.level == 'err' ? 'alert-box error' : 'alert-box warning') :
        "alert-box"}>
        <div className="icon"><i className="material-icons">{icon}</i></div>
        {this.props.text}
        <div className="cancel"><MenuCancel onCancel={this.hide} /></div>
      </div>
    );
  }
};

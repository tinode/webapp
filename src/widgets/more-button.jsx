// Toggle [Title text >] -> [Title text v]

import React from 'react';

export default class MoreButton extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      open: props.open
    };
    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle() {
    const open = !this.state.open;
    this.setState({open: open});
    if (this.props.onToggle) {
      this.props.onToggle(open);
    }
  }

  render() {
    return (<label className="small clean-clickable" onClick={this.handleToggle}>{this.props.title}...
      {this.state.open ? <i className="material-icons">expand_more</i> :
        <i className="material-icons">chevron_right</i>}
      </label>);
  }
}

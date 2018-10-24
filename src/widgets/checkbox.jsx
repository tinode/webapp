import React from 'react';

/* BEGIN CheckBox: styled checkbox */
export default class CheckBox extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.props.onChange(this.props.name, !this.props.checked);
  }

  render() {
    return (
      this.props.onChange ? (
        this.props.checked ?
          <i className="material-icons blue clickable" onClick={this.handleChange}>check_box</i> :
          <i className="material-icons blue clickable" onClick={this.handleChange}>check_box_outline_blank</i>
        ) : (
          this.props.checked ?
            <i className="material-icons">check_box</i> :
            <i className="material-icons">check_box_outline_blank</i>
        )
    );
  }
}
/* END CheckBox */

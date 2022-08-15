import React from 'react';

/* CheckBox: styled three-state checkbox, either clickable or static */
export default class CheckBox extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.props.onChange(this.props.name, !this.props.checked);
  }

  render() {
    let classList = ['material-icons'];
    let iconName;
    if (Array.isArray(this.props.className)) {
      classList.push(...this.props.className);
    } else if (this.props.className) {
      classList.push(this.props.className);
    }
    if (this.props.onChange) {
      if (this.props.checked) {
        classList.push('blue', 'clickable');
        iconName = 'check_box';
      } else if (this.props.checked === false) {
        classList.push('blue', 'clickable');
        iconName = 'check_box_outline_blank';
      } else {
        classList.push('lt-blue');
        iconName = 'indeterminate_check_box';
      }
    } else {
        if (this.props.checked) {
          iconName = 'check_box';
        } else {
          iconName = 'check_box_outline_blank';
        }
    }
    let attrs = {
      className: classList.join(' '),
      id: this.props.id,
    };
    if (this.props.onChange) {
      attrs.onClick = this.handleChange;
    }
    return React.createElement('i', attrs, iconName);
  }
}

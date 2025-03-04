// Password with a visiblity toggle.
import React from 'react';

export default class VisiblePassword extends React.PureComponent {
  constructor(props) {
    super(props);

    this.inputRef = React.createRef();

    this.state = {
      value: this.props.value || '',
      visible: false
    };

    this.handleVisibility = this.handleVisibility.bind(this);
    this.handeTextChange = this.handeTextChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleEditingFinished = this.handleEditingFinished.bind(this);
  }

  componentDidMount() {
    if (this.props.autoFocus) {
      this.inputRef.current.focus();
    }
  }

  handeTextChange(e) {
    this.setState({value: e.target.value});
    if (this.props.onChange) {
      this.props.onChange(e);
    }
  }

  handleVisibility(e) {
    e.preventDefault();
    this.setState({visible: !this.state.visible});
  }

  handleKeyDown(e) {
    if (e.keyCode == 27) {
      // Escape pressed
      this.setState({value: this.props.value || '', visible: false});
      if (this.props.onFinished) {
        this.props.onFinished();
      }
    } else if (e.keyCode == 13) {
      // Enter pressed
      this.handleEditingFinished();
    }
  }

  handleEditingFinished(e) {
    if (e) {
      let currentTarget = e.currentTarget;
      setTimeout(_ => {
        if (!currentTarget.contains(document.activeElement)) {
          if (this.props.onFinished) {
            this.props.onFinished(this.state.value);
          }
        }
      }, 0);
    } else if (this.props.onFinished) {
      this.props.onFinished(this.state.value.trim());
    }
  }

  render() {
    return (
      <div tabIndex="-1" className="group-focus" onBlur={this.handleEditingFinished}>
        <input className="with-icon-right"
          type={this.state.visible ? 'text' : 'password'}
          value={this.state.value}
          placeholder={this.props.placeholder}
          maxLength={32}
          required={this.props.required ? 'required' : ''}
          autoFocus={this.props.autoFocus ? 'autoFocus' : ''}
          autoComplete={this.props.autoComplete}
          onChange={this.handeTextChange}
          onKeyDown={this.handleKeyDown}
          ref={this.inputRef} />
        <span onClick={this.handleVisibility}>
          <i className="material-icons clickable light-gray">
            {this.state.visible ? 'visibility' : 'visibility_off'}
          </i>
        </span>
      </div>
    );
  }
}

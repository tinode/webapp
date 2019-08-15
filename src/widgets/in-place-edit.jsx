// In-place text editor. Shows text with an icon which toggles it into an input field.
import React from 'react';
import ReactDOM from 'react-dom';

import VisiblePassword from './visible-password.jsx';

export default class InPlaceEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: props.active,
      initialValue: props.value || '',
      value: props.value || ''
    };

    this.handeTextChange = this.handeTextChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleStartEditing = this.handleStartEditing.bind(this);
    this.handleEditingFinished = this.handleEditingFinished.bind(this);
    this.handlePasswordFinished = this.handlePasswordFinished.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    // If text has changed while in read mode, update text and discard changes.
    // Ignore update if in edit mode.
    const newValue = this.props.value || '';
    if (prevState.initialValue != newValue && !prevState.active) {
      this.setState({
        initialValue: newValue,
        value: newValue
      });
    }
  }

  handeTextChange(e) {
    this.setState({value: e.target.value});
  }

  handleKeyDown(e) {
    if (e.keyCode === 27) {
      // Escape pressed
      this.setState({value: this.props.value, active: false});
    } else if (e.keyCode === 13) {
      // Enter pressed
      this.handleEditingFinished(e);
    }
  }

  handleStartEditing() {
    if (!this.props.readOnly) {
      ReactDOM.findDOMNode(this).focus();
      this.setState({active: true});
    }
  }

  handleEditingFinished(event) {
    if (this.props.required && !event.target.checkValidity()) {
      // Empty input
      this.setState({value: this.props.value, active: false});
      return;
    }
    this.setState({active: false});
    let value = this.state.value.trim();
    if ((value || this.props.value) && (value !== this.props.value)) {
      this.props.onFinished(value);
    }
  }

  handlePasswordFinished(value) {
    this.setState({active: false});
    if (value && (value !== this.props.value)) {
      this.props.onFinished(value);
    }
  }

  render() {
    if (this.state.active) {
      var fieldType = this.props.type || 'text';
    } else {
      var spanText = this.props.type == 'password' ? '••••••••' : this.state.value;
      var spanClass = 'in-place-edit' +
        (this.props.readOnly ? ' disabled' : '');
      if (!spanText) {
        spanText = this.props.placeholder;
        spanClass += ' placeholder';
      }
      if (spanText.length > 20) {
        // FIXME: this is wrong for RTL languages.
        spanText = spanText.substring(0, 19) + '...';
      }
    }
    return (
      this.state.active ?
        (fieldType == 'password' ?
          <VisiblePassword
            value={this.state.value}
            placeholder={this.props.placeholder}
            required={this.props.required ? 'required' : ''}
            autoComplete={this.props.autoComplete}
            autoFocus={true}
            onFinished={this.handlePasswordFinished}/>
          :
          <input type={fieldType}
            value={this.state.value}
            placeholder={this.props.placeholder}
            required={this.props.required ? 'required' : ''}
            autoComplete={this.props.autoComplete}
            autoFocus
            onChange={this.handeTextChange}
            onKeyDown={this.handleKeyDown}
            onBlur={this.handleEditingFinished} />
        )
        :
        <span className={spanClass} onClick={this.handleStartEditing}>
          <span className="content">{spanText}</span>
        </span>
    );
  }
};

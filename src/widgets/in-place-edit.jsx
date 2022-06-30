// In-place text editor. Shows text with an icon which toggles it into an input field.
import React from 'react';

import VisiblePassword from './visible-password.jsx';

export default class InPlaceEdit extends React.Component {
  constructor(props) {
    super(props);

    this.selfRef = React.createRef();

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
    this.setState({value: e.target.value || ''});
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
      this.setState({active: true}, () => {
        if (this.selfRef.current) {
          this.selfRef.current.focus();
        }
      });
    }
  }

  handleEditingFinished(event) {
    const value = this.state.value.trim();
    if (this.props.required && (!event.target.checkValidity() || !value)) {
      // Empty input
      this.setState({value: this.props.value, active: false});
      return;
    }
    this.setState({active: false});
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
    if (!this.state.active) {
      let spanText = this.props.type == 'password' ? '••••••••' : this.state.value;
      let spanClass = 'in-place-edit' + (this.props.readOnly ? ' disabled' : '');
      if (!spanText) {
        spanText = this.props.placeholder;
        spanClass += ' placeholder';
      }
      if (!this.props.multiline || this.props.multiline == 1) {
        spanClass += ' short';
      }

      return (<span className={spanClass} onClick={this.handleStartEditing}>
        <span>{spanText}</span>
      </span>);
    }

    let element;
    const attr = {};
    if (this.props.type == 'password') {
      element = VisiblePassword;
      attr.onFinished = this.handlePasswordFinished;
    } else {
      if (this.props.multiline > 1) {
        element = 'textarea';
        attr.rows = this.props.multiline;
        attr.className = 'inplace-edit';
      } else {
        element = 'input';
        attr.type = this.props.type || 'text';
      }
      attr.value = this.state.value;
      attr.ref = this.selfRef;
      attr.onChange = this.handeTextChange;
      attr.onKeyDown = this.handleKeyDown;
      attr.onBlur = this.handleEditingFinished;
    }
    attr.placeholder = this.props.placeholder;
    attr.required = this.props.required ? 'required' : '';
    attr.autoComplete = this.props.autoComplete;
    attr.autoFocus = true;

    return React.createElement(element, attr, null);
  }
};

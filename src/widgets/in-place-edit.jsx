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
      value: props.value || '',
      valid: true
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
    if (this.props.validator) {
      Promise.resolve(this.props.validator(e.target.value))
        .then(valid => {
          this.setState({valid: valid});
        })
        .catch(err => {
          // If it's interrupted, then the err is undefined. Ignore it.
          if (err) {
            this.setState({valid: false});
          }
        });
    }
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
      this.setState({active: true}, _ => {
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
    if ((value || this.props.value) && (value !== this.props.value) && this.state.valid) {
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
        {this.props.iconLeft && <i className="material-icons light-gray">{this.props.iconLeft}</i>}
        <span>{spanText}</span>
        {this.props.iconRight && <i className="material-icons light-gray">{this.props.iconRight}</i>}
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
        attr.className = 'in-place-edit';
      } else {
        element = 'input';
        attr.type = this.props.type || 'text';
        attr.className = 'in-place-edit' + (this.props.iconLeft ? ' with-icon-left'
          : this.props.iconRight ?  ' with-icon-right' : '');
        if (this.props.maxLength) {
          attr.maxLength=this.props.maxLength;
        }
      }
      attr.value = this.state.value;
      attr.className += this.state.valid ? '' : ' invalid';
      attr.ref = this.selfRef;
      attr.onChange = this.handeTextChange;
      attr.onKeyDown = this.handleKeyDown;
      attr.onBlur = this.handleEditingFinished;
    }
    attr.placeholder = this.props.placeholder;
    attr.required = this.props.required ? 'required' : '';
    attr.autoComplete = this.props.autoComplete;
    attr.autoFocus = true;
    if (this.props.spellCheck !== undefined) {
      attr.spellCheck = this.props.spellCheck ? 'true' : 'false';
    }

    if (this.props.iconLeft || this.props.iconRight) {
      return (
        <>
          {this.props.iconLeft && <i className="material-icons light-gray">{this.props.iconLeft}</i>}
          {React.createElement(element, attr, null)}
          {this.props.iconRight && <i className="material-icons light-gray">{this.props.iconRight}</i>}
        </>
      );
    }
    return React.createElement(element, attr, null);
  }
};

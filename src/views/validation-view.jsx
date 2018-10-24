// ValidationView: panel for confirming credentials, like email or phone.
import React from 'react';

export default class ValidationView extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      code: props.credCode || ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({code: e.target.value});
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.handleSubmit(e);
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.code && this.state.code.trim()) {
      this.props.onSubmit(this.props.credMethod, this.state.code.trim());
    }
  }

  render() {
    var methods = {'email': 'email', 'tel': 'phone'};
    var method = methods[this.props.credMethod] || this.props.credMethod;
    return (
      <div className="panel-form">
        <div className="panel-form-row">
          <label className="small" htmlFor="enter-confirmation-code">
            Enter confirmation code sent to you by {method}:
          </label>
        </div>
        <div className="panel-form-row">
        <input type="text" id="enter-confirmation-code" placeholder="Numbers only"
          value={this.state.code} onChange={this.handleChange}
          onKeyPress={this.handleKeyPress} required />
        </div>
        <div className="dialog-buttons">
          <button className="blue" onClick={this.handleSubmit}>Confirm</button>
        </div>
      </div>
    );
  }
};

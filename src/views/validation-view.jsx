// ValidationView: panel for confirming credentials, like email or phone.
import React from 'react';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';

const messages = defineMessages({
  phone: {
    id: 'phone_dative',
    defaultMessage: 'phone',
    description: "Dative case of 'phone', i.e. 'phone' in 'by phone'",
  },
  email: {
    id: 'email_dative',
    defaultMessage: 'email',
    description: "Dative case of 'email', i.e. 'email' in 'by email'",
  }
});

class ValidationView extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      code: props.credCode || ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleChange(e) {
    this.setState({code: e.target.value});
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.handleSubmit(e);
    } else if (e.key == 'Escape') {
      this.handleCancel(e);
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.code && this.state.code.trim()) {
      this.props.onSubmit(this.props.credMethod, this.state.code.trim());
    }
  }

  handleCancel(e) {
    e.preventDefault();
    this.props.onCancel();
  }


  render() {
    const { formatMessage } = this.props.intl;
    const methods = {'email': formatMessage(messages.email), 'tel': formatMessage(messages.phone)};
    let method = methods[this.props.credMethod] || this.props.credMethod;
    return (
      <div className="panel-form">
        <div className="panel-form-row">
          <label className="small" htmlFor="enter-confirmation-code">
            <FormattedMessage id="enter_confirmation_code_prompt"
              defaultMessage="Enter confirmation code sent to you by {method}:"
              description="Request to enter confirmation code"
              values={{method: method}} />
          </label>
        </div>
        <div className="panel-form-row">
        <FormattedMessage id="numeric_confirmation_code_prompt"
          defaultMessage="Numbers only" description="Prompt for numeric conformation code">{
          (numbers_only) => <input type="text" id="enter-confirmation-code"
            placeholder={numbers_only}
            value={this.state.code} onChange={this.handleChange}
            onKeyPress={this.handleKeyPress} required />
        }</FormattedMessage>
        </div>
        <div className="dialog-buttons">
          <button className="primary" onClick={this.handleSubmit}>
            <FormattedMessage id="button_confirm" defaultMessage="Confirm" description="Button [Confirm]" />
          </button>
          <button className="secondary" onClick={this.handleCancel}>
            <FormattedMessage id="button_cancel" defaultMessage="Cancel" description="Button [Cancel]" />
          </button>
        </div>
      </div>
    );
  }
};

export default injectIntl(ValidationView);

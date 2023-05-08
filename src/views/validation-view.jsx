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
      code: props.credCode || '',
      codeReceived: props.credCode
    };

    this.handleCodeChange = this.handleCodeChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.credCode != prevState.codeReceived) {
      return {
        code: nextProps.credCode || '',
        codeReceived: nextProps.credCode
      };
    }

    return prevState;
  }

  componentDidMount() {
    // Submit code automatically if it's received from the parent.
    if (this.props.credCode) {
      this.props.onSubmit(this.props.credMethod, this.props.credCode, this.props.credToken);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // Submit code automatically if it's received from the parent.
    if (this.state.codeReceived && this.state.code && this.state.code != prevState.code) {
      this.props.onSubmit(this.props.credMethod, this.state.code, this.props.credToken);
    }
  }


  handleCodeChange(e) {
    this.setState({code: e.target.value.replace(/[^\d]/g, '')});
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
      this.props.onSubmit(this.props.credMethod, this.state.code.trim(), this.props.credToken);
    }
  }

  handleCancel(e) {
    e.preventDefault();
    this.props.onCancel();
  }

  render() {
    const { formatMessage } = this.props.intl;
    const methods = {'email': formatMessage(messages.email), 'tel': formatMessage(messages.phone)};
    const method = methods[this.props.credMethod] || this.props.credMethod;
    return (
      <div className="panel-form">
        <div className="panel-form-row">
          <label className="small gray" htmlFor="enter-confirmation-code">
            <FormattedMessage id="enter_confirmation_code_prompt"
              defaultMessage="Confirmation code"
              description="Request to enter confirmation code"
              values={{method: method}} />
          </label>
        </div>
        <div className="panel-form-row">
          <FormattedMessage id="numeric_confirmation_code_prompt"
            defaultMessage="Numbers only" description="Prompt for numeric conformation code">{
            (numbers_only) => <input type="text" id="enter-confirmation-code"
              placeholder={numbers_only}
              value={this.state.code} onChange={this.handleCodeChange}
              onKeyDown={this.handleKeyPress} required />
          }</FormattedMessage>
        </div>
        <div className="dialog-buttons">
          <button className="secondary" onClick={this.handleCancel}>
            <FormattedMessage id="button_cancel" defaultMessage="Cancel" description="Button [Cancel]" />
          </button>
          <button className="primary" onClick={this.handleSubmit}>
            <FormattedMessage id="button_confirm" defaultMessage="Confirm" description="Button [Confirm]" />
          </button>
        </div>
      </div>
    );
  }
};

export default injectIntl(ValidationView);

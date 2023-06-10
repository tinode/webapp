// A password reset form.
import React from 'react';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';

import PhoneEdit from '../widgets/phone-edit.jsx';
import VisiblePassword from '../widgets/visible-password.jsx';

import HashNavigation from '../lib/navigation.js';

const messages = defineMessages({
  password_reset_email_sent: {
    id: 'password_reset_email_sent',
    defaultMessage: 'An email with security code has been sent.',
    description: 'Notification that the email with password reset instructions has been sent'
  },
  password_reset_sms_sent: {
    id: 'password_reset_sms_sent',
    defaultMessage: 'A text message with security code has been sent.',
    description: 'Notification that the SMS with password reset instructions has been sent'
  }
});

class PasswordResetView extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      tel: '',
      email: '',
      password: '',
      sent: false,
      haveCode: false,
      code: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleCodeChange = this.handleCodeChange.bind(this);
    this.handleShowCodeField = this.handleShowCodeField.bind(this);

    // Connection will trigger change by changing the this.props.serverVersion.
    props.tinode.connect()
      .catch(err => {
        this.props.onError(err.message, 'err');
      });
  }

  componentDidMount() {
    const parsed = HashNavigation.parseUrlHash(window.location.hash);
    const newState = {
      token: parsed.params.token,
      scheme: parsed.params.scheme,
      code: parsed.params.code || ''
    }

    this.savedCred = parsed.params.cred;
    if (this.props.reqCredMethod && parsed.params.cred) {
      newState[this.props.reqCredMethod] = this.savedCred;
    }
    this.setState(newState);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.reqCredMethod != this.props.reqCredMethod && this.props.reqCredMethod) {
      this.setState({[this.props.reqCredMethod]: this.savedCred || ''});
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.token) {
      // Reset using token.
      this.props.onReset(this.state.password.trim(), {
        scheme: 'token',
        secret: this.state.token
      });
    } else if (this.state.code && this.props.reqCredMethod) {
      // Reset using security code.
      // The secret is structured as <code>:<cred_method>:<cred_value>, "123456:email:alice@example.com".
      const cred = this.props.reqCredMethod == 'email' ? this.state.email.trim() : this.state.tel.trim();
      this.props.onReset(this.state.password.trim(), {
        scheme: 'code',
        secret: btoa(`${this.state.code}:${this.props.reqCredMethod}:${cred}`)
      });
    } else {
      // Send email or SMS with the secret code.
      const email = this.state.email.trim();
      const tel = this.state.tel.trim();
      this.setState({email: email, tel: tel});
      this.props.onRequest(this.props.reqCredMethod, email || tel)
        .then(_ => {
          this.setState({sent: true});
          const msg = this.props.reqCredMethod == 'email' ? messages.password_reset_email_sent :
            this.props.reqCredMethod == 'tel' ? messages.password_reset_sms_sent : null;
          if (msg) {
            this.props.onError(this.props.intl.formatMessage(msg), 'info');
          }
        });
    }
  }

  handleEmailChange(e) {
    this.setState({email: e.target.value});
  }

  handlePasswordChange(e) {
    this.setState({password: e.target.value});
  }

  handleCodeChange(e) {
    this.setState({code: e.target.value.replace(/[^\d]/g, '')});
  }

  handleShowCodeField(e) {
    e.preventDefault();
    this.setState({haveCode: true});
  }

  render() {
    const showCredentialInput = !((this.state.token || (this.state.code && this.props.reqCredMethod)) && this.state.scheme);
    const showPasswordInput = !showCredentialInput || this.state.haveCode || this.state.sent;

    const passwordInput = (<>
        <label className="small gray" htmlFor="new-password">
          <FormattedMessage id="label_new_password"
            defaultMessage="New password"
            description="Label for entering a new password" />
        </label>
        <FormattedMessage id="new_password_placeholder" defaultMessage="Enter new password"
          description="Placeholder for entering new password">{
          (placeholder) => <VisiblePassword
            id="new-password"
            placeholder={placeholder}
            autoComplete="new-password"
            value={this.state.password}
            required={true} autoFocus={true}
            onChange={this.handlePasswordChange} />
        }</FormattedMessage>
      </>);

    const emailInput = (<>
        {this.state.haveCode ?
          null :
          <label htmlFor="inputEmail">
            <FormattedMessage id="label_reset_password"
              defaultMessage="Send a password reset email"
              description="Label for password reset field" />
          </label>
        }
        <FormattedMessage id="credential_email_prompt" defaultMessage="Your registration email"
          description="Placeholder for entering email">{
          (placeholder) => <input type="email" id="inputEmail"
            placeholder={placeholder}
            autoComplete="email"
            value={this.state.email}
            onChange={this.handleEmailChange}
            required autoFocus />
        }</FormattedMessage>
      </>);

    const phoneInput = (<>
        {this.state.haveCode ?
          null :
          <div><label>
            <FormattedMessage id="label_reset_password_tel"
              defaultMessage="Send SMS to reset password"
              description="Label for password reset field by phone" />
          </label></div>
        }
        <div>
          <label className="small gray">
            <FormattedMessage id="mobile_phone_number" defaultMessage="Mobile phone number"
              description="Prompt for entering a mobile phone number" />
          </label>
        </div>
        <div className="panel-form-row">
          <PhoneEdit
            autoFocus={true}
            onShowCountrySelector={this.props.onShowCountrySelector}
            onSubmit={number => this.setState({tel: number})} />
        </div>
      </>);

    const codeInput = (<>
        <div>
          <label className="small gray" htmlFor="enter-confirmation-code">
            <FormattedMessage id="enter_confirmation_code_prompt"
              defaultMessage="Confirmation code"
              description="Request to enter confirmation code" />
          </label>
        </div>
        <div>
          <FormattedMessage id="numeric_confirmation_code_prompt"
            defaultMessage="Numbers only" description="Prompt for numeric conformation code">{
            (numbers_only) => <input type="text" id="enter-confirmation-code"
              placeholder={numbers_only} maxLength={10}
              value={this.state.code} onChange={this.handleCodeChange} required />
          }</FormattedMessage>
        </div>
      </>);

    const credentialInput = this.props.reqCredMethod == 'email' ?
      emailInput : this.props.reqCredMethod == 'tel' ? phoneInput : null;

    return (
      <form id="password-reset-form" onSubmit={this.handleSubmit}>
        {!this.state.sent && showCredentialInput ? credentialInput : null}
        {this.state.haveCode || this.state.sent ? codeInput : null}
        {showPasswordInput ? passwordInput : null}
        <div className="dialog-buttons">
          {this.state.haveCode || this.state.sent || this.state.token || this.state.code ? null :
            <a href="#" onClick={this.handleShowCodeField} style={{marginRight: 'auto'}}>
              <FormattedMessage id="password_i_have_code" defaultMessage="I have code"
                description="Call to open field to enter password reset code" />
            </a>
          }
          <button className="primary" type="submit">{
            showPasswordInput ?
              <FormattedMessage id="button_reset" defaultMessage="Reset" description="Button [Reset]" />
            :
              <FormattedMessage id="button_send_request" defaultMessage="Send request"
                description="Button [Send request]" />
          }</button>
        </div>
      </form>
    );
  }
}

export default injectIntl(PasswordResetView);

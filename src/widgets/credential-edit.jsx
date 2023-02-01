// Enter one credential at a time.

import React from 'react';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import PhoneEdit from './phone-edit.jsx';
import { parsePhoneNumber } from 'libphonenumber-js/mobile';

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
  },
});

class CredentialEdit extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      code: '',
      tel: '',
      email: '',
      sent: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePhoneChange = this.handlePhoneChange.bind(this);
    this.handleCodeChange = this.handleCodeChange.bind(this);
  }

  static formatPhoneNumber(raw) {
    let number;
    try {
      number = parsePhoneNumber(raw);
    } catch (err) {}
    return number ? number.formatInternational() : raw;
  }

  handleEmailChange(e) {
    this.setState({email: e.target.value});
  }

  handlePhoneChange(number) {
    this.setState({tel: number});
  }

  handleCodeChange(e) {
    this.setState({code: e.target.value.replace(/[^\d]/g, '')});
  }

  handleSubmit(e) {
    e.preventDefault();
    const value = this.props.method == 'email' ? this.state.email : this.state.tel;
    if (value) {
      this.props.onSubmit(this.props.method, value);
      this.setState({sent: true});
      const msg = this.props.method == 'email' ? messages.password_reset_email_sent : messages.password_reset_sms_sent;
      this.props.onError(this.props.intl.formatMessage(msg), 'info');
    }
  }

  render() {
    const readyForCode = this.state.sent || !this.props.done;
    const currentValue = CredentialEdit.formatPhoneNumber(readyForCode ?
      (this.state.tel || this.state.email) : this.props.val);

    const currentEmail = (
      <><div className="panel-form-row">
        <label className="large"><FormattedMessage id="change_email" defaultMessage="Change email"
          description="Prompt to change current email" /></label>
      </div>
      <div className="group">
        <label className="small gray">
          <FormattedMessage id="current_email" defaultMessage="Current email" description="Label for old email" />
        </label>
      </div></>);

    const currentPhone = (
      <><div className="panel-form-row">
      <label className="large"><FormattedMessage id="change_phonel" defaultMessage="Change phone number"
        description="Prompt to change current phone number"/></label>
      </div>
      <div className="group">
        <label className="small gray">
          <FormattedMessage id="current_phone" defaultMessage="Current phone number" description="Label for old phone" />
        </label>
      </div></>
    );

    const newEmailInput = (
      <><div className="group">
        <label className="small gray"><FormattedMessage id="new_email" defaultMessage="New email"
          description="Prompt for entering a new email" /></label>
      </div>
      <div className="group">
        <FormattedMessage id="email_prompt" defaultMessage="Email, e.g. jdoe@example.com"
          description="Input placeholder for email entry">{
          (email_prompt) => <input type="email" placeholder={email_prompt} autoComplete="email"
            value={this.state.email} onChange={this.handleEmailChange} required/>
        }</FormattedMessage>
      </div></>
    );

    const newPhoneInput = (
      <><div className="group">
        <label className="small gray"><FormattedMessage id="new_phone_number" defaultMessage="New phone number"
          description="Prompt for entering a new telephone number" /></label>
      </div>
      <div className="panel-form-row">
        <PhoneEdit
          autoFocus={true}
          onShowCountrySelector={this.props.onShowCountrySelector}
          onSubmit={this.handlePhoneChange} />
      </div></>
    );

    const codeInput = (
      <><div className="group">
        <label className="small gray"><FormattedMessage id="enter_confirmation_code_prompt" defaultMessage="Confirmation code"
            description="Request to enter confirmation code" /></label>
      </div>
      <div className="group">
        <FormattedMessage id="numeric_confirmation_code_prompt" defaultMessage="Numbers only"
          description="Prompt for numeric conformation code">{
          (numbers_only) => <input type="text" placeholder={numbers_only} maxLength={10}
          value={this.state.code} onChange={this.handleCodeChange} required/>
        }</FormattedMessage>
      </div></>
    );

    return (<form className="panel-form-column" onSubmit={this.handleSubmit}>
      {readyForCode ? null :
      this.props.method == 'email' ?
        currentEmail
      : this.props.method == 'tel' ?
        currentPhone
      : null}
      <div className="panel-form-row">
        <tt className="quoted">{currentValue}</tt>
      </div>
      {readyForCode ? null :
      this.props.method == 'email' ?
        newEmailInput
      : this.props.method == 'tel' ?
        newPhoneInput
      : null}
      {readyForCode ? codeInput : null}
      <div className="dialog-buttons">
        <button className="secondary" onClick={this.props.onCancel}>
          <FormattedMessage id="button_cancel" defaultMessage="Cancel" description="Button [Cancel]" />
        </button>
        <button className="primary" type="submit" >
          <FormattedMessage id="button_ok" defaultMessage="OK" description="Button [OK]" />
        </button>
      </div>
    </form>);
  }
}

export default injectIntl(CredentialEdit);

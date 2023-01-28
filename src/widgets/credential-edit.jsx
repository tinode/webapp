// Enter one credential at a time.

import React from 'react';
import { FormattedMessage } from 'react-intl';
import PhoneEdit from './phone-edit.jsx';
import { parsePhoneNumber } from 'libphonenumber-js/mobile';

export default class CredentialEdit extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      tel: '',
      email: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePhoneChange = this.handlePhoneChange.bind(this);
  }

  formatPhoneNumber(raw) {
    const number = parsePhoneNumber(raw);
    return number ? number.formatInternational() : raw;
  }

  handleEmailChange(e) {
    this.setState({email: e.target.value});
  }

  handlePhoneChange(number) {
    console.log("handlePhoneChange", number);
    this.setState({tel: number});
  }

  handleSubmit(e) {
    e.preventDefault();
    const value = this.props.method == 'email' ? this.state.email : this.state.tel;
    console.log("handleSubmit", value);
    if (value) {
      this.props.onSubmit(value);
    }
  }

  render() {
    return (<form className="panel-form-column" onSubmit={this.handleSubmit}>
      {this.props.method == 'email' ?
        <><div className="panel-form-row">
          <label className="large"><FormattedMessage id="change_email" defaultMessage="Change email"
            description="Prompt to change current email" /></label>
        </div>
        <div className="group">
          <label className="small gray">
            <FormattedMessage id="current_email" defaultMessage="Current email" description="Label for old email" />
          </label>
        </div></>
      : this.props.method == 'tel' ?
      <><div className="panel-form-row">
        <label className="large"><FormattedMessage id="change_phonel" defaultMessage="Change phone number"
          description="Prompt to change current phone number"/></label>
        </div>
        <div className="group">
          <label className="small gray">
            <FormattedMessage id="current_phone" defaultMessage="Current phone number" description="Label for old phone" />
          </label>
        </div></>
      : null}
      <div className="panel-form-row">
        <tt className="quoted">{this.formatPhoneNumber(this.props.val)}</tt>
      </div>
      {this.props.method == 'email' ?
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
        : this.props.method == 'tel' ?
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
      : null}
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

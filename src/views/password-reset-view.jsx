// A password reset form.
import React, { Suspense } from 'react';
import { FormattedMessage } from 'react-intl';

const PhoneEdit = React.lazy(_ => import('../widgets/phone-edit.jsx'));
import VisiblePassword from '../widgets/visible-password.jsx';

import HashNavigation from '../lib/navigation.js';

export default class PasswordResetView extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      tel: '',
      email: '',
      password: '',
      sent: false,
      method: '',
      haveCode: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleShowCodeField = this.handleShowCodeField.bind(this);

    props.tinode.connect()
      .catch(err => {
        this.props.onError(err.message, 'err');
      })
      // "reqCred":{"auth":["email"]}
      .finally(_ => this.setState({method: (props.tinode.getServerParam('reqCred', {}).auth || [])[0] || 'email'}));
  }

  componentDidMount() {
    const parsed = HashNavigation.parseUrlHash(window.location.hash);
    this.setState({token: parsed.params.token, scheme: parsed.params.scheme});
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.token) {
      this.props.onReset(this.state.scheme, this.state.password.trim(), this.state.token);
    } else if (this.state.sent) {
      this.props.onCancel();
    } else {
      const email = this.state.email.trim();
      this.setState({email: email});
      this.props.onRequest('email', email).then(_ => this.setState({sent: true}));
    }
  }

  handleEmailChange(e) {
    this.setState({email: e.target.value});
  }

  handlePasswordChange(e) {
    this.setState({password: e.target.value});
  }

  handleShowCodeField(e) {
    e.preventDefault();
    this.setState({haveCode: true});
  }

  render() {
    const showPasswordInput = (this.state.token && this.state.scheme) || this.state.haveCode;
    const passwordInput = (<>
        <label htmlFor="new-password">
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
              defaultMessage="Send a password reset email:"
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
          <label>
            <FormattedMessage id="label_reset_password_tel"
              defaultMessage="Send a password reset SMS:"
              description="Label for password reset field by phone" />
          </label>
        }
        <label className="small gray">
          <FormattedMessage id="mobile_phone_number" defaultMessage="Mobile phone number"
            description="Prompt for entering a mobile phone number" />
        </label>
        <Suspense fallback={<div><FormattedMessage id="loading_note" defaultMessage="Loading..."
          description="Message shown when component is loading"/></div>}>
          <PhoneEdit
            autoFocus={false}
            onShowCountrySelector={(code, dial) => console.log('onShowCountrySelector', code, dial)}
            onSubmit={(code, dial) => console.log('onSubmit', code, dial)} />
        </Suspense>
      </>);

    return (
      <form id="password-reset-form" onSubmit={this.handleSubmit}>
        {showPasswordInput ?
          passwordInput
        : this.state.sent ?
          <>
            <br/>
            <center><i className="material-icons huge green">task_alt</i></center>
            <br/>
            <center>{
              this.state.method == 'email' ?
                <FormattedMessage id="password_reset_email_sent"
                  defaultMessage="An email with security code has been sent to {email}. Enter the code below."
                  values={{ email: <tt>{this.state.email}</tt> }}
                  description="Notification that the email with password reset instructions has been sent" />
              : this.state.method == 'tel' ?
                <FormattedMessage id="password_reset_sms_sent"
                  defaultMessage="A text message with security code has been sent to {phone}. Enter the code below."
                  values={{ email: <tt>{this.state.tel}</tt> }}
                  description="Notification that the SMS with password reset instructions has been sent" />
              :
              null
            }</center>
          </>
        : this.state.method == 'email' ? emailInput : this.state.method == 'tel' ? phoneInput : null
        }
        <div className="dialog-buttons">
          <button className="primary" type="submit">{
            (this.state.token && this.state.scheme) ?
            <FormattedMessage id="button_reset" defaultMessage="Reset" description="Button [Reset]" />
            : this.state.sent ?
            <FormattedMessage id="button_ok" defaultMessage="OK"
              description="Button [OK]" />
            :
            <FormattedMessage id="button_send_request" defaultMessage="Send request"
              description="Button [Send request]" />
          }</button>
        </div>
        {this.state.haveCode ? null :
          <div className="panel-form-row">
            <a href="#" onClick={this.handleShowCodeField}>
              <FormattedMessage id="password_i_have_code" defaultMessage="I have code"
                description="Call to open field to enter password reset code" />
            </a>
          </div>
        }
      </form>
    );
  }
}

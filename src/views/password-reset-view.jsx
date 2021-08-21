// A password reset form.
import React from 'react';
import { FormattedMessage } from 'react-intl';

import VisiblePassword from '../widgets/visible-password.jsx';

import HashNavigation from '../lib/navigation.js';

export default class PasswordResetView extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      sent: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
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
      this.props.onRequest('email', email).then(() => {
        this.setState({sent: true});
      });
    }
  }

  handleEmailChange(e) {
    this.setState({email: e.target.value});
  }

  handlePasswordChange(e) {
    this.setState({password: e.target.value});
  }

  render() {
    return (
      <form id="password-reset-form" onSubmit={this.handleSubmit}>
        {(this.state.token && this.state.scheme) ?
          <FormattedMessage id="new_password_placeholder" defaultMessage="Enter new password"
            description="Placeholder for entering new password">{
            (placeholder) => <VisiblePassword
              placeholder={placeholder}
              autoComplete="new-password"
              value={this.state.password}
              required={true} autoFocus={true}
              onChange={this.handlePasswordChange} />
          }</FormattedMessage>
        : this.state.sent ?
          <>
            <br/>
            <center><i className="material-icons huge green">task_alt</i></center>
            <br/>
            <center><FormattedMessage id="password_reset_email_sent"
              defaultMessage="An email has been sent to {email}. Follow the directions in the email to reset your password."
              values={{ email: <tt>{this.state.email}</tt> }}
              description="Notification that the email with password reset instructions has been sent" /></center>
          </>
        :
          <>
            <label htmlFor="inputEmail">
              <FormattedMessage id="label_reset_password"
                defaultMessage="Send a password reset email:"
                description="Label for password reset field" />
            </label>
            <FormattedMessage id="credential_email_prompt" defaultMessage="Your registration email"
              description="Placeholder for entering email">{
              (placeholder) => <input type="email" id="inputEmail"
                placeholder={placeholder}
                autoComplete="email"
                value={this.state.email}
                onChange={this.handleEmailChange}
                required autoFocus />
            }</FormattedMessage>
          </>
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
      </form>
    );
  }
}

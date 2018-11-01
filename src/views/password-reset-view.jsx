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
      password: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  componentDidMount() {
    let parsed = HashNavigation.parseUrlHash(window.location.hash);
    this.setState({token: parsed.params.token, scheme: parsed.params.scheme});
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.token) {
      this.props.onReset(this.state.scheme, this.state.password.trim(), this.state.token);
    } else {
      this.props.onRequest('email', this.state.email.trim());
    }
  }

  handleEmailChange(e) {
    this.setState({email: e.target.value});
  }

  handlePasswordChange(e) {
    this.setState({password: e.target.value});
  }

  render() {
    let reset = (this.state.token && this.state.scheme);
    return (
      <form id="password-reset-form" onSubmit={this.handleSubmit}>
        {reset ?
          <FormattedMessage id="new_password_placeholder" defaultMessage="Enter new password"
            description="Placeholder for entering new password">{
            (placeholder) => <VisiblePassword
              placeholder={placeholder}
              autoComplete="new-password"
              value={this.state.password}
              required={true} autoFocus={true}
              onChange={this.handlePasswordChange} />
          }</FormattedMessage>
          :
          <React.Fragment>
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
          </React.Fragment>
        }
        <div className="dialog-buttons">
          <button className="blue" type="submit">{reset ?
            <FormattedMessage id="button_reset" defaultMessage="Reset" description="Button [Reset]" /> :
            <FormattedMessage id="button_send_request" defaultMessage="Send request"
              description="Button [Send request]" />
          }</button>
        </div>
      </form>
    );
  }
}

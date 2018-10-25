/* A password reset form */
import React from 'react';

import VisiblePassword from '../widgets/visible-password.jsx';

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
    let parsed = parseUrlHash(window.location.hash);
    this.setState({token: parsed.params.token, scheme: parsed.params.scheme});
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.token) {
      this.props.onReset(this.state.scheme, this.state.password.trim(), this.state.token);
    } else {
      this.props.onRequest("email", this.state.email.trim());
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
          <VisiblePassword
            placeholder="Enter new password"
            autoComplete="new-password"
            value={this.state.password}
            required={true} autoFocus={true}
            onChange={this.handlePasswordChange} />
          :
          <React.Fragment>
            <label htmlFor="inputEmail">Send a password reset email:</label>
            <input type="email" id="inputEmail"
              placeholder="Your registration email"
              autoComplete="email"
              value={this.state.email}
              onChange={this.handleEmailChange}
              required autoFocus />
          </React.Fragment>
        }
        <div className="dialog-buttons">
          <button className="blue" type="submit">{reset ? "Reset" : "Send request"}</button>
        </div>
      </form>
    );
  }
}

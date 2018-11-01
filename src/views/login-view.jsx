// Login form.
import React from 'react';
import { FormattedMessage } from 'react-intl';

import CheckBox from '../widgets/checkbox.jsx';
import VisiblePassword from '../widgets/visible-password.jsx';

import LocalStorageUtil from '../lib/local-storage.js';

export default class LoginView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      login: props.login,
      password: '',
      hostName: props.serverAddress,
      saveToken: LocalStorageUtil.getObject('keep-logged-in')
    };
    this.handleLoginChange = this.handleLoginChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleToggleSaveToken = this.handleToggleSaveToken.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleLoginChange(e) {
    this.setState({login: e.target.value});
  }

  handlePasswordChange(e) {
    this.setState({password: e.target.value});
  }

  handleToggleSaveToken() {
    LocalStorageUtil.setObject('keep-logged-in', !this.state.saveToken);
    this.setState({saveToken: !this.state.saveToken});
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.onLogin(this.state.login.trim(), this.state.password.trim());
  }

  render() {
    var submitClasses = 'blue';
    if (this.props.disabled) {
      submitClasses += ' disabled';
    }

    return (
      <form id="login-form" onSubmit={this.handleSubmit}>
        <FormattedMessage id="login_prompt" defaultMessage="Login"
          description="Login placeholder in LoginView">
        {
          (login_prompt) => <input type="text" id="inputLogin"
            placeholder={login_prompt}
            autoComplete="username"
            value={this.state.login}
            onChange={this.handleLoginChange}
            required autoFocus />
        }
        </FormattedMessage>
        <FormattedMessage id="password_prompt" defaultMessage="Password"
          description="Password placeholder in LoginView">
        {
          (password_prompt) => <VisiblePassword type="password" id="inputPassword"
            placeholder={password_prompt}
            autoComplete="current-password"
            value={this.state.password}
            onChange={this.handlePasswordChange}
            required={true} />
        }
        </FormattedMessage>
        <div className="panel-form-row">
          <CheckBox id="save-token" name="save-token" checked={this.state.saveToken}
            onChange={this.handleToggleSaveToken} />
          <label htmlFor="save-token">&nbsp;
            <FormattedMessage id="stay_logged_in" defaultMessage="Stay logged in"
              description="Label for a checkbox" />
          </label>
          <a href="#reset">
            <FormattedMessage id="forgot_password_link" defaultMessage="Forgot password?"
              description="Link to Reset password form" />
          </a>
        </div>
        <div className="dialog-buttons">
          <button className={submitClasses} type="submit">
            <FormattedMessage id="button_sign_in" defaultMessage="Sign in"
              description="Button [Sign In]" />
          </button>
        </div>
      </form>
    );
  }
};
/* END Login */

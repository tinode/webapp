// Account registration.
import React from 'react';
import { FormattedMessage } from 'react-intl';

import AvatarUpload from '../widgets/avatar-upload.jsx';
import CheckBox from '../widgets/checkbox.jsx';
import VisiblePassword from '../widgets/visible-password.jsx';

import LocalStorageUtil from '../lib/local-storage.js';
import { vcard } from '../lib/utils.js';

export default class CreateAccountView extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      login: '',
      password: '',
      email: '',
      fn: '', // full/formatted name
      imageDataUrl: null,
      errorCleared: false,
      saveToken: LocalStorageUtil.getObject('keep-logged-in')
    };

    this.handleLoginChange = this.handleLoginChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleFnChange = this.handleFnChange.bind(this);
    this.handleImageChanged = this.handleImageChanged.bind(this);
    this.handleToggleSaveToken = this.handleToggleSaveToken.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleLoginChange(e) {
    this.setState({login: e.target.value});
  }

  handlePasswordChange(password) {
    this.setState({password: password});
  }

  handleEmailChange(e) {
    this.setState({email: e.target.value})
  }

  handleFnChange(e) {
    this.setState({fn: e.target.value});
  }

  handleImageChanged(img) {
    this.setState({imageDataUrl: img});
  }

  handleToggleSaveToken() {
    LocalStorageUtil.setObject('keep-logged-in', !this.state.saveToken);
    this.setState({saveToken: !this.state.saveToken});
  }

  handleSubmit(e) {
    e.preventDefault();
    // TODO: check email for validity
    this.setState({errorCleared: false});
    this.props.onCreateAccount(
      this.state.login.trim(),
      this.state.password.trim(),
      vcard(this.state.fn, this.state.imageDataUrl),
      {'meth': 'email', 'val': this.state.email});
  }

  render() {
    let submitClasses = 'blue';
    if (this.props.disabled) {
      submitClasses += ' disabled';
    }

    return (
      <form className="panel-form-column" onSubmit={this.handleSubmit}>
        <div className="panel-form-row">
          <div className="panel-form-column">
            <FormattedMessage id="login_prompt">{
              (login_prompt) => <input type="text" placeholder={login_prompt} autoComplete="user-name"
                value={this.state.login} onChange={this.handleLoginChange} required autoFocus />
            }</FormattedMessage>
            <FormattedMessage id="password_prompt">{
              (password_prompt) => <VisiblePassword placeholder={password_prompt} autoComplete="new-password"
                value={this.state.password} onFinished={this.handlePasswordChange}
                required={true} />
            }</FormattedMessage>
          </div>
          <AvatarUpload
            onImageChanged={this.handleImageChanged}
            onError={this.props.onError} />
        </div>
        <div  className="panel-form-row">
          <FormattedMessage id="full_name_prompt" defaultMessage="Full name, e.g. John Doe"
            description="Input placeholder for person's full name">{
            (full_name_prompt) => <input type="text" placeholder={full_name_prompt} autoComplete="name"
              value={this.state.fn} onChange={this.handleFnChange} required/>
          }</FormattedMessage>
        </div>
        <div className="panel-form-row">
          <FormattedMessage id="email_prompt" defaultMessage="Email, e.g. jdoe@example.com"
            description="Input placeholder for email entry">{
            (email_prompt) => <input type="email" placeholder={email_prompt} autoComplete="email"
              value={this.state.email} onChange={this.handleEmailChange} required/>
          }</FormattedMessage>
        </div>
        <div className="panel-form-row">
          <CheckBox id="save-token" name="save-token" checked={this.state.saveToken}
            onChange={this.handleToggleSaveToken} />
          <FormattedMessage id="stay_logged_in">{
            (stay_logged_in) => <label htmlFor="save-token">&nbsp;{stay_logged_in}</label>
          }</FormattedMessage>
        </div>
        <div className="dialog-buttons">
          <button className={submitClasses} type="submit">
            <FormattedMessage id="button_sign_up" defaultMessage="Sign up"
              description="Create account button [Sign Up]" />
          </button>
        </div>
      </form>
    );
  }
};

// Account registration.
import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import AvatarUpload from '../widgets/avatar-upload.jsx';
import CheckBox from '../widgets/checkbox.jsx';
import VisiblePassword from '../widgets/visible-password.jsx';

const messages = defineMessages({
  'email_prompt': {
    id: 'email_prompt',
    description: 'Input placeholder for email entry',
    defaultMessage: 'Email, e.g. jdoe@example.com'
  },
  'full_name_prompt': {
    id: 'full_name_prompt',
    description: 'Input placeholder for person\'s full name',
    defaultMessage: 'Full name, e.g. John Doe'
  }
});

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
      saveToken: localStorage.getObject('keep-logged-in')
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
    localStorage.setObject('keep-logged-in', !this.state.saveToken);
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
    const {formatMessage} = this.props.intl;
    return (
      <form className="panel-form-column" onSubmit={this.handleSubmit}>
        <div className="panel-form-row">
          <div className="panel-form-column">
            <input type="text" placeholder="{formatMessage({id: 'login_prompt'})}" autoComplete="user-name"
              value={this.state.login} onChange={this.handleLoginChange} required autoFocus />
            <VisiblePassword placeholder="{formatMessage({id: 'password_prompt'})}" autoComplete="new-password"
              value={this.state.password} onFinished={this.handlePasswordChange}
              required={true} />
          </div>
          <AvatarUpload
            onImageChanged={this.handleImageChanged}
            onError={this.props.onError} />
        </div>
        <div  className="panel-form-row">
          <input type="text" placeholder="{formatMessage(messages.full_name_prompt)}" autoComplete="name"
            value={this.state.fn} onChange={this.handleFnChange} required/>
        </div>
        <div className="panel-form-row">
          <input type="email" placeholder="{formatMessage(messages.email_prompt)}"
            autoComplete="email" value={this.state.email} onChange={this.handleEmailChange} required/>
        </div>
        <div className="panel-form-row">
          <CheckBox id="save-token" name="save-token" checked={this.state.saveToken}
            onChange={this.handleToggleSaveToken} />
          <label htmlFor="save-token">&nbsp;{formatMessage({id: 'stay_logged_in'})}</label>
        </div>
        <div className="dialog-buttons">
          <button className={submitClasses} type="submit">
            <FormattedMessage id="sign_up_button" defaultMessage="Sign up" />
          </button>
        </div>
      </form>
    );
  }
};

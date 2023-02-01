// Account registration.
import React, { Suspense } from 'react';
import { FormattedMessage } from 'react-intl';

import AvatarCrop from '../widgets/avatar-crop.jsx';
import AvatarUpload from '../widgets/avatar-upload.jsx';
import CheckBox from '../widgets/checkbox.jsx';
import PhoneEdit from '../widgets/phone-edit.jsx';
import VisiblePassword from '../widgets/visible-password.jsx';

import LocalStorageUtil from '../lib/local-storage.js';
import { imageScaled, blobToBase64, makeImageUrl } from '../lib/blob-helpers.js';
import { theCard } from '../lib/utils.js';

import { AVATAR_SIZE, MAX_AVATAR_BYTES, MAX_EXTERN_ATTACHMENT_SIZE,
  MAX_TITLE_LENGTH } from '../config.js';

export default class CreateAccountView extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      login: '',
      password: '',
      meth: '',
      email: '',
      tel: '',
      fn: '', // full/formatted name
      imageUrl: null,
      uploadUrl: null,
      newAvatar: null,
      newAvatarMime: null,
      buttonDisabled: false,
      saveToken: LocalStorageUtil.getObject('keep-logged-in')
    };

    this.handleLoginChange = this.handleLoginChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePhoneChange = this.handlePhoneChange.bind(this);
    this.handleFnChange = this.handleFnChange.bind(this);
    this.handleImageChanged = this.handleImageChanged.bind(this);
    this.handleToggleSaveToken = this.handleToggleSaveToken.bind(this);
    this.handleAvatarCropped = this.handleAvatarCropped.bind(this);
    this.handleAvatarCropCancel = this.handleAvatarCropCancel.bind(this);
    this.uploadAvatar = this.uploadAvatar.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    // Connection will trigger change by changing the this.props.serverVersion.
    props.tinode.connect()
      .catch(err => {
        this.props.onError(err.message, 'err');
      });
  }

  handleLoginChange(e) {
    this.setState({login: e.target.value});
  }

  handlePasswordChange(password) {
    this.setState({password: password});
  }

  handleEmailChange(e) {
    this.setState({meth: 'email', email: e.target.value});
  }

  handlePhoneChange(number) {
    this.setState({meth: 'tel', tel: number});
  }

  handleFnChange(e) {
    this.setState({fn: e.target.value});
  }

  handleImageChanged(mime, img) {
    this.setState({newAvatar: img, newAvatarMime: mime});
  }

  handleToggleSaveToken() {
    LocalStorageUtil.setObject('keep-logged-in', !this.state.saveToken);
    this.setState({saveToken: !this.state.saveToken});
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.onCreateAccount(
      this.state.login.trim(),
      this.state.password.trim(),
      theCard(this.state.fn.trim().substring(0, MAX_TITLE_LENGTH), this.state.uploadUrl),
      {
        'meth': this.state.meth,
        'val': this.state.meth == 'email' ?
          this.state.email :
            this.state.meth == 'tel' ? this.state.tel : null
      }
    );
  }

  // AvatarCropView calls this method when the user has cropped the image.
  handleAvatarCropped(mime, blob, width, height) {
    const url = blob ? URL.createObjectURL(blob) : null;
    this.setState({avatar: url, newAvatar: null, newAvatarMime: null});
    if (blob) {
      this.uploadAvatar(mime, blob, width, height);
    }
  }

  handleAvatarCropCancel() {
    this.setState({newAvatar: null, newAvatarMime: null});
  }

    // Utility method for converting cropped avatar blob to bytes for sending inband or
  // for uploading it to the server out of band.
  uploadAvatar(mime, blob, width, height) {
    const readyToUpload = image => {
      let {mime, blob} = image;
      this.setState({imageUrl: URL.createObjectURL(blob), buttonDisabled: true});
      if (blob.size > MAX_AVATAR_BYTES) {
        // Too large to send inband - uploading out of band and sending as a link.
        const uploader = this.props.tinode.getLargeFileHelper();
        uploader.upload(blob, 'newacc')
          .then(url => this.setState({uploadUrl: url}))
          .catch(err => this.props.onError(err.message, 'err'))
          .finally(_ => this.setState({buttonDisabled: false}));
      } else {
        // Convert blob to base64-encoded bits.
        blobToBase64(blob)
          .then(b64 => this.setState({uploadUrl: makeImageUrl({data: b64.bits, type: mime})}))
          .finally(_ => this.setState({buttonDisabled: false}));
      }
    };

    if (width > AVATAR_SIZE || height > AVATAR_SIZE || width != height) {
      // Avatar is not square or too large even after cropping. Shrink it and make square.
      imageScaled(blob, AVATAR_SIZE, AVATAR_SIZE, MAX_EXTERN_ATTACHMENT_SIZE, true)
        .then(scaled => readyToUpload(scaled))
        .catch(err => this.props.onError(err.message, 'err'));
    } else {
      readyToUpload({mime: mime, blob: blob, width: width, height: height});
    }
  }

  render() {
    if (this.state.newAvatar) {
      return (
        <AvatarCrop
          avatar={this.state.newAvatar}
          mime={this.state.newAvatarMime}
          onSubmit={this.handleAvatarCropped}
          onCancel={this.handleAvatarCropCancel}
          onError={this.props.onError} />
      );
    }

    let submitClasses = 'primary';
    if (this.props.disabled) {
      submitClasses += ' disabled';
    }

    return (
      <form className="panel-form-column" onSubmit={this.handleSubmit}>
        <div className="panel-form-row">
          <div className="umn">
            <FormattedMessage id="login_prompt" defaultMessage="Login"
              description="Placeholer for username/login">{
              (login_prompt) => <input type="text" placeholder={login_prompt} autoComplete="user-name"
                value={this.state.login} onChange={this.handleLoginChange} required autoFocus />
            }</FormattedMessage>
            <FormattedMessage id="password_prompt" defaultMessage="Password"
              description="Placeholder/prompt for entering password">{
              (password_prompt) => <VisiblePassword placeholder={password_prompt} autoComplete="new-password"
                value={this.state.password} onFinished={this.handlePasswordChange}
                required={true} />
            }</FormattedMessage>
          </div>
          <AvatarUpload
            tinode={this.props.tinode}
            avatar={this.state.imageUrl}
            onImageUpdated={this.handleImageChanged}
            onError={this.props.onError} />
        </div>
        <div  className="panel-form-row">
          <FormattedMessage id="full_name_prompt" defaultMessage="Full name, e.g. John Doe"
            description="Input placeholder for person's full name">{
            (full_name_prompt) => <input type="text" placeholder={full_name_prompt} autoComplete="name"
              value={this.state.fn} onChange={this.handleFnChange} required/>
          }</FormattedMessage>
        </div>
        {this.props.reqCredMethod == 'email' ?
          <div className="panel-form-row">
            <FormattedMessage id="email_prompt" defaultMessage="Email, e.g. jdoe@example.com"
              description="Input placeholder for email entry">{
              (email_prompt) => <input type="email" placeholder={email_prompt} autoComplete="email"
                value={this.state.email} onChange={this.handleEmailChange} required/>
            }</FormattedMessage>
          </div>
          : this.props.reqCredMethod == 'tel' ?
          <><div className="panel-form-row">
            <label className="small gray"><FormattedMessage id="mobile_phone_number" defaultMessage="Mobile phone number"
              description="Prompt for entering a mobile phone number" /></label>
          </div>
          <div className="panel-form-row">
            <PhoneEdit
              autoFocus={false}
              onShowCountrySelector={this.props.onShowCountrySelector}
              onSubmit={this.handlePhoneChange} />
          </div></>
          : null
        }
        <div className="panel-form-row">
          <CheckBox id="save-token" name="save-token" checked={this.state.saveToken}
            onChange={this.handleToggleSaveToken} />
          <FormattedMessage id="stay_logged_in" defaultMessage="Stay logged in"
            description="Label for a checkbox">{
            (stay_logged_in) => <label htmlFor="save-token">&nbsp;{stay_logged_in}</label>
          }</FormattedMessage>
        </div>
        <div className="dialog-buttons">
          <button className={submitClasses} type="submit" disabled={this.state.buttonDisabled}>
            <FormattedMessage id="button_sign_up" defaultMessage="Sign up"
              description="Create account button [Sign Up]" />
          </button>
        </div>
      </form>
    );
  }
};

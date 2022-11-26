import React from 'react';
import { FormattedMessage } from 'react-intl';

import AvatarCrop from './avatar-crop.jsx';
import AvatarUpload from './avatar-upload.jsx';
import CheckBox from './checkbox.jsx';
import TagManager from './tag-manager.jsx';

import { AVATAR_SIZE, MAX_AVATAR_BYTES, MAX_EXTERN_ATTACHMENT_SIZE, MAX_TITLE_LENGTH,
  MAX_TOPIC_DESCRIPTION_LENGTH } from '../config.js';
import { imageScaled, blobToBase64, makeImageUrl } from '../lib/blob-helpers.js';

export default class NewTopicGroup extends React.PureComponent {
  constructor(props) {
    super(props);

    this.fullName = React.createRef();

    this.state = {
      fullName: '', // full/formatted name
      private: '',
      description: '',
      imageUrl: null,
      tags: [],
      isChannel: false,
      newAvatar: null,
      newAvatarMime: null
    };

    this.handleFieldEdit = this.handleFieldEdit.bind(this);
    this.handleImageChanged = this.handleImageChanged.bind(this);
    this.handleAvatarCropped = this.handleAvatarCropped.bind(this);
    this.handleAvatarCropCancel = this.handleAvatarCropCancel.bind(this);
    this.uploadAvatar = this.uploadAvatar.bind(this);
    this.handleTagsChanged = this.handleTagsChanged.bind(this);
    this.handleChannelToggle = this.handleChannelToggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    // this.fullName.current.focus();
  }

  handleFieldEdit(name, e) {
    this.setState({[name]: e.target.value || ''});
  }

  handleImageChanged(mime, img) {
    this.setState({newAvatar: img, newAvatarMime: mime});
  }

  handleAvatarCropped(mime, blob, width, height) {
    const url = blob ? URL.createObjectURL(blob) : null;
    this.setState({imageUrl: url, newAvatar: null, newAvatarMime: null});
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
      if (blob.size > MAX_AVATAR_BYTES) {
        // Too large to send inband - uploading out of band and sending as a link.
        const uploader = this.props.tinode.getLargeFileHelper();
        uploader.upload(blob)
          .then(url => this.setState({imageUrl: url}))
          .catch(err => this.props.onError(err.message, 'err'));
      } else {
        // Convert blob to base64-encoded bits.
        blobToBase64(blob)
          .then(b64 => this.setState({imageUrl: makeImageUrl({data: b64.bits, type: mime})}));
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

  handleTagsChanged(tags) {
    this.setState({tags: tags});
  }

  handleChannelToggle() {
    this.setState({isChannel: !this.state.isChannel});
  }

  handleSubmit(e) {
    e.preventDefault();

    const fn = this.state.fullName.trim().substring(0, MAX_TITLE_LENGTH);
    const comment = this.state.private.trim().substring(0, MAX_TITLE_LENGTH);
    const description = this.state.description.trim().substring(0, MAX_TOPIC_DESCRIPTION_LENGTH);
    if (fn) {
      this.props.onSubmit(fn, description, this.state.imageUrl, comment, this.state.tags, this.state.isChannel);
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
      <form className="panel-form" onSubmit={this.handleSubmit}>
        <div className="panel-form-column">
          <center>
            <AvatarUpload
              tinode={this.props.tinode}
              avatar={this.state.imageUrl}
              onError={this.props.onError}
              onImageUpdated={this.handleImageChanged} />
          </center>
          <div className="group">
            <label className="small" htmlFor="new-topic-fn">
              <FormattedMessage id="label_topic_name" defaultMessage="Name"
                description="Label for editing topic name" />
            </label>
            <FormattedMessage id="topic_name_editing_placeholder" defaultMessage="Freeform name of the group"
              description="Prompt for entering topic name">{
              (placeholder) => <input type="text" id="new-topic-fn" placeholder={placeholder}
                ref={this.fullName} value={this.state.fullName} onChange={this.handleFieldEdit.bind(this, 'fullName')}
                autoFocus required tabIndex={0} />
            }</FormattedMessage>
          </div>
          <div className="group">
            <label className="small" htmlFor="new-topic-priv">
              <FormattedMessage id="label_private" defaultMessage="Private comment"
                description="Label for editing 'private'" />
            </label>
            <FormattedMessage id="private_editing_placeholder" defaultMessage="Visible to you only"
              description="Placeholder for editing 'private'">{
              (placeholder) => <input type="text" id="new-topic-priv" placeholder={placeholder}
                value={this.state.private} onChange={this.handleFieldEdit.bind(this, 'private')} tabIndex={1} />
            }</FormattedMessage>
          </div>
          <div className="group">
            <label className="small" htmlFor="new-topic-desc">
              <FormattedMessage id="label_description" defaultMessage="Description"
                description="Label for editing topic description" />
            </label>
            <FormattedMessage id="description_editing_placeholder" defaultMessage="Description (optional)"
              description="Placeholder for editing topic description">{
              (placeholder) => <input type="text" id="new-topic-desc" placeholder={placeholder}
                value={this.state.description} onChange={this.handleFieldEdit.bind(this, 'description')} tabIndex={2} />
            }</FormattedMessage>
          </div>
        </div>
        <div className="panel-form-row">
          <CheckBox checked={this.state.isChannel} tabIndex={3} onChange={this.handleChannelToggle} />&nbsp;
          <label onClick={this.handleChannelToggle}><FormattedMessage id="channel_prompt"
            defaultMessage="This is a channel"
            description="Checkbox label when creating a channel" /></label>
        </div>
        <FormattedMessage id="title_tag_manager" defaultMessage="Tags (search & discovery)"
          description="Section title for TagManager">{
          (title) => <TagManager
            tinode={this.props.tinode}
            tags={this.state.tags}
            activated={true}
            onTagsChanged={this.handleTagsChanged}
            tabIndex={4}
            title={title} />
        }</FormattedMessage>
        <div className="dialog-buttons">
          <button className={submitClasses}>
            <FormattedMessage id="button_create" defaultMessage="Create"
              description="Button [Create]" />
          </button>
        </div>
      </form>
    );
  }
};

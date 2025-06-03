// Widget for editing topic description.

import React from 'react';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';

import { Tinode } from 'tinode-sdk';

import AvatarCrop from './avatar-crop.jsx';
import AvatarUpload from './avatar-upload.jsx';
import InPlaceEdit from './in-place-edit.jsx';
import TagManager from './tag-manager.jsx';

import { AVATAR_SIZE, MAX_AVATAR_BYTES, MAX_EXTERN_ATTACHMENT_SIZE, MAX_TITLE_LENGTH,
  MAX_TOPIC_DESCRIPTION_LENGTH } from '../config.js';
import { imageScaled, blobToBase64, makeImageUrl } from '../lib/blob-helpers.js';
import { arrayEqual, theCard } from '../lib/utils.js';

const messages = defineMessages({
  alias_invalid: {
    id: 'alias_invalid',
    defaultMessage: '(invalid)',
    description: 'Error message for invalid alias'
  },
  alias_already_taken: {
    id: 'alias_already_taken',
    defaultMessage: '(already taken)',
    description: 'Error message for alias already taken'
  },
  self_topic_name: {
    id: 'self_topic_name',
    defaultMessage: 'Saved messages',
    description: 'Name of self topic for UI'
  },
  self_topic_comment: {
    id: 'self_topic_comment',
    defaultMessage: 'Notes, messages, links, files saved for posterity',
    description: 'Comment for self topic for UI'
  }
});

const ALIAS_AVAILABILITY_CHECK_DELAY = 1000; // milliseconds

class TopicDescEdit extends React.Component {
  constructor(props) {
    super(props);

    const topic = this.props.tinode.getTopic(this.props.topic);
    const acs = topic.getAccessMode();
    const isSelf = Tinode.isSelfTopicName(this.props.topic);
    this.state = {
      isMe: Tinode.isMeTopicName(this.props.topic),
      isSelf: isSelf,
      owner: acs && acs.isOwner(),
      fullName: topic.public ? topic.public.fn :
        isSelf ? this.props.intl.formatMessage(messages.self_topic_name) : null,
      private: topic.private ? topic.private.comment : null,
      description: topic.public ? topic.public.note :
        isSelf ? this.props.intl.formatMessage(messages.self_topic_comment) : null,
      avatar: makeImageUrl(topic.public ? topic.public.photo : null),
      tags: topic.tags() || [],
      newAvatar: null,
      newAvatarMime: null,
      aliasError: ''
    };

    this.previousOnTags = null;
    this.aliasCheckTimer = null;
    this.aliasCheckPromise = null;

    this.tnNewTags = this.tnNewTags.bind(this);
    this.handleFullNameUpdate = this.handleFullNameUpdate.bind(this);
    this.handleImageUpdated = this.handleImageUpdated.bind(this);
    this.handleAvatarCropped = this.handleAvatarCropped.bind(this);
    this.handleAvatarCropCancel = this.handleAvatarCropCancel.bind(this);
    this.uploadAvatar = this.uploadAvatar.bind(this);
    this.handlePrivateUpdate = this.handlePrivateUpdate.bind(this);
    this.handleAliasUpdate = this.handleAliasUpdate.bind(this);
    this.handleDescriptionUpdate = this.handleDescriptionUpdate.bind(this);
    this.handleTagsUpdated = this.handleTagsUpdated.bind(this);
    this.validateAlias = this.validateAlias.bind(this);
    this.cancelValidator = this.cancelValidator.bind(this);
  }

  componentDidMount() {
    const topic = this.props.tinode.getTopic(this.props.topic);
    this.previousOnTags = topic.onTagsUpdated;
    topic.onTagsUpdated = this.tnNewTags;
  }

  componentWillUnmount() {
    const topic = this.props.tinode.getTopic(this.props.topic);
    topic.onTagsUpdated = this.previousOnTags;
    this.cancelValidator();
  }

  tnNewTags(tags) {
    this.setState({tags: tags});
  }

  handleFullNameUpdate(fn) {
    fn = fn.trim().substring(0, MAX_TITLE_LENGTH);
    if (fn && this.state.fullName !== fn) {
      this.setState({fullName: fn});
      this.props.onUpdateTopicDesc(this.props.topic, theCard(fn, null));
    }
  }

  handlePrivateUpdate(comment) {
    comment = comment.trim().substring(0, MAX_TITLE_LENGTH);
    if (this.state.private !== comment) {
      this.setState({private: comment});
      this.props.onUpdateTopicDesc(this.props.topic, null, comment || Tinode.DEL_CHAR);
    }
  }

  handleDescriptionUpdate(desc) {
    desc = desc.trim().substring(0, MAX_TOPIC_DESCRIPTION_LENGTH);
    if (desc) {
      this.setState({description: desc});
      this.props.onUpdateTopicDesc(this.props.topic, theCard(null, null, null, desc));
    }
  }

  // AvatarUpload widget has changed the avatar: received a new file or deleted the avatar.
  handleImageUpdated(mime, img) {
    // This will show the AvatarCropView is img is not null.
    this.setState({newAvatar: img, newAvatarMime: mime});
    if (!img) {
      // Deleting the avatar.
      this.setState({avatar: null});
      this.props.onUpdateTopicDesc(this.props.topic, theCard(null, Tinode.DEL_CHAR));
    }
  }

  // AvatarCropView calls this method when the user has cropped the image.
  handleAvatarCropped(mime, blob, width, height) {
    const url = blob ? URL.createObjectURL(blob) : null;
    this.setState({avatar: url, newAvatar: null, newAvatarMime: null});
    if (blob) {
      this.uploadAvatar(mime, blob, width, height);
    }
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
          .then(url => this.props.onUpdateTopicDesc(this.props.topic, theCard(null, url)))
          .catch(err => this.props.onError(err.message, 'err'));
      } else {
        // Convert blob to base64-encoded bits.
        blobToBase64(blob)
          .then(b64 => {
            const du = makeImageUrl({data: b64.bits, type: mime});
            this.setState({source: du});
            this.props.onUpdateTopicDesc(this.props.topic, theCard(null, du));
          });
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

  handleAvatarCropCancel() {
    this.setState({newAvatar: null, newAvatarMime: null});
  }

  handleAliasUpdate(alias) {
    alias = (alias || '').trim();
    const tags = alias ?
      Tinode.setUniqueTag(this.state.tags, Tinode.TAG_ALIAS + alias.toLowerCase()) :
      Tinode.clearTagPrefix(this.state.tags, Tinode.TAG_ALIAS);
    this.handleTagsUpdated(tags);
  }

  validateAlias(alias) {
    // Reset pending delayed check.
    this.cancelValidator();

    alias = alias.trim();
    if (!alias) {
      this.setState({aliasError: ''});
      return true;
    }

    const valid = Tinode.isValidTagValue(alias);
    if (!valid) {
      this.setState({aliasError: this.props.intl.formatMessage(messages.alias_invalid)});
      return false;
    }
    this.setState({aliasError: ''});

    // Setup a delayed check for alias availability.
    const fnd = this.props.tinode.getFndTopic();
    if (!fnd) {
      // Unable to check alias availability.
      this.setState({aliasError: ''});
      return true;
    }
    this.aliasCheckPromise = {};
    const validationPromise = new Promise((resolve, reject) => {
      this.aliasCheckPromise.resolve = resolve;
      this.aliasCheckPromise.reject = reject;
    });
    this.aliasCheckTimer = setTimeout(_ => {
      this.aliasCheckTimer = null;
      fnd.checkTagUniqueness(`${Tinode.TAG_ALIAS}${alias}`, this.props.topic)
        .then(ok => {
          this.aliasCheckPromise.resolve(ok)
          this.setState({aliasError: ok ? '' : this.props.intl.formatMessage(messages.alias_already_taken)});
        })
        .catch(err => {
          this.aliasCheckPromise.reject(err);
          this.setState({aliasError: err.message});
        });
    }, ALIAS_AVAILABILITY_CHECK_DELAY);
    return validationPromise;
  }

  cancelValidator() {
    // Reset pending delayed check.
    if (this.aliasCheckTimer) {
      clearTimeout(this.aliasCheckTimer);
      this.aliasCheckTimer = null;
      this.aliasCheckPromise.reject(null);
    }
  }

  handleTagsUpdated(tags) {
    // Check if tags have actually changed.
    if (arrayEqual(this.state.tags.slice(0), tags.slice(0))) {
      return;
    }
    this.props.onUpdateTags(tags);
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

    const editable = this.state.isMe || (this.state.owner && !this.state.isSelf);
    let alias = this.state.tags && this.state.tags.find(t => t.startsWith('alias:'));
    if (alias) {
      // Remove 'alias:' prefix.
      alias = alias.substring(6);
    }

    return (
      <>
      <div className="panel-form-column">
        <center>
          <AvatarUpload
            tinode={this.props.tinode}
            avatar={this.state.avatar}
            readOnly={!editable}
            uid={this.props.topic}
            title={this.state.fullName}
            onImageUpdated={this.handleImageUpdated}
            onError={this.props.onError} />
        </center>
        {this.state.isMe ?
          <div className="group">
            <label className="small">
              <FormattedMessage id="label_your_name" defaultMessage="Your name"
              description="Label for full name editing" />
            </label>
            <div>
              <FormattedMessage id="full_name_prompt" defaultMessage="Full name, e.g. John Doe"
                description="Input placeholder for person's full name">{
                (full_name_placeholder) => <InPlaceEdit
                  placeholder={full_name_placeholder}
                  value={this.state.fullName}
                  required={true}
                  onFinished={this.handleFullNameUpdate} />
              }</FormattedMessage>
            </div>
          </div>
        :
          <>
            <div className="group">
              <div><label className="small">
                <FormattedMessage id="label_topic_name" defaultMessage="Name"
                  description="Label for editing topic name" />
              </label></div>
              <div>
                <FormattedMessage id="topic_name_editing_placeholder" defaultMessage="Freeform name of the group"
                  description="Prompt for entering topic name">{
                  (group_name_placeholder) => <InPlaceEdit
                    placeholder={group_name_placeholder}
                    readOnly={!editable}
                    value={this.state.fullName}
                    required={true}
                    maxLength={32}
                    onFinished={this.handleFullNameUpdate} />
                }</FormattedMessage>
              </div>
            </div>
            <div className="group">
              <div>
                <label className="small">
                  <FormattedMessage id="label_private" defaultMessage="Private comment"
                    description="Label for editing 'private'" />
                </label>
              </div>
              <div>
                <FormattedMessage id="private_editing_placeholder" defaultMessage="Visible to you only"
                  description="Placeholder for editing 'private'">{
                  (private_placeholder) => <InPlaceEdit
                    placeholder={private_placeholder}
                    value={this.state.private}
                    onFinished={this.handlePrivateUpdate} />
                }</FormattedMessage>
              </div>
            </div>
          </>
        }
        {editable || alias ?
          <div className="group">
            <div><label className={'small ' + (this.state.aliasError ? 'invalid' : '')}>
              <FormattedMessage id="label_alias_edit" defaultMessage="Alias"
                description="Label for editing user or topic alias" /> {this.state.aliasError}
            </label></div>
            <div>
              <FormattedMessage id="alias_editing_placeholder"
                defaultMessage="Alias (optional)"
                description="Placeholder for editing user or topic alias">{
                (private_placeholder) => <InPlaceEdit
                  placeholder={private_placeholder}
                  readOnly={!editable}
                  value={alias}
                  validator={this.validateAlias}
                  iconLeft='alternate_email'
                  maxLength={24}
                  spellCheck={false}
                  onFinished={this.handleAliasUpdate} />
              }</FormattedMessage>
            </div>
          </div>
          : null
        }
        {editable || this.state.description ?
          <div className="group">
            <div><label className="small">
              <FormattedMessage id="label_description" defaultMessage="Description"
                description="Label for editing topic description" />
            </label></div>
            <div>
              <FormattedMessage id="description_editing_placeholder"
                defaultMessage="Description (optional)"
                description="Placeholder for editing topic description">{
                (private_placeholder) => <InPlaceEdit
                  placeholder={private_placeholder}
                  readOnly={!editable}
                  value={this.state.description}
                  multiline={2}
                  onFinished={this.handleDescriptionUpdate} />
              }</FormattedMessage>
            </div>
          </div>
          : null
        }
      </div>
      {editable && !this.state.isMe ?
        <>
          <div className="hr" />
          <FormattedMessage id="title_tag_manager" defaultMessage="Tags (search & discovery)"
            description="Section title for TagManager">{
              (title_tag_manager) => <TagManager
                tinode={this.props.tinode}
                title={title_tag_manager}
                activated={false}
                tags={this.state.tags}
                onSubmit={this.handleTagsUpdated} />
          }</FormattedMessage>
        </>
        : null
      }
      </>
    );
  }
};

export default injectIntl(TopicDescEdit);

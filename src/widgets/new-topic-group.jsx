import React from 'react';
import { FormattedMessage } from 'react-intl';

import AvatarUpload from './avatar-upload.jsx';
import CheckBox from './checkbox.jsx';
import TagManager from './tag-manager.jsx';

import { MAX_TITLE_LENGTH } from '../config.js';

export default class NewTopicGroup extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      fn: '', // full/formatted name
      private: '',
      imageDataUrl: null,
      tags: [],
      isChannel: false
    };

    this.handleFnChange = this.handleFnChange.bind(this);
    this.handlePrivateChange = this.handlePrivateChange.bind(this);
    this.handleImageChanged = this.handleImageChanged.bind(this);
    this.handleTagsChanged = this.handleTagsChanged.bind(this);
    this.handleChannelToggle = this.handleChannelToggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleFnChange(e) {
    this.setState({fn: e.target.value});
  }

  handlePrivateChange(e) {
    this.setState({private: e.target.value});
  }

  handleImageChanged(img) {
    this.setState({imageDataUrl: img});
  }

  handleTagsChanged(tags) {
    this.setState({tags: tags});
  }

  handleChannelToggle() {
    this.setState({isChannel: !this.state.isChannel});
  }

  handleSubmit(e) {
    e.preventDefault();

    const fn = this.state.fn.trim().substring(0, MAX_TITLE_LENGTH);
    const comment = this.state.private.trim().substring(0, MAX_TITLE_LENGTH);
    if (fn) {
      this.props.onSubmit(fn, this.state.imageDataUrl, comment, this.state.tags, this.state.isChannel);
    }
  }

  render() {
    let submitClasses = 'primary';
    if (this.props.disabled) {
      submitClasses += ' disabled';
    }
    return (
      <form className="panel-form" onSubmit={this.handleSubmit}>
        <div className="panel-form-row">
          <div className="panel-form-column">
            <label className="small" htmlFor="new-topic-fn">
              <FormattedMessage id="label_topic_name" defaultMessage="Name"
                description="Label for editing topic name" />
            </label>
            <FormattedMessage id="topic_name_editing_placeholder" defaultMessage="Freeform name of the group"
              description="Prompt for entering topic name">{
              (placeholder) => <input type="text" id="new-topic-fn" placeholder={placeholder}
                value={this.state.fn} onChange={this.handleFnChange} autoFocus required />
            }</FormattedMessage>
            <br />
            <label className="small" htmlFor="new-topic-priv">
              <FormattedMessage id="label_private" defaultMessage="Private comment"
                description="Label for editing 'private'" />
            </label>
            <FormattedMessage id="private_editing_placeholder" defaultMessage="Visible to you only"
              description="Placeholder for editing 'private'">{
              (placeholder) => <input type="text" id="new-topic-priv" placeholder={placeholder}
                value={this.state.private} onChange={this.handlePrivateChange} />
            }</FormattedMessage>
          </div>
          <AvatarUpload
            onError={this.props.onError}
            onImageChanged={this.handleImageChanged} />
        </div>
        <div className="panel-form-row">
          <CheckBox checked={this.state.isChannel} onChange={this.handleChannelToggle}/>&nbsp;
          <label onClick={this.handleChannelToggle}><FormattedMessage id="channel_prompt"
            defaultMessage="This is a channel"
            description="Checkbox label when creating a channel" /></label>
        </div>
        <FormattedMessage id="title_tag_manager" defaultMessage="Tags (user discovery)"
          description="Section title for TagManager">{
          (title) => <TagManager
            tags={this.state.tags}
            activated={true}
            onTagsChanged={this.handleTagsChanged}
            tinode={this.props.tinode}
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

import React from 'react';
import { FormattedMessage } from 'react-intl';

import AvatarUpload from './avatar-upload.jsx';
import TagManager from './tag-manager.jsx';

export default class NewTopicGroup extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      fn: '', // full/formatted name
      private: '',
      imageDataUrl: null,
      tags: []
    };

    this.handleFnChange = this.handleFnChange.bind(this);
    this.handlePrivateChange = this.handlePrivateChange.bind(this);
    this.handleImageChanged = this.handleImageChanged.bind(this);
    this.handleTagsChanged = this.handleTagsChanged.bind(this);
    this.handleTagsChanged = this.handleTagsChanged.bind(this);
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

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.fn && this.state.fn.trim()) {
      this.props.onSubmit(this.state.fn.trim(),
        this.state.imageDataUrl, this.state.private.trim(),
        this.state.tags);
    }
  }

  render() {
    var submitClasses = 'blue';
    if (this.props.disabled) {
      submitClasses += ' disabled';
    }
    return (
      <form className="panel-form" onSubmit={this.handleSubmit}>
        <div className="panel-form-row">
          <div className="panel-form-column">
            <label className="small" htmlFor="new-topic-fn">
              <FormattedMessage id="label_topic_name" />
            </label>
            <FormattedMessage id="topic_name_editing_placeholder" defaultMessage="Freeform name of the group"
              description="Prompt for entering topic name">{
              (placeholder) => <input type="text" id="new-topic-fn" placeholder={placeholder}
                value={this.state.fn} onChange={this.handleFnChange} autoFocus required />
            }</FormattedMessage>
            <br />
            <label className="small" htmlFor="new-topic-priv">
              <FormattedMessage id="label_private" />
            </label>
            <FormattedMessage id="private_editing_placeholder">{
              (placeholder) => <input type="text" id="new-topic-priv" placeholder={placeholder}
                value={this.state.private} onChange={this.handlePrivateChange} />
            }</FormattedMessage>
          </div>
          <AvatarUpload
            onError={this.props.onError}
            onImageChanged={this.handleImageChanged} />
        </div>
        <FormattedMessage id="title_tag_manager">{
          (title) => <TagManager
            tags={this.state.tags}
            activated={true}
            onTagsChanged={this.handleTagsChanged}
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

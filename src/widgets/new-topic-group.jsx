import React from 'react';

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
            <label className="small" htmlFor="new-topic-fn">Group name</label>
            <input type="text" id="new-topic-fn" placeholder="Freeform name of the group"
              value={this.state.fn} onChange={this.handleFnChange} autoFocus required />
            <br />
            <label className="small" htmlFor="new-topic-priv">Private comment</label>
            <input type="text" id="new-topic-priv" placeholder="Visible to you only"
              value={this.state.private} onChange={this.handlePrivateChange} />
          </div>
          <AvatarUpload
            onError={this.props.onError}
            onImageChanged={this.handleImageChanged} />
        </div>
        <TagManager
          tags={this.state.tags}
          activated={true}
          onTagsChanged={this.handleTagsChanged}
          title="Optional tags (search and discovery)" />
        <div className="dialog-buttons">
          <button className={submitClasses}>Create</button>
        </div>
      </form>
    );
  }
};

// TagManager: edit topic or user tags.
import React from 'react';
import { FormattedMessage } from 'react-intl';

import ChipInput from './chip-input.jsx';

import { arrayEqual } from '../lib/utils.js';

export default class TagManager extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: this.props.tags,
      tagInput: '',
      activated: this.props.activated
    };

    this.handleShowTagManager = this.handleShowTagManager.bind(this);
    this.handleTagInput = this.handleTagInput.bind(this);
    this.handleAddTag = this.handleAddTag.bind(this);
    this.handleRemoveTag = this.handleRemoveTag.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!arrayEqual(nextProps.tags, prevState.tags) && !prevState.activated) {
      return {tags: nextProps.tags};
    }
    return null;
  }

  handleShowTagManager() {
    this.setState({activated: true});
  }

  handleTagInput(text) {
    this.setState({tagInput: text});
    // Check if user entered ',', ' ' or ';'
    if (text.length > 0) {
      var last = text[text.length-1];
      if (last == ',' || last == ' ' || last == ';') {
        var tag = text.substr(0, text.length-1).trim();
        if (tag.length >= MIN_TAG_LENGTH) {
          this.handleAddTag(tag);
        }
      }
    }
  }

  handleAddTag(tag) {
    tag = tag.trim();
    if (tag.length > 0) {
      let tags = this.state.tags.slice(0);
      tags.push(tag);
      this.setState({tags: tags, tagInput: ''});
      if (this.props.onTagsChanged) {
        this.props.onTagsChanged(tags);
      }
    }
  }

  handleRemoveTag(tag, index) {
    var tags = this.state.tags.slice(0);
    tags.splice(index, 1);
    this.setState({tags: tags});
    if (this.props.onTagsChanged) {
      this.props.onTagsChanged(tags);
    }
  }

  handleSubmit() {
    let tags = this.state.tags.slice(0);
    let inp = this.state.tagInput.trim();
    if (inp.length > 0) {
      tags.push(inp);
      if (this.props.onTagsChanged) {
        this.props.onTagsChanged(tags);
      }
    }
    this.props.onSubmit(tags);
    this.setState({activated: false, tagInput: '', tags: this.props.tags});
  }

  handleCancel() {
    this.setState({activated: false, tagInput: '', tags: this.props.tags});
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  }

  render() {
    var tags = [];
    if (this.state.activated) {
      this.state.tags.map(function(tag) {
        tags.push({user: tag});
      });
    } else {
      this.state.tags.map(function(tag) {
        tags.push(<span className="badge" key={tags.length}>{tag}</span>);
      });
      if (tags.length == 0) {
        tags = (<i>
              <FormattedMessage id="tags_not_found" defaultMessage="No tags defined. Add some." description="" />
            </i>);
      }
    }
    return (
      <div className="panel-form-column">
        <div className="panel-form-row">
          <label className="small">{this.props.title}</label>
        </div>
        {this.state.activated ?
        <div>
          <FormattedMessage id="tags_editor_no_tags" defaultMessage="Add some tags"
            description="Tag editor prompt when no tags are found.">{
            (add_tags_prompt) => <ChipInput
              chips={tags}
              avatarDisabled={true}
              prompt={add_tags_prompt}
              onEnter={this.handleAddTag}
              onFocusLost={this.handleAddTag}
              onCancel={this.handleCancel}
              onChipRemoved={this.handleRemoveTag}
              filterFunc={this.handleTagInput} />
          }</FormattedMessage>
          {this.props.onSubmit || this.props.onCancel ?
            <div id="tag-manager-buttons" className="panel-form-row">
              <button className="blue" onClick={this.handleSubmit}>
                <FormattedMessage id="button_ok" defautMessage="OK" description="Confirmation button [OK]" />
              </button>
              <button className="white" onClick={this.handleCancel}>
                <FormattedMessage id="button_cancel" defautMessage="Cancel" description="Rejection button [Cancel]" />
              </button>
            </div>
          : null}
        </div>
        :
        <div>
          <a href="javascript:;" className="flat-button" onClick={this.handleShowTagManager}>
            <i className="material-icons">edit</i> <FormattedMessage id="title_manage_tags" defautMessage="Manage tags"
              description="Section title in TagManager" />
          </a>
          <span>{tags}</span>
        </div>
      }
      </div>
    );
  }
};

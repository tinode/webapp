// View for editing topic parameters (including 'me' topic).

import React from 'react';

import TopicDescEdit from '../widgets/topic-desc-edit.jsx';

import { arrayEqual } from '../lib/utils.js';

export default class TopicCommonView extends React.Component {
  constructor(props) {
    super(props);

    const topic = this.props.tinode.getTopic(this.props.topic);
    const acs = topic.getAccessMode();
    this.state = {
      tags: []
    };

    this.previousTagsUpdated = undefined;

    this.onTagsUpdated = this.onTagsUpdated.bind(this);
    this.handleTagsUpdated = this.handleTagsUpdated.bind(this);
  }

  // No need to separately handle component mount.
  componentDidUpdate(props) {
    const topic = this.props.tinode.getTopic(props.topic);
    if (!topic) {
      return;
    }

    if (topic.onTagsUpdated != this.onTagsUpdated) {
      if (topic.getType() == 'grp') {
        this.previousTagsUpdated = topic.onTagsUpdated;
        topic.onTagsUpdated = this.onTagsUpdated;
      } else {
        this.previousTagsUpdated = undefined;
      }
    }

    if (this.state.topic != props.topic) {
      this.setState({topic: props.topic});
    }
  }

  componentWillUnmount() {
    const topic = this.props.tinode.getTopic(this.props.topic);
    topic.onTagsUpdated = this.previousTagsUpdated;
  }

  // Server informs that the tags have been updated.
  onTagsUpdated(tags) {
    this.setState({tags: tags});

    if (this.previousTagsUpdated && this.previousTagsUpdated != this.onTagsUpdated) {
      this.previousTagsUpdated(tags);
    }
  }

  // Request server to change tags.
  handleTagsUpdated(tags) {
    if (!arrayEqual(this.state.tags.slice(0), tags.slice(0))) {
      this.props.onUpdateTagsRequest(this.props.topic, tags);
    }
  }

  render() {
    return (
      <div className="scrollable-panel">
        <TopicDescEdit
          tinode={this.props.tinode}
          topic={this.props.topic}
          onUpdateTopicDesc={this.props.onUpdateTopicDesc}
          onUpdateTags={this.handleTagsUpdated}
          onError={this.props.onError} />
      </div>
    );
  }
};

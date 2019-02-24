// The counter of unread messages in the topic.
import React from 'react';

export default class UnreadBadge extends React.PureComponent {
  render() {
    return (this.props.count > 0 ?
      <span className="unread">{this.props.count > 9 ? "9+" : this.props.count}</span>
      : null);
  }
};

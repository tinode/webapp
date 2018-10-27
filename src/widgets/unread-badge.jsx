// The counter of unread messages in the topic.
import React from 'react';

export default class UnreadBadge extends React.PureComponent {
  render() {
    var showUnreadBadge = null;
    if (this.props.count > 0) {
      var count = this.props.count > 9 ? "9+" : this.props.count;
      showUnreadBadge = <span className="unread">{count}</span>;
    }
    return showUnreadBadge;
  }
};

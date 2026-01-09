// The counter of unread messages in the topic.
import React from 'react';

import { shortenCount } from '../lib/strformat';

export default class CountBadge extends React.PureComponent {
  render() {
    const className = 'counter-badge' + (this.props.size ? ` ${this.props.size}` : '') +
      (this.props.rect ? ' rect' : '');
    const displayCount = shortenCount(this.props.count, this.props.limit);
    return (this.props.count > 0 && <span className={className} style={this.props.style}>
      {displayCount}
    </span>);
  }
};

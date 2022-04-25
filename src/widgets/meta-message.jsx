// Message bubble with non-payload content, such as an indicator of deleted content or a date stamp.

import React from 'react';
import { FormattedMessage } from 'react-intl';

export default class MetaMessage extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    let content = null;
    let bubbleClass = 'bubble';
    if (this.props.deleted) {
      // Message represents a range of deleted messages.
      content = <><i className="material-icons gray">block</i> <i className="gray">
        <FormattedMessage id="deleted_content"
          defaultMessage="content deleted" description="Shown when messages are deleted" />
      </i></>
      bubbleClass += ' deleted';
    } else if (this.props.date) {
      // A date badge.
      content = <>{this.props.date}</>
      bubbleClass += ' date';
    }

    if (!content) {
      return <>{null}</>
    }

    return (
      <li className="meta">
        <div className={bubbleClass}>
          <div className="message-content">
            {content}
          </div>
        </div>
      </li>
    );
  }
};

// Received/read indicator.
import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';

import { Tinode } from 'tinode-sdk';

import { deliveryMarker } from '../lib/utils.js';

const messages = defineMessages({
  message_sending: {
    id: 'message_sending',
    defaultMessage: 'sending...',
    description: 'Message being sent, in place of time stamp'
  },
  message_sending_failed: {
    id: 'message_sending_failed',
    defaultMessage: 'failed',
    description: 'Failed to send message, in place of time stamp'
  },
  message_edited_marker: {
    id: 'message_edited_marker',
    defaultMessage: ', edited',
    description: 'Marker indicating that the message was edited'
  }
});

class ReceivedMarker extends React.PureComponent {
  render() {
    const {formatMessage} = this.props.intl;
    let timestamp;
    if (this.props.received <= Tinode.MESSAGE_STATUS_SENDING) {
      timestamp = formatMessage(messages.message_sending);
    } else if (this.props.received == Tinode.MESSAGE_STATUS_FAILED ||
        this.props.received == Tinode.MESSAGE_STATUS_FATAL) {
      timestamp = formatMessage(messages.message_sending_failed);
    } else {
      timestamp = this.props.timestamp.toLocaleTimeString(this.props.intl.locale, { timeStyle: 'short' });
    }

    const icon = deliveryMarker(this.props.received);
    const marker = icon ? <i className={'material-icons small ' + icon.color}>{icon.name}</i> : null;
    const edited = this.props.edited ? formatMessage(messages.message_edited_marker) : null;

    return (
      <span className="timestamp">
        {timestamp}{edited}{'\u00a0'}{marker}
      </span>
    );
  }
};

export default injectIntl(ReceivedMarker);

// Received/read indicator.
import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';

import Tinode from 'tinode-sdk';

import { shortDateFormat } from '../lib/strformat.js';
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
  }
});

class ReceivedMarker extends React.PureComponent {
  render() {
    const {formatMessage} = this.props.intl;
    let timestamp;
    if (this.props.received <= Tinode.MESSAGE_STATUS_SENDING) {
      timestamp = formatMessage(messages.message_sending);
    } else if (this.props.received == Tinode.MESSAGE_STATUS_FAILED) {
      timestamp = formatMessage(messages.message_sending_failed);
    } else {
      timestamp = shortDateFormat(this.props.timestamp, this.props.intl.locale);
    }

    const icon = deliveryMarker(this.props.received);
    const marker = icon ? <i className={'material-icons small ' + icon.color}>{icon.name}</i> : null;

    return (
      <span className="timestamp">
        {timestamp}{'\u00a0'}{marker}
      </span>
    );
  }
};

export default injectIntl(ReceivedMarker);

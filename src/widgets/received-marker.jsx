// Received/read indicator.
import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';

import Tinode from 'tinode-sdk';

import { shortDateFormat } from '../lib/strformat.js';

const messages = defineMessages({
  'sending': {
    'id': 'message_sending',
    'defaultMessage': 'sending...',
    'description': 'Message being sent, in place of time stamp'
  },
  'failed': {
    'id': 'message_sending_failed',
    'defaultMessage': 'failed',
    'description': 'Failed to send message, in place of time stamp'
  }
});

class ReceivedMarker extends React.PureComponent {
  render() {
    const {formatMessage} = this.props.intl;
    let timestamp;
    if (this.props.received <= Tinode.MESSAGE_STATUS_SENDING) {
      timestamp = formatMessage(messages.sending);
    } else if (this.props.received == Tinode.MESSAGE_STATUS_FAILED) {
      timestamp = formatMessage(messages.failed);
    } else {
      timestamp = shortDateFormat(this.props.timestamp, this.props.intl.locale);
    }

    let marker = null;
    if (this.props.received <= Tinode.MESSAGE_STATUS_SENDING) {
      marker = (<i className="material-icons small">access_time</i>); // watch face
    } else if (this.props.received == Tinode.MESSAGE_STATUS_FAILED) {
      marker = (<i className="material-icons small amber">warning</i>); // yellow icon /!\
    } else if (this.props.received == Tinode.MESSAGE_STATUS_SENT) {
      marker = (<i className="material-icons small">done</i>); // checkmark
    } else if (this.props.received == Tinode.MESSAGE_STATUS_RECEIVED) {
      marker = (<i className="material-icons small">done_all</i>); // double checkmark
    } else if (this.props.received == Tinode.MESSAGE_STATUS_READ) {
      marker = (<i className="material-icons small blue">done_all</i>); // blue double checkmark
    }

    return (
      <span className="timestamp">
        {timestamp}{'\u00a0'}{marker}
      </span>
    );
  }
};

export default injectIntl(ReceivedMarker);

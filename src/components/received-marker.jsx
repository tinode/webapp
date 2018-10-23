import React from 'react';

/* Received/read indicator */
export default class ReceivedMarker extends React.PureComponent {
  render() {
    let timestamp;
    if (this.props.received <= Tinode.MESSAGE_STATUS_SENDING) {
      timestamp = "sending ...";
    } else if (this.props.received == Tinode.MESSAGE_STATUS_FAILED) {
      timestamp = "failed";
    } else {
      timestamp = shortDateFormat(this.props.timestamp);
    }

    let marker = null;
    if (this.props.received <= Tinode.MESSAGE_STATUS_SENDING) {
      marker = (<i className="material-icons small">access_time</i>); // watch face
    } else if (this.props.received == Tinode.MESSAGE_STATUS_FAILED) {
      marker = (<i className="material-icons small red">error_outline</i>); // icon (!)
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

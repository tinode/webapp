// Chat message describing a video or voice call.

import React from 'react';
import { FormattedMessage } from 'react-intl';

import { secondsToTime } from '../lib/strformat.js';

export default class CallMessage extends React.PureComponent {
  render() {
    const isCallDropped = ['busy', 'declined', 'disconnected', 'missed'].includes(this.props.callState);
    const successClass = 'material-icons medium ' + (isCallDropped ? 'red' : 'green');
    const callIcon = this.props.incoming ?
      (isCallDropped ? 'call_missed' : 'call_received') :
      (isCallDropped ? 'call_missed_outgoing' : 'call_made');
    const title = this.props.incoming ?
          <FormattedMessage id="calls_incoming" defaultMessage="Incoming call" description="Incoming call label" /> :
          <FormattedMessage id="calls_outgoing" defaultMessage="Outgoing call" description="Outgoing call label" />;
    let duration;
    if (isCallDropped) {
      switch (this.props.callState) {
        case 'busy':
          duration = <FormattedMessage id="call_busy" defaultMessage="busy" description="Label for busy call line" />;
          break;
        case 'declined':
          duration = <FormattedMessage id="call_declined" defaultMessage="declined" description="Label for declined call" />;
          break;
        case 'missed':
          duration = this.props.incoming ?
            <FormattedMessage id="call_missed" defaultMessage="missed" description="Label for missed incoming call" /> :
            <FormattedMessage id="call_cancelled" defaultMessage="cancelled" description="Label for cancelled outgoing call" />;
          break;
        default:
          duration = <FormattedMessage id="call_disconnected" defaultMessage="disconnected" description="Label for disconnected call" />;
          break;
      }
    } else {
      duration = <span>{secondsToTime(this.props.duration / 1000)}</span>;
    }
    return <div className="call-message">
      <div><i className="material-icons big gray">call</i></div>
      <div className="flex-column narrow">
        <div>{title}</div>
        <div className="duration"><i className={successClass}>{callIcon}</i> {duration}</div>
      </div>
    </div>;
  }
}

// The counter of unread messages in the topic.
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { secondsToTime } from '../lib/strformat.js';

// Props:
//  incoming: true | false.
//  callState: 'busy' | 'declined' | 'disconnected' | 'missed'.
//  duration: <number> (call duration in milliseconds).
export default class CallStatus extends React.PureComponent {
  render() {
    const isCallDropped = ['busy', 'declined', 'disconnected', 'missed'].includes(this.props.callState);
    const icon2 = this.props.incoming ?
      (isCallDropped ? 'call_missed' : 'call_received') :
      (isCallDropped ? 'call_missed_outgoing' : 'call_made');
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
    } else if (['accepted', 'started'].includes(this.props.callState) && !this.props.duration) {
      duration = <FormattedMessage id="call_in_progress" defaultMessage="in progress" description="Label for call in progress" />
    } else {
      duration = <span>{secondsToTime(this.props.duration / 1000)}</span>;
    }
    return (
      <>
        <div className="composed-material">
          <i className="material-icons">call</i><i className="material-icons second">{icon2}</i>
        </div> {duration}
      </>
    );
  }
};

// The counter of unread messages in the topic.
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { secondsToTime } from '../lib/strformat.js';

// Props:
//  incoming: true | false.
//  success: true | false.
export default class CallStatus extends React.PureComponent {
  render() {
    const isCallDropped = this.props.callState == 'disconnected';
    const icon2 = this.props.incoming ?
      (isCallDropped ? 'call_missed' : 'call_received') :
      (isCallDropped ? 'call_missed_outgoing' : 'call_made');
    const duration = isCallDropped ? (
        this.props.incoming ?
        <FormattedMessage id="call_missed" defaultMessage="missed" description="Label for cancelled incoming call" /> :
        <FormattedMessage id="call_cancelled" defaultMessage="cancelled" description="Label for cancelled outgoing call" />
      ) :
      <span>{secondsToTime(this.props.duration / 1000)}</span>;
    return (
      <>
        <div className="composed-material">
          <i className="material-icons">call</i><i className="material-icons second">{icon2}</i>
        </div> {duration}
      </>
    );
  }
};

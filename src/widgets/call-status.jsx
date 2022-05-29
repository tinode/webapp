// The counter of unread messages in the topic.
import React from 'react';

// Props:
//  incoming: true | false.
//  success: true | false.
export default class CallStatus extends React.PureComponent {
  render() {
    const icon2 = [['call_received', 'call_missed'],['call_made', 'call_missed_outgoing']]
      [this.props.incoming ? 0 : 1][this.props.success ? 0 : 1] || 'question_mark';

    return (
      <div className="composed-material">
        <i class="material-icons">call</i><i class="material-icons second">{icon2}</i>
      </div>
    );
  }
};

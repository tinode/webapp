// A single topic or user.
import React from 'react';
import { FormattedMessage } from 'react-intl';

export default class Invitation extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleButtonAction = this.handleButtonAction.bind(this);
  }

  handleButtonAction(evt, data) {
    evt.preventDefault();
    this.props.onAction(data);
  }

  render() {
    return (
      <div className="accept-invite-panel">
        <div className="title">
          <FormattedMessage id="chat_invitation"
            defaultMessage="You are invited to start a new chat. What would you like to do?"
            description="New chat invitation message: [Accept] [Ignore] [Block]." />
        </div>
        <div className="footer">
          <button className="primary" onClick={event => { this.handleButtonAction(event, "accept"); }}>
            <FormattedMessage id="chat_invitation_accept"
              defaultMessage="Accept" description="Action [Accept] for chat invitation." />
          </button>
          <button className="secondary" onClick={event => { this.handleButtonAction(event, "delete"); }}>
            <FormattedMessage id="chat_invitation_ignore"
              defaultMessage="Ignore" description="Action [Ignore] for chat invitation." />
          </button>
          <button className="secondary" onClick={event => { this.handleButtonAction(event, "block"); }}>
            <FormattedMessage id="chat_invitation_block"
              defaultMessage="Block" description="Action [Block] for chat invitation." />
          </button>
        </div>
      </div>
    );
  }
};

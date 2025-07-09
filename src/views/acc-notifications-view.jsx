// Edit account parameters.
import React from 'react';
import { FormattedMessage } from 'react-intl';

import CheckBox from '../widgets/checkbox.jsx';

export default class AccNotificationsView extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleCheckboxClick = this.handleCheckboxClick.bind(this);
  }

  handleCheckboxClick(what, checked) {
    if (what == 'sound') {
      this.props.onToggleMessageSounds(checked);
    } else if (what == 'alert') {
      this.props.onTogglePushNotifications(checked);
    }
  }

  render() {
    return (
        <div className="scrollable-panel">
          <div className="panel-form-row">
            <label htmlFor="message-sound">
              <FormattedMessage id="label_message_sound" defaultMessage="Message sound:"
                description="Label for message sounds toggle" />
            </label>
            <CheckBox name="sound" id="message-sound"
              checked={this.props.messageSounds} onChange={this.handleCheckboxClick} />
          </div>
          <div className="panel-form-row">
            <label htmlFor="desktop-alerts">
            {this.props.desktopAlertsEnabled ?
              <FormattedMessage id="label_push_notifications" defaultMessage="Notification alerts:"
                description="Label for push notifications switch" />
              :
              <FormattedMessage id="label_push_notifications_disabled"
                defaultMessage="Notification alerts (requires HTTPS):"
                description="Label for push notifications switch" />
            }
            </label>
            <CheckBox name="alert" id="desktop-alerts"
              checked={this.props.desktopAlerts}
              onChange={this.props.desktopAlertsEnabled ? this.handleCheckboxClick : null} />
          </div>
        </div>
    );
  }
};

// Edit account parameters.
import React from 'react';
import { FormattedMessage } from 'react-intl';

import AvatarUpload from '../widgets/avatar-upload.jsx';
import BadgeList from '../widgets/badge-list.jsx';

import { makeImageUrl } from '../lib/blob-helpers.js';
import { MAX_TITLE_LENGTH, MAX_TOPIC_DESCRIPTION_LENGTH } from '../config.js';

function _clip(str, length) {
  return str && str.substring(0, length);
}

export default class AccountSettingsView extends React.Component {
  constructor(props) {
    super(props);

    const me = this.props.tinode.getMeTopic();
    this.state = {
      fullName: _clip(me.public ? me.public.fn : undefined, MAX_TITLE_LENGTH),
      description: _clip(me.public ? me.public.note : undefined, MAX_TOPIC_DESCRIPTION_LENGTH),
      avatar: makeImageUrl(me.public ? me.public.photo : null)
    };
  }

  render() {
    return (
      <div className="scrollable-panel">
        <div className="panel-form-column">
          <a href="#" className="flat-button float-right" onClick={(e) => {e.preventDefault(); this.props.onNavigate('general');}}>
            <i className="material-icons">edit</i>&nbsp;
            <FormattedMessage id="button_edit" defaultMessage="Edit" description="Call to action [Edit]" />
          </a>
          <center>
            <AvatarUpload
              tinode={this.props.tinode}
              avatar={this.state.avatar}
              readOnly={true}
              uid={this.props.myUserId}
              title={this.state.fullName} />
          </center>
          <div className="group">
            <label className="small">
              <FormattedMessage id="label_your_name" defaultMessage="Your name"
                description="Label for full name editing" />
            </label>
            <div className="large ellipsized">{this.state.fullName}</div>
          </div>
          <div className="group">
            <label className="small"><FormattedMessage id="label_user_id" defaultMessage="ID:"
              description="Label for user address (ID)" /></label>&nbsp;
            <tt>{this.props.myUserId}</tt>
          </div>
          <div className="group">
            <BadgeList trustedBadges={this.props.trustedBadges} />
          </div>
          {this.state.description ?
            <div className="group">
              <label className="small">
                <FormattedMessage id="label_description" defaultMessage="Description"
                  description="Label for editing topic description" />
              </label>
              <div>{this.state.description}</div>
            </div> : null}
        </div>
        <div className="hr" />
        <div className="panel-form-column">
          <a href="#" className="flat-button" onClick={(e) => {e.preventDefault(); this.props.onNavigate('notif');}}>
            <i className="material-icons">notifications</i>&nbsp;<FormattedMessage id="sidepanel_title_acc_notifications"
              defaultMessage="Notifications" description="Sidepanel title for AccNotificationsView." />
          </a>
          <a href="#" className="flat-button" onClick={(e) => {e.preventDefault(); this.props.onNavigate('security');}}>
            <i className="material-icons">security</i>&nbsp;<FormattedMessage id="button_security"
              defaultMessage="Security" description="Navigaton button for security panel." />
          </a>
          <a href="#" className="flat-button" onClick={(e) => {e.preventDefault(); this.props.onNavigate('support');}}>
            <i className="material-icons">contact_support</i>&nbsp;<FormattedMessage id="sidepanel_title_acc_support"
              defaultMessage="Support" description="Sidepanel title for AccSupportView." />
          </a>
        </div>
      </div>
    );
  }
};

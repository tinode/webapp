// Edit account parameters.
import React from 'react';
import { FormattedMessage } from 'react-intl';

import AvatarUpload from '../widgets/avatar-upload.jsx';

import { makeImageDataUrl } from '../lib/blob-helpers.js';

export default class EditAccountView extends React.Component {
  constructor(props) {
    super(props);

    const me = this.props.tinode.getMeTopic();
    this.state = {
      fullName: me.public ? me.public.fn : undefined,
      avatar: makeImageDataUrl(me.public ? me.public.photo : null)
    };
  }

  render() {
    return (
      <div className="scrollable-panel">
        <div className="panel-form-row">
          <div className="panel-form-column">
            <label className="small">
              <FormattedMessage id="label_your_name" defaultMessage="Your name"
                description="Label for full name editing" />
            </label>
            <div className="large">{this.state.fullName}</div>
            <div>
              <label className="small"><FormattedMessage id="label_user_id" defaultMessage="ID:"
                description="Label for user address (ID)" /></label>&nbsp;
              <tt>{this.props.myUserId}</tt>
            </div>
          </div>
          <AvatarUpload
            avatar={this.state.avatar}
            readOnly={!this.state.owner}
            uid={this.props.myUserId}
            title={this.state.fullName} />
        </div>
        <div className="panel-form-row">
          <a href="#" className="flat-button" onClick={(e) => {e.preventDefault(); this.props.onBasicNavigate('general');}}>
            <i className="material-icons">edit</i>&nbsp;
            <FormattedMessage id="button_edit" defaultMessage="Edit" description="Call to action [Edit]" />
          </a>
        </div>
        <div className="hr" />
        <div className="panel-form-column">
          <a href="#" className="flat-button" onClick={(e) => {e.preventDefault(); this.props.onBasicNavigate('notif');}}>
            <i className="material-icons">notifications</i>&nbsp;<FormattedMessage id="sidepanel_title_acc_notifications"
              defaultMessage="Notifications" description="Sidepanel title for AccNotificationsView." />
          </a>
          <a href="#" className="flat-button" onClick={(e) => {e.preventDefault(); this.props.onBasicNavigate('security');}}>
            <i className="material-icons">security</i>&nbsp;<FormattedMessage id="sidepanel_title_acc_security"
              defaultMessage="Security" description="Sidepanel title for AccSecurityView." />
          </a>
          <a href="#" className="flat-button" onClick={(e) => {e.preventDefault(); this.props.onBasicNavigate('support');}}>
            <i className="material-icons">contact_support</i>&nbsp;<FormattedMessage id="sidepanel_title_acc_support"
              defaultMessage="Support" description="Sidepanel title for AccSupportView." />
          </a>
        </div>
      </div>
    );
  }
};

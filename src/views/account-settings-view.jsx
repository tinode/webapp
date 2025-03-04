// Edit account parameters.
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { parsePhoneNumber } from 'libphonenumber-js/mobile';

import AvatarUpload from '../widgets/avatar-upload.jsx';
import BadgeList from '../widgets/badge-list.jsx';

import { makeImageUrl } from '../lib/blob-helpers.js';
import { MAX_TITLE_LENGTH, MAX_TOPIC_DESCRIPTION_LENGTH } from '../config.js';
import CredentialEdit from '../widgets/credential-edit.jsx';

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
      avatar: makeImageUrl(me.public ? me.public.photo : null),
      credentials: me.getCredentials() || [],
      credEdit: undefined,
      alias: ((me.tags() || []).find(tag => tag.startsWith('alias:')) || '').substring(6),
    };
  }

  componentDidMount() {
    const me = this.props.tinode.getMeTopic();
    me.onCredsUpdated = _ => this.setState({credentials: me.getCredentials()});
  }

  componentWillUnmount() {
    const me = this.props.tinode.getMeTopic();
    me.onCredsUpdated = null;
  }

  render() {
    if (this.state.credEdit) {
      return (
        <CredentialEdit
          method={this.state.credEdit.meth}
          val={this.state.credEdit.val}
          done={this.state.credEdit.done}
          onShowCountrySelector={this.props.onShowCountrySelector}
          onCredAdd={this.props.onCredAdd}
          onCredConfirm={this.props.onCredConfirm}
          onCancel={_ => this.setState({credEdit: undefined})}
          onError={this.props.onError} />
      );
    }

    // Count how many times each method is validated.
    const validated = {};
    this.state.credentials.forEach(cred => {
      if (cred.done) {
        validated[cred.meth] = (validated[cred.meth] || 0) + 1;
      }
    });

    const credentials = [];
    this.state.credentials.forEach((cred, idx) => {
      if (!['email', 'tel'].includes(cred.meth)) {
        // Skip unknown methods.
        return ;
      }

      let val = cred.val
      if (cred.meth == 'tel') {
        const number = parsePhoneNumber(cred.val);
        val = number ? number.formatInternational() : cred.val;
      }

      credentials.push(
        <div className="group quoted" key={idx}>
          <tt className="clickable" onClick={e => {e.preventDefault(); this.setState({credEdit: cred});}}>{val}</tt>
          <span> {cred.done ? null : <i className="material-icons">pending</i>}&nbsp;
            {!cred.done || validated[cred.meth] > 1 || this.props.reqCredMethod != cred.meth ?
              <a href="#" onClick={e => {e.preventDefault(); this.props.onCredDelete(cred.meth, cred.val);}}>
                <i className="material-icons">delete</i>
              </a>
            :
            null}
          </span>
        </div>);
    });
    if (credentials.length > 0) {
      // Add title as the first element.
      credentials.unshift(
        <label className="small" key={'title'}>
          <FormattedMessage id="label_user_contacts" defaultMessage="Contacts"
            description="Label for user contacts" />
        </label>);
    }

    return (
      <div className="scrollable-panel">
        <div className="panel-form-column">
          <a href="#" className="flat-button float-right" onClick={e => {e.preventDefault(); this.props.onNavigate('general');}}>
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
          {this.state.alias ?
          <div className="group">
            <label className="small"><FormattedMessage id="label_alias" defaultMessage="Alias:"
              description="Label for user or topic alias" /></label>&nbsp;
            <tt>@{this.state.alias}</tt>
          </div> : null}
          <div className="group">
            <BadgeList trustedBadges={this.props.trustedBadges} />
          </div>
          {this.state.description ?
            <div className="group">
              <label className="small">
                <FormattedMessage id="label_description" defaultMessage="Description"
                  description="Label for editing topic description" />
              </label>
              <div className="quoted">{this.state.description}</div>
            </div> : null}
        </div>
        <div className="hr" />
        <div className="panel-form-column">
          <div className="group">{credentials}</div>
        </div>
        <div className="hr" />
        <div className="panel-form-column">
          <a href="#" className="flat-button" onClick={e => {e.preventDefault(); this.props.onNavigate('notif');}}>
            <i className="material-icons">notifications</i>&nbsp;<FormattedMessage id="sidepanel_title_acc_notifications"
              defaultMessage="Notifications" description="Sidepanel title for AccNotificationsView." />
          </a>
          <a href="#" className="flat-button" onClick={e => {e.preventDefault(); this.props.onNavigate('security');}}>
            <i className="material-icons">security</i>&nbsp;<FormattedMessage id="button_security"
              defaultMessage="Security" description="Navigaton button for security panel." />
          </a>
          <a href="#" className="flat-button" onClick={e => {e.preventDefault(); this.props.onNavigate('support');}}>
            <i className="material-icons">contact_support</i>&nbsp;<FormattedMessage id="sidepanel_title_acc_support"
              defaultMessage="Support" description="Sidepanel title for AccSupportView." />
          </a>
        </div>
      </div>
    );
  }
};

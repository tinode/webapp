// Edit account parameters.
import React from 'react';
import { FormattedMessage } from 'react-intl';

import Tinode from 'tinode-sdk';

import { APP_NAME, LINK_CONTACT_US, LINK_PRIVACY_POLICY, LINK_TERMS_OF_SERVICE } from '../config.js';

export default class AccSupportView extends React.PureComponent {
  render() {
    return (
      <div className="scrollable-panel">
        <div className="panel-form-column">
          <a href={LINK_CONTACT_US} className="flat-button" target="_blank">
            <i className="material-icons">email</i> &nbsp;<FormattedMessage id="link_contact_us"
              defaultMessage="Contact Us" description="Ancor text for contacting us by email" />
          </a>
          <a href={LINK_TERMS_OF_SERVICE} className="flat-button" target="_blank">
            <i className="material-icons">description</i> &nbsp;<FormattedMessage id="link_terms_of_service"
              defaultMessage="Terms of Service" description="Ancor text for terms of service link" />
          </a>
          <a href={LINK_PRIVACY_POLICY} className="flat-button" target="_blank">
            <i className="material-icons">policy</i> &nbsp;<FormattedMessage id="link_privacy_policy"
              defaultMessage="Privacy Policy" description="Ancor text for privacy policy link" />
          </a>
        </div>
        <div className="hr" />
        <div className="panel-form-column">
          <div className="panel-form-row">
            <label className="small"><FormattedMessage id="label_client" defaultMessage="Client:"
              description="Label for a client version" /></label>
            {APP_NAME}
          </div>
          <div className="panel-form-row">
            <label className="small"><FormattedMessage id="label_sdk" defaultMessage="SDK:" /></label>
            {Tinode.getLibrary()}
          </div>
          <div className="panel-form-row">
            <label className="small"><FormattedMessage id="label_server" defaultMessage="Server:"
              description="Label for a server version" /></label>
            {this.props.serverVersion}
          </div>
          <div className="panel-form-row">
            <label className="small"><FormattedMessage id="label_server_address" defaultMessage="Server address:" /></label>
            {this.props.serverAddress}
          </div>
        </div>
      </div>
    );
  }
};

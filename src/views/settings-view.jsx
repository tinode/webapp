// Tinode config panel.
import React from 'react';
import { FormattedMessage } from 'react-intl';

import CheckBox from '../widgets/checkbox.jsx';

import HostSelector from '../widgets/host-selector.jsx';

export default class SettingsView extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      transport: props.transport || 'def',
      serverAddress: props.serverAddress,
      secureConnection: props.secureConnection,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTransportSelected = this.handleTransportSelected.bind(this);
    this.handleServerAddressChange = this.handleServerAddressChange.bind(this);
    this.handleToggleSecure = this.handleToggleSecure.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.onUpdate({
      transport: this.state.transport,
      serverAddress: this.state.serverAddress,
      secureConnection: this.state.secureConnection,
    });
  }

  handleTransportSelected(e) {
    this.setState({transport: e.currentTarget.value});
  }

  handleServerAddressChange(name) {
    this.setState({serverAddress: name});
  }

  handleToggleSecure(e) {
    this.setState({secureConnection: !this.state.secureConnection});
  }

  render() {
    const names = {def: "default", ws: "websocket", lp: "long polling"};
    const transportOptions = [];
    ['def', 'ws', 'lp'].forEach(item => {
      const id = 'transport-' + item;
      const name = names[item];
      transportOptions.push(
        <li key={item}>
          <input type="radio" id={id} name="transport-select" value={item}
            checked={this.state.transport === item}
            onChange={this.handleTransportSelected} />
          <label htmlFor={id}>{name}</label>
        </li>
      );
    });

    return (
      <form id="settings-form" className="panel-form" onSubmit={this.handleSubmit}>
        <div className="panel-form-row">
          <label className="small">
            <FormattedMessage id="label_server_to_use" defaultMessage="Server to use:"
              description="Label for server selector in SettingsView" />
          </label>
        </div>
        <HostSelector serverAddress={this.state.serverAddress} onServerAddressChange={this.handleServerAddressChange} />
        <div className="panel-form-row">
          <CheckBox id="secure-connection" name="secure-connection" checked={this.state.secureConnection}
            className="quoted" onChange={this.handleToggleSecure} /><label htmlFor="secure-connection">
            <FormattedMessage id="label_use_secure_connection" defaultMessage="Use secure connection"
              description="Label for WS/WSS connection type in SettingsView" />
          </label>
        </div>
        <div className="panel-form-row">
          <label className="small">
            <FormattedMessage id="label_wire_transport" defaultMessage="Wire transport:"
              description="Label for wire transport selection in SettingsView" />
          </label>
        </div>
        <div className="panel-form-row">
          <ul className="quoted">
            {transportOptions}
          </ul>
        </div>
        <div className="dialog-buttons">
          <button type="submit" className="primary">
            <FormattedMessage id="button_update" defaultMessage="Update"
              description="Button [Update]" />
          </button>
        </div>
      </form>
    );
  }
};

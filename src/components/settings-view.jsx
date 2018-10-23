// Tinode config panel.
import React from 'react';

import HostSelector from './host-selector.jsx';

export default class SettingsView extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      transport: props.transport || 'def',
      serverAddress: props.serverAddress,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTransportSelected = this.handleTransportSelected.bind(this);
    this.handleServerAddressChange = this.handleServerAddressChange.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.onUpdate({
      transport: this.state.transport,
      serverAddress: this.state.serverAddress
    });
  }

  handleTransportSelected(e) {
    this.setState({transport: e.currentTarget.value});
  }

  handleServerAddressChange(name) {
    this.setState({serverAddress: name});
    this.props.onServerAddressChange(name);
  }

  render() {
    var names = {def: "default", ws: "websocket", lp: "long polling"};
    var transportOptions = [];
    var instance = this;
    ['def', 'ws', 'lp'].map(function(item){
      var id = 'transport-' + item;
      var name = names[item];
      transportOptions.push(
        <li key={item}>
          <input type="radio" id={id} name="transport-select" value={item}
            checked={instance.state.transport === item}
            onChange={instance.handleTransportSelected} />
          <label htmlFor={id}>{name}</label>
        </li>
      );
    });

    return (
      <form id="settings-form" className="panel-form" onSubmit={this.handleSubmit}>
        <div className="panel-form-row">
          <label className="small">Server to use:</label>
        </div>
        <HostSelector serverAddress={this.state.serverAddress}
          onServerAddressChange={this.handleServerAddressChange} />
        <div className="panel-form-row">
          <label className="small">Wire transport:</label>
        </div>
        <div className="panel-form-row">
          <ul className="quoted">
            {transportOptions}
          </ul>
        </div>
        <div className="dialog-buttons">
          <button type="submit" className="blue">Update</button>
        </div>
      </form>
    );
  }
};

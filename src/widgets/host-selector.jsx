import React from 'react';

import { KNOWN_HOSTS } from '../config.js';

/* Combobox for selecting host name */

export default class HostSelector extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      hostName: props.serverAddress,
      changed: false
    };

    this.handleHostNameChange = this.handleHostNameChange.bind(this);
    this.handleEditingFinished = this.handleEditingFinished.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleHostNameChange(e) {
    this.setState({hostName: e.target.value, changed: true});
  }

  handleEditingFinished() {
    if (this.state.changed) {
      this.setState({changed: false});
      this.props.onServerAddressChange(this.state.hostName.trim());
    }
  }

  handleKeyDown(e) {
    if (e.key == 'Enter') {
      this.handleEditingFinished();
    }
  }

  render() {
    const hostOptions = [];
    for (let key in KNOWN_HOSTS) {
      let item = KNOWN_HOSTS[key];
      hostOptions.push(
        <option key={item} value={item} />
      );
    }
    return (
      <div className="panel-form-row">
        <input type="search" id="host-name" placeholder={this.props.hostName} list="known-hosts"
          className="quoted" value={this.state.hostName} onChange={this.handleHostNameChange}
          onBlur={this.handleEditingFinished}
          onKeyDown={this.handleKeyDown} required />
        <datalist id="known-hosts">
          {hostOptions}
        </datalist>
      </div>
    );
  }
}

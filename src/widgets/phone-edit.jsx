// Editor for a phone number.

import React from 'react';
import { injectIntl } from 'react-intl';
import * as dcodes from '../dcodes.json';
import { flagEmoji } from '../lib/strformat';

class PhoneEdit extends React.PureComponent {
  constructor(props) {
    super(props);

    this.codeMap = {};
    dcodes.default.forEach(dc => { this.codeMap[dc.code] = dc.dial; });

    this.state = {
      countryCode: props.countryCode || 'US',
      dialCode: this.codeMap[props.countryCode || 'US'],
      localNumber: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleFinished = this.handleFinished.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.showCountrySelector = this.showCountrySelector.bind(this);
  }

  handleChange(e) {
    this.setState({localNumber: this.filterNumber(e.target.value)});
  }

  handleFinished(e) {
    e.preventDefault();
    this.props.onSubmit(this.state.localNumber.trim());
  }

  handleClear(e) {
    e.preventDefault();
    const countryCode = this.props.countryCode || 'US';
    this.setState({localNumber: '', countryCode: countryCode, dialCode: this.codeMap[countryCode || 'US']});
  }

  handleKeyDown(e) {
    if (e.key === 'Enter') {
      this.handleFinished(e);
    } else if (e.key === 'Escape') {
      this.handleClear(e);
    }
  }

  showCountrySelector() {
    this.props.onShowCountrySelector(this.state.countryCode, this.state.dialCode);
  }

  // Filter out characters not permitted in a phone number.
  filterNumber(number) {
    if (!number) {
      return number;
    }
    // Leave numbers, space, (, ), -, and .
    // The + is not allowed: it's handled by the country code portion.
    return number.replace(/[^-\s().\d]/g, '');
  }

  render() {
    return (
      <div className="panel-form-row">
        <span className="dial-code" onClick={this.showCountrySelector}>
          <span className="country-flag">{flagEmoji(this.state.countryCode)}&nbsp;</span>
          +{this.state.dialCode}&nbsp;</span>
        <input type="tel" placeholder={this.state.placeholder}
            value={this.state.localNumber} onChange={this.handleChange}
            maxLength={17} onKeyDown={this.handleKeyDown} required autoFocus={this.props.autoFocus} />
        {this.state.localNumber ?
          <a href="#" onClick={this.handleClear}><i className="material-icons">highlight_off</i></a>
          : <span><i className="material-icons">&nbsp;</i></span>}
      </div>
    );
  }
}

export default injectIntl(PhoneEdit);

// Editor for a phone number.

import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { AsYouType, getExampleNumber, parsePhoneNumber } from 'libphonenumber-js/mobile';
import examples from 'libphonenumber-js/mobile/examples'

import * as dcodes from '../dcodes.json';
import { flagEmoji } from '../lib/strformat';

const messages = defineMessages({
  mobile_number_required: {
    id: 'mobile_number_required',
    defaultMessage: 'Mobile phone number required',
    description: 'Error message'
  }
});

class PhoneEdit extends React.PureComponent {
  constructor(props) {
    super(props);

    this.codeMap = {};
    dcodes.default.forEach(dc => { this.codeMap[dc.code] = dc.dial; });

    const code = props.countryCode || 'US';
    const dial = this.codeMap[code];

    this.state = {
      countryCode: code,
      dialCode: dial,
      localNumber: '',
      placeholderNumber: this.placeholderNumber(code, dial)
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleFinished = this.handleFinished.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.showCountrySelector = this.showCountrySelector.bind(this);
  }

  handleChange(e) {
    const prefix = `+${this.state.dialCode}`;
    let formatted = new AsYouType().input(`${prefix}${this.filterNumber(e.target.value)}`);
    formatted = formatted.substring(prefix.length).trim();
    this.setState({localNumber: formatted});
  }

  handleFinished(e) {
    e.preventDefault();
    const raw = `${this.state.dialCode}${this.state.localNumber.trim()}`.replace(/[^\d]/g, '');
    let number = null;
    try {
      number = parsePhoneNumber(`+${raw}`);
    } catch (err) {}

    if (!number || !number.isValid()) {
      this.inputField.setCustomValidity(this.props.intl.formatMessage(messages.mobile_number_required));
      return;
    }

    this.inputField.setCustomValidity('');
    this.props.onSubmit(number.format('E.164'));
  }


  handleKeyDown(e) {
    if (e.key === 'Enter') {
      this.handleFinished(e);
    }
  }

  showCountrySelector() {
    this.props.onShowCountrySelector(this.state.countryCode, this.state.dialCode,
      (code, dial) => {
          this.setState({
            countryCode: code,
            dialCode: dial,
            placeholderNumber: this.placeholderNumber(code, dial)
        })
      });
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

  placeholderNumber(code, dial) {
    const sample = getExampleNumber(code, examples);
    return sample ? sample.formatInternational().substring(dial.length + 1).trim() : '123 0123';
  }

  render() {
    return (
      <>
        <span className="dial-code" onClick={this.showCountrySelector}>
          <span className="country-flag">{flagEmoji(this.state.countryCode)}&nbsp;</span>
          +{this.state.dialCode}&nbsp;</span>
        <input type="tel" ref={ref => {this.inputField = ref}} placeholder={this.state.placeholderNumber}
            value={this.state.localNumber} onChange={this.handleChange}
            maxLength={17} onKeyDown={this.handleKeyDown} onBlur={this.handleFinished}
            required autoFocus={this.props.autoFocus} />
      </>
    );
  }
}

export default injectIntl(PhoneEdit);

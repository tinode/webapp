// Selector for country dialing code.

import React from 'react';
import { injectIntl } from 'react-intl';

import * as dcodes from '../dcodes.json';

import { flagEmoji } from '../lib/strformat';

class PhoneCountrySelector extends React.PureComponent {
  constructor(props) {
    super(props);

    this.countries = [];
    const { formatDisplayName } = props.intl;
    dcodes.default.forEach(dc => {
      const parts = dc.dial.split(',');
      parts.forEach(part => {
        this.countries.push({
          dial: part.trim(),
          code: dc.code,
          flag: flagEmoji(dc.code),
          name: formatDisplayName(dc.code, {type: 'region'})
        });
      });
    });

    this.countries.sort((a, b) => a.name.localeCompare(b.name));
  }

  componentDidMount() {
    if (this.selectedRef) {
      this.selectedRef.scrollIntoView({block: 'center', inline: 'nearest'});
    }
  }

  render() {
    const countries = [];
    const selected = this.props.selected || 'US';
    this.countries.forEach((c, idx) => {
      const style = (c.code == selected ? 'selected ' : '');
      countries.push(<li className={style} key={idx}
        ref={ref => {if (c.code == selected) {this.selectedRef = ref}}}
        onClick={_ => this.props.onSubmit(c.code, c.dial)}>
        <span className="country-flag">{c.flag}</span>
        <span className="country">&nbsp;{c.name}</span>
        <span className="dial-code">&nbsp;+{c.dial}</span>
      </li>);
    });

    return (
      <div className="scrollable-panel" style={{height: '30rem'}}>
        <ul className="phone-country-selector">
          {countries}
        </ul>
      </div>
    );
  }
}

export default injectIntl(PhoneCountrySelector);

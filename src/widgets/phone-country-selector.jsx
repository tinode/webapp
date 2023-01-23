// Selector for country dialing code.

import React from 'react';
import { FormattedDisplayName } from 'react-intl';
import * as dcodes from '../dcodes.json';
import { flagEmoji } from '../lib/strformat';

export default class PhoneCountrySelector extends React.PureComponent {
  constructor(props) {
    super(props);

    this.codeMap = {};
    dcodes.default.forEach(dc => { this.codeMap[dc.code] = dc.dial; });

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    this.props.onSubmit(e.target.dataset.code, e.target.dataset.dial);
  }

  render() {
    const countries = [];
    const selected = this.props.selected || 'US';
    dcodes.default.forEach((dc, idx) => {
      const style = (dc.code == selected ? 'selected ' : '');
      countries.push(<li className={style} key={idx} data-code={dc.code} data-dial={dc.dial} onClick={this.handleClick}>
        <span  className="country-flag">{flagEmoji(dc.code)}</span>&nbsp;
        <FormattedDisplayName type="region" value={dc.code} />
        &nbsp;<span className="dial-code">+{dc.dial}</span>
      </li>);
    });

    return (
      <div className="scrollable-panel">
        <ul className="phone-country-selector">
          {countries}
        </ul>
      </div>
    );
  }
}

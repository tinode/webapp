// Send message form.
import React from 'react';
import { injectIntl } from 'react-intl';
import { Drafty } from 'tinode-sdk';

import { previewFormatter } from '../lib/formatters.js';

class PinnedMessages extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleCancel = this.handleCancel.bind(this);
    this.handleSelected = this.handleSelected.bind(this);
  }

  handleCancel(e) {
    e.preventDefault();
    this.props.onCancel(this.props.messages[this.props.selected].seq);
  }

  handleSelected(e) {
    e.preventDefault();
    this.props.onSelected(this.props.messages[this.props.selected].seq);
  }

  render() {
    let shown = (this.props.messages || [])[this.props.selected];
    shown = shown ? Drafty.format(shown.content, previewFormatter, {
      formatMessage: this.props.intl.formatMessage.bind(this.props.intl),
      authorizeURL: this.props.tinode.authorizeURL.bind(this.props.tinode)
    }) : null;

    const dots = [];
    this.props.messages.forEach(_ => {
      const cn = dots.length == this.props.selected ? 'adot' : 'dot';
      dots.push(<div key={dots.length} className={cn} />);
    });

    return shown ?
      (<div id="pinned-wrapper">
        <div className="cancel">
          <a href="#" onClick={this.handleCancel}><i className="material-icons gray">close</i></a>
        </div>
        <div className="pinned-scroll">{dots}</div>
        <div className="pinned" onClick={this.handleSelected}>{shown}</div>
      </div>) : null;
  }
}

export default injectIntl(PinnedMessages);

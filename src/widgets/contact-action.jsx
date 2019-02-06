// A panel included into a list of contacts with an action text.
import React from 'react';
import { injectIntl } from 'react-intl';

class ContactAction extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.onAction(this.props.action);
  }

  render() {
    const {formatMessage} = this.props.intl;
    return (
      <li onClick={this.handleClick} className="action">
        <div className="action-text">{formatMessage(this.props.title, this.props.values)}</div>
      </li>
    );
  }
};

export default injectIntl(ContactAction);

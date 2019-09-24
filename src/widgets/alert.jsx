import React from 'react';
import { FormattedMessage } from 'react-intl';

export default class Alert extends React.PureComponent {
  render() {
    return this.props.visible ?
      <div className="alert-container">
        <div className="alert">
          <div className="title">{this.props.title}</div>
          <div className="content">{this.props.content}</div>
          <div className="dialog-buttons">
            {this.props.onReject ?
              <button className="outline" onClick={this.props.onReject}>
                {this.props.reject || <FormattedMessage id="button_cancel" />}
              </button>
              :
              null
            }
            <button className="blue" onClick={this.props.onConfirm}>
              {this.props.confirm || <FormattedMessage id="button_ok" />}
            </button>
          </div>
        </div>
      </div>
    :
    null;
  }
};

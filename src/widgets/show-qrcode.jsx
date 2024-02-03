import QRCode from 'qrcodejs';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { QRCODE_SIZE } from '../config';

export default class ShowQRCode extends React.PureComponent {
  constructor(props) {
    super(props);
    this.qrCodeRef = React.createRef();
  }

  componentDidMount() {
    new QRCode(this.qrCodeRef.current, {
      text: this.props.uri,
      width: QRCODE_SIZE,
      height: QRCODE_SIZE,
    });
  }

  render() {
    return (
      <div className="panel-form-column">
        <br />
        <div className="qr-code" ref={this.qrCodeRef} />
        <div className="dialog-buttons">
          <button className="outline" onClick={this.props.onCancel}>
            <FormattedMessage id="button_ok" defaultMessage="OK" description="Button [OK]" />
          </button>
        </div>
      </div>
    );
  }
};

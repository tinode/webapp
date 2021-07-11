// Edit account parameters.
import React from 'react';
import { FormattedMessage } from 'react-intl';

import Cropper from '../widgets/cropper.jsx';

export default class AvatarCropView extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    if (this.props.onSubmit) {
      this.props.onSubmit();
    }
  }

  render() {
    return (
      <div className="panel-form">
        <div className="panel-form-row">
          <Cropper source={this.props.avatar} />
        </div>
        <div className="dialog-buttons">
          <button className="primary" onClick={this.handleSubmit}>
            <FormattedMessage id="button_ok"
              defaultMessage="OK" description="Button [OK]" />
          </button>
        </div>
      </div>
    );
  }
};

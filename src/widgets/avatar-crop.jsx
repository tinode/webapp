// Edit account parameters.
import React from 'react';
import { FormattedMessage } from 'react-intl';

import Cropper from './cropper.jsx';
import { imageCrop } from '../lib/blob-helpers.js';

export default class AvatarCrop extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      top: 0,
      left: 0,
      width: 0,
      height: 0,
      scale: 1
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  // Cut out in image coordinates and desired scale factor.
  handleChange(left, top, width, height, scale) {
    this.setState({
      left: left,
      top: top,
      width: width,
      height: height,
      scale: scale
    });
  }

  handleSubmit() {
    imageCrop(this.props.mime, this.props.avatar,
      this.state.left, this.state.top, this.state.width, this.state.height,
      this.state.scale)
      .then(img => {
        this.props.onSubmit(img.mime, img.blob, img.width, img.height);
      })
      .catch(err => {
        this.props.onError(err);
      });
  }

  render() {
    return (
      <div className="panel-form">
        <div className="panel-form-row">
          <Cropper
            source={this.props.avatar}
            onChange={this.handleChange} />
        </div>
        <div className="dialog-buttons">
          {this.props.onCancel ?
            <button className="secondary" onClick={this.props.onCancel}>
              <FormattedMessage id="button_cancel" defaultMessage="Cancel" description="Button [Cancel]" />
            </button>
            : null}
          <button className="primary" onClick={this.handleSubmit}>
            <FormattedMessage id="button_ok" defaultMessage="OK" description="Button [OK]" />
          </button>
        </div>
      </div>
    );
  }
};

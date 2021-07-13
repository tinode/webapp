// Edit account parameters.
import React from 'react';
import { FormattedMessage } from 'react-intl';

import Cropper from '../widgets/cropper.jsx';
import { imageCrop } from '../lib/blob-helpers.js';

/*
crop: {
  id: 'sidepanel_title_crop',
  description: 'Sidepanel title for AvatarCropView.',
  defaultMessage: 'Drag to Adjust'
},
*/

export default class AvatarCropView extends React.PureComponent {
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
  handleChange(top, left, width, height, scale) {
    this.setState({
      top: top,
      left: left,
      width: width,
      height: height,
      scale: scale
    });
  }

  handleSubmit() {
    console.log(this.state);
    imageCrop(this.props.mime, this.props.avatar, this.state.top,
      this.state.left, this.state.width, this.state.height, this.state.scale,
      (mime, blob, width, height) => {
        this.props.onSubmit(mime, blob, width, height);
      },
      (err) => {
        this.props.onError(err);
      }
    );
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
          <button className="primary" onClick={this.handleSubmit}>
            <FormattedMessage id="button_ok"
              defaultMessage="OK" description="Button [OK]" />
          </button>
        </div>
      </div>
    );
  }
};

import React from 'react';

import LetterTile from './letter-tile.jsx';
import LoadSpinner from './load-spinner.jsx';

import { AVATAR_SIZE, IMAGE_PREVIEW_DIM, MAX_AVATAR_BYTES, MAX_EXTERN_ATTACHMENT_SIZE,
  MAX_INBAND_ATTACHMENT_SIZE } from '../config.js';
import { imageScaled, blobToBase64, makeImageDataUrl } from '../lib/blob-helpers.js';

export default class AvatarUpload extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataUrl: props.avatar,
      uploading: false
    };

    this.handleFileUpload = this.handleFileUpload.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.avatar != prevProps.avatar) {
      this.setState({dataUrl: this.props.avatar});
    }
  }

  handleFileUpload(e) {
    const image = e.target.files[0];
    if (image.size > MAX_AVATAR_BYTES) {
      // Too large to send inband - uploading out of band and sending as a link.
      const uploader = this.props.tinode.getLargeFileHelper();
      if (!uploader) {
        this.props.onError(this.props.intl.formatMessage(messages.cannot_initiate_upload));
        return;
      }

      uploader.upload(image)
        .then(() => {})
        .catch((err) => {
          this.props.onError(err, 'err');
        })
        .finally(() => {
          this.setState({uploading: false});
        });
    } else {
      imageScaled(image, AVATAR_SIZE, AVATAR_SIZE, MAX_EXTERN_ATTACHMENT_SIZE, true,
        // Image successfully scaled and converted.
        (mime, blob) => {
          // Convert blob to base64-encoded bits.
          blobToBase64(blob, (unused, base64bits) => {
            const du = makeImageDataUrl({data: base64bits, type: mime});
            this.setState({dataUrl: du});
            this.props.onImageChanged(du);
          });
        },
        // Failure
        (err) => {
          this.props.onError(err, 'err');
        });
    }
    // Clear the value so the same file can be uploaded again.
    e.target.value = '';
  }

  render() {
    // Randomize id value in case more than one AvatarUpload is shown
    // at the same time.
    const randId = 'file-input-avatar-' + (Math.random() + '').substr(2);
    const className = 'avatar-upload' + (this.props.readOnly ? ' read-only' : '');
    return (
      <div className={className}>
        {this.props.readOnly || !this.state.dataUrl ?
          null :
          <a href="#" className="clear-avatar" onClick={(e) => {e.preventDefault(); this.props.onImageChanged(null);}}>
            <i className="material-icons">clear</i>
          </a>}
        {this.state.dataUrl ?
          <img src={this.state.dataUrl} className="preview" /> :
          this.props.readOnly && this.props.uid ?
            <div className="avatar-box">
              <LetterTile
                avatar={true}
                topic={this.props.uid}
                title={this.props.title} />
            </div>
            :
            <div className="blank">{AVATAR_SIZE}&times;{AVATAR_SIZE}</div>}
        {this.props.readOnly ? null :
          <input type="file" id={randId} className="inputfile hidden"
            accept="image/*" onChange={this.handleFileUpload} />}
        {this.props.readOnly ? null :
        <label htmlFor={randId} className="round">
          <i className="material-icons">file_upload</i>
        </label>}
        <LoadSpinner show={this.state.uploading} large={true} clear={true} centered={true} />
      </div>
    );
  }
};

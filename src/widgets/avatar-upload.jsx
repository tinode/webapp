import React from 'react';

import LetterTile from './letter-tile.jsx';
import LoadSpinner from './load-spinner.jsx';

import { sanitizeUrlForMime } from '../lib/utils.js';

import { AVATAR_SIZE } from '../config.js';

export default class AvatarUpload extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      source: props.avatar
    };

    this.handleFileReceived = this.handleFileReceived.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.avatar != prevProps.avatar) {
      this.setState({source: this.props.avatar});
    }
  }

  handleFileReceived(e) {
    const image = e.target.files[0];
    this.props.onImageUpdated(image.type, URL.createObjectURL(image), image.name);
    // Clear the value so the same file can be uploaded again.
    e.target.value = '';
  }

  render() {
    // Randomize id value in case more than one AvatarUpload is shown
    // at the same time.
    const randId = 'file-input-avatar-' + ('' + Math.random()).substring(0, 4);
    const className = 'avatar-upload' + (this.props.readOnly ? ' read-only' : '');
    return (
      <div className={className}>
        {this.props.readOnly || !this.state.source ?
          null :
          <a href="#" className="clear-avatar" onClick={(e) => {e.preventDefault(); this.props.onImageUpdated();}}>
            <i className="material-icons">clear</i>
          </a>}
        {this.state.source ?
          <img src={this.props.tinode.authorizeURL(sanitizeUrlForMime(this.state.source, 'image'))} className="preview" /> :
          this.props.readOnly && this.props.uid ?
            <div className="avatar-box">
              <LetterTile
                tinode={this.props.tinode}
                avatar={true}
                topic={this.props.uid}
                title={this.props.title} />
            </div>
            :
            <div className="blank">{AVATAR_SIZE}&times;{AVATAR_SIZE}</div>}
        {this.props.readOnly ? null :
          <input type="file" id={randId} className="inputfile hidden"
            accept="image/*" onChange={this.handleFileReceived} />}
        {this.props.readOnly ? null :
        <label htmlFor={randId} className="round">
          <i className="material-icons">file_upload</i>
        </label>}
        <LoadSpinner show={this.props.uploading} large={true} clear={true} centered={true} />
      </div>
    );
  }
};

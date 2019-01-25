import React from 'react';
import { FormattedMessage } from 'react-intl';

import { REM_SIZE } from '../config.js';
import { fitImageSize } from '../lib/blob-helpers.js';
import { bytesToHumanSize } from '../lib/strformat.js';

export default class ImagePreview extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.setState({
      width: this.container.clientWidth,
      height: this.container.clientHeight
    });
  }

  render() {
    if (!this.props.content) {
      return null;
    }
    const instance = this;
    const dim = fitImageSize(this.props.content.width, this.props.content.height,
      this.state.width, this.state.height, false);
    const size = dim ? { width: dim.dstWidth + 'px', height: dim.dstHeight + 'px' } :
      ((this.props.content.width > this.props.content.height) ? {width: '100%'} : {height: '100%'});
    size.maxWidth = '100%';
    size.maxHeight = '100%';

    let filename = this.props.content.filename;
    const maxlength = (this.props.content.width / REM_SIZE) | 0;
    if (filename.length > maxlength) {
      filename = filename.slice(0, maxlength-2) + '...' + filename.slice(2-maxlength);
    }
    const width = this.props.content.width || '-';
    const height = this.props.content.height || '-';
    return (
      <div id="image-preview" onClick={this.props.onClose}>
        <div id="image-preview-caption-panel">
          <a href={this.props.content.url} download={this.props.content.filename}>
            <i className="material-icons">file_download</i> <FormattedMessage
              id="download_action" defaultMessage="download" description="Call to action [download]" />
          </a>
          <a href="javascript:;" onClick={this.props.onClose}><i className="material-icons gray">close</i></a>
        </div>
        <div id="image-preview-container" ref={function(ref) {instance.container = ref;}}>
          <img src={this.props.content.url} style={size} />
        </div>
        <div id="image-preview-footer">
          <div>
            <div><b><FormattedMessage id="label_file_name" defaultMessage="File name:"
              description="Label for a file name" /></b></div>
            <div><span title={this.props.content.filename}>{filename ? filename : '-'}</span></div>
          </div>
          <div>
            <div><b><FormattedMessage id="label_content_type" defaultMessage="Content type:"
              description="Label for file content type (mime)" /></b></div>
            <div>{this.props.content.type}</div>
          </div>
          <div>
            <div><b><FormattedMessage id="label_size" defaultMessage="Size:"
              description="Label for file size" /></b></div>
            <div>{width} &times; {height} px; {bytesToHumanSize(this.props.content.size)}</div>
          </div>
        </div>
      </div>
    );
  }
};

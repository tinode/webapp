import React from 'react';
import { FormattedMessage } from 'react-intl';

import FileProgress from './file-progress.jsx';
import { bytesToHumanSize } from '../lib/strformat.js';
import { isUrlRelative, sanitizeUrl } from '../lib/utils.js';

export default class Attachment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      downloader: null,
      progress: 0
    };

    this.downloadFile = this.downloadFile.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  downloadFile(url, filename, mimetype) {
    var downloader = this.props.tinode.getLargeFileHelper();
    this.setState({downloader: downloader});
    downloader.download(url, filename, mimetype, (loaded) => {
      this.setState({progress: loaded / this.props.size});
    }).then(() => {
      this.setState({downloader: null, progress: 0});
    }).catch((err) => {
      if (err) {
        this.props.onError("Error downloading file: " + err.message, 'err');
      }
      this.setState({downloader: null, progress: 0});
    });
  }

  handleCancel() {
    if (this.props.uploader) {
      this.props.onCancelUpload();
    } else if (this.state.downloader) {
      this.state.downloader.cancel();
    }
  }

  render() {
    let filename = this.props.filename || 'file_attachment';
    if (filename.length > 36) {
      filename = filename.substr(0, 16) + '...' + filename.substr(-16);
    }
    let size = this.props.size > 0 ?
      <span className="small gray">({bytesToHumanSize(this.props.size)})</span> :
      null;

    // Detect if the download URL is relative or absolute.
    // If the URL is relative use LargeFileHelper to attach authentication
    // credentials to the request.
    let url, helperFunc;
    if (!this.props.uploader && !this.state.downloader && isUrlRelative(this.props.downloadUrl)) {
      // Relative URL. Use download helper.
      url = '#';
      helperFunc = (e) => {
        e.preventDefault();
        this.downloadFile(this.props.downloadUrl, this.props.filename, this.props.mimetype);
      };
    } else {
      url = sanitizeUrl(this.props.downloadUrl) || 'about:blank';
      helperFunc = null;
    }
    return (
      <div className="attachment">
        <div><i className="material-icons big gray">insert_drive_file</i></div>
        <div className="flex-column">
          <div>{filename} {size}</div>
          {this.props.uploader || this.state.downloader ?
            <FileProgress progress={this.props.uploader ? this.props.progress : this.state.progress}
              onCancel={this.handleCancel} />
            :
            <div><a href={url} download={this.props.filename} onClick={helperFunc} >
              <i className="material-icons">file_download</i> <FormattedMessage id="save_attachment"
                defaultMessage="save" description="Call to save an attachment" />
            </a></div>
          }
        </div>
      </div>
    );
  }
};

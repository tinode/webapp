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
    if (!url) {
      this.props.onError("Invalid download URL '" + url + "'");
      return;
    }

    const downloader = this.props.tinode.getLargeFileHelper();
    this.setState({downloader: downloader});
    downloader.download(url, filename, mimetype,
      (loaded) => {
        this.setState({progress: loaded / this.props.size});
      },
      (err) => {
        this.props.onError(err, 'err');
      }
    ).then(() => {
      this.setState({downloader: null, progress: 0});
    }).catch((err) => {
      if (err) {
        this.props.onError("Error downloading file: " + err.message, 'err');
      }
      this.setState({downloader: null, progress: 0});
    });
  }

  handleCancel() {
    if (this.props.uploading) {
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
    if (!this.props.uploading && !this.state.downloader && isUrlRelative(this.props.downloadUrl)) {
      // Relative URL. Use download helper.
      url = '#';
      helperFunc = (e) => {
        e.preventDefault();
        this.downloadFile(this.props.downloadUrl, this.props.filename, this.props.mimetype);
      };
    } else {
      url = sanitizeUrl(this.props.downloadUrl);
      helperFunc = null;
    }
    const downloadWidget = <><i className="material-icons">file_download</i> <FormattedMessage id="save_attachment"
      defaultMessage="save" description="Call to save an attachment" /></>;
    return (
      <div className="attachment">
        <div><i className="material-icons big gray">insert_drive_file</i></div>
        <div className="flex-column">
          <div>{filename} {size}</div>
          {this.props.uploading || this.state.downloader ?
            <FileProgress progress={this.props.uploading ? this.props.progress : this.state.progress}
              onCancel={this.handleCancel} />
            :
            <div>{url ?
              <a href={url} download={this.props.filename} onClick={helperFunc}>{downloadWidget}</a>
              :
              <span className="light-gray">{downloadWidget}</span>
            }</div>
          }
        </div>
      </div>
    );
  }
};

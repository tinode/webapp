// Image view with progress bar and a cancel button.
import React from 'react';
import { FormattedMessage } from 'react-intl';

import FileProgress from './file-progress.jsx';

export default class UploadingImage extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="inline-image">
        <img src={this.props.src} />
        <FileProgress progress={this.props.progress} onCancel={this.props.onCancelUpload} />
      </div>
    );
  }
};

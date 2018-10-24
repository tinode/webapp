import React from 'react';

/* File uload/download progress indicator with a cancel inside */

export default class FileProgress extends React.PureComponent {
  render() {
    return (
      <div className="uploader">
        <div><span style={{width: (this.props.progress * 100) + "%"}}></span></div>
        {this.props.progress < 0.999 ?
          <a href="javascript:;" onClick={this.props.onCancel}><i className="material-icons">close</i> cancel</a>
          :
          <span>finishing...</span>
        }
      </div>
    );
  }
}

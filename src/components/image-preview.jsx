import React from 'react';

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
    var instance = this;
    var dim = fitImageSize(this.props.content.width, this.props.content.height,
      this.state.width, this.state.height, false);
    var size = dim ? { width: dim.dstWidth + 'px', height: dim.dstHeight + 'px' } :
      ((this.props.content.width > this.props.content.height) ? {width: '100%'} : {height: '100%'});
    size.maxWidth = '100%';
    size.maxHeight = '100%';

    var filename = this.props.content.filename;
    var maxlength = (this.props.content.width / REM_SIZE) | 0;
    if (filename.length > maxlength) {
      filename = filename.slice(0, maxlength-2) + '...' + filename.slice(2-maxlength);
    }
    return (
      <div id="image-preview" onClick={this.props.onClose}>
        <div id="image-preview-caption-panel">
          <a href={this.props.content.url} download={this.props.content.filename}>
            <i className="material-icons">file_download</i> download
          </a>
          <a href="javascript:;" onClick={this.props.onClose}><i className="material-icons gray">close</i></a>
        </div>
        <div id="image-preview-container" ref={function(ref) {instance.container = ref;}}>
          <img src={this.props.content.url} style={size} />
        </div>
        <div id="image-preview-footer">
          <div><div><b>File name</b>:</div><div><span title={this.props.content.filename}>{filename}</span></div></div>
          <div><div><b>Content type</b>:</div><div>{this.props.content.type}</div></div>
          <div>
            <div><b>Size</b>:</div>
            <div>{this.props.content.width} &times; {this.props.content.height} px; {bytesToHumanSize(this.props.content.size)}</div>
          </div>
        </div>
      </div>
    );
  }
};

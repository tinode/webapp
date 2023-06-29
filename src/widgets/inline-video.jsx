// Element which shows static video preview:
// an image with duration and a play button in the middle.

import React from 'react';

import { secondsToTime } from '../lib/strformat.js'

export default class InlineVideo extends React.PureComponent {
  constructor(props) {
    super(props);

    this.videoRef = React.createRef();

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    if (this.props.onClick) {
      // the click target has to be the image element.
      this.props.onClick(e);
    }
  }

  render() {
    const duration = secondsToTime(this.props['data-duration'] / 1000);
    const className = 'inline-video' + (this.props.onClick ? ' image-clickable' : '');
    return (
      <div className={className}>
        {React.createElement('img', this.props)}
        <div className="play-control">
        {this.props.onClick ?
          <i className="material-icons white x-big">play_arrow</i>
          :
          <img src="img/broken_video.png" style={{filter: 'invert(100%)'}} width="36" height="36" />}
        </div>
        {duration ? <div className="duration">{duration}</div> : null}
      </div>
    );
  }
};

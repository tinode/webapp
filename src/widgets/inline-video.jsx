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
    const className = 'inline-video' + (this.props.onClick ? ' clickable' : '');
    return (
      <div className={className}>
        {React.createElement('img', this.props)}
        {this.props.onClick ?
          <div className="play-control">
            <i className="material-icons white bigger">play_arrow</i>
          </div>
        : null}
        {duration ? <div className="duration">{duration}</div> : null}
      </div>
    );
  }
};

// Element which shows static video preview:
// an image with duration and a play button in the middle.

import React from 'react';

import { secondsToTime } from '../lib/strformat.js'

export default class InlineVideo extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const duration = secondsToTime(this.props['data-duration'] / 1000);
    return (
      <div className="inline-video">
        {React.createElement('img', this.props)}
        {this.props.onClick ?
          <div className="play-control" onClick={this.props.onClick}>
            <i className="material-icons white bigger">play_arrow</i>
          </div>
        : null}
        {duration ? <div className="duration">{duration}</div> : null}
      </div>
    );
  }
};

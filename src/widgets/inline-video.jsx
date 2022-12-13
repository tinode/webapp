// Element which shows static video preview:
// an image with duration and a play button in the middle.

import React from 'react';

export default class InlineVideo extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="inline-image video">
        {React.createElement('img', this.props)}
        <div className="play-control">
          <i class="material-icons white bigger">play_arrow</i>
        </div>
        <div className="duration">1:12:45</div>
      </div>
    );
  }
};

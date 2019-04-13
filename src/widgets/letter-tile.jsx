import React from 'react';

import Tinode from 'tinode-sdk';

import { stringHash } from '../lib/strformat.js';

export default class LetterTile extends React.PureComponent {
  render() {
    let avatar;
    if (this.props.avatar === true) {
      const isGroup = (Tinode.topicType(this.props.topic) == 'grp');
      if (this.props.topic && this.props.title && this.props.title.trim()) {
        const letter = this.props.title.trim().charAt(0);
        const color = 'lettertile '
          + (isGroup ? 'color' : 'dark-color')
          + (Math.abs(stringHash(this.props.topic)) % 16);
        avatar = (<div className={color}><div>{letter}</div></div>)
      } else {
        avatar = isGroup ?
          <i className="material-icons">group</i> :
          <i className="material-icons">person</i>;
      }
    } else if (this.props.avatar) {
      // If avatar image is invalid, show a placeholder.
      avatar = <img className="avatar" alt="avatar" src={this.props.avatar}
        onError={(e)=>{e.target.onerror = null; e.target.src="/img/broken_image.png"}} />;
    } else {
      avatar = null;
    }
    return avatar;
  }
}

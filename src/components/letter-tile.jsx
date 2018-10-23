import React from 'react';

export default class LetterTile extends React.PureComponent {
  render() {
    let avatar;
    if (this.props.avatar === true) {
      if (this.props.topic && this.props.title && this.props.title.trim()) {
        let letter = this.props.title.trim().charAt(0);
        let color = "lettertile dark-color" + (Math.abs(stringHash(this.props.topic)) % 16);
        avatar = (<div className={color}><div>{letter}</div></div>)
      } else {
        avatar = (Tinode.topicType(this.props.topic) == 'grp') ?
          <i className="material-icons">group</i> :
          <i className="material-icons">person</i>;
      }
    } else if (this.props.avatar) {
      avatar = <img className="avatar" alt="avatar" src={this.props.avatar} />;
    } else {
      avatar = null;
    }
    return avatar;
  }
}

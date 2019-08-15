import React from 'react';

import LetterTile from './letter-tile.jsx';

export default class Chip extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleCancel = this.handleCancel.bind(this);
  }

  handleCancel(e) {
    e.preventDefault();
    this.props.onCancel(this.props.topic, this.props.index);
  }

  render() {
    const title = this.props.title || this.props.topic;
    const className = this.props.invalid ? 'chip invalid' : 'chip';
    return (
      <div className={className}>
        {this.props.noAvatar ?
          <span className="spacer" /> :
          <div className="avatar-box">
            <LetterTile
              avatar={this.props.avatar || true}
              topic={this.props.topic}
              title={this.props.title} />
          </div>
        }
        <span>{title}</span>
        {this.props.onCancel && !this.props.required ?
          <a href="#" onClick={this.handleCancel} >&times;</a>
          : <span className="spacer" />}
      </div>
    );
  }
};

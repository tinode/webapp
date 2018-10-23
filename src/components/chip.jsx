import React from 'react';

export default class Chip extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleCancel = this.handleCancel.bind(this);
  }

  handleCancel() {
    this.props.onCancel(this.props.topic, this.props.index);
  }

  render() {
    var title = this.props.title || this.props.topic;
    return (
      <div className="chip">
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
          <a href="javascript:;" onClick={this.handleCancel} >&times;</a>
          : <span className="spacer" />}
      </div>
    );
  }
};

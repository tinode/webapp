import React from 'react';

export default class NewTopicById extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      groupId: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({groupId: e.target.value});
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.handleSubmit(e);
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.groupId) {
      var name = this.state.groupId.trim();
      if (name.length > 3 && (name.substr(0, 3) == 'usr' || name.substr(0, 3) == 'grp')) {
        this.props.onSubmit(name);
      } else {
        this.props.onError("Invalid ID", 'err');
      }
    }
  }

  render() {
    return (
      <div className="panel-form">
        <div className="panel-form-row">
        <input type="text" placeholder="Group or User ID"
          value={this.state.groupId} onChange={this.handleChange}
          onKeyPress={this.handleKeyPress} required />
        </div>
        <div className="dialog-buttons">
          <button className="blue" onClick={this.handleSubmit}>Subscribe</button>
        </div>
      </div>
    );
  }
};

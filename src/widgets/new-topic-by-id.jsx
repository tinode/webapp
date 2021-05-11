import React from 'react';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';

const messages = defineMessages({
  invalid_id: {
    id: 'error_invalid_id',
    defaultMessage: 'Invalid ID',
    description: 'Error message'
  }
});

class NewTopicById extends React.PureComponent {
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
      const name = this.state.groupId.trim();
      const prefix = name.substr(0, 3);
      if (name.length > 3 && ['usr', 'grp', 'chn'].includes(prefix)) {
        this.props.onSubmit(name);
      } else {
        this.props.onError(this.props.intl.formatMessage(messages.invalid_id), 'err');
      }
    }
  }

  render() {
    return (
      <div className="panel-form">
        <div className="panel-form-row">
        <FormattedMessage id="group_user_id_prompt" defaultMessage="Group or User ID"
          description="Prompt for entering user or group ID">{
          (prompt) => <input type="text" placeholder={prompt}
            value={this.state.groupId} onChange={this.handleChange}
            onKeyPress={this.handleKeyPress} required autoFocus />
        }</FormattedMessage>
        </div>
        <div className="dialog-buttons">
          <button className="primary" onClick={this.handleSubmit}>
            <FormattedMessage id="button_subscribe" defaultMessage="Subscribe"
              description="Button [Subscribe]" />
          </button>
        </div>
      </div>
    );
  }
};

export default injectIntl(NewTopicById);

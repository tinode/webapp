// Topic reaction settings editor.
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Tinode } from 'tinode-sdk';

export default class TopicReactions extends React.PureComponent {
  constructor(props) {
    super(props);

    // Determine initial reaction status and selected reactions based on props.
    // If reactions is null/undefined/empty array, it means "use all reactions".
    // If it's an array with one DEL_CHAR element, it means "disable reactions".
    // Otherwise, it's a list of selected reactions.
    let currentReactions = props.reactions || [];
    let reactionStatus;
    if (currentReactions.length == 1 && currentReactions[0] == Tinode.DEL_CHAR) {
      reactionStatus = 'disable';
      currentReactions = [];
    } else if (currentReactions.length == 0) {
      reactionStatus = 'all';
    } else {
      reactionStatus = 'use-selected';
    }

    const availableReactions = props.availableReactions || [];

    this.state = {
      selectedReactions: [...currentReactions],
      reactionStatus: reactionStatus,
      maxReactions: props.maxReactions || availableReactions.length,
    };

    this.handleReactionToggle = this.handleReactionToggle.bind(this);
    this.handleReactionStatusChange = this.handleReactionStatusChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  handleReactionToggle(emoji) {
    const selected = [...this.state.selectedReactions];
    const idx = selected.indexOf(emoji);

    if (idx >= 0) {
      // Remove if already selected
      selected.splice(idx, 1);
    } else {
      // Add if not at max limit
      if (selected.length < this.props.maxReactions) {
        selected.push(emoji);
      } else {
        // Could show a toast here
        return;
      }
    }

    this.setState({ selectedReactions: selected });
  }

  handleReactionStatusChange(e) {
    this.setState({reactionStatus: e.target.value});
  }

  handleSave() {
    const reactions = this.state.reactionStatus == 'all' ? null :
      this.state.reactionStatus == 'disable' ? [Tinode.DEL_CHAR] :
      this.state.selectedReactions;

    this.props.onUpdateReactions(reactions);
  }

  render() {
    const { availableReactions } = this.props;
    const { maxReactions, selectedReactions } = this.state;
    const originalVals = this.props.reactions || [];
    const hasChanges = JSON.stringify(selectedReactions) != JSON.stringify(originalVals) ||
      this.state.reactionStatus != this.props.reactionStatus;

    return (
      <div id="topic-reactions" className="scrollable-panel">
        <div className="panel-form-column">
          <div className="panel-form-row">
            <ul className="quoted">
              <li key="enable-all">
                <input type="radio" id="enable-all" name="reactions-select" value="all"
                  checked={this.state.reactionStatus == 'all'}
                  onChange={this.handleReactionStatusChange} />&nbsp;
                <label htmlFor="enable-all">
                  <FormattedMessage id="use_reactions_all"
                    defaultMessage="Use all reactions" description="Option for reactions use in topic"/>&nbsp;
                </label>
              </li>
              <li key="disable">
                <input type="radio" id="disable" name="reactions-select" value="disable"
                  checked={this.state.reactionStatus == 'disable'}
                  onChange={this.handleReactionStatusChange} />&nbsp;
                <label htmlFor="disable">
                  <FormattedMessage id="disable_reactions"
                    defaultMessage="Disable reactions" description="Option for reactions use in topic"/>&nbsp;
                </label>
              </li>
              <li key="use-selected">
                <input type="radio" id="use-selected" name="reactions-select" value="use-selected"
                  checked={this.state.reactionStatus == 'use-selected'}
                  onChange={this.handleReactionStatusChange} />&nbsp;
                <label htmlFor="use-selected">
                  <FormattedMessage id="use_reactions_selected"
                    defaultMessage="Use selected reactions:" description="Option for reactions use in topic"/>&nbsp;
                </label>
              </li>
            </ul>
          </div>
          <div className="panel-form-row">
            <div className="available-reactions-grid">
              {availableReactions && availableReactions.map(emoji => {
                const isSelected = selectedReactions.includes(emoji);
                const isDisabled = this.state.reactionStatus != 'use-selected' ||
                  (!isSelected && selectedReactions.length >= maxReactions);

                return (
                  <div
                    key={emoji}
                    onClick={() => !isDisabled && this.handleReactionToggle(emoji)}
                    className={`available-reaction${isSelected ? ' selected' : ''}${isDisabled ? ' disabled' : ''}`}>
                    {emoji}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="dialog-buttons">
            <button className="secondary" onClick={this.props.onCancel}>
              <FormattedMessage id="button_cancel" defaultMessage="Cancel"
                description="Button [Cancel]" />
            </button>
            <button className="primary" onClick={this.handleSave} disabled={!hasChanges}>
              <FormattedMessage id="button_save" defaultMessage="Save"
                description="Button [Save]" />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

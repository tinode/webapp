// Topic reaction settings editor.
import React from 'react';
import { FormattedMessage } from 'react-intl';

export default class TopicReactions extends React.PureComponent {
  constructor(props) {
    super(props);

    // Get current topic reactions or empty array
    const currentReactions = (props.react && props.react.vals) || [];
    // Get current max per message setting
    const currentMax = (props.react && props.react.max) || null;

    this.state = {
      selectedReactions: [...currentReactions],
      maxPerMessage: currentMax
    };

    this.handleReactionToggle = this.handleReactionToggle.bind(this);
    this.handleMaxChange = this.handleMaxChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  handleMaxChange(e) {
    const value = parseInt(e.target.value);
    const sliderMax = this.state.selectedReactions.length || 1;
    // If slider is at max position, treat as "use server default" (null)
    this.setState({ maxPerMessage: value >= sliderMax ? null : value });
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

  handleSave() {
    let reactConfig = null;
    if (this.state.selectedReactions.length > 0 || this.state.maxPerMessage !== null) {
      reactConfig = {};
      if (this.state.selectedReactions.length > 0) {
        reactConfig.vals = this.state.selectedReactions;
      }
      if (this.state.maxPerMessage !== null) {
        reactConfig.max = this.state.maxPerMessage;
      }
    }
    this.props.onUpdateReactions(reactConfig);
  }

  render() {
    const { availableReactions, maxReactions } = this.props;
    const { selectedReactions, maxPerMessage } = this.state;
    const originalVals = (this.props.react && this.props.react.vals) || [];
    const originalMax = (this.props.react && this.props.react.max) || null;
    const hasChanges = JSON.stringify(selectedReactions) !== JSON.stringify(originalVals) ||
      maxPerMessage !== originalMax;

    // Max slider value is the count of selected reactions (can't exceed what's configured)
    const sliderMax = selectedReactions.length || 1;
    const sliderValue = maxPerMessage === null ? sliderMax : Math.min(maxPerMessage, sliderMax);

    return (
      <div id="topic-reactions" className="scrollable-panel">
        <div className="panel-form-column">
          <div className="group">
            <label className="small" htmlFor="max-per-message">
              <FormattedMessage
                id="label_max_reactions_per_message"
                defaultMessage="Maximum reaction types per message"
                description="Label for max reactions per message setting" />
              {maxPerMessage !== null && <span>: {maxPerMessage}</span>}
            </label>
            <p className="small">
              <FormattedMessage
                id="max_reactions_per_message_description"
                defaultMessage="Limit how many different reaction types can be added to a single message."
                description="Description of max reactions per message" />
            </p>
            <input
              type="range"
              id="max-per-message"
              min="1"
              max={sliderMax}
              value={sliderValue}
              onChange={this.handleMaxChange}
              disabled={selectedReactions.length === 0}
            />
          </div>

          <div className="group">
            <label className="small">
              <FormattedMessage
                id="label_reaction_settings"
                defaultMessage="Selected reactions"
                description="Label for topic reaction settings" />
            </label>
          </div>

          <div className="group">
            <div className="selected-reactions-palette">
              {selectedReactions.length === 0 ?
                <span className="selected-reactions-empty">
                  <FormattedMessage
                    id="no_reactions_selected"
                    defaultMessage="No reactions selected"
                    description="Shown when no reactions are selected" />
                </span>
                :
                selectedReactions.map(emoji => (
                  <div
                    key={emoji}
                    onClick={() => this.handleReactionToggle(emoji)}
                    className="selected-reaction"
                    title={`Click to remove ${emoji}`}>
                    {emoji}
                  </div>
                ))
              }
            </div>
          </div>

          <div className="group">
            <label className="small">
              <FormattedMessage
                id="label_available_reactions"
                defaultMessage="Available reactions"
                description="Label for available reactions picker" />
            </label>
            <div className="available-reactions-grid">
              {availableReactions && availableReactions.map(emoji => {
                const isSelected = selectedReactions.includes(emoji);
                const isDisabled = !isSelected && selectedReactions.length >= maxReactions;

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

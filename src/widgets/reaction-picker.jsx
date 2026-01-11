import React from 'react';

import { objectEqual } from '../lib/utils';
import CountBadge from './count-badge.jsx';

// Number of emojis to show in collapsed panel.
const REACTIONS_COLLAPSED_COUNT = 6;
// Maximum number of emojis to show in a panel (expanded).
const MAX_EMOJIS = 40;
// Where to show the picker all else being equal: 'top', 'left', 'right', 'bottom'
const DISPLAY_PREFERENCE = 'top';
const PANEL_MARGIN = 8;
const TIP_SIZE = 7;
// Width/height of the reaction-add button.
const BUTTON_SIZE = 14;
// Distance from edge to tip point
const TIP_STOP = 12;
// Right-side visible message bubble has a margin on the left.
const BUBBLE_MARGIN_LEFT = 23;

// Compact emoji picker styled like Telegram/WhatsApp
// Props:
// - reactionList: array of emoji strings that can be used.
// - anchor: { // Position of the click which launched the picker.
//     offsetX: number, // X coordinate relative to message bubble.
//     offsetY: number, // Y coordinate relative to message bubble.
//     viewX: number,   // X coordinate relative to viewport
//     viewY: number    // Y coordinate relative to viewport
//   }
// - viewportBounds: { width: number, height: number } size of the viewport
// - onSelect: (emo) => void
// - onClose: () => void
// - dataTestPrefix: optional prefix for data-testid
class ReactionPicker extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // position is an inline style object for the panel
      position: { marginLeft: '0', marginTop: '0' },
      tipLeft: '12px',
      placeAbove: 'top',
      expanded: false
    };
    this.rootRef = React.createRef();
    this.emojiRefs = [];
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.selectEmoji = this.selectEmoji.bind(this);
    this.updatePosition = this.updatePosition.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleOutsideClick);
    document.addEventListener('keydown', this.handleKeyDown);
    // Focus first emoji for keyboard users
    setTimeout(() => { if (this.emojiRefs[0]) this.emojiRefs[0].focus(); }, 0);
    // Position picker so it's fully visible
    this.updatePosition();
  }

  componentDidUpdate(prevProps, prevState) {
    // Reposition if anchor or viewportBounds changed or expanded state changed.
    if (prevProps.anchor !== this.props.anchor ||
        prevProps.viewportBounds !== this.props.viewportBounds ||
        prevState.expanded !== this.state.expanded) {
      // Use a timeout so DOM updates (expanded grid) are applied before measuring.
      setTimeout(() => this.updatePosition(), 0);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleOutsideClick);
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleOutsideClick(e) {
    e.stopPropagation();
    e.preventDefault();
    if (this.rootRef.current && !this.rootRef.current.contains(e.target)) {
      this.props.onClose();
    }
  }

  handleKeyDown(e) {
    // Global handler only processes navigation keys when picker is open
    if (e.key === 'Escape') {
      this.props.onClose();
      return;
    }

    const active = document.activeElement;
    const idx = this.emojiRefs.findIndex(el => el === active);
    if (e.key === 'ArrowRight') {
      if (idx == -1) {
        this.emojiRefs[0] && this.emojiRefs[0].focus();
      } else {
        const next = (idx + 1) % this.emojiRefs.length;
        this.emojiRefs[next] && this.emojiRefs[next].focus();
      }
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      if (idx == -1) {
        const last = this.emojiRefs.length - 1;
        this.emojiRefs[last] && this.emojiRefs[last].focus();
      } else {
        const prev = (idx - 1 + this.emojiRefs.length) % this.emojiRefs.length;
        this.emojiRefs[prev] && this.emojiRefs[prev].focus();
      }
      e.preventDefault();
    } else if ((e.key === 'Enter' || e.key === ' ') && idx >= 0) {
      const emojis = this.props.reactionList || [];
      const emo = emojis[idx];
      this.selectEmoji(emo);
      e.preventDefault();
    }
  }

  selectEmoji(emo) {
    this.props.onSelect(emo);
    this.props.onClose();
  }

  updatePosition() {
    if (!this.rootRef.current) {
      return;
    }

    const panelRect = this.rootRef.current.getBoundingClientRect();
    const hSize = panelRect.width;
    const vSize = panelRect.height;

    // Choose maximum available space around click point to display the panel.
    const spaceLeft = this.props.anchor.viewX - hSize - PANEL_MARGIN * 2 - TIP_SIZE - BUTTON_SIZE / 2;
    const spaceRight = this.props.viewportBounds.width - this.props.anchor.viewX - hSize - PANEL_MARGIN * 2 - TIP_SIZE - BUTTON_SIZE / 2;
    const spaceTop = this.props.anchor.viewY - vSize - PANEL_MARGIN * 2 - TIP_SIZE - BUTTON_SIZE / 2;
    const spaceBottom = this.props.viewportBounds.height - this.props.anchor.viewY - vSize - PANEL_MARGIN * 2 - TIP_SIZE / 2 ;

    let preferred = DISPLAY_PREFERENCE;
    let space = spaceTop;
    let bubbleMargin = spaceRight > spaceLeft ? 0 : BUBBLE_MARGIN_LEFT;
    if (space < 0 && space < spaceBottom) {
      preferred = 'bottom';
      space = spaceBottom;
    }
    if (space < 0 && space < spaceLeft) {
      preferred = 'left';
      space = spaceLeft;
    }
    if (space < 0 && space < spaceRight) {
      preferred = 'right';
    }

    // Calculate position so the panel is fully visible within the message view bounds.
    let marginTop, marginLeft;
    if (preferred == 'top' || preferred == 'bottom') {
      // Place panel in such a way than anchor point is under/above the panel.
      if (hSize > this.props.viewportBounds.width) {
        // The panel wider than viewport: align to the exact middle.
        marginLeft = (this.props.viewportBounds.width - hSize) / 2;
      } else {
        if (spaceRight > spaceLeft) {
          // When the bubble is on the left, the margin is fixed.
          marginLeft = Math.max(-PANEL_MARGIN, this.props.anchor.offsetX - hSize * 0.67 + BUTTON_SIZE / 2);
        } else {
          // Preferred position: 2/3 of panel width to the left of click point, but make sure panel is fully visible.
          const available = this.props.viewportBounds.width - this.props.anchor.viewX - PANEL_MARGIN - BUTTON_SIZE / 2;
          const offsetX = this.props.anchor.offsetX - hSize * 0.67;
          marginLeft = offsetX + Math.min(0, BUBBLE_MARGIN_LEFT + available - hSize * 0.33);
        }
      }
      // Horizontal placement of tail: place close to click position.
      this.setState({ tipLeft: Math.max(TIP_STOP, Math.min(hSize - TIP_STOP - TIP_SIZE * 2,
        this.props.anchor.offsetX - marginLeft + bubbleMargin)) + 'px' });
      // Fixed vertical positioning: above or below the button.
      if (preferred == 'top') {
        marginTop = this.props.anchor.offsetY - vSize - TIP_SIZE - PANEL_MARGIN;
      } else {
        marginTop = this.props.anchor.offsetY + TIP_SIZE + PANEL_MARGIN + BUTTON_SIZE;
      }
      marginTop = marginTop + 'px';
      marginLeft = marginLeft + 'px';
    } else {
      // Left or right placement: panel is too tall to completely display above or below the anchor point.
      if (preferred == 'left') {
        marginLeft = this.props.anchor.offsetX - hSize - TIP_SIZE - PANEL_MARGIN + bubbleMargin;
      } else { // right
        marginLeft = this.props.anchor.offsetX + PANEL_MARGIN + TIP_SIZE + BUTTON_SIZE;
      }
      if (vSize > this.props.viewportBounds.height) {
        // The panel is taller than viewport: align to the exact middle.
        marginTop = (this.props.viewportBounds.height - vSize) / 2 - this.props.anchor.viewY;
      } else {
        // Click above or below center of viewport?
        const above = this.props.viewportBounds.height / 2 > this.props.anchor.viewY;
        if (above) {
          // More space below the anchor point (message is close to top).
          // Keep panel close to top.
          marginTop = -this.props.anchor.viewY + this.props.anchor.offsetY + PANEL_MARGIN + BUTTON_SIZE / 2;
        } else {
          // More space above the anchor point (message is close to bottom).
          // Keep panel close to top.
          marginTop = spaceBottom - PANEL_MARGIN + this.props.anchor.offsetY + BUTTON_SIZE / 2;
        }
      }
      // Vertical placement of tip: place close to the anchor position.
      this.setState({ tipTop: Math.max(TIP_STOP, Math.min(vSize - TIP_STOP - TIP_SIZE * 2,
         this.props.anchor.offsetY - marginTop)) + 'px' });
      marginTop = marginTop + 'px';
      marginLeft = marginLeft + 'px';
    }

    // Tail placement above or below the panel depends on whether panel is above or below click point.
    this.setState({ placeAbove: preferred });

    // Only update state if values changed to avoid rerenders: new object triggers rerender.
    let newPos = { marginLeft: marginLeft, marginTop: marginTop };
    if (!objectEqual(this.state.position, newPos)) {
      this.setState({ position: newPos });
    }
  }

  render() {
    const prefix = this.props.dataTestPrefix || 'reaction-picker';
    const style = { ...this.state.position };
    if (this.state.placeAbove == 'top' || this.state.placeAbove == 'bottom') {
      style['--tip-left'] = this.state.tipLeft;
      style['--tip-top'] = 'unset';
    } else {
      style['--tip-left'] = 'unset';
      style['--tip-top'] = this.state.tipTop;
    }
    return (
      <div ref={this.rootRef}
          className={`reaction-picker ${this.state.placeAbove}${this.state.expanded ? ' expanded' : ''} `}
          role="dialog" aria-label="emoji picker" style={style}>
        {(this.props.reactionList || [])
            .slice(0, this.state.expanded ? MAX_EMOJIS : REACTIONS_COLLAPSED_COUNT)
            .map((emo, i) => {
              const applied = (this.props.reactions || []).find(r => r.val == emo);
              const count = (applied && applied.count > 1) ? (applied.count | 0) : false;
              const mine = applied && applied.users.includes(this.props.myUserId);
              return <div
                key={emo}
                ref={el => this.emojiRefs[i] = el}
                className={`reaction-picker-btn${mine ? ' mine' : applied ? ' applied' : ''}`}
                data-testid={`${prefix}-${emo}`}
                onClick={() => { this.selectEmoji(emo); }}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.selectEmoji(emo); } }}
                role="button"
                tabIndex={0}
                aria-label={`react ${emo}`}>
                {emo}
                {count && <CountBadge rect={true} count={count} size="medium"
                  style={{ position: 'absolute', right: '-2px',bottom: '-2px' }} />
                }
              </div>;
        })}
        {(!this.state.expanded && (this.props.reactionList || []).length > REACTIONS_COLLAPSED_COUNT) &&
          <>
          <div className="divider"/>
          <div className="reaction-picker-btn" role="button" data-testid="reaction-expand"
              onClick={() => this.setState({expanded: true}, () => this.updatePosition())}>
            <i className="m-icon">expand_more</i>
          </div>
          </>}
      </div>
    );
  }
}

export default ReactionPicker;

import React from 'react';

import { objectEqual } from '../lib/utils';

const REACTIONS_COLLAPSED_COUNT = 6;
const MAX_EMOJIS = 40;
// Where to show the picker initially: 'top', 'left', 'right', 'bottom'
const DISPLAY_PREFERENCE = 'top';
const PANEL_MARGIN = 8;
const TIP_SIZE = 7;
// Width/height of the reaction-add button.
const BUTTON_SIZE = 14;
// Distance from edge to tip point
const TIP_STOP = 12;

// Compact emoji picker styled like Telegram/WhatsApp
// Props:
// - emojis: array of emoji strings
// - onSelect: (emo) => void
// - onClose: () => void
// - dataTestPrefix: optional prefix for data-testid
class ReactionPicker extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // position is an inline style object for the panel
      position: { marginLeft: '0', marginTop: '0' },
      tailLeft: '12px',
      placeAbove: 'top',
      expanded: false
    };
    this.rootRef = React.createRef();
    this.emojiRefs = [];
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.selectEmoji = this.selectEmoji.bind(this);
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
    // Reposition if clickAt or bounds changed or expanded state changed
    if (prevProps.clickAt !== this.props.clickAt || prevProps.bounds !== this.props.bounds || prevState.expanded !== this.state.expanded) {
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
      if (idx === -1) {
        this.emojiRefs[0] && this.emojiRefs[0].focus();
      } else {
        const next = (idx + 1) % this.emojiRefs.length;
        this.emojiRefs[next] && this.emojiRefs[next].focus();
      }
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      if (idx === -1) {
        const last = this.emojiRefs.length - 1;
        this.emojiRefs[last] && this.emojiRefs[last].focus();
      } else {
        const prev = (idx - 1 + this.emojiRefs.length) % this.emojiRefs.length;
        this.emojiRefs[prev] && this.emojiRefs[prev].focus();
      }
      e.preventDefault();
    } else if ((e.key === 'Enter' || e.key === ' ') && idx >= 0) {
      const emojis = this.props.emojis;
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
    const spaceLeft = this.props.anchor.viewX - this.props.viewportBounds.left - hSize - PANEL_MARGIN * 2 - TIP_SIZE;
    const spaceRight = this.props.viewportBounds.right - this.props.anchor.viewX - hSize - PANEL_MARGIN * 2 - TIP_SIZE - BUTTON_SIZE;
    const spaceTop = this.props.anchor.viewY - this.props.viewportBounds.top - vSize - PANEL_MARGIN * 2 - TIP_SIZE;
    const spaceBottom = this.props.viewportBounds.bottom - this.props.anchor.viewY - vSize - PANEL_MARGIN * 2 - TIP_SIZE;

    let preferred = DISPLAY_PREFERENCE;
    let space = spaceTop;
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

    // Calculate left/top/right/bottom so the panel is fully visible within message view bounds.
    let marginTop, marginLeft;
    if (preferred == 'top' || preferred == 'bottom') {
      // Place panel in such a way than anchor point is under/above the panel.
      if (hSize > (this.props.viewportBounds.right - this.props.viewportBounds.left)) {
        // The panel wider than viewport: align to the exact middle.
        marginLeft = (this.props.viewportBounds.right - this.props.viewportBounds.left - hSize) / 2;
      } else {
        if (spaceRight > spaceLeft) {
          // When the bubble is on the left, the margin is fixed.
          marginLeft = -PANEL_MARGIN;
        } else {
          // When the bubble is on the right, adjust margin to keep panel inside the viewport.
          const available = this.props.viewportBounds.right - this.props.anchor.viewX - PANEL_MARGIN;
          marginLeft = Math.min(-PANEL_MARGIN, available - hSize);
        }
      }
      // Horizontal placement of tail: place close to click position.
      this.setState({ tailLeft: Math.max(TIP_STOP,
        Math.min(panelRect.width - TIP_STOP, this.props.anchor.offsetX - marginLeft)) + 'px' });
      // Fixed vertical positioning: above or below the button.
      if (preferred == 'top') {
        marginTop = -vSize - TIP_SIZE - PANEL_MARGIN - BUTTON_SIZE;
      } else {
        marginTop = TIP_SIZE + PANEL_MARGIN;
      }
      marginTop = marginTop + 'px';
      marginLeft = marginLeft + 'px';
    } else {
      // Left or right placement: panel is too tall to completely display above or below the anchor point.
      if (preferred == 'left') {
        marginLeft = this.props.anchor.offsetX - hSize - TIP_SIZE - PANEL_MARGIN;
      } else { // right
        marginLeft = this.props.anchor.offsetX + PANEL_MARGIN + TIP_SIZE + BUTTON_SIZE;
      }
      if (vSize > (this.props.viewportBounds.bottom - this.props.viewportBounds.top)) {
        // The panel is taller than viewport: align to the exact middle.
        marginTop = (this.props.viewportBounds.bottom - this.props.viewportBounds.top - vSize) / 2;
      } else {
        marginTop = Math.min(-(PANEL_MARGIN + TIP_SIZE + BUTTON_SIZE), spaceBottom);
      }
      // Vertical placement of tip: place close to the anchor position.
      this.setState({ tailTop: Math.max(TIP_STOP, Math.min(vSize - TIP_STOP, -marginTop - BUTTON_SIZE/2 - TIP_SIZE)) + 'px' });
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
      style['--tip-left'] = this.state.tailLeft;
      style['--tip-top'] = 'unset';
    } else {
      style['--tip-left'] = 'unset';
      style['--tip-top'] = this.state.tailTop;
    }
    return (
      <div ref={this.rootRef}
          className={`reaction-picker ${this.state.placeAbove}${this.state.expanded ? ' expanded' : ''} `}
          role="dialog" aria-label="emoji picker" style={style}>
        {(this.props.emojis || [])
            .slice(0, this.state.expanded ? MAX_EMOJIS : REACTIONS_COLLAPSED_COUNT)
            .map((emo, i) => (
          <div
            key={emo}
            ref={el => this.emojiRefs[i] = el}
            className="reaction-picker-btn"
            data-testid={`${prefix}-${emo}`}
            onClick={() => { this.selectEmoji(emo); }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.selectEmoji(emo); } }}
            role="button"
            tabIndex={0}
            aria-label={`react ${emo}`}>
            {emo}
          </div>
        ))}
        {(!this.state.expanded && (this.props.emojis || []).length > REACTIONS_COLLAPSED_COUNT) &&
          <>
          <div className="divider"/>
          <div className="reaction-picker-btn" role="button" data-testid="reaction-expand"
              onClick={() => this.setState({expanded: true}, () => this.updatePosition())}>
            <i className="material-icons">expand_more</i>
          </div>
          </>}
      </div>
    );
  }
}

export default ReactionPicker;

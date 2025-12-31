import React from 'react';

const REACTIONS_COLLAPSED_COUNT = 6;
const MAX_EMOJIS = 40;
// Where to show the picker initially: 'top', 'left', 'right', 'bottom'
const DISPLAY_PREFERENCE = 'top';
const PANEL_MARGIN = 7;
const TIP_SIZE = 7;

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
      position: { left: '0', top: '0' },
      tailLeft: '12px',
      placeAbove: 'below',
      expanded: false,
      collapsedHeight: 1000
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
    // Height of the collapsed panel for position calculations.
    let collapsedHeight;
    if (hSize < this.state.collapsedHeight) {
      // Remember collapsed height for future calculations. It does not change.
      this.setState({ collapsedHeight: vSize });
      collapsedHeight = vSize;
    } else {
      collapsedHeight = this.state.collapsedHeight;
    }
    // Choose maximum available space around click point to display the panel.
    const spaceLeft = this.props.clickAt.x - this.props.viewportBounds.left - hSize - PANEL_MARGIN;
    const spaceRight = this.props.viewportBounds.right - this.props.clickAt.x - hSize - PANEL_MARGIN;
    const spaceTop = this.props.clickAt.y - this.props.viewportBounds.top - vSize - PANEL_MARGIN;
    const spaceBottom = this.props.viewportBounds.bottom - this.props.clickAt.y - vSize - PANEL_MARGIN;

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

    // Calculate left/top so the panel is fully visible within bounds.
    let left, top;
    if (preferred === 'top' || preferred === 'bottom') {
      left = Math.min(-PANEL_MARGIN, this.props.viewportBounds.right - this.props.clickAt.x - hSize);
      top = preferred === 'top' ? (-vSize - TIP_SIZE) : 24 + TIP_SIZE + PANEL_MARGIN;
    } else {
      // Default placement: above or below based on available space for collapsed panel.
      if (preferred === 'left') {
        left = -PANEL_MARGIN - hSize;
      } else { // right
        left = this.props.clickAt.x + PANEL_MARGIN - this.props.viewportBounds.left;
      }
      if (vSize > (this.props.viewportBounds.bottom - this.props.viewportBounds.top)) {
        // Panel taller than viewport. Align to the exact middle.
        top = (this.props.viewportBounds.bottom - this.props.viewportBounds.top - vSize) / 2;
      } else {
        // Panel shorter than the viewport. Try to keep as close to the original position as possible without
        // going offscreen.
        top = Math.min(this.props.viewportBounds.bottom - this.props.clickAt.y - vSize - PANEL_MARGIN,
                       Math.max(-PANEL_MARGIN, this.props.clickAt.y - this.props.viewportBounds.top - vSize / 2));
      }
    }

    console.log(`ReactionPicker: pre  ferred=${preferred} space=${space} left=${left}`);
    // Horizontal placement of tail: place close to click position.
    this.setState({ tailLeft: Math.max(12, Math.min(panelRect.width - 12, Math.max(12, -left))) + 'px' });
    // Tail placement above or below the panel depends on whether panel is above or below click point.
    this.setState({ placeAbove: top < 0 ? 'below' : 'above'});

    // Only update state if values changed to avoid rerenders: new object triggers rerender.
    let newPos = { left: left + 'px', top: top + 'px' };
    const prevPos = this.state.position;
    if (!prevPos || prevPos.left !== newPos.left || prevPos.top !== newPos.top) {
      this.setState({ position: newPos });
    }
  }

  render() {
    const prefix = this.props.dataTestPrefix || 'reaction-picker';
    const style = { ...this.state.position, '--tip-left': this.state.tailLeft };
    return (
      <div ref={this.rootRef}
          className={`reaction-picker ${this.state.placeAbove} ${this.state.expanded ? 'expanded' : ''} `}
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

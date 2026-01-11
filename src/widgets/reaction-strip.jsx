import React from 'react';

import { shortenCount } from '../lib/strformat';

class ReactionStrip extends React.PureComponent {
  render() {
    const more = this.props.reactions.length - this.props.maxReactions;
    return (
      <div className="reactions">
        {/* Invisible zero-width element to prevent layout shift */}
        <div style={{opacity:0, userSelect: 'none', width: '0.01rem'}}>0</div>
        {this.props.reactions.slice(0, this.props.maxReactions).map(r => {
          const you = r.users && this.props.myUserId && r.users.includes(this.props.myUserId);
          return (
            <div key={r.val}
              data-testid={`reaction-${r.val}`}
              className={'reaction' + (you ? ' active' : '')}
              onClick={(e) => this.props.onReactionSelected(e, r.val)}>
              <span className="emoji">{r.val}</span>
              {r.count > 1 && <span className="count">{shortenCount(r.count)}</span>}
            </div>
          );
        })}
        <div className={`reaction-add${(this.props.pickerShown || more > 0) ? ' active' : ''}`}
          data-testid="reaction-add"
          onMouseDown={(e) => { e.stopPropagation(); }}
          onClick={this.props.onTogglePicker}>
            <i className="m-icon">{more > 0 ? 'more_horiz' : 'thumb_up_off_alt'}</i>
        </div>
      </div>
    );
  }
}

export default ReactionStrip;

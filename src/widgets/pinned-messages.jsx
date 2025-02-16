// Send message form.
import React from 'react';
import { injectIntl } from 'react-intl';
import { Drafty } from 'tinode-sdk';

import { previewFormatter } from '../lib/formatters.js';
import { MIN_SWIPE_DISTANCE } from '../config.js';

class PinnedMessages extends React.PureComponent {
  constructor(props) {
    super(props);

    this.touchSurface = React.createRef();
    // Starting location of the touch gesture.
    this.touchX = null;
    this.touchY = null;

    this.getSelectedIndex = this.getSelectedIndex.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSelected = this.handleSelected.bind(this);
    this.handleMoveNext = this.handleMoveNext.bind(this);
    this.handleMovePrev = this.handleMovePrev.bind(this);
    this.handleTouchEventStart = this.handleTouchEventStart.bind(this);
    this.handleTouchEventEnd = this.handleTouchEventEnd.bind(this);
    this.handleTouchCancel = this.handleTouchCancel.bind(this);
  }

  componentDidMount() {
    if (this.touchSurface.current) {
      this.touchSurface.current.addEventListener('touchstart', this.handleTouchEventStart, {passive: true});
      this.touchSurface.current.addEventListener('touchend', this.handleTouchEventEnd, {passive: true});
      this.touchSurface.current.addEventListener('touchcancel', this.handleTouchCancel, {passive: true});
    }
  }

  componentWillUnmount() {
    if (this.touchSurface.current) {
      this.touchSurface.current.removeEventListener('touchstart', this.handleTouchEventStart);
      this.touchSurface.current.removeEventListener('touchend', this.handleTouchEventEnd);
      this.touchSurface.current.removeEventListener('touchcancel', this.handleTouchCancel);
    }
  }

  getSelectedIndex() {
    const list = (this.props.messages || []);
    return list.length - this.props.selected - 1;
  }

  handleCancel(e) {
    e.preventDefault();
    this.props.onCancel(this.props.messages[this.getSelectedIndex()].seq);
  }

  handleSelected(e) {
    e.preventDefault();
    this.props.onSelected(this.props.messages[this.getSelectedIndex()].seq);
  }

  handleMoveNext(e, isTouch) {
    // Don't call preventDefault for touch events.
    isTouch || e.preventDefault();
    e.stopPropagation();
    const idx = Math.max(this.props.selected - 1, 0);
    if (idx != this.props.selected) {
      this.props.setSelected(idx);
    }
  }

  handleMovePrev(e, isTouch) {
    // Don't call preventDefault for touch events.
    isTouch || e.preventDefault();
    e.stopPropagation();
    const idx = Math.min(this.props.selected + 1, (this.props.messages || []).length - 1);
    if (idx != this.props.selected) {
      this.props.setSelected(idx);
    }
  }

  handleTouchEventStart(e) {
    if (e.touches.length == 1) {
      this.touchX = e.touches[0].clientX;
      this.touchY = e.touches[0].clientY;
    }
  }

  handleTouchEventEnd(e) {
    if (this.touchX === null || e.changedTouches.length != 1) {
      this.touchX = null;
      return;
    }

    const dX = this.touchX - e.changedTouches[0].clientX;
    const dY = this.touchY - e.changedTouches[0].clientY;
    this.touchX = null;

    if (Math.abs(dX) > Math.abs(dY) || Math.abs(dY) < MIN_SWIPE_DISTANCE) {
      // Horizontal swipe or too short vertical swipe.
      return;
    }

    if (dY > 0) {
      this.handleMovePrev(e, true);
    } else {
      this.handleMoveNext(e, true);
    }
  }

  handleTouchCancel(e) {
    this.touchX = null;
  }

  render() {
    const selected = this.getSelectedIndex();
    let shown = (this.props.messages || [])[selected];
    shown = shown ? Drafty.format(shown.content, previewFormatter, {
      formatMessage: this.props.intl.formatMessage.bind(this.props.intl),
      authorizeURL: this.props.tinode.authorizeURL.bind(this.props.tinode)
    }) : null;

    const dots = [];
    this.props.messages.forEach(_ => {
      const cn = dots.length == selected ? 'adot' : 'dot';
      dots.push(<div key={dots.length} className={cn} />);
    });

    return shown ?
      (<div id="pinned-wrapper" ref={this.touchSurface}>
        {this.props.isAdmin ?
          <div className="cancel">
            <a href="#" onClick={this.handleCancel}><i className="material-icons gray">close</i></a>
          </div> :
          <div><i className="material-icons gray">push_pin</i></div>
        }
        <div className="pinned-scroll">{dots}</div>
        <div className="pinned" onClick={this.handleSelected}><p>{shown}</p></div>
        <div className="pinned-menu">
          <span className="menuTrigger upper">
            {selected > 0 ?
              <a href="#" onClick={this.handleMovePrev}>
                <i className="material-icons">expand_less</i>
              </a>
              : null
            }
          </span>
          <span className="menuTrigger lower">
            {this.props.selected > 0 ?
              <a href="#" onClick={this.handleMoveNext}>
                <i className="material-icons">expand_more</i>
              </a>
              : null
            }
          </span>
        </div>
      </div>) : null;
  }
}

export default injectIntl(PinnedMessages);

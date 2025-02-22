// Send message form.
import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { Drafty } from 'tinode-sdk';

import { previewFormatter } from '../lib/formatters.js';
import { MIN_SWIPE_DISTANCE } from '../config.js';

const messages = defineMessages({
  message_not_found: {
    id: 'message_not_found',
    defaultMessage: 'message not found',
    description: 'Pinned message is not found'
  },
  message_deleted: {
    id: 'message_deleted',
    defaultMessage: 'message deleted',
    description: 'Pinned message is deleted'
  }
});

class PinnedMessages extends React.PureComponent {
  constructor(props) {
    super(props);

    // Starting location of the touch gesture.
    this.touchX = null;
    this.touchY = null;

    this.touchSurface = React.createRef();

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
    this.touchSurface.current.addEventListener('touchstart', this.handleTouchEventStart, {passive: true});
    this.touchSurface.current.addEventListener('touchend', this.handleTouchEventEnd, {passive: true});
    this.touchSurface.current.addEventListener('touchcancel', this.handleTouchCancel, {passive: true});
  }

  componentWillUnmount() {
    this.touchSurface.current.removeEventListener('touchstart', this.handleTouchEventStart);
    this.touchSurface.current.removeEventListener('touchend', this.handleTouchEventEnd);
    this.touchSurface.current.removeEventListener('touchcancel', this.handleTouchCancel);
  }
  getSelectedIndex() {
    const list = (this.props.pins || []);
    return list.length - this.props.selected - 1;
  }

  handleCancel(e) {
    e.preventDefault();
    this.props.onCancel(this.props.pins[this.getSelectedIndex()]);
  }

  handleSelected(e) {
    e.preventDefault();
    this.props.onSelected(this.props.pins[this.getSelectedIndex()]);
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
    const idx = Math.min(this.props.selected + 1, (this.props.pins || []).length - 1);
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

  handleTouchCancel() {
    this.touchX = null;
  }

  render() {
    const selected = this.getSelectedIndex();
    let messageShown = (this.props.messages || [])[selected];
    messageShown = messageShown ?
        messageShown._deleted ?
        <i className="gray">{this.props.intl.formatMessage(messages.message_deleted)}</i>
        :
        Drafty.format(messageShown.content, previewFormatter, {
          formatMessage: this.props.intl.formatMessage.bind(this.props.intl),
          authorizeURL: this.props.tinode.authorizeURL.bind(this.props.tinode)
        })
      :
      <i className="gray">{this.props.intl.formatMessage(messages.message_not_found)}</i>;

    const dots = [];
    this.props.pins.forEach(seq => {
      const cn = dots.length == selected ? 'adot' : 'dot';
      dots.push(<div key={seq} className={cn} />);
    });

    return (
      <div id="pinned-wrapper" ref={this.touchSurface}>
        {this.props.isAdmin ?
          <div className="cancel">
            <a href="#" onClick={this.handleCancel}><i className="material-icons gray">close</i></a>
          </div> :
          <div><i className="material-icons gray">push_pin</i></div>
        }
        <div className="pinned-scroll">{dots}</div>
        <div className="pinned" onClick={this.handleSelected}><p>{messageShown}</p></div>
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
      </div>
    );
  }
}

export default injectIntl(PinnedMessages);

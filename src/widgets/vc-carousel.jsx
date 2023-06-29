import React from 'react';

import { Track } from 'livekit-client';

import VCCarouselItem from './vc-carousel-item.jsx';

import { VC_CAROUSEL_ITEM_GAP } from '../constants.js';

export default class VCCarousel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      prevVisible: false,
      nextVisible: false
    };

    this.handleScrollReference = this.handleScrollReference.bind(this);
    this.handleScrollEvent = this.handleScrollEvent.bind(this);
    this.handleScrollClick = this.handleScrollClick.bind(this);

    this.carouselRef = null;
    this.contentRef = React.createRef();
  }

  componentDidUpdate(prevProps) {
    if (this.carouselRef && this.props.viewportWidth != prevProps.viewportWidth) {
      this.handleScrollEvent({target: this.carouselRef});
    }
  }

  componentWillUnmount() {
    if (this.carouselRef) {
      this.carouselRef.removeEventListener('scroll', this.handleScrollEvent);
    }
  }

  // Don't use React.createRef as the ref.current is not available in componentDidMount in this component.
  handleScrollReference(node) {
    if (node) {
      this.carouselRef = node;
      this.carouselRef.addEventListener('scroll', this.handleScrollEvent);
      this.handleScrollEvent({target: this.carouselRef});
    }
  }

  // Get older messages and show/hide [go to latest message] button.
  handleScrollEvent(event) {
    this.setState({
      // Show [prev] / [next] as appropriate.
      prevVisible: event.target.scrollLeft > VC_CAROUSEL_ITEM_GAP,
      nextVisible: event.target.scrollWidth - event.target.scrollLeft - event.target.offsetWidth > VC_CAROUSEL_ITEM_GAP
    });
  }

  handleScrollClick(next) {
    // this.carouselRef.offsetWidth - is the width of the visible window.
    const val = this.carouselRef.offsetWidth + VC_CAROUSEL_ITEM_GAP;
    this.carouselRef.scrollBy(next ? val : -val, 0);
  }

  render() {
    let peers = [];
    if (this.props.participants) {
      Object.entries(this.props.participants).forEach(([identity, party], i) => {
        const participant = party.participant;
        const cameraPub = participant.getTrack(Track.Source.Camera);
        const micPub = participant.getTrack(Track.Source.Microphone);

        peers.push(<VCCarouselItem
          tinode={this.props.tinode}
          isSpeaking={participant.isSpeaking}
          cameraPub={cameraPub ? cameraPub : null}
          micPub={micPub ? micPub : null}
          name={party.name}
          userId={identity}
          photo={party.photo}
          key={i}
        />);
      });
    }
    return (
      <div id="carousel-wrapper">
        <div id="carousel" ref={this.handleScrollReference}>
          <div id="carousel-content" ref={this.contentRef}>
            {peers}
          </div>
        </div>
        {this.state.prevVisible ?
          <button id="carousel-prev" className="action-button" onClick={_ => this.handleScrollClick(false)}>
            <i className="material-icons">navigate_before</i>
          </button>
          :
          null}
        {this.state.nextVisible ?
          <button id="carousel-next" className="action-button" onClick={_ => this.handleScrollClick(true)}>
            <i className="material-icons">navigate_next</i>
          </button>
          :
          null}
      </div>
    );
  }
}

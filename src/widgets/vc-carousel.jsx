import React from 'react';
import { injectIntl } from 'react-intl';
import {
  Track,
} from 'livekit-client';

import LetterTile from './letter-tile.jsx';
import VCCarouselItem from './vc-carousel-item.jsx';

class VCCarousel extends React.Component {
  constructor(props) {
    super(props);
    this.handlePrevClick = this.handlePrevClick.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
 
    this.carouselRef = React.createRef();
    this.contentRef = React.createRef();
    this.prevRef = React.createRef();
    this.nextRef = React.createRef();
  }

  handlePrevClick() {
    const gap = 16;
    const width = this.carouselRef.current.offsetWidth;
    this.carouselRef.current.scrollBy(-(width + gap), 0);
    if (this.carouselRef.current.scrollLeft - width - gap <= 0) {
      this.prevRef.current.style.display = "none";
    }
    if (!this.contentRef.current.scrollWidth - width - gap <= this.carouselRef.current.scrollLeft + width) {
      this.nextRef.current.style.display = "flex";
    }
  }

  handleNextClick() {
    const gap = 16;
    const width = this.carouselRef.current.offsetWidth;
    this.carouselRef.current.scrollBy(width + gap, 0);
    if (this.carouselRef.current.scrollWidth !== 0) {
      this.prevRef.current.style.display = "flex";
    }
    if (this.contentRef.current.scrollWidth - width - gap <= this.carouselRef.current.scrollLeft + width) {
      this.nextRef.current.style.display = "none";
    }
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
          identity={identity}
          photo={party.photo}
          key={i}
        />);
      });
    }
    return (
      <>
        <div id="carousel-wrapper">
          <div id="carousel" ref={this.carouselRef}>
            <div id="carousel-content" ref={this.contentRef}>
              {peers}
            </div>
          </div>
          <button id="carousel-prev" ref={this.prevRef} onClick={this.handlePrevClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path fill="none" d="M0 0h24v24H0V0z" />
              <path d="M15.61 7.41L14.2 6l-6 6 6 6 1.41-1.41L11.03 12l4.58-4.59z" />
            </svg>
          </button>
          <button id="carousel-next" ref={this.nextRef} onClick={this.handleNextClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path fill="none" d="M0 0h24v24H0V0z" />
              <path d="M10.02 6L8.61 7.41 13.19 12l-4.58 4.59L10.02 18l6-6-6-6z" />
            </svg>
          </button>
        </div>
      </>
    );
  }
}

export default injectIntl(VCCarousel);

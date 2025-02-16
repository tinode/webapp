// Image zoom and crop widget.

import React from 'react';

const DEFAULT_MAX_ZOOM = 2.5;

export default class Cropper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Coordinates of the top left corner of the image in container coordinates.
      panX: 0,
      panY: 0,
      // Origin of the zoom in image coordinates.
      originX: 0,
      originY: 0,
      // Zoom scale.
      zoom: 1,
      // Zoom min and max.
      minZoom: 0,
      maxZoom: DEFAULT_MAX_ZOOM,
    };

    // References to DOM elements for hooking up events and getting screen dimensions.
    // The transparent element which captures mouse moves (moves with the image).
    this.overlay = React.createRef();
    // The image cutout window or view port (static).
    this.cutout = React.createRef();
    // Scaled and translated image preview.
    this.preview = React.createRef();
    // The main container (static).
    this.boundingBox = React.createRef();

    // The original image width and height before any scaling.
    this.imageWidth = 0;
    this.imageHeight = 0;

    // Mouse position when dragging.
    this.mouseX = 0
    this.mouseY = 0;
    // Length of the previous mouse move when dragging.
    this.prevDistance = 0;

    // Bounding rectangles of static elements.
    this.cutoutRect = {};
    this.bBoxRect = {};
    // Center of the bounding box.
    this.originX = 0;
    this.originY = 0;

    this.initScaling = this.initScaling.bind(this);
    this.onZoom = this.onZoom.bind(this);
    this.handleZoom = this.handleZoom.bind(this);
    this.mouseDown = this.mouseDown.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    this.mouseMove = this.mouseMove.bind(this);
    this.mouseTouch = this.mouseTouch.bind(this);
    this.positionAll = this.positionAll.bind(this);
    this.translate = this.translate.bind(this);
  }

  componentDidMount() {
    this.overlay.current.addEventListener('mousedown', this.mouseDown, { passive: true });
    this.overlay.current.addEventListener('touchstart', this.mouseDown, { passive: true });

    // The rectangle position is in viewport coordinates.
    this.bBoxRect = this.boundingBox.current.getBoundingClientRect();
    // Center of the bounding box in container coordinates.
    this.originX = this.bBoxRect.width / 2;
    this.originY = this.bBoxRect.height / 2;

    // The rectangle position is in viewport coordinates.
    this.cutoutRect = this.cutout.current.getBoundingClientRect();
  }

  componentWillUnmount() {
    if (this.overlay.current) {
      this.overlay.current.removeEventListener('mousedown', this.mouseDown);
      this.overlay.current.removeEventListener('touchstart', this.mouseDown);
    }
  }

  // Position all elements.
  positionAll(panX, panY, zoom) {
    // Zoom origin in image preview coordinates.
    this.setState({
      panX: panX,
      panY: panY,
      zoom: zoom,
      originX: this.originX - panX,
      originY: this.originY - panY,
    });

    // Pass cut out coordinates to caller.
    const left = (this.originX - panX) * zoom - this.originX;
    const top = (this.originY - panY) * zoom - this.originY;
    this.props.onChange(
      (left + this.cutoutRect.left - this.bBoxRect.left) / zoom,
      (top + this.cutoutRect.top - this.bBoxRect.top) / zoom,
      this.cutoutRect.width / zoom,
      this.cutoutRect.height / zoom,
      zoom);
  }

  // Check if new location is within the limits.
  static checkBound(currPan, img, cutout, delta) {
    let nextDiff = Math.min(0, cutout[0] - img[0] - delta, img[1] - cutout[1] + delta);
    if (nextDiff == 0) {
      // Cutout is completely within the image.
      currPan += delta;
    } else if (Math.min(0, cutout[0] - img[0], img[1] - cutout[1]) < nextDiff) {
      // Cutout is outside of the range but closer to the bound.
      currPan += delta;
    }
    return currPan;
  }

  initScaling() {
    // Initialize components.
    const imgRect = this.preview.current.getBoundingClientRect();

    this.imageWidth = imgRect.width;
    this.imageHeight = imgRect.height;

    // Set zoom slider's min and max values. Make sure the scaled image cannot be smaller than the cutout.
    const minZoom = Math.max(this.cutoutRect.width / imgRect.width, this.cutoutRect.height / imgRect.height);
    this.setState({
      minZoom: minZoom,
      maxZoom: Math.max(DEFAULT_MAX_ZOOM, minZoom + 1)
    });

    // Initial zoom level fills the bounding box at the smallest image dimension and overflows the largest, i.e. "fill" not "fit".
    const zoom = Math.max(this.bBoxRect.width / imgRect.width, this.bBoxRect.height / imgRect.height);
    // Converting from viewport coordinates to container, then panning.
    const panX = this.cutoutRect.left - this.bBoxRect.left -
      (imgRect.width - this.cutoutRect.width) / 2;
    const panY = this.cutoutRect.top - this.bBoxRect.top -
      (imgRect.height - this.cutoutRect.height) / 2;

    this.positionAll(panX, panY, zoom);
  }

  onZoom(e) {
    this.handleZoom(e.target.value);
  }

  handleZoom(zoom) {
    let panX = this.state.panX;
    let panY = this.state.panY;

    // Ensure that the image at the new zoom is not outside of the cutout boundaries.
    // Calculate image coordinates at the new zoom.
    const imgLeft = this.originX - (this.originX - panX) * zoom;
    const imgRight = imgLeft + this.imageWidth * zoom;
    // Cutout in the same coordinates as the image.
    const coLeft = this.cutoutRect.left - this.bBoxRect.left;
    const coRight = coLeft + this.cutoutRect.width;
    if (coLeft < imgLeft) {
      panX -= imgLeft - coLeft;
    } else if (coRight > imgRight) {
      panX += coRight - imgRight;
    }
    const imgTop = this.originY - (this.originY - panY) * zoom;
    const imgBottom = imgTop + this.imageHeight * zoom;
    const coTop = this.cutoutRect.top - this.bBoxRect.top;
    const coBottom = coTop + this.cutoutRect.height;
    if (coTop < imgTop) {
      panY -= imgTop - coTop;
    } else if (coBottom > imgBottom) {
      panY += coBottom - imgBottom;
    }

    this.positionAll(panX, panY, zoom);
  }

  mouseDown(e) {
    if (e.touches) {
      this.mouseX = e.touches[0].pageX;
      this.mouseY = e.touches[0].pageY;
    } else {
      this.mouseX = e.pageX;
      this.mouseY = e.pageY;
    }

    window.addEventListener('mousemove', this.mouseMove, { passive: false });
    window.addEventListener('touchmove', this.mouseTouch, { passive: false });
    window.addEventListener('mouseup', this.mouseUp, { passive: true });
    window.addEventListener('touchend', this.mouseUp, { passive: true });
    // Disable text selection in the entire document.
    document.body.style['userSelect'] = 'none';
  }

  // Perform image panning.
  translate(pageX, pageY) {
    const dX = pageX - this.mouseX;
    const dY = pageY - this.mouseY;

    this.mouseX = pageX;
    this.mouseY = pageY;

    // Make sure the image is within the cutout window.
    const imgRect = this.preview.current.getBoundingClientRect();

    // Check if the new position is within the boundaries, and if not if it's closer to them.
    let panX = Cropper.checkBound(this.state.panX, [imgRect.left, imgRect.right],
      [this.cutoutRect.left, this.cutoutRect.right], dX);
    let panY = Cropper.checkBound(this.state.panY, [imgRect.top, imgRect.bottom],
      [this.cutoutRect.top, this.cutoutRect.bottom], dY);

    this.positionAll(panX, panY, this.state.zoom);
  }

  // Image panning.
  mouseMove(e) {
    e.preventDefault();
    this.translate(e.pageX, e.pageY);
  }

  mouseTouch(e) {
    e.preventDefault();

    if (e.touches.length == 1) {
      this.translate(e.touches[0].pageX, e.touches[0].pageY);
      return;
    }

    // Image zooming by pinching.
    const [touch0, touch1] = e.touches;
    const distance = Math.sqrt((touch0.pageX - touch1.pageX) * (touch0.pageX - touch1.pageX) +
      (touch0.pageY - touch1.pageY) * (touch0.pageY - touch1.pageY));

    if (!this.prevDistance) {
        this.prevDistance = distance / this.state.zoom;
    }

    let scale = (distance / this.prevDistance);
    this.handleZoom(Math.max(this.minZoom, Math.min(this.maxZoom, scale)));
  }

  mouseUp(e) {
    window.removeEventListener('mousemove', this.mouseMove);
    window.removeEventListener('touchmove', this.mouseTouch);
    window.removeEventListener('mouseup', this.mouseUp);
    window.removeEventListener('touchend', this.mouseUp);
    // Re-enable text selection.
    document.body.style['userSelect'] = '';

    this.positionAll(this.state.panX, this.state.panY, this.state.zoom);
  }

  render() {
    // transform3d: position and scale.
    const t3d = `translate3d(${this.state.panX}px, ${this.state.panY}px, 0) scale(${this.state.zoom})`;
    // transformOrigin: zoom origin.
    const orig = `${this.state.originX}px ${this.state.originY}px`;

    // Overlay position and size are exactly equal to the position and size of the transformed image
    // except it uses different coordinates.
    const overlay = {
      top: `${this.originY - this.state.originY * this.state.zoom}px`,
      left: `${this.originX - this.state.originX * this.state.zoom}px`,
      width: `${this.imageWidth * this.state.zoom}px`,
      height: `${this.imageHeight * this.state.zoom}px`
    };
    return (
      <div className="cropper">
        <div className="bounding-box" ref={this.boundingBox}>
          <img src={this.props.source} className="preview" alt=""
            style={{transform: t3d, transformOrigin: orig}} ref={this.preview} onLoad={this.initScaling} />
          <div className="cutout circle" ref={this.cutout} />
          <div className="overlay" style={overlay} ref={this.overlay} />
        </div>
        <div className="zoom-wrapper">
          <input type="range" className="zoomer"
            step="0.001" min={this.state.minZoom} max={this.state.maxZoom} value={this.state.zoom} onChange={this.onZoom} />
        </div>
      </div>
    );
  }
}

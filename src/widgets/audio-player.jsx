// Audio recorder widget.

import React from 'react';

import { secondsToTime } from '../lib/strformat';
import { base64ToIntArray } from '../lib/blob-helpers';

// Make canvas bigger than the element size to reduce blurring.
const CANVAS_UPSCALING = 2.0;
// Thickness of a visualization bar.
const LINE_WIDTH = 3 * CANVAS_UPSCALING;
// Spacing between two visualization bars.
const SPACING = 2 * CANVAS_UPSCALING;
// Color of histogram bars.
const BAR_COLOR = '#888A';
const BAR_COLOR_DARK = '#666C';
const THUMB_COLOR = '#444E';
// Minimum number of amplitude bars to draw.
const MIN_PREVIEW_LENGTH = 16;

export default class AudioPlayer extends React.PureComponent {
  constructor(props) {
    super(props);

    let preview = base64ToIntArray(this.props.preview);
    if (!Array.isArray(preview) || preview.length < MIN_PREVIEW_LENGTH) {
      preview = null;
    }

    this.state = {
      canPlay: false,
      playing: false,
      currentTime: '0:00',
      duration: this.props.duration > 0 ? secondsToTime(this.props.duration / 1000) : '-:--',
      longMin: this.props.duration >= 600000,
      preview: preview
    };

    this.initAudio = this.initAudio.bind(this);
    this.initCanvas = this.initCanvas.bind(this);
    this.resampleBars = this.resampleBars.bind(this);
    this.visualize = this.visualize.bind(this);

    this.handlePlay = this.handlePlay.bind(this);
    this.handleSeek = this.handleSeek.bind(this);
    this.handleError = this.handleError.bind(this);

    this.audioPlayer = null;

    this.viewBuffer = [];
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    if (this.props.src) {
      this.initAudio();
    }

    this.initCanvas();
  }

  componentWillUnmount() {
    if (this.audioPlayer) {
      this.audioPlayer.oncanplay = null;
      this.audioPlayer.ontimeupdate = null;
      this.audioPlayer.onended = null;
      this.audioPlayer.pause();
      this.audioPlayer = null;
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.src != prevProps.src) {
      this.initAudio();
    }

    if (this.props.preview != prevProps.preview) {
      let preview = base64ToIntArray(this.props.preview);
      if (!Array.isArray(preview) || preview.length < MIN_PREVIEW_LENGTH) {
        preview = null;
      }
      this.setState({preview: preview}, this.initCanvas);
    }
  }

  initAudio() {
    this.audioPlayer = new Audio(this.props.src);
    this.audioPlayer.oncanplay = _ => this.setState({canPlay: true});
    this.audioPlayer.ontimeupdate = _ => this.setState({
      currentTime: secondsToTime(this.audioPlayer.currentTime, this.state.longMin)
    });
    this.audioPlayer.onended = _ => {
      this.audioPlayer.currentTime = 0;
      this.setState({playing: false, currentTime: secondsToTime(0, this.state.longMin)})
    }
  }

  initCanvas() {
    // Force canvas aspect ratio to match one of the element + upscale canvas to reduce blurring.
    this.canvasRef.current.width = this.canvasRef.current.offsetWidth * CANVAS_UPSCALING;
    this.canvasRef.current.height = this.canvasRef.current.offsetHeight * CANVAS_UPSCALING;

    this.canvasContext = this.canvasRef.current.getContext('2d');
    this.canvasContext.lineCap = 'round';

    this.viewBuffer = this.resampleBars(this.state.preview);
    this.visualize();
  }

  // Draw amplitude of sound.
  visualize() {
    if (!this.canvasRef.current) {
      return;
    }

    const width = this.effectiveWidth;
    const height = this.canvasRef.current.height;

    this.canvasContext.lineWidth = LINE_WIDTH;

    const drawFrame = () => {
      if (!this.canvasRef.current || !this.audioPlayer) {
        // The component is unmounted.
        return;
      }

      this.canvasContext.clearRect(0, 0, this.canvasRef.current.width, height);

      if (this.viewBuffer) {
        if (this.state.playing) {
          window.requestAnimationFrame(drawFrame);
        }

        // Current playback position.
        const thumbAt = this.props.duration ?
          Math.max(0, Math.min(this.audioPlayer.currentTime * 1000 / this.props.duration, 1)) * (width - LINE_WIDTH * 2) : -1;

        // Draw amplitude bars.
        this.canvasContext.beginPath();
        this.canvasContext.strokeStyle = BAR_COLOR_DARK;
        for (let i = 0; i < this.viewBuffer.length; i++) {
          let x = 1 + i * (LINE_WIDTH + SPACING) + LINE_WIDTH * 0.5;
          let y = this.viewBuffer[i] * height * 0.9;

          const color = x < thumbAt ? BAR_COLOR_DARK : BAR_COLOR;
          if (this.canvasContext.strokeStyle != color) {
            this.canvasContext.stroke();
            this.canvasContext.beginPath();
            this.canvasContext.strokeStyle = color;
          }

          this.canvasContext.moveTo(x, (height - y) * 0.5);
          this.canvasContext.lineTo(x, height * 0.5 + y * 0.5);
        }
        // Actually draw the bars on canvas.
        this.canvasContext.stroke();

        // Draw thumb.
        if (this.props.duration) {
          this.canvasContext.beginPath();
          this.canvasContext.arc(thumbAt + LINE_WIDTH * 2, height * 0.5, LINE_WIDTH * 2, 0, 2 * Math.PI);
          this.canvasContext.fillStyle = THUMB_COLOR;
          this.canvasContext.fill();
        }
      }
    }

    drawFrame();
  }

  // Quick and dirty downsampling of the original preview bars into a smaller (or equal) number of bars we can display here.
  resampleBars(original) {
    const dstCount = ((this.canvasRef.current.width - SPACING) / (LINE_WIDTH + SPACING)) | 0;
    // Remove extra padding on the right due to fractional bar which is not drawn.
    this.effectiveWidth = dstCount * (LINE_WIDTH + SPACING) + SPACING;

    if (!Array.isArray(original) || original.length == 0) {
      return Array.apply(null, Array(dstCount)).map(_ => 0.01);
    }

    const factor = original.length / dstCount;
    let amps = [];
    let maxAmp = -1;
    for (let i=0; i<dstCount; i++) {
      let lo = (i * factor) | 0; // low bound;
      let hi = ((i + 1) * factor) | 0; // high bound;
      if (hi == lo) {
        amps[i] = original[lo];
      } else {
        let amp = 0.0;
        for (let j=lo; j<hi; j++) {
          amp += original[j]
        }
        amps[i] = Math.max(0, amp / (hi - lo));
      }
      maxAmp = Math.max(amps[i], maxAmp);
    }

    if (maxAmp > 0) {
      return amps.map(a => a / maxAmp);
    }
    return Array.apply(null, Array(dstCount)).map(_ => 0.01);
  }

  handlePlay(e) {
    e.preventDefault();
    if (!this.state.canPlay) {
      return;
    }
    if (this.state.playing) {
      this.audioPlayer.pause();
      this.setState({playing: false});
    } else {
      this.audioPlayer.play();
      this.setState({playing: true}, this.visualize);
    }
  }

  handleError(err) {
    console.error(err);
  }

  handleSeek(e) {
    e.preventDefault();
    if (e.target && this.props.duration) {
      const rect = e.target.getBoundingClientRect();
      const offset = (e.clientX - rect.left) / this.effectiveWidth * CANVAS_UPSCALING;
      this.audioPlayer.currentTime = this.props.duration * offset / 1000;
      this.setState({currentTime: secondsToTime(this.audioPlayer.currentTime, this.state.longMin)});
      if (!this.state.playing) {
        this.visualize();
      }
    }
  }

  render() {
    const playClass = 'material-icons' +
      (this.props.short ? '' : ' large') +
      (this.state.canPlay ? '' : ' disabled');
    const play = (<a href="#" onClick={this.handlePlay} title="Play">
        <i className={playClass}>{this.state.playing ? 'pause_circle' :
          (this.state.canPlay ? 'play_circle' : 'not_interested')}</i>
      </a>);
    return (<div className="audio-player">{this.props.short ?
      <>
        <canvas className="playback" ref={this.canvasRef} onClick={this.handleSeek} />
        {play}
      </>
    :
      <>
        {play}
        <div>
          <canvas className="playback" ref={this.canvasRef} onClick={this.handleSeek} />
          <div className="timer">{this.state.currentTime}/{this.state.duration}</div>
        </div>
      </>
    }
    </div>);
  }
}

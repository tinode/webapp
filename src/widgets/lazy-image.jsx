// Image with a placeholder which is replaced when the promise is resolved.
import React from 'react';
import { FormattedMessage } from 'react-intl';

export default class LazyImage extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      src: 'img/placeholder.png',
      style: Object.assign({padding: '4px'}, this.props.style),
      className: this.props.className,
      alt: this.props.alt,
      onClick: this.props.onClick,
    };
  }

  componentDidMount() {
    this.props.whenDone
      .then(data => this.setState({src: data.src, style: {...this.state.style, padding: 0}}))
      .catch(() => this.setState({src: 'img/broken_image.png'}));
  }

  componentDidUpdate(prevProps) {
    if (prevProps.whenDone != this.props.whenDone) {
      this.setState({src: 'img/placeholder.png', style: {...this.state.style, padding: '4px'}});
      this.props.whenDone
        .then(data => this.setState({src: data.src, style: {...this.state.style, padding: 0}}))
        .catch(() => this.setState({src: 'img/broken_image.png'}));
    }
  }

  render() {
    return React.createElement('img', this.state);
  }
};

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
    // whenDone is a wrapper around an actual promise to be able to cancel it.
    this.props.whenDone
      .promise
      .then(data => this.setState({src: data.src, style: {...this.state.style, padding: 0}}))
      .catch(() => this.setState({src: 'img/broken_image.png'}));
  }

  componentWillUnmount() {
    this.props.whenDone.cancel();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.whenDone != this.props.whenDone) {
      this.setState({src: 'img/placeholder.png', style: {...this.state.style, padding: '4px'}});
      this.props.whenDone
        .promise
        .then(data => this.setState({src: data.src, style: {...this.state.style, padding: 0}}))
        .catch(() => this.setState({src: 'img/broken_image.png'}));
    }
  }

  render() {
    return React.createElement('img', this.state);
  }
};

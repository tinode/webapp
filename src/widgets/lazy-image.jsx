// Image with a placeholder which is replaced when the promise is resolved.
import React from 'react';
import { FormattedMessage } from 'react-intl';

export default class LazyImage extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      src: 'img/placeholder.png',
      style: this.props.style,
      className: this.props.className,
      loading: 'lazy',
      alt: this.props.alt,
      onClick: this.props.onClick,
    };

    this.props.whenDone
      .then(data => this.setState({src: data.src}))
      .catch(() => this.setState({src: 'img/broken_image.png'}));
  }

  render() {
    return React.createElement('img', this.state);
  }
};

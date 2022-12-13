// Drag & drop container: displays a banner on drag and calls a handler on drop.
import React from 'react';

export default class DragAndDrop extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // A file is being dragged over the container.
      dragging: false
    };
    this.dropRef = React.createRef();
    // Keeps track of the drag event.
    // Need a counter b/c the browser's 'drag' events may fire multiple times
    // when the user takes the mouse pointer over the container:
    // for the component itself and for all nested/child elements.
    this.dragCounter = 0;

    this.handleDrag = this.handleDrag.bind(this);
    this.handleDragIn = this.handleDragIn.bind(this);
    this.handleDragOut = this.handleDragOut.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
  }

  componentDidMount() {
    let div = this.dropRef.current;
    div.addEventListener('dragenter', this.handleDragIn);
    div.addEventListener('dragleave', this.handleDragOut);
    div.addEventListener('dragover', this.handleDrag);
    div.addEventListener('drop', this.handleDrop);
  }

  componentWillUnmount() {
    let div = this.dropRef.current;
    div.removeEventListener('dragenter', this.handleDragIn);
    div.removeEventListener('dragleave', this.handleDragOut);
    div.removeEventListener('dragover', this.handleDrag);
    div.removeEventListener('drop', this.handleDrop);
  }

  handleDrag(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  handleDragIn(e) {
    e.preventDefault();
    e.stopPropagation();
    this.dragCounter++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      this.setState({dragging: true});
    }
  }

  handleDragOut(e) {
    e.preventDefault();
    e.stopPropagation();
    this.dragCounter--;
    if (this.dragCounter == 0) {
      this.setState({dragging: false});
    }
  }

  handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({dragging: false});
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      this.props.onDrop(e.dataTransfer.files);
      e.dataTransfer.clearData();
      this.dragCounter = 0;
    }
  }

  render() {
    return (
      <div className='drag-and-drop' ref={this.dropRef}>
        {this.state.dragging ?
          <div className='banner'>{this.props.actionPrompt}</div>
          : null}
        {this.props.children}
      </div>
    );
  }
};

import React from 'react';

/* The X menu to be displayed in title bars */
export default class MenuCancel extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <a href="javascript:;" onClick={this.props.onCancel}><i className="material-icons">close</i></a>
    );
  }
}

import React from 'react';

export default class SearchContacts extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      edited: false,
      search: ''
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentWillUnmount() {
    if (this.state.edited) {
      this.setState({search: '', edited: false});
      this.props.onSearchContacts(Tinode.DEL_CHAR);
    }
  }

  handleSearchChange(e) {
    this.setState({search: e.target.value});
  }

  handleSearch(e) {
    e.preventDefault();
    var query = this.state.search.trim();
    this.setState({edited: (query.length > 0)});
    this.props.onSearchContacts(query.length > 0 ? query : Tinode.DEL_CHAR);
  }

  handleClear() {
    if (this.state.edited) {
      this.props.onSearchContacts(Tinode.DEL_CHAR);
    }
    this.setState({search: '', edited: false});
  }

  handleKeyDown(e) {
    if (e.key === 'Enter') {
      this.handleSearch(e);
    } else if (e.key === 'Escape') {
      this.handleClear();
    }
  }

  render() {
    return (
      <div className="panel-form">
        <div className="panel-form-row">
          <i className="material-icons search">search</i>
          <input className="search" type="text"
            placeholder="List like email:alice@example.com, tel:17025550003..."
            value={this.state.search} onChange={this.handleSearchChange}
            onKeyDown={this.handleKeyDown} required autoFocus />
          <a href="javascript:;" onClick={this.handleClear}>
            <i className="material-icons">close</i>
          </a>
        </div>
      </div>
    );
  }
};

// PermissionsEditor: Component for editing permissions
// <PermissionsEditor mode="JWROD" skip="O" onChange={this.handleCheckboxTest} />

import React from 'react';

import CheckBox from './checkbox.jsx';

export default class PermissionsEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mode: (props.mode || '').replace('N', '')
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleChange(val) {
    let mode = this.state.mode;
    let idx = mode.indexOf(val);
    if (idx == -1) {
      mode += val;
    } else {
      mode = mode.replace(val, '');
    }
    this.setState({mode: mode});
  }

  handleSubmit() {
    // Normalize string, otherwise cannot check if mode has changed.
    var mode = (this.state.mode || 'N').split('').sort().join('');
    var before = (this.props.mode || 'N').split('').sort().join('')
    if (mode !== before) {
      this.props.onSubmit(mode);
    } else {
      this.props.onCancel();
    }
  }

  handleCancel() {
    this.props.onCancel();
  }

  render() {
    const all = 'JRWPASDO';
    const names = {
      'J': 'Join (J)',
      'R': 'Read (R)',
      'W': 'Write (W)',
      'P': 'Get notified (P)',
      'A': 'Approve (A)',
      'S': 'Share (S)',
      'D': 'Delete (D)',
      'O': 'Owner (O)'
    };

    let skip = this.props.skip || '';
    let mode = this.state.mode;
    let compare = (this.props.compare || '').replace('N', '');
    let items = [];
    for (let i=0; i<all.length; i++) {
      let c = all.charAt(i);
      if (skip.indexOf(c) >= 0 && mode.indexOf(c) < 0) {
        // Permission is marked as inactive: hide unchecked permissions, disable checked permissions
        continue;
      }
      items.push(
        <tr key={c}>
          <td>{names[c]}</td>
          <td className="checkbox">{skip.indexOf(c) < 0 ?
            <CheckBox name={c} checked={(mode.indexOf(c) >= 0)} onChange={this.handleChange}/>
            :
            <CheckBox name={c} checked={(mode.indexOf(c) >= 0)} />
          }</td>{this.props.compare ? <td className="checkbox">
            <CheckBox name={c} checked={(compare.indexOf(c) >= 0)}/>
          </td> : null}
        </tr>
      );
    }

    return (
      <div className="panel-form-column">
        {this.props.userTitle ?
          <ul className="contact-box"><Contact
            item={this.props.item}
            title={this.props.userTitle}
            avatar={makeImageUrl(this.props.userAvatar ? this.props.userAvatar : null)} /></ul> : null}
        <label className="small">Permissions</label>
        <table className="permission-editor">
        {this.props.compare ?
          <thead><tr>
            <th></th><th>{this.props.modeTitle}</th>
            <th>{this.props.compareTitle}</th>
          </tr></thead> :
          null}
        <tbody>
          {items}
        </tbody></table>
        <br />
        <div className="dialog-buttons">
          <button className="blue" onClick={this.handleSubmit}>Ok</button>
          <button className="white" onClick={this.handleCancel}>Cancel</button>
        </div>
      </div>
    );
  }
};

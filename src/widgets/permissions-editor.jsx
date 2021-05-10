// PermissionsEditor: Component for editing permissions
// <PermissionsEditor mode="JWROD" skip="O" onChange={this.handleCheckboxTest} />
import React from 'react';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';

import CheckBox from './checkbox.jsx';
import Contact from './contact.jsx';

import { makeImageDataUrl } from '../lib/blob-helpers.js';

// Translatable permission names.
const messages = defineMessages({
  joiner: {
    id: 'permission_join',
    defaultMessage: "Join ({val})",
    description: 'Name of J permission'
  },
  reader: {
    id: 'permission_read',
    defaultMessage: "Read ({val})",
    description: 'Name of R permission'
  },
  writer: {
    id: 'permission_write',
    defaultMessage: "Write ({val})",
    description: 'Name of W permission'
  },
  preser: {
    id: 'permission_pres',
    defaultMessage: "Get notified ({val})",
    description: 'Name of P permission'
  },
  approver: {
    id: 'permission_admin',
    defaultMessage: "Approve ({val})",
    description: 'Name of A permission'
  },
  sharer: {
    id: 'permission_share',
    defaultMessage: "Share ({val})",
    description: 'Name of S permission'
  },
  deleter: {
    id: 'permission_delete',
    defaultMessage: "Delete ({val})",
    description: 'Name of D permission'
  },
  owner: {
    id: 'permission_owner',
    defaultMessage: "Owner ({val})",
    description: 'Name of O permission'
  }
});

class PermissionsEditor extends React.Component {
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
    const {formatMessage} = this.props.intl;
    const all = 'JRWPASDO';
    const names = {
      'J': formatMessage(messages.joiner, {val: 'J'}),
      'R': formatMessage(messages.reader, {val: 'R'}),
      'W': formatMessage(messages.writer, {val: 'W'}),
      'P': formatMessage(messages.preser, {val: 'P'}),
      'A': formatMessage(messages.approver, {val: 'A'}),
      'S': formatMessage(messages.sharer, {val: 'S'}),
      'D': formatMessage(messages.deleter, {val: 'D'}),
      'O': formatMessage(messages.owner, {val: 'O'})
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
            avatar={makeImageDataUrl(this.props.userAvatar ? this.props.userAvatar : null)} /></ul> : null}
        <label className="small"><FormattedMessage id="title_permissions"
          defaultMessage="Permissions" description="Section title"/></label>
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
          <button className="outline" onClick={this.handleCancel}>
            <FormattedMessage id="button_cancel" defaultMessage="Cancel" description="Button [Cancel]" />
          </button>
          <button className="primary" onClick={this.handleSubmit}>
            <FormattedMessage id="button_ok" defaultMessage="OK" description="Button [OK]" />
          </button>
        </div>
      </div>
    );
  }
};

export default injectIntl(PermissionsEditor);

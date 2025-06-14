// Edit account parameters.
import React from 'react';
import { FormattedMessage } from 'react-intl';

import CheckBox from '../widgets/checkbox.jsx';

export default class AccAppearanceView extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      colorSchema: props.colorSchema || 'light dark',
    };

    this.handleColorSchemaSelected = this.handleColorSchemaSelected.bind(this);
  }

  handleColorSchemaSelected(e) {
    this.setState({colorSchema: e.currentTarget.value});
    this.props.onChangeColorSchema(e.currentTarget.value);
  }

  render() {
    return (
        <div id="settings-form" className="scrollable-panel">
          <div className="panel-form-row">
            <label className="small">
              <FormattedMessage id="label_color_schema" defaultMessage="Theme:"
                description="Label for selecting color scheme (dark, light) in Settings" />
            </label>
          </div>
          <div className="panel-form-row">
            <ul className="quoted">
              <li key="system">
                <input type="radio" id="system" name="color-scheme-select" value="light dark"
                  checked={this.state.colorSchema === 'light dark'}
                  onChange={this.handleColorSchemaSelected} />&nbsp;
                <label htmlFor="system">
                  <FormattedMessage id="color_schema_system" defaultMessage="System default" description="Name of the color schema"/>&nbsp;
                  <img src="../img/routine.svg" style={{verticalAlign: 'top', width: '1.6rem', height: '1.6rem'}}/>
                </label>
              </li>
              <li key="light">
                <input type="radio" id="light" name="color-scheme-select" value="light"
                  checked={this.state.colorSchema === 'light'}
                  onChange={this.handleColorSchemaSelected} />&nbsp;
                <label htmlFor="light">
                  <FormattedMessage id="color_schema_light" defaultMessage="Light" description="Name of the color schema"/>&nbsp;
                  <i className="material-icons orange large">light_mode</i>
                </label>
              </li>
              <li key="dark">
                <input type="radio" id="dark" name="color-scheme-select" value="dark"
                  checked={this.state.colorSchema === 'dark'}
                  onChange={this.handleColorSchemaSelected} />&nbsp;
                <label htmlFor="dark">
                  <FormattedMessage id="color_schema_dark" defaultMessage="Dark" description="Name of the color schema"/>&nbsp;
                  <i className="material-icons blue large">dark_mode</i>
                </label>
              </li>
            </ul>
          </div>
        </div>
    );
  }
};

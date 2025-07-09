// Edit account parameters.
import React from 'react';
import { FormattedMessage } from 'react-intl';

export default class AccAppearanceView extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      colorSchema: props.colorSchema || 'light dark',
      textSize: (props.textSize * 10) || '100',
    };

    this.handleColorSchemaSelected = this.handleColorSchemaSelected.bind(this);
    this.handleTextSizeChanged = this.handleTextSizeChanged.bind(this);
  }

  handleColorSchemaSelected(e) {
    this.setState({colorSchema: e.currentTarget.value});
    this.props.onChangeColorSchema(e.currentTarget.value);
  }

  handleTextSizeChanged(e) {
    // In %%.
    this.setState({textSize: e.currentTarget.value});
    // Convert %% to pt, 100% = 10pt.
    this.props.onTextSizeChanged((e.currentTarget.value / 10) | 0);
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
          <div className="hr" />
          <div className="panel-form-row">
            <label className="small">
              <FormattedMessage id="label_text_size" defaultMessage="Text size:"
                description="Label adjusting text size" />
            </label>
          </div>
          <div className="panel-form-column">
            <div className="panel-form-row">
              <input type="range" id="text_size" name="text_size" min="80" max="120" step="10"
                list="text_size_options" value={this.state.textSize} onChange={this.handleTextSizeChanged} />
            </div>
            <div className="panel-form-row">
              <datalist id="text_size_options">
                <option value="80" label="80%" />
                <option value="90" label="90%" />
                <option value="100" label="100%" />
                <option value="110" label="110%" />
                <option value="120" label="120%" />
              </datalist>
            </div>
          </div>
        </div>
    );
  }
};

// Edit account parameters.
import React from 'react';
import { FormattedMessage } from 'react-intl';
import HashNavigation from '../lib/navigation.js';
import { WALLPAPER_DEFAULTS } from '../config.js';
import imageIndex from '../../img/bkg/index.json';

export default class WallpapersView extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      tab: WALLPAPER_DEFAULTS.type, // currently selected tab: 'patt' | 'img'
      selectedType: WALLPAPER_DEFAULTS.type, // type of the selected wallpaper.
      wallpaper: imageIndex[WALLPAPER_DEFAULTS.type][WALLPAPER_DEFAULTS.index].name,
      blur: 0,
    };

    this.blurValues = [0, 1, 2, 4, 8, 16];

    this.handleTabClick = this.handleTabClick.bind(this);
    this.handleWallpaperSelected = this.handleWallpaperSelected.bind(this);
    this.handleBlurChanged = this.handleBlurChanged.bind(this);
  }

  handleTabClick(e) {
    e.preventDefault();
    HashNavigation.navigateTo(HashNavigation.addUrlParam(window.location.hash, 'tab', e.currentTarget.dataset.id));
    this.setState({tab: e.currentTarget.dataset.id});
  }

  handleWallpaperSelected(e) {
    let index, type, blur
    if (!e) {
      // Restore default.
      type = WALLPAPER_DEFAULTS.type;
      index = WALLPAPER_DEFAULTS.index;
      blur = 0;
    } else {
      e.preventDefault();
      type = this.state.tab;
      index = e.currentTarget.dataset.id;
      blur = type == 'patt' ? 0 : this.state.blur;
    }
    const fname = imageIndex[type][index].name;
    const size = type == 'patt' ? imageIndex[type][index].size : 0;
    this.setState({tab: type, wallpaper: fname, selectedType: type, blur: blur});
    this.props.onWallpaperSelected(`../${WALLPAPER_DEFAULTS.path}${fname}`, size, this.blurValues[blur]);
  }

  handleBlurChanged(e) {
    e.preventDefault();
    const blur = e.currentTarget.value;
    this.setState({blur: blur});
    if (this.state.selectedType == 'img') {
      // Apply blur to patterns only. Path relative to CSS file.
      this.props.onWallpaperSelected(`../${WALLPAPER_DEFAULTS.path}${this.state.wallpaper}`, 0, this.blurValues[blur]);
    }
  }

  render() {
    return (
      <div className="flex-column">
        <div className="panel-form-row clean-clickable">
          <a className="flat-button" onClick={() => this.handleWallpaperSelected(null)}>
            <i className="m-icon">undo</i>&nbsp;
            <FormattedMessage id="button_restore" defaultMessage="Restore default" description="Reset setting to default"/>
          </a>
        </div>
        <ul className="tabbar">
          <li className={this.state.tab === 'patt' ? 'active' : null}>
            <a href="#" data-id="patt" onClick={this.handleTabClick}>
              <FormattedMessage id="tabtitle_pattern" defaultMessage="pattern"
                description="Tab title Pattern" />
            </a>
          </li>
          <li className={this.state.tab === 'img' ? 'active' : null}>
            <a href="#" data-id="img" onClick={this.handleTabClick}>
              <FormattedMessage id="tabtitle_image" defaultMessage="image"
                description="Tab title Image" />
            </a>
          </li>
        </ul>
        <div id="settings-form" className="scrollable-panel">
        {this.state.tab === 'patt' ?
          <div className="image-grid">
            {imageIndex.patt.map((img, idx) => {
              const selected = this.state.wallpaper === img.name ? ' selected' : '';
              const dark = this.props.colorSchema == 'dark' ? 'inverted' : null;
              return <div key={idx} data-id={idx} className={`image-grid-cell${selected}`}
                onClick={this.handleWallpaperSelected}>
                <img src={WALLPAPER_DEFAULTS.path + img.name} alt={img.name} className={dark}
                  style={{ width: `${img.size}px`, height: `${img.size}px` }}/>
              </div>
            })}
          </div> :
          <>
            <div className="panel-form-column">
              <div className="panel-form-row">
                <label className="small">
                  <FormattedMessage id="label_blur_wallpaper" defaultMessage="Blur:"
                    description="Label adjusting blur amount" />
                </label>
              </div>
              <div className="panel-form-row">
                <input type="range" id="blur" name="blur" min="0" max="5" step="1"
                  value={this.state.blur} onChange={this.handleBlurChanged} />
              </div>
            </div>
            <div className="image-grid">
              {imageIndex.img.map((img, idx) => {
                const selected = this.state.wallpaper === img.name ? ' selected' : '';
                return <div key={idx} data-id={idx} className={`image-grid-cell${selected}`}
                  onClick={this.handleWallpaperSelected}>
                  <img src={WALLPAPER_DEFAULTS.path + img.pr} alt={img.name} style={{ width: '100%', height: '100%' }}/>
                </div>
              })}
            </div>
          </>
        }</div>
      </div>
    );
  }
}

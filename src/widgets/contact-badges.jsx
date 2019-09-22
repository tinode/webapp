import React from 'react';

const icon_mapping = {'muted': 'notifications_off', 'banned': 'block'};

/* Contact's labels: [you], or icons [muted], [blocked] */
export default class ContactBadges extends React.PureComponent {
    render() {
      let badges = null;
      if (this.props.badges && this.props.badges.length > 0) {
        badges = [];
        this.props.badges.map(function(b) {
          if (b.icon) {
            badges.push(<i className="material-icons as-badge" key={b.key || b.icon}>{icon_mapping[b.icon]}</i>);
          } else {
            const style = 'badge' + (b.color ? ' ' + b.color : '');
            badges.push(<span className={style} key={b.key || b.name}>{b.name}</span>);
          }
        });
        return <>{badges}</>;
      }
      return null;
    }
};

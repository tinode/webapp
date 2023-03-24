import React from 'react';

const icon_mapping = {'muted': 'notifications_off', 'banned': 'block', 'staff': 'verified_user'};

/* Contact's labels: [you], or icons [muted], [blocked] */
export default class ContactBadges extends React.PureComponent {
  render() {
    let badges = null;
    if (this.props.badges && this.props.badges.length > 0) {
      badges = [];
      this.props.badges.forEach(b => {
        const color = (b.color ? ' ' + b.color : '');
        if (b.icon) {
          badges.push(<i className={'material-icons as-badge' + color} key={b.key || b.icon}>{icon_mapping[b.icon] || b.icon}</i>);
        } else {
          badges.push(<span className={'badge' + color} key={b.key || b.name}>{b.name}</span>);
        }
      });
      return <>{badges}</>;
    }
    return null;
  }
};

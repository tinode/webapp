import React from 'react';

/* Contact's labels: [you], [muted], [blocked], etc */
// FIXME: this class is unused.
export default class ContactBadges_UNUSED_REMOVE extends React.PureComponent {
    render() {
      let badges = null;
      if (this.props.badges && this.props.badges.length > 0) {
        badges = [];
        this.props.badges.map(function(b) {
          var style = 'badge' + (b.color ? ' ' + b.color : '');
          // Badge names are expected to be unique, so using the name as the key.
          badges.push(<span className={style} key={b.name}>{b.name}</span>);
        });
      }
      return badges;
    }
};

import React from 'react';

/* Contact's labels: [you], [muted], [blocked], etc */
// FIXME: this class is unused.
export default class ContactBadges extends React.PureComponent {
    render() {
      let badges = null;
      if (this.props.badges && this.props.badges.length > 0) {
        badges = [];
        this.props.badges.map(function(b) {
          let style = 'badge' + (b.color ? ' ' + b.color : '');
          badges.push(<span className={style} key={b.key || b.name}>{b.name}</span>);
        });
      }
      return <span>{badges}</span>;
    }
};

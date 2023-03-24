import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';

const icon_mapping = {'staff': 'verified_user'};

const messages = defineMessages({
  badge_verified: {
    id: 'badge_verified',
    defaultMessage: 'Verified/official',
    description: 'Explanation of a verified account or topic badge'
  },
  badge_staff: {
    id: 'badge_staff',
    defaultMessage: 'Staff-managed',
    description: 'Explanation of a staff-managed account or topic badge'
  },
  badge_danger: {
    id: 'badge_danger',
    defaultMessage: 'Untrustworthy',
    description: 'Suspicious or untrustworthy account or topic badge'
  },
});


/* Trusted badges with labels: verified, staff, danger */
class BadgeList extends React.PureComponent {
  render() {
    const {formatMessage} = this.props.intl;
    let badges = null;
    if (this.props.trustedBadges && this.props.trustedBadges.length > 0) {
      badges = [];
      this.props.trustedBadges.forEach(b => {
        const comment = this.props.short ? null : formatMessage(messages['badge_' + b]);
        const style = 'material-icons ' + b + '-color';
        badges.push(<div className="trusted-badge" key={b}><i className={style}>{icon_mapping[b] || b}</i> {comment}</div>);
      });
      return <>{badges}</>;
    }
    return null;
  }
};

export default injectIntl(BadgeList);

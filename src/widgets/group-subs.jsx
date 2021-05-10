// GroupSubs: a list of group subscribers currently online.
// Show in the topic title bar
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { MAX_ONLINE_IN_TOPIC } from '../config.js'

import LetterTile from './letter-tile.jsx';
import { makeImageDataUrl } from '../lib/blob-helpers.js';

export default class GroupSubs extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const usersOnline = [];
    const totalCount = (this.props.subscribers || []).length;
    const countToShow = Math.min(MAX_ONLINE_IN_TOPIC, totalCount);

    (this.props.subscribers || []).some((sub) => {
      usersOnline.push(
        <div className="avatar-box" key={sub.user}>
          <LetterTile
            topic={sub.user}
            avatar={makeImageDataUrl(sub.public ? sub.public.photo : null) || true}
            title={sub.public ? sub.public.fn : null} />
        </div>
      );
      return usersOnline.length == countToShow;
    });

    return (
      <div id="topic-users">{usersOnline} {totalCount > countToShow ?
        <span>
          <FormattedMessage id="more_online_members" defaultMessage="+{overflow} more"
              description="Shown in MessagesView title bar when the number of online subscribers exceeds MAX_ONLINE_IN_TOPIC"
              values={{ overflow: (totalCount - countToShow) }} />
        </span> : null}
      </div>
    );
  }
};

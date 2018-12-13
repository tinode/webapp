/* GroupSubs: a list of group subscribers currently online */

import React from 'react';

import LetterTile from './letter-tile.jsx';
import { makeImageUrl } from '../lib/blob-helpers.js';

export default class GroupSubs extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const usersOnline = [];
    (this.props.subscribers || []).map((sub) => {
      usersOnline.push(
        <div className="avatar-box" key={sub.user}>
          <LetterTile
            topic={sub.user}
            avatar={makeImageUrl(sub.public ? sub.public.photo : null) || true}
            title={sub.public ? sub.public.fn : null} />
        </div>
      );
    });
    return (
      <div id="topic-users">{usersOnline}</div>
    );
  }
};

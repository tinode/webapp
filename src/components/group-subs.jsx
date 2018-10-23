import React from 'react';

/* GroupSubs: a list of group subscribers currently online */
export default class GroupSubs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      onlineSubs: props.subscribers || []
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      onlineSubs: nextProps.subscribers ? nextProps.subscribers : []
    };
  }

  render() {
    var usersOnline = [];
    this.state.onlineSubs.map((sub) => {
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

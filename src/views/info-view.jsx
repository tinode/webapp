// InfoView: panel with topic/user info.
import React from 'react';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';

import { Tinode } from 'tinode-sdk';

import AvatarUpload from '../widgets/avatar-upload.jsx';
import BadgeList from '../widgets/badge-list.jsx';
import CheckBox from '../widgets/checkbox.jsx';
import ContactList from '../widgets/contact-list.jsx';
import ErrorPanel from '../widgets/error-panel.jsx';
import GroupManager from '../widgets/group-manager.jsx';
import MenuCancel from '../widgets/menu-cancel.jsx';
import PermissionsEditor from '../widgets/permissions-editor.jsx';
import TopicCommon from '../widgets/topic-common.jsx';
import TopicSecurity from '../widgets/topic-security.jsx';

import { MAX_TITLE_LENGTH, MAX_TOPIC_DESCRIPTION_LENGTH, NO_ACCESS_MODE } from '../config.js';

import { makeImageUrl } from '../lib/blob-helpers.js';
import { theCard } from '../lib/utils.js';

const messages = defineMessages({
  info: {
    id: 'panel_title_info',
    description: 'Title for InfoView',
    defaultMessage: 'Info'
  },
  general: {
    id: 'panel_title_general',
    description: 'Title for TopicCommon.',
    defaultMessage: 'General'
  },
  security: {
    id: 'panel_title_security',
    description: 'Title for TopicSecirity and AccSecurity.',
    defaultMessage: 'Security'
  },
  members: {
    id: 'panel_title_members',
    description: 'Title for managing group members view.',
    defaultMessage: 'Members'
  },
  crop: {
    id: 'panel_title_crop',
    description: 'Title for AvatarCropView.',
    defaultMessage: 'Drag to Adjust'
  },
  perm_want: {
    id: 'requested_permissions',
    defaultMessage: 'Requested',
    description: 'Title for permissions'
  },
  perm_given: {
    id: 'granted_permissions',
    defaultMessage: 'Granted',
    description: 'Title for permissions'
  },
  perm_auth: {
    id: 'permissions_authenticated',
    defaultMessage: 'Authenticated',
    description: 'Title for editing default authenticated permissions'
  },
  perm_anon: {
    id: 'permissions_anonymous',
    defaultMessage: 'Anonymous',
    description: 'Title for editing default anonymous permissions'
  },
  perm_user: {
    id: 'permissions_user',
    defaultMessage: 'User\'s Permissions',
    description: 'Title for editing user\'s permissions'
  },
  edit_permissions: {
    id: 'menu_item_edit_permissions',
    defaultMessage: 'Edit permissions',
    description: 'Menu item [Edit permissions]'
  },
});

function _clip(str, length) {
  return str && str.substring(0, length);
}

class InfoView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      topic: null,
      owner: false,
      admin: false,
      sharer: false,
      deleter: false,
      muted: false,
      address: null,
      groupTopic: undefined,
      channel: undefined,
      fullName: undefined,
      description: undefined,
      avatar: null,
      private: null,
      selectedContact: null,
      access: null,
      modeGiven: null,
      modeWant: null,
      modeGiven2: null, // P2P topic, the other user mode given
      modeWant2: null,  // P2P topic, the other user mode want
      auth: null,
      anon: null,
      contactList: [],
      trustedBadges: [],
      previousMetaDesc: undefined,
      previousSubsUpdated: undefined,
    };

    this.resetSubs = this.resetSubs.bind(this);
    this.resetDesc = this.resetDesc.bind(this);
    this.resetTags = this.resetTags.bind(this);
    this.onMetaDesc = this.onMetaDesc.bind(this);
    this.onSubsUpdated = this.onSubsUpdated.bind(this);
    this.handleImageChanged = this.handleImageChanged.bind(this);
    this.handleMuted = this.handleMuted.bind(this);
    this.handleUnarchive = this.handleUnarchive.bind(this);
    this.handlePermissionsChanged = this.handlePermissionsChanged.bind(this);
    this.handleLaunchPermissionsEditor = this.handleLaunchPermissionsEditor.bind(this);
    this.handleShowAddMembers = this.handleShowAddMembers.bind(this);
    this.handleMemberUpdateRequest = this.handleMemberUpdateRequest.bind(this);
    this.handleMemberSelected = this.handleMemberSelected.bind(this);
    this.handleContextMenu = this.handleContextMenu.bind(this);
    this.handleBackNavigate = this.handleBackNavigate.bind(this);
  }

  // No need to separately handle component mount.
  componentDidUpdate(props) {
    const topic = this.props.tinode.getTopic(props.topic);
    if (!topic) {
      return;
    }

    if (this.onMetaDesc != topic.onMetaDesc) {
      this.previousMetaDesc = topic.onMetaDesc;
      topic.onMetaDesc = this.onMetaDesc;

      this.previousSubsUpdated = topic.onSubsUpdated;
      topic.onSubsUpdated = this.onSubsUpdated;
    }

    if (this.state.topic != props.topic) {
      this.setState({topic: props.topic});
      this.resetDesc(topic, props);
      this.resetSubs(topic, props);
      this.resetTags(topic);
    }
  }

  componentWillUnmount() {
    const topic = this.props.tinode.getTopic(this.props.topic);
    if (!topic) {
      return;
    }
    this.setState({topic: null});
    topic.onMetaDesc = this.previousMetaDesc;
    topic.onSubsUpdated = this.previousSubsUpdated;
  }

  resetSubs(topic, props) {
    const newState = {contactList: []};
    if (topic.getType() == 'p2p') {
      // Fetch the other party in the p2p conversation.
      // Topic may not be ready yet, so check if user is found.
      const user2 = topic.subscriber(props.topic);
      if (user2) {
        newState.modeGiven2 = user2.acs.getGiven();
        newState.modeWant2 = user2.acs.getWant();
      } else {
        newState.modeGiven2 = NO_ACCESS_MODE;
        newState.modeWant2 = NO_ACCESS_MODE;
      }
    } else {
      topic.subscribers((sub) => {
        newState.contactList.push(sub);
      }, this);
    }

    this.setState(newState);
  }

  resetDesc(topic, props) {
    const defacs = topic.getDefaultAccess() || {};
    const acs = topic.getAccessMode();

    const badges = [];
    if (topic.trusted) {
      for (const [key, val] of Object.entries(topic.trusted)) {
        if (val) {
          badges.push(key);
        }
      }
    }

    this.setState({
      owner: acs && acs.isOwner(),
      admin: acs && acs.isAdmin(),
      sharer: acs && acs.isSharer(),
      deleter: acs && acs.isDeleter(),
      muted: acs && acs.isMuted(),

      fullName: _clip(topic.public ? topic.public.fn : undefined, MAX_TITLE_LENGTH),
      description: _clip(topic.public ? topic.public.note : undefined, MAX_TOPIC_DESCRIPTION_LENGTH),
      avatar: makeImageUrl(topic.public ? topic.public.photo : null),
      trustedBadges: badges,
      private: _clip(topic.private ? topic.private.comment : null, MAX_TITLE_LENGTH),
      archived: topic.isArchived(),
      address: topic.name,
      groupTopic: topic.isGroupType(),
      channel: topic.isChannelType() || topic.chan,
      access: acs ? acs.getMode() : undefined,
      modeGiven: acs ? acs.getGiven() : undefined,
      modeWant: acs ? acs.getWant() : undefined,
      auth: defacs.auth,
      anon: defacs.anon
    });
  }

  resetTags(topic) {
    if (topic.getType() != 'grp') {
      return;
    }

    const acs = topic.getAccessMode();
    if (acs && acs.isOwner()) {
      // Requesting tags: owner is editing the topic.
      topic.getMeta(topic.startMetaQuery().withTags().build());
    }
  }

  onMetaDesc(desc) {
    const topic = this.props.tinode.getTopic(this.props.topic);
    if (!topic) {
      return;
    }
    this.resetDesc(topic, this.props);

    if (this.previousMetaDesc && this.previousMetaDesc != this.onMetaDesc) {
      this.previousMetaDesc(desc);
    }
  }

  onSubsUpdated(subs) {
    const topic = this.props.tinode.getTopic(this.props.topic);
    if (!topic) {
      return;
    }
    this.resetSubs(topic, this.props);

    if (this.previousSubsUpdated && this.previousSubsUpdated != this.onSubsUpdated) {
      this.previousSubsUpdated(subs);
    }
  }

  handleImageChanged(img) {
    this.setState({avatar: img});
    this.props.onTopicDescUpdate(this.props.topic, theCard(null, img || Tinode.DEL_CHAR), null);
  }

  handleMuted(ignored, checked) {
    this.setState({muted: checked});
    this.props.onChangePermissions(this.props.topic, checked ? '-P' : '+P');
  }

  handleUnarchive(ignored, ignored2) {
    this.props.onTopicUnArchive(this.props.topic);
  }

  handlePermissionsChanged(which, perm) {
    switch (which) {
      case 'auth':
        this.props.onTopicDescUpdateRequest(this.props.topic, null, null, {auth: perm});
        break;
      case 'anon':
        this.props.onTopicDescUpdateRequest(this.props.topic, null, null, {anon: perm});
        break;
      case 'mode':
      case 'want':
        this.props.onChangePermissions(this.props.topic, perm);
        break;
      case 'given':
        this.props.onChangePermissions(this.props.topic, perm, this.props.topic);
        break;
      case 'user':
        this.props.onChangePermissions(this.props.topic, perm, this.state.userPermissionsEdited);
        break;
    }

    this.handleBackNavigate();
  }

  handleLaunchPermissionsEditor(which, uid) {
    const {formatMessage} = this.props.intl;
    let toEdit, toCompare, toSkip, titleEdit, titleCompare, userTitle, userAvatar;
    switch (which) {
      case 'mode':
        toEdit = this.state.access;
        break;
      case 'want':
        toEdit = this.state.modeWant;
        toCompare = this.state.modeGiven;
        if (this.state.owner) {
          // Don't allow owner to unset 'O' permission. All other permissions are OK.
          toSkip = 'O';
        } else {
          // Allow accepting any of 'ASDO' permissions but don't allow asking for them.
          toSkip = Tinode.AccessMode.encode(Tinode.AccessMode.diff('ASDO', this.state.modeGiven));
          if (this.state.channel) {
            // Channels are read-only.
            toSkip += 'W';
          }
        }
        titleEdit = formatMessage(messages.perm_want);
        titleCompare = formatMessage(messages.perm_given);
        break;
      case 'given':
        toEdit = this.state.modeGiven2;
        toCompare = this.state.modeWant2;
        toSkip = this.state.groupTopic ? (this.state.owner ? '' : 'O') : 'ASDO';
        titleEdit = formatMessage(messages.perm_given);
        titleCompare = formatMessage(messages.perm_want);
        break;
      case 'auth':
        toEdit = this.state.auth;
        toSkip = 'O';
        break;
      case 'anon':
        toEdit = this.state.anon;
        toSkip = 'O';
        break;
      case 'user': {
        const topic = this.props.tinode.getTopic(this.props.topic);
        if (!topic) {
          return;
        }
        const user = topic.subscriber(uid);
        if (!user || !user.acs) {
          return;
        }
        toEdit = user.acs.getGiven();
        toCompare = user.acs.getWant();
        toSkip = this.state.owner ? '' : 'O';
        titleEdit = formatMessage(messages.perm_given);
        titleCompare = formatMessage(messages.perm_want);
        if (user.public) {
          userTitle = user.public.fn;
          userAvatar = user.public.photo;
        }
        break;
      }
      default:
        console.error("Unknown permission editing mode '" + which + "'");
        return;
    }
    this.setState({
      userPermissionsEdited: uid,
      userPermissionsTitle: userTitle,
      userPermissionsAvatar: userAvatar,
      editedPermissions: toEdit,
      immutablePermissions: toCompare,
      editedPermissionsTitle: titleEdit,
      immutablePermissionsTitle: titleCompare,
      editedPermissionsSkipped: toSkip,
    });
    this.props.onNavigate(`perm/${which}`);
  }

  handleShowAddMembers(e) {
    e.preventDefault();
    this.props.onInitFind();
    this.props.onNavigate('members');
  }

  handleMemberUpdateRequest(members, added, removed) {
    this.props.onMemberUpdateRequest(this.props.topic, added, removed);
    this.props.onNavigate('info');
  }

  handleMemberSelected(uid) {
    this.setState({selectedContact: uid});
  }

  handleBackNavigate() {
    const args = (this.props.panel || 'info').split('/');
    if (args[0] == 'info') {
      this.props.onNavigate(null);
    } else if (args[0] == 'perm') {
      if (args[1] == 'user') {
        this.props.onNavigate('info');
      } else {
        this.props.onNavigate('security');
      }
    } else {
      this.props.onNavigate('info');
    }
  }

  handleContextMenu(params) {
    const {formatMessage} = this.props.intl;
    const topic = this.props.tinode.getTopic(this.props.topic);
    if (!topic) {
      return;
    }
    const user = topic.subscriber(params.topicName);
    if (!user || !user.acs) {
      return;
    }

    const isMe = this.props.tinode.isMe(params.topicName);
    const menuItems = [
      {title: formatMessage(messages.edit_permissions), handler: () => {
        this.handleLaunchPermissionsEditor(isMe ? 'want' : 'user', params.topicName);
      }}
    ];
    if (!isMe) {
      menuItems.push('member_delete');
    }
    menuItems.push(user.acs.isMuted() ? 'member_unmute' : 'member_mute');
    if (!isMe) {
      menuItems.push(user.acs.isJoiner() ? 'member_block' : 'member_unblock');
    }
    this.props.showContextMenu({
      topicName: this.props.topic,
      x: params.x,
      y: params.y,
      user: params.topicName}, menuItems);
  }

  render() {
    const args = (this.props.panel || 'info').split('/');
    const view = args[0];
    args.shift();

    const {formatMessage} = this.props.intl;
    const panelTitle = formatMessage((view == 'perm' ? messages['perm_' + args[0]] : messages[view])
      || messages['info']);

    return (
      <div id="info-view">
        <div className="caption-panel" id="info-caption-panel">
          <div className="panel-title" id="info-title">{panelTitle}</div>
          <div>
            <MenuCancel onCancel={this.handleBackNavigate} />
          </div>
        </div>
        {this.props.displayMobile ?
          <ErrorPanel
            level={this.props.errorLevel}
            text={this.props.errorText}
            onClearError={this.props.onError} /> : null}
        {view == 'members' ?
          <GroupManager
            tinode={this.props.tinode}
            members={this.state.contactList}
            requiredMember={this.props.myUserId}
            keepInitialMembers={!this.state.admin && !this.state.owner}
            myUserId={this.props.myUserId}
            contacts={this.props.searchableContacts}
            onCancel={this.handleBackNavigate}
            onSubmit={this.handleMemberUpdateRequest} />
          :
        view == 'perm' && args.length > 0 ?
          <PermissionsEditor
            tinode={this.props.tinode}
            mode={this.state.editedPermissions}
            compare={this.state.immutablePermissions}
            skip={this.state.editedPermissionsSkipped}
            modeTitle={this.state.editedPermissionsTitle}
            compareTitle={this.state.immutablePermissionsTitle}
            userTitle={this.state.userPermissionsTitle}
            item={this.state.userPermissionsEdited}
            userAvatar={this.state.userPermissionsAvatar}
            onSubmit={(mode) => this.handlePermissionsChanged(args[0], mode)}
            onCancel={this.handleBackNavigate} />
          :
        view == 'general' ?
          <TopicCommon
            tinode={this.props.tinode}
            topic={this.props.topic}
            onCredAdd={this.props.onCredAdd}
            onTopicTagsUpdateRequest={this.props.onTopicTagsUpdateRequest}
            onCredConfirm={this.props.onCredConfirm}
            onCredDelete={this.props.onCredDelete}
            onUpdateTopicDesc={this.props.onTopicDescUpdateRequest}
            onError={this.props.onError} />
          :
        view == 'security' ?
          <TopicSecurity
            topic={this.props.topic}
            owner={this.state.owner}
            admin={this.state.admin}
            sharer={this.state.sharer}
            deleter={this.state.deleter}
            muted={this.state.muted}

            groupTopic={this.state.groupTopic}
            channel={this.state.channel}
            access={this.state.access}
            modeGiven={this.state.modeGiven}
            modeWant={this.state.modeWant}
            modeGiven2={this.state.modeGiven2}
            modeWant2={this.state.modeWant2}
            auth={this.state.auth}
            anon={this.state.anon}

            onShowAlert={this.props.onShowAlert}
            onDeleteMessages={this.props.onDeleteMessages}
            onLeaveTopic={this.props.onLeaveTopic}
            onBlockTopic={this.props.onBlockTopic}
            onReportTopic={this.props.onReportTopic}
            onLaunchPermissionsEditor={this.handleLaunchPermissionsEditor}
            onNavigate={this.props.onNavigate} />
          :
          <div id="info-view-content" className="scrollable-panel">
            <div className="panel-form-column">
              <a href="#" className="flat-button float-right" onClick={(e) => {e.preventDefault(); this.props.onNavigate('general');}}>
                <i className="material-icons">edit</i>&nbsp;
                <FormattedMessage id="button_edit" defaultMessage="Edit" description="Call to action [Edit]" />
              </a>
              <center>
                <AvatarUpload
                  tinode={this.props.tinode}
                  avatar={this.state.avatar}
                  readOnly={true}
                  uid={this.props.topic}
                  title={this.state.fullName} />
              </center>
              <div className="group">
                <div><label className="small">
                  <FormattedMessage id="label_topic_name" defaultMessage="Name"
                    description="Label for editing topic name" />
                </label></div>
                <div className="large ellipsized">{this.state.fullName}
                {this.state.channel ? <img src="/img/channel.png" className="channel" alt="channel" /> : null}</div>
              </div>
              {this.state.private ?
                <div className="group">
                  <div><label className="small">
                    <FormattedMessage id="label_private" defaultMessage="Private comment"
                      description="Label for editing 'private'" />
                  </label></div>
                  <div className="large ellipsized">{this.state.private}</div>
                </div>
                : null
              }
              <div className="group">
                <label className="small"><FormattedMessage id="label_user_id" defaultMessage="ID:"
                  description="Label for user address (ID)" /></label>&nbsp;
                <tt>{this.state.address}</tt>
              </div>
              <div className="group">
                <BadgeList trustedBadges={this.state.trustedBadges} />
              </div>
              {this.state.description ?
                <div className="group">
                  <label className="small">
                    <FormattedMessage id="label_description" defaultMessage="Description"
                      description="Label for editing topic description" />
                  </label>
                  <div>{this.state.description}</div>
                </div> : null}
            </div>
            <div className="hr" />
            <div className="panel-form-row">
              <label>
                <FormattedMessage id="label_muting_topic" defaultMessage="Muted:"
                  description="Label for Muting/unmuting the topic" />
              </label>
              <CheckBox name="P" checked={this.state.muted} onChange={this.handleMuted} />
            </div>
            {this.state.archived ?
              <div className="panel-form-row">
                <label>
                  <FormattedMessage id="label_unarchive_topic" defaultMessage="Archived:"
                    description="Label for unarchiving the topic" />
                </label>
                <CheckBox name="archived" checked={true} onChange={this.handleUnarchive} />
              </div>
              :
              null
            }
            <div className="hr" />
            <div className="panel-form-row">
              <a href="#" className="flat-button" onClick={(e) => {e.preventDefault(); this.props.onNavigate('security');}}>
                <i className="material-icons">security</i>&nbsp;<FormattedMessage id="button_security"
                  defaultMessage="Security" description="Navigaton button for security panel." />
              </a>
            </div>
            {this.state.groupTopic && this.state.sharer ?
              <>
                <div className="hr" />
                <div className="panel-form-row">
                  <label className="small">
                    <FormattedMessage id="label_group_members" defaultMessage="Group members:"
                      description="Section title or label" />
                  </label>
                </div>
                <div className="panel-form-row">
                  <a href="#" className="flat-button" onClick={this.handleShowAddMembers}>
                    <i className="material-icons">person_add</i> &nbsp;<FormattedMessage id="button_add_members"
                      defaultMessage="Add members" description="Flat button [Add members] (to topic)" />
                  </a>
                </div>
                <FormattedMessage id="group_has_no_members" defaultMessage="No members"
                  description="Shown in place of group members">{
                  (no_members) => <ContactList
                    tinode={this.props.tinode}
                    contacts={this.state.contactList}
                    myUserId={this.props.myUserId}
                    emptyListMessage={no_members}
                    topicSelected={this.state.selectedContact}
                    showOnline={false}
                    showUnread={false}
                    showMode={true}
                    noScroll={true}
                    onTopicSelected={this.handleMemberSelected}
                    showContextMenu={this.state.admin ? this.handleContextMenu : false}
                  />
                }</FormattedMessage>
              </>
              :
              null
            }
          </div>
        }
      </div>
    );
  }
};

export default injectIntl(InfoView);

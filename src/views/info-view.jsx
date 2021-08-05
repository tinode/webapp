// InfoView: panel with topic/user info.
import React from 'react';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';

import Tinode from 'tinode-sdk';

import TopicSecurityView from './topic-security-view.jsx';

import AvatarUpload from '../widgets/avatar-upload.jsx';
import BadgeList from '../widgets/badge-list.jsx';
import CheckBox from '../widgets/checkbox.jsx';
import ContactList from '../widgets/contact-list.jsx';
import ErrorPanel from '../widgets/error-panel.jsx';
import GroupManager from '../widgets/group-manager.jsx';
import InPlaceEdit from '../widgets/in-place-edit.jsx';
import MenuCancel from '../widgets/menu-cancel.jsx';
import MoreButton from '../widgets/more-button.jsx';
import PermissionsEditor from '../widgets/permissions-editor.jsx';
import TagManager from '../widgets/tag-manager.jsx';

import { MAX_TITLE_LENGTH, MAX_TOPIC_DESCRIPTION_LENGTH, NO_ACCESS_MODE } from '../config.js';

import { makeImageUrl } from '../lib/blob-helpers.js';
import { arrayEqual, theCard } from '../lib/utils.js';

const messages = defineMessages({
  requested: {
    id: 'requested_permissions',
    defaultMessage: 'Requested',
    description: 'Title for permissions'
  },
  granted: {
    id: 'granted_permissions',
    defaultMessage: 'Granted',
    description: 'Title for permissions'
  },
  edit_permissions: {
    id: 'menu_item_edit_permissions',
    defaultMessage: 'Edit permissions',
    description: 'Menu item [Edit permissions]'
  },
  other_user: {
    id: 'label_other_user',
    defaultMessage: 'Other',
    description: 'Label for the other user when the user is unnamed'
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
      tags: [],
      trustedBadges: [],
      showMemberPanel: false,
      showPermissionEditorFor: undefined,
      previousMetaDesc: undefined,
      previousSubsUpdated: undefined,
      previousTagsUpdated: undefined
    };

    this.resetSubs = this.resetSubs.bind(this);
    this.resetDesc = this.resetDesc.bind(this);
    this.onMetaDesc = this.onMetaDesc.bind(this);
    this.onSubsUpdated = this.onSubsUpdated.bind(this);
    this.onTagsUpdated = this.onTagsUpdated.bind(this);
    this.handleFullNameUpdate = this.handleFullNameUpdate.bind(this);
    this.handlePrivateUpdate = this.handlePrivateUpdate.bind(this);
    this.handleImageChanged = this.handleImageChanged.bind(this);
    this.handleMuted = this.handleMuted.bind(this);
    this.handlePermissionsChanged = this.handlePermissionsChanged.bind(this);
    this.handleLaunchPermissionsEditor = this.handleLaunchPermissionsEditor.bind(this);
    this.handleHidePermissionsEditor = this.handleHidePermissionsEditor.bind(this);
    this.handleShowAddMembers = this.handleShowAddMembers.bind(this);
    this.handleHideAddMembers = this.handleHideAddMembers.bind(this);
    this.handleMemberUpdateRequest = this.handleMemberUpdateRequest.bind(this);
    this.handleMemberSelected = this.handleMemberSelected.bind(this);
    this.handleTagsUpdated = this.handleTagsUpdated.bind(this);
    this.handleContextMenu = this.handleContextMenu.bind(this);
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

      if (topic.getType() == 'grp') {
        this.previousTagsUpdated = topic.onTagsUpdated;
        topic.onTagsUpdated = this.onTagsUpdated;
      } else {
        this.previousTagsUpdated = undefined;
      }
    }

    if (this.state.topic != props.topic) {
      this.setState({topic: props.topic});
      this.resetDesc(topic, props);
      this.resetSubs(topic, props);
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
    topic.onTagsUpdated = this.previousTagsUpdated;
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
      address: topic.name,
      groupTopic: topic.isGroupType(),
      channel: topic.isChannelType(),
      showMemberPanel: false,
      access: acs ? acs.getMode() : undefined,
      modeGiven: acs ? acs.getGiven() : undefined,
      modeWant: acs ? acs.getWant() : undefined,
      auth: defacs.auth,
      anon: defacs.anon
    });

    if (topic.getType() == 'grp' && acs && acs.isOwner()) {
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

  onTagsUpdated(tags) {
    this.setState({tags: tags});

    if (this.previousTagsUpdated && this.previousTagsUpdated != this.onTagsUpdated) {
      this.previousTagsUpdated();
    }
  }

  handleFullNameUpdate(fn) {
    fn = fn.trim().substring(0, MAX_TITLE_LENGTH);
    if (this.state.fullName !== fn) {
      this.setState({fullName: fn});
      this.props.onTopicDescUpdate(this.props.topic, theCard(fn, null), null);
    }
  }

  handlePrivateUpdate(comment) {
    comment = comment.trim().substring(0, MAX_TITLE_LENGTH);
    if (this.state.private !== comment) {
      this.setState({private: comment});
      this.props.onTopicDescUpdate(this.props.topic, null, comment || Tinode.DEL_CHAR);
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

  handlePermissionsChanged(perm) {
    switch (this.state.showPermissionEditorFor) {
      case 'auth':
        this.props.onTopicDescUpdate(this.props.topic, null, null, {auth: perm});
        break;
      case 'anon':
        this.props.onTopicDescUpdate(this.props.topic, null, null, {anon: perm});
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

    this.setState({showPermissionEditorFor: undefined});
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
        titleEdit = formatMessage(messages.requested);
        titleCompare = formatMessage(messages.granted);
        break;
      case 'given':
        toEdit = this.state.modeGiven2;
        toCompare = this.state.modeWant2;
        toSkip = this.state.groupTopic ? (this.state.owner ? '' : 'O') : 'ASDO';
        titleEdit = formatMessage(messages.granted);
        titleCompare = formatMessage(messages.requested);
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
        titleEdit = formatMessage(messages.granted);
        titleCompare = formatMessage(messages.requested);
        if (user.public) {
          userTitle = user.public.fn;
          userAvatar = user.public.photo;
        }
        break;
      }
      default:
        console.log("Unknown permission editing mode '" + which + "'");
        break;
    }
    this.setState({
      showPermissionEditorFor: which,
      userPermissionsEdited: uid,
      userPermissionsTitle: userTitle,
      userPermissionsAvatar: userAvatar,
      editedPermissions: toEdit,
      immutablePermissions: toCompare,
      editedPermissionsTitle: titleEdit,
      immutablePermissionsTitle: titleCompare,
      editedPermissionsSkipped: toSkip,
    });
  }

  handleHidePermissionsEditor() {
    this.setState({showPermissionEditorFor: undefined});
  }

  handleShowAddMembers(e) {
    e.preventDefault();
    this.props.onInitFind();
    this.setState({showMemberPanel: true});
  }

  handleHideAddMembers() {
    this.setState({showMemberPanel: false});
  }

  handleMemberUpdateRequest(members, added, removed) {
    this.props.onMemberUpdateRequest(this.props.topic, added, removed);
    this.setState({showMemberPanel: false});
  }

  handleMemberSelected(uid) {
    this.setState({selectedContact: uid});
  }

  handleTagsUpdated(tags) {
    if (!arrayEqual(this.state.tags.slice(0), tags.slice(0))) {
      this.props.onTopicTagsUpdate(this.props.topic, tags);
    }
  }

  handleContextMenu(params) {
    const {formatMessage} = this.props.intl;
    const instance = this;
    const topic = this.props.tinode.getTopic(this.props.topic);
    if (!topic) {
      return;
    }
    const user = topic.subscriber(params.topicName);
    if (!user || !user.acs) {
      return;
    }

    const menuItems = [
      {title: formatMessage(messages.edit_permissions), handler: function() {
        instance.handleLaunchPermissionsEditor('user', params.topicName);
      }},
      'member_delete',
      user.acs.isMuted() ? 'member_unmute' : 'member_mute',
      user.acs.isJoiner() ? 'member_block' : 'member_unblock'
    ];
    this.props.showContextMenu({
      topicName: this.props.topic,
      x: params.x,
      y: params.y,
      user: params.topicName}, menuItems);
  }

  render() {
    const {formatMessage} = this.props.intl;

    return (
      <div id="info-view">
        <div className="caption-panel" id="info-caption-panel">
          <div className="panel-title" id="info-title">
            <FormattedMessage id="title_info" defaultMessage="Info" description="Title for InfoView" />
          </div>
          <div>
            <MenuCancel onCancel={this.props.onCancel} />
          </div>
        </div>
        {this.props.displayMobile ?
          <ErrorPanel
            level={this.props.errorLevel}
            text={this.props.errorText}
            onClearError={this.props.onError} /> : null}
        {this.state.showMemberPanel ?
          <GroupManager
            members={this.state.contactList}
            requiredMember={this.props.myUserId}
            keepInitialMembers={!this.state.admin && !this.state.owner}
            myUserId={this.props.myUserId}
            contacts={this.props.searchableContacts}
            onCancel={this.handleHideAddMembers}
            onSubmit={this.handleMemberUpdateRequest} />
          :
        this.state.showPermissionEditorFor ?
          <PermissionsEditor
            mode={this.state.editedPermissions}
            compare={this.state.immutablePermissions}
            skip={this.state.editedPermissionsSkipped}
            modeTitle={this.state.editedPermissionsTitle}
            compareTitle={this.state.immutablePermissionsTitle}
            userTitle={this.state.userPermissionsTitle}
            item={this.state.userPermissionsEdited}
            userAvatar={this.state.userPermissionsAvatar}
            onSubmit={this.handlePermissionsChanged}
            onCancel={this.handleHidePermissionsEditor}
            />
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
                <div className="large ellipsized">{this.state.fullName}</div>
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
            <div className="panel-form-column">
              <div className="panel-form-row">
                <label>
                  <FormattedMessage id="label_muting_topic" defaultMessage="Muted:"
                    description="Label for Muting/unmuting the topic" />
                </label>
                <CheckBox name="P" checked={this.state.muted} onChange={this.handleMuted} />
              </div>
            </div>
            <div className="hr" />
            <div className="panel-form-column">
              <a href="#" className="flat-button" onClick={(e) => {e.preventDefault(); this.props.onNavigate('security');}}>
                <i className="material-icons">security</i>&nbsp;<FormattedMessage id="button_security"
                  defaultMessage="Security" description="Navigaton button for security panel." />
              </a>
              {this.state.moreInfoExpanded ?
                <div className="panel-form-column">
                  {this.state.groupTopic ?
                    <div className="panel-form-row">
                      <label>
                        <FormattedMessage id="label_your_permissions" defaultMessage="Your permissions:"
                          description="Label for current user permissions" />
                      </label>
                      <tt className="clickable"
                        onClick={this.handleLaunchPermissionsEditor.bind(this, 'want')}>
                        {this.state.access}
                      </tt>
                    </div>
                    :
                    <div>
                      <div>
                        <label className="small">
                          <FormattedMessage id="label_permissions" defaultMessage="Permissions:"
                            description="Section title" />
                        </label>
                      </div>
                      <div className="quoted">
                        <div>
                          <FormattedMessage id="label_you" defaultMessage="You:"
                            description="Label for the current user" /> &nbsp;<tt className="clickable"
                          onClick={this.handleLaunchPermissionsEditor.bind(this, 'want')}>
                          {this.state.access}
                        </tt></div>
                        <div>{this.state.fullName ? this.state.fullName : formatMessage(messages.other_user)}:
                          &nbsp;<tt className="clickable" onClick={this.handleLaunchPermissionsEditor.bind(this, 'given')}>
                          {this.state.modeGiven2}
                          </tt>
                        </div>
                      </div>
                    </div>
                  }
                  {this.state.sharer && (this.state.auth || this.state.anon) ?
                  <div>
                    <div>
                      <label className="small">
                        <FormattedMessage id="label_default_access" defaultMessage="Default access mode:"
                          description="Section title" />
                      </label>
                    </div>
                    <div className="quoted">
                      <div>Auth: {this.state.admin ?
                        <tt className="clickable"
                          onClick={this.handleLaunchPermissionsEditor.bind(this, 'auth')}>
                          {this.state.auth}
                        </tt>
                        :
                        <tt>{this.state.auth}</tt>
                      }
                      </div>
                      <div>Anon: {this.state.admin ?
                        <tt className="clickable"
                          onClick={this.handleLaunchPermissionsEditor.bind(this, 'anon')}>
                          {this.state.anon}
                        </tt>
                        :
                        <tt>{this.state.anon}</tt>
                      }
                      </div>
                    </div>
                  </div>
                  :
                  null
                }
                </div>
              :
              null
              }
            </div>
            <div className="hr" />
            {this.state.owner ?
              <>
                <FormattedMessage id="title_tag_manager" defaultMessage="Tags (user discovery)"
                  description="Section title for TagManager">{
                  (tags) => <TagManager
                    title={tags}
                    tags={this.state.tags}
                    activated={false}
                    tinode={this.props.tinode}
                    onSubmit={this.handleTagsUpdated} />
                }</FormattedMessage>
                <div className="hr" />
              </>
              :
              null
            }
            {this.state.groupTopic && this.state.sharer ?
              <>
                <div className="hr" />
                <div className="panel-form-column">
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
                </div>
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

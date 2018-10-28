// InfoView: panel with topic/user info.
import React from 'react';

import AvatarUpload from '../widgets/avatar-upload.jsx';
import CheckBox from '../widgets/checkbox.jsx';
import ContactList from '../widgets/contact-list.jsx';
import GroupManager from '../widgets/group-manager.jsx';
import InPlaceEdit from '../widgets/in-place-edit.jsx';
import MenuCancel from '../widgets/menu-cancel.jsx';
import MoreButton from '../widgets/more-button.jsx';
import PermissionsEditor from '../widgets/permissions-editor.jsx';
import TagManager from '../widgets/tag-manager.jsx';

import { makeImageUrl } from '../lib/blob-helpers.js';

export default class InfoView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      topic: null,
      owner: false,
      admin: false,
      sharer: false,
      muted: false,
      address: null,
      groupTopic: undefined,
      fullName: undefined,
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
      showMemberPanel: false,
      showPermissionEditorFor: undefined,
      moreInfoExpanded: false,
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
    this.handleLeave = this.handleLeave.bind(this);
    this.handleMemberSelected = this.handleMemberSelected.bind(this);
    this.handleMoreInfo = this.handleMoreInfo.bind(this);
    this.handleTagsUpdated = this.handleTagsUpdated.bind(this);
    this.handleContextMenu = this.handleContextMenu.bind(this);
  }

  // No need to separately handle component mount.
  UNSAFE_componentWillReceiveProps(props) {
    var topic = this.props.tinode.getTopic(props.topic);
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
    var topic = this.props.tinode.getTopic(this.props.topic);
    if (!topic) {
      return;
    }
    this.setState({topic: null});
    topic.onMetaDesc = this.previousMetaDesc;
    topic.onSubsUpdated = this.previousSubsUpdated;
    topic.onTagsUpdated = this.previousTagsUpdated;
  }

  resetSubs(topic, props) {
    var newState = {contactList: []};
    if (topic.getType() == 'p2p') {
      // Fetch the other party in the p2p conversation.
      // Topic may not be ready yet, so check if user is found.
      var user2 = topic.subscriber(props.topic);
      if (user2) {
        newState.modeGiven2 = user2.acs.getGiven();
        newState.modeWant2 = user2.acs.getWant();
      }
    } else {
      topic.subscribers(function(sub) {
        newState.contactList.push(sub);
      }, this);
    }

    this.setState(newState);
  }

  resetDesc(topic, props) {
    var defacs = topic.getDefaultAccess() || {};
    var acs = topic.getAccessMode();
    this.setState({
      owner: acs && acs.isOwner(),
      admin: acs && acs.isAdmin(),
      sharer: acs && (acs.isAdmin() || acs.isSharer()),
      muted: acs && acs.isMuted(),

      fullName: topic.public ? topic.public.fn : undefined,
      avatar: makeImageUrl(topic.public ? topic.public.photo : null),
      private: topic.private ? topic.private.comment : null,
      address: topic.name,
      groupTopic: (topic.getType() == 'grp'),
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
    var topic = this.props.tinode.getTopic(this.props.topic);
    if (!topic) {
      return;
    }
    this.resetDesc(topic, this.props);

    if (this.previousMetaDesc && this.previousMetaDesc != this.onMetaDesc) {
      this.previousMetaDesc(desc);
    }
  }

  onSubsUpdated() {
    var topic = this.props.tinode.getTopic(this.props.topic);
    if (!topic) {
      return;
    }
    this.resetSubs(topic, this.props);

    if (this.previousSubsUpdated && this.previousSubsUpdated != this.onSubsUpdated) {
      this.previousSubsUpdated();
    }
  }

  onTagsUpdated(tags) {
    this.setState({tags: tags});

    if (this.previousTagsUpdated && this.previousTagsUpdated != this.onTagsUpdated) {
      this.previousTagsUpdated();
    }
  }

  handleFullNameUpdate(fn) {
    if (this.state.fullName !== fn) {
      this.setState({fullName: fn});
      this.props.onTopicDescUpdate(this.props.topic,
        vcard(fn, this.state.avatar),
        null);
    }
  }

  handlePrivateUpdate(priv) {
    if (this.state.priv !== priv) {
      this.setState({private: priv});
      this.props.onTopicDescUpdate(this.props.topic,
        null,
        priv);
    }
  }

  handleImageChanged(img) {
    this.setState({avatar: img});
    this.props.onTopicDescUpdate(this.props.topic,
      vcard(this.state.fullName, img),
      null);
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
    let toEdit, toCompare, toSkip, titleEdit, titleCompare, userTitle, userAvatar;
    switch (which) {
      case 'mode':
        toEdit = this.state.access;
        break;
      case 'want':
        toEdit = this.state.modeWant;
        toCompare = this.state.modeGiven;
        toSkip = this.state.groupTopic ? 'O' : 'ASDO';
        titleEdit = "Requested";
        titleCompare = "Granted";
        break;
      case 'given':
        toEdit = this.state.modeGiven2;
        toCompare = this.state.modeWant2;
        toSkip = this.state.groupTopic ? (this.state.owner ? '' : 'O') : 'ASDO';
        titleEdit = "Granted";
        titleCompare = "Requested";
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
        let topic = this.props.tinode.getTopic(this.props.topic);
        if (!topic) {
          return;
        }
        var user = topic.subscriber(uid);
        if (!user || !user.acs) {
          return;
        }
        toEdit = user.acs.getGiven();
        toCompare = user.acs.getWant();
        toSkip = this.state.owner ? '' : 'O';
        titleEdit = "Granted";
        titleCompare = "Requested";
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

  handleShowAddMembers() {
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

  handleLeave() {
    this.props.onLeaveTopic(this.props.topic);
  }

  handleMemberSelected(uid) {
    this.setState({selectedContact: uid});
  }

  handleMoreInfo(open) {
    this.setState({moreInfoExpanded: open});
  }

  handleTagsUpdated(tags) {
    if (!arrayEqual(this.state.tags.slice(0), tags.slice(0))) {
      this.props.onTopicTagsUpdate(this.props.topic, tags);
    }
  }

  handleContextMenu(params) {
    var instance = this;
    var topic = this.props.tinode.getTopic(this.props.topic);
    if (!topic) {
      return;
    }
    var user = topic.subscriber(params.topicName);
    if (!user || !user.acs) {
      return;
    }

    var menuItems = [
      {title: "Edit permissions", handler: function() {
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
    return (
      <div id="info-view">
        <div className="caption-panel" id="info-caption-panel">
          <div className="panel-title" id="info-title">Info</div>
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
            <div className="panel-form-row">
              <div className="panel-form-column">
                <div><label className="small">Name</label></div>
                <div><InPlaceEdit
                    placeholder={this.state.groupTopic ? "Group name" : <i>Unknown</i>}
                    readOnly={!this.state.owner}
                    value={this.state.fullName}
                    onFinished={this.handleFullNameUpdate} /></div>
                <div><label className="small">Private comment</label></div>
                <div><InPlaceEdit
                    placeholder="Visible to you only"
                    value={this.state.private}
                    onFinished={this.handlePrivateUpdate} /></div>
              </div>
              <AvatarUpload
                avatar={this.state.avatar}
                readOnly={!this.state.owner}
                uid={this.props.topic}
                title={this.state.fullName}
                onImageChanged={this.handleImageChanged}
                onError={this.props.onError} />
            </div>
            <div className="hr" />
            <div className="panel-form-column">
              <div className="panel-form-row">
                <label>Muted:</label>
                <CheckBox name="P" checked={this.state.muted}
                  onChange={this.handleMuted} />
              </div>
              <MoreButton
                title="More"
                open={this.state.moreInfoExpanded}
                onToggle={this.handleMoreInfo} />
              {this.state.moreInfoExpanded ?
                <div className="panel-form-column">
                <div className="panel-form-row">
                  <label>Address:</label>
                  <tt>{this.state.address}</tt>
                </div>
                {this.state.groupTopic ?
                  <div className="panel-form-row">
                    <label>Your permissions:</label>
                    <tt className="clickable"
                      onClick={this.handleLaunchPermissionsEditor.bind(this, 'want')}>
                      {this.state.access}
                    </tt>
                  </div>
                  :
                  <div>
                    <div><label className="small">Permissions:</label></div>
                    <div className="quoted">
                      <div>Yours: &nbsp;<tt className="clickable"
                        onClick={this.handleLaunchPermissionsEditor.bind(this, 'want')}>
                        {this.state.access}
                      </tt></div>
                      <div>{this.state.fullName ? this.state.fullName : "Other"}&prime;s:
                        &nbsp;<tt className="clickable" onClick={this.handleLaunchPermissionsEditor.bind(this, 'given')}>
                        {this.state.modeGiven2}
                        </tt>
                      </div>
                    </div>
                  </div>
                }
                {this.state.sharer && (this.state.auth || this.state.anon) ?
                  <div>
                    <div><label className="small">Default access mode:</label></div>
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
              <TagManager
                title="Tags"
                tags={this.state.tags}
                activated={false}
                onSubmit={this.handleTagsUpdated} />
              :
              null
            }
            {this.state.owner ? <div className="hr" /> : null }
            {this.state.groupTopic ?
              <div className="panel-form-column">
                <div className="panel-form-row">
                  <label className="small">Group members:</label>
                </div>
                <div className="panel-form-row">
                  {this.state.sharer ?
                    <a href="javascript:;" className="flat-button" onClick={this.handleShowAddMembers}>
                      <i className="material-icons">person_add</i> Add members
                    </a>
                    : null}
                  {!this.state.owner ?
                    <a href="javascript:;" className="red flat-button" onClick={this.handleLeave}>
                      <i className="material-icons">exit_to_app</i> Leave
                    </a>
                    : null}
                </div>
                <ContactList
                  contacts={this.state.contactList}
                  myUserId={this.props.myUserId}
                  emptyListMessage="No members"
                  topicSelected={this.state.selectedContact}
                  showOnline={false}
                  showUnread={false}
                  showMode={true}
                  noScroll={true}
                  onTopicSelected={this.handleMemberSelected}
                  showContextMenu={this.state.admin ? this.handleContextMenu : false}
                />
              </div>
              :
              <div className="panel-form-row">
                <a href="javascript:;" className="red flat-button" onClick={this.handleLeave}>
                  <i className="material-icons">exit_to_app</i> Leave
                </a>
              </div>
            }
          </div>
        }
      </div>
    );
  }
};

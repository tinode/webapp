import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { parsePhoneNumber } from 'libphonenumber-js/mobile';

import SendMessage from './send-message.jsx';
import LetterTile from './letter-tile.jsx';

import { TheCard } from 'tinode-sdk';
import { importVCard } from '../lib/blob-helpers.js';

const messages = defineMessages({
  unknown_name: {
    id: 'unknown_name',
    defaultMessage: 'Unknown',
    description: 'Name to show when the name is missing'
  }
});

export default class TheCardPreview extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      content: props.content.object
    };

    if (!props.content.object) {
      importVCard(props.content.file)
        .then(card => {
          this.setState({ content: card });
        });
    }

    this.handleSendCard = this.handleSendCard.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown(e) {
    e.preventDefault();
    if (e.key === 'Escape') {
      this.props.onClose();
    }
  }

  handleSendCard() {
    this.props.onClose();
    this.props.onSendMessage(this.props.content);
  }

  render() {
    const card = this.state.content;

    const fullName = TheCard.getFn(card);
    const photoUrl = TheCard.getPhotoUrl(card) || null;
    const note = card?.note;
    const org = TheCard.getOrg(card);

    // Get communication methods
    const emails = TheCard.getComm(card, 'email') || [];
    const phones = TheCard.getComm(card, 'tel') || [];
    const tinodeIds = TheCard.getComm(card, 'tinode') || [];
    const urls = TheCard.getComm(card, 'http') || [];

    const contacts = [];

    // Add emails
    emails.forEach((email, idx) => {
      const types = Array.isArray(email.des) ? email.des.join(', ') : '';
      contacts.push(
        <div className="group quoted" key={`email-${idx}`}>
          <tt>{email.value}</tt>
          <span className="small gray"> {types ? `(${types})` : ''}</span>
        </div>
      );
    });

    // Add phones
    phones.forEach((phone, idx) => {
      let val = phone.value;
      try {
        const number = parsePhoneNumber(phone.value);
        val = number ? number.formatInternational() : phone.value;
      } catch (err) {
        // Use original value if parsing fails
      }
      const types = Array.isArray(phone.des) ? phone.des.join(', ') : '';
      contacts.push(
        <div className="group quoted" key={`tel-${idx}`}>
          <tt>{val}</tt>
          <span className="small gray"> {types ? `(${types})` : ''}</span>
        </div>
      );
    });

    // Add Tinode IDs
    tinodeIds.forEach((tid, idx) => {
      const types = Array.isArray(tid.des) ? tid.des.join(', ') : '';
      contacts.push(
        <div className="group quoted" key={`tinode-${idx}`}>
          <tt>{tid.value}</tt>
          <span className="small gray"> {types ? `(${types})` : ''}</span>
        </div>
      );
    });

    // Add URLs
    urls.forEach((url, idx) => {
      const types = Array.isArray(url.des) ? url.des.join(', ') : '';
      contacts.push(
        <div className="group quoted" key={`url-${idx}`}>
          <tt>{url.value}</tt>
          <span className="small gray"> {types ? `(${types})` : ''}</span>
        </div>
      );
    });

    return (
      <div id="image-preview">
        <div id="preview-caption-panel">
          <span><FormattedMessage id="label_contact_card" defaultMessage="Contact Card"
            description="Label for contact card preview" /></span>
          <a href="#" onClick={(e) => {e.preventDefault(); this.props.onClose();}}>
            <i className="m-icon gray">close</i>
          </a>
        </div>
        <div id="image-preview-container">
          <div className="doc-card">
            <div className="panel-form-column">
              <center>
                <div className="avatar-box">
                  <LetterTile
                    authorizeURL={this.props.tinode.authorizeURL}
                    avatar={photoUrl || true}
                    topic="usrXXX123"
                    title={fullName} />
                </div>
              </center>
              <div className="group">
                <div className="large ellipsized">{fullName || <FormattedMessage {...messages.unknown_name} />}</div>
              </div>
              {org ?
                <div className="group">
                  <div>{org}</div>
                </div>
                : null}
              {note ?
                <div className="group">
                  <label className="small">
                    <FormattedMessage id="label_description" defaultMessage="Description"
                      description="Label for description of user or topic" />
                  </label>
                  <div className="quoted">{note}</div>
                </div>
                : null}
              {contacts.length > 0 ?
                <div className="group">
                  <label className="small">
                    <FormattedMessage id="label_contacts" defaultMessage="Contacts"
                      description="Label for contact information" />
                  </label>
                  {contacts}
                </div>
                : null}
            </div>
          </div>
        </div>
        <SendMessage
          noInput={true}
          tinode={this.props.tinode}
          reply={this.props.reply}
          onCancelReply={this.props.onCancelReply}
          onSendMessage={this.handleSendCard}
          onError={this.props.onError} />
      </div>
    );
  }
}

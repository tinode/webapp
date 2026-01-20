import React from 'react';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import { TheCard } from 'tinode-sdk';

import LetterTile from './letter-tile.jsx';

const messages = defineMessages({
  unknown_name: {
    id: 'unknown_name',
    defaultMessage: 'Unknown',
    description: 'Name to show when the name is missing'
  }
});

class TheCardMini extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleDownload = this.handleDownload.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
  }

  handleDownload(e) {
    e.preventDefault();
    try {
      const vcard = TheCard.exportVCard(this.props.content);
      const blob = new Blob([vcard], { type: 'text/vcard' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = (this.props.content.fn || 'contact') + '.vcf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Failed to download vcard", err);
      if (this.props.onError) {
        this.props.onError("Failed to download vcard", 'err');
      }
    }
  }

  handleMessage(e) {
    // This is handled by the parent component via props.onAction which expects a click event.
  }

  render() {
    const card = this.props.content;
    if (!card) {
      return null;
    }

    const uid = TheCard.getFirstTinodeID(card);
    const contacts = TheCard.getEmails(card).concat(TheCard.getPhones(card));
    const org = TheCard.getOrg(card);
    return (
      <div className="contact-card">
        <div className="contact-body">
          <div className="avatar-box">
            <LetterTile
              authorizeURL={this.props.authorizeURL}
              topic={uid || 'usr123XXX'}
              avatar={TheCard.getPhotoUrl(card) || true}
              title={card.fn} />
          </div>
          <div className="name-box">
            <div className="name">{card.fn || <FormattedMessage {...messages.unknown_name} />}</div>
            {org && <div className="org">{org}</div>}
          </div>
        </div>
        <div className="contact-actions">
          {uid ?
            <>
              <a className="flat-button" data-val={uid} onClick={this.props.onChatClick}>
                <FormattedMessage id="chat_now" defaultMessage="Chat"
                  description="Label for message button in contact card" />
              </a>
              <div className="divider"></div>
            </>
            : contacts.length > 0 ?
            <>
              <a className="flat-button" data-val={contacts.join(',')} onClick={this.props.onFindClick}>
                <FormattedMessage id="find_user" defaultMessage="Find"
                  description="Label for search button in contact card" />
              </a>
              <div className="divider"></div>
            </>
            : null
          }
          <a className="flat-button" onClick={this.handleDownload}>
            <FormattedMessage id="save_action" defaultMessage="Save" description="Label for Save button" />
          </a>
        </div>
      </div>
    );
  }
};

export default injectIntl(TheCardMini);

// Send message form.
import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { Drafty } from 'tinode-sdk';

import { KEYPRESS_DELAY } from '../config.js';
import { filePasted } from '../lib/blob-helpers.js';

const messages = defineMessages({
  messaging_disabled: {
    id: 'messaging_disabled_prompt',
    defaultMessage: 'Messaging disabled',
    description: 'Prompt in SendMessage in read-only topic'
  },
  type_new_message: {
    id: 'new_message_prompt',
    defaultMessage: 'New message',
    description: 'Prompt in send message field'
  },
  add_image_caption: {
    id: 'image_caption_prompt',
    defaultMessage: 'Image caption',
    description: 'Prompt in SendMessage for attached image'
  },
  file_attachment_too_large: {
    id: 'file_attachment_too_large',
    defaultMessage: 'The file size {size} exceeds the {limit} limit.',
    description: 'Error message when attachment is too large'
  },
  cannot_initiate_upload: {
    id: 'cannot_initiate_file_upload',
    defaultMessage: 'Cannot initiate file upload.',
    description: 'Generic error messagewhen attachment fails'
  },
});

class SendMessage extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
      // Make initial keypress time as if it happened 5001 milliseconds in the past.
      keypressTimestamp: new Date().getTime() - KEYPRESS_DELAY - 1
    };

    this.handlePasteEvent = this.handlePasteEvent.bind(this);
    this.handleAttachImage = this.handleAttachImage.bind(this);
    this.handleAttachFile = this.handleAttachFile.bind(this);
    this.handleSend = this.handleSend.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleMessageTyping = this.handleMessageTyping.bind(this);
  }

  componentDidMount() {
    if (this.messageEditArea) {
      this.messageEditArea.addEventListener('paste', this.handlePasteEvent, false);
    }
  }

  componentWillUnmount() {
    if (this.messageEditArea) {
      this.messageEditArea.removeEventListener('paste', this.handlePasteEvent, false);
    }
  }

  componentDidUpdate() {
    if (this.messageEditArea) {
      this.messageEditArea.focus();
    }
  }

  handlePasteEvent(e) {
    if (this.props.disabled) {
      return;
    }
    // FIXME: handle large files too.
    if (filePasted(e,
      (bits, mime, width, height, fname) => {
        this.props.onAttachImage(mime, bits, width, height, fname);
      },
      (mime, bits, fname) => {
        this.props.onAttachFile(mime, bits, fname);
      },
      this.props.onError)) {

      // If a file was pasted, don't paste base64 data into input field.
      e.preventDefault();
    }
  }

  handleAttachImage(e) {
    if (e.target.files && e.target.files.length > 0) {
      this.props.onAttachImage(e.target.files[0]);
    }
    // Clear the value so the same file can be uploaded again.
    e.target.value = '';
  }

  handleAttachFile(e) {
    const {formatMessage} = this.props.intl;
    if (e.target.files && e.target.files.length > 0) {
      this.props.onAttachFile(e.target.files[0]);
    }
    // Clear the value so the same file can be uploaded again.
    e.target.value = '';
  }

  handleSend(e) {
    e.preventDefault();
    const message = this.state.message.trim();
    if (message || this.props.acceptBlank || this.props.noInput) {
      this.props.onSendMessage(message);
      this.setState({message: ''});
    }
  }

  /* Send on Enter key */
  handleKeyPress(e) {
    // Remove this if you don't want Enter to trigger send
    if (e.key === 'Enter') {
      // Have Shift-Enter insert a line break instead
      if (!e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();

        this.handleSend(e);
      }
    }
  }

  handleMessageTyping(e) {
    const newState = {message: e.target.value};
    if (this.props.onKeyPress) {
      const now = new Date().getTime();
      if (now - this.state.keypressTimestamp > KEYPRESS_DELAY) {
        this.props.onKeyPress();
        newState.keypressTimestamp = now;
      }
    }
    this.setState(newState);
  }

  render() {
    const {formatMessage} = this.props.intl;
    const prompt = this.props.disabled ?
      formatMessage(messages.messaging_disabled) :
      (this.props.messagePrompt ?
        formatMessage(messages[this.props.messagePrompt]) :
        formatMessage(messages.type_new_message));
    return (
      <div id="send-message-panel">
        {!this.props.disabled ?
          <>
            {this.props.onAttachFile ?
              <>
                <a href="#" onClick={(e) => {e.preventDefault(); this.attachImage.click();}} title="Add image">
                  <i className="material-icons secondary">photo</i>
                </a>
                <a href="#" onClick={(e) => {e.preventDefault(); this.attachFile.click();}} title="Attach file">
                  <i className="material-icons secondary">attach_file</i>
                </a>
              </>
              :
              null}
            {this.props.noInput ?
              <div className="hr thin" /> :
              <textarea id="sendMessage" placeholder={prompt}
                value={this.state.message} onChange={this.handleMessageTyping}
                onKeyPress={this.handleKeyPress}
                ref={(ref) => {this.messageEditArea = ref;}}
                autoFocus />}
            <a href="#" onClick={this.handleSend} title="Send">
              <i className="material-icons">send</i>
            </a>
            <input type="file" ref={(ref) => {this.attachFile = ref;}}
              onChange={this.handleAttachFile} style={{display: 'none'}} />
            <input type="file" ref={(ref) => {this.attachImage = ref;}} accept="image/*"
              onChange={this.handleAttachImage} style={{display: 'none'}} />
          </>
          :
          <div id="writing-disabled">{prompt}</div>
        }
      </div>
    );
  }
};

export default injectIntl(SendMessage);

// Send message form.
import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { Drafty } from 'tinode-sdk';

import { KEYPRESS_DELAY, MAX_EXTERN_ATTACHMENT_SIZE, MAX_IMAGE_DIM, MAX_INBAND_ATTACHMENT_SIZE } from '../config.js';
import { SUPPORTED_IMAGE_FORMATS, filePasted, fileToBase64, imageFileToBase64, imageFileScaledToBase64 } from '../lib/blob-helpers.js';
import { bytesToHumanSize } from '../lib/strformat.js';

const messages = defineMessages({
  'messaging_disabled': {
    id: 'messaging_disabled_prompt',
    defaultMessage: 'Messaging disabled',
    description: 'Prompt in SendMessage in read-only topic'
  },
  'type_new_message': {
    id: 'new_message_prompt',
    defaultMessage: 'New message',
    description: 'Prompt in SendMessage in read-only topic'
  },
  'file_attachment_too_large': {
    id: 'file_attachment_too_large',
    defaultMessage: 'The file size {size} exceeds the {limit} limit.',
    description: 'Error message when attachment is too large'
  },
  'cannot_initiate_upload': {
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
    this.messageEditArea.addEventListener('paste', this.handlePasteEvent, false);
  }

  componentWillUnmount() {
    this.messageEditArea.removeEventListener('paste', this.handlePasteEvent, false);
  }

  componentDidUpdate() {
    this.messageEditArea.focus();
  }

  handlePasteEvent(e) {
    if (this.props.disabled) {
      return;
    }
    // FIXME: handle large files too.
    if (filePasted(e,
      (bits, mime, width, height, fname) => {
        this.props.sendMessage(Drafty.insertImage(null,
          0, mime, bits, width, height, fname));
      },
      (mime, bits, fname) => {
        this.props.sendMessage(Drafty.attachFile(null, mime, bits, fname));
      },
      this.props.onError)) {

      // If a file was pasted, don't paste base64 data into input field.
      e.preventDefault();
    }
  }

  handleAttachImage(e) {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // Check if the uploaded file is indeed an image and if it isn't too large.
      if (file.size > MAX_INBAND_ATTACHMENT_SIZE || SUPPORTED_IMAGE_FORMATS.indexOf(file.type) < 0) {
        // Convert image for size or format.
        imageFileScaledToBase64(file, MAX_IMAGE_DIM, MAX_IMAGE_DIM, false,
          // Success
          (bits, mime, width, height, fname) => {
            this.props.sendMessage(Drafty.insertImage(null,
              0, mime, bits, width, height, fname));
          },
          // Failure
          (err) => {
            this.props.onError(err, 'err');
          });
      } else {
        // Image can be uploaded as is. No conversion is needed.
        imageFileToBase64(file,
          // Success
          (bits, mime, width, height, fname) => {
            this.props.sendMessage(Drafty.insertImage(null,
              0, mime, bits, width, height, fname));
          },
          // Failure
          (err) => {
            this.props.onError(err, 'err');
          }
        );
      }
    }
    // Clear the value so the same file can be uploaded again.
    e.target.value = '';
  }

  handleAttachFile(e) {
    const {formatMessage} = this.props.intl;
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > MAX_EXTERN_ATTACHMENT_SIZE) {
        // Too large.
        this.props.onError(formatMessage(messages.file_attachment_too_large,
            {size: bytesToHumanSize(file.size), limit: bytesToHumanSize(MAX_EXTERN_ATTACHMENT_SIZE)}), 'err');
      } else if (file.size > MAX_INBAND_ATTACHMENT_SIZE) {
        // Too large to send inband - uploading out of band and sending as a link.
        const uploader = this.props.tinode.getLargeFileHelper();
        if (!uploader) {
          this.props.onError(formatMessage(messages.cannot_initiate_upload));
          return;
        }
        // Format data and initiate upload.
        const uploadCompletionPromise = uploader.upload(file);
        const msg = Drafty.attachFile(null, file.type, null, file.name, file.size, uploadCompletionPromise);
        // Pass data and the uploader to the TinodeWeb.
        this.props.sendMessage(msg, uploadCompletionPromise, uploader);
      } else {
        // Small enough to send inband.
        fileToBase64(file,
          (mime, bits, fname) => {
            this.props.sendMessage(Drafty.attachFile(null, mime, bits, fname));
          },
          this.props.onError
        );
      }
    }
    // Clear the value so the same file can be uploaded again.
    e.target.value = '';
  }

  handleSend() {
    const message = this.state.message.trim();
    if (message) {
      this.props.sendMessage(this.state.message.trim());
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

        this.handleSend();
      }
    }
  }

  handleMessageTyping(e) {
    const newState = {message: e.target.value};
    const now = new Date().getTime();
    if (now - this.state.keypressTimestamp > KEYPRESS_DELAY) {
      const topic = this.props.tinode.getTopic(this.props.topic);
      if (topic.isSubscribed()) {
        topic.noteKeyPress();
      }
      newState.keypressTimestamp = now;
    }
    this.setState(newState);
  }

  render() {
    const {formatMessage} = this.props.intl;
    const prompt = this.props.disabled ?
      formatMessage(messages.messaging_disabled) :
      formatMessage(messages.type_new_message);
    return (
      <div id="send-message-panel">
        {this.props.disabled ?
          <i className="material-icons disabled">photo</i> :
          <a href="javascript:;" onClick={(e) => {this.attachImage.click();}} title="Add image">
            <i className="material-icons secondary">photo</i>
          </a>}
        {this.props.disabled ?
          <i className="material-icons disabled">attach_file</i> :
          <a href="javascript:;" onClick={(e) => {this.attachFile.click();}} title="Attach file">
            <i className="material-icons secondary">attach_file</i>
          </a>}
        <textarea id="sendMessage" placeholder={prompt}
          disabled={this.props.disabled} value={this.state.message}
          onChange={this.handleMessageTyping} onKeyPress={this.handleKeyPress}
          ref={(ref) => {this.messageEditArea = ref;}}
          autoFocus />
          {this.props.disabled ?
            <i className="material-icons disabled">send</i> :
            <a href="javascript:;" onClick={this.handleSend} title="Send">
              <i className="material-icons">send</i>
            </a>}
      <input type="file" ref={(ref) => {this.attachFile = ref;}}
        onChange={this.handleAttachFile} style={{display: 'none'}} />
      <input type="file" ref={(ref) => {this.attachImage = ref;}} accept="image/*"
        onChange={this.handleAttachImage} style={{display: 'none'}} />
      </div>
    );
  }
};

export default injectIntl(SendMessage);

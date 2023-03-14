// Send message form.
import React, { Suspense } from 'react';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import { Drafty } from 'tinode-sdk';

// Lazy-loading AudioRecorder because it's quite large due to
// a dependency on webm-duration-fix.
const AudioRecorder = React.lazy(_ => import('./audio-recorder.jsx'));

import { KEYPRESS_DELAY } from '../config.js';
import { filePasted } from '../lib/blob-helpers.js';
import { replyFormatter } from '../lib/formatters.js';

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
  icon_title_record_voice: {
    id: 'icon_title_record_voice',
    defaultMessage: 'Record voice message',
    description: 'Icon tool tip for recording a voice message'
  },
  icon_title_attach_file: {
    id: 'icon_title_attach_file',
    defaultMessage: 'Attach file',
    description: 'Icon tool tip for attaching a file'
  },
  icon_title_add_image: {
    id: 'icon_title_add_image',
    defaultMessage: 'Add image',
    description: 'Icon tool tip for attaching an image'
  },
  icon_title_send: {
    id: 'icon_title_send',
    defaultMessage: 'Send message',
    description: 'Icon tool tip for sending a message'
  },
});

class SendMessage extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      quote: null,
      message: '',
      audioRec: false,
      audioAvailable: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
    };

    // Timestamp when the previous key press was sent to the server.
    this.keypressTimestamp = 0;

    this.handlePasteEvent = this.handlePasteEvent.bind(this);
    this.handleAttachImage = this.handleAttachImage.bind(this);
    this.handleAttachFile = this.handleAttachFile.bind(this);
    this.handleAttachAudio = this.handleAttachAudio.bind(this);
    this.handleSend = this.handleSend.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleMessageTyping = this.handleMessageTyping.bind(this);
    this.handleDropAttach = this.handleDropAttach.bind(this);

    this.handleQuoteClick = this.handleQuoteClick.bind(this);

    this.formatReply = this.formatReply.bind(this);
  }

  componentDidMount() {
    if (this.messageEditArea) {
      this.messageEditArea.addEventListener('paste', this.handlePasteEvent, false);
      if (window.getComputedStyle(this.messageEditArea).getPropertyValue('transition-property') == 'all') {
        // Set focus on desktop, but not on mobile: focus causes soft keyboard to pop up.
        this.messageEditArea.focus();
      }
    }

    this.setState({quote: this.formatReply()});
  }

  componentWillUnmount() {
    if (this.messageEditArea) {
      this.messageEditArea.removeEventListener('paste', this.handlePasteEvent, false);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.messageEditArea) {
      if (window.getComputedStyle(this.messageEditArea).getPropertyValue('transition-property') == 'all') {
        // Set focus on desktop, but not on mobile: focus causes soft keyboard to pop up.
        this.messageEditArea.focus();
      }

      // Adjust height of the message area for the amount of text.
      this.messageEditArea.style.height = '0px';
      this.messageEditArea.style.height = this.messageEditArea.scrollHeight + 'px';
    }

    if (prevProps.topicName != this.props.topicName) {
      this.setState({message: this.props.initMessage || '', audioRec: false, quote: null});
    } else if (prevProps.initMessage != this.props.initMessage) {
      const msg = this.props.initMessage || '';
      this.setState({message: msg}, _ => {
        // If there is text, scroll to bottom and set caret to the end.
        this.messageEditArea.scrollTop = this.messageEditArea.scrollHeight;
        this.messageEditArea.setSelectionRange(msg.length, msg.length);
      });
    }
    if (prevProps.reply != this.props.reply) {
      this.setState({quote: this.formatReply()});
    }
  }

  formatReply() {
    return this.props.reply ?
      Drafty.format(this.props.reply.content, replyFormatter, {
        formatMessage: this.props.intl.formatMessage.bind(this.props.intl),
        authorizeURL: this.props.tinode.authorizeURL.bind(this.props.tinode)
      }) : null;
  }

  handlePasteEvent(e) {
    if (this.props.disabled) {
      return;
    }
    // FIXME: handle large files too.
    if (filePasted(e,
      file => { this.props.onAttachImage(file); },
      file => { this.props.onAttachFile(file); },
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
    if (e.target.files && e.target.files.length > 0) {
      this.props.onAttachFile(e.target.files[0]);
    }
    // Clear the value so the same file can be uploaded again.
    e.target.value = '';
  }

  handleDropAttach(files) {
    if (files && files.length > 0) {
      this.props.onAttachFile(files[0]);
    }
  }

  handleAttachAudio(url, preview, duration) {
    this.setState({audioRec: false});
    this.props.onAttachAudio(url, preview, duration);
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
    if (this.state.audioRec) {
      // Ignore key presses while audio is being recorded.
      e.preventDefault();
      e.stopPropagation();
      return;
    }

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
    this.setState({message: e.target.value});
    if (this.props.onKeyPress) {
      const now = new Date().getTime();
      if (now - this.keypressTimestamp > KEYPRESS_DELAY) {
        this.props.onKeyPress();
        this.keypressTimestamp = now;
      }
    }
  }

  handleQuoteClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (this.props.reply && this.props.onQuoteClick) {
      const replyToSeq = this.props.reply.seq;
      this.props.onQuoteClick(replyToSeq);
    }
  }

  render() {
    const { formatMessage } = this.props.intl;
    const prompt = this.props.disabled ?
      formatMessage(messages.messaging_disabled) :
      (this.props.messagePrompt ?
        formatMessage(messages[this.props.messagePrompt]) :
        formatMessage(messages.type_new_message));

    const sendIcon = (this.props.reply && this.props.reply.editing) ?
      'check_circle' : 'send';

    const quote = this.state.quote ?
      (<div id="reply-quote-preview">
        <div className="cancel">
          <a href="#" onClick={e => {e.preventDefault(); this.props.onCancelReply();}}><i className="material-icons gray">close</i></a>
        </div>
        {this.state.quote}
      </div>) : null;
    const audioEnabled = this.state.audioAvailable && this.props.onAttachAudio;
    return (
      <div id="send-message-wrapper">
        {!this.props.noInput ? quote : null}
        <div id="send-message-panel">
          {!this.props.disabled ?
            <>
              {this.props.onAttachFile && !this.state.audioRec ?
                <>
                  <a href="#" onClick={e => {e.preventDefault(); this.attachImage.click();}} title={formatMessage(messages.icon_title_add_image)}>
                    <i className="material-icons secondary">photo</i>
                  </a>
                  <a href="#" onClick={e => {e.preventDefault(); this.attachFile.click();}} title={formatMessage(messages.icon_title_attach_file)}>
                    <i className="material-icons secondary">attach_file</i>
                  </a>
                </>
                :
                null}
              {this.props.noInput ?
                (quote || <div className="hr thin" />) :
                (this.state.audioRec ?
                  (<Suspense fallback={<div><FormattedMessage id="loading_note" defaultMessage="Loading..."
                  description="Message shown when component is loading"/></div>}>
                    <AudioRecorder
                      onRecordingProgress={_ => this.props.onKeyPress(true)}
                      onDeleted={_ => this.setState({audioRec: false})}
                      onFinished={this.handleAttachAudio}/>
                  </Suspense>) :
                  <textarea id="send-message-input" placeholder={prompt}
                    value={this.state.message} onChange={this.handleMessageTyping}
                    onKeyDown={this.handleKeyPress}
                    ref={ref => {this.messageEditArea = ref;}} />)}
              {this.state.message || !audioEnabled ?
                <a href="#" onClick={this.handleSend} title={formatMessage(messages.icon_title_send)}>
                  <i className="material-icons">{sendIcon}</i>
                </a> :
                !this.state.audioRec ?
                  <a href="#" onClick={e => {e.preventDefault(); this.setState({audioRec: true})}} title={formatMessage(messages.icon_title_record_voice)}>
                    <i className="material-icons">mic</i>
                  </a> :
                  null
              }
              <input type="file" ref={ref => {this.attachFile = ref}}
                onChange={this.handleAttachFile} style={{display: 'none'}} />
              <input type="file" ref={ref => {this.attachImage = ref}} accept="image/*, video/*"
                onChange={this.handleAttachImage} style={{display: 'none'}} />
            </>
            :
            <div id="writing-disabled">{prompt}</div>
          }
        </div>
      </div>
    );
  }
};

export default injectIntl(SendMessage);

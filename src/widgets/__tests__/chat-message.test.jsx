/* @jest-environment jsdom */
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { IntlProvider } from 'react-intl';
import ChatMessage from '../chat-message.jsx';
import ReactionPicker from '../reaction-picker.jsx';

describe('ChatMessage reactions UI', () => {
  const defaultProps = {
    tinode: { authorizeURL: () => {}, getServerParam: () => ['👍','😂','❤️','e0','e1','e2','e3'] },
    topic: {},
    content: null,
    mimeType: null,
    replyToSeq: null,
    edited: false,
    timestamp: Date.now(),
    response: false,
    seq: 123,
    isGroup: false,
    isChan: false,
    userFrom: 'u1',
    userName: 'User One',
    userAvatar: null,
    sequence: 'last',
    received: null,
    uploader: null,
    userIsWriter: true,
    userIsAdmin: false,
    pinned: false,
    viewportWidth: 800,
    showContextMenu: false,
    showPicker: false,
    onExpandMedia: () => {},
    onFormResponse: () => {},
    onCancelUpload: () => {},
    pickReply: () => {},
    editMessage: () => {},
    onQuoteClick: () => {},
    onAcceptCall: () => {},
    onError: () => {},
    onReact: jest.fn(),
    onToggleReactionPicker: jest.fn(),
    myUserId: 'me',
    parentRef: { getBoundingClientRect: () => ({ left: 0, top: 0, right: 800, bottom: 600, width: 800, height: 600 }) }
  };

  test('renders reactions and triggers onReact when clicked', () => {
    const reactions = [{ val: '👍', count: 2, users: ['me','u2'] }];
    render(
      <IntlProvider locale="en">
        <ChatMessage {...defaultProps} reactions={reactions} />
      </IntlProvider>
    );

    // Emoji and count are visible
    const btn = screen.getByTestId('reaction-👍');
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveTextContent('👍');
    expect(btn).toHaveTextContent('2');

    // Clicking reaction should call onReact(seq, emo)
    fireEvent.click(btn);
    expect(defaultProps.onReact).toHaveBeenCalledWith(123, '👍');
  });

  test('opens picker via toggle button', () => {
    // Reset mocks
    defaultProps.onReact.mockClear();
    defaultProps.onToggleReactionPicker.mockClear();

    render(
      <IntlProvider locale="en">
        <ChatMessage {...defaultProps} reactions={[]} />
      </IntlProvider>
    );

    const addBtn = screen.getByTestId('reaction-add');
    // Click the add button
    fireEvent.click(addBtn);

    // Should call onToggleReactionPicker with message seq
    expect(defaultProps.onToggleReactionPicker).toHaveBeenCalledWith(123);
  });

  test('expand picker shows all emojis', () => {
    defaultProps.onReact.mockClear();

    // Prepare >6 emojis
    const emojis = Array.from({length: 10}, (_, i) => `e${i}`);

    // Render picker standalone to test expansion UI
    const { container } = render(
      <IntlProvider locale="en">
        <div id="test-host">
          <ReactionPicker
            reactionList={emojis}
            onSelect={(emo) => defaultProps.onReact(123, emo)}
            onClose={() => {}}
            dataTestPrefix="reaction-picker-test"
            anchor={{viewX:150,viewY:150,offsetX:150,offsetY:0}}
            viewportBounds={{width:300,height:200}} />
        </div>
      </IntlProvider>
    );

    const expandBtn = within(container).getByTestId('reaction-expand');
    expect(expandBtn).toBeInTheDocument();

    // Click expand
    fireEvent.click(expandBtn);

    // After expansion, expand button should not be present
    expect(within(container).queryByTestId('reaction-expand')).not.toBeInTheDocument();

    // Click on one of the emojis (last one)
    const lastEmoji = within(container).getByTestId('reaction-picker-test-e9');
    fireEvent.click(lastEmoji);
    expect(defaultProps.onReact).toHaveBeenCalledWith(123, 'e9');

    // Picker remains visible after selection (since expanded)
    expect(within(container).getByTestId('reaction-picker-test-e0')).toBeInTheDocument();
  });
});

/* @jest-environment jsdom */
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { IntlProvider } from 'react-intl';
import ChatMessage from '../chat-message.jsx';
import ReactionPicker from '../reaction-picker.jsx';

describe('ChatMessage reactions UI', () => {
  const defaultProps = {
    tinode: { authorizeURL: () => {} },
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
    onExpandMedia: () => {},
    onFormResponse: () => {},
    onCancelUpload: () => {},
    pickReply: () => {},
    editMessage: () => {},
    onQuoteClick: () => {},
    onAcceptCall: () => {},
    onError: () => {},
    onReact: jest.fn(),
    myUserId: 'me'
  };

  test('renders reactions and triggers onReact when clicked', () => {
    const reactions = [{ value: '👍', count: 2, users: ['me','u2'] }];
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

  test('opens picker and selects emoji', () => {
    // Reset mock
    defaultProps.onReact.mockClear();

    // Ensure an app container exists for picker positioning logic (used when no bounds provided).
    const app = document.createElement('div');
    app.id = 'app-container';
    // Provide bounding rect used by the picker positioning logic.
    app.getBoundingClientRect = () => ({ left: 0, top: 0, right: 800, bottom: 600, width: 800, height: 600 });
    document.body.appendChild(app);

    // Provide parentRef so ChatMessage won't throw when querying bounds.
    const parentRef = { getBoundingClientRect: () => ({ left: 0, top: 0, right: 800, bottom: 600, width: 800, height: 600 }) };

    render(
      <IntlProvider locale="en">
        <ChatMessage {...defaultProps} reactions={[]} parentRef={parentRef} />
      </IntlProvider>
    );

    const addBtn = screen.getByTestId('reaction-add');
    // Click the add button
    fireEvent.click(addBtn);

    // Picker should be visible and contain emojis
    const pickerBtn = screen.getByTestId('reaction-picker-👍');
    expect(pickerBtn).toBeInTheDocument();

    fireEvent.click(pickerBtn);
    expect(defaultProps.onReact).toHaveBeenCalledWith(123, '👍');

    // Cleanup
    document.body.removeChild(app);
  });

  test('expand picker shows all emojis and remains open after selection', () => {
    defaultProps.onReact.mockClear();

    const app = document.createElement('div');
    app.id = 'app-container';
    app.getBoundingClientRect = () => ({ left: 0, top: 0, right: 300, bottom: 200, width: 300, height: 200 });
    document.body.appendChild(app);

    const parentRef = { getBoundingClientRect: () => ({ left: 0, top: 0, right: 300, bottom: 200, width: 300, height: 200 }) };

    // Prepare >6 emojis
    const emojis = Array.from({length: 10}, (_, i) => `e${i}`);

    render(
      <IntlProvider locale="en">
        <ChatMessage {...defaultProps} reactions={[]} parentRef={parentRef} />
      </IntlProvider>
    );

    // Open picker
    const addBtn = screen.getByTestId('reaction-add');
    fireEvent.click(addBtn);

    // Expand button should be present (since we pass emojis via ReactionPicker props indirectly in real app, simulate by rendering ReactionPicker directly)
    const { container } = render(
      <IntlProvider locale="en">
        {/* Render picker standalone to test expansion UI */}
        <div id="test-host">
          <ReactionPicker emojis={emojis} onSelect={(emo) => defaultProps.onReact(123, emo)} onClose={() => {}} dataTestPrefix="reaction-picker-test" clickAt={{x:150,y:150}} bounds={{left:0,top:0,right:300,bottom:200,width:300,height:200}} />
        </div>
      </IntlProvider>
    );

    const expandBtn = within(container).getByTestId('reaction-expand');
    expect(expandBtn).toBeInTheDocument();

    // Click expand
    fireEvent.click(expandBtn);

    // After expansion, expand button should not be present in this picker
    expect(within(container).queryByTestId('reaction-expand')).not.toBeInTheDocument();

    // Click on one of the emojis (last one)
    const lastEmoji = within(container).getByTestId('reaction-picker-test-e9');
    fireEvent.click(lastEmoji);
    expect(defaultProps.onReact).toHaveBeenCalledWith(123, 'e9');

    // Picker remains visible after selection (since expanded)
    expect(within(container).getByTestId('reaction-picker-test-e0')).toBeInTheDocument();

    document.body.removeChild(app);
  });
});

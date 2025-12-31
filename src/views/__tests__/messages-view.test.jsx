/* @jest-environment jsdom */

let _origAudio;
beforeAll(() => {
  _origAudio = global.Audio;
  global.Audio = class { constructor() { this.loop = false; } };
});

afterAll(() => {
  global.Audio = _origAudio;
});

import { UnwrappedMessagesView } from '../messages-view.jsx';
import { Tinode } from 'tinode-sdk';
const DEL_CHAR = Tinode.DEL_CHAR;

describe('MessagesView.handleReact', () => {
  test('sends DEL_CHAR when user already reacted with that emoji', () => {
    const fakeTopic = {
      msgReactions: (seq) => [{value: '❤️', count: 3, users: ['me', 'u2']}],
      react: jest.fn()
    };

    const fakeThis = {
      state: { topic: 't1' },
      props: { myUserId: 'me', tinode: { getTopic: () => fakeTopic } }
    };

    // Call the handler as defined on the prototype
    UnwrappedMessagesView.prototype.handleReact.apply(fakeThis, [1, '❤️']);

    expect(fakeTopic.react).toHaveBeenCalledWith(1, DEL_CHAR);
  });

  test('handleReact is no-op when topic missing or unavailable', () => {
    // No topic in state
    let fakeThis = { state: {}, props: { myUserId: 'me' } };
    expect(() => UnwrappedMessagesView.prototype.handleReact.apply(fakeThis, [1, '👍'])).not.toThrow();

    // Topic name present but tinode.getTopic returns null
    fakeThis = { state: {topic: 't2'}, props: { myUserId: 'me', tinode: { getTopic: () => null } } };
    expect(() => UnwrappedMessagesView.prototype.handleReact.apply(fakeThis, [1, '👍'])).not.toThrow();
  });

  test('adds reaction when user has not reacted yet', () => {
    const fakeTopic = {
      msgReactions: (seq) => [{value: '😂', count: 1, users: ['u2']}],
      react: jest.fn()
    };

    const fakeThis = {
      state: { topic: 't3' },
      props: { myUserId: 'me', tinode: { getTopic: () => fakeTopic } }
    };

    UnwrappedMessagesView.prototype.handleReact.apply(fakeThis, [2, '😂']);

    expect(fakeTopic.react).toHaveBeenCalledWith(2, '😂');
  });
});

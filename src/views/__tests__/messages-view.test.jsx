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
  test('delegates reaction call to topic.react with the selected emoji', () => {
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

    // MessagesView no longer decides delete semantics: it delegates to Topic.react.
    expect(fakeTopic.react).toHaveBeenCalledWith(1, '❤️');
  });

  test('handleReact throws when tinode or topic is unavailable, succeeds when topic exists', () => {
    // tinode missing -> throws when trying to call getTopic
    let fakeThis = { state: {}, props: { myUserId: 'me' } };
    expect(() => UnwrappedMessagesView.prototype.handleReact.apply(fakeThis, [1, '👍'])).toThrow();

    // tinode.getTopic returns null -> topic is unavailable -> calling topic.react will throw
    fakeThis = { state: {topic: 't2'}, props: { myUserId: 'me', tinode: { getTopic: () => null } } };
    expect(() => UnwrappedMessagesView.prototype.handleReact.apply(fakeThis, [1, '👍'])).toThrow();

    // Valid topic object -> no throw
    const fakeTopic = { react: jest.fn() };
    fakeThis = { state: {topic: 't2'}, props: { myUserId: 'me', tinode: { getTopic: () => fakeTopic } } };
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

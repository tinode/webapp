import { clearStoredAuthToken, getStoredAuthToken, setStoredAuthToken } from './auth-token-storage';

function createStorage() {
  const data = new Map();
  return {
    getItem(key) {
      return data.has(key) ? data.get(key) : null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
    removeItem(key) {
      data.delete(key);
    }
  };
}

beforeEach(() => {
  global.localStorage = createStorage();
  global.sessionStorage = createStorage();
});

test('setStoredAuthToken persists token in localStorage', () => {
  const token = {token: 'abc', expires: '2026-07-05T00:00:00.000Z'};

  setStoredAuthToken(token);

  expect(getStoredAuthToken()).toEqual(token);
  expect(JSON.parse(localStorage.getItem('auth-token'))).toEqual(token);
  expect(sessionStorage.getItem('auth-token')).toBeNull();
});

test('getStoredAuthToken falls back to sessionStorage', () => {
  const token = {token: 'abc', expires: '2026-07-05T00:00:00.000Z'};
  sessionStorage.setItem('auth-token', JSON.stringify(token));

  expect(getStoredAuthToken()).toEqual(token);
});

test('clearStoredAuthToken removes token from both storages', () => {
  const token = JSON.stringify({token: 'abc'});
  localStorage.setItem('auth-token', token);
  sessionStorage.setItem('auth-token', token);

  clearStoredAuthToken();

  expect(localStorage.getItem('auth-token')).toBeNull();
  expect(sessionStorage.getItem('auth-token')).toBeNull();
});

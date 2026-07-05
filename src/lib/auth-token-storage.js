import LocalStorageUtil from './local-storage.js';

const AUTH_TOKEN_STORAGE_KEY = 'auth-token';

export function getStoredAuthToken() {
  return LocalStorageUtil.getObject(AUTH_TOKEN_STORAGE_KEY) ||
    LocalStorageUtil.getObject(AUTH_TOKEN_STORAGE_KEY, false);
}

export function setStoredAuthToken(token) {
  LocalStorageUtil.setObject(AUTH_TOKEN_STORAGE_KEY, token);
  LocalStorageUtil.removeItem(AUTH_TOKEN_STORAGE_KEY, false);
}

export function clearStoredAuthToken() {
  LocalStorageUtil.removeItem(AUTH_TOKEN_STORAGE_KEY, false);
  LocalStorageUtil.removeItem(AUTH_TOKEN_STORAGE_KEY);
}

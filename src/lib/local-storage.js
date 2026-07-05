// Helper functions for storing values in localStorage.
// By default localStorage can store only strings, not objects or other types.

export default class LocalStorageUtil {
  static storage(persistent = true) {
    return persistent ? localStorage : sessionStorage;
  }

  // Replace old object with the new one.
  static setObject(key, value, persistent = true) {
    this.storage(persistent).setItem(key, JSON.stringify(value));
  }

  // Get stored object.
  static getObject(key, persistent = true) {
    const value = this.storage(persistent).getItem(key);
    return value && JSON.parse(value);
  }

  // Partially or wholly update stored object.
  static updateObject(key, value, persistent = true) {
    const oldVal = this.getObject(key, persistent);
    this.setObject(key, Object.assign(oldVal || {}, value), persistent);
  }

  // Just a wrapper.
  static removeItem(key, persistent = true) {
    this.storage(persistent).removeItem(key);
  }
}

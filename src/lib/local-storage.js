// Helper functions for storing values in localStorage.
// By default localStorage can store only strings, not objects or other types.

export default class LocalStorageUtil {
  // Replace old object with the new one.
  static setObject(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Get stored object.
  static getObject(key) {
    const value = localStorage.getItem(key);
    return value && JSON.parse(value);
  }

  // Partially or wholly update stored object.
  static updateObject(key, value) {
    const oldVal = this.getObject(key);
    this.setObject(key, Object.assign(oldVal || {}, value));
  }

  // Just a wrapper.
  static removeItem(key) {
    localStorage.removeItem(key);
  }
}

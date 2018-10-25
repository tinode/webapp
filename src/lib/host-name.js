import { KNOWN_HOSTS, DEFAULT_HOST } from '../config.js';

// Detect server address from the URL
export function detectServerAddress() {
  let host = DEFAULT_HOST;
  if (typeof window.location == 'object') {
    if (window.location.protocol == 'file:' || window.location.hostname == 'localhost') {
      host = KNOWN_HOSTS.local;
    } else if (window.location.hostname) {
      host = window.location.hostname + (window.location.port ? ':' + window.location.port : '');
    }
  }
  return host;
}

// Detect if the page is served over HTTPS.
export function isSecureConnection() {
  if (typeof window.location == 'object') {
    return window.location.protocol == 'https:';
  }
  return false;
}

export function isLocalHost() {
  if (typeof window.location == 'object') {
    return window.location.hostname == 'localhost';
  }
  return false;
}

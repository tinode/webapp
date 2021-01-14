// Short representation of time in the past.
export function shortDateFormat(then, locale) {
  locale = locale || window.navigator.userLanguage || window.navigator.language;
  const now = new Date();
  if (then.getFullYear() == now.getFullYear()) {
    // Same year.
    if (then.getMonth() == now.getMonth() && then.getDate() == now.getDate()) {
      // Same month and day, show time only.
      return then.toLocaleTimeString(locale, {hour12: false, hour: '2-digit', minute: '2-digit'});
    }
    // Different month and/or day, show month day, time.
    return then.toLocaleDateString(locale,
      {hour12: false, month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'});
  }
  // Different year: just show the date.
  return then.toLocaleDateString(locale, {year: 'numeric', month: 'short', day: 'numeric'});
}

// Convert seconds to minutes:seconds, i.e. 156 sec -> 2:36.
export function secondsToTime(seconds) {
  const min = Math.floor(seconds / 60);
  let sec = seconds % 60;
  sec = sec < 10 ? `0${sec}` : sec;
  return `${min}:${sec}`;
}

// Convert a number of bytes to human-readable format.
export function bytesToHumanSize(bytes) {
  if (!bytes || bytes == 0) {
    return '0 Bytes';
  }

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const bucket = Math.min(Math.floor(Math.log2(bytes) / 10) | 0, sizes.length-1);
  const count = bytes / Math.pow(1024, bucket);
  const round = bucket > 0 ? (count < 3 ? 2 : (count < 30 ? 1 : 0)) : 0;
  return count.toFixed(round) + ' ' + sizes[bucket];
}

// Get 32 bit integer hash value for a string. Ideally it should produce the same value
// as Java's String#hash().
export function stringHash(value) {
  let hash = 0;
  value = '' + value;
  for (let i = 0; i < value.length; i++) {
    hash = ((hash << 5) - hash) + value.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

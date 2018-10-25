// Short representation of time in the past.
function shortDateFormat(then) {
  var locale = window.navigator.userLanguage || window.navigator.language;
  var now = new Date();
  if (then.getFullYear() == now.getFullYear()) {
    if (then.getMonth() == now.getMonth() && then.getDate() == now.getDate()) {
	    return then.toLocaleTimeString(locale, {hour12: false, hour: '2-digit', minute: '2-digit'});
    } else {
	    return then.toLocaleDateString(locale,
        {hour12: false, month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'});
    }
  }
  return then.toLocaleDateString(locale,
    {hour12: false, year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'});
}

// Convert a number of bytes to human-readable format.
function bytesToHumanSize(bytes) {
  if (!bytes || bytes == 0) {
    return '0 Bytes';
  }

  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  var bucket = Math.min(Math.floor(Math.log2(bytes) / 10) | 0, sizes.length-1);
  var count = bytes / Math.pow(1024, bucket);
  var round = bucket > 0 ? (count < 3 ? 2 : (count < 30 ? 1 : 0)) : 0;
  return count.toFixed(round) + ' ' + sizes[bucket];
}

// Get 32 bit integer hash value for a string. Ideally it should produce the same value
// as Java's String#hash().
function stringHash(value) {
  var hash = 0;
  value = '' + value;
  for (var i = 0; i < value.length; i++) {
    hash = ((hash << 5) - hash) + value.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

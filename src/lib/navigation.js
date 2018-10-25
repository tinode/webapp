// Helper functions for hash navigation.

// Parse hash as in http://www.example.com/path#hash as if it were
// path and arguments.
export function parseUrlHash(hash) {
  // Split path from args, path -> parts[0], args->path[1]
  let parts = hash.split('?', 2);
  let params = {};
  let path = [];
  if (parts[0]) {
    path = parts[0].substr(1).split('/');
  }
  if (parts[1]) {
    parts[1].split('&').forEach(function(part) {
      let item = part.split('=');
      if (item[0]) {
        params[decodeURIComponent(item[0])] = decodeURIComponent(item[1]);
      }
    });
  }
  return {path: path, params: params};
}

export function navigateTo(url) {
  window.location.hash = url;
}

export function composeUrlHash(path, params) {
  var url = path.join('/');
  var args = [];
  for (var key in params) {
    if (params.hasOwnProperty(key)) {
      args.push(key + '=' + params[key]);
    }
  }
  if (args.length > 0) {
    url += '?' + args.join('&');
  }
  return url;
}

export function addUrlParam(hash, key, value) {
  var parsed = parseUrlHash(hash);
  parsed.params[key] = value;
  return composeUrlHash(parsed.path, parsed.params);
}

export function removeUrlParam(hash, key) {
  var parsed = parseUrlHash(hash);
  delete parsed.params[key];
  return composeUrlHash(parsed.path, parsed.params);
}

export function setUrlSidePanel(hash, sidepanel) {
  var parsed = parseUrlHash(hash);
  parsed.path[0] = sidepanel;
  return composeUrlHash(parsed.path, parsed.params);
}

export function setUrlTopic(hash, topic) {
  var parsed = parseUrlHash(hash);
  parsed.path[1] = topic;
  // Close InfoView on topic change.
  delete parsed.params.info;
  return composeUrlHash(parsed.path, parsed.params);
}
// END of hash navigation helper functions

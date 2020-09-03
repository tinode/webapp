// Utility class for hash navigation.

// Parse hash as in http://www.example.com/path#hash as if it were
// path and arguments.
export default class HashNavigation {
  static parseUrlHash(hash) {
    // Split path from args, path -> parts[0], args->path[1]
    const parts = hash.split('?', 2);
    const params = {};
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

  static navigateTo(url) {
    window.location.hash = url;
  }

  static composeUrlHash(path, params) {
    let url = path.join('/');
    const args = [];
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        args.push(key + '=' + params[key]);
      }
    }
    if (args.length > 0) {
      url += '?' + args.join('&');
    }
    return url;
  }

  static addUrlParam(hash, key, value) {
    const parsed = this.parseUrlHash(hash);
    parsed.params[key] = value;
    return this.composeUrlHash(parsed.path, parsed.params);
  }

  static removeUrlParam(hash, key) {
    const parsed = this.parseUrlHash(hash);
    delete parsed.params[key];
    return this.composeUrlHash(parsed.path, parsed.params);
  }

  static setUrlSidePanel(hash, sidepanel) {
    const parsed = this.parseUrlHash(hash);
    parsed.path[0] = sidepanel;
    return this.composeUrlHash(parsed.path, parsed.params);
  }

  static setUrlTopic(hash, topic) {
    const parsed = this.parseUrlHash(hash);
    parsed.path[1] = topic;
    // Close InfoView on topic change.
    delete parsed.params.info;
    return this.composeUrlHash(parsed.path, parsed.params);
  }
}

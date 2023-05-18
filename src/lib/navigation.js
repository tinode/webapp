// Utility class for hash navigation.

export default class HashNavigation {
  // Parse hash as in http://www.example.com/path#hash as if it were
  // path and arguments.
  static parseUrlHash(hash) {
    // Split 'path/?args' into 'path/' and 'args', path -> parts[0], args->path[1].
    const parts = hash.split('?', 2);
    const params = {};
    let path = [];
    if (parts[0]) {
      path = parts[0].replace('#', '').split('/');
    }
    if (parts[1]) {
      parts[1].split('&').forEach((arg) => {
        // Can't use split() because the value may contain '='.
        const eq = arg.indexOf('=');
        if (eq > 0) {
          params[arg.slice(0, eq)] = decodeURIComponent(arg.slice(eq + 1));
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
        if (params[key] !== undefined) {
          args.push(key + '=' + encodeURIComponent(params[key]));
        }
      }
    }
    if (args.length > 0) {
      url += '?' + args.join('&');
    }
    return url;
  }

  static addUrlParam(hash, key, value) {
    const parsed = HashNavigation.parseUrlHash(hash);
    parsed.params[key] = value;
    return HashNavigation.composeUrlHash(parsed.path, parsed.params);
  }

  static removeUrlParam(hash, key) {
    const parsed = HashNavigation.parseUrlHash(hash);
    delete parsed.params[key];
    return HashNavigation.composeUrlHash(parsed.path, parsed.params);
  }

  static setUrlSidePanel(hash, sidepanel) {
    const parsed = HashNavigation.parseUrlHash(hash);
    parsed.path[0] = sidepanel;
    return HashNavigation.composeUrlHash(parsed.path, parsed.params);
  }

  static setUrlInfoPanel(hash, infopanel) {
    const parsed = HashNavigation.parseUrlHash(hash);
    if (infopanel) {
      parsed.params.info = infopanel;
    } else {
      delete parsed.params.info;
    }
    return HashNavigation.composeUrlHash(parsed.path, parsed.params);
  }

  static setUrlTopic(hash, topic) {
    const parsed = HashNavigation.parseUrlHash(hash);
    parsed.path[1] = topic;
    // Close InfoView on topic change.
    delete parsed.params.info;
    return HashNavigation.composeUrlHash(parsed.path, parsed.params);
  }
}

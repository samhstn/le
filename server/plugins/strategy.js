exports.register = (server, options, next) => {
  function validate (request, username, key, cb) {
    const redisCli = server.app.redisCli;

    redisCli.keys('*', (_, keys) => {
      if (keys.indexOf(username === -1)) {
        return cb('timeout=true');
      }

      redisCli.get(username, (_, redisKey) => {
        if (redisKey !== key) {
          return cb('timeout=true');
        }

        cb(null, true, { username, key });
      });
    })
  }

  server.auth.strategy('le-strategy', 'le-scheme', { validateFunc: validate });

  server.state('cookie', {
    // 4 hours for the session cookie to expire
    ttl: 4 * 60 * 60 * 1000,
    isSecure: process.env.NODE_ENV !== 'test',
    isHttpOnly: true,
    encoding: 'base64json',
    clearInvalid: true
  });

  next();
}

exports.register.attributes = {
  pkg: {
    name: 'strategy'
  }
}

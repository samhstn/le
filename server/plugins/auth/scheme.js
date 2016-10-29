const assert = require('assert');
const internals = {};

exports.register = (server, options, next) => {
  server.auth.scheme('le-scheme', internals.validate);

  next();
}

exports.register.attributes = {
  pkg: {
    name: 'scheme'
  }
};

internals.validate = (server, options) => {
  const scheme = {
    authenticate: (request, reply) => {
      if (!options) {
        return reply('Server error: No server options specified').code(500);
      }

      if (!(request.headers.cookie || request.headers['set-cookie'])) {
        return reply
          .redirect('/login/timeout=true')
          .unstate('cookie');
      }

      const cookie = request.headers.cookie || request.headers['set-cookie'][0];

      const cookieVal = cookie.split('cookie=')[1];

      if (!cookieVal) {
        return reply('The cookie value has been tampered with ' + cookieVal)
          .unstate('cookie')
          .code(500);
      }

      const buffer = Buffer.from(cookieVal, 'base64')

      if (!Buffer.isBuffer(buffer)) {
        return reply('The cookie value has been tampered with ' + buffer)
          .unstate('cookie')
          .code(500);
      }

      try {
        const userObj = JSON.parse(buffer.toString())

        const username = userObj.username;
        const key = userObj.key;

        options.validateFunc(request, username, key, (err, isValid, credentials) => {
          if (err) {
            if (!isValid) {
              return reply
                .redirect('/login/timeout=true')
                .unstate('cookie');
            }

            return reply('Server error has occurred')
              .unstate('cookie')
              .code(500);
          }

          reply.continue({ credentials });
        });
      } catch (caughtErr) {
        reply('The cookie value has been tampered with' + caughtErr)
          .unstate('cookie')
          .code(500);
      }
    }
  };

  return scheme;
};

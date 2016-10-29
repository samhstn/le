const usernameFromCookie = require('../../helpers/usernameFromCookie.js');
const validate = require('../../validation/logout.js');

exports.register = (server, options, next) => {
  server.route({
    method: 'post',
    path: '/logout',
    config: { validate, auth: false },
    handler: (request, reply) => {
      const username = usernameFromCookie(request.headers.cookie);
      const redisCli = server.app.redisCli;

      redisCli.del(username, () => {
        reply
          .redirect('/login')
          .unstate('cookie');
      })
    }
  });

  next();
}

exports.register.attributes = { pkg: { name: 'logout' } }

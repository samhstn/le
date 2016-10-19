const registerUser = require('../../../db/pg/registerUser.js');
const validate = require('../../validation/register.js');

exports.register = (server, options, next) => {
  server.route({
    method: 'post',
    path: '/api/register',
    config: { validate, auth: false },
    handler: (request, reply) => {
      const payload = request.payload;
      registerUser(server.app.pool, payload.username, payload.password, (err, res) => {
        if (err) {
          return reply(err).code(500);
        }

        if (res === 'username not available') {
          return reply.redirect('/register/unavailable_username=true&user=' + username);
        }

        reply.redirect('/register/registered=true');
      });
    }
  });

  next();
}

exports.register.attributes = { pkg: { name: 'register' } }

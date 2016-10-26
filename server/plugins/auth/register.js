const registerUser = require('../../../db/pg/registerUser.js');
const validate = require('../../validation/register.js');

exports.register = (server, options, next) => {
  server.route({
    method: 'post',
    path: '/api/register',
    config: { validate, auth: false },
    handler: (request, reply) => {
      registerUser(server.app.pool, request.payload)
        .then(() => reply({ redirect: '/register/registered=true' }))
        .catch((err) => {
          if (err === 'username not available') {
            return reply({
              redirect: '/register/unavailable_username=true&user=' + request.payload.username
            });
          }

          return reply(err).code(500);
        });
    }
  });

  next();
}

exports.register.attributes = { pkg: { name: 'register' } }

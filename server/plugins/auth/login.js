const checkUserRegistered = require('../../../db/pg/checkUserRegistered.js');
const verifyPassword = require('../../../db/pg/verifyPassword.js');
const storeKeyInRedis = require('../../../db/redis/storeKeyInRedis.js');
const validate = require('../../validation/login.js');

exports.register = (server, options, next) => {
  server.route({
    method: 'post',
    path: '/login',
    config: { validate, auth: false },
    handler: (request, reply) => {
      const username = request.payload.username;

      checkUserRegistered(server.app.pool, request.payload)
        .then(() => verifyPassword(server.app.pool, request.payload))
        .then(() => storeKeyInRedis(server.app.redisCli, request.payload))
        .then((key) => {
          reply.redirect('/')
            .state('cookie', { username, key });
        })
        .catch((err) => {
          switch (err) {
          case 'db error':
            return reply(err).code(500);
          case 'user not registered':
            return reply
              .redirect('/login/user_not_registered=true&user=' + username);
          case 'incorrect password':
            return reply
              .redirect('/login/incorrect_pass=true&user=' + username);
          default:
            return reply('Unknown error').code(500);
          }
        });
    }
  });

  next();
}

exports.register.attributes = { pkg: { name: 'login' } };

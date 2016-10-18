const assert = require('assert');
const Joi = require('joi');

exports.register = (server, options, next) => {
  server.route({
    method: 'put',
    path: '/api/register',
    config: {
      validate: {
        payload: {
          username: Joi.string().required(),
          password: Joi.string().required()
        }
      }
    },
    handler: (request, reply) => {
      const username = getUsernameFromCookie(request.headers.cookie);

      const pool = server.app.pool;

      reply('WIP');
    }
  });

  next();
}

exports.register.attributes = {
  pkg: {
    name: 'settings'
  }
}

const assert = require('assert');
const Joi = require('joi');
const usernameFromCookie = require('../../helpers/usernameFromCookie.js');

exports.register = (server, options, next) => {
  const pool = server.app.pool;

  server.route({
    method: 'put',
    path: '/api/result/{collection_id}',
    config: {
      validate: {
        headers: Joi.object({
          cookie: Joi.string().required()
        })
      },
      payload: {
        collection_id: Joi.string().required(),
        words: Joi.object().required()
      }
    },
    handler: (request, reply) => {
      const username = usernameFromCookie(request.headers.cookie);

      reply('WIP');
    }
  });
  
  next();
}

exports.register.attributes = {
  pkg: {
    name: 'result'
  }
};

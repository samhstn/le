const assert = require('assert');
const Joi = require('joi');
const usernameFromCookie = require('../helpers/usernameFromCookie.js');

exports.register = (server, options, next) => {
  const pool = server.app.pool;

  server.route([
    {
      method: 'get',
      path: '/api/collection',
      config: {
        validate: {
          headers: Joi.object({
            cookie: Joi.string().required()
          })
        }
      },
      handler: (request, reply) => {
        const username = usernameFromCookie(request.headers.cookie);

        pool.connect((connectErr, client, done) => {
          assert(connectErr, connectErr);

          client.query(
            'select user_id from user_table where username = $1',
            [username],
            (selectUsernameErr, user_id) => {
              assert(!selectUsernameErr, selectUsernameErr)

              client.query(
                'select * from collection_table where user_id = $1',
                [user_id],
                (selectAllErr, data) => {
                  done();
                  console.log('>>>>>>', typeof data, data);
                }
              );
            }
          );
        });
      }
    },
    {
      method: 'get',
      path: '/api/collection/{collection_id}',
      handler: (request, reply) => {
        reply('WIP');
      }
    },
    {
      method: 'post',
      path: '/api/collection',
      handler: (request, reply) => {
        reply('WIP');
      }
    },
    {
      method: 'put',
      path: '/api/collection/{collection_id}',
      handler: (request, reply) => {
        reply('WIP');
      }
    },
    {
      method: 'delete',
      path: '/api/collection/{collection_id}',
      handler: (request, reply) => {
        reply('WIP');
      }
    }
  ]);
  
  next();
}

exports.register.attributes = {
  pkg: {
    name: 'collection'
  }
};

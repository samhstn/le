const assert = require('assert');
const Joi = require('joi');
const usernameFromCookie = require('../helpers/usernameFromCookie.js');

exports.register = (server, options, next) => {
  const pool = server.app.pool;

  server.route([
    {
      method: 'get',
      path: '/api/collection',
      handler: (request, reply) => {
        const cookie = request.headers.cookie || request.headers['set-cookie'][0];
        const username = usernameFromCookie(cookie);

        reply('WIP');

        // pool.connect((connectErr, client, done) => {
        //   assert(connectErr, connectErr);

        //   client.query(
        //     'select user_id from user_table where username = $1',
        //     [username],
        //     (selectUsernameErr, user_id) => {
        //       assert(!selectUsernameErr, selectUsernameErr)

        //       client.query(
        //         'select * from collection_table where user_id = $1',
        //         [user_id],
        //         (selectAllErr, data) => {
        //           done();
        //           console.log('>>>>>>', typeof data, data);
        //         }
        //       );
        //     }
        //   );
        // });
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
        const cookie = request.headers.cookie || request.headers['set-cookie'][0];
        const username = usernameFromCookie(cookie);

        const collection_name = request.payload.collection_name;
        const collection_description = request.payload.collection_description;

        pool.connect((connectErr, client, done) => {
          assert(!connectErr, connectErr);

          client.query(
            'select * from user_table where username = $1',
            [ username ],
            (selectAllErr, data) => {
              done();
              assert(!selectAllErr, selectAllErr);
              
              const user_id = data.rows[0].user_id;
              client.query(
                'insert into collection_table '
                + '(user_id, collection_name, collection_description) '
                + 'values ($1, $2, $3)',
                [ user_id, collection_name, collection_description ],
                (collInsertErr) => {
                  assert(!collInsertErr, collInsertErr);

                  reply({
                    message: 'New collection created',
                    info: { created: true }
                  });
                }
              );
            }
          );
        });
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

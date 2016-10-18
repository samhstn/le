const assert = require('assert');
const Joi = require('joi');
const usernameFromCookie = require('../../helpers/usernameFromCookie.js');

exports.register = (server, options, next) => {
  const pool = server.app.pool;

  server.route([
    {
      method: 'get',
      path: '/api/collection',
      handler: (request, reply) => {
        const cookie = request.headers.cookie || request.headers['set-cookie'][0];
        const username = usernameFromCookie(cookie);

        pool.connect((connectErr, client, done) => {
          assert(!connectErr, connectErr);

          client.query(
            'select '
            + 'user_table.user_id, '
            + 'collection_table.collection_id, '
            + 'collection_table.collection_name, '
            + 'collection_table.collection_description '
            + 'from user_table inner join collection_table '
            + 'on user_table.user_id = collection_table.user_id '
            + 'where user_table.username = $1',
            [ username ],
            (selectErr, data) => {
              done();
              assert(!selectErr, selectErr); 

              function format (rows) {
                const obj = {};
                rows.forEach((row) => {
                  obj[row.collection_id] = {
                    collection_name: row.collection_name,
                    collection_description: row.collection_description
                  };
                });
                return obj;
              }

              reply({ collections: format(data.rows) });
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
        const collection_id = request.params.collection_id;

        pool.connect((connectErr, client, done) => {
          assert(!connectErr, connectErr);

          client.query(
            'select * from collection_table where collection_id = $1',
            [ collection_id ],
            (selectAllErr, selectAllData) => {
              done();
              assert(!selectAllErr, selectAllErr);

              if (!selectAllData.rows.length) {
                return reply({ message: 'Collection does not exist' }).code(400);
              }

              reply({
                message: 'Collection has been updated',
                info: { updated: true }
              });
            }
          );
        });
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

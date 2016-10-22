const assert = require('assert');
const usernameFromCookie = require('../../helpers/usernameFromCookie.js');
const getCollections = require('../../../db/pg/getCollections.js');
const deleteCollection = require('../../../db/pg/deleteCollection.js');

exports.register = (server, options, next) => {
  const pool = server.app.pool;

  server.route([
    {
      // TODO: get average score and number of words
      method: 'get',
      path: '/api/collection',
      handler: (request, reply) => {
        const cookie = request.headers.cookie || request.headers['set-cookie'][0];
        const username = usernameFromCookie(cookie);

        getCollections(pool)(username)
          .then((collections) => reply({ collections }));
      }
    },
    {
      // TODO: start
      method: 'get',
      path: '/api/collection/{collection_id}',
      handler: (request, reply) => {
        reply('WIP');
      }
    },
    {
      // TODO: refactor
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
      // TODO: refactor
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
        const collection_id = request.params.collection_id;

        deleteCollection(pool)(collection_id)
          .then(() => {
            reply({
              message: 'Collection has been deleted',
              info: { deleted: true }
            });
          })
          .catch((err) => {
            reply(err).code(400);
          });
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

const assert = require('assert');
const usernameFromCookie = require('../../helpers/usernameFromCookie.js');
const getCollections = require('../../../db/pg/getCollections.js');
const getCollectionsWithWordData = require('../../../db/pg/getCollectionsWithWordData.js');
const getCollectionWithWords = require('../../../db/pg/getCollectionWithWords.js');
const createCollection = require('../../../db/pg/createCollection.js');
const updateCollection = require('../../../db/pg/updateCollection.js');
const deleteCollection = require('../../../db/pg/deleteCollection.js');

exports.register = (server, options, next) => {
  const pool = server.app.pool;

  server.route([
    {
      method: 'get',
      path: '/api/collection',
      handler: (request, reply) => {
        const cookie = request.headers.cookie || request.headers['set-cookie'][0];
        const username = usernameFromCookie(cookie);

        getCollectionsWithWordData(pool)(username)
          .then((collections) => reply({ collections }));
      }
    },
    {
      method: 'get',
      path: '/api/collection/{collection_id}',
      handler: (request, reply) => {
        const id = request.params.collection_id;

        getCollectionWithWords(pool)(id)
          .then((collections) => reply({ collections }));
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

        const collectionObj = {
          username,
          collection_name,
          collection_description
        };

        createCollection(pool)(collectionObj)
          .then(() => {
            reply({
              message: 'New collection created',
              info: { created: true }
            });
          })
          .catch((err) => {
            reply(err).code(400);
          });
      }
    },
    {
      method: 'put',
      path: '/api/collection/{collection_id}',
      handler: (request, reply) => {
        const collection_id = request.params.collection_id;

        const collectionObj = Object.assign(
          { collection_id },
          request.payload
        );

        updateCollection(pool)(collectionObj)
          .then(() => {
            reply({
              message: 'Collection has been updated',
              info: { updated: true }
            });
          })
          .catch((err) => {
            reply(err).code(400);
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

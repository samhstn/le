const tape = require('tape');
const assert = require('assert');

const server = require('../../../server/server.js');
const redisCli = server.app.redisCli;
const pool = server.app.pool;

const flushDb = require('../../helpers/flushDb.js')(pool, redisCli);
const authenticate = require('../../helpers/authenticate.js')(pool, redisCli);
const getCollections = require('../../../db/pg/getCollections.js')(pool);
const createCollection = require('../../../db/pg/createCollection.js')(pool);
const getWords = require('../../../db/pg/getWords.js')(pool);

tape('GET :: /api/collection', (t) => {
  const options = {
    method: 'get',
    url: '/api/collection'
  };

  const userObj = { username: 'sam', password: 'pass' };

  const collectionObj = {
    username: 'sam',
    collection_name: 'another name',
    collection_description: 'another description'
  };

  let headers;

  flushDb()
    .then(() => server.inject(options))
    .then((res) => {
      t.equal(res.statusCode, 302);
      t.equal(res.headers.location, '/login/timeout=true');

      return authenticate(userObj);
    })
    .then((_headers) => {
      headers = _headers;

      return server.inject(Object.assign(options, { headers }))
    })
    .then((res) => {
      t.equal(res.statusCode, 200);
      t.deepEqual(JSON.parse(res.payload).collections, {});

      return createCollection(collectionObj);
    })
    .then(() => server.inject(Object.assign(options, { headers })))
    .then((res) => {
      const collections = JSON.parse(res.payload).collections;
      const collectionId = Object.keys(collections)[0];

      t.equal(res.statusCode, 200);
      t.equal(Object.keys(collections).length, 1);
      t.equal(collections[collectionId].collection_name, 'another name');
      t.equal(collections[collectionId].collection_description, 'another description');

      t.end();
    })
    .catch((err) => assert(!err, err));
});

tape('POST :: /api/collection', (t) => {
  const options = {
    method: 'post',
    url: '/api/collection',
    payload: {
      collection_name: 'collection1',
      collection_description: 'my first collection'
    }
  };

  const userObj = { username: 'sam', password: 'pass' };

  flushDb()
    .then(() => authenticate(userObj))
    .then((headers) => server.inject(Object.assign(options, { headers })))
    .then((res) => {
      t.equal(res.statusCode, 200);
      t.equal(JSON.parse(res.payload).message, 'New collection created');
      t.ok(JSON.parse(res.payload).info.created);
      return getCollections(userObj.username);
    })
    .then((res) => {
      t.equal(Object.keys(res).length, 1);
      t.equal(Object.keys(res)[0], '100');
      t.equal(res['100'].collection_name, 'collection1');
      t.equal(res['100'].collection_description, 'my first collection');

      t.end();
    })
    .catch((err) => assert(!err, err));
});

tape('PUT :: /api/collection/{collection_id}', (t) => {
  let headers;

  flushDb()
    .then(() => {
      const options = {
        method: 'put',
        url: '/api/collection/100'
      };

      return server.inject(options)
    })
    .then((res) => {
      t.equal(res.statusCode, 302);
      t.equal(res.headers.location, '/login/timeout=true');

      return authenticate({
        username: 'sam',
        password: 'pass'
      });
    })
    .then((_headers) => {
      headers = _headers;

      const collectionObj = {
        username: 'sam',
        collection_name: 'another name',
        collection_description: 'another description'
      };

      return createCollection(collectionObj);
    })
    .then(() => getCollections('sam'))
    .then((res) => {
      t.equal(Object.keys(res).length, 1);
      t.equal(Object.keys(res)[0], '100');
      t.equal(res['100'].collection_name, 'another name');
      t.equal(res['100'].collection_description, 'another description');

      const options = {
        method: 'put',
        url: '/api/collection/100',
        payload: {
          collection_name: 'new name',
          collection_description: 'description 2.0'
        }
      };

      return server.inject(Object.assign(options, { headers }));
    })
    .then((res) => {
      t.equal(res.statusCode, 200);
      t.equal(JSON.parse(res.payload).message, 'Collection has been updated');
      t.ok(JSON.parse(res.payload).info.updated);
      return getCollections('sam');
    })
    .then((res) => {
      t.equal(Object.keys(res).length, 1);
      t.equal(Object.keys(res)[0], '100');
      t.equal(res['100'].collection_description, 'description 2.0');
      t.equal(res['100'].collection_name, 'new name');

      const options = {
        method: 'put',
        url: '/api/collection/100',
        payload: {
          collection_description: 'even newer description',
          new_words: [
            {
              direction: 'enToDe',
              source_word: 'hello',
              target_words: ['Hallo']
            },
            {
              direction: 'deToEn',
              source_word: 'Wiedersehen',
              target_words: ['Bye']
            }
          ]
        }
      };

      return server.inject(Object.assign(options, { headers }));
    })
    .then((res) => {
      t.equal(res.statusCode, 200);
      t.equal(JSON.parse(res.payload).message, 'Collection has been updated');
      t.ok(JSON.parse(res.payload).info.updated);
      return getCollections('sam');
    })
    .then((res) => {
      t.equal(Object.keys(res).length, 1);
      t.equal(Object.keys(res)[0], '100');
      t.equal(res['100'].collection_description, 'even newer description');
      t.equal(res['100'].collection_name, 'new name');
      return getWords('100');
    })
    .then((res) => {
      t.equal(res.length, 2);
      t.equal(res[0].word_id, '100');
      t.equal(res[0].collection_id, '100');
      t.equal(res[0].direction, 'enToDe');
      t.equal(res[0].source_word, 'hello');
      t.deepEqual(res[0].target_words, [ 'Hallo' ]);

      t.equal(res[1].word_id, '101');
      t.equal(res[1].collection_id, '100');
      t.equal(res[1].direction, 'deToEn');
      t.equal(res[1].source_word, 'Wiedersehen');
      t.deepEqual(res[1].target_words, [ 'Bye' ]);

      t.end();
    })
    .catch((err) => assert(!err, err));
});

tape.onFinish(() => {
  redisCli.quit();
  pool.end();
});

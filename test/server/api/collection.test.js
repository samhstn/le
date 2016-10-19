const tape = require('tape');
const assert = require('assert');

const server = require('../../../server/server.js');
const redisCli = server.app.redisCli;
const pool = server.app.pool;

const flushDb = require('../../helpers/flushDb.js')(pool, redisCli);
const authenticate = require('../../helpers/authenticate.js')(pool, redisCli);
const getCollections = require('../../helpers/getCollections.js')(pool);
const createCollection = require('../../helpers/createCollection.js')(pool);

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
      t.equal(res.statusCode, 200);
      t.equal(Object.keys(JSON.parse(res.payload).collections).length, 1);
      const collectionId = Object.keys(JSON.parse(res.payload).collections)[0];
      const collection = JSON.parse(res.payload).collections[collectionId];
      t.equal(collection.collection_name, 'another name');
      t.equal(collection.collection_description, 'another description');
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
  const userObj = { username: 'sam', password: 'pass' };

  const collectionObj = {
    username: 'sam',
    collection_name: 'another name',
    collection_description: 'another description'
  };

  let headers, collection_id;

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
      return authenticate(userObj);
    })
    .then((_headers) => {
      headers = _headers;

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
      t.equal(res.statusCode, 400);
      t.equal(JSON.parse(res.payload).message, 'Collection does not exist');

      return createCollection(collectionObj);
    })
    .then(() => getCollections('sam'))
    .then((res) => {
      t.equal(Object.keys(res).length, 1);
      t.equal(Object.keys(res)[0], '100');
      t.equal(res['100'].collection_name, 'another name');
      t.equal(res['100'].collection_description, 'another description');

      collection_id = Object.keys(res)[0];

      const options = {
        method: 'put',
        url: '/api/collection/' + collection_id,
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
      t.equal(res['100'].collection_description, 'another description');
      t.equal(res['100'].collection_name, 'another name');

      const options = {
        method: 'put',
        url: '/api/collection/' + collection_id,
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
      t.equal(res['100'].collection_description, 'another description');
      t.equal(res['100'].collection_name, 'another name');
      t.end();
    })
    .catch((err) => assert(!err, err));
});

tape.onFinish(() => {
  redisCli.quit();
  pool.end();
});

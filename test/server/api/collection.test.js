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
const updateCollection = require('../../../db/pg/updateCollection.js')(pool);

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
      t.equal(res.statusCode, 302, 'ogDv9CFa4T');
      t.equal(res.headers.location, '/login/timeout=true', 'ogDv9CFa4T');

      return authenticate(userObj);
    })
    .then((_headers) => {
      headers = _headers;

      return server.inject(Object.assign(options, { headers }))
    })
    .then((res) => {
      t.equal(res.statusCode, 200, 'ogDv9CFa4T');
      t.deepEqual(JSON.parse(res.payload).collections, {}, 'I0lYn6Hlo0');

      return createCollection(collectionObj);
    })
    .then(() => server.inject(Object.assign(options, { headers })))
    .then((res) => {
      const collections = JSON.parse(res.payload).collections;
      const collectionId = Object.keys(collections)[0];

      t.equal(res.statusCode, 200, 'ogDv9CFa4T');
      t.equal(Object.keys(collections).length, 1, 'ogDv9CFa4T');
      t.equal(collections[collectionId].collection_name, 'another name', 'ogDv9CFa4T');
      t.equal(collections[collectionId].collection_description, 'another description', 'ogDv9CFa4T');

      t.end();
    })
    .catch((err) => assert(!err, err));
});

tape('GET :: /api/collection/{collection_id}', (t) => {
  const userObj = { username: 'sam', password: 'pass' };

  const collectionObj = {
    username: 'sam',
    collection_name: 'another name',
    collection_description: 'another description'
  };

  let headers;

  flushDb()
    .then(() => {
      const options = {
        method: 'get',
        url: '/api/collection/100'
      };

      return server.inject(options);
    })
    .then((res) => {
      t.equal(res.statusCode, 302, 'ogDv9CFa4T');
      t.equal(res.headers.location, '/login/timeout=true', 'ogDv9CFa4T');

      return authenticate(userObj);
    })
    .then((_headers) => {
      headers = _headers;

      return createCollection(collectionObj);
    })
    .then(() => {
      const options = {
        method: 'get',
        url: '/api/collection/100'
      };

      return server.inject(Object.assign(options, { headers }));
    })
    .then((res) => {
      t.equal(res.statusCode, 200, 'ogDv9CFa4T');
      const collection = JSON.parse(res.payload).collection;
  
      t.equal(collection.collection_id, '100', 'ogDv9CFa4T');
      t.equal(collection.collection_name, 'another name', 'ogDv9CFa4T');
      t.equal(collection.collection_description, 'another description', 'ogDv9CFa4T');
      t.equal(collection.words.length, 0, 'ogDv9CFa4T');

      const collectionObj = {
        collection_id: '100',
        new_words: [
          {
            direction: 'deToEn',
            source_word: 'Wiedersehen',
            target_words: [ 'Bye' ]
          },
          {
            direction: 'enToDe',
            source_word: 'hello',
            target_words: [ 'hallo', 'Guten Tag' ]
          }
        ]
      };

      return updateCollection(collectionObj);
    })
    .then(() => {
      const options = {
        method: 'get',
        url: '/api/collection/100'
      };

      return server.inject(Object.assign(options, { headers }));
    })
    .then((res) => {
      t.equal(res.statusCode, 200, 'ogDv9CFa4T');
      const collection = JSON.parse(res.payload).collection;
  
      t.equal(collection.collection_id, '100', 'ogDv9CFa4T');
      t.equal(collection.collection_name, 'another name', 'ogDv9CFa4T');
      t.equal(collection.collection_description, 'another description', 'ogDv9CFa4T');

      t.equal(collection.words.length, 2, 'ogDv9CFa4T');
      t.equal(collection.words.filter((o) => o.word_id === '100')[0].word_id, '100', 'ogDv9CFa4T');
      t.equal(collection.words.filter((o) => o.direction === 'deToEn')[0].direction, 'deToEn', 'ogDv9CFa4T');
      t.equal(collection.words.filter((o) => o.direction === 'deToEn')[0].source_word, 'Wiedersehen', 'ogDv9CFa4T');
      t.deepEqual(collection.words.filter((o) => o.direction === 'deToEn')[0].target_words, [ 'Bye' ], 'I0lYn6Hlo0');
      t.equal(collection.words.filter((o) => o.direction === 'deToEn')[0].hint, null, 'ogDv9CFa4T');
      t.equal(collection.words.filter((o) => o.direction === 'deToEn')[0].attempts, '0', 'ogDv9CFa4T');
      t.equal(collection.words.filter((o) => o.direction === 'deToEn')[0].correct_attempts, '0', 'ogDv9CFa4T');
      t.equal(collection.words.filter((o) => o.direction === 'deToEn')[0].score, 5, 'ogDv9CFa4T');

      t.equal(collection.words.filter((o) => o.word_id === '101')[0].word_id, '101', 'ogDv9CFa4T');
      t.equal(collection.words.filter((o) => o.direction === 'enToDe')[0].direction, 'enToDe', 'ogDv9CFa4T');
      t.equal(collection.words.filter((o) => o.direction === 'enToDe')[0].source_word, 'hello', 'ogDv9CFa4T');
      t.deepEqual(collection.words.filter((o) => o.direction === 'enToDe')[0].target_words, [ 'hallo', 'Guten Tag' ], 'I0lYn6Hlo0');
      t.equal(collection.words.filter((o) => o.direction === 'enToDe')[0].hint, null, 'ogDv9CFa4T');
      t.equal(collection.words.filter((o) => o.direction === 'enToDe')[0].attempts, '0', 'ogDv9CFa4T');
      t.equal(collection.words.filter((o) => o.direction === 'enToDe')[0].correct_attempts, '0', 'ogDv9CFa4T');
      t.equal(collection.words.filter((o) => o.direction === 'enToDe')[0].score, 5, 'ogDv9CFa4T');

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
      t.equal(res.statusCode, 200, 'ogDv9CFa4T');
      t.equal(JSON.parse(res.payload).message, 'New collection created', 'ogDv9CFa4T');
      t.ok(JSON.parse(res.payload).info.created, '4OVGjSnVwC');
      return getCollections(userObj.username);
    })
    .then((res) => {
      t.equal(Object.keys(res).length, 1, 'ogDv9CFa4T');
      t.equal(Object.keys(res)[0], '100', 'ogDv9CFa4T');
      t.equal(res['100'].collection_name, 'collection1', 'ogDv9CFa4T');
      t.equal(res['100'].collection_description, 'my first collection', 'ogDv9CFa4T');

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
      t.equal(res.statusCode, 302, 'ogDv9CFa4T');
      t.equal(res.headers.location, '/login/timeout=true', 'ogDv9CFa4T');

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
      t.equal(Object.keys(res).length, 1, 'ogDv9CFa4T');
      t.equal(Object.keys(res)[0], '100', 'ogDv9CFa4T');
      t.equal(res['100'].collection_name, 'another name', 'ogDv9CFa4T');
      t.equal(res['100'].collection_description, 'another description', 'ogDv9CFa4T');

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
      t.equal(res.statusCode, 200, 'ogDv9CFa4T');
      t.equal(JSON.parse(res.payload).message, 'Collection has been updated', 'ogDv9CFa4T');
      t.ok(JSON.parse(res.payload).info.updated, '4OVGjSnVwC');
      return getCollections('sam');
    })
    .then((res) => {
      t.equal(Object.keys(res).length, 1, 'ogDv9CFa4T');
      t.equal(Object.keys(res)[0], '100', 'ogDv9CFa4T');
      t.equal(res['100'].collection_description, 'description 2.0', 'ogDv9CFa4T');
      t.equal(res['100'].collection_name, 'new name', 'ogDv9CFa4T');

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
      t.equal(res.statusCode, 200, 'ogDv9CFa4T');
      t.equal(JSON.parse(res.payload).message, 'Collection has been updated', 'ogDv9CFa4T');
      t.ok(JSON.parse(res.payload).info.updated, '4OVGjSnVwC');
      return getCollections('sam');
    })
    .then((res) => {
      t.equal(Object.keys(res).length, 1, 'ogDv9CFa4T');
      t.equal(Object.keys(res)[0], '100', 'ogDv9CFa4T');
      t.equal(res['100'].collection_description, 'even newer description', 'ogDv9CFa4T');
      t.equal(res['100'].collection_name, 'new name', 'ogDv9CFa4T');
      return getWords('100');
    })
    .then((res) => {
      t.equal(res.length, 2, 'ogDv9CFa4T');
      t.equal(res.filter((o) => o.word_id === '100')[0].word_id, '100', 'ogDv9CFa4T');
      t.equal(res.filter((o) => o.direction === 'enToDe')[0].direction, 'enToDe', 'ogDv9CFa4T');
      t.equal(res.filter((o) => o.direction === 'enToDe')[0].source_word, 'hello', 'ogDv9CFa4T');
      t.deepEqual(res.filter((o) => o.direction === 'enToDe')[0].target_words, [ 'Hallo' ], 'I0lYn6Hlo0');

      t.equal(res.filter((o) => o.word_id === '101')[0].word_id, '101', 'ogDv9CFa4T');
      t.equal(res.filter((o) => o.direction === 'deToEn')[0].direction, 'deToEn', 'ogDv9CFa4T');
      t.equal(res.filter((o) => o.direction === 'deToEn')[0].source_word, 'Wiedersehen', 'ogDv9CFa4T');
      t.deepEqual(res.filter((o) => o.direction === 'deToEn')[0].target_words, [ 'Bye' ], 'I0lYn6Hlo0');

      t.end();
    })
    .catch((err) => assert(!err, err));
});

tape('DELETE :: /api/collection/{collection_id}', (t) => {
  const options = {
    method: 'delete',
    url: '/api/collection/100'
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
      t.equal(res.statusCode, 302, 'ogDv9CFa4T');
      t.equal(res.headers.location, '/login/timeout=true', 'ogDv9CFa4T');

      return authenticate(userObj);
    })
    .then((_headers) => {
      headers = _headers;
      
      return createCollection(collectionObj);
    })
    .then(() => getCollections('sam'))
    .then((res) => {
      t.deepEqual(Object.keys(res), [ '100' ], 'I0lYn6Hlo0');
      t.equal(res['100'].collection_description, 'another description', 'ogDv9CFa4T');
      t.equal(res['100'].collection_name, 'another name', 'ogDv9CFa4T');
      return server.inject(Object.assign(options, { headers }))
    })
    .then((res) => {
      t.equal(res.statusCode, 200, 'ogDv9CFa4T');
      t.equal(JSON.parse(res.payload).message, 'Collection has been deleted', 'ogDv9CFa4T');
      t.ok(JSON.parse(res.payload).info.deleted, '4OVGjSnVwC');

      return getCollections('sam');
    })
    .then((res) => {
      t.deepEqual(res, {}, 'I0lYn6Hlo0');

      t.end();
    })
    .catch((err) => assert(!err, err));
});

tape.onFinish(() => {
  redisCli.quit();
  pool.end();
  clearInterval(server.app.interval);
});

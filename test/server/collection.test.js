const tape = require('tape');
const assert = require('assert');

const server = require('../../server/server.js');
const redisCli = server.app.redisCli;
const pool = server.app.pool;

const flushDb = require('../helpers/flushDb.js')(pool, redisCli);
const authenticate = require('../helpers/authenticate.js')(pool, redisCli);
const getCollections = require('../helpers/getCollections.js')(pool);
const storeCollection = require('../helpers/storeCollection.js')(pool);

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
      t.equal(res.length, 1);
      t.equal(res[0].collection_name, 'collection1');
      t.equal(res[0].collection_description, 'my first collection');
      t.end();
    })
    .catch((err) => assert(!err, err));
});

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
      return storeCollection(collectionObj);
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

tape.onFinish(() => {
  redisCli.quit();
  pool.end();
});

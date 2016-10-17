const tape = require('tape');
const pg = require('pg')
const assert = require('assert');
const bluebird = require('bluebird');
const redis = require('redis');

const server = require('../../server/server.js');

const pool = server.app.pool;
const redisCli = server.app.redisCli;

const flushDb = require('../helpers/flushDb.js')(pool, redisCli);
const registerUser = require('../helpers/registerUser.js')(pool, redisCli);
const getCollections = require('../helpers/getCollections.js')(pool);
const storeCollection = require('../helpers/storeCollection.js')(pool);

tape('getCollections', (t) => {
  const collectionObj = {
    username: 'sam',
    collection_name: 'coll1',
    collection_description: 'my collection'
  };

  flushDb()
    .then(() => registerUser({ username: 'sam', password: 'pass' }))
    .then(() => getCollections('sam'))
    .then((res) => {
      t.equal(res.length, 0);
      return storeCollection(collectionObj);
    })
    .then(() => getCollections('sam'))
    .then((res) => {
      t.equal(res.length, 1)
      t.equal(res[0].collection_name, 'coll1');
      t.equal(res[0].collection_description, 'my collection');
      t.end();
    })
    .catch((err) => assert(!err, err));
});

tape.onFinish(() => {
  flushDb()
    .then(() => {
      pool.end();
      redisCli.quit();
    });
});

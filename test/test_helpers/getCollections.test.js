const tape = require('tape');
const assert = require('assert');

const redisCli = require('./configureRedis.js');
const pg = require('./configurePool.js');
const pool = new pg.pool(pg.config);

const flushDb = require('../helpers/flushDb.js')(pool, redisCli);
const registerUser = require('../helpers/registerUser.js')(pool, redisCli);
const getCollections = require('../helpers/getCollections.js')(pool);
const createCollection = require('../helpers/createCollection.js')(pool);

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
      return createCollection(collectionObj);
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

const tape = require('tape');
const assert = require('assert');

const redisCli = require('../test_helpers/configureRedis.js');
const pg = require('../test_helpers/configurePool.js');
const pool = new pg.pool(pg.config);

const flushDb = require('../helpers/flushDb.js')(pool, redisCli);
const registerUser = require('../helpers/registerUser.js')(pool)
const createCollection = require('../../db/pg/createCollection.js')(pool);
const getCollections = require('../../db/pg/getCollections.js')(pool);
const deleteCollection = require('../../db/pg/deleteCollection.js')(pool);

tape('deleteCollection', (t) => {
  const collectionObj = {
    username: 'sam',
    collection_name: 'name',
    collection_description: 'desc'
  };
  const userObj = { username: 'sam', password: 'pass' };

  flushDb()
    .then(() => registerUser(userObj))
    .then(() => createCollection(collectionObj))
    .then(() => getCollections('sam'))
    .then((res) => {
      t.equal(Object.keys(res).length, 1, 'hQCTkXsHKm');
      return deleteCollection('100');
    })
    .then(() => getCollections('sam'))
    .then((res) => {
      t.deepEqual(res, {}, 'TSitw7L11S');
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

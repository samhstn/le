const tape = require('tape');
const assert = require('assert');

const redisCli = require('../../test_helpers/configureRedis.js');
const pg = require('../../test_helpers/configurePool.js');
const pool = new pg.pool(pg.config);

const flushDb = require('../../helpers/flushDb.js')(pool, redisCli);
const registerUser = require('../../helpers/registerUser.js')(pool)
const createCollection = require('../../../db/pg/createCollection.js')(pool);
const getCollections = require('../../../db/pg/getCollections.js')(pool);
const handleCollectionUpdates =
  require('../../../db/pg/updateCollection/handleCollectionUpdates.js');

tape('handleCollectionUpdates', (t) => {
  const initialCollectionObj = {
    username: 'sam',
    collection_name: 'a',
    collection_description: 'a'
  };
  const updateCollectionObj = {
    collection_id: '100',
    collection_name: 'hello name',
    collection_description: 'hello description'
  };
  const userObj = { username: 'sam', password: 'pass' };

  flushDb()
    .then(() => registerUser(userObj))
    .then(() => createCollection(initialCollectionObj))
    .then(() => getCollections('sam'))
    .then((res) => {
      t.equal(Object.keys(res).length, 1, 'KOly50zPCS');
      t.equal(Object.keys(res)[0], '100', 'KOly50zPCS');
      t.equal(res['100'].collection_name, 'a', 'KOly50zPCS');
      t.equal(res['100'].collection_description, 'a', 'KOly50zPCS');
      return handleCollectionUpdates(pool, updateCollectionObj);
    })
    .then(() => getCollections('sam'))
    .then((res) => {
      t.equal(Object.keys(res).length, 1, 'KOly50zPCS');
      t.equal(Object.keys(res)[0], '100', 'KOly50zPCS');
      t.equal(res['100'].collection_name, 'hello name', 'KOly50zPCS');
      t.equal(res['100'].collection_description, 'hello description', 'KOly50zPCS');
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

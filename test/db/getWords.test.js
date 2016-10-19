const tape = require('tape');
const assert = require('assert');

const redisCli = require('../test_helpers/configureRedis.js');
const pg = require('../test_helpers/configurePool.js');
const pool = new pg.pool(pg.config);

const flushDb = require('../helpers/flushDb.js')(pool, redisCli);
const registerUser = require('../helpers/registerUser.js')(pool);
const createCollection = require('../../db/pg/createCollection.js')(pool);
const updateCollection = require('../../db/pg/updateCollection.js')(pool);
const getCollections = require('../../db/pg/getCollections.js')(pool);
const getWords = require('../../db/pg/getWords.js')(pool);

tape('getWords', (t) => {
  const createCollectionObj = {
    username: 'sam',
    collection_name: 'coll',
    collection_description: 'desc'
  };

  const updateCollectionObj = {
    collection_name: 'sams collection',
    new_words: [
      {
        direction: 'enToDe',
        source_word: 'hello',
        target_words: ['hi', 'hallo']
      }
    ]
  };

  const userObj = { username: 'sam', password: 'pass' };

  let collection_id;

  flushDb()
    .then(() => registerUser(userObj))
    .then(() => createCollection(createCollectionObj))
    .then(() => getCollections('sam'))
    .then((res) => {
      collection_id = Object.keys(res)[0];
      t.equal(Object.keys(res).length, 1);
      t.equal(Object.keys(res)[0], '100');
      t.equal(res['100'].collection_name, 'coll');
      t.equal(res['100'].collection_description, 'desc');
      return updateCollection(Object.assign(updateCollectionObj, { collection_id }));
    })
    .then(() => getCollections('sam'))
    .then((res) => {
      t.equal(Object.keys(res).length, 1);
      t.equal(Object.keys(res)[0], '100');
      t.equal(res['100'].collection_name, 'sams collection');
      t.equal(res['100'].collection_description, 'desc');
      return getWords(collection_id);
    })
    .then((res) => {
      t.equal(res.length, 1);
      t.equal(res[0].collection_id, '100');
      t.equal(res[0].direction, 'enToDe');
      t.equal(res[0].source_word, 'hello');
      t.deepEqual(res[0].target_words, [ 'hi', 'hallo' ]);
      t.equal(res[0].word_id, '100')
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

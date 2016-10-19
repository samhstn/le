const tape = require('tape');
const assert = require('assert');

const redisCli = require('../../test_helpers/configureRedis.js');
const pg = require('../../test_helpers/configurePool.js');
const pool = new pg.pool(pg.config);

const flushDb = require('../../helpers/flushDb.js')(pool, redisCli);
const registerUser = require('../../helpers/registerUser.js')(pool)
const createCollection = require('../../../db/pg/createCollection.js')(pool);
const getCollections = require('../../../db/pg/getCollections.js')(pool);
const getWords = require('../../../db/pg/getWords.js')(pool);
const handleNewWords = require('../../../db/pg/updateCollection/handleNewWords.js');

tape('handleNewWords', (t) => {
  const collectionObj = {
    username: 'sam',
    collection_name: 'name',
    collection_description: 'desc'
  };
  const newWordsObj = {
    collection_id: '100',
    new_words: [
      {
        direction: 'enToDe',
        source_word: 'hello',
        target_words: ['hallo']
      }
    ]
  };
  const userObj = { username: 'sam', password: 'pass' };

  flushDb()
    .then(() => registerUser(userObj))
    .then(() => createCollection(collectionObj))
    .then(() => handleNewWords(pool, newWordsObj))
    .then(() => getCollections('sam'))
    .then((res) => {
      t.equal(Object.keys(res).length, 1);
      t.equal(Object.keys(res)[0], '100');
      t.equal(res['100'].collection_name, 'name');
      t.equal(res['100'].collection_description, 'desc');
    })
    .then(() => getWords('100'))
    .then((res) => {
      t.equal(res.length, 1);
      t.equal(res[0].word_id, '100');
      t.equal(res[0].collection_id, '100');
      t.equal(res[0].direction, 'enToDe');
      t.equal(res[0].source_word, 'hello');
      t.deepEqual(res[0].target_words, [ 'hallo' ]);
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

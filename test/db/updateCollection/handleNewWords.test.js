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
      t.equal(Object.keys(res).length, 1, 'YMygtV8cfw');
      t.equal(Object.keys(res)[0], '100', 'YMygtV8cfw');
      t.equal(res['100'].collection_name, 'name', 'YMygtV8cfw');
      t.equal(res['100'].collection_description, 'desc', 'YMygtV8cfw');
    })
    .then(() => getWords('100'))
    .then((res) => {
      t.equal(res.length, 1, 'YMygtV8cfw');
      t.equal(res[0].word_id, '100', 'YMygtV8cfw');
      t.equal(res[0].collection_id, '100', 'YMygtV8cfw');
      t.equal(res[0].direction, 'enToDe', 'YMygtV8cfw');
      t.equal(res[0].source_word, 'hello', 'YMygtV8cfw');
      t.deepEqual(res[0].target_words, [ 'hallo' ], 'D2UptVR7Jk');
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

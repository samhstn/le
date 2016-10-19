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
const handleDeleteWords = require('../../../db/pg/updateCollection/handleDeleteWords.js');

tape('handleUpdateWords', (t) => {
  const collectionObj = {
    username: 'sam',
    collection_name: 'name',
    collection_description: 'desc'
  };
  const wordsObj = {
    collection_id: '100',
    new_words: [
      {
        direction: 'enToDe',
        source_word: 'hello',
        target_words: ['hallo']
      },
      {
        direction: 'deToEn',
        source_word: 'das auto',
        target_words: [ 'the car' ]
      }
    ]
  };
  const userObj = { username: 'sam', password: 'pass' };

  flushDb()
    .then(() => registerUser(userObj))
    .then(() => createCollection(collectionObj))
    .then(() => handleNewWords(pool, wordsObj))
    .then(() => getWords('100'))
    .then((res) => {
      t.equal(res.length, 2);
      t.equal(res[0].word_id, '100');
      t.equal(res[0].collection_id, '100');
      t.equal(res[0].direction, 'enToDe');
      t.equal(res[0].source_word, 'hello');
      t.equal(res[1].word_id, '101');
      t.equal(res[1].collection_id, '100');
      t.equal(res[1].direction, 'deToEn');
      t.equal(res[1].source_word, 'das auto');
      t.deepEqual(res[1].target_words, [ 'the car' ]);
      const deleteCollObj = {
        collection_id: '100',
        delete_words: ['100']
      };
      return handleDeleteWords(pool, deleteCollObj);
    })
    .then(() => getWords('100'))
    .then((res) => {
      t.equal(res.length, 1);
      t.equal(res[0].word_id, '101');
      t.equal(res[0].collection_id, '100');
      t.equal(res[0].direction, 'deToEn');
      t.equal(res[0].source_word, 'das auto');
      t.deepEqual(res[0].target_words, [ 'the car' ]);
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

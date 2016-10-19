const tape = require('tape');
const assert = require('assert');

const redisCli = require('../../test_helpers/configureRedis.js');
const pg = require('../../test_helpers/configurePool.js');
const pool = new pg.pool(pg.config);

const flushDb = require('../../helpers/flushDb.js')(pool, redisCli);
const registerUser = require('../../helpers/registerUser.js')(pool)
const createCollection = require('../../helpers/createCollection.js')(pool);
const getCollections = require('../../helpers/getCollections.js')(pool);
const getWords = require('../../helpers/getWords.js')(pool);
const handleNewWords = require('../../helpers/updateCollection/handleNewWords.js');
const handleUpdateWords = require('../../helpers/updateCollection/handleUpdateWords.js');

tape('handleUpdateWords', (t) => {
  const collectionObj = {
    username: 'sam',
    collection_name: 'name',
    collection_description: 'desc'
  };
  const initialWordsObj = {
    collection_id: '100',
    new_words: [
      {
        direction: 'enToDe',
        source_word: 'hello',
        target_words: ['hallo']
      }
    ]
  };
  const newWordsObj = {
    collection_id: '100',
    update_words: {
      '100': {
        direction: 'deToEn',
        source_word: 'hallo',
        target_words: [ 'hello' ],
        hint: 'my hint'
      }  
    }
  };
  const userObj = { username: 'sam', password: 'pass' };

  flushDb()
    .then(() => registerUser(userObj))
    .then(() => createCollection(collectionObj))
    .then(() => handleNewWords(pool, initialWordsObj))
    .then(() => getWords('100'))
    .then((res) => {
      t.equal(res.length, 1);
      t.equal(res[0].word_id, '100');
      t.equal(res[0].collection_id, '100');
      t.equal(res[0].direction, 'enToDe');
      t.equal(res[0].source_word, 'hello');
      t.deepEqual(res[0].target_words, [ 'hallo' ]);
      return handleUpdateWords(pool, newWordsObj);
    })
    .then(() => getWords('100'))
    .then((res) => {
      t.equal(res.length, 1);
      t.equal(res[0].word_id, '100');
      t.equal(res[0].collection_id, '100');
      t.equal(res[0].direction, 'deToEn');
      t.equal(res[0].source_word, 'hallo');
      t.deepEqual(res[0].target_words, [ 'hello' ]);
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

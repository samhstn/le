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
const handleUpdateWords = require('../../../db/pg/updateCollection/handleUpdateWords.js');

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
      },
      {
        direction: 'deToEn',
        source_word: 'die Bibliothek',
        target_words: ['the library']
      },
      {
        direction: 'deToEn',
        source_word: 'der Laden',
        target_words: ['the shop']
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
        hint: 'my first hint',
        attempts: 10,
        correct_attempts: 9,
        score: 6
      },  
      '101': {
        hint: 'second hint',
        attempts: 10,
        correct_attempts: 10,
        score: 9
      },  
      '102': {
        hint: 'third hint',
        attempts: 12,
        correct_attempts: 10,
        score: 8
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
      t.equal(res.length, 3);
      t.equal(res[0].word_id, '100');
      t.equal(res[0].collection_id, '100');
      t.equal(res[0].direction, 'enToDe');
      t.equal(res[0].source_word, 'hello');
      t.deepEqual(res[0].target_words, [ 'hallo' ]);
      return handleUpdateWords(pool, newWordsObj);
    })
    .then(() => getWords('100'))
    .then((res) => {
      t.equal(res.length, 3);
      t.equal(res[0].word_id, '100');
      t.equal(res[0].collection_id, '100');
      t.equal(res[0].direction, 'deToEn');
      t.equal(res[0].source_word, 'hallo');
      t.deepEqual(res[0].target_words, [ 'hello' ]);
      t.equal(res[0].hint, 'my first hint');
      t.equal(res[0].attempts, '10');
      t.equal(res[0].correct_attempts, '9');
      t.equal(res[0].score, 6);

      t.equal(res[1].word_id, '101');
      t.equal(res[1].collection_id, '100');
      t.equal(res[1].direction, 'deToEn');
      t.equal(res[1].source_word, 'die Bibliothek');
      t.deepEqual(res[1].target_words, [ 'the library' ]);
      t.equal(res[1].hint, 'second hint');
      t.equal(res[1].attempts, '10');
      t.equal(res[1].correct_attempts, '10');
      t.equal(res[1].score, 9);

      t.equal(res[2].word_id, '102');
      t.equal(res[2].collection_id, '100');
      t.equal(res[2].direction, 'deToEn');
      t.equal(res[2].source_word, 'der Laden');
      t.deepEqual(res[2].target_words, [ 'the shop' ]);
      t.equal(res[2].hint, 'third hint');
      t.equal(res[2].attempts, '12');
      t.equal(res[2].correct_attempts, '10');
      t.equal(res[2].score, 8);
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

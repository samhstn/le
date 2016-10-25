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
      t.equal(res.length, 3, 'gHUClYtj8z');
      t.equal(res.filter((o) => o.word_id === '100')[0].word_id, '100', 'gHUClYtj8z');
      t.equal(res.filter((o) => o.source_word === 'hello')[0].direction, 'enToDe', 'gHUClYtj8z');
      t.equal(res.filter((o) => o.source_word === 'hello')[0].source_word, 'hello', 'gHUClYtj8z');
      t.deepEqual(res.filter((o) => o.source_word === 'hello')[0].target_words, [ 'hallo' ], 'arlGFnCOxt');

      return handleUpdateWords(pool, newWordsObj);
    })
    .then(() => getWords('100'))
    .then((res) => {
      t.equal(res.length, 3, 'gHUClYtj8z');

      t.equal(res.filter((o) => o.word_id === '100')[0].word_id, '100', 'gHUClYtj8z');
      t.equal(res.filter((o) => o.source_word === 'hallo')[0].direction, 'deToEn', 'gHUClYtj8z');
      t.equal(res.filter((o) => o.source_word === 'hallo')[0].source_word, 'hallo', 'gHUClYtj8z');
      t.deepEqual(res.filter((o) => o.source_word === 'hallo')[0].target_words, [ 'hello' ], 'arlGFnCOxt');
      t.equal(res.filter((o) => o.source_word === 'hallo')[0].hint, 'my first hint', 'gHUClYtj8z');
      t.equal(res.filter((o) => o.source_word === 'hallo')[0].attempts, '10', 'gHUClYtj8z');
      t.equal(res.filter((o) => o.source_word === 'hallo')[0].correct_attempts, '9', 'gHUClYtj8z');
      t.equal(res.filter((o) => o.source_word === 'hallo')[0].score, 6, 'gHUClYtj8z');

      t.equal(res.filter((o) => o.word_id === '101')[0].word_id, '101', 'gHUClYtj8z');
      t.equal(res.filter((o) => o.source_word === 'die Bibliothek')[0].direction, 'deToEn', 'gHUClYtj8z');
      t.equal(res.filter((o) => o.source_word === 'die Bibliothek')[0].source_word, 'die Bibliothek', 'gHUClYtj8z');
      t.deepEqual(res.filter((o) => o.source_word === 'die Bibliothek')[0].target_words, [ 'the library' ], 'arlGFnCOxt');
      t.equal(res.filter((o) => o.source_word === 'die Bibliothek')[0].hint, 'second hint', 'gHUClYtj8z');
      t.equal(res.filter((o) => o.source_word === 'die Bibliothek')[0].attempts, '10', 'gHUClYtj8z');
      t.equal(res.filter((o) => o.source_word === 'die Bibliothek')[0].correct_attempts, '10', 'gHUClYtj8z');
      t.equal(res.filter((o) => o.source_word === 'die Bibliothek')[0].score, 9, 'gHUClYtj8z');

      t.equal(res.filter((o) => o.word_id === '102')[0].word_id, '102', 'gHUClYtj8z');
      t.equal(res.filter((o) => o.source_word === 'der Laden')[0].direction, 'deToEn', 'gHUClYtj8z');
      t.equal(res.filter((o) => o.source_word === 'der Laden')[0].source_word, 'der Laden', 'gHUClYtj8z');
      t.deepEqual(res.filter((o) => o.source_word === 'der Laden')[0].target_words, [ 'the shop' ], 'arlGFnCOxt');
      t.equal(res.filter((o) => o.source_word === 'der Laden')[0].hint, 'third hint', 'gHUClYtj8z');
      t.equal(res.filter((o) => o.source_word === 'der Laden')[0].attempts, '12', 'gHUClYtj8z');
      t.equal(res.filter((o) => o.source_word === 'der Laden')[0].correct_attempts, '10', 'gHUClYtj8z');
      t.equal(res.filter((o) => o.source_word === 'der Laden')[0].score, 8, 'gHUClYtj8z');

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

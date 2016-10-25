const tape = require('tape');
const assert = require('assert');
const redisCli = require('../test_helpers/configureRedis.js');
const pg = require('../test_helpers/configurePool.js');
const pool = new pg.pool(pg.config);

const flushDb = require('../helpers/flushDb.js')(pool, redisCli);
const registerUser = require('../helpers/registerUser.js')(pool, redisCli);
const createCollection = require('../../db/pg/createCollection.js')(pool);
const updateCollection = require('../../db/pg/updateCollection.js')(pool);
const getCollections = require('../../db/pg/getCollections.js')(pool);
const getWords = require('../../db/pg/getWords.js')(pool);
const getCollectionWithWords = require('../../db/pg/getCollectionWithWords.js')(pool);

tape('getCollectionWithWords', (t) => {
  flushDb()
    .then(() => registerUser({ username: 'sam', password: 'pass' }))
    .then(() => {
      const collectionObj = {
        username: 'sam',
        collection_name: 'col1',
        collection_description: 'col desc1'
      };

      return createCollection(collectionObj);
    })
    .then(() => {
      const collectionObj = {
        username: 'sam',
        collection_name: 'col2',
        collection_description: 'col desc2'
      };

      return createCollection(collectionObj);
    })
    .then(() => {
      const collectionObj = {
        collection_id: '100',
        new_words: [
          {
            direction: 'deToEn',
            source_word: 'Wiedersehen',
            target_words: ['Bye'],
            attempts: 10,
            correct_attempts: 6,
            score: 5
          },
          {
            direction: 'enToDe',
            source_word: 'hello',
            target_words: ['hallo', 'Guten Tag'],
            attempts: 10,
            correct_attempts: 8,
            score: 6
          },
          {
            direction: 'deToEn',
            source_word: 'das Auto',
            target_words: ['the car'],
            attempts: 12,
            correct_attempts: 8,
            score: 9
          }
        ]
      };
      return updateCollection(collectionObj);
    })
    .then(() => getCollectionWithWords('100'))
    .then((res) => {
      t.equal(res.collection_id, '100', 'WUEyoe5ZCR');
      t.equal(res.collection_name, 'col1', 'WUEyoe5ZCR');
      t.equal(res.collection_description, 'col desc1', 'WUEyoe5ZCR');
      t.equal(res.words.length, 3, 'WUEyoe5ZCR');
      t.equal(res.words.filter((o) => o.word_id === '100')[0].word_id, '100', 'WUEyoe5ZCR');
      t.equal(res.words.filter((o) => o.source_word === 'Wiedersehen')[0].direction, 'deToEn', 'WUEyoe5ZCR');
      t.equal(res.words.filter((o) => o.source_word === 'Wiedersehen')[0].source_word, 'Wiedersehen', 'WUEyoe5ZCR');
      t.deepEqual(res.words[0].target_words, [ 'Bye' ], 'pyhwTDxM0y');
      t.equal(res.words.filter((o) => o.source_word === 'Wiedersehen')[0].hint, null, 'WUEyoe5ZCR');
      t.equal(res.words.filter((o) => o.source_word === 'Wiedersehen')[0].attempts, '0', 'WUEyoe5ZCR');
      t.equal(res.words.filter((o) => o.source_word === 'Wiedersehen')[0].correct_attempts, '0', 'WUEyoe5ZCR');
      t.equal(res.words.filter((o) => o.source_word === 'Wiedersehen')[0].score, 5, 'WUEyoe5ZCR');

      t.equal(res.words.filter((o) => o.word_id === '101')[0].word_id, '101', 'WUEyoe5ZCR');
      t.equal(res.words.filter((o) => o.source_word === 'hello')[0].direction, 'enToDe', 'WUEyoe5ZCR');
      t.equal(res.words.filter((o) => o.source_word === 'hello')[0].source_word, 'hello', 'WUEyoe5ZCR');
      t.deepEqual(res.words.filter((o) => o.source_word === 'hello')[0].target_words, [ 'hallo', 'Guten Tag' ], 'pyhwTDxM0y');
      t.equal(res.words.filter((o) => o.source_word === 'hello')[0].hint, null, 'WUEyoe5ZCR');
      t.equal(res.words.filter((o) => o.source_word === 'hello')[0].attempts, '0', 'WUEyoe5ZCR');
      t.equal(res.words.filter((o) => o.source_word === 'hello')[0].correct_attempts, '0', 'WUEyoe5ZCR');
      t.equal(res.words.filter((o) => o.source_word === 'hello')[0].score, 5, 'WUEyoe5ZCR');

      t.equal(res.words.filter((o) => o.word_id === '102')[0].word_id, '102', 'WUEyoe5ZCR');
      t.equal(res.words.filter((o) => o.source_word === 'das Auto')[0].direction, 'deToEn', 'WUEyoe5ZCR');
      t.equal(res.words.filter((o) => o.source_word === 'das Auto')[0].source_word, 'das Auto', 'WUEyoe5ZCR');
      t.deepEqual(res.words.filter((o) => o.source_word === 'das Auto')[0].target_words, [ 'the car' ], 'pyhwTDxM0y');
      t.equal(res.words.filter((o) => o.source_word === 'das Auto')[0].hint, null, 'WUEyoe5ZCR');
      t.equal(res.words.filter((o) => o.source_word === 'das Auto')[0].attempts, '0', 'WUEyoe5ZCR');
      t.equal(res.words.filter((o) => o.source_word === 'das Auto')[0].correct_attempts, '0', 'WUEyoe5ZCR');
      t.equal(res.words.filter((o) => o.source_word === 'das Auto')[0].score, 5, 'WUEyoe5ZCR');

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

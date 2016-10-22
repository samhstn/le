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
      // TODO: write more tests for this
      t.equal(res.length, 3);
      t.equal(res[0].collection_id, '100');
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

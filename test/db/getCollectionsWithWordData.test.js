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
const getCollectionsWithWordData = require('../../db/pg/getCollectionsWithWordData.js')(pool);

tape('getCollectionsWithWordData', (t) => {
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
    .then(() => getCollections('sam'))
    .then((res) => {
      t.equal(Object.keys(res).length, 2);
      t.equal(Object.keys(res)[0], '100');
      t.equal(res['100'].collection_name, 'col1');
      t.equal(res['100'].collection_description, 'col desc1')
      t.equal(Object.keys(res)[1], '101');
      t.equal(res['101'].collection_name, 'col2');
      t.equal(res['101'].collection_description, 'col desc2')
      const collectionObj = {
        collection_id: '100',
        new_words: [
          {
            direction: 'deToEn',
            source_word: 'Wiedersehen',
            target_words: ['Bye'],
          },
          {
            direction: 'enToDe',
            source_word: 'hello',
            target_words: ['hallo', 'Guten Tag'],
          },
          {
            direction: 'deToEn',
            source_word: 'das Auto',
            target_words: ['the car'],
          }
        ]
      };
      return updateCollection(collectionObj);
    })
    .then(() => {
      const collectionObj = {
        collection_id: '100',
        update_words: {
          '100': {
            attempts: 10,
            correct_attempts: 6,
            score: 5
          },
          '101': {
            attempts: 10,
            correct_attempts: 8,
            score: 6
          },
          '102': {
            attempts: 12,
            correct_attempts: 8,
            score: 9
          }
        }
      };
      return updateCollection(collectionObj);
    })
    .then(() => getCollectionsWithWordData('sam'))
    .then((res) => {
      t.equal(Object.keys(res).length, 2);
      t.deepEqual(Object.keys(res), ['100', '101']);

      t.equal(res['100'].collection_name, 'col1');
      t.equal(res['100'].collection_description, 'col desc1');
      t.equal(res['100'].average_score, 6.67);
      t.equal(res['100'].number_of_words, 3);

      t.equal(res['101'].collection_name, 'col2');
      t.equal(res['101'].collection_description, 'col desc2');
      t.equal(res['101'].average_score, null);
      t.equal(res['101'].number_of_words, 0);

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

const tape = require('tape');
const assert = require('assert');

const redisCli = require('../test_helpers/configureRedis.js');
const pg = require('../test_helpers/configurePool.js');
const pool = new pg.pool(pg.config);

const flushDb = require('../helpers/flushDb.js')(pool, redisCli);
const registerUser = require('../helpers/registerUser.js')(pool);
const createCollection = require('../../db/pg/createCollection.js')(pool);
const getCollections = require('../../db/pg/getCollections.js')(pool);
const getWords = require('../../db/pg/getWords.js')(pool);
const updateCollection = require('../../db/pg/updateCollection.js')(pool);
const updateScores = require('../../db/pg/updateScores.js')(pool);
const updateSettings = require('../../db/pg/updateSettings.js')(pool);

tape('updateScores', (t) => {
  flushDb()
    .then(() => registerUser({ username: 'sam', password: 'asdf' }))
    .then(() => createCollection({
      username: 'sam',
      collection_name: 'hi1',
      collection_description: 'desc1'
    }))
    .then(() => createCollection({
      username: 'sam',
      collection_name: 'hi2',
      collection_description: 'desc2'
    }))
    .then(() => createCollection({
      username: 'sam',
      collection_name: 'hi3',
      collection_description: 'desc3'
    }))
    .then(() => getCollections('sam'))
    .then((res) => {
      t.deepEqual(Object.keys(res), [ '100', '101', '102' ]);
      Object.keys(res).forEach((key, i) => {
        t.equal(res[key].collection_name, 'hi' + (i + 1));
        t.equal(res[key].collection_description, 'desc' + (i + 1));
      });

      const collectionObj = {
        collection_id: '100',
        collection_description: 'new description',
        new_words: [
          {
            direction: 'deToEn',
            source_word: 'Wiedersehen',
            target_words: [ 'Bye' ]
          },
          {
            direction: 'enToDe',
            source_word: 'hello',
            target_words: [ 'hallo', 'Guten Tag' ]
          }
        ]
      };

      return updateCollection(collectionObj);
    })
    .then(() => {
      const collectionObj = {
        collection_id: '102',
        collection_description: 'new description 2',
        new_words: [
          {
            direction: 'deToEn',
            source_word: 'Wiedersehen',
            target_words: [ 'Bye' ]
          },
          {
            direction: 'enToDe',
            source_word: 'hello',
            target_words: [ 'hallo', 'Guten Tag' ]
          },
          {
            direction: 'deToEn',
            source_word: 'die Bibliothek',
            target_words: [ 'the library' ]
          }
        ]
      };

      return updateCollection(collectionObj);
    })
    .then(() => getCollections('sam'))
    .then((res) => {
      t.deepEqual(Object.keys(res), [ '100', '101', '102' ]);

      return getWords('100');
    })
    .then((res) => {
      t.equal(res.length, 2);
      t.equal(res.filter((o) => o.word_id === '100')[0].word_id, '100');
      t.equal(res.filter((o) => o.direction === 'deToEn')[0].collection_id, '100');
      t.equal(res.filter((o) => o.direction === 'deToEn')[0].direction, 'deToEn');
      t.equal(res.filter((o) => o.direction === 'deToEn')[0].source_word, 'Wiedersehen');
      t.deepEqual(res.filter((o) => o.direction === 'deToEn')[0].target_words, [ 'Bye' ]);
      t.equal(res.filter((o) => o.word_id === '101')[0].word_id, '101');
      t.equal(res.filter((o) => o.direction === 'enToDe')[0].collection_id, '100');
      t.equal(res.filter((o) => o.direction === 'enToDe')[0].direction, 'enToDe');
      t.equal(res.filter((o) => o.direction === 'enToDe')[0].source_word, 'hello');
      t.deepEqual(res.filter((o) => o.direction === 'enToDe')[0].target_words, [ 'hallo', 'Guten Tag' ]);

      const collectionObj = {
        collection_id: '100',
        update_words: {
          '100': {
            target_words: [ 'GoodBye' ],
            hint: 'my first hint',
            score: 6.9
          },
          '101': {
            hint: 'Hello hint',
            score: 7.1
          }
        }
      };

      return updateCollection(collectionObj);
    })
    .then((res) => {
      const collectionObj = {
        collection_id: '102',
        update_words: {
          '102': {
            target_words: [ 'GoodBye' ],
            hint: 'my first hint',
            score: 9.2
          },
          '103': {
            score: 4
          },
          '104': {
            score: 9.9
          }
        }
      };

      return updateCollection(collectionObj);
    })
    .then(() => getWords('100'))
    .then((res) => {
      t.deepEqual(res.filter((o) => o.word_id === '100')[0].target_words, [ 'GoodBye' ]);
      t.equal(res.filter((o) => o.word_id === '100')[0].hint, 'my first hint');
      t.equal(res.filter((o) => o.word_id === '100')[0].score, 6.9);
      t.equal(res.filter((o) => o.word_id === '101')[0].hint, 'Hello hint');
      t.equal(res.filter((o) => o.word_id === '101')[0].score, 7.1);

      return getWords('101');
    })
    .then((res) => {
      t.deepEqual(res, []);

      return getWords('102');
    })
    .then((res) => {
      t.equal(res.length, 3);
      t.deepEqual(res.filter((o) => o.word_id === '102')[0].target_words, [ 'GoodBye' ]);
      t.equal(res.filter((o) => o.word_id === '102')[0].hint, 'my first hint');
      t.equal(res.filter((o) => o.word_id === '102')[0].score, 9.2);
      t.equal(res.filter((o) => o.word_id === '103')[0].score, 4);
      t.equal(res.filter((o) => o.word_id === '104')[0].score, 9.9);

      const settingsObj = {
        'sam': {
          decrease_per_hour: 1,
          decrease_per_day: 3,
          correct_answer_increase: 1,
          incorrect_answer_decrease: 1
        }
      };

      return updateSettings(settingsObj);
    })
    .then(() => updateScores('hour'))
    .then(() => getWords('100'))
    .then((res) => {
      t.equal(res.filter((o) => o.word_id === '100')[0].score, 5.9);
      t.equal(res.filter((o) => o.word_id === '101')[0].score, 6.1);

      return getWords('102');
    })
    .then((res) => {
      t.equal(res.length, 3);
      t.equal(res.filter((o) => o.word_id === '102')[0].score, 8.2);
      t.equal(res.filter((o) => o.word_id === '103')[0].score, 4);
      t.equal(res.filter((o) => o.word_id === '104')[0].score, 8.9);

      return updateScores('day');
    })
    .then(() => getWords('100'))
    .then((res) => {
      t.equal(res.filter((o) => o.word_id === '100')[0].score, 5);
      t.equal(res.filter((o) => o.word_id === '101')[0].score, 5);

      return getWords('102');
    })
    .then((res) => {
      t.equal(res.length, 3);
      t.equal(res.filter((o) => o.word_id === '102')[0].score, 5.2);
      t.equal(res.filter((o) => o.word_id === '103')[0].score, 4);
      t.equal(res.filter((o) => o.word_id === '104')[0].score, 5.9);

      t.end();
    })
    .catch((err) => assert(!err, err));
});

tape('updateScores of an individual user', (t) => {
  flushDb()
    .then(() => registerUser({ username: 'sam', password: 'asdf' }))
    .then(() => createCollection({
      username: 'sam',
      collection_name: 'hi1',
      collection_description: 'desc1'
    }))
    .then(() => createCollection({
      username: 'sam',
      collection_name: 'hi2',
      collection_description: 'desc2'
    }))
    .then(() => createCollection({
      username: 'sam',
      collection_name: 'hi3',
      collection_description: 'desc3'
    }))
    .then(() => getCollections('sam'))
    .then((res) => {
      t.deepEqual(Object.keys(res), [ '100', '101', '102' ]);
      Object.keys(res).forEach((key, i) => {
        t.equal(res[key].collection_name, 'hi' + (i + 1));
        t.equal(res[key].collection_description, 'desc' + (i + 1));
      });

      const collectionObj = {
        collection_id: '100',
        collection_description: 'new description',
        new_words: [
          {
            direction: 'deToEn',
            source_word: 'Wiedersehen',
            target_words: [ 'Bye' ]
          },
          {
            direction: 'enToDe',
            source_word: 'hello',
            target_words: [ 'hallo', 'Guten Tag' ]
          }
        ]
      };

      return updateCollection(collectionObj);
    })
    .then(() => {
      const collectionObj = {
        collection_id: '102',
        collection_description: 'new description 2',
        new_words: [
          {
            direction: 'deToEn',
            source_word: 'Wiedersehen',
            target_words: [ 'Bye' ]
          },
          {
            direction: 'enToDe',
            source_word: 'hello',
            target_words: [ 'hallo', 'Guten Tag' ]
          },
          {
            direction: 'deToEn',
            source_word: 'die Bibliothek',
            target_words: [ 'the library' ]
          }
        ]
      };

      return updateCollection(collectionObj);
    })
    .then(() => getCollections('sam'))
    .then((res) => {
      t.deepEqual(Object.keys(res), [ '100', '101', '102' ]);

      return getWords('100');
    })
    .then((res) => {
      t.equal(res.length, 2);
      t.equal(res.filter((o) => o.word_id === '100')[0].word_id, '100');
      t.equal(res.filter((o) => o.direction === 'deToEn')[0].collection_id, '100');
      t.equal(res.filter((o) => o.direction === 'deToEn')[0].direction, 'deToEn');
      t.equal(res.filter((o) => o.direction === 'deToEn')[0].source_word, 'Wiedersehen');
      t.deepEqual(res[0].target_words, [ 'Bye' ]);
      t.equal(res.filter((o) => o.word_id === '101')[0].word_id, '101');
      t.equal(res.filter((o) => o.direction === 'enToDe')[0].collection_id, '100');
      t.equal(res.filter((o) => o.direction === 'enToDe')[0].direction, 'enToDe');
      t.equal(res.filter((o) => o.direction === 'enToDe')[0].source_word, 'hello');
      t.deepEqual(res.filter((o) => o.direction === 'enToDe')[0].target_words, [ 'hallo', 'Guten Tag' ]);

      const collectionObj = {
        collection_id: '100',
        update_words: {
          '100': {
            target_words: [ 'GoodBye' ],
            hint: 'my first hint',
            score: 6.9
          },
          '101': {
            hint: 'Hello hint',
            score: 7.1
          }
        }
      };

      return updateCollection(collectionObj);
    })
    .then((res) => {
      const collectionObj = {
        collection_id: '102',
        update_words: {
          '102': {
            target_words: [ 'GoodBye' ],
            hint: 'my first hint',
            score: 9.2
          },
          '103': {
            score: 4
          },
          '104': {
            score: 9.9
          }
        }
      };

      return updateCollection(collectionObj);
    })
    .then(() => getWords('100'))
    .then((res) => {
      t.deepEqual(res.filter((o) => o.word_id === '100')[0].target_words, [ 'GoodBye' ]);
      t.equal(res.filter((o) => o.word_id === '100')[0].hint, 'my first hint');
      t.equal(res.filter((o) => o.word_id === '100')[0].score, 6.9);
      t.equal(res.filter((o) => o.word_id === '101')[0].hint, 'Hello hint');
      t.equal(res.filter((o) => o.word_id === '101')[0].score, 7.1);

      return getWords('101');
    })
    .then((res) => {
      t.deepEqual(res, []);

      return getWords('102');
    })
    .then((res) => {
      t.equal(res.length, 3);
      t.deepEqual(res.filter((o) => o.word_id === '102')[0].target_words, [ 'GoodBye' ]);
      t.equal(res.filter((o) => o.word_id === '102')[0].hint, 'my first hint');
      t.equal(res.filter((o) => o.word_id === '102')[0].score, 9.2);
      t.equal(res.filter((o) => o.word_id === '103')[0].score, 4);
      t.equal(res.filter((o) => o.word_id === '104')[0].score, 9.9);

      const settingsObj = {
        'sam': {
          decrease_per_hour: 1,
          decrease_per_day: 3,
          correct_answer_increase: 1,
          incorrect_answer_decrease: 1
        }
      };

      return updateSettings(settingsObj);
    })
    .then(() => updateScores('hour', 'sam'))
    .then(() => getWords('100'))
    .then((res) => {
      t.equal(res.filter((o) => o.word_id === '100')[0].score, 5.9);
      t.equal(res.filter((o) => o.word_id === '101')[0].score, 6.1);

      return getWords('102');
    })
    .then((res) => {
      t.equal(res.length, 3);
      t.equal(res.filter((o) => o.word_id === '102')[0].score, 8.2);
      t.equal(res.filter((o) => o.word_id === '103')[0].score, 4);
      t.equal(res.filter((o) => o.word_id === '104')[0].score, 8.9);

      return updateScores('day', 'sam');
    })
    .then(() => getWords('100'))
    .then((res) => {
      t.equal(res.filter((o) => o.word_id === '100')[0].score, 5);
      t.equal(res.filter((o) => o.word_id === '101')[0].score, 5);

      return getWords('102');
    })
    .then((res) => {
      t.equal(res.length, 3);
      t.equal(res.filter((o) => o.word_id === '102')[0].score, 5.2);
      t.equal(res.filter((o) => o.word_id === '103')[0].score, 4);
      t.equal(res.filter((o) => o.word_id === '104')[0].score, 5.9);

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

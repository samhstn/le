const tape = require('tape');
const assert = require('assert');

const server = require('../../server/server.js');

const pool = server.app.pool;
const redisCli = server.app.redisCli;

const flushDb = require('../helpers/flushDb.js')(pool, redisCli);
const registerUser = require('../helpers/registerUser.js')(pool);
const createCollection = require('../helpers/createCollection.js')(pool);
const getCollections = require('../helpers/getCollections.js')(pool);
const updateCollection = require('../helpers/updateCollection.js')(pool);
const getWords = require('../helpers/getWords.js')(pool);

let id;

tape('updateCollection', (t) => {
  flushDb()
    .then(() => registerUser({ username: 'sam', password: 'asdf' }))
    .then(() => createCollection({
      username: 'sam',
      collection_name: 'hi',
      collection_description: 'desc'
    }))
    .then(() => getCollections('sam'))
    .then((res) => {
      t.equal(res.length, 1);
      t.equal(res[0].collection_id, '100');
      t.equal(res[0].collection_name, 'hi');
      t.equal(res[0].collection_description, 'desc');

      id = res[0].collection_id;

      const collectionObj = {
        collection_id: id,
        collection_description: 'new description',
        new_words: [
          {
            direction: 'deToEn',
            source_word: 'Wiedersehen',
            target_words: ['Bye']
          },
          {
            direction: 'enToDe',
            source_word: 'hello',
            target_words: ['hallo', 'Guten Tag']
          }
        ]
      };

      return updateCollection(collectionObj);
    })
    .then(() => getCollections('sam'))
    .then((res) => {
      t.equal(res.length, 1);
      t.equal(res[0].collection_name, 'hi');
      t.equal(res[0].collection_description, 'new description');
      return getWords(id);
    })
    .then((res) => {
      t.equal(res.length, 2);
      t.equal(res[0].word_id, '100');
      t.equal(res[0].collection_id, '100');
      t.equal(res[0].direction, 'deToEn');
      t.equal(res[0].source_word, 'Wiedersehen');
      t.deepEqual(res[0].target_words, [ 'Bye' ]);
      t.equal(res[1].word_id, '101');
      t.equal(res[1].collection_id, '100');
      t.equal(res[1].direction, 'enToDe');
      t.equal(res[1].source_word, 'hello');
      t.deepEqual(res[1].target_words, [ 'hallo', 'Guten Tag']);

      const collectionObj = {
        collection_id: id,
        update_words: {
          '101': {
            target_words: [ 'hallo' ],
            hint: 'my first hint',
            score: 5.6
          }
        },
        delete_words: ['100']
      };

      return updateCollection(collectionObj);
    })
    .then(() => getWords('100'))
    .then((res) => {
      t.equal(res.length, 1);
      t.equal(res[0].word_id, '101');
      t.equal(res[0].collection_id, '100');
      t.equal(res[0].direction, 'enToDe');
      t.equal(res[0].source_word, 'hello');
      t.deepEqual(res[0].target_words, [ 'hallo' ]);
      t.equal(res[0].hint, 'my first hint');
      t.equal(res[0].score, 5.6);
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

const tape = require('tape');
const pg = require('pg')
const assert = require('assert');
const bluebird = require('bluebird');
const redis = require('redis');

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

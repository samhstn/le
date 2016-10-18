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
const updateCollection = require('../helpers/updateCollection.js')(pool);
const getCollections = require('../helpers/getCollections.js')(pool);
const getWords = require('../helpers/getWords.js')(pool);

tape('getWords', (t) => {
  const createCollectionObj = {
    username: 'sam',
    collection_name: 'coll',
    collection_description: 'desc'
  };

  const updateCollectionObj = {
    collection_name: 'sams collection',
    new_words: [
      {
        direction: 'enToDe',
        source_word: 'hello',
        target_words: ['hi', 'hallo']
      }
    ]
  };

  const userObj = { username: 'sam', password: 'pass' };

  let collection_id;

  flushDb()
    .then(() => registerUser(userObj))
    .then(() => createCollection(createCollectionObj))
    .then(() => getCollections('sam'))
    .then((res) => {
      collection_id = res[0].collection_id;
      t.equal(res.length, 1);
      t.equal(res[0].collection_id, '100');
      t.equal(res[0].collection_name, 'coll');
      t.equal(res[0].collection_description, 'desc');
      return updateCollection(Object.assign(updateCollectionObj, { collection_id }));
    })
    .then(() => getCollections('sam'))
    .then((res) => {
      t.equal(res.length, 1);
      t.equal(res[0].collection_description, 'desc');
      t.equal(res[0].collection_id, '100');
      t.equal(res[0].collection_name, 'sams collection');
      return getWords(collection_id);
    })
    .then((res) => {
      t.equal(res.length, 1);
      t.equal(res[0].collection_id, '100');
      t.equal(res[0].direction, 'enToDe');
      t.equal(res[0].source_word, 'hello');
      t.deepEqual(res[0].target_words, [ 'hi', 'hallo' ]);
      t.equal(res[0].word_id, '100')
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

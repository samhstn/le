const tape = require('tape');
const assert = require('assert');

const server = require('../../../server/server.js');
const redisCli = server.app.redisCli;
const pool = server.app.pool;

const flushDb = require('../../helpers/flushDb.js')(pool, redisCli);
const authenticate = require('../../helpers/authenticate.js')(pool, redisCli);
const registerUser = require('../../../db/pg/registerUser.js');
const createCollection = require('../../../db/pg/createCollection.js')(pool);
const getWords = require('../../../db/pg/getWords.js')(pool);
const updateCollection = require('../../../db/pg/updateCollection.js')(pool);
const getCollectionWithWords = require('../../../db/pg/getCollectionWithWords.js')(pool);

tape('GET :: /api/startDate', (t) => {
  const options = {
    method: 'get',
    url: '/api/startDate'
  };

  let headers;

  flushDb()
    .then(() => authenticate({ username: 'sam', password: 'pass' }))
    .then((_headers) => {
      headers = _headers;
      return server.inject(Object.assign(options, { headers }));
    })
    .then((res) => {
      t.equal(res.statusCode, 200);
      t.ok(Date.now() - JSON.parse(res.payload).startDate > 0);
      
      t.end();
    })
    .catch((err) => assert(err));
});

tape('POST :: /api/updateScores', (t) => {
  const options = {
    method: 'post',
    url: '/api/updateScores'
  };

  let headers;

  flushDb()
    .then(() => registerUser(pool, { username: 'other', password: 'otherpass' }))
    .then(() => createCollection({ username: 'other', collection_name: 'otherColl', collection_description: 'd' }))
    .then(() => {
      const collectionObj = {
        collection_id: '100',
        new_words: [
          {
            direction: 'deToEn',
            source_word: 'Wiedersehen',
            target_words: [ 'Bye' ]
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
            score: 9.5
          }
        }
      };

      return updateCollection(collectionObj);
    })
    .then(() => authenticate({ username: 'sam', password: 'pass' }))
    .then((_headers) => {
      headers = _headers;

      return createCollection({ username: 'sam', collection_name: 'sams col', collection_description: 'desc' });
    })
    .then(() => {
      const collectionObj = {
        collection_id: '101',
        new_words: [
          {
            direction: 'deToEn',
            source_word: 'Wiedersehen',
            target_words: [ 'Bye' ]
          }
        ]
      };

      return updateCollection(collectionObj);
    })
    .then(() => {
      const collectionObj = {
        collection_id: '101',
        update_words: {
          '101': {
            score: 9.5
          }
        }
      };

      return updateCollection(collectionObj);
    })
    .then(() => server.inject(Object.assign(options, { headers, payload: { type: 'hour' } })))
    .then((res) => {
      t.equal(res.statusCode, 200);
      t.equal(JSON.parse(res.payload).message, 'Scores updated');
      t.ok(JSON.parse(res.payload).info.updated);

      return getCollectionWithWords('100');
    })
    .then((res) => {
      t.equal(res.words[0].word_id, '100');
      t.equal(res.words[0].score, 9.5);

      return getCollectionWithWords('101');
    })
    .then((res) => {
      t.equal(res.words[0].word_id, '101');
      t.equal(res.words[0].score, 8.5);

      t.end();
    })
    .catch((err) => assert(err));
});

tape.onFinish(() => {
  pool.end();
  redisCli.quit();
  clearInterval(server.app.interval);
});

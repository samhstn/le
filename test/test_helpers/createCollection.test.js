const tape = require('tape');
const assert = require('assert');

const redisCli = require('./configureRedis.js');
const pg = require('./configurePool.js');
const pool = new pg.pool(pg.config);

const flushDb = require('../helpers/flushDb.js')(pool, redisCli);
const registerUser = require('../helpers/registerUser.js')(pool, redisCli);
const createCollection = require('../helpers/createCollection.js')(pool);

tape('createCollection', (t) => {
  const collectionObj = {
    username: 'sam',
    collection_name: 'colllll',
    collection_description: 'another coll'
  };

  flushDb()
    .then(() => registerUser({ username: 'sam', password: 'pass' }))
    .then(() => createCollection(collectionObj))
    .then((res) => {
      return new Promise((resolve) => {
        pool.connect((_, client, done) => {
          client.query(
            'select * from collection_table',
            (_, data) => {
              done();
              resolve(data);
            }
          );
        });
      });
    })
    .then((res) => {
      t.equal(res.rows[0].collection_name, 'colllll');
      t.equal(res.rows[0].collection_description, 'another coll')
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

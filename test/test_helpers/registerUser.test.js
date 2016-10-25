const tape = require('tape');
const assert = require('assert');

const redisCli = require('./configureRedis.js');
const pg = require('./configurePool.js');
const pool = new pg.pool(pg.config);

const flushDb = require('../helpers/flushDb.js')(pool, redisCli);
const registerUser = require('../helpers/registerUser.js')(pool);

function getUsers () {
  return new Promise((resolve, reject) => {
    pool.connect((connectionErr, client, done) => {
      if (connectionErr) {
        return reject(connectionErr);
      }

      client.query(
        'select username from user_table',
        (selectErr, data) => {
          done();
          if (selectErr) {
            return reject(selectErr);
          }

          resolve(data);
        }
      );
    });
  });
}

tape('registerUser', (t) => {
  flushDb()
    .then(() => getUsers())
    .then((data) => {
      t.equal(data.rows.length, 0);
      return registerUser({ username: 'sam', password: 'pass' });
    })
    .then(() => getUsers())
    .then((data) => {
      t.equal(data.rows.length, 1);
      t.equal(data.rows.map((u) => u.username)[0], 'sam');
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


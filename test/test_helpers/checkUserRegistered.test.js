const tape = require('tape');
const assert = require('assert');

const redisCli = require('./configureRedis.js');
const pg = require('./configurePool.js');
const pool = new pg.pool(pg.config);

const flushDb = require('../helpers/flushDb.js')(pool, redisCli);
const setupPool = require('../helpers/setupPool.js')(pool);
const checkUserRegistered = require('../helpers/checkUserRegistered.js')(pool);

tape('checkUserRegistered with no user registered', (t) => {
  flushDb()
    .then(() => checkUserRegistered('sam'))
    .then((res) => {
      t.equal(res, false);
      t.end();
    })
    .catch((err) => {
      assert(!err, err);
    });
});

tape('checkUserRegistered with user registered', (t) => {
  flushDb()
    .then(setupPool)
    .then((_) => {
      return new Promise((resolve, reject) => {
        _.client.query(
          'insert into user_table (username, password) values ($1,$2)',
          ['sam', 'pass'],
          (err) => {
            _.done();
            if (err) {
              return reject(err);
            }

            resolve('sam');
          }
        );
      });
    })
    .then(checkUserRegistered)
    .then((res) => {
      t.equal(res, true);
      t.end();
    })
    .catch((err) => {
      assert(!err, err);
    });
});

tape.onFinish(() => {
  flushDb()
    .then(() => {
      pool.end();
      redisCli.quit();
    });
});

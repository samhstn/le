const tape = require('tape');
const assert = require('assert');

const redisCli = require('./configureRedis.js');
const pg = require('./configurePool.js');
const pool = new pg.pool(pg.config);

const flushDb = require('../helpers/flushDb.js')(pool, redisCli);
const checkUserLoggedInWRedis = require('../helpers/checkUserLoggedInWRedis.js')(redisCli);

tape('checkUserLoggedInWRedis with no user logged in', (t) => {
  flushDb()
    .then(() => checkUserLoggedInWRedis('sam'))
    .then((res) => {
      t.equal(res, false);
      t.end();
    })
    .catch((err) => assert(!err, err));
});

tape('checkUserLoggedInWRedis with user logged in', (t) => {
  flushDb()
    .then(() => {
      return redisCli.setAsync('sam', 'pass');
    })
    .then(() => checkUserLoggedInWRedis('sam'))
    .then((res) => {
      t.equal(res, true);
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

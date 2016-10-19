const tape = require('tape');
const assert = require('assert');

const redisCli = require('./configureRedis.js');
const pg = require('./configurePool.js');
const pool = new pg.pool(pg.config);

const flushDb = require('../helpers/flushDb.js')(pool, redisCli);
const loginUserWRedis = require('../helpers/loginUserWRedis.js')(redisCli);

tape('loginUserWRedis', (t) => {
  flushDb()
    .then(() => redisCli.keysAsync('*'))
    .then((data) => {
      t.equal(data.length, 0);
      return loginUserWRedis({ username: 'sam', key: 'key' });
    })
    .then(() => redisCli.keysAsync('*'))
    .then((data) => {
      t.equal(data.length, 1);
      t.equal(data[0], 'sam');
      t.end();
    })
    .catch((err) => assert(!err, err));
});

tape('loginUserWRedis with bad payload', (t) => {
  flushDb()
    .then(() => loginUserWRedis({ username: 'sam', password: 'password' }))
    .catch((err) => {
      t.equal(err, 'no key in loginUserWRedis payload');
      t.end();
    });
});

tape.onFinish(() => {
  flushDb()
    .then(() => {
      pool.end();
      redisCli.quit();
    });
});

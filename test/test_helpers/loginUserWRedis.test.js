const tape = require('tape');
const pg = require('pg')
const assert = require('assert');
const bluebird = require('bluebird');
const redis = require('redis');

const pgConfig = require('../../config.js').pg;
const pool = new pg.Pool(pgConfig);

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const redisConfig = require('../../config.js').redis;
const redisCli = redis.createClient(redisConfig);

const flushDb = require('../helpers/flushDb.js')(pool, redisCli);
const loginUserWRedis = require('../helpers/loginUserWRedis.js')(redisCli);

tape('loginUserWRedis', (t) => {
  flushDb()
    .then(() => redisCli.keysAsync('*'))
    .then((data) => {
      t.equal(data.length, 0);
      return loginUserWRedis({ username: 'sam', password: 'pass' });
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
    .then(() => loginUserWRedis({ username: 'sam', key: 'key' }))
    .catch((err) => {
      t.equal(err, 'no password in loginUserWRedis payload');
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

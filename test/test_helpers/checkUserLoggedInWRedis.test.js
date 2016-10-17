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

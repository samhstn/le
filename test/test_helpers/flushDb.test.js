const tape = require('tape');
const pg = require('pg')
const redis = require('redis');
const bluebird = require('bluebird');
const assert = require('assert');

const pgConfig = require('../../config.js').pg;
const pool = new pg.Pool(pgConfig);

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const redisConfig = require('../../config.js').redis;
const redisCli = redis.createClient(redisConfig);

const flushDb = require('../helpers/flushDb.js')(pool, redisCli);
const setupPool = require('../helpers/setupPool.js')(pool);

function rejectErr (err, reject) {
  if (err) {
    reject(err);
  }
}

tape('flush db clears pg database', (t) => {
  flushDb()
    .then(setupPool)
    .then((_) => {
      return new Promise((resolve, reject) => {
        _.client.query(
          'select * from user_table',
          (err, data) => {
            rejectErr(err, reject);
            t.equal(data.rows.length, 0, 'pg database is empty');
            resolve({ client: _.client, done: _.done });
          }
        );
      });
    })
    .then((_) => {
      return new Promise((resolve, reject) => {
        _.client.query(
          'insert into user_table (username, password) values ($1,$2)',
          ['sam', 'pass'],
          (err) => {
            rejectErr(err, reject);
            resolve({ client: _.client, done: _.done });
          }
        );
      });
    })
    .then((_) => {
      return new Promise((resolve, reject) => {
        _.client.query(
          'select * from user_table',
          (err, data) => {
            _.done();
            t.equal(data.rows.length, 1, 'pg database contains data');
            rejectErr(err, reject);
            resolve();
          }
        )
      });
    })
    .then(flushDb)
    .then(() => {
      return new Promise((resolve, reject) => {
        pool.connect((err, client, done) => {
          rejectErr(err, reject);
          resolve({ client, done });
        });
      });
    })
    .then((_) => {
      return new Promise((resolve, reject) => {
        _.client.query(
          'select * from user_table',
          (err, data) => {
            _.done();
            rejectErr(err, reject)
            t.equal(data.rows.length, 0, 'pg database is cleared by flushDb');
            t.end();
          }
        );
      });
    })
    .catch((err) => assert(!err, err));
});

tape('flushDb clears the redis database', (t) => {
  flushDb()
    .then(() => redisCli.keysAsync('*'))
    .then((keys) => {
      t.equal(keys.length, 0, 'redis db is empty');
      return redisCli.set('key', 'value')
    })
    .then(() => redisCli.keysAsync('*'))
    .then((keys) => {
      t.equal(keys.length, 1, 'redis db has data');
      return flushDb();
    })
    .then(() => redisCli.keysAsync('*'))
    .then((keys) => {
      t.equal(keys.length, 0, 'redis db is cleared by flushDb');
      t.end();
    })
    .catch((err) => assert(!err, err));
});

tape.onFinish(() => {
  pool.end();
  redisCli.quit();
});

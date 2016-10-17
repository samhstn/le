const tape = require('tape');
const pg = require('pg')
const assert = require('assert');
const bluebird = require('bluebird');
const redis = require('redis');

const server = require('../../server/server.js');

const pool = server.app.pool;
const redisCli = server.app.redisCli;

const flushDb = require('../helpers/flushDb.js')(pool, redisCli);
const authenticate = require('../helpers/authenticate.js')(pool, redisCli);

tape('authenticate', (t) => {
  flushDb()
    .then(() => authenticate({ username: 'sam', password: 'asdf' }))
    .then((headers) => server.inject({ method: 'get', url: '/', headers }))
    .then((res) => {
      t.equal(res.statusCode, 200);
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

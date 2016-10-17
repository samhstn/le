const tape = require('tape');
const assert = require('assert');

const server = require('../../server/server.js');
const redisCli = server.app.redisCli;
const pool = server.app.pool;

const flushDb = require('../helpers/flushDb.js')(pool, redisCli);
const checkUserRegistered = require('../helpers/checkUserRegistered.js')(pool);

tape('POST :: /register', (t) => {
  const options = {
    method: 'post',
    url: '/api/register'
  };

  flushDb()
    .then(() => server.inject(options))
    .then((res) => {
      t.equal(res.statusCode, 400);
      t.equal(JSON.parse(res.payload).message, '"value" must be an object');
      return server.inject(Object.assign(options, { payload: {} }));
    })
    .then((res) => {
      const payload = { username: 'sam' };
      t.equal(res.statusCode, 400);
      t.equal(
        JSON.parse(res.payload).message,
        'child "username" fails because ["username" is required]'
      );
      return server.inject(Object.assign(options, { payload }));
    })
    .then((res) => {
      const payload = { username: 'sam', password: 'pass' };
      t.equal(res.statusCode, 400);
      t.equal(
        JSON.parse(res.payload).message,
        'child "password" fails because ["password" is required]'
      );
      return server.inject(Object.assign(options, { payload }));
    })
    .then((res) => {
      t.equal(res.statusCode, 302);
      t.equal(res.headers.location, '/register/registered=true');
      return checkUserRegistered('sam')
    })
    .then((res) => {
      t.ok(res);
      t.end();
    })
    .catch((err) => assert(!err, err));
});

tape.onFinish(() => {
  redisCli.quit();
  pool.end();
});

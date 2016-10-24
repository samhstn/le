const tape = require('tape');
const assert = require('assert');

const server = require('../../../server/server.js');
const redisCli = server.app.redisCli;
const pool = server.app.pool;

const flushDb = require('../../helpers/flushDb.js')(pool, redisCli);
const checkUserRegistered = require('../../helpers/checkUserRegistered.js')(pool);
const registerUser = require('../../helpers/registerUser.js')(pool);
const checkUserLoggedInWRedis = require('../../helpers/checkUserLoggedInWRedis.js')(redisCli);

tape('POST :: /login', (t) => {
  const options = {
    method: 'post',
    url: '/api/login'
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
      t.equal(res.headers.location, '/login/user_not_registered=true&user=sam');
      return registerUser({ username: 'sam', password: 'pass' });
    })
    .then(() => checkUserRegistered('sam'))
    .then((res) => {
      t.ok(res, 'user has been registered');
    })
    .then(() => {
      const payload = { username: 'sam', password: 'wrongpass' };
      return server.inject(Object.assign(options, { payload }));
    })
    .then((res) => {
      t.equal(res.statusCode, 302);
      t.equal(res.headers.location, '/login/incorrect_pass=true&user=sam');
    })
    .then(() => {
      const payload = { username: 'sam', password: 'pass' };
      return server.inject(Object.assign(options, { payload }));
    })
    .then((res) => {
      t.equal(res.statusCode, 302);
      t.equal(res.headers.location, '/');
      t.equal(res.headers['set-cookie'][0].substring(0, 7), 'cookie=');
      return checkUserLoggedInWRedis('sam');
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
  clearInterval(server.app.interval);
});

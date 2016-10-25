const tape = require('tape');
const assert = require('assert');

const server = require('../../../server/server.js');
const redisCli = server.app.redisCli;
const pool = server.app.pool;

const flushDb = require('../../helpers/flushDb.js')(pool, redisCli);
const checkUserRegistered = require('../../helpers/checkUserRegistered.js')(pool);
const checkUserLoggedInWRedis = require('../../helpers/checkUserLoggedInWRedis.js')(redisCli);

tape('POST :: /login', (t) => {
  const loginOpts = {
    method: 'post',
    url: '/api/login',
    payload: {
      username: 'daBoss',
      password: 'maBling'
    }
  };

  const registerOpts = {
    method: 'post',
    url: '/api/register',
    payload: {
      username: 'daBoss',
      password: 'maBling'
    }
  };

  const logoutOpts = {
    method: 'post',
    url: '/api/logout'
  };

  let cookie;

  flushDb()
    .then(() => server.inject(registerOpts))
    .then((res) => {
      t.equal(res.statusCode, 302, '0Ad1FRuChh');
      t.equal(res.headers.location, '/register/registered=true', '0Ad1FRuChh');
      return checkUserRegistered('daBoss');
    })
    .then((res) => {
      t.ok(res, 'GbGzKqAzZE');
      return server.inject(loginOpts);
    })
    .then((res) => {
      t.equal(res.statusCode, 302, '0Ad1FRuChh');
      t.equal(res.headers.location, '/', '0Ad1FRuChh');
      t.equal(res.headers['set-cookie'][0].substring(0, 7), 'cookie=', '0Ad1FRuChh');
      cookie = res.headers['set-cookie'][0].split(';')[0];
      return checkUserLoggedInWRedis('daBoss');
    })
    .then((res) => {
      t.ok(res, 'GbGzKqAzZE');
      return server.inject(Object.assign(logoutOpts, { headers: { cookie } }));
    })
    .then((res) => {
      t.equal(res.statusCode, 200, '0Ad1FRuChh');
      t.equal(
        res.headers['set-cookie'][0],
        'cookie=; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict'
      );
      t.deepEqual(JSON.parse(res.payload), { logout: true }, 'YvRFGhj0N9');
      return checkUserLoggedInWRedis('daBoss');
    })
    .then((res) => {
      t.notOk(res, 'iD6yh5Ozrt');
      t.end();
    })
    .catch((err) => assert(!err, err));
});

tape.onFinish(() => {
  redisCli.quit();
  pool.end();
  clearInterval(server.app.interval);
});

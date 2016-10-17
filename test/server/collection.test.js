const tape = require('tape');
const assert = require('assert');

const server = require('../../server/server.js');
const redisCli = server.app.redisCli;
const pool = server.app.pool;

const flushDb = require('../helpers/flushDb.js')(pool, redisCli);
const authenticate = require('../helpers/authenticate.js')(pool, redisCli);

tape('GET :: /api/collection', (t) => {
  const options = {
    method: 'get',
    url: '/api/collection'
  };

  flushDb()
    .then(() => server.inject(options))
    .then((res) => {
      t.equal(res.statusCode, 302);
      t.equal(res.headers.location, '/login/timeout=true');
      return authenticate({ username: 'sam', password: 'pass' });
    })
    .then((headers) => {
      return server.inject(Object.assign(options, { headers }));
    })
    .then((res) => {
      t.equal(res.statusCode, 200);
      t.end();
    });
});

tape.onFinish(() => {
  redisCli.quit();
  pool.end();
});

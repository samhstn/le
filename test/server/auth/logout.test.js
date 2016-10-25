const tape = require('tape');
const assert = require('assert');

const server = require('../../../server/server.js');
const redisCli = server.app.redisCli;
const pool = server.app.pool;

const flushDb = require('../../helpers/flushDb.js')(pool, redisCli);
const checkUserLoggedInWRedis = require('../../helpers/checkUserLoggedInWRedis.js')(redisCli);
const loginUserWRedis = require('../../helpers/loginUserWRedis.js')(redisCli);

tape('POST :: /logout', (t) => {
  const key = '267f666bf2496696fa299e20e6c3e6d84c4ac0fafdc1d389d585fc65c2606a7e';
  const userObj = { username: 'steve', key };
  const cookie = Buffer.from(JSON.stringify(userObj)).toString('base64');
  const options = {
    method: 'post',
    url: '/api/logout',
    headers: {
      cookie: 'cookie=' + cookie
    }
  };

  flushDb()
    .then(() => loginUserWRedis({ username: 'steve', key }))
    .then(() => checkUserLoggedInWRedis('steve'))
    .then((res) => {
      t.ok(res, 'LXiZUj3K1g');
      return server.inject(options);
    })
    .then((res) => {
      t.equal(res.statusCode, 200, 'QHb5OyrxL8');
      t.deepEqual(JSON.parse(res.payload), { logout: true }, 'OqKSV3st7m');
      t.equal(
        res.headers['set-cookie'][0],
        'cookie=; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict'
      );
      t.end();
    })
    .catch((err) => assert(!err, err));
});

tape.onFinish(() => {
  redisCli.quit();
  pool.end();
  clearInterval(server.app.interval);
});

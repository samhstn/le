const tape = require('tape');
const assert = require('assert');

const server = require('../../server/server.js');
const redisCli = server.app.redisCli;
const pool = server.app.pool;

const flushDb = require('../helpers/flushDb.js')(pool, redisCli);
const authenticate = require('../helpers/authenticate.js')(pool, redisCli);
const getCollections = require('../helpers/getCollections.js')(pool);
const storeCollection = require('../helpers/storeCollection.js')(pool);

tape('POST :: /api/collection', (t) => {
  const options = {
    method: 'post',
    url: '/api/collection',
    payload: {
      collection_name: 'collection1',
      collection_description: 'my first collection'
    }
  };

  const userObj = { username: 'sam', password: 'pass' };

  flushDb()
    .then(() => authenticate(userObj))
    .then((headers) => server.inject(Object.assign(options, { headers })))
    .then((res) => {
      t.equal(res.statusCode, 200);
      t.equal(JSON.parse(res.payload).message, 'New collection created');
      t.ok(JSON.parse(res.payload).info.created);
      return getCollections(userObj.username);
    })
    .then((res) => {
      t.equal(res.length, 1);
      t.equal(res[0].collection_name, 'collection1');
      t.equal(res[0].collection_description, 'my first collection');
      t.end();
    })
    .catch((err) => assert(!err, err));
});

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

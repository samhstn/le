const tape = require('tape');
const assert = require('assert');

const server = require('../../../server/server.js');
const redisCli = server.app.redisCli;
const pool = server.app.pool;

const flushDb = require('../../helpers/flushDb.js')(pool, redisCli);
const authenticate = require('../../helpers/authenticate.js')(pool, redisCli);
const updateSettings = require('../../../db/pg/updateSettings.js')(pool);
const getSettings = require('../../../db/pg/getSettings.js')(pool);

tape('GET :: /api/settings', (t) => {
  const options = {
    method: 'get',
    url: '/api/settings'
  };

  let headers;

  flushDb()
    .then(() => server.inject(options))
    .then((res) => {
      t.equal(res.statusCode, 302, 'hFfkpF8v4c');
      t.equal(res.headers.location, '/login/timeout=true', 'hFfkpF8v4c');

      return authenticate({ username: 'sam', password: 'pass' });
    })
    .then((_headers) => {
      headers = _headers;

      return server.inject(Object.assign(options, { headers }))
    })
    .then((res) => {
      t.equal(res.statusCode, 200, 'hFfkpF8v4c');
      const settingsKeys = [
        'decrease_per_hour',
        'decrease_per_day',
        'correct_answer_increase',
        'incorrect_answer_decrease'
      ];
      t.deepEqual(Object.keys(JSON.parse(res.payload).settings), settingsKeys, 'hL7NDKwyRd');
      settingsKeys.forEach((key) => {
        t.equal(JSON.parse(res.payload).settings[key], '1', 'hFfkpF8v4c');
      });

      const settingsObj = {
        'sam': {
          decrease_per_hour: 1,
          decrease_per_day: 3,
          correct_answer_increase: 1,
          incorrect_answer_decrease: 5
        }
      };

      return updateSettings(settingsObj);
    })
    .then(() => server.inject(Object.assign(options, { headers })))
    .then((res) => {
      t.equal(res.statusCode, 200, 'hFfkpF8v4c');
      const settingsPayload = JSON.parse(res.payload).settings;
      const settingsKeys = [
        'decrease_per_hour',
        'decrease_per_day',
        'correct_answer_increase',
        'incorrect_answer_decrease'
      ];
      t.deepEqual(Object.keys(settingsPayload), settingsKeys, 'hL7NDKwyRd');
      t.equal(settingsPayload.decrease_per_hour, '1', 'hFfkpF8v4c');
      t.equal(settingsPayload.decrease_per_day, '3', 'hFfkpF8v4c');
      t.equal(settingsPayload.correct_answer_increase, '1', 'hFfkpF8v4c');
      t.equal(settingsPayload.incorrect_answer_decrease, '5', 'hFfkpF8v4c');

      t.end();
    })
    .catch((err) => assert(!err, err));
});

tape('PUT :: /api/settings', (t) => {
  const options = {
    method: 'put',
    url: '/api/settings'
  };

  let headers;

  flushDb()
    .then(() => server.inject(options))
    .then((res) => {
      t.equal(res.statusCode, 302, 'hFfkpF8v4c');
      t.equal(res.headers.location, '/login/timeout=true', 'hFfkpF8v4c');

      return authenticate({ username: 'sam', password: 'pass' });
    })
    .then((_headers) => {
      headers = _headers;

      const payload = {
        decrease_per_hour: 1,
        correct_answer_increase: 5,
        incorrect_answer_decrease: 6
      };

      return server.inject(Object.assign(options, { headers, payload }))
    })
    .then((res) => {
      t.equal(res.statusCode, 200, 'hFfkpF8v4c');
      t.equal(JSON.parse(res.payload).message, 'Settings updated', 'hFfkpF8v4c');
      t.ok(JSON.parse(res.payload).info.updated, 'so12J29jQ2');

      return getSettings('sam');
    })
    .then((res) => {
      t.equal(res[0].decrease_per_hour, '1', 'hFfkpF8v4c');
      t.equal(res[0].decrease_per_day, '1', 'hFfkpF8v4c');
      t.equal(res[0].correct_answer_increase, '5', 'hFfkpF8v4c');
      t.equal(res[0].incorrect_answer_decrease, '6', 'hFfkpF8v4c');
      t.end();
    })
    .catch((err) => assert(!err, err));
});

tape.onFinish(() => {
  redisCli.quit();
  pool.end();
  clearInterval(server.app.interval);
});

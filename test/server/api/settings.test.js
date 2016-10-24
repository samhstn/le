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
      t.equal(res.statusCode, 302);
      t.equal(res.headers.location, '/login/timeout=true');

      return authenticate({ username: 'sam', password: 'pass' });
    })
    .then((_headers) => {
      headers = _headers;

      return server.inject(Object.assign(options, { headers }))
    })
    .then((res) => {
      t.equal(res.statusCode, 200);
      const settingsKeys = [
        'decrease_per_hour',
        'decrease_per_day',
        'correct_answer_increase',
        'incorrect_answer_decrease'
      ];
      t.deepEqual(Object.keys(JSON.parse(res.payload).settings), settingsKeys);
      settingsKeys.forEach((key) => {
        t.equal(JSON.parse(res.payload).settings[key], '1');
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
      t.equal(res.statusCode, 200);
      const settingsPayload = JSON.parse(res.payload).settings;
      const settingsKeys = [
        'decrease_per_hour',
        'decrease_per_day',
        'correct_answer_increase',
        'incorrect_answer_decrease'
      ];
      t.deepEqual(Object.keys(settingsPayload), settingsKeys);
      t.equal(settingsPayload.decrease_per_hour, '1');
      t.equal(settingsPayload.decrease_per_day, '3');
      t.equal(settingsPayload.correct_answer_increase, '1');
      t.equal(settingsPayload.incorrect_answer_decrease, '5');

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
      t.equal(res.statusCode, 302);
      t.equal(res.headers.location, '/login/timeout=true');

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
      t.equal(res.statusCode, 200);
      t.equal(JSON.parse(res.payload).message, 'Settings updated');
      t.ok(JSON.parse(res.payload).info.updated);

      return getSettings('sam');
    })
    .then((res) => {
      t.equal(res[0].decrease_per_hour, '1');
      t.equal(res[0].decrease_per_day, '1');
      t.equal(res[0].correct_answer_increase, '5');
      t.equal(res[0].incorrect_answer_decrease, '6');
      t.end();
    })
    .catch((err) => assert(!err, err));
});

tape.onFinish(() => {
  redisCli.quit();
  pool.end();
  clearInterval(server.app.interval);
});

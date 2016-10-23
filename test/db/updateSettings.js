const tape = require('tape');
const assert = require('assert');

const redisCli = require('../test_helpers/configureRedis.js');
const pg = require('../test_helpers/configurePool.js');
const pool = new pg.pool(pg.config);

const flushDb = require('../helpers/flushDb.js')(pool, redisCli);
const registerUser = require('../helpers/registerUser.js')(pool);
const updateSettings = require('../../db/pg/updateSettings.js')(pool);

const getSettings = (username) => {
  return new Promise((resolve, reject) => {
    pool.connect((connectErr, client, done) => {
      if (connectErr) {
        return reject(connectErr);
      }

      client.query(
        'select * from user_table '
        + 'where username = $1'
        [ username ],
        (selectErr, data) => {
        done();
          if (selectErr) {
            return reject(selectErr);
          }

          resolve(data.rows);
        }
      );
    });
  });
}

tape('updateSettings', (t) => {
  flushDb()
    .then(() => registerUser({ username: 'sam', password: 'asdf' }))
    .then(() => updateSettings({
      'sam': {
        decrease_per_hour: 1,
        decrease_per_day: 3,
        correct_answer_increase: 1,
        incorrect_answer_decrease: 1
      }
    }))
    .then(() => getSettings('sam'))
    .then((res) => {
      t.equal(res.length, 1);
      t.equal(res[0].decrease_per_hour, '1');
      t.equal(res[0].decrease_per_day, '3');
      t.equal(res[0].correct_answer_increase, '1');
      t.equal(res[0].incorrect_answer_decrease, '1');
      t.end();
    })
    .catch((err) => assert(err));
});

tape.onFinish(() => {
  flushDb()
    .then(() => {
      pool.end();
      redisCli.quit();
    });
});

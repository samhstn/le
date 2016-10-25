const tape = require('tape');
const assert = require('assert');
const redisCli = require('../test_helpers/configureRedis.js');
const pg = require('../test_helpers/configurePool.js');
const pool = new pg.pool(pg.config);

const flushDb = require('../helpers/flushDb.js')(pool, redisCli);
const registerUser = require('../helpers/registerUser.js')(pool, redisCli);
const updateSettings = require('../../db/pg/updateSettings.js')(pool);
const getSettings = require('../../db/pg/getSettings.js')(pool);

tape('getSettings', (t) => {
  flushDb()
    .then(() => {
      return registerUser({ username: 'sam', password: 'asdf' });
    })
    .then(() => {
      return updateSettings({
        'sam': {
          decrease_per_hour: 1,
          decrease_per_day: 3,
          correct_answer_increase: 1,
          incorrect_answer_decrease: 1
        }
      })
    })
    .then(() => {
      return getSettings('sam');
    })
    .then((res) => {
      t.equal(res.length, 1, 'Df3HgmRx0T');
      t.equal(res[0].decrease_per_hour, '1', 'Df3HgmRx0T');
      t.equal(res[0].decrease_per_day, '3', 'Df3HgmRx0T');
      t.equal(res[0].correct_answer_increase, '1', 'Df3HgmRx0T');
      t.equal(res[0].incorrect_answer_decrease, '1', 'Df3HgmRx0T');

      t.end();
    })
    .catch((err) => assert(err));
});

tape.onFinish(() => {
  redisCli.quit();
  pool.end();
});

module.exports = (pool) => (username) => {
  return new Promise((resolve, reject) => {
    if (!username) {
      return reject('Username is not defined');
    }

    pool.connect((connectErr, client, done) => {
      if (connectErr) {
        done();
        return reject(connectErr);
      }

      client.query(
        'select '
        + 'decrease_per_hour, '
        + 'decrease_per_day, '
        + 'correct_answer_increase, '
        + 'incorrect_answer_decrease '
        + 'from user_table where username = $1',
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

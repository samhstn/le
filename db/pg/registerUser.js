module.exports = (pool, username, password, cb) => {
  pool.connect((connectErr, client, done) => {
    if (connectErr) {
      return cb('connection err');
    }

    client.query(
      'select username from user_table',
      (selectErr, data) => {
        if (selectErr) {
          return cb(selectErr);
        }

        if (data.rows.map((u) => u.username).indexOf(username) > -1) {
          done();
          return cb(false, 'username not available');
        }

        client.query(
          'insert into user_table (username, password) values ($1, $2)',
          [username, password],
          (insertErr) => {
            done();
            if (insertErr) {
              return cb(insertErr);
            }

            cb();
          }
        );
      }
    );
  });
};

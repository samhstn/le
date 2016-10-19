module.exports = (pool, creds) => {
  return new Promise((resolve, reject) => {
    pool.connect((connectErr, client, done) => {
      if (connectErr) {
        done();
        return reject('db error');
      }

      client.query(
        'select password from user_table where username = $1',
        [creds.username],
        (selectPassErr, dbPass) => {
          done();

          if (selectPassErr) {
            return reject('db error');
          }

          if (dbPass.rows[0].password !== creds.password) {
            return reject('incorrect password');
          }

          resolve();
        }
      );
    });
  });
};

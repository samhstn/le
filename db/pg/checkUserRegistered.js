module.exports = (pool, creds) => {
  return new Promise((resolve, reject) => {
    pool.connect((connectErr, client, done) => {
      if (connectErr) {
        done();
        return reject('db error');
      }

      client.query(
        'select username from user_table',
        (selectUserErr, usernames) => {
          done();

          if (selectUserErr) {
            return reject('db error');
          }

          if (!(usernames.rows.filter((u) => u.username === creds.username).length)) {
            return reject('user not registered');
          }
          
          resolve();
        }
      );
    });
  });
};

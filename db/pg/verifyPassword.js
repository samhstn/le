const bcrypt = require('bcrypt');

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

          bcrypt.compare(creds.password, dbPass.rows[0].password, (hashErr, res) => {
            if (hashErr) {
              return reject(hashErr);
            }

            if (!res) {
              return reject('incorrect password');
            }

            resolve();
          });
        }
      );
    });
  });
};

const bcrypt = require('bcrypt');

module.exports = (pool) => (userObj) => {
  return new Promise((resolve, reject) => {
    pool.connect((connectErr, client, done) => {
      if (connectErr) {
        return reject(connectErr);
      }

      bcrypt.hash(userObj.password, 10, (hashErr, hash) => {
        if (hashErr) {
          return reject(hashErr);
        }

        client.query(
          'insert into user_table (username, password) values ($1,$2)',
          [userObj.username, hash],
          (insertErr) => {
            done();
            if (insertErr) {
              return reject(insertErr);
            }

            resolve();
          }
        );
      });
    });
  });
}


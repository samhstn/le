module.exports = (pool) => (user) => {
  return new Promise((resolve, reject) => {
    pool.connect((connectErr, client, done) => {
      if (connectErr) {
        return reject(connectErr);
      }
      
      client.query(
        'select username from user_table',
        (selectErr, data) => {
          done();

          if (selectErr) {
            return reject(selectErr);
          }

          resolve(data.rows.map((u) => u.username).indexOf(user) > -1);
        }
      );
    });
  });
}


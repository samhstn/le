const assert = require('assert');

function rejectErr(err, reject) {
  if (err) {
    reject(err);
  }
}

module.exports = (pool) => {
  return function (username) {
    return new Promise((resolve, reject) => {
      if (!username) {
        return reject('Username is not defined');
      }

      pool.connect((connectErr, client, done) => {
        rejectErr(connectErr, reject, done);

        client.query(
          'select '
          + 'user_id, '
          + 'username '
          + 'from user_table '
          + 'where username = $1',
          [ username ],
          (selectIdErr, idData) => {
            rejectErr(selectIdErr, reject);

            const user_id = idData.rows[0].user_id;
            
            client.query(
              'select '
              + 'collection_name, '
              + 'collection_description, '
              + 'collection_id '
              + 'from collection_table '
              + 'where user_id = $1',
              [ user_id ],
              (selectCollErr, collData) => {
                done();
                rejectErr(selectCollErr, reject);

                resolve(collData.rows);
              }
            );
          }
        );
      });
    });
  }
}

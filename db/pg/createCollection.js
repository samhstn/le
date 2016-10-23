const assert = require('assert');

module.exports = (pool) => (collectionObj) => {
  const { username, collection_name, collection_description } = collectionObj;

  assert(username && collection_name && collection_description, 'Incorrect collection object')

  return new Promise((resolve, reject) => {
    pool.connect((connectErr, client, done) => {
      if (connectErr) {
        done();
        return reject(connectErr);
      }

      client.query(
        'select user_id from user_table where username = $1',
        [ username ],
        (selectErr, idData) => {
          if (selectErr) {
            done();
            return reject(selectErr);
          }

          if (!idData.rows.length) {
            return reject('User is not logged in');
          }

          client.query(
            'insert into collection_table ('
            + 'user_id, collection_name, collection_description'
            + ') values ($1, $2, $3)',
            [ idData.rows[0].user_id, collection_name, collection_description ],

            (collErr) => {
              done();
              if (collErr) {
                return reject(collErr);
              }

              resolve();
            }
          );
        }
      );
    });
  });
};

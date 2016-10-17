function rejectErr(err, reject) {
  if (err) {
    reject(err);
  }
}

module.exports = (pool) => {
  return function (collectionObj) {
    const username = collectionObj.username;
    const name = collectionObj.collection_name;
    const description = collectionObj.collection_description;

    return new Promise((resolve, reject) => {
      pool.connect((connectErr, client, done) => {
        rejectErr(connectErr);

        client.query(
          'select user_id from user_table where username = $1',
          [ username ],
          (selectErr, idData) => {
            rejectErr(selectErr);

            const user_id = idData.rows[0].user_id

            client.query(
              'insert into collection_table ('
              + 'user_id, collection_name, collection_description'
              + ') values ($1, $2, $3)',
              [ user_id, name, description ],
              (collErr) => {
                done();
                rejectErr(collErr, reject);

                resolve();
              }
            );
          }
        );
      });
    });
  }
}

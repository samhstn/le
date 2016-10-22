module.exports = (pool) => {
  return function (collection_id) {
    return new Promise((resolve, reject) => {
      pool.connect((connectErr, client, done) => {
        if (connectErr) {
          return reject(connectErr);
        }

        client.query(
          'delete from collection_table where collection_id = $1',
          [ collection_id ],
          (deleteErr) => {
            done();
            if (deleteErr) {
              reject(deleteErr);
            }
            resolve();
          }
        );
      });
    });
  }
}

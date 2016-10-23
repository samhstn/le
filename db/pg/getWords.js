module.exports = (pool) => (collection_id) => {
  return new Promise((resolve, reject) => {
    if (!collection_id) {
      return reject('collection id is not defined');
    }

    pool.connect((connectErr, client, done) => {
      if (connectErr) {
        done();
        return reject(connectErr);
      }

      client.query(
        'select * from word_table where collection_id = $1',
        [ collection_id ],
        (selectErr, data) => {
          done();
          if (selectErr) {
            return reject(selectErr);
          }
          
          resolve(data.rows);
        }
      );
    });
  });
};


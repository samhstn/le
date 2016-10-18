function rejectErr(err, reject) {
  if (err) {
    reject(err);
  }
}

module.exports = (pool) => {
  return function (collection_id) {
    return new Promise((resolve, reject) => {
      if (!collection_id) {
        return reject('collection id is not defined');
      }

      pool.connect((connectErr, client, done) => {
        rejectErr(connectErr, reject);

        client.query(
          'select * from word_table where collection_id = $1',
          [ collection_id ],
          (selectErr, data) => {
            done();
            rejectErr(selectErr);
            
            resolve(data.rows);
          }
        );
      });
    });
  }
}

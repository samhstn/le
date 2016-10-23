module.exports = (pool, collectionObj) => {
  if (!collectionObj.delete_words) {
    return Promise.resolve();
  }

  return Promise.all(
    collectionObj.delete_words.map((word_id) => {
      return new Promise((resolve, reject) => {
        pool.connect((connectErr, client, done) => {
          if (connectErr) {
            done();
            return reject(connectErr);
          }

          client.query(
            'delete from word_table where word_id = $1',
            [ word_id ],
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
    })
  );
}

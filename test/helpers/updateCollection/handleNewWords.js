module.exports = (pool, collectionObj) => {
  if (!collectionObj.new_words) {
    return Promise.resolve();
  }

  return Promise.all(
    collectionObj.new_words.map((word) => {
      return new Promise((resolve, reject) => {
        pool.connect((connectErr, client, done) => {
          if (connectErr) {
            return reject(connectErr);
          }

          client.query(
            'insert into word_table '
            + '(collection_id, direction, source_word, target_words) '
            + 'values ($1, $2, $3, $4)',
            [
              collectionObj.collection_id,
              word.direction,
              word.source_word,
              word.target_words
            ],
            (insertErr) => {
              done();
              if (insertErr) {
                reject(insertErr);
              }
              resolve();
            }
          );
        });
      });
    })
  );
};


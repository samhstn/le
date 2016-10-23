function format (rows) {
  const obj = {};
  rows.forEach((row) => {
    obj[row.collection_id] = {
      collection_name: row.collection_name,
      collection_description: row.collection_description
    };
  });
  return obj;
}

module.exports = (pool) => (collection_id) => {
  return new Promise((resolve, reject) => {
    pool.connect((connectErr, client, done) => {
      if (connectErr) {
        done();
        return reject(connectErr);
      }

      client.query(
        'select '
        + 'c.collection_id, c.collection_name, c.collection_description, '
        + 'w.word_id, w.direction, w.source_word, w.target_words, '
        + 'w.hint, w.attempts, w.correct_attempts, w.score '
        + 'from '
        + 'collection_table as c inner join '
        + 'word_table as w on c.collection_id = w.collection_id '
        + ' where c.collection_id = $1',
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


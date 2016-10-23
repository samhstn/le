function format (rows) {
  return {
    collection_id: rows[0].collection_id,
    collection_name: rows[0].collection_name,
    collection_description: rows[0].collection_description,
    words: rows.map((row) => ({
      word_id: row.word_id,
      direction: row.direction,
      source_word: row.source_word,
      target_words: row.target_words,
      hint: row.hint,
      attempts: row.attempts,
      correct_attempts: row.correct_attempts,
      score: row.score
    }))
  };
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
        + 'collection_table as c left outer join '
        + 'word_table as w on c.collection_id = w.collection_id '
        + ' where c.collection_id = $1',
        [ collection_id ],
        (selectErr, data) => {
          done();
          if (selectErr) {
            return reject(selectErr);
          }

          resolve(format(data.rows));
        }
      );
    });
  });
};


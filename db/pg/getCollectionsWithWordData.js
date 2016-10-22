function rejectErr(err, reject) {
  if (err) {
    reject(err);
  }
}

function format (rows) {
  const uniqueRows = rows.reduce((prev, curr) => {
    if (prev.map((r) => r.collection_id).indexOf(curr.collection_id) === -1) {
      return prev.concat(curr);
    }

    return prev;
  }, []);
  const obj = {};

  uniqueRows.forEach((row) => {
    if (!obj[row.collection_id]) {
      obj[row.collection_id] = {
        collection_name: row.collection_name,
        collection_description: row.collection_description,
        average_score: rows
          .filter((r) => r.collection_id === row.collection_id)
          .filter((r) => r.score !== null)
          .length ?
            Math.round(100 * rows
            .filter((r) => r.collection_id === row.collection_id)
            .map((obj) => obj.score)
            .reduce((prev, curr) =>  prev + (curr || 0), 0) /
              rows
                .filter((r) => r.collection_id === row.collection_id)
                .filter((r) => r.score !== null)
                .length) /100 : null,
        number_of_words: rows
          .filter((r) => r.collection_id === row.collection_id)
          .filter((r) => r.word_id)
          .length
      };
    }
  });
  return obj;
}

module.exports = (pool) => {
  return function (username) {
    return new Promise((resolve, reject) => {
      pool.connect((connectErr, client, done) => {
        rejectErr(connectErr, reject, done);

        client.query(
          'select '
          + 'c.collection_id, c.collection_name, c.collection_description, '
          + 'w.attempts, w.correct_attempts, w.score, w.word_id '
          + 'from '
          + 'user_table as u inner join '
          + 'collection_table as c '
          + 'on c.user_id = u.user_id '
          + 'left outer join word_table as w '
          + 'on c.collection_id = w.collection_id '
          + 'where u.username = $1',
          [ username ],
          (selectErr, data) => {
            done();
            rejectErr(selectErr, reject);

            resolve(format(data.rows));
          }
        );
      });
    });
  }
}

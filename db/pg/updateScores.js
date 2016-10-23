const getUsernamesAndDecrease = (pool) => (type) => {
  return new Promise((resolve, reject) => {
    pool.connect((connectErr, client, done) => {
      if (connectErr) {
        done();
        return reject(connectErr);
      }

      client.query(
        'select username, decrease_per_' + type
        + ' from user_table',
        (selectErr, data) => {
          done();
          if (selectErr) {
            return reject(selectErr);
          }

          resolve({ type, usersAndDecr: data.rows });
        }
      );
    });
  });
};

const getWordsToDecrease = (pool) => (obj) => {
  return Promise.all(
    obj.usersAndDecr.map((o) => {
      return new Promise((resolve, reject) => {
        pool.connect((connectErr, client, done) => {
          if (connectErr) {
            done();
            return reject(connectErr);
          }

          client.query(
            'select w.word_id, w.score from '
            + 'user_table as u inner join '
            + 'collection_table as c '
            + 'on u.user_id = c.user_id '
            + 'left outer join word_table as w '
            + 'on c.collection_id = w.collection_id '
            + 'where u.username = $1',
            [ o.username ],
            (selectErr, data) => {
              done();
              if (selectErr) {
                return reject(selectErr);
              }

              resolve({
                username: o.username,
                decrease: 
                  o.decrease_per_hour
                  || o.decrease_per_day
                  || 0,
                words: data.rows
              });
            }
          );
        });
      });
    })
  );
};

const decreaseWords = (pool) => (users) => {
  return Promise.all(
    users.map((user) => {
      return new Promise((resolve, reject) => {
        Promise.all(
          user.words.map((word) => {
            const { word_id, score } = word;
            const newScore = score - user.decrease > 5 ?
              score - user.decrease : score > 5 ? 5 : score;
            return new Promise((res, rej) => {
              pool.connect((connectErr, client, done) => {
                if (connectErr) {
                  done();
                  return rej(connectErr);
                }

                client.query(
                  'update word_table '
                  + 'set score = $2 '
                  + 'where word_id = $1',
                  [ word_id, newScore ],
                  (updateErr) => {
                    done();
                    if (updateErr) {
                      return rej(updateErr);
                    }

                    res();
                  }
                );
              });
            });
          })
        )
        .then(resolve);
      });
    })
  );
};

module.exports = (pool) => (type) => {
  return new Promise((resolve, reject) => {
    getUsernamesAndDecrease(pool)(type)
      .then(getWordsToDecrease(pool))
      .then(decreaseWords(pool))
      .then(resolve)
      .catch((err) => reject(err));
  });
}

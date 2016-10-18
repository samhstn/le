const assert = require('assert');

function rejectErr(err, reject) {
  if (err) {
    reject(err);
  }
}

const handleCollectionUpdates = (collectionObj, client, cb) => {
  const id = collectionObj.collection_id;
  const name = collectionObj.collection_name;
  const description = collectionObj.collection_description;

  let set;

  if (name || description) {
    if (name && description) {
      client.query(
        'update collection_table '
        + 'set collection_name = $2, collection_description = $3 '
        + 'where collection_id = $1',
        [ id, name, description],
        cb
      )
    } else if (name) {
      client.query(
        'update collection_table '
        + 'set collection_name = $2 '
        + 'where collection_id = $1',
        [ id, name ],
        cb
      );
    } else {
      client.query(
        'update collection_table '
        + 'set collection_description = $2 '
        + 'where collection_id = $1',
        [ id, description ],
        cb
      );
    }
  } else {
    cb();
  }
};

const handleNew = (client, id, words) => {
  return new Promise((resolve, reject) => {
    words.forEach((word, i) => {
      client.query(
        'insert into word_table '
        + '(collection_id, direction, source_word, target_words) '
        + 'values ($1, $2, $3, $4)',
        [id, word.direction, word.source_word, word.target_words],
        (err) => {
          rejectErr(err, reject);

          if (i === words.length - 1) {
            resolve();
          }
        }
      );
    });
  });
};

const handleUpdate = (client, id, words) => {
  return Promise.resolve();
};

const handleDelete = (client, id, words) => {
  return Promise.resolve();
};

const handleWords = (collectionObj, client, done, cb) => {
  const id = collectionObj.collection_id;
  handleNew(client, id, collectionObj.new_words)
    .then(() => handleUpdate(client, id, collectionObj.update_words))
    .then(() => handleDelete(client, id, collectionObj.delete_words))
    .then(() => {
      done();
      cb();
    })
};

module.exports = (pool) => {
  return function (collectionObj) {
    return new Promise((resolve, reject) => {
      const id = collectionObj.collection_id;
      if (!id) {
        return reject('Collection id is not defined');
      }

      pool.connect((connectErr, client, done) => {
        rejectErr(connectErr, reject);
  
        client.query(
          'select * from '
          + 'collection_table inner join word_table '
          + 'on collection_table.collection_id = word_table.collection_id '
          + 'where collection_table.collection_id = $1',
          [ id ],
          (selectAllErr, selectAllData) => {
            rejectErr(selectAllErr, reject)

            handleCollectionUpdates(collectionObj, client, () => {
              handleWords(collectionObj, client, done, resolve);
            });
          }
        );
      });
    });
  }
}

const setDefinedString = require('../../../db/pg/setDefinedString.js');
const setDefinedValues = require('../../../db/pg/setDefinedValues.js');

module.exports = (pool, collectionObj) => {
  if (!collectionObj.update_words) {
    return Promise.resolve();
  }

  return Promise.all(
    Object.keys(collectionObj.update_words).map((key) => {
      return new Promise((resolve, reject) => {
        pool.connect((connectErr, client, done) => {
          if (connectErr) {
            return reject(connectErr);
          }

          client.query(
            'update word_table '
            + setDefinedString(collectionObj.update_words[key])
            + 'where collection_id = $1',
            [ collectionObj.collection_id ]
              .concat(
                setDefinedValues(collectionObj.update_words[key])
              ),
            (updateErr) => {
              done();
              if (updateErr) {
                return reject(updateErr);
              }
              resolve();
            }
          );
        });
      });
    })
  );
}

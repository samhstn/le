const setDefinedString = require('../../../db/pg/setDefinedString.js');
const setDefinedValues = require('../../../db/pg/setDefinedValues.js');

const handleCollections = (client, collectionObj) => {
  return Promise.all(
    Object.keys(collectionObj.update_words).map((key) => {
      return new Promise((resolve, reject) => {
        client.query(
          'update word_table '
          + setDefinedString(collectionObj.update_words[key])
          + 'where word_id = $1',
          [ key ]
            .concat(
              setDefinedValues(collectionObj.update_words[key])
            ),
          (updateErr) => {
            if (updateErr) {
              return reject(updateErr);
            }
            resolve();
          }
        );
      });
    })
  );
};

module.exports = (pool, collectionObj) => {
  if (!collectionObj.update_words) {
    return Promise.resolve();
  }
  
  return new Promise((resolve, reject) => {
    pool.connect((connectErr, client, done) => {
      if (connectErr) {
        done();
        return reject(connectErr);
      }

      handleCollections(client, collectionObj)
        .then(() => {
          done();
          resolve();
        })
        .catch((err) => reject(err));
    });
  });

}

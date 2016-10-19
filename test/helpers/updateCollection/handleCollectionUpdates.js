const setDefinedString = require('../../../db/pg/setDefinedString.js');
const setDefinedValues = require('../../../db/pg/setDefinedValues.js');

module.exports = (pool, collectionObj) => {
  if (!(collectionObj.collection_name || collectionObj.collection_description)) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    pool.connect((connectErr, client, done) => {
      if (connectErr) {
        return reject('connection err');
      }

      const collObj = {};

      Object.keys(collectionObj).forEach((key) => {
        if (['collection_name', 'collection_description'].indexOf(key) > -1) {
          collObj[key] = collectionObj[key];
        }
      });

      client.query(
        'update collection_table '
        + setDefinedString(collObj)
        + 'where collection_id = $1',
        [ collectionObj.collection_id ].concat(setDefinedValues(collObj)),
        (err) => {
          done();
          if (err) {
            return reject(err);
          }

          resolve();
        }
      );
    });
  });
}


const handleCollectionUpdates = require('./updateCollection/handleCollectionUpdates.js');
const handleNewWords = require('./updateCollection/handleNewWords.js');
const handleUpdateWords = require('./updateCollection/handleUpdateWords.js');
const handleDeleteWords = require('./updateCollection/handleDeleteWords.js');

module.exports = (pool) => (collectionObj) => {
  return new Promise((resolve, reject) => {
    if (!collectionObj.collection_id) {
      return reject('Collection id is not defined');
    }

    handleCollectionUpdates(pool, collectionObj)
      .then(() => handleNewWords(pool, collectionObj))
      .then(() => handleUpdateWords(pool, collectionObj))
      .then(() => handleDeleteWords(pool, collectionObj))
      .then(resolve)
      .catch((err) => reject(err));
  });
};


const setDefinedString = require('../../db/pg/setDefinedString.js');
const setDefinedValues = require('../../db/pg/setDefinedValues.js');

module.exports = (pool) => {
  return function (settings) {
    return new Promise((resolve, reject) => {
      const username = Object.keys(settings)[0];
      if (!username) {
        return reject('username not defined');
      }

      pool.connect((connectErr, client, done) => {
        if (connectErr) {
          done();
          return reject(connectErr);
        }

        client.query(
          'update user_table '
          + setDefinedString(settings[username])
          + 'where username = $1',
          [ username ]
            .concat(
              setDefinedValues(settings[username])
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
  }
};

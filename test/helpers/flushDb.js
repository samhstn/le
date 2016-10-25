const fs = require('fs');
const path = require('path');
const schemaPath = path.join(__dirname, '..', '..', 'schema.sql');

module.exports = (pool, redisCli) => () => {
  return new Promise((resolve, reject) => {
    pool.connect((connectErr, client, done) => {
      if (connectErr) {
        return reject(connectErr);
      }
      
      fs.readFile(schemaPath, 'utf8', (readfileErr, schema) => {
        if (readfileErr) {
          return reject(readfileErr);
        }
        client.query(schema, () => {
          done();
          redisCli.flushall(() => {
            resolve();
          });
        });
      });
    });
  });
}


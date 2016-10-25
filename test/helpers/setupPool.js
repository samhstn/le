module.exports = (pool) => () => {
  return new Promise((resolve, reject) => {
    pool.connect((connectErr, client, done) => {
      if (connectErr) {
        reject(connectErr);
      }

      resolve({ client, done });
    });
  });
};


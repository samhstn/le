const crypto = require('crypto');

module.exports = (redisCli, creds) => {
  const username = creds.username;

  const key = crypto.randomBytes(256).toString('base64');

  return new Promise((resolve) => {
    redisCli.set(username, key, () => {
      // expire after 100 mins
      redisCli.expire(username, 100 * 60)

      resolve(key);
    })
  });
};

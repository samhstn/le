module.exports = (redisCli) => (user) => {
  return new Promise((resolve, reject) => {
    redisCli.getAsync(user)
      .then((data) => {
        resolve(data !== null);
      })
      .catch(reject);
  });
}


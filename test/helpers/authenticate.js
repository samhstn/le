module.exports = (pool, redisCli) => {
  const loginUserWRedis = require('./loginUserWRedis.js')(redisCli);

  return function (userObj) {
    const redisObj = {
      username: userObj.username,
      key: '267f666bf2496696fa299e20e6c3e6d84c4ac0fafdc1d389d585fc65c2606a7ea'
    };

    const cookie = Buffer.from(JSON.stringify(redisObj)).toString('base64');

    return new Promise((resolve, reject) => {
      loginUserWRedis(redisObj)
        .then(() => resolve({ 'set-cookie': [ 'cookie=' + cookie ] }))
    });
  }
}

module.exports = (redisCli) => (userObj) => {
  userObjKeys = Object.keys(userObj);
  if (userObjKeys.length !== 2) {
    return Promise.reject('wrong number of keys in loginUserWRedis payload')
  }

  if (userObjKeys.indexOf('username') === -1) {
    return Promise.reject('no username in loginUserWRedis payload');
  }

  if (userObjKeys.indexOf('key') === -1) {
    return Promise.reject('no key in loginUserWRedis payload');
  }

  return redisCli.set(userObj.username, userObj.key);
}

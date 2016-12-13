const redis = require('redis');
const bluebird = require('bluebird');
const config = require('../../../config.js').redis;

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

exports.register = (server, options, next) => {
  server.app.redisCli = redis.createClient(config);
  
  next();
}

exports.register.attributes = { pkg: { name: 'redis' } }

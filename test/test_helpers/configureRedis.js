const bluebird = require('bluebird');
const redis = require('redis');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const redisConfig = require('../../config.js').redis;
const redisCli = redis.createClient(redisConfig);

module.exports = redisCli;

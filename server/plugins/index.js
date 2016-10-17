const Inert = require('inert');
const Vision = require('vision');
const redis = require('./redis.js');
const postgres = require('./postgres.js');
const register = require('./register.js');
const login = require('./login.js');
const logout = require('./logout.js');
const scheme = require('./scheme.js');
const strategy = require('./strategy.js');
const collection = require('./collection.js');

const plugins = [
  Inert,
  Vision,
  redis,
  postgres,
  register,
  login,
  logout,
  scheme,
  strategy,
  collection
];

module.exports = plugins;

const Inert = require('inert');
const Vision = require('vision');

const redis = require('./db/redis.js');
const postgres = require('./db/postgres.js');

const register = require('./auth/register.js');
const login = require('./auth/login.js');
const logout = require('./auth/logout.js');
const scheme = require('./auth/scheme.js');
const strategy = require('./auth/strategy.js');

const collection = require('./api/collection.js');
const settings = require('./api/settings.js');

const updateScore = require('./db/updateScore.js');

const dashboard = require('./content/dashboard.js');
const practice = require('./content/practice.js');

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
  collection,
  settings,
  updateScore,
  dashboard,
  practice
];

module.exports = plugins;

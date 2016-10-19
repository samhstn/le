const pg = require('pg')
const pgConfig = require('../../config.js').pg;

module.exports = { pool: pg.Pool, config: pgConfig };

const pg = require('pg');
const config = require('../../config.js').pg;

exports.register = (server, options, next) => {
  const pool = new pg.Pool(config);

  next();
}

exports.register.attributes = {
  pkg: {
    name: 'postgres'
  }
}

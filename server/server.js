const env2 = require('env2');
const assert = require('assert');
const Hapi = require('hapi');

env2('config.env');

const plugins = require('./plugins/index.js');
const routes = require('./routes/index.js');
const views = require('./views.js');

const port = process.env.PORT || 4455;

const server = new Hapi.Server();

server.connection({ port });

server.register(plugins, (err) => {
  assert(!err, err);

  server.views(views);

  server.route(routes);
});

module.exports = server;

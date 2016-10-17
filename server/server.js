const env2 = require('env2');
const assert = require('assert');
const Hapi = require('hapi');
const Handlebars = require('handlebars');

env2('config.env');

const plugins = require('./plugins/index.js');
const routes = require('./routes/index.js');

const port = process.env.PORT || 4455;

const server = new Hapi.Server();

server.connection({ port });

server.register(plugins, (err) => {
  assert(!err, err);

  server.views({
    engines: { html: Handlebars },
    path: __dirname + '/views'
  });

  server.route(routes);
});

module.exports = server;

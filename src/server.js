const Hapi = require('hapi');
const Inert = require('inert');
const port = process.env.PORT || 3333;
const host = process.env.HOST || 'localhost';

const server = new Hapi.Server();

server.connection({
  host,
  port
});

server.register([Inert], (err) => {
  if (err)
    throw err;

  server.route([
    require('./routes/react-urls.js'),
    require('./routes/bundle.js')
  ]);
});



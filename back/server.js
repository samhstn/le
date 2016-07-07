const Hapi = require('hapi')
const Inert = require('inert')

const server = new Hapi.Server()
const port = 4000

server.connection({
  routes: {cors: true},
  host: 'localhost',
  port
})

server.register([Inert], () => {
  server.route([
    require('./routes/index.js'),
    require('./routes/bundle.js'),
    require('./routes/bundle.map.js'),
    require('./routes/params.js')
  ])
})

module.exports = server

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
    require('./routes/public/index.js'),
    require('./routes/public/bundle.js'),
    require('./routes/public/bundle.map.js'),
    require('./routes/public/params.js'),
    require('./routes/new/word.js'),
    require('./routes/new/category.js'),
    require('./routes/results.js'),
    require('./routes/session/start.js'),
    require('./routes/session/finish.js')
  ])
})

module.exports = server

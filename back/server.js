'use strict'
// node modules
const Hapi = require('hapi')
const Inert = require('inert')
// server config
const server = new Hapi.Server()
const port = 4000

server.connection({
  port: port
})

// Hapi plugins
const plugins = [
  Inert
]

server.register(plugins, (err) => {
  if (err) {
    throw err
  }
  server.route([
    {
      method: 'GET',
      path: '/',
      handler: function (request, reply) {
        reply.file('../front/production/index.html')
      }
    },
    {
      method: 'GET',
      path: '/{param*}',
      handler: {
        directory: {
          path: 'front/production'
        }

      }
    }
  ])
})

module.exports = server

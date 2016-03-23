'use strict'
// node modules
const Hapi = require('hapi')
const Inert = require('inert')
const Path = require('path')
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

server.register(plugins, () => {
  server.route([
    {
      method: 'GET',
      path: '/',
      handler: (request, reply) => {
        reply.file(Path.join(__dirname, '../front/production/index.html'))
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

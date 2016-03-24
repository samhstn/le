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

server.register(plugins, (err) => {
  if (err) {
    throw err
  }
  server.route([
    {
      method: 'GET',
      path: '/{params*}',
      handler: (request, reply) => {
        const path = Path.join(__dirname, '../front/production/index.html')
        console.log(path)
        reply.file(path)
      }
    }
  ])
})

module.exports = server

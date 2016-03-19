'use strict'

// node modules
const Hapi = require('hapi')
const Inert = require('inert')

// server config
const server = new Hapi.Server()
const port = 8080

server.connection({
  port: port
})

// Hapi plugins
const plugins = [
  Inert
]

server.register(plugins, (err) => {
  if (err) {
    console.log(err)
    throw err
  }
  server.route([{
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: 'front/production'
      }
    }
  }])
})

module.exports = server

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
      handler: (request, reply) => {
        const path = __dirname.join('../../frontend/production/index.html')
        console.log(path)
        reply.file(path)
      }
    }, {
      method: 'GET',
      path: '/',
      handler: (request, reply) => {
        const client = require('./redis.js')
        require('./populateDB/populateDB.js')(client) // link these up to the correct urls, plan, then make work!
        reply.redirect('/')
      }
    }, {
      method: 'GET',
      path: '/',
      handler: (request, reply) => {
        const path = __dirname.join('./../../frontend/production/amazon.js')
        reply.file(path)
      }
    }
  ])
})

module.exports = server

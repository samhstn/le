const Hapi = require('hapi')
const Inert = require('inert')
const Path = require('path')

const server = new Hapi.Server()
const port = 4000

server.connection({
  routes: {cors: true},
  port: port
})

const plugins = Inert

server.register(plugins, () => {
  server.route([
    {
      method: 'GET',
      path: '/bundle.js',
      handler: (request, reply) => {
        const path = Path.join(__dirname, '../production/bundle.js')
        reply.file(path)
      }
    },
    {
      method: 'GET',
      path: '/',
      handler: (request, reply) => {
        const path = Path.join(__dirname, '../production/index.html')
        reply.file(path)
      }
    },
    {
      method: 'GET',
      path: '/admin',
      handler: (request, reply) => {
        const path = Path.join(__dirname, '../production/index.html')
        reply.file(path)
      }
    },
    {
      method: 'GET',
      path: '/le',
      handler: (request, reply) => {
        const path = Path.join(__dirname, '../production/index.html')
        reply.file(path)
      }
    },
    {
      method: 'GET',
      path: '/settings',
      handler: (request, reply) => {
        const path = Path.join(__dirname, '../production/index.html')
        reply.file(path)
      }
    }
  ])
})

module.exports = server

const Hapi = require('hapi')
const Inert = require('inert')
const Path = require('path')

const server = new Hapi.Server()
const port = 4000

server.connection({
  routes: {cors: true},
  port: port
})

const returnRoots = (method, urlpath, replyPath) => {
  return {
    method: method,
    path: urlpath,
    handler: (request, reply) => {
      const path = Path.join(__dirname, replyPath)
      reply.file(path)
    }
  }
}

server.register(Inert, () => {
  server.route([
    returnRoots('GET', '/bundle.js', '../production/bundle.js'),
    returnRoots('GET', '/', '../production/index.html'),
    returnRoots('GET', '/admin', '../production/index.html'),
    returnRoots('GET', '/le', '../production/index.html'),
    returnRoots('GET', '/settings', '../production/index.html')
  ])
})

module.exports = server

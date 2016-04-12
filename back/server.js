import Hapi from 'hapi'
import Inert from 'inert'
import routeHandler from './routeHandler'

const server = new Hapi.Server()
const port = 4000

server.connection({
  routes: {cors: true},
  port: port
})

server.register(Inert, () => {
  server.route([
    routeHandler('GET', '/bundle.js', '../production/bundle.js'),
    routeHandler('GET', '/', '../production/index.html'),
    routeHandler('GET', '/admin', '../production/index.html'),
    routeHandler('GET', '/le', '../production/index.html'),
    routeHandler('GET', '/settings', '../production/index.html')
  ])
})

module.exports = server

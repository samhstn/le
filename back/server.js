var Hapi = require('hapi')
var Inert = require('inert')
var server = new Hapi.Server()
var port = process.env.PORT || 8080

server.connect(port)

server.register(Inert, (err) => {
  if (err) {
    console.log('Error: ', err)
    throw err
  }
  server.route([
    {
      path: '/',
      method: 'GET',
      handler: function (request, reply) {
        reply.file(__dirname + '../front/index.html')
      }
    },
    {
      path: '/{param*}',
      mathod: 'GET',
      handler: {
        directory: {
          path: '../front'
        }
      }
    }
  ])
})

module.exports = server

module.exports = {
  method: 'get',
  path: '/bundle.js.map',
  handler: (request, reply) => {
    reply.file('./production/bundle.js.map')
  }
}

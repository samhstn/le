module.exports = {
  method: 'get',
  path: '/bundle.js',
  handler: (request, reply) => {
    reply.file('./production/bundle.js')
  }
}

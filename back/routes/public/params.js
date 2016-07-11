module.exports = {
  method: 'get',
  path: '/{param*}',
  handler: (request, reply) => {
    reply.file('./production/index.html')
  }
}

module.exports = {
  method: 'get',
  path: '/',
  handler: (request, reply) => {
    reply.file('./production/index.html')
  }
}

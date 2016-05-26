const path = require('path')

module.exports = {
  method: 'get',
  path: '/{filename}',
  handler: (request, reply) => {
    console.log(request.params.filename)
    reply.file(path.join('./production/', request.params.filename))
  }
}

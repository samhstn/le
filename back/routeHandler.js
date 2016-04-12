import Path from 'path'

export default (method, urlpath, replyPath) => {
  return {
    method: method,
    path: urlpath,
    handler: (request, reply) => {
      const path = Path.join(__dirname, replyPath)
      reply.file(path)
    }
  }
}

exports.register = (server, options, next) => {
  server.route({
    method: 'get',
    path: '/practice',
    handler: (request, reply) => {
      reply.view('practice');
    }
  });

  next();
}

exports.register.attributes = { pkg: { name: 'practice' } };

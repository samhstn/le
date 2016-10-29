const views = ['register', 'login', 'dashboard', 'practice'].map((component) => {
  return {
    method: 'get',
    config: ['register', 'login'].indexOf(component) > -1 ? {
      auth: false
    } : {},
    path: component === 'dashboard' ? '/' : '/' + component + '/{param?}',
    handler: (request, reply) => {
      const param = request.params.param;
      reply.view('layout', { component, param });
    }
  };
});

const riot = {
  method: 'get',
  path: '/riot+compiler.min.js',
  config: { auth: false },
  handler: (request, reply) => {
    reply.file('node_modules/riot/riot+compiler.min.js');
  }
};

const resources = {
  method: 'get',
  path: '/resource/{param*}',
  config: { auth: false },
  handler: { directory: { path: 'public' } }
};

module.exports = views.concat(riot).concat(resources);

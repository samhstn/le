const views = ['register', 'login', 'dashboard', 'practice'].map((route) => {
  return {
    method: 'get',
    config: ['dashboard', 'practice'].indexOf(route) > -1 ? {
      auth: 'le-strategy'
    } : {},
    path: route === 'dashboard' ? '/' : '/' + route,
    handler: (request, reply) => {
      reply.view('layout', { component: route });
    }
  };
});

const riot = {
  method: 'get',
  path: '/riot+compiler.min.js',
  handler: (request, reply) => {
    reply.file('node_modules/riot/riot+compiler.min.js');
  }
};

const resources = {
  method: 'get',
  path: '/resource/{param*}',
  handler: { directory: { path: 'public' } }
};

module.exports = views.concat(riot).concat(resources);

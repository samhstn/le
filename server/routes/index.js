const createRoute = (route) => {
  return {
    method: 'get',
    path: '/' + route + '/{param?}',
    config: { auth: false },
    handler: (request, reply) => {
      reply.view('layout', {
        component: route,
        param: request.params.param
      });
    }
  };
};

const register = createRoute('register');
const login = createRoute('login');

const dashboard = {
  method: 'get',
  path: '/',
  handler: (request, reply) => {
    reply.view('layout', { component: 'dashboard' });
  }
};

const practice = {
  method: 'get',
  path: '/practice',
  handler: (request, reply) => {
    reply.view('layout', { component: 'practice' });
  }
};

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

module.exports = [
  register,
  login,
  dashboard,
  practice,
  riot,
  resources
];

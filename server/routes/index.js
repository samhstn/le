const qs = require('querystring');

const createRoute = (route) => {
  return {
    method: 'get',
    path: '/' + route + '/{param?}',
    config: { auth: false },
    handler: (request, reply) => {
      reply.view(route, qs.parse(request.params.param));
    }
  };
};

const register = createRoute('register');
const login = createRoute('login');

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

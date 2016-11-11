const qs = require('querystring');

const createRoute = (route) => ({
  path: '/' + route + '/{param?}',
  handler: (request, reply) => reply.view(route, qs.parse(request.params.param))
});

const register = createRoute('register');
const login = createRoute('login');

const riot = {
  path: '/riot+compiler.min.js',
  handler: (request, reply) => reply.file('node_modules/riot/riot+compiler.min.js')
};

const resources = {
  path: '/resource/{param*}',
  handler: { directory: { path: 'public' } }
};

module.exports = [
  register,
  login,
  riot,
  resources
].map((route) => Object.assign(route, { method: 'get', config: { auth: false } }));

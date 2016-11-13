const getCollectionsWithWordData = require('../../../db/pg/getCollectionsWithWordData.js');
const usernameFromCookie = require('../../helpers/usernameFromCookie.js');

exports.register = (server, options, next) => {
  server.route({
    method: 'get',
    path: '/',
    handler: (request, reply) => {
      const cookie = request.headers.cookie || request.headers['set-cookie'][0];
      const username = usernameFromCookie(cookie);
      getCollectionsWithWordData(server.app.pool)(username)
        .then((collections) => reply.view('dashboard', { collections }))
        .catch((err) => console.log('Error: ', err));
    }
  });

  next();
}

exports.register.attributes = { pkg: { name: 'dashboard' } };

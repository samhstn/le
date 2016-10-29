const updateScores = require('../../../db/pg/updateScores.js');
const usernameFromCookie = require('../../helpers/usernameFromCookie.js');

exports.register = (server, options, next) => {
  const pool = server.app.pool;
  server.app.startDate = server.app.startDate || Date.now();
  server.app.updateHourCount = server.app.updateHourCount || 0;
  server.app.updateDayCount = server.app.updateDayCount || 0;

  server.app.interval = setInterval(() => {
    if (Date.now() - 24 * 60 * 60 * 1000 * server.app.updateDayCount - server.app.startDate > 0) {
      updateScores(pool)('day')
        .then(() => {
          ++ server.app.updateDayCount;
          ++ server.app.updateHourCount;
        });
    } else if (Date.now() - 60 * 60 * 1000 * server.app.updateHourCount > 0 - server.app.startDate) {
      updateScores(pool)('hour')
        .then(() => {
          ++server.app.updateHourCount;
        });
    }
  }, 30 * 1000);

  server.route([
    {
      method: 'get',
      path: '/api/startDate',
      handler: (request, reply) => {
        reply({ startDate: server.app.startDate });
      }
    },
    {
      method: 'post',
      path: '/api/updateScores',
      handler: (request, reply) => {
        const cookie = request.headers.cookie || request.headers['set-cookie'][0];
        const username = usernameFromCookie(cookie);
        const type = request.payload.type;

        updateScores(pool)(type, username)
          .then(() => {
            reply({
              message: 'Scores updated',
              info: { updated: true }
            })
          });
      }
    }
  ]);

  next();
}

exports.register.attributes = {
  pkg: {
    name: 'decrease score'
  }
};

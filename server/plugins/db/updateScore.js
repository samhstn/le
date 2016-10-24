const updateScores = require('../../../db/pg/updateScores.js');

exports.register = (server, options, next) => {
  const pool = server.app.pool;
  server.app.startDate = server.app.startDate || Date.now();
  server.app.updateHourCount = server.app.updateHourCount || 0;
  server.app.updateDayCount = server.app.updateDayCount || 0;

  server.app.interval = setInterval(() => {
    if (Date.now() - 24 * 60 * 60 * 1000 * updateDayCount - server.app.startDate > 0) {
      updateScores(pool)('day')
        .then(() => {
          ++ server.app.updateDayCount;
          ++ server.app.updateHourCount;
        });
    } else if (server.app.startDate - Date.now() - 60 * 60 * 1000 * updateCount > 0) {
      updateScores(pool)('hour')
        .then(() => {
          ++ server.app.updateHourCount;
        });
    }
  }, 30 * 1000);

  server.route([]);

  next();
}

exports.register.attributes = {
  pkg: {
    name: 'decrease score'
  }
};

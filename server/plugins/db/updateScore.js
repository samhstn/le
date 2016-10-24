const updateScores = require('../../../db/pg/updateScores.js');

exports.register = (sever, options, next) => {
  const pool = server.app.pool;
  const server.app.startDate = server.app.startDate || Date.now();
  const server.app.updateHourCount = server.app.updateHourCount || 0;
  const server.app.updateDayCount = server.app.updateDayCount || 0;

  setInterval(() => {
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

  next();
}

exports.register.attributes = {
  pkg: {
    name: 'decrease score
  }
};

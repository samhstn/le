const assert = require('assert');
const Joi = require('joi');
const getSettings = require('../../../db/pg/getSettings.js')
const updateSettings = require('../../../db/pg/updateSettings.js')
const getUsernameFromCookie = require('../../../server/helpers/usernameFromCookie.js');

exports.register = (server, options, next) => {
  server.route([
    {
      method: 'get',
      path: '/api/settings',
      handler: (request, reply) => {
        const cookie = request.headers.cookie || request.headers['set-cookie'][0];
        const username = getUsernameFromCookie(cookie);
        const pool = server.app.pool;

        getSettings(pool)(username)
          .then((settings) => {
            reply({ settings: settings[0] });
          })
      }
    },
    {
      method: 'put',
      path: '/api/settings',
      handler: (request, reply) => {
        const cookie = request.headers.cookie || request.headers['set-cookie'][0];
        const username = getUsernameFromCookie(cookie);
        const pool = server.app.pool;
        const settings = request.payload;

        const settingsObj = { [username]: settings };

        updateSettings(pool)(settingsObj)
          .then(() => reply({
            message: 'Settings updated',
            info: { updated: true }
          }));
      }
  }]);

  next();
}

exports.register.attributes = {
  pkg: {
    name: 'settings'
  }
}

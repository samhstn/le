const crypto = require('crypto');
const assert = require('assert');
const Joi = require('joi');

exports.register = (server, options, next) => {
  server.route({
    method: 'post',
    path: '/api/login',
    config: {
      validate: {
        payload: {
          username: Joi.string().required(),
          password: Joi.string().required()
        }
      }
    },
    handler: (request, reply) => {
      const username = request.payload.username;
      const password = request.payload.password;

      const pool = server.app.pool;
      const redisCli = server.app.redisCli;

      pool.connect((connectErr, client, done) => {
        assert(!connectErr, connectErr);

        client.query(
          'select username from user_table',
          (selectUserErr, usernames) => {
            assert(!selectUserErr, selectUserErr);

            if (!(usernames.rows.filter((u) => u === username).length)) {
              done();

              return reply.redirect('/login/user_not_registered=true&user=' + username);
            }

            client.query(
              'select password from user_table where username = $1',
              [username],
              (selectPassErr, dbPass) => {
                assert(!selectPassErr, selectPassErr);

                if (dbPass !== password) {
                  return reply.redirect('/login/incorrect_pass=true&user=' + username);
                }

                const key = crypto.randomBytes(256).toString('base64');

                redisCli.set(username, key, () => {
                  // expire after 10 mins
                  redisCli.expire(username, 10 * 60)

                  reply
                    .redirect('/')
                    .state('cookie', { username, key });;
                })
              }
            );
          }
        );
      });
    }
  });

  next();
}

exports.register.attributes = {
  pkg: {
    name: 'login'
  }
}

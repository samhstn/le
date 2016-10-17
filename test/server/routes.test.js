const tape = require('tape');

const server = require('../../server/server.js');

tape('GET :: /login', (t) => {
  const options = {
    method: 'get',
    url: '/login'
  };

  server.inject(options)
    .then((res) => {
      t.equal(res.statusCode, 200);
      t.equal(res.headers['content-type'], 'text/html; charset=utf-8');
      t.ok(res.payload.includes('/resource/tags/login.js'));
      t.end();
    });
});

tape('GET :: /register', (t) => {
  const options = {
    method: 'get',
    url: '/register'
  };

  server.inject(options)
    .then((res) => {
      t.equal(res.statusCode, 200);
      t.equal(res.headers['content-type'], 'text/html; charset=utf-8');
      t.ok(res.payload.includes('/resource/tags/register.js'));
      t.end();
    });
});

tape('GET :: /riot+compiler.min.js', (t) => {
  const options = {
    method: 'get',
    url: '/riot+compiler.min.js'
  };

  server.inject(options)
    .then((res) => {
      t.equal(res.statusCode, 200);
      t.equal(res.headers['content-type'], 'application/javascript; charset=utf-8');
      t.end();
    });
});

tape('GET :: /resource/tags/login.js', (t) => {
  const options = {
    method: 'get',
    url: '/resource/tags/login.js'
  };

  server.inject(options)
    .then((res) => {
      t.equal(res.statusCode, 200, 'You will have to run the build to find this file');
      t.equal(res.headers['content-type'], 'application/javascript; charset=utf-8');
      t.end();
    });
});

tape('GET :: /resource/helpers/request.js', (t) => {
  const options = {
    method: 'get',
    url: '/resource/helpers/request.js'
  };

  server.inject(options)
    .then((res) => {
      t.equal(res.statusCode, 200);
      t.equal(res.headers['content-type'], 'application/javascript; charset=utf-8');
      t.end();
    });
});

tape.onFinish(() => {
  server.app.redisCli.quit();
  server.app.pool.end();
});

const tape = require('tape');

const server = require('../../../server/server.js');

tape('GET :: /', (t) => {
  const options = {
    method: 'get',
    url: '/'
  };

  server.inject(options)
    .then((res) => {
      t.equal(res.statusCode, 302, 'Ilpyuw9onz');
      t.equal(res.headers.location, '/login/timeout=true', 'Ilpyuw9onz');
      t.end();
    });
});

tape('GET :: /practice', (t) => {
  const options = {
    method: 'get',
    url: '/practice'
  };

  server.inject(options)
    .then((res) => {
      t.equal(res.statusCode, 302, 'Ilpyuw9onz');
      t.equal(res.headers.location, '/login/timeout=true', 'Ilpyuw9onz');
      t.end();
    })
    .catch((err) => assert(!err, err));
});

tape('GET :: /login', (t) => {
  const options = {
    method: 'get',
    url: '/login'
  };

  server.inject(options)
    .then((res) => {
      t.equal(res.statusCode, 200, 'Ilpyuw9onz');
      t.equal(res.headers['content-type'], 'text/html; charset=utf-8', 'Ilpyuw9onz');
      t.ok(res.payload.includes('/tags/login.tag'), 'LdYtPVEn8C');
      t.end();
    })
    .catch((err) => assert(!err, err));
});

tape('GET :: /register', (t) => {
  const options = {
    method: 'get',
    url: '/register'
  };

  server.inject(options)
    .then((res) => {
      t.equal(res.statusCode, 200, 'Ilpyuw9onz');
      t.equal(res.headers['content-type'], 'text/html; charset=utf-8', 'Ilpyuw9onz');
      t.ok(res.payload.includes('/tags/register.tag'), 'LdYtPVEn8C');
      t.end();
    })
    .catch((err) => assert(!err, err));
});

tape('GET :: /riot+compiler.min.js', (t) => {
  const options = {
    method: 'get',
    url: '/riot+compiler.min.js'
  };

  server.inject(options)
    .then((res) => {
      t.equal(res.statusCode, 200, 'Ilpyuw9onz');
      t.equal(res.headers['content-type'], 'application/javascript; charset=utf-8', 'Ilpyuw9onz');
      t.end();
    })
    .catch((err) => assert(!err, err));
});

tape('GET :: /tags/login.tag', (t) => {
  const options = {
    method: 'get',
    url: '/tags/login.tag'
  };

  server.inject(options)
    .then((res) => {
      t.equal(res.statusCode, 200, 'You will have to run the build to find this file', 'Ilpyuw9onz');
      t.equal(res.headers['content-type'], 'application/octet-stream', 'Ilpyuw9onz');
      t.end();
    })
    .catch((err) => assert(!err, err));
});

tape('GET :: /resource/helpers/request.js', (t) => {
  const options = {
    method: 'get',
    url: '/resource/helpers/request.js'
  };

  server.inject(options)
    .then((res) => {
      t.equal(res.statusCode, 200, 'Ilpyuw9onz');
      t.equal(res.headers['content-type'], 'application/javascript; charset=utf-8', 'Ilpyuw9onz');
      t.end();
    })
    .catch((err) => assert(!err, err));
});

tape.onFinish(() => {
  server.app.redisCli.quit();
  server.app.pool.end();
  clearInterval(server.app.interval);
});

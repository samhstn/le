var tape = require('tape')
var server = require('../back/server.js')

tape('Does server respond successfully with the index?', function (t) {
  server.inject({method: 'GET', url: '/'}, function (res) {
    t.equal(res.statusCode, 200, 'Server responds with statusCode: 200')
    t.ok(res.payload.match('<!DOCTYPE html>'), 'file starts with <!DOCTYPE html>')
    t.ok(res.payload.match('id="container"'), 'index contains the container id')
    t.ok(res.payload.match('<script src="app.js">'), 'index is linking to app.js')
    t.end()
  })
})

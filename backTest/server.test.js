var tape = require('tape')
var server = require('../back/server.js')

tape('Does server respond successfully with the index?', (t) => {
  server.inject({method: 'GET', url: '/'}, (res) => {
    t.equal(res.statusCode, 200, 'Server responds with statusCode: 200')
    t.equal(res.result.error, undefined, 'Server has no errors')
    t.ok(res.payload.match('<!DOCTYPE html>'), 'file starts with <!DOCTYPE html>')
    t.ok(res.payload.match('id="container"'), 'index contains the container id')
    console.log(res.payload, 'PAYLOAD');
    t.ok(res.payload.match('<script src="./bundle.js">'), 'index is linking to bundle.js')
    t.end()
  })
})

tape('wrong endpoint is error handled correctly', (t) => {
  server.inject({method: 'GET', url: '/notanendpoint'}, (res) => {
    t.equal(res.statusCode, 404, 'Server endpoint is not found')
    t.equal(res.result.error, 'Not Found', 'Server has no errors')
    t.end()
  })
})

tape('wrong method is error handled correctly', (t) => {
  server.inject({method: 'MET', url: '/'}, (res) => {
    t.equal(res.statusCode, 404, 'Server endpoint is not found')
    t.equal(res.result.error, 'Not Found', 'Server endpoint is not found')
    t.end()
  })
})

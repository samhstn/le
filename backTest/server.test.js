const tape = require('tape')
const server = require('../back/server.js')

tape('Does server respond successfully with the index?', (t) => {
  server.inject({method: 'GET', url: '/'}, (res) => {
    t.equal(res.statusCode, 200, 'Server responds with statusCode: 200')
    t.equal(res.result.error, undefined, 'Server has no errors')
    t.ok(res.payload.match('<!DOCTYPE html>'), 'file starts with <!DOCTYPE html>')
    t.ok(res.payload.match('id="container"'), 'index contains the container id')
    t.ok(res.payload.match('<script src="./bundle.js">'), 'index is linking to bundle.js')
    t.end()
  })
})

tape('Admin endpoint replys correctly', (t) => {
  server.inject({method: 'GET', url: '/admin'}, (res) => {
    t.equal(res.statusCode, 200, 'Server endpoint is not found')
    t.equal(res.result.error, undefined, 'Server has no errors')
    t.end()
  })
})

tape('Admin endpoint replys correctly', (t) => {
  server.inject({method: 'GET', url: '/le'}, (res) => {
    t.equal(res.statusCode, 200, 'Server endpoint is not found')
    t.equal(res.result.error, undefined, 'Server has no errors')
    t.end()
  })
})

tape('Admin endpoint replys correctly', (t) => {
  server.inject({method: 'GET', url: '/settings'}, (res) => {
    t.equal(res.statusCode, 200, 'Server endpoint is not found')
    t.equal(res.result.error, undefined, 'Server has no errors')
    t.end()
  })
})

tape('Admin endpoint replys correctly', (t) => {
  server.inject({method: 'GET', url: '/bundle.js'}, (res) => {
    t.equal(res.statusCode, 200, 'Server endpoint is not found')
    t.equal(res.result.error, undefined, 'Server has no errors')
    t.end()
  })
})

tape('Wrong endpoint is error handled correctly', (t) => {
  server.inject({method: 'GET', url: '/notanendpoint'}, (res) => {
    t.equal(res.statusCode, 404, 'Server endpoint is not found')
    t.equal(res.result.error, 'Not Found', 'Server endpoint is not found')
    t.end()
  })
})

tape('Wrong method is error handled correctly', (t) => {
  server.inject({method: 'MET', url: '/'}, (res) => {
    t.equal(res.statusCode, 404, 'Server endpoint is not found')
    t.equal(res.result.error, 'Not Found', 'Server endpoint is not found')
    t.end()
  })
})

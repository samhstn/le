const tape = require('tape')
const server = require('../server.js')

tape('Does / respond successfully with a correctly set up index?', t => {
  const options = {
    method: 'GET',
    url: '/'
  }
  server.inject(options, res => {
    t.equal(res.statusCode, 200, 'Server responds with statusCode: 200')
    t.ok(res.payload.match('id="container"'), 'index contains the container id')
    t.ok(res.payload.match('<script src="./bundle.js">'), 'index is linking to bundle.js')
    t.end()
  })
})

const endpoints = ['admin', 'le', 'settings']

const testingStatusCode = endpoint => {
  tape('Does server respond successfully with the index?', t => {
    const options = {
      method: 'get',
      url: '/' + endpoint
    }
    server.inject(options, res => {
      t.equal(res.statusCode, 200, endpoint + ' replies with statusCode 200')
      t.ok(res.payload.indexOf('<!DOCTYPE') > -1)
      t.end()
    })
  })
}

endpoints.forEach(endpoint => testingStatusCode(endpoint))


const tape = require('tape')
const server = require('../back/server.js')

const helperFunction = (message, method, url, statusCode) => {
  return (
    tape(message, (t) => {
      server.inject({method: method, url: url}, (res) => {
        if (statusCode === 200) {
          t.equal(res.statusCode, 200, 'Server endpoint is not found')
          t.equal(res.result.error, undefined, 'Server has no errors')
        } else {
          t.equal(res.statusCode, 404, 'Server endpoint is not found')
          t.equal(res.result.error, 'Not Found', 'Server endpoint is not found')
        }
        t.end()
      })
    })
  )
}

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

helperFunction('Admin endpoint replys correctly', 'GET', '/admin', 200)
helperFunction('Le endpoint replys correctly', 'GET', '/le', 200)
helperFunction('Settings endpoint replys correctly', 'GET', '/settings', 200)
helperFunction('bundle.js endpoint replys the javascript file correctly', 'GET', '/settings', 200)
helperFunction('Wrong endpoint is error handled correctly', 'GET', '/notanendpoint', 404)
helperFunction('Wrong method is error handled correctly', 'MET', '/', 404)

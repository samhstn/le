import tape from 'tape'
import server from '../server.js'

export default (message, method, url, statusCode) => {
  return (
    tape(message, (t) => {
      server.inject({method, url}, (res) => {
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

import tape from 'tape'

import routeHandler from '../routeHandler.js'

tape('Does the route handler function return the correct object', (t) => {
  const routeHandlerResult = routeHandler('method', 'path', 'replyPath')
  t.equal(routeHandlerResult.method, 'method', 'routeHanlder returns the correct method')
  t.equal(routeHandlerResult.path, 'path', 'routeHanlder returns the correct path')
  t.equal(typeof routeHandlerResult.handler, 'function', 'routeHanlder returns the correct handler')
  t.end()
})

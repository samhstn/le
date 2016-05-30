import React from 'react'
import {Route, IndexRoute} from 'react-router'
import App from './app.js'
import Home from './components/home/index.js'
import LearnEnv from './components/le/index.js'

export default (
  <Route path='/' component={App}>
    <IndexRoute component={Home} />
    <Route path='le' component={LearnEnv} />
  </Route>
)

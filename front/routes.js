import React from 'react'
import { Route, Router, hashHistory } from 'react-router'
import Component from './components.js'
import Langbut from './langbutton.js'
import Nav from './navbutton.js'
import Langdir from './langdir.js'

class Routes extends React.Component {
  render () {
    return (
      <Router history={ hashHistory }>
        <Route path='/' component={Component}>
          <Route path='/nav' component={Nav} />
          <Route path='/langbut' component={Langbut} />
          <Route path='/langdir' component={Langdir} />
        </Route>
      </Router>
    )
  }
}

export default Routes

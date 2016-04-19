import React, { Component } from 'react'

require('../../public/style.css')

import NavButtons from '../../containers/navbuttons.js'
import List from './List.js'

export default class LearnEnv extends Component {
  render () {
    return (
      <div>
        <h1>Hello LearnEnv</h1>
        <NavButtons />
        <List />
      </div>
    )
  }
}

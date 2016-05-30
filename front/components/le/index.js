import React, { Component } from 'react'

require('../../public/style.css')

import NavButtons from './navbuttons.js'
import LeftList from '../../containers/leftList.js'
import RightList from '../../containers/rightList.js'

export default class LearnEnv extends Component {
  render () {
    return (
      <div>
        <NavButtons />
        <LeftList />
        <RightList />
      </div>
    )
  }
}


import React, { Component } from 'react'
import LeftList from '../../containers/leftList.js'
import RightList from '../../containers/rightList.js'

export default class List extends Component {
  render () {
    return (
      <div>
        <LeftList />
        <RightList />
      </div>
    )
  }
}

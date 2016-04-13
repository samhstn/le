import React, { Component } from 'react'
import { Link } from 'react-router'
require('../../public/style.css')

import NavButton from '../common/navbutton'
import List from '../../containers/List'

export default class LearnEnv extends Component {
  render () {
    return (
      <div>
        <h1>Hello LearnEnv</h1>
        <Link to='/' style={styles}><NavButton text='Home' top='50%' left='10%' /></Link>
        <List />
      </div>
    )
  }
}

const styles = {
  textDecoration: 'none',
  color: 'black'
}

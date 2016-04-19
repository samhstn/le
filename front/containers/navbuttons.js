import React, { Component } from 'react'
import { Link } from 'react-router'

import NavButton from '../components/common/navbutton.js'

export default class NavButtons extends Component {
  render () {
    return (
      <div>
        <Link to='/' style={styles}><NavButton text='Home' top='50%' left='40%' /></Link>
        <NavButton text='Next' top='50%' left='70%' />
        <NavButton text='Prev' top='50%' left='10%' />
      </div>
    )
  }
}

const styles = {
  textDecoration: 'none',
  color: 'black'
}

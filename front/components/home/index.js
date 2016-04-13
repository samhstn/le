import React, { Component } from 'react'
import { Link } from 'react-router'
require('../../public/style.css')

import LangDirButton from '../common/langdir'
import NavButton from '../common/navbutton'

export default class Home extends Component {
  render () {
    return (
      <div>
        <h1 style={{textAlign: 'center'}}>Home Page</h1>
        <h2 style={{textAlign: 'center'}}>Select a language direction</h2>
        <div className='langdirbuts'>
          <Link to='/le' style={styles} className='langdir'><LangDirButton text='DE -> EN' /></Link>
          <Link to='/le' style={styles} className='langdir'><LangDirButton text='EN -> DE' /></Link>
        </div>
        <Link to='/admin' style={styles}><NavButton text='Admin' top='50%' left='10%' /></Link>
        <Link to='/settings' style={styles}><NavButton text='Settings' top='50%' left='40%' /></Link>
      </div>
    )
  }
}

const styles = {
  textDecoration: 'none',
  color: 'black',
  display: 'inlineBlock'
}

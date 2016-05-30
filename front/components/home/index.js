import React, { Component } from 'react'
import { Link } from 'react-router'
require('../../public/style.css')

import LangDirButton from './langdir.js'

export default class Home extends Component {
  render () {
    return (
      <div>
        <h1 style={{textAlign: 'center'}}>Home Page</h1>
        <h2 style={{textAlign: 'center'}}>Select a language direction</h2>
        <div className='langdirbuts'>
          <Link to='/le' style={linkStyles} className='langdir'><LangDirButton text='DE -> EN' /></Link>
          <Link to='/le' style={linkStyles} className='langdir'><LangDirButton text='EN -> DE' /></Link>
        </div>
      </div>
    )
  }
}

const linkStyles = {
  textDecoration: 'none',
  color: 'black',
  display: 'inlineBlock'
}

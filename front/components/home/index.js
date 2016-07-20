import React, { Component } from 'react'
import { Link } from 'react-router'
require('../../public/style.css')

export default class Home extends Component {
  render () {
    return (
      <div>
        <h1 style={{textAlign: 'center'}}>Home Page</h1>
        <div>
          <Link to='/le' style={styles}>LE</Link>
          <Link to='/settings' style={styles}>SETTINGS</Link>
          <Link to='/results' style={styles}>RESULTS</Link>
        </div>
      </div>
    )
  }
}

const styles = {
  textDecoration: 'none',
  color: 'black',
  display: 'block',
  textAlign: 'center'
}

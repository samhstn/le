import React, { Component } from 'react'
import { Link } from 'react-router'
import LangButton from '../common/langbutton'

export default class Settings extends Component {
  render () {
    return (
      <div>
        <h1>Hello Settings</h1>
        <Link to='/' style={styles}><LangButton text='hello' backgroundColor='red' /></Link>
      </div>
    )
  }
}

const styles = {
  textDecoration: 'none',
  color: 'black'
}

import React, { Component } from 'react'
import { Link } from 'react-router'

require('../../public/style.css')

export default class LearnEnv extends Component {
  render () {
    return (
      <div>
        <h1>LearnEnv</h1>
        <Link to='/' style={styles}>HOME</Link>
      </div>
    )
  }
}

const styles = {
  textAlign: 'center'
}

import React from 'react'
import {Link} from 'react-router'
require('../../public/style.css')

import LangButton from '../common/langbutton'
import List from '../../containers/List'

export default class LearnEnv extends React.Component {
  render () {
    return (
      <div>
        <h1>Hello LearnEnv</h1>
        <Link to='/' style={styles}><LangButton text='hello' backgroundColor='red' /></Link>
        <List />
      </div>
    )
  }
}

const styles = {
  textDecoration: 'none',
  color: 'black'
}

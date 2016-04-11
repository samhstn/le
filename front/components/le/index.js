import React from 'react'
import {Link} from 'react-router'
require('../../public/style.css')

import LangButton from '../common/langbutton'
import LeftList from '../../containers/leftList'
import RightList from '../../containers/rightList'

export default class LearnEnv extends React.Component {
  render () {
    return (
      <div>
        <h1>Hello LearnEnv</h1>
        <Link to='/' style={styles}><LangButton text='hello' backgroundColor='red' /></Link>
        <LeftList />
        <RightList />
      </div>
    )
  }
}

const styles = {
  textDecoration: 'none',
  color: 'black'
}

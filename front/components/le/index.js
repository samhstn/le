import React from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import {selectWord} from '../../actions/index'
import {bindActionCreators} from 'redux'
require('../../public/style.css')

import LangButton from '../common/langbutton'
import LeftList from '../../containers/leftList'
import RightList from '../../containers/rightList'

class LearnEnv extends React.Component {
  renderList () {
    return (
      <div>
        <LeftList />
        <RightList />
      </div>
    )
  }

  render () {
    return (
      <div>
        <h1>Hello LearnEnv</h1>
        <Link to='/' style={styles}><LangButton text='hello' backgroundColor='red' /></Link>
        {this.renderList()}
      </div>
    )
  }
}

LearnEnv.propTypes = {
  words: React.PropTypes.array,
  selectWord: React.PropTypes.func
}

LearnEnv.defaultProps = {
  words: [],
  selectWord: () => {}
}

const styles = {
  textDecoration: 'none',
  color: 'black'
}

function mapStateToProps (state) {
  // Whatever is returned is going to show up as props inside BookList
  return {
    words: state.words
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({selectWord: selectWord}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(LearnEnv)

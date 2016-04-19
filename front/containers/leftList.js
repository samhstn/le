import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { selectWord } from '../actions/index'
require('../public/style.css')

class LeftList extends Component {
  render () {
    return (
      <ul className='leftInput'>
      {this.props.words.slice(0, 5).map((word, i) => {
        return (
          <li key={i}
            className='left'
            onClick={() => {this.props.selectWord(i)}}
          >{word.left}</li>
        )
      })}
      </ul>
    )
  }
}

function mapStateToProps (state) {
  return {
    words: state.words,
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({selectWord}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(LeftList)

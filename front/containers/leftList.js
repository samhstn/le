import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import selectWord from '../actions/index'

export default class LeftList extends Component {
  render () {
    return (
      <ul className='leftInput'>
      {this.props.words.slice(0, 5).map((word) => {
        return (
          <li
            key={word.left}
            className='left'
            onClick={() => {this.props.selectWord(word)}}
          >{word.left}</li>
        )
      })}
      </ul>
    )
  }
}

function mapStateToProps (state) {
  return {
    words: state.words
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({selectWord: selectWord}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(LeftList)

import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import selectWord from '../actions/index'

export default class LeftList extends Component {
  render () {
    return (
      <div>
        <ul className='leftInput'>
        {this.props.words.slice(0, 5).map((word, i) => {
          return (
            <li
              key={i}
              className='left'
              onClick={() => {this.props.selectWord(word)}}
            >{word.left}</li>
          )
        })}
        </ul>
        <ul className='rightInput'>
          {this.props.words.slice(0, 5).map((word, i) => {
            return (
              <li
                key={i}
                className='right'
              >{word.left}</li>
            )
          })}
        </ul>
      </div>
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

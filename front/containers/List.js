import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { selectWord } from '../actions/index'

class List extends Component {
  render () {
    return (
      <div>
        <ul className='leftInput'>
        {this.props.words.slice(0, 5).map((word, i) => {
          return (
            <li
              key={i}
              className='left'
              onClick={() => {this.props.selectWord(i)}}
            >{word.left}</li>
          )
        })}
        </ul>
        <ul className='rightInput'>
          {this.props.words.slice(0, 5).map((word, i) => {
            const visibility = !this.props.showing[i] ? 'hidden' : 'visible'
            return (
              <li
                key={i}
                className='right'
                style={{visibility: visibility}}
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
    words: state.words,
    showing: state.showing
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({selectWord}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(List)

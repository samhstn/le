import React, { Component } from 'react'
import { connect } from 'react-redux'
require('../public/style.css')

class RightList extends Component {
  render () {
    return (
      <ul className='rightInput'>
      {this.props.words.slice(0, 5).map((word, i) => {
        return (
          <li key={i}
            className='right'
            style={{visibility: this.props.showing[i] ? 'visible' : 'hidden'}}
          >{word.right}</li>
        )
      })}
      </ul>
    )
  }
}

function mapStateToProps (state) {
  return {
    words: state.words,
    showing: state.showing
  }
}

export default connect(mapStateToProps)(RightList)

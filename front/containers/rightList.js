import React, {Component} from 'react'
import {connect} from 'react-redux'

export default class RightList extends Component {
  render () {
    return (
      <ul className='rightInput'>
        {this.props.words.slice(0, 5).map((word) => {
          return (
            <li
              key={word.left}
              className='right'
            >{word.right}</li>
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

export default connect(mapStateToProps)(RightList)

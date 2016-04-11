import React, {Component} from 'react'

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

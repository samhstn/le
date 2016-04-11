import React, {Component} from 'react'

export default class LeftList extends Component {
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

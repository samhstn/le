import React from 'react'
import NavButton from './navbutton.js'
import LangButton from './langbutton.js'

class Components extends React.Component {
  render () {
    return (
      <div>
        <LangButton />
        <NavButton />
      </div>
    )
  }
}

export default Components

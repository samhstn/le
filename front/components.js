import React from 'react'
import NavButton from './navbutton.js'
import LangButton from './langbutton.js'
import LangDir from './langdir.js'

class Components extends React.Component {
  render () {
    return (
      <div>
        <LangButton />
        <NavButton />
        <LangDir />
        <LangDir />
      </div>
    )
  }
}

export default Components

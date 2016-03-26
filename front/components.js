import React from 'react'
import Home from './components/home/index.js'
import Admin from './components/admin/index.js'
import Le from './components/le/index.js'
import Settings from './components/settings/index.js'

class Components extends React.Component {
  render () {
    return (
      <div>
        <Home />
        <Admin />
        <Le />
        <Settings />
      </div>
    )
  }
}

export default Components

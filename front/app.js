import React, { Component } from 'react'

export default class App extends Component {
  render () {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}

App.propTypes = {
  children: React.PropTypes.node
}

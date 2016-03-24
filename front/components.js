import React from 'react'
import { Link } from 'react-router'

class Components extends React.Component {
  render () {
    return (
      <div>
        <Link to={this.props.children} />
        {this.props.children}
      </div>
    )
  }
}

export default Components

import React from 'react'

class Components extends React.Component {
  render () {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}

export default Components

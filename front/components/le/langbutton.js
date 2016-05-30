import React, { Component, PropTypes } from 'react'

export default class LangButton extends Component {
  render () {
    return (
      <div style={styles}>
        {this.props.text}
      </div>
    )
  }
}

LangButton.propTypes = {
  text: PropTypes.string
}

LangButton.defaultProps = {
  text: 'hello'
}

const styles = {
  fontSize: '5vmin',
  border: '3px solid red',
  textAlign: 'center',
  width: '48%',
  height: '12%',
  borderRadius: '5%',
  paddingTop: '2%',
  textDecoration: 'none'
}

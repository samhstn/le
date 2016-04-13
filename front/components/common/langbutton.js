import React, { Component, PropTypes } from 'react'

export default class LangButton extends Component {
  render () {
    styles.backgroundColor = this.props.backgroundColor
    return (
      <div style={styles}>
        {this.props.text}
      </div>
    )
  }
}

LangButton.propTypes = {
  backgroundColor: PropTypes.string,
  text: PropTypes.string
}

LangButton.defaultProps = {
  backgroundColor: 'red',
  text: 'hello'
}

const styles = {
  fontSize: '5vmin',
  border: '1px solid black',
  textAlign: 'center',
  width: '48%',
  height: '12%',
  borderRadius: '5%',
  paddingTop: '2%',
  textDecoration: 'none'
}

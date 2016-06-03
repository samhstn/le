import React, { Component } from 'react'

export default class LangDirButton extends Component {
  render () {
    return (
      <div style={styles}>{this.props.text}</div>
    )
  }
}

LangDirButton.propTypes = {
  text: React.PropTypes.string.isRequired
}

const styles = {
  textAlign: 'center',
  fontFamily: 'monospace',
  fontSize: '24px',
  backgroundColor: 'green',
  width: '90%',
  height: '6vh',
  padding: '3%',
  borderRadius: '20%',
  float: 'left',
  display: 'inline'
}

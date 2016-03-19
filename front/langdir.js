import React from 'react'

class LangDirButton extends React.Component {
  render () {
    return <div style={styles}>{this.props.text}</div>
  }
}

LangDirButton.propTypes = {
  text: React.PropTypes.string
}

LangDirButton.defaultProps = {
  text: 'DE -> EN'
}

const styles = {
  textAlign: 'center',
  fontFamily: 'monospace',
  fontSize: '24px',
  backgroundColor: 'green',
  width: '30%',
  height: '6vh',
  padding: '3%',
  borderRadius: '20%'
}

export default LangDirButton

import React from 'react'

class LangButton extends React.Component {
  render () {
    styles.backgroundColor = this.props.backgroundColor
    return <div style={styles}>{this.props.text}</div>
  }
}

LangButton.propTypes = {
  backgroundColor: React.PropTypes.string,
  text: React.PropTypes.string
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
  paddingTop: '2%'
}

export default LangButton

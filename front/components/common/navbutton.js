import React, { Component, PropTypes } from 'react'

export default class NavButton extends Component {
  render () {
    styles.top = this.props.top
    styles.left = this.props.left
    return (
      <div style={styles} onClick={this.props.click}>
        {this.props.text}
      </div>
    )
  }
}

NavButton.propTypes = {
  text: PropTypes.string,
  top: PropTypes.string,
  left: PropTypes.string
}

NavButton.defaultProps = {
  text: 'Home',
  top: 'inherit',
  left: 'inherit'
}

const styles = {
  fontSize: '36px',
  border: '1px solid black',
  backgroundColor: 'brown',
  width: '12%',
  height: '5%',
  padding: '4%',
  textAlign: 'center',
  position: 'absolute',
  borderRadius: '50%'
}

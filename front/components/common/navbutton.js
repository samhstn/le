import React from 'react'

class NavButton extends React.Component {
  render () {
    styles.top = this.props.top
    styles.left = this.props.left
    return (
      <div style={styles}>
        {this.props.text}
      </div>
    )
  }
}

NavButton.propTypes = {
  text: React.PropTypes.string,
  top: React.PropTypes.string,
  left: React.PropTypes.string
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

export default NavButton

import React from 'react';

class NavButton extends React.Component {
  render () {
    return (
      <div style={styles}>
        {this.props.text}
      </div>
    );
  }
}

NavButton.propTypes = {
  text: React.PropTypes.string
};

NavButton.defaultProps = {
  text: 'Home'
};

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
};

export default NavButton;

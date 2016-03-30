import React from 'react';
import LangDirButton from '../common/langdir';
import Navbutton from '../common/navbutton';
import { Link } from 'react-router';
require('../../css/grid');

class Home extends React.Component {
  render() {
    return(
      <div>
        <h1 style={{textAlign: 'center'}}>Home Page</h1>
        <h2 style={{textAlign: 'center'}}>Select a language direction</h2>
        <Link to="/le" style={styles}><LangDirButton text="DE -> EN" /></Link>
        <Link to="/le" style={styles}><LangDirButton text="EN -> DE" /></Link>
        <Link to="/admin" style={styles}><Navbutton text="Admin" /></Link>
      </div>
    )
  }
}

const styles = {
  textDecoration: 'none',
  color: 'black',
  display: 'inlineBlock',
};

export default Home;

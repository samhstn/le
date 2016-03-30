import React from 'react';
import LangDirButton from '../common/langdir';
import Navbutton from '../common/navbutton';
import { Link } from 'react-router';

class Home extends React.Component {
  render() {
    return(
      <div>
        <h1>Home Page</h1>
        <h1>Select a language direction</h1>
        <Link to="/le" style={styles}><LangDirButton text="DE -> EN" /></Link>
        <Link to="/le" style={styles}><LangDirButton text="EN -> DE" /></Link>
        <Link to="/admin" style={styles}><Navbutton text="Admin" /></Link>
      </div>
    )
  }
}

const styles = {
  textDecoration: "none",
  color: "black"
};

export default Home;

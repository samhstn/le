import React from 'react';
import { Link } from 'react-router';
import LangButton from '../common/langbutton';

class LearnEnv extends React.Component {
  render() {
    return (
      <div>
        <Link to="/" style={styles}><LangButton text="hello" backgroundColor="red" /></Link>
      </div>
    );
  }
}

const styles = {
  textDecoration: "none",
  color: "black"
};

export default LearnEnv;

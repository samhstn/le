import React from 'react';
import { Link } from 'react-router';
import LangButton from '../../components/common/langbutton';
import { connect } from 'react-redux';

class LearnEnv extends React.Component {
  renderList(){
    return this.props.words.slice(0,5).map((word) => {
      return <li key={word.word}>{word.word}</li>
    });
  }

  render() {
    return (
      <div>
        <h1>Hello LearnEnv</h1>
        <Link to="/" style={styles}><LangButton text="hello" backgroundColor="red" /></Link>
        <ul>
          {this.renderList()}
        </ul>
      </div>
    );
  }
}

const styles = {
  textDecoration: "none",
  color: "black"
};

function mapStateToProps(state) {
  // Whatever is returned is going to show up as props inside BookList
  return {
    words: state.words
  };
}

export default connect(mapStateToProps)(LearnEnv);

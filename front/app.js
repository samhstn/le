import React from 'react';
import { Link } from 'react-router';

class App extends React.Component {
  render() {
    return(
      <div>
        <Link to="admin">Admin</Link>
        {this.props.children}
      </div>
    )
  }
}

export default App;

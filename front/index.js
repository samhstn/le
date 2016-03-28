import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import routes from './routes';

const rootElement = document.getElementById('container')

ReactDOM.render((
  <Router history={browserHistory} routes={routes} />
), rootElement);

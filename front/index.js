import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import routes from './routes';

const rootElement = document.getElementById('container')

render((
  <Router history={browserHistory} route={routes} />
), rootElement);

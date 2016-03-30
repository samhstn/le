import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './app';
import Home from './components/home/index';
import Admin from './components/admin/index';
import LearnEnv from './components/le/index';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="admin" component={Admin} />
    <Route path="le" component={LearnEnv} />
  </Route>
);
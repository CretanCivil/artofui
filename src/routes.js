import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './containers/App/App';
import HomePage from './containers/HomePage/HomePage';
import ConnectedUsersPage from './containers/UsersPage/UsersPage';
//import NotFoundPage from './components/NotFoundPage/NotFoundPage';
import ChartsPage from './containers/ChartsPage/ChartsPage';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={ChartsPage}/>
    <Route path="charts" component={ChartsPage}/>
    <Route path="users" component={ConnectedUsersPage}/>
    <Route path="*" component={HomePage}/>
  </Route>
);

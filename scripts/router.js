import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

import AuthorizationForm from './containers/AuthorizationFormContainer';
import AppView from './components/app';

export default function Root() {
  return (
    <Router history={browserHistory}>
      <Route path="/user" component={AppView} />
      <Route path="/:form" component={AuthorizationForm} />
    </Router>
  );
}

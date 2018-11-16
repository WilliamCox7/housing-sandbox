/* PACKAGES */
import React from "react";
import { render } from "react-dom";
import { Provider} from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import { Router, Route, hashHistory } from "react-router";
import rootReducer from './rootReducer';

/* COMPONENTS */
import App from './App.js';
import IsLoggedIn from './components/IsLoggedIn/IsLoggedIn';
import IsAdmin from './components/IsAdmin/IsAdmin';
import Campuses from './components/Campuses/Campuses';
import Apartments from './components/Apartments/Apartments';
import Waitlist from './components/Waitlist/Waitlist';
import WorkOrders from './components/WorkOrders/WorkOrders';
import PortalAdmin from './components/PortalAdmin/PortalAdmin';

/* STORE - REDUX */
let store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
)

/* ROUTES */
render (
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route component={App}>
        <Route component={IsLoggedIn}>
          <Route component={IsAdmin}>
            <Route path="/" component={Campuses} />
            <Route path="/apartments/:city" component={Apartments} />
            <Route path="/waitlist" component={Waitlist} />
            <Route path="/workorders" component={WorkOrders} />
            <Route path="/portaladmin" component={PortalAdmin} />
          </Route>
        </Route>
      </Route>
    </Router>
  </Provider>
  , document.getElementById('root')
);

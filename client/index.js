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
import Login from './components/Login/Login';
import Logout from './components/Login/Logout';
import IsLoggedIn from './components/IsLoggedIn/IsLoggedIn';
import IsAdmin from './components/IsAdmin/IsAdmin';
import Campuses from './components/Campuses/Campuses';
import Apartments from './components/Apartments/Apartments';
import Waitlist from './components/Waitlist/Waitlist';
import WorkOrders from './components/WorkOrders/WorkOrders';
import IsStudent from './components/IsStudent/IsStudent';
import Portal from './components/Portal/Portal';
import Tour from './components/Tour/Tour';
import FAQ from './components/FAQ/FAQ';
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
        <Route path="/login" component={Login} />
        <Route path="/logout" component={Logout} />
        <Route component={IsLoggedIn}>
          <Route component={IsAdmin}>
            <Route path="/" component={Campuses} />
            <Route path="/apartments/:city" component={Apartments} />
            <Route path="/waitlist" component={Waitlist} />
            <Route path="/workorders" component={WorkOrders} />
            <Route path="/portaladmin" component={PortalAdmin} />
          </Route>
          <Route component={IsStudent}>
            <Route path="/portal" component={Portal} />
            <Route path="/contract" component={Portal} />
            <Route path="/tour" component={Tour} />
            <Route path="/faq" component={FAQ} />
          </Route>
        </Route>
      </Route>
    </Router>
  </Provider>
  , document.getElementById('root')
);

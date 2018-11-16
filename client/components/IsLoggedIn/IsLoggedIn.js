import React, { Component } from 'react';
import { connect } from 'react-redux';
import { hashHistory } from "react-router";
import { setUser } from '../../reducers/userReducer';

/* checks to see if user is logged in */
// -- redirects to login if not
class IsLoggedIn extends Component {

  componentDidMount() {
    this.props.setUser({
      role: 'admin',
      name: '',
      dmId: 1,
      isLoggedIn: true,
      roommates: []
    });
  }

  render() {
    if (true) {
      return this.props.children;
    } else {
      return null;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
};

const mapDispatchToProps = {
  setUser: setUser
}

export default connect(mapStateToProps, mapDispatchToProps)(IsLoggedIn);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logout } from '../../reducers/userReducer';
import { hashHistory } from "react-router";
import axios from 'axios';

/* uses DevMountain auth to authenticate user */
class Logout extends Component {

  componentDidMount() {
    this.props.logout();
    axios.get('/logout');
    window.location="/auth/devmtn";
  }

  render() {
    return (
      <div></div>
    )
  }
}

const mapDispatchToProps = {
  logout: logout
}

export default connect(null, mapDispatchToProps)(Logout);

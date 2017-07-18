import React, { Component } from 'react';
import { connect } from 'react-redux';
import { hashHistory } from "react-router";

/* uses DevMountain auth to authenticate user */
class Login extends Component {

  componentDidMount() {
    if (this.props.user.isLoggedIn) {
      hashHistory.replace("/");
    }
  }

  render() {
    return (
      <div className="Login">
        Login
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
};

export default connect(mapStateToProps)(Login);

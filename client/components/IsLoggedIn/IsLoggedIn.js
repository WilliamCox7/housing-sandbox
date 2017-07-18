import React, { Component } from 'react';
import { connect } from 'react-redux';
import { hashHistory } from "react-router";
import { setUser } from '../../reducers/userReducer';
import axios from 'axios';

/* checks to see if user is logged in */
// -- redirects to login if not
class IsLoggedIn extends Component {

  componentDidMount() {
    if (!this.props.user.isLoggedIn) {
      axios.get('/auth/me').then((data)=>{
          const userData = data.data;
          this.props.setUser({
             role: ((userData) => {
               var userRole = 'student';
               userData.roles.forEach((role) => {
                 if (role.role === 'admin') { userRole = 'admin'; }
               });
               return userRole;
             })(userData),
             name: '',
             dmId: userData.id,
             isLoggedIn: true,
             roommates: []
           });
      }).catch(err=>{
        window.location="/auth/devmtn"
      });
    }
  }

  render() {
    if (this.props.user.isLoggedIn) {
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

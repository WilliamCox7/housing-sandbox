import React, { Component } from 'react';
import { connect } from 'react-redux';
import { hashHistory } from "react-router";
import { setCurStudent } from '../../reducers/studentReducer';
import { setRoommates, setName } from '../../reducers/userReducer';
import { setWorkOrders } from '../../reducers/workOrderReducer';
import { stuFAQ, stuTour } from '../../reducers/portalReducer';
import axios from 'axios';
import Nav from '../Nav/Nav';

/* checks to see if user is a student */
// redirects to admin page if not
class IsStudent extends Component {

  componentDidMount() {
    if (this.props.user.role === 'admin') {
      hashHistory.replace("/");
    } else {
      axios.get('/student/getStudent/'+this.props.user.dmId).then((result) => {
        this.props.setName(result.data.student.name)
        this.props.setCurStudent(result.data.student);
        this.props.setRoommates(result.data.roommates);
        this.props.setWorkOrders(result.data.workorders);
        this.props.stuFAQ(result.data.faq, result.data.student.campus);
        this.props.stuTour(result.data.tour, result.data.student.campus);
      });
    }
  }

  render() {
    if (this.props.user.role === 'student') {
      return (
        <div>
          <Nav loc={this.props.location.pathname} />
          {this.props.children}
        </div>
      )
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
  setCurStudent: setCurStudent,
  setRoommates: setRoommates,
  setWorkOrders: setWorkOrders,
  stuFAQ: stuFAQ,
  stuTour: stuTour,
  setName: setName
}

export default connect(mapStateToProps, mapDispatchToProps)(IsStudent);

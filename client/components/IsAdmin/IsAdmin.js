import React, { Component } from 'react';
import { connect } from 'react-redux';
import { hashHistory } from "react-router";
import { setCampuses, setCity } from '../../reducers/campusReducer';
import { setApartments } from '../../reducers/apartmentReducer';
import { setWorkOrders } from '../../reducers/workOrderReducer';
import { setFAQ, setTour } from '../../reducers/portalReducer';
import axios from 'axios';
import Nav from '../Nav/Nav';
const apartments = require('./apartments.json');
const rooms = require('./rooms.json');
const students = require('./students.json');
const workorders = require('./workorders.json');
const faq = require('./faq.json');
const tour = require('./tour.json');

/* checks to see if user is an admin */
// redirects to students if not
class IsAdmin extends Component {

  componentDidMount() {
    if (this.props.user.role === 'student') {
      hashHistory.replace("/portal");
    } else {
      // axios.get('/admin/getAdmin').then((result) => {
      //   this.props.setCampuses(result.data.campuses);
      //   if (this.props.location.pathname.indexOf('apartments') > -1) {
      //     var pathInfo = this.props.location.pathname.split('/');
      //     var setCity = false;
      //     result.data.campuses.forEach((campus) => {
      //       if (campus.city === pathInfo[2]) {
      //         this.props.setCity(pathInfo[2]);
      //         setCity = true;
      //       }
      //     });
      //     if (!setCity) {
      //       hashHistory.replace("/");
      //     }
      //   }
      //   this.props.setApartments({
      //     apartments: result.data.apartments,
      //     rooms: result.data.rooms,
      //     students: result.data.students
      //   });
      //   // var test = result.data.students.map((stud) => {
      //   //   if (stud.campus === 'Provo') {
      //   //     return stud;
      //   //   }
      //   // });
      //   console.log(JSON.stringify(result.data.tour));
      //   this.props.setWorkOrders(result.data.workorders);
      //   this.props.setFAQ(result.data.faq);
      //   this.props.setTour(result.data.tour);
      // });
      this.props.setApartments({
        apartments: apartments,
        rooms: rooms,
        students: students
      })
      this.props.setWorkOrders(workorders);
      this.props.setFAQ(faq);
      this.props.setTour(tour);
    }
  }

  render() {
    if (this.props.user.role === 'admin') {
      return (
        <div>
          <Nav loc={this.props.location.pathname} />
          {this.props.children}
        </div>
      );
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
  setCampuses: setCampuses,
  setCity: setCity,
  setApartments: setApartments,
  setWorkOrders: setWorkOrders,
  setFAQ: setFAQ,
  setTour: setTour
}

export default connect(mapStateToProps, mapDispatchToProps)(IsAdmin);

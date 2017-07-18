import React, { Component } from 'react';
import { connect } from 'react-redux';
import StudentCard from '../Apartments/StudentCard/StudentCard';
import ApproveZone from './ApproveZone/ApproveZone';
import StudentModal from '../StudentModal/StudentModal';
import moment from 'moment';
import './Waitlist.scss';

/* shows a breakdown of students waiting for housing based on cohort */
class Waitlist extends Component {

  constructor(props) {
    super(props);
    this.showStudents = this.showStudents.bind(this);
  }

  /* toggles to show students for a cohort's waiting list */
  showStudents(e) {
    var element = e.currentTarget.parentElement.children[1]
    if (element.style.display === 'none' || !element.style.display) {
      element.style.display = 'flex';
      e.currentTarget.style.background = '#61DAFB';
    } else {
      element.style.display = 'none';
      e.currentTarget.style.background = '#525252';
    }
  }

  render() {

    /* filters students for the selected campus */
    var filteredWaitlist = this.props.apartment.waitlist.filter((cohort) => {
      if (cohort.campus === this.props.campus.city) { return true; }
    });

    /* creates list of students and container for list */
    var waitlist = filteredWaitlist.map((cohort, i) => {
      var students = cohort.students.map((student, j) => {
        return (
          <div key={j} className="list-item">
            <span>{j+1}</span>
            <StudentCard std={student} type={"res"} />
          </div>
        )
      });
      return (
        <div key={i} className="cohort-waitlist">
          <div onClick={this.showStudents} className="cohort-drop-down">
            <div>{cohort.name}</div>
            <div>{moment(cohort.starts).format("MM/DD/YYYY")} - {moment(cohort.graduates).format("MM/DD/YYYY")}</div>
          </div>
          <div className="waitlist-students">
            {students}
          </div>
        </div>
      )
    });

    return (
      <div className="waitlist-container">
        <div className="Waitlist">
          <ApproveZone />
          <div className="waitlist-window">
            {waitlist}
          </div>
        </div>
        <StudentModal comp={"Waitlist"} />
      </div>
    )
    
  }
}

const mapStateToProps = (state) => {
  return {
    apartment: state.apartment,
    campus: state.campus
  }
};

export default connect(mapStateToProps)(Waitlist);

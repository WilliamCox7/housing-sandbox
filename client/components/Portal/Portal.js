import React, { Component } from 'react';
import { connect } from 'react-redux';
import OnWaitingList from './OnWaitingList/OnWaitingList';
import Pending from './Pending/Pending';
import Assigned from './Assigned/Assigned';
import './Portal.scss';

/* the home page for the student user */
class Portal extends Component {
  render() {

    /* depending on student's status, load certain component */
    if (this.props.student.status === 'waiting') {
      return (
        <div className="Portal">
          <OnWaitingList />
        </div>
      )
    } else if (this.props.student.status === 'pending') {
      return (
        <div className="Portal">
          <Pending status={this.props.student.status} h1={0} />
        </div>
      )
    } else if (this.props.student.status === 'completed') {
      return (
        <div className="Portal">
          <Pending status={this.props.student.status} h1={1} />
        </div>
      )
    } else if (this.props.student.status === 'assigned') {
      return (
        <div className="Portal">
          <Assigned />
        </div>
      )
    } else {
      return null;
    }

  }
}

const mapStateToProps = (state) => {
  return {
    student: state.student
  }
};

export default connect(mapStateToProps)(Portal);

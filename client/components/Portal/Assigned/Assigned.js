import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addWorkOrder } from '../../../reducers/workOrderReducer';
import WorkOrder from '../../WorkOrders/WorkOrder/WorkOrder';
import moment from 'moment';
import axios from 'axios';
import './Assigned.scss';

/* shown when student has officially been assigned housing */
class Assigned extends Component {

  constructor(props) {
    super(props);
    this.state = {
      subject: 'Appliance',
      body: ''
    }
    this.updateSubject = this.updateSubject.bind(this);
    this.updateBody = this.updateBody.bind(this);
    this.submit = this.submit.bind(this);
  }

  /* stores potential message to send as a work order */
  updateBody(e) {
    this.setState({body: e.currentTarget.value});
  }

  /* stores potential subject for message to send as a work order */
  updateSubject(e) {
    this.setState({subject: e.currentTarget.value});
  }

  /* when student submits a work order */
  submit() {
    if (this.state.body) {
      this.props.addWorkOrder({
        name: this.props.student.name,
        apartment: this.props.student.apartment,
        subject: this.state.subject,
        body: this.state.body,
        posted: moment(new Date()).format('MM-DD-YYYY'),
        dmId: this.props.student.dmId,
        campus: this.props.student.campus,
        manager: this.props.student.manager,
        isComplete: false
      });
      axios.post('/workorders/insert', {
        name: this.props.student.name,
        apartment: this.props.student.apartment,
        subject: this.state.subject,
        body: this.state.body,
        posted: moment(new Date()).format('MM-DD-YYYY'),
        dmId: this.props.student.dmId,
        campus: this.props.student.campus,
        manager: this.props.student.manager,
        isComplete: false
      });
      this.setState({body: ''});
    }
  }

  render() {

    /* gets roommates of user */
    var residents = this.props.user.roommates.filter((roommate) => {
      if (roommate.moveFrom === this.props.student.moveFrom) { return true; }
    });

    var roommates = residents.map((res, i) => {
      return (
        <div key={i} className="roommate">
          <div className="pic">
            {res.pic ? (
              <img src={res.pic} />
            ) : (
              <i className="fa fa-camera" aria-hidden="true"></i>
            )}
          </div>
          <div className="info">
            <p>{res.name}</p>
          </div>
        </div>
      )
    });

    /* gets work orders that are in progress for user */
    var workorders = [];
    this.props.workorders.workorders.forEach((wo, i) => {
      if (!wo.isComplete) {
        workorders.push(<WorkOrder key={i} wo={wo} />);
      }
    });

    /* displays actual checkin and checkout dates */
    var checkin, checkout;
    if (this.props.student.starts) {
      var s = this.props.student.starts.split("-");
      s[0] = Number(s[0]);
      s[1] = Number(s[1])-1
      s[2] = Number(s[2])-3; // checkin is actually 3 days before 1st day
      checkin = new Date(s[0], s[1], s[2]);
      var g = this.props.student.graduates.split("-");
      g[0] = Number(g[0]);
      g[1] = Number(g[1])-1
      g[2] = Number(g[2])+1; // checkout is day after graduation
      checkout = new Date(g[0], g[1], g[2]);
    }

    return (
      <div className="Assigned">
        <div className="left-section">
          <div className="text-section">
            <p>
              <span>Check In: </span>
              {moment(checkin).format("dddd, MMMM Do YYYY")}
            </p>
            <p>
              <span>Check Out:  </span>
              {moment(checkout).format("dddd, MMMM Do YYYY")}
            </p>
          </div>
          <div className="text-section">
            <p><span>Door Code:  </span>{this.props.student.doorCode}</p>
          </div>
          <div className="text-section">
            <p>Submit a Work Order</p>
          </div>
          <div className="wo-section">
            <select onChange={this.updateSubject}>
              <option>Appliance</option>
              <option>Heat/AC</option>
              <option>Gas</option>
              <option>Water</option>
              <option>Furniture</option>
              <option>Student Issues</option>
              <option>Other</option>
            </select>
            <textarea onChange={this.updateBody}
              value={this.state.body}>
            </textarea>
            <button onClick={this.submit}>Submit</button>
          </div>
          <div className="current-wo">
            {workorders.length > 0 ? (
              <div className="current-wo-title">In Progress</div>
            ) : (null)}
            {workorders}
          </div>
        </div>
        <div className="right-section">
          {roommates}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    student: state.student,
    user: state.user,
    workorders: state.workorders
  }
}

const mapDispatchToProps = {
  addWorkOrder: addWorkOrder
}

export default connect(mapStateToProps, mapDispatchToProps)(Assigned);

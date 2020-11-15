import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { DragSource } from 'react-dnd';
import { moveStudent, approveStudent }
  from '../../../reducers/apartmentReducer';
import ItemTypes from './ItemTypes';
import { setCurStudent } from '../../../reducers/studentReducer';
import './StudentCard.scss';

/* establishes what is being 'dragged' */
const studentSource = {

  beginDrag(props) {
    return {
      std: props.std //the student being dragged
    }
  },

  /* what happens when student is 'dropped' */
  endDrag(props, monitor, StudentCard) {
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();
    if (dropResult) {

      /* when a student is dropped into an apartment/room */
      if (dropResult.zone === 'Drop') {

        /* if there are still spots open for current residents */
        if (dropResult.numResidents < dropResult.capacity) {
          StudentCard.dispatchProps.moveStudent(
            item.std, dropResult.zoneId, dropResult.roomId, "residents"
          );
          var updatedStu = item.std;
          updatedStu.apartment = dropResult.address;
          updatedStu.zoneId = dropResult.zoneId,
          updatedStu.roomId = dropResult.roomId,
          updatedStu.inApt = true;
          updatedStu.moveFrom = 'residents';
          updatedStu.status = 'assigned';
        }

        /* if no more spots available, student is in line for next cohort */
        else if (dropResult.numNext < dropResult.capacity) {
          StudentCard.dispatchProps.moveStudent(
            item.std, dropResult.zoneId, dropResult.roomId, "nextCohort"
          );
          var updatedStu = item.std;
          updatedStu.apartment = dropResult.address;
          updatedStu.zoneId = dropResult.zoneId,
          updatedStu.roomId = dropResult.roomId,
          updatedStu.inApt = true;
          updatedStu.moveFrom = 'nextCohort';
          updatedStu.status = 'assigned';
        }
      }

      /* when a student is 'approved' to be moved off the waiting list */
      else {
        StudentCard.dispatchProps.approveStudent(item.std.id);
        var updatedStu = item.std;
        if (updatedStu.home && updatedStu.money) {
          updatedStu.status = 'completed'; // means they have completed contract
        } else {
          updatedStu.status = 'pending'; // waiting on contract/deposit
        }
      }
    }
  }

}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

/* card representing a student */
class StudentCard extends Component {

  constructor(props) {
    super(props);
    this.showModal = this.showModal.bind(this);
  }

  /* shows a modal to be able to edit the selected student */
  showModal(e) {
    this.props.setCurStudent(this.props.std);
    var element = document.getElementsByClassName('modal')[0];
    element.style.display = 'flex';
    document.body.style.overflow = "hidden";
  }

  render() {

    const { connectDragSource, isDragging } = this.props;

    /* shows more condensed representation if student is not current resident */
    if (this.props.type === "next") {
      return connectDragSource(
        <div className="upNext" onClick={this.showModal}>
          <span className="left">
            {this.props.std.name} - {this.props.std.cohort}
          </span>
          <span className="right">{this.props.std.starts}</span>
        </div>
      )
    }

    /* default representation of student */
    else {
      return connectDragSource(
        <div className="StudentCard" onClick={this.showModal}>
          <p className="stu-name">{this.props.std.name}</p>
          <div className="stu-info">
            <p className="cohort">{this.props.std.cohort}</p>
            <div className="stu-icons">
              {this.props.std.male ? (
                <i className="fa fa-male" aria-hidden="true"></i>
              ) : (
                <i className="fa fa-female" aria-hidden="true"></i>
              )}
              {this.props.std.money ? (
                <i className="fa fa-money" style={{color: 'white'}}
                  aria-hidden="true"></i>
              ) : (
                <i className="fa fa-money" aria-hidden="true"></i>
              )}
              {this.props.std.beer ? (
                <i className="fa fa-beer" style={{color: 'white'}}
                  aria-hidden="true"></i>
              ) : (
                <i className="fa fa-beer" aria-hidden="true"></i>
              )}
              {this.props.std.home ? (
                <i className="fa fa-home" style={{color: 'white'}}
                  aria-hidden="true"></i>
              ) : (
                <i className="fa fa-home" aria-hidden="true"></i>
              )}
            </div>
          </div>
        </div>
      )
    }

  }
}

StudentCard.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => {
  return {
    apartment: state.apartment
  }
};

const mapDispatchToProps = {
  setCurStudent: setCurStudent,
  moveStudent: moveStudent,
  approveStudent: approveStudent
}

StudentCard = connect(mapStateToProps, mapDispatchToProps)(StudentCard);
export default DragSource(ItemTypes.Student, studentSource, collect)(StudentCard);

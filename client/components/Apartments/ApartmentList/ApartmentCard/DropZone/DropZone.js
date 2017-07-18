import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ItemTypes from '../../../StudentCard/ItemTypes';
import StudentCard from '../../../StudentCard/StudentCard';
import { DropTarget } from 'react-dnd';
import './DropZone.scss';

/* what props to send when moving a student around */
const dropZone = {
  drop(props) {
    return {
      zoneId: props.aptId,
      roomId: props.roomId,
      address: props.address,
      capacity: props.room.capacity,
      numResidents: props.room.residents.length,
      numNext: props.room.nextCohort.length,
      zone: 'Drop'
    }
  }
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

/* space designed for 'dropping' students into apartments/rooms */
class DropZone extends Component {

  render() {

    var Residents = []; //holds students who are currently living in apartment
    var UpNext = []; //holds students who will be 'up next' for that apartment
    var key = 0;

    /* render the students already occupying the 'dropzone' */
    this.props.apartment.apartments.forEach((apt) => {
      if (apt.id === this.props.aptId) {
        apt.rooms.forEach((room) => {
          if (room.id === this.props.roomId) {
            room.residents.forEach((resident) => {
              Residents.push(
                <StudentCard std={resident} key={key} type={"res"} />
              );
              key++;
            });
            room.nextCohort.forEach((next) => {
              UpNext.push(
                <StudentCard std={next} key={key} type={"next"} />
              );
              key++;
            });
          }
        });
      }
    });

    const { connectDropTarget, isOver } = this.props;

    /* manages the height of the dropzone (based on room capacity) */
    var roomHeight = this.props.room.capacity * 74 + 10;
    roomHeight += this.props.room.capacity * 32;

    return connectDropTarget(
      <div className="DropZone" style={{height: roomHeight}}>
        {Residents}{UpNext}
      </div>
    )

  }
}

DropZone.propTypes = {
  isOver: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => {
  return {
    apartment: state.apartment
  }
};

DropZone = connect(mapStateToProps)(DropZone);
export default DropTarget(ItemTypes.Student, dropZone, collect)(DropZone);

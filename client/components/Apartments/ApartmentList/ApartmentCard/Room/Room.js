import React, { Component } from 'react';
import { connect } from 'react-redux';
import FlipCard from 'react-flipcard';
import { editRoom, removeRoom } from '../../../../../reducers/apartmentReducer';
import DropZone from '../DropZone/DropZone';
import axios from 'axios';
import './Room.scss';

/* separate container to specify the room a student is in */
class Room extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showRoom: false,
      form: {
        id: this.props.room.id,
        name: this.props.room.name,
        capacity: this.props.room.capacity,
        residents: this.props.room.residents,
        nextCohort: this.props.room.nextCohort
      }
    }
    this.flipRoom = this.flipRoom.bind(this);
    this.updateRoom = this.updateRoom.bind(this);
    this.removeRoom = this.removeRoom.bind(this);
    this.editRoom = this.editRoom.bind(this);
  }

  /* used for FlipCard to manage which side is showing */
  flipRoom() {
    this.setState({showRoom: !this.state.showRoom});
  }

  /* manages this.state when editing a room */
  updateRoom() {
    var newState = {
      id: this.props.room.id,
      name: this.refs.name.value,
      capacity: this.refs.capacity.value,
      residents: this.props.room.residents,
      nextCohort: this.props.room.nextCohort
    }
    this.setState({form: newState});
  }

  /* updates the room in the reducer and db */
  editRoom() {
    this.props.editRoom(this.props.aptId, this.props.room.id, {
      id: this.props.room.id,
      name: this.refs.name.value,
      capacity: this.refs.capacity.value,
      residents: this.props.room.residents,
      nextCohort: this.props.room.nextCohort
    });
    axios.post('/apartments/update', {
      collection: 'rooms',
      id: this.props.room.id,
      update: {
        apartment: this.props.aptId,
        name: this.refs.name.value,
        capacity: this.refs.capacity.value
      }
    });
    this.flipRoom();
  }

  /* deletes the room from the reducer and db */
  removeRoom() {
    this.props.removeRoom(this.props.aptId, this.props.room.id);
    axios.post('/apartments/remove', {
      collection: 'rooms',
      id: this.props.room.id
    });
    this.flipRoom();
  }

  render() {

    /* manages the height of the room (based on room capacity) */
    var roomHeight = this.props.room.capacity * 74;
    roomHeight += this.props.room.capacity * 32;

    return (
      <div className="roomCard" style={{height: roomHeight + 36}}>
        <FlipCard flipped={this.state.showRoom} disabled={true}>

          {/* Front Side */}
          <div className="apt-room">
            <span className="apt-header" onClick={this.flipRoom}>
              {this.props.room.name ? (this.props.room.name) : ("New Room")}
              <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
            </span>
            <DropZone address={this.props.address} aptId={this.props.aptId}
              roomId={this.props.room.id} room={this.props.room} />
          </div>

          {/* Back Side */}
          <div className="room-edit">
            <div className="room-form" style={{height: roomHeight + 10}}>
              <input ref="name" onChange={this.updateRoom}
                value={this.state.form.name} type="text"
                placeholder="name"
              />
              <input ref="capacity" onChange={this.updateRoom}
                value={this.state.form.capacity}
                type="text" placeholder="capacity"
              />
              <div className="buttons">
                <i onClick={this.flipRoom} className="fa fa-ban"
                  aria-hidden="true"
                ></i>
                <i onClick={this.removeRoom} className="fa fa-trash"
                  aria-hidden="true"
                ></i>
                <i onClick={this.editRoom} className="fa fa-floppy-o"
                  aria-hidden="true"
                ></i>
              </div>
            </div>
          </div>

        </FlipCard>
      </div>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    apartment: state.apartment
  }
};

const mapDispatchToProps = {
  editRoom: editRoom,
  removeRoom: removeRoom
}

export default connect(mapStateToProps, mapDispatchToProps)(Room);

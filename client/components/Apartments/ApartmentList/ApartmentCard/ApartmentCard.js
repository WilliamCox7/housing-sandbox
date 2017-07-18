import React, { Component } from 'react';
import { connect } from 'react-redux';
import { editApt, removeApt, addRoom, toggleGender }
  from '../../../../reducers/apartmentReducer';
import FlipCard from 'react-flipcard';
import axios from 'axios';
import Room from './Room/Room';
import './ApartmentCard.scss';

/* card that contains information for a single apartment */
class ApartmentCard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showCard: false,
      cardHeight: null,
      form: {
        id: this.props.apt.id,
        campus: this.props.apt.campus,
        street: this.props.apt.street,
        no: this.props.apt.no,
        city: this.props.apt.city,
        state: this.props.apt.state,
        zip: this.props.apt.zip,
        rooms: this.props.apt.rooms
      }
    }
    this.flipCard = this.flipCard.bind(this);
    this.editApt = this.editApt.bind(this);
    this.removeApt = this.removeApt.bind(this);
    this.update = this.update.bind(this);
    this.addRoom = this.addRoom.bind(this);
    this.showFront = this.showFront.bind(this);
    this.showBack = this.showBack.bind(this);
    this.toggleGender = this.toggleGender.bind(this);
  }

  /* changes gender to its opposite (manages count for waitlist) */
  toggleGender() {
    this.props.toggleGender(this.props.apt.id);
    axios.post('/apartments/update', {
      collection: 'apartments',
      id: this.props.apt.id,
      update: {
        campus: this.props.apt.campus,
        street: this.refs.street.value,
        no: this.refs.no.value,
        city: this.refs.city.value,
        state: this.refs.state.value,
        gender: this.props.apt.gender,
        zip: this.refs.zip.value
      }
    });
  }

  /* manages state for FlipCard */
  flipCard() {
    this.setState({showCard: !this.state.showCard});
  }

  /* shows back of the card when called */
  // also manages height of card when back is shown
  showBack(e) {
    var element = e.currentTarget.parentElement.parentElement.parentElement
    .parentElement.parentElement.parentElement.parentElement;
    this.setState({cardHeight: element.style.height});
    element.style.height = '275px';
    this.flipCard();
  }

  /* shows front of the card when called */
  showFront(e) {
    var element = e.currentTarget.parentElement.parentElement.parentElement
    .parentElement.parentElement.parentElement;
    element.style.height = this.state.cardHeight;
    this.flipCard();
  }

  /* updates reducer and db to reflect saved changes to apartment */
  editApt(e) {
    this.props.editApt({
      id: this.props.apt.id,
      campus: this.props.apt.campus,
      street: this.refs.street.value,
      no: this.refs.no.value,
      city: this.refs.city.value,
      state: this.refs.state.value,
      zip: this.refs.zip.value,
      gender: this.props.apt.gender,
      rooms: this.props.apt.rooms
    });
    axios.post('/apartments/update', {
      collection: 'apartments',
      id: this.props.apt.id,
      update: {
        campus: this.props.apt.campus,
        street: this.refs.street.value,
        no: this.refs.no.value,
        city: this.refs.city.value,
        state: this.refs.state.value,
        gender: this.props.apt.gender,
        zip: this.refs.zip.value
      }
    });
    this.showFront(e);
  }

  /* manages state that stores edited data. isn't permanant until saved */
  update() {
    var newState = {
      id: this.props.apt.id,
      campus: this.props.apt.campus,
      street: this.refs.street.value,
      no: this.refs.no.value,
      city: this.refs.city.value,
      state: this.refs.state.value,
      zip: this.refs.zip.value,
      gender: this.props.apt.gender,
      rooms: this.props.apt.rooms
    }
    this.setState({form: newState});
  }

  /* removes an entire apartment, its rooms, and students from reducer and db */
  removeApt() {
    this.props.removeApt(this.props.apt.id);
    axios.post('/apartments/remove', {
      collection: 'apartments',
      id: this.props.apt.id
    });
  }

  /* appends a room to this apartment (saves in reducer/db) */
  addRoom() {
    axios.post('/apartments/insert', {
      collection: 'rooms',
      insert: {
        apartment: this.props.apt.id,
        name: '',
        capacity: 1
      }
    }).then((result) => {
      this.props.addRoom(result.data.ops[0]);
    });
  }

  render() {
    var roomHeight = (this.props.apt.rooms.length + 1) * 16;
    var rooms = this.props.apt.rooms.map((room, i) => {
      roomHeight += Number(room.capacity) * 86
      roomHeight += (Number(room.capacity) - 1) * 20 + 30;
      return <Room
        address={this.props.apt.street + ", " + this.props.apt.no}
        key={i} aptId={this.props.apt.id} room={room}
      />;
    });
    return (
      <div className="ApartmentCard"
        ref={"ref"+this.props.cardId} style={{height: roomHeight + 66}}>
        <FlipCard flipped={this.state.showCard} disabled={true}>
          <div className="card cardFront">
            <div className="address">
              {this.props.apt.gender ? (
                <i onClick={this.toggleGender} className="fa fa-male"
                  aria-hidden="true"></i>
              ) : (
                <i onClick={this.toggleGender} className="fa fa-female"
                  aria-hidden="true"></i>
              )}
              {this.props.apt.street ? (
                <span>{this.props.apt.street + ', ' + this.props.apt.no}</span>
              ) : (
                <span>New Apartment</span>
              )}
              <span className="address-icons">
                <i onClick={this.showBack} className="fa fa-pencil-square-o"
                  aria-hidden="true"></i>
                <i onClick={this.addRoom} className="fa fa-plus-square"
                  aria-hidden="true"></i>
              </span>
            </div>
            {rooms}
          </div>
          <div className="card cardBack" ref={"ref"+this.props.backId}>
            <input ref="street" onChange={this.update}
              value={this.state.form.street} type="text" placeholder="street"/>
            <input ref="no" onChange={this.update}
              value={this.state.form.no} type="text" placeholder="#"/>
            <input ref="city" onChange={this.update}
              value={this.state.form.city} type="text" placeholder="city"/>
            <input ref="state" onChange={this.update}
              value={this.state.form.state} type="text" placeholder="state"/>
            <input ref="zip" onChange={this.update}
              value={this.state.form.zip} type="text" placeholder="zip"/>
            <div className="buttons">
              <i onClick={this.showFront} className="fa fa-ban"
                aria-hidden="true"></i>
              <i onClick={this.removeApt} className="fa fa-trash"
                aria-hidden="true"></i>
              <i onClick={this.editApt} className="fa fa-floppy-o"
                aria-hidden="true"></i>
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
  editApt: editApt,
  removeApt: removeApt,
  addRoom: addRoom,
  toggleGender: toggleGender
}

export default connect(mapStateToProps, mapDispatchToProps)(ApartmentCard);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { deletePhoto } from '../../../reducers/portalReducer';
import './TourPhoto.scss';

/* a single tour photo for the student portal */
class TourPhoto extends Component {

  constructor(props) {
    super(props);
    this.deletePhoto = this.deletePhoto.bind(this);
  }

  /* deletes this tour photo */
  deletePhoto() {
    this.props.deletePhoto(this.props.photo.id);
  }

  render() {
    return (
      <div className="tour-photo">
        <img src={this.props.photo.url} />
        <i onClick={this.deletePhoto} className="fa fa-trash canhover"
          aria-hidden="true"></i>
      </div>
    )
  }
}

const mapDispatchToProps = {
  deletePhoto: deletePhoto
}

export default connect(null, mapDispatchToProps)(TourPhoto);

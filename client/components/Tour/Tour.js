import React, { Component } from 'react';
import { connect } from 'react-redux';
import { next, prev, flipSwitch } from '../../reducers/portalReducer';
import blueMtn from '../../src/blue mountain.png';
import './Tour.scss';

/* allows user to see photos of housing/campus */
class Tour extends Component {

  constructor(props) {
    super(props);
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
  }

  /* shows next photo in tour */
  next() {
    this.props.next();
  }

  /* shows previous photo in tour */
  prev() {
    this.props.prev();
  }

  render() {

    return (
      <div className="Tour">
        <div className="campus-tour">
          click <a href={
            "https://www.google.com/maps/uv?hl=en&pb=!1s0x874d97574f96827d%3A0xf1e15119e2daaefd!2m17!8m2!1m1!1e2!16m13!1b1!2m2!1m1!1e1!2m2!1m1!1e3!2m2!1m1!1e4!2m2!1m1!1e5!3m1!7e115!4s%2Fmaps%2Fplace%2Fdevmountain%2F%4040.2261639%2C-111.6607174%2C3a%2C75y%2C295.98h%2C90t%2Fdata%3D*213m4*211e1*213m2*211sjoHL7Nx0HdAAAAQvOjN4Mw*212e0*214m2*213m1*211s0x874d97574f96827d%3A0xf1e15119e2daaefd&imagekey=!1e2!2sVYkSsgGj3PkAAAQvOjQYJQ&sa=X&ved=0ahUKEwiK3P6a9azUAhUKzmMKHYffCNUQoB8IqwEwDQ&activetab=panorama"} target="_blank">here</a> to view a tour of our campus.
        </div>
        <div className="apartment-tour">
          <div className="viewbox">
            {this.props.portal.tour[0] ? (
              <img className="curImg" src={this.props.portal.tour[0].url} />
            ) : (
              <img className="curImg" src="" />
            )}
            <img className="control-panel" src={blueMtn} />
            <div className="controls">
              <i onClick={this.next} className="fa fa-arrow-left"
                aria-hidden="true"></i>
              <i onClick={this.prev} className="fa fa-arrow-right"
                aria-hidden="true"></i>
            </div>
          </div>
          <div className="tour-nav">
            <div className="next-up">
              {this.props.portal.tour[1] ? (
                <img src={this.props.portal.tour[1].url} />
              ) : (
                <img src="" />
              )}
            </div>
            <div className="next-up">
              {this.props.portal.tour[2] ? (
                <img src={this.props.portal.tour[2].url} />
              ) : (
                <img src="" />
              )}
            </div>
            <div className="next-up">
              {this.props.portal.tour[3] ? (
                <img src={this.props.portal.tour[3].url} />
              ) : (
                <img src="" />
              )}
            </div>
            <div className="next-up">
              {this.props.portal.tour[4] ? (
                <img src={this.props.portal.tour[4].url} />
              ) : (
                <img src="" />
              )}
            </div>
            <div className="next-up">
              {this.props.portal.tour[5] ? (
                <img src={this.props.portal.tour[5].url} />
              ) : (
                <img src="" />
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    portal: state.portal
  }
};

const mapDispatchToProps = {
  next: next,
  prev: prev,
  flipSwitch: flipSwitch
}

export default connect(mapStateToProps, mapDispatchToProps)(Tour);

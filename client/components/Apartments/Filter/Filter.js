import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setIcon, setSrch } from '../../../reducers/filterReducer';
import { addApartment } from '../../../reducers/apartmentReducer';
import axios from 'axios';
import './Filter.scss';

/* manages what to filter in for apartments and students */
class Filter extends Component {

  constructor(props) {
    super(props);
    this.toggleIcon = this.toggleIcon.bind(this);
    this.updSrch = this.updSrch.bind(this);
    this.addApartment = this.addApartment.bind(this);
  }

  /* turns the filter on for the selected icon */
  toggleIcon(e) {
    var icon = e.currentTarget.className.split("-")[1];
    this.props.setIcon(icon, this.props.type);
  }

  /* adds a new apartment to reduecer and db */
  addApartment() {
    axios.post('/apartments/insert', {
      collection: 'apartments',
      insert: {
        campus: this.props.campus.city, street: '', no: '', city: '',
        state: '', zip: '', gender: true
      }
    }).then((result) => {
      this.props.addApartment(result.data.ops[0]);
    });
  }

  /* updates the filter's search text */
  // immediate filtering occurs
  updSrch(e) {
    this.props.setSrch(e.target.value, this.props.type);
  }

  render() {

    return (
      <div className="Filter">
        {this.props.filter[this.props.type].search ? (
          <div className="filt-disp">
            <i style={{color: 'white'}} onClick={this.toggleIcon}
              className="fa fa-search" aria-hidden="true"></i>
            <input autoFocus onChange={this.updSrch}
              value={this.props.filter[this.props.type].srchTxt} type="text"
              placeholder='search' />
          </div>
        ) : [
          <div key={0} className="filt-disp">
            {this.props.filter[this.props.type].srchTxt ? (
              <i style={{color: 'white'}} onClick={this.toggleIcon}
                className="fa fa-search" aria-hidden="true"></i>
            ) : (
              <i onClick={this.toggleIcon} className="fa fa-search"
                aria-hidden="true"></i>
            )}
            {this.props.filter[this.props.type].male ? (
              <i style={{color: 'white'}} onClick={this.toggleIcon}
                className="fa fa-male" aria-hidden="true"></i>
            ) : (
              <i onClick={this.toggleIcon} className="fa fa-male"
                aria-hidden="true"></i>
            )}
            {this.props.filter[this.props.type].female ? (
              <i style={{color: 'white'}} onClick={this.toggleIcon}
                className="fa fa-female" aria-hidden="true"></i>
            ) : (
              <i onClick={this.toggleIcon} className="fa fa-female"
                aria-hidden="true"></i>
            )}
            {this.props.filter[this.props.type].money ? (
              <i style={{color: 'white'}} onClick={this.toggleIcon}
                className="fa fa-money" aria-hidden="true"></i>
            ) : (
              <i onClick={this.toggleIcon} className="fa fa-money"
                aria-hidden="true"></i>
            )}
            {this.props.filter[this.props.type].beer ? (
              <i style={{color: 'white'}} onClick={this.toggleIcon}
                className="fa fa-beer" aria-hidden="true"></i>
            ) : (
              <i onClick={this.toggleIcon} className="fa fa-beer"
                aria-hidden="true"></i>
            )}
            {this.props.filter[this.props.type].home ? (
              <i style={{color: 'white'}} onClick={this.toggleIcon}
                className="fa fa-home" aria-hidden="true"></i>
            ) : (
              <i onClick={this.toggleIcon} className="fa fa-home"
                aria-hidden="true"></i>
            )}
          </div>
        ]}
        {this.props.type === "apartmentFilter" ? (
          <div>
            <i ref={this.props.type+"Plus"} onClick={this.addApartment}
              className="fa fa-plus-square" aria-hidden="true"></i>
          </div>
        ) : (null)}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    filter: state.filter,
    campus: state.campus
  }
};

const mapDispatchToProps = {
  setIcon: setIcon,
  setSrch: setSrch,
  addApartment: addApartment
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter);

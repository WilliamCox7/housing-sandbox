import React, { Component } from 'react';
import { hashHistory } from "react-router";
import { connect } from 'react-redux';
import { setCity } from '../../reducers/campusReducer';
import map from '../../src/us.svg';
import './Campuses.scss';

/* allows user to select the campus to manage */
class Campuses extends Component {

  constructor(props) {
    super(props);
    this.state = {
      camps: null,
      showModal: false
    }
    this.selectState = this.selectState.bind(this);
    this.selectCity = this.selectCity.bind(this);
    this.loadSVG = this.loadSVG.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  /* sets the campus in the campus reducer */
  selectCity(campus) {
    this.props.setCity(campus);
    hashHistory.replace("/apartments/" + campus);
  }

  /* what happens when user clicks on a us state */
  selectState(st) {
    var campuses = this.props.campus.campuses[st].campuses;

    /* if there are multiple campuses in the state selected */
    if (campuses.length > 1) {
      var camps = campuses.map((campus, i) => {
         return (
           <div className="camp" onClick={() => {this.selectCity(campus)}} key={i}>
             {campus}
           </div>
         );
      });
      this.setState({ camps: camps, showModal: true }); //show modal
    }

    /* if there is only one campus in selected state */
    else {
      this.selectCity(campuses[0]);
    }

  }

  /* closes modal for campus selection */
  closeModal() {
    this.setState({ showModal: false });
  }

  /* creates dom for svg (us map) and adds listeners/styles */
  loadSVG(e) {
      var svgDoc = e.currentTarget.contentDocument;
      var svgItems = svgDoc.getElementsByTagName("path");
      for (var i = 0; i < 51; i++) {
        if (this.props.campus.sts.indexOf(svgItems[i].id) > -1) {
          svgItems[i].style.fill = "#61DAFB";
          svgItems[i].addEventListener("click", (e) => {
            this.selectState(e.target.id);
          });
        } else {
          svgItems[i].style.fill = "#525252";
        }
      }
      e.currentTarget.style.opacity = "1.0";
  }

  render() {
    return (
      <div className="Campuses">
        <div className="container">
          {this.props.campus.sts.length > 0 ? (
            <object data={map} onLoad={this.loadSVG}
              type="image/svg+xml" id="svg2" />
          ) : (null)}
        </div>
        {this.state.showModal ? (
          <div className='modal'
            onClick={this.closeModal}>{this.state.camps}
          </div>
        ) : (null)}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    campus: state.campus
  }
};

const mapDispatchToProps = {
  setCity: setCity
}

export default connect(mapStateToProps, mapDispatchToProps)(Campuses);

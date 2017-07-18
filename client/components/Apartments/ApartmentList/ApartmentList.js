import React, { Component } from 'react';
import { connect } from 'react-redux';
import Filter from '../Filter/Filter';
import ApartmentCard from './ApartmentCard/ApartmentCard';
import './ApartmentList.scss';

/* compiles a list of apartments */
class ApartmentList extends Component {

  render() {

    /* filters out apartments not applicable to the selected campus */
    var filteredApts = this.props.apartment.apartments.filter((apt) => {
      if (apt.campus === this.props.campus.city) { return true; }
    });

    /* filters out apartments from the filters set by user */
    // checks every resident of the apartment
    for (var filterItem in this.props.filter.apartmentFilter) {
      if (filterItem !== 'srchTxt' && filterItem !== 'search') {
        var filterValue = this.props.filter.apartmentFilter[filterItem];
        if (filterValue) {
          filteredApts = filteredApts.filter((apt) => {
            var matches = false;
            apt.rooms.forEach((room) => {
              room.residents.forEach((resident) => {
                if (resident[filterItem]) {
                  matches = true;
                }
              });
            });
            return matches;
          });
        }
      }
    }

    /* filters out apartments that dont match the search made by user */
    filteredApts = filteredApts.filter((apt) => {
      var srchTxt = this.props.filter.apartmentFilter.srchTxt;
      if (srchTxt.indexOf('>') > -1 || // >, <, = are reserved keywords for age
          srchTxt.indexOf('<') > -1 ||
          srchTxt.indexOf('=') > -1) {
        var matches = false;
        var operator = srchTxt.slice(0, 1);
        var condition = Number(srchTxt.slice(1)) || 0;
        apt.rooms.forEach((room) => {
          room.residents.forEach((resident) => {
            switch (operator) {
              case '>': if (resident.age > condition) { matches = true; } break;
              case '<': if (resident.age < condition) { matches = true; } break;
              case '=': if (resident.age === condition) { matches = true; } break;
            }
          });
        });
        return matches;
      } else if (srchTxt) {
        if (JSON.stringify(apt).toLowerCase().indexOf(
          this.props.filter.apartmentFilter.srchTxt.toLowerCase()
        ) > -1) {
          return apt; // if apartment object has the search text, return apt
        }
      } else {
        return apt; // if no search text return apt
      }
    });

    /* create apartment card for filtered apartments */
    var apts = filteredApts.map((apt, i) => {
      return <ApartmentCard backId={"backCard"+apt.id} cardId={"aptCard"+apt.id} apt={apt} key={apt.id} />;
    });

    return (
      <div className="apartmentFilter">
        <div className="container">
          <Filter type={'apartmentFilter'} />
          <div className="aptCards">
            {apts}
          </div>
        </div>
      </div>
    )

  }
}

const mapStateToProps = (state) => {
  return {
    apartment: state.apartment,
    filter: state.filter,
    campus: state.campus
  }
};

export default connect(mapStateToProps)(ApartmentList);

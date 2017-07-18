import React, { Component } from 'react';
import { connect } from 'react-redux';
import Filter from '../Filter/Filter';
import StudentCard from '../StudentCard/StudentCard';
import './StudentList.scss';

/* list of residents approved for housing */
class StudentList extends Component {

  render() {

    /* shows only students that are at the selected campus */
    var filteredStds = this.props.apartment.students.filter((std) => {
      if (std.campus === this.props.campus.city) { return true; }
    });

    /* filters out students from the filters set by user */
    for (var filterItem in this.props.filter.studentFilter) {
      if (filterItem !== 'srchTxt' && filterItem !== 'search') {
        var filterValue = this.props.filter.studentFilter[filterItem];
        if (filterValue) {
          filteredStds = filteredStds.filter((std) => {
            if (std[filterItem]) {
              return std;
            }
          });
        }
      }
    }

    /* filters out students that dont match the search made by user */
    filteredStds = filteredStds.filter((std) => {
      var srchTxt = this.props.filter.studentFilter.srchTxt;
      if (srchTxt.indexOf('>') > -1 ||  // >, <, = are reserved keywords for age
          srchTxt.indexOf('<') > -1 ||
          srchTxt.indexOf('=') > -1) {
        var operator = srchTxt.slice(0, 1);
        var condition = Number(srchTxt.slice(1)) || 0;
        switch (operator) {
          case '>': if (std.age > condition) { return std; } break;
          case '<': if (std.age < condition) { return std; } break;
          case '=': if (std.age === condition) { return std; } break;
        }
      } else if (srchTxt) {
        if (JSON.stringify(std).toLowerCase().indexOf(
          this.props.filter.studentFilter.srchTxt.toLowerCase()
        ) > -1) {
          return std; // if student object has the search text, return std
        }
      } else {
        return std; // if no search text return std
      }
    });

    /* creates card for filtered students */
    var stds = filteredStds.map((std, i) => {
      return <StudentCard std={std} key={i} type={"res"} />;
    });

    return (
      <div className="studentFilter">
        <div className="container">
          <Filter type={'studentFilter'} />
          <div className="stuCards">
            {stds}
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

export default connect(mapStateToProps)(StudentList);

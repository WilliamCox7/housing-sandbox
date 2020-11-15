import React, { Component } from 'react';
import ApartmentList from './ApartmentList/ApartmentList';
import StudentList from './StudentList/StudentList';
import StudentModal from '../StudentModal/StudentModal';
import './Apartments.scss';

/* container for apartment list and student list */
class Apartments extends Component {

  render() {
    return (
      <div className="Apartments">
        <div className="aptContainer">
          <ApartmentList />
          {window.innerWidth > 1360 ? <StudentList /> : null}
        </div>
        <StudentModal comp={"Apartments"} />
      </div>
    )
  }
}

export default Apartments;

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { editCurStudent } from '../../reducers/studentReducer';
import { editStudent, removeFromApt, moveStudent } from '../../reducers/apartmentReducer';
import axios from 'axios';
import './StudentModal.scss';

/* this popup allows you to edit the selected student */
class StudentModal extends Component {

  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
    this.update = this.update.bind(this);
    this.toggleIcon = this.toggleIcon.bind(this);
    this.editStudent = this.editStudent.bind(this);
    this.removeFromApt = this.removeFromApt.bind(this);
  }

  /* closes the modal */
  closeModal(e) {
    if (e.target.className === 'modal' ||
    e.target.className.indexOf('fa-ban') > -1 ||
    e.target.className.indexOf('fa-floppy-o') > -1 ||
    e.target.className.indexOf('fa-trash') > -1) {
      document.getElementsByClassName('modal')[0].style.display = 'none';
    }
  }

  /* updates whatever input field is being changed */
  update(e) {
    this.props.editCurStudent(e.target.name, e.target.value);
  }

  /* toggles whatever icon is clicked */
  toggleIcon(e) {
    var icon = e.target.className.split("-")[1];
    this.props.editCurStudent(icon, !this.props.student[icon]);
  }

  /* saves changes to the student */
  editStudent(e) {
    this.props.editStudent(this.props.student, this.props.comp);
    if (this.props.student.home && this.props.student.money) {
      this.props.student.status = 'completed'; // if student has signed contract
    } else {
      this.props.student.status = 'pending'; // if waiting on contract/deposit
    }
    axios.post('/students/update', {
      id: this.props.student.id,
      update: this.props.student
    });
    this.closeModal(e);
  }

  /* moves student from apartment to student list */
  removeFromApt(e) {
    this.props.removeFromApt(this.props.student.id, this.props.student.moveFrom);
    var remStu = this.props.student;
    remStu.apartment = '';
    remStu.zoneId = '',
    remStu.roomId = '',
    remStu.inApt = false;
    remStu.moveFrom = '';
    if (remStu.home && remStu.money) {
      remStu.status = 'completed'; // if student has signed contract
    } else {
      remStu.status = 'pending'; // if waiting on contract/deposit
    }
    axios.post('/students/update', {
      id: this.props.student.id,
      update: remStu
    });
    this.closeModal(e);
  }

  render() {

    return (
      <div className='modal' onClick={this.closeModal}>
        <div className="studentInfoCard">
          <div className="studentInfoIcons">
            {this.props.student.male ? (
              <i onClick={this.toggleIcon} style={{color: "#61DAFB"}}
                className="fa fa-male" aria-hidden="true"></i>
            ) : (
              <i onClick={this.toggleIcon} className="fa fa-male"
                aria-hidden="true"></i>
            )}
            {this.props.student.female ? (
              <i onClick={this.toggleIcon} style={{color: "#61DAFB"}}
                className="fa fa-female" aria-hidden="true"></i>
            ) : (
              <i onClick={this.toggleIcon} className="fa fa-female"
                aria-hidden="true"></i>
            )}
            {this.props.student.money ? (
              <i onClick={this.toggleIcon} style={{color: "#61DAFB"}}
                className="fa fa-money" aria-hidden="true"></i>
            ) : (
              <i onClick={this.toggleIcon} className="fa fa-money"
                aria-hidden="true"></i>
            )}
            {this.props.student.beer ? (
              <i onClick={this.toggleIcon} style={{color: "#61DAFB"}}
                className="fa fa-beer" aria-hidden="true"></i>
            ) : (
              <i onClick={this.toggleIcon} className="fa fa-beer"
                aria-hidden="true"></i>
            )}
            {this.props.student.home ? (
              <i onClick={this.toggleIcon} style={{color: "#61DAFB"}}
                className="fa fa-home" aria-hidden="true"></i>
            ) : (
              <i onClick={this.toggleIcon} className="fa fa-home"
                aria-hidden="true"></i>
            )}
          </div>
          <div className="input-info">
            <div className="input-heading">Student Information</div>
            <div className="input-field">
              <p>name</p>
              <input name="name" onChange={this.update} type="text"
                value={this.props.student.name} />
            </div>
            <div className="input-field">
              <p>email</p>
              <input name="email" onChange={this.update} type="text"
                value={this.props.student.email} />
            </div>
            <div className="input-field">
              <p>phone</p>
              <input name="phone" onChange={this.update} type="text"
                value={this.props.student.phone} />
            </div>
            <div className="input-field">
              <p>birthday</p>
            <input name="birthday" onChange={this.update} type="date"
              value={this.props.student.birthday} />
            </div>
          </div>
          <div className="input-info">
            <div className="input-heading">Cohort Information</div>
            <div className="input-field">
              <p>cohort</p>
              <div>{this.props.student.cohort}</div>
            </div>
            <div className="input-field">
              <p>start date</p>
              <div>{this.props.student.starts}</div>
            </div>
            <div className="input-field">
              <p>graduation</p>
              <div>{this.props.student.graduates}</div>
            </div>
          </div>
          <div className="input-info">
            <div className="input-heading">Other Information</div>
            <div className="input-field">
              <p>make</p>
              <input name="make" onChange={this.update} type="text"
                value={this.props.student.make} />
            </div>
            <div className="input-field">
              <p>model</p>
              <input name="model" onChange={this.update} type="text"
                value={this.props.student.model} />
            </div>
            <div className="input-field">
              <p>color</p>
              <input name="color" onChange={this.update} type="text"
                value={this.props.student.color} />
            </div>
            <div className="input-field">
              <p>plate</p>
              <input name="plate" onChange={this.update} type="text"
                value={this.props.student.plate} />
            </div>
            <div className="input-field input-textarea">
              <p>notes</p>
              <textarea name="notes" onChange={this.update} type="text"
                value={this.props.student.notes} />
            </div>
          </div>
          <div className="buttons">
            <button onClick={this.closeModal}><i className="fa fa-ban"
              aria-hidden="true"></i></button>
            {this.props.student.inApt ? (
              <button onClick={this.removeFromApt}><i className="fa fa-trash"
                aria-hidden="true"></i></button>
            ) : (null)}
            <button onClick={this.editStudent}><i className="fa fa-floppy-o"
              aria-hidden="true"></i></button>
          </div>
        </div>
      </div>
    )

  }
}

const mapStateToProps = (state) => {
  return {
    student: state.student,
    apartment: state.apartment
  }
};

const mapDispatchToProps = {
  editCurStudent: editCurStudent,
  editStudent: editStudent,
  removeFromApt: removeFromApt,
  moveStudent: moveStudent
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentModal);

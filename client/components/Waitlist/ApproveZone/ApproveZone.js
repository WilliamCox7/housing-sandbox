import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ItemTypes from '../../Apartments/StudentCard/ItemTypes';
import { DropTarget } from 'react-dnd';
import './ApproveZone.scss';

/* what zone is being 'dropped' in */
const approveZone = {
  drop(props) {
    return {
      zone: 'Approve'
    }
  }
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

/* if dropped in this component, it will approve student from waiting list */
class ApproveZone extends Component {

  render() {

    const { connectDropTarget, isOver } = this.props;

    return connectDropTarget(
      <div>
        {isOver ? (
          <div style={{borderColor: '#61DAFB', color: '#61DAFB'}} className="ApproveZone">
            <h1>Approve</h1>
            <div>
              <p>
                <i className="fa fa-male" aria-hidden="true"></i>
                 {this.props.apartment.maleRemaining[this.props.campus.city]}
              </p>
              <p>
                <i className="fa fa-female" aria-hidden="true"></i>
                 {this.props.apartment.femaleRemaining[this.props.campus.city]}
              </p>
            </div>
          </div>
        ) : (
          <div className="ApproveZone">
            <h1>Approve</h1>
            <div>
              <p>
                <i className="fa fa-male" aria-hidden="true"></i>
                 {this.props.apartment.maleRemaining[this.props.campus.city]}
              </p>
              <p>
                <i className="fa fa-female" aria-hidden="true"></i>
                 {this.props.apartment.femaleRemaining[this.props.campus.city]}
              </p>
            </div>
          </div>
        )}
      </div>


    )
  }
}

ApproveZone.propTypes = {
  isOver: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => {
  return {
    apartment: state.apartment,
    campus: state.campus
  }
};

ApproveZone = connect(mapStateToProps)(ApproveZone);
export default DropTarget(ItemTypes.Student, approveZone, collect)(ApproveZone);

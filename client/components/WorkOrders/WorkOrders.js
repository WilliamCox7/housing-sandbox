import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateSearch } from '../../reducers/workOrderReducer';
import WorkOrder from './WorkOrder/WorkOrder';
import './WorkOrders.scss';

/* list of work orders either completed or not completed */
class WorkOrders extends Component {

  constructor(props) {
    super(props);
    this.toggleDDL = this.toggleDDL.bind(this);
    this.update = this.update.bind(this);
  }

  /* shows work orders for specified list when clicked */
  toggleDDL(e) {
    if (e.target.classList[0].indexOf("hist-input") < 0) {
      var element = e.currentTarget.parentElement.children;
      if (!element[1].style.display || element[1].style.display === 'block') {
        element[1].style.display = 'none';
        element[0].style.background = '#525252';
      } else {
        element[1].style.display = 'block';
        element[0].style.background = '#61DAFB';
      }
    }
  }

  /* updates search for past work orders */
  update(e) {
    this.props.updateSearch(e.target.value);
  }

  render() {

    var wocount = 0, hwocount = 0;
    var workorders = [], hworkorders = [];

    /* filters work orders based on selected campus */
    var filteredWorkOrders = this.props.workorders.workorders.filter((wo) => {
      if (wo.campus === this.props.campus.city) { return true; }
    });

    /* separates work orders into either completed or not completed */
    filteredWorkOrders.forEach((wo, i) => {
      if (!wo.isComplete) {
        wocount++;
        workorders.push(<WorkOrder key={i} wo={wo} />);
      } else {
        if (this.props.workorders.search) {
          if (JSON.stringify(wo).toLowerCase().indexOf(
            this.props.workorders.search.toLowerCase()) > -1
          ) {
            hwocount++;
            hworkorders.push(<WorkOrder key={i} wo={wo} />);
          }
        } else {
          hwocount++;
          hworkorders.push(<WorkOrder key={i} wo={wo} />);
        }
      }
    });

    return (
      <div className="WorkOrders">
        <div className="workorder-list">
          <div onClick={this.toggleDDL} style={{background: '#61DAFB'}}
            className="workorder-drop-down">
            <div>Work Orders In Progress</div>
            <div>{wocount} Work Orders</div>
          </div>
          <div className="workorder-cards">
            {workorders}
          </div>
        </div>
        <div className="workorder-list">
          <div onClick={this.toggleDDL} style={{background: '#61DAFB'}}
            className="workorder-drop-down">
            <div className="left">
              History
              <i className="fa fa-search" aria-hidden="true"></i>
              <input className="hist-input" onChange={this.update}
                type="text" placeholder="search..." />
            </div>
            <div>{hwocount} Work Orders</div>
          </div>
          <div className="workorder-cards">
            {hworkorders}
          </div>
        </div>
      </div>
    )

  }
}

const mapStateToProps = (state) => {
  return {
    workorders: state.workorders,
    campus: state.campus
  }
};

const mapDispatchToProps = {
  updateSearch: updateSearch
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkOrders);

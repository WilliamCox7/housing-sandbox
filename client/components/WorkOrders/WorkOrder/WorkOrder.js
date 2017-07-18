import React, { Component } from 'react';
import { connect } from 'react-redux';
import { complete } from '../../../reducers/workOrderReducer';
import FlipCard from 'react-flipcard';
import ReactDOM from 'react-dom';
import moment from 'moment';
import axios from 'axios';
import './WorkOrder.scss';

/* a single work order and its information */
class WorkOrder extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showBack: false,
      height: 0
    }
    this.flipCard = this.flipCard.bind(this);
    this.complete = this.complete.bind(this);
  }

  /* toggles whether or not the work order is complete */
  complete() {
    this.props.complete(this.props.wo.id);
    axios.post('/workorders/update', {
      id: this.props.wo.id,
      update: this.props.wo
    });
  }

  /* flips the FlipCard object */
  flipCard() {
    this.setState({showBack: !this.state.showBack});
  }

  /* on load, make sure height is established for masonry layout */
  componentDidMount() {
    var node = ReactDOM.findDOMNode(this.refs.front);
    var height = node.clientHeight;
    this.setState({height: height});
  }

  render() {

    return (
      <div style={{height: this.state.height}} className="workorder-card">
        <FlipCard flipped={this.state.showBack} disabled={true}>
          <div onClick={this.flipCard} ref="front" className="front">
            <div className="header">
              <div>{this.props.wo.name}</div>
              <div>{this.props.wo.apartment}</div>
            </div>
            <div className="subject">{this.props.wo.subject}</div>
            <div className="body">{this.props.wo.body}</div>
          </div>
          <div style={{height: this.state.height}} className="back">
            <div className="body">{this.props.wo.body}</div>
            <div className="icons">
              <i onClick={this.flipCard} className="fa fa-ban"
                aria-hidden="true"></i>
              <span>{moment(this.props.wo.posted).format("MM/DD/YYYY")}</span>
              {this.props.wo.isComplete ? (
                <i onClick={this.complete} className="fa fa-undo"
                  aria-hidden="true"></i>
              ) : (
                <i onClick={this.complete} className="fa fa-check"
                  aria-hidden="true"></i>
              )}
            </div>
          </div>
        </FlipCard>
      </div>
    )

  }
}

const mapDispatchToProps = {
  complete: complete
}

export default connect(null, mapDispatchToProps)(WorkOrder);

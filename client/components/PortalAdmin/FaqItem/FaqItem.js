import React, { Component } from 'react';
import { connect } from 'react-redux';
import { deleteFAQ } from '../../../reducers/portalReducer';
import axios from 'axios';
import './FaqItem.scss';

/* a single frequently asked question */
class FaqItem extends Component {

  constructor(props) {
    super(props);
    this.deleteFAQ = this.deleteFAQ.bind(this);
  }

  /* deletes this faq */
  deleteFAQ() {
    this.props.deleteFAQ(this.props.item.id);
    axios.post('/portal/remove', {
      id: this.props.item.id,
      collection: 'faq'
    });
  }

  render() {
    return (
      <div className="faq-item">
        <div className="faq-text">
          <span>{this.props.item.q} </span>{this.props.item.a}
        </div>
        <i onClick={this.deleteFAQ} className="fa fa-trash canhover"
          aria-hidden="true"></i>
      </div>
    )

  }
}

const mapDispatchToProps = {
  deleteFAQ: deleteFAQ
}

export default connect(null, mapDispatchToProps)(FaqItem);

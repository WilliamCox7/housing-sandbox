import React, { Component } from 'react';
import { connect } from 'react-redux';
import './FAQ.scss';

/* list of frequently asked questions presented to student */
class FAQ extends Component {

  render() {

    var faq = this.props.portal.faq.map((aq, i) => {
      return (
        <div key={i} className="faq-item">
          <span>{aq.q}</span>{aq.a}
        </div>
      );
    });

    return (
      <div className="FAQ">
        <div className="header">Frequently Asked Questions</div>
        {faq}
      </div>
    )

  }
}

const mapStateToProps = (state) => {
  return {
    portal: state.portal
  }
};

export default connect(mapStateToProps)(FAQ);

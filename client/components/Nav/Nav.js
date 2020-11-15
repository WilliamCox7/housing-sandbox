import React, { Component } from 'react';
import { connect } from 'react-redux';
import { hashHistory } from "react-router";
import ReactDOM from 'react-dom';
import logo from '../../src/header-logo.svg';
import './Nav.scss';

/* dynamic nav that supports either the student or admin */
class Nav extends Component {

  constructor(props) {
    super(props);
    this.redirect = this.redirect.bind(this);
  }

  /* based on click, redirect */
  redirect(e) {
    var curLink = e.currentTarget.innerText;
    var campus = this.props.campus.city;
    switch (curLink) {
      case "Campuses": hashHistory.replace("/"); break;
      case "Apartments": hashHistory.replace("/apartments/" + campus); break;
      case "Waitlist": hashHistory.replace("/waitlist"); break;
      case "Work Orders": hashHistory.replace("/workorders"); break;
      case "Tour/FAQ": hashHistory.replace("/portaladmin"); break;
      case "Portal": hashHistory.replace("/portal"); break;
      case "Tour": hashHistory.replace("/tour"); break;
      case "FAQ": hashHistory.replace("/faq"); break;
      default: break;
    }
  }

  render() {

    /* nav if admin */
    if (this.props.user.role === 'admin') {
      return (
        <div className="Nav">
          <div className="container">
            <div className="logo">
              <img src={logo} />
              <span className="city">{this.props.campus.city}</span>
            </div>
            <div className="links">
              {this.props.loc === "/" ? (
                <a className="curLoc" onClick={this.redirect}>Campuses</a>
              ) : (
                <a onClick={this.redirect}>Campuses</a>
              )}
              {this.props.loc === "/apartments/" + this.props.campus.city ? (
                <a className="curLoc" onClick={this.redirect}>Apartments</a>
              ) : (
                <a onClick={this.redirect}>Apartments</a>
              )}
              {window.innerWidth > 940 ? (
                this.props.loc === "/waitlist" ? (
                  <a className="curLoc" onClick={this.redirect}>Waitlist</a>
                ) : (
                  <a onClick={this.redirect}>Waitlist</a>
                )
              ): null}
              {window.innerWidth > 940 ? (
                this.props.loc === "/workorders" ? (
                  <a className="curLoc" onClick={this.redirect}>Work Orders</a>
                ) : (
                  <a onClick={this.redirect}>Work Orders</a>
                )
              ) : null}
              {window.innerWidth > 940 ? (
                this.props.loc === "/portaladmin" ? (
                  <a className="curLoc" onClick={this.redirect}>Tour/FAQ</a>
                ) : (
                  <a onClick={this.redirect}>Tour/FAQ</a>
                )
              ) : null}
           </div>
          </div>
        </div>
      )
    }

    /* nav if student */
    else {
      return (
        <div className="Nav">
          <div className="container">
            <div className="logo">
              <img src={logo} />
              <span className="city">{this.props.user.name}</span>
            </div>
            <div className="links">
              {this.props.loc === "/portal" ? (
                <a className="curLoc" onClick={this.redirect}>Portal</a>
              ) : (
                <a style={this.props.loc === "/contract" ? (
                  {color: '#61DAFB'}
                ) : (null)} onClick={this.redirect}>Portal</a>
              )}
              {this.props.loc === "/tour" ? (
                <a className="curLoc" onClick={this.redirect}>Tour</a>
              ) : (
                <a onClick={this.redirect}>Tour</a>
              )}
              {this.props.loc === "/faq" ? (
                <a className="curLoc" onClick={this.redirect}>FAQ</a>
              ) : (
                <a onClick={this.redirect}>FAQ</a>
              )}
              <a onClick={this.redirect}>Logout</a>
           </div>
          </div>
        </div>
      )
    }


  }
}

const mapStateToProps = (state) => {
  return {
    campus: state.campus,
    user: state.user
  }
};

export default connect(mapStateToProps)(Nav);

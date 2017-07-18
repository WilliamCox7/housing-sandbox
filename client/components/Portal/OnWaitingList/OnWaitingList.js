import React, { Component } from 'react';
import waitIcon from '../../../src/waitlist.svg';
import './OnWaitingList.scss';

/* simple message telling user they are on the housing waiting list */
class OnWaitingList extends Component {
  render() {
    return (
      <div className="OnWaitingList">
        <img src={waitIcon} />
        <div className="status-text">
          <h1>Good news! You've been accepted at DevMountain.</h1>
          <h1>You are currently on the waiting list for our free housing.</h1>
        </div>
      </div>
    )
  }
}

export default OnWaitingList;

import React, { Component } from 'react';
import './Pending.scss';

/* graphic that shows the user their housing status */
class Pending extends Component {

  constructor(props) {
    super(props);
    this.state = {
      accepted: ((status) => {
        switch(status) {
          case 'waiting': return true; break;
          case 'pending': return true; break;
          case 'completed': return true; break;
          case 'assigned': return true; break;
          default: return false;
        }
      })(this.props.status),
      waiting: ((status) => {
        switch(status) {
          case 'waiting': return false; break;
          case 'pending': return true; break;
          case 'completed': return true; break;
          case 'assigned': return true; break;
          default: return false;
        }
      })(this.props.status),
      pending: ((status) => {
        switch(status) {
          case 'waiting': return false; break;
          case 'pending': return false; break;
          case 'completed': return true; break;
          case 'assigned': return true; break;
          default: return false;
        }
      })(this.props.status)
    }
  }

  render() {

    return (
      <div className="Pending">
        <div className="timeline">
          <div className="phase">
            <span style={this.state.accepted ? (
              {fill: '#61DAFB'}
            ) : (
              {fill: '#525252'}
            )} dangerouslySetInnerHTML={{__html: `
              <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
              	 viewBox="0 0 290 290" style="enable-background:new 0 0 290 290;" xml:space="preserve">
                <path class="acceptedSVG" d="M145,0C64.9,0,0,64.9,0,145s64.9,145,145,145s145-64.9,145-145S225.1,0,145,0z M145,283.7
                	C68.4,283.7,6.3,221.6,6.3,145C6.3,68.4,68.4,6.3,145,6.3c76.6,0,138.7,62.1,138.7,138.7S221.6,283.7,145,283.7
                	C145,283.7,145,283.7,145,283.7z"/>
                <polygon class="acceptedSVG" points="102.6,138 79.8,161 126.9,208 216.2,118.2 194.1,96 127.7,162.9 "/>
              </svg>
            `}}></span>
            <p style={this.state.accepted ? (
              {color: '#61DAFB'}
            ) : (
              {color: '#525252'}
            )}>Accepted</p>
            <div style={this.state.accepted ? (
              {background: '#61DAFB'}
            ) : (
              {background: '#525252'}
            )}></div>
          </div>
          <div className="phase">
            <span style={this.state.waiting ? (
              {fill: '#61DAFB'}
            ) : (
              {fill: '#525252'}
            )} dangerouslySetInnerHTML={{__html: `
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 290 290">
                <g id="Layer_2" data-name="Layer 2">
                  <g id="Layer_1-2" data-name="Layer 1">
                    <path class="waitingSVG" d="M145,0A145,145,0,1,0,290,145,145,145,0,0,0,145,0Zm0,283.67A138.67,138.67,0,1,1,283.67,145,138.67,138.67,0,0,1,145,283.67Z"/>
                    <circle class="waitingSVG" cx="145" cy="145" r="17.33"/>
                    <circle class="waitingSVG" cx="69.67" cy="145" r="17.33"/>
                    <circle class="waitingSVG" cx="220.33" cy="145" r="17.33"/>
                  </g>
                </g>
              </svg>
            `}}></span>
            <p style={this.state.waiting ? (
              {color: '#61DAFB'}
            ) : (
              {color: '#525252'}
            )}>Waiting</p>
            <p style={this.state.waiting ? (
              {color: '#61DAFB'}
            ) : (
              {color: '#525252'}
            )}>List</p>
            <div style={this.state.waiting ? (
              {background: '#61DAFB'}
            ) : (
              {background: '#525252'}
            )}></div>
          </div>
          <div className="phase">
            <span style={this.state.pending ? (
              {fill: '#61DAFB'}
            ) : (
              {fill: '#525252'}
            )} dangerouslySetInnerHTML={{__html: `
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 290 290">
                <g id="Layer_2" data-name="Layer 2">
                  <g id="Layer_1-2" data-name="Layer 1">
                    <path class="pendingSVG" d="M145,0A145,145,0,1,0,290,145,145,145,0,0,0,145,0Zm0,283.67A138.67,138.67,0,1,1,283.67,145,138.67,138.67,0,0,1,145,283.67Z"/>
                    <polygon class="pendingSVG" points="142.26 57.61 181.22 57.6 152.15 173.57 121.96 173.57 142.26 57.61"/>
                    <ellipse class="pendingSVG" cx="130.64" cy="209.34" rx="21.86" ry="19.24"/>
                  </g>
                </g>
              </svg>
            `}}></span>
            <p style={this.state.pending ? (
              {color: '#61DAFB'}
            ) : (
              {color: '#525252'}
            )}>Pending</p>
            <p style={this.state.pending ? (
              {color: '#61DAFB'}
            ) : (
              {color: '#525252'}
            )}>Assignment</p>
            <div style={this.state.pending ? (
              {background: '#61DAFB'}
            ) : (
              {background: '#525252'}
            )}></div>
          </div>
          <div className="phase">
            <span style={{fill: '#525252'}} dangerouslySetInnerHTML={{__html: `
              <?xml version="1.0" encoding="utf-8"?>
              <!-- Generator: Adobe Illustrator 21.0.2, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
              <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
              	 viewBox="0 0 290 290" style="enable-background:new 0 0 290 290;" xml:space="preserve">
                <path class="logoSVG" d="M145,0C64.9,0,0,64.9,0,145s64.9,145,145,145s145-64.9,145-145S225.1,0,145,0z M145,283.7
                	C68.4,283.7,6.3,221.6,6.3,145C6.3,68.4,68.4,6.3,145,6.3c76.6,0,138.7,62.1,138.7,138.7S221.6,283.7,145,283.7
                	C145,283.7,145,283.7,145,283.7z"/>
                <path class="logoSVG" d="M128.1,91.9l24.3,46.1c0,0,2,3.8,8,2.6c6-4.1,1-10.3,1-10.3l-28.6-54.2c0,0-1.4-1.9-4-2.3s-4.6,2-4.6,2
                	L50.9,200.4c0,0-0.4,3.2,0.7,5.1s3.9,2.8,3.9,2.8h90.3l1.6-1.1l41.6-72.1l34.6,58.9l-53.6,0.3c0,0-4.6,2.8-4.1,6.1s2.9,5.8,2.9,5.8
                	l66.5-0.4c0,0,2.2-0.6,3.4-2.5s0.7-5.5,0.7-5.5L192.6,119c0,0-1.7-2.1-3.8-1.8s-4.4,2.3-4.4,2.3l-44.3,77.1l-73.7-0.1L128.1,91.9z"
                	/>
              </svg>
            `}}></span>
            <p>Assigned</p>
            <p>Housing</p>
          </div>
        </div>
        {!this.props.h1 ? (
          <div className="status-text">
            <h1>Alright! You're off the waiting list. Once you've both</h1>
            <h1>
              <a target="_blank" href={"https://devmountain.com/portal#/"}>
              paid your deposit and signed your contract</a>, we can assign you housing.
            </h1>
          </div>
        ) : (
          <div className="status-text">
            <h1>Thanks for getting that taken care of.</h1>
            <h1>We'll get you assigned to an apartment in no time.</h1>
          </div>
        )}
      </div>
    )

  }
}

export default Pending;

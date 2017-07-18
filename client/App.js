import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import './reset.scss';
import './main.scss';

class App extends Component {

  render() {
    return (
      <div className="App">
        {this.props.children}
      </div>
    )
  }
}

export default DragDropContext(HTML5Backend)(App);

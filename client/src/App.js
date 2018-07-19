import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import DrawingForm from './DrawingForm';
import DrawingList from './DrawingList';
import Drawing from './Drawing';

class App extends Component {
  state = {
    selectedDrawing: null
  };

  selectDrawing = (drawing) => {
    this.setState({
      selectedDrawing: drawing
    })
  }

  render() {
    let ctrl = (
      <div>
        <DrawingForm />
        <DrawingList selectDrawing={this.selectDrawing} />
      </div>
    );

    if (this.state.selectedDrawing) {
      ctrl = (
        <Drawing
          drawing={this.state.selectedDrawing}
          key={this.state.selectedDrawing.id}
        />
      )
    }

    return (
      <div className="App">
        <div className="App-header">
          <h2>Awesome app</h2>
        </div>
        {ctrl}
      </div>
    );
  }
}

export default App;

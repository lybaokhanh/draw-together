import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import DrawingForm from './DrawingForm';
import DrawingList from './DrawingList';

class App extends Component {
  render() {
    return (
      <div className="App">
        <DrawingForm />
        <DrawingList />
      </div>
    );
  }
}

export default App;

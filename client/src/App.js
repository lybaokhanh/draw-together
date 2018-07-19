import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { subscribeToTimer } from './api';

class App extends Component {
  constructor(props) {
    super(props);

    subscribeToTimer((timestamp) => {
      this.setState({
        timestamp
      });
    })
  }

  state = {
    timestamp: 'no timestamp yet'
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          This is the value of timer timestamp: {this.state.timestamp}
        </p>
      </div>
    );
  }
}

export default App;

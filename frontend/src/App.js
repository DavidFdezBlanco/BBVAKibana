import React, { Component } from 'react';
import './App.css';

import ChoroplethMap from './components/ChoroplethMapWorld';
import Header from './components/header';

class App extends Component {
  state = {
    data: [
      ["COL", 10, 90, 20, 39, 70, 4, 1, 5, 2], ["PER", 30, 50, 20, 90, 10, 2, 3, 2, 2], ["ESP", 50, 70, 30, 25, 37, 1, 3, 5, 4], ["MEX", 70, 30, 20, 75, 7, 3, 4, 2, 2], ["ARG", 90, 80, 10, 39, 30, 5, 1, 1, 1] ]
  }
  render() {
    return (<div className='App'><Header/><div className='App-map'>
      <ChoroplethMap data={this.state.data}/>
    </div></div>
      
    );
  }
}

export default App;

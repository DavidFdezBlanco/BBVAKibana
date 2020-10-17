import React, { Component } from 'react';
import './App.css';

import ChoroplethMap from './components/ChoroplethMapWorld';
import Header from './components/header';
import Table from './components/table';

class App extends Component {
  state = {
    data: [
      ["COL", 45, 20, 39, 70, 1, 5, 2], ["PER", 20, 20, 90, 10, 3, 2, 2], ["ESP", 70, 30, 25, 37, 3, 5, 4], ["MEX", 40, 20, 75, 7, 4, 2, 2], ["ARG", 90, 10, 39, 30, 1, 1, 1] ]
  }
  render() {
    return (<div className='App'><Header/><div className='App-map'>
      <ChoroplethMap data={this.state.data}/>
    </div></div>
      
    );
  }
}

export default App;

import React, { Component } from 'react';
import './App.css';

import ChoroplethMap from './components/ChoroplethMapWorld';
import Header from './components/header';
import Table from './components/table';

class App extends Component {

    state = {
        data: []
    }
    
    render() {
        return (
        <div className='App'>
            <Header/>
            <div className='App-map'>
            <ChoroplethMap/>
            </div>
            <div className='interactive-table'>
                <Table/>
            </div>
        </div>
        );
    }
}

export default App;

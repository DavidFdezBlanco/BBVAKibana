import React, { Component } from 'react';
import './App.css';

import ChoroplethMap from './components/ChoroplethMapWorld';
import Header from './components/header';
import Table from './components/table';

class App extends Component {

    state = {
        data: [
            ["COL", 10, 90, 20, 39, 70, 4, 1, 5, 2],
            ["PER", 30, 50, 20, 90, 10, 2, 3, 2, 2],
            ["ESP", 50, 70, 30, 25, 37, 1, 3, 5, 4],
            ["MEX", 70, 30, 20, 75, 7, 3, 4, 2, 2],
            ["ARG", 90, 80, 10, 39, 30, 5, 1, 1, 1]
        ]
    }
    countryCodes = [
        { "code": 'ARG', "name": "Argentina" },
        { "code": 'COL', "name": "Colombia" },
        { "code": 'PER', "name": "Peru" },
        { "code": 'ESP', "name": "España" },
        { "code": 'MEX', "name": "Mexico" }
    ]

    componentDidMount() {

        this.countryCodes.forEach(country => {
            fetch("http://3.137.101.89:3000/api/ratings?country=Argentina")
                .then(res => res.json())
                .then(
                    (result) => {
                        console.log("result", result);
                        this.setState({
                            result
                        });
                    },
                    (error) => {
                        this.setState({});
                    }
                );
        });
    }
    render() {
        return (
        <div className='App'>
            <Header/>
            <div className='App-map'>
            <ChoroplethMap data={this.state.data} />
            </div>
        
            <div className='interactive-table'>
                <Table/>
            </div>
        </div>
        );
    }
}

export default App;

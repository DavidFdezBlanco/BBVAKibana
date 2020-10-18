import React, { Component } from 'react';
import './App.css';

import ChoroplethMap from './components/ChoroplethMapWorld';
import Header from './components/header';
import Table from './components/table';

class App extends Component {

    state = {
        data: [
            // {
            //     code: 'ARG',
            //     name: 'Argentina',
            //     avg: 3.2,
            //     categories: {
            //         "Atencion al cliente": {
            //             rating: 3,
            //             avg: 54
            //         }
            //     }
            // }
            // ["COL", 10, 90, 20, 39, 70, 4, 1, 5, 2],
            // ["PER", 30, 50, 20, 90, 10, 2, 3, 2, 2],
            // ["ESP", 50, 70, 30, 25, 37, 1, 3, 5, 4],
            // ["MEX", 70, 30, 20, 75, 7, 3, 4, 2, 2],
            // ["ARG", 90, 80, 10, 39, 30, 5, 1, 1, 1]
        ]
    }
    countryCodes = [
        { "code": 'ARG', "name": "Argentina" },
        { "code": 'COL', "name": "Colombia" },
        { "code": 'PER', "name": "Peru" },
        { "code": 'ESP', "name": "España" },
        { "code": 'MEX', "name": "Mexico" }
    ]

    createData(code, name, avg, clusterAvg, commentcounts) {
        let categories = {};
        for (const category in clusterAvg) {
            if (clusterAvg.hasOwnProperty(category)) {
                categories[category] = {
                    rating: clusterAvg[category],
                    avg: commentcounts.results[category] / commentcounts.total
                }
            }
        }
        return {
            code: code,
            name: name,
            avg: avg.toFixed(0),
            categories: categories
        };
    }

    componentDidMount() {
        let clusters = []
        this.countryCodes.forEach(country => {
            console.log("country", country.name);
            fetch("http://3.137.101.89:3000/api/ratings?country=" + country.name)
                .then(res => res.json())
                .then(
                    (result) => {
                        console.log("result", result);
                        let clusterAvg = result.cluster_avg;
                        let globalSum = 0;
                        for (const category in clusterAvg) {
                            if (clusterAvg.hasOwnProperty(category)) {
                                const element = clusterAvg[category];
                                globalSum += element
                            }
                        }
                        let avg = globalSum / Object.keys(clusterAvg).length;
                        clusters.push(this.createData(country.code, country.name, avg, result.cluster_avg, result.comments_count))
                        this.setState({
                            data: clusters
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

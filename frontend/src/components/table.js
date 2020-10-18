import React, { Component } from 'react';
import HappyFace from '../image/HappyFace.png'
import SuperHappyFace from '../image/SuperHappyFace.png'
import NeutralFace from '../image/NeutralFace.png'
import AngryFace from '../image/AngryFace.png'
import SuperAngryFace from '../image/SuperAngryFace.png'

import Select from 'react-select';

const options = [
    { value: 'Colombia', label: 'Colombia' },
    { value: 'España', label: 'España' },
    { value: 'Peru', label: 'Peru' },
    { value: 'Argentina', label: 'Argentina' },
    { value: 'Mexico', label: 'Mexico' },
];

class Table extends Component {

    state = {
        data: [],
        country: 'España'
    }

    countryList = ["Colombia", "España", "Peru", "Argentina", "Mexico"]

    handleChange = selectedOption => {
        this.setState(
            { data: this.state.data, selectedOption, country: selectedOption.value },
            () => {}
        );
    };

    getFace(number) {
        switch (Number(number)) {
            case 5:
                return SuperHappyFace;
            case 4:
                return HappyFace;
            case 3:
                return NeutralFace;
            case 2:
                return AngryFace;
            case 1:
                return SuperAngryFace;
            default:
                return "No face"
                //Declaraciones ejecutadas cuando ninguno de los valores coincide con el valor de la expresión
                break;
        }
    }

    createData(name, avg, clusterAvg, commentcounts) {
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
            name: name,
            avg: avg.toFixed(2),
            categories: categories
        };
    }

    fetchData() {
        let clusters = []
        let i = 0;
        return new Promise((res, rej) => {
            this.countryList.forEach(country => {
                fetch("http://3.137.101.89:3000/api/ratings?country=" + country)
                    .then(res => res.json())
                    .then(
                        (result) => {
                            let clusterAvg = result.cluster_avg;
                            let globalSum = 0;
                            for (const category in clusterAvg) {
                                if (clusterAvg.hasOwnProperty(category)) {
                                    const element = clusterAvg[category];
                                    globalSum += element
                                }
                            }
                            let avg = globalSum / Object.keys(clusterAvg).length;
                            clusters.push(this.createData(country, avg, result.cluster_avg, result.comments_count))
                            this.setState({
                                data: this.state.data.concat([this.createData(country, avg, result.cluster_avg, result.comments_count)])
                            });
                            i++;
                            if (i == 5) {
                                res(true);
                            }
                        },
                        (error) => {
                            this.setState({});
                        }
                    );
            });
        });
    }
    async componentDidMount() {
        await this.fetchData();
    }
    render() {

        if (this.state.data.length < 5) {
            return null
        }

        //hacer con select
        var country = this.state.country;
        for (const i in this.state.data) {
            if (this.state.data[i].name == country) {
                var avg = this.state.data[i].avg
                this.finalObject = this.state.data[i]
            }
        }
        let cqt = Object.keys(this.finalObject.categories);
        return (
            <div className="limiter">
                <div className="resultMean">Nota media: <br></br>
                    {avg}
                </div>
                <div className="resultMean">País: <br></br>
                    {country}
                </div>
                <div className="selector-wrapper">
                    <Select
                        className="selector"
                        defaultValue={options[1]}
                        value={this.state.selectedOption}
                        onChange={this.handleChange}
                        options={options}
                    />
                </div>
                <div className="container-table100">
                    <div className="wrap-table100">
                        <div className="table">
                            <div className="row header">
                                <div className="cell">
                                    Categoría
							</div>
                                <div className="cell">
                                    Satisfacción
							    </div>
                                <div className="cell">
                                    Nota media
							    </div>
                            </div>
                            {
                                cqt.map((value, index) => {
                                    if (value === 'Unclassified') return null;
                                    return <div className="row"><div className="cell" data-title="Categoría">{value}</div><div className="cell" data-title="Puntuaje"><img src={this.getFace(Number(this.finalObject.categories[value].rating).toFixed(0))} height="20px" width="20px" /></div><div className="cell" data-title="%">{this.finalObject.categories[value].rating.toFixed(2)}</div></div>
                                })
                            }

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Table;
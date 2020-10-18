import React, { Component } from 'react';
import Datamap from 'datamaps/dist/datamaps.world.min.js';
import d3 from 'd3';
import WorldJson from './World.topo.json';

import HappyFace from '../image/HappyFace.png'
import SuperHappyFace from '../image/SuperHappyFace.png'
import NeutralFace from '../image/NeutralFace.png'
import AngryFace from '../image/AngryFace.png'
import SuperAngryFace from '../image/SuperAngryFace.png'

class ChoroplethMap extends Component {

    state = {
        data: []
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

    fetchData() {
        let clusters = []
        let i = 0;
        return new Promise((res,rej) => {
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
                                data: this.state.data.concat([this.createData(country.code, country.name, avg, result.cluster_avg, result.comments_count)])
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
        // Datamaps expect data in format:
        // { "USA": { "fillColor": "#42a844", numberOfWhatever: 75},
        //   "FRA": { "fillColor": "#8dc386", numberOfWhatever: 43 } }
        let dataset = {};

        // We need to colorize every country based on "numberOfWhatever"
        // colors should be uniq for every value.
        // For this purpose we create palette(using min/max this.props.data-value)
        // let onlyValues = this.props.data.map(function (obj) { 
        //     console.log('obj', obj);
        //     return obj[1]; });
        let minValue = 0,
            maxValue = 5;

        // create color palette function
        // color can be whatever you wish
        let paletteScale = d3.scale.linear()
            .domain([minValue, maxValue])
            .range(["#89D1F3", "#006EC1"]); // blue color

        function getFace(number) {
            switch (number) {
                case 1:
                    return SuperHappyFace;
                case 2:
                    return HappyFace;
                case 3:
                    return NeutralFace;
                case 4:
                    return AngryFace;
                case 5:
                    return SuperAngryFace;
                default:
                    //Declaraciones ejecutadas cuando ninguno de los valores coincide con el valor de la expresión
                    break;
            }
        }

        console.log('hola', this.props.data);
        await this.fetchData();
        // fill dataset in appropriate format
        this.state.data.forEach(function (item) {
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
            console.log('jjj',item)
            // item example value ["USA", 70]
            let iso = item.code,
                value = item.avg;
                // porCD = item[2],
                // porAC = item[3],
                // porOP = item[4],
                // porLO = item[5],
                // raCD = item[6],
                // raAC = item[7],
                // raOP = item[8],
                // raLO = item[9];
            dataset[iso] = { 
                numberOfThings: value, 
                fillColor: paletteScale(value), 
                ...item 
            };
        });

        let map = new Datamap({
            element: document.getElementById('cloropleth_map'),
            scope: 'world',
            geographyConfig: {
                popupOnHover: true,
                highlightOnHover: true,
                borderColor: '#444',
                highlightBorderWidth: 1,
                borderWidth: 0.5,
                dataJson: WorldJson,
                popupTemplate: function (geo, data) {
                    // don't show tooltip if country don't present in dataset
                    console.log('hola', data);
                    if (!data) { return; }
                    // tooltip content
                    return ['<div class="hoverinfo">',
                        '<strong style="color: #016ec1;">', geo.properties.name, '</strong><br><strong>', data.numberOfThings, '</strong>',
                        '<table><thead><tr><th>Categoria</th>',
                        '<th>Puntuaje</th><th style="padding-left: 20px;">%</th>',
                        '</tr></thead>',
                        '<tbody>',
                        '<tr><th scope="row">Atención al cliente</th>','<td><img src="', getFace(data.categories['Atención al cliente'].rating),'" height="12px" width="12px"/></td><td style="padding-left: 20px;">', data.covid, '</td>',
                        '<tr><th scope="row">Cajeros</th>','<td><img src="', getFace(data.ratingCD),'" height="12px" width="12px"/></td><td style="padding-left: 20px;">', data.covid, '</td>',
                        '<tr><th scope="row">Esperas</th>','<td><img src="', getFace(data.ratingCD),'" height="12px" width="12px"/></td><td style="padding-left: 20px;">', data.covid, '</td>',
                        '<tr><th scope="row">Horarios</th>','<td><img src="', getFace(data.ratingCD),'" height="12px" width="12px"/></td><td style="padding-left: 20px;">', data.covid, '</td>',
                        '<tr><th scope="row">Operaciones Bancarias</th>','<td><img src="', getFace(data.ratingCD),'" height="12px" width="12px"/></td><td style="padding-left: 20px;">', data.covid, '</td>',
                        '<tr><th scope="row">Sucursal</th>','<td><img src="', getFace(data.ratingCD),'" height="12px" width="12px"/></td><td style="padding-left: 20px;">', data.covid, '</td>',
                        '<tr><th scope="row">Teléfonos</th>','<td><img src="', getFace(data.ratingCD),'" height="12px" width="12px"/></td><td style="padding-left: 20px;">', data.covid, '</td>',
                        '<tr><th scope="row">Unclassified</th>','<td><img src="', getFace(data.ratingCD),'" height="12px" width="12px"/></td><td style="padding-left: 20px;">', data.covid, '</td>',
                        '</tbody></table>',
                        '</div>'].join('');
                }
            },
            fills: {
                HIGH: '#006EC1',
                LOW: '#B5E5F9',
                MEDIUM: '#52BCEC',
                UNKNOWN: 'rgb(0,0,0)',
                defaultFill: '#eee'
            },
            data: dataset,
            setProjection: function (element) {
                var projection = d3.geo.mercator()
                    .center([38.7166700, -9.1333300]) // always in [East Latitude, North Longitude]
                    .scale(200)
                    .translate([element.offsetWidth / 2, element.offsetHeight / 2]);

                var path = d3.geo.path().projection(projection);
                return { path: path, projection: projection };
            }
        });
    }
    render() {
        return (
            <div id="cloropleth_map" style={{
                height: "1100px",
                width: "1260px",
                paddingLeft: "69px"
            }}></div>
        );
    }
}

export default ChoroplethMap;

// '<br>Count: <strong>', data.numberOfThings, '</strong>',
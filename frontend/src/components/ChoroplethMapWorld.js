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
            avg: avg.toFixed(2),
            categories: categories
        };
    }

    fetchData() {
        let clusters = []
        let i = 0;
        return new Promise((res,rej) => {
            this.countryCodes.forEach(country => {
                fetch("http://3.137.101.89:3000/api/ratings?country=" + country.name)
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
                    //Declaraciones ejecutadas cuando ninguno de los valores coincide con el valor de la expresión
                    break;
            }
        }

        await this.fetchData();
        // fill dataset in appropriate format
        this.state.data.forEach(function (item) {
            let iso = item.code;
            let value = item.avg;
            console.log("VAl", value)
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
                    if (!data) { return; }
                    // tooltip content
                    return ['<div class="hoverinfo">',
                        '<strong style="color: #016ec1;">', geo.properties.name, '</strong><br><strong>Nota media: ', data.numberOfThings, ' / 5</strong>',
                        '<table><thead><tr><th>Categoria</th>',
                        '<th>Puntuaje</th><th style="padding-left: 20px;">Distribución</th>',
                        '</tr></thead>',
                        '<tbody>',
                        '<tr><th scope="row">Atención al cliente</th>','<td><img src="', getFace(Number(data.categories['Atención al cliente'].rating).toFixed(0)),'" height="12px" width="12px"/></td><td style="padding-left: 20px;">', Number(data.categories['Atención al cliente'].avg * 100).toFixed(0), ' %</td>',
                        '<tr><th scope="row">Cajeros</th>','<td><img src="', getFace(Number(data.categories['Cajeros'].rating).toFixed(0)),'" height="12px" width="12px"/></td><td style="padding-left: 20px;">', Number(data.categories['Cajeros'].avg * 100).toFixed(0), ' %</td>',
                        '<tr><th scope="row">Esperas</th>','<td><img src="', getFace(Number(data.categories['Esperas'].rating).toFixed(0)),'" height="12px" width="12px"/></td><td style="padding-left: 20px;">', Number(data.categories['Esperas'].avg * 100).toFixed(0), ' %</td>',
                        '<tr><th scope="row">Horarios</th>','<td><img src="', getFace(Number(data.categories['Horarios'].rating).toFixed(0)),'" height="12px" width="12px"/></td><td style="padding-left: 20px;">', Number(data.categories['Horarios'].avg * 100).toFixed(0), ' %</td>',
                        '<tr><th scope="row">Operaciones Bancarias</th>','<td><img src="', getFace(Number(data.categories['Operaciones Bancarias'].rating).toFixed(0)),'" height="12px" width="12px"/></td><td style="padding-left: 20px;">', Number(data.categories['Operaciones Bancarias'].avg * 100).toFixed(0), ' %</td>',
                        '<tr><th scope="row">Sucursal</th>','<td><img src="', getFace(Number(data.categories['Sucursal'].rating).toFixed(0)),'" height="12px" width="12px"/></td><td style="padding-left: 20px;">', Number(data.categories['Sucursal'].avg * 100).toFixed(0), ' %</td>',
                        '<tr><th scope="row">Teléfonos</th>','<td><img src="', getFace(Number(data.categories['Teléfonos'].rating).toFixed(0)),'" height="12px" width="12px"/></td><td style="padding-left: 20px;">', Number(data.categories['Teléfonos'].avg * 100).toFixed(0), ' %</td>',
                        '<tr><th scope="row">Sin clasificar</th>','<td><img src="', getFace(Number(data.categories['Unclassified'].rating).toFixed(0)),'" height="12px" width="12px"/></td><td style="padding-left: 20px;">', Number(data.categories['Unclassified'].avg * 100).toFixed(0), ' %</td>',
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

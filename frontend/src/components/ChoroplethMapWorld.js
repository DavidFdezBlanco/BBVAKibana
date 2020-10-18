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
    componentDidMount() {
        // Datamaps expect data in format:
        // { "USA": { "fillColor": "#42a844", numberOfWhatever: 75},
        //   "FRA": { "fillColor": "#8dc386", numberOfWhatever: 43 } }
        let dataset = {};

        // We need to colorize every country based on "numberOfWhatever"
        // colors should be uniq for every value.
        // For this purpose we create palette(using min/max this.props.data-value)
        let onlyValues = this.props.data.map(function (obj) { return obj[1]; });
        let minValue = Math.min.apply(null, onlyValues),
            maxValue = Math.max.apply(null, onlyValues);

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

        // fill dataset in appropriate format
        this.props.data.forEach(function (item) { //
            // item example value ["USA", 70]
            let iso = item[0],
                value = item[1],
                porCD = item[2],
                porAC = item[3],
                porOP = item[4],
                porLO = item[5],
                raCD = item[6],
                raAC = item[7],
                raOP = item[8],
                raLO = item[9];
            dataset[iso] = { numberOfThings: value, fillColor: paletteScale(value), covid: porCD, atencionCliente: porAC, operaciones: porOP, locales: porLO, ratingCD: raCD, ratingAC: raAC, ratingOP: raOP, ratingLO: raLO };
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
                        '<strong style="color: #016ec1;">', geo.properties.name, '</strong><br><strong>', data.numberOfThings, '</strong>',
                        '<table><thead><tr><th>Categoria</th>',
                        '<th >Puntuaje</th><th style="padding-left: 20px;">%</th>',
                        '</tr></thead><tbody><tr><th scope="row">COVID</th>',
                        '<td><img src="', getFace(data.ratingCD), '" height="12px" width="12px"/></td><td style="padding-left: 20px;">', data.covid, '</td></tr><tr><th scope="row">Atencion al Cliente</th>',
                        '<td><img src="', getFace(data.ratingAC), '" height="12px" width="12px"/></td><td style="padding-left: 20px;">', data.atencionCliente, '</td></tr><tr>',
                        '<th scope="row">Operaciones</th><td><img src="', getFace(data.ratingOP), '" height="12px" width="12px"/></td>',
                        '<td style="padding-left: 20px;">', data.operaciones, '</td></tr><tr><th scope="row">Locales</th>',
                        '<td><img src="', getFace(data.ratingLO), '" height="12px" width="12px"/></td><td style="padding-left: 20px;">', data.locales, '</td></tr>',
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
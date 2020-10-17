import React, { Component } from 'react';
import Datamap from 'datamaps/dist/datamaps.world.min.js';
import d3 from 'd3';
import WorldJson from './World.topo.json';

import HappyFace from '../image/HappyFace.png'
import SuperHappyFace from '../image/HappyFace.png'
import NeutralFace from '../image/HappyFace.png'
import AngryFace from '../image/HappyFace.png'
import SuperAngryFace from '../image/HappyFace.png'

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


        // fill dataset in appropriate format
        this.props.data.forEach(function (item) { //
            // item example value ["USA", 70]
            let iso = item[0],
                value = item[1],
                porAC = item[2],
                porOP = item[3],
                porLO = item[4],
                raAC = item[5],
                raOP = item[6],
                raLO = item[7];
            dataset[iso] = { numberOfThings: value, fillColor: paletteScale(value), atencionCliente: porAC, operaciones: porOP, locales: porLO, ratingAC: raAC, ratingOP: raOP , ratingLO: raLO  };
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
                        '<strong>', geo.properties.name, '<br>', data.numberOfThings, '</strong>',
                        '<table>',
                        '<thead><tr><th scope="col">Categoria</th>',
                            '<th scope="col">Calificacion</th><th scope="col">Peso</th>',
                          '</tr></thead><tbody><tr>',
                            '<th scope="row">Atencion al Cliente</th>',
                            '<td>', data.ratingAC, '</td><td>', data.atencionCliente,  '</td></tr><tr>',
                            '<th scope="row">Operaciones</th><td>', data.ratingOP, '</td>',
                            '<td>', data.operaciones,  '</td></tr><tr><th scope="row">Locales</th>',
                            '<td>', data.ratingLO, '</td><td>', data.locales,  '</td></tr>',
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
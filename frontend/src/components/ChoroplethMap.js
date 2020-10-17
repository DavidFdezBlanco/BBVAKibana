import React, { Component } from 'react';
import Datamap from 'datamaps/dist/datamaps.world.min.js';
import d3 from 'd3';
import SpainJson from './Spain.topo.json';

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
            .range(["#EFEFFF", "#02386F"]); // blue color

        // fill dataset in appropriate format
        this.props.data.forEach(function (item) { //
            // item example value ["USA", 70]
            let iso = item[0],
                value = item[1];
            dataset[iso] = { numberOfThings: value, fillColor: paletteScale(value) };
        });

        let map = new Datamap({
            element: document.getElementById('cloropleth_map'),
            scope: 'spain',
            geographyConfig: {
                popupOnHover: true,
                highlightOnHover: true,
                borderColor: '#444',
                highlightBorderWidth: 1,
                borderWidth: 0.5,
                dataJson: SpainJson,
                popupTemplate: function (geo, data) {
                    // don't show tooltip if country don't present in dataset
                    if (!data) { return; }
                    // tooltip content
                    return ['<div class="hoverinfo">',
                        '<strong>', geo.properties.name, '</strong>',
                        '<br>Count: <strong>', data.numberOfThings, '</strong>',
                        '</div>'].join('');
                }
            },
            fills: {
                HIGH: '#afafaf',
                LOW: '#123456',
                MEDIUM: 'blue',
                UNKNOWN: 'rgb(255,255,255)',
                defaultFill: '#eee'
            },
            data: dataset,
            setProjection: function (element) {
                var projection = d3.geo.mercator()
                    .center([-106.3468, 68.1304]) // always in [East Latitude, North Longitude]
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
                height: "100%",
                width: "100%",
            }}></div>
        );
    }
}

export default ChoroplethMap;


// data: [
//     ["AL", 75], ["AB", 43], ["AI", 50], ["AM", 88], ["AS", 21], ["AV", 43],
//     ["BA", 21], ["BL", 19], ["BR", 60], ["BU", 4], ["CA", 44], ["CD", 38],
//     ["CN", 67], ["CS", 67], ["CE", 67], ["CI", 67], ["CO", 67], ["CU", 67], ["GE", 67], ["GR", 67], ["GU", 67], ["GI", 67], ["HU", 67],
//     ["HE", 67], ["JA", 67], ["LC", 67], ["LR", 67], ["LP", 67], ["LE", 67], ["LI", 67], ["LU", 67],
//     ["MA", 67], ["ME", 67], ["MU", 67], ["NA", 67], ["OR", 67], ["PA", 67], ["PO", 67], ["SA", 67], ["SC", 67], ["SE", 67], ["SV", 67],
//     ["SO", 67], ["TA", 67], ["TE", 67], ["TO", 67], ["VA", 67], ["VL", 67], ["BI", 67], ["ZA", 67], ["ZR", 67]]
// }
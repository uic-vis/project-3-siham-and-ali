import total_crimes_data from "../Total.json" assert {type: 'json'};
import theft_data from "../Theft.json" assert {type: 'json'};
import narcotics_data from "../Narcotics.json" assert {type: 'json'};
import weapons_data from "../Weapons.json" assert {type: 'json'};
import kidnapping_data from "../Kidnapping.json" assert {type: 'json'};
import sexual_assault_data from "../Sexual Assault.json" assert {type: 'json'};
import {BarChart} from './barchart.js';
import {LineChart} from './linechart.js';
import {create_visualtizations_2} from './project3.js';
import {create_visualtizations_3} from "./project2.js";

let current_layer_val;
let current_layer;
let current_data;
let current_value_count;

let margin = {top: 50, right: 0, bottom: 50, left: 50};
let chart_width = 600;
let chart_height = 500;

let bar_chart;
let bar_chart_svg = d3.selectAll('#single-community')
                      .append('svg')
                      .attr('width', chart_width + margin.left + margin.right)
                      .attr('height', chart_height + margin.top + margin.bottom);

let line_chart;
let community_history = new Set();
chart_width = 800
let line_chart_svg = d3.selectAll('#comparison')
                       .append('svg')
                       .attr('width', chart_width + margin.left + margin.right)
                       .attr('height', chart_height + margin.top + margin.bottom)

let type_ = "Description";
let cScale;
let N_V_map;

function create_visualtizations() {
    var map = L.map('chicago-map', {minZoom: 10, maxZoom: 19, layers: []})
               .setView([41.8338, -87.7327], 10);

    var base_layer = L.geoJson(communityData, {style: {
                fillColor: "white",
                weight: 0.5,
                fillOpacity: 1.0,
                color: "black",
            }}).addTo(map);

    // ADD STREETS DATA LATER
    var total_crimes_layer = L.geoJson(communityData, {onEachFeature: selection});
    var theft_layer = L.geoJson(communityData, {onEachFeature: selection});
    var narcotics_layer = L.geoJson(communityData, {onEachFeature: selection});
    var weapons_layer = L.geoJson(communityData, {onEachFeature: selection});
    var kidnapping_layer = L.geoJson(communityData, {onEachFeature: selection});
    var sexual_assault_layer = L.geoJson(communityData, {onEachFeature: selection});

    var crimes_overlay = {
        "Total Crimes": total_crimes_layer,
        "Theft": theft_layer,
        "Narcotics": narcotics_layer,
        "Weapons": weapons_layer,
        "Kidnapping": kidnapping_layer,
        "Sexual Assault": sexual_assault_layer
    };

    var layerControl = L.control.layers(crimes_overlay).addTo(map);

    map.on('baselayerchange', function (e) {
        if (e.layer._leaflet_id == 182) {
            current_layer_val = 'Total Crimes'
         }
        if (e.layer._leaflet_id == 260) {
            current_layer_val = 'Theft'
         }
        if (e.layer._leaflet_id == 338) {
            current_layer_val = 'Narcotics'
        }
        if (e.layer._leaflet_id == 416) {
            current_layer_val = 'Weapons'
        }
        if (e.layer._leaflet_id == 494) {
            current_layer_val = 'Kidnapping'
        }
        if (e.layer._leaflet_id == 572) {
            current_layer_val = 'Sexual Assault'
        }
        bar_chart_svg.selectAll("*").remove();
        line_chart_svg.selectAll("*").remove();
        community_history.clear()
        update_layer();
    });

    function update_layer() {
        if (current_layer_val == 'Total Crimes') {
            current_layer = total_crimes_layer;
            current_data = total_crimes_data;
            type_ = "Primary Type"
        }
        if (current_layer_val == 'Theft') {
            current_layer = theft_layer;
            current_data = theft_data;
        }
        if (current_layer_val == 'Narcotics') {
            current_layer = narcotics_layer;
            current_data = narcotics_data;
        }
        if (current_layer_val == 'Weapons') {
            current_layer = weapons_layer;
            current_data = weapons_data;
        }
        if (current_layer_val == 'Kidnapping') {
            current_layer = kidnapping_layer;
            current_data = kidnapping_data;
        }
        if (current_layer_val == 'Sexual Assault') {
            current_layer = sexual_assault_layer;
            current_data = sexual_assault_data;
        }

        current_value_count = get_value_counts(current_data);
        generate_mapping(current_value_count);
        generate_color_scale(current_value_count);
        set_layer_style();

    }

    function get_value_counts(crime_data) {
        var crimes_total = d3.rollup(crime_data, group => group.length, d => d["Community Area"]);
        crime_data = Object.fromEntries(crimes_total);
        return crime_data
    }

    function generate_mapping(data_value_count) {
        const N = Object.keys(data_value_count)
        const V = Object.values(data_value_count)
        N_V_map = new d3.InternMap(N.map((id, i) => [id, V[i]]))
    }

    function generate_color_scale(data_value_count) {        
        cScale = d3.scaleSequential(d3.interpolateRdPu)
                   .domain(d3.extent(Object.values(data_value_count)));
    }

    function set_layer_style() {
        current_layer.eachLayer(function (layer) {
            layer.setStyle({
                fillColor: cScale(N_V_map.get(layer.feature.properties.area_num_1)),
                fillOpacity: 1.0,
                color: "black",
                weight: 0.5
            })
        });
    }

    function selection(feature, layer) {
        layer.on({
            mouseover: highlight_community,
            mouseout: reset_highlight,
            click: zoom_in
        });
    }

    function highlight_community(feature) {
        var layer = feature.target;
        layer.setStyle({fillColor:"blue", fillOpacity: 0.6, weight: 0.5});
    }

    function reset_highlight(feature) {
        var layer = feature.target;

        layer.setStyle({
            fillColor: cScale(N_V_map.get(layer.feature.properties.area_num_1)),
            fillOpacity: 1.0,
            color: "black",
            weight: 0.5
        })
    }

    function zoom_in(feature) {
        bar_chart_svg.selectAll("*").remove();
        // map.setView([feature.latlng.lat, feature.latlng.lng], 13)

        var layer = feature.target;
        layer.bindPopup("Community Name:" + layer.feature.properties.community + '<br />' +
                        "Total Crime:" + N_V_map.get(layer.feature.properties.area_num_1))
             .openPopup();

        line_chart_svg.selectAll("*").remove();
        bar_chart = new BarChart(current_data, "Community Area", type_, bar_chart_svg)
        line_chart = new LineChart(current_data, "Community Area", type_, line_chart_svg)

        bar_chart.add_data(layer.feature.properties)
        community_history.add(layer.feature.properties)
        line_chart.add_data(community_history)
    }
}

function init() {
    create_visualtizations()
    create_visualtizations_2()
    create_visualtizations_3()
}

window.onload = init;
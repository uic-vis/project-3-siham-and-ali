import theft_data from "../Theft.json" assert {type: 'json'};
import narcotics_data from "../Narcotics.json" assert {type: 'json'};
import weapons_data from "../Weapons.json" assert {type: 'json'};
import kidnapping_data from "../Kidnapping.json" assert {type: 'json'};
import sexual_assault_data from "../Sexual Assault.json" assert {type: 'json'};

let current_layer_val;
let current_layer;
let current_data;
let current_value_count;

let cScale;
let N_V_map;

function create_chicago_map() {
    var map = L.map('chicago-map', {minZoom: 10, maxZoom: 19, layers: []})
               .setView([41.8338, -87.7327], 10);

    var base_layer = L.geoJson(communityData, {style: {
                fillColor: "white",
                weight: 0.5,
                color: "black",
            }}).addTo(map);

    // VERFIY PLOTS LATER BY CHECKING WITH GUNS DATA PLOT FROM 2001
    var total_crimes = L.geoJson(communityData, {onEachFeature: selection});
    var theft_layer = L.geoJson(communityData, {onEachFeature: selection});
    var narcotics_layer = L.geoJson(communityData, {onEachFeature: selection});
    var weapons_layer = L.geoJson(communityData, {onEachFeature: selection});
    var kidnapping_layer = L.geoJson(communityData, {onEachFeature: selection});
    var sexual_assault_layer = L.geoJson(communityData, {onEachFeature: selection});

    var crimes_overlay = {
        // "Total Crimes": total_crimes,
        "Theft": theft_layer,
        "Narcotics": narcotics_layer,
        "Weapons": weapons_layer,
        "Kidnapping": kidnapping_layer,
        "Sexual Assault": sexual_assault_layer
    };

    var layerControl = L.control.layers(crimes_overlay).addTo(map);

    map.on('baselayerchange', function (e) {
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

        update_layer();
    });

    function update_layer() {
        if (current_layer_val == 'Theft') {
            current_layer = theft_layer;
            current_data = theft_data;}
        
        if (current_layer_val == 'Narcotics') {
            current_layer = narcotics_layer;
            current_data = narcotics_data;}
        
        if (current_layer_val == 'Weapons') {
            current_layer = weapons_layer;
            current_data = weapons_data;}
        
        if (current_layer_val == 'Kidnapping') {
            current_layer = kidnapping_layer;
            current_data = kidnapping_data;}
        
        if (current_layer_val == 'Sexual Assault') {
            current_layer = sexual_assault_layer;
            current_data = sexual_assault_data;}

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
            click: zoom_in,
            mouseup: zoom_out
        });
    }

    function highlight_community(feature) {
        var layer = feature.target;
        layer.setStyle({fillColor:"blue", fillOpacity: 0.6, weight: 0.5});
    }

    function reset_highlight(feature) {
        var layer = feature.target;

        // COULDN'T RESET STYLE
        layer.setStyle({
            fillColor: cScale(N_V_map.get(layer.feature.properties.area_num_1)),
            fillOpacity: 1.0,
            color: "black",
            weight: 0.5
        })
    }

    function zoom_in(feature) {
        map.setView([feature.latlng.lat, feature.latlng.lng], 13)
        var layer = feature.target;
        layer.bindPopup("Community Name:" + layer.feature.properties.community + '<br />' +
                        "Total Crime:" + N_V_map.get(layer.feature.properties.area_num_1))
             .openPopup();
    }

    function zoom_out(feature) {
        map.setView([41.8338, -87.7327], 10);
    }

}

function init() {
    create_chicago_map()
}

window.onload = init;